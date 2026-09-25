// Tutti i testi visibili del frontend (INV-5): nessun componente scrive testo suo.
import { daIso, giornoSettimana } from "./date";
import type { Anomalia, Periodo, Problema, Regola, Ricorrenza } from "./tipi";

export const GIORNI = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
export const GIORNI_BREVI = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
export const GIORNI_INIZIALI = ["L", "M", "M", "G", "V", "S", "D"];
export const MESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];
export const POSIZIONI: Record<number, string> = { 1: "primo", 2: "secondo", 3: "terzo", 4: "quarto", [-1]: "ultimo" };
export const POSIZIONI_BREVI: Record<number, string> = { 1: "1°", 2: "2°", 3: "3°", 4: "4°", [-1]: "Ultimo" };

export const T = {
  titolo: "Raccolta differenziata",
  carica: "Caricamento…",
  nonCaricata: "L'integrazione Raccolta differenziata non è caricata. Controlla Impostazioni → Dispositivi e servizi.",
  pagine: {
    panoramica: "Panoramica",
    tipologie: "Tipologie",
    regole: "Regole",
    eccezioni: "Eccezioni",
    promemoria: "Promemoria",
    impostazioni: "Impostazioni",
  },
  oggi: "Oggi",
  domani: "Domani",
  nessunRitiro: "Nessun ritiro",
  salva: "Salva",
  annulla: "Annulla",
  modifica: "Modifica",
  elimina: "Elimina",
  chiudi: "Chiudi",
  primaDiSalvare: "Prima di salvare",
  cosaCambia: "Ecco cosa cambia nei prossimi 60 giorni.",
  nienteCambia: "Nessun ritiro cambia nei prossimi 60 giorni.",
  salvato: "Salvato",
  altroHaSalvato: "Qualcun altro ha salvato nel frattempo: la pagina è stata aggiornata, riprova.",
  nonSalvato: "Non salvato: correggi questi punti.",
  // Panoramica
  prossimiRitiri: "Prossimi ritiri",
  giorni30: "30 giorni",
  daControllare: "Da controllare",
  tuttoInOrdine: "Tutto in ordine: nessuna segnalazione.",
  calendarioComune: "Calendario del comune",
  giorniValidita: "giorni di validità",
  validoFino: (d: string) => `fino al ${dataLunga(d)}`,
  scaduto: (d: string) => `scaduto il ${dataLunga(d)}: i ritiri successivi sono da verificare`,
  senzaValidita: "Non hai indicato fino a quando vale. Indicalo in Impostazioni: un mese prima ti ricorderemo di controllare quello nuovo.",
  creaEccezione: "Crea eccezione",
  ignora: "Ignora",
  aggiungiData: "Aggiungi una data",
  apriRegole: "Vedi le regole",
  festiviIgnorati: "Festivi ignorati",
  ripristina: "Ripristina avviso",
  configurazioneNonValida: "La configurazione salvata non è valida: i sensori non sono disponibili finché non la correggi.",
  // Tipologie
  aiutoTipologie: "Una tipologia senza regole prende i ritiri solo dalle date aggiunte: va bene per gli ingombranti.",
  nuovaTipologia: "Nuova tipologia",
  nessunaNota: "Nessuna nota",
  prossimo: "Prossimo",
  nome: "Nome",
  colore: "Colore",
  icona: "Icona",
  iconaAiuto: "Un'icona di Material Design, per esempio mdi:food-apple",
  note: "Note: cosa ci va",
  finestraPropria: "Orario di esposizione diverso da quello generale",
  eliminaTipologia: (nome: string, regole: number, eccezioni: number) =>
    `Eliminare ${nome}? Spariscono anche ${regole} ${regole === 1 ? "regola" : "regole"} e ${eccezioni} ${eccezioni === 1 ? "eccezione" : "eccezioni"}, e il suo sensore.`,
  // Regole
  aiutoRegole: "Una regola dice ogni quanto passa un rifiuto. Più regole della stessa tipologia si sommano; una regola con l'anno sostituisce le altre nel suo periodo.",
  nuovaRegola: "Nuova regola",
  nessunaRegola: "Nessuna regola: i ritiri vengono solo dalle eccezioni.",
  nomeRegola: "Nome (facoltativo)",
  nomeRegolaAiuto: "Per riconoscerla: Estate, Inverno, Calendario 2027…",
  ricorrenza: "Ricorrenza",
  ogniSettimane: "Ogni N settimane",
  posizioneMese: "N-esimo giorno del mese",
  dataMese: "Giorno del mese",
  ogni: "Ogni",
  settimane: (n: number) => (n === 1 ? "settimana" : `${n} settimane`),
  neiGiorni: "Nei giorni",
  ancora: "Un giorno in cui questo ritiro c'è stato o ci sarà",
  ancoraAiuto: "Serve a capire quali settimane contano: un giorno sbagliato di una settimana sposta tutto il calendario.",
  quali: "Quali",
  giornoSettimana: "Giorno della settimana",
  giorniDelMese: "Giorni del mese",
  periodo: "Periodo",
  sempre: "Tutto l'anno",
  annuale: "Ogni anno dal… al…",
  conAnno: "Solo dal… al…",
  dal: "Dal",
  al: "Al",
  mese: "Mese",
  giorno: "Giorno",
  prossimeDate: "Le prossime date",
  nessunaData: "Nessuna data nei prossimi 12 mesi",
  // Eccezioni
  aiutoEccezioni: "Le date che il calendario del comune cambia: un ritiro in più, uno annullato, uno spostato.",
  nessunaEccezione: "Nessuna eccezione.",
  aggiungiRitiro: "Aggiungi un ritiro",
  togliRitiro: "Togli un ritiro",
  spostaRitiro: "Sposta un ritiro",
  tipoEccezione: { aggiungi: "Aggiunto", togli: "Tolto", sposta: "Spostato" } as Record<string, string>,
  tipologia: "Tipologia",
  data: "Data",
  da: "Da",
  a: "A",
  nota: "Nota (facoltativa)",
  passate: "Passate",
  // Impostazioni
  mostraBarra: "Mostra nella barra laterale",
  mostraBarraAiuto: "Se la nascondi, trovi il pannello nella pagina del dispositivo «Raccolta differenziata», o in Impostazioni → Dispositivi e servizi.",
  validita: "Calendario valido fino al",
  validitaAiuto: "Un mese prima ti ricordiamo di controllare il calendario nuovo del comune.",
  patrono: "Santo patrono",
  patronoAiuto: "Segnalato come festivo, come le feste nazionali.",
  nomePatrono: "Nome",
  esposizione: "Quando si espongono i sacchi",
  esposizioneAiuto: "Vale per tutte le tipologie che non hanno un orario proprio.",
  inizioGiorno: { giorno_prima: "il giorno prima", giorno_stesso: "il giorno stesso" } as Record<string, string>,
  dalle: "Dalle",
  del: "del",
  entroLe: "Entro le (giorno del ritiro)",
  togli: "Togli",
};

