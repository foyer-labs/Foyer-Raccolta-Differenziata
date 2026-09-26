// Un selettore con ricerca: si scrive, compaiono i suggerimenti filtrati per nome e
// per identificativo, si sceglie con il mouse o con la tastiera. In modalità multipla
// le scelte stanno in un elenco, ciascuna con il suo pulsante per toglierla; i gruppi
// (telefoni, altri servizi, entità) diventano filtri. È lo stesso principio del
// selettore di entità di Foyer Home Defender: una fila di caselle da spuntare smette
// di funzionare quando le voci sono decine.
import { LitElement, css, html, nothing } from "lit";

import { base } from "./stili";
import { T } from "./testi";
import { definisci } from "./definisci";

export interface Opzione {
  id: string;
  nome: string;
  /** Una seconda riga: l'identificativo, o cosa succede scegliendola. */
  dettaglio?: string;
  /** Un'etichetta breve a destra ("con pulsanti"). */
  etichetta?: string;
  etichettaEvidente?: boolean;
  icona?: string;
  gruppo?: string;
}

const MASSIMO_SUGGERIMENTI = 60;

export class RdSelettore extends LitElement {
  static override properties = {
    opzioni: { attribute: false },
    scelti: { attribute: false },
    multiplo: { type: Boolean },
    libero: { type: Boolean },
    etichetta: {},
    segnaposto: {},
    vuoto: {},
    _testo: { state: true },
    _aperto: { state: true },
    _attivo: { state: true },
    _gruppo: { state: true },
  };

  opzioni: Opzione[] = [];
  scelti: string[] = [];
  multiplo = false;
  /** Scelta singola che accetta anche un valore fuori elenco (un'icona scritta a mano). */
  libero = false;
  etichetta = "";
  segnaposto = "";
  vuoto = "";
  private _testo = "";
  private _aperto = false;
  private _attivo = 0;
  private _gruppo = "";
  private static _contatore = 0;
  private _idLista = `rd-suggerimenti-${++RdSelettore._contatore}`;

  private _cambia(scelti: string[]) {
    this.dispatchEvent(new CustomEvent("cambia", { detail: scelti, bubbles: true, composed: true }));
  }

  private _suggerimenti(): Opzione[] {
    const cerca = this._testo.trim().toLowerCase();
    return this.opzioni
      .filter((o) => !this.multiplo || !this.scelti.includes(o.id))
      .filter((o) => !this._gruppo || o.gruppo === this._gruppo)
      .filter((o) => !cerca || o.nome.toLowerCase().includes(cerca) || o.id.toLowerCase().includes(cerca))
      .slice(0, MASSIMO_SUGGERIMENTI);
  }

  private _scegli(o: Opzione) {
    if (this.multiplo) {
      this._cambia([...this.scelti, o.id]);
      this._testo = "";
      this._attivo = 0;
      // Il campo resta aperto: chi aggiunge un destinatario ne aggiunge spesso un altro.
      this.renderRoot.querySelector<HTMLInputElement>("input")?.focus();
    } else {
      this._cambia([o.id]);
      this._testo = "";
      this._aperto = false;
    }
  }

  private _conferma() {
    const elenco = this._suggerimenti();
    if (elenco[this._attivo]) return this._scegli(elenco[this._attivo]);
    if (this.libero && this._testo.trim()) {
      this._cambia([this._testo.trim()]);
      this._testo = "";
      this._aperto = false;
    }
  }

