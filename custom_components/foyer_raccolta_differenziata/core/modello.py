"""Il modello del calendario (SPEC §4) e la sua lettura dall'archivio.

Formato dell'archivio: date ISO ("2026-09-22"), giorno e mese "MM-GG" ("11-01"),
orari "HH:MM", giorni della settimana come interi 0 = lunedì … 6 = domenica. La
posizione "ultima" di una ricorrenza mensile è -1.

`carica()` accetta solo una configurazione già validata (`validazione.problemi`
vuota): la validazione lavora sui dati grezzi apposta, per poter segnalare ogni
errore invece di fermarsi al primo.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, time
from typing import Any, Literal

ULTIMA = -1

GIORNO_PRIMA = "giorno_prima"
GIORNO_STESSO = "giorno_stesso"


@dataclass(frozen=True)
class Finestra:
    """Quando il sacco di un ritiro va messo fuori (SPEC §4.5)."""

    giorno_prima: bool
    inizio: time
    fine: time


@dataclass(frozen=True)
class Tipologia:
    id: str
    nome: str
    colore: str
    icona: str
    note: str
    esposizione: Finestra | None


@dataclass(frozen=True)
class Settimanale:
    """Ogni `ogni` settimane nei `giorni`, nella fase data dall'`ancora` (§4.2.1)."""

    ogni: int
    giorni: frozenset[int]
    ancora: date


@dataclass(frozen=True)
class MensilePosizione:
    """Il `posizioni`-esimo `giorno` della settimana del mese; -1 = l'ultimo."""

    posizioni: frozenset[int]
    giorno: int


@dataclass(frozen=True)
class MensileData:
    """I `giorni` del mese; un giorno che il mese non ha non genera nulla."""

    giorni: frozenset[int]


Ricorrenza = Settimanale | MensilePosizione | MensileData


@dataclass(frozen=True)
class Sempre:
    pass


@dataclass(frozen=True)
class Annuale:
    """Dal (mese, giorno) al (mese, giorno), ogni anno, estremi inclusi."""

    dal: tuple[int, int]
    al: tuple[int, int]


@dataclass(frozen=True)
class ConAnno:
    dal: date
    al: date


Periodo = Sempre | Annuale | ConAnno


@dataclass(frozen=True)
class Regola:
    id: str
    tipologia: str
    nome: str
    ricorrenza: Ricorrenza
    periodo: Periodo


TipoEccezione = Literal["aggiungi", "togli", "sposta"]


@dataclass(frozen=True)
class Eccezione:
    """Aggiungi e togli usano `data`; sposta va da `data` ad `a`."""

    id: str
    tipo: TipoEccezione
    tipologia: str
    data: date
    a: date | None
    nota: str


@dataclass(frozen=True)
class Patrono:
    mese: int
    giorno: int
    nome: str


Fascia = tuple[time, time]


@dataclass(frozen=True)
class PeriodoPiattaforma:
    """Un orario della piattaforma ecologica, dal `dal` all'`al` compresi.

    `settimana` ha sette elenchi di fasce, dal lunedì alla domenica; un elenco vuoto
    è un giorno di chiusura (SPEC §4.10).
    """

    id: str
    dal: date
    al: date
    settimana: tuple[tuple[Fascia, ...], ...]


@dataclass(frozen=True)
class EccezionePiattaforma:
    """Un giorno con un orario diverso: chiusa (nessuna fascia) o aperta."""

    id: str
    data: date
    fasce: tuple[Fascia, ...]
    nota: str


@dataclass(frozen=True)
class Piattaforma:
    nome: str
    nota: str
    periodi: tuple[PeriodoPiattaforma, ...]
    eccezioni: tuple[EccezionePiattaforma, ...]


@dataclass(frozen=True)
class Configurazione:
    """La parte di configurazione che serve al calendario."""

    tipologie: tuple[Tipologia, ...]
    regole: tuple[Regola, ...]
    eccezioni: tuple[Eccezione, ...]
    esposizione: Finestra
    patrono: Patrono | None
    valido_fino_al: date | None
    piattaforma: Piattaforma | None = None

    def finestra_di(self, tipologia: Tipologia) -> Finestra:
        return tipologia.esposizione or self.esposizione


def _ora(valore: str) -> time:
    ore, minuti = valore.split(":")
    return time(int(ore), int(minuti))


