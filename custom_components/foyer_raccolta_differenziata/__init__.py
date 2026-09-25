"""Foyer Raccolta Differenziata: il calendario della raccolta per Home Assistant.

I moduli di Home Assistant si importano dentro le funzioni e non in cima al file:
importare `custom_components.foyer_raccolta_differenziata.core` esegue prima questo
file, e la suite pura deve girare su una macchina dove Home Assistant non è
nemmeno installato (INV-1).
"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    from .archivio import async_carica

    entry.runtime_data = await async_carica(hass, entry)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    from .archivio import async_elimina

    await async_elimina(hass)