export function dataLunga(iso: string): string {
  const d = daIso(iso);
  return `${d.getDate()} ${MESI[d.getMonth()]} ${d.getFullYear()}`;
}

export function dataBreve(iso: string): string {
  const d = daIso(iso);
  return `${GIORNI_BREVI[giornoSettimana(iso)].toLowerCase()} ${d.getDate()} ${MESI[d.getMonth()].slice(0, 3)}`;
}

export function giornoMese(iso: string): string {
  const d = daIso(iso);
  return `${d.getDate()} ${MESI[d.getMonth()].slice(0, 3)}`;
}

const elenco = (voci: string[]): string =>
  voci.length <= 1 ? voci.join("") : `${voci.slice(0, -1).join(", ")} e ${voci[voci.length - 1]}`;

/** Una ricorrenza scritta come la scriverebbe il comune. */
export function fraseRicorrenza(r: Ricorrenza): string {
  if (r.tipo === "settimanale") {
    const giorni = elenco([...r.giorni].sort().map((g) => GIORNI[g]));
    if (r.ogni === 1) return `Ogni settimana, il ${giorni}`;
    if (r.ogni === 2) return `Una settimana sì e una no, il ${giorni}`;
    return `Ogni ${r.ogni} settimane, il ${giorni}`;
  }
  if (r.tipo === "mensile_posizione") {
    const pos = [...r.posizioni].sort((a, b) => (a === -1 ? 9 : a) - (b === -1 ? 9 : b));
    return `Il ${elenco(pos.map((p) => POSIZIONI[p]))} ${GIORNI[r.giorno]} del mese`;
  }
  return `Il giorno ${elenco([...r.giorni].sort((a, b) => a - b).map(String))} di ogni mese`;
}

