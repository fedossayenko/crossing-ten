// Question kind 'zigzag': level 213 Начупените линии — Lines down a grid of 1 см squares: how long is the shortest.
// Generator, drawing, summary line and hints for this kind all live here; the level itself (difficulty, group,
// prerequisites) is its row in js/levels.js.

// МБГ Полуфинал 2025, 1 клас, задача 15: a grid of 1 см squares, 25 wide and 9 high, and five thick lines, each
// from the top edge to the bottom one in its own five columns. Every line goes down 9 in all, so only the
// sideways parts differ: 6, 5, 8, 8 and 7 — the shortest is 9 + 5 = 14.
// A line is its runs, [down, sideways] (sideways negative to the left, the last one 0), from the grid line x;
// every sideways run has a run down before and after it, so a line never comes back to meet itself.
import { CM, KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
const zigSide = ln => ln.segs.reduce((t, s) => t + Math.abs(s[1]), 0);
export function genZigzag(){
  for(;;){
    const k = 4 + rnd(2), V = 8 + rnd(3), lines = [];
    for(let i = 0; i < k; i++){
      for(;;){
        const m = 3 + rnd(3), downs = Array(m + 1).fill(1);
        for(let j = m + 1; j < V; j++) downs[rnd(m + 1)]++;       // V down in all, each run at least 1
        const sides = Array.from({length: m}, () => (1 + rnd(3))*(Math.random() < 0.5 ? -1 : 1));
        let x = 0, lo = 0, hi = 0;
        sides.forEach(s => { x += s; lo = Math.min(lo, x); hi = Math.max(hi, x); });
        if(hi - lo > 3) continue;                                  // it stays inside its own five columns
        lines.push({x: 5*i + 1 - lo, segs: downs.map((d, j) => [d, j < m ? sides[j] : 0])});
        break;
      }
    }
    const lens = lines.map(ln => V + zigSide(ln)), best = Math.min(...lens);
    if(lens.filter(v => v === best).length > 1) continue;          // one line is the shortest
    // the slips: only the way down, or the longest line
    return {kind:'zigzag', V, lines, lens, traps:[V, Math.max(...lens)], ans: best};
  }
}
// The grid and the lines; full colours each line's way down and its sideways parts apart, writes its
// length under it, and marks the shortest.
function zigSvg(q, full){
  const W = 5*q.lines.length, u = 12, foot = full ? 34 : 0;
  let g = '';
  for(let i = 0; i <= W; i++) g += '<line x1="' + i*u + '" y1="0" x2="' + i*u + '" y2="' + q.V*u + '"/>';
  for(let j = 0; j <= q.V; j++) g += '<line x1="0" y1="' + j*u + '" x2="' + W*u + '" y2="' + j*u + '"/>';
  g = '<g stroke="var(--line)" stroke-width="1">' + g + '</g>';
  q.lines.forEach((ln, i) => {
    let x = ln.x, y = 0, down = '', side = '';
    ln.segs.forEach(([d, s]) => {
      down += 'M' + x*u + ' ' + y*u + 'v' + d*u; y += d;
      if(s){ side += 'M' + x*u + ' ' + y*u + 'h' + s*u; x += s; }
    });
    if(!full){ g += '<path d="' + down + side + '" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round" fill="none"/>'; return; }
    const best = q.lens[i] === q.ans, mid = (5*i + 2.5)*u;
    g += '<g' + popAt(1 + i) + '><path d="' + down + '" stroke="var(--accent)" stroke-width="3.2" stroke-linecap="round" fill="none"/>' +
      '<path d="' + side + '" stroke="var(--warm)" stroke-width="3.2" stroke-linecap="round" fill="none"/>' +
      (best ? '<rect x="' + (5*i*u + 2) + '" y="' + (q.V*u + 6) + '" width="' + (5*u - 4) + '" height="20" rx="6" fill="var(--goodbg)" stroke="var(--good)" stroke-width="1.4"/>' : '') +
      svgText(mid, q.V*u + 20, q.V + ' + ' + zigSide(ln) + ' = ' + q.lens[i], 9.5, best ? 'var(--good)' : 'var(--ink)') + '</g>';
  });
  return '<svg viewBox="-3 -3 ' + (W*u + 6) + ' ' + (q.V*u + 6 + foot) + '" style="display:block; width:' + Math.round((W*u + 6)*1.25) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('начупени линии върху мрежа от квадратчета', 'ламані лінії на сітці з квадратиків') + '">' + g + '</svg>';
}
function drawZigzag(q){
  return '<div class="ask">' + tr('Мрежата е от квадратчета със страна <span class="num">1</span> см. Колко сантиметра е <b>най-късата</b> от начупените линии?',
    'Сітка складається з квадратиків зі стороною <span class="num">1</span> см. Скільки сантиметрів завдовжки <b>найкоротша</b> з ламаних ліній?') + '</div>' +
    '<div class="fig wide">' + zigSvg(q, false) + '</div>' +
    '<div class="line lg">' + SLOT + CM + '</div>';
}
function eqZigzag(q){
  return q.lens.join(', ') + ' → ' + q.ans;
}
function whyZigzag(q, full){
  if(!full) return tr('Пройди по всяка линия и брой страните на квадратчетата. Надолу всички слизат еднакво — сравни колко вървят настрани.',
    'Пройди кожною лінією й рахуй сторони квадратиків. Униз усі спускаються однаково — порівняй, скільки вони йдуть убік.');
  return tr('надолу всяка линия е <b>' + q.V + '</b> см, настрани — различно', 'униз кожна лінія — <b>' + q.V + '</b> см, убік — у кожної інакше') + zigSvg(q, true) +
    tr('най-късата: ', 'найкоротша: ') + q.ans + ' см';
}
KIND.zigzag = { draw:drawZigzag, eq:eqZigzag, why:whyZigzag };
