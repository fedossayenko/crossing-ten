// Question kind 'vennsum': level 411 Липсващо число в триъгълника — A triangle and a circle overlap with numbers in them: the sum in the triangle is twice the sum in the circle.

// Кенгуру 2024, 2 клас, задача 14: the triangle holds «?» and 5 (the 5 also in the circle), the circle holds 5 and 3. The circle adds up to
// 5 + 3 = 8, the triangle to twice that, 16; 5 is in it already, so «?» is 16 − 5 = 11 (D). The overlap holds one or two numbers, the
// rest of the circle one or two, the rest of the triangle «?» and sometimes one more number; all different, 1–9. The answer is typed.
import { KIND, answerLine, rnd, shuffle, svgText, tr } from '../js/core.js';

export const VS = { c: { x: 150, y: 70, r: 56 }, t: [[14, 18], [14, 122], [170, 70]] };
// where the numbers lie: in the overlap (one, two), in the circle only (one, two), in the triangle only (the «?», the other number)
export const VS_SPOTS = { ov: [[[122, 70]], [[108, 70], [136, 70]]], co: [[[196, 70]], [[186, 44], [186, 96]]], to: [[34, 70], [68, 70]] };
/** the numbers of the overlap, the circle only and the triangle only (besides the «?»): the «?» that makes the triangle's sum twice the circle's */
export function vennSum(ov, co, to){
  const sum = a => a.reduce((s, x) => s + x, 0), ans = 2 * (sum(ov) + sum(co)) - sum(ov) - sum(to);
  return { kind: 'vennsum', ov, co, to, ans };
}
export function genVennSum(){
  for(;;){
    const no = 1 + rnd(2), nc = 1 + rnd(2), nt = rnd(2), nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, no + nc + nt);
    const q = vennSum(nums.slice(0, no), nums.slice(no, no + nc), nums.slice(no + nc));
    if(q.ans >= 1 && q.ans <= 15 && !nums.includes(q.ans)) return q;
  }
}
function pic(q){
  const { c, t } = VS;
  const txt = (/** @type {number[]} */ a, /** @type {number[][]} */ spots) => a.map((v, i) => svgText(spots[i][0], spots[i][1] + 6, v, 17, 'var(--ink)')).join('');
  const label = tr('триъгълник и кръг, които се пресичат; в триъгълника са въпросителен знак и числата ' + q.ov.concat(q.to).join(', ') + ', в кръга са ' + q.ov.concat(q.co).join(', '),
    'трикутник і коло, що перетинаються; у трикутнику знак питання і числа ' + q.ov.concat(q.to).join(', ') + ', у колі ' + q.ov.concat(q.co).join(', '));
  return '<svg viewBox="0 0 240 140" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' +
    '<polygon points="' + t.map(p => p.join(',')).join(' ') + '" fill="var(--wash2)" stroke="var(--warm)" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<circle cx="' + c.x + '" cy="' + c.y + '" r="' + c.r + '" fill="var(--wash1)" stroke="var(--accent)" stroke-width="2.5"/>' +
    svgText(VS_SPOTS.to[0][0], VS_SPOTS.to[0][1] + 6, '?', 19, 'var(--bad)') + txt(q.to, [VS_SPOTS.to[1]]) + txt(q.ov, VS_SPOTS.ov[q.ov.length - 1]) + txt(q.co, VS_SPOTS.co[q.co.length - 1]) + '</svg>';
}
const sum = (/** @type {number[]} */ a) => a.reduce((s, x) => s + x, 0);
function drawVennSum(q){
  return '<div class="ask">' + tr('Сборът на числата в триъгълника е два пъти по-голям от сбора на числата в кръга. <b>Кое число трябва да се постави на мястото на въпросителния знак?</b>',
    'Сума чисел у трикутнику вдвічі більша за суму чисел у колі. <b>Яке число треба поставити замість знака питання?</b>') + '</div>' + pic(q) + answerLine('xl');
}
function eqVennSum(q){ return 2 * (sum(q.ov) + sum(q.co)) + ' − ' + (sum(q.ov) + sum(q.to)) + ' = ' + q.ans; }
function whyVennSum(q, full){
  if(!full) return tr('Първо намери сбора в кръга. Сборът в триъгълника е два пъти по-голям. После извади числата, които вече са в триъгълника.', 'Спершу знайди суму в колі. Сума в трикутнику вдвічі більша. Потім відніми числа, які вже є в трикутнику.');
  const c = sum(q.ov) + sum(q.co), known = q.ov.concat(q.to);
  return tr('Кръгът: ', 'Коло: ') + q.ov.concat(q.co).join(' + ') + ' = ' + c + '<br>' + tr('Сборът в триъгълника е два пъти по-голям: ', 'Сума в трикутнику вдвічі більша: ') + c + ' + ' + c + ' = ' + 2 * c + '<br>' +
    tr('В него вече ' + (known.length > 1 ? 'са ' : 'е '), 'У ньому вже є ') + known.join(' + ') + ' = ' + sum(known) + '<br>' + 2 * c + ' − ' + sum(known) + ' = <b>' + q.ans + '</b>';
}
KIND.vennsum = { draw: drawVennSum, eq: eqVennSum, why: whyVennSum };
