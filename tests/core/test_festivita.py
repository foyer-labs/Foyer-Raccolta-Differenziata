"""Festività italiane (SPEC §4.4)."""

from __future__ import annotations

from datetime import date

import pytest

from custom_components.foyer_raccolta_differenziata.core.festivita import (
    festivita,
    festivita_del_giorno,
    pasqua,
)
from custom_components.foyer_raccolta_differenziata.core.modello import Patrono

# Tabella nota della Pasqua gregoriana, 2000-2049.
PASQUE = {
    2000: (4, 23), 2001: (4, 15), 2002: (3, 31), 2003: (4, 20), 2004: (4, 11),
    2005: (3, 27), 2006: (4, 16), 2007: (4, 8), 2008: (3, 23), 2009: (4, 12),
    2010: (4, 4), 2011: (4, 24), 2012: (4, 8), 2013: (3, 31), 2014: (4, 20),
    2015: (4, 5), 2016: (3, 27), 2017: (4, 16), 2018: (4, 1), 2019: (4, 21),
    2020: (4, 12), 2021: (4, 4), 2022: (4, 17), 2023: (4, 9), 2024: (3, 31),
    2025: (4, 20), 2026: (4, 5), 2027: (3, 28), 2028: (4, 16), 2029: (4, 1),
    2030: (4, 21), 2031: (4, 13), 2032: (3, 28), 2033: (4, 17), 2034: (4, 9),
    2035: (3, 25), 2036: (4, 13), 2037: (4, 5), 2038: (4, 25), 2039: (4, 10),
    2040: (4, 1), 2041: (4, 21), 2042: (4, 6), 2043: (3, 29), 2044: (4, 17),
    2045: (4, 9), 2046: (3, 25), 2047: (4, 14), 2048: (4, 5), 2049: (4, 18),
}  # fmt: skip


@pytest.mark.parametrize("anno", sorted(PASQUE))
def test_pasqua(anno):
    assert pasqua(anno) == date(anno, *PASQUE[anno])


def test_le_festivita_del_2026():
    assert festivita(2026, None) == {
        date(2026, 1, 1): "Capodanno",
        date(2026, 1, 6): "Epifania",
        date(2026, 4, 5): "Pasqua",
        date(2026, 4, 6): "Lunedì dell'Angelo",
        date(2026, 4, 25): "Festa della Liberazione",
        date(2026, 5, 1): "Festa del lavoro",
        date(2026, 6, 2): "Festa della Repubblica",
        date(2026, 8, 15): "Ferragosto",
        date(2026, 10, 4): "San Francesco d'Assisi",
        date(2026, 11, 1): "Ognissanti",
        date(2026, 12, 8): "Immacolata Concezione",
        date(2026, 12, 25): "Natale",
        date(2026, 12, 26): "Santo Stefano",
    }


def test_il_4_ottobre_e_festivo_solo_dal_2026():
    """Decisione 29: Legge 151/2025, in vigore dal 1° gennaio 2026."""
    assert festivita_del_giorno(date(2025, 10, 4), None) is None
    assert festivita_del_giorno(date(2026, 10, 4), None) == "San Francesco d'Assisi"
    assert festivita_del_giorno(date(2040, 10, 4), None) == "San Francesco d'Assisi"


def test_il_patrono():
    ambrogio = Patrono(mese=12, giorno=7, nome="Sant'Ambrogio")

    assert festivita_del_giorno(date(2026, 12, 7), ambrogio) == "Sant'Ambrogio"
    assert festivita_del_giorno(date(2026, 12, 7), None) is None


def test_il_patrono_su_una_festivita_nazionale_prende_il_nome_nazionale():
    """Roma: Santi Pietro e Paolo è il 29 giugno; qui un patrono finto sul 2 giugno."""
    patrono = Patrono(mese=6, giorno=2, nome="Patrono di prova")

    assert festivita_del_giorno(date(2026, 6, 2), patrono) == "Festa della Repubblica"


def test_un_giorno_feriale():
    assert festivita_del_giorno(date(2026, 9, 25), None) is None
