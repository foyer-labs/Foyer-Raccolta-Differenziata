"""Serve il frontend e registra il pannello (SPEC §10.1, §10.1.1).

Il pannello si registra con o senza titolo nella barra laterale, secondo
l'opzione "Mostra nella barra laterale". Nascosto, resta registrato: si apre dal
suo indirizzo e dal collegamento nella pagina del dispositivo. Cambiare l'opzione
aggiorna la registrazione senza toglierla, così chi sta usando il pannello resta
dov'è.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import testi
from .const import (
    DOMINIO,
    ELEMENTO_PANNELLO,
    ICONA_PANNELLO,
    MODULO_CARD,
    MODULO_PANNELLO,
    OPZIONE_BARRA_LATERALE,
    URL_PANNELLO,
    URL_STATICO,
)

CARTELLA_FRONTEND = Path(__file__).parent / "frontend"
_VERSIONI = f"{DOMINIO}_versioni_frontend"


def _impronte() -> dict[str, str]:
    """Impronte del contenuto: una versione nuova non resta nascosta dalla cache."""
    return {
        nome: hashlib.sha256((CARTELLA_FRONTEND / nome).read_bytes()).hexdigest()[:12]
        for nome in (MODULO_PANNELLO, MODULO_CARD)
        if (CARTELLA_FRONTEND / nome).exists()
    }


def mostra_nella_barra(entry: ConfigEntry) -> bool:
    return bool(entry.options.get(OPZIONE_BARRA_LATERALE, True))


async def async_registra(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Percorsi statici e card una volta per avvio, pannello a ogni chiamata."""
    if (versioni := hass.data.get(_VERSIONI)) is None:
        versioni = await hass.async_add_executor_job(_impronte)
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_STATICO, str(CARTELLA_FRONTEND), cache_headers=True)]
        )
        # Le card si caricano su ogni pagina, in qualunque modalità delle
        # dashboard, senza toccare le risorse Lovelace (decisione 46).
        if MODULO_CARD in versioni:
            frontend.add_extra_js_url(
                hass, f"{URL_STATICO}/{MODULO_CARD}?v={versioni[MODULO_CARD]}"
            )
        hass.data[_VERSIONI] = versioni

    mostra = mostra_nella_barra(entry)
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=testi.TITOLO_PANNELLO,
        sidebar_icon=ICONA_PANNELLO,
        show_in_sidebar=mostra,
        frontend_url_path=URL_PANNELLO,
        config={
            "_panel_custom": {
                "name": ELEMENTO_PANNELLO,
                "embed_iframe": False,
                "trust_external": False,
                "module_url": (
                    f"{URL_STATICO}/{MODULO_PANNELLO}"
                    f"?v={versioni.get(MODULO_PANNELLO, '0')}"
                ),
            }
        },
        require_admin=True,
        update=URL_PANNELLO in hass.data.get("frontend_panels", {}),
    )


def async_rimuovi(hass: HomeAssistant) -> None:
    """Toglie il pannello quando l'integrazione viene rimossa."""
    frontend.async_remove_panel(hass, URL_PANNELLO, warn_if_unknown=False)
