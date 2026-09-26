"""La validazione della configurazione del calendario (SPEC §4, §5)."""

from __future__ import annotations

import pytest

from custom_components.foyer_raccolta_differenziata.core.modello import (
    Annuale,
    ConAnno,
    MensileData,
    MensilePosizione,
    Settimanale,
    carica,
)
from custom_components.foyer_raccolta_differenziata.core.validazione import (
    Problema,
    problemi,
)

from .aiuti import (
    aggiungi,
    annuale,
    con_anno,
    d,
    grezza,
    mensile_data,
    mensile_posizione,
    regola,
    settimanale,
    sposta,
    tipologia,
    togli,
)


def _codici(dati) -> list[tuple[str, str]]:
    return [(p.percorso, p.codice) for p in problemi(dati)]


def test_una_configurazione_completa_e_valida_e_si_carica():
    dati = grezza(
        tipologie=[
            tipologia("umido"),
            tipologia(
                "vetro",
                esposizione={
                    "inizio_giorno": "giorno_stesso",
                    "inizio_ora": "05:00",
                    "fine_ora": "12:00",
                },
            ),
        ],
        regole=[
            regola("r1", "umido", settimanale([0, 3])),
            regola(
                "r2", "vetro", mensile_posizione([2, -1], 2), annuale("11-01", "03-31")
            ),
            regola(
                "r3", "vetro", mensile_data([15]), con_anno("2027-01-01", "2027-12-31")
            ),
        ],
        eccezioni=[
            aggiungi("e1", "umido", "2026-12-27"),
            togli("e2", "umido", "2027-01-01"),
            sposta("e3", "vetro", "2026-12-25", "2026-12-27"),
        ],
        patrono={"data": "12-07", "nome": "Sant'Ambrogio"},
        valido_fino_al="2026-12-31",
    )

    assert problemi(dati) == []
    config = carica(dati)
    assert config.regole[0].ricorrenza == Settimanale(
        ogni=1, giorni=frozenset({0, 3}), ancora=d("2026-01-05")
    )
    assert config.regole[1].ricorrenza == MensilePosizione(
        posizioni=frozenset({2, -1}), giorno=2
    )
    assert config.regole[1].periodo == Annuale(dal=(11, 1), al=(3, 31))
    assert config.regole[2].ricorrenza == MensileData(giorni=frozenset({15}))
    assert config.regole[2].periodo == ConAnno(dal=d("2027-01-01"), al=d("2027-12-31"))
    assert config.eccezioni[2].data == d("2026-12-25")
    assert config.eccezioni[2].a == d("2026-12-27")
    assert config.finestra_di(config.tipologie[1]).giorno_prima is False
    assert config.finestra_di(config.tipologie[0]).giorno_prima is True
    assert config.valido_fino_al == d("2026-12-31")


@pytest.mark.parametrize(
    ("modifica", "atteso"),
    [
        ({"nome": ""}, ("tipologie[0].nome", "nome_non_valido")),
        ({"nome": "x" * 41}, ("tipologie[0].nome", "nome_non_valido")),
        ({"colore": "marrone"}, ("tipologie[0].colore", "colore_non_valido")),
        ({"icona": "trash"}, ("tipologie[0].icona", "icona_non_valida")),
        ({"note": "x" * 501}, ("tipologie[0].note", "note_troppo_lunghe")),
        (
            {"esposizione": {"inizio_giorno": "giorno_stesso", "inizio_ora": "08:00", "fine_ora": "06:00"}},
            ("tipologie[0].esposizione", "fine_prima_di_inizio"),
        ),
        ({"id": ""}, ("tipologie[0].id", "id_mancante")),
    ],
)  # fmt: skip
def test_tipologia_non_valida(modifica, atteso):
    dati = grezza(tipologie=[tipologia("umido", **modifica)])

    assert atteso in _codici(dati)


def test_nomi_uguali_senza_distinguere_maiuscole():
    dati = grezza(tipologie=[tipologia("a", "Umido"), tipologia("b", " umido ")])

    assert _codici(dati) == [("tipologie[1].nome", "nome_duplicato")]


def test_id_duplicati_anche_tra_elementi_diversi():
    dati = grezza(regole=[regola("umido", "umido", settimanale([0]))])

    assert _codici(dati) == [("regole[0].id", "id_duplicato")]


