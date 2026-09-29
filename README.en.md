<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/logo/raccolta-app-192.png" alt="Foyer Raccolta Differenziata" width="112">
</p>

<h1 align="center">Foyer Raccolta Differenziata</h1>

<p align="center"><strong>Which bins go out tonight? Home Assistant knows.</strong></p>

<p align="center"><em>Your town's recycling calendar, taught once: a reminder the evening before, one tap on Esposto ✓ and the whole house knows it's done. No cloud, no account.</em></p>

<p align="center"><a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/README.md">Italiano</a> · <strong>English</strong> · <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/docs/GUIDE.md">📖 Guide</a> · <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/CHANGELOG.md">What's new</a> · <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/SUPPORT.md">Support</a></p>

<p align="center">
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/releases"><img src="https://img.shields.io/github/v/release/foyer-labs/Foyer-Raccolta-Differenziata?sort=semver&include_prereleases&label=version" alt="Latest version"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2026.6%2B-41BDF5" alt="Home Assistant 2026.6 or later">
  <img src="https://img.shields.io/badge/HACS-custom%20repository-41BDF5" alt="HACS custom repository">
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue" alt="Apache-2.0"></a>
  <a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/actions/workflows/ci.yml"><img src="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
</p>

<p align="center">
  <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=foyer-labs&repository=Foyer-Raccolta-Differenziata&category=integration"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open this repository inside HACS"></a>
</p>

> **🇮🇹 Italian only, on purpose.** The panel, the cards, the notifications and the user
> guide are in Italian. That is a choice, not an oversight: the collection rules, the
> holidays and the reminder habits are modelled on how Italian towns run their *raccolta
> differenziata* (separate waste collection). If your country does it differently and
> you would like Foyer to follow, [open an issue](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/issues):
> contributions for other countries are welcome.

<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/screenshots/card-chiaro.png" alt="The three cards, in Italian: food waste and plastic to put out tonight with the Esposto button, the week with an icon for each collection, the month with a coloured dot per collection; on top of each card the recycling centre, closed, opening Friday at 14:00" width="900">
  <br>
  <sub><em>Wednesday evening: food waste and plastic out by 06:00 tomorrow. The week, the month and the recycling centre, in three cards.</em></sub>
</p>

<p align="center"><b>Works with</b> Home Assistant 2026.6+ · HACS · the Companion app · Telegram, email and other notify services · Excel, LibreOffice and Google Sheets · light and dark</p>

Food waste on Mondays and Thursdays, paper every other Tuesday, glass on the second
Wednesday of the month, garden waste only in summer. And at Christmas it all changes. The
sheet on the fridge knows all that, but it never sends you a notification.

### Why families install it

- 🔔 **It reminds you, at the right time.** The evening before at 20:30, two days ahead for
  glass, the same morning: as many reminders as you like, to whoever you like. Three bins
  on the same day? One message.
- ✅ **One person takes it out, everyone knows.** One tap on **Esposto ✓** ("put out") —
  in the notification, on the card or on a button by the door — and the other reminders
  for that collection stop, for everyone at home.
- 📅 **Your town, exactly as it is.** Rules are written the way the town writes them,
  summer and winter included; moved dates are fixed with a tap, and collections that fall
  on a public holiday are flagged in advance.
- ♻️ **What goes where, and is the recycling centre open.** A **?** on the card tells you
  which bin; a pill tells you whether the recycling centre is open right now.
- 🏠 **All in your home.** No cloud, no account: you teach it the calendar once, and it
  takes it from there.

<p align="center"><strong><a href="https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/README.en.md#get-started">→ Up and running in three steps</a></strong></p>

---

## More than the sheet on the fridge

The town's leaflet is accurate, but you have to remember to look at it. Here the calendar
is the same, and Home Assistant does the remembering.

| | The sheet on the fridge | Foyer Raccolta Differenziata |
|---|---|---|
| What goes out tonight | Go and check | A notification, at the time you choose, to whoever you choose |
| Has someone already taken it out? | Ask around | *Esposto ✓* and the other reminders go quiet, for everyone |
| A collection falls on a holiday | You find out that morning | Flagged in the 30 days before, and you decide |
| Dates moved at Christmas | Pen on paper | Exceptions: add, remove or move a collection |
| You're on holiday | The sheet has no idea | Reminders stay quiet on the dates you set |
| Is the recycling centre open? | Another sheet, other hours | *Aperta fino alle 12:00* ("open until 12:00"), on the card |
| Which bin does it go in? | The leaflet, if you can find it | The **?** on the card, with notes you write |
| The calendar expires | You notice in January | A reminder a month before |
| A light by the front door | — | A *da esporre* ("to put out") sensor for your automations |

Notifications are made to be read at a glance (in Italian, like the rest of the UI):

> **🍎 Umido · 🧴 Plastica**\
> Da mettere fuori stasera, entro domani alle 06:00\
> Ritiro domani, giovedì 24

