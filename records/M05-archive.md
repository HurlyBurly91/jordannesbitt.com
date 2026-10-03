# M05 — Archive/navigation closeout

Technical acceptance: 2026-10-03. Contract: milestones/M05-archive.md. Grant: records/M00-preparation.md. Prior M04 checkpoint **4e03ce8** committed/pushed successfully before initialization.

## Final IDs

All VERIFIED, no superseded IDs or required human gate.

- **M05-R1-D01:** compact public-only entries/facets/search JSON, meaningful normalized text and combined filters/sorts.
- **M05-R1-D02:** progressive server archive with Apply/Reset/live counts/query history and basic no-JS browsing.
- **M05-R1-D03:** supported-category/optional primary navigation, stable compatibility routes and distinct authored selection.
- **M05-R1-D04:** actual interaction/isolation tests and separate 1,000-record synthetic build/runtime exercise documented.
- **M05-R1-D05:** wrapped select-label defect repaired with explicit for/id associations, exact accessibility assertions retained.
- **M05-R1-D06:** discovered shared mutable Astro/Vite cache defect repaired with per-project ignored cache roots and contamination assertion.
- **M05-R1-D07:** stale unit-test call repaired; raw input now tests internal search publication projection.
- **M05-R1-P01:** one catalogue, stable artwork/medium URLs, authored order/selection, ratios/identity/assets/design/framework preserved.
- **M05-R1-P02:** real content empty, temporary synthetic inputs/output/caches isolated, Git/privacy/external/host boundaries preserved.
- **M05-R1-V01:** browser combined facets/search/sort/reset/history/URL restoration/keyboard/no-result/no-JS/index/category checks pass.
- **M05-R1-V02:** scaling and full schema/intake/publication/presentation/routes/cache checks pass.
- **M05-R1-V03:** intended diff/state/canonical/ref review passed before checkpoint; transport recorded on next initialization/failure re-entry.

## Decisions

Archive is comprehensive public records; Selected Work remains explicit curator flags/order. `src/lib/search.ts` invokes the sole canonical projection even for raw input, generating compact server rows, embedded data and `/search-index.json`. Search includes actual supplied title/date/process/materials/context/project titles; normalized case/diacritics and all query words. Facets use supported public medium/series/year/availability values only; unknown dates sort last. No remaining-stock guesses or recommendations.

Static rows/links remain usable without JavaScript. Explicitly associated labelled controls stay disabled until enhancement succeeds; Apply/Reset update result/live empty state and shareable URL, with native back/forward restoration and no focus stealing. Client module imports pure filter logic without shipping catalogue validation/schema machinery. Empty medium/project/optional Work categories are hidden; original six medium routes remain, computational route is conditional on public support. No real selection decisions.

Independent fixture sites link read-only dependencies, but **Astro/Vite writable caches are explicitly per root** (`.astro/cache/`, `.astro/vite/`). This fixes the discovered default shared node_modules store. Actual production output and content cache are checked for fixture contamination. The real catalogue/index remains empty. No production fixture input switch, source imports or deployed preview.

## Actual commands/results

Linux checkout, temporary **Node 22.23.3/npm 10.9.9**, Astro **5.18.2**, Playwright **1.63.0**, Chromium **153.0.8010.12**, selected model **openai/gpt-6.1-sol/max**, telemetry disabled.

- Same verified temporary runtime, first `npm run verify`: exit **1**, check/build pass (0 diagnostics, 11 HTML pages plus search JSON), **53 pass/1 fail**. Wrapped select labels included option text, so exact Medium label lookup failed. Repaired markup, not the expected label.
- Second `npm run verify`: exit **1**, **46 pass/3 fail**. Stale removed-import call caused unit ReferenceError; parallel fixture builds shared node_modules/.astro content store, producing a temp-file rename ENOENT and wrong availability facets. These are genuine observed defects, not passing checks.
- Configured per-project Astro/Vite caches, corrected raw-input test call and added actual production-cache sentinel assertion.
- Final `npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'`: exit **0**; **0 errors/warnings/hints**, 11 pages plus JSON, **54 tests pass**, none failed/skipped. Empty collection notices are expected/documented. Exact labels, correct facet data, concurrent fixture builds and cache isolation now pass.
- Browser **360×800**: combined search/medium/project/year/availability/sort reduces public synthetic 3→1 via keyboard Enter; correct live count/query; back/forward/reset/restored URL/no-result state and no horizontal overflow pass. Only Drawing/Photography options supported by those public fixtures appear; hidden sentinel absent from public index. No-JS context retains all 3 links, disabled controls and clear guidance; artwork navigation works. Existing presentation 360/768/1440, keyboard/touch/order/aliases and all prior schema/intake/publication/route tests pass.
- Separate **1,000-record synthetic** test after cache isolation: **3,912 ms build**, **49 ms** automation input/Enter-to-result interaction, 1,000→1. **768×900, DPR 1, Chromium 153.0.8010.12, unthrottled loopback, one post-isolation run**, shared flat images and warmed tooling. Earlier 3,765/63 and 4,067/49 ms measurements are diagnostic only due to pre-isolation architecture, not accepted performance evidence. No actual-art count or field/INP claim.
- `git status/diff/diff --check/stat/log` and `git ls-remote`: exit 0, intended new/existing paths reviewed. Remote development 4e03ce8 at review; master **755df7fee1a515388a035fce8e9e672070a1d2b4**, backup **3bc95c75bbe85918ce10498af31a751e2cf58fc6** unchanged. Canonical quality/measurement/cache rules and synchronized headers reconciled.

## Limitations and next

Synthetic shared images/local timings do not establish real image transfer, field Web Vitals, mobile hardware behavior, full WCAG/assistive-technology or owner content/artistic approval. Actual content remains empty and all real choices are M09. The default old node_modules cache is no longer used; no unrelated source was removed/reset. No deployment, external messages/business actions or global configuration changes. Residual framework advisories remain nonpassing per docs/operations.md.

Next authorized milestone: **M06** after verified same-branch checkpoint commit/push, preserving M09 and earlier blocker/human gates.
