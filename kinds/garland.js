// Question kind 'garland': level 126 Гирляндите — Garlands of three colours, a table of lengths, and the shapes laid out of them.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2024, задача 10, the one solved in full, in its four parts. Яна bought 3 green garlands,
// her mother 1 green and 2 red, her brother 1 green, 2 blue and 2 red; green are 12 дм, blue 15 дм,
// red 30 дм (the prices in the table are never needed). 1) all of them: 60 + 30 + 120 = 210 дм = 21 м.
// 2) the green make a square: 60 : 4 = 15 дм. 3) the red make the roof's two sides: 12 м : 2 = 6 м.
// 4) all of them make a tree of two equal-sided triangles, the lower one's side 4 м: 21 − 12 = 9 м
// for the upper, 3 м a side.
const GARLAND_LEN = [[8, 10, 12, 14, 16, 20], [10, 15, 20, 25, 30], [20, 30, 40, 50]];
function genGarland(){
  const shape = rnd(4);
  for(;;){
    const len = GARLAND_LEN.map(a => a[rnd(a.length)]), price = [10 + 5*rnd(4), 30 + 10*rnd(3), 20 + 5*rnd(3)];
    const who = [[1 + rnd(4), 0, 0], [rnd(3), 0, 1 + rnd(3)], [rnd(3), 1 + rnd(3), rnd(3)]];   // Яна, her mother, her brother: [green, blue, red]
    const n = [0, 1, 2].map(c => who.reduce((t, w) => t + w[c], 0)), dm = n.map((k, c) => k*len[c]), all = dm[0] + dm[1] + dm[2];
    const q = {kind:'garland', shape, len, price, who, n, dm, all};
    if(shape === 0 && all % 10 === 0 && all <= 400) return Object.assign(q, {ans: all / 10});
    if(shape === 1 && dm[0] % 4 === 0) return Object.assign(q, {ans: dm[0] / 4});
    if(shape === 2 && dm[2] % 20 === 0) return Object.assign(q, {ans: dm[2] / 20});
    if(shape === 3 && all % 10 === 0 && all <= 400){
      const L = 2 + rnd(6), up = all / 10 - 3*L;
      if(up > 0 && up % 3 === 0 && up / 3 < L) return Object.assign(q, {L, ans: up / 3});
    }
  }
}
function garlandSvg(){
  // the house: a red roof of two equal sides on a blue line, a green square under it
  return '<div class="fig"><svg viewBox="0 0 80 120" style="max-width:70px" role="img" aria-label="' + tr('къщичка от гирлянди', 'будиночок із гірлянд') + '">' +
    '<polyline points="22,74 40,6 58,74" fill="none" stroke="#e03131" stroke-width="3"/><line x1="22" y1="74" x2="58" y2="74" stroke="#1c7ed6" stroke-width="3"/>' +
    '<rect x="31" y="84" width="18" height="18" fill="none" stroke="#2f9e44" stroke-width="3"/></svg></div>';
}
function drawGarland(q){
  if(q.kind === 'garland'){
    const C = [tr('зелени', 'зелені'), tr('сини', 'сині'), tr('червени', 'червоні')], one = [tr('зелена', 'зелену'), tr('синя', 'синю'), tr('червена', 'червону')];
    const buy = w => w.map((k, c) => k ? k + ' ' + (k === 1 ? one[c] : C[c]) : '').filter(Boolean).join(tr(', ', ', ')).replace(/, ([^,]*)$/, tr(' и $1', ' і $1'));
    const T = '<table class="tix"><tr><th>' + tr('Гирлянди', 'Гірлянди') + '</th><th>' + tr('Цена', 'Ціна') + '</th><th>' + tr('Дължина', 'Довжина') + '</th></tr>' +
      [tr('Зелена', 'Зелена'), tr('Синя', 'Синя'), tr('Червена', 'Червона')].map((nm, c) => '<tr><td>' + nm + '</td><td>' + q.price[c] + tr(' ст.', ' коп.') + '</td><td>' + q.len[c] + ' дм</td></tr>').join('') + '</table>';
    const g1 = q.who[0].filter(Boolean).length === 1 && q.who[0][0] === 1;
    const story = tr('Яна купила ' + buy(q.who[0]) + (g1 ? ' гирлянда' : ' гирлянди') + ', майка ѝ — ' + buy(q.who[1]) + ', а брат ѝ — ' + buy(q.who[2]) + '. ',
      'Яна купила ' + buy(q.who[0]) + (g1 ? ' гірлянду' : ' гірлянди') + ', її мама — ' + buy(q.who[1]) + ', а брат — ' + buy(q.who[2]) + '. ');
    const ask = q.shape === 0 ? tr('Колко <b>метра</b> гирлянди са купили общо?', 'Скільки <b>метрів</b> гірлянд вони купили разом?')
      : q.shape === 1 ? tr('От всички гирлянди Яна „нарисувала“ къщичка. Колко <b>дециметра</b> е страната на квадрата, „нарисуван“ от всички зелени гирлянди?', 'З усіх гірлянд Яна «намалювала» будиночок. Скільки <b>дециметрів</b> сторона квадрата, «намальованого» всіма зеленими гірляндами?')
      : q.shape === 2 ? tr('От всички гирлянди Яна „нарисувала“ къщичка. По колко <b>метра</b> са бедрата на равнобедрения триъгълник, „нарисувани“ от всички червени гирлянди?', 'З усіх гірлянд Яна «намалювала» будиночок. Скільки <b>метрів</b> кожна бічна сторона рівнобедреного трикутника, «намальована» всіма червоними гірляндами?')
      : tr('От всички гирлянди Яна „нарисувала“ елха от два равностранни триъгълника. Страната на долния е <span class="num">' + q.L + '</span> м. Колко <b>метра</b> е страната на горния триъгълник?', 'З усіх гірлянд Яна «намалювала» ялинку з двох рівносторонніх трикутників. Сторона нижнього — <span class="num">' + q.L + '</span> м. Скільки <b>метрів</b> сторона верхнього трикутника?');
    return '<div class="ask">' + story + ask + '</div>' + T + (q.shape === 1 || q.shape === 2 ? garlandSvg() : '') +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqGarland(q){
  if(q.kind === 'garland'){
    if(q.shape === 1) return q.dm[0] + ' : 4 = ' + q.ans + ' дм';
    if(q.shape === 2) return q.dm[2] + ' дм : 2 = ' + q.dm[2] / 2 + ' дм = ' + q.ans + ' м';
    const m = q.all / 10;
    return q.dm.join(' + ') + ' = ' + q.all + ' дм = ' + m + ' м' + (q.shape === 3 ? ', ' + m + ' − 3 · ' + q.L + ' = ' + 3*q.ans + ' → ' + q.ans : '');
  }
}
function whyGarland(q, full){
  if(q.kind === 'garland'){
    if(!full) return q.shape === 1 ? tr('Колко зелени гирлянди има общо и колко са дълги заедно? Квадратът има четири равни страни.', 'Скільки всього зелених гірлянд і яка їхня спільна довжина? У квадрата чотири рівні сторони.')
      : q.shape === 2 ? tr('Колко са дълги всички червени заедно? Бедрата са две и са равни.', 'Яка спільна довжина всіх червоних? Бічних сторін дві, і вони рівні.')
      : q.shape === 3 ? tr('Всички гирлянди заедно — после махни долния триъгълник: три страни по толкова.', 'Усі гірлянди разом — потім відніми нижній трикутник: три сторони по стільки.')
      : tr('Преброй гирляндите от всеки цвят и умножи по дължината от таблицата. Цената не трябва.', 'Порахуй гірлянди кожного кольору й помнож на довжину з таблиці. Ціна не потрібна.');
    const rep = (k, v) => k === 1 ? String(v) : k <= 5 ? Array(k).fill(v).join(' + ') : k + ' · ' + v;
    const cnt = q.n.map((k, c) => k ? rep(k, q.len[c]) + ' = ' + q.dm[c] : '').filter(Boolean).join(', ');
    if(q.shape === 1) return tr('зелените: ', 'зелені: ') + rep(q.n[0], q.len[0]) + ' = <b>' + q.dm[0] + '</b> дм &nbsp;→&nbsp; ' + q.dm[0] + ' : 4 = ' + q.ans + ' дм';
    if(q.shape === 2) return tr('червените: ', 'червоні: ') + rep(q.n[2], q.len[2]) + ' = <b>' + q.dm[2] + '</b> дм = ' + q.dm[2] / 10 + ' м &nbsp;→&nbsp; ' + q.dm[2] / 10 + ' : 2 = ' + q.ans + ' м';
    const m = q.all / 10;
    return cnt + ' &nbsp;→&nbsp; ' + q.all + ' дм = <b>' + m + '</b> м' + (q.shape === 3 ? ' &nbsp;→&nbsp; ' + tr('долният: ', 'нижній: ') + '3 · ' + q.L + ' = ' + 3*q.L + ' м, ' + tr('горният: ', 'верхній: ') + m + ' − ' + 3*q.L + ' = ' + 3*q.ans + ' м &nbsp;→&nbsp; ' + 3*q.ans + ' : 3 = ' + q.ans : '');
  }
}
KIND.garland = { draw:drawGarland, eq:eqGarland, why:whyGarland };
