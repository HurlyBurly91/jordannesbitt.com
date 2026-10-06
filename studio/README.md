# Local Studio

Requires the repository's Node22 runtime (`.nvmrc`). From the checkout:

```bash
npm run studio
```

Open the printed127.0.0.1 URL. The server is local only and is not part of the deployed Astro site. Default repository writing is **disabled**. If the shell still uses Node18, use the temporary runtime documented in docs/operations.md:

```bash
npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run studio'
```

## Normal workflow

1. **Artworks & media:** explicitly select one/multiple files, inspect the local file preview and choose private media/reference, separate artwork, or attachment to an owner-selected existing work. Untagged images need explicit sRGB interpretation. Watch intake progress/errors; originals are never changed.
2. Open a draft. Enter its real title/date/medium/kind/alt and optional process/materials/context/typed physical sizes. Reproduction roles/order are explicit; reference-only images can stay unattached. Unknown facts are absent, not guesses. The selected M09 snapshot can be used one ID at a time without promoting its provisional metadata/groups.
3. **Projects:** enter concise authored context and use member Up/Down controls. **Curation:** order Selected Work and choose the unique homepage lead. Public visibility here is only intent in a private working copy.
4. **Preview & export:** build current-production-component pages; open artwork/project/selection/home/archive/medium links. Draft disclosure/noindex stays visible. Mark the current record reviewed only after actual local review; this is separate from rights/source approval.
5. Review exact canonical record/derivative URLs. Explicitly confirm reproduction rights and public Git disclosure, then type **APPROVE PUBLIC SOURCE**. Changed public facts/media/curation invalidate this exact approval.
6. Select exact approved records and prepare a **dry-run export**. Inspect canonical JSON, derivative hashes/sizes and every Git-visible path. Private notes/source paths/masters/reference-only media are excluded. Missing/stale approvals or invalid relationships stop the operation.

## Deliberate public-source writes

Only the owner should enable actual repository writes after granting source/privacy/content approval for the specific records:

```bash
npm run studio -- --allow-public-export
```

This startup grant alone does not approve any record. Each still needs local review, exact source/rights confirmation and a current dry-run. Type **EXPORT <displayed-token>** to write the listed `src/content/artworks.json`, `src/content/projects.json` and referenced `src/media/...` paths. The tool checks development branch/current checksums, stages/backups/journals privately and stops on collisions/concurrent edits. It never commits/pushes, modifies master, deploys, sends messages or creates owner launch-manifest approval. The actual release gate remains until separate M09 real-content/launch approval.

## Private storage and recovery

State/media/uploads/notes/previews/approval digests/export journals live under `~/.local/share/jordannesbitt-art/m09/studio`; the existing parent `id-registry.json` preserves neutral identities. An approved persistent alternative uses `JORDANNESBITT_M09_DATA`, not /tmp or public Git. Back up both studio state and the parent registry/snapshots. Never copy private `state.json` or original media into Git.

Ctrl+C shuts down owned local servers/jobs. Incomplete jobs are errors on restart, not complete artworks. An unclean process can leave a private lock/export journal: verify/stop its recorded process and reconcile it explicitly, never delete the neutral registry or reset drafts to bypass a collision. Interrupted export journals block further writes until reconciled; unrelated/concurrent target edits are preserved. Schema validity is not rights, public-source, colour, visual or launch acceptance.
