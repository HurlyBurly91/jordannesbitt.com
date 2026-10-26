import { z } from "astro/zod";

export const media = [
  { slug: "drawing", label: "Drawing" }, { slug: "painting", label: "Painting" },
  { slug: "printmaking", label: "Printmaking" }, { slug: "photography", label: "Photography" },
  { slug: "aerial", label: "Aerial" }, { slug: "film", label: "Film" },
] as const;
export const mediumSchema = z.enum(["drawing", "painting", "printmaking", "photography", "aerial", "film", "computational", "unclassified"]);
export type Medium = z.infer<typeof mediumSchema>;
export function mediumLabel(medium: Medium): string { return media.find((item) => item.slug === medium)?.label ?? (medium === "computational" ? "Computational" : "Classification unconfirmed"); }
const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z][a-z0-9-]*$/, "Use a stable, neutral ID or slug");
const asset = z.string().regex(/^\/media\/[a-z0-9][a-z0-9/_-]*\.(?:jpe?g|png|webp|avif|mp4|webm|vtt|pdf)$/, "Use a local /media/ derivative URL");
const imageAsset = asset.refine((value) => /\.(?:jpe?g|png|webp|avif)$/.test(value), "Expected an image derivative");
const base = {
  id, slug: id, aliases: z.array(id).default([]), published: z.boolean().default(false),
  fixture: z.boolean().default(false), title: text,
};
export const dateSchema = z.object({
  certainty: z.enum(["exact", "circa", "unknown"]),
  year: z.number().int().min(1).max(9999).optional(),
  endYear: z.number().int().min(1).max(9999).optional(), label: text.optional(),
}).strict().superRefine((date, ctx) => {
  if (date.certainty !== "unknown" && !date.year) ctx.addIssue({ code: "custom", message: "Exact/circa dates need a year" });
  if (date.certainty === "unknown" && (date.year || date.endYear)) ctx.addIssue({ code: "custom", message: "Unknown dates must not invent a year" });
  if (date.endYear && (!date.year || date.endYear < date.year)) ctx.addIssue({ code: "custom", message: "Invalid date range" });
});
const dimension = z.object({
  kind: z.enum(["image", "sheet", "framed", "object"]), unit: z.enum(["mm", "cm", "in"]),
  width: z.number().finite().positive(), height: z.number().finite().positive(), depth: z.number().finite().positive().optional(),
}).strict();
export const reproductionSchema = z.object({
  src: imageAsset, alt: text, width: z.number().int().positive(), height: z.number().int().positive(),
  role: z.enum(["primary", "alternate", "detail", "framed", "installation", "documentation", "reverse", "process"]), caption: text.optional(),
  variants: z.array(z.object({
    src: imageAsset, width: z.number().int().positive(), height: z.number().int().positive(),
    format: z.enum(["jpeg", "png", "webp", "avif"]),
  }).strict()).default([]),
}).strict();
const edition = z.object({
  size: z.number().int().positive(), artistProofs: z.number().int().nonnegative().optional(),
  number: z.number().int().positive().optional(), signed: z.boolean().optional(), numbered: z.boolean().optional(),
}).strict().superRefine((entry, ctx) => {
  if (entry.number && entry.number > entry.size) ctx.addIssue({ code: "custom", message: "Edition number exceeds size" });
  if (entry.number && entry.numbered === false) ctx.addIssue({ code: "custom", message: "Unnumbered edition cannot have a number" });
});
export const availabilitySchema = z.object({
  state: z.enum(["available", "reserved", "sold", "not-for-sale", "edition-available", "unknown"]),
  reviewed: z.boolean().default(false), mode: z.enum(["enquiry-only", "price"]).optional(),
  price: z.object({ amountMinor: z.number().int().positive(), currency: z.string().regex(/^[A-Z]{3}$/) }).strict().optional(),
}).strict().superRefine((offer, ctx) => {
  if (!offer.reviewed && (offer.state !== "unknown" || offer.mode || offer.price)) ctx.addIssue({ code: "custom", message: "Availability/offer requires explicit review" });
  if (offer.price && (!offer.reviewed || offer.mode !== "price" || !["available", "edition-available"].includes(offer.state))) ctx.addIssue({ code: "custom", message: "Price needs a reviewed available offer" });
  if (offer.mode === "price" && !offer.price) ctx.addIssue({ code: "custom", message: "Priced mode requires amount and currency" });
  if (offer.mode && !["available", "edition-available"].includes(offer.state)) ctx.addIssue({ code: "custom", message: "Unavailable works must not advertise an offer" });
});
export const filmSchema = z.object({
  poster: imageAsset.optional(), runtimeSeconds: z.number().int().positive().optional(),
  posterInfo: z.object({ width: z.number().int().positive(), height: z.number().int().positive(), alt: text }).strict().optional(),
  uploadDate: z.string().datetime({ offset: true }).optional(),
  sources: z.array(z.object({ src: asset.refine((value) => /\.(mp4|webm)$/.test(value)), type: z.enum(["video/mp4", "video/webm"]) }).strict().refine((source) => source.src.endsWith(source.type === "video/mp4" ? ".mp4" : ".webm"), "Source extension and MIME type disagree")).default([]),
  embed: z.object({ provider: z.enum(["youtube", "vimeo"]), id: z.string().regex(/^[a-zA-Z0-9_-]+$/), consentRequired: z.literal(true) }).strict().refine((embed) => embed.provider === "vimeo" ? /^\d+$/.test(embed.id) : /^[a-zA-Z0-9_-]{11}$/.test(embed.id), "Invalid provider video ID").optional(),
  credits: z.array(text).default([]),
  captions: z.object({
    status: z.enum(["provided", "not-supplied", "not-applicable"]),
    tracks: z.array(z.object({ src: asset.refine((value) => value.endsWith(".vtt")), language: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/), label: text }).strict()).default([]),
  }).strict().superRefine((captions, ctx) => {
    if ((captions.status === "provided") !== (captions.tracks.length > 0)) ctx.addIssue({ code: "custom", message: "Caption status and supplied tracks disagree" });
  }),
  transcript: text.optional(), accessibilityNote: text.optional(),
}).strict();
export const artworkSchema = z.object({
  ...base, date: dateSchema, medium: mediumSchema,
  kind: z.enum(["original", "original-print", "reproduction", "moving-image", "computational", "unclassified"]),
  techniques: z.array(text).default([]), materials: text.optional(), description: text.optional(),
  dimensions: z.array(dimension).default([]), reproductions: z.array(reproductionSchema).default([]),
  featured: z.boolean().default(false), selectedOrder: z.number().int().nonnegative().optional(),
  homepageLead: z.boolean().default(false), framing: z.enum(["framed", "unframed", "not-applicable"]).optional(), condition: text.optional(),
  edition: edition.optional(), availability: availabilitySchema.default({ state: "unknown", reviewed: false }),
  film: filmSchema.optional(),
  computational: z.object({ summary: text, tools: z.array(text).default([]), links: z.array(z.object({ label: text, url: z.string().url().refine((value) => value.startsWith("https://")) }).strict()).default([]), demo: z.object({ label: text, url: z.string().url().refine((value) => value.startsWith("https://")) }).strict().optional() }).strict().optional(),
}).strict().superRefine((work, ctx) => {
  if (new Set(work.dimensions.map((size) => size.kind)).size !== work.dimensions.length) ctx.addIssue({ code: "custom", message: "Duplicate dimension kind" });
  const primaries = work.reproductions.filter((image) => image.role === "primary").length;
  if (work.reproductions.length && primaries !== 1) ctx.addIssue({ code: "custom", message: "Reproductions require exactly one primary image" });
  if (work.published && !["film", "computational"].includes(work.medium) && primaries !== 1) ctx.addIssue({ code: "custom", message: "Published visual works require a primary reproduction" });
  if (work.published && work.homepageLead && primaries !== 1) ctx.addIssue({ code: "custom", message: "Homepage lead requires a supplied primary reproduction" });
  if (work.edition && !["original-print", "reproduction"].includes(work.kind)) ctx.addIssue({ code: "custom", message: "Edition requires an editioned object kind" });
  if (work.availability.state === "edition-available" && !work.edition) ctx.addIssue({ code: "custom", message: "Edition availability requires edition facts" });
  if (work.medium === "film" && (work.kind !== "moving-image" || !work.film)) ctx.addIssue({ code: "custom", message: "Film requires moving-image metadata" });
  if (work.medium === "computational" && (work.kind !== "computational" || !work.computational)) ctx.addIssue({ code: "custom", message: "Computational work requires its own metadata" });
  if (work.film?.sources.length && work.film.embed) ctx.addIssue({ code: "custom", message: "Choose local media or one embed, not conflicting players" });
  for (const image of work.reproductions) {
    for (const variant of image.variants) {
      if (variant.width > image.width || variant.height > image.height) ctx.addIssue({ code: "custom", message: "Derivative must not upscale the source" });
      if (Math.abs(variant.width / variant.height - image.width / image.height) > 0.02) ctx.addIssue({ code: "custom", message: "Derivative changes artwork aspect ratio" });
    }
  }
});
export const projectSchema = z.object({
  ...base, date: dateSchema.optional(), description: text.optional(), memberIds: z.array(id).min(1),
}).strict().superRefine((project, ctx) => {
  if (new Set(project.memberIds).size !== project.memberIds.length) ctx.addIssue({ code: "custom", message: "Duplicate project member" });
});
export const professionalSchema = z.object({
  id, published: z.boolean().default(false), fixture: z.boolean().default(false),
  biography: z.array(text).default([]), statement: z.array(text).default([]),
  cv: z.array(z.object({ date: dateSchema, category: z.enum(["exhibition", "education", "publication", "award", "other"]), text }).strict()).default([]),
  cvPdf: asset.refine((value) => value.endsWith(".pdf")).optional(),
  contact: z.object({ email: z.string().email(), label: text, representative: text.optional() }).strict().optional(),
  acquisitionNotes: z.array(text).default([]),
}).strict();
export type Artwork = z.infer<typeof artworkSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Professional = z.infer<typeof professionalSchema>;
export type Catalogue = { artworks: Artwork[]; projects: Project[]; professional: Professional[] };

