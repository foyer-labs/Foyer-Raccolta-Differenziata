<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/logo/raccolta-app-192.png" alt="Foyer Raccolta Differenziata" width="120">
</p>

<h1 align="center">Foyer Raccolta Differenziata</h1>

<p align="center"><em>Il calendario della raccolta differenziata dentro Home Assistant: sai sempre cosa esporre stasera, e se te lo dimentichi te lo ricorda lui.</em></p>

<p align="center">
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/releases"><img src="https://img.shields.io/github/v/release/foyer-labs/Foyer-Raccolta-Differenziata?sort=semver&include_prereleases&label=versione" alt="Ultima versione"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2026.6%2B-41BDF5" alt="Home Assistant 2026.6 o successivo">
  <img src="https://img.shields.io/badge/HACS-repository%20personalizzato-41BDF5" alt="Repository personalizzato HACS">
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/LICENSE"><img src="https://img.shields.io/badge/licenza-Apache--2.0-blue" alt="Apache-2.0"></a>
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/actions/workflows/ci.yml"><img src="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
</p>

Umido il lunedì e il giovedì, la carta un martedì sì e uno no, il vetro il secondo
mercoledì del mese, il verde solo d'estate — e a Natale cambia tutto. Ogni comune fa
storia a sé, e il foglio appeso al frigo non ti manda una notifica.

Foyer Raccolta Differenziata impara il calendario del tuo comune una volta sola, poi ti
dice ogni sera cosa mettere fuori.

<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/screenshots/card-chiaro.png" alt="Le tre card: stasera fuori umido e plastica con il pulsante Esposto, la settimana con le icone dei rifiuti, il calendario del mese con un pallino colorato per ogni ritiro" width="900">
</p>

## Cosa ottieni

- **Il tuo calendario, qualunque sia.** Ogni settimana, una settimana sì e una no,
  due volte a settimana, il secondo e il quarto giovedì del mese, il giorno 15: le
  regole si scrivono come le scrive il comune, e le prossime date compaiono mentre compili.
- **Le tipologie che servono a casa tua.** Umido, carta, plastica, vetro, secco e verde
  sono già pronti, con i colori di sempre; aggiungi i pannolini, gli ingombranti o
  quello che raccoglie il tuo comune, e togli quello che non ti serve.
- **Estate e inverno.** Il verde ogni settimana da aprile a ottobre e ogni due settimane
  il resto dell'anno: una regola per stagione, e ciascuna vale solo nel suo periodo.
- **Le eccezioni che arrivano col calendario nuovo.** Il ritiro del 25 dicembre spostato
  al 27, un passaggio in più, uno annullato: si aggiungono con un tocco.
- **Le festività le vede lui.** Se un ritiro cade in un giorno festivo te lo segnala
  prima, così controlli cosa ha deciso il comune. Non sposta niente da solo.
- **Prima di salvare, vedi cosa cambia.** Ogni modifica mostra i ritiri che si aggiungono
  e quelli che spariscono nei prossimi 60 giorni.
- **Un promemoria quando serve a te.** La sera prima alle 20:30, due giorni prima per il
  vetro, la mattina stessa: quanti promemoria vuoi, a chi vuoi, in un solo messaggio
  anche quando passano tre rifiuti insieme.
- **Esposto ✓.** Un tocco sulla notifica, sulla card o su un pulsante vicino alla porta, e
  gli altri promemoria di quel ritiro non partono più, per nessuno in casa. Se vuoi, e solo
  se vuoi, ti sollecita finché non confermi.
- **In vacanza sta zitto.** Sospendi i promemoria per le date in cui sei via.
- **Tre card da mettere in dashboard.** *Oggi e domani*, *la settimana*, *il mese*, con i
  colori di ogni rifiuto, in tema chiaro e scuro.
- **Entità vere per le tue automazioni.** Un calendario nativo, i sensori *oggi*,
  *domani* e *prossimo ritiro*, un sensore *da esporre* che può accendere una luce
  all'ingresso.
- **Ti avvisa quando il calendario invecchia.** Un mese prima della scadenza che hai
  indicato, ti ricorda di controllare il calendario nuovo del comune.

<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/screenshots/pannello-regole.png" alt="Il pannello: l'editor di una regola, ogni due settimane il martedì, con le prossime quattro date calcolate" width="820">
</p>

## Per iniziare

Ti servono Home Assistant 2026.6 o successivo e, per i promemoria, un servizio di
notifica funzionante (l'app Companion va benissimo). Nessun account cloud.

1. In HACS aggiungi questo repository come *Repository personalizzato*, categoria
   *Integrazione*, installa *Foyer Raccolta Differenziata* e riavvia Home Assistant.
2. *Impostazioni → Dispositivi e servizi → Aggiungi integrazione → Foyer Raccolta
   Differenziata*: scegli le tipologie di partenza e quando si espongono i sacchi.
3. Apri **Raccolta** nella barra laterale e inserisci i giorni del tuo comune.

La [guida](docs/GUIDA.md) spiega tutto il resto: regole, eccezioni, promemoria, card e
automazioni, in dieci minuti.

## Da sapere

Foyer Raccolta Differenziata ricorda quello che gli hai insegnato: non conosce il
calendario del tuo comune e non lo scarica da nessuna parte. Quando il comune pubblica
il calendario nuovo, va aggiornato — e per questo te lo ricorda.

## Stato

Questa è la prima versione. Ogni versione è una release GitHub, proposta da HACS per
numero di versione, e il [changelog](CHANGELOG.md) dice cosa cambia in ognuna: quello che
ti chiede di fare qualcosa viene per primo. La configurazione salvata porta la versione
del suo schema e viene migrata in avanti a ogni aggiornamento.

## Contribuire e licenza

Issue e pull request sono benvenute e ricevono risposta al meglio delle possibilità,
senza garanzia di una risposta né di una correzione ([SUPPORT.md](SUPPORT.md),
[CONTRIBUTING.md](CONTRIBUTING.md)). Foyer è il progetto personale e non commerciale di
una persona, pubblicato come Foyer Labs; non c'è una società dietro.

<p align="center">
  <a href="https://www.buymeacoffee.com/foyerlabs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me a Coffee" height="60"></a>
</p>

Una donazione è un ringraziamento e non compra né supporto né priorità.

Apache-2.0. Vedi [LICENSE](LICENSE) e [NOTICE](NOTICE).
