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
