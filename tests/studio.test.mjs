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
  await page.getByText(/Studio ready\./).waitFor();
  await page.getByRole("button", { name: "Add images", exact: true }).click();
  await page.locator("#files").setInputFiles(original);
  await page.getByRole("radio", { name: /^New artwork/ }).check();
  await page.getByRole("button", { name: "Create draft", exact: true }).click();
  await page.getByRole("button", { name: "Use sRGB for this image", exact: true }).click();
  await page.locator("#jobs").getByText(/Ready/).waitFor();
  await page.getByLabel("Title", { exact: true }).waitFor();
  await page.getByLabel("Title", { exact: true }).fill("Synthetic browser-authored artwork");
  await page.getByLabel("Medium", { exact: true }).selectOption("drawing");
  await page.locator("#artwork-form").getByText("Advanced", { exact: true }).click();
  await page.getByLabel("Artwork type", { exact: true }).selectOption("original");
  await page.getByLabel("Alt text", { exact: true }).fill("Synthetic rectangle used to verify browser authoring");
  await page.getByRole("button", { name: "Save draft", exact: true }).first().click();
  await page.getByText(/Draft saved\./).waitFor();
  const id = service.studio.state().catalogue.artworks[0].id;
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await page.getByRole("button", { name: "New project", exact: true }).click();
  await page.getByLabel("Project title", { exact: true }).fill("Synthetic browser project");
  await page.getByRole("button", { name: "Add to project Synthetic browser-authored artwork", exact: true }).click();
  await page.getByRole("button", { name: "Save project", exact: true }).click();
  await page.getByText(/Project saved\./).waitFor();
  await page.getByRole("button", { name: "Selected Work & homepage", exact: true }).click();
  await page.getByRole("button", { name: "Add to Selected Work Synthetic browser-authored artwork", exact: true }).click();
  await page.getByRole("button", { name: "Use on homepage Synthetic browser-authored artwork", exact: true }).click();
  await page.getByText(/Homepage image saved\./).waitFor();
  await page.getByRole("button", { name: "Save Selected Work", exact: true }).click();
  await page.getByText(/Selected Work saved\./).waitFor();
  await page.getByRole("button", { name: "Prepare for public site", exact: true }).click();
  await page.getByRole("button", { name: "Preview current work", exact: true }).click();
  await page.getByRole("link", { name: "Preview Artwork", exact: true }).waitFor();
  const popupPromise = context.waitForEvent("page");
  await page.getByRole("link", { name: "Preview Artwork", exact: true }).click();
  const popup = await popupPromise; await popup.waitForLoadState();
  assert.match(await popup.locator("[data-local-pilot]").innerText(), /PRIVATE LOCAL DRAFT/);
  assert.equal(await popup.locator("h1").innerText(), "Synthetic browser-authored artwork");
  await page.locator("#review-record").selectOption(id);
  await page.getByRole("button", { name: "I have reviewed this preview", exact: true }).click();
  await page.getByText(/Local review recorded/).waitFor();
  await page.locator("#rights-confirmed").check();
  await page.locator("#approval-confirmation").fill("APPROVE PUBLIC SOURCE");
  await page.getByRole("button", { name: "Approve this exact record for public source", exact: true }).click();
  await page.locator("#message").getByText(/Exact public-source approval recorded/).waitFor();
  await page.locator(`#export-records input[value="${id}"]`).check();
  await page.getByRole("button", { name: "Prepare for public site (dry-run)", exact: true }).click();
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

