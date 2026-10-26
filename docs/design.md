# Presentation and curation

## Art before interface

Retain the established paper/ink/oxide direction, serif headings and restrained sans-serif information text. The existing palette is #f0ede5, #171714 and #8d2b1f. Verify contrast rather than assuming palette tokens are accessible at all sizes.

Start with artwork/object presentation, not a marketing homepage. Show the complete reproduction at its natural ratio, sufficient detail to inspect marks/material and accurately labelled additional views. A framed or room view must be real or explicitly identified as a visualization; never imply a fictitious exhibition or collection.

No forced square crops, decorative hover zoom, cursor gimmicks, scroll hijacking, automatic carousels, parallax, intrusive newsletter popups or SaaS-style rounded cards. User-operated enlargement, when useful, must work with keyboard, touch, Escape and focus restoration. A plain full-image link is preferable to a broken lightbox.

## Three distinct views

Selected Work is a short, authored sequence. Projects/series connect work by actual subject, process or investigation across media. The Archive is an efficient catalogue with thumbnails and filters. Do not make all three the same grid or let sale availability dictate the whole portfolio.

Project pages use an approved title, date range where known, concise context, intentional sequence, relevant drawings/prints/photographs/films and actual exhibition/publication references. Omit unsupported sections. Related work starts with authored relationships; avoid an opaque recommendation system.

Homepage: a dominant genuine work, concise identity, a small selection of coherent projects, a limited cross-medium selection and clear paths to Work, Archive and acquisition/contact. Remove construction copy and placeholder rhetoric from release output. Do not prioritize a giant abstract slogan over the art.

## Professional context

About explains the practice using approved facts. CV is separately scannable and printable, with verified dates/roles and no invented awards, collections or exhibitions. Studio/Journal documents genuine process and completed events, not generic SEO articles or automatic claims of activity. Empty categories and unsupported features remain hidden from public navigation.

## Content review

The earlier plan targeted 60-100 works. The new proposal is a smaller 20-30-work first release followed by that expanded archive. Owner approval of the plan and exact manifest is mandatory; numbers are not quotas for padding weak selections. Review approximately ten representative works first, including different orientations, materials and media when available.

M01-M08 may use explicitly labelled synthetic TEST FIXTURE records/assets exclusively in tests or local fixture previews. Such fixtures are not Jordan's artworks and never count toward release content. M09 must use real approved work to judge image fidelity, relative scale, sequencing, captions, tone, mobile reading and acquisition clarity. Technical test success cannot replace this review.

## Implemented presentation behavior (M04)

`Reproduction.astro` renders a dimension-reserved natural-ratio picture with responsive sources, JPEG/PNG fallback and visible role/caption. M04's initially tested same-tab enlargement was **rejected by owner visual review and replaced under M09-R2** by deliberate accessible inspection; the direct derivative link remains fallback only. Lead reproduction is eager/high priority; subsequent views are lazy. No crop, hover enlargement or automatic cycling. `ArtworkView.astro` shows supplied dates/process/materials/distinct sizes/edition facts only; absent facts have no invented substitute.

`ProjectView.astro` follows authoritative ordered member IDs through the public projection. Optional project dates are explicitly supplied, never inferred from member years. Related work derives from shared project memberships in their source order, without opaque recommendations. `SelectedWork.astro` includes only explicit featured/selected-order records and follows supplied order (stable source order when no order is provided); publication alone is not curation. Existing medium pages remain compatible separate views.

Artwork/project aliases render static compatibility pages with a primary canonical and noindex/follow, and are omitted from the sitemap. These are not claims of host-level HTTP redirects; host redirect behavior remains a release review. Structured JSON escapes script delimiters and contains only visible supported facts, with no fake offers/ratings.

Technical previews use disposable `/tmp/opencode` project copies, mandatory synthetic identity and TEST FIXTURE banner, and test-only specimen data/images. They exercise real production templates with normal publication states in that independent test site, without any environment override or fixture imports in the real site. Actual source arrays remain empty and actual dist is checked for fixture leakage. Browser tests supplement, rather than replace, M09's human presentation/colour/content review.

## Local real-image pilot review (M09-R1)

The separately authorized pilot may exercise actual frozen source copies through these production components in an independent, filesystem-private/loopback/noindex local root. Its neutral item/group labels are UI review labels, not invented artwork titles or series names. Date labels disclose the owner-instructed provisional source-mtime proxy; inferred media/techniques disclose uncertainty, and unknown object kind/medium and absent physical dimensions remain explicit. Artist/rights/offer/publication structured assertions are omitted from that local view, whose homepage/Selected Work flags and small group-layout samples are not permanent curation. Detailed candidate relationships/classifications remain private and require owner decisions.

