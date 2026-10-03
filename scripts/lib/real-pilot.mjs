import { readFile, writeFile, mkdir, cp, realpath, lstat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { localPilotOutput, hashBytes } from "./pilot-snapshot.mjs";
import { ingest } from "./ingestion.mjs";
import { isolatedProject } from "../../tests/helpers/build-project.mjs";
import { startPreview } from "../../tests/helpers/preview.mjs";
import { artworkSchema, validateCatalogue } from "../../src/lib/catalogue.ts";
import { inspectOutput, elements, outputFiles } from "./output-quality.mjs";
import { auditAccessibility, measurePage, launchBrowser, prepareScreenshot } from "./browser-quality.mjs";

const idFor = (value) => typeof value === "number" ? `w-${String(value).padStart(4, "0")}` : value;
export function expandClassifications(snapshot, plan) {
  if (plan.snapshotSha256 !== snapshot.snapshotSha256) throw new Error("Visual plan belongs to a different frozen snapshot");
  const known = new Set(snapshot.included.map((entry) => entry.id));
  const classes = new Map();
  for (const set of plan.classifications) for (const value of set.ids) {
    const id = idFor(value);
    if (!known.has(id) || classes.has(id)) throw new Error(`Unknown/duplicate classification ID: ${id}`);
    classes.set(id, { ...set, ids: undefined, status: "provisional-visual-inference-not-owner-approved" });
  }
  for (const id of known) if (!classes.has(id)) throw new Error(`Image still needs visual inspection/classification: ${id}`);
  for (const group of plan.groups ?? []) {
    for (const value of group.ids) if (!known.has(idFor(value))) throw new Error(`Unknown provisional member: ${value}`);
    for (const value of group.previewIds ?? []) if (!group.ids.map(idFor).includes(idFor(value))) throw new Error(`Group preview sample is not a candidate member: ${value}`);
  }
  for (const value of plan.pilotIds ?? []) if (!known.has(idFor(value))) throw new Error(`Unknown pilot choice: ${value}`);
  if (!known.has(idFor(plan.homepageCandidateId))) throw new Error("Unknown local homepage composition candidate");
  return classes;
}
export async function loadSnapshot(path) {
  const absolute = localPilotOutput(path);
  const snapshot = JSON.parse(await readFile(absolute, "utf8"));
  const { snapshotSha256, ...content } = snapshot;
  if (hashBytes(Buffer.from(JSON.stringify(content))) !== snapshotSha256) throw new Error("Frozen snapshot manifest checksum changed");
  const directory = dirname(absolute);
  for (const entry of snapshot.included) {
    const file = resolve(directory, entry.snapshotRelativeFile);
    if (!file.startsWith(`${directory}/originals/`) || (await lstat(file)).isSymbolicLink() || !(await realpath(file)).startsWith(`${directory}/originals/`)) throw new Error("Unsafe frozen image reference");
    if (hashBytes(await readFile(file)) !== entry.sha256) throw new Error(`Frozen image changed: ${entry.id}`);
  }
  return { snapshot, directory };
}
export async function sourcePreservation(snapshot) {
  const changed = [], unchanged = [];
  for (const entry of snapshot.included) {
    const file = resolve(snapshot.sourceRoot, entry.file);
    try {
      if (!(await realpath(file)).startsWith(`${snapshot.sourceRoot}/`)) throw new Error("escaped source root");
      const stat = await lstat(file, { bigint: true });
      if (!stat.isFile() || stat.isSymbolicLink() || stat.mtimeNs.toString() !== entry.sourceMtimeNs || hashBytes(await readFile(file)) !== entry.sha256) throw new Error("current bytes/mtime differ from frozen inventory");
      unchanged.push(entry.id);
    } catch (error) { changed.push({ id: entry.id, reason: error.message, interpretation: "Snapshot remains fixed; source may have received external exporter updates, never silently substituted" }); }
  }
  return { checked: snapshot.included.length, unchanged: unchanged.length, changed };
}
async function atomicJson(path, data) { await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, { mode: 0o600 }); }

