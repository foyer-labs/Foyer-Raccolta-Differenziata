"""La configurazione come tabelle, per il file Excel (decisione 59).

Il file Excel ha un foglio per sezione: Tipologie, Regole, Eccezioni, Promemoria,
Vacanze, Impostazioni. Questo modulo definisce il formato (fogli, colonne, parole
ammesse) e fa le due conversioni, senza sapere nulla di Excel:

* `in_tabelle`: dalla configurazione salvata alle righe da scrivere, con valori
  leggibili da una persona ("Lun, Gio", "2°, ultimo", date e orari veri);
* `da_tabelle`: dalle righe lette alla configurazione candidata, con ogni errore
  riportato a foglio, riga e colonna.

Le celle arrivano come le restituisce un foglio di calcolo: testo, numeri, date,
orari, spesso in forme diverse da quelle scritte all'esportazione (Excel trasforma
"01/06" in una data, LibreOffice scrive gli orari come frazioni di giorno). Ogni
lettura accetta le forme ragionevoli e rifiuta le altre con un codice.

La configurazione prodotta non si salva da qui: passa dalla validazione di sempre e
dalla finestra "Prima di salvare" (decisione 36).
"""

from __future__ import annotations

from collections.abc import Callable, Iterable, Mapping, Sequence
from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta
import re
from typing import Any, Literal
import unicodedata

from .configurazione import FINESTRA_PREDEFINITA
from .modello import GIORNO_PRIMA, GIORNO_STESSO, ULTIMA
from .preset import PRESET
from .validazione import problemi

Modo = Literal["sostituisci", "aggiungi"]
Formato = Literal["testo", "data", "ora", "numero", "giorno_mese", "data_o_giorno"]

MASSIMO_RIGHE = 2000

COLORE_PREDEFINITO = "#757575"
ICONA_PREDEFINITA = "mdi:trash-can"

# --- il formato -----------------------------------------------------------------------


@dataclass(frozen=True)
class Colonna:
    chiave: str
    intestazione: str
    formato: Formato = "testo"
    scelte: tuple[str, ...] = ()
    larghezza: int = 16
    nascosta: bool = False


@dataclass(frozen=True)
class Foglio:
    nome: str
    colonne: tuple[Colonna, ...]
    obbligatorie: tuple[str, ...]

    def colonna(self, chiave: str) -> Colonna:
        return next(c for c in self.colonne if c.chiave == chiave)


SI, NO = "Sì", "No"
TUTTE = "Tutte"

INIZI = {GIORNO_PRIMA: "il giorno prima", GIORNO_STESSO: "il giorno stesso"}
RICORRENZE = {
    "settimanale": "Settimanale",
    "mensile_posizione": "Mensile per giorno della settimana",
    "mensile_data": "Mensile per data",
}
PERIODI = {"sempre": "Sempre", "annuale": "Ogni anno", "con_anno": "Solo tra due date"}
ECCEZIONI = {"aggiungi": "Aggiungi", "togli": "Togli", "sposta": "Sposta"}
QUANDO = {
    "giorni_prima": "Giorni prima",
    "giorno_stesso": "Il giorno del ritiro",
    "apertura": "All'apertura dell'esposizione",
}

GIORNI = ("Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom")
_GIORNI_COMPLETI = (
    "lunedi",
    "martedi",
    "mercoledi",
    "giovedi",
    "venerdi",
    "sabato",
    "domenica",
)
_MESI = (
    "gennaio",
    "febbraio",
    "marzo",
    "aprile",
    "maggio",
    "giugno",
    "luglio",
    "agosto",
    "settembre",
    "ottobre",
    "novembre",
    "dicembre",
)
_POSIZIONI_PAROLE = {
    "primo": 1,
    "prima": 1,
    "secondo": 2,
    "seconda": 2,
    "terzo": 3,
    "terza": 3,
    "quarto": 4,
    "quarta": 4,
    "ultimo": ULTIMA,
    "ultima": ULTIMA,
}

_ID = Colonna("id", "ID (non modificare)", larghezza=12, nascosta=True)

TIPOLOGIE = Foglio(
    "Tipologie",
    (
        Colonna("nome", "Nome", larghezza=20),
        Colonna("colore", "Colore", larghezza=11),
        Colonna("icona", "Icona", larghezza=24),
        Colonna("note", "Cosa ci va", larghezza=40),
        Colonna("esposizione_dalle", "Esposizione: dalle", "ora", larghezza=12),
        Colonna(
            "esposizione_del",
            "Esposizione: del",
            scelte=tuple(INIZI.values()),
            larghezza=18,
        ),
        Colonna("esposizione_entro", "Esposizione: entro le", "ora", larghezza=14),
        _ID,
    ),
    obbligatorie=("nome",),
)

REGOLE = Foglio(
    "Regole",
    (
        Colonna("tipologia", "Tipologia", larghezza=18),
        Colonna("nome", "Nome della regola", larghezza=18),
        Colonna(
            "ricorrenza", "Ricorrenza", scelte=tuple(RICORRENZE.values()), larghezza=30
        ),
        Colonna("ogni", "Ogni quante settimane", "numero", larghezza=12),
        Colonna("giorni_settimana", "Giorni della settimana", larghezza=18),
        Colonna("posizioni", "Quali nel mese", larghezza=14),
        Colonna("giorni_mese", "Giorni del mese", larghezza=14),
        Colonna("ancora", "Un giorno di ritiro", "data", larghezza=14),
        Colonna("periodo", "Periodo", scelte=tuple(PERIODI.values()), larghezza=18),
        Colonna("dal", "Dal", "data_o_giorno", larghezza=12),
        Colonna("al", "Al", "data_o_giorno", larghezza=12),
        _ID,
    ),
    obbligatorie=("tipologia",),
)

ECCEZIONI_FOGLIO = Foglio(
    "Eccezioni",
    (
        Colonna("tipologia", "Tipologia", larghezza=18),
        Colonna("tipo", "Cosa", scelte=tuple(ECCEZIONI.values()), larghezza=12),
        Colonna("data", "Data", "data", larghezza=13),
        Colonna("a", "Spostato al", "data", larghezza=13),
        Colonna("nota", "Nota", larghezza=36),
        _ID,
    ),
    obbligatorie=("tipologia", "tipo", "data"),
)

PROMEMORIA = Foglio(
    "Promemoria",
    (
        Colonna("nome", "Nome", larghezza=22),
        Colonna("attivo", "Attivo", scelte=(SI, NO), larghezza=9),
        Colonna("quando", "Quando", scelte=tuple(QUANDO.values()), larghezza=28),
        Colonna("giorni", "Quanti giorni prima", "numero", larghezza=12),
        Colonna("ora", "Alle", "ora", larghezza=9),
        Colonna("tipologie", "Tipologie", larghezza=24),
        Colonna("destinatari", "Destinatari", larghezza=40),
        _ID,
    ),
    obbligatorie=("nome", "quando", "destinatari"),
)

VACANZE = Foglio(
    "Vacanze",
    (
        Colonna("dal", "Dal", "data", larghezza=13),
        Colonna("al", "Al", "data", larghezza=13),
    ),
    obbligatorie=("dal", "al"),
)

IMPOSTAZIONI = Foglio(
    "Impostazioni",
    (
        Colonna("impostazione", "Impostazione", larghezza=30),
        Colonna("valore", "Valore", larghezza=22),
    ),
    obbligatorie=("impostazione", "valore"),
)

