# Project Agent Policy

Framework-Policy: .durable-state/framework/AGENTS.md

Before substantive work, read and obey the versioned framework policy above. This root file is project-owned specialization for the **experience-augmented durable-state architecture**. Project rules may narrow or extend the framework but may not silently weaken its durability, provenance, verification, security, evidence, or human-acceptance invariants.

Do not edit `.durable-state/framework/` or `.durable-state/MANIFEST` during ordinary project work. They are updater-owned. The installed release is framework 1.2.5 / schema 2 from authoritative `HurlyBurly91/durable-state-machine` main commit `77aef9fdfdff892a4bd2d7caf0aff3eb6fb7e5e8`.

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

M01-M08 technical completion does not approve public content, artistic presentation or release. M09 remains the owner content/usability/rights/curation gate. M10 publication requires a bounded owner grant; the authorized 2026-10-26 five-work first release is complete, but that grant does not permit a second deployment or unrelated changes. M11 transactional commerce remains deferred and separately authorized.

The public catalogue/release guards remain authoritative. Before first-release approval, `release:check` correctly returned BLOCKED_CONTENT; the exact owner-approved five-work first release subsequently passed. Any new public source/manifest change requires the applicable explicit content/rights approval. Never infer fresh approval from tests, schema validity, previews, silence, or an earlier publication.

The explicit 2026-10-26 M09-R25 owner grant approves the exact five-work initial portfolio,verbatim prepared About/public contact and launch manifest,and authorizes development commits/push,history-preserving master integration,existing GitHub Pages publication at jordannesbitt.com and live verification. That bounded grant supersedes earlier release stop conditions only for this initial publication. Preserve exact approved media/private data;no prices/payments/commerce,hosting migration or DNS change. Unrelated private-Studio polish may be deferred;inconclusive checks stay inconclusive. Release evidence/rollback is in `records/M09-R25-first-public-release.md`.

## Authorization and Git

The owner requires explicit permission for repository modifications.

The 2026-10-16 owner instructions additionally authorize the managed, same-schema framework updates through 1.2.2 without extending other project permissions. The 2026-10-09 owner instructions authorize the in-place durable-state migrations and managed same-schema framework updates through the then-current consolidated-main 1.1.5 update, including narrow compatibility/provenance/checker edits and verified checkpoint commits/pushes on `redesign/astro-foundation`. It does not authorize application behavior changes, public content approval, master/backup mutation, deployment, DNS/hosting changes, real messages, purchases, payments, or M10/M11 work.

The owner's 2026-10-27 instruction authorizes only this same-schema DSM 1.2.5 maintenance, project verification-policy reconciliation, review, development-branch checkpoint and non-force push. It does not authorize changing the live site, deploying, modifying `master`, commerce, new artwork disclosure, or completing human gates.

Historical bounded M09 implementation grants remain exactly as recorded; this migration does not expand them.

Before writes, inspect branch/origin/worktree/remote state. Preserve unrelated work. Never auto-stash, reset, clean, rebase shared history, force-push or delete branches. A rejected push or concurrent writer requires reconciliation, never overwrite.

At an authorized semantic checkpoint, inspect the intended diff, run `git diff --check`, stage only intended paths, commit a specific checkpoint and push the same development branch without force.

## Runtime and verification

Node requirement: >=22.12.0. Verified project work has used Node 22.23.3 / npm 10.9.9.

Primary commands:
- `npm run state:check`: strict framework schema-2 validation plus project-specific durable checks.
- `npm run build`: Astro check/build.
- `npm run verify`: the named *published-site* Tier 3 qualification (framework state, Astro build, independent real-content gate, active public/media integration selection).
- `npm run verify:all`: the historical broad state/build/unfiltered-test command, now an explicit diagnostic rather than an automatic acceptance requirement.
- `npm run qualify:private-studio`: named private-Studio Tier 3 qualification (no live site publication).
- `npm run release:check`: independent content/release gate.
- `npm run studio`: loopback-only private authoring UI.

Do not weaken or rewrite tests merely to satisfy a framework update. For policy-only changes, use verification proportionate to the changed surface and preserve previous application evidence honestly.

Current selection, status, assumptions, and review triggers are recorded in `docs/verification-portfolio.md` under framework `VERIFICATION_POLICY.md` and `TEST_PORTFOLIO.md`. Tier 1 selects touched invariants and direct consumers; Tier 2 selects affected subsystem/integration and negative cases; Tier 3 runs the declared *current* public-release or private-Studio qualification only at a contract boundary. `npm test` remains an unfiltered diagnostic capability; `npm run verify:all` must not silently replace a named qualification. Do not demote uncertain required tests, reclassify historical PASS/FAIL, or treat automated results as private Studio or owner visual acceptance.

GitHub Actions is the normal external hosted-verification provider for this repository. When a required external run is still non-terminal after an immediate bounded status query and completion is not imminent, follow the framework's EXTERNAL_ASYNC contract: persist exact run/target/check identity, checkpoint, and yield rather than holding an idle polling loop. Pending external execution is never PASS evidence.

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
