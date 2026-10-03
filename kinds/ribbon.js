// Question kind 'ribbon': level 32 Ленти — Centimetres, decimetres and metres.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 12: centimetres against decimetres and metres.
const LEN = [{ nm:'дм', cm:10 }, { nm:'м', cm:100 }];
// МБГ Зима 2021, 2022: two ribbons measured in different units, and the difference asked in a third —
// 1 дм against 9 см, in милиметра: 100 − 90 = 10; 9 дм against 10 мм, in сантиметра: 90 − 1 = 89.
const RIB_U = { мм:1, см:10, дм:100 }, RIB_W = { мм:['милиметра','міліметрів'], см:['сантиметра','сантиметрів'], дм:['дециметра','дециметрів'] };
function genRibbonDiff(){
  for(;;){
    const us = shuffle(['мм', 'см', 'дм']), [u1, u2] = us, to = Math.random() < 0.5 ? us[2] : ['мм', 'см'][rnd(2)];
    const a = 1 + rnd(u1 === 'дм' ? 9 : 99), b = 1 + rnd(u2 === 'дм' ? 9 : 99);
    const A = a*RIB_U[u1], B = b*RIB_U[u2], D = A - B;
    if(D <= 0 || D % RIB_U[to] || D / RIB_U[to] > 999) continue;
    return {kind:'ribbon', shape:5, a, u1, b, u2, to, A, B, ans: D / RIB_U[to]};
  }
}
// A length as she reads it on a paper: {d, c} is d дм and c см (c may be 10 or more, as in «4 дм и 18 см»),
// {m} whole metres, {c} centimetres only.
const ribLen = r => r.m ? r.m + ' м' : r.d && r.c ? r.d + ' дм ' + tr('и', 'і') + ' ' + r.c + ' см' : r.d ? r.d + ' дм' : r.c + ' см';
const ribCm = r => (r.m || 0)*100 + (r.d || 0)*10 + (r.c || 0);
function ribSay(cm){
  /** @type {{c?: number, d?: number, m?: number}[]} */
  const ways = [{c:cm}];
  if(cm % 10 === 0) ways.push({d: cm/10});
  if(cm === 100) ways.push({m:1});
  if(cm > 20){ const d = 1 + rnd(Math.floor(cm/10) - 1); ways.push({d, c: cm - 10*d}); }
  return ways[rnd(ways.length)];
}
// Коледно 2023, задача 5: four garlands of 4 дм и 18 см, two of 4 дм, one of 6 дм, three of 57 см and one of
// 7 дм — how many are longer than 53 см? 58, 40, 60, 57, 70: 4 + 1 + 3 + 1 = 9, garlands, not kinds of them.
const RIB_N = {1:['една', 'одна'], 2:['две', 'дві'], 3:['три', 'три'], 4:['четири', 'чотири']};
function genRibbonOver(){
  for(;;){
    const T = 30 + rnd(50), k = 4 + rnd(2), groups = [], seen = new Set();
    while(groups.length < k){
      const cm = Math.max(12, T + (rnd(2) ? 1 : -1)*(1 + rnd(25)));
      if(seen.has(cm) || cm === T) continue;
      seen.add(cm); groups.push({n: 1 + rnd(4), r: ribSay(cm), cm});
    }
    const longer = Math.random() < 0.7, fit = groups.filter(g => longer ? g.cm > T : g.cm < T);
    if(fit.length < 2 || fit.length === k || !groups.some(g => g.r.d && g.r.c >= 10)) continue;
    const ans = fit.reduce((t, g) => t + g.n, 0);
    return {kind:'ribbon', shape:6, T, longer, groups, traps:[fit.length], ans};
  }
}
// Коледно 2022, задача 9: ten ribbons, 2 дм и 40 см, 90 см, 8 дм и 8 см, 100 см, 8 дм и 10 см, 60 см, 5 дм и 10 см,
// 1 м, 6 дм, 10 дм. The same length always goes in one box: 60, 88, 90 and 100 см, so 4 boxes.
function genRibbonBoxes(){
  for(;;){
    const vals = shuffle([40, 50, 60, 70, 80, 88, 90, 100, 45, 75]).slice(0, 3 + rnd(3)), rows = vals.slice();
    while(rows.length < 8 + rnd(3)) rows.push(vals[rnd(vals.length)]);
    const list = shuffle(rows).map(cm => ribSay(cm));
    if(new Set(list.map(ribLen)).size < list.length - 2) continue;
    return {kind:'ribbon', shape:7, list, cms: list.map(ribCm), traps:[list.length, new Set(list.map(r => r.c ? 'c' + r.c : 'd' + (r.d || r.m))).size].filter(v => v !== vals.length), ans: vals.length};
  }
}
function genRibbon(){
  if(Math.random() < 0.12) return genRibbonOver();
  if(Math.random() < 0.12) return genRibbonBoxes();
  if(Math.random() < 0.15) return genRibbonDiff();
  if(Math.random() < 0.2){
    // Задача 13: one stick laid down a few times with a piece of board left over, and the
    // length wanted in дециметри — so the total has to come out a whole number of them.
    for(;;){
      const a = 6 + rnd(15), k = 2 + rnd(4);
      const left = 10 - (k*a) % 10 + 10*rnd(2);
      if(left < 1 || left >= a) continue;      // another whole stick would have fitted
      return {kind:'ribbon', shape:4, a, k, left, cm: k*a + left, ans: (k*a + left) / 10};
    }
  }
  if(Math.random() < 0.28){
    // Задача 13: a board measured by laying two sticks down a few times each. One stick
    // is sometimes given in дециметри, so the two have to be brought together first.
    const inDm = Math.random() < 0.35;
    const a = inDm ? 1 + rnd(2) : 8 + rnd(13);
    const b = 3 + rnd(8), k = 2 + rnd(3), m = 1 + rnd(3);
    return {kind:'ribbon', shape:3, inDm, a, aCm: inDm ? 10*a : a, b, k, m,
            ans: k * (inDm ? 10*a : a) + m*b};
  }
  for(;;){
    const u = Math.random() < 0.75 ? LEN[0] : LEN[1];
    const shape = rnd(3);
    if(shape === 0){                                     // straight conversion, either way
      const toCm = Math.random() < 0.5;
      const n = 1 + rnd(u.cm === 10 ? 9 : 3);
      return toCm ? {kind:'ribbon', shape, u, n, toCm, ans: n * u.cm}
                  : {kind:'ribbon', shape, u, n, toCm, cm: n * u.cm, ans: n};
    }
    const dm = LEN[0];                                   // a cut in metres would run past 100 cm
    const t = 2 + rnd(7);
    const target = t * dm.cm;
    const off = 2 + rnd(19);
    const L = shape === 1 ? target + off : target - off;
    if(L < 12) continue;
    return {kind:'ribbon', shape, u: dm, t, target, L, ans: off};
  }
}

