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
