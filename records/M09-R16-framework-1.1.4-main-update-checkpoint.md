# M09-R16 — Consolidated-main framework 1.1.4 update checkpoint

Intermediate managed-framework update checkpoint; not M09 completion and not owner acceptance of R13 or any inherited content/rights/colour/release gate.

## Upstream consolidation

The durable-state reference is now consolidated on authoritative `main`.

Upstream commit:

`9011fe01630e951b0602dd2c02a8fd250f98a85c`

Release:

```text
FRAMEWORK_VERSION=1.1.4
SCHEMA_VERSION=2
PAYLOAD_SHA256=36d84b9c72864017fc68ab25cf22a8b9111c95e41b73b44baca5ef8d817f3d67
```

The project remains on schema 2, so this is a same-schema managed framework update.

Compared with the previously installed 1.1.2 payload, the consolidated-main release adds the normative human-gate-readiness contract and validator enforcement. `HUMAN_VERIFICATION` now means established readiness rather than intended destination. Multiple pending H gates require an explicit `Next-Gate`; the active request must match that gate; transitive prerequisites must be terminal; unresolved pre-gate D/V work blocks entry.

Framework 1.1.4 also splits the validator into `validator.py` + `validator_core.py` and excludes generated `__pycache__/` and `.pyc` files from immutable payload hashes so running validation cannot invalidate the installed framework.

## Project compatibility

The complete live ledger before adapting to 1.1.4 is preserved verbatim at:

`records/M09-schema2-ledger-pre-1.1.4-2026-10-09.md`

No historical ID or pending gate is removed.

Current owner review remains `M09-R13-H01`. It now explicitly requires `M09-R16-V02`, so the project cannot re-enter HUMAN_VERIFICATION until this framework update is verified. The gate's durable verification text identifies the R13 checkpoint record and current validated development branch as the human-test target.

When R16 verification is complete the intended established state is:

```yaml
Milestone: M09
State: ACTIVE
Phase: HUMAN_VERIFICATION
Active-Request: M09-R13
Next-Gate: M09-R13-H01
```

Older pending H gates remain live but are not selected as the next executable gate.

## Project-specific preservation

Root policy remains project-owned and preserves:
- explicit repository-write authorization;
- development-branch-only mutation;
- protected master/backup refs;
- Node/runtime and project verification commands;
- private Studio storage/public-Git restrictions;
- M09/M10/M11 gates;
- model-effort rules;
- no deployment/payment/external-effect authority.

The project checker is updated only to understand framework 1.1.4 identity, require the new readiness/core files, synchronize `Next-Gate`, and ignore Python bytecode/cache files exactly as the managed payload hash does.

No application source, application tests, production content, PROJECT.md, milestone contract or private artwork data is changed in this implementation checkpoint.

Strict validation/build/diff review remain pending before the project can return to R13 HUMAN_VERIFICATION.
