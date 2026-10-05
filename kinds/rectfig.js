// Question kind 'rectfig': level 162 Колко правоъгълника? — Every rectangle in a figure made of pieces.

// МБГ Пролет 2023, 1 клас, задача 12: three squares in a row make 6 rectangles (3 small, 2 of
// two, 1 of three). Then three tall pieces, the last cut in two: 4 single pieces, and 4 made of
// more — 8. Пролет 2025, задача 13: two rows of 3 squares, the lower one moved a square to the
// right: 6 in each row, and 3 more standing across both rows where they overlap — 15.
// A figure is its pieces, [x, y, width, height] on a grid; a rectangle counts when it is exactly
// some of the pieces put together, none of them cut by its border.
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
function rectFigAll(tiles){
  const xs = [...new Set(tiles.flatMap(t => [t[0], t[0] + t[2]]))].sort((a, b) => a - b);
  const ys = [...new Set(tiles.flatMap(t => [t[1], t[1] + t[3]]))].sort((a, b) => a - b), out = [];
  for(let i = 0; i < xs.length; i++) for(let j = i + 1; j < xs.length; j++) for(let k = 0; k < ys.length; k++) for(let l = k + 1; l < ys.length; l++){
    const [x1, x2, y1, y2] = [xs[i], xs[j], ys[k], ys[l]];
    let area = 0, cut = false;
    const ins = [];
    tiles.forEach((t, n) => {
      const ox = Math.min(x2, t[0] + t[2]) - Math.max(x1, t[0]), oy = Math.min(y2, t[1] + t[3]) - Math.max(y1, t[1]);
      if(ox <= 0 || oy <= 0) return;
      if(ox !== t[2] || oy !== t[3]) cut = true;
      area += t[2]*t[3]; ins.push(n);
    });
    if(!cut && area === (x2 - x1)*(y2 - y1)) out.push({x1, x2, y1, y2, n: ins.length});
  }
  return out;
}
export function genRectFig(){
  for(;;){
    let tiles = [];
    const rows = Math.random() < 0.5;
    if(rows){
      // two rows of squares, the lower one moved to the right but still under the upper one
      const a = 2 + rnd(3), b = 2 + rnd(3), off = 1 + rnd(a - 1);
      for(let i = 0; i < a; i++) tiles.push([i, 0, 1, 1]);
      for(let i = 0; i < b; i++) tiles.push([off + i, 1, 1, 1]);
    } else {
      // tall pieces in a row, some of them cut across in two
      const k = 2 + rnd(3), cut = Array.from({length: k}, () => Math.random() < 0.4);
      if(!cut.some(c => c)) cut[k - 1] = true;
      if(cut.every(c => c)) continue;          // all cut is a plain grid of squares
      cut.forEach((c, i) => { if(c) tiles.push([i, 0, 1, 1], [i, 1, 1, 1]); else tiles.push([i, 0, 1, 2]); });
    }
    const all = rectFigAll(tiles);
    if(all.length < 5 || all.length > 24) continue;
    return {kind:'rectfig', shape: rows ? 'rows' : 'cols', tiles, traps:[tiles.length], ans: all.length};
  }
}
// One figure drawn with unit u at (x0, y0); dots at the corners for the paper's 'rows' figures,
// and a rectangle to highlight on top.
function rectFigDraw(tiles, u, x0, y0, dots, hi, sw){
  let g = tiles.map(t => '<rect x="' + (x0 + t[0]*u) + '" y="' + (y0 + t[1]*u) + '" width="' + t[2]*u + '" height="' + t[3]*u + '" fill="none" stroke="var(--ink)" stroke-width="' + sw + '"/>').join('');
  if(dots){
    const seen = {};
    tiles.forEach(t => [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j]) => { const k = (t[0] + i*t[2]) + ',' + (t[1] + j*t[3]); if(seen[k]) return; seen[k] = 1;
      g += '<circle cx="' + (x0 + (t[0] + i*t[2])*u) + '" cy="' + (y0 + (t[1] + j*t[3])*u) + '" r="' + (sw*1.6).toFixed(1) + '" fill="var(--ink)"/>'; }));
  }
  if(hi) g += '<rect x="' + (x0 + hi.x1*u) + '" y="' + (y0 + hi.y1*u) + '" width="' + (hi.x2 - hi.x1)*u + '" height="' + (hi.y2 - hi.y1)*u + '" fill="rgba(47,111,143,.2)" stroke="var(--accent)" stroke-width="' + (sw*1.6).toFixed(1) + '"/>';
  return g;
}
const rectFigSize = tiles => [Math.max(...tiles.map(t => t[0] + t[2])), Math.max(...tiles.map(t => t[1] + t[3]))];
function rectFigSvg(tiles, dots, label){
  const [w, h] = rectFigSize(tiles), u = 40;
  return '<svg viewBox="-4 -4 ' + (w*u + 8) + ' ' + (h*u + 8) + '" style="display:block; width:' + (w*u + 8) + 'px; max-width:100%; margin:4px auto" role="img" aria-label="' + label + '">' +
    rectFigDraw(tiles, u, 0, 0, dots, null, 1.8) + '</svg>';
}
// The solution: every rectangle, each small on its own copy of the figure, a row for each size
// (made of one piece, of two, …), and the rows added up.
function rectFigSolSvg(q){
  const all = rectFigAll(q.tiles), [w, h] = rectFigSize(q.tiles), s = 10, tw = w*s, th = h*s, gx = 10, gy = 12, per = Math.max(1, Math.floor(310 / (tw + gx)));
  const groups = [...new Set(all.map(r => r.n))].sort((a, b) => a - b);
  let g = '', y = 0, k = 0, W = 0;
  groups.forEach(n => {
    const these = all.filter(r => r.n === n);
    these.forEach((r, i) => {
      const x = (i % per)*(tw + gx), yy = y + Math.floor(i / per)*(th + gy);
      g += '<g' + popAt(1 + k++*0.2) + '>' + rectFigDraw(q.tiles, s, x, yy, false, r, 0.8) + '</g>';
      W = Math.max(W, x + tw);
    });
    y += Math.ceil(these.length / per)*(th + gy) + 4;
  });
  const foot = groups.map(n => all.filter(r => r.n === n).length).join(' + ') + ' = ' + q.ans;
  g += svgText(Math.max(W, 120)/2, y + 14, groups.length > 1 ? foot : String(q.ans), 15, 'var(--ink)', popAt(2 + k*0.2));
  return '<svg viewBox="-4 -4 ' + (Math.max(W, 120) + 8) + ' ' + (y + 26) + '" style="display:block; width:' + Math.round((Math.max(W, 120) + 8)*1.4) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('всички правоъгълници на картинката', 'усі прямокутники на малюнку') + '">' + g + '</svg>';
}
function drawRectFig(q){
  const ex = [[0, 0, 1, 1], [1, 0, 1, 1], [2, 0, 1, 1]], dots = q.shape === 'rows';
  const fig = tr('фигура от части', 'фігура з частин');
  return dots
    ? '<div class="ask">' + tr('Тук правоъгълниците са <span class="num">6</span>.', 'Тут прямокутників <span class="num">6</span>.') + '</div>' +
      '<div class="fig small">' + rectFigSvg(ex, true, fig) + '</div>' +
      '<div class="ask">' + tr('Колко са правоъгълниците тук?', 'Скільки тут прямокутників?') + '</div>' +
      '<div class="fig">' + rectFigSvg(q.tiles, true, fig) + '</div>' +
      '<div class="line lg">' + SLOT + '</div>'
    : '<div class="ask">' + tr('На тази картинка има <span class="num">6</span> правоъгълника:', 'На цьому малюнку <span class="num">6</span> прямокутників:') + '</div>' +
      '<div class="fig small">' + rectFigSvg(ex, false, fig) + '</div>' +
      '<div class="ask">' + tr('Колко са правоъгълниците на тази картинка?', 'Скільки прямокутників на цьому малюнку?') + '</div>' +
      '<div class="fig">' + rectFigSvg(q.tiles, false, fig) + '</div>' +
      '<div class="line lg">' + SLOT + '</div>';
}
function eqRectFig(q){
  const all = rectFigAll(q.tiles), ns = [...new Set(all.map(r => r.n))].sort((a, b) => a - b);
  return ns.map(n => all.filter(r => r.n === n).length).join(' + ') + ' = ' + q.ans;
}
function whyRectFig(q, full){
  if(!full) return tr('Брой не само отделните части, а и правоъгълниците от две, три и повече части заедно.',
    'Рахуй не лише окремі частини, а й прямокутники з двох, трьох і більше частин разом.');
  const all = rectFigAll(q.tiles), ns = [...new Set(all.map(r => r.n))].sort((a, b) => a - b);
  const nm = n => tr(['', 'от една част', 'от две части', 'от три части', 'от четири части', 'от пет части', 'от шест части', 'от седем части', 'от осем части'][n],
    ['', 'з однієї частини', 'з двох частин', 'з трьох частин', 'з чотирьох частин', 'з п’яти частин', 'з шести частин', 'з семи частин', 'з восьми частин'][n]);
  return ns.map(n => nm(n) + ': <b>' + all.filter(r => r.n === n).length + '</b>').join(', ') + rectFigSolSvg(q);
}
KIND.rectfig = { draw:drawRectFig, eq:eqRectFig, why:whyRectFig };
