import { defineCollection } from "astro:content";
import type { Loader } from "astro/loaders";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { artworkSchema, projectSchema, professionalSchema } from "./lib/catalogue.ts";
import { contentFiles, readCatalogue } from "./lib/catalogue-source.ts";

function approvedLoader(name: typeof contentFiles[number]): Loader {
  return {
    name: `approved-${name}`,
    async load({ store, parseData, config, watcher }) {
      const root = fileURLToPath(config.root);
      const sync = async () => {
        const catalogue = readCatalogue(root);
        const records = catalogue[name];
        const entries = await Promise.all(records.map(async (record) => ({ id: record.id, data: await parseData({ id: record.id, data: record }) })));
        store.clear();
        for (const entry of entries) store.set(entry);
      };
      await sync();
      const paths = contentFiles.map((file) => resolve(root, `src/content/${file}.json`));
      watcher?.add(paths);
      watcher?.on("change", async (path) => { if (paths.includes(path)) await sync(); });
    },
  };
}
export const collections = {
  artworks: defineCollection({ loader: approvedLoader("artworks"), schema: artworkSchema }),
  projects: defineCollection({ loader: approvedLoader("projects"), schema: projectSchema }),
  professional: defineCollection({ loader: approvedLoader("professional"), schema: professionalSchema }),
};
