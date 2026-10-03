# M06 — Moving-image/computational closeout

Technical acceptance: 2026-10-03. Contract milestones/M06-moving-image.md; grant records/M00-preparation.md. Prior M05 checkpoint **2c3b3a5** committed/pushed before initialization.

## Final IDs and decisions

All VERIFIED; none superseded; no required M06 human gate.

- **M06-R1-D01:** explicit optional poster/upload facts, validated MIME/provider IDs, native playback at the stable artwork/watch URL and factual optional runtime/credits/transcript.
- **M06-R1-D02:** inert whitelisted YouTube/Vimeo template, deliberate consent/action and static provider fallback; no initial connection.
- **M06-R1-D03:** static computational summary/stills/video/tools and deliberate external demo, with authored shared relationships and no private repository access.
- **M06-R1-D04:** public playable/poster-backed Film collection/menu/index only; public truthful VideoObject on the same object canonical; unknown dates omitted; documented adapters/M09 intake.
- **M06-R1-D05:** synthetic clip/caption/error and actual keyboard/provider/demo/fallback tests; full regressions verified.
- **M06-R1-P01:** ownership/privacy/publication/canonical/ratio/relationship boundaries and fixture/no-real-provider isolation preserved.
- **M06-R1-P02:** actual arrays/identity/assets/framework/protected refs/deployment/host unchanged; no actual metadata/accessibility/software choices inferred.
- **M06-R1-V01:** local play/pause/keyboard/VTT/error/source fallback, mocked consent/player/demo response and static no-JS computational context pass.
- **M06-R1-V02:** actual absent Film promises, honest/public metadata/canonical, fixture/cache isolation and all prior checks pass.
- **M06-R1-V03:** intended diff/domain/state/ref review passed before checkpoint; transport recorded on next initialization/failure re-entry.

Native video has controls, preload none and a user Play/pause button; Space toggles and failure/source/transcript fallbacks remain. External iframe is inert until requested, with disclosed provider connection and static link; demo is a deliberate new-tab external link, never auto-executed. Watch presentation and metadata use `/artwork/<slug>/`, not a competing canonical. Real content remains empty. docs/catalogue.md reconciles adapter semantics and explicitly required M09 media/accessibility intake.

## Actual verification

Linux, temporary Node **22.23.3/npm 10.9.9**, Astro **5.18.2**, Playwright **1.63.0**, Chromium **153.0.8010.12**, selected model **openai/gpt-6.1-sol/max**, telemetry disabled. Existing FFmpeg **6.1.1** with libvpx inspected; only CPU-generated selected synthetic assets used.

- `ffmpeg -version`: exit 0. Synthetic generation uses explicit temporary output, two-second 320×180 VP9 blue clip, no audio/master input or upload.
- Verified runtime `npm run verify`: exit **0**, **57 tests pass**, no failures/skips, Astro check **0 errors/warnings/hints**, 11 empty-content pages plus JSON. Expected empty-collection notices remain; all schema/intake/publication/cache/archive/scaling/presentation/original routes pass. Additional scaling observation 4,048 ms build/56 ms interaction is synthetic diagnostic continuity, not a new real-art/field claim.
- Final `PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers node --test tests/moving-image.test.mjs`: exit **0**, **3 pass**, after strengthening parsed-VTT/intercepted-response/explicit-demo and negative MIME/provider assertions. No implementation changed after the full run.
- Browser **768×900**: zero clip transfer before action; keyboard Enter starts local playable media, VTT cues parse, Space pauses, native controls present. Aborted local source exposes real error/source fallback. No iframe/provider request before action; requested iframe receives only intercepted local stub, and explicit demo popup receives a second intercepted stub. No real vendor/demo HTTP contact. Static computational context works in a no-JS context.
- Metadata tests confirm the same artwork URL, truthful PT2S, no inferred upload date, no unpublished/missing-poster VideoObject, and invalid MIME/provider rejection. Actual dist has no `/film` index/menu/VideoObject fixture; conditional index contains only supplied playable public films in independent synthetic site.
- `git status/diff/diff --check/stat/log` and `git ls-remote`: exit 0; intended changes/new files reviewed. Development remote 2c3b3a5 at review; master **755df7fee1a515388a035fce8e9e672070a1d2b4**, backup **3bc95c75bbe85918ce10498af31a751e2cf58fc6** unchanged. Canonical references and synchronized headers preserved/reconciled.

## Limitations and next

Synthetic captions/playback do not approve real rights/poster/credits/runtime/date/caption/transcript quality, real provider accessibility or human viewing/colour judgments. `not-supplied` versus genuinely `not-applicable` remains explicit; real assets/review are M09. No original film/private software/public upload or real service testing. Residual framework advisories remain nonpassing in docs/operations.md; no optimizer/SSR/transition feature introduced. No release/indexing/rich-result claim.

Next authorized: **M07** after verified same-branch checkpoint commit/push. M09 and earlier genuine blocker/human gates remain binding.
