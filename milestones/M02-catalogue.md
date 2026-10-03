# M02 — Validated catalogue and publication

## Objective
Represent one work once and safely derive all public views from reviewed structured data.

## Scope
Version-compatible content schemas for artworks, projects/series, film/computational metadata and professional content; stable IDs/slugs/aliases; typed dimensions, image roles, edition and offer states; ordered project memberships; central public predicate; migration from the empty array without breaking existing routes. Isolate synthetic TEST FIXTURE records from production content.

## Non-goals
Filling missing real metadata, private inventory storage, CMS/database or checkout.

## Domain-state dependencies
READ: docs/catalogue.md, docs/acquisition.md.
MAY MODIFY: docs/catalogue.md to document the selected validated layout.
MUST PRESERVE: docs/operations.md branch/host boundaries.

## Acceptance criteria
- Positive and negative tests for duplicates, invalid values, dangling relationships and missing assets.
- Unpublished/fixture data absent from production pages, embedded JSON, counts, search and sitemap outputs.
- Multiple media and print dimensions/edition cases represented without conflicting records.
- Empty real catalogue builds truthfully; no invented works introduced.

## Gate
Technical schema acceptance only; real metadata approval belongs to M09. Next: M03.
