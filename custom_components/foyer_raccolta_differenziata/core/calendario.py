"""Il motore di calcolo (SPEC §6).

Due funzioni pure:

* `calcola(config, dal, al, fuso, festivi_ignorati)`: i ritiri di un intervallo e le
  anomalie legate ai singoli ritiri (i giorni festivi);
* `anomalie(config, oggi)`: le anomalie della configurazione vista da oggi —
  sovrapposizioni, eccezioni, giorni inesistenti, tipologie ferme, validità.

Nessuna delle due legge l'orologio: `oggi` e il fuso orario sono parametri (INV-1).
"""

from __future__ import annotations

from calendar import monthrange
from collections.abc import Iterable, Iterator
from dataclasses import dataclass
from datetime import UTC, date, datetime, time, timedelta, tzinfo
from itertools import combinations
from typing import Literal

from .festivita import festivita_del_giorno
from .modello import (
    Annuale,
    ConAnno,
    Configurazione,
    Eccezione,
    MensileData,
    Regola,
    Tipologia,
)
from .ricorrenze import copre, genera

# Le entità e le anomalie guardano al massimo 366 giorni avanti (SPEC §6.2).
ORIZZONTE_GIORNI = 366
# Quanti giorni prima della validità scatta l'avviso (SPEC §9.3).
PREAVVISO_VALIDITA_GIORNI = 30

TipoOrigine = Literal["regola", "aggiunto", "spostato"]
Gravita = Literal["avviso", "info"]


@dataclass(frozen=True)
class Origine:
    """Da dove viene un ritiro: le regole che lo generano, un'aggiunta, uno
    spostamento."""

    tipo: TipoOrigine
    regole: tuple[str, ...] = ()
    da: date | None = None


@dataclass(frozen=True)
class Ritiro:
    data: date
    tipologia: str
    origine: Origine
    inizio_esposizione: datetime
    fine_esposizione: datetime
    festivo: str | None
    da_verificare: bool


@dataclass(frozen=True)
class Anomalia:
    """Una situazione segnalata e non corretta (SPEC §6.3).

    I campi usati dipendono dal codice: `regole` per le sovrapposizioni e i giorni
    inesistenti, `eccezione` per le eccezioni, `data` per festivi e validità,
    `intervalli` per le sovrapposizioni, `giorni` per i giorni inesistenti.
    """

    codice: str
    gravita: Gravita
    tipologia: str | None = None
    regole: tuple[str, ...] = ()
    eccezione: str | None = None
    data: date | None = None
    intervalli: tuple[tuple[date, date], ...] = ()
    giorni: tuple[int, ...] = ()
    conteggio: int = 0


@dataclass(frozen=True)
class Risultato:
    ritiri: tuple[Ritiro, ...]
    anomalie: tuple[Anomalia, ...]


def _giorni(dal: date, al: date) -> Iterator[date]:
    giorno = dal
    while giorno <= al:
        yield giorno
        giorno += timedelta(days=1)


def _regole_per_tipologia(config: Configurazione) -> dict[str, tuple[Regola, ...]]:
    return {
        t.id: tuple(r for r in config.regole if r.tipologia == t.id)
        for t in config.tipologie
    }


def _regole_in_vigore(regole: Iterable[Regola], giorno: date) -> tuple[Regola, ...]:
    """Le regole di una tipologia che valgono in `giorno`, dopo la precedenza.

    Se almeno una regola con anno copre il giorno, quelle annuali e "sempre" cedono
    (decisioni 5 e 28). Le rimaste si sommano (decisione 22).
    """
    coprono = tuple(r for r in regole if copre(r.periodo, giorno))
    con_anno = tuple(r for r in coprono if isinstance(r.periodo, ConAnno))
    return con_anno or coprono


def _generatrici(regole: Iterable[Regola], giorno: date) -> tuple[str, ...]:
    """Gli id delle regole in vigore che producono un ritiro in `giorno`."""
    return tuple(
        r.id for r in _regole_in_vigore(regole, giorno) if genera(r.ricorrenza, giorno)
    )


