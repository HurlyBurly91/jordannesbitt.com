// SYNTHETIC TEST FIXTURES. Only load into disposable, banner-labelled test sites.
// Normal publication flags exercise the real boundary; the repository catalogue never imports these.
export function publicSpecimens() {
  const image = (name, width, height) => ({
    src: `/media/specimen/${name}-${width}.png`, alt: `Synthetic ${name} test rectangle, not actual artwork`, width, height, role: "primary",
    variants: [{ src: `/media/specimen/${name}-${width / 2}.png`, width: width / 2, height: height / 2, format: "png" }, { src: `/media/specimen/${name}-${width}.png`, width, height, format: "png" }],
  });
  const portrait = { id: "specimen-portrait", slug: "specimen-portrait", aliases: ["specimen-former-portrait"], published: true, fixture: false, title: "Synthetic portrait specimen", date: { certainty: "circa", year: 2000 }, medium: "drawing", kind: "original", featured: true, selectedOrder: 1, reproductions: [image("portrait", 600, 800)], availability: { state: "unknown", reviewed: false } };
  const landscape = { ...portrait, id: "specimen-landscape", slug: "specimen-landscape", aliases: [], title: "Synthetic landscape specimen", medium: "photography", selectedOrder: 0, reproductions: [image("landscape", 800, 500)] };
  const long = { ...portrait, id: "specimen-long", slug: "specimen-long", aliases: [], title: `Synthetic long title ${"long-title-without-spaces".repeat(12)}`, featured: false, selectedOrder: undefined, materials: `Synthetic materials ${"long metadata for reflow ".repeat(30)}`, description: "Synthetic context, not an artist statement.", dimensions: [{ kind: "image", width: 20, height: 30, unit: "cm" }, { kind: "sheet", width: 25, height: 35, unit: "cm" }], reproductions: [image("portrait", 600, 800), { ...image("landscape", 800, 500), role: "detail", caption: "Synthetic labelled detail" }] };
  const hidden = { ...portrait, id: "specimen-hidden", slug: "specimen-hidden", aliases: [], title: "UNPUBLISHED SENTINEL", published: false, reproductions: [{ ...image("portrait", 600, 800), src: "/media/specimen/hidden.png", variants: [] }] };
  const project = { id: "specimen-project", slug: "specimen-project", aliases: ["specimen-former-project"], published: true, fixture: false, title: "Synthetic ordered project specimen", description: "Synthetic cross-medium test sequence, not Jordan Nesbitt’s work.", memberIds: [landscape.id, portrait.id, hidden.id] };
  return { artworks: [portrait, landscape, long, hidden], projects: [project], professional: [] };
}
