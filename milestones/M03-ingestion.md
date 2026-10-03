# M03 — Non-destructive publishing intake

## Objective
Turn explicitly selected approved exports into reviewable catalogue records and reusable web derivatives.

## Scope
Document an ingestion CLI with dry-run, explicit input/output, stable IDs, checksums, collision handling, repeatability and schema validation. Preserve masters; generate responsive derivatives and stubs defaulting unpublished; retain reviewed metadata on reruns. Test orientation/profile handling and strip private metadata. Cache derivatives.

## Non-goals
Scanning all disks, rewriting masters, auto-curating or publishing, automatic artistic editing, importing reference photographs as the artist's work.

## Domain-state dependencies
READ: docs/catalogue.md, docs/design.md.
MAY MODIFY: docs/catalogue.md for exact import conventions.
MUST PRESERVE: source files and publication/privacy invariants.

## Acceptance criteria
- Dry-run creates no output; checksums prove originals unchanged.
- Tests cover repeat import, collisions, invalid input, different orientations, missing metadata and interrupted/failed processing.
- Derivative dimensions/formats validate and only explicitly approved paths are read.
- One documented import-to-local-preview exercise succeeds with isolated test assets.

## Gate
Technical pipeline acceptance only; human colour fidelity and actual public intake are M09. Next: M04.
