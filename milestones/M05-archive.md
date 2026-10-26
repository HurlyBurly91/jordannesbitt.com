# M05 — Archive and navigation

## Objective
Let visitors browse the published body of work without confusing it with the curated selection.

## Scope
Archive filtering by medium, series, year and availability where data supports them; meaningful text search, sorting, reset and shareable/restorable filter state; accurate result counts and empty states; coherent medium pages/navigation. Preserve basic browsing without JavaScript. Hide empty public categories.

## Non-goals
Database search service, AI recommendation engine or fake inventory counts.

## Domain-state dependencies
READ: docs/catalogue.md, docs/design.md, docs/quality.md.
MAY MODIFY: docs/quality.md to document measured archive limits.
MUST PRESERVE: publication boundary and artwork URLs.

## Acceptance criteria
- Tests cover combined filters, reset, browser back/forward, keyboard use and no results.
- No unpublished records appear in any result/count/index.
- Selected Work is editorially distinct from Archive.
- A separate synthetic scaling exercise records dataset size, build/runtime behavior and environment without representing it as real art.

## Gate
Technical acceptance. Next: M06.
