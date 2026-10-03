// Question kind 'liftday': level 154 Лифтът — The task solved in full: walking, a lift, a slope, a rest, and the clock.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2022, задача 10: Иво walks the flat 4 км from the stadium to Station 1 at 2 км in 30 minutes (1 hour),
// rides the lift up — 30 minutes there and back, so 15 one way — rests 32 minutes, walks the 2 км slope down at
// 6 км an hour (20 minutes) and the flat back (1 hour). Off at 8:54: 2 h 35 travel + 32 rest = 3 h 07, home at 12:01.
// Asked part by part, like the paper's marking; the clock time cannot be typed, so that part brings А/Б/В/Г.
const liftClock = t => Math.floor(t / 60) % 24 + ':' + String(t % 60).padStart(2, '0');
function genLiftDay(){
  const shape = rnd(4);
  for(;;){
    const fk = 1 + rnd(2), fm = [10, 15, 20, 30][rnd(4)], F = fk*(1 + rnd(4)), sk = [3, 4, 6, 12][rnd(4)], L = 1 + rnd(3), R = [20, 30, 40][rnd(3)], rest = 10 + rnd(40);
    const flat = F / fk * fm, down = L * 60 / sk;
    if(!Number.isInteger(down) || flat > 90) continue;
    const start = (7 + rnd(4))*60 + rnd(60), total = 2*flat + R/2 + down + rest, back = start + total;
    const q = {kind:'liftday', shape, fk, fm, F, sk, L, R, rest, flat, down, start, total, back};
    if(shape === 0) return Object.assign(q, {traps:[fm, F*fm], ans: flat});
    if(shape === 1) return Object.assign(q, {traps:[R], ans: R/2});
    if(shape === 2) return Object.assign(q, {traps:[total - rest, total + R/2], ans: total});
    const times = [back, back - rest, back + R/2, back - 60 + (Math.random() < 0.5 ? 10 : -10)].map(liftClock);
    if(new Set(times).size < 4) continue;
    const ids = shuffle([0, 1, 2, 3]);
    return Object.assign(q, {options: ids.map((k, id) => ({ id, v: id, text: [times[k], times[k]] })), pick: ids.indexOf(0), own: true, ans: ids.indexOf(0)});
  }
}
function liftSvg(q){
  const lab = (x, y, t, a) => '<text x="' + x + '" y="' + y + '" text-anchor="' + (a || 'middle') + '" font-size="12" font-weight="700" fill="var(--ink)" font-family="Nunito, sans-serif">' + t + '</text>';
  return '<div class="fig wide"><svg viewBox="0 0 250 86" style="max-width:clamp(210px,40vw,300px)" role="img" aria-label="' + tr('стадионът и двете станции', 'стадіон і дві станції') + '">' +
    '<path d="M14 62 H170 L222 14" fill="none" stroke="var(--ink)" stroke-width="2.4"/>' +
    '<circle cx="14" cy="62" r="5" fill="var(--ink)"/><circle cx="170" cy="62" r="5" fill="var(--ink)"/><circle cx="222" cy="14" r="5" fill="var(--ink)"/>' +
    lab(92, 54, q.F + ' км') + lab(205, 46, q.L + ' км', 'start') + lab(14, 80, tr('Стадион', 'Стадіон'), 'start') + lab(170, 80, tr('Станция 1', 'Станція 1')) +
    lab(214, 10, tr('Станция 2', 'Станція 2'), 'end') + '</svg></div>';
}
function drawLiftDay(q){
  if(q.kind === 'liftday'){
    const t = Math.floor(q.start / 60) + '<sup>' + String(q.start % 60).padStart(2, '0') + '</sup>';
    const story = tr('Когато се движи от лифтена Станция 1 до стадиона, Иво изминава <span class="num">' + q.fk + '</span> км за <span class="num">' + q.fm + '</span> минути. Когато слиза по наклона без лифт, изминава <span class="num">' + q.sk +
      '</span> км за един час. Лифтената кабинка се движи от едната до другата станция и обратно общо за <span class="num">' + q.R + '</span> минути. Иво тръгнал от стадиона в ' + t + ' часа, качил се до Станция 2 с лифта, починал си <span class="num">' + q.rest + '</span> минути и се върнал пеш до стадиона. ',
      'Від Станції 1 підйомника до стадіону Іво проходить <span class="num">' + q.fk + '</span> км за <span class="num">' + ukN(q.fm, 'хвилину', 'хвилини', 'хвилин').replace(' ', '</span> ') + '. Коли спускається схилом без підйомника, проходить <span class="num">' + q.sk +
      '</span> км за годину. Кабінка підйомника їде від однієї станції до іншої й назад загалом <span class="num">' + ukN(q.R, 'хвилину', 'хвилини', 'хвилин').replace(' ', '</span> ') + '. Іво вийшов зі стадіону о ' + t + ', піднявся на Станцію 2 підйомником, відпочив <span class="num">' + ukN(q.rest, 'хвилину', 'хвилини', 'хвилин').replace(' ', '</span> ') + ' і повернувся пішки на стадіон. ');
    const ask = [tr('За колко минути е стигнал пеш от стадиона до Станция 1?', 'За скільки хвилин він дійшов пішки від стадіону до Станції 1?'),
      tr('Колко минути се е возил с лифта до Станция 2?', 'Скільки хвилин він їхав підйомником до Станції 2?'),
      tr('Колко минути след тръгването се е върнал на стадиона?', 'Через скільки хвилин після виходу він повернувся на стадіон?'),
      tr('В колко часа се е върнал?', 'О котрій годині він повернувся?')][q.shape];
    return '<div class="ask">' + story + '<b>' + ask + '</b></div>' + liftSvg(q) + (q.shape === 3 ? '' : '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">' + tr('мин', 'хв') + '</span></div>');
  }
}
function eqLiftDay(q){
  if(q.kind === 'liftday') return [q.F + ' км → ' + q.flat + tr(' мин', ' хв'), q.R + ' : 2 = ' + q.R/2, q.flat + ' + ' + q.R/2 + ' + ' + q.down + ' + ' + q.flat + ' + ' + q.rest + ' = ' + q.total,
    liftClock(q.start) + ' + ' + q.total + tr(' мин', ' хв') + ' = ' + liftClock(q.back)][q.shape];
}
function whyLiftDay(q, full){
  if(q.kind === 'liftday'){
    if(!full) return [tr('Колко пъти по ' + q.fk + ' км има в ' + q.F + ' км?', 'Скільки разів по ' + q.fk + ' км у ' + q.F + ' км?'),
      tr('Тези минути са за отиване и връщане. А само нагоре?', 'Ці хвилини — туди й назад. А лише вгору?'),
      tr('Смятай поотделно: пеш по равното, с лифта нагоре, пеш надолу, пак по равното — и почивката.', 'Рахуй окремо: пішки рівниною, підйомником угору, пішки вниз, знову рівниною — і відпочинок.'),
      tr('Първо колко минути е бил навън. После ги добави към часа на тръгване.', 'Спершу — скільки хвилин його не було. Потім додай їх до часу виходу.')][q.shape];
    const legs = tr('по равното ', 'рівниною ') + q.F + ' : ' + q.fk + ' · ' + q.fm + ' = <b>' + q.flat + '</b>, ' + tr('лифтът ', 'підйомник ') + q.R + ' : 2 = <b>' + q.R/2 + '</b>, ' +
      tr('надолу ', 'униз ') + q.L + ' км = <b>' + q.down + '</b>';
    if(q.shape === 0) return q.F + ' : ' + q.fk + ' = ' + q.F / q.fk + ' &nbsp;→&nbsp; ' + q.F / q.fk + ' · ' + q.fm + ' = ' + q.ans;
    if(q.shape === 1) return q.R + ' : 2 = ' + q.ans;
    return legs + ' &nbsp;→&nbsp; ' + q.flat + ' + ' + q.R/2 + ' + ' + q.down + ' + ' + q.flat + ' + ' + q.rest + ' = <b>' + q.total + '</b>' + (q.shape === 3 ? ' &nbsp;→&nbsp; ' + liftClock(q.start) + ' + ' + q.total + ' = ' + liftClock(q.back) : '');
  }
}
KIND.liftday = { draw:drawLiftDay, eq:eqLiftDay, why:whyLiftDay };
