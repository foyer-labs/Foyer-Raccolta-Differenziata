// Tutti i testi visibili del frontend (INV-5): nessun componente scrive testo suo.
import { daIso, giornoSettimana } from "./date";
import type { Anomalia, Configurazione, Conti, ErroreFile, Periodo, Problema, Quando, Regola, Ricorrenza } from "./tipi";

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
    piattaforma: "Piattaforma",
    impostazioni: "Impostazioni",
  },
  oggi: "Oggi",
  domani: "Domani",
  nessunRitiro: "Nessun ritiro",
  salva: "Salva",
  annulla: "Annulla",
  indietro: "Indietro",
  modifica: "Modifica",
  elimina: "Elimina",
  chiudi: "Chiudi",
  primaDiSalvare: "Prima di salvare",
  cosaCambia: "Ecco cosa cambia nei prossimi 60 giorni.",
  nienteCambia: "Nessun ritiro cambia nei prossimi 60 giorni.",
  salvato: "Salvato",
  erroreConnessione: "Non è stato possibile raggiungere Home Assistant. Riprova.",
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
  iconaAiuto: "Cerca per nome (umido, carta, pannolini…) o scrivi un'icona di Material Design, per esempio mdi:recycle.",
  altroColore: "Un altro colore",
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
  ogniQuanteSettimane: "Ogni quante settimane",
  completaLaRegola: "Scegli almeno un giorno per completare la regola",
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
  excel: "Configurazione in Excel",
  excelAiuto: "Compila o cambia il calendario in un foglio di calcolo e importalo qui. Il file ha una guida e un foglio per ogni sezione; lo stesso file serve per esportare e per importare.",
  scaricaModello: "Scarica il modello",
  esporta: "Esporta in Excel",
  importa: "Importa da Excel…",
  importaTitolo: "Importa da Excel",
  scegliFile: "Scegli il file",
  cambiaFile: "Cambia file",
  nessunFile: "Un file .xlsx, dal modello o da un'esportazione.",
  comeImportare: "Come importarlo",
  sostituisci: "Sostituisci tutto",
  sostituisciAiuto: "Il file diventa la configurazione: quello che nel file non c'è viene tolto. Dopo aver esportato e modificato.",
  aggiungiSoltanto: "Aggiungi soltanto",
  aggiungiSoltantoAiuto: "Le righe del file si aggiungono; quelle che corrispondono a qualcosa che c'è lo aggiornano. Non si toglie niente.",
  continua: "Continua",
  leggoIlFile: "Leggo il file…",
  fileConProblemi: "Il file ha dei problemi: correggili nel foglio di calcolo e riprova.",
  altriProblemi: (n: number) => (n === 1 ? "e un altro problema" : `e altri ${n} problemi`),
  esportaNonValida: "La configurazione salvata non è valida: correggila prima di esportarla.",
  scaricamentoFallito: "Il file non si è potuto preparare. Riprova.",
  dalFile: "Dal file",
  nienteDalFile: "Il file è uguale alla configurazione attuale.",
  riga: (n: number) => `riga ${n}`,
  configurazioneAttuale: "configurazione attuale",
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
  tutti: "Tutti",
  nonTrovato: "Non trovato in Home Assistant: toglilo o controlla il nome",
  nessunRisultato: "Nessun risultato",
  usaValore: (v: string) => `Invio per usare «${v}»`,
  cercaIcona: "Cerca un'icona o scrivi mdi:…",
  cercaDestinatario: "Cerca un telefono o un servizio di notifica…",
  nessunDestinatarioScelto: "Nessun destinatario: aggiungine almeno uno.",
  gruppoCompanion: "App Companion",
  gruppoServizi: "Altri servizi",
  gruppoEntita: "Entità notify",
  // Promemoria
  aiutoPromemoria: "Un promemoria dice quando avvisarti e chi. Più rifiuti nello stesso giorno arrivano in un solo messaggio.",
  nessunPromemoria: "Nessun promemoria: aggiungine uno per ricevere una notifica.",
  nuovoPromemoria: "Nuovo promemoria",
  nomePromemoria: "Nome",
  nomePromemoriaAiuto: "La sera prima, Il vetro, …",
  quando: "Quando",
  giorniPrima: "Giorni prima",
  giornoStesso: "Il giorno stesso",
  apertura: "All'apertura",
  aperturaAiuto: "Quando si possono mettere fuori i sacchi, secondo l'orario di esposizione di ogni tipologia.",
  quantiGiorni: "Quanti giorni prima",
  alle: "Alle",
  perQuali: "Per quali rifiuti",
  tutte: "Tutte",
  tutteAiuto: "«Tutte» comprende anche le tipologie che aggiungerai.",
  destinatari: "A chi",
  destinatariAiuto: "I telefoni con l'app Companion ricevono anche il pulsante «Esposto ✓».",
  nessunDestinatario: "Nessun servizio di notifica trovato in Home Assistant.",
  conPulsanti: "con pulsanti",
  soloTesto: "solo testo",
  attivo: "Attivo",
  solleciti: "Solleciti",
  sollecitaSeNonConfermo: "Sollecita se non confermo",
  sollecitiAiuto: "Ripete il promemoria finché qualcuno non tocca «Esposto ✓», e aggiunge il pulsante «Ricordamelo tra 30 minuti». Alla maggior parte delle persone basta la notifica.",
  richiami: "Quante volte",
  ogniMinuti: "Ogni",
  minuti: (n: number) => `${n} min`,
  vacanze: "Vacanze",
  vacanzeAiuto: "Nelle date indicate i promemoria tacciono; il calendario, i sensori e le card restano.",
  nessunaVacanza: "Nessuna vacanza in programma.",
  aggiungiVacanza: "Aggiungi vacanza",
  dalAl: (dal: string, al: string) => `dal ${dataLunga(dal)} al ${dataLunga(al)}`,
  // Piattaforma ecologica (SPEC §4.10)
  piattaformaTitolo: "Piattaforma ecologica",
  piattaformaAiuto: "Gli orari della piattaforma (o isola) ecologica: le card mostrano se è aperta adesso, e un tocco apre gli orari. Nei giorni festivi risulta chiusa, salvo eccezione.",
  piattaformaVuota: "Non hai ancora inserito gli orari della piattaforma ecologica.",
  inserisciOrari: "Inserisci gli orari",
  nomePiattaforma: "Nome",
  nomePiattaformaAiuto: "Come la chiamate: Piattaforma ecologica, Isola ecologica, Ecocentro…",
  notaPiattaforma: "Nota (facoltativa)",
  notaPiattaformaAiuto: "Indirizzo, cosa serve per entrare, cosa si porta…",
  periodi: "Periodi",
  periodiAiuto: "Fino a quattro periodi con le date e l'anno, per esempio l'orario invernale e quello estivo. Fuori da ogni periodo l'orario non è indicato.",
  aggiungiPeriodo: "Aggiungi un periodo",
  togliPeriodo: "Togli il periodo",
  chiusa: "Chiusa",
  aggiungiFascia: "Aggiungi una fascia oraria",
  togliFascia: "Togli la fascia",
  eccezioniPiattaforma: "Giorni con un orario diverso",
  eccezioniPiattaformaAiuto: "Una chiusura straordinaria, o un'apertura in un giorno festivo.",
  aggiungiEccezionePiattaforma: "Aggiungi un giorno",
  aperta: "Aperta",
  togliPiattaforma: "Togli la piattaforma",
  periodoDalAl: (dal: string, al: string) => `Periodo dal ${dal} al ${al}`,
  piattaformaDaTogliere: "Gli orari della piattaforma verranno tolti quando salvi. Annulla per tenerli.",
  togliPiattaformaAvviso: "Salvando, gli orari della piattaforma ecologica spariscono dalle card, e con loro il suo sensore.",
  modificheNonSalvate: "Hai modifiche non salvate in questa pagina. Lasciarle?",
  restaQui: "Resta qui",
  lascia: "Lascia le modifiche",
  eliminatoNelFrattempo: "Quello che stavi modificando è stato eliminato nel frattempo, da un'altra finestra o da un altro dispositivo.",
  fileCambiato: "Il file è cambiato da quando l'hai scelto: sceglilo di nuovo.",
  orariDa: "dalle",
  orariA: "alle",
  // Card
  card: {
    titolo: "Raccolta",
    nonDisponibile: "Il calendario della raccolta non è disponibile. Controlla Riparazioni in Impostazioni.",
    staseraFuori: "Stasera fuori",
    daEsporreOra: "Da esporre ora",
    oggi: "Oggi",
    domani: "Domani",
    prossimo: "Prossimo ritiro",
    entroLe: (ora: string, oggi: boolean) => `entro le ${ora}${oggi ? "" : " di domani"}`,
    dalle: (ora: string, quando: string) => `da mettere fuori ${quando} dalle ${ora}`,
    stasera: "stasera",
    oggiMinuscolo: "oggi",
    esposto: "Esposto ✓",
    espostoAlle: (ora: string, chi?: string | null) => `Esposto alle ${ora}${chi ? ` da ${chi}` : ""}`,
    annullaConferma: "Annulla",
    nessunRitiro: "Nessun ritiro",
    nessunRitiroSettimana: "Nessun ritiro questa settimana",
    tuttoTranquillo: "Niente da esporre nei prossimi giorni",
    sospesi: "Promemoria sospesi",
    sospesiFino: (d: string) => `Promemoria sospesi fino al ${d}`,
    daVerificare: "Da verificare: il calendario è scaduto",
    spostatoDal: (d: string) => `spostato dal ${d}`,
    festivo: (n: string) => `festivo: ${n}`,
    settimana: "Questa settimana",
    calendario: "Calendario",
    mesePrecedente: "Mese precedente",
    meseSuccessivo: "Mese successivo",
    confermato: "confermato",
    nomeOggi: "Raccolta: oggi e domani",
    nomeSettimana: "Raccolta: settimana",
    nomeMese: "Raccolta: mese",
    descrizioneOggi: "Cosa esporre stasera, con il pulsante Esposto.",
    descrizioneSettimana: "I ritiri dei prossimi sette giorni.",
    descrizioneMese: "Il calendario del mese, con il dettaglio del giorno.",
    campoTitolo: "Titolo",
    campoInizio: "La settimana inizia",
    inizioOggi: "Da oggi",
    inizioLunedi: "Dal lunedì",
    cosaVaDove: "Cosa va dove",
    nessunaNotaCard: "Nessuna nota: si aggiunge nel pannello, in Tipologie.",
    apriNote: "Cosa va in ogni bidone",
    campoPiattaforma: "Mostra la piattaforma ecologica",
    piattaformaAperta: (fino: string) => `Aperta fino alle ${fino}`,
    piattaformaChiusa: "Chiusa",
    piattaformaApre: (quando: string) => `Chiusa · apre ${quando}`,
    piattaformaNonIndicato: "Orario non indicato",
    alle: (ora: string) => `alle ${ora}`,
    domaniAlle: (ora: string) => `domani alle ${ora}`,
    giornoAlle: (giorno: string, ora: string) => `${giorno} alle ${ora}`,
    oggiMaiuscolo: "Oggi",
    chiusaFestivo: (nome: string) => `Chiusa · ${nome}`,
    orarioNonIndicato: "Orario non indicato",
    piuAvanti: "Più avanti",
  },
  profiloRimosso: (n: number) => (n === 1 ? "Un promemoria riguardava solo questa tipologia e verrà eliminato." : `${n} promemoria riguardavano solo questa tipologia e verranno eliminati.`),
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
  configurazione_non_valida: "la configurazione salvata non è leggibile",
  destinatario_duplicato: "lo stesso destinatario compare due volte",
  eccezione_non_valida: "un'eccezione non è valida",
  elenco_non_valido: "un elenco della configurazione non è valido",
  finestra_non_valida: "l'orario di esposizione non è valido",
  id_mancante: "un elemento non ha l'identificativo",
  inizio_giorno_non_valido: "scegli da quando si espone",
  nota_troppo_lunga: "la nota è troppo lunga (al massimo 200 caratteri)",
  patrono_non_valido: "il santo patrono non è valido",
  periodo_non_valido: "il periodo non è valido",
  promemoria_non_validi: "un promemoria non è valido",
  regola_non_valida: "una regola non è valida",
  ricorrenza_non_valida: "la ricorrenza non è valida",
  solleciti_non_validi: "le impostazioni dei solleciti non sono valide",
  sospensioni_non_valide: "le vacanze non sono valide",
  tipologia_non_valida: "una tipologia non è valida",
  valore_non_valido: "un valore non è valido",
  piattaforma_non_valida: "gli orari della piattaforma non sono validi",
  periodi_non_validi: "servono da uno a quattro periodi",
  periodi_sovrapposti: "due periodi della piattaforma si sovrappongono",
  orari_non_validi: "l'orario settimanale di un periodo non è valido",
  fasce_non_valide: "da una a tre fasce orarie per giorno",
  fascia_non_valida: "in una fascia oraria la fine deve venire dopo l'inizio",
  fasce_sovrapposte: "due fasce orarie dello stesso giorno si sovrappongono",
  giorno_duplicato: "lo stesso giorno compare due volte tra i giorni con un orario diverso",
  valore_mancante: "manca un valore",
  scelta_non_valida: "scegli una delle voci del menu",
  si_no_non_valido: "scrivi Sì o No",
  un_solo_giorno: "per il mensile va un solo giorno della settimana",
  foglio_mancante: "manca il foglio: per sostituire tutto servono tutti i fogli del modello",
  colonna_mancante: "manca la colonna",
  troppe_righe: "troppe righe (al massimo 2000)",
  file_non_valido: "non è un file Excel (.xlsx) leggibile",
  file_troppo_grande: "il file è troppo grande (al massimo 1 MB)",
  impostazione_sconosciuta: "impostazione sconosciuta: controlla il nome nella prima colonna",
  nessun_foglio: "nel file non c'è nessuno dei fogli del modello (Tipologie, Regole, …)",
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
  destinatari_mancanti: "scegli almeno un destinatario",
  destinatario_non_valido: "un destinatario non è valido",
  giorni_prima_non_validi: "da 1 a 7 giorni prima",
  quando_non_valido: "scegli quando avvisare",
  richiami_non_validi: "i solleciti vanno da 1 a 2",
  intervallo_non_valido: "l'intervallo va da 5 a 240 minuti",
};

