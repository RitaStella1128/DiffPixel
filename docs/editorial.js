/* Shared behaviour for DiffPixel's editorial pages. */
(function () {
  'use strict';

  const buttons = [...document.querySelectorAll('[data-lang-button]')];
  const panels = [...document.querySelectorAll('[data-lang-panel]')];
  const localizedElements = [...document.querySelectorAll('[data-en][data-ja]')];
  const localizedLinks = [...document.querySelectorAll('[data-en-href][data-ja-href]')];
  function setLanguage(language, updateHash) {
    document.documentElement.lang = language;

    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.langButton === language));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.langPanel === language;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });

    localizedElements.forEach((element) => {
      element.textContent = element.dataset[language];
    });

    localizedLinks.forEach((link) => {
      link.href = language === 'ja' ? link.dataset.jaHref : link.dataset.enHref;
    });

    if (document.body.dataset.titleEn) {
      document.title = language === 'ja' ? document.body.dataset.titleJa : document.body.dataset.titleEn;
    }

    if (updateHash) history.replaceState(null, '', `#${language}`);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.langButton, true));
  });

  const hash = location.hash.slice(1);
  const initialLanguage = hash === 'ja' || hash.startsWith('ja-')
    ? 'ja'
    : hash === 'en' || hash.startsWith('en-')
      ? 'en'
      : navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';

  setLanguage(initialLanguage, false);

})();
