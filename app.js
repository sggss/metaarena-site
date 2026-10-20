(function () {
  'use strict';

  // Данные из группы ВКонтакте vk.ru/metapnz (прайс, «Наше железо», «Ранговая система»)
  var PC = [
    { id: 'normal', name: 'Normal', lead: 'Основной зал',
      p: { 1: 150, 3: 400, 5: 600, morning: 350, night: 800 },
      spec: [['Мониторы', 'DELL 24.5″ 240 Гц'], ['Видеокарты', 'RTX 5060 Ti 16GB / RTX 3070'], ['Процессоры', 'Ryzen 5 7500F / Intel i7 10700KF'],
        ['RAM', '32GB / 16GB'], ['Клавиатуры', 'Dark Project Arena KD1'], ['Мыши', 'Logitech G102 Lightsync'], ['Наушники', 'HyperX Cloud II'], ['Кресла', 'DXRacer OH/RV131/NE']] },
    { id: 'vip', name: 'VIP', lead: 'Больше экран, выше частота',
      p: { 1: 200, 3: 550, 5: 850, morning: 550, night: 1050 },
      spec: [['Мониторы', 'ASUS 27″ 280 Гц'], ['Видеокарты', 'RTX 5060 Ti 16GB'], ['Процессоры', 'Ryzen 5 7500F'], ['RAM', '32GB'],
        ['Клавиатуры', 'Dark Project KD87A Black'], ['Мыши', 'Logitech G403 Hero / HyperX Pulsefire Haste 2'], ['Наушники', 'HyperX Cloud II'], ['Кресла', 'DXRacer OH/RV131/NE']] },
    { id: 'bootcamp', name: 'Bootcamp', lead: 'Топовое железо для команды', top: true,
      p: { 1: 250, 3: 650, 5: 1100, morning: 800, night: 1200 },
      spec: [['Мониторы', 'ASUS 24.5″ 280 Гц'], ['Видеокарты', 'RTX 4070 SUPER'], ['Процессоры', 'Ryzen 7 7700'], ['RAM', '32GB'],
        ['Клавиатуры', 'Dark Project KD83A'], ['Мыши', 'Lunacy One White'], ['Наушники', 'HyperX Cloud II S'], ['Кресла', 'Zone51 Imperial']] }
  ];
  var TV = [
    { id: 'tv', name: 'Аренда TV', p: { 1: 350, 3: 800, 5: 1300 } },
    { id: 'tvvip', name: 'Аренда TV VIP', p: { 1: 700, 3: 1800, 5: 2800 } },
    { id: 'tvvipp', name: 'Аренда TV VIP+', p: { 1: 900, 3: 2300, 5: 3500 } }
  ];
  var PACKS = [
    { k: 1, name: 'Кибер час', t: '1 час', h: 1 },
    { k: 3, name: 'Трипл килл', t: '3 часа', h: 3 },
    { k: 5, name: 'Ультра килл', t: '5 часов', h: 5 },
    { k: 'morning', name: 'Кибер утро', t: '08:00 – 14:00', h: 6, badge: 'УТРО' },
    { k: 'night', name: 'Кибер ночь', t: '00:00 – 08:00', h: 8, badge: 'НОЧЬ' }
  ];
  var RANKS = [
    ['Новичок', 0, 1, 25], ['Любитель', 20, 2, 25], ['Ученик', 50, 3, 25], ['Опытный', 90, 4, 25], ['Профессионал', 150, 5, 30],
    ['Мастер', 260, 6, 30], ['Гранд-мастер', 360, 10, 35], ['Неуязвимый', 570, 13, 35], ['Кибертитан', 830, 14, 40],
    ['Чемпион ESPORTS', 1090, 15, 40], ['Легенда MAJOR', 1250, 16, 40], ['Звезда ESL', 1500, 17, 50],
    ['Победитель International', 1600, 18, 50], ['Бог киберспорта', 1800, 19, 50], ['True Gamer', 2050, 20, 50]
  ];

  var $ = function (id) { return document.getElementById(id); };
  var rub = function (n) { return n.toLocaleString('ru-RU') + ' ₽'; };
  var price = function (n) { return n.toLocaleString('ru-RU') + '<small>₽</small>'; };
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  // Прайс
  var seg = $('zoneSeg'), current = 'normal';
  seg.innerHTML = PC.map(function (z) {
    return '<button type="button" data-zone="' + z.id + '" aria-pressed="' + (z.id === current) + '">' + z.name + '</button>';
  }).join('');

  function renderTariffs() {
    var z = PC.filter(function (x) { return x.id === current; })[0];
    $('tariffs').innerHTML = PACKS.map(function (pk) {
      var v = z.p[pk.k], per = Math.round(v / pk.h);
      return '<div class="tariff cut' + (pk.badge ? ' tariff--time" data-badge="' + pk.badge : '') + '">' +
        '<span class="tariff__n">' + pk.name + '</span><span class="tariff__t">' + pk.t + (pk.badge ? ' · ' + pk.h + ' ч' : '') + '</span>' +
        '<span class="tariff__p">' + price(v) + '</span>' +
        '<span class="tariff__h">' + (pk.h > 1 ? '≈ ' + rub(per) + ' / час' : 'за час игры') + '</span></div>';
    }).join('');
  }
  seg.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    current = b.dataset.zone;
    each(seg.children, function (x) { x.setAttribute('aria-pressed', x === b); });
    renderTariffs();
  });
  renderTariffs();

  $('compareTable').insertAdjacentHTML('beforeend',
    '<thead><tr><th scope="col">Тариф</th><th scope="col">Время</th>' + PC.map(function (z) { return '<th scope="col" class="num">' + z.name + '</th>'; }).join('') + '</tr></thead><tbody>' +
    PACKS.map(function (pk) {
      return '<tr><td>' + pk.name + '</td><td>' + pk.t + (pk.badge ? ' (' + pk.h + ' ч)' : '') + '</td>' +
        PC.map(function (z) { return '<td class="num">' + rub(z.p[pk.k]) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody>');

  // Железо
  $('rigs').innerHTML = PC.map(function (z) {
    return '<article class="rig cut' + (z.top ? ' rig--top' : '') + '"><div class="rig__head"><h3>' + z.name + '</h3>' +
      '<span class="rig__from">от <b>' + rub(z.p[1]) + '</b>/ч</span></div><p class="rig__lead">' + z.lead + '</p><dl>' +
      z.spec.map(function (s) { return '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>'; }).join('') + '</dl></article>';
  }).join('');

  // PS5 / TV
  $('tv').innerHTML = TV.map(function (t) {
    var parts = t.name.split('TV');
    return '<article class="tvc cut"><h3>' + parts[0] + '<span>TV' + parts[1] + '</span></h3><ul>' +
      PACKS.slice(0, 3).map(function (pk) { return '<li><span>' + pk.name + ' · ' + pk.t + '</span><b>' + rub(t.p[pk.k]) + '</b></li>'; }).join('') +
      '</ul></article>';
  }).join('');

  // Калькулятор: минимальная стоимость набора пакетов 1/3/5 ч, покрывающих нужное время
  var cZone = $('cZone'), cHours = $('cHours');
  cZone.innerHTML = '<optgroup label="Компьютеры">' + PC.map(function (z) { return '<option value="' + z.id + '">' + z.name + '</option>'; }).join('') +
    '</optgroup><optgroup label="PlayStation 5">' + TV.map(function (z) { return '<option value="' + z.id + '">' + z.name + '</option>'; }).join('') + '</optgroup>';

  function best(p, need) {
    var packs = [1, 3, 5], max = need + 4, dp = [0], pick = [0], i, k;
    for (i = 1; i <= max; i++) {
      dp[i] = Infinity;
      for (k = 0; k < 3; k++) {
        var c = dp[Math.max(0, i - packs[k])] + p[packs[k]];
        if (c < dp[i]) { dp[i] = c; pick[i] = packs[k]; }
      }
    }
    var at = need;
    for (i = need + 1; i <= max; i++) if (dp[i] < dp[at]) at = i;
    var cnt = { 1: 0, 3: 0, 5: 0 }, left = at;
    while (left > 0) { cnt[pick[left]]++; left = Math.max(0, left - pick[left]); }
    return { cost: dp[at], cnt: cnt, hours: at };
  }

  function calc() {
    var z = PC.concat(TV).filter(function (x) { return x.id === cZone.value; })[0];
    var need = +cHours.value, r = best(z.p, need), hints = [];
    $('cOut').textContent = need;
    $('cSum').textContent = rub(r.cost);
    $('cMix').textContent = [5, 3, 1].filter(function (h) { return r.cnt[h]; }).map(function (h) {
      return PACKS.filter(function (pk) { return pk.k === h; })[0].name + (r.cnt[h] > 1 ? ' × ' + r.cnt[h] : '');
    }).join(' + ') + (r.hours > need ? ' — ' + r.hours + ' ч дешевле, чем ' + need : '');
    if (z.p.morning && need <= 6 && z.p.morning < r.cost) hints.push('Играешь с 08:00 до 14:00? «Кибер утро» — ' + rub(z.p.morning) + ' за 6 часов.');
    if (z.p.night && need <= 8 && z.p.night < r.cost) hints.push('Ночью выгоднее «Кибер ночь» — ' + rub(z.p.night) + ' с 00:00 до 08:00.');
    $('cHints').innerHTML = hints.map(function (h) { return '<li>' + h + '</li>'; }).join('');
  }
  cZone.addEventListener('change', calc);
  cHours.addEventListener('input', calc);
  calc();

  // Ранги
  var tbody = $('rankTable').tBodies[0];
  tbody.innerHTML = RANKS.map(function (r) {
    return '<tr><td>' + r[0] + '</td><td class="num">' + r[1].toLocaleString('ru-RU') + '</td><td class="num">' + r[2] + '%</td><td class="num">' + r[3] + '%</td></tr>';
  }).join('');
  var rHours = $('rHours');
  function rank() {
    var h = Math.max(0, Math.floor(+rHours.value || 0)), i = 0;
    while (i + 1 < RANKS.length && h >= RANKS[i + 1][1]) i++;
    var r = RANKS[i], next = RANKS[i + 1];
    $('rRes').innerHTML = '<b>' + r[0] + '</b><span>кешбэк <em>' + r[2] + '%</em></span><span>оплата бонусами до <em>' + r[3] + '%</em></span>';
    $('rBar').style.width = next ? Math.round((h - r[1]) / (next[1] - r[1]) * 100) + '%' : '100%';
    $('rNext').textContent = next
      ? 'До ранга «' + next[0] + '» осталось ' + (next[1] - h) + ' ч — кешбэк вырастет до ' + next[2] + '%.'
      : 'Максимальный ранг. Ты настоящий True Gamer!';
    each(tbody.rows, function (row, j) { row.classList.toggle('is-me', j === i); });
  }
  rHours.addEventListener('input', rank);
  rank();

  // Меню
  var burger = $('burger'), nav = $('nav');
  function closeNav(focus) {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
    if (focus) burger.focus();
  }
  burger.addEventListener('click', function () { burger.setAttribute('aria-expanded', nav.classList.toggle('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(true); });

  // Появление при прокрутке
  var items = document.querySelectorAll('.rig,.tvc,.ps-card,.calc,.rankcalc,.card24,.compare');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    each(items, function (el) { el.classList.add('rv'); io.observe(el); });
  }
})();
