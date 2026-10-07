import { createServer } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readCatalogue } from "../../src/lib/catalogue-source.ts";
import { openStudio, readableError } from "./studio-store.mjs";
import { prepareExport, executeExport } from "./studio-export.mjs";
import { buildStudioPreview, openStudioPreview } from "./studio-preview.mjs";

const uiRoot = fileURLToPath(new URL("../../studio/", import.meta.url));
async function body(request, maximum) {
  const chunks = []; let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximum) throw new Error("Request too large; image limit30MiB, metadata limit1MiB");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
export async function startStudio(options = {}) {
  const studio = await openStudio(options);
  const token = randomBytes(32).toString("hex"), previews = new Map();
  let origin, previewBusy = false, stopped = false;
  const requests = new Set();
  const handle = async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    const json = (status, data) => { response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); response.end(JSON.stringify(data)); };
    try {
      if (request.socket.remoteAddress !== "127.0.0.1" || request.headers.host !== new URL(origin).host) throw new Error("Forbidden: exact loopback Host required");
      // Browsers differ on the site classification of distinct loopback ports.
      // Admit only a document return from one of this process's live previews.
      let referringPreview = false;
      try { const referrer = new URL(request.headers.referer); referringPreview = [...previews.values()].some((entry) => entry.origin === referrer.origin); } catch {}
      const returnNavigation = request.method === "GET" && new URL(request.url, origin).pathname === "/" && new URL(request.url, origin).searchParams.get("return") === "preview" && request.headers["sec-fetch-mode"] === "navigate" && request.headers["sec-fetch-dest"] === "document" && referringPreview;
      if ((request.headers.origin && request.headers.origin !== origin) || (["cross-site", "same-site"].includes(request.headers["sec-fetch-site"]) && !returnNavigation)) throw new Error("Forbidden: same-origin studio request required");
      const rawPath = decodeURIComponent(request.url.split("?")[0]);
      if (rawPath.includes("\\") || rawPath.includes("\0") || rawPath.split("/").includes("..")) throw new Error("Unsafe path traversal");
      const url = new URL(request.url, origin), path = url.pathname;
      if (request.method === "GET" && ["/", "/studio.js", "/tab-coordination.js", "/studio.css"].includes(path)) {
        const file = path === "/" ? "index.html" : path === "/studio.js" ? "app.js" : path === "/tab-coordination.js" ? "tab-coordination.js" : "styles.css";
        response.writeHead(200, { "Content-Type": file.endsWith("html") ? "text/html; charset=utf-8" : file.endsWith("js") ? "text/javascript; charset=utf-8" : "text/css; charset=utf-8" });
        response.end(await readFile(resolve(uiRoot, file))); return;
      }
      if (request.method === "GET" && path === "/api/session") { json(200, { token, privateLocalOnly: true, repositoryWritesEnabled: studio.allowPublicExport }); return; }
      if (request.method === "GET" && path.startsWith("/media/")) {
        const match = path.match(/^\/media\/([a-z0-9-]+)\/(thumb|primary)$/);
        if (!match) throw new Error("Unknown private media path");
        const entry = studio.state().media.find((item) => item.id === match[1]);
        if (!entry) throw new Error("Private media not found");
        const image = entry.reproduction;
        const source = match[2] === "thumb" ? image.variants.filter((variant) => variant.format === "jpeg").sort((a,b) => a.width-b.width)[0]?.src ?? image.src : image.src;
        response.writeHead(200, { "Content-Type": source.endsWith(".png") ? "image/png" : "image/jpeg" });
        response.end(await studio.assetBytes(source)); return;
      }
      const supplied = request.headers["x-studio-token"] ?? "";
      if (typeof supplied !== "string" || supplied.length !== token.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(token))) throw new Error("Forbidden: studio session token required");
      if (request.method === "GET" && path === "/api/state") {
        const state = studio.state();
        const artworkVersions = Object.fromEntries(state.catalogue.artworks.map((work) => [work.id, studio.artworkVersion(work.id, state)]));
        json(200, { ...state, artworkVersions, actualPublic: readCatalogue(studio.repository).artworks.filter((work) => work.published && !work.fixture).map((work) => ({ id: work.id, slug: work.slug })), repositoryWritesEnabled: studio.allowPublicExport }); return;
      }
      if (request.method === "GET" && path === "/api/snapshot") { json(200, await studio.snapshotChoices()); return; }
      if (request.method !== "POST") { json(404, { error: "Studio route not found" }); return; }
      if (path === "/api/intake" || path === "/api/intake/inspect") {
        let settings;
        try { settings = JSON.parse(decodeURIComponent(request.headers["x-studio-options"] ?? "")); } catch { throw new Error("Invalid selected-file metadata"); }
        const bytes = await body(request, 30 * 1024 * 1024);
        if (path === "/api/intake/inspect") json(200, await studio.inspectImage(bytes, settings));
        else json(202, { jobId: await studio.intake(bytes, settings) });
        return;
      }
      let data;
      try { data = JSON.parse((await body(request, 1024 * 1024)).toString("utf8")); } catch { throw new Error("Invalid metadata JSON or oversized request"); }
      if (path === "/api/snapshot/import") { json(202, { jobId: await studio.importSnapshot(data.id, data) }); return; }
      if (path === "/api/artwork/save") {
        if (typeof data.expectedVersion !== "string" || !/^[a-f0-9]{64}$/.test(data.expectedVersion)) throw new Error("Reload this artwork before saving; a current saved-version check is required.");
        json(200, await studio.saveArtwork(data.id, data.record, data.note, data.expectedVersion)); return;
      }
      if (path === "/api/project/save") { json(200, await studio.saveProject(data.record, data.note)); return; }
      if (path === "/api/media/attach") { json(200, { artworkId: await studio.attachMedia(data.mediaId, data) }); return; }
      if (path === "/api/curation") { await studio.curate(data); json(200, { saved: true }); return; }
      if (path === "/api/review") { await studio.markReviewed(data.id); json(200, { reviewedLocally: true, publicSourceApproved: false }); return; }
      if (path === "/api/approve") { await studio.approve(data.id, data); json(200, { publicSourceApproved: true, repositoryWritten: false }); return; }
      if (path === "/api/export/plan") { json(200, await prepareExport(studio, data)); return; }
      if (path === "/api/export/write") { json(200, await executeExport(studio, data)); return; }
      if (path === "/api/preview/build" || path === "/api/preview/open") {
        let preview;
        if (path === "/api/preview/build") {
          if (previewBusy) throw new Error("A preview build is already running");
          previewBusy = true;
          try { preview = await buildStudioPreview(studio); } finally { previewBusy = false; }
        } else preview = studio.state().previews.find((entry) => entry.id === data.id);
        if (!preview) throw new Error("Preview not found");
        if (!previews.has(preview.id)) previews.set(preview.id, await openStudioPreview(studio, preview.id, { studioOrigin: origin, artworkId: data.returnArtworkId }));
        json(200, { ...preview, origin: previews.get(preview.id).origin }); return;
      }
      json(404, { error: "Studio route not found" });
    } catch (error) { if (!response.headersSent) json(error.message.startsWith("Forbidden") ? 403 : 400, { error: readableError(error) }); else response.destroy(); }
  };
  const server = createServer((request, response) => {
    const task = handle(request, response);
    requests.add(task);
    task.finally(() => requests.delete(task));
  });
  try { await new Promise((done, reject) => { server.once("error", reject); server.listen(options.port ?? 0, "127.0.0.1", done); }); }
  catch (error) { await studio.close(); throw error; }
  origin = `http://127.0.0.1:${server.address().port}`;
  return { studio, origin, server, async stop() {
    if (stopped) return; stopped = true;
    const closing = new Promise((done) => server.close(done)); server.closeAllConnections();
    await closing; await Promise.all([...requests]);
    for (const preview of previews.values()) await preview.stop();
    await studio.close();
  } };
}
