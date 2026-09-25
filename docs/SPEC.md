# Foyer Raccolta Differenziata — Specifica

Stato: bozza 4 (2026-09-25). Tutto il progetto è in italiano: interfaccia, documentazione,
codice, commenti e commit (decisione 19).

Questo documento è la fonte di verità. Dove una scelta sembra arbitraria, il motivo è
scritto accanto: se il motivo non regge più, si cambia la spec prima del codice.

Le scelte fatte scrivendo la spec senza una decisione esplicita del proprietario vanno
marcate **[da confermare]** e raccolte in §17. Finché restano aperte, nessuna fase che le
tocca può partire. Al momento §17 è vuota.

---

## 1. Che cos'è

Un'integrazione personalizzata di Home Assistant, installabile da HACS, che conosce il
calendario della raccolta differenziata di casa e:

- calcola quali rifiuti passano a ritirare in ogni giorno, a partire da regole ricorrenti,
  periodi stagionali ed eccezioni puntuali;
- ricorda quando esporre i sacchi, con promemoria configurabili e una conferma
  "Esposto ✓" che ferma i solleciti;
- espone entità native (calendario, sensori, pulsante, interruttore) utilizzabili nelle
  automazioni;
- offre un pannello di configurazione nella barra laterale e tre card Lovelace.

### 1.1 Che cosa non è (fuori perimetro)

Ogni voce qui sotto è stata valutata e scartata. Aggiungerla richiede prima una modifica
della spec.

- **Più calendari** nella stessa installazione (casa + seconda casa): un solo calendario
  (decisione 13).
- **Import/export** di ICS o JSON: il backup di Home Assistant copre la configurazione
  (decisione 15).
- **Scraping** dei siti dei gestori o dei comuni.
- **Turni** su chi porta fuori il bidone (decisione 18).
- **Filtri di presenza** ("solo chi è in casa") sui promemoria (decisione 9).
- **Spostamento automatico** dei ritiri nei giorni festivi (decisione 2).
- **Orari dell'isola ecologica**, prenotazioni degli ingombranti presso il gestore.
- **Configurazione YAML**: la configurazione è solo da interfaccia.
- **Lingue diverse dall'italiano** (decisione 19).

---

## 2. Glossario

| Termine | Significato |
|---|---|
| **Tipologia** | Un tipo di rifiuto (Umido, Carta, …): nome, colore, icona, note. |
| **Regola** | Una ricorrenza di ritiro di una tipologia, con un eventuale periodo di validità. |
| **Periodo** | L'intervallo di date in cui una regola vale: sempre, annuale ricorrente, o con anno. |
| **Eccezione** | Una modifica puntuale al calendario: aggiungi, togli, sposta. |
| **Ritiro** | Una coppia (data, tipologia) risultato del calcolo. È l'unità di tutto il resto. |
| **Finestra di esposizione** | L'intervallo in cui il sacco di un ritiro va messo fuori. |
| **Profilo di promemoria** | Una regola di notifica: quando, per quali tipologie, a chi. |
| **Invio** | Una notifica concreta generata da un profilo per un gruppo di ritiri. |
| **Conferma** | La dichiarazione "Esposto ✓" di un ritiro. |
| **Sospensione** | Un intervallo in cui i promemoria tacciono (vacanza). |
| **Validità** | La data fino a cui l'utente dichiara il calendario verificato. |
| **Anomalia** | Una situazione che il sistema segnala senza correggerla (festività, sovrapposizioni, …). |

---

## 3. Invarianti

Sono le regole che, se violate, rompono una funzione centrale. Sono ripetute in `CLAUDE.md`.

**INV-1 — Il nucleo è puro.** Il calcolo dei ritiri e la decisione dei promemoria vivono in
`core/`, non importano nulla da `homeassistant.*`, non leggono l'orologio (l'istante
corrente è un parametro), non fanno I/O. Un esecutore separato invia le notifiche, uno
schedulatore separato possiede i timer. Un test in CI verifica il divieto di import: se
fallisce, si corregge il codice, mai il test.
*Perché:* le regole di calendario (ancore, periodi a cavallo d'anno, sovrapposizioni,
spostamenti) sono il punto dove si sbaglia, e devono essere verificabili con migliaia di
casi senza avviare Home Assistant.

**INV-2 — Un errore non si traveste da "nessun ritiro".** Se la configurazione non è
leggibile o il calcolo fallisce, le entità vanno in `unavailable` e compare un problema in
Riparazioni. Mai "Nessuno" o una card vuota.
*Perché:* un sensore che dice "oggi nessun ritiro" quando in realtà non sa, fa perdere un
ritiro in silenzio: è l'unico modo in cui questo sistema fa danno.

**INV-3 — Lo stato sopravvive ai riavvii.** Conferme, invii già fatti, rinvii, anomalie
ignorate e l'ultimo istante di attività sono persistiti. Al riavvio i promemoria persi si
recuperano secondo §8.6.

**INV-4 — Nessuna data si sposta da sola.** Il sistema segnala (festività, sovrapposizioni,
calendario scaduto) ma non corregge mai il calendario al posto dell'utente.
*Perché:* ogni comune applica regole diverse; indovinare produce date sbagliate con
l'aria di essere giuste.

**INV-5 — Tutto in italiano.** Interfaccia, documentazione, identificatori, commenti,
commit. Restano in inglese solo i nomi imposti da Home Assistant, HACS e dalle librerie.
Nessun testo visibile è scritto nel codice di un componente: passa da `translations/`
(backend) o dal file dei testi del frontend. Unica eccezione: il titolo della voce di
configurazione ("Raccolta differenziata"), che Home Assistant non permette di tradurre.

**INV-6 — Semplice prima di completo.** Una funzione non in questa spec non si aggiunge
"perché costa poco". Il proprietario ha scelto la semplicità esplicitamente (decisione 9).

---

## 4. Modello dati

Tutti gli identificatori interni sono stringhe stabili generate alla creazione e mai
riutilizzate. Rinominare una tipologia non cambia il suo identificatore, né gli `entity_id`.

### 4.1 Tipologia

| Campo | Tipo | Note |
|---|---|---|
| `id` | stringa | Stabile. Base dello `unique_id` delle entità per tipologia. |
| `nome` | stringa, 1–40 caratteri | Univoco (senza distinzione maiuscole/minuscole). |
| `colore` | `#rrggbb` | Il testo sopra il colore è scelto automaticamente (bianco/nero) per il contrasto. |
| `icona` | `mdi:…` | |
| `note` | stringa, max 500, facoltativa | "Cosa ci va". Mostrata nelle card al tocco. |
| `esposizione` | finestra, facoltativa | Sovrascrive la finestra globale (§4.5). |

Preset proposti all'installazione (tutti selezionati, deselezionabili):

