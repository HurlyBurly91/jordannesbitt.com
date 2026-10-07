# M09-R12 — Cross-tab safety and preview return checkpoint

Intermediate technical checkpoint, not owner acceptance or M09 closeout. **R11-H01 FAILED / not accepted overall** remains recorded. Its owner-passed same-document Back/Forward/same draft, unsaved retention, visible preparation→actual artwork, Exact/Circa Year validation and corrected-year Save/Preview remain preservation constraints. R10/R8 historical failures and older content/rights/colour/business/launch gates persist.

## Decisions and implementation

R12-01–10/P01/P02/D01/D02 technically verified. Choose explicit single-artwork writer ownership instead of copying private unsaved snapshots into independent writable tabs. Web Locks are origin/browser-storage-context scoped and provide actual exclusive ownership. Hold ownership while the editor is active or a dirty snapshot remains in the current document; release clean abandoned editors and on teardown. BroadcastChannel `studio-tabs-v1` queries/announcements carry neutral IDs, dirty/lifecycle flags and random document/control identities only. No titles, notes, alt, rights, paths or snapshots are sent. Sequence filtering/bounded peer bookkeeping handles stale announcements; messages/timeouts cannot steal locks or authorize writing. Different artworks remain independently editable.

Second tab initially withholds persisted editor fields and explicitly warns. Open saved version is deliberate/read-only; Return to other tab requests focus with manual-switch guidance; Check again acquires only genuinely released ownership and reloads authoritative saved state. Save and leave the owning editor for grid, or close its tab, to release it. No automatic save/handoff/merge. Missing browser coordination fails closed. Normal closing may discard unsaved work; saved/restart persistence uses existing private store.

Browser ownership alone cannot protect another browser storage context or authoritative side effects. An opaque saved artwork+private-note version is exposed through authenticated state and required by HTTP artwork save. Compare inside the existing serialized private-store transaction before replacing a record; stale writes fail, retain entered values and require explicit reload/discard. This is saved-state conflict detection, not server-held unsaved snapshots/publication state or a second metadata model. Canonical schemas/intake/colour/review/approval/export/release remain intact.

All isolated Studio-preview routes receive a banner return link without modifying production src/templates. Live preview server supplies the exact creating Studio origin, neutral artwork fragment and constant `return=preview` UI flag. Opener stays null. Original Studio retains its popup handle and a random return nonce; nonce is only in memory/Studio-origin sessionStorage and same-origin control messages, never URL/history. After normal link navigation back to Studio origin, original may focus itself and close its tracked popup. If close/focus is unavailable or original is gone, user is already in Studio with explicit fallback guidance. Native preview history remains independent and ordinary.

## Causal correction and trust boundary

Initial browser run was blocked by missing disposable Playwright cache; restored Chromium/Firefox only under /tmp/opencode. Meaningful existing test assertions were updated to wait for asynchronous ownership/editor readiness, retaining exact metadata/history checks. Archive navigation tests reflect actual optional trailing slash, not a new public route change.

Firefox exposed that a return redirect between loopback ports was classified cross-site and rejected by Studio's existing Fetch-Metadata guard. Do not weaken opener or broadly admit cross-site Studio traffic. Corrected to direct return links with origin-only referrers. Studio admits only GET `/` document navigation, `return=preview`, and referrer origin matching a currently live preview created by this process. Other same-/cross-site requests, unknown loopback referrers, session/API reads and mutations remain forbidden; exact Host/Origin/token/path guards persist. Tests verify the narrowly admitted document and rejected APIs/unknown referrers. Both browsers now close normal script-opened returns; forced-close denial and original-gone fallbacks work. Rule and justification are in docs/studio.md; no optional precedent retrieval or extra experience record was needed.

## Verification

Linux, Node22.23.3/npm10.9.9, Astro5.18.2, sharp0.35.5, Playwright1.63.0, Chromium153.0.8010.12, Firefox155.0 and axe4.13.0. Owner confirmed HIGH for the specific concurrency/security-return section; targeted new5/5 proof passed, then exact LOW return issued. No agent-claimed runtime effort change.

