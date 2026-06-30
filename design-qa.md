# DiffPixel implementation design QA

- Source visual truth: `audit/2026-06-30-awwwards-philosophy/14-capabilities-mobile.jpg`, `22-privacy-english-mobile.jpg`, `25-manual-english-mobile.jpg`, `26-policy-english-mobile.jpg`
- Rendered implementation: `audit/2026-06-30-awwwards-philosophy/after/01-manual-english-mobile.jpg` through `09-home-english-footer-mobile.jpg`
- Combined comparison evidence: `audit/2026-06-30-awwwards-philosophy/after/10-before-after-comparison.jpg`
- Viewports: 1440 × 900, 1280 × 720, 768 × 1024, 390 × 844, 320 × 844
- States: English and Japanese; Home, Manual, Privacy; Reduced Motion; slider keyboard operation

## Findings

- No actionable P0, P1, or P2 findings remain.
- [P3] English display type scales down substantially at 320px.
  - Location: English Manual and Privacy display headings.
  - Evidence: the 320px capture uses a smaller Syne optical size than the 390px capture, while retaining the same hierarchy and copy.
  - Impact: slightly less dramatic at the narrowest supported width, but fully readable and not clipped.
  - Classification: acceptable responsive tradeoff; no change required.

## Required fidelity surfaces

- Fonts and typography: Noto Sans JP remains the unified Japanese family. English Syne remains limited to display text. Japanese headings now break at semantic boundaries; English display words no longer clip at 320px or 390px.
- Spacing and layout rhythm: Capabilities now brings the first metadata row into the 1440 × 900 viewport. Mobile closing and Footer heights are shorter without removing the intended pause.
- Colors and visual tokens: existing near-black, off-white, cyan, pink, line, and muted tokens are unchanged.
- Image quality and asset fidelity: all existing WebP product captures remain unchanged, retain their aspect ratio, and load at the tested states.
- Copy and content: copy is unchanged except for explicit semantic line breaks in English and Japanese headings.
- Responsiveness: all tested Home, Manual, and Privacy language states satisfy `scrollWidth === clientWidth`, including 320px.
- Interaction and accessibility: slider keys produce +1, +10, and -1 changes; Japanese `aria-valuetext` is localized. Reduced Motion uses static workflow images and does not create the scroll-driven observer. Language buttons and major text links have enlarged targets.

## Patches made

- Added zero-minimum grid sizing for Editorial Hero and chapters.
- Added English mobile optical sizes for long Syne words and Footer wordmarks.
- Added semantic Japanese and English heading line breaks.
- Converted Reduced Motion workflow into a static vertical sequence.
- Made slider arrow behavior explicit and localized its accessible value text.
- Increased language, logo, navigation, Privacy, and Footer target sizes.
- Reduced Capabilities vertical padding and row gap.
- Reduced mobile closing/Footer minimum heights.
- Reduced Noto Sans JP requests to the four used weights.
- Bumped CSS and JavaScript cache versions.

## Verification

- HTML parser: passed.
- JavaScript syntax checks: passed.
- `git diff --check`: passed.
- Duplicate IDs: none observed in browser audit.
- Browser console warning/error log: empty.
- Horizontal overflow: none at the five tested widths and both languages.
- Slider keyboard sequence: 50 → 51 → 61 → 60.
- Reduced Motion: workflow stage `display: none`; static workflow image `display: block`.

## Residual test gaps

- Screen-reader speech output and Windows High Contrast were not tested on physical devices.
- The normal-motion IntersectionObserver branch was not force-emulated because the audit browser reports Reduced Motion; the unchanged observer branch remains covered by source inspection.

final result: passed
