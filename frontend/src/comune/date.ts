// Date senza fuso: "AAAA-MM-GG" come nell'archivio (SPEC §4.3.1). Si lavora in
// giorni di calendario, mai in istanti, così nessun cambio d'ora sposta un giorno.

export const daIso = (iso: string): Date => {
  const [a, m, g] = iso.split("-").map(Number);
  return new Date(a, m - 1, g);
};

export const aIso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const piuGiorni = (iso: string, n: number): string => {
  const d = daIso(iso);
  d.setDate(d.getDate() + n);
  return aIso(d);
};

/** 0 = lunedì … 6 = domenica, come nel backend. */
export const giornoSettimana = (iso: string): number => (daIso(iso).getDay() + 6) % 7;

export const giorniTra = (dal: string, al: string): number =>
  Math.round((daIso(al).getTime() - daIso(dal).getTime()) / 864e5);

export const lunediDi = (iso: string): string => piuGiorni(iso, -giornoSettimana(iso));

export const primoDelMese = (iso: string): string => `${iso.slice(0, 7)}-01`;

export const giorniNelMese = (anno: number, mese: number): number =>
  new Date(anno, mese, 0).getDate();

export const oraDi = (istante: string): string => istante.slice(11, 16);
