// Question kind 'agesum': level 266 Сборът на годините — When the ages of a few children add up to a number.

// МБГ Есен 2023, 3 клас, задача 17: Иван and Стефан are 10, Петър is 11. In how many years will their ages add up to 43?
// Now they add up to 10 + 10 + 11 = 31, and every year each of the three is a year older, so the sum grows by 3 a year:
// 43 − 31 = 12, 12 : 3 = 4 years. Sometimes the question goes back: how many years ago did they add up to less.
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
// the children, two groups of the same age: [Bulgarian, Ukrainian dative]
const AGESUM_KIDS = [[['Иван', 'Іванові'], ['Стефан', 'Стефанові']], [['Петър', 'Петрові'], ['Мартин', 'Мартинові']]];
export function genAgeSum(){
  for(;;){
    // g1, g2: how many children are a, how many b — 2 and 1, 1 and 2, or 2 and 2
    const sizes = [[2, 1], [1, 2], [2, 2]][rnd(3)], a = 5 + rnd(8), b = 5 + rnd(9), y = 2 + rnd(8), ago = Math.random() < 0.25;
    if(a === b || (ago && Math.min(a, b) <= y)) continue;
    const [g1, g2] = sizes, n = g1 + g2, S = g1*a + g2*b, T = ago ? S - n*y : S + n*y;
    return {kind:'agesum', g1, g2, a, b, ago, S, T, traps: [Math.abs(T - S)], ans: y};
  }
}
const agesumYears = n => ukN(n, 'рік', 'роки', 'років');
function drawAgeSum(q){
  const k1 = AGESUM_KIDS[0].slice(0, q.g1), k2 = AGESUM_KIDS[1].slice(0, q.g2), num = n => '<span class="num">' + n + '</span>';
  const bg = (k, n) => k.map(c => c[0]).join(' и ') + (k.length > 1 ? ' са на ' : ' е на ') + num(n);
  const uk = (k, n) => k.map(c => c[1]).join(' й ') + (k.length > 1 ? ' по ' : ' ') + agesumYears(n).replace(/^(\d+)/, num('$1'));
  return '<div class="ask">' + tr(bg(k1, q.a) + ' години, а ' + bg(k2, q.b) + '. ' +
      (q.ago ? '<b>Преди колко години сборът на годините им е бил ' + num(q.T) + '?</b>' : '<b>След колко години сборът на годините им ще е ' + num(q.T) + '?</b>'),
    uk(k1, q.a) + ', а ' + uk(k2, q.b) + '. ' +
      (q.ago ? '<b>Скільки років тому сума їхніх років дорівнювала ' + num(q.T) + '?</b>' : '<b>Через скільки років сума їхніх років дорівнюватиме ' + num(q.T) + '?</b>')) + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
const agesumNow = q => Array(q.g1).fill(q.a).concat(Array(q.g2).fill(q.b)).join(' + ') + ' = ' + q.S;
const agesumGap = q => q.ago ? q.S + ' − ' + q.T : q.T + ' − ' + q.S;
function eqAgeSum(q){
  return agesumNow(q) + ', ' + agesumGap(q) + ' = ' + Math.abs(q.T - q.S) + ', ' + Math.abs(q.T - q.S) + ' : ' + (q.g1 + q.g2) + ' = ' + q.ans;
}
function whyAgeSum(q, full){
  if(!full) return q.ago ? tr('С колко е бил по-малък сборът една година по-рано? Всяко от децата е било с година по-малко.', 'На скільки меншою була сума роком раніше? Кожна дитина була на рік молодшою.')
    : tr('С колко расте сборът за една година? Всяко от децата става с година по-голямо.', 'На скільки зростає сума за один рік? Кожна дитина стає на рік старшою.');
  const n = q.g1 + q.g2, d = Math.abs(q.T - q.S);
  return tr('сега: ', 'зараз: ') + agesumNow(q) + ' &nbsp;→&nbsp; ' + agesumGap(q) + ' = <b>' + d + '</b>' +
    (q.ago ? tr('; всяка година назад сборът е с ' + n + ' по-малък', '; кожен рік назад сума на ' + n + ' менша') : tr('; всяка година сборът расте с ' + n, '; щороку сума зростає на ' + n)) +
    tr(' — по 1 за всяко дете', ' — по 1 на кожну дитину') + ' &nbsp;→&nbsp; ' + d + ' : ' + n + ' = ' + q.ans;
}
KIND.agesum = { draw:drawAgeSum, eq:eqAgeSum, why:whyAgeSum };
