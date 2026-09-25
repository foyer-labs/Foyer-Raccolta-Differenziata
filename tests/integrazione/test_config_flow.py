"""Il config flow (SPEC §9.1) e il primo avvio degli archivi (SPEC §11)."""

from __future__ import annotations

from typing import Any

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers.storage import Store
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.foyer_raccolta_differenziata.const import (
    CHIAVE_ARCHIVIO_CONFIGURAZIONE,
    CHIAVE_ARCHIVIO_STATO,
    DOMINIO,
)

DATI = {
    "tipologie": ["umido", "carta"],
    "inizio_giorno": "giorno_prima",
    "inizio_ora": "20:00",
    "fine_ora": "06:00",
}


async def _avvia_flow(hass: HomeAssistant) -> dict[str, Any]:
    return await hass.config_entries.flow.async_init(
        DOMINIO, context={"source": config_entries.SOURCE_USER}
    )


async def test_il_modulo_propone_tutti_i_preset_e_la_finestra_predefinita(hass):
    risultato = await _avvia_flow(hass)

    assert risultato["type"] is FlowResultType.FORM
    assert risultato["step_id"] == "user"
    predefiniti = {
        str(chiave): chiave.default() for chiave in risultato["data_schema"].schema
    }
    assert predefiniti == {
        "tipologie": ["umido", "carta", "plastica", "vetro", "secco", "verde"],
        "inizio_giorno": "giorno_prima",
        "inizio_ora": "20:00",
        "fine_ora": "06:00",
    }


async def test_crea_la_voce_con_gli_orari_in_hh_mm(hass):
    risultato = await _avvia_flow(hass)
    risultato = await hass.config_entries.flow.async_configure(
        risultato["flow_id"],
        {**DATI, "inizio_ora": "20:30:00", "fine_ora": "06:00:00"},
    )
    await hass.async_block_till_done()

    assert risultato["type"] is FlowResultType.CREATE_ENTRY
    assert risultato["title"] == "Raccolta differenziata"
    assert risultato["data"] == {**DATI, "inizio_ora": "20:30"}


async def test_finestra_non_valida_resta_sul_modulo(hass):
    risultato = await _avvia_flow(hass)
    risultato = await hass.config_entries.flow.async_configure(
        risultato["flow_id"],
        {
            **DATI,
            "inizio_giorno": "giorno_stesso",
            "inizio_ora": "08:00:00",
            "fine_ora": "06:00:00",
        },
    )

    assert risultato["type"] is FlowResultType.FORM
    assert risultato["errors"] == {"base": "fine_prima_di_inizio"}


async def test_una_sola_istanza(hass):
    MockConfigEntry(domain=DOMINIO, data=DATI).add_to_hass(hass)

    risultato = await _avvia_flow(hass)

    assert risultato["type"] is FlowResultType.ABORT
    assert risultato["reason"] == "single_instance_allowed"


async def test_il_primo_avvio_crea_gli_archivi_dalle_scelte(hass, hass_storage):
    voce = MockConfigEntry(domain=DOMINIO, data=DATI)
    voce.add_to_hass(hass)

    assert await hass.config_entries.async_setup(voce.entry_id)
    await hass.async_block_till_done()

    configurazione = hass_storage[CHIAVE_ARCHIVIO_CONFIGURAZIONE]["data"]
    assert [t["nome"] for t in configurazione["tipologie"]] == ["Umido", "Carta"]
    assert configurazione["esposizione"] == {
        "inizio_giorno": "giorno_prima",
        "inizio_ora": "20:00",
        "fine_ora": "06:00",
    }
    assert configurazione["solleciti"]["attivi"] is False
    assert hass_storage[CHIAVE_ARCHIVIO_STATO]["data"]["conferme"] == []


async def test_un_riavvio_non_ricrea_la_configurazione(hass, hass_storage):
    """Le scelte del config flow valgono solo la prima volta: poi comanda l'archivio."""
    hass_storage[CHIAVE_ARCHIVIO_CONFIGURAZIONE] = {
        "version": 1,
        "minor_version": 1,
        "key": CHIAVE_ARCHIVIO_CONFIGURAZIONE,
        "data": {"revisione": 7, "tipologie": [{"id": "x", "nome": "Pannolini"}]},
    }
    voce = MockConfigEntry(domain=DOMINIO, data=DATI)
    voce.add_to_hass(hass)

    assert await hass.config_entries.async_setup(voce.entry_id)
    await hass.async_block_till_done()

    assert voce.runtime_data.configurazione["revisione"] == 7
    assert voce.runtime_data.configurazione["tipologie"][0]["nome"] == "Pannolini"


async def test_rimuovere_l_integrazione_cancella_gli_archivi(hass, hass_storage):
    voce = MockConfigEntry(domain=DOMINIO, data=DATI)
    voce.add_to_hass(hass)
    assert await hass.config_entries.async_setup(voce.entry_id)
    await hass.async_block_till_done()

    await hass.config_entries.async_remove(voce.entry_id)
    await hass.async_block_till_done()

    for chiave in (CHIAVE_ARCHIVIO_CONFIGURAZIONE, CHIAVE_ARCHIVIO_STATO):
        assert await Store(hass, 1, chiave).async_load() is None
