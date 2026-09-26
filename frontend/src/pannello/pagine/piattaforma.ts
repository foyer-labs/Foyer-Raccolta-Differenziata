// Piattaforma ecologica (SPEC §4.10, decisioni 62-68): nome, nota, periodi con
// l'orario settimanale, giorni con un orario diverso. Come Impostazioni, si lavora su
// una bozza e si salva passando da "Prima di salvare".
import { LitElement, css, html, nothing } from "lit";

import { nuovoId } from "../../comune/chip";
import { piuGiorni } from "../../comune/date";
import { definisci } from "../../comune/definisci";
import { base, moduli, pagina } from "../../comune/stili";
import { GIORNI_BREVI, T } from "../../comune/testi";
import type {
  Configurazione,
  EccezionePiattaforma,
  FasciaOraria,
  HomeAssistant,
  LetturaConfigurazione,
  PeriodoPiattaforma,
  Piattaforma,
} from "../../comune/tipi";
import { copia, proponi } from "../contesto";

const MASSIMO_PERIODI = 4;
const MASSIMO_FASCE = 3;
const FASCIA_NUOVA: FasciaOraria = ["08:00", "12:00"];

const settimanaVuota = (): FasciaOraria[][] => Array.from({ length: 7 }, () => []);

const minuti = (ora: string): number => {
  const [h, m] = ora.split(":").map(Number);
  return h * 60 + m;
};
const orario = (min: number): string => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Una fascia nuova già valida: un'ora dopo la fine dell'ultima, per tre ore. */
function fasciaDopo(fasce: FasciaOraria[]): FasciaOraria {
  const ultima = fasce.at(-1);
  if (!ultima) return FASCIA_NUOVA;
  const inizio = Math.min(minuti(ultima[1]) + 60, 22 * 60);
  return [orario(inizio), orario(Math.min(inizio + 180, 23 * 60 + 59))];
}

const ordinate = (fasce: FasciaOraria[]): FasciaOraria[] => [...fasce].sort((a, b) => a[0].localeCompare(b[0]));

export class RdPiattaforma extends LitElement {
  static override properties = {
    hass: { attribute: false },
    lettura: { attribute: false },
    _bozza: { state: true },
  };

  hass!: HomeAssistant;
  lettura!: LetturaConfigurazione;
  // undefined: nessuna bozza ancora; null: la piattaforma non c'è.
  private _bozza?: Piattaforma | null;
  private _base?: string;
  private _revisione?: number;

  haModifiche(): boolean {
    return this._bozza !== undefined && JSON.stringify(this._bozza) !== this._base;
  }

  override willUpdate(cambiati: Map<string, unknown>) {
    // Come Impostazioni: una rilettura identica non tocca le modifiche in corso.
    if (!cambiati.has("lettura")) return;
    const intatta = this._bozza === undefined || JSON.stringify(this._bozza) === this._base;
    if (this._revisione !== this.lettura.revisione && intatta) this._ricomincia();
  }

  private _ricomincia() {
    this._bozza = copia(this.lettura.configurazione.piattaforma ?? null);
    this._base = JSON.stringify(this._bozza);
    this._revisione = this.lettura.revisione;
  }

  chiudiEditor() {
    this._bozza = undefined;
    this._base = undefined;
    this._revisione = undefined;
  }

  private _aggiorna(parziale: Partial<Piattaforma>) {
    this._bozza = { ...this._bozza!, ...parziale };
  }

  private _nuova() {
    // Dopo "Togli", "Inserisci gli orari" riporta quelli di prima invece di ripartire
    // da zero: si voleva tenerli.
    const salvata = this.lettura.configurazione.piattaforma;
    if (salvata) {
      this._bozza = copia(salvata);
      return;
    }
    const anno = this.lettura.oggi.slice(0, 4);
    this._bozza = {
      nome: T.piattaformaTitolo,
      nota: "",
      periodi: [{ id: nuovoId(), dal: `${anno}-01-01`, al: `${anno}-12-31`, settimana: settimanaVuota() }],
      eccezioni: [],
    };
  }

  private _periodo(i: number, parziale: Partial<PeriodoPiattaforma>) {
    const periodi = this._bozza!.periodi.map((p, k) => (k === i ? { ...p, ...parziale } : p));
    this._aggiorna({ periodi });
  }

