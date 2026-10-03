# M04 — Artwork and authored projects

## Objective
Make the object and its relationships the centre of the visual system.

## Scope
Responsive artwork detail pages with full aspect-ratio reproduction, labelled details, meaningful dimensions/materials and related work; user-operated enlargement only when accessible; authored ordered series/project pages; curated Selected Work view using shared catalogue data. Refine existing typography/spacing instead of replacing the design with a generic theme.

## Non-goals
Invented artistic statements, forced crops, autoplay, purchase activation or final aesthetic approval.

## Domain-state dependencies
READ: docs/design.md, docs/catalogue.md, docs/quality.md.
MAY MODIFY: docs/design.md for implemented component behavior.
MUST PRESERVE: stable URLs, public predicate and natural image proportions.

## Acceptance criteria
- Browser checks at 360/768/1440px cover portrait/landscape, long metadata and keyboard/touch navigation.
- Enlargement restores focus and closes with Escape, or a simpler accessible full-image path is used.
- Project order and related links match authoritative membership data; missing fields are omitted honestly.
- Local fixture previews are clearly labelled and absent from release output.

## Gate
Technical render/interaction acceptance only; owner presentation approval is explicitly M09. Next: M05.
