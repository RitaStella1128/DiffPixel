# DiffPixel Privacy Policy

Last updated: 2026-06-08

DiffPixel is a local design overlay tool for Chrome. It lets users place reference images over web pages to compare visual implementation details.

## Data Collection

DiffPixel does not collect personal information, browsing history, analytics, telemetry, or usage data.

DiffPixel does not collect, transmit, sell, or share page content, form input, credentials, uploaded images, saved layer settings, or visual comparison data.

## Local Storage

When a user uploads a reference image, the image and related layer settings may be saved in Chrome local storage on the user's device so the overlay can be restored for the same site. This data is not transmitted to DiffPixel or to any third party.

Users can clear saved site settings from the extension UI or remove all extension data from Chrome's extension settings.

## Network Use

DiffPixel does not contact external servers. It does not use remote code, remote fonts, analytics, ads, or tracking scripts.

## Permissions

- `activeTab`: lets DiffPixel run on the current tab after the user clicks the extension icon.
- `scripting`: injects the overlay panel and styles into the current page.
- `storage`: saves per-site layer settings locally.
- `unlimitedStorage`: supports local reference images that can exceed Chrome's default storage quota.
- `host_permissions` for `http://*/*` and `https://*/*`: lets DiffPixel inject its local content script and CSS into user-selected websites and restore the panel after reloads on sites where the user has enabled DiffPixel. The websites a user reviews cannot be known in advance, so a fixed domain list would prevent the core visual QA workflow from working.

Host permissions are used only for DiffPixel's single purpose: showing the in-page panel and overlaying user-provided reference images for visual comparison.

## Contact

For privacy questions, use the support contact listed on the Chrome Web Store item.
