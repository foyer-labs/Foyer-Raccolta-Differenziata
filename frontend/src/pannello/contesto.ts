// Quello che ogni pagina del pannello riceve, e come chiede di salvare.
import type { Configurazione, HomeAssistant, LetturaConfigurazione, Riepilogo } from "../comune/tipi";

export interface Contesto {
  hass: HomeAssistant;
  lettura: LetturaConfigurazione;
}

export interface Proposta {
  configurazione: Configurazione;
  /** Da un file importato: quante cose cambiano, sezione per sezione. */
  riepilogo?: Riepilogo;
}

/** Evento con cui una pagina propone una configurazione nuova (decisione 36). */
export const proponi = (el: HTMLElement, configurazione: Configurazione, riepilogo?: Riepilogo) =>
  el.dispatchEvent(
    new CustomEvent<Proposta>("proponi", { detail: { configurazione, riepilogo }, bubbles: true, composed: true }),
  );

/** Un messaggio breve in basso nel pannello. */
export const avvisa = (el: HTMLElement, testo: string) =>
  el.dispatchEvent(new CustomEvent("avvisa", { detail: testo, bubbles: true, composed: true }));

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
