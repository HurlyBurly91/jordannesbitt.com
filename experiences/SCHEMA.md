# Experience Schema

Canonical experience store:

```text
experiences/experiences.jsonl
```

Canonical retrieval telemetry:

```text
experiences/retrievals.jsonl
```

Both are JSON Lines: one JSON object per line.

The store contains selected evaluated precedents—not raw conversation history,
active task state, or every execution event. The baseline workflow must remain
fully resumable when this store is absent or retrieval is disabled.

## Core rule: persistence is not validity

A remembered diagnosis, implementation choice, or passing test may become stale
when the repository changes. Code-dependent experiences should therefore record
the repository state and material entities that made the evidence valid.

Before reuse, validate those bindings against the current repository. The whole
repository need not be identical. The material files, symbols, tests,
configuration, docs, or source evidence on which the lesson depends must still
align.

If a material condition changed or cannot be verified:

```text
do not automatically reuse the experience
    ↓
read current artifacts / rerun verification / re-evaluate applicability
    ↓
use only after revalidation, or classify it stale/superseded
```

## Experience object

Recommended shape:

```json
{
  "id": "E0001",
  "kind": "episode",
  "domain": ["rendering"],
  "tags": ["human-verification", "presentation"],
  "origin": {
    "milestone": "M01",
    "requests": ["M01-R2"],
    "record": "records/M01-example.md"
  },
  "repository_state": {
    "head": "0123456789abcdef",
    "worktree_clean": true,
    "workspace_diff_sha256": null,
    "bindings": [
      {
        "kind": "file",
        "path": "src/render.cpp",
        "content_sha256": "...",
        "role": "implementation"
      },
      {
        "kind": "symbol",
        "path": "src/render.cpp",
        "name": "Renderer::present",
        "role": "decision-context"
      },
      {
        "kind": "test",
        "path": "tests/test_render.cpp",
        "name": "full_frame_is_presented",
        "command": "ctest --test-dir build -R full_frame_is_presented",
        "role": "verification"
      },
      {
        "kind": "doc",
        "path": "docs/render-contract.md",
        "role": "canonical-rule"
      }
    ]
  },
  "context": {
    "phase": "HUMAN_VERIFICATION",
    "observation": [
      "automated proxy passed",
      "human-visible requirement failed"
    ]
  },
  "decision": {
    "type": "requirement_refinement",
    "summary": "Validate observable behavior rather than only the internal proxy."
  },
  "action": {
    "summary": "Changed implementation and verification to target observable behavior."
  },
  "outcome": {
    "status": "SUCCESS_WITH_FOLLOWUP",
    "observations": ["observable behavior improved"]
  },
  "lesson": {
    "prefer": ["verify user-visible acceptance criteria directly where practical"],
    "avoid": ["assuming an internal proxy guarantees presentation quality"]
  },
  "applies_when": [
    "automated proxy succeeds while human-visible requirement fails"
  ],
  "evidence": {
    "tasks": ["M01-R1-H01", "M01-R2-01", "M01-R2-H01"],
    "docs": ["docs/render-contract.md"],
    "sources": [],
    "tests": [
      {
        "command": "ctest --test-dir build -R full_frame_is_presented",
        "result": "PASS",
        "oracle": "independent-existing-regression"
      }
    ],
    "human": ["M01-R2-H01 accepted"]
  },
  "relations": {
    "depends_on": [],
    "corrects": [],
    "supersedes": []
  },
  "confidence": {
    "level": "high",
    "basis": ["explicit human observation", "independent regression evidence"]
  },
  "status": "active"
}
```

Fields are optional unless needed to preserve meaning. Do not fabricate hashes,
symbol names, test independence, or clean-worktree claims merely to complete the
shape.

## Stable identity and relations

Experience IDs are repository-stable:

```text
E0001
E0002
E0003
...
```

Do not encode milestone identity into the primary ID. Link chronology through
`origin`.

IDs never silently change meaning. A later correction creates a new experience
and an explicit `corrects` or `supersedes` relation. Temporal order alone does
not establish replacement.