def _mappa(
    regole: tuple[Regola, ...],
    eccezioni: Iterable[Eccezione],
    dal: date,
    al: date,
) -> dict[date, Origine]:
    """I giorni di ritiro di una tipologia in [dal, al], con la loro origine.

    Le eccezioni si applicano dopo le regole (SPEC §4.3), in quest'ordine: togli,
    partenze degli spostamenti, arrivi degli spostamenti, aggiungi. Separare
    partenze e arrivi rende il risultato indipendente dall'ordine degli
    spostamenti: uno che arriva dove un altro parte resta.
    """
    giorni: dict[date, Origine] = {}
    for giorno in _giorni(dal, al):
        generatrici = _generatrici(regole, giorno)
        if generatrici:
            giorni[giorno] = Origine("regola", regole=generatrici)

    eccezioni = tuple(eccezioni)
    for e in eccezioni:
        if e.tipo == "togli":
            giorni.pop(e.data, None)
    for e in eccezioni:
        if e.tipo == "sposta":
            giorni.pop(e.data, None)
    for e in eccezioni:
        if e.tipo == "sposta" and e.a is not None and dal <= e.a <= al:
            # Un arrivo su un giorno che ha già il ritiro lascia un solo ritiro.
            giorni.setdefault(e.a, Origine("spostato", da=e.data))
    for e in eccezioni:
        if e.tipo == "aggiungi" and dal <= e.data <= al:
            giorni.setdefault(e.data, Origine("aggiunto"))
    return giorni


def istante_locale(giorno: date, ora: time, fuso: tzinfo) -> datetime:
    """L'istante locale di `giorno` alle `ora` (SPEC §8.1).

    Un orario che esiste due volte (il ritorno all'ora solare) vale alla prima
    occorrenza. Un orario che il passaggio all'ora legale salta (le 02:30 dell'ultima
    domenica di marzo) vale al primo minuto valido dopo il salto: le 03:00.
    """
    ingenuo = datetime.combine(giorno, ora, tzinfo=fuso)
    istante = ingenuo.astimezone(UTC).astimezone(fuso)
    voluto = ingenuo.replace(tzinfo=None)
    if istante.replace(tzinfo=None) == voluto:
        return istante
    # Orario saltato: si torna indietro, un minuto alla volta in UTC, finché il minuto
    # precedente cadrebbe prima dell'orario voluto. Al massimo l'ampiezza del salto.
    while True:
        precedente = (istante.astimezone(UTC) - timedelta(minutes=1)).astimezone(fuso)
        if precedente.replace(tzinfo=None) < voluto:
            return istante
        istante = precedente


_istante = istante_locale


def calcola(
    config: Configurazione,
    dal: date,
    al: date,
    fuso: tzinfo,
    festivi_ignorati: frozenset[tuple[date, str]] = frozenset(),
) -> Risultato:
    """I ritiri tra `dal` e `al` inclusi, ordinati per data e per tipologia.

    `festivi_ignorati` contiene le coppie (data, id tipologia) per cui l'utente ha
    scelto "Ignora" sull'avviso di giorno festivo (SPEC §4.4).
    """
    if al < dal:
        raise ValueError("intervallo vuoto: al è prima di dal")
    regole = _regole_per_tipologia(config)
    ritiri: list[Ritiro] = []
    anomalie: list[Anomalia] = []
    for tipologia in config.tipologie:
        eccezioni = (e for e in config.eccezioni if e.tipologia == tipologia.id)
        finestra = config.finestra_di(tipologia)
        for giorno, origine in _mappa(regole[tipologia.id], eccezioni, dal, al).items():
            inizio = giorno - timedelta(days=1) if finestra.giorno_prima else giorno
            festivo = festivita_del_giorno(giorno, config.patrono)
            ritiri.append(
                Ritiro(
                    data=giorno,
                    tipologia=tipologia.id,
                    origine=origine,
                    inizio_esposizione=_istante(inizio, finestra.inizio, fuso),
                    fine_esposizione=_istante(giorno, finestra.fine, fuso),
                    festivo=festivo,
                    da_verificare=(
                        config.valido_fino_al is not None
                        and giorno > config.valido_fino_al
                    ),
                )
            )
            if festivo and (giorno, tipologia.id) not in festivi_ignorati:
                anomalie.append(
                    Anomalia(
                        "ritiro_festivo", "avviso", tipologia=tipologia.id, data=giorno
                    )
                )
    posizione = {t.id: i for i, t in enumerate(config.tipologie)}
    ritiri.sort(key=lambda r: (r.data, posizione[r.tipologia]))
    anomalie.sort(key=lambda a: (a.data, posizione[a.tipologia or ""]))
    return Risultato(tuple(ritiri), tuple(anomalie))


def _intervalli(giorni: Iterable[date]) -> tuple[tuple[date, date], ...]:
    """Raggruppa giorni ordinati in intervalli contigui."""
    risultato: list[tuple[date, date]] = []
    for giorno in giorni:
        if risultato and risultato[-1][1] + timedelta(days=1) == giorno:
            risultato[-1] = (risultato[-1][0], giorno)
        else:
            risultato.append((giorno, giorno))
    return tuple(risultato)


