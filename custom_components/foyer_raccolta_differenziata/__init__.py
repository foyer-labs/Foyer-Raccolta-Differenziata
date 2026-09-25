"""Foyer Raccolta Differenziata: il calendario della raccolta per Home Assistant.

I moduli di Home Assistant si importano dentro le funzioni e non in cima al file:
importare `custom_components.foyer_raccolta_differenziata.core` esegue prima questo
file, e la suite pura deve girare su una macchina dove Home Assistant non è
nemmeno installato (INV-1).
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

PIATTAFORME = ["calendar", "sensor", "binary_sensor", "button", "switch"]
_WEBSOCKET = "foyer_raccolta_differenziata_websocket"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    from homeassistant.exceptions import ConfigEntryError

    from .archivio import async_carica
    from .const import DOMINIO
    from .coordinatore import Coordinatore

    try:
        archivi = await async_carica(hass, entry)
    except Exception as errore:
        # INV-2: un archivio illeggibile non diventa un calendario vuoto. Nessuna
        # entità nasce, e la voce di configurazione mostra l'errore.
        _LOGGER.exception("Archivio della raccolta illeggibile")
        raise ConfigEntryError(
            translation_domain=DOMINIO, translation_key="archivio_illeggibile"
        ) from errore

    from .notifiche import GestorePromemoria

    coordinatore = Coordinatore(hass, entry, archivi)
    entry.runtime_data = coordinatore
    coordinatore.gestore = GestorePromemoria(hass, coordinatore)
    coordinatore.avvia()
    coordinatore.gestore.avvia()
    await hass.config_entries.async_forward_entry_setups(entry, PIATTAFORME)

    from . import pannello, websocket

    if not hass.data.get(_WEBSOCKET):
        websocket.async_registra(hass)
        hass.data[_WEBSOCKET] = True
    await pannello.async_registra(hass, entry)
    entry.async_on_unload(entry.add_update_listener(_opzioni_cambiate))
    return True


async def _opzioni_cambiate(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """ "Mostra nella barra laterale" cambiato: si aggiorna solo il pannello."""
    from . import pannello

    await pannello.async_registra(hass, entry)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    scaricata = await hass.config_entries.async_unload_platforms(entry, PIATTAFORME)
    if scaricata:
        entry.runtime_data.gestore.arresta()
        entry.runtime_data.arresta()
    return scaricata


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    from homeassistant.helpers import issue_registry as ir

    from .archivio import async_elimina
    from .const import DOMINIO

    await async_elimina(hass)
    from . import pannello

    pannello.async_rimuovi(hass)
    for problema in list(ir.async_get(hass).issues.values()):
        if problema.domain == DOMINIO:
            ir.async_delete_issue(hass, DOMINIO, problema.issue_id)
