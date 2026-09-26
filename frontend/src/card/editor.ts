// L'editor visuale delle card: titolo e, per la settimana, da che giorno inizia.
import { LitElement, css, html, nothing } from "lit";

import { base, moduli } from "../comune/stili";
import { T } from "../comune/testi";
import type { ConfigCard } from "./base";
import { definisci } from "../comune/definisci";

export class RaccoltaEditor extends LitElement {
  static override properties = { _config: { state: true } };
  private _config?: ConfigCard;

  setConfig(config: ConfigCard) {
    this._config = { ...config };
  }

  private _cambia(parziale: Partial<ConfigCard>) {
    const config = { ...this._config!, ...parziale };
    for (const [k, v] of Object.entries(config)) if (v === "" || v === undefined) delete (config as Record<string, unknown>)[k];
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  override render() {
    if (!this._config) return nothing;
    const settimana = this._config.type.includes("settimana");
    return html`<div class="modulo">
      <div class="campo">
        <label for="titolo">${T.card.campoTitolo}</label>
        <input id="titolo" .value=${this._config.titolo ?? ""} @input=${(e: InputEvent) => this._cambia({ titolo: (e.target as HTMLInputElement).value })} />
      </div>
      ${settimana
        ? html`<div class="campo">
            <span class="etichetta">${T.card.campoInizio}</span>
            <div class="segmenti">
              ${(["oggi", "lunedi"] as const).map(
                (v) => html`<button class=${(this._config!.inizio ?? "oggi") === v ? "attivo" : ""} @click=${() => this._cambia({ inizio: v })}>
                  ${v === "oggi" ? T.card.inizioOggi : T.card.inizioLunedi}
                </button>`,
              )}
            </div>
          </div>`
        : nothing}
    </div>`;
  }

  static override styles = [base, moduli, css`:host { display: block; }`];
}

definisci("foyer-raccolta-editor", RaccoltaEditor);
