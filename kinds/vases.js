// Question kind 'vases': level 400 Вази с топчета — Five vases of numbered balls: in which one the numbers add up to the most.

// Кенгуру 2023, 2 клас, задача 3: five vases of 4 balls each, A 8 7 4 9, B 4 6 7 9, C 7 9 4 7, D 9 7 4 4, E 7 4 9 5; the sums are 28, 26, 27, 24, 25,
// so vase A (key A). The answer is a picture, so the kind brings its own five options: the vases themselves. A vase with the biggest
// single ball (a 9) is not the answer by that alone, as in the paper (B also holds a 9), so a pick by the biggest ball does not win.
import { KIND, rnd, svgText, tr } from '../js/core.js';

const BALL = ['var(--accent)', 'var(--warm)', 'var(--good)', 'var(--bad)', 'var(--grape)', 'var(--pear)'];
const POS = [[30, 50], [60, 46], [36, 72], [64, 72]];   // where the four balls lie in a vase
const sum = (/** @type {number[]} */ a) => a.reduce((s, x) => s + x, 0);
/** the index of the one vase with the largest sum, -1 when two share it */
export const vasesBest = (/** @type {number[][]} */ vs) => { const s = vs.map(sum), m = Math.max(...s); return s.filter(x => x === m).length === 1 ? s.indexOf(m) : -1; };
export function genVases(){
  for(;;){
    const vs = Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => 1 + rnd(9)));
    const pick = vasesBest(vs), s = vs.map(sum);
    if(pick < 0 || Math.max(...s) < 20 || Math.min(...s) < 12) continue;
    const top = Math.max(...vs.flat()), holders = vs.filter(v => v.includes(top));
    if(holders.length === 1 && holders[0] === vs[pick]) continue;   // the vase of the biggest ball must not be the answer by that alone
    if(s[pick] - Math.max(...s.filter((_, i) => i !== pick)) > 3) continue;   // a close call, as in the paper
    return {kind:'vases', vs, options: vs.map((v, id) => ({ id, v: id, text: [vasePic(v, 0), vasePic(v, 1)] })), pick, own:true, ans: pick};
  }
}
function vasePic(/** @type {number[]} */ v, /** @type {number} */ k){
  let g = '<path d="M22,26 C4,34 4,86 48,88 C92,86 92,34 74,26" fill="var(--glass)" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="48" cy="25" rx="26" ry="6" fill="none" stroke="var(--ink)" stroke-width="2.4"/>';
  v.forEach((n, i) => { g += '<circle cx="' + POS[i][0] + '" cy="' + POS[i][1] + '" r="12" fill="var(--accentbg)" stroke="' + BALL[n % 6] + '" stroke-width="3"/>' + svgText(POS[i][0], POS[i][1] + 5, n, 15, 'var(--ink)'); });
  return '<svg viewBox="0 0 96 94" width="96" height="94" role="img" aria-label="' + (k ? 'ваза з кульками ' : 'ваза с топчета ') + v.join(', ') + '">' + g + '</svg>';
}
function drawVases(){
  return '<div class="ask">' + tr('Показани са 5 вази, всяка от които съдържа 4 топчета с номера. <b>В коя ваза сборът от номерата на топчетата е най-голям?</b>',
    'Показано 5 ваз, у кожній з яких лежать 4 кульки з номерами. <b>У якій вазі сума номерів кульок найбільша?</b>') + '</div>';
}
const line = (/** @type {number[]} */ v) => v.join(' + ') + ' = ' + sum(v);
function eqVases(q){
  return line(q.vs[q.pick]);
}
function whyVases(q, full){
  if(!full) return tr('Събери номерата на топчетата във всяка ваза и сравни сборовете. Най-голямото число не решава, а сборът.', 'Додай номери кульок у кожній вазі й порівняй суми. Вирішує не найбільше число, а сума.');
  return q.options.map((_o, i) => 'АБВГД'[i] + ') ' + line(q.vs[i]) + (i === q.pick ? ' &nbsp;<b>←</b>' : '')).join('<br>') + '<br>' + tr('Най-голям е сборът ', 'Найбільша сума — ') + '<b>' + sum(q.vs[q.pick]) + '</b>';
}
KIND.vases = { draw:drawVases, eq:eqVases, why:whyVases };
