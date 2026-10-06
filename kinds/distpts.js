// Question kind 'distpts': level 214 На 1 см от A или B — The points of a line a given distance from one of two points.
// Generator, drawing, summary line and hints for this kind all live here; the level itself (difficulty, group,
// prerequisites) is its row in js/levels.js.

// МБГ Полуфинал 2025, 1 клас, задача 11: A on a line, B on it 3 см from A; how many points of the line are 1 см
// from A or from B? Two on either side of A and two of B: 4. When B is twice as far, 2 см, the point between
// them is 1 см from both and is one point, not two: 3 — the trap. B is always farther than the distance asked:
// just as far, and the point found would be A itself, already marked.
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
export function genDistPts(){
  for(;;){
    const d = 1 + rnd(5), r = 1 + rnd(2);
    if(d <= r) continue;
    const both = d === 2*r;
    return {kind:'distpts', d, r, both, traps:[both ? 4 : 2], ans: both ? 3 : 4};
  }
}
// The line with a mark every centimetre, A and B on it, and the points found: arcs from A above the line,
// from B below it.
function distSvg(q){
  const lo = -q.r - 1, hi = q.d + q.r + 1, u = Math.min(26, 220 / (hi - lo)), X = v => (16 + (v - lo)*u).toFixed(1), Y = 44;
  let g = '<line x1="4" y1="' + Y + '" x2="' + (32 + (hi - lo)*u - 4).toFixed(1) + '" y2="' + Y + '" stroke="var(--ink)" stroke-width="2"/>';
  for(let v = lo; v <= hi; v++) g += '<line x1="' + X(v) + '" y1="' + (Y - 4) + '" x2="' + X(v) + '" y2="' + (Y + 4) + '" stroke="var(--ink)" stroke-width="1.2"/>';
  const arc = (from, to, up, col, step) => { const h = up ? -18 : 18;
    return '<g' + popAt(step) + '><path d="M' + X(from) + ' ' + Y + 'Q' + ((+X(from) + +X(to))/2).toFixed(1) + ' ' + (Y + 2*h) + ' ' + X(to) + ' ' + Y + '" fill="none" stroke="' + col + '" stroke-width="1.8"/>' +
      svgText(((+X(from) + +X(to))/2).toFixed(1), up ? Y + h - 4 : Y + h + 12, q.r, 10, col) + '<circle cx="' + X(to) + '" cy="' + Y + '" r="4.2" fill="var(--warm)"/></g>'; };
  g += arc(0, -q.r, true, 'var(--accent)', 1) + arc(0, q.r, true, 'var(--accent)', 2) + arc(q.d, q.d - q.r, false, 'var(--good)', 3) + arc(q.d, q.d + q.r, false, 'var(--good)', 4);
  [[0, 'A'], [q.d, 'B']].forEach(([v, name]) => { g += '<circle cx="' + X(v) + '" cy="' + Y + '" r="4.6" fill="var(--ink)"/>' + svgText(X(v), Y + (name === 'A' ? 22 : -14), name, 13, 'var(--ink)'); });
  return '<svg viewBox="0 0 ' + (32 + (hi - lo)*u).toFixed(1) + ' ' + (2*Y) + '" style="display:block; width:' + Math.round((32 + (hi - lo)*u)*1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('правата с точките A и B', 'пряма з точками A і B') + '">' + g + '</svg>';
}
function drawDistPts(q){
  return '<div class="ask">' + tr('Мария начертала права линия и отбелязала върху нея точката A. След това върху същата права на разстояние <span class="num">' + q.d + '</span> см от A отбелязала точката B. Колко са точките, които можем да отбележим върху тази права, всяка на разстояние <span class="num">' + q.r + '</span> см от една от точките A и B?',
    'Марія накреслила пряму лінію й позначила на ній точку A. Потім на тій самій прямій на відстані <span class="num">' + q.d + '</span> см від A вона позначила точку B. Скільки точок можна позначити на цій прямій, кожну на відстані <span class="num">' + q.r + '</span> см від однієї з точок A і B?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqDistPts(q){
  const p = (n, s) => n + ' ' + s + ' ' + q.r;
  return p('A', '−') + ', ' + p('A', '+') + (q.both ? ' = ' : ', ') + p('B', '−') + ', ' + p('B', '+') + ' → ' + q.ans;
}
function whyDistPts(q, full){
  if(!full) return tr('Начертай правата с деление на всеки сантиметър и отбележи A и B. Колко точки са на ' + q.r + ' см от A — от двете страни? А от B? Внимавай някоя да не се падне два пъти.',
    'Накресли пряму з поділками через кожен сантиметр і познач A та B. Скільки точок на відстані ' + q.r + ' см від A — з обох боків? А від B? Пильнуй, щоб якась не випала двічі.');
  return tr('на ' + q.r + ' см от A: <b>2</b> точки, на ' + q.r + ' см от B: <b>2</b> точки', 'на відстані ' + q.r + ' см від A: <b>2</b> точки, від B: <b>2</b> точки') + distSvg(q) +
    (q.both ? tr('точката между A и B е една и съща: ', 'точка між A і B — та сама: ') + '2 + 2 − 1 = 3' : '2 + 2 = 4');
}
KIND.distpts = { draw:drawDistPts, eq:eqDistPts, why:whyDistPts };