  private _fasce(i: number, giorno: number, fasce: FasciaOraria[]) {
    const settimana = this._bozza!.periodi[i].settimana.map((f, g) => (g === giorno ? fasce : f));
    this._periodo(i, { settimana });
  }

  private _aggiungiPeriodo() {
    // Parte il giorno dopo l'ultimo, dura un anno e copia l'orario: di solito cambia
    // poco, e si corregge prima di salvare.
    const ultimo = [...this._bozza!.periodi].filter((p) => p.al).sort((a, b) => a.al.localeCompare(b.al)).at(-1);
    const dal = ultimo ? piuGiorni(ultimo.al, 1) : this.lettura.oggi;
    const periodo: PeriodoPiattaforma = {
      id: nuovoId(),
      dal,
      al: piuGiorni(dal, 364),
      settimana: ultimo ? copia(ultimo.settimana) : settimanaVuota(),
    };
    this._aggiorna({ periodi: [...this._bozza!.periodi, periodo] });
  }

  private _eccezione(i: number, parziale: Partial<EccezionePiattaforma>) {
    const eccezioni = this._bozza!.eccezioni.map((e, k) => (k === i ? { ...e, ...parziale } : e));
    this._aggiorna({ eccezioni });
  }

  /** Il primo giorno da oggi senza già un orario diverso: due giorni uguali sono un errore. */
  private _giornoLibero(): string {
    const usati = new Set(this._bozza!.eccezioni.map((e) => e.data));
    let giorno = this.lettura.oggi;
    while (usati.has(giorno)) giorno = piuGiorni(giorno, 1);
    return giorno;
  }

  private _salva() {
    const nuova = copia(this.lettura.configurazione) as Configurazione;
    const b = this._bozza ? copia(this._bozza) : null;
    if (b) {
      b.nome = b.nome.trim();
      b.nota = b.nota.trim();
      b.periodi.sort((x, y) => x.dal.localeCompare(y.dal));
      b.eccezioni.sort((x, y) => x.data.localeCompare(y.data));
      for (const q of b.periodi) q.settimana = q.settimana.map(ordinate);
      for (const e of b.eccezioni) {
        e.nota = e.nota.trim();
        e.fasce = e.tipo === "chiusa" ? [] : ordinate(e.fasce);
      }
    }
    nuova.piattaforma = b;
    const togli = !b && this.lettura.configurazione.piattaforma;
    proponi(this, nuova, undefined, togli ? T.togliPiattaformaAvviso : undefined);
  }

  private _togli() {
    // Niente confirm(): la bozza vuota dice cosa succederà, "Prima di salvare" chiede
    // conferma, e Annulla riporta tutto.
    this._bozza = null;
  }

  private _campoOra(valore: string, cambia: (v: string) => void, etichetta: string) {
    // Un campo svuotato non cambia niente: un orario vuoto non è un orario.
    return html`<input type="time" required aria-label=${etichetta} .value=${valore}
      @change=${(e: Event) => {
        const v = (e.target as HTMLInputElement).value;
        if (v) cambia(v);
        else (e.target as HTMLInputElement).value = valore;
      }} />`;
  }

  private _fasceModulo(fasce: FasciaOraria[], cambia: (f: FasciaOraria[]) => void) {
    return html`<div class="fasce">
      ${fasce.length ? nothing : html`<span class="chiusa">${T.chiusa}</span>`}
      ${fasce.map(
        ([inizio, fine], k) => html`<span class="fascia">
          ${this._campoOra(inizio, (v) => cambia(fasce.map((f, j) => (j === k ? [v, f[1]] : f))), T.orariDa)}
          <span aria-hidden="true">–</span>
          ${this._campoOra(fine, (v) => cambia(fasce.map((f, j) => (j === k ? [f[0], v] : f))), T.orariA)}
          <button class="icona" aria-label=${T.togliFascia} title=${T.togliFascia} @click=${() => cambia(fasce.filter((_, j) => j !== k))}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </span>`,
      )}
      ${fasce.length < MASSIMO_FASCE
        ? html`<button class="icona" aria-label=${T.aggiungiFascia} title=${T.aggiungiFascia}
            @click=${() => cambia([...fasce, fasciaDopo(fasce)])}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>`
        : nothing}
    </div>`;
  }

