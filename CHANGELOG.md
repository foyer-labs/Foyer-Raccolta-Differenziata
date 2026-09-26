# Changelog

Qui sono registrate tutte le modifiche rilevanti. Le versioni seguono lo stile del
[Semantic Versioning](https://semver.org). Ogni voce dice cosa cambia nel comportamento,
non solo "correzioni", e quello che richiede qualcosa da te viene prima di tutto, sotto
*Cambiato — leggi prima di aggiornare*.

## [Non rilasciato]

## [0.5.2] — 2026-09-26 — card più ordinate

### Corretto
- **Testata delle card sul telefono:** la pillola della piattaforma e il "?" non vanno
  più a capo sotto il titolo. Titolo e data stanno uno sopra l'altro a sinistra, pillola
  e "?" sulla stessa riga a destra.
- **Cosa va dove:** le descrizioni partono tutte dallo stesso margine, qualunque sia la
  lunghezza del nome del rifiuto; sul telefono il nome sta sopra la sua descrizione, che
  usa tutta la larghezza.

## [0.5.1] — 2026-09-26 — finestre più solide

Una revisione approfondita di finestre, moduli e card. Dopo l'aggiornamento ricarica la
pagina (nell'app: chiudila e riaprila).

### Corretto
- **Impostazioni:** se un'altra finestra o un altro dispositivo aveva salvato nel
  frattempo, salvare non riusciva mai più ("qualcun altro ha salvato", all'infinito).
- **Finestre delle card tagliate:** con alcuni temi (effetto vetro) o dentro un
  carosello, la finestra degli orari o di *Cosa va dove* restava schiacciata dentro la
  card. Ora le finestre stanno sempre sopra tutto.
- **Escape e clic fuori:** chiudono solo la finestra in cima, non quella di Home
  Assistant sotto; selezionare del testo trascinando fuori dalla finestra non la chiude
  più; durante un salvataggio la finestra non si chiude.
- **Dopo un salvataggio** la finestra di modifica non ricompare per un attimo.
- **Errori più chiari:** *Prima di salvare* dice dove sta il problema ("Periodo dal 1
  ottobre 2026 al 31 marzo 2027 · gio"), e nessun errore compare più come codice grezzo.
- **Cambiare scheda** con modifiche non salvate in Impostazioni o Piattaforma chiede
  conferma invece di buttarle via.
- **Eliminare una tipologia o togliere la piattaforma:** l'avviso si legge in *Prima di
  salvare*; prima era una finestra del browser che nell'app poteva non comparire.
- **Qualcosa eliminato da un altro dispositivo** mentre lo modificavi non viene più
  ricreato salvando.
- **Importare da Excel:** *Annulla* ferma davvero l'importazione; si può scegliere di
  nuovo lo stesso file corretto; un file cambiato dopo averlo scelto ha il suo messaggio.
- **File Excel della piattaforma:** una riga copiata (con l'ID nascosto) non cancella più
  l'originale; con *Sostituisci tutto* un solo foglio della piattaforma è un errore
  invece di svuotare l'altro; fogli vuoti tolgono la piattaforma; i giorni si
  riconoscono anche scritti per intero (*Lunedì*).
- **Piattaforma:** una fascia nuova nasce già valida; un orario o una data svuotati non
  si salvano vuoti; le fasce si mettono in ordine e quelle che si toccano (08-12 e
  12-14) sono un'apertura sola; un festivo fuori dai periodi è *orario non indicato*;
  nessun avviso "orario non indicato" in un giorno con un orario diverso.
- **Card:** si riprendono da sole dopo un riavvio di Home Assistant; usano il fuso di
  Home Assistant anche su un telefono in un altro fuso; oltre la settimana dicono il
  giorno ("apre giovedì 8"); la pillola in una card stretta finisce con i puntini.
- **Regole:** dopo un errore di rete *Salva* non resta spento; **Solleciti:** il menu
  dei minuti mostra il valore salvato; **Tipologie:** un'icona scritta a mano vale anche
  senza Invio; **Patrono e periodi annuali:** i giorni sono quelli del mese scelto.

### Aggiunto
- **Festivi ignorati** in Panoramica, con *Ripristina avviso* per chi ha premuto Ignora
  per sbaglio.

## [0.5.0] — 2026-09-26 — cosa va dove, e la piattaforma ecologica

### Aggiunto
- **Cosa va dove, nelle card.** Un **?** nella testata apre l'elenco delle tipologie con
  la loro nota; toccando una chip con il piccolo **?** si legge la nota di quella
  tipologia.
- **La piattaforma ecologica.** Una scheda nuova del pannello, *Piattaforma*: nome,
  nota, fino a quattro periodi con le date e l'anno, fino a tre fasce orarie al giorno,
  e i giorni con un orario diverso. Nei festivi risulta chiusa, salvo eccezione; fuori
  dai periodi l'orario è *non indicato*, e la Panoramica avvisa un mese prima che gli
  orari finiscano.
- **Aperta adesso?** Le card lo dicono nella testata (*Aperta fino alle 12:00*, *Chiusa ·
  apre giovedì alle 14:00*); un tocco apre gli orari della settimana. Si nasconde
  dall'editor della card.
- **`binary_sensor.raccolta_differenziata_piattaforma_ecologica`**, acceso quando è
  aperta, per le automazioni.
- Il **file Excel** ha i fogli *Piattaforma* e *Piattaforma eccezioni*; un file della 0.4
  si importa ancora e non tocca gli orari.

## [0.4.3] — 2026-09-26 — il modulo precompilato resta chiuso

### Corretto
- **"Annulla" chiude davvero il modulo aperto dalla Panoramica.** Con *Aggiungi una
  data* o *Crea eccezione* si apre il modulo di un'eccezione già compilato; dopo
  *Annulla* si riapriva da solo appena Home Assistant aggiornava qualcosa, cioè di
  continuo in una casa con molti sensori. Succedeva sul computer come nell'app.

## [0.4.2] — 2026-09-26 — una finestra alla volta

### Corretto
- **"Annulla" non riapre più la finestra di modifica.** Premendo *Salva* in una
  finestra di modifica (un ritiro, una regola, una tipologia, un promemoria) si apre
  *Prima di salvare*, ma la finestra sotto restava visibile con i suoi *Annulla* e
  *Salva*: il suo *Annulla* chiudeva soltanto *Prima di salvare*, e la finestra di
  modifica sembrava ricomparire. Ora, mentre *Prima di salvare* è aperta, la finestra
  sotto non si vede, e il pulsante per tornarci si chiama **Indietro**. Segnalato da
  chi usa Firefox, ma valeva con ogni browser.

## [0.4.1] — 2026-09-26 — le card nel selettore

### Corretto
- **Le card si aggiungono di nuovo dall'interfaccia.** Nel selettore delle card
  (*Modifica plancia → Aggiungi scheda*, cerca «Raccolta») le tre card comparivano senza
  poter essere aggiunte, o non comparivano: il loro codice poteva caricarsi prima che
  Home Assistant preparasse il registro degli elementi, e lì restavano invisibili. Ora
  aspettano che Home Assistant sia pronto. Dopo l'aggiornamento ricarica la pagina del
  browser (o chiudi e riapri l'app).

## [0.4.0] — 2026-09-26 — il calendario in Excel

### Aggiunto
- **Configurazione in Excel**, in *Impostazioni* del pannello. *Scarica il modello* dà un
  file con una guida alla compilazione e un foglio per tipologie, regole, eccezioni,
  promemoria, vacanze e impostazioni, con menu a tendina, un esempio per foglio e le sei
  tipologie di base già scritte. *Esporta in Excel* dà lo stesso file con la tua
  configurazione. *Importa da Excel…* lo rilegge: scegli ogni volta se **sostituire
  tutto** o **aggiungere soltanto**. Gli errori dicono foglio, riga e colonna; prima di
  salvare vedi cosa cambia, come per ogni modifica. Funziona con Excel, LibreOffice e
  Google Fogli.
- Home Assistant installa da solo la libreria `openpyxl`, che serve a leggere e scrivere
  il file.

## [0.3.1] — 2026-09-26 — repository più pulito

### Cambiato
- **Il repository mostra solo quello che serve a chi installa**: l'integrazione, la guida
  con le immagini, le novità e le istruzioni per chiedere aiuto. Il materiale di sviluppo
  (specifica, test, sorgenti del frontend, strumenti) è sul ramo `sviluppo`.
- **Il README porta alla guida** in cima alla pagina e in una sezione *Documentazione*, e
  i suoi collegamenti funzionano anche quando HACS lo mostra dentro Home Assistant.

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
[docs/GUIDA.md](docs/GUIDA.md), la specifica sul ramo di sviluppo
([docs/SPEC.md](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/sviluppo/docs/SPEC.md)).

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
