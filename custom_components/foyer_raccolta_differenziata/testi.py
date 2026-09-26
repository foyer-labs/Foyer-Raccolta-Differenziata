"""I testi visibili che le traduzioni di Home Assistant non possono portare (INV-5).

Home Assistant traduce nomi di entità, moduli, problemi ed eccezioni: quelli stanno
in strings.json. Il titolo della voce di configurazione, lo stato testuale dei
sensori, le descrizioni degli eventi del calendario e i messaggi delle notifiche no:
stanno qui, in un solo posto, e nessun altro modulo scrive testo visibile
(decisione 43).
"""

from __future__ import annotations

from datetime import date, datetime

TITOLO_VOCE = "Raccolta differenziata"
TITOLO_PANNELLO = "Raccolta"
NESSUNO = "Nessuno"
PRODUTTORE = "Foyer Labs"


def spostato_dal(giorno: date) -> str:
    return f"Spostato dal {giorno.strftime('%d/%m')}"


AGGIUNTO = "Ritiro aggiunto"


def prossimo_ritiro(tipologia: str) -> str:
    return f"Prossimo ritiro {tipologia}"


DA_VERIFICARE = "Da verificare: oltre la validità del calendario"


def festivo(nome: str) -> str:
    return f"Giorno festivo: {nome}"


# --- notifiche (SPEC §8.2) ------------------------------------------------------------

AZIONE_ESPOSTO = "Esposto ✓"
AZIONE_RINVIA = "Ricordamelo tra 30 minuti"
_GIORNI = ("Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica")


def elenco(nomi: list[str]) -> str:
    """ "Umido", "Umido e Carta", "Umido, Carta e Vetro"."""
    if len(nomi) <= 1:
        return "".join(nomi)
    return f"{', '.join(nomi[:-1])} e {nomi[-1]}"


def messaggio(tipo: str, nomi: list[str], giorno: date) -> str:
    cosa = elenco(nomi)
    if tipo == "stasera":
        return f"Stasera fuori: {cosa}"
    if tipo == "oggi":
        return f"Oggi: {cosa}"
    if tipo == "domani":
        return f"Domani: {cosa}"
    if tipo == "sollecito":
        return f"Ancora da esporre: {cosa}"
    return f"{_GIORNI[giorno.weekday()]} {giorno.day}: {cosa}"


# --- il file Excel (decisione 59) ---------------------------------------------------

EXCEL_ESEMPIO = "La riga grigia qui sotto è un esempio: non viene importata."

EXCEL_FOGLI: dict[str, tuple[str, str]] = {
    "Tipologie": (
        "Tipologie di rifiuto",
        "Una riga per tipologia. Colore e icona si possono lasciare vuoti per le "
        "tipologie di base. L'esposizione si scrive solo se è diversa da quella "
        "generale del foglio Impostazioni.",
    ),
    "Regole": (
        "Regole del calendario",
        "Una riga per regola: quando passa il ritiro di una tipologia. Una tipologia "
        "può avere più regole (per esempio una per l'estate e una per l'inverno).",
    ),
    "Eccezioni": (
        "Eccezioni",
        "I cambi puntuali del calendario: un ritiro in più, uno in meno, uno "
        "spostato. Una sola eccezione per tipologia e giorno.",
    ),
    "Promemoria": (
        "Promemoria",
        "Quando avvisare e chi. Destinatari separati da virgola: i servizi senza "
        "«notify.» davanti, le entità di notifica con.",
    ),
    "Vacanze": (
        "Vacanze",
        "I periodi in cui i promemoria tacciono. Il calendario e le card non cambiano.",
    ),
    "Impostazioni": (
        "Impostazioni",
        "Le impostazioni generali: scrivi solo nella colonna Valore.",
    ),
}

