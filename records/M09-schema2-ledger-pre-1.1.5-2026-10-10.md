# M09 schema-2 live-ledger snapshot before framework 1.1.5

This is a verbatim preservation of the project-owned `TASKS.md` after the 1.1.5 update request was recorded and before the live ledger was adapted to the consolidated-main asynchronous external-verification semantics.

It is historical provenance, not live execution state.

Source project head: `22da42098d85faddcc89728a707a1b5d0b881402`.
Upstream main update target: `6746415f645c6c56ce39794b6962364cb39ca1bc`.

<!-- BEGIN VERBATIM PRE-1.1.5 TASKS.md -->

# Tasks

```yaml
Milestone: M09
State: ACTIVE
Phase: FOLLOW_UP
Active-Request: M09-R17
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
  Requires:
    - M09-R16-V02
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
    - Human-test target is the current redesign/astro-foundation branch after M09-R16-V02 confirms the application surface remains the R13 checkpoint behavior and the branch is buildable.
    - R13 application checkpoint provenance remains records/M09-R13-editable-multitab-checkpoint.md; later durable-state-only updates must not be treated as application changes.
    - Start Studio with the Node 22 command recorded in the R13 checkpoint and repeat the editable multi-tab/CAS conflict workflow plus history/Year/preview checks.
    - Owner explicitly accepts or reports a defect.
  Limitations:
    - R12 preview behavior remains human-unaccepted until the owner actually accepts the preserved preview path.

## M09-R16 — Consolidated-main framework 1.1.4 update

Source: USER, 2026-10-09. The durable-state framework is now consolidated on authoritative `main`; update this repository like the prior managed updates without clobbering project-owned state. Upstream main commit: `9011fe01630e951b0602dd2c02a8fd250f98a85c`; release 1.1.4, schema 2.

- [x] M09-R16-01 Update the managed experience-augmented framework from 1.1.2/schema2 to 1.1.4/schema2 from authoritative main.
  Source: USER
  Requirement: Replace only framework-owned payload/manifest plus narrow reviewed project compatibility state; preserve updater ownership and payload-integrity checks.
  Verified-By:
    - M09-R16-V01
    - M09-R16-V02

- [x] M09-R16-02 Conform live human-verification state to the new established-readiness semantics.
  Source: USER
  Requirement: When returning to HUMAN_VERIFICATION, explicitly select the current pending owner gate, align Active-Request to that gate, ensure all machine prerequisites are terminal, and durably identify the human-test target. Do not advance phase based on intent.
  Verified-By:
    - M09-R16-V01
    - M09-R16-V02

- [x] M09-R16-P01 Preserve project-specific product/Git/privacy/publication/model-effort policy, PROJECT/milestones/docs/records/experiences, all inherited unresolved human gates, current M09-R13 owner gate, historical failures/IDs and application behavior.
  Source: USER
  Requirement: No bootstrap reset, no lost history, no inferred acceptance, no public/release/external-effect authority expansion and no application change.
  Verified-By:
    - M09-R16-V01
    - M09-R16-V02

- [x] M09-R16-D01 Inspect the consolidated-main delta and choose the least-destructive compatibility path.
  Source: DERIVED
  Requires:
    - M09-R16-01
    - M09-R16-02
    - M09-R16-P01
  Conclusion: Upstream main remains schema 2 and publishes framework 1.1.4. The managed payload can be updated in place. This project has multiple pending H gates, so the new readiness validator requires an explicit Next-Gate when HUMAN_VERIFICATION resumes. M09-R13-H01 is the current selected owner gate; it will require the completed R16 compatibility verification before re-entry so the human inspects the preserved R13 application on the current validated branch.
  Conclusion-Status: VERIFIED
  Conclusion-Scope: Durable-state framework/policy/live-state compatibility only at project head e96a5b790ea7a30eeb425c299ccbbe9346b17c97 and upstream main 9011fe01630e951b0602dd2c02a8fd250f98a85c; no application/content migration.
  Conclusion-Evidence:
    - M09-R16-V01
    - M09-R16-V02
    - .durable-state/MANIFEST
    - .durable-state/framework/SCHEMAS.md
    - upstream framework/experience-augmented/HUMAN_GATE_READINESS.md at 9011fe01630e951b0602dd2c02a8fd250f98a85c
  Conclusion-Limitations:
    - Final strict validation/build against framework 1.1.4 remain pending.
    - First 1.1.4 strict run correctly marked the still-live completed R15 repository-state evidence stale after project-owned policy/checker changes. R15 is now retained only in its checkpoint record and the verbatim pre-1.1.4 ledger archive; no historical PASS or repository-state field was rewritten.
  Conclusion-Recheck-On:
    - Framework/schema version change
    - Human-gate readiness diagnostic
    - Application/material file change
    - Missing selected-gate prerequisite

- [x] M09-R16-V01 Validate framework 1.1.4 identity/hash/integration and strict schema-2 human-gate/readiness compatibility.
  Source: DERIVED
  Covers:
    - M09-R16-01
    - M09-R16-02
    - M09-R16-P01
  Gate: INVARIANT
  Command: npm run state:check
  Oracle: property-or-invariant
  Expected: Strict framework validation and project checker exit 0 with no warnings at the updated managed payload and live state.
  Result: PASS GitHub Actions run 38018644966 at 8bf2403cfa6aa841f15d4e766371d4711c4e7759: framework validator VALID with 0 errors/0 warnings and project checker PASS.
  Repository-State: HEAD=8bf2403cfa6aa841f15d4e766371d4711c4e7759; WORKTREE=CLEAN
  Limitations:
    - Structural validation does not prove website behavior or human acceptance.

- [x] M09-R16-V02 Verify the same-schema framework update leaves the R13 application target unchanged and the branch buildable for owner review.
  Source: DERIVED
  Covers:
    - M09-R16-01
    - M09-R16-02
    - M09-R16-P01
  Gate: INTEGRATION
  Command: npm run build
  Oracle: integration-or-end-to-end
  Expected: Astro build/check passes; diff since pre-update e96a5b contains only framework/manifest and reviewed durable-state policy/state/provenance/checker files, with no application source/tests/content change.
  Result: PASS GitHub Actions run 38018644966 completed npm run build after strict state validation. Diff from pre-update e96a5b790ea7a30eeb425c299ccbbe9346b17c97 through 8bf2403cfa6aa841f15d4e766371d4711c4e7759 contains only .durable-state payload/manifest, root durable-state policy/state, checker and R16 provenance; no src/, application tests, production content, PROJECT.md or milestone contract changed.
  Repository-State: HEAD=8bf2403cfa6aa841f15d4e766371d4711c4e7759; WORKTREE=CLEAN
  Limitations:
    - Build/diff evidence does not constitute owner usability/content/rights/release acceptance.

## M09-R17 — Consolidated-main framework 1.1.5 update

Source: USER, 2026-10-09. Update this repository again from the consolidated authoritative `durable-state-machine` main branch like the prior managed updates, without clobbering project-owned state. Upstream main commit: `6746415f645c6c56ce39794b6962364cb39ca1bc`; release 1.1.5, schema 2.

- [~] M09-R17-01 Update the managed experience-augmented framework from 1.1.4/schema2 to 1.1.5/schema2 from authoritative main.
  Source: USER
  Requirement: Replace only framework-owned payload/manifest plus narrow reviewed project compatibility state; preserve updater ownership, payload-integrity checks and current project policy.
  Verified-By:
    - M09-R17-V01
    - M09-R17-V02

- [~] M09-R17-02 Adopt the new asynchronous external-verification contract without inventing a new phase/task state or changing current application behavior.
  Source: USER
  Requirement: Preserve ACTIVE/AUTOMATED_VERIFICATION plus V-task semantics. When a required external run is long-lived, persist exact provider/run/target/check identity, checkpoint, yield, and resume by exact identity rather than polling latest branch state or holding an idle agent. Do not fabricate PASS while pending.
  Verified-By:
    - M09-R17-V01

- [~] M09-R17-P01 Preserve project-specific product/Git/privacy/publication/model-effort policy, PROJECT/milestones/docs/records/experiences, all inherited unresolved human gates, current M09-R13 owner gate, stable IDs/history and application behavior.
  Source: USER
  Requirement: No bootstrap reset, no lost history, no inferred human acceptance, no public/release/external-effect authority expansion and no application/content change.
  Verified-By:
    - M09-R17-V01
    - M09-R17-V02

- [x] M09-R17-D01 Inspect the consolidated-main 1.1.5 delta and choose the least-destructive compatibility path.
  Source: DERIVED
  Requires:
    - M09-R17-01
    - M09-R17-02
    - M09-R17-P01
  Conclusion: Upstream main remains schema 2 and publishes framework 1.1.5. The update is a same-schema managed payload refresh adding ASYNC_EXTERNAL_VERIFICATION.md and deterministic validation for EXTERNAL_ASYNC V-task wait contracts. The current R13 human gate is unaffected semantically, but after this material durable-policy update it must require the new R17 compatibility verification rather than stale completed R16 evidence before HUMAN_VERIFICATION resumes.
  Conclusion-Status: DERIVED
  Conclusion-Scope: Durable-state framework/policy/live-ledger representation only at project head 16f9340d68c78f4eb0bcc630384cdee13720829b and upstream main 6746415f645c6c56ce39794b6962364cb39ca1bc; no application/content migration.
  Conclusion-Evidence:
    - .durable-state/MANIFEST
    - .durable-state/framework/HUMAN_GATE_READINESS.md
    - upstream framework/experience-augmented/ASYNC_EXTERNAL_VERIFICATION.md at 6746415f645c6c56ce39794b6962364cb39ca1bc
  Conclusion-Limitations:
    - Final strict validation/build against framework 1.1.5 remain pending.
  Conclusion-Recheck-On:
    - Framework/schema version change
    - External-verification validator diagnostic
    - Human-gate readiness diagnostic
    - Any application/material file change

- [~] M09-R17-V01 Validate framework 1.1.5 identity/hash/integration, strict schema-2 semantics, human-gate readiness and asynchronous external-verification contract support.
  Source: DERIVED
  Covers:
    - M09-R17-01
    - M09-R17-02
    - M09-R17-P01
  Gate: INVARIANT
  Command: npm run state:check
  Oracle: property-or-invariant
  Expected: Strict framework validation and project checker exit 0 with no warnings at the updated payload/live state; new ASYNC_EXTERNAL_VERIFICATION.md is installed and hash-protected.
  Limitations:
    - Structural validation does not prove website behavior or human acceptance.

- [~] M09-R17-V02 Verify the same-schema framework update leaves the R13 application target unchanged and the branch buildable for owner review.
  Source: DERIVED
  Covers:
    - M09-R17-01
    - M09-R17-P01
  Gate: INTEGRATION
  Command: npm run build
  Oracle: integration-or-end-to-end
  Expected: Astro build/check passes; diff since pre-update 16f9340d68c78f4eb0bcc630384cdee13720829b contains only framework/manifest and reviewed durable-state policy/state/provenance/checker files, with no application source/tests/content change.
  Limitations:
    - Build/diff evidence does not constitute owner usability/content/rights/release acceptance.


<!-- END VERBATIM PRE-1.1.5 TASKS.md -->
