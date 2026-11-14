// Question kind 'equalize': level 297 Поравно — One gives the other some, and then both have the same.

// Аз и числата 2022, задача 2: Тони has 35 картички. Габи tells her: «Give me 10 of yours and we shall have the same.»
// How many had Габи? Тони keeps 35 − 10 = 25, so Габи ends with 25 too — 10 of them given: 25 − 10 = 15. The slip is
// to stop at 25. The other way round (shape 'give'): 35 and 15 — how many must one give? Each one given closes the gap
// by two, one fewer on one side and one more on the other: half of 35 − 15 = 20, 10. The slip there is the whole gap.
import { KIND, answerLine, numSpan, rnd, tr, ukN, ukPl } from '../js/core.js';
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
  if(Math.random() < 0.25) return genGap();
  return give ? {kind:'equalize', shape:'give', pair, thing, a, b, k, traps:[2*k], ans:k}
    : {kind:'equalize', shape:'before', pair, thing, a, b, k, traps:[a - k], ans:b};
}
// Салабашев 2023 #10 (shape 'gap'): 2А had 18 more than 2Б a minute ago, 4 children go from 2А to 2Б: how many more has 2А now? Each child that goes
// takes one off the gap on one side and puts one on the other, 2 in all: 18 − 4 − 4 = 10. The slip is 18 − 4. Drawn after the old question.
function genGap(){
  for(;;){
    const D = 12 + rnd(19), k = 2 + rnd(5);
    if(D - 2*k < 2) continue;
    return {kind:'equalize', shape:'gap', D, k, traps:[D - k], ans: D - 2*k};
  }
}
const GAP_BG = {2:'Две', 3:'Три', 4:'Четири', 5:'Пет', 6:'Шест'}, GAP_UK = {2:'Двоє', 3:'Троє', 4:'Четверо', 5:'П’ятеро', 6:'Шестеро'};
function drawGap(q){
  return '<div class="ask">' + tr('Преди минута в стаята на 2А клас имаше ' + numSpan(q.D) + ' деца повече, отколкото в стаята на 2Б клас. ' + GAP_BG[q.k] + ' деца от стаята на 2А клас отидоха в стаята на 2Б клас. <b>С колко децата в стаята на 2А клас сега са повече от децата в стаята на 2Б клас?</b>',
    'Хвилину тому в кімнаті 2А класу було на ' + ukN(q.D, 'дитину', 'дитини', 'дітей').replace(/^\d+/, numSpan(q.D)) + ' більше, ніж у кімнаті 2Б класу. ' + GAP_UK[q.k] + ' дітей із кімнати 2А класу перейшли до кімнати 2Б класу. <b>На скільки дітей у кімнаті 2А класу зараз більше, ніж у кімнаті 2Б класу?</b>') + '</div>' + answerLine('xl');
}
const eqGap = q => q.D + ' − ' + q.k + ' − ' + q.k + ' = ' + q.ans;
function whyGap(q, full){
  if(!full) return tr('Всяко дете, което отива в другата стая, смалява разликата от двете страни: в едната стая има едно по-малко, в другата — едно повече.',
    'Кожна дитина, що йде до іншої кімнати, зменшує різницю з обох боків: в одній кімнаті стає на одну менше, в іншій — на одну більше.');
  return tr('всяко от децата намалява разликата с 2: ', 'кожна дитина зменшує різницю на 2: ') + q.k + ' + ' + q.k + ' = <b>' + 2*q.k + '</b> &nbsp;→&nbsp; ' + eqGap(q);
}
// Level 453: Салабашев 2022 #8 — Никола: «give me 5 and I shall have 30», Георги: «no, you give me 9 and I shall have 40»: how many must Георги give Никола
// to make them equal? Никола has 30 − 5 = 25 and Георги 40 − 9 = 31; the gap 6 is closed by half of it, 3. The slip is the whole gap.
export function genEqualizeTold(){
  for(;;){
    const p = 3 + rnd(7), q = 3 + rnd(7), n = 15 + rnd(26), k = 2 + rnd(8), g = n + 2*k;
    if(p === q) continue;
    return {kind:'equalize', shape:'told', p, q, n, g, k, traps:[2*k], ans: k};
  }
}
function drawTold(q){
  const n1 = q.n + q.p, g1 = q.g + q.q;
  return '<div class="ask">' + tr('Никола казал на Георги: „Ако ми дадеш ' + numSpan(q.p) + ' от твоите бонбони, аз ще имам ' + numSpan(n1) + ' бонбона!“ Георги му отговорил: „Не, ти ще ми дадеш ' + numSpan(q.q) + ' от твоите бонбони и аз ще имам ' + numSpan(g1) +
      ' бонбона!“ <b>Колко бонбони трябва да даде Георги на Никола, за да имат двамата по равно?</b>',
    'Микола сказав Георгію: «Якщо даси мені ' + ukPl(q.p, 'цукерку', 'цукерки', 'цукерок') + ' зі своїх, у мене буде ' + ukPl(n1, 'цукерка', 'цукерки', 'цукерок') + '!» Георгій відповів йому: «Ні, ти даси мені ' + ukPl(q.q, 'цукерку', 'цукерки', 'цукерок') + ' зі своїх, і в мене буде ' + ukPl(g1, 'цукерка', 'цукерки', 'цукерок') +
      '!» <b>Скільки цукерок має дати Георгій Миколі, щоб у них обох було порівну?</b>') + '</div>' + answerLine('xl');
}
const eqTold = q => (q.n + q.p) + ' − ' + q.p + ' = ' + q.n + ', ' + (q.g + q.q) + ' − ' + q.q + ' = ' + q.g + ', ' + q.g + ' − ' + q.n + ' = ' + 2*q.k + ' = ' + q.k + ' + ' + q.k + ' → ' + q.k;
function whyTold(q, full){
  if(!full) return tr('Първо колко бонбона има всеки сега — преди да дава. Каквото получи, вече е пресметнато в числото му. После разликата: колкото е половината от нея, толкова трябва да даде.',
    'Спершу скільки цукерок має кожен зараз — до того, як віддавати. Те, що отримає, вже враховане в його числі. Потім різниця: половина її — стільки й треба віддати.');
  return tr('Никола: ', 'Микола: ') + (q.n + q.p) + ' − ' + q.p + ' = <b>' + q.n + '</b>, ' + tr('Георги: ', 'Георгій: ') + (q.g + q.q) + ' − ' + q.q + ' = <b>' + q.g + '</b> &nbsp;→&nbsp; ' + tr('разликата: ', 'різниця: ') + q.g + ' − ' + q.n + ' = ' + 2*q.k + ' = ' + q.k + ' + ' + q.k + ' &nbsp;→&nbsp; ' + q.k;
}
const eqUk = (q, n) => { const t = EQ_THINGS[q.thing]; return ukN(n, t[1], t[2], t[3]).replace(/^\d+/, numSpan(n)); };
function drawEqualize(q){
  if(q.shape === 'gap') return drawGap(q);
  if(q.shape === 'told') return drawTold(q);
  const [A, B] = EQ_PAIRS[q.pair], t = EQ_THINGS[q.thing];
  if(q.shape === 'give') return '<div class="ask">' + tr(A[0] + ' има ' + numSpan(q.a) + ' ' + t[0] + ', а ' + B[0] + ' — ' + numSpan(q.b) + '. <b>Колко ' + t[0] + ' трябва ' + A[0] + ' да даде на ' + B[0] + ', за да имат двете поравно?</b>',
      A[1] + ' має ' + eqUk(q, q.a) + ', а ' + B[1] + ' — ' + numSpan(q.b) + '. <b>Скільки ' + t[3] + ' має ' + A[1] + ' віддати ' + B[2] + ', щоб у них обох стало порівну?</b>') + '</div>' +
    answerLine('xl');
  return '<div class="ask">' + tr(A[0] + ' има ' + numSpan(q.a) + ' ' + t[0] + '. ' + B[0] + ' ѝ казала: „Ако ми дадеш ' + numSpan(q.k) + ' ' + t[0] + ' от твоите, двете ще имаме поравно.“ <b>Колко ' + t[0] + ' имала ' + B[0] + ' в началото?</b>',
      A[1] + ' має ' + eqUk(q, q.a) + '. ' + B[1] + ' сказала їй: «Якщо даси мені ' + eqUk(q, q.k) + ' зі своїх, у нас обох буде порівну». <b>Скільки ' + t[3] + ' мала ' + B[1] + ' спочатку?</b>') + '</div>' +
    answerLine('xl');
}
function eqEqualize(q){
  if(q.shape === 'gap') return eqGap(q);
  if(q.shape === 'told') return eqTold(q);
  if(q.shape === 'give') return q.a + ' − ' + q.b + ' = ' + 2*q.k + ' = ' + q.ans + ' + ' + q.ans + ' → ' + q.ans;
  return q.a + ' − ' + q.k + ' = ' + (q.a - q.k) + ', ' + (q.a - q.k) + ' − ' + q.k + ' = ' + q.ans;
}
function whyEqualize(q, full){
  if(q.shape === 'gap') return whyGap(q, full);
  if(q.shape === 'told') return whyTold(q, full);
  if(q.shape === 'give'){
    if(!full) return tr('Ако даде цялата разлика, другото момиче ще има повече. Всяка дадена намалява разликата два пъти: при едната една по-малко, при другата една повече.',
      'Якщо віддати всю різницю, у другої дівчинки стане більше. Кожна віддана зменшує різницю двічі: в однієї на одну менше, в іншої на одну більше.');
    return tr('разликата: ', 'різниця: ') + q.a + ' − ' + q.b + ' = <b>' + 2*q.k + '</b> &nbsp;→&nbsp; ' + tr('всяка дадена я намалява с 2, значи се дава половината: ', 'кожна віддана зменшує її на 2, отже віддають половину: ') + 2*q.k + ' = ' + q.ans + ' + ' + q.ans + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(!full) return tr('Колко ще останат на първото момиче, след като даде? Толкова ще има накрая и второто — заедно с подаръка.',
    'Скільки залишиться в першої дівчинки, коли вона віддасть? Стільки ж матиме наприкінці й друга — разом із подарунком.');
  return tr('след като даде: ', 'після того як віддасть: ') + q.a + ' − ' + q.k + ' = <b>' + (q.a - q.k) + '</b> &nbsp;→&nbsp; ' + tr('толкова ще има и другото момиче, но ', 'стільки ж матиме й друга дівчинка, але ') + q.k +
    tr(' от тях са ѝ дадени: ', ' з них їй віддали: ') + (q.a - q.k) + ' − ' + q.k + ' = ' + q.ans;
}
KIND.equalize = { draw:drawEqualize, eq:eqEqualize, why:whyEqualize };
