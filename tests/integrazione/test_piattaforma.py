"""La piattaforma ecologica in Home Assistant: il sensore e i dati per le card."""

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.foyer_raccolta_differenziata.const import DOMINIO

from .conftest import configurazione, installa

ROMA = ZoneInfo("Europe/Rome")
SENSORE = "binary_sensor.raccolta_differenziata_piattaforma_ecologica"

PIATTAFORMA = {
    "nome": "Isola ecologica",
    "nota": "Via Roma 1",
    "periodi": [
        {
            "id": "p1",
            "dal": "2026-01-01",
            "al": "2026-12-31",
            # Lunedì e mercoledì 08-12, sabato 08-12 e 14-18.
            "settimana": [
                [["08:00", "12:00"]],
                [],
                [["08:00", "12:00"]],
                [],
                [],
                [["08:00", "12:00"], ["14:00", "18:00"]],
                [],
            ],
        }
    ],
    "eccezioni": [
        {"id": "e1", "data": "2026-09-30", "tipo": "chiusa", "nota": "Inventario"}
    ],
}


def _a(freezer, testo: str) -> datetime:
    istante = datetime.fromisoformat(testo).replace(tzinfo=ROMA)
    freezer.move_to(istante)
    return istante


async def test_il_sensore_segue_gli_orari(hass, hass_storage, freezer):
    # Lunedì 28 settembre 2026 alle 07:59.
    _a(freezer, "2026-09-28T07:59:00")
    await installa(hass, hass_storage, configurazione(piattaforma=PIATTAFORMA))
    stato = hass.states.get(SENSORE)
    assert stato.state == STATE_OFF
    assert stato.attributes["apre_alle"] == "2026-09-28T08:00:00+02:00"
    assert stato.attributes["nome"] == "Isola ecologica"

    async_fire_time_changed(hass, _a(freezer, "2026-09-28T08:00:01"))
    await hass.async_block_till_done()
    stato = hass.states.get(SENSORE)
    assert stato.state == STATE_ON
    assert stato.attributes["chiude_alle"] == "2026-09-28T12:00:00+02:00"

    async_fire_time_changed(hass, _a(freezer, "2026-09-28T12:00:01"))
    await hass.async_block_till_done()
    stato = hass.states.get(SENSORE)
    assert stato.state == STATE_OFF
    # Mercoledì 30 è chiusa per l'eccezione: riapre sabato 3 ottobre.
    assert stato.attributes["apre_alle"] == "2026-10-03T08:00:00+02:00"


async def test_fuori_dai_periodi_non_e_disponibile(hass, hass_storage, freezer):
    _a(freezer, "2027-01-04T09:00:00")
    await installa(hass, hass_storage, configurazione(piattaforma=PIATTAFORMA))
    assert hass.states.get(SENSORE).state == STATE_UNAVAILABLE


async def test_il_sensore_nasce_e_sparisce_con_gli_orari(
    hass, hass_storage, hass_ws_client
):
    # Senza orologio fermo: il gettone del client nasce con l'ora vera.
    await installa(hass, hass_storage)
    assert hass.states.get(SENSORE) is None

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": f"{DOMINIO}/config/salva",
            "configurazione": configurazione(piattaforma=PIATTAFORMA),
            "revisione": 3,
        }
    )
    assert (await client.receive_json())["result"]["salvato"]
    await hass.async_block_till_done()
    assert hass.states.get(SENSORE) is not None

    await client.send_json_auto_id(
        {
            "type": f"{DOMINIO}/config/salva",
            "configurazione": configurazione(revisione=4),
            "revisione": 4,
        }
    )
    assert (await client.receive_json())["result"]["salvato"]
    await hass.async_block_till_done()
    assert hass.states.get(SENSORE) is None


async def test_le_card_ricevono_gli_orari(hass, hass_storage, hass_ws_client):
    await installa(hass, hass_storage, configurazione(piattaforma=PIATTAFORMA))
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": f"{DOMINIO}/ritiri", "dal": "2026-09-28", "al": "2026-09-28"}
    )
    dati = (await client.receive_json())["result"]["piattaforma"]
    assert dati["nome"] == "Isola ecologica"
    assert len(dati["giorni"]) == 14
    assert {"data", "fasce", "motivo", "festivo", "nota"} <= set(dati["giorni"][0])


async def test_senza_orari_le_card_non_ricevono_nulla(
    hass, hass_storage, hass_ws_client
):
    await installa(hass, hass_storage)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": f"{DOMINIO}/ritiri", "dal": "2026-09-28", "al": "2026-09-28"}
    )
    assert (await client.receive_json())["result"]["piattaforma"] is None
