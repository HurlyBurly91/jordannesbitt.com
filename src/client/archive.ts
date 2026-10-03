import { defaultFilters, readFilters, filterNames, filterQuery, filterEntries, type ArchiveEntry, type Filters } from "../lib/archive.ts";

const form = document.querySelector<HTMLFormElement>("[data-archive-form]");
const data = document.getElementById("archive-data");
const list = document.querySelector<HTMLOListElement>("[data-archive-list]");
if (form && data && list) {
  const entries: ArchiveEntry[] = JSON.parse(data.textContent ?? "[]");
  const controls = form.querySelector<HTMLFieldSetElement>("fieldset")!;
  const count = document.querySelector<HTMLElement>("[data-result-count]")!;
  const empty = document.querySelector<HTMLElement>("[data-no-results]")!;
  const rows = new Map([...list.querySelectorAll<HTMLElement>("[data-work-id]")].map((row) => [row.dataset.workId!, row]));
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  function render(filters: Filters) {
    const matches = filterEntries(entries, filters);
    const ids = new Set(matches.map((entry) => entry.id));
    for (const [id, row] of rows) row.hidden = !ids.has(id);
    for (const entry of matches) list!.append(rows.get(entry.id)!);
    count.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} of ${entries.length} published works`;
    empty.hidden = matches.length > 0;
    for (const name of filterNames) field(name).value = filters[name];
  }
  function apply(filters: Filters, history = true) {
    render(filters);
    const url = `${location.pathname}${filterQuery(filters)}`;
    if (history && url !== `${location.pathname}${location.search}`) window.history.pushState(null, "", url);
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const name of filterNames) params.set(name, field(name).value);
    apply(readFilters(params, entries));
  });
  form.querySelector("[data-reset]")!.addEventListener("click", () => apply({ ...defaultFilters }));
  window.addEventListener("popstate", () => apply(readFilters(new URLSearchParams(location.search), entries), false));
  apply(readFilters(new URLSearchParams(location.search), entries), false);
  controls.disabled = false;
}
