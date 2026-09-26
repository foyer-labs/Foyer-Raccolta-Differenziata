"""La configurazione come tabelle per il file Excel (decisione 59)."""

from __future__ import annotations

from datetime import date, datetime, time
from itertools import count
from typing import Any

import pytest

from custom_components.foyer_raccolta_differenziata.core import tabelle as tb
from custom_components.foyer_raccolta_differenziata.core.validazione import problemi

from .aiuti import (
    aggiungi,
    annuale,
    con_anno,
    grezza,
    mensile_data,
    mensile_posizione,
    regola,
    settimanale,
    sposta,
    tipologia,
    togli,
)

OGGI = date(2026, 9, 26)


def _completa() -> dict[str, Any]:
    return grezza(
        tipologie=[
            tipologia("umido", "Umido", note="Scarti di cucina"),
            tipologia(
                "vetro",
                "Vetro",
                colore="#43a047",
                esposizione={
                    "inizio_giorno": "giorno_stesso",
                    "inizio_ora": "05:00",
                    "fine_ora": "07:30",
                },
            ),
        ],
        regole=[
            regola("r1", "umido", settimanale([0, 3])),
            regola(
                "r2",
                "vetro",
                settimanale([2], ogni=2, ancora="2026-09-09"),
                nome="Estate",
                periodo=annuale("06-01", "09-30"),
            ),
            regola(
                "r3",
                "vetro",
                mensile_posizione([2, -1], 4),
                periodo=con_anno("2026-10-01", "2027-03-31"),
            ),
            regola("r4", "umido", mensile_data([1, 15])),
        ],
        eccezioni=[
            aggiungi("e1", "umido", "2026-12-24") | {"nota": "Vigilia"},
            togli("e2", "vetro", "2026-12-25"),
            sposta("e3", "umido", "2027-01-01", "2027-01-02"),
        ],
        patrono={"data": "12-07", "nome": "Sant'Ambrogio"},
        valido_fino_al="2027-06-30",
        promemoria=[
            {
                "id": "p1",
                "nome": "La sera prima",
                "attivo": True,
                "quando": {"tipo": "giorni_prima", "giorni": 1, "ora": "20:30"},
                "tipologie": None,
                "destinatari": [
                    {"tipo": "servizio", "id": "mobile_app_anna"},
                    {"tipo": "entita", "id": "notify.telegram"},
                ],
            },
            {
                "id": "p2",
                "nome": "Vetro",
                "attivo": False,
                "quando": {"tipo": "apertura"},
                "tipologie": ["vetro"],
                "destinatari": [{"tipo": "servizio", "id": "mobile_app_anna"}],
            },
        ],
        solleciti={"attivi": True, "richiami": 2, "richiamo_dopo": 45},
        sospensioni=[{"dal": "2026-08-01", "al": "2026-08-20"}],
    )


def _normale(config: dict[str, Any]) -> dict[str, Any]:
    """L'esportazione ordina le eccezioni per data e scrive la nota anche vuota."""
    return config | {
        "eccezioni": sorted(
            ({"nota": ""} | e for e in config["eccezioni"]), key=lambda e: e["id"]
        )
    }


def _lette(righe_per_foglio: dict[str, list[dict[str, Any]]]) -> dict[str, tb.Tabella]:
    """Le tabelle come le restituirebbe la lettura del file: righe dalla 5."""
    lette = {}
    for foglio in tb.FOGLI:
        righe = righe_per_foglio.get(foglio.nome)
        if righe is None:
            continue
        lette[foglio.nome] = tb.Tabella(
            colonne=frozenset(c.chiave for c in foglio.colonne),
            righe=tuple(
                tb.Riga(numero, valori)
                for numero, valori in enumerate(righe, start=5)
                if any(not tb.vuota(v) for v in valori.values())
            ),
        )
    return lette


def _ids():
    contatore = count(1)
    return lambda: f"nuovo{next(contatore)}"


def _importa(righe, attuale=None, modo="sostituisci", **altro):
    return tb.da_tabelle(
        _lette(righe),
        attuale if attuale is not None else _completa(),
        modo,
        genera_id=_ids(),
        oggi=OGGI,
        **altro,
    )


# --- andata e ritorno -------------------------------------------------------------


