# M08 — Quality gates and review package

## Objective
Provide repeatable evidence that the platform works and a concrete local package for content/visual review.

## Scope
Add one documented verification command for schema, publication isolation, links/assets/routes, browser behavior and accessibility; release checks for fixtures/placeholders/missing essentials; truthful SEO/social/sitemap generation; responsive media and representative performance measurement; noindex local/approved preview handling; a legacy URL inventory and host-capability requirements. Collect reproducible screenshots and test results for representative templates.

## Non-goals
Claiming full accessibility, indexing, sales or visual acceptance from automated scores; submitting Search Console; deploying previews publicly without permission.

## Domain-state dependencies
READ: docs/quality.md, docs/operations.md, docs/catalogue.md.
MAY MODIFY: docs/quality.md for reproducible commands/budgets and justified limitations.
MUST PRESERVE: publication, external-effect and human-review boundaries.

## Acceptance criteria
- Verification command actually runs and fails on deliberate negative fixture cases.
- Production-path tests show no draft/fixture leakage; release checker correctly blocks missing actual launch content.
- Representative mobile/desktop, keyboard and performance evidence identifies environment and limitations.
- Review package and exact missing-content checklist are available locally without exposing private inputs.

## Gate
Technical platform can be complete even while the intentionally strict real-content release check blocks publication. Record that distinction. Stop the initial autonomous batch at M09; do not publish.
