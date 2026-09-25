// Regole (SPEC §4.2, §10.1): per tipologia, scritte come frasi, con un editor che
// mostra subito le prossime date. Le date le calcola il backend, lo stesso motore
// dei sensori: l'anteprima non può dire una cosa e il calendario un'altra.
import { LitElement, css, html, nothing } from "lit";

import { chip, nuovoId } from "../../comune/chip";
import { lunediDi } from "../../comune/date";
import { base, moduli, pagina } from "../../comune/stili";
import {
  dataBreve,
  frasePeriodo,
  fraseRicorrenza,
  GIORNI_BREVI,
  MESI,
  messaggioProblema,
  POSIZIONI_BREVI,
  T,
} from "../../comune/testi";
import type { Anteprima, HomeAssistant, LetturaConfigurazione, Periodo, Problema, Regola, Ricorrenza } from "../../comune/tipi";
import { copia, proponi } from "../contesto";
import "../../comune/finestra";

const DOMINIO = "foyer_raccolta_differenziata";

const RICORRENZE: Record<Ricorrenza["tipo"], (oggi: string) => Ricorrenza> = {
  settimanale: (oggi) => ({ tipo: "settimanale", ogni: 1, giorni: [], ancora: lunediDi(oggi) }),
  mensile_posizione: () => ({ tipo: "mensile_posizione", posizioni: [1], giorno: 0 }),
  mensile_data: () => ({ tipo: "mensile_data", giorni: [1] }),
};

const PERIODI: Record<Periodo["tipo"], (oggi: string) => Periodo> = {
  sempre: () => ({ tipo: "sempre" }),
  annuale: () => ({ tipo: "annuale", dal: "04-01", al: "10-31" }),
  con_anno: (oggi) => ({ tipo: "con_anno", dal: oggi, al: `${oggi.slice(0, 4)}-12-31` }),
};

const alterna = <T>(elenco: T[], voce: T): T[] =>
  elenco.includes(voce) ? elenco.filter((x) => x !== voce) : [...elenco, voce];

export class RdRegole extends LitElement {
  static override properties = {
    hass: { attribute: false },
    lettura: { attribute: false },
    _bozza: { state: true },
    _date: { state: true },
    _problemi: { state: true },
  };

  hass!: HomeAssistant;
  lettura!: LetturaConfigurazione;
  private _bozza?: Regola;
  private _date: string[] = [];
  private _problemi: Problema[] = [];
  private _timer?: number;

  chiudiEditor() {
    this._bozza = undefined;
  }

  private _nuova(tipologia: string) {
    const oggi = this.lettura.oggi;
    this._imposta({ id: nuovoId(), tipologia, nome: "", ricorrenza: RICORRENZE.settimanale(oggi), periodo: { tipo: "sempre" } });
  }

  private _imposta(bozza: Regola) {
    this._bozza = bozza;
    clearTimeout(this._timer);
    this._timer = window.setTimeout(() => void this._anteprima(), 250);
  }

  private _candidata() {
    const nuova = copia(this.lettura.configurazione);
    const i = nuova.regole.findIndex((r) => r.id === this._bozza!.id);
    const regola = { ...this._bozza!, nome: this._bozza!.nome.trim() };
    if (i >= 0) nuova.regole[i] = regola;
    else nuova.regole.push(regola);
    return nuova;
  }

  private async _anteprima() {
    if (!this._bozza) return;
    const id = this._bozza.id;
    const anteprima = await this.hass.callWS<Anteprima>({
      type: `${DOMINIO}/anteprima`,
      configurazione: this._candidata(),
      giorni: 366,
    });
    if (this._bozza?.id !== id) return;
    this._problemi = anteprima.problemi.filter((p) => p.percorso.startsWith("regole"));
    this._date = anteprima.ritiri.filter((r) => r.regole.includes(id)).slice(0, 4).map((r) => r.data);
  }

  private _ricorrenza(parziale: Partial<Ricorrenza>) {
    this._imposta({ ...this._bozza!, ricorrenza: { ...this._bozza!.ricorrenza, ...parziale } as Ricorrenza });
  }

  private _periodo(parziale: Partial<Periodo>) {
    this._imposta({ ...this._bozza!, periodo: { ...this._bozza!.periodo, ...parziale } as Periodo });
  }

  private _elimina() {
    const nuova = copia(this.lettura.configurazione);
    nuova.regole = nuova.regole.filter((r) => r.id !== this._bozza!.id);
    proponi(this, nuova);
  }