def test_esportare_e_reimportare_da_la_stessa_configurazione():
    config = _completa()
    assert problemi(config) == []
    esito = _importa(tb.in_tabelle(config), config)
    assert esito.errori == []
    assert _normale(esito.configurazione) == _normale(config)
    assert all(
        v == {"aggiunte": 0, "modificate": 0, "tolte": 0}
        for v in esito.riepilogo.values()
    )


def test_reimportare_in_aggiunta_non_cambia_nulla():
    config = _completa()
    esito = _importa(tb.in_tabelle(config), config, "aggiungi")
    assert esito.errori == []
    assert all(
        v == {"aggiunte": 0, "modificate": 0, "tolte": 0}
        for v in esito.riepilogo.values()
    )


def test_le_celle_esportate_sono_leggibili():
    righe = tb.in_tabelle(_completa())
    regole = righe["Regole"]
    assert regole[0]["giorni_settimana"] == "Lun, Gio"
    assert regole[1]["dal"] == "01/06"
    assert regole[2]["posizioni"] == "2°, ultimo"
    assert regole[2]["giorni_settimana"] == "Ven"
    assert regole[2]["dal"] == date(2026, 10, 1)
    assert regole[3]["giorni_mese"] == "1, 15"
    promemoria = righe["Promemoria"]
    assert promemoria[0]["destinatari"] == "mobile_app_anna, notify.telegram"
    assert promemoria[0]["tipologie"] == "Tutte"
    assert promemoria[0]["ora"] == time(20, 30)
    assert promemoria[1]["tipologie"] == "Vetro"
    impostazioni = {r["impostazione"]: r["valore"] for r in righe["Impostazioni"]}
    assert impostazioni["Giorno del santo patrono"] == "07/12"
    assert impostazioni["Solleciti"] == "Sì"


def test_il_modello_ha_le_tipologie_di_base_senza_id_e_il_resto_vuoto():
    modello = tb.modello()
    assert [r["nome"] for r in modello["Tipologie"]] == [
        "Umido",
        "Carta",
        "Plastica",
        "Vetro",
        "Secco",
        "Verde",
    ]
    assert all(r["id"] is None for r in modello["Tipologie"])
    assert modello["Regole"] == modello["Eccezioni"] == modello["Promemoria"] == []
    assert modello["Vacanze"] == []


def test_il_modello_importato_ritrova_le_tipologie_per_nome():
    attuale = grezza(
        tipologie=[tipologia("id-umido", "Umido"), tipologia("id-carta", "Carta")]
    )
    esito = _importa(tb.modello(), attuale)
    assert esito.errori == []
    ids = {t["nome"]: t["id"] for t in esito.configurazione["tipologie"]}
    assert ids["Umido"] == "id-umido" and ids["Carta"] == "id-carta"
    assert ids["Vetro"].startswith("nuovo")
    # Colori e icone sono quelli del modello: le due esistenti cambiano.
    assert esito.riepilogo["tipologie"] == {"aggiunte": 4, "modificate": 2, "tolte": 0}


# --- scrivere a mano ----------------------------------------------------------------


def _foglio_minimo(**fogli):
    base = {
        "Tipologie": [{"nome": "Umido"}, {"nome": "Carta"}],
        "Regole": [],
        "Eccezioni": [],
        "Promemoria": [],
        "Vacanze": [],
        "Impostazioni": [],
    }
    return base | fogli