def _unisci(intervalli: Iterable[tuple[date, date]]) -> tuple[tuple[date, date], ...]:
    """Ordina e unisce intervalli che si toccano o si sovrappongono."""
    risultato: list[tuple[date, date]] = []
    for dal, al in sorted(intervalli):
        if risultato and dal <= risultato[-1][1] + timedelta(days=1):
            risultato[-1] = (risultato[-1][0], max(risultato[-1][1], al))
        else:
            risultato.append((dal, al))
    return tuple(risultato)


def _coperti(periodo, dal: date, al: date) -> tuple[tuple[date, date], ...]:
    """I giorni di [dal, al] che un periodo annuale o "sempre" copre, come intervalli.

    Calcolati anno per anno e non giorno per giorno: una regola con anno può arrivare
    al 2099, e il conto si rifà a ogni ricalcolo.
    """
    if not isinstance(periodo, Annuale):
        return ((dal, al),)
    pezzi = []
    for anno in range(dal.year - 1, al.year + 1):
        inizio = date(anno, *periodo.dal)
        fine = date(anno if periodo.dal <= periodo.al else anno + 1, *periodo.al)
        inizio, fine = max(inizio, dal), min(fine, al)
        if inizio <= fine:
            pezzi.append((inizio, fine))
    return _unisci(pezzi)


def _ancora_rilevante(regola: Regola, oggi: date) -> bool:
    """Una regola con anno finita prima di oggi non conta più."""
    return not (isinstance(regola.periodo, ConAnno) and regola.periodo.al < oggi)


def _sovrapposizioni_miste(
    tipologia: Tipologia, regole: tuple[Regola, ...], oggi: date
) -> list[Anomalia]:
    """Regole annuali o "sempre" che cedono a una con anno (decisioni 5, 28).

    Si guarda il periodo, non i giorni generati: la regola annuale viene ignorata
    per tutto il periodo sovrapposto, e l'utente deve saperlo.
    """
    trovate: list[Anomalia] = []
    senza_anno = [r for r in regole if not isinstance(r.periodo, ConAnno)]
    con_anno = [r for r in regole if isinstance(r.periodo, ConAnno)]
    for vince in con_anno:
        assert isinstance(vince.periodo, ConAnno)
        if vince.periodo.al < oggi:
            continue
        dal = max(vince.periodo.dal, oggi)
        for cede in senza_anno:
            intervalli = _coperti(cede.periodo, dal, vince.periodo.al)
            if intervalli:
                trovate.append(
                    Anomalia(
                        "sovrapposizione_mista",
                        "avviso",
                        tipologia=tipologia.id,
                        regole=(cede.id, vince.id),
                        intervalli=intervalli,
                    )
                )
    return trovate


def _sovrapposizioni_stesso_tipo(
    tipologia: Tipologia, regole: tuple[Regola, ...], oggi: date
) -> list[Anomalia]:
    """Due regole in vigore che generano lo stesso giorno: una è ridondante.

    Le regole si sommano (decisione 22), quindi periodi sovrapposti con giorni
    diversi ("lunedì" e "giovedì" come due regole) non sono un'anomalia: lo è solo
    lo stesso ritiro prodotto due volte.
    """
    condivisi: dict[tuple[str, str], list[date]] = {}
    for giorno in _giorni(oggi, oggi + timedelta(days=ORIZZONTE_GIORNI - 1)):
        generatrici = _generatrici(regole, giorno)
        for coppia in combinations(generatrici, 2):
            condivisi.setdefault(coppia, []).append(giorno)
    return [
        Anomalia(
            "sovrapposizione_stesso_tipo",
            "avviso",
            tipologia=tipologia.id,
            regole=coppia,
            intervalli=((giorni[0], giorni[-1]),),
            conteggio=len(giorni),
        )
        for coppia, giorni in condivisi.items()
    ]