@pytest.mark.parametrize(
    ("ricorrenza", "atteso"),
    [
        (settimanale([0], ogni=0), ("regole[0].ricorrenza.ogni", "settimane_non_valide")),
        (settimanale([0], ogni=9), ("regole[0].ricorrenza.ogni", "settimane_non_valide")),
        (settimanale([]), ("regole[0].ricorrenza.giorni", "giorni_non_validi")),
        (settimanale([7]), ("regole[0].ricorrenza.giorni", "giorni_non_validi")),
        (settimanale([0], ancora="2026-02-30"), ("regole[0].ricorrenza.ancora", "data_non_valida")),
        (settimanale([0], ancora="1999-12-31"), ("regole[0].ricorrenza.ancora", "data_non_valida")),
        (mensile_posizione([5], 0), ("regole[0].ricorrenza.posizioni", "posizioni_non_valide")),
        (mensile_posizione([], 0), ("regole[0].ricorrenza.posizioni", "posizioni_non_valide")),
        (mensile_posizione([1], 7), ("regole[0].ricorrenza.giorno", "giorni_non_validi")),
        (mensile_data([0]), ("regole[0].ricorrenza.giorni", "giorni_non_validi")),
        (mensile_data([32]), ("regole[0].ricorrenza.giorni", "giorni_non_validi")),
        ({"tipo": "bisettimanale"}, ("regole[0].ricorrenza", "ricorrenza_non_valida")),
        ({"tipo": "settimanale", "ogni": True, "giorni": [0], "ancora": "2026-01-05"},
         ("regole[0].ricorrenza.ogni", "settimane_non_valide")),
    ],
)  # fmt: skip
def test_ricorrenza_non_valida(ricorrenza, atteso):
    dati = grezza(regole=[regola("r1", "umido", ricorrenza)])

    assert atteso in _codici(dati)


@pytest.mark.parametrize(
    ("periodo", "atteso"),
    [
        (annuale("02-29", "03-31"), ("regole[0].periodo.dal", "29_febbraio")),
        (annuale("01-01", "02-29"), ("regole[0].periodo.al", "29_febbraio")),
        (annuale("04-31", "05-01"), ("regole[0].periodo.dal", "data_non_valida")),
        (annuale("4-1", "05-01"), ("regole[0].periodo.dal", "data_non_valida")),
        (con_anno("2027-12-31", "2027-01-01"), ("regole[0].periodo", "fine_prima_di_inizio")),
        (con_anno("2027-01-01", "2100-01-01"), ("regole[0].periodo.al", "data_non_valida")),
        ({"tipo": "estate"}, ("regole[0].periodo", "periodo_non_valido")),
    ],
)  # fmt: skip
def test_periodo_non_valido(periodo, atteso):
    dati = grezza(regole=[regola("r1", "umido", settimanale([0]), periodo)])

    assert atteso in _codici(dati)


def test_il_29_febbraio_e_ammesso_nelle_date_con_anno():
    dati = grezza(
        regole=[
            regola(
                "r1", "umido", settimanale([0]), con_anno("2028-02-29", "2028-03-31")
            )
        ]
    )

    assert problemi(dati) == []


def test_regola_su_tipologia_sconosciuta():
    dati = grezza(regole=[regola("r1", "carta", settimanale([0]))])

    assert _codici(dati) == [("regole[0].tipologia", "tipologia_sconosciuta")]


def test_due_eccezioni_sulla_stessa_partenza():
    """SPEC §4.3: il pannello non lo permette."""
    dati = grezza(
        eccezioni=[
            togli("e1", "umido", "2026-12-25"),
            sposta("e2", "umido", "2026-12-25", "2026-12-27"),
        ]
    )

    assert _codici(dati) == [("eccezioni[1]", "eccezione_duplicata")]


def test_stessa_data_su_tipologie_diverse_e_ammessa():
    dati = grezza(
        tipologie=[tipologia("umido"), tipologia("carta")],
        eccezioni=[
            togli("e1", "umido", "2026-12-25"),
            togli("e2", "carta", "2026-12-25"),
        ],
    )

    assert problemi(dati) == []


@pytest.mark.parametrize(
    ("eccezione", "atteso"),
    [
        (sposta("e1", "umido", "2026-12-25", "2026-12-25"), ("eccezioni[0].a", "spostamento_sullo_stesso_giorno")),
        (sposta("e1", "umido", "2026-12-25", "domani"), ("eccezioni[0].a", "data_non_valida")),
        (aggiungi("e1", "umido", "2100-01-01"), ("eccezioni[0].data", "data_non_valida")),
        (togli("e1", "carta", "2026-12-25"), ("eccezioni[0].tipologia", "tipologia_sconosciuta")),
        ({"id": "e1", "tipo": "annulla", "tipologia": "umido"}, ("eccezioni[0].tipo", "eccezione_non_valida")),
    ],
)  # fmt: skip
def test_eccezione_non_valida(eccezione, atteso):
    dati = grezza(eccezioni=[eccezione])

    assert atteso in _codici(dati)


@pytest.mark.parametrize(
    ("patrono", "atteso"),
    [
        ({"data": "02-29", "nome": "San Nessuno"}, ("patrono.data", "data_non_valida")),
        ({"data": "12-07", "nome": ""}, ("patrono.nome", "nome_non_valido")),
        ("Sant'Ambrogio", ("patrono", "patrono_non_valido")),
    ],
)
def test_patrono_non_valido(patrono, atteso):
    assert atteso in _codici(grezza(patrono=patrono))


def test_validita_non_valida():
    assert _codici(grezza(valido_fino_al="31/12/2026")) == [
        ("valido_fino_al", "data_non_valida")
    ]


