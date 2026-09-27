"""Titolo e testo dei promemoria (decisione 71), senza Home Assistant."""

from __future__ import annotations

from datetime import date, datetime
from zoneinfo import ZoneInfo

from custom_components.foyer_raccolta_differenziata.core.emoji import (
    EMOJI_PREDEFINITA,
    emoji_di,
)
from custom_components.foyer_raccolta_differenziata.testi import (
    VoceNotifica,
    notifica,
)

ROMA = ZoneInfo("Europe/Rome")


def a(testo: str) -> datetime:
    return datetime.fromisoformat(testo).replace(tzinfo=ROMA)


def voce(nome="Umido", emoji="🍎", dal="2026-09-23T20:00", al="2026-09-24T06:00"):
    return VoceNotifica(nome, emoji, a(dal), a(al))


GIOVEDI = date(2026, 9, 24)


def test_la_sera_prima_a_finestra_aperta():
    assert notifica([voce()], GIOVEDI, a("2026-09-23T20:30")) == (
        "🍎 Umido",
        "Da mettere fuori stasera, entro domani alle 06:00\nRitiro domani, giovedì 24",
    )


def test_prima_che_la_finestra_apra():
    _, testo = notifica([voce()], GIOVEDI, a("2026-09-23T12:00"))
    assert testo == "Da mettere fuori stasera dalle 20:00\nRitiro domani, giovedì 24"


def test_qualche_giorno_prima():
    _, testo = notifica([voce()], GIOVEDI, a("2026-09-21T09:00"))
    assert testo == "Da mettere fuori mercoledì 23 sera dalle 20:00\nRitiro giovedì 24"


def test_il_giorno_stesso():
    stesso = voce(dal="2026-09-24T05:00", al="2026-09-24T08:00")
    _, testo = notifica([stesso], GIOVEDI, a("2026-09-24T06:00"))
    assert testo == "Da mettere fuori, entro le 08:00\nRitiro oggi, giovedì 24"


def test_sollecito():
    _, testo = notifica([voce()], GIOVEDI, a("2026-09-23T21:00"), sollecito=True)
    assert testo == (
        "Ancora da mettere fuori, entro domani alle 06:00\nRitiro domani, giovedì 24"
    )


def test_piu_tipologie_la_finestra_comune():
    carta = voce("Carta", "📰", dal="2026-09-23T21:00", al="2026-09-24T07:00")
    titolo, testo = notifica([voce(), carta], GIOVEDI, a("2026-09-23T12:00"))
    assert titolo == "🍎 Umido · 📰 Carta"
    assert testo.startswith("Da mettere fuori stasera dalle 21:00")
    _, aperta = notifica([voce(), carta], GIOVEDI, a("2026-09-23T21:30"))
    assert aperta.startswith("Da mettere fuori stasera, entro domani alle 06:00")


def test_senza_finestra():
    _, testo = notifica([VoceNotifica("Umido", "🍎")], GIOVEDI, a("2026-09-23T12:00"))
    assert testo == "Da mettere fuori\nRitiro domani, giovedì 24"


def test_prova_lo_dice():
    _, testo = notifica([voce()], GIOVEDI, a("2026-09-23T12:00"), prova=True)
    assert testo.endswith("\nQuesta è una prova: i pulsanti non confermano nulla.")


def test_emoji_scelta_dall_icona_o_predefinita():
    assert emoji_di("mdi:food-apple") == "🍎"
    assert emoji_di("mdi:food-apple", " 🥕 ") == "🥕"
    assert emoji_di("mdi:qualcosa-di-strano") == EMOJI_PREDEFINITA
