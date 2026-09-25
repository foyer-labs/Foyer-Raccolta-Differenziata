// Promemoria (SPEC §4.7-§4.9, §10.1): profili, solleciti, vacanze.
import { LitElement, css, html, nothing } from "lit";

import { chip, nuovoId } from "../../comune/chip";
import { base, moduli, pagina } from "../../comune/stili";
import { fraseQuando, T } from "../../comune/testi";
import type { Destinatario, HomeAssistant, LetturaConfigurazione, Profilo, Quando } from "../../comune/tipi";
import { copia, proponi } from "../contesto";
import "../../comune/finestra";

// Servizi del dominio notify che non sono destinatari.
const NON_DESTINATARI = new Set(["send_message", "persistent_notification", "notify"]);
const MINUTI = [10, 15, 20, 30, 45, 60, 90, 120, 180, 240];

const QUANDO: Record<Quando["tipo"], () => Quando> = {
  giorni_prima: () => ({ tipo: "giorni_prima", giorni: 1, ora: "20:30" }),
  giorno_stesso: () => ({ tipo: "giorno_stesso", ora: "06:30" }),
  apertura: () => ({ tipo: "apertura" }),
};

const chiave = (d: Destinatario) => `${d.tipo}:${d.id}`;
const conPulsanti = (d: Destinatario) => d.tipo === "servizio" && d.id.startsWith("mobile_app_");

export class RdPromemoria extends LitElement {
  static override properties = {
    hass: { attribute: false },
    lettura: { attribute: false },
    _bozza: { state: true },
    _vacanza: { state: true },
  };

  hass!: HomeAssistant;
  lettura!: LetturaConfigurazione;
  private _bozza?: Profilo;
  private _vacanza = { dal: "", al: "" };

  chiudiEditor() {
    this._bozza = undefined;
    this._vacanza = { dal: "", al: "" };
  }

  /** Tutti i destinatari possibili: servizi notify e entità notify (decisione 31). */
  private _disponibili(): { destinatario: Destinatario; nome: string }[] {
    const servizi = Object.keys(this.hass.services?.notify ?? {})
      .filter((s) => !NON_DESTINATARI.has(s))
      .sort()
      .map((id) => ({ destinatario: { tipo: "servizio" as const, id }, nome: id.replace(/^mobile_app_/, "").replaceAll("_", " ") }));
    const entita = Object.keys(this.hass.states ?? {})
      .filter((e) => e.startsWith("notify."))
      .sort()
      .map((id) => ({
        destinatario: { tipo: "entita" as const, id },
        nome: String(this.hass.states[id].attributes.friendly_name ?? id),
      }));
    // Un destinatario già scelto ma sparito (app disinstallata) resta visibile.
    const note = new Set([...servizi, ...entita].map((v) => chiave(v.destinatario)));
    const spariti = (this._bozza?.destinatari ?? [])
      .filter((d) => !note.has(chiave(d)))
      .map((d) => ({ destinatario: d, nome: d.id }));
    return [...servizi, ...entita, ...spariti];
  }

  private _nuovo() {
    this._bozza = {
      id: nuovoId(),
      nome: "",
      attivo: true,
      quando: QUANDO.giorni_prima(),
      tipologie: null,
      destinatari: [],
    };
  }

  private _salvaProfilo() {
    const nuova = copia(this.lettura.configurazione);
    const profilo = { ...this._bozza!, nome: this._bozza!.nome.trim() };
    const i = nuova.promemoria.findIndex((p) => p.id === profilo.id);
    if (i >= 0) nuova.promemoria[i] = profilo;
    else nuova.promemoria.push(profilo);
    proponi(this, nuova);
  }

  private _eliminaProfilo() {
    const nuova = copia(this.lettura.configurazione);
    nuova.promemoria = nuova.promemoria.filter((p) => p.id !== this._bozza!.id);
    proponi(this, nuova);
  }

  private _attiva(profilo: Profilo) {
    const nuova = copia(this.lettura.configurazione);
    const p = nuova.promemoria.find((x) => x.id === profilo.id)!;
    p.attivo = !p.attivo;
    proponi(this, nuova);
  }

