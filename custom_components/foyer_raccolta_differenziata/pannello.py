"""Serve il frontend e registra il pannello (SPEC §9.1, §10.1, §10.1.1).

Le card arrivano alla pagina da due canali (decisione 73). L'app Companion si apre
su "/?external_auth=1" e il service worker di Home Assistant le dà la copia di
index.html salvata quando si è installato, anche vecchia di settimane: un modulo che
arriva solo dall'index (`add_extra_js_url`) all'avvio a freddo può mancare, e la card
mostra "Errore di configurazione". Le risorse Lovelace invece viaggiano sul websocket
e sono sempre attuali. Risorsa e index portano allo stesso modulo della card, che il
browser esegue una volta sola:

- URL_LOADER, sotto /api/, è stabile e il service worker non lo tiene mai in cache:
  importa il modulo della card con l'impronta del contenuto nel percorso. È la
  risorsa Lovelace.
- URL_STATICO/<impronta>/<file>: a un indirizzo corrisponde sempre lo stesso
  contenuto, che può restare in cache per sempre. Anche il pannello si apre da qui,
  con il suo modulo.
- LOADER_INDEX è il canale dell'index: fuori da /api/, il service worker lo tiene in
  cache. Prova il loader fresco e, se non risponde, ripiega sul modulo.
- Gli indirizzi delle versioni precedenti ("raccolta-card.js?v=…", impronte
  superate) rimandano al modulo attuale, mai un errore: gli index salvati dai
  telefoni li contengono ancora. Fino alla 0.6.1 quegli indirizzi si tenevano in
  cache 31 giorni: una copia già sul telefono vale fino ad allora.

Il pannello si registra con o senza titolo nella barra laterale, secondo l'opzione
"Mostra nella barra laterale". Nascosto, resta registrato: si apre dal suo indirizzo
e dal collegamento nella pagina del dispositivo. Cambiare l'opzione aggiorna la
registrazione senza toglierla, così chi sta usando il pannello resta dov'è.
"""

from __future__ import annotations

import asyncio
import hashlib
import logging
from pathlib import Path
from typing import Any

from aiohttp import web
from homeassistant.components import frontend
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_CALL_SERVICE
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.http import HomeAssistantView

from . import testi
from .const import (
    DOMINIO,
    ELEMENTO_PANNELLO,
    ICONA_PANNELLO,
    MODULO_CARD,
    MODULO_PANNELLO,
    OPZIONE_BARRA_LATERALE,
    URL_LOADER,
    URL_PANNELLO,
    URL_STATICO,
)

_LOGGER = logging.getLogger(__name__)

CARTELLA_FRONTEND = Path(__file__).parent / "frontend"
LOADER_INDEX = f"{URL_STATICO}/loader.js"
_FRONTEND = f"{DOMINIO}_frontend"
_BLOCCO = f"{DOMINIO}_frontend_blocco"
_JS = "text/javascript"
_MAI_IN_CACHE = {"Cache-Control": "no-cache"}
# Compresso secondo il browser: una cache intermedia deve tenere le due versioni.
_PER_SEMPRE = {
    "Cache-Control": "public, max-age=31536000, immutable",
    "Vary": "Accept-Encoding",
}
# Dopo "Ricarica risorse" si guarda per mezzo minuto, spesso: la pagina si ricarica
# subito, senza aspettare che il servizio finisca.
_SORVEGLIANZA = 30.0
_PASSO = 0.1

type Moduli = dict[str, tuple[str, bytes]]


def _leggi_moduli() -> Moduli:
    """Impronta e contenuto dei due moduli, letti una volta per avvio.

    Si servono questi byte e non il file: a un indirizzo con l'impronta corrisponde
    sempre lo stesso contenuto, anche se un aggiornamento sostituisce il file prima
    del riavvio. E il JavaScript resta quello del codice Python in esecuzione.
    """
    moduli: Moduli = {}
    for nome in (MODULO_CARD, MODULO_PANNELLO):
        contenuto = (CARTELLA_FRONTEND / nome).read_bytes()
        moduli[nome] = (hashlib.sha256(contenuto).hexdigest()[:12], contenuto)
    return moduli


def _url(moduli: Moduli, nome: str) -> str:
    return f"{URL_STATICO}/{moduli[nome][0]}/{nome}"


