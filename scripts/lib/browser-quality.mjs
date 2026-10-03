import { chromium } from "playwright";
import axe from "axe-core";
import { assertBudget } from "./output-quality.mjs";

export async function auditAccessibility(page) {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async () => {
    const results = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
    return { violations: results.violations.map(({ id, impact, help, nodes }) => ({ id, impact, help, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), incomplete: results.incomplete.map(({ id, help }) => ({ id, help })), passes: results.passes.length };
  });
}
export async function prepareScreenshot(page) {
  // Capture-only completeness: production browsing and separate lab measurements stay lazy.
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const image of images) image.loading = "eager";
    await Promise.all(images.map((image) => image.decode()));
  });
}
export async function measurePage(browser, origin, path) {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 1 });
  await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.setCacheDisabled", { cacheDisabled: true });
  await session.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8, connectionType: "cellular4g" });
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  let transferBytes = 0;
  session.on("Network.loadingFinished", ({ encodedDataLength }) => { transferBytes += encodedDataLength; });
  await page.addInitScript(() => {
    window.__lab = { lcp: null, cls: 0 };
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__lab.lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__lab.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
  const result = { path, ...await page.evaluate(() => window.__lab), transferBytes };
  await context.close();
  assertBudget(transferBytes, 1.5 * 1024 * 1024, `Initial mobile transfer (${path})`);
  if (result.lcp === null) throw new Error(`LCP measurement unavailable: ${path}`);
  return result;
}
export const launchBrowser = () => chromium.launch();
