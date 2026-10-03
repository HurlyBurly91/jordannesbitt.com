import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import { isolatedProject } from "./build-project.mjs";
import { publicSpecimens } from "../fixtures/public-specimens.mjs";
import { startPreview } from "./preview.mjs";

export async function specimenSite(t, transform = (data) => data) {
  const project = await isolatedProject(t);
  const data = transform(publicSpecimens());
  for (const name of ["artworks", "projects", "professional"]) await project.content(name, data[name]);
  // Mandatory synthetic identity/banner before any fixture build; never alter the real checkout.
  await writeFile(resolve(project.root, "src/config/identity.ts"), 'export const identity = { name: "Synthetic test artist", shortName: "TEST", descriptor: "TEST FIXTURE — synthetic component preview", location: "Synthetic test environment", siteUrl: "https://jordannesbitt.com", email: "" } as const;\n');
  const layoutPath = resolve(project.root, "src/layouts/BaseLayout.astro");
  const layout = await readFile(layoutPath, "utf8");
  await writeFile(layoutPath, layout
    .replace("<head>", '<head>{!alias && <meta name="robots" content="noindex,nofollow" />}')
    .replace("<body>", '<body><aside class="fixture-banner" role="note">TEST FIXTURE — synthetic local preview, not Jordan Nesbitt artwork or release content.</aside>'));
  const generated = new Set();
  for (const work of data.artworks) for (const image of work.reproductions) {
    for (const source of [{ src: image.src, width: image.width, height: image.height }, ...image.variants]) {
      if (generated.has(source.src)) continue;
      generated.add(source.src);
      const bytes = await sharp({ create: { width: source.width, height: source.height, channels: 3, background: work.medium === "photography" ? "#407080" : "#a08060" } }).png().toBuffer();
      await project.asset(source.src, bytes);
    }
  }
  const buildStart = performance.now();
  const built = await project.build();
  const buildMs = performance.now() - buildStart;
  if (built.code !== 0) throw new Error(built.output);
  const preview = await startPreview({ root: project.root });
  t.after(preview.stop);
  return { ...project, ...preview, data, buildMs };
}
