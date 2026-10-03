import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";
import { readCatalogue, emitPublicMedia } from "./src/lib/catalogue-source.ts";

let approvedRoot;
const approvedMedia = {
  name: "approved-media",
  hooks: {
    "astro:config:done": ({ config }) => { approvedRoot = fileURLToPath(config.root); readCatalogue(approvedRoot); },
    "astro:build:done": ({ dir }) => { emitPublicMedia(approvedRoot, fileURLToPath(dir)); },
  },
};

export default defineConfig({
  site: "https://jordannesbitt.com",
  output: "static",
  integrations: [sitemap(), approvedMedia],
});
