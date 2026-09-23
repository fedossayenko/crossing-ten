// Question kind 'rects': level 19 Правоъгълници — How many rectangles in the grid hold the ant.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 13: a rectangle holds the ant when its left edge is at or left of the ant's
// column and its right edge at or right of it — so the count is the choices each way.
function genRects(){
  if(Math.random() < 0.32){
    // Задача 14: a strip of equal squares. Every sub-rectangle counts — the square ones
    // are the ones to leave out.
    // kept near the original's 3 by 9: four squares only with the smallest side, or the
    // perimeters add up to well over a hundred
    const n = Math.random() < 0.75 ? 3 : 4;
    const s = n === 3 ? 2 + rnd(5) : 2;
    const squares = Math.random() < 0.3;
    let sum = 0;
    const parts = [];
    for(let k = 1; k <= n; k++){
      if(squares ? k !== 1 : k === 1) continue;
      const count = n - k + 1, per = 2*(s + k*s);
      sum += count * per;
      parts.push([k, count, per]);
    }
    return {kind:'rects', shape:1, n, s, squares, parts, ans: sum};
  }
  const W = 2 + rnd(3), H = 2 + rnd(2);
  const c = 1 + rnd(W), r = 1 + rnd(H);
  return {kind:'rects', shape:0, W, H, c, r, wide: c*(W-c+1), tall: r*(H-r+1), ans: c*(W-c+1)*r*(H-r+1)};
}

function drawRects(q){
  if(q.kind === 'rects' && q.shape === 1){
    return '<div class="ask">' + tr('Правоъгълникът с размери <span class="num">' + q.s +
      '</span> см и <span class="num">' + (q.n * q.s) + '</span> см е разделен на <b>' + BGNUM[q.n] +
      ' квадрата</b>. Колко сантиметра е сборът от обиколките на всички правоъгълници, които <b>' +
      (q.squares ? 'са квадрати' : 'не са квадрати') + '</b>?',
      'Прямокутник зі сторонами <span class="num">' + q.s + '</span> см і <span class="num">' + (q.n * q.s) +
      '</span> см поділено на <b>' + UKNUM[q.n] + ' квадрати</b>. Скільки сантиметрів становить сума периметрів усіх прямокутників, які <b>' +
      (q.squares ? 'є квадратами' : 'не є квадратами') + '</b>?') + '</div>' +
      gridSvg(q.n, 1, 0, 0) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'rects'){
    return '<div class="ask">' + tr('Колко са всички правоъгълници на чертежа, в които има мравка?',
      'Скільки всього на рисунку прямокутників, у яких є мурашка?') + '</div>' +
      gridSvg(q.W, q.H, q.c, q.r) +
      '<div class="note">' + tr('Квадратът е правоъгълник, на който всички страни са равни.',
      'Квадрат — це прямокутник, у якого всі сторони рівні.') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + '</div>';
  }
}
function eqRects(q){
  if(q.kind === 'rects') return q.shape === 1
    ? q.s + '×' + (q.n*q.s) + ', ' + (q.squares ? tr('квадратите', 'лише квадрати') : tr('без квадратите', 'без квадратів')) + ' → ' + q.ans
    : q.W + '×' + q.H + tr(', мравката в ', ', мурашка в ') + q.c + '/' + q.r + ' → ' + q.ans;
}
function whyRects(q, full){
  if(q.kind === 'rects' && q.shape === 1){
    if(!full) return tr('Брой всички правоъгълници, не само квадратчетата поотделно.',
      'Рахуй усі прямокутники, а не лише окремі квадратики.');
    return q.parts.map(pt => pt[1] + tr(' на ширина ', ' завширшки ') + (pt[0]*q.s) + tr(' см, обиколка ', ' см, периметр ') + pt[2]).join('; &nbsp;') +
      ' &nbsp;→&nbsp; ' + q.parts.map(pt => Array(pt[1]).fill(pt[2]).join(' + ')).join(' + ') + ' = ' + q.ans;
  }
  if(q.kind === 'rects'){
    if(!full) return tr('Правоъгълникът може да е от едно или от повече квадратчета.',
      'Прямокутник може складатися з одного або з кількох квадратиків.');
    const rep = n => Array(n).fill(q.wide).join(' + ');
    return tr('по ширина <b>', 'по ширині <b>') + q.wide + tr('</b>, по височина <b>', '</b>, по висоті <b>') + q.tall + '</b> &nbsp;→&nbsp; ' +
      (q.tall <= 4 ? rep(q.tall) + ' = ' + q.ans : q.wide + ' × ' + q.tall + ' = ' + q.ans);
  }
}
KIND.rects = { draw:drawRects, eq:eqRects, why:whyRects };
