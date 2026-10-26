# M02 — Validated catalogue closeout

Technical acceptance: 2026-10-03. Contract: milestones/M02-catalogue.md. Grant: records/M00-preparation.md. Prior M01 checkpoint **4896d8e** committed/pushed successfully before initialization.

## Final IDs

All VERIFIED; no superseded IDs or required human checks.

- **M02-R1-D01:** Astro 5 collections and strict full-snapshot schemas for work/project/professional records, dimensions/dates, editions/availability and moving-image/computational metadata.
- **M02-R1-D02:** one marked publication projection, compatibility export, ordered membership/reverse relationship and local media abstraction; existing consumers migrated.
- **M02-R1-D03:** production fixtures rejected, missing/escaping/symlinked assets rejected, public/media forbidden and only public references emitted.
- **M02-R1-D04:** labelled isolated fixtures, positive/negative and full-build boundary tests; selected layout reconciled in docs/catalogue.md/README.md.
- **M02-R1-P01:** six existing medium URLs, artwork detail identities, identity/assets, static-first major, privacy and Git/external boundaries preserved.
- **M02-R1-P02:** real work/project/professional arrays remain empty; no actual content/offer choices inferred.
- **M02-R1-V01:** positive multi-medium/edition/dimension tests and invalid-value/ID/slug/alias/relationship/asset checks pass.
- **M02-R1-V02:** output and isolated full-build publication boundaries plus actual selective-emission filesystem checks pass.
- **M02-R1-V03:** diff/state/canonical/ref review passed before checkpoint. Transport recorded on next milestone initialization or failure re-entry.

## Implementation decisions

Public-source input is `src/content/{artworks,projects,professional}.json` (all `[]`). `src/content.config.ts` defines Astro 5.18.2 collections with custom loaders. The installed built-in file loader was inspected: duplicate IDs overwrite and some read failures only log. The selected loader validates the full snapshot before any collection store is cleared/populated, and configuration validation makes invalid input fatal.

`src/lib/catalogue.ts` supplies strict schemas, truthful unknown dates, positive distinct dimensions, typed edition facts, explicitly reviewed offers with minor currency units, film/computational fields and optional public professional content. IDs are explicit neutral keys; slugs/aliases are unique per route family. Project membership order is canonical; reverse membership is derived.

The marked public projection applies published true / fixture false centrally, prunes hidden members and omits groups with no public members. `src/data/catalogue.ts` exports only projected data. `src/data/artworks.ts` retains the existing import interface, not a second content source. Later search/counts/metadata must use the same projection.

Approved public-source derivatives live outside Astro's wholesale copy root in `src/media/`; private/master media still forbidden. `/media/...` references map through `src/lib/catalogue-source.ts`. The marked emission algorithm copies only published records' referenced files after build. Missing/escaping/symlinked sources and public/media are rejected. No real files were ingested.

Fixtures reside in `tests/fixtures/` and disposable `/tmp/opencode/jordannesbitt-fixture-*` projects. Production input paths have no fixture environment switch; flags/TEST FIXTURE markers are rejected even when unpublished. Schema tests explicitly allow fixtures without making them public. Temporary test output is discarded and does not overwrite repository dist.

## Verification

Environment: Linux checkout, temporary Node **22.23.3**/npm **10.9.9**, locked Astro **5.18.2**, actual OpenCode model **openai/gpt-6.1-sol/max** as verified in M01; telemetry disabled.

- `npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run verify'`: exit **0**. Astro check **0 errors/warnings/hints**, 10 original pages, **38 tests passed**, none failed/skipped. Astro's getCollection prints notices for intentionally empty collections; this is recorded, not described as a populated catalogue or a notice-free build.
- After adding a positive copy/hidden/orphan assertion: same runtime, `node --test tests/publication.test.mjs`: exit **0**, **4 tests passed**. No implementation changed after the full build; targeted final tests cover the added verification.
- Positive tests cover print image/sheet/framed dimensions, edition/proofs, moving-image/computational records and ordered cross-medium projects. Negative tests cover duplicate IDs/slugs/aliases/members, dangling relationships, impossible dates/dimensions, invalid enum/offer/edition/stock fields, missing/unsafe assets, upscaled/aspect-changed derivatives and production fixtures.
- Isolated actual Astro builds omit an unpublished sentinel from pages/embedded JSON/sitemap/routes/assets and return nonzero for fixture/duplicate input. Real dist contains no artwork/media output or fixture/sentinel strings. Positive emission copies visible asset once while omitting hidden/orphan sources. Symlink and wholesale-public-root misuse fail validation.
- Original loopback HTTP route/metadata/landmark/CSS/favicon/sitemap/404 smoke tests remain passing. No search index exists yet; M05 must extend the same publication boundary to it.
- `git status --short --branch`, `git diff --check`, intended diff/stat, `git log --oneline -10` and `git ls-remote --heads origin redesign/astro-foundation master backup/pre-astro-redesign`: exit 0. Remote development **4896d8e** at review; master **755df7fee1a515388a035fce8e9e672070a1d2b4**, backup **3bc95c75bbe85918ce10498af31a751e2cf58fc6** unchanged. Intended new files and canonical markers were reviewed; state headers synchronized.

## Limitations and next milestone

Schema/build/boundary acceptance does not approve real metadata, artistic presentation, faithful colour, professional claims or offers. Real content remains empty for owner choice at M09. No browser accessibility/performance, email delivery, inventory or indexing claim. Remaining M01 dependency advisories and new-feature exposure review remain documented in docs/operations.md; M03 must choose its decoder appropriately. No deployment, protected-branch write or host-wide configuration change.

Next authorized milestone: M03 after this verified development checkpoint is committed/pushed. Required human gates and the M09 stop remain binding.
