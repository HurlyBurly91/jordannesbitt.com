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
