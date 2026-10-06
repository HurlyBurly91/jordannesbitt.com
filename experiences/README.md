# Experience Store

This directory is the optional experimental precedent-memory layer.

```text
SCHEMA.md
    field meanings and retention rules

experiences.jsonl
    selectively retained evaluated precedents

retrievals.jsonl
    minimal diagnostic telemetry about retrieval/usefulness
```

Do not put active requirements here.
Do not put general project history here.
Do not load the entire store into every session.

The baseline project state in `STATUS.md`, `TASKS.md`, milestone specs, `docs/`, and `records/` must remain sufficient when this layer is disabled.

This project migrated to the experience-augmented architecture on 2026-10-06. No pre-existing experience store existed, so the JSONL files intentionally begin empty rather than fabricating precedent from historical records.
