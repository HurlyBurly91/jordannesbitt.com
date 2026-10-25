# M09-R20 — Contextual Studio feedback and media-state clarity checkpoint

Owner-authorized follow-up from real Studio use on 2026-10-15.

## Reported problems

1. Direct confirmation/error messages could appear in the global status bar near the top of the page even when the triggering button was far below it, making cause/effect unclear.
2. Photos & references mixed used artwork photos, unattached media, process/reference media and repeated identical source entries in one visually similar grid without enough explanation.

## Implemented

### Contextual action feedback

- The shared action wrapper tracks the actual clicked button or submitter for the lifetime of the awaited action.
- Direct-action messages create/reuse an inline feedback region immediately after that button or its action group.
- Inline informational messages auto-clear after the existing bounded interval; inline errors remain persistent alerts.
- Intake checking, colour choice, pending-duplicate refusal and preparation feedback are explicitly anchored to the Create draft action.
- Operations whose original control disappears after success (artwork/project/media deletion/attachment, duplicate navigation) anchor the final confirmation to a stable control in the destination section.
- The global status bar remains available for startup/background events rather than being the default destination for direct-action feedback.

### Photos & references clarity

- The page explains that every card is active private Studio media and defines Used by artwork, Unattached and Reference only.
- A live summary reports counts for those states plus repeated-source entries/groups.
- Filters expose All, Used by artwork, Unattached, Reference only and Duplicates.
- Used cards name every artwork and reproduction role using that media.
- Unattached/reference cards explicitly state that they are not displayed by any artwork.
- Active media records sharing the same non-empty `sourceSha256` receive a `Same source ×N` badge.
- Duplicate reporting is display-only: it does not merge identities, delete media, garbage-collect derivatives or change the R19 explicit duplicate-intake override.

## Boundaries

No source uploads/private derivatives are deleted. No repository/public catalogue content, export authority, M09 completion, deployment or M10 release authority is changed. R13 multi-tab/CAS/navigation behavior, R18 draft deletion and R19 project/media deletion plus duplicate single-flight semantics remain preserved.

## Verification status

Implementation and targeted browser coverage are committed. Full `npm run verify` and the targeted R20 browser check are pending on the implementation revision before owner re-review.

## Targeted selector correction — 2026-10-15

The first owner-run R20 targeted browser check reached the Photos & references screen and failed only because an intentionally broad Playwright text locator matched three valid UI elements containing the same state vocabulary: the explanatory hint, the live summary and the filter group. The product rendered the expected information.

The test now scopes that assertion to `#media-summary`, which is the element whose count/state sentence the check is intended to verify. No application behavior changed. GitHub hosted state/build validation for the implementation revision `950f0af882fe5350ac9c688bba242b139fe35be0` completed successfully.

## Full-suite compatibility correction — 2026-10-15

The owner's first full R20 `npm run verify` completed strict state validation and Astro build successfully, and the new R20 targeted browser test passed. Six older Studio tests failed because they still encoded pre-R20 presentation assumptions rather than because the corresponding product actions failed:

- public-source approval and preview-failure checks still required direct-action text in the global `#message` banner;
- artwork-open failure history checks likewise waited for the global banner instead of the card-local alert;
- the image-first media test still looked for the superseded label `Process / reference only` instead of the new explicit `Reference only`;
- the second draft-deletion test could observe the previous still-visible deletion confirmation and race ahead of the second asynchronous deletion, so it now waits for the actual editor/card removal state.

Those assertions are updated to the R20 contextual-feedback contract and current media terminology. No application behavior, source-retention rule, deletion semantics or public boundary is changed by this compatibility correction.

## Owner review and hidden-selection follow-up — 2026-10-20

The owner supplied a normal-use screencast covering the R20 review surface. The review confirmed:
- direct attached-media removal errors appear beside the relevant action;
- single unattached removal succeeds;
- multi-item batch removal succeeds and reports retained source files;
- Used by artwork / Unattached / Reference only / Duplicates filters and counts are understandable;
- attached items identify the artwork relationship and remain protected;
- repeated-source badges remain separate identities rather than being silently merged;
- counts update after successful removal.

The same review exposed one bounded defect. After selecting an attached media item and triggering the expected removal refusal, that item remained selected. Switching to another filter hid the selected item but did not remove it from `mediaSelection`. A later visible batch therefore included the hidden attached record and was refused.

M09-R20-F1 corrects this by clearing ephemeral media selection whenever the media filter changes. The attached-media refusal itself is unchanged. No media/source bytes are deleted by a filter change, no artwork relationship is altered, and duplicate/source-retention boundaries remain intact. Automated and final owner verification remain pending.

## Owner acceptance and separate stale-feedback follow-up — 2026-10-23

**M09-R20-H01 ACCEPTED**, by the owner's explicit review report, for attached-media refusal, filter changes clearing previous selections, fresh eligible batch removal, media usage/duplicate indicators and retention behavior. The preceding local verification at HEAD d01027d5ed280113db7f77aa805165452ed994a9 plus checker-repair material fingerprint46da71e71c6106892b552099d0e309e5fd0b75de11165386a96ad4b1294e519f passed102/102 tests and strict state/build checks; TASKS.md records that actual evidence.

The owner separately observed an obsolete attached-media removal error remaining after a later successful batch. That defect was **not accepted** or covered by the earlier successful test assertions. M09-R21 narrowly tracks reproduction, scoped feedback clearing, regression coverage and new local review. R20 final closeout waits for the follow-up; M09/content/rights/release gates remain separate. The current grant requires preserving the existing uncommitted checker/ledger correction and stopping at verified uncommitted work; no commit, push or hosted CI dispatch is authorized.

