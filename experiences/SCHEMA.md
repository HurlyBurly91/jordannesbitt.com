# Experience Schema

Canonical experience store:

```text
experiences/experiences.jsonl
```

Canonical retrieval telemetry:

```text
experiences/retrievals.jsonl
```

Both are JSON Lines: one JSON object per nonblank line.

The experience store contains selected evaluated precedents, not raw conversation history, active requirements, or every execution event.

## Experience object

Recommended shape:

```json
{
  "id": "E0001",
  "kind": "episode",
  "domain": ["presentation"],
  "tags": ["human-verification"],
  "origin": {
    "milestone": "M09",
    "requests": ["M09-R2"]
  },
  "context": {
    "phase": "HUMAN_VERIFICATION",
    "observation": ["automated proxy passed", "human-visible requirement failed"]
  },
  "decision": {
    "type": "requirement_refinement",
    "summary": "Validate observable behavior rather than relying on the internal proxy."
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
  "applies_when": ["automated proxy succeeds while human-visible requirement fails"],
  "evidence": {
    "tasks": ["M09-R2-H01"],
    "source": ["automated-test", "human-verification"]
  },
  "confidence": {
    "level": "high",
    "basis": ["explicit human observation", "automated regression evidence"]
  },
  "status": "active"
}
```

## Stable experience IDs

Use `E0001`, `E0002`, ... . Do not encode milestone identity in the primary experience ID. Link chronology through `origin`. IDs never silently change meaning.

## Kinds

Initial kinds are `episode` and `heuristic`. An episode is a specific evaluated case. A heuristic is a generalized pattern supported by unusually strong or repeated evidence. Do not create a separate heuristic subsystem without demonstrated need.

## Outcome vocabulary

Recommended values: `SUCCESS`, `SUCCESS_WITH_FOLLOWUP`, `PARTIAL_SUCCESS`, `FAILURE`, `INCONCLUSIVE`, `SUPERSEDED`.

## Experience status

Use `active`, `stale`, or `superseded`. Superseded cases remain for provenance but are excluded from ordinary retrieval. Stale cases may still be useful but rank below directly applicable active ones.

## Confidence

Use coarse evidence quality: `low`, `medium`, or `high`. Confidence is not a calibrated probability.

## Retention test

Retain only when all are true:

1. something materially informative happened;
2. the outcome has enough evidence to evaluate;
3. there is plausible future reuse value.

Otherwise do not add precedent. Individual trials inside an unresolved investigative loop are not experiences.

## Retrieval telemetry

Example:

```json
{
  "retrieval_id": "X0001",
  "milestone": "M09",
  "request": "M09-R9",
  "decision": "choose migration strategy",
  "retrieved": ["E0002"],
  "used": ["E0002"],
  "assessment": {
    "E0002": "helpful"
  },
  "decision_outcome": "SUCCESS"
}
```

Preserve the concepts: retrieved, used, helpful/neutral/misleading, and resulting decision outcome. Telemetry is diagnostic and non-authoritative. Write it only when retrieval actually occurs.
