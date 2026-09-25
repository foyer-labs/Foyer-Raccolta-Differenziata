"""Le entità della Fase 2 (SPEC §9.2) e i loro aggiornamenti."""

from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from .conftest import configurazione, installa, tipologia

ROMA = ZoneInfo("Europe/Rome")
SENSORE_OGGI = "sensor.raccolta_differenziata_oggi"
SENSORE_DOMANI = "sensor.raccolta_differenziata_domani"
DA_ESPORRE = "binary_sensor.raccolta_differenziata_da_esporre"
CALENDARIO = "calendar.raccolta_differenziata"
PROSSIMO_UMIDO = "sensor.raccolta_differenziata_prossimo_ritiro_umido"
PROSSIMO_CARTA = "sensor.raccolta_differenziata_prossimo_ritiro_carta"


def _a(freezer, testo: str) -> datetime:
    istante = datetime.fromisoformat(testo).replace(tzinfo=ROMA)
    freezer.move_to(istante)
    return istante


async def test_oggi_domani_e_prossimi(hass, hass_storage, freezer):
    # Mercoledì 23 settembre 2026, a mezzogiorno.
    _a(freezer, "2026-09-23T12:00:00")
    await installa(hass, hass_storage)

    assert hass.states.get(SENSORE_OGGI).state == "Nessuno"
    domani = hass.states.get(SENSORE_DOMANI)
    assert domani.state == "Umido"
    assert domani.attributes["tipologie"] == ["umido"]
    assert domani.attributes["ritiri"][0]["fine_esposizione"] == (
        "2026-09-24T06:00:00+02:00"
    )
    assert hass.states.get(PROSSIMO_UMIDO).state == "2026-09-24"
    assert hass.states.get(PROSSIMO_UMIDO).attributes["giorni_mancanti"] == 1
    assert hass.states.get(PROSSIMO_CARTA).state == "2026-09-25"
    assert hass.states.get(DA_ESPORRE).state == STATE_OFF


