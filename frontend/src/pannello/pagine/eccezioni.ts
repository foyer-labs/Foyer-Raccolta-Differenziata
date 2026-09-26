// Eccezioni (SPEC §4.3, §10.1): aggiungi, togli, sposta, in ordine di data.
import { LitElement, css, html, nothing } from "lit";

import { chip, nuovoId } from "../../comune/chip";
import { base, moduli, pagina } from "../../comune/stili";
import { dataBreve, messaggioProblema, T } from "../../comune/testi";
import type { Anteprima, Eccezione, HomeAssistant, LetturaConfigurazione, Problema } from "../../comune/tipi";
import { avvisa, copia, proponi, type Precompila } from "../contesto";
import "../../comune/finestra";
import { definisci } from "../../comune/definisci";

const DOMINIO = "foyer_raccolta_differenziata";
type Tipo = Eccezione["tipo"];

const partenza = (e: Eccezione): string => (e.tipo === "sposta" ? e.da : e.data);

export class RdEccezioni extends LitElement {
  static override properties = {
    hass: { attribute: false },
    lettura: { attribute: false },
    precompila: { attribute: false },
    _bozza: { state: true },
    _problemi: { state: true },
    _passate: { state: true },
  };

  hass!: HomeAssistant;
  lettura!: LetturaConfigurazione;
  precompila?: Precompila;
  private _bozza?: Eccezione;
  private _problemi: Problema[] = [];
  private _passate = false;

  chiudiEditor() {
    this._bozza = undefined;
  }

  // La richiesta di precompilazione già usata. Il pannello ripassa lo stesso oggetto a
  // ogni suo ridisegno (Lit riassegna sempre le proprietà che sono oggetti), cioè a
  // ogni cambio di stato in Home Assistant: senza questo controllo il modulo annullato
  // si riapriva da solo. Una richiesta nuova è sempre un oggetto nuovo.
  private _usata?: Precompila;

  override updated(cambiati: Map<string, unknown>) {
    if (cambiati.has("precompila") && this.precompila && this.precompila !== this._usata) {
      this._usata = this.precompila;
      const p = this.precompila;
      this._nuova(p.tipo, p.tipologia, p.data);
      // Usata: il pannello la dimentica, così non torna nemmeno ricreando la pagina.
      this.dispatchEvent(new CustomEvent("precompilata", { bubbles: true, composed: true }));
    }
  }

  private _nuova(tipo: Tipo, tipologia?: string, data?: string) {
    const t = tipologia ?? this.lettura.configurazione.tipologie[0]?.id ?? "";
    const giorno = data ?? this.lettura.oggi;
    this._bozza =
      tipo === "sposta"
        ? { id: nuovoId(), tipo, tipologia: t, da: giorno, a: giorno, nota: "" }
        : { id: nuovoId(), tipo, tipologia: t, data: giorno, nota: "" };
    this._problemi = [];
  }

  private _candidata() {
    const nuova = copia(this.lettura.configurazione);
    const i = nuova.eccezioni.findIndex((e) => e.id === this._bozza!.id);
    const eccezione = { ...this._bozza!, nota: (this._bozza!.nota ?? "").trim() } as Eccezione;
    if (i >= 0) nuova.eccezioni[i] = eccezione;
    else nuova.eccezioni.push(eccezione);
    nuova.eccezioni.sort((a, b) => partenza(a).localeCompare(partenza(b)));
    return nuova;
  }

  private _esisteva = false;
  private _salvando = false;

  override willUpdate(cambiati: Map<string, unknown>) {
    if (cambiati.has("_bozza") && this._bozza && !cambiati.get("_bozza"))
      this._esisteva = this.lettura.configurazione.eccezioni.some((e) => e.id === this._bozza!.id);
  }

  private async _salva() {
    if (this._salvando) return;
    const bozza = this._bozza;
    if (this._esisteva && !this.lettura.configurazione.eccezioni.some((e) => e.id === bozza?.id)) {
      avvisa(this, T.eliminatoNelFrattempo);
      this._bozza = undefined;
      return;
    }
    const candidata = this._candidata();
    // Un controllo prima della finestra "Prima di salvare", per mostrare l'errore
    // accanto al campo che lo causa.
    this._salvando = true;
    let anteprima: Anteprima;
    try {
      anteprima = await this.hass.callWS<Anteprima>({ type: `${DOMINIO}/anteprima`, configurazione: candidata });
    } catch {
      avvisa(this, T.erroreConnessione);
      return;
    } finally {
      this._salvando = false;
    }
    // Annullata o cambiata mentre si aspettava: niente "Prima di salvare".
    if (this._bozza !== bozza) return;
    // Solo i problemi di questa eccezione: quelli di altre sezioni non si correggono qui.
    const indice = candidata.eccezioni.findIndex((e) => e.id === bozza!.id);
    this._problemi = anteprima.problemi.filter((p) => p.percorso.startsWith(`eccezioni[${indice}]`) || p.percorso === "eccezioni");
    if (!this._problemi.length) proponi(this, candidata);
  }

  private _elimina() {
    const nuova = copia(this.lettura.configurazione);
    nuova.eccezioni = nuova.eccezioni.filter((e) => e.id !== this._bozza!.id);
    proponi(this, nuova);
  }

  private _aggiorna(parziale: Record<string, string>) {
    this._bozza = { ...this._bozza!, ...parziale } as Eccezione;
  }

  private _data(etichetta: string, chiave: string, valore: string) {
    return html`<div class="campo">
      <label>${etichetta}</label>
      <input type="date" .value=${valore} @change=${(e: Event) => this._aggiorna({ [chiave]: (e.target as HTMLInputElement).value })} />
    </div>`;
  }

