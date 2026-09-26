// La card "Oggi e domani" (SPEC §10.2): cosa esporre adesso, con il pulsante.
import { css, html, nothing } from "lit";

import { chip } from "../comune/chip";
import { giorniTra, oraDi, piuGiorni } from "../comune/date";
import { GIORNI, MESI, T } from "../comune/testi";
import { daIso, giornoSettimana } from "../comune/date";
import type { Ritiro } from "../comune/tipi";
import { CardRaccolta, coloreTesto, registra } from "./base";
import "./editor";

const TIPO = "foyer-raccolta-oggi-card";

export class RaccoltaOggiCard extends CardRaccolta {
  static getConfigElement() {
    return document.createElement("foyer-raccolta-editor");
  }

  static getStubConfig() {
    return { type: `custom:${TIPO}` };
  }

  getCardSize() {
    return 4;
  }

  protected intervallo(oggi: string): [string, string] {
    return [oggi, piuGiorni(oggi, 8)];
  }

  /** Il gruppo di ritiri da mettere in evidenza, e in che stato è. */
  private _fuoco(): { ritiri: Ritiro[]; stato: "da_esporre" | "esposto" | "prossimo" } | undefined {
    const ritiri = this._dati?.ritiri ?? [];
    const ora = new Date();
    const aperti = ritiri.filter((r) => new Date(r.inizio_esposizione) <= ora && ora < new Date(r.fine_esposizione));
    if (aperti.length) {
      const primo = aperti[0].data;
      const delGiorno = aperti.filter((r) => r.data === primo);
      const daFare = delGiorno.filter((r) => !this.confermato(r));
      return { ritiri: daFare.length ? daFare : delGiorno, stato: daFare.length ? "da_esporre" : "esposto" };
    }
    const futuri = ritiri.filter((r) => new Date(r.fine_esposizione) > ora);
    if (!futuri.length) return undefined;
    const delGiorno = futuri.filter((r) => r.data === futuri[0].data);
    const daFare = delGiorno.filter((r) => !this.confermato(r));
    return { ritiri: daFare.length ? daFare : delGiorno, stato: daFare.length ? "prossimo" : "esposto" };
  }

  /** "stasera", "oggi" o il giorno della settimana in cui si apre la finestra. */
  private _giornoInizio(inizio: string): string {
    const giorno = inizio.slice(0, 10);
    const distanza = giorniTra(this._dati!.oggi, giorno);
    if (distanza <= 0) return Number(inizio.slice(11, 13)) >= 17 ? T.card.stasera : T.card.oggiMinuscolo;
    if (distanza === 1) return T.card.domani.toLowerCase();
    return GIORNI[giornoSettimana(giorno)];
  }

  private _quando(data: string, stato: string): string {
    const distanza = giorniTra(this._dati!.oggi, data);
    if (stato === "da_esporre") return distanza <= 0 ? T.card.daEsporreOra : T.card.staseraFuori;
    if (distanza === 0) return T.card.oggi;
    if (distanza === 1) return T.card.domani;
    return `${GIORNI[giornoSettimana(data)]} ${daIso(data).getDate()}`;
  }

  private _eroe() {
    const fuoco = this._fuoco();
    if (!fuoco) return html`<div class="eroe calmo"><div class="cosa piccola">${T.card.tuttoTranquillo}</div></div>`;
    const { ritiri, stato } = fuoco;
    const tipologie = ritiri.map((r) => this.tipologia(r.tipologia)).filter((t) => t !== undefined);
    const colori = tipologie.map((t) => t.colore);
    const sfondo = colori.length > 1 ? `linear-gradient(135deg, ${colori[0]} 0%, ${colori[colori.length - 1]} 100%)` : colori[0] ?? "var(--rd-primario)";
    const testo = coloreTesto(colori[0] ?? "#03a9f4");
    const data = ritiri[0].data;
    const distanza = giorniTra(this._dati!.oggi, data);
    const fine = oraDi(ritiri[0].fine_esposizione);
    const inizio = oraDi(ritiri[0].inizio_esposizione);
    const conferma = this.confermato(ritiri[0]);
    const tipologieId = ritiri.map((r) => r.tipologia);
    return html`<div class="eroe ${stato} ${testo === "#ffffff" ? "chiaro" : ""}" style="background:${sfondo};color:${testo}">
      <ha-icon class="sfondo-icona" .icon=${tipologie[0]?.icona ?? "mdi:trash-can-outline"}></ha-icon>
      <div class="quando">${this._quando(data, stato)}</div>
      <div class="cosa">${tipologie.map((t) => t.nome).join(" e ")}</div>
      ${stato === "esposto"
        ? html`<div class="fino"><ha-icon icon="mdi:check-circle"></ha-icon>${T.card.espostoAlle(oraDi(conferma?.istante ?? ""), conferma?.utente)}</div>
            <button class="conferma fatto" @click=${() => this.annulla(data, tipologieId)}>${T.card.annullaConferma}</button>`
        : html`<div class="fino">
              <ha-icon icon="mdi:clock-outline"></ha-icon>
              ${stato === "da_esporre" ? T.card.entroLe(fine, distanza <= 0) : T.card.dalle(inizio, this._giornoInizio(ritiri[0].inizio_esposizione))}
            </div>
            ${distanza <= 1 ? html`<button class="conferma" @click=${() => this.conferma(data, tipologieId)}>${T.card.esposto}</button>` : nothing}`}
      ${ritiri.some((r) => r.da_verificare) ? html`<div class="nota">${T.card.daVerificare}</div>` : nothing}
    </div>`;
  }

