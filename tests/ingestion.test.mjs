import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, rm, writeFile, readFile, access, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";
import { ingest, checksum } from "../scripts/lib/ingestion.mjs";
import { startIntakePreview } from "../scripts/lib/intake-preview.mjs";

async function setup(t, image) {
  const root = await mkdtemp("/tmp/opencode/jordannesbitt-ingest-");
  t.after(() => rm(root, { recursive: true, force: true }));
  const input = resolve(root, "explicit-synthetic-input.png");
  await writeFile(input, image ?? await sharp({ create: { width: 420, height: 280, channels: 3, background: "#4080b0" } }).png().toBuffer());
  return { root, input, options: { input, output: resolve(root, "intake"), id: "test-fixture-intake", title: "TEST FIXTURE — synthetic swatch", alt: "Synthetic blue test swatch", medium: "drawing", assumeSrgb: true, fixture: true } };
}

test("dry-run has no output and missing metadata must be acknowledged explicitly", async (t) => {
  const { input, options } = await setup(t);
  const before = checksum(await readFile(input));
  assert.equal((await ingest({ ...options, dryRun: true })).status, "dry-run");
  await assert.rejects(access(options.output));
  await assert.rejects(ingest({ ...options, assumeSrgb: false }), /Missing ICC/);
  await assert.rejects(ingest({ ...options, title: undefined }), /explicit required/);
  await assert.rejects(ingest({ ...options, output: process.cwd() }), /public checkout/);
  assert.equal(checksum(await readFile(input)), before);
});

test("repeat intake reuses verified derivatives and retains reviewed metadata; conflicts/corruption fail", async (t) => {
  const { input, options } = await setup(t);
  const sourceHash = checksum(await readFile(input));
  const first = await ingest(options);
  assert.equal(first.status, "created");
  assert.equal(first.draft.published, false);
  const directory = resolve(options.output, options.id);
  const record = { ...first.draft, title: "TEST FIXTURE — reviewed title retained", description: "Synthetic review edit", availability: { state: "not-for-sale", reviewed: true } };
  await writeFile(resolve(directory, "record.json"), JSON.stringify(record));
  const repeat = await ingest({ ...options, title: "TEST FIXTURE — caller change must not overwrite review" });
  assert.equal(repeat.status, "cached");
  assert.equal(repeat.draft.title, record.title);
  const manifest = JSON.parse(await readFile(resolve(directory, "manifest.json"), "utf8"));
  await writeFile(resolve(directory, manifest.files[0].name), "corrupt synthetic derivative");
  await assert.rejects(ingest(options), /Cached derivative/);
  assert.equal(checksum(await readFile(input)), sourceHash);
  await writeFile(input, await sharp({ create: { width: 420, height: 280, channels: 3, background: "red" } }).png().toBuffer());
  await assert.rejects(ingest(options), /collision/);
  assert.equal(JSON.parse(await readFile(resolve(directory, "record.json"), "utf8")).title, record.title);
});

test("orientation/profile conversion strips private metadata and never upscales", async (t) => {
  const image = await sharp({ create: { width: 120, height: 240, channels: 3, background: "#4080b0" } })
    .withMetadata({ orientation: 6 }).withIccProfile("p3").withExif({ IFD0: { Make: "PRIVATE SYNTHETIC DEVICE", Model: "PRIVATE MODEL", Artist: "UNAPPROVED CREATOR" } }).jpeg({ quality: 100 }).toBuffer();
  const { input, options } = await setup(t, image);
  const original = await sharp(image).metadata();
  assert.ok(original.icc);
  assert.equal(original.orientation, 6);
  const sourceHash = checksum(image);
  const result = await ingest({ ...options, assumeSrgb: false, creator: "Approved synthetic creator", rights: "Synthetic test rights" });
  assert.equal(result.sourceWidth, 240);
  assert.equal(result.sourceHeight, 120);
  const manifest = JSON.parse(await readFile(resolve(options.output, options.id, "manifest.json"), "utf8"));
  assert.deepEqual(new Set(manifest.files.map((file) => file.format)), new Set(["jpeg", "webp", "avif"]));
  for (const file of manifest.files) {
    const metadata = await sharp(resolve(options.output, options.id, file.name)).metadata();
    assert.equal(metadata.width, 240);
    assert.equal(metadata.height, 120);
    assert.ok(metadata.icc, "output has an intentional sRGB profile");
    assert.doesNotMatch(metadata.exif?.toString("latin1") ?? "", /PRIVATE SYNTHETIC|PRIVATE MODEL|UNAPPROVED CREATOR/);
    assert.match(metadata.exif?.toString("latin1") ?? "", /Approved synthetic creator/);
    const pixel = await sharp(resolve(options.output, options.id, file.name)).toColourspace("srgb").removeAlpha().raw().toBuffer();
    for (const [index, expected] of [64, 128, 176].entries()) assert.ok(Math.abs(pixel[index] - expected) <= 12, `${file.format} synthetic colour conversion`);
  }
  assert.equal(checksum(await readFile(input)), sourceHash);
});

test("different aspect ratios produce bounded derivatives and failed processing cleans staging", async (t) => {
  for (const [width, height] of [[800, 1200], [1200, 800], [500, 500]]) {
    const { input, options } = await setup(t, await sharp({ create: { width, height, channels: 3, background: "#aa7040" } }).png().toBuffer());
    const result = await ingest(options);
    for (const variant of result.draft.reproductions[0].variants) {
      assert.ok(variant.width <= width && variant.height <= height);
      assert.ok(Math.abs(variant.width / variant.height - width / height) < 0.01);
    }
    assert.equal(result.sourceSha256, checksum(await readFile(input)));
  }
  const { input, options } = await setup(t);
  const before = checksum(await readFile(input));
  await assert.rejects(ingest(options, { encode: async (_bytes, path) => { await writeFile(path, "interrupted synthetic encoder output"); throw new Error("Synthetic interrupted processing"); } }), /interrupted processing/);
  assert.deepEqual(await readdir(options.output), []);
  assert.equal(checksum(await readFile(input)), before);
  await writeFile(input, "invalid synthetic image");
  await assert.rejects(ingest(options));
  assert.deepEqual(await readdir(options.output), []);
});

test("isolated import-to-loopback-preview exercise serves only labelled reviewed derivatives", async (t) => {
  const { options } = await setup(t);
  const { stdout } = await promisify(execFile)(process.execPath, [
    fileURLToPath(new URL("../scripts/ingest.mjs", import.meta.url)),
    "--input", options.input, "--output", options.output, "--id", options.id, "--title", options.title,
    "--medium", options.medium, "--alt", options.alt, "--assume-srgb", "--fixture",
  ]);
  const result = JSON.parse(stdout);
  assert.equal(result.status, "created", "exercise uses the actual CLI, not only its API");
  const preview = await startIntakePreview(resolve(options.output, options.id));
  t.after(preview.stop);
  const response = await fetch(preview.origin);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /TEST FIXTURE — synthetic media/);
  assert.doesNotMatch(html, /Jordan Nesbitt/);
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
  const image = await fetch(`${preview.origin}${result.draft.reproductions[0].src}`);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get("content-type"), "image/jpeg");
  assert.equal((await sharp(Buffer.from(await image.arrayBuffer())).metadata()).width, 420);
  assert.equal((await fetch(`${preview.origin}/media/not-selected.jpg`)).status, 404);
});
