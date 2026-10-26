import sharp from "sharp";
import { readFile, writeFile, mkdir, mkdtemp, rename, rm, lstat, realpath } from "node:fs/promises";
import { resolve, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { artworkSchema } from "../../src/lib/catalogue.ts";

const repository = fileURLToPath(new URL("../../", import.meta.url));
export const checksum = (bytes) => createHash("sha256").update(bytes).digest("hex");
const pipelineVersion = 1;
async function exists(path) { try { await lstat(path); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; } }
function inside(root, path) { const value = relative(root, path); return value === "" || (!value.startsWith("..") && !value.startsWith("/")); }

async function encode(input, path, width, format, metadata) {
  let image = sharp(input, { failOn: "error", limitInputPixels: 100_000_000 })
    .rotate().resize({ width, withoutEnlargement: true }).withIccProfile("srgb");
  if (metadata.creator || metadata.rights) image = image.withExif({ IFD0: {
    ...(metadata.creator ? { Artist: metadata.creator } : {}), ...(metadata.rights ? { Copyright: metadata.rights } : {}),
  } });
  if (format === "jpeg") image = image.jpeg({ quality: 92, chromaSubsampling: "4:4:4" });
  if (format === "webp") image = image.webp({ quality: 90 });
  if (format === "avif") image = image.avif({ quality: 65, effort: 4 });
  const info = await image.toFile(path);
  return { width: info.width, height: info.height };
}

// BEGIN CANONICAL ALGORITHM: non-destructive explicit-path intake
// Reference: docs/catalogue.md
export async function ingest(options, dependencies = {}) {
  if (!options.input || !options.output || !options.id || !options.title || !options.medium || !options.alt) throw new Error("input, output, id, title, medium and alt are explicit required values");
  const input = await realpath(resolve(options.input));
  if (!(await lstat(input)).isFile()) throw new Error("Input must be one explicitly selected file");
  const output = resolve(options.output);
  // Walk only the selected destination's ancestors, never discover input files.
  let existingAncestor = output;
  while (!(await exists(existingAncestor))) existingAncestor = resolve(existingAncestor, "..");
  const actualAncestor = await realpath(existingAncestor);
  if (inside(repository, output) || inside(repository, actualAncestor)) throw new Error("Intake output must stay outside this public checkout");
  if (inside(output, input)) throw new Error("Input must not be inside the intake output tree");
  const bytes = await readFile(input);
  const sourceSha256 = checksum(bytes);
  const metadata = await sharp(bytes, { failOn: "error", limitInputPixels: 100_000_000 }).metadata();
  if (!["jpeg", "png", "tiff", "webp", "heif", "avif"].includes(metadata.format) || metadata.pages > 1) throw new Error("Select a single JPEG, PNG, TIFF, WebP or AVIF export, not animated/multipage/master media");
  if (!metadata.width || !metadata.height) throw new Error("Missing image dimensions");
  if (!metadata.icc && !options.assumeSrgb) throw new Error("Missing ICC profile: review the export and explicitly choose --assume-srgb if appropriate");
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const sourceWidth = rotated ? metadata.height : metadata.width;
  const sourceHeight = rotated ? metadata.width : metadata.height;
  const widths = [...new Set([320, 640, 960, 1600, 2400].map((width) => Math.min(width, sourceWidth)))];
  const formats = ["jpeg", "webp", ...(sharp.format.heif?.output?.file ? ["avif"] : [])];
  const settings = { pipelineVersion, decoder: sharp.versions.sharp, widths, formats, creator: options.creator ?? null, rights: options.rights ?? null, profile: metadata.icc ? "embedded-to-srgb" : "explicit-srgb-assumption" };
  const stem = sourceSha256.slice(0, 16);
  const primary = `/media/${options.id}/${stem}-${widths.at(-1)}.jpg`;
  const draft = artworkSchema.parse({
    id: options.id, slug: options.id, title: options.title, medium: options.medium, kind: options.kind ?? "original",
    date: { certainty: "unknown" }, published: false, fixture: options.fixture === true,
    reproductions: [{ src: primary, width: widths.at(-1), height: Math.max(1, Math.round(sourceHeight * widths.at(-1) / sourceWidth)), role: "primary", alt: options.alt }],
  });
  const destination = join(output, draft.id);
  const plan = { id: draft.id, sourceSha256, sourceWidth, sourceHeight, settings, draft };
  if (options.dryRun) return { status: "dry-run", ...plan };

  if (await exists(destination)) {
    if ((await lstat(destination)).isSymbolicLink()) throw new Error("Destination must not be a symlink");
    let manifest;
    try { manifest = JSON.parse(await readFile(join(destination, "manifest.json"), "utf8")); }
    catch { throw new Error("Destination collision: existing work has no readable intake manifest"); }
    if (manifest.sourceSha256 !== sourceSha256 || JSON.stringify(manifest.settings) !== JSON.stringify(settings)) throw new Error("Stable-ID/source or processing-setting collision; review explicitly before replacing anything");
    const reviewed = artworkSchema.parse(JSON.parse(await readFile(join(destination, "record.json"), "utf8")));
    if (reviewed.id !== draft.id) throw new Error("Reviewed record ID does not match intake ID");
    if (!Array.isArray(manifest.files) || manifest.files.length !== widths.length * formats.length) throw new Error("Invalid cache manifest");
    for (const file of manifest.files) {
      if (!/^[a-f0-9]{16}-[0-9]+\.(jpg|webp|avif)$/.test(file.name)) throw new Error("Unsafe cache file name");
      const path = join(destination, file.name);
      if ((await lstat(path)).isSymbolicLink() || checksum(await readFile(path)) !== file.sha256) throw new Error("Cached derivative is missing/changed; do not silently overwrite reviewed intake");
    }
    return { status: "cached", ...plan, draft: reviewed };
  }

  await mkdir(output, { recursive: true });
  const stage = await mkdtemp(join(output, `.pending-${draft.id}-`));
  try {
    const files = [];
    for (const width of widths) for (const format of formats) {
      const name = `${stem}-${width}.${format === "jpeg" ? "jpg" : format}`;
      const path = join(stage, name);
      const dimensions = await (dependencies.encode ?? encode)(bytes, path, width, format, { creator: options.creator, rights: options.rights });
      if (dimensions.width > sourceWidth || dimensions.height > sourceHeight) throw new Error("Encoder upscaled source");
      files.push({ name, format, ...dimensions, sha256: checksum(await readFile(path)) });
    }
    const primaryFile = files.find((file) => file.format === "jpeg" && file.width === widths.at(-1));
    const record = artworkSchema.parse({ ...draft, reproductions: [{
      ...draft.reproductions[0], width: primaryFile.width, height: primaryFile.height,
      variants: files.map((file) => ({ src: `/media/${draft.id}/${file.name}`, width: file.width, height: file.height, format: file.format })),
    }] });
    if (checksum(await readFile(input)) !== sourceSha256) throw new Error("Selected source changed during processing");
    await writeFile(join(stage, "record.json"), `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
    await writeFile(join(stage, "manifest.json"), `${JSON.stringify({ sourceSha256, sourceWidth, sourceHeight, settings, files }, null, 2)}\n`, { flag: "wx" });
    await rename(stage, destination);
    return { status: "created", ...plan, draft: record };
  } catch (error) {
    await rm(stage, { recursive: true, force: true });
    throw error;
  }
}
// END CANONICAL ALGORITHM: non-destructive explicit-path intake
