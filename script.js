(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2600);
  };

  /* ---------- language switcher ---------- */
  const lang = $('.lang');
  const langBtn = $('.lang__btn');
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = lang.classList.toggle('is-open');
    langBtn.setAttribute('aria-expanded', open);
  });
  $$('.lang__item').forEach((item) => item.addEventListener('click', () => {
    $$('.lang__item').forEach((i) => i.classList.toggle('is-active', i === item));
    $('.lang__cur').textContent = item.dataset.lang;
    lang.classList.remove('is-open');
    if (item.dataset.lang !== 'UA') toast('Російська версія сайту з’явиться згодом');
  }));
  document.addEventListener('click', () => lang.classList.remove('is-open'));

  /* ---------- mobile menu ---------- */
  const header = $('.header');
  const burger = $('.burger');
  burger.addEventListener('click', () => {
    const open = header.classList.toggle('is-menu');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav a').forEach((a) => a.addEventListener('click', () => {
    header.classList.remove('is-menu');
    burger.setAttribute('aria-expanded', false);
  }));

  /* ---------- prices ---------- */
  const PRICES = {
    gynecology: {
      name: 'Гінекологія', count: 16, label: '16 послуг',
      rows: [
        ['Первинний прийом лікаря-гінеколога', 'Огляд, вартість оглядового набору включено', '1 000 ₴'],
        ['Повторний прийом лікаря-гінеколога', '', '800 ₴'],
        ['Кольпоскопія', '', '700 ₴'],
        ['Видалення аногенітальних новоутворень, 1 елемент', 'Радіохірургічний метод, з анестезією', '1 000 ₴'],
        ['Видалення аногенітальних новоутворень, 2–5 елементів', 'Радіохірургічний метод, ціна за одиницю', '550 ₴'],
      ],
    },
    proctology: {
      name: 'Проктологія', count: 27, label: '27 послуг',
      rows: [
        ['Прийом лікаря', 'Збір анамнезу, пальцевий огляд, аноскопія, ректороманоскопія', '1 000 ₴'],
        ['Безопераційне лікування геморою 2 стадії (1 вузол)', 'Латексне лігування', 'від 5 500 ₴'],
        ['Оперативне лікування геморою 2 стадії з одним комбінованим вузлом', '', 'від 16 000 ₴'],
        ['Видалення зовнішнього геморою (всі вузли)', '', 'від 19 400 ₴'],
        ['Лазерне видалення гемороїдальних вузлів (1 вузол)', '', 'від 9 800 ₴'],
      ],
    },
    usg: {
      name: 'УЗД-діагностика', count: 31, label: '31 послуга',
      rows: [
        ['УЗД органів черевної порожнини', 'Печінка, жовчний міхур, підшлункова залоза, селезінка', '950 ₴'],
        ['УЗД нирок і сечового міхура', '', '950 ₴'],
        ['УЗД щитоподібної залози', '', '750 ₴'],
        ['УЗД малого тазу', 'Трансабдомінальне, трансвагінальне', '800 ₴'],
        ['УЗД органів калитки', '', '750 ₴'],
      ],
    },
    stomatology: {
      name: 'Стоматологія', count: 28, label: '28 послуг',
      rows: [
        ['Консультація', '', 'Безкоштовно'],
        ['Лікування поверхневого та середнього карієсу', '', 'від 900 ₴'],
        ['Лікування глибокого карієсу', '', 'від 1 100 ₴'],
        ['Реставрація (нарощування зуба)', '', 'від 1 500 ₴'],
        ['Лікування кореневих каналів', '', 'від 700 ₴'],
      ],
    },
    dermatology: {
      name: 'Дерматологія', count: 25, label: '25 послуг',
      rows: [
        ['Первинний прийом лікаря-дерматолога/трихолога', 'З дерматоскопією/трихоскопією', '1 000 ₴'],
        ['Первинний прийом провідного лікаря-дерматолога/трихолога', 'З дерматоскопією/трихоскопією', '1 400 ₴'],
        ['Повторний прийом провідного дерматолога/трихолога', '', '1 100 ₴'],
        ['Повторний прийом лікаря-дерматолога/трихолога', 'З дерматоскопією/трихоскопією', '800 ₴'],
        ['Курс лікування псоріазу', '', '19 000 ₴'],
      ],
    },
  };

  const tabsEl = $('#priceTabs');
  const listEl = $('#priceList');
  const eyebrow = $('#helpEyebrow');

  tabsEl.innerHTML = Object.entries(PRICES).map(([key, p], i) =>
    `<button class="tab" role="tab" type="button" data-key="${key}" aria-selected="${i === 0}">${p.name}<i>${p.count}</i></button>`
  ).join('');

  const renderPrices = (key) => {
    const p = PRICES[key];
    $$('.tab', tabsEl).forEach((t) => t.setAttribute('aria-selected', t.dataset.key === key));
    eyebrow.textContent = p.name.toUpperCase();
    listEl.innerHTML =
      `<div class="pricelist__title"><h3>${p.name}</h3><span>${p.label}</span></div>` +
      p.rows.map(([t, s, v], i) =>
        `<div class="prow" style="animation-delay:${i * 40}ms"><div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div><strong>${v}</strong></div>`
      ).join('');
  };
  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (tab) renderPrices(tab.dataset.key);
  });
  renderPrices('gynecology');

  // service circles open their price tab
  $$('.svc[data-tab]').forEach((s) => s.addEventListener('click', () => renderPrices(s.dataset.tab)));

  /* ---------- doctors slider arrow ---------- */
  const track = $('.doctors__track');
  $('.doctors__next').addEventListener('click', () => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (atEnd) toast('Повний список лікарів — у розділі «Спеціалісти»');
    track.scrollBy({ left: track.clientWidth / 3, behavior: 'smooth' });
  });

  /* ---------- reviews expand ---------- */
  const moreBtn = $('.reviews__more');
  moreBtn.addEventListener('click', () => {
    const hidden = $$('.rev.is-hidden');
    if (hidden.length) {
      hidden.forEach((r) => { r.classList.remove('is-hidden'); r.dataset.extra = '1'; });
      moreBtn.classList.add('is-open');
    } else {
      $$('.rev[data-extra]').forEach((r) => r.classList.add('is-hidden'));
      moreBtn.classList.remove('is-open');
    }
  });

  /* ---------- copy address ---------- */
  $('#copyAddr').addEventListener('click', async () => {
    const addr = 'вул. Водопровідна 2/5, Одеса';
    try { await navigator.clipboard.writeText(addr); toast('Адресу скопійовано'); }
    catch { toast(addr); }
  });

  /* ---------- form ---------- */
  const form = $('#form');
  const msg = $('#formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/[^\d+]/g, '');
    const email = form.email.value.trim();
    const setErr = (el, bad) => { el.classList.toggle('is-error', bad); if (bad) ok = false; };
    setErr(form.name.closest('.field'), name.length < 2);
    setErr(form.phone.closest('.field'), phone.replace('+', '').length < 9);
    setErr(form.email.closest('.field'), !!email && !/^\S+@\S+\.\S+$/.test(email));
    setErr(form.agree.closest('.agree'), !form.agree.checked);
    if (!ok) { msg.style.color = '#c0392b'; msg.textContent = 'Будь ласка, перевірте виділені поля.'; return; }
    msg.style.color = '';
    msg.textContent = `Дякуємо, ${name}! Ми зателефонуємо вам найближчим часом для підтвердження запису.`;
    form.reset();
  });
  form.addEventListener('input', (e) => {
    e.target.closest('.field, .agree')?.classList.remove('is-error');
  });

  /* ---------- reveal + counters ---------- */
  const fmt = (n, el) => {
    if (el.dataset.format === 'dot') return n.toLocaleString('de-DE');
    return n + (el.dataset.suffix || '');
  };
  const countUp = (el) => {
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - start) / dur);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - k, 3))), el);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = $$('.care, .svc, .doc, .stat, .rev, .reviews__photo, .post, .pricelist, .help, .card, .form');
  if ('IntersectionObserver' in window && !reduce) {
    targets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        const c = en.target.querySelector('[data-count]');
        if (c) countUp(c);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => io.observe(el));
  }
})();
