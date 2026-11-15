/* El Refugio de Chilla — interacción
   Sin dependencias. Mejora progresiva: la página funciona sin JS. */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TZ = 'Europe/Madrid';

  /** Turnos del restaurante en minutos desde medianoche (todos los días). */
  const SERVICES = [
    { label: 'comidas', from: 13 * 60, to: 16 * 60 },
    { label: 'cenas', from: 20 * 60, to: 23 * 60 + 30 },
  ];

  /** Fecha y hora actuales en Madrid, independientemente del huso del visitante. */
  function madridNow() {
    const parts = new Intl.DateTimeFormat('es-ES', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    return {
      iso: `${get('year')}-${get('month')}-${get('day')}`,
      minutes: Number(get('hour')) * 60 + Number(get('minute')),
    };
  }

  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  /* ---------- Año del pie ---------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Tema claro / oscuro ---------- */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  const syncThemeLabel = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn?.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  };
  syncThemeLabel();
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('refugio-theme', next); } catch (_) { /* almacenamiento no disponible */ }
    syncThemeLabel();
  });

  /* ---------- Navegación: estado al hacer scroll ---------- */
  const nav = $('#nav');
  const onScroll = () => nav?.setAttribute('data-scrolled', String(window.scrollY > 8));
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const toggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileMenu.hidden = !open;
    nav.setAttribute('data-open', String(open));
  };
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Estado abierto / cerrado ---------- */
  const status = $('#openStatus');
  function updateStatus() {
    if (!status) return;
    const { minutes } = madridNow();
    const text = $('.status__text', status);
    const current = SERVICES.find((s) => minutes >= s.from && minutes < s.to);
    if (current) {
      status.dataset.state = 'open';
      text.textContent = `Abierto · cierra a las ${fmt(current.to)}`;
    } else {
      const next = SERVICES.find((s) => minutes < s.from) || SERVICES[0];
      const tomorrow = minutes >= SERVICES[SERVICES.length - 1].to;
      status.dataset.state = 'closed';
      text.textContent = `Cerrado · abre ${tomorrow ? 'mañana ' : ''}a las ${fmt(next.from)}`;
    }
  }
  updateStatus();
  setInterval(updateStatus, 60_000);

  /* ---------- Imágenes con skeleton ---------- */
  $$('.media img').forEach((img) => {
    const wrap = img.closest('.media');
    const done = () => wrap.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) done();
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });

  /* ---------- Mapa con skeleton ---------- */
  const map = $('.map');
  const mapFrame = map && $('iframe', map);
  mapFrame?.addEventListener('load', () => map.classList.add('is-loaded'), { once: true });

  /* ---------- Aparición escalonada al hacer scroll ---------- */
  const reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    // Escalonado sutil entre hermanos
    reveals.forEach((el) => {
      const siblings = $$(':scope > .reveal', el.parentElement);
      el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 5) * 60}ms`);
      io.observe(el);
    });
  }

  /* ---------- Scrollspy (navegación principal e índice de la carta) ---------- */
  function spy(links, attr, rootMargin) {
    if (!('IntersectionObserver' in window) || !links.length) return;
    const map = new Map(links.map((a) => [a.dataset[attr], a]));
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      const firstId = [...map.keys()].find((id) => visible.has(id));
      links.forEach((a) => a.removeAttribute('aria-current'));
      if (firstId) map.get(firstId).setAttribute('aria-current', 'true');
    }, { rootMargin });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }
  spy($$('.nav__links a[data-spy]'), 'spy', '-45% 0px -50% 0px');
  spy($$('.menu__index a[data-cat]'), 'cat', '-30% 0px -60% 0px');

  // Mantiene visible la categoría activa en la barra horizontal (móvil)
  const menuIndex = $('.menu__index');
  if (menuIndex && 'MutationObserver' in window) {
    new MutationObserver(() => {
      const active = $('[aria-current="true"]', menuIndex);
      if (active && menuIndex.scrollWidth > menuIndex.clientWidth) {
        menuIndex.scrollTo({ left: active.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }).observe(menuIndex, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  }

  /* ---------- Formulario de reservas ---------- */
  const form = $('#bookingForm');
  if (!form) return;

  const dateInput = $('#f-fecha');
  const timeSelect = $('#f-hora');
  const submitBtn = $('#submitBtn');
  const alertBox = $('#formAlert');
  const success = $('#formSuccess');
  const groupHint = $('#groupHint');
  const charCount = $('#charCount');
  const comments = $('#f-comentarios');

  // No se puede reservar en el pasado
  const today = madridNow().iso;
  dateInput.min = today;

  // Si la fecha es hoy, desactiva las horas ya pasadas
  function syncTimeSlots() {
    const isToday = dateInput.value === today;
    const { minutes } = madridNow();
    $$('option', timeSelect).forEach((opt) => {
      if (!opt.value) return;
      const [h, m] = opt.value.split(':').map(Number);
      opt.disabled = isToday && h * 60 + m <= minutes + 30;
    });
    if (timeSelect.selectedOptions[0]?.disabled) timeSelect.value = '';
  }
  dateInput.addEventListener('change', syncTimeSlots);

  $$('input[name="personas"]', form).forEach((r) =>
    r.addEventListener('change', () => { groupHint.hidden = r.value !== '7+' || !r.checked; })
  );

  comments?.addEventListener('input', () => { charCount.textContent = String(comments.value.length); });

  const MESSAGES = {
    nombre: { valueMissing: 'Indica tu nombre para la reserva.' },
    telefono: {
      valueMissing: 'Necesitamos un teléfono para confirmar la mesa.',
      patternMismatch: 'Revisa el teléfono: debe tener al menos 9 dígitos.',
    },
    email: {
      valueMissing: 'Indica tu correo electrónico.',
      typeMismatch: 'Ese correo no parece válido. Ej.: nombre@correo.com',
    },
    fecha: {
      valueMissing: 'Elige el día de tu visita.',
      rangeUnderflow: 'La fecha no puede ser anterior a hoy.',
    },
    hora: { valueMissing: 'Elige una hora.' },
  };

  function validateField(input) {
    const field = input.closest('.field');
    const err = field && $('.error', field);
    if (!field || !err) return true;
    let msg = '';
    if (!input.validity.valid) {
      const dict = MESSAGES[input.name] || {};
      const key = Object.keys(dict).find((k) => input.validity[k]);
      msg = key ? dict[key] : 'Revisa este campo.';
    }
    err.textContent = msg;
    field.dataset.invalid = String(Boolean(msg));
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  }

  const validated = $$('.input[required]', form);
  validated.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) validateField(input); });
    input.addEventListener('input', () => { if (input.closest('.field').dataset.invalid === 'true') validateField(input); });
  });

  const setBusy = (busy) => {
    submitBtn.setAttribute('aria-busy', String(busy));
    $('.btn__label', submitBtn).textContent = busy ? 'Enviando…' : 'Solicitar reserva';
  };

  const formatDate = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(y, m - 1, d)));
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.hidden = true;

    const results = validated.map(validateField);
    if (results.includes(false)) {
      validated[results.indexOf(false)].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    if (data._honey) return; // bot

    setBusy(true);
    try {
      const res = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === 'false' || json.success === false) throw new Error(json.message || 'Error');

      $('#successText').textContent =
        `Mesa para ${data.personas} el ${formatDate(data.fecha)} a las ${data.hora}. ` +
        'Te confirmaremos la reserva en breve por teléfono o correo.';
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (_) {
      alertBox.innerHTML =
        'No hemos podido enviar la solicitud. Inténtalo de nuevo o llámanos al ' +
        '<a href="tel:+34920380635">920 380 635</a>.';
      alertBox.hidden = false;
    } finally {
      setBusy(false);
    }
  });

  $('#newBooking')?.addEventListener('click', () => {
    form.reset();
    groupHint.hidden = true;
    charCount.textContent = '0';
    $$('.field', form).forEach((f) => { f.dataset.invalid = 'false'; });
    success.hidden = true;
    form.hidden = false;
    $('#f-fecha').focus();
  });
})();