| Nome | Colore | Icona |
|---|---|---|
| Umido | `#795548` marrone | `mdi:food-apple` |
| Carta | `#1e88e5` blu | `mdi:newspaper-variant` |
| Plastica | `#fdd835` giallo | `mdi:bottle-soda` |
| Vetro | `#43a047` verde | `mdi:glass-fragile` |
| Secco | `#757575` grigio | `mdi:trash-can` |
| Verde | `#8bc34a` verde chiaro | `mdi:leaf` |

*Perché questi colori:* sono quelli dei contenitori più diffusi in Italia. Molti comuni ne
usano altri (la plastica in blu, il secco in rosso); il colore è modificabile.

Eliminare una tipologia elimina a cascata le sue regole, le sue eccezioni, le sue conferme
e le sue entità. Il pannello mostra prima cosa verrà eliminato.

Una tipologia senza regole è valida: i suoi ritiri vengono solo dalle eccezioni "aggiungi".
È il modo di gestire ingombranti e ritiri su prenotazione (decisione 17).

### 4.2 Regola

| Campo | Tipo | Note |
|---|---|---|
| `id` | stringa | |
| `tipologia` | id | |
| `nome` | stringa, facoltativa | Per riconoscerla nel pannello ("Estate", "Inverno"). |
| `ricorrenza` | una delle forme di §4.2.1 | |
| `periodo` | una delle forme di §4.2.2 | |

Una tipologia può avere più regole.

#### 4.2.1 Ricorrenza

La parola "bisettimanale" non compare mai, né nell'interfaccia né nel codice: in italiano
vuol dire sia "ogni due settimane" sia "due volte a settimana" (decisione 1).

**Settimanale** — "ogni `N` settimane, nei giorni `G`, con ancora `A`".

- `N`: intero 1–8. 1 = ogni settimana, 2 = una settimana sì e una no, …
- `G`: insieme non vuoto di giorni della settimana. "Lunedì e giovedì" con `N = 1` è il
  caso "due volte a settimana".
- `A`: una data. Serve solo a stabilire *quali* settimane contano.

Regola di calcolo: le settimane iniziano il lunedì. Sia `s(d)` il lunedì della settimana che
contiene la data `d`. Un giorno `d` genera un ritiro se il suo giorno della settimana è in
`G` e `(s(d) − s(A)) / 7` è multiplo di `N`. Il calcolo vale in entrambe le direzioni:
l'ancora **non** è una data di inizio — l'inizio lo decide il periodo (decisione 25).
*Perché:* separare "fase" e "inizio" evita che chi inserisce come
ancora "il primo ritiro che ricordo" perda i ritiri precedenti a quella data.

Nell'interfaccia l'ancora si chiede come "un giorno in cui questo ritiro c'è stato o ci
sarà" e il pannello mostra subito le prossime quattro date risultanti, perché un'ancora
sbagliata di una settimana produce un calendario plausibile ma sfasato.

**Mensile per posizione** — "il `P` `giorno` del mese".

- `P`: insieme non vuoto di posizioni tra 1ª, 2ª, 3ª, 4ª, ultima.
- `giorno`: un giorno della settimana.
- Esempio: "il 2° e il 4° giovedì".
- La "5ª" non esiste come scelta: esiste solo in alcuni mesi, e "ultima" copre i casi reali.

**Mensile per data** — "il giorno `X` del mese".

- `X`: insieme non vuoto di interi 1–31. Esempio: "il 1 e il 15".
- Nei mesi in cui `X` non esiste (31 aprile, 30 febbraio), quel ritiro **non avviene**, e
  il pannello lo segnala come anomalia informativa (decisione 26). *Perché:* spostarlo
  all'ultimo giorno del mese sarebbe uno spostamento automatico (INV-4); se il comune fa
  così, si aggiunge un'eccezione.

#### 4.2.2 Periodo

Tre forme (decisione 4):

- **Sempre**: la regola vale ogni giorno.
- **Annuale**: dal `gg/mm` al `gg/mm`, ogni anno. Può scavalcare la fine dell'anno
  (01/11 → 31/03). Estremi inclusi. Il 29/02 non è ammesso come estremo di un periodo
  annuale: il pannello lo rifiuta (decisione 27). *Perché:* negli anni non bisestili non
  esiste, e ogni lettura alternativa è un'ipotesi.
- **Con anno**: dal `gg/mm/aaaa` al `gg/mm/aaaa`, estremi inclusi, fine ≥ inizio.

Fuori da ogni periodo di ogni regola, la tipologia non ha ritiri da regola.

#### 4.2.3 Più regole sullo stesso giorno

Per una tipologia `T` e un giorno `d`, siano `R(d)` le regole di `T` il cui periodo copre `d`.

1. Se in `R(d)` c'è almeno una regola **con anno**, le regole **annuali** e **sempre** di
   `R(d)` vengono ignorate per quel giorno (decisione 5). *Perché:* la regola con anno è
   quasi sempre il calendario nuovo del comune che sostituisce l'abitudine.
   "Sempre" è trattata come "annuale" ai fini di questa precedenza: cede anch'essa alla
   regola con anno (decisione 28).
2. Le regole rimaste si **sommano**: `d` ha un ritiro di `T` se almeno una di esse lo genera
   (decisione 22).
3. In entrambi i casi il sistema produce un'anomalia (§6.3), anche quando il risultato è
   quello voluto: la sovrapposizione va vista, non indovinata.

Le anomalie di sovrapposizione si riferiscono alle regole, non ai singoli giorni: "Verde:
le regole *Estate* e *Calendario 2027* si sovrappongono dal 01/06/2027 al 31/08/2027 —
vale solo *Calendario 2027*".

### 4.3 Eccezione

| Tipo | Campi | Effetto |
|---|---|---|
| **Aggiungi** | tipologia, data, nota facoltativa | Aggiunge il ritiro (tipologia, data). |
| **Togli** | tipologia, data, nota facoltativa | Rimuove il ritiro (tipologia, data). |
| **Sposta** | tipologia, da, a, nota facoltativa | Toglie (tipologia, da) e aggiunge (tipologia, a), ricordando l'origine. |

Precedenza: eccezione > periodo > regola base (decisione 3). Le eccezioni si applicano
dopo il calcolo delle regole, in quest'ordine: togli, partenze degli spostamenti, arrivi
degli spostamenti, aggiungi. Separare partenze e arrivi rende il risultato indipendente
dall'ordine in cui gli spostamenti sono stati inseriti: uno spostamento che arriva nel
giorno da cui un altro parte resta (25/12 → 27/12 e 18/12 → 25/12 danno 25 e 27).

Casi limite, tutti con un'anomalia informativa e mai con un errore (le regole possono
cambiare dopo che l'eccezione è stata scritta):

- **Togli** o **sposta** su un giorno in cui la regola non genera nulla: nessun effetto sul
  giorno di partenza; lo sposta aggiunge comunque la data di arrivo. Anomalia
  "eccezione senza ritiro da togliere".
- **Aggiungi** o arrivo di uno **sposta** su un giorno che ha già quel ritiro: un solo
  ritiro. Anomalia "eccezione ridondante".
