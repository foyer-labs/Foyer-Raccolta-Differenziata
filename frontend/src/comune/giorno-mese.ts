// Giorno e mese ("MM-GG") scelti da due menu: il patrono, i periodi "ogni anno".
// I giorni sono quelli del mese scelto in un anno non bisestile: il 29 febbraio non
// è ammesso né per il patrono né per un periodo annuale (decisione 27), e il 31
// aprile non esiste. Cambiando mese, il giorno che non c'è scende all'ultimo.
import { html } from "lit";
import { live } from "lit/directives/live.js";

import { giorniNelMese } from "./date";
import { MESI, T } from "./testi";

const ANNO_NON_BISESTILE = 2001;

export function sceltaGiornoMese(valore: string, cambia: (v: string) => void) {
  const [m, g] = valore.split("-").map(Number);
  const componi = (mese: number, giorno: number) => {
    const ultimo = giorniNelMese(ANNO_NON_BISESTILE, mese);
    const d = Math.min(giorno, ultimo);
    cambia(`${String(mese).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  };
  const giorni = giorniNelMese(ANNO_NON_BISESTILE, m);
  return html`<select aria-label=${T.giorno} .value=${live(String(g))}
      @change=${(e: Event) => componi(m, Number((e.target as HTMLSelectElement).value))}>
      ${Array.from({ length: giorni }, (_, i) => i + 1).map((n) => html`<option value=${n} ?selected=${n === g}>${n}</option>`)}
    </select>
    <select aria-label=${T.mese} .value=${live(String(m))}
      @change=${(e: Event) => componi(Number((e.target as HTMLSelectElement).value), g)}>
      ${MESI.map((nome, i) => html`<option value=${i + 1} ?selected=${i + 1 === m}>${nome}</option>`)}
    </select>`;
}