  private _tasto(e: KeyboardEvent) {
    const n = this._suggerimenti().length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this._aperto = true;
      this._attivo = n ? (this._attivo + 1) % n : 0;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._attivo = n ? (this._attivo - 1 + n) % n : 0;
    } else if (e.key === "Enter") {
      e.preventDefault();
      this._conferma();
    } else if (e.key === "Escape" && this._aperto) {
      e.stopPropagation();
      this._aperto = false;
    }
  }

  private _riga(o: Opzione, i: number, attiva: boolean) {
    return html`<li
      id=${`${this._idLista}-${i}`}
      role="option"
      aria-selected=${attiva}
      class=${attiva ? "attiva" : ""}
      @mousedown=${(e: Event) => e.preventDefault()}
      @click=${() => this._scegli(o)}
      @mouseenter=${() => (this._attivo = i)}
    >
      ${o.icona ? html`<ha-icon .icon=${o.icona}></ha-icon>` : nothing}
      <span class="testi"><span class="nome">${o.nome}</span>${o.dettaglio ? html`<small>${o.dettaglio}</small>` : nothing}</span>
      ${o.etichetta ? html`<span class="etichetta ${o.etichettaEvidente ? "evidente" : ""}">${o.etichetta}</span>` : nothing}
    </li>`;
  }

  private _scelte() {
    if (!this.multiplo) return nothing;
    if (!this.scelti.length) return html`<div class="nessuna">${this.vuoto}</div>`;
    return html`<ul class="scelte" aria-label=${this.etichetta}>
      ${this.scelti.map((id) => {
        const o = this.opzioni.find((x) => x.id === id);
        return html`<li class=${o ? "" : "mancante"}>
          ${o?.icona ? html`<ha-icon .icon=${o.icona}></ha-icon>` : html`<ha-icon icon="mdi:help-circle-outline"></ha-icon>`}
          <span class="testi">
            <span class="nome">${o?.nome ?? id}</span>
            <small>${o ? o.dettaglio ?? id : T.nonTrovato}</small>
          </span>
          ${o?.etichetta ? html`<span class="etichetta ${o.etichettaEvidente ? "evidente" : ""}">${o.etichetta}</span>` : nothing}
          <button class="togli" aria-label=${`${T.togli} ${o?.nome ?? id}`} title=${T.togli} @click=${() => this._cambia(this.scelti.filter((x) => x !== id))}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </li>`;
      })}
    </ul>`;
  }

  override render() {
    const gruppi = [...new Set(this.opzioni.map((o) => o.gruppo).filter((g): g is string => !!g))];
    const elenco = this._aperto ? this._suggerimenti() : [];
    const attivo = Math.min(this._attivo, Math.max(elenco.length - 1, 0));
    const corrente = !this.multiplo ? this.opzioni.find((o) => o.id === this.scelti[0]) : undefined;
    return html`
      ${this._scelte()}
      <div class="campo-ricerca ${this._aperto ? "aperto" : ""}">
        ${!this.multiplo && this.scelti[0]
          ? html`<ha-icon class="anteprima" .icon=${corrente?.icona ?? this.scelti[0]}></ha-icon>`
          : html`<ha-icon class="lente" icon="mdi:magnify"></ha-icon>`}
        <input
          role="combobox"
          aria-label=${this.etichetta}
          aria-expanded=${this._aperto}
          aria-controls=${this._idLista}
          aria-activedescendant=${elenco.length ? `${this._idLista}-${attivo}` : ""}
          autocomplete="off"
          placeholder=${!this.multiplo && this.scelti[0] ? corrente?.nome ?? this.scelti[0] : this.segnaposto}
          .value=${this._testo}
          @input=${(e: InputEvent) => {
            this._testo = (e.target as HTMLInputElement).value;
            this._aperto = true;
            this._attivo = 0;
          }}
          @focus=${() => (this._aperto = true)}
          @blur=${() => (this._aperto = false)}
          @keydown=${this._tasto}
        />
      </div>
      ${this._aperto
        ? html`<div class="tendina">
            ${gruppi.length > 1
              ? html`<div class="filtri" @mousedown=${(e: Event) => e.preventDefault()}>
                  ${["", ...gruppi].map(
                    (g) => html`<button class=${this._gruppo === g ? "attivo" : ""} @click=${() => ((this._gruppo = g), (this._attivo = 0))}>
                      ${g || T.tutti}
                    </button>`,
                  )}
                </div>`
              : nothing}
            <ul id=${this._idLista} role="listbox" aria-label=${this.etichetta}>
              ${elenco.length
                ? elenco.map((o, i) => this._riga(o, i, i === attivo))
                : html`<li class="niente" role="presentation">
                    ${this.libero && this._testo.trim() ? T.usaValore(this._testo.trim()) : T.nessunRisultato}
                  </li>`}
            </ul>
          </div>`
        : nothing}
    `;
  }

  static override styles = [
    base,
    css`
      :host {
        display: block;
      }
      .scelte {
        list-style: none;
        margin: 0 0 8px;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      .scelte li,
      .tendina li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        --mdc-icon-size: 20px;
      }
      .scelte li {
        border: 1px solid var(--rd-bordo);
        border-radius: 10px;
      }
      .scelte li.mancante {
        border-color: var(--rd-errore);
      }
      .scelte li.mancante small {
        color: var(--rd-errore);
      }
      .testi {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .nome {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      small {
        color: var(--rd-testo-2);
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .etichetta {
        font-size: 11.5px;
        color: var(--rd-testo-2);
        border: 1px solid var(--rd-bordo);
        border-radius: 6px;
        padding: 1px 6px;
        white-space: nowrap;
      }
      .etichetta.evidente {
        color: var(--rd-primario);
        border-color: var(--rd-primario);
      }
      .togli {
        border: 0;
        background: none;
        cursor: pointer;
        color: var(--rd-testo-2);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex: none;
      }
      .togli:hover,
      .togli:focus-visible {
        background: var(--rd-superficie-2);
        color: var(--rd-errore);
      }
      .nessuna {
        color: var(--rd-testo-2);
        font-size: 13.5px;
        margin-bottom: 8px;
      }
      .campo-ricerca {
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--rd-bordo);
        border-radius: 10px;
        padding: 0 10px;
        background: var(--rd-superficie);
        --mdc-icon-size: 20px;
      }
      .campo-ricerca.aperto,
      .campo-ricerca:focus-within {
        border-color: var(--rd-primario);
        box-shadow: 0 0 0 1px var(--rd-primario);
      }
      .lente {
        color: var(--rd-testo-2);
      }
      input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        background: none;
        color: var(--rd-testo);
        font: inherit;
        padding: 10px 0;
      }
      .tendina {
        margin-top: 4px;
        border: 1px solid var(--rd-bordo);
        border-radius: 10px;
        background: var(--rd-superficie);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        overflow: hidden;
      }
      .filtri {
        display: flex;
        gap: 4px;
        padding: 6px;
        border-bottom: 1px solid var(--rd-bordo);
        flex-wrap: wrap;
      }
      .filtri button {
        border: 1px solid var(--rd-bordo);
        background: none;
        border-radius: 999px;
        padding: 3px 10px;
        font-size: 12.5px;
        cursor: pointer;
      }
      .filtri button.attivo {
        background: var(--rd-primario);
        border-color: var(--rd-primario);
        color: var(--text-primary-color, #fff);
      }
      .tendina ul {
        list-style: none;
        margin: 0;
        padding: 4px 0;
        max-height: 240px;
        overflow-y: auto;
      }
      .tendina li {
        cursor: pointer;
      }
      .tendina li.attiva {
        background: color-mix(in srgb, var(--rd-primario) 12%, transparent);
      }
      .tendina li.niente {
        color: var(--rd-testo-2);
        cursor: default;
      }
    `,
  ];
}

definisci("rd-selettore", RdSelettore);
