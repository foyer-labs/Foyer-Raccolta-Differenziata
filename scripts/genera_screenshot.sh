#!/bin/bash
# Gli screenshot della documentazione, dal banco di prova, con Chrome headless.
#
#   python -m http.server 8766 --bind 127.0.0.1      # dalla radice del repository
#   CHROME=/percorso/di/chrome bash scripts/genera_screenshot.sh
#
# Le date e l'ora sono fisse (parametri oggi e ora del banco): le immagini non cambiano
# da un giorno all'altro. Chrome non scende sotto circa 500 px di finestra, quindi
# l'immagine da telefono si restringe con il parametro larghezza e si ritaglia.
set -e
CHROME="${CHROME:-google-chrome}"
RADICE="$(cd "$(dirname "$0")/.." && pwd)"
USCITA="$RADICE/docs/screenshots"
PROFILO="$(mktemp -d)"
# Su Windows (Git Bash) Chrome vuole percorsi Windows, non /e/...
if command -v cygpath >/dev/null 2>&1; then
  USCITA="$(cygpath -m "$USCITA")"
  PROFILO="$(cygpath -m "$PROFILO")"
fi
BASE="${BASE:-http://localhost:8766/banco}"
SERA="oggi=2026-09-23&ora=2026-09-23T21:00:00%2B02:00"
mkdir -p "$USCITA"

foto() {  # nome larghezza altezza url
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2     --user-data-dir="$PROFILO" --window-size="$2,$3" --virtual-time-budget=6000     --screenshot="$USCITA/$1.png" "$4" >/dev/null 2>&1
  echo "$1"
}

foto card-chiaro 1180 520 "$BASE/card.html?$SERA"
foto card-scuro 1180 520 "$BASE/card.html?$SERA&tema=scuro"
foto card-telefono 500 760 "$BASE/card.html?$SERA&tema=scuro&card=oggi,settimana&larghezza=388"
python -c "from PIL import Image; p='$USCITA/card-telefono.png'; i=Image.open(p); i.crop((0, 0, 840, i.size[1])).save(p)"
foto pannello-panoramica 1200 820 "$BASE/pannello.html?oggi=2026-11-20"
foto pannello-regole 1200 820 "$BASE/pannello.html?oggi=2026-09-23&pagina=regole&passi=Una%20settimana"
foto pannello-tipologie 1200 620 "$BASE/pannello.html?oggi=2026-09-23&pagina=tipologie"
foto pannello-promemoria 1200 880 "$BASE/pannello.html?oggi=2026-09-23&pagina=promemoria&passi=La%20sera"
foto pannello-eccezioni 1200 520 "$BASE/pannello.html?oggi=2026-09-23&pagina=eccezioni"
foto pannello-excel 1200 760 "$BASE/pannello.html?oggi=2026-09-23&pagina=impostazioni&passi=Importa|file:calendario-2027.xlsx|Sostituisci"
foto pannello-scuro 1200 820 "$BASE/pannello.html?oggi=2026-11-20&tema=scuro"
