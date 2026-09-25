"""I testi visibili che le traduzioni di Home Assistant non possono portare (INV-5).

Home Assistant traduce nomi di entità, moduli, problemi ed eccezioni: quelli stanno
in strings.json. Il titolo della voce di configurazione, lo stato testuale dei
sensori, le descrizioni degli eventi del calendario e i messaggi delle notifiche no:
stanno qui, in un solo posto, e nessun altro modulo scrive testo visibile
(decisione 43).
"""

from __future__ import annotations

from datetime import date

TITOLO_VOCE = "Raccolta differenziata"
TITOLO_PANNELLO = "Raccolta"
NESSUNO = "Nessuno"
PRODUTTORE = "Foyer Labs"


def spostato_dal(giorno: date) -> str:
    return f"Spostato dal {giorno.strftime('%d/%m')}"


AGGIUNTO = "Ritiro aggiunto"


def prossimo_ritiro(tipologia: str) -> str:
    return f"Prossimo ritiro {tipologia}"


DA_VERIFICARE = "Da verificare: oltre la validità del calendario"


def festivo(nome: str) -> str:
    return f"Giorno festivo: {nome}"


# --- notifiche (SPEC §8.2) ------------------------------------------------------------

AZIONE_ESPOSTO = "Esposto ✓"
AZIONE_RINVIA = "Ricordamelo tra 30 minuti"
_GIORNI = ("Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica")


def elenco(nomi: list[str]) -> str:
    """ "Umido", "Umido e Carta", "Umido, Carta e Vetro"."""
    if len(nomi) <= 1:
        return "".join(nomi)
    return f"{', '.join(nomi[:-1])} e {nomi[-1]}"


def messaggio(tipo: str, nomi: list[str], giorno: date) -> str:
    cosa = elenco(nomi)
    if tipo == "stasera":
        return f"Stasera fuori: {cosa}"
    if tipo == "oggi":
        return f"Oggi: {cosa}"
    if tipo == "domani":
        return f"Domani: {cosa}"
    if tipo == "sollecito":
        return f"Ancora da esporre: {cosa}"
    return f"{_GIORNI[giorno.weekday()]} {giorno.day}: {cosa}"
