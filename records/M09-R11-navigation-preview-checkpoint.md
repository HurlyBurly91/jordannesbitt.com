# M09-R11 — Navigation and preview feedback checkpoint

Intermediate technical evidence, not M09 closeout or owner acceptance. R10-H01 remains **FAILED overall / NOT ACCEPTED**; its owner-passed Year validation/focus/correction and optional private facts remain preserved. R8-H01 remains its historical failed/unaccepted gate. Older colour, factual, rights, content, business, curation and launch checks remain unresolved.

## Delivered behavior

R11-01–07, P01/P02 and D01/D02 are technically verified. Studio grid/draft/tab navigation uses pushState/popstate with neutral identifiers only. Back returns to grid, Forward restores draft, duplicate same-view navigation adds no entries, known neutral deep fragments open drafts and unknown startup fragments resolve to grid. Save/internal rerender does not add history entries. Document-only caches preserve dirty form/photo edits among drafts/tabs; clean views reload canonical records. Actual document exit warns for current or cached dirty drafts; dismissed exit retains edits. Saving/restart remains the authoritative persistence mechanism.

Preview validates current edits before opening any popup. One synchronous popup immediately contains “Preparing artwork preview…” and private status text, then the same window loads the actual artwork route following a successful private build. Invalid forms open no popup. Injected build failure yields sanitized guidance in Studio and popup without paths/stacks. These interactions preserve R10 current-edits private save/preview, R8 explicit colour intake and all source/rights/export boundaries.

Initial targeted testing exposed a clean cached editor hiding newly attached backend media. Restoring only dirty caches and reloading clean records fixed the regression; targeted14/14 and final full86/86 pass. Exit-warning coverage initially hit driver navigation-wait/auto-owned-context-close behavior; concurrent dialog handling with location.reload verifies the actual warning/dismissal/retention. These were failed intermediate attempts, not passing evidence. No experience retrieval was needed; established domain rules and current regression evidence determined the correction.

## Verification

Linux, Node22.23.3/npm10.9.9, Astro5.18.2, sharp0.35.5, Playwright1.63.0, Chromium153.0.8010.12 and axe4.13.0, loopback-only.

```bash
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
JORDANNESBITT_M09_DATA=/home/jordan/.local/share/jordannesbitt-art/m09 npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run studio:navigation-demo'
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run release:check'
```

Final full verification exits0: **state:check PASS, 86/86 tests, zero failures/skips/Astro diagnostics**. Prior84 tests retained plus two substantive navigation/popup cases. Public output remains13pages/0artworkimages/maxJS2049bytesgzip. Preservation diff against2f06979 for src, scripts/lib, Studio server CLI, AGENTS/RUN_PROMPT/PROJECT, experiences and durable-state checker exits0. Strict release checker exits1, **BLOCKED_CONTENT**, same8 missing-owner-content issues. Existing dependency audit and older manual-contrast findings are not newly passing.

## Persistent desktop demonstration

`/home/jordan/.local/share/jordannesbitt-art/m09/studio/demonstrations/navigation-demo-2026-10-07T16-36-47-450Z-4abbee5a`

16steps/32 viewport/full PNGs, 1440×900 CSSpx/DPR1/normal zoom. A: grid→open draft→browser Back/grid→Forward/draft. B: preparing popup remains visible while browser request is deliberately paused for capture, then the actual backend build succeeds and that same popup reaches the artwork page. C: Exact/blank Year Save and Preview show accepted local/global errors and Year focus; explicit Unknown correction permits private Save/Preview. Real server restart/reopen verifies saved fields and image-scoped sRGB pipeline manifest.

Zero observed axe violations/incomplete findings/reflow failures in this sequence. Back/Forward, preparing, actual artwork and Year-error screenshots inspected. Failure sanitization is synthetic intercepted-error evidence, not a real corpus build failure. No Firefox-specific R11, physical-colour, full-WCAG or human-usability acceptance claim.

Exact approved snapshot SHA25660d841eaabd3a7e1ced4560c047c863fcba111f8b89ccc4f7f0d664cd66b8a2c; one explicitly selected image used in isolated persistent workspace/registry copy. Authoritative owner state and registry bytes unchanged;169/169 source bytes/mtime preserved. Temporary title/medium/alt labels are demonstration scaffolding, not approved owner facts. All real drafts/media/screenshots/reports/previews remain outside public Git. No actual public-source approval/export, launch manifest, deployment or external services.

## Handoff boundary

Guide/domain docs and M00 bounded grant reconciled. Reviewed code/tests/docs checkpoint on redesign/astro-foundation is followed by ACTIVE / HUMAN_VERIFICATION / M09-R11 with H01 awaiting owner. No final closeout or M09 COMPLETE. Owner startup: documented Node22 `npm run studio`; isolated demo startup adds `JORDANNESBITT_M09_DATA=<artifact>/workspace`.

Owner repeats A–C, makes an unsaved edit before Back/Forward and switching drafts, and confirms useful loading/failure feedback. R10/R8 failed overall results and all older gates persist until explicit applicable acceptance.

## Verified checkpoint transport

Intended diff, recent log, domain/state/ID evidence, protected refs and staged10 code/tests/docs-only paths reviewed; cached diff check exits0. Commit/push exits0 for **5825d67e12bb4cafcf321c429c5a5ab1a5d23974**, `Restore Studio history and show preview preparation`. Clean checkout and matching development remote verified; master755df7f/backup3bc95c7 unchanged. No private media, draft records, screenshots, actual public content or source/rights/manifest approval committed. R11-08/V02 now VERIFIED; H01 AWAITING_HUMAN. Final pointers ACTIVE / HUMAN_VERIFICATION / M09-R11, never COMPLETE.
