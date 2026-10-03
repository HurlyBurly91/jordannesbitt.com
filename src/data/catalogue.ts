import { getCollection } from "astro:content";
import { publicCatalogue, type Catalogue } from "../lib/catalogue.ts";

const entries = await Promise.all([getCollection("artworks"), getCollection("projects"), getCollection("professional")]);
const snapshot: Catalogue = {
  artworks: entries[0].map((entry) => entry.data), projects: entries[1].map((entry) => entry.data), professional: entries[2].map((entry) => entry.data),
};
export const catalogue = publicCatalogue(snapshot);
export const artworks = catalogue.artworks;
export const projects = catalogue.projects;
export const professional = catalogue.professional[0];
export function projectsForArtwork(id: string) { return projects.filter((project) => project.memberIds.includes(id)); }
