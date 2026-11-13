// Question kind 'cardsum': level 342 — four digit cards in □□ + □□, the largest (or the smallest) sum.

// Кенгуру 2025, 2 клас, задача 17: 2, 3, 4, 5 into □□ + □□, the largest sum: the tens weigh most, so 5 and 4 take them,
// 53 + 42 = 95. The smallest sum takes the other end: 2 and 3 for the tens, 24 + 35 = 59.
import { KIND, SLOT, bgList, shuffle, tr } from '../js/core.js';
export function genCardSum(){
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((x, y) => x - y), big = Math.random() < 0.7, [a, b, c, d] = digits;
  const wit = big ? [10*d + b, 10*c + a] : [10*a + c, 10*b + d], ans = wit[0] + wit[1];
  if(ans > 99) return genCardSum();   // the paper's sums stay under 100
  const other = big ? 10*(a + b) + c + d : 10*(c + d) + a + b;
  return {kind:'cardsum', digits, big, wit, traps:[other], ans};
}
function drawCardSum(q){
  return '<div class="ask">' + tr('Разпределете числата <span class="num">' + bgList(q.digits) + '</span> в четирите квадратчета и намерете възможно най-' + (q.big ? 'големия' : 'малкия') + ' сбор на двете двуцифрени числа, които се получават.',
    'Розподіліть цифри <span class="num">' + q.digits.slice(0, -1).join(', ') + ' і ' + q.digits[3] + '</span> у чотири клітинки й знайдіть ' + (q.big ? 'найбільшу' : 'найменшу') + ' можливу суму двох отриманих двоцифрових чисел.') + '</div>' +
    '<div class="given"><span class="circle">□□</span> + <span class="circle">□□</span></div><div class="line xl">' + SLOT + '</div>';
}
function eqCardSum(q){ return q.digits.join(', ') + ' → ' + q.wit[0] + ' + ' + q.wit[1] + ' = ' + q.ans; }
function whyCardSum(q, full){
  if(!full) return tr('Десетиците тежат повече от единиците. Кои цифри трябва да са десетици, за да е сборът ' + (q.big ? 'най-голям' : 'най-малък') + '?', 'Десятки важать більше за одиниці. Які цифри мають бути десятками, щоб сума була ' + (q.big ? 'найбільшою' : 'найменшою') + '?');
  const s = q.digits, tens = q.big ? [s[3], s[2]] : [s[0], s[1]], ones = q.big ? [s[1], s[0]] : [s[2], s[3]];
  return tr('десетици: ' + (q.big ? 'най-големите' : 'най-малките') + ' цифри ' + tens[0] + ' и ' + tens[1] + '; единици: ' + ones[0] + ' и ' + ones[1] + ' &nbsp;→&nbsp; ' + q.wit[0] + ' + ' + q.wit[1] + ' = <b>' + q.ans + '</b>',
    'десятки: ' + (q.big ? 'найбільші' : 'найменші') + ' цифри ' + tens[0] + ' і ' + tens[1] + '; одиниці: ' + ones[0] + ' і ' + ones[1] + ' &nbsp;→&nbsp; ' + q.wit[0] + ' + ' + q.wit[1] + ' = <b>' + q.ans + '</b>');
}
KIND.cardsum = { draw:drawCardSum, eq:eqCardSum, why:whyCardSum };
