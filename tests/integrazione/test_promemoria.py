"""I promemoria dentro Home Assistant (SPEC §8): invio, pulsanti, riavvio."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from homeassistant.const import STATE_OFF, STATE_ON
from homeassistant.core import Context
from pytest_homeassistant_custom_component.common import (
    async_fire_time_changed,
    async_mock_service,
)

from custom_components.foyer_raccolta_differenziata.const import DOMINIO

from .conftest import configurazione, installa

ROMA = ZoneInfo("Europe/Rome")
DA_ESPORRE = "binary_sensor.raccolta_differenziata_da_esporre"
PULSANTE = "button.raccolta_differenziata_esposto"
INTERRUTTORE = "switch.raccolta_differenziata_sospendi_promemoria"


def _a(freezer, testo: str) -> datetime:
    istante = datetime.fromisoformat(testo).replace(tzinfo=ROMA)
    freezer.move_to(istante)
    return istante


def _config(solleciti=False, destinatari=None, **altro):
    return configurazione(
        promemoria=[
            {
                "id": "sera",
                "nome": "La sera prima",
                "attivo": True,
                "quando": {"tipo": "giorni_prima", "giorni": 1, "ora": "20:30"},
                "tipologie": None,
                "destinatari": destinatari
                or [{"tipo": "servizio", "id": "mobile_app_luca"}],
            }
        ],
        solleciti={"attivi": solleciti, "richiami": 1, "richiamo_dopo": 30},
        **altro,
    )


def _stato(ultimo: str | None = None, **altro):
    return {
        "conferme": [],
        "invii_fatti": [],
        "pendenti": [],
        "anomalie_ignorate": [],
        "sospensione_manuale": False,
        "ultimo_istante_attivo": (
            datetime.fromisoformat(ultimo).replace(tzinfo=ROMA).isoformat()
            if ultimo
            else None
        ),
        **altro,
    }


async def _scatta(hass, freezer, testo: str) -> None:
    async_fire_time_changed(hass, _a(freezer, testo))
    await hass.async_block_till_done()


async def test_la_sera_prima_arriva_la_notifica_con_il_pulsante(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T20:00:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_luca")
    await installa(hass, hass_storage, _config())
    assert chiamate == []

    await _scatta(hass, freezer, "2026-09-23T20:30:00")

    (chiamata,) = chiamate
    assert chiamata.data["title"] == "Raccolta differenziata"
    assert chiamata.data["message"] == "Stasera fuori: Umido"
    azioni = chiamata.data["data"]["actions"]
    assert [a["title"] for a in azioni] == ["Esposto ✓"]
    assert chiamata.data["data"]["tag"] == "raccolta-2026-09-24"

    await _scatta(hass, freezer, "2026-09-23T20:31:00")
    assert len(chiamate) == 1, "un invio non parte mai due volte"


async def test_il_pulsante_della_notifica_conferma(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T20:29:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_luca")
    await installa(hass, hass_storage, _config(), _stato("2026-09-23T20:28:00"))
    await _scatta(hass, freezer, "2026-09-23T20:30:00")
    assert hass.states.get(DA_ESPORRE).state == STATE_ON
    azione = chiamate[0].data["data"]["actions"][0]["action"]

    hass.bus.async_fire(
        "mobile_app_notification_action", {"action": azione}, context=Context()
    )
    await hass.async_block_till_done()

    assert hass.states.get(DA_ESPORRE).state == STATE_OFF
    assert hass.states.get("sensor.raccolta_differenziata_domani").attributes[
        "confermati"
    ] == ["umido"]


async def test_il_pulsante_esposto(hass, hass_storage, freezer, hass_admin_user):
    _a(freezer, "2026-09-23T21:00:00")
    await installa(hass, hass_storage, _config())
    assert hass.states.get(DA_ESPORRE).state == STATE_ON

    await hass.services.async_call(
        "button",
        "press",
        {"entity_id": PULSANTE},
        blocking=True,
        context=Context(user_id=hass_admin_user.id),
    )
    await hass.async_block_till_done()

    assert hass.states.get(DA_ESPORRE).state == STATE_OFF
    voce = hass.config_entries.async_entries(DOMINIO)[0]
    conferma = voce.runtime_data.archivi.stato["conferme"][0]
    assert (conferma["data"], conferma["tipologia"]) == ("2026-09-24", "umido")
    assert conferma["utente"] == hass_admin_user.name


async def test_una_conferma_prima_della_sera_evita_la_notifica(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T19:00:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_luca")
    await installa(hass, hass_storage, _config())

    await hass.services.async_call(
        "button", "press", {"entity_id": PULSANTE}, blocking=True
    )
    await _scatta(hass, freezer, "2026-09-23T20:30:00")

    assert chiamate == []


async def test_l_interruttore_zittisce_e_resta_dopo_il_riavvio(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T20:00:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_luca")
    voce = await installa(hass, hass_storage, _config())

    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": INTERRUTTORE}, blocking=True
    )
    assert hass.states.get(INTERRUTTORE).state == STATE_ON
    assert hass.states.get(INTERRUTTORE).attributes["sospeso_ora"] is True
    await _scatta(hass, freezer, "2026-09-23T20:30:00")
    assert chiamate == []

    await hass.config_entries.async_reload(voce.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get(INTERRUTTORE).state == STATE_ON
    # La sospensione riguarda le notifiche, non i fatti.
    assert hass.states.get(DA_ESPORRE).state == STATE_ON


async def test_al_riavvio_si_recupera_se_serve_ancora(hass, hass_storage, freezer):
    """Spento dalle 18 alle 22: il promemoria delle 20:30 parte al riavvio."""
    _a(freezer, "2026-09-23T22:00:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_luca")

    await installa(hass, hass_storage, _config(), _stato("2026-09-23T18:00:00"))

    assert [c.data["message"] for c in chiamate] == ["Stasera fuori: Umido"]


async def test_al_riavvio_non_si_recupera_a_finestra_chiusa(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-24T07:00:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_luca")

    await installa(hass, hass_storage, _config(), _stato("2026-09-23T18:00:00"))

    assert chiamate == []


async def test_sollecito_con_il_pulsante_rimanda(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T20:29:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_luca")
    await installa(
        hass, hass_storage, _config(solleciti=True), _stato("2026-09-23T20:28:00")
    )
    await _scatta(hass, freezer, "2026-09-23T20:30:00")
    assert [a["title"] for a in chiamate[0].data["data"]["actions"]] == [
        "Esposto ✓",
        "Ricordamelo tra 30 minuti",
    ]

    await _scatta(hass, freezer, "2026-09-23T21:00:00")

    assert [c.data["message"] for c in chiamate] == [
        "Stasera fuori: Umido",
        "Ancora da esporre: Umido",
    ]


async def test_rinvio_dal_pulsante_della_notifica(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T20:29:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_luca")
    config = _config(solleciti=True)
    config["solleciti"]["richiamo_dopo"] = 240
    await installa(hass, hass_storage, config, _stato("2026-09-23T20:28:00"))
    await _scatta(hass, freezer, "2026-09-23T20:30:00")
    rinvia = chiamate[0].data["data"]["actions"][1]["action"]

    hass.bus.async_fire("mobile_app_notification_action", {"action": rinvia})
    await hass.async_block_till_done()
    await _scatta(hass, freezer, "2026-09-23T21:00:00")

    assert [c.data["message"] for c in chiamate] == [
        "Stasera fuori: Umido",
        "Ancora da esporre: Umido",
    ]


async def test_entita_notify_riceve_solo_il_testo(hass, hass_storage, freezer):
    _a(freezer, "2026-09-23T20:29:00")
    chiamate = async_mock_service(hass, "notify", "send_message")
    await installa(
        hass,
        hass_storage,
        _config(destinatari=[{"tipo": "entita", "id": "notify.telegram_casa"}]),
        _stato("2026-09-23T20:28:00"),
    )

    await _scatta(hass, freezer, "2026-09-23T20:30:00")

    (chiamata,) = chiamate
    assert chiamata.data == {
        "entity_id": "notify.telegram_casa",
        "title": "Raccolta differenziata",
        "message": "Stasera fuori: Umido",
    }


async def test_un_destinatario_che_non_esiste_non_blocca_gli_altri(
    hass, hass_storage, freezer
):
    _a(freezer, "2026-09-23T20:29:00")
    chiamate = async_mock_service(hass, "notify", "mobile_app_anna")
    await installa(
        hass,
        hass_storage,
        _config(
            destinatari=[
                {"tipo": "servizio", "id": "mobile_app_vecchio"},
                {"tipo": "servizio", "id": "mobile_app_anna"},
            ]
        ),
        _stato("2026-09-23T20:28:00"),
    )

    await _scatta(hass, freezer, "2026-09-23T20:30:00")

    assert len(chiamate) == 1


async def test_conferma_e_annulla_dalle_card(hass, hass_storage, hass_ws_client):
    """Senza orologio congelato: il client di prova usa l'ora vera."""
    await installa(hass, hass_storage, _config())
    client = await hass_ws_client(hass)

    oggi = date.today()
    giovedi = oggi + timedelta(days=(3 - oggi.weekday()) % 7 + 7)

    await client.send_json_auto_id(
        {
            "type": f"{DOMINIO}/conferma",
            "data": giovedi.isoformat(),
            "tipologie": ["umido"],
        }
    )
    risposta = await client.receive_json()
    assert risposta["result"] == {"confermati": 1}
    voce = hass.config_entries.async_entries(DOMINIO)[0]
    assert voce.runtime_data.conferme == frozenset({(giovedi, "umido")})

    await client.send_json_auto_id(
        {
            "type": f"{DOMINIO}/annulla_conferma",
            "data": "2020-01-02",
            "tipologia": "umido",
        }
    )
    assert (await client.receive_json())["error"]["code"] == "finestra_chiusa"
