// Impostazioni (SPEC §10.1): barra laterale, finestra di esposizione, validità,
// patrono. La barra laterale cambia subito; il resto passa da "Prima di salvare".
import { LitElement, css, html } from "lit";

import { base, moduli, pagina } from "../../comune/stili";
import { MESI, T } from "../../comune/testi";
import type { Configurazione, Finestra, HomeAssistant, LetturaConfigurazione } from "../../comune/tipi";
import { copia, proponi, ricarica } from "../contesto";

const DOMINIO = "foyer_raccolta_differenziata";

export class RdImpostazioni extends LitElement {
  static override properties = {
    hass: { attribute: false },
    lettura: { attribute: false },
    _bozza: { state: true },
  };

  hass!: HomeAssistant;
  lettura!: LetturaConfigurazione;
  private _bozza?: Configurazione;

  private _revisione?: number;
  private _base?: string;

  override willUpdate(cambiati: Map<string, unknown>) {
    // Un ricalcolo (una conferma, mezzanotte) rilegge la configurazione identica: la
    // bozza si rimpiazza solo se la revisione è cambiata e non ci sono modifiche.
    if (!cambiati.has("lettura")) return;
    const intatta = !this._bozza || JSON.stringify(this._bozza) === this._base;
    if (this._revisione !== this.lettura.revisione && intatta) {
      this._bozza = copia(this.lettura.configurazione);
      this._base = JSON.stringify(this._bozza);
      this._revisione = this.lettura.revisione;
    }
  }

  private async _barra() {
    await this.hass.callWS({ type: `${DOMINIO}/barra_laterale`, mostra: !this.lettura.mostra_barra_laterale });
    ricarica(this);
  }

  private _finestra(parziale: Partial<Finestra>) {
    this._bozza = { ...this._bozza!, esposizione: { ...this._bozza!.esposizione, ...parziale } };
  }

  private _patrono(parziale: Partial<{ data: string; nome: string }>) {
    const attuale = this._bozza!.patrono ?? { data: "01-01", nome: "" };
    this._bozza = { ...this._bozza!, patrono: { ...attuale, ...parziale } };
  }

  chiudiEditor() {
    // Salvato: la prossima lettura porta la configurazione nuova.
    this._base = undefined;
    this._bozza = undefined;
  }

  private _salva() {
    const bozza = copia(this._bozza!);
    if (bozza.patrono && !bozza.patrono.nome.trim()) bozza.patrono = null;
    if (bozza.patrono) bozza.patrono.nome = bozza.patrono.nome.trim();
    if (!bozza.valido_fino_al) bozza.valido_fino_al = null;
    proponi(this, bozza);
  }

  override render() {
    const b = this._bozza;
    if (!b) return html``;
    const [mese, giorno] = (b.patrono?.data ?? "01-01").split("-").map(Number);
    const componi = (m: number, g: number) =>
      this._patrono({ data: `${String(m).padStart(2, "0")}-${String(g).padStart(2, "0")}` });
    const modificata = JSON.stringify(b) !== this._base;
    return html`<div class="colonna">
      <div class="riquadro">
        <h2>${T.pagine.impostazioni}</h2>
        <div class="interruttore">
          <div>${T.mostraBarra}<small>${T.mostraBarraAiuto}</small></div>
          <button class="levetta ${this.lettura.mostra_barra_laterale ? "acceso" : ""}" role="switch" aria-checked=${this.lettura.mostra_barra_laterale} aria-label=${T.mostraBarra} @click=${this._barra}></button>
        </div>
      </div>

      <div class="riquadro">
        <h2>${T.esposizione}</h2>
        <p class="aiuto">${T.esposizioneAiuto}</p>
        <div class="modulo">
          <div class="riga-campi">
            <div class="campo"><label>${T.dalle}</label><input type="time" .value=${b.esposizione.inizio_ora} @change=${(e: Event) => this._finestra({ inizio_ora: (e.target as HTMLInputElement).value })} /></div>
            <div class="campo">
              <label>${T.del}</label>
              <select @change=${(e: Event) => this._finestra({ inizio_giorno: (e.target as HTMLSelectElement).value as Finestra["inizio_giorno"] })}>
                ${(["giorno_prima", "giorno_stesso"] as const).map((g) => html`<option value=${g} ?selected=${b.esposizione.inizio_giorno === g}>${T.inizioGiorno[g]}</option>`)}
              </select>
            </div>
          </div>
          <div class="campo"><label>${T.entroLe}</label><input type="time" .value=${b.esposizione.fine_ora} @change=${(e: Event) => this._finestra({ fine_ora: (e.target as HTMLInputElement).value })} /></div>
        </div>
      </div>

      <div class="riquadro">
        <h2>${T.calendarioComune}</h2>
        <div class="modulo">
          <div class="campo">
            <label for="validita">${T.validita}</label>
            <input id="validita" type="date" .value=${b.valido_fino_al ?? ""} @change=${(e: Event) => (this._bozza = { ...b, valido_fino_al: (e.target as HTMLInputElement).value || null })} />
            <small>${T.validitaAiuto}</small>
          </div>
          <div class="campo">
            <span class="etichetta">${T.patrono}</span>
            <div class="patrono">
              <input aria-label=${T.nomePatrono} placeholder="Sant'Ambrogio" maxlength="60" .value=${b.patrono?.nome ?? ""} @input=${(e: InputEvent) => this._patrono({ nome: (e.target as HTMLInputElement).value })} />
              <select aria-label=${T.giorno} @change=${(e: Event) => componi(mese, Number((e.target as HTMLSelectElement).value))}>
                ${Array.from({ length: 31 }, (_, i) => i + 1).map((n) => html`<option value=${n} ?selected=${n === giorno}>${n}</option>`)}
              </select>
              <select aria-label=${T.mese} @change=${(e: Event) => componi(Number((e.target as HTMLSelectElement).value), giorno)}>
                ${MESI.map((nome, i) => html`<option value=${i + 1} ?selected=${i + 1 === mese}>${nome}</option>`)}
              </select>
            </div>
            <small>${T.patronoAiuto}</small>
          </div>
        </div>
      </div>
      <div class="azioni-modulo">
        <button class="bottone" ?disabled=${!modificata} @click=${() => {
          this._bozza = copia(this.lettura.configurazione);
          this._base = JSON.stringify(this._bozza);
          this._revisione = this.lettura.revisione;
        }}>${T.annulla}</button>
        <button class="bottone primario" ?disabled=${!modificata} @click=${this._salva}>${T.salva}</button>
      </div>
    </div>`;
  }

  static override styles = [
    base,
    pagina,
    moduli,
    css`
      .colonna {
        max-width: 680px;
      }
      .interruttore {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .interruttore small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 13px;
        margin-top: 2px;
      }
      .patrono {
        display: grid;
        grid-template-columns: 2fr 1fr 1.4fr;
        gap: 8px;
      }
      @media (max-width: 560px) {
        .patrono {
          grid-template-columns: 1fr 1.6fr;
        }
        .patrono input {
          grid-column: 1 / -1;
        }
      }
      .azioni-modulo {
        margin-top: 16px;
      }
    `,
  ];
}

if (!customElements.get("rd-impostazioni")) customElements.define("rd-impostazioni", RdImpostazioni);