  private _solleciti(parziale: Partial<{ attivi: boolean; richiami: number; richiamo_dopo: number }>) {
    const nuova = copia(this.lettura.configurazione);
    nuova.solleciti = { ...nuova.solleciti, ...parziale };
    proponi(this, nuova);
  }

  private _aggiungiVacanza() {
    const { dal, al } = this._vacanza;
    if (!dal || !al) return;
    const nuova = copia(this.lettura.configurazione);
    nuova.sospensioni = [...nuova.sospensioni, { dal, al }].sort((a, b) => a.dal.localeCompare(b.dal));
    proponi(this, nuova);
  }

  private _togliVacanza(i: number) {
    const nuova = copia(this.lettura.configurazione);
    nuova.sospensioni = nuova.sospensioni.filter((_, j) => j !== i);
    proponi(this, nuova);
  }

  private _editor() {
    const b = this._bozza;
    if (!b) return nothing;
    const esistente = this.lettura.configurazione.promemoria.some((p) => p.id === b.id);
    const tipologie = this.lettura.configurazione.tipologie;
    const aggiorna = (parziale: Partial<Profilo>) => (this._bozza = { ...b, ...parziale });
    const q = b.quando;
    const segmento = (tipo: Quando["tipo"], testo: string) =>
      html`<button class=${q.tipo === tipo ? "attivo" : ""} @click=${() => q.tipo !== tipo && aggiorna({ quando: QUANDO[tipo]() })}>${testo}</button>`;
    const scelti = new Set(b.destinatari.map(chiave));
    const disponibili = this._disponibili();
    const valido = b.nome.trim() && b.destinatari.length && (b.tipologie === null || b.tipologie.length);
    return html`<rd-finestra aperta titolo=${esistente ? b.nome || T.nuovoPromemoria : T.nuovoPromemoria} @chiudi=${() => (this._bozza = undefined)}>
      <div class="modulo">
        <div class="campo">
          <label for="nome">${T.nomePromemoria}</label>
          <input id="nome" maxlength="40" placeholder=${T.nomePromemoriaAiuto} .value=${b.nome} @input=${(e: InputEvent) => aggiorna({ nome: (e.target as HTMLInputElement).value })} />
        </div>
        <div class="campo">
          <span class="etichetta">${T.quando}</span>
          <div class="segmenti">${segmento("giorni_prima", T.giorniPrima)} ${segmento("giorno_stesso", T.giornoStesso)} ${segmento("apertura", T.apertura)}</div>
          ${q.tipo === "apertura" ? html`<small>${T.aperturaAiuto}</small>` : nothing}
        </div>
        ${q.tipo === "giorni_prima"
          ? html`<div class="campo">
              <span class="etichetta">${T.quantiGiorni}</span>
              <div class="tonde">${[1, 2, 3, 4, 5, 6, 7].map((n) => html`<button class=${q.giorni === n ? "attivo" : ""} @click=${() => aggiorna({ quando: { ...q, giorni: n } })}>${n}</button>`)}</div>
            </div>`
          : nothing}
        ${q.tipo !== "apertura"
          ? html`<div class="campo">
              <label for="ora">${T.alle}</label>
              <input id="ora" type="time" .value=${q.ora} @change=${(e: Event) => aggiorna({ quando: { ...q, ora: (e.target as HTMLInputElement).value } })} />
            </div>`
          : nothing}
        <div class="campo">
          <span class="etichetta">${T.perQuali}</span>
          <div class="scelta">
            <button class="tutte ${b.tipologie === null ? "attivo" : ""}" @click=${() => aggiorna({ tipologie: b.tipologie === null ? tipologie.map((t) => t.id) : null })}>${T.tutte}</button>
            ${tipologie.map((t) => {
              const attiva = b.tipologie === null || b.tipologie.includes(t.id);
              return html`<button class=${attiva ? "attivo" : ""} @click=${() => {
                const attuali = b.tipologie ?? tipologie.map((x) => x.id);
                aggiorna({ tipologie: attuali.includes(t.id) ? attuali.filter((x) => x !== t.id) : [...attuali, t.id] });
              }}>${chip(t)}</button>`;
            })}
          </div>
          <small>${T.tutteAiuto}</small>
        </div>
        <div class="campo">
          <span class="etichetta">${T.destinatari}</span>
          ${disponibili.length
            ? html`<div class="destinatari">
                ${disponibili.map(({ destinatario, nome }) => html`<label class="destinatario">
                  <input type="checkbox" .checked=${scelti.has(chiave(destinatario))} @change=${(e: Event) => {
                    const acceso = (e.target as HTMLInputElement).checked;
                    aggiorna({ destinatari: acceso ? [...b.destinatari, destinatario] : b.destinatari.filter((d) => chiave(d) !== chiave(destinatario)) });
                  }} />
                  <ha-icon .icon=${conPulsanti(destinatario) ? "mdi:cellphone" : "mdi:message-text-outline"}></ha-icon>
                  <span class="nome">${nome}</span>
                  <span class="etichetta-tipo ${conPulsanti(destinatario) ? "pulsanti" : ""}">${conPulsanti(destinatario) ? T.conPulsanti : T.soloTesto}</span>
                </label>`)}
              </div>`
            : html`<div class="aiuto">${T.nessunDestinatario}</div>`}
          <small>${T.destinatariAiuto}</small>
        </div>
        <div class="azioni-modulo">
          ${esistente ? html`<button class="bottone pericolo" @click=${this._eliminaProfilo}>${T.elimina}</button>` : nothing}
          <span style="flex:1"></span>
          <button class="bottone" @click=${() => (this._bozza = undefined)}>${T.annulla}</button>
          <button class="bottone primario" ?disabled=${!valido} @click=${this._salvaProfilo}>${T.salva}</button>
        </div>
      </div>
    </rd-finestra>`;
  }

