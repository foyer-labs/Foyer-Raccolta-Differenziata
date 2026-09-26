"""Il calendario nativo: un evento di un giorno intero per ogni ritiro (SPEC §9.2)."""

from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from . import testi
from .coordinatore import Coordinatore
from .core.calendario import Ritiro
from .core.viste import prossimo_evento
from .entita import EntitaRaccolta

MASSIMO_GIORNI_CALENDARIO = 731


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([CalendarioRaccolta(entry.runtime_data)])


class CalendarioRaccolta(EntitaRaccolta, CalendarEntity):
    _attr_name = None

    def __init__(self, coordinatore: Coordinatore) -> None:
        super().__init__(coordinatore, "calendario")

    def _evento(self, ritiro: Ritiro) -> CalendarEvent:
        tipologia = self.coordinatore.tipologia(ritiro.tipologia)
        righe = [tipologia.note] if tipologia and tipologia.note else []
        if ritiro.origine.da is not None:
            righe.append(testi.spostato_dal(ritiro.origine.da))
        elif ritiro.origine.tipo == "aggiunto":
            righe.append(testi.AGGIUNTO)
        if ritiro.festivo:
            righe.append(testi.festivo(ritiro.festivo))
        if ritiro.da_verificare:
            righe.append(testi.DA_VERIFICARE)
        return CalendarEvent(
            start=ritiro.data,
            end=ritiro.data + timedelta(days=1),
            summary=tipologia.nome if tipologia else ritiro.tipologia,
            description="\n".join(righe) or None,
            uid=f"{ritiro.data.isoformat()}_{ritiro.tipologia}",
        )

    @property
    def event(self) -> CalendarEvent | None:
        """Il ritiro in corso oggi o il prossimo."""
        if self.coordinatore.risultato is None:
            return None
        ritiro = prossimo_evento(self.coordinatore.risultato, self.coordinatore.oggi)
        return self._evento(ritiro) if ritiro else None

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        dal = dt_util.as_local(start_date).date()
        # La fine è esclusa: un intervallo che finisce a mezzanotte non comprende
        # il giorno che inizia in quell'istante.
        al = (dt_util.as_local(end_date) - timedelta(microseconds=1)).date()
        if al < dal:
            return []
        # Il calcolo gira nel ciclo degli eventi: oltre due anni per richiesta non serve
        # a nessuna vista del calendario.
        al = min(al, dal + timedelta(days=MASSIMO_GIORNI_CALENDARIO))
        risultato = self.coordinatore.calcola_intervallo(dal, al)
        if risultato is None:
            return []
        return [self._evento(r) for r in risultato.ritiri]
