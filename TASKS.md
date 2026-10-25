# Tasks

```yaml
Milestone: M09
State: ACTIVE
Phase: HUMAN_VERIFICATION
Active-Request: M09-R5
Next-Gate: M09-R5-H01
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

Existing unresolved gates moved here without changing their stable IDs, scope, historical coverage or acceptance state. No completed R5 implementation is rehydrated. After the accepted R20/R21 closeout, the next recommended task is owner review of the already generated ten-work pilot and its provisional classifications/date proxies/groups, then explicit initial Selected Work order, authored project membership/sequence and homepage lead decisions. All choices stay private/provisional until separately approved for public source/rights/launch. No new content implementation is started by this closeout.

- [H] M09-R5-H01 Owner reviews regenerated provisional classifications/groups/pilot/colour and current presentation; automation does not approve content/artistry or close M09.
  Source: DERIVED from USER review boundary; preserved stable ID.
  Requires:
    - M09-R21-V04
  Covers:
    - M09-R5-02
    - M09-R5-04
  Coverage-Source: records/M09-schema1-ledger-snapshot-2026-10-09.md
  Gate: HUMAN
  Review-Target: Existing private package /home/jordan/.local/share/jordannesbitt-art/m09/reviews/review-2026-10-06T00-55-36-730Z-0f6e9c43; start owner-review-summary.md and SERVE.txt, with original snapshot binding/provenance in records/M09-R5-persistent-regeneration-checkpoint.md. Directory and expected summary/serve/report/site entries checked present during closeout; not regenerated or newly accepted.
  Verification:
    - Owner explicitly accepts or revises the persistent visual-review content.
    - Correct uncertain work classification/date proxies and nominate/confirm the initial ten-work pilot, Selected Work order, genuine project memberships/sequences and homepage lead; do not invent titles/dimensions/rights or infer public-source approval.

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
