# Agent Operating Policy

This repository uses the **experience-augmented durable-state architecture**.

The ordinary durable-state system remains the known-good control plane. The experience layer is experimental, optional, and advisory. Conversation history is not authoritative durable state. A fresh agent must be able to resume current execution from repository files even when experience retrieval is disabled.

## Durable-state components

- `AGENTS.md`: operating policy.
- `PROJECT.md`: product direction and roadmap, not a progress log.
- `STATUS.md`: minimal current milestone/state/phase/active-request pointer.
- `TASKS.md`: bounded canonical live execution ledger.
- `milestones/`: stable milestone acceptance contracts.
- `records/`: durable provenance for meaningful causal checkpoints and milestone closeout, not a running laboratory notebook.
- `docs/`: canonical cross-milestone domain rules, loaded selectively.
- `experiences/`: optional reusable precedent plus retrieval telemetry; never authoritative current state.
- `RUN_PROMPT.txt`: deterministic reconstruction procedure.

Do not introduce competing `TODO.md`, `PLAN.md`, `PROGRESS.md`, `CONTEXT.md`, `MEMORY.md`, `DECISIONS.md`, `ACTIVE_REPAIR.md`, or `LESSONS.md` files unless an explicit architecture change replaces this model. `experiences/` is not a general notes directory.

## Authority and reconstruction

Use this precedence:

```text
latest explicit user instruction
        ↓
TASKS.md representation of that instruction
        ↓
active milestone specification / repository policy
        ↓
applicable docs/ canonical truth
        ↓
current execution evidence
        ↓
relevant precedent
        ↓
general model intuition
```

Project direction in `PROJECT.md` remains binding where the higher-precedence sources do not override it. Experience records may never override user intent, milestone requirements, repository invariants, or current evidence.

Before substantive work, read `PROJECT.md`, `STATUS.md`, the referenced milestone contract, and `TASKS.md`. Read only domain documents needed for the current work. Inspect branch/origin/worktree/remote state before repository changes. If durable files disagree, repair durable state before substantive implementation.

Persist every materially new or changed user requirement in `TASKS.md` with a stable ID **before implementation code is changed for it**.

## Stable IDs, state, and phase

Use stable request groups `Mxx-R1`, `Mxx-R2`, etc. Recommended namespaces are:

- `Mxx-R1-01`: explicit user requirement.
- `Mxx-R1-P01`: preservation constraint.
- `Mxx-R1-D01`: derived implementation/investigative task.
- `Mxx-R1-V01`: automated verification.
- `Mxx-R1-H01`: human verification.

Label sources USER or DERIVED when useful. IDs never silently change meaning. Replaced requirements remain `SUPERSEDED` with an explicit replacement link or explanation. Do not renumber live or historical IDs to resemble a template.

Allowed milestone states: `NOT_STARTED`, `ACTIVE`, `BLOCKED`, `COMPLETE`.

Allowed active phases: `IMPLEMENTATION`, `AUTOMATED_VERIFICATION`, `HUMAN_VERIFICATION`, `FOLLOW_UP`.

Task states:

```text
[ ] OPEN
[~] IN_PROGRESS
[?] BLOCKED
[H] AWAITING_HUMAN
[x] VERIFIED
[-] SUPERSEDED
```

`STATUS.md` and the `TASKS.md` header must agree and must describe what is actually happening now. Update `STATUS.md` when milestone State, Phase, or Active-Request changes. Do not update it merely because another capture, measurement, parameter trial, analyzer run, or expected failure occurred.

Human verification is `ACTIVE / HUMAN_VERIFICATION`, never a fabricated terminal state. Passing automation does not satisfy subjective or explicitly human acceptance.

If human feedback creates implementation or automated-verification work:

```text
ACTIVE / HUMAN_VERIFICATION
        ↓
persist a new request group
        ↓
ACTIVE / FOLLOW_UP
        ↓
ACTIVE / IMPLEMENTATION
        ↓
ACTIVE / AUTOMATED_VERIFICATION
        ↓
ACTIVE / HUMAN_VERIFICATION
```

Preserve unresolved older human-verification tasks throughout follow-up. A human-observed defect normally creates a new request group; routine observations inside one already-persisted investigative question do not.

## Investigative transaction granularity

Durable state is a recovery mechanism for expensive-to-reconstruct decisions. It is not a requirement to turn every experimental observation into a repository transaction.

