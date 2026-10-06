import { access, readFile, readdir } from "node:fs/promises";
import { resolve, relative } from "node:path";

const root = process.cwd();
const errors = [];
const required = [
  "AGENTS.md", "PROJECT.md", "STATUS.md", "TASKS.md", "RUN_PROMPT.txt",
  "experiences/README.md", "experiences/SCHEMA.md",
  "experiences/experiences.jsonl", "experiences/retrievals.jsonl",
];

async function exists(path) {
  try { await access(resolve(root, path)); return true; }
  catch { return false; }
}
async function text(path) { return readFile(resolve(root, path), "utf8"); }

for (const path of required) if (!await exists(path)) errors.push(`Missing durable-state file: ${path}`);

function header(document, label) {
  const block = document.match(/```yaml\n([\s\S]*?)\n```/);
  if (!block) { errors.push(`${label} has no YAML state header`); return {}; }
  const values = {};
  for (const line of block[1].split("\n")) {
    const match = line.match(/^([A-Za-z-]+):\s*(.+)$/);
    if (match) values[match[1]] = match[2].trim();
  }
  return values;
}

if (errors.length === 0) {
  const statusText = await text("STATUS.md");
  const tasksText = await text("TASKS.md");
  const status = header(statusText, "STATUS.md");
  const tasks = header(tasksText, "TASKS.md");
  for (const key of ["Milestone", "State", "Phase", "Active-Request", "Specification"]) {
    if ((status[key] ?? null) !== (tasks[key] ?? null)) errors.push(`STATUS/TASKS mismatch for ${key}: ${status[key]} vs ${tasks[key]}`);
  }
  if (!["NOT_STARTED", "ACTIVE", "BLOCKED", "COMPLETE"].includes(status.State)) errors.push(`Invalid milestone State: ${status.State}`);
  if (status.State === "ACTIVE") {
    if (!["IMPLEMENTATION", "AUTOMATED_VERIFICATION", "HUMAN_VERIFICATION", "FOLLOW_UP"].includes(status.Phase)) errors.push(`Invalid active Phase: ${status.Phase}`);
    if (!status["Active-Request"]) errors.push("ACTIVE state requires Active-Request");
  }
  if (status.Specification && !await exists(status.Specification)) errors.push(`Missing active milestone specification: ${status.Specification}`);
  if (status["Active-Request"]) {
    const heading = new RegExp(`^## ${status["Active-Request"].replace(/[.*+?^$\\{\\}()|[\\]\\]/g, "\\$&")} — `, "m");
    if (!heading.test(tasksText)) errors.push(`Active request ${status["Active-Request"]} has no TASKS.md request heading`);
  }
  if (!/experience-augmented durable-state architecture/i.test(await text("AGENTS.md"))) errors.push("AGENTS.md does not declare experience-augmented durable-state architecture");
  if (!/experience retrieval is disabled/i.test(await text("RUN_PROMPT.txt"))) errors.push("RUN_PROMPT.txt lacks explicit experience-disabled fallback");
}

async function validateJsonl(path, kind) {
  const contents = await text(path);
  const ids = new Set();
  for (const [index, raw] of contents.split("\n").entries()) {
    if (!raw.trim()) continue;
    let value;
    try { value = JSON.parse(raw); }
    catch (error) { errors.push(`${path}:${index + 1} invalid JSON: ${error.message}`); continue; }
    if (kind === "experience") {
      if (!/^E\d{4,}$/.test(value.id ?? "")) errors.push(`${path}:${index + 1} invalid experience id`);
      if (ids.has(value.id)) errors.push(`${path}:${index + 1} duplicate experience id ${value.id}`);
      ids.add(value.id);
      if (!["episode", "heuristic"].includes(value.kind)) errors.push(`${path}:${index + 1} invalid kind`);
      if (!["active", "stale", "superseded"].includes(value.status)) errors.push(`${path}:${index + 1} invalid status`);
      if (value.confidence?.level && !["low", "medium", "high"].includes(value.confidence.level)) errors.push(`${path}:${index + 1} invalid confidence`);
    } else if (!value.retrieval_id) errors.push(`${path}:${index + 1} retrieval_id missing`);
  }
}
if (await exists("experiences/experiences.jsonl")) await validateJsonl("experiences/experiences.jsonl", "experience");
if (await exists("experiences/retrievals.jsonl")) await validateJsonl("experiences/retrievals.jsonl", "retrieval");

async function walk(directory) {
  const absolute = resolve(root, directory);
  const output = [];
  for (const entry of await readdir(absolute, { withFileTypes: true })) {
    if ([".git", "node_modules", "dist", ".astro", ".experience-index"].includes(entry.name)) continue;
    const path = resolve(absolute, entry.name);
    if (entry.isDirectory()) output.push(...await walk(relative(root, path)));
    else output.push(relative(root, path));
  }
  return output;
}

for (const path of await walk(".")) {
  if (path === "scripts/durable-state-check.mjs") continue;
  if (!/\.(?:js|mjs|ts|astro|css|md|sh)$/.test(path)) continue;
  const contents = await text(path);
  const lines = contents.split("\n");
  let open = 0;
  for (let index = 0; index < lines.length; index++) {
    if (/^\s*(?:\/\/|#|<!--)\s*BEGIN CANONICAL ALGORITHM:/.test(lines[index])) {
      open++;
      const nearby = lines.slice(index, index + 6).join("\n");
      const reference = nearby.match(/Reference:\s*(docs\/[A-Za-z0-9._/-]+\.md)/)?.[1];
      if (!reference) errors.push(`${path}:${index + 1} canonical block has no nearby Reference: docs/... marker`);
      else if (!await exists(reference)) errors.push(`${path}:${index + 1} missing canonical reference ${reference}`);
    }
    if (/^\s*(?:\/\/|#|<!--)\s*END CANONICAL ALGORITHM:/.test(lines[index])) open--;
    if (open < 0) { errors.push(`${path}:${index + 1} canonical END without BEGIN`); open = 0; }
  }
  if (open !== 0) errors.push(`${path} has unbalanced canonical algorithm markers`);
}

if (errors.length) {
  console.error(JSON.stringify({ status: "FAIL", errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "PASS", checks: ["required durable files", "STATUS/TASKS synchronization", "active request/spec", "experience JSONL", "canonical source references"] }, null, 2));
