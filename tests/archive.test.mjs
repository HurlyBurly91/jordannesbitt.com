import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
import { specimenSite } from "./helpers/specimen-site.mjs";
import { publicSpecimens } from "./fixtures/public-specimens.mjs";
import { validateCatalogue } from "../src/lib/catalogue.ts";
import { searchEntries } from "../src/lib/search.ts";
import { defaultFilters, readFilters, filterEntries, filterQuery } from "../src/lib/archive.ts";

function archiveCases(data) {
  data.artworks[0].techniques = ["Synthetic watercolour study"];
  data.artworks[0].availability = { state: "available", reviewed: true, mode: "enquiry-only" };
  data.artworks[1].date = { certainty: "exact", year: 1990 };
  data.artworks[1].availability = { state: "sold", reviewed: true };
  data.artworks[2].date = { certainty: "unknown" };
  return data;
}
test("text/facets combine, dates sort honestly, invalid URL state normalizes and index is public-only", () => {
  const entries = searchEntries(validateCatalogue(archiveCases(publicSpecimens()), { assetExists: () => true }));
  assert.equal(entries.length, 3);
  assert.doesNotMatch(JSON.stringify(entries), /UNPUBLISHED SENTINEL|specimen-hidden/);
  const filters = readFilters(new URLSearchParams("q=SYNTHETIC+wátercolour&medium=drawing&series=specimen-project&year=2000&availability=available&sort=oldest"), entries);
  assert.deepEqual(filterEntries(entries, filters).map((entry) => entry.id), ["specimen-portrait"]);
  assert.match(filterQuery(filters), /series=specimen-project/);
  assert.equal(filterEntries(entries, { ...defaultFilters, q: "no-such-synthetic-record" }).length, 0);
  assert.equal(filterEntries(entries, { ...defaultFilters, sort: "oldest" }).at(-1).year, undefined);
  assert.equal(readFilters(new URLSearchParams("medium=bad&series=private&year=0&sort=price"), entries).sort, "newest");
});

test("archive browser filters/reset/history/restoration/keyboard/no-JS and category visibility", async (t) => {
  const site = await specimenSite(t, archiveCases);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${site.origin}/archive/`);
  await page.getByRole("button", { name: "Apply filters" }).waitFor();
  assert.equal(await page.locator(".archive-entry:visible").count(), 3);
  await page.getByLabel("Search", { exact: true }).fill("watercolour");
  await page.getByLabel("Medium", { exact: true }).selectOption("drawing");
  await page.getByLabel("Project / series", { exact: true }).selectOption("specimen-project");
  await page.getByLabel("Year", { exact: true }).selectOption("2000");
  await page.getByLabel("Availability", { exact: true }).selectOption("available");
  await page.getByLabel("Sort", { exact: true }).selectOption("oldest");
  await page.getByLabel("Search", { exact: true }).press("Enter");
  assert.equal(await page.locator(".archive-entry:visible").count(), 1);
  assert.equal(await page.locator("[data-result-count]").innerText(), "1 result of 3 published works");
  assert.equal(new URL(page.url()).searchParams.get("series"), "specimen-project");
  await page.goBack();
  assert.equal(await page.locator(".archive-entry:visible").count(), 3);
  await page.goForward();
  assert.equal(await page.getByLabel("Search", { exact: true }).inputValue(), "watercolour");
  assert.equal(await page.locator(".archive-entry:visible").count(), 1);
  await page.getByRole("button", { name: "Reset filters" }).click();
  assert.equal(await page.locator(".archive-entry:visible").count(), 3);
  assert.equal(new URL(page.url()).search, "");
  await page.getByLabel("Search", { exact: true }).fill("no-such-synthetic-record");
  await page.getByLabel("Search", { exact: true }).press("Enter");
  assert.equal(await page.locator(".archive-entry:visible").count(), 0);
  assert.match(await page.locator("[data-no-results]").innerText(), /No works match/);
  await page.goto(`${site.origin}/archive/?medium=photography&sort=oldest`);
  assert.equal(await page.locator(".archive-entry:visible").count(), 1);
  assert.equal(await page.getByLabel("Medium", { exact: true }).inputValue(), "photography");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  assert.deepEqual(await page.locator('select[name="medium"] option').allTextContents(), ["All media", "Drawing", "Photography"]);
  const index = await (await fetch(`${site.origin}/search-index.json`)).json();
  assert.equal(index.length, 3);
  assert.doesNotMatch(JSON.stringify(index), /UNPUBLISHED SENTINEL|specimen-hidden/);
  await context.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const plain = await noJs.newPage();
  await plain.goto(`${site.origin}/archive/`);
  assert.equal(await plain.locator(".archive-entry").count(), 3);
  assert.match(await plain.locator(".no-script").innerText(), /all published works remain available/i);
  assert.equal(await plain.getByRole("button", { name: "Apply filters" }).isDisabled(), true);
  await plain.locator(".archive-object").first().click();
  assert.ok(plain.url().includes("/artwork/"));
  await noJs.close();
  t.diagnostic(`Chromium ${browser.version()}, 360x800, public synthetic index=3; hidden sentinel excluded; no-JS links pass`);
});

test("separate 1,000-record synthetic scaling exercise records build/runtime without real-art counts", async (t) => {
  const site = await specimenSite(t, (data) => ({ ...data, projects: [], artworks: Array.from({ length: 1000 }, (_, index) => ({
    ...data.artworks[0], id: `scale-${String(index).padStart(5, "0")}`, slug: `scale-${String(index).padStart(5, "0")}`,
    aliases: [], title: `Synthetic scale sample ${String(index).padStart(5, "0")}`, featured: false, selectedOrder: undefined,
    date: { certainty: "exact", year: 1990 + index % 30 },
  })) }));
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 768, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${site.origin}/archive/`);
  await page.waitForFunction(() => !document.querySelector("fieldset").disabled);
  assert.equal(await page.locator(".archive-entry:visible").count(), 1000);
  const start = performance.now();
  await page.getByLabel("Search", { exact: true }).fill("sample 00999");
  await page.getByLabel("Search", { exact: true }).press("Enter");
  assert.equal(await page.locator(".archive-entry:visible").count(), 1);
  const runtimeMs = performance.now() - start;
  t.diagnostic(JSON.stringify({ syntheticRecords: 1000, realArtworkCountClaimed: false, buildMs: Math.round(site.buildMs), filterInteractionMs: Math.round(runtimeMs), browser: browser.version(), viewport: "768x900", dpr: 1, network: "loopback/unthrottled", runs: 1, limitation: "shared flat synthetic images and warm local tooling; not field performance or actual art transfer" }));
  await context.close();
});