  private _giorno(etichetta: string, data: string) {
    const ritiri = (this._dati?.ritiri ?? []).filter((r) => r.data === data);
    return html`<div>
      <small>${etichetta}</small>
      <div class="chips">
        ${ritiri.length
          ? ritiri.map((r) => {
              const t = this.tipologia(r.tipologia);
              return html`<span class="con-segno">${t ? chip(t) : r.tipologia}${this.confermato(r) ? html`<ha-icon class="spunta" icon="mdi:check-circle" title=${T.card.confermato}></ha-icon>` : nothing}</span>`;
            })
          : html`<span class="vuoto">${T.card.nessunRitiro}</span>`}
      </div>
    </div>`;
  }

  override render() {
    if (!this._config) return nothing;
    if (this._errore) return this.nonDisponibile();
    if (!this._dati) return html`<ha-card><div class="vuota">…</div></ha-card>`;
    const oggi = this._dati.oggi;
    const d = daIso(oggi);
    return html`<ha-card>
      ${this.intestazione(T.card.titolo, `${GIORNI[giornoSettimana(oggi)]} ${d.getDate()} ${MESI[d.getMonth()]}`)}
      ${this._eroe()}
      <div class="fila">${this._giorno(T.card.oggi, oggi)} ${this._giorno(T.card.domani, piuGiorni(oggi, 1))}</div>
      ${this.banner()}
    </ha-card>`;
  }

  static override styles = [
    ...CardRaccolta.stiliComuni,
    css`
      .eroe {
        margin: 8px 12px 12px;
        border-radius: 16px;
        padding: 16px;
        position: relative;
        overflow: hidden;
        min-height: 96px;
      }
      .eroe.calmo {
        background: var(--rd-superficie-2);
        color: var(--rd-testo-2);
        display: grid;
        place-items: center;
        min-height: 72px;
      }
      .eroe.chiaro .quando,
      .eroe.chiaro .cosa,
      .eroe.chiaro .fino {
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.28);
      }
      .eroe.prossimo {
        filter: saturate(0.85);
      }
      .sfondo-icona {
        position: absolute;
        right: -14px;
        top: -12px;
        --mdc-icon-size: 128px;
        opacity: 0.16;
        pointer-events: none;
      }
      .quando {
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.92;
      }
      .cosa {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.15;
        margin: 4px 0 10px;
        position: relative;
      }
      .cosa.piccola {
        font-size: 15px;
        font-weight: 500;
        margin: 0;
      }
      .fino {
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.95;
        --mdc-icon-size: 18px;
      }
      .conferma {
        margin-top: 14px;
        width: 100%;
        border: 0;
        border-radius: 12px;
        padding: 12px;
        font-weight: 700;
        font-size: 15px;
        background: rgba(255, 255, 255, 0.94);
        color: #1b1f24;
        cursor: pointer;
        position: relative;
        transition: transform 0.1s;
      }
      .conferma:active {
        transform: scale(0.98);
      }
      .conferma.fatto {
        background: rgba(255, 255, 255, 0.22);
        color: inherit;
        font-weight: 600;
        padding: 8px;
      }
      .nota {
        margin-top: 10px;
        font-size: 12.5px;
        opacity: 0.9;
      }
      .fila {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background: var(--rd-bordo);
        border-top: 1px solid var(--rd-bordo);
        margin-bottom: 12px;
      }
      .fila > div {
        background: var(--rd-superficie);
        padding: 12px 16px;
      }
      .fila small {
        color: var(--rd-testo-2);
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
      }
      .chips {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .con-segno {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .spunta {
        --mdc-icon-size: 16px;
        color: var(--rd-ok);
      }
      .vuoto {
        color: var(--rd-testo-2);
        font-size: 14px;
      }
    `,
  ];
}

if (!customElements.get(TIPO)) customElements.define(TIPO, RaccoltaOggiCard);
registra(TIPO, T.card.nomeOggi, T.card.descrizioneOggi);
