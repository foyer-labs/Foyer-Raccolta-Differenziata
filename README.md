<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/logo/raccolta-app-192.png" alt="Foyer Raccolta Differenziata" width="112">
</p>

<h1 align="center">Foyer Raccolta Differenziata</h1>

<p align="center"><strong>Stasera cosa va fuori? Te lo dice Home Assistant.</strong></p>

<p align="center"><em>Il calendario della raccolta del tuo comune, insegnato una volta sola: un promemoria la sera prima, un tocco su Esposto ✓ e tutta la casa lo sa. Senza cloud, senza account.</em></p>

<p align="center"><strong>Italiano</strong> · <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/README.en.md">English</a> · <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/docs/GUIDA.md">📖 Guida</a> · <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/CHANGELOG.md">Novità</a> · <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/SUPPORT.md">Aiuto</a></p>

<p align="center">
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/releases"><img src="https://img.shields.io/github/v/release/foyer-labs/Foyer-Raccolta-Differenziata?sort=semver&include_prereleases&label=versione" alt="Ultima versione"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2026.6%2B-41BDF5" alt="Home Assistant 2026.6 o successivo">
  <img src="https://img.shields.io/badge/HACS-repository%20personalizzato-41BDF5" alt="Repository personalizzato HACS">
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/LICENSE"><img src="https://img.shields.io/badge/licenza-Apache--2.0-blue" alt="Apache-2.0"></a>
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/actions/workflows/ci.yml"><img src="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
</p>

<p align="center">
  <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=foyer-labs&repository=Foyer-Raccolta-Differenziata&category=integration"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Apri Home Assistant e questo repository dentro HACS"></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/screenshots/card-chiaro.png" alt="Le tre card: stasera fuori umido e plastica con il pulsante Esposto, la settimana con le icone dei rifiuti, il calendario del mese con un pallino colorato per ogni ritiro; in cima a ogni card la piattaforma ecologica, chiusa, apre venerdì alle 14:00" width="900">
  <br>
  <sub><em>Mercoledì sera: umido e plastica da mettere fuori entro le 06:00. La settimana, il mese e la piattaforma ecologica, in tre card.</em></sub>
</p>

<p align="center"><b>Funziona con</b> Home Assistant 2026.6+ · HACS · l'app Companion · Telegram, email e gli altri servizi di notifica · Excel, LibreOffice e Google Fogli · tema chiaro e scuro</p>

Umido il lunedì e il giovedì, la carta un martedì sì e uno no, il vetro il secondo
mercoledì del mese, il verde solo d'estate. E a Natale cambia tutto. Il foglio sul frigo
lo sa, ma non ti manda una notifica.

### Perché metterlo in casa

- 🔔 **Te lo ricorda lui, all'ora giusta.** La sera prima alle 20:30, due giorni prima per
  il vetro, la mattina stessa: quanti promemoria vuoi, a chi vuoi. Tre rifiuti lo stesso
  giorno? Un messaggio solo.
- ✅ **Uno lo porta fuori, tutti lo sanno.** Un tocco su **Esposto ✓**, nella notifica,
  nella card o su un pulsante vicino alla porta, e gli altri promemoria di quel ritiro
  non partono più, per nessuno in casa.
- 📅 **Il tuo comune, così com'è.** Le regole si scrivono come le scrive il comune, estate
  e inverno compresi; le date spostate si sistemano con un tocco, e i ritiri che cadono
  in un giorno festivo te li segnala prima.
- ♻️ **Cosa va dove, e se la piattaforma è aperta.** Un **?** nella card e sai in che
  bidone va; una pillola ti dice se la piattaforma ecologica è aperta adesso.
- 🏠 **Tutto in casa tua.** Nessun cloud, nessun account: gli insegni il calendario una
  volta, e da lì fa da solo.

<p align="center"><strong><a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/README.md#per-iniziare">→ Pronto in tre passi</a></strong></p>

---

## Più del foglio sul frigo

Il foglio del comune è preciso, ma devi ricordarti di guardarlo. Qui il calendario è lo
stesso, e a ricordarsi ci pensa Home Assistant.

| | Il foglio sul frigo | Foyer Raccolta Differenziata |
|---|---|---|
| Cosa va fuori stasera | Vai a guardare | Una notifica, all'ora che scegli, a chi scegli |
| L'ha già messo fuori qualcuno? | Chiedi in giro | *Esposto ✓* e gli altri promemoria tacciono, per tutti |
| Il ritiro cade in un festivo | Te ne accorgi la mattina | Te lo segnala nei 30 giorni prima, e decidi tu |
| Le date spostate a Natale | A penna, sul foglio | Eccezioni: aggiungi, togli, sposta un ritiro |
| Sei in vacanza | Il foglio non lo sa | I promemoria tacciono nelle date che indichi |
| La piattaforma ecologica è aperta? | Un altro foglio, un altro orario | *Aperta fino alle 12:00*, nella card |
| In che bidone va? | Il volantino, se lo trovi | Il **?** nella card, con le note che scrivi tu |
| Il calendario scade | Te ne accorgi a gennaio | Te lo ricorda un mese prima |
| La luce all'ingresso | — | Un sensore *da esporre* per le tue automazioni |

Le notifiche sono fatte per leggersi in un'occhiata:

> **🍎 Umido · 🧴 Plastica**\
> Da mettere fuori stasera, entro domani alle 06:00\
> Ritiro domani, giovedì 24