Treat repeated work as one bounded investigative loop when it serves one persisted request/task, asks the same underlying question, and does not change the user-facing requirement, acceptance criteria, preservation constraints, milestone scope, active request, or execution phase.

Inside such a loop:

- reuse the existing request group and normally one existing derived task;
- do not allocate a new request/task ID for each frame, sample, parameter value, candidate implementation, or failed trial;
- do not mutate `STATUS.md` for each observation;
- do not append `records/` prose for each trial;
- do not retrieve experiences for routine trial-to-trial iteration;
- do not require a Git commit/push for each trial;
- keep exhaustive measurements in generated JSON/TSV/CSV/log/capture/analysis artifacts;
- keep only resume-critical conclusions, decisive evidence, material uncertainty, artifact/reproduction reference when useful, and next direction in `TASKS.md`.

Checkpoint durable state when losing the current decision would be materially expensive to reconstruct. Typical boundaries include a new/changed requirement, a causal conclusion that changes direction, accepted/rejected strategy or architecture, blocker discovery/resolution, transition into/out of a human gate, long interruption/handoff, or risky operation whose preceding reasoning must survive failure.

Context growth, another frame, another parameter, or another expected failed capture is not itself a checkpoint boundary.

## Canonical domain rules

Stable cross-milestone domain rules live under `docs/` and are loaded on demand. Never preload the entire docs tree.

Source regions may declare their canonical reference using host-language comments:

```text
// BEGIN CANONICAL ALGORITHM: <descriptive name>
// Reference: docs/<document>.md
... implementation ...
// END CANONICAL ALGORITHM: <descriptive name>
```

Before inspecting for modification, moving, or refactoring a marked implementation:

1. read the named document;
2. preserve documented invariants unless the current persisted requirement explicitly changes them;
3. move BEGIN / Reference / END markers with the implementation;
4. update the referenced document in the same work if an accepted requirement changes the invariant;
5. never remove/weaken the reference merely because surrounding architecture changes.

Milestone contracts may classify domain dependencies as READ, MAY MODIFY, and MUST PRESERVE. Reconcile accepted canonical-domain changes before milestone closeout.

## Experience layer

Experience memory stores small evaluated precedents, not requirements or general history:

```text
context → decision → action → observed outcome → lesson → future applicability
```

Canonical files are `experiences/experiences.jsonl` and `experiences/retrievals.jsonl`; schema and retention rules are in `experiences/SCHEMA.md`.

Retrieval is optional. Missing precedent is never a blocker. Retrieve only a small relevant set when precedent may materially alter a non-trivial strategy, for example ambiguous requirement interpretation, human-verification failure, repeated test failure, regression, architecture choice, workflow anomaly, conflicting automated/human evidence, substantial refactor strategy, or choosing among plausible fixes.

For a bounded investigative loop, retrieve at loop entry only when useful. Once strategy is established, skip retrieval for routine trials. Retrieve again only at a strategic boundary such as a changed failure class, evidence conflicting with the causal model, repeated stall, material architecture/topology change, or new human feedback.

Record retrieval telemetry only when retrieval actually occurs. Distinguish retrieved precedent, precedent actually used, helpful/neutral/misleading assessment once observable, and resulting decision outcome.

Do not blindly replay precedent. Compare similarities, differences, assumptions, and applicability. Current requirements/current evidence outrank precedent.

Retain an experience only after a materially informative, evaluated outcome with plausible reuse value. Routine passing tests, typo fixes, compilation, and individual inner-loop trials are not experiences. Do not retroactively fabricate experiences merely because historical records exist.

Experience confidence is coarse (`low`, `medium`, `high`); lifecycle status is `active`, `stale`, or `superseded`. Preserve stale/superseded cases for provenance; exclude superseded cases from ordinary retrieval and down-rank stale cases.

The experience layer must remain separable. Disabling it must not prevent reconstruction, task selection, tests, human gates, milestone completion, or records closeout. If experience retrieval becomes systematically harmful, disable it and continue using baseline durable state.

## Execution and verification

Implement the highest-priority non-blocked work consistent with dependencies and current authorization. A successful build is not proof of visual quality, correct colour, delivered email, inventory accuracy, search indexing, or human acceptance.

Run applicable verification and inspect actual exit codes. Record command/environment/result and material limitations compactly. Missing tools/services are BLOCKED or INCONCLUSIVE, never passing.

Use `npm run state:check` for structural durable-state validation. Full project verification remains `npm run verify` under the documented Node 22 runtime; release behavior remains separately guarded by `npm run release:check`.

