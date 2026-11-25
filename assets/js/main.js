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
})();
