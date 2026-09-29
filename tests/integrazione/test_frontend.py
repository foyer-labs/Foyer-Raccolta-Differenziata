"""Come card e pannello arrivano alla pagina (SPEC §9.1, decisione 73)."""

from __future__ import annotations

import asyncio
import hashlib
from pathlib import Path
from unittest.mock import patch

from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL, DATA_PANELS
from homeassistant.config_entries import ConfigEntryState
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.foyer_raccolta_differenziata.const import (
    DOMINIO,
    URL_LOADER,
    URL_STATICO,
)

from .conftest import DATI_VOCE, installa

FRONTEND = (
    Path(__file__).resolve().parents[2]
    / "custom_components"
    / "foyer_raccolta_differenziata"
    / "frontend"
)
LOADER_INDEX = f"{URL_STATICO}/loader.js"
ALTRA = "/local/altra-card.js"
PANNELLO = "custom_components.foyer_raccolta_differenziata.pannello"


def _url(nome: str) -> str:
    impronta = hashlib.sha256((FRONTEND / nome).read_bytes()).hexdigest()[:12]
    return f"{URL_STATICO}/{impronta}/{nome}"


def _risorse(hass) -> list[str]:
    return [voce["url"] for voce in hass.data["lovelace"].resources.async_items()]


def _nell_index(hass) -> bool:
    return LOADER_INDEX in hass.data[DATA_EXTRA_MODULE_URL].urls


async def test_la_card_arriva_da_risorsa_e_index(hass, hass_storage):
    await installa(hass, hass_storage)

    assert _risorse(hass) == [URL_LOADER]
    assert _nell_index(hass)


async def test_il_loader_porta_al_modulo_con_l_impronta(
    hass, hass_storage, hass_client_no_auth
):
    await installa(hass, hass_storage)
    client = await hass_client_no_auth()

    risposta = await client.get(URL_LOADER)
    assert risposta.status == 200
    assert risposta.headers["Cache-Control"] == "no-cache"
    assert await risposta.text() == f'import "{_url("raccolta-card.js")}";\n'

    uguale = await client.get(
        URL_LOADER, headers={"If-None-Match": risposta.headers["ETag"]}
    )
    assert uguale.status == 304

    modulo = await client.get(_url("raccolta-card.js"))
    assert modulo.status == 200
    assert "immutable" in modulo.headers["Cache-Control"]
    assert modulo.content_type == "text/javascript"
    assert await modulo.read() == (FRONTEND / "raccolta-card.js").read_bytes()


async def test_il_loader_dell_index_ripiega_sul_modulo(
    hass, hass_storage, hass_client_no_auth
):
    await installa(hass, hass_storage)
    client = await hass_client_no_auth()

    risposta = await client.get(LOADER_INDEX)
    testo = await risposta.text()

    assert risposta.headers["Cache-Control"] == "no-cache"
    assert testo.startswith(f'import("{URL_LOADER}")')
    assert f'.catch(() => import("{_url("raccolta-card.js")}"))' in testo


async def test_gli_indirizzi_di_prima_portano_al_modulo_attuale(
    hass, hass_storage, hass_client_no_auth
):
    """Gli index salvati dai telefoni li contengono ancora: mai un errore."""
    await installa(hass, hass_storage)
    client = await hass_client_no_auth()

    for vecchio, attuale in (
        ("raccolta-card.js?v=0123456789ab", "raccolta-card.js"),
        ("0123456789ab/raccolta-card.js", "raccolta-card.js"),
        ("raccolta-pannello.js?v=0123456789ab", "raccolta-pannello.js"),
        ("0123456789ab/raccolta-pannello.js", "raccolta-pannello.js"),
    ):
        risposta = await client.get(f"{URL_STATICO}/{vecchio}")
        assert risposta.status == 200, vecchio
        assert await risposta.text() == f'import "{_url(attuale)}";\n', vecchio

    assert (await client.get(f"{URL_STATICO}/altro.js")).status == 404


async def test_il_pannello_si_apre_dal_modulo_con_l_impronta(hass, hass_storage):
    await installa(hass, hass_storage)

    pannello = hass.data[DATA_PANELS]["raccolta-differenziata"]
    assert pannello.config["_panel_custom"]["module_url"] == _url(
        "raccolta-pannello.js"
    )


async def test_la_risorsa_resta_una_e_toglie_quelle_di_prima(hass, hass_storage):
    hass_storage["lovelace_resources"] = {
        "version": 1,
        "minor_version": 1,
        "key": "lovelace_resources",
        "data": {
            "items": [
                {"id": "a", "type": "module", "url": ALTRA},
                {
                    "id": "b",
                    "type": "module",
                    "url": f"{URL_STATICO}/raccolta-card.js?v=1",
                },
                {"id": "c", "type": "module", "url": URL_LOADER},
                {"id": "d", "type": "module", "url": URL_LOADER},
            ]
        },
    }
    voce = await installa(hass, hass_storage)
    assert _risorse(hass) == [ALTRA, URL_LOADER]

    assert await hass.config_entries.async_reload(voce.entry_id)
    await hass.async_block_till_done()
    assert _risorse(hass) == [ALTRA, URL_LOADER]