FOGLI: tuple[Foglio, ...] = (
    TIPOLOGIE,
    REGOLE,
    ECCEZIONI_FOGLIO,
    PROMEMORIA,
    VACANZE,
    IMPOSTAZIONI,
)


@dataclass(frozen=True)
class Impostazione:
    chiave: str
    etichetta: str
    formato: Formato = "testo"
    scelte: tuple[str, ...] = ()


VOCI_IMPOSTAZIONI: tuple[Impostazione, ...] = (
    Impostazione("esposizione_dalle", "Esposizione: dalle", "ora"),
    Impostazione("esposizione_del", "Esposizione: del", scelte=tuple(INIZI.values())),
    Impostazione("esposizione_entro", "Esposizione: entro le", "ora"),
    Impostazione("valido_fino_al", "Calendario valido fino al", "data"),
    Impostazione("patrono_nome", "Santo patrono"),
    Impostazione("patrono_giorno", "Giorno del santo patrono", "giorno_mese"),
    Impostazione("solleciti", "Solleciti", scelte=(SI, NO)),
    Impostazione("solleciti_richiami", "Solleciti: quanti richiami", "numero"),
    Impostazione("solleciti_dopo", "Solleciti: dopo quanti minuti", "numero"),
)


def norma(testo: str) -> str:
    """Minuscole, senza accenti e spazi doppi: "Lunedì " e "lunedi" coincidono."""
    senza = unicodedata.normalize("NFKD", testo.replace("’", "'"))
    senza = "".join(c for c in senza if not unicodedata.combining(c))
    return " ".join(senza.casefold().split())


def chiave_colonna(foglio: Foglio, intestazione: Any) -> str | None:
    """La chiave della colonna con questa intestazione, o None se non è del formato."""
    if not isinstance(intestazione, str):
        return None
    cercata = norma(intestazione)
    return next(
        (c.chiave for c in foglio.colonne if norma(c.intestazione) == cercata), None
    )


# --- lettura delle celle ------------------------------------------------------------


class ValoreNonValido(ValueError):
    """Una cella che non si legge; `codice` dice perché."""

    def __init__(self, codice: str) -> None:
        super().__init__(codice)
        self.codice = codice


def vuota(valore: Any) -> bool:
    return valore is None or (isinstance(valore, str) and not valore.strip())


def _testo(valore: Any) -> str:
    if vuota(valore):
        return ""
    if isinstance(valore, bool):
        return SI if valore else NO
    if isinstance(valore, float) and valore.is_integer():
        return str(int(valore))
    if isinstance(valore, datetime):
        return valore.date().isoformat()
    return str(valore).strip()


def _parti(testo: str, separatori: str = r"[,;/\s]+") -> list[str]:
    return [p for p in re.split(separatori, testo) if p and norma(p) != "e"]


def _intero(valore: Any, codice: str) -> int:
    if isinstance(valore, bool):
        raise ValoreNonValido(codice)
    if isinstance(valore, int):
        return valore
    if isinstance(valore, float) and valore.is_integer():
        return int(valore)
    if isinstance(valore, str) and valore.strip().isdigit():
        return int(valore.strip())
    raise ValoreNonValido(codice)


_DATA_IT = re.compile(r"^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4}|\d{2})$")
_DATA_ISO = re.compile(r"^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T].*)?$")
_EPOCA_EXCEL = date(1899, 12, 30)


def leggi_data(valore: Any) -> date:
    """Una data da una cella: data vera, numero di serie di Excel o testo."""
    if isinstance(valore, datetime):
        return valore.date()
    if isinstance(valore, date):
        return valore
    if isinstance(valore, (int, float)) and not isinstance(valore, bool):
        # Una cella con il formato "numero" mostra la data come numero di serie.
        if 36526 <= valore <= 73415:  # 2000-01-01 … 2100-12-31
            return _EPOCA_EXCEL + timedelta(days=int(valore))
        raise ValoreNonValido("data_non_valida")
    testo = _testo(valore)
    try:
        if trovato := _DATA_IT.match(testo):
            giorno, mese, anno = (int(x) for x in trovato.groups())
            return date(anno + 2000 if anno < 100 else anno, mese, giorno)
        if trovato := _DATA_ISO.match(testo):
            anno, mese, giorno = (int(x) for x in trovato.groups())
            return date(anno, mese, giorno)
    except ValueError:
        pass
    raise ValoreNonValido("data_non_valida")


_GIORNO_MESE = re.compile(r"^(\d{1,2})[/.\-](\d{1,2})$")
_GIORNO_MESE_PAROLE = re.compile(r"^(\d{1,2})\s+([a-z]+)$")


def ha_anno(valore: Any) -> bool:
    """Se una cella di periodo è una data completa (con anno) e non solo gg/mm."""
    if isinstance(valore, (date, datetime)):
        return True
    if isinstance(valore, (int, float)) and not isinstance(valore, bool):
        return True
    testo = _testo(valore)
    return bool(_DATA_IT.match(testo) or _DATA_ISO.match(testo))


def leggi_giorno_mese(valore: Any) -> str:
    """Giorno e mese come "MM-GG" da "01/06", "1-6", "15 agosto" o una data."""
    if isinstance(valore, (date, datetime)) or ha_anno(valore):
        giorno_data = leggi_data(valore)
        mese, giorno = giorno_data.month, giorno_data.day
    else:
        testo = norma(_testo(valore))
        if trovato := _GIORNO_MESE.match(testo):
            giorno, mese = int(trovato.group(1)), int(trovato.group(2))
        elif (trovato := _GIORNO_MESE_PAROLE.match(testo)) and trovato.group(
            2
        ) in _MESI:
            giorno, mese = int(trovato.group(1)), _MESI.index(trovato.group(2)) + 1
        else:
            raise ValoreNonValido("data_non_valida")
    try:
        date(
            2000, mese, giorno
        )  # un anno bisestile: il 29/02 lo giudica la validazione
    except ValueError as errore:
        raise ValoreNonValido("data_non_valida") from errore
    return f"{mese:02d}-{giorno:02d}"


_ORA = re.compile(r"^(\d{1,2})(?:[:.h](\d{2})?)?$")


def leggi_ora(valore: Any) -> str:
    """Un orario "HH:MM" da un orario vero, una frazione di giorno o un testo."""
    if isinstance(valore, datetime):
        valore = valore.time()
    if isinstance(valore, time):
        return f"{valore.hour:02d}:{valore.minute:02d}"
    if isinstance(valore, float) and 0 <= valore < 1:
        minuti = round(valore * 24 * 60)
        if minuti < 24 * 60:
            return f"{minuti // 60:02d}:{minuti % 60:02d}"
    if isinstance(valore, int) and not isinstance(valore, bool) and 0 <= valore <= 23:
        return f"{valore:02d}:00"
    trovato = _ORA.match(_testo(valore).lower())
    if trovato:
        ore, minuti = int(trovato.group(1)), int(trovato.group(2) or 0)
        if ore <= 23 and minuti <= 59:
            return f"{ore:02d}:{minuti:02d}"
    raise ValoreNonValido("orario_non_valido")


