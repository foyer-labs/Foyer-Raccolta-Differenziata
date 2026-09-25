"""Proprietà del motore su configurazioni generate a caso (SPEC §7)."""

from __future__ import annotations

from datetime import date, timedelta

from hypothesis import given, settings, strategies as st

from custom_components.foyer_raccolta_differenziata.core.calendario import calcola

from .aiuti import (
    ROMA,
    aggiungi,
    annuale,
    con_anno,
    configura,
    mensile_data,
    mensile_posizione,
    regola,
    settimanale,
    sposta,
    tipologia,
    togli,
)

INIZIO = date(2026, 1, 1)
FINE = date(2028, 12, 31)
TIPOLOGIE = ("umido", "carta")

giorni_calendario = st.integers(0, (FINE - INIZIO).days).map(
    lambda n: INIZIO + timedelta(days=n)
)
mese_giorno = st.tuples(st.integers(1, 12), st.integers(1, 28)).map(
    lambda t: f"{t[0]:02d}-{t[1]:02d}"
)

ricorrenze = st.one_of(
    st.builds(
        settimanale,
        st.lists(st.integers(0, 6), min_size=1, max_size=3, unique=True),
        ogni=st.integers(1, 4),
        ancora=giorni_calendario.map(date.isoformat),
    ),
    st.builds(
        mensile_posizione,
        st.lists(
            st.sampled_from([1, 2, 3, 4, -1]), min_size=1, max_size=2, unique=True
        ),
        st.integers(0, 6),
    ),
    st.builds(
        mensile_data,
        st.lists(st.integers(1, 31), min_size=1, max_size=2, unique=True),
    ),
)


@st.composite
def periodi(draw):
    tipo = draw(st.sampled_from(["sempre", "annuale", "con_anno"]))
    if tipo == "sempre":
        return None
    if tipo == "annuale":
        return annuale(draw(mese_giorno), draw(mese_giorno))
    dal, al = sorted([draw(giorni_calendario), draw(giorni_calendario)])
    return con_anno(dal.isoformat(), al.isoformat())


@st.composite
def configurazioni(draw):
    regole = [
        regola(
            f"r{i}", draw(st.sampled_from(TIPOLOGIE)), draw(ricorrenze), draw(periodi())
        )
        for i in range(draw(st.integers(0, 4)))
    ]
    eccezioni = []
    usate = set()
    for i in range(draw(st.integers(0, 6))):
        tip = draw(st.sampled_from(TIPOLOGIE))
        giorno = draw(giorni_calendario)
        if (tip, giorno) in usate:
            continue
        usate.add((tip, giorno))
        tipo = draw(st.sampled_from(["aggiungi", "togli", "sposta"]))
        if tipo == "aggiungi":
            eccezioni.append(aggiungi(f"e{i}", tip, giorno.isoformat()))
        elif tipo == "togli":
            eccezioni.append(togli(f"e{i}", tip, giorno.isoformat()))
        else:
            arrivo = draw(giorni_calendario.filter(lambda g, p=giorno: g != p))
            eccezioni.append(
                sposta(f"e{i}", tip, giorno.isoformat(), arrivo.isoformat())
            )
    return configura(
        tipologie=[tipologia(t) for t in TIPOLOGIE], regole=regole, eccezioni=eccezioni
    )


intervalli = st.tuples(giorni_calendario, giorni_calendario).map(sorted)


@settings(max_examples=150, deadline=None)
@given(configurazioni(), intervalli)
def test_nessun_duplicato_e_ordine_stabile(config, intervallo):
    dal, al = intervallo
    ritiri = calcola(config, dal, al, ROMA).ritiri

    chiavi = [(r.data, r.tipologia) for r in ritiri]
    assert len(chiavi) == len(set(chiavi))
    assert [r.data for r in ritiri] == sorted(r.data for r in ritiri)
    assert all(dal <= r.data <= al for r in ritiri)


@settings(max_examples=150, deadline=None)
@given(configurazioni(), intervalli)
def test_deterministico(config, intervallo):
    dal, al = intervallo

    assert calcola(config, dal, al, ROMA) == calcola(config, dal, al, ROMA)


@settings(max_examples=150, deadline=None)
@given(configurazioni(), giorni_calendario, giorni_calendario, giorni_calendario)
def test_un_intervallo_e_l_unione_delle_sue_parti(config, a, b, c):
    """Calcolare [a, c] o [a, b] più [b+1, c] dà gli stessi ritiri."""
    a, b, c = sorted([a, b, c])
    if b == c:
        return
    intero = calcola(config, a, c, ROMA).ritiri
    parti = (
        calcola(config, a, b, ROMA).ritiri
        + calcola(config, b + timedelta(days=1), c, ROMA).ritiri
    )

    assert intero == parti


@settings(max_examples=150, deadline=None)
@given(configurazioni(), intervalli)
def test_un_giorno_tolto_non_ha_mai_il_ritiro(config, intervallo):
    """Salvo che uno spostamento o un'aggiunta ci portino un ritiro."""
    dal, al = intervallo
    presenti = {(r.data, r.tipologia) for r in calcola(config, dal, al, ROMA).ritiri}
    arrivi = {
        (e.a if e.tipo == "sposta" else e.data, e.tipologia)
        for e in config.eccezioni
        if e.tipo in ("sposta", "aggiungi")
    }

    for e in config.eccezioni:
        if e.tipo in ("togli", "sposta") and (e.data, e.tipologia) not in arrivi:
            assert (e.data, e.tipologia) not in presenti


@settings(max_examples=150, deadline=None)
@given(configurazioni(), intervalli)
def test_un_giorno_aggiunto_ha_sempre_il_ritiro(config, intervallo):
    dal, al = intervallo
    presenti = {(r.data, r.tipologia) for r in calcola(config, dal, al, ROMA).ritiri}

    for e in config.eccezioni:
        if e.tipo == "aggiungi" and dal <= e.data <= al:
            assert (e.data, e.tipologia) in presenti
        if e.tipo == "sposta" and e.a is not None and dal <= e.a <= al:
            assert (e.a, e.tipologia) in presenti
