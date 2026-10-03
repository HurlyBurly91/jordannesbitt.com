# Tasks

```yaml
Milestone: M00
State: ACTIVE
Phase: HUMAN_VERIFICATION
Active-Request: M00-R1
Specification: milestones/M00-preparation.md
```

## M00-R1 — Prepare autonomous website development

Source: USER, 2026-10-03. Recover the local checkout, conform this repository to the durable-state prototype, expand earlier website research with established fine-artist examples, and prepare milestones for OpenCode using the owner's Sol 6.1 Max selection. Prepare now; implementation begins after the owner approves starting.

- [x] M00-R1-01 Recover the prior checkout and provide safe update/bootstrap instructions.
  Evidence: September 14 session recorded /home/jordan/jordannesbitt.com on wilco3. Present existence is not observable here; docs/operations.md provides a non-destructive reuse-or-clone command. bash -n passed; six mocked scenarios passed: existing checkout, absent checkout, dirty checkout, wrong origin, failed pull and failed clone. No command was executed on the owner's computer.
- [x] M00-R1-02 Adapt the actual baseline prototype, preserving state/phase separation, stable IDs, human re-entry and selective canonical references.
  Evidence: AGENTS.md and RUN_PROMPT.txt identify the inspected upstream template blobs.
- [x] M00-R1-03 Reconstruct and extend the website plan using source-backed research.
  Evidence: PROJECT.md, docs/research.md and the domain contracts distinguish the recovered brief, new observations and proposed adaptations.
- [x] M00-R1-04 Define executable milestones with acceptance criteria and review boundaries.
  Evidence: milestones/M00-preparation.md through milestones/M11-commerce.md. M01-M08 are technical scope; M09 requires content/visual acceptance; M10 requires release authorization; M11 is deferred.
- [x] M00-R1-P01 Preserve runtime source, dependency lockfile, identity, existing artwork assets, master and backup branches during preparation.
  Source: USER and existing repository policy.
  Evidence: M00-R1-V01 comparison and inspected refs; preparation introduces documentation only.
- [x] M00-R1-P02 Do not publish, launch an implementation agent, infer confidential content permission, choose prices or authorize paid services.
  Evidence: Preparation-only grant in AGENTS.md; no runtime model identifier fabricated.
- [x] M00-R1-V01 Verify committed file inventory, contract references, synchronized state headers and additive documentation-only diff; confirm master and backup refs unchanged.
  Evidence: GitHub comparison of 8fc3176b9d906b2f7794237a0fab75c91a6b61b4 to preparation commit 2bd4a2644ffd3f13d9a0bd2e8def9bfeeea8bcf1 reports exactly 25 added documentation files and no modified/deleted runtime files. PROJECT.md contract paths match that inventory; STATUS.md/TASKS.md readback headers agree. Branch readback preserves master 755df7fee1a515388a035fce8e9e672070a1d2b4 and backup 3bc95c75bbe85918ce10498af31a751e2cf58fc6. This subsequent checkpoint only records verification and changes both active phases to HUMAN_VERIFICATION.
  Limitation: Documentation inspection and mocked bootstrap tests are not npm/build/browser verification. The preparation environment could not resolve github.com for a clone. M01 must reproduce the actual application baseline; later CI results must be recorded as separate evidence if observed.
- [H] M00-R1-H01 Owner approves the plan and grants the bounded implementation run.
  Verification: Explicit approval of starting on redesign/astro-foundation, the staged content target and allowed checkpoint commits/pushes. Do not infer this acceptance from the planning request or a bare resume.

The initial permission covers this documentation setup only. On approval, preserve its scope in the M00 closeout, initialize M01-R1 from that milestone's contract, and retain release/content gates. New feedback receives M00-R2 rather than silently rewriting accepted requirements.