test("image-first Studio attaches photos visually, keeps references separate, persists visual sequences and previews without ID entry", async (t) => {
  const { dataRoot, options } = await setup(t, { allowPublicExport: false });
  const paths = [];
  for (const [name, width, height, colour] of [["first.png",64,80,"#406070"],["second.png",80,64,"#805040"],["detail.png",32,40,"#607080"],["reference.png",40,40,"#708040"]]) {
    const path = resolve(dataRoot,name); await writeFile(path,await sharp({create:{width,height,channels:3,background:colour}}).png().toBuffer()); paths.push(path);
  }
  const service = await startStudio(options); t.after(() => service.stop());
  const browser = await chromium.launch(); t.after(() => browser.close());
  const context = await browser.newContext({viewport:{width:1440,height:900}}); const page = await context.newPage();
  const errors=[];page.on("pageerror",(error)=>errors.push(error.message));
  await page.goto(service.origin);await page.getByText(/Studio ready\./).waitFor();
  async function upload(path,kind,target,role="Alternate view") {
    await page.getByRole("button",{name:"Artworks",exact:true}).click();
    await page.getByRole("button",{name:"Add images",exact:true}).click();await page.locator("#files").setInputFiles(path);
    await page.getByRole("radio",{name:kind}).check();
    if(target){await page.locator("#intake-targets").getByRole("button",{name:`Choose artwork ${target}`,exact:true}).click();await page.locator("#intake-panel").getByLabel("How should this image be used?",{exact:true}).selectOption({label:role});}
    await page.getByRole("button",{name:target?"Add photo to artwork":kind.source.includes("Process")?"Keep as process / reference":"Create draft",exact:true}).click();
    await page.getByRole("button",{name:"Use sRGB for this image",exact:true}).click();
    await service.studio.waitForJobs();await page.getByRole("button",{name:"Refresh",exact:true}).click();
    await page.locator("#jobs").getByText(/Ready/).waitFor();
  }
  async function titleDraft(value) {
    await page.getByLabel("Title",{exact:true}).fill(value);await page.getByLabel("Medium",{exact:true}).selectOption("drawing");await page.getByLabel("Alt text",{exact:true}).fill("Synthetic image for visual workflow testing");await page.getByRole("button",{name:"Save draft",exact:true}).first().click();await page.getByText(/Draft saved\./).waitFor();
  }
  await upload(paths[0],/^New artwork/);await titleDraft("First artwork");
  await upload(paths[1],/^New artwork/);await titleDraft("Second artwork");
  assert.doesNotMatch(await page.locator("body").innerText(),/w-000[12]|SHA256|zero-based|published:|sourceSha256/,"normal editor requires no internal model knowledge");
  const [first,second]=service.studio.state().catalogue.artworks;
  await upload(paths[2],/^Another view\/detail/,"First artwork","Detail");
  await page.getByRole("button",{name:"Open First artwork",exact:true}).click();
  assert.equal(service.studio.state().catalogue.artworks.find((work)=>work.id===first.id).reproductions.length,2);
  assert.equal(service.studio.state().catalogue.artworks.find((work)=>work.id===second.id).reproductions.length,1);
  const secondary=service.studio.state().catalogue.artworks.find((work)=>work.id===first.id).reproductions[1].src;
  await page.getByRole("button",{name:"Use as primary image",exact:true}).click();await page.getByLabel("Alt text",{exact:true}).fill("Synthetic image for visual workflow testing");await page.getByRole("button",{name:"Save draft",exact:true}).first().click();await page.getByText(/Draft saved\./).waitFor();
  assert.equal(service.studio.state().catalogue.artworks.find((work)=>work.id===first.id).reproductions.find((image)=>image.role==="primary").src,secondary);
  await upload(paths[3],/^Process\/reference image/);
  assert.equal(service.studio.state().catalogue.artworks.length,2,"process/reference does not create a standalone artwork");
  await page.getByRole("button",{name:"Photos & references",exact:true}).click();
  await page.locator("#media-library .thumbnail-card").filter({hasText:"Process / reference only"}).click();
  assert.equal(await page.locator("#media-selection-count").innerText(),"1 photo selected");
  await page.getByRole("button",{name:"Clear selection",exact:true}).click();
  await page.getByRole("button",{name:"Projects",exact:true}).click();await page.getByRole("button",{name:"New project",exact:true}).click();await page.getByLabel("Project title",{exact:true}).fill("Visual project");
  for(const title of ["First artwork","Second artwork"])await page.getByRole("button",{name:`Add to project ${title}`,exact:true}).click();
  await page.locator("#project-members li").nth(1).getByRole("button",{name:"Move earlier",exact:true}).click();await page.getByRole("button",{name:"Save project",exact:true}).click();await page.getByText(/Project saved\./).waitFor();
  assert.deepEqual(service.studio.state().catalogue.projects[0].memberIds,[second.id,first.id]);
  await page.getByRole("button",{name:"Selected Work & homepage",exact:true}).click();
  for(const title of ["First artwork","Second artwork"])await page.getByRole("button",{name:`Add to Selected Work ${title}`,exact:true}).click();
  await page.locator("#selected-sequence li").nth(1).getByRole("button",{name:"Move earlier",exact:true}).click();await page.getByRole("button",{name:"Save Selected Work",exact:true}).click();await page.getByText(/Selected Work saved\./).waitFor();
  await page.getByRole("button",{name:"Use on homepage First artwork",exact:true}).click();await page.getByText(/Homepage image saved\./).waitFor();
  await page.reload();await page.getByText(/Studio ready\./).waitFor();await page.getByRole("button",{name:"Selected Work & homepage",exact:true}).click();
  assert.match(await page.locator("#selected-sequence li").first().innerText(),/Second artwork/);assert.match(await page.locator("#current-lead").innerText(),/First artwork/);
  const popupPromise=context.waitForEvent("page");await page.getByRole("button",{name:"Preview homepage",exact:true}).click();const popup=await popupPromise;await popup.waitForURL("http://127.0.0.1:*/");await popup.waitForLoadState();
  assert.equal(await popup.locator(".home-lead img").getAttribute("alt"),"Synthetic image for visual workflow testing");
  assert.deepEqual(readCatalogue(service.studio.repository).artworks,[]);assert.deepEqual(errors,[]);await context.close();
});

