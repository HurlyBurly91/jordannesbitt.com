import { readFile, writeFile, mkdir, rename, unlink, copyFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readCatalogue, mediaSource } from "../../src/lib/catalogue-source.ts";
import { recordAssets, validateCatalogue } from "../../src/lib/catalogue.ts";
import { hashBytes } from "./pilot-snapshot.mjs";
import { safeFile, exists, atomicJson, fileHash, lock } from "./studio-paths.mjs";

const run = promisify(execFile);
async function publicSourceHash(root) {
  const buffers = await Promise.all(["artworks", "projects", "professional"].map(async (name) => [name, hashBytes(await readFile(await safeFile(root, resolve(root, `src/content/${name}.json`))))]));
  const catalogue = readCatalogue(root);
  const urls = [...new Set([...catalogue.artworks, ...catalogue.professional].flatMap(recordAssets))];
  const assets = await Promise.all(urls.map(async (url) => [url, await fileHash(root, mediaSource(root, url))]));
  return hashBytes(Buffer.from(JSON.stringify({ buffers, assets })));
}
function selectedIds(values, label) {
  if (!Array.isArray(values) || values.some((value) => !/^[a-z][a-z0-9-]*$/.test(value)) || new Set(values).size !== values.length) throw new Error(`${label} must be unique explicit IDs`);
  return values;
}
export async function prepareExport(studio, { artworkIds = [], projectIds = [] } = {}) {
  selectedIds(artworkIds, "Artworks"); selectedIds(projectIds, "Projects");
  if (!artworkIds.length && !projectIds.length) throw new Error("Select the exact records to export; no automatic whole-catalogue export");
  return studio.transact(async (state) => {
    const selected = [...artworkIds, ...projectIds].map((id) => {
      const record = studio.recordFor(state, id);
      if (!record) throw new Error(`Unknown export record ${id}`);
      return record;
    });
    for (const record of selected) {
      const sha256 = await studio.digest(record, state);
      if (state.workflow[record.id]?.approved?.sha256 !== sha256) throw new Error(`Explicit public-source approval is missing/stale for ${record.id}`);
    }
    const current = readCatalogue(studio.repository);
    const catalogue = structuredClone(current);
    for (const [name, ids] of [["artworks", artworkIds], ["projects", projectIds]]) for (const id of ids) {
      const record = state.catalogue[name].find((entry) => entry.id === id);
      if (!record) throw new Error(`ID does not belong to selected ${name}`);
      const at = catalogue[name].findIndex((entry) => entry.id === id);
      if (at < 0) catalogue[name].push(record); else catalogue[name][at] = record;
    }
    const approvedUrls = new Set(selected.filter((record) => "reproductions" in record).flatMap(recordAssets));
    const presentUrls = new Set([...current.artworks, ...current.professional].flatMap(recordAssets));
    validateCatalogue(catalogue, { assetExists: (url) => approvedUrls.has(url) || presentUrls.has(url) });
    const token = randomUUID();
    const directory = resolve(studio.root, "exports", token);
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const files = [];
    for (const name of ["artworks", "projects"]) {
      const bytes = Buffer.from(JSON.stringify(catalogue[name], null, 2) + "\n");
      const path = `src/content/${name}.json`;
      const destination = await safeFile(studio.repository, resolve(studio.repository, path));
      const before = await fileHash(studio.repository, destination), sha256 = hashBytes(bytes);
      if (before === sha256) continue;
      const staged = resolve(directory, `${name}.json`);
      await writeFile(staged, bytes, { mode: 0o600, flag: "wx" });
      files.push({ path, sha256, before, bytes: bytes.length, staged, kind: "metadata" });
    }
    for (const url of approvedUrls) {
      const bytes = await studio.assetBytes(url, state), sha256 = hashBytes(bytes);
      const path = `src${url}`, destination = await safeFile(studio.repository, resolve(studio.repository, path), { missing: true });
      const before = await exists(destination) ? await fileHash(studio.repository, destination) : null;
      if (before && before !== sha256) throw new Error(`Public derivative collision at ${path}; existing reviewed media is never silently replaced`);
      if (before) continue;
      const staged = resolve(directory, "media", url.slice("/media/".length));
      await mkdir(dirname(staged), { recursive: true, mode: 0o700 });
      await writeFile(staged, bytes, { mode: 0o600, flag: "wx" });
      files.push({ path, sha256, before, bytes: bytes.length, staged, kind: "derivative" });
    }
    const plan = { token, revision: state.revision + 1, draftDigest: await studio.globalDigest(state), publicDigest: await publicSourceHash(studio.repository), catalogue, files, artworkIds, projectIds, dryRun: true, repositoryWritesEnabled: studio.allowPublicExport, launchManifestCreated: false, deploymentAuthorized: false };
    state.exportPlans[token] = plan;
    await atomicJson(studio.root, resolve(directory, "plan.json"), plan);
    return { ...plan, files: files.map(({ staged, ...file }) => file), privateNotesAndSourcesExcluded: true };
  });
}

