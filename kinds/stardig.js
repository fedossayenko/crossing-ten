// Question kind 'stardig': level 184 Звездите — One-digit numbers drawn as stars, pinned down by how big they can be.

// МБГ Пролет 2022, 1 клас, задача 11: one-digit ✷ + 9 equals one-digit ✹ + 1, so ✹ is 8 more than ✷:
// 0 and 8, or 1 and 9 — ✹ + ✷ is 8 or 10, both answers. МБГ Пролет 2021, задача 5: one-digit ✷ + 9 equals
// two-digit ✸✹ + 8. The left side is at most 9 + 9 = 18, the right at least 10 + 8 = 18: both are 18, so
// ✷ = 9 and ✸✹ = 10, and the two-digit ✸✷ is 19.
// three stars that cannot be mistaken for each other, the size of a digit
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const STAR_PATH = (n, r1, r2) => { let d = ''; for(let i = 0; i < 2*n; i++){ const r = i % 2 ? r2 : r1, t = Math.PI * i / n - Math.PI / 2; d += (i ? 'L' : 'M') + (r*Math.cos(t)).toFixed(1) + ',' + (r*Math.sin(t)).toFixed(1); } return d + 'Z'; };
const STARS = [['var(--warm)', STAR_PATH(5, 11, 4.6)], ['var(--accent)', STAR_PATH(8, 11, 5)], ['var(--good)', STAR_PATH(6, 11, 6)]];
export const star = i => '<svg class="ic" viewBox="-12 -12 24 24" aria-hidden="true"><path d="' + STARS[i][1] + '" fill="' + STARS[i][0] + '"/></svg>';
const STAR_TXT = ['★', '✹', '✶'];   // the same three in the summary line, which is plain text
// 'two': both one-digit, a − b = 7 or 8, so two or three pairs fit. 'tens': the other is two-digit and
// a − b = 1, which leaves only 9 and 10. ask: which number is wanted then.
/** @type {[number[], number][]} */
export const STAR_ASK = [[[2, 0], 19], [[0, 2], 91], [[2, 1], 10], [[0], 9]];   // (digits by star) for ✷ = 9, ✸ = 1, ✹ = 0
export function genStarDig(){
  if(Math.random() < 0.5){
    const d = 7 + rnd(2), b = rnd(10 - d), a = b + d;
    const fits = []; for(let x = 0; x + d <= 9; x++) fits.push(2*x + d);
    return {kind:'stardig', shape:'two', a, b, slots: fits.length, ans: fits[0], alt: fits.slice(1)};
  }
  const b = 1 + rnd(8), ask = rnd(STAR_ASK.length);
  return {kind:'stardig', shape:'tens', a: b + 1, b, ask, ans: STAR_ASK[ask][1]};
}
// 0 = ✷, 1 = ✹, 2 = ✸ in the pictures
const starNum = (ids, txt) => txt ? ids.map(i => STAR_TXT[i]).join('') : '<span style="white-space:nowrap">' + ids.map(star).join('') + '</span>';
function drawStarDig(q){
  if(q.shape === 'two'){
    const slots = Array.from({length: q.slots}, (_, i) => i ? '<span class="slot" id="slot' + i + '"></span>' : SLOT).join(', ');
    return '<div class="ask">' + tr('Сборът на едноцифреното число ' + star(0) + ' и <span class="num">' + q.a + '</span> е равен на сбора на едноцифреното число ' + star(1) + ' и <span class="num">' + q.b +
      '</span>. Пресметнете ' + star(1) + ' + ' + star(0) + '. Запишете <b>всички</b> възможни сборове.',
      'Сума одноцифрового числа ' + star(0) + ' і <span class="num">' + q.a + '</span> дорівнює сумі одноцифрового числа ' + star(1) + ' і <span class="num">' + q.b +
      '</span>. Обчисліть ' + star(1) + ' + ' + star(0) + '. Запишіть <b>усі</b> можливі суми.') + '</div>' +
      '<div class="line" style="font-size:clamp(26px,7vw,42px)">' + slots + '</div>';
  }
  const want = starNum(STAR_ASK[q.ask][0]);
  return '<div class="ask">' + tr('Сборът на едноцифреното число ' + star(0) + ' и <span class="num">' + q.a + '</span> е равен на сбора на двуцифреното число ' + starNum([2, 1]) + ' и <span class="num">' + q.b +
    '</span>. ' + (q.ask < 3 ? 'Кое е двуцифреното число ' : 'Кое е числото ') + want + '?',
    'Сума одноцифрового числа ' + star(0) + ' і <span class="num">' + q.a + '</span> дорівнює сумі двоцифрового числа ' + starNum([2, 1]) + ' і <span class="num">' + q.b +
    '</span>. ' + (q.ask < 3 ? 'Яке двоцифрове число ' + want : 'Яке число ' + want) + '?') + '</div>' +
    '<div class="line lg">' + want + ' = ' + SLOT + '</div>';
}
function eqStarDig(q){
  if(q.shape === 'two') return '★ + ' + q.a + ' = ✹ + ' + q.b + ' → ' + [q.ans].concat(q.alt).join(', ');
  return '★ + ' + q.a + ' = ✶✹ + ' + q.b + ' → ★ = 9, ✶✹ = 10 → ' + starNum(STAR_ASK[q.ask][0], true) + ' = ' + q.ans;
}
function whyStarDig(q, full){
  if(q.shape === 'two'){
    if(!full) return tr('Кое от двете числа е по-голямо и с колко? И двете са едноцифрени — не повече от девет.', 'Яке з двох чисел більше і на скільки? Обидва одноцифрові — не більші за дев’ять.');
    const d = q.a - q.b, pairs = []; for(let x = 0; x + d <= 9; x++) pairs.push(star(0) + ' = ' + x + ', ' + star(1) + ' = ' + (x + d));
    return star(1) + tr(' е с ', ' більше на ') + (q.a + ' − ' + q.b + ' = <b>' + d + '</b>') + tr(' по-голямо от ', ' за ') + star(0) + ' &nbsp;→&nbsp; ' + pairs.join(tr(' или ', ' або ')) +
      ' &nbsp;→&nbsp; ' + star(1) + ' + ' + star(0) + ' = ' + [q.ans].concat(q.alt).join(tr(' или ', ' або '));
  }
  if(!full) return tr('Колко най-много може да е лявата страна и колко най-малко — дясната?', 'Яким найбільшим може бути ліва частина, а яким найменшим — права?');
  return tr('най-много ', 'щонайбільше ') + '9 + ' + q.a + ' = ' + (9 + q.a) + ', ' + tr('най-малко ', 'щонайменше ') + '10 + ' + q.b + ' = ' + (10 + q.b) +
    tr(' — значи и двете страни са ', ' — отже, обидві частини дорівнюють ') + (9 + q.a) + ' &nbsp;→&nbsp; ' + star(0) + ' = <b>9</b>, ' + starNum([2, 1]) + ' = <b>10</b> &nbsp;→&nbsp; ' +
    starNum(STAR_ASK[q.ask][0]) + ' = ' + q.ans;
}
KIND.stardig = { draw:drawStarDig, eq:eqStarDig, why:whyStarDig };