def _anomalie_eccezioni(
    tipologia: Tipologia,
    regole: tuple[Regola, ...],
    eccezioni: tuple[Eccezione, ...],
    oggi: date,
) -> list[Anomalia]:
    """Eccezioni che non hanno effetto su un giorno di oggi o futuro (SPEC §4.3).

    Le eccezioni passate non si segnalano: il loro giorno è andato.
    """
    trovate: list[Anomalia] = []
    rimossi = {e.data for e in eccezioni if e.tipo in ("togli", "sposta")}
    aggiunti: set[date] = set()
    for e in eccezioni:
        if (
            e.tipo in ("togli", "sposta")
            and e.data >= oggi
            and not _generatrici(regole, e.data)
        ):
            trovate.append(
                Anomalia(
                    "eccezione_senza_ritiro",
                    "info",
                    tipologia=tipologia.id,
                    eccezione=e.id,
                    data=e.data,
                )
            )
    # Stesso ordine di `_mappa`: prima gli arrivi degli spostamenti, poi le aggiunte.
    arrivi = [(e, e.a) for e in eccezioni if e.tipo == "sposta" and e.a is not None]
    aggiunte = [(e, e.data) for e in eccezioni if e.tipo == "aggiungi"]
    for e, giorno in arrivi + aggiunte:
        gia_presente = giorno in aggiunti or (
            giorno not in rimossi and bool(_generatrici(regole, giorno))
        )
        aggiunti.add(giorno)
        if gia_presente and giorno >= oggi:
            trovate.append(
                Anomalia(
                    "eccezione_ridondante",
                    "info",
                    tipologia=tipologia.id,
                    eccezione=e.id,
                    data=giorno,
                )
            )
    return trovate


def _mese_piu_corto(regola: Regola, oggi: date) -> int:
    """Quanti giorni ha il mese più corto in cui la regola vale, da oggi in poi.

    Per i periodi senza anno conta febbraio non bisestile (28): prima o poi arriva.
    """
    periodo = regola.periodo
    if isinstance(periodo, ConAnno):
        dal, al = max(periodo.dal, oggi), periodo.al
        corto, mese = 31, date(dal.year, dal.month, 1)
        while mese <= al:
            corto = min(corto, monthrange(mese.year, mese.month)[1])
            mese = date(mese.year + mese.month // 12, mese.month % 12 + 1, 1)
        return corto
    # Un anno non bisestile qualsiasi: i mesi che il periodo tocca.
    corto = 31
    for mese in range(1, 13):
        primo, ultimo = date(2027, mese, 1), date(2027, mese, monthrange(2027, mese)[1])
        if any(copre(periodo, g) for g in (primo, ultimo)) or (
            isinstance(periodo, Annuale) and _coperti(periodo, primo, ultimo)
        ):
            corto = min(corto, monthrange(2027, mese)[1])
    return corto


def anomalie(config: Configurazione, oggi: date) -> tuple[Anomalia, ...]:
    """Le anomalie della configurazione, viste da `oggi` (SPEC §6.3).

    Riguardano oggi e il futuro: una regola con anno già finita, un'eccezione
    passata o una sovrapposizione conclusa non si segnalano più. Le anomalie dei
    giorni festivi vengono da `calcola`.
    """
    regole = _regole_per_tipologia(config)
    fine_orizzonte = oggi + timedelta(days=ORIZZONTE_GIORNI - 1)
    trovate: list[Anomalia] = []
    for tipologia in config.tipologie:
        proprie = tuple(r for r in regole[tipologia.id] if _ancora_rilevante(r, oggi))
        eccezioni = tuple(e for e in config.eccezioni if e.tipologia == tipologia.id)
        trovate += _sovrapposizioni_miste(tipologia, proprie, oggi)
        trovate += _sovrapposizioni_stesso_tipo(tipologia, proprie, oggi)
        trovate += _anomalie_eccezioni(tipologia, proprie, eccezioni, oggi)
        for regola in proprie:
            if isinstance(regola.ricorrenza, MensileData):
                # Decisione 26: nei mesi che non hanno il giorno, niente ritiro. Si
                # segnala solo se il periodo della regola comprende un mese così.
                corto = _mese_piu_corto(regola, oggi)
                mancanti = tuple(
                    sorted(g for g in regola.ricorrenza.giorni if g > corto)
                )
                if mancanti:
                    trovate.append(
                        Anomalia(
                            "giorno_inesistente",
                            "info",
                            tipologia=tipologia.id,
                            regole=(regola.id,),
                            giorni=mancanti,
                        )
                    )
        if not _mappa(regole[tipologia.id], eccezioni, oggi, fine_orizzonte):
            trovate.append(
                Anomalia("tipologia_senza_ritiri", "info", tipologia=tipologia.id)
            )

    if config.valido_fino_al is not None:
        if oggi > config.valido_fino_al:
            trovate.append(
                Anomalia("calendario_scaduto", "avviso", data=config.valido_fino_al)
            )
        elif (config.valido_fino_al - oggi).days <= PREAVVISO_VALIDITA_GIORNI:
            trovate.append(
                Anomalia("calendario_in_scadenza", "avviso", data=config.valido_fino_al)
            )
    # Importata qui: piattaforma usa Anomalia e istante_locale di questo modulo.
    from .piattaforma import anomalie_piattaforma

    trovate += anomalie_piattaforma(config.piattaforma, oggi)
    return tuple(trovate)
