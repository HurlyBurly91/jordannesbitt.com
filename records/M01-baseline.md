# M01 — Reproducible baseline closeout

Technical acceptance: 2026-10-03. Contract: milestones/M01-baseline.md. Authorization: records/M00-preparation.md (M01–M08, development-branch checkpoint commits/pushes).

## Final IDs

All IDs below are VERIFIED; none superseded. No required M01 human checks exist.

- **M01-R1-D01:** actual checkout/origin/topology and Node/npm/OpenCode/session-model metadata inspected.
- **M01-R1-D02:** original lockfile install/build reproduced; hint resolved explicitly; audit findings inspected rather than hidden or force-fixed.
- **M01-R1-D03:** meaningful built-route regression harness added, with actual loopback Astro preview and cleanup.
- **M01-R1-D04:** README.md and docs/operations.md record verified commands, runtime, routes and limitations.
- **M01-R1-D05:** scoped compatible transitive fixes applied and remaining affected surfaces triaged.
- **M01-R1-P01:** identity/assets/catalogue/routes/framework major preserved; no fixtures in production.
- **M01-R1-P02:** protected refs and deployment controls preserved; temporary runtime, loopback preview, existing selected model and no global configuration changes.
- **M01-R1-V01:** actual selection resolves openai/gpt-6.1-sol, variant max.
- **M01-R1-V02:** clean updated-lock install/build and all 13 automated smoke tests pass.
- **M01-R1-V03:** intended diff/state/ref review passed; same-branch procedure confirmed by successful M00 push; required checks precede M01 checkpoint. Transport result is recorded in the next milestone's initialization (or a failure re-entry), not presumed by this pre-commit record.

## Environment and commands

Linux, /home/jordan/jordannesbitt.com, redesign/astro-foundation. Origin https://github.com/HurlyBurly91/jordannesbitt.com.git. Default shell Node 18.19.1/npm 9.2.0 is incompatible; temporary npm-exec Node **22.23.3**/npm **10.9.9** resolves the environment without a host-wide change. Locked/installed **Astro 5.18.2** retained.

- `node --version && npm --version`: exit 0; original shell versions above.
- `opencode --version && opencode --help`: exit 0; **1.18.34**.
- Credential-filtered `opencode debug config`, `opencode models openai`, read-only `opencode db` schema/model-only SELECT queries restricted to this checkout: exit 0. Current session and actual assistant message metadata confirm provider **openai**, model **gpt-6.1-sol**, variant **max**, build agent. No model call/subagent, raw configuration, credentials or conversation contents were emitted or committed.
- `npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache npm exec --yes --package=node@22 --package=npm@10 --call 'node --version && npm --version'`: exit 0; concrete versions resolved above and pinned for subsequent commands.
- Same temporary runtime, `npm ci && npm run build` with original lockfile: exit 0; 10 pages, 0 errors/warnings, 1 inline-JSON-LD hint. First build printed default telemetry notice; transmission is not asserted.
- `npm audit --json`: exit **1**, original **9 findings** (1 critical, 7 high, 1 low).
- `npm update devalue fast-uri js-yaml nanoid svgo --ignore-scripts`: exit 0; 13 package resolutions changed as declared by those compatible dependencies, including svgo's selectors. Astro's major/version did not change.
- Post-update `npm audit --json`: exit **1**, **4 remaining findings** (Astro critical, sharp/http-cache-semantics high, esbuild low). This audit is not passing; triage and references are in docs/operations.md.
- `npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm install --package-lock-only --ignore-scripts --no-audit && npm ci && npm run verify'`: exit **0**. Lockfile synchronized with engines; clean installation; Astro check **0 errors, 0 warnings, 0 hints**; **10 pages**; **13 tests passed, 0 failed/skipped**. All subsequent builds/preview processes disable telemetry locally.
- `git status --short --branch`, `git diff --check`, intended `git diff`, `git log --oneline -10`, `git ls-remote --heads origin redesign/astro-foundation master backup/pre-astro-redesign`: exit 0. Only intended paths changed. Development remote was 5476c4c; master **755df7fee1a515388a035fce8e9e672070a1d2b4** and backup **3bc95c75bbe85918ce10498af31a751e2cf58fc6** remain unchanged. Workflows inspected: redesign pushes validate only; deploy remains master-only/manual.

## Route and regression evidence

Actual HTTP 200 checks: `/`, `/work/`, `/archive/`, `/about/`, and `/work/{drawing,painting,printmaking,photography,aerial,film}/`. All have English HTML, nonempty Jordan Nesbitt titles, one h1, main/skip-link, expected canonical and parseable Person JSON-LD. Referenced CSS/favicon/sitemap respond, and the sitemap contains all baseline routes. Unknown `/artwork/m01-nonexistent-record/` returns 404. No artwork detail output exists for the empty real catalogue. Child preview binds 127.0.0.1 and is stopped after tests.

## Decisions, preserved rules and limitations

Static-first Astro 5 retained; no major migration, CMS/database, global installation, configuration edit or deployment. `.nvmrc`, Node engine floor, npm verify/test scripts and explicit loopback/telemetry settings make the baseline reproducible. The only layout edit adds explicit `is:inline`, with no presentation/identity change. Existing assets and protected branches remain preserved.

The contract requires security findings to be inspected, not a zero-advisory acceptance criterion. Compatible fixes reduced findings; remaining advisories are unresolved. npm's suggested Astro 7 migration is outside the architecture grant. Current static/trusted-template baseline has no image optimizer, server adapter/islands, View Transitions or authenticated remote cache; Linux/loopback also limits the reported Windows dev-server surface. These observations do not prove vulnerable packages safe or approve release. M03 must review its image decoder choice, and later feature/release work must revisit exposure. No human risk acceptance is invented.

These HTTP checks establish neither browser interactions/accessibility/performance nor visual/colour/content quality, real email delivery or search indexing. Real launch content stays empty until owner selection at M09. Public source/privacy and canonical catalogue rules are preserved. No required human gate was bypassed.

Next authorized milestone: M02, after this verified checkpoint is committed/pushed on redesign/astro-foundation. Authorization still ends before M09 and at any earlier genuine blocker.
