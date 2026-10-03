# Operations and inspected baseline

## Repository snapshot: 2026-10-03

Repository: HurlyBurly91/jordannesbitt.com (public).
Development head before this preparation: 8fc3176b9d906b2f7794237a0fab75c91a6b61b4.
Development tree: 941fb533202e26a30be5f5f048d1004c4d4d837f.
master: 755df7fee1a515388a035fce8e9e672070a1d2b4.
backup/pre-astro-redesign: 3bc95c75bbe85918ce10498af31a751e2cf58fc6.

The development branch was two commits ahead and one behind master. The master-only commit is the earlier merge of PR #1, Build Astro portfolio foundation; it is not an unidentified independent hotfix. Inspect topology and diff before any later integration. This preparation does not merge either branch.

Inspected package scripts: npm run dev; npm run check; npm run build (astro check && astro build); npm run preview. Dependency ranges include Astro ^5.13.5 and TypeScript ^5.9.2. The lockfile, not a current documentation banner, determines the installed version. Existing check.yml runs npm ci and npm run build with Node 22 on redesign/** pushes. Existing deployment is triggered by master pushes or manual dispatch; do not dispatch it during development.

No website build or browser run was performed in the preparation environment; its attempted read-only clone could not resolve github.com. Remote connector reads/writes and documentation inspection do not substitute for M01's local build verification.

## Owner checkout

The September 14 session recorded /home/jordan/jordannesbitt.com on wilco3. Current existence, branch, uncommitted work and model configuration cannot be observed remotely here. Archived copies are not evidence of an active checkout. Reuse the normal checkout rather than creating a second writer.

Safe bootstrap/update on wilco3 (stops on dirty work or non-fast-forward pull; never resets):

```bash
( set -e; d="$HOME/jordannesbitt.com"; [ -e "$d/.git" ] || git clone --branch redesign/astro-foundation https://github.com/HurlyBurly91/jordannesbitt.com.git "$d"; cd "$d"; case "$(git remote get-url origin)" in https://github.com/HurlyBurly91/jordannesbitt.com|https://github.com/HurlyBurly91/jordannesbitt.com.git|git@github.com:HurlyBurly91/jordannesbitt.com.git) ;; *) echo 'Unexpected origin: stopped.' >&2; exit 1;; esac; test -z "$(git status --porcelain)" || { echo 'Uncommitted changes: stopped.' >&2; exit 1; }; git fetch origin; git switch redesign/astro-foundation; git pull --ff-only origin redesign/astro-foundation; opencode )
```

Opening OpenCode does not authorize implementation. Read RUN_PROMPT.txt and respect M00. If another writer is active, stop before fetching/switching/pulling in its checkout. The command checks the named checkout; it does not search the entire computer for other clones.

## OpenCode and model

AGENTS.md is the native project instruction entrypoint (R09). Use RUN_PROMPT.txt to resume. Do not regenerate these files with /init or load all docs globally. The owner requested Sol 6.1 Max; its exact local provider/model/variant identifier was not externally verified and must not be invented in opencode.json. M01 inspects installed OpenCode help/version and available configured models, records only non-secret identifiers and uses version-compatible permission settings. Do not change the owner's global configuration or silently select another model.

Use one writing agent/checkpoint stream for this checkout. A model selection is not evidence of correctness. Leave credentials, browser profiles and host services alone. Local preview binds to loopback; public preview deployment and exposing private content need separate permission. Noindex is not privacy.

## Release

The sales-oriented target requires suitable hosting; see acquisition.md. During M10 review provider terms/capabilities, costs, redirects, security headers, preview isolation, form delivery and media storage. Do not select or buy a service automatically.

Before authorized launch, capture the last known-good deployed artifact and release commit, document host-specific rollback, verify intended DNS/canonical behavior and prevent the old Pages workflow from accidentally publishing a competing build during migration. Changes to workflows/hosting are part of the explicit release grant, not routine branch validation.

Prefer a reviewed PR and a reversible release. Revert an approved release change or redeploy the captured prior artifact when explicitly instructed; never rewrite shared Git history. The pre-Astro backup is historical preservation, not necessarily the correct rollback target for a later release.

## Verified local baseline: M01, 2026-10-03

The existing /home/jordan/jordannesbitt.com checkout is present on Linux, clean at kickoff, on redesign/astro-foundation with the expected HTTPS origin. Remote master and backup still match the inspected refs above. The sole master-only commit is the known PR #1 merge; no integration was performed. M00 approval/scope is archived in records/M00-preparation.md; M01–M08 checkpoint pushes are authorized, not deployment.

Default shell Node 18.19.1/npm 9.2.0 is below the lockfile's runtime requirements. A temporary npm-exec runtime provides **Node 22.23.3 / npm 10.9.9**, using only /tmp/opencode/jordannesbitt-npm-cache for its cache. `.nvmrc` records the verified Node release, package engines require Node >=22.12.0, and existing validation CI uses Node 22. No global Node/shell/OpenCode configuration was changed. Repeatable command:

```bash
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache ASTRO_TELEMETRY_DISABLED=1 npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm ci && npm run verify'
```

Installed OpenCode is **1.18.34**. `opencode models openai` lists **openai/gpt-6.1-sol**. Read-only `opencode db` queries restricted to model fields of this checkout's latest session and actual assistant messages confirm provider **openai**, model **gpt-6.1-sol**, variant **max**, build agent. This resolves the owner's Sol 6.1 Max selection without a fabricated identifier or configuration change. Resolved configuration has no default model override; selection resides in the active session. Credentials, raw configuration and message contents were not output/committed. No permissions configuration was added; CLI inspection alone is not a security sandbox.

The original lockfile resolves **Astro 5.18.2**. `npm ci && npm run build` passed before implementation, generating 10 pages with one inline-JSON-LD hint. The hint is now explicit `is:inline`; the verified checkpoint build has zero errors, warnings or hints. `npm run verify` builds and runs Node's test harness against an actual loopback Astro preview: all 10 existing routes, canonical/title/landmark/JSON-LD smoke checks, referenced CSS/favicon/sitemap and unknown-artwork 404. **13 tests passed**. The preview is stopped by the harness. No artwork routes are generated because the real catalogue is empty. Baseline routes:

- `/`, `/work/`, `/archive/`, `/about/`
- `/work/drawing/`, `/work/painting/`, `/work/printmaking/`, `/work/photography/`, `/work/aerial/`, `/work/film/`

Dev/preview explicitly bind 127.0.0.1. Build/check/dev/preview scripts disable Astro telemetry per process rather than altering host configuration. The first original-lockfile build printed Astro's default telemetry notice; no claim is made about whether it transmitted data. All subsequent verification runs disabled it explicitly.

### Dependency findings and remaining limitations

The original `npm audit --json` exited **1**, reporting 9 findings (1 critical, 7 high, 1 low). Individually scoped `npm update devalue fast-uri js-yaml nanoid svgo --ignore-scripts` applied compatible dependency resolutions: devalue 5.9.4, fast-uri 3.1.8, js-yaml 4.3.2, nanoid 3.3.19 and svgo 4.1.0 (with its declared selector dependencies). Astro remains 5.18.2. Clean installation/build/tests pass with the resulting lockfile.

The post-update audit still exits **1**, reporting **4 findings: Astro (critical), sharp (high), http-cache-semantics (high), esbuild (low)**. This is an inspected limitation, **not a passing security audit**. npm recommends Astro 7.3.5, a major upgrade outside the architecture contract; no force fix or major upgrade was applied.

- Astro advisories include AVIF optimization RCE ([GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2)), dynamic/spread/slot/transition escaping, server-island replay, SSR error fetching and base-path authorization. Current output is static, with no server adapter/islands, View Transitions, dynamic attribute names or `define:vars`; the site does not call Astro's image optimizer. These observations are scope triage, not proof that an affected package is safe.
- Optional sharp 0.34.x has native-decoder advisories ([GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c)); there is no image decoding in this baseline. M03 must choose and verify an appropriate ingestion implementation rather than reuse this vulnerable optional optimizer without review.
- http-cache-semantics 4.2.0 has cross-user response-cache disclosure ([GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp)). The baseline has no remote-media cache/authenticated fetch path.
- esbuild 0.27.x's reported issue is local arbitrary-file read on a Windows development server ([GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr)); this verification is Linux/loopback, with static production output.

Later milestones must revisit findings when introducing affected features and at release review. Framework migration requires an explicit change to the architecture boundary; technical baseline completion does not approve deployment or resolve these advisories. No browser/accessibility/performance, visual/colour, delivered email or indexing acceptance is claimed by these route tests.
