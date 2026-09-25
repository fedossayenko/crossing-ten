// Question kind 'repadd': level 129 3 + 3 + 3 + 3 − 3 · 4 — Equal addends are a product: spot it and it cancels.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 2: 3 + 3 + 3 + 3 − 3 · 4 + 5 + 5 + 5 + 5 + 5 − 5 · 4. Four threes are 3 · 4,
// so the first part is 0; five fives less four fives leaves one five: 5.
// Задача 17: eight 2s = 1 + how many 3s? 16 = 1 + 15, and 15 is five 3s.
function genRepAdd(){
  if(Math.random() < 0.4){
    for(;;){
      const a = 2 + rnd(4), b = 2 + rnd(4), r = rnd(5), star = 2 + rnd(6), T = r + star*b;
      if(a === b || T % a || T / a < 3 || T / a > 10) continue;
      return {kind:'repadd', shape:1, a, n: T / a, r, b, T, traps:[T / a], ans: star};
    }
  }
  const x = 2 + rnd(8), k = 2 + rnd(4), y = 2 + rnd(8), m = 3 + rnd(4), m2 = m - 1 - rnd(2);
  if(x === y) return genRepAdd();
  return {kind:'repadd', shape:0, x, k, y, m, m2, ans: y*(m - m2)};
}
const repRun = (v, n) => Array(n).fill(v).join(' + ');
const repAddExpr = q => repRun(q.x, q.k) + ' − ' + q.x + ' · ' + q.k + ' + ' + repRun(q.y, q.m) + ' − ' + q.y + ' · ' + q.m2;
function drawRepAdd(q){
  if(q.kind === 'repadd' && q.shape === 1){
    const run = (v, n) => '<span style="white-space:nowrap"><span class="num">' + v + ' + ' + v + ' + … + ' + v + '</span> <small>(' + n + tr(' събираеми ', ' доданків ') + v + ')</small></span>';
    return '<div class="ask">' + tr('Кое число трябва да поставим вместо <span class="circle">*</span>, за да е вярно', 'Яке число треба поставити замість <span class="circle">*</span>, щоб було правильно') + '</div>' +
      '<div class="given">' + run(q.a, q.n) + '<br>= ' + (q.r ? q.r + ' + ' : '') + run(q.b, '*') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)"><span class="circle">*</span> = ' + SLOT + '</div>';
  }
  if(q.kind === 'repadd'){
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="line" style="font-size:clamp(20px,5.6vw,34px)"><span class="num">' + repAddExpr(q) + '</span> = ' + SLOT + '</div>';
  }
}
function eqRepAdd(q){
  if(q.kind === 'repadd' && q.shape === 1) return q.a + ' · ' + q.n + ' = ' + q.T + (q.r ? ', ' + q.T + ' − ' + q.r + ' = ' + (q.T - q.r) : '') + ', ' + (q.T - q.r) + ' : ' + q.b + ' = ' + q.ans;
  if(q.kind === 'repadd') return repAddExpr(q) + ' = ' + q.ans;
}
function whyRepAdd(q, full){
  if(q.kind === 'repadd' && q.shape === 1){
    if(!full) return tr('Колко е лявата страна? Колко от нея остава за еднаквите събираеми вдясно?', 'Скільки ліва частина? Потім: скільки лишається на однакові доданки справа?');
    return tr('вляво: ', 'зліва: ') + q.n + ' · ' + q.a + ' = <b>' + q.T + '</b>' + (q.r ? ' &nbsp;→&nbsp; ' + q.T + ' − ' + q.r + ' = <b>' + (q.T - q.r) + '</b>' : '') + ' &nbsp;→&nbsp; ' + (q.T - q.r) + ' : ' + q.b + ' = ' + q.ans;
  }
  if(q.kind === 'repadd'){
    if(!full) return tr('Няколко еднакви събираеми са произведение. Сравни всяка редица с произведението след нея.', 'Кілька однакових доданків — це добуток. Порівняй кожен ряд із добутком після нього.');
    return repRun(q.x, q.k) + ' = ' + q.x + ' · ' + q.k + ' &nbsp;→&nbsp; 0; &nbsp;' + repRun(q.y, q.m) + ' = ' + q.y + ' · ' + q.m + ' &nbsp;→&nbsp; ' + q.y + ' · ' + q.m + ' − ' + q.y + ' · ' + q.m2 + ' = ' + q.ans;
  }
}
KIND.repadd = { draw:drawRepAdd, eq:eqRepAdd, why:whyRepAdd };
