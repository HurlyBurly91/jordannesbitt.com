# Project Agent Policy

Framework-Policy: .durable-state/framework/AGENTS.md

Before substantive work, read and obey the versioned framework policy above. This root file is project-owned specialization for the **experience-augmented durable-state architecture**. Project rules may narrow or extend the framework but may not silently weaken its durability, provenance, verification, security, evidence, or human-acceptance invariants.

Do not edit `.durable-state/framework/` or `.durable-state/MANIFEST` during ordinary project work. They are updater-owned. The installed release is framework 1.1.4 / schema 2 from authoritative `HurlyBurly91/durable-state-machine` main commit `9011fe01630e951b0602dd2c02a8fd250f98a85c`.

## Repository and product scope

This repository is Jordan Nesbitt's static Astro artist website. Product direction and roadmap live in `PROJECT.md`; current execution lives in `STATUS.md` and `TASKS.md`; milestone contracts live in `milestones/`.

Work only on `redesign/astro-foundation` unless separately instructed. `master` and `backup/pre-astro-redesign` are protected-by-policy historical/release refs.

Canonical project documents are indexed by `docs/README.md`:
- `docs/catalogue.md`: catalogue, relationships, publication/confidentiality.
- `docs/design.md`: artwork-led presentation and curation.
- `docs/acquisition.md`: availability, enquiries, editions and later commerce.
- `docs/quality.md`: accessibility, performance and verification evidence.
- `docs/operations.md`: runtime, Git, release and environment constraints.
- `docs/research.md`: dated research evidence/derived design rationale.
- `docs/studio.md`: local private Studio behavior and invariants.

Read only relevant canonical docs. Preserve every BEGIN CANONICAL ALGORITHM / Reference / END binding.

## Current project gates

M01-M08 technical completion does not approve public content, artistic presentation or release. M09 remains the owner content/usability/rights/curation gate. M10 requires a separate explicit release grant. M11 transactional commerce is deferred and separately authorized.

The public catalogue/release guards remain authoritative. `release:check` being BLOCKED_CONTENT is expected until explicit real-content approval. Do not infer approval from schema validity, tests, local previews, silence, or historical implementation.

## Authorization and Git

The owner requires explicit permission for repository modifications.

The 2026-10-09 instruction authorizes this in-place durable-state framework/schema migration and verified checkpoint commits/pushes on `redesign/astro-foundation`. It does not authorize application behavior changes, public content approval, master/backup mutation, deployment, DNS/hosting changes, real messages, purchases, payments, or M10/M11 work.

Historical bounded M09 implementation grants remain exactly as recorded; this migration does not expand them.

Before writes, inspect branch/origin/worktree/remote state. Preserve unrelated work. Never auto-stash, reset, clean, rebase shared history, force-push or delete branches. A rejected push or concurrent writer requires reconciliation, never overwrite.

At an authorized semantic checkpoint, inspect the intended diff, run `git diff --check`, stage only intended paths, commit a specific checkpoint and push the same development branch without force.

## Runtime and verification

Node requirement: >=22.12.0. Verified project work has used Node 22.23.3 / npm 10.9.9.

Primary commands:
- `npm run state:check`: strict framework schema-2 validation plus project-specific durable checks.
- `npm run build`: Astro check/build.
- `npm run verify`: state validation + build + project test suite.
- `npm run release:check`: independent content/release gate.
- `npm run studio`: loopback-only private authoring UI.

Do not weaken or rewrite tests merely to satisfy the migration. For policy-only changes, use verification proportionate to the changed surface and preserve previous application evidence honestly.

## Model effort policy

Default project agent work to **GPT-6.1 Sol LOW**.

Do not routinely ask the owner to choose effort. Escalate only when the next specific section has unusually high numerical/physics, architectural, concurrency, security, destructive-data or difficult-debugging risk.

Before such a section, say exactly:

`MODEL LEVEL: HIGH — <one-sentence reason>`

Use HIGH only for that section. Effort escalation never expands repository, publication, destructive-action, external-effect or human-approval authority.

When the high-risk section is complete, say exactly:

`MODEL LEVEL: LOW — safe to return to default.`

Then resume LOW.

## Privacy and external effects

This repository is public. `published:false` and `noindex` are not confidentiality controls.

Do not commit private drafts, master media, buyer information, credentials, order records, private conversations, local Studio state, private review screenshots, source-linked private metadata, or unapproved real artwork derivatives.

Authorized M09 private state lives under `~/.local/share/jordannesbitt-art/m09`. Synthetic/disposable caches may use `/tmp/opencode`. Never broadly scan the home directory or unrelated reference libraries.

No real email, payment, newsletter subscription, purchase, stock mutation, public upload, production deployment, Search Console action, analytics activation, DNS change or hosting mutation during ordinary development. Use mocks and loopback previews. Never invent artwork titles, dimensions, prices, availability, editions, exhibitions, provenance, rights, scarcity, testimonials or biographical facts.

## Experience and evidence specialization

Experience retrieval is disabled by default for this project unless a material decision would benefit from precedent and the current task explicitly enables it. The baseline workflow must remain fully resumable with experience retrieval disabled.

Historical M09 implementation detail and the complete pre-schema-2 ledger are preserved under `records/`. Do not rehydrate old completed tasks into the live ledger merely to recreate chronology. Restore only currently relevant unresolved gates or evidence needed for safe execution.

Schema-2 evidence must use real coverage/oracle/repository-state facts. Do not fabricate `Verified-By`, `Covers`, test independence, repository hashes, human acceptance or typed conclusions merely to satisfy validation.
