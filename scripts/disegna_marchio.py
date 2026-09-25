"""Scrive i disegni SVG del marchio in docs/logo/ (SPEC §18).

Il simbolo è il segno di Foyer (due archi e la porta ambra) dentro una pattumiera
stilizzata, con la stessa grammatica dello scudo di Foyer Home Defender: tratto 3.2
su una griglia di 64, giunzioni tonde, la porta come unico elemento caldo e pieno.

Il sottotitolo "RACCOLTA DIFFERENZIATA" è in Poppins Medium convertito in tracciati:
serve il file del font per rigenerarlo, non per disegnarlo. Il font non è nel
repository (SIL OFL, da github.com/google/fonts, ofl/poppins).

    pip install fonttools
    python scripts/disegna_marchio.py --font percorso/Poppins-Medium.ttf

Dopo, `python scripts/genera_immagini_marchio.py` ricava i PNG.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

RADICE = Path(__file__).resolve().parent.parent
LOGO = RADICE / "docs" / "logo"

INK = "#0D1014"
PAPER = "#E8ECF2"
AMBRA = "#F0A835"
AMBRA_SU_CHIARO = "#B4780F"
TITOLO = "Foyer Raccolta Differenziata"
SOTTOTITOLO = "RACCOLTA DIFFERENZIATA"

# La scritta FOYER occupa da x = 77 a x = 177.9 nel logotipo: il sottotitolo si
# allarga esattamente su quella larghezza, come in Home Defender.
WORDMARK_INIZIO, WORDMARK_FINE = 77.0, 177.9
BASE_SOTTOTITOLO = 53.5
SPAZIATURA_EM = 0.06  # spaziatura tra le lettere, in frazioni di em


def _linea(colore: str, extra: str = "") -> str:
    return (
        f'fill="none" stroke="{colore}" stroke-width="3.2" '
        f'stroke-linecap="round" stroke-linejoin="round"{extra}'
    )


def simbolo(colore: str) -> str:
    """La pattumiera con il segno di Foyer, in una griglia di 64."""
    meta = _linea(colore, ' opacity="0.5"')
    return (
        f'  <path d="M26 13.5 V9 H38 V13.5" {_linea(colore)}/>\n'
        f'  <path d="M10 14.5 H54" {_linea(colore)}/>\n'
        f'  <path d="M13.5 20 L17 57 H47 L50.5 20 Z" {_linea(colore)}/>\n'
        f'  <polyline points="21,34 32,25 43,34" {meta}/>\n'
        f'  <polyline points="25.5,40.5 32,35 38.5,40.5" {_linea(colore)}/>\n'
        f'  <rect x="28.5" y="46.5" width="7" height="7" fill="{AMBRA}"/>\n'
        f'  <circle cx="32" cy="46.5" r="3.5" fill="{AMBRA}"/>\n'
    )


def icona_monocromatica() -> str:
    """Il disegno a 24 px: un solo colore, niente opacità, un solo arco.

    Ridisegnato e non rimpicciolito: a 24 px i due archi si fondono in uno e la
    metà opacità diventa grigio.
    """
    tratto = (
        'fill="none" stroke="currentColor" stroke-width="3.4" '
        'stroke-linecap="round" stroke-linejoin="round"'
    )
    return (
        f'  <path d="M26 13.5 V9 H38 V13.5" {tratto}/>\n'
        f'  <path d="M10 14.5 H54" {tratto}/>\n'
        f'  <path d="M13.5 20 L17 57 H47 L50.5 20 Z" {tratto}/>\n'
        f'  <polyline points="22,37 32,28.5 42,37" {tratto}/>\n'
        '  <rect x="28.5" y="45" width="7" height="8.5" fill="currentColor"/>\n'
        '  <circle cx="32" cy="45" r="3.5" fill="currentColor"/>\n'
    )


def _foyer(colore: str) -> str:
    """La scritta FOYER a barre e tratti, la stessa di Foyer Home Defender."""
    f = f'fill="{colore}"'
    s = f'stroke="{colore}" stroke-width="3.4" fill="none"'
    spigolo = 'stroke-linecap="butt" stroke-linejoin="miter"'
    return "".join(
        f"  {riga}\n"
        for riga in (
            f'<rect x="77" y="21" width="3.4" height="22" {f}/>',
            f'<rect x="77" y="21" width="11" height="3.4" {f}/>',
            f'<rect x="77" y="30.3" width="9" height="3.4" {f}/>',
            f'<circle cx="105.5" cy="32" r="9.8" {s}/>',
            f'<polyline points="124.3,22 131.5,32.6" {s} {spigolo}/>',
            f'<polyline points="138.7,22 131.5,32.6" {s} {spigolo}/>',
            f'<rect x="129.8" y="32" width="3.4" height="11" {f}/>',
            f'<rect x="146.5" y="21" width="3.4" height="22" {f}/>',
            f'<rect x="146.5" y="21" width="11" height="3.4" {f}/>',
            f'<rect x="146.5" y="30.3" width="9.5" height="3.4" {f}/>',
            f'<rect x="146.5" y="39.6" width="11" height="3.4" {f}/>',
            f'<rect x="164.5" y="21" width="3.4" height="22" {f}/>',
            f'<rect x="164.5" y="21" width="6.5" height="3.4" {f}/>',
            f'<rect x="164.5" y="30.3" width="6.5" height="3.4" {f}/>',
            f'<path d="M171 22.7 A4.65 4.65 0 0 1 171 32" {s}/>',
            f'<polyline points="170.5,32 176.7,42.2" {s} {spigolo}/>',
        )
    )


def _sottotitolo(font: TTFont, colore: str) -> str:
    """Il sottotitolo in tracciati, allargato da WORDMARK_INIZIO a WORDMARK_FINE."""
    glifi = font.getGlyphSet()
    mappa = font.getBestCmap()
    em = font["head"].unitsPerEm
    nomi = [mappa[ord(c)] for c in SOTTOTITOLO]
    avanzamenti = [glifi[n].width for n in nomi]
    # Prima e ultima lettera si misurano sul disegno, non sull'avanzamento: i
    # margini laterali dei glifi non devono accorciare la scritta.
    prima, ultima = BoundsPen(glifi), BoundsPen(glifi)
    glifi[nomi[0]].draw(prima)
    glifi[nomi[-1]].draw(ultima)
    sinistra = prima.bounds[0]
    naturale = (
        sum(avanzamenti[:-1])
        + SPAZIATURA_EM * em * (len(nomi) - 1)
        + ultima.bounds[2]
        - sinistra
    )
    scala = (WORDMARK_FINE - WORDMARK_INIZIO) / naturale
    x = WORDMARK_INIZIO - sinistra * scala
    righe = []
    for nome, avanzamento in zip(nomi, avanzamenti, strict=True):
        penna = SVGPathPen(glifi)
        glifi[nome].draw(penna)
        tracciato = penna.getCommands()
        if tracciato:
            righe.append(
                f'  <path d="{tracciato}" fill="{colore}" '
                f'transform="translate({x:.3f} {BASE_SOTTOTITOLO}) '
                f'scale({scala:.6f} {-scala:.6f})"/>\n'
            )
        x += (avanzamento + SPAZIATURA_EM * em) * scala
    return "".join(righe)


def _svg(viewbox: str, larghezza: int, altezza: int, corpo: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" '
        f'width="{larghezza}" height="{altezza}" role="img" aria-label="{TITOLO}">\n'
        f"  <title>{TITOLO}</title>\n{corpo}</svg>\n"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--font", required=True, type=Path, help="Poppins-Medium.ttf")
    font = TTFont(parser.parse_args().font)
    LOGO.mkdir(parents=True, exist_ok=True)

    file = {
        "raccolta-simbolo-fondo-scuro.svg": _svg("0 0 64 64", 256, 256, simbolo(PAPER)),
        "raccolta-simbolo-fondo-chiaro.svg": _svg("0 0 64 64", 256, 256, simbolo(INK)),
        "raccolta-icona.svg": _svg("0 0 64 64", 24, 24, icona_monocromatica()),
        "raccolta-app.svg": _svg(
            "0 0 64 64",
            512,
            512,
            f'  <rect width="64" height="64" rx="14" fill="{INK}"/>\n'
            '  <g transform="translate(32 32) scale(0.84) translate(-32 -32)">\n'
            f"{simbolo(PAPER)}  </g>\n",
        ),
        "raccolta-lockup-fondo-scuro.svg": _svg(
            "0 0 186 64",
            744,
            256,
            simbolo(PAPER) + _foyer(PAPER) + _sottotitolo(font, AMBRA),
        ),
        "raccolta-lockup-fondo-chiaro.svg": _svg(
            "0 0 186 64",
            744,
            256,
            simbolo(INK) + _foyer(INK) + _sottotitolo(font, AMBRA_SU_CHIARO),
        ),
    }
    for nome, contenuto in file.items():
        (LOGO / nome).write_text(contenuto, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
