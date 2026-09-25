# Foyer Raccolta Differenziata — regole di lavoro

Integrazione personalizzata di Home Assistant (HACS) che conosce il calendario della
raccolta differenziata di casa, ricorda quando esporre i sacchi e lo mostra in tre card.

**Tutto in italiano**: risposte, domande, documentazione, codice, commenti, commit.
Restano in inglese solo i nomi imposti da Home Assistant, HACS e librerie.

## Leggi prima, ogni sessione

**`docs/SPEC.md` è la fonte di verità.** Leggila tutta prima di scrivere codice, non solo le
parti che sembrano rilevanti: contiene i motivi delle scelte.

Il registro delle decisioni è in `docs/SPEC.md` §16; le scelte ancora da confermare in §17.
Una fase che dipende da una voce di §17 non ancora confermata non parte: chiedi prima.

Il repository è l'unica memoria condivisa tra le installazioni da cui si lavora: ogni
decisione presa in chat va scritta nella spec (§16) nello stesso ramo del lavoro che la usa.

## I sei invarianti

**INV-1 — Il nucleo è puro.** `core/` non importa `homeassistant.*`, non legge l'orologio
(l'istante corrente è un parametro), non fa I/O. La CI lo verifica: se il test fallisce si
corregge il codice, mai il test.

**INV-2 — Un errore non si traveste da "nessun ritiro".** Calcolo fallito o configurazione
illeggibile → entità `unavailable` e un problema in Riparazioni. Mai "Nessuno".

**INV-3 — Lo stato sopravvive ai riavvii.** Conferme, invii fatti, rinvii, anomalie
ignorate, ultimo istante di attività.

**INV-4 — Nessuna data si sposta da sola.** Si segnala, non si corregge.

**INV-5 — Tutto in italiano**, e nessun testo visibile scritto nel codice di un componente.

**INV-6 — Semplice prima di completo.** Niente funzioni fuori dalla spec.

## Come si lavora

- Una fase per sessione (piano in `docs/SPEC.md` §14). Niente lavoro di fasi successive,
  nemmeno se è a una riga di distanza.
- Un ramo per fase (`fase-N-descrizione`), pull request verso `main`. Commit piccoli e
  funzionanti; il messaggio dice *perché*, non *cosa*.
- Identità git: solo `Foyer Labs <foyerlabs@gmail.com>`. Controlla `git config user.email`
  prima del primo commit su una macchina nuova.
- Test accanto al codice per tutto `core/`, eseguibili senza Home Assistant.
- **Se la spec è ambigua o si contraddice, fermati e chiedi.** Una domanda alla volta, con
  le alternative e quella consigliata per prima.
- Configurazione solo da interfaccia, niente YAML.
- A fine sessione riporta tre cose: cosa hai fatto, cosa non hai fatto e perché, cosa nella
  spec ritieni sbagliato.
