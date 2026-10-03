# Tasks

```yaml
Milestone: M07
State: COMPLETE
Active-Request: M07-R1
Specification: milestones/M07-professional-site.md
```

## Authorization and carried evidence

Source: USER, 2026-10-03; grant records/M00-preparation.md. Autonomous M01–M08 on redesign/astro-foundation with selected Sol 6.1 Max and verified checkpoints; stop before M09 or earlier genuine blocker/required human gate. No protected-branch writes, deployment/publication, DNS/hosting, real messages, purchases/payments or other external effects beyond checkpoints, nor host-wide changes. Planning counts only; all actual work/group/order/publication/availability/pricing/professional/recipient choices remain owner M09. Fixtures isolated/labelled, never actual artist/production content; no real/private intake authorized.

M06 checkpoint **b9469a1** committed/pushed; initialization clean origin/worktree/remote/protected refs verified. Temporary Node 22.23.3/npm 10.9.9, actual openai/gpt-6.1-sol/max; Playwright1.63.0/Chromium153.0.8010.12. Full57 and targeted3 tests pass; per-root Astro/Vite cache isolation required. Residual audit limits in docs/operations.md remain nonpassing.

## M07-R1 — Professional context and acquisition

Source: DERIVED from milestones/M07-professional-site.md, docs/design.md, docs/acquisition.md and docs/catalogue.md under USER grant.

- [x] M07-R1-D01 Implement image-led homepage using a new explicit single public homepageLead flag, never infer a lead/sequence from unselected works. Replace oversized slogan/fake placeholders; use only current identity and supplied professional statement/projects/selection. Actual empty state must be release-blocking, not fake art.
  Dependencies: M06 complete; owner chooses actual lead/content at M09.
  Evidence: Explicit lead schema/single-public-lead validation and image-led homepage implemented; construction tag when absent, no guessed source choice. Actual arrays remain empty.
- [x] M07-R1-D02 Render approved-public biography/statement About and a separately scannable/printable CV only when supplied; omit unsupported facts/Studio/Journal. Keep identity config unchanged.
  Dependencies: D01, projected professional content. No invented CV/policy/business facts.
  Evidence: Approved-source About and conditional printable CV route implemented; unsupported sections omitted and missing essential facts tagged for release guard.
- [x] M07-R1-D03 Add Available view derived from explicitly reviewed available/edition-available records and honest artwork status/price/edition/explicit framing/condition rendering; omit absent prices and unavailable purchase calls.
  Dependencies: D01. Add optional framing/condition fields, not inferred from dimensions; no stock/scarcity/checkout.
  Evidence: Derived availableWorks/Available/ArtworkOffer and currency-aware prices, optional explicit framing/condition, all availability labels and recipient-gated CTA implemented.
- [x] M07-R1-D04 Implement contextual internal enquiry path and accessible public-recipient fallback with a pure mailto-draft form adapter. Correct work ID/title/canonical URL; ready means draft only, never delivered. Missing recipient/unavailable work/invalid or spam input must not produce fake success. No backend/service activated.
  Dependencies: D03, explicitly published professional contact. Ordinary tests inspect/mock draft intent and never launch a real mail application/send.
  Evidence: Pure draft adapter, disabled-until-ready form, internal context lookup and direct approved email fallback; no delivery transport or automatic mail-app navigation. Missing recipient uses release blocker.
- [x] M07-R1-D05 Add fixture journey project→work→availability→addressed identified enquiry, status/absent-price/missing-recipient/error/spam tests, About/CV/home/printability checks and full publication/regressions; document enquiry behavior and M09/M10 real-delivery/policy gates.
  Dependencies: D01–D04.
  Evidence: tests/professional.test.mjs, docs/acquisition.md/README.md; implementation/tests documented, actual results pending.
- [x] M07-R1-D06 Narrow Intl's optional resolved currency fraction precision explicitly; fail if unavailable rather than assume an incorrect minor-unit scale.
  Source: DERIVED from first verification failure. npm run verify exits 1 at Astro check, TypeScript2532 in priceLabel; browser/tests have not run. Preserve currency-specific JPY/CAD semantics with a checked local variable, not a guessed two-digit fallback.
  Implementation: Precision is checked before scaling; actual CAD/JPY and full behavior verification pending rerun.
