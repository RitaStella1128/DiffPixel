# DiffPixel

DiffPixel is a Chrome and Microsoft Edge extension for comparing a live web page with local reference images directly in the browser.

It adds an in-page floating panel that lets you place design screenshots, mockups, or visual references over the current page and adjust them while the page remains visible.

## What It Does

- Overlay one or more local reference images on the active page.
- Add images by file picker, drag and drop, keyboard paste, or the clipboard paste button.
- Adjust layer opacity, position, scale, blend mode, inversion, visibility, and lock state.
- Use Difference and other blend modes to spot visual mismatches.
- Toggle a pixel grid for spacing and alignment checks.
- Save layer settings locally per site.
- Reopen the floating panel automatically on sites where you have granted access.
- Switch between light and dark panel themes.
- Use English or Japanese UI text.

## Why Use It

DiffPixel is built for visual QA work where small layout differences matter.

Instead of switching between a browser, a design tool, and image previews, you can compare the implementation and the reference on the same page. This helps with spacing, alignment, scale, responsive checks, and quick design review before shipping.

## Privacy

DiffPixel runs locally in Chrome.

Uploaded images and overlay settings are stored on the user's device through Chrome storage. The extension does not send uploaded images, page data, or settings to an external server.

The public privacy policy is available at [https://ritastar1128.github.io/DiffPixel/privacy.html](https://ritastar1128.github.io/DiffPixel/privacy.html) with English and Japanese switching on the same page. A plain-text copy is also available in [PRIVACY.md](PRIVACY.md).

The public user manual is available at [https://ritastar1128.github.io/DiffPixel/manual.html](https://ritastar1128.github.io/DiffPixel/manual.html).

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
- Optional site access to reopen DiffPixel automatically on domains where the user has granted access.

## Keyboard Shortcuts

- Arrow keys move the selected layer by `1px`.
- `Shift` + arrow keys move the selected layer by `10px`.
- Hold `Alt` + `B` and press `;` / `-` to change the blend mode.
- Hold `Alt` + `A` and press `;` / `-` to adjust opacity.
- `Alt` + `G` toggles the grid.
- `Alt` + `H` toggles the selected layer visibility.
- `Alt` + `L` toggles the selected layer lock.
- `Alt` + `,` and `Alt` + `.` scale the selected layer by `0.5x` and `2x`.
- `Alt` + `;` and `Alt` + `-` adjust scale by `+0.1` and `-0.1`.

## Development Notes

No external service is required to run DiffPixel locally.

After making changes, reload the extension from `chrome://extensions`, refresh the target page, and test the floating panel on a normal web page.
