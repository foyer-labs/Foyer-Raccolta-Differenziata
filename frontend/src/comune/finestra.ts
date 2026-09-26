// Una finestra sopra la pagina, per i moduli, per "Prima di salvare" e nelle card.
//
// È un <dialog> nativo aperto con showModal(): sta nello strato più alto della pagina,
// quindi nessun antenato lo può tagliare (una card con backdrop-filter, un carosello
// con transform), rende inerte tutto il resto e trattiene il focus. Escape e il clic
// fuori non la chiudono da soli: chiedono di chiudere con l'evento "chiudi", e chi la
// usa decide.
import { LitElement, css, html } from "lit";
import { base } from "./stili";
import { T } from "./testi";
import { definisci } from "./definisci";

// L'icona "mdi:close" disegnata qui: ha-icon la carica in modo asincrono e in WebKit,
// dentro la finestra, poteva restare vuota. (Material Design Icons, Apache-2.0.)
const CHIUDI = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";

/** L'elemento che ha davvero il focus, anche dentro gli shadow DOM. */
function focusProfondo(): HTMLElement | null {
  let attivo = document.activeElement as HTMLElement | null;
  while (attivo?.shadowRoot?.activeElement) attivo = attivo.shadowRoot.activeElement as HTMLElement;
  return attivo;
}

export class RdFinestra extends LitElement {
  static override properties = {
    titolo: {},
    aperta: { type: Boolean, reflect: true },
    bloccata: { type: Boolean, reflect: true },
  };

  titolo = "";
  aperta = false;
  /** Durante un'operazione in corso la finestra non si chiude. */
  bloccata = false;

  static override styles = [
    base,
    css`
      :host {
        display: contents;
      }
      dialog {
        /* Il pannello nasconde le finestre delle pagine mentre "Prima di salvare" è
           aperta sopra di loro: una sola finestra, un solo paio di pulsanti. */
        visibility: var(--rd-visibilita-finestre, visible);
        border: 0;
        padding: 0;
        margin: auto;
        color: var(--rd-testo);
        background: var(--rd-superficie);
        border-radius: 20px;
        width: min(560px, calc(100% - 32px));
        max-width: none;
        max-height: calc(100dvh - 32px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        overscroll-behavior: contain;
      }
      dialog:focus {
        outline: none;
      }
      dialog[open] {
        display: flex;
        flex-direction: column;
      }
      dialog::backdrop {
        background: rgba(10, 14, 20, 0.5);
      }
      header {
        display: flex;
        align-items: center;
        padding: 16px 20px 8px;
        gap: 8px;
      }
      h3 {
        margin: 0;
        font-size: 18px;
        flex: 1;
      }
      header button {
        border: 0;
        background: none;
        cursor: pointer;
        color: var(--rd-testo-2);
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        flex: none;
      }
      header button svg {
        display: block;
        width: 22px;
        height: 22px;
        fill: currentColor;
      }
      header button[disabled] {
        opacity: 0.4;
        cursor: default;
      }
      .contenuto {
        padding: 8px 20px 16px;
        overflow-y: auto;
        overscroll-behavior: contain;
        flex: 1 1 auto;
      }
      footer {
        padding: 12px 20px 16px;
        border-top: 1px solid var(--rd-bordo);
      }
      footer:not(:has(*)) {
        display: none;
      }
      @media (max-width: 600px) {
        dialog {
          margin: auto 0 0;
          width: 100%;
          border-radius: 20px 20px 0 0;
          max-height: 92dvh;
        }
        footer,
        .contenuto:last-child {
          /* La barra in basso dei telefoni (iPhone, app Companion) non copre i pulsanti. */
          padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        }
      }
    `,
  ];

  private _prima: HTMLElement | null = null;
  private _giuFuori = false;

  private get _dialogo(): HTMLDialogElement | null {
    return this.renderRoot.querySelector("dialog");
  }

  override updated() {
    const dialogo = this._dialogo;
    if (!dialogo) return;
    if (this.aperta && !dialogo.open && this.isConnected) {
      this._prima = focusProfondo();
      dialogo.showModal();
      // Il focus sulla finestra, non sul primo pulsante (la X): niente riquadro di
      // focus dove l'utente non ha ancora fatto nulla; Tab parte da qui.
      dialogo.focus();
    } else if (!this.aperta && dialogo.open) {
      dialogo.close();
      this._prima?.focus?.();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Tolto dalla pagina, il <dialog> esce dallo strato alto da solo: il focus torna
    // a chi l'aveva aperta, se c'è ancora.
    if (this._prima?.isConnected) this._prima.focus();
  }

  private _chiudi() {
    if (this.bloccata) return;
    this.dispatchEvent(new CustomEvent("chiudi"));
  }

  private _annulla(e: Event) {
    // Escape: il browser chiuderebbe da solo; decide chi usa la finestra.
    e.preventDefault();
    this._chiudi();
  }

  private _tasto(e: KeyboardEvent) {
    // Escape non arriva alle finestre di Home Assistant sotto (editor delle card).
    if (e.key === "Escape") e.stopPropagation();
  }

  override render() {
    return html`<dialog
      tabindex="-1"
      aria-label=${this.titolo}
      @cancel=${this._annulla}
      @keydown=${this._tasto}
      @pointerdown=${(e: PointerEvent) => (this._giuFuori = e.target === this._dialogo)}
      @click=${(e: MouseEvent) => {
        // Chiude solo un clic cominciato e finito fuori dalla finestra: una
        // selezione di testo trascinata fuori non chiude niente.
        if (e.target === this._dialogo && this._giuFuori) this._chiudi();
        this._giuFuori = false;
      }}
    >
      <header>
        <h3>${this.titolo}</h3>
        <button aria-label=${T.chiudi} ?disabled=${this.bloccata} @click=${this._chiudi}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${CHIUDI} /></svg>
        </button>
      </header>
      <div class="contenuto"><slot></slot></div>
      <footer><slot name="azioni"></slot></footer>
    </dialog>`;
  }
}

definisci("rd-finestra", RdFinestra);
