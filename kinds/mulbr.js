// Question kind 'mulbr': level 130 (11 − 10) · (11 − 9) — Brackets first, then multiply and divide.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 3: (11 − 10) · (11 − 9) · (11 − 8) − 1 · 2 · 3 — the brackets are 1, 2 and 3,
// so it is 1 · 2 · 3 − 1 · 2 · 3 = 0. Задача 4: (2 · 0 + 2 · 5) : (20 : 2 − 5) − 1 — anything times 0
// is 0, so 10 : 5 − 1 = 1.
function genMulBr(){
  if(Math.random() < 0.5){
    for(;;){
      const n = 10 + rnd(11), v = [1 + rnd(3), 2 + rnd(2), 3 + rnd(2)], w = v.slice();
      if(Math.random() < 0.5) w[rnd(3)] -= 1;
      const P = v[0]*v[1]*v[2], p = w[0]*w[1]*w[2];
      if(p < 1 || P - p < 0) continue;
      return {kind:'mulbr', shape:0, n, v, w, P, p, traps:[P], ans: P - p};
    }
  }
  for(;;){
    const a = 2 + rnd(4), b = 2 + rnd(8), X = a*b, ds = [2, 3, 4, 5].filter(d => X % d === 0), D = ds[rnd(ds.length)];
    if(!D) continue;
    const d = 1 + rnd(5), c = a*(D + d), e = rnd(X / D);
    if(c > 60) continue;
    return {kind:'mulbr', shape:1, a, b, X, D, c, d, e, traps:[X / D + a - e], ans: X / D - e};
  }
}
const mulBrExpr = q => q.shape === 0 ? q.v.map(x => '(' + q.n + ' − ' + (q.n - x) + ')').join(' · ') + ' − ' + q.w.join(' · ')
  : '(' + q.a + ' · 0 + ' + q.a + ' · ' + q.b + ') : (' + q.c + ' : ' + q.a + ' − ' + q.d + ') − ' + q.e;
const mulBrParts = q => { const e = mulBrExpr(q), k = e.lastIndexOf(' − '); return [e.slice(0, k), e.slice(k + 1)]; };
function drawMulBr(q){
  if(q.kind === 'mulbr'){
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="line" style="font-size:clamp(17px,4.8vw,30px)">' + mulBrParts(q).map((t, i) => '<span class="num" style="white-space:nowrap">' + t + (i ? ' = ' + SLOT : '') + '</span>').join(' ') + '</div>';
  }
}
function eqMulBr(q){
  if(q.kind === 'mulbr') return mulBrExpr(q) + ' = ' + q.ans;
}
function whyMulBr(q, full){
  if(q.kind === 'mulbr'){
    if(!full) return q.shape === 0 ? tr('Първо скобите. После виж кое произведение се вади.', 'Спершу дужки. Потім подивись, який добуток віднімають.')
      : tr('Скобите първо, а в тях — умножението и делението преди събирането и изваждането. По 0 е 0.', 'Спершу дужки, а в них — множення й ділення раніше за додавання й віднімання. На 0 — це 0.');
    if(q.shape === 0) return tr('скобите са ', 'дужки: ') + q.v.join(', ') + ' &nbsp;→&nbsp; ' + q.v.join(' · ') + ' = <b>' + q.P + '</b>, ' + q.w.join(' · ') + ' = <b>' + q.p + '</b> &nbsp;→&nbsp; ' + q.P + ' − ' + q.p + ' = ' + q.ans;
    return q.a + ' · 0 + ' + q.a + ' · ' + q.b + ' = 0 + ' + q.X + ' = <b>' + q.X + '</b>, ' + q.c + ' : ' + q.a + ' − ' + q.d + ' = ' + q.c / q.a + ' − ' + q.d + ' = <b>' + q.D + '</b> &nbsp;→&nbsp; ' + q.X + ' : ' + q.D + ' − ' + q.e + ' = ' + q.ans;
  }
}
KIND.mulbr = { draw:drawMulBr, eq:eqMulBr, why:whyMulBr };
