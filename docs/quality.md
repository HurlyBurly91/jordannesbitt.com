# Quality, discovery and evidence

## Search and sharing

Generate unique truthful titles/descriptions, canonical URLs, crawlable HTML links, breadcrumbs, Open Graph previews and sitemaps from published content. Images use normal img/src markup with responsive sources, intrinsic dimensions, relevant surrounding text and accurate alt text. Do not use filenames or keyword repetition as a substitute for context.

Use Person/VisualArtwork/ImageObject/BreadcrumbList and appropriate VideoObject metadata only when the actual fields and visible content support it. Generic schema vocabulary does not imply eligibility for a Google rich result. Product/Offer markup requires a real matching offer; never invent reviews, ratings, prices, stock or dates. Film discovery needs a genuine watch page, visible playable content and accurate poster/runtime metadata, not merely a gallery thumbnail.

Maintain a legacy URL inventory and redirect/compatibility plan. Preserve /artwork/[slug] identities. Verify apex/www and trailing-slash behavior on the chosen host instead of guessing. Static-host redirect capabilities differ. Search Console ownership, sitemap submission and production robots settings require release authorization. Valid markup cannot guarantee indexing or ranking.

## Accessibility and media

Target WCAG 2.2 AA: semantic landmarks/headings, useful links and alt text, contrast, visible focus, keyboard/touch controls, zoom/reflow, no hover-only meaning, reduced motion and correctly labelled/error-associated forms. Videos need appropriate captions/transcripts and controls; distinguish an asset not supplied from an asset genuinely not applicable. No autoplay audio or forced playback.

Automated accessibility tests supplement manual keyboard, mobile and assistive-technology checks; they do not establish full conformance alone. Test 360px, 768px and 1440px layouts, portrait/landscape images, long titles and no-JavaScript browsing.

## Performance targets

Use responsive derivatives, reserve image dimensions, prioritize the actual lead image and lazy-load below-the-fold content. Avoid loading videos/third-party embeds before user action. Proposed lab budgets: initial JavaScript <=100 KiB gzip for ordinary portfolio pages and initial transfer <=1.5 MiB on the agreed mobile test profile, excluding deliberately started media. Document justified exceptions rather than silently weakening budgets.

Field goals are LCP <=2.5s, INP <=200ms and CLS <=0.1 at the 75th percentile, segmented by device (R07). Lab results before launch are not field measurements. Record browser, viewport, device/network profile, run count and representative page set. Report archive scaling with a separate synthetic dataset, never as the real artwork count.

## Test and release gates

M01 establishes existing build evidence; later milestones add tests as they add behavior. M08 provides one documented verification command covering schema, publication isolation, links/assets, routes, browser interactions, accessibility and relevant performance checks. Release validation must reject fixture leaks, construction copy, broken images, unapproved offers and missing essential public contact/content.

Store concise evidence with task IDs and closeout records; large browser reports belong in appropriate artifacts, without private content. Never report a tool not run as passing. Production smoke checks, real enquiry receipt, human visual acceptance and search observations have distinct evidence.

## Post-release learning

With separate owner authorization, measure useful paths from work/project views to enquiries and completed purchases, not vanity traffic alone. Exclude personal message content from analytics. Record baseline, period, sample size and changes; do not infer causation from tiny samples or promise a sales outcome. Genuine studio updates and earned exhibition/publication links are preferable to automated SEO filler.

## Archive behavior and synthetic scaling (M05)

The archive is comprehensive public data, distinct from explicitly curated Selected Work. `src/lib/search.ts` reuses the canonical publication projection even for a raw snapshot; compact server rows, embedded JSON and `/search-index.json` contain public records/relationships only. Text matching includes title/date/process/materials/context and authored project titles, case/diacritic normalized with all query words matched. Medium/project/year/availability facets derive only from supported public values. Chronological sorts keep unknown dates last; title sorting is explicit. No remaining-stock estimate or AI recommendation.

Labelled Apply/Reset controls progressively enhance the static archive with URL query state and native back/forward restoration. The fieldset stays disabled until enhancement initializes; with no JavaScript all published work links and supported medium/project links remain browsable. Result counts/no-result status are announced without moving focus. Empty public categories are hidden from browse/optional primary links, while original compatibility routes remain generated.

Accepted separate synthetic scale baseline: 2026-10-03, **1,000 published synthetic records**, independent banner-labelled test site, Linux/Node 22.23.3/npm 10.9.9/Astro 5.18.2, Playwright 1.63.0/Chromium 153.0.8010.12, **768×900, DPR 1, unthrottled loopback**, one post-isolation measured run. Observed build **3,912 ms**, filter input/Enter/protocol-to-result interaction **49 ms**, result reduced 1,000→1. Full required suite passed 54 tests; evidence/failure history in records/M05-archive.md.

Astro/Vite writable caches must live in each root's ignored `.astro/cache/` and `.astro/vite/`; linked dependencies are read-only and no fixture content may contaminate the real content store. This prevents Astro's default node_modules cache from being shared across independent fixture roots. Production-cache contamination is explicitly tested. Earlier pre-isolation measurements are diagnostic only and retained in the closeout, not used as accepted performance evidence.

Limitations: shared flat synthetic images, warmed tooling/cache, local runs and headless Chromium; interaction timing includes automation/protocol overhead, not INP. This is a scaling exercise, not field performance, actual art transfer/quality or a real artwork/inventory count. Real catalogue remains empty. M08 performance budgets and M09 real-image judgments still apply.
