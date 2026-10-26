const inspection = document.querySelector<HTMLDialogElement>("[data-image-inspection]");
if (inspection && typeof inspection.showModal === "function") {
  const dialog = inspection;
  const viewport = dialog.querySelector<HTMLElement>("[data-inspection-viewport]")!;
  const size = dialog.querySelector<HTMLButtonElement>("[data-inspection-size]")!;
  const file = dialog.querySelector<HTMLAnchorElement>("[data-inspection-file]")!;
  let launcher: HTMLAnchorElement | null = null;
  let previousOverflow = "";
  let active = false;
  function fit() {
    viewport.dataset.view = "fit";
    viewport.scrollTo(0, 0);
    size.setAttribute("aria-pressed", "false");
    size.textContent = "Larger view";
  }
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("[data-inspect-image]") : null;
    if (!target || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    launcher = target;
    const image = document.createElement("img");
    image.src = target.href;
    image.alt = target.dataset.imageAlt ?? "Artwork reproduction";
    image.width = Number(target.dataset.imageWidth);
    image.height = Number(target.dataset.imageHeight);
    image.decoding = "async";
    image.addEventListener("error", () => {
      const message = document.createElement("p");
      message.textContent = "The inspection image could not load. Try the image file link or close to return to the work.";
      message.setAttribute("role", "status");
      viewport.replaceChildren(message);
    }, { once: true });
    viewport.replaceChildren(image);
    file.href = target.href;
    fit();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    active = true;
    dialog.showModal();
  });
  size.addEventListener("click", () => {
    if (viewport.dataset.view === "detail") fit();
    else {
      viewport.dataset.view = "detail";
      size.setAttribute("aria-pressed", "true");
      size.textContent = "Fit image";
      viewport.focus();
    }
  });
  function restore() {
    if (!active || dialog.open) return;
    active = false;
    document.body.style.overflow = previousOverflow;
    viewport.replaceChildren();
    file.removeAttribute("href");
    launcher?.focus({ preventScroll: true });
  }
  function close() {
    dialog.close();
    restore();
  }
  dialog.querySelector("[data-inspection-close]")!.addEventListener("click", close);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')];
    const first = controls[0], last = controls.at(-1);
    if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  });
  dialog.addEventListener("close", restore);
}
