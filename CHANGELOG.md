# Changelog

Qui sono registrate tutte le modifiche rilevanti. Le versioni seguono lo stile del
[Semantic Versioning](https://semver.org). Ogni voce dice cosa cambia nel comportamento,
non solo "correzioni", e quello che richiede qualcosa da te viene prima di tutto, sotto
*Cambiato — leggi prima di aggiornare*.

## [Non rilasciato]

## [0.3.0] — 2026-09-26 — più facile da usare

### Cambiato
- **Destinatari dei promemoria con ricerca.** Invece di una fila di caselle, un campo in
  cui scrivi e scegli dai suggerimenti, con filtri per telefoni, altri servizi ed entità
  di notifica; ogni destinatario scelto ha la sua ✕ per toglierlo, e uno che non esiste
  più in Home Assistant resta visibile e segnalato.
- **Icona delle tipologie con ricerca** in un catalogo di icone per i rifiuti, cercabili
  in italiano (*pannolini*, *divano*, *pile*…), con l'anteprima.
- **Salva e Annulla sempre visibili** in fondo alle finestre di modifica; sul telefono la
  finestra sale dal basso e usa tutta la larghezza.
- **Righe da toccare**: regole, eccezioni e promemoria si aprono toccando la riga, senza
  il pulsante *Modifica* che sul telefono andava a capo.
- **L'editor di una regola la scrive in una frase** mentre la compili; *Ogni quante
  settimane* e i giorni della settimana stanno su una riga anche sul telefono.
- **Panoramica sul telefono:** le cose da controllare vengono prima dei ritiri.
- **Impostazioni sul telefono:** il santo patrono non è più schiacciato.
- **Card *Oggi e domani*:** dice in che giorno si espone ("da mettere fuori domani dalle
  20:00"). **Card *Mese*:** la legenda dei colori e i giorni passati attenuati, come nella
  settimana.
- Pulsanti piccoli più facili da toccare, focus visibile con la tastiera, scheda attiva
  sempre visibile.

## [0.2.0] — 2026-09-26 — pannolini e revisione completa

### Aggiunto
- **I pannolini tra le tipologie pronte**, con il loro colore e la loro icona. Non sono
  selezionati all'installazione: li scegli se ti servono. Chi ha già installato
  l'integrazione li aggiunge dal pannello, in *Tipologie → Nuova tipologia*.

### Corretto
- **Un promemoria con più rifiuti non si perde più per colpa di uno.** Se nello stesso
  messaggio c'erano rifiuti con orari di esposizione diversi e la finestra di uno si era
  già chiusa, il messaggio non partiva per nessuno. Ora parte per quelli ancora da esporre.
- **Il pannello non sovrascrive più le modifiche di un altro amministratore.** Con due
  schede aperte, un salvataggio poteva cancellare quello fatto nell'altra senza avviso.
- **La pagina *Impostazioni* non perde più le modifiche non salvate** quando qualcuno
  conferma un ritiro o scatta la mezzanotte mentre la stai compilando.
- **Card e pannello restano aggiornati dopo un ricaricamento dell'integrazione.** Prima
  smettevano di aggiornarsi finché non si ricaricava la pagina.
- **La conferma dalle card vale solo per oggi e domani**, come il pulsante *Esposto*: una
  data sbagliata non spegne più i promemoria della settimana dopo.
- **Solleciti di un promemoria spento non partono più**, e ridurre il numero di richiami
  vale anche per quelli già programmati.
- **Eliminare una tipologia toglie anche le sue conferme e i suoi avvisi ignorati.**
- **Ora legale.** Un orario che il cambio dell'ora salta (le 02:30 dell'ultima domenica
  di marzo) ora vale alle 03:00, come dice la specifica, e non alle 03:30.
- **Riparazioni.** Disattivando l'integrazione i suoi avvisi spariscono, e il modulo di
  rinnovo del calendario non va più in errore.
- **Il pulsante *Esposto* dice quando non c'è niente da confermare**, invece di non fare
  nulla in silenzio.
- **Più robusto con una configurazione rovinata**: interruttore e card non vanno più in
  errore, e un sensore di una tipologia eliminata mentre il calendario non era
  disponibile viene tolto al riavvio.
- **Più veloce** con regole valide per molti anni, e il calendario non calcola più di due
  anni per richiesta.
- **Il pannello e le card mostrano gli errori di connessione** invece di restare fermi, e
  il mese mostrato non viene più coperto da una risposta arrivata in ritardo.

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
