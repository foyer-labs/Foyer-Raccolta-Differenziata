// Panoramica (SPEC §10.1): prossimi 30 giorni, cose da controllare, validità.
import { LitElement, css, html, nothing } from "lit";

import { chip } from "../../comune/chip";
import { giorniTra, piuGiorni } from "../../comune/date";
import { base, pagina } from "../../comune/stili";
import {
  dataLunga,
  fraseAnomalia,
  giornoMese,
  GIORNI_BREVI,
  messaggioProblema,
  nomeRegola,
  T,
} from "../../comune/testi";
import { giornoSettimana } from "../../comune/date";
import type { Anomalia, HomeAssistant, LetturaConfigurazione, LetturaRitiri, Ritiro } from "../../comune/tipi";
import { naviga, ricarica } from "../contesto";
import { definisci } from "../../comune/definisci";

const DOMINIO = "foyer_raccolta_differenziata";

export class RdPanoramica extends LitElement {
  static override properties = {
    hass: { attribute: false },
    lettura: { attribute: false },
    _ritiri: { state: true },
  };

  hass!: HomeAssistant;
  lettura!: LetturaConfigurazione;
  private _ritiri?: LetturaRitiri;

  override updated(cambiati: Map<string, unknown>) {
    if (cambiati.has("lettura")) void this._carica();
  }

  private async _carica() {
    const oggi = this.lettura.oggi;
    this._ritiri = await this.hass.callWS<LetturaRitiri>({
      type: `${DOMINIO}/ritiri`,
      dal: oggi,
      al: piuGiorni(oggi, 29),
    });
  }

  private _nome = (id: string): string => {
    const c = this.lettura.configurazione;
    const t = c.tipologie.find((x) => x.id === id);
    if (t) return t.nome;
    const r = c.regole.find((x) => x.id === id);
    return r ? nomeRegola(r) : id;
  };

  private async _ignora(r: Ritiro) {
    await this.hass.callWS({ type: `${DOMINIO}/anomalie/ignora`, data: r.data, tipologia: r.tipologia });
    ricarica(this);
  }

  private _festivi(): Ritiro[] {
    const ignorati = new Set(this.lettura.festivi_ignorati.map((v) => `${v.data}|${v.tipologia}`));
    return (this._ritiri?.ritiri ?? []).filter((r) => r.festivo && !ignorati.has(`${r.data}|${r.tipologia}`));
  }

  private _azioni(a: Anomalia) {
    switch (a.codice) {
      case "tipologia_senza_ritiri":
        return html`<button class="bottone piccolo" @click=${() => naviga(this, "eccezioni", { tipo: "aggiungi", tipologia: a.tipologia!, data: this.lettura.oggi })}>${T.aggiungiData}</button>`;
      case "sovrapposizione_mista":
      case "sovrapposizione_stesso_tipo":
      case "giorno_inesistente":
        return html`<button class="bottone piccolo" @click=${() => naviga(this, "regole")}>${T.apriRegole}</button>`;
      case "eccezione_senza_ritiro":
      case "eccezione_ridondante":
        return html`<button class="bottone piccolo" @click=${() => naviga(this, "eccezioni")}>${T.pagine.eccezioni}</button>`;
      case "piattaforma_senza_orario":
      case "piattaforma_in_scadenza":
        return html`<button class="bottone piccolo" @click=${() => naviga(this, "piattaforma")}>${T.pagine.piattaforma}</button>`;
      case "calendario_in_scadenza":
      case "calendario_scaduto":
        return html`<button class="bottone piccolo" @click=${() => naviga(this, "impostazioni")}>${T.pagine.impostazioni}</button>`;
      default:
        return nothing;
    }
  }

  private _giorni() {
    const tipologie = this.lettura.configurazione.tipologie;
    const perGiorno = new Map<string, Ritiro[]>();
    for (const r of this._ritiri?.ritiri ?? []) {
      perGiorno.set(r.data, [...(perGiorno.get(r.data) ?? []), r]);
    }
    if (!perGiorno.size) return html`<div class="vuoto">${T.nessunRitiro}</div>`;
    const oggi = this.lettura.oggi;
    return [...perGiorno.entries()].map(([data, ritiri]) => {
      const distanza = giorniTra(oggi, data);
      const quando = distanza === 0 ? T.oggi : distanza === 1 ? T.domani : GIORNI_BREVI[giornoSettimana(data)];
      return html`<div class="giorno ${distanza === 0 ? "oggi" : ""}">
        <div class="quando"><b>${quando}</b>${giornoMese(data)}</div>
        <div class="chips">
          ${ritiri.map((r) => {
            const t = tipologie.find((x) => x.id === r.tipologia);
            return html`${t ? chip(t) : r.tipologia}
            ${r.spostato_dal ? html`<span class="nota">↪ ${giornoMese(r.spostato_dal)}</span>` : nothing}
            ${r.festivo ? html`<span class="nota avviso">${r.festivo}</span>` : nothing}`;
          })}
        </div>
      </div>`;
    });
  }

