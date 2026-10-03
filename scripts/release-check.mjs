import { releaseIssues } from "./lib/release-gate.mjs";
const issues = await releaseIssues(process.cwd(), "dist");
if (issues.length) {
  console.error(JSON.stringify({ release: "BLOCKED_CONTENT", issues, publicationAuthorized: false }, null, 2));
  process.exitCode = 1;
} else console.log(JSON.stringify({ contentGate: "PASS", publicationAuthorized: false, note: "Content validation is not release/hosting authorization; M10 requires a separate grant." }, null, 2));
