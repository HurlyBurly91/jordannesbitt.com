import { parseArgs } from "node:util";
import { ingest } from "./lib/ingestion.mjs";

try {
  const { values } = parseArgs({ options: {
    input: { type: "string" }, output: { type: "string" }, id: { type: "string" }, title: { type: "string" },
    medium: { type: "string" }, kind: { type: "string" }, alt: { type: "string" }, creator: { type: "string" }, rights: { type: "string" },
    "dry-run": { type: "boolean" }, "assume-srgb": { type: "boolean" }, fixture: { type: "boolean" }, help: { type: "boolean" },
  } });
  if (values.help) {
    console.log("npm run ingest -- --input <selected-export> --output <outside-checkout> --id <neutral-id> --title <review-title> --medium <medium> --alt <approved-description> [--dry-run] [--assume-srgb] [--creator <approved-name>] [--rights <approved-text>] [--fixture]");
  } else {
    const result = await ingest({ ...values, dryRun: values["dry-run"], assumeSrgb: values["assume-srgb"] });
    console.log(JSON.stringify(result, null, 2));
  }
} catch (error) {
  console.error(`Intake failed: ${error.message}`);
  process.exitCode = 1;
}
