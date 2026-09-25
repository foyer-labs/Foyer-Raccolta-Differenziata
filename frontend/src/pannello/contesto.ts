// Quello che ogni pagina del pannello riceve, e come chiede di salvare.
import type { Configurazione, HomeAssistant, LetturaConfigurazione } from "../comune/tipi";

export interface Contesto {
  hass: HomeAssistant;
  lettura: LetturaConfigurazione;
}

/** Evento con cui una pagina propone una configurazione nuova (decisione 36). */
export const proponi = (el: HTMLElement, configurazione: Configurazione) =>
  el.dispatchEvent(new CustomEvent("proponi", { detail: configurazione, bubbles: true, composed: true }));

export interface Precompila {
  tipo: "aggiungi" | "togli" | "sposta";
  tipologia: string;
  data: string;
}

export const naviga = (el: HTMLElement, pagina: string, precompila?: Precompila) =>
  el.dispatchEvent(new CustomEvent("naviga", { detail: { pagina, precompila }, bubbles: true, composed: true }));

export const ricarica = (el: HTMLElement) =>
  el.dispatchEvent(new CustomEvent("ricarica", { bubbles: true, composed: true }));

/** Una copia profonda da modificare senza toccare quella letta. */
export const copia = <T>(valore: T): T => JSON.parse(JSON.stringify(valore));
