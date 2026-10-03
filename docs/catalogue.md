# Catalogue and media invariants

## One public catalogue

Use validated structured content, preferably version-compatible Astro content collections. M02 must decide the exact file layout after reading the installed Astro version; do not copy incompatible current examples. Replace the current empty array incrementally, preserving routes and identity.

An artwork has a neutral immutable ID, stable slug/aliases, honest title/date or explicit uncertainty, medium, optional techniques/materials, typed physical dimensions, ordered reproductions with role/alt/pixel dimensions, publication state and editorial flags. Physical image, sheet and framed sizes are distinct. Film and computational records carry the metadata relevant to them rather than invented painting dimensions.

Keep existing medium URLs for drawing, painting, printmaking, photography, aerial and film. Model oil/watercolour/woodcut as useful techniques. Aerial may also become a photography viewpoint facet, but do not break its existing route or duplicate the underlying work. Computational projects are explicit supported records, not a mandate to expose all software repositories.

Series/projects own an ordered list of member IDs; derive reverse relationships rather than manually maintaining conflicting copies. Permit cross-medium membership. Selected Work and Available are views of the same public records. Stable artwork detail URLs remain /artwork/[slug]; project and watch pages must not create conflicting canonicals for one object.

Reject duplicate IDs/slugs, invalid enums, impossible dimensions, broken asset/relationship references and inconsistent edition/offer data. Unknown values are absent or explicit unknown, not zero, guessed dates or invented prose. Do not require an essay to publish a well-documented work.

## Publication boundary

Centralize the public-content predicate. Apply it to routes, static HTML, embedded JSON, search indexes, related works, counts, feeds, sitemaps, social metadata and structured data. Assets for unapproved records must not be emitted merely because a static directory is copied wholesale. Keep test fixtures outside production content and fail release checks if they leak.

This repository is PUBLIC: an unpublished record in Git is still publicly readable. Confidential intake data, private drafts, releases, masters, collector addresses, orders and credentials must remain outside it. Only commit material explicitly approved for public source access. Robots/noindex are not access controls.

## Ingestion

Accept explicitly selected input paths, never scan the owner's home or reference library. Read masters without modification. Provide dry-run, explicit destination, collision handling, repeatability and manifest/checksum evidence. Reruns must not silently create duplicate works or overwrite reviewed metadata. New records default to unpublished and require review before publication.

Generate restrained, high-quality responsive web derivatives with JPEG fallback and WebP/AVIF where supported. Preserve aspect ratio and orientation; handle colour profiles deliberately and test conversion before assuming colour fidelity. Remove private GPS/device metadata while retaining approved creator/rights metadata. Do not upscale, stylize, retouch, crop away artwork edges or invent details automatically.

Reuse cached derivatives; avoid encoding the full preservation archive on every site build. Keep storage URLs behind a small media abstraction so a later approved object store does not change artwork identity. Image masters and large film originals never enter this repository.

## Minimum review intake

Owner supplies a representative approved pilot, public identity/contact, factual biography/CV, selected titles/dates/medium/dimensions, reproduction rights, intended series/order, availability and any approved prices/edition facts. Film material additionally needs poster, runtime, credits and accessibility assets where applicable. Missing inputs are a precise checklist, not permission to fabricate. See design.md and acquisition.md.

## Selected validated layout (M02)

Astro 5.18.2 collections are defined in `src/content.config.ts`. Approved public-source arrays live in `src/content/artworks.json`, `projects.json` and `professional.json`; all remain empty until real owner-approved input. `src/lib/catalogue.ts` supplies strict version-compatible Zod schemas and snapshot validation. Custom collection loaders validate the entire snapshot before storing any entries, rather than allowing the built-in file loader to overwrite duplicate IDs or only log invalid input. Invalid/missing JSON, metadata, relationships or assets fail the build.

Artwork IDs are explicit neutral keys, never derived from titles, identity or series. Slugs and aliases must be unique within their route family; projects own an ordered member-ID list, with reverse relationships derived. Dates record exact/circa/unknown rather than a guessed zero. Dimensions distinguish image/sheet/framed/object, using positive typed measurements. Original prints/reproductions can carry edition facts; no remaining-stock field exists. Availability other than unknown and all prices require explicit reviewed state, and priced offers need positive minor currency units plus an ISO-style currency code. Film and computational fields are validated as their own object kinds. Professional biography/CV/contact is optional, public-source and subject to the same publication boundary.

The marked **public catalogue projection** in `src/lib/catalogue.ts` is the sole publication predicate: published true and fixture false. It removes unpublished/fixture records, prunes project memberships to visible work IDs and omits empty public groups. `src/data/catalogue.ts` exposes only that projection to pages; `src/data/artworks.ts` is a compatibility export, not a second catalogue. Counts, related work, later search and metadata must consume this projected data.

Derivative URLs are local `/media/...` references. Only already-approved-for-public-source derivatives belong in `src/media/`, outside Astro's wholesale `public/` copy root; even unpublished files there are visible in public Git. Masters/confidential intake never belong there. Missing, escaping or symlinked derivative sources are rejected. `public/media` is forbidden. The marked **publication-gated derivative emission** in `src/lib/catalogue-source.ts` copies only assets referenced by the public projection after a static build. Unpublished/orphan sources cannot be copied merely because they exist. Keep this mapping behind the media abstraction if an approved storage adapter is added later.

Synthetic fixtures live only under `tests/fixtures/` and temporary `/tmp/opencode/jordannesbitt-fixture-*` test projects. Production input paths have no fixture environment switch. Production validation rejects fixture flags and TEST FIXTURE markers, including unpublished fixture inputs. Tests can explicitly validate fixtures for schema cases, but the public predicate still excludes them. Full-build boundary tests run in separate temporary roots; their output never substitutes for repository `dist/`.
