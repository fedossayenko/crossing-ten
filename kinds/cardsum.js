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
// Салабашев 2025, 2 клас, задача 13: the smallest sum of three even two-digit numbers whose six digits all differ. No digits are given:
// the tens weigh most, so they are 1, 2 and 3 (not 0), and the ones are the smallest even digits left — 0, 4 and 6, as 2 is a tens digit:
// 10 + 24 + 36 = 70. Level 478. The same task for odd numbers (81) and for the largest sum (252, 249). check/sal-S4.js checks the
// greedy choice against every choice of three tens and three ones digits.
export function genCardFree(){
  const odd = Math.random() < 0.3, big = Math.random() < 0.3;
  const tens = big ? [9, 8, 7] : [1, 2, 3], pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => d % 2 === (odd ? 1 : 0)).sort((x, y) => big ? y - x : x - y);
  const free = pool.filter(d => !tens.includes(d)), ones = free.slice(0, 3), wit = tens.map((t, i) => 10*t + ones[i]), ans = wit.reduce((t, v) => t + v, 0);
  // the slip: the tens only, the ones taken as the same smallest (or largest) digit again and again
  const naive = 10*tens.reduce((t, v) => t + v, 0) + 3*(big ? (odd ? 9 : 8) : (odd ? 1 : 0));
  return {kind:'cardsum', shape:'free', odd, big, tens, ones, wit, traps:[naive].filter(v => v !== ans), ans};
}
function drawCardSum(q){
  if(q.shape === 'free') return '<div class="ask">' + tr('Кой е най-' + (q.big ? 'големият' : 'малкият') + ' възможен сбор на три ' + (q.odd ? 'нечетни' : 'четни') + ' двуцифрени числа, чиито шест цифри са различни помежду си?',
    'Яка ' + (q.big ? 'найбільша' : 'найменша') + ' можлива сума трьох ' + (q.odd ? 'непарних' : 'парних') + ' двоцифрових чисел, шість цифр яких різні між собою?') + '</div>' +
    '<div class="given"><span class="circle">□□</span> + <span class="circle">□□</span> + <span class="circle">□□</span></div><div class="line xl">' + SLOT + '</div>';
  return '<div class="ask">' + tr('Разпределете числата <span class="num">' + bgList(q.digits) + '</span> в четирите квадратчета и намерете възможно най-' + (q.big ? 'големия' : 'малкия') + ' сбор на двете двуцифрени числа, които се получават.',
    'Розподіліть цифри <span class="num">' + q.digits.slice(0, -1).join(', ') + ' і ' + q.digits[3] + '</span> у чотири клітинки й знайдіть ' + (q.big ? 'найбільшу' : 'найменшу') + ' можливу суму двох отриманих двоцифрових чисел.') + '</div>' +
    '<div class="given"><span class="circle">□□</span> + <span class="circle">□□</span></div><div class="line xl">' + SLOT + '</div>';
}
function eqCardSum(q){ if(q.shape === 'free') return q.wit.join(' + ') + ' = ' + q.ans; return q.digits.join(', ') + ' → ' + q.wit[0] + ' + ' + q.wit[1] + ' = ' + q.ans; }
function whyCardSum(q, full){
  if(q.shape === 'free'){
    if(!full) return tr('Десетиците тежат повече от единиците. Числата са ' + (q.odd ? 'нечетни' : 'четни') + ', значи единиците са ' + (q.odd ? '1, 3, 5, 7 или 9' : '0, 2, 4, 6 или 8') + ' — и никоя цифра не се повтаря.',
      'Десятки важать більше за одиниці. Числа ' + (q.odd ? 'непарні' : 'парні') + ', тож одиниці — ' + (q.odd ? '1, 3, 5, 7 або 9' : '0, 2, 4, 6 або 8') + ' — і жодна цифра не повторюється.');
    const par = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => d % 2 === (q.odd ? 1 : 0)).sort((x, y) => q.big ? y - x : x - y), last = q.ones[2];
    const skipped = par.slice(0, par.indexOf(last)).filter(d => q.tens.includes(d)), sk = skipped.length === 1 ? tr(' (' + skipped[0] + ' вече е десетици)', ' (вже взято на десятки: ' + skipped[0] + ')') : skipped.length ? tr(' (' + bgList(skipped) + ' вече са десетици)', ' (вже взято на десятки: ' + bgList(skipped) + ')') : '';
    return tr('десетици: ' + (q.big ? 'най-големите цифри' : 'най-малките цифри, не нулата,') + ' ' + q.tens.join(', ') + '; единици: ' + (q.odd ? 'нечетните' : 'четните') + ', които не са вече ползвани, ' + (q.big ? 'от най-голямата' : 'от най-малката') + ' — ' + q.ones.join(', ') + sk + ' &nbsp;→&nbsp; ' + q.wit.join(' + ') + ' = <b>' + q.ans + '</b>',
      'десятки: ' + (q.big ? 'найбільші цифри' : 'найменші цифри, не нуль,') + ' ' + q.tens.join(', ') + '; одиниці: ' + (q.odd ? 'непарні' : 'парні') + ', які ще не використані, ' + (q.big ? 'від найбільшої' : 'від найменшої') + ' — ' + q.ones.join(', ') + sk + ' &nbsp;→&nbsp; ' + q.wit.join(' + ') + ' = <b>' + q.ans + '</b>');
  }
  if(!full) return tr('Десетиците тежат повече от единиците. Кои цифри трябва да са десетици, за да е сборът ' + (q.big ? 'най-голям' : 'най-малък') + '?', 'Десятки важать більше за одиниці. Які цифри мають бути десятками, щоб сума була ' + (q.big ? 'найбільшою' : 'найменшою') + '?');
  const s = q.digits, tens = q.big ? [s[3], s[2]] : [s[0], s[1]], ones = q.big ? [s[1], s[0]] : [s[2], s[3]];
  return tr('десетици: ' + (q.big ? 'най-големите' : 'най-малките') + ' цифри ' + tens[0] + ' и ' + tens[1] + '; единици: ' + ones[0] + ' и ' + ones[1] + ' &nbsp;→&nbsp; ' + q.wit[0] + ' + ' + q.wit[1] + ' = <b>' + q.ans + '</b>',
    'десятки: ' + (q.big ? 'найбільші' : 'найменші') + ' цифри ' + tens[0] + ' і ' + tens[1] + '; одиниці: ' + ones[0] + ' і ' + ones[1] + ' &nbsp;→&nbsp; ' + q.wit[0] + ' + ' + q.wit[1] + ' = <b>' + q.ans + '</b>');
}
KIND.cardsum = { draw:drawCardSum, eq:eqCardSum, why:whyCardSum };
