// Banco di prova: un finto hass per pannello e card, con dati d'esempio.
// Non è nel repository (.gitignore): si ricrea quando serve.
const ICONE = await (await fetch("./icone.json", { cache: "no-store" })).json();

// --- elementi di Home Assistant che il frontend usa -------------------------------
class FintaIcona extends HTMLElement {
  static observedAttributes = ["icon"];
  set icon(v) { this._icon = v; this.render(); }
  get icon() { return this._icon; }
  attributeChangedCallback(_n, _v, nuovo) { this.icon = nuovo; }
  connectedCallback() { this.render(); }
  render() {
    const d = ICONE[this._icon] ?? ICONE["mdi:trash-can-outline"];
    this.style.display = "inline-flex";
    // Nello shadow DOM, come il vero ha-icon: figli nel light DOM sposterebbero
    // gli indici dei nodi che Lit calcola mentre clona il template.
    const radice = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    radice.innerHTML = `<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor"><path d="${d}"/></svg>`;
  }
}
customElements.define("ha-icon", FintaIcona);
class FintoMenu extends HTMLElement {
  connectedCallback() {
    (this.shadowRoot ?? this.attachShadow({ mode: "open" })).innerHTML = `<svg viewBox="0 0 24 24" style="width:24px;height:24px;margin:0 12px;fill:currentColor"><path d="${ICONE["mdi:menu"]}"/></svg>`;
  }
}
customElements.define("ha-menu-button", FintoMenu);
class FintaCard extends HTMLElement {}
customElements.define("ha-card", FintaCard);

// --- dati d'esempio ------------------------------------------------------------------
export const OGGI = new URLSearchParams(location.search).get("oggi") ?? "2026-09-23";
const tip = (id, nome, colore, icona, note = "") => ({ id, nome, colore, icona, note, esposizione: null });
const sett = (id, t, giorni, ogni = 1, ancora = "2026-09-21", periodo = { tipo: "sempre" }, nome = "") =>
  ({ id, tipologia: t, nome, ricorrenza: { tipo: "settimanale", ogni, giorni, ancora }, periodo });
export const CONFIG = {
  revisione: 4,
  tipologie: [
    tip("umido", "Umido", "#795548", "mdi:food-apple", "Scarti di cucina, fondi di caffè, gusci d'uovo"),
    tip("carta", "Carta", "#1e88e5", "mdi:newspaper-variant", "Giornali, cartone piegato. Niente scontrini."),
    tip("plastica", "Plastica", "#fdd835", "mdi:bottle-soda", "Anche lattine e tetrapak"),
    tip("vetro", "Vetro", "#43a047", "mdi:glass-fragile"),
    tip("secco", "Secco", "#757575", "mdi:trash-can"),
    tip("verde", "Verde", "#8bc34a", "mdi:leaf", "Sfalci e potature, in fascine"),
    tip("ingombranti", "Ingombranti", "#8e24aa", "mdi:sofa", "Su prenotazione al numero verde"),
  ],
  regole: [
    sett("r1", "umido", [0, 3]),
    sett("r2", "carta", [1], 2, "2026-09-22"),
    sett("r3", "plastica", [3]),
    sett("r4", "vetro", [4], 2, "2026-09-25"),
    sett("r5", "secco", [4]),
    sett("r6", "verde", [5], 1, "2026-09-21", { tipo: "annuale", dal: "04-01", al: "10-31" }, "Estate"),
    sett("r7", "verde", [5], 2, "2026-11-07", { tipo: "annuale", dal: "11-01", al: "03-31" }, "Inverno"),
  ],
  eccezioni: [
    { id: "e1", tipo: "sposta", tipologia: "carta", da: "2026-12-08", a: "2026-12-09", nota: "Immacolata" },
    { id: "e2", tipo: "togli", tipologia: "umido", data: "2026-12-24", nota: "" },
    { id: "e3", tipo: "aggiungi", tipologia: "ingombranti", data: "2026-10-14", nota: "Divano e materasso" },
  ],
  esposizione: { inizio_giorno: "giorno_prima", inizio_ora: "20:00", fine_ora: "06:00" },
  patrono: { data: "12-07", nome: "Sant'Ambrogio" },
  valido_fino_al: "2026-12-31",
  promemoria: [
    { id: "p1", nome: "La sera prima", attivo: true, quando: { tipo: "giorni_prima", giorni: 1, ora: "20:30" }, tipologie: null,
      destinatari: [{ tipo: "servizio", id: "mobile_app_telefono_luca" }, { tipo: "servizio", id: "mobile_app_telefono_anna" }] },
    { id: "p2", nome: "Il vetro", attivo: true, quando: { tipo: "giorni_prima", giorni: 2, ora: "19:00" }, tipologie: ["vetro"],
      destinatari: [{ tipo: "entita", id: "notify.telegram_famiglia" }] },
    { id: "p3", nome: "Ingombranti", attivo: false, quando: { tipo: "giorno_stesso", ora: "07:00" }, tipologie: ["ingombranti"],
      destinatari: [{ tipo: "servizio", id: "mobile_app_telefono_luca" }] },
  ],
  solleciti: { attivi: false, richiami: 1, richiamo_dopo: 30 },
  sospensioni: [{ dal: "2027-08-08", al: "2027-08-23" }],
};

