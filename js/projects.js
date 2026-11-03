/* ==========================================================================
   otoworks — página de projetos (busca, tags e renderização via JSON)
   ========================================================================== */

(function () {
  'use strict';

  var grid = document.querySelector('[data-projects-grid]');
  if (!grid) return;

  var searchInput = document.querySelector('[data-search]');
  var chipsWrap = document.querySelector('[data-chips]');
  var countEl = document.querySelector('[data-result-count]');
  var emptyState = document.querySelector('[data-empty]');
  var errorState = document.querySelector('[data-error]');
  var clearBtn = document.querySelector('[data-clear]');
  var retryBtn = document.querySelector('[data-retry]');

  var all = [];
  var activeTag = 'all';
  var query = '';
  var inputTimer = null;

  function escapeHtml(value) {
    return (window.OtoCards && window.OtoCards.escapeHtml)
      ? window.OtoCards.escapeHtml(value)
      : String(value == null ? '' : value);
  }

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function tagsOf(project) {
    return Array.isArray(project.tags) ? project.tags : [];
  }

  function matches(project) {
    var tags = tagsOf(project);
    var tagOk = activeTag === 'all' || tags.some(function (tag) {
      return normalize(tag) === normalize(activeTag);
    });
    if (!tagOk) return false;
    if (!query) return true;

    var haystack = normalize([project.title, project.description].concat(tags).join(' '));
    return normalize(query).split(/\s+/).filter(Boolean).every(function (word) {
      return haystack.indexOf(word) !== -1;
    });
  }

  function render() {
    var list = all.filter(matches);

    grid.replaceChildren.apply(grid, list.map(function (project, index) {
      return window.OtoCards.create(project, index);
    }));

    if (emptyState) {
      emptyState.hidden = list.length > 0;
      if (!all.length) {
        var title = emptyState.querySelector('h2');
        var text = emptyState.querySelector('p');
        if (title) title.textContent = 'Nenhum projeto cadastrado ainda';
        if (text) text.textContent = 'Adicione um projeto ao arquivo projetos.json para vê-lo aqui.';
        if (clearBtn) clearBtn.hidden = true;
      }
    }

    if (countEl) {
      countEl.textContent = list.length === 1 ? '1 projeto' : list.length + ' projetos';
    }

    if (chipsWrap) {
      chipsWrap.querySelectorAll('.chip').forEach(function (chip) {
        chip.setAttribute('aria-pressed', String(chip.getAttribute('data-tag') === activeTag));
      });
    }
  }

  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    if (activeTag === 'all') {
      url.searchParams.delete('tag');
    } else {
      url.searchParams.set('tag', activeTag);
    }
    window.history.replaceState(null, '', url);
  }

  function buildChips() {
    if (!chipsWrap) return;

    var counts = new Map();
    all.forEach(function (project) {
      tagsOf(project).forEach(function (tag) {
        var key = String(tag);
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });

    var tags = Array.from(counts.keys()).sort(function (a, b) {
      return a.localeCompare(b, 'pt-BR');
    });

    var buttons = [];
    var allButton = docButton('all', 'Todos', all.length);
    buttons.push(allButton);

    tags.forEach(function (tag) {
      buttons.push(docButton(tag, tag, counts.get(tag)));
    });

    chipsWrap.replaceChildren.apply(chipsWrap, buttons);

    var params = new URLSearchParams(window.location.search);
    var initial = params.get('tag');
    if (initial) {
      var found = tags.find(function (tag) {
        return normalize(tag) === normalize(initial);
      });
      if (found) activeTag = found;
    }
  }

  function docButton(tag, label, count) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.setAttribute('data-tag', tag);
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = escapeHtml(label) + ' <span class="chip__count">' + count + '</span>';
    return button;
  }

  function clearFilters() {
    activeTag = 'all';
    query = '';
    if (searchInput) searchInput.value = '';
    render();
    syncUrl();
  }

  /* Eventos ----------------------------------------------------------------- */
  if (chipsWrap) {
    chipsWrap.addEventListener('click', function (event) {
      var chip = event.target.closest ? event.target.closest('.chip') : null;
      if (!chip) return;
      activeTag = chip.getAttribute('data-tag') || 'all';
      render();
      syncUrl();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      window.clearTimeout(inputTimer);
      inputTimer = window.setTimeout(function () {
        query = searchInput.value.trim();
        render();
      }, 130);
    });
  }

  if (clearBtn) clearBtn.addEventListener('click', clearFilters);
  if (retryBtn) retryBtn.addEventListener('click', function () { window.location.reload(); });

  /* Carregamento ------------------------------------------------------------ */
  fetch('projetos.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      var list = Array.isArray(data) ? data : (data && Array.isArray(data.projects) ? data.projects : null);
      if (!list) throw new Error('Formato inválido em projetos.json');

      all = list.filter(function (project) {
        return project && typeof project === 'object';
      });

      buildChips();
      render();
    })
    .catch(function () {
      grid.replaceChildren();
      if (countEl) countEl.textContent = '—';
      if (emptyState) emptyState.hidden = true;
      if (errorState) errorState.hidden = false;
      if (chipsWrap) chipsWrap.replaceChildren();
    });
})();
