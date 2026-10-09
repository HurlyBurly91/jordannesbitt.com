# M09-R14 — Versioned framework 1.1.0 / schema-2 migration checkpoint

Intermediate durable-state architecture checkpoint, **not M09 completion and not owner acceptance of R13 Studio/content/rights/colour/release gates**.

## Requested migration

On 2026-10-09 the owner explicitly requested that this repository conform to the current `HurlyBurly91/durable-state-machine` experimental branch without clobbering the existing state machine.

Reference branch commit:

`7dd83b11600ebb16af784026ed66845278c9c1f0`

Current experimental precedence inspected:

1. `DURABLE_STATE_MACHINE_EXECUTABLE_SEMANTICS_AMENDMENT_2026-10.md`
2. `DURABLE_STATE_MACHINE_EXPERIENCE_AUGMENTED_RESEARCH_AMENDMENT_2026-10.md`
3. `DURABLE_STATE_MACHINE_EXPERIENCE_AUGMENTED.md`
4. `framework/experience-augmented/`
5. `templates/experience-augmented/`

Installed release:

```text
FRAMEWORK_VERSION=1.1.0
SCHEMA_VERSION=2
PAYLOAD_SHA256=dba34051dba98534179886521f382ce8bf6b8caa5309d64e52be5e977345a125
```

Framework-owned files now live under `.durable-state/framework/`; release identity is recorded in `.durable-state/MANIFEST`.

## Project-owned policy migration

Root `AGENTS.md` and `RUN_PROMPT.txt` were refactored into project-specific integration wrappers with the required markers:

```text
Framework-Policy: .durable-state/framework/AGENTS.md
Framework-Resume: .durable-state/framework/RUN_PROMPT.txt
```

Generic durable-state policy moved to the versioned framework snapshot. Project-specific rules were retained in root policy: branch/Git authorization, explicit repo-write permission, Node/runtime commands, M09/M10/M11 gates, model-effort policy, privacy/public-Git constraints, private Studio root, no external effects, release separation and canonical project-doc map.

The framework-owned snapshot is updater-owned and must not be hand-edited during ordinary project work.

## Schema-2 semantic migration

Schema 2 adds:
- typed decision-shaping conclusions;
- explicit bidirectional `Verified-By` / `Covers` evidence coverage;
- evidence gate/oracle/repository-state provenance;
- deterministic strict validation.

The former live ledger had accumulated M09-R1 through R13 technical history. Rewriting every historical pass as current schema-2 evidence would have falsely implied that old tests were current after later material changes.

Instead the migration preserves the entire prior `TASKS.md` verbatim at:

`records/M09-schema1-ledger-snapshot-2026-10-09.md`

Existing per-request checkpoint records remain unchanged.

The new root `TASKS.md` is intentionally bounded. It retains:
- every still-relevant unresolved owner/content/rights/colour gate from R1/R5/R6/R7;
- the current R13 human usability gate;
- stable original H task IDs;
- new schema-2 requirement IDs that formalize the exact preserved human gates without changing their meaning;
- the R14 migration requirements/evidence.

Historical R8/R10/R11/R12 failed human observations remain preserved in their checkpoint records and the verbatim migration snapshot rather than remaining as live queue entries. This follows the updated distinction between live execution state and retrospective provenance.

M09-R1-H02 was normalized from BLOCKED to AWAITING_HUMAN because its own preserved text explicitly stated that it was not a blocker to authorized local work. No human acceptance was inferred.

## Experience and canonical state

`experiences/SCHEMA.md` now includes repository-state applicability/bindings from the current experimental architecture. The experience JSONL stores remain empty; no historical precedent was fabricated.

Project canonical docs remain project-owned. `docs/README.md` now points to the framework schema while preserving the existing catalogue/design/acquisition/quality/operations/research/studio map. Optional `sources/` and `data/research/` were not fabricated because this project has not adopted retained evidence artifacts in those paths.

No application source, application tests, catalogue content, real media or milestone contracts were changed for the migration.

## Deterministic validation and build

Implementation checkpoint:

`8a3f3c4dd8d5569324005d271ed50e93230e7256`

GitHub Actions run:

`37984997352`

Passed:
- Node 22 setup / `npm ci`;
- `npm run state:check`, which now runs the framework schema-2 validator in strict mode plus the project-specific manifest/integration/canonical-reference checker;
- `npm run build`.

The project checker independently verifies:
- manifest release/source identity;
- installed framework payload SHA-256;
- root framework integration markers;
- STATUS/TASKS/Spec/Ledger/experience-retrieval agreement;
- experience JSONL integrity;
- project canonical source-reference balance.

The framework validator checks the schema-2 task/evidence/conclusion relations mechanically. These checks do not determine artistic quality, factual artwork metadata, rights, human usability, or release approval.

The prior R13 full 95/95 application-suite result remains historical evidence at its recorded material checkpoint. It was not rerun merely to relabel old evidence; this migration did not change application source/tests.

## Preservation

Deliberately preserved:
- `PROJECT.md` and M00-M11 roadmap;
- every milestone contract;
- M09 active milestone identity;
- current pre-migration R13 human-review meaning;
- stable historical IDs and full old ledger text;
- all existing records/checkpoint evidence;
- unresolved owner/content/rights/colour/launch gates;
- canonical domain docs and source-code bindings;
- empty experience stores;
- private Studio/art source boundaries;
- model-effort policy;
- release and external-effect restrictions;
- master and backup refs.

The migration does not approve R13, complete M09, authorize M10, or begin M11.

## Final live state

After migration verification the execution pointer returns to:

```yaml
Milestone: M09
State: ACTIVE
Phase: HUMAN_VERIFICATION
Active-Request: M09-R13
```

The next substantive action is the already-pending R13 owner usability review, not another framework migration.

## Verification-environment correction

The first post-handoff final-state CI run, `37985159227`, did **not** pass strict validation. The schema-2 validator reported W081 for the recorded evidence commit because the existing GitHub Actions checkout used `fetch-depth: 1`; the referenced migration evidence commit was therefore unavailable in the CI worktree. Strict mode correctly promoted those warnings to failure and skipped the build.

This is not recorded as a passing final-state result. The migration request is temporarily reopened in `AUTOMATED_VERIFICATION`. CI checkout is changed to full history so repository-state applicability can be checked as designed. No application source or durable semantics are changed by this correction.

## Final strict verification

The CI checkout was corrected to `fetch-depth: 0` so schema-2 repository-state evidence can be resolved instead of being silently unavailable in shallow history.

GitHub Actions run `37985419117` at `bf29db6f8a544046e223ee4657768328f2c0da8f` passed:

- `npm ci`;
- `npm run state:check` with framework `--strict` validation plus project-specific manifest/integration checks;
- `npm run build`.

This supersedes the failed shallow-history final-state attempt as the current migration verification. The failure remains recorded above rather than being rewritten as a pass.

The final handoff commit changes only live ledger/status/provenance after this verified material checkpoint, so the recorded repository-state evidence remains applicable under the framework's material-file rules. Execution returns to M09-R13 / HUMAN_VERIFICATION; no human gate is closed by R14.
