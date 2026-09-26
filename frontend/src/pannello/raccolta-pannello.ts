// Il pannello della raccolta (SPEC §10.1): testata, schede, pagine, e il percorso
// unico del salvataggio — anteprima, "Prima di salvare", salvataggio con la
// revisione letta (decisione 36). La validazione vera è nel backend.
import { LitElement, css, html, nothing } from "lit";

import { chip } from "../comune/chip";
import { dataBreve, fraseRiepilogo, luogoProblema, messaggioProblema, T } from "../comune/testi";
import { base } from "../comune/stili";
import { simbolo } from "../comune/simbolo";
import "../comune/finestra";
import type {
  Anteprima,
  Configurazione,
  EsitoSalvataggio,
  HomeAssistant,
  LetturaConfigurazione,
  Problema,
  Riepilogo,
} from "../comune/tipi";
import type { PaginaPannello, Precompila, Proposta } from "./contesto";
import "./pagine/panoramica";
import "./pagine/tipologie";
import "./pagine/regole";
import "./pagine/eccezioni";
import "./pagine/promemoria";
import "./pagine/piattaforma";
import "./pagine/impostazioni";
import { definisci } from "../comune/definisci";

const DOMINIO = "foyer_raccolta_differenziata";
const PAGINE = ["panoramica", "tipologie", "regole", "eccezioni", "promemoria", "piattaforma", "impostazioni"] as const;
type Pagina = (typeof PAGINE)[number];

interface InAttesa {
  candidata: Configurazione;
  anteprima: Anteprima;
  riepilogo?: Riepilogo;
  avviso?: string;
}

