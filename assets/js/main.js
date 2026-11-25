(function () {
  // Mobile menu
  var links = document.getElementById('nav-links');
  document.getElementById('menu-toggle').addEventListener('click', function () {
    links.classList.toggle('open');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') links.classList.remove('open');
  });

  // Lightbox for research figures and publication thumbnails
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('figcaption');
  function open(src, alt, cap) {
    lbImg.src = src; lbImg.alt = alt; lbCap.textContent = cap || '';
    lb.hidden = false;
  }
  document.querySelectorAll('figure.zoom').forEach(function (fig) {
    fig.addEventListener('click', function () {
      var img = fig.querySelector('img');
      open(img.src, img.alt, fig.querySelector('figcaption').textContent);
    });
  });
  document.querySelectorAll('.zoom-img').forEach(function (img) {
    img.addEventListener('click', function () { open(img.src, img.alt, ''); });
  });
  function close() { lb.hidden = true; lbImg.src = ''; }
  lb.addEventListener('click', function (e) { if (e.target !== lbImg) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  // Toggle BibTeX
  document.querySelectorAll('.bib-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pre = btn.closest('.pub-right').querySelector('.bib');
      pre.hidden = !pre.hidden;
    });
  });

  // Highlight the nav link for the section in view
  var navAs = Array.prototype.slice.call(links.querySelectorAll('a[href^="#"]'));
  var secs = navAs.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function spy() {
    var y = window.scrollY + 90, idx = 0;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) idx = i; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) idx = secs.length - 1;
    navAs.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  // Theme toggle: system -> light -> dark
  var root = document.documentElement;
  var themeIcon = document.getElementById('theme-icon');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var icons = { system: 'ti-sun-moon', light: 'ti-sun', dark: 'ti-moon-stars' };
  function applyTheme(pref) {
    var dark = pref === 'dark' || (pref === 'system' && mq.matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeIcon.className = 'ti ' + icons[pref];
    document.getElementById('theme-toggle').title = 'Theme: ' + pref;
  }
  var pref = localStorage.getItem('theme') || 'system';
  applyTheme(pref);
  document.getElementById('theme-toggle').addEventListener('click', function () {
    pref = { system: 'light', light: 'dark', dark: 'system' }[pref];
    localStorage.setItem('theme', pref);
    applyTheme(pref);
  });
  mq.addEventListener('change', function () { if (pref === 'system') applyTheme(pref); });

  // Search (⌘K / Ctrl+K)
  var modal = document.getElementById('search-modal');
  var input = document.getElementById('search-input');
  var list = document.getElementById('search-results');
  var items = [];
  function add(cat, text, el, extra) {
    if (!el.id) el.id = 's-' + items.length;
    items.push({ cat: cat, text: text.trim().replace(/\s+/g, ' '), id: el.id, hay: (text + ' ' + (extra || '')).toLowerCase() });
  }
  document.querySelectorAll('main section').forEach(function (sec) {
    var h = sec.querySelector('h2, h1');
    if (h) add('Section', h.textContent, sec, sec.textContent.slice(0, 400));
  });
  document.querySelectorAll('.thread').forEach(function (t) {
    var s = t.querySelector('strong');
    add('Research', s ? s.textContent.replace(/\.$/, '') : t.textContent.slice(0, 80), t, t.textContent);
  });
  document.querySelectorAll('.pub').forEach(function (p) {
    add('Publication', p.querySelector('.pub-title').textContent, p, p.textContent);
  });
  document.querySelectorAll('#experience .row').forEach(function (r) {
    add('Experience', r.querySelector('.org-line').textContent, r, r.textContent);
  });
  document.querySelectorAll('#education .row').forEach(function (r) {
    add('Education', r.querySelector('.row-head').textContent, r, r.textContent);
  });
  document.querySelectorAll('.honors li').forEach(function (l) {
    add('Honor', l.textContent, l);
  });

  var shown = [], sel = 0;
  function render() {
    var q = input.value.trim().toLowerCase();
    var words = q.split(/\s+/).filter(Boolean);
    shown = items.filter(function (it) {
      return words.every(function (w) { return it.hay.indexOf(w) !== -1; });
    }).slice(0, 30);
    sel = 0;
    list.innerHTML = '';
    if (!shown.length) {
      list.innerHTML = '<li class="empty">No results</li>';
      return;
    }
    shown.forEach(function (it, i) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="cat"></span><span class="txt"></span>';
      li.firstChild.textContent = it.cat;
      li.lastChild.textContent = it.text;
      li.addEventListener('mousemove', function () { sel = i; mark(); });
      li.addEventListener('click', function () { go(it); });
      list.appendChild(li);
    });
    mark();
  }
  function mark() {
    Array.prototype.forEach.call(list.children, function (li, i) { li.classList.toggle('sel', i === sel); });
    var cur = list.children[sel];
    if (cur) cur.scrollIntoView({ block: 'nearest' });
  }
  function go(it) {
    closeSearch();
    var el = document.getElementById(it.id);
    el.scrollIntoView({ behavior: 'smooth', block: it.cat === 'Section' ? 'start' : 'center' });
    if (it.cat !== 'Section') {
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    }
  }
  function openSearch() {
    modal.hidden = false; input.value = ''; render(); input.focus();
  }
  function closeSearch() { modal.hidden = true; }
  document.getElementById('search-toggle').addEventListener('click', openSearch);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeSearch(); });
  input.addEventListener('input', render);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); mark(); }
    else if (e.key === 'Enter' && shown[sel]) { go(shown[sel]); }
    else if (e.key === 'Escape') { closeSearch(); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.hidden ? openSearch() : closeSearch();
    }
  });
})();
