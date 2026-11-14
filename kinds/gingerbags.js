// Question kind 'gingerbags': level 468 Торбичките с меденки — Four bags, clues about totals and names: how many in one of them.

// Салабашев 2025, 2 клас, задача 9: Ния, Ная, Мия and Мая each have a bag of gingerbread; 47 in all four, 23 in three of them, 12 in the two
// bags of the girls whose names begin with Н, Мая has fewer than Мия, and Ная 4 fewer than Мая — how many has Ния? Мия and Мая are
// 47 − 12 = 35 together; the bag outside the three holds 47 − 23 = 24, and it can only be Мия's: then Мая 35 − 24 = 11, Ная 11 − 4 = 7 and
// Ния 12 − 7 = 5, and 5 + 7 + 11 = 23 holds. The generator keeps only the draws with exactly one such set of four numbers.
import { KIND, answerLine, rnd, tr, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// every set of four counts [Ния, Ная, Мия, Мая] that fits the clues: the total T, three of them S, the two Н-names N, Мая < Мия, Ная = Мая − 4
export function bagSolutions(T, S, N){
  const out = [];
  for(let d = 5; d < T; d++){
    const b = d - 4, a = N - b, c = T - a - b - d;
    if(a < 1 || c <= d) continue;
    const bag = [a, b, c, d];
    if(bag.some(v => T - v === S)) out.push(bag);
  }
  return out;
}
export function genGingerBags(){
  for(;;){
    const d = 6 + rnd(15), b = d - 4, a = 3 + rnd(14), c = 18 + rnd(14), T = a + b + c + d;
    if(c <= d || c <= a || c <= b) continue;
    const S = T - c, N = a + b, sol = bagSolutions(T, S, N);
    if(sol.length !== 1 || sol[0].join() !== [a, b, c, d].join()) continue;
    return {kind:'gingerbags', a, b, c, d, T, S, N, traps:[T - S].filter(v => v !== a), ans: a};
  }
}
function drawGingerBags(q){
  return '<div class="ask">' + tr('Всяка от приятелките Ния, Ная, Мия и Мая има по една торбичка с меденки. Общо в четирите торбички има ' + num(q.T) + ' меденки, а в три от тях има общо ' + num(q.S) + ' меденки. В торбичките на момичетата, чиито имена започват с буквата „Н“, има общо ' + num(q.N) + ' меденки. Мая има по-малко меденки от Мия, а Ная има с 4 меденки по-малко от Мая. <b>Колко меденки има в торбичката на Ния?</b>',
    'Кожна з подруг Нія, Ная, Мія і Мая має по одному пакетику з пряниками. Усього в чотирьох пакетиках ' + ukPl(q.T, 'пряник', 'пряники', 'пряників') + ', а в трьох із них разом ' + ukPl(q.S, 'пряник', 'пряники', 'пряників') + '. У пакетиках дівчат, імена яких починаються на літеру «Н», разом ' + ukPl(q.N, 'пряник', 'пряники', 'пряників') + '. У Маї пряників менше, ніж у Мії, а в Наї на 4 пряники менше, ніж у Маї. <b>Скільки пряників у пакетику Нії?</b>') + '</div>' + answerLine('xl');
}
function eqGingerBags(q){
  return q.T + ' − ' + q.S + ' = ' + q.c + ', ' + q.T + ' − ' + q.N + ' = ' + (q.c + q.d) + ', ' + (q.c + q.d) + ' − ' + q.c + ' = ' + q.d + ', ' + q.d + ' − 4 = ' + q.b + ', ' + q.N + ' − ' + q.b + ' = ' + q.ans;
}
function whyGingerBags(q, full){
  if(!full) return tr('Три торбички и всички четири: каква е разликата? Това е една торбичка. Коя може да е тя?', 'Три пакетики й усі чотири: яка різниця? Це один пакетик. Чий він може бути?');
  return q.T + ' − ' + q.S + ' = <b>' + q.c + '</b> ' + tr('е торбичката извън трите — на Мия, защото Мая има по-малко', '— пакетик поза трьома: це Мії, бо в Маї менше') + ' &nbsp;→&nbsp; ' + q.T + ' − ' + q.N + ' = ' + (q.c + q.d) + tr(' са Мия и Мая заедно', ' — це Мія й Мая разом') + ', ' + (q.c + q.d) + ' − ' + q.c + ' = <b>' + q.d + '</b> ' + tr('Мая', '— Мая') + ' &nbsp;→&nbsp; ' + q.d + ' − 4 = <b>' + q.b + '</b> ' + tr('Ная', '— Ная') + ' &nbsp;→&nbsp; ' + q.N + ' − ' + q.b + ' = ' + q.ans;
}
KIND.gingerbags = { draw:drawGingerBags, eq:eqGingerBags, why:whyGingerBags };
