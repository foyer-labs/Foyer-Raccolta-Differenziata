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