const meseGiorno = (mmgg: string): string => {
  const [m, g] = mmgg.split("-").map(Number);
  return `${g} ${MESI[m - 1]}`;
};

export function frasePeriodo(p: Periodo): string {
  if (p.tipo === "sempre") return "Tutto l'anno";
  if (p.tipo === "annuale") return `Dal ${meseGiorno(p.dal)} al ${meseGiorno(p.al)}, ogni anno`;
  return `Dal ${dataLunga(p.dal)} al ${dataLunga(p.al)}`;
}

const MESSAGGI_PROBLEMI: Record<string, string> = {
  nome_non_valido: "il nome è vuoto o troppo lungo",
  nome_duplicato: "c'è già una tipologia con questo nome",
  colore_non_valido: "il colore non è valido",
  icona_non_valida: "l'icona deve iniziare con mdi:",
  note_troppo_lunghe: "le note sono troppo lunghe (massimo 500 caratteri)",
  fine_prima_di_inizio: "la fine viene prima dell'inizio",
  orario_non_valido: "un orario non è valido",
  settimane_non_valide: "il numero di settimane va da 1 a 8",
  giorni_non_validi: "scegli almeno un giorno",
  posizioni_non_valide: "scegli almeno una posizione nel mese",
  data_non_valida: "una data non è valida (ammesse dal 2000 al 2099)",
  "29_febbraio": "il 29 febbraio non può iniziare o finire un periodo annuale",
  eccezione_duplicata: "c'è già un'eccezione su quel giorno per questa tipologia",
  spostamento_sullo_stesso_giorno: "lo spostamento deve andare su un altro giorno",
  tipologia_sconosciuta: "la tipologia non esiste più",
  id_duplicato: "identificativo duplicato",
  revisione_superata: "qualcun altro ha salvato nel frattempo",
};

export const messaggioProblema = (p: Problema): string =>
  MESSAGGI_PROBLEMI[p.codice] ?? p.codice;

/** Il testo di un'anomalia; `nome` risolve gli id di tipologie e regole. */
export function fraseAnomalia(a: Anomalia, nome: (id: string) => string): string {
  const tip = a.tipologia ? nome(a.tipologia) : "";
  const intervalli = a.intervalli.map(([dal, al]) => (dal === al ? dataLunga(dal) : `dal ${dataLunga(dal)} al ${dataLunga(al)}`)).join(", ");
  switch (a.codice) {
    case "ritiro_festivo":
      return `${tip}: ${dataLunga(a.data!)} è un giorno festivo. Controlla cosa fa il comune.`;
    case "sovrapposizione_mista":
      return `${tip}: la regola «${nome(a.regole[0])}» cede a «${nome(a.regole[1])}» ${intervalli}.`;
    case "sovrapposizione_stesso_tipo":
      return `${tip}: le regole «${nome(a.regole[0])}» e «${nome(a.regole[1])}» generano gli stessi ${a.conteggio} ritiri ${intervalli}. Una delle due è di troppo?`;
    case "eccezione_senza_ritiro":
      return `${tip}: il ${dataLunga(a.data!)} non c'è un ritiro da togliere o spostare.`;
    case "eccezione_ridondante":
      return `${tip}: il ${dataLunga(a.data!)} il ritiro c'è già; l'eccezione non cambia nulla.`;
    case "giorno_inesistente":
      return `${tip}: nei mesi senza il giorno ${a.giorni.join(" o ")} la regola «${nome(a.regole[0])}» non genera il ritiro.`;
    case "tipologia_senza_ritiri":
      return `${tip} non ha ritiri nei prossimi 12 mesi.`;
    case "calendario_in_scadenza":
      return `Il calendario vale fino al ${dataLunga(a.data!)}: controlla quello nuovo del comune.`;
    case "calendario_scaduto":
      return `Il calendario è scaduto il ${dataLunga(a.data!)}: i ritiri successivi sono da verificare.`;
    default:
      return a.codice;
  }
}

export const nomeRegola = (r: Regola): string => r.nome || fraseRicorrenza(r.ricorrenza);
