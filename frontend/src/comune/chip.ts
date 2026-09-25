// La chip di una tipologia: colore, icona e nome.
import { html } from "lit";
import { testoSu } from "./stili";

export interface TipologiaVisibile {
  id: string;
  nome: string;
  colore: string;
  icona: string;
}

export const chip = (t: TipologiaVisibile) =>
  html`<span class="chip" style="background:${t.colore};color:${testoSu(t.colore)}"
    ><ha-icon .icon=${t.icona}></ha-icon>${t.nome}</span
  >`;

export const nuovoId = (): string =>
  (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^0-9a-f]/gi, "").slice(0, 32);
