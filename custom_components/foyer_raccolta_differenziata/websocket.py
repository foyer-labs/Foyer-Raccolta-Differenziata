"""I comandi WebSocket del pannello e delle card (SPEC §9.4).

La validazione vive qui, nel backend: il frontend la ripete solo per dare un
riscontro immediato. I comandi che leggono i ritiri sono per tutti gli utenti
(servono alle card); quelli che leggono o cambiano la configurazione solo per gli
amministratori.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import DOMINIO, OPZIONE_BARRA_LATERALE, SEGNALE_AGGIORNATO
from .coordinatore import Coordinatore
from .core import serializza
from .core.calendario import anomalie, calcola, istante_locale
from .core.modello import carica
from .core.piattaforma import giorni
from .core.promemoria import AnnullaConferma, Conferma
from .core.validazione import problemi

GIORNI_ANTEPRIMA = 60
# I giorni di orario della piattaforma che le card ricevono: la settimana mostrata
# nella finestra degli orari e la prossima apertura, oltre la settimana.
GIORNI_PIATTAFORMA = 14
MASSIMO_GIORNI = 400


def _coordinatore(hass: HomeAssistant) -> Coordinatore | None:
    for voce in hass.config_entries.async_loaded_entries(DOMINIO):
        return voce.runtime_data
    return None


def _senza_coordinatore(connection, msg) -> None:
    connection.send_error(msg["id"], "non_caricata", "Integrazione non caricata")


def sospensioni_valide(coordinatore: Coordinatore) -> list[dict[str, str]]:
    """Gli intervalli di vacanza leggibili, anche da una configurazione non valida."""
    if coordinatore.problemi:
        return []
    return [
        v
        for v in coordinatore.archivi.configurazione.get("sospensioni", [])
        if isinstance(v, dict)
        and isinstance(v.get("dal"), str)
        and isinstance(v.get("al"), str)
    ]


def _sospeso(coordinatore: Coordinatore) -> dict[str, Any]:
    """Se i promemoria tacciono ora, e fino a quando (per il banner delle card)."""
    oggi = dt_util.now().date().isoformat()
    fino = None
    for v in sospensioni_valide(coordinatore):
        if v["dal"] <= oggi <= v["al"]:
            fino = max(fino or v["al"], v["al"])
    return {
        "manuale": bool(coordinatore.archivi.stato.get("sospensione_manuale")),
        "fino_al": fino,
    }


def _tipologie(coordinatore: Coordinatore) -> list[dict[str, Any]]:
    return [
        {
            "id": t.id,
            "nome": t.nome,
            "colore": t.colore,
            "icona": t.icona,
            "note": t.note,
        }
        for t in coordinatore.tipologie
    ]


def _piattaforma(coordinatore: Coordinatore) -> dict[str, Any] | None:
    """Gli orari dei prossimi giorni come istanti: la card calcola "aperta adesso"
    da sola a ogni minuto, senza chiedere di nuovo (SPEC §10.2)."""
    config = coordinatore.config
    if config is None or config.piattaforma is None:
        return None
    fuso = coordinatore.fuso
    return {
        "nome": config.piattaforma.nome,
        "nota": config.piattaforma.nota,
        "giorni": [
            {
                "data": g.data.isoformat(),
                "fasce": None
                if g.fasce is None
                else [
                    [
                        istante_locale(g.data, inizio, fuso).isoformat(),
                        istante_locale(g.data, fine, fuso).isoformat(),
                    ]
                    for inizio, fine in g.fasce
                ],
                "motivo": g.motivo,
                "festivo": g.festivo,
                "nota": g.nota,
            }
            for g in giorni(
                config.piattaforma,
                coordinatore.oggi,
                GIORNI_PIATTAFORMA,
                config.patrono,
            )
        ],
    }


@callback
def async_registra(hass: HomeAssistant) -> None:
    for comando in (
        ws_ritiri,
        ws_iscriviti,
        ws_conferma,
        ws_annulla_conferma,
        ws_config_leggi,
        ws_config_salva,
        ws_anteprima,
        ws_ignora_anomalia,
        ws_barra_laterale,
    ):
        websocket_api.async_register_command(hass, comando)


# --- per tutti ---------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMINIO}/ritiri",
        vol.Required("dal"): str,
        vol.Required("al"): str,
    }
)
@callback
def ws_ritiri(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    """I ritiri di un intervallo, con quello che serve a disegnarli."""
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        _senza_coordinatore(connection, msg)
        return
    try:
        dal, al = date.fromisoformat(msg["dal"]), date.fromisoformat(msg["al"])
    except ValueError:
        connection.send_error(msg["id"], "data_non_valida", "Data non valida")
        return
    if al < dal or (al - dal).days > MASSIMO_GIORNI:
        connection.send_error(
            msg["id"], "intervallo_non_valido", "Intervallo non valido"
        )
        return
    risultato = coordinatore.calcola_intervallo(dal, al)
    connection.send_result(
        msg["id"],
        {
            "disponibile": risultato is not None,
            "oggi": coordinatore.oggi.isoformat(),
            "tipologie": _tipologie(coordinatore),
            "ritiri": [serializza.ritiro(r) for r in risultato.ritiri]
            if risultato
            else [],
            "conferme": [
                {
                    "data": v["data"],
                    "tipologia": v["tipologia"],
                    "istante": v.get("istante"),
                    "utente": v.get("utente"),
                }
                for v in coordinatore.archivi.stato.get("conferme", [])
            ],
            "sospeso": _sospeso(coordinatore),
            "valido_fino_al": coordinatore.archivi.configurazione.get("valido_fino_al"),
            "piattaforma": _piattaforma(coordinatore),
        },
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMINIO}/iscriviti"})
@callback
def ws_iscriviti(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    """Avvisa chi è iscritto a ogni ricalcolo: le card rileggono i ritiri."""

    @callback
    def _avvisa() -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"evento": "aggiornato"})
        )

    # Un segnale e non il coordinatore: dopo un ricaricamento dell'integrazione il
    # coordinatore è un altro, e chi era iscritto continua a ricevere gli avvisi.
    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, SEGNALE_AGGIORNATO, _avvisa
    )
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMINIO}/conferma",
        vol.Required("data"): str,
        vol.Optional("tipologie"): [str],
    }
)
@websocket_api.async_response
async def ws_conferma(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    """ "Esposto" da una card: i ritiri non confermati di quel giorno (SPEC §8.4)."""
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        _senza_coordinatore(connection, msg)
        return
    try:
        giorno = date.fromisoformat(msg["data"])
    except ValueError:
        connection.send_error(msg["id"], "data_non_valida", "Data non valida")
        return
    # Come il pulsante (SPEC §8.4): si conferma un ritiro la cui finestra non è chiusa,
    # di oggi o di domani. Non la settimana prossima, non un giorno passato.
    ora = dt_util.now()
    if not ora.date() <= giorno <= ora.date() + timedelta(days=1):
        connection.send_error(msg["id"], "non_confermabile", "Solo oggi o domani")
        return
    risultato = coordinatore.calcola_intervallo(giorno, giorno)
    volute = set(msg.get("tipologie") or [])
    ritiri = tuple(
        (r.data, r.tipologia)
        for r in (risultato.ritiri if risultato else ())
        if (not volute or r.tipologia in volute) and r.fine_esposizione > ora
    )
    confermati = 0
    if ritiri:
        utente = await coordinatore.gestore.async_utente(connection.context(msg))
        if coordinatore.gestore.decidi(Conferma(ritiri, utente)):
            confermati = len(ritiri)
    connection.send_result(msg["id"], {"confermati": confermati})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMINIO}/annulla_conferma",
        vol.Required("data"): str,
        vol.Required("tipologia"): str,
    }
)
@callback
def ws_annulla_conferma(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    """Annulla una conferma, finché la finestra è aperta (SPEC §8.4)."""
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        _senza_coordinatore(connection, msg)
        return
    try:
        giorno = date.fromisoformat(msg["data"])
    except ValueError:
        connection.send_error(msg["id"], "data_non_valida", "Data non valida")
        return
    risultato = coordinatore.calcola_intervallo(giorno, giorno)
    ritiro = next(
        (
            r
            for r in (risultato.ritiri if risultato else ())
            if r.tipologia == msg["tipologia"]
        ),
        None,
    )
    if ritiro is None or ritiro.fine_esposizione <= dt_util.now():
        connection.send_error(msg["id"], "finestra_chiusa", "Finestra chiusa")
        return
    coordinatore.gestore.decidi(AnnullaConferma(giorno, msg["tipologia"]))
    connection.send_result(msg["id"])


# --- per gli amministratori ----------------------------------------------------------


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMINIO}/config/leggi"})
@callback
def ws_config_leggi(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        _senza_coordinatore(connection, msg)
        return
    configurazione = coordinatore.archivi.configurazione
    connection.send_result(
        msg["id"],
        {
            "configurazione": configurazione,
            "revisione": configurazione.get("revisione", 0),
            "oggi": coordinatore.oggi.isoformat(),
            "problemi": [serializza.problema(p) for p in coordinatore.problemi],
            "anomalie": [serializza.anomalia(a) for a in coordinatore.anomalie],
            "festivi_ignorati": coordinatore.archivi.stato.get("anomalie_ignorate", []),
            "mostra_barra_laterale": coordinatore.entry.options.get(
                OPZIONE_BARRA_LATERALE, True
            ),
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMINIO}/config/salva",
        vol.Required("configurazione"): dict,
        vol.Required("revisione"): int,
    }
)
@websocket_api.async_response
async def ws_config_salva(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        _senza_coordinatore(connection, msg)
        return
    trovati = await coordinatore.async_salva_configurazione(
        msg["configurazione"], revisione_letta=msg["revisione"]
    )
    connection.send_result(
        msg["id"],
        {
            "salvato": not trovati,
            "problemi": [serializza.problema(p) for p in trovati],
            "revisione": coordinatore.archivi.configurazione.get("revisione", 0),
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMINIO}/anteprima",
        vol.Required("configurazione"): dict,
        vol.Optional("giorni", default=GIORNI_ANTEPRIMA): vol.All(
            int, vol.Range(min=1, max=MASSIMO_GIORNI)
        ),
    }
)
@callback
def ws_anteprima(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    """Il calcolo di una configurazione non salvata e cosa cambia (decisione 36)."""
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        _senza_coordinatore(connection, msg)
        return
    candidata = msg["configurazione"]
    trovati = problemi(candidata)
    if trovati:
        connection.send_result(
            msg["id"],
            {
                "problemi": [serializza.problema(p) for p in trovati],
                "ritiri": [],
                "differenze": {"aggiunti": [], "tolti": []},
                "anomalie": [],
            },
        )
        return
    config = carica(candidata)
    oggi = coordinatore.oggi
    al = oggi + timedelta(days=msg["giorni"] - 1)
    dopo = calcola(config, oggi, al, coordinatore.fuso, coordinatore.festivi_ignorati)
    prima = coordinatore.calcola_intervallo(oggi, al)
    confronto = dopo
    if msg["giorni"] > GIORNI_ANTEPRIMA:
        # Le differenze si mostrano sempre sui prossimi 60 giorni (decisione 36).
        fine = oggi + timedelta(days=GIORNI_ANTEPRIMA - 1)
        confronto = calcola(config, oggi, fine, coordinatore.fuso)
        prima = coordinatore.calcola_intervallo(oggi, fine)
    connection.send_result(
        msg["id"],
        {
            "problemi": [],
            "ritiri": [serializza.ritiro(r) for r in dopo.ritiri],
            "differenze": serializza.differenze(prima, confronto),
            "anomalie": [serializza.anomalia(a) for a in anomalie(config, oggi)],
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMINIO}/anomalie/ignora",
        vol.Required("data"): str,
        vol.Required("tipologia"): str,
        vol.Optional("ignora", default=True): bool,
    }
)
@websocket_api.async_response
async def ws_ignora_anomalia(
    hass: HomeAssistant, connection, msg: dict[str, Any]
) -> None:
    """ "Ignora" sull'avviso di un ritiro festivo, o il suo annullamento (SPEC §4.4)."""
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        _senza_coordinatore(connection, msg)
        return
    try:
        date.fromisoformat(msg["data"])
    except ValueError:
        connection.send_error(msg["id"], "data_non_valida", "Data non valida")
        return
    voce = {"data": msg["data"], "tipologia": msg["tipologia"]}
    ignorate = [
        v
        for v in coordinatore.archivi.stato.get("anomalie_ignorate", [])
        if not (
            v.get("data") == voce["data"] and v.get("tipologia") == voce["tipologia"]
        )
    ]
    if msg["ignora"]:
        ignorate.append(voce)
    coordinatore.archivi.stato["anomalie_ignorate"] = ignorate
    await coordinatore.async_salva_stato()
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMINIO}/barra_laterale",
        vol.Required("mostra"): bool,
    }
)
@callback
def ws_barra_laterale(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    """ "Mostra nella barra laterale" dal pannello: stessa opzione del Configura."""
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        _senza_coordinatore(connection, msg)
        return
    entry = coordinatore.entry
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, OPZIONE_BARRA_LATERALE: msg["mostra"]}
    )
    connection.send_result(msg["id"])
