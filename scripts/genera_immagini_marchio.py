"""Ricava i PNG del marchio dagli SVG di docs/logo/ (SPEC §18).

Home Assistant e HACS cercano l'icona e il logo di un'integrazione in una cartella
`brand` accanto al codice; HACS vuole almeno `icon.png` per l'elenco predefinito.
Questo script scrive:

* in custom_components/foyer_raccolta_differenziata/brand/: l'icona a 256 e 512 px
  e il logotipo alto 256 e 512 px, ciascuno per fondo chiaro e per fondo scuro;
* in docs/logo/: l'icona dell'app a 512 e 192 px e i due logotipi a 256 px di
  altezza, per il README e la documentazione.

Non disegna nulla di suo: se cambiano gli SVG, lo si esegue di nuovo.

    pip install cairosvg
    python scripts/genera_immagini_marchio.py
"""

from __future__ import annotations

from pathlib import Path
import re

import cairosvg

RADICE = Path(__file__).resolve().parent.parent
LOGO = RADICE / "docs" / "logo"
BRAND = RADICE / "custom_components" / "foyer_raccolta_differenziata" / "brand"

# La pattumiera con il suo tratto, in un quadrato, senza il margine vuoto del
# simbolo: un'icona si vede piccola, e il margine la rimpicciolirebbe soltanto.
VIEWBOX_ICONA = "6.4 7.4 51.2 51.2"
PROPORZIONE_LOCKUP = 186 / 64


def _svg(nome: str, viewbox: str | None = None) -> bytes:
    testo = (LOGO / nome).read_text(encoding="utf-8")
    if viewbox:
        testo = re.sub(r'viewBox="[^"]*"', f'viewBox="{viewbox}"', testo, count=1)
    return testo.encode()


def _png(sorgente: bytes, destinazione: Path, larghezza: int, altezza: int) -> None:
    cairosvg.svg2png(
        bytestring=sorgente,
        write_to=str(destinazione),
        output_width=larghezza,
        output_height=altezza,
    )


def main() -> None:
    BRAND.mkdir(exist_ok=True)
    for prefisso, fondo in (("", "chiaro"), ("dark_", "scuro")):
        icona = _svg(f"raccolta-simbolo-fondo-{fondo}.svg", VIEWBOX_ICONA)
        lockup = _svg(f"raccolta-lockup-fondo-{fondo}.svg")
        for suffisso, lato in (("", 256), ("@2x", 512)):
            _png(icona, BRAND / f"{prefisso}icon{suffisso}.png", lato, lato)
            _png(
                lockup,
                BRAND / f"{prefisso}logo{suffisso}.png",
                round(lato * PROPORZIONE_LOCKUP),
                lato,
            )
        _png(
            lockup,
            LOGO / f"raccolta-lockup-fondo-{fondo}.png",
            round(256 * PROPORZIONE_LOCKUP),
            256,
        )
    app = _svg("raccolta-app.svg")
    for lato in (512, 192):
        _png(app, LOGO / f"raccolta-app-{lato}.png", lato, lato)


if __name__ == "__main__":
    main()