def test_finestra_globale_non_valida():
    dati = grezza()
    dati["esposizione"]["fine_ora"] = "25:00"

    assert problemi(dati) == [Problema("esposizione", "orario_non_valido")]


def test_elementi_che_non_sono_oggetti():
    dati = grezza(tipologie=["umido"], regole=[None], eccezioni=[3])

    assert _codici(dati) == [
        ("tipologie[0]", "tipologia_non_valida"),
        ("regole[0]", "regola_non_valida"),
        ("eccezioni[0]", "eccezione_non_valida"),
    ]


PROFILO = {
    "id": "p1",
    "nome": "Sera prima",
    "attivo": True,
    "quando": {"tipo": "giorni_prima", "giorni": 1, "ora": "20:30"},
    "tipologie": None,
    "destinatari": [{"tipo": "servizio", "id": "mobile_app_luca"}],
}


def test_promemoria_validi():
    dati = grezza(
        promemoria=[
            PROFILO,
            {
                **PROFILO,
                "id": "p2",
                "quando": {"tipo": "apertura"},
                "tipologie": ["umido"],
                "destinatari": [{"tipo": "entita", "id": "notify.telegram"}],
            },
        ],
        solleciti={"attivi": True, "richiami": 2, "richiamo_dopo": 30},
        sospensioni=[{"dal": "2027-08-08", "al": "2027-08-23"}],
    )

    assert problemi(dati) == []


@pytest.mark.parametrize(
    ("modifica", "atteso"),
    [
        ({"nome": ""}, ("promemoria[0].nome", "nome_non_valido")),
        ({"quando": {"tipo": "settimana_prima"}}, ("promemoria[0].quando", "quando_non_valido")),
        ({"quando": {"tipo": "giorni_prima", "giorni": 8, "ora": "20:30"}}, ("promemoria[0].quando.giorni", "giorni_prima_non_validi")),
        ({"quando": {"tipo": "giorno_stesso", "ora": "7:00"}}, ("promemoria[0].quando.ora", "orario_non_valido")),
        ({"tipologie": ["carta"]}, ("promemoria[0].tipologie", "tipologia_sconosciuta")),
        ({"tipologie": []}, ("promemoria[0].tipologie", "tipologia_sconosciuta")),
        ({"destinatari": []}, ("promemoria[0].destinatari", "destinatari_mancanti")),
        ({"destinatari": [{"tipo": "servizio", "id": "notify.mobile_app_luca"}]}, ("promemoria[0].destinatari", "destinatario_non_valido")),
        ({"destinatari": [{"tipo": "entita", "id": "light.cucina"}]}, ("promemoria[0].destinatari", "destinatario_non_valido")),
    ],
)  # fmt: skip
def test_promemoria_non_validi(modifica, atteso):
    assert atteso in _codici(grezza(promemoria=[{**PROFILO, **modifica}]))


@pytest.mark.parametrize(
    ("solleciti", "atteso"),
    [
        ({"attivi": True, "richiami": 3, "richiamo_dopo": 30}, ("solleciti.richiami", "richiami_non_validi")),
        ({"attivi": True, "richiami": 1, "richiamo_dopo": 4}, ("solleciti.richiamo_dopo", "intervallo_non_valido")),
        ({"attivi": "sì", "richiami": 1, "richiamo_dopo": 30}, ("solleciti.attivi", "valore_non_valido")),
    ],
)  # fmt: skip
def test_solleciti_non_validi(solleciti, atteso):
    assert atteso in _codici(grezza(solleciti=solleciti))


def test_sospensione_al_rovescio():
    assert _codici(grezza(sospensioni=[{"dal": "2027-08-23", "al": "2027-08-08"}])) == [
        ("sospensioni[0]", "fine_prima_di_inizio")
    ]


def test_le_date_si_scrivono_solo_aaaa_mm_gg():
    """ "20261005" è la stessa data di "2026-10-05": ammetterla eluderebbe i duplicati."""
    dati = grezza(
        eccezioni=[
            togli("e1", "umido", "2026-10-05"),
            aggiungi("e2", "umido", "20261005"),
        ]
    )

    assert ("eccezioni[1].data", "data_non_valida") in _codici(dati)


def test_sezioni_che_non_sono_elenchi():
    dati = grezza()
    dati["tipologie"] = None
    dati["regole"] = {"r1": {}}

    assert ("tipologie", "elenco_non_valido") in _codici(dati)
    assert ("regole", "elenco_non_valido") in _codici(dati)


def test_ora_presente_ma_sbagliata_anche_all_apertura():
    dati = grezza(promemoria=[{**PROFILO, "quando": {"tipo": "apertura", "ora": "99"}}])

    assert ("promemoria[0].quando.ora", "orario_non_valido") in _codici(dati)


def test_destinatario_ripetuto():
    dati = grezza(
        promemoria=[{**PROFILO, "destinatari": [PROFILO["destinatari"][0]] * 2}]
    )

    assert ("promemoria[0].destinatari", "destinatario_duplicato") in _codici(dati)
