# Tasks

```yaml
Milestone: M09
State: ACTIVE
Phase: AUTOMATED_VERIFICATION
Active-Request: M09-R14
Spec: milestones/M09-content-acceptance.md
Ledger: TASKS.md
Experience-Retrieval: disabled
```

This is the bounded schema-2 live execution ledger.

The complete pre-schema-2 ledger, including every historical M09-R1 through R13 task, original evidence prose, failed human observations and supersession notes, is preserved verbatim at `records/M09-schema1-ledger-snapshot-2026-10-09.md`. Existing per-request checkpoint records remain authoritative historical provenance. Do not load the migration snapshot unless old task-level provenance is actually needed.

## M09-R1 — Remaining real-image and final-content owner gates

- [ ] M09-R1-09 Owner reviews provisional classifications, ambiguity, date proxies, visual groups/composition and reproduction quality before those provisional choices are treated as accepted content.
  Source: DERIVED from preserved M09-R1-H01; schema-2 formalization only.
  Requirement: Explicit owner review remains required for provisional real-image classifications/groups/reproduction quality.
  Verified-By:
    - M09-R1-H01

- [H] M09-R1-H01 Owner reviews provisional classifications/ambiguities/date proxies, candidate visual groups/composition and actual reproduction quality; confirms or revises next pilot/selection/metadata steps.
  Source: DERIVED from USER stop condition; preserved stable ID.
  Covers:
    - M09-R1-09
  Gate: HUMAN
  Verification:
    - Owner explicitly accepts or revises the provisional classifications/groups/date proxies/reproduction quality. Automation cannot substitute.

- [ ] M09-R1-10 Final M09 public-source, rights, factual metadata, content, manifest, visual, business and contact approval requires explicit owner input before closeout or M10.
  Source: DERIVED from preserved M09-R1-H02 and active milestone contract; schema-2 formalization only.
  Requirement: Final public-source/rights/metadata/content/manifest/business/contact approval remains a human gate.
  Verified-By:
    - M09-R1-H02

- [H] M09-R1-H02 Final M09 actual public-source/rights/metadata/content/manifest/visual/business/contact approval and remaining human checks require explicit owner input; local-only work cannot complete M09 or authorize M10.
  Source: DERIVED from contract and USER restrictions; preserved stable ID. Marker normalized from BLOCKED to AWAITING_HUMAN because the preserved text explicitly said it was not a blocker to authorized local work.
  Covers:
    - M09-R1-10
  Gate: HUMAN
  Verification:
    - Owner explicitly approves the exact public source/rights/factual content/manifest/business/contact set.

## M09-R5 — Remaining persistent-review owner gates

- [ ] M09-R5-05 Owner reviews the regenerated persistent provisional classifications/groups/pilot/colour and retained presentation before those review artifacts are accepted.
  Source: DERIVED from preserved M09-R5-H01.
  Requirement: Persistent review-package content/artistry/colour remains subject to owner review.
  Verified-By:
    - M09-R5-H01

- [H] M09-R5-H01 Owner reviews regenerated provisional classifications/groups/pilot/colour and current presentation; automation does not approve content/artistry or close M09.
  Source: DERIVED from USER review boundary; preserved stable ID.
  Covers:
    - M09-R5-05
  Gate: HUMAN
  Verification:
    - Owner explicitly accepts or revises the persistent visual-review content.

- [ ] M09-R5-06 The unresolved mobile opened-inspection colour-contrast cases require manual resolution before claiming that review surface fully accepted.
  Source: DERIVED from preserved M09-R5-H02.
  Requirement: Inconclusive automated contrast observations remain inconclusive until human/manual resolution.
  Verified-By:
    - M09-R5-H02

- [H] M09-R5-H02 Manually resolve the preserved mobile opened-inspection colour-contrast INCONCLUSIVE cases; absence of automated violations is not a pass.
  Source: DERIVED from observed review; preserved stable ID.
  Covers:
    - M09-R5-06
  Gate: HUMAN
  Verification:
    - Human/manual review resolves the recorded contrast cases.

## M09-R6 — Remaining Studio and final-public owner gates

- [ ] M09-R6-19 Owner accepts practical local authoring usability across intake/edit/media identity/projects/curation/preview/review/export preparation.
  Source: DERIVED from preserved M09-R6-H01.
  Requirement: Studio workflow usability remains a human judgment after automated implementation evidence.
  Verified-By:
    - M09-R6-H01

