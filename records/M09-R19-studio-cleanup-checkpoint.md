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
