# M09-R18 — Safe private Studio draft deletion checkpoint

Implementation request created from owner feedback during real pilot use: accumulated Studio drafts lacked a normal deletion affordance.

## Implemented behavior

- `Delete draft` appears beneath each deletable private artwork card.
- The artwork editor contains a separated `Delete private draft` section.
- Repository-catalogue artwork identities are protected and expose no private-delete control.
- Confirmation names the draft, reports Selected Work/homepage/project consequences and warns when the current editor has unsaved changes.
- The delete request carries the current saved-version hash and executes inside the existing serialized private transaction; stale deletion is refused.
- Confirmed deletion removes the artwork from the active private catalogue and project memberships, invalidates affected project review/approval state, removes active workflow/note sidecars and leaves source/private media untouched.
- Deletion is refused when the artwork is the sole member of a project rather than silently deleting the project.
- The private neutral-ID registry is never rewound, so a deleted artwork ID cannot be reused.
- A private `deletedDrafts` tombstone retains the removed record, workflow/note state, project membership provenance and deletion timestamp. There is no owner-facing restore UI.
- Cross-tab saved-version checks recognize that a draft disappeared and disable the deleted editor rather than allowing the old ID to be saved again.

No public-source delete capability, media garbage collection, publication/export authority or M10 behavior is added.

## Verification state

The first implementation CI run `38166032467` stopped in strict state validation because completed R17 V evidence correctly became stale after the material R18 code change:

```text
W082 M09-R17-V01 evidence is stale
W082 M09-R17-V02 evidence is stale
```

R17 is completed historical work and is already preserved by its checkpoint record and prior live-ledger snapshots. It is therefore removed from the bounded live ledger without changing its recorded PASS results or repository-state values.

The implementation includes targeted store/browser regression tests for:
- stale-version delete refusal;
- project-membership cleanup;
- source/media/asset preservation;
- private tombstone creation;
- neutral-ID non-reuse;
- sole-project-member refusal;
- card delete cancel/confirm flow;
- editor delete with unsaved-edit warning.

Full `npm run verify` remains pending; the normal hosted workflow only runs state validation and Astro build.

## Live-ledger archival-reference correction

After R17 was correctly archived out of the bounded live ledger, strict validation reported E060 because already-accepted `M09-R13-H01` still carried its former execution-time `Requires: M09-R17-V02` reference. That prerequisite had been satisfied before the owner's R13 acceptance and remains preserved in the R17/R13 records; it is no longer a live dependency after the human gate is terminal.

The obsolete live `Requires` edge is removed and its historical satisfaction is recorded in the accepted H01 limitations. No acceptance, evidence result or implementation behavior is changed.

## Final verification and owner acceptance — 2026-10-11

The owner installed the pinned Playwright Chromium/Firefox binaries and reran the full project verification on the R18 implementation. The supplied terminal transcript showed:

- strict durable-state validation: `VALID: 0 error(s), 0 warning(s)`;
- project state checker: `PASS`;
- Astro diagnostics: 0 errors / 0 warnings / 0 hints;
- static build complete: 13 pages;
- full test suite: **97 tests, 97 pass, 0 fail**;
- targeted `private draft deletion is version-checked, preserves media/public source and never reuses neutral IDs`: PASS;
- targeted `Studio exposes cancellable card/editor draft deletion and keeps source photos`: PASS.

The owner then exercised the real Studio deletion UI by screencast. Grid-level and editor-level `Delete draft` were both used, confirmations were accepted, deleted drafts disappeared from active Studio, and the owner stated `seems good`. The owner subsequently clarified that the editor-level delete control was clicked when the first video review overlooked it.

Accordingly:

- M09-R18-01: VERIFIED / owner accepted.
- M09-R18-02: VERIFIED.
- M09-R18-03: VERIFIED / owner accepted.
- M09-R18-P01: VERIFIED.
- M09-R18-P02: VERIFIED.
- M09-R18-V01: PASS from owner-supplied full `npm run verify` transcript at development head `e45f6b4f358ec306669d9be9786774c7eaa804e3`.
- M09-R18-V02: PASS through the targeted deletion tests included in that 97/97 run.
- M09-R18-H01: **ACCEPTED** from owner screencast review and `seems good`.

R18 is complete and leaves M09 ACTIVE. This acceptance does not approve public content, rights, colour fidelity, curation, business/contact facts, final launch manifest or M10.