  private _editorRicorrenza(r: Ricorrenza) {
    const segmento = (tipo: Ricorrenza["tipo"], testo: string) =>
      html`<button class=${r.tipo === tipo ? "attivo" : ""} @click=${() => r.tipo !== tipo && this._imposta({ ...this._bozza!, ricorrenza: RICORRENZE[tipo](this.lettura.oggi) })}>${testo}</button>`;
    return html`<div class="campo">
        <span class="etichetta">${T.ricorrenza}</span>
        <div class="segmenti">
          ${segmento("settimanale", T.ogniSettimane)} ${segmento("mensile_posizione", T.posizioneMese)}
          ${segmento("mensile_data", T.dataMese)}
        </div>
      </div>
      ${r.tipo === "settimanale"
        ? html`<div class="campo">
              <span class="etichetta">${T.ogni}</span>
              <div class="segmenti">
                ${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => html`<button class=${r.ogni === n ? "attivo" : ""} @click=${() => this._ricorrenza({ ogni: n })}>${n === 1 || n === 2 ? T.settimane(n) : n}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${T.neiGiorni}</span>
              <div class="tonde">
                ${GIORNI_BREVI.map((g, i) => html`<button class=${r.giorni.includes(i) ? "attivo" : ""} aria-pressed=${r.giorni.includes(i)} @click=${() => this._ricorrenza({ giorni: alterna(r.giorni, i).sort() })}>${g.slice(0, 2)}</button>`)}
              </div>
            </div>
            ${r.ogni > 1
              ? html`<div class="campo">
                  <label for="ancora">${T.ancora}</label>
                  <input id="ancora" type="date" .value=${r.ancora} @change=${(e: Event) => this._ricorrenza({ ancora: (e.target as HTMLInputElement).value })} />
                  <small>${T.ancoraAiuto}</small>
                </div>`
              : nothing}`
        : nothing}
      ${r.tipo === "mensile_posizione"
        ? html`<div class="campo">
              <span class="etichetta">${T.quali}</span>
              <div class="tonde">
                ${[1, 2, 3, 4, -1].map((p) => html`<button class=${r.posizioni.includes(p) ? "attivo" : ""} @click=${() => this._ricorrenza({ posizioni: alterna(r.posizioni, p) })}>${POSIZIONI_BREVI[p]}</button>`)}
              </div>
            </div>
            <div class="campo">
              <span class="etichetta">${T.giornoSettimana}</span>
              <div class="tonde">
                ${GIORNI_BREVI.map((g, i) => html`<button class=${r.giorno === i ? "attivo" : ""} @click=${() => this._ricorrenza({ giorno: i })}>${g.slice(0, 2)}</button>`)}
              </div>
            </div>`
        : nothing}
      ${r.tipo === "mensile_data"
        ? html`<div class="campo">
            <span class="etichetta">${T.giorniDelMese}</span>
            <div class="tonde calendario">
              ${Array.from({ length: 31 }, (_, i) => i + 1).map((g) => html`<button class=${r.giorni.includes(g) ? "attivo" : ""} @click=${() => this._ricorrenza({ giorni: alterna(r.giorni, g).sort((a, b) => a - b) })}>${g}</button>`)}
            </div>
          </div>`
        : nothing}`;
  }

  private _meseGiorno(valore: string, cambia: (v: string) => void) {
    const [m, g] = valore.split("-").map(Number);
    const componi = (mese: number, giorno: number) => cambia(`${String(mese).padStart(2, "0")}-${String(giorno).padStart(2, "0")}`);
    return html`<div class="riga-campi">
      <select aria-label=${T.giorno} @change=${(e: Event) => componi(m, Number((e.target as HTMLSelectElement).value))}>
        ${Array.from({ length: 31 }, (_, i) => i + 1).map((n) => html`<option value=${n} ?selected=${n === g}>${n}</option>`)}
      </select>
      <select aria-label=${T.mese} @change=${(e: Event) => componi(Number((e.target as HTMLSelectElement).value), g)}>
        ${MESI.map((nome, i) => html`<option value=${i + 1} ?selected=${i + 1 === m}>${nome}</option>`)}
      </select>
    </div>`;
  }

  private _editorPeriodo(p: Periodo) {
    const segmento = (tipo: Periodo["tipo"], testo: string) =>
      html`<button class=${p.tipo === tipo ? "attivo" : ""} @click=${() => p.tipo !== tipo && this._imposta({ ...this._bozza!, periodo: PERIODI[tipo](this.lettura.oggi) })}>${testo}</button>`;
    return html`<div class="campo">
        <span class="etichetta">${T.periodo}</span>
        <div class="segmenti">${segmento("sempre", T.sempre)} ${segmento("annuale", T.annuale)} ${segmento("con_anno", T.conAnno)}</div>
      </div>
      ${p.tipo === "annuale"
        ? html`<div class="riga-campi">
            <div class="campo"><span class="etichetta">${T.dal}</span>${this._meseGiorno(p.dal, (v) => this._periodo({ dal: v }))}</div>
            <div class="campo"><span class="etichetta">${T.al}</span>${this._meseGiorno(p.al, (v) => this._periodo({ al: v }))}</div>
          </div>`
        : nothing}
      ${p.tipo === "con_anno"
        ? html`<div class="riga-campi">
            <div class="campo"><label>${T.dal}</label><input type="date" .value=${p.dal} @change=${(e: Event) => this._periodo({ dal: (e.target as HTMLInputElement).value })} /></div>
            <div class="campo"><label>${T.al}</label><input type="date" .value=${p.al} @change=${(e: Event) => this._periodo({ al: (e.target as HTMLInputElement).value })} /></div>
          </div>`
        : nothing}`;
  }

  private _editor() {
    const b = this._bozza;
    if (!b) return nothing;
    const tipologia = this.lettura.configurazione.tipologie.find((t) => t.id === b.tipologia);
    const esistente = this.lettura.configurazione.regole.some((r) => r.id === b.id);
    return html`<rd-finestra aperta titolo=${`${esistente ? T.modifica : T.nuovaRegola} · ${tipologia?.nome ?? ""}`} @chiudi=${() => (this._bozza = undefined)}>
      <div class="modulo">
        <div class="campo">
          <label for="nome">${T.nomeRegola}</label>
          <input id="nome" maxlength="40" .value=${b.nome} placeholder=${T.nomeRegolaAiuto} @input=${(e: InputEvent) => (this._bozza = { ...b, nome: (e.target as HTMLInputElement).value })} />
        </div>
        ${this._editorRicorrenza(b.ricorrenza)} ${this._editorPeriodo(b.periodo)}
        <div class="campo">
          <span class="etichetta">${T.prossimeDate}</span>
          ${this._problemi.length
            ? html`<div class="errori">${this._problemi.map((p) => html`<div>${messaggioProblema(p)}</div>`)}</div>`
            : this._date.length
              ? html`<div class="anteprima-date">${this._date.map((d) => html`<span>${dataBreve(d)}</span>`)}</div>`
              : html`<div class="aiuto">${T.nessunaData}</div>`}
        </div>
        <div class="azioni-modulo">
          ${esistente ? html`<button class="bottone pericolo" @click=${this._elimina}>${T.elimina}</button>` : nothing}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => (this._bozza = undefined)}>${T.annulla}</button>
          <button class="bottone primario" ?disabled=${this._problemi.length > 0} @click=${() => proponi(this, this._candidata())}>${T.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
  }

