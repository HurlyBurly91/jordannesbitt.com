import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
import { specimenSite } from "./helpers/specimen-site.mjs";
import { selectedWorks, projectMembers, relatedWorks, safeJson } from "../src/lib/presentation.ts";
import { validateCatalogue, publicCatalogue } from "../src/lib/catalogue.ts";
import { publicSpecimens } from "./fixtures/public-specimens.mjs";

test("authored selection/relationships preserve canonical order and JSON is script-safe", () => {
  const catalogue = publicCatalogue(validateCatalogue(publicSpecimens(), { assetExists: () => true }));
  assert.deepEqual(selectedWorks(catalogue.artworks).map((work) => work.id), ["specimen-landscape", "specimen-portrait"]);
  assert.deepEqual(projectMembers(catalogue.projects[0], catalogue.artworks).map((work) => work.id), ["specimen-landscape", "specimen-portrait"]);
  assert.deepEqual(relatedWorks(catalogue, "specimen-portrait").map((work) => work.id), ["specimen-landscape"]);
  assert.ok(!safeJson({ title: "</script><script>test</script>" }).includes("</script>"));
});

test("actual artwork/project templates work at 360/768/1440 with keyboard and touch", async (t) => {
  const site = await specimenSite(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  t.diagnostic(`Chromium ${browser.version()}, Linux, DPR 1, loopback synthetic site`);
  for (const width of [360, 768, 1440]) {
    await t.test(`viewport ${width}`, async () => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      for (const slug of ["specimen-portrait", "specimen-landscape", "specimen-long"]) {
        await page.goto(`${site.origin}/artwork/${slug}/`);
        await page.locator(".artwork-images img").first().waitFor();
        await page.waitForFunction(() => [...document.querySelectorAll(".artwork-images img")].every((image) => image.complete && image.naturalWidth > 0));
        assert.match(await page.locator(".fixture-banner").innerText(), /TEST FIXTURE/);
        assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
        assert.equal(await page.locator("h1").count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} reflows at ${width}`);
        const ratios = await page.locator(".artwork-images img").evaluateAll((images) => images.map((image) => ({ shown: image.clientWidth / image.clientHeight, natural: image.naturalWidth / image.naturalHeight })));
        for (const ratio of ratios) assert.ok(Math.abs(ratio.shown - ratio.natural) < 0.02, "uncropped natural ratio");
        assert.equal(await page.locator(".object-details dt").filter({ hasText: "Edition" }).count(), 0, "unsupported edition omitted");
      }
      await page.goto(`${site.origin}/projects/specimen-project/`);
      assert.deepEqual(await page.locator(".ordered-sequence h2").allTextContents(), ["Synthetic landscape specimen", "Synthetic portrait specimen"]);
      assert.doesNotMatch(await page.locator("main").innerText(), /UNPUBLISHED SENTINEL/);
      await page.goto(`${site.origin}/work/`);
      assert.deepEqual(await page.locator(".selected-work h2").allTextContents(), ["Synthetic landscape specimen", "Synthetic portrait specimen"]);
      await page.goto(`${site.origin}/artwork/specimen-portrait/`);
      assert.equal(await page.locator(".related-work a").first().getAttribute("href"), "/artwork/specimen-landscape/");
      const fullImage = page.getByRole("link", { name: /View full primary image/ });
      await fullImage.focus();
      assert.notEqual(await fullImage.evaluate((link) => getComputedStyle(link).outlineStyle), "none", "keyboard focus is visible");
      await fullImage.press("Enter");
      assert.ok(page.url().endsWith("/media/specimen/portrait-600.png"));
      await page.goBack();
      assert.ok(page.url().endsWith("/artwork/specimen-portrait/"));
      await context.close();
    });
  }
  await t.test("touch full-image link and native return", async () => {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto(`${site.origin}/artwork/specimen-landscape/`);
    await Promise.all([
      page.waitForURL("**/media/specimen/landscape-800.png"),
      page.getByRole("link", { name: /View full primary image/ }).tap(),
    ]);
    assert.ok(page.url().endsWith("/media/specimen/landscape-800.png"));
    await page.goBack();
    assert.ok(page.url().endsWith("/artwork/specimen-landscape/"));
    await context.close();
  });
  await t.test("alias compatibility preserves primary canonicals and sitemap", async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${site.origin}/artwork/specimen-former-portrait/`);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://jordannesbitt.com/artwork/specimen-portrait/");
    assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,follow");
    const sitemap = await (await fetch(`${site.origin}/sitemap-0.xml`)).text();
    assert.doesNotMatch(sitemap, /specimen-former-portrait|specimen-former-project|specimen-hidden/);
    assert.match(sitemap, /artwork\/specimen-portrait\//);
    await context.close();
  });
});
