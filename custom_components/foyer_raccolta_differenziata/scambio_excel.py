"""Scaricare e importare la configurazione in Excel dal pannello (decisione 59).

* Scaricare è una richiesta HTTP, non un comando WebSocket: il pannello firma
  l'indirizzo con `auth/sign_path` e lo apre, e così il file si salva anche
  dall'app Companion, dove un download costruito nel browser non funziona.
* Importare è un comando WebSocket con il file in base64. Non salva nulla:
  restituisce la configurazione candidata, che il pannello fa passare dalla
  finestra "Prima di salvare" come ogni altra modifica (decisione 36).

Entrambi solo per gli amministratori, come il resto della configurazione.
"""

from __future__ import annotations

import base64
import binascii
from functools import partial
from http import HTTPStatus
from typing import Any
import uuid

from aiohttp import web
from homeassistant.components import websocket_api
from homeassistant.components.http import KEY_HASS_USER
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from homeassistant.helpers.http import KEY_HASS, HomeAssistantView
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util
import voluptuous as vol

from . import excel, testi
from .const import DOMINIO
from .coordinatore import Coordinatore
from .core import tabelle as tb

URL_EXCEL = f"/api/{DOMINIO}/excel"
TIPO_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
# Il file in base64 è un terzo più lungo del file.
MASSIMO_BASE64 = excel.MASSIMO_BYTE * 4 // 3 + 4
# Servizi del dominio notify che non sono destinatari (come nel pannello).
NON_DESTINATARI = {"send_message", "persistent_notification", "notify"}


def _coordinatore(hass: HomeAssistant) -> Coordinatore | None:
    for voce in hass.config_entries.async_loaded_entries(DOMINIO):
        return voce.runtime_data
    return None


def destinatari(hass: HomeAssistant) -> list[tuple[str, str]]:
    """I destinatari di questa casa, scritti come nel file, con un nome leggibile."""
    servizi = sorted(
        (nome, nome.removeprefix("mobile_app_").replace("_", " ").capitalize())
        for nome in hass.services.async_services_for_domain("notify")
        if nome not in NON_DESTINATARI
    )
    entita = sorted(
        (stato.entity_id, stato.name) for stato in hass.states.async_all("notify")
    )
    return servizi + entita


def destinatari_noti(hass: HomeAssistant) -> frozenset[tuple[str, str]]:
    return frozenset(
        {
            ("servizio", nome)
            for nome in hass.services.async_services_for_domain("notify")
            if nome not in NON_DESTINATARI
        }
        | {("entita", stato.entity_id) for stato in hass.states.async_all("notify")}
    )


class VistaExcel(HomeAssistantView):
    """GET: il file della configurazione; `?modello=1`: il modello vuoto."""

    url = URL_EXCEL
    name = f"api:{DOMINIO}:excel"
    requires_auth = True

    async def get(self, request: web.Request) -> web.Response:
        hass = request.app[KEY_HASS]
        if not request[KEY_HASS_USER].is_admin:
            raise Unauthorized
        coordinatore = _coordinatore(hass)
        if coordinatore is None:
            return web.Response(status=HTTPStatus.SERVICE_UNAVAILABLE)
        modello = request.query.get("modello") == "1"
        if not modello and coordinatore.problemi:
            # Una configurazione non valida non si scrive in tabelle: le celle
            # direbbero cose che il calendario non fa.
            return web.Response(status=HTTPStatus.CONFLICT)
        righe = (
            tb.modello()
            if modello
            else tb.in_tabelle(coordinatore.archivi.configurazione)
        )
        integrazione = await async_get_integration(hass, DOMINIO)
        ora = dt_util.now()
        contenuto = await hass.async_add_executor_job(
            partial(
                excel.crea,
                righe,
                destinatari=destinatari(hass),
                creato=testi.excel_creato(ora, str(integrazione.version)),
            )
        )
        nome = testi.excel_nome_file(modello, ora.date())
        return web.Response(
            body=contenuto,
            content_type=TIPO_XLSX,
            headers={
                "Content-Disposition": f'attachment; filename="{nome}"',
                "Cache-Control": "no-store",
            },
        )


def _errore(codice: str) -> dict[str, Any]:
    return {"foglio": "", "riga": None, "colonna": None, "codice": codice}


def _leggi_e_converti(
    contenuto: bytes,
    attuale: dict[str, Any],
    modo: tb.Modo,
    oggi: Any,
    noti: frozenset[tuple[str, str]],
) -> dict[str, Any]:
    """Nell'executor: aprire il file e convertirlo sono lavoro da CPU."""
    try:
        fogli = excel.leggi(contenuto)
    except excel.FileNonValido as errore:
        return {"errori": [_errore(errore.codice)], "configurazione": None}
    if not fogli:
        return {"errori": [_errore("nessun_foglio")], "configurazione": None}
    esito = tb.da_tabelle(
        fogli,
        attuale,
        modo,
        genera_id=lambda: uuid.uuid4().hex,
        oggi=oggi,
        destinatari_noti=noti,
    )
    return {
        "errori": [
            {
                "foglio": e.foglio,
                "riga": e.riga,
                "colonna": e.colonna,
                "codice": e.codice,
            }
            for e in esito.errori
        ],
        "configurazione": esito.configurazione,
        "riepilogo": esito.riepilogo,
    }


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMINIO}/excel/importa",
        vol.Required("contenuto"): str,
        vol.Required("modo"): vol.In(["sostituisci", "aggiungi"]),
    }
)
@websocket_api.async_response
async def ws_importa(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    """La configurazione candidata da un file, o i suoi errori. Non salva."""
    coordinatore = _coordinatore(hass)
    if coordinatore is None:
        connection.send_error(msg["id"], "non_caricata", "Integrazione non caricata")
        return
    if len(msg["contenuto"]) > MASSIMO_BASE64:
        connection.send_result(
            msg["id"],
            {"errori": [_errore("file_troppo_grande")], "configurazione": None},
        )
        return
    try:
        contenuto = base64.b64decode(msg["contenuto"], validate=True)
    except (binascii.Error, ValueError):
        connection.send_result(
            msg["id"], {"errori": [_errore("file_non_valido")], "configurazione": None}
        )
        return
    risultato = await hass.async_add_executor_job(
        _leggi_e_converti,
        contenuto,
        coordinatore.archivi.configurazione,
        msg["modo"],
        coordinatore.oggi,
        destinatari_noti(hass),
    )
    connection.send_result(msg["id"], risultato)


def async_registra(hass: HomeAssistant) -> None:
    hass.http.register_view(VistaExcel())
    websocket_api.async_register_command(hass, ws_importa)
