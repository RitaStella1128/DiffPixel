# DiffPixel

DiffPixel is a Chrome and Microsoft Edge extension for comparing a live web page with local reference images directly in the browser.

It adds an in-page floating panel that lets you place design screenshots, mockups, or visual references over the current page and adjust them while the page remains visible.

## What It Does

- Overlay one or more local reference images on the active page.
- Add images by file picker, drag and drop, keyboard paste, or the clipboard paste button.
- Adjust layer opacity, position, scale, blend mode, inversion, visibility, and lock state.
- Remove all layers at once and apply the selected blend mode to every layer.
- Use Difference and other blend modes to spot visual mismatches.
- Toggle a pixel grid for spacing and alignment checks.
- Save layer settings locally per site.
- Reopen the floating panel automatically on sites where DiffPixel is enabled.
- Switch between light and dark panel themes.
- Use English or Japanese UI text.

## Why Use It

DiffPixel is built for visual QA work where small layout differences matter.

Instead of switching between a browser, a design tool, and image previews, you can compare the implementation and the reference on the same page. This helps with spacing, alignment, scale, responsive checks, and quick design review before shipping.

## Privacy

DiffPixel runs locally in Chrome.

Uploaded images and overlay settings are stored on the user's device through Chrome storage. The extension does not send uploaded images, page data, or settings to an external server.

The public privacy policy is available at [https://diffpixel.ritastella.com/privacy.html](https://diffpixel.ritastella.com/privacy.html) with English and Japanese switching on the same page. A plain-text copy is also available in [PRIVACY.md](PRIVACY.md).

The public user manual is available at [https://diffpixel.ritastella.com/manual.html](https://diffpixel.ritastella.com/manual.html).

## Installation For Development

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repository folder.
5. Open a normal web page and click the DiffPixel extension icon.

For `file://` pages, enable **Allow access to file URLs** from the extension details page in Chrome.

## Chrome Web Store

DiffPixel is intended to be distributed as a Chrome extension through the Chrome Web Store.

For a store upload, use the release ZIP in `dist/`. The archive should contain `manifest.json` at the root and include only the extension files required by Chrome.

## Microsoft Edge Add-ons

DiffPixel uses Manifest V3 and can be submitted to [Microsoft Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/overview) with the same release ZIP from `dist/`.

## Project Structure

- `manifest.json` - Chrome extension manifest.
- `background/` - extension service worker.
- `content/` - in-page overlay and floating panel.
- `icons/` - extension icons.
- `_locales/` - localized extension strings.
- `docs/` - public documentation pages.
- `store-promo/` - Chrome Web Store promotional images.
- `store-screenshots/` - Chrome Web Store screenshot assets.
- `dist/` - packaged release ZIP.

## Permissions

DiffPixel uses a small set of Chrome extension permissions:

- `activeTab` to run on the current tab after the user clicks the extension icon.
- `scripting` to inject the in-page overlay and floating panel.
- `storage` to save layer settings locally.
- `unlimitedStorage` to support local reference images and visual QA sessions without the default storage limit getting in the way.
- `host_permissions` for `http://*/*`, `https://*/*`, and `file:///*` to inject the local overlay into user-selected websites, support local files when Chrome file URL access is enabled, and restore DiffPixel after reloads on enabled sites.

## Release Log

### 1.1.0

- Added file URL support to the panel's site-matching logic, so the floating panel can be restored and toggled correctly on `file://` pages (previously only `http`/`https` pages were recognized).
- Restyled the in-page floating panel with higher-contrast colors, squared corners, and a heavier accent border, in both light and dark themes.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.1.0.zip`.

### 1.0.7

- Added layer switching shortcuts with `Alt` + `Shift` + `J` / `K`.
- Localized the bulk action button labels and tooltips in the in-page panel.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.0.7.zip`.

### 1.0.6

- Prevented duplicate content-script instances and duplicate floating panels.
- Made layer deletion and storage synchronization more reliable.
- Added bulk layer deletion and bulk blend-mode application.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.0.6.zip`.

### 1.0.5

- Updated GitHub Pages, repository, and in-extension manual links for the GitHub username change to `RitaStella1128`.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.0.5.zip`.

### 1.0.4

- Changed site access from optional host permissions to declared host permissions for more reliable panel restoration after page reloads.
- Saved the user's site-level show/hide intent independently from the immediate content-script injection result.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.0.4.zip`.

### 1.0.3

- Improved toolbar icon behavior so the in-page DiffPixel panel can be shown and hidden from the browser toolbar.
- Added per-domain panel visibility persistence groundwork.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.0.3.zip`.

### 1.0.2

- Updated the reset shortcut flow and release package after shortcut conflict fixes.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.0.2.zip`.

### 1.0.1

- Refined public release documentation and packaging assets.
- Regenerated the Chrome Web Store release ZIP as `dist/DiffPixel-1.0.1.zip`.

### 1.0.0

- Initial public Chrome extension release.
- Added the floating in-page panel, reference image layers, local storage, blend controls, grid controls, theme switching, localization, and Chrome Web Store packaging.

## Keyboard Shortcuts

- Arrow keys move the selected layer by `1px`.
- `Shift` + arrow keys move the selected layer by `10px`.
- `Alt` + `Shift` + `J` / `K` switches to the next or previous layer.
- Hold `Alt` + `B` and press `;` / `-` to change the blend mode.
- Hold `Alt` + `A` and press `;` / `-` to adjust opacity.
- `Alt` + `G` toggles the grid.
- `Alt` + `H` toggles the selected layer visibility.
- `Alt` + `L` toggles the selected layer lock.
- `Alt` + `,` and `Alt` + `.` scale the selected layer by `0.5x` and `2x`.
- `Alt` + `;` and `Alt` + `-` adjust scale by `+0.1` and `-0.1`.
- `Alt` + `0` resets the selected layer.
- `Alt` + `C` centers the selected layer.
- `Alt` + `W` fits the selected layer to the page width.

## Development Notes

No external service is required to run DiffPixel locally.

After making changes, reload the extension from `chrome://extensions`, refresh the target page, and test the floating panel on a normal web page.
