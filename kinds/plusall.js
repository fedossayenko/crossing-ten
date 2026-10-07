// Question kind 'plusall': level 261 Всяко с 3 повече — Every number grows by the same amount: how many numbers.

// МБГ Есен 2024, 3 клас, задача 10: several numbers add to 20; each made 3 bigger, they add to 32. Every number
// brings its own 3 to the sum, so the sum grew by 3 once for each number: 32 − 20 = 12, 12 : 3 = 4 numbers.
// Sometimes each is made smaller instead, and the sum shrinks by the same amount once for each.
import { KIND, SLOT, bgWith, rnd, tr } from '../js/core.js';
export function genPlusAll(){
  const n = 3 + rnd(6), k = 2 + rnd(5), more = Math.random() < 0.7;
  // made smaller, every number must be at least k, so the sum at least n · k
  const S = more ? 10 + rnd(41) : n*k + 2 + rnd(30), S2 = more ? S + n*k : S - n*k;
  return {kind:'plusall', n, k, more, S, S2, traps: [n*k], ans: n};
}
function drawPlusAll(q){
  return '<div class="ask">' + tr('Сборът на няколко числа е <span class="num">' + q.S + '</span>. Ако всяко от числата се ' + (q.more ? 'увеличи' : 'намали') + ' ' + bgWith(q.k) +
      ' <span class="num">' + q.k + '</span>, сборът ще стане <span class="num">' + q.S2 + '</span>. <b>Колко на брой са числата?</b>',
    'Сума кількох чисел дорівнює <span class="num">' + q.S + '</span>. Якщо кожне з чисел ' + (q.more ? 'збільшити' : 'зменшити') + ' на <span class="num">' + q.k +
      '</span>, сума стане <span class="num">' + q.S2 + '</span>. <b>Скільки всього чисел?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
const plusAllGap = q => q.more ? q.S2 + ' − ' + q.S : q.S + ' − ' + q.S2;
function eqPlusAll(q){
  return plusAllGap(q) + ' = ' + q.n*q.k + ', ' + q.n*q.k + ' : ' + q.k + ' = ' + q.ans;
}
function whyPlusAll(q, full){
  if(!full) return q.more ? tr('Всяко число добавя към сбора по толкова, с колкото е увеличено. С колко е пораснал целият сбор?',
                               'Кожне число додає до суми стільки, на скільки його збільшили. На скільки зросла вся сума?')
    : tr('Всяко число взема от сбора по толкова, с колкото е намалено. С колко е намалял целият сбор?',
         'Кожне число забирає із суми стільки, на скільки його зменшили. На скільки зменшилася вся сума?');
  return (q.more ? tr('сборът порасна с ', 'сума зросла на ') : tr('сборът намаля с ', 'сума зменшилася на ')) + plusAllGap(q) + ' = <b>' + q.n*q.k + '</b>' +
    tr(', а всяко число ' + (q.more ? 'добавя' : 'взема') + ' по ', ', а кожне число ' + (q.more ? 'додає' : 'забирає') + ' по ') + q.k +
    ' &nbsp;→&nbsp; ' + q.n*q.k + ' : ' + q.k + ' = ' + q.ans;
}
KIND.plusall = { draw:drawPlusAll, eq:eqPlusAll, why:whyPlusAll };
