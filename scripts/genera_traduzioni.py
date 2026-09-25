"""Copia strings.json in translations/en.json e translations/it.json (SPEC §12).

Il testo è uno solo, in italiano. Home Assistant ripiega sull'inglese quando la
lingua dell'utente non è disponibile: per questo anche en.json è in italiano.

    python scripts/genera_traduzioni.py           # riscrive i file
    python scripts/genera_traduzioni.py --verifica # esce con 1 se non coincidono
"""

from __future__ import annotations

from pathlib import Path
import sys

RADICE = Path(__file__).resolve().parents[1]
PACCHETTO = RADICE / "custom_components" / "foyer_raccolta_differenziata"
SORGENTE = PACCHETTO / "strings.json"
DESTINAZIONI = (
    PACCHETTO / "translations" / "en.json",
    PACCHETTO / "translations" / "it.json",
)


def divergenti() -> list[Path]:
    atteso = SORGENTE.read_bytes()
    return [d for d in DESTINAZIONI if not d.exists() or d.read_bytes() != atteso]


def main() -> int:
    if "--verifica" in sys.argv[1:]:
        diversi = divergenti()
        for percorso in diversi:
            print(f"non coincide con strings.json: {percorso.relative_to(RADICE)}")
        return 1 if diversi else 0
    for destinazione in DESTINAZIONI:
        destinazione.write_bytes(SORGENTE.read_bytes())
    return 0


if __name__ == "__main__":
    sys.exit(main())
