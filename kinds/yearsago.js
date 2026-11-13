// Question kind 'yearsago': level 333 Преди и след — two children's ages together some years ago (or some years on),
// one of them now: the other now. Each of the two was younger (older) by those years, so the sum differs by twice that.

// Кенгуру 2025, задача 20: three years ago Ани and Боби together were 6; Ани is 7 now. Now together 6 + 3 + 3 = 12,
// and 12 − 7 = 5. Taking only one lot of 3 years (6 + 3 − 7 = 2) is the trap.
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
const yaPairs = [['Ани', 'Боби', 'Ані', 'Бобі'], ['Мая', 'Ники', 'Мая', 'Ніки'], ['Ема', 'Васко', 'Ема', 'Васко']];
const yaYears = n => n === 1 ? 'година' : 'години';
const yaUk = n => ukN(n, 'рік', 'роки', 'років').replace(/^(\d+)/, num('$1'));
export function genYearsAgo(){
  for(;;){
    const ago = Math.random() < 0.7, y = 2 + rnd(4), nm = rnd(yaPairs.length), a = 4 + rnd(8), b = 3 + rnd(9);
    // ago: the sum then is (a + b) − 2y; later: the sum then is (a + b) + 2y. Both were already born (ago: at least 1 year old)
    if(ago && (a - y < 1 || b - y < 1)) continue;
    const T = ago ? a + b - 2*y : a + b + 2*y;
    return {kind:'yearsago', ago, y, nm, a, T, traps:[ago ? T + y - a : T - y - a], ans: b};
  }
}
function drawYearsAgo(q){
  const [x, z, ux, uz] = yaPairs[q.nm];
  return '<div class="ask">' + tr((q.ago ? 'Преди ' + num(q.y) + ' ' + yaYears(q.y) + ' сборът от годините на ' + x + ' и ' + z + ' е бил ' + num(q.T) : 'След ' + num(q.y) + ' ' + yaYears(q.y) + ' сборът от годините на ' + x + ' и ' + z + ' ще бъде ' + num(q.T)) +
      '. Сега ' + x + ' е на ' + num(q.a) + ' ' + yaYears(q.a) + '. <b>На колко години е ' + z + ' сега?</b>',
    (q.ago ? yaUk(q.y) + ' тому сума років ' + ux + ' і ' + uz + ' дорівнювала ' + num(q.T) : 'Через ' + yaUk(q.y) + ' сума років ' + ux + ' і ' + uz + ' дорівнюватиме ' + num(q.T)) +
      '. Зараз ' + ux + ' ' + yaUk(q.a) + '. <b>Скільки років ' + uz + ' зараз?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqYearsAgo(q){
  const now = q.ago ? q.T + ' + ' + q.y + ' + ' + q.y : q.T + ' − ' + q.y + ' − ' + q.y;
  return now + ' = ' + (q.a + q.ans) + ', ' + (q.a + q.ans) + ' − ' + q.a + ' = ' + q.ans;
}
function whyYearsAgo(q, full){
  const [x, z, ux, uz] = yaPairs[q.nm];
  if(!full) return q.ago ? tr('Колко години по-малки са били и двамата тогава? Колко е сборът сега?', 'На скільки років молодшими були обоє тоді? Яка сума зараз?')
    : tr('Колко години по-големи ще са и двамата тогава? Колко е сборът сега?', 'На скільки років старшими будуть обоє тоді? Яка сума зараз?');
  const sum = q.a + q.ans;
  return tr('и двамата са с ' + q.y + ' ' + yaYears(q.y) + (q.ago ? ' по-големи сега' : ' по-малки сега') + ', значи сборът сега е с ' + q.y + ' + ' + q.y + ' ' + (q.ago ? 'по-голям' : 'по-малък') + ': ' + eqYearsAgo(q).split(', ')[0] + '. ' + x + ' е на ' + q.a + ', значи ' + z + ' е ' + sum + ' − ' + q.a + ' = <b>' + q.ans + '</b>',
            'обоє ' + (q.ago ? 'старші' : 'молодші') + ' зараз на ' + yaUk(q.y).replace(/<[^>]*>/g, '') + ', тож сума зараз ' + (q.ago ? 'більша' : 'менша') + ' на ' + q.y + ' + ' + q.y + ': ' + eqYearsAgo(q).split(', ')[0] + '. ' + ux + ' ' + q.a + ', отже ' + uz + ' ' + sum + ' − ' + q.a + ' = <b>' + q.ans + '</b>');
}
KIND.yearsago = { draw:drawYearsAgo, eq:eqYearsAgo, why:whyYearsAgo };
