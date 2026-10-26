// SYNTHETIC TEST FIXTURES ONLY. Never import this module from production source.
export function fixtureWork(overrides = {}) {
  return {
    id: "test-fixture-work", slug: "test-fixture-work", title: "TEST FIXTURE — not Jordan Nesbitt artwork",
    fixture: true, published: true, date: { certainty: "circa", year: 2000 }, medium: "drawing", kind: "original",
    reproductions: [{ src: "/media/fixture/portrait.png", alt: "Synthetic test rectangle", width: 600, height: 800, role: "primary" }],
    availability: { state: "unknown", reviewed: false }, ...overrides,
  };
}
export function fixtureCatalogue(overrides = {}) {
  return { artworks: [fixtureWork()], projects: [], professional: [], ...overrides };
}
