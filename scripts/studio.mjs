import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { persistentPilotRoot } from "./lib/pilot-snapshot.mjs";
import { startStudio } from "./lib/studio-server.mjs";

try {
  const { values } = parseArgs({ options: { port: { type: "string" }, "allow-public-export": { type: "boolean", default: false }, snapshot: { type: "string" } } });
  const port = Number(values.port ?? 0);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("Port must be0–65535; studio binds127.0.0.1 only");
  const snapshotPath = values.snapshot ? resolve(values.snapshot) : resolve(persistentPilotRoot(), "snapshots/run-2026-10-06T00-12-39-275Z-bd2ed33a/snapshot.json");
  const service = await startStudio({ port, snapshotPath, allowPublicExport: values["allow-public-export"] });
  console.log(`Private local Studio: ${service.origin}\nDrafts: ${service.studio.root}\nPublic-source repository writes: ${values["allow-public-export"] ? "explicitly enabled for this run; separate exact approval/export confirmation still required" : "DISABLED; dry-run only"}`);
  let stopping = false;
  const stop = async () => { if (stopping) return; stopping = true; await service.stop(); process.exit(0); };
  process.once("SIGINT", stop); process.once("SIGTERM", stop);
} catch (error) { console.error(`Studio could not start: ${error.message}`); process.exitCode = 1; }