def test_una_riga_scritta_a_mano_con_le_forme_comuni():
    esito = _importa(
        _foglio_minimo(
            Regole=[
                {"tipologia": "umido", "giorni_settimana": "lunedì e giovedì"},
                {
                    "tipologia": "Carta",
                    "ricorrenza": "Settimanale",
                    "ogni": 2.0,
                    "giorni_settimana": "Mer",
                    "ancora": "30/9/26",
                    "dal": "1 giugno",
                    "al": "30/09",
                },
                {
                    "tipologia": "Carta",
                    "posizioni": "1a, ultima",
                    "giorni_settimana": "venerdi",
                    "periodo": "Solo tra due date",
                    "dal": datetime(2026, 10, 1),
                    "al": 46477,
                },
                {"tipologia": "Umido", "giorni_mese": 15},
            ],
            Eccezioni=[
                {
                    "tipologia": "Umido",
                    "tipo": "sposta",
                    "data": "2026-12-25",
                    "a": date(2026, 12, 27),
                }
            ],
        ),
        grezza(),
    )
    assert esito.errori == []
    regole = esito.configurazione["regole"]
    assert regole[0]["ricorrenza"] == {
        "tipo": "settimanale",
        "ogni": 1,
        "giorni": [0, 3],
        "ancora": "2026-09-26",
    }
    assert regole[0]["periodo"] == {"tipo": "sempre"}
    assert regole[1]["ricorrenza"] == {
        "tipo": "settimanale",
        "ogni": 2,
        "giorni": [2],
        "ancora": "2026-09-30",
    }
    assert regole[1]["periodo"] == {"tipo": "annuale", "dal": "06-01", "al": "09-30"}
    assert regole[2]["ricorrenza"] == {
        "tipo": "mensile_posizione",
        "posizioni": [1, -1],
        "giorno": 4,
    }
    assert regole[2]["periodo"] == {
        "tipo": "con_anno",
        "dal": "2026-10-01",
        "al": "2027-03-31",
    }
    assert regole[3]["ricorrenza"] == {"tipo": "mensile_data", "giorni": [15]}
    assert esito.configurazione["eccezioni"][0] | {"id": ""} == {
        "id": "",
        "tipo": "sposta",
        "tipologia": esito.configurazione["tipologie"][0]["id"],
        "da": "2026-12-25",
        "a": "2026-12-27",
        "nota": "",
    }


def test_un_numero_di_serie_di_excel_e_una_data():
    assert tb.leggi_data(46112) == date(2026, 3, 31)


@pytest.mark.parametrize(
    ("valore", "atteso"),
    [
        (time(20, 0), "20:00"),
        ("20.30", "20:30"),
        ("6:05", "06:05"),
        (20, "20:00"),
        (0.25, "06:00"),
        (datetime(1899, 12, 30, 21, 15), "21:15"),
        ("20h", "20:00"),
    ],
)
def test_gli_orari_nelle_loro_forme(valore, atteso):
    assert tb.leggi_ora(valore) == atteso


@pytest.mark.parametrize("valore", ["25:00", "domani", "20:61", 1.5])
def test_un_orario_sbagliato_si_rifiuta(valore):
    with pytest.raises(tb.ValoreNonValido):
        tb.leggi_ora(valore)


@pytest.mark.parametrize(
    ("valore", "atteso"),
    [
        ("Sì", True),
        ("si", True),
        ("x", True),
        (True, True),
        ("No", False),
        ("falso", False),
    ],
)
def test_si_e_no(valore, atteso):
    assert tb.leggi_si_no(valore) is atteso


def test_i_destinatari_servizio_ed_entita():
    assert tb.leggi_destinatari(
        "mobile_app_anna; notify.telegram\nnotify.telegram"
    ) == [
        {"tipo": "servizio", "id": "mobile_app_anna"},
        {"tipo": "entita", "id": "notify.telegram"},
    ]
    noti = frozenset({("servizio", "mobile_app_anna")})
    assert tb.leggi_destinatari("notify.mobile_app_anna", noti) == [
        {"tipo": "servizio", "id": "mobile_app_anna"}
    ]


def test_una_tipologia_nuova_senza_colore_e_icona_prende_quelli_predefiniti():
    esito = _importa(
        _foglio_minimo(
            Tipologie=[{"nome": "Ingombranti"}, {"nome": "vetro", "colore": "0a0"}]
        ),
        grezza(),
    )
    assert esito.errori == []
    ingombranti, vetro = esito.configurazione["tipologie"]
    assert (ingombranti["colore"], ingombranti["icona"]) == (
        tb.COLORE_PREDEFINITO,
        tb.ICONA_PREDEFINITA,
    )
    assert (vetro["colore"], vetro["icona"]) == ("#00aa00", "mdi:glass-fragile")


# --- errori -------------------------------------------------------------------------


def _errori(esito):
    return [(e.foglio, e.riga, e.colonna, e.codice) for e in esito.errori]


