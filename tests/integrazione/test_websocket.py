"""I comandi WebSocket del pannello e delle card (SPEC §9.4).

Qui l'orologio non si congela: il token del client di prova nasce con l'ora vera, e
spostare l'orologio lo renderebbe non valido. Le date sono fisse o relative.
"""

from __future__ import annotations

from datetime import date

from custom_components.foyer_raccolta_differenziata.const import DOMINIO

from .conftest import configurazione, installa


async def _invia(client, **messaggio):
    await client.send_json_auto_id(messaggio)
    return await client.receive_json()


async def test_ritiri_per_le_card(hass, hass_storage, hass_ws_client):
    await installa(hass, hass_storage)
    client = await hass_ws_client(hass)

    risposta = await _invia(
        client, type=f"{DOMINIO}/ritiri", dal="2026-09-24", al="2026-09-25"
    )

    assert risposta["success"]
    dati = risposta["result"]
    assert [(r["data"], r["tipologia"]) for r in dati["ritiri"]] == [
        ("2026-09-24", "umido"),
        ("2026-09-25", "carta"),
    ]
    assert dati["ritiri"][0]["fine_esposizione"] == "2026-09-24T06:00:00+02:00"
    assert [t["nome"] for t in dati["tipologie"]] == ["Umido", "Carta"]


async def test_ritiri_rifiuta_intervalli_sbagliati(hass, hass_storage, hass_ws_client):
    await installa(hass, hass_storage)
    client = await hass_ws_client(hass)

    rovescio = await _invia(
        client, type=f"{DOMINIO}/ritiri", dal="2026-09-25", al="2026-09-24"
    )
    troppo = await _invia(
        client, type=f"{DOMINIO}/ritiri", dal="2026-01-01", al="2028-01-01"
    )
    rotto = await _invia(client, type=f"{DOMINIO}/ritiri", dal="ieri", al="oggi")

    assert rovescio["error"]["code"] == "intervallo_non_valido"
    assert troppo["error"]["code"] == "intervallo_non_valido"
    assert rotto["error"]["code"] == "data_non_valida"


async def test_leggere_la_configurazione_e_da_amministratori(
    hass, hass_storage, hass_ws_client, hass_admin_user
):
    await installa(hass, hass_storage)
    client = await hass_ws_client(hass)

    letta = await _invia(client, type=f"{DOMINIO}/config/leggi")
    assert letta["result"]["revisione"] == 3
    assert letta["result"]["mostra_barra_laterale"] is True

    hass_admin_user.groups = []
    for tipo in ("config/leggi", "anomalie/ignora", "barra_laterale"):
        rifiutata = await _invia(
            client,
            type=f"{DOMINIO}/{tipo}",
            **(
                {"data": "2026-12-25", "tipologia": "carta"}
                if tipo == "anomalie/ignora"
                else {"mostra": False}
                if tipo == "barra_laterale"
                else {}
            ),
        )
        assert rifiutata["error"]["code"] == "unauthorized", tipo
    # I ritiri restano leggibili: servono alle card di tutti.
    ritiri = await _invia(
        client, type=f"{DOMINIO}/ritiri", dal="2026-09-24", al="2026-09-24"
    )
    assert ritiri["success"]


async def test_anteprima_mostra_cosa_cambia(hass, hass_storage, hass_ws_client):
    voce = await installa(hass, hass_storage)
    client = await hass_ws_client(hass)
    candidata = {**voce.runtime_data.archivi.configurazione}
    candidata["regole"] = [
        {
            **candidata["regole"][0],
            "ricorrenza": {**candidata["regole"][0]["ricorrenza"], "giorni": [0]},
        },
        candidata["regole"][1],
    ]

    risposta = await _invia(
        client, type=f"{DOMINIO}/anteprima", configurazione=candidata
    )

    differenze = risposta["result"]["differenze"]
    # Umido dal giovedì al lunedì: nei prossimi 60 giorni si aggiungono lunedì e si
    # tolgono giovedì, e nient'altro.
    assert {
        date.fromisoformat(v["data"]).weekday() for v in differenze["aggiunti"]
    } == {0}
    assert {date.fromisoformat(v["data"]).weekday() for v in differenze["tolti"]} == {3}
    assert {v["tipologia"] for v in differenze["aggiunti"] + differenze["tolti"]} == {
        "umido"
    }
    assert 8 <= len(differenze["aggiunti"]) <= 9
    # L'anteprima non salva nulla.
    assert voce.runtime_data.archivi.configurazione["revisione"] == 3


async def test_anteprima_di_una_configurazione_non_valida(
    hass, hass_storage, hass_ws_client
):
    voce = await installa(hass, hass_storage)
    client = await hass_ws_client(hass)
    candidata = {**voce.runtime_data.archivi.configurazione}
    candidata["tipologie"] = [
        {**candidata["tipologie"][0], "colore": "rosso"},
        candidata["tipologie"][1],
    ]

    risposta = await _invia(
        client, type=f"{DOMINIO}/anteprima", configurazione=candidata
    )

    assert risposta["result"]["problemi"] == [
        {"percorso": "tipologie[0].colore", "codice": "colore_non_valido"}
    ]
    assert risposta["result"]["ritiri"] == []


async def test_anteprima_lunga_per_le_date_di_una_regola(
    hass, hass_storage, hass_ws_client
):
    voce = await installa(hass, hass_storage)
    client = await hass_ws_client(hass)

    risposta = await _invia(
        client,
        type=f"{DOMINIO}/anteprima",
        configurazione=voce.runtime_data.archivi.configurazione,
        giorni=366,
    )

    ultimo = date.fromisoformat(risposta["result"]["ritiri"][-1]["data"])
    assert (ultimo - date.today()).days >= 358
    assert risposta["result"]["differenze"] == {"aggiunti": [], "tolti": []}


async def test_salvare_con_la_revisione_giusta_e_sbagliata(
    hass, hass_storage, hass_ws_client
):
    voce = await installa(hass, hass_storage)
    client = await hass_ws_client(hass)
    nuova = {**voce.runtime_data.archivi.configurazione, "valido_fino_al": "2027-06-30"}

    salvata = await _invia(
        client, type=f"{DOMINIO}/config/salva", configurazione=nuova, revisione=3
    )
    vecchia = await _invia(
        client, type=f"{DOMINIO}/config/salva", configurazione=nuova, revisione=3
    )

    assert salvata["result"] == {"salvato": True, "problemi": [], "revisione": 4}
    assert vecchia["result"]["salvato"] is False
    assert vecchia["result"]["problemi"][0]["codice"] == "revisione_superata"
    assert (
        hass_storage["foyer_raccolta_differenziata.configurazione"]["data"][
            "valido_fino_al"
        ]
        == "2027-06-30"
    )


async def test_ignorare_un_festivo_e_ripristinarlo(hass, hass_storage, hass_ws_client):
    voce = await installa(hass, hass_storage)
    client = await hass_ws_client(hass)

    await _invia(
        client, type=f"{DOMINIO}/anomalie/ignora", data="2026-12-25", tipologia="carta"
    )
    await hass.async_block_till_done()
    assert voce.runtime_data.archivi.stato["anomalie_ignorate"] == [
        {"data": "2026-12-25", "tipologia": "carta"}
    ]
    assert voce.runtime_data.festivi_ignorati == frozenset(
        {(date(2026, 12, 25), "carta")}
    )

    await _invia(
        client,
        type=f"{DOMINIO}/anomalie/ignora",
        data="2026-12-25",
        tipologia="carta",
        ignora=False,
    )
    await hass.async_block_till_done()
    assert voce.runtime_data.festivi_ignorati == frozenset()


async def test_iscrizione_avvisa_a_ogni_ricalcolo(hass, hass_storage, hass_ws_client):
    voce = await installa(hass, hass_storage)
    client = await hass_ws_client(hass)

    iscritto = await _invia(client, type=f"{DOMINIO}/iscriviti")
    assert iscritto["success"]
    voce.runtime_data.aggiorna()

    evento = await client.receive_json()
    assert evento["event"] == {"evento": "aggiornato"}


async def test_ritiri_dicono_se_i_promemoria_sono_sospesi(
    hass, hass_storage, hass_ws_client
):
    oggi = date.today()
    config = configurazione(sospensioni=[{"dal": oggi.isoformat(), "al": "2099-12-31"}])
    await installa(hass, hass_storage, config)
    client = await hass_ws_client(hass)

    risposta = await _invia(
        client, type=f"{DOMINIO}/ritiri", dal=oggi.isoformat(), al=oggi.isoformat()
    )

    assert risposta["result"]["sospeso"] == {"manuale": False, "fino_al": "2099-12-31"}


async def test_l_iscrizione_sopravvive_a_un_ricaricamento(
    hass, hass_storage, hass_ws_client
):
    voce = await installa(hass, hass_storage)
    client = await hass_ws_client(hass)
    assert (await _invia(client, type=f"{DOMINIO}/iscriviti"))["success"]

    await hass.config_entries.async_reload(voce.entry_id)
    await hass.async_block_till_done()
    while True:  # gli avvisi del ricaricamento stesso
        evento = await client.receive_json()
        if evento.get("event") == {"evento": "aggiornato"}:
            break
    voce.runtime_data.aggiorna()

    assert (await client.receive_json())["event"] == {"evento": "aggiornato"}


async def test_due_salvataggi_insieme_uno_solo_passa(hass, hass_storage):
    import asyncio

    voce = await installa(hass, hass_storage)
    coordinatore = voce.runtime_data
    base = coordinatore.archivi.configurazione

    esiti = await asyncio.gather(
        coordinatore.async_salva_configurazione(
            {**base, "valido_fino_al": "2027-01-01"}, 3
        ),
        coordinatore.async_salva_configurazione(
            {**base, "valido_fino_al": "2027-02-01"}, 3
        ),
    )

    assert sorted(len(e) for e in esiti) == [0, 1]
    assert coordinatore.archivi.configurazione["revisione"] == 4


async def test_eliminare_una_tipologia_pulisce_lo_stato(hass, hass_storage):
    voce = await installa(
        hass,
        hass_storage,
        stato={
            "conferme": [{"data": "2026-12-24", "tipologia": "carta"}],
            "invii_fatti": [],
            "pendenti": [],
            "anomalie_ignorate": [{"data": "2026-12-25", "tipologia": "carta"}],
            "sospensione_manuale": False,
            "ultimo_istante_attivo": None,
        },
    )
    coordinatore = voce.runtime_data
    nuova = {**coordinatore.archivi.configurazione}
    nuova["tipologie"] = [nuova["tipologie"][0]]
    nuova["regole"] = [nuova["regole"][0]]

    assert await coordinatore.async_salva_configurazione(nuova) == []

    assert coordinatore.archivi.stato["conferme"] == []
    assert coordinatore.archivi.stato["anomalie_ignorate"] == []


async def test_sospensioni_rovinate_non_rompono_ne_card_ne_interruttore(
    hass, hass_storage, hass_ws_client
):
    config = configurazione(sospensioni=[{}, "x"])
    await installa(hass, hass_storage, config)
    client = await hass_ws_client(hass)

    oggi = date.today().isoformat()
    risposta = await _invia(client, type=f"{DOMINIO}/ritiri", dal=oggi, al=oggi)

    assert risposta["result"]["disponibile"] is False
    assert risposta["result"]["sospeso"] == {"manuale": False, "fino_al": None}
    interruttore = hass.states.get("switch.raccolta_differenziata_sospendi_promemoria")
    assert interruttore.attributes["intervalli"] == []
