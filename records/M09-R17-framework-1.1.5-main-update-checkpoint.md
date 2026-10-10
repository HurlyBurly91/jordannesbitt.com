# M09-R17 — Consolidated-main framework 1.1.5 update checkpoint

Intermediate managed-framework update checkpoint; not M09 completion and not owner acceptance of R13 or any inherited content/rights/colour/release gate.

## Upstream release

Authoritative source:

`HurlyBurly91/durable-state-machine@6746415f645c6c56ce39794b6962364cb39ca1bc`

Release:

```text
FRAMEWORK_VERSION=1.1.5
SCHEMA_VERSION=2
PAYLOAD_SHA256=63a67089e7b4a0d78b2939b0f51e6a99fbff7e3784a81eabfbe7b086852ed1cd
```

This is a same-schema managed update.

Framework 1.1.5 adds the normative `ASYNC_EXTERNAL_VERIFICATION.md` contract and validator support for pending external V tasks. It keeps the existing `ACTIVE / AUTOMATED_VERIFICATION` phase and V-task state vocabulary. For externally owned verification that continues independently of the coding process, the durable state may now record exact provider execution identity, immutable target, required checks, bounded query, resume mechanism and suspension checkpoint, then yield instead of maintaining a long-running poll.

Pending external execution is not PASS evidence. Resume must query the exact recorded execution and verify applicability; terminal non-success remains non-PASS.

## Project compatibility

The complete live ledger immediately before adapting to 1.1.5 is preserved verbatim at:

`records/M09-schema2-ledger-pre-1.1.5-2026-10-10.md`

Completed R16 state remains in:
- `records/M09-R16-framework-1.1.4-main-update-checkpoint.md`
- the pre-1.1.5 ledger archive.

It is removed from the bounded live ledger so its clean repository-state evidence is not misrepresented as current after this material framework-policy update.

The current human gate `M09-R13-H01` remains unchanged in meaning. Its machine prerequisite is advanced from completed R16-V02 to the current R17-V02, ensuring HUMAN_VERIFICATION resumes only after the branch is validated under the newly installed framework. The R13 application checkpoint itself is not modified.

## Project-specific policy

Root project policy remains authoritative for:
- development branch/protected refs;
- explicit repository-write authorization;
- Node/runtime/build/test commands;
- private Studio/public-Git boundaries;
- M09/M10/M11 gates;
- model-effort rules;
- external-effect restrictions.

Project-specific policy now identifies GitHub Actions as the normal hosted verification provider and adopts the framework's bounded EXTERNAL_ASYNC behavior for genuinely long external waits. This adds no scheduler, notification system, new phase, or new task state.

## Scope

No application source, application tests, production content, PROJECT.md, milestone contract, canonical behavior document or private artwork state is changed in this implementation checkpoint.

Strict state validation, build compatibility and final diff/protected-ref review remain pending before returning to R13 HUMAN_VERIFICATION.
