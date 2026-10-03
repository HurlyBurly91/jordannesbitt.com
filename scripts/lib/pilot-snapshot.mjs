import { readdir, realpath, open, mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve, relative, dirname, extname, basename } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";

export const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
export const hashBytes = (bytes) => createHash("sha256").update(bytes).digest("hex");
export function calendarDate(mtime, timezone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(mtime)).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function localPilotOutput(directory) {
  const path = resolve(directory);
  if (!path.startsWith("/tmp/opencode/")) throw new Error("Private pilot output must stay inside approved /tmp/opencode, outside public Git");
  return path;
}
async function readJson(path) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return null; throw error; }
}
async function atomicJson(path, value) {
  const temp = `${path}.${randomUUID()}.tmp`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600, flag: "wx" });
  await rename(temp, path);
}

// BEGIN CANONICAL ALGORITHM: frozen local-only image pilot snapshot
// Reference: docs/catalogue.md
export async function snapshotImages({ source, output = "/tmp/opencode/jordannesbitt-m09", timezone = Intl.DateTimeFormat().resolvedOptions().timeZone }) {
  if (!source) throw new Error("An explicitly owner-authorized --source directory is required");
  const sourceRoot = await realpath(resolve(source));
  const base = localPilotOutput(output);
  const startedAt = new Date().toISOString();
  const names = [], ignored = [];
  async function enumerate(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name), name = relative(sourceRoot, path);
      if (entry.isSymbolicLink()) { ignored.push({ file: name, reason: "symlink not followed" }); continue; }
      if (entry.isDirectory()) { await enumerate(path); continue; }
      if (entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase())) names.push(name);
      else ignored.push({ file: name, reason: "non-image/unsupported extension; contents never opened" });
    }
  }
  await enumerate(sourceRoot);
  names.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const enumeratedAt = new Date().toISOString();
  await mkdir(base, { recursive: true, mode: 0o700 });
  const registryPath = resolve(base, "id-registry.json");
  const prior = await readJson(registryPath);
  if (!prior) {
    try { if ((await readdir(resolve(base, "snapshots"))).length) throw new Error("Existing snapshots without ID registry: restore registry, never silently reassign IDs"); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  const registry = prior ?? { version: 1, sourceRoot, next: 1, entries: {} };
  if (registry.sourceRoot !== sourceRoot || registry.version !== 1) throw new Error("Registry belongs to another source/version; do not reuse conceptual IDs");
  const runId = `run-${startedAt.replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`;
  const directory = resolve(base, "snapshots", runId);
  await mkdir(resolve(directory, "originals"), { recursive: true, mode: 0o700 });
  const included = [], excluded = [];
  for (const name of names) {
    const path = resolve(sourceRoot, name);
    let handle;
    try {
      if (!(await realpath(path)).startsWith(`${sourceRoot}/`)) throw new Error("Selected image escaped authorized source root");
      handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
      const before = await handle.stat({ bigint: true });
      if (!before.isFile()) throw new Error("not a regular image file");
      const bytes = await handle.readFile();
      const after = await handle.stat({ bigint: true });
      if (before.size !== after.size || before.mtimeNs !== after.mtimeNs || BigInt(bytes.length) !== after.size) throw new Error("file changed while copying; deferred to a new snapshot");
      const meta = await sharp(bytes, { failOn: "error", limitInputPixels: 100_000_000 }).metadata();
      if (!["jpeg", "png", "webp", "heif", "avif", "tiff"].includes(meta.format) || (meta.pages ?? 1) > 1 || !meta.width || !meta.height) throw new Error("unsupported/animated/multipage or missing pixel dimensions");
      const sha256 = hashBytes(bytes);
      const existing = registry.entries[name];
      const id = existing?.id ?? `w-${String(registry.next++).padStart(4, "0")}`;
      if (!existing) registry.entries[name] = { id, allocatedAt: startedAt, firstSha256: sha256, revisions: [] };
      const entry = registry.entries[name];
      if (!entry.revisions.some((revision) => revision.sha256 === sha256)) entry.revisions.push({ sha256, seenAt: startedAt });
      const destination = resolve(directory, "originals", name);
      await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
      await writeFile(destination, bytes, { flag: "wx", mode: 0o600 });
      const mtime = Number(before.mtimeNs / 1_000_000n);
      const rotated = [5, 6, 7, 8].includes(meta.orientation);
      const width = rotated ? meta.height : meta.width, height = rotated ? meta.width : meta.height;
      included.push({
        id, file: name, instagramFilename: basename(name), instagramNumericStem: /^\d+$/.test(basename(name, extname(name))) ? basename(name, extname(name)) : null,
        sha256, bytes: bytes.length, sourceMtimeNs: before.mtimeNs.toString(), sourceMtimeUtc: new Date(mtime).toISOString(),
        provisionalCreationDate: { value: calendarDate(mtime, timezone), status: "provisional-owner-instructed", source: "source filesystem modification calendar date", timezone, request: "M09-R1-02", revisionNeeded: true },
        image: { format: meta.format, width, height, storedWidth: meta.width, storedHeight: meta.height, orientation: width === height ? "square" : width > height ? "landscape" : "portrait", exifOrientation: meta.orientation ?? null, hasIcc: Boolean(meta.icc), colourSpace: meta.space, hasExif: Boolean(meta.exif) },
        snapshotRelativeFile: `originals/${name}`, changedSinceFirstSeen: entry.firstSha256 !== sha256,
        ownerFacts: { title: null, physicalDimensions: [], availability: "unknown", price: null, edition: null, projectNames: [], rights: null, authorship: null, published: false },
      });
    } catch (error) { excluded.push({ file: name, reason: error.message }); }
    finally { await handle?.close(); }
  }
  await atomicJson(registryPath, registry);
  const snapshot = { version: 1, kind: "LOCAL M09 REAL-IMAGE PILOT — NOT PUBLIC CONTENT OR RIGHTS/SELECTION APPROVAL", request: "M09-R1", sourceRoot, startedAt, enumeratedAt, completedAt: new Date().toISOString(), timezone, runId, registryPath, supportedExtensions: [...imageExtensions], enumeratedFiles: names, included, excluded, ignored, laterFilesPolicy: "Only this frozen listing/copy/checksum set is used; new exports need a new run", publicationAuthorized: false };
  snapshot.snapshotSha256 = hashBytes(Buffer.from(JSON.stringify(snapshot)));
  await atomicJson(resolve(directory, "snapshot.json"), snapshot);
  await atomicJson(resolve(base, "latest-snapshot.json"), { runId, snapshot: resolve(directory, "snapshot.json"), snapshotSha256: snapshot.snapshotSha256 });
  return { directory, snapshot };
}
// END CANONICAL ALGORITHM: frozen local-only image pilot snapshot

const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
export async function makeContactSheets(directory, snapshot) {
  await mkdir(resolve(directory, "contact-sheets"), { recursive: true, mode: 0o700 });
  const sheets = [];
  for (let offset = 0; offset < snapshot.included.length; offset += 24) {
    const rows = snapshot.included.slice(offset, offset + 24);
    const cellWidth = 340, cellHeight = 330, columns = 4;
    const height = Math.ceil(rows.length / columns) * cellHeight;
    const overlays = [];
    for (const [index, entry] of rows.entries()) {
      const thumb = await sharp(resolve(directory, entry.snapshotRelativeFile), { failOn: "error" }).rotate().withIccProfile("srgb").resize({ width: 316, height: 250, fit: "inside", withoutEnlargement: true }).png().toBuffer({ resolveWithObject: true });
      const x = index % columns * cellWidth, y = Math.floor(index / columns) * cellHeight;
      overlays.push({ input: thumb.data, left: x + Math.floor((cellWidth - thumb.info.width) / 2), top: y + 8 });
      const labels = `<svg width="340" height="66"><rect width="340" height="66" fill="#fff"/><text x="10" y="17" font-family="sans-serif" font-size="14" fill="#111">${escape(entry.id)} · ${entry.image.orientation} · ${entry.image.width}×${entry.image.height}</text><text x="10" y="36" font-family="sans-serif" font-size="12" fill="#111">${escape(entry.instagramFilename)}</text><text x="10" y="54" font-family="sans-serif" font-size="12" fill="#111">${escape(entry.provisionalCreationDate.value)} · provisional file mtime</text></svg>`;
      overlays.push({ input: Buffer.from(labels), left: x, top: y + 262 });
    }
    const name = `contact-${String(sheets.length + 1).padStart(3, "0")}.jpg`;
    await sharp({ create: { width: columns * cellWidth, height, channels: 3, background: "white" } }).composite(overlays).jpeg({ quality: 90, chromaSubsampling: "4:4:4" }).toFile(resolve(directory, "contact-sheets", name));
    sheets.push({ file: `contact-sheets/${name}`, ids: rows.map((entry) => entry.id) });
  }
  await atomicJson(resolve(directory, "contact-sheets/index.json"), { snapshotSha256: snapshot.snapshotSha256, sheets });
  return sheets;
}