def _scelta(
    valore: Any, voci: Mapping[str, str], alias: Mapping[str, str] | None = None
) -> str:
    """La chiave di una scelta da menu, per etichetta o per alias."""
    cercata = norma(_testo(valore))
    for chiave, etichetta in voci.items():
        if cercata in (norma(etichetta), chiave.replace("_", " ")):
            return chiave
    if alias and cercata in alias:
        return alias[cercata]
    raise ValoreNonValido("scelta_non_valida")


_SI = {"si", "s", "x", "vero", "true", "1", "acceso", "attivo", "attivi", "yes"}
_NO = {"no", "n", "falso", "false", "0", "spento", "spenti"}


def leggi_si_no(valore: Any) -> bool:
    if isinstance(valore, bool):
        return valore
    cercata = norma(_testo(valore))
    if cercata in _SI:
        return True
    if cercata in _NO:
        return False
    raise ValoreNonValido("si_no_non_valido")


def leggi_giorni_settimana(valore: Any) -> list[int]:
    giorni: set[int] = set()
    for parte in _parti(_testo(valore)):
        cercata = norma(parte).rstrip(".")
        indice = next(
            (
                i
                for i, completo in enumerate(_GIORNI_COMPLETI)
                if len(cercata) >= 3 and completo.startswith(cercata)
            ),
            None,
        )
        if indice is None:
            raise ValoreNonValido("giorni_non_validi")
        giorni.add(indice)
    if not giorni:
        raise ValoreNonValido("giorni_non_validi")
    return sorted(giorni)


_POSIZIONE_NUMERO = re.compile(r"^([1-4])(?:°|º|ª|o|a|\^)?$")


def leggi_posizioni(valore: Any) -> list[int]:
    posizioni: set[int] = set()
    for parte in _parti(_testo(valore)):
        if trovato := _POSIZIONE_NUMERO.match(parte.strip().lower()):
            posizioni.add(int(trovato.group(1)))
        elif (parola := norma(parte)) in _POSIZIONI_PAROLE:
            posizioni.add(_POSIZIONI_PAROLE[parola])
        else:
            raise ValoreNonValido("posizioni_non_valide")
    if not posizioni:
        raise ValoreNonValido("posizioni_non_valide")
    return sorted(posizioni, key=lambda p: (p == ULTIMA, p))


def leggi_giorni_mese(valore: Any) -> list[int]:
    if isinstance(valore, (int, float)) and not isinstance(valore, bool):
        parti: list[Any] = [valore]
    else:
        parti = _parti(_testo(valore))
    giorni = set()
    for parte in parti:
        numero = _intero(parte, "giorni_non_validi")
        if not 1 <= numero <= 31:
            raise ValoreNonValido("giorni_non_validi")
        giorni.add(numero)
    if not giorni:
        raise ValoreNonValido("giorni_non_validi")
    return sorted(giorni)


_ESADECIMALE = re.compile(r"^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$")


def leggi_colore(valore: Any) -> str:
    trovato = _ESADECIMALE.match(_testo(valore))
    if not trovato:
        raise ValoreNonValido("colore_non_valido")
    cifre = trovato.group(1).lower()
    if len(cifre) == 3:
        cifre = "".join(c * 2 for c in cifre)
    return f"#{cifre}"


def leggi_icona(valore: Any) -> str:
    testo = _testo(valore).lower().replace(" ", "-")
    return testo if testo.startswith("mdi:") else f"mdi:{testo}"


def leggi_destinatari(
    valore: Any, noti: frozenset[tuple[str, str]] = frozenset()
) -> list[dict[str, str]]:
    """I destinatari da "mobile_app_luca, notify.telegram".

    Un servizio si scrive senza "notify." davanti, un'entità con: è la forma
    dell'esportazione. Chi scrive "notify.mobile_app_luca" per un servizio che
    esiste, e che non è un'entità, ottiene il servizio.
    """
    destinatari: list[dict[str, str]] = []
    for parte in _parti(_testo(valore), r"[,;\s]+"):
        voce = parte.strip().lower()
        if voce.startswith("notify."):
            servizio = voce.removeprefix("notify.")
            if ("servizio", servizio) in noti and ("entita", voce) not in noti:
                destinatario = {"tipo": "servizio", "id": servizio}
            else:
                destinatario = {"tipo": "entita", "id": voce}
        else:
            destinatario = {"tipo": "servizio", "id": voce}
        if destinatario not in destinatari:
            destinatari.append(destinatario)
    return destinatari


# --- scrittura ------------------------------------------------------------------------


def _ora_cella(testo: str) -> time:
    ore, minuti = testo.split(":")
    return time(int(ore), int(minuti))


def _giorno_mese_cella(testo: str) -> str:
    mese, giorno = testo.split("-")
    return f"{giorno}/{mese}"


def _elenco_giorni(giorni: Iterable[int]) -> str:
    return ", ".join(GIORNI[g] for g in sorted(giorni))


def _elenco_posizioni(posizioni: Iterable[int]) -> str:
    ordinate = sorted(posizioni, key=lambda p: (p == ULTIMA, p))
    return ", ".join("ultimo" if p == ULTIMA else f"{p}°" for p in ordinate)


def _periodo_celle(periodo: dict[str, Any]) -> tuple[str, Any, Any]:
    tipo = periodo["tipo"]
    if tipo == "annuale":
        return (
            PERIODI[tipo],
            _giorno_mese_cella(periodo["dal"]),
            _giorno_mese_cella(periodo["al"]),
        )
    if tipo == "con_anno":
        return (
            PERIODI[tipo],
            date.fromisoformat(periodo["dal"]),
            date.fromisoformat(periodo["al"]),
        )
    return PERIODI["sempre"], None, None


def _riga_regola(regola: dict[str, Any], nomi: Mapping[str, str]) -> dict[str, Any]:
    ricorrenza = regola["ricorrenza"]
    tipo = ricorrenza["tipo"]
    periodo, dal, al = _periodo_celle(regola["periodo"])
    riga: dict[str, Any] = {
        "tipologia": nomi.get(regola["tipologia"], ""),
        "nome": regola.get("nome") or None,
        "ricorrenza": RICORRENZE[tipo],
        "periodo": periodo,
        "dal": dal,
        "al": al,
        "id": regola["id"],
    }
    if tipo == "settimanale":
        riga |= {
            "ogni": ricorrenza["ogni"],
            "giorni_settimana": _elenco_giorni(ricorrenza["giorni"]),
            "ancora": date.fromisoformat(ricorrenza["ancora"]),
        }
    elif tipo == "mensile_posizione":
        riga |= {
            "giorni_settimana": GIORNI[ricorrenza["giorno"]],
            "posizioni": _elenco_posizioni(ricorrenza["posizioni"]),
        }
    else:
        riga["giorni_mese"] = ", ".join(str(g) for g in sorted(ricorrenza["giorni"]))
    return riga


def _riga_eccezione(eccezione: dict[str, Any], nomi: Mapping[str, str]) -> dict:
    sposta = eccezione["tipo"] == "sposta"
    return {
        "tipologia": nomi.get(eccezione["tipologia"], ""),
        "tipo": ECCEZIONI[eccezione["tipo"]],
        "data": date.fromisoformat(eccezione["da"] if sposta else eccezione["data"]),
        "a": date.fromisoformat(eccezione["a"]) if sposta else None,
        "nota": eccezione.get("nota") or None,
        "id": eccezione["id"],
    }


