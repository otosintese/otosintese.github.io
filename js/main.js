/* ==========================================================================
   otoworks — interações gerais (menu, reveal, contadores, destaques)
   ========================================================================== */

(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------------------ */
  var navToggle = doc.querySelector('[data-nav-toggle]');
  var navMenu = doc.querySelector('[data-nav-menu]');

  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ------------------------------------------------------------------------
     Header com sombra ao rolar
     ------------------------------------------------------------------------ */
  var header = doc.querySelector('[data-header]');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------------
     Ano no rodapé
     ------------------------------------------------------------------------ */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------------
     Abre o "Como publicar" quando o link leva até ele
     ------------------------------------------------------------------------ */
  function openHashDetails() {
    if (!window.location.hash) return;
    var target = doc.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target && target.tagName === 'DETAILS') target.open = true;
  }

  openHashDetails();
  window.addEventListener('hashchange', openHashDetails);

  /* ------------------------------------------------------------------------
     Animações de entrada
     ------------------------------------------------------------------------ */
  var revealItems = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    revealItems.forEach(function (el, index) {
      if (!el.style.getPropertyValue('--d')) {
        el.style.setProperty('--d', Math.min(index * 55, 385) + 'ms');
      }
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Brilho que segue o mouse nos cartões
     ------------------------------------------------------------------------ */
  if (!reduceMotion) {
    doc.addEventListener('pointermove', function (event) {
      var target = event.target;
      var card = target && target.closest ? target.closest('.project-card, .step-card') : null;
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Projetos em destaque na página inicial
     ------------------------------------------------------------------------ */
  var featuredGrid = doc.querySelector('[data-featured-grid]');

  if (featuredGrid && window.OtoCards) {
    var fallback = doc.querySelector('[data-featured-fallback]');

    fetch('projetos.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        var projects = Array.isArray(data) ? data : (data && Array.isArray(data.projects) ? data.projects : []);
        var featured = projects.filter(function (item) { return item && item.featured === true; });
        var list = (featured.length ? featured : projects).slice(0, 3);

        if (!list.length) {
          featuredGrid.innerHTML = '<p class="muted-note">Nenhum projeto cadastrado ainda. ' +
            '<a href="projetos.html">Veja a página de projetos</a>.</p>';
          return;
        }

        featuredGrid.replaceChildren.apply(featuredGrid, list.map(function (project, index) {
          return window.OtoCards.create(project, index);
        }));
      })
      .catch(function () {
        featuredGrid.replaceChildren();
        featuredGrid.hidden = true;
        if (fallback) fallback.hidden = false;
      });
  }
})();
