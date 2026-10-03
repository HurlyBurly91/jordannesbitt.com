// SYNTHETIC TEST FIXTURES ONLY — never production content or actual artist facts/offers.
export function professionalCases(data) {
  const portrait = data.artworks[0];
  portrait.homepageLead = true;
  portrait.availability = { state: "available", reviewed: true, mode: "enquiry-only" };
  portrait.framing = "unframed";
  data.artworks[1].availability = { state: "sold", reviewed: true };
  data.artworks.push({ ...portrait, id: "specimen-priced", slug: "specimen-priced", aliases: [], title: "Synthetic priced specimen", homepageLead: false, featured: false, selectedOrder: undefined, availability: { state: "available", reviewed: true, mode: "price", price: { amountMinor: 125000, currency: "CAD" } } });
  data.artworks.push({ ...portrait, id: "specimen-edition", slug: "specimen-edition", aliases: [], title: "Synthetic edition specimen", homepageLead: false, featured: false, selectedOrder: undefined, medium: "printmaking", kind: "original-print", edition: { size: 10, artistProofs: 2, signed: true }, availability: { state: "edition-available", reviewed: true, mode: "enquiry-only" } });
  data.professional = [{ id: "profile", published: true, fixture: false,
    biography: ["Synthetic biographical paragraph for the local preview, not an actual artist biography."], statement: ["Synthetic practice statement for testing only."],
    cv: [{ date: { certainty: "exact", year: 2000 }, category: "exhibition", text: "Synthetic exhibition entry — not a real exhibition." }],
    contact: { email: "recipient@example.invalid", label: "Synthetic studio contact" }, acquisitionNotes: ["Synthetic enquiry context, not a real business policy."],
  }];
  return data;
}
