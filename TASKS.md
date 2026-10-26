# Tasks

```yaml
Milestone: M09
State: ACTIVE
Phase: AUTOMATED_VERIFICATION
Active-Request: M09-R25
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

## M09-R5 — Existing pilot content and curation owner review

Existing unresolved gates retain their stable IDs and historical scope/coverage. Owner2026-10-25 finds the old private pilot presentation acceptable but rejects its automatically assembled sample as the preferred content selection. That is partial presentation feedback, NOT R5-H01 acceptance or physical-colour/manual-contrast approval. The next target must use persistent Studio's actual saved records and curation, prepared under M09-R22; old evidence remains historical and intact. No new arbitrary ten-work sample, inferred curation or public-source approval.

- [H] M09-R5-H01 Owner reviews regenerated provisional classifications/groups/pilot/colour and current presentation; automation does not approve content/artistry or close M09.
  Source: DERIVED from USER review boundary; preserved stable ID.
  Requires:
    - M09-R21-05
    - M09-R23-V02
  Covers:
    - M09-R5-02
    - M09-R5-04
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Review-Target: /home/jordan/.local/share/jordannesbitt-art/m09/reviews/studio-curated-review-2026-10-25T22-14-58-425Z-e8ecd62d (owner-review-summary.md,SERVE.txt,report.json,screenshots). Existing Studio preview1f6b4aff-5fee-4a96-a998-5a61d5be68e9 renders exact saved catalogue revision138; revision139 differs only by this preview's registration. Original review-2026-10-06T00-55-36-730Z-0f6e9c43 package remains unchanged historical presentation evidence, not selection authority.
  Review-Target-Update: The preceding R22 target is historical. Current exact candidate is M09-R23 at /home/jordan/.local/share/jordannesbitt-art/m09/reviews/five-work-release-candidate-2026-10-25-r23 (SERVE.txt,AUTHORIZATION.md); source146 and exact record/media proposals are pending M09-R23-H01. R22/original R5 evidence stays preserved,not reimported or treated as current export authority.
  Partial-Owner-Feedback: Explicit2026-10-25 owner message accepts current private pilot visual presentation only; actual saved Studio curated-content review remains pending.
  Later-Owner-Decisions: Current M09-R23 instruction fixes the five-work roster/order,lead and zero-project release and preserves saved dates/media/materials/reproductions. Approved About is draft copy for initial release. Presentation accepted,not factual/rights/disclosure or manifest/release approval; final title/alt/kind proposals and missing public contact move to one exact authorization checkpoint,not another open-ended editorial review.
  Verification:
    - Owner explicitly accepts or revises the persistent visual-review content.
    - Review actual saved Studio artworks, Selected Work order, project memberships and homepage lead as stored; no arbitrary sample or silent restoration of deleted choices. Unknown/missing choices are owner decisions, not defaults or publication/rights approval.
    - Current saved catalogue has10artworks,5ordered Selected Work entries,no active projects or homepage lead. Review actual content/order and clarify absent choices only if desired; no choices were invented. Start the existing preview using private SERVE.txt,or use the already running Studio's normal Preview current work/Selected Work. No new Git publication is a prerequisite to this local content review.

- [H] M09-R5-H02 Manually resolve the preserved mobile opened-inspection colour-contrast INCONCLUSIVE cases; absence of automated violations is not a pass.
  Source: DERIVED from observed review; preserved stable ID.
  Covers:
    - M09-R5-04
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Verification:
    - Human/manual review resolves the exact recorded contrast cases.

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

## M09-R20 — Contextual Studio feedback and media-state clarity

Studio request closeout CLOSED2026-10-25 following R20-H01 acceptance2026-10-23, R21-H01 acceptance2026-10-25 and verified scoped publication below. The separately recorded checker repair is locally verified but intentionally remains unpublished/uncommitted; this closeout does not claim a clean committed-checker verification or close M09.

Source: USER, 2026-10-15. During R19 manual review the owner confirmed project removal/deletion and duplicate-source interruption worked, but reported that action feedback appearing in the distant top banner was hard to associate with the button pressed and that Photos & references did not make active use, unattached items or repeated source images clear. The owner explicitly authorized: `fix these Studio UX issues`.

- [x] M09-R20-01 Keep direct-action confirmation/error feedback adjacent to the initiating control or action group.
  Source: USER
  Requirement: Save/delete/intake/media/review and similar direct actions must not rely on a distant top-of-page banner when their initiating control remains visible. Informational confirmations remain bounded/transient; errors remain persistent and announced as alerts. Startup/background events may continue to use the global status bar.
  Verified-By:
    - M09-R20-V01
    - M09-R20-V02
    - M09-R20-H01

- [x] M09-R20-02 Make Photos & references explicitly show what is used, unattached, reference-only and repeated from the same source.
  Source: USER
  Requirement: Every active media card states whether it is displayed by an artwork, unattached, or reference-only. Used cards name artwork/reproduction roles. Repeated active `sourceSha256` entries are visibly marked without merging/deleting them, with filters/counts for All, Used by artwork, Unattached, Reference only and Duplicates.
  Verified-By:
    - M09-R20-V01
    - M09-R20-V02
    - M09-R20-H01

- [x] M09-R20-P01 Preserve R19 duplicate-intake/project/media deletion semantics, R13/R18 editing/deletion behavior, source/private derivative retention and all public export/release boundaries.
  Source: DERIVED
  Requirement: This follow-up is presentation/interaction clarity only. Duplicate source records remain deliberate identities unless the owner explicitly removes them; no source bytes, derivatives, public catalogue records or release state are deleted or changed by the new labels/filters.
  Verified-By:
    - M09-R20-V01
    - M09-R20-V02

- [x] M09-R20-V01 Run full project verification after the follow-up.
  Source: DERIVED
  Covers:
    - M09-R20-01
    - M09-R20-02
    - M09-R20-P01
  Gate: INTEGRATION
  Command: npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
  Oracle: integration-or-end-to-end
  Expected: strict state validation, Astro build and all browser/non-browser tests pass, including the R19 protections and R20 contextual-feedback/media-clarity coverage.
  Result: PASS in the preceding checker-repair session:102/102tests,0fail/skip;statecheck VALID/PASS and Astro0errors/warnings/hints. This records the actual run already captured in M09-R20-V03, not a new run or coverage of the later stale-feedback defect.
  Repository-State: HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=46da71e71c6106892b552099d0e309e5fd0b75de11165386a96ad4b1294e519f
  Limitations:
    - Automated checks do not replace owner usability review.

- [x] M09-R20-V02 Verify contextual feedback and media classification/duplicate-display invariants.
  Source: DERIVED
  Covers:
    - M09-R20-01
    - M09-R20-02
    - M09-R20-P01
  Gate: CONSTRAINT
  Command: npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
  Oracle: property-or-invariant
  Expected: direct-action errors render in local action feedback rather than the global banner; media cards expose used/unattached/reference state, artwork+role where used, repeated-source badges and a duplicates filter while existing source-retention/deletion guards remain intact.
  Result: PASS: preceding full102/102 run includes the unchanged targeted R20 browser regression (real-pilot follow-up keeps action feedback local and makes media usage and duplicates explicit). It establishes tested placement/classification/deletion protections, not the newly reported stale-feedback lifecycle.
  Repository-State: HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=46da71e71c6106892b552099d0e309e5fd0b75de11165386a96ad4b1294e519f
  Limitations:
    - Duplicate display is active-state/source-hash reporting, not automatic deduplication or source-file cleanup.

- [x] M09-R20-H01 Owner reviews feedback placement and Photos & references clarity in normal Studio use.
  Source: USER
  Requires:
    - M09-R20-V01
    - M09-R20-V02
    - M09-R20-F1-V01
  Covers:
    - M09-R20-01
    - M09-R20-02
    - M09-R20-F1-01
  Gate: HUMAN
  Human-Decision: ACCEPTED
  Decision-Source: Owner's explicit 2026-10-23 review report in the current instruction.
  Acceptance-Scope: Attached-media removal refusal, filter changes clearing previous selections, fresh eligible batch removal, media usage/duplicate indicators and retention behavior. This is acceptance of the explicitly tested R20 functionality only, not final R20 closeout or M09/content/rights/release approval.
  Limitations:
    - The stale attached-media error surviving a later successful batch was newly observed and was NOT included in successful owner verification. Correction and new review are M09-R21; R20 final closeout remains contingent on that follow-up.
  Verification:
    - Trigger an intake/project/media error and ordinary confirmation; confirm feedback appears beside the relevant action rather than requiring a scroll to the global banner.
    - Review Photos & references with the All/Used/Unattached/Reference/Duplicates filters and confirm each card's usage/repeated-source meaning is understandable.
    - Confirm duplicate labels do not merge/delete intentional duplicate records and existing removal/source-retention behavior remains correct.

### M09-R20-F1 — Clear hidden media selection on filter changes

Source: USER, 2026-10-20. During R20 owner review, the owner demonstrated that batch removal itself works, but an attached-media removal error leaves that attached item selected. Switching filters hides the selected item without clearing it, so a later visible batch can be refused because the hidden attached item remains in the selection. The owner authorized the correction.

- [x] M09-R20-F1-01 Clear Photos & references selection whenever the active media filter changes.
  Source: USER
  Requirement: Moving between All / Used by artwork / Unattached / Reference only / Duplicates starts a fresh visible selection. A selected item that becomes hidden must not silently remain in `mediaSelection` or participate in later attach/remove actions. After an expected attached-media refusal, switching filters must clear that failed selection so a newly selected eligible visible batch can be removed normally.
  Verified-By:
    - M09-R20-F1-V01
    - M09-R20-H01

- [x] M09-R20-F1-P01 Preserve media deletion safety and source-retention semantics.
  Source: DERIVED
  Requirement: Filter changes only clear ephemeral UI selection. They do not delete media, detach artwork relationships, merge duplicate-source records, alter source/private derivatives or relax attached-media removal refusal.
  Verified-By:
    - M09-R20-F1-V01

- [x] M09-R20-F1-V01 Verify hidden-selection clearing and fresh batch removal after an attached-media refusal.
  Source: DERIVED
  Covers:
    - M09-R20-F1-01
    - M09-R20-F1-P01
  Gate: CONSTRAINT
  Command: npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
  Oracle: integration-or-end-to-end
  Expected: attached-media removal is refused locally; changing to another filter clears the prior selection; a newly selected multi-item eligible batch removes successfully; source-retention and duplicate-display behavior remain unchanged.
  Result: PASS: preceding full102/102 run reaches the R20 regression and verifies hidden-selection reset plus the two eligible records' actual removal. Stale feedback was not asserted by this version of the test and is not covered by this historical PASS.
  Repository-State: HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=46da71e71c6106892b552099d0e309e5fd0b75de11165386a96ad4b1294e519f
  Limitations:
    - This browser regression does not replace the full M09-R20-V01 suite or owner usability review.

### M09-R20 — Authorized checker compatibility repair

- [x] M09-R20-03 Correct obsolete project checker expectations for the already authorized framework release.
  Source: USER, current continuation authorization; tracked changes limited to this checker correction and required durable evidence. No commit/push, hosted CI changes/dispatch, dependency upgrades, unrelated implementation or human acceptance is authorized.
  Requirement: Independently verify the installed 1.2.2/e7e0f638 provenance, replace obsolete 1.1.5/6746415f expectations, avoid duplicated release constants where a separate project authority can be used safely, preserve existing validation guarantees, and run state validation plus full Node22.23.3/npm10.9.9 verification with the established browser cache.
  Verified-By:
    - M09-R20-V03

- [x] M09-R20-D01 Verify framework provenance and reconcile only the obsolete checker pin.
  Source: DERIVED from M09-R20-03.
  Requires:
    - M09-R20-03
  Conclusion: Framework 1.2.2/schema 2 at e7e0f638c70a7515afccfbdcbe44dfe2091f8095 is the authorized installed release; the project checker retained the superseded R17 1.1.5 pin.
  Conclusion-Status: VERIFIED
  Conclusion-Scope: HEAD=d01027d5ed280113db7f77aa805165452ed994a9, initially clean redesign/astro-foundation checkout; current framework identity only.
  Conclusion-Evidence:
    - M09-R20-V03
    - Project update commit e39c10a797bd631d6b672d13febd168a71f99ce8 records the 1.2.2 manifest and independently project-owned AGENTS.md release/commit pin plus the narrow owner update grant.
    - Read-only GitHub API for HurlyBurly91/durable-state-machine@e7e0f638c70a7515afccfbdcbe44dfe2091f8095 confirms the 1.2.2 release; all nine framework/experience-augmented file Git blob IDs equal this checkout's installed .durable-state/framework tree.
    - records/M09-R17-framework-1.1.5-main-update-checkpoint.md and commit234c05a show the old pin's historical provenance; later managed updates did not update scripts/durable-state-check.mjs.
  Conclusion-Limitations:
    - This provenance result is not application verification, R20 acceptance or permission to change updater-owned files.
  Conclusion-Recheck-On:
    - A managed framework update, project policy pin change, or payload/manifest identity change.
  Resolution: Checker derives expected release/commit from exactly one well-formed project-owned AGENTS.md pin and fails closed if absent/ambiguous. Fixed format/variant/schema/repository checks, payload hashing, ledger/experience/canonical checks remain; manifest/RELEASE agreement is additionally enforced. No runtime network trust or installed-framework edit. Only this checker and required TASKS evidence changed; no commit/push or acceptance transition.

- [x] M09-R20-V03 Verify the checker compatibility repair and retained rejection behavior.
  Source: DERIVED
  Covers:
    - M09-R20-03
  Gate: INVARIANT
  Command: npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
  Oracle: property-or-invariant
  Expected: Correct authorized identity passes; wrong/ambiguous/missing provenance, payload tampering and existing invariant failures remain rejected; full verification runs without changing application/tests/dependencies/CI or human gates.
  Result: PASS. Standalone npm run state:check and the full verify command both pass: strict framework validator VALID/0errors/0warnings; project checker PASS; Astro0errors/0warnings/0hints,13pages;102/102tests,0fail/skip including R20 hidden-selection/contextual-feedback/media clarity, R19 protections and Chromium/Firefox Studio regressions. No application/environment failures in this full run. The earlier missing Playwright1243 cache and obsolete checker pin were separate environment/framework integration failures, not application assertion defects.
  Repository-State: HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=46da71e71c6106892b552099d0e309e5fd0b75de11165386a96ad4b1294e519f
  Evidence:
    - Read-only upstream commit/RELEASE/tree queries and git show e39c10a/git ls-tree HEAD establish the independently authorized 1.2.2/e7e0f638 identity and nine matching framework blobs.
    - Same-runtime `node /tmp/opencode/jordannesbitt-checker-repair-probes.mjs` passed21/21 isolated cases; report `/tmp/opencode/jordannesbitt-checker-probes-fejWF4/report.json`. Rejected wrong version/commit, self-consistent updater-only replacement, absent/malformed/duplicate project pins, unsupported schema/repository, RELEASE mismatch despite recalculated hash, altered payload/invalid hash, duplicate/malformed manifest, wrong variant, mismatched headers, missing required file, invalid experience JSONL and broken canonical reference. Baseline and a synthetic coordinated project-policy same-schema pin update pass without duplicated checker constants.
    - `git diff --check` passes; installed framework/manifest, root policy, STATUS, application/source/tests, dependency manifests/lockfile and hosted CI have no diff. HEAD unchanged; two intended unstaged tracked modifications only.
  Limitations:
    - Local automation never supplies R20 owner acceptance; no commit or push is authorized.
    - Rejection probes are same-change generated fixture checks, not independent security proof; their disposable /tmp artifacts may be cleared. No real private owner data or installed framework was mutated by the fixtures.
    - This entry records current verification for the checker repair without declaring M09-R20 accepted/complete or changing its selected human gate. Final R20 owner review, including filter-switch after refused removal and fresh visible batch removal, remains outstanding.

## M09-R21 — Clear obsolete media-removal feedback

Studio correction closeout CLOSED2026-10-25. All R21 requirement/evidence/human tasks are verified within their recorded scope, including the latest authorized closeout checkpoint. Historical prior no-commit constraints and uncommitted-review evidence remain intact as provenance; the dated latest grant below governs publication. No other human gate is accepted.

Source: USER, 2026-10-23 owner acceptance of tested R20 functionality plus a newly observed stale-error defect. Re-entry to FOLLOW_UP before implementation. Scope: local removal-feedback lifecycle, the existing R20 browser regression and necessary durable/canonical evidence only. Preserve the existing uncommitted scripts/durable-state-check.mjs and TASKS.md repair. No dependency/hosted-CI changes or dispatch, unrelated refactor, commit/push, real-file deletion or public approval. Owner requests a verified uncommitted checkpoint for review; publication is not a prerequisite for this explicitly local review.

- [x] M09-R21-01 Clear obsolete removal errors when media selection/filter context changes or a removal succeeds, retaining relevant local persistent errors and appropriate alert/status semantics.
  Source: USER
  Requirement: Reproduce the actual refused-attached→filter change→two eligible selections→successful removal sequence; identify the complete cause before correcting it. No blanket global error clearing; errors stay beside their initiating action while relevant.
  Verified-By:
    - M09-R21-V01
- [x] M09-R21-02 Extend the existing R20 browser regression to prove stale-feedback clearance and preservation.
  Source: USER
  Requirement: Initial local refusal; obsolete error and selection cleared on filter change; exactly two new eligible selections; success with no stale failure; both eligible entries removed; attached record unchanged; later genuine persistent accessible failure. Cover selection-only changes and unrelated persistent errors to constrain clearing scope.
  Verified-By:
    - M09-R21-V01
- [x] M09-R21-P01 Preserve attachment refusal, selection/deletion semantics, source/private-derivative retention, public/export/security gates, and existing accepted local feedback behavior.
  Source: USER
  Verified-By:
    - M09-R21-V01
- [x] M09-R21-P02 Preserve prior uncommitted checker/ledger work, pinned dependencies, hosted CI and branch/history; no unrelated edits or commit/push.
  Source: USER
  Verified-By:
    - M09-R21-V02
- [x] M09-R21-03 Stop at the verified, reproducible uncommitted checkpoint for owner review without claiming final R20/M09 closeout.
  Source: USER
  Verified-By:
    - M09-R21-V02
- [x] M09-R21-04 Owner reviews the stale-feedback correction separately from the accepted R20 functionality.
  Source: USER
  Verified-By:
    - M09-R21-H01
- [x] M09-R21-D01 Reproduce and correct the scoped feedback lifecycle under the unchanged removal authority.
  Source: DERIVED
  Conclusion: The persistent action-group feedback node outlived its removal selection/filter context; renderMedia hid its parent without clearing the error, and successful removal wrote status to a separate Add images anchor. Selecting new photos resurrected the old error, including after an actual successful API200 removal.
  Conclusion-Status: VERIFIED
  Conclusion-Scope: Exact R20 synthetic browser sequence under Node22.23.3/npm10.9.9/Chromium153.0.8010.12 before and after this local UI correction.
  Conclusion-Evidence:
    - M09-R21-V01
    - Extended existing regression failed before the UI change with retained error after filter=true,visible on new selection=true,actual removalStatus=200,retained after success=true,visible after success=true. This is an application assertion failure, not a launch/environment problem.
    - Same targeted command passes1/1 after action-origin tagging and context/success-scoped removal-error clearing;all four stale-feedback indicators false,actual removalStatus=200. Persistent new alert after6500ms virtual time,selection-only/clear-selection paths,unrelated project+shared-group attachment errors,exact two IDs,unchanged attached record/catalogue/asset allowlist and source-upload/derivative hashes pass.
  Conclusion-Limitations:
    - While selection is empty the old error was hidden by its parent; its content persisted and became visible again when selection resumed. This does not assert it was continuously visible during the empty-selection interval.
    - Targeted and full browser proof is not new owner acceptance; M09-R21-H01 remains pending.
  Conclusion-Recheck-On:
    - Changes to action feedback anchors/timers, media selection/filter rendering or removal success handling.
- [x] M09-R21-V01 Run targeted R20, strict state validation/checker and complete project verification.
  Source: DERIVED
  Covers:
    - M09-R21-01
    - M09-R21-02
    - M09-R21-P01
  Gate: INVARIANT
  Command: npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
  Oracle: integration-or-end-to-end
  Expected: Original stale-feedback reproduction fails before correction; final targeted/full checks pass, retaining applicable accessible errors, exact deletion scope and source bytes.
  Result: PASS. Targeted browser regression1/1, strict framework validator VALID/0errors/0warnings and project state checker PASS; final complete verify102/102tests/0fail/skip, Astro0errors/warnings/hints and13pages. Final regression shows errorRetainedAfterFilter=false,staleErrorVisibleOnNewSelection=false,removalStatus=200,errorRetainedAfterSuccess=false,staleErrorVisibleAfterSuccess=false. All requested deletion/local-feedback/accessibility/retention assertions pass, plus unrelated project and shared-action-group attachment alerts remain persistent.
  Repository-State: HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=1041a739f9aa8c010505a3a2ebb8981a485d48d20e136f5657acf25c1a99bebb
  Evidence:
    - Targeted command: npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers node --test --test-name-pattern="real-pilot follow-up keeps action feedback local" tests/studio.test.mjs'. Failed before the UI fix on retained obsolete error, then passed unchanged after it.
    - Standalone state command with the same Node/npm wrapper: npm run state:check; both validators pass. Full suite preserves Chromium/Firefox existing Studio regressions and the actual release-check BLOCKED_CONTENT assertion.
    - First full run101/102: unchanged tests/quality.test.mjs long-page capture failed at Chromium Page.captureScreenshot (Unable to capture screenshot), not a Studio assertion. The test renders independent synthetic HTML without Studio code. Same-runtime targeted --test-name-pattern="long-page captures" tests/quality.test.mjs passed1/1, then identical full command passed102/102 without changing code/tests/environment flags. Observed intermittent capture-protocol failure; precise cause unconfirmed, not evidence that such failures cannot recur.
  Limitations:
    - Local automation does not accept the new UX correction or final R20/M09 closeout.
    - New feedback regression is Chromium/synthetic with controlled6500ms clock advances for persistent-error checks; existing cross-browser tests pass but no new full accessibility/colour or owner-content acceptance is claimed.
- [x] M09-R21-V02 Review intended diff and record exact uncommitted local review target.
  Source: DERIVED
  Covers:
    - M09-R21-P02
    - M09-R21-03
  Gate: CONSTRAINT
  Command: git diff --check; git status --short --branch; git rev-parse HEAD; git diff --cached --exit-code; git diff --exit-code -- scripts/lib src .durable-state package.json package-lock.json .github; git hash-object scripts/durable-state-check.mjs; python3 -B invocation of installed Validator.current_repository_state().
  Oracle: static-analysis
  Expected: Only authorized UI/test/docs/state changes plus intact prior checker repair; unchanged branch/HEAD/no commit/push/CI; exact local artifact identified.
  Result: PASS. Reviewed7intended unstaged paths:studio/app.js,tests/studio.test.mjs,docs/studio.md,STATUS.md,TASKS.md,records/M09-R20-studio-ux-clarity-checkpoint.md plus pre-existing scripts/durable-state-check.mjs. Checker blob remains b0efc08273cf4c9e83d726473a0960981bab0ef3 exactly as at task start; prior TASKS repair/provenance/fingerprint retained, not reset. Backend/public source/framework/dependencies/CI diff empty, index unchanged,no new commits/pushes or untracked artifacts. Active requestR21/Next-GateH01 selects this local uncommitted review under explicit owner grant; publication is neither performed nor required for this local gate.
  Repository-State: HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=1041a739f9aa8c010505a3a2ebb8981a485d48d20e136f5657acf25c1a99bebb
  Limitations:
    - Exact review target is this worktree, not the unchanged remote HEAD. Restart/reload Studio from this checkout to review. Later commit/push and final R20 closeout require separate authorization/decision; M09/content/rights/release gates remain unchanged.
- [x] M09-R21-H01 Owner confirms the obsolete error disappears and genuine local errors remain useful/persistent.
  Source: USER
  Requires:
    - M09-R21-V01
    - M09-R21-V02
  Covers:
    - M09-R21-04
  Gate: HUMAN
  Human-Decision: ACCEPTED
  Decision-Source: Explicit OWNER DECISION dated2026-10-25 in the current user instruction, followed by confirmation of the required HIGH effort gate.
  Acceptance-Scope: All five manual checks PASSED: attached-media removal refused; filter changes clear obsolete selection/removal error; eligible unattached batch removal succeeds; selecting another photo never resurrects the old error; a new genuine refusal produces persistent accessible feedback.
  Limitations:
    - This acceptance is only M09-R21-H01. It does not accept other human gates, actual artwork facts/rights/curation/colour, M09 completion, M10 release or publication. R20 primary functionality retains its separate2026-10-23 acceptance.
  Verification:
    - Repeat attached refusal→filter change→fresh eligible two-photo removal; no old error returns on the next selection, and a fresh genuine refusal remains local and accessible.
    - R20-H01's 2026-10-23 acceptance remains limited to its stated functionality; no new acceptance or final closeout is inferred.
  Review-Target: HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=1041a739f9aa8c010505a3a2ebb8981a485d48d20e136f5657acf25c1a99bebb
  Startup: npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run studio'

### M09-R20/R21 — Authorized acceptance closeout, 2026-10-25

Latest owner grant supersedes the preceding no-commit/push stop condition only for the six Studio correction/closeout files:studio/app.js,tests/studio.test.mjs,docs/studio.md,STATUS.md,TASKS.md,records/M09-R20-studio-ux-clarity-checkpoint.md. Historical no-commit instructions/evidence above describe their original checkpoint and are preserved. scripts/durable-state-check.mjs is explicitly excluded from staging and editing; its prior implementation/evidence stays in this worktree. No other human gate, branch, dependency, hosted workflow, private data or release boundary is authorized to change.

- [x] M09-R21-05 Complete the accepted R20/R21 Studio closeout and publish only the authorized checkpoint.
  Source: USER,2026-10-25.
  Requirement: Preserve earlier TASKS repair evidence and excluded checker bytes; run strict validation and the exact bounded Node22.23.3/npm10.9.9 full verify command; review/stage exactly the six authorized files, commit/push only redesign/astro-foundation without force, and report remaining dirty state/M09 gates plus an existing content-curation next task. No new substantial M09 implementation or deployment/Actions dispatch.
  Verified-By:
    - M09-R21-V03
    - M09-R21-V04
- [x] M09-R21-D02 Reconcile accepted request coverage, scoped publication and remaining M09 human gates.
  Source: DERIVED from M09-R21-05.
  Resolution: Required strict/full verification passed and exact six-file checkpoint0fa460964e14fe7344b40ea3102d4035e9f0a139 committed/pushed/remote-equal. No application/test change was needed during closeout. Excluded checker remains unstaged at b0efc08273cf4c9e83d726473a0960981bab0ef3; earlier ledger repair evidence retained. Next existing M09-R5-H01 is selected without acceptance or new implementation; all other pending gates preserve their status. The restored disposable browser cache and earlier intermittent capture evidence remain documented, not conflated with application acceptance.
- [x] M09-R21-V03 Verify the accepted closeout on the actual preserved local worktree.
  Source: DERIVED
  Covers:
    - M09-R21-05
  Gate: INTEGRATION
  Command: timeout --kill-after=10s 10m env PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
  Oracle: integration-or-end-to-end
  Expected: Strict framework validation/project checker/build/full tests pass with the existing checker repair; no oracle weakening; actual prior/current intermittent failures remain reported.
  Result: PASS. Exact bounded owner command exits0:102/102tests,0fail/cancel/skip; strict framework validator VALID/0errors/0warnings,project checker PASS,Astro87files/0errors/0warnings/0hints,13pages. R20 stale-feedback flags allfalse,actualremovalStatus200;Chromium+Firefox regressions and unchanged long-page capture pass. Standalone python3 -B .durable-state/framework/validator.py --strict . and git diff --check also exit0. No current verification failure or test/source adjustment; prior101/102 intermittent Page.captureScreenshot failure and its earlier successful isolated/full reruns remain in V01 and the checkpoint record.
  Repository-State: HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=1041a739f9aa8c010505a3a2ebb8981a485d48d20e136f5657acf25c1a99bebb
  Limitations:
    - Verification includes the explicitly excluded uncommitted checker repair. A clean checkout of the scoped commit still has the obsolete 1.1.5 checker expectation; do not claim standalone committed-checker verification or silently include the repair.
- [x] M09-R21-V04 Publish and verify the exact authorized Studio closeout scope.
  Source: DERIVED
  Covers:
    - M09-R21-05
  Gate: CONSTRAINT
  Command: git diff --check; exact staged diff/path/blob review; git commit; git push origin redesign/astro-foundation; local/remote HEAD and excluded-checker/index/worktree verification.
  Oracle: static-analysis
  Expected: Only six authorized code/test/docs/state files committed; development remote equals actual checkpoint; checker remains byte-identical, unstaged and uncommitted; no private media/unrelated work/protected-ref changes or unnecessary Actions.
  Result: PASS. Commit/push0fa460964e14fe7344b40ea3102d4035e9f0a139 (Close accepted R20 and R21 Studio feedback fixes) exits0; development remote equals actual local checkpoint. Exact paths:studio/app.js,tests/studio.test.mjs,docs/studio.md,STATUS.md,TASKS.md,records/M09-R20-studio-ux-clarity-checkpoint.md. Index is empty; only remaining modified path scripts/durable-state-check.mjs,worktree blob b0efc08273cf4c9e83d726473a0960981bab0ef3 vs unchanged committed blob a0991a1f8fa25183a2d2f0e2fd0fe67521cdecc1. No private data, dependency/workflow/backend/public-source edits, forced operations or hosted dispatch; master9add7fefbaa2817d974c7c2ba6517ba5b2ecec7c and backup3bc95c75bbe85918ce10498af31a751e2cf58fc6 remain as at closeout start. Final durable metadata records this actual publication and selects the pre-existing pilot review gate; no new code/content work.
  Repository-State: HEAD=0fa460964e14fe7344b40ea3102d4035e9f0a139; DIFF-SHA256=962d9dd37d76e0a468003887b3ff7b5f972c1c0c441641f73201538f994085a7
  Limitations:
    - Local full verification includes the expressly excluded checker repair; pure scoped-commit checkout retains the obsolete-checker blocker. A separate future checker commit still needs authorization; it was neither staged nor changed here. Publication is a development checkpoint, not M09 completion or M10/public website release.

## M09-R22 — Review saved Studio curation, not the automatic pilot sample

Source: USER,2026-10-25 feedback on M09-R5. Persisted before preview preparation. Read-only inspection already completed; no artwork mutation/reimport/duplication performed. No new commit/push grant; preserve the outstanding checker repair and original pilot evidence. Existing private Studio preview is preferred to new application functionality.

- [x] M09-R22-01 Prepare the next private review from actual saved Studio artwork records and exact saved Selected Work order/project memberships/homepage lead, reusing existing preview capabilities where sufficient.
  Source: USER
  Verified-By:
    - M09-R22-V01
- [x] M09-R22-P01 Preserve existing presentation, original pilot evidence, all artwork identities/records/media/notes/curation and the authoritative registry. Do not reimport, duplicate, delete, overwrite or fabricate artwork/project/lead data.
  Source: USER
  Requirement: Saved artwork data/curation must remain exactly equal. Any normal preview-history/revision bookkeeping from the existing builder must be explicitly identified and distinguished from artwork mutation; no artwork save/intake/delete/curation/export/review-approval endpoint is authorized.
  Verified-By:
    - M09-R22-V01
- [x] M09-R22-P02 Keep real records/derived review artifacts private and persistent, preserve unrelated checker work, and retain all M09/source/privacy/export/security/release boundaries.
  Source: USER/project policy
  Verified-By:
    - M09-R22-V02
- [x] M09-R22-02 Return M09-R5-H01 to pending review of a precisely identified saved-curation artifact, recording only the owner's partial presentation approval.
  Source: USER
  Verified-By:
    - M09-R22-V02
- [x] M09-R22-D01 Inspect existing saved state/preview capability and reuse it without changing the owner's artwork data.
  Source: DERIVED
  Conclusion: Existing Studio preview is sufficient; no new application feature or sampling/ingestion pipeline is needed. Inspected revision138 has10active artworks,5ordered Selected Work entries,0active projects and0homepage leads; all7older previews were stale. The new protected build reproduces these saved fields exactly and adds only preview history/revision139. Missing projects/lead stay missing,not reconstructed or arbitrarily filled.
  Conclusion-Status: VERIFIED
  Conclusion-Scope: Read-only authoritative /home/jordan/.local/share/jordannesbitt-art/m09/studio/state.json and existing studio-preview/studio-store/server capabilities at HEAD9069f4936bf3defa5e4c8db521b3c2e2eca75d1f.
  Conclusion-Evidence:
    - M09-R22-V01
    - Code-only inspection helper /tmp/opencode/jordannesbitt-inspect-saved-curation.mjs parsed only the specified state file,computed the same catalogue/assets digest as the existing store and checked all registered preview sites. Counts/diagnostic result observed,not human curation approval; no record/private artwork facts copied into Git.
    - buildStudioPreview clones canonical records only for isolated PRIVATE rendering; it does not call intake/artwork save/curation/export. It registers preview history through the ordinary store transaction; logical artwork/curation equality and any administrative changes will be audited before/after.
  Conclusion-Limitations:
    - Visual presentation acceptance is not source/rights/metadata/physical-colour approval. Actual projects/lead are currently absent; do not claim they are configured or restore deleted data.
    - Current real catalogue has no active project or homepage lead,so the actual review proves their honest absence; existing synthetic regressions retain non-empty relationship/lead support. No automatic merging,normalization save or content approval was performed.
  Conclusion-Recheck-On:
    - A saved Studio catalogue/asset change, different data root, preview adapter or source-artwork mutation.
- [x] M09-R22-V01 Verify exact saved-curation reproduction and preservation using existing private preview.
  Source: DERIVED
  Covers:
    - M09-R22-01
    - M09-R22-P01
  Gate: INVARIANT
  Command: Scoped existing Studio preview build/open plus before/after private state/registry/original-pilot integrity and rendered ordering/record checks.
  Oracle: property-or-invariant
  Expected: Saved records/counts/order/projects/lead exactly reproduced without an arbitrary sample; presentation unchanged; no original data/evidence/registry/asset mutation,with only normal explicit preview bookkeeping if needed.
  Result: PASS. Existing protected /api/preview/build produced preview1f6b4aff-5fee-4a96-a998-5a61d5be68e9 from saved revision138. All10saved object routes200/private-disclosed;homepage and Work exactly match5saved Selected Work entries/order,Archive10,projects0,lead0 with missing-lead marker preserved.18page/viewport checks at1440/360×900,DPR1/scale1,36PNGs,0observedaxe violations/incomplete/reflow; actual home/mobile selection frames inspected. Deep equality of all owner state except permitted revision/previews holds; revision increment138→139 and exactly one preview appended,artworks/curation/media/assets/notes/workflow/deletion/export state unchanged. Registry bytes,all asset hashes,upload tree and entire original pilot package tree digest preserved; no ingestion/source reencoding/ID allocation or artwork save/delete/curation/export/approval endpoint. Reopening this registered preview via existing protected /api/preview/open passes with live Studio return URL and state/registry bytes unchanged,not another build.
  Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=b4bcbcfb0fc25bf81a97d9d18a2038b2638a19e892f3bbfae75730a44f7e1e58
  Evidence:
    - Code-only helper /tmp/opencode/jordannesbitt-review-saved-studio.mjs invoked under Node22.23.3/npm10.9.9 with established Playwright cache; actual saved metadata/report/screenshots remain persistent/private at the Review-Target,not in temporary/public Git storage.
    - Independent existing regressions: same-runtime node --test --test-name-pattern="studio canonical drafts|studio preview uses actual components" tests/studio.test.mjs passes2/2,including identity/ordering/projects/lead and production-boundary checks. No application or test code modified.
    - Private report.json binds saved catalogue digest/actual IDs/order/source revision/current preview and source preservation; SERVE.txt invokes the code-only private serve.mjs bridge to existing startStudio and /api/preview/open. It refuses a stale saved-catalogue digest or active intake,uses ordinary lock protection and never reimports/resaves artwork. --check run passes with byte-identical state and registry.
  Limitations:
    - Focused Chromium review,not a new full102-test run/full WCAG/physical-colour or human content acceptance. Existing presentation/components/pinned tooling remain unchanged. Normal build registration changes only preview bookkeeping; source Studio state was not falsely described as entirely byte-unchanged after building.
- [x] M09-R22-V02 Identify the private review target and validate the durable handoff/preservation boundaries.
  Source: DERIVED
  Covers:
    - M09-R22-P02
    - M09-R22-02
  Gate: CONSTRAINT
  Command: npm run state:check; git diff --check; scoped source/checker/private-artifact/loopback serving checks and repository-state fingerprint.
  Oracle: static-analysis
  Expected: Exact target and limitations recorded outside public Git; prior checker intact; no app/publication/dependency/CI/commit/push change; R5-H01 remains pending actual curated-content review.
  Result: PASS. Real artifacts remain outside public Git under the exact saved-curation Review-Target and original Studio/previews path. Live-loopback/noindex rendering/return and refused publication flags preserved by unchanged existing adapters. No app/src/backend/tests/dependency/framework/CI diff; HEAD remains9069f4936bf3defa5e4c8db521b3c2e2eca75d1f,no commit/push or staged files. Excluded checker blob remainsb0efc08273cf4c9e83d726473a0960981bab0ef3. Only STATUS/TASKS/original R5 record gain requirement/partial-feedback/target evidence; private data/titles/order stay outside Git. Strict validator/project checker/diffcheck verified for final local handoff; R5-H01 selected pending,other gates remain unresolved.
  Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=b4bcbcfb0fc25bf81a97d9d18a2038b2638a19e892f3bbfae75730a44f7e1e58
  Limitations:
    - Local review artifact only; no commit/push or public-source/deployment/rights/metadata approval. R5-H01 remains pending actual curated content and the old manual contrast gates are unresolved.
    - Focused existing regressions and real saved-data checks are current; the prior full102-test pass remains historical,not falsely rerun for this metadata-only handoff.

## M09-R23 — Minimal five-work initial candidate and exact disclosure boundary

Source: USER,latest M09 initial-release instruction and explicit HIGH confirmation before execution. Requirements persisted before implementation/private mutation. No new editorial quota,infrastructure,hosting migration or optional-fact obligations. Current HEAD9069f4936bf3defa5e4c8db521b3c2e2eca75d1f/origin match; four expected dirty files/index empty. Preserve prior checker blobb0efc08273cf4c9e83d726473a0960981bab0ef3 and all R5/TASKS evidence. Existing private Studio139 has10artworks/5selected/0projects/no lead; all five lack source approvals; no active intake.

- [x] M09-R23-01 Prepare exactly w-0184,w-0183,w-0178,w-0175,w-0180 in that order with w-0184 as lead and zero projects,using existing Studio identities and unchanged date/media/material/process/primary-image bytes/aspect ratios.
  Source: USER
  Verified-By:
    - M09-R23-V01
- [x] M09-R23-02 Prepare honest neutral Untitled proposals for the two unsupplied titles and concise image-inspected alt proposals; preserve final owner visibility/approval. Resolve only actual schema/accessibility/export blockers,not optional catalogue completeness.
  Source: USER
  Requirement: Object-kind field currently unclassified is a real existing source-approval guard; any proposed original/original-print classification stays explicitly provisional until the consolidated owner decision. Do not invent subject identities,provenance or approval.
  Verified-By:
    - M09-R23-V01
- [x] M09-R23-03 Prepare owner-approved draft About verbatim privately; identify the one missing public email without inference from notes/Git. No prices/offers/commerce; unknown availability and absent descriptions/dimensions/edition facts remain valid.
  Source: USER
  Verified-By:
    - M09-R23-V01
- [x] M09-R23-04 Produce an exact five-record/media disclosure packet and real-content local preview; preserve canonical digests,review/source approval,dry-run/runtime write grants and release checks. Stop before public artwork/derivative writes or manifest approval.
  Source: USER
  Verified-By:
    - M09-R23-V02
- [x] M09-R23-05 Correct only demonstrated release-blocking implementation issues and verify reproducibility/applicable full tests and real routes/layout/metadata/accessibility/ordering/privacy without weakening negative oracles.
  Source: USER
  Requirement: Investigate duplicate document titles for two legitimate Untitled works and production tests that explicitly require an empty public catalogue. Reproduce privately before any fix; keep empty/fixture/hidden-content negative tests and isolate synthetic fixtures from actual content. No redesign or new authoring/hosting feature.
  Verified-By:
    - M09-R23-V02
- [x] M09-R23-P01 Preserve unrelated dirty work,unchosen Studio records/notes/registry/uploads/derivatives/old evidence and all source bytes; do not reimport/delete/reallocate/duplicate artwork identities or overwrite concurrent work.
  Source: USER
  Verified-By:
    - M09-R23-V01
- [x] M09-R23-P02 No public record/derivative export,manufactured review/rights approval,launch manifest,commit/push/merge/CI dispatch/DNS/deploy/hosting migration/M10/M11. Keep jordannesbitt.com/existing GitHub Pages where feasible and accepted design/Studio.
  Source: USER
  Verified-By:
    - M09-R23-V02
- [x] M09-R23-06 Obtain one minimal consolidated decision on exact proposals/rights/public-source disclosure and the public recipient; broader presentation need not be reopened. Local preparation is not publication approval.
  Source: USER
  Verified-By:
    - M09-R23-H01
- [x] M09-R23-D01 Prepare the candidate safely through canonical local operations and existing preview/export interfaces.
  Source: DERIVED
  Resolution: Canonical version-checked preparation139→146,10existing identities,verbatim private draft About,requested lead/intention and exact order. Five title/alt/kind proposals remain explicit and unapproved;dates/media/material/process/reproduction bytes and other records/workflows/notes/registry/assets/history unchanged. Canonical full preview supports later ordinary review guards;isolated exact-five view reuses the existing renderer/digest/asset interfaces,not an alternative approval model. No markReviewed/approve/executeExport event;normal prepareExport refuses before any plan/token. Details/backups/digests stay private in the identified candidate directory.
- [x] M09-R23-D02 Reproduce and correct genuine real-content verification blockers without unrelated refactoring.
  Source: DERIVED
  Final-Evidence: M09-R23-V02 records completed106-test code integration,4actual-output candidate checks and50real browser checks; the progress sequence below is historical,not pending machine work.
  Resolution: New synthetic two-Untitled regression failed before metadata fix,then passed: neutral stable ID disambiguates only document/social title,not authored heading/slug. Isolated actual-five build passed output integrity but three old production tests failed their empty-catalogue assumptions; test oracles now follow exact canonical public routes/assets/lead/contact and retain explicit controlled-empty negative cases. Isolated synthetic roots reset catalogue arrays before caller data,avoiding real-content contamination. Actual release CLI now mirrors current gate while a controlled-empty case still must fail. A test-only publicAssets import-name typo and private diagnostic relative-output-directory mistake were corrected,not attributed to application failure or used to weaken an oracle. After correction,private actual-five output checks pass; full suite and browser evidence next.
- [x] M09-R23-V01 Verify private preparation and preservation against saved baseline.
  Source: DERIVED
  Covers:
    - M09-R23-01
    - M09-R23-02
    - M09-R23-03
    - M09-R23-P01
  Gate: INVARIANT
  Command: Version-checked private preparation; canonical schema/digest/asset hash checks; before/after state/registry/upload/derivative/unchosen-record assertions; actual five-image inspection.
  Oracle: property-or-invariant
  Expected: Exact candidate/source integrity/proposals/About,all optional absent/unknown facts valid,no false approval or unrelated record changes.
  Result: PASS. Requested five IDs/order/lead,zero projects,private owner-approved draft About;optional descriptions/dimensions/editions remain absent and unknown availability unchanged,no prices/offers. Deep equality preserves all date/media/material/process/slug/alias/reproduction pixels/variants,unchosen records/workflows,notes/media/assets/jobs/tombstones/export plans. Registry/upload tree/all derivative hashes/old evidence match baseline. Source139→146 only authorized preparation/preview operations;10identities retained,all5local-review/source-rights markers null. Standard dry-run correctly refuses missing approval with unchanged state and no plan/token;public arrays/media/manifest untouched. Private preservation.json/backups/packet contain actual values and comparisons,not public copies.
  Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=a03883509950968c25f44b446da4de3c584a591bec2baf6d083100a4dca7dab2
  Limitations:
    - This verifies preparation/proposals,not final factual kind/title/alt or source/rights acceptance. Public email remains genuinely missing.
- [x] M09-R23-V02 Verify candidate routes,source boundaries,technical corrections and uncommitted handoff.
  Source: DERIVED
  Covers:
    - M09-R23-04
    - M09-R23-05
    - M09-R23-P02
  Gate: INTEGRATION
  Command: Focused negative/positive regression; strict state/project checks; full npm run verify under Node22.23.3/npm10.9.9 and established browsers; private real-content route/image/metadata/contrast checks; git diff --check and source-boundary audit.
  Oracle: integration-or-end-to-end
  Expected: Actual preview is exactly five works/lead/order/About,no private labels/paths/notes/masters/extra works/offers or broken assets; correction/tests preserve mandatory guards. Clean-checkout limitation of the still-uncommitted checker is explicitly reported,not falsely claimed fixed by a commit. Standard export stays refused until real source approval; no manifest manufactured.
  Result: PASS within preauthorization scope. Exact-five output18HTMLpages/576refs/26images/maxJS2049bytesgzip,all references/assets/metadata valid,unique document titles and unchanged display headings/URLs.50real Chromium153.0.8010.12/Firefox155.0page/viewport checks at1440/768/360(as recorded),DPR1/scale1:Home lead/Work order/Archive5/About verbatim,five artwork routes,missing-contact handling,no offers/extra records/private labels/paths/notes.0confirmedaxe/reflow violations;10opened-mobile contrast INCONCLUSIVE findings retained,fit/larger/Escape/focus tested. Actual Home/object/About frames inspected. Read-only launcher5route smoke/state-byte/output-digest checks pass.
  Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=a03883509950968c25f44b446da4de3c584a591bec2baf6d083100a4dca7dab2
  Evidence:
    - New duplicate-Untitled regression failed before metadata fix then passed;publication6/6 PASS. Real five-record production-like build reproduced stale empty-site assumptions;adapted actual-output/CLI checks4/4 PASS. Controlled-empty catalogue/professional/release and unpublished/fixture/orphan/symlink/corrupt/schema/budget negatives retained. Test import typo and diagnostic relative-dist mistake corrected,not called application/environment failures.
    - Fresh local code-only clone at9069f4 reproduces obsolete committed checker failure. Unchanged pending checker b0efc08273cf4c9e83d726473a0960981bab0ef3 alone makes strict state pass. Prepared code overlay,locked npm ci and bounded npm run verify under22.23.3/10.9.9 PASS106/106,0fail/skip/diagnostics. No private artwork enters that clone. Persistent clean-install/clean-verify/clean-checkout-verification files bind actual run/patchSHA11e6f888b69dde5b47cdbde8341d34504e903acc283ed4c88e7310ffacf66333.
    - Real production-like candidate release guard correctly stops on owner manifest and public recipient/construction marker only. No fake manifest/recipient;actual public checkout still empty. Existing preview/export/review/source/path/branch/runtime/typed-confirmation guards unchanged;no dependency/framework/CI/public-content/media diff,checker/R5 work retained,index empty/no commit/push,diffcheck PASS.
  Limitations:
    - Full106is independently installed code-overlay integration;real candidate separately passes actual-output tests and50browser checks. Not a clean-committed-HEAD PASS. Reverify actual public source after authorized export.
    - INCONCLUSIVE contrast is not a pass/full-WCAG/physical-colour or human approval. Mandatory manual/release gates persist;no source authorization/manifest or valid export token is fabricated.
- [x] M09-R23-H01 Owner authorizes the exact proposed record/media public-source disclosure and supplies public contact.
  Source: USER
  Requires:
    - M09-R23-V01
    - M09-R23-V02
  Covers:
    - M09-R23-06
  Gate: HUMAN
  Review-Target: /home/jordan/.local/share/jordannesbitt-art/m09/reviews/five-work-release-candidate-2026-10-25-r23 (SERVE.txt,AUTHORIZATION.md,authorization-request.json,candidate.json,proposed-export/). Exact candidate preview2cdbb611-6072-439b-a1b3-65c3b5debf2f;canonical Studio preview6351fa3d-eaa6-4123-bc1a-12e74c684f5a for ordinary review guards. Source146 and inspected output checksum-bound;launcher refuses stale source/output.
  Disclosure-Target: Artwork packet SHA2564cb9a322f821f22bd4d614eb90991483e8b71f3d83910f73f8abe2cc6542d9b7;64managed proposed changes(src/content/artworks.json+63unchangedderivatives/14550989bytes),projects already[],professional/About-contact separate pending public email. All actual facts/paths/hashes are private in the packet.
  Human-Decision: ACCEPTED
  Decision-Source: Latest explicit owner message approves M09-R23-H01 titles/object kinds/five alt texts,confirms necessary reproduction rights for the five artworks/selected photographs,and authorizes PUBLIC SOURCE disclosure at the exact packetSHA above. The final actual address following the template placeholder is the supplied public email;label Email. Exact address/contact provenance are recorded privately,not inferred from Git/notes.
  Acceptance-Scope: Exact five canonical artwork records and63derivatives at the cited digest;canonical local review/source approval and actual export dry-run are now delegated. No actual export/runtime write grant,typed execution confirmation,commit/push,launch manifest or deployment authority. Earlier descriptions of pending proposals/contact are historical preapproval evidence,not current missing input.
  Limitations:
    - Other M09 content/manual contrast/release gates and M10/M11 remain unchanged. Approval is real owner authority,not acceptance inferred from tests/schema or a manufactured event.
  Verification:
    - One bounded decision approves/corrects the prepared Untitled/kind/alt proposals and exact five records/photographs/derivative checksums with reproduction/public-source rights,plus exact public email. Saved dates/materials/order/lead/zero projects and approved draft About are already instructed,not new questions.
    - Source approval must subsequently be recorded through current-record review/digests and explicit disclosure; real dry-run/typed write grant remain separate. No final manifest,M09 closeout or M10/M11 acceptance inferred.

### M09-R23 — Canonical approval and actual dry-run continuation

- [x] M09-R23-07 Verify the approved packet/current records,save the explicitly supplied public contact privately,record canonical review/rights/source approvals,and prepare the actual dry-run without executing it.
  Source: USER,latest explicit approval/continuation.
  Requirement: The bracketed template placeholder is not the recipient;use the actual final supplied email with label Email. No artwork metadata/image change or new editorial decision is authorized/needed. Contact changes global preview digest,so build a current normal preview before markReviewed/approve. prepareExport must be the final state transaction so its revision remains current.
  Verified-By:
    - M09-R23-V03
- [x] M09-R23-P03 Keep runtime repository writes disabled and never execute export,commit,push,deploy or manufacture a manifest/other human acceptance. Preserve exact approved art/media,other records,registry,uploads,public targets and earlier dirty work.
  Source: USER
  Verified-By:
    - M09-R23-V03
- [x] M09-R23-08 Obtain separate actual-plan/runtime/typed source-write authorization before executing any export.
  Source: USER stop condition plus unchanged canonical export contract.
  Verified-By:
    - M09-R23-H02
- [x] M09-R23-D03 Perform only the newly delegated canonical approval/dry-run operations.
  Source: DERIVED
  Resolution: PacketSHA4cb9a322f821f22bd4d614eb90991483e8b71f3d83910f73f8abe2cc6542d9b7 reconstructed exactly;live five per-record/media digests and63derivative byte hashes match. Real current owner authority recorded privately,contact added with label Email,fresh canonical preview36ce0180-4aee-4e0c-8ab2-44ee9a3ac9ea built for the contact-updated digest,then markReviewed/approve invoked only for the authorized five. Actual prepareExport ran last with allowPublicExport=false. Source146→159;plan159 is current. Other records/workflows/notes/media/assets/registry/uploads and public metadata unchanged. No executeExport call or fake event;earlier packet pending-state descriptions remain historical.
- [x] M09-R23-V03 Verify canonical approval/dry-run scope and unchanged public-source boundary.
  Source: DERIVED
  Covers:
    - M09-R23-07
    - M09-R23-P03
  Gate: INVARIANT
  Command: Existing canonical private Studio review/approve/prepareExport plus digest/file/revision/retention checks;focused export approval/staleness/guard regressions;strict state validation/project checker and git diff --check.
  Oracle: property-or-invariant
  Expected: Explicit approval is recorded only for unchanged authorized records/media;current valid real dry-run64files matches the owner packet with repositoryWritesEnabled=false;public targets/source bytes/unchosen data unchanged. No actual export,code/dependency/CI change or new permission.
  Result: PASS. Actual token960d47eb-bdbd-4be8-a338-5cb825b86805,current source/plan revision159,global digest current,all5canonical reviewed/approved digests equal owner-authorized values with disclosure/rightsConfirmed=true. Exact64path/hash/byte/kind tuples match approved packet;all staged files rehashed. Metadata17132bytes +63derivatives14550989bytes. dryRun=true,repositoryWritesEnabled=false,launchManifestCreated=false,deploymentAuthorized=false,export not executed. Registry/uploads/derivative bytes/public source unchanged;no new source code/dependency/framework/CI changes. Focused existing public-export approval/runtime/rollback and stale-target/branch/symlink regressions2/2 PASS;strict framework/project state checks/diffcheck PASS.
  Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=a03883509950968c25f44b446da4de3c584a591bec2baf6d083100a4dca7dab2
  Evidence:
    - Private source-approval-dry-run-01 contains real owner-decision/progress/actual-dry-run/result/preservation checks and DRY-RUN.md;canonical plan is Studio exports/960d47eb-bdbd-4be8-a338-5cb825b86805/plan.json. Old request artifact was not rewritten to pretend approval preceded the actual owner message.
    - Standard existing methods and locks/validation were used;Contact is saved privately only and current canonical preview supports actual review guard. Original artwork metadata remains byte-equivalent canonical values;only contact/preview/workflow approvals/export-plan/revision bookkeeping changes. Exact public email originates in the current user's final address,not the bracketed placeholder or a private/Git lookup. No message sent.
    - Prepared professional metadata is separate:src/content/professional.json,552bytes,SHA256e85aadc74c9266b7eb00e733a02460872afd6b7adea0d401d177da22477cc30f. It is NOT part of this Studio plan and was not written publicly;any actual write needs a distinct explicit scope. No launch manifest or source-export journal execution was created.
  Limitations:
    - This continuation is not actual repository writing,M09 final acceptance or permission to skip later runtime/typed execution or release checks.
    - No new full106-test run is claimed for metadata-only approval operations;prior same-code integration evidence remains. Actual source and all broader manual/release gates must be rechecked at the appropriate subsequent write/release step.
- [x] M09-R23-H02 Owner reviews the actual dry-run and separately authorizes exact source writing/runtime grant and typed confirmation if desired.
  Source: USER/DERIVED from explicit stop condition and existing export contract.
  Requires:
    - M09-R23-V03
  Covers:
    - M09-R23-08
  Gate: HUMAN
  Review-Target: /home/jordan/.local/share/jordannesbitt-art/m09/reviews/five-work-release-candidate-2026-10-25-r23/source-approval-dry-run-01/DRY-RUN.md and actual-dry-run.json;canonical private exports/960d47eb-bdbd-4be8-a338-5cb825b86805/plan.json. Current159 revision verified,64files exactly bound to accepted artwork disclosure;no source writing active.
  Required-Execution-Confirmation: EXPORT 960d47eb-bdbd-4be8-a338-5cb825b86805
  Human-Decision: ACCEPTED
  Decision-Source: Latest owner message is exactly EXPORT 960d47eb-bdbd-4be8-a338-5cb825b86805,after HIGH confirmation and a read-only preflight explicitly withholding writes until this separate token. Prior owner execution instructions conditionally grant enabling existing --allow-public-export after that exact authorization. The token merely appearing in an instruction was not treated as assent.
  Execution-Scope: Only the current canonical64-file plan for5approved artworks/63derivatives,disclosureSHA4cb9a322f821f22bd4d614eb90991483e8b71f3d83910f73f8abe2cc6542d9b7. professional.json is expressly prohibited;no commit/push/deploy/DNS/hosting/manifest or M10 authority. Actual completion evidence follows execution,not this acceptance entry.
  Execution-Completion: Canonical executeExport completed once and verified by M09-R23-V04/M09-R24-V01;complete journal,all64file hashes match,private159→160 with5exported markers. Token is consumed,not a new execution invitation. All remaining permission/release boundaries remain unchanged.
  Original-Preauthorization-Stop: Explicit runtime --allow-public-export and exact typed execution grant were missing before the accepted exact token above. Professional-source write remains excluded;no commit/push/deploy permission. Any subsequent Studio transaction or public target change can stale this plan;recheck/reprepare rather than overwrite.
  Verification:
    - Review the actual fresh plan/token/files,then explicitly grant --allow-public-export and the exact EXPORT <token> confirmation before any executeExport call. No professional/manifest/commit/push/deploy action is silently bundled;remaining authorizations stay separate.

### M09-R23 — Exact authorized export execution

- [x] M09-R23-09 Execute only the authorized current canonical plan and verify every resulting approved file/hash and all unrelated/private preservation.
  Source: USER,exact token and preceding conditional execution instructions.
  Requirement: Revalidate immediately/under the store lock;enable existing runtime grant for this process only;call executeExport with exact confirmation and no bypass. Stop on stale revision/digest,target/approval mismatch,journal conflict,unsafe path or unexpected worktree. Preserve source image bytes. No professional/manifest/other public content or unrelated dirty work included.
  Verified-By:
    - M09-R23-V04
- [x] M09-R23-D04 Perform the bounded canonical write and actual-public-data verification.
  Source: DERIVED
  Resolution: Exact revalidation/canonical execution64files/complete journal/159→160 and5exported markers verified;2,679private existing files unchanged except state,only journal+original-metadata backup added. Public professional/projects,registry/unchosen data and prior work preserved. Actual-public-data full106/106 PASS after one related isolated-fixture media cleanup;negative assertions/exporter unchanged. Pre-export V01–03 retain original fingerprints;post-boundary current proof is R24. Stop with professional/manifest/manual/commit/deploy still outside grant.
- [x] M09-R23-V04 Verify exact executed scope,retention,journal and actual approved-public-data validation.
  Source: DERIVED
  Covers:
    - M09-R23-09
  Gate: INTEGRATION
  Command: Canonical executeExport with actual runtime grant/exact owner token;all written SHA256/byte/allowlist and before/after private/Git assertions;strict state/full npm run verify under22.23.3/10.9.9;independent release check and git diff --check.
  Oracle: integration-or-end-to-end
  Expected: Exact64files match approved hashes,complete journal and five exported digest markers;no professional or other unintended writes and no source image/private-data mutation. Actual public catalogue builds/tests pass while missing professional/manifest/manual release gates remain explicitly blocked;no commit/push/deploy.
  Result: PASS. Canonical result exported-public-source,64paths exactly equal plan,allbyte counts/SHA256 verified twice and by standard sha256sum --check;artworks.json17132bytes/5approved records,63derivatives14550989bytes,total14568121bytes. Journalcomplete,source160,5exported digests equal existing approvals. All other canonical data/workflows/private2679files/registry/notes/uploads/masters remain unchanged except expected state/journal/backup;no reencoding. Index empty/HEAD unchanged;professional/projects untouched. Final strict validator/project checker/build/full106/106 PASS,Astro0diagnostics/18pages;release independent BLOCKED_CONTENT5issues(expected scope). No commit/push/deploy/manifest.
  Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=5d0af58df06c5020f0372e188d61f7bcd20b1449560d7677d5752a9bc6c4a380
  Evidence:
    - Private candidate/source-export-01/ contains owner-execution-authority.json,canonical export-result.json,64written-files.json and written-files.sha256,original private inventories/state/registry snapshots,post-validation final-verification.json and RESULT.md. SourceFileList SHA256a6fb4d6bbf61aff6174590c368758a53ca214f0ca43499753b9d939b90547b01 binds exact64path/hash lines;all64sha256sum checks OK.
    - Canonical journal/private original-metadata backup remain under Studio,not public Git. Runtime grant was scoped to the executed/closed process,no writable server or persistent grant enabled. No afterWrite hook/bypass/manual source copy.
    - Current full proof and the deterministic105/106 copied-media fixture setup failure/relevant fix are recorded in M09-R24-V01;old pre-export fingerprints were not rewritten. The failed nested post-export request heading was corrected to the schema-valid R24 namespace before app verification,without editing framework validation.
  Limitations:
    - Professional/contact remain private and out of this write;manifest/manual M09/release/M10 gates persist. Build success does not authorize public deployment,commit or push. Pristine committed HEAD still excludes the preserved checker repair.

## M09-R24 — Actual approved-public export validation and stop

Source: USER's required verification/report of the authorized export,now bound to its new public dataset. This is the post-boundary verification scope of R23-H02,not a new feature or editorial request. Pre-export R23-V01/V02/V03 retain their real fingerprints/results and are historical,not assertions about the changed public catalogue. No framework rule,oracle or fingerprint is weakened to reuse them.

- [x] M09-R24-01 Verify the actual exported files/catalogue and private/unrelated preservation,record H02 completion and stop with remaining release work identified.
  Source: USER/DERIVED from the authorized64-file execution and explicit validation/report stop condition.
  Requires:
    - M09-R23-08
  Verified-By:
    - M09-R24-V01
- [x] M09-R24-D01 Validate the actual published-source dataset with only the demonstrated fixture correction and no exporter/application feature change.
  Source: DERIVED
  Resolution: Strict/full validation and final64hash/private inventory audit pass;relevant fixture collision corrected only inside its temporary project. Keep actual professional.json untouched;record independent blocked release accurately and stop awaiting separately authorized remaining M09 work. Do not start that work in this operation.
  Observed-Failure: First actual-data full run105/106. All actual export/build/metadata/media tests pass;existing stale-target/branch/symlink test fails during fixture setup with EEXIST because isolatedProject copied the newly populated src/media directory before trying to create its deliberately unsafe symlink. No exporter assertion was reached in that failing leg. This is a deterministic fixture isolation defect exposed by the first real media,not checksum/plan/target corruption or an intermittent screenshot failure.
- [x] M09-R24-02 Restore the synthetic fixture's declared empty-content isolation for copied media as well as catalogue arrays.
  Source: DERIVED from actual post-export validation and existing bounded genuine-release-blocker correction grant M09-R23-05.
  Requirement: Remove only the copied media directory inside the just-created isolated fixture before caller data is added. Never remove source checkout/private media. Preserve every symlink/branch/stale-target rejection assertion and do not change canonical export behavior,approved bytes,dependencies or CI.
  Verified-By:
    - M09-R24-V01
- [x] M09-R24-V01 Verify current approved-public source and exact stop boundary.
  Source: DERIVED
  Covers:
    - M09-R24-01
    - M09-R24-02
  Gate: INTEGRATION
  Command: Strict framework/project checks;Node22.23.3/npm10.9.9 bounded npm run verify on actual export;release:check;git diff --check;canonical journal/written-file/private-inventory/unchanged index+HEAD+checker verification.
  Oracle: integration-or-end-to-end
  Expected: Actual export builds/tests with exact64approved file hashes and source preservation. Independent release gate stays BLOCKED for unapproved/missing professional/manifest/manual requirements,no fabricated pass;no additional source write/commit/push/deploy. Old pre-export fingerprints remain preserved.
  Result: PASS. Final bounded npm run verify under Node22.23.3/npm10.9.9 and established browsers exits0:strict framework VALID0errors/warnings,project checker PASS,Astro87files0errors/warnings/hints,18actual pages,106/106tests/0fail/cancel/skip. Real output checks report576refs/26images/maxJS2049bytesgzip and exact public routes/assets;long-page test passes. Standard64-file hash audit and private159→160/journal/export-marker/2679file retention checks PASS. Source professional/projects unchanged;checker b0efc08273cf4c9e83d726473a0960981bab0ef3/earlier R5 work preserved;index empty,HEAD+origin9069f4 unchanged,protected refs unchanged.
  Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=5d0af58df06c5020f0372e188d61f7bcd20b1449560d7677d5752a9bc6c4a380
  Evidence:
    - Command: timeout --kill-after=10s 10m env PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'. Current full106PASS is on actual exported source,not the earlier empty-code overlay.
    - First actual full105/106 is retained above:fixture src/media EEXIST before unsafe-symlink assertion. Added only rm of the copied src/media inside freshly generated isolatedProject;not source/private media. Focused existing stale-target/branch/symlink test1/1 and final106/106 PASS,negative assertions unchanged. No release-oracle weakening/exporter modification and no unrelated feature.
    - Independent read-only release check exits1/BLOCKED_CONTENT:missing exact owner launch manifest,public enquiry recipient,professional About context,and missing-professional-content/missing-recipient markers. Actual email/About are already prepared privately,but professional.json is expressly excluded;no fake manifest or placeholder recipient added. Optional projects/price/dimensions/edition data are not blockers.
    - Final exact file/hash inventory is private source-export-01/written-files.json and standard written-files.sha256;all64current source hashes equal the approved plan. Private added files are only export journal and original-artworks backup;all source image bytes unchanged. Canonical docs note the real5-record source subset rather than obsolete empty-state claims.
  Limitations:
    - Source export is not deployment,M09 final acceptance or M10/M11. No commit/push/staging or public professional write is granted/performed. Manual contrast/fidelity,professional metadata source authorization and exact manifest/final release acceptance remain outstanding.

## M09-R25 — Finish and publish the approved five-work first release

Source: USER, 2026-10-26, TASK FINISH AND PUBLISH JORDANNESBITT.COM; explicit complete bounded release grant and subsequent HIGH confirmation. This supersedes earlier no-professional/manifest/commit/master/deploy stop conditions for this release only. No repeat artwork/title/kind/alt/rights/63-derivative approvals. Existing draft About must be verbatim; public contact jordan.c.nesbitt@gmail.com. Existing Pages/domain; no hosting migration/DNS or commerce. Historical private-Studio/other-corpus gates are retained without making them new launch prerequisites or falsely accepting them.

- [~] M09-R25-01 Prepare and publish exactly w-0184 Kaiya,w-0183 Untitled Figure 036,w-0178 Untitled,w-0175 Untitled,w-0180 Otto in that order,lead Kaiya,no projects,approved verbatim About and public contact; create checksum-bound exact owner launch manifest.
  Source: USER
  Verified-By:
    - M09-R25-V01
    - M09-R25-V03
- [x] M09-R25-02 Integrate existing verified checker repair/test-fixture corrections,resolve reproducible release defects and check actual five-work mobile contrast findings; full verify/release checks must pass without weaker content/privacy/security requirements.
  Source: USER
  Verified-By:
    - M09-R25-V01
- [x] M09-R25-P01 Preserve initial dirty work,private Studio/source/master/notes/registry/unchosen data and exact63approved derivative bytes; production exposes only approved public content,without private review data/credentials/other artworks.
  Source: USER
  Verified-By:
    - M09-R25-V02
- [~] M09-R25-03 Commit/push verified development release,preserve previous actual live commit and practical rollback,integrate master without history loss/force push,deploy via existing Pages workflow and verify actual live HTTPS/home/five works/About/contact/images/navigation/sitemap;record commit/deployment/result.
  Source: USER
  Verified-By:
    - M09-R25-V03
- [~] M09-R25-D01 Reconcile existing state and execute the bounded first-release workflow.
  Source: DERIVED
  Progress: Initial expected dirty paths reviewed; HEAD/origin development9069f4936bf3defa5e4c8db521b3c2e2eca75d1f. Remote master9add7fefbaa2817d974c7c2ba6517ba5b2ecec7c is actual previous successful Pages deployment,run38913420907/deployment7121081577. Existing HTTPS root200/TLS verified. No active pending deployment observed. Existing private profile is the approved552-byte proposal. Existing content/source guards remain unchanged.
  Reproduced-Corrections: First release verify105/106: controlled-empty negative fixture copied the newly added real launch manifest,so missing-manifest assertion failed before any application defect. Remove only that copied approval in the synthetic helper,retaining every negative assertion. Deployment action v3 defaults Node20,below project requirement and native TypeScript runtime;pin verified22.23.3 and run unchanged release:check after build/upload,before dependent deploy. Existing workflow/host/domain preserved.
  Committed-Candidate:83reviewed/stagedpaths committed/pushed as bec8e5be3dea4ff8640a016a429364bc6b14bcf8;oldlive annotated rollback tag pushed. Local master merge c774ab9abb1b3cd839a6396c100ba018b6c622a7 has firstparent oldlive9add7fe,secondparent developmentbec8e5b and exact equal treeee2d08f4252fcc61197651b45771618876048f23. Disposable revert restores prior tree3464c73b7d1ec4ccee7f9bd60e4f47d3ae4fcae5 exactly. No master push yet. Framework strict check correctly reports old dirty evidence fingerprint stale after untracked media becomes committed;V01/V02 reopened only for fresh committed-candidate revalidation,not an application failure or rewritten historical proof. Development fast-forwarded to the local release merge for this check;subsequent evidence-only commits will be included in exact rollback rehearsal before publication.
- [x] M09-R25-V01 Verify actual release code/content and mobile findings.
  Source: DERIVED
  Covers:
    - M09-R25-01
    - M09-R25-02
  Gate: INTEGRATION
  Command: npm run verify; npm run release:check; actual-five browser/mobile contrast and navigation checks under Node22.23.3/npm10.9.9.
  Oracle: integration-or-end-to-end
  Expected: Full suite/build/state/release gates pass;exact source selection/About/contact and release artifact;actual confirmed defects corrected,inconclusive cases never called PASS.
  Precommit-Result: PASS for stated technical/defect-check scope. Final actual-source npm run verify106/106,0fail/skip/cancel,strict VALID0errors/warnings,project checker PASS,Astro87files0diagnostics/18pages;release:check contentGate PASS.50actual Chromium/Firefox page/viewport checks verify exact five/order/lead/About/contact,navigation,reflow,image decoding and fit/larger/Escape/focus;0confirmedaxeviolations.8opened-mobile instruction contrast checks remain INCONCLUSIVE,not PASS;partial-overlap uncertainty,representative screenshots readable,computed muted/paper5.45:1 and control/paper15.35:1. Actual3runs/page mobile labs Home/Kaiya/Archive medians552/544/816ms,CLS0,all transfer budgets pass. Unchanged safety-negative assertions retained. Details docs/quality.md and private release final-verify.txt/local-checks.json.
  Precommit-Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=e300d7090151a4451138ffb5568d69fc73c2564b09e725d196ea07729ce33f75
  Result: PASS. Fresh committed-candidate full npm run verify106/106,0fail/skip/cancel;strictstate/build0diagnostics and release:check PASS;unchanged exact artifact digest. Committed-final-verify.txt records actual rerun on c774ab9;only ledger/provenance changes since clean candidate. Prior mobile/code/content evidence above remains applicable by exact source/output equality;8inconclusivecontrast cases remain INCONCLUSIVE. Before rerun,strict validator correctly refused stale dirty fingerprint;temporarily reopening evidence also required moving old PASS to explicitly historical Precommit-Result. No checker/oracle relaxation;old fingerprint/result preserved verbatim.
  Repository-State: HEAD=c774ab9abb1b3cd839a6396c100ba018b6c622a7; WORKTREE=CLEAN
  Limitations: Headless automation is not full WCAG/physical-colour/assistive-technology proof.
- [x] M09-R25-V02 Audit preservation and exact public artifact/source boundary.
  Source: DERIVED
  Covers:
    - M09-R25-P01
  Gate: CONSTRAINT
  Command: Before/after private file hashes and dirty-work preservation;approved source64file checksum comparison;production and staged-file allowlist/content/metadata audit.
  Oracle: property-or-invariant
  Expected: Private input files unchanged,approved bytes exact,no private/unapproved artwork/review/credentials in production or newly committed source.
  Precommit-Result: PASS. All9154existingprivatefiles unchanged,no unrelated additions;private release evidence excluded.64approved exported source hashes exact,prepared552byteprofessional exact;source/production63derivatives SHA256identical,noEXIF/XMP/IPTC. Exact5artworkroutes/searchIDs/mediaallowlist;87outputfiles/18HTMLpages/595refs/26images/maxJS2049bytesgzip. No other-private-artworkIDs/notes/masters/sourcepaths/reviewdata/credentials/offer/commerce markup. Initial76dirty/untracked paths backed up;checker/export/prior-work bytes retained except authorized source/docs/fixture integration. Contentd5e0d78a33c2ba0eb88fb3d4310578dae7afcabbe9dc087f9b0bece264f0b719/output21e1730644342b40423b4487d5c04784bc0a8ed7a0558b4aedf5ccf8dc20984b. Final staged allowlist review is repeated before publication under V03.
  Precommit-Repository-State: HEAD=9069f4936bf3defa5e4c8db521b3c2e2eca75d1f; DIFF-SHA256=e300d7090151a4451138ffb5568d69fc73c2564b09e725d196ea07729ce33f75
  Result: PASS. Repeated committed-candidate artifact/source/privacy/hash/metadata audit and9154existingprivatefile preservation all pass.87files/exact5routes/searchIDs/63derivatives and same content/output hashes. Exact83staged paths reviewed before bec8e5b;git diff --exit-code confirmed staged bytes equal verified worktree,no private/newunrelated paths;release merge tree equals development tree. Only ledger/provenance changes during revalidation;old dirty evidence preserved above.
  Repository-State: HEAD=c774ab9abb1b3cd839a6396c100ba018b6c622a7; WORKTREE=CLEAN
  Limitations: Existing public repository history remains historical; private evidence/backups stay outside Git.
- [~] M09-R25-V03 Verify development publication,rollback,master deployment and live artifact.
  Source: DERIVED
  Covers:
    - M09-R25-01
    - M09-R25-03
  Gate: INTEGRATION
  Command: Reviewed exact Git checkpoint/nonforce push/history-preserving integration;exact Pages run/deployment identity and successful jobs;live HTTP/browser/asset/hash/sitemap verification.
  Oracle: integration-or-end-to-end
  Expected: Actual successful deployment is bound to approved release commit;all live critical paths/HTTPS/assets and exact five-work content match verified artifact;previous live revision is durably recoverable.
  Limitations: Mailto draft inspection sends no email;indexing/field performance not inferred. User explicitly requires waiting for actual deployment result in this bounded execution.
