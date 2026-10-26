import { isPublic, type Artwork } from "./catalogue.ts";
export function isAvailable(work: Artwork): boolean { return isPublic(work) && work.availability.reviewed && ["available", "edition-available"].includes(work.availability.state); }
export function priceLabel(price: NonNullable<Artwork["availability"]["price"]>): string {
  const formatter = new Intl.NumberFormat("en-CA", { style: "currency", currency: price.currency, currencyDisplay: "code" });
  const precision = formatter.resolvedOptions().maximumFractionDigits;
  if (precision === undefined) throw new Error("Currency formatter did not resolve minor-unit precision");
  return formatter.format(price.amountMinor / 10 ** precision);
}
export function enquiryContext(work: Artwork, siteUrl: string) {
  return { id: work.id, title: work.title, url: new URL(`/artwork/${work.slug}/`, siteUrl).href };
}
