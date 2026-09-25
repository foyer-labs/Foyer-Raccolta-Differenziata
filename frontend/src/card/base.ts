// La base delle tre card (SPEC §10.2): legge i ritiri dal backend e si aggiorna a
// ogni ricalcolo, senza interrogare a intervalli. Una card non decide nulla: per
// confermare manda un comando, e il backend risponde con il nuovo stato.
import { LitElement, css, html, type PropertyValues } from "lit";

import { base, testoSu } from "../comune/stili";
import { simbolo } from "../comune/simbolo";
import { T } from "../comune/testi";
import type { HomeAssistant, LetturaRitiri, Ritiro } from "../comune/tipi";

export const DOMINIO = "foyer_raccolta_differenziata";

export interface ConfigCard {
  type: string;
  titolo?: string;
  inizio?: "oggi" | "lunedi";
}

export type TipologiaCard = LetturaRitiri["tipologie"][number];

export abstract class CardRaccolta extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _dati: { state: true },
    _errore: { state: true },
  };

  hass!: HomeAssistant;
  protected _config!: ConfigCard;
  protected _dati?: LetturaRitiri;
  protected _errore = false;
  private _disiscrivi?: Promise<() => void>;
  private _connessa = false;
  private _minuto?: number;

  setConfig(config: ConfigCard) {
    this._config = { ...config };
  }

  /** L'intervallo di date da leggere, in base a "oggi" del backend. */
  protected abstract intervallo(oggi: string): [string, string];

  override connectedCallback() {
    super.connectedCallback();
    this._connessa = true;
    // Le finestre si aprono e si chiudono: una volta al minuto si ridisegna, senza
    // rileggere nulla.
    this._minuto = window.setInterval(() => this.requestUpdate(), 60_000);
    if (this.hass) this._avvia();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._connessa = false;
    clearInterval(this._minuto);
    this._disiscrivi?.then((f) => f()).catch(() => undefined);
    this._disiscrivi = undefined;
  }

  protected override willUpdate(cambiati: PropertyValues) {
    if (cambiati.has("hass") && this.hass && this._connessa && !this._disiscrivi) this._avvia();
  }

  private _avvia() {
    this._disiscrivi = this.hass.connection
      .subscribeMessage(() => void this.carica(), { type: `${DOMINIO}/iscriviti` })
      .catch(() => {
        this._errore = true;
        return () => undefined;
      });
    void this.carica();
  }

  protected async carica(oggi?: string): Promise<void> {
    try {
      const giorno = oggi ?? this._dati?.oggi ?? new Date().toISOString().slice(0, 10);
      const [dal, al] = this.intervallo(giorno);
      const dati = await this.hass.callWS<LetturaRitiri>({ type: `${DOMINIO}/ritiri`, dal, al });
      // Il primo giorno lo decide il backend: se "oggi" non era quello giusto, si rilegge.
      if (!oggi && dati.oggi !== giorno) return this.carica(dati.oggi);
      this._dati = dati;
      this._errore = !dati.disponibile;
    } catch {
      this._errore = true;
    }
  }

  protected tipologia(id: string): TipologiaCard | undefined {
    return this._dati?.tipologie.find((t) => t.id === id);
  }

  protected confermato(r: Ritiro) {
    return this._dati?.conferme.find((c) => c.data === r.data && c.tipologia === r.tipologia);
  }

  protected async conferma(data: string, tipologie: string[]) {
    await this.hass.callWS({ type: `${DOMINIO}/conferma`, data, tipologie });
  }

  protected async annulla(data: string, tipologie: string[]) {
    for (const tipologia of tipologie) {
      await this.hass.callWS({ type: `${DOMINIO}/annulla_conferma`, data, tipologia }).catch(() => undefined);
    }
  }

  protected intestazione(titolo: string, sotto?: string) {
    return html`<div class="intestazione">
      <span class="simbolo">${simbolo}</span><b>${this._config?.titolo || titolo}</b>
      ${sotto ? html`<span class="sotto">${sotto}</span>` : ""}
    </div>`;
  }

  protected banner() {
    const s = this._dati?.sospeso;
    if (!s) return "";
    if (s.fino_al) return html`<div class="banner"><ha-icon icon="mdi:bell-off-outline"></ha-icon>${T.card.sospesiFino(dataBrevissima(s.fino_al))}</div>`;
    if (s.manuale) return html`<div class="banner"><ha-icon icon="mdi:bell-off-outline"></ha-icon>${T.card.sospesi}</div>`;
    return "";
  }

  protected nonDisponibile() {
    return html`<ha-card><div class="vuota">${T.card.nonDisponibile}</div></ha-card>`;
  }

  static stiliComuni = [
    base,
    css`
      ha-card {
        overflow: hidden;
        height: 100%;
      }
      .intestazione {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px 6px;
      }
      .simbolo {
        width: 26px;
        height: 26px;
        flex: none;
      }
      .intestazione b {
        font-size: 16px;
        font-weight: 600;
      }
      .intestazione .sotto {
        margin-left: auto;
        color: var(--rd-testo-2);
        font-size: 13px;
        text-align: right;
      }
      .banner {
        margin: 0 12px 12px;
        border-radius: 10px;
        padding: 8px 12px;
        font-size: 13px;
        background: var(--rd-superficie-2);
        color: var(--rd-testo-2);
        display: flex;
        gap: 8px;
        align-items: center;
        --mdc-icon-size: 18px;
      }
      .banner.avviso {
        background: color-mix(in srgb, var(--rd-avviso) 14%, transparent);
        color: var(--rd-avviso);
      }
      .vuota {
        padding: 20px 16px;
        color: var(--rd-testo-2);
        text-align: center;
      }
    `,
  ];
}

export const dataBrevissima = (iso: string): string => {
  const [, m, g] = iso.split("-").map(Number);
  return `${g}/${String(m).padStart(2, "0")}`;
};

export const coloreTesto = testoSu;

/** Registra la card nel selettore delle card di Home Assistant. */
export function registra(tipo: string, nome: string, descrizione: string) {
  const w = window as unknown as { customCards?: unknown[] };
  w.customCards = w.customCards ?? [];
  if (!(w.customCards as { type: string }[]).some((c) => c.type === tipo)) {
    w.customCards.push({ type: tipo, name: nome, description: descrizione, preview: true, documentationURL: "https://github.com/foyer-labs/Foyer-Raccolta-Differenziata" });
  }
}
