"""Le tipologie proposte all'installazione (SPEC §4.1).

I colori sono quelli dei contenitori più diffusi in Italia; molti comuni ne usano
altri, per questo restano modificabili.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Preset:
    chiave: str
    nome: str
    colore: str
    icona: str


PRESET: tuple[Preset, ...] = (
    Preset("umido", "Umido", "#795548", "mdi:food-apple"),
    Preset("carta", "Carta", "#1e88e5", "mdi:newspaper-variant"),
    Preset("plastica", "Plastica", "#fdd835", "mdi:bottle-soda"),
    Preset("vetro", "Vetro", "#43a047", "mdi:glass-fragile"),
    Preset("secco", "Secco", "#757575", "mdi:trash-can"),
    Preset("verde", "Verde", "#8bc34a", "mdi:leaf"),
)

CHIAVI_PRESET: tuple[str, ...] = tuple(p.chiave for p in PRESET)
