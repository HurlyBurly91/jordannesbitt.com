# M00 — Preparation closeout

Completed: 2026-10-03, after explicit owner kickoff. Contract: milestones/M00-preparation.md.

## Authorization

The owner explicitly approves the plan and staged launch approach and grants autonomous implementation of **M01 through M08** on **redesign/astro-foundation**, using the locally selected **Sol 6.1 Max** model. Verified milestone checkpoints may be committed and pushed on that branch. Follow RUN_PROMPT.txt, durable state, milestone contracts and canonical domain documents. Stop before M09 or at an earlier genuine blocker requiring owner input; required human gates remain binding.

Approximately 20–30 works in 3–5 coherent groups and an approximately ten-work pilot are approved **planning targets only**. The owner will choose real works, groups/series, sequencing, publication status, availability, prices and other launch content at M09. Those choices must not be fabricated or inferred during M01–M08. Clearly isolated synthetic fixtures are authorized where milestone contracts permit them, with no production leakage or representation as the owner's actual artwork.

No writes to master or backup/pre-astro-redesign, publication/deployment, DNS/hosting changes, real messages, purchases, payment activation or other externally consequential actions are authorized. Development-branch checkpoint commits/pushes are explicitly authorized. M10 release and M11 commerce need separate authority. No permission is inferred for confidential input directories or host-wide changes.

The requested model label is recorded as the owner's selection, not as an installed provider/variant assertion. This session identifies itself as openai/gpt-6.1-sol; M01 must resolve the actual installed runtime and configured selection without exposing credentials or inventing a variant.

## Final IDs and evidence

- **M00-R1-01 VERIFIED:** prior checkout recovery and safe bootstrap instructions in docs/operations.md. Original evidence: bash syntax check and six mocked bootstrap scenarios passed; no command was run on the owner's machine in that preparation environment.
- **M00-R1-02 VERIFIED:** baseline durable-state prototype adapted with state/phase separation, stable IDs, human re-entry and selective canonical references; provenance recorded in AGENTS.md/RUN_PROMPT.txt.
- **M00-R1-03 VERIFIED:** prior direction and source-backed research recorded in PROJECT.md and docs/research.md; observations, adaptations and unresolved inputs distinguished.
- **M00-R1-04 VERIFIED:** M00–M11 contracts exist; technical, content, release and commerce gates distinguished.
- **M00-R1-P01 VERIFIED (preparation):** runtime, lockfile, identity, assets and protected branches preserved by the documentation-only changes.
- **M00-R1-P02 VERIFIED (preparation):** no implementation, publication, confidential-content permission, pricing, paid-service authorization or invented runtime configuration in preparation.
- **M00-R1-V01 VERIFIED:** original preparation comparison, references and state-header evidence retained from TASKS.md; 25 additive documentation files and unchanged protected refs.
- **M00-R1-H01 VERIFIED:** owner's explicit 2026-10-03 kickoff supplies the missing plan/staging and bounded execution approval.
- **M00-R2-01 VERIFIED:** implementation/model/checkpoint scope captured in this authorization.
- **M00-R2-02 VERIFIED:** planning targets and M09 content ownership captured.
- **M00-R2-P01 VERIFIED (preparation and capture):** protected refs/external-effect limits captured and rechecked; these remain ongoing execution constraints.
- **M00-R2-P02 VERIFIED (capture):** synthetic-fixture isolation requirement captured and carried into subsequent milestones.
- **M00-R2-V01 VERIFIED:** local preparation recheck below.

No superseded IDs or unresolved M00 human checks.

## Local verification

Environment: Linux, existing /home/jordan/jordannesbitt.com checkout, 2026-10-03. Actual runtime/build verification belongs to M01.

- `git status --short --branch`, `git branch --show-current`, `git remote -v`, `git log --oneline -10`, `git diff --stat`, `git diff --check`: exit 0. Clean redesign/astro-foundation worktree at fde7d07; origin is https://github.com/HurlyBurly91/jordannesbitt.com.git.
- `git ls-remote --heads origin redesign/astro-foundation master backup/pre-astro-redesign`: exit 0. Development fde7d07e5f9e886718ef269aaca541567a201aa4; master 755df7fee1a515388a035fce8e9e672070a1d2b4; backup 3bc95c75bbe85918ce10498af31a751e2cf58fc6. Protected refs match preparation evidence.
- `git diff --name-status 8fc3176b9d906b2f7794237a0fab75c91a6b61b4..HEAD`: exit 0, exactly 25 added documentation files; no modified/deleted runtime files.
- `git rev-list --left-right --count HEAD...origin/master` and `git log --oneline HEAD..origin/master`: exit 0, 4 ahead / 1 behind; master-only commit is the known PR #1 merge, not an unidentified hotfix.
- Repository readback and milestone glob: all 12 contracts exist; referenced domain documents resolve; STATUS.md and TASKS.md matched before closeout and are updated together.

## Decisions and limitations

Baseline durable architecture retained; no experience layer or competing state files. Existing Astro/TypeScript and paper/ink/oxide direction retained. No M00 build, browser, visual, colour, delivery or indexing pass is claimed. Original bootstrap evidence was mocked, not a live machine modification. M01 must reproduce the real environment and build. Content/artistic acceptance remains M09; M01–M08 technical success cannot substitute for it.

Next authorized milestone: M01. This closeout and its synchronized COMPLETE headers are checkpointed before resetting the bounded live ledger to M01-R1.
