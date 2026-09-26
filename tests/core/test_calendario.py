"""Il motore di calcolo (SPEC §6) e le anomalie (SPEC §6.3)."""

from __future__ import annotations

from datetime import datetime

import pytest

from custom_components.foyer_raccolta_differenziata.core.calendario import (
    Anomalia,
    Origine,
    anomalie,
    calcola,
)

from .aiuti import (
    ROMA,
    aggiungi,
    annuale,
    con_anno,
    configura,
    d,
    mensile_data,
    regola,
    settimanale,
    sposta,
    tipologia,
    togli,
)

LUN, MAR, MER, GIO, VEN, SAB, DOM = range(7)


def _date(config, dal: str, al: str, tip: str | None = None) -> list[str]:
    risultato = calcola(config, d(dal), d(al), ROMA)
    return [
        r.data.isoformat()
        for r in risultato.ritiri
        if tip is None or r.tipologia == tip
    ]


def _codici(elenco) -> list[str]:
    return [a.codice for a in elenco]


# --- Regole e precedenze ---------------------------------------------------------


def test_una_regola_settimanale():
    config = configura(regole=[regola("r1", "umido", settimanale([LUN, GIO]))])

    assert _date(config, "2026-09-21", "2026-09-27") == ["2026-09-21", "2026-09-24"]


def test_i_ritiri_sono_ordinati_per_data_e_per_tipologia():
    config = configura(
        tipologie=[tipologia("umido"), tipologia("carta")],
        regole=[
            regola("r1", "carta", settimanale([LUN])),
            regola("r2", "umido", settimanale([LUN, MAR])),
        ],
    )

    risultato = calcola(config, d("2026-09-21"), d("2026-09-22"), ROMA)

    assert [(r.data.isoformat(), r.tipologia) for r in risultato.ritiri] == [
        ("2026-09-21", "umido"),
        ("2026-09-21", "carta"),
        ("2026-09-22", "umido"),
    ]


def test_estate_e_inverno():
    config = configura(
        regole=[
            regola("estate", "umido", settimanale([MER]), annuale("04-01", "10-31")),
            regola(
                "inverno",
                "umido",
                settimanale([MER], ogni=2, ancora="2026-11-04"),
                annuale("11-01", "03-31"),
            ),
        ]
    )

    assert _date(config, "2026-10-21", "2026-11-30") == [
        "2026-10-21",
        "2026-10-28",
        "2026-11-04",
        "2026-11-18",
    ]


def test_fuori_da_ogni_periodo_nessun_ritiro():
    config = configura(
        regole=[regola("r1", "umido", settimanale([MER]), annuale("04-01", "10-31"))]
    )

    assert _date(config, "2026-11-01", "2027-03-31") == []


def test_la_regola_con_anno_vince_sull_annuale():
    """Decisione 5: nel 2027 vale solo il calendario 2027."""
    config = configura(
        regole=[
            regola("abitudine", "umido", settimanale([LUN]), annuale("01-01", "12-31")),
            regola("nuovo", "umido", settimanale([MAR]), con_anno("2027-01-01", "2027-12-31")),
        ]
    )  # fmt: skip

    assert _date(config, "2026-12-28", "2027-01-10") == [
        "2026-12-28",
        "2027-01-05",
    ]


def test_la_regola_con_anno_vince_anche_su_sempre():
    """Decisione 28."""
    config = configura(
        regole=[
            regola("sempre", "umido", settimanale([LUN])),
            regola("nuovo", "umido", settimanale([MAR]), con_anno("2027-01-01", "2027-01-31")),
        ]
    )  # fmt: skip

    assert _date(config, "2027-01-25", "2027-02-02") == ["2027-01-26", "2027-02-01"]


def test_regole_dello_stesso_tipo_si_sommano():
    """Decisione 22."""
    config = configura(
        regole=[
            regola("lun", "umido", settimanale([LUN])),
            regola("gio", "umido", settimanale([GIO])),
        ]
    )

    risultato = calcola(config, d("2026-09-21"), d("2026-09-27"), ROMA)

    assert [r.origine for r in risultato.ritiri] == [
        Origine("regola", regole=("lun",)),
        Origine("regola", regole=("gio",)),
    ]


