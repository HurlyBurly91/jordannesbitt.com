# Artist website

## Product direction

Build a professional, artwork-led website for Jordan Nesbitt: a curated presentation backed by a structured public archive, with a clear route to acquiring available work. Drawing, painting including watercolour, printmaking, photography, aerial imaging, film and selected computational projects should read as one practice, not unrelated services.

The objective is discoverability, sustained attention to the work, trustworthy information and qualified enquiries. No design or search-engine technique guarantees demand or sales. Do not change the art to imitate market trends.

## Existing foundation

Astro/TypeScript static site; identity in src/config/identity.ts; currently empty catalogue in src/data/artworks.ts. Existing routes include /, /work, /work/[medium], /archive, /about and /artwork/[slug]. Preserve the implemented foundation and deliberate paper/ink/oxide editorial direction while testing it with real art. Do not replace it with a generic theme.

Development branch: redesign/astro-foundation. Production and the pre-redesign backup remain separate. See docs/operations.md for inspected refs, historical local checkout and release constraints.

## Experience

The artwork page is the primary object. Series/projects provide authored context and sequence; Selected Work is the curated exhibition; Archive is the comprehensive published index. Availability is another view of the same records, not a second catalogue. Sold and not-for-sale works can remain important portfolio entries.

Initial navigation proposal: Work, Projects, Archive, About, Available, Contact. Film and Studio/Journal appear when supported by real published material, not as empty promises. Keep the homepage image-led, not dominated by an oversized practice slogan. Identity changes require approval and must not change neutral artwork IDs.

## Content scope

The recovered roadmap's 60-100 documented works and four or more series remain the expanded catalogue target. Proposed staged launch: 20-30 carefully selected works and 3-5 coherent groups, with a representative pilot of about ten works for review. These counts are planning targets, not permission to invent work, force weak material into the selection, or silently weaken acceptance. M00 approval accepts or changes this staging proposal; M09 records the exact approved launch manifest.

Use only media categories actually ready for publication. Do not delay a strong first release solely to populate every category. Full-resolution masters, confidential drafts and business records stay outside public Git.

## Milestone roadmap

| ID | Contract | Outcome |
| --- | --- | --- |
| M00 | milestones/M00-preparation.md | Complete: research, durable setup and explicit kickoff approval; records/M00-preparation.md |
| M01 | milestones/M01-baseline.md | Reproducible build, runtime and regression baseline |
| M02 | milestones/M02-catalogue.md | Validated catalogue and publication boundary |
| M03 | milestones/M03-ingestion.md | Repeatable, non-destructive media ingestion |
| M04 | milestones/M04-presentation.md | Artwork and curated project presentations |
| M05 | milestones/M05-archive.md | Accessible archive, navigation and filters |
| M06 | milestones/M06-moving-image.md | Film and computational project support |
| M07 | milestones/M07-professional-site.md | Homepage, About/CV, availability and enquiry paths |
| M08 | milestones/M08-quality.md | Automated quality gates and local review package |
| M09 | milestones/M09-content-acceptance.md | Actual launch content and explicit visual/business acceptance |
| M10 | milestones/M10-release.md | Approved hosting, controlled launch and rollback |
| M11 | milestones/M11-commerce.md | Deferred transactional commerce, separately authorized |

M01-M08 can run consecutively under a recorded execution grant, using clearly separated test fixtures when necessary. M09 is not automatically accepted by those technical successes. M10 requires a separate release grant. M11 is outside the initial launch scope.

## Architecture boundaries

Remain static-first with Astro, TypeScript and ordinary CSS. Validate the installed major version before adopting current documentation examples. Do not upgrade major frameworks, add a database/CMS, introduce a frontend SPA or purchase hosting as a speculative prerequisite.

Public catalogue data generates pages, search, related works and truthful metadata. Keep publication filtering centralized. Commerce is a later adapter; payment and transactional stock authority must never be simulated by a static page. Keep ingestion reusable for later distribution tools, but do not couple this project to unrelated private repositories.

## Definition of first release

An explicitly approved manifest of genuine works; coherent object and series pages; accurate About/CV and public contact; working acquisition route appropriate to approved availability; mobile and keyboard usability; responsive faithful reproductions; no placeholders or fixtures in the published build; validated links, canonical metadata and sitemap; suitable hosting; tested release and rollback. Search indexing and sales remain observed post-release outcomes, not build acceptance claims.

Canonical requirements and research rationale are indexed in docs/README.md. Current execution exists only in STATUS.md and TASKS.md.
