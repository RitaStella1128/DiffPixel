/* DiffPixel — site behaviour
   Vanilla, dependency-free. Every motion feature is gated on prefers-reduced-motion
   and degrades to a fully usable static page if it never runs.
   Concept: "the diff is the interface" — motion explains state, never decorates. */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };

  /* ───────────────────── Language switch ───────────────────── */
  (function lang() {
    var buttons = [].slice.call(document.querySelectorAll('[data-lang-button]'));
    var panels = [].slice.call(document.querySelectorAll('[data-lang-panel]'));
    if (!buttons.length) return;

    var navLabels = {
      en: { features: 'Features', how: 'How it works', faq: 'FAQ', manual: 'Manual', privacy: 'Privacy', install: 'Add to Chrome' },
      ja: { features: '機能', how: '使い方', faq: 'FAQ', manual: 'マニュアル', privacy: 'プライバシー', install: 'Chrome に追加' }
    };
    var footerLabels = {
      en: {
        manual: 'Manual', privacy: 'Privacy Policy',
        kicker: 'Get started',
        cta: 'Compare the design and the build, pixel by pixel.',
        status: 'Available on the Chrome Web Store'
      },
      ja: {
        manual: 'マニュアル', privacy: 'プライバシーポリシー',
        kicker: '始めましょう',
        cta: 'デザインと実装を、ピクセル単位で比較。',
        status: 'Chrome ウェブストアで公開中'
      }
    };

    function setLang(lang) {
      docEl.lang = lang;
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.langButton === lang)); });
      panels.forEach(function (p) { p.classList.toggle('active', p.dataset.langPanel === lang); });
      document.querySelectorAll('[data-nav]').forEach(function (a) {
        var k = a.dataset.nav; if (navLabels[lang][k]) a.textContent = navLabels[lang][k];
      });
      document.querySelectorAll('[data-nav-f]').forEach(function (a) {
        var k = a.dataset.navF; if (footerLabels[lang] && footerLabels[lang][k]) a.textContent = footerLabels[lang][k];
      });
      try { history.replaceState(null, '', '#' + lang); } catch (e) {}
      if (window.__measure) window.__measure();
    }

    buttons.forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.langButton); }); });
    var h = location.hash.replace('#', '');
    var init = (h === 'en' || h === 'ja') ? h
      : (navigator.language.toLowerCase().indexOf('ja') === 0 ? 'ja' : 'en');
    setLang(init);
  })();

  /* ───────────────────── Scroll reveal ───────────────────── */
  (function reveal() {
    var els = [].slice.call(document.querySelectorAll('.rv'));
    if (!els.length || reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ───────────────────── Header condense on scroll ───────────────────── */
  (function header() {
    var h = document.querySelector('.site-header');
    if (!h) return;
    var tick = function (y) { h.classList.toggle('scrolled', y > 12); };
    window.__onScroll = (window.__onScroll || []).concat(tick);
    tick(window.scrollY || 0);
  })();

  /* ───────────────────── Diff reveal slider ───────────────────── */
  (function diff() {
    [].slice.call(document.querySelectorAll('.diff')).forEach(function (d) {
      var handle = d.querySelector('.diff-handle');
      function setSplit(clientX) {
        var r = d.getBoundingClientRect();
        var pct = clamp(((clientX - r.left) / r.width) * 100, 0, 100);
        d.style.setProperty('--split', pct + '%');
        if (handle) handle.setAttribute('aria-valuenow', Math.round(pct));
      }
      var dragging = false;
      d.addEventListener('pointerdown', function (e) { dragging = true; try { d.setPointerCapture(e.pointerId); } catch (err) {} setSplit(e.clientX); });
      d.addEventListener('pointermove', function (e) { if (dragging) setSplit(e.clientX); });
      d.addEventListener('pointerup', function () { dragging = false; });
      d.addEventListener('pointercancel', function () { dragging = false; });
      if (handle) {
        handle.setAttribute('tabindex', '0');
        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-label', 'Reveal the difference');
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.addEventListener('keydown', function (e) {
          var cur = parseFloat(d.style.getPropertyValue('--split')) || 50;
          if (e.key === 'ArrowLeft') { cur -= 4; } else if (e.key === 'ArrowRight') { cur += 4; } else { return; }
          e.preventDefault();
          cur = clamp(cur, 0, 100);
          d.style.setProperty('--split', cur + '%');
          handle.setAttribute('aria-valuenow', Math.round(cur));
        });
      }
    });
  })();

  /* ───────────────────── Intro (meaningful preloader) ───────────────────── */
  (function intro() {
    var el = document.querySelector('.intro');
    if (!el) return;
    if (reduce) { el.classList.add('done'); window.setTimeout(function () { el.remove(); }, 50); return; }
    var dismissed = false;
    function finish() {
      if (dismissed) return; dismissed = true;
      el.classList.add('done');
      window.setTimeout(function () { if (el.parentNode) el.remove(); }, 700);
    }
    // The two layers register, then dissolve — ~900ms, skippable.
    window.setTimeout(finish, 1000);
    ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, finish, { once: true, passive: true });
    });
    window.addEventListener('load', function () { window.setTimeout(finish, 600); });
  })();

  /* ───────────────────── Reticle cursor (alignment crosshair) ───────────────────── */
  (function reticle() {
    if (!fine || reduce) return;
    var el = document.createElement('div');
    el.className = 'reticle';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    document.body.classList.add('reticle-on');
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty, on = false;
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!on) { on = true; el.classList.add('on'); cx = tx; cy = ty; }
      var t = e.target.closest && e.target.closest('a, button, summary, .diff, [role="slider"]');
      el.classList.toggle('hot', !!t);
    });
    document.addEventListener('pointerleave', function () { on = false; el.classList.remove('on'); });
    (function loop() {
      cx = lerp(cx, tx, 0.35); cy = lerp(cy, ty, 0.35);
      el.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      requestAnimationFrame(loop);
    })();
  })();

  /* ───────────────────── Magnetic primary CTA (one element only) ───────────────────── */
  (function magnetic() {
    if (!fine || reduce) return;
    [].slice.call(document.querySelectorAll('[data-magnetic]')).forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + (mx * 0.18) + 'px,' + (my * 0.28) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  })();

  /* ───────────────────── Smooth scroll transport (lerp) ───────────────────── */
  (function smooth() {
    var root = document.getElementById('scroll-root');
    if (!root || reduce || !fine || window.innerWidth < 720) return;

    docEl.classList.add('has-smooth');
    var current = 0, target = window.scrollY || 0, height = 0, raf = 0, running = false;

    function measure() {
      height = root.scrollHeight;
      document.body.style.height = height + 'px';
    }
    window.__measure = measure;
    measure();

    function onScroll() {
      target = window.scrollY || window.pageYOffset || 0;
      start();
    }
    function tick() {
      current = lerp(current, target, 0.1);
      if (Math.abs(target - current) < 0.05) { current = target; running = false; }
      root.style.transform = 'translate3d(0,' + (-current) + 'px,0)';
      (window.__onScroll || []).forEach(function (fn) { fn(current); });
      if (running) raf = requestAnimationFrame(tick);
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(tick); } }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    if ('ResizeObserver' in window) { new ResizeObserver(measure).observe(root); }
    // images can change height after load
    window.addEventListener('load', measure);

    // Anchor links: convert in-page jumps into smooth target scrolls
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id || id === 'en' || id === 'ja') return;
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var rect = el.getBoundingClientRect();
      var header = document.querySelector('.site-header');
      var offset = header ? header.offsetHeight + 18 : 18;
      var top = rect.top + current - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    });

    start();
  })();

  /* ───────────────────── Native scroll listeners when transport is off ───────────────────── */
  if (!docEl.classList.contains('has-smooth')) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY || window.pageYOffset || 0;
      (window.__onScroll || []).forEach(function (fn) { fn(y); });
    }, { passive: true });
  }

  /* ───────────────────── Page transition veil ───────────────────── */
  (function transition() {
    if (reduce) return;
    var veil = document.querySelector('.page-veil');
    if (!veil) { veil = document.createElement('div'); veil.className = 'page-veil'; veil.setAttribute('aria-hidden', 'true'); document.body.appendChild(veil); }

    // Enter
    docEl.classList.add('entering');
    requestAnimationFrame(function () { requestAnimationFrame(function () { docEl.classList.add('ready'); }); });
    window.setTimeout(function () { docEl.classList.remove('entering', 'ready'); }, 700);

    function isInternal(a) {
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
      if (a.origin !== location.origin) return false;
      var path = a.pathname;
      return /\.html$/.test(path) || path.endsWith('/');
    }
    document.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!isInternal(a)) return;
      if (a.pathname === location.pathname && a.hash) return; // same-page anchor
      e.preventDefault();
      docEl.classList.add('leaving');
      window.setTimeout(function () { location.href = a.href; }, 430);
    });
    // bfcache restore
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) { docEl.classList.remove('leaving'); }
    });
  })();

})();
