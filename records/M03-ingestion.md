# M03 — Non-destructive intake closeout

Technical acceptance: 2026-10-03. Contract: milestones/M03-ingestion.md. Grant: records/M00-preparation.md. Prior M02 checkpoint **19bc4e6** committed/pushed successfully before initialization.

## Final IDs

All VERIFIED, no superseded IDs or required M03 human checks.

- **M03-R1-D01:** explicit single-file/destination CLI/API, caller metadata, dry-run, neutral IDs, hashes and unpublished schema-valid draft.
- **M03-R1-D02:** bounded oriented JPEG/WebP/AVIF derivatives, explicit profile handling, source-private metadata stripped and approved rights only.
- **M03-R1-D03:** cached checksum/settings validation, reviewed-record preservation, conflicts rejected and atomic per-work staged output with exception cleanup.
- **M03-R1-D04:** meaningful isolated image/cache/failure/profile tests, actual CLI-to-loopback-preview exercise and documented conventions.
- **M03-R1-D05:** failed orientation-fixture precondition repaired with the inspected sharp orientation API; assertions retained and rerun passed.
- **M03-R1-P01:** originals, selected-file scope, no artistic editing/metadata invention, default-unpublished and public-source boundaries preserved.
- **M03-R1-P02:** only synthetic /tmp/opencode inputs; real identity/assets/content/framework/protected branches/deployment/host settings preserved.
- **M03-R1-V01:** dry-run/repeat/collision/corruption/missing/invalid/failure/source-checksum checks pass.
- **M03-R1-V02:** natural ratios/formats/profile/private-metadata/preview plus full build/publication/routes pass.
- **M03-R1-V03:** actual decoder capability/audit and intended diff/canonical/state/ref checks inspected before checkpoint. Transport result recorded on next initialization or failure re-entry.

## Decisions

`scripts/ingest.mjs` delegates to the marked explicit-path algorithm in `scripts/lib/ingestion.mjs`, referenced by docs/catalogue.md. Input is one explicitly selected single-frame JPEG/PNG/TIFF export; output must be outside this public checkout. ID/title/medium/alt are caller supplied, not inferred. Draft starts unpublished with unknown date/availability. No source path is included in the manifest.

Direct pinned **sharp 0.35.5** avoids the reported <0.35.4 decoder range and satisfies Node >=20.9.0. Inspected native runtime: **libvips 8.18.7, libheif 1.23.5**, JPEG/WebP/AVIF output available. Rotate and width-capped resize preserve natural ratio without upscaling/cropping. Explicit tagged-sRGB conversion uses source ICC; untagged input requires caller `--assume-srgb`. Source EXIF/GPS/device metadata is discarded; only explicitly supplied creator/rights fields are written. JPEG quality 92/4:4:4, WebP 90 and supported AVIF 65 are documented pipeline settings, not claims of human fidelity.

Output `<output>/<id>` contains record.json, checksummed manifest/settings and derivatives. Reruns reuse verified files and preserve the reviewed record wholesale. Source/ID/settings conflicts, unknown existing destinations and corrupt caches stop rather than overwrite. Pending sibling output is renamed after successful encoding/schema validation and a second unchanged-source checksum; exceptions clean staging. No public arrays/assets or publication flags are mutated by the pipeline.

`scripts/preview-intake.mjs` requires an explicit intake directory; an ephemeral loopback server serves only listed derivatives. Fixtures are labelled synthetic/not the artist's artwork, without public artist identity. Noindex is a courtesy, not privacy. It is an intake utility, not a deployment or the final artwork experience.

## Actual verification

Linux checkout, temporary **Node 22.23.3/npm 10.9.9**, Astro **5.18.2**, telemetry disabled. Installed/session model remains the M01-verified **openai/gpt-6.1-sol/max**.

- `npm view sharp version engines --json`: exit 0; current 0.35.5, Node >=20.9.0. `npm install` and native capability inspection: exit 0; versions/formats above observed.
- First `node --test tests/ingestion.test.mjs`: exit **1**, 4 pass/1 fail. The synthetic image's intended EXIF orientation 6 was actually 1 because manually supplied EXIF was normalized. Guard failed correctly before testing conversion.
- After fixture generation used `withMetadata({ orientation: 6 })` and deliberate P3 tagging, targeted rerun: exit **0**, **5 tests pass**, with orientation assertion retained. Tests validate width/height rotation, ICC presence/conversion within 12-channel-value tolerance on a synthetic flat swatch, removed private device/unapproved creator metadata, approved rights, bounded JPEG/WebP/AVIF, portrait/landscape/square ratios and unchanged source checksums.
- `npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm ci && npm run verify && npm run ingest -- --help'`: exit **0**. Clean lockfile installation, Astro check **0 errors/warnings/hints**, 10 original pages and **44 tests passed**, none failed/skipped. Empty-collection notices remain expected/documented.
- Final test enhancement invokes the **actual CLI** for the import-to-preview exercise; `node --test tests/ingestion.test.mjs` again exits **0**, **5 pass**. Loopback HTML labels TEST FIXTURE, contains no Jordan Nesbitt identity, allows the reviewed JPEG (decoded width verified), returns 404 for an unlisted image and stops after the test. No site implementation changed after the full regression run.
- Dry-run output absence, missing ICC/required fields, prohibited checkout output, repeat reviewed title/availability preservation, corrupt-cache/source conflict rejection, invalid image and injected interrupted-encoder cleanup all pass with synthetic files.
- `npm ls sharp --all`: exit 0, direct 0.35.5 and Astro optional 0.34.5. Credential-free filtered `npm audit --json` preserves exit **1**, **4 findings**: Astro critical, optional Astro-nested sharp high, http-cache-semantics high, esbuild low. New direct decoder is not a reported vulnerable node; old framework surface remains documented, not fixed or passing. No force/major framework upgrade.
- `git status`, intended diff/check/stat/log and `git ls-remote` exited 0. Development remote 19bc4e6 at review; master **755df7fee1a515388a035fce8e9e672070a1d2b4**, backup **3bc95c75bbe85918ce10498af31a751e2cf58fc6** unchanged. Canonical markers/docs and state headers reconciled; only intended intake/dependency/test/documentation paths changed.

## Limitations and next

No real intake path or artwork metadata was supplied or used. Human colour fidelity, crop/orientation judgment, metadata/rights/publication and actual intake approval remain **M09**. Synthetic numerical conversion checks cannot establish faithful reproductions of real art. SIGKILL/power loss can leave a pending directory, never a committed work/cache; manual cleanup requires confirming no active process. Exception/fault cleanup was tested, not a real power-loss simulation. No full-resolution masters or business records in Git, no production/deployment or external messages.

Residual framework advisories remain nonpassing as detailed in docs/operations.md; future affected features/release must revisit them. Next authorized milestone: **M04**, after verified same-branch checkpoint commit/push; M09 stop and earlier genuine blockers/human gates remain binding.