// BEGIN CANONICAL ALGORITHM: explicit owner-approved public-source export
// Reference: docs/studio.md
export async function executeExport(studio, { token, confirmation }, dependencies = {}) {
  if (!studio.allowPublicExport) throw new Error("Repository writes are disabled. Owner must explicitly start studio with --allow-public-export; dry-run remains available.");
  if (confirmation !== `EXPORT ${token}`) throw new Error("Confirm the exact displayed export plan, separately from public-source approval");
  return studio.transact(async (state) => {
    const plan = state.exportPlans[token];
    if (!plan || plan.revision !== state.revision || plan.draftDigest !== await studio.globalDigest(state)) throw new Error("Export plan is stale; prepare/review a new dry-run");
    const branch = (await run("git", ["branch", "--show-current"], { cwd: studio.repository })).stdout.trim();
    if (branch !== "redesign/astro-foundation") throw new Error("Public-source export is restricted to redesign/astro-foundation, never master or deployment");
    const journalPath = resolve(studio.root, "export-journal.json");
    if (await exists(journalPath)) {
      const journal = JSON.parse(await readFile(await safeFile(studio.root, journalPath)));
      if (["writing", "conflict"].includes(journal.status)) throw new Error("Interrupted export requires explicit reconciliation; no further repository write is allowed");
    }
    const releaseLock = await lock(studio.root, "export.lock");
    const written = [];
    try {
      if (plan.publicDigest !== await publicSourceHash(studio.repository)) throw new Error("Public catalogue/media changed after dry-run; do not overwrite concurrent work");
      for (const id of [...plan.artworkIds, ...plan.projectIds]) if (state.workflow[id]?.approved?.sha256 !== await studio.digest(studio.recordFor(state, id), state)) throw new Error("Public-source approval became stale");
      const journal = { token, status: "writing", written, files: plan.files.map(({ staged, ...file }) => file) };
      await atomicJson(studio.root, journalPath, journal);
      for (const file of [...plan.files.filter((file) => file.kind === "derivative"), ...plan.files.filter((file) => file.kind === "metadata")]) {
        if (!/^src\/(?:content\/(?:artworks|projects)\.json|media\/[a-z0-9][a-z0-9/_-]*\.(?:jpg|jpeg|png|webp|avif|mp4|webm|vtt|pdf))$/.test(file.path)) throw new Error("Export path is outside canonical content/media allowlist");
        const destination = await safeFile(studio.repository, resolve(studio.repository, file.path), { missing: true });
        const before = await exists(destination) ? await fileHash(studio.repository, destination) : null;
        if (before !== file.before) throw new Error("Target changed after dry-run; stopping export");
        if (await fileHash(studio.root, file.staged) !== file.sha256) throw new Error("Prepared export bytes changed; re-prepare approval/export");
        const backup = resolve(studio.root, "exports", token, "backups", file.path);
        if (before) { await mkdir(dirname(backup), { recursive: true, mode: 0o700 }); await copyFile(destination, backup); }
        await mkdir(dirname(destination), { recursive: true });
        await safeFile(studio.repository, destination, { missing: true });
        const bytes = await readFile(file.staged);
        if (file.kind === "derivative") await writeFile(destination, bytes, { flag: "wx" });
        else {
          const temp = `${destination}.studio-${token}.pending`;
          await writeFile(temp, bytes, { flag: "wx" });
          await rename(temp, destination);
        }
        written.push({ path: file.path, before, sha256: file.sha256, backup: before ? backup : null });
        await atomicJson(studio.root, journalPath, journal);
        if (dependencies.afterWrite) await dependencies.afterWrite(file, written.length);
      }
      readCatalogue(studio.repository);
      journal.status = "complete";
      await atomicJson(studio.root, journalPath, journal);
      for (const id of [...plan.artworkIds, ...plan.projectIds]) state.workflow[id].exported = { sha256: state.workflow[id].approved.sha256, at: new Date().toISOString() };
      return { status: "exported-public-source", paths: written.map((file) => file.path), deploymentAuthorized: false, launchManifestCreated: false, committed: false };
    } catch (error) {
      let conflict = false;
      for (const file of [...written].reverse()) {
        const destination = await safeFile(studio.repository, resolve(studio.repository, file.path), { missing: true });
        if (!await exists(destination) || await fileHash(studio.repository, destination) !== file.sha256) { conflict = true; continue; }
        if (file.backup) await copyFile(await safeFile(studio.root, file.backup), destination); else await unlink(destination);
      }
      await atomicJson(studio.root, journalPath, { token, status: conflict ? "conflict" : "rolled-back", written, error: error.message });
      throw new Error(`${error.message}${conflict ? "; concurrent target edits preserved; reconcile export journal" : "; own export writes rolled back"}`);
    } finally { await releaseLock(); }
  });
}
// END CANONICAL ALGORITHM: explicit owner-approved public-source export
