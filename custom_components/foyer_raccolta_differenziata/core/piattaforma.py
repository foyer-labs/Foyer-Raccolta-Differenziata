"""Gli orari della piattaforma ecologica (SPEC §4.10, decisioni 62-68).

Tutto puro, come il resto del nucleo: l'istante corrente e il fuso sono parametri.

Per un giorno valgono, in ordine:

1. un'eccezione su quella data (chiusa, o aperta con le sue fasce);
2. un giorno festivo, nazionale o del patrono: chiusa;
3. il periodo che copre la data: le fasce di quel giorno della settimana;
4. nessun periodo: l'orario **non è indicato**. Mai "chiusa": il sistema non lo sa
   (lo stesso principio di INV-2).
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta, tzinfo
from typing import Literal

from .calendario import Anomalia, istante_locale
from .festivita import festivita_del_giorno
from .modello import Fascia, Patrono, PeriodoPiattaforma, Piattaforma

# Quanti giorni prima della fine dell'ultimo periodo scatta l'avviso (decisione 65).
PREAVVISO_GIORNI = 30
# Fin dove si cerca la prossima apertura.
RICERCA_GIORNI = 60

Motivo = Literal["periodo", "eccezione", "festivo"]


@dataclass(frozen=True)
class Giorno:
    """L'orario di un giorno. `fasce` None: nessun periodo lo copre."""

    data: date
    fasce: tuple[Fascia, ...] | None
    motivo: Motivo | None
    festivo: str | None = None
    nota: str = ""


@dataclass(frozen=True)
class Stato:
    """Aperta adesso? `aperta` None: l'orario di oggi non è indicato."""

    aperta: bool | None
    chiude: datetime | None = None
    apre: datetime | None = None


def _periodo_del(p: Piattaforma, d: date) -> PeriodoPiattaforma | None:
    return next((q for q in p.periodi if q.dal <= d <= q.al), None)


def giorno(p: Piattaforma, d: date, patrono: Patrono | None) -> Giorno:
    eccezione = next((e for e in p.eccezioni if e.data == d), None)
    if eccezione is not None:
        return Giorno(d, eccezione.fasce, "eccezione", nota=eccezione.nota)
    festivo = festivita_del_giorno(d, patrono)
    if festivo is not None:
        return Giorno(d, (), "festivo", festivo=festivo)
    periodo = _periodo_del(p, d)
    if periodo is None:
        return Giorno(d, None, None)
    return Giorno(d, periodo.settimana[d.weekday()], "periodo")


def giorni(
    p: Piattaforma, dal: date, quanti: int, patrono: Patrono | None
) -> tuple[Giorno, ...]:
    return tuple(giorno(p, dal + timedelta(days=i), patrono) for i in range(quanti))


def _intervalli(g: Giorno, fuso: tzinfo) -> tuple[tuple[datetime, datetime], ...]:
    return tuple(
        (istante_locale(g.data, inizio, fuso), istante_locale(g.data, fine, fuso))
        for inizio, fine in (g.fasce or ())
    )


def stato(
    p: Piattaforma, ora: datetime, fuso: tzinfo, patrono: Patrono | None
) -> Stato:
    """Aperta o chiusa in questo istante, fino a quando e quando riapre.

    La prossima apertura si cerca nei 60 giorni seguenti, fermandosi al primo giorno
    senza orario indicato: oltre quello non si sa.
    """
    oggi = ora.astimezone(fuso).date()
    primo = giorno(p, oggi, patrono)
    if primo.fasce is None:
        return Stato(None)
    for inizio, fine in _intervalli(primo, fuso):
        if inizio <= ora < fine:
            return Stato(True, chiude=fine)
    for scarto in range(RICERCA_GIORNI):
        g = primo if scarto == 0 else giorno(p, oggi + timedelta(days=scarto), patrono)
        if g.fasce is None:
            break
        for inizio, _fine in _intervalli(g, fuso):
            if inizio > ora:
                return Stato(False, apre=inizio)
    return Stato(False)


def prossimo_cambio(
    p: Piattaforma, ora: datetime, fuso: tzinfo, patrono: Patrono | None
) -> datetime:
    """Il prossimo istante in cui `stato` può cambiare: un'apertura, una chiusura, o
    la mezzanotte (un giorno nuovo può non avere un orario indicato)."""
    oggi = ora.astimezone(fuso).date()
    mezzanotte = istante_locale(oggi + timedelta(days=1), datetime.min.time(), fuso)
    confini = [
        istante
        for intervallo in _intervalli(giorno(p, oggi, patrono), fuso)
        for istante in intervallo
        if istante > ora
    ]
    return min([*confini, mezzanotte])


def anomalie_piattaforma(p: Piattaforma | None, oggi: date) -> tuple[Anomalia, ...]:
    """Orario di oggi non indicato, o l'ultimo periodo che finisce entro 30 giorni."""
    if p is None or not p.periodi:
        return ()
    if not any(q.dal <= oggi <= q.al for q in p.periodi):
        # Una data futura coperta c'è? Allora è un buco; altrimenti è scaduto.
        prossimo = min((q.dal for q in p.periodi if q.dal > oggi), default=None)
        return (Anomalia("piattaforma_senza_orario", "avviso", data=prossimo),)
    # La fine dell'orario continuo da oggi: un periodo che parte il giorno dopo la
    # fine di un altro lo prolunga; il primo buco è dove l'orario finisce.
    fine = next(q.al for q in p.periodi if q.dal <= oggi <= q.al)
    while seguente := _periodo_del(p, fine + timedelta(days=1)):
        fine = seguente.al  # sempre più avanti: i periodi non si sovrappongono
    if (fine - oggi).days <= PREAVVISO_GIORNI:
        return (Anomalia("piattaforma_in_scadenza", "avviso", data=fine),)
    return ()