class _Loader(HomeAssistantView):
    """La risorsa Lovelace: indirizzo stabile, mai in cache, porta alla card."""

    url = URL_LOADER
    name = f"api:{DOMINIO}:loader"
    requires_auth = False  # solo il JavaScript della card, come i file statici

    def __init__(self, moduli: Moduli) -> None:
        self._moduli = moduli

    async def get(self, request: web.Request) -> web.Response:
        etag = f'"{self._moduli[MODULO_CARD][0]}"'
        intestazioni = {**_MAI_IN_CACHE, "ETag": etag}
        if request.headers.get("If-None-Match") == etag:
            return web.Response(status=304, headers=intestazioni)
        return web.Response(
            text=f'import "{_url(self._moduli, MODULO_CARD)}";\n',
            content_type=_JS,
            headers=intestazioni,
        )


class _Statici(HomeAssistantView):
    """I moduli con l'impronta, il loader dell'index e gli indirizzi di prima."""

    url = URL_STATICO + "/{coda:.+}"
    name = f"{DOMINIO}:statici"
    requires_auth = False

    def __init__(self, moduli: Moduli) -> None:
        self._moduli = moduli

    async def get(self, request: web.Request, coda: str) -> web.Response:
        cartella, _, nome = coda.rpartition("/")
        if nome in self._moduli:
            impronta, contenuto = self._moduli[nome]
            if cartella == impronta:
                risposta = web.Response(
                    body=contenuto,
                    content_type=_JS,
                    charset="utf-8",
                    headers=_PER_SEMPRE,
                )
                risposta.enable_compression()
                return risposta
            # Un'impronta superata, o l'indirizzo senza impronta delle versioni
            # fino alla 0.6.1: il modulo attuale.
            testo = f'import "{_url(self._moduli, nome)}";\n'
        elif coda == "loader.js":
            testo = (
                f'import("{URL_LOADER}")'
                # Home Assistant non risponde ancora: il modulo, dalla cache.
                f'.catch(() => import("{_url(self._moduli, MODULO_CARD)}"))'
                # Un rifiuto lasciato senza gestione, su Safari, può far credere a
                # Home Assistant che la pagina sia rotta.
                '.catch((errore) => console.error("Raccolta: card non caricate",'
                " errore));\n"
            )
        else:
            raise web.HTTPNotFound
        return web.Response(text=testo, content_type=_JS, headers=_MAI_IN_CACHE)


def _risorse(hass: HomeAssistant) -> Any:
    """Le risorse Lovelace, in archivio o in YAML; None se non ci sono."""
    return getattr(hass.data.get("lovelace"), "resources", None)


def _e_loader(url: object) -> bool:
    return str(url or "").split("?")[0] == URL_LOADER


async def _async_assicura_risorsa(hass: HomeAssistant) -> None:
    """Il loader tra le risorse Lovelace, una volta sola. Non ferma mai l'avvio."""
    risorse = _risorse(hass)
    try:
        if hasattr(risorse, "async_create_item"):  # risorse in archivio
            await risorse.async_get_info()  # le carica dal disco
            nostre = [
                voce
                for voce in risorse.async_items()
                if _e_loader(voce.get("url"))
                or str(voce.get("url") or "").startswith(URL_STATICO + "/")
            ]
            tieni = next((v for v in nostre if v.get("url") == URL_LOADER), None)
            # Doppioni, e le voci aggiunte a mano per le versioni di prima.
            for voce in nostre:
                if voce is not tieni:
                    await risorse.async_delete_item(voce["id"])
            if tieni is None:
                await risorse.async_create_item(
                    {"res_type": "module", "url": URL_LOADER}
                )
        elif isinstance(getattr(risorse, "data", None), list):  # risorse in YAML
            # Home Assistant le tratta in sola lettura, ma sono una lista: la voce
            # vive in memoria, non tocca configuration.yaml e si rimette dopo
            # "Ricarica risorse".
            if not any(
                isinstance(voce, dict) and _e_loader(voce.get("url"))
                for voce in risorse.data
            ):
                risorse.data.append({"type": "module", "url": URL_LOADER})
        else:
            _LOGGER.warning(
                "Risorse Lovelace non trovate: le card arrivano solo dall'index"
            )
    except Exception:
        _LOGGER.exception("Risorsa Lovelace delle card non registrata")


@callback
def _e_ricarica_risorse(dati: Any) -> bool:
    return (
        dati.get("domain") == "lovelace" and dati.get("service") == "reload_resources"
    )