  private _riepilogo(p: Profilo) {
    const tipologie = this.lettura.configurazione.tipologie;
    const quali = p.tipologie === null ? T.tutte : p.tipologie.map((id) => tipologie.find((t) => t.id === id)?.nome ?? id).join(", ");
    const telefoni = p.destinatari.filter(conPulsanti).length;
    return html`${quali} · ${p.destinatari.length} ${p.destinatari.length === 1 ? "destinatario" : "destinatari"}${telefoni ? html` · ${telefoni} con pulsanti` : nothing}`;
  }

  override render() {
    const c = this.lettura.configurazione;
    const s = c.solleciti;
    return html`<div class="griglia-2">
        <div>
          <div class="riquadro">
            <h2>${T.pagine.promemoria} <span class="conta">${c.promemoria.length}</span></h2>
            <p class="aiuto">${T.aiutoPromemoria}</p>
            ${c.promemoria.length
              ? c.promemoria.map(
                  (p) => html`<div class="voce ${p.attivo ? "" : "spento"}">
                    <ha-icon class="campana" icon=${p.attivo ? "mdi:bell-ring-outline" : "mdi:bell-off-outline"}></ha-icon>
                    <div class="frase"><b>${p.nome}</b> · ${fraseQuando(p.quando)}<small>${this._riepilogo(p)}</small></div>
                    <button class="levetta ${p.attivo ? "acceso" : ""}" role="switch" aria-checked=${p.attivo} aria-label=${T.attivo} @click=${() => this._attiva(p)}></button>
                    <button class="bottone piccolo" @click=${() => (this._bozza = copia(p))}>${T.modifica}</button>
                  </div>`,
                )
              : html`<div class="vuoto">${T.nessunPromemoria}</div>`}
            <div class="riga-azioni">
              <button class="bottone primario" @click=${this._nuovo}><ha-icon icon="mdi:plus"></ha-icon>${T.nuovoPromemoria}</button>
            </div>
          </div>
          <div class="riquadro">
            <h2>${T.solleciti}</h2>
            <div class="interruttore">
              <div>${T.sollecitaSeNonConfermo}<small>${T.sollecitiAiuto}</small></div>
              <button class="levetta ${s.attivi ? "acceso" : ""}" role="switch" aria-checked=${s.attivi} aria-label=${T.sollecitaSeNonConfermo} @click=${() => this._solleciti({ attivi: !s.attivi })}></button>
            </div>
            ${s.attivi
              ? html`<div class="riga-campi">
                  <div class="campo">
                    <span class="etichetta">${T.richiami}</span>
                    <div class="segmenti">${[1, 2].map((n) => html`<button class=${s.richiami === n ? "attivo" : ""} @click=${() => this._solleciti({ richiami: n })}>${n}</button>`)}</div>
                  </div>
                  <div class="campo">
                    <label for="minuti">${T.ogniMinuti}</label>
                    <select id="minuti" @change=${(e: Event) => this._solleciti({ richiamo_dopo: Number((e.target as HTMLSelectElement).value) })}>
                      ${MINUTI.map((m) => html`<option value=${m} ?selected=${s.richiamo_dopo === m}>${T.minuti(m)}</option>`)}
                    </select>
                  </div>
                </div>`
              : nothing}
          </div>
        </div>
        <div class="riquadro">
          <h2>${T.vacanze}</h2>
          <p class="aiuto">${T.vacanzeAiuto}</p>
          ${c.sospensioni.length
            ? c.sospensioni.map(
                (v, i) => html`<div class="voce">
                  <ha-icon icon="mdi:beach"></ha-icon>
                  <div class="frase">${T.dalAl(v.dal, v.al)}</div>
                  <button class="bottone piccolo" @click=${() => this._togliVacanza(i)}>${T.togli}</button>
                </div>`,
              )
            : html`<div class="vuoto">${T.nessunaVacanza}</div>`}
          <div class="riga-campi vacanza">
            <div class="campo"><label>${T.dal}</label><input type="date" .value=${this._vacanza.dal} @change=${(e: Event) => (this._vacanza = { ...this._vacanza, dal: (e.target as HTMLInputElement).value })} /></div>
            <div class="campo"><label>${T.al}</label><input type="date" .value=${this._vacanza.al} @change=${(e: Event) => (this._vacanza = { ...this._vacanza, al: (e.target as HTMLInputElement).value })} /></div>
          </div>
          <div class="riga-azioni">
            <button class="bottone" ?disabled=${!this._vacanza.dal || !this._vacanza.al} @click=${this._aggiungiVacanza}><ha-icon icon="mdi:plus"></ha-icon>${T.aggiungiVacanza}</button>
          </div>
        </div>
      </div>
      ${this._editor()}`;
  }

