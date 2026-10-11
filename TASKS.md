# Tasks

```yaml
Milestone: M09
State: ACTIVE
Phase: AUTOMATED_VERIFICATION
Active-Request: M09-R18
Spec: milestones/M09-content-acceptance.md
Ledger: TASKS.md
Experience-Retrieval: disabled
```

This is the bounded schema-2 live execution ledger.

Historical task-level state is preserved rather than duplicated here:
- complete pre-schema-2 ledger: `records/M09-schema1-ledger-snapshot-2026-10-09.md`
- pre-framework-1.1.2 schema-2 ledger: `records/M09-schema2-ledger-pre-1.1.2-2026-10-09.md`
- per-request checkpoint records under `records/`

The current schema-2 validator can bind inherited pending human gates directly to exact archived requirements. Do not recreate historical request groups or fabricate bridge requirements solely for validation.

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

- [x] M09-R13-H01 Owner reviews normal same/different-artwork editable tabs, advisory/no metadata copy, save conflict/retention/confirmed reload and consistent Back/Forward/URLs plus preserved validation/preview.
  Source: USER/DERIVED; preserved stable ID.
  Requires:
    - M09-R17-V02
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
    - Human-test target is the current redesign/astro-foundation branch after M09-R17-V02 confirms the application surface remains the R13 checkpoint behavior and the branch is buildable.
    - R13 application checkpoint provenance remains records/M09-R13-editable-multitab-checkpoint.md; later durable-state-only updates must not be treated as application changes.
    - Start Studio with the Node 22 command recorded in the R13 checkpoint and repeat the editable multi-tab/CAS conflict workflow plus history/Year/preview checks.
    - Owner explicitly accepts or reports a defect.
  Human-Decision: ACCEPTED
  Decision-Source: User, 2026-10-11, after review of the submitted Studio screencast: "we can mark it accepted"
  Limitations:
    - Historical M09-R12-H01 remains FAILED overall. Its preserved preview/Return-to-Studio path was included in and accepted through this R13 human review; that does not retroactively convert the overall R12 gate into a pass.

## M09-R18 — Safe private draft deletion

Source: USER, 2026-10-11. During real Studio use the owner observed that accumulated drafts have no simple deletion control and explicitly requested: `add draft deletion`.

- [~] M09-R18-01 Add a normal `Delete draft` action to each private artwork card in the Artworks grid and to the corresponding artwork editor.
  Source: USER
  Requirement: Deletion must be discoverable from both the collection view and the draft editor without exposing technical/internal controls as the primary path.
  Verified-By:
    - M09-R18-V01
    - M09-R18-H01

- [~] M09-R18-02 Make draft deletion destructive only to the private active draft record, never to source/original files or public catalogue records.
  Source: USER
  Requirement: Only private unpublished Studio drafts may be deleted. Source uploads/frozen snapshot inputs and public repository catalogue records/assets must remain untouched.
  Verified-By:
    - M09-R18-V01
    - M09-R18-V02

- [~] M09-R18-03 Require explicit confirmation and safely reconcile private references when deleting.
  Source: DERIVED
  Requirement: Confirmation names the draft and warns about Selected Work/homepage/project membership when present. Delete removes the active artwork from private catalogue/curation/project membership, invalidates associated workflow/note state from the active record, and must not silently delete unrelated photos/reference media.
  Verified-By:
    - M09-R18-V01
    - M09-R18-H01

- [~] M09-R18-P01 Preserve neutral identity and concurrent-edit safety.
  Source: DERIVED
  Requirement: Deleted neutral artwork IDs are never reused. A stale editor may not delete a newer saved draft; deletion must use the authoritative saved-version/CAS boundary and serialized private-state transaction.
  Verified-By:
    - M09-R18-V01
    - M09-R18-V02

- [~] M09-R18-P02 Preserve all accepted R13 navigation/multi-tab/preview behavior, public-export boundaries, release guards and current M09 content/rights gates.
  Source: USER/DERIVED
  Requirement: Draft deletion is a bounded Studio follow-up only; it does not authorize public export, source deletion, M09 completion or M10.
  Verified-By:
    - M09-R18-V01
    - M09-R18-V02

- [x] M09-R18-D01 Implement private deletion as an auditable tombstone rather than silent irreversible erasure.
  Source: DERIVED
  Requires:
    - M09-R18-02
    - M09-R18-03
    - M09-R18-P01
  Conclusion: Removing a draft from the active private catalogue while retaining a compact private tombstone of the deleted record/workflow/note and deletion time provides recovery provenance without keeping the draft visible or reusing its neutral ID. Media/source files remain untouched and may later be reused explicitly.
  Conclusion-Status: DERIVED
  Conclusion-Scope: Private Studio state only; no public catalogue or filesystem source deletion.
  Conclusion-Evidence:
    - docs/studio.md
    - scripts/lib/studio-store.mjs
  Conclusion-Limitations:
    - No owner-facing undelete UI is required by this request.
    - The first implementation CI run correctly marked completed R17 clean-state evidence stale after R18 changed material Studio code. R17 remains preserved in records and the pre-1.1.5 ledger snapshot; its historical evidence was not rewritten.
  Conclusion-Recheck-On:
    - Owner requests permanent erasure or restore UI
    - Public catalogue deletion is requested
    - Media garbage collection is introduced

- [~] M09-R18-V01 Run the full project verification after implementation.
  Source: DERIVED
  Covers:
    - M09-R18-01
    - M09-R18-02
    - M09-R18-03
    - M09-R18-P01
    - M09-R18-P02
  Gate: INTEGRATION
  Command: npm run verify
  Oracle: integration-or-end-to-end
  Expected: state validation, Astro build and the complete project test suite pass with targeted draft-deletion coverage.
  Limitations:
    - Automated checks do not establish owner-facing usability.

- [~] M09-R18-V02 Verify deletion cannot mutate public source/catalogue or reuse a neutral ID.
  Source: DERIVED
  Covers:
    - M09-R18-02
    - M09-R18-P01
    - M09-R18-P02
  Gate: CONSTRAINT
  Command: targeted Studio deletion tests plus public-catalogue/source assertions
  Oracle: property-or-invariant
  Expected: private draft disappears from active state; public catalogue/source bytes remain unchanged; project memberships are reconciled; subsequent allocation does not reuse the deleted ID; stale-version deletion is refused.
  Limitations:
    - Filesystem secure-erasure semantics are explicitly out of scope.

- [H] M09-R18-H01 Owner reviews draft deletion from both the artwork card and artwork editor.
  Source: USER
  Requires:
    - M09-R18-V01
    - M09-R18-V02
  Covers:
    - M09-R18-01
    - M09-R18-03
  Gate: HUMAN
  Verification:
    - Confirm the action is easy to find, warning text is understandable, cancel preserves the draft, confirmed deletion removes it from the active Studio view, and no unexpected source/media loss is observed.

