# Tasks

```yaml
Milestone: M09
State: ACTIVE
Phase: AUTOMATED_VERIFICATION
Active-Request: M09-R19
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
    - At the time of acceptance, M09-R17-V02 had verified the then-current durable-state-only branch changes; that completed prerequisite is preserved in records after R17 left the bounded live ledger.
    - Historical M09-R12-H01 remains FAILED overall. Its preserved preview/Return-to-Studio path was included in and accepted through this R13 human review; that does not retroactively convert the overall R12 gate into a pass.

## M09-R19 — Real-pilot Studio cleanup

Source: USER, 2026-10-11. After exercising the real pilot, the owner reported four concrete Studio problems and explicitly requested: `implement those Studio fixes`.

- [~] M09-R19-01 Fix the sole-member project removal dead end and add explicit safe deletion for private project drafts.
  Source: USER
  Requirement: A project that would otherwise become empty must not silently resurrect its removed member. Studio must explain that projects require at least one artwork and provide an explicit `Delete project draft` path for private Studio-only projects. Repository-catalogue projects must remain protected.
  Verified-By:
    - M09-R19-V01
    - M09-R19-H01

- [~] M09-R19-02 Add safe removal for Photos & references without deleting source files.
  Source: USER
  Requirement: Selected unattached private media can be removed from the active Studio library with explicit confirmation. Attached media must identify the artwork relationship and refuse removal until detached through the artwork editor. Source uploads/private derivatives remain on disk and public catalogue/assets are untouched.
  Verified-By:
    - M09-R19-V01
    - M09-R19-V02
    - M09-R19-H01

- [~] M09-R19-03 Make new-artwork intake single-flight and interrupt accidental repeated use of the same source image.
  Source: USER
  Requirement: While a selected image is being inspected/prepared, the create action clearly shows progress and cannot be submitted again. If the same source hash is already being prepared, refuse the duplicate pending request. If it already exists in Studio, interrupt before allocating another neutral ID and offer an explicit existing-item path or deliberate `Create another artwork anyway`; identical source bytes remain allowed only after deliberate override.
  Verified-By:
    - M09-R19-V01
    - M09-R19-V02
    - M09-R19-H01

- [~] M09-R19-04 Replace persistent top-of-page success text with a compact neutral transient Studio status bar while keeping errors conspicuous.
  Source: USER
  Requirement: Normal saved/ready/preview information uses a neutral status presentation and clears automatically after a bounded interval. Errors remain persistent, visually distinct and announced as alerts. In-progress messages may remain until replaced by completion/failure.
  Verified-By:
    - M09-R19-V01
    - M09-R19-H01

- [~] M09-R19-P01 Preserve R13 multi-tab/CAS/navigation/preview behavior, R18 safe artwork deletion, private source/media bytes, public-export boundaries and all unresolved M09 content/rights/release gates.
  Source: DERIVED
  Requirement: This is private Studio workflow cleanup only. No public export, source-file deletion, deployment, M09 completion or M10 authority is added.
  Verified-By:
    - M09-R19-V01
    - M09-R19-V02

- [~] M09-R19-V01 Run full project verification after implementation.
  Source: DERIVED
  Covers:
    - M09-R19-01
    - M09-R19-02
    - M09-R19-03
    - M09-R19-04
    - M09-R19-P01
  Gate: INTEGRATION
  Command: npm run verify
  Oracle: integration-or-end-to-end
  Expected: strict state validation, Astro build and the full browser/non-browser test suite pass with targeted project/media/intake/status coverage.
  Limitations:
    - Automated checks do not replace owner usability review.

- [~] M09-R19-V02 Verify destructive and duplicate-prevention invariants.
  Source: DERIVED
  Covers:
    - M09-R19-02
    - M09-R19-03
    - M09-R19-P01
  Gate: CONSTRAINT
  Command: targeted Studio project/media/intake tests
  Oracle: property-or-invariant
  Expected: project/media removal cannot mutate repository catalogue/source bytes; attached media removal is refused; duplicate pending intake allocates no second artwork; existing-source duplicate requires explicit override; neutral-ID registry advances only for deliberate new artworks.
  Limitations:
    - Physical secure erasure and media garbage collection remain out of scope.

- [H] M09-R19-H01 Owner reviews the four real-pilot fixes in normal Studio use.
  Source: USER
  Requires:
    - M09-R19-V01
    - M09-R19-V02
  Covers:
    - M09-R19-01
    - M09-R19-02
    - M09-R19-03
    - M09-R19-04
  Gate: HUMAN
  Verification:
    - Delete the demo project through the explicit project-delete path after exercising last-member removal guidance.
    - Remove an unattached Photos & references item and confirm attached-media refusal/guidance.
    - Re-submit the same image while pending and after completion; confirm pending refusal and deliberate duplicate override choice.
    - Confirm success/ready/preview text appears as a neutral bounded status bar while errors remain conspicuous.

