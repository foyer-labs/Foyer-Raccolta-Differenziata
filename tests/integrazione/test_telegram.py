"""Telegram (decisione 74): da Home Assistant 2026.11 il formato `telegram_bot`,
prima il testo con `notify.send_message`; i destinatari spariti in Riparazioni."""

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from homeassistant.helpers import entity_registry as er, issue_registry as ir
import pytest
from pytest_homeassistant_custom_component.common import (
    async_fire_time_changed,
    async_mock_service,
)

from custom_components.foyer_raccolta_differenziata import notifiche
from custom_components.foyer_raccolta_differenziata.const import DOMINIO

from .conftest import configurazione, installa

ROMA = ZoneInfo("Europe/Rome")
CHAT = "notify.telegram_bot_famiglia"


def _a(freezer, testo: str) -> datetime:
    istante = datetime.fromisoformat(testo).replace(tzinfo=ROMA)
    freezer.move_to(istante)
    return istante


def _config(destinatari, solleciti=False):
    return configurazione(
        promemoria=[
            {
                "id": "sera",
                "nome": "La sera prima",
                "attivo": True,
                "quando": {"tipo": "giorni_prima", "giorni": 1, "ora": "20:30"},
                "tipologie": None,
                "destinatari": destinatari,
            }
        ],
        solleciti={"attivi": solleciti, "richiami": 1, "richiamo_dopo": 30},
    )


def _stato(ultimo: str):
    return {
        "conferme": [],
        "invii_fatti": [],
        "pendenti": [],
        "anomalie_ignorate": [],
        "sospensione_manuale": False,
        "ultimo_istante_attivo": datetime.fromisoformat(ultimo)
        .replace(tzinfo=ROMA)
        .isoformat(),
    }


def _chat_telegram(hass) -> None:
    """Un'entità notify del bot Telegram, come la crea l'integrazione."""
    er.async_get(hass).async_get_or_create(
        "notify",
        "telegram_bot",
        "chat_famiglia",
        suggested_object_id="telegram_bot_famiglia",
    )
    hass.states.async_set(CHAT, "unknown", {"friendly_name": "Famiglia"})


async def _scatta(hass, freezer, testo: str) -> None:
    async_fire_time_changed(hass, _a(freezer, testo))
    await hass.async_block_till_done()


@pytest.fixture
def versione(monkeypatch):
    def imposta(anno: int, mese: int) -> None:
        monkeypatch.setattr(notifiche, "versione_ha", lambda: (anno, mese))

    return imposta


async def test_da_2026_11_telegram_riceve_il_formato_del_bot_con_i_pulsanti(
    hass, hass_storage, freezer, versione
):
    versione(2026, 11)
    _a(freezer, "2026-09-23T20:29:00")
    _chat_telegram(hass)
    bot = async_mock_service(hass, "telegram_bot", "send_message")
    testo = async_mock_service(hass, "notify", "send_message")
    await installa(
        hass,
        hass_storage,
        _config([{"tipo": "entita", "id": CHAT}], solleciti=True),
        _stato("2026-09-23T20:28:00"),
    )

    await _scatta(hass, freezer, "2026-09-23T20:30:00")

    assert testo == []
    (chiamata,) = bot
    assert chiamata.data["entity_id"] == CHAT
    assert chiamata.data["parse_mode"] == "html"
    assert chiamata.data["message"] == (
        "<b>🍎 Umido</b>\n"
        "Da mettere fuori stasera, entro domani alle 06:00\n"
        "Ritiro domani, giovedì 24"
    )
    esposto, rinvia = chiamata.data["inline_keyboard"]
    assert esposto.startswith("Esposto ✓:/rd_esposto_")
    assert rinvia.startswith("Ricordamelo tra 30 minuti:/rd_rinvia_")
    # I dati di un pulsante Telegram stanno in 64 byte.
    assert all(len(p.split(":", 1)[1].encode()) <= 64 for p in (esposto, rinvia))


