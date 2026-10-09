# Durable records

`records/` preserves retrospective causal/provenance evidence. It is not the live task queue and not a trial-by-trial notebook.

Meaningful records may preserve milestone closeout, a major architecture/schema migration, an established cause, accepted/rejected strategy, blocker resolution, significant human-verification result, or another decision whose loss would be expensive to reconstruct.

Where material, preserve:
- final request/requirement IDs and supersession/correction relations;
- requirement-to-evidence coverage at the recorded checkpoint;
- important implementation/domain decisions and bindings;
- canonical docs/source/research relied upon;
- repository revision/worktree identity;
- automated commands/results/gate/oracle/limitations;
- explicit human decisions and failed human observations spawning follow-up;
- decisive measurements plus references to exhaustive external/private artifacts;
- known limitations/remaining uncertainty;
- retained experience IDs.

Historical test passes apply to the repository state they were recorded against; they are not automatically current after material changes.

Treat completed records as append-only/immutable-ish. Later corrections are dated explicit errata rather than silent rewrites.

Schema migration snapshots may preserve a former live ledger verbatim when necessary to prove stable-ID/history preservation. Such a snapshot is historical provenance, never a competing live ledger.
