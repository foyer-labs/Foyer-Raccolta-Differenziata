// Impostazioni (SPEC §10.1): barra laterale, finestra di esposizione, validità,
// patrono, configurazione in Excel. La barra laterale cambia subito; il resto passa
// da "Prima di salvare", anche un file importato (decisioni 36 e 59).
import { LitElement, css, html, nothing } from "lit";

import "../../comune/finestra";
import { base, moduli, pagina } from "../../comune/stili";
import { luogoErroreFile, MESI, messaggioErroreFile, T } from "../../comune/testi";
import type {
  Configurazione,
  ErroreFile,
  EsitoImportazione,
  Finestra,
  HomeAssistant,
  LetturaConfigurazione,
} from "../../comune/tipi";
import { avvisa, copia, proponi, ricarica } from "../contesto";
import { definisci } from "../../comune/definisci";

const DOMINIO = "foyer_raccolta_differenziata";
const MASSIMO_BYTE = 1024 * 1024;
const TIPO_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const ERRORI_MOSTRATI = 30;

type Modo = "sostituisci" | "aggiungi";

interface Importazione {
  file?: File;
  modo?: Modo;
  errori: ErroreFile[];
  occupato: boolean;
}

/** Il file in base64, a pezzi: un solo `fromCharCode` su tutto il file supera lo stack. */
async function inBase64(file: File): Promise<string> {
  const byte = new Uint8Array(await file.arrayBuffer());
  let binario = "";
  for (let i = 0; i < byte.length; i += 0x8000) binario += String.fromCharCode(...byte.subarray(i, i + 0x8000));
  return btoa(binario);
}

export class RdImpostazioni extends LitElement {
  static override properties = {
    hass: { attribute: false },
    lettura: { attribute: false },
    _bozza: { state: true },
    _importazione: { state: true },
  };

  hass!: HomeAssistant;
  lettura!: LetturaConfigurazione;
  private _bozza?: Configurazione;
  private _importazione?: Importazione;

  private _revisione?: number;
  private _base?: string;

  override willUpdate(cambiati: Map<string, unknown>) {
    // Un ricalcolo (una conferma, mezzanotte) rilegge la configurazione identica: la
    // bozza si rimpiazza solo se la revisione è cambiata e non ci sono modifiche.
    if (!cambiati.has("lettura")) return;
    const intatta = !this._bozza || JSON.stringify(this._bozza) === this._base;
    if (this._revisione !== this.lettura.revisione && intatta) {
      this._bozza = copia(this.lettura.configurazione);
      this._base = JSON.stringify(this._bozza);
      this._revisione = this.lettura.revisione;
    }
  }

  private async _barra() {
    await this.hass.callWS({ type: `${DOMINIO}/barra_laterale`, mostra: !this.lettura.mostra_barra_laterale });
    ricarica(this);
  }

  private _finestra(parziale: Partial<Finestra>) {
    this._bozza = { ...this._bozza!, esposizione: { ...this._bozza!.esposizione, ...parziale } };
  }

  private _patrono(parziale: Partial<{ data: string; nome: string }>) {
    const attuale = this._bozza!.patrono ?? { data: "01-01", nome: "" };
    this._bozza = { ...this._bozza!, patrono: { ...attuale, ...parziale } };
  }

  private async _scarica(modello: boolean) {
    // Un indirizzo firmato e non un file costruito nel browser: così il download
    // funziona anche nell'app Companion.
    try {
      const { path } = await this.hass.callWS<{ path: string }>({
        type: "auth/sign_path",
        path: `/api/${DOMINIO}/excel${modello ? "?modello=1" : ""}`,
      });
      const collegamento = document.createElement("a");
      collegamento.href = path;
      collegamento.download = "";
      document.body.append(collegamento);
      collegamento.click();
      collegamento.remove();
    } catch {
      avvisa(this, T.scaricamentoFallito);
    }
  }

