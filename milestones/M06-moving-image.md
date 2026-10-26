# M06 — Film and computational projects

## Objective
Present non-static work with the same professional context as drawings and prints.

## Scope
Film watch pages with playable media, stable poster, honest duration/date/credits and accessible controls; captions/transcripts where applicable; click-to-load external embeds; project relationships to source drawings/photographs. Computational work uses contextual stills/video and an optional deliberately launched demo with a static fallback, not automatic access to private repositories.

## Non-goals
Streaming infrastructure, uploading original footage, autoplay, exposing unrelated software or inventing credits/transcripts.

## Domain-state dependencies
READ: docs/catalogue.md, docs/design.md, docs/quality.md.
MAY MODIFY: docs/catalogue.md for tested media adapters.
MUST PRESERVE: privacy, media ownership and publication boundaries.

## Acceptance criteria
- Test play/keyboard/error/fallback behavior without contacting real third parties in ordinary tests.
- Metadata/canonical rules match actual watch content; missing facts are not fabricated.
- Unpublished or absent film collections generate no misleading public menu/page promises.
- Fixture interactions pass; actual accessibility assets remain an explicit M09 intake requirement.

## Gate
Technical capability acceptance. Next: M07.
