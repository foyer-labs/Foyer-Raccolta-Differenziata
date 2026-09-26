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
    if (testo.startsWith("file:")) {
      // Un file finto nel primo campo file: il banco non può aprire la scelta file.
      const campo = [...tutti(document)].find((el) => el.tagName === "INPUT" && el.type === "file");
      const trasferimento = new DataTransfer();
      trasferimento.items.add(new File(["x"], testo.slice(5)));
      if (campo) {
        campo.files = trasferimento.files;
        campo.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
      }
      continue;
    }
    const [nome, n] = testo.split("#");
    const trovati = [...tutti(document)].filter((el) => el.tagName === "BUTTON" && el.textContent.trim().startsWith(nome));
    trovati[Number(n ?? 0)]?.click();
  }
}