  private _scegliFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file || !this._importazione) return;
    this._importazione = { ...this._importazione, file, errori: [] };
  }

  private async _importa() {
    const stato = this._importazione;
    if (!stato?.file || !stato.modo || stato.occupato) return;
    if (stato.file.size > MASSIMO_BYTE) {
      this._importazione = { ...stato, errori: [{ foglio: "", riga: null, colonna: null, codice: "file_troppo_grande" }] };
      return;
    }
    this._importazione = { ...stato, occupato: true, errori: [] };
    try {
      const esito = await this.hass.callWS<EsitoImportazione>({
        type: `${DOMINIO}/excel/importa`,
        contenuto: await inBase64(stato.file),
        modo: stato.modo,
      });
      if (esito.configurazione) {
        this._importazione = undefined;
        proponi(this, esito.configurazione, esito.riepilogo);
        return;
      }
      this._importazione = { ...stato, occupato: false, errori: esito.errori };
    } catch {
      this._importazione = { ...stato, occupato: false };
      avvisa(this, T.erroreConnessione);
    }
  }

  private _finestraImportazione() {
    const stato = this._importazione;
    if (!stato) return nothing;
    const modo = (valore: Modo, titolo: string, aiuto: string) => html`<button
      class="modo ${stato.modo === valore ? "attivo" : ""}"
      role="radio"
      aria-checked=${stato.modo === valore}
      @click=${() => (this._importazione = { ...stato, modo: valore, errori: [] })}
    >
      <span class="pallino" aria-hidden="true"></span>
      <span><b>${titolo}</b><small>${aiuto}</small></span>
    </button>`;
    const altri = stato.errori.length - ERRORI_MOSTRATI;
    return html`<rd-finestra aperta titolo=${T.importaTitolo} @chiudi=${() => (this._importazione = undefined)}>
      <div class="modulo">
        <div class="campo">
          <span class="etichetta">${T.scegliFile}</span>
          <label class="file">
            <input type="file" accept=".xlsx,${TIPO_XLSX}" @change=${this._scegliFile} />
            <ha-icon icon="mdi:file-table-outline" aria-hidden="true"></ha-icon>
            <span class="nome-file">${stato.file?.name ?? T.nessunFile}</span>
            <span class="bottone piccolo">${stato.file ? T.cambiaFile : T.scegliFile}</span>
          </label>
        </div>
        <div class="campo">
          <span class="etichetta">${T.comeImportare}</span>
          <div class="modi" role="radiogroup" aria-label=${T.comeImportare}>
            ${modo("sostituisci", T.sostituisci, T.sostituisciAiuto)}
            ${modo("aggiungi", T.aggiungiSoltanto, T.aggiungiSoltantoAiuto)}
          </div>
        </div>
        ${stato.errori.length
          ? html`<div class="errori-file" role="alert">
              <b>${T.fileConProblemi}</b>
              <ul>
                ${stato.errori.slice(0, ERRORI_MOSTRATI).map((e) => {
                  const luogo = luogoErroreFile(e);
                  return html`<li>${luogo ? html`<span class="luogo">${luogo}</span>` : nothing}${messaggioErroreFile(e)}</li>`;
                })}
              </ul>
              ${altri > 0 ? html`<small>${T.altriProblemi(altri)}</small>` : nothing}
            </div>`
          : nothing}
      </div>
      <div class="azioni-modulo" slot="azioni">
        <span style="flex:1"></span>
        <button class="bottone" @click=${() => (this._importazione = undefined)}>${T.annulla}</button>
        <button class="bottone primario" ?disabled=${!stato.file || !stato.modo || stato.occupato} @click=${this._importa}>
          ${stato.occupato ? T.leggoIlFile : T.continua}
        </button>
      </div>
    </rd-finestra>`;
  }

  chiudiEditor() {
    // Salvato: la prossima lettura porta la configurazione nuova.
    this._base = undefined;
    this._bozza = undefined;
  }

  private _salva() {
    const bozza = copia(this._bozza!);
    if (bozza.patrono && !bozza.patrono.nome.trim()) bozza.patrono = null;
    if (bozza.patrono) bozza.patrono.nome = bozza.patrono.nome.trim();
    if (!bozza.valido_fino_al) bozza.valido_fino_al = null;
    proponi(this, bozza);
  }

  override render() {
    const b = this._bozza;
    if (!b) return html``;
    const [mese, giorno] = (b.patrono?.data ?? "01-01").split("-").map(Number);
    const componi = (m: number, g: number) =>
      this._patrono({ data: `${String(m).padStart(2, "0")}-${String(g).padStart(2, "0")}` });
    const modificata = JSON.stringify(b) !== this._base;
    return html`<div class="colonna">
      <div class="riquadro">
        <h2>${T.pagine.impostazioni}</h2>
        <div class="interruttore">
          <div>${T.mostraBarra}<small>${T.mostraBarraAiuto}</small></div>
          <button class="levetta ${this.lettura.mostra_barra_laterale ? "acceso" : ""}" role="switch" aria-checked=${this.lettura.mostra_barra_laterale} aria-label=${T.mostraBarra} @click=${this._barra}></button>
        </div>
      </div>

      <div class="riquadro">
        <h2>${T.esposizione}</h2>
        <p class="aiuto">${T.esposizioneAiuto}</p>
        <div class="modulo">
          <div class="riga-campi">
            <div class="campo"><label>${T.dalle}</label><input type="time" .value=${b.esposizione.inizio_ora} @change=${(e: Event) => this._finestra({ inizio_ora: (e.target as HTMLInputElement).value })} /></div>
            <div class="campo">
              <label>${T.del}</label>
              <select @change=${(e: Event) => this._finestra({ inizio_giorno: (e.target as HTMLSelectElement).value as Finestra["inizio_giorno"] })}>
                ${(["giorno_prima", "giorno_stesso"] as const).map((g) => html`<option value=${g} ?selected=${b.esposizione.inizio_giorno === g}>${T.inizioGiorno[g]}</option>`)}
              </select>
            </div>
          </div>
          <div class="campo"><label>${T.entroLe}</label><input type="time" .value=${b.esposizione.fine_ora} @change=${(e: Event) => this._finestra({ fine_ora: (e.target as HTMLInputElement).value })} /></div>
        </div>
      </div>

      <div class="riquadro">
        <h2>${T.calendarioComune}</h2>
        <div class="modulo">
          <div class="campo">
            <label for="validita">${T.validita}</label>
            <input id="validita" type="date" .value=${b.valido_fino_al ?? ""} @change=${(e: Event) => (this._bozza = { ...b, valido_fino_al: (e.target as HTMLInputElement).value || null })} />
            <small>${T.validitaAiuto}</small>
          </div>
          <div class="campo">
            <span class="etichetta">${T.patrono}</span>
            <div class="patrono">
              <input aria-label=${T.nomePatrono} placeholder="Sant'Ambrogio" maxlength="60" .value=${b.patrono?.nome ?? ""} @input=${(e: InputEvent) => this._patrono({ nome: (e.target as HTMLInputElement).value })} />
              <select aria-label=${T.giorno} @change=${(e: Event) => componi(mese, Number((e.target as HTMLSelectElement).value))}>
                ${Array.from({ length: 31 }, (_, i) => i + 1).map((n) => html`<option value=${n} ?selected=${n === giorno}>${n}</option>`)}
              </select>
              <select aria-label=${T.mese} @change=${(e: Event) => componi(Number((e.target as HTMLSelectElement).value), giorno)}>
                ${MESI.map((nome, i) => html`<option value=${i + 1} ?selected=${i + 1 === mese}>${nome}</option>`)}
              </select>
            </div>
            <small>${T.patronoAiuto}</small>
          </div>
        </div>
      </div>
      <div class="azioni-modulo">
        <button class="bottone" ?disabled=${!modificata} @click=${() => {
          this._bozza = copia(this.lettura.configurazione);
          this._base = JSON.stringify(this._bozza);
          this._revisione = this.lettura.revisione;
        }}>${T.annulla}</button>
        <button class="bottone primario" ?disabled=${!modificata} @click=${this._salva}>${T.salva}</button>
      </div>

      <div class="riquadro excel">
        <h2><ha-icon icon="mdi:file-table-outline" aria-hidden="true"></ha-icon>${T.excel}</h2>
        <p class="aiuto">${T.excelAiuto}</p>
        <div class="azioni-excel">
          <button class="bottone" @click=${() => this._scarica(true)}>
            <ha-icon icon="mdi:file-download-outline" aria-hidden="true"></ha-icon>${T.scaricaModello}
          </button>
          <button class="bottone" ?disabled=${this.lettura.problemi.length > 0} @click=${() => this._scarica(false)}>
            <ha-icon icon="mdi:table-arrow-down" aria-hidden="true"></ha-icon>${T.esporta}
          </button>
          <button class="bottone primario" @click=${() => (this._importazione = { errori: [], occupato: false })}>
            <ha-icon icon="mdi:table-arrow-up" aria-hidden="true"></ha-icon>${T.importa}
          </button>
        </div>
        ${this.lettura.problemi.length ? html`<small class="avviso-excel">${T.esportaNonValida}</small>` : nothing}
      </div>
    </div>
    ${this._finestraImportazione()}`;
  }

  static override styles = [
    base,
    pagina,
    moduli,
    css`
      .colonna {
        max-width: 680px;
      }
      .interruttore {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .interruttore small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 13px;
        margin-top: 2px;
      }
      .patrono {
        display: grid;
        grid-template-columns: 2fr 1fr 1.4fr;
        gap: 8px;
      }
      @media (max-width: 560px) {
        .patrono {
          grid-template-columns: 1fr 1.6fr;
        }
        .patrono input {
          grid-column: 1 / -1;
        }
      }
      .azioni-modulo {
        margin-top: 16px;
      }
      .excel {
        margin-top: 24px;
      }
      .excel h2 {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .excel h2 ha-icon {
        --mdc-icon-size: 22px;
        color: var(--rd-primario);
      }
      .azioni-excel {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .azioni-excel .bottone {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .azioni-excel ha-icon {
        --mdc-icon-size: 18px;
      }
      .avviso-excel {
        display: block;
        margin-top: 8px;
        color: var(--rd-errore);
      }
      @media (max-width: 560px) {
        .azioni-excel .bottone {
          flex: 1 1 100%;
          justify-content: center;
        }
      }
      .campo > label.file {
        position: relative;
        display: flex;
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: var(--rd-testo);
        align-items: center;
        gap: 10px;
        border: 1px dashed var(--rd-bordo);
        border-radius: 12px;
        padding: 10px 12px;
        cursor: pointer;
      }
      .file:focus-within {
        outline: 2px solid var(--rd-primario);
        outline-offset: 2px;
      }
      .file input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
      }
      .file ha-icon {
        color: var(--rd-primario);
        flex: none;
      }
      .nome-file {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .modi {
        display: grid;
        gap: 8px;
      }
      .modo {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        text-align: left;
        border: 1px solid var(--rd-bordo);
        border-radius: 12px;
        background: none;
        color: inherit;
        font: inherit;
        padding: 12px;
        cursor: pointer;
      }
      .modo small {
        display: block;
        color: var(--rd-testo-2);
        font-size: 13px;
        margin-top: 2px;
      }
      .modo.attivo {
        border-color: var(--rd-primario);
        background: color-mix(in srgb, var(--rd-primario) 8%, transparent);
      }
      .pallino {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid var(--rd-testo-2);
        flex: none;
        margin-top: 1px;
        box-sizing: border-box;
      }
      .modo.attivo .pallino {
        border: 5px solid var(--rd-primario);
      }
      .errori-file {
        background: color-mix(in srgb, var(--rd-errore) 10%, transparent);
        border-radius: 12px;
        padding: 10px 14px;
      }
      .errori-file b {
        color: var(--rd-errore);
      }
      .errori-file ul {
        margin: 6px 0 0;
        padding-left: 18px;
      }
      .errori-file li {
        margin: 3px 0;
      }
      .luogo {
        font-weight: 600;
        margin-right: 6px;
      }
      .luogo::after {
        content: ":";
      }
    `,
  ];
}

definisci("rd-impostazioni", RdImpostazioni);
