// Question kind 'rugs': level 364 Постелки — Rugs lie on a floor of square tiles and overlap: on how many tiles are there three.

// Кенгуру 2025, задача 10: 2 square and 2 rectangular rugs, 10 by 9 tiles; the tiles with three rugs on them are two where the
// top-left, the yellow and the dark rug meet and two where the yellow, the dark and the bottom rug meet: 4. The rugs are drawn
// see-through in four colours, so where three lie the colour is the darkest. The generator counts the tiles under three rugs
// itself, for every tile, and keeps layouts where no tile has four.
import { KIND, answerLine, rnd, svgFrame, tr } from '../js/core.js';
// [column, row, width, height] of each rug, left and top counted from 0: the printed layout
const PRINTED = [[3, 2, 5, 5], [2, 5, 4, 4], [1, 1, 5, 3], [4, 3, 5, 3]];
const COLS = ['var(--accent)', 'var(--warm)', 'var(--good)', 'var(--bad)'];
export function rugCovers(q){
  const out = [];
  for(let y = 0; y < q.H; y++) for(let x = 0; x < q.W; x++)
    out.push(q.rugs.filter(([rx, ry, w, h]) => x >= rx && x < rx + w && y >= ry && y < ry + h).length);
  return out;
}
export function genRugs(){
  if(rnd(6) === 0) return mk(10, 9, PRINTED);
  for(;;){
    const W = 8 + rnd(3), H = 7 + rnd(3), sizes = [[3 + rnd(3)], [3 + rnd(2)], [3 + rnd(3), 2 + rnd(2)], [3 + rnd(3), 2 + rnd(2)]];
    const rugs = sizes.map(([a, b], i) => {
      const w = a, h = i < 2 ? a : (b === a ? b + 1 : b);
      return [rnd(W - w + 1), rnd(H - h + 1), w, h];
    });
    const q = mk(W, H, rugs), c = rugCovers(q);
    if(Math.max(...c) <= 3 && q.ans >= 1 && q.ans <= 6) return q;
  }
}
function mk(W, H, rugs){
  const q = {kind:'rugs', W, H, rugs, ans: 0, traps:[]};
  const c = rugCovers(q);
  q.ans = c.filter(v => v === 3).length;
  q.traps = [c.filter(v => v === 2).length, c.filter(v => v >= 1).length].filter(v => v !== q.ans);
  return q;
}
function pic(q, mark){
  const u = 30, c = rugCovers(q);
  let g = '';
  for(let i = 0; i <= q.W; i++) g += '<line x1="' + i*u + '" y1="0" x2="' + i*u + '" y2="' + q.H*u + '"/>';
  for(let j = 0; j <= q.H; j++) g += '<line x1="0" y1="' + j*u + '" x2="' + q.W*u + '" y2="' + j*u + '"/>';
  let s = '<g stroke="var(--muted)" stroke-opacity=".6" stroke-width="1">' + g + '</g>';
  q.rugs.forEach(([x, y, w, h], i) => { s += '<rect x="' + x*u + '" y="' + y*u + '" width="' + w*u + '" height="' + h*u + '" fill="' + COLS[i] + '" fill-opacity=".38" stroke="' + COLS[i] + '" stroke-width="2.6"/>'; });
  if(mark) c.forEach((v, i) => { if(v === 3) s += '<rect x="' + ((i % q.W)*u + 3) + '" y="' + (Math.floor(i / q.W)*u + 3) + '" width="' + (u - 6) + '" height="' + (u - 6) + '" fill="none" stroke="var(--ink)" stroke-width="3"/>'; });
  return svgFrame('-3 -3 ' + (q.W*u + 6) + ' ' + (q.H*u + 6), Math.round(q.W*u*1.15), tr('под от квадратни плочки с четири застъпващи се постелки', 'підлога з квадратних плиток із чотирма килимками, що накладаються')) + s + '</svg>';
}
function drawRugs(q){
  return '<div class="ask">' + tr('Подът на баня е покрит с еднакви малки квадратни плочки. На пода са поставени 2 квадратни и 2 правоъгълни постелки, които се застъпват, както е показано. Върху колко от плочките има <b>по три</b> постелки?',
    'Підлогу ванної кімнати вкрито однаковими маленькими квадратними плитками. На підлозі лежать 2 квадратні й 2 прямокутні килимки, які накладаються, як показано. На скількох плитках лежить <b>по три</b> килимки?') + '</div>' + pic(q, false) + answerLine('md');
}
function eqRugs(q){
  return String(q.ans);
}
function whyRugs(q, full){
  if(!full) return tr('Търси плочките, върху които се застъпват три цвята — там цветът е най-тъмен. Брой само тях, не и онези с две постелки.', 'Шукай плитки, на яких накладаються три кольори — там колір найтемніший. Рахуй лише їх, а не ті, де лише два килимки.');
  return pic(q, true) + '<div style="text-align:center">' + tr('Плочките с по три постелки са обградени: ' + q.ans + '.', 'Плитки з трьома килимками обведено: ' + q.ans + '.') + '</div>';
}
KIND.rugs = { draw:drawRugs, eq:eqRugs, why:whyRugs };