  private _periodoModulo(p: PeriodoPiattaforma, i: number) {
    const togliibile = this._bozza!.periodi.length > 1;
    return html`<div class="periodo">
      <div class="testa-periodo">
        <div class="campo"><label>${T.dal}</label><input type="date" required .value=${p.dal} @change=${(e: Event) => this._data(e, p.dal, (dal) => this._periodo(i, { dal }))} /></div>
        <div class="campo"><label>${T.al}</label><input type="date" required .value=${p.al} @change=${(e: Event) => this._data(e, p.al, (al) => this._periodo(i, { al }))} /></div>
        ${togliibile
          ? html`<button class="bottone piccolo pericolo" @click=${() => this._aggiorna({ periodi: this._bozza!.periodi.filter((_, k) => k !== i) })}>${T.togliPeriodo}</button>`
          : nothing}
      </div>
      ${p.settimana.map(
        (fasce, g) => html`<div class="giorno">
          <b>${GIORNI_BREVI[g]}</b>
          ${this._fasceModulo(fasce, (f) => this._fasce(i, g, f))}
        </div>`,
      )}
    </div>`;
  }

  /** Una data svuotata torna quella di prima. */
  private _data(e: Event, prima: string, cambia: (v: string) => void) {
    const campo = e.target as HTMLInputElement;
    if (campo.value) cambia(campo.value);
    else campo.value = prima;
  }

  private _eccezioneModulo(e: EccezionePiattaforma, i: number) {
    return html`<div class="eccezione">
      <input type="date" required aria-label=${T.data} .value=${e.data} @change=${(ev: Event) => this._data(ev, e.data, (data) => this._eccezione(i, { data }))} />
      <div class="segmenti">
        ${(["chiusa", "aperta"] as const).map(
          (tipo) => html`<button class=${e.tipo === tipo ? "attivo" : ""}
            @click=${() => this._eccezione(i, { tipo, fasce: tipo === "aperta" && !e.fasce.length ? [FASCIA_NUOVA] : e.fasce })}>
            ${tipo === "chiusa" ? T.chiusa : T.aperta}
          </button>`,
        )}
      </div>
      ${e.tipo === "aperta"
        ? this._fasceModulo(e.fasce, (fasce) =>
            // Aperta senza fasce non esiste: tolta l'ultima, il giorno è chiuso.
            this._eccezione(i, fasce.length ? { fasce } : { tipo: "chiusa", fasce: [] }),
          )
        : nothing}
      <input class="nota" placeholder=${T.nota} maxlength="200" .value=${e.nota} @input=${(ev: InputEvent) => this._eccezione(i, { nota: (ev.target as HTMLInputElement).value })} />
      <button class="icona" aria-label=${T.elimina} title=${T.elimina} @click=${() => this._aggiorna({ eccezioni: this._bozza!.eccezioni.filter((_, k) => k !== i) })}>
        <ha-icon icon="mdi:delete-outline"></ha-icon>
      </button>
    </div>`;
  }

