import { getCollection } from "astro:content";
import { publicCatalogue, media, type Catalogue } from "../lib/catalogue.ts";
import { watchReady } from "../lib/moving-image.ts";
import { isAvailable } from "../lib/acquisition.ts";

const entries = await Promise.all([getCollection("artworks"), getCollection("projects"), getCollection("professional")]);
const snapshot: Catalogue = {
  artworks: entries[0].map((entry) => entry.data), projects: entries[1].map((entry) => entry.data), professional: entries[2].map((entry) => entry.data),
};
export const catalogue = publicCatalogue(snapshot);
export const artworks = catalogue.artworks;
export const projects = catalogue.projects;
export const professional = catalogue.professional[0];
export const films = artworks.filter((work) => work.medium === "film" && watchReady(work));
export const availableWorks = artworks.filter(isAvailable);
export const mediumRoutes = [...media, ...(artworks.some((work) => work.medium === "computational") ? [{ slug: "computational" as const, label: "Computational" }] : [])];
export const populatedMedia = mediumRoutes.map((item) => ({ ...item, count: artworks.filter((work) => work.medium === item.slug).length })).filter((item) => item.count > 0);
export function projectsForArtwork(id: string) { return projects.filter((project) => project.memberIds.includes(id)); }