// --- un calcolo semplificato, sufficiente per le immagini --------------------------
const d = (iso) => { const [a, m, g] = iso.split("-").map(Number); return new Date(a, m - 1, g); };
const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
const piu = (s, n) => { const x = d(s); x.setDate(x.getDate() + n); return iso(x); };
const gs = (s) => (d(s).getDay() + 6) % 7;
const lun = (s) => piu(s, -gs(s));
const FESTIVI = { "01-01": "Capodanno", "01-06": "Epifania", "04-25": "Liberazione", "05-01": "Festa del lavoro", "06-02": "Festa della Repubblica", "08-15": "Ferragosto", "10-04": "San Francesco d'Assisi", "11-01": "Ognissanti", "12-08": "Immacolata Concezione", "12-25": "Natale", "12-26": "Santo Stefano" };
function genera(r, s) {
  const x = d(s);
  if (r.tipo === "settimanale") return r.giorni.includes(gs(s)) && Math.round((d(lun(s)) - d(lun(r.ancora))) / 6048e5) % r.ogni === 0;
  if (r.tipo === "mensile_posizione") {
    if (gs(s) !== r.giorno) return false;
    const ultimo = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
    return r.posizioni.includes(Math.floor((x.getDate() - 1) / 7) + 1) || (r.posizioni.includes(-1) && x.getDate() + 7 > ultimo);
  }
  return r.giorni.includes(x.getDate());
}
function copre(p, s) {
  if (p.tipo === "sempre") return true;
  if (p.tipo === "con_anno") return p.dal <= s && s <= p.al;
  const k = s.slice(5);
  return p.dal <= p.al ? p.dal <= k && k <= p.al : k >= p.dal || k <= p.al;
}
export function calcola(config, dal, al, ignorati = []) {
  const ritiri = [];
  for (const t of config.tipologie) {
    const giorni = new Map();
    for (let s = dal; s <= al; s = piu(s, 1)) {
      const regole = config.regole.filter((r) => r.tipologia === t.id && copre(r.periodo, s) && genera(r.ricorrenza, s)).map((r) => r.id);
      if (regole.length) giorni.set(s, { origine: "regola", regole, spostato_dal: null });
    }
    const ecc = config.eccezioni.filter((e) => e.tipologia === t.id);
    ecc.filter((e) => e.tipo === "togli").forEach((e) => giorni.delete(e.data));
    ecc.filter((e) => e.tipo === "sposta").forEach((e) => giorni.delete(e.da));
    ecc.filter((e) => e.tipo === "sposta" && e.a >= dal && e.a <= al).forEach((e) => giorni.has(e.a) || giorni.set(e.a, { origine: "spostato", regole: [], spostato_dal: e.da }));
    ecc.filter((e) => e.tipo === "aggiungi" && e.data >= dal && e.data <= al).forEach((e) => giorni.has(e.data) || giorni.set(e.data, { origine: "aggiunto", regole: [], spostato_dal: null }));
    const f = t.esposizione ?? config.esposizione;
    for (const [s, o] of giorni) {
      const festivo = FESTIVI[s.slice(5)] ?? (config.patrono && config.patrono.data === s.slice(5) ? config.patrono.nome : null);
      ritiri.push({ data: s, tipologia: t.id, ...o, festivo,
        inizio_esposizione: `${f.inizio_giorno === "giorno_prima" ? piu(s, -1) : s}T${f.inizio_ora}:00+02:00`,
        fine_esposizione: `${s}T${f.fine_ora}:00+02:00`, da_verificare: !!config.valido_fino_al && s > config.valido_fino_al });
    }
  }
  const ordine = Object.fromEntries(config.tipologie.map((t, i) => [t.id, i]));
  return ritiri.sort((a, b) => a.data.localeCompare(b.data) || ordine[a.tipologia] - ordine[b.tipologia]);
}

