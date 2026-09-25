// La card "Settimana" (SPEC §10.2): sette giorni, oggi evidenziato, dettaglio al tocco.
import { css, html, nothing } from "lit";

import { chip } from "../comune/chip";
import { daIso, giornoSettimana, lunediDi, piuGiorni } from "../comune/date";
import { GIORNI, GIORNI_BREVI, T } from "../comune/testi";
import { CardRaccolta, coloreTesto, dataBrevissima, registra } from "./base";
import "./editor";

const TIPO = "foyer-raccolta-settimana-card";

export class RaccoltaSettimanaCard extends CardRaccolta {
  static override properties = { ...CardRaccolta.properties, _scelto: { state: true } };
  private _scelto?: string;

  static getConfigElement() {
    return document.createElement("foyer-raccolta-editor");
  }

  static getStubConfig() {
    return { type: `custom:${TIPO}`, inizio: "oggi" };
  }

  getCardSize() {
    return 3;
  }

  protected intervallo(oggi: string): [string, string] {
    const primo = this._config?.inizio === "lunedi" ? lunediDi(oggi) : oggi;
    return [primo, piuGiorni(primo, 6)];
  }

  override render() {
    if (!this._config) return nothing;
    if (this._errore) return this.nonDisponibile();
    if (!this._dati) return html`<ha-card><div class="vuota">…</div></ha-card>`;
    const oggi = this._dati.oggi;
    const [primo, ultimo] = this.intervallo(oggi);
    const giorni = Array.from({ length: 7 }, (_, i) => piuGiorni(primo, i));
    const ritiri = this._dati.ritiri;
    const usate = [...new Set(ritiri.map((r) => r.tipologia))].map((id) => this.tipologia(id)).filter((t) => t !== undefined);
    const scelto = this._scelto && giorni.includes(this._scelto) ? this._scelto : undefined;
    const delScelto = scelto ? ritiri.filter((r) => r.data === scelto) : [];
    return html`<ha-card>
      ${this.intestazione(T.card.settimana, `${dataBrevissima(primo)} – ${dataBrevissima(ultimo)}`)}
      <div class="settimana" role="list">
        ${giorni.map((g) => {
          const delGiorno = ritiri.filter((r) => r.data === g);
          const passato = g < oggi;
          return html`<button
            role="listitem"
            class="g ${g === oggi ? "oggi" : ""} ${passato ? "passato" : ""} ${g === scelto ? "scelto" : ""}"
            aria-label=${`${GIORNI[giornoSettimana(g)]} ${daIso(g).getDate()}: ${delGiorno.map((r) => this.tipologia(r.tipologia)?.nome).join(", ") || T.card.nessunRitiro}`}
            @click=${() => (this._scelto = g === scelto ? undefined : g)}
          >
            <span class="nome-g">${g === oggi ? T.card.oggi : GIORNI_BREVI[giornoSettimana(g)]}</span>
            <span class="num">${daIso(g).getDate()}</span>
            ${delGiorno.map((r) => {
              const t = this.tipologia(r.tipologia);
              const colore = t?.colore ?? "#888888";
              return html`<span class="ico-t ${this.confermato(r) ? "fatto" : ""}" style="background:${colore};color:${coloreTesto(colore)}">
                <ha-icon .icon=${t?.icona ?? "mdi:trash-can-outline"}></ha-icon>
                ${r.spostato_dal ? html`<span class="segno">↪</span>` : nothing}
              </span>`;
            })}
          </button>`;
        })}
      </div>
      ${scelto
        ? html`<div class="dettaglio">
            <small>${GIORNI[giornoSettimana(scelto)]} ${daIso(scelto).getDate()}</small>
            ${delScelto.length
              ? delScelto.map((r) => {
                  const t = this.tipologia(r.tipologia);
                  return html`<div class="riga">
                    ${t ? chip(t) : r.tipologia}
                    <span class="note">
                      ${[t?.note, r.spostato_dal ? T.card.spostatoDal(dataBrevissima(r.spostato_dal)) : ""].filter(Boolean).join(" · ")}
                    </span>
                  </div>`;
                })
              : html`<span class="vuoto">${T.card.nessunRitiro}</span>`}
          </div>`
        : usate.length
          ? html`<div class="legenda">${usate.map((t) => html`<span><i class="pallino" style="background:${t.colore}"></i>${t.nome}</span>`)}</div>`
          : html`<div class="vuota">${T.card.nessunRitiroSettimana}</div>`}
      ${this.banner()}
    </ha-card>`;
  }

  static override styles = [
    ...CardRaccolta.stiliComuni,
    css`
      .settimana {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 6px;
        padding: 8px 12px 12px;
      }
      .g {
        border: 0;
        border-radius: 12px;
        padding: 8px 2px 10px;
        background: var(--rd-superficie-2);
        min-height: 112px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: transform 0.12s;
      }
      .g:hover {
        transform: translateY(-1px);
      }
      .g.oggi {
        outline: 2px solid var(--rd-primario);
        background: color-mix(in srgb, var(--rd-primario) 12%, var(--rd-superficie));
      }
      .g.scelto {
        box-shadow: 0 0 0 2px var(--rd-testo-2) inset;
      }
      .g.passato {
        opacity: 0.5;
      }
      .nome-g {
        font-size: 11px;
        color: var(--rd-testo-2);
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.04em;
      }
      .num {
        font-size: 18px;
        font-weight: 700;
      }
      .ico-t {
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        --mdc-icon-size: 17px;
      }
      .ico-t.fatto::after {
        content: "✓";
        position: absolute;
        right: -4px;
        bottom: -4px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: var(--rd-ok);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        display: grid;
        place-items: center;
        box-shadow: 0 0 0 2px var(--rd-superficie);
      }
      .segno {
        position: absolute;
        left: -5px;
        top: -5px;
        font-size: 11px;
        background: var(--rd-superficie);
        color: var(--rd-testo);
        border-radius: 50%;
        width: 15px;
        height: 15px;
        display: grid;
        place-items: center;
      }
      .legenda {
        display: flex;
        gap: 8px 14px;
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
      .note,
      .vuoto {
        color: var(--rd-testo-2);
        font-size: 13px;
      }
    `,
  ];
}

if (!customElements.get(TIPO)) customElements.define(TIPO, RaccoltaSettimanaCard);
registra(TIPO, T.card.nomeSettimana, T.card.descrizioneSettimana);