export async function derivePilot({ snapshot, directory, classes, plan }) {
  const output = resolve(directory, "derivatives");
  const byId = new Map();
  const entries = [...snapshot.included];
  let cursor = 0;
  async function worker() {
    while (cursor < entries.length) {
      const entry = entries[cursor++], classification = classes.get(entry.id);
      const derived = await ingest({ input: resolve(directory, entry.snapshotRelativeFile), output,
        id: entry.id, title: `Review item ${entry.id} (title not supplied)`, medium: classification.medium, kind: "unclassified",
        alt: `Local review image ${entry.id}; artwork title and authorship not confirmed`, assumeSrgb: true,
      });
      byId.set(entry.id, derived);
    }
  }
  await Promise.all([worker(), worker()]);
  const pilotIds = (plan.pilotIds ?? []).map(idFor);
  const records = snapshot.included.map((entry) => {
    const classification = classes.get(entry.id), result = byId.get(entry.id);
    return { ...entry, classification,
      provisionalGroups: (plan.groups ?? []).filter((group) => group.ids.map(idFor).includes(entry.id)).map((group) => group.id),
      visualProblems: (plan.problems ?? []).filter((problem) => problem.ids.map(idFor).includes(entry.id)).map((problem) => problem.note),
      derivativeStatus: result.status, derivativeSettings: result.settings,
      displayLabel: `Review item ${entry.id} (title not supplied)`, publicationAuthorized: false,
      draft: artworkSchema.parse({ ...result.draft, date: { certainty: "exact", year: Number(entry.provisionalCreationDate.value.slice(0, 4)), label: `${entry.provisionalCreationDate.value} — provisional file mtime` },
        techniques: classification.techniques, dimensions: [], kind: "unclassified", published: false, featured: false, homepageLead: false, selectedOrder: undefined,
      }),
    };
  });
  await atomicJson(resolve(directory, "provisional-records.json"), { snapshotSha256: snapshot.snapshotSha256, status: "PRIVATE LOCAL PILOT — NO ACTUAL TITLES/RIGHTS/PUBLICATION/FINAL SELECTION", records });
  return { records, pilotIds, byId };
}