def test_due_regole_sullo_stesso_giorno_danno_un_solo_ritiro():
    config = configura(
        regole=[
            regola("a", "umido", settimanale([LUN])),
            regola("b", "umido", settimanale([LUN, GIO])),
        ]
    )

    risultato = calcola(config, d("2026-09-21"), d("2026-09-21"), ROMA)

    assert len(risultato.ritiri) == 1
    assert risultato.ritiri[0].origine == Origine("regola", regole=("a", "b"))


def test_tipologia_senza_regole_solo_con_aggiunte():
    """Decisione 17: gli ingombranti."""
    config = configura(
        tipologie=[tipologia("ingombranti")],
        eccezioni=[aggiungi("e1", "ingombranti", "2026-10-14")],
    )

    risultato = calcola(config, d("2026-10-01"), d("2026-10-31"), ROMA)

    assert [(r.data.isoformat(), r.origine) for r in risultato.ritiri] == [
        ("2026-10-14", Origine("aggiunto"))
    ]


# --- Eccezioni -------------------------------------------------------------------


def test_togli():
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[togli("e1", "umido", "2026-12-25")],
    )

    assert _date(config, "2026-12-18", "2027-01-01") == ["2026-12-18", "2027-01-01"]


def test_sposta():
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[sposta("e1", "umido", "2026-12-25", "2026-12-27")],
    )

    risultato = calcola(config, d("2026-12-24"), d("2026-12-31"), ROMA)

    assert [(r.data.isoformat(), r.origine) for r in risultato.ritiri] == [
        ("2026-12-27", Origine("spostato", da=d("2026-12-25")))
    ]


def test_sposta_con_arrivo_nell_intervallo_e_partenza_fuori():
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[sposta("e1", "umido", "2026-12-25", "2027-01-02")],
    )

    assert _date(config, "2027-01-02", "2027-01-02") == ["2027-01-02"]
    assert _date(config, "2026-12-25", "2026-12-25") == []


def test_aggiungi_su_un_giorno_gia_di_ritiro_non_duplica():
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[aggiungi("e1", "umido", "2026-12-25")],
    )

    risultato = calcola(config, d("2026-12-25"), d("2026-12-25"), ROMA)

    assert len(risultato.ritiri) == 1
    assert risultato.ritiri[0].origine.tipo == "regola"


def test_togli_poi_sposta_sullo_stesso_giorno():
    """Ordine togli → sposta: il ritiro spostato su un giorno tolto resta."""
    config = configura(
        regole=[regola("r1", "umido", settimanale([LUN, VEN]))],
        eccezioni=[
            togli("e1", "umido", "2026-12-28"),
            sposta("e2", "umido", "2026-12-25", "2026-12-28"),
        ],
    )

    risultato = calcola(config, d("2026-12-25"), d("2026-12-28"), ROMA)

    assert [(r.data.isoformat(), r.origine) for r in risultato.ritiri] == [
        ("2026-12-28", Origine("spostato", da=d("2026-12-25")))
    ]


@pytest.mark.parametrize("ordine", [(0, 1), (1, 0)])
def test_catena_di_spostamenti_indipendente_dall_ordine(ordine):
    """Uno spostamento che arriva dove un altro parte resta, in qualunque ordine."""
    spostamenti = [
        sposta("e1", "umido", "2026-12-25", "2026-12-27"),
        sposta("e2", "umido", "2026-12-18", "2026-12-25"),
    ]
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[spostamenti[i] for i in ordine],
    )

    assert _date(config, "2026-12-14", "2026-12-31") == ["2026-12-25", "2026-12-27"]


def test_un_eccezione_di_un_altra_tipologia_non_conta():
    config = configura(
        tipologie=[tipologia("umido"), tipologia("carta")],
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[togli("e1", "carta", "2026-12-25")],
    )

    assert _date(config, "2026-12-25", "2026-12-25") == ["2026-12-25"]


# --- Finestra, festivi, validità --------------------------------------------------


def test_la_finestra_di_esposizione_assoluta():
    config = configura(regole=[regola("r1", "umido", settimanale([GIO]))])

    ritiro = calcola(config, d("2026-09-24"), d("2026-09-24"), ROMA).ritiri[0]

    assert ritiro.inizio_esposizione == datetime(2026, 9, 23, 20, 0, tzinfo=ROMA)
    assert ritiro.fine_esposizione == datetime(2026, 9, 24, 6, 0, tzinfo=ROMA)


