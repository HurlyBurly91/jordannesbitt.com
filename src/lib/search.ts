import { dateLabel, mediumLabel, publicCatalogue, type Catalogue } from "./catalogue.ts";
import type { ArchiveEntry } from "./archive.ts";

export function searchEntries(input: Catalogue): ArchiveEntry[] {
  // Reuse the sole predicate even if a future caller supplies a raw snapshot.
  const catalogue = publicCatalogue(input);
  return catalogue.artworks.map((work) => {
    const series = catalogue.projects.filter((project) => project.memberIds.includes(work.id)).map(({ id, slug, title }) => ({ id, slug, title }));
    const label = mediumLabel(work.medium);
    const image = work.reproductions.find((image) => image.role === "primary");
    const small = image?.variants.filter((variant) => ["jpeg", "png"].includes(variant.format)).sort((a, b) => a.width - b.width)[0];
    return {
      id: work.id, slug: work.slug, title: work.title, date: dateLabel(work.date), year: work.date.year,
      medium: work.medium, mediumLabel: label, availability: work.availability.state, series,
      searchText: [work.title, dateLabel(work.date), label, ...work.techniques, work.materials, work.description, ...series.map((project) => project.title)].filter(Boolean).join(" "),
      ...(image ? { thumbnail: { src: small?.src ?? image.src, width: small?.width ?? image.width, height: small?.height ?? image.height, alt: image.alt } } : {}),
    };
  });
}
export const availabilityLabels: Record<string, string> = { available: "Available", reserved: "Reserved", sold: "Sold", "not-for-sale": "Not for sale", "edition-available": "Edition available", unknown: "Availability unknown" };
