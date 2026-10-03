import type { Artwork, Catalogue, Project } from "./catalogue.ts";

export function selectedWorks(artworks: Artwork[]): Artwork[] {
  return artworks.filter((work) => work.featured || work.selectedOrder !== undefined)
    .sort((a, b) => (a.selectedOrder ?? Number.MAX_SAFE_INTEGER) - (b.selectedOrder ?? Number.MAX_SAFE_INTEGER));
}
export function projectMembers(project: Project, artworks: Artwork[]): Artwork[] {
  const byId = new Map(artworks.map((work) => [work.id, work]));
  return project.memberIds.flatMap((id) => byId.has(id) ? [byId.get(id)!] : []);
}
export function relatedWorks(catalogue: Catalogue, id: string): Artwork[] {
  const ids = [...new Set(catalogue.projects.filter((project) => project.memberIds.includes(id)).flatMap((project) => project.memberIds))].filter((member) => member !== id);
  const byId = new Map(catalogue.artworks.map((work) => [work.id, work]));
  return ids.flatMap((member) => byId.has(member) ? [byId.get(member)!] : []);
}
export function imageSources(image: Artwork["reproductions"][number], format: string): string | undefined {
  const variants = image.variants.filter((variant) => variant.format === format).sort((a, b) => a.width - b.width);
  return variants.length ? variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ") : undefined;
}
export function safeJson(value: unknown): string { return JSON.stringify(value).replace(/</g, "\\u003c"); }
