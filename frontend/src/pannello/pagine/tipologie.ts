// Tipologie (SPEC §4.1, §10.1): elenco, creazione, modifica, eliminazione.
import { LitElement, css, html, nothing } from "lit";

import { nuovoId } from "../../comune/chip";
import { piuGiorni } from "../../comune/date";
import { base, moduli, pagina, testoSu } from "../../comune/stili";
import { giornoMese, T } from "../../comune/testi";
import type { Finestra, HomeAssistant, LetturaConfigurazione, LetturaRitiri, Tipologia } from "../../comune/tipi";
import { copia, proponi } from "../contesto";
import "../../comune/finestra";

const DOMINIO = "foyer_raccolta_differenziata";
const COLORI = ["#795548", "#1e88e5", "#fdd835", "#43a047", "#757575", "#8bc34a", "#e53935", "#8e24aa", "#fb8c00", "#00897b"];

export class RdTipologie extends LitElement {
  static override properties = {
    hass: { attribute: false },
    lettura: { attribute: false },
    _bozza: { state: true },
    _prossimi: { state: true },
  };

  hass!: HomeAssistant;
  lettura!: LetturaConfigurazione;
  private _bozza?: Tipologia;
  private _prossimi: Record<string, string> = {};

  override updated(cambiati: Map<string, unknown>) {
    if (cambiati.has("lettura")) void this._caricaProssimi();
  }

  chiudiEditor() {
    this._bozza = undefined;
  }

  private async _caricaProssimi() {
    const oggi = this.lettura.oggi;
    const lettura = await this.hass.callWS<LetturaRitiri>({
      type: `${DOMINIO}/ritiri`,
      dal: oggi,
      al: piuGiorni(oggi, 365),
    });
    const prossimi: Record<string, string> = {};
    for (const r of lettura.ritiri) prossimi[r.tipologia] ??= r.data;
    this._prossimi = prossimi;
  }

  private _nuova() {
    const usati = new Set(this.lettura.configurazione.tipologie.map((t) => t.colore.toLowerCase()));
    this._bozza = {
      id: nuovoId(),
      nome: "",
      colore: COLORI.find((c) => !usati.has(c)) ?? COLORI[0],
      icona: "mdi:trash-can-outline",
      note: "",
      esposizione: null,
    };
  }

  private _salva() {
    const bozza = this._bozza!;
    const nuova = copia(this.lettura.configurazione);
    const i = nuova.tipologie.findIndex((t) => t.id === bozza.id);
    const pulita = { ...bozza, nome: bozza.nome.trim(), note: bozza.note.trim() };
    if (i >= 0) nuova.tipologie[i] = pulita;
    else nuova.tipologie.push(pulita);
    proponi(this, nuova);
  }

  private _elimina() {
    const bozza = this._bozza!;
    const c = this.lettura.configurazione;
    const regole = c.regole.filter((r) => r.tipologia === bozza.id).length;
    const eccezioni = c.eccezioni.filter((e) => e.tipologia === bozza.id).length;
    if (!confirm(T.eliminaTipologia(bozza.nome, regole, eccezioni))) return;
    const nuova = copia(c);
    nuova.tipologie = nuova.tipologie.filter((t) => t.id !== bozza.id);
    nuova.regole = nuova.regole.filter((r) => r.tipologia !== bozza.id);
    nuova.eccezioni = nuova.eccezioni.filter((e) => e.tipologia !== bozza.id);
    proponi(this, nuova);
  }

  private _aggiorna(parziale: Partial<Tipologia>) {
    this._bozza = { ...this._bozza!, ...parziale };
  }

  private _aggiornaFinestra(parziale: Partial<Finestra>) {
    const attuale = this._bozza!.esposizione ?? { ...this.lettura.configurazione.esposizione };
    this._aggiorna({ esposizione: { ...attuale, ...parziale } });
  }

