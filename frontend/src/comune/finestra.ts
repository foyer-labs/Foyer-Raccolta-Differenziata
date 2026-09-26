// Una finestra sopra la pagina, per i moduli e per "Prima di salvare".
import { LitElement, css, html } from "lit";
import { base } from "./stili";
import { T } from "./testi";

export class RdFinestra extends LitElement {
  static override properties = {
    titolo: {},
    aperta: { type: Boolean, reflect: true },
  };

  titolo = "";
  aperta = false;

  static override styles = [
    base,
    css`
      :host {
        display: none;
      }
      :host([aperta]) {
        display: block;
      }
      .velo {
        position: fixed;
        inset: 0;
        background: rgba(10, 14, 20, 0.5);
        display: grid;
        place-items: center;
        z-index: 20;
        padding: 16px;
        overflow-y: auto;
      }
      .dialogo {
        outline: none;
        background: var(--rd-superficie);
        border-radius: 20px;
        max-width: 560px;
        width: 100%;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        max-height: calc(100vh - 32px);
        display: flex;
        flex-direction: column;
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
        --mdc-icon-size: 22px;
      }
      .contenuto {
        padding: 8px 20px 20px;
        overflow-y: auto;
      }
    `,
  ];

  private _prima?: Element | null;

  override updated(cambiati: Map<string, unknown>) {
    if (!cambiati.has("aperta")) return;
    if (this.aperta) {
      this._prima = document.activeElement;
      this.renderRoot.querySelector<HTMLElement>(".dialogo")?.focus();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    (this._prima as HTMLElement | null)?.focus?.();
  }

  private _chiudi() {
    this.dispatchEvent(new CustomEvent("chiudi"));
  }

  override render() {
    return html`<div
      class="velo"
      @click=${(e: Event) => e.target === e.currentTarget && this._chiudi()}
      @keydown=${(e: KeyboardEvent) => e.key === "Escape" && this._chiudi()}
    >
      <div class="dialogo" role="dialog" aria-modal="true" aria-label=${this.titolo} tabindex="-1">
        <header>
          <h3>${this.titolo}</h3>
          <button aria-label=${T.chiudi} @click=${this._chiudi}><ha-icon icon="mdi:close"></ha-icon></button>
        </header>
        <div class="contenuto"><slot></slot></div>
      </div>
    </div>`;
  }
}

if (!customElements.get("rd-finestra")) customElements.define("rd-finestra", RdFinestra);
