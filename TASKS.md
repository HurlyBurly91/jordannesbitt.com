# Tasks

```yaml
Milestone: M09
State: ACTIVE
Phase: HUMAN_VERIFICATION
Active-Request: M09-R13
Spec: milestones/M09-content-acceptance.md
Ledger: TASKS.md
Experience-Retrieval: disabled
```

This is the bounded schema-2 live execution ledger.

Historical task-level state is preserved rather than duplicated here:
- complete pre-schema-2 ledger: `records/M09-schema1-ledger-snapshot-2026-10-09.md`
- pre-framework-1.1.2 schema-2 ledger: `records/M09-schema2-ledger-pre-1.1.2-2026-10-09.md`
- per-request checkpoint records under `records/`

The updated 1.1.2 validator can bind inherited pending human gates directly to exact archived requirements. Do not recreate historical request groups or fabricate bridge requirements solely for validation.

## Inherited unresolved human gates

- [H] M09-R1-H01 Owner reviews provisional classifications/ambiguities/date proxies, candidate visual groups/composition and actual reproduction quality; confirms or revises next pilot/selection/metadata steps.
  Source: DERIVED from USER stop condition; preserved stable ID.
  Covers:
    - M09-R1-04
    - M09-R1-06
    - M09-R1-08
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Owner explicitly accepts or revises the provisional classifications/groups/date proxies/reproduction quality. Automation cannot substitute.

- [H] M09-R1-H02 Final M09 actual public-source/rights/metadata/content/manifest/visual/business/contact approval and remaining human checks require explicit owner input; local-only work cannot complete M09 or authorize M10.
  Source: DERIVED from contract and USER restrictions; preserved stable ID. Marker remains AWAITING_HUMAN because the archived text explicitly said this gate was not a blocker to authorized local work.
  Covers:
    - M09-R1-P01
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Owner explicitly approves the exact public source/rights/factual content/manifest/business/contact set before M09 closeout or M10.

- [H] M09-R5-H01 Owner reviews regenerated provisional classifications/groups/pilot/colour and current presentation; automation does not approve content/artistry or close M09.
  Source: DERIVED from USER review boundary; preserved stable ID.
  Covers:
    - M09-R5-02
    - M09-R5-04
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Owner explicitly accepts or revises the persistent visual-review content.

- [H] M09-R5-H02 Manually resolve the preserved mobile opened-inspection colour-contrast INCONCLUSIVE cases; absence of automated violations is not a pass.
  Source: DERIVED from observed review; preserved stable ID.
  Covers:
    - M09-R5-04
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Human/manual review resolves the exact recorded contrast cases.

- [H] M09-R6-H01 Owner tests practical local intake/edit/media identity/project+Selected ordering/lead/preview/review/explicit export usability and readable polish.
  Source: USER/DERIVED human gate; preserved stable ID.
  Covers:
    - M09-R6-03
    - M09-R6-04
    - M09-R6-05
    - M09-R6-06
    - M09-R6-07
    - M09-R6-08
    - M09-R6-11
    - M09-R6-12
    - M09-R6-18
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Owner explicitly accepts the practical Studio workflow; automated demos do not approve real rights/content/export.

- [H] M09-R6-H02 Owner approves actual public-source records/media/rights/professional/contact/availability/curation/launch manifest and final real-public visual/reproduction/content acceptance separately.
  Source: USER and active milestone contract; preserved stable ID.
  Covers:
    - M09-R6-10
    - M09-R6-11
    - M09-R6-14
    - M09-R6-15
    - M09-R6-16
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Explicit owner approval of the exact final public content/rights/curation/business/launch set.

- [H] M09-R7-H01 Owner tests image-first normal intake/editor/library/project/selection/home/preview/public-preparation usability and expert disclosure.
  Source: USER/DERIVED human gate; preserved stable ID.
  Covers:
    - M09-R7-02
    - M09-R7-03
    - M09-R7-04
    - M09-R7-05
    - M09-R7-06
    - M09-R7-07
    - M09-R7-08
    - M09-R7-09
    - M09-R7-10
    - M09-R7-11
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Owner explicitly accepts the image-first Studio workflow and disclosure.

- [H] M09-R7-H02 Manually resolve the preserved 360px Studio artwork colour-contrast INCONCLUSIVE case.
  Source: DERIVED from final demo report; preserved stable ID.
  Covers:
    - M09-R7-11
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Human/manual review resolves the exact recorded contrast case.

## M09-R13 — Current editable multi-tab Studio owner gate

Historical R13 requirements and technical evidence remain in `records/M09-R13-editable-multitab-checkpoint.md` and the schema-1 ledger archive.

- [H] M09-R13-H01 Owner reviews normal same/different-artwork editable tabs, advisory/no metadata copy, save conflict/retention/confirmed reload and consistent Back/Forward/URLs plus preserved validation/preview.
  Source: USER/DERIVED; preserved stable ID.
  Covers:
    - M09-R13-01
    - M09-R13-02
    - M09-R13-03
    - M09-R13-04
    - M09-R13-05
    - M09-R13-06
    - M09-R13-07
    - M09-R13-08
    - M09-R13-09
    - M09-R13-10
    - M09-R13-11
    - M09-R13-12
    - M09-R13-13
    - M09-R13-14
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Owner repeats the R13 editable multi-tab/CAS conflict workflow plus history/Year/preview checks and explicitly accepts or reports a defect.
  Limitations:
    - R12 preview behavior remains human-unaccepted until the owner actually accepts the preserved preview path.

