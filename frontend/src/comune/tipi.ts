// I tipi dei dati scambiati con il backend (SPEC §4.3.1, §9.4).

export interface HomeAssistant {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  config?: { time_zone?: string };
  connection: {
    addEventListener?(evento: "ready" | "disconnected", ascolto: () => void): void;
    removeEventListener?(evento: "ready" | "disconnected", ascolto: () => void): void;
    subscribeMessage<T>(
      callback: (msg: T) => void,
      msg: Record<string, unknown>,
    ): Promise<() => void>;
  };
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
  services: Record<string, Record<string, unknown>>;
  user?: { is_admin: boolean; name?: string };
  themes?: { darkMode?: boolean };
  locale?: { language: string };
}

export interface Finestra {
  inizio_giorno: "giorno_prima" | "giorno_stesso";
  inizio_ora: string;
  fine_ora: string;
}

export interface Tipologia {
  id: string;
  nome: string;
  colore: string;
  icona: string;
  note: string;
  esposizione: Finestra | null;
}

export type Ricorrenza =
  | { tipo: "settimanale"; ogni: number; giorni: number[]; ancora: string }
  | { tipo: "mensile_posizione"; posizioni: number[]; giorno: number }
  | { tipo: "mensile_data"; giorni: number[] };

export type Periodo =
  | { tipo: "sempre" }
  | { tipo: "annuale"; dal: string; al: string }
  | { tipo: "con_anno"; dal: string; al: string };

export type Quando =
  | { tipo: "giorni_prima"; giorni: number; ora: string }
  | { tipo: "giorno_stesso"; ora: string }
  | { tipo: "apertura" };

export interface Destinatario {
  tipo: "servizio" | "entita";
  id: string;
}

export interface Profilo {
  id: string;
  nome: string;
  attivo: boolean;
  quando: Quando;
  tipologie: string[] | null;
  destinatari: Destinatario[];
}

export interface Regola {
  id: string;
  tipologia: string;
  nome: string;
  ricorrenza: Ricorrenza;
  periodo: Periodo;
}

export type Eccezione =
  | { id: string; tipo: "aggiungi" | "togli"; tipologia: string; data: string; nota?: string }
  | { id: string; tipo: "sposta"; tipologia: string; da: string; a: string; nota?: string };

export type FasciaOraria = [string, string];

export interface PeriodoPiattaforma {
  id: string;
  dal: string;
  al: string;
  /** Sette elenchi di fasce, dal lunedì alla domenica; vuoto = chiusa. */
  settimana: FasciaOraria[][];
}

export interface EccezionePiattaforma {
  id: string;
  data: string;
  tipo: "chiusa" | "aperta";
  fasce: FasciaOraria[];
  nota: string;
}

export interface Piattaforma {
  nome: string;
  nota: string;
  periodi: PeriodoPiattaforma[];
  eccezioni: EccezionePiattaforma[];
}

export interface GiornoPiattaforma {
  data: string;
  /** Istanti ISO; null: nessun periodo copre il giorno. */
  fasce: [string, string][] | null;
  motivo: "periodo" | "eccezione" | "festivo" | null;
  festivo: string | null;
  nota: string;
}

export interface Configurazione {
  revisione: number;
  tipologie: Tipologia[];
  regole: Regola[];
  eccezioni: Eccezione[];
  esposizione: Finestra;
  patrono: { data: string; nome: string } | null;
  valido_fino_al: string | null;
  promemoria: Profilo[];
  solleciti: { attivi: boolean; richiami: number; richiamo_dopo: number };
  sospensioni: { dal: string; al: string }[];
  piattaforma?: Piattaforma | null;
  [altro: string]: unknown;
}

export interface Ritiro {
  data: string;
  tipologia: string;
  origine: "regola" | "aggiunto" | "spostato";
  regole: string[];
  spostato_dal: string | null;
  inizio_esposizione: string;
  fine_esposizione: string;
  festivo: string | null;
  da_verificare: boolean;
}

export interface Anomalia {
  codice: string;
  gravita: "avviso" | "info";
  tipologia: string | null;
  regole: string[];
  eccezione: string | null;
  data: string | null;
  intervalli: [string, string][];
  giorni: number[];
  conteggio: number;
}

export interface Problema {
  percorso: string;
  codice: string;
}

export interface LetturaConfigurazione {
  configurazione: Configurazione;
  revisione: number;
  oggi: string;
  problemi: Problema[];
  anomalie: Anomalia[];
  festivi_ignorati: { data: string; tipologia: string }[];
  mostra_barra_laterale: boolean;
}

export interface Anteprima {
  problemi: Problema[];
  ritiri: Ritiro[];
  differenze: {
    aggiunti: { data: string; tipologia: string }[];
    tolti: { data: string; tipologia: string }[];
  };
  anomalie: Anomalia[];
}

export interface ErroreFile {
  foglio: string;
  riga: number | null;
  colonna: string | null;
  codice: string;
}

export interface Conti {
  aggiunte: number;
  modificate: number;
  tolte: number;
}

export type Riepilogo = Record<string, Conti>;

export interface EsitoImportazione {
  errori: ErroreFile[];
  configurazione: Configurazione | null;
  riepilogo?: Riepilogo;
}

export interface EsitoSalvataggio {
  salvato: boolean;
  problemi: Problema[];
  revisione: number;
}

export interface LetturaRitiri {
  disponibile: boolean;
  oggi: string;
  tipologie: Pick<Tipologia, "id" | "nome" | "colore" | "icona" | "note">[];
  ritiri: Ritiro[];
  conferme: { data: string; tipologia: string; istante?: string | null; utente?: string | null }[];
  sospeso: { manuale: boolean; fino_al: string | null };
  valido_fino_al: string | null;
  piattaforma: { nome: string; nota: string; giorni: GiornoPiattaforma[] } | null;
}
