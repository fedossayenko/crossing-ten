// Question kind 'starsum': level 403 Съзвездието на Кенго — Five constellations of numbered stars: the one whose different numbers (not 3) add up to 20.

// Кенгуру 2021, 2 клас, задача 8: A 3 4 6 7, B 5 7 8, C 3 7 2 5 8, D 5 1 4 9, E 9 2 9; the numbers that are not 3 and differ from each other
// add up to 20 only for B (5 + 7 + 8): A would give 20 with its 3 counted, E with its 9 counted twice (key B). The answer is a picture, so the
// kind brings its own five options: one that is right, one that gives the number only when the excluded number is counted, one only
// when a repeated number is counted twice, and two others; the right one is never the only plain constellation (no excluded number, no repeat).
import { KIND, rnd, shuffle, svgText, tr } from '../js/core.js';

/** what the task asks of a constellation: the sum of its numbers, each different one once, the excluded number not at all */
export const starVal = (/** @type {number[]} */ a, /** @type {number} */ e) => [...new Set(a)].filter(x => x !== e).reduce((s, x) => s + x, 0);
const total = (/** @type {number[]} */ a) => a.reduce((s, x) => s + x, 0);
const rv = () => 1 + rnd(9);
const sig = (/** @type {number[]} */ a) => a.slice().sort((x, y) => x - y).join();
const plain = (/** @type {number[]} */ a, /** @type {number} */ e) => !a.includes(e) && new Set(a).size === a.length;
const dist = (/** @type {number} */ n, /** @type {number} */ e) => { const s = new Set(); while(s.size < n){ const v = rv(); if(v !== e) s.add(v); } return [...s]; };
export function genStarSum(){
  for(let guard = 0; ; guard++){
    const E = 3 + rnd(3);
    const right = Array.from({ length: 3 + rnd(3) }, rv), T = starVal(right, E);
    if(T < 13 || T > 24) continue;
    let trapE = null, trapD = null;
    for(let k = 0; k < 80 && !trapE; k++){ const d = dist(2 + rnd(2), E); if(total(d) === T - E) trapE = d.concat(E); }
    for(let k = 0; k < 80 && !trapD; k++){ const d = dist(2 + rnd(2), E), v = d[rnd(d.length)]; if(total(d) + v === T) trapD = d.concat(v); }
    if(!trapE || !trapD) continue;
    const rest = [0, 1].map(() => { for(;;){ const a = Array.from({ length: 3 + rnd(3) }, rv); if(starVal(a, E) !== T) return a; } });
    const sets = [right, trapE, trapD].concat(rest);
    if(new Set(sets.map(sig)).size < 5) continue;
    const pl = sets.map(s => plain(s, E));
    if(pl[0] ? pl.filter(Boolean).length === 1 : pl.filter(x => !x).length === 1) continue;   // the right one is not the only plain (or the only unplain) one
    const order = shuffle([0, 1, 2, 3, 4]), vals = order.map(i => sets[i]), pick = order.indexOf(0);
    const stars = vals.map(starsOf);
    return {kind:'starsum', E, T, vals, stars, options: vals.map((v, id) => ({ id, v: id, text: [starPic(v, stars[id], 0), starPic(v, stars[id], 1)] })), pick, own:true, ans: pick};
  }
}
/** where the stars of one constellation lie, and which are joined: [x, y] each, in a box of 132 × 98 */
function starsOf(/** @type {number[]} */ vals){
  const slots = shuffle([[24, 28], [66, 24], [108, 28], [24, 72], [66, 74], [108, 72]]).slice(0, vals.length);
  return slots.map(([x, y]) => [x + rnd(7) - 3, y + rnd(7) - 3]);
}
const starPts = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ R) => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI/2 + i*Math.PI/5, r = i % 2 ? R*0.45 : R; return (x + r*Math.cos(a)).toFixed(1) + ',' + (y + r*Math.sin(a)).toFixed(1); }).join(' ');
function starPic(/** @type {number[]} */ vals, /** @type {number[][]} */ pos, /** @type {number} */ k){
  let g = '<g stroke="var(--muted)" stroke-width="2">';
  const n = pos.length;
  for(let i = 0; i < n - 1 || (n > 2 && i === n - 1); i++){ const a = pos[i], b = pos[(i + 1) % n]; g += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; }
  g += '</g>';
  pos.forEach(([x, y], i) => { g += '<polygon points="' + starPts(x, y, 18) + '" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>' + svgText(x, y + 5, vals[i], 14, 'var(--ink)', ' class="sn"'); });
  return '<svg viewBox="0 0 132 98" width="132" height="98" role="img" aria-label="' + (k ? 'сузір’я із зірок: ' : 'съзвездие от звезди: ') + vals.join(', ') + '">' + g + '</svg>';
}
function drawStarSum(q){
  return '<div class="ask">' + tr('Показани са 5 съзвездия (комбинации от звезди). Сборът на тези от числата върху звездите от съзвездието на Кенго, които са различни от ' + q.E + ' и са различни помежду си, е равен на ' + q.T + '. <b>Кое е съзвездието на Кенго?</b>',
    'Показано 5 сузір’їв (комбінацій із зірок). Сума тих чисел на зірках сузір’я Кенґо, які відмінні від ' + q.E + ' і відмінні між собою, дорівнює ' + q.T + '. <b>Яке сузір’я Кенґо?</b>') + '</div>';
}
const sumLine = (/** @type {number[]} */ a, /** @type {number} */ e) => { const d = [...new Set(a)].filter(x => x !== e).sort((x, y) => x - y); return d.join(' + ') + ' = ' + total(d); };
function eqStarSum(q){
  return sumLine(q.vals[q.pick], q.E);
}
function whyStarSum(q, full){
  if(!full) return tr('За всяко съзвездие задраскай забраненото число и повтарящите се числа, остави всяко число само веднъж и събери.', 'У кожному сузір’ї викресли заборонене число й числа, що повторюються, залиш кожне число один раз і додай.');
  return q.vals.map((a, i) => 'АБВГД'[i] + ') ' + a.join(', ') + ' → ' + sumLine(a, q.E) + (i === q.pick ? ' &nbsp;<b>←</b>' : '')).join('<br>') + '<br>' + tr('Сборът е ' + q.T + ' само в едно съзвездие.', 'Сума дорівнює ' + q.T + ' лише в одному сузір’ї.');
}
KIND.starsum = { draw:drawStarSum, eq:eqStarSum, why:whyStarSum };
