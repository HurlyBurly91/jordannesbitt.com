// SYNTHETIC TEST FIXTURES ONLY — local clip generation, no actual footage/provider contact.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
export function movingCases(data) {
  const base = data.artworks[0];
  const poster = { src: "/media/specimen/poster.png", width: 320, height: 180, role: "primary", alt: "Synthetic clip poster", variants: [] };
  const film = { ...base, id: "specimen-film", slug: "specimen-film", aliases: [], title: "Synthetic local film specimen", medium: "film", kind: "moving-image", reproductions: [poster], film: {
    poster: poster.src, posterInfo: { width: 320, height: 180, alt: poster.alt }, runtimeSeconds: 2,
    sources: [{ src: "/media/specimen/clip.webm", type: "video/webm" }], captions: { status: "provided", tracks: [{ src: "/media/specimen/captions.vtt", language: "en", label: "Synthetic English captions" }] },
    credits: ["Synthetic fixture generator"], transcript: "A synthetic blue rectangle remains on screen; no real artist footage.",
  } };
  const embed = { ...film, id: "specimen-embed", slug: "specimen-embed", title: "Synthetic embed specimen", film: { ...film.film, sources: [], embed: { provider: "youtube", id: "TestVideo01", consentRequired: true }, uploadDate: "2020-01-01T00:00:00Z" } };
  const computer = { ...base, id: "specimen-computer", slug: "specimen-computer", aliases: [], title: "Synthetic computational specimen", medium: "computational", kind: "computational", computational: { summary: "Static synthetic project context remains usable without the optional demo.", tools: ["Synthetic test tool"], demo: { label: "synthetic demo", url: "https://demo.example.invalid/fixture" } } };
  data.artworks.push(film, embed, computer);
  data.projects[0].memberIds.push(film.id, computer.id);
  return data;
}
export async function prepareMoving(project) {
  const path = resolve(project.root, "synthetic-clip.webm");
  await promisify(execFile)("ffmpeg", ["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=blue:s=320x180:r=10", "-t", "2", "-an", "-c:v", "libvpx-vp9", "-b:v", "40k", "-threads", "1", path]);
  await project.asset("/media/specimen/clip.webm", await readFile(path));
  await project.asset("/media/specimen/captions.vtt", Buffer.from("WEBVTT\n\n00:00.000 --> 00:02.000\nSynthetic blue rectangle.\n"));
}
