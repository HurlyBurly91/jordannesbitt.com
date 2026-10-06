import { lstat, realpath, mkdir, readFile, writeFile, rename, open, unlink } from "node:fs/promises";
import { resolve, relative, dirname, isAbsolute, sep } from "node:path";
import { randomUUID } from "node:crypto";
import { hashBytes, persistentPilotRoot } from "./pilot-snapshot.mjs";

export const inside = (root, file) => file === root || file.startsWith(root + sep);
export async function exists(file) { try { await lstat(file); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; } }
export async function safeFile(root, file, { missing = false } = {}) {
  root = resolve(root); file = resolve(file);
  if (!inside(root, file)) throw new Error("Path escapes its approved root");
  const parts = relative(root, file).split(sep).filter(Boolean);
  let current = root;
  for (const part of ["", ...parts]) {
    current = part ? resolve(current, part) : current;
    if (!await exists(current)) {
      if (missing) continue;
      throw new Error("Selected file does not exist");
    }
    if ((await lstat(current)).isSymbolicLink()) throw new Error("Symlink paths are not permitted");
    if (!inside(root, await realpath(current))) throw new Error("Resolved path escapes its approved root");
  }
  return file;
}
export async function privateRoot(root, repository, testMode = false) {
  if (!isAbsolute(root)) throw new Error("Private studio root must be absolute");
  root = resolve(root);
  if (inside(resolve(repository), root) || inside(root, resolve(repository))) throw new Error("Private studio data must be separate from the public repository");
  if (inside("/tmp", root) && !(testMode && inside("/tmp/opencode", root))) throw new Error("Real studio data must use persistent private storage, not /tmp");
  let ancestor = root;
  while (!await exists(ancestor)) ancestor = dirname(ancestor);
  if ((await realpath(ancestor)) !== ancestor) throw new Error("Private root ancestors must not redirect through symlinks");
  await mkdir(root, { recursive: true, mode: 0o700 });
  await safeFile(root, root);
  return root;
}
export async function atomicJson(root, file, value) {
  await safeFile(root, file, { missing: true });
  await mkdir(dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.${randomUUID()}.pending`;
  await writeFile(temp, JSON.stringify(value, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await rename(temp, file);
}
export async function jsonFile(root, file) { return JSON.parse(await readFile(await safeFile(root, file), "utf8")); }
export async function fileHash(root, file) { return hashBytes(await readFile(await safeFile(root, file))); }
export async function lock(root, name) {
  const file = await safeFile(root, resolve(root, name), { missing: true });
  let handle;
  try { handle = await open(file, "wx", 0o600); }
  catch (error) { if (error.code === "EEXIST") throw new Error("Another studio operation owns this private lock; reconcile an interrupted process before retrying"); throw error; }
  await handle.writeFile(JSON.stringify({ pid: process.pid }));
  return async () => { await handle.close(); try { await unlink(file); } catch (error) { if (error.code !== "ENOENT") throw error; } };
}
export const defaultDataRoot = () => persistentPilotRoot();
