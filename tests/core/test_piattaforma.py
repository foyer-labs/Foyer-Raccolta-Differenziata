"""La piattaforma ecologica: orari, stato, avvisi, validazione (SPEC §4.10)."""

from __future__ import annotations

from datetime import date, datetime, time

import pytest

from custom_components.foyer_raccolta_differenziata.core.calendario import anomalie
from custom_components.foyer_raccolta_differenziata.core.modello import (
    Patrono,
    carica,
    carica_piattaforma,
)
from custom_components.foyer_raccolta_differenziata.core.piattaforma import (
    anomalie_piattaforma,
    giorni,
    giorno,
    prossimo_cambio,
    stato,
)
from custom_components.foyer_raccolta_differenziata.core.validazione import problemi

from .aiuti import ROMA, grezza

MATTINA = [["08:00", "12:00"]]
DUE_FASCE = [["08:00", "12:00"], ["14:00", "18:00"]]


def settimana(**giorni_fasce) -> list[list[list[str]]]:
    """Lun=0 … Dom=6; i giorni non indicati sono chiusi."""
    nomi = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"]
    return [giorni_fasce.get(n, []) for n in nomi]


def dati(periodi=None, eccezioni=None, **altro):
    return {
        "nome": "Piattaforma ecologica",
        "nota": "Via Roma 1",
        "periodi": periodi
        if periodi is not None
        else [
            {
                "id": "inverno",
                "dal": "2026-01-01",
                "al": "2026-05-31",
                "settimana": settimana(
                    lun=DUE_FASCE, mer=[["14:00", "18:00"]], sab=MATTINA
                ),
            },
            {
                "id": "estate",
                "dal": "2026-06-01",
                "al": "2026-12-31",
                "settimana": settimana(lun=MATTINA, sab=MATTINA),
            },
        ],
        "eccezioni": eccezioni or [],
        **altro,
    }


def p(**kw):
    return carica_piattaforma(dati(**kw))


def istante(testo: str) -> datetime:
    return datetime.fromisoformat(testo).replace(tzinfo=ROMA)


# --- il giorno ------------------------------------------------------------------------


def test_il_periodo_da_le_fasce_del_giorno_della_settimana():
    g = giorno(p(), date(2026, 3, 2), None)  # lunedì, inverno
    assert g.motivo == "periodo"
    assert g.fasce == ((time(8), time(12)), (time(14), time(18)))
    assert giorno(p(), date(2026, 3, 3), None).fasce == ()  # martedì: chiusa
    assert giorno(p(), date(2026, 6, 1), None).fasce == ((time(8), time(12)),)


def test_nei_festivi_e_chiusa():
    g = giorno(p(), date(2026, 12, 8), None)  # martedì, Immacolata
    assert (g.fasce, g.motivo, g.festivo) == ((), "festivo", "Immacolata Concezione")
    patrono = Patrono(12, 7, "Sant'Ambrogio")
    assert giorno(p(), date(2026, 12, 7), patrono).fasce == ()  # lunedì del patrono


def test_un_eccezione_vince_su_festivi_e_periodi():
    piattaforma = p(
        eccezioni=[
            {
                "id": "e1",
                "data": "2026-12-08",
                "tipo": "aperta",
                "fasce": MATTINA,
                "nota": "Aperta per l'Immacolata",
            },
            {"id": "e2", "data": "2026-03-02", "tipo": "chiusa", "nota": "Inventario"},
        ]
    )
    aperta = giorno(piattaforma, date(2026, 12, 8), None)
    assert (aperta.fasce, aperta.motivo, aperta.nota) == (
        ((time(8), time(12)),),
        "eccezione",
        "Aperta per l'Immacolata",
    )
    assert giorno(piattaforma, date(2026, 3, 2), None).fasce == ()


def test_fuori_dai_periodi_l_orario_non_e_indicato():
    g = giorno(p(), date(2027, 1, 4), None)
    assert (g.fasce, g.motivo) == (None, None)


def test_i_giorni_di_seguito():
    elenco = giorni(p(), date(2026, 12, 7), 3, None)
    assert [g.data.day for g in elenco] == [7, 8, 9]


# --- lo stato ---------------------------------------------------------------------------


def test_aperta_adesso_fino_alla_fine_della_fascia():
    s = stato(p(), istante("2026-03-02T09:30"), ROMA, None)
    assert s.aperta is True and s.chiude == istante("2026-03-02T12:00")


def test_chiusa_tra_due_fasce_riapre_il_pomeriggio():
    s = stato(p(), istante("2026-03-02T12:00"), ROMA, None)
    assert s.aperta is False and s.apre == istante("2026-03-02T14:00")


def test_chiusa_riapre_nei_giorni_dopo_saltando_i_festivi():
    # Lunedì 7/12 alle 13 (estate: solo mattina), martedì 8 festivo, sabato 12 apre.
    s = stato(p(), istante("2026-12-07T13:00"), ROMA, None)
    assert s.aperta is False and s.apre == istante("2026-12-12T08:00")


def test_oggi_senza_orario_e_sconosciuto():
    assert stato(p(), istante("2027-01-04T09:00"), ROMA, None).aperta is None


def test_la_prossima_apertura_non_va_oltre_un_giorno_senza_orario():
    # Giovedì 31/12 dopo la mezzanotte… il 2027 non è indicato: nessuna riapertura nota.
    s = stato(p(), istante("2026-12-31T10:00"), ROMA, None)
    assert s.aperta is False and s.apre is None


def test_il_cambio_all_ora_legale_non_sposta_le_fasce():
    piattaforma = p(
        periodi=[
            {
                "id": "x",
                "dal": "2026-01-01",
                "al": "2026-12-31",
                "settimana": settimana(dom=[["02:30", "04:00"]]),
            }
        ]
    )
    # 29 marzo 2026: le 02:30 non esistono, la fascia parte alle 03:00.
    s = stato(piattaforma, istante("2026-03-29T01:00"), ROMA, None)
    assert s.apre.isoformat() == "2026-03-29T03:00:00+02:00"


def test_il_prossimo_cambio():
    assert prossimo_cambio(p(), istante("2026-03-02T09:30"), ROMA, None) == istante(
        "2026-03-02T12:00"
    )
    assert prossimo_cambio(p(), istante("2026-03-02T19:00"), ROMA, None) == istante(
        "2026-03-03T00:00"
    )


# --- gli avvisi -------------------------------------------------------------------------


def test_avviso_trenta_giorni_prima_della_fine():
    assert anomalie_piattaforma(p(), date(2026, 11, 30)) == ()
    (a,) = anomalie_piattaforma(p(), date(2026, 12, 1))
    assert (a.codice, a.data) == ("piattaforma_in_scadenza", date(2026, 12, 31))


def test_periodi_contigui_contano_come_uno():
    # Il 20 maggio l'inverno finisce il 31, ma l'estate continua: nessun avviso.
    assert anomalie_piattaforma(p(), date(2026, 5, 20)) == ()


def test_avviso_se_oggi_non_ha_orario():
    (a,) = anomalie_piattaforma(p(), date(2027, 1, 2))
    assert (a.codice, a.data) == ("piattaforma_senza_orario", None)
    piattaforma = p(
        periodi=[
            {
                "id": "x",
                "dal": "2026-06-01",
                "al": "2026-12-31",
                "settimana": settimana(),
            }
        ]
    )
    (b,) = anomalie_piattaforma(piattaforma, date(2026, 5, 1))
    assert b.data == date(2026, 6, 1)


def test_le_anomalie_della_configurazione_comprendono_la_piattaforma():
    config = carica(grezza(piattaforma=dati()))
    assert "piattaforma_senza_orario" in {
        a.codice for a in anomalie(config, date(2027, 2, 1))
    }


def test_senza_piattaforma_niente():
    assert carica(grezza()).piattaforma is None
    assert anomalie_piattaforma(None, date(2026, 1, 1)) == ()


# --- validazione ------------------------------------------------------------------------


def _codici(piattaforma) -> set[tuple[str, str]]:
    return {(x.percorso, x.codice) for x in problemi(grezza(piattaforma=piattaforma))}


def test_una_piattaforma_valida():
    assert _codici(dati()) == set()
    assert _codici(None) == set()


