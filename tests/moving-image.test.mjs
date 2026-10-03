import assert from "node:assert/strict";
import { test } from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { specimenSite } from "./helpers/specimen-site.mjs";
import { publicSpecimens } from "./fixtures/public-specimens.mjs";
import { validateCatalogue } from "../src/lib/catalogue.ts";
import { watchReady, videoMetadata, durationLabel } from "../src/lib/moving-image.ts";
import { repository } from "./helpers/build-project.mjs";

function movingCases(data) {
  const base = data.artworks[0];
  const poster = { src: "/media/specimen/poster.png", width: 320, height: 180, role: "primary", alt: "Synthetic blue clip poster", variants: [] };
  const film = { ...base, id: "specimen-film", slug: "specimen-film", aliases: [], title: "Synthetic local film specimen", medium: "film", kind: "moving-image", reproductions: [poster], film: {
    poster: poster.src, posterInfo: { width: 320, height: 180, alt: poster.alt }, runtimeSeconds: 2,
    sources: [{ src: "/media/specimen/clip.webm", type: "video/webm" }], captions: { status: "provided", tracks: [{ src: "/media/specimen/captions.vtt", language: "en", label: "Synthetic English captions" }] },
    credits: ["Synthetic fixture generator"], transcript: "A synthetic blue rectangle remains on screen; no real artist footage.",
  } };
  const embed = { ...film, id: "specimen-embed", slug: "specimen-embed", title: "Synthetic embed specimen", film: { ...film.film, sources: [], embed: { provider: "youtube", id: "TestVideo01", consentRequired: true }, uploadDate: "2020-01-01T00:00:00Z" } };
  const computer = { ...base, id: "specimen-computer", slug: "specimen-computer", aliases: [], title: "Synthetic computational specimen", medium: "computational", kind: "computational", computational: { summary: "Static synthetic project context remains usable without the optional demo.", tools: ["Synthetic test tool"], demo: { label: "synthetic demo", url: "https://demo.example.invalid/fixture" } } };
  data.artworks.push(film, embed, computer);
  data.projects[0].memberIds.push(film.id, computer.id);
  return data;
}
async function prepare(project) {
  const path = resolve(project.root, "synthetic-clip.webm");
  await promisify(execFile)("ffmpeg", ["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=blue:s=320x180:r=10", "-t", "2", "-an", "-c:v", "libvpx-vp9", "-b:v", "40k", "-threads", "1", path]);
  await project.asset("/media/specimen/clip.webm", await readFile(path));
  await project.asset("/media/specimen/captions.vtt", Buffer.from("WEBVTT\n\n00:00.000 --> 00:02.000\nSynthetic blue rectangle.\n"));
}
test("moving-image metadata is honest, scoped to public playable objects, with validated adapters", () => {
  const data = validateCatalogue(movingCases(publicSpecimens()), { assetExists: () => true });
  const film = data.artworks.find((work) => work.id === "specimen-film");
  assert.equal(watchReady(film), true);
  const schema = videoMetadata(film, "https://jordannesbitt.com");
  assert.equal(schema.url, "https://jordannesbitt.com/artwork/specimen-film/");
  assert.equal(schema.duration, "PT2S");
  assert.equal(schema.uploadDate, undefined, "no upload date inferred from creation/build");
  assert.equal(videoMetadata({ ...film, published: false }, "https://jordannesbitt.com"), undefined);
  assert.equal(videoMetadata({ ...film, film: { ...film.film, poster: undefined } }, "https://jordannesbitt.com"), undefined);
  assert.equal(durationLabel(3661), "1:01:01");
  const invalid = movingCases(publicSpecimens());
  invalid.artworks.find((work) => work.id === "specimen-film").film.sources[0].type = "video/mp4";
  assert.throws(() => validateCatalogue(invalid, { assetExists: () => true }), /MIME type disagree/);
  const invalidEmbed = movingCases(publicSpecimens());
  invalidEmbed.artworks.find((work) => work.id === "specimen-embed").film.embed.id = "invalid";
  assert.throws(() => validateCatalogue(invalidEmbed, { assetExists: () => true }), /Invalid provider video ID/);
});

