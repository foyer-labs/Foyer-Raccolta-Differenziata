"""I promemoria: cosa inviare, quando, e cosa ricordare (SPEC §8).

`decidi` è pura: riceve la configurazione, il calcolo dei ritiri, lo stato persistito,
un evento e l'istante corrente, e restituisce gli invii da fare adesso, lo stato nuovo
e il prossimo istante in cui richiamarla. Non manda nulla e non legge l'orologio
(INV-1): le notifiche le manda l'esecutore, il timer lo fissa lo schedulatore.

Il testo dei messaggi non è qui: un invio dice *di che tipo* è ("stasera", "oggi",
"sollecito", …) e l'esecutore lo scrive con testi.py (decisione 43).
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass, field
from datetime import UTC, date, datetime, time, timedelta, tzinfo
import hashlib
from typing import Any, Literal

from .calendario import Risultato, Ritiro

GIORNI_CONSERVA_INVII = 9
GIORNI_CONSERVA_CONFERME = 7
MINUTI_RINVIO = 30
# Il più lungo anticipo di un promemoria è 7 giorni (SPEC §8.1).
GIORNI_PIANIFICAZIONE = 8

TipoQuando = Literal["giorni_prima", "giorno_stesso", "apertura"]
TipoTesto = Literal["stasera", "oggi", "domani", "giorno", "sollecito"]


# --- configurazione ------------------------------------------------------------------


@dataclass(frozen=True)
class Quando:
    tipo: TipoQuando
    giorni: int = 0
    ora: time | None = None


@dataclass(frozen=True)
class Destinatario:
    """Un servizio `notify.<id>` oppure un'entità `notify` (decisione 31)."""

    tipo: Literal["servizio", "entita"]
    id: str

    @property
    def con_azioni(self) -> bool:
        """Solo l'app Companion mostra i pulsanti nella notifica (SPEC §8.3)."""
        return self.tipo == "servizio" and self.id.startswith("mobile_app_")

    @property
    def chiave(self) -> str:
        return f"{self.tipo}:{self.id}"


@dataclass(frozen=True)
class Profilo:
    id: str
    nome: str
    attivo: bool
    quando: Quando
    tipologie: frozenset[str] | None  # None = tutte, anche quelle create dopo
    destinatari: tuple[Destinatario, ...]


@dataclass(frozen=True)
class Solleciti:
    attivi: bool = False
    richiami: int = 1
    richiamo_dopo: int = 30


@dataclass(frozen=True)
class ConfigPromemoria:
    profili: tuple[Profilo, ...] = ()
    solleciti: Solleciti = field(default_factory=Solleciti)
    sospensioni: tuple[tuple[date, date], ...] = ()


def _ora(valore: str) -> time:
    ore, minuti = valore.split(":")
    return time(int(ore), int(minuti))


def carica_promemoria(dati: Mapping[str, Any]) -> ConfigPromemoria:
    """La parte di configurazione dei promemoria, da un archivio già validato."""
    profili = []
    for p in dati.get("promemoria", []):
        q = p["quando"]
        quando = Quando(
            tipo=q["tipo"],
            giorni=q.get("giorni", 0) or 0,
            ora=_ora(q["ora"]) if q.get("ora") else None,
        )
        tipologie = p.get("tipologie")
        profili.append(
            Profilo(
                id=p["id"],
                nome=p.get("nome", ""),
                attivo=bool(p.get("attivo", True)),
                quando=quando,
                tipologie=None if tipologie is None else frozenset(tipologie),
                destinatari=tuple(
                    Destinatario(d["tipo"], d["id"]) for d in p.get("destinatari", [])
                ),
            )
        )
    s = dati.get("solleciti") or {}
    return ConfigPromemoria(
        profili=tuple(profili),
        solleciti=Solleciti(
            attivi=bool(s.get("attivi", False)),
            richiami=int(s.get("richiami", 1)),
            richiamo_dopo=int(s.get("richiamo_dopo", 30)),
        ),
        sospensioni=tuple(
            (date.fromisoformat(v["dal"]), date.fromisoformat(v["al"]))
            for v in dati.get("sospensioni", [])
        ),
    )


# --- invii ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Invio:
    """Una notifica: a chi, per quali ritiri, di che tipo."""

    chiave: str
    gettone: str
    profilo: str
    data: date
    tipologie: tuple[str, ...]
    destinatari: tuple[Destinatario, ...]
    istante: datetime
    testo: TipoTesto
    numero: int = 0  # 0 = il promemoria, 1.. = i richiami
    rinvio: bool = False
    azioni_rinvio: bool = False


@dataclass(frozen=True)
class Scartato:
    chiave: str
    motivo: Literal["finestra_chiusa", "sospeso", "confermato"]