- Due eccezioni sulla stessa (tipologia, data) di partenza: il pannello non lo permette.

Vincoli: le date di un'eccezione sono comprese tra il 01/01/2000 e il 31/12/2099, come
l'ancora delle regole settimanali e le date dei periodi con anno. La nota di
un'eccezione è lunga al massimo 200 caratteri, il nome di una regola 40.

### 4.3.1 Formato nell'archivio

Date ISO (`2026-09-22`); giorno e mese dei periodi annuali e del patrono come `MM-GG`
(`11-01`); orari `HH:MM`; giorni della settimana come interi, 0 = lunedì … 6 = domenica;
la posizione "ultima" di una ricorrenza mensile è `-1`. Aggiungi e togli hanno `data`,
sposta ha `da` e `a`.

### 4.4 Festività

Il sistema conosce le festività nazionali e un patrono configurabile, e le usa **solo** per
segnalare (decisione 2, INV-4).

Festività nazionali: 1 gennaio, 6 gennaio, Pasqua, Lunedì dell'Angelo, 25 aprile, 1 maggio,
2 giugno, 15 agosto, 4 ottobre, 1 novembre, 8 dicembre, 25 dicembre, 26 dicembre. La
Pasqua è calcolata (algoritmo gregoriano).

Il 4 ottobre (San Francesco d'Assisi) è festivo **solo dal 2026**: Legge 8 ottobre 2025
n. 151, Gazzetta Ufficiale n. 236 del 10/10/2025, in vigore dal 1° gennaio 2026
(decisione 29). Per gli anni precedenti non va segnalato.

Patrono: facoltativo, una data `gg/mm` e un nome ("Sant'Ambrogio").

Un ritiro in un giorno festivo produce l'anomalia "ritiro in giorno festivo", con due
azioni: **Crea eccezione** (apre il modulo precompilato: togli o sposta) e **Ignora**
(l'anomalia sparisce per quel ritiro e resta ignorata anche dopo i riavvii).

### 4.5 Finestra di esposizione

La finestra dice quando il sacco di un ritiro va messo fuori (decisione 6).

| Campo | Valori |
|---|---|
| `inizio_giorno` | "il giorno prima" oppure "il giorno stesso" |
| `inizio_ora` | HH:MM |
| `fine_ora` | HH:MM del giorno del ritiro |

Default globale all'installazione: dal giorno prima alle 20:00 al giorno stesso alle 06:00.
Ogni tipologia può sovrascriverla. Vincolo: la fine è dopo l'inizio.

La finestra alimenta: il sensore "Da esporre", il riferimento "all'apertura" dei
promemoria, il limite per richiami e recuperi, lo stato delle card.

### 4.6 Validità del calendario

Campo facoltativo `valido_fino_al` (data). Vedi §9.3 (decisione 14).

### 4.7 Profilo di promemoria

| Campo | Tipo | Note |
|---|---|---|
| `id`, `nome` | | |
| `attivo` | booleano | |
| `quando` | una forma di §8.1 | |
| `tipologie` | "tutte" oppure elenco | "Tutte" include le tipologie create dopo. |
| `destinatari` | elenco non vuoto di servizi `notify.*` e/o entità `notify` | Vedi §8.3. |

I solleciti non sono un campo del profilo: sono un'impostazione unica (§4.9).

### 4.9 Solleciti

Un interruttore globale **"Sollecita se non confermo"**, nella pagina Promemoria, **spento
all'installazione** (decisione 39). *Perché:* alla maggior parte delle persone basta la
notifica; essere inseguiti da un promemoria ripetuto è fastidioso, e chi lo vuole lo
accende con un gesto.

| Campo | Tipo | Note |
|---|---|---|
| `solleciti` | booleano, default spento | |
| `richiami` | 1–2, default 1 | Visibile e usato solo con i solleciti accesi. |
| `richiamo_dopo` | 5–240 minuti, default 30 | Visibile e usato solo con i solleciti accesi. |

Valgono per tutti i profili.

- **Spenti:** nessun richiamo; le notifiche dell'app Companion hanno solo il pulsante
  **Esposto ✓**.
- **Accesi:** richiami secondo §8.5; le notifiche dell'app Companion hanno anche
  **Ricordamelo tra 30 minuti**.

La conferma esiste sempre, con i solleciti accesi o spenti: con due profili (la sera prima
e la mattina) confermare la sera ferma il promemoria della mattina.

Spegnere i solleciti annulla subito i richiami e i rinvii già programmati.

### 4.8 Sospensione

- Un elenco di intervalli `dal`–`al` (date, estremi inclusi), gestiti nel pannello.
- Un interruttore "Sospendi promemoria" che sospende da subito, a tempo indeterminato.

Un invio (promemoria, richiamo o rinvio) tace se **l'istante in cui partirebbe** cade in
un intervallo, oppure se in quell'istante l'interruttore è acceso (decisione 30). Conta
il momento della notifica, non la data del ritiro: un promemoria "2 giorni prima" inviato
prima della partenza arriva anche se il ritiro cade durante la vacanza; il promemoria
della sera prima del rientro tace. È la stessa regola dell'interruttore, applicata alle
date.

Un invio taciuto è scartato, non rimandato alla fine della sospensione.

La sospensione non tocca il calendario, i sensori né le card: i ritiri continuano a
esistere. Le card mostrano "Promemoria sospesi fino al …".

---

## 5. Configurazione complessiva

Un'unica voce di configurazione per installazione (decisione 13). La configurazione
salvata contiene: tipologie, regole, eccezioni, finestra globale, patrono, validità,
profili, intervalli di sospensione. È versionata (§11) e validata interamente a ogni
salvataggio: una configurazione invalida non viene salvata, mai salvata a metà.

---

## 6. Motore di calcolo (`core/`)

### 6.1 Interfaccia

```
calcola(config, dal, al, fuso, festivi_ignorati) -> Risultato
    Risultato.ritiri:   elenco ordinato di Ritiro
    Risultato.anomalie: le anomalie dei singoli ritiri (ritiro_festivo)

anomalie(config, oggi) -> elenco di Anomalia
    le anomalie della configurazione vista da oggi (tutte le altre di §6.3)
```

`festivi_ignorati` sono le coppie (data, tipologia) su cui l'utente ha scelto "Ignora".
Le anomalie della configurazione stanno in una funzione separata perché dipendono da
"oggi", che `calcola` non riceve.

`Ritiro`: data, tipologia, origine (`regola` con gli id delle regole che lo generano,
`aggiunto`, `spostato` con la data di partenza), finestra di esposizione assoluta
(inizio e fine come istanti locali), `festivo` (nome della festività o nulla),
`da_verificare` (vero oltre la validità).

Non ci sono due ritiri con la stessa (data, tipologia).

`calcola` non legge l'orologio né il fuso orario del sistema: il fuso è un campo
dell'ingresso. È deterministica: stessi ingressi, stessa uscita, stesso ordine.

### 6.2 Orizzonte

Il motore accetta qualsiasi intervallo. Le entità guardano al massimo 366 giorni avanti:
oltre, "prossimo ritiro" è sconosciuto.

### 6.3 Anomalie

| Codice | Gravità | Quando |
|---|---|---|
| `ritiro_festivo` | avviso | Un ritiro cade in una festività (non ignorata). |
| `sovrapposizione_mista` | avviso | Regole annuali/sempre e con anno si sovrappongono (§4.2.3). |
| `sovrapposizione_stesso_tipo` | avviso | Due regole in vigore generano lo stesso ritiro (decisione 41). |
| `eccezione_senza_ritiro` | info | Togli/sposta su un giorno senza ritiro. |
| `eccezione_ridondante` | info | Aggiungi su un ritiro già presente. |
| `giorno_inesistente` | info | Mensile per data su un giorno che quel mese non ha. |
| `tipologia_senza_ritiri` | info | Nessun ritiro nei prossimi 366 giorni. |
| `calendario_in_scadenza` | avviso | Mancano ≤ 30 giorni alla validità. |
| `calendario_scaduto` | avviso | La validità è passata. |

Le anomalie della configurazione guardano oggi e il futuro: una regola con anno già
finita, un'eccezione su un giorno passato o la parte passata di una sovrapposizione non
si segnalano. Le sovrapposizioni tra regole dello stesso tipo e le tipologie senza
ritiri si cercano nell'orizzonte di §6.2; le sovrapposizioni miste in tutto il periodo
della regola con anno, da oggi. `giorno_inesistente` è una per regola, non una per mese.

Le anomalie si mostrano nel pannello, con un'azione dove ha senso. Solo
`ritiro_festivo` si può ignorare per il singolo ritiro; le altre spariscono quando la
causa sparisce.

---

## 7. Test del motore

- Ogni forma di ricorrenza, con ancore prima e dopo l'intervallo richiesto.
- Periodi annuali a cavallo d'anno, 29/02 negli anni bisestili e no.
- Precedenza con anno > annuale, somma nello stesso tipo, anomalie generate.
- Ordine delle eccezioni e tutti i casi limite di §4.3.
- Pasqua confrontata con una tabella nota per almeno 50 anni.
- Determinismo: due chiamate identiche danno risultati identici.
- Proprietà (con Hypothesis): un ritiro "togli" non compare mai; nessun duplicato;
  l'intervallo `[a, c]` è l'unione di `[a, b]` e `[b+1, c]`.

---

## 8. Promemoria

### 8.1 Quando

Tre forme (decisione 7):

- **`N` giorni prima alle `HH:MM`**, con `N` da 1 a 7.
- **Il giorno stesso alle `HH:MM`**.
- **All'apertura della finestra di esposizione** della tipologia.

L'ora è ora locale di Home Assistant. Se l'orario non esiste per il cambio all'ora legale,
l'invio avviene al primo minuto valido successivo; se esiste due volte, alla prima.

### 8.2 Raggruppamento

Un **invio** raggruppa tutti i ritiri che hanno lo stesso profilo, la stessa data di ritiro e
lo stesso istante di invio. Due tipologie con finestre diverse e profilo "all'apertura"
generano due invii distinti. Testo: "Stasera fuori: Umido e Carta" / "Domani: Vetro" /
"Oggi: Secco" secondo la distanza; le note delle tipologie non entrano nel messaggio.

Un ritiro già confermato non entra in un invio. Un invio senza ritiri non parte.

### 8.3 Destinatari e azioni

I destinatari si scelgono da un elenco che contiene sia i servizi `notify.*` (app
Companion, Telegram, email, …) sia le entità `notify`, raggiunte con `notify.send_message`
(decisione 31).

Ai servizi dell'app Companion (`notify.mobile_app_*`) il messaggio arriva con l'azione
**Esposto ✓** e, solo con i solleciti accesi (§4.9), anche **Ricordamelo tra 30 minuti**.
A tutti gli altri servizi e alle entità
`notify` arriva solo il testo: `notify.send_message` non supporta le azioni. Il pannello
indica accanto a ogni destinatario se riceverà i pulsanti. Le azioni
tornano come evento `mobile_app_notification_action`; l'identificativo dell'azione porta
un gettone opaco che il sistema riconduce all'invio.

### 8.4 Conferma

Una conferma riguarda uno o più ritiri (data, tipologia) e ferma **tutti** i promemoria
futuri di quei ritiri, di tutti i profili, per tutti i destinatari (decisione 8).

Si conferma da:

- l'azione **Esposto ✓** di una notifica: conferma i ritiri di quell'invio;
- l'entità `button` **Esposto**: conferma i ritiri la cui finestra è aperta; se nessuna è
  aperta, quelli del prossimo giorno di ritiro, purché sia oggi o domani; altrimenti non
  fa nulla e lo scrive nel registro di Home Assistant (decisione 32). *Perché:* chi
  esce di casa alle 19 mette fuori il sacco prima che la finestra si apra;
- le card (stesso comportamento del pulsante, per il giorno mostrato).

La conferma registra istante e, se noto, l'utente di Home Assistant che l'ha data. Si
può annullare dalle card finché la finestra è aperta. Le conferme si cancellano 7 giorni
dopo la data del ritiro.

### 8.5 Richiami e rinvio

Richiami e rinvii esistono solo con i solleciti accesi (§4.9).

- **Richiamo:** se dopo `richiamo_dopo` minuti almeno un ritiro dell'invio non è confermato
  e la finestra è ancora aperta, l'invio si ripete con i soli ritiri non confermati, al
  massimo `richiami` volte.
  Se la finestra non è ancora aperta (promemoria "2 giorni prima"), non si richiama
  (decisione 33): il richiamo esiste per il momento dell'esposizione, non per l'avviso
  anticipato.
- **Rinvio "tra 30 minuti":** reinvia lo stesso invio 30 minuti dopo, solo al destinatario
  che l'ha chiesto, se i ritiri non sono ancora confermati. I rinvii non consumano i
  richiami e non hanno un limite: li chiede una persona.

### 8.6 Riavvio e recupero

Il sistema persiste l'ultimo istante di attività (aggiornato ogni minuto e allo
spegnimento) e l'elenco degli invii fatti.

Al riavvio, ogni invio previsto tra l'ultimo istante di attività e ora, non ancora fatto,
parte subito se la finestra di esposizione dei suoi ritiri non è ancora chiusa; altrimenti
si scarta e lo si scrive nel registro di Home Assistant (decisione 10). Lo stesso vale per
richiami e rinvii pendenti. Un invio non parte mai due volte.

### 8.7 Divisione tra nucleo ed esecutore

```
decidi(config, risultato_calcolo, stato, evento, ora) -> Decisione
    Decisione.invii:        notifiche da mandare (testo, destinatari, azioni)
    Decisione.stato_nuovo:  conferme, invii fatti, rinvii pendenti
    Decisione.prossimo:     prossimo istante in cui richiamare decidi
```

`evento` è uno tra: conferma, annullamento di una conferma, rinvio, cambio
dell'interruttore di sospensione, oppure nessuno (timer, riavvio, modifica della
configurazione). L'esecutore chiama i servizi `notify`, lo schedulatore fissa un solo
timer sul `prossimo` istante.

