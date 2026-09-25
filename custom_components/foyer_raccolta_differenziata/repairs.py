"""I problemi in Riparazioni (SPEC §9.3) e il flusso che rinnova la validità.

Tre problemi:

* configurazione non valida (INV-2), che non si corregge da qui ma dal pannello;
* calendario in scadenza o scaduto (decisione 14), che si corregge indicando la
  nuova data di validità dopo aver controllato il calendario del comune;
* ritiri in giorni festivi nei prossimi 30 giorni, non gestiti (decisione 34).
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant import data_entry_flow
from homeassistant.components.repairs import RepairsFlow
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.selector import DateSelector
import voluptuous as vol

from .const import DOMINIO
from .core.viste import festivi_da_gestire

if TYPE_CHECKING:
    from .coordinatore import Coordinatore

PROBLEMA_CONFIGURAZIONE = "configurazione_non_valida"
PROBLEMA_CALCOLO = "calcolo_non_riuscito"
PROBLEMA_IN_SCADENZA = "calendario_in_scadenza"
PROBLEMA_SCADUTO = "calendario_scaduto"
PROBLEMA_FESTIVI = "ritiri_festivi"
GIORNI_FESTIVI = 30


def _gg_mm_aaaa(giorno: date) -> str:
    return giorno.strftime("%d/%m/%Y")


def _imposta(
    hass: HomeAssistant,
    chiave: str,
    presente: bool,
    *,
    gravita: ir.IssueSeverity = ir.IssueSeverity.WARNING,
    correggibile: bool = False,
    segnaposti: dict[str, str] | None = None,
) -> None:
    if not presente:
        ir.async_delete_issue(hass, DOMINIO, chiave)
        return
    ir.async_create_issue(
        hass,
        DOMINIO,
        chiave,
        is_fixable=correggibile,
        is_persistent=False,
        severity=gravita,
        translation_key=chiave,
        translation_placeholders=segnaposti,
    )


@callback
def aggiorna_problemi(hass: HomeAssistant, coordinatore: Coordinatore) -> None:
    """Allinea i problemi in Riparazioni allo stato del coordinatore."""
    _imposta(
        hass,
        PROBLEMA_CONFIGURAZIONE,
        bool(coordinatore.problemi),
        gravita=ir.IssueSeverity.ERROR,
        segnaposti={
            "problemi": ", ".join(
                f"{p.percorso}: {p.codice}" for p in coordinatore.problemi
            )
        },
    )
    _imposta(
        hass,
        PROBLEMA_CALCOLO,
        coordinatore.config is not None and coordinatore.risultato is None,
        gravita=ir.IssueSeverity.ERROR,
    )

    codici = {a.codice: a for a in coordinatore.anomalie}
    for chiave in (PROBLEMA_IN_SCADENZA, PROBLEMA_SCADUTO):
        anomalia = codici.get(chiave)
        _imposta(
            hass,
            chiave,
            anomalia is not None,
            correggibile=True,
            segnaposti=(
                {"data": _gg_mm_aaaa(anomalia.data)}
                if anomalia is not None and anomalia.data
                else None
            ),
        )

    festivi = ()
    if coordinatore.risultato is not None:
        oggi = coordinatore.oggi
        festivi = festivi_da_gestire(
            coordinatore.risultato, oggi, oggi + timedelta(days=GIORNI_FESTIVI - 1)
        )
    elenco = []
    for ritiro in festivi:
        tipologia = coordinatore.tipologia(ritiro.tipologia)
        nome = tipologia.nome if tipologia else ritiro.tipologia
        elenco.append(f"{_gg_mm_aaaa(ritiro.data)} {nome} ({ritiro.festivo})")
    _imposta(
        hass,
        PROBLEMA_FESTIVI,
        bool(festivi),
        segnaposti={"ritiri": "; ".join(elenco), "numero": str(len(elenco))},
    )


class RinnovaValidita(RepairsFlow):
    """Nuova data di validità dopo aver controllato il calendario del comune."""

    def __init__(self, coordinatore: Coordinatore) -> None:
        self._coordinatore = coordinatore

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        return await self.async_step_conferma()

    async def async_step_conferma(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        errori: dict[str, str] = {}
        oggi = self._coordinatore.oggi
        attuale = self._coordinatore.archivi.configurazione.get("valido_fino_al")
        base = max(date.fromisoformat(attuale), oggi) if attuale else oggi
        predefinita = (
            base.replace(year=base.year + 1)
            if not (base.month == 2 and base.day == 29)
            else date(base.year + 1, 2, 28)
        )
        if user_input is not None:
            nuova = date.fromisoformat(user_input["valido_fino_al"])
            if nuova <= oggi:
                errori["valido_fino_al"] = "data_nel_passato"
            else:
                configurazione = {
                    **self._coordinatore.archivi.configurazione,
                    "valido_fino_al": nuova.isoformat(),
                }
                trovati = await self._coordinatore.async_salva_configurazione(
                    configurazione
                )
                if not trovati:
                    return self.async_create_entry(data={})
                errori["base"] = "salvataggio_non_riuscito"
        return self.async_show_form(
            step_id="conferma",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        "valido_fino_al", default=predefinita.isoformat()
                    ): DateSelector()
                }
            ),
            errors=errori,
            description_placeholders={
                "data": _gg_mm_aaaa(date.fromisoformat(attuale)) if attuale else "-"
            },
        )


async def async_create_fix_flow(
    hass: HomeAssistant, issue_id: str, data: dict[str, Any] | None
) -> RepairsFlow:
    voci = hass.config_entries.async_entries(DOMINIO)
    coordinatore = voci[0].runtime_data
    return RinnovaValidita(coordinatore)
