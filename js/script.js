/* =========================================================
   PULSAR — клиентский JavaScript
   Меню, шапка при скролле, появление блоков, демо-форма
   ========================================================= */

(function () {
  'use strict';

  var header = document.getElementById('header');
  var burger = document.getElementById('nav-burger');
  var menu = document.getElementById('nav-menu');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Мобильное меню ---------- */

  function closeMenu() {
    if (!header || !burger) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    header.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
      header.classList.toggle('menu-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Состояние шапки при скролле ---------- */

  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Плавное появление секций ---------- */

  var revealItems = document.querySelectorAll('[data-reveal]');

  function showAll() {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Демо-отправка формы (без сервера) ---------- */

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = 'Спасибо! Заявка принята — мы свяжемся с вами в ближайшее время.';
      status.hidden = false;
      form.reset();
      setTimeout(function () { status.hidden = true; }, 8000);
    });
  }
})();