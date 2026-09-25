"""I promemoria (SPEC §8): pianificazione, recupero, conferme, solleciti."""

from __future__ import annotations

from datetime import date, datetime, timedelta

import pytest

from custom_components.foyer_raccolta_differenziata.core.calendario import calcola
from custom_components.foyer_raccolta_differenziata.core.configurazione import (
    stato_vuoto,
)
from custom_components.foyer_raccolta_differenziata.core.promemoria import (
    AnnullaConferma,
    Conferma,
    Rinvio,
    Sospensione,
    carica_promemoria,
    da_confermare_col_pulsante,
    decidi,
    previsti,
)

from .aiuti import ROMA, configura, d, regola, settimanale, tipologia

LUN, MAR, MER, GIO, VEN, SAB, DOM = range(7)
TELEFONO = {"tipo": "servizio", "id": "mobile_app_luca"}
TELEGRAM = {"tipo": "servizio", "id": "telegram_famiglia"}


def profilo(id_="sera", quando=None, tipologie=None, destinatari=None, attivo=True):
    return {
        "id": id_,
        "nome": id_,
        "attivo": attivo,
        "quando": quando or {"tipo": "giorni_prima", "giorni": 1, "ora": "20:30"},
        "tipologie": tipologie,
        "destinatari": destinatari or [TELEFONO],
    }


def dati(profili=None, solleciti=None, sospensioni=None):
    return {
        "promemoria": profili if profili is not None else [profilo()],
        "solleciti": solleciti or {"attivi": False, "richiami": 1, "richiamo_dopo": 30},
        "sospensioni": sospensioni or [],
    }


def risultato(regole=None, tipologie=None):
    """Umido il giovedì, carta il venerdì; finestra dalle 20 del giorno prima alle 6."""
    config = configura(
        tipologie=tipologie or [tipologia("umido"), tipologia("carta")],
        regole=regole
        or [
            regola("r1", "umido", settimanale([GIO])),
            regola("r2", "carta", settimanale([VEN])),
        ],
    )
    return calcola(config, d("2026-09-20"), d("2026-10-10"), ROMA)


def a(testo: str) -> datetime:
    return datetime.fromisoformat(testo).replace(tzinfo=ROMA)


def stato(ultimo: str | None = None, **altro):
    s = stato_vuoto()
    s["ultimo_istante_attivo"] = a(ultimo).isoformat() if ultimo else None
    s.update(altro)
    return s


def esegui(config_dati, stato_, ora, evento=None, ris=None):
    return decidi(
        carica_promemoria(config_dati),
        ris or risultato(),
        stato_,
        evento,
        a(ora),
        fuso=ROMA,
    )


# --- pianificazione ------------------------------------------------------------------


def test_un_invio_per_profilo_data_e_istante():
    config = carica_promemoria(dati())
    ris = risultato(
        regole=[
            regola("r1", "umido", settimanale([GIO])),
            regola("r2", "carta", settimanale([GIO])),
        ]
    )

    elenco = [
        p for p in previsti(config, ris.ritiri, ROMA) if p.data == d("2026-09-24")
    ]

    assert len(elenco) == 1
    assert [r.tipologia for r in elenco[0].ritiri] == ["umido", "carta"]
    assert elenco[0].istante == a("2026-09-23T20:30")


def test_all_apertura_separa_finestre_diverse():
    vetro = tipologia(
        "vetro",
        esposizione={
            "inizio_giorno": "giorno_stesso",
            "inizio_ora": "05:00",
            "fine_ora": "12:00",
        },
    )
    ris = risultato(
        tipologie=[tipologia("umido"), vetro],
        regole=[
            regola("r1", "umido", settimanale([GIO])),
            regola("r2", "vetro", settimanale([GIO])),
        ],
    )
    config = carica_promemoria(dati([profilo(quando={"tipo": "apertura"})]))

    elenco = [
        p for p in previsti(config, ris.ritiri, ROMA) if p.data == d("2026-09-24")
    ]

    assert [(p.istante, [r.tipologia for r in p.ritiri]) for p in elenco] == [
        (a("2026-09-23T20:00"), ["umido"]),
        (a("2026-09-24T05:00"), ["vetro"]),
    ]


def test_profilo_per_alcune_tipologie_e_profilo_spento():
    config = carica_promemoria(
        dati(
            [
                profilo("solo_carta", tipologie=["carta"]),
                profilo("spento", attivo=False),
            ]
        )
    )

    elenco = previsti(config, risultato().ritiri, ROMA)

    assert {p.profilo.id for p in elenco} == {"solo_carta"}
    assert {r.tipologia for p in elenco for r in p.ritiri} == {"carta"}


# --- invio ---------------------------------------------------------------------------


def test_prima_dell_istante_nessun_invio_e_timer_all_istante():
    decisione = esegui(dati(), stato("2026-09-23T20:28"), "2026-09-23T20:29")

    assert decisione.invii == ()
    assert decisione.prossimo == a("2026-09-23T20:30")


def test_all_istante_parte_una_volta_sola():
    decisione = esegui(dati(), stato("2026-09-23T20:29"), "2026-09-23T20:30")

    (invio,) = decisione.invii
    assert invio.tipologie == ("umido",)
    assert invio.testo == "stasera"
    assert invio.destinatari[0].con_azioni
    assert decisione.prossimo == a("2026-09-24T20:30")

    di_nuovo = esegui(dati(), decisione.stato, "2026-09-23T20:31")
    assert di_nuovo.invii == ()


@pytest.mark.parametrize(
    ("quando", "ora", "testo"),
    [
        (
            {"tipo": "giorni_prima", "giorni": 1, "ora": "12:00"},
            "2026-09-23T12:00",
            "domani",
        ),
        (
            {"tipo": "giorni_prima", "giorni": 2, "ora": "19:00"},
            "2026-09-22T19:00",
            "giorno",
        ),
        ({"tipo": "giorno_stesso", "ora": "05:30"}, "2026-09-24T05:30", "oggi"),
    ],
)
def test_il_tipo_di_testo_segue_la_distanza(quando, ora, testo):
    ultimo = (a(ora) - timedelta(minutes=1)).strftime("%Y-%m-%dT%H:%M")
    decisione = esegui(dati([profilo(quando=quando)]), stato(ultimo), ora)

    assert decisione.invii[0].testo == testo


def test_un_ritiro_confermato_non_riceve_promemoria():
    s = stato(
        "2026-09-23T20:29", conferme=[{"data": "2026-09-24", "tipologia": "umido"}]
    )

    decisione = esegui(dati(), s, "2026-09-23T20:30")

    assert decisione.invii == ()
    assert [x.motivo for x in decisione.scartati] == ["confermato"]


def test_prima_esecuzione_non_recupera_nulla():
    """Un'installazione nuova non manda i promemoria di prima."""
    decisione = esegui(dati(), stato(None), "2026-09-23T21:00")

    assert decisione.invii == ()


# --- riavvio (SPEC §8.6, decisione 10) -----------------------------------------------


def test_recupero_se_la_finestra_e_aperta():
    decisione = esegui(dati(), stato("2026-09-23T18:00"), "2026-09-23T22:00")

    assert [i.tipologie for i in decisione.invii] == [("umido",)]


def test_scarto_se_la_finestra_e_chiusa():
    decisione = esegui(dati(), stato("2026-09-23T18:00"), "2026-09-24T07:00")

    assert decisione.invii == ()
    assert [x.motivo for x in decisione.scartati] == ["finestra_chiusa"]
    # E non riparte più: è registrato come fatto.
    dopo = esegui(dati(), decisione.stato, "2026-09-24T07:01")
    assert dopo.scartati == ()


# --- sospensione (decisione 30) ------------------------------------------------------


def test_interruttore_di_sospensione():
    s = stato("2026-09-23T20:29", sospensione_manuale=True)

    decisione = esegui(dati(), s, "2026-09-23T20:30")

    assert decisione.invii == ()
    assert [x.motivo for x in decisione.scartati] == ["sospeso"]


def test_la_vacanza_conta_sull_istante_dell_invio():
    """Promemoria prima di partire per un ritiro durante la vacanza: parte."""
    vacanza = [{"dal": "2026-09-24", "al": "2026-09-30"}]

    prima = esegui(
        dati(sospensioni=vacanza), stato("2026-09-23T20:29"), "2026-09-23T20:30"
    )
    durante = esegui(
        dati(sospensioni=vacanza), stato("2026-09-24T20:29"), "2026-09-24T20:30"
    )

    assert len(prima.invii) == 1
    assert durante.invii == ()


def test_evento_sospensione():
    decisione = esegui(
        dati(), stato("2026-09-23T12:00"), "2026-09-23T12:01", Sospensione(True)
    )

    assert decisione.stato["sospensione_manuale"] is True


# --- solleciti (SPEC §4.9, §8.5) -----------------------------------------------------

SOLLECITI = {"attivi": True, "richiami": 2, "richiamo_dopo": 30}


def test_solleciti_spenti_niente_richiami():
    decisione = esegui(dati(), stato("2026-09-23T20:29"), "2026-09-23T20:30")

    assert decisione.stato["pendenti"] == []
    assert not decisione.invii[0].azioni_rinvio


def test_richiami_fino_al_massimo():
    config = dati(solleciti=SOLLECITI)
    primo = esegui(config, stato("2026-09-23T20:29"), "2026-09-23T20:30")
    assert primo.invii[0].azioni_rinvio
    assert primo.prossimo == a("2026-09-23T21:00")

    secondo = esegui(config, primo.stato, "2026-09-23T21:00")
    assert [(i.testo, i.numero) for i in secondo.invii] == [("sollecito", 1)]
    assert secondo.prossimo == a("2026-09-23T21:30")

    terzo = esegui(config, secondo.stato, "2026-09-23T21:30")
    assert [(i.testo, i.numero) for i in terzo.invii] == [("sollecito", 2)]
    assert terzo.stato["pendenti"] == []


