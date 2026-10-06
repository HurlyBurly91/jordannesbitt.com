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

1. **Artworks → Add images:** select your photos, then choose **New artwork**, **Another view/detail**, or **Process/reference image**. For another view, click the target artwork's thumbnail and choose how the photo is used. If a photo has no embedded colour profile,explicitly choose **Use sRGB for this image** or **Choose another image**. A batch checkbox can apply to all currentlyselecteduntaggedimages only;nothing is remembered for later selections. Tagged images do not need that question. Originals stay unchanged and no publication is implied. After preparation succeeds,the complete editor opens in the current viewport with Title focused;no half-failed/disabled pending form or repeated error history buries it.
2. Edit the prominent image with its title/date/medium/process/materials/optional dimensions/alt/project/availability. Date may remain unknown. Price appears only when relevant. Optional edition, separate paper/image/framed sizes, condition and technical controls are expandable. Photos are visually ordered; use earlier/later or explicitly choose the primary. **Preview artwork** uses the actual public-site components.
   **Save draft stays clickable** when a field is invalid. Click it to see the local error and move to the first field needing correction; other edits stay intact. Exact/Circa need a year1–9999. Choose Unknown if genuinely unknown; no optional dimension/price/edition/material/process/project/rights facts are required just to save. **Preview artwork shows current edits**: valid edits save privately before preview; invalid edits explain/focus the blocker instead of showing an old saved state or a grey inert button.
3. **Photos & references:** click one/multiple thumbnails, see attached/unattached/reference-only state, and choose a visual target for attachment. Reference photos do not create standalone artwork records. No internal IDs are needed for normal work; frozen-snapshot/ID/hash controls remain Technical details.
4. **Projects:** choose artwork thumbnails, add/remove and move earlier/later, enter concise context, then **Preview project**. **Selected Work & homepage:** arrange thumbnails and choose the homepage image from photos; preview each directly. Everything remains draft until deliberately prepared for the public site.
5. **Prepare for public site:** preview/check locally, then inspect expanded exact source disclosure. Mark the current record reviewed only after actual local review; rights and source approval are separate.
6. Review exact canonical record/derivative URLs in **Public-source details**. Explicitly confirm reproduction rights and public Git disclosure, then type **APPROVE PUBLIC SOURCE**. Changed public facts/media/curation invalidate this exact approval.
7. Select exact approved records and choose **Prepare for public site (dry-run)**. Inspect **Export details**: canonical JSON, derivative hashes/sizes and every Git-visible path. Private notes/source paths/masters/reference-only media are excluded. Missing/stale approvals or invalid relationships stop the operation.

## Deliberate public-source writes

Only the owner should enable actual repository writes after granting source/privacy/content approval for the specific records:

```bash
npm run studio -- --allow-public-export
```

This startup grant alone does not approve any record. Each still needs local review, exact source/rights confirmation and a current dry-run. Type **EXPORT <displayed-token>** to write the listed `src/content/artworks.json`, `src/content/projects.json` and referenced `src/media/...` paths. The tool checks development branch/current checksums, stages/backups/journals privately and stops on collisions/concurrent edits. It never commits/pushes, modifies master, deploys, sends messages or creates owner launch-manifest approval. The actual release gate remains until separate M09 real-content/launch approval.

## Private storage and recovery

State/media/uploads/notes/previews/approval digests/export journals live under `~/.local/share/jordannesbitt-art/m09/studio`; the existing parent `id-registry.json` preserves neutral identities. An approved persistent alternative uses `JORDANNESBITT_M09_DATA`, not /tmp or public Git. Back up both studio state and the parent registry/snapshots. Never copy private `state.json` or original media into Git.

Ctrl+C shuts down owned local servers/jobs. Incomplete jobs are errors on restart, not complete artworks. An unclean process can leave a private lock/export journal: verify/stop its recorded process and reconcile it explicitly, never delete the neutral registry or reset drafts to bypass a collision. Interrupted export journals block further writes until reconciled; unrelated/concurrent target edits are preserved. Schema validity is not rights, public-source, colour, visual or launch acceptance.