  static override styles = [
    base,
    pagina,
    moduli,
    css`
      .voce.spento {
        opacity: 0.6;
      }
      .campana {
        color: var(--rd-primario);
      }
      .bottone ha-icon {
        --mdc-icon-size: 18px;
      }
      .interruttore {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 12px;
      }
      .interruttore small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 13px;
        margin-top: 2px;
      }
      .scelta {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .scelta button {
        border: 2px solid transparent;
        background: none;
        border-radius: 999px;
        padding: 2px;
        cursor: pointer;
        opacity: 0.45;
      }
      .scelta button.attivo {
        opacity: 1;
        border-color: var(--rd-primario);
      }
      .scelta .tutte {
        padding: 3px 12px;
        border: 1px solid var(--rd-bordo);
        font-weight: 600;
        font-size: 13px;
      }
      .scelta .tutte.attivo {
        background: var(--rd-primario);
        color: var(--text-primary-color, #fff);
      }
      .destinatari {
        display: grid;
        gap: 6px;
      }
      .destinatario {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border: 1px solid var(--rd-bordo);
        border-radius: 10px;
        cursor: pointer;
      }
      .destinatario input {
        width: auto;
      }
      .destinatario .nome {
        flex: 1;
        text-transform: capitalize;
      }
      .etichetta-tipo {
        font-size: 11.5px;
        color: var(--rd-testo-2);
        border: 1px solid var(--rd-bordo);
        border-radius: 6px;
        padding: 1px 6px;
      }
      .etichetta-tipo.pulsanti {
        color: var(--rd-primario);
        border-color: var(--rd-primario);
      }
      .vacanza {
        margin-top: 12px;
      }
    `,
  ];
}

if (!customElements.get("rd-promemoria")) customElements.define("rd-promemoria", RdPromemoria);