@pytest.mark.parametrize(
    ("modifica", "atteso"),
    [
        ({"nome": ""}, ("piattaforma.nome", "nome_non_valido")),
        ({"periodi": []}, ("piattaforma.periodi", "periodi_non_validi")),
        (
            {
                "periodi": [
                    {
                        "id": f"p{i}",
                        "dal": f"202{i}-01-01",
                        "al": f"202{i}-12-31",
                        "settimana": settimana(),
                    }
                    for i in range(5)
                ]
            },
            ("piattaforma.periodi", "periodi_non_validi"),
        ),
        (
            {
                "periodi": [
                    {
                        "id": "a",
                        "dal": "2026-01-01",
                        "al": "2026-06-30",
                        "settimana": settimana(),
                    },
                    {
                        "id": "b",
                        "dal": "2026-06-30",
                        "al": "2026-12-31",
                        "settimana": settimana(),
                    },
                ]
            },
            ("piattaforma.periodi[1]", "periodi_sovrapposti"),
        ),
        (
            {
                "periodi": [
                    {
                        "id": "a",
                        "dal": "2026-06-01",
                        "al": "2026-01-01",
                        "settimana": settimana(),
                    }
                ]
            },
            ("piattaforma.periodi[0]", "fine_prima_di_inizio"),
        ),
        (
            {
                "periodi": [
                    {
                        "id": "a",
                        "dal": "2026-01-01",
                        "al": "2026-12-31",
                        "settimana": settimana(lun=[["12:00", "08:00"]]),
                    }
                ]
            },
            ("piattaforma.periodi[0].settimana[0]", "fascia_non_valida"),
        ),
        (
            {
                "periodi": [
                    {
                        "id": "a",
                        "dal": "2026-01-01",
                        "al": "2026-12-31",
                        "settimana": settimana(
                            lun=[["08:00", "12:00"], ["11:00", "13:00"]]
                        ),
                    }
                ]
            },
            ("piattaforma.periodi[0].settimana[0]", "fasce_sovrapposte"),
        ),
        (
            {
                "periodi": [
                    {
                        "id": "a",
                        "dal": "2026-01-01",
                        "al": "2026-12-31",
                        "settimana": settimana(
                            lun=[
                                ["08:00", "09:00"],
                                ["10:00", "11:00"],
                                ["12:00", "13:00"],
                                ["14:00", "15:00"],
                            ]
                        ),
                    }
                ]
            },
            ("piattaforma.periodi[0].settimana[0]", "fasce_non_valide"),
        ),
        (
            {
                "periodi": [
                    {
                        "id": "a",
                        "dal": "2026-01-01",
                        "al": "2026-12-31",
                        "settimana": settimana()[:6],
                    }
                ]
            },
            ("piattaforma.periodi[0].settimana", "orari_non_validi"),
        ),
        (
            {
                "eccezioni": [
                    {"id": "e1", "data": "2026-12-08", "tipo": "aperta", "fasce": []}
                ]
            },
            ("piattaforma.eccezioni[0].fasce", "fasce_non_valide"),
        ),
        (
            {
                "eccezioni": [
                    {"id": "e1", "data": "2026-12-08", "tipo": "chiusa"},
                    {"id": "e2", "data": "2026-12-08", "tipo": "chiusa"},
                ]
            },
            ("piattaforma.eccezioni[1]", "giorno_duplicato"),
        ),
        (
            {"eccezioni": [{"id": "e1", "data": "2026-12-08", "tipo": "forse"}]},
            ("piattaforma.eccezioni[0].tipo", "eccezione_non_valida"),
        ),
    ],
)
def test_i_problemi_della_piattaforma(modifica, atteso):
    assert atteso in _codici(dati() | modifica)


# --- revisione (0.5.1) ------------------------------------------------------------------


def test_un_festivo_fuori_dai_periodi_non_e_indicato():
    # Periodo fino al 20/12: il 25 non è "chiusa" (decisione 69), come il 24 e il 27.
    piattaforma = p(
        periodi=[
            {
                "id": "x",
                "dal": "2026-01-01",
                "al": "2026-12-20",
                "settimana": settimana(ven=MATTINA),
            }
        ]
    )
    assert [g.fasce for g in giorni(piattaforma, date(2026, 12, 24), 4, None)] == [
        None
    ] * 4
    assert giorno(piattaforma, date(2026, 12, 8), None).motivo == "festivo"


def test_le_fasce_che_si_toccano_sono_un_apertura_sola():
    piattaforma = p(
        periodi=[
            {
                "id": "x",
                "dal": "2026-01-01",
                "al": "2026-12-31",
                "settimana": settimana(lun=[["12:00", "14:00"], ["08:00", "12:00"]]),
            }
        ]
    )
    s = stato(piattaforma, istante("2026-03-02T11:00"), ROMA, None)
    assert s.aperta is True and s.chiude == istante("2026-03-02T14:00")
    # E in ordine anche se inserite al contrario.
    assert giorno(piattaforma, date(2026, 3, 2), None).fasce[0] == (time(8), time(12))


def test_una_fascia_svuotata_dall_ora_legale_non_apre():
    piattaforma = p(
        periodi=[
            {
                "id": "x",
                "dal": "2026-01-01",
                "al": "2026-12-31",
                "settimana": settimana(dom=[["02:00", "02:30"], ["10:00", "11:00"]]),
            }
        ]
    )
    s = stato(piattaforma, istante("2026-03-29T01:00"), ROMA, None)
    assert s.apre == istante("2026-03-29T10:00")


def test_nessun_avviso_se_oggi_ha_un_eccezione_aperta():
    piattaforma = p(
        periodi=[
            {
                "id": "x",
                "dal": "2027-01-01",
                "al": "2027-12-31",
                "settimana": settimana(),
            }
        ],
        eccezioni=[
            {"id": "e", "data": "2026-12-24", "tipo": "aperta", "fasce": MATTINA}
        ],
    )
    assert anomalie_piattaforma(piattaforma, date(2026, 12, 24)) == ()
