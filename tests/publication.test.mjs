import assert from "node:assert/strict";
import { test } from "node:test";
import { readdir, readFile, access, symlink, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { isolatedProject, repository } from "./helpers/build-project.mjs";
import { fixtureWork } from "./fixtures/catalogue.mjs";
import { readCatalogue, emitPublicMedia } from "../src/lib/catalogue-source.ts";

async function outputText(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => entry.isDirectory() ? outputText(resolve(root, entry.name)) : /\.(html|json|js|xml|txt)$/.test(entry.name) ? readFile(resolve(root, entry.name), "utf8") : ""))).join("\n");
}
test("real production output contains no fixtures, unpublished sentinel or artwork routes", async () => {
  assert.deepEqual(readCatalogue(repository), { artworks: [], projects: [], professional: [] });
  assert.doesNotMatch(await outputText(resolve(repository, "dist")), /TEST FIXTURE|test-fixture-|UNPUBLISHED SENTINEL/);
  assert.doesNotMatch(await readFile(resolve(repository, ".astro/cache/data-store.json"), "utf8"), /specimen-|test-fixture-|scale-|UNPUBLISHED SENTINEL/, "fixture builds cannot contaminate the real content cache");
  await assert.rejects(access(resolve(repository, "dist/artwork")));
  await assert.rejects(access(resolve(repository, "dist/media")));
});

test("isolated full builds gate unpublished routes/JSON/sitemap/assets and reject fixtures/duplicates", async (t) => {
  const project = await isolatedProject(t);
  const hidden = fixtureWork({ fixture: false, published: false, id: "w-unpublished", slug: "boundary-unpublished", title: "UNPUBLISHED SENTINEL", reproductions: [{ src: "/media/hidden.png", width: 100, height: 100, role: "primary", alt: "Synthetic boundary asset" }] });
  await project.content("artworks", [hidden]);
  await project.asset("/media/hidden.png");
  let result = await project.build();
  assert.equal(result.code, 0, result.output);
  assert.doesNotMatch(await outputText(resolve(project.root, "dist")), /UNPUBLISHED SENTINEL|boundary-unpublished|w-unpublished/);
  await assert.rejects(access(resolve(project.root, "dist/media/hidden.png")));
  await assert.rejects(access(resolve(project.root, "dist/artwork/boundary-unpublished")));

  await project.content("artworks", [fixtureWork()]);
  result = await project.build();
  assert.notEqual(result.code, 0, "fixture input must fail, not only be omitted");
  assert.match(result.output, /TEST FIXTURE/);
  await project.content("artworks", [hidden, hidden]);
  result = await project.build();
  assert.notEqual(result.code, 0, "duplicate input must fail before loader overwrite");
  assert.match(result.output, /Duplicate catalogue ID/);
});

test("unsafe media roots and missing/symlinked derivatives are rejected", async (t) => {
  const project = await isolatedProject(t);
  const hidden = fixtureWork({ fixture: false, published: false, id: "w-boundary", slug: "boundary-work", title: "Synthetic missing-asset case", reproductions: [{ src: "/media/missing.png", width: 100, height: 100, role: "primary", alt: "Synthetic asset" }] });
  await project.content("artworks", [hidden]);
  assert.throws(() => readCatalogue(project.root), /Missing or unsafe/);
  await mkdir(resolve(project.root, "src/media"), { recursive: true });
  await symlink(resolve(project.root, "public/favicon.svg"), resolve(project.root, "src/media/missing.png"));
  assert.throws(() => readCatalogue(project.root), /Missing or unsafe/);
  await mkdir(resolve(project.root, "public/media"));
  assert.throws(() => readCatalogue(project.root), /never copied wholesale/);
});

test("derivative emission copies the public asset once and omits hidden/orphan assets", async (t) => {
  const project = await isolatedProject(t);
  const visible = fixtureWork({ fixture: false, id: "w-public", slug: "boundary-public", title: "Synthetic asset-boundary case", reproductions: [{ src: "/media/visible.png", width: 100, height: 100, role: "primary", alt: "Synthetic asset" }] });
  const hidden = { ...visible, id: "w-hidden", slug: "boundary-hidden", published: false, reproductions: [{ ...visible.reproductions[0], src: "/media/hidden.png" }] };
  await project.content("artworks", [visible, hidden]);
  for (const url of ["/media/visible.png", "/media/hidden.png", "/media/orphan.png"]) await project.asset(url);
  const output = resolve(project.root, "emission-check");
  emitPublicMedia(project.root, output);
  assert.deepEqual(await readdir(resolve(output, "media")), ["visible.png"]);
  assert.equal(await readFile(resolve(output, "media/visible.png"), "utf8"), "synthetic boundary asset");
});
