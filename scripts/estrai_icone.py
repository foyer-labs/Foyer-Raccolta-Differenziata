"""Estrae dal frontend di Home Assistant i tracciati delle icone MDI del banco.

Il banco di prova (banco/) disegna le icone senza Home Assistant: servono i loro
tracciati, che il pacchetto home-assistant-frontend contiene già. Le icone Material
Design Icons sono distribuite con licenza Apache-2.0 (Pictogrammers).

    python scripts/estrai_icone.py <hass_frontend/static/mdi> banco/icone.json nome1 ...
"""

from __future__ import annotations

import json
from pathlib import Path
import sys


def main() -> int:
    cartella, uscita, *nomi = sys.argv[1:]
    trovate = {}
    for file in Path(cartella).glob("*.json"):
        try:
            dati = json.loads(file.read_text(encoding="utf-8"))
        except ValueError:
            continue
        if isinstance(dati, dict):
            trovate.update({f"mdi:{n}": dati[n] for n in nomi if n in dati})
    Path(uscita).write_text(json.dumps(trovate, sort_keys=True), encoding="utf-8")
    mancanti = sorted(set(nomi) - {k[4:] for k in trovate})
    print(f"{len(trovate)} icone; mancanti: {mancanti}")
    return 1 if mancanti else 0


if __name__ == "__main__":
    sys.exit(main())