def test_una_conferma_ferma_i_richiami():
    config = dati(solleciti=SOLLECITI)
    primo = esegui(config, stato("2026-09-23T20:29"), "2026-09-23T20:30")
    confermato = esegui(
        config,
        primo.stato,
        "2026-09-23T20:40",
        Conferma(((d("2026-09-24"), "umido"),), "Anna"),
    )
    assert confermato.stato["conferme"][0]["utente"] == "Anna"

    dopo = esegui(config, confermato.stato, "2026-09-23T21:00")

    assert dopo.invii == ()
    assert dopo.stato["pendenti"] == []


def test_niente_richiami_prima_della_finestra():
    """Decisione 33: il promemoria di due giorni prima non si sollecita."""
    config = dati(
        [profilo(quando={"tipo": "giorni_prima", "giorni": 2, "ora": "19:00"})],
        solleciti=SOLLECITI,
    )

    decisione = esegui(config, stato("2026-09-22T18:59"), "2026-09-22T19:00")

    assert len(decisione.invii) == 1
    assert decisione.stato["pendenti"] == []


def test_spegnere_i_solleciti_cancella_i_pendenti():
    primo = esegui(
        dati(solleciti=SOLLECITI), stato("2026-09-23T20:29"), "2026-09-23T20:30"
    )

    dopo = esegui(dati(), primo.stato, "2026-09-23T20:35")

    assert dopo.stato["pendenti"] == []


def test_richiamo_a_finestra_chiusa_scartato():
    config = dati(
        [profilo(quando={"tipo": "giorno_stesso", "ora": "03:00"})],
        solleciti={"attivi": True, "richiami": 2, "richiamo_dopo": 240},
    )
    primo = esegui(config, stato("2026-09-24T02:59"), "2026-09-24T03:00")
    assert len(primo.invii) == 1
    assert primo.prossimo == a("2026-09-24T07:00")

    dopo = esegui(config, primo.stato, "2026-09-24T07:00")

    assert dopo.invii == ()
    assert [x.motivo for x in dopo.scartati] == ["finestra_chiusa"]


def test_rinvio_solo_a_chi_l_ha_chiesto():
    config = dati(
        [
            profilo(
                destinatari=[TELEFONO, {"tipo": "servizio", "id": "mobile_app_anna"}]
            )
        ],
        solleciti=SOLLECITI,
    )
    primo = esegui(config, stato("2026-09-23T20:29"), "2026-09-23T20:30")
    gettone = primo.invii[0].gettone

    rinviato = esegui(
        config,
        primo.stato,
        "2026-09-23T20:40",
        Rinvio(gettone, "servizio:mobile_app_anna"),
    )
    assert rinviato.prossimo == a("2026-09-23T21:00")

    alle_21_10 = esegui(config, rinviato.stato, "2026-09-23T21:10")
    rinvii = [i for i in alle_21_10.invii if i.rinvio]
    assert [[x.id for x in i.destinatari] for i in rinvii] == [["mobile_app_anna"]]


def test_rinvio_ignorato_con_solleciti_spenti():
    primo = esegui(dati(), stato("2026-09-23T20:29"), "2026-09-23T20:30")

    dopo = esegui(
        dati(),
        primo.stato,
        "2026-09-23T20:40",
        Rinvio(primo.invii[0].gettone, "servizio:mobile_app_luca"),
    )

    assert dopo.stato["pendenti"] == []


# --- conferme ------------------------------------------------------------------------


def test_annulla_conferma():
    s = stato(
        "2026-09-23T20:00", conferme=[{"data": "2026-09-24", "tipologia": "umido"}]
    )

    decisione = esegui(
        dati(), s, "2026-09-23T20:01", AnnullaConferma(d("2026-09-24"), "umido")
    )

    assert decisione.stato["conferme"] == []


def test_le_conferme_vecchie_si_cancellano():
    s = stato(
        "2026-09-23T20:00",
        conferme=[
            {"data": "2026-09-10", "tipologia": "umido"},
            {"data": "2026-09-17", "tipologia": "umido"},
        ],
    )

    decisione = esegui(dati(), s, "2026-09-23T20:01")

    assert [c["data"] for c in decisione.stato["conferme"]] == ["2026-09-17"]


@pytest.mark.parametrize(
    ("ora", "atteso"),
    [
        # Finestra aperta: l'umido di domani.
        ("2026-09-23T21:00", [("2026-09-24", "umido")]),
        # Finestra non ancora aperta, ritiro domani: si conferma lo stesso (decisione 32).
        ("2026-09-23T19:00", [("2026-09-24", "umido")]),
        # Prossimo ritiro dopodomani: niente.
        ("2026-09-22T19:00", []),
        # Giovedì dopo le 6: finestra dell'umido chiusa, la carta è domani.
        ("2026-09-24T07:00", [("2026-09-25", "carta")]),
    ],
)
def test_pulsante_esposto(ora, atteso):
    ritiri = da_confermare_col_pulsante(risultato(), a(ora), set())

    assert [(r.data.isoformat(), r.tipologia) for r in ritiri] == atteso


def test_pulsante_esposto_salta_i_confermati():
    ritiri = da_confermare_col_pulsante(
        risultato(), a("2026-09-23T21:00"), {(date(2026, 9, 24), "umido")}
    )

    assert ritiri == ()
