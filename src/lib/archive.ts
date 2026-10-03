export type ArchiveEntry = {
  id: string; slug: string; title: string; date: string; year?: number; medium: string; mediumLabel: string;
  availability: string; series: { id: string; slug: string; title: string }[]; searchText: string;
  thumbnail?: { src: string; alt: string; width: number; height: number };
};
export type Filters = { q: string; medium: string; series: string; year: string; availability: string; sort: string };
export const defaultFilters: Filters = { q: "", medium: "", series: "", year: "", availability: "", sort: "newest" };
export const filterNames = ["q", "medium", "series", "year", "availability", "sort"] as const;
const normalize = (value: string) => value.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase("en");

export function readFilters(params: URLSearchParams, entries: ArchiveEntry[]): Filters {
  const values = { ...defaultFilters };
  for (const name of filterNames) values[name] = params.get(name) ?? defaultFilters[name];
  values.q = values.q.trim().slice(0, 200);
  if (!["newest", "oldest", "title"].includes(values.sort)) values.sort = "newest";
  if (!entries.some((entry) => entry.medium === values.medium)) values.medium = "";
  if (!entries.some((entry) => entry.series.some((series) => series.id === values.series))) values.series = "";
  if (!entries.some((entry) => String(entry.year ?? "unknown") === values.year)) values.year = "";
  if (!entries.some((entry) => entry.availability === values.availability)) values.availability = "";
  return values;
}
export function filterQuery(filters: Filters): string {
  const params = new URLSearchParams();
  for (const name of filterNames) if (filters[name] && filters[name] !== defaultFilters[name]) params.set(name, filters[name]);
  const query = params.toString();
  return query ? `?${query}` : "";
}
export function filterEntries(entries: ArchiveEntry[], filters: Filters): ArchiveEntry[] {
  const words = normalize(filters.q.trim()).split(/\s+/).filter(Boolean);
  const filtered = entries.filter((entry) =>
    (!filters.medium || entry.medium === filters.medium) &&
    (!filters.series || entry.series.some((series) => series.id === filters.series)) &&
    (!filters.year || String(entry.year ?? "unknown") === filters.year) &&
    (!filters.availability || entry.availability === filters.availability) &&
    words.every((word) => normalize(entry.searchText).includes(word)),
  );
  return filtered.sort((a, b) => {
    if (filters.sort !== "title") {
      if (a.year === undefined && b.year !== undefined) return 1;
      if (b.year === undefined && a.year !== undefined) return -1;
      const difference = filters.sort === "oldest" ? (a.year ?? 0) - (b.year ?? 0) : (b.year ?? 0) - (a.year ?? 0);
      if (difference) return difference;
    }
    return a.title.localeCompare(b.title, "en") || a.id.localeCompare(b.id, "en");
  });
}
