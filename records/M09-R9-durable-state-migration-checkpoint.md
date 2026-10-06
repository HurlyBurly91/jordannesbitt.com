# M09-R9 — Experience-augmented durable-state migration checkpoint

**Intermediate architecture checkpoint, not M09 completion or owner content/visual acceptance.**

## Authorization and reference

Owner explicitly authorized migration of the existing live durable-state machinery to the current experimental experience-augmented architecture and confirmed HIGH for the persistent-architecture section.

Reference repository: `HurlyBurly91/durable-state-machine`
Reference commit: `6b3ebc329de5355f6a06c3725438001999786cc8`
Reference document blob: `ea0ac06328fd87020657d915cbf60a38c22db8a3`
Experience-template AGENTS blob: `3f6ecdb7a840c6ddccd2c7bd65b6dc6657b85ba7`
Experience-template RUN_PROMPT blob: `5350e86a359f5e27a07be94e4e21036d1eb6b1f8`

Target pre-migration head: `b610adff909dd5e96f71fa9f0a0d05bc496b4256`.

## Architecture migrated

- Replaced the baseline-only prohibition on experience retrieval with an optional/advisory experience layer over the unchanged durable control plane.
- Kept explicit user requirements/current evidence above precedent.
- Added bounded investigative-loop granularity: one persisted diagnostic question may own many routine trials without new IDs/state commits/records/retrievals.
- Changed checkpoint policy from broad continuous checkpointing to semantic/reconstruction-cost boundaries.
- Clarified that STATUS changes only on actual State/Phase/Active-Request transitions.
- Clarified TASKS as resume-critical live state rather than an exhaustive experimental notebook.
- Clarified records as meaningful causal provenance/closeout rather than per-trial logs.
- Preserved corrected human-verification re-entry and unresolved older human tasks.
- Preserved selective canonical docs and source BEGIN/Reference/END relationships.
- Refactored RUN_PROMPT to support strategic experience retrieval and correct execution with retrieval disabled.
- Added `experiences/` schema/store/telemetry files. Both JSONL stores intentionally begin empty; no historical precedent was fabricated.
- Added `npm run state:check` and CI structural state validation. Full `npm run verify` now includes state validation before the existing build/tests.

## Project truth deliberately preserved

No bootstrap/example values were copied over live state. No existing stable IDs were renumbered or redefined.

Preserved unchanged:
- `PROJECT.md` goals, architecture and M00–M11 roadmap;
- all milestone contracts;
- active milestone M09;
- all pre-existing M09-R1 through R8 requirements, supersession relations, evidence, blockers and unresolved human items;
- R8 technical evidence and unresolved `M09-R8-H01`;
- all project-specific canonical domain documents except the index note describing the advisory experience layer;
- historical milestone/checkpoint records;
- application source, tests, catalogue/media behavior and public presentation;
- project model-effort policy;
- branch, privacy, publication, external-effect and release controls;
- `master` and `backup/pre-astro-redesign`.

The live state pointer is restored after migration to its exact pre-migration execution context: `M09 / ACTIVE / AUTOMATED_VERIFICATION / M09-R8`. R8 V02/H01 and older M09 human/content/rights/colour/launch gates remain unresolved.

## Legacy rules intentionally changed

1. `AGENTS.md` previously required the baseline architecture and explicitly forbade enabling the experimental experience layer. The owner directly superseded that architecture choice; the new layer is optional and non-authoritative.
2. Prior Git/checkpoint wording implied broader routine checkpointing. It now requires semantic boundaries where loss would be materially expensive to reconstruct.
3. `records/README.md` previously described records only as milestone closeout evidence despite existing meaningful M09 checkpoint records. It now accurately permits significant causal/architecture/human checkpoints while forbidding trial-by-trial logging.

No project product requirement was weakened to make these changes.

## Validation

First migration CI run `37511058123` failed only because the new validator interpreted the canonical-marker example inside `AGENTS.md` as source code. The validator was corrected to scan implementation file types while still checking actual canonical source references.

GitHub Actions run `37511215522` passed:
- Node 22 setup / `npm ci`;
- `npm run state:check`;
- `npm run build`.

The passing state check verifies:
- required durable-state/experience files;
- STATUS/TASKS header synchronization;
- active request and milestone specification existence;
- experience JSONL syntax/basic schema;
- actual source canonical marker balance/reference targets.

Diff review from `b610adf` through implementation `540ed67` contains only state-machine policy/index/experience/validation/CI/package/state files. No `src/`, tests, milestone contracts, PROJECT.md, or project-specific domain documents were modified. Pre-migration R8 evidence already records the complete 83/83 application suite passing; this migration changed no application source/tests.

Protected-by-policy refs remain:
- `master`: `755df7fee1a515388a035fce8e9e672070a1d2b4`
- `backup/pre-astro-redesign`: `3bc95c75bbe85918ce10498af31a751e2cf58fc6`

## Remaining review

No additional human acceptance is required for the state-machine migration itself. The existing M09 human gates remain exactly as before. Experience retention/retrieval is deliberately left minimally tuned until real project use produces observed evidence; empty experience files are valid and baseline execution remains sufficient.
