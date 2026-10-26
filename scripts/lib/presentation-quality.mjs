import assert from "node:assert/strict";
import { auditAccessibility } from "./browser-quality.mjs";

export async function presentationBounds(page) {
  return page.evaluate(() => {
    const box = (element) => {
      const { x, y, width, height, bottom, right } = element.getBoundingClientRect();
      return { x, y, width, height, bottom, right };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio, scale: visualViewport?.scale ?? null, htmlZoom: getComputedStyle(document.documentElement).zoom, bodyZoom: getComputedStyle(document.body).zoom },
      indexes: [...document.querySelectorAll(".work-grid, .archive-list")].map((grid) => ({ columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length, box: box(grid) })),
      images: [...document.querySelectorAll("main img:not(.video-poster)")].map((image) => {
        const frame = image.closest(".card-image, .reproduction-open") ?? image.parentElement;
        return { source: new URL(image.currentSrc || image.src).pathname, box: box(image), frame: box(frame), natural: { width: image.naturalWidth, height: image.naturalHeight }, complete: image.complete, primary: image.matches(".artwork-detail > div.artwork-images > .reproduction:first-of-type img"), role: image.closest("figure")?.className ?? image.closest("article")?.dataset.presentation ?? "archive" };
      }),
    };
  });
}

export function assertPresentationBounds(bounds, { primaryFit = true } = {}) {
  const { viewport } = bounds;
  assert.equal(viewport.scale, 1, "capture uses 100% zoom / visualViewport scale 1");
  assert.equal(viewport.dpr, 1, "documented capture DPR 1");
  assert.ok(["1", "normal"].includes(viewport.htmlZoom) && ["1", "normal"].includes(viewport.bodyZoom), "no CSS zoom compensation");
  const columns = viewport.width >= 1100 ? 3 : viewport.width >= 600 ? 2 : 1;
  for (const grid of bounds.indexes) assert.equal(grid.columns, columns, "normal-scale browse columns");
  for (const image of bounds.images) {
    assert.ok(image.complete && image.natural.width > 0, `decoded image: ${image.source}`);
    assert.ok(image.box.width > 0 && image.box.height > 0, "visible non-zero reproduction");
    assert.ok(Math.abs(image.box.width / image.box.height - image.natural.width / image.natural.height) < .02, "complete natural-ratio image, no distortion");
    assert.ok(image.box.width <= image.frame.width + 1 && image.box.height <= image.frame.height + 1, "image contained within its display plane");
    assert.ok(image.box.height <= viewport.height * .75 + 1, "normal presentation is viewport-bounded");
    if (image.role.includes("reproduction--home") || (image.primary && viewport.width < 760)) assert.ok(image.frame.height <= image.box.height + 1, "home/narrow object avoids excess empty vertical image plane");
    if (image.primary && primaryFit) assert.ok(image.box.y >= 0 && image.box.bottom <= viewport.height + 1, "complete primary reproduction fits initial object viewport");
  }
}

export async function exerciseInspection(page, { method = "keyboard", capture } = {}) {
  const launcher = page.locator(".object-primary [data-inspect-image]").first();
  const dialog = page.locator("[data-image-inspection]");
  const previousOverflow = await page.evaluate(() => document.body.style.overflow);
  const url = page.url();
  await launcher.focus();
  assert.notEqual(await launcher.evaluate((link) => getComputedStyle(link).outlineStyle), "none", "visible launch focus");
  if (method === "tap") await launcher.tap();
  else await launcher.press("Enter");
  await dialog.waitFor({ state: "visible" });
  await dialog.locator("img").evaluate((image) => image.decode());
  assert.equal(page.url(), url, "inspection retains object page and history");
  assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)), "initial modal focus");
  const fit = await dialog.evaluate((element) => {
    const frame = element.querySelector("[data-inspection-viewport]"), image = frame.querySelector("img");
    const imageBox = image.getBoundingClientRect(), frameBox = frame.getBoundingClientRect();
    return { image: { width: imageBox.width, height: imageBox.height }, frame: { width: frameBox.width, height: frameBox.height }, natural: { width: image.naturalWidth, height: image.naturalHeight }, overflow: { x: frame.scrollWidth > frame.clientWidth + 1, y: frame.scrollHeight > frame.clientHeight + 1 } };
  });
  assert.ok(fit.image.width <= fit.frame.width + 1 && fit.image.height <= fit.frame.height + 1, "fit shows the whole image");
  assert.ok(Math.abs(fit.image.width / fit.image.height - fit.natural.width / fit.natural.height) < .02, "inspection natural ratio");
  assert.deepEqual(fit.overflow, { x: false, y: false }, "fit requires no image-plane scrolling");
  for (let step = 0; step < 6; step++) {
    await page.keyboard.press("Tab");
    assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)), "Tab remains in modal");
  }
  await page.keyboard.press("Shift+Tab");
  assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)), "reverse Tab remains in modal");
  const accessibility = await auditAccessibility(page);
  if (capture) await capture("fit");
  const size = dialog.locator("[data-inspection-size]");
  assert.equal(await size.innerText(), "Larger view");
  await size.click();
  assert.equal(await size.getAttribute("aria-pressed"), "true");
  const larger = await dialog.locator("[data-inspection-viewport]").evaluate((frame) => ({ scrollWidth: frame.scrollWidth, scrollHeight: frame.scrollHeight, width: frame.clientWidth, height: frame.clientHeight, imageWidth: frame.querySelector("img").clientWidth, imageHeight: frame.querySelector("img").clientHeight }));
  assert.ok(larger.imageWidth >= fit.image.width - 1 && larger.imageHeight >= fit.image.height - 1, "pixel inspection does not shrink image");
  await dialog.locator("[data-inspection-viewport]").evaluate((frame) => frame.scrollTo(frame.scrollWidth, frame.scrollHeight));
  if (capture) await capture("larger");
  await dialog.getByRole("button", { name: "Fit image", exact: true }).click();
  assert.equal(await size.getAttribute("aria-pressed"), "false");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.ok(await launcher.evaluate((link) => link === document.activeElement), "Escape restores launch focus");
  assert.equal(await page.evaluate(() => document.body.style.overflow), previousOverflow, "background scroll restored");
  await launcher.press("Enter");
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  assert.ok(await launcher.evaluate((link) => link === document.activeElement), "Close restores launch focus");
  return { method, fit, larger, accessibility, escapeAndCloseFocusReturn: "PASS", backgroundScrollRestoration: "PASS", tabContainment: "PASS" };
}
