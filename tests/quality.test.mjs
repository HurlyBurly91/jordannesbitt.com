import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { inspectOutput, elements, outputFiles } from "../scripts/lib/output-quality.mjs";
import { releaseIssues, contentDigest } from "../scripts/lib/release-gate.mjs";
import { auditAccessibility, measurePage, launchBrowser } from "../scripts/lib/browser-quality.mjs";
import { isolatedProject, repository } from "./helpers/build-project.mjs";
import { specimenSite } from "./helpers/specimen-site.mjs";
import { professionalCases } from "./fixtures/professional.mjs";
import { movingCases, prepareMoving } from "./fixtures/moving-image.mjs";
import { reviewPaths } from "../scripts/lib/review-package.mjs";

test("actual production build has valid local links/assets/metadata/sitemap and budget", async (t) => {
  const result = await inspectOutput(resolve(repository, "dist"));
  assert.equal(result.htmlPages, 13);
  assert.ok(result.references > 0 && result.largestJsGzip <= 100 * 1024);
  t.diagnostic(JSON.stringify(result));
});

test("verification fails on deliberate broken links, fixture leakage, image corruption and JS budget", async (t) => {
  const project = await isolatedProject(t);
  const built = await project.build();
  assert.equal(built.code, 0, built.output);
  const output = resolve(project.root, "dist"), index = resolve(output, "index.html");
  const original = await readFile(index, "utf8");
  await writeFile(index, original.replace("</main>", '<a href="/deliberately-missing-page/">Broken negative case</a></main>'));
  await assert.rejects(inspectOutput(output), /Broken local link/);
  await writeFile(index, original.replace("</main>", '<p>TEST FIXTURE negative case</p></main>'));
  await assert.rejects(inspectOutput(output), /Fixture\/draft leak/);
  await writeFile(index, original.replace("</main>", '<img src="/corrupt.png" alt="Deliberately corrupt negative asset" width="10" height="10"></main>'));
  await writeFile(resolve(output, "corrupt.png"), "not an image");
  await assert.rejects(inspectOutput(output), /unsupported image format/i);
  await writeFile(index, original);
  await assert.rejects(inspectOutput(output, { jsBudget: 1 }), /JavaScript.*budget exceeded/);
});

test("strict real-content checker blocks empty launch and the actual CLI returns failure", async () => {
  const issues = await releaseIssues(repository, resolve(repository, "dist"));
  assert.ok(issues.some((issue) => issue.includes("M09 owner-approved exact launch manifest")));
  assert.ok(issues.some((issue) => issue.includes("No genuine approved")));
  assert.ok(issues.some((issue) => issue.includes("recipient")));
  assert.ok(issues.some((issue) => issue.includes("Construction content")));
  await assert.rejects(promisify(execFile)(process.execPath, [resolve(repository, "scripts/release-check.mjs")], { cwd: repository }), (error) => error.code === 1 && error.stderr.includes("BLOCKED_CONTENT"));
});

test("explicit local preview mode is noindex without changing production robot/deploy settings", async (t) => {
  const project = await isolatedProject(t);
  const built = await project.build({ mode: "preview" });
  assert.equal(built.code, 0, built.output);
  for (const file of (await outputFiles(resolve(project.root, "dist"))).filter((file) => file.endsWith(".html"))) {
    const robots = elements(await readFile(file, "utf8")).find((node) => node.tag === "meta" && node.attrs.name === "robots");
    assert.equal(robots?.attrs.content, "noindex,nofollow");
  }
});

test("representative synthetic templates pass actual axe/reflow/keyboard and mobile lab budgets", async (t) => {
  const site = await specimenSite(t, (data) => professionalCases(movingCases(data)), { prepare: prepareMoving });
  const browser = await launchBrowser();
  t.after(() => browser.close());
  const output = await inspectOutput(resolve(site.root, "dist"), { allowFixtures: true });
  assert.ok(output.images > 0);
  const reviewNeeds = new Set();
  for (const width of [360, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    await context.route("**/*", (route) => new URL(route.request().url()).origin === site.origin ? route.continue() : route.abort());
    const page = await context.newPage();
    for (const path of reviewPaths) {
      await page.goto(`${site.origin}${path}`, { waitUntil: "networkidle" });
      const audit = await auditAccessibility(page);
      assert.deepEqual(audit.violations, [], `${width}px ${path}: ${JSON.stringify(audit.violations)}`);
      for (const item of audit.incomplete) reviewNeeds.add(item.id);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} reflow at ${width}`);
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      for (const schema of schemas) JSON.parse(schema);
      await page.keyboard.press("Tab");
      assert.ok(await page.evaluate(() => document.activeElement instanceof HTMLAnchorElement || document.activeElement instanceof HTMLButtonElement || document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement || document.activeElement instanceof HTMLSelectElement), "keyboard reaches an operable element");
    }
    await context.close();
  }
  for (const path of ["/", "/artwork/specimen-portrait/", "/archive/"]) {
    const metrics = await measurePage(browser, site.origin, path);
    assert.ok(metrics.lcp > 0 && metrics.cls >= 0);
    t.diagnostic(JSON.stringify({ syntheticLab: metrics, browser: browser.version(), profile: "360x800 DPR1,1.6Mbps/750kbps/150ms,CPU4x,cache disabled", limitation: "not actual art/field/INP" }));
  }
  const issues = await releaseIssues(site.root, resolve(site.root, "dist"));
  assert.ok(issues.some((issue) => issue.includes("Synthetic fixture ID")) && issues.some((issue) => issue.includes("Reserved test recipient")), "synthetic professional/CV/offer fixtures cannot pass release gate");
  await writeFile(resolve(site.root, "src/config/launch-manifest.json"), JSON.stringify({ approvedBy: "test-fixture", approvedOn: "2000-01-01", contentSha256: await contentDigest(site.root) }));
  assert.ok((await releaseIssues(site.root, resolve(site.root, "dist"))).some((issue) => issue.includes("Explicit M09 owner content approval")), "test fixture approval never becomes actual owner approval");
  site.data.artworks.find((work) => work.id === "specimen-priced").availability.price.amountMinor += 100;
  await site.content("artworks", site.data.artworks);
  const changed = await releaseIssues(site.root, resolve(site.root, "dist"));
  assert.ok(changed.some((issue) => issue.includes("snapshot checksum")), "changed offer cannot reuse an unchanged approved snapshot");
  assert.ok(changed.some((issue) => issue.includes("Built output does not match")), "stale output cannot validate changed source metadata");
  const rendered = resolve(site.root, "dist/index.html");
  await writeFile(rendered, (await readFile(rendered, "utf8")).replace("</main>", "<p>Unreviewed output mutation</p></main>"));
  assert.ok((await releaseIssues(site.root, resolve(site.root, "dist"))).some((issue) => issue.includes("output bytes changed")), "post-build rendered edits cannot reuse build proof");
  t.diagnostic(`axe4.13.0 WCAG2.2-AA-target automation, Chromium${browser.version()}, incomplete/manual-review rule IDs: ${[...reviewNeeds].join(", ") || "none observed"}; no full-conformance/human approval claim`);
});