Come è costruito (decisione 49):

- `decidi` gira ogni minuto, all'istante `prossimo` e a ogni evento; l'ultimo istante di
  attività è quello dell'ultima esecuzione. Un invio parte se il suo istante cade tra
  l'ultima esecuzione e ora, se non è già partito e se la finestra dei suoi ritiri non è
  chiusa: la stessa regola copre il funzionamento normale e il recupero dopo un riavvio.
  Alla prima esecuzione non si recupera nulla.
- Un invio porta il *tipo* di testo ("stasera", "oggi", "domani", "giorno",
  "sollecito"); le parole le scrive l'esecutore con `testi.py` (decisione 43).
- I destinatari si salvano come `{"tipo": "servizio", "id": "mobile_app_luca"}` o
  `{"tipo": "entita", "id": "notify.telegram"}`.
- Le azioni delle notifiche sono `RACCOLTA_ESPOSTO_<gettone>` e
  `RACCOLTA_RINVIA_<gettone>_<destinatario>`; il gettone è un'impronta di 12 caratteri
  dell'invio. Le notifiche dello stesso giorno hanno lo stesso `tag`, così un sollecito
  sostituisce il promemoria sul telefono invece di accumularsi.
- Un destinatario che non esiste più non blocca gli altri: l'errore va nel registro.