  private _editor() {
    const b = this._bozza;
    if (!b) return nothing;
    const esistente = this.lettura.configurazione.eccezioni.some((e) => e.id === b.id);
    const titoli: Record<Tipo, string> = { aggiungi: T.aggiungiRitiro, togli: T.togliRitiro, sposta: T.spostaRitiro };
    return html`<rd-finestra aperta titolo=${titoli[b.tipo]} @chiudi=${() => (this._bozza = undefined)}>
      <div class="modulo">
        <div class="campo">
          <span class="etichetta">${T.tipologia}</span>
          <div class="scelta-tipologie">
            ${this.lettura.configurazione.tipologie.map(
              (t) => html`<button class=${t.id === b.tipologia ? "attivo" : ""} @click=${() => this._aggiorna({ tipologia: t.id })}>${chip(t)}</button>`,
            )}
          </div>
        </div>
        ${b.tipo === "sposta"
          ? html`<div class="riga-campi">${this._data(T.da, "da", b.da)} ${this._data(T.a, "a", b.a)}</div>`
          : this._data(T.data, "data", b.data)}
        <div class="campo">
          <label for="nota">${T.nota}</label>
          <input id="nota" maxlength="200" .value=${b.nota ?? ""} @input=${(e: InputEvent) => this._aggiorna({ nota: (e.target as HTMLInputElement).value })} />
        </div>
        ${this._problemi.length
          ? html`<div class="errori">${this._problemi.map((p) => html`<div>${messaggioProblema(p)}</div>`)}</div>`
          : nothing}
      </div>
      <div class="azioni-modulo" slot="azioni">
        ${esistente ? html`<button class="bottone pericolo" @click=${this._elimina}>${T.elimina}</button>` : nothing}
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => (this._bozza = undefined)}>${T.annulla}</button>
        <button class="bottone primario" @click=${this._salva}>${T.salva}</button>
      </div>
    </rd-finestra>`;
  }

  private _riga(e: Eccezione) {
    const t = this.lettura.configurazione.tipologie.find((x) => x.id === e.tipologia);
    const quando = e.tipo === "sposta" ? html`${dataBreve(e.da)} → ${dataBreve(e.a)}` : dataBreve(e.data);
    return html`<button class="voce cliccabile" aria-label=${T.modifica} @click=${() => ((this._bozza = copia(e)), (this._problemi = []))}>
      <div class="frase">
        <span class="testa-eccezione"><span class="badge ${e.tipo}">${T.tipoEccezione[e.tipo]}</span>${t ? chip(t) : nothing}</span>
        <b>${quando}</b>${e.nota ? html`<small>${e.nota}</small>` : nothing}
      </div>
      <ha-icon class="freccia" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
    </button>`;
  }

  override render() {
    const tutte = this.lettura.configurazione.eccezioni;
    const oggi = this.lettura.oggi;
    const arrivo = (e: Eccezione) => (e.tipo === "sposta" ? (e.a > e.da ? e.a : e.da) : e.data);
    const future = tutte.filter((e) => arrivo(e) >= oggi);
    const passate = tutte.filter((e) => arrivo(e) < oggi);
    return html`<div class="riquadro">
        <h2>${T.pagine.eccezioni} <span class="conta">${future.length}</span></h2>
        <p class="aiuto">${T.aiutoEccezioni}</p>
        ${future.length ? future.map((e) => this._riga(e)) : html`<div class="vuoto">${T.nessunaEccezione}</div>`}
        <div class="riga-azioni">
          <button class="bottone primario" @click=${() => this._nuova("aggiungi")}><ha-icon icon="mdi:plus"></ha-icon>${T.aggiungiRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("togli")}><ha-icon icon="mdi:minus"></ha-icon>${T.togliRitiro}</button>
          <button class="bottone" @click=${() => this._nuova("sposta")}><ha-icon icon="mdi:arrow-right"></ha-icon>${T.spostaRitiro}</button>
        </div>
        ${passate.length
          ? html`<details @toggle=${(e: Event) => (this._passate = (e.target as HTMLDetailsElement).open)}>
              <summary>${T.passate} (${passate.length})</summary>
              ${this._passate ? passate.map((e) => this._riga(e)) : nothing}
            </details>`
          : nothing}
      </div>
      ${this._editor()}`;
  }

  static override styles = [
    base,
    pagina,
    moduli,
    css`
      .testa-eccezione {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 4px;
      }
      .badge {
        font-size: 11.5px;
        font-weight: 700;
        border-radius: 6px;
        padding: 2px 8px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .badge.aggiungi {
        background: color-mix(in srgb, var(--rd-ok) 18%, transparent);
        color: var(--rd-ok);
      }
      .badge.togli {
        background: color-mix(in srgb, var(--rd-errore) 16%, transparent);
        color: var(--rd-errore);
      }
      .badge.sposta {
        background: color-mix(in srgb, var(--rd-primario) 16%, transparent);
        color: var(--rd-primario);
      }
      .bottone ha-icon {
        --mdc-icon-size: 18px;
      }
      .scelta-tipologie {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .scelta-tipologie button {
        border: 2px solid transparent;
        background: none;
        border-radius: 999px;
        padding: 2px;
        cursor: pointer;
        opacity: 0.55;
      }
      .scelta-tipologie button.attivo {
        border-color: var(--rd-primario);
        opacity: 1;
      }
      details {
        margin-top: 16px;
      }
      summary {
        cursor: pointer;
        color: var(--rd-testo-2);
        margin-bottom: 8px;
      }
    `,
  ];
}

definisci("rd-eccezioni", RdEccezioni);