test("local playback/keyboard/captions/error and consent embeds use only local or stubbed requests", async (t) => {
  const site = await specimenSite(t, movingCases, { prepare });
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 768, height: 900 } });
  const page = await context.newPage();
  const clips = [];
  page.on("request", (request) => { if (request.url().endsWith("clip.webm")) clips.push(request.url()); });
  await page.goto(`${site.origin}/artwork/specimen-film/`);
  assert.equal(clips.length, 0, "no video transfer before action");
  assert.equal(await page.locator("video").getAttribute("preload"), "none");
  assert.equal(await page.locator("video track").count(), 1);
  assert.match(await page.locator(".transcript").innerText(), /synthetic blue rectangle/i);
  await page.getByRole("button", { name: "Play film", exact: true }).focus();
  await page.getByRole("button", { name: "Play film", exact: true }).press("Enter");
  await page.waitForFunction(() => !document.querySelector("video").paused && document.querySelector("video").readyState >= 2);
  await page.waitForFunction(() => document.querySelector("video").textTracks[0]?.cues?.length > 0);
  assert.ok(clips.length > 0);
  await page.locator("video").press("Space");
  await page.waitForFunction(() => document.querySelector("video").paused);
  assert.ok(await page.locator("video").evaluate((video) => video.controls));

  await page.route("**/media/specimen/clip.webm", (route) => route.abort());
  await page.reload();
  await page.getByRole("button", { name: "Play film", exact: true }).click();
  await page.locator("[data-media-error]:visible").waitFor();
  assert.match(await page.locator("[data-media-error]").innerText(), /could not be played/);
  assert.equal(await page.getByRole("link", { name: "Open WebM source" }).getAttribute("href"), "/media/specimen/clip.webm");

  let external = 0;
  await context.route(/https:\/\/(www\.youtube-nocookie\.com|demo\.example\.invalid)\//, (route) => { external++; return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>TEST FIXTURE stub</title><p>Local test interception, no real provider contact.</p>" }); });
  await page.goto(`${site.origin}/artwork/specimen-embed/`);
  assert.equal(external, 0);
  assert.equal(await page.locator(".external-player iframe").count(), 0);
  await page.getByRole("button", { name: "Load external player" }).press("Enter");
  await page.locator(".external-player iframe").waitFor();
  await page.waitForFunction(() => document.querySelector("[data-load-embed]").disabled);
  assert.equal(await page.locator(".external-player iframe").getAttribute("src"), "https://www.youtube-nocookie.com/embed/TestVideo01");
  await page.locator(".external-player iframe").scrollIntoViewIfNeeded();
  await page.frameLocator(".external-player iframe").getByText("Local test interception, no real provider contact.").waitFor();
  assert.equal(external, 1, "provider load was fulfilled only by the local test interception");
  await page.goto(`${site.origin}/artwork/specimen-computer/`);
  assert.match(await page.locator(".computational-context").innerText(), /Static synthetic project context/);
  assert.equal(await page.getByRole("link", { name: /Launch synthetic demo/ }).getAttribute("target"), "_blank");
  assert.equal(await page.locator('iframe[src*="demo.example"]').count(), 0);
  const [popup] = await Promise.all([context.waitForEvent("page"), page.getByRole("link", { name: /Launch synthetic demo/ }).click()]);
  await popup.getByText("Local test interception, no real provider contact.").waitFor();
  assert.equal(external, 2, "demo executes only after explicit launch, with mocked response");
  await popup.close();
  const plainContext = await browser.newContext({ javaScriptEnabled: false });
  const plain = await plainContext.newPage();
  await plain.goto(`${site.origin}/artwork/specimen-computer/`);
  assert.match(await plain.locator(".computational-context").innerText(), /Static synthetic project context/);
  await plainContext.close();
  await page.goto(`${site.origin}/film/`);
  assert.equal(await page.locator(".work-grid article").count(), 2);
  await context.close();
  t.diagnostic(`Chromium ${browser.version()}, 768x900, FFmpeg 6.1.1 synthetic VP9 2s; real third-party requests intercepted`);
});

test("actual empty output has no Film promise/menu/index or video fixture leakage", async () => {
  await assert.rejects(access(resolve(repository, "dist/film")));
  const html = await readFile(resolve(repository, "dist/index.html"), "utf8");
  assert.doesNotMatch(html, /href="\/film"|specimen-film|specimen-embed|VideoObject/);
});
