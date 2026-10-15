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
