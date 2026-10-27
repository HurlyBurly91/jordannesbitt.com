# Risk-Proportionate Local Verification

Status: **normative for framework 1.2.5, schema 2**

This policy governs verification selection, scheduling, and qualification. It
does not alter task IDs, lifecycle phases, human judgment, source integrity, or
project-specific safety contracts.

Read `TEST_PORTFOLIO.md` whenever a project has a material verification-cost
problem, a defect escapes supposedly protective tests, a major architecture
assumption changes, or Tier 3 qualification is being defined or revised.

## Three tiers

**Tier 1 — iteration.** After ordinary edits, run deterministic tests for
touched code and direct consumers, relevant domain or physical invariants, the
reported defect's smallest useful reproducer, and applicable negative cases.
Prefer existing tests over elaborate new harnesses. Seconds to a few minutes is
a target, not permission to skip a mandatory safety check.

**Tier 2 — integration.** After the affected feature stabilizes, exercise the
affected subsystem and plausible cross-boundary regressions, one representative
real application or GUI workflow where relevant, and scoped sanitizer or
hardware coverage when justified. Do not substitute mocks for required real
physics, rendering, scheduling, or execution.

**Tier 3 — stabilized candidate qualification.** Run the project's declared
current qualification set when an active integration, human-review, MVP, or
release contract requires it. The set must establish the current contract with
applicable invariants, subsystem integration, representative end-to-end
behavior, required sanitizers, artifact identity, and human gates. Tier 3 is not
defined as "every test ever accumulated" and is not triggered merely by an
ordinary edit, entering `AUTOMATED_VERIFICATION`, creating a record, committing,
or pushing.

These tiers are not interchangeable. Tier 1 PASS does not imply Tier 3. After a
qualification failure, diagnose the failing tests and affected neighbors first;
rerun the declared qualification set after a new candidate stabilizes rather
than after every intermediate patch.

Hosted cross-platform CI remains a separate explicitly authorized gate under
`ASYNC_EXTERNAL_VERIFICATION.md`.

## Selecting actual tests

1. Inspect registered tests, measured durations, dependencies, shared fixtures,
   affected interfaces, and actual historical failures. Do not classify costs
   or value from filenames alone.
2. Include changed owners, safety or security boundaries, shared numerical
   state, configuration and affected consumers, plus relevant negative cases.
   Widen verification when impact cannot be bounded reliably.
3. Use the project's existing runner. CTest labels, presets, costs, timeouts,
   processors, and resource locks may expose project-owned selections such as
   `FAST`, `INTEGRATION`, `LONG`, `SANITIZER`, and subsystem groups.
4. Separate cheap deterministic invariants from expensive end-to-end voyages,
   while retaining representative real journeys where their distinct contract
   requires them.
5. When focused selection misses a real dependency, expand coverage and record
   the limitation. Never silently assert broader coverage than was executed.

The unfiltered test invocation is a diagnostic capability, not automatically
the acceptance contract. A project may keep periodic or historical checks
available outside the ordinary developer and qualification paths. Superseded or
retired tests may be removed from default registration or source after their
rationale, evidence, replacement, and reproducibility needs are preserved as
defined by `TEST_PORTFOLIO.md`.

## Immutable evidence versus current candidate

A verified `Vxx` states what actually passed at the recorded command and
`Repository-State`. That historical fact remains immutable; its applicability
to a later candidate is separate.

During iteration, completed tasks in the active request, including completed
`Vxx`, are historical rather than automatic current-evidence claims. Unfinished
non-human work explicitly citing `Vxx` in `Requires`, `Blocked-By`,
`Verified-By`, or `Conclusion-Evidence` requests current applicability. In
`HUMAN_VERIFICATION`, the selected human gate (explicit `Next-Gate` or the
sole pending gate) also selects its automated evidence. These are selection
roots: follow their explicit `Requires`/`Blocked-By` prerequisite chains,
including through completed checkpoints. A fresh summary does not make an old
prerequisite fresh. Do not traverse old requirements' `Verified-By` coverage
merely because they precede current work. Unselected human gates and unrelated
historical results do not become current through this rule.

Before presenting a human gate, identify the actual current qualification
checks and list their `Vxx` tasks as explicit `Requires:` prerequisites of the
selected `Hxx`. Verify candidate, source, test, configuration, portfolio, and
qualification-set identity. Generate fresh evidence when needed rather than
rewriting old PASS records. A focused human retest does not imply an unrelated
retest-all cycle.

No automatic source-dependency proof or historical evidence reclassification
is introduced. Strict `W082` and `W083` remain blocking for explicitly current
stale evidence. Contradictory or missing active-request metadata retains
conservative freshness checking. A clean schema validator does not prove the
application or qualification portfolio is sufficient.

## Cost and acceptance

At meaningful gates record actual commands, PASS or FAIL, oracle, coverage,
limitations, candidate identity, elapsed Tier 1, Tier 2, and Tier 3 time, and
the number of broad executions. Distinguish measured savings from projections.

When a human-observed defect escapes active automated verification, treat that
as evidence about the portfolio. Preserve the defect, identify why the old
oracle missed it, add the smallest useful independent check where possible, and
review redundant expensive coverage instead of automatically appending another
long journey.

Never omit a mandated check, weaken an independent oracle, claim unexecuted
tests passed, rewrite historical fingerprints, or self-accept a human gate.