async def test_da_esporre_si_accende_e_si_spegne_con_la_finestra(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T19:59:00")
    await installa(hass, hass_storage)
    assert hass.states.get(DA_ESPORRE).state == STATE_OFF

    async_fire_time_changed(hass, _a(freezer, "2026-09-23T20:00:01"))
    await hass.async_block_till_done()
    stato = hass.states.get(DA_ESPORRE)
    assert stato.state == STATE_ON
    assert stato.attributes["fine_finestra"] == "2026-09-24T06:00:00+02:00"

    async_fire_time_changed(hass, _a(freezer, "2026-09-24T06:00:01"))
    await hass.async_block_till_done()
    assert hass.states.get(DA_ESPORRE).state == STATE_OFF


async def test_una_conferma_spegne_da_esporre(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T21:00:00")
    await installa(
        hass,
        hass_storage,
        stato={
            "conferme": [{"data": "2026-09-24", "tipologia": "umido"}],
            "invii_fatti": [],
            "pendenti": [],
            "anomalie_ignorate": [],
            "ultimo_istante_attivo": None,
        },
    )

    assert hass.states.get(DA_ESPORRE).state == STATE_OFF
    assert hass.states.get(SENSORE_DOMANI).attributes["confermati"] == ["umido"]


async def test_a_mezzanotte_domani_diventa_oggi(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T23:59:00")
    await installa(hass, hass_storage)
    assert hass.states.get(SENSORE_OGGI).state == "Nessuno"

    async_fire_time_changed(hass, _a(freezer, "2026-09-24T00:00:00"))
    await hass.async_block_till_done()

    assert hass.states.get(SENSORE_OGGI).state == "Umido"
    assert hass.states.get(SENSORE_DOMANI).state == "Carta"
    assert hass.states.get(PROSSIMO_UMIDO).attributes["giorni_mancanti"] == 0


async def test_piu_tipologie_nello_stesso_giorno(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T12:00:00")
    config = configurazione()
    config["regole"][1]["ricorrenza"]["giorni"] = [3]
    await installa(hass, hass_storage, config)

    assert hass.states.get(SENSORE_DOMANI).state == "Umido, Carta"


async def test_tipologia_senza_ritiri_ha_il_prossimo_sconosciuto(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T12:00:00")
    config = configurazione()
    config["tipologie"].append(tipologia("ingombranti", "Ingombranti"))
    await installa(hass, hass_storage, config)

    stato = hass.states.get("sensor.raccolta_differenziata_prossimo_ritiro_ingombranti")
    assert stato.state == STATE_UNKNOWN
    assert stato.attributes["giorni_mancanti"] is None


async def test_configurazione_non_valida_rende_tutto_non_disponibile(
    hass, hass_storage, freezer
):
    """INV-2: mai "Nessuno" quando il sistema non sa."""
    _a(freezer, "2026-09-23T12:00:00")
    config = configurazione()
    config["regole"][0]["ricorrenza"]["ogni"] = 0
    await installa(hass, hass_storage, config)

    for entity_id in (SENSORE_OGGI, SENSORE_DOMANI, DA_ESPORRE, CALENDARIO):
        assert hass.states.get(entity_id).state == STATE_UNAVAILABLE


async def test_le_entita_per_tipologia_seguono_la_configurazione(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T12:00:00")
    voce = await installa(hass, hass_storage)
    coordinatore = voce.runtime_data

    nuova = {**coordinatore.archivi.configurazione}
    nuova["tipologie"] = [
        tipologia("umido", "Organico"),
        tipologia("vetro", "Vetro"),
    ]
    nuova["regole"] = [nuova["regole"][0]]
    assert await coordinatore.async_salva_configurazione(nuova) == []
    await hass.async_block_till_done()

    registro = er.async_get(hass)
    assert hass.states.get(PROSSIMO_CARTA) is None
    assert registro.async_get(PROSSIMO_CARTA) is None
    assert hass.states.get("sensor.raccolta_differenziata_prossimo_ritiro_vetro")
    # Rinominare non cambia l'entity_id, solo il nome visibile.
    umido = hass.states.get(PROSSIMO_UMIDO)
    assert umido.attributes["friendly_name"] == (
        "Raccolta differenziata Prossimo ritiro Organico"
    )


async def test_salvataggio_con_revisione_superata_rifiutato(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T12:00:00")
    voce = await installa(hass, hass_storage)
    coordinatore = voce.runtime_data

    problemi = await coordinatore.async_salva_configurazione(
        coordinatore.archivi.configurazione, revisione_letta=1
    )

    assert [p.codice for p in problemi] == ["revisione_superata"]


async def test_calendario(hass, hass_storage, freezer):
    _a(freezer, "2026-12-20T12:00:00")
    config = configurazione()
    config["tipologie"][0]["note"] = "Scarti di cucina"
    config["eccezioni"] = [
        {
            "id": "e1",
            "tipo": "sposta",
            "tipologia": "carta",
            "da": "2026-12-25",
            "a": "2026-12-27",
        }
    ]
    await installa(hass, hass_storage, config)

    evento = hass.states.get(CALENDARIO)
    assert evento.state == STATE_OFF
    assert evento.attributes["message"] == "Umido"
    assert evento.attributes["start_time"] == "2026-12-24 00:00:00"

    risposta = await hass.services.async_call(
        "calendar",
        "get_events",
        {
            "entity_id": CALENDARIO,
            "start_date_time": "2026-12-24T00:00:00+01:00",
            "end_date_time": "2026-12-28T00:00:00+01:00",
        },
        blocking=True,
        return_response=True,
    )
    eventi = risposta[CALENDARIO]["events"]
    assert [(e["start"], e["summary"]) for e in eventi] == [
        ("2026-12-24", "Umido"),
        ("2026-12-27", "Carta"),
    ]
    assert eventi[0]["description"] == "Scarti di cucina"
    assert eventi[1]["description"] == "Spostato dal 25/12"


async def test_il_calendario_e_acceso_nel_giorno_di_ritiro(hass, hass_storage, freezer):
    _a(freezer, "2026-09-24T09:00:00")
    await installa(hass, hass_storage)

    assert hass.states.get(CALENDARIO).state == STATE_ON


async def test_un_ricalcolo_non_lascia_timer_duplicati(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T12:00:00")
    voce = await installa(hass, hass_storage)
    coordinatore = voce.runtime_data
    for _ in range(3):
        coordinatore.aggiorna()

    async_fire_time_changed(hass, _a(freezer, "2026-09-23T20:00:01"))
    await hass.async_block_till_done()
    assert hass.states.get(DA_ESPORRE).state == STATE_ON

    await hass.config_entries.async_unload(voce.entry_id)
    await hass.async_block_till_done()
    async_fire_time_changed(hass, datetime.now(ROMA) + timedelta(days=2))
    await hass.async_block_till_done()
