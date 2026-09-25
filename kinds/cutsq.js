// Question kind 'cutsq': level 137 Квадратчета от лист — How many small squares can be cut from a sheet.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 12: squares of side 4 см cut from a square of side 20 см: 5 along each side,
// 5 rows of 5, 25. On a rectangle whose sides do not divide exactly, the leftover strip is wasted.
function genCutSq(){
  for(;;){
    const s = 2 + rnd(4), sq = Math.random() < 0.5, exact = Math.random() < 0.7;
    const m = 2 + rnd(5), n = sq ? m : 2 + rnd(5);
    const a = m*s + (exact ? 0 : rnd(s)), b = n*s + (exact || sq ? 0 : rnd(s));
    if(sq && !exact && a === m*s) continue;
    const W = a, H = sq ? a : b, ans = Math.floor(W / s)*Math.floor(H / s);
    if(W > 40 || H > 40) continue;
    return {kind:'cutsq', s, sq, W, H, traps: Number.isInteger(W*H / (s*s)) ? [] : [Math.round(W*H / (s*s))], ans};
  }
}
function drawCutSq(q){
  if(q.kind === 'cutsq'){
    const from = q.sq ? tr('квадрат със страна <span class="num">' + q.W + '</span> см', 'квадрата зі стороною <span class="num">' + q.W + '</span> см')
                      : tr('правоъгълник със страни <span class="num">' + q.W + '</span> см и <span class="num">' + q.H + '</span> см', 'прямокутника зі сторонами <span class="num">' + q.W + '</span> см і <span class="num">' + q.H + '</span> см');
    return '<div class="ask">' + tr('Колко <b>най-много</b> квадратчета със страна <span class="num">' + q.s + '</span> см можем да изрежем от ' + from + '?',
      'Скільки <b>найбільше</b> квадратиків зі стороною <span class="num">' + q.s + '</span> см можна вирізати з ' + from + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCutSq(q){
  if(q.kind === 'cutsq') return Math.floor(q.W / q.s) + ' · ' + Math.floor(q.H / q.s) + ' = ' + q.ans;
}
function whyCutSq(q, full){
  if(q.kind === 'cutsq'){
    if(!full) return tr('Колко квадратчета се нареждат по едната страна — и колко такива реда се побират?', 'Скільки квадратиків уміститься вздовж однієї сторони — і скільки таких рядів?');
    const a = Math.floor(q.W / q.s), b = Math.floor(q.H / q.s);
    return tr('по едната страна: ', 'уздовж однієї сторони: ') + q.W + ' : ' + q.s + ' → <b>' + a + '</b>' + (q.W % q.s ? tr(' (остава ивица)', ' (лишається смужка)') : '') + ', ' + tr('по другата: ', 'уздовж другої: ') + q.H + ' : ' + q.s + ' → <b>' + b + '</b>' + (q.H % q.s ? tr(' (остава ивица)', ' (лишається смужка)') : '') + ' &nbsp;→&nbsp; ' + a + ' · ' + b + ' = ' + q.ans;
  }
}
KIND.cutsq = { draw:drawCutSq, eq:eqCutSq, why:whyCutSq };