export function renderCatalogue(records, plan) {
  const chosen = (plan.pilotIds ?? []).map(idFor), lead = idFor(plan.homepageCandidateId);
  const artworks = records.map((record) => ({ ...record.draft,
    // Isolated renderer flags, never written into the production catalogue or the private draft above.
    published: true, featured: chosen.includes(record.id), selectedOrder: chosen.includes(record.id) ? chosen.indexOf(record.id) : undefined, homepageLead: record.id === lead,
    description: `Local provisional review only. Source export: ${record.instagramFilename}. Date is the owner-instructed source-file modification date, not verified artwork chronology. Medium and technique are visual hypotheses. Title, physical dimensions, rights/authorship, availability and edition facts have not been supplied.`,
  }));
  const projects = (plan.groups ?? []).map((group) => ({ id: group.id, slug: group.id, title: group.reviewLabel,
    description: `${group.basis} Displayed members are a small layout sample from the broader provisional candidate list. This is not an artwork series name or approved authored sequence.`, memberIds: (group.previewIds ?? group.ids).map(idFor), published: true, fixture: false,
  }));
  return { artworks, projects, professional: [] };
}
export async function privatePilotSite(harness, { directory, records, plan }) {
  const project = await isolatedProject(harness);
  const catalogue = renderCatalogue(records, plan);
  validateCatalogue(catalogue, { assetExists: () => true });
  for (const name of ["artworks", "projects", "professional"]) await project.content(name, catalogue[name]);
  for (const record of records) {
    const manifest = JSON.parse(await readFile(resolve(directory, "derivatives", record.id, "manifest.json"), "utf8"));
    for (const file of manifest.files) await project.asset(`/media/${record.id}/${file.name}`, await readFile(resolve(directory, "derivatives", record.id, file.name)));
  }
  await writeFile(resolve(project.root, "src/config/identity.ts"), 'export const identity = { name: "Local M09 real-image pilot", shortName: "REVIEW", descriptor: "Provisional local visual test — not public artwork metadata", location: "Owner-authorized local input snapshot", siteUrl: "https://local-review.invalid", email: "" } as const;\n');
  const layoutPath = resolve(project.root, "src/layouts/BaseLayout.astro");
  let layout = await readFile(layoutPath, "utf8");
  layout = layout.replace("<body>", '<body><aside class="pilot-notice" role="note" data-local-pilot>LOCAL M09 REAL-IMAGE PILOT — private review only. Labels, dates, media, groups and composition are provisional; no title, authorship/rights, publication, prices or final selection approved.</aside>');
  layout = layout.replace('<script is:inline type="application/ld+json" set:html={safeJson(artistSchema)} />', "");
  layout = layout.replace('<p>© {new Date().getFullYear()}</p>', '<p>Local review only — rights not confirmed</p>');
  await writeFile(layoutPath, layout);
  const artworkPath = resolve(project.root, "src/pages/artwork/[slug].astro");
  let artworkPage = await readFile(artworkPath, "utf8");
  artworkPage = artworkPage.replace('by ${identity.name}.', 'local provisional review.').replace('schema={[schema, ...(video ? [video] : [])]}', 'schema={[]}');
  await writeFile(artworkPath, artworkPage);
  const viewPath = resolve(project.root, "src/components/ArtworkView.astro");
  await writeFile(viewPath, (await readFile(viewPath, "utf8"))
    .replace('const medium = mediumLabel(artwork.medium);', 'const medium = `${mediumLabel(artwork.medium)} — provisional visual classification`;')
    .replace('Authored connections', 'Provisional visual relationships')
    .replace('Projects containing this work', 'Provisional review groups containing this image'));
  const reproductionPath = resolve(project.root, "src/components/Reproduction.astro");
  await writeFile(reproductionPath, (await readFile(reproductionPath, "utf8")).replace('primary: "Full reproduction"', 'primary: "Whole source export — reproduction/colour not approved"'));
  const groupPath = resolve(project.root, "src/components/ProjectView.astro");
  await writeFile(groupPath, (await readFile(groupPath, "utf8")).replace('Project / series', 'Provisional visual grouping — not an authored series').replace('Authored project sequence', 'Provisional review sequence, not approved'));
  const groupIndex = resolve(project.root, "src/pages/projects/index.astro");
  await writeFile(groupIndex, (await readFile(groupIndex, "utf8")).replace('Authored projects and series by Jordan Nesbitt.', 'Provisional local visual groups, not approved authored series.').replace('Projects and series.', 'Provisional visual groups.'));
  const mediumPath = resolve(project.root, "src/pages/work/[medium].astro");
  await writeFile(mediumPath, (await readFile(mediumPath, "utf8")).replace('${item.label} by Jordan Nesbitt, a visual artist in London, Ontario.', '${item.label}, provisional local image classification.'));
  const selectedPath = resolve(project.root, "src/pages/work/index.astro");
  await writeFile(selectedPath, (await readFile(selectedPath, "utf8")).replace('Selected work by Jordan Nesbitt, organized by medium.', 'Representative local layout sequence, not approved final curation.'));
  const homePath = resolve(project.root, "src/pages/index.astro");
  await writeFile(homePath, (await readFile(homePath, "utf8")).replace('Authored context', 'Provisional visual context').replace('Projects and series', 'Provisional visual groups'));
  const archivePath = resolve(project.root, "src/pages/archive.astro");
  await writeFile(archivePath, (await readFile(archivePath, "utf8")).replace('A comprehensive index, distinct from the authored selection.', 'Frozen local source inventory; classifications and layout samples are provisional.'));
  const start = performance.now(), built = await project.build({ mode: "preview" });
  if (built.code !== 0) throw new Error(built.output);
  const preview = await startPreview({ root: project.root });
  harness.after(preview.stop);
  return { ...project, ...preview, buildMs: Math.round(performance.now() - start), catalogue };
}

