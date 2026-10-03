import { createReviewPackage } from "./lib/review-package.mjs";
try {
  const { report, ...summary } = await createReviewPackage();
  console.log(JSON.stringify(summary, null, 2));
  if (summary.violations || summary.reflowFailures) process.exitCode = 1;
} catch (error) { console.error(`Local review failed: ${error.message}`); process.exitCode = 1; }
