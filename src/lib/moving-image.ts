import { isPublic, type Artwork } from "./catalogue.ts";
export function watchReady(work: Artwork): boolean { return Boolean(work.film?.poster && (work.film.sources.length || work.film.embed)); }
export function durationLabel(seconds: number): string {
  const hours = Math.floor(seconds / 3600), minutes = Math.floor(seconds % 3600 / 60), remainder = seconds % 60;
  return `${hours ? `${hours}:${String(minutes).padStart(2, "0")}` : minutes}:${String(remainder).padStart(2, "0")}`;
}
export function embedUrls(embed: NonNullable<NonNullable<Artwork["film"]>["embed"]>) {
  return embed.provider === "youtube" ? { player: `https://www.youtube-nocookie.com/embed/${embed.id}`, page: `https://www.youtube.com/watch?v=${embed.id}`, label: "YouTube" }
    : { player: `https://player.vimeo.com/video/${embed.id}`, page: `https://vimeo.com/${embed.id}`, label: "Vimeo" };
}
export function videoMetadata(work: Artwork, siteUrl: string) {
  if (!isPublic(work) || !watchReady(work)) return undefined;
  const film = work.film!;
  return {
    "@context": "https://schema.org", "@type": "VideoObject", name: work.title,
    url: new URL(`/artwork/${work.slug}/`, siteUrl).href, thumbnailUrl: new URL(film.poster!, siteUrl).href,
    ...(work.description ? { description: work.description } : {}),
    ...(film.runtimeSeconds ? { duration: `PT${film.runtimeSeconds}S` } : {}),
    ...(film.uploadDate ? { uploadDate: film.uploadDate } : {}),
    ...(film.sources.length ? { contentUrl: new URL(film.sources[0].src, siteUrl).href } : { embedUrl: embedUrls(film.embed!).player }),
  };
}