---

## 9. Integrazione Home Assistant

### 9.1 Dominio e installazione

- Dominio: `foyer_raccolta_differenziata` (decisione 23).
- Versione minima: Home Assistant 2026.6.0; test in CI sulla minima e sull'ultima stabile
  (decisione 24).
- Distribuzione: un solo repository HACS. L'integrazione serve i file del frontend
  (pannello e card) e carica le card su ogni pagina di Home Assistant con
  `add_extra_js_url`, in qualunque modalità delle dashboard, senza toccare le risorse
  Lovelace (decisione 46). I file costruiti sono nel repository: HACS non ha un passo di
  build.
- Configurazione iniziale (config flow, istanza unica): scelta dei preset, finestra di
  esposizione globale. Tutto il resto dal pannello.
- "Configura" dell'integrazione (options flow): contiene solo l'interruttore **Mostra nella
  barra laterale** (§10.1.1), perché sia recuperabile anche con il pannello nascosto.
- Il dispositivo "Raccolta differenziata" ha come `configuration_url` l'indirizzo interno del
  pannello: nella sua pagina Home Assistant mostra il collegamento che apre la
  configurazione, anche quando il pannello non è nella barra laterale.

### 9.2 Entità

Tutte appartengono a un dispositivo "Raccolta differenziata", e gli `entity_id` nascono
dal suo nome: `sensor.raccolta_differenziata_oggi` e così via. L'utente può rinominarli.
Il nome di un sensore per tipologia segue il nome della tipologia; il suo `entity_id` no.

| Entità | Stato | Attributi principali |
|---|---|---|
| `calendar.raccolta_differenziata` | acceso nel giorno di un ritiro | l'evento in corso o il prossimo |
| `sensor.…_oggi` | nomi delle tipologie di oggi, separati da virgola, oppure "Nessuno" | `tipologie` (id), `ritiri` (dettaglio), `confermati` |
| `sensor.…_domani` | come sopra, per domani | come sopra |
| `sensor.…_prossimo_ritiro_<tipologia>` | data (`device_class: date`); sconosciuto se non c'è un ritiro nell'orizzonte | `giorni_mancanti`, `origine`, `festivo`, `da_verificare` |
| `binary_sensor.…_da_esporre` | acceso se c'è un ritiro con finestra aperta e non confermato | `ritiri`, `fine_finestra` |
| `button.…_esposto` | — | vedi §8.4 |
| `switch.…_sospendi_promemoria` | acceso = promemoria sospesi | `intervalli` |

Calendario: un evento di un'intera giornata per ogni ritiro, titolo = nome della tipologia,
descrizione = note, più "(spostato dal gg/mm)" o "(da verificare)" dove serve.

"Nessuno" è lo stato solo quando il calcolo è riuscito e non ci sono ritiri. Se il calcolo
fallisce, le entità sono `unavailable` (INV-2).

Il sensore "Da esporre" non tiene conto della sospensione: la sospensione riguarda le
notifiche, non i fatti.

I sensori si aggiornano a mezzanotte, alle aperture e chiusure delle finestre, a ogni
conferma e a ogni modifica della configurazione.

Le entità per tipologia nascono e spariscono con la tipologia.

### 9.3 Riparazioni

- **Calendario in scadenza / scaduto** (decisione 14): 30 giorni prima di `valido_fino_al`
  compare un problema in Riparazioni. Il flusso di correzione chiede la nuova data (default
  +1 anno) dopo "Ho verificato il calendario del comune". Dopo la scadenza i ritiri
  continuano a essere calcolati e notificati, marcati "da verificare" in card e calendario.
- **Ritiri in giorni festivi nei prossimi 30 giorni, non gestiti** (decisione 34): un
  problema unico, con l'elenco dei ritiri, che rimanda al pannello. Sparisce quando ogni
  ritiro elencato ha un'eccezione o è stato ignorato. *Perché:* chi non apre mai il pannello non
  vedrebbe l'avviso prima del giorno sbagliato.
- **Configurazione non valida** (INV-2): le entità sono non disponibili finché non la si
  corregge dal pannello. Un **calcolo non riuscito** ha un problema a sé.
- Un **archivio illeggibile** non avvia l'integrazione: nessuna entità nasce, e la voce
  di configurazione mostra l'errore. Mai un calendario vuoto al posto di quello salvato.

### 9.4 Comandi WebSocket

| Comando | Chi | Scopo |
|---|---|---|
| `…/ritiri` | tutti | Ritiri in un intervallo, tipologie, conferme, sospensione, validità. Per le card. |
| `…/iscriviti` | tutti | Notifica le card quando qualcosa cambia. |
| `…/conferma`, `…/annulla_conferma` | tutti | Dalle card. |
| `…/config/leggi` | amministratori | |
| `…/config/salva` | amministratori | Configurazione intera, con numero di revisione: rifiutata se nel frattempo qualcun altro ha salvato. |
| `…/anteprima` | amministratori | `calcola` su una configurazione non salvata. |
| `…/anomalie/ignora` | amministratori | Solo `ritiro_festivo`. |

La validazione vive nel backend; il frontend la ripete solo per dare riscontro immediato.