@dataclass(frozen=True)
class Decisione:
    invii: tuple[Invio, ...]
    stato: dict[str, Any]
    prossimo: datetime | None
    scartati: tuple[Scartato, ...] = ()


@dataclass(frozen=True)
class _Previsto:
    chiave: str
    profilo: Profilo
    data: date
    ritiri: tuple[Ritiro, ...]
    istante: datetime


def _istante(giorno: date, ora: time, fuso: tzinfo) -> datetime:
    """Stessa regola del calendario per l'ora legale (SPEC §8.1)."""
    return datetime.combine(giorno, ora, tzinfo=fuso).astimezone(UTC).astimezone(fuso)


def gettone(chiave: str) -> str:
    """Un identificativo corto e opaco per le azioni delle notifiche."""
    return hashlib.sha256(chiave.encode()).hexdigest()[:12]


def previsti(
    config: ConfigPromemoria, ritiri: Iterable[Ritiro], fuso: tzinfo
) -> list[_Previsto]:
    """Tutti gli invii che i profili prevedono per questi ritiri (SPEC §8.1, §8.2).

    Un invio raggruppa i ritiri con lo stesso profilo, la stessa data e lo stesso
    istante: "all'apertura" divide le tipologie con finestre diverse.
    """
    ritiri = tuple(ritiri)
    risultato: list[_Previsto] = []
    for profilo in config.profili:
        if not profilo.attivo or not profilo.destinatari:
            continue
        gruppi: dict[tuple[date, datetime], list[Ritiro]] = {}
        for r in ritiri:
            if profilo.tipologie is not None and r.tipologia not in profilo.tipologie:
                continue
            q = profilo.quando
            if q.tipo == "apertura":
                istante = r.inizio_esposizione
            elif q.tipo == "giorni_prima":
                istante = _istante(r.data - timedelta(days=q.giorni), q.ora, fuso)
            else:
                istante = _istante(r.data, q.ora, fuso)
            gruppi.setdefault((r.data, istante), []).append(r)
        for (giorno, istante), gruppo in sorted(gruppi.items()):
            chiave = f"{profilo.id}|{giorno.isoformat()}|{istante.isoformat()}"
            risultato.append(_Previsto(chiave, profilo, giorno, tuple(gruppo), istante))
    return risultato


# --- stato ---------------------------------------------------------------------------


def _conferme(stato: Mapping[str, Any]) -> set[tuple[date, str]]:
    return {
        (date.fromisoformat(v["data"]), v["tipologia"])
        for v in stato.get("conferme", [])
    }


def sospeso(config: ConfigPromemoria, stato: Mapping[str, Any], ora: datetime) -> bool:
    """I promemoria tacciono se l'interruttore è acceso o se oggi è in vacanza.

    Conta l'istante dell'invio, non la data del ritiro (decisione 30).
    """
    if stato.get("sospensione_manuale"):
        return True
    oggi = ora.date()
    return any(dal <= oggi <= al for dal, al in config.sospensioni)


def da_confermare_col_pulsante(
    risultato: Risultato, ora: datetime, conferme: set[tuple[date, str]]
) -> tuple[Ritiro, ...]:
    """Cosa conferma il pulsante "Esposto" (SPEC §8.4, decisione 32).

    I ritiri con la finestra aperta; se nessuna è aperta, quelli del prossimo giorno
    di ritiro, purché sia oggi o domani. Altrimenti niente.
    """
    aperti = tuple(
        r
        for r in risultato.ritiri
        if r.inizio_esposizione <= ora < r.fine_esposizione
        and (r.data, r.tipologia) not in conferme
    )
    if aperti:
        return aperti
    oggi = ora.date()
    futuri = [
        r
        for r in risultato.ritiri
        if r.fine_esposizione > ora and (r.data, r.tipologia) not in conferme
    ]
    if not futuri:
        return ()
    primo = min(r.data for r in futuri)
    if primo > oggi + timedelta(days=1):
        return ()
    return tuple(r for r in futuri if r.data == primo)


def _testo(data: date, ritiri: Iterable[Ritiro], ora: datetime) -> TipoTesto:
    oggi = ora.date()
    if data == oggi:
        return "oggi"
    if data == oggi + timedelta(days=1):
        aperta = any(r.inizio_esposizione <= ora for r in ritiri)
        return "stasera" if aperta else "domani"
    return "giorno"


# --- eventi --------------------------------------------------------------------------


@dataclass(frozen=True)
class Conferma:
    ritiri: tuple[tuple[date, str], ...]
    utente: str | None = None


@dataclass(frozen=True)
class AnnullaConferma:
    data: date
    tipologia: str


@dataclass(frozen=True)
class Rinvio:
    gettone: str
    destinatario: str  # Destinatario.chiave