def test_la_finestra_della_tipologia_sovrascrive_la_globale():
    vetro = tipologia(
        "vetro",
        esposizione={
            "inizio_giorno": "giorno_stesso",
            "inizio_ora": "05:00",
            "fine_ora": "12:00",
        },
    )
    config = configura(
        tipologie=[vetro], regole=[regola("r1", "vetro", settimanale([GIO]))]
    )

    ritiro = calcola(config, d("2026-09-24"), d("2026-09-24"), ROMA).ritiri[0]

    assert ritiro.inizio_esposizione == datetime(2026, 9, 24, 5, 0, tzinfo=ROMA)
    assert ritiro.fine_esposizione == datetime(2026, 9, 24, 12, 0, tzinfo=ROMA)


def test_un_orario_saltato_dall_ora_legale_vale_al_primo_minuto_valido():
    """29 marzo 2026: alle 02:00 in Italia si passa alle 03:00 (SPEC §8.1)."""
    notturna = tipologia(
        "umido",
        esposizione={
            "inizio_giorno": "giorno_stesso",
            "inizio_ora": "02:30",
            "fine_ora": "06:00",
        },
    )
    config = configura(
        tipologie=[notturna], regole=[regola("r1", "umido", settimanale([DOM]))]
    )

    ritiro = calcola(config, d("2026-03-29"), d("2026-03-29"), ROMA).ritiri[0]

    assert ritiro.inizio_esposizione.isoformat() == "2026-03-29T03:00:00+02:00"


def test_un_orario_ripetuto_dall_ora_solare_vale_alla_prima_occorrenza():
    """25 ottobre 2026: alle 03:00 in Italia si torna alle 02:00."""
    notturna = tipologia(
        "umido",
        esposizione={
            "inizio_giorno": "giorno_stesso",
            "inizio_ora": "02:30",
            "fine_ora": "06:00",
        },
    )
    config = configura(
        tipologie=[notturna], regole=[regola("r1", "umido", settimanale([DOM]))]
    )

    ritiro = calcola(config, d("2026-10-25"), d("2026-10-25"), ROMA).ritiri[0]

    assert ritiro.inizio_esposizione.isoformat() == "2026-10-25T02:30:00+02:00"


def test_ritiro_festivo_segnalato_non_spostato():
    """Decisione 2, INV-4."""
    config = configura(regole=[regola("r1", "umido", settimanale([VEN]))])

    risultato = calcola(config, d("2026-12-25"), d("2026-12-25"), ROMA)

    assert risultato.ritiri[0].data == d("2026-12-25")
    assert risultato.ritiri[0].festivo == "Natale"
    assert risultato.anomalie == (
        Anomalia("ritiro_festivo", "avviso", tipologia="umido", data=d("2026-12-25")),
    )


def test_ritiro_festivo_ignorato():
    config = configura(regole=[regola("r1", "umido", settimanale([VEN]))])

    risultato = calcola(
        config,
        d("2026-12-25"),
        d("2026-12-25"),
        ROMA,
        festivi_ignorati=frozenset({(d("2026-12-25"), "umido")}),
    )

    assert risultato.ritiri[0].festivo == "Natale"
    assert risultato.anomalie == ()


def test_ritiro_sul_patrono():
    config = configura(
        regole=[regola("r1", "umido", settimanale([LUN]))],
        patrono={"data": "12-07", "nome": "Sant'Ambrogio"},
    )

    risultato = calcola(config, d("2026-12-07"), d("2026-12-07"), ROMA)

    assert risultato.ritiri[0].festivo == "Sant'Ambrogio"


def test_oltre_la_validita_i_ritiri_sono_da_verificare():
    config = configura(
        regole=[regola("r1", "umido", settimanale([GIO]))],
        valido_fino_al="2026-12-31",
    )

    risultato = calcola(config, d("2026-12-31"), d("2027-01-07"), ROMA)

    assert [(r.data.isoformat(), r.da_verificare) for r in risultato.ritiri] == [
        ("2026-12-31", False),
        ("2027-01-07", True),
    ]


def test_intervallo_vuoto():
    config = configura()

    with pytest.raises(ValueError, match="intervallo vuoto"):
        calcola(config, d("2026-01-02"), d("2026-01-01"), ROMA)


# --- Anomalie della configurazione -------------------------------------------------

