"""Ritiri e differenze come dati semplici (SPEC §9.4)."""

from __future__ import annotations

from custom_components.foyer_raccolta_differenziata.core import serializza
from custom_components.foyer_raccolta_differenziata.core.calendario import calcola

from .aiuti import ROMA, configura, d, regola, settimanale, sposta

LUN, MAR, MER, GIO, VEN, SAB, DOM = range(7)


def test_ritiro_spostato():
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[sposta("e1", "umido", "2026-12-25", "2026-12-27")],
    )
    ritiro = calcola(config, d("2026-12-27"), d("2026-12-27"), ROMA).ritiri[0]

    assert serializza.ritiro(ritiro) == {
        "data": "2026-12-27",
        "tipologia": "umido",
        "origine": "spostato",
        "regole": [],
        "spostato_dal": "2026-12-25",
        "inizio_esposizione": "2026-12-26T20:00:00+01:00",
        "fine_esposizione": "2026-12-27T06:00:00+01:00",
        "festivo": None,
        "da_verificare": False,
    }


def test_differenze():
    prima = calcola(
        configura(regole=[regola("r1", "umido", settimanale([LUN]))]),
        d("2026-09-21"),
        d("2026-09-27"),
        ROMA,
    )
    dopo = calcola(
        configura(regole=[regola("r1", "umido", settimanale([GIO]))]),
        d("2026-09-21"),
        d("2026-09-27"),
        ROMA,
    )

    assert serializza.differenze(prima, dopo) == {
        "aggiunti": [{"data": "2026-09-24", "tipologia": "umido"}],
        "tolti": [{"data": "2026-09-21", "tipologia": "umido"}],
    }
    assert serializza.differenze(None, dopo)["aggiunti"] == [
        {"data": "2026-09-24", "tipologia": "umido"}
    ]
