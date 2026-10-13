# M09-R19 — Real-pilot Studio cleanup checkpoint

Owner-authorized follow-up from two real-use screencasts after the first launch-pilot pass.

## Implemented

### Private project deletion / empty-project dead end

- Private Studio-only projects now expose `Delete project draft`.
- Delete is serialized, saved-version checked and refused for repository-catalogue project IDs.
- Project deletion keeps member artworks and every photo, removes only the private project record/workflow/note, and records a private tombstone.
- Removing the last member no longer presents a misleading normal-save path: inline guidance explains that a project cannot be saved empty and points to add-member or delete-project.
- Artwork deletion's sole-member-project refusal now points at the explicit project-delete path rather than a relationship state the owner cannot persist.

### Photos & references removal

- The selected-media panel now exposes `Remove selected from Studio`.
- Attached media is refused with the attached artwork names and explicit instruction to remove that reproduction in the artwork editor and save first.
- Unattached selected media requires confirmation and is removed from the active private media library.
- Source uploads, derivatives and asset mappings are intentionally not unlinked/garbage-collected; a private deleted-media tombstone preserves provenance.
- No repository/public catalogue mutation is authorized or performed.

### Duplicate-aware single-flight intake

- Intake job reservation now records source hash/purpose inside the serialized state transaction before image processing.
- A second new-artwork request for the same source hash while a job is running is refused regardless of override.
- Read-only inspect reports pending identical artwork jobs and existing active media/artwork matches.
- Existing-source new-artwork intake is interrupted before another ID is allocated. Studio offers Open/View existing, Cancel, or explicit `Create another artwork anyway`.
- The deliberate override permits a later separate artwork identity from identical bytes, but does not bypass pending single-flight protection.
- Slow create/preparation keeps the create control disabled with Checking/Creating/Preparing text until its batch reaches a terminal state.

### Status presentation

- Routine informational messages use a neutral bordered status bar instead of persistent oxide warning text.
- Normal information auto-clears after six seconds.
- In-progress status can remain until replaced.
- Errors remain persistent alerts with oxide styling.

## Boundaries

R13 multi-tab/CAS/navigation/preview semantics and R18 safe artwork deletion remain preserved. No physical source deletion, secure erasure, media garbage collection, public-source write, deployment, M09 completion or M10 authority is added.

## Verification

Targeted tests were added for project deletion/stale version preservation, media removal/attachment refusal/file preservation, pending/existing duplicate intake and explicit override, plus the owner-facing cleanup controls. Full `npm run verify` is pending.

## Verification correction — 2026-10-13

The owner isolated `tests/studio.test.mjs` under the required Node 22.23.3 runtime. The run completed in ~12s rather than hanging and reported 29 tests: 9 pass / 20 fail. The failures separated into two causes:

1. Browser tests could not launch because the configured Playwright binaries under `/tmp/opencode/jordannesbitt-browsers` had been cleared. This is an environment prerequisite, not application evidence.
2. Several pre-R19 synthetic tests intentionally create independent artwork identities from identical generated pixels through the shared `add()` helper. R19 now correctly interrupts such identical-source artwork intake unless deliberate duplicate intent is explicit. Those historical fixtures therefore became invalid assumptions rather than product regressions.

The dedicated R19 duplicate-source invariant test passed independently under Node 22: pending identical source refused, existing identical source refused without override, explicit later override accepted.

The shared synthetic `add()` test helper is updated to pass `allowDuplicateSource: true` only for its intentional synthetic new-artwork path. The dedicated R19 guard test continues to call `studio.intake()` directly without that default, so it still verifies the production interruption behavior. The R18 sole-member deletion expectation is also updated to match the new R19 guidance wording (`would become empty` / `Delete that private project draft`) without changing production behavior.

Full V01/V02 remain pending until Playwright browsers are reinstalled and the corrected suite passes.

## Hang root cause and bounded-test correction — 2026-10-13

After Playwright was reinstalled, the Studio suite progressed through the untagged-colour test and then appeared to hang. Inspection showed the next historical test generated `batch-one.png`, `batch-two.png` and `future.png` from identical synthetic pixels. Under R19, the second same-source new-artwork request in that batch is correctly refused, so the test's old unbounded `while (jobs.length < 6)` could never become true.

This was a fixture/test-control defect, not a production intake deadlock. The test now:
- generates distinct synthetic pixel content for the unrelated decline/tagged/batch/future images;
- preserves the dedicated R19 duplicate-source test as the only intentional same-source guard exercise;
- replaces the only unbounded wait loop in `tests/studio.test.mjs` with a 5-second bounded poll followed by an explicit assertion.

The Studio test file contains no other unbounded `while`/infinite loops after this correction.
