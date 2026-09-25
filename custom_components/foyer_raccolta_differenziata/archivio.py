"""Gli archivi persistenti (SPEC §11).

Due `Store` separati: la configurazione, che cambia solo quando l'utente salva, e lo
stato (conferme, invii, rinvii), che cambierà ogni minuto. Separarli evita di
riscrivere la configurazione a ogni conferma.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any
import uuid

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    CHIAVE_ARCHIVIO_CONFIGURAZIONE,
    CHIAVE_ARCHIVIO_STATO,
    CONF_FINE_ORA,
    CONF_INIZIO_GIORNO,
    CONF_INIZIO_ORA,
    CONF_TIPOLOGIE,
    VERSIONE_ARCHIVIO_CONFIGURAZIONE,
    VERSIONE_ARCHIVIO_STATO,
)
from .core.configurazione import configurazione_iniziale, stato_vuoto


def _genera_id() -> str:
    return uuid.uuid4().hex


@dataclass
class Archivi:
    """I due archivi e il loro contenuto caricato."""

    archivio_configurazione: Store[dict[str, Any]]
    archivio_stato: Store[dict[str, Any]]
    configurazione: dict[str, Any]
    stato: dict[str, Any]


def _crea_store(hass: HomeAssistant, chiave: str, versione: int) -> Store:
    return Store(hass, versione, chiave, private=True, atomic_writes=True)


async def async_carica(hass: HomeAssistant, entry: ConfigEntry) -> Archivi:
    """Carica gli archivi; alla prima esecuzione li crea dalle scelte del config flow.

    Un archivio illeggibile solleva un'eccezione e l'installazione non parte: meglio
    un errore visibile che un calendario vuoto spacciato per vero (INV-2).
    """
    archivio_configurazione = _crea_store(
        hass, CHIAVE_ARCHIVIO_CONFIGURAZIONE, VERSIONE_ARCHIVIO_CONFIGURAZIONE
    )
    archivio_stato = _crea_store(hass, CHIAVE_ARCHIVIO_STATO, VERSIONE_ARCHIVIO_STATO)

    configurazione = await archivio_configurazione.async_load()
    if configurazione is None:
        configurazione = configurazione_iniziale(
            entry.data.get(CONF_TIPOLOGIE, []),
            {
                "inizio_giorno": entry.data[CONF_INIZIO_GIORNO],
                "inizio_ora": entry.data[CONF_INIZIO_ORA],
                "fine_ora": entry.data[CONF_FINE_ORA],
            },
            _genera_id,
        )
        await archivio_configurazione.async_save(configurazione)

    stato = await archivio_stato.async_load()
    if stato is None:
        stato = stato_vuoto()
        await archivio_stato.async_save(stato)

    return Archivi(archivio_configurazione, archivio_stato, configurazione, stato)


async def async_elimina(hass: HomeAssistant) -> None:
    """Cancella gli archivi quando l'integrazione viene rimossa."""
    for chiave, versione in (
        (CHIAVE_ARCHIVIO_CONFIGURAZIONE, VERSIONE_ARCHIVIO_CONFIGURAZIONE),
        (CHIAVE_ARCHIVIO_STATO, VERSIONE_ARCHIVIO_STATO),
    ):
        await _crea_store(hass, chiave, versione).async_remove()
