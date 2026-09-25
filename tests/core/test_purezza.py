"""INV-1: core/ non importa niente da Home Assistant.

Se questo test fallisce, si corregge il codice, mai il test.

Due controlli, perché ognuno prende ciò che l'altro perde:

* uno statico sul sorgente: ogni import in core/ è della libreria standard o di
  un altro modulo di core/, così anche un import relativo che esce da core/ viene
  preso, pure se inutilizzato;
* uno a tempo di esecuzione in un interprete nuovo: importare i moduli puri non
  carica alcun modulo `homeassistant`, così viene preso anche un import indiretto.
"""

from __future__ import annotations

import ast
from pathlib import Path
import subprocess
import sys

RADICE = Path(__file__).resolve().parents[2]
PACCHETTO = RADICE / "custom_components" / "foyer_raccolta_differenziata"
CORE = PACCHETTO / "core"

MODULI_PURI = [
    "custom_components.foyer_raccolta_differenziata.const",
    "custom_components.foyer_raccolta_differenziata.core.calendario",
    "custom_components.foyer_raccolta_differenziata.core.configurazione",
    "custom_components.foyer_raccolta_differenziata.core.festivita",
    "custom_components.foyer_raccolta_differenziata.core.modello",
    "custom_components.foyer_raccolta_differenziata.core.preset",
    "custom_components.foyer_raccolta_differenziata.core.ricorrenze",
    "custom_components.foyer_raccolta_differenziata.core.validazione",
]


def _file_core() -> list[Path]:
    file = sorted(CORE.rglob("*.py"))
    assert file, "core/ non ha file Python: è stato spostato?"
    return file


def _violazioni(percorso: Path, core: Path) -> list[str]:
    albero = ast.parse(percorso.read_text(encoding="utf-8"), filename=str(percorso))
    # Profondità del pacchetto di questo modulo sotto core/ (core/x.py -> 0).
    profondita = len(percorso.relative_to(core).parts) - 1
    problemi = []
    for nodo in ast.walk(albero):
        if isinstance(nodo, ast.Import):
            nomi = [alias.name for alias in nodo.names]
        elif isinstance(nodo, ast.ImportFrom):
            if nodo.level > 0:
                # Un import relativo non può salire sopra core/.
                if nodo.level - 1 > profondita:
                    problemi.append(f"{percorso.name}:{nodo.lineno} esce da core/")
                continue
            nomi = [nodo.module or ""]
        else:
            continue
        for nome in nomi:
            radice = nome.split(".")[0]
            if radice == "__future__" or radice in sys.stdlib_module_names:
                continue
            problemi.append(f"{percorso.name}:{nodo.lineno} importa {nome!r}")
    return problemi


def test_core_importa_solo_libreria_standard_e_core():
    problemi = [p for f in _file_core() for p in _violazioni(f, CORE)]
    assert not problemi, "core/ deve restare puro (INV-1):\n" + "\n".join(problemi)


def test_il_controllo_statico_prende_homeassistant(tmp_path):
    """Si controlla il controllo: deve segnalare gli import per cui esiste."""
    finto_core = tmp_path / "core"
    finto_core.mkdir()
    cattivo = finto_core / "cattivo.py"
    cattivo.write_text(
        "import homeassistant.core\n"
        "from homeassistant.const import STATE_ON\n"
        "from .. import const\n"
        "from .preset import PRESET\n",
        encoding="utf-8",
    )

    problemi = _violazioni(cattivo, finto_core)

    assert len(problemi) == 3
    assert "homeassistant.core" in problemi[0]
    assert "homeassistant.const" in problemi[1]
    assert "esce da core/" in problemi[2]


def test_i_moduli_puri_si_importano_senza_homeassistant():
    script = (
        "import sys\n"
        f"for nome in {MODULI_PURI!r}:\n"
        "    __import__(nome)\n"
        "caricati = sorted(m for m in sys.modules\n"
        "                  if m == 'homeassistant' or m.startswith('homeassistant.'))\n"
        "print('\\n'.join(caricati))\n"
        "sys.exit(1 if caricati else 0)\n"
    )
    risultato = subprocess.run(
        [sys.executable, "-c", script],
        cwd=RADICE,
        capture_output=True,
        text=True,
        check=False,
    )
    assert risultato.returncode == 0, (
        "importare i moduli puri ha caricato Home Assistant:\n"
        f"{risultato.stdout}{risultato.stderr}"
    )
