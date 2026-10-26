# M04 — Artwork and authored presentation closeout

Technical acceptance: 2026-10-03. Contract: milestones/M04-presentation.md. Grant: records/M00-preparation.md. Prior M03 checkpoint **420792b** committed/pushed successfully before initialization.

## Final IDs

All VERIFIED; no superseded IDs or required subjective human checks.

- **M04-R1-D01:** responsive reproduction/artwork/project/Selected Work components, supplied optional facts and explicit optional project date.
- **M04-R1-D02:** stable artwork/project/selection routes, authoritative related/ordered data, alias canonicals/compatibility and sitemap exclusion.
- **M04-R1-D03:** accessible native same-tab full-image path and browser Back, avoiding a lightbox.
- **M04-R1-D04:** disposable normal-publication specimen sites with mandatory synthetic identity/banner/noindex; real source/output isolated.
- **M04-R1-D05:** actual browser viewport/keyboard/touch/order/alias tests and documented behavior.
- **M04-R1-D06:** touch test synchronized with actual navigation instead of an immediate racing assertion; required behavior retained.
- **M04-R1-P01:** stable routes/public predicate/natural ratios/design palette/identity/assets/framework/Git/external/privacy boundaries preserved.
- **M04-R1-P02:** real catalogue/curation remains empty; no fixture leakage or visual approval.
- **M04-R1-V01:** actual Chromium viewport/keyboard/touch/full-image/project/related/alias checks pass.
- **M04-R1-V02:** type/build/schema/ingestion/publication/original routes pass; unsupported fields omitted honestly.
- **M04-R1-V03:** intended diff/canonical/state/ref review passed before checkpoint; transport recorded in next initialization/failure re-entry.

## Decisions and component behavior

Paper/ink/oxide palette and editorial type retained. Reproduction reserves natural dimensions, uses responsive picture sources and honest role/caption, prioritizes lead image and lazy-loads additional views. Enlargement is a normal **same-tab full-image link**, exercised with keyboard/touch and Back; the simpler path satisfies the contract's alternative to a focus-managed Escape lightbox. No forced crop, autoplay/carousel or decorative zoom.

ArtworkView shows only supplied date/process/materials/dimensions/edition facts and contextual project/related links. ProjectView uses authoritative ordered member IDs and pruned public membership, with explicitly supplied dates only. Related work follows authored shared membership, not guessed recommendations. SelectedWork requires explicit featured/order flags and stable authored order, rather than selecting every published work. Existing medium routes remain separate compatible views; fake per-medium placeholders were replaced by honest empty states.

Aliases render a primary-canonical/noindex-follow compatibility page, excluded from sitemap; no host-level redirect claim. JSON-LD script delimiters are escaped and supported visible facts only are supplied (no offers/ratings). Canonical public projection/emission regions remain intact; docs/design.md reconciles behavior. Real content remains `[]`.

Browser fixtures are in test-only factories and independent `/tmp/opencode/jordannesbitt-fixture-*` copies. Normal publication states exercise real templates in that **synthetic site**, which receives synthetic artist identity and mandatory TEST FIXTURE banner/robots before building. There is no production fixture environment switch/import; actual dist is separately verified clean. No preview artifact is deployed/pushed.

## Commands and actual results

Linux checkout, temporary **Node 22.23.3/npm 10.9.9**, Astro **5.18.2**, actual selected model **openai/gpt-6.1-sol/max**; telemetry disabled. Pinned **Playwright 1.63.0**, temporary browser path `/tmp/opencode/jordannesbitt-browsers`.

- `npm view playwright version engines --json`: exit 0, 1.63.0 / Node >=20. `npm install && npm run browser:install`: exit 0; Chromium headless shell **153.0.8010.12**, build 1243 downloaded locally (plus its FFmpeg helper). Actual launch/version/close preflight exits 0 without system-package/global changes.
- Verified temporary runtime `npm run verify`: check/build pass, **0 check errors/warnings/hints**, **11 pages**. Test stage initially exits **1**, **49 pass/2 fail** (touch subtest plus parent), while all desktop viewport/keyboard/order/alias and prior regressions pass. Immediate URL check raced native tap navigation.
- After D06 concurrent `waitForURL`/tap synchronization, same runtime `npm test`: exit **0**, **51 pass**, 0 failed/skipped. Only harness timing changed after the successful production build; no arbitrary sleeps or skipped touch assertion.
- Final review found normal fixture-preview pages lacked the promised noindex courtesy. Added only to copied test layout with an explicit assertion; `PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers node --test tests/presentation.test.mjs`: exit **0**, **7 pass**, no skips/failures. Production code/output unchanged by this final test-site correction.
- Viewports **360×900, 768×900, 1440×900**, DPR 1, headless Chromium 153.0.8010.12, loopback: portrait/landscape/long title/materials/details reflow with no horizontal overflow; images complete, natural ratios preserved; one h1; unsupported edition absent. Curated/project order and related links match authoritative data; hidden sentinel omitted. Visible keyboard focus, Enter to full image and native Back pass. **360×800 mobile/touch** tap and Back pass.
- Alias checks confirm primary canonical/noindex-follow and primary sitemap inclusion with aliases/hidden work excluded. All prior schema, non-destructive intake, actual-dist isolation, isolated full-build publication and original route/asset smoke tests remain passing.
- `git status/diff/diff --check/stat/log` and `git ls-remote` exit 0; reviewed intended new/existing files. Development remote 420792b at review; protected master **755df7fee1a515388a035fce8e9e672070a1d2b4**, backup **3bc95c75bbe85918ce10498af31a751e2cf58fc6** unchanged. State headers and canonical docs reconciled.

## Limits and next

Technical render/interaction tests are not full WCAG/assistive-technology, real-device, faithful-colour, final aesthetic or owner content approval; those required real-art judgments remain M09. Chromium-only fixtures do not prove cross-browser behavior. Empty-collection notices remain expected. No real metadata/curation/availability/pricing inferred, no protected-branch or hosting/deployment change. Residual M01 framework advisories remain nonpassing in docs/operations.md; no affected optimizer/SSR/View Transition feature introduced.

Next authorized milestone: **M05** after verified same-branch checkpoint commit/push; M09 and earlier genuine blockers/human gates remain binding.
