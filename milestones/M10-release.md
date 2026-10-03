# M10 — Suitable hosting and controlled release

## Objective
Publish the accepted portfolio on an approved host with a working acquisition route and recoverable release.

## Scope
Compare/confirm hosting appropriate for commercial intent; verify current terms/costs, static build support, forms, redirects, preview isolation and security; obtain explicit approval for provider, costs, DNS/workflow changes and publication. Capture current deployment/artifact and rollback steps; perform staging checks; resolve legacy URLs and canonical domain; test enquiry delivery with permission and confirmed receipt; deploy only the accepted commit. Verify live critical paths, robots and sitemap after launch.

## Non-goals
Assuming GitHub Pages permits the sales-oriented target, blind master merges, domain transfer, unsolicited email, analytics enrollment, payment activation or ongoing monitoring promises.

## Domain-state dependencies
READ: docs/operations.md, docs/acquisition.md, docs/quality.md.
MAY MODIFY: host-specific release/rollback documentation and authorized deployment configuration.
MUST PRESERVE: approved content manifest and reversible Git history.

## Acceptance criteria
- Recorded release grant names the host/domain actions and any cost/external tests.
- Staging and production use the intended approved artifact; old Pages workflow cannot accidentally publish a competing version.
- Relevant redirects, TLS/canonical URLs, public contact and permitted enquiry test are verified; rollback procedure is exercised safely or its exact untested limitation blocks final acceptance.
- Owner accepts the live release; search indexing is tracked as unknown/observed, never inferred from deployment.

## Gate
Stop before any external mutation without the explicit release grant. After completion stop; M11 is deferred, not automatically activated.
