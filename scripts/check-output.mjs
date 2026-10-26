import { parseArgs } from "node:util";
import { inspectOutput } from "./lib/output-quality.mjs";
try {
  const { values } = parseArgs({ options: { directory: { type: "string", default: "dist" } } });
  console.log(JSON.stringify(await inspectOutput(values.directory), null, 2));
} catch (error) { console.error(`Output verification failed: ${error.message}`); process.exitCode = 1; }
