/* DiffPixel motion system — "REGISTER".
   Native browser scrolling (no scroll-hijacking) + GSAP ScrollTrigger reveals
   + per-character heading registration. Progressive by design: the document
   is fully readable with no JS; hidden pre-states exist only under
   html.has-motion, which is added here when motion is allowed and removed
   again if the animation stack fails. */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Drift titles: ghost layer text is mirrored into a data attribute so the
     CSS ::before misregistration layer can render it. */
  var driftTitles = [].slice.call(document.querySelectorAll('.drift-title'));
  driftTitles.forEach(function (el) {
    if (!el.hasAttribute('data-drift-text')) el.setAttribute('data-drift-text', el.textContent.trim());
  });

  function settleAll() {
    docEl.classList.remove('has-motion');
    [].forEach.call(document.querySelectorAll('.drift-title'), function (el) {
      el.classList.add('is-snapped');
    });
    [].forEach.call(document.querySelectorAll('.split-heading'), function (el) {
      el.classList.add('chars-in');
    });
    [].forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
      el.classList.add('is-in');
    });
  }

  /* QA escape hatch: ?motion=force exercises the full motion path in
     environments that emulate reduced motion (used by design QA tooling). */
  var forceMotion = /[?&]motion=force\b/.test(location.search);

  if ((motionQuery.matches && !forceMotion) || !('IntersectionObserver' in window)) {
    settleAll();
    return;
  }

  docEl.classList.add('has-motion');

  /* ---------- Heading splitter ---------- */

  var segmenter = typeof Intl !== 'undefined' && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

  function graphemes(text) {
    if (!segmenter) return text.split('');
    var out = [];
    var parts = segmenter.segment(text);
    var iterator = parts[Symbol.iterator]();
    var step = iterator.next();
    while (!step.done) { out.push(step.value.segment); step = iterator.next(); }
    return out;
  }

  var CJK = /[⺀-鿿豈-﫿　-〿＀-￯]/;

  /* Kinsoku: characters that must not start a line stay glued to the
     previous word box; characters that must not end a line pull the next
     character into their own box. */
  var NO_START = /[、。，．・：；！？％゠ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮゝゞ々〜…‥)）\]｝」』〕〟]/;
  var NO_END = /[（(「『［{｛〔〝]/;

  function charSpan(char) {
    var span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;
    return span;
  }

  function splitTextNode(node) {
    var fragment = document.createDocumentFragment();
    var tokens = node.nodeValue.split(/(\s+)/);
    tokens.forEach(function (token) {
      if (!token) return;
      if (/^\s+$/.test(token)) {
        fragment.appendChild(document.createTextNode(' '));
        return;
      }
      var word = null;
      function newWord() {
        word = document.createElement('span');
        word.className = 'word';
        fragment.appendChild(word);
      }
      graphemes(token).forEach(function (char) {
        if (!word) {
          newWord();
        } else {
          var lastChar = word.textContent.slice(-1);
          var glued = NO_START.test(char) || NO_END.test(lastChar);
          /* CJK breaks per character (unless kinsoku glues it); a Latin
             run continues the current word only if it follows Latin. */
          var boundary = CJK.test(char) || CJK.test(lastChar);
          if (boundary && !glued) newWord();
        }
        word.appendChild(charSpan(char));
      });
    });
    node.parentNode.replaceChild(fragment, node);
  }

  function splitTree(node) {
    [].slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) splitTextNode(child);
      else if (child.nodeType === 1 && child.tagName !== 'BR') splitTree(child);
    });
  }

  function splitHeading(el) {
    if (el.classList.contains('split-heading')) return;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var wrap = document.createElement('span');
    wrap.setAttribute('aria-hidden', 'true');
    while (el.firstChild) wrap.appendChild(el.firstChild);
    el.appendChild(wrap);
    splitTree(wrap);
    el.classList.add('split-heading');
  }

  /* ---------- Scope: animate only the initially active language panel.
     Inactive panels are settled statically so a mid-session language switch
     always lands on fully readable content. ---------- */

  var activePanel = document.querySelector('[data-lang-panel].active') || document.body;

  [].forEach.call(document.querySelectorAll('[data-lang-panel]:not(.active) .drift-title'), function (el) {
    el.classList.add('is-snapped');
  });

  var heroTitle = activePanel.querySelector('h1.drift-title');
  var scrollTitles = [].slice.call(activePanel.querySelectorAll('h2.drift-title'));
  if (heroTitle) splitHeading(heroTitle);
  scrollTitles.forEach(splitHeading);

  /* Reveal targets, tagged programmatically so the markup stays clean. */
  var HERO_SELECTOR = [
    '.home-hero .eyebrow', '.home-hero .hero-lead', '.hero-copy .btn', '.hero-copy .hud-meta',
    '.editorial-hero .eyebrow', '.editorial-hero .hero-lead', '.editorial-hero .hud-meta',
    '.editorial-hero .hero-visual', '.editorial-hero .privacy-statement'
  ].join(', ');

  var SCROLL_SELECTOR = [
    '.section-heading .eyebrow', '.workflow-step .step-copy', '.workflow-mobile-image',
    '.capabilities-copy .eyebrow', '.capabilities-copy p', '.capabilities-visual',
    '.capability-index li',
    '.privacy-copy .eyebrow', '.privacy-copy p', '.privacy-copy .text-link',
    '.privacy-mark', '.privacy-facts > div',
    '.closing .eyebrow', '.closing .btn',
    '.footer-meta',
    '.status-list > div', '.chapter-index', '.chapter h3', '.chapter-media', '.note',
    '.shortcut-table', '.final-cta .eyebrow', '.final-cta .cta-row', '.final-cta > .btn'
  ].join(', ');

  function tagReveals(selector, value) {
    [].forEach.call(activePanel.querySelectorAll(selector), function (el) {
      if (el.closest('[data-reveal]')) return; /* never nest hidden states */
      el.setAttribute('data-reveal', value);
    });
  }

  tagReveals(HERO_SELECTOR, 'hero');
  tagReveals(SCROLL_SELECTOR, '');

  /* ---------- Load the animation stack, then run ---------- */

  var settleTimer = window.setTimeout(settleAll, 4000);

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadScript('vendor/gsap.min.js')
    .then(function () {
      return loadScript('vendor/ScrollTrigger.min.js');
    })
    .then(init)
    .catch(function () {
      window.clearTimeout(settleTimer);
      settleAll();
    });

  function init() {
    window.clearTimeout(settleTimer);
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) { settleAll(); return; }

    gsap.registerPlugin(ScrollTrigger);

    /* Scrolling stays entirely native (CSS scroll-behavior + scroll-padding-top
       already handle anchor links and header offset); ScrollTrigger listens
       to native scroll events, no hijacking or custom raf loop involved. */

    function markDone(targets) {
      targets.forEach(function (el) {
        el.classList.add('is-in');
        gsap.set(el, { clearProps: 'all' });
      });
    }

    /* Hero: characters snap into register, then the ghost layer resolves. */
    var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (heroTitle) {
      var heroChars = heroTitle.querySelectorAll('.char');
      intro.to(heroChars, { opacity: 1, x: 0, y: 0, duration: .9, stagger: .022 }, .08);
      intro.add(function () { heroTitle.classList.add('is-snapped'); }, .5);
      intro.add(function () {
        heroTitle.classList.add('chars-in');
        gsap.set(heroChars, { clearProps: 'all' });
      });
    }

    var heroReveals = [].slice.call(activePanel.querySelectorAll('[data-reveal="hero"]'));
    if (heroReveals.length) {
      intro.to(heroReveals, {
        opacity: 1,
        y: 0,
        duration: .8,
        stagger: .09,
        onComplete: function () { markDone(heroReveals); }
      }, heroTitle ? .4 : .1);
    }

    /* Section headings: per-character registration on entry. */
    scrollTitles.forEach(function (title) {
      var chars = title.querySelectorAll('.char');
      ScrollTrigger.create({
        trigger: title,
        start: 'top 84%',
        once: true,
        onEnter: function () {
          title.classList.add('is-snapped');
          gsap.to(chars, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: .8,
            ease: 'expo.out',
            stagger: .02,
            onComplete: function () {
              title.classList.add('chars-in');
              gsap.set(chars, { clearProps: 'all' });
            }
          });
        }
      });
    });

    /* Everything else: batched rise-and-settle with stagger. */
    var revealTargets = [].slice.call(activePanel.querySelectorAll('[data-reveal=""]'));
    if (revealTargets.length) {
      ScrollTrigger.batch(revealTargets, {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: .75,
            ease: 'power3.out',
            stagger: .08,
            onComplete: function () { markDone(batch); }
          });
        }
      });
    }

    /* Gentle parallax on the large product frames (transform only). */
    [].forEach.call(activePanel.querySelectorAll('.diff-comparison, .capabilities-visual, .hero-visual'), function (el) {
      gsap.fromTo(el, { y: 34 }, {
        y: -26,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Language switches toggle panel display; recompute trigger positions. */
    new MutationObserver(function () {
      window.requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    }).observe(docEl, { attributes: true, attributeFilter: ['lang'] });

    /* If the user enables reduced motion mid-session, stand everything down. */
    var onMotionChange = function (event) {
      if (!event.matches) return;
      ScrollTrigger.getAll().forEach(function (trigger) { trigger.kill(); });
      gsap.globalTimeline.clear();
      settleAll();
    };
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
  }
})();
