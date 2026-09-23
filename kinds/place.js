// Question kind 'place': level 23 □△ − 9 — Digits standing in for a two-digit number.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 17: the figures stand for digits of a two-digit numeral, not for a product.
function genPlace(){
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
  if(q.kind === 'place') return '□△ = ' + q.N + ' → □=' + q.t + ', △=' + q.u + ' → ' + q.ans;
}
function whyPlace(q, full){
  if(q.kind === 'place'){
    if(!full) return tr('□△ е двуцифрено число, а не умножение.', '□△ — це двоцифрове число, а не множення.');
    const wanted = q.shape === 0 ? q.a + '' + q.t + ' − ' + q.u : '' + q.u + q.t + ' − ' + q.a;
    return '□△ = ' + q.R + ' + ' + q.k + ' = <b>' + q.N + '</b> &nbsp;→&nbsp; □ = ' + q.t + ', △ = ' + q.u +
      ' &nbsp;→&nbsp; ' + wanted + ' = ' + q.ans;
  }
}
KIND.place = { draw:drawPlace, eq:eqPlace, why:whyPlace };
