import { parse } from "parse5";
import { readFile, readdir, realpath } from "node:fs/promises";
import { resolve, relative, extname } from "node:path";
import { gzipSync } from "node:zlib";
import sharp from "sharp";

export function elements(html) {
  const result = [];
  function visit(node) {
    if (node.tagName) result.push({ tag: node.tagName, attrs: Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value])), text: (node.childNodes ?? []).filter((child) => child.nodeName === "#text").map((child) => child.value).join("") });
    for (const child of node.childNodes ?? []) visit(child);
    if (node.content) visit(node.content);
  }
  visit(parse(html));
  return result;
}
export async function outputFiles(directory) {
  const files = [];
  async function visit(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = resolve(path, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Output symlink is forbidden: ${relative(directory, file)}`);
      if (entry.isDirectory()) await visit(file); else files.push(file);
    }
  }
  await visit(directory);
  return files;
}
export function routeForFile(directory, file) {
  const path = `/${relative(directory, file).replaceAll("\\", "/")}`;
  return path.endsWith("/index.html") ? path.slice(0, -"index.html".length) : path;
}
export function assertBudget(value, maximum, label) { if (value > maximum) throw new Error(`${label} budget exceeded: ${value} > ${maximum}`); }

export async function inspectOutput(directory, { siteUrl = "https://jordannesbitt.com", allowFixtures = false, jsBudget = 100 * 1024 } = {}) {
  const root = await realpath(resolve(directory));
  const files = await outputFiles(root);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const fileSet = new Set(files);
  const sourceCache = new Map();
  const imageCache = new Map();
  const read = async (file) => { if (!sourceCache.has(file)) sourceCache.set(file, await readFile(file)); return sourceCache.get(file); };
  const localFile = (path) => {
    const decoded = decodeURIComponent(path);
    const base = resolve(root, `.${decoded}`);
    if (!base.startsWith(`${root}/`) && base !== root) throw new Error(`Reference escapes output: ${path}`);
    if (fileSet.has(base)) return base;
    const index = resolve(base, "index.html");
    if (fileSet.has(index)) return index;
    throw new Error(`Broken local link/asset: ${path}`);
  };
  const reference = async (value, route, fragment = false) => {
    const url = new URL(value, new URL(route, siteUrl));
    if (!["http:", "https:"].includes(url.protocol) || url.origin !== new URL(siteUrl).origin) return;
    const file = localFile(url.pathname);
    if (fragment && url.hash && file.endsWith(".html")) {
      const ids = elements((await read(file)).toString()).map((node) => node.attrs.id).filter(Boolean);
      if (!ids.includes(decodeURIComponent(url.hash.slice(1)))) throw new Error(`Broken fragment: ${route} -> ${value}`);
    }
    return file;
  };
  const titles = new Map();
  const canonicalPaths = new Set();
  let references = 0, images = 0, largestJsGzip = 0;
  for (const file of htmlFiles) {
    const html = (await read(file)).toString();
    const route = routeForFile(root, file);
    if (!allowFixtures && /TEST FIXTURE|test-fixture-|specimen-|scale-|UNPUBLISHED SENTINEL/.test(html)) throw new Error(`Fixture/draft leak: ${route}`);
    const nodes = elements(html);
    const meta = (name, attribute = "name") => nodes.find((node) => node.tag === "meta" && node.attrs[attribute] === name)?.attrs.content;
    const title = nodes.find((node) => node.tag === "title")?.text.trim();
    const canonical = nodes.find((node) => node.tag === "link" && node.attrs.rel === "canonical")?.attrs.href;
    const noindex = /noindex/.test(meta("robots") ?? "");
    if (!title || !meta("description") || !canonical) throw new Error(`Missing title/description/canonical: ${route}`);
    if (nodes.filter((node) => node.tag === "h1").length !== 1 || !nodes.some((node) => node.tag === "main" && node.attrs.id === "main")) throw new Error(`Missing page heading/landmark: ${route}`);
    if (new URL(canonical).origin !== new URL(siteUrl).origin || (!noindex && canonical !== new URL(route, siteUrl).href)) throw new Error(`Wrong canonical: ${route}`);
    if (meta("og:title", "property") !== title || meta("og:url", "property") !== canonical || !meta("og:description", "property")) throw new Error(`Incorrect social metadata: ${route}`);
    if (!noindex) {
      if (titles.has(title)) throw new Error(`Duplicate public title: ${route} and ${titles.get(title)}`);
      titles.set(title, route);
      canonicalPaths.add(canonical);
    }
    let js = 0;
    const scripts = new Set();
    for (const node of nodes) {
      const attrs = node.attrs;
      if (node.tag === "script") {
        if (["application/ld+json", "application/json"].includes(attrs.type)) { JSON.parse(node.text); }
        else if (attrs.src) scripts.add(await reference(attrs.src, route));
        else js += gzipSync(node.text).length;
      }
      if (node.tag === "a" && attrs.href) { await reference(attrs.href, route, true); references++; }
      for (const key of ["src", "poster"]) if (attrs[key] && ["img", "source", "video", "track", "script"].includes(node.tag)) { await reference(attrs[key], route); references++; }
      if (node.tag === "link" && ["stylesheet", "icon", "canonical"].includes(attrs.rel)) { await reference(attrs.href, route); references++; }
      if (attrs.srcset) for (const source of attrs.srcset.split(",")) { await reference(source.trim().split(/\s+/)[0], route); references++; }
      if (node.tag === "meta" && attrs.property === "og:image") await reference(attrs.content, route);
      if (node.tag === "img") {
        if (!attrs.src || attrs.alt === undefined || !Number(attrs.width) || !Number(attrs.height)) throw new Error(`Missing image description/intrinsic dimensions: ${route}`);
        const imageFile = await reference(attrs.src, route);
        if (imageFile) {
          if (!imageCache.has(imageFile)) imageCache.set(imageFile, await sharp(await read(imageFile), { failOn: "error" }).metadata());
          const actual = imageCache.get(imageFile);
          if (actual.width !== Number(attrs.width) || actual.height !== Number(attrs.height)) throw new Error(`Incorrect image dimensions: ${route} -> ${attrs.src}`);
        }
        images++;
      }
    }
    for (const script of scripts) if (script) js += gzipSync(await read(script)).length;
    assertBudget(js, jsBudget, `JavaScript (${route})`);
    largestJsGzip = Math.max(largestJsGzip, js);
  }
  for (const file of files.filter((file) => file.endsWith(".css"))) {
    const route = routeForFile(root, file);
    for (const match of (await read(file)).toString().matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) if (!match[1].startsWith("data:")) await reference(match[1], route);
  }
  const locations = new Set();
  for (const file of files.filter((file) => /sitemap(?:-index|-\d+)?\.xml$/.test(file))) {
    const xml = (await read(file)).toString();
    for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      await reference(match[1], "/");
      if (!file.endsWith("sitemap-index.xml")) locations.add(match[1]);
    }
  }
  for (const canonical of canonicalPaths) if (!locations.has(canonical)) throw new Error(`Public canonical absent from sitemap: ${canonical}`);
  for (const file of files.filter((file) => [".json", ".js", ".xml", ".txt"].includes(extname(file)))) {
    if (!allowFixtures && /TEST FIXTURE|test-fixture-|specimen-|scale-|UNPUBLISHED SENTINEL/.test((await read(file)).toString())) throw new Error(`Fixture/draft leak: ${relative(root, file)}`);
  }
  return { htmlPages: htmlFiles.length, references, images, largestJsGzip, limits: { jsBudget }, externalLinks: "Not contacted or validated; local references only" };
}
