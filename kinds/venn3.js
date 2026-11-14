// Question kind 'venn3': level 410 В трите фигури — A circle, a square and a triangle overlap, numbers lie in the pieces: which number is in all three.

// Кенгуру 2024, 2 клас, задача 1: the numbers 1 to 10 in a circle, a square and a triangle; the one in all three at once is 5 (C).
// The three shapes are drawn once, the same every time; ten anchor points (checked by check/ek-W3.js against the drawn shapes) lie
// each well inside one piece. The numbers 1–10 are shuffled over them, and the question names the piece: all three (the paper's),
// or the circle and the square but not the triangle, or the circle and the triangle but not the square. The answer is typed.
import { KIND, answerLine, shuffle, svgText, tr } from '../js/core.js';

export const V3 = { c: { x: 120, y: 58, r: 46 }, s: { x: 34, y: 50, w: 100, h: 100 }, t: [[50, 150], [170, 24], [220, 150]] };
// the anchors: the pieces they lie in (C circle, S square, T triangle), and where
/** @type {[string, number, number][]} */
export const V3_SPOTS = [['C', 110, 32], ['C', 134, 32], ['S', 60, 98], ['S', 52, 120], ['T', 170, 118], ['ST', 106, 126], ['ST', 84, 136], ['CS', 98, 70], ['CST', 122, 92], ['CT', 150, 66]];
const ASKS = { all: 'CST', cs: 'CS', ct: 'CT' };
/** the numbers 1–10 over the ten anchors, and the piece asked: the number in that piece (typed) */
export function vennThree(nums, ask){
  return { kind: 'venn3', shape: ask === 'all' ? 'all' : 'two', ask, nums, ans: nums[V3_SPOTS.findIndex(p => p[0] === ASKS[ask])] };
}
export function genVennThree(){
  const ask = ['all', 'all', 'cs', 'ct'][Math.floor(Math.random() * 4)];
  return vennThree(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), ask);
}
function pic(q){
  const { c, s, t } = V3, nums = V3_SPOTS.map((p, i) => svgText(p[1], p[2] + 6, q.nums[i], 17, 'var(--ink)')).join('');
  const label = tr('кръг, квадрат и триъгълник, които се пресичат, с числата от 1 до 10 в частите им', 'коло, квадрат і трикутник, що перетинаються, з числами від 1 до 10 в їхніх частинах');
  return '<svg viewBox="0 0 240 168" style="display:block; width:310px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' +
    '<rect x="' + s.x + '" y="' + s.y + '" width="' + s.w + '" height="' + s.h + '" fill="var(--wash2)" stroke="var(--warm)" stroke-width="2.5"/>' +
    '<polygon points="' + t.map(p => p.join(',')).join(' ') + '" fill="var(--wash4)" stroke="var(--good)" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<circle cx="' + c.x + '" cy="' + c.y + '" r="' + c.r + '" fill="var(--wash1)" stroke="var(--accent)" stroke-width="2.5"/>' + nums + '</svg>';
}
function drawVennThree(q){
  const ask = q.ask === 'all' ? tr('Кое число се намира едновременно в триъгълника, в квадрата и в кръга?', 'Яке число міститься одночасно в трикутнику, у квадраті й у колі?')
    : q.ask === 'cs' ? tr('Кое число е и в кръга, и в квадрата, но не е в триъгълника?', 'Яке число є і в колі, і в квадраті, але не в трикутнику?')
    : tr('Кое число е и в кръга, и в триъгълника, но не е в квадрата?', 'Яке число є і в колі, і в трикутнику, але не в квадраті?');
  return '<div class="ask"><b>' + ask + '</b></div>' + pic(q) + answerLine('xl');
}
const where = q => q.ask === 'all' ? tr('и в трите фигури', 'в усіх трьох фігурах') : q.ask === 'cs' ? tr('в кръга и в квадрата, но извън триъгълника', 'в колі й у квадраті, але поза трикутником')
  : tr('в кръга и в триъгълника, но извън квадрата', 'в колі й у трикутнику, але поза квадратом');
function eqVennThree(q){ return tr('числото ' + where(q) + ': ' + q.ans, 'число ' + where(q) + ': ' + q.ans); }
function whyVennThree(q, full){
  if(!full) return tr('Обходи всяка фигура с пръст: числото, което търсиш, е вътре във всички фигури, които са назовани, и извън другата, ако има такава.', 'Обведи кожну фігуру пальцем: число, яке шукаєш, лежить усередині всіх названих фігур і поза іншою, якщо вона є.');
  return tr('Търсим числото ' + where(q) + '. То е ', 'Шукаємо число ' + where(q) + '. Це ') + '<b>' + q.ans + '</b>';
}
KIND.venn3 = { draw: drawVennThree, eq: eqVennThree, why: whyVennThree };