def _destinatario_cella(destinatario: dict[str, str]) -> str:
    return destinatario["id"]


def _riga_promemoria(profilo: dict[str, Any], nomi: Mapping[str, str]) -> dict:
    quando = profilo["quando"]
    tipologie = profilo.get("tipologie")
    return {
        "nome": profilo["nome"],
        "attivo": SI if profilo.get("attivo", True) else NO,
        "quando": QUANDO[quando["tipo"]],
        "giorni": quando.get("giorni") if quando["tipo"] == "giorni_prima" else None,
        "ora": _ora_cella(quando["ora"]) if quando["tipo"] != "apertura" else None,
        "tipologie": TUTTE
        if tipologie is None
        else ", ".join(nomi.get(t, t) for t in tipologie),
        "destinatari": ", ".join(
            _destinatario_cella(d) for d in profilo.get("destinatari", [])
        ),
        "id": profilo["id"],
    }


def _impostazioni_righe(config: Mapping[str, Any]) -> list[dict[str, Any]]:
    esposizione = config.get("esposizione") or FINESTRA_PREDEFINITA
    patrono = config.get("patrono")
    valido = config.get("valido_fino_al")
    solleciti = config.get("solleciti") or {}
    valori = {
        "esposizione_dalle": _ora_cella(esposizione["inizio_ora"]),
        "esposizione_del": INIZI[esposizione["inizio_giorno"]],
        "esposizione_entro": _ora_cella(esposizione["fine_ora"]),
        "valido_fino_al": date.fromisoformat(valido) if valido else None,
        "patrono_nome": patrono["nome"] if patrono else None,
        "patrono_giorno": _giorno_mese_cella(patrono["data"]) if patrono else None,
        "solleciti": SI if solleciti.get("attivi") else NO,
        "solleciti_richiami": solleciti.get("richiami", 1),
        "solleciti_dopo": solleciti.get("richiamo_dopo", 30),
    }
    return [
        {"impostazione": v.etichetta, "valore": valori[v.chiave]}
        for v in VOCI_IMPOSTAZIONI
    ]


def in_tabelle(config: Mapping[str, Any]) -> dict[str, list[dict[str, Any]]]:
    """Le righe di ogni foglio per una configurazione valida."""
    nomi = {t["id"]: t["nome"] for t in config.get("tipologie", [])}
    tipologie = []
    for t in config.get("tipologie", []):
        finestra = t.get("esposizione")
        tipologie.append(
            {
                "nome": t["nome"],
                "colore": t["colore"],
                "icona": t["icona"],
                "note": t.get("note") or None,
                "esposizione_dalle": _ora_cella(finestra["inizio_ora"])
                if finestra
                else None,
                "esposizione_del": INIZI[finestra["inizio_giorno"]]
                if finestra
                else None,
                "esposizione_entro": _ora_cella(finestra["fine_ora"])
                if finestra
                else None,
                "id": t["id"],
            }
        )
    eccezioni = sorted(
        config.get("eccezioni", []),
        key=lambda e: (
            e.get("da") or e.get("data") or "",
            nomi.get(e["tipologia"], ""),
        ),
    )
    return {
        TIPOLOGIE.nome: tipologie,
        REGOLE.nome: [_riga_regola(r, nomi) for r in config.get("regole", [])],
        ECCEZIONI_FOGLIO.nome: [_riga_eccezione(e, nomi) for e in eccezioni],
        PROMEMORIA.nome: [
            _riga_promemoria(p, nomi) for p in config.get("promemoria", [])
        ],
        VACANZE.nome: [
            {"dal": date.fromisoformat(v["dal"]), "al": date.fromisoformat(v["al"])}
            for v in sorted(config.get("sospensioni", []), key=lambda v: v["dal"])
        ],
        IMPOSTAZIONI.nome: _impostazioni_righe(config),
    }


def modello() -> dict[str, list[dict[str, Any]]]:
    """Il modello vuoto: le tipologie di base, il resto da compilare."""
    tabelle = in_tabelle(
        {
            "tipologie": [
                {
                    "id": "",
                    "nome": p.nome,
                    "colore": p.colore,
                    "icona": p.icona,
                    "note": "",
                    "esposizione": None,
                }
                for p in PRESET
                if p.predefinito
            ],
            "esposizione": FINESTRA_PREDEFINITA,
            "solleciti": {"attivi": False, "richiami": 1, "richiamo_dopo": 30},
        }
    )
    # Senza id: importate, le tipologie di base ritrovano quelle esistenti per nome.
    for riga in tabelle[TIPOLOGIE.nome]:
        riga["id"] = None
    return tabelle


# --- lettura --------------------------------------------------------------------------


@dataclass(frozen=True)
class Riga:
    """Una riga di dati: il suo numero nel foglio e le celle per chiave di colonna."""

    numero: int
    valori: Mapping[str, Any]

    def __getitem__(self, chiave: str) -> Any:
        return self.valori.get(chiave)


@dataclass(frozen=True)
class Tabella:
    """Un foglio letto: le colonne trovate nell'intestazione e le righe non vuote."""

    colonne: frozenset[str]
    righe: tuple[Riga, ...]


@dataclass(frozen=True)
class Errore:
    """Dove sta un problema del file: foglio, riga (1 = la prima), intestazione."""

    foglio: str
    riga: int | None
    colonna: str | None
    codice: str


@dataclass
class Esito:
    configurazione: dict[str, Any] | None
    errori: list[Errore]
    riepilogo: dict[str, dict[str, int]] = field(default_factory=dict)


_ID_VALIDO = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
_SEZIONI = ("tipologie", "regole", "eccezioni", "promemoria")
_FOGLIO_DI = {
    "tipologie": TIPOLOGIE,
    "regole": REGOLE,
    "eccezioni": ECCEZIONI_FOGLIO,
    "promemoria": PROMEMORIA,
    "sospensioni": VACANZE,
}


def _uguali(a: Any, b: Any) -> bool:
    """Due elementi uguali a meno dell'id e dell'ordine degli elenchi di numeri."""

    def forma(valore: Any) -> Any:
        if isinstance(valore, dict):
            # Una nota vuota e una nota assente sono la stessa cosa.
            return {
                k: forma(v)
                for k, v in valore.items()
                if k != "id" and v not in ("", None)
            }
        if isinstance(valore, list) and all(isinstance(v, int) for v in valore):
            return sorted(valore)
        if isinstance(valore, list):
            return [forma(v) for v in valore]
        return valore

    return forma(a) == forma(b)


