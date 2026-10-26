import { parseArgs } from "node:util";
import { snapshotImages, makeContactSheets } from "./lib/pilot-snapshot.mjs";
import { reviewRealPilot, servePilot } from "./lib/real-pilot.mjs";
try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { source: { type: "string" }, output: { type: "string" }, timezone: { type: "string" }, snapshot: { type: "string" }, plan: { type: "string" }, directory: { type: "string" }, baseline: { type: "string" } } });
  if (positionals[0] === "snapshot") {
    const { directory, snapshot } = await snapshotImages(values);
    const sheets = await makeContactSheets(directory, snapshot);
    console.log(JSON.stringify({ directory, runId: snapshot.runId, snapshotSha256: snapshot.snapshotSha256, startedAt: snapshot.startedAt, enumeratedAt: snapshot.enumeratedAt, timezone: snapshot.timezone, supportedPresent: snapshot.enumeratedFiles.length, included: snapshot.included.length, excluded: snapshot.excluded.length, ignoredNonImages: snapshot.ignored.length, sheets: sheets.length, publicationAuthorized: false }, null, 2));
  } else if (positionals[0] === "review") {
    if (!values.snapshot) throw new Error("Review requires the exact --snapshot manifest, never a silently refreshed source directory");
    const summary = await reviewRealPilot({ snapshotPath: values.snapshot, planPath: values.plan, output: values.output, baselinePath: values.baseline });
    console.log(JSON.stringify(summary, null, 2));
    if (summary.violations || summary.reflowFailures) process.exitCode = 1;
  } else if (positionals[0] === "serve") {
    if (!values.directory) throw new Error("Serve requires an explicit private --directory ending in site");
    const preview = await servePilot(values.directory);
    console.log(`Private loopback-only M09 pilot: ${preview.origin}`);
    const stop = async () => { await preview.stop(); process.exit(0); };
    process.once("SIGINT", stop); process.once("SIGTERM", stop);
  } else throw new Error("Use pilot snapshot --source <authorized-root>, pilot review --snapshot <frozen-manifest> [--plan <private-plan>] [--baseline <prior-review>], or pilot serve --directory <private-review/site>");
} catch (error) { console.error(`Local pilot failed: ${error.message}`); process.exitCode = 1; }
