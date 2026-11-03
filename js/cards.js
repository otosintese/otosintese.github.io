/* ==========================================================================
   otoworks — renderização de cartões de projeto
   Usado pela página inicial (destaques) e pela página de projetos.
   ========================================================================== */

(function () {
  'use strict';

  var STATUS = {
    ativo: { label: 'Ativo', cls: 'status--active' },
    'em breve': { label: 'Em breve', cls: 'status--soon' },
    arquivado: { label: 'Arquivado', cls: 'status--archived' }
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeUrl(url) {
    var value = String(url || '').trim();
    return /^https?:\/\//i.test(value) ? value : '#';
  }

  function isImage(icon) {
    return /^(https?:\/\/|assets\/|\.?\/|data:image\/)/i.test(icon) ||
      /\.(png|jpe?g|svg|webp|gif|avif)(\?.*)?$/i.test(icon);
  }

  function normalizeStatus(status) {
    var key = String(status || 'ativo').toLowerCase().trim();
    return STATUS[key] || STATUS.ativo;
  }

  function iconHtml(project) {
    var icon = String(project.icon || '').trim();
    if (icon && isImage(icon)) {
      return '<img src="' + escapeHtml(icon) + '" alt="" loading="lazy" onerror="this.remove()">';
    }
    if (icon) return escapeHtml(icon);
    var title = String(project.title || '?').trim();
    return escapeHtml(title.charAt(0).toUpperCase() || '?');
  }

  function create(project, index) {
    var accent = String(project.accent || 'green').toLowerCase() === 'purple' ? 'purple' : 'green';
    var status = normalizeStatus(project.status);
    var tags = Array.isArray(project.tags) ? project.tags : [];
    var title = project.title || 'Projeto sem nome';

    var el = document.createElement('a');
    el.className = 'project-card accent-' + accent + ' card-enter';
    el.href = safeUrl(project.url);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
    el.style.setProperty('--enter-delay', Math.min((index || 0) * 55, 440) + 'ms');
    el.setAttribute('aria-label', title + ' — abrir em nova aba');

    var tagsHtml = tags.length
      ? '<div class="tags">' + tags.map(function (tag) {
          return '<span class="tag">' + escapeHtml(tag) + '</span>';
        }).join('') + '</div>'
      : '<div class="tags" aria-hidden="true"></div>';

    el.innerHTML =
      '<div class="project-card__top">' +
        '<span class="project-card__icon" aria-hidden="true">' + iconHtml(project) + '</span>' +
        '<span class="status ' + status.cls + '"><span class="dot" aria-hidden="true"></span>' + status.label + '</span>' +
      '</div>' +
      '<h3>' + escapeHtml(title) + '</h3>' +
      '<p>' + escapeHtml(project.description || '') + '</p>' +
      tagsHtml +
      '<span class="project-card__footer">' +
        '<span>Abrir projeto</span>' +
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>' +
      '</span>';

    return el;
  }

  window.OtoCards = { create: create, escapeHtml: escapeHtml };
})();