  private _editor() {
    const b = this._bozza;
    if (!b) return nothing;
    const esistente = this.lettura.configurazione.tipologie.some((t) => t.id === b.id);
    return html`<rd-finestra aperta titolo=${esistente ? b.nome || T.nuovaTipologia : T.nuovaTipologia} @chiudi=${() => (this._bozza = undefined)}>
      <div class="modulo">
        <div class="anteprima-testa" style="background:${b.colore};color:${testoSu(b.colore)}">
          <span class="cerchio"><ha-icon .icon=${b.icona}></ha-icon></span><b>${b.nome || T.nome}</b>
        </div>
        <div class="campo">
          <label for="nome">${T.nome}</label>
          <input id="nome" maxlength="40" .value=${b.nome} @input=${(e: InputEvent) => this._aggiorna({ nome: (e.target as HTMLInputElement).value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${T.colore}</span>
          <div class="colori">
            ${COLORI.map(
              (c) => html`<button class="colore ${c === b.colore ? "attivo" : ""}" style="background:${c}" aria-label=${c} @click=${() => this._aggiorna({ colore: c })}></button>`,
            )}
            <input type="color" .value=${b.colore} @input=${(e: InputEvent) => this._aggiorna({ colore: (e.target as HTMLInputElement).value })} />
          </div>
        </div>
        <div class="campo">
          <label for="icona">${T.icona}</label>
          <input id="icona" .value=${b.icona} @input=${(e: InputEvent) => this._aggiorna({ icona: (e.target as HTMLInputElement).value.trim() })} />
          <small>${T.iconaAiuto}</small>
        </div>
        <div class="campo">
          <label for="note">${T.note}</label>
          <textarea id="note" maxlength="500" .value=${b.note} @input=${(e: InputEvent) => this._aggiorna({ note: (e.target as HTMLTextAreaElement).value })}></textarea>
        </div>
        <label class="spunta">
          <input type="checkbox" .checked=${b.esposizione !== null} @change=${(e: Event) => this._aggiorna({ esposizione: (e.target as HTMLInputElement).checked ? { ...this.lettura.configurazione.esposizione } : null })} />
          ${T.finestraPropria}
        </label>
        ${b.esposizione
          ? html`<div class="riga-campi">
                <div class="campo">
                  <label>${T.dalle}</label>
                  <input type="time" .value=${b.esposizione.inizio_ora} @change=${(e: Event) => this._aggiornaFinestra({ inizio_ora: (e.target as HTMLInputElement).value })} />
                </div>
                <div class="campo">
                  <label>${T.del}</label>
                  <select @change=${(e: Event) => this._aggiornaFinestra({ inizio_giorno: (e.target as HTMLSelectElement).value as Finestra["inizio_giorno"] })}>
                    ${(["giorno_prima", "giorno_stesso"] as const).map((g) => html`<option value=${g} ?selected=${b.esposizione!.inizio_giorno === g}>${T.inizioGiorno[g]}</option>`)}
                  </select>
                </div>
              </div>
              <div class="campo">
                <label>${T.entroLe}</label>
                <input type="time" .value=${b.esposizione.fine_ora} @change=${(e: Event) => this._aggiornaFinestra({ fine_ora: (e.target as HTMLInputElement).value })} />
              </div>`
          : nothing}
        <div class="azioni-modulo">
          ${esistente ? html`<button class="bottone pericolo" @click=${this._elimina}>${T.elimina}</button>` : nothing}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => (this._bozza = undefined)}>${T.annulla}</button>
          <button class="bottone primario" ?disabled=${!b.nome.trim()} @click=${this._salva}>${T.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
  }

  override render() {
    const tipologie = this.lettura.configurazione.tipologie;
    return html`<div class="riquadro">
        <h2>${T.pagine.tipologie} <span class="conta">${tipologie.length}</span></h2>
        <p class="aiuto">${T.aiutoTipologie}</p>
        <div class="griglia">
          ${tipologie.map(
            (t) => html`<button class="tipologia" @click=${() => (this._bozza = copia(t))}>
              <div class="testa" style="background:${t.colore};color:${testoSu(t.colore)}">
                <span class="cerchio"><ha-icon .icon=${t.icona}></ha-icon></span><b>${t.nome}</b>
              </div>
              <div class="corpo">${t.note || html`<i>${T.nessunaNota}</i>`}</div>
              <div class="piede">
                <span>${T.prossimo}: <b>${this._prossimi[t.id] ? giornoMese(this._prossimi[t.id]) : "—"}</b></span>
                <span class="link">${T.modifica}</span>
              </div>
            </button>`,
          )}
          <button class="nuova" @click=${this._nuova}><ha-icon icon="mdi:plus"></ha-icon>${T.nuovaTipologia}</button>
        </div>
      </div>
      ${this._editor()}`;
  }

  static override styles = [
    base,
    pagina,
    moduli,
    css`
      .griglia {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 12px;
      }
      .tipologia {
        border: 1px solid var(--rd-bordo);
        border-radius: 14px;
        overflow: hidden;
        background: var(--rd-superficie);
        display: flex;
        flex-direction: column;
        text-align: left;
        padding: 0;
        cursor: pointer;
        transition: transform 0.12s, box-shadow 0.12s;
      }
      .tipologia:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      }
      .testa,
      .anteprima-testa {
        padding: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
      }
      .anteprima-testa {
        border-radius: 14px;
      }
      .cerchio {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        display: grid;
        place-items: center;
        flex: none;
      }
      .corpo {
        padding: 12px 14px;
        font-size: 13.5px;
        color: var(--rd-testo-2);
        flex: 1;
      }
      .piede {
        padding: 8px 14px;
        border-top: 1px solid var(--rd-bordo);
        display: flex;
        justify-content: space-between;
        font-size: 13px;
      }
      .link {
        color: var(--rd-primario);
      }
      .nuova {
        border: 2px dashed var(--rd-bordo);
        border-radius: 14px;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 6px;
        min-height: 150px;
        color: var(--rd-testo-2);
        cursor: pointer;
        background: none;
      }
      .colori {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }
      .colore {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        padding: 0;
      }
      .colore.attivo {
        border-color: var(--rd-testo);
        box-shadow: 0 0 0 2px var(--rd-superficie) inset;
      }
      .spunta {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 14px;
      }
      .spunta input {
        width: auto;
      }
    `,
  ];
}

if (!customElements.get("rd-tipologie")) customElements.define("rd-tipologie", RdTipologie);
