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

The archive is comprehensive public data, distinct from explicitly curated Selected Work. `src/lib/search.ts` reuses the canonical publication projection even for a raw snapshot; server-rendered index entries, embedded JSON and `/search-index.json` contain public records/relationships only. Text matching includes title/date/process/materials/context and authored project titles, case/diacritic normalized with all query words matched. Medium/project/year/availability facets derive only from supported public values. Chronological sorts keep unknown dates last; title sorting is explicit. No remaining-stock estimate or AI recommendation.

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

## M09-R1 private real-image pilot commands

Use the documented Node22/npm10 runtime. `npm run pilot -- snapshot --source <explicit-owner-authorized-directory>` captures only supported image inputs into the persistent per-user data root `~/.local/share/jordannesbitt-art/m09` by default; non-images/database contents are never opened. An alternate persistent location requires an absolute `JORDANNESBITT_M09_DATA` override. `/tmp/opencode` remains supported only for disposable automated-test/cache scratch and historical explicitly addressed artifacts; it is never the default authoritative M09 state. The resulting exact snapshot and private ID registry must be preserved; added exports need a new snapshot, never a silent change to an old review.

After actual image inspection creates a private `visual-review-plan.json` bound to that snapshot checksum, run `npm run pilot -- review --snapshot <exact-local-snapshot.json> [--plan <private-plan.json>]`. All original/derived images, source-linked dates/classifications, neutral IDs, group candidates and review screenshots/reports/owner summary stay outside public Git. Shared component/code/documentation improvements may be checkpointed, never the pilot's image-specific data or assets without later explicit public-source approval. A review run records its exact snapshot/plan checksums, files/dates, representative layout choices, environment/checks and source preservation.

`npm run pilot -- serve --directory <local-review/site>` binds an ephemeral port on127.0.0.1 only; do not deploy/upload or expose publicly. The independent root is labelled REAL-IMAGE LOCAL PILOT, noindex, with no artist/rights/offer/publication/launch assertion. Real-source pixel/profile/codec and actual-template checks supplement, never replace, owner classification/colour/sequence/metadata approval. Dates follow the explicit owner source-mtime test instruction, physical dimensions are not a pilot blocker, and a numerical derivative/source comparison cannot establish physical-artwork colour fidelity.

Actual production content remains empty/unapproved and `npm run release:check` must stay BLOCKED_CONTENT. No gate relaxation, launch manifest, inferred CV/contact/prices/editions/rights or final published selection is authorized by this local pilot. M09 remains ACTIVE until its required owner/content checks pass; feedback creates a new request group. Source files and all private/nonimage information remain protected.

## M09-R2 normal-scale presentation evidence

`npm run pilot -- review --snapshot <same-frozen-snapshot.json> --baseline <prior-local-review>` compares exact snapshot/plan/private-fact checksums with the retained before package. It never changes provisional classifications/dates/group membership/order/pilot/lead or refreshes source inventory. Geometry and capture routes are presentation evidence only, not curation. Shape coverage uses actual portrait/landscape/square export dimensions, not inferred physical shape.

Fresh Chromium contexts and locally available Firefox run at1440/768/360×900CSSpx,DPR1,100% zoom; every page records viewport/visualViewport/CSS-zoom and decoded image/frame bounds. Checks require3/2/1browse columns, complete natural ratios, viewport-contained primary views and no empty home/narrow-object image planes. Each route has viewport/fullpage PNGs; portrait/landscape/square inspection has fit/larger PNGs, Tab/reverseTab/Escape/Close/focus/scroll/tap checks and opened-modal axe. Archive facets/reset and no-JS representative/object/direct-image fallback remain checked. Missing Firefox is reported INCONCLUSIVE, never a browser pass; no host package/configuration changes by the review tool.

Firefox's32767px screenshot ceiling exposed a real long-index capture failure. `captureFullPage` joins16000px document-coordinate PNG clips losslessly for pages over32000px, with no CSS viewport/zoom change, resizing, hidden content or source edits. Method/dimensions/tile counts are recorded; regression checks a40000px synthetic image's endpoints and tile-boundary pixels with unchanged360×900/DPR1/scale1. Normal900px viewport captures remain separate for scale judgment. Capture-only eager decoding is still distinct from the mobile lab.

Observed final2026-10-05 run:71/71full verification tests,0Astrodiagnostics;169-image unchanged snapshot/10representatives;138page/browser/viewport checks and18opened inspections producing312PNG captures,0observed axe/reflow/unapproved artist/rights/offer assertions,169/169sourcebytes+mtimeunchanged and exact private facts/plan comparison. Chromium153.0.8010.12/Firefox155.0headless; three-run real mobile medianLCP460–920ms,CLS0,initialtransfer17835–90916bytes on the existing documented profile. Local/private evidence paths and failures are in TASKS.md and the M09-R2 intermediate checkpoint record. Not field/physical-device/full-WCAG/colour/owner aesthetic acceptance; public arrays stayempty/release BLOCKED_CONTENT and all older human gates persist.


## Persistent M09 private storage (M09-R4)

The authoritative local-only M09 pilot state now defaults to `~/.local/share/jordannesbitt-art/m09`, outside the public repository and outside `/tmp`. This includes `id-registry.json`, frozen snapshot copies/manifests, contact sheets, derivatives, private visual-review plans/classifications, reviews, screenshots, reports and generated review sites. Ordinary `/tmp` cleanup or reboot must not remove these artifacts.

Set `JORDANNESBITT_M09_DATA=/absolute/persistent/path` before running pilot commands to use another approved persistent root. Relative paths, roots under `/tmp`, and roots inside the repository are rejected for the configured persistent root. Explicit `/tmp/opencode` paths remain accepted only for disposable automated tests/caches and legacy explicitly addressed artifacts; they are never selected by default for authoritative M09 state.

Historical M09-R1/R2 evidence paths under `/tmp/opencode` remain truthful historical records; they are not rewritten to imply those erased artifacts still exist. New snapshots/reviews use the persistent root.

M09-R5 regeneration keeps even the real-pilot isolated build under `<persistent-snapshot>/builds/`, including source-linked temporary catalogue JSON, media copies, build output and per-root Astro/Vite caches. Completed review site/report/screenshots persist under the private `reviews/` root; only the run's own isolated build workspace is cleaned after copying. Synthetic adapter/test projects keep their explicitly temporary directories. Existing M09-R2 components/CSS/client presentation and production data/release guards are preserved during regeneration. A recreated visual plan is bound to its new exact snapshot and fresh image inspection; lost before packages are not fabricated or claimed comparable across different snapshot hashes.

## Local authoring verification and discovery stretch (M09-R6)

Local Studio is outside deployed routes and production content. Canonical schemas/intake/public projection remain authoritative; private upload/metadata/media identity/order/curation/preview/review/approval/dry-run/export behavior is tested independently, with successful exports only into isolated synthetic Git repositories. Actual owner corpus demonstrations retain private draft status, disabled repository writes and no rights/launch approval. Current components are exercised through isolated persistent draft builds; body disclosure/noindex is not a confidentiality substitute for loopback/request/path controls.

The inexpensive real-data baseline (stable object URLs/aliases, unique titles/descriptions, normal links/alt/canonical/OG/sitemap, responsive images/performance and semantic facts) remains in ordinary full output/browser tests. No large SEO subsystem or filler belongs in this follow-up. Later separately authorized stretch: richer faithful VisualArtwork/ImageObject details, reviewed licensing metadata, image sitemap enhancements, Search Console ownership/submission, genuine Studio/Journal content and earned external exhibition/publication links. These are future work, never current ranking/indexing claims.