test("readonly colour inspection asks explicitly without allocating drafts, jobs or IDs", async (t) => {
  const { dataRoot, options } = await setup(t);
  const studio = await openStudio(options); t.after(() => studio.close());
  const untagged = await sharp({create:{width:32,height:40,channels:3,background:"#507080"}}).png().toBuffer();
  const tagged = await sharp(untagged).withIccProfile("srgb").png().toBuffer();
  const registry = await readFile(resolve(dataRoot,"id-registry.json"));
  const before = studio.state();
  assert.equal((await studio.inspectImage(untagged,{sha256:checksum(untagged)})).needsColourDecision,true);
  assert.equal((await studio.inspectImage(tagged,{sha256:checksum(tagged)})).needsColourDecision,false);
  await assert.rejects(studio.inspectImage(Buffer.from("invalid selected image")),/unsupported|Input buffer/i);
  assert.deepEqual(studio.state(),before,"inspection is not intake, a failed job or implicit approval");
  assert.deepEqual(await readFile(resolve(dataRoot,"id-registry.json")),registry);
});

test("untagged colour choice leads to focused ready editor, optional draft save and persisted edits after real restart", async (t) => {
  const { dataRoot, options } = await setup(t,{allowPublicExport:false});
  const original=resolve(dataRoot,"untagged.png");await writeFile(original,await sharp({create:{width:64,height:80,channels:3,background:"#507080"}}).png().toBuffer());
  const originalBytes=await readFile(original), originalMtime=(await lstat(original,{bigint:true})).mtimeNs;
  const service=await startStudio(options);t.after(()=>service.stop());
  const browser=await chromium.launch();t.after(()=>browser.close());
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(service.origin);await page.getByText(/Studio ready\./).waitFor();
  await page.getByRole("button",{name:"Add images",exact:true}).click();await page.locator("#files").setInputFiles(original);
  await page.getByRole("button",{name:"Create draft",exact:true}).click();
  await page.getByText("This image has no embedded colour profile.",{exact:true}).waitFor();
  assert.equal(service.studio.state().catalogue.artworks.length,0);
  assert.equal(service.studio.state().jobs.length,0);
  assert.equal(await page.locator("#artwork-form").isVisible(),false,"no half-failed pending editor");
  assert.doesNotMatch(await page.locator("body").innerText(),/--assume-srgb|Missing ICC profile/);
  await page.getByRole("button",{name:"Use sRGB for this image",exact:true}).click();
  await page.waitForFunction(()=>document.activeElement?.getAttribute("name")==="title"&&document.querySelector("#artwork-form").getBoundingClientRect().top>=-2&&document.querySelector("#artwork-form").getBoundingClientRect().top<50);
  assert.equal(await page.getByRole("button",{name:"Save draft",exact:true}).first().isEnabled(),true);
  assert.equal(await page.getByRole("button",{name:"Preview artwork",exact:true}).first().isEnabled(),true);
  const job=service.studio.state().jobs.at(-1);assert.equal(job.status,"complete");
  const manifest=JSON.parse(await readFile(resolve(service.studio.root,"derivatives",job.result.mediaId,"manifest.json")));
  assert.equal(manifest.settings.profile,"explicit-srgb-assumption");
  await page.getByRole("button",{name:"Save draft",exact:true}).first().click();await page.getByText(/Draft saved\./).waitFor();
  assert.equal(service.studio.state().catalogue.artworks[0].date.certainty,"unknown");
  await page.getByLabel("Date",{exact:true}).selectOption("exact");
  assert.equal(await page.getByRole("button",{name:"Save draft",exact:true}).first().isEnabled(),true);
  await page.getByRole("button",{name:"Save draft",exact:true}).first().click();
  assert.equal(await page.locator("#artwork-form").getByLabel("Year",{exact:true}).getAttribute("aria-invalid"),"true");
  assert.match(await page.locator("#editor-validation-summary").innerText(),/valid year.*Unknown/);
  await page.getByLabel("Date",{exact:true}).selectOption("unknown");
  await page.getByLabel("Title",{exact:true}).fill("Synthetic persisted colour-choice draft");await page.getByLabel("Medium",{exact:true}).selectOption("drawing");await page.getByLabel("Alt text",{exact:true}).fill("Synthetic untagged rectangle used for explicit choice testing");
  await page.getByRole("button",{name:"Save draft",exact:true}).first().click();await page.getByText(/Draft saved\./).waitFor();
  await page.close();await service.stop();
  const restarted=await startStudio(options);t.after(()=>restarted.stop());const reopened=await browser.newPage();await reopened.goto(restarted.origin);await reopened.getByText(/Studio ready\./).waitFor();
  await reopened.getByRole("button",{name:"Open Synthetic persisted colour-choice draft",exact:true}).click();
  assert.equal(await reopened.getByLabel("Title",{exact:true}).inputValue(),"Synthetic persisted colour-choice draft");
  assert.equal(await reopened.getByLabel("Medium",{exact:true}).inputValue(),"drawing");
  assert.match(await reopened.getByLabel("Alt text",{exact:true}).inputValue(),/Synthetic untagged rectangle/);
  assert.deepEqual(await readFile(original),originalBytes);assert.equal((await lstat(original,{bigint:true})).mtimeNs,originalMtime);
  assert.deepEqual(readCatalogue(restarted.studio.repository).artworks,[]);
  await reopened.close();
});

