"""Ricorrenze e periodi (SPEC §4.2.1, §4.2.2)."""

from __future__ import annotations

from datetime import date, timedelta

import pytest

from custom_components.foyer_raccolta_differenziata.core.modello import (
    ULTIMA,
    Annuale,
    ConAnno,
    MensileData,
    MensilePosizione,
    Sempre,
    Settimanale,
)
from custom_components.foyer_raccolta_differenziata.core.ricorrenze import (
    copre,
    genera,
)

from .aiuti import d

LUN, MAR, MER, GIO, VEN, SAB, DOM = range(7)


def _giorni(ricorrenza, dal: str, al: str) -> list[str]:
    inizio, fine = d(dal), d(al)
    risultato = []
    while inizio <= fine:
        if genera(ricorrenza, inizio):
            risultato.append(inizio.isoformat())
        inizio += timedelta(days=1)
    return risultato


def test_ogni_settimana_due_giorni():
    """ "Due volte a settimana" è una sola regola con due giorni."""
    r = Settimanale(ogni=1, giorni=frozenset({LUN, GIO}), ancora=d("2026-09-21"))

    assert _giorni(r, "2026-09-21", "2026-10-04") == [
        "2026-09-21",
        "2026-09-24",
        "2026-09-28",
        "2026-10-01",
    ]


def test_ogni_due_settimane_segue_l_ancora():
    r = Settimanale(ogni=2, giorni=frozenset({MAR}), ancora=d("2026-09-22"))

    assert _giorni(r, "2026-09-01", "2026-10-31") == [
        "2026-09-08",
        "2026-09-22",
        "2026-10-06",
        "2026-10-20",
    ]


def test_l_ancora_da_la_fase_non_l_inizio():
    """Decisione 25: i ritiri prima dell'ancora ci sono."""
    r = Settimanale(ogni=2, giorni=frozenset({MAR}), ancora=d("2027-06-01"))

    assert genera(r, d("2027-05-18"))
    assert not genera(r, d("2027-05-25"))
    # Anni prima: 2027-06-01 e 2025-06-03 distano 104 settimane, un multiplo di 2.
    assert genera(r, d("2025-06-03"))
    assert not genera(r, d("2025-06-10"))


def test_l_ancora_puo_essere_un_giorno_qualsiasi_della_settimana():
    """Conta la settimana dell'ancora, non il giorno: domenica e lunedì non la cambiano."""
    domenica = Settimanale(ogni=2, giorni=frozenset({MAR}), ancora=d("2026-09-27"))
    lunedi = Settimanale(ogni=2, giorni=frozenset({MAR}), ancora=d("2026-09-21"))

    assert _giorni(domenica, "2026-09-01", "2026-10-31") == _giorni(
        lunedi, "2026-09-01", "2026-10-31"
    )


def test_ogni_tre_settimane_attraverso_l_anno():
    r = Settimanale(ogni=3, giorni=frozenset({VEN}), ancora=d("2026-12-18"))

    assert _giorni(r, "2026-12-01", "2027-01-31") == [
        "2026-12-18",
        "2027-01-08",
        "2027-01-29",
    ]


@pytest.mark.parametrize(
    ("posizioni", "attesi"),
    [
        ([1], ["2026-10-01"]),
        ([2, 4], ["2026-10-08", "2026-10-22"]),
        # Ottobre 2026 ha cinque giovedì: l'ultimo è il quinto.
        ([ULTIMA], ["2026-10-29"]),
        ([4, ULTIMA], ["2026-10-22", "2026-10-29"]),
    ],
)
def test_mensile_per_posizione(posizioni, attesi):
    r = MensilePosizione(posizioni=frozenset(posizioni), giorno=GIO)

    assert _giorni(r, "2026-10-01", "2026-10-31") == attesi


def test_ultimo_coincide_col_quarto_nei_mesi_con_quattro():
    """Febbraio 2026 ha quattro giovedì: "4°" e "ultimo" sono lo stesso giorno."""
    quarto = MensilePosizione(posizioni=frozenset({4}), giorno=GIO)
    ultimo = MensilePosizione(posizioni=frozenset({ULTIMA}), giorno=GIO)

    assert _giorni(quarto, "2026-02-01", "2026-02-28") == ["2026-02-26"]
    assert _giorni(ultimo, "2026-02-01", "2026-02-28") == ["2026-02-26"]


def test_mensile_per_data():
    r = MensileData(giorni=frozenset({1, 15}))

    assert _giorni(r, "2026-01-01", "2026-02-28") == [
        "2026-01-01",
        "2026-01-15",
        "2026-02-01",
        "2026-02-15",
    ]


def test_il_31_non_esiste_ad_aprile():
    """Decisione 26: nessuno spostamento all'ultimo giorno del mese."""
    r = MensileData(giorni=frozenset({31}))

    assert _giorni(r, "2026-03-01", "2026-05-31") == ["2026-03-31", "2026-05-31"]


def test_il_29_febbraio_solo_negli_anni_bisestili():
    r = MensileData(giorni=frozenset({29}))

    assert _giorni(r, "2027-02-01", "2027-02-28") == []
    assert _giorni(r, "2028-02-01", "2028-02-29") == ["2028-02-29"]


def test_sempre():
    assert copre(Sempre(), date(2000, 1, 1))
    assert copre(Sempre(), date(2099, 12, 31))


def test_annuale_nello_stesso_anno():
    p = Annuale(dal=(4, 1), al=(10, 31))

    assert not copre(p, d("2026-03-31"))
    assert copre(p, d("2026-04-01"))
    assert copre(p, d("2027-10-31"))
    assert not copre(p, d("2027-11-01"))


def test_annuale_a_cavallo_d_anno():
    p = Annuale(dal=(11, 1), al=(3, 31))

    assert copre(p, d("2026-11-01"))
    assert copre(p, d("2026-12-31"))
    assert copre(p, d("2027-01-01"))
    assert copre(p, d("2027-03-31"))
    assert not copre(p, d("2027-04-01"))
    assert not copre(p, d("2026-10-31"))


def test_annuale_contiene_il_29_febbraio_quando_c_e():
    p = Annuale(dal=(2, 1), al=(3, 1))

    assert copre(p, d("2028-02-29"))


def test_annuale_di_un_solo_giorno():
    p = Annuale(dal=(8, 15), al=(8, 15))

    assert copre(p, d("2026-08-15"))
    assert not copre(p, d("2026-08-14"))
    assert not copre(p, d("2026-08-16"))


def test_con_anno_estremi_inclusi():
    p = ConAnno(dal=d("2027-01-01"), al=d("2027-12-31"))

    assert copre(p, d("2027-01-01"))
    assert copre(p, d("2027-12-31"))
    assert not copre(p, d("2026-12-31"))
    assert not copre(p, d("2028-01-01"))
