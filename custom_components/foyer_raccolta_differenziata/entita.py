"""La base comune delle entità: dispositivo, disponibilità, aggiornamenti."""

from __future__ import annotations

from typing import Any

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity import Entity

from . import testi
from .const import DOMINIO
from .coordinatore import Coordinatore
from .core.calendario import Ritiro
from .core.viste import confermato


def info_dispositivo(coordinatore: Coordinatore) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMINIO, coordinatore.entry.entry_id)},
        translation_key="raccolta",
        manufacturer=testi.PRODUTTORE,
        entry_type=DeviceEntryType.SERVICE,
    )


class EntitaRaccolta(Entity):
    """Un'entità che si aggiorna quando il coordinatore ricalcola.

    Non disponibile finché il calcolo non è riuscito: un sensore che non sa non
    dice "Nessuno" (INV-2).
    """

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, coordinatore: Coordinatore, chiave: str) -> None:
        self.coordinatore = coordinatore
        self._attr_unique_id = f"{coordinatore.entry.entry_id}_{chiave}"
        self._attr_device_info = info_dispositivo(coordinatore)

    @property
    def available(self) -> bool:
        return self.coordinatore.disponibile

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self.coordinatore.ascolta(self._al_ricalcolo))

    @callback
    def _al_ricalcolo(self) -> None:
        self.async_write_ha_state()

    def descrivi(self, ritiro: Ritiro) -> dict[str, Any]:
        """Un ritiro come attributo: tutto quello che serve a una card o un modello."""
        tipologia = self.coordinatore.tipologia(ritiro.tipologia)
        return {
            "tipologia": ritiro.tipologia,
            "nome": tipologia.nome if tipologia else ritiro.tipologia,
            "colore": tipologia.colore if tipologia else None,
            "icona": tipologia.icona if tipologia else None,
            "data": ritiro.data.isoformat(),
            "inizio_esposizione": ritiro.inizio_esposizione.isoformat(),
            "fine_esposizione": ritiro.fine_esposizione.isoformat(),
            "origine": ritiro.origine.tipo,
            "spostato_dal": (
                ritiro.origine.da.isoformat() if ritiro.origine.da else None
            ),
            "festivo": ritiro.festivo,
            "da_verificare": ritiro.da_verificare,
            "confermato": confermato(ritiro, self.coordinatore.conferme),
        }
