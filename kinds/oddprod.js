// Question kind 'oddprod': level 66 Цифрата на единиците — Two one-digit numbers a set distance apart, and the digits their product can end in.

// МБГ Есен, 3 клас, задача 8: two odd one-digit numbers differ by 2 and their product has two
// digits. The pairs are 3 · 5 = 15, 5 · 7 = 35, 7 · 9 = 63 (1 · 3 = 3 has one digit), so the
// units digit is 5 or 3. Every pair is listed; the answers are the different digits, in any order.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genOddProd(){
  for(;;){
    const odd = Math.random() < 0.7, d = Math.random() < 0.6 ? 2 : 4, tens = Math.random() < 0.3;
    const pairs = [];
    for(let x = 0; x + d <= 9; x++) if(x % 2 === (odd ? 1 : 0)) pairs.push([x, x + d]);
    const two = pairs.filter(([x, y]) => x*y >= 10 && x*y <= 99);
    const digits = [...new Set(two.map(([x, y]) => tens ? Math.floor(x*y / 10) : x*y % 10))];
    if(digits.length < 2 || digits.length > 3 || two.length === digits.length && two.length < 2) continue;
    return {kind:'oddprod', odd, d, tens, pairs, two, slots: digits.length, ans: digits[0], alt: digits.slice(1)};
  }
}
// МБГ Есен 2024, 3 клас, задача 7: the units digits the product of two consecutive even numbers can end in — any numbers,
// not only one-digit ones. Only the two units digits decide it, and they come round every ten: 0 · 2, 2 · 4, 4 · 6, 6 · 8
// and 8 · 10 end in 0, 8, 4, 8 and 0 (12 · 14 = 168 ends as 2 · 4 does), so 0, 4 or 8. Asked the same way: two consecutive
// odd numbers (3, 5 or 9), two consecutive numbers (0, 2 or 6), two even or two odd numbers 4 apart (0, 2 or 6; 1, 5 or 7).
/** @type {[string, number][]} */
const CONSEC = [['even', 2], ['even', 2], ['odd', 2], ['all', 1], ['even', 4], ['odd', 4]];
export function genConsecProd(){
  const [par, d] = CONSEC[rnd(CONSEC.length)], pairs = [];
  for(let x = par === 'odd' ? 1 : 0; x < 10; x += par === 'all' ? 1 : 2) pairs.push([x, x + d]);
  const digits = [...new Set(pairs.map(([x, y]) => x*y % 10))].sort((a, b) => a - b);
  return {kind:'oddprod', shape:'any', par, d, pairs, slots: digits.length, ans: digits[0], alt: digits.slice(1)};
}
function consecAsk(q){
  const bg = {even:'<b>четни</b> ', odd:'<b>нечетни</b> ', all:''}[q.par], uk = {even:'<b>парних</b> ', odd:'<b>непарних</b> ', all:''}[q.par];
  return q.d === 4
    ? tr('Разликата на две ' + bg + 'числа е <span class="num">4</span>. Кои са възможните цифри на единиците на произведението им?',
         'Різниця двох ' + uk + 'чисел дорівнює <span class="num">4</span>. Якими можуть бути цифри одиниць їхнього добутку?')
    : tr('Кои са възможните цифри на единиците на произведението на две последователни ' + bg + 'числа?',
         'Якими можуть бути цифри одиниць добутку двох послідовних ' + uk + 'чисел?');
}
function drawOddProd(q){
  const more = [];
  for(let i = 1; i < q.slots; i++) more.push(' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot' + i + '"></span>');
  if(q.shape === 'any') return '<div class="ask">' + consecAsk(q) + '</div>' + '<div class="line md">' + SLOT + more.join('') + '</div>';
  return '<div class="ask">' + tr('Разликата на две <b>' + (q.odd ? 'нечетни' : 'четни') + '</b> едноцифрени числа е <span class="num">' + q.d +
    '</span>, а произведението им е двуцифрено число. Кои са възможните цифри на <b>' + (q.tens ? 'десетиците' : 'единиците') + '</b> на произведението?',
    'Різниця двох <b>' + (q.odd ? 'непарних' : 'парних') + '</b> одноцифрових чисел дорівнює <span class="num">' + q.d +
    '</span>, а їхній добуток — двоцифрове число. Якими можуть бути цифри <b>' + (q.tens ? 'десятків' : 'одиниць') + '</b> добутку?') + '</div>' +
    '<div class="line md">' + SLOT + more.join('') + '</div>';
}
function eqOddProd(q){
  return (q.shape === 'any' ? q.pairs : q.two).map(([x, y]) => x + ' · ' + y + ' = ' + x*y).join(', ') + ' → ' + [q.ans].concat(q.alt).join(', ');
}
function whyOddProd(q, full){
  if(q.shape === 'any'){
    if(!full) return tr('Цифрата на единиците на произведението зависи само от цифрите на единиците на двете числа. Пробвай всички възможни.',
                        'Цифра одиниць добутку залежить лише від цифр одиниць обох чисел. Спробуй усі можливі.');
    // the units digit of each product in bold, then one pair past ten that ends the same way
    const [x, y] = q.pairs[1], X = x + 10, Y = y + 10, units = v => v < 10 ? '<b>' + v + '</b>' : Math.floor(v / 10) + '<b>' + v % 10 + '</b>';
    return tr('важат само единиците: ', 'важать лише одиниці: ') + q.pairs.map(([a, b]) => a + ' · ' + b + ' = ' + units(a*b)).join(', ') +
      tr(' (и ' + X + ' · ' + Y + ' = ' + X*Y + ' завършва на същата цифра като ' + x + ' · ' + y + ')', ' (і ' + X + ' · ' + Y + ' = ' + X*Y + ' закінчується тією самою цифрою, що й ' + x + ' · ' + y + ')') +
      ' &nbsp;→&nbsp; ' + [q.ans].concat(q.alt).join(tr(' или ', ' або '));
  }
  if(!full) return tr('Изброй всички двойки с разлика ' + q.d + ' и ги умножи; остави само двуцифрените.',
                      'Випиши всі пари з різницею ' + q.d + ' і перемнож їх; залиш лише двоцифрові добутки.');
  const one = q.pairs.filter(([x, y]) => x*y < 10).map(([x, y]) => x + ' · ' + y + ' = ' + x*y);
  return q.two.map(([x, y]) => x + ' · ' + y + ' = <b>' + x*y + '</b>').join(', ') +
    (one.length ? tr(' &nbsp;(' + one.join(', ') + ' е едноцифрено)', ' &nbsp;(' + one.join(', ') + ' — одноцифрове)') : '') +
    ' &nbsp;→&nbsp; ' + [q.ans].concat(q.alt).join(tr(' или ', ' або '));
}
KIND.oddprod = { draw:drawOddProd, eq:eqOddProd, why:whyOddProd };
