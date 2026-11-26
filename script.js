(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SV = window.SV || { doctors: [], services: [], prices: {}, priceOrder: [] };
  const params = new URLSearchParams(location.search);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2800);
  };
  // посилання на розділи, яких ще немає в макеті
  $$('[data-soon]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); toast(a.dataset.soon); }));

  /* ---------- language switcher ---------- */
  const lang = $('.lang');
  if (lang) {
    const langBtn = $('.lang__btn', lang);
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langBtn.setAttribute('aria-expanded', lang.classList.toggle('is-open'));
    });
    $$('.lang__item', lang).forEach((item) => item.addEventListener('click', () => {
      $$('.lang__item', lang).forEach((i) => i.classList.toggle('is-active', i === item));
      $('.lang__cur', lang).textContent = item.dataset.lang;
      lang.classList.remove('is-open');
      if (item.dataset.lang !== 'UA') toast('Російська версія сайту з’явиться згодом');
    }));
    document.addEventListener('click', () => lang.classList.remove('is-open'));
  }

  /* ---------- mobile menu + services dropdown ---------- */
  const header = $('.header');
  const burger = $('.burger');
  if (header && burger) {
    burger.addEventListener('click', () => burger.setAttribute('aria-expanded', header.classList.toggle('is-menu')));
    $$('.nav a').forEach((a) => a.addEventListener('click', () => header.classList.remove('is-menu')));
  }

  /* ---------- тінь під меню, коли верхня смужка сховалась ---------- */
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- copy address ---------- */
  $$('#copyAddr').forEach((b) => b.addEventListener('click', async () => {
    const addr = 'вул. Водопровідна 2/5, Одеса';
    try { await navigator.clipboard.writeText(addr); toast('Адресу скопійовано'); } catch { toast(addr); }
  }));

  /* ---------- lead forms (блок «Записатися на прийом») ---------- */
  $$('.js-spec-select').forEach((sel) => {
    const dirs = SV.services.map((s) => `<option value="${esc(s.dir)}">${esc(s.dir)}</option>`).join('');
    const docs = SV.doctors.map((d) => `<option value="${esc(d.name)}">${esc(d.name)} — ${esc(d.spec.toLowerCase())}</option>`).join('');
    sel.insertAdjacentHTML('beforeend', `<optgroup label="Напрями">${dirs}</optgroup><optgroup label="Лікарі">${docs}</optgroup>`);
  });
  $$('.js-lead').forEach((form) => {
    const msg = $('.form__msg', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const setErr = (el, bad) => { el.classList.toggle('is-error', bad); if (bad) ok = false; };
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      setErr(form.name.closest('.field'), name.length < 2);
      setErr(form.phone.closest('.field'), form.phone.value.replace(/\D/g, '').length < 9);
      setErr(form.email.closest('.field'), !!email && !/^\S+@\S+\.\S+$/.test(email));
      setErr(form.agree.closest('.agree'), !form.agree.checked);
      if (!ok) { msg.style.color = '#c0392b'; msg.textContent = 'Будь ласка, перевірте виділені поля.'; return; }
      msg.style.color = '';
      msg.textContent = `Дякуємо, ${name}! Ми зателефонуємо вам найближчим часом для підтвердження запису.`;
      form.reset();
    });
    form.addEventListener('input', (e) => e.target.closest('.field, .agree')?.classList.remove('is-error'));
  });

  /* ---------- HOME: price tabs ---------- */
  const HOME_PRICES = {
    gynecology: { name: 'Гінекологія', count: 16, label: '16 послуг', rows: [
      ['Первинний прийом лікаря-гінеколога', 'Огляд, вартість оглядового набору включено', '1 000 ₴'],
      ['Повторний прийом лікаря-гінеколога', '', '800 ₴'],
      ['Кольпоскопія', '', '700 ₴'],
      ['Видалення аногенітальних новоутворень, 1 елемент', 'Радіохірургічний метод, з анестезією', '1 000 ₴'],
      ['Видалення аногенітальних новоутворень, 2–5 елементів', 'Радіохірургічний метод, ціна за одиницю', '550 ₴']] },
    proctology: { name: 'Проктологія', count: 27, label: '27 послуг', rows: [
      ['Прийом лікаря', 'Збір анамнезу, пальцевий огляд, аноскопія, ректороманоскопія', '1 000 ₴'],
      ['Безопераційне лікування геморою 2 стадії (1 вузол)', 'Латексне лігування', 'від 5 500 ₴'],
      ['Оперативне лікування геморою 2 стадії з одним комбінованим вузлом', '', 'від 16 000 ₴'],
      ['Видалення зовнішнього геморою (всі вузли)', '', 'від 19 400 ₴'],
      ['Лазерне видалення гемороїдальних вузлів (1 вузол)', '', 'від 9 800 ₴']] },
    usg: { name: 'УЗД-діагностика', count: 31, label: '31 послуга', rows: [
      ['УЗД органів черевної порожнини', 'Печінка, жовчний міхур, підшлункова залоза, селезінка', '950 ₴'],
      ['УЗД нирок і сечового міхура', '', '950 ₴'],
      ['УЗД щитоподібної залози', '', '750 ₴'],
      ['УЗД малого тазу', 'Трансабдомінальне, трансвагінальне', '800 ₴'],
      ['УЗД органів калитки', '', '750 ₴']] },
    stomatology: { name: 'Стоматологія', count: 28, label: '28 послуг', rows: [
      ['Консультація', '', 'Безкоштовно'],
      ['Лікування поверхневого та середнього карієсу', '', 'від 900 ₴'],
      ['Лікування глибокого карієсу', '', 'від 1 100 ₴'],
      ['Реставрація (нарощування зуба)', '', 'від 1 500 ₴'],
      ['Лікування кореневих каналів', '', 'від 700 ₴']] },
    dermatology: { name: 'Дерматологія', count: 25, label: '25 послуг', rows: [
      ['Первинний прийом лікаря-дерматолога/трихолога', 'З дерматоскопією/трихоскопією', '1 000 ₴'],
      ['Первинний прийом провідного лікаря-дерматолога/трихолога', 'З дерматоскопією/трихоскопією', '1 400 ₴'],
      ['Повторний прийом провідного дерматолога/трихолога', '', '1 100 ₴'],
      ['Повторний прийом лікаря-дерматолога/трихолога', 'З дерматоскопією/трихоскопією', '800 ₴'],
      ['Курс лікування псоріазу', '', '19 000 ₴']] },
  };
  const tabsEl = $('#priceTabs');
  const listEl = $('#priceList');
  if (tabsEl && listEl) {
    tabsEl.innerHTML = Object.entries(HOME_PRICES).map(([key, p], i) =>
      `<button class="tab" role="tab" type="button" data-key="${key}" aria-selected="${i === 0}">${p.name}<i>${p.count}</i></button>`).join('');
    const eyebrow = $('#helpEyebrow');
    const helpBook = $('#helpBook');
    const fullLink = $('.prices .link-bold');
    const render = (key) => {
      const p = HOME_PRICES[key];
      $$('.tab', tabsEl).forEach((t) => t.setAttribute('aria-selected', t.dataset.key === key));
      if (eyebrow) eyebrow.textContent = p.name.toUpperCase();
      if (helpBook) helpBook.href = `booking.html?service=${key}`;
      if (fullLink) fullLink.href = `prices.html?dir=${key}`;
      listEl.innerHTML = `<div class="pricelist__title"><h3>${p.name}</h3><span>${p.label}</span></div>` +
        p.rows.map(([t, s, v], i) => `<div class="prow" style="animation-delay:${i * 40}ms"><div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div><strong>${v}</strong></div>`).join('');
    };
    tabsEl.addEventListener('click', (e) => { const t = e.target.closest('.tab'); if (t) render(t.dataset.key); });
    render('gynecology');
  }

  /* ---------- HOME: doctors slider arrow ---------- */
  const track = $('.doctors__track');
  const nextBtn = $('.doctors__next');
  if (track && nextBtn) {
    nextBtn.addEventListener('click', () => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) { location.href = 'doctors.html'; return; }
      track.scrollBy({ left: track.clientWidth / 3, behavior: 'smooth' });
    });
  }

  /* ---------- HOME: reviews expand ---------- */
  const moreBtn = $('.reviews__more');
  if (moreBtn) {
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
  }

  /* ---------- PRICES page ---------- */
  const dirList = $('#dirList');
  const priceTable = $('#priceTable');
  if (dirList && priceTable) {
    const order = SV.priceOrder;
    dirList.innerHTML = order.map((k) => `<a href="prices.html?dir=${k}" data-dir="${k}">${SV.prices[k].name}</a>`).join('');
    const bookBtn = $('#priceBook');
    const show = (key, push) => {
      if (!SV.prices[key]) key = 'gynecology';
      const p = SV.prices[key];
      $$('a', dirList).forEach((a) => a.classList.toggle('is-active', a.dataset.dir === key));
      priceTable.innerHTML =
        `<div class="ptable__head"><h2>${p.name}</h2><span class="ptable__count">${p.count}</span></div>` +
        `<div class="ptable__cols"><span>Назва послуги</span><span>Вартість</span></div>` +
        p.rows.map(([t, v], i) => `<div class="ptable__row" style="animation-delay:${Math.min(i, 12) * 25}ms"><span>${t}</span><b>${v}</b></div>`).join('') +
        `<p class="ptable__note">Ціни вказано у гривнях. Для послуг із позначкою «від» та діапазоном вартість уточнюється залежно від обсягу процедури.</p>`;
      if (bookBtn) bookBtn.href = SV.services.some((s) => s.id === key) ? `booking.html?service=${key}` : 'booking.html';
      if (push) history.pushState({ dir: key }, '', `prices.html?dir=${key}`);
      document.title = `Ціни: ${p.name} — Sana Vita`;
    };
    dirList.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-dir]');
      if (!a) return;
      e.preventDefault();
      show(a.dataset.dir, true);
      if (innerWidth < 960) priceTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    addEventListener('popstate', () => show(new URLSearchParams(location.search).get('dir'), false));
    show(params.get('dir') || 'gynecology', false);
  }

  /* ---------- BOOKING (3 кроки) ---------- */
  const bookForm = $('#bookForm');
  if (bookForm) {
    const sSel = $('#bService'), dSel = $('#bDoctor'), dateIn = $('#bDate'), tSel = $('#bTime');
    const stepper = $$('#stepper li');
    sSel.innerHTML = SV.services.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    const times = [];
    for (let h = 8; h < 22; h++) ['00', '30'].forEach((m) => times.push(`${String(h).padStart(2, '0')}:${m}`));
    tSel.innerHTML = times.map((t) => `<option${t === '10:00' ? ' selected' : ''}>${t}</option>`).join('');

    const pad = (n) => String(n).padStart(2, '0');
    const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    dateIn.min = iso(new Date());
    dateIn.value = iso(tomorrow);

    const fillDoctors = (serviceId, keep) => {
      const list = SV.doctors.filter((d) => d.tags.includes(serviceId));
      const opts = (list.length ? list : SV.doctors);
      dSel.innerHTML = `<option value="">Будь-який вільний лікар</option>` +
        opts.map((d) => `<option value="${d.id}">${esc(d.full)}</option>`).join('');
      if (keep && opts.some((d) => d.id === keep)) dSel.value = keep;
      else if (list.length === 1) dSel.value = list[0].id;
    };

    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    const summary = () => {
      const s = SV.services.find((x) => x.id === sSel.value);
      const d = SV.doctors.find((x) => x.id === dSel.value);
      $('#sService').textContent = s ? s.name : '—';
      $('#sPrice').textContent = s && s.price ? s.price : 'уточнить адміністратор';
      $('#sPrice').classList.toggle('is-muted', !(s && s.price));
      $('#sDoc').textContent = d ? d.full : 'Будь-який вільний лікар';
      $('#sSpec').textContent = d ? d.spec : (s ? s.dir : '');
      const [y, m, dd] = (dateIn.value || '').split('-').map(Number);
      $('#sWhen').textContent = y ? `${dd} ${months[m - 1]} ${y}, ${tSel.value}` : '—';
    };

    // попередній вибір з посилання: ?service=urology&doctor=bondarevych
    const preDoc = SV.doctors.find((d) => d.id === params.get('doctor'));
    let preService = params.get('service');
    if (!SV.services.some((s) => s.id === preService)) preService = preDoc ? preDoc.tags[0] : 'urology';
    sSel.value = preService;
    fillDoctors(preService, preDoc && preDoc.id);
    summary();
    sSel.addEventListener('change', () => { fillDoctors(sSel.value, dSel.value); summary(); });
    [dSel, dateIn, tSel].forEach((el) => el.addEventListener('change', summary));

    const err = $('#bErr');
    const go = (n) => {
      $$('.bstep', bookForm).forEach((s) => s.classList.toggle('is-active', +s.dataset.step === n));
      stepper.forEach((li, i) => {
        li.classList.toggle('is-done', i + 1 < n || n === 3 && i < 2);
        li.classList.toggle('is-current', i + 1 === n);
      });
      if (n === 3) stepper[2].classList.add('is-current');
      $('.book__head').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    $$('[data-next]', bookForm).forEach((b) => b.addEventListener('click', () => {
      const to = +b.dataset.next;
      const cur = +b.closest('.bstep').dataset.step;
      if (to > cur && cur === 1 && !dateIn.value) { dateIn.closest('.bfield').classList.add('is-error'); return; }
      if (to > cur && cur === 2) {
        let ok = true;
        const mark = (el, bad) => { el.classList.toggle('is-error', bad); if (bad) ok = false; };
        mark(bookForm.name.closest('.bfield'), bookForm.name.value.trim().length < 2);
        mark(bookForm.phone.closest('.bfield'), bookForm.phone.value.replace(/\D/g, '').length < 9);
        const em = bookForm.email.value.trim();
        mark(bookForm.email.closest('.bfield'), !!em && !/^\S+@\S+\.\S+$/.test(em));
        mark(bookForm.agree.closest('.agree'), !bookForm.agree.checked);
        if (!ok) { err.textContent = 'Будь ласка, заповніть обов’язкові поля та погодьтеся з обробкою даних.'; return; }
        err.textContent = '';
        $('#bThanks').textContent = `Дякуємо за довіру, ${bookForm.name.value.trim()}! Адміністратор зв’яжеться з вами, щоб узгодити дату й час прийому.`;
      }
      go(to);
    }));
    bookForm.addEventListener('input', (e) => e.target.closest('.bfield, .agree')?.classList.remove('is-error'));
    bookForm.addEventListener('submit', (e) => e.preventDefault());
    // «Назад» на першому кроці: повертає туди, звідки прийшли (або на головну)
    $('#bBack1').addEventListener('click', (e) => {
      e.preventDefault();
      if (document.referrer && new URL(document.referrer).origin === location.origin) history.back();
      else location.href = 'index.html';
    });
  }

  /* ---------- hover-підсвітка списків (сторінка лікарів / картка лікаря) ---------- */
  ['#bestList', '#visitSteps'].forEach((sel) => {
    const list = $(sel);
    if (!list) return;
    $$('li', list).forEach((li) => li.addEventListener('mouseenter', () => {
      $$('li', list).forEach((x) => x.classList.toggle('is-active', x === li));
    }));
  });

  /* ---------- doctors page: підсвітити лікаря з #якоря ---------- */
  if (location.hash && $('.doc-grid')) {
    const card = $(location.hash);
    if (card) card.classList.add('is-target');
  }

  /* ---------- reveal + counters ---------- */
  const fmt = (n, el) => {
    if (el.dataset.format === 'dot') return Math.round(n).toLocaleString('de-DE');
    const dec = +(el.dataset.decimals || 0);
    return n.toFixed(dec) + (el.dataset.suffix || '');
  };
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / 1400);
      el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)), el);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = $$('.care, .svc, .doc, .stat, .rev, .reviews__photo, .post, .pricelist, .help, .card, .form, .svc-card, .feat, .dcard, .trust__item, .hcard, .why3__card, .equip__card, .when__card, .pay__card, .pr-doc, .dstats__in > div, .timeline li, .cline, .loc-card');
  if ('IntersectionObserver' in window && !reduce) {
    targets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        const c = en.target.matches('[data-count]') ? en.target : en.target.querySelector('[data-count]');
        if (c) countUp(c);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    targets.forEach((el) => io.observe(el));
  }
})();
