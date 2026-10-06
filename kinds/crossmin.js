// Question kind 'crossmin': level 166 Зачеркни за най-малко — One digit crossed out of a sum, for the smallest or largest total.

// МБГ Пролет 2023, 1 клас, задача 14: which digit of 19 + 23 to cross out for the smallest sum?
// Every try: 9 + 23 = 32, 1 + 23 = 24, 19 + 3 = 22, 19 + 2 = 21 — the smallest is 21, so the 3.
// The four digits are all different, so the digit names the try.
// [the digit crossed, the sum then] for each of the four digits of x + y
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const crossTries = (x, y) => [[Math.floor(x / 10), x % 10 + y], [x % 10, Math.floor(x / 10) + y], [Math.floor(y / 10), x + y % 10], [y % 10, x + Math.floor(y / 10)]];
// МБГ Пролет 2022, 1 клас, задача 18: three numbers with zeros, 10 + 20 + 30. Crossing the 3 leaves
// 10 + 20 + 0 = 30, the smallest; a crossed 0 turns 10 into 1. Only a digit written once can be the answer,
// so the digit names its try. Each try: [the number, the digit's place, the digit, the sum then].
function crossThreeTries(ns){
  const out = [];
  ns.forEach((n, i) => String(n).split('').forEach((d, j) => {
    const left = String(n).slice(0, j) + String(n).slice(j + 1);
    out.push([i, j, +d, ns.reduce((t, v, k) => t + (k === i ? +left : v), 0)]);
  }));
  return out;
}
function genCrossThree(){
  for(;;){
    const ns = [0, 1, 2].map(() => Math.random() < 0.6 ? 10*(1 + rnd(4)) : 11 + rnd(29));
    if(ns.reduce((t, v) => t + v, 0) > 99 || new Set(ns).size !== 3) continue;
    const least = Math.random() < 0.6, tries = crossThreeTries(ns), sums = tries.map(t => t[3]);
    const best = least ? Math.min(...sums) : Math.max(...sums), at = tries.filter(t => t[3] === best);
    const digits = ns.join('').split('').map(Number);
    if(at.length !== 1 || digits.filter(d => d === at[0][2]).length !== 1) continue;
    const ans = at[0][2];
    return {kind:'crossmin', shape:'three', ns, least, best, traps: [...new Set(digits)].filter(d => d !== ans).slice(0, 3), ans};
  }
}
// МБГ Полуфинал 2022, 1 клас, задача 12: in 8 + 12 one digit was erased, and the sum worked out was one-digit — which
// digit? Erasing the 8 leaves 12, the 1 leaves 8 + 2 = 10, the 2 leaves 8 + 1 = 9: the 2. Built so: x + t ≤ 9 and
// x + u ≥ 10 for x + tu, so only the ones digit u works; u is not x, so the digit names the try. Either order.
function genCrossOne(){
  for(;;){
    const x = 3 + rnd(6), t = 1 + rnd(9 - x), u = 10 - x + rnd(x);
    if(u === x) continue;
    return {kind:'crossmin', shape:'one', ns: Math.random() < 0.3 ? [10*t + u, x] : [x, 10*t + u], best: x + t, traps: [...new Set([x, t, x + t])].filter(d => d !== u), ans: u};
  }
}
// the one-digit question drawn after the others, so a seed that asks one of them keeps asking it
export function genCrossMin(){
  const q = Math.random() < 0.35 ? genCrossThree() : genCrossTwoNums();
  return Math.random() < 0.2 ? genCrossOne() : q;
}
function genCrossTwoNums(){
  for(;;){
    const x = 11 + rnd(89), y = 11 + rnd(89), ds = String(x) + y;
    if(ds.includes('0') || new Set(ds).size !== 4 || x + y > 99) continue;   // every sum tried stays under a hundred
    const least = Math.random() < 0.6, tries = crossTries(x, y), sums = tries.map(t => t[1]);
    const best = least ? Math.min(...sums) : Math.max(...sums);
    if(sums.filter(s => s === best).length !== 1) continue;
    const ans = tries.find(t => t[1] === best)[0];
    return {kind:'crossmin', x, y, least, best, traps: tries.map(t => t[0]).filter(d => d !== ans), ans};   // as А/Б/В/Г, the other three digits
  }
}
const crossSum = q => q.ns ? q.ns.join(' + ') : q.x + ' + ' + q.y;
function drawCrossMin(q){
  if(q.shape === 'one'){
    return '<div class="ask">' + tr('В сбора <span class="num">' + crossSum(q) + '</span> изтрих една цифра. След като го пресметнах вярно, получих <b>едноцифрено</b> число. Коя цифра съм изтрил?',
      'У сумі <span class="num">' + crossSum(q) + '</span> я стер одну цифру. Обчисливши її правильно, я отримав <b>одноцифрове</b> число. Яку цифру я стер?') + '</div>' +
      '<div class="line lg">' + SLOT + '</div>';
  }
  if(q.shape === 'three'){
    return '<div class="ask">' + tr('Коя цифра трябва да зачеркнем в <span class="num">' + crossSum(q) + '</span>, така че да се получи <b>' + (q.least ? 'най-малък' : 'най-голям') + '</b> сбор?',
      'Яку цифру треба закреслити в <span class="num">' + crossSum(q) + '</span>, щоб вийшла <b>' + (q.least ? 'найменша' : 'найбільша') + '</b> сума?') + '</div>' +
      '<div class="line lg">' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr('Коя цифра трябва да зачеркнем в <span class="num">' + q.x + ' + ' + q.y + '</span>, така че да се получи <b>' + (q.least ? 'най-малкият' : 'най-големият') + '</b> сбор?',
    'Яку цифру треба закреслити в <span class="num">' + q.x + ' + ' + q.y + '</span>, щоб вийшла <b>' + (q.least ? 'найменша' : 'найбільша') + '</b> сума?') + '</div>' +
    '<div class="line lg">' + SLOT + '</div>';
}
function eqCrossMin(q){
  if(q.shape === 'one') return crossSum(q) + ', ' + tr('едноцифрен сбор ', 'одноцифрова сума ') + q.best + ' → ' + q.ans;
  return crossSum(q) + ', ' + tr(q.least ? 'най-малък ' : 'най-голям ', q.least ? 'найменша ' : 'найбільша ') + q.best + ' → ' + q.ans;
}
function whyCrossMin(q, full){
  if(!full) return q.shape === 'one' ? tr('Изтрий всяка цифра поред и пресметни сбора, който остава. Кога се получава едноцифрено число?',
    'Зітри по черзі кожну цифру й обчисли суму, що лишається. Коли виходить одноцифрове число?')
    : tr('Зачеркни всяка цифра поред и пресметни сбора, който остава. После сравни.',
    'Закресли по черзі кожну цифру й обчисли суму, що лишається. Потім порівняй.');
  // every try written out, the crossed digit struck through where it stands
  const one = t => q.ns.map((n, k) => k === t[0] ? String(n).split('').map((d, j) => j === t[1] ? '<s>' + d + '</s>' : d).join('') : n).join(' + ');
  if(q.shape === 'one'){
    return crossThreeTries(q.ns).map(t => one(t) + ' = ' + (t[3] < 10 ? '<b>' + t[3] + '</b>' : t[3])).join(', &nbsp;') +
      ' &nbsp;→&nbsp; ' + tr('едноцифрено е само ', 'одноцифрове лише ') + q.best + tr(', изтрита е цифрата ', ', стерто цифру ') + q.ans;
  }
  if(q.shape === 'three'){
    return crossThreeTries(q.ns).map(t => one(t) + ' = ' + (t[3] === q.best ? '<b>' + t[3] + '</b>' : t[3])).join(', &nbsp;') +
      ' &nbsp;→&nbsp; ' + tr(q.least ? 'най-малкият е ' : 'най-големият е ', q.least ? 'найменша — ' : 'найбільша — ') + q.best + tr(', зачеркваме ', ', закреслюємо ') + q.ans;
  }
  const [x, y] = [String(q.x), String(q.y)], rest = [x[1] + ' + ' + y, x[0] + ' + ' + y, x + ' + ' + y[1], x + ' + ' + y[0]];
  return crossTries(q.x, q.y).map((t, i) => '<s>' + t[0] + '</s>: ' + rest[i] + ' = ' + (t[1] === q.best ? '<b>' + t[1] + '</b>' : t[1])).join(', &nbsp;') +
    ' &nbsp;→&nbsp; ' + tr(q.least ? 'най-малкият е ' : 'най-големият е ', q.least ? 'найменша — ' : 'найбільша — ') + q.best + tr(', зачеркваме ', ', закреслюємо ') + q.ans;
}
KIND.crossmin = { draw:drawCrossMin, eq:eqCrossMin, why:whyCrossMin };