Nessun servizio Home Assistant oltre a quelli impliciti delle entità (decisione 35):
`button.press` per confermare, lo `switch` per sospendere, il `calendar` e il
`binary_sensor` come trigger. *Perché:* INV-6; un servizio dedicato si aggiunge solo
quando un caso reale lo richiede.

---

## 10. Frontend

Lit + TypeScript + Vite, come Foyer Home Defender. Il frontend usa le variabili del tema di
Home Assistant: funziona in chiaro e in scuro senza configurazione.

### 10.1 Pannello di configurazione

Un pannello di Home Assistant, visibile solo agli amministratori (decisione 20), nella
barra laterale se l'utente non lo nasconde (§10.1.1). Pagine:

1. **Panoramica** — prossimi 30 giorni, anomalie con le loro azioni, stato di validità.
2. **Tipologie** — elenco, creazione, modifica (nome, colore, icona, note, finestra
   personalizzata), eliminazione con riepilogo di cosa sparisce.
3. **Regole** — per tipologia; modulo con ricorrenza e periodo; anteprima immediata delle
   prossime date.
4. **Eccezioni** — elenco per data, filtrabile per tipologia; modulo aggiungi/togli/sposta.
5. **Promemoria** — profili, solleciti (§4.9), vacanze.
6. **Impostazioni** — finestra di esposizione globale, patrono, validità, "Mostra nella
   barra laterale". La finestra sta qui e non tra i promemoria perché governa anche il
   calendario, i sensori e le card (decisione 50).

#### 10.1.1 Barra laterale

L'interruttore **Mostra nella barra laterale** (acceso all'installazione) decide se il
pannello compare nella barra di Home Assistant (decisione 38). Si trova in due posti che
modificano lo stesso valore: la pagina Impostazioni del pannello e il "Configura"
dell'integrazione. Il valore è salvato nelle opzioni della voce di configurazione, non
nell'archivio della configurazione di §11, così i due punti di modifica non si
contendono il numero di revisione.

Il cambio ha effetto subito, senza riavvio: il pannello si registra di nuovo con
`show_in_sidebar` e non viene mai tolto, così chi lo sta usando resta dov'è. Nascosto,
resta registrato e raggiungibile:

- dalla pagina del dispositivo "Raccolta differenziata" (collegamento di configurazione);
- dal suo indirizzo diretto.

Le pagine del pannello sono navigabili tra loro con il menu interno, quindi entrare da
uno qualsiasi di questi punti dà accesso a tutto.

Ogni salvataggio passa dall'anteprima: l'utente vede cosa cambia nei prossimi 60 giorni
prima di confermare (decisione 36). *Perché:* una regola sbagliata non dà errori,
dà un calendario plausibile e sbagliato.

### 10.2 Card

Tre card distinte (decisione 21), con una grafica curata: è la parte che si vede ogni
giorno.

