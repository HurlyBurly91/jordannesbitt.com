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
- Artwork placeholders are deliberate and can be replaced incrementally.
- Full-resolution masters should remain outside this repository.

The current redesign is an initial shell. It contains no fabricated artwork
titles, dates, dimensions, exhibition history, or biography.
