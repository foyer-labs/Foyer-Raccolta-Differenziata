"""Il sensore "da esporre": finestra aperta e nessuno ha confermato (SPEC §9.2)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .coordinatore import Coordinatore
from .core.viste import da_esporre
from .entita import EntitaRaccolta


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([SensoreDaEsporre(entry.runtime_data)])


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
