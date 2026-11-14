// Question kind 'gridcost': level 352 Евтин маршрут — A board of white and grey squares, a step costs by the colour it lands on: the cheapest way across.

// Кенгуру 2024, 2 клас, задача 22: a board of white and grey squares, only right or up from the bottom left square to the top right
// one; a step onto white costs 2 leva, onto grey 1 leva (the square she starts on is paid for too). The cheapest
// way costs 13. Every way has the same number of steps, so only the colours of the squares it lands on matter; the picture's grey
// squares are drawn at random, 3–4 rows and 4–5 columns, white costing 2 or 3. The answer is typed.
import { KIND, answerLine, popAt, rnd, svgFrame, svgText, tr } from '../js/core.js';
const U = 38;
// the cheapest cost from the bottom left square (R − 1, 0) to every square, moving up or right; grey: a set of 'r,c'
export function gridBest(R, C, grey, wc, gc){
  /** @type {number[][]} */
  const b = [];
  for(let r = R - 1; r >= 0; r--){
    b[r] = [];
    for(let c = 0; c < C; c++){
      const own = grey.has(r + ',' + c) ? gc : wc;
      const from = [r < R - 1 ? b[r + 1][c] : Infinity, c ? b[r][c - 1] : Infinity].reduce((m, v) => Math.min(m, v));
      b[r][c] = r === R - 1 && c === 0 ? own : from + own;   // the starting square is paid for too: 13 in the paper
    }
  }
  return b;
}
const greySet = q => new Set(q.grey.map(([r, c]) => r + ',' + c));
export const gridCostOf = q => gridBest(q.R, q.C, greySet(q), q.wc, q.gc)[0][q.C - 1];
// one cheapest way, from the bottom left to the top right, as the squares it steps onto
function cheapestWay(q){
  const g = greySet(q), b = gridBest(q.R, q.C, g, q.wc, q.gc), way = [];
  let r = 0, c = q.C - 1;
  while(r !== q.R - 1 || c !== 0){
    way.unshift([r, c]);
    const own = g.has(r + ',' + c) ? q.gc : q.wc, down = r < q.R - 1 && b[r + 1][c] + own === b[r][c];
    if(down) r++; else c--;
  }
  way.unshift([r, c]);
  return way;
}
export function genGridCost(){
  for(;;){
    const R = 3 + rnd(2), C = 4 + rnd(2), wc = 2 + rnd(2), grey = [];
    for(let r = 0; r < R; r++) for(let c = 0; c < C; c++) if((r !== R - 1 || c !== 0) && (r !== 0 || c !== C - 1) && rnd(100) < 38) grey.push([r, c]);
    const q = {kind:'gridcost', R, C, grey, wc, gc:1, traps:[], ans: 0}, steps = R + C - 1;   // the squares on a way, the first too
    q.ans = gridCostOf(q);
    // greedy: always onto a grey square when there is one next, else to the right
    let r = R - 1, c = 0, greedy = wc;
    const g = greySet(q);
    while(r || c < C - 1){
      const up = r > 0, right = c < C - 1;
      if(up && (!right || g.has((r - 1) + ',' + c) || !g.has(r + ',' + (c + 1)) && rnd(2) === 0)) r--; else c++;
      greedy += g.has(r + ',' + c) ? 1 : wc;
    }
    if(q.ans >= steps * wc || q.ans <= steps) continue;   // some saving, and no free ride
    q.traps = [steps * wc, greedy].filter((v, i, a) => v !== q.ans && a.indexOf(v) === i);
    return q;
  }
}
// the board: white squares and grey ones, the way in colour when there is one, a small key of the two prices
function board(q, way){
  const W = Math.max(q.C * U + 44, 200), x0 = (W - q.C * U) / 2, g = greySet(q), H = q.R * U + 8, key = H + 6;
  let s = '';
  for(let r = 0; r < q.R; r++) for(let c = 0; c < q.C; c++)
    s += '<rect x="' + (x0 + c * U) + '" y="' + (4 + r * U) + '" width="' + U + '" height="' + U + '" fill="' + (g.has(r + ',' + c) ? 'var(--fur)' : 'var(--paper)') + '" stroke="var(--fur-dark)" stroke-width="1.8"/>';
  s += svgText(x0 - 11, 4 + (q.R - 1) * U + U / 2 + 5, 'А', 16, 'var(--ink)') + svgText(x0 + q.C * U + 11, 4 + U / 2 + 5, 'В', 16, 'var(--ink)');
  if(way){
    const pts = way.map(([r, c]) => (x0 + c * U + U / 2) + ',' + (4 + r * U + U / 2));
    s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="var(--warm)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>';
    way.forEach(([r, c], i) => { s += '<g' + popAt(1 + i * 0.6) + '><circle cx="' + (x0 + c * U + U / 2) + '" cy="' + (4 + r * U + U / 2) + '" r="10" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="2"/>' +
      svgText(x0 + c * U + U / 2, 4 + r * U + U / 2 + 5, g.has(r + ',' + c) ? q.gc : q.wc, 14, 'var(--ink)') + '</g>'; });
  }
  s += '<rect x="' + (W / 2 - 62) + '" y="' + (key - 1) + '" width="16" height="16" fill="var(--paper)" stroke="var(--fur-dark)" stroke-width="1.8"/>' + svgText(W / 2 - 24, key + 12, '= ' + q.wc, 14, 'var(--ink)') +
    '<rect x="' + (W / 2 + 6) + '" y="' + (key - 1) + '" width="16" height="16" fill="var(--fur)" stroke="var(--ink)" stroke-width="1.8"/>' + svgText(W / 2 + 44, key + 12, '= ' + q.gc, 14, 'var(--ink)');
  return svgFrame('0 0 ' + W + ' ' + (H + 26), W, tr('дъска от бели и сиви квадратчета', 'дошка з білих і сірих клітинок')) + s + '</svg>';
}
function drawGridCost(q){
  const lv = n => n === 2 ? tr('2 лева', '2 леви') : tr('3 лева', '3 леви');
  return '<div class="ask">' + tr('Дъската по-долу е съставена от бели и сиви квадратчета. Разрешено е преминаване вдясно или нагоре от едно квадратче в съседно, което има обща страна с него. Стъпването в бяло квадратче струва ' + lv(q.wc) + ', а стъпването в сиво — съответно 1 лев. Колко лева струва най-евтиният маршрут от квадратчето А долу вляво до квадратчето В горе вдясно?',
    'Дошка нижче складається з білих і сірих клітинок. Дозволено переходити праворуч або вгору з однієї клітинки в сусідню, що має з нею спільну сторону. Крок на білу клітинку коштує ' + lv(q.wc) + ', а крок на сіру — відповідно 1 лев. Скільки левів коштує найдешевший маршрут від клітинки А внизу ліворуч до клітинки В угорі праворуч?') + '</div>' +
    '<div class="fig maze">' + board(q, null) + '</div>' + answerLine('xl');
}
const wayText = q => cheapestWay(q).map(([r, c]) => greySet(q).has(r + ',' + c) ? q.gc : q.wc).join(' + ') + ' = ' + q.ans;
function whyGridCost(q, full){
  if(!full) return tr('Всеки маршрут има една и съща дължина, така че броят на стъпките е еднакъв. Важи кои квадратчета са сиви. Плаща се и за квадратчето А, от което тръгваш. Опитай да минеш през колкото може повече сиви.',
    'Кожен маршрут має однакову довжину, тож кроків однаково. Важливо, які клітинки сірі. За клітинку А, з якої починаєш, теж платять. Спробуй пройти через якомога більше сірих.') + '<div class="fig maze">' + board(q, null) + '</div>';
  return tr('един от най-евтините маршрути, с цената на всяко квадратче, и първото се плаща: ', 'один із найдешевших маршрутів, із вартістю кожної клітинки, і першу теж оплачують: ') + board(q, cheapestWay(q)) + '<div><b>' + wayText(q) + '</b></div>';
}
KIND.gridcost = { draw:drawGridCost, eq:wayText, why:whyGridCost };