def test_gli_errori_dicono_foglio_riga_e_colonna():
    esito = _importa(
        _foglio_minimo(
            Regole=[
                {"tipologia": "Plastica", "giorni_settimana": "Lun"},
                {"tipologia": "Umido", "giorni_settimana": "Lunedo"},
                {"tipologia": "Umido", "ogni": 2, "giorni_settimana": "Lun"},
                {
                    "tipologia": "Umido",
                    "posizioni": "2°",
                    "giorni_settimana": "Lun, Mar",
                },
            ],
            Eccezioni=[{"tipologia": "Umido", "tipo": "Sposta", "data": "31/02/2026"}],
        ),
        grezza(),
    )
    assert esito.configurazione is None
    assert _errori(esito) == [
        ("Regole", 5, "Tipologia", "tipologia_sconosciuta"),
        ("Regole", 6, "Giorni della settimana", "giorni_non_validi"),
        ("Regole", 7, "Un giorno di ritiro", "valore_mancante"),
        ("Regole", 8, "Giorni della settimana", "un_solo_giorno"),
        ("Eccezioni", 5, "Data", "data_non_valida"),
        ("Eccezioni", 5, "Spostato al", "valore_mancante"),
    ]


def test_i_problemi_della_validazione_tornano_alla_cella():
    esito = _importa(
        _foglio_minimo(
            Tipologie=[{"nome": "Umido"}, {"nome": "umido "}],
            Regole=[
                {
                    "tipologia": "Umido",
                    "ogni": 9,
                    "giorni_settimana": "Lun",
                    "ancora": "05/01/2026",
                },
                {
                    "tipologia": "Umido",
                    "periodo": "Ogni anno",
                    "dal": "29/02",
                    "al": "01/03",
                    "giorni_settimana": "Mar",
                },
            ],
            Promemoria=[
                {
                    "nome": "Sera",
                    "quando": "Giorni prima",
                    "giorni": 9,
                    "ora": "20:00",
                    "destinatari": "mobile_app_a",
                }
            ],
            Impostazioni=[{"impostazione": "Solleciti: quanti richiami", "valore": 5}],
        ),
        grezza(),
    )
    assert ("Tipologie", 6, "Nome", "nome_duplicato") in _errori(esito)
    assert ("Regole", 5, "Ogni quante settimane", "settimane_non_valide") in _errori(
        esito
    )
    assert ("Regole", 6, "Dal", "29_febbraio") in _errori(esito)
    assert (
        "Promemoria",
        5,
        "Quanti giorni prima",
        "giorni_prima_non_validi",
    ) in _errori(esito)
    assert ("Impostazioni", 5, "Valore", "richiami_non_validi") in _errori(esito)


def test_sostituire_senza_un_foglio_e_un_errore():
    righe = _foglio_minimo()
    del righe["Regole"]
    esito = _importa(righe, grezza())
    assert _errori(esito) == [("Regole", None, None, "foglio_mancante")]


def test_una_colonna_obbligatoria_mancante():
    lette = _lette(_foglio_minimo(Eccezioni=[{"tipologia": "Umido"}]))
    lette["Eccezioni"] = tb.Tabella(
        frozenset({"tipologia", "data"}), lette["Eccezioni"].righe
    )
    esito = tb.da_tabelle(lette, grezza(), "sostituisci", genera_id=_ids(), oggi=OGGI)
    assert _errori(esito) == [("Eccezioni", None, "Cosa", "colonna_mancante")]


def test_troppe_righe():
    righe = _foglio_minimo(
        Vacanze=[{"dal": "01/08/2026", "al": "02/08/2026"}] * (tb.MASSIMO_RIGHE + 1)
    )
    assert _errori(_importa(righe, grezza())) == [
        ("Vacanze", None, None, "troppe_righe")
    ]


# --- sostituire e aggiungere ------------------------------------------------------------


def test_sostituire_toglie_quello_che_il_file_non_ha():
    config = _completa()
    righe = tb.in_tabelle(config)
    righe["Regole"] = righe["Regole"][:1]
    righe["Eccezioni"] = []
    esito = _importa(righe, config)
    assert [r["id"] for r in esito.configurazione["regole"]] == ["r1"]
    assert esito.configurazione["eccezioni"] == []
    assert esito.riepilogo["regole"] == {"aggiunte": 0, "modificate": 0, "tolte": 3}
    assert esito.riepilogo["eccezioni"]["tolte"] == 3