export function recordAssets(work: Artwork | Professional): string[] {
  if ("reproductions" in work) return [
    ...work.reproductions.flatMap((image) => [image.src, ...image.variants.map((variant) => variant.src)]),
    ...(work.film?.poster ? [work.film.poster] : []), ...(work.film?.sources.map((source) => source.src) ?? []),
    ...(work.film?.captions.tracks.map((track) => track.src) ?? []),
  ];
  return work.cvPdf ? [work.cvPdf] : [];
}

export function validateCatalogue(input: unknown, options: { allowFixtures?: boolean; assetExists: (url: string) => boolean }): Catalogue {
  const catalogue = z.object({ artworks: z.array(artworkSchema), projects: z.array(projectSchema), professional: z.array(professionalSchema).max(1) }).strict().parse(input);
  const all = [...catalogue.artworks, ...catalogue.projects, ...catalogue.professional];
  const ids = new Set<string>();
  for (const record of all) {
    if (ids.has(record.id)) throw new Error(`Duplicate catalogue ID: ${record.id}`);
    ids.add(record.id);
    if (!options.allowFixtures && (record.fixture || /test[ -]fixture/i.test(JSON.stringify(record)))) throw new Error("TEST FIXTURE records are forbidden in production content");
  }
  for (const entries of [catalogue.artworks, catalogue.projects]) {
    const slugs = new Set<string>();
    for (const record of entries) for (const slug of [record.slug, ...record.aliases]) {
      if (slugs.has(slug)) throw new Error(`Duplicate slug or alias: ${slug}`);
      slugs.add(slug);
    }
  }
  if (catalogue.artworks.filter((work) => isPublic(work) && work.homepageLead).length > 1) throw new Error("Only one explicit public homepage lead is allowed");
  const artworkIds = new Set(catalogue.artworks.map((work) => work.id));
  for (const project of catalogue.projects) for (const member of project.memberIds) {
    if (!artworkIds.has(member)) throw new Error(`Dangling member ${member} in ${project.id}`);
  }
  for (const record of [...catalogue.artworks, ...catalogue.professional]) for (const url of recordAssets(record)) {
    if (!options.assetExists(url)) throw new Error(`Missing or unsafe derivative: ${url}`);
  }
  return catalogue;
}