Contact sheets/HTML/screenshots preserve the entire source reproduction without edge crop, retouch, perspective or lighting correction. Capture tooling decodes all images before full-page screenshots so below-fold lazy assets are visible; this capture-only action does not change production browsing or separate initial-transfer lab measurements. Group layout samples remain separate from the complete provisional member lists; large visual buckets are not asserted as authored series or repeated as endless related-work lists. Human review of actual reproduction/colour/group/order remains a genuine M09 gate.

## M09-R2 gallery scale and deliberate inspection contract

Owner rejects oversized browsing/object imagery and compensatory browser zoom-out. Primary reference: Zwirner Sillman artist/survey and Yuskavage object presentation; secondary: Kentridge project context/sequence, observed read-only2026-10-05. Adapt contained image planes, modest subordinate metadata, purposeful whitespace and overview/object separation; do not copy their code/type/branding/assets/prose, literal survey columns, newsletter or gallery-only navigation.

Normal presentation has distinct modes: browse/medium/archive visual indexes around3/2/1columns at1440/intermediate/narrow, bounded complete natural-ratio images; Selected Work uses ordered paired/varied editorial scale and viewport-bounded portraits; projects preserve member order while alternating explicit larger/paired display slots; objects initially isolate a complete primary reproduction around70–75vh accounting for context, compact separate facts and additional views; home has one dominant bounded supplied lead plus concise identity/context and neighboring paths. Exceptional display scale is explicit through component layout slots, never automatic destructive crop or inferred catalogue edits.

Inspection is explicit keyboard/click/tap enhancement of a direct-image fallback: restrained native modal, complete-image fit, optional larger-than-viewport/pixel inspection with native scroll, Escape/close and launch-control focus restoration. No spectacle/automatic playback/cursor zoom/forced crop, no CSS/browser zoom compensation. Native browser zoom remains usable. All actual-image captures must be at100% (scale1),1440/768/360, with opened inspection states and genuine bounds/density evidence; screenshot pass is not owner aesthetic acceptance. Preserve frozen source/private plan/metadata/publication/rights/selection facts and original identity throughout this presentation-only request.

Implemented shared `CatalogueImage.astro` keeps responsive sources/lead priority/natural ratio while display planes own size. Browse caps at min(34svh,360px), narrow index at min(40svh,320px); editorial slots have explicit feature/companion/pair scale, independent of catalogue selection/member order. Desktop primary plane caps at min(72svh,viewport-minus190px,760px); narrow primary uses intrinsic height with min(56svh,viewport-minus230px,560px) cap. Home also uses intrinsic height with min(54svh,520px) cap so landscape exports do not create empty mobile planes. Additional views follow below. Image width never automatically fills a column; no cover/crop.

Archive is now a3/2/1visual index with responsive images; native Search and filters disclosure is closed initially and opens for active URL filters, preserving Apply/Reset/history/count/no-JS browsing. `SelectedWork` and `ProjectView` use distinct ordered editorial lists, never CSS reordering. `ImageInspection.astro`/`src/client/inspection.ts` progressively enhance genuine image links with native modality, explicit Tab/reverseTab boundary wrapping, fit/pixel native scroll and synchronous idempotent Escape/Close scroll/focus restoration. Private pilot disclosure and unknown facts remain visibly separate from owner-approved public metadata. These are technical implementation facts, not owner aesthetic approval.

## Provisionally accepted baseline and maintenance (M09-R6)

Owner provisionally accepts M09-R2 direction, not final M09 public-content/reproduction acceptance. Retain layout/caps/rhythm/palette/type/inspection. Small captions/index metadata are modestly raised toward14px; titles remain subordinate. An empty actual archive omits catalogue counts/filter controls, unsupported acquisition facts/recipient placeholders are omitted, and Work navigation exists for supported public artwork even before Selected Work is populated. Supplied approved project context uses normal concise canonical fields, not the private pilot's provisional explanations. Construction release blockers remain honest while required content is absent, and disappear when their actual required facts exist; draft banners stay exclusively in private previews.

Local Studio is a separate loopback authoring utility, never public site styling/routes. It edits the same canonical artwork/project records and uses current components for private previews; see docs/studio.md. Public Work/Projects/Archive/About/Available/Contact remain content-backed; Film/Journal appear only when genuinely supported. Availability never creates a duplicate sales catalogue or erases sold artwork identity.