class _Lettore:
    def __init__(
        self,
        fogli: Mapping[str, Tabella],
        attuale: Mapping[str, Any],
        *,
        modo: Modo,
        genera_id: Callable[[], str],
        oggi: date,
        destinatari_noti: frozenset[tuple[str, str]],
    ) -> None:
        self.fogli = fogli
        self.attuale = attuale
        self.modo = modo
        self.genera_id = genera_id
        self.oggi = oggi
        self.noti = destinatari_noti
        self.errori: list[Errore] = []
        # Per ogni sezione, gli elementi risultanti e la riga del file da cui vengono
        # (None: un elemento che c'era già e il file non tocca).
        self.elementi: dict[str, list[dict[str, Any]]] = {}
        self.origini: dict[str, list[int | None]] = {}
        self.usati: set[str] = set()
        self.righe_impostazioni: dict[str, int] = {}

    # --- utilità -----------------------------------------------------------------

    def errore(self, foglio: Foglio, riga: int | None, chiave: str | None, codice: str):
        colonna = foglio.colonna(chiave).intestazione if chiave else None
        self.errori.append(Errore(foglio.nome, riga, colonna, codice))

    def cella(self, foglio: Foglio, riga: Riga, chiave: str, lettura: Callable):
        """Legge una cella non vuota; None se è vuota o se non si legge (con errore)."""
        valore = riga[chiave]
        if vuota(valore):
            return None
        try:
            return lettura(valore)
        except ValoreNonValido as e:
            self.errore(foglio, riga.numero, chiave, e.codice)
            return None

    def obbligatoria(self, foglio: Foglio, riga: Riga, chiave: str, lettura: Callable):
        if vuota(riga[chiave]):
            self.errore(foglio, riga.numero, chiave, "valore_mancante")
            return None
        return self.cella(foglio, riga, chiave, lettura)

    def nuovo_id(self, dal_file: str) -> str:
        """L'id scritto nel file se è valido e libero, altrimenti uno nuovo."""
        if _ID_VALIDO.match(dal_file) and dal_file not in self.usati:
            self.usati.add(dal_file)
            return dal_file
        while (nuovo := self.genera_id()) in self.usati:
            pass
        self.usati.add(nuovo)
        return nuovo

    def tabella(self, foglio: Foglio) -> Tabella | None:
        tabella = self.fogli.get(foglio.nome)
        if tabella is None:
            if self.modo == "sostituisci":
                # Senza il foglio, "sostituisci" cancellerebbe la sezione intera.
                self.errori.append(Errore(foglio.nome, None, None, "foglio_mancante"))
            return None
        mancanti = [c for c in foglio.obbligatorie if c not in tabella.colonne]
        for chiave in mancanti:
            self.errore(foglio, None, chiave, "colonna_mancante")
        if mancanti:
            return None
        if len(tabella.righe) > MASSIMO_RIGHE:
            self.errori.append(Errore(foglio.nome, None, None, "troppe_righe"))
            return None
        return tabella

    def inizia(self, sezione: str) -> tuple[list[dict], list[int | None]]:
        esistenti = [dict(e) for e in self.attuale.get(sezione, [])]
        if self.modo == "aggiungi":
            self.elementi[sezione] = esistenti
            self.origini[sezione] = [None] * len(esistenti)
            self.usati |= {e["id"] for e in esistenti if isinstance(e.get("id"), str)}
        else:
            self.elementi[sezione] = []
            self.origini[sezione] = []
        return self.elementi[sezione], self.origini[sezione]

    def metti(self, sezione: str, elemento: dict, riga: int, sostituisce: str | None):
        """Aggiunge un elemento, o prende il posto di quello con id `sostituisce`."""
        elenco, origini = self.elementi[sezione], self.origini[sezione]
        for i, esistente in enumerate(elenco):
            if sostituisce is not None and esistente.get("id") == sostituisce:
                elenco[i], origini[i] = elemento, riga
                return
        elenco.append(elemento)
        origini.append(riga)

    def riserva(self, identificativo: str) -> str:
        """Un id che l'elemento eredita da uno esistente."""
        self.usati.add(identificativo)
        return identificativo

    # --- sezioni -----------------------------------------------------------------

    def tipologie(self) -> None:
        esistenti = list(self.attuale.get("tipologie", []))
        self.inizia("tipologie")
        tabella = self.tabella(TIPOLOGIE)
        if tabella is None:
            return
        per_id = {t["id"]: t for t in esistenti}
        per_nome = {norma(t["nome"]): t for t in esistenti}
        preset = {norma(p.nome): p for p in PRESET}
        presi: set[str] = set()
        f = TIPOLOGIE
        for riga in tabella.righe:
            nome = self.obbligatoria(f, riga, "nome", _testo)
            if nome is None:
                continue
            base = per_id.get(_testo(riga["id"])) or per_nome.get(norma(nome))
            if base is not None and base["id"] in presi:
                base = None  # due righe per la stessa tipologia: la seconda è nuova
            p = preset.get(norma(nome))
            colore = self.cella(f, riga, "colore", leggi_colore) or (
                base["colore"] if base else p.colore if p else COLORE_PREDEFINITO
            )
            icona = self.cella(f, riga, "icona", leggi_icona) or (
                base["icona"] if base else p.icona if p else ICONA_PREDEFINITA
            )
            if "note" in tabella.colonne:
                note = _testo(riga["note"])
            else:
                note = (base or {}).get("note") or ""
            elemento = {
                "id": "",
                "nome": nome,
                "colore": colore,
                "icona": icona,
                "note": note,
                "esposizione": self.finestra_tipologia(riga),
            }
            if base is not None:
                presi.add(base["id"])
                elemento["id"] = self.riserva(base["id"])
                self.metti("tipologie", elemento, riga.numero, base["id"])
            else:
                elemento["id"] = self.nuovo_id(_testo(riga["id"]))
                self.metti("tipologie", elemento, riga.numero, None)

    def finestra_tipologia(self, riga: Riga) -> dict[str, str] | None:
        f = TIPOLOGIE
        chiavi = ("esposizione_dalle", "esposizione_del", "esposizione_entro")
        if all(vuota(riga[c]) for c in chiavi):
            return None
        for chiave in chiavi:
            if vuota(riga[chiave]):
                self.errore(f, riga.numero, chiave, "valore_mancante")
        inizio = self.cella(f, riga, "esposizione_dalle", leggi_ora)
        giorno = self.cella(
            f, riga, "esposizione_del", lambda v: _scelta(v, INIZI, _ALIAS_INIZI)
        )
        fine = self.cella(f, riga, "esposizione_entro", leggi_ora)
        if inizio is None or giorno is None or fine is None:
            return None
        return {"inizio_giorno": giorno, "inizio_ora": inizio, "fine_ora": fine}

    def id_tipologia(self, foglio: Foglio, riga: Riga) -> str | None:
        nome = self.obbligatoria(foglio, riga, "tipologia", _testo)
        if nome is None:
            return None
        trovata = next(
            (
                t["id"]
                for t in self.elementi["tipologie"]
                if norma(t["nome"]) == norma(nome)
            ),
            None,
        )
        if trovata is None:
            self.errore(foglio, riga.numero, "tipologia", "tipologia_sconosciuta")
        return trovata

    def regole(self) -> None:
        esistenti = {r["id"]: r for r in self.attuale.get("regole", [])}
        self.inizia("regole")
        tabella = self.tabella(REGOLE)
        if tabella is None:
            return
        for riga in tabella.righe:
            errori_prima = len(self.errori)
            tipologia = self.id_tipologia(REGOLE, riga)
            ricorrenza = self.ricorrenza(riga)
            periodo = self.periodo(riga)
            if len(self.errori) != errori_prima or not (tipologia and ricorrenza):
                continue
            elemento = {
                "id": "",
                "tipologia": tipologia,
                "nome": _testo(riga["nome"]),
                "ricorrenza": ricorrenza,
                "periodo": periodo,
            }
            self.colloca("regole", elemento, riga, esistenti)

    def colloca(
        self, sezione: str, elemento: dict, riga: Riga, esistenti: Mapping[str, dict]
    ) -> None:
        """Id, sostituzione o aggiunta di una regola o di un promemoria."""
        dal_file = _testo(riga["id"])
        if dal_file in esistenti and dal_file not in self._presi(sezione):
            elemento["id"] = self.riserva(dal_file)
            self.metti(sezione, elemento, riga.numero, dal_file)
            return
        if self.modo == "aggiungi" and any(
            _uguali(elemento, e) for e in self.elementi[sezione]
        ):
            return  # c'è già, identico: nessun doppione
        elemento["id"] = self.nuovo_id("" if dal_file in esistenti else dal_file)
        self.metti(sezione, elemento, riga.numero, None)

    def _presi(self, sezione: str) -> set[str]:
        return {
            e["id"]
            for e, origine in zip(
                self.elementi[sezione], self.origini[sezione], strict=True
            )
            if origine is not None
        }

    def ricorrenza(self, riga: Riga) -> dict[str, Any] | None:
        f = REGOLE
        if vuota(riga["ricorrenza"]):
            # Senza scelta, la ricorrenza si capisce dalle colonne compilate.
            if not vuota(riga["giorni_mese"]):
                tipo = "mensile_data"
            elif not vuota(riga["posizioni"]):
                tipo = "mensile_posizione"
            else:
                tipo = "settimanale"
        else:
            tipo = self.cella(f, riga, "ricorrenza", lambda v: _scelta(v, RICORRENZE))
        if tipo == "settimanale":
            return self.settimanale(riga)
        if tipo == "mensile_posizione":
            return self.mensile_posizione(riga)
        if tipo == "mensile_data":
            giorni = self.obbligatoria(f, riga, "giorni_mese", leggi_giorni_mese)
            return {"tipo": tipo, "giorni": giorni} if giorni is not None else None
        return None

    def settimanale(self, riga: Riga) -> dict[str, Any] | None:
        f = REGOLE
        ogni = self.cella(f, riga, "ogni", lambda v: _intero(v, "settimane_non_valide"))
        giorni = self.obbligatoria(f, riga, "giorni_settimana", leggi_giorni_settimana)
        ancora = self.cella(f, riga, "ancora", leggi_data)
        ogni = 1 if ogni is None else ogni
        if ancora is None and vuota(riga["ancora"]) and ogni > 1:
            # Ogni due o più settimane l'ancora decide quali: non si indovina.
            self.errore(f, riga.numero, "ancora", "valore_mancante")
            return None
        if giorni is None:
            return None
        return {
            "tipo": "settimanale",
            "ogni": ogni,
            "giorni": giorni,
            "ancora": (ancora or self.oggi).isoformat(),
        }

    def mensile_posizione(self, riga: Riga) -> dict[str, Any] | None:
        f = REGOLE
        posizioni = self.obbligatoria(f, riga, "posizioni", leggi_posizioni)
        giorni = self.obbligatoria(f, riga, "giorni_settimana", leggi_giorni_settimana)
        if giorni is not None and len(giorni) != 1:
            self.errore(f, riga.numero, "giorni_settimana", "un_solo_giorno")
            return None
        if posizioni is None or giorni is None:
            return None
        return {
            "tipo": "mensile_posizione",
            "posizioni": posizioni,
            "giorno": giorni[0],
        }

    def periodo(self, riga: Riga) -> dict[str, Any]:
        f = REGOLE
        dal, al = riga["dal"], riga["al"]
        if vuota(riga["periodo"]):
            if vuota(dal) and vuota(al):
                tipo = "sempre"
            elif ha_anno(dal) and ha_anno(al):
                tipo = "con_anno"
            else:
                tipo = "annuale"
        else:
            tipo = self.cella(f, riga, "periodo", lambda v: _scelta(v, PERIODI))
        if tipo in (None, "sempre"):
            return {"tipo": "sempre"}
        lettura = (
            (lambda v: leggi_data(v).isoformat())
            if tipo == "con_anno"
            else (leggi_giorno_mese)
        )
        inizio = self.obbligatoria(f, riga, "dal", lettura)
        fine = self.obbligatoria(f, riga, "al", lettura)
        return {"tipo": tipo, "dal": inizio or "", "al": fine or ""}

    def eccezioni(self) -> None:
        esistenti = list(self.attuale.get("eccezioni", []))
        self.inizia("eccezioni")
        tabella = self.tabella(ECCEZIONI_FOGLIO)
        if tabella is None:
            return
        f = ECCEZIONI_FOGLIO
        per_id = {e["id"]: e for e in esistenti}

        def partenza(e: Mapping[str, Any]) -> tuple[Any, Any]:
            return e.get("tipologia"), e.get("da") if e.get(
                "tipo"
            ) == "sposta" else e.get("data")

        per_partenza = {partenza(e): e for e in esistenti}
        presi: set[str] = set()
        for riga in tabella.righe:
            errori_prima = len(self.errori)
            tipologia = self.id_tipologia(f, riga)
            tipo = self.obbligatoria(f, riga, "tipo", lambda v: _scelta(v, ECCEZIONI))
            giorno = self.obbligatoria(f, riga, "data", leggi_data)
            arrivo = None
            if tipo == "sposta":
                arrivo = self.obbligatoria(f, riga, "a", leggi_data)
            if len(self.errori) != errori_prima:
                continue
            nota = _testo(riga["nota"])
            if tipo == "sposta":
                elemento = {
                    "id": "",
                    "tipo": tipo,
                    "tipologia": tipologia,
                    "da": giorno.isoformat(),
                    "a": arrivo.isoformat(),
                    "nota": nota,
                }
            else:
                elemento = {
                    "id": "",
                    "tipo": tipo,
                    "tipologia": tipologia,
                    "data": giorno.isoformat(),
                    "nota": nota,
                }
            # La stessa tipologia nello stesso giorno è la stessa eccezione (§4.3):
            # nel file prende il posto di quella che c'era.
            base = per_id.get(_testo(riga["id"])) or per_partenza.get(
                partenza(elemento)
            )
            if base is not None and base["id"] not in presi:
                presi.add(base["id"])
                elemento["id"] = self.riserva(base["id"])
                self.metti("eccezioni", elemento, riga.numero, base["id"])
            else:
                elemento["id"] = self.nuovo_id(
                    "" if _testo(riga["id"]) in per_id else _testo(riga["id"])
                )
                self.metti("eccezioni", elemento, riga.numero, None)

    def promemoria(self) -> None:
        esistenti = list(self.attuale.get("promemoria", []))
        self.inizia("promemoria")
        tabella = self.tabella(PROMEMORIA)
        if tabella is None:
            return
        f = PROMEMORIA
        per_id = {p["id"]: p for p in esistenti}
        per_nome = {norma(p["nome"]): p for p in esistenti}
        presi: set[str] = set()
        for riga in tabella.righe:
            errori_prima = len(self.errori)
            nome = self.obbligatoria(f, riga, "nome", _testo)
            attivo = self.cella(f, riga, "attivo", leggi_si_no)
            quando = self.quando(riga)
            tipologie = self.tipologie_promemoria(riga)
            destinatari = self.obbligatoria(
                f, riga, "destinatari", lambda v: leggi_destinatari(v, self.noti)
            )
            if len(self.errori) != errori_prima or nome is None or quando is None:
                continue
            elemento = {
                "id": "",
                "nome": nome,
                "attivo": True if attivo is None else attivo,
                "quando": quando,
                "tipologie": tipologie,
                "destinatari": destinatari or [],
            }
            base = per_id.get(_testo(riga["id"])) or per_nome.get(norma(nome))
            if base is not None and base["id"] not in presi:
                presi.add(base["id"])
                elemento["id"] = self.riserva(base["id"])
                self.metti("promemoria", elemento, riga.numero, base["id"])
            else:
                elemento["id"] = self.nuovo_id(
                    "" if _testo(riga["id"]) in per_id else _testo(riga["id"])
                )
                self.metti("promemoria", elemento, riga.numero, None)

    def quando(self, riga: Riga) -> dict[str, Any] | None:
        f = PROMEMORIA
        tipo = self.obbligatoria(
            f, riga, "quando", lambda v: _scelta(v, QUANDO, _ALIAS_QUANDO)
        )
        if tipo is None:
            return None
        if tipo == "apertura":
            return {"tipo": tipo}
        ora = self.obbligatoria(f, riga, "ora", leggi_ora)
        if tipo == "giorni_prima":
            giorni = self.cella(
                f, riga, "giorni", lambda v: _intero(v, "giorni_prima_non_validi")
            )
            giorni = 1 if giorni is None else giorni
            return {"tipo": tipo, "giorni": giorni, "ora": ora or ""}
        return {"tipo": tipo, "ora": ora or ""}

    def tipologie_promemoria(self, riga: Riga) -> list[str] | None:
        testo = _testo(riga["tipologie"])
        if not testo or norma(testo) == norma(TUTTE):
            return None
        scelte = []
        for nome in _parti(testo, r"[,;\n]+"):
            trovata = next(
                (
                    t["id"]
                    for t in self.elementi["tipologie"]
                    if norma(t["nome"]) == norma(nome)
                ),
                None,
            )
            if trovata is None:
                self.errore(
                    PROMEMORIA, riga.numero, "tipologie", "tipologia_sconosciuta"
                )
                return None
            if trovata not in scelte:
                scelte.append(trovata)
        return scelte

    def vacanze(self) -> list[dict[str, str]]:
        attuali = [dict(v) for v in self.attuale.get("sospensioni", [])]
        risultato = attuali if self.modo == "aggiungi" else []
        self.origini["sospensioni"] = [None] * len(risultato)
        tabella = self.tabella(VACANZE)
        if tabella is None:
            return risultato
        for riga in tabella.righe:
            dal = self.obbligatoria(VACANZE, riga, "dal", leggi_data)
            al = self.obbligatoria(VACANZE, riga, "al", leggi_data)
            if dal is None or al is None:
                continue
            voce = {"dal": dal.isoformat(), "al": al.isoformat()}
            if voce not in risultato:
                risultato.append(voce)
                self.origini["sospensioni"].append(riga.numero)
        return risultato

    def impostazioni(self) -> dict[str, Any]:
        """Finestra, validità, patrono e solleciti dal foglio Impostazioni."""
        a = self.attuale
        aggiungi = self.modo == "aggiungi"
        risultato = {
            "esposizione": dict(a.get("esposizione") or FINESTRA_PREDEFINITA)
            if aggiungi
            else dict(FINESTRA_PREDEFINITA),
            "patrono": a.get("patrono") if aggiungi else None,
            "valido_fino_al": a.get("valido_fino_al") if aggiungi else None,
            "solleciti": dict(
                a.get("solleciti")
                if aggiungi and a.get("solleciti")
                else {"attivi": False, "richiami": 1, "richiamo_dopo": 30}
            ),
        }
        tabella = self.tabella(IMPOSTAZIONI)
        if tabella is None:
            return risultato
        f = IMPOSTAZIONI
        voci = {norma(v.etichetta): v for v in VOCI_IMPOSTAZIONI}
        letti: dict[str, Any] = {}
        for riga in tabella.righe:
            etichetta = _testo(riga["impostazione"])
            voce = voci.get(norma(etichetta))
            if voce is None:
                if not vuota(riga["valore"]):
                    self.errore(
                        f, riga.numero, "impostazione", "impostazione_sconosciuta"
                    )
                continue
            self.righe_impostazioni[voce.chiave] = riga.numero
            lettura = _LETTURE_IMPOSTAZIONI[voce.chiave]
            valore = self.cella(f, riga, "valore", lettura)
            if valore is not None:
                letti[voce.chiave] = valore

        finestra = risultato["esposizione"]
        for chiave, campo in (
            ("esposizione_dalle", "inizio_ora"),
            ("esposizione_del", "inizio_giorno"),
            ("esposizione_entro", "fine_ora"),
        ):
            if chiave in letti:
                finestra[campo] = letti[chiave]
        if "valido_fino_al" in letti:
            risultato["valido_fino_al"] = letti["valido_fino_al"]
        risultato["patrono"] = self.patrono(letti, risultato["patrono"])
        solleciti = risultato["solleciti"]
        for chiave, campo in (
            ("solleciti", "attivi"),
            ("solleciti_richiami", "richiami"),
            ("solleciti_dopo", "richiamo_dopo"),
        ):
            if chiave in letti:
                solleciti[campo] = letti[chiave]
        return risultato

    def patrono(self, letti: Mapping[str, Any], attuale: Any) -> Any:
        nome, giorno = letti.get("patrono_nome"), letti.get("patrono_giorno")
        if nome is None and giorno is None:
            return attuale
        if isinstance(attuale, dict):
            nome = nome or attuale.get("nome")
            giorno = giorno or attuale.get("data")
        for chiave, valore in (("patrono_nome", nome), ("patrono_giorno", giorno)):
            if valore is None:
                self.errori.append(
                    Errore(
                        IMPOSTAZIONI.nome,
                        self.righe_impostazioni.get(chiave),
                        IMPOSTAZIONI.colonna("valore").intestazione,
                        "valore_mancante",
                    )
                )
        if nome is None or giorno is None:
            return attuale
        return {"data": giorno, "nome": nome}

    # --- dai problemi della validazione alle celle ------------------------------------

    def posizione(self, percorso: str) -> Errore | None:
        """Il foglio, la riga e la colonna di un problema della validazione."""
        trovato = re.match(r"^(\w+)\[(\d+)\](?:\.(.+))?$", percorso)
        if trovato:
            sezione, indice, campo = (
                trovato.group(1),
                int(trovato.group(2)),
                trovato.group(3),
            )
            foglio = _FOGLIO_DI.get(sezione)
            origini = self.origini.get(sezione, [])
            if foglio is None:
                return None
            riga = origini[indice] if indice < len(origini) else None
            chiave = self._colonna(sezione, indice, campo or "")
            colonna = foglio.colonna(chiave).intestazione if chiave else None
            return Errore(foglio.nome, riga, colonna if riga else None, "")
        radice = percorso.split(".", 1)[0]
        chiave = {
            "esposizione": "esposizione_dalle",
            "patrono": "patrono_nome"
            if percorso.endswith("nome")
            else "patrono_giorno",
            "valido_fino_al": "valido_fino_al",
            "solleciti": {
                "solleciti.attivi": "solleciti",
                "solleciti.richiami": "solleciti_richiami",
                "solleciti.richiamo_dopo": "solleciti_dopo",
            }.get(percorso, "solleciti"),
        }.get(radice)
        if chiave is None:
            return None
        return Errore(
            IMPOSTAZIONI.nome,
            self.righe_impostazioni.get(chiave),
            IMPOSTAZIONI.colonna("valore").intestazione,
            "",
        )

    def _colonna(self, sezione: str, indice: int, campo: str) -> str | None:
        """La colonna di un campo: di solito l'ultima parte del percorso."""
        if sezione == "sospensioni":
            return "dal"
        if sezione == "regole" and campo == "ricorrenza.giorni":
            tipo = self.elementi["regole"][indice]["ricorrenza"].get("tipo")
            return "giorni_mese" if tipo == "mensile_data" else "giorni_settimana"
        if sezione == "tipologie" and campo.startswith("esposizione"):
            return "esposizione_dalle"
        ultimo = campo.rsplit(".", 1)[-1] if campo else ""
        return _COLONNE_DEI_CAMPI.get(sezione, {}).get(ultimo)