// BEGIN CANONICAL ALGORITHM: public catalogue projection
// Reference: docs/catalogue.md
export function isPublic(record: { published: boolean; fixture?: boolean }): boolean {
  return record.published === true && record.fixture !== true;
}
export function publicCatalogue(catalogue: Catalogue): Catalogue {
  const artworks = catalogue.artworks.filter(isPublic);
  const ids = new Set(artworks.map((work) => work.id));
  const projects = catalogue.projects.filter(isPublic)
    .map((project) => ({ ...project, memberIds: project.memberIds.filter((id) => ids.has(id)) }))
    .filter((project) => project.memberIds.length > 0);
  return { artworks, projects, professional: catalogue.professional.filter(isPublic) };
}
export function publicAssets(catalogue: Catalogue): string[] {
  const published = publicCatalogue(catalogue);
  return [...new Set([...published.artworks, ...published.professional].flatMap(recordAssets))];
}
// END CANONICAL ALGORITHM: public catalogue projection

export function dateLabel(date: z.infer<typeof dateSchema>): string {
  if (date.label) return date.label;
  if (date.certainty === "unknown") return "Date unknown";
  return `${date.certainty === "circa" ? "c. " : ""}${date.year}${date.endYear ? `–${date.endYear}` : ""}`;
}
export function dimensionLabel(size: z.infer<typeof dimension>): string {
  return `${size.kind}: ${size.height} × ${size.width}${size.depth ? ` × ${size.depth}` : ""} ${size.unit}`;
}