- **Oggi e domani** (`foyer-raccolta-oggi-card`): due blocchi grandi, chip colorate con
  icona, stato di esposizione ("Da esporre entro le 06:00" / "Esposto ✓ alle 21:04 da
  Anna"), pulsante di conferma, banner di sospensione e di validità.
- **Settimana** (`foyer-raccolta-settimana-card`): sette giorni a partire da oggi (oppure
  da lunedì, configurabile), oggi evidenziato, chip colorate, note al tocco, indicazione
  "spostato dal …". Le card non segnalano i festivi: quell'avviso vive nel pannello e in
  Riparazioni (decisione 34).
- **Mese** (`foyer-raccolta-mese-card`): griglia mensile con pallini colorati per
  tipologia, navigazione tra i mesi, dettaglio del giorno al tocco.

Requisiti comuni: editor visuale nella dashboard, stati vuoti curati ("Nessun ritiro questa
settimana"), contrasto testo/colore calcolato, animazioni sobrie, funzionanti a 320 px di
larghezza.

Come sono fatte (decisione 52):

| Card | Tipo | Opzioni |
|---|---|---|
| Oggi e domani | `custom:foyer-raccolta-oggi-card` | `titolo` |
| Settimana | `custom:foyer-raccolta-settimana-card` | `titolo`, `inizio`: `oggi` (predefinito) o `lunedi` |
| Mese | `custom:foyer-raccolta-mese-card` | `titolo` |

- Compaiono nel selettore delle card di Home Assistant, con l'editor visuale.
- Leggono i ritiri con `…/ritiri` e si aggiornano con `…/iscriviti`: nessuna
  interrogazione a intervalli. Una volta al minuto si ridisegnano da sole, perché le
  finestre si aprono e si chiudono.
- La card oggi e domani mette in evidenza, nell'ordine: i ritiri da esporre adesso (con
  "Esposto ✓"), quelli già confermati (con chi e quando, e "Annulla"), il prossimo
  ritiro (con "Esposto ✓" se è oggi o domani, decisione 32).
- Una card non decide nulla: conferma e annullamento sono comandi al backend.

Prima di scrivere il frontend, una fase produce un prototipo HTML navigabile di pannello e
card (`docs/prototipo.html`) da approvare.

---

## 11. Persistenza

Due archivi `Store` di Home Assistant, ciascuno con il suo numero di versione e le sue
migrazioni:

- **configurazione** — §5, con numero di revisione;
- **stato** — conferme, invii fatti, rinvii e richiami pendenti, anomalie ignorate,
  ultimo istante di attività.

Separarli permette di salvare lo stato ogni minuto senza riscrivere la configurazione.

---

## 12. Lingua

Tutto in italiano (decisione 19). `strings.json`, `translations/en.json` e
`translations/it.json` contengono lo stesso testo italiano: Home Assistant ripiega
sull'inglese quando la lingua dell'utente non è disponibile, e così chiunque vede
l'italiano. `en.json` e `it.json` sono generati da `strings.json` da uno script; la CI
fallisce se divergono.

---

## 13. Struttura del repository

```
custom_components/foyer_raccolta_differenziata/
    core/              motore e decisione dei promemoria (puri, INV-1)
    __init__.py, config_flow.py, calendar.py, sensor.py, binary_sensor.py,
    button.py, switch.py, repairs.py, pannello.py, websocket.py,
    esecutore.py, schedulatore.py, archivio.py
    translations/  frontend/ (compilato)
frontend/          sorgenti Lit/TypeScript
tests/core/        test del nucleo, senza Home Assistant
tests/integrazione/ test con pytest-homeassistant-custom-component
docs/              SPEC.md, prototipo.html
```

CI: ruff, test del nucleo, test d'integrazione sulla versione minima e sull'ultima stabile,
test del divieto di import in `core/`, hassfest, validazione HACS, confronto delle chiavi
delle traduzioni, typecheck e build del frontend.

---

## 14. Piano a fasi

Una fase per sessione, un ramo per fase, una pull request per fase verso `main`.

| Fase | Contenuto |
|---|---|
| **0 — Fondamenta** | Struttura, `manifest.json`, `hacs.json`, licenza, CI completa, config flow con preset, archivi vuoti, test del divieto di import. |
| **1 — Motore** | `core/`: modello, ricorrenze, periodi, precedenze, eccezioni, festività, anomalie, test di §7. |
| **2 — Entità** | Caricamento della configurazione, calendario, sensori, binary sensor, riparazioni, aggiornamenti temporizzati. |
| **3 — Prototipo** | `docs/prototipo.html`: pannello e tre card, navigabile, da approvare. |
| **4 — Pannello** | Comandi WebSocket di amministrazione, pannello completo con anteprima, interruttore della barra laterale, "Configura" dell'integrazione, collegamento dal dispositivo. |
| **5 — Promemoria** | `decidi`, esecutore, schedulatore, conferme, richiami, rinvii, sospensione, recupero al riavvio, pulsante e interruttore. |
| **6 — Card** | Tre card, comandi WebSocket di lettura, registrazione automatica della risorsa. |
| **7 — Rilascio** | `docs/GUIDA.md`, README con le immagini delle card, `SUPPORT.md`, `CONTRIBUTING.md`, modelli di issue, icone, prima release GitHub. |

README e changelog esistono dalla prima fase e si aggiornano in ogni fase (§15.4); la Fase
7 li completa, non li crea.

---

## 15. Documentazione per l'utente

Tutto in italiano (decisione 40).

### 15.1 README

Il `README.md` è la porta d'ingresso ed è mantenuto per tutta la vita del progetto. Deve
essere **attraente per chi lo userà**, come quello di Foyer Home Defender: una frase che
dice cosa risolve, badge (versione, stato, Home Assistant minimo, HACS, licenza, CI),
un'immagine delle card appena esistono, "Cosa ottieni" scritto dal punto di vista di chi
porta fuori il sacco, "Per iniziare" in tre passi, "Stato", "Da sapere", il pulsante Buy
Me a Coffee di Foyer Labs con la nota "una donazione è un ringraziamento e non compra né
supporto né priorità", licenza.

"Da sapere" dice chiaramente che il sistema ricorda ciò che l'utente ha inserito, non
conosce il calendario del comune, e che dopo ogni cambio di calendario comunale va
aggiornato.

Il README non promette mai qualcosa che la versione pubblicata non fa: finché non c'è una
release, lo stato è "in progettazione".

### 15.2 Guida

Un solo documento, `docs/GUIDA.md`, **molto più semplice** della documentazione di Foyer
Home Defender. Contenuto: installazione, le tipologie, come si scrive una regola (con
l'ancora spiegata con un esempio, perché è l'unico concetto non ovvio), periodi ed
eccezioni, promemoria e solleciti, le card, le entità per le automazioni, domande
frequenti. Immagini dove aiutano. Nessun documento separato per argomento finché la
guida non diventa scomoda da leggere.

### 15.3 Changelog e release

- `CHANGELOG.md` in italiano, una sezione per versione e una `[Non rilasciato]` in cima.
  Ogni voce dice cosa cambia nel comportamento, non "correzioni varie"; ciò che richiede
  un intervento dell'utente viene prima, sotto *Cambiato — leggi prima di aggiornare*.
- Versioni in stile Semantic Versioning; la versione è la stessa in `manifest.json`, nel
  tag git (`vX.Y.Z`) e nel titolo della release.
- Ogni versione è una **release GitHub** con le note copiate dal changelog; le versioni di
  prova sono marcate come pre-release.
- Informazioni di contorno mantenute insieme al README: `CHANGELOG.md`, `LICENSE`,
  `NOTICE`, `SUPPORT.md` (come chiedere aiuto, nessuna garanzia di risposta),
  `CONTRIBUTING.md` (ambiente di sviluppo, regole del progetto), modelli di issue per
  bug e richieste.

### 15.4 Quando si aggiornano

Ogni pull request che cambia qualcosa di visibile all'utente aggiorna nello stesso ramo il
README (se cambia cosa si ottiene), la guida e la voce `[Non rilasciato]` del changelog.
Una fase non è finita finché questi tre non dicono la verità.

---

## 16. Registro delle decisioni

Decisioni del proprietario, 2026-09-25.

1. Ricorrenza come regola generica: ogni N settimane nei giorni G con ancora; mensile per
   posizione o per data. Mai "bisettimanale".
2. Festività nazionali (Pasqua calcolata) e patrono: solo segnalate, con "crea eccezione".
3. Eccezioni aggiungi / togli / sposta; eccezione > periodo > regola base.
4. Periodi per regola: annuali ricorrenti oppure con anno, a scelta per ogni regola.
5. Sovrapposizione annuale / con anno: vince quella con anno, e l'anomalia è sempre
   evidenziata.
6. Finestra di esposizione globale, sovrascrivibile per tipologia.
7. Profili di promemoria: quando, tipologie, destinatari; un solo messaggio per giorno.
8. Conferma "Esposto ✓" da notifica e da pulsante, valida per tutti; richiamo facoltativo
   (al massimo 2) e rinvio di 30 minuti. Richiami e rinvio ora dipendono dall'interruttore
   globale della decisione 39.
9. Nessun filtro di presenza: il sistema deve restare semplice.
10. Promemoria persi durante un riavvio: recuperati se la finestra è ancora aperta.
11. Sospensione per intervalli di date, più un interruttore.
12. Entità: calendario, oggi, domani, prossimo per tipologia, da esporre, pulsante,
    interruttore.
13. Un solo calendario per installazione.
14. Validità facoltativa con avviso 30 giorni prima; dopo la scadenza ritiri "da verificare".
15. Nessun import/export.
16. Tipologia = nome, colore, icona, note; preset con i colori abituali.
17. Ingombranti = tipologia senza regole più eccezioni "aggiungi".
18. Nessun turno.
19. Tutto in italiano, compresi codice e commit.
20. Config flow minimo più pannello laterale.
21. Tre card distinte (oggi/domani, settimana, mese), grafica curata.
22. Regole dello stesso tipo sovrapposte: si sommano, con anomalia.
23. Dominio `foyer_raccolta_differenziata`.
24. Home Assistant minimo 2026.6.0.

Punti aperti della bozza 1 (§17), chiusi dal proprietario il 2026-09-25.

25. L'ancora settimanale dà solo la fase, non l'inizio della regola.
26. Mensile per data su un giorno che il mese non ha: nessun ritiro, anomalia informativa.
27. Il 29/02 non è ammesso come estremo di un periodo annuale.
28. Il periodo "sempre" cede alla regola con anno come un periodo annuale.
29. Il 4 ottobre è festivo dal 2026 (Legge 151/2025); verificato sul testo pubblicato.
30. La sospensione si giudica sull'istante dell'invio, non sulla data del ritiro.
31. Destinatari: servizi `notify.*` ed entità `notify`; i pulsanti solo sull'app Companion.
32. Il pulsante senza finestra aperta conferma il prossimo giorno di ritiro, se è oggi o
    domani.
33. Nessun richiamo prima dell'apertura della finestra di esposizione.
34. Ritiri festivi non gestiti nei prossimi 30 giorni: un problema unico in Riparazioni;
    nessun avviso nelle card.
35. Nessun servizio Home Assistant dedicato.
36. Anteprima delle modifiche obbligatoria prima di ogni salvataggio nel pannello.
37. Licenza Apache-2.0, come Foyer Home Defender.

Aggiunte del proprietario, 2026-09-25.

38. Interruttore "Mostra nella barra laterale" (default acceso), nel pannello e nel
    "Configura" dell'integrazione; nascosto, il pannello si apre dalla pagina del
    dispositivo.
39. Solleciti con un interruttore globale, spento di default. Spenti: niente richiami e
    niente "tra 30 minuti", la conferma resta. Sostituisce i campi `richiami` per profilo
    della decisione 8.
40. README in italiano mantenuto per tutta la vita del progetto, attraente come quello di
    Home Defender, con il pulsante Buy Me a Coffee; una guida unica e semplice
    (`docs/GUIDA.md`); changelog, release GitHub e file di contorno mantenuti.

Fase 1, 2026-09-25.

41. Regole dello stesso tipo: l'avviso scatta solo quando due regole in vigore generano
    lo stesso giorno. "Lunedì" e "giovedì" come due regole separate non danno avvisi.
    Tra regole annuali e con anno l'avviso resta sui periodi (decisione 5), perché lì
    una regola viene davvero ignorata.

Marchio, 2026-09-25.

42. Il simbolo è il segno di Foyer dentro una pattumiera con coperchio e maniglia
    (variante A di quattro mockup), con la grammatica dello scudo di Home Defender
    (§18).

Fase 2, 2026-09-25 (scelte fatte in autonomia su mandato del proprietario, con
l'opzione consigliata).

43. I testi visibili che le traduzioni di Home Assistant non portano (titolo della voce,
    stato "Nessuno", descrizioni degli eventi del calendario, messaggi delle notifiche,
    nomi dei sensori per tipologia) stanno in un solo modulo, `testi.py`. È il "file dei
    testi" del backend di INV-5.
44. Il nome del sensore "prossimo ritiro" di una tipologia si imposta da `testi.py` e non
    dalle traduzioni, perché Home Assistant tiene in cache il nome tradotto e una
    tipologia rinominata resterebbe col nome vecchio fino al riavvio.

Fase 3, 2026-09-25 (in autonomia, su mandato del proprietario).

45. Il prototipo `docs/prototipo.html` è approvato come riferimento visivo di pannello e
    card: chip e pallini nei colori delle tipologie, "Stasera fuori" come elemento
    principale della card oggi/domani, regole scritte come frasi, anteprima delle date
    nei moduli, finestra "Prima di salvare" con le differenze. Nei componenti veri i
    colori di interfaccia vengono dal tema di Home Assistant (`--primary-color`,
    `--card-background-color`, …); il verde acqua del prototipo è solo un segnaposto.
    Le icone delle tipologie sono le icone MDI configurate, non gli emoji del prototipo.

Fase 4, 2026-09-25 (in autonomia).

46. Le card si caricano con `add_extra_js_url`, come in Foyer Home Defender, invece di
    registrarle come risorsa Lovelace: funziona anche con le dashboard in YAML e non
    scrive nella configurazione dell'utente.
47. La pagina Promemoria del pannello arriva con la Fase 5, insieme al motore dei
    promemoria che ne valida i dati: una pagina che salva dati che nessuno controlla
    ancora è il modo di trovarsi con configurazioni invalide al primo avvio della Fase 5.
48. Nel pannello, "Mostra nella barra laterale" cambia subito, senza passare da "Prima di
    salvare": non tocca il calendario. Tutto il resto ci passa (decisione 36).

Fase 5, 2026-09-26 (in autonomia).

49. Come funzionano esecutore e schedulatore dei promemoria: §8.7.
50. La finestra di esposizione globale sta in Impostazioni, non in Promemoria.
51. Eliminare una tipologia la toglie anche dai promemoria; un promemoria che riguardava
    solo quella tipologia viene eliminato, e il pannello lo dice prima di confermare.

Fase 6, 2026-09-26 (in autonomia).

52. Le tre card: tipi, opzioni e comportamento in §10.2.

---

## 17. Da confermare

Nessuna voce aperta. Le scelte fatte scrivendo la spec senza una decisione esplicita del
proprietario si elencano qui, con la fase che bloccano, finché non vengono confermate e
spostate in §16.

---

## 18. Identità visiva

Il simbolo è il segno di Foyer (due archi uno dentro l'altro e una porta ad arco
illuminata) dentro una **pattumiera stilizzata**: coperchio con maniglia e corpo
rastremato (decisione 42). È la stessa grammatica dello scudo di Foyer Home Defender,
così i due progetti si riconoscono come una famiglia: tratto 3.2 su una griglia di 64,
giunzioni e terminali tondi, l'arco lontano a metà opacità, la porta ambra come unico
elemento caldo e pieno.

| Token | Valore | Ruolo |
|---|---|---|
| Ink | `#0D1014` | Fondo su scuro, tratto su chiaro |
| Paper | `#E8ECF2` | Tratto su scuro, fondo su chiaro |
| Ambra | `#F0A835` | La porta; il sottotitolo su fondo scuro |
| Ambra su chiaro | `#B4780F` | Il sottotitolo su fondo chiaro, per il contrasto |

L'ambra della porta non cambia mai; sul fondo chiaro si scurisce solo il sottotitolo.

### 18.1 File

| File | Dove si usa |
|---|---|
| `docs/logo/raccolta-simbolo-fondo-scuro.svg`, `-fondo-chiaro.svg` | Intestazione del pannello e delle card, fondo trasparente |
| `docs/logo/raccolta-icona.svg` | Disegno a 24 px in un solo colore (`currentColor`, tratto 3.4, un solo arco): ridisegnato, mai rimpicciolito |
| `docs/logo/raccolta-app.svg` → `raccolta-app-512.png`, `-192.png` | README (da indirizzo GitHub assoluto, perché HACS mostra il README dentro Home Assistant), anteprima del repository |
| `docs/logo/raccolta-lockup-fondo-scuro.svg` / `-fondo-chiaro.svg` (+ PNG) | Documentazione |
| `custom_components/foyer_raccolta_differenziata/brand/` (`icon`, `logo`, ciascuno con `dark_` e `@2x`) | Pagine delle integrazioni di Home Assistant e HACS |

Gli SVG si generano con `scripts/disegna_marchio.py` (serve il font Poppins Medium per
convertire il sottotitolo in tracciati; il font non è nel repository). I PNG si ricavano
dagli SVG con `scripts/genera_immagini_marchio.py`, mai disegnati a mano. La scritta
FOYER è la stessa di Home Defender, a barre e tratti; "RACCOLTA DIFFERENZIATA" è in
Poppins Medium convertito in tracciati e si allarga esattamente quanto FOYER. Nessun file
dipende da un font installato.
