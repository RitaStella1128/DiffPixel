/* Toggle the in-page floating panel from the extension toolbar icon. */
chrome.runtime.onMessage.addListener((msg, _sender) => {
  if (msg.type === 'LAYER_MOVED' || msg.type === 'THEME_CHANGED') {
    chrome.runtime.sendMessage(msg).catch(() => {});
  }
});

function sitePattern(urlString) {
  try {
    const url = new URL(urlString);
    return ['http:', 'https:'].includes(url.protocol) ? `${url.protocol}//${url.hostname}/*` : '';
  } catch {
    return '';
  }
}

function storagePrefix(urlString) {
  try {
    const url = new URL(urlString);
    return `dp_${url.hostname || url.protocol.replace(':', '')}`;
  } catch {
    return 'dp_page';
  }
}

function panelVisibleKey(urlString) {
  return `${storagePrefix(urlString)}_panel_visible`;
}

function scriptId(pattern) {
  let hash = 0;
  for (const char of pattern) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return `diffpixel-site-${Math.abs(hash)}`;
}

async function enableSiteInjection(tab) {
  const pattern = sitePattern(tab?.url);
  if (!pattern) return false;
  const hasPermission = await chrome.permissions.contains({ origins: [pattern] }).catch(() => false);
  const granted = hasPermission || await chrome.permissions.request({ origins: [pattern] }).catch(() => false);
  if (!granted) return false;

  const id = scriptId(pattern);
  const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [id] }).catch(() => []);
  if (existing.length) {
    const current = existing[0] || {};
    const hasAssets = current.js?.includes('content/content.js') && current.css?.includes('content/content.css');
    const hasMatch = current.matches?.includes(pattern);
    if (hasAssets && hasMatch) return true;
    await chrome.scripting.unregisterContentScripts({ ids: [id] }).catch(() => {});
  }
  const registered = await chrome.scripting.registerContentScripts([{
    id,
    matches: [pattern],
    js: ['content/content.js'],
    css: ['content/content.css'],
    runAt: 'document_idle',
    persistAcrossSessions: true,
  }]).then(() => true).catch(() => false);
  return registered;
}

/* Extension button click: toggle the page panel, injecting assets if needed. */
chrome.action.onClicked.addListener(async tab => {
  if (!tab?.id) return;
  const siteReady = await enableSiteInjection(tab);
  const visibleKey = panelVisibleKey(tab.url);
  const stored = await chrome.storage.local.get(visibleKey).catch(() => ({}));
  const shouldShow = stored[visibleKey] !== true;

  if (!shouldShow) {
    await chrome.storage.local.set({ [visibleKey]: false }).catch(() => {});
    await chrome.tabs.sendMessage(tab.id, { type: 'HIDE_PANEL', persist: false }).catch(() => null);
    return;
  }

  if (siteReady) {
    await chrome.storage.local.set({ [visibleKey]: true }).catch(() => {});
  }

  const shown = await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL', persist: false }).catch(() => null);
  if (shown) return;

  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content/content.js'] });
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['content/content.css'] });
    await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL', persist: false }).catch(() => null);
  } catch {
    /* chrome://, edge://, and other restricted pages cannot be scripted. */
  }
});
