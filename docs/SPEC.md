# Foyer Raccolta Differenziata — Specifica

Stato: bozza 1 (2026-09-25). Tutto il progetto è in italiano: interfaccia, documentazione,
codice, commenti e commit (decisione 19).

Questo documento è la fonte di verità. Dove una scelta sembra arbitraria, il motivo è
scritto accanto: se il motivo non regge più, si cambia la spec prima del codice.

Le scelte che ho fatto scrivendo la spec, senza una decisione esplicita del proprietario,
sono marcate **[da confermare]** e raccolte in §17. Finché restano aperte, nessuna fase
che le tocca può partire.

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
(backend) o dal file dei testi del frontend.

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
l'ancora **non** è una data di inizio — l'inizio lo decide il periodo.
**[da confermare]** *Perché:* separare "fase" e "inizio" evita che chi inserisce come
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
- **[da confermare]** Nei mesi in cui `X` non esiste (31 aprile, 30 febbraio), quel ritiro
  **non avviene**, e il pannello lo segnala come anomalia informativa. Alternativa:
  spostarlo all'ultimo giorno del mese. Scelgo la prima per coerenza con INV-4.

#### 4.2.2 Periodo

Tre forme (decisione 4):

- **Sempre**: la regola vale ogni giorno.
- **Annuale**: dal `gg/mm` al `gg/mm`, ogni anno. Può scavalcare la fine dell'anno
  (01/11 → 31/03). Estremi inclusi.
  **[da confermare]** Un estremo 29/02 negli anni non bisestili vale come 28/02.
- **Con anno**: dal `gg/mm/aaaa` al `gg/mm/aaaa`, estremi inclusi, fine ≥ inizio.

Fuori da ogni periodo di ogni regola, la tipologia non ha ritiri da regola.

#### 4.2.3 Più regole sullo stesso giorno

Per una tipologia `T` e un giorno `d`, siano `R(d)` le regole di `T` il cui periodo copre `d`.

1. Se in `R(d)` c'è almeno una regola **con anno**, le regole **annuali** e **sempre** di
   `R(d)` vengono ignorate per quel giorno (decisione 5). *Perché:* la regola con anno è
   quasi sempre il calendario nuovo del comune che sostituisce l'abitudine.
   **[da confermare]** "Sempre" è trattata come "annuale" ai fini di questa precedenza.
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
dopo il calcolo delle regole, in quest'ordine: togli, sposta, aggiungi.

Casi limite, tutti con un'anomalia informativa e mai con un errore (le regole possono
cambiare dopo che l'eccezione è stata scritta):

- **Togli** o **sposta** su un giorno in cui la regola non genera nulla: nessun effetto sul
  giorno di partenza; lo sposta aggiunge comunque la data di arrivo. Anomalia
  "eccezione senza ritiro da togliere".
- **Aggiungi** o arrivo di uno **sposta** su un giorno che ha già quel ritiro: un solo
  ritiro. Anomalia "eccezione ridondante".
- Due eccezioni sulla stessa (tipologia, data) di partenza: il pannello non lo permette.

Vincoli: le date di un'eccezione sono comprese tra il 01/01/2000 e il 31/12/2099.

### 4.4 Festività

Il sistema conosce le festività nazionali e un patrono configurabile, e le usa **solo** per
segnalare (decisione 2, INV-4).

Festività nazionali: 1 gennaio, 6 gennaio, Pasqua, Lunedì dell'Angelo, 25 aprile, 1 maggio,
2 giugno, 15 agosto, 4 ottobre (San Francesco, festa nazionale dal 2026), 1 novembre,
8 dicembre, 25 dicembre, 26 dicembre. La Pasqua è calcolata (algoritmo gregoriano).

**[da confermare]** Il 4 ottobre: la legge che lo ha ripristinato va verificata sul testo
ufficiale prima dell'implementazione.

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
| `destinatari` | elenco non vuoto di servizi `notify.*` | Vedi §8.3. |
| `richiami` | 0–2 | Solleciti se nessuno conferma. |
| `richiamo_dopo` | 5–240 minuti | Intervallo tra un invio e il richiamo successivo. |

### 4.8 Sospensione

- Un elenco di intervalli `dal`–`al` (date, estremi inclusi), gestiti nel pannello.
- Un interruttore "Sospendi promemoria" che sospende da subito, a tempo indeterminato.

I promemoria tacciono se **la data del ritiro** cade in un intervallo, oppure se
l'interruttore è acceso nel momento dell'invio. **[da confermare]** *Perché la data del
ritiro e non quella dell'invio:* il promemoria "2 giorni prima" per un ritiro del primo
giorno di vacanza deve tacere anche se parte prima della partenza. Il caso inverso (ritiro
il giorno del rientro, promemoria la sera prima quando si è ancora via) resta
volutamente attivo.

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
calcola(config, dal, al) -> Risultato
    Risultato.ritiri:   elenco ordinato di Ritiro
    Risultato.anomalie: elenco di Anomalia
