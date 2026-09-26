"""Ogni codice d'errore che l'utente può vedere ha il suo messaggio in italiano.

Senza, il pannello mostrava il codice grezzo ("nota_troppo_lunga").
"""

from __future__ import annotations

from pathlib import Path
import re

RADICE = Path(__file__).resolve().parents[2]
CORE = RADICE / "custom_components" / "foyer_raccolta_differenziata"
TESTI = RADICE / "frontend" / "src" / "comune" / "testi.ts"
SORGENTI = [
    CORE / "core" / "validazione.py",
    CORE / "core" / "configurazione.py",
    CORE / "core" / "tabelle.py",
    CORE / "excel.py",
    CORE / "scambio_excel.py",
]
CHIAMATE = re.compile(
    r"""(?:segnala|Problema|ValoreNonValido|FileNonValido|_errore|errore|Errore)\([^()]*?"([a-z0-9_]+)"\)"""
)


def _codici() -> set[str]:
    trovati: set[str] = set()
    for sorgente in SORGENTI:
        testo = sorgente.read_text(encoding="utf-8")
        trovati |= set(CHIAMATE.findall(testo))
        if sorgente.parent.name == "core" and sorgente.stem in (
            "validazione",
            "configurazione",
        ):
            # Le funzioni che restituiscono un codice d'errore (errore_finestra).
            trovati |= set(re.findall(r'return "([a-z0-9_]+)"', testo))
    return trovati


def test_ogni_codice_ha_un_messaggio():
    testi = TESTI.read_text(encoding="utf-8")
    chiavi = set(re.findall(r'^\s+"?([a-z0-9_]+)"?: "', testi, re.M))
    mancanti = sorted(c for c in _codici() if c not in chiavi)
    assert not mancanti, f"codici senza messaggio in testi.ts: {mancanti}"


def test_il_test_trova_i_codici():
    assert {
        "nota_troppo_lunga",
        "fascia_non_valida",
        "valore_mancante",
        "file_non_valido",
    } <= _codici()