## M09-R15 — Framework 1.1.2 same-schema compatibility update

Source: USER, 2026-10-09. Update this repository again to conform to the latest `durable-state-machine` experimental branch, like the previous migration, without clobbering project-owned durable state. Upstream experimental commit: `a6a58d297e7233ee86850c39869958edd032b31f`; release 1.1.2, schema 2.

- [x] M09-R15-01 Update the managed framework snapshot and manifest from 1.1.0/schema2 to 1.1.2/schema2, preserving updater ownership and payload-integrity checks.
  Source: USER
  Requirement: Same-schema update replaces framework-owned payload/manifest; project-owned compatibility edits must be narrow, reviewed and preservation-aware.
  Verified-By:
    - M09-R15-V01
    - M09-R15-V02

- [x] M09-R15-02 Conform the bounded live ledger to updated schema-2 compatibility semantics for inherited unresolved human gates and historical evidence without inventing replacement facts.
  Source: USER
  Requirement: Preserve original stable H IDs and archived requirement/evidence provenance; use Coverage-Source/HISTORICAL_RECORDED only where supported by actual archives. Do not manufacture commands, repository-state claims, acceptance, or duplicate historical request groups merely to satisfy validation.
  Verified-By:
    - M09-R15-V01

- [x] M09-R15-P01 Preserve all project-specific product/Git/privacy/publication/model-effort policy, PROJECT/milestones/docs/records/experiences, current M09-R13 owner gate, older unresolved human gates, historical failures, stable IDs and application behavior.
  Source: USER
  Requirement: No bootstrap reset, no history loss, no inferred human acceptance, no public/release/external-effect authority expansion.
  Verified-By:
    - M09-R15-V01
    - M09-R15-V02

- [x] M09-R15-D01 Inspect the upstream delta and choose the least-destructive update path.
  Source: DERIVED
  Requires:
    - M09-R15-01
    - M09-R15-02
    - M09-R15-P01
  Conclusion: Upstream 1.1.2 remains schema 2, so the framework payload is a compatible managed update. Compatibility additions recognize letter-suffixed milestone IDs, nested follow-up IDs, inherited pending H gates through Coverage-Source archives, and HISTORICAL_RECORDED V evidence without fabricated commands/repository state. The previous synthetic live bridge requirements can be archived while original pending H IDs bind directly to exact archived requirements.
  Conclusion-Status: VERIFIED
  Conclusion-Scope: Durable-state policy/live-ledger representation only at project head ba5662cf148bdea0f5e585b110e7f96907276f20 and upstream experimental a6a58d297e7233ee86850c39869958edd032b31f; no application change.
  Conclusion-Evidence:
    - M09-R15-V01
    - M09-R15-V02
    - records/M09-schema2-ledger-pre-1.1.2-2026-10-09.md
    - records/M09-schema1-ledger-snapshot-2026-10-09.md
    - .durable-state/MANIFEST
    - .durable-state/framework/SCHEMAS.md
  Conclusion-Limitations:
    - Final strict validation against framework 1.1.2 remains pending.
    - Historical application verification remains historical and is not relabelled as current execution.
  Conclusion-Recheck-On:
    - Framework/schema version change
    - Strict-validator diagnostic
    - Missing archived coverage target
    - Any application/material file introduced by the update

- [x] M09-R15-V01 Validate framework 1.1.2 identity/hash/integration and strict schema-2 live-ledger compatibility after the update.
  Source: DERIVED
  Covers:
    - M09-R15-01
    - M09-R15-02
    - M09-R15-P01
  Gate: INVARIANT
  Command: npm run state:check
  Oracle: property-or-invariant
  Expected: Strict framework validation and project-specific checks exit 0 with no warnings, and archived inherited-gate coverage resolves exactly.
  Result: PASS GitHub Actions run 38002592227: framework validator reported VALID with 0 errors and 0 warnings; project checker reported PASS.
  Repository-State: HEAD=8f2741c5437a7cf72d928265d83138df30cd4a0d; WORKTREE=CLEAN
  Limitations:
    - Structural validation does not prove website behavior or human acceptance.

- [x] M09-R15-V02 Verify the same-schema framework update did not alter application behavior or protected project boundaries.
  Source: DERIVED
  Covers:
    - M09-R15-01
    - M09-R15-P01
  Gate: CONSTRAINT
  Command: npm run build
  Oracle: integration-or-end-to-end
  Expected: Astro build/check passes; diff contains only framework/manifest plus reviewed durable-state compatibility/provenance/validation files, not application source/tests/content.
  Result: PASS GitHub Actions run 38002592227 completed npm run build after strict state validation. Diff from pre-update 15cc418 to implementation checkpoint 8f2741c contains only .durable-state framework/manifest and reviewed project durable-state policy/provenance/checker files; no src/, application tests, content catalogue or milestone contract changed.
  Repository-State: HEAD=8f2741c5437a7cf72d928265d83138df30cd4a0d; WORKTREE=CLEAN
  Limitations:
    - Build success is not owner usability/content/rights/release approval.
