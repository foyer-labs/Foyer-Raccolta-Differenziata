// La piattaforma ecologica nelle card (SPEC §10.2, decisione 64): aperta adesso, fino
// a quando, quando riapre. Il backend manda gli orari dei prossimi 14 giorni come
// istanti ISO con il fuso di Home Assistant; qui si confrontano con l'istante del
// browser, così lo stato cambia da solo a ogni ridisegno della card.
//
// Ore e date si leggono dalle stringhe, non dall'orologio del browser: un telefono con
// un altro fuso (in viaggio) deve vedere le 17:00 dell'orario, non le 11:00 di casa sua.
import type { GiornoPiattaforma, LetturaRitiri } from "./tipi";

export type DatiPiattaforma = NonNullable<LetturaRitiri["piattaforma"]>;

export interface StatoPiattaforma {
  /** null: l'orario di oggi non è indicato (mai "chiusa" per default). */
  aperta: boolean | null;
  /** Istanti ISO, con il fuso di Home Assistant. */
  chiude?: string;
  apre?: string;
}

/** Le fasce di un giorno in ordine, con quelle che si toccano unite (08-12 e 12-14). */
function fasceUnite(fasce: [string, string][]): [string, string][] {
  const unite: [string, string][] = [];
  for (const [inizio, fine] of [...fasce].sort((a, b) => Date.parse(a[0]) - Date.parse(b[0]))) {
    // Un orario che l'ora legale ha saltato può dare un intervallo vuoto: non conta.
    if (Date.parse(fine) <= Date.parse(inizio)) continue;
    const ultima = unite.at(-1);
    if (ultima && Date.parse(inizio) <= Date.parse(ultima[1])) {
      if (Date.parse(fine) > Date.parse(ultima[1])) ultima[1] = fine;
    } else unite.push([inizio, fine]);
  }
  return unite;
}

export function statoPiattaforma(p: DatiPiattaforma, ora: Date): StatoPiattaforma {
  const adesso = ora.getTime();
  const oggi = p.giorni[0];
  if (!oggi || oggi.fasce === null) return { aperta: null };
  for (const [inizio, fine] of fasceUnite(oggi.fasce)) {
    if (Date.parse(inizio) <= adesso && adesso < Date.parse(fine)) {
      // Una fascia fino a mezzanotte continua in una del giorno dopo dalle 00:00?
      // Non con gli orari ammessi (la fine massima è 23:59): basta questa.
      return { aperta: true, chiude: fine };
    }
  }
  for (const giorno of p.giorni) {
    // Oltre un giorno senza orario non si sa quando riapre.
    if (giorno.fasce === null) break;
    for (const [inizio] of fasceUnite(giorno.fasce)) {
      if (Date.parse(inizio) > adesso) return { aperta: false, apre: inizio };
    }
  }
  return { aperta: false };
}

/** "14:00" da un istante ISO, nel fuso con cui il backend l'ha scritto. */
export const ora = (iso: string): string => iso.slice(11, 16);

/** "08:00–12:00 · 14:00–18:00" */
export const fasceTesto = (g: GiornoPiattaforma): string =>
  fasceUnite(g.fasce ?? []).map(([i, f]) => `${ora(i)}–${ora(f)}`).join(" · ");
