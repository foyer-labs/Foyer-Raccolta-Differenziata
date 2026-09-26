#!/bin/bash
# Porta su un ramo di pubblicazione, basato su main, solo i file che l'utente e HACS
# usano (pubblicazione/file-pubblicati.txt), con il workflow ridotto. Poi si apre una
# pull request verso main e, a CI verde, si fa la release da main.
#
#   bash scripts/pubblica_main.sh <nome-del-ramo>
set -euo pipefail
RAMO="${1:?indica il nome del ramo di pubblicazione}"
cd "$(dirname "$0")/.."
git diff --quiet && git diff --cached --quiet || { echo "Ci sono modifiche non salvate."; exit 1; }
[ "$(git branch --show-current)" = "sviluppo" ] || { echo "Parti dal ramo sviluppo."; exit 1; }

mapfile -t FILE < <(grep -v '^#' pubblicazione/file-pubblicati.txt | grep -v '^$')
git fetch -q origin
git checkout -q -B "$RAMO" origin/main
git rm -r -q --ignore-unmatch .
git clean -fdq
git checkout sviluppo -- "${FILE[@]}"
mkdir -p .github/workflows
git show sviluppo:pubblicazione/ci-main.yml > .github/workflows/ci.yml
# Niente cache di Python nel pacchetto pubblicato.
find custom_components -name __pycache__ -prune -exec rm -rf {} +
git add -A
git status --short
echo "Pronto sul ramo $RAMO: controlla, fai il commit e apri la pull request verso main."