  override render() {
    if (this._bozza === undefined) return html``;
    const modificata = JSON.stringify(this._bozza) !== this._base;
    const b = this._bozza;
    const azioni = html`<div class="azioni-modulo">
      ${b ? html`<button class="bottone pericolo" @click=${this._togli}>${T.togliPiattaforma}</button>` : nothing}
      <span style="flex:1"></span>
      <button class="bottone" ?disabled=${!modificata} @click=${this._ricomincia}>${T.annulla}</button>
      <button class="bottone primario" ?disabled=${!modificata} @click=${this._salva}>${T.salva}</button>
    </div>`;
    if (!b) {
      return html`<div class="colonna">
        <div class="riquadro vuota">
          <ha-icon icon="mdi:recycle"></ha-icon>
          <h2>${T.piattaformaTitolo}</h2>
          <p class="aiuto">${T.piattaformaAiuto}</p>
          <p>${this.lettura.configurazione.piattaforma ? T.piattaformaDaTogliere : T.piattaformaVuota}</p>
          <button class="bottone primario" @click=${this._nuova}>${T.inserisciOrari}</button>
        </div>
        ${modificata ? azioni : nothing}
      </div>`;
    }
    return html`<div class="colonna">
      <div class="riquadro">
        <h2><ha-icon icon="mdi:recycle" aria-hidden="true"></ha-icon>${T.piattaformaTitolo}</h2>
        <p class="aiuto">${T.piattaformaAiuto}</p>
        <div class="modulo">
          <div class="campo">
            <label for="nome">${T.nomePiattaforma}</label>
            <input id="nome" maxlength="40" .value=${b.nome} @input=${(e: InputEvent) => this._aggiorna({ nome: (e.target as HTMLInputElement).value })} />
            <small>${T.nomePiattaformaAiuto}</small>
          </div>
          <div class="campo">
            <label for="nota-p">${T.notaPiattaforma}</label>
            <input id="nota-p" maxlength="200" .value=${b.nota} @input=${(e: InputEvent) => this._aggiorna({ nota: (e.target as HTMLInputElement).value })} />
            <small>${T.notaPiattaformaAiuto}</small>
          </div>
        </div>
      </div>

      <div class="riquadro">
        <h2>${T.periodi} <span class="conta">${b.periodi.length}</span></h2>
        <p class="aiuto">${T.periodiAiuto}</p>
        ${b.periodi.map((p, i) => this._periodoModulo(p, i))}
        ${b.periodi.length < MASSIMO_PERIODI
          ? html`<button class="bottone" @click=${this._aggiungiPeriodo}><ha-icon icon="mdi:plus"></ha-icon>${T.aggiungiPeriodo}</button>`
          : nothing}
      </div>

      <div class="riquadro">
        <h2>${T.eccezioniPiattaforma} <span class="conta">${b.eccezioni.length}</span></h2>
        <p class="aiuto">${T.eccezioniPiattaformaAiuto}</p>
        ${b.eccezioni.map((e, i) => this._eccezioneModulo(e, i))}
        <button class="bottone"
          @click=${() => this._aggiorna({ eccezioni: [...b.eccezioni, { id: nuovoId(), data: this._giornoLibero(), tipo: "chiusa", fasce: [], nota: "" }] })}>
          <ha-icon icon="mdi:plus"></ha-icon>${T.aggiungiEccezionePiattaforma}
        </button>
      </div>
      ${azioni}
    </div>`;
  }

  static override styles = [
    base,
    pagina,
    moduli,
    css`
      .colonna {
        max-width: 760px;
      }
      h2 ha-icon {
        --mdc-icon-size: 22px;
        color: var(--rd-primario);
        margin-right: 6px;
      }
      .vuota {
        text-align: center;
        padding: 28px 20px;
      }
      .vuota h2 {
        justify-content: center;
      }
      .vuota > ha-icon {
        --mdc-icon-size: 40px;
        color: var(--rd-primario);
      }
      .periodo {
        border: 1px solid var(--rd-bordo);
        border-radius: 14px;
        padding: 12px;
        margin-bottom: 12px;
      }
      .testa-periodo {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: end;
        margin-bottom: 8px;
      }
      .testa-periodo .campo {
        flex: 1 1 140px;
        margin: 0;
      }
      .giorno {
        display: grid;
        grid-template-columns: 44px 1fr;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-top: 1px solid var(--rd-bordo);
      }
      .fasce {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 10px;
      }
      .fascia {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .fascia input[type="time"] {
        width: 104px;
        padding: 6px 8px;
      }
      .chiusa {
        color: var(--rd-testo-2);
        font-size: 13.5px;
      }
      .icona {
        border: 0;
        background: none;
        color: var(--rd-testo-2);
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        --mdc-icon-size: 18px;
      }
      .icona:hover {
        background: var(--rd-superficie-2);
        color: var(--rd-testo);
      }
      .eccezione {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 10px;
        padding: 10px 0;
        border-top: 1px solid var(--rd-bordo);
      }
      .eccezione input[type="date"] {
        width: 150px;
      }
      .eccezione .nota {
        flex: 1 1 160px;
      }
      .bottone ha-icon {
        --mdc-icon-size: 18px;
      }
      .azioni-modulo {
        margin-top: 16px;
      }
    `,
  ];
}

definisci("rd-piattaforma", RdPiattaforma);
