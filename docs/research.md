# Research and design rationale — 2026-10-03

## Basis and limits

The earlier project brief was recovered from the owner's saved Pasted markdown.md. It proposed one multidisciplinary practice, a curated portfolio backed by a typed archive, neutral artwork IDs, paper/ink editorial design, object and series pages, ingestion, image derivatives, search metadata and inquiry-first commerce. It proposed 60-100 launch works and four or more series. These are prior planning requirements, not evidence that those features or works are already published.

This update preserves that architecture and proposes a smaller first release before the larger catalogue. New adaptations below are design hypotheses for this project, not findings that a famous artist's website caused their success. Public pages show presentation and acquisition practices, not private conversion rates. This is a targeted case study, not an exhaustive ranking of artist websites.

## Primary artist observations

R01 — Kentridge Studio, https://www.kentridge.studio/ and https://www.kentridge.studio/william-kentridge-projects/drawings-for-projection/ (accessed 2026-10-03).
The site supports both medium browsing and named projects, with studio/process context and film information. Adaptation: authored cross-medium projects should connect drawings, prints, painting and moving images rather than presenting unrelated departments. Do not copy its scripts, artwork, prose or visual effects. Maps to M04/M06/M07.

R02 — David Shrigley's artist site links its Shrig Shop: https://davidshrigley.com/shop/shrig-shop . Product example: https://shrigshop.com/products/david-shrigley-limited-edition-you-will-not-stop-me-from-singing-my-song (accessed 2026-10-03).
The edition page identifies process, size, edition/proofs, paper, signature/numbering, framing and an enquiry route. Adaptation: give a potential buyer factual object-level information without turning the portfolio into a promotional storefront. Do not import its prices, foreign tax treatment or cancellation terms. Maps to M02/M07/M11.

R03 — Edward Burtynsky, https://www.edwardburtynsky.com/contact/burtynsky-studio and https://www.edwardburtynsky.com/projects/in-the-wake-of-progress/ (accessed 2026-10-03).
The site separates studio/media contact from gallery-handled print sales and presents multimedia projects in context. Adaptation: identify the correct recipient and attach the artwork identity to enquiries; retain project context across film and photography. Jordan need not adopt gallery-only sales. Maps to M06/M07.

## Buyer evidence

R04 — Artsy, Art Market Trends 2025, published 2025-04-24, updated 2025-06-27: https://www.artsy.net/article/artsy-editorial-art-market-trends-2025/ .
Among surveyed collectors who bought online in 2024, 48% selected insufficient information and 43% lack of a visible price as major online purchasing hindrances. This is Artsy's surveyed population, not a representative estimate for all buyers or a causal experiment. Adaptation: show approved prices/currency when set, truthful availability, complete object details and a clear enquiry process. Never invent prices to meet this recommendation. Maps to M07/M09.

## Technical and platform sources

R05 — Google image guidance: https://developers.google.com/search/docs/appearance/google-images and video guidance: https://developers.google.com/search/docs/appearance/structured-data/video (accessed 2026-10-03). Use crawlable images, relevant text and truthful watch-page metadata. These do not promise ranking or rich results. Maps to M06/M08.

R06 — W3C WCAG 2.2 reference: https://www.w3.org/WAI/WCAG22/quickref/ (accessed 2026-10-03). Use as the accessibility target with manual checks as well as automation. Maps to M04-M09.

R07 — Google Web Vitals: https://web.dev/articles/vitals (accessed 2026-10-03). Field thresholds are LCP 2.5s, INP 200ms and CLS 0.1 at the 75th percentile. Project transfer/JavaScript budgets in quality.md are our proposed budgets, not these sources' universal limits. Maps to M08/M10.

R08 — GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits (accessed 2026-10-03). Pages excludes hosting sites primarily directed at facilitating commercial transactions. This corrects the earlier assumption that the sales-oriented site could simply remain on Pages indefinitely. A suitable hosting decision is required before that release; no migration is authorized by this research. Maps to M10/M11.

R09 — OpenCode project rules: https://opencode.ai/docs/rules/ ; agents/permissions documentation: https://opencode.ai/docs/agents/ and https://opencode.ai/docs/permissions/ (accessed 2026-10-03). AGENTS.md is a supported entrypoint. Installed-version differences must be checked locally; no unverified provider/model identifier is committed. Maps to M01.

R10 — Astro content collections: https://docs.astro.build/en/guides/content-collections/ and deployment: https://docs.astro.build/en/guides/deploy/github/ (accessed 2026-10-03). Architectural support for structured static content is relevant; examples must match the installed major version. The existing project is not automatically upgraded because current docs describe newer versions. Maps to M01-M03/M10.

## Derived priorities

Lead with actual art; supply authored relationships rather than six disconnected service menus; make faithful detail views easy; substantiate professional context; expose an unobtrusive but intelligible acquisition path; preserve a useful sold-work archive; support future repeat visits through genuine studio work; measure actual enquiries and purchases rather than assuming aesthetic polish converts.

No source establishes an optimal layout for this artist. M09 is the necessary test with Jordan's actual images and judgment. No other artists' artwork or text is licensed for reuse by this research.
