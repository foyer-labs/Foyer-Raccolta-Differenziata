"""I problemi in Riparazioni e il flusso di rinnovo della validità (SPEC §9.3)."""

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from homeassistant.helpers import issue_registry as ir

from custom_components.foyer_raccolta_differenziata.const import DOMINIO
from custom_components.foyer_raccolta_differenziata.repairs import (
    async_create_fix_flow,
)

from .conftest import configurazione, installa

ROMA = ZoneInfo("Europe/Rome")


def _a(freezer, testo: str) -> None:
    freezer.move_to(datetime.fromisoformat(testo).replace(tzinfo=ROMA))


def _problema(hass, chiave):
    return ir.async_get(hass).async_get_issue(DOMINIO, chiave)


async def test_nessun_problema_in_una_configurazione_normale(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T12:00:00")
    await installa(hass, hass_storage)

    assert [i for i in ir.async_get(hass).issues.values() if i.domain == DOMINIO] == []


async def test_configurazione_non_valida(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T12:00:00")
    config = configurazione()
    config["tipologie"][1]["colore"] = "blu"
    await installa(hass, hass_storage, config)

    problema = _problema(hass, "configurazione_non_valida")
    assert problema.severity is ir.IssueSeverity.ERROR
    assert (
        "tipologie[1].colore: colore_non_valido"
        in (problema.translation_placeholders["problemi"])
    )


async def test_ritiri_festivi_nei_prossimi_30_giorni(hass, hass_storage, freezer):
    _a(freezer, "2026-12-01T12:00:00")
    await installa(hass, hass_storage)

    problema = _problema(hass, "ritiri_festivi")
    assert problema.translation_placeholders["ritiri"] == ("25/12/2026 Carta (Natale)")
    assert not problema.is_fixable


async def test_un_festivo_ignorato_non_si_segnala(hass, hass_storage, freezer):
    _a(freezer, "2026-12-01T12:00:00")
    await installa(
        hass,
        hass_storage,
        stato={
            "conferme": [],
            "invii_fatti": [],
            "pendenti": [],
            "anomalie_ignorate": [{"data": "2026-12-25", "tipologia": "carta"}],
            "ultimo_istante_attivo": None,
        },
    )

    assert _problema(hass, "ritiri_festivi") is None


async def test_un_festivo_oltre_30_giorni_non_si_segnala_ancora(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-11-20T12:00:00")
    await installa(hass, hass_storage)

    assert _problema(hass, "ritiri_festivi") is None


async def _flusso(hass, chiave):
    """Il flusso di correzione, guidato direttamente come fa Riparazioni."""
    flusso = await async_create_fix_flow(hass, chiave, None)
    flusso.hass = hass
    flusso.flow_id = "prova"
    flusso.handler = DOMINIO
    return flusso


async def test_calendario_in_scadenza_e_rinnovo(hass, hass_storage, freezer):
    _a(freezer, "2026-12-10T12:00:00")
    voce = await installa(
        hass, hass_storage, configurazione(valido_fino_al="2026-12-31")
    )
    problema = _problema(hass, "calendario_in_scadenza")
    assert problema.is_fixable
    assert problema.translation_placeholders == {"data": "31/12/2026"}

    flusso = await _flusso(hass, "calendario_in_scadenza")
    modulo = await flusso.async_step_init()
    assert modulo["step_id"] == "conferma"
    assert modulo["description_placeholders"] == {"data": "31/12/2026"}
    predefinita = next(
        k.default() for k in modulo["data_schema"].schema if str(k) == "valido_fino_al"
    )
    assert predefinita == "2027-12-31"

    fatto = await flusso.async_step_conferma({"valido_fino_al": "2027-12-31"})
    assert fatto["type"] == "create_entry"
    await hass.async_block_till_done()

    assert voce.runtime_data.archivi.configurazione["valido_fino_al"] == "2027-12-31"
    assert _problema(hass, "calendario_in_scadenza") is None


async def test_rinnovo_con_una_data_passata_rifiutato(hass, hass_storage, freezer):
    _a(freezer, "2027-01-10T12:00:00")
    await installa(hass, hass_storage, configurazione(valido_fino_al="2026-12-31"))
    assert _problema(hass, "calendario_scaduto") is not None
    assert hass.states.get(
        "sensor.raccolta_differenziata_prossimo_ritiro_umido"
    ).attributes["da_verificare"]

    flusso = await _flusso(hass, "calendario_scaduto")
    modulo = await flusso.async_step_conferma({"valido_fino_al": "2027-01-01"})

    assert modulo["errors"] == {"valido_fino_al": "data_nel_passato"}


async def test_rimuovere_l_integrazione_toglie_i_problemi(hass, hass_storage, freezer):
    _a(freezer, "2026-12-01T12:00:00")
    voce = await installa(hass, hass_storage)
    assert _problema(hass, "ritiri_festivi") is not None

    await hass.config_entries.async_remove(voce.entry_id)
    await hass.async_block_till_done()

    assert _problema(hass, "ritiri_festivi") is None
