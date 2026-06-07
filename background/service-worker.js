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

function isSupportedPage(urlString) {
  return !!sitePattern(urlString);
}

function hostOf(urlString) {
  try {
    const url = new URL(urlString);
    return ['http:', 'https:'].includes(url.protocol) ? url.hostname : '';
  } catch {
    return '';
  }
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
  if (!hasPermission) return false;

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

async function ensureTabScript(tabId) {
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content/content.js'] });
    await chrome.scripting.insertCSS({ target: { tabId }, files: ['content/content.css'] });
    return true;
  } catch {
    return false;
  }
}

async function applyVisibilityToDomainTabs(sourceTab, visible) {
  const host = hostOf(sourceTab?.url);
  if (!host) return;
  const tabs = await chrome.tabs.query({}).catch(() => []);
  await Promise.all(tabs
    .filter(tab => tab.id && tab.id !== sourceTab.id && hostOf(tab.url) === host)
    .map(async tab => {
      if (visible) {
        let shown = await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL', persist: false }).catch(() => null);
        if (!shown && await ensureTabScript(tab.id)) {
          shown = await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL', persist: false }).catch(() => null);
        }
        return shown;
      }
      return chrome.tabs.sendMessage(tab.id, { type: 'HIDE_PANEL', persist: false }).catch(() => null);
    }));
}

async function applyStoredVisibilityToTab(tab) {
  if (!tab?.id || !isSupportedPage(tab.url)) return;
  const visibleKey = panelVisibleKey(tab.url);
  const stored = await chrome.storage.local.get(visibleKey).catch(() => ({}));
  const visible = stored[visibleKey] === true;
  if (visible) {
    const siteReady = await enableSiteInjection(tab);
    if (!siteReady) return;
    let shown = await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL', persist: false }).catch(() => null);
    if (!shown && await ensureTabScript(tab.id)) {
      await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL', persist: false }).catch(() => null);
    }
  } else {
    await chrome.tabs.sendMessage(tab.id, { type: 'HIDE_PANEL', persist: false }).catch(() => null);
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    applyStoredVisibilityToTab(tab || { id: tabId }).catch(() => {});
  }
});

chrome.tabs.onActivated.addListener(async info => {
  const tab = await chrome.tabs.get(info.tabId).catch(() => null);
  if (tab) await applyStoredVisibilityToTab(tab).catch(() => {});
});

/* Extension button click: toggle the page panel, injecting assets if needed. */
chrome.action.onClicked.addListener(async tab => {
  if (!tab?.id || !isSupportedPage(tab.url)) return;
  const visibleKey = panelVisibleKey(tab.url);
  const status = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PANEL_STATUS' }).catch(() => null);
  const shouldShow = !status?.visible;

  if (!shouldShow) {
    await chrome.storage.local.set({ [visibleKey]: false }).catch(() => {});
    await chrome.tabs.sendMessage(tab.id, { type: 'HIDE_PANEL', persist: false }).catch(() => null);
    await applyVisibilityToDomainTabs(tab, false);
    return;
  }

  await chrome.storage.local.set({ [visibleKey]: true }).catch(() => {});
  const siteReady = await enableSiteInjection(tab);

  const shown = await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL', persist: false }).catch(() => null);
  if (shown) {
    if (siteReady) await applyVisibilityToDomainTabs(tab, true);
    return;
  }

  if (await ensureTabScript(tab.id)) {
    await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL', persist: false }).catch(() => null);
    if (siteReady) await applyVisibilityToDomainTabs(tab, true);
  }
});
