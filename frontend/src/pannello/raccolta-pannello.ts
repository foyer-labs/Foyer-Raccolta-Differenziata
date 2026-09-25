// Il pannello della raccolta (SPEC §10.1): testata, schede, pagine, e il percorso
// unico del salvataggio — anteprima, "Prima di salvare", salvataggio con la
// revisione letta (decisione 36). La validazione vera è nel backend.
import { LitElement, css, html, nothing } from "lit";

import { chip } from "../comune/chip";
import { dataBreve, messaggioProblema, T } from "../comune/testi";
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
} from "../comune/tipi";
import type { Precompila } from "./contesto";
import "./pagine/panoramica";
import "./pagine/tipologie";
import "./pagine/regole";
import "./pagine/eccezioni";
import "./pagine/promemoria";
import "./pagine/impostazioni";

const DOMINIO = "foyer_raccolta_differenziata";
const PAGINE = ["panoramica", "tipologie", "regole", "eccezioni", "promemoria", "impostazioni"] as const;
type Pagina = (typeof PAGINE)[number];

interface InAttesa {
  candidata: Configurazione;
  anteprima: Anteprima;
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
    if (cambiati.has("hass") && this.hass && !this._lettura && !this._errore) {
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
      this._errore = T.nonCaricata;
    }
  }

  private _mostraAvviso(testo: string) {
    this._avviso = testo;
    clearTimeout(this._timerAvviso);
    this._timerAvviso = window.setTimeout(() => (this._avviso = undefined), 4000);
  }

  private async _proponi(e: CustomEvent<Configurazione>) {
    e.stopPropagation();
    const candidata = e.detail;
    const anteprima = await this.hass.callWS<Anteprima>({
      type: `${DOMINIO}/anteprima`,
      configurazione: candidata,
    });
    this._problemi = anteprima.problemi;
    this._inAttesa = { candidata, anteprima };
  }

  private async _salva() {
    if (!this._inAttesa || !this._lettura) return;
    const esito = await this.hass.callWS<EsitoSalvataggio>({
      type: `${DOMINIO}/config/salva`,
      configurazione: this._inAttesa.candidata,
      revisione: this._lettura.revisione,
    });
    if (esito.salvato) {
      this._inAttesa = undefined;
      this._problemi = [];
      await this._carica();
      this._mostraAvviso(T.salvato);
      this._chiudiEditor();
      return;
    }
    if (esito.problemi.some((p) => p.codice === "revisione_superata")) {
      this._inAttesa = undefined;
      await this._carica();
      this._mostraAvviso(T.altroHaSalvato);
      return;
    }
    this._problemi = esito.problemi;
  }

  private _chiudiEditor() {
    // Le pagine chiudono il loro modulo quando la configurazione cambia.
    this.renderRoot.querySelector<HTMLElement & { chiudiEditor?: () => void }>(".pagina > *")?.chiudiEditor?.();
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
    return html`<rd-finestra aperta titolo=${T.primaDiSalvare} @chiudi=${() => (this._inAttesa = undefined)}>
      ${this._problemi.length
        ? html`<div class="errori">
            ${T.nonSalvato}
            <ul>
              ${this._problemi.map((p) => html`<li>${messaggioProblema(p)}</li>`)}
            </ul>
          </div>`
        : html`<p class="aiuto">${voci.length ? T.cosaCambia : T.nienteCambia}</p>
            <div class="differenze">${voci.slice(0, 40).map((v) => riga(v.segno, v))}</div>`}
      <div class="azioni-finestra">
        <button class="bottone" @click=${() => (this._inAttesa = undefined)}>${T.annulla}</button>
        ${this._problemi.length
          ? nothing
          : html`<button class="bottone primario" @click=${this._salva}>${T.salva}</button>`}
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
            @click=${() => {
              this._pagina = p;
              this._precompila = undefined;
            }}
          >
            ${T.pagine[p]}
          </button>`,
        )}
      </nav>
      <main
        class="pagina"
        @proponi=${this._proponi}
        @naviga=${this._naviga}
        @ricarica=${() => void this._carica()}
      >
        ${this._errore
          ? html`<div class="vuoto">${this._errore}</div>`
          : this._lettura
            ? this._paginaCorrente()
            : html`<div class="vuoto">${T.carica}</div>`}
      </main>
      ${this._finestraSalvataggio()}
      ${this._avviso ? html`<div class="avviso" role="status">${this._avviso}</div>` : nothing}
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
        margin-top: 16px;
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
      .avviso {
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

if (!customElements.get("foyer-raccolta-pannello")) customElements.define("foyer-raccolta-pannello", RaccoltaPannello);
