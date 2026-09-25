"""L'interruttore "Sospendi promemoria" (SPEC §4.8, decisione 11)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .coordinatore import Coordinatore
from .core.promemoria import Sospensione, carica_promemoria, sospeso
from .entita import EntitaRaccolta


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([InterruttoreSospensione(entry.runtime_data)])


class InterruttoreSospensione(EntitaRaccolta, SwitchEntity):
    """Acceso: i promemoria tacciono da subito, finché non lo si spegne.

    Il calendario, i sensori e le card non cambiano: i ritiri continuano a esistere.
    Le vacanze del pannello tacciono i promemoria anche con l'interruttore spento;
    l'attributo `sospeso_ora` dice se in questo momento un promemoria partirebbe.
    """

    _attr_translation_key = "sospendi_promemoria"

    def __init__(self, coordinatore: Coordinatore) -> None:
        super().__init__(coordinatore, "sospendi_promemoria")

    @property
    def available(self) -> bool:
        # La sospensione non dipende dal calcolo: si può accendere anche quando il
        # calendario non è disponibile.
        return True

    @property
    def is_on(self) -> bool:
        return bool(self.coordinatore.archivi.stato.get("sospensione_manuale"))

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        configurazione = self.coordinatore.archivi.configurazione
        return {
            "intervalli": [
                {"dal": v["dal"], "al": v["al"]}
                for v in configurazione.get("sospensioni", [])
            ],
            "sospeso_ora": sospeso(
                carica_promemoria(configurazione)
                if not self.coordinatore.problemi
                else carica_promemoria({}),
                self.coordinatore.archivi.stato,
                dt_util.now(),
            ),
        }

    async def _imposta(self, attiva: bool) -> None:
        gestore = self.coordinatore.gestore
        if not gestore.decidi(Sospensione(attiva)):
            # Senza calendario il nucleo non gira: si salva direttamente.
            self.coordinatore.archivi.stato["sospensione_manuale"] = attiva
            await self.coordinatore.async_salva_stato()
        self.async_write_ha_state()

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._imposta(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._imposta(False)
