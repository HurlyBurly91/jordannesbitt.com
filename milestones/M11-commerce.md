# M11 — Deferred checkout

## Objective
Add real transactional buying only when inventory, fulfilment and owner authorization justify it.

## Scope
Separately approve a compatible hosted commerce/payment adapter, SKU/edition inventory authority, approved prices/currency, shipping/returns/tax configuration and order-handling process. Connect existing public artwork identities without creating a second inconsistent catalogue. Use sandbox testing first.

## Non-goals
Custom card processing, speculative vendor signup, legal/tax guesses, false stock or retroactive public disclosure of buyers.

## Domain-state dependencies
READ: docs/acquisition.md, docs/catalogue.md, docs/operations.md, docs/quality.md.
MAY MODIFY: commerce integration contracts under the new explicit grant.
MUST PRESERVE: catalogue identity, sold-work archive, privacy and protected-by-policy branches.

## Acceptance criteria
- Owner approves vendor/costs, business settings and live activation.
- Tests cover inventory races, duplicate events, stale availability, failure/cancellation/refund and reconciliation.
- Actual order/payment receipt is distinguished from button clicks and test-mode success.
- Hosted checkout, fulfilment and rollback are reviewed before any real charge.

## Gate
DEFERRED roadmap item. Do not initialize or implement from an ordinary resume after M10. A new explicit request is required.
