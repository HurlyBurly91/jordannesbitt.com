import { readFileSync, lstatSync, realpathSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { resolve, relative, dirname } from "node:path";
import { publicAssets, validateCatalogue } from "./catalogue.ts";

export const contentFiles = ["artworks", "projects", "professional"] as const;
export function mediaSource(root: string, url: string): string {
  if (!/^\/media\/[a-z0-9][a-z0-9/_-]*\.[a-z0-9]+$/.test(url)) throw new Error(`Unsafe media URL: ${url}`);
  const mediaRoot = resolve(root, "src/media");
  const source = resolve(mediaRoot, url.slice("/media/".length));
  const location = relative(mediaRoot, source);
  if (!location || location.startsWith("..") || location.startsWith("/")) throw new Error("Media path escapes approved root");
  return source;
}
export function readCatalogue(root: string) {
  if (existsSync(resolve(root, "public/media"))) throw new Error("Artwork assets belong in src/media, never copied wholesale from public/media");
  const data = Object.fromEntries(contentFiles.map((name) => [name, JSON.parse(readFileSync(resolve(root, `src/content/${name}.json`), "utf8"))]));
  return validateCatalogue(data, { assetExists: (url) => {
    try {
      const source = mediaSource(root, url);
      const actual = realpathSync(source);
      const base = resolve(root, "src/media");
      return lstatSync(source).isFile() && actual.startsWith(`${base}/`);
    } catch { return false; }
  } });
}

// BEGIN CANONICAL ALGORITHM: publication-gated derivative emission
// Reference: docs/catalogue.md
export function emitPublicMedia(root: string, output: string) {
  const catalogue = readCatalogue(root);
  for (const url of publicAssets(catalogue)) {
    const destination = resolve(output, `.${url}`);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(mediaSource(root, url), destination);
  }
}
// END CANONICAL ALGORITHM: publication-gated derivative emission