```

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
| `sovrapposizione_stesso_tipo` | avviso | Regole dello stesso tipo si sovrappongono. |
| `eccezione_senza_ritiro` | info | Togli/sposta su un giorno senza ritiro. |
| `eccezione_ridondante` | info | Aggiungi su un ritiro già presente. |
| `giorno_inesistente` | info | Mensile per data su un giorno che quel mese non ha. |
| `tipologia_senza_ritiri` | info | Nessun ritiro nei prossimi 366 giorni. |
| `calendario_in_scadenza` | avviso | Mancano ≤ 30 giorni alla validità. |
| `calendario_scaduto` | avviso | La validità è passata. |

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

I destinatari sono servizi `notify.*` scelti da un elenco. **[da confermare]** Solo servizi
legacy `notify.*` (quelli dell'app Companion lo sono), non le entità `notify`: sono gli unici
che supportano le azioni nelle notifiche.

Ai servizi dell'app Companion (`notify.mobile_app_*`) il messaggio arriva con due azioni:
**Esposto ✓** e **Ricordamelo tra 30 minuti**. Agli altri arriva solo il testo. Le azioni
tornano come evento `mobile_app_notification_action`; l'identificativo dell'azione porta
un gettone opaco che il sistema riconduce all'invio.

### 8.4 Conferma

Una conferma riguarda uno o più ritiri (data, tipologia) e ferma **tutti** i promemoria
futuri di quei ritiri, di tutti i profili, per tutti i destinatari (decisione 8).

Si conferma da:

- l'azione **Esposto ✓** di una notifica: conferma i ritiri di quell'invio;
- l'entità `button` **Esposto**: conferma i ritiri la cui finestra è aperta; se nessuna è
  aperta, quelli del prossimo giorno di ritiro, purché sia oggi o domani; altrimenti non
  fa nulla e lo scrive nel registro di Home Assistant. **[da confermare]** *Perché:* chi
  esce di casa alle 19 mette fuori il sacco prima che la finestra si apra;
- le card (stesso comportamento del pulsante, per il giorno mostrato).

La conferma registra istante e, se noto, l'utente di Home Assistant che l'ha data. Si
può annullare dalle card finché la finestra è aperta. Le conferme si cancellano 7 giorni
dopo la data del ritiro.

### 8.5 Richiami e rinvio

- **Richiamo:** se dopo `richiamo_dopo` minuti almeno un ritiro dell'invio non è confermato
  e la finestra è ancora aperta, l'invio si ripete con i soli ritiri non confermati, al
  massimo `richiami` volte.
  **[da confermare]** Se la finestra non è ancora aperta (promemoria "2 giorni prima"),
  non si richiama: il richiamo esiste per il momento dell'esposizione, non per l'avviso
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

`evento` è uno tra: scatto del timer, riavvio, conferma, rinvio, modifica della
configurazione, cambio dell'interruttore di sospensione. L'esecutore chiama i servizi
`notify`, lo schedulatore fissa un solo timer sul `prossimo` istante.

---

## 9. Integrazione Home Assistant

### 9.1 Dominio e installazione

- Dominio: `foyer_raccolta_differenziata` (decisione 23).
- Versione minima: Home Assistant 2026.6.0; test in CI sulla minima e sull'ultima stabile
  (decisione 24).
- Distribuzione: un solo repository HACS. L'integrazione serve i file del frontend
  (pannello e card) e registra le card come risorsa Lovelace in automatico quando le
  dashboard sono in modalità interfaccia; in modalità YAML la README spiega la riga da
  aggiungere.
- Configurazione iniziale (config flow, istanza unica): scelta dei preset, finestra di
  esposizione globale. Tutto il resto dal pannello.

### 9.2 Entità

Tutte appartengono a un dispositivo "Raccolta differenziata". Gli `entity_id` indicati sono
quelli generati alla creazione; l'utente può rinominarli.

| Entità | Stato | Attributi principali |
|---|---|---|
| `calendar.foyer_raccolta_differenziata` | acceso durante un evento | — |
| `sensor.…_oggi` | nomi delle tipologie di oggi, separati da virgola, oppure "Nessuno" | `tipologie` (id), `ritiri` (dettaglio), `confermati` |
| `sensor.…_domani` | come sopra, per domani | come sopra |
| `sensor.…_prossimo_<tipologia>` | data (`device_class: date`) | `giorni_mancanti`, `origine`, `festivo`, `da_verificare` |
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
- **Ritiri in giorni festivi nei prossimi 30 giorni, non gestiti** **[da confermare]**: un
  problema unico che rimanda al pannello. *Perché:* chi non apre mai il pannello non
  vedrebbe l'avviso prima del giorno sbagliato.
- **Configurazione illeggibile** (INV-2).

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

Nessun servizio Home Assistant oltre a quelli impliciti delle entità. **[da confermare]**
*Perché:* INV-6; un servizio "aggiungi eccezione" per le automazioni si valuta se serve.

---

## 10. Frontend

Lit + TypeScript + Vite, come Foyer Home Defender. Il frontend usa le variabili del tema di
Home Assistant: funziona in chiaro e in scuro senza configurazione.

### 10.1 Pannello di configurazione

Nella barra laterale, visibile solo agli amministratori (decisione 20). Pagine:

1. **Panoramica** — prossimi 30 giorni, anomalie con le loro azioni, stato di validità.
2. **Tipologie** — elenco, creazione, modifica (nome, colore, icona, note, finestra
   personalizzata), eliminazione con riepilogo di cosa sparisce.
3. **Regole** — per tipologia; modulo con ricorrenza e periodo; anteprima immediata delle
   prossime date.
4. **Eccezioni** — elenco per data, filtrabile per tipologia; modulo aggiungi/togli/sposta.
5. **Promemoria** — profili, finestra globale, sospensioni.
6. **Impostazioni** — patrono, validità.

Ogni salvataggio passa dall'anteprima: l'utente vede cosa cambia nei prossimi 60 giorni
prima di confermare. **[da confermare]** *Perché:* una regola sbagliata non dà errori,
dà un calendario plausibile e sbagliato.

### 10.2 Card

Tre card distinte (decisione 21), con una grafica curata: è la parte che si vede ogni
giorno.

- **Oggi e domani** (`foyer-raccolta-oggi-card`): due blocchi grandi, chip colorate con
  icona, stato di esposizione ("Da esporre entro le 06:00" / "Esposto ✓ alle 21:04 da
  Anna"), pulsante di conferma, banner di sospensione e di validità.
- **Settimana** (`foyer-raccolta-settimana-card`): sette giorni a partire da oggi (oppure
  da lunedì, configurabile), oggi evidenziato, chip colorate, note al tocco, indicazioni
  "spostato" e "festivo".
- **Mese** (`foyer-raccolta-mese-card`): griglia mensile con pallini colorati per
  tipologia, navigazione tra i mesi, dettaglio del giorno al tocco.

Requisiti comuni: editor visuale nella dashboard, stati vuoti curati ("Nessun ritiro questa
settimana"), contrasto testo/colore calcolato, animazioni sobrie, funzionanti a 320 px di
larghezza.

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
| **4 — Pannello** | Comandi WebSocket di amministrazione, pannello completo con anteprima. |
| **5 — Promemoria** | `decidi`, esecutore, schedulatore, conferme, richiami, rinvii, sospensione, recupero al riavvio, pulsante e interruttore. |
| **6 — Card** | Tre card, comandi WebSocket di lettura, registrazione automatica della risorsa. |
| **7 — Rilascio** | README (con i limiti), CHANGELOG, icone, prima versione pubblicata. |

---

## 15. Documentazione per l'utente

La README dice chiaramente che il sistema ricorda ciò che l'utente ha inserito, non
conosce il calendario del comune, e che dopo ogni cambio di calendario comunale va
aggiornato. Spiega l'ancora con un esempio, perché è l'unico concetto non ovvio.

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
   (al massimo 2) e rinvio di 30 minuti.
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

---

## 17. Da confermare

Scelte fatte scrivendo la spec. Ognuna blocca la fase indicata finché il proprietario non
la conferma o la cambia.

| # | Scelta | Fase |
|---|---|---|
| A | L'ancora settimanale dà solo la fase, non l'inizio (§4.2.1). | 1 |
| B | Mensile per data su un giorno inesistente: il ritiro non avviene (§4.2.1). | 1 |
| C | Estremo annuale 29/02 negli anni non bisestili = 28/02 (§4.2.2). | 1 |
| D | "Sempre" trattata come annuale nella precedenza (§4.2.3). | 1 |
| E | Il 4 ottobre tra le festività nazionali, da verificare sul testo di legge (§4.4). | 1 |
| F | Sospensione giudicata sulla data del ritiro (§4.8). | 5 |
| G | Destinatari solo servizi `notify.*` legacy (§8.3). | 5 |
| H | Il pulsante senza finestra aperta conferma il prossimo giorno di ritiro se è oggi o domani (§8.4). | 5 |
| I | Nessun richiamo prima dell'apertura della finestra (§8.5). | 5 |
| J | Problema in Riparazioni per ritiri festivi non gestiti nei prossimi 30 giorni (§9.3). | 2 |
| K | Nessun servizio Home Assistant dedicato (§9.4). | 2 |
| L | Anteprima obbligatoria prima di ogni salvataggio nel pannello (§10.1). | 4 |
| M | Licenza: Apache-2.0 come Foyer Home Defender. | 0 |
