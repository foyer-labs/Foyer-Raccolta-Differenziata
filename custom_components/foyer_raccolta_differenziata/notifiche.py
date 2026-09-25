"""Esecutore e schedulatore dei promemoria (SPEC §8.7).

`core.promemoria.decidi` stabilisce cosa inviare; qui si manda, si ascoltano i
pulsanti delle notifiche e si fissa il timer. `decidi` gira ogni minuto, all'istante
previsto del prossimo invio e a ogni evento: così l'ultimo istante di attività è
sempre al massimo di un minuto fa, e dopo un riavvio si recupera ciò che serve
(SPEC §8.6).
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import CALLBACK_TYPE, Context, Event, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_time_interval,
)
from homeassistant.util import dt as dt_util

from . import testi
from .core.promemoria import (
    Conferma,
    Evento,
    Invio,
    Rinvio,
    carica_promemoria,
    da_confermare_col_pulsante,
    decidi,
)

if TYPE_CHECKING:
    from .coordinatore import Coordinatore

_LOGGER = logging.getLogger(__name__)

AZIONE_ESPOSTO = "RACCOLTA_ESPOSTO"
AZIONE_RINVIA = "RACCOLTA_RINVIA"
EVENTO_AZIONE = "mobile_app_notification_action"
SECONDI_SALVATAGGIO = 10


class GestorePromemoria:
    def __init__(self, hass: HomeAssistant, coordinatore: Coordinatore) -> None:
        self.hass = hass
        self.coordinatore = coordinatore
        self._annulla: list[CALLBACK_TYPE] = []
        self._timer: CALLBACK_TYPE | None = None

    # --- ciclo di vita -------------------------------------------------------------

    @callback
    def avvia(self) -> None:
        self._annulla.append(self.coordinatore.ascolta(self.decidi))
        self._annulla.append(
            async_track_time_interval(
                self.hass, self._ogni_minuto, timedelta(minutes=1)
            )
        )
        self._annulla.append(self.hass.bus.async_listen(EVENTO_AZIONE, self._azione))
        self.decidi()

    @callback
    def arresta(self) -> None:
        for annulla in self._annulla:
            annulla()
        self._annulla.clear()
        if self._timer is not None:
            self._timer()
            self._timer = None

    # --- decisione -----------------------------------------------------------------

    @property
    def _stato(self) -> dict[str, Any]:
        return self.coordinatore.archivi.stato

    @callback
    def decidi(self, evento: Evento = None) -> bool:
        """Chiama il nucleo, esegue la decisione. Falso se il calendario non c'è."""
        coordinatore = self.coordinatore
        if coordinatore.config is None or coordinatore.risultato is None:
            return False
        ora = dt_util.now()
        decisione = decidi(
            carica_promemoria(coordinatore.archivi.configurazione),
            coordinatore.risultato,
            self._stato,
            evento,
            ora,
            fuso=coordinatore.fuso,
        )
        prima = (self._stato.get("conferme"), self._stato.get("sospensione_manuale"))
        self._stato.update(decisione.stato)
        coordinatore.archivi.archivio_stato.async_delay_save(
            lambda: coordinatore.archivi.stato, SECONDI_SALVATAGGIO
        )
        for scartato in decisione.scartati:
            _LOGGER.info(
                "Promemoria non inviato (%s): %s", scartato.motivo, scartato.chiave
            )
        for invio in decisione.invii:
            self.hass.async_create_task(self._invia(invio), eager_start=False)
        if self._timer is not None:
            self._timer()
            self._timer = None
        if decisione.prossimo is not None:
            self._timer = async_track_point_in_time(
                self.hass, self._al_timer, decisione.prossimo
            )
        dopo = (self._stato.get("conferme"), self._stato.get("sospensione_manuale"))
        if evento is not None and prima != dopo:
            # Una conferma o la sospensione cambiano sensori e card.
            coordinatore.aggiorna()
        return True

    @callback
    def _ogni_minuto(self, _ora: datetime) -> None:
        # Deve restare un callback: senza, Home Assistant lo eseguirebbe in un altro
        # thread, e la decisione tocca stato e timer del ciclo degli eventi.
        self.decidi()

    @callback
    def _al_timer(self, _ora: datetime) -> None:
        self._timer = None
        self.decidi()

    # --- conferme ------------------------------------------------------------------

    async def async_utente(self, context: Context | None) -> str | None:
        if context is None or context.user_id is None:
            return None
        utente = await self.hass.auth.async_get_user(context.user_id)
        return utente.name if utente else None

    async def async_conferma_col_pulsante(self, context: Context | None) -> int:
        """Il pulsante "Esposto" (decisione 32). Restituisce quanti ritiri conferma."""
        coordinatore = self.coordinatore
        if coordinatore.risultato is None:
            return 0
        ritiri = da_confermare_col_pulsante(
            coordinatore.risultato, dt_util.now(), set(coordinatore.conferme)
        )
        if not ritiri:
            _LOGGER.info(
                "Esposto premuto, ma nessun ritiro oggi o domani da confermare"
            )
            return 0
        self.decidi(
            Conferma(
                tuple((r.data, r.tipologia) for r in ritiri),
                await self.async_utente(context),
            )
        )
        return len(ritiri)

    # --- invio ---------------------------------------------------------------------

    def _nomi(self, invio: Invio) -> list[str]:
        nomi = []
        for identificativo in invio.tipologie:
            tipologia = self.coordinatore.tipologia(identificativo)
            nomi.append(tipologia.nome if tipologia else identificativo)
        return nomi

    async def _invia(self, invio: Invio) -> None:
        titolo = testi.TITOLO_VOCE
        messaggio = testi.messaggio(invio.testo, self._nomi(invio), invio.data)
        for destinatario in invio.destinatari:
            try:
                if destinatario.tipo == "entita":
                    await self.hass.services.async_call(
                        "notify",
                        "send_message",
                        {
                            "entity_id": destinatario.id,
                            "title": titolo,
                            "message": messaggio,
                        },
                        blocking=True,
                    )
                    continue
                dati: dict[str, Any] = {
                    "title": titolo,
                    "message": messaggio,
                }
                if destinatario.con_azioni:
                    azioni = [
                        {
                            "action": f"{AZIONE_ESPOSTO}_{invio.gettone}",
                            "title": testi.AZIONE_ESPOSTO,
                        }
                    ]
                    if invio.azioni_rinvio:
                        azioni.append(
                            {
                                "action": (
                                    f"{AZIONE_RINVIA}_{invio.gettone}_{destinatario.chiave}"
                                ),
                                "title": testi.AZIONE_RINVIA,
                            }
                        )
                    # Lo stesso tag per lo stesso giorno: il sollecito sostituisce il
                    # promemoria invece di accumularsi.
                    dati["data"] = {
                        "tag": f"raccolta-{invio.data.isoformat()}",
                        "actions": azioni,
                    }
                await self.hass.services.async_call(
                    "notify", destinatario.id, dati, blocking=True
                )
            except Exception:
                _LOGGER.exception("Promemoria non consegnato a %s", destinatario.chiave)

    # --- pulsanti delle notifiche -----------------------------------------------------

    async def _azione(self, evento: Event) -> None:
        azione = str(evento.data.get("action", ""))
        if azione.startswith(f"{AZIONE_ESPOSTO}_"):
            gettone = azione.removeprefix(f"{AZIONE_ESPOSTO}_")
            fatto = next(
                (
                    v
                    for v in self._stato.get("invii_fatti", [])
                    if v.get("gettone") == gettone
                ),
                None,
            )
            if fatto is None:
                return
            giorno = date.fromisoformat(fatto["data"])
            self.decidi(
                Conferma(
                    tuple((giorno, t) for t in fatto["tipologie"]),
                    await self.async_utente(evento.context),
                )
            )
        elif azione.startswith(f"{AZIONE_RINVIA}_"):
            resto = azione.removeprefix(f"{AZIONE_RINVIA}_")
            gettone, _, destinatario = resto.partition("_")
            if gettone and destinatario:
                self.decidi(Rinvio(gettone, destinatario))
