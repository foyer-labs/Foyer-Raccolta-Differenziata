"""Gli elementi del frontend si definiscono solo con `definisci` (decisione 60).

Le card si caricano come modulo extra e possono arrivare prima che l'app di Home
Assistant sostituisca il registro degli elementi: un `customElements.define` diretto
finisce nel registro vecchio, e la card compare nell'elenco ma non si può aggiungere
da interfaccia. `comune/definisci.ts` aspetta il registro definitivo.
"""

from __future__ import annotations

from pathlib import Path
import re

SORGENTI = Path(__file__).resolve().parents[2] / "frontend" / "src"
AMMESSO = SORGENTI / "comune" / "definisci.ts"


def test_nessun_define_diretto():
    diretti = [
        f"{p.relative_to(SORGENTI)}:{n}"
        for p in SORGENTI.rglob("*.ts")
        if p != AMMESSO
        for n, riga in enumerate(p.read_text(encoding="utf-8").splitlines(), 1)
        if re.search(r"customElements\.define\(", riga)
    ]
    assert not diretti, "usa definisci() di comune/definisci.ts:\n" + "\n".join(diretti)


def test_le_card_si_registrano_nel_selettore_dopo_la_definizione():
    base = (SORGENTI / "card" / "base.ts").read_text(encoding="utf-8")
    assert "quandoPronto(() => aggiungiAlSelettore(" in base
    for card in ("oggi", "settimana", "mese"):
        testo = (SORGENTI / "card" / f"{card}.ts").read_text(encoding="utf-8")
        assert "definisci(TIPO," in testo, card
