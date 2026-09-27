"""L'emoji di una tipologia nel titolo delle notifiche (decisione 71).

Le notifiche non possono mostrare le icone Material Design su tutti i telefoni (iOS
mostra solo testo): l'emoji fa la stessa parte. Se la tipologia non ne sceglie una,
si ricava dall'icona; un'icona che qui non c'è dà il simbolo del riciclo. Le icone
sono quelle proposte nel pannello (frontend/src/comune/icone.ts): un test controlla
che ognuna abbia la sua emoji.
"""

from __future__ import annotations

EMOJI_PREDEFINITA = "♻️"
LUNGHEZZA_MASSIMA = 16

EMOJI_ICONE: dict[str, str] = {
    "mdi:food-apple": "🍎",
    "mdi:food-apple-outline": "🍏",
    "mdi:food": "🍽️",
    "mdi:fruit-cherries": "🍒",
    "mdi:silverware-fork-knife": "🍽️",
    "mdi:pot-steam": "🍲",
    "mdi:coffee": "☕",
    "mdi:newspaper-variant": "📰",
    "mdi:newspaper": "📰",
    "mdi:package-variant": "📦",
    "mdi:package-variant-closed": "📦",
    "mdi:bottle-soda": "🧴",
    "mdi:bottle-soda-classic": "🥤",
    "mdi:bottle-wine": "🍾",
    "mdi:glass-fragile": "🍾",
    "mdi:glass-wine": "🍷",
    "mdi:glass-mug-variant": "🍺",
    "mdi:trash-can": "🗑️",
    "mdi:trash-can-outline": "🗑️",
    "mdi:delete-variant": "🗑️",
    "mdi:recycle": "♻️",
    "mdi:recycle-variant": "♻️",
    "mdi:leaf": "🌿",
    "mdi:tree": "🌳",
    "mdi:grass": "🌱",
    "mdi:flower": "🌸",
    "mdi:baby-carriage": "👶",
    "mdi:human-baby-changing-table": "👶",
    "mdi:sofa": "🛋️",
    "mdi:bed": "🛏️",
    "mdi:fridge": "🔌",
    "mdi:washing-machine": "🔌",
    "mdi:television": "📺",
    "mdi:laptop": "💻",
    "mdi:cellphone": "📱",
    "mdi:lightbulb": "💡",
    "mdi:battery": "🔋",
    "mdi:pill": "💊",
    "mdi:tshirt-crew": "👕",
    "mdi:shoe-sneaker": "👟",
    "mdi:oil": "🛢️",
    "mdi:bucket": "🪣",
    "mdi:spray-bottle": "🧴",
    "mdi:car-tire-alert": "🛞",
    "mdi:paw": "🐾",
    "mdi:cup": "🥤",
}


def emoji_di(icona: str, scelta: str = "") -> str:
    """L'emoji scelta, oppure quella dell'icona, oppure il riciclo."""
    return scelta.strip() or EMOJI_ICONE.get(icona, EMOJI_PREDEFINITA)
