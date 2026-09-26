"""Il pulsante "Esposto" (SPEC §8.4, decisione 32)."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMINIO
from .coordinatore import Coordinatore
from .entita import EntitaRaccolta


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([PulsanteEsposto(entry.runtime_data)])


class PulsanteEsposto(EntitaRaccolta, ButtonEntity):
    """Conferma i ritiri da esporre adesso, o quelli di oggi o domani.

    Pensato anche per un pulsante fisico o un tag NFC accanto alla porta.
    """

    _attr_translation_key = "esposto"

    def __init__(self, coordinatore: Coordinatore) -> None:
        super().__init__(coordinatore, "esposto")

    async def async_press(self) -> None:
        confermati = await self.coordinatore.gestore.async_conferma_col_pulsante(
            self._context
        )
        if not confermati:
            raise HomeAssistantError(
                translation_domain=DOMINIO, translation_key="niente_da_confermare"
            )