const ribbonUkTimes = n => ({one:'раз', few:'рази'})[new Intl.PluralRules('uk').select(n)] || 'разів';
function drawRibbon(q){
  if(q.kind === 'ribbon' && q.shape === 6){
    const list = q.groups.map((g, i) => (i ? (i === q.groups.length - 1 ? tr(' и ', ' і ') : ', ') : '') + tr(RIB_N[g.n][0], RIB_N[g.n][1]) + ' — ' + tr('по ', 'по ') + ribLen(g.r)).join('');
    return '<div class="ask">' + tr('Ива купила гирлянди: ' + list + '. Колко от гирляндите са <b>по-' + (q.longer ? 'дълги' : 'къси') + '</b> от <span class="num">' + q.T + '</span> см?',
      'Іва купила гірлянди: ' + list + '. Скільки гірлянд <b>' + (q.longer ? 'довші' : 'коротші') + '</b> за <span class="num">' + q.T + '</span> см?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'ribbon' && q.shape === 7){
    // two lists side by side, so ten ribbons take five rows on a phone
    const half = Math.ceil(q.list.length / 2), cell = i => i < q.list.length ? '<td>' + (i + 1) + '</td><td>' + ribLen(q.list[i]) + '</td>' : '<td></td><td></td>';
    const head = '<th>№</th><th>' + tr('Дължина', 'Довжина') + '</th>';
    const T = '<table class="tix"><tr>' + head + head + '</tr>' +
      [...Array(half).keys()].map(i => '<tr>' + cell(i) + cell(i + half) + '</tr>').join('') + '</table>';
    return '<div class="ask">' + tr('Лили подредила лентите в кутии. Всяка кутия съдържа ленти с еднаква дължина и всички ленти с еднаква дължина са в една кутия. Колко кутии е използвала?',
      'Лілі розклала стрічки в коробки. У кожній коробці стрічки однакової довжини, і всі стрічки однакової довжини в одній коробці. Скільки коробок вона використала?') + '</div>' +
      T + '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
  if(q.kind === 'ribbon' && q.shape === 5){
    const n = (v, u) => '<span class="num">' + v + '&nbsp;' + u + '</span>';
    return '<div class="ask">' + tr('Лента е дълга ' + n(q.a, q.u1) + '. С колко <b>' + RIB_W[q.to][0] + '</b> тя е по-дълга от лента с дължина ' + n(q.b, q.u2) + '?',
      'Стрічка завдовжки ' + n(q.a, q.u1) + '. На скільки <b>' + RIB_W[q.to][1] + '</b> вона довша за стрічку завдовжки ' + n(q.b, q.u2) + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">' + q.to + '</span></div>';
  }
  if(q.kind === 'ribbon' && q.shape === 4){
    const pt = n => n === 1 ? 'път' : 'пъти';
    return '<div class="ask">' + tr('Използваме пръчка с дължина <span class="num">' + q.a +
      ' см</span>, за да премерим дължината на една дъска. Сложили сме пръчката <span class="num">' + q.k +
      '</span> ' + pt(q.k) + ' и остават още <span class="num">' + q.left +
      '</span> см за премерване. Колко <b>дециметра</b> е дълга дъската?',
      'Паличкою завдовжки <span class="num">' + q.a +
      ' см</span> вимірюємо довжину однієї дошки. Ми приклали паличку <span class="num">' + q.k +
      '</span> ' + ribbonUkTimes(q.k) + ', і лишилося виміряти ще <span class="num">' + q.left +
      '</span> см. Скільки <b>дециметрів</b> завдовжки дошка?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + ' <span class="unit">дм</span></div>';
  }
  if(q.kind === 'ribbon' && q.shape === 3){
    const long = q.a + ' ' + (q.inDm ? 'дм' : 'см'), pt = n => n === 1 ? 'път' : 'пъти';
    return '<div class="ask">' + tr('Имам две пръчки — с дължина <span class="num">' + long +
      '</span> и с дължина <span class="num">' + q.b + ' см</span>. С тях премерих дължината на една дъска. ' +
      'Пръчката от <span class="num">' + long + '</span> използвах <span class="num">' + q.k + '</span> ' + pt(q.k) +
      ', а пръчката от <span class="num">' + q.b + ' см</span> — <span class="num">' + q.m + '</span> ' + pt(q.m) +
      '. Колко сантиметра е дължината на дъската?',
      'Є дві палички — завдовжки <span class="num">' + long +
      '</span> і завдовжки <span class="num">' + q.b + ' см</span>. Ними виміряли довжину однієї дошки. ' +
      'Паличку завдовжки <span class="num">' + long + '</span> приклали <span class="num">' + q.k + '</span> ' + ribbonUkTimes(q.k) +
      ', а паличку завдовжки <span class="num">' + q.b + ' см</span> — <span class="num">' + q.m + '</span> ' + ribbonUkTimes(q.m) +
      '. Скільки сантиметрів завдовжки дошка?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'ribbon'){
    const ask = q.shape === 0
      ? (q.toCm ? tr('Колко сантиметра са <span class="num">' + q.n + '</span> ' + q.u.nm + '?',
                     'Скільки сантиметрів у <span class="num">' + q.n + '</span> ' + q.u.nm + '?')
                : tr('Колко ' + (q.u.nm === 'дм' ? 'дециметра' : 'метра') + ' са <span class="num">' + q.cm + '</span> см?',
                     'Скільки ' + (q.u.nm === 'дм' ? 'дециметрів' : 'метрів') + ' у <span class="num">' + q.cm + '</span> см?'))
      : q.shape === 1
      ? tr('Лента е дълга <span class="num">' + q.L + '</span> см. Колко сантиметра трябва да <b>отрежем</b> от нея, за да остане лента с дължина <span class="num">' + q.t + '</span> ' + q.u.nm + '?',
           'Стрічка завдовжки <span class="num">' + q.L + '</span> см. Скільки сантиметрів треба <b>відрізати</b> від неї, щоб лишилася стрічка завдовжки <span class="num">' + q.t + '</span> ' + q.u.nm + '?')
      : tr('Лента е дълга <span class="num">' + q.L + '</span> см. Колко сантиметра трябва да <b>добавим</b>, за да стане дълга <span class="num">' + q.t + '</span> ' + q.u.nm + '?',
           'Стрічка завдовжки <span class="num">' + q.L + '</span> см. Скільки сантиметрів треба <b>додати</b>, щоб вона стала завдовжки <span class="num">' + q.t + '</span> ' + q.u.nm + '?');
    const unit = q.shape === 0 && !q.toCm ? q.u.nm : 'см';
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT +
      ' <span class="unit">' + unit + '</span></div>';
  }
}
function eqRibbon(q){
  if(q.kind === 'ribbon' && q.shape === 6) return q.groups.map(g => g.n + '×' + g.cm).join(', ') + ' → ' + q.ans;
  if(q.kind === 'ribbon' && q.shape === 7) return [...new Set(q.cms)].sort((a, b) => a - b).join(', ') + ' см → ' + q.ans;
  if(q.kind === 'ribbon' && q.shape === 5) return q.A + ' мм − ' + q.B + ' мм = ' + (q.A - q.B) + ' мм = ' + q.ans + ' ' + q.to;
  if(q.kind === 'ribbon' && q.shape === 4) return q.k + '×' + q.a + ' + ' + q.left + ' = ' + q.cm + ' см → ' + q.ans;
  if(q.kind === 'ribbon' && q.shape === 3) return q.k + '×' + q.aCm + ' + ' + q.m + '×' + q.b + ' → ' + q.ans;
  if(q.kind === 'ribbon') return (q.shape === 0 ? tr('преобразуване', 'перетворення') : q.L + tr(' см към ', ' см до ') + q.t + ' ' + q.u.nm) + ' → ' + q.ans;
}
function whyRibbon(q, full){
  if(q.kind === 'ribbon' && q.shape === 6){
    if(!full) return tr('Първо всяка дължина в сантиметри. После брой гирляндите, не видовете.', 'Спершу кожну довжину в сантиметрах. Потім рахуй гірлянди, а не їхні види.');
    const fit = q.groups.filter(g => q.longer ? g.cm > q.T : g.cm < q.T);
    return q.groups.map(g => ribLen(g.r) + ' = ' + (fit.includes(g) ? '<b>' + g.cm + '</b>' : g.cm)).join(', ') + ' &nbsp;→&nbsp; ' + fit.map(g => g.n).join(' + ') + ' = ' + q.ans;
  }
  if(q.kind === 'ribbon' && q.shape === 7){
    if(!full) return tr('Запиши всяка лента в сантиметри, после събери еднаквите.', 'Переведи кожну стрічку в сантиметри, потім збери однакові.');
    return q.cms.join(', ') + ' &nbsp;→&nbsp; ' + tr('различни: ', 'різні: ') + [...new Set(q.cms)].sort((a, b) => a - b).join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'ribbon' && q.shape === 5){
    if(!full) return tr('Първо двете дължини в едни и същи мерки.', 'Спершу обидві довжини в однакових одиницях.');
    const u = RIB_U[q.to] <= Math.min(RIB_U[q.u1], RIB_U[q.u2]) ? q.to : RIB_U[q.u1] < RIB_U[q.u2] ? q.u1 : q.u2, f = RIB_U[u];
    return q.a + ' ' + q.u1 + ' = ' + q.A/f + ' ' + u + ', ' + q.b + ' ' + q.u2 + ' = ' + q.B/f + ' ' + u + ' &nbsp;→&nbsp; ' + q.A/f + ' − ' + q.B/f + ' = ' + (q.A - q.B)/f + ' ' + u +
      (u === q.to ? '' : ' = ' + q.ans + ' ' + q.to);
  }
  if(q.kind === 'ribbon' && q.shape === 4){
    if(!full) return tr('Първо цялата дъска в сантиметри, чак после я преобразувай.',
      'Спочатку знайди довжину всієї дошки в сантиметрах, а вже потім переводь.');
    return q.k + ' × ' + q.a + ' = <b>' + (q.k*q.a) + '</b> &nbsp;→&nbsp; ' + (q.k*q.a) + ' + ' + q.left +
      ' = <b>' + q.cm + ' см</b> &nbsp;→&nbsp; 10 см = 1 дм, ' + tr('значи', 'отже') + ' ' + q.ans;
  }
  if(q.kind === 'ribbon' && q.shape === 3){
    if(!full) return tr('Всяка пръчка се слага толкова пъти, колкото е казано — и мерките трябва да съвпадат.',
      'Кожну паличку прикладають стільки разів, скільки сказано, — і одиниці вимірювання мають збігатися.');
    const head = q.inDm ? q.a + ' дм = <b>' + q.aCm + ' см</b> &nbsp;→&nbsp; ' : '';
    return head + q.k + ' × ' + q.aCm + ' = <b>' + (q.k*q.aCm) + '</b>, &nbsp;' + q.m + ' × ' + q.b +
      ' = <b>' + (q.m*q.b) + '</b> &nbsp;→&nbsp; ' + (q.k*q.aCm) + ' + ' + (q.m*q.b) + ' = ' + q.ans;
  }
  if(q.kind === 'ribbon'){
    // the reminder must not state the factor: for a plain conversion that IS the answer
    if(!full) return q.shape === 0
      ? tr('Колко сантиметра има в един ' + (q.u.nm === 'дм' ? 'дециметър' : 'метър') + '?',
           'Скільки сантиметрів в одному ' + (q.u.nm === 'дм' ? 'дециметрі' : 'метрі') + '?')
      : tr('Първо преобразувай всичко в сантиметри.', 'Спочатку переведи все в сантиметри.');
    if(q.shape === 0) return q.toCm
      ? '1 ' + q.u.nm + ' = ' + q.u.cm + ' см &nbsp;→&nbsp; ' + q.n + ' ' + q.u.nm + ' = ' + q.ans + ' см'
      : q.u.cm + ' см = 1 ' + q.u.nm + ' &nbsp;→&nbsp; ' + q.cm + ' см = ' + q.ans + ' ' + q.u.nm;
    return q.t + ' ' + q.u.nm + ' = <b>' + q.target + ' см</b> &nbsp;→&nbsp; ' +
      (q.shape === 1 ? q.L + ' − ' + q.target : q.target + ' − ' + q.L) + ' = ' + q.ans;
  }
}
KIND.ribbon = { draw:drawRibbon, eq:eqRibbon, why:whyRibbon };
