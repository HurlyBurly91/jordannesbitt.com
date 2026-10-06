import { cp, mkdtemp, mkdir, symlink, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

export const repository = fileURLToPath(new URL("../../", import.meta.url));
export async function isolatedProject(t, { parent = "/tmp/opencode" } = {}) {
  const root = await mkdtemp(resolve(parent, "jordannesbitt-fixture-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const path of ["src", "public", "astro.config.mjs", "tsconfig.json", "package.json"]) await cp(resolve(repository, path), resolve(root, path), { recursive: true });
  await mkdir(resolve(root, "scripts/lib"), { recursive: true });
  for (const file of ["release-gate.mjs", "output-quality.mjs"]) await cp(resolve(repository, "scripts/lib", file), resolve(root, "scripts/lib", file));
  await symlink(resolve(repository, "node_modules"), resolve(root, "node_modules"), "dir");
  return {
    root,
    async content(name, entries) { await writeFile(resolve(root, `src/content/${name}.json`), JSON.stringify(entries)); },
    async asset(url, bytes = Buffer.from("synthetic boundary asset")) {
      const destination = resolve(root, `src${url}`);
      await mkdir(resolve(destination, ".."), { recursive: true });
      await writeFile(destination, bytes);
    },
    async build({ mode } = {}) {
      const child = spawn(process.execPath, [resolve(repository, "node_modules/astro/astro.js"), "build", "--root", root, ...(mode ? ["--mode", mode] : [])], { cwd: root, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" }, stdio: ["ignore", "pipe", "pipe"] });
      let output = "";
      child.stdout.on("data", (chunk) => { output += chunk; });
      child.stderr.on("data", (chunk) => { output += chunk; });
      return new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("close", (code) => resolve({ code, output }));
      });
    },
  };
}
