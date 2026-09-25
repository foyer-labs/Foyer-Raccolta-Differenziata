"""La validazione della configurazione del calendario (SPEC §4, §5).

Lavora sui dati grezzi dell'archivio e restituisce tutti i problemi, non solo il
primo: il pannello li mostra insieme. Una configurazione con problemi non si salva
(SPEC §5) e non si carica (INV-2).

Profili di promemoria, solleciti e sospensioni si validano con la Fase 5: qui si
controlla solo quello che serve al calendario.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
import re
from typing import Any

from .configurazione import errore_finestra
from .modello import ULTIMA

DATA_MINIMA = date(2000, 1, 1)
DATA_MASSIMA = date(2099, 12, 31)

_COLORE = re.compile(r"^#[0-9a-fA-F]{6}$")
_MESE_GIORNO = re.compile(r"^(\d{2})-(\d{2})$")
_GIORNI_NEL_MESE = (31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
_POSIZIONI = frozenset({1, 2, 3, 4, ULTIMA})
_GIORNI_SETTIMANA = frozenset(range(7))


@dataclass(frozen=True)
class Problema:
    """Un errore di configurazione: dove (`percorso`) e quale (`codice`)."""

    percorso: str
    codice: str


class ConfigurazioneNonValida(ValueError):
    def __init__(self, problemi: list[Problema]) -> None:
        super().__init__(", ".join(f"{p.percorso}: {p.codice}" for p in problemi))
        self.problemi = problemi


def _e_intero(valore: Any) -> bool:
    return isinstance(valore, int) and not isinstance(valore, bool)


def _testo(valore: Any, minimo: int, massimo: int) -> bool:
    return isinstance(valore, str) and minimo <= len(valore.strip()) <= massimo


def _data(valore: Any) -> date | None:
    """La data se è ISO e nell'intervallo ammesso, altrimenti None."""
    if not isinstance(valore, str):
        return None
    try:
        giorno = date.fromisoformat(valore)
    except ValueError:
        return None
    if not DATA_MINIMA <= giorno <= DATA_MASSIMA:
        return None
    return giorno


def _mese_giorno_valido(valore: Any, *, ammetti_29_febbraio: bool) -> bool:
    if not isinstance(valore, str):
        return False
    trovato = _MESE_GIORNO.match(valore)
    if not trovato:
        return False
    mese, giorno = int(trovato.group(1)), int(trovato.group(2))
    if not 1 <= mese <= 12 or not 1 <= giorno <= _GIORNI_NEL_MESE[mese - 1]:
        return False
    return ammetti_29_febbraio or (mese, giorno) != (2, 29)


def _finestra(valore: Any, percorso: str, problemi: list[Problema]) -> None:
    if not isinstance(valore, dict):
        problemi.append(Problema(percorso, "finestra_non_valida"))
        return
    errore = errore_finestra(
        str(valore.get("inizio_giorno")),
        str(valore.get("inizio_ora")),
        str(valore.get("fine_ora")),
    )
    if errore:
        problemi.append(Problema(percorso, errore))


