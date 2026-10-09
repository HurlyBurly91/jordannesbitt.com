import { access, readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative } from "node:path";

const root = process.cwd();
const errors = [];
const required = [
  ".durable-state/MANIFEST",
  ".durable-state/framework/AGENTS.md",
  ".durable-state/framework/RUN_PROMPT.txt",
  ".durable-state/framework/SCHEMAS.md",
  ".durable-state/framework/validator.py",
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

function parseManifest(document) {
  const values = {};
  for (const raw of document.split("\n")) {
    if (!raw.trim()) continue;
    const index = raw.indexOf("=");
    if (index <= 0) { errors.push(`Invalid MANIFEST line: ${raw}`); continue; }
    const key = raw.slice(0,index), value = raw.slice(index+1);
    if (key in values) errors.push(`Duplicate MANIFEST key: ${key}`);
    values[key] = value;
  }
  return values;
}

async function frameworkPayloadHash(directory) {
  async function files(dir) {
    const output=[];
    for (const entry of await readdir(resolve(root,dir),{withFileTypes:true})) {
      const path=relative(root,resolve(root,dir,entry.name));
      if(entry.isDirectory()) output.push(...await files(path)); else output.push(path);
    }
    return output;
  }
  const paths=(await files(directory)).sort();
  const hash=createHash("sha256");
  for(const path of paths){
    const rel=relative(directory,path);
    const content=await readFile(resolve(root,path));
    const fileHash=createHash("sha256").update(content).digest("hex");
    hash.update(rel); hash.update(Buffer.from([0])); hash.update(fileHash+"\n");
  }
  return hash.digest("hex");
}

if (errors.length === 0) {
  const statusText = await text("STATUS.md");
  const tasksText = await text("TASKS.md");
  const status = header(statusText, "STATUS.md");
  const tasks = header(tasksText, "TASKS.md");
  for (const key of ["Milestone", "State", "Phase", "Active-Request", "Spec", "Ledger", "Experience-Retrieval"]) {
    if ((status[key] ?? null) !== (tasks[key] ?? null)) errors.push(`STATUS/TASKS mismatch for ${key}: ${status[key]} vs ${tasks[key]}`);
  }
  if (!["NOT_STARTED", "ACTIVE", "BLOCKED", "COMPLETE"].includes(status.State)) errors.push(`Invalid milestone State: ${status.State}`);
  if (status.State === "ACTIVE") {
    if (!["IMPLEMENTATION", "AUTOMATED_VERIFICATION", "HUMAN_VERIFICATION", "FOLLOW_UP"].includes(status.Phase)) errors.push(`Invalid active Phase: ${status.Phase}`);
    if (!status["Active-Request"]) errors.push("ACTIVE state requires Active-Request");
  }
  if (status.Spec && !await exists(status.Spec)) errors.push(`Missing active milestone specification: ${status.Spec}`);
  if (status.Ledger !== "TASKS.md") errors.push(`Unexpected Ledger: ${status.Ledger}`);
  if (status["Experience-Retrieval"] !== "disabled") errors.push("Experience retrieval must remain disabled unless a later explicit project decision changes it");
  if (status["Active-Request"]) {
    const escaped=status["Active-Request"].replace(/[.*+?^$\{\}()|[\]\\]/g,"\\$&");
    if (!new RegExp(`^## ${escaped} — `,"m").test(tasksText)) errors.push(`Active request ${status["Active-Request"]} has no TASKS.md request heading`);
  }

  const agents=await text("AGENTS.md"), resume=await text("RUN_PROMPT.txt");
  if (!agents.includes("Framework-Policy: .durable-state/framework/AGENTS.md")) errors.push("AGENTS.md lacks Framework-Policy integration marker");
  if (!resume.includes("Framework-Resume: .durable-state/framework/RUN_PROMPT.txt")) errors.push("RUN_PROMPT.txt lacks Framework-Resume integration marker");
  if (!/experience-augmented durable-state architecture/i.test(agents)) errors.push("AGENTS.md does not identify the experience-augmented durable-state architecture");
  if (!/experience retrieval is disabled/i.test(resume)) errors.push("RUN_PROMPT.txt lacks explicit experience-disabled fallback");

  const manifest=parseManifest(await text(".durable-state/MANIFEST"));
  const expected={
    FORMAT_VERSION:"1",
    VARIANT:"experience-augmented",
    FRAMEWORK_VERSION:"1.1.0",
    SCHEMA_VERSION:"2",
    SOURCE_REPOSITORY:"HurlyBurly91/durable-state-machine",
    SOURCE_COMMIT:"7dd83b11600ebb16af784026ed66845278c9c1f0",
  };
  for(const [key,value] of Object.entries(expected)) if(manifest[key]!==value) errors.push(`MANIFEST ${key}=${manifest[key]} expected ${value}`);
  if(!/^[0-9a-f]{64}$/.test(manifest.PAYLOAD_SHA256??"")) errors.push("MANIFEST PAYLOAD_SHA256 invalid");
  else {
    const actual=await frameworkPayloadHash(".durable-state/framework");
    if(actual!==manifest.PAYLOAD_SHA256) errors.push(`Framework payload hash mismatch: ${actual}`);
  }
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
    if ([".git", "node_modules", "dist", ".astro", ".experience-index", ".durable-state"].includes(entry.name)) continue;
    const path = resolve(absolute, entry.name);
    if (entry.isDirectory()) output.push(...await walk(relative(root, path)));
    else output.push(relative(root, path));
  }
  return output;
}

for (const path of await walk(".")) {
  if (path === "scripts/durable-state-check.mjs") continue;
  if (!/\.(?:js|mjs|ts|astro|css|sh)$/.test(path)) continue;
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
console.log(JSON.stringify({
  status: "PASS",
  checks: [
    "framework manifest/payload identity",
    "framework integration markers",
    "STATUS/TASKS synchronization",
    "active request/spec/ledger",
    "experience JSONL",
    "canonical source references"
  ]
}, null, 2));
