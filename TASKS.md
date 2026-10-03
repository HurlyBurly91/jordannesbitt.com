# Tasks

```yaml
Milestone: M04
State: COMPLETE
Active-Request: M04-R1
Specification: milestones/M04-presentation.md
```

## Authorization and carried state

Source: USER, 2026-10-03; full grant records/M00-preparation.md. Autonomous M01–M08 on redesign/astro-foundation using selected Sol 6.1 Max, with verified checkpoint commits/pushes; stop before M09 or earlier genuine blocker/required human gate. No protected-branch writes, deployment/publication, DNS/hosting, real messages, purchases/payments or other external effects beyond authorized checkpoints, nor host-wide changes. Planning counts only; owner chooses all real work/series/order/publication/availability/prices at M09. Fixtures isolated and clearly synthetic, never production output or the owner's actual artwork. No real/private intake authorized.

M03 checkpoint **420792b** committed/pushed successfully. Initialization clean worktree/origin/remote/protected heads checked; protected refs remain 755df7f/3bc95c7. Temporary Node 22.23.3/npm 10.9.9, actual openai/gpt-6.1-sol/max. M03 full regression 44 pass; remaining nonpassing framework advisory surfaces in docs/operations.md. Presentation uses fixed attribute names and escaped structured JSON, no vulnerable optimizer/SSR/View Transitions. Browser prerequisite inspected: playwright **1.63.0**, Node >=20; pinned development dependency and browser download will be isolated to /tmp/opencode, without system-package/global changes.

## M04-R1 — Artwork and authored presentation

Source: DERIVED from milestones/M04-presentation.md, docs/design.md, docs/catalogue.md and docs/quality.md under USER grant.

- [x] M04-R1-D01 Implement reusable responsive reproduction/artwork/project/Selected Work components; natural-ratio full/labelled additional views and factual optional metadata. Add optional explicit project dates, not inferred dates.
  Dependencies: M03 complete. Preserve paper/ink/oxide and refine spacing/type.
  Evidence: Reproduction/ArtworkView/ProjectView/SelectedWork and presentation helpers implemented, original palette preserved with reflow/focus refinements. Schema adds optional explicit project date only.
- [x] M04-R1-D02 Generate stable artwork and authored ordered project pages, related links from authoritative membership, and curator-flag/order-only Selected Work. Handle aliases with primary canonical compatibility pages and exclude aliases from sitemap.
  Dependencies: D01; public projection unchanged. Missing actual content yields truthful empty output.
  Evidence: Existing artwork/work routes migrated; projects routes added; central projected data supplies ordered/related views; alias canonical/noindex compatibility and sitemap exclusion implemented.
- [x] M04-R1-D03 Provide a simple accessible same-tab full-image link as enlargement; no unnecessary lightbox or forced cropping/autoplay.
  Dependencies: D01. Native keyboard/touch link and browser back path to be tested.
  Evidence: Reproduction uses a native same-tab derivative link and browser Back; keyboard/touch assertions pending.
- [x] M04-R1-D04 Build a clearly labelled, noindex synthetic component preview only in disposable test roots, with no production input override/fixture import and no artist-identity representation.
  Dependencies: D01–D03. Browser tooling uses pinned Playwright and temporary browser cache; missing host capabilities are a genuine blocker, not a passing skip.
  Evidence: Disposable specimen-site helper requires a synthetic identity/banner before actual template builds; real production source has no fixture imports/overrides. Playwright 1.63.0 installed; loopback Chromium 153.0.8010.12 launched/closed successfully with temporary cache, no system changes.
  Final review follow-up: add the promised noindex tag to normal synthetic-preview pages; aliases already noindex. This is a test-site courtesy, not a confidentiality claim or production robots change. Verify the tag in viewport tests.
  Resolution: Mandatory tag added only in disposable layout copy; final targeted presentation run exits 0 (7/7 pass), including actual noindex assertions, with no production code change.
- [x] M04-R1-D05 Add meaningful browser checks at 360/768/1440px for portrait/landscape/long metadata, natural ratios/reflow, project/related ordering, keyboard and touch; document component behavior.
  Dependencies: D04.
  Evidence: tests/presentation.test.mjs implements viewport/actual HTTP/keyboard/touch/order/alias checks; docs/design.md and README.md document behavior/tooling. Results pending.
- [x] M04-R1-D06 Synchronize the touch test with native image navigation before asserting its URL, without weakening the required tap/return behavior.
  Source: DERIVED from verification failure. Evidence: npm run verify exited 1; build/check pass, all 3 desktop viewport/keyboard/order checks and aliases pass, but immediate post-tap URL assertion failed (49 passing / 2 failed including parent). Wait for the actual expected navigation event; a missing navigation must still fail.
  Resolution: waitForURL runs concurrently with tap; actual image navigation and native Back now pass, no sleeps/skips/weakened assertion. npm test rerun exited 0, all 51 tests pass.
- [x] M04-R1-P01 Preserve stable URLs, central public predicate, natural proportions, identity/assets/framework/protected refs and external-effect/privacy boundaries.
  Source: USER and DERIVED. Dependencies: all changes.
  Evidence: Actual browser ratios/routes/canonical/alias/source-order tests pass; public projection markers remain intact, no actual identity/assets/framework-major/deployment change. Protected refs rechecked unchanged.
- [x] M04-R1-P02 Keep real catalogue/curation/professional content empty; fixtures cannot leak or count as actual work/visual approval.
  Source: USER. Dependencies: all changes.
  Evidence: Actual arrays remain []; actual output publication tests pass with no fixture/artwork/media data. Only separate discarded specimen sites receive synthetic data, identity/banner and robots; no artistic acceptance claimed.
- [x] M04-R1-V01 Run viewport/keyboard/touch/project/related/full-image browser checks with actual browser/version/environment recorded; no skips as passes.
  Dependencies: D05. Results pending.
  Evidence: First full run fails touch synchronization; not a passing browser milestone yet. D06 resolves/diagnoses before rerun.
  Resolution evidence: npm test exited 0 on Linux/Node 22.23.3/npm 10.9.9, Playwright 1.63.0/Chromium 153.0.8010.12; all 360/768/1440px (height 900, DPR 1) portrait/landscape/long title/metadata ratios/reflow, keyboard focus/full-image/Back, mobile 360x800 touch, authored order/related links/curation and aliases/sitemap checks pass. Independent temporary site is clearly labelled and synthetic, not real content approval.
- [x] M04-R1-V02 Run applicable schema/publication/build/route regressions, verify fixture preview isolation and optional field honesty.
  Dependencies: D05. Evidence: Original npm run verify check/build passed (0 diagnostics, 11 pages); only test synchronization changed subsequently. Final npm test exits 0, 51 tests pass including schema/ingestion/full publication/baseline routes and browser checks; fixtures absent from actual dist, empty real arrays, unsupported edition omitted. M04 does not claim full WCAG/human/colour acceptance.
- [x] M04-R1-V03 Review intended diff/canonical reconciliation/state/protected refs and checkpoint after required technical checks.
  Dependencies: V01, V02, P01, P02.
  Evidence: Intended tracked/new-file diff reviewed; git status/diff/check/stat/log and ls-remote exit 0. Protected refs master 755df7f/backup 3bc95c7 unchanged; development remote M03 420792b. docs/design.md reconciles component/alias/fixture behavior, canonical publication references preserved, headers synchronized. All required checks precede checkpoint; transport recorded on next initialization/failure re-entry.

No required M04 subjective human gate; owner presentation approval remains M09. No superseded IDs. Closeout records/M04-presentation.md; next M05 after verified M04 checkpoint push.
