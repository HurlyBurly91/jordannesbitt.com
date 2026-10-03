# Tasks

```yaml
Milestone: M00
State: ACTIVE
Phase: AUTOMATED_VERIFICATION
Active-Request: M00-R1
Specification: milestones/M00-preparation.md
```

## M00-R1 — Prepare autonomous website development

Source: USER, 2026-10-03. Recover the local checkout, conform this repository to the durable-state prototype, expand earlier website research with established fine-artist examples, and prepare milestones for OpenCode using the owner's Sol 6.1 Max selection. Prepare now; implementation begins after the owner approves starting.

- [x] M00-R1-01 Recover the prior checkout and provide safe update/bootstrap instructions.
  Evidence: September 14 session recorded /home/jordan/jordannesbitt.com on wilco3. Present existence is not observable here; docs/operations.md provides a non-destructive reuse-or-clone command.
- [x] M00-R1-02 Adapt the actual baseline prototype, preserving state/phase separation, stable IDs, human re-entry and selective canonical references.
  Evidence: AGENTS.md and RUN_PROMPT.txt identify the inspected upstream template blobs.
- [x] M00-R1-03 Reconstruct and extend the website plan using source-backed research.
  Evidence: PROJECT.md, docs/research.md and the domain contracts distinguish the recovered brief, new observations and proposed adaptations.
- [x] M00-R1-04 Define executable milestones with acceptance criteria and review boundaries.
  Evidence: milestones/M00-preparation.md through milestones/M11-commerce.md. M01-M08 are technical scope; M09 requires content/visual acceptance; M10 requires release authorization; M11 is deferred.
- [x] M00-R1-P01 Preserve runtime source, dependency lockfile, identity, existing artwork assets, master and backup branches during preparation.
  Source: USER and existing repository policy.
  Verification: M00-R1-V01 must confirm the actual remote diff and unchanged protected-by-policy refs.
- [x] M00-R1-P02 Do not publish, launch an implementation agent, infer confidential content permission, choose prices or authorize paid services.
  Evidence: Preparation-only grant in AGENTS.md; no runtime model identifier fabricated.
- [ ] M00-R1-V01 Verify committed file inventory, contract references, synchronized state headers and additive documentation-only diff; confirm master and backup refs unchanged.
  Verification: Inspect remote tree and compare against 8fc3176b9d906b2f7794237a0fab75c91a6b61b4. Do not substitute this for npm/build/browser verification; those are M01/M08 work.
- [H] M00-R1-H01 Owner approves the plan and grants the bounded implementation run.
  Verification: Explicit approval of starting on redesign/astro-foundation, the staged content target and allowed checkpoint commits/pushes. Do not infer this acceptance from the planning request or a bare resume.

The initial permission covers this documentation setup only. On approval, preserve its scope in the M00 closeout, initialize M01-R1 from that milestone's contract, and retain release/content gates. New feedback receives M00-R2 rather than silently rewriting accepted requirements.
