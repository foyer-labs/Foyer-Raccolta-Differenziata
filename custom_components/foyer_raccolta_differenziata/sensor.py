"""I sensori: oggi, domani e il prossimo ritiro di ogni tipologia (SPEC §9.2)."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import testi
from .const import DOMINIO
from .coordinatore import Coordinatore
from .core.viste import confermato, del_giorno, prossimo
from .entita import EntitaRaccolta


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinatore: Coordinatore = entry.runtime_data
    async_add_entities(
        [
            SensoreGiorno(coordinatore, "oggi", 0),
            SensoreGiorno(coordinatore, "domani", 1),
        ]
    )

    presenti: set[str] = set()

    @callback
    def _allinea_tipologie() -> None:
        """Le entità per tipologia nascono e spariscono con la tipologia."""
        attuali = {t.id for t in coordinatore.tipologie}
        if not coordinatore.disponibile:
            return
        nuove = attuali - presenti
        if nuove:
            presenti.update(nuove)
            async_add_entities(SensoreProssimo(coordinatore, t) for t in sorted(nuove))
        registro = er.async_get(hass)
        for tolta in presenti - attuali:
            presenti.discard(tolta)
            entity_id = registro.async_get_entity_id(
                "sensor", DOMINIO, f"{entry.entry_id}_prossimo_{tolta}"
            )
            if entity_id:
                registro.async_remove(entity_id)

    _allinea_tipologie()
    entry.async_on_unload(coordinatore.ascolta(_allinea_tipologie))


class SensoreGiorno(EntitaRaccolta, SensorEntity):
    """Le tipologie che passano oggi (o domani), per nome."""

    def __init__(self, coordinatore: Coordinatore, chiave: str, scarto: int) -> None:
        super().__init__(coordinatore, chiave)
        self._attr_translation_key = chiave
        self._scarto = scarto

    def _giorno(self) -> date:
        return self.coordinatore.oggi + timedelta(days=self._scarto)

    def _ritiri(self):
        if self.coordinatore.risultato is None:
            return ()
        return del_giorno(self.coordinatore.risultato, self._giorno())

    @property
    def native_value(self) -> str:
        ritiri = self._ritiri()
        if not ritiri:
            return testi.NESSUNO
        return ", ".join(self.descrivi(r)["nome"] for r in ritiri)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        ritiri = self._ritiri()
        conferme = self.coordinatore.conferme
        return {
            "data": self._giorno().isoformat(),
            "tipologie": [r.tipologia for r in ritiri],
            "ritiri": [self.descrivi(r) for r in ritiri],
            "confermati": [r.tipologia for r in ritiri if confermato(r, conferme)],
        }


class SensoreProssimo(EntitaRaccolta, SensorEntity):
    """La data del prossimo ritiro di una tipologia, entro l'orizzonte."""

    _attr_device_class = SensorDeviceClass.DATE
    _attr_translation_key = "prossimo"

    def __init__(self, coordinatore: Coordinatore, tipologia: str) -> None:
        super().__init__(coordinatore, f"prossimo_{tipologia}")
        self._tipologia = tipologia
        self._aggiorna_nome()

    def _aggiorna_nome(self) -> None:
        tipologia = self.coordinatore.tipologia(self._tipologia)
        nome = tipologia.nome if tipologia else self._tipologia
        # Il nome si imposta qui e non dalle traduzioni: Home Assistant mette in
        # cache il nome tradotto, e una tipologia rinominata resterebbe col nome
        # vecchio fino al riavvio.
        self._attr_name = testi.prossimo_ritiro(nome)

    @callback
    def _al_ricalcolo(self) -> None:
        if self.coordinatore.tipologia(self._tipologia) is None:
            return
        self._aggiorna_nome()
        super()._al_ricalcolo()

    def _ritiro(self):
        if self.coordinatore.risultato is None:
            return None
        return prossimo(
            self.coordinatore.risultato, self._tipologia, self.coordinatore.oggi
        )

    @property
    def icon(self) -> str | None:
        tipologia = self.coordinatore.tipologia(self._tipologia)
        return tipologia.icona if tipologia else None

    @property
    def native_value(self) -> date | None:
        ritiro = self._ritiro()
        return ritiro.data if ritiro else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        ritiro = self._ritiro()
        if ritiro is None:
            return {"giorni_mancanti": None}
        return {
            "giorni_mancanti": (ritiro.data - self.coordinatore.oggi).days,
            **self.descrivi(ritiro),
        }
