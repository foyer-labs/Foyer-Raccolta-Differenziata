// La base delle tre card (SPEC §10.2): legge i ritiri dal backend e si aggiorna a
// ogni ricalcolo, senza interrogare a intervalli. Una card non decide nulla: per
// confermare manda un comando, e il backend risponde con il nuovo stato.
import { LitElement, css, html, nothing, type PropertyValues } from "lit";

import { chip } from "../comune/chip";
import "../comune/finestra";
import { base, testoSu } from "../comune/stili";
import { simbolo } from "../comune/simbolo";
import { aIso, daIso, giornoSettimana, piuGiorni } from "../comune/date";
import { fasceTesto, ora, statoPiattaforma, type DatiPiattaforma } from "../comune/piattaforma";
import { GIORNI, GIORNI_BREVI, T } from "../comune/testi";
import type { HomeAssistant, LetturaRitiri, Ritiro } from "../comune/tipi";
import { quandoPronto } from "../comune/definisci";

export const DOMINIO = "foyer_raccolta_differenziata";

export interface ConfigCard {
  type: string;
  titolo?: string;
  inizio?: "oggi" | "lunedi";
  /** false: nasconde l'indicatore della piattaforma ecologica (decisione 64). */
  piattaforma?: boolean;
}

type Finestra = { tipo: "note"; tipologia?: string } | { tipo: "piattaforma" };

export type TipologiaCard = LetturaRitiri["tipologie"][number];

