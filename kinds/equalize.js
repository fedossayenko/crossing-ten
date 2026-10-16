// Question kind 'equalize': level 297 Поравно — One gives the other some, and then both have the same.

// Аз и числата 2022, задача 2: Тони has 35 картички. Габи tells her: «Give me 10 of yours and we shall have the same.»
// How many had Габи? Тони keeps 35 − 10 = 25, so Габи ends with 25 too — 10 of them given: 25 − 10 = 15. The slip is
// to stop at 25. The other way round (shape 'give'): 35 and 15 — how many must one give? Each one given closes the gap
// by two, one fewer on one side and one more on the other: half of 35 − 15 = 20, 10. The slip there is the whole gap.
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
// [giver, speaker]: Bulgarian, Ukrainian, Ukrainian dative (for the one given to)
/** @type {[string, string, string][][]} */
const EQ_PAIRS = [[['Тони', 'Тоні', 'Тоні'], ['Габи', 'Габі', 'Габі']], [['Ния', 'Нія', 'Нії'], ['Мая', 'Мая', 'Маї']],
                  [['Ива', 'Іва', 'Іві'], ['Ели', 'Елі', 'Елі']], [['Яна', 'Яна', 'Яні'], ['Рая', 'Рая', 'Раї']]];
// the things: Bulgarian, then the Ukrainian forms after a number (one, a few, many)
/** @type {[string, string, string, string][]} */
const EQ_THINGS = [['картички', 'листівку', 'листівки', 'листівок'], ['марки', 'марку', 'марки', 'марок']];
export function genEqualize(){
  const pair = rnd(EQ_PAIRS.length), thing = rnd(EQ_THINGS.length), give = Math.random() < 0.35;
  const b = 5 + rnd(36), k = (give ? 2 : 3) + rnd(give ? 14 : 13), a = b + 2*k;
  return give ? {kind:'equalize', shape:'give', pair, thing, a, b, k, traps:[2*k], ans:k}
    : {kind:'equalize', shape:'before', pair, thing, a, b, k, traps:[a - k], ans:b};
}
const eqNum = n => '<span class="num">' + n + '</span>';
const eqUk = (q, n) => { const t = EQ_THINGS[q.thing]; return ukN(n, t[1], t[2], t[3]).replace(/^\d+/, eqNum(n)); };
function drawEqualize(q){
  const [A, B] = EQ_PAIRS[q.pair], t = EQ_THINGS[q.thing];
  if(q.shape === 'give') return '<div class="ask">' + tr(A[0] + ' има ' + eqNum(q.a) + ' ' + t[0] + ', а ' + B[0] + ' — ' + eqNum(q.b) + '. <b>Колко ' + t[0] + ' трябва ' + A[0] + ' да даде на ' + B[0] + ', за да имат двете поравно?</b>',
      A[1] + ' має ' + eqUk(q, q.a) + ', а ' + B[1] + ' — ' + eqNum(q.b) + '. <b>Скільки ' + t[3] + ' має ' + A[1] + ' віддати ' + B[2] + ', щоб у них обох стало порівну?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
  return '<div class="ask">' + tr(A[0] + ' има ' + eqNum(q.a) + ' ' + t[0] + '. ' + B[0] + ' ѝ казала: „Ако ми дадеш ' + eqNum(q.k) + ' ' + t[0] + ' от твоите, двете ще имаме поравно.“ <b>Колко ' + t[0] + ' имала ' + B[0] + ' в началото?</b>',
      A[1] + ' має ' + eqUk(q, q.a) + '. ' + B[1] + ' сказала їй: «Якщо даси мені ' + eqUk(q, q.k) + ' зі своїх, у нас обох буде порівну». <b>Скільки ' + t[3] + ' мала ' + B[1] + ' спочатку?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqEqualize(q){
  if(q.shape === 'give') return q.a + ' − ' + q.b + ' = ' + 2*q.k + ', ' + 2*q.k + ' : 2 = ' + q.ans;
  return q.a + ' − ' + q.k + ' = ' + (q.a - q.k) + ', ' + (q.a - q.k) + ' − ' + q.k + ' = ' + q.ans;
}
function whyEqualize(q, full){
  if(q.shape === 'give'){
    if(!full) return tr('Ако даде цялата разлика, другото момиче ще има повече. Всяка дадена намалява разликата два пъти: при едната една по-малко, при другата една повече.',
      'Якщо віддати всю різницю, у другої дівчинки стане більше. Кожна віддана зменшує різницю двічі: в однієї на одну менше, в іншої на одну більше.');
    return tr('разликата: ', 'різниця: ') + q.a + ' − ' + q.b + ' = <b>' + 2*q.k + '</b> &nbsp;→&nbsp; ' + tr('всяка дадена я намалява с 2, значи се дава половината: ', 'кожна віддана зменшує її на 2, отже віддають половину: ') + 2*q.k + ' : 2 = ' + q.ans;
  }
  if(!full) return tr('Колко ще останат на първото момиче, след като даде? Толкова ще има накрая и второто — заедно с подаръка.',
    'Скільки залишиться в першої дівчинки, коли вона віддасть? Стільки ж матиме наприкінці й друга — разом із подарунком.');
  return tr('след като даде: ', 'після того як віддасть: ') + q.a + ' − ' + q.k + ' = <b>' + (q.a - q.k) + '</b> &nbsp;→&nbsp; ' + tr('толкова ще има и другото момиче, но ', 'стільки ж матиме й друга дівчинка, але ') + q.k +
    tr(' от тях са ѝ дадени: ', ' з них їй віддали: ') + (q.a - q.k) + ' − ' + q.k + ' = ' + q.ans;
}
KIND.equalize = { draw:drawEqualize, eq:eqEqualize, why:whyEqualize };