OGGI = d("2026-09-25")


def test_sovrapposizione_mista_con_gli_intervalli():
    config = configura(
        regole=[
            regola("estate", "umido", settimanale([MER]), annuale("04-01", "10-31")),
            regola("nuovo", "umido", settimanale([MER, SAB]), con_anno("2027-06-01", "2027-11-30")),
        ]
    )  # fmt: skip

    trovate = [a for a in anomalie(config, OGGI) if a.codice == "sovrapposizione_mista"]

    assert trovate == [
        Anomalia(
            "sovrapposizione_mista",
            "avviso",
            tipologia="umido",
            regole=("estate", "nuovo"),
            intervalli=((d("2027-06-01"), d("2027-10-31")),),
        )
    ]


def test_sovrapposizione_mista_conclusa_non_si_segnala():
    config = configura(
        regole=[
            regola("sempre", "umido", settimanale([MER])),
            regola("vecchio", "umido", settimanale([SAB]), con_anno("2025-01-01", "2025-12-31")),
        ]
    )  # fmt: skip

    assert "sovrapposizione_mista" not in _codici(anomalie(config, OGGI))


def test_sovrapposizione_mista_in_corso_parte_da_oggi():
    config = configura(
        regole=[
            regola("sempre", "umido", settimanale([MER])),
            regola("in_corso", "umido", settimanale([SAB]), con_anno("2026-01-01", "2026-12-31")),
        ]
    )  # fmt: skip

    trovata = next(
        a for a in anomalie(config, OGGI) if a.codice == "sovrapposizione_mista"
    )

    assert trovata.intervalli == ((OGGI, d("2026-12-31")),)


def test_regole_dello_stesso_tipo_con_giorni_diversi_non_sono_un_anomalia():
    """Risposta del proprietario alla Fase 1: "lunedì" + "giovedì" non avvisa."""
    config = configura(
        regole=[
            regola("lun", "umido", settimanale([LUN])),
            regola("gio", "umido", settimanale([GIO])),
        ]
    )

    assert "sovrapposizione_stesso_tipo" not in _codici(anomalie(config, OGGI))


def test_regole_dello_stesso_tipo_sullo_stesso_giorno_sono_un_anomalia():
    config = configura(
        regole=[
            regola("lun", "umido", settimanale([LUN])),
            regola("lun_gio", "umido", settimanale([LUN, GIO])),
        ]
    )

    trovata = next(
        a for a in anomalie(config, OGGI) if a.codice == "sovrapposizione_stesso_tipo"
    )

    assert trovata.regole == ("lun", "lun_gio")
    assert trovata.intervalli[0][0] == d("2026-09-28")
    assert trovata.conteggio in (52, 53)


def test_una_regola_ceduta_non_conta_per_lo_stesso_tipo():
    """Una regola annuale ignorata perché c'è una con anno non è anche ridondante."""
    config = configura(
        regole=[
            regola("abitudine", "umido", settimanale([LUN])),
            regola("nuovo", "umido", settimanale([LUN]), con_anno("2026-09-25", "2027-09-24")),
        ]
    )  # fmt: skip

    assert _codici(anomalie(config, OGGI)) == ["sovrapposizione_mista"]


def test_eccezione_senza_ritiro_da_togliere():
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[
            togli("e1", "umido", "2026-12-24"),
            sposta("e2", "umido", "2026-12-23", "2026-12-27"),
        ],
    )

    trovate = anomalie(config, OGGI)

    assert [(a.codice, a.eccezione) for a in trovate] == [
        ("eccezione_senza_ritiro", "e1"),
        ("eccezione_senza_ritiro", "e2"),
    ]


def test_eccezione_ridondante():
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[
            aggiungi("e1", "umido", "2026-12-25"),
            sposta("e2", "umido", "2026-12-18", "2027-01-01"),
        ],
    )

    trovate = anomalie(config, OGGI)

    assert [(a.codice, a.eccezione, a.data) for a in trovate] == [
        ("eccezione_ridondante", "e2", d("2027-01-01")),
        ("eccezione_ridondante", "e1", d("2026-12-25")),
    ]


