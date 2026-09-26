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
  /** Una frase da leggere prima di salvare (cosa sparisce con un'eliminazione). */
  avviso?: string;
}

/** Evento con cui una pagina propone una configurazione nuova (decisione 36). */
export const proponi = (el: HTMLElement, configurazione: Configurazione, riepilogo?: Riepilogo, avviso?: string) =>
  el.dispatchEvent(
    new CustomEvent<Proposta>("proponi", {
      detail: { configurazione, riepilogo, avviso },
      bubbles: true,
      composed: true,
    }),
  );

/** Quello che il pannello chiede a una pagina. */
export interface PaginaPannello extends HTMLElement {
  /** Chiude il modulo aperto: la configurazione è cambiata. */
  chiudiEditor?: () => void;
  /** Una bozza non salvata che cambiare scheda butterebbe via. */
  haModifiche?: () => boolean;
  /** "Prima di salvare" chiusa senza salvare: i controlli tornano ai valori salvati. */
  propostaAnnullata?: () => void;
}

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
