// Question kind 'grow': level 14 Нов сбор — Every addend changes by the same amount.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 7: every addend moves by the same amount, so the sum moves that many times.
// МБГ Зима 2020–2022: a difference, its minuend and subtrahend each changed — 40 − 10, the minuend
// down 10 and the subtrahend up 10, so both changes take away: 30 − 20 = 10.
function genGrowDiff(){
  for(;;){
    const M = 20 + rnd(60), S = 5 + rnd(M - 10), a = 1 + rnd(12), b = 1 + rnd(12), mUp = Math.random() < 0.3, sUp = Math.random() < 0.7;
    const M2 = mUp ? M + a : M - a, S2 = sUp ? S + b : S - b;
    if(M2 > 99 || S2 < 1 || M2 - S2 < 0) continue;
    return {kind:'grow', shape:'diff', M, S, a, b, mUp, sUp, M2, S2, ans: M2 - S2};
  }
}
// МБГ Пролет 2025, задача 10: in 15 + 18 + 27 + 28 each odd addend is made 3 times smaller. Only 15 and
// 27 change, to 5 and 9: 5 + 18 + 9 + 28 = 60. Level 135, apart from 14: it needs the times table.
function genGrowTimes(){
  for(;;){
    const odd = Math.random() < 0.6, k = 2 + rnd(2), down = Math.random() < 0.7, xs = [];
    for(let i = 0; i < 4; i++) xs.push(10 + rnd(35));
    const hit = v => (v % 2 === 1) === odd, ys = xs.map(v => hit(v) ? (down ? v / k : v*k) : v);
    if(!xs.some(hit) || xs.every(hit) || ys.some(v => !Number.isInteger(v)) || ys.some(v => v > 99)) continue;
    return {kind:'grow', shape:'times', odd, k, down, xs, ys, traps:[xs.reduce((t, v) => t + (down ? v / k : v*k), 0)].filter(Number.isInteger), ans: ys.reduce((t, v) => t + v, 0)};
  }
}
function genGrow(){
  if(Math.random() < 0.3) return genGrowDiff();
  const k = 2 + rnd(3);
  const d = 2 + rnd(5);
  const up = Math.random() < 0.65;
  const base = up ? 3 + rnd(15) : k*d + rnd(12);
  return {kind:'grow', k, d, up, base, ans: up ? base + k*d : base - k*d};
}

const growUkGen = {2:'двох', 3:'трьох', 4:'чотирьох'};
function drawGrow(q){
  if(q.kind === 'grow' && q.shape === 'times'){
    return '<div class="ask">' + tr('Всяко от <b>' + (q.odd ? 'нечетните' : 'четните') + '</b> събираеми в сбора <span class="num">' + q.xs.join(' + ') + '</span> е ' + (q.down ? 'намалено' : 'увеличено') + ' <span class="num">' + q.k + '</span> пъти. Пресметнете получения нов сбор.',
      'Кожен <b>' + (q.odd ? 'непарний' : 'парний') + '</b> доданок у сумі <span class="num">' + q.xs.join(' + ') + '</span> ' + (q.down ? 'зменшили' : 'збільшили') + ' в <span class="num">' + q.k + '</span> рази. Обчисліть нову суму.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'grow' && q.shape === 'diff'){
    const n = v => '<span class="num">' + v + '</span>';
    return '<div class="ask">' + tr('В разликата ' + n(q.M + ' − ' + q.S) + ' умаляемото е ' + (q.mUp ? 'увеличено' : 'намалено') + ' с ' + n(q.a) + ', а умалителят е ' + (q.sUp ? 'увеличен' : 'намален') + ' с ' + n(q.b) + '. Колко е <b>новата разлика</b>?',
      'У різниці ' + n(q.M + ' − ' + q.S) + ' зменшуване ' + (q.mUp ? 'збільшили' : 'зменшили') + ' на ' + n(q.a) + ', а від’ємник ' + (q.sUp ? 'збільшили' : 'зменшили') + ' на ' + n(q.b) + '. Якою стала <b>нова різниця</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'grow'){
    return '<div class="ask">' + tr('Сборът на ' + BGNUM[q.k] + ' числа е <span class="num">' + q.base +
      '</span>. Всяко от събираемите ' + (q.up ? 'увеличаваме' : 'намаляваме') +
      ' с <span class="num">' + q.d + '</span>. Колко е новият сбор?',
      'Сума ' + growUkGen[q.k] + ' чисел дорівнює <span class="num">' + q.base +
      '</span>. Кожен доданок ' + (q.up ? 'збільшуємо' : 'зменшуємо') +
      ' на <span class="num">' + q.d + '</span>. Якою буде нова сума?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqGrow(q){
  if(q.kind === 'grow' && q.shape === 'times') return q.ys.join(' + ') + ' = ' + q.ans;
  if(q.kind === 'grow' && q.shape === 'diff') return '(' + q.M + (q.mUp ? ' + ' : ' − ') + q.a + ') − (' + q.S + (q.sUp ? ' + ' : ' − ') + q.b + ') = ' + q.M2 + ' − ' + q.S2 + ' = ' + q.ans;
  if(q.kind === 'grow') return tr(BGNUM[q.k] + ' числа, сбор ' + q.base + ', всяко ',
    UKNUM[q.k] + ' числа, сума ' + q.base + ', кожне ') + (q.up ? '+' : '−') + q.d + ' → ' + q.ans;
}
function whyGrow(q, full){
  if(q.kind === 'grow' && q.shape === 'times'){
    if(!full) return tr('Кои от събираемите са ' + (q.odd ? 'нечетни' : 'четни') + '? Само те се променят — «пъти» значи ' + (q.down ? 'делим' : 'умножаваме') + '.', 'Які доданки ' + (q.odd ? 'непарні' : 'парні') + '? Змінюються лише вони — «у стільки разів» означає ' + (q.down ? 'ділимо' : 'множимо') + '.');
    return q.xs.map((v, i) => v === q.ys[i] ? String(v) : v + (q.down ? ' : ' : ' · ') + q.k + ' = <b>' + q.ys[i] + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.ys.join(' + ') + ' = ' + q.ans;
  }
  if(q.kind === 'grow' && q.shape === 'diff'){
    if(!full) return tr('Намери новото умаляемо и новия умалител, после ги извади.', 'Знайди нове зменшуване й новий від’ємник, потім відніми.');
    return tr('умаляемото: ', 'зменшуване: ') + q.M + (q.mUp ? ' + ' : ' − ') + q.a + ' = <b>' + q.M2 + '</b>, ' + tr('умалителят: ', 'від’ємник: ') + q.S + (q.sUp ? ' + ' : ' − ') + q.b + ' = <b>' + q.S2 + '</b> &nbsp;→&nbsp; ' + q.M2 + ' − ' + q.S2 + ' = ' + q.ans;
  }
  if(q.kind === 'grow'){
    if(!full) return tr('Всяко число се променя — колко пъти общо?', 'Змінюється кожне число — скільки разів загалом?');
    const step = Array(q.k).fill(q.d).join(' + ');
    return step + ' = <b>' + (q.k*q.d) + '</b> ' + (q.up ? tr('повече', 'більше') : tr('по-малко', 'менше')) +
      ' &nbsp;→&nbsp; ' + q.base + ' ' + (q.up ? '+' : '−') + ' ' + (q.k*q.d) + ' = ' + q.ans;
  }
}
KIND.grow = { draw:drawGrow, eq:eqGrow, why:whyGrow };