export class RaccoltaPannello extends LitElement {
  static override properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _lettura: { state: true },
    _errore: { state: true },
    _pagina: { state: true },
    _inAttesa: { state: true },
    _problemi: { state: true },
    _avviso: { state: true },
    _precompila: { state: true },
    _occupato: { state: true },
    _paginaChiesta: { state: true },
  };

  hass!: HomeAssistant;
  narrow = false;

  private _lettura?: LetturaConfigurazione;
  private _errore?: string;
  private _pagina: Pagina = "panoramica";
  private _inAttesa?: InAttesa;
  private _problemi: Problema[] = [];
  private _avviso?: string;
  private _precompila?: Precompila;
  private _disiscrivi?: Promise<() => void>;
  private _timerAvviso?: number;
  private _occupato = false;
  /** La scheda chiesta mentre la pagina aveva modifiche non salvate. */
  private _paginaChiesta?: Pagina;
  /** Solo l'ultima proposta conta: una risposta lenta non riapre "Prima di salvare". */
  private _proposta = 0;

  override connectedCallback() {
    super.connectedCallback();
    const pagina = new URLSearchParams(location.search).get("pagina") as Pagina | null;
    if (pagina && PAGINE.includes(pagina)) this._pagina = pagina;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._disiscrivi?.then((f) => f()).catch(() => undefined);
    this._disiscrivi = undefined;
  }

  override updated(cambiati: Map<string, unknown>) {
    // L'avviso sta nello strato alto, sopra le finestre aperte (che sono <dialog>
    // modali): senza, resterebbe dietro il velo di "Prima di salvare".
    const avviso = this.renderRoot.querySelector<HTMLElement & { showPopover?: () => void }>(".avviso");
    if (avviso?.showPopover && !avviso.matches(":popover-open")) avviso.showPopover();
    if (cambiati.has("_pagina")) {
      this.renderRoot
        .querySelector<HTMLElement>(".schede button.attiva")
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    // Una sola iscrizione per volta: `_disiscrivi` c'è dal momento in cui la si chiede,
    // non da quando arriva la prima lettura. Riconnesso, il pannello si riscrive.
    if (cambiati.has("hass") && this.hass && !this._disiscrivi) {
      void this._carica();
      this._disiscrivi = this.hass.connection
        .subscribeMessage(() => void this._carica(), { type: `${DOMINIO}/iscriviti` })
        .catch(() => () => undefined);
    }
  }

  private async _carica() {
    try {
      this._lettura = await this.hass.callWS<LetturaConfigurazione>({ type: `${DOMINIO}/config/leggi` });
      this._errore = undefined;
    } catch {
      // Con una lettura già valida la pagina resta com'è, con le sue bozze: una
      // rilettura fallita (Home Assistant che si riavvia) non deve buttarle via.
      if (this._lettura) this._mostraAvviso(T.erroreConnessione);
      else this._errore = T.nonCaricata;
    }
  }

  private get _paginaAperta(): PaginaPannello | null {
    return this.renderRoot.querySelector<PaginaPannello>(".pagina > *");
  }

  private _vaiA(p: Pagina) {
    if (p !== this._pagina && this._paginaAperta?.haModifiche?.()) {
      this._paginaChiesta = p;
      return;
    }
    this._pagina = p;
    this._precompila = undefined;
  }

  private _annullaProposta() {
    if (this._occupato) return;
    this._inAttesa = undefined;
    this._problemi = [];
    this._paginaAperta?.propostaAnnullata?.();
  }

  private _mostraAvviso(testo: string) {
    this._avviso = testo;
    clearTimeout(this._timerAvviso);
    this._timerAvviso = window.setTimeout(() => (this._avviso = undefined), 4000);
  }


  private async _proponi(e: CustomEvent<Proposta>) {
    e.stopPropagation();
    if (this._inAttesa) return; // un doppio clic su Salva non apre due proposte
    const { configurazione: candidata, riepilogo, avviso } = e.detail;
    const numero = ++this._proposta;
    try {
      const anteprima = await this.hass.callWS<Anteprima>({
        type: `${DOMINIO}/anteprima`,
        configurazione: candidata,
      });
      if (numero !== this._proposta) return;
      this._problemi = anteprima.problemi;
      this._inAttesa = { candidata, anteprima, riepilogo, avviso };
    } catch {
      if (numero === this._proposta) this._mostraAvviso(T.erroreConnessione);
    }
  }

  private async _salva() {
    if (!this._inAttesa || this._occupato) return;
    this._occupato = true;
    let esito: EsitoSalvataggio;
    try {
      esito = await this.hass.callWS<EsitoSalvataggio>({
        type: `${DOMINIO}/config/salva`,
        configurazione: this._inAttesa.candidata,
        // La revisione su cui la modifica è stata costruita, non quella di adesso:
        // se nel frattempo un altro ha salvato, il backend deve rifiutare.
        revisione: this._inAttesa.candidata.revisione,
      });
    } catch {
      this._mostraAvviso(T.erroreConnessione);
      return;
    } finally {
      this._occupato = false;
    }
    if (esito.salvato) {
      // Prima si chiude il modulo della pagina, poi "Prima di salvare": altrimenti
      // il modulo ricompare per un attimo, con Salva attivo, mentre si rilegge.
      this._chiudiEditor();
      this._inAttesa = undefined;
      this._problemi = [];
      await this._carica();
      this._mostraAvviso(T.salvato);
      return;
    }
    if (esito.problemi.some((p) => p.codice === "revisione_superata")) {
      this._annullaProposta();
      await this._carica();
      this._mostraAvviso(T.altroHaSalvato);
      return;
    }
    this._problemi = esito.problemi;
  }

  private _chiudiEditor() {
    // Le pagine chiudono il loro modulo quando la configurazione cambia.
    this._paginaAperta?.chiudiEditor?.();
    this._precompila = undefined;
  }

  private _naviga(e: CustomEvent<{ pagina: Pagina; precompila?: Precompila }>) {
    this._pagina = e.detail.pagina;
    this._precompila = e.detail.precompila;
  }

  private _finestraSalvataggio() {
    const attesa = this._inAttesa;
    if (!attesa) return nothing;
    const tipologie = attesa.candidata.tipologie;
    const riga = (segno: "+" | "−", voce: { data: string; tipologia: string }) => {
      const t = tipologie.find((x) => x.id === voce.tipologia) ??
        this._lettura?.configurazione.tipologie.find((x) => x.id === voce.tipologia);
      return html`<div class="differenza">
        <span class="segno ${segno === "+" ? "piu" : "meno"}">${segno}</span>
        <b>${dataBreve(voce.data)}</b>
        ${t ? chip(t) : voce.tipologia}
      </div>`;
    };
    const { aggiunti, tolti } = attesa.anteprima.differenze;
    const voci = [
      ...aggiunti.map((v) => ({ ...v, segno: "+" as const })),
      ...tolti.map((v) => ({ ...v, segno: "−" as const })),
    ].sort((a, b) => a.data.localeCompare(b.data));
    const riepilogo = Object.entries(attesa.riepilogo ?? {})
      .map(([sezione, conti]) => fraseRiepilogo(sezione, conti))
      .filter((f): f is string => f !== null);
    return html`<rd-finestra aperta titolo=${T.primaDiSalvare} ?bloccata=${this._occupato} @chiudi=${this._annullaProposta}>
      ${attesa.avviso && !this._problemi.length ? html`<div class="attenzione">${attesa.avviso}</div>` : nothing}
      ${attesa.riepilogo && !this._problemi.length
        ? html`<div class="riepilogo">
            <b>${T.dalFile}</b>
            ${riepilogo.length ? html`<ul>${riepilogo.map((f) => html`<li>${f}</li>`)}</ul>` : html`<p>${T.nienteDalFile}</p>`}
          </div>`
        : nothing}
      ${this._problemi.length
        ? html`<div class="errori">
            ${T.nonSalvato}
            <ul>
              ${this._problemi.map((p) => {
                const luogo = luogoProblema(p, attesa.candidata);
                return html`<li>${luogo ? html`<b>${luogo}</b>: ` : nothing}${messaggioProblema(p)}</li>`;
              })}
            </ul>
          </div>`
        : html`<p class="aiuto">${voci.length ? T.cosaCambia : T.nienteCambia}</p>
            <div class="differenze">${voci.slice(0, 40).map((v) => riga(v.segno, v))}</div>`}
      <div class="azioni-finestra" slot="azioni">
        <button class="bottone" ?disabled=${this._occupato} @click=${this._annullaProposta}>${T.indietro}</button>
        ${this._problemi.length
          ? nothing
          : html`<button class="bottone primario" ?disabled=${this._occupato} @click=${this._salva}>${T.salva}</button>`}
      </div>
    </rd-finestra>`;
  }

  private _paginaCorrente() {
    const l = this._lettura!;
    switch (this._pagina) {
      case "tipologie":
        return html`<rd-tipologie .hass=${this.hass} .lettura=${l}></rd-tipologie>`;
      case "regole":
        return html`<rd-regole .hass=${this.hass} .lettura=${l}></rd-regole>`;
      case "eccezioni":
        return html`<rd-eccezioni .hass=${this.hass} .lettura=${l} .precompila=${this._precompila}></rd-eccezioni>`;
      case "promemoria":
        return html`<rd-promemoria .hass=${this.hass} .lettura=${l}></rd-promemoria>`;
      case "piattaforma":
        return html`<rd-piattaforma .hass=${this.hass} .lettura=${l}></rd-piattaforma>`;
      case "impostazioni":
        return html`<rd-impostazioni .hass=${this.hass} .lettura=${l}></rd-impostazioni>`;
      default:
        return html`<rd-panoramica .hass=${this.hass} .lettura=${l}></rd-panoramica>`;
    }
  }

  override render() {
    return html`
      <header class="testata">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <span class="simbolo">${simbolo}</span>
        <h1>${T.titolo}</h1>
      </header>
      <nav class="schede" role="tablist">
        ${PAGINE.map(
          (p) => html`<button
            role="tab"
            aria-selected=${p === this._pagina}
            class=${p === this._pagina ? "attiva" : ""}
            @click=${() => this._vaiA(p)}
          >
            ${T.pagine[p]}
          </button>`,
        )}
      </nav>
      <main
        class="pagina ${this._inAttesa ? "in-attesa" : ""}"
        @proponi=${this._proponi}
        @naviga=${this._naviga}
        @precompilata=${() => (this._precompila = undefined)}
        @ricarica=${() => void this._carica()}
        @avvisa=${(e: CustomEvent<string>) => this._mostraAvviso(e.detail)}
      >
        ${this._errore
          ? html`<div class="vuoto">${this._errore}</div>`
          : this._lettura
            ? this._paginaCorrente()
            : html`<div class="vuoto">${T.carica}</div>`}
      </main>
      ${this._finestraSalvataggio()}
      ${this._paginaChiesta
        ? html`<rd-finestra aperta titolo=${T.pagine[this._pagina]} @chiudi=${() => (this._paginaChiesta = undefined)}>
            <p>${T.modificheNonSalvate}</p>
            <div class="azioni-finestra" slot="azioni">
              <button class="bottone" @click=${() => (this._paginaChiesta = undefined)}>${T.restaQui}</button>
              <button class="bottone pericolo" @click=${() => {
                const p = this._paginaChiesta!;
                this._paginaChiesta = undefined;
                this._pagina = p;
                this._precompila = undefined;
              }}>${T.lascia}</button>
            </div>
          </rd-finestra>`
        : nothing}
      ${this._avviso ? html`<div class="avviso" role="status" popover="manual">${this._avviso}</div>` : nothing}
    `;
  }

  static override styles = [
    base,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color, #f3f4f6);
      }
      .testata {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 16px 0 4px;
        height: var(--header-height, 56px);
        background: var(--app-header-background-color, var(--rd-superficie));
        color: var(--app-header-text-color, var(--rd-testo));
        border-bottom: 1px solid var(--rd-bordo);
        position: sticky;
        top: 0;
        z-index: 3;
        box-sizing: border-box;
      }
      .simbolo {
        width: 30px;
        height: 30px;
        margin-left: 8px;
        flex: none;
      }
      h1 {
        font-size: 20px;
        margin: 0;
        font-weight: 400;
      }
      .schede {
        display: flex;
        gap: 4px;
        padding: 0 12px;
        background: var(--rd-superficie);
        border-bottom: 1px solid var(--rd-bordo);
        overflow-x: auto;
        position: sticky;
        top: var(--header-height, 56px);
        z-index: 3;
        scrollbar-width: none;
      }
      .schede button {
        border: 0;
        background: none;
        padding: 12px 14px;
        cursor: pointer;
        color: var(--rd-testo-2);
        border-bottom: 2px solid transparent;
        white-space: nowrap;
        font-weight: 500;
      }
      .schede button.attiva {
        color: var(--rd-primario);
        border-bottom-color: var(--rd-primario);
      }
      /* "Prima di salvare" sta sopra la finestra di modifica della pagina, che resta
         aperta per tornarci con "Indietro": intanto non si vede. Due finestre
         sovrapposte mostravano due "Annulla", e quello della finestra sotto chiudeva
         soltanto quella sopra. */
      main.in-attesa {
        --rd-visibilita-finestre: hidden;
      }
      main {
        max-width: 1080px;
        margin: 0 auto;
        padding: 20px 16px 96px;
      }
      .vuoto {
        text-align: center;
        color: var(--rd-testo-2);
        padding: 48px 16px;
      }
      .differenza {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 8px 0;
        border-top: 1px solid var(--rd-bordo);
      }
      .segno {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-weight: 700;
        color: #fff;
        flex: none;
      }
      .piu {
        background: var(--rd-ok);
      }
      .meno {
        background: var(--rd-errore);
      }
      .azioni-finestra {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      .riepilogo {
        background: color-mix(in srgb, var(--rd-primario) 8%, transparent);
        border-radius: 12px;
        padding: 10px 14px;
        margin-bottom: 8px;
      }
      .riepilogo ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .riepilogo p {
        margin: 4px 0 0;
      }
      .errori {
        background: color-mix(in srgb, var(--rd-errore) 12%, transparent);
        color: var(--rd-errore);
        border-radius: 10px;
        padding: 10px 12px;
      }
      .errori ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .attenzione {
        background: color-mix(in srgb, var(--rd-avviso) 14%, transparent);
        color: var(--rd-testo);
        border-radius: 12px;
        padding: 10px 14px;
        margin-bottom: 8px;
      }
      .avviso {
        /* Un popover: nello strato alto, sopra le finestre; non ruba i tocchi. */
        pointer-events: none;
        margin: 0;
        border: 0;
        inset: auto;
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        background: var(--rd-testo);
        color: var(--rd-superficie);
        padding: 10px 18px;
        border-radius: 12px;
        z-index: 30;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        max-width: calc(100vw - 32px);
      }
    `,
  ];
}

definisci("foyer-raccolta-pannello", RaccoltaPannello);