def _ricorrenza(valore: Any, percorso: str, problemi: list[Problema]) -> None:
    if not isinstance(valore, dict):
        problemi.append(Problema(percorso, "ricorrenza_non_valida"))
        return
    tipo = valore.get("tipo")
    if tipo == "settimanale":
        ogni = valore.get("ogni")
        if not _e_intero(ogni) or not 1 <= ogni <= 8:
            problemi.append(Problema(f"{percorso}.ogni", "settimane_non_valide"))
        giorni = valore.get("giorni")
        if (
            not isinstance(giorni, list)
            or not giorni
            or not all(_e_intero(g) and g in _GIORNI_SETTIMANA for g in giorni)
        ):
            problemi.append(Problema(f"{percorso}.giorni", "giorni_non_validi"))
        if _data(valore.get("ancora")) is None:
            problemi.append(Problema(f"{percorso}.ancora", "data_non_valida"))
    elif tipo == "mensile_posizione":
        posizioni = valore.get("posizioni")
        if (
            not isinstance(posizioni, list)
            or not posizioni
            or not all(_e_intero(p) and p in _POSIZIONI for p in posizioni)
        ):
            problemi.append(Problema(f"{percorso}.posizioni", "posizioni_non_valide"))
        giorno = valore.get("giorno")
        if not _e_intero(giorno) or giorno not in _GIORNI_SETTIMANA:
            problemi.append(Problema(f"{percorso}.giorno", "giorni_non_validi"))
    elif tipo == "mensile_data":
        giorni = valore.get("giorni")
        if (
            not isinstance(giorni, list)
            or not giorni
            or not all(_e_intero(g) and 1 <= g <= 31 for g in giorni)
        ):
            problemi.append(Problema(f"{percorso}.giorni", "giorni_non_validi"))
    else:
        problemi.append(Problema(percorso, "ricorrenza_non_valida"))


def _periodo(valore: Any, percorso: str, problemi: list[Problema]) -> None:
    if not isinstance(valore, dict):
        problemi.append(Problema(percorso, "periodo_non_valido"))
        return
    tipo = valore.get("tipo")
    if tipo == "sempre":
        return
    if tipo == "annuale":
        for estremo in ("dal", "al"):
            dato = valore.get(estremo)
            if _mese_giorno_valido(dato, ammetti_29_febbraio=True) and dato == "02-29":
                # Decisione 27: negli anni non bisestili non esiste.
                problemi.append(Problema(f"{percorso}.{estremo}", "29_febbraio"))
            elif not _mese_giorno_valido(dato, ammetti_29_febbraio=False):
                problemi.append(Problema(f"{percorso}.{estremo}", "data_non_valida"))
        return
    if tipo == "con_anno":
        dal, al = _data(valore.get("dal")), _data(valore.get("al"))
        if dal is None:
            problemi.append(Problema(f"{percorso}.dal", "data_non_valida"))
        if al is None:
            problemi.append(Problema(f"{percorso}.al", "data_non_valida"))
        if dal and al and al < dal:
            problemi.append(Problema(percorso, "fine_prima_di_inizio"))
        return
    problemi.append(Problema(percorso, "periodo_non_valido"))


