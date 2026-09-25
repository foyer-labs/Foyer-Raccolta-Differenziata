"""Ritiri, anomalie e differenze come dati semplici per il frontend (SPEC §9.4)."""

from __future__ import annotations

from typing import Any

from .calendario import Anomalia, Risultato, Ritiro
from .validazione import Problema


def ritiro(r: Ritiro) -> dict[str, Any]:
    return {
        "data": r.data.isoformat(),
        "tipologia": r.tipologia,
        "origine": r.origine.tipo,
        "regole": list(r.origine.regole),
        "spostato_dal": r.origine.da.isoformat() if r.origine.da else None,
        "inizio_esposizione": r.inizio_esposizione.isoformat(),
        "fine_esposizione": r.fine_esposizione.isoformat(),
        "festivo": r.festivo,
        "da_verificare": r.da_verificare,
    }


def anomalia(a: Anomalia) -> dict[str, Any]:
    return {
        "codice": a.codice,
        "gravita": a.gravita,
        "tipologia": a.tipologia,
        "regole": list(a.regole),
        "eccezione": a.eccezione,
        "data": a.data.isoformat() if a.data else None,
        "intervalli": [[dal.isoformat(), al.isoformat()] for dal, al in a.intervalli],
        "giorni": list(a.giorni),
        "conteggio": a.conteggio,
    }


def problema(p: Problema) -> dict[str, str]:
    return {"percorso": p.percorso, "codice": p.codice}


def differenze(prima: Risultato | None, dopo: Risultato) -> dict[str, list[dict]]:
    """I ritiri che una modifica aggiunge e toglie, per la finestra "Prima di salvare".

    Senza un calcolo precedente (configurazione non valida) tutto è un'aggiunta.
    """
    vecchi = {(r.data, r.tipologia) for r in prima.ritiri} if prima else set()
    nuovi = {(r.data, r.tipologia) for r in dopo.ritiri}

    def _elenco(chiavi: set) -> list[dict]:
        return [
            {"data": giorno.isoformat(), "tipologia": tipologia}
            for giorno, tipologia in sorted(chiavi)
        ]

    return {"aggiunti": _elenco(nuovi - vecchi), "tolti": _elenco(vecchi - nuovi)}