export abstract class CardRaccolta extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _dati: { state: true },
    _errore: { state: true },
    _finestra: { state: true },
  };

  hass!: HomeAssistant;
  protected _config!: ConfigCard;
  protected _dati?: LetturaRitiri;
  protected _errore = false;
  protected _finestra?: Finestra;
  private _disiscrivi?: Promise<() => void>;
  private _connessa = false;
  private _minuto?: number;

  setConfig(config: ConfigCard) {
    const prima = this._config;
    this._config = { ...config };
    // Nell'editor visuale la configurazione cambia a ogni tasto: si rilegge solo se
    // cambia l'intervallo da leggere (la settimana dal lunedì), non per il titolo.
    if (prima && this._dati && this.hass && prima.inizio !== config.inizio) void this.carica(this._dati.oggi);
  }

  /** "Oggi" nel fuso di Home Assistant, non in quello del browser. */
  private _oggiHa(): string {
    const fuso = this.hass?.config?.time_zone;
    if (!fuso) return aIso(new Date());
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: fuso, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    } catch {
      return aIso(new Date());
    }
  }

  /** L'intervallo di date da leggere, in base a "oggi" del backend. */
  protected abstract intervallo(oggi: string): [string, string];

  override connectedCallback() {
    super.connectedCallback();
    this._connessa = true;
    // Le finestre si aprono e si chiudono: una volta al minuto si ridisegna, senza
    // rileggere nulla.
    this._minuto = window.setInterval(() => {
      // Senza dati o dopo un errore (Home Assistant che si riavviava) si riprova: la
      // card non resta "non disponibile" finché qualcuno non ricarica la pagina.
      if (!this._disiscrivi && this.hass) this._avvia();
      else if (!this._dati || this._errore || this._oggiHa() !== this._dati.oggi) void this.carica();
      else this.requestUpdate();
    }, 60_000);
    if (this.hass) this._avvia();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._connessa = false;
    clearInterval(this._minuto);
    this._disiscrivi?.then((f) => f()).catch(() => undefined);
    this._disiscrivi = undefined;
    this.hass?.connection.removeEventListener?.("ready", this._riconnessa);
    this._connessioneAscoltata = false;
    // Una finestra aperta non riappare da sola tornando alla plancia.
    this._finestra = undefined;
  }

  private _connessioneAscoltata = false;

  /** Home Assistant riconnesso (dopo un riavvio): iscrizione nuova e dati freschi. */
  private _riconnessa = () => {
    this._disiscrivi?.then((f) => f()).catch(() => undefined);
    this._disiscrivi = undefined;
    if (this._connessa && this.hass) this._avvia();
  };

  protected override willUpdate(cambiati: PropertyValues) {
    if (cambiati.has("hass") && this.hass && this._connessa && !this._disiscrivi) this._avvia();
  }

  private _avvia() {
    if (!this._connessioneAscoltata) {
      this.hass.connection.addEventListener?.("ready", this._riconnessa);
      this._connessioneAscoltata = true;
    }
    const iscrizione = this.hass.connection
      .subscribeMessage(() => void this.carica(), { type: `${DOMINIO}/iscriviti` })
      .catch(() => {
        // L'integrazione non è ancora caricata (Home Assistant che parte): si
        // riprova al prossimo minuto.
        if (this._disiscrivi === iscrizione) this._disiscrivi = undefined;
        this._errore = true;
        return () => undefined;
      });
    this._disiscrivi = iscrizione;
    void this.carica();
  }

  private _richiesta = 0;

  protected async carica(oggi?: string): Promise<void> {
    // Solo l'ultima richiesta conta: una risposta lenta per un mese vecchio non deve
    // coprire quella del mese che si sta guardando.
    const numero = ++this._richiesta;
    try {
      // Senza un "oggi" noto si parte dalla data locale; se il backend ne ha un'altra
      // (fusi diversi, mezzanotte appena passata) si rilegge con la sua.
      const giorno = oggi ?? aIso(new Date());
      const [dal, al] = this.intervallo(giorno);
      const dati = await this.hass.callWS<LetturaRitiri>({ type: `${DOMINIO}/ritiri`, dal, al });
      if (numero !== this._richiesta) return;
      if (dati.oggi !== giorno) return this.carica(dati.oggi);
      this._dati = dati;
      this._errore = !dati.disponibile;
    } catch {
      if (numero === this._richiesta) this._errore = true;
    }
  }

  protected tipologia(id: string): TipologiaCard | undefined {
    return this._dati?.tipologie.find((t) => t.id === id);
  }

  protected confermato(r: Ritiro) {
    return this._dati?.conferme.find((c) => c.data === r.data && c.tipologia === r.tipologia);
  }

  protected async conferma(data: string, tipologie: string[]) {
    // La risposta vera arriva con l'iscrizione; se il comando fallisce si rilegge,
    // così la card non mostra uno stato che il backend non ha.
    await this.hass.callWS({ type: `${DOMINIO}/conferma`, data, tipologie }).catch(() => this.carica());
  }

  protected async annulla(data: string, tipologie: string[]) {
    for (const tipologia of tipologie) {
      await this.hass.callWS({ type: `${DOMINIO}/annulla_conferma`, data, tipologia }).catch(() => undefined);
    }
    // Finestra già chiusa: il backend rifiuta, e la rilettura lo mostra.
    await this.carica();
  }

  protected intestazione(titolo: string, sotto?: string) {
    return html`<div class="intestazione">
      <span class="simbolo">${simbolo}</span>
      <span class="titoli"><b>${this._config?.titolo || titolo}</b>${sotto ? html`<span class="sotto">${sotto}</span>` : ""}</span>
      <span class="azioni">${this._pillola()}${this._punto()}</span>
    </div>`;
  }

  // --- cosa va dove (decisione 62) ---------------------------------------------------

  private _punto() {
    const conNote = this._dati?.tipologie.some((t) => t.note?.trim());
    if (!conNote) return nothing;
    return html`<button class="punto" aria-label=${T.card.apriNote} title=${T.card.apriNote}
      @click=${() => (this._finestra = { tipo: "note" })}><ha-icon icon="mdi:help-circle-outline"></ha-icon></button>`;
  }

  /** La chip di una tipologia; con una nota, un tocco la mostra. */
  protected chipNota(t: TipologiaCard) {
    if (!t.note?.trim()) return chip(t);
    return html`<button class="chip-nota" aria-label=${`${t.nome}: ${T.card.cosaVaDove}`}
      @click=${(e: Event) => {
        e.stopPropagation();
        this._finestra = { tipo: "note", tipologia: t.id };
      }}>${chip(t)}</button>`;
  }

  private _finestraNote(sola?: string) {
    const tipologie = (this._dati?.tipologie ?? []).filter((t) => !sola || t.id === sola);
    return html`<div class="elenco-note">
      ${tipologie.map(
        (t) => html`<div class="nota-riga">${chip(t)}<span>${t.note?.trim() || T.card.nessunaNotaCard}</span></div>`,
      )}
    </div>`;
  }

  // --- piattaforma ecologica (decisione 64) ------------------------------------------

  private get _piattaforma(): DatiPiattaforma | null {
    if (this._config?.piattaforma === false) return null;
    return this._dati?.piattaforma ?? null;
  }

  private _quandoApre(istante: string): string {
    const oggi = this._dati!.oggi;
    const giorno = istante.slice(0, 10);
    if (giorno === oggi) return T.card.alle(ora(istante));
    if (giorno === piuGiorni(oggi, 1)) return T.card.domaniAlle(ora(istante));
    // Oltre la settimana il nome del giorno non basta: "giovedì" sarebbe questo.
    const nome = GIORNI[giornoSettimana(giorno)];
    const oltre = giorno > piuGiorni(oggi, 6);
    return T.card.giornoAlle(oltre ? `${nome} ${daIso(giorno).getDate()}` : nome, ora(istante));
  }

  private _pillola() {
    const p = this._piattaforma;
    if (!p) return nothing;
    const s = statoPiattaforma(p, new Date());
    const [classe, testo] =
      s.aperta === null
        ? ["ignota", T.card.piattaformaNonIndicato]
        : s.aperta
          ? ["aperta", T.card.piattaformaAperta(ora(s.chiude!))]
          : ["chiusa", s.apre ? T.card.piattaformaApre(this._quandoApre(s.apre)) : T.card.piattaformaChiusa];
    return html`<button class="pillola ${classe}" title=${`${p.nome}: ${testo}`} aria-label=${`${p.nome}: ${testo}`}
      @click=${() => (this._finestra = { tipo: "piattaforma" })}>
      <ha-icon icon="mdi:recycle"></ha-icon><span>${testo}</span>
    </button>`;
  }

  private _finestraPiattaforma(p: DatiPiattaforma) {
    const settimana = p.giorni.slice(0, 7);
    const avanti = p.giorni.slice(7).filter((g) => g.motivo === "eccezione" || g.motivo === "festivo");
    const descrivi = (g: DatiPiattaforma["giorni"][number]) => {
      if (g.fasce === null) return T.card.orarioNonIndicato;
      if (!g.fasce.length) return g.festivo ? T.card.chiusaFestivo(g.festivo) : T.card.piattaformaChiusa;
      return fasceTesto(g);
    };
    const nomeGiorno = (iso: string) =>
      iso === this._dati!.oggi ? T.card.oggiMaiuscolo : `${GIORNI_BREVI[giornoSettimana(iso)]} ${daIso(iso).getDate()}`;
    return html`<div class="piattaforma">
      ${this._pillola()}
      ${p.nota ? html`<p class="nota-p">${p.nota}</p>` : nothing}
      <div class="orari">
        ${settimana.map(
          (g) => html`<div class="orario ${g.data === this._dati!.oggi ? "oggi" : ""}">
            <b>${nomeGiorno(g.data)}</b><span>${descrivi(g)}${g.nota ? html`<small>${g.nota}</small>` : nothing}</span>
          </div>`,
        )}
      </div>
      ${avanti.length
        ? html`<div class="avanti"><b>${T.card.piuAvanti}</b>
            ${avanti.map((g) => html`<div class="orario"><b>${nomeGiorno(g.data)}</b><span>${descrivi(g)}${g.nota ? html`<small>${g.nota}</small>` : nothing}</span></div>`)}
          </div>`
        : nothing}
    </div>`;
  }

  private _chiudi(chiudi: () => void) {
    return html`<div class="piede" slot="azioni"><button class="bottone" @click=${chiudi}>${T.chiudi}</button></div>`;
  }

  /** Le finestre della card: cosa va dove, orari della piattaforma. */
  protected finestre() {
    const f = this._finestra;
    if (!f) return nothing;
    if (f.tipo === "piattaforma" && !this._piattaforma) {
      // La piattaforma è sparita (tolta, o nascosta nell'editor): la finestra non
      // resta in sospeso per ricomparire quando torna.
      queueMicrotask(() => (this._finestra = undefined));
      return nothing;
    }
    const chiudi = () => (this._finestra = undefined);
    if (f.tipo === "piattaforma") {
      const p = this._piattaforma;
      if (!p) return nothing;
      return html`<rd-finestra aperta titolo=${p.nome} @chiudi=${chiudi}>
        ${this._finestraPiattaforma(p)}${this._chiudi(chiudi)}
      </rd-finestra>`;
    }
    const titolo = f.tipologia ? (this.tipologia(f.tipologia)?.nome ?? T.card.cosaVaDove) : T.card.cosaVaDove;
    return html`<rd-finestra aperta titolo=${titolo} @chiudi=${chiudi}>
      ${this._finestraNote(f.tipologia)}${this._chiudi(chiudi)}
    </rd-finestra>`;
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
      /* Titolo e data uno sopra l'altro: pillola e "?" restano sulla stessa riga anche
         in una card stretta (app sul telefono). Lo spazio va prima alla pillola, che dice
         l'orario; titolo e data vanno a capo, e solo al limite la pillola accorcia il suo testo. */
      .titoli {
        display: flex;
        flex-direction: column;
        min-width: 64px;
        flex: 1 1 0;
      }
      .titoli b {
        line-height: 1.25;
        overflow-wrap: anywhere;
      }
      .intestazione .sotto {
        color: var(--rd-testo-2);
        font-size: 13px;
        line-height: 1.25;
      }
      .azioni {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
        flex: 0 1 auto;
      }
      .azioni .punto {
        flex: none;
      }
      .azioni:empty {
        display: none;
      }
      .punto {
        border: 0;
        background: none;
        color: var(--rd-testo-2);
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        --mdc-icon-size: 20px;
      }
      .punto:hover {
        background: var(--rd-superficie-2);
        color: var(--rd-testo);
      }
      .pillola {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border: 0;
        cursor: pointer;
        border-radius: 999px;
        padding: 4px 10px 4px 7px;
        font: inherit;
        font-size: 12.5px;
        font-weight: 500;
        --mdc-icon-size: 16px;
        white-space: nowrap;
        background: var(--rd-superficie-2);
        color: var(--rd-testo-2);
        max-width: 100%;
        min-width: 0;
      }
      .pillola span {
        /* In una card stretta il testo finisce con i puntini, non tagliato di netto. */
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
      .azioni {
        min-width: 0;
        max-width: 100%;
      }
      .pillola.aperta {
        background: color-mix(in srgb, var(--rd-ok) 16%, transparent);
        color: var(--rd-ok);
      }
      .chip-nota {
        border: 0;
        padding: 0;
        background: none;
        cursor: pointer;
        font: inherit;
        border-radius: 999px;
      }
      .chip-nota .chip::after {
        content: "?";
        font-size: 10px;
        font-weight: 700;
        margin-left: 4px;
        opacity: 0.75;
      }
      /* Una sola griglia per tutte le righe: le descrizioni partono tutte dallo stesso
         margine, qualunque sia la lunghezza del nome. */
      .elenco-note {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 12px;
        align-items: start;
        font-size: 14px;
      }
      .nota-riga {
        display: contents;
      }
      .nota-riga > .chip {
        justify-self: start;
      }
      .nota-riga > span:last-child {
        padding-top: 3px;
        overflow-wrap: anywhere;
      }
      @media (max-width: 420px) {
        /* Sul telefono il nome sta sopra la sua descrizione, che usa tutta la larghezza. */
        .elenco-note {
          grid-template-columns: 1fr;
          gap: 6px;
        }
        .nota-riga > span:last-child {
          padding-top: 0;
          margin-bottom: 8px;
        }
      }
      .piattaforma .pillola {
        font-size: 14px;
        padding: 6px 12px 6px 9px;
        cursor: default;
        margin-bottom: 8px;
      }
      .nota-p {
        margin: 0 0 8px;
        color: var(--rd-testo-2);
        font-size: 13.5px;
      }
      .orario {
        display: grid;
        grid-template-columns: 64px 1fr;
        gap: 8px;
        padding: 7px 0;
        border-top: 1px solid var(--rd-bordo);
        font-size: 14px;
      }
      .orario.oggi b {
        color: var(--rd-primario);
      }
      .orario small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 12.5px;
      }
      .avanti {
        margin-top: 12px;
      }
      .piede {
        display: flex;
        justify-content: flex-end;
      }
      .avanti > b {
        display: block;
        font-size: 13px;
        color: var(--rd-testo-2);
        margin-bottom: 2px;
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
  // Dopo la definizione (definisci.ts): una voce nell'elenco senza l'elemento
  // registrato sarebbe una card che il selettore mostra e non sa creare.
  quandoPronto(() => aggiungiAlSelettore(tipo, nome, descrizione));
}

function aggiungiAlSelettore(tipo: string, nome: string, descrizione: string) {
  const w = window as unknown as { customCards?: unknown[] };
  w.customCards = w.customCards ?? [];
  if (!(w.customCards as { type: string }[]).some((c) => c.type === tipo)) {
    w.customCards.push({ type: tipo, name: nome, description: descrizione, preview: true, documentationURL: "https://github.com/foyer-labs/Foyer-Raccolta-Differenziata" });
  }
}