def test_arrivo_su_un_giorno_tolto_non_e_ridondante():
    config = configura(
        regole=[regola("r1", "umido", settimanale([LUN, VEN]))],
        eccezioni=[
            togli("e1", "umido", "2026-12-28"),
            sposta("e2", "umido", "2026-12-25", "2026-12-28"),
        ],
    )

    assert _codici(anomalie(config, OGGI)) == []


def test_eccezioni_passate_non_si_segnalano():
    config = configura(
        regole=[regola("r1", "umido", settimanale([VEN]))],
        eccezioni=[togli("e1", "umido", "2025-12-24")],
    )

    assert _codici(anomalie(config, OGGI)) == []


def test_giorno_inesistente():
    config = configura(regole=[regola("r1", "umido", mensile_data([15, 30, 31]))])

    assert anomalie(config, OGGI) == (
        Anomalia(
            "giorno_inesistente",
            "info",
            tipologia="umido",
            regole=("r1",),
            giorni=(30, 31),
        ),
    )


def test_tipologia_senza_ritiri():
    config = configura(tipologie=[tipologia("umido"), tipologia("ingombranti")],
                       regole=[regola("r1", "umido", settimanale([LUN]))])  # fmt: skip

    assert anomalie(config, OGGI) == (
        Anomalia("tipologia_senza_ritiri", "info", tipologia="ingombranti"),
    )


def test_tipologia_con_ritiri_oltre_l_orizzonte_e_senza_ritiri():
    # L'orizzonte è di 366 giorni, oggi compreso: l'ultimo è il 2027-09-25.
    config = configura(eccezioni=[aggiungi("e1", "umido", "2027-09-26")])

    assert _codici(anomalie(config, OGGI)) == ["tipologia_senza_ritiri"]


@pytest.mark.parametrize(
    ("valido", "atteso"),
    [
        ("2026-12-31", []),
        ("2026-10-25", ["calendario_in_scadenza"]),
        ("2026-09-25", ["calendario_in_scadenza"]),
        ("2026-09-24", ["calendario_scaduto"]),
    ],
)
def test_validita(valido, atteso):
    config = configura(
        regole=[regola("r1", "umido", settimanale([LUN]))], valido_fino_al=valido
    )

    assert _codici(anomalie(config, OGGI)) == atteso


def test_nessuna_anomalia_per_una_configurazione_normale():
    config = configura(
        tipologie=[tipologia("umido"), tipologia("carta")],
        regole=[
            regola("r1", "umido", settimanale([LUN, GIO])),
            regola("r2", "carta", settimanale([MAR], ogni=2, ancora="2026-09-22")),
        ],
    )

    assert anomalie(config, OGGI) == ()


def test_sovrapposizione_mista_lunga_e_veloce():
    """Una regola con anno fino al 2099 non si scorre giorno per giorno."""
    import time

    config = configura(
        regole=[
            regola("estate", "umido", settimanale([MER]), annuale("04-01", "10-31")),
            regola("inverno", "umido", settimanale([MER]), annuale("11-01", "03-31")),
            regola("sempre", "umido", settimanale([LUN])),
            regola("lungo", "umido", settimanale([SAB]), con_anno("2026-01-01", "2099-12-31")),
        ]
    )  # fmt: skip

    inizio = time.perf_counter()
    trovate = [a for a in anomalie(config, OGGI) if a.codice == "sovrapposizione_mista"]
    assert time.perf_counter() - inizio < 0.2

    per_regola = {a.regole[0]: a.intervalli for a in trovate}
    assert per_regola["sempre"] == ((OGGI, d("2099-12-31")),)
    assert per_regola["estate"][:2] == (
        (OGGI, d("2026-10-31")),
        (d("2027-04-01"), d("2027-10-31")),
    )
    assert per_regola["inverno"][0] == (OGGI.replace(month=11, day=1), d("2027-03-31"))
    assert per_regola["estate"][-1] == (d("2099-04-01"), d("2099-10-31"))


def test_giorno_inesistente_solo_se_il_periodo_ha_un_mese_corto():
    luglio_agosto = configura(
        regole=[regola("r1", "umido", mensile_data([31]), con_anno("2027-07-01", "2027-08-31"))]
    )  # fmt: skip
    tutto_l_anno = configura(regole=[regola("r1", "umido", mensile_data([29]))])

    assert "giorno_inesistente" not in _codici(anomalie(luglio_agosto, OGGI))
    assert anomalie(tutto_l_anno, OGGI)[0].giorni == (29,)
