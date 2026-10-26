import { createServer } from "node:http";
import { readFile, realpath, lstat } from "node:fs/promises";
import { resolve } from "node:path";
import { artworkSchema } from "../../src/lib/catalogue.ts";

const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
export async function startIntakePreview(directory) {
  const root = await realpath(resolve(directory));
  const record = artworkSchema.parse(JSON.parse(await readFile(resolve(root, "record.json"), "utf8")));
  const files = new Map(record.reproductions.flatMap((image) => [image.src, ...image.variants.map((variant) => variant.src)]).map((url) => [url, url.split("/").at(-1)]));
  const heading = record.fixture ? "TEST FIXTURE — synthetic media, not the artist’s artwork" : "Local intake review — unpublished source, not release approval";
  const server = createServer(async (request, response) => {
    try {
      const path = new URL(request.url, "http://127.0.0.1").pathname;
      response.setHeader("X-Robots-Tag", "noindex, nofollow");
      response.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'");
      if (path === "/") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>${escape(heading)}</title></head><body><h1>${escape(heading)}</h1><h2>${escape(record.title)}</h2>${record.reproductions.map((image) => `<img src="${escape(image.src)}" alt="${escape(image.alt)}" width="${image.width}" height="${image.height}" style="max-width:100%;height:auto">`).join("")}</body></html>`);
      } else if (files.has(path)) {
        const source = resolve(root, files.get(path));
        if ((await lstat(source)).isSymbolicLink() || !(await realpath(source)).startsWith(`${root}/`)) throw new Error("Unsafe preview source");
        response.setHeader("Content-Type", path.endsWith(".jpg") ? "image/jpeg" : path.endsWith(".webp") ? "image/webp" : "image/avif");
        response.end(await readFile(source));
      } else { response.writeHead(404).end("Not found"); }
    } catch { response.writeHead(500).end("Local preview could not load this reviewed derivative"); }
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { origin: `http://127.0.0.1:${server.address().port}`, stop: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
}