async def _async_sorveglia(hass: HomeAssistant, dati: dict, viste: Any) -> None:
    """«Ricarica risorse» ricrea le risorse dal YAML, senza la voce, dopo l'evento; e
    una seconda ricarica può arrivare prima che la prima finisca. Finché dura la
    sorveglianza, a ogni cambio si rimette la voce. Si ferma se l'integrazione viene
    tolta."""
    while hass.loop.time() < dati["sorveglia_fino"] and "ascolto" in dati:
        await asyncio.sleep(_PASSO)
        if (adesso := _risorse(hass)) is not viste:
            viste = adesso
            async with hass.data[_BLOCCO]:
                if "ascolto" in dati:
                    await _async_assicura_risorsa(hass)
    dati.pop("sorveglianza", None)


async def async_registra_frontend(hass: HomeAssistant) -> None:
    """Moduli, loader e risorsa: in testa al setup, prima di leggere gli archivi.

    Così la card arriva alla pagina anche quando la voce non parte, e dice che il
    calendario non è disponibile invece di "Errore di configurazione". Si può
    chiamare di nuovo: le viste si registrano una volta per avvio, il resto si
    rimette se l'integrazione era stata tolta.
    """
    async with hass.data.setdefault(_BLOCCO, asyncio.Lock()):
        dati = hass.data.get(_FRONTEND)
        if dati is None:
            try:
                moduli = await hass.async_add_executor_job(_leggi_moduli)
            except OSError:
                # Un'installazione incompleta non ferma calendario e promemoria.
                _LOGGER.exception(
                    "File del frontend illeggibili: niente card e pannello"
                )
                return
            dati = hass.data[_FRONTEND] = {"moduli": moduli}
            hass.http.register_view(_Loader(moduli))
            hass.http.register_view(_Statici(moduli))
        if not dati.get("index"):
            frontend.add_extra_js_url(hass, LOADER_INDEX)
            dati["index"] = True
        await _async_assicura_risorsa(hass)
        if "ascolto" not in dati:

            @callback
            def _ricaricate(_evento: Event) -> None:
                dati["sorveglia_fino"] = hass.loop.time() + _SORVEGLIANZA
                if "sorveglianza" not in dati:
                    dati["sorveglianza"] = hass.async_create_background_task(
                        _async_sorveglia(hass, dati, _risorse(hass)),
                        f"{DOMINIO}: risorsa Lovelace dopo la ricarica",
                    )

            dati["ascolto"] = hass.bus.async_listen(
                EVENT_CALL_SERVICE, _ricaricate, event_filter=_e_ricarica_risorse
            )


def mostra_nella_barra(entry: ConfigEntry) -> bool:
    return bool(entry.options.get(OPZIONE_BARRA_LATERALE, True))


async def async_registra(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Registra o aggiorna il pannello, senza mai toglierlo."""
    if (dati := hass.data.get(_FRONTEND)) is None:
        return  # file del frontend illeggibili: è già nel registro
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=testi.TITOLO_PANNELLO,
        sidebar_icon=ICONA_PANNELLO,
        show_in_sidebar=mostra_nella_barra(entry),
        frontend_url_path=URL_PANNELLO,
        config={
            "_panel_custom": {
                "name": ELEMENTO_PANNELLO,
                "embed_iframe": False,
                "trust_external": False,
                # Arriva dal websocket, sempre attuale come la risorsa.
                "module_url": _url(dati["moduli"], MODULO_PANNELLO),
            }
        },
        require_admin=True,
        update=URL_PANNELLO in hass.data.get(frontend.DATA_PANELS, {}),
    )


async def async_rimuovi(hass: HomeAssistant) -> None:
    """L'integrazione rimossa: via il pannello, il modulo dall'index, la risorsa e
    l'ascolto. Le viste restano fino al riavvio: aiohttp non le toglie."""
    frontend.async_remove_panel(hass, URL_PANNELLO, warn_if_unknown=False)
    dati = hass.data.get(_FRONTEND) or {}
    if dati.pop("index", False):
        frontend.remove_extra_js_url(hass, LOADER_INDEX)
    if ascolto := dati.pop("ascolto", None):
        ascolto()
    risorse = _risorse(hass)
    try:
        if hasattr(risorse, "async_create_item"):
            await risorse.async_get_info()
            for voce in list(risorse.async_items()):
                if _e_loader(voce.get("url")):
                    await risorse.async_delete_item(voce["id"])
        elif isinstance(getattr(risorse, "data", None), list):
            risorse.data[:] = [
                voce
                for voce in risorse.data
                if not (isinstance(voce, dict) and _e_loader(voce.get("url")))
            ]
    except Exception:
        _LOGGER.exception("Risorsa Lovelace delle card non tolta")