test("decline creates nothing, tagged photos skip colour question, batch approval never applies to future selections or repeated errors", async (t) => {
  const { dataRoot, options }=await setup(t,{allowPublicExport:false});
  const files=[];
  for(const [name,tagged]of [["decline.png",false],["tagged.png",true],["batch-one.png",false],["batch-two.png",false],["future.png",false]]){
    const path=resolve(dataRoot,name);let image=sharp({create:{width:32,height:40,channels:3,background:"#507080"}});if(tagged)image=image.withIccProfile("srgb");await writeFile(path,await image.png().toBuffer());files.push(path);
  }
  const service=await startStudio(options);t.after(()=>service.stop());
  await service.studio.transact((state)=>{for(let index=0;index<3;index++)state.jobs.push({id:`old-failure-${index}`,status:"error",error:"Missing ICC profile: choose --assume-srgb"});});
  const browser=await chromium.launch();t.after(()=>browser.close());const page=await browser.newPage();await page.goto(service.origin);await page.getByText(/Studio ready\./).waitFor();
  assert.doesNotMatch(await page.locator("body").innerText(),/Missing ICC|--assume-srgb|Photo could not be prepared/);
  async function select(paths){await page.getByRole("button",{name:"Add images",exact:true}).click();await page.locator("#files").setInputFiles(paths);await page.getByRole("button",{name:"Create draft",exact:true}).click();}
  await select(files[0]);await page.getByRole("button",{name:"Choose another image",exact:true}).click();
  assert.equal(service.studio.state().catalogue.artworks.length,0);assert.equal(service.studio.state().jobs.length,3);
  await select(files[1]);await page.waitForFunction(()=>document.activeElement?.getAttribute("name")==="title");
  assert.equal(await page.locator("#colour-decision").isVisible(),false);assert.equal(service.studio.state().catalogue.artworks.length,1);
  const taggedJob=service.studio.state().jobs.at(-1);const taggedManifest=JSON.parse(await readFile(resolve(service.studio.root,"derivatives",taggedJob.result.mediaId,"manifest.json")));assert.equal(taggedManifest.settings.profile,"embedded-to-srgb");
  await select([files[2],files[3]]);await page.getByText("This image has no embedded colour profile.",{exact:true}).waitFor();
  await page.getByLabel("Use sRGB for all 2 currently selected untagged images only",{exact:true}).check();
  await page.getByRole("button",{name:"Use sRGB for this image",exact:true}).click();
  while(service.studio.state().jobs.length<6)await new Promise((done)=>setTimeout(done,25));await service.studio.waitForJobs();
  await page.getByRole("button",{name:"Refresh",exact:true}).click();
  assert.equal(service.studio.state().catalogue.artworks.length,3);assert.equal(await page.locator("#colour-decision").isVisible(),false);
  assert.equal(await page.locator("#jobs p").count(),1,"equal Ready messages are concise/count-scoped, not duplicate history rows");
  await select(files[4]);await page.getByText("This image has no embedded colour profile.",{exact:true}).waitFor();
  assert.equal(service.studio.state().catalogue.artworks.length,3,"earlier explicit batch decision is not remembered for unrelated imports");
  assert.equal(await page.locator("#colour-apply-batch").isChecked(),false);assert.equal(await page.locator("#artwork-form").isVisible(),false);
  await page.getByRole("button",{name:"Choose another image",exact:true}).click();
  assert.doesNotMatch(await page.locator("body").innerText(),/--assume-srgb|Missing ICC profile/);await page.close();
});

