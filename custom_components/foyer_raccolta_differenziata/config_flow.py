"""Config flow: le tipologie di partenza e la finestra di esposizione (SPEC §9.1).

Tutto il resto si configura dal pannello.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers.selector import (
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TimeSelector,
)
import voluptuous as vol

from .const import (
    CONF_FINE_ORA,
    CONF_INIZIO_GIORNO,
    CONF_INIZIO_ORA,
    CONF_TIPOLOGIE,
    DOMINIO,
)
from .core.configurazione import (
    FINESTRA_PREDEFINITA,
    INIZI_POSSIBILI,
    errore_finestra,
)
from .core.preset import CHIAVI_PRESET


def _hh_mm(valore: str) -> str:
    """Il selettore dell'ora restituisce "HH:MM:SS"; l'archivio tiene "HH:MM"."""
    return valore[:5]


def _schema(predefiniti: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(
                CONF_TIPOLOGIE, default=predefiniti[CONF_TIPOLOGIE]
            ): SelectSelector(
                SelectSelectorConfig(
                    options=list(CHIAVI_PRESET),
                    multiple=True,
                    mode=SelectSelectorMode.LIST,
                    translation_key="tipologie",
                )
            ),
            vol.Required(
                CONF_INIZIO_GIORNO, default=predefiniti[CONF_INIZIO_GIORNO]
            ): SelectSelector(
                SelectSelectorConfig(
                    options=list(INIZI_POSSIBILI),
                    mode=SelectSelectorMode.DROPDOWN,
                    translation_key="inizio_giorno",
                )
            ),
            vol.Required(
                CONF_INIZIO_ORA, default=predefiniti[CONF_INIZIO_ORA]
            ): TimeSelector(),
            vol.Required(
                CONF_FINE_ORA, default=predefiniti[CONF_FINE_ORA]
            ): TimeSelector(),
        }
    )


class RaccoltaConfigFlow(ConfigFlow, domain=DOMINIO):
    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errori: dict[str, str] = {}
        predefiniti: dict[str, Any] = {
            CONF_TIPOLOGIE: list(CHIAVI_PRESET),
            CONF_INIZIO_GIORNO: FINESTRA_PREDEFINITA["inizio_giorno"],
            CONF_INIZIO_ORA: FINESTRA_PREDEFINITA["inizio_ora"],
            CONF_FINE_ORA: FINESTRA_PREDEFINITA["fine_ora"],
        }
        if user_input is not None:
            dati = {
                CONF_TIPOLOGIE: list(user_input.get(CONF_TIPOLOGIE, [])),
                CONF_INIZIO_GIORNO: user_input[CONF_INIZIO_GIORNO],
                CONF_INIZIO_ORA: _hh_mm(user_input[CONF_INIZIO_ORA]),
                CONF_FINE_ORA: _hh_mm(user_input[CONF_FINE_ORA]),
            }
            errore = errore_finestra(
                dati[CONF_INIZIO_GIORNO], dati[CONF_INIZIO_ORA], dati[CONF_FINE_ORA]
            )
            if errore is None:
                # Il titolo della voce non passa dalle traduzioni: Home Assistant
                # non lo prevede. È l'unico testo visibile scritto nel codice.
                return self.async_create_entry(
                    title="Raccolta differenziata", data=dati
                )
            errori["base"] = errore
            predefiniti = dati
        return self.async_show_form(
            step_id="user", data_schema=_schema(predefiniti), errors=errori
        )