def test_aggiungere_tiene_tutto_e_aggiorna_quello_che_riconosce():
    config = _completa()
    esito = _importa(
        {
            "Eccezioni": [
                {
                    "tipologia": "Vetro",
                    "tipo": "Togli",
                    "data": "25/12/2026",
                    "nota": "Natale",
                },
                {"tipologia": "Umido", "tipo": "Aggiungi", "data": "31/12/2026"},
            ],
            "Regole": [
                {
                    "tipologia": "Umido",
                    "giorni_settimana": "Lun, Gio",
                    "ancora": "05/01/2026",
                }
            ],
            "Promemoria": [
                {
                    "nome": "la sera prima",
                    "quando": "Il giorno del ritiro",
                    "ora": "07:00",
                    "destinatari": "mobile_app_anna",
                }
            ],
            "Impostazioni": [{"impostazione": "Esposizione: dalle", "valore": "21:00"}],
        },
        config,
        "aggiungi",
    )
    assert esito.errori == []
    nuova = esito.configurazione
    # La togli del 25/12 sul vetro c'era: aggiornata (la nota), non duplicata.
    e2 = next(e for e in nuova["eccezioni"] if e["id"] == "e2")
    assert e2["nota"] == "Natale"
    assert len(nuova["eccezioni"]) == 4
    # La regola identica a r1 non si duplica.
    assert len(nuova["regole"]) == 4
    # Il promemoria con lo stesso nome si aggiorna e tiene l'id.
    p1 = next(p for p in nuova["promemoria"] if p["id"] == "p1")
    assert p1["quando"] == {"tipo": "giorno_stesso", "ora": "07:00"}
    assert nuova["esposizione"]["inizio_ora"] == "21:00"
    assert nuova["patrono"] == config["patrono"]
    assert nuova["sospensioni"] == config["sospensioni"]
    assert esito.riepilogo["eccezioni"] == {"aggiunte": 1, "modificate": 1, "tolte": 0}
    assert esito.riepilogo["promemoria"] == {"aggiunte": 0, "modificate": 1, "tolte": 0}
    assert esito.riepilogo["impostazioni"]["modificate"] == 1


def test_un_id_copiato_su_due_righe_ne_da_uno_nuovo_alla_seconda():
    config = _completa()
    righe = tb.in_tabelle(config)
    righe["Regole"].append(dict(righe["Regole"][0]) | {"giorni_settimana": "Sab"})
    esito = _importa(righe, config)
    assert esito.errori == []
    ids = [r["id"] for r in esito.configurazione["regole"]]
    assert ids[:4] == ["r1", "r2", "r3", "r4"] and ids[4].startswith("nuovo")


def test_un_id_di_un_altra_casa_si_tiene_se_e_libero():
    righe = _foglio_minimo(Tipologie=[{"nome": "Umido", "id": "abc123"}])
    esito = _importa(righe, grezza(tipologie=[tipologia("xyz", "Carta")]))
    assert esito.configurazione["tipologie"][0]["id"] == "abc123"


def test_un_nuovo_elemento_non_prende_mai_l_id_di_uno_esistente():
    config = _completa()
    righe = _foglio_minimo(Tipologie=[{"nome": "Ingombranti", "id": "r1"}])
    esito = _importa(righe, config, "aggiungi")
    nuova = next(
        t for t in esito.configurazione["tipologie"] if t["nome"] == "Ingombranti"
    )
    assert nuova["id"] != "r1"


def test_patrono_a_meta():
    esito = _importa(
        _foglio_minimo(
            Impostazioni=[{"impostazione": "Santo patrono", "valore": "San Marco"}]
        ),
        grezza(),
    )
    assert _errori(esito) == [("Impostazioni", None, "Valore", "valore_mancante")]


def test_un_impostazione_sconosciuta_con_un_valore_e_un_errore():
    esito = _importa(
        _foglio_minimo(
            Impostazioni=[
                {"impostazione": "Colore preferito", "valore": "blu"},
                {"impostazione": "Nota", "valore": None},
            ]
        ),
        grezza(),
    )
    assert _errori(esito) == [
        ("Impostazioni", 5, "Impostazione", "impostazione_sconosciuta")
    ]


# --- la piattaforma ecologica (decisione 67) ------------------------------------------

