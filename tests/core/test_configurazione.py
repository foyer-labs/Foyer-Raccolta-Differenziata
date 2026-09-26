"""La configurazione iniziale creata dalle scelte del config flow."""

from __future__ import annotations

from itertools import count

import pytest

from custom_components.foyer_raccolta_differenziata.core.configurazione import (
    FINESTRA_PREDEFINITA,
    configurazione_iniziale,
    errore_finestra,
    stato_vuoto,
)
from custom_components.foyer_raccolta_differenziata.core.preset import (
    CHIAVI_PRESET,
    PRESET,
)


def _id_progressivi():
    contatore = count(1)
    return lambda: f"id{next(contatore)}"


def test_tutti_i_preset_nell_ordine_dei_preset():
    configurazione = configurazione_iniziale(
        reversed(CHIAVI_PRESET), FINESTRA_PREDEFINITA, _id_progressivi()
    )

    nomi = [t["nome"] for t in configurazione["tipologie"]]
    assert nomi == [p.nome for p in PRESET]
    assert [t["id"] for t in configurazione["tipologie"]] == [
        f"id{i}" for i in range(1, len(PRESET) + 1)
    ]


def test_i_pannolini_ci_sono_ma_non_sono_predefiniti():
    """Decisione 55."""
    from custom_components.foyer_raccolta_differenziata.core.preset import (
        CHIAVI_PREDEFINITE,
    )

    pannolini = next(p for p in PRESET if p.chiave == "pannolini")
    assert (pannolini.nome, pannolini.colore, pannolini.icona) == (
        "Pannolini",
        "#ec407a",
        "mdi:baby-carriage",
    )
    assert "pannolini" not in CHIAVI_PREDEFINITE
    assert CHIAVI_PREDEFINITE == (
        "umido",
        "carta",
        "plastica",
        "vetro",
        "secco",
        "verde",
    )


def test_i_colori_e_le_icone_della_spec():
    configurazione = configurazione_iniziale(
        ["umido", "plastica"], FINESTRA_PREDEFINITA, _id_progressivi()
    )

    assert configurazione["tipologie"] == [
        {
            "id": "id1",
            "nome": "Umido",
            "colore": "#795548",
            "icona": "mdi:food-apple",
            "note": "",
            "esposizione": None,
        },
        {
            "id": "id2",
            "nome": "Plastica",
            "colore": "#fdd835",
            "icona": "mdi:bottle-soda",
            "note": "",
            "esposizione": None,
        },
    ]


def test_nessun_preset_e_ammesso():
    """Le tipologie si possono creare tutte dal pannello."""
    configurazione = configurazione_iniziale(
        [], FINESTRA_PREDEFINITA, _id_progressivi()
    )

    assert configurazione["tipologie"] == []


def test_il_resto_nasce_vuoto_e_i_solleciti_spenti():
    configurazione = configurazione_iniziale(
        ["vetro"], FINESTRA_PREDEFINITA, _id_progressivi()
    )

    assert configurazione["regole"] == []
    assert configurazione["eccezioni"] == []
    assert configurazione["promemoria"] == []
    assert configurazione["sospensioni"] == []
    assert configurazione["patrono"] is None
    assert configurazione["valido_fino_al"] is None
    assert configurazione["esposizione"] == FINESTRA_PREDEFINITA
    # SPEC §4.9: spenti all'installazione.
    assert configurazione["solleciti"] == {
        "attivi": False,
        "richiami": 1,
        "richiamo_dopo": 30,
    }
    assert configurazione["revisione"] == 1


def test_preset_sconosciuto_rifiutato():
    with pytest.raises(ValueError, match="preset sconosciuti"):
        configurazione_iniziale(["tetrapak"], FINESTRA_PREDEFINITA, _id_progressivi())


def test_finestra_non_valida_rifiutata():
    finestra = {
        "inizio_giorno": "giorno_stesso",
        "inizio_ora": "08:00",
        "fine_ora": "06:00",
    }
    with pytest.raises(ValueError, match="fine_prima_di_inizio"):
        configurazione_iniziale(["umido"], finestra, _id_progressivi())


@pytest.mark.parametrize(
    ("inizio_giorno", "inizio", "fine", "atteso"),
    [
        ("giorno_prima", "20:00", "06:00", None),
        # Il giorno prima la fine è sempre dopo l'inizio, anche con la stessa ora.
        ("giorno_prima", "06:00", "06:00", None),
        ("giorno_stesso", "05:00", "12:00", None),
        ("giorno_stesso", "12:00", "12:00", "fine_prima_di_inizio"),
        ("giorno_stesso", "13:00", "12:00", "fine_prima_di_inizio"),
        ("settimana_prima", "20:00", "06:00", "inizio_giorno_non_valido"),
        ("giorno_prima", "24:00", "06:00", "orario_non_valido"),
        ("giorno_prima", "20:60", "06:00", "orario_non_valido"),
        ("giorno_prima", "8:00", "06:00", "orario_non_valido"),
        ("giorno_prima", "20:00", "06", "orario_non_valido"),
    ],
)
def test_errore_finestra(inizio_giorno, inizio, fine, atteso):
    assert errore_finestra(inizio_giorno, inizio, fine) == atteso


def test_stato_vuoto():
    assert stato_vuoto() == {
        "conferme": [],
        "invii_fatti": [],
        "pendenti": [],
        "anomalie_ignorate": [],
        "sospensione_manuale": False,
        "ultimo_istante_attivo": None,
    }