- [H] M09-R6-H01 Owner tests practical local intake/edit/media identity/project+Selected ordering/lead/preview/review/explicit export usability and readable polish.
  Source: USER/DERIVED human gate; preserved stable ID.
  Covers:
    - M09-R6-19
  Gate: HUMAN
  Verification:
    - Owner explicitly accepts the practical Studio workflow; automated demos do not approve real rights/content/export.

- [ ] M09-R6-20 Owner explicitly approves the actual public-source records/media/rights/professional/contact/availability/curation/launch manifest and final real-public visual/reproduction/content result.
  Source: DERIVED from preserved M09-R6-H02 and active milestone contract.
  Requirement: Final real-public content and launch-manifest approval remains separate from technical Studio success.
  Verified-By:
    - M09-R6-H02

- [H] M09-R6-H02 Owner approves actual public-source records/media/rights/professional/contact/availability/curation/launch manifest and final real-public visual/reproduction/content acceptance separately.
  Source: USER and active milestone contract; preserved stable ID.
  Covers:
    - M09-R6-20
  Gate: HUMAN
  Verification:
    - Explicit owner approval of the exact final public content/rights/curation/business/launch set.

## M09-R7 — Remaining simplified-Studio and manual-contrast gates

- [ ] M09-R7-12 Owner accepts the image-first Studio workflow, visual authoring controls, preview/public-preparation clarity and expert disclosure.
  Source: DERIVED from preserved M09-R7-H01.
  Requirement: Simplified Studio usability remains a human gate.
  Verified-By:
    - M09-R7-H01

- [H] M09-R7-H01 Owner tests image-first normal intake/editor/library/project/selection/home/preview/public-preparation usability and expert disclosure.
  Source: USER/DERIVED human gate; preserved stable ID.
  Covers:
    - M09-R7-12
  Gate: HUMAN
  Verification:
    - Owner explicitly accepts the image-first Studio workflow and disclosure.

- [ ] M09-R7-13 The preserved 360px Studio colour-contrast inconclusive case requires manual resolution before claiming acceptance.
  Source: DERIVED from preserved M09-R7-H02.
  Requirement: The inconclusive contrast case remains unresolved rather than being inferred passing.
  Verified-By:
    - M09-R7-H02

- [H] M09-R7-H02 Manually resolve the preserved 360px Studio artwork colour-contrast INCONCLUSIVE case.
  Source: DERIVED from final demo report; preserved stable ID.
  Covers:
    - M09-R7-13
  Gate: HUMAN
  Verification:
    - Human/manual review resolves the exact recorded contrast case.

## M09-R13 — Current editable multi-tab Studio owner gate

Historical technical requirements M09-R13-01 through M09-R13-14 and their V01/V02 evidence remain preserved in `records/M09-R13-editable-multitab-checkpoint.md` and the pre-schema-2 ledger snapshot. They are not duplicated into the bounded live ledger.

- [ ] M09-R13-15 Owner accepts the current editable same/different-artwork multi-tab workflow, advisory/no-metadata-copy behavior, CAS conflict retention/review/confirmed reload, URL/history behavior and preserved validation/preview behavior.
  Source: DERIVED from preserved M09-R13-H01; no semantic change.
  Requirement: Current R13 Studio behavior requires explicit owner usability acceptance.
  Verified-By:
    - M09-R13-H01

- [H] M09-R13-H01 Owner reviews normal same/different-artwork editable tabs, advisory/no metadata copy, save conflict/retention/confirmed reload and consistent Back/Forward/URLs plus preserved validation/preview.
  Source: USER/DERIVED; preserved stable ID.
  Covers:
    - M09-R13-15
  Gate: HUMAN
  Verification:
    - Owner repeats the R13 A/B conflict workflow plus history/Year/preview checks and explicitly accepts or reports a defect.
  Limitations:
    - R12 preview behavior remains human-unaccepted until the owner actually accepts the preserved preview path.

## M09-R14 — Versioned framework 1.1.0 / schema-2 migration

Source: USER, 2026-10-09. Update this repository to conform to the current `durable-state-machine` experimental branch without clobbering project-owned durable state. Preserve the old ledger/history and make current state conform in place.

- [~] M09-R14-01 Install and integrate the versioned experience-augmented framework 1.1.0 / schema 2 from experimental commit 7dd83b11600ebb16af784026ed66845278c9c1f0.
  Source: USER
  Requirement: Use the managed `.durable-state/MANIFEST` + `.durable-state/framework/` distribution and project-owned root integration wrappers.
  Verified-By:
    - M09-R14-V01
    - M09-R14-V02

