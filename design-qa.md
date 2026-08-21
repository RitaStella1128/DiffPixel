# DiffPixel implementation design QA

- Scope: full redesign of `docs/index.html`, `docs/manual.html`, `docs/privacy.html`, `docs/privacy_ja.html` (English and Japanese) on branch `redesign/instrument-philosophy`, applying the "Awwwards受賞級Webサイトを生む設計哲学" document as a design philosophy rather than a visual checklist.
- Prior pass: `audit/2026-06-30-awwwards-philosophy/` fixed responsiveness, accessibility, and motion bugs on the previous AXIS-RIGID layout. That work is preserved as history; this pass is a structural and visual redesign on top of the same central thesis.
- Central thesis carried forward and purified: "See the pixel that drifted." / 「1pxのズレが、見える。」 The site is now structured as a calibrated diff instrument rather than a generic marketing/editorial site.

## What changed

- New shared foundation `docs/base.css`: single source of truth for tokens, self-hosted `@font-face` (Syne, JetBrains Mono), the instrument measurement grid, header/footer/button components, and four signature components — `.drift-title` (ghost-layer heading that snaps into register), `.hud-meta` (coordinate-readout facts), `.diff-seam` (section-divider tick + index label), `.snap-in` (scroll-entry motion).
- New shared `docs/motion.js`: drives `.drift-title`/`.snap-in` entrance via IntersectionObserver; no-ops (snaps immediately) under `prefers-reduced-motion: reduce` or without IntersectionObserver support.
- `docs/home.css` and `docs/editorial.css` trimmed to page-specific layout only; duplicated tokens/header/footer/button rules removed in favor of `base.css`.
- Header and footer markup unified across all pages (`.btn`/`.btn-secondary`, `.header-actions`, `.footer-links`/`.footer-info`) — previously `index.html` and the editorial pages used divergent class names for the same components.
- Dead files removed: `docs/axis-rigid.css`, `docs/site.js` (unreferenced from any HTML).
- Skip link (`.skip-link` → `#main-content`) added to all four pages; was previously absent (a gap flagged but not actioned in the prior audit).
- Fonts: Syne and JetBrains Mono are now self-hosted (`docs/fonts/*.woff2`, OFL-licensed, fetched directly from Google Fonts' CDN files) with `<link rel="preload">`, removing two of three external font-family requests. Noto Sans JP remains on the Google Fonts CDN (CJK subsetting makes full self-hosting impractical; this is a deliberate, documented trade-off).
- Mobile-only addition: `.workflow-hud` text strip (Add/Align/Difference with live active-state highlight) fills the gap left when the sticky workflow visualization is hidden under `max-width:1100px` or `prefers-reduced-motion: reduce`.

## Verification performed

- `node -c` passed for `index.js`, `editorial.js`, `motion.js`.
- No duplicate IDs in any of the four HTML files; div/section/article/header/footer/main/nav/figure/ol/ul/table tag counts balanced.
- All local asset references (`src`/`href` to png/webp/jpg/svg/css/js/woff2) resolve to existing files.
- No stale references to the removed `axis-rigid.css` / `site.js`, or to retired class names (`.header-install`, `.button`).
- Browser console: no warnings or errors on Home, Manual, or Privacy, in English or Japanese.
- `document.documentElement.scrollWidth === clientWidth` confirmed at 320px and 390px for English and Japanese on all three pages (no horizontal overflow), and at 1280/1440 desktop widths.
- Footer wordmark (`.footer-wordmark`) confirmed to stay within the viewport at 320px on all pages, both languages.
- `.drift-title::before` ghost layer confirmed via computed style: offset+visible by default, resolves to `opacity:0`/`translate(0,0)` once `.is-snapped` is added, and is forced to the resolved state unconditionally under `prefers-reduced-motion: reduce` (verified — the preview environment itself emulates reduced motion).
- `.workflow-hud` active-state highlighting verified functional both at the `max-width:1100px` breakpoint and under reduced-motion at desktop width (this was a real bug found and fixed during this pass — the active/inactive span styling was originally scoped only inside the 1100px media query, leaving the reduced-motion-at-desktop case unstyled).
- Self-hosted fonts (`Syne`, `JetBrains Mono`) confirmed `status: "loaded"` via `document.fonts`, served with HTTP 200 from `docs/fonts/`.
- Skip link present with correct `href="#main-content"` on all four pages.
- Visual review via screenshots: Home (Hero, Workflow, Capabilities, Privacy, Closing, Footer), Manual (Hero, chapters, final CTA, Footer), Privacy (Hero, status list, chapters, final CTA, Footer) — English and Japanese — at 1440px and structurally at 320/390px.

## Known trade-offs

- Noto Sans JP is not self-hosted (see above); this is an intentional, documented scope cut, not an oversight.
- Precise metric-matched fallback fonts (size-adjust/ascent-override tuned to Syne/JetBrains Mono/Noto Sans JP metrics) were not implemented — `font-display: swap` with a generic system-font fallback stack is used instead, matching the prior implementation's approach.
- The preview tooling used for verification emulates `prefers-reduced-motion: reduce` unconditionally, so the non-reduced-motion drift/snap animation was verified by reading computed CSS rather than by direct visual capture of the animated state.

## Residual test gaps

- Screen-reader speech output, 200%/400% zoom, and Windows High Contrast were not tested on physical devices or assistive technology.
- The non-reduced-motion animation path (drift-title ghost transition, snap-in entrance) was not visually captured on video; correctness was confirmed via source inspection and computed-style assertions instead.

## Follow-up fixes (post-redesign review)

- **Skip link was only partially functional.** Activating it scrolled the viewport to the top, but `#main-content` had no `tabindex`, so focus fell back to `<body>` after the jump — a following Tab press re-entered the header nav instead of the page content, defeating the link's purpose. Fixed by adding `tabindex="-1"` to `<main id="main-content">` on all three pages and suppressing the resulting focus ring (`#main-content:focus { outline: none; }` in `base.css`). Verified: after click, `document.activeElement` is now `#main-content` on Home, Manual, and Privacy.
- **Footer order unified across all pages.** The footer wordmark now consistently renders *after* the meta row (links + version/copyright) on every page and language, matching a manual edit the user made to the Japanese home page footer. `.footer-meta`'s divider (`border` + `margin` + `padding`) was flipped from top to bottom in `base.css` (and the matching mobile override in `home.css`) to keep the divider sitting between the meta row and the wordmark regardless of which side it's adjacent to.

final result: passed
