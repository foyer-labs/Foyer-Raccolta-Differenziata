// Costruisce ogni punto d'ingresso come un modulo ES autonomo nella cartella
// frontend/ dell'integrazione, da dove Home Assistant lo serve. Il risultato è nel
// repository: HACS installa custom_components/foyer_raccolta_differenziata così
// com'è, senza un passo di build.
import { build } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const qui = fileURLToPath(new URL(".", import.meta.url));
const uscita = resolve(qui, "../custom_components/foyer_raccolta_differenziata/frontend");

const ingressi = {
  "raccolta-pannello": "src/pannello/raccolta-pannello.ts",
  "raccolta-card": "src/card/raccolta-card.ts",
};

// La minificazione toglie i commenti di licenza delle dipendenze incluse: gli
// avvisi che le loro licenze richiedono si ripetono in testa a ogni file.
const intestazione =
  "/*! Foyer Raccolta Differenziata — Apache-2.0. Vedi LICENSE e NOTICE." +
  "\n * Include Lit (https://lit.dev): Copyright 2017 Google LLC, BSD-3-Clause. */";

let primo = true;
for (const [nome, ingresso] of Object.entries(ingressi)) {
  await build({
    configFile: false,
    root: qui,
    logLevel: "warn",
    build: {
      outDir: uscita,
      emptyOutDir: primo,
      minify: true,
      sourcemap: false,
      lib: { entry: resolve(qui, ingresso), formats: ["es"], fileName: () => `${nome}.js` },
      rolldownOptions: { output: { banner: intestazione } },
    },
  });
  primo = false;
  console.log(`costruito ${nome}.js`);
}