async def test_il_pulsante_esposto_di_telegram_conferma_e_risponde(
    hass, hass_storage, freezer, versione
):
    versione(2026, 11)
    _a(freezer, "2026-09-23T20:29:00")
    _chat_telegram(hass)
    bot = async_mock_service(hass, "telegram_bot", "send_message")
    risposte = async_mock_service(hass, "telegram_bot", "answer_callback_query")
    await installa(
        hass,
        hass_storage,
        _config([{"tipo": "entita", "id": CHAT}]),
        _stato("2026-09-23T20:28:00"),
    )
    await _scatta(hass, freezer, "2026-09-23T20:30:00")
    dati = bot[0].data["inline_keyboard"][0].split(":", 1)[1]

    hass.bus.async_fire(
        "telegram_callback",
        {
            "data": dati,
            "id": "q1",
            "from_first": "Anna",
            "bot": {"config_entry_id": "b1"},
        },
    )
    await hass.async_block_till_done()

    voce = hass.config_entries.async_entries(DOMINIO)[0]
    assert len(voce.runtime_data.conferme) == 1
    (risposta,) = risposte
    assert risposta.data == {
        "callback_query_id": "q1",
        "message": "Segnato come esposto ✓",
        "config_entry_id": "b1",
    }


async def test_il_rinvia_di_telegram_rimanda_al_solo_destinatario(
    hass, hass_storage, freezer, versione
):
    versione(2026, 11)
    _a(freezer, "2026-09-23T20:29:00")
    _chat_telegram(hass)
    bot = async_mock_service(hass, "telegram_bot", "send_message")
    async_mock_service(hass, "telegram_bot", "answer_callback_query")
    config = _config([{"tipo": "entita", "id": CHAT}], solleciti=True)
    config["solleciti"]["richiamo_dopo"] = 240
    await installa(hass, hass_storage, config, _stato("2026-09-23T20:28:00"))
    await _scatta(hass, freezer, "2026-09-23T20:30:00")
    rinvia = bot[0].data["inline_keyboard"][1].split(":", 1)[1]

    hass.bus.async_fire("telegram_callback", {"data": rinvia, "id": "q2"})
    await hass.async_block_till_done()
    await _scatta(hass, freezer, "2026-09-23T21:00:00")

    assert len(bot) == 2
    assert bot[1].data["message"].startswith("<b>🍎 Umido</b>\nAncora da mettere fuori")


async def test_prima_del_2026_11_telegram_riceve_il_testo(
    hass, hass_storage, freezer, versione
):
    versione(2026, 10)
    _a(freezer, "2026-09-23T20:29:00")
    _chat_telegram(hass)
    bot = async_mock_service(hass, "telegram_bot", "send_message")
    testo = async_mock_service(hass, "notify", "send_message")
    await installa(
        hass,
        hass_storage,
        _config([{"tipo": "entita", "id": CHAT}]),
        _stato("2026-09-23T20:28:00"),
    )

    await _scatta(hass, freezer, "2026-09-23T20:30:00")

    assert bot == []
    (chiamata,) = testo
    assert chiamata.data["entity_id"] == CHAT
    assert chiamata.data["title"] == "🍎 Umido"


async def test_un_destinatario_sparito_va_in_riparazioni(hass, hass_storage, freezer):
    """Il vecchio servizio notify di Telegram, tolto in 2026.11."""
    _a(freezer, "2026-09-23T12:00:00")
    await installa(
        hass,
        hass_storage,
        _config([{"tipo": "servizio", "id": "telegram_casa"}]),
    )
    await hass.async_block_till_done()

    problema = ir.async_get(hass).async_get_issue(DOMINIO, "destinatari_mancanti")
    assert problema is not None
    assert problema.translation_placeholders == {"destinatari": "notify.telegram_casa"}

    # Il servizio torna (per esempio dopo una correzione): il problema sparisce.
    async_mock_service(hass, "notify", "telegram_casa")
    await hass.async_block_till_done()
    assert ir.async_get(hass).async_get_issue(DOMINIO, "destinatari_mancanti") is None
