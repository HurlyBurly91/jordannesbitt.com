# Durable records

`records/` preserves permanent provenance. It is not a running laboratory notebook and is not authoritative live execution state.

Meaningful intermediate checkpoint records are appropriate when losing the causal conclusion would be expensive to reconstruct, for example:

- cause established;
- strategy or architecture accepted/rejected;
- blocker discovered/resolved;
- significant human-verification result;
- major recovery/state-machine migration.

Do not append prose for every failed experiment, capture, parameter value, or analyzer run. Keep exhaustive raw evidence in generated JSON/TSV/CSV/log/capture/analysis artifacts and preserve only the decisive conclusion/evidence reference/limitations needed for provenance.

Final `records/Mxx-*.md` milestone closeout is written only after all required automated and human acceptance passes. Preserve final stable IDs, supersession links, important decisions, verification evidence, explicit human results, known limitations, and authorized checkpoint references.

Pending/current state belongs in `STATUS.md` and `TASKS.md`. Historical records are loaded selectively when provenance is needed, not by default.
