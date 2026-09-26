// La card "Mese" (SPEC §10.2): griglia con i pallini, navigazione, dettaglio del giorno.
import { css, html, nothing } from "lit";

import { aIso, daIso, giorniNelMese, giornoSettimana, piuGiorni, primoDelMese } from "../comune/date";
import { GIORNI, GIORNI_INIZIALI, MESI, T } from "../comune/testi";
import { CardRaccolta, dataBrevissima, registra } from "./base";
import "./editor";
import { definisci } from "../comune/definisci";

const TIPO = "foyer-raccolta-mese-card";

export class RaccoltaMeseCard extends CardRaccolta {
  static override properties = { ...CardRaccolta.properties, _mese: { state: true }, _scelto: { state: true } };
  private _mese?: string; // primo del mese mostrato
  private _scelto?: string;

  static getConfigElement() {
    return document.createElement("foyer-raccolta-editor");
  }

  static getStubConfig() {
    return { type: `custom:${TIPO}` };
  }

  getCardSize() {
    return 7;
  }

  protected intervallo(oggi: string): [string, string] {
    const primo = this._mese ?? primoDelMese(oggi);
    const inizio = piuGiorni(primo, -giornoSettimana(primo));
    return [inizio, piuGiorni(inizio, 41)];
  }

  private _sposta(mesi: number) {
    const d = daIso(this._mese ?? primoDelMese(this._dati!.oggi));
    d.setMonth(d.getMonth() + mesi);
    this._mese = aIso(d);
    this._scelto = undefined;
    void this.carica(this._dati!.oggi);
  }

  override render() {
    if (!this._config) return nothing;
    if (this._errore) return this.nonDisponibile();
    if (!this._dati) return html`<ha-card><div class="vuota">…</div></ha-card>`;
    const oggi = this._dati.oggi;
    const primo = this._mese ?? primoDelMese(oggi);
    const [inizio] = this.intervallo(oggi);
    const anno = daIso(primo).getFullYear();
    const mese = daIso(primo).getMonth();
    const celle = Math.ceil((giornoSettimana(primo) + giorniNelMese(anno, mese + 1)) / 7) * 7;
    const scelto = this._scelto ?? (primo === primoDelMese(oggi) ? oggi : primo);
    const delScelto = this._dati.ritiri.filter((r) => r.data === scelto);
    const usate = [...new Set(this._dati.ritiri.map((r) => r.tipologia))]
      .map((id) => this.tipologia(id))
      .filter((t) => t !== undefined);
    return html`<ha-card>
      ${this.intestazione(T.card.calendario)}
      <div class="testa-mese">
        <button aria-label=${T.card.mesePrecedente} @click=${() => this._sposta(-1)}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
        <b>${MESI[mese]} ${anno}</b>
        <button aria-label=${T.card.meseSuccessivo} @click=${() => this._sposta(1)}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
      <div class="mese">
        ${GIORNI_INIZIALI.map((g) => html`<div class="intest">${g}</div>`)}
        ${Array.from({ length: celle }, (_, i) => {
          const g = piuGiorni(inizio, i);
          const ritiri = this._dati!.ritiri.filter((r) => r.data === g);
          const fuori = daIso(g).getMonth() !== mese;
          return html`<button
            class="c ${fuori ? "fuori" : ""} ${g < oggi ? "passato" : ""} ${g === oggi ? "oggi" : ""} ${g === scelto && g !== oggi ? "scelto" : ""}"
            aria-label=${`${daIso(g).getDate()} ${MESI[daIso(g).getMonth()]}${ritiri.length ? `: ${ritiri.map((r) => this.tipologia(r.tipologia)?.nome ?? r.tipologia).join(", ")}` : ""}`}
            @click=${() => (this._scelto = g)}
          >
            <span>${daIso(g).getDate()}</span>
            <span class="punti">
              ${ritiri.slice(0, 4).map((r) => html`<i style="background:${this.tipologia(r.tipologia)?.colore ?? "#888"}"></i>`)}
            </span>
          </button>`;
        })}
      </div>
      <div class="dettaglio">
        <small>${GIORNI[giornoSettimana(scelto)]} ${daIso(scelto).getDate()} ${MESI[daIso(scelto).getMonth()]}</small>
        ${delScelto.length
          ? delScelto.map((r) => {
              const t = this.tipologia(r.tipologia);
              const note = [
                t?.note,
                r.spostato_dal ? T.card.spostatoDal(dataBrevissima(r.spostato_dal)) : "",
                r.festivo ? T.card.festivo(r.festivo) : "",
                this.confermato(r) ? T.card.confermato : "",
              ].filter(Boolean);
              return html`<div class="riga">${t ? this.chipNota(t) : r.tipologia}<span class="note">${note.join(" · ")}</span></div>`;
            })
          : html`<span class="note">${T.card.nessunRitiro}</span>`}
      </div>
      ${usate.length
        ? html`<div class="legenda">${usate.map((t) => html`<span><i class="pallino" style="background:${t.colore}"></i>${t.nome}</span>`)}</div>`
        : nothing}
      ${this.banner()}
    ${this.finestre()}
    </ha-card>`;
  }

  static override styles = [
    ...CardRaccolta.stiliComuni,
    css`
      .testa-mese {
        display: flex;
        align-items: center;
        padding: 0 12px;
        gap: 8px;
      }
      .testa-mese b {
        flex: 1;
        text-align: center;
        font-size: 15px;
        text-transform: capitalize;
      }
      .testa-mese button {
        border: 0;
        background: var(--rd-superficie-2);
        width: 34px;
        height: 34px;
        border-radius: 50%;
        cursor: pointer;
        display: grid;
        place-items: center;
      }
      .mese {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        padding: 8px 12px 10px;
      }
      .intest {
        text-align: center;
        font-size: 11px;
        color: var(--rd-testo-2);
        font-weight: 700;
        padding: 4px 0;
      }
      .c {
        border: 0;
        background: none;
        aspect-ratio: 1;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        font-size: 13.5px;
        cursor: pointer;
        padding: 0;
        min-height: 36px;
      }
      .c:hover {
        background: var(--rd-superficie-2);
      }
      .c.fuori {
        opacity: 0.4;
      }
      .c.passato:not(.oggi) {
        color: var(--rd-testo-2);
      }
      .legenda {
        display: flex;
        gap: 6px 14px;
        flex-wrap: wrap;
        padding: 0 16px 14px;
        font-size: 12.5px;
        color: var(--rd-testo-2);
      }
      .legenda span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .c.oggi {
        background: var(--rd-primario);
        color: var(--text-primary-color, #fff);
        font-weight: 700;
      }
      .c.scelto {
        box-shadow: 0 0 0 2px var(--rd-primario) inset;
      }
      .punti {
        display: flex;
        gap: 2px;
        height: 7px;
      }
      .punti i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }
      .c.oggi .punti i {
        box-shadow: 0 0 0 1.5px #fff;
      }
      .dettaglio {
        border-top: 1px solid var(--rd-bordo);
        padding: 10px 16px 14px;
        display: grid;
        gap: 8px;
      }
      .dettaglio small {
        color: var(--rd-testo-2);
        font-weight: 600;
      }
      .dettaglio small::first-letter {
        text-transform: uppercase;
      }
      .riga {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .note {
        color: var(--rd-testo-2);
        font-size: 13px;
      }
    `,
  ];
}

definisci(TIPO, RaccoltaMeseCard);
registra(TIPO, T.card.nomeMese, T.card.descrizioneMese);