test("Save and current-edits Preview remain actionable, focus invalid years, preserve edits and persist corrected private drafts", async (t) => {
  const { options } = await setup(t,{allowPublicExport:false});
  const service = await startStudio(options); t.after(() => service.stop());
  const { artworkId } = await add(service.studio);
  const browser = await chromium.launch(); t.after(() => browser.close());
  const context = await browser.newContext({viewport:{width:1440,height:900}}), page = await context.newPage();
  await context.route("**/*",(route)=>new URL(route.request().url()).hostname==="127.0.0.1"?route.continue():route.abort());
  await page.goto(service.origin); await page.getByText(/Studio ready\./).waitFor(); await page.getByRole("button",{name:"Open Untitled artwork",exact:true}).click();
  const form = page.locator("#artwork-form"), year = form.getByLabel("Year",{exact:true});
  await form.getByLabel("Title",{exact:true}).fill("Synthetic unsaved validation draft");
  await form.getByLabel("Medium",{exact:true}).selectOption("drawing");
  await form.getByLabel("Materials",{exact:true}).fill("Synthetic test notes — preserve on failure");
  await form.getByLabel("Alt text",{exact:true}).fill("Synthetic rectangle for actionable validation");
  await form.getByLabel("Date",{exact:true}).selectOption("exact");
  const savedBefore = service.studio.state().catalogue.artworks[0];
  for (const value of ["", "bad-year", "0", "10000", "2000.5"]) {
    await year.fill(value);
    assert.equal(await form.getByRole("button",{name:"Save draft",exact:true}).first().isEnabled(),true);
    await form.getByRole("button",{name:"Save draft",exact:true}).first().click();
    assert.equal(await year.getAttribute("aria-invalid"),"true");
    assert.ok(await year.evaluate((input)=>document.activeElement===input));
    const box=await year.boundingBox(); assert.ok(box.y>=0&&box.y+box.height<=900,"invalid field scrolled into normal desktop viewport");
    const description=await year.getAttribute("aria-describedby"); assert.match(description,/artwork-field-error-year/);
    assert.match(await page.locator("#editor-validation-summary").innerText(),/Exact dates require a valid year from 1 to 9999/);
    assert.equal(await form.getByLabel("Title",{exact:true}).inputValue(),"Synthetic unsaved validation draft");
    assert.equal(await form.getByLabel("Materials",{exact:true}).inputValue(),"Synthetic test notes — preserve on failure");
    assert.equal(await year.inputValue(),value,"malformed entered state is not silently converted");
    assert.deepEqual(service.studio.state().catalogue.artworks[0],savedBefore,"invalid Save writes no draft metadata");
  }
  assert.equal(await form.getByRole("button",{name:"Preview artwork",exact:true}).first().isEnabled(),true);
  await form.getByRole("button",{name:"Preview artwork",exact:true}).first().click();
  assert.match(await page.locator("#editor-validation-summary").innerText(),/Preview blocked.*Exact dates/);
  assert.equal(context.pages().length,1,"invalid current edits do not open a stale preview or blank window");
  assert.equal(service.studio.state().previews.length,0);
  assert.ok(await year.evaluate((input)=>document.activeElement===input));
  await form.getByLabel("Date",{exact:true}).selectOption("circa");
  await form.getByRole("button",{name:"Save draft",exact:true}).first().click();
  assert.match(await page.locator("#editor-validation-summary").innerText(),/Circa dates require/);
  await form.getByLabel("Date",{exact:true}).selectOption("unknown");
  await form.getByLabel("Materials",{exact:true}).fill("");
  await form.getByRole("button",{name:"Save draft",exact:true}).first().click(); await page.getByText(/Draft saved\./).waitFor();
  const unknown=service.studio.state().catalogue.artworks[0];
  assert.deepEqual(unknown.date,{certainty:"unknown"}); assert.deepEqual(unknown.dimensions,[]); assert.equal(unknown.availability.state,"unknown"); assert.equal(unknown.edition,undefined);assert.equal(unknown.materials,undefined);assert.deepEqual(unknown.techniques,[]);
  await form.getByLabel("Date",{exact:true}).selectOption("exact");await year.fill("");
  await form.getByRole("button",{name:"Save draft",exact:true}).first().click();
  await year.fill("2001"); assert.notEqual(await year.getAttribute("aria-invalid"),"true","corrected year clears its local error without refresh");
  await form.getByRole("button",{name:"Save draft",exact:true}).first().click(); await page.getByText(/Draft saved\./).waitFor();
  assert.equal(service.studio.state().catalogue.artworks[0].date.year,2001);
  await form.getByLabel("Title",{exact:true}).fill("Synthetic current-edits preview title");
  const popupPromise=context.waitForEvent("page"); await form.getByRole("button",{name:"Preview artwork",exact:true}).first().click(); const popup=await popupPromise;await popup.waitForURL("http://127.0.0.1:*/artwork/**");await popup.waitForLoadState();
  assert.equal(await popup.locator("h1").innerText(),"Synthetic current-edits preview title");
  assert.equal(service.studio.state().catalogue.artworks[0].title,"Synthetic current-edits preview title","valid Preview privately saves current edits, not last saved state");
  assert.equal(service.studio.state().catalogue.artworks[0].published,false); assert.equal(service.studio.state().workflow[artworkId].approved,null);assert.deepEqual(readCatalogue(service.studio.repository).artworks,[]);
  await popup.close();await page.close();await service.stop();
  const restarted=await startStudio(options);t.after(()=>restarted.stop());const reopened=await context.newPage();await reopened.goto(restarted.origin);await reopened.getByText(/Studio ready\./).waitFor();await reopened.getByRole("button",{name:"Open Synthetic current-edits preview title",exact:true}).click();
  assert.equal(await reopened.getByLabel("Title",{exact:true}).inputValue(),"Synthetic current-edits preview title");assert.equal(await reopened.locator("#artwork-form").getByLabel("Year",{exact:true}).inputValue(),"2001");await context.close();
});