Sui telefoni con l'app Companion c'è anche il pulsante **Esposto ✓**, e su Android la
notifica ha l'icona e il colore del rifiuto e un canale tutto suo, per sceglierne suono e
importanza. *Invia una prova* ti fa vedere subito com'è fatta, prima ancora di salvare.

<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/screenshots/card-telefono.png" alt="Le card oggi e settimana su un telefono, in tema scuro: stasera fuori umido e plastica con il pulsante Esposto, e i ritiri della settimana" width="300">
  <br>
  <sub><em>Sul telefono, in tema scuro.</em></sub>
</p>

### E poi

- **Prima di salvare, vedi cosa cambia**: i ritiri che si aggiungono e quelli che
  spariscono nei prossimi 60 giorni.
- **Anche in Excel**: scarica il modello, compila il calendario in un foglio di calcolo e
  importalo; oppure esporta, modifica e reimporta.
- **Le tipologie di casa tua**: umido, carta, plastica, vetro, secco, verde e, se
  servono, pannolini già pronti, con colore, icona ed emoji; aggiungi gli ingombranti, togli quello che non
  serve.
- **Tre card con l'editor visuale**: *oggi e domani*, *la settimana*, *il mese*. Niente
  risorse da aggiungere, niente YAML.
- **Entità vere per le automazioni**: un calendario nativo, i sensori *oggi*, *domani* e
  *prossimo ritiro*, il pulsante *Esposto*, l'interruttore per sospendere i promemoria.

## Per iniziare

Ti servono **Home Assistant 2026.6 o successivo**, **[HACS](https://hacs.xyz/)** e, per i
promemoria, un servizio di notifica funzionante (l'app Companion va benissimo). Per ora
Foyer Raccolta Differenziata è un *repository personalizzato* di HACS: ci vuole un minuto.

**1. Aggiungilo a HACS e scaricalo**

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=foyer-labs&repository=Foyer-Raccolta-Differenziata&category=integration"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Apri Home Assistant e questo repository dentro HACS"></a>

Oppure a mano: HACS → ⋮ → *Repository personalizzati* →
`https://github.com/foyer-labs/Foyer-Raccolta-Differenziata`, categoria *Integrazione*.
Scarica **Foyer Raccolta Differenziata** e **riavvia Home Assistant**.

**2. Aggiungi l'integrazione**

<a href="https://my.home-assistant.io/redirect/config_flow_start/?domain=foyer_raccolta_differenziata"><img src="https://my.home-assistant.io/badges/config_flow_start.svg" alt="Apri Home Assistant e inizia a configurare Foyer Raccolta Differenziata"></a>

Oppure *Impostazioni → Dispositivi e servizi → Aggiungi integrazione → Foyer Raccolta
Differenziata*. Scegli le tipologie di partenza e quando si mettono fuori i sacchi (di
solito dalle 20:00 del giorno prima alle 06:00 del ritiro).

**3. Apri Raccolta nella barra laterale e insegnagli il tuo comune**

Scrivi le regole come sul calendario del comune: mentre compili, sotto compaiono le
prossime date, così vedi subito se tornano.

<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/screenshots/pannello-regole.png" alt="L'editor di una regola nel pannello Raccolta: la carta una settimana sì e una no, il martedì, con il giorno di riferimento e le prossime quattro date calcolate" width="820">
  <br>
  <sub><em>"La carta a martedì alterni", con le prossime date già calcolate.</em></sub>
</p>

Fatto: stasera, se c'è qualcosa da mettere fuori, lo sai. La
**[guida](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/docs/GUIDA.md)**,
che si legge in dieci minuti, spiega passo passo regole, eccezioni, promemoria, card e
automazioni.

## Documentazione

| | |
|---|---|
| [Guida](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/docs/GUIDA.md) | Installazione, tipologie, regole, eccezioni, festività, promemoria, *Esposto ✓*, card, piattaforma ecologica, entità e automazioni, il calendario in Excel, domande frequenti |
| [Novità](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/CHANGELOG.md) | Cosa cambia in ogni versione; quello che ti chiede di fare qualcosa viene per primo |
| [Aiuto](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/SUPPORT.md) | Come chiedere aiuto e segnalare un problema |

## Da sapere

- **Ricorda quello che gli hai insegnato.** Non conosce il calendario del tuo comune e non
  lo scarica da nessuna parte: è per questo che non serve né un cloud né un account.
- **Quando il comune pubblica il calendario nuovo, va aggiornato.** Indica fino a quando
  vale quello attuale: un mese prima della scadenza te lo ricorda.
- **Le festività le segnala, non le sposta.** Controlli cosa ha deciso il comune e crei
  l'eccezione, oppure ignori l'avviso.
- **Il pannello Raccolta compare solo agli amministratori**: è lì che si insegna il
  calendario. Promemoria e card li scegli tu, per chi vuoi.

## Contribuire e licenza

Issue e pull request sono benvenute e ricevono risposta al meglio delle possibilità,
senza garanzia di una risposta né di una correzione
([SUPPORT.md](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/SUPPORT.md),
[CONTRIBUTING.md](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/CONTRIBUTING.md)).
Foyer è il progetto personale e non commerciale di una persona, pubblicato come Foyer
Labs; non c'è una società dietro.

Se ti ha evitato almeno un bidone dimenticato, un caffè lo fa andare avanti:

<p align="center">
  <a href="https://www.buymeacoffee.com/foyerlabs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me a Coffee" height="60"></a>
</p>

Una donazione è un ringraziamento e non compra né supporto né priorità.

Apache-2.0. Vedi [LICENSE](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/LICENSE)
e [NOTICE](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/NOTICE).