EXCEL_AIUTO_COLONNE: dict[tuple[str, str], str] = {
    ("Tipologie", "nome"): "Il nome della tipologia, come compare nelle card.",
    ("Tipologie", "colore"): "Codice esadecimale, per esempio #795548.",
    ("Tipologie", "icona"): "Un'icona Material Design, per esempio mdi:food-apple.",
    ("Tipologie", "note"): "Cosa ci va: si legge nelle card al tocco. Facoltativo.",
    ("Tipologie", "esposizione_dalle"): "Da che ora si espone, se diversa dal "
    "generale.",
    ("Tipologie", "esposizione_del"): "Il giorno prima o il giorno stesso del ritiro.",
    ("Tipologie", "esposizione_entro"): "Entro che ora, il giorno del ritiro.",
    ("Regole", "tipologia"): "Una delle tipologie del foglio Tipologie.",
    ("Regole", "nome"): "Per riconoscerla, per esempio «Estate». Facoltativo.",
    ("Regole", "ricorrenza"): "Settimanale, mensile per giorno della settimana "
    "(il 2° giovedì) o mensile per data (il 15).",
    ("Regole", "ogni"): "Settimanale: 1 = ogni settimana, 2 = una sì e una no. "
    "Vuoto vale 1.",
    ("Regole", "giorni_settimana"): "Settimanale: uno o più giorni (Lun, Gio). "
    "Mensile per giorno della settimana: un solo giorno.",
    ("Regole", "posizioni"): "Mensile per giorno della settimana: 1°, 2°, 3°, 4°, "
    "ultimo (per esempio 2°, 4°).",
    ("Regole", "giorni_mese"): "Mensile per data: i giorni del mese (1, 15).",
    ("Regole", "ancora"): "Settimanale ogni 2 o più settimane: una data in cui il "
    "ritiro c'è stato o ci sarà. Decide quali settimane.",
    ("Regole", "periodo"): "Sempre, Ogni anno (dal 01/06 al 30/09) o Solo tra due "
    "date (dal 01/10/2026 al 31/03/2027). Vuoto: Sempre, se Dal e Al sono vuoti.",
    ("Regole", "dal"): "Ogni anno: giorno e mese (01/06). Solo tra due date: la data.",
    ("Regole", "al"): "Ogni anno: giorno e mese (30/09). Solo tra due date: la data.",
    ("Eccezioni", "tipologia"): "Una delle tipologie del foglio Tipologie.",
    ("Eccezioni", "tipo"): "Aggiungi o Togli un ritiro nella Data; Sposta il "
    "ritiro della Data al giorno di «Spostato al».",
    ("Eccezioni", "data"): "Il giorno del ritiro da aggiungere, togliere o spostare.",
    ("Eccezioni", "a"): "Solo per Sposta: il giorno in cui passa invece.",
    ("Eccezioni", "nota"): "Facoltativa, per esempio «Natale».",
    ("Promemoria", "nome"): "Per riconoscerlo, per esempio «La sera prima».",
    ("Promemoria", "attivo"): "Sì o No. Vuoto vale Sì.",
    ("Promemoria", "quando"): "Giorni prima, Il giorno del ritiro, o All'apertura "
    "dell'esposizione.",
    ("Promemoria", "giorni"): "Solo per Giorni prima: da 1 a 7. Vuoto vale 1.",
    ("Promemoria", "ora"): "L'ora dell'avviso. Non serve con All'apertura.",
    ("Promemoria", "tipologie"): "Tutte, oppure i nomi separati da virgola.",
    ("Promemoria", "destinatari"): "Separati da virgola: mobile_app_telefono per "
    "un servizio, notify.telegram per un'entità. L'elenco è nel foglio Leggimi.",
    ("Vacanze", "dal"): "Il primo giorno di silenzio.",
    ("Vacanze", "al"): "L'ultimo giorno di silenzio.",
}

EXCEL_ESEMPI: dict[str, dict[str, object]] = {
    "Tipologie": {
        "nome": "Umido",
        "colore": "#795548",
        "icona": "mdi:food-apple",
        "note": "Scarti di cucina, fondi di caffè",
    },
    "Regole": {
        "tipologia": "Umido",
        "ricorrenza": "Settimanale",
        "ogni": 1,
        "giorni_settimana": "Lun, Gio",
        "periodo": "Sempre",
    },
    "Eccezioni": {
        "tipologia": "Carta",
        "tipo": "Sposta",
        "data": date(2026, 12, 25),
        "a": date(2026, 12, 27),
        "nota": "Natale",
    },
    "Promemoria": {
        "nome": "La sera prima",
        "attivo": "Sì",
        "quando": "Giorni prima",
        "giorni": 1,
        "ora": "20:30",
        "tipologie": "Tutte",
        "destinatari": "mobile_app_telefono",
    },
    "Vacanze": {"dal": date(2026, 8, 1), "al": date(2026, 8, 20)},
}

EXCEL_SCELTA_NON_VALIDA = "Scegli una voce dal menu."
EXCEL_TIPOLOGIA_NON_VALIDA = "Scegli una tipologia del foglio Tipologie."

