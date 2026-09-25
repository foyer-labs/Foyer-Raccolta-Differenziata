"""SPEC §12: un solo testo italiano, copiato in en.json e it.json."""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys

RADICE = Path(__file__).resolve().parents[2]
PACCHETTO = RADICE / "custom_components" / "foyer_raccolta_differenziata"


def test_le_traduzioni_coincidono_con_strings_json():
    risultato = subprocess.run(
        [sys.executable, "scripts/genera_traduzioni.py", "--verifica"],
        cwd=RADICE,
        capture_output=True,
        text=True,
        check=False,
    )
    assert risultato.returncode == 0, (
        risultato.stdout + "\nEsegui: python scripts/genera_traduzioni.py"
    )


def test_ogni_errore_del_config_flow_ha_un_testo():
    from custom_components.foyer_raccolta_differenziata.core import configurazione

    testi = json.loads((PACCHETTO / "strings.json").read_text(encoding="utf-8"))
    errori = testi["config"]["error"]
    sorgente = (PACCHETTO / "core" / "configurazione.py").read_text(encoding="utf-8")
    for codice in (
        "fine_prima_di_inizio",
        "inizio_giorno_non_valido",
        "orario_non_valido",
    ):
        assert f'"{codice}"' in sorgente
        assert codice in errori
    assert (
        tuple(testi["selector"]["inizio_giorno"]["options"])
        == configurazione.INIZI_POSSIBILI
    )


def test_ogni_preset_ha_un_testo():
    from custom_components.foyer_raccolta_differenziata.core.preset import PRESET

    testi = json.loads((PACCHETTO / "strings.json").read_text(encoding="utf-8"))
    opzioni = testi["selector"]["tipologie"]["options"]
    assert {p.chiave: p.nome for p in PRESET} == opzioni
