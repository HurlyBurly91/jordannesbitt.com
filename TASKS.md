# Tasks

```yaml
Milestone: M03
State: COMPLETE
Active-Request: M03-R1
Specification: milestones/M03-ingestion.md
```

## Authorization and carried evidence

Source: USER, 2026-10-03; full grant records/M00-preparation.md. Autonomous M01–M08 on redesign/astro-foundation with selected Sol 6.1 Max and verified checkpoint commits/pushes. Stop before M09 or an earlier genuine blocker/mandatory human gate. No protected-branch writes, deployment/publication, hosting/DNS, real messages, purchases/payments or other external effects beyond authorized checkpoints; no host-wide changes. Counts are planning targets only; owner chooses real work/series/order/publication/availability/prices at M09. Synthetic fixtures permitted only in isolated test/local preview paths, with no production leakage or actual-artwork representation. No real/confidential intake path authorized.

M02 checkpoint **19bc4e6** committed/pushed successfully; initialization worktree/origin/remote/protected heads verified. Runtime remains temporary Node 22.23.3/npm 10.9.9 and actual openai/gpt-6.1-sol/max. M01 residual advisory triage remains docs/operations.md. M03 decoder review: npm view sharp version engines --json exited 0, current sharp **0.35.5**, Node >=20.9.0, outside the reported <0.35.4 native-decoder range. Use explicitly pinned direct ingestion dependency rather than Astro's older optional decoder; verify actual native capabilities and audit surfaces after install.

## M03-R1 — Non-destructive intake

Source: DERIVED from milestones/M03-ingestion.md, docs/catalogue.md and docs/design.md under the USER execution grant.

- [x] M03-R1-D01 Implement documented CLI/API with explicit single input/output, caller-supplied stable ID/title/medium/alt, dry-run, checksums, collision handling, repeat import and default-unpublished schema-valid draft.
  Dependencies: M02 complete. No directory scanning, inferred metadata or writes to production content. Output must stay outside this public checkout.
  Evidence: scripts/ingest.mjs and marked scripts/lib/ingestion.mjs; implementation ready for verification, no real input used.
- [x] M03-R1-D02 Generate cached natural-ratio oriented JPEG/WebP and supported AVIF derivatives without upscaling; deliberate sRGB conversion, explicit untagged-profile assumption and only caller-approved creator/rights metadata.
  Dependencies: D01, verified sharp 0.35.5 dependency. Strip source GPS/device metadata; preserve source bytes.
  Evidence: Direct pinned sharp 0.35.5 installed; capability inspection confirms JPEG/WebP/AVIF and libvips 8.18.7/libheif 1.23.5. Runtime decoder assertions pending.
- [x] M03-R1-D03 Make writes atomic per work, retain reviewed draft metadata on repeat, detect corrupt cache/source-ID conflicts and clean incomplete processing output.
  Dependencies: D01, D02.
  Evidence: Pending sibling stage/rename, source and derivative hashes, strict cache conflicts and whole reviewed-record preservation implemented. Hard-kill leftover limitation explicitly documented.
- [x] M03-R1-D04 Add isolated image/orientation/profile/missing-metadata/repeat/collision/failure tests and one documented loopback import-to-preview exercise; document exact conventions in docs/catalogue.md/README.md.
  Dependencies: D01–D03.
  Evidence: tests/ingestion.test.mjs, scripts/lib/intake-preview.mjs and explicit-directory preview CLI; docs/catalogue.md/README.md document exercise and review boundaries. Actual test results pending.
- [x] M03-R1-D05 Repair the synthetic EXIF-orientation fixture so it actually carries orientation 6, then rerun orientation/profile assertions.
  Source: DERIVED from automated verification failure. Evidence: first node --test tests/ingestion.test.mjs exited 1 (4 pass/1 fail); sharp normalized the fixture's manually supplied EXIF Orientation to 1. The guard correctly rejected the invalid test precondition. Use the inspected sharp withMetadata orientation option for fixture generation, preserving ingestion's metadata-stripping path.
  Resolution: withMetadata({ orientation: 6 }) then deliberate P3 tagging generates the intended test precondition; rerun exited 0, all 5 targeted tests passed. Assertions remain intact, including source orientation, rotated output, ICC conversion, private metadata removal and checksum preservation.
- [x] M03-R1-P01 Preserve masters and production publication/privacy boundaries; never scan beyond selected files, overwrite reviewed metadata, publish automatically, retouch/crop/stylize/upscale or fabricate actual metadata.
  Source: USER and DERIVED. Dependencies: all changes.
  Evidence: Synthetic checksum/dry-run/repeat/failure/shape tests and unchanged actual arrays/output pass. Intake rejects output inside the public checkout, reads only caller-selected export and explicit cache files, and never writes masters/production content.
- [x] M03-R1-P02 Preserve identity/assets/framework major/protected refs/deployment controls and host settings; use only approved temporary synthetic inputs.
  Source: USER. Dependencies: all operations.
  Evidence: Intended diff limited to intake/tests/docs/dependency; all original routes/publication checks pass. Actual inputs only /tmp/opencode synthetic images. Protected refs/deployment/host configuration remain unchanged.
- [x] M03-R1-V01 Verify dry-run produces no output, source checksums unchanged, repeat/collision/invalid/missing-metadata/failure cleanup and cache integrity behavior.
  Dependencies: D04. Commands/environment/results pending.
  Evidence: First targeted run exited 1; do not claim passing orientation/profile acceptance until D05 and rerun succeed.
  Resolution evidence: Verified Node 22.23.3/npm 10.9.9, node --test tests/ingestion.test.mjs exited 0 (5/5 pass); all stated dry-run/repeat/review preservation/collision/corrupt cache/invalid/missing-ICC/exception cleanup/source-hash assertions pass.
- [x] M03-R1-V02 Verify derivative dimensions/formats, orientations/profile conversion/metadata stripping and isolated import-to-loopback-preview; run applicable build/publication/route regression checks.
  Dependencies: D04. Commands/environment/results pending. Human colour fidelity and real public intake explicitly deferred to M09.
  Evidence: npm ci && npm run verify && npm run ingest -- --help exited 0 under verified Node 22.23.3/npm 10.9.9; 0 check diagnostics, 10 pages, 44 tests passed. Final targeted CLI exercise enhancement rerun exited 0 with 5 tests passed. Tests confirm rotated portrait, three aspect ratios, bounded JPEG/WebP/AVIF dimensions, tagged sRGB/synthetic swatch tolerance, approved rights only, and labelled loopback HTTP image response. No human colour judgment inferred.
- [x] M03-R1-V03 Review decoder audit results, intended diff/canonical references/state/protected refs; checkpoint only after required technical acceptance.
  Dependencies: V01, V02, P01, P02.
  Evidence: npm ls sharp --all exited 0 (direct 0.35.5, Astro optional 0.34.5). Filtered npm audit --json preserved actual exit 1: same 4 findings, vulnerable sharp confined to node_modules/astro/node_modules/sharp; no clean-audit claim. Native versions/capabilities and intended dependency diff inspected. git status/diff/check/log/ls-remote exited 0; protected refs 755df7f/3bc95c7 unchanged, development remote 19bc4e6. Canonical intake markers/reference docs and synchronized headers reviewed before checkpoint; transport recorded on next initialization/failure re-entry.

No required M03 human gate; real colour/intake acceptance belongs to M09. No superseded IDs. Closeout: records/M03-ingestion.md. Next: M04 after verified M03 checkpoint push. Remaining audit limitations are not resolved by pipeline acceptance.
