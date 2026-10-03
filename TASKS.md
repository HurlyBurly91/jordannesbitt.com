# Tasks

```yaml
Milestone: M02
State: COMPLETE
Active-Request: M02-R1
Specification: milestones/M02-catalogue.md
```

## Current authorization and carried evidence

Source: USER, 2026-10-03; full grant records/M00-preparation.md. Implement M01–M08 on redesign/astro-foundation using selected Sol 6.1 Max, with verified checkpoint commits/pushes. Stop before M09 or an earlier genuine blocker/required human gate. No master/backup writes, publication/deployment, DNS/hosting changes, real messages, purchases, payments or other external effects beyond named development checkpoint pushes; no host-wide changes. Planning counts only: owner chooses all real works/groups/order/publication/availability/prices at M09. Isolated synthetic fixtures permitted; no production leakage or representation as actual artwork. No confidential intake directory authorized.

M01 checkpoint **4896d8e** committed/pushed successfully; worktree clean and remote/protected heads rechecked at initialization. Node 22.23.3/npm 10.9.9 temporary runtime; OpenCode 1.18.34; actual openai/gpt-6.1-sol variant max. Baseline route tests: 13 pass. Nonpassing dependency audit and feature-exposure obligations: docs/operations.md (M03 must review decoder choice; release/affected features must revisit remaining advisories).

## M02-R1 — Validated catalogue and publication

Source: DERIVED from milestones/M02-catalogue.md, docs/catalogue.md and docs/acquisition.md under the USER execution grant.

- [x] M02-R1-D01 Implement Astro 5-compatible schemas/collections for artworks, ordered projects/series and professional content, including truthful dates, typed distinct dimensions, editions/offers and film/computational metadata.
  Dependencies: M01 complete. Decision to verify: empty public-source JSON arrays with custom collection loaders, because Astro's built-in file loader overwrites duplicate IDs and logs some read failures instead of rejecting them. Validate the full snapshot before storing entries.
  Evidence: src/content.config.ts and src/lib/catalogue.ts/source implement strict full-snapshot validation; empty real content arrays build. Built-in file loader behavior was inspected before selecting the custom loader.
- [x] M02-R1-D02 Centralize public-content selection, relationships/counts and asset URL/source mapping; migrate the empty array consumers without changing stable routes/identity.
  Dependencies: D01. Derive reverse project membership; omit unpublished members from public views; never duplicate work records for availability or projects.
  Evidence: Marked public projection exposed through src/data/catalogue.ts; all existing page consumers use projected works. Project membership/counts and asset lists derive from the same records; compatibility import retained.
- [x] M02-R1-D03 Enforce fixture isolation and publication-gated derivative emission from an approved-source media root outside public; validate missing/broken assets and reject production fixtures.
  Dependencies: D01, D02. Production inputs are hardcoded approved-source paths, with no fixture environment override. No original media/real metadata is supplied or inferred.
  Evidence: Hardcoded input files, strict fixture rejection, path/symlink/missing checks, forbidden public/media and marked selective emission integration. Full isolated build rejects fixtures/duplicates and omits unpublished routes/data/assets. No actual assets were ingested.
- [x] M02-R1-D04 Add meaningful positive/negative schema, relationship, dimension/edition and production-boundary tests using clearly labelled fixtures outside production paths; document selected layout in docs/catalogue.md/README.md.
  Dependencies: D01–D03.
  Evidence: tests/catalogue.test.mjs, tests/publication.test.mjs, labelled test-only factory and temporary-project helper; canonical layout and source privacy documented in docs/catalogue.md/README.md.
- [x] M02-R1-P01 Preserve existing six medium URLs, /artwork/[slug] identities, src/config/identity.ts and assets; retain static-first Astro 5, one public catalogue, Git/privacy and protected-branch/external-effect rules.
  Source: USER and DERIVED. Dependencies: all changes.
  Evidence: Intended diff reviewed; all original routes pass, identity/assets/deployment controls untouched, framework remains Astro 5.18.2. Canonical markers/reference documents accompany publication/media logic.
- [x] M02-R1-P02 Keep actual catalogue/projects/professional content empty until owner-approved public input; no invented biography, works, offer choices or confidential data.
  Source: USER. Dependencies: all changes.
  Evidence: All three actual content arrays are []; production output has no artwork/media or fixture/sentinel data. Synthetic records are confined to labelled test factories and discarded isolated projects.
- [x] M02-R1-V01 Run positive/negative tests for duplicate IDs/slugs/aliases, enums/values/dimensions, edition/offer inconsistencies, dangling relationships and missing assets.
  Dependencies: D04. Evidence: npm run verify exited 0 on Linux under temporary Node 22.23.3/npm 10.9.9 (telemetry disabled): 38 tests passed; Astro check 0 errors/warnings/hints; 10 routes built. Astro emits expected runtime notices for the intentionally empty collections, not a claimed populated catalogue.
- [x] M02-R1-V02 Verify unpublished and fixture absence from production pages, embedded JSON/counts, search/sitemap and emitted assets; empty real catalogue builds truthfully and original route smoke tests pass.
  Dependencies: D04. Evidence: First full verify passed boundary and original route checks; final targeted positive emission/hidden/orphan check added for actual filesystem copying. No search index exists yet; M05 must consume the same projection and extend verification.
  Final evidence: node --test tests/publication.test.mjs exited 0 under the verified temporary runtime, 4 tests passed. Positive emission copies only the public derivative, omitting hidden/orphan assets; symlink/missing/public-root misuse and full-build fixture/duplicate rejection pass. No browser/colour/content approval claimed.
- [x] M02-R1-V03 Review intended diff/state/canonical references/protected refs, close out only after required technical checks, then commit/push the M02 checkpoint.
  Dependencies: D04, P01, P02, V01, V02.
  Evidence: git status/diff/diff --check/log and ls-remote exited 0; intended changes reviewed, canonical references reconciled, headers synchronized. Protected refs remain master 755df7f/backup 3bc95c7; development head is M01 4896d8e. All required technical acceptance checks precede checkpoint; transport result recorded on next initialization or failure re-entry.

No required M02 human gate; real metadata approval belongs to M09. No superseded IDs. Closeout: records/M02-catalogue.md. Next: M03 after verified M02 checkpoint push.
