// Question kind 'rects': level 19 Правоъгълници — How many rectangles in the grid hold the ant.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 13: a rectangle holds the ant when its left edge is at or left of the ant's
// column and its right edge at or right of it — so the count is the choices each way.
// МБГ Зима 2021, 2023: a small grid, its squares against its other rectangles. A square is a
// rectangle too, so «all rectangles» holds the squares, and «not squares» leaves them out.
function genRectsVsSq(){
  const [W, H] = [[2, 2], [2, 2], [3, 2], [3, 3]][rnd(4)];
  const all = W*(W + 1)/2 * H*(H + 1)/2, sizes = [];
  for(let k = 1; k <= Math.min(W, H); k++) sizes.push((W - k + 1)*(H - k + 1));
  const sq = sizes.reduce((a, b) => a + b, 0), other = all - sq;
  const asksAll = Math.random() < 0.4;                 // «rectangles» with the squares in, or «not squares»
  return {kind:'rects', shape:2, W, H, all, sizes, sq, other, asksAll, fewer: !asksAll && other < sq, ans: asksAll ? all - sq : Math.abs(other - sq)};
}
function genRects(){
  if(Math.random() < 0.2) return genRectsVsSq();
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
  if(q.kind === 'rects' && q.shape === 2){
    return '<div class="ask">' + (q.asksAll ? tr('С колко <b>правоъгълниците</b> на чертежа са повече от <b>квадратите</b>?', 'На скільки <b>прямокутників</b> на рисунку більше, ніж <b>квадратів</b>?')
      : tr('С колко правоъгълниците на чертежа, които <b>не са квадрати</b>, са ' + (q.fewer ? 'по-малко' : 'повече') + ' от <b>квадратите</b>?',
           'На скільки прямокутників на рисунку, які <b>не є квадратами</b>, ' + (q.fewer ? 'менше' : 'більше') + ', ніж <b>квадратів</b>?')) + '</div>' +
      gridSvg(q.W, q.H, 0, 0) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + '</div>';
  }
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
  if(q.kind === 'rects' && q.shape === 2) return q.W + '×' + q.H + tr(': квадрати ', ': квадратів ') + q.sq + tr(', правоъгълници ', ', прямокутників ') + q.all + ' → ' + q.ans;
  if(q.kind === 'rects') return q.shape === 1
    ? q.s + '×' + (q.n*q.s) + ', ' + (q.squares ? tr('квадратите', 'лише квадрати') : tr('без квадратите', 'без квадратів')) + ' → ' + q.ans
    : q.W + '×' + q.H + tr(', мравката в ', ', мурашка в ') + q.c + '/' + q.r + ' → ' + q.ans;
}
function whyRects(q, full){
  if(q.kind === 'rects' && q.shape === 2){
    if(!full) return tr('Преброй поотделно квадратите — малки и големи — и всички правоъгълници. Квадратът също е правоъгълник.',
      'Порахуй окремо квадрати — малі й великі — і всі прямокутники. Квадрат теж прямокутник.');
    return tr('квадрати: ', 'квадратів: ') + q.sizes.join(' + ') + ' = <b>' + q.sq + '</b>; ' + tr('всички правоъгълници: <b>', 'усіх прямокутників: <b>') + q.all + '</b>' +
      (q.asksAll ? ' &nbsp;→&nbsp; ' + q.all + ' − ' + q.sq + ' = ' + q.ans
        : tr(', от тях не са квадрати ', ', з них не квадратів ') + q.all + ' − ' + q.sq + ' = <b>' + q.other + '</b> &nbsp;→&nbsp; ' + Math.max(q.sq, q.other) + ' − ' + Math.min(q.sq, q.other) + ' = ' + q.ans);
  }
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