EXCEL_LEGGIMI_TITOLO = "Foyer Raccolta Differenziata · il calendario in Excel"
EXCEL_LEGGIMI: tuple[tuple[str, str], ...] = (
    (
        "testo",
        "Questo file contiene la configurazione della raccolta. Puoi compilarlo o "
        "modificarlo qui e poi importarlo dal pannello: Raccolta › Impostazioni › "
        "Configurazione in Excel.",
    ),
    ("sezione", "Come si usa"),
    (
        "punto",
        "1. Compila i fogli Tipologie, Regole, Eccezioni, Promemoria, Vacanze e "
        "Impostazioni. Ogni riga è un elemento; le righe vuote non contano.",
    ),
    (
        "punto",
        "2. Salva in formato .xlsx: vanno bene Excel, LibreOffice e Google Fogli.",
    ),
    (
        "punto",
        "3. Nel pannello scegli «Importa da Excel», il file e come importarlo. "
        "Prima di salvare vedi cosa cambia nel calendario; se qualcosa non va, il "
        "pannello dice foglio, riga e colonna.",
    ),
    ("sezione", "Sostituisci tutto o aggiungi soltanto"),
    (
        "punto",
        "Sostituisci tutto: il file diventa la configurazione. Quello che nel file "
        "non c'è viene tolto. È il modo giusto dopo un'esportazione.",
    ),
    (
        "punto",
        "Aggiungi soltanto: le righe del file si aggiungono a quello che c'è. Una "
        "riga che corrisponde a qualcosa di esistente lo aggiorna (stessa "
        "tipologia, stesso nome di promemoria, stessa eccezione nello stesso "
        "giorno). Non si toglie niente. Comodo per incollare le date del calendario "
        "nuovo.",
    ),
    ("sezione", "Come si scrive"),
    (
        "punto",
        "Date: 22/09/2026. Giorno e mese (periodi «Ogni anno», patrono): 01/06.",
    ),
    ("punto", "Orari: 20:00."),
    (
        "punto",
        "Giorni della settimana: Lun, Mar, Mer, Gio, Ven, Sab, Dom (Lun, Gio).",
    ),
    ("punto", "Quali nel mese: 1°, 2°, 3°, 4°, ultimo (2°, 4°)."),
    ("punto", "Giorni del mese: numeri da 1 a 31 (1, 15)."),
    (
        "punto",
        "Colori: codice esadecimale (#795548). Icone: nomi Material Design "
        "(mdi:food-apple), si cercano su pictogrammers.com.",
    ),
    ("punto", "Sì o No per «Attivo» e per i solleciti."),
    ("punto", "Le celle con un menu a tendina accettano le voci del menu."),
    ("sezione", "Le regole in breve"),
    (
        "punto",
        "Settimanale: ogni quante settimane (1 = tutte) e in quali giorni. Se passa "
        "ogni 2 settimane o più, scrivi in «Un giorno di ritiro» una data in cui il "
        "ritiro c'è stato o ci sarà: decide quali settimane.",
    ),
    (
        "punto",
        "Mensile per giorno della settimana: «Quali nel mese» e un solo giorno, per "
        "esempio 2°, 4° e Gio per il secondo e il quarto giovedì.",
    ),
    ("punto", "Mensile per data: i giorni del mese, per esempio 1, 15."),
    (
        "punto",
        "Periodo: Sempre; Ogni anno dal 01/06 al 30/09; Solo tra due date dal "
        "01/10/2026 al 31/03/2027. Lasciato vuoto, lo si capisce da Dal e Al.",
    ),
    ("sezione", "La colonna nascosta ID"),
    (
        "punto",
        "Ogni foglio ha una colonna nascosta «ID» che collega la riga a quello che "
        "c'è in Home Assistant: non modificarla. In una riga nuova resta vuota; una "
        "riga copiata diventa un elemento nuovo.",
    ),
    ("sezione", "Destinatari disponibili in questa casa"),
)
EXCEL_NESSUN_DESTINATARIO = "Nessun servizio o entità di notifica trovato."


def excel_creato(istante: datetime, versione: str) -> str:
    quando = istante.strftime("%d/%m/%Y alle %H:%M")
    return f"Creato il {quando} da Foyer Raccolta Differenziata {versione}."


def excel_nome_file(modello: bool, giorno: date) -> str:
    if modello:
        return "raccolta-differenziata-modello.xlsx"
    return f"raccolta-differenziata-{giorno.isoformat()}.xlsx"
