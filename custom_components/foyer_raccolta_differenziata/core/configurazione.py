"""La configurazione iniziale e lo stato vuoto (SPEC §5, §11).

La forma completa della configurazione, con la sua validazione, arriva con il
motore (Fase 1). Qui c'è solo quello che serve a creare il primo archivio a partire
dalle scelte del config flow.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable
from typing import Any

from .preset import CHIAVI_PRESET, PRESET

GIORNO_PRIMA = "giorno_prima"
GIORNO_STESSO = "giorno_stesso"
INIZI_POSSIBILI = (GIORNO_PRIMA, GIORNO_STESSO)

# Finestra di esposizione predefinita (SPEC §4.5): dalle 20:00 del giorno prima alle
# 06:00 del giorno del ritiro.
FINESTRA_PREDEFINITA: dict[str, str] = {
    "inizio_giorno": GIORNO_PRIMA,
    "inizio_ora": "20:00",
    "fine_ora": "06:00",
}


def _minuti(ora: str) -> int:
    """Minuti dalla mezzanotte di un orario "HH:MM"; ValueError se non lo è."""
    parti = ora.split(":")
    if len(parti) != 2 or not all(p.isdigit() and len(p) == 2 for p in parti):
        raise ValueError(f"orario non valido: {ora!r}")
    ore, minuti = int(parti[0]), int(parti[1])
    if ore > 23 or minuti > 59:
        raise ValueError(f"orario non valido: {ora!r}")
    return ore * 60 + minuti


def errore_finestra(inizio_giorno: str, inizio_ora: str, fine_ora: str) -> str | None:
    """Il codice d'errore di una finestra di esposizione, o None se è valida.

    Con inizio il giorno prima la fine cade sempre dopo l'inizio; con inizio il
    giorno stesso la fine deve venire dopo l'ora d'inizio (SPEC §4.5).
    """
    if inizio_giorno not in INIZI_POSSIBILI:
        return "inizio_giorno_non_valido"
    try:
        inizio, fine = _minuti(inizio_ora), _minuti(fine_ora)
    except ValueError:
        return "orario_non_valido"
    if inizio_giorno == GIORNO_STESSO and fine <= inizio:
        return "fine_prima_di_inizio"
    return None


def configurazione_iniziale(
    preset_scelti: Iterable[str],
    finestra: dict[str, str],
    genera_id: Callable[[], str],
) -> dict[str, Any]:
    """La prima configurazione salvata, dalle scelte del config flow.

    `genera_id` è un parametro perché gli identificatori sono casuali (SPEC §4:
    stabili e mai riutilizzati) e il nucleo non tocca fonti di casualità da solo.
    Le tipologie seguono l'ordine dei preset, non quello della scelta.
    """
    scelti = set(preset_scelti)
    sconosciuti = scelti - set(CHIAVI_PRESET)
    if sconosciuti:
        raise ValueError(f"preset sconosciuti: {sorted(sconosciuti)}")
    errore = errore_finestra(
        finestra["inizio_giorno"], finestra["inizio_ora"], finestra["fine_ora"]
    )
    if errore:
        raise ValueError(errore)

    tipologie = [
        {
            "id": genera_id(),
            "nome": p.nome,
            "colore": p.colore,
            "icona": p.icona,
            "note": "",
            "esposizione": None,
        }
        for p in PRESET
        if p.chiave in scelti
    ]
    return {
        "revisione": 1,
        "tipologie": tipologie,
        "regole": [],
        "eccezioni": [],
        "esposizione": {
            "inizio_giorno": finestra["inizio_giorno"],
            "inizio_ora": finestra["inizio_ora"],
            "fine_ora": finestra["fine_ora"],
        },
        "patrono": None,
        "valido_fino_al": None,
        "promemoria": [],
        # SPEC §4.9: spenti all'installazione, un richiamo ogni 30 minuti se accesi.
        "solleciti": {"attivi": False, "richiami": 1, "richiamo_dopo": 30},
        "sospensioni": [],
    }


def stato_vuoto() -> dict[str, Any]:
    """Lo stato persistito di un'installazione appena fatta (SPEC §11, INV-3)."""
    return {
        "conferme": [],
        "invii_fatti": [],
        "pendenti": [],
        "anomalie_ignorate": [],
        "ultimo_istante_attivo": None,
    }
