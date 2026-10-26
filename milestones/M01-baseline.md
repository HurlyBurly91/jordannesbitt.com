# M01 — Reproducible development baseline

## Objective
Make the current site reproducible and safe to change in the owner's existing checkout.

## Scope
Verify origin/branch/worktree and branch topology; inspect installed Node/npm/OpenCode and configured model identifier; reproduce npm ci and npm run build with the lockfile and Node 22-compatible environment; establish a minimal automated regression harness and document actual baseline routes/results. Inspect dependency/security findings without blind major upgrades. Define repeatable check commands.

## Non-goals
Global machine changes, deployment, paid tools, replacing the framework or inventing model configuration.

## Domain-state dependencies
READ: docs/operations.md, docs/quality.md.
MAY MODIFY: docs/operations.md for verified non-secret runtime facts.
MUST PRESERVE: docs/catalogue.md privacy rules and existing assets/identity.

## Acceptance criteria
- Clean reproducible build or precisely recorded and resolved build defect; commands and versions recorded.
- Existing route smoke checks pass and new tests demonstrably run.
- Same-branch checkpoint procedure confirmed; no unknown master change overwritten.
- Requested model resolves through the actual local provider or is reported blocked, never silently substituted.

## Gate
Technical milestone, no subjective content acceptance. Unavailable credentials/environment are blockers, not fabricated passes. Next: M02.
