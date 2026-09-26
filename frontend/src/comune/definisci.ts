// Definire gli elementi quando Home Assistant è pronto a riconoscerli.
//
// L'app di Home Assistant, partendo, sostituisce il registro degli elementi con uno
// suo (il polyfill dei registri con ambito). Le card si caricano come modulo extra
// (decisione 46) e possono arrivare prima: un elemento definito nel registro vecchio
// esiste nell'elenco delle card ma il selettore non lo trova, e la card non si può
// aggiungere da interfaccia. Si aspetta che l'app definisca <home-assistant>; fuori da
// Home Assistant (il banco di prova) non c'è niente da aspettare.
const pronto: Promise<unknown> =
  document.querySelector("home-assistant") && !customElements.get("home-assistant")
    ? customElements.whenDefined("home-assistant")
    : Promise.resolve();

/** Esegue `azione` quando il registro di Home Assistant è quello definitivo. */
export const quandoPronto = (azione: () => void): void => void pronto.then(azione);

/** Definisce un elemento, una volta sola, nel registro definitivo. */
export function definisci(nome: string, classe: CustomElementConstructor): void {
  quandoPronto(() => {
    if (!customElements.get(nome)) customElements.define(nome, classe);
  });
}
