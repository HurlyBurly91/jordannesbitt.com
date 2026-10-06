# Local authoring and public-source export

M09-R6 adds a local adapter, not a new catalogue/CMS. `artworkSchema`, `projectSchema`, `validateCatalogue`, canonical public projection and existing ingestion remain authoritative. Public site stays static Astro. Studio code/assets live outside public routes and are never emitted by the website build.

## Storage and identity

Default working root: `~/.local/share/jordannesbitt-art/m09/studio`, outside public Git and /tmp. Real uploads, derivatives, state, private notes, previews, approval evidence and export journals stay there. Explicit disposable synthetic tests may use /tmp/opencode. Missing existing M09 neutral registry requires restoration, never silent reassignment. Preserve its existing filename/ID entries; new artwork allocation reserves the next neutral ID in an additional studio-allocation section, without changing prior identities. Snapshot imports reuse the selected snapshot ID; there is no automatic169-image catalogue import or provisional group promotion.

Private state holds the canonical catalogue plus administrative sidecars (media source hashes, private notes, job state, review/approval digests). These are not alternative artwork fields. Unknown optional facts remain absent. Generated untitled draft labels are private UI scaffolding and cannot pass public-source approval. Media-only/process/reference intake need not create an artwork. Owner explicitly decides separate artwork versus attachment and reproduction ordering. Add truthful canonical alternate/framed/documentation reproduction roles alongside existing primary/detail/installation/reverse/process; reference-only files remain private.

## Intake and local HTTP boundary

The studio server binds127.0.0.1 only. Requests must use its exact loopback Host, same-origin Origin when supplied and no cross-site Fetch-Metadata context. Mutations additionally require a process-random session token; no remote authentication/cloud/login service. No permissive CORS. No-cache/noindex/CORP headers keep private responses local. Source inputs are explicitly browser-selected file bytes or a selected ID in the owner's exact approved frozen snapshot; never arbitrary recursive directory discovery. Requests cannot supply arbitrary filesystem read/write destinations.

Bound request bodies and validate image bytes through existing intake. Missing ICC requires explicit local sRGB assumption. Upload copies are immutable private inputs with client/server digest verification; originals are only read. Reject traversal, symlinks and resolved paths outside approved roots; media serving uses stored derivative allowlists/checksums. Serial mutation/exclusive studio locks protect shared state/registry; atomic state files and pending/error/complete jobs prevent interrupted intake from appearing complete. Existing pipeline cache/collision/failure behavior is preserved.

## Lifecycle

PRIVATE LOCAL DRAFT → successful current-component PREVIEW → owner marks REVIEWED LOCALLY → owner explicitly authorizes PUBLIC-SOURCE DISCLOSURE/RIGHTS for the exact shown record/media digest → deliberate EXPORT.

Schema validity, draft publication intention, a preview or a selected flag is never owner approval. Changes to public fields/media/order/curation invalidate prior review/approval digests. Private notes/source paths/masters and reference-only images are excluded from export. Actual public status derives from the versioned catalogue, clearly separated from private intended publication state.

## Export boundary

Default is dry-run. A plan shows complete canonical metadata JSON, exact derivatives/checksums/byte counts and Git-visible paths, validation/missing-fact failures and the unchanged launch/deployment boundary. Default studio startup cannot write repository content; owner must explicitly start with `--allow-public-export`, separately approve exact private records and confirm a freshly prepared plan. Ordinary automated/demo runs never enable actual-checkout export.

Export merges only explicitly selected approved artwork/project records into existing production arrays and verifies the resulting whole catalogue. Preserve IDs/stable published URLs or require explicit compatibility aliases. One public homepage lead, selected ordering, project references, dimensions/edition/offer semantics and safe derivative references must validate. All project members must exist in the resulting catalogue; no automatic provisional series. Price/availability and reproduction rights are owner facts, not inferred from files or schema acceptance.

Writes are limited to intended `src/content/artworks.json`, `src/content/projects.json` and referenced `src/media/...` derivatives. Never professional content, launch-manifest approval, master, deployment, Git commits, DNS or services. Check development branch and unchanged plan/source/target checksums before writing. Stage/backup/journal in private storage, use collision-safe new assets and atomic metadata replacement, and roll back only this operation's own unchanged writes on failure. Conflicting concurrent edits stop; never overwrite unrelated work. Interrupted export journals prevent another export until explicitly reconciled.

## Preview and evidence

Preview builds use canonical private records/renderer flags only in an independent persistent root with current production components, visible PRIVATE LOCAL DRAFT disclosure/noindex and omitted unapproved artist/rights/offer structured assertions. No production source/publication predicate switch. Artwork/project/Selected Work/home/archive/medium routes remain ordinary local links. Browser test/demo traffic blocks external effects; actual publication/rights/business/launch-manifest/final public visual acceptance remains owner M09 review.

Tests cover originals/draft isolation, duplicate/schema failures, media identity/order, curation/lead uniqueness, dry-run/no accidental export, approved synthetic isolated export, loopback/host/origin/token/traversal/symlink/corrupt/interrupted failures and current production output isolation. Full existing verification and strict BLOCKED_CONTENT release gate remain required.

## Artist-facing Studio (M09-R7)

Normal use is image-first: New artwork / Another view-detail / Process-reference, click thumbnail targets, plain image-use labels, prominent draft photo and ordinary title/date/medium/process/materials/optional sizes/alt/project/availability. Pending intake opens the draft visually but cannot save/publish a falsely complete image. Metadata refresh/job polling does not reset unsaved edits. Existing validated attach/save operations implement explicit primary-photo replacement, retaining the former primary as an alternate; primary selection is one photo at a time.

Media uses selectable thumbnails with attached/unattached/reference states and one shared target/action. Projects, Selected Work and homepage use visual membership/order/lead controls and direct current-component preview actions. Accessible click/Up-Down controls are preferred to unreliable drag/drop. Internal IDs,roles/URLs/source hashes/rare facts remain Advanced/Technical details,not normal input requirements. Export disclosure is progressively shown but exact paths/metadata/rights/typed confirmations/runtime write grant remain explicit and unchanged.

UX demonstrations use an isolated persistent workspace/registry copy beneath studio/demonstrations; copied entries preserve original neutral identities, while temporary allocations are demonstration-only and never replace or mutate the authoritative owner registry/state. Ordinary owner storage/startup remain unchanged. Actual real-image source approvals are never simulated; gated dry-run refusals and successful synthetic test plans are distinct evidence.