# Dal nome di un campo della configurazione alla colonna del suo foglio, dove non
# coincidono o dove il campo non ha una colonna propria.
def _stesse(*chiavi: str) -> dict[str, str]:
    return {c: c for c in chiavi}


_COLONNE_DEI_CAMPI: dict[str, dict[str, str]] = {
    "tipologie": _stesse("nome", "colore", "icona", "note"),
    "regole": _stesse(
        "tipologia", "nome", "ogni", "posizioni", "ancora", "ricorrenza", "periodo"
    )
    | _stesse("dal", "al")
    | {"giorno": "giorni_settimana"},
    "eccezioni": _stesse("tipologia", "tipo", "data", "a", "nota") | {"da": "data"},
    "promemoria": _stesse(
        "nome", "attivo", "quando", "giorni", "ora", "tipologie", "destinatari"
    ),
}

_ALIAS_INIZI = {
    "giorno prima": GIORNO_PRIMA,
    "prima": GIORNO_PRIMA,
    "la sera prima": GIORNO_PRIMA,
    "giorno stesso": GIORNO_STESSO,
    "stesso": GIORNO_STESSO,
    "stesso giorno": GIORNO_STESSO,
}
_ALIAS_QUANDO = {
    "giorno prima": "giorni_prima",
    "il giorno prima": "giorni_prima",
    "giorno del ritiro": "giorno_stesso",
    "giorno stesso": "giorno_stesso",
    "il giorno stesso": "giorno_stesso",
    "apertura": "apertura",
    "all'apertura": "apertura",
}
_LETTURE_IMPOSTAZIONI: dict[str, Callable[[Any], Any]] = {
    "esposizione_dalle": leggi_ora,
    "esposizione_del": lambda v: _scelta(v, INIZI, _ALIAS_INIZI),
    "esposizione_entro": leggi_ora,
    "valido_fino_al": lambda v: leggi_data(v).isoformat(),
    "patrono_nome": _testo,
    "patrono_giorno": leggi_giorno_mese,
    "solleciti": leggi_si_no,
    "solleciti_richiami": lambda v: _intero(v, "richiami_non_validi"),
    "solleciti_dopo": lambda v: _intero(v, "intervallo_non_valido"),
}