@dataclass(frozen=True)
class Sospensione:
    attiva: bool


Evento = Conferma | AnnullaConferma | Rinvio | Sospensione | None


def _applica(
    evento: Evento,
    stato: dict[str, Any],
    ora: datetime,
    config: ConfigPromemoria,
) -> None:
    if isinstance(evento, Conferma):
        presenti = _conferme(stato)
        for giorno, tipologia in evento.ritiri:
            if (giorno, tipologia) in presenti:
                continue
            stato["conferme"].append(
                {
                    "data": giorno.isoformat(),
                    "tipologia": tipologia,
                    "istante": ora.isoformat(),
                    "utente": evento.utente,
                }
            )
    elif isinstance(evento, AnnullaConferma):
        stato["conferme"] = [
            v
            for v in stato["conferme"]
            if not (
                v["data"] == evento.data.isoformat()
                and v["tipologia"] == evento.tipologia
            )
        ]
    elif isinstance(evento, Rinvio) and config.solleciti.attivi:
        fatto = next(
            (v for v in stato["invii_fatti"] if v.get("gettone") == evento.gettone),
            None,
        )
        if fatto is not None:
            stato["pendenti"].append(
                {
                    "tipo": "rinvio",
                    "chiave": fatto["chiave"],
                    "gettone": fatto["gettone"],
                    "profilo": fatto["profilo"],
                    "data": fatto["data"],
                    "tipologie": list(fatto["tipologie"]),
                    "destinatari": [evento.destinatario],
                    "istante": (ora + timedelta(minutes=MINUTI_RINVIO)).isoformat(),
                    "numero": fatto.get("numero", 0),
                }
            )
    elif isinstance(evento, Sospensione):
        stato["sospensione_manuale"] = evento.attiva


def _pulisci(stato: dict[str, Any], ora: datetime) -> None:
    limite_invii = ora - timedelta(days=GIORNI_CONSERVA_INVII)
    stato["invii_fatti"] = [
        v
        for v in stato["invii_fatti"]
        if datetime.fromisoformat(v["istante"]) >= limite_invii
    ]
    limite_conferme = ora.date() - timedelta(days=GIORNI_CONSERVA_CONFERME)
    stato["conferme"] = [
        v for v in stato["conferme"] if date.fromisoformat(v["data"]) >= limite_conferme
    ]


def _destinatari(profilo: Profilo, chiavi: Iterable[str]) -> tuple[Destinatario, ...]:
    volute = set(chiavi)
    return tuple(d for d in profilo.destinatari if d.chiave in volute)


