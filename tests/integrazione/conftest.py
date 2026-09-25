"""Fixture dei test d'integrazione.

Si eseguono con il plugin attivato esplicitamente, così la suite pura non lo carica:

    pytest -p pytest_homeassistant_custom_component tests/integrazione
"""

from __future__ import annotations

from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.foyer_raccolta_differenziata.const import (
    CHIAVE_ARCHIVIO_CONFIGURAZIONE,
    CHIAVE_ARCHIVIO_STATO,
    DOMINIO,
)

DATI_VOCE = {
    "tipologie": ["umido", "carta"],
    "inizio_giorno": "giorno_prima",
    "inizio_ora": "20:00",
    "fine_ora": "06:00",
}


@pytest.fixture(autouse=True)
def integrazioni_personalizzate(enable_custom_integrations):
    """Home Assistant carica custom_components/ solo se glielo si chiede."""
    return


def tipologia(id_: str, nome: str, **altro: Any) -> dict[str, Any]:
    return {
        "id": id_,
        "nome": nome,
        "colore": "#795548",
        "icona": "mdi:food-apple",
        "note": "",
        "esposizione": None,
        **altro,
    }


def settimanale(id_: str, tip: str, giorni: list[int], **altro: Any) -> dict[str, Any]:
    return {
        "id": id_,
        "tipologia": tip,
        "nome": "",
        "ricorrenza": {
            "tipo": "settimanale",
            "ogni": 1,
            "giorni": giorni,
            "ancora": "2026-01-05",
        },
        "periodo": {"tipo": "sempre"},
        **altro,
    }


def configurazione(**altro: Any) -> dict[str, Any]:
    """Umido il giovedì, carta il venerdì."""
    base = {
        "revisione": 3,
        "tipologie": [tipologia("umido", "Umido"), tipologia("carta", "Carta")],
        "regole": [settimanale("r1", "umido", [3]), settimanale("r2", "carta", [4])],
        "eccezioni": [],
        "esposizione": {
            "inizio_giorno": "giorno_prima",
            "inizio_ora": "20:00",
            "fine_ora": "06:00",
        },
        "patrono": None,
        "valido_fino_al": None,
        "promemoria": [],
        "solleciti": {"attivi": False, "richiami": 1, "richiamo_dopo": 30},
        "sospensioni": [],
    }
    return {**base, **altro}


def archivio(chiave: str, dati: dict[str, Any]) -> dict[str, Any]:
    return {"version": 1, "minor_version": 1, "key": chiave, "data": dati}


async def installa(
    hass,
    hass_storage,
    config: dict[str, Any] | None = None,
    stato: dict[str, Any] | None = None,
) -> MockConfigEntry:
    """Imposta Roma come fuso, prepara gli archivi e avvia l'integrazione."""
    await hass.config.async_set_time_zone("Europe/Rome")
    hass_storage[CHIAVE_ARCHIVIO_CONFIGURAZIONE] = archivio(
        CHIAVE_ARCHIVIO_CONFIGURAZIONE, config or configurazione()
    )
    if stato is not None:
        hass_storage[CHIAVE_ARCHIVIO_STATO] = archivio(CHIAVE_ARCHIVIO_STATO, stato)
    voce = MockConfigEntry(domain=DOMINIO, data=DATI_VOCE)
    voce.add_to_hass(hass)
    assert await hass.config_entries.async_setup(voce.entry_id)
    await hass.async_block_till_done()
    return voce