def _riepilogo(
    prima: Mapping[str, Any], dopo: Mapping[str, Any]
) -> dict[str, dict[str, int]]:
    """Quante cose il file aggiunge, cambia e toglie, sezione per sezione."""
    riepilogo: dict[str, dict[str, int]] = {}
    for sezione in _SEZIONI:
        vecchi = {e["id"]: e for e in prima.get(sezione, []) if isinstance(e, dict)}
        nuovi = {e["id"]: e for e in dopo.get(sezione, [])}
        riepilogo[sezione] = {
            "aggiunte": len(nuovi.keys() - vecchi.keys()),
            "modificate": sum(
                1
                for k in nuovi.keys() & vecchi.keys()
                if not _uguali(nuovi[k], vecchi[k])
            ),
            "tolte": len(vecchi.keys() - nuovi.keys()),
        }
    vecchie = {(v.get("dal"), v.get("al")) for v in prima.get("sospensioni", [])}
    nuove = {(v["dal"], v["al"]) for v in dopo.get("sospensioni", [])}
    riepilogo["sospensioni"] = {
        "aggiunte": len(nuove - vecchie),
        "modificate": 0,
        "tolte": len(vecchie - nuove),
    }
    riepilogo["impostazioni"] = {
        "aggiunte": 0,
        "modificate": sum(
            1
            for chiave in ("esposizione", "patrono", "valido_fino_al", "solleciti")
            if prima.get(chiave) != dopo.get(chiave)
        ),
        "tolte": 0,
    }
    return riepilogo


