"""Le viste delle entità, ricavate da un calcolo (SPEC §9.2)."""

from __future__ import annotations

from datetime import datetime

from custom_components.foyer_raccolta_differenziata.core.calendario import calcola
from custom_components.foyer_raccolta_differenziata.core.viste import (
    conferme_da_stato,
    da_esporre,
    del_giorno,
    festivi_da_gestire,
    prossimo,
    prossimo_cambiamento,
    prossimo_evento,
)

from .aiuti import ROMA, configura, d, regola, settimanale, tipologia

LUN, MAR, MER, GIO, VEN, SAB, DOM = range(7)


def _config():
    return configura(
        tipologie=[tipologia("umido"), tipologia("carta")],
        regole=[
            regola("r1", "umido", settimanale([GIO])),
            regola("r2", "carta", settimanale([VEN])),
        ],
    )


def _risultato(dal="2026-09-21", al="2026-10-04"):
    return calcola(_config(), d(dal), d(al), ROMA)


def test_conferme_da_stato():
    assert conferme_da_stato(
        [{"data": "2026-09-24", "tipologia": "umido", "istante": "x"}, {"rotto": 1}]
    ) == frozenset({(d("2026-09-24"), "umido")})


def test_del_giorno():
    assert [r.tipologia for r in del_giorno(_risultato(), d("2026-09-24"))] == ["umido"]
    assert del_giorno(_risultato(), d("2026-09-22")) == ()


def test_da_esporre_nella_finestra():
    risultato = _risultato()

    prima = datetime(2026, 9, 23, 19, 59, tzinfo=ROMA)
    aperta = datetime(2026, 9, 23, 20, 0, tzinfo=ROMA)
    ultima = datetime(2026, 9, 24, 5, 59, tzinfo=ROMA)
    chiusa = datetime(2026, 9, 24, 6, 0, tzinfo=ROMA)

    assert da_esporre(risultato, prima, frozenset()) == ()
    assert [r.tipologia for r in da_esporre(risultato, aperta, frozenset())] == [
        "umido"
    ]
    assert [r.tipologia for r in da_esporre(risultato, ultima, frozenset())] == [
        "umido"
    ]
    assert da_esporre(risultato, chiusa, frozenset()) == ()


def test_da_esporre_esclude_i_confermati():
    aperta = datetime(2026, 9, 23, 21, 0, tzinfo=ROMA)

    assert (
        da_esporre(_risultato(), aperta, frozenset({(d("2026-09-24"), "umido")})) == ()
    )


def test_prossimo_per_tipologia():
    risultato = _risultato()

    assert prossimo(risultato, "carta", d("2026-09-24")).data == d("2026-09-25")
    assert prossimo(risultato, "umido", d("2026-09-25")).data == d("2026-10-01")
    assert prossimo(risultato, "vetro", d("2026-09-24")) is None


def test_prossimo_evento_comprende_oggi():
    assert prossimo_evento(_risultato(), d("2026-09-24")).data == d("2026-09-24")


def test_prossimo_cambiamento():
    risultato = _risultato()

    assert prossimo_cambiamento(
        risultato, datetime(2026, 9, 23, 12, 0, tzinfo=ROMA)
    ) == datetime(2026, 9, 23, 20, 0, tzinfo=ROMA)
    assert prossimo_cambiamento(
        risultato, datetime(2026, 9, 23, 20, 0, tzinfo=ROMA)
    ) == datetime(2026, 9, 24, 6, 0, tzinfo=ROMA)
    assert (
        prossimo_cambiamento(risultato, datetime(2026, 10, 5, 0, 0, tzinfo=ROMA))
        is None
    )


def test_festivi_da_gestire():
    config = configura(regole=[regola("r1", "umido", settimanale([VEN]))])
    risultato = calcola(config, d("2026-12-01"), d("2026-12-31"), ROMA)

    assert [
        r.data for r in festivi_da_gestire(risultato, d("2026-12-01"), d("2026-12-31"))
    ] == [d("2026-12-25")]
    ignorato = calcola(
        config,
        d("2026-12-01"),
        d("2026-12-31"),
        ROMA,
        festivi_ignorati=frozenset({(d("2026-12-25"), "umido")}),
    )
    assert festivi_da_gestire(ignorato, d("2026-12-01"), d("2026-12-31")) == ()