Useful relation types:

```text
depends_on
verifies
corrects
supersedes
```

The JSON example keeps a minimal relation object; projects may add `verifies`
when it provides material value.

## Kinds

Initial kinds:

```text
episode
heuristic
```

An `episode` is one evaluated case. A `heuristic` is a generalized pattern
supported by unusually strong or repeated evidence. Do not create a separate
heuristic subsystem until measured need justifies it.

## Repository-state bindings

Use bindings for the entities whose state materially affects applicability:

```text
file
symbol
test
doc
source
configuration
data
```

A binding may include a path, qualified symbol/test name, content/blob hash,
command, source ID, or other stable locator. Prefer the smallest set that can
invalidate the claim correctly; binding every repository file creates noise.

For a clean checkpoint, `head` may be sufficient together with entity
locators/hashes. For a dirty checkpoint, record HEAD plus a reproducible patch
or diff hash when practical. If exact state cannot be reconstructed, say so.

Applicability results are separate from lifecycle status:

```text
aligned
changed
unverifiable
superseded
```

- `aligned`: material source conditions still hold.
- `changed`: at least one material binding changed; revalidation is required.
- `unverifiable`: current tools/evidence cannot establish alignment.
- `superseded`: an explicit later relation replaces the experience for the
  current decision frontier.

Changed or unverifiable evidence may still be useful historically, but it must
not be silently presented as current proof.

## Outcome and lifecycle vocabulary

Recommended outcome values:

```text
SUCCESS
SUCCESS_WITH_FOLLOWUP
PARTIAL_SUCCESS
FAILURE
INCONCLUSIVE
SUPERSEDED
```

Experience lifecycle status:

```text
active
stale
superseded
```

Preserve stale/superseded experience for provenance. Exclude superseded cases
from ordinary retrieval and down-rank stale cases unless the query explicitly
asks for historical failures or corrections.

## Confidence

Use coarse evidence quality:

```text
low
medium
high
```

Confidence is not a calibrated probability. Repository alignment and
confidence answer different questions: a high-confidence lesson can still be
stale after its source conditions change.

## Verification evidence

Where verification materially supports the lesson, record oracle provenance:

```text
independent-existing-regression
property-or-invariant
integration-or-end-to-end
static-analysis
same-change-generated-test
human-observation
external-reference-comparison
```

A same-change generated test is evidence but is not automatically independent
proof. Record actual commands/results and limitations rather than only saying
"tests passed."

## Retention test

Before appending an experience:

```text
Did something materially informative happen?
        ↓ yes
Was the outcome evaluated?
        ↓ yes
Is there plausible future reuse value?
        ↓ yes
Can its applicability conditions be stated?
        ↓ yes
retain
```

Otherwise retain nothing. Routine compilation, typo fixes, ordinary passing
tests, and individual trials inside an open investigative loop are not
experiences.

## Retrieval and adaptation

Retrieve only a few relevant candidates. Validate repository bindings before
restoring code-dependent evidence. Compare current similarities, differences,
assumptions, and lifecycle.

A retrieved experience is input to a **current bounded guide**, not an authority
or a plug-in procedure. Transfer the lesson; do not blindly replay old actions.

## Retrieval telemetry

Example:

```json
{
  "retrieval_id": "X0001",
  "milestone": "M02",
  "request": "M02-R3",
  "decision": "choose render smoothing strategy",
  "repository_head": "fedcba9876543210",
  "retrieved": ["E0002", "E0007"],
  "repository_validation": {
    "E0002": "aligned",
    "E0007": "changed"
  },
  "restored": ["E0002"],
  "used": ["E0002"],
  "assessment": {
    "E0002": "helpful"
  },
  "decision_outcome": "SUCCESS"
}
```

Preserve these concepts:

```text
retrieved candidates
repository applicability result
which evidence was restored
which precedent materially influenced the decision
helpful / neutral / misleading once observable
resulting decision outcome
```

Do not create retrieval telemetry when no retrieval occurred. Telemetry is
diagnostic and non-authoritative; derived indexes/counters must be rebuildable.
