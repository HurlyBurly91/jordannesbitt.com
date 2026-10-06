import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { artworkSchema, projectSchema, validateCatalogue, recordAssets } from "../../src/lib/catalogue.ts";
import { readCatalogue, mediaSource } from "../../src/lib/catalogue-source.ts";
import { ingest, checksum } from "./ingestion.mjs";
import { hashBytes } from "./pilot-snapshot.mjs";
import { loadSnapshot } from "./real-pilot.mjs";
import { inside, privateRoot, safeFile, atomicJson, jsonFile, exists, fileHash, lock, defaultDataRoot } from "./studio-paths.mjs";

export const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));
const idPattern = /^[a-z][a-z0-9-]*$/;
const clone = (value) => structuredClone(value);
export function readableError(error) {
  return error.issues ? error.issues.map((issue) => `${issue.path.join(".") || "Record"}: ${issue.message}`).join("\n") : error.message;
}
export async function openStudio({ dataRoot = defaultDataRoot(), repository = repositoryRoot, testMode = false, snapshotPath, allowPublicExport = false, ingestionDependencies = {} } = {}) {
  const base = await privateRoot(dataRoot, repository, testMode);
  const root = await privateRoot(resolve(base, "studio"), repository, testMode);
  const registryPath = resolve(base, "id-registry.json");
  if (!await exists(registryPath)) throw new Error("M09 neutral-ID registry is missing. Restore it before authoring; existing IDs must never be silently reassigned.");
  const registry = await jsonFile(base, registryPath);
  if (registry.version !== 1 || !Number.isInteger(registry.next) || registry.next < 1) throw new Error("Invalid neutral-ID registry");
  const releaseLock = await lock(root, "studio.lock");
  const statePath = resolve(root, "state.json");
  let state;
  try {
    state = await exists(statePath) ? await jsonFile(root, statePath) : { version: 1, revision: 0, catalogue: clone(readCatalogue(repository)), assets: {}, media: [], workflow: {}, notes: {}, jobs: [], previews: [], exportPlans: {} };
    if (state.version !== 1) throw new Error("Unsupported studio state version");
    for (const work of state.catalogue.artworks) {
      state.workflow[work.id] ??= { titleProvided: true, reviewed: null, approved: null };
      for (const url of recordAssets(work)) if (!state.assets[url]) state.assets[url] = { path: mediaSource(repository, url), public: true, sha256: await fileHash(repository, mediaSource(repository, url)) };
    }
    for (const record of state.catalogue.professional) for (const url of recordAssets(record)) if (!state.assets[url]) state.assets[url] = { path: mediaSource(repository, url), public: true, sha256: await fileHash(repository, mediaSource(repository, url)) };
    for (const project of state.catalogue.projects) state.workflow[project.id] ??= { titleProvided: true, reviewed: null, approved: null };
    for (const job of state.jobs) if (["pending", "running"].includes(job.status)) { job.status = "error"; job.error = "Intake was interrupted; no completed item was recorded. Retry explicitly."; }
  } catch (error) { await releaseLock(); throw error; }
  let queue = Promise.resolve();
  let closed = false;
  const pending = new Set();
  async function assetBytes(url, current = state) {
    const entry = current.assets[url];
    if (!entry) throw new Error(`Missing private derivative: ${url}`);
    const bytes = await readFile(await safeFile(entry.public ? repository : base, entry.path));
    if (checksum(bytes) !== entry.sha256) throw new Error("Derivative changed; re-review media before export or preview");
    return bytes;
  }
  async function validate(next) {
    const urls = new Set();
    for (const work of [...next.catalogue.artworks, ...next.catalogue.professional]) for (const url of recordAssets(work)) { await assetBytes(url, next); urls.add(url); }
    next.catalogue = validateCatalogue(next.catalogue, { assetExists: (url) => urls.has(url) });
    if (next.catalogue.artworks.filter((work) => work.homepageLead).length > 1) throw new Error("Only one homepage lead is allowed; choose it in Curation");
    const positions = next.catalogue.artworks.filter((work) => work.featured && work.selectedOrder !== undefined).map((work) => work.selectedOrder);
    if (new Set(positions).size !== positions.length) throw new Error("Selected Work positions must be unique; reorder in Curation");
    return next;
  }
  async function transact(action) {
    const result = queue.then(async () => {
      const next = clone(state);
      const value = await action(next);
      await validate(next);
      next.revision++;
      await atomicJson(root, statePath, next);
      state = next;
      return value;
    });
    queue = result.catch(() => {});
    return result;
  }
  async function digest(record, current = state) {
    const media = "reproductions" in record ? recordAssets(record).map((url) => ({ url, sha256: current.assets[url]?.sha256 })) : [];
    return hashBytes(Buffer.from(JSON.stringify({ record, media })));
  }
  async function globalDigest(current = state) { return hashBytes(Buffer.from(JSON.stringify({ catalogue: current.catalogue, assets: current.assets }))); }
  function invalidate(next, id) { next.workflow[id] = { ...next.workflow[id], reviewed: null, approved: null }; }
  function recordFor(current, id) { return [...current.catalogue.artworks, ...current.catalogue.projects].find((record) => record.id === id); }
  async function allocate() {
    const unlock = await lock(base, "studio-registry.lock");
    try {
      const old = await fileHash(base, registryPath), current = await jsonFile(base, registryPath);
      const id = `w-${String(current.next++).padStart(4, "0")}`;
      if (recordFor(state, id) || Object.values(current.entries).some((entry) => entry.id === id)) throw new Error("Neutral-ID allocation collision; restore/reconcile registry");
      current.studioAllocations ??= [];
      current.studioAllocations.push({ id, allocatedAt: new Date().toISOString() });
      if (await fileHash(base, registryPath) !== old) throw new Error("Registry changed concurrently; retry without overwriting it");
      await atomicJson(base, registryPath, current);
      return id;
    } finally { await unlock(); }
  }
  async function attach(next, media, options, requestedId) {
    if (options.purpose === "media") return null;
    if (options.purpose === "attach") {
      const work = next.catalogue.artworks.find((record) => record.id === options.artworkId);
      if (!work) throw new Error("Choose an existing artwork for this reproduction");
      if (work.reproductions.some((image) => image.src === media.reproduction.src)) throw new Error("This exact image is already attached; edit its role/order instead");
      if (options.role === "primary") throw new Error("Attach as a view first, then explicitly choose the primary reproduction in the editor");
      work.reproductions.push({ ...media.reproduction, role: options.role ?? "alternate" });
      invalidate(next, work.id);
      return work.id;
    }
    if (options.purpose !== "artwork") throw new Error("Choose private media, separate artwork, or explicit attachment");
    const id = requestedId ?? await allocate();
    if (recordFor(next, id)) throw new Error("Duplicate artwork ID; open the existing work or attach a view explicitly");
    const record = artworkSchema.parse({ id, slug: id, title: `Private draft ${id} (title not supplied)`, medium: "unclassified", kind: "unclassified", date: { certainty: "unknown" }, reproductions: [media.reproduction] });
    next.catalogue.artworks.push(record);
    next.workflow[id] = { titleProvided: false, reviewed: null, approved: null };
    return id;
  }
  async function registerMedia(next, result, source, options, requestedId) {
    const directory = resolve(root, "derivatives", result.draft.id);
    const manifest = await jsonFile(root, resolve(directory, "manifest.json"));
    for (const file of manifest.files) {
      const url = `/media/${result.draft.id}/${file.name}`;
      const path = await safeFile(root, resolve(directory, file.name));
      if (await fileHash(root, path) !== file.sha256) throw new Error("Invalid generated derivative checksum");
      next.assets[url] = { path, sha256: file.sha256, public: false };
    }
    const media = { id: result.draft.id, name: source.name, sourceSha256: result.sourceSha256, source, reproduction: result.draft.reproductions[0], disposition: options.purpose === "media" ? "private reference/media only" : "owner-selected relationship" };
    next.media.push(media);
    return { mediaId: media.id, artworkId: await attach(next, media, options, requestedId) };
  }
  async function startJob(operation) {
    const id = randomUUID();
    await transact((next) => { next.jobs.push({ id, status: "running", started: new Date().toISOString() }); });
    const run = (async () => {
      try {
        const result = await operation();
        await transact((next) => { Object.assign(next.jobs.find((job) => job.id === id), { status: "complete", result }); });
      } catch (error) { await transact((next) => { Object.assign(next.jobs.find((job) => job.id === id), { status: "error", error: readableError(error) }); }); }
    })();
    pending.add(run); run.catch(() => {}).finally(() => pending.delete(run));
    return id;
  }
  try { await validate(state); await atomicJson(root, statePath, state); }
  catch (error) { await releaseLock(); throw error; }
  const studio = {
    base, root, repository, allowPublicExport, snapshotPath,
    state: () => clone(state), transact, digest, globalDigest, assetBytes, recordFor,
    async close() { if (closed) return; closed = true; await Promise.all([...pending]); await queue; await releaseLock(); },
    async waitForJobs() { await Promise.all([...pending]); },
    async inspectImage(bytes, options = {}) {
      // Readonly Studio question adapter, not a replacement for authoritative ingest.
      // No input copy, job, registry allocation, draft or persistent colour default.
      if (!Buffer.isBuffer(bytes) || bytes.length === 0 || bytes.length > 30 * 1024 * 1024) throw new Error("Select an image up to30MiB");
      if (options.sha256 && checksum(bytes) !== options.sha256) throw new Error("Selected-file hash does not match upload bytes");
      const metadata = await sharp(bytes, { failOn: "error", limitInputPixels: 100_000_000 }).metadata();
      if (!["jpeg", "png", "tiff", "webp", "heif", "avif"].includes(metadata.format) || metadata.pages > 1 || !metadata.width || !metadata.height) throw new Error("Choose a single supported photo export");
      return { sourceSha256: checksum(bytes), hasEmbeddedProfile: Boolean(metadata.icc), needsColourDecision: !metadata.icc };
    },
    async intake(bytes, options = {}) {
      if (!Buffer.isBuffer(bytes) || bytes.length === 0 || bytes.length > 30 * 1024 * 1024) throw new Error("Select an image up to30MiB");
      if (!options.name || basename(options.name) !== options.name || /[\\/\0]/.test(options.name)) throw new Error("Unsafe selected filename");
      if (!/\.(jpe?g|png|tiff?|webp|avif)$/i.test(options.name)) throw new Error("Choose a supported single-image export");
      if (options.sha256 && checksum(bytes) !== options.sha256) throw new Error("Selected-file hash does not match upload bytes");
      if (!["media", "artwork", "attach"].includes(options.purpose)) throw new Error("Choose media identity explicitly");
      const mediaId = `image-${randomUUID().replaceAll("-", "")}`;
      await mkdir(resolve(root, "uploads"), { recursive: true, mode: 0o700 });
      const input = await safeFile(root, resolve(root, "uploads", `${mediaId}${options.name.slice(options.name.lastIndexOf(".")).toLowerCase()}`), { missing: true });
      await writeFile(input, bytes, { mode: 0o600, flag: "wx" });
      return startJob(async () => {
        const result = await ingest({ input, output: resolve(root, "derivatives"), id: mediaId, title: "Private selected image", medium: "unclassified", kind: "unclassified", alt: "Private selected image; alt text needs owner review", assumeSrgb: options.assumeSrgb === true }, ingestionDependencies);
        if (await fileHash(root, input) !== checksum(bytes)) throw new Error("Private upload copy changed during intake");
        return transact((next) => registerMedia(next, result, { name: options.name, sha256: checksum(bytes), lastModified: options.lastModified ?? null }, options));
      });
    },
    async snapshotChoices() {
      if (!snapshotPath) return [];
      const { snapshot } = await loadSnapshot(snapshotPath);
      return snapshot.included.map(({ id, image }) => ({ id, orientation: image.orientation, width: image.width, height: image.height, hasEmbeddedProfile: image.hasIcc }));
    },
    async importSnapshot(id, options = {}) {
      if (!snapshotPath || !idPattern.test(id)) throw new Error("Choose an ID from the explicitly configured frozen snapshot");
      if (!inside(base, resolve(snapshotPath))) throw new Error("Snapshot must belong to the persistent private root");
      const { snapshot, directory } = await loadSnapshot(snapshotPath);
      const entry = snapshot.included.find((item) => item.id === id);
      if (!entry) throw new Error("Snapshot ID not found");
      const currentRegistry = await jsonFile(base, registryPath);
      if (currentRegistry.entries[entry.file]?.id !== id) throw new Error("Snapshot/registry identity mismatch");
      if (options.purpose === "artwork" && recordFor(state, id)) throw new Error("Duplicate artwork ID; attach a view or open the existing work");
      if (options.assumeSrgb !== true && !entry.image.hasIcc) throw new Error("Untagged source requires explicit local sRGB interpretation");
      return startJob(async () => {
        // Reuse only checksum-verified pipeline output; never import provisional catalogue/group choices.
        const source = resolve(directory, entry.snapshotRelativeFile);
        await safeFile(directory, source);
        const cached = await ingest({ input: source, output: resolve(directory, "derivatives"), id, title: `Private selected ${id}`, medium: "unclassified", kind: "unclassified", alt: "Private snapshot image; alt text requires review", assumeSrgb: options.assumeSrgb === true }, ingestionDependencies);
        const manifest = await jsonFile(directory, resolve(directory, "derivatives", id, "manifest.json"));
        return transact(async (next) => {
          for (const file of manifest.files) next.assets[`/media/${id}/${file.name}`] = { path: await safeFile(base, resolve(directory, "derivatives", id, file.name)), sha256: file.sha256, public: false };
          const media = { id: `snapshot-${id}-${randomUUID().slice(0,8)}`, name: `Frozen image ${id}`, sourceSha256: entry.sha256, source: { snapshotSha256: snapshot.snapshotSha256, neutralId: id, provisionalCreationDate: entry.provisionalCreationDate }, reproduction: { ...cached.draft.reproductions[0], alt: "Private snapshot image; alt text requires owner review" }, disposition: options.purpose === "media" ? "private reference/media only" : "owner-selected relationship" };
          next.media.push(media);
          return { mediaId: media.id, artworkId: await attach(next, media, options, options.purpose === "artwork" ? id : undefined) };
        });
      });
    },
    async saveArtwork(id, input, note) {
      return transact((next) => {
        const at = next.catalogue.artworks.findIndex((work) => work.id === id);
        if (at < 0 || input.id !== id) throw new Error("Artwork ID is immutable; duplicate/new IDs require explicit intake");
        const record = artworkSchema.parse(input);
        if (record.fixture) throw new Error("Fixture flags are not artwork authoring fields");
        const published = readCatalogue(repository).artworks.find((work) => work.id === id);
        if (published && published.slug !== record.slug && !record.aliases.includes(published.slug)) throw new Error("Preserve the former public slug as a compatibility alias before changing a stable URL");
        next.catalogue.artworks[at] = record;
        next.workflow[id].titleProvided = !/^Private draft .*\(title not supplied\)$/.test(record.title);
        if (note !== undefined) next.notes[id] = String(note).slice(0, 10000);
        invalidate(next, id);
        return record;
      });
    },
    async saveProject(input, note) {
      return transact((next) => {
        const id = input.id || `p-${randomUUID().replaceAll("-", "").slice(0,16)}`;
        if (next.catalogue.artworks.some((work) => work.id === id)) throw new Error("Duplicate catalogue ID");
        const project = projectSchema.parse({ ...input, id, slug: input.slug || id });
        const at = next.catalogue.projects.findIndex((record) => record.id === id);
        const published = readCatalogue(repository).projects.find((record) => record.id === id);
        if (published && published.slug !== project.slug && !project.aliases.includes(published.slug)) throw new Error("Preserve the former public project slug as an alias");
        if (at < 0) next.catalogue.projects.push(project); else next.catalogue.projects[at] = project;
        next.workflow[id] ??= { titleProvided: true, reviewed: null, approved: null };
        invalidate(next, id);
        if (note !== undefined) next.notes[id] = String(note).slice(0,10000);
        return project;
      });
    },
    async curate({ selectedIds, homepageLeadId }) {
      if (!Array.isArray(selectedIds) || new Set(selectedIds).size !== selectedIds.length) throw new Error("Selected Work must contain unique ordered artwork IDs");
      return transact((next) => {
        const known = new Set(next.catalogue.artworks.map((work) => work.id));
        if (selectedIds.some((id) => !known.has(id)) || (homepageLeadId && !known.has(homepageLeadId))) throw new Error("Curation refers to an unknown artwork");
        for (const work of next.catalogue.artworks) {
          work.featured = selectedIds.includes(work.id);
          work.selectedOrder = work.featured ? selectedIds.indexOf(work.id) : undefined;
          work.homepageLead = work.id === homepageLeadId;
          invalidate(next, work.id);
        }
      });
    },
    async attachMedia(mediaId, options) {
      return transact((next) => {
        const media = next.media.find((entry) => entry.id === mediaId);
        if (!media) throw new Error("Private media not found");
        return attach(next, media, { ...options, purpose: "attach" });
      });
    },
    async markReviewed(id) {
      return transact(async (next) => {
        const currentDigest = await globalDigest(next);
        if (!next.previews.some((preview) => preview.digest === currentDigest)) throw new Error("Build/open a current preview before marking local review");
        const record = recordFor(next, id);
        if (!record) throw new Error("Record not found");
        next.workflow[id].reviewed = await digest(record, next);
        next.workflow[id].approved = null;
      });
    },
    async approve(id, { confirmation, rightsConfirmed }) {
      return transact(async (next) => {
        const record = recordFor(next, id), workflow = next.workflow[id];
        if (!record || !workflow) throw new Error("Record not found");
        const sha256 = await digest(record, next);
        if (workflow.reviewed !== sha256) throw new Error("Review the current record/media locally before public-source approval");
        if (confirmation !== "APPROVE PUBLIC SOURCE" || rightsConfirmed !== true) throw new Error("Explicit disclosure confirmation and reproduction-rights confirmation are required; schema validity is not approval");
        if (!workflow.titleProvided || /\((?:authored )?title not supplied\)/i.test(record.title) || record.medium === "unclassified" || record.kind === "unclassified") throw new Error("Supply an actual title and confirmed medium/object kind before public-source approval");
        if ("reproductions" in record && (!record.reproductions.length || record.reproductions.some((image) => /^Private .*owner review|^Private .*needs owner review/.test(image.alt)))) throw new Error("Review real alt text and primary image before approval");
        next.workflow[id].approved = { sha256, approvedAt: new Date().toISOString(), disclosure: true, rightsConfirmed: true };
      });
    },
  };
  return studio;
}
