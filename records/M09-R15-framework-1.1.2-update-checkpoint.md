# M09-R15 — Framework 1.1.2 compatibility update checkpoint

Intermediate same-schema framework update checkpoint; not M09 completion and not owner acceptance of R13 or any older content/rights/colour/release gate.

## Upstream delta

Updated source: `HurlyBurly91/durable-state-machine` experimental commit `a6a58d297e7233ee86850c39869958edd032b31f`.

Release:

```text
FRAMEWORK_VERSION=1.1.2
SCHEMA_VERSION=2
PAYLOAD_SHA256=7ac7e2e221bcd7c7b204d1d1b05ec8d7d4e73da949fcfb059d3c7c65745bca89
```

This is a same-schema framework update, not a schema-3 migration.

Material upstream compatibility additions since the project's installed 1.1.0 payload include:
- letter-suffixed milestone IDs such as M14A;
- nested follow-up IDs;
- inherited unresolved H gates whose `Covers` requirements live in an archived ledger through `Coverage-Source`;
- `Evidence-Mode: HISTORICAL_RECORDED` for exact archived verified V items when old commands/repository state cannot honestly be reconstructed;
- additional validator tests for those migration cases.

The new semantics explicitly prohibit fabricating missing historical commands or current repository-state claims merely to make migrated evidence validate.

## Preservation-aware project adaptation

The entire live schema-2 ledger immediately before this compatibility refactor is preserved verbatim at:

`records/M09-schema2-ledger-pre-1.1.2-2026-10-09.md`

The earlier complete schema-1 ledger remains at:

`records/M09-schema1-ledger-snapshot-2026-10-09.md`

The live ledger is now smaller and uses the new inherited-gate mechanism. Original pending human IDs M09-R1-H01/H02, R5-H01/H02, R6-H01/H02, R7-H01/H02 and current R13-H01 are preserved. Their `Covers` relations point to exact archived requirement IDs and their `Coverage-Source` points to the verbatim schema-1 archive.

The synthetic bridge requirement IDs introduced solely by the initial 1.1.0 migration are not silently deleted: their complete definitions remain in the pre-1.1.2 schema-2 snapshot and R14 record. They are removed only from the bounded live ledger because framework 1.1.2 provides direct archived coverage.

Historical failed R8/R10/R11/R12 human observations remain in the schema-1 archive and existing checkpoint records. They are provenance, not separate current human gates after their follow-ups.

No historical automated V item is promoted into `HISTORICAL_RECORDED` in the live ledger because no current live requirement depends on one. Existing records remain the historical evidence source.

## Framework ownership

Only `.durable-state/framework/` and `.durable-state/MANIFEST` are framework-owned. Root AGENTS remains project-owned and was changed only to update installed release identity/authorization wording. The project checker is changed only to verify the new release/source/hash.

No application source, application tests, content, catalogue records, milestone contracts, PROJECT.md, canonical behavior docs or private Studio data are changed in this implementation checkpoint.

Final strict validation/build/diff review remain pending before returning to R13 HUMAN_VERIFICATION.
