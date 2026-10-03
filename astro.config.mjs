import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";
import { readCatalogue, emitPublicMedia } from "./src/lib/catalogue-source.ts";
import { publicCatalogue } from "./src/lib/catalogue.ts";

let approvedRoot;
let aliasPaths = new Set();
const approvedMedia = {
  name: "approved-media",
  hooks: {
    "astro:config:done": ({ config }) => {
      approvedRoot = fileURLToPath(config.root);
      const catalogue = publicCatalogue(readCatalogue(approvedRoot));
      aliasPaths = new Set([
        ...catalogue.artworks.flatMap((work) => work.aliases.map((alias) => `/artwork/${alias}/`)),
        ...catalogue.projects.flatMap((project) => project.aliases.map((alias) => `/projects/${alias}/`)),
      ]);
    },
    "astro:build:done": ({ dir }) => { emitPublicMedia(approvedRoot, fileURLToPath(dir)); },
  },
};

export default defineConfig({
  site: "https://jordannesbitt.com",
  output: "static",
  cacheDir: "./.astro/cache/",
  vite: { cacheDir: "./.astro/vite/" },
  integrations: [sitemap({ filter: (page) => !aliasPaths.has(new URL(page).pathname) }), approvedMedia],
});
