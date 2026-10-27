# Verification Portfolio Lifecycle

Status: **normative for framework 1.2.5, schema 2**

Tests are maintained verification assets, not an append-only historical
collection. Historical evidence must be preserved, but active execution
obligations must be periodically rejustified against current contracts, risk,
cost, assumptions, and demonstrated fault-detection value.

This policy adds no durable-state lifecycle phase and requires no schema
migration. Projects implement it with their existing test runner, project-owned
testing documentation, labels or presets, and ordinary durable evidence.

## Project-owned portfolio contract

A mature project with non-trivial verification cost should keep one concise
project-owned portfolio document, normally `docs/verification-portfolio.md` or
an existing canonical testing document. Do not create one durable task per test.

The portfolio may group tests that genuinely share a contract. Each material
test or coherent group should record:

- stable name and exact selection command or label;
- execution class and lifecycle status;
- contract, current assumptions, and affected owners;
- oracle class and whether it is independent of the implementation;
- measured runtime and relevant resource constraints;
- known defects or mutations it uniquely detects, when known;
- overlap, replacement, supersession, and retirement decisions;
- qualification-set membership;
- limitations and recheck triggers;
- last review revision.

Unknown value is recorded as unknown, not invented.

## Two independent classifications

Execution class describes cost and mechanism:

```text
FAST
INTEGRATION
LONG
SANITIZER
GUI
HARDWARE_OR_EXTERNAL
```

Lifecycle status describes present obligation:

```text
ACTIVE
PERIODIC_DIAGNOSTIC
HISTORICAL_REPRODUCER
SUPERSEDED
RETIRED
```

`ACTIVE` does not mean every active test runs on every edit. Tier selection and
qualification-set membership determine when it runs.

`PERIODIC_DIAGNOSTIC` remains available for broad confidence, scheduled checks,
or explicit investigation but is not an ordinary blocking acceptance gate.

`HISTORICAL_REPRODUCER` preserves a useful old defect or exact scenario without
requiring execution against every future candidate.

`SUPERSEDED` identifies the stronger, smaller, more independent, or more current
replacement. It is removed from active qualification.

`RETIRED` no longer establishes a current contract. Remove it from ordinary
registration. Its source may be deleted when Git history plus a concise record
preserve sufficient provenance and no active reproducibility need remains.

## Qualification sets

A qualification set is the explicit current collection of checks required to
establish a named acceptance contract. It is contract-complete, not
history-complete.

A qualification set should identify:

- stable set name and revision;
- requirements and risks it establishes;
- exact runner selections, labels, presets, or commands;
- required environment, sanitizer, GUI, hardware, or external checks;
- representative end-to-end cases and why each remains distinct;
- human gates that remain outside automation;
- excluded periodic, historical, superseded, and retired checks;
- measured cost and declared review budget;
- last portfolio review and recheck conditions.

The unfiltered suite may remain available, but it is not automatically the
qualification set. A current qualification set may be smaller than all
historical tests and still be complete when every current material contract has
adequate applicable evidence.

## Mandatory portfolio-review triggers

Perform a bounded portfolio review when any of these occurs:

- Tier 3 cost exceeds or materially approaches the project's declared budget;
- suite wall time or long-test count grows materially since the last review;
- a human finds a defect that active qualification was expected to detect;
- a canonical architecture, physics model, safety boundary, or major assumption
  changes;
- several expensive tests exercise substantially the same workflow;
- a new regression is being added after an escaped defect;
- repeated full-suite runs occur after narrow changes;
- a test is flaky, non-diagnostic, obsolete, or dependent on a rejected design.

Do not run the full suite merely to begin the review. Use existing timing logs,
JUnit receipts, build metadata, preserved failures, and source inspection first.
Keep the review proportional: an ordinary new regression reviews its affected
group and overlaps, not the entire portfolio. Expand to a portfolio-wide review
only for evidence of a systemic problem. Do not create a recurring full-audit
or documentation obligation for every edit.

## Review method

For each expensive or suspicious group, determine:

1. What exact current contract does it establish?
2. Is its oracle independent, or does it only agree with the same
   implementation assumptions?
3. Which real defect, known-bad revision, or bounded mutation does it detect?
4. Does a smaller deterministic invariant establish the same contract?
5. Does another test dominate or duplicate it?
6. Does it exercise production code or a parallel harness?
7. Are its assumptions still canonical?
8. Should it remain active, become periodic or historical, be superseded, or
   be retired?

Use authentic known-bad FAIL and corrected PASS evidence where available. Never
fabricate a red witness. A bounded mutation pilot is useful when it tests oracle
sensitivity; do not mutate an entire project merely to produce a score.

## Admission of new regression tests

When adding a regression after a defect:

1. Preserve the user-visible or contract-visible failure.
2. Prefer the smallest deterministic reproducer and independent property.
3. Demonstrate known-bad FAIL and corrected PASS when reproducible evidence
   exists; otherwise state why it is unavailable.
4. Record what existing tests missed and why.
5. Check whether the new test replaces or makes another test redundant.
6. Add another complete end-to-end journey only when it establishes a distinct
   integration contract that smaller tests cannot.

A defect should normally improve the portfolio, not merely increase its size.

## Preservation, consolidation, and retirement

Preserve immutable historical PASS and FAIL records, accepted human decisions,
known-bad identities, and the reason for consolidation or retirement. Do not
rewrite old evidence to make a new portfolio appear cleaner.

Preservation does not require permanent execution or permanent source retention.
Depending on reproducibility needs, a test may be:

- kept active under a cheaper or clearer selection;
- merged with overlapping tests;
- replaced by a stronger independent oracle;
- moved to a manual or periodic diagnostic path;
- retained as a historical reproducer outside default registration;
- removed after its contract becomes obsolete or a replacement is established.

Do not weaken a still-current oracle merely to meet a time budget. Uncertain
value alone does not authorize demotion. Keep required coverage active until
replacement evidence, contract obsolescence, or an authorized risk decision
justifies a change. A periodic check is not a substitute for a current blocking
requirement. Review uncertain cost without automatically rerunning the suite.

No previous failure, no unique hit in a small mutation sample, or passing the
same few known-bad cases is not proof of redundancy. Compare current contracts,
input boundaries, environments, integration paths, and failure modes before
claiming equivalent coverage. Never hide a known failing requirement by
relabeling its only test.

Before deleting source or fixtures, verify that the exact retained revision or
artifact actually contains them. Git history does not preserve uncommitted
files. Keep required reproduction inputs recoverable and record the location.

## Upgrade expectation

Updating to framework 1.2.4 or later does not automatically rewrite project-owned tests.
Each project must inspect accumulated verification baggage from earlier
framework versions, establish its portfolio and current qualification set, and
make evidence-based consolidation decisions. The framework update itself is not
proof that this cleanup occurred. Do not repeat an already completed review
merely because a maintenance release arrived; reconcile only changed rules and
newly triggered review scope.
