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

## Due rami (decisione 58)

- **`sviluppo`** contiene tutto e si lavora da qui: si clona questo ramo, i rami di lavoro
  partono da qui e le pull request tornano qui. La CI completa gira qui.
- **`main`** è il ramo predefinito, quello che vedono utenti e HACS: solo i file elencati
  in `pubblicazione/file-pubblicati.txt`, più il workflow ridotto
  `pubblicazione/ci-main.yml` (hassfest e validazione HACS, che HACS richiede).
- Per pubblicare: da `sviluppo` pulito, `bash scripts/pubblica_main.sh pubblica-X.Y.Z`,
  commit, pull request verso `main`, CI verde, merge, poi tag `vX.Y.Z` e release GitHub
  **sul commit di `main`**. Mai lavorare direttamente su `main`.

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

## Test

- Suite pura (nucleo e repository), **senza** Home Assistant installato: `pytest`,
  con `pytest` e `hypothesis` come sole dipendenze.
  Un ambiente in cui c'è Home Assistant carica da solo `pytest-asyncio` e rompe questa
  suite: usa un ambiente con il solo `pytest`.
- Suite d'integrazione, con `pytest-homeassistant-custom-component` (0.13.336 per la
  2026.6, l'ultima per la versione corrente):
  `pytest -p pytest_homeassistant_custom_component -o asyncio_mode=auto -o asyncio_default_fixture_loop_scope=function tests/integrazione`.
  Su Windows non gira: serve Linux o WSL.
- `ruff check .` e `ruff format --check .`.
- `python scripts/genera_traduzioni.py` dopo ogni modifica a `strings.json`.
- La CI (`.github/workflows/ci.yml`) esegue tutto questo più hassfest e la validazione
  HACS; una pull request si unisce solo con la CI verde.

## Frontend e immagini

- `cd frontend && npm ci && npm run build`: i file costruiti sono nel repository.
- `banco/` è un banco di prova con un finto `hass`: pannello (`banco/pannello.html`) e
  card (`banco/card.html`) si aprono in un browser servendo la radice del repository
  (`python -m http.server 8766`). Parametri: `oggi`, `ora` (orologio fermo), `tema=scuro`,
  `pagina`, `passi` (pulsanti da cliccare, per l'inizio del loro testo, separati da `|`),
  `card`, `larghezza`.
- Per guardare una pagina a larghezza telefono, Chrome headless non scende sotto circa
  500 px di finestra: sotto tutti i punti di rottura del layout (560, 600, 820 px).
- Il finto `ha-icon` disegna nello shadow DOM: figli nel light DOM sposterebbero gli
  indici dei nodi di Lit e i valori finirebbero nei posti sbagliati.
- `banco/icone.json` si rigenera con `scripts/estrai_icone.py`; gli screenshot di
  `docs/screenshots/` con `scripts/genera_screenshot.sh`.
- Guarda ogni pagina come immagine appena esiste: i difetti di composizione non si vedono
  leggendo il codice.

## Come si lavora

- Una fase per sessione (piano in `docs/SPEC.md` §14). Niente lavoro di fasi successive,
  nemmeno se è a una riga di distanza.
- Un ramo per fase o argomento, pull request verso `sviluppo`. Commit piccoli e
  funzionanti; il messaggio dice *perché*, non *cosa*.
- Identità git: solo `Foyer Labs <foyerlabs@gmail.com>`. Controlla `git config user.email`
  prima del primo commit su una macchina nuova.
- Test accanto al codice per tutto `core/`, eseguibili senza Home Assistant.
- **Se la spec è ambigua o si contraddice, fermati e chiedi.** Una domanda alla volta, con
  le alternative e quella consigliata per prima.
- Configurazione solo da interfaccia, niente YAML.
- Ogni cambiamento visibile all'utente aggiorna nello stesso ramo README, `docs/GUIDA.md`
  (quando esiste) e la voce `[Non rilasciato]` di `CHANGELOG.md` (spec §15). Il README non
  promette mai ciò che la versione pubblicata non fa.
- Ogni versione: stessa versione in `manifest.json`, tag `vX.Y.Z` e release GitHub con le
  note del changelog.
- A fine sessione riporta tre cose: cosa hai fatto, cosa non hai fatto e perché, cosa nella
  spec ritieni sbagliato.
