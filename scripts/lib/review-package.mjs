import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { specimenSite } from "../../tests/helpers/specimen-site.mjs";
import { professionalCases } from "../../tests/fixtures/professional.mjs";
import { movingCases, prepareMoving } from "../../tests/fixtures/moving-image.mjs";
import { auditAccessibility, measurePage, launchBrowser } from "./browser-quality.mjs";
import { inspectOutput } from "./output-quality.mjs";

export const reviewPaths = ["/", "/artwork/specimen-portrait/", "/artwork/specimen-landscape/", "/artwork/specimen-long/", "/projects/specimen-project/", "/archive/", "/artwork/specimen-film/", "/artwork/specimen-computer/", "/about/", "/cv/", "/available/", "/contact/"];
export const ownerChecklist = `# M09 owner-input and review checklist\n\nThis package is a SYNTHETIC TEST FIXTURE, not Jordan Nesbitt artwork/content, a launch manifest or visual approval. No private input has been read.\n\n- Explicitly authorize M09 and selected input paths. Supply approximately ten representative approved web exports for the pilot; masters/private drafts/releases/business/buyer data stay outside public Git.\n- Supply neutral IDs, stable slugs/aliases, factual titles, exact/circa/unknown dates, actual medium/process/materials, distinct measured image/sheet/framed/object sizes, reproduction order/roles/accurate alt/captions and public-source/reproduction rights approval.\n- Choose actual published work, explicit homepage lead and curated sequence. Approve real projects/series, member IDs/order/context. Approximately 20–30 works/3–5 groups are planning targets only; exact launch manifest is the owner's choice, not these synthetic counts.\n- Approve public identity, professional biography/statement and supplied CV facts/PDF; choose public enquiry recipient/representative. No credentials, awards/exhibitions or policies may be inferred.\n- Review availability (including sold/not-for-sale/unknown), optional actual prices/currency, edition/proofs/signature/numbering and explicit framing/condition. No remaining-stock claim without an inventory authority.\n- For film/computational work supply approved web media/poster/pixel dimensions/alt, honest runtime/date/credits, applicable captions/transcript or genuine applicability reason, provider consent and optional approved public demo links. No original footage/private repositories.\n- Human review real colour/orientation/edges, relative scale, sequence/tone, portrait/landscape/long content, mobile/desktop, keyboard/touch and appropriate assistive-technology behavior; automated results cannot approve the art or full accessibility.\n- Review acquisition clarity and facts. Real mail delivery/receipt test needs separate explicit permission and owner confirmation; local draft readiness is not delivery. Business/tax/shipping/returns/hosting/paid services/DNS/publication need separate approval at M09/M10.\n- Record explicit owner approval and exact IDs/selection/project sequences/homepage lead in M09 launch manifest; never fabricate the approval/date. Then rerun strict content/quality checks. M10 release grant and tested hosting/rollback are still required; M11 commerce remains deferred.\n\nSee repository docs/quality.md and milestone M09. Current execution authority ends after M08.\n`;

export async function createReviewPackage(directory = "/tmp/opencode/jordannesbitt-review") {
  const output = resolve(directory);
  if (!output.startsWith("/tmp/opencode/")) throw new Error("Review artifacts must stay inside the approved /tmp/opencode directory");
  const cleanup = [];
  const harness = { after: (fn) => cleanup.push(fn) };
  await mkdir(resolve(output, "screenshots"), { recursive: true });
  try {
    const site = await specimenSite(harness, (data) => professionalCases(movingCases(data)), { prepare: prepareMoving });
    const browser = await launchBrowser();
    cleanup.push(() => browser.close());
    const report = { kind: "SYNTHETIC TEST FIXTURE — NOT ART/CONTENT/RELEASE APPROVAL", created: new Date().toISOString(), environment: { platform: process.platform, node: process.version, browser: browser.version(), axe: "4.13.0", viewports: [360, 768, 1440], dpr: 1 }, buildMs: Math.round(site.buildMs), output: await inspectOutput(resolve(site.root, "dist"), { allowFixtures: true }), pages: [], performance: [] };
    for (const width of [360, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
      await context.route("**/*", (route) => new URL(route.request().url()).origin === site.origin ? route.continue() : route.abort());
      const page = await context.newPage();
      for (const path of reviewPaths) {
        await page.goto(`${site.origin}${path}`, { waitUntil: "networkidle" });
        const accessibility = await auditAccessibility(page);
        const reflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
        const name = `synthetic-${width}-${path === "/" ? "home" : path.replace(/^\//, "").replace(/\/$/, "").replaceAll("/", "-")}.png`;
        await page.screenshot({ path: resolve(output, "screenshots", name), fullPage: true });
        report.pages.push({ path, width, height: 900, reflow, screenshot: `screenshots/${name}`, accessibility });
      }
      await context.close();
    }
    for (const path of ["/", "/artwork/specimen-portrait/", "/archive/", "/projects/specimen-project/", "/artwork/specimen-film/"]) {
      const runs = [];
      for (let run = 0; run < 3; run++) runs.push(await measurePage(browser, site.origin, path));
      report.performance.push({ path, runs, profile: "360x800 DPR1, 1.6Mbps down/750kbps up/150ms latency, CPU4x, cache disabled, no user-started media", limitation: "Synthetic shared flat images; local headless lab, not real art transfer/field Web Vitals/INP" });
    }
    await writeFile(resolve(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
    await writeFile(resolve(output, "owner-input-checklist.md"), ownerChecklist);
    await writeFile(resolve(output, "README.md"), "# Local synthetic review package\n\nAll screenshots/data are synthetic fixtures, noindex/loopback-only, not actual artwork or owner approval. Open screenshots locally and read report.json + owner-input-checklist.md. Recreate with npm run review. No release or real message/delivery occurred.\n");
    return { output, screenshots: report.pages.length, violations: report.pages.flatMap((page) => page.accessibility.violations).length, reflowFailures: report.pages.filter((page) => !page.reflow).length, performancePages: report.performance.length, report };
  } finally { for (const fn of cleanup.reverse()) await fn(); }
}
