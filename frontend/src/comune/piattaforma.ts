// La piattaforma ecologica nelle card (SPEC §10.2, decisione 64): aperta adesso, fino
// a quando, quando riapre. Il backend manda gli orari dei prossimi 14 giorni come
// istanti; qui si confrontano con l'ora del browser, così lo stato cambia da solo a
// ogni ridisegno della card, senza chiedere di nuovo.
import type { GiornoPiattaforma, LetturaRitiri } from "./tipi";

export type DatiPiattaforma = NonNullable<LetturaRitiri["piattaforma"]>;

export interface StatoPiattaforma {
  /** null: l'orario di oggi non è indicato (mai "chiusa" per default). */
  aperta: boolean | null;
  chiude?: Date;
  apre?: Date;
}

export function statoPiattaforma(p: DatiPiattaforma, ora: Date): StatoPiattaforma {
  const oggi = p.giorni[0];
  if (!oggi || oggi.fasce === null) return { aperta: null };
  for (const [inizio, fine] of oggi.fasce) {
    if (new Date(inizio) <= ora && ora < new Date(fine)) return { aperta: true, chiude: new Date(fine) };
  }
  for (const giorno of p.giorni) {
    // Oltre un giorno senza orario non si sa quando riapre.
    if (giorno.fasce === null) break;
    for (const [inizio] of giorno.fasce) {
      const apre = new Date(inizio);
      if (apre > ora) return { aperta: false, apre };
    }
  }
  return { aperta: false };
}

export const ora = (d: Date): string => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

/** "08:00–12:00 · 14:00–18:00" */
export const fasceTesto = (g: GiornoPiattaforma): string =>
  (g.fasce ?? []).map(([i, f]) => `${ora(new Date(i))}–${ora(new Date(f))}`).join(" · ");
