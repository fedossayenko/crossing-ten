// Question kind 'rects': level 19 Правоъгълници — How many rectangles in the grid hold the ant.

// Задача 13: a rectangle holds the ant when its left edge is at or left of the ant's
// column and its right edge at or right of it — so the count is the choices each way.
// МБГ Зима 2021, 2023: a small grid, its squares against its other rectangles. A square is a
// rectangle too, so «all rectangles» holds the squares, and «not squares» leaves them out.
import { BGNUM, CM, KIND, SLOT, UKNUM, gridSvg, popAt, rnd, svgText, tr } from '../js/core.js';
function genRectsVsSq(){
  const [W, H] = [[2, 2], [2, 2], [3, 2], [3, 3]][rnd(4)];
  const all = W*(W + 1)/2 * H*(H + 1)/2, sizes = [];
  for(let k = 1; k <= Math.min(W, H); k++) sizes.push((W - k + 1)*(H - k + 1));
  const sq = sizes.reduce((a, b) => a + b, 0), other = all - sq;
  const asksAll = Math.random() < 0.4;                 // «rectangles» with the squares in, or «not squares»
  return {kind:'rects', shape:2, W, H, all, sizes, sq, other, asksAll, fewer: !asksAll && other < sq, ans: asksAll ? all - sq : Math.abs(other - sq)};
}
// МБГ Полуфинал 2025, 1 клас, задача 13: a strip of four squares, an ant in the first and in the fourth. The strip
// holds 4 + 3 + 2 + 1 = 10 rectangles; those with no ant lie inside the empty run between them (2 + 1 = 3): 7.
// A strip of 3 to 5 squares with 2 or 3 ants, and at least one square empty.
export function genRectsAnts(){
  for(;;){
    const n = 3 + rnd(3), k = 2 + rnd(2), ants = [];
    if(k >= n) continue;
    while(ants.length < k){ const c = 1 + rnd(n); if(!ants.includes(c)) ants.push(c); }
    ants.sort((x, y) => x - y);
    const runs = [];   // the runs of squares with no ant, left to right
    let run = 0;
    for(let c = 1; c <= n + 1; c++){ if(c <= n && !ants.includes(c)) run++; else { if(run) runs.push(run); run = 0; } }
    const all = n*(n + 1)/2, free = runs.reduce((t, m) => t + m*(m + 1)/2, 0);
    // the slips: every rectangle, ant or not; only the squares with an ant
    return {kind:'rects', shape:3, n, ants, runs, all, free, traps:[all, k], ans: all - free};
  }
}
// Level 257. МБГ Есен 2023, 3 клас, задача 11: «В колко правоъгълника е мравката?» — a grid 3 wide and 2 high, the ant in
// the top left square: 3 ways across times 2 up and down, 6. The 3rd grade gets grids up to 5 by 3 with the ant anywhere, so
// the two counts are multiplied; asked in the 3rd-grade paper's words, worked as level 19's ant. At most 24 of them, as
// on level 19, so the worked picture (every one drawn small) stays readable on a phone.
export function genRectsIn(){
  for(;;){
    const W = 3 + rnd(3), H = 2 + rnd(2), c = 1 + rnd(W), r = 1 + rnd(H), wide = c*(W - c + 1), tall = r*(H - r + 1);
    if(wide*tall > 24) continue;
    // the slip: the ways across and the ways up and down added, not multiplied
    return {kind:'rects', shape:4, W, H, c, r, wide, tall, traps: [wide + tall].filter(v => v !== wide*tall), ans: wide*tall};
  }
}
export function genRects(){
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
  if(q.shape === 4){
    return '<div class="ask">' + tr('В колко правоъгълника е мравката? (Квадратът е правоъгълник.)',
      'У скількох прямокутниках є мурашка? (Квадрат — це прямокутник.)') + '</div>' +
      gridSvg(q.W, q.H, q.c, q.r) + '<div class="line md">' + SLOT + '</div>';
  }
  if(q.shape === 3){
    return '<div class="ask">' + tr('Колко са всички правоъгълници на чертежа, в които има <b>поне една</b> мравка?',
      'Скільки всього на рисунку прямокутників, у яких є <b>хоча б одна</b> мурашка?') + '</div>' +
      gridSvg(q.n, 1, 0, 0, q.ants.map(c => [c, 1])) +
      '<div class="note">' + tr('Квадратът е правоъгълник, на който всички страни са равни.',
      'Квадрат — це прямокутник, у якого всі сторони рівні.') + '</div>' +
      '<div class="line md">' + SLOT + '</div>';
  }
  if(q.shape === 2){
    return '<div class="ask">' + (q.asksAll ? tr('С колко <b>правоъгълниците</b> на чертежа са повече от <b>квадратите</b>?', 'На скільки <b>прямокутників</b> на рисунку більше, ніж <b>квадратів</b>?')
      : tr('С колко правоъгълниците на чертежа, които <b>не са квадрати</b>, са ' + (q.fewer ? 'по-малко' : 'повече') + ' от <b>квадратите</b>?',
           'На скільки прямокутників на рисунку, які <b>не є квадратами</b>, ' + (q.fewer ? 'менше' : 'більше') + ', ніж <b>квадратів</b>?')) + '</div>' +
      gridSvg(q.W, q.H, 0, 0) +
      '<div class="line md">' + SLOT + '</div>';
  }
  if(q.shape === 1){
    return '<div class="ask">' + tr('Правоъгълникът с размери <span class="num">' + q.s +
      '</span> см и <span class="num">' + (q.n * q.s) + '</span> см е разделен на <b>' + BGNUM[q.n] +
      ' квадрата</b>. Колко сантиметра е сборът от обиколките на всички правоъгълници, които <b>' +
      (q.squares ? 'са квадрати' : 'не са квадрати') + '</b>?',
      'Прямокутник зі сторонами <span class="num">' + q.s + '</span> см і <span class="num">' + (q.n * q.s) +
      '</span> см поділено на <b>' + UKNUM[q.n] + ' квадрати</b>. Скільки сантиметрів становить сума периметрів усіх прямокутників, які <b>' +
      (q.squares ? 'є квадратами' : 'не є квадратами') + '</b>?') + '</div>' +
      gridSvg(q.n, 1, 0, 0) +
      '<div class="line md">' + SLOT + CM + '</div>';
  }
  return '<div class="ask">' + tr('Колко са всички правоъгълници на чертежа, в които има мравка?',
    'Скільки всього на рисунку прямокутників, у яких є мурашка?') + '</div>' +
    gridSvg(q.W, q.H, q.c, q.r) +
    '<div class="note">' + tr('Квадратът е правоъгълник, на който всички страни са равни.',
    'Квадрат — це прямокутник, у якого всі сторони рівні.') + '</div>' +
    '<div class="line md">' + SLOT + '</div>';
}
function eqRects(q){
  if(q.shape === 3) return tr('всички ', 'усіх ') + q.all + tr(', без мравка ', ', без мурашки ') + q.free + ' → ' + q.ans;
  if(q.shape === 2) return q.W + '×' + q.H + tr(': квадрати ', ': квадратів ') + q.sq + tr(', правоъгълници ', ', прямокутників ') + q.all + ' → ' + q.ans;
  return q.shape === 1
    ? q.s + '×' + (q.n*q.s) + ', ' + (q.squares ? tr('квадратите', 'лише квадрати') : tr('без квадратите', 'без квадратів')) + ' → ' + q.ans
    : q.W + '×' + q.H + tr(', мравката в ', ', мурашка в ') + q.c + '/' + q.r + ' → ' + q.ans;
}
// The ant's picture: every rectangle that holds her, each drawn small on its own copy of the grid.
// They stand in a table — a row for each way up and down, a column for each way across — so the
// count is the columns times the rows, and the table shows it.
function rectsAntSvg(q){
  const s = 9, tw = q.W * s, th = q.H * s, gx = 10, gy = 10, ext = (n, k) => { const out = []; for(let a = 1; a <= k; a++) for(let b = k; b <= n; b++) out.push([a, b]); return out; };
  const top = q.H - q.r + 1, across = ext(q.W, q.c), down = ext(q.H, top);   // r counts from the bottom, as gridSvg draws it
  let g = '', k = 0;
  down.forEach(([r1, r2], i) => across.forEach(([c1, c2], j) => {
    const x = j * (tw + gx), y = i * (th + gy);
    let cells = '';
    for(let a = 1; a < q.W; a++) cells += '<line x1="' + (x + a * s) + '" y1="' + y + '" x2="' + (x + a * s) + '" y2="' + (y + th) + '"/>';
    for(let b = 1; b < q.H; b++) cells += '<line x1="' + x + '" y1="' + (y + b * s) + '" x2="' + (x + tw) + '" y2="' + (y + b * s) + '"/>';
    g += '<g' + popAt(1 + k++ * 0.25) + '><rect x="' + x + '" y="' + y + '" width="' + tw + '" height="' + th + '" fill="none" stroke="var(--line)"/><g stroke="var(--line)" stroke-width=".6">' + cells + '</g>' +
      '<rect x="' + (x + (c1 - 1) * s) + '" y="' + (y + (r1 - 1) * s) + '" width="' + (c2 - c1 + 1) * s + '" height="' + (r2 - r1 + 1) * s + '" fill="rgba(47,111,143,.18)" stroke="var(--accent)" stroke-width="1.6"/>' +
      '<circle cx="' + (x + (q.c - 0.5) * s) + '" cy="' + (y + (top - 0.5) * s) + '" r="2.4" fill="var(--warm)"/></g>';
  }));
  const W = across.length * (tw + gx) - gx, H = down.length * (th + gy) - gy;
  g += svgText(W / 2, H + 22, q.wide + ' × ' + q.tall + ' = ' + q.ans, 15, 'var(--ink)', popAt(2 + k * 0.25));
  return '<svg viewBox="-4 -4 ' + (Math.max(W, 120) + 8) + ' ' + (H + 34) + '" style="display:block; width:' + Math.round((Math.max(W, 120) + 8) * 1.4) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('всички правоъгълници с мравката', 'усі прямокутники з мурашкою') + '">' + g + '</svg>';
}
// The ants' strip: every rectangle with an ant in it, each small on its own copy of the strip, a row for each
// length (one square, two, …), and the rows added up.
function rectsStripSvg(q){
  const s = 10, tw = q.n*s, gx = 8, gy = 10, rows = [];
  for(let L = 1; L <= q.n; L++){ const these = []; for(let i = 1; i + L - 1 <= q.n; i++) if(q.ants.some(c => c >= i && c < i + L)) these.push(i); rows.push(these); }
  let g = '', k = 0, W = 0;
  rows.forEach((these, j) => these.forEach((i, m) => {
    const x = m*(tw + gx), y = j*(s + gy);
    let cells = '';
    for(let a = 1; a < q.n; a++) cells += '<line x1="' + (x + a*s) + '" y1="' + y + '" x2="' + (x + a*s) + '" y2="' + (y + s) + '"/>';
    g += '<g' + popAt(1 + k++*0.25) + '><rect x="' + x + '" y="' + y + '" width="' + tw + '" height="' + s + '" fill="none" stroke="var(--line)"/><g stroke="var(--line)" stroke-width=".6">' + cells + '</g>' +
      '<rect x="' + (x + (i - 1)*s) + '" y="' + y + '" width="' + (j + 1)*s + '" height="' + s + '" fill="rgba(47,111,143,.18)" stroke="var(--accent)" stroke-width="1.6"/>' +
      q.ants.map(c => '<circle cx="' + (x + (c - 0.5)*s) + '" cy="' + (y + s/2) + '" r="2.2" fill="var(--warm)"/>').join('') + '</g>';
    W = Math.max(W, x + tw);
  }));
  const H = rows.length*(s + gy) - gy;
  g += svgText(Math.max(W, 120)/2, H + 22, rows.map(r => r.length).join(' + ') + ' = ' + q.ans, 15, 'var(--ink)', popAt(2 + k*0.25));
  return '<svg viewBox="-4 -4 ' + (Math.max(W, 120) + 8) + ' ' + (H + 34) + '" style="display:block; width:' + Math.round((Math.max(W, 120) + 8)*1.4) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('всички правоъгълници с мравка', 'усі прямокутники з мурашкою') + '">' + g + '</svg>';
}
// The strip of squares: every rectangle that counts, each on its own copy of the strip, a row for each length,
// its perimeter under it; the rows added up.
function rectsSumSvg(q){
  const s = q.n === 3 ? 20 : 15, tw = q.n*s, gx = 12, gy = 30;
  let g = '', k = 0, W = 0;
  q.parts.forEach(([L, count, per], j) => { for(let i = 1; i <= count; i++){
    const x = (i - 1)*(tw + gx), y = j*(s + gy);
    let cells = '';
    for(let a = 1; a < q.n; a++) cells += '<line x1="' + (x + a*s) + '" y1="' + y + '" x2="' + (x + a*s) + '" y2="' + (y + s) + '"/>';
    g += '<g' + popAt(1 + k++*0.4) + '><rect x="' + x + '" y="' + y + '" width="' + tw + '" height="' + s + '" fill="none" stroke="var(--muted)"/><g stroke="var(--muted)" stroke-width=".7">' + cells + '</g>' +
      '<rect x="' + (x + (i - 1)*s) + '" y="' + y + '" width="' + L*s + '" height="' + s + '" fill="rgba(47,111,143,.18)" stroke="var(--accent)" stroke-width="1.8"/>' +
      svgText(x + tw/2, y + s + 15, per, 12, 'var(--accent)') + '</g>';
    W = Math.max(W, x + tw);
  } });
  const H = q.parts.length*(s + gy) - gy + 18, VW = Math.max(W, 250);
  g += svgText(W/2, H + 20, q.parts.map(pt => Array(pt[1]).fill(pt[2]).join(' + ')).join(' + ') + ' = ' + q.ans, 15, 'var(--ink)', popAt(2 + k*0.4));
  return '<svg viewBox="' + (-(VW - W)/2 - 4) + ' -4 ' + (VW + 8) + ' ' + (H + 32) + '" style="display:block; width:' + Math.round((VW + 8)*1.1) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('правоъгълниците и обиколките им', 'прямокутники та їхні периметри') + '">' + g + '</svg>';
}
function whyRects(q, full){
  if(q.shape === 3){
    if(!full) return tr('Брой правоъгълниците от едно, две, три и повече квадратчета — само тези, в които има мравка.',
      'Рахуй прямокутники з одного, двох, трьох і більше квадратиків — лише ті, де є мурашка.');
    const down = []; for(let L = q.n; L >= 1; L--) down.push(L);
    return tr('всички правоъгълници: ', 'усі прямокутники: ') + down.join(' + ') + ' = <b>' + q.all + '</b>, ' + tr('без мравка: ', 'без мурашки: ') + '<b>' + q.free + '</b> &nbsp;→&nbsp; ' +
      q.all + ' − ' + q.free + ' = ' + q.ans + rectsStripSvg(q);
  }
  if(q.shape === 2){
    if(!full) return tr('Преброй поотделно квадратите — малки и големи — и всички правоъгълници. Квадратът също е правоъгълник.',
      'Порахуй окремо квадрати — малі й великі — і всі прямокутники. Квадрат теж прямокутник.');
    return tr('квадрати: ', 'квадратів: ') + q.sizes.join(' + ') + ' = <b>' + q.sq + '</b>; ' + tr('всички правоъгълници: <b>', 'усіх прямокутників: <b>') + q.all + '</b>' +
      (q.asksAll ? ' &nbsp;→&nbsp; ' + q.all + ' − ' + q.sq + ' = ' + q.ans
        : tr(', от тях не са квадрати ', ', з них не квадратів ') + q.all + ' − ' + q.sq + ' = <b>' + q.other + '</b> &nbsp;→&nbsp; ' + Math.max(q.sq, q.other) + ' − ' + Math.min(q.sq, q.other) + ' = ' + q.ans);
  }
  if(q.shape === 1){
    if(!full) return q.squares ? tr('Квадрати са само отделните квадратчета: две или повече заедно правят правоъгълник, който не е квадрат.',
      'Квадрати — лише окремі квадратики: два чи більше разом утворюють прямокутник, який не є квадратом.')
      : tr('Брой всички правоъгълници, не само квадратчетата поотделно.',
      'Рахуй усі прямокутники, а не лише окремі квадратики.');
    return q.parts.map(pt => pt[1] + tr(' на ширина ', ' завширшки ') + (pt[0]*q.s) + tr(' см, обиколка ', ' см, периметр ') + pt[2]).join('; &nbsp;') +
      ' &nbsp;→&nbsp; ' + q.parts.map(pt => Array(pt[1]).fill(pt[2]).join(' + ')).join(' + ') + ' = ' + q.ans + rectsSumSvg(q);
  }
  if(!full) return tr('Правоъгълникът може да е от едно или от повече квадратчета.',
    'Прямокутник може складатися з одного або з кількох квадратиків.');
  const rep = n => Array(n).fill(q.wide).join(' + ');
  return tr('по ширина <b>', 'по ширині <b>') + q.wide + tr('</b>, по височина <b>', '</b>, по висоті <b>') + q.tall + '</b> &nbsp;→&nbsp; ' +
    (q.tall <= 4 ? rep(q.tall) + ' = ' + q.ans : q.wide + ' × ' + q.tall + ' = ' + q.ans) + rectsAntSvg(q);
}
KIND.rects = { draw:drawRects, eq:eqRects, why:whyRects };