## M09-R21 verified uncommitted correction

The extended R20 browser test reproduced a real application feedback defect before the UI change. The removal error lived in the shared attach/remove action-group node, without an action/relevance lifecycle. Filter changes emptied selection and hid that node's parent but left its text/alert intact; selecting eligible photos exposed it again. Actual removal returned200 and success status appeared at the separate Add images anchor, leaving the old node available to reappear on later selection. The test observed all four stale-content/visibility indicators true before correction. This does not claim the old error was continuously visible while its parent was hidden.

Local feedback now retains the initiating control ID. A changed selection/filter context clears only removal-origin errors; a successful removal also explicitly clears that error before the usual refresh/status path. Clearing resets content/visibility/alert through the existing message writer. Same-context rerenders and unresolved attachment/project errors retain their existing persistence. No backend/media-deletion/attachment/export/file-retention behavior changed.

Same targeted regression passes1/1 after correction with all stale indicators false. It verifies exact two selected/requested IDs and actual removal, unchanged attached photo/catalogue/asset allowlist, source/upload/private-derivative byte hashes, fresh local role=alert errors surviving6500ms virtual time, role=status success/cleared feedback, selection-only/clear-selection paths and unrelated persistent attachment/project errors. Strict state validation/project checker pass. Final Node22.23.3/npm10.9.9 `npm run verify` passes **102/102 tests**,0fail/skip and zero Astro diagnostics. First full run was101/102 due to an unchanged independent synthetic long-page screenshot protocol error; isolated reproduction and subsequent full run both passed without source/environment-flag changes. Precise intermittent capture failure cause remains unconfirmed; it is not hidden as a first-run PASS or attributed to this Studio fix.

`git diff --check` passes. Local review target: **HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=1041a739f9aa8c010505a3a2ebb8981a485d48d20e136f5657acf25c1a99bebb**. Prior checker blob b0efc08273cf4c9e83d726473a0960981bab0ef3 and its existing ledger evidence are retained. Seven intended unstaged files only; no commit/push/dependency/hosted-CI/public-content changes or actual owner media writes. Current state ACTIVE / HUMAN_VERIFICATION / M09-R21, Next-Gate M09-R21-H01, explicitly against this uncommitted local worktree. R20-H01 acceptance remains limited to the owner's2026-10-23 statement; this new correction awaits owner review and R20 final closeout remains separate. M09 is not COMPLETE.

## Explicit owner acceptance and authorized closeout — 2026-10-25

**M09-R21-H01 ACCEPTED.** The owner's dated decision explicitly reports all five checks PASSED: attached-media refusal, filter change clearing obsolete selection/error, eligible unattached batch removal, no stale-error resurrection on later selection, and a new genuine persistent accessible refusal. This accepts the separately tracked correction; it does not retroactively include it in R20's2026-10-23 primary-functionality review. R20/R21 Studio acceptance coverage is satisfied; current closeout verification and scoped checkpoint transport follow. M09 stays ACTIVE and every other pending human/content/curation/colour/rights/release gate stays unresolved.

The owner authorizes commit/push only of the six existing Studio code/test/docs/state paths, preserving earlier TASKS checker-repair evidence. **scripts/durable-state-check.mjs is explicitly excluded**, unchanged at worktree blob b0efc08273cf4c9e83d726473a0960981bab0ef3. Full verification is of the combined local worktree including this uncommitted repair; a clean checkout of the resulting scoped commit still retains the obsolete checker pin and is not represented as independently passing npm run verify. Separate checker publication remains outside this grant. No updater-owned files, dependencies, CI policy, protected branches, real private media or publication authority are changed.

Closeout starts at actual clean index/seven modified paths/HEAD+development remote d01027d5ed280113db7f77aa805165452ed994a9, matching the accepted worktree fingerprint above. Browser cache absence was an environment issue; the existing pinned browser:install restored Chromium shell1243/Firefox1543/FFmpeg1011 before current full verification. Earlier101/102 screenshot-protocol failure and subsequent isolated/full passes above remain historical evidence; no unsupported root cause or first-run PASS is invented.

### Current closeout verification

Executed the owner's exact command: `timeout --kill-after=10s 10m env PLAYWRIGHT_BROWSERS_PATH=/tmp/opencode/jordannesbitt-browsers npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'`. **PASS**,102/102tests,0fail/skip/cancel; strict validator VALID/0errors/0warnings,project checker PASS,Astro87files/zero diagnostics/13pages. The previously intermittent long-page capture passes in this current full run; no test was changed or weakened. Standalone strict validator and `git diff --check` pass. Binding remains HEAD=d01027d5ed280113db7f77aa805165452ed994a9; DIFF-SHA256=1041a739f9aa8c010505a3a2ebb8981a485d48d20e136f5657acf25c1a99bebb, including the uncommitted excluded checker as explicitly noted above. Actual checkpoint SHA/remote equality will be recorded after successful publication, not predicted here.

R20's explicit functionality plus F1 and R21's stale-feedback correction now have automated and owner acceptance coverage; only authorized closeout transport remains. Next recommended content task is the already unresolved **M09-R5-H01**: review the existing private ten-work pilot, correct provisional classification/date assumptions, and decide initial Selected Work order, real project membership/sequence and homepage lead. The recorded R5 package directory was checked present, not regenerated or newly artistically accepted. No content task is implemented in this closeout. Remaining R1/R5/R6/R7/R19 human gates, manual colour-contrast cases, final real-source/rights/metadata/professional/contact/availability/manifest approval and separate M10 authority all remain unresolved.