class _Validatore:
    """Raccoglie i problemi di una configurazione, sezione per sezione."""

    def __init__(self) -> None:
        self.trovati: list[Problema] = []
        self._visti: set[str] = set()
        self.tipologie: set[str] = set()

    def segnala(self, percorso: str, codice: str) -> None:
        self.trovati.append(Problema(percorso, codice))

    def id(self, elemento: dict[str, Any], percorso: str) -> None:
        """Ogni id è una stringa non vuota, unica in tutta la configurazione."""
        identificativo = elemento.get("id")
        if not isinstance(identificativo, str) or not identificativo:
            self.segnala(f"{percorso}.id", "id_mancante")
        elif identificativo in self._visti:
            self.segnala(f"{percorso}.id", "id_duplicato")
        else:
            self._visti.add(identificativo)

    def tipologie_(self, elenco: list[Any]) -> None:
        nomi: set[str] = set()
        for i, t in enumerate(elenco):
            percorso = f"tipologie[{i}]"
            if not isinstance(t, dict):
                self.segnala(percorso, "tipologia_non_valida")
                continue
            self.id(t, percorso)
            if isinstance(t.get("id"), str):
                self.tipologie.add(t["id"])
            nome = t.get("nome")
            if not _testo(nome, 1, 40):
                self.segnala(f"{percorso}.nome", "nome_non_valido")
            elif nome.strip().casefold() in nomi:
                self.segnala(f"{percorso}.nome", "nome_duplicato")
            else:
                nomi.add(nome.strip().casefold())
            if not isinstance(t.get("colore"), str) or not _COLORE.match(t["colore"]):
                self.segnala(f"{percorso}.colore", "colore_non_valido")
            icona = t.get("icona")
            if (
                not isinstance(icona, str)
                or not icona.startswith("mdi:")
                or len(icona) < 5
            ):
                self.segnala(f"{percorso}.icona", "icona_non_valida")
            note = t.get("note") or ""
            if not isinstance(note, str) or len(note) > 500:
                self.segnala(f"{percorso}.note", "note_troppo_lunghe")
            if t.get("esposizione") is not None:
                _finestra(t["esposizione"], f"{percorso}.esposizione", self.trovati)

    def regole(self, elenco: list[Any]) -> None:
        for i, r in enumerate(elenco):
            percorso = f"regole[{i}]"
            if not isinstance(r, dict):
                self.segnala(percorso, "regola_non_valida")
                continue
            self.id(r, percorso)
            if r.get("tipologia") not in self.tipologie:
                self.segnala(f"{percorso}.tipologia", "tipologia_sconosciuta")
            nome = r.get("nome") or ""
            if not isinstance(nome, str) or len(nome) > 40:
                self.segnala(f"{percorso}.nome", "nome_non_valido")
            _ricorrenza(r.get("ricorrenza"), f"{percorso}.ricorrenza", self.trovati)
            _periodo(r.get("periodo"), f"{percorso}.periodo", self.trovati)

    def eccezioni(self, elenco: list[Any]) -> None:
        partenze: set[tuple[str, str]] = set()
        for i, e in enumerate(elenco):
            percorso = f"eccezioni[{i}]"
            if not isinstance(e, dict):
                self.segnala(percorso, "eccezione_non_valida")
                continue
            self.id(e, percorso)
            tipologia = e.get("tipologia")
            if tipologia not in self.tipologie:
                self.segnala(f"{percorso}.tipologia", "tipologia_sconosciuta")
            tipo = e.get("tipo")
            if tipo not in ("aggiungi", "togli", "sposta"):
                self.segnala(f"{percorso}.tipo", "eccezione_non_valida")
                continue
            chiave = "da" if tipo == "sposta" else "data"
            if tipo == "sposta":
                if _data(e.get("a")) is None:
                    self.segnala(f"{percorso}.a", "data_non_valida")
                elif e.get("a") == e.get("da"):
                    self.segnala(f"{percorso}.a", "spostamento_sullo_stesso_giorno")
            if _data(e.get(chiave)) is None:
                self.segnala(f"{percorso}.{chiave}", "data_non_valida")
            else:
                # SPEC §4.3: due eccezioni sulla stessa (tipologia, data) di partenza.
                partenza = (str(tipologia), e[chiave])
                if partenza in partenze:
                    self.segnala(percorso, "eccezione_duplicata")
                partenze.add(partenza)
            nota = e.get("nota") or ""
            if not isinstance(nota, str) or len(nota) > 200:
                self.segnala(f"{percorso}.nota", "nota_troppo_lunga")

    def patrono(self, patrono: Any) -> None:
        if patrono is None:
            return
        if not isinstance(patrono, dict):
            self.segnala("patrono", "patrono_non_valido")
            return
        if not _mese_giorno_valido(patrono.get("data"), ammetti_29_febbraio=False):
            self.segnala("patrono.data", "data_non_valida")
        if not _testo(patrono.get("nome"), 1, 60):
            self.segnala("patrono.nome", "nome_non_valido")


def problemi(dati: dict[str, Any]) -> list[Problema]:
    """Tutti i problemi della parte di calendario di una configurazione grezza."""
    validatore = _Validatore()
    _finestra(dati.get("esposizione"), "esposizione", validatore.trovati)
    validatore.tipologie_(dati.get("tipologie", []))
    validatore.regole(dati.get("regole", []))
    validatore.eccezioni(dati.get("eccezioni", []))
    validatore.patrono(dati.get("patrono"))
    valido = dati.get("valido_fino_al")
    if valido is not None and _data(valido) is None:
        validatore.segnala("valido_fino_al", "data_non_valida")
    return validatore.trovati
