/* DiffPixel landing page: localization, comparison, and workflow state. */
(function () {
  'use strict';

  const docEl = document.documentElement;
  const header = document.querySelector('.site-header');
  const panels = [...document.querySelectorAll('[data-lang-panel]')];
  const languageButtons = [...document.querySelectorAll('[data-lang-button]')];
  const headerNavLinks = [...document.querySelectorAll('.site-nav [data-section-key]')];
  const headerInstall = document.querySelector('.header-cta');
  const metaDescription = document.querySelector('meta[name="description"]');

  const copy = {
    en: {
      title: 'DiffPixel — See the pixel that drifted.',
      description: 'Overlay a reference image, align the page, and reveal every visual difference without leaving Chrome. DiffPixel is free, private, and local-only.',
      nav: { demo: 'Demo', workflow: 'Workflow' },
      install: 'Add to Chrome'
    },
    ja: {
      title: 'DiffPixel — 1pxのズレが、見える。',
      description: '参照画像を重ね、位置を合わせ、差分を見つける。Chromeを離れずに使える無料・ローカル動作のビジュアルQA拡張機能です。',
      nav: { demo: 'デモ', workflow: '使い方' },
      install: 'Chrome に追加'
    }
  };

  const validSectionKeys = new Set(['demo', 'workflow', 'capabilities', 'privacy', 'contact']);

  function sectionId(language, key) {
    if (language === 'ja') return key === 'demo' ? 'ja-demo' : `ja-${key}`;
    return key;
  }

  function hashFor(language, key) {
    if (key === 'demo') return language === 'ja' ? '#ja' : '#en';
    return `#${sectionId(language, key)}`;
  }

  function keyFromHash(hash) {
    const value = hash.replace(/^#/, '');
    const normalized = value.replace(/^ja-/, '');
    if (validSectionKeys.has(normalized)) return normalized;
    if (value === 'ja' || value === 'en') return 'demo';
    if (value === 'features' || value === 'ja-features') return 'capabilities';
    if (value === 'how' || value === 'ja-how') return 'workflow';
    return 'demo';
  }

  function languageFromHash(hash) {
    const value = hash.replace(/^#/, '');
    if (value === 'ja' || value.startsWith('ja-')) return 'ja';
    if (value === 'en' || validSectionKeys.has(value)) return 'en';
    return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
  }

  function currentSectionKey() {
    const activePanel = document.querySelector('[data-lang-panel]:not([hidden])');
    if (!activePanel) return 'demo';
    const sections = [...activePanel.querySelectorAll('section[data-section-key]')];
    if (!sections.length) return 'demo';
    const viewportCenter = window.innerHeight * .48;
    return sections.reduce((closest, section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs((rect.top + Math.min(rect.height, window.innerHeight) / 2) - viewportCenter);
      return distance < closest.distance ? { key: section.dataset.sectionKey, distance } : closest;
    }, { key: 'demo', distance: Infinity }).key;
  }

  function updateHeader(language) {
    headerNavLinks.forEach((link) => {
      const key = link.dataset.sectionKey;
      link.textContent = copy[language].nav[key];
      link.href = `#${sectionId(language, key)}`;
    });
    if (headerInstall) headerInstall.textContent = copy[language].install;
  }

  function setLanguage(language, options) {
    const settings = { preserveSection: false, updateHash: false, ...options };
    const key = settings.preserveSection ? currentSectionKey() : keyFromHash(location.hash);

    docEl.lang = language;
    document.title = copy[language].title;
    if (metaDescription) metaDescription.content = copy[language].description;

    languageButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.langButton === language));
    });

    panels.forEach((panel) => {
      const active = panel.dataset.langPanel === language;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });

    updateHeader(language);

    if (settings.updateHash) history.replaceState(null, '', hashFor(language, key));

    if (settings.preserveSection) {
      requestAnimationFrame(() => {
        const target = document.getElementById(sectionId(language, key));
        if (!target) return;
        const headerOffset = header ? header.offsetHeight + 18 : 18;
        const top = Math.max(0, target.offsetTop - headerOffset);
        window.scrollTo({ top, behavior: 'auto' });
      });
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.langButton, {
      preserveSection: true,
      updateHash: true
    }));
  });

  const initialLanguage = languageFromHash(location.hash);
  setLanguage(initialLanguage, { preserveSection: false, updateHash: false });

  requestAnimationFrame(() => {
    const initialKey = keyFromHash(location.hash);
    if (initialKey === 'demo') return;
    const target = document.getElementById(sectionId(initialLanguage, initialKey));
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
  });

  document.querySelectorAll('[data-diff-slider]').forEach((slider) => {
    const range = slider.querySelector('.diff-range');
    const valueLabel = slider.querySelector('.diff-value');
    const language = slider.closest('[data-lang-panel]')?.dataset.langPanel || docEl.lang;
    if (!range) return;

    function update(value) {
      const next = Math.min(100, Math.max(0, Number(value)));
      range.value = String(next);
      range.setAttribute('aria-valuenow', String(next));
      range.setAttribute('aria-valuetext', language === 'ja' ? `${next}パーセント` : `${next} percent`);
      slider.style.setProperty('--split', `${next}%`);
      if (valueLabel) valueLabel.textContent = `${String(next).padStart(2, '0')} / 100`;
    }

    range.addEventListener('input', () => update(range.value));
    range.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      update(Number(range.value) + direction * (event.shiftKey ? 10 : 1));
    });
    update(range.value);
  });

  function activateWorkflowStep(step) {
    const panel = step.closest('[data-lang-panel]');
    const state = step.dataset.workflowState;
    if (!panel || !state) return;

    const frames = [...panel.querySelectorAll('.workflow-frame[data-workflow-state]')];
    const progress = [...panel.querySelectorAll('.workflow-progress span')];
    const hudStates = [...panel.querySelectorAll('.workflow-hud [data-hud-state]')];
    const index = frames.findIndex((frame) => frame.dataset.workflowState === state);

    frames.forEach((frame) => frame.classList.toggle('active', frame.dataset.workflowState === state));
    progress.forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === index));
    hudStates.forEach((item) => item.classList.toggle('active', item.dataset.hudState === state));
  }

  const workflowSteps = [...document.querySelectorAll('.workflow-step[data-workflow-state]')];
  panels.forEach((panel) => {
    const firstStep = panel.querySelector('.workflow-step[data-workflow-state]');
    if (firstStep) activateWorkflowStep(firstStep);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && window.innerWidth > 1100 && !reducedMotion) {
    const workflowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activateWorkflowStep(entry.target);
      });
    }, { rootMargin: '-38% 0px -46% 0px', threshold: 0 });

    workflowSteps.forEach((step) => workflowObserver.observe(step));
  }

  let headerTicking = false;
  function updateScrolledHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 18);
    headerTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (headerTicking) return;
    headerTicking = true;
    requestAnimationFrame(updateScrolledHeader);
  }, { passive: true });
  updateScrolledHeader();
})();
