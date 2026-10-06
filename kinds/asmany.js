// Question kind 'asmany': level 134 Толкова, колкото — Two counts of odd and even numbers made equal: where the second run ends.

// МБГ Пролет 2025, задача 8: the even numbers from 1 to 11 are as many as the odd numbers from 12 to the
// even number X. Evens up to 11: 2, 4, 6, 8, 10 — five. Odd from 12 on: 13, 15, 17, 19, 21 — five,
// and the even number after 21 is 22.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genAsMany(){
  for(;;){
    const evenFirst = Math.random() < 0.6, n = 7 + rnd(10), s = 10 + rnd(20);
    const E = [...Array(n).keys()].map(v => v + 1).filter(v => evenFirst ? v % 2 === 0 : v % 2).length;
    // the second run: the other parity, from s to X, X of the first parity
    if((s % 2 === 0) !== evenFirst) continue;
    return {kind:'asmany', evenFirst, n, s, E, traps:[s + 2*E - 1], ans: s + 2*E};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 18: the numbers from 2 to ☺ are as many as the numbers from ☺ to 20 — ☺?
// ☺ = 10 leaves 9 against 11, so one on: ☺ = 11, ten numbers each side (☺ itself counted in both).
// Полуфинал 2023, задача 18: from 10 to ☻ as many as from ☻ to 32 — ☻ = 21, twelve each side.
// a up to 10 and b up to 32 are drawn after the old question, so a seed recorded before them still asks what it asked
export function genAsManyMid(){
  const q = asManyMid(9, 17);
  return Math.random() < 0.2 ? asManyMid(10, 19, true) : q;
}
function asManyMid(am, bm, wide){
  for(;;){
    const a = 1 + rnd(am), b = 14 + rnd(bm);
    if((a + b) % 2 || (wide && a <= 9 && b <= 30)) continue;
    const m = (a + b) / 2;
    return {kind:'asmany', shape:'mid', a, b, traps: [...new Set([b % 2 ? m - 1 : b / 2, b - a, (b - a) / 2])].filter(v => v !== m), ans: m};
  }
}
function drawAsMany(q){
  if(q.shape === 'mid'){
    return '<div class="ask">' + tr('Числата от <span class="num">' + q.a + '</span> до ☺ са толкова, колкото са числата от ☺ до <span class="num">' + q.b + '</span>. Кое число е ☺?',
      'Чисел від <span class="num">' + q.a + '</span> до ☺ стільки ж, скільки чисел від ☺ до <span class="num">' + q.b + '</span>. Яке число ☺?') + '</div>' +
      '<div class="line xl"><span class="num">☺ = </span>' + SLOT + '</div>';
  }
  const [p1, p2] = q.evenFirst ? [tr('Четните', 'Парних'), tr('нечетните', 'непарних')] : [tr('Нечетните', 'Непарних'), tr('четните', 'парних')];
  const x = q.evenFirst ? tr('четното', 'парного') : tr('нечетното', 'непарного');
  return '<div class="ask">' + tr(p1 + ' числа от 1 до <span class="num">' + q.n + '</span> са толкова, колкото ' + p2 + ' числа от <span class="num">' + q.s + '</span> до ' + x + ' число X. Кое е числото X?',
    p1 + ' чисел від 1 до <span class="num">' + q.n + '</span> стільки ж, скільки ' + p2 + ' чисел від <span class="num">' + q.s + '</span> до ' + x + ' числа X. Яке число X?') + '</div>' +
    '<div class="line xl">X = ' + SLOT + '</div>';
}
function asManyRuns(q){
  const a = [], b = [];
  for(let v = 1; v <= q.n; v++) if((v % 2 === 0) === q.evenFirst) a.push(v);
  for(let v = q.s; v <= q.ans; v++) if((v % 2 === 0) !== q.evenFirst) b.push(v);
  return [a, b];
}
// ☺ = g: how many from a to g, and from g to b, both ends counted
const asManyMidTry = (q, g) => '☺ = ' + g + ': ' + q.a + ' … ' + g + ' → <b>' + (g - q.a + 1) + '</b>, ' + g + ' … ' + q.b + ' → <b>' + (q.b - g + 1) + '</b>';
function eqAsMany(q){
  if(q.shape === 'mid') return q.a + ' … ' + q.ans + ': ' + (q.ans - q.a + 1) + ', ' + q.ans + ' … ' + q.b + ': ' + (q.b - q.ans + 1) + ' → ' + q.ans;
  const [a, b] = asManyRuns(q); return a.length + ': ' + b.join(', ') + ' → ' + q.ans; 
}
function whyAsMany(q, full){
  if(q.shape === 'mid'){
    if(!full) return tr('Опитай едно число за ☺ и преброй числата от двете страни — ☺ се брои и в двете. Където са повече, натам премести ☺.',
      'Спробуй якесь число замість ☺ і порахуй числа з обох боків — ☺ рахується в обох. Де їх більше, туди й посунь ☺.');
    return tr('☺ се брои и в двете групи. ', '☺ рахується в обох групах. ') + asManyMidTry(q, q.ans - 1) + ' &nbsp;→&nbsp; ' + asManyMidTry(q, q.ans).replace(/<\/b>$/, '</b> ✓') + ' &nbsp;→&nbsp; ☺ = ' + q.ans;
  }
  if(!full) return tr('Първо преброй числата в първата редица. После изреди толкова от втората — и виж кое число идва след последното.', 'Спершу порахуй числа першого ряду. Потім випиши стільки ж із другого — і подивись, яке число йде після останнього.');
  const [a, b] = asManyRuns(q);
  return a.join(', ') + ' &nbsp;→&nbsp; <b>' + a.length + '</b>; &nbsp;' + b.join(', ') + ' &nbsp;→&nbsp; ' + tr('следващото е ', 'наступне — ') + q.ans;
}
KIND.asmany = { draw:drawAsMany, eq:eqAsMany, why:whyAsMany };
