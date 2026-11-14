// Question kind 'bracelet': level 416 Гривна от мъниста — White and black beads are strung on a thread from the left or the right in a told order, the ends are joined: which bracelet.

// Кенгуру 2026, 2 клас, задача 20: first 2 white beads from the left, then 1 black from the left, then 2 black from the right, 2 white from the left,
// 1 white from the right, 1 black from the left. A bead strung from the left goes before all the others, one from the right after them, so the thread
// reads (left to right) black, white white, black, white white, black black, white; the ends joined, that is bracelet A. The answer is a picture, so the
// kind brings its own А–Д: the slips are the real ones: told order as it stands, sides swapped, the left beads in told order, the right beads
// in reverse, both of those. A bracelet turned over is the same bracelet, so no two options are the same up to turning round and over.
import { KIND, rnd, shuffle, tr } from '../js/core.js';

/** @typedef {[string, number, number]} BStep  side L or R, colour 0 white / 1 black, how many */
/** the thread left to right when each step is strung on its side (L before all, R after all) */
export const brSeq = (/** @type {BStep[]} */ steps) => { /** @type {number[]} */ let a = []; steps.forEach(([s, c, n]) => { const b = Array(n).fill(c); a = s === 'L' ? b.concat(a) : a.concat(b); }); return a; };
/** the bracelet as a thing: the least reading of it going round, either way */
export const brClass = (/** @type {number[]} */ a) => { const r = a.slice().reverse(); let best = ''; for(let i = 0; i < a.length; i++) for(const x of [a, r]) { const s = x.slice(i).concat(x.slice(0, i)).join(''); if(best === '' || s < best) best = s; } return best; };
const flip = (/** @type {BStep[]} */ steps) => steps.map(([s, c, n]) => /** @type {BStep} */ ([s === 'L' ? 'R' : 'L', c, n]));
const told = (/** @type {BStep[]} */ steps) => steps.map(([s, c, n]) => /** @type {BStep} */ (['R', c, n]));
/** the slips as thread readings */
const slips = (/** @type {BStep[]} */ steps) => {
  const L = steps.filter(s => s[0] === 'L'), R = steps.filter(s => s[0] === 'R'), rev = (/** @type {BStep[]} */ a) => a.slice().reverse();
  return [brSeq(told(steps)), brSeq(flip(steps)), brSeq(L.concat(R)), brSeq(rev(L).concat(rev(R))), brSeq(L.concat(rev(R))), brSeq(rev(L).concat(R))];
};
export function bracelet(/** @type {BStep[]} */ steps){
  const right = brSeq(steps), seen = new Set([brClass(right)]), wrong = /** @type {number[][]} */ ([]);
  const add = (/** @type {number[]} */ a) => { const k = brClass(a); if(!seen.has(k) && wrong.length < 4){ seen.add(k); wrong.push(a); } };
  shuffle(slips(steps)).forEach(add);
  for(let t = 0; t < 40 && wrong.length < 4; t++) add(shuffle(right.slice()));
  if(wrong.length < 4) return null;
  const order = shuffle(wrong.concat([right])), pick = order.indexOf(right), turns = order.map(a => rnd(a.length));
  return {kind:'bracelet', steps, options: order.map((a, id) => ({ id, v: id, text: [ring(a, turns[id], 0), ring(a, turns[id], 1)], beads: a })), pick, own: true, ans: pick};
}
export function genBracelet(){
  for(;;){
    const n = 5 + rnd(2), steps = /** @type {BStep[]} */ ([]);
    for(let i = 0; i < n; i++) steps.push([rnd(2) ? 'L' : 'R', rnd(2), 1 + rnd(2)]);
    const total = steps.reduce((s, x) => s + x[2], 0), nl = steps.filter(s => s[0] === 'L').length;
    if(total < 7 || total > 9 || nl < 2 || n - nl < 2) continue;
    const q = bracelet(steps);
    if(q) return q;
  }
}
/** a ring of beads, white (paper) and black (dark grey); the join sits at the start + the turn */
function ring(/** @type {number[]} */ a, /** @type {number} */ turn, /** @type {number} */ k){
  const n = a.length, beads = a.map((c, i) => { const t = (i + turn) / n * 2 * Math.PI + Math.PI / 2; return '<circle cx="' + (65 + 50 * Math.cos(t)).toFixed(1) + '" cy="' + (40 + 29 * Math.sin(t)).toFixed(1) + '" r="8" fill="' + (c ? 'var(--fur-dark)' : 'var(--paper)') + '" stroke="var(--ink)" stroke-width="1.8"/>'; }).join('');
  return '<svg viewBox="0 0 130 80" width="130" height="80" style="max-width:100%" role="img" aria-label="' + ['гривна от мъниста, по ред: ', 'браслет з намистин, по колу: '][k] + a.map(c => [['бяло', 'черно'], ['біла', 'чорна']][k][c]).join(', ') +
    '"><ellipse cx="65" cy="40" rx="50" ry="29" fill="none" stroke="var(--fur-dark)" stroke-width="1.6"/>' + beads + '</svg>';
}
const BGN = ['', 'едно', 'две'], UKN = ['', 'одну', 'дві'];
const part = (/** @type {BStep} */ [s, c, n], /** @type {number} */ i, /** @type {number} */ last) => {
  const lead = i === 0 ? tr('първо ', 'спершу ') : i === last ? tr('накрая ', 'нарешті ') : tr('после ', 'потім ');
  return lead + tr(s === 'L' ? 'отляво' : 'отдясно', s === 'L' ? 'зліва' : 'справа') + tr(' се нанизва' + (n > 1 ? 'т ' : ' '), ' нанизують ') +
    tr(BGN[n] + (n > 1 ? (c ? ' черни мъниста' : ' бели мъниста') : (c ? ' черно мънисто' : ' бяло мънисто')), UKN[n] + (n > 1 ? (c ? ' чорні намистини' : ' білі намистини') : (c ? ' чорну намистинку' : ' білу намистинку')));
};
function drawBracelet(q){
  return '<div class="ask">' + tr('На конец се нанизват бели и черни мъниста в следната последователност: ', 'На нитку нанизують білі й чорні намистини в такому порядку: ') + q.steps.map((/** @type {BStep} */ s, i) => part(s, i, q.steps.length - 1)).join(', ') + '. ' +
    tr('Двата края на конеца се свързват и се получава гривна. <b>Коя е получената по този начин гривна?</b>', 'Обидва кінці нитки з’єднують, і виходить браслет. <b>Який браслет вийшов?</b>') + '</div>';
}
function eqBracelet(q){ return tr('отляво — пред всички, отдясно — след всички; краищата се свързват', 'зліва — перед усіма, справа — після всіх; кінці з’єднують'); }
function whyBracelet(q, full){
  if(!full) return tr('Нареждай мънистата на една права: това, което се нанизва отляво, отива пред всички вече нанизани, а това отдясно — след всички. Накрая свържи краищата.', 'Викладай намистини на прямій: що нанизують зліва, іде перед усіма вже нанизаними, а що справа — після всіх. Наприкінці з’єднай кінці.');
  const row = brSeq(q.steps).map(c => c ? 'ч' : 'б').join(' ');
  return tr('Ред от ляво надясно (б — бяло, ч — черно): ', 'Ряд зліва направо (б — біла, ч — чорна): ') + '<b>' + row + '</b><br>' + tr('Краищата се свързват в кръг. Другите гривни нареждат мънистата в друг ред или със сменени страни.', 'Кінці з’єднуються в коло. Інші браслети мають намистини в іншому порядку або зі зміненими боками.');
}
KIND.bracelet = { draw: drawBracelet, eq: eqBracelet, why: whyBracelet };
