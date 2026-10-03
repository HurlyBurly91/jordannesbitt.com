# Acquisition and professional trust

## First release

Provide a quiet, explicit Available view and an artwork-specific enquiry route. The work remains the focus. Prefer visible, owner-approved prices with currency where the owner has set a price; allow an explicit enquiry-only mode where appropriate. Never make up a price or publish an old conversational estimate as a current offer.

Show the actual medium/process, image and sheet dimensions where relevant, edition size and artist's proofs if verified, signature/numbering, framed/unframed status, condition disclosures where needed and who handles the enquiry. Distinguish originals, original prints and reproductions. Include approved shipping destinations, packing, framing, collection and timing information; unknown shipping costs must not be presented as included.

Use available, reserved, sold, not-for-sale, edition-available and unknown states with documented semantics. Public availability must be explicitly reviewed. Do not claim remaining stock without a maintained inventory source. Sold works retain their URLs and archive importance. No fake urgency, testimonials, investment-return claims, scarcity timers or unverifiable provenance.

## Contact behavior

An enquiry carries the work ID/title/URL and routes to the approved public recipient or representative. Collect only necessary information. Provide clear progress, failure and acknowledgement behavior only when an actual backend supports it. A mailto link is a mailto link, not evidence that mail was sent or received. Keep an accessible direct-contact alternative.

Mocks cover normal/error/spam cases. A real delivery test requires explicit permission and verified receipt by the owner before production acceptance. Never automatically subscribe an enquirer to a mailing list. Newsletter integration is optional and needs separate consent/configuration. Do not store messages, buyer details or secrets in Git or client-visible configuration.

## Hosting and business gates

GitHub Pages excludes sites primarily facilitating commercial transactions (source R08 in research.md). Do not assume that moving checkout to another URL makes every commercial use compliant. Keep the current deployment untouched during preparation; M10 must select or confirm suitable hosting for the intended sales-oriented site before release. No automatic paid signup, DNS changes or legal-policy publication.

Business terms, jurisdiction-dependent tax/shipping/returns obligations, prices and representations require owner input and current verification. Do not copy another artist's foreign terms. This contract is not legal or tax advice and does not approve a particular policy.

## Deferred checkout

M11 is separately authorized only after fulfilment and inventory rules are ready. Use a suitable hosted payment/commerce service rather than handling card data here. Link public artwork IDs to stock/SKUs; identify the transactional inventory authority and reconciliation behavior. A static availability field cannot prevent overselling. Test duplicate events, stock conflicts, failed payments, cancellation/refund paths and stale displays before enabling real purchases.

Measure enquiries actually received and sales actually completed separately from clicks. No guarantee of conversion follows from adopting these patterns.

## Implemented technical enquiry path (M07)

Available is a view of canonical public records with explicitly reviewed available/edition-available state. Sold/reserved/not-for-sale/unknown remain portfolio entries without an offered-work CTA. Display only supplied approved price/currency (minor units formatted using that currency's fraction digits), edition/proofs and explicit framing/condition; never infer framing from a size record or remaining stock from an edition size. Homepage lead is an explicit single public `homepageLead` choice, not automatic curation; real professional content/recipient/lead/offers remain owner M09 input.

Artwork enquiry links point internally to `/contact/?work=<neutral-id>` when a public recipient exists. `src/lib/enquiry.ts` is a **mailto draft adapter**, not a delivery backend. It carries work ID/title/canonical URL, rejects absent/invalid recipient, empty/oversized message and honeypot input, and prepares an encoded local draft. The optional form enables only after JavaScript initialization; an accessible direct public email link is the no-JS fallback. No message or buyer data is sent/stored by the website; the visitor explicitly opens/sends through their mail app. Ready means draft ready, never sent/received/acknowledged. Ordinary tests inspect draft intent only and do not launch a mail app.

Source-backed About and a separately printable CV omit unsupported facts; CV route/download exists only for supplied public content. Missing homepage/professional/contact content is marked as release-blocking construction state for M08/M09 rather than padded with invented work/facts. Studio/Journal/newsletter/checkout are not promised without genuine approved support.

Real public recipient/offer/business facts require M09 approval. Real delivery/receipt tests need separate explicit permission and owner verification at M09/M10; draft preparation is not evidence of delivery. Tax/shipping/framing/returns/legal policies and hosting remain owner/release decisions, with no copied draft policy or paid/message/payment service activated by this technical capability.
