# Tasks

```yaml
Milestone: M06
State: COMPLETE
Active-Request: M06-R1
Specification: milestones/M06-moving-image.md
```

## Authorization and carried evidence

Source: USER, 2026-10-03; grant records/M00-preparation.md. Autonomous M01–M08 on redesign/astro-foundation with selected Sol 6.1 Max, verified checkpoint commits/pushes; stop before M09 or earlier genuine blocker/required human gate. No protected-branch writes, deployment/publication, DNS/hosting, real messages, purchases/payments or other external effects beyond checkpoints; no host-wide changes. Real works/groups/order/publication/availability/prices remain owner choices at M09; planning counts only. Isolated labelled fixtures only, never real production/artist content; no real/private intake authorized.

M05 checkpoint **2c3b3a5** committed/pushed successfully; initialization clean worktree/origin/remote/protected refs checked. Temporary Node 22.23.3/npm 10.9.9; actual openai/gpt-6.1-sol/max. All 54 tests pass; per-root Astro/Vite cache isolation required. Playwright 1.63.0/Chromium 153.0.8010.12; direct sharp 0.35.5; existing **FFmpeg 6.1.1** with libvpx inspected for CPU-only synthetic clip generation. Residual framework audit limitations in docs/operations.md remain nonpassing; no optimizer/SSR/transition feature is authorized by this task.

## M06-R1 — Moving-image/computational capability

Source: DERIVED from milestones/M06-moving-image.md, docs/catalogue.md, docs/design.md and docs/quality.md under USER grant.

- [x] M06-R1-D01 Extend validated film fields with optional explicit poster dimensions/upload date and MIME/embed consistency; implement prominent native controlled playback at the stable /artwork/[slug] object/watch URL with honest runtime/credits/captions/transcript/fallback.
  Dependencies: M05 complete. No inferred dates/credits/accessibility assets, autoplay or original uploads.
  Evidence: Schema, moving-image helpers and MediaPlayer integrated into ArtworkView/metadata; implementation complete, actual behavior pending verification.
- [x] M06-R1-D02 Implement deliberately click-to-load whitelisted external embeds with clear consent/context and static external fallback; ordinary tests must intercept every third-party request.
  Dependencies: D01. No vendor connection before action; no real external service test.
  Evidence: Inert whitelisted iframe template plus explicit user button/provider fallback and consent text; fixture route interception implemented.
- [x] M06-R1-D03 Support contextual computational summary/stills/video/tools and an optional explicitly launched external demo with static fallback; derive source-project relationships from the same catalogue.
  Dependencies: D01. No automatic private repository access or demo execution.
  Evidence: Static summary/tools/optional external launch link, no embedded demo/repository fetch; authored existing relationships reused.
- [x] M06-R1-D04 Generate Film menu/index only when public playable/poster-backed records exist; match VideoObject/canonical metadata to visible content without fabricated required fields; document tested adapters and M09 accessibility intake.
  Dependencies: D01–D03.
  Evidence: Conditional films collection/catch-all index/nav, same artwork canonical, public-only supported VideoObject and unknown fields omitted; docs/catalogue.md adapter/intake conventions recorded.
- [x] M06-R1-D05 Add isolated synthetic local clip/caption/poster/failed playback tests, keyboard play/pause, consent/stubbed embeds and static computational demo fallback; run required publication/regression checks.
  Dependencies: D01–D04. Missing tools/assets are blockers, not skips.
  Evidence: tests/moving-image.test.mjs creates selected synthetic VP9/caption assets in a disposable site using inspected FFmpeg; behavior/results pending.
  Evidence: First full npm run verify exits 0 (57 tests pass, 0 diagnostics/11 pages). Final targeted assertions will confirm actual parsed caption cues, intercepted iframe response/demo launch and MIME/provider rejection, extending already passing behavior without real external requests.
  Final evidence: Targeted node --test tests/moving-image.test.mjs exits 0 (3/3 pass), including real parsed VTT cues, locally fulfilled iframe/demo response after action and negative MIME/provider checks. All implementation tasks verified by these and full regression checks.
- [x] M06-R1-P01 Preserve media/source ownership/privacy/publication rules, canonical artwork identities, natural dimensions and project-authoritative relationships; no real third-party contacts or fixture leakage.
  Source: USER and DERIVED. Dependencies: all changes/tests.
  Evidence: Stable artwork/watch canonical, public-only supported metadata, no initial video transfer/provider load, mocked provider/demo responses, actual empty Film output and production-cache/output isolation all pass.
- [x] M06-R1-P02 Keep actual source arrays empty and protected branches/deployment/host configuration unchanged; no fabricated actual media metadata/accessibility/availability or software exposure.
  Source: USER. Dependencies: all operations.
  Evidence: No real input/source changes; synthetic FFmpeg files only in discarded test roots. Identity/assets/framework/deployment/host/protected refs preserved; metadata/rights facts not inferred for actual work.
- [x] M06-R1-V01 Run actual browser local play/pause/keyboard/error/fallback/caption and click-to-load embed checks with third parties mocked; static computational fallback/launch behavior.
  Dependencies: D05. Evidence: Chromium 153.0.8010.12/768x900/verified runtime, local VP9 2s clip (FFmpeg6.1.1) plays only after keyboard action, Space pauses, VTT cues parse, mocked failed source shows fallback. Provider and demo requests explicitly fulfilled locally only after action; computational context works without JavaScript.
- [x] M06-R1-V02 Verify truthful metadata/canonicals/absent or unpublished Film menu/index/fixture isolation and full applicable build/schema/archive/ingestion/presentation/route checks.
  Dependencies: D05. Evidence: npm run verify exits 0, 57 tests/no skips, 0 check diagnostics/11 pages plus JSON; all prior regressions pass. Final targeted 3 tests pass. Actual Film index/menu/video fixture absent; missing upload date omitted, unpublished metadata rejected and one stable object canonical. Real captions/transcripts/colour/content approval remains M09.
- [x] M06-R1-V03 Review intended diff/domain reconciliation/state/protected refs, then verified checkpoint under grant.
  Dependencies: V01, V02, P01, P02.
  Evidence: git status/diff/check/stat/log/ls-remote exit 0; intended code/new files reviewed, docs/catalogue.md reconciled, headers synchronized. Remote development M05 2c3b3a5, master 755df7f/backup 3bc95c7 unchanged. Checks precede checkpoint; transport recorded on next initialization/failure re-entry.

Technical capability gate only; actual media/accessibility assets require M09 owner intake/approval. No superseded IDs. Closeout records/M06-moving-image.md; next M07 after verified checkpoint push.
