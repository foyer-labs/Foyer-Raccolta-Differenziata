"""Il coordinatore: tiene il calcolo aggiornato e avvisa le entità (SPEC §9.2).

Calcola i ritiri da oggi per l'orizzonte di SPEC §6.2 e ricalcola:

* a mezzanotte, quando cambia "oggi";
* quando una finestra di esposizione si apre o si chiude;
* a ogni modifica della configurazione o dello stato (conferme, anomalie ignorate).

Se la configurazione salvata non è valida, non calcola nulla: le entità diventano
`unavailable` e compare un problema in Riparazioni. Mai un "Nessuno" non vero (INV-2).
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import date, datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_time_change,
)
from homeassistant.util import dt as dt_util

from .archivio import Archivi
from .const import SEGNALE_AGGIORNATO
from .core.calendario import ORIZZONTE_GIORNI, Anomalia, Risultato, anomalie, calcola
from .core.modello import Configurazione, Tipologia, carica
from .core.validazione import Problema, problemi
from .core.viste import Conferme, conferme_da_stato, prossimo_cambiamento
from .repairs import aggiorna_problemi

if TYPE_CHECKING:
    from .notifiche import GestorePromemoria

_LOGGER = logging.getLogger(__name__)


class Coordinatore:
    def __init__(
        self, hass: HomeAssistant, entry: ConfigEntry, archivi: Archivi
    ) -> None:
        self.hass = hass
        self.entry = entry
        self.archivi = archivi
        self.config: Configurazione | None = None
        self.problemi: list[Problema] = []
        self.risultato: Risultato | None = None
        self.anomalie: tuple[Anomalia, ...] = ()
        self.oggi: date = dt_util.now().date()
        self._ascoltatori: list[Callable[[], None]] = []
        self._timer_confine: CALLBACK_TYPE | None = None
        self._timer_mezzanotte: CALLBACK_TYPE | None = None
        self._salvataggio = asyncio.Lock()
        # Il gestore dei promemoria, impostato all'avvio dell'integrazione.
        self.gestore: GestorePromemoria

    # --- ciclo di vita -------------------------------------------------------------

    @callback
    def avvia(self) -> None:
        self._carica_modello()
        self._timer_mezzanotte = async_track_time_change(
            self.hass, self._a_mezzanotte, hour=0, minute=0, second=0
        )
        self.aggiorna()

    @callback
    def arresta(self) -> None:
        for annulla in (self._timer_confine, self._timer_mezzanotte):
            if annulla is not None:
                annulla()
        self._timer_confine = self._timer_mezzanotte = None

    @callback
    def _a_mezzanotte(self, _ora: datetime) -> None:
        self.aggiorna()

    @callback
    def _al_confine(self, _ora: datetime) -> None:
        self._timer_confine = None
        self.aggiorna()

    # --- stato -----------------------------------------------------------------------

    @property
    def disponibile(self) -> bool:
        return self.config is not None and self.risultato is not None

    @property
    def fuso(self):
        return dt_util.get_default_time_zone()

    @property
    def conferme(self) -> Conferme:
        return conferme_da_stato(self.archivi.stato.get("conferme", []))

    @property
    def festivi_ignorati(self) -> frozenset[tuple[date, str]]:
        return conferme_da_stato(self.archivi.stato.get("anomalie_ignorate", []))

    @property
    def tipologie(self) -> tuple[Tipologia, ...]:
        return self.config.tipologie if self.config else ()

    def tipologia(self, identificativo: str) -> Tipologia | None:
        return next((t for t in self.tipologie if t.id == identificativo), None)

    def _carica_modello(self) -> None:
        self.problemi = problemi(self.archivi.configurazione)
        if self.problemi:
            _LOGGER.error(
                "Configurazione della raccolta non valida: %s",
                ", ".join(f"{p.percorso}: {p.codice}" for p in self.problemi),
            )
            self.config = None
            return
        self.config = carica(self.archivi.configurazione)

    # --- calcolo ---------------------------------------------------------------------

    def calcola_intervallo(self, dal: date, al: date) -> Risultato | None:
        """I ritiri di un intervallo qualsiasi, per il calendario e le card."""
        if self.config is None:
            return None
        return calcola(self.config, dal, al, self.fuso, self.festivi_ignorati)

    @callback
    def aggiorna(self) -> None:
        """Ricalcola da oggi, ripianifica il prossimo confine, avvisa le entità."""
        ora = dt_util.now()
        self.oggi = ora.date()
        if self._timer_confine is not None:
            self._timer_confine()
            self._timer_confine = None
        try:
            if self.config is None:
                self.risultato, self.anomalie = None, ()
            else:
                self.risultato = self.calcola_intervallo(
                    self.oggi, self.oggi + timedelta(days=ORIZZONTE_GIORNI)
                )
                self.anomalie = anomalie(self.config, self.oggi)
        except Exception:
            # INV-2: un calcolo fallito rende le entità non disponibili, non vuote.
            _LOGGER.exception("Calcolo della raccolta fallito")
            self.risultato, self.anomalie = None, ()

        if self.risultato is not None:
            confine = prossimo_cambiamento(self.risultato, ora)
            if confine is not None:
                self._timer_confine = async_track_point_in_time(
                    self.hass, self._al_confine, confine
                )
        aggiorna_problemi(self.hass, self)
        for ascoltatore in list(self._ascoltatori):
            ascoltatore()
        # Per chi ascolta da fuori (pannello e card via WebSocket): un segnale che non
        # dipende da questo coordinatore, così sopravvive a un ricaricamento.
        async_dispatcher_send(self.hass, SEGNALE_AGGIORNATO)

    @callback
    def ascolta(self, ascoltatore: Callable[[], None]) -> Callable[[], None]:
        self._ascoltatori.append(ascoltatore)

        @callback
        def _rimuovi() -> None:
            if ascoltatore in self._ascoltatori:
                self._ascoltatori.remove(ascoltatore)

        return _rimuovi

    # --- modifiche -------------------------------------------------------------------

    async def async_salva_configurazione(
        self, nuova: dict[str, Any], revisione_letta: int | None = None
    ) -> list[Problema]:
        """Valida e salva una configurazione intera (SPEC §5).

        Una configurazione con problemi non si salva, mai a metà. Se `revisione_letta`
        non è quella attuale, qualcun altro ha salvato nel frattempo: si rifiuta.
        """
        # Un salvataggio alla volta: controllo della revisione e scrittura non si
        # intrecciano con quelli di un'altra scheda aperta.
        async with self._salvataggio:
            attuale = self.archivi.configurazione.get("revisione", 0)
            if revisione_letta is not None and revisione_letta != attuale:
                return [Problema("revisione", "revisione_superata")]
            trovati = problemi(nuova)
            if trovati:
                return trovati
            salvata = {**nuova, "revisione": attuale + 1}
            await self.archivi.archivio_configurazione.async_save(salvata)
            self.archivi.configurazione = salvata
            self._carica_modello()
            if self._pulisci_stato():
                await self.archivi.archivio_stato.async_save(self.archivi.stato)
            self.aggiorna()
            return []

    def _pulisci_stato(self) -> bool:
        """Toglie dallo stato le tipologie che non esistono più (SPEC §4.1).

        Conferme, festivi ignorati e solleciti in attesa di una tipologia eliminata
        non devono restare a comparire nelle card. Vero se qualcosa è cambiato.
        """
        if self.config is None:
            return False
        esistenti = {t.id for t in self.config.tipologie}
        stato = self.archivi.stato
        cambiato = False
        for chiave in ("conferme", "anomalie_ignorate"):
            prima = stato.get(chiave, [])
            dopo = [v for v in prima if v.get("tipologia") in esistenti]
            if len(dopo) != len(prima):
                stato[chiave] = dopo
                cambiato = True
        pendenti = []
        for v in stato.get("pendenti", []):
            tipologie = [t for t in v.get("tipologie", []) if t in esistenti]
            if tipologie != v.get("tipologie"):
                cambiato = True
            if tipologie:
                pendenti.append({**v, "tipologie": tipologie})
        stato["pendenti"] = pendenti
        return cambiato

    async def async_salva_stato(self) -> None:
        await self.archivi.archivio_stato.async_save(self.archivi.stato)
        self.aggiorna()
