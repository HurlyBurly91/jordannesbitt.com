# Tasks

```yaml
Milestone: M05
State: COMPLETE
Active-Request: M05-R1
Specification: milestones/M05-archive.md
```

## Authorization and carried evidence

Source: USER, 2026-10-03; full grant records/M00-preparation.md. Autonomous M01–M08 on redesign/astro-foundation with selected Sol 6.1 Max, verified checkpoint commits/pushes; stop before M09 or earlier genuine blocker/required human gate. No protected-branch writes, deployment/publication, DNS/hosting, real messages, purchases/payments or other external effects beyond checkpoints, nor host-wide changes. Planning counts only; owner selects actual works/groups/order/publication/availability/prices at M09. Isolated clearly synthetic fixtures allowed, never actual production/artist content. No real/private intake authorized.

M04 checkpoint **4e03ce8** committed/pushed successfully; initialization clean origin/worktree/development/protected refs rechecked. Temporary Node 22.23.3/npm 10.9.9; actual openai/gpt-6.1-sol/max. Browser Playwright 1.63.0/Chromium 153.0.8010.12 in temporary cache. All 51 prior tests and final 7 presentation/noindex tests pass. Remaining framework advisories stay nonpassing in docs/operations.md; no affected optimizer/SSR/transition features enabled.

## M05-R1 — Archive and navigation

Source: DERIVED from milestones/M05-archive.md, docs/catalogue.md, docs/design.md and docs/quality.md under USER grant.

- [x] M05-R1-D01 Build compact public-only search entries/facets from the central projection, with meaningful title/process/material/context text, supported medium/series/year/availability filters and explicit chronological/title sorts.
  Dependencies: M04 complete. Search index and embedded data must never expose hidden work/membership/assets or fixture content.
  Evidence: src/lib/search.ts builds compact entries from projected catalogue; pure src/lib/archive.ts supplies normalized combined matching/date sorting/query state, and search-index.json is public-only.
- [x] M05-R1-D02 Implement progressive archive rows and labelled Apply/Reset controls, accurate live counts/empty states, shareable URL state and back/forward restoration; retain basic server-rendered browsing with JavaScript disabled.
  Dependencies: D01. Form remains disabled until enhancement succeeds; no-JS retains all published links and medium/project navigation.
  Evidence: Server-rendered rows/links plus disabled-until-ready labelled controls, client Apply/Reset/history restoration, counts/no-result status and no-JS fallback implemented without a SPA.
- [x] M05-R1-D03 Hide empty public categories in browse/primary navigation while preserving stable compatibility routes; keep editorial Selected Work distinct from comprehensive Archive.
  Dependencies: D01, D02. Computational medium route only when supported by actual published records; optional project/Work navigation depends on public/curated data. Acquisition links follow in M07 when routes exist.
  Evidence: Derived populated media drives browse facets/links; optional Work/Projects primary links depend on actual curation/public membership. Original six routes retained; computational route conditional on public support. Archive comprehensive versus selected flag/order view retained.
- [x] M05-R1-D04 Add meaningful combined-filter/reset/history/keyboard/no-result/no-JS and index-isolation tests, plus a **separate 1,000-record synthetic scaling exercise** recording build/runtime/environment and limitations in docs/quality.md.
  Dependencies: D01–D03. Synthetic records/images remain only in labelled independent test sites, never the real archive or launch count.
  Evidence: tests/archive.test.mjs implements unit/browser/scaling assertions; specimen helper deduplicates only repeated synthetic image encoding. Measurement/documentation pending actual run.
  Evidence: First independently passing scale run and measurement conditions/limitations recorded in docs/quality.md; README describes repeatable exercise. Full acceptance rerun remains pending the label repair.
- [x] M05-R1-D05 Replace wrapped select labels with explicit for/id associations so facet names are clear and independently addressable by keyboard/accessibility tools.
  Source: DERIVED from automated failure. Evidence: first npm run verify exits 1 (53 pass/1 fail); exact Medium label lookup times out because select options are included in wrapped label text. Build/check/all other regressions pass; separate synthetic 1,000-record exercise passes (build 3765 ms, filter interaction 63 ms, Chromium 153.0.8010.12, 768x900, unthrottled loopback, one run/shared flat images). Correct markup rather than weaken label assertions.
  Implementation: explicit for/id controls and grid wrappers added; exact-label assertions retained for rerun. Final boundary review also makes the search helper invoke the existing central projection internally; its unit test now supplies raw validated data to verify hidden-record omission without relying on caller discipline.
