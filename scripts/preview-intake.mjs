import { parseArgs } from "node:util";
import { startIntakePreview } from "./lib/intake-preview.mjs";

try {
  const { values } = parseArgs({ options: { directory: { type: "string" } } });
  if (!values.directory) throw new Error("Provide the explicit --directory containing record.json and derivatives");
  const preview = await startIntakePreview(values.directory);
  console.log(`Loopback-only intake review: ${preview.origin}`);
  const stop = async () => { await preview.stop(); process.exit(0); };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
} catch (error) { console.error(error.message); process.exitCode = 1; }
