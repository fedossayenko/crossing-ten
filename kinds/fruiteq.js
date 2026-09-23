// Question kind 'fruiteq': level 29 Плодове — Three fruit, three totals — find one from the others.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const ic = t => '<svg class="ic" viewBox="-11 -14 22 26" aria-hidden="true">' + fruitBody(t) + '</svg>';

// Задача 9: three totals, three fruit. The third equation contains the first, which
// is the way in — no guessing, just substitution.
// Задача 20: four fruit in a square — two rows and two columns, each with its own total.
// Four facts for four unknowns, and only one set of values fits them all.
function genGrid(){
  for(;;){
    const f = shuffle(['a','p','l','g']);                // top-left, top-right, bottom-left, bottom-right
    const A = 3 + rnd(8), B = 3 + rnd(8), D = 1 + rnd(6), C = D + 1 + rnd(7);
    const v = [A, B, C, D];
    if(new Set(v).size !== 4) continue;                  // four different values, so no two fruit can be swapped
    const signs = [1].concat(shuffle([1, -1, -1]));      // the first term is never negative
    const ask = v.reduce((t, x, i) => t + signs[i]*x, 0);
    if(ask < 1) continue;
    return {kind:'fruiteq', grid:1, f, A, B, C, D, signs,
            R1: A + B, R2: C - D, C1: A + C, C2: B + D, ans: ask};
  }
}
function genFruitEq(){
  if(Math.random() < 0.35) return genGrid();
  for(;;){
    const f = shuffle(['a','p','l','g']).slice(0, 3);
    const a = 3 + rnd(8), b = 1 + rnd(8), c = 3 + rnd(9);
    if(a === b || a === c || b === c) continue;          // one value per fruit
    if(a + b > 18 || a + c > 18 || a + b + c > 26) continue;
    const pairs = [[0, 1, a - b], [2, 0, c - a], [2, 1, c - b]].filter(x => x[2] > 0);
    if(!pairs.length) continue;
    const askd = pairs[rnd(pairs.length)];
    return {kind:'fruiteq', f, a, b, c, s1: a + b, s2: a + c, s3: a + b + c,
            askd, ans: askd[2]};
  }
}

function drawFruiteq(q){
  if(q.kind === 'fruiteq' && q.grid){
    const F = q.f.map(ic);
    const head = F.map((g, i) => (i ? (q.signs[i] > 0 ? ' + ' : ' − ') : (q.signs[i] > 0 ? '' : '− ')) + g).join('');
    const cell = t => '<span>' + t + '</span>';
    const blank = cell('');
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="given">' + head + '</div>' +
      '<div class="ask">' + tr('ако', 'якщо') + '</div>' +
      '<div class="grid4">' +
        cell(F[0]) + cell('+') + cell(F[1]) + cell('=') + cell(q.R1) +
        cell('+') + blank + cell('+') + blank + blank +
        cell(F[2]) + cell('−') + cell(F[3]) + cell('=') + cell(q.R2) +
        cell('=') + blank + cell('=') + blank + blank +
        cell(q.C1) + blank + cell(q.C2) + blank + blank +
      '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + '</div>';
  }
  if(q.kind === 'fruiteq'){
    const F = q.f.map(ic);
    return '<div class="ask">' + tr('Пресметнете ', 'Обчисліть ') + F[q.askd[0]] + ' − ' + F[q.askd[1]] + tr(', ако:', ', якщо:') + '</div>' +
      '<div class="eqs"><span>' + F[1] + ' + ' + F[0] + ' = ' + q.s1 + '</span>' +
      '<span>' + F[0] + ' + ' + F[2] + ' = ' + q.s2 + '</span>' +
      '<span>' + F[2] + ' + ' + F[0] + ' + ' + F[1] + ' = ' + q.s3 + '</span></div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + '</div>';
  }
}
function eqFruiteq(q){
  if(q.kind === 'fruiteq' && q.grid) return [q.A, q.B, q.C, q.D].join(', ') + ' → ' + q.ans;
  if(q.kind === 'fruiteq') return q.s1 + ', ' + q.s2 + ', ' + q.s3 + ' → ' + q.ans;
}
function whyFruiteq(q, full){
  if(q.kind === 'fruiteq' && q.grid){
    if(!full) return tr('Двата стълба заедно съдържат всичките четири плода.', 'Два стовпці разом містять усі чотири фрукти.');
    const F = q.f.map(ic), v = [q.A, q.B, q.C, q.D];
    const both = q.C1 + q.C2, low = both - q.R1;
    const bits = v.map((x, i) => (i ? (q.signs[i] > 0 ? ' + ' : ' − ') : '') + x);
    return tr('двата стълба заедно: ', 'два стовпці разом: ') + q.C1 + ' + ' + q.C2 + ' = ' + both + tr(', а горният ред е ', ', а верхній рядок — ') + q.R1 +
      ' &nbsp;→&nbsp; ' + tr('долният ред заедно е ', 'нижній рядок разом — ') + both + ' − ' + q.R1 + ' = <b>' + low +
      '</b>' + tr(', а разликата му е ', ', а його різниця — ') + q.R2 + ' &nbsp;→&nbsp; ' + F[2] + ' = <b>' + q.C + '</b>, ' + F[3] +
      ' = <b>' + q.D + '</b> &nbsp;→&nbsp; ' + F[0] + ' = ' + q.C1 + ' − ' + q.C + ' = <b>' + q.A +
      '</b>, ' + F[1] + ' = ' + q.R1 + ' − ' + q.A + ' = <b>' + q.B + '</b> &nbsp;→&nbsp; ' +
      bits.join('') + ' = ' + q.ans;
  }
  if(q.kind === 'fruiteq'){
    if(!full) return tr('Третото равенство съдържа първото — започни оттам.', 'Третя рівність містить першу — почни звідти.');
    const F = q.f.map(ic);
    const v = [q.a, q.b, q.c];
    return F[2] + ' = ' + q.s3 + ' − ' + q.s1 + ' = <b>' + q.c + '</b> &nbsp;→&nbsp; ' +
      F[0] + ' = ' + q.s2 + ' − ' + q.c + ' = <b>' + q.a + '</b> &nbsp;→&nbsp; ' +
      F[1] + ' = ' + q.s1 + ' − ' + q.a + ' = <b>' + q.b + '</b> &nbsp;→&nbsp; ' +
      v[q.askd[0]] + ' − ' + v[q.askd[1]] + ' = ' + q.ans;
  }
}
KIND.fruiteq = { draw:drawFruiteq, eq:eqFruiteq, why:whyFruiteq };
