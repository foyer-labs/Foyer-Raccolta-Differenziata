"""Il sensore "da esporre": finestra aperta e nessuno ha confermato (SPEC §9.2)."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .const import DOMINIO
from .coordinatore import Coordinatore
from .core.piattaforma import Stato, prossimo_cambio, stato
from .core.viste import da_esporre
from .entita import EntitaRaccolta

CHIAVE_PIATTAFORMA = "piattaforma_ecologica"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinatore: Coordinatore = entry.runtime_data
    async_add_entities([SensoreDaEsporre(coordinatore)])

    # Il sensore della piattaforma nasce quando si inseriscono gli orari e sparisce
    # quando si tolgono (decisione 66), come i sensori delle tipologie.
    presente = [False]
    registro = er.async_get(hass)
    unique_id = f"{entry.entry_id}_{CHIAVE_PIATTAFORMA}"

    @callback
    def _allinea() -> None:
        if not coordinatore.disponibile:
            return
        configurata = coordinatore.config.piattaforma is not None
        if configurata and not presente[0]:
            presente[0] = True
            async_add_entities([SensorePiattaforma(coordinatore)])
        elif not configurata:
            presente[0] = False
            entity_id = registro.async_get_entity_id(
                "binary_sensor", DOMINIO, unique_id
            )
            if entity_id:
                registro.async_remove(entity_id)

    _allinea()
    entry.async_on_unload(coordinatore.ascolta(_allinea))


class SensoreDaEsporre(EntitaRaccolta, BinarySensorEntity):
    """Acceso finché c'è un sacco da mettere fuori.

    Non tiene conto della sospensione dei promemoria: quella riguarda le notifiche,
    non i fatti. Il coordinatore ricalcola a ogni apertura e chiusura di finestra.
    """

    _attr_translation_key = "da_esporre"

    def __init__(self, coordinatore: Coordinatore) -> None:
        super().__init__(coordinatore, "da_esporre")

    def _ritiri(self):
        if self.coordinatore.risultato is None:
            return ()
        return da_esporre(
            self.coordinatore.risultato, dt_util.now(), self.coordinatore.conferme
        )

    @property
    def is_on(self) -> bool:
        return bool(self._ritiri())

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        ritiri = self._ritiri()
        return {
            "ritiri": [self.descrivi(r) for r in ritiri],
            "fine_finestra": (
                min(r.fine_esposizione for r in ritiri).isoformat() if ritiri else None
            ),
        }


class SensorePiattaforma(EntitaRaccolta, BinarySensorEntity):
    """Acceso quando la piattaforma ecologica è aperta (decisione 66).

    Non disponibile quando l'orario di oggi non è indicato: non sa, e non dice
    "chiusa" (INV-2). Si riprogramma da solo all'apertura, alla chiusura e a
    mezzanotte.
    """

    _attr_translation_key = CHIAVE_PIATTAFORMA

    def __init__(self, coordinatore: Coordinatore) -> None:
        super().__init__(coordinatore, CHIAVE_PIATTAFORMA)
        self._timer: CALLBACK_TYPE | None = None

    def _stato(self) -> Stato | None:
        config = self.coordinatore.config
        if config is None or config.piattaforma is None:
            return None
        return stato(
            config.piattaforma, dt_util.now(), self.coordinatore.fuso, config.patrono
        )

    @property
    def available(self) -> bool:
        attuale = self._stato()
        return super().available and attuale is not None and attuale.aperta is not None

    @property
    def is_on(self) -> bool | None:
        attuale = self._stato()
        return attuale.aperta if attuale else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        attuale = self._stato()
        config = self.coordinatore.config
        return {
            "nome": config.piattaforma.nome if config and config.piattaforma else None,
            "chiude_alle": attuale.chiude.isoformat()
            if attuale and attuale.chiude
            else None,
            "apre_alle": attuale.apre.isoformat() if attuale and attuale.apre else None,
        }

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self._programma()

    async def async_will_remove_from_hass(self) -> None:
        if self._timer is not None:
            self._timer()
            self._timer = None

    @callback
    def _al_ricalcolo(self) -> None:
        self._programma()
        super()._al_ricalcolo()

    @callback
    def _programma(self) -> None:
        if self._timer is not None:
            self._timer()
            self._timer = None
        config = self.coordinatore.config
        if config is None or config.piattaforma is None:
            return
        quando = prossimo_cambio(
            config.piattaforma, dt_util.now(), self.coordinatore.fuso, config.patrono
        )
        self._timer = async_track_point_in_time(self.hass, self._al_confine, quando)

    @callback
    def _al_confine(self, _ora: datetime) -> None:
        self._timer = None
        self._programma()
        self.async_write_ha_state()
