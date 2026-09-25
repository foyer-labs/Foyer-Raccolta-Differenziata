"""Costruttori di configurazioni grezze per i test del nucleo."""

from __future__ import annotations

from datetime import date
from typing import Any
from zoneinfo import ZoneInfo

from custom_components.foyer_raccolta_differenziata.core.modello import (
    Configurazione,
    carica,
)
from custom_components.foyer_raccolta_differenziata.core.validazione import (
    ConfigurazioneNonValida,
    problemi,
)

ROMA = ZoneInfo("Europe/Rome")


def tipologia(id_: str, nome: str | None = None, **altro: Any) -> dict[str, Any]:
    return {
        "id": id_,
        "nome": id_.capitalize() if nome is None else nome,
        "colore": "#795548",
        "icona": "mdi:trash-can",
        "note": "",
        "esposizione": None,
        **altro,
    }


def settimanale(giorni: list[int], ogni: int = 1, ancora: str = "2026-01-05"):
    return {"tipo": "settimanale", "ogni": ogni, "giorni": giorni, "ancora": ancora}


def mensile_posizione(posizioni: list[int], giorno: int):
    return {"tipo": "mensile_posizione", "posizioni": posizioni, "giorno": giorno}


def mensile_data(giorni: list[int]):
    return {"tipo": "mensile_data", "giorni": giorni}


SEMPRE = {"tipo": "sempre"}


def annuale(dal: str, al: str):
    return {"tipo": "annuale", "dal": dal, "al": al}


def con_anno(dal: str, al: str):
    return {"tipo": "con_anno", "dal": dal, "al": al}


def regola(
    id_: str, tip: str, ricorrenza: dict, periodo: dict | None = None, nome: str = ""
) -> dict[str, Any]:
    return {
        "id": id_,
        "tipologia": tip,
        "nome": nome,
        "ricorrenza": ricorrenza,
        "periodo": periodo or SEMPRE,
    }


def aggiungi(id_: str, tip: str, data: str) -> dict[str, Any]:
    return {"id": id_, "tipo": "aggiungi", "tipologia": tip, "data": data}


def togli(id_: str, tip: str, data: str) -> dict[str, Any]:
    return {"id": id_, "tipo": "togli", "tipologia": tip, "data": data}


def sposta(id_: str, tip: str, da: str, a: str) -> dict[str, Any]:
    return {"id": id_, "tipo": "sposta", "tipologia": tip, "da": da, "a": a}


def grezza(
    tipologie: list[dict] | None = None,
    regole: list[dict] | None = None,
    eccezioni: list[dict] | None = None,
    **altro: Any,
) -> dict[str, Any]:
    return {
        "revisione": 1,
        "tipologie": tipologie if tipologie is not None else [tipologia("umido")],
        "regole": regole or [],
        "eccezioni": eccezioni or [],
        "esposizione": {
            "inizio_giorno": "giorno_prima",
            "inizio_ora": "20:00",
            "fine_ora": "06:00",
        },
        "patrono": None,
        "valido_fino_al": None,
        **altro,
    }


def configura(**kwargs: Any) -> Configurazione:
    """Una configurazione validata e caricata; fallisce se non è valida."""
    dati = grezza(**kwargs)
    trovati = problemi(dati)
    if trovati:
        raise ConfigurazioneNonValida(trovati)
    return carica(dati)


def d(testo: str) -> date:
    return date.fromisoformat(testo)