```bash
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'
JORDANNESBITT_M09_DATA=/home/jordan/.local/share/jordannesbitt-art/m09 npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run studio:coordination-demo'
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run release:check'
```

Full verification exits0: **91/91 tests, no failures/skips, zero Astro diagnostics, statecheck PASS**. Prior86 tests retained plus two browser-engine cross-tab cases, two browser-engine preview-return cases and one atomic-save case. Includes stale/rapid/close lifecycle, different artworks, private channel/URL/history exclusion, actual separate-context tab save vs older dirty editor, serialized CAS collision/note-only changes, normal preview route Back/Forward, all private banners, denied-close/original-gone fallback, opener null, invalid form/no popup and production exclusion. Public output13pages/0artimages/maxJS2049bytesgzip. Source/model/intake/colour/export/release/policy/state-machine/lockfile preservation diff againste113671 exits0. Strict release exits1/**BLOCKED_CONTENT**, same8 missing owner-content issues; existing dependency audit/older manual contrast checks are not newly passing.

## Persistent desktop evidence

`/home/jordan/.local/share/jordannesbitt-art/m09/studio/demonstrations/coordination-demo-2026-10-07T19-29-54-514Z-de941e7a`

25steps/50viewport/full PNGs, 1440×900CSSpx/DPR1/visualViewport.scale1 asserted for every capture. Zero observed axe violations/incomplete findings/reflow failures. A: original unsaved Title→second tab explicit warning→explicit saved read-only view→original retains edits/no automatic save. B: visible preparing while request deliberately paused→actual backend build/artwork page with return link→tracked preview closes→original usable. C: artwork→Archive→second artwork→Back/Archive with return preserved. D: Exact/blank Year Save/Preview mark/focus/summary retained; explicit Unknown correction permits save. Additional preserved R11 Back/Forward and actual server restart/reopen shown.

Inspected actual conflict/read-only/preview-return/original-ready/Archive-Back/Year-error screenshots. Two explicitly selected frozen corpus inputs, snapshotSHA25660d841eaabd3a7e1ced4560c047c863fcba111f8b89ccc4f7f0d664cd66b8a2c; all draft labels/classifications are interface scaffolding, not owner facts. Real inputs/build staging/previews/screenshots/reports stay persistent and private. Authoritative owner state/registry bytes and169/169sourcebytes+mtime unchanged; no public-source/rights approval/export/manifest or external effects. This is Chromium desktop demonstration plus Chromium/Firefox synthetic interaction proof, not physical-colour, full-WCAG, device-focus or human-usability approval.

## Human handoff

Docs/studio and guide describe the explicit ownership/return/fallback model; M00 bounded grant reconciled. R12-V02 checkpoint/transport and ACTIVE/HUMAN_VERIFICATION transition follow reviewed code/tests/docs-only commit on redesign/astro-foundation. Owner startup uses documented Node22 `npm run studio`; isolated demonstration adds `JORDANNESBITT_M09_DATA=<artifact>/workspace`. `npm run browser:install` installs Chromium shell and Firefox in disposable cache for reproducible verification. H01 must review A–D, single-writer clarity and preserved passed behavior. R11/R10/R8 overall failures/older gates stay unresolved; no final M09 closeout or COMPLETE.

## Verified checkpoint transport

Intended diff, domain/state/ID evidence, recent log, origin/protected refs and staged15code/tests/docs-only paths reviewed; cached diff check exits0. Commit/push exits0 for **0c489df1668ee4160df15a614ebb8e52dd0b9f0c**, `Guard Studio cross-tab drafts and add preview return`. Clean tracked checkout and matching development remote verified; master755df7f/backup3bc95c7 preserved. No private artwork/draft/screenshot/source metadata or actual public content/source-rights/manifest approval committed. R12-11/V02 VERIFIED; H01 AWAITING_HUMAN; final pointers ACTIVE / HUMAN_VERIFICATION / M09-R12. Prior failed human gates remain failed overall, not fabricated accepted.
