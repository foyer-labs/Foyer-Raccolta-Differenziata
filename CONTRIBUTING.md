# Contribuire

Grazie dell'interesse. Il progetto è tutto in italiano: codice, commenti, commit,
documentazione (SPEC §3, INV-5).

## Due rami

- **`main`** è quello che installa HACS: solo l'integrazione, la guida e i file per
  l'utente.
- **`sviluppo`** è dove si lavora: sorgenti del frontend, test, specifica, banco di prova,
  script. Le pull request vanno verso `sviluppo`; `main` si aggiorna solo con le release.

## Prima di scrivere codice

[`docs/SPEC.md`](https://github.com/foyer-labs/Foyer-Raccolta-Differenziata/blob/sviluppo/docs/SPEC.md) è la fonte di verità: leggila, soprattutto gli invarianti
(§3) e il registro delle decisioni (§16). Una funzione che la spec non prevede si propone
prima con una issue: il progetto sceglie la semplicità di proposito (INV-6).

## Ambiente

- Python 3.13 o 3.14, Node 24.
- Suite pura, **senza** Home Assistant installato:
  ```bash
  pip install pytest hypothesis
  pytest
  ```
- Suite d'integrazione (Linux o WSL), con `pytest-homeassistant-custom-component`:
  ```bash
  pip install pytest-homeassistant-custom-component
  pytest -p pytest_homeassistant_custom_component -o asyncio_mode=auto -o asyncio_default_fixture_loop_scope=function tests/integrazione
  ```
- Lint: `ruff check .` e `ruff format --check .`
- Frontend (Lit + TypeScript): `cd frontend && npm ci && npm run build`. I file costruiti in
  `custom_components/foyer_raccolta_differenziata/frontend/` sono nel repository e la CI
  controlla che corrispondano ai sorgenti.
- Dopo ogni modifica a `strings.json`: `python scripts/genera_traduzioni.py`.

## Le regole che non si piegano

- `core/` è puro: non importa Home Assistant, non legge l'orologio, non fa I/O. Un test lo
  verifica; se fallisce si corregge il codice, mai il test.
- Un errore non si traveste mai da "nessun ritiro": le entità diventano non disponibili.
- Nessuna data si sposta da sola: il sistema segnala, l'utente decide.
- Ogni cambiamento visibile aggiorna nello stesso ramo README, guida e `CHANGELOG.md`.

## Pull request

Un ramo per argomento, commit piccoli con un messaggio che dice *perché*. La CI (lint,
suite pura, integrazione su Home Assistant 2026.6 e sull'ultima, hassfest, HACS, build del
frontend) deve essere verde.