*Food waste · Plastic — put out tonight, by 06:00 tomorrow — collection tomorrow, Thursday 24th.*

Phones with the Companion app also get the **Esposto ✓** button, and on Android the
notification carries the icon and colour of the waste type and has a channel of its own,
so you can pick its sound and importance. *Invia una prova* ("send a test") shows you
what it looks like straight away, even before you save.

<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/screenshots/card-telefono.png" alt="The today and week cards on a phone, dark theme: food waste and plastic to put out tonight with the Esposto button, and the week's collections" width="300">
  <br>
  <sub><em>On the phone, in dark mode.</em></sub>
</p>

### And also

- **See what changes before you save**: the collections added and removed over the next
  60 days.
- **Excel too**: download the template, fill in the calendar in a spreadsheet and import
  it; or export, edit and import again.
- **Your household's waste types**: food waste, paper, plastic, glass, general waste,
  garden waste and nappies (optional) ready to go, each with colour, icon and emoji; add bulky
  items, remove what you don't need.
- **Three cards with a visual editor**: *today and tomorrow*, *the week*, *the month*. No
  resources to add, no YAML.
- **Real entities for automations**: a native calendar, *today*, *tomorrow* and *next
  collection* sensors, the *Esposto* button, a switch to pause reminders.

## Get started

You need **Home Assistant 2026.6 or later**, **[HACS](https://hacs.xyz/)** and, for
reminders, a working notify service (the Companion app is perfect). For now Foyer Raccolta
Differenziata is a HACS *custom repository*: it takes a minute.

**1. Add it to HACS and download it**

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=foyer-labs&repository=Foyer-Raccolta-Differenziata&category=integration"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open this repository inside HACS"></a>

Or by hand: HACS → ⋮ → *Custom repositories* →
`https://github.com/foyer-labs/Foyer-Raccolta-Differenziata`, category *Integration*.
Download **Foyer Raccolta Differenziata** and **restart Home Assistant**.

**2. Add the integration**

<a href="https://my.home-assistant.io/redirect/config_flow_start/?domain=foyer_raccolta_differenziata"><img src="https://my.home-assistant.io/badges/config_flow_start.svg" alt="Open your Home Assistant instance and start setting up Foyer Raccolta Differenziata"></a>

Or *Settings → Devices & services → Add integration → Foyer Raccolta Differenziata*.
Pick the waste types to start with and when bags go out (usually from 20:00 the day
before until 06:00 on collection day). The setup screen is in Italian even if your Home
Assistant is in English.

**3. Open Raccolta in the sidebar and teach it your town**

The sidebar entry is **Raccolta** ("collection"). Write the rules as they appear on your
town's calendar: as you type, the next dates appear underneath, so you can see straight
away whether they match.

<p align="center">
  <img src="https://raw.githubusercontent.com/foyer-labs/Foyer-Raccolta-Differenziata/main/docs/screenshots/pannello-regole.png" alt="The rule editor in the Raccolta panel, in Italian: paper every other week on Tuesday, with the reference date and the next four dates already worked out" width="820">
  <br>
  <sub><em>"Paper every other Tuesday", with the next dates already worked out.</em></sub>
</p>

Done: tonight, if something needs to go out, you'll know. The
**[guide](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/docs/GUIDE.md)**,
a ten-minute read, walks through rules, exceptions, reminders, cards and automations step
by step.

## Documentation

| | |
|---|---|
| [Guide](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/docs/GUIDE.md) | Install, waste types, rules, exceptions, holidays, reminders, *Esposto ✓*, cards, recycling centre, entities and automations, the calendar in Excel, FAQ ([Italian original](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/docs/GUIDA.md)) |
| [What's new](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/CHANGELOG.md) | What changes in each version, with anything you need to act on first (in Italian) |
| [Support](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/SUPPORT.md) | How to ask for help or report a problem |

## Good to know

- **It remembers what you taught it.** It does not know your town's calendar and does not
  download it from anywhere: that is why it needs no cloud and no account.
- **When your town publishes a new calendar, update it.** Tell it how long the current one
  is valid: a month before it expires, it reminds you.
- **Holidays are flagged, never moved.** You check what the town decided and create an
  exception, or dismiss the warning.
- **Only administrators see the Raccolta panel**: that is where the calendar is taught.
  Reminders and cards go to whoever you choose.

## Contributing and licence

Issues and pull requests are welcome and answered as time allows, with no promise of a
reply or a fix
([SUPPORT.md](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/SUPPORT.md),
[CONTRIBUTING.md](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/CONTRIBUTING.md)).
Foyer is the personal, non-commercial project of one person, published as Foyer Labs;
there is no company behind it.

If it saved you from at least one forgotten bin, a coffee keeps it going:

<p align="center">
  <a href="https://www.buymeacoffee.com/foyerlabs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me a Coffee" height="60"></a>
</p>

A donation is a thank-you and buys neither support nor priority.

Apache-2.0. See [LICENSE](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/LICENSE)
and [NOTICE](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/main/NOTICE).
