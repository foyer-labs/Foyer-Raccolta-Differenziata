"""Le festività italiane (SPEC §4.4).

Servono solo a segnalare: nessun ritiro viene spostato perché cade in un giorno
festivo (INV-4).
"""

from __future__ import annotations

from datetime import date, timedelta
from functools import lru_cache

from .modello import Patrono

# Il 4 ottobre è festa nazionale dal 1° gennaio 2026: Legge 8 ottobre 2025 n. 151,
# Gazzetta Ufficiale n. 236 del 10/10/2025 (decisione 29).
ANNO_SAN_FRANCESCO = 2026

_FISSE: tuple[tuple[int, int, str], ...] = (
    (1, 1, "Capodanno"),
    (1, 6, "Epifania"),
    (4, 25, "Festa della Liberazione"),
    (5, 1, "Festa del lavoro"),
    (6, 2, "Festa della Repubblica"),
    (8, 15, "Ferragosto"),
    (11, 1, "Ognissanti"),
    (12, 8, "Immacolata Concezione"),
    (12, 25, "Natale"),
    (12, 26, "Santo Stefano"),
)


def pasqua(anno: int) -> date:
    """La domenica di Pasqua gregoriana (algoritmo anonimo di Meeus/Jones/Butcher)."""
    a = anno % 19
    b, c = divmod(anno, 100)
    d, e = divmod(b, 4)
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = divmod(c, 4)
    l = (32 + 2 * e + 2 * i - h - k) % 7  # noqa: E741 — nome dell'algoritmo
    m = (a + 11 * h + 22 * l) // 451
    mese, giorno = divmod(h + l - 7 * m + 114, 31)
    return date(anno, mese, giorno + 1)


@lru_cache(maxsize=256)
def _nazionali(anno: int) -> dict[date, str]:
    giorni = {date(anno, mese, giorno): nome for mese, giorno, nome in _FISSE}
    domenica = pasqua(anno)
    giorni[domenica] = "Pasqua"
    giorni[domenica + timedelta(days=1)] = "Lunedì dell'Angelo"
    if anno >= ANNO_SAN_FRANCESCO:
        giorni[date(anno, 10, 4)] = "San Francesco d'Assisi"
    return giorni


def festivita(anno: int, patrono: Patrono | None) -> dict[date, str]:
    """Le festività di un anno, con il nome. Il patrono si aggiunge se configurato.

    Se il patrono cade in una festività nazionale vale il nome della festività
    nazionale: è quella che il comune considera.
    """
    giorni = dict(_nazionali(anno))
    if patrono is not None:
        giorni.setdefault(date(anno, patrono.mese, patrono.giorno), patrono.nome)
    return giorni


def festivita_del_giorno(giorno: date, patrono: Patrono | None) -> str | None:
    return festivita(giorno.year, patrono).get(giorno)
