import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
import { specimenSite } from "./helpers/specimen-site.mjs";
import { selectedWorks, projectMembers, relatedWorks, safeJson } from "../src/lib/presentation.ts";
import { validateCatalogue, publicCatalogue } from "../src/lib/catalogue.ts";
import { publicSpecimens } from "./fixtures/public-specimens.mjs";
import { prepareScreenshot } from "../scripts/lib/browser-quality.mjs";
import { presentationBounds, assertPresentationBounds, exerciseInspection } from "../scripts/lib/presentation-quality.mjs";

test("authored selection/relationships preserve canonical order and JSON is script-safe", () => {
  const catalogue = publicCatalogue(validateCatalogue(publicSpecimens(), { assetExists: () => true }));
  assert.deepEqual(selectedWorks(catalogue.artworks).map((work) => work.id), ["specimen-landscape", "specimen-portrait"]);
  assert.deepEqual(projectMembers(catalogue.projects[0], catalogue.artworks).map((work) => work.id), ["specimen-landscape", "specimen-portrait"]);
  assert.deepEqual(relatedWorks(catalogue, "specimen-portrait").map((work) => work.id), ["specimen-landscape"]);
  assert.ok(!safeJson({ title: "</script><script>test</script>" }).includes("</script>"));
});

test("actual artwork/project templates work at 360/768/1440 with keyboard and touch", async (t) => {
  const site = await specimenSite(t, (data) => {
    data.artworks[1].homepageLead = true;
    data.artworks.push({ ...data.artworks[0], id: "specimen-square", slug: "specimen-square", aliases: [], title: "Synthetic square export specimen", featured: false, selectedOrder: undefined,
      reproductions: [{ src: "/media/specimen/square-600.png", width: 600, height: 600, role: "primary", alt: "Synthetic square test image, not a physical artwork shape claim", variants: [] }] });
    return data;
  });
  const browser = await chromium.launch();
  t.after(() => browser.close());
  t.diagnostic(`Chromium ${browser.version()}, Linux, DPR 1, loopback synthetic site`);
  for (const width of [360, 768, 1440]) {
    await t.test(`viewport ${width}`, async () => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      for (const slug of ["specimen-portrait", "specimen-landscape", "specimen-square", "specimen-long"]) {
        await page.goto(`${site.origin}/artwork/${slug}/`);
        await page.locator(".artwork-images img").first().waitFor();
        await prepareScreenshot(page);
        assertPresentationBounds(await presentationBounds(page));
        assert.match(await page.locator(".fixture-banner").innerText(), /TEST FIXTURE/);
        assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
        assert.equal(await page.locator("h1").count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} reflows at ${width}`);
        const ratios = await page.locator(".artwork-images img").evaluateAll((images) => images.map((image) => ({ shown: image.clientWidth / image.clientHeight, natural: image.naturalWidth / image.naturalHeight })));
        for (const ratio of ratios) assert.ok(Math.abs(ratio.shown - ratio.natural) < 0.02, "uncropped natural ratio");
        assert.equal(await page.locator(".object-details dt").filter({ hasText: "Edition" }).count(), 0, "unsupported edition omitted");
      }
      await page.goto(`${site.origin}/projects/specimen-project/`);
      await prepareScreenshot(page);
      assertPresentationBounds(await presentationBounds(page));
      assert.deepEqual(await page.locator(".ordered-sequence h2").allTextContents(), ["Synthetic landscape specimen", "Synthetic portrait specimen"]);
      assert.doesNotMatch(await page.locator("main").innerText(), /UNPUBLISHED SENTINEL/);
      await page.goto(`${site.origin}/work/`);
      await prepareScreenshot(page);
      assertPresentationBounds(await presentationBounds(page));
      assert.deepEqual(await page.locator(".selected-work h2").allTextContents(), ["Synthetic landscape specimen", "Synthetic portrait specimen"]);
      for (const path of ["/", "/archive/", "/work/drawing/"]) {
        await page.goto(`${site.origin}${path}`);
        await prepareScreenshot(page);
        assertPresentationBounds(await presentationBounds(page));
      }
      await page.goto(`${site.origin}/artwork/specimen-portrait/`);
      assert.equal(await page.locator(".related-work a").first().getAttribute("href"), "/artwork/specimen-landscape/");
      const inspection = await exerciseInspection(page);
      assert.deepEqual(inspection.accessibility.violations, [], "opened inspection accessibility");
      await context.close();
    });
  }
  await t.test("touch deliberate inspection and native no-JS image fallback", async () => {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto(`${site.origin}/artwork/specimen-landscape/`);
    assert.deepEqual((await exerciseInspection(page, { method: "tap" })).accessibility.violations, []);
    await context.close();
    const plain = await browser.newContext({ viewport: { width: 360, height: 800 }, javaScriptEnabled: false });
    const noJs = await plain.newPage();
    await noJs.goto(`${site.origin}/artwork/specimen-landscape/`);
    await Promise.all([noJs.waitForURL("**/media/specimen/landscape-800.png"), noJs.locator(".reproduction-open").click()]);
    await noJs.goBack();
    assert.ok(noJs.url().endsWith("/artwork/specimen-landscape/"));
    await plain.close();
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
