// Question kind 'recolour': level 415 Три пребоядисвания — A row of nine squares, black, white or hatched, recoloured in three steps: which row at the end.

// Кенгуру 2019, 2 клас, задача 22: Ани replaces every black square with white, then Борко every hatched one with black, then Васко every white one
// with hatched. Done in that order, what was black or white ends hatched and what was hatched ends black (B). The answer is a picture, so the
// kind brings its own А–Д: the slips are the real ones: the same three steps in another order, or one step left out, each a row of its own.
import { KIND, rnd, shuffle, tr } from '../js/core.js';

const BG = ['черно', 'бяло', 'шарено'], UK = ['чорний', 'білий', 'смугастий'], UKON = ['на чорний', 'на білий', 'на смугастий'], BGTO = ['с черно', 'с бяло', 'с шарено'];
/** @typedef {[number, number]} RStep  every square of the first colour (0 black, 1 white, 2 hatched) becomes the second */
export const rcApply = (/** @type {number[]} */ row, /** @type {RStep[]} */ steps) => steps.reduce((r, [f, t]) => r.map(c => c === f ? t : c), row);
/** the row, the three steps, and the options (five rows, the right one the three steps in order) */
export function recolour(/** @type {number[]} */ row, /** @type {RStep[]} */ steps){
  const right = rcApply(row, steps), key = (/** @type {number[]} */ r) => r.join(''), seen = new Set([key(right)]), cand = /** @type {number[][]} */ ([]);
  const perms = [[0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  perms.forEach(p => cand.push(rcApply(row, p.map(i => steps[i]))));
  [0, 1, 2].forEach(i => cand.push(rcApply(row, steps.filter((_, j) => j !== i))));
  const wrong = shuffle(cand.filter(r => { const k = key(r); if(seen.has(k)) return false; seen.add(k); return true; }));
  if(wrong.length < 4) return null;
  for(let t = 0; t < 30; t++){
    const four = shuffle(wrong.slice()).slice(0, 4), all = four.concat([right]);
    // a vote on each square must not give the answer: the row nearest to the most common colour of every place is not the right one
    const modal = row.map((_, i) => [0, 1, 2].map(c => [c, all.filter(r => r[i] === c).length]).sort((a, b) => b[1] - a[1])[0][0]);
    const score = all.map(r => r.filter((c, i) => c === modal[i]).length);
    if(score[4] === Math.max(...score)) continue;
    const order = shuffle(all.slice()), pick = order.indexOf(right);
    return {kind:'recolour', row, steps, options: order.map((r, id) => ({ id, v: id, text: [strip(r, 0), strip(r, 1)], row: r })), pick, own: true, ans: pick};
  }
  return null;
}
export function genRecolour(){
  for(;;){
    const row = Array.from({ length: 9 }, () => rnd(3));
    if([0, 1, 2].some(c => row.filter(x => x === c).length < 2)) continue;
    const steps = /** @type {RStep[]} */ ([]);
    for(let i = 0; i < 3; i++){ const f = rnd(3), t = (f + 1 + rnd(2)) % 3; steps.push([f, t]); }
    let r = row, ok = true;
    steps.forEach(([f, t]) => { if(!r.includes(f)) ok = false; r = rcApply(r, [[f, t]]); });
    if(!ok || r.join('') === row.join('')) continue;
    const q = recolour(row, steps);
    if(q) return q;
  }
}
const PAT = '<pattern id="rch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="var(--paper)"/><line x1="0" y1="0" x2="0" y2="5" stroke="var(--fur-dark)" stroke-width="2.4"/></pattern>';
const FILLS = ['var(--coal)', 'var(--paper)', 'url(#rch)'];
/** a row of squares as a picture; k = the language of its label */
function strip(/** @type {number[]} */ r, /** @type {number} */ k, w = 0){
  const s = 17, W = r.length * s + 4;
  return '<svg viewBox="0 0 ' + W + ' 21" width="' + (w || W) + '" height="' + (w ? Math.round(w * 21 / W) : 21) + '" style="max-width:100%" role="img" aria-label="' + (k ? 'ряд квадратиків: ' : 'редичка от квадратчета: ') + r.map(c => (k ? UK : BG)[c]).join(', ') + '"><defs>' + PAT + '</defs>' +
    r.map((c, i) => '<rect x="' + (2 + i * s) + '" y="2" width="' + s + '" height="' + s + '" fill="' + FILLS[c] + '" stroke="var(--ink)" stroke-width="1.5"/>').join('') + '</svg>';
}
const WHO = [['Ани', 'заменила', 'Ані', 'замінила'], ['Борко', 'заменил', 'Борко', 'замінив'], ['Васко', 'заменил', 'Васко', 'замінив']], FIRST = ['Най-напред ', 'След това ', 'Накрая '], FIRSTUK = ['Спершу ', 'Потім ', 'Нарешті '];
function drawRecolour(q){
  const said = q.steps.map((/** @type {RStep} */ [f, t], i) => tr(FIRST[i] + WHO[i][0] + ' ' + WHO[i][1] + ' всяко ' + BG[f] + ' квадратче ' + BGTO[t] + '.', FIRSTUK[i] + WHO[i][2] + ' ' + WHO[i][3] + ' кожен ' + UK[f] + ' квадратик ' + UKON[t] + '.')).join(' ');
  return '<div class="ask">' + tr('Девет квадратчета са подредени в редичка, както е показано. ', 'Дев’ять квадратиків розташовано в рядок, як показано. ') + said + ' <b>' + tr('Коя от редичките е получена накрая?', 'Який із рядків вийшов наприкінці?') + '</b></div>' +
    '<div class="given" style="text-align:center">' + tr(strip(q.row, 0, 190), strip(q.row, 1, 190)) + '</div>';
}
function eqRecolour(q){ return tr('редичката след трите смени една след друга', 'рядок після трьох замін одна за одною'); }
function whyRecolour(q, full){
  if(!full) return tr('Не гледай трите смени наведнъж: направи първата и нарисувай редичката. После втората върху нея. После третата.', 'Не дивись на три заміни разом: зроби першу й намалюй рядок. Потім другу на ньому. Потім третю.');
  let r = q.row;
  return tr(strip(r, 0, 170), strip(r, 1, 170)) + q.steps.map((/** @type {RStep} */ s) => { r = rcApply(r, [s]); return '<br>' + tr(strip(r, 0, 170), strip(r, 1, 170)); }).join('');
}
KIND.recolour = { draw: drawRecolour, eq: eqRecolour, why: whyRecolour };