def da_tabelle(
    fogli: Mapping[str, Tabella],
    attuale: Mapping[str, Any],
    modo: Modo,
    *,
    genera_id: Callable[[], str],
    oggi: date,
    destinatari_noti: frozenset[tuple[str, str]] = frozenset(),
) -> Esito:
    """La configurazione candidata da un file letto, o gli errori che lo impediscono.

    `modo` "sostituisci": il file diventa la configurazione; "aggiungi": le righe del
    file si aggiungono a quella attuale o aggiornano gli elementi che riconoscono
    (per id, per nome, o per tipologia e giorno nelle eccezioni). In entrambi i
    casi una tipologia con lo stesso nome di una esistente ne tiene l'id, e con lui
    le entità di Home Assistant.
    """
    lettore = _Lettore(
        fogli,
        attuale,
        modo=modo,
        genera_id=genera_id,
        oggi=oggi,
        destinatari_noti=destinatari_noti,
    )
    # Gli id esistenti restano riservati: un elemento nuovo non prende mai l'id di
    # uno che c'è (o c'era), nemmeno se il file lo scrive in un'altra sezione. Chi
    # li eredita, li eredita per riconoscimento, non per caso.
    lettore.usati |= {
        e["id"]
        for sezione in _SEZIONI
        for e in attuale.get(sezione, [])
        if isinstance(e, dict) and isinstance(e.get("id"), str)
    }
    lettore.tipologie()
    lettore.regole()
    lettore.eccezioni()
    lettore.promemoria()
    sospensioni = lettore.vacanze()
    impostazioni = lettore.impostazioni()
    if lettore.errori:
        return Esito(None, _ordinati(lettore.errori))

    candidata = {
        **attuale,
        "revisione": attuale.get("revisione", 0),
        "tipologie": lettore.elementi["tipologie"],
        "regole": lettore.elementi["regole"],
        "eccezioni": lettore.elementi["eccezioni"],
        "promemoria": lettore.elementi["promemoria"],
        "sospensioni": sospensioni,
        **impostazioni,
    }
    errori = []
    for problema in problemi(candidata):
        dove = lettore.posizione(problema.percorso)
        if dove is None:
            errori.append(Errore("", None, None, problema.codice))
        else:
            errori.append(Errore(dove.foglio, dove.riga, dove.colonna, problema.codice))
    if errori:
        return Esito(None, _ordinati(errori))
    return Esito(candidata, [], _riepilogo(attuale, candidata))


def _ordinati(errori: Sequence[Errore]) -> list[Errore]:
    ordine = {f.nome: i for i, f in enumerate(FOGLI)}
    unici = list(dict.fromkeys(errori))
    return sorted(unici, key=lambda e: (ordine.get(e.foglio, 99), e.riga or 0))
