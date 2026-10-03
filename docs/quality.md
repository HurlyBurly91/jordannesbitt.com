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

## M08 verification and strict release distinction

`npm run verify` is the one technical command: Astro check/build plus all schema/publication/cache/intake/route/browser tests, semantic parse5 output links/fragments/assets/intrinsic dimensions/JSON-LD/Open Graph/canonical/sitemap, executed-JS gzip budget, actual axe-core WCAG2.2-AA-target checks/reflow/keyboard and simulated mobile transfer/LCP/CLS. Deliberate broken-link/fixture/corrupt-image/JS-budget cases must fail their checker. External links/providers/email are not contacted by output checks; browser provider/demo tests intercept responses.

`npm run release:check` is a separate **strict actual-content gate**, not publication authority. The marked algorithm in `scripts/lib/release-gate.mjs` requires genuine public work, explicit lead, approved professional context/public recipient, supported real accessibility facts and **M09 owner-approved exact manifest**; rejects rendered construction markers, placeholder elements, fixture/draft strings/namespaces and reserved test recipients. Empty actual content must fail. Never interpret the technical fixture suite or a synthetic biography/CV/offer as approval of real facts.

Only after explicit M09 owner approval may `src/config/launch-manifest.json` record `approvedBy: "owner"`, observed `approvedOn`, exact public `artworkIds`, `projectIds`, `selectedIds`, `projectMembers` (ordered IDs per project), `homepageLeadId` and `contentSha256`. Match source order/selection/sequence exactly. The checksum binds the normalized public snapshot and each referenced derivative's SHA256; changed prices/context/biography/media bytes require renewed approval, not just unchanged IDs. Builds stamp source and generated-output byte digests per output directory in their own ignored `.astro/cache/artifact-digests.json`; stale source/output or post-build edits cannot reuse build proof. This is change detection/build proof, not independent proof of owner identity/authorization. Do not fabricate this file/approval or place private draft metadata in Git. A passing content check still does not authorize M10 hosting/DNS/publication or M11 commerce. Real delivery/receipt and policies remain human/separately authorized gates.

`npm run build:preview` uses Astro's installed `--mode preview --outDir /tmp/opencode/jordannesbitt-preview`; BaseLayout emits noindex/nofollow for preview/dev only (aliases retain primary canonical/noindex-follow in normal output). This courtesy is not confidentiality. Production robots/deployment/hosting controls stay for M10 authority; previews remain loopback/local and no private input is loaded.

`npm run review` creates `/tmp/opencode/jordannesbitt-review/`: explicitly **SYNTHETIC** screenshots for 12 representative templates at 360/768/1440×900, report.json and owner-input-checklist.md. Independent test site has mandatory synthetic identity/banner/noindex, per-root cache and approved temporary image/clip generation; it is discarded after capture. No fixture imports/override in production content. All external browser requests are blocked during review; no media/demos/messages are deliberately started by screenshot/performance collection.

Mobile lab profile is a derived reproducible test condition: 360×800/DPR1, Chromium headless, simulated 1.6Mbps download/750kbps upload/150ms latency, CPU4×, cache disabled, three runs/page in review report. Initial transfer budget <=1.5MiB; executed JS <=100KiB gzip. Record LCP/CLS and any incomplete/manual axe findings; not field metrics, INP, real-device/full WCAG, colour or artistic approval. Synthetic flat/shared images cannot prove real-art transfer. M09 must repeat relevant checks on its actual approved pilot/content.

## Inspected legacy URLs and M10 host requirements

Existing root `index.html` links `gallery.html` and `css/index_style.css`; `gallery.html` links home/index and `css/gallery_style.css`, with `images/1.jpg`–`images/19.jpg`, `images/24.jpg`–`images/29.jpg`, `images/33.jpg`–`images/36.jpg` references labelled only untitled. These are an inspected historical URL inventory, not artwork metadata/publication permission. Files/assets are preserved; no automatic import/identity inference. Existing Astro `/`, `/work`, six medium URLs, `/archive`, `/about` and artwork identities remain compatible.

M10 owner-approved host must support/test HTTPS apex/www and trailing-slash/canonical behavior; reviewed `/index.html`→`/` and `/gallery.html`→appropriate archive compatibility/redirect; approved legacy asset preservation/mapping without guesses; cache/security/content-type headers, media range requests, preview isolation/noindex, intended form/mail route, terms/costs suitable for sales-oriented use, captured last-good artifact and rollback. These are requirements to resolve at authorized release, not already configured redirects, DNS, hosting or proven production behavior. Do not change workflows/hosting or submit search tools under M08.

## Exact owner-content checklist

The local review package includes the actionable checklist: explicitly authorized selected web-export directories/rights and representative approximately ten-work pilot; neutral IDs/slugs/title/date/medium/material/typed sizes/ordered reproductions/alt; exact publication/curation/lead/project sequences/context; approved identity/professional/CV/public recipient; reviewed availability/optional prices/currency/edition/framing/condition without stock guesses; real film/computational metadata/captions/transcripts/applicability/demo consent; public-source/privacy approval; human real-colour/scale/sequence/mobile/keyboard/assistive/acquisition review; separately authorized delivery/policy/hosting/release decisions. Planning 20–30 works/3–5 groups is not an invented quota or actual manifest. Current batch stops before M09 until owner supplies/authorizes the real choices.

## Observed M08 local review evidence (2026-10-03)

`npm run verify` passed **66 tests** with zero check diagnostics; actual intentionally empty output: 13 HTML pages, 109 local references, 0 actual artwork images and maximum executed JS **1,157 bytes gzip**. Strict `release:check` correctly exits1/BLOCKED_CONTENT, not passing publication. `npm run review` generated **36 labelled synthetic screenshots**, 12 templates×360/768/1440, **0 observed axe violations/incomplete findings or reflow failures**; report/checklist available at `/tmp/opencode/jordannesbitt-review`, reproducible with the command. Artifacts are temporary/local, concise permanent evidence in records/M08-quality.md.

Three-run synthetic mobile medians on the documented profile: home LCP424ms/16,309bytes; portrait object424ms/16,489bytes; archive396ms/12,447bytes; project376ms/17,650bytes; film452ms/8,666bytes. CLS0 in those runs. Shared flat test images and local server make this capability/budget evidence only; no actual-art transfer, field/INP, full assistive-technology, faithful colour or owner artistic approval. Long-title stress output reflows but can be vertically extensive; real content/typography/sequence remains M09 judgment. Remaining dependency audit findings remain nonpassing in docs/operations.md and require future affected-feature/release review.
