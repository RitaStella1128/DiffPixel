# Changelog

## 1.1.0 - 2026-07-03

- Added file URL support to the panel's site-matching logic, so the floating panel can be restored and toggled correctly on `file://` pages (previously only `http`/`https` pages were recognized).
- Restyled the in-page floating panel with higher-contrast colors, squared corners, and a heavier accent border, in both light and dark themes.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.1.0.zip`.

## 1.0.3 - 2026-06-08

- Changed the toolbar icon toggle to save DiffPixel panel visibility per domain.
- When a domain is turned on, DiffPixel reopens on reloads and matching domain pages where the content script is available.
- When a domain is turned off, the panel, overlay layers, and grid stay hidden on reloads and matching domain pages.

## 1.0.2 - 2026-06-05

- Changed the reset shortcut from `Alt + R` to `Alt + 0` to avoid conflicts with common browser and system-level shortcuts.

## 1.0.1 - 2026-06-03

- Moved layer removal into the layer list.
- Moved layer lock into the layer list and grouped layer actions as lock, visibility, and remove.
- Added layer reordering controls.
- Added Invert to the blend mode selector and removed the separate invert action.
- Remembered the most recently used opacity and blend mode for new layers.
- Added site-level optional access so the panel can reopen after navigation or reload on approved domains.
- Improved panel positioning and drag behavior for narrow mobile viewports.
- Increased visibility button hit area and improved select option contrast.
- Added discoverable keyboard shortcut tooltips and inline `0.5x` / `2x` scale actions.
- Added `Alt + ;` and `Alt + -` scale nudge shortcuts.
- Added browser-safe blend and opacity keyboard chords with `Alt + B/A` plus `;` / `-`.
- Added a clipboard paste button and localized shortcut tooltips.
- Added a public user manual and an in-panel help button.
- Consolidated the privacy policy into one bilingual page.
- Added Microsoft Edge Add-ons distribution notes.

## 1.0.0 - 2026-05-31

- Initial Chrome Web Store release.
