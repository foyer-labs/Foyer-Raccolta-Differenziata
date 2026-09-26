# Changelog

Qui sono registrate tutte le modifiche rilevanti. Le versioni seguono lo stile del
[Semantic Versioning](https://semver.org). Ogni voce dice cosa cambia nel comportamento,
non solo "correzioni", e quello che richiede qualcosa da te viene prima di tutto, sotto
*Cambiato — leggi prima di aggiornare*.

## [Non rilasciato]

### Aggiunto
- **I pannolini tra le tipologie pronte**, con il loro colore e la loro icona. Non sono
  selezionati all'installazione: li scegli se ti servono. Chi ha già installato
  l'integrazione li aggiunge dal pannello, in *Tipologie → Nuova tipologia*.

## [0.1.0] — 2026-09-26 — la prima versione

Il calendario della raccolta, i promemoria e le tre card. La guida è in
[docs/GUIDA.md](docs/GUIDA.md), la specifica in [docs/SPEC.md](docs/SPEC.md).

### Aggiunto
- **Installazione da Home Assistant.** *Aggiungi integrazione → Foyer Raccolta
  Differenziata* chiede le tipologie da cui partire (umido, carta, plastica, vetro,
  secco, verde, con i loro colori) e quando si espongono i sacchi: di default dalle
  20:00 del giorno prima alle 06:00 del giorno del ritiro. Si può installare una volta
  sola.
- **Entità per le automazioni e le dashboard.** Un calendario con un evento per ogni
  ritiro (`calendar.raccolta_differenziata`); i sensori *Oggi* e *Domani* con le
  tipologie di quel giorno; un sensore *Prossimo ritiro* per ogni tipologia, con la data e
  i giorni che mancano; il sensore *Da esporre*, acceso da quando si possono mettere fuori
  i sacchi finché il ritiro non passa. Si aggiornano da soli a mezzanotte e all'apertura e
  chiusura delle finestre di esposizione.
- **Il pannello Raccolta nella barra laterale**, per gli amministratori. *Panoramica*
  con i prossimi 30 giorni e le cose da controllare; *Tipologie* con colore, icona, note
  e orario di esposizione proprio; *Regole* scritte come frasi ("Una settimana sì e una
  no, il martedì"), con le prossime date che compaiono mentre si compila; *Eccezioni*
  per aggiungere, togliere o spostare un ritiro; *Impostazioni* per la finestra di
  esposizione, la validità del calendario e il santo patrono. Ogni salvataggio mostra
  prima cosa cambia nei prossimi 60 giorni.
- **Il pannello si può togliere dalla barra laterale**, dal pannello stesso o da
  *Configura*: resta raggiungibile dalla pagina del dispositivo «Raccolta
  differenziata».
- **Promemoria.** Dalla pagina *Promemoria* del pannello: quando (N giorni prima, il
  giorno stesso, all'apertura della finestra di esposizione), per quali rifiuti e a chi,
  scegliendo tra i servizi di notifica di Home Assistant. Più rifiuti nello stesso giorno
  arrivano in un solo messaggio: *Stasera fuori: Umido e Carta*.
- **Esposto ✓.** Un pulsante nella notifica dell'app Companion, un'entità pulsante (per
  un tag NFC o un pulsante vicino alla porta) e le card: chi conferma ferma gli altri
  promemoria di quel ritiro per tutti.
- **Solleciti, spenti di default.** Se li accendi, il promemoria si ripete finché qualcuno
  non conferma, e la notifica ha anche *Ricordamelo tra 30 minuti*.
- **Vacanze e interruttore *Sospendi promemoria*.** Nelle date indicate, o con
  l'interruttore acceso, i promemoria tacciono; il calendario resta.
- **Niente promemoria persi per un riavvio.** Se Home Assistant era spento all'ora di un
  promemoria, parte al riavvio, purché sia ancora il momento di esporre i sacchi.
- **Tre card per le dashboard**, nel selettore delle card senza installare altro:
  *Oggi e domani* (cosa esporre stasera, con il pulsante *Esposto ✓*), *Settimana* (sette
  giorni con le icone dei rifiuti, da oggi o dal lunedì) e *Mese* (il calendario con un
  pallino per ogni ritiro e il dettaglio del giorno). Seguono il tema chiaro o scuro di
  Home Assistant.
- **Avvisi in Riparazioni.** Un ritiro che cade in un giorno festivo nei prossimi 30
  giorni; il calendario che sta per scadere o è scaduto, con il modulo per rinnovarlo;
  una configurazione non valida. Se il calendario non si può calcolare, le entità sono
  non disponibili, mai "Nessuno".
