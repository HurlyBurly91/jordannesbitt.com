import { mkdir, writeFile, readFile, cp, lstat } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { isolatedProject } from "../../tests/helpers/build-project.mjs";
import { recordAssets, validateCatalogue } from "../../src/lib/catalogue.ts";
import { atomicJson, safeFile, inside } from "./studio-paths.mjs";
import { assertPrivatePilotOutput } from "./real-pilot.mjs";

export async function buildStudioPreview(studio) {
  const state = studio.state(), digest = await studio.globalDigest(state);
  if (!state.catalogue.artworks.length) throw new Error("Add a private artwork before previewing");
  const id = randomUUID(), directory = resolve(studio.root, "previews", id);
  const parent = resolve(directory, "builds");
  await mkdir(parent, { recursive: true, mode: 0o700 });
  const cleanup = [], harness = { after: (fn) => cleanup.push(fn) };
  try {
    const project = await isolatedProject(harness, { parent });
    const catalogue = structuredClone(state.catalogue);
    // These renderer flags exist only in this independent PRIVATE preview.
    // Actual source and canonical publication projection are never switched.
    for (const work of catalogue.artworks) work.published = true;
    for (const group of catalogue.projects) group.published = true;
    // No live recipient/form/mail intent is activated in an authoring preview.
    for (const record of catalogue.professional) delete record.contact;
    validateCatalogue(catalogue, { assetExists: (url) => Boolean(state.assets[url]) });
    for (const name of ["artworks", "projects", "professional"]) await project.content(name, catalogue[name]);
    for (const url of new Set([...catalogue.artworks, ...catalogue.professional].flatMap(recordAssets))) await project.asset(url, await studio.assetBytes(url, state));
    const layoutPath = resolve(project.root, "src/layouts/BaseLayout.astro");
    await writeFile(layoutPath, (await readFile(layoutPath, "utf8"))
      .replace("<body>", '<body><aside class="pilot-notice" role="note" data-local-pilot>PRIVATE LOCAL DRAFT — Studio preview. <a data-studio-return href="/__studio-return">← Return to Studio</a> · Returns to your original Studio when possible, otherwise opens Studio here. Renderer visibility is not public-source, rights, curation or launch approval.</aside>')
      .replace('<script is:inline type="application/ld+json" set:html={safeJson(artistSchema)} />', "")
      .replace('<p>© {new Date().getFullYear()}</p>', '<p>Private draft preview — rights/launch approval separate</p>'));
    const pagePath = resolve(project.root, "src/pages/artwork/[slug].astro");
    await writeFile(pagePath, (await readFile(pagePath, "utf8")).replace('by ${identity.name}.', 'private draft preview.').replace('schema={[schema, ...(video ? [video] : [])]}', 'schema={[]}'));
    for (const relative of ["src/pages/projects/index.astro", "src/pages/work/[medium].astro", "src/pages/work/index.astro"]) {
      const path = resolve(project.root, relative);
      await writeFile(path, (await readFile(path, "utf8")).replaceAll("by Jordan Nesbitt", "— private draft preview"));
    }
    const built = await project.build({ mode: "preview" });
    if (built.code !== 0) throw new Error(`Preview validation/build failed:\n${built.output}`);
    const site = resolve(directory, "site");
    const privacy = await assertPrivatePilotOutput(resolve(project.root, "dist"));
    await cp(resolve(project.root, "dist"), site, { recursive: true });
    const result = { id, directory, site, digest, revision: state.revision, privacy, created: new Date().toISOString(), publicationAuthorized: false };
    await atomicJson(studio.root, resolve(directory, "preview.json"), result);
    await studio.transact(async (next) => {
      if (await studio.globalDigest(next) !== digest) throw new Error("Drafts changed during preview; rebuild before local review");
      next.previews.push(result);
    });
    return result;
  } finally { for (const fn of cleanup.reverse()) await fn(); }
}
export async function openStudioPreview(studio, id, { studioOrigin, artworkId } = {}) {
  const preview = studio.state().previews.find((entry) => entry.id === id);
  if (!preview) throw new Error("Preview not found; build it first");
  const root = await safeFile(studio.root, preview.site);
  if (studioOrigin && !/^http:\/\/127\.0\.0\.1:[1-9]\d{0,4}$/.test(studioOrigin)) throw new Error("Exact loopback Studio origin required for preview return");
  const knownArtwork = studio.state().catalogue.artworks.some((work) => work.id === artworkId);
  const returnUrl = studioOrigin ? `${studioOrigin}/?return=preview#${knownArtwork ? `artwork/${artworkId}` : "artworks"}` : null;
  let origin;
  const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".xml": "application/xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".mp4": "video/mp4", ".webm": "video/webm", ".vtt": "text/vtt", ".pdf": "application/pdf" };
  const server = createServer(async (request, response) => {
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Referrer-Policy", "origin");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    response.setHeader("Content-Security-Policy", "frame-ancestors 'none'; object-src 'none'; base-uri 'none'");
    try {
      if (request.method !== "GET" || request.socket.remoteAddress !== "127.0.0.1" || request.headers.host !== new URL(origin).host) throw new Error("Forbidden loopback preview request");
      if (request.headers.origin && request.headers.origin !== origin) throw new Error("Forbidden preview Origin");
      if (request.headers["sec-fetch-site"] === "cross-site" || (request.headers["sec-fetch-site"] === "same-site" && request.headers["sec-fetch-mode"] !== "navigate")) throw new Error("Forbidden cross-origin preview read");
      const path = decodeURIComponent(request.url.split("?")[0]);
      if (path === "/__studio-return") {
        if (!returnUrl) { response.writeHead(409, { "Content-Type": "text/plain; charset=utf-8" }); response.end("Return to the Studio tab that created this preview, or start Studio again."); return; }
        response.writeHead(303, { Location: returnUrl, "Referrer-Policy": "no-referrer" }); response.end(); return;
      }
      if (path.includes("\\") || path.includes("\0") || path.split("/").includes("..")) throw new Error("Unsafe preview path");
      let file = resolve(root, `.${path}`);
      if (!inside(root, file)) throw new Error("Unsafe preview root");
      file = await safeFile(root, file);
      if ((await lstat(file)).isDirectory()) file = await safeFile(root, resolve(file, "index.html"));
      if (!mime[extname(file)] || !(await lstat(file)).isFile()) throw new Error("Preview file not served");
      const bytes = await readFile(file);
      response.writeHead(200, { "Content-Type": mime[extname(file)] });
      response.end(extname(file) === ".html" && returnUrl ? bytes.toString("utf8").replace('href="/__studio-return"', `href="${returnUrl}"`) : bytes);
    } catch (error) { response.writeHead(error.message.startsWith("Forbidden") ? 403 : 404).end("Private preview file unavailable"); }
  });
  await new Promise((done, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", done); });
  origin = `http://127.0.0.1:${server.address().port}`;
  return { origin, stop: async () => { const stopped = new Promise((done) => server.close(done)); server.closeAllConnections(); await stopped; } };
}