- [~] M09-R14-P01 Preserve existing project truth and provenance while migrating: product roadmap, M09 identity, stable IDs/meanings, unresolved human gates, historical evidence/failures/supersession, canonical docs, records, experiences, Git/privacy/publication/model-effort rules and application behavior.
  Source: USER
  Requirement: Do not overwrite old state with bootstrap/template values; archive the pre-schema-2 live ledger verbatim and keep all still-relevant human gates live.
  Verified-By:
    - M09-R14-V01
    - M09-R14-V02

- [~] M09-R14-P02 Do not use the framework migration to authorize or change website behavior, real content/rights, deployment, protected refs, external services, M09 completion, M10 release or M11 commerce.
  Source: USER
  Requirement: Migration changes durable-state ownership/schema only.
  Verified-By:
    - M09-R14-V02

- [x] M09-R14-D01 Perform a preservation-aware semantic migration rather than reinstalling a starter template.
  Source: DERIVED
  Requires:
    - M09-R14-01
    - M09-R14-P01
    - M09-R14-P02
  Conclusion: The safe migration is to vendor the framework-owned release, convert root AGENTS/RUN_PROMPT into project-specific wrappers, archive the full schema-1 live ledger, keep only still-relevant unresolved gates in bounded schema-2 TASKS, and add explicit coverage for new migration requirements.
  Conclusion-Status: DERIVED
  Conclusion-Scope: Durable-state policy/state only at project head 03ceb7ee175b74d327b8b7699b66efb2e5759307 plus framework source commit 7dd83b11600ebb16af784026ed66845278c9c1f0; no application behavior migration.
  Conclusion-Evidence:
    - M09-R14-V01
    - M09-R14-V02
    - records/M09-schema1-ledger-snapshot-2026-10-09.md
    - .durable-state/MANIFEST
    - .durable-state/framework/SCHEMAS.md
  Conclusion-Limitations:
    - Deterministic validation establishes schema/integration consistency only; it does not re-certify historical application evidence or human judgments.
    - Historical application evidence remains historical and is not relabelled as current schema-2 evidence.
  Conclusion-Recheck-On:
    - Framework/schema version change
    - Validator diagnostic
    - Missing preserved stable ID/human gate
    - Any application/material file change introduced by the migration

- [~] M09-R14-V01 Validate target schema, manifest/framework integration, live-ledger coverage and repository-specific durable invariants.
  Source: DERIVED
  Covers:
    - M09-R14-01
    - M09-R14-P01
  Gate: INVARIANT
  Command: npm run state:check
  Oracle: property-or-invariant
  Expected: Framework schema-2 strict validation and project-specific state checks both exit 0 with the managed framework hash/markers and live state consistent.
  Prior-Evidence: GitHub Actions run 37984997352 passed npm run state:check at 8a3f3c4dd8d5569324005d271ed50e93230e7256. Final-state CI run 37985159227 then exposed that strict historical repository-state validation cannot resolve that commit under actions/checkout fetch-depth 1; this is a verification-environment defect, not a schema/content pass.
  Next:
    - Rerun strict validation with full Git history, then record the actual current checkpoint result and repository state.
  Limitations:
    - Structural validation does not prove website behavior, artistic quality, rights, factual content or human acceptance.
    - The central checkout CLI status command was not executed in GitHub Actions; equivalent manifest/payload/integration identity is checked by the project state checker.

- [~] M09-R14-V02 Verify the policy/schema migration did not alter application behavior or protected project boundaries.
  Source: DERIVED
  Covers:
    - M09-R14-01
    - M09-R14-P01
    - M09-R14-P02
  Gate: CONSTRAINT
  Command: npm run build
  Oracle: integration-or-end-to-end
  Expected: Existing Astro build/check succeeds with no application-source changes; migration diff remains limited to durable-state/framework/project-policy files and historical snapshot/record.
  Prior-Evidence: GitHub Actions run 37984997352 passed npm run build at 8a3f3c4dd8d5569324005d271ed50e93230e7256 before the final state-only handoff. Final-state rerun is pending after the strict-validator checkout-depth correction.
  Next:
    - Rerun the build after strict current-state validation succeeds.
  Limitations:
    - Build success is not public-content, usability, colour, rights or release approval.
    - The prior R13 95/95 application-suite result remains historical evidence at its recorded material checkpoint; this policy/schema migration did not relabel it as newly executed.
