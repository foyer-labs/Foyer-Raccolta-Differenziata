"""Ogni icona proposta nel pannello ha la sua emoji nelle notifiche, e il pannello
mostra la stessa emoji automatica del backend (decisione 71)."""

from __future__ import annotations

from pathlib import Path
import re

from custom_components.foyer_raccolta_differenziata.core.emoji import EMOJI_ICONE

RADICE = Path(__file__).parents[2]
ICONE = RADICE / "frontend" / "src" / "comune" / "icone.ts"


def _catalogo() -> dict[str, str]:
    testo = ICONE.read_text(encoding="utf-8")
    return dict(re.findall(r'\["(mdi:[a-z0-9-]+)", "[^"]*", "([^"]+)"\]', testo))


def test_ogni_icona_proposta_ha_la_sua_emoji():
    catalogo = _catalogo()
    assert catalogo, "catalogo delle icone non trovato"
    assert catalogo == EMOJI_ICONE