export const messaggioProblema = (p: Problema): string =>
  MESSAGGI_PROBLEMI[p.codice] ?? p.codice;

/**
 * Dove sta un problema della validazione, in parole: "Periodo dal 1 ottobre 2026 al 31
 * marzo 2027 · gio", "Tipologia «Umido»". Gli indici del percorso si leggono sulla
 * configurazione proposta, la stessa che il backend ha validato.
 */
export function luogoProblema(p: Problema, c: Configurazione): string {
  const trovato = /^([a-z_]+(?:\.[a-z_]+)?)\[(\d+)\](?:\.(.+))?$/.exec(p.percorso);
  const giorno = /settimana\[(\d)\]/.exec(p.percorso);
  if (!trovato) {
    const radice = p.percorso.split(".")[0];
    return (
      {
        esposizione: T.esposizione,
        patrono: T.patrono,
        valido_fino_al: T.validita,
        solleciti: T.solleciti,
        piattaforma: T.piattaformaTitolo,
      } as Record<string, string>
    )[radice] ?? "";
  }
  const [, sezione, indice] = trovato;
  const i = Number(indice);
  switch (sezione) {
    case "tipologie":
      return c.tipologie[i] ? `${T.tipologia} «${c.tipologie[i].nome}»` : T.tipologia;
    case "regole": {
      const r = c.regole[i];
      const t = r && c.tipologie.find((x) => x.id === r.tipologia);
      return r ? `${T.ricorrenza}: ${t ? `${t.nome} · ` : ""}${nomeRegola(r)}` : T.ricorrenza;
    }
    case "eccezioni": {
      const e = c.eccezioni[i];
      return e ? `${T.pagine.eccezioni}: ${dataLunga(e.tipo === "sposta" ? e.da : e.data)}` : T.pagine.eccezioni;
    }
    case "promemoria":
      return c.promemoria[i] ? `${T.pagine.promemoria} «${c.promemoria[i].nome}»` : T.pagine.promemoria;
    case "sospensioni":
      return T.vacanze;
    case "piattaforma.periodi": {
      const q = c.piattaforma?.periodi[i];
      const dove = q && q.dal && q.al ? T.periodoDalAl(dataLunga(q.dal), dataLunga(q.al)) : T.periodo;
      return giorno ? `${dove} · ${GIORNI_BREVI[Number(giorno[1])]}` : dove;
    }
    case "piattaforma.eccezioni": {
      const e = c.piattaforma?.eccezioni[i];
      return e?.data ? `${T.eccezioniPiattaforma}: ${dataLunga(e.data)}` : T.eccezioniPiattaforma;
    }
    default:
      return "";
  }
}