// --- il finto hass -------------------------------------------------------------------
const SOSPESO = new URLSearchParams(location.search).get("sospeso");
export function creaHass({ conferme = [] } = {}) {
  const ascoltatori = [];
  let config = structuredClone(CONFIG);
  let barra = true;
  const ignorati = [];
  const hass = {
    user: { is_admin: true, name: "Luca" },
    states: {
      "notify.telegram_famiglia": { state: "unknown", attributes: { friendly_name: "Telegram famiglia" } },
      "notify.alexa_cucina": { state: "unknown", attributes: { friendly_name: "Alexa cucina" } },
      "notify.email_casa": { state: "unknown", attributes: { friendly_name: "Email di casa" } },
    },
    services: { notify: { mobile_app_telefono_luca: {}, mobile_app_telefono_anna: {}, mobile_app_tablet_cucina: {},
      mobile_app_telefono_nonna: {}, pushover: {}, persistent_notification: {}, send_message: {} } },
    themes: { darkMode: document.documentElement.dataset.tema === "scuro" },
    locale: { language: "it" },
    connection: { subscribeMessage: async (f) => { ascoltatori.push(f); return () => undefined; } },
    async callWS(msg) {
      const t = msg.type.split("/").slice(1).join("/");
      if (t === "config/leggi") {
        return { configurazione: structuredClone(config), revisione: config.revisione, oggi: OGGI, problemi: [],
          anomalie: [
            { codice: "tipologia_senza_ritiri", gravita: "info", tipologia: "ingombranti", regole: [], eccezione: null, data: null, intervalli: [], giorni: [], conteggio: 0 },
          ].filter((a) => a.codice !== "tipologia_senza_ritiri" || !calcola(config, OGGI, piu(OGGI, 365)).some((r) => r.tipologia === "ingombranti")),
          festivi_ignorati: ignorati, mostra_barra_laterale: barra };
      }
      if (t === "ritiri") {
        return { disponibile: true, oggi: OGGI, tipologie: config.tipologie, ritiri: calcola(config, msg.dal, msg.al),
          conferme, valido_fino_al: config.valido_fino_al, sospeso: { manuale: false, fino_al: SOSPESO } };
      }
      if (t === "conferma") {
        for (const r of calcola(config, msg.data, msg.data).filter((r) => !msg.tipologie || msg.tipologie.includes(r.tipologia)))
          conferme.push({ data: r.data, tipologia: r.tipologia, istante: new Date().toISOString().slice(0, 11) + "21:04:00+02:00", utente: "Anna" });
        ascoltatori.forEach((f) => f({ evento: "aggiornato" }));
        return { confermati: 1 };
      }
      if (t === "annulla_conferma") {
        conferme.splice(0, conferme.length, ...conferme.filter((c) => !(c.data === msg.data && c.tipologia === msg.tipologia)));
        ascoltatori.forEach((f) => f({ evento: "aggiornato" }));
        return null;
      }
      if (t === "anteprima") {
        const al = piu(OGGI, (msg.giorni ?? 60) - 1);
        const dopo = calcola(msg.configurazione, OGGI, al);
        const fine = piu(OGGI, 59);
        const chiave = (r) => `${r.data}|${r.tipologia}`;
        const a = new Set(calcola(config, OGGI, fine).map(chiave));
        const b = new Set(calcola(msg.configurazione, OGGI, fine).map(chiave));
        const el = (s) => [...s].sort().map((k) => ({ data: k.split("|")[0], tipologia: k.split("|")[1] }));
        return { problemi: [], ritiri: dopo, anomalie: [],
          differenze: { aggiunti: el([...b].filter((k) => !a.has(k))), tolti: el([...a].filter((k) => !b.has(k))) } };
      }
      if (t === "config/salva") { config = { ...msg.configurazione, revisione: config.revisione + 1 }; return { salvato: true, problemi: [], revisione: config.revisione }; }
      if (t === "anomalie/ignora") { ignorati.push({ data: msg.data, tipologia: msg.tipologia }); return null; }
      if (t === "barra_laterale") { barra = msg.mostra; return null; }
      throw new Error(`comando non previsto: ${msg.type}`);
    },
  };
  return hass;
}

// --- tema di Home Assistant ----------------------------------------------------------
const CHIARO = { "--primary-color": "#03a9f4", "--primary-text-color": "#212121", "--secondary-text-color": "#727272",
  "--card-background-color": "#ffffff", "--secondary-background-color": "#e5e5e5", "--primary-background-color": "#fafafa",
  "--divider-color": "rgba(0,0,0,.12)", "--app-header-background-color": "#03a9f4", "--app-header-text-color": "#ffffff",
  "--text-primary-color": "#ffffff", "--warning-color": "#ffa600", "--error-color": "#db4437", "--success-color": "#43a047",
  "--ha-card-box-shadow": "0px 2px 1px -1px rgba(0,0,0,.2), 0px 1px 1px 0px rgba(0,0,0,.14), 0px 1px 3px 0px rgba(0,0,0,.12)" };
const SCURO = { ...CHIARO, "--primary-text-color": "#e1e1e1", "--secondary-text-color": "#9b9b9b", "--card-background-color": "#1c1c1c",
  "--secondary-background-color": "#282828", "--primary-background-color": "#111111", "--divider-color": "rgba(225,225,225,.12)",
  "--app-header-background-color": "#101e24", "--ha-card-box-shadow": "none" };
const scuro = new URLSearchParams(location.search).get("tema") === "scuro";
document.documentElement.dataset.tema = scuro ? "scuro" : "chiaro";
for (const [k, v] of Object.entries(scuro ? SCURO : CHIARO)) document.documentElement.style.setProperty(k, v);
document.body.style.cssText = `margin:0;background:var(--primary-background-color);font-family:Roboto,"Segoe UI",system-ui,sans-serif`;
