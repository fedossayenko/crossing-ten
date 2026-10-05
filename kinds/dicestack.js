// Question kind 'dicestack': level 183 Невидимите точки — Two dice stacked: the dots that cannot be seen.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2022, 1 клас, задача 16: two dice one on the other; the top one shows 1 on top, 5 and 4 at the
// sides, the bottom one 6 and 3. A die has 1 + 2 + 3 + 4 + 5 + 6 = 21 dots, two have 42; 19 can be seen,
// so 42 − 19 = 23 cannot. Faces seen together on one die are never opposite (opposite faces make 7).
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genDiceStack(){
  for(;;){
    const t = 1 + rnd(6), l = 1 + rnd(6), r = 1 + rnd(6), bl = 1 + rnd(6), br = 1 + rnd(6);
    const apart = (x, y) => x !== y && x + y !== 7;                   // two faces that meet at an edge
    if(!apart(t, l) || !apart(t, r) || !apart(l, r) || !apart(bl, br)) continue;
    const seen = t + l + r + bl + br;
    if(42 - seen > 30) continue;                                       // the answer kept within thirty
    return {kind:'dicestack', top:[t, l, r], bot:[bl, br], traps:[seen, 21 - seen], ans: 42 - seen};
  }
}
// the pips of a face in a 3 × 3 grid, as on a real die
const STACK_PIPS = {1:[[1,1]], 2:[[0,0],[2,2]], 3:[[0,0],[1,1],[2,2]], 4:[[0,0],[2,0],[0,2],[2,2]], 5:[[0,0],[2,0],[1,1],[0,2],[2,2]], 6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]};
// one face drawn as the unit square carried by the matrix [ux uy vx vy ox oy]
const stackFace = (v, m, fill) => '<g transform="matrix(' + m.map(n => n.toFixed(2)).join(' ') + ')"><path d="M0,0 H1 V1 H0 Z" fill="' + fill + '" stroke="var(--ink)" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>' +
  STACK_PIPS[v].map(([i, j]) => '<circle cx="' + (0.22 + 0.28*i).toFixed(2) + '" cy="' + (0.22 + 0.28*j).toFixed(2) + '" r="0.085" fill="var(--ink)"/>').join('') + '</g>';
function diceStackSvg(q){
  const s = 52, a = s*0.866, b = s/2, cx = 70, y0 = 4;
  // the top die: its top face, then its left and right faces; the bottom die: its left and right faces
  const top = stackFace(q.top[0], [a, -b, a, b, cx - a, y0 + b], 'var(--solid)');
  const side = (v, dy, left) => stackFace(v, left ? [a, b, 0, s, cx - a, y0 + b + dy] : [a, -b, 0, s, cx, y0 + 2*b + dy], left ? 'var(--solid)' : 'var(--warmbg)');
  return '<div class="fig"><svg viewBox="0 0 140 ' + (y0 + 2*b + 2*s + 6) + '" style="max-width:150px" role="img" aria-label="' + tr('два зара един върху друг', 'два кубики один на одному') + '">' +
    top + side(q.top[1], 0, true) + side(q.top[2], 0, false) + side(q.bot[0], s, true) + side(q.bot[1], s, false) + '</svg></div>';
}
function drawDiceStack(q){
  if(q.kind === 'dicestack'){
    return '<div class="ask">' + tr('Колко е броят на точките, които <b>не се виждат</b>?', 'Скільки всього точок, яких <b>не видно</b>?') + '</div>' + diceStackSvg(q) +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
const diceStackSeen = q => q.top.concat(q.bot);
function eqDiceStack(q){
  if(q.kind === 'dicestack') return '42 − (' + diceStackSeen(q).join(' + ') + ') = ' + q.ans;
}
function whyDiceStack(q, full){
  if(q.kind === 'dicestack'){
    if(!full) return tr('Колко точки има на всички страни на един зар заедно? Махни от двата зара тези, които се виждат.',
      'Скільки точок на всіх гранях одного кубика разом? Відніми від двох кубиків ті, що видно.');
    const seen = diceStackSeen(q).reduce((x, y) => x + y, 0);
    return tr('един зар: ', 'один кубик: ') + '1 + 2 + 3 + 4 + 5 + 6 = <b>21</b> &nbsp;→&nbsp; ' + tr('два зара: ', 'два кубики: ') + '21 + 21 = <b>42</b> &nbsp;→&nbsp; ' +
      tr('виждат се ', 'видно ') + diceStackSeen(q).join(' + ') + ' = <b>' + seen + '</b> &nbsp;→&nbsp; 42 − ' + seen + ' = ' + q.ans;
  }
}
KIND.dicestack = { draw:drawDiceStack, eq:eqDiceStack, why:whyDiceStack };
