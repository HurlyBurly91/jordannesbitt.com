export const media = [
  { slug: "drawing", label: "Drawing", count: 0 },
  { slug: "painting", label: "Painting", count: 0 },
  { slug: "printmaking", label: "Printmaking", count: 0 },
  { slug: "photography", label: "Photography", count: 0 },
  { slug: "aerial", label: "Aerial", count: 0 },
  { slug: "film", label: "Film", count: 0 },
] as const;

export type Medium = (typeof media)[number]["slug"];

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: Medium;
  materials?: string;
  dimensions?: string;
  image?: string;
  alt: string;
  featured?: boolean;
  published: boolean;
};

// Replace these records with reviewed artwork metadata. Unpublished records
// remain available to the content system but never appear on the public site.
export const artworks: Artwork[] = [];