PIATTAFORMA = {
    "nome": "Isola ecologica",
    "nota": "Via Roma 1",
    "periodi": [
        {
            "id": "inv",
            "dal": "2026-10-01",
            "al": "2027-03-31",
            "settimana": [
                [["08:00", "12:00"], ["14:00", "18:00"]],
                [],
                [["14:00", "18:00"]],
                [],
                [],
                [["08:00", "12:00"]],
                [],
            ],
        }
    ],
    "eccezioni": [
        {
            "id": "pe1",
            "data": "2026-12-24",
            "tipo": "aperta",
            "fasce": [["08:00", "12:00"]],
            "nota": "Vigilia",
        },
        {"id": "pe2", "data": "2026-11-02", "tipo": "chiusa", "fasce": [], "nota": ""},
    ],
}


def test_la_piattaforma_va_e_torna():
    config = _completa() | {"piattaforma": PIATTAFORMA}
    assert problemi(config) == []
    righe = tb.in_tabelle(config)
    assert righe["Piattaforma"][0]["giorno_0"] == "08:00-12:00, 14:00-18:00"
    assert righe["Piattaforma"][0]["giorno_1"] is None
    esito = _importa(righe, config)
    assert esito.errori == []
    assert esito.configurazione["piattaforma"] == PIATTAFORMA | {
        "eccezioni": sorted(PIATTAFORMA["eccezioni"], key=lambda e: e["data"])
    }
    assert esito.riepilogo["piattaforma"] == {
        "aggiunte": 0,
        "modificate": 0,
        "tolte": 0,
    }


@pytest.mark.parametrize(
    ("valore", "atteso"),
    [
        ("8-12", [["08:00", "12:00"]]),
        ("08.00 – 12.30; 15:00-18:00", [["08:00", "12:30"], ["15:00", "18:00"]]),
        ("chiusa", []),
        (None, []),
        ("9 alle 12", [["09:00", "12:00"]]),
    ],
)
def test_le_fasce_scritte_a_mano(valore, atteso):
    assert tb.leggi_fasce(valore) == atteso


def test_un_file_senza_i_fogli_della_piattaforma_la_lascia_com_e():
    config = _completa() | {"piattaforma": PIATTAFORMA}
    righe = tb.in_tabelle(config)
    del righe["Piattaforma"], righe["Piattaforma eccezioni"]
    righe["Impostazioni"] = [
        r
        for r in righe["Impostazioni"]
        if not r["impostazione"].startswith("Piattaforma")
    ]
    esito = _importa(righe, config)
    assert esito.errori == []
    assert esito.configurazione["piattaforma"] == config["piattaforma"]


def test_aggiungere_un_eccezione_della_piattaforma():
    config = _completa() | {"piattaforma": PIATTAFORMA}
    esito = _importa(
        {
            "Piattaforma eccezioni": [
                {"data": "24/12/2026", "tipo": "Chiusa"},
                {"data": "31/12/2026", "tipo": "Aperta", "fasce": "9-12"},
            ]
        },
        config,
        "aggiungi",
    )
    assert esito.errori == []
    eccezioni = {e["data"]: e for e in esito.configurazione["piattaforma"]["eccezioni"]}
    assert (
        eccezioni["2026-12-24"]["tipo"] == "chiusa"
        and eccezioni["2026-12-24"]["id"] == "pe1"
    )
    assert eccezioni["2026-12-31"]["fasce"] == [["09:00", "12:00"]]
    assert esito.riepilogo["piattaforma"] == {
        "aggiunte": 1,
        "modificate": 1,
        "tolte": 0,
    }


def test_gli_errori_della_piattaforma_tornano_alla_cella():
    config = _completa() | {"piattaforma": PIATTAFORMA}
    righe = tb.in_tabelle(config)
    righe["Piattaforma"][0]["giorno_2"] = "18:00-14:00"
    righe["Piattaforma eccezioni"][0]["fasce"] = "boh"
    esito = _importa(righe, config)
    assert ("Piattaforma eccezioni", 5, "Orari", "orario_non_valido") in _errori(esito)
    righe["Piattaforma eccezioni"][0]["fasce"] = "08:00-12:00"
    esito = _importa(righe, config)
    assert _errori(esito) == [("Piattaforma", 5, "Mer", "fascia_non_valida")]


def test_piattaforma_nuova_senza_nome_prende_quello_predefinito():
    esito = _importa(
        _foglio_minimo(
            Piattaforma=[{"dal": "01/01/2027", "al": "31/12/2027", "giorno_0": "8-12"}]
        ),
        grezza(),
    )
    assert esito.errori == []
    assert esito.configurazione["piattaforma"]["nome"] == "Piattaforma ecologica"