async function colourComparison(directory, record) {
  const image = record.draft.reproductions[0], primaryPath = resolve(directory, "derivatives", record.id, image.src.split("/").at(-1));
  const reference = await sharp(resolve(directory, record.snapshotRelativeFile)).rotate().withIccProfile("srgb").resize({ width: 256, height: 256, fit: "inside", withoutEnlargement: true }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const candidate = await sharp(primaryPath).withIccProfile("srgb").resize({ width: reference.info.width, height: reference.info.height }).removeAlpha().raw().toBuffer();
  let difference = 0, square = 0;
  for (let index = 0; index < candidate.length; index++) { const delta = candidate[index] - reference.data[index]; difference += Math.abs(delta); square += delta * delta; }
  return { id: record.id, comparedTo: "frozen Instagram source under same explicit sRGB interpretation, not physical artwork", meanAbsoluteChannelError: difference / candidate.length, rmse: Math.sqrt(square / candidate.length), humanColourApproval: false };
}

export async function reviewRealPilot({ snapshotPath, planPath, output }) {
  const loaded = await loadSnapshot(snapshotPath), { snapshot, directory } = loaded;
  const planFile = localPilotOutput(planPath ?? resolve(directory, "visual-review-plan.json"));
  const planBytes = await readFile(planFile), plan = JSON.parse(planBytes);
  const classes = expandClassifications(snapshot, plan);
  const { records, pilotIds } = await derivePilot({ snapshot, directory, classes, plan });
  const reviewsRoot = localPilotOutput(output ?? resolve(dirname(dirname(directory)), "reviews"));
  const runId = `review-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`;
  const reviewRoot = resolve(reviewsRoot, runId);
  await mkdir(resolve(reviewRoot, "screenshots"), { recursive: true, mode: 0o700 });
  const cleanup = [], harness = { after: (fn) => cleanup.push(fn) };
  try {
    const site = await privatePilotSite(harness, { directory, records, plan });
    const browser = await launchBrowser();
    cleanup.push(() => browser.close());
    const paths = ["/", "/work/", "/archive/", "/projects/", ...["painting", "drawing", "printmaking", "unclassified"].map((medium) => `/work/${medium}/`), ...(plan.groups ?? []).map((group) => `/projects/${group.id}/`), ...pilotIds.map((id) => `/artwork/${id}/`)];
    const report = { kind: "LOCAL M09 REAL-IMAGE PILOT — NOT PUBLIC CONTENT/RIGHTS/FINAL SELECTION APPROVAL", request: "M09-R1", created: new Date().toISOString(), runId, snapshot: { path: resolve(snapshotPath), sha256: snapshot.snapshotSha256, enumeratedAt: snapshot.enumeratedAt, files: snapshot.included.map(({ id, file, sha256, provisionalCreationDate }) => ({ id, file, sha256, provisionalCreationDate })) }, visualPlan: { path: planFile, sha256: hashBytes(planBytes) }, environment: { platform: process.platform, node: process.version, browser: browser.version(), viewports: [360, 768, 1440], height: 900, dpr: 1 }, buildMs: site.buildMs, output: await inspectOutput(resolve(site.root, "dist"), { siteUrl: "https://local-review.invalid" }), pages: [], performance: [], numericalColourComparisons: [], sourcePreservation: await sourcePreservation(snapshot), approval: { publication: false, launchManifest: false, metadata: false, rights: false, humanColour: false } };
    report.unapprovedAssertionCheck = await assertPrivatePilotOutput(resolve(site.root, "dist"));
    report.interactions = [];
    for (const width of [360, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
      await context.route("**/*", (route) => new URL(route.request().url()).origin === site.origin ? route.continue() : route.abort());
      const page = await context.newPage();
      for (const path of paths) {
        await page.goto(`${site.origin}${path}`, { waitUntil: "networkidle" });
        const audit = await auditAccessibility(page);
        const reflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
        const name = `${width}-${path === "/" ? "home" : path.replace(/^\//, "").replace(/\/$/, "").replaceAll("/", "-")}.png`;
        await prepareScreenshot(page);
        await page.screenshot({ path: resolve(reviewRoot, "screenshots", name), fullPage: true });
        report.pages.push({ path, width, reflow, screenshot: `screenshots/${name}`, accessibility: audit });
      }
      await page.goto(`${site.origin}/artwork/${pilotIds[0]}/`);
      const full = page.getByRole("link", { name: /View full primary image/ });
      await full.focus();
      if (await full.evaluate((link) => getComputedStyle(link).outlineStyle) === "none") throw new Error("Real pilot keyboard focus is not visible");
      await Promise.all([page.waitForURL("**/media/**"), full.press("Enter")]);
      await page.goBack();
      if (!page.url().endsWith(`/artwork/${pilotIds[0]}/`)) throw new Error("Real image full-view return failed");
      await page.goto(`${site.origin}/archive/`);
      await page.getByLabel("Medium", { exact: true }).selectOption("drawing");
      await page.getByRole("button", { name: "Apply filters", exact: true }).click();
      if (await page.locator(".archive-entry:visible").count() !== records.filter((record) => record.classification.medium === "drawing").length) throw new Error("Real pilot archive classification count mismatch");
      await page.getByRole("button", { name: "Reset filters", exact: true }).click();
      if (await page.locator(".archive-entry:visible").count() !== records.length) throw new Error("Real pilot archive reset mismatch");
      report.interactions.push({ width, keyboardFullImageAndBack: "PASS", archiveClassifiedCountAndReset: "PASS", physicalDimensionsInvented: false });
      await context.close();
    }
    const plain = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
    await plain.route("**/*", (route) => new URL(route.request().url()).origin === site.origin ? route.continue() : route.abort());
    const plainPage = await plain.newPage();
    await plainPage.goto(`${site.origin}/work/`);
    if (await plainPage.locator(".selected-work article").count() !== pilotIds.length) throw new Error("Real pilot no-JS representative browsing mismatch");
    await plainPage.locator(".selected-work a").first().click();
    if (!plainPage.url().includes("/artwork/")) throw new Error("Real pilot no-JS object link failed");
    report.interactions.push({ width: 360, noJavaScriptRepresentativeAndObjectBrowsing: "PASS" });
    await plain.close();
    for (const path of ["/", `/artwork/${pilotIds[0]}/`, `/artwork/${idFor(plan.homepageCandidateId)}/`, "/archive/"]) {
      const runs = [];
      for (let count = 0; count < 3; count++) runs.push(await measurePage(browser, site.origin, path));
      report.performance.push({ path, runs, profile: "360x800 DPR1,1.6Mbps/750kbps/150ms,CPU4x,cache disabled", fieldOrHumanApproval: false });
    }
    for (const record of records.filter((record) => pilotIds.includes(record.id))) report.numericalColourComparisons.push(await colourComparison(directory, record));
    await cp(resolve(site.root, "dist"), resolve(reviewRoot, "site"), { recursive: true });
    await atomicJson(resolve(reviewRoot, "report.json"), report);
    await atomicJson(resolve(reviewRoot, "provisional-records.json"), { snapshotSha256: snapshot.snapshotSha256, records });
    await atomicJson(resolve(reviewRoot, "visual-review-plan.json"), plan);
    await writeOwnerSummary(reviewRoot, { report, records, plan, pilotIds, directory });
    await atomicJson(resolve(dirname(reviewsRoot), "latest-review.json"), { runId, reviewRoot, snapshotSha256: snapshot.snapshotSha256, report: resolve(reviewRoot, "report.json") });
    return { reviewRoot, snapshotSha256: snapshot.snapshotSha256, inventory: records.length, representativePilot: pilotIds.length, screenshots: report.pages.length, violations: report.pages.flatMap((page) => page.accessibility.violations).length, reflowFailures: report.pages.filter((page) => !page.reflow).length, sourcePreservation: report.sourcePreservation, publicationAuthorized: false };
  } finally { for (const fn of cleanup.reverse()) await fn(); }
}

export async function assertPrivatePilotOutput(directory) {
  let pages = 0;
  for (const file of (await outputFiles(directory)).filter((file) => file.endsWith(".html"))) {
    const html = await readFile(file, "utf8"), nodes = elements(html);
    if (!nodes.some((node) => node.attrs["data-local-pilot"] !== undefined)) throw new Error("Private pilot disclosure absent");
    const robots = nodes.find((node) => node.tag === "meta" && node.attrs.name === "robots");
    if (!robots?.attrs.content.includes("noindex")) throw new Error("Private pilot noindex courtesy absent");
    if (/\bby Jordan Nesbitt\b|"@type":"(?:VisualArtwork|Person|Product|Offer)"|"creator"/.test(html)) throw new Error(`Unapproved artist/rights/offer assertion in local pilot: ${file}`);
    pages++;
  }
  return { pages, unapprovedArtistRightsOfferAssertions: 0, publicationAuthorized: false };
}

async function writeOwnerSummary(root, { report, records, plan, pilotIds, directory }) {
  const rows = records.map((record) => `| ${record.id} | ${record.instagramFilename} | ${record.provisionalCreationDate.value} | ${record.classification.medium} — provisional | ${record.classification.techniques.join("; ") || "Not inferred"} | ${record.image.orientation} (${record.image.width}×${record.image.height}px) | ${record.provisionalGroups.join(", ") || "None"} |`);
  const medians = report.performance.map(({ path, runs }) => { const lcp = runs.map((run) => run.lcp).sort((a, b) => a - b)[1]; return `- ${path}: median lab LCP ${lcp} ms; initial transfer ${Math.max(...runs.map((run) => run.transferBytes))} bytes; CLS ${Math.max(...runs.map((run) => run.cls))}.`; });
  const counts = Object.fromEntries(["painting", "drawing", "printmaking", "unclassified"].map((medium) => [medium, records.filter((record) => record.classification.medium === medium).length]));
  const text = `# M09 real-image pilot — OWNER REVIEW REQUIRED\n\nLocal/private, not publication, rights/authorship, final selection or permanent metadata approval. Artwork/project titles have NOT been supplied; neutral review labels only. Physical dimensions remain absent; all offers/edition/rights unknown.\n\n## Exact run\n\n- Snapshot: ${report.snapshot.path}\n- Snapshot SHA256: ${report.snapshot.sha256}\n- Frozen enumeration: ${report.snapshot.enumeratedAt}; timezone ${records[0]?.provisionalCreationDate.timezone ?? "unknown"}.\n- Review plan SHA256: ${report.visualPlan.sha256}\n- Review run: ${report.runId}; report.json records every input/checksum/date and screenshot.\n- ${records.length} files inventoried/classified; ${pilotIds.length} representative UI test items: ${pilotIds.join(", ")}. Homepage candidate ${idFor(plan.homepageCandidateId)} is composition testing only.\n- Provisional category counts: ${JSON.stringify(counts)}. Source preserved ${report.sourcePreservation.unchanged}/${report.sourcePreservation.checked}; source changes: ${JSON.stringify(report.sourcePreservation.changed)}.\n\n## Date provenance\n\nEach listed date is the OWNER-INSTRUCTED SOURCE FILESYSTEM MTIME calendar date for this test, not inferred Instagram/EXIF date or verified artwork chronology. UTC timestamp/nanoseconds/timezone/revision marker are preserved in snapshot.json and provisional-records.json. Visible dates/signatures in photographs can differ and have not replaced the requested proxy. No physical sizes were inferred from pixels, mats or paper.\n\n## Files and provisional classifications\n\n| Internal ID | Exact Instagram filename | Provisional date (mtime) | Medium/category | Likely technique (unconfirmed) | Export orientation/pixels | Provisional group IDs |\n| --- | --- | --- | --- | --- | --- | --- |\n${rows.join("\n")}\n\n## Ambiguities needing owner decisions\n\n${[...new Set(records.flatMap((record) => record.classification.ambiguities))].map((value) => `- ${value}`).join("\n")}\n- Numeric filenames are source provenance, not artwork identity. Similar outline/painted photographs and multiple views may depict related/same works: confirm which remain distinct IDs and which represent views before any permanent catalogue decision.\n\n## Provisional visual groups (NO series/project names supplied)\n\n${plan.groups.map((group) => `- ${group.reviewLabel} (${group.id}): ${group.basis} Members: ${group.ids.map(idFor).join(", ")}.`).join("\n")}\n\nPossible relationships, not confirmed identities:\n${(plan.possibleRelationships ?? []).map((pair) => `- ${pair.ids.map(idFor).join(" / ")}: ${pair.note}`).join("\n")}\n\n## Image/colour/format findings\n\n- ${records.filter((record) => !record.image.hasIcc).length}/${records.length} sources have no embedded ICC profile; explicitly interpreted as sRGB for this reversible LOCAL comparison only. Source originals remain unchanged. Derivatives are oriented/tagged sRGB, contain no copied private EXIF/GPS or invented creator/rights; no crop, retouch, lighting/white-balance or perspective correction.\n- Snapshot exclusions: see snapshot.json. All source pixels/export orientation preserved; many square exports photograph portrait/landscape works with background, so export orientation is not a physical artwork measurement.\n${(plan.problems ?? []).map((problem) => `- ${problem.ids.map(idFor).join(", ")}: ${problem.note}`).join("\n")}\n- Numerical derivative/source comparisons are in report.json; they compare to the digital Instagram snapshot only, never establish physical-artwork colour fidelity.\n\n## Review/screenshots/checks\n\n- Site: site/ (local static production-component build, noindex/private pilot disclosure, no author/rights/offer or production approval).\n- Screenshots: screenshots/ — ${report.pages.length} captures at360/768/1440×900.\n- Contact sheets: ${directory}/contact-sheets/.\n- Accessibility/reflow/local references/intrinsic/metadata/budgets: report.json. Observed axe violations ${report.pages.flatMap((page) => page.accessibility.violations).length}; reflow failures ${report.pages.filter((page) => !page.reflow).length}. No full WCAG/manual acceptance claim.\n${medians.join("\n")}\n- Lab profile360×800/DPR1,1.6Mbps down/750kbps up/150ms latency/CPU4x/cache disabled,3runs per representative page; not field INP or indexing evidence.\n\n## Next genuine owner gate\n\nReview date proxies, exact media/techniques/unknowns and probable print process, whether process images are separate works or views, provisional relationships/groups, candidate composition and real reproduction quality. Choose/refine the actual pilot/sequence and provide titles/project names/rights/physical sizes only when available. Missing physical measurements do not block this pilot. Any permanent public-source asset/metadata use, publication status, approved launch manifest or final selection still requires explicit later permission. Actual production release:check remains BLOCKED_CONTENT; no deployment/messages/payment/hosting action. M09 is not complete.\n`;
  const samples = plan.groups.map((group) => `- ${group.id}: displayed layout sample ${(group.previewIds ?? group.ids).map(idFor).join(", ")}; the full candidate list above is retained separately and neither is a final series/order.`).join("\n");
  await writeFile(resolve(root, "owner-review-summary.md"), text.replace("Possible relationships, not confirmed identities:", `Displayed group-layout samples (review only):\n${samples}\n\nPossible relationships, not confirmed identities:`), { mode: 0o600 });
  await writeFile(resolve(root, "README.md"), `# Local M09 real-image pilot\n\nStart with owner-review-summary.md, screenshots/, report.json and provisional-records.json. All dates/classifications/groupings/selection/layout choices are provisional; no original artwork titles, project names, rights/authorship, sizes/prices/edition facts or public approval invented. This directory is outside public Git. Serve site/ only on127.0.0.1 using the repository pilot serve command; never publish/upload it.\n`, { mode: 0o600 });
}

export async function servePilot(directory) {
  const root = await realpath(localPilotOutput(directory));
  const { createServer } = await import("node:http");
  const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml", ".xml": "application/xml" };
  const { extname } = await import("node:path");
  const server = createServer(async (request, response) => {
    try {
      const path = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
      let file = resolve(root, `.${path}`);
      if (!file.startsWith(`${root}/`) && file !== root) throw new Error("unsafe path");
      if ((await lstat(file)).isDirectory()) file = resolve(file, "index.html");
      if (!(await realpath(file)).startsWith(`${root}/`) || (await lstat(file)).isSymbolicLink()) throw new Error("unsafe source");
      response.setHeader("X-Robots-Tag", "noindex, nofollow");
      response.setHeader("Content-Type", mime[extname(file)] ?? "application/octet-stream");
      response.end(await readFile(file));
    } catch { response.writeHead(404).end("Local review file not found"); }
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { origin: `http://127.0.0.1:${server.address().port}`, stop: () => new Promise((resolve) => server.close(resolve)) };
}
