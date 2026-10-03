# Jordan Nesbitt — artist website

Astro-based portfolio and structured archive for `jordannesbitt.com`.

## Development

```bash
npm ci
npm run dev
```

Use Node 22 (verified 22.23.3; `.nvmrc`) and npm 10 (verified 10.9.9).
Development and preview bind to `127.0.0.1`. Build/check commands disable Astro
telemetry per process. No global machine configuration is required.

```bash
npm run verify     # type check, static build, then automated tests
npm run test:smoke # tests the already-built dist through a loopback Astro preview
npm run preview
```

Install the test browser once with `npm run browser:install` (pinned Playwright,
Chromium headless shell in `/tmp/opencode/jordannesbitt-browsers`; no system
package installation). `npm run verify` includes actual browser checks against
clearly labelled disposable synthetic sites. Missing browser capabilities fail
verification rather than being silently skipped.

If this machine's default Node is older, use the verified temporary runtime:

```bash
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm ci && npm run verify'
```

Build output and tests are local only. Publishing requires the separate release
grant in M10. Current authorization/state is in `TASKS.md` and `STATUS.md`;
resume through `RUN_PROMPT.txt`.

## Content

- Public identity is centralized in `src/config/identity.ts`.
- Approved public-source records are empty JSON arrays in `src/content/`;
  strict schemas and publication rules are in `src/lib/catalogue.ts`.
- `src/data/catalogue.ts` exposes only publication-filtered records;
  `src/data/artworks.ts` preserves the existing import entrypoint.
- Reviewed web derivatives belong in `src/media/`, never `public/media/`;
  only published records' referenced assets are emitted. See `docs/catalogue.md`.
- Test fixtures belong under `tests/fixtures/`, outside production content.
- Homepage lead is an explicit single `homepageLead` flag, not inferred curation.
- About/CV/contact use only published professional records; missing essential
  content is marked release-blocking until owner approval at M09.
- Full-resolution masters should remain outside this repository.

The current redesign is an initial shell. It contains no fabricated artwork
titles, dates, dimensions, exhibition history, or biography.

## Non-destructive intake

Use a supported Node runtime. Select an approved export explicitly; no real
input folder is authorized by the current technical run. Preview the plan first:

```bash
npm run ingest -- --input /explicit/approved-export.jpg --output /explicit/outside-checkout/intake --id w-0001 --title "Caller-supplied review title" --medium drawing --alt "Caller-supplied accurate description" --dry-run
```

Remove `--dry-run` only for the selected authorized file/destination. Untagged
exports need an explicit `--assume-srgb` decision. Optional `--creator` and
`--rights` retain only approved values. Output defaults unpublished; nothing is
copied to the website. See `docs/catalogue.md` for profile, cache/collision and
review conventions.

```bash
node scripts/preview-intake.mjs --directory /explicit/outside-checkout/intake/w-0001
node --test tests/ingestion.test.mjs
```

The second command is the repeatable **synthetic import-to-local-preview
exercise**: it creates isolated test images in `/tmp/opencode`, ingests a labelled
TEST FIXTURE, checks orientations/profiles/metadata/checksums and serves its
derivative through an ephemeral loopback preview. It sends no messages and
uses no real artwork; its temporary files and server are cleaned up.

The Archive serves all published work without JavaScript; labelled filters
enhance it with search, medium/project/year/availability, sorting and restorable
URL state. `tests/archive.test.mjs` also runs a separately labelled 1,000-record
synthetic scaling exercise. Those records never enter the real catalogue or
count toward launch content. See `docs/quality.md` for measurement limits.

Available derives from reviewed canonical availability, not a second listing.
Enquiry forms prepare an explicitly labelled mailto draft with work identity;
they do not deliver messages. Direct public email is the accessible fallback.
Actual recipient/offers/receipt/business policies remain M09/M10 approval gates;
see `docs/acquisition.md`. No real message test is authorized by `npm run verify`.

## Quality and local review

```bash
npm run verify        # one technical schema/build/publication/browser/axe/link/asset/metadata/budget command
npm run check:output  # inspect already-built output without contacting external URLs
npm run release:check # strict real-content gate; intentionally fails until explicit M09 input/approval
npm run build:preview # noindex local build in /tmp/opencode/jordannesbitt-preview
npm run review        # labelled synthetic screenshots/report/checklist in /tmp/opencode/jordannesbitt-review
```

Use the verified Node22/npm10 runtime and installed test browser above. Review
artifacts never approve real content, accessibility, colour, offers, delivery or
release. Actual metadata/contact remains empty; no launch manifest approval has
been inferred. `docs/quality.md` records profiles, strict gate semantics, legacy
URLs/host requirements and exact owner-input checklist. M09 requires new owner
input/authority; M10 publication and M11 commerce remain separate grants.