- [x] M05-R1-D06 Isolate Astro and Vite writable caches within each project's ignored .astro tree, so parallel temporary fixture builds cannot write the real checkout's/shared content store.
  Source: DERIVED from actual verification defect. Second verify exits 1: 46 pass/3 fail; a fixture build hits ENOENT renaming a shared node_modules/.astro data-store temp file, and archive availability sees another fixture's values. Linked node_modules must be dependency-read-only, with no shared mutable cache. Add a production-cache contamination assertion and rerun actual builds.
  Implementation: Astro cacheDir ./.astro/cache and Vite cacheDir ./.astro/vite configured per root; production-cache fixture/sentinel assertion added. Actual isolation verification pending rerun; old shared-cache measurements are diagnostic only, not accepted final performance evidence.
  Resolution: Full post-isolation npm run verify exits 0, 54 tests pass, correct availability restored, no store rename errors and real content-cache contamination assertion passes.
- [x] M05-R1-D07 Correct the stale archive unit-test projection call left after import cleanup; retain the raw-input publication assertion and all meaningful filter checks.
  Source: DERIVED from second verify ReferenceError. The test's publicCatalogue import was removed but its old call remained. Correct the expression rather than restoring caller filtering, so internal search-boundary behavior is tested.
  Implementation: Unit test now passes the raw validated snapshot to searchEntries; hidden omission and all filter assertions retained for rerun.
  Resolution: Raw-input publication/filter/unknown-date/query assertions pass in final full suite.
- [x] M05-R1-P01 Preserve one public catalogue, stable artwork/medium URLs, authored selection/project order, natural image proportions and existing identity/assets/design/framework.
  Source: USER and DERIVED. Dependencies: all changes.
  Evidence: All existing route/presentation/selection/relationship checks pass; public projection reused by search/index and preserved unchanged. Identity/assets/major/palette untouched; thumbnails use natural ratios and reviewed derivatives.
- [x] M05-R1-P02 Preserve Git/privacy/external-effect/host boundaries, real empty content and fixture isolation; never treat synthetic dataset size as real art/inventory or human acceptance.
  Source: USER. Dependencies: all operations.
  Evidence: Empty real arrays/index, actual output/cache boundary tests and per-project temporary cache isolation pass. No real inputs or external effects beyond development checkpoints; protected refs rechecked unchanged; scale explicitly synthetic.
- [x] M05-R1-V01 Run actual browser combined filters/sort/reset/back/forward/restored URLs/keyboard/no-results/no-JS checks and accurate public result/index assertions.
  Dependencies: D04. Results pending.
  Evidence: First full verify failed select-label access; acceptance unresolved until D05 and rerun. Other passes do not bypass this browser gate.
  Evidence: Second run passed label lookup but exposed shared-cache metadata contamination and stale unit call; D06/D07 required before acceptance. Independent scale rerun passed 4067 ms build/49 ms interaction, same stated synthetic limitations; overall verify remains failing.
  Resolution: Final full suite exits 0, actual 360x800 Chromium 153.0.8010.12 combined filters/keyboard Enter, reset/history/back/forward/restored query/no-results/no-JS/browse links/index counts and supported category options pass. Public synthetic index=3; hidden sentinel omitted. Actual real index remains [].
- [x] M05-R1-V02 Run separate scaling/build/runtime exercise and applicable full schema/ingestion/publication/presentation/route checks; record actual commands/counts/environment.
  Dependencies: D04. Results pending; performance is synthetic lab evidence, not field/user-acceptance proof.
  Evidence: Verified temporary runtime npm run verify exits 0: 0 check diagnostics, 11 pages plus search JSON, 54 tests pass/no skips, including original routes/publication/intake/presentation and cache isolation. Accepted post-isolation 1,000 synthetic records: build 3912 ms / filter input-to-result 49 ms, 768x900 DPR1/unthrottled loopback/Chromium153.0.8010.12, one run/shared flat images. Actual content/art count not inferred; earlier runs diagnostic only. docs/quality.md reconciled.
- [x] M05-R1-V03 Review intended diff/canonical references/state/protected refs and checkpoint after required technical checks.
  Dependencies: V01, V02, P01, P02.
  Evidence: Intended tracked/new-file diff reviewed; git status/diff/check/stat/log/ls-remote exit 0. Protected master 755df7f/backup 3bc95c7 unchanged; development remote M04 4e03ce8. docs/quality.md reconciles accepted post-isolation measurement and invariants; headers synchronized. Technical checks precede checkpoint; transport recorded at next initialization/failure re-entry.

Technical gate only; real content/presentation M09. No superseded IDs. Closeout records/M05-archive.md; next M06 after verified M05 checkpoint push.