// In un file i codici della validazione vogliono un esempio di come si scrive.
const MESSAGGI_FILE: Record<string, string> = {
  tipologia_sconosciuta: "tipologia non trovata nel foglio Tipologie",
  giorni_non_validi: "giorni non riconosciuti (per esempio Lun, Gio oppure 1, 15)",
  posizioni_non_valide: "posizioni non riconosciute (per esempio 2°, ultimo)",
  data_non_valida: "data non valida (per esempio 22/09/2026, o 01/06 per «Ogni anno»)",
  orario_non_valido: "orario non valido (per esempio 20:00)",
  colore_non_valido: "colore non valido (per esempio #795548)",
  destinatario_non_valido: "destinatario non valido (per esempio mobile_app_telefono o notify.telegram)",
  destinatari_mancanti: "manca almeno un destinatario",
};

export const messaggioErroreFile = (e: ErroreFile): string => MESSAGGI_FILE[e.codice] ?? MESSAGGI_PROBLEMI[e.codice] ?? e.codice;

/** "Regole · riga 5 · Giorni della settimana" */
export function luogoErroreFile(e: ErroreFile): string {
  return [e.foglio, e.riga ? T.riga(e.riga) : "", e.colonna ?? ""].filter(Boolean).join(" · ");
}

const SEZIONI_RIEPILOGO: Record<string, [string, boolean]> = {
  tipologie: ["Tipologie", true],
  regole: ["Regole", true],
  eccezioni: ["Eccezioni", true],
  promemoria: ["Promemoria", false],
  sospensioni: ["Vacanze", true],
  piattaforma: ["Orari della piattaforma", false],
  impostazioni: ["Impostazioni", true],
};

