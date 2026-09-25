"""Quando una regola genera un ritiro (SPEC §4.2.1, §4.2.2)."""

from __future__ import annotations

from calendar import monthrange
from datetime import date, timedelta

from .modello import (
    ULTIMA,
    Annuale,
    ConAnno,
    MensileData,
    MensilePosizione,
    Periodo,
    Ricorrenza,
    Settimanale,
)


def lunedi(giorno: date) -> date:
    """Il lunedì della settimana che contiene `giorno`."""
    return giorno - timedelta(days=giorno.weekday())


def genera(ricorrenza: Ricorrenza, giorno: date) -> bool:
    """Vero se la ricorrenza produce un ritiro in `giorno`, periodo a parte."""
    if isinstance(ricorrenza, Settimanale):
        if giorno.weekday() not in ricorrenza.giorni:
            return False
        # Le settimane iniziano il lunedì; l'ancora dà la fase, non l'inizio, e il
        # conto vale anche prima di lei (decisione 25).
        settimane = (lunedi(giorno) - lunedi(ricorrenza.ancora)).days // 7
        return settimane % ricorrenza.ogni == 0
    if isinstance(ricorrenza, MensilePosizione):
        if giorno.weekday() != ricorrenza.giorno:
            return False
        posizione = (giorno.day - 1) // 7 + 1
        if posizione in ricorrenza.posizioni:
            return True
        ultimo_del_mese = monthrange(giorno.year, giorno.month)[1]
        return ULTIMA in ricorrenza.posizioni and giorno.day + 7 > ultimo_del_mese
    if isinstance(ricorrenza, MensileData):
        # Un giorno che il mese non ha non viene mai chiesto: 31 aprile non è una
        # data, quindi il ritiro non avviene (decisione 26).
        return giorno.day in ricorrenza.giorni
    raise TypeError(ricorrenza)


def copre(periodo: Periodo, giorno: date) -> bool:
    """Vero se il periodo vale in `giorno`."""
    if isinstance(periodo, Annuale):
        chiave = (giorno.month, giorno.day)
        if periodo.dal <= periodo.al:
            return periodo.dal <= chiave <= periodo.al
        # A cavallo d'anno (01/11 → 31/03).
        return chiave >= periodo.dal or chiave <= periodo.al
    if isinstance(periodo, ConAnno):
        return periodo.dal <= giorno <= periodo.al
    return True
