# M09-R7 — Image-first Studio UX checkpoint

Intermediate technical evidence, **not M09 completion or owner usability/content acceptance**. Owner feedback says R6 capabilities are promising but confusing; this pass refines Studio UX only. Accepted public M09-R2 direction and all existing backend/models/intake/storage/validation/publication/export/security semantics remain unchanged.

## IDs and scope

M09-R7-01–11/P01/P02/D01/D02/V01/V02 technically verified. H01/H02 are AWAITING_HUMAN practical usability/expert disclosure and current incomplete contrast review. Older R6/R1/R5 factual/rights/colour/final-content/launch gates persist. No superseded requirement meanings or final approval inferred.

Only Studio HTML/CSS/JS,guide/domain UX documentation,interaction tests,demo driver and durable evidence change. `git diff --exit-code HEAD -- src scripts/lib/studio-store.mjs scripts/lib/studio-server.mjs scripts/lib/studio-export.mjs scripts/lib/studio-paths.mjs scripts/lib/studio-preview.mjs scripts/lib/ingestion.mjs` exits0 before checkpoint: public presentation/schema/backend/pipeline/release unchanged. No dependency/major feature/security architecture changes; LOW throughout.

## Artist-facing workflow

Explicit selected photos lead to three visually obvious choices: New artwork,Another view/detail,Process/reference (not standalone artwork). New draft opens pending/prepared image editor automatically; completion/error handling still comes from the authoritative intake. Another view chooses artwork by thumbnail/title/date and a human-readable use; primary changes explicitly retain the former primary as alternate using existing validated endpoints,one primary photo at a time. No similarity merge/implicit publication.

Normal editor emphasizes image,title,date certainty,medium/process/materials,optional overall size,alt,project/series,availability and relevant price/currency. Edition,separate typed image-paper-framed sizes,framing/condition,identities/URLs/aliases/provenance/hashes/rare publication-selection controls remain Advanced. Visual photo sequence and Preview artwork are direct. Refresh/polling does not reset unsaved editor fields. Attachment selection conceals the unrelated old editor; Editing/Chosen/current lead wording separates active selection from Selected Work.

Media is a click/multi-select thumbnail library with attached/unattached/reference-only state and shared visual target/use/action,not repeated per-card dropdown forms. Projects visually add/remove/order artwork thumbnails and preview. Selected Work has direct visual sequence and Preview; homepage shows current image/thumbnail choice/Preview. Reliable keyboard/click/earlier-later buttons replace unnecessary drag/drop. Normal UI requires no internal IDs; technical values remain inspectable.

Ordinary safety text is PRIVATE DRAFT/Nothing here is public. Near preparation,exact source paths/metadata/media disclosure,rights/owner source confirmation,dry-run,typed token and --allow-public-export startup requirement remain fully explicit. No commit/deploy/launch approval or gate weakening. “Prepare for public site” changes wording,not authorization semantics.

## Verification

Linux/Node22.23.3/npm10.9.9/Astro5.18.2/Playwright1.63.0/Chromium153.0.8010.12/axe4.13.0/sharp0.35.5.

`npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'` final exits0: **80/80tests,0fail/skip/diagnostics**. Prior79 checks retained; browser selectors/assertions adapted to visual controls rather than removed. New normal-UI interaction verifies noIDentry,auto draft editor,correct target detail/primary attachment,reference not artwork,visualproject/Selectedorder/home lead persistence afterreload and editedactualcomponent preview. Existing exactapprovedsyntheticexport/dryrun/rights-runtimewrite/rollback/Host-Origin-token/path/symlink/corrupt/interrupted preservation tests continue to pass. Initial ambiguous label/status selector conflicts were scoped correctly; no failed run called passing.

Actual public output stays intentionally empty13pages/109localreferences/0artworkimages/maxJS2049bytesgzip with no Studio/private search/sitemap leak. Strict `npm run release:check` exits1/**BLOCKED_CONTENT**,same8missing-owner-content issues; no gate changes. Existing nonpassing dependency audit remains unchanged,not newly claimed passing.

## Persistent demonstration

Exact owner snapshot SHA25660d841eaabd3a7e1ced4560c047c863fcba111f8b89ccc4f7f0d664cd66b8a2c,three explicit source images only. Final artifact:

`/home/jordan/.local/share/jordannesbitt-art/m09/studio/demonstrations/ux-demo-2026-10-06T05-47-31-290Z-0f3a8a89`

Isolated persistent workspace beneath that artifact; private state and registry are copies for demonstration,not replacements of authoritative owner state/IDs. Original registry entries preserved in copy,temporary new allocations are demonstration-only. Authoritative owner Studio state/registry remain byte-for-byte unchanged;169/169sourcebytes+mtimeunchanged. No real images/source-linked metadata/rights/approval/screenshot data are in Git.

`npm run studio:demo` final exits0: **43actualUI/current-component screenshots** at1440/768/360×900CSSpx/DPR1/normalzoom;0observedaxeviolations/0reflow. Anewartwork,Bexplicit second alternate-photo attachment,Cprocess-reference only,Dnormalmetadata,ESelectedorder,Fhomepage,Gprojectorder,Hactualcomponents,Idry-run refusal without actual rights/sourceapproval. Duplicate whole export is labelled a private UI attachment test,never a new physical detail/view claim. Successful approved dry-run is tested synthetically only; real source approval is not fabricated. Temporary demo titles/groups/medium hints are not permanent artistic facts.

Initial43-capture screenshot inspection led to concealing unrelated editor during intake and clarified active-item wording; refreshed final captures inspected for desktop editor/target/project/home hierarchy. One360pxStudioartworks color-contrast rule remains **INCONCLUSIVE/manual**,not a passing rule or confirmed violation. H02 records it; no full-WCAG/assistive/physical-device/artistic/colour acceptance claimed.

## Handoff and transport

With Node22,owner starts updated working Studio from checkout: `npm run studio`. Default private data remains ~/.local/share/jordannesbitt-art/m09/studio. To inspect isolated demonstration, `JORDANNESBITT_M09_DATA=<artifact>/workspace npm run studio`; default owner data is not changed. studio/README.md explains normal visual flows and unchanged final approval/export controls. README/report/screenshots in private artifact provide exact paths/results.

Owner must test practical simplified workflow and optional/expert control discoverability,manually review current incomplete contrast,then separately approve genuine public-source/rights/metadata/curation/professional-contact/business/launch-manifest/final-public-content gates. Public site was not redesigned. Intended UI/tests/docs-only checkpoint on redesign/astro-foundation,protected refs and unfamiliar empty untracked file preserved; return ACTIVE/HUMAN_VERIFICATION,never COMPLETE/final closeout.

## Verified checkpoint transport

Intended changed/new file/domain/UIDemo/test/state review,status/recentlog/origin/protectedrefs and gitdiff--check/cached--check pass. Staged11UI-tests-docs-demo-state-only paths;commit/push exits0 for **74ff6746ae54362df9b9e85049010b4b7fe2272c**, `Make M09 Studio image-first and simplify artist workflows`, on development branch. Post-push HEAD/origin match,master755df7f/backup3bc95c7 unchanged and only preserved unknown empty untracked file remains. Publicsrc/backend/security/schema/intake/release/content/media/rights/manifest not changed or staged. Final documentation preserves ACTIVE/HUMAN_VERIFICATION,H01/H02/oldergates and no M09completion/publication.
