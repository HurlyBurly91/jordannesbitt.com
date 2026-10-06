import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink, readdir, lstat } from "node:fs/promises";
import { resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { request as httpRequest } from "node:http";
import sharp from "sharp";
import { chromium } from "playwright";
import { isolatedProject } from "./helpers/build-project.mjs";
import { openStudio } from "../scripts/lib/studio-store.mjs";
import { startStudio } from "../scripts/lib/studio-server.mjs";
import { buildStudioPreview, openStudioPreview } from "../scripts/lib/studio-preview.mjs";
import { prepareExport, executeExport } from "../scripts/lib/studio-export.mjs";
import { checksum } from "../scripts/lib/ingestion.mjs";
import { readCatalogue } from "../src/lib/catalogue-source.ts";

async function rawRequest(origin, path, headers = {}) {
  const url = new URL(origin);
  return new Promise((done, reject) => {
    const request = httpRequest({ hostname: "127.0.0.1", port: url.port, path, headers }, (response) => { response.resume(); response.on("end", () => done(response.statusCode)); });
    request.on("error", reject); request.end();
  });
}

async function setup(t, options = {}) {
  const project = await isolatedProject(t);
  await promisify(execFile)("git", ["init", "-b", "redesign/astro-foundation"], { cwd: project.root });
  const dataRoot = await mkdtemp("/tmp/opencode/jordannesbitt-studio-test-");
  t.after(() => rm(dataRoot, { recursive: true, force: true }));
  await writeFile(resolve(dataRoot, "id-registry.json"), JSON.stringify({ version: 1, sourceRoot: dataRoot, next: 1, entries: {} }));
  return { project, dataRoot, options: { repository: project.root, dataRoot, testMode: true, allowPublicExport: true, ...options } };
}
async function add(studio, name = "source.png", purpose = "artwork", extra = {}) {
  const bytes = await sharp({ create: { width: 64, height: 80, channels: 3, background: "#406070" } }).png().toBuffer();
  const jobId = await studio.intake(bytes, { name, purpose, assumeSrgb: true, sha256: checksum(bytes), ...extra });
  await studio.waitForJobs();
  const job = studio.state().jobs.find((job) => job.id === jobId);
  assert.equal(job.status, "complete", job.error);
  return { ...job.result, bytes };
}
async function edit(studio, id, changes = {}) {
  const work = studio.state().catalogue.artworks.find((work) => work.id === id);
  return studio.saveArtwork(id, { ...work, title: `Synthetic studio artwork ${id}`, medium: "drawing", kind: "original", reproductions: work.reproductions.map((image) => ({ ...image, alt: "Synthetic rectangle for local workflow verification" })), ...changes }, "PRIVATE NOTE MUST NOT BE EXPORTED");
}
async function approved(studio, ids) {
  await buildStudioPreview(studio);
  for (const id of ids) { await studio.markReviewed(id); await studio.approve(id, { confirmation: "APPROVE PUBLIC SOURCE", rightsConfirmed: true }); }
}

test("studio canonical drafts, explicit identity/media/order/curation and ID continuity round-trip privately", async (t) => {
  const { project, dataRoot, options } = await setup(t);
  const studio = await openStudio(options); t.after(() => studio.close());
  const one = await add(studio), two = await add(studio, "same-bytes-separate-art.png");
  assert.notEqual(one.artworkId, two.artworkId, "identical pixels do not silently merge owner identities");
  const sourceFile = resolve(dataRoot, "explicit-original.png"); await writeFile(sourceFile, one.bytes);
  const originalHash = checksum(await readFile(sourceFile));
  const detail = await add(studio, "detail.png", "attach", { artworkId: one.artworkId, role: "detail" });
  assert.equal(detail.artworkId, one.artworkId);
  assert.equal(studio.state().catalogue.artworks[0].reproductions[1].role, "detail");
  assert.equal(studio.state().catalogue.artworks[1].reproductions.length, 1, "view attaches only to intended artwork");
  const reference = await add(studio, "reference.png", "media");
  assert.equal(reference.artworkId, null);
  assert.equal(studio.state().catalogue.artworks.length, 2, "reference does not become artwork");
  await edit(studio, one.artworkId); await edit(studio, two.artworkId);
  await assert.rejects(edit(studio, two.artworkId, { slug: studio.state().catalogue.artworks[0].slug }), /Duplicate slug/);
  await assert.rejects(studio.saveArtwork(one.artworkId, { ...studio.state().catalogue.artworks[0], id: two.artworkId }), /immutable/);
  await assert.rejects(edit(studio, one.artworkId, { date: { certainty: "exact" } }), /Exact\/circa/);
  const projectRecord = await studio.saveProject({ title: "Synthetic ordered project", date: { certainty: "circa", year: 2000, endYear: 2002 }, memberIds: [two.artworkId, one.artworkId], published: false });
  await assert.rejects(studio.saveProject({ ...projectRecord, memberIds: [one.artworkId, one.artworkId] }), /Duplicate project member/);
  await studio.curate({ selectedIds: [two.artworkId, one.artworkId], homepageLeadId: two.artworkId });
  await assert.rejects(edit(studio, one.artworkId, { homepageLead: true }), /Only one homepage/);
  assert.equal(checksum(await readFile(sourceFile)), originalHash);
  assert.deepEqual(readCatalogue(project.root).artworks, [], "private intended curation cannot reach production input");
  await studio.close();
  const reopened = await openStudio(options); t.after(() => reopened.close());
  assert.deepEqual(reopened.state().catalogue.projects[0].memberIds, [two.artworkId, one.artworkId]);
  assert.deepEqual(reopened.state().catalogue.artworks.filter((work) => work.featured).sort((a,b) => a.selectedOrder-b.selectedOrder).map((work) => work.id), [two.artworkId, one.artworkId]);
  assert.equal(reopened.state().catalogue.artworks.filter((work) => work.homepageLead).length, 1);
  assert.equal(JSON.parse(await readFile(resolve(dataRoot, "id-registry.json"))).next, 3);
});

test("studio preview uses actual components while private state never enters production routes/search/sitemap", async (t) => {
  const { project, options } = await setup(t);
  const studio = await openStudio(options); t.after(() => studio.close());
  const { artworkId } = await add(studio);
  await edit(studio, artworkId); await studio.curate({ selectedIds: [artworkId], homepageLeadId: artworkId });
  await assert.rejects(studio.markReviewed(artworkId), /current preview/);
  const preview = await buildStudioPreview(studio);
  assert.ok(preview.directory.startsWith(studio.root));
  const local = await openStudioPreview(studio, preview.id); t.after(local.stop);
  const page = await fetch(local.origin + `/artwork/${artworkId}/`);
  assert.equal(page.status, 200); assert.match(await page.text(), /PRIVATE LOCAL DRAFT/);
  assert.equal(await rawRequest(local.origin, "/", { Host: "evil.invalid" }), 403);
  assert.equal((await fetch(local.origin + "/", { headers: { Origin: "https://evil.invalid" } })).status, 403);
  assert.equal((await fetch(local.origin + "/%2e%2e%2fstate.json")).status, 404);
  await studio.markReviewed(artworkId);
  await assert.rejects(studio.approve(artworkId, { confirmation: "APPROVE PUBLIC SOURCE", rightsConfirmed: false }), /rights/);
  await studio.approve(artworkId, { confirmation: "APPROVE PUBLIC SOURCE", rightsConfirmed: true });
  await edit(studio, artworkId, { title: "Changed after approval" });
  assert.equal(studio.state().workflow[artworkId].approved, null, "edits revoke exact source approval");
  const built = await project.build(); assert.equal(built.code, 0, built.output);
  assert.deepEqual(JSON.parse(await readFile(resolve(project.root, "dist/search-index.json"))), []);
  assert.doesNotMatch(await readFile(resolve(project.root, "dist/sitemap-0.xml"), "utf8"), new RegExp(artworkId));
  assert.doesNotMatch(await readFile(resolve(project.root, "dist/index.html"), "utf8"), /Changed after approval|PRIVATE NOTE/);
});

test("public export is dry-run, requires independent approval/write grant, produces exact approved source and rolls back own failures", async (t) => {
  const { project, options } = await setup(t);
  const studio = await openStudio(options); t.after(() => studio.close());
  const { artworkId } = await add(studio);
  await edit(studio, artworkId, { published: true });
  await assert.rejects(prepareExport(studio, { artworkIds: [artworkId] }), /approval/);
  await approved(studio, [artworkId]);
  const before = await readFile(resolve(project.root, "src/content/artworks.json"));
  let plan = await prepareExport(studio, { artworkIds: [artworkId] });
  assert.deepEqual(await readFile(resolve(project.root, "src/content/artworks.json")), before);
  assert.equal(plan.dryRun, true);
  assert.ok(plan.files.every((file) => /^src\/(content|media)\//.test(file.path)));
  await assert.rejects(executeExport(studio, { token: plan.token, confirmation: "EXPORT" }), /exact displayed/);
  await assert.rejects(executeExport(studio, { token: plan.token, confirmation: `EXPORT ${plan.token}` }, { afterWrite: () => { throw new Error("Injected interruption"); } }), /rolled back/);
  assert.deepEqual(await readFile(resolve(project.root, "src/content/artworks.json")), before);
  plan = await prepareExport(studio, { artworkIds: [artworkId] });
  const result = await executeExport(studio, { token: plan.token, confirmation: `EXPORT ${plan.token}` });
  assert.equal(result.deploymentAuthorized, false); assert.equal(result.launchManifestCreated, false);
  const publicRecord = readCatalogue(project.root).artworks[0];
  assert.deepEqual(publicRecord, studio.state().catalogue.artworks[0]);
  const raw = await readFile(resolve(project.root, "src/content/artworks.json"), "utf8");
  assert.doesNotMatch(raw, /PRIVATE NOTE|sourceSha256|reviewedLocally|approvedAt|uploads/);
  for (const file of plan.files.filter((file) => file.kind === "derivative")) assert.equal(checksum(await readFile(resolve(project.root, file.path))), file.sha256);
  await studio.close();
  const disabled = await openStudio({ ...options, allowPublicExport: false }); t.after(() => disabled.close());
  await assert.rejects(executeExport(disabled, { token: plan.token, confirmation: `EXPORT ${plan.token}` }), /writes are disabled/);
});

test("export detects stale public inputs, wrong branch and symlink targets without overwriting anything", async (t) => {
  const { project, dataRoot, options } = await setup(t);
  const studio = await openStudio(options); t.after(() => studio.close());
  const { artworkId } = await add(studio); await edit(studio, artworkId, { published: true }); await approved(studio, [artworkId]);
  const plan = await prepareExport(studio, { artworkIds: [artworkId] });
  await writeFile(resolve(project.root, "src/content/artworks.json"), "[ ]\n");
  await assert.rejects(executeExport(studio, { token: plan.token, confirmation: `EXPORT ${plan.token}` }), /changed after dry-run/);
  assert.equal(await readFile(resolve(project.root, "src/content/artworks.json"), "utf8"), "[ ]\n");
  await promisify(execFile)("git", ["symbolic-ref", "HEAD", "refs/heads/master"], { cwd: project.root });
  await assert.rejects(executeExport(studio, { token: plan.token, confirmation: `EXPORT ${plan.token}` }), /never master/);
  const outside = resolve(dataRoot, "outside-media"); await mkdir(outside);
  await symlink(outside, resolve(project.root, "src/media"), "dir");
  await assert.rejects(prepareExport(studio, { artworkIds: [artworkId] }), /Symlink/);
});

test("loopback server rejects forged host/origin/token/traversal and invalid intake; interrupted jobs never become completed items", async (t) => {
  const { options } = await setup(t, { allowPublicExport: false });
  const service = await startStudio(options); t.after(() => service.stop());
  assert.equal(service.server.address().address, "127.0.0.1");
  const session = await (await fetch(service.origin + "/api/session")).json();
  assert.equal(session.repositoryWritesEnabled, false);
  assert.equal((await fetch(service.origin + "/api/state")).status, 403);
  assert.equal(await rawRequest(service.origin, "/api/session", { Host: "evil.invalid" }), 403);
  assert.equal((await fetch(service.origin + "/api/session", { headers: { Origin: "https://evil.invalid" } })).status, 403);
  assert.equal((await fetch(service.origin + "/api/session", { headers: { "Sec-Fetch-Site": "cross-site" } })).status, 403);
  const headers = { "x-studio-token": session.token };
  assert.equal((await fetch(service.origin + "/%2e%2e%2fsecret.json", { headers })).status, 400);
  const bad = await fetch(service.origin + "/api/intake", { method: "POST", headers: { ...headers, "x-studio-options": encodeURIComponent(JSON.stringify({ name: "../secret.jpg", purpose: "artwork", assumeSrgb: true })) }, body: Buffer.from("bad") });
  assert.equal(bad.status, 400);
  const jobId = await service.studio.intake(Buffer.from("not an image"), { name: "corrupt.jpg", purpose: "artwork", assumeSrgb: true });
  await service.studio.waitForJobs();
  assert.equal(service.studio.state().jobs.find((job) => job.id === jobId).status, "error");
  assert.equal(service.studio.state().catalogue.artworks.length, 0);
  await service.studio.transact((state) => { state.jobs.push({ id: "interrupted", status: "running" }); });
  await service.stop();
  const recovered = await openStudio(options); t.after(() => recovered.close());
  assert.equal(recovered.state().jobs.find((job) => job.id === "interrupted").status, "error");
  assert.equal(recovered.state().catalogue.artworks.length, 0);
});

test("local browser add/edit/project/curation/preview/review/approval/dry-run workflow is usable without hand-built JSON", async (t) => {
  const { dataRoot, options } = await setup(t, { allowPublicExport: false });
  const original = resolve(dataRoot, "explicit-browser-source.png");
  await writeFile(original, await sharp({ create: { width: 64, height: 80, channels: 3, background: "#407080" } }).png().toBuffer());
  const originalBytes = await readFile(original);
  const service = await startStudio(options); t.after(() => service.stop());
  const browser = await chromium.launch(); t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(service.origin);
  await page.getByText(/Private local Studio ready/).waitFor();
  await page.locator("#files").setInputFiles(original);
  await page.locator("#intake-purpose").selectOption("artwork");
  await page.locator("#assume-srgb").check();
  await page.getByRole("button", { name: "Generate private derivatives", exact: true }).click();
  await page.locator("#jobs").getByText(/COMPLETE/).waitFor();
  await page.locator(".work-entry").first().click();
  await page.getByLabel("Title", { exact: true }).fill("Synthetic browser-authored artwork");
  await page.getByLabel("Medium", { exact: true }).selectOption("drawing");
  await page.getByLabel("Object kind", { exact: true }).selectOption("original");
  await page.getByLabel("Alt text", { exact: true }).fill("Synthetic rectangle used to verify browser authoring");
  await page.getByRole("button", { name: "Save private artwork", exact: true }).click();
  await page.getByText(/Saved private artwork\./).waitFor();
  const id = service.studio.state().catalogue.artworks[0].id;
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await page.getByRole("button", { name: "New private project", exact: true }).click();
  await page.getByLabel("Project title", { exact: true }).fill("Synthetic browser project");
  await page.locator("#project-add-member").selectOption(id);
  await page.getByRole("button", { name: "Add selected member", exact: true }).click();
  await page.getByRole("button", { name: "Save private project", exact: true }).click();
  await page.getByText(/Saved private project/).waitFor();
  await page.getByRole("button", { name: "Curation", exact: true }).click();
  await page.locator("#selected-add-work").selectOption(id);
  await page.getByRole("button", { name: "Add selected artwork", exact: true }).click();
  await page.locator("#homepage-lead").selectOption(id);
  await page.getByRole("button", { name: "Save private curation", exact: true }).click();
  await page.getByText(/Saved private Selected Work/).waitFor();
  await page.getByRole("button", { name: "Preview & export", exact: true }).click();
  await page.getByRole("button", { name: "Build current production-component preview", exact: true }).click();
  await page.getByRole("link", { name: "Preview Artwork", exact: true }).waitFor();
  const popupPromise = context.waitForEvent("page");
  await page.getByRole("link", { name: "Preview Artwork", exact: true }).click();
  const popup = await popupPromise; await popup.waitForLoadState();
  assert.match(await popup.locator("[data-local-pilot]").innerText(), /PRIVATE LOCAL DRAFT/);
  assert.equal(await popup.locator("h1").innerText(), "Synthetic browser-authored artwork");
  await page.locator("#review-record").selectOption(id);
  await page.getByRole("button", { name: "I reviewed this current record locally", exact: true }).click();
  await page.getByText(/Local review recorded/).waitFor();
  await page.locator("#rights-confirmed").check();
  await page.locator("#approval-confirmation").fill("APPROVE PUBLIC SOURCE");
  await page.getByRole("button", { name: "Approve this exact record for public source", exact: true }).click();
  await page.getByText(/Exact public-source approval recorded/).waitFor();
  await page.locator(`#export-records input[value="${id}"]`).check();
  await page.getByRole("button", { name: "Prepare dry-run public-source export", exact: true }).click();
  await page.getByText(/Dry-run prepared/).waitFor();
  assert.equal(await page.getByRole("button", { name: "Write explicitly approved public-source files", exact: true }).isDisabled(), true);
  assert.deepEqual(readCatalogue(service.studio.repository).artworks, []);
  assert.deepEqual(await readFile(original), originalBytes, "browser-selected original preserved byte-for-byte");
  assert.deepEqual(errors, []);
  await context.close();
});

test("failed encoders leave no complete artwork; approved project/selection/lead exports preserve exact ordering", async (t) => {
  const failedCase = await setup(t, { ingestionDependencies: { encode: async () => { throw new Error("Injected encoder interruption"); } } });
  const failed = await openStudio(failedCase.options); t.after(() => failed.close());
  const bytes = await sharp({ create: { width: 32, height: 40, channels: 3, background: "#507090" } }).png().toBuffer();
  const source = resolve(failedCase.dataRoot, "original.png"); await writeFile(source, bytes);
  const before = await lstat(source, { bigint: true });
  const jobId = await failed.intake(bytes, { name: "original.png", purpose: "artwork", assumeSrgb: true });
  await failed.waitForJobs();
  assert.match(failed.state().jobs.find((job) => job.id === jobId).error, /encoder interruption/);
  assert.deepEqual(failed.state().catalogue.artworks, []);
  assert.deepEqual(await readdir(resolve(failed.root, "derivatives")), [], "no pending or falsely complete intake destination");
  assert.deepEqual(await readFile(source), bytes);
  assert.equal((await lstat(source, { bigint: true })).mtimeNs, before.mtimeNs);

  const { project, options } = await setup(t);
  const studio = await openStudio(options); t.after(() => studio.close());
  const one = await add(studio), two = await add(studio, "second.png");
  await edit(studio, one.artworkId, { published: true }); await edit(studio, two.artworkId, { published: true });
  const group = await studio.saveProject({ title: "Synthetic authored sequence", memberIds: [two.artworkId, one.artworkId], published: true });
  await studio.curate({ selectedIds: [two.artworkId, one.artworkId], homepageLeadId: one.artworkId });
  await approved(studio, [one.artworkId, two.artworkId, group.id]);
  await assert.rejects(prepareExport(studio, { artworkIds: [one.artworkId], projectIds: [group.id] }), /Dangling member/);
  const plan = await prepareExport(studio, { artworkIds: [one.artworkId, two.artworkId], projectIds: [group.id] });
  await executeExport(studio, { token: plan.token, confirmation: `EXPORT ${plan.token}` });
  const catalogue = readCatalogue(project.root);
  assert.deepEqual(catalogue.projects[0].memberIds, [two.artworkId, one.artworkId]);
  assert.deepEqual(catalogue.artworks.filter((work) => work.featured).sort((a,b) => a.selectedOrder-b.selectedOrder).map((work) => work.id), [two.artworkId, one.artworkId]);
  assert.equal(catalogue.artworks.find((work) => work.homepageLead).id, one.artworkId);
});
