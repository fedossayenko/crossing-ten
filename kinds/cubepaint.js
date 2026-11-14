// Question kind 'cubepaint': level 382 Най-малко боя — Solids made of the same cubes: which has the smallest surface.

// Кенгуру 2019, 2 клас, задача 15: five solids of 4 equal cubes, all painted with one coat; which took the least paint? Every
// cube has 6 faces and every two cubes that touch hide 2 of them, so the surface is 6 · 4 − 2 · (touching pairs): the line, the
// L, the T and the S all touch in 3 places (18 faces), the 2 × 2 square in 4 (16): B. The solids are drawn from 3-D models,
// the right one is the only one with most touching pairs, and each wrong one is a solid with fewer.
import { KIND, rnd, shuffle, tr } from '../js/core.js';
import { isoReadable, isoSvg, touching } from './isocubes.js';

const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const has = (cells, x, y, z) => cells.some(o => o.x === x && o.y === y && o.z === z);
/** the 24 turns of a solid (the signed permutations of the axes that do not mirror it) */
export const SOLID_TURNS = [];
const TURNS = SOLID_TURNS;
[[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].forEach(p => [1, -1].forEach(a => [1, -1].forEach(b => [1, -1].forEach(c => {
  const sg = [a, b, c], inv = p.reduce((k, v, i) => k + p.slice(i + 1).filter(w => w < v).length, 0) % 2 ? -1 : 1;
  if(a*b*c*inv === 1) TURNS.push(v => [sg[0]*v[p[0]], sg[1]*v[p[1]], sg[2]*v[p[2]]]);
}))));
export const solidSpot = cells => cells.map(c => [c.x, c.y, c.z]);
export const solidNorm = pts => { const m = [0, 1, 2].map(i => Math.min(...pts.map(p => p[i]))); return pts.map(p => ({ x: p[0] - m[0], y: p[1] - m[1], z: p[2] - m[2] })); };
/** one name for a solid however it is turned */
export const solidName = cells => TURNS.map(t => solidNorm(solidSpot(cells).map(t)).map(c => c.x + '' + c.y + c.z).sort().join('.')).sort()[0];
export const growSolid = n => {
  const cells = [{ x: 1, y: 1, z: 1 }];
  while(cells.length < n){
    const from = cells[rnd(cells.length)], d = DIRS[rnd(6)];
    if(!has(cells, from.x + d[0], from.y + d[1], from.z + d[2])) cells.push({ x: from.x + d[0], y: from.y + d[1], z: from.z + d[2] });
  }
  return cells;
};
/** a pose of the solid a child can read: some turn of it with no hidden or false-touching cubes */
const pose = cells => { const ok = shuffle(TURNS.slice()).map(t => solidNorm(solidSpot(cells).map(t))).find(c => isoReadable(c, true)); return ok || null; };
export function genCubePaint(){
  for(;;){
    const n = [4, 4, 5][rnd(3)], seen = new Map();
    for(let i = 0; i < 40 && seen.size < 5; i++){
      const c = growSolid(n), name = solidName(c);
      if(!seen.has(name)){ const p = pose(c); if(p) seen.set(name, p); }
    }
    if(seen.size < 5) continue;
    const solids = [...seen.values()], glued = solids.map(c => touching(c).length), best = Math.max(...glued);
    if(glued.filter(g => g === best).length !== 1) continue;
    const order = shuffle(solids.map((c, i) => i)), pick = order.findIndex(i => glued[i] === best);
    return {kind:'cubepaint', n, solids: order.map(i => solids[i]), names: order.map(i => solidName(solids[i])), glued: order.map(i => glued[i]), options: order.map((i, id) => ({ id, v: id,
      text: [isoSvg(solids[i], 17, tr('тяло от ' + n + ' кубчета', 'тіло з ' + n + ' кубиків'), 100), isoSvg(solids[i], 17, tr('тяло от ' + n + ' кубчета', 'тіло з ' + n + ' кубиків'), 100)] })), pick, own:true, ans: pick};
  }
}
function drawCubePaint(q){
  return '<div class="ask">' + tr('Всяко от показаните тела е получено от ' + q.n + ' еднакви по размер кубчета. Телата са боядисани с еднакъв слой боя. <b>За кое тяло е изразходвана най-малко боя?</b>',
    'Кожне з показаних тіл складено з ' + q.n + ' однакових за розміром кубиків. Тіла пофарбовано однаковим шаром фарби. <b>На яке тіло витрачено найменше фарби?</b>') + '</div>';
}
const surf = q => q.glued.map(g => 6*q.n - 2*g);
function eqCubePaint(q){
  const s = surf(q);
  return s.map(String).join(', ') + ' → ' + s[q.pick];
}
function whyCubePaint(q, full){
  if(!full) return tr('Всяко кубче има 6 стени. Където две кубчета се допират, по една стена от двете остава скрита и не се боядисва. Къде се допират най-много кубчета?', 'Кожен кубик має 6 граней. Де два кубики торкаються, по одній грані від обох лишається схованою й не фарбується. Де кубики торкаються найбільше?');
  const L = 'АБВГД';
  return tr('допирания и боядисани стени: ', 'дотиків і пофарбованих граней: ') + surf(q).map((v, i) => L[i] + ' ' + q.glued[i] + ' → ' + 6*q.n + ' − ' + 2*q.glued[i] + ' = ' + v).join('; ') +
    ' &nbsp;→&nbsp; ' + tr('най-малко боя: ', 'найменше фарби: ') + '<b>' + L[q.pick] + '</b>';
}
KIND.cubepaint = { draw:drawCubePaint, eq:eqCubePaint, why:whyCubePaint };
