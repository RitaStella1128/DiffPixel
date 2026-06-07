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

function scriptId(pattern) {
  let hash = 0;
  for (const char of pattern) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return `diffpixel-site-${Math.abs(hash)}`;
}

async function enableSiteInjection(tab) {
  const pattern = sitePattern(tab?.url);
  if (!pattern) return;
  const granted = await chrome.permissions.request({ origins: [pattern] }).catch(() => false);
  if (!granted) return;

  const id = scriptId(pattern);
  const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [id] }).catch(() => []);
  if (existing.length) return;
  await chrome.scripting.registerContentScripts([{
    id,
    matches: [pattern],
    js: ['content/content.js'],
    css: ['content/content.css'],
    runAt: 'document_idle',
    persistAcrossSessions: true,
  }]).catch(() => {});
}

/* Extension button click: toggle the page panel, injecting assets if needed. */
chrome.action.onClicked.addListener(async tab => {
  if (!tab?.id) return;

  /* Content script already present: just toggle. */
  const toggled = await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_PANEL' }).catch(() => null);
  if (toggled) {
    if (toggled.visible) await enableSiteInjection(tab);
    return;
  }

  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content/content.js'] });
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['content/content.css'] });
    const shown = await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_PANEL' }).catch(() => null);
    if (shown?.visible) await enableSiteInjection(tab);
  } catch {
    /* chrome://, edge://, and other restricted pages cannot be scripted. */
  }
});
