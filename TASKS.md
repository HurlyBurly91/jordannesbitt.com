# Tasks

```yaml
Milestone: M01
State: COMPLETE
Active-Request: M01-R1
Specification: milestones/M01-baseline.md
```

## Current authorization

Source: USER, 2026-10-03. Explicit grant archived in records/M00-preparation.md; M00 checkpoint 5476c4c was pushed successfully. Implement M01 through M08 autonomously on redesign/astro-foundation using the selected Sol 6.1 Max model, committing/pushing verified milestone checkpoints. Stop before M09 or at any earlier genuine blocker/mandatory human gate. No protected-branch writes, publication/deployment, DNS/hosting changes, real messages, purchases, payment activation or other external effects beyond the named development checkpoint pushes. No host-wide configuration changes.

The 20–30 works / 3–5 groups / approximately ten-work pilot are planning targets only. Real content, series, order, publication, availability and pricing are owner choices at M09. Use isolated synthetic fixtures only where permitted, never production content or representations of the owner's artwork. No confidential input directory is authorized.

## M01-R1 — Reproducible baseline

Source: USER (execution grant above); technical tasks and checks Source: DERIVED from milestones/M01-baseline.md, docs/operations.md, docs/quality.md and docs/catalogue.md.

- [x] M01-R1-D01 Inspect origin, branch/worktree/topology, installed Node/npm/OpenCode and actual configured provider/model/variant without exposing credentials.
  Dependencies: M00 complete. Evidence: development origin/clean head confirmed at kickoff; master-only change is the known PR #1 merge.
  Evidence: Shell Node v18.19.1/npm 9.2.0 is incompatible. Temporary, explicitly versioned npm-exec environment provides Node v22.23.3/npm 10.9.9 without global changes. OpenCode 1.18.34 models includes openai/gpt-6.1-sol; read-only CLI database queries restricted to this checkout's latest session/model metadata confirm provider openai, model gpt-6.1-sol, variant max (session and actual assistant messages). Credential/configuration values and conversation contents were not output or committed.
- [x] M01-R1-D02 Reproduce npm ci and npm run build using the lockfile in a Node 22-compatible environment; inspect security findings and resolve baseline defects without blind major upgrades.
  Dependencies: D01 runtime availability.
  Evidence: Original lockfile npm ci/build exited 0 under temporary Node 22.23.3/npm 10.9.9; Astro 5.18.2 produced 10 pages, no errors/warnings, one explicit-inline JSON-LD hint. npm audit --json exited 1 with 9 findings (1 critical, 7 high, 1 low), inspected rather than reported passing. Compatible fix/triage task D05 follows; no force/major upgrade is authorized. Subsequent builds will disable telemetry per process (ASTRO_TELEMETRY_DISABLED=1).
- [x] M01-R1-D03 Establish meaningful automated regression smoke checks for actual existing routes and document repeatable commands.
  Dependencies: D02 build output and inspected runtime/routes.
  Evidence: tests/smoke.test.mjs and tests/helpers/preview.mjs; actual Astro preview checks all 10 routes, key HTML metadata/landmarks, CSS/favicon/sitemap and unknown-artwork 404. npm run verify exited 0, 13 tests passed, none skipped.
- [x] M01-R1-D04 Update docs/operations.md and developer instructions with verified non-secret runtime facts, route inventory and observed limitations.
  Dependencies: D01–D03.
  Evidence: docs/operations.md verified baseline/triage and README.md reproducible commands; package engines/.nvmrc and loopback/telemetry scripts use the inspected runtime.
- [x] M01-R1-D05 Apply individually scoped compatible transitive fixes for devalue, fast-uri, js-yaml, nanoid and svgo; inspect remaining advisory surfaces and document limitations without changing Astro's major or claiming a clean audit.
  Source: DERIVED from D02 audit inspection. Dependencies: original-lockfile build reproduced. Remaining Astro advisories recommend major 7; optional sharp and http-cache-semantics require careful triage. M01 acceptance requires inspected findings, not a fabricated zero-advisory result.
  Evidence: Scoped updates reduced 9 findings to 4; post-update audit exited 1 (Astro critical, sharp/http-cache-semantics high, esbuild low). Current feature exposure, unsupported major fix, M03 ingestion review and future release limitation recorded in docs/operations.md. No audit pass claimed.
- [x] M01-R1-P01 Preserve existing identity/assets, stable route identities, catalogue privacy rules and installed framework major; keep all fixtures outside production paths.
  Source: USER and DERIVED. Dependencies: all M01 changes.
  Evidence: Reviewed intended diff changes only baseline scripts/runtime declaration, compatible lock resolutions, one explicit-inline hint, tests and documentation; no identity/assets/catalogue/route changes or fixture content. Actual baseline routes pass; Astro remains 5.18.2.
- [x] M01-R1-P02 Preserve master/backup and existing deployment controls; local previews must bind loopback. No global configuration changes or silent model substitution.
  Source: USER. Dependencies: all M01 operations.
  Evidence: Remote refs rechecked unchanged (master 755df7f, backup 3bc95c7); deployment workflow remains master-only/manual and untouched. Loopback preview tests passed and stopped. Model max verified in actual session; no host configuration writes.
- [x] M01-R1-V01 Verify requested model selection through the actual installed runtime or record a precise blocker; never invent a Max variant.
  Dependencies: D01.
  Evidence: Linux checkout; opencode --version/help, credential-filtered opencode debug config, opencode models openai and read-only opencode db model-only queries exited 0. Resolved openai/gpt-6.1-sol variant max in this checkout's active build session and assistant messages. No repository/global OpenCode configuration was changed; selection is already correct.
- [x] M01-R1-V02 Verify clean lockfile installation/build and actual route smoke harness exit codes.
  Dependencies: D02, D03. Evidence: On Linux, temporary Node 22.23.3/npm 10.9.9 with ASTRO_TELEMETRY_DISABLED=1: npm install --package-lock-only --ignore-scripts --no-audit && npm ci && npm run verify exited 0. Astro check: 0 errors/warnings/hints; 10 pages built; 13 Node tests passed. Package audit findings remain separately nonpassing as documented, not a required zero-advisory criterion in this contract.
- [x] M01-R1-V03 Verify intended diff, synchronized durable state, same-branch checkpoint procedure and unchanged protected refs; commit/push M01 only after required checks pass.
  Dependencies: D04, P01, P02, V01, V02. Evidence: git status/diff/log/diff --check and git ls-remote exited 0; intended tracked/untracked files reviewed and synchronized headers updated together. Protected refs unchanged; remote development head is the successful same-branch M00 checkpoint 5476c4c. All required M01 technical checks passed before the M01 checkpoint operation. Commit/push transport result must be recorded on M02 initialization or failure re-entry, not inferred here.

No M01 human acceptance gate is specified. Content/visual acceptance is deferred to M09, not claimed by baseline tests. No superseded IDs. Closeout: records/M01-baseline.md. Next authorized: M02 after the M01 checkpoint is pushed. Remaining nonpassing audit findings and feature-exposure review are carried in docs/operations.md.
