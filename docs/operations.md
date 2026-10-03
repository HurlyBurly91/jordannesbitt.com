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
