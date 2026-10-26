import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCatalogue, publicCatalogue, publicAssets, dateLabel, dimensionLabel } from "../src/lib/catalogue.ts";
import { fixtureWork, fixtureCatalogue } from "./fixtures/catalogue.mjs";

const options = { allowFixtures: true, assetExists: () => true };
const parse = (input) => validateCatalogue(input, options);
const record = (overrides = {}) => fixtureWork({ fixture: false, id: "w-001", slug: "boundary-work", title: "Synthetic boundary case", ...overrides });

test("one cross-medium catalogue handles print dimensions/editions, film and computational records", () => {
  const print = fixtureWork({ id: "test-fixture-print", slug: "test-fixture-print", medium: "printmaking", kind: "original-print", dimensions: [
    { kind: "image", width: 10, height: 20, unit: "cm" }, { kind: "sheet", width: 15, height: 25, unit: "cm" }, { kind: "framed", width: 20, height: 30, unit: "cm", depth: 2 },
  ], edition: { size: 10, number: 3, artistProofs: 2, signed: true, numbered: true }, availability: { state: "edition-available", reviewed: true, mode: "enquiry-only" } });
  const film = fixtureWork({ id: "test-fixture-film", slug: "test-fixture-film", medium: "film", kind: "moving-image", dimensions: [], reproductions: [], film: {
    poster: "/media/fixture/poster.png", runtimeSeconds: 12, sources: [{ src: "/media/fixture/film.mp4", type: "video/mp4" }], captions: { status: "not-applicable" },
  } });
  const computer = fixtureWork({ id: "test-fixture-computer", slug: "test-fixture-computer", medium: "computational", kind: "computational", dimensions: [], reproductions: [], computational: { summary: "Synthetic test computation", tools: ["Test tool"] } });
  const catalogue = parse(fixtureCatalogue({ artworks: [print, film, computer], projects: [{ id: "test-fixture-series", slug: "test-fixture-series", fixture: true, published: true, title: "TEST FIXTURE series", memberIds: [computer.id, print.id, film.id] }] }));
  assert.equal(catalogue.artworks.length, 3);
  assert.deepEqual(catalogue.projects[0].memberIds, [computer.id, print.id, film.id]);
  assert.equal(dimensionLabel(catalogue.artworks[0].dimensions[0]), "image: 20 × 10 cm");
  assert.equal(dateLabel({ certainty: "unknown" }), "Date unknown");
  assert.equal(dateLabel({ certainty: "circa", year: 2000, endYear: 2002 }), "c. 2000–2002");
});

test("reject duplicate IDs, slugs/aliases and dangling/repeated project memberships", () => {
  assert.throws(() => parse(fixtureCatalogue({ artworks: [fixtureWork(), fixtureWork()] })), /Duplicate catalogue ID/);
  assert.throws(() => parse(fixtureCatalogue({ artworks: [fixtureWork(), fixtureWork({ id: "test-fixture-second" })] })), /Duplicate slug/);
  assert.throws(() => parse(fixtureCatalogue({ artworks: [fixtureWork({ aliases: ["test-fixture-work"] })] })), /Duplicate slug/);
  assert.throws(() => parse(fixtureCatalogue({ projects: [{ id: "test-fixture-series", slug: "test-fixture-series", title: "TEST FIXTURE", memberIds: ["absent"] }] })), /Dangling member/);
  assert.throws(() => parse(fixtureCatalogue({ projects: [{ id: "test-fixture-series", slug: "test-fixture-series", title: "TEST FIXTURE", memberIds: ["test-fixture-work", "test-fixture-work"] }] })), /Duplicate project member/);
});

test("reject impossible metadata, assets, aspect changes and inconsistent offers/editions", async (t) => {
  const cases = [
    { medium: "invented-medium" }, { date: { certainty: "exact", year: 0 } }, { date: { certainty: "unknown", year: 2000 } },
    { dimensions: [{ kind: "sheet", width: -1, height: 10, unit: "cm" }] },
    { dimensions: [{ kind: "image", width: 10, height: 20, unit: "cm" }, { kind: "image", width: 10, height: 20, unit: "cm" }] },
    { edition: { size: 0 } }, { kind: "original-print", edition: { size: 5, number: 6 } },
    { availability: { state: "available", reviewed: false } },
    { availability: { state: "edition-available", reviewed: true } },
    { availability: { state: "sold", reviewed: true, mode: "price", price: { amountMinor: 100, currency: "CAD" } } },
    { availability: { state: "available", reviewed: true, mode: "price" } },
    { availability: { state: "available", reviewed: true, mode: "enquiry-only", remainingStock: 5 } },
    { reproductions: [{ src: "/media/../private.jpg", alt: "Invalid", width: 100, height: 100, role: "primary" }] },
    { reproductions: [{ src: "/media/a.jpg", alt: "", width: 100, height: 100, role: "primary" }] },
    { reproductions: [{ src: "/media/a.jpg", alt: "Square", width: 100, height: 100, role: "primary", variants: [{ src: "/media/b.jpg", width: 200, height: 100, format: "jpeg" }] }] },
    { medium: "film", kind: "moving-image", film: { runtimeSeconds: 0, captions: { status: "provided", tracks: [] } } },
    { medium: "computational", kind: "computational" },
  ];
  for (const [index, invalid] of cases.entries()) await t.test(`invalid metadata ${index + 1}`, () => assert.throws(() => parse(fixtureCatalogue({ artworks: [fixtureWork(invalid)] }))));
  assert.throws(() => validateCatalogue(fixtureCatalogue(), { allowFixtures: true, assetExists: () => false }), /Missing or unsafe derivative/);
});

test("central projection removes unpublished/fixture records, relationships and asset references", () => {
  const visible = record();
  const hidden = record({ id: "w-002", slug: "hidden-work", published: false, reproductions: [{ src: "/media/hidden.jpg", width: 100, height: 100, alt: "Synthetic unpublished image", role: "primary" }] });
  const catalogue = parse({ artworks: [visible, hidden, fixtureWork()], projects: [
    { id: "p-001", slug: "boundary-project", title: "Synthetic group", published: true, memberIds: [hidden.id, visible.id, "test-fixture-work"] },
    { id: "p-002", slug: "hidden-project", title: "Synthetic hidden group", published: true, memberIds: [hidden.id] },
  ], professional: [{ id: "profile", published: false, biography: ["UNPUBLISHED BIOGRAPHY SENTINEL"], cvPdf: "/media/hidden-cv.pdf" }] });
  const published = publicCatalogue(catalogue);
  assert.deepEqual(published.artworks.map((work) => work.id), [visible.id]);
  assert.deepEqual(published.projects.map((project) => project.memberIds), [[visible.id]]);
  assert.deepEqual(published.professional, []);
  assert.deepEqual(publicAssets(catalogue), ["/media/fixture/portrait.png"]);
  assert.ok(!JSON.stringify(published).includes("UNPUBLISHED"));
  assert.ok(!JSON.stringify(published).includes("test-fixture-work"));
});

test("production rejects fixtures even if marked unpublished or fixture flag removed", () => {
  assert.throws(() => validateCatalogue(fixtureCatalogue({ artworks: [fixtureWork({ published: false })] }), { assetExists: () => true }), /TEST FIXTURE/);
  assert.throws(() => validateCatalogue(fixtureCatalogue({ artworks: [fixtureWork({ fixture: false })] }), { assetExists: () => true }), /TEST FIXTURE/);
  assert.deepEqual(validateCatalogue({ artworks: [], projects: [], professional: [] }, { assetExists: () => false }), { artworks: [], projects: [], professional: [] });
});
