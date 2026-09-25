"""Fixture dei test d'integrazione.

Si eseguono con il plugin attivato esplicitamente, così la suite pura non lo carica:

    pytest -p pytest_homeassistant_custom_component tests/integrazione
"""

from __future__ import annotations

import pytest


@pytest.fixture(autouse=True)
def integrazioni_personalizzate(enable_custom_integrations):
    """Home Assistant carica custom_components/ solo se glielo si chiede."""
    return