  override render() {
    const c = this.lettura.configurazione;
    return html`<div class="riquadro">
        <h2>${T.pagine.regole}</h2>
        <p class="aiuto">${T.aiutoRegole}</p>
        ${c.tipologie.map((t) => {
          const regole = c.regole.filter((r) => r.tipologia === t.id);
          return html`<section class="gruppo">
            <div class="titolo">${chip(t)}</div>
            ${regole.length
              ? regole.map(
                  (r) => html`<div class="voce">
                    <div class="frase">
                      ${r.nome ? html`<b>${r.nome}</b> · ` : nothing}${fraseRicorrenza(r.ricorrenza)}
                      <small>${frasePeriodo(r.periodo)}</small>
                    </div>
                    <button class="bottone piccolo" @click=${() => this._imposta(copia(r))}>${T.modifica}</button>
                  </div>`,
                )
              : html`<div class="vuoto">${T.nessunaRegola}</div>`}
            <button class="bottone piccolo" @click=${() => this._nuova(t.id)}><ha-icon icon="mdi:plus"></ha-icon>${T.nuovaRegola}</button>
          </section>`;
        })}
      </div>
      ${this._editor()}`;
  }

  static override styles = [
    base,
    pagina,
    moduli,
    css`
      .gruppo {
        padding: 12px 0 16px;
        border-top: 1px solid var(--rd-bordo);
      }
      .gruppo:first-of-type {
        border-top: 0;
      }
      .titolo {
        margin-bottom: 8px;
      }
      .bottone ha-icon {
        --mdc-icon-size: 16px;
      }
      .calendario {
        display: grid;
        grid-template-columns: repeat(7, 42px);
      }
    `,
  ];
}

if (!customElements.get("rd-regole")) customElements.define("rd-regole", RdRegole);
