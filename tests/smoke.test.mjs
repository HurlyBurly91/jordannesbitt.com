import assert from "node:assert/strict";
import { test } from "node:test";
import { startPreview } from "./helpers/preview.mjs";

const routes = [
  "/", "/work/", "/archive/", "/about/",
  "/work/drawing/", "/work/painting/", "/work/printmaking/",
  "/work/photography/", "/work/aerial/", "/work/film/",
];

test("built baseline routes and assets respond through the actual Astro preview", async (t) => {
  const preview = await startPreview();
  t.after(preview.stop);
  const assets = new Set(["/favicon.svg", "/sitemap-index.xml"]);
  for (const route of routes) {
    await t.test(route, async () => {
      const response = await fetch(`${preview.origin}${route}`);
      assert.equal(response.status, 200, route);
      assert.match(response.headers.get("content-type"), /text\/html/);
      const html = await response.text();
      assert.match(html, /<html\b[^>]*lang="en"/);
      assert.match(html, /<title>[^<]*Jordan Nesbitt<\/title>/);
      assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length, 1, "one page heading");
      assert.match(html, /<main\b[^>]*id="main"/);
      assert.match(html, /href="#main"[^>]*>Skip to content/);
      assert.equal(html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1], `https://jordannesbitt.com${route}`);
      const person = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
        .map((match) => JSON.parse(match[1])).find((item) => item["@type"] === "Person");
      assert.equal(person?.name, "Jordan Nesbitt");
      for (const match of html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)) assets.add(match[1]);
    });
  }
  await t.test("referenced static assets and sitemap are present", async () => {
    for (const asset of assets) {
      const response = await fetch(`${preview.origin}${asset}`);
      assert.equal(response.status, 200, asset);
      assert.ok((await response.text()).length > 0, asset);
    }
    const index = await (await fetch(`${preview.origin}/sitemap-index.xml`)).text();
    const location = index.match(/<loc>(.*?)<\/loc>/)?.[1];
    assert.ok(location, "sitemap index references a sitemap");
    const sitemap = await (await fetch(`${preview.origin}${new URL(location).pathname}`)).text();
    for (const route of routes) assert.ok(sitemap.includes(`https://jordannesbitt.com${route}`), route);
  });
  await t.test("unknown route returns 404 rather than the homepage", async () => {
    const response = await fetch(`${preview.origin}/artwork/m01-nonexistent-record/`);
    assert.equal(response.status, 404);
  });
});