  private _validita() {
    const valido = this.lettura.configurazione.valido_fino_al;
    if (!valido) return html`<p class="aiuto">${T.senzaValidita}</p>`;
    const giorni = giorniTra(this.lettura.oggi, valido);
    if (giorni < 0) return html`<p class="aiuto avviso">${T.scaduto(valido)}</p>`;
    return html`<div class="validita ${giorni <= 30 ? "avviso" : ""}">
      <div class="grande">${giorni}</div>
      <div>${T.giorniValidita}<br /><small class="aiuto">${T.validoFino(valido)}</small></div>
    </div>`;
  }

  override render() {
    const festivi = this._festivi();
    const anomalie = this.lettura.anomalie;
    const totale = festivi.length + anomalie.length;
    return html`
      ${this.lettura.problemi.length
        ? html`<div class="riquadro errore">
            ${T.configurazioneNonValida}
            <ul>${this.lettura.problemi.map((p) => html`<li>${messaggioProblema(p)}</li>`)}</ul>
          </div>`
        : nothing}
      <div class="griglia-2">
        <div class="riquadro">
          <h2>${T.prossimiRitiri} <span class="conta">${T.giorni30}</span></h2>
          ${this._giorni()}
        </div>
        <div class="laterale">
          <div class="riquadro">
            <h2>${T.daControllare} ${totale ? html`<span class="conta">${totale}</span>` : nothing}</h2>
            ${totale === 0 ? html`<div class="vuoto">${T.tuttoInOrdine}</div>` : nothing}
            ${festivi.map(
              (r) => html`<div class="anomalia">
                <ha-icon icon="mdi:alert-outline"></ha-icon>
                <div class="testo">
                  <b>${this._nome(r.tipologia)}</b> · ${dataLunga(r.data)}: ${r.festivo}.
                  <div class="riga-azioni">
                    <button class="bottone piccolo primario" @click=${() => naviga(this, "eccezioni", { tipo: "sposta", tipologia: r.tipologia, data: r.data })}>${T.creaEccezione}</button>
                    <button class="bottone piccolo" @click=${() => this._ignora(r)}>${T.ignora}</button>
                  </div>
                </div>
              </div>`,
            )}
            ${anomalie.map(
              (a) => html`<div class="anomalia ${a.gravita}">
                <ha-icon icon=${a.gravita === "avviso" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
                <div class="testo">${fraseAnomalia(a, this._nome)}<div class="riga-azioni">${this._azioni(a)}</div></div>
              </div>`,
            )}
          </div>
          <div class="riquadro">
            <h2>${T.calendarioComune}</h2>
            ${this._validita()}
          </div>
        </div>
      </div>
    `;
  }

  static override styles = [
    base,
    pagina,
    css`
      .giorno {
        display: grid;
        grid-template-columns: 76px 1fr;
        gap: 12px;
        padding: 10px 0;
        border-top: 1px solid var(--rd-bordo);
        align-items: center;
      }
      .giorno:first-of-type {
        border-top: 0;
      }
      .quando {
        color: var(--rd-testo-2);
        font-size: 13px;
        line-height: 1.2;
      }
      .quando b {
        display: block;
        color: var(--rd-testo);
        font-size: 15px;
      }
      .giorno.oggi .quando b {
        color: var(--rd-primario);
      }
      .chips {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        align-items: center;
      }
      .nota {
        font-size: 12px;
        color: var(--rd-testo-2);
      }
      .nota.avviso,
      p.avviso,
      .validita.avviso .grande {
        color: var(--rd-avviso);
      }
      .anomalia {
        display: flex;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--rd-avviso) 12%, transparent);
        margin-bottom: 8px;
        align-items: flex-start;
        --mdc-icon-size: 20px;
      }
      .anomalia ha-icon {
        color: var(--rd-avviso);
      }
      .anomalia.info {
        background: var(--rd-superficie-2);
      }
      .anomalia.info ha-icon {
        color: var(--rd-testo-2);
      }
      .anomalia .testo {
        flex: 1;
        font-size: 14px;
      }
      .validita {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .validita .grande {
        font-size: 32px;
        font-weight: 600;
      }
      .errore {
        margin-bottom: 16px;
        color: var(--rd-errore);
      }
      @media (max-width: 820px) {
        .laterale {
          order: -1;
        }
      }
    `,
  ];
}

definisci("rd-panoramica", RdPanoramica);
