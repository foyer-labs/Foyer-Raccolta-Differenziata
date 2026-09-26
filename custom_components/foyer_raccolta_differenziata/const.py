"""Costanti condivise dall'integrazione.

Nessun import da Home Assistant: questo modulo è letto anche dalla suite pura.
"""

from __future__ import annotations

from typing import Final

DOMINIO: Final = "foyer_raccolta_differenziata"

# Chiavi dei dati raccolti dal config flow (SPEC §9.1).
CONF_TIPOLOGIE: Final = "tipologie"
CONF_INIZIO_GIORNO: Final = "inizio_giorno"
CONF_INIZIO_ORA: Final = "inizio_ora"
CONF_FINE_ORA: Final = "fine_ora"

# Archivi (SPEC §11): configurazione e stato separati, perché lo stato si salva
# ogni minuto e la configurazione no.
CHIAVE_ARCHIVIO_CONFIGURAZIONE: Final = f"{DOMINIO}.configurazione"
CHIAVE_ARCHIVIO_STATO: Final = f"{DOMINIO}.stato"
VERSIONE_ARCHIVIO_CONFIGURAZIONE: Final = 1
VERSIONE_ARCHIVIO_STATO: Final = 1

# Il pannello (SPEC §10.1) e i file del frontend.
URL_PANNELLO: Final = "raccolta-differenziata"
ELEMENTO_PANNELLO: Final = "foyer-raccolta-pannello"
ICONA_PANNELLO: Final = "mdi:trash-can-outline"
URL_STATICO: Final = "/foyer_raccolta_differenziata_statici"
MODULO_PANNELLO: Final = "raccolta-pannello.js"
MODULO_CARD: Final = "raccolta-card.js"

# Segnale di ogni ricalcolo, per le iscrizioni WebSocket di pannello e card.
SEGNALE_AGGIORNATO: Final = f"{DOMINIO}_aggiornato"

# Opzioni della voce di configurazione (SPEC §10.1.1).
OPZIONE_BARRA_LATERALE: Final = "mostra_barra_laterale"
