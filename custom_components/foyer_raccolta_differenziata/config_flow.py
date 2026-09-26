"""Config flow: le tipologie di partenza e la finestra di esposizione (SPEC §9.1).

Tutto il resto si configura dal pannello.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    BooleanSelector,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TimeSelector,
)
import voluptuous as vol

from . import testi
from .const import (
    CONF_FINE_ORA,
    CONF_INIZIO_GIORNO,
    CONF_INIZIO_ORA,
    CONF_TIPOLOGIE,
    DOMINIO,
    OPZIONE_BARRA_LATERALE,
)
from .core.configurazione import (
    FINESTRA_PREDEFINITA,
    INIZI_POSSIBILI,
    errore_finestra,
)
from .core.preset import CHIAVI_PREDEFINITE, CHIAVI_PRESET


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

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return RaccoltaOpzioni()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errori: dict[str, str] = {}
        predefiniti: dict[str, Any] = {
            CONF_TIPOLOGIE: list(CHIAVI_PREDEFINITE),
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
                # non lo prevede, quindi sta in testi.py (decisione 43).
                return self.async_create_entry(title=testi.TITOLO_VOCE, data=dati)
            errori["base"] = errore
            predefiniti = dati
        return self.async_show_form(
            step_id="user", data_schema=_schema(predefiniti), errors=errori
        )


class RaccoltaOpzioni(OptionsFlow):
    """Il Configura: solo "Mostra nella barra laterale" (SPEC §9.1, §10.1.1).

    Sta qui, oltre che nel pannello, perché un pannello nascosto si possa rimettere
    nella barra senza doverlo prima trovare.
    """

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                data={
                    **self.config_entry.options,
                    OPZIONE_BARRA_LATERALE: user_input[OPZIONE_BARRA_LATERALE],
                }
            )
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        OPZIONE_BARRA_LATERALE,
                        default=self.config_entry.options.get(
                            OPZIONE_BARRA_LATERALE, True
                        ),
                    ): BooleanSelector()
                }
            ),
        )