def decidi(
    config: ConfigPromemoria,
    risultato: Risultato,
    stato: Mapping[str, Any],
    evento: Evento,
    ora: datetime,
    *,
    fuso: tzinfo,
) -> Decisione:
    """Gli invii da fare adesso, lo stato nuovo, il prossimo istante (SPEC §8.7).

    Un invio previsto parte se il suo istante cade tra l'ultima esecuzione e ora, se
    non è già partito e se la finestra dei suoi ritiri non è chiusa: è così che, al
    riavvio, i promemoria persi si recuperano solo quando servono ancora (SPEC §8.6).
    """
    nuovo: dict[str, Any] = {
        "conferme": [dict(v) for v in stato.get("conferme", [])],
        "invii_fatti": [dict(v) for v in stato.get("invii_fatti", [])],
        "pendenti": [dict(v) for v in stato.get("pendenti", [])],
        "anomalie_ignorate": list(stato.get("anomalie_ignorate", [])),
        "sospensione_manuale": bool(stato.get("sospensione_manuale", False)),
        "ultimo_istante_attivo": stato.get("ultimo_istante_attivo"),
    }
    _applica(evento, nuovo, ora, config)
    _pulisci(nuovo, ora)

    ultimo = nuovo["ultimo_istante_attivo"]
    # Alla prima esecuzione non si recupera nulla: un'installazione nuova non manda
    # i promemoria di ieri.
    soglia = datetime.fromisoformat(ultimo) if ultimo else ora
    conferme = _conferme(nuovo)
    fatti = {v["chiave"] for v in nuovo["invii_fatti"]}
    zitto = sospeso(config, nuovo, ora)
    oggi = ora.date()
    vicini = [
        r
        for r in risultato.ritiri
        if oggi - timedelta(days=1)
        <= r.data
        <= oggi + timedelta(days=GIORNI_PIANIFICAZIONE)
    ]
    per_data_tipologia = {(r.data, r.tipologia): r for r in vicini}
    profili = {p.id: p for p in config.profili}

    invii: list[Invio] = []
    scartati: list[Scartato] = []
    prossimo: datetime | None = None

    def _candidato(istante: datetime) -> None:
        nonlocal prossimo
        if istante > ora and (prossimo is None or istante < prossimo):
            prossimo = istante

    def _registra(invio: Invio) -> None:
        nuovo["invii_fatti"].append(
            {
                "chiave": invio.chiave,
                "gettone": invio.gettone,
                "profilo": invio.profilo,
                "data": invio.data.isoformat(),
                "tipologie": list(invio.tipologie),
                "destinatari": [d.chiave for d in invio.destinatari],
                "istante": ora.isoformat(),
                "numero": invio.numero,
            }
        )

    # 1. I promemoria previsti.
    for p in previsti(config, vicini, fuso):
        if p.chiave in fatti:
            continue
        if p.istante > ora:
            _candidato(p.istante)
            continue
        if p.istante <= soglia:
            continue
        restanti = tuple(r for r in p.ritiri if (r.data, r.tipologia) not in conferme)
        motivo = None
        if not restanti:
            motivo = "confermato"
        elif min(r.fine_esposizione for r in restanti) <= ora:
            motivo = "finestra_chiusa"
        elif zitto:
            motivo = "sospeso"
        chiave_gettone = gettone(p.chiave)
        invio = Invio(
            chiave=p.chiave,
            gettone=chiave_gettone,
            profilo=p.profilo.id,
            data=p.data,
            tipologie=tuple(r.tipologia for r in restanti or p.ritiri),
            destinatari=p.profilo.destinatari,
            istante=p.istante,
            testo=_testo(p.data, restanti or p.ritiri, ora),
            azioni_rinvio=config.solleciti.attivi,
        )
        _registra(invio)
        if motivo:
            scartati.append(Scartato(p.chiave, motivo))
            continue
        invii.append(invio)
        # 2. Il primo richiamo, solo se la finestra è già aperta (decisione 33).
        aperta = any(r.inizio_esposizione <= ora for r in restanti)
        if config.solleciti.attivi and config.solleciti.richiami > 0 and aperta:
            nuovo["pendenti"].append(
                {
                    "tipo": "richiamo",
                    "chiave": p.chiave,
                    "gettone": chiave_gettone,
                    "profilo": p.profilo.id,
                    "data": p.data.isoformat(),
                    "tipologie": [r.tipologia for r in restanti],
                    "destinatari": [d.chiave for d in p.profilo.destinatari],
                    "istante": (
                        ora + timedelta(minutes=config.solleciti.richiamo_dopo)
                    ).isoformat(),
                    "numero": 1,
                }
            )

    # 3. Richiami e rinvii pendenti. Spenti i solleciti, spariscono (SPEC §4.9).
    if not config.solleciti.attivi:
        nuovo["pendenti"] = []
    rimasti = []
    for v in nuovo["pendenti"]:
        istante = datetime.fromisoformat(v["istante"])
        if istante > ora:
            rimasti.append(v)
            _candidato(istante)
            continue
        giorno = date.fromisoformat(v["data"])
        ritiri = [
            per_data_tipologia[(giorno, t)]
            for t in v["tipologie"]
            if (giorno, t) in per_data_tipologia and (giorno, t) not in conferme
        ]
        profilo = profili.get(v["profilo"])
        chiave = f"{v['chiave']}|{v['tipo']}|{v['numero']}|{v['istante']}"
        if not ritiri or profilo is None:
            scartati.append(Scartato(chiave, "confermato"))
            continue
        if min(r.fine_esposizione for r in ritiri) <= ora:
            scartati.append(Scartato(chiave, "finestra_chiusa"))
            continue
        if zitto:
            scartati.append(Scartato(chiave, "sospeso"))
            continue
        invio = Invio(
            chiave=v["chiave"],
            gettone=v["gettone"],
            profilo=v["profilo"],
            data=giorno,
            tipologie=tuple(r.tipologia for r in ritiri),
            destinatari=_destinatari(profilo, v["destinatari"]),
            istante=istante,
            testo="sollecito",
            numero=v["numero"],
            rinvio=v["tipo"] == "rinvio",
            azioni_rinvio=True,
        )
        if not invio.destinatari:
            continue
        invii.append(invio)
        if v["tipo"] == "richiamo" and v["numero"] < config.solleciti.richiami:
            seguente = {
                **v,
                "tipologie": list(invio.tipologie),
                "numero": v["numero"] + 1,
                "istante": (
                    ora + timedelta(minutes=config.solleciti.richiamo_dopo)
                ).isoformat(),
            }
            rimasti.append(seguente)
            _candidato(datetime.fromisoformat(seguente["istante"]))
    nuovo["pendenti"] = rimasti
    nuovo["ultimo_istante_attivo"] = ora.isoformat()
    return Decisione(tuple(invii), nuovo, prossimo, tuple(scartati))