def _mese_giorno(valore: str) -> tuple[int, int]:
    mese, giorno = valore.split("-")
    return int(mese), int(giorno)


def carica_finestra(dati: dict[str, Any]) -> Finestra:
    return Finestra(
        giorno_prima=dati["inizio_giorno"] == GIORNO_PRIMA,
        inizio=_ora(dati["inizio_ora"]),
        fine=_ora(dati["fine_ora"]),
    )


def carica_ricorrenza(dati: dict[str, Any]) -> Ricorrenza:
    tipo = dati["tipo"]
    if tipo == "settimanale":
        return Settimanale(
            ogni=dati["ogni"],
            giorni=frozenset(dati["giorni"]),
            ancora=date.fromisoformat(dati["ancora"]),
        )
    if tipo == "mensile_posizione":
        return MensilePosizione(
            posizioni=frozenset(dati["posizioni"]), giorno=dati["giorno"]
        )
    return MensileData(giorni=frozenset(dati["giorni"]))


def carica_periodo(dati: dict[str, Any]) -> Periodo:
    tipo = dati["tipo"]
    if tipo == "sempre":
        return Sempre()
    if tipo == "annuale":
        return Annuale(dal=_mese_giorno(dati["dal"]), al=_mese_giorno(dati["al"]))
    return ConAnno(
        dal=date.fromisoformat(dati["dal"]), al=date.fromisoformat(dati["al"])
    )


def _fasce(elenco: list[list[str]]) -> tuple[Fascia, ...]:
    """In ordine: inserite nel pannello anche il pomeriggio prima del mattino."""
    return tuple(sorted((_ora(inizio), _ora(fine)) for inizio, fine in elenco))


def carica_piattaforma(dati: dict[str, Any] | None) -> Piattaforma | None:
    if not dati:
        return None
    return Piattaforma(
        nome=dati["nome"],
        nota=dati.get("nota") or "",
        periodi=tuple(
            PeriodoPiattaforma(
                id=p["id"],
                dal=date.fromisoformat(p["dal"]),
                al=date.fromisoformat(p["al"]),
                settimana=tuple(_fasce(giorno) for giorno in p["settimana"]),
            )
            for p in dati.get("periodi", [])
        ),
        eccezioni=tuple(
            EccezionePiattaforma(
                id=e["id"],
                data=date.fromisoformat(e["data"]),
                fasce=_fasce(e.get("fasce") or []) if e["tipo"] == "aperta" else (),
                nota=e.get("nota") or "",
            )
            for e in dati.get("eccezioni", [])
        ),
    )


def carica(dati: dict[str, Any]) -> Configurazione:
    """La configurazione del calendario da un archivio già validato."""
    tipologie = tuple(
        Tipologia(
            id=t["id"],
            nome=t["nome"],
            colore=t["colore"],
            icona=t["icona"],
            note=t.get("note") or "",
            esposizione=(
                carica_finestra(t["esposizione"]) if t.get("esposizione") else None
            ),
        )
        for t in dati.get("tipologie", [])
    )
    regole = tuple(
        Regola(
            id=r["id"],
            tipologia=r["tipologia"],
            nome=r.get("nome") or "",
            ricorrenza=carica_ricorrenza(r["ricorrenza"]),
            periodo=carica_periodo(r["periodo"]),
        )
        for r in dati.get("regole", [])
    )
    eccezioni = tuple(
        Eccezione(
            id=e["id"],
            tipo=e["tipo"],
            tipologia=e["tipologia"],
            data=date.fromisoformat(e["da"] if e["tipo"] == "sposta" else e["data"]),
            a=date.fromisoformat(e["a"]) if e["tipo"] == "sposta" else None,
            nota=e.get("nota") or "",
        )
        for e in dati.get("eccezioni", [])
    )
    patrono = None
    if dati.get("patrono"):
        mese, giorno = _mese_giorno(dati["patrono"]["data"])
        patrono = Patrono(mese=mese, giorno=giorno, nome=dati["patrono"]["nome"])
    valido = dati.get("valido_fino_al")
    return Configurazione(
        tipologie=tipologie,
        regole=regole,
        eccezioni=eccezioni,
        esposizione=carica_finestra(dati["esposizione"]),
        patrono=patrono,
        valido_fino_al=date.fromisoformat(valido) if valido else None,
        piattaforma=carica_piattaforma(dati.get("piattaforma")),
    )