async def test_rimuovere_l_integrazione_toglie_risorsa_e_modulo(hass, hass_storage):
    hass_storage["lovelace_resources"] = {
        "version": 1,
        "minor_version": 1,
        "key": "lovelace_resources",
        "data": {"items": [{"id": "a", "type": "module", "url": ALTRA}]},
    }
    voce = await installa(hass, hass_storage)

    await hass.config_entries.async_remove(voce.entry_id)
    await hass.async_block_till_done()

    assert _risorse(hass) == [ALTRA]
    assert not _nell_index(hass)


YAML = {
    "lovelace": {
        "resource_mode": "yaml",
        "resources": [{"url": ALTRA, "type": "module"}],
    }
}


def _rilettura(*secondi: float):
    """«Ricarica risorse» che rilegge il YAML in tempi diversi, una lettura per volta.

    La sorveglianza dura un secondo invece di trenta, così il test non aspetta.
    """
    attese = iter(secondi)

    async def _leggi(_hass):
        await asyncio.sleep(next(attese))
        return YAML

    return (
        patch(
            "homeassistant.components.lovelace.async_hass_config_yaml",
            side_effect=_leggi,
        ),
        patch(f"{PANNELLO}._SORVEGLIANZA", 1.0),
    )


async def _ricarica(hass) -> None:
    await hass.services.async_call("lovelace", "reload_resources", blocking=True)


async def test_con_le_risorse_in_yaml_la_voce_vive_in_memoria(hass, hass_storage):
    assert await async_setup_component(hass, "lovelace", YAML)
    await installa(hass, hass_storage)
    assert _risorse(hass) == [ALTRA, URL_LOADER]

    # "Ricarica risorse" rilegge il YAML, dove la voce non c'è: si rimette.
    lettura, sorveglianza = _rilettura(0)
    with lettura, sorveglianza:
        await _ricarica(hass)
        await hass.async_block_till_done(wait_background_tasks=True)

    assert _risorse(hass) == [ALTRA, URL_LOADER]
    assert "lovelace_resources" not in hass_storage


async def test_due_ricariche_una_sull_altra(hass, hass_storage):
    """La seconda finisce dopo che la voce è già stata rimessa nella prima."""
    assert await async_setup_component(hass, "lovelace", YAML)
    await installa(hass, hass_storage)

    lettura, sorveglianza = _rilettura(0.2, 0.6)
    with lettura, sorveglianza:
        await asyncio.gather(_ricarica(hass), _ricarica(hass))
        await hass.async_block_till_done(wait_background_tasks=True)

    assert _risorse(hass) == [ALTRA, URL_LOADER]


async def test_rimossa_durante_la_ricarica_la_voce_non_torna(hass, hass_storage):
    assert await async_setup_component(hass, "lovelace", YAML)
    voce = await installa(hass, hass_storage)

    lettura, sorveglianza = _rilettura(0.3)
    with lettura, sorveglianza:
        ricarica = hass.async_create_task(_ricarica(hass))
        await asyncio.sleep(0)
        await hass.config_entries.async_remove(voce.entry_id)
        await ricarica
        await hass.async_block_till_done(wait_background_tasks=True)

    assert _risorse(hass) == [ALTRA]


async def test_senza_i_file_del_frontend_il_resto_funziona(hass, hass_storage):
    """Un'installazione incompleta toglie card e pannello, non il calendario."""
    with patch(f"{PANNELLO}._leggi_moduli", side_effect=FileNotFoundError):
        await installa(hass, hass_storage)

    assert hass.states.get("calendar.raccolta_differenziata") is not None
    assert "raccolta-differenziata" not in hass.data.get(DATA_PANELS, {})
    assert _risorse(hass) == []
    assert not _nell_index(hass)


async def test_la_card_arriva_anche_se_la_voce_non_parte(hass, hass_storage):
    """La card dice che il calendario non è disponibile: niente "Errore di
    configurazione"."""
    voce = MockConfigEntry(domain=DOMINIO, data=DATI_VOCE)
    voce.add_to_hass(hass)

    with patch(
        "custom_components.foyer_raccolta_differenziata.archivio.async_carica",
        side_effect=ValueError("archivio rotto"),
    ):
        assert not await hass.config_entries.async_setup(voce.entry_id)
    await hass.async_block_till_done()

    assert voce.state is ConfigEntryState.SETUP_ERROR
    assert _risorse(hass) == [URL_LOADER]
    assert _nell_index(hass)