- [x] M07-R1-D07 Enforce native hidden semantics across styled links/rows so blocked/error drafts cannot display stale calls to action.
  Source: DERIVED from actual browser failure: second verify passes build/check and 59 tests, 2 fail. Spam adapter blocks/removes href but .text-link display overrides hidden, leaving the stale draft link visible. Add global [hidden] display:none!important, retaining visibility assertions.
  Implementation: Native hidden semantics enforced globally; spam/status/fallback checks retained for rerun.
- [x] M07-R1-D08 Make empty-contact verification inspect actual mailto anchors and null recipient data, distinguishing adapter code's generic mailto literal from a configured action.
  Source: DERIVED from second false-positive source-scan failure. Missing contact has no link/form and recipient null; generic inline draft code contains the protocol literal. Assert semantic action/data absence without weakening fixture-email leakage checks.
  D02 refinement: approved statement can provide About context without inventing/forcing a biography; mark essential professional construction only when both biography and statement are absent. Actual source remains empty.
  Implementation: Semantic anchor/null-data assertions added; missing-recipient scenario also verifies statement-only About with no invented biography or false construction blocker.
  Verification for D01–D08: final npm run verify exits 0, 61 tests pass/no skips; 0 diagnostics, 13 pages plus JSON. Actual browser journey, currency units, lead uniqueness, visibility/spam/no-recipient/source-backed CV and statement-only About pass. Repairs retain all substantive assertions.
- [x] M07-R1-P01 Preserve one catalogue/identity/neutral URLs/authored order/media ratios/design/framework and privacy/protected-branch/external-effect rules.
  Source: USER and DERIVED. Dependencies: all changes.
  Evidence: Full original/publication/cache/media/relationship/selection/ratio checks pass; identity/assets/major/protected refs/deployment unchanged. One projected catalogue drives availability/context; explicit lead avoids inference.
- [x] M07-R1-P02 Keep actual works/lead/bio/CV/contact/offers/policies empty; no newsletter/payment/message sends, fabricated facts or fixture leaks. Real receipt/terms require separate M09/M10 authority.
  Source: USER. Dependencies: all changes/tests.
  Evidence: Actual arrays still [], no CV/recipient/offer/lead inferred; actual empty markers verified. Tests inspect only reserved synthetic-recipient mailto intent, never open/send/receipt. No policies/services activated.
- [x] M07-R1-V01 Run actual browser home/professional/CV and project→work→availability→enquiry draft journey; available/sold/enquiry-only/unknown/absent-price/missing-recipient and adapter normal/error/spam checks.
  Dependencies: D05. Evidence: Chromium153.0.8010.12/360x800 loopback journey reaches locally prepared draft with exact reserved recipient/work ID/title/canonical URL, expressly not delivered; spam hides stale action. Sold/unknown have no CTA/prices, available/priced/edition view correct, missing recipient no form/action, CV print media and approved statement-only About pass. CAD/JPY minor units and duplicate-lead rejection pass.
- [x] M07-R1-V02 Run full applicable schema/build/publication/cache/archive/ingestion/presentation/media/route checks; unsupported CV/construction states must be detectable by the M08 release guard.
  Dependencies: D05. Evidence: Verified Node22.23.3/npm10.9.9 npm run verify exits 0 (61/61, 0 diagnostics,13 pages/JSON). Real empty CV/contact/lead cases marked/absent and all original schema/intake/publication/cache/archive/media/presentation/routes pass. M08 must implement/test actual release-guard rejection of these detected construction/unsupported facts; no factual/delivery/offer/visual approval claimed.
- [x] M07-R1-V03 Review intended diff/canonical reconciliation/state/protected refs and checkpoint after required technical acceptance.
  Dependencies: V01, V02, P01, P02.
  Evidence: intended diff/new files reviewed, git status/diff/check/stat/log/ls-remote exit0; protected master755df7f/backup3bc95c7 unchanged, development M06 b9469a1. docs/acquisition.md/README reconciled, headers synchronized; checks precede checkpoint, transport recorded next initialization/failure re-entry.

Technical capability gate only; real content/recipient/offers are M09, real delivery/policies/release separately gated M09/M10. No superseded IDs. Closeout records/M07-professional-site.md; next M08 after verified checkpoint push.
