"""Quello che le entità mostrano, ricavato da un calcolo già fatto (SPEC §9.2).

Funzioni pure: ricevono il risultato di `calcola`, l'istante corrente e le conferme,
e non leggono nulla da sole (INV-1).
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from datetime import date, datetime
from typing import Any

from .calendario import Risultato, Ritiro

Conferme = frozenset[tuple[date, str]]


def conferme_da_stato(voci: Iterable[Mapping[str, Any]]) -> Conferme:
    """Le coppie (data, tipologia) confermate, dall'elenco persistito nello stato."""
    return frozenset(
        (date.fromisoformat(v["data"]), v["tipologia"])
        for v in voci
        if isinstance(v, Mapping) and "data" in v and "tipologia" in v
    )


def del_giorno(risultato: Risultato, giorno: date) -> tuple[Ritiro, ...]:
    return tuple(r for r in risultato.ritiri if r.data == giorno)


def confermato(ritiro: Ritiro, conferme: Conferme) -> bool:
    return (ritiro.data, ritiro.tipologia) in conferme


def da_esporre(
    risultato: Risultato, ora: datetime, conferme: Conferme
) -> tuple[Ritiro, ...]:
    """I ritiri con la finestra di esposizione aperta e non ancora confermati.

    La sospensione dei promemoria non conta: riguarda le notifiche, non i fatti.
    """
    return tuple(
        r
        for r in risultato.ritiri
        if r.inizio_esposizione <= ora < r.fine_esposizione
        and not confermato(r, conferme)
    )


def prossimo(risultato: Risultato, tipologia: str, oggi: date) -> Ritiro | None:
    """Il primo ritiro della tipologia da oggi in poi, nel risultato."""
    return next(
        (r for r in risultato.ritiri if r.tipologia == tipologia and r.data >= oggi),
        None,
    )


def prossimo_evento(risultato: Risultato, oggi: date) -> Ritiro | None:
    """Il primo ritiro da oggi in poi, di qualsiasi tipologia."""
    return next((r for r in risultato.ritiri if r.data >= oggi), None)


def prossimo_cambiamento(risultato: Risultato, ora: datetime) -> datetime | None:
    """Il primo istante dopo `ora` in cui una finestra si apre o si chiude.

    È lì che il sensore "da esporre" cambia stato: lo schedulatore si sveglia allora.
    """
    istanti = (
        istante
        for r in risultato.ritiri
        for istante in (r.inizio_esposizione, r.fine_esposizione)
        if istante > ora
    )
    return min(istanti, default=None)


def festivi_da_gestire(risultato: Risultato, dal: date, al: date) -> tuple[Ritiro, ...]:
    """I ritiri festivi tra `dal` e `al` con l'avviso ancora attivo (non ignorato).

    `calcola` produce l'anomalia `ritiro_festivo` solo per quelli non ignorati.
    """
    attivi = {
        (a.data, a.tipologia)
        for a in risultato.anomalie
        if a.codice == "ritiro_festivo"
    }
    return tuple(
        r
        for r in risultato.ritiri
        if dal <= r.data <= al and (r.data, r.tipologia) in attivi
    )
