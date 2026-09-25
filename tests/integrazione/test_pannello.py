"""Il pannello, la barra laterale e il Configura (SPEC §9.1, §10.1.1)."""

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from homeassistant.components.frontend import DATA_PANELS
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import device_registry as dr

from custom_components.foyer_raccolta_differenziata.const import (
    DOMINIO,
    ELEMENTO_PANNELLO,
    URL_PANNELLO,
)

from .conftest import installa

ROMA = ZoneInfo("Europe/Rome")


def _pannello(hass):
    return hass.data.get(DATA_PANELS, {}).get(URL_PANNELLO)


async def test_il_pannello_e_registrato_per_gli_amministratori(
    hass, hass_storage, freezer
):
    freezer.move_to(datetime(2026, 9, 23, 12, tzinfo=ROMA))
    await installa(hass, hass_storage)

    pannello = _pannello(hass)
    assert pannello is not None
    assert pannello.require_admin
    assert pannello.sidebar_title == "Raccolta"
    assert pannello.show_in_sidebar
    assert pannello.config["_panel_custom"]["name"] == ELEMENTO_PANNELLO
    assert "raccolta-pannello.js?v=" in pannello.config["_panel_custom"]["module_url"]


async def test_nascondere_dal_configura_toglie_solo_dalla_barra(
    hass, hass_storage, freezer
):
    freezer.move_to(datetime(2026, 9, 23, 12, tzinfo=ROMA))
    voce = await installa(hass, hass_storage)

    flusso = await hass.config_entries.options.async_init(voce.entry_id)
    assert flusso["type"] is FlowResultType.FORM
    fatto = await hass.config_entries.options.async_configure(
        flusso["flow_id"], {"mostra_barra_laterale": False}
    )
    await hass.async_block_till_done()

    assert fatto["type"] is FlowResultType.CREATE_ENTRY
    pannello = _pannello(hass)
    assert pannello is not None, "nascosto, il pannello resta raggiungibile"
    assert not pannello.show_in_sidebar

    flusso = await hass.config_entries.options.async_init(voce.entry_id)
    await hass.config_entries.options.async_configure(
        flusso["flow_id"], {"mostra_barra_laterale": True}
    )
    await hass.async_block_till_done()
    assert _pannello(hass).show_in_sidebar


async def test_nascondere_dal_pannello(hass, hass_storage, hass_ws_client):
    # Senza orologio congelato: il token del client di prova nasce con l'ora vera.
    voce = await installa(hass, hass_storage)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": f"{DOMINIO}/barra_laterale", "mostra": False}
    )
    assert (await client.receive_json())["success"]
    await hass.async_block_till_done()

    assert voce.options["mostra_barra_laterale"] is False
    assert not _pannello(hass).show_in_sidebar


async def test_il_dispositivo_porta_al_pannello(hass, hass_storage, freezer):
    freezer.move_to(datetime(2026, 9, 23, 12, tzinfo=ROMA))
    voce = await installa(hass, hass_storage)

    (dispositivo,) = dr.async_entries_for_config_entry(
        dr.async_get(hass), voce.entry_id
    )

    assert dispositivo.configuration_url == f"homeassistant://{URL_PANNELLO}"
    assert dispositivo.name == "Raccolta differenziata"


async def test_rimuovere_l_integrazione_toglie_il_pannello(hass, hass_storage, freezer):
    freezer.move_to(datetime(2026, 9, 23, 12, tzinfo=ROMA))
    voce = await installa(hass, hass_storage)

    await hass.config_entries.async_remove(voce.entry_id)
    await hass.async_block_till_done()

    assert _pannello(hass) is None


async def test_le_card_si_caricano_su_ogni_pagina(hass, hass_storage, freezer):
    """Decisione 46: nessuna risorsa Lovelace da aggiungere a mano."""
    from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL

    freezer.move_to(datetime(2026, 9, 23, 12, tzinfo=ROMA))
    await installa(hass, hass_storage)

    moduli = hass.data[DATA_EXTRA_MODULE_URL].urls
    assert any("/raccolta-card.js?v=" in url for url in moduli)
