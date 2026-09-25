// Question kind 'place': level 23 □△ − 9 — Digits standing in for a two-digit number.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 17: the figures stand for digits of a two-digit numeral, not for a product.
// Зима 2021: 9□ − 7∆ = 12, so □ + ∆? 90 − 70 = 20, and 12 is 8 short of it: ∆ is 8 more than □ —
// □ = 0, ∆ = 8 or □ = 1, ∆ = 9, and □ + ∆ is 8 or 10. Every pair of digits tried.
function genPlaceTwo(){
  for(;;){
    const A = 2 + rnd(8), B = 1 + rnd(A - 1), D = 10*(A - B) + (rnd(2) ? 1 : -1)*(6 + rnd(4)), sols = [];
    if(D < 1) continue;
    for(let x = 0; x <= 9; x++) for(let y = 0; y <= 9; y++) if(10*A + x - 10*B - y === D) sols.push([x, y]);
    const sums = [...new Set(sols.map(([x, y]) => x + y))].sort((a, b) => a - b);
    if(sums.length < 2 || sums.length > 3) continue;
    return {kind:'place', shape:2, A, B, D, sols, slots: sums.length, ans: sums[0], alt: sums.slice(1)};
  }
}
function genPlace(){
  if(Math.random() < 0.2) return genPlaceTwo();
  for(;;){
    const t = 1 + rnd(9), u = rnd(10);
    if(t === u) continue;                       // "различни цифри"
    const k = 1 + rnd(9), N = 10*t + u, R = N - k;
    if(R < 10) continue;
    const a = 1 + rnd(9);
    const shape = u === 0 ? 0 : rnd(2);         // △□ needs a non-zero △
    const ans = shape === 0 ? 10*a + t - u : 10*u + t - a;
    return {kind:'place', t, u, N, k, R, a, shape, ans};
  }
}

function drawPlace(q){
  if(q.kind === 'place' && q.shape === 2){
    const sq = '<span class="circle">□</span>', tri = '<span class="circle">△</span>';
    return '<div class="ask">' + tr('Вместо ' + sq + ' и ' + tri + ' стоят цифри и', 'Замість ' + sq + ' і ' + tri + ' стоять цифри, і') + '</div>' +
      '<div class="given">' + q.A + sq + ' − ' + q.B + tri + ' = ' + q.D + '</div>' +
      '<div class="ask">' + tr('Колко може да е ' + sq + ' + ' + tri + '? Запишете всички възможни отговори.', 'Скільки може бути ' + sq + ' + ' + tri + '? Запишіть усі можливі відповіді.') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + Array.from({length: q.slots}).map((_, i) => i ? ' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot' + i + '"></span>' : SLOT).join('') + '</div>';
  }
  if(q.kind === 'place'){
    const sq = '<span class="circle">□</span>', tri = '<span class="circle">△</span>';
    const wanted = q.shape === 0 ? q.a + sq + ' − ' + tri : tri + sq + ' − ' + q.a;
    return '<div class="ask">' + tr('Вместо фигурите ' + sq + ' и ' + tri + ' поставете <b>различни</b> цифри, така че:',
      'Замість фігур ' + sq + ' і ' + tri + ' поставте <b>різні</b> цифри так, щоб:') + '</div>' +
      '<div class="given">' + sq + tri + ' − ' + q.k + ' = ' + q.R + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + wanted + ' = ' + SLOT + '</div>';
  }
}
function eqPlace(q){
  if(q.kind === 'place' && q.shape === 2) return q.sols.map(([x, y]) => q.A + '' + x + ' − ' + q.B + y).join(', ') + ' → ' + [q.ans].concat(q.alt).join(tr(' или ', ' або '));
  if(q.kind === 'place') return '□△ = ' + q.N + ' → □=' + q.t + ', △=' + q.u + ' → ' + q.ans;
}
function whyPlace(q, full){
  if(q.kind === 'place' && q.shape === 2){
    if(!full) return tr('Първо десетиците: колко е разликата без единиците? После кои единици я поправят.', 'Спершу десятки: скільки різниця без одиниць? Потім які одиниці її виправляють.');
    return q.A + '0 − ' + q.B + '0 = ' + 10*(q.A - q.B) + ' &nbsp;→&nbsp; ' + q.sols.map(([x, y]) => q.A + '' + x + ' − ' + q.B + y + ' = ' + q.D + tr(', сбор ', ', сума ') + (x + y)).join('; ') + ' &nbsp;→&nbsp; ' + [q.ans].concat(q.alt).join(tr(' или ', ' або '));
  }
  if(q.kind === 'place'){
    if(!full) return tr('□△ е двуцифрено число, а не умножение.', '□△ — це двоцифрове число, а не множення.');
    const wanted = q.shape === 0 ? q.a + '' + q.t + ' − ' + q.u : '' + q.u + q.t + ' − ' + q.a;
    return '□△ = ' + q.R + ' + ' + q.k + ' = <b>' + q.N + '</b> &nbsp;→&nbsp; □ = ' + q.t + ', △ = ' + q.u +
      ' &nbsp;→&nbsp; ' + wanted + ' = ' + q.ans;
  }
}
KIND.place = { draw:drawPlace, eq:eqPlace, why:whyPlace };
