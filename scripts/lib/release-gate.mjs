import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { readCatalogue, mediaSource } from "../../src/lib/catalogue-source.ts";
import { publicCatalogue, publicAssets } from "../../src/lib/catalogue.ts";
import { selectedWorks } from "../../src/lib/presentation.ts";
import { watchReady } from "../../src/lib/moving-image.ts";
import { elements, outputFiles } from "./output-quality.mjs";
import { createHash } from "node:crypto";

// BEGIN CANONICAL ALGORITHM: strict owner-content release gate
// Reference: docs/quality.md

export async function contentDigest(root) {
  const catalogue = publicCatalogue(readCatalogue(root));
  const assets = [];
  for (const url of publicAssets(catalogue)) assets.push({ url, sha256: createHash("sha256").update(await readFile(mediaSource(root, url))).digest("hex") });
  return createHash("sha256").update(JSON.stringify({ catalogue, assets })).digest("hex");
}
export async function outputDigest(directory) {
  const hash = createHash("sha256");
  for (const file of (await outputFiles(directory)).sort()) {
    hash.update(relative(directory, file));
    hash.update(createHash("sha256").update(await readFile(file)).digest());
  }
  return hash.digest("hex");
}
export async function recordBuildDigest(root, directory) {
  const path = resolve(root, ".astro/cache/artifact-digests.json");
  let digests = {};
  try { digests = JSON.parse(await readFile(path, "utf8")); } catch { /* New generated cache. */ }
  digests[resolve(directory)] = { contentSha256: await contentDigest(root), outputSha256: await outputDigest(directory) };
  await mkdir(resolve(root, ".astro/cache"), { recursive: true });
  await writeFile(path, JSON.stringify(digests));
}
export async function releaseIssues(root, directory) {
  const issues = [];
  const catalogue = publicCatalogue(readCatalogue(root));
  let manifest;
  try { manifest = JSON.parse(await readFile(resolve(root, "src/config/launch-manifest.json"), "utf8")); }
  catch { issues.push("M09 owner-approved exact launch manifest is missing or unreadable."); }
  if (manifest && (manifest.approvedBy !== "owner" || !/^\d{4}-\d{2}-\d{2}$/.test(manifest.approvedOn ?? ""))) issues.push("Explicit M09 owner content approval/date is missing.");
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  if (manifest) {
    const digest = await contentDigest(root);
    if (manifest.contentSha256 !== digest) issues.push("Approved metadata/media snapshot checksum is missing or changed; renew M09 owner approval.");
    let built;
    try { built = JSON.parse(await readFile(resolve(root, ".astro/cache/artifact-digests.json"), "utf8"))[resolve(directory)]; } catch { /* Missing build proof fails below. */ }
    if (built?.contentSha256 !== digest) issues.push("Built output does not match current metadata/media snapshot; rebuild before release validation.");
    if (built?.outputSha256 !== await outputDigest(directory)) issues.push("Built output bytes changed after the verified build; rebuild/review before release validation.");
    if (!equal(manifest.artworkIds, catalogue.artworks.map((work) => work.id))) issues.push("Launch manifest artwork IDs/order do not match the public catalogue.");
    if (!equal(manifest.projectIds, catalogue.projects.map((project) => project.id))) issues.push("Launch manifest project IDs/order do not match.");
    if (!equal(manifest.selectedIds, selectedWorks(catalogue.artworks).map((work) => work.id))) issues.push("Launch manifest curated selection/order does not match.");
    for (const project of catalogue.projects) if (!equal(manifest.projectMembers?.[project.id], project.memberIds)) issues.push(`Approved project sequence does not match: ${project.id}`);
  }
  if (!catalogue.artworks.length) issues.push("No genuine approved published artworks exist.");
  const lead = catalogue.artworks.find((work) => work.homepageLead);
  if (!lead || (manifest && manifest.homepageLeadId !== lead.id)) issues.push("Approved explicit homepage lead is missing or mismatched.");
  const profile = catalogue.professional[0];
  if (!profile?.contact) issues.push("Reviewed public enquiry recipient is missing.");
  if (!profile || (!profile.biography.length && !profile.statement.length)) issues.push("Approved professional About context is missing.");
  if (profile?.contact && /(?:example\.(?:com|net|org)|\.(?:invalid|test|example))$/i.test(profile.contact.email.split("@")[1])) issues.push("Reserved test recipient cannot be released.");
  for (const work of catalogue.artworks) {
    if (/^(?:test-fixture|specimen|scale)-/.test(work.id)) issues.push(`Synthetic fixture ID cannot be released: ${work.id}`);
    if (work.availability.state !== "unknown" && !work.availability.reviewed) issues.push(`Unreviewed availability/offer: ${work.id}`);
    if (work.film && watchReady(work)) {
      if (work.film.captions.status === "not-supplied") issues.push(`Applicable captions remain missing: ${work.id}`);
      if (!work.film.transcript && !work.film.accessibilityNote) issues.push(`Transcript/description or explicit accessibility applicability note missing: ${work.id}`);
      if (!work.film.posterInfo) issues.push(`Reviewed poster dimensions/alt missing: ${work.id}`);
    }
  }
  for (const file of (await outputFiles(directory)).filter((file) => /\.(html|json|js|xml|txt)$/.test(file))) {
    const text = await readFile(file, "utf8");
    if (/TEST FIXTURE|test-fixture-|specimen-|scale-|UNPUBLISHED SENTINEL/.test(text)) issues.push(`Fixture/draft output cannot be released: ${relative(directory, file)}`);
    if (file.endsWith(".html")) for (const node of elements(text)) {
      if (node.attrs["data-release-blocker"]) issues.push(`Construction content: ${node.attrs["data-release-blocker"]}`);
      if ((node.attrs.class ?? "").split(/\s+/).includes("art-placeholder")) issues.push("Placeholder artwork remains in rendered output.");
    }
  }
  return [...new Set(issues)];
}
// END CANONICAL ALGORITHM: strict owner-content release gate