M01-M08 are technical delivery contracts; their completion does not approve public content or artistic presentation. Deferred content/visual acceptance remains M09. M10 publication and M11 commerce retain their separate gates.

## Model effort policy

Default project agent work to **GPT-6.1 Sol LOW**.

Do not routinely ask the owner to choose effort. Escalate only when the next specific task has unusually high numerical/physics, architectural, concurrency, security, destructive-data, or difficult-debugging risk.

Before such a section, say exactly:

`MODEL LEVEL: HIGH — <one-sentence reason>`

Use HIGH only for the risky section. Effort escalation never expands Git, publication, destructive-action, external-effect, or human-approval authority.

When that section is complete, say exactly:

`MODEL LEVEL: LOW — safe to return to default.`

Then resume LOW. If the runtime cannot provide a requested level, report that limitation rather than silently substituting another model/effort.

## Authorization and Git policy

The owner requires explicit permission for repository modifications.

Historical grants and their scopes remain recorded in `TASKS.md` and records. The 2026-10-06 M09-R9 instruction explicitly authorizes this durable-state architecture migration, its narrow validation tooling, and verified checkpoint commits/pushes on `redesign/astro-foundation`. It does **not** authorize website publication, public-content approval, master/backup mutation, deployment, DNS/hosting changes, real messages, purchases, payments, or M10/M11 actions.

Work only on `redesign/astro-foundation` unless separately instructed. Before changes inspect origin, branch, working tree, and remote head. Preserve unrelated changes. Never auto-stash/reset/clean/rebase shared history, force-push, or delete branches. Never write `master` or `backup/pre-astro-redesign`, merge a release PR, trigger deployment, change DNS, or mutate hosting accounts without explicit release authorization.

At a semantic checkpoint, inspect `git diff --check` and the intended diff, stage only intended paths, commit a specific checkpoint, and push the same branch without force. A rejected push or concurrent change requires reconciliation, never overwriting.

## External effects and privacy

Repository instructions are not a security sandbox. Keep permissions restrictive for external directories, credentials, paid services, and destructive commands. Do not alter host-wide OpenCode, shell, systemd, GPU, or network configuration. Do not start competing writers in this checkout; read-only research delegation is allowed.

This repository is public. `published:false` and `noindex` are not confidentiality controls. Do not commit private drafts, master media, buyer information, credentials, order records, or private conversation material. Use only explicitly approved input roots; never broadly scan the home/reference library.

No real email, payment, newsletter subscription, purchase, stock mutation, public upload, or production deployment during ordinary tests. Use mocks/local previews. Never invent artwork metadata, credentials, exhibitions, prices, edition sizes, scarcity, testimonials, rights, or provenance.

## Records, closeout, and historical retrieval

`records/` is permanent provenance, not a running trial log. Meaningful checkpoint records may preserve established causes, accepted/rejected strategies or architectures, blocker resolution, significant human-verification results, or other durable conclusions. Raw exhaustive evidence belongs in generated artifacts.

A final milestone closeout record is written only after every required automated and human check passes. At closeout: reconcile applicable docs, preserve final IDs/supersession/decisions/evidence/human results/limitations, evaluate whether any outcome warrants selective experience retention, set the milestone COMPLETE, update PROJECT only at roadmap granularity, commit/push under authorization, and initialize only the next authorized milestone.

Never fabricate human acceptance or write a final closeout while required human checks remain unresolved. Read historical records selectively when provenance is needed. Do not load all records or experiences by default. M11 remains deferred and must not begin automatically after release.

## Prototype provenance

Initial control plane adapted on 2026-10-03 from HurlyBurly91/durable-state-machine baseline template blobs `77f5e91ffd5e8981647044c921879693ef42240c` (AGENTS) and `8f93d8b291726f954e69a2b1c23b1062c96d3c4d` (RUN_PROMPT), with project-specific human-reentry, authorization, privacy, publication, and domain-reference rules.

On 2026-10-06 the live project was migrated in place—without resetting IDs/history/state—to the experimental experience-augmented architecture from HurlyBurly91/durable-state-machine commit `6b3ebc329de5355f6a06c3725438001999786cc8`, reference document blob `ea0ac06328fd87020657d915cbf60a38c22db8a3`, experience-template AGENTS blob `3f6ecdb7a840c6ddccd2c7bd65b6dc6657b85ba7`, and RUN_PROMPT blob `5350e86a359f5e27a07be94e4e21036d1eb6b1f8`. Project-specific rules above specialize that architecture.
