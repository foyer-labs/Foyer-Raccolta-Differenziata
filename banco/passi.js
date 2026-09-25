// Clicca, in ordine, i pulsanti con questi testi (?passi=Regole|Modifica), cercando
// anche dentro gli shadow DOM. Serve a fotografare stati raggiunti con un clic.
const attesa = (ms) => new Promise((r) => setTimeout(r, ms));
function* tutti(radice) {
  for (const el of radice.querySelectorAll("*")) {
    yield el;
    if (el.shadowRoot) yield* tutti(el.shadowRoot);
  }
}
export async function esegui() {
  const passi = new URLSearchParams(location.search).get("passi");
  if (!passi) return;
  for (const testo of passi.split("|")) {
    await attesa(500);
    const [nome, n] = testo.split("#");
    const trovati = [...tutti(document)].filter((el) => el.tagName === "BUTTON" && el.textContent.trim().startsWith(nome));
    trovati[Number(n ?? 0)]?.click();
  }
}