/** "Regole: 2 nuove, 1 modificata" — null se la sezione non cambia. */
export function fraseRiepilogo(sezione: string, c: Conti): string | null {
  const voce = SEZIONI_RIEPILOGO[sezione];
  if (!voce) return null;
  const [nome, femminile] = voce;
  const parola = (n: number, radice: string) => `${n} ${radice}${n === 1 ? (femminile ? "a" : "o") : femminile ? "e" : "i"}`;
  const parti = [
    c.aggiunte ? parola(c.aggiunte, "nuov") : null,
    c.modificate ? parola(c.modificate, "modificat") : null,
    c.tolte ? parola(c.tolte, "tolt") : null,
  ].filter(Boolean);
  return parti.length ? `${nome}: ${parti.join(", ")}` : null;
}

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
    case "piattaforma_senza_orario":
      return a.data
        ? `Piattaforma ecologica: oggi l'orario non è indicato; il prossimo periodo inizia il ${dataLunga(a.data)}.`
        : "Piattaforma ecologica: gli orari inseriti sono finiti. Inserisci quelli nuovi.";
    case "piattaforma_in_scadenza":
      return `Piattaforma ecologica: gli orari inseriti finiscono il ${dataLunga(a.data!)}. Inserisci quelli nuovi.`;
    default:
      return a.codice;
  }
}

export const nomeRegola = (r: Regola): string => r.nome || fraseRicorrenza(r.ricorrenza);

/** "La sera prima alle 20:30", "Due giorni prima alle 19:00", … */
export function fraseQuando(q: Quando): string {
  if (q.tipo === "apertura") return "Quando si possono esporre i sacchi";
  if (q.tipo === "giorno_stesso") return `Il giorno del ritiro alle ${q.ora}`;
  const giorni = ["", "Il giorno prima", "Due giorni prima", "Tre giorni prima", "Quattro giorni prima", "Cinque giorni prima", "Sei giorni prima", "Una settimana prima"];
  return `${giorni[q.giorni] ?? `${q.giorni} giorni prima`} alle ${q.ora}`;
}
