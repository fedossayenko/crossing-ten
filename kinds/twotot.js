// Question kind 'twotot': levels 320 Два сбора, 321 Сбор и добавка, 322 Заедно и едното — Two unknowns from totals.

// Европейско Кенгуру 2025, 2 клас, задача 12: a big kangaroo and one small weigh 53 kg together, the big and both
// small 56 kg (shape 'one'). The two totals differ by one small one: 56 − 53 = 3, and the big one is 53 − 3 = 50.
// The slip is 3, the small one. 2022, задача 4 (shape 'mix'): pizza and juice 12, pizza and two juices 14 — juice 14 − 12 = 2,
// pizza 12 − 2 = 10, and then two pizzas and three juices are added, never multiplied: 10 + 10 + 2 + 2 + 2 = 26.
// 2019, задача 8 (shape 'halves'): two apples cost 60 цента together, two pears 80 — a pear and an apple? Each pair
// splits in two equal halves: 30 and 40, and one of each is 30 + 40 = 70. 2019, задача 2 (shape 'rest'): both together
// 60 kg, one of them 52 — the other is 60 − 52 = 8.
import { KIND, SLOT, rnd, shuffle, tr } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// shape 'one': [Bulgarian, Ukrainian], the question's words are built around the totals
/** @type {((a: number, b: number) => [string, string])[]} */
const ONE = [
  (A, B) => ['Двете малки кенгурчета тежат еднакво. Голямо кенгуру и едно малко тежат общо ' + num(A) + ' кг, а голямо кенгуру и двете малки — ' + num(B) + ' кг. <b>Колко кг тежи голямото кенгуру?</b>',
    'Обоє маленьких кенгуренят важать однаково. Велике кенгуру й одне маленьке важать разом ' + num(A) + ' кг, а велике кенгуру й обоє маленьких — ' + num(B) + ' кг. <b>Скільки кг важить велике кенгуру?</b>'],
  (A, B) => ['Двете кученца тежат еднакво. Голямо куче и едно кученце тежат общо ' + num(A) + ' кг, а голямото куче и двете кученца — ' + num(B) + ' кг. <b>Колко кг тежи голямото куче?</b>',
    'Обоє цуценят важать однаково. Великий пес і одне цуценя важать разом ' + num(A) + ' кг, а великий пес і обоє цуценят — ' + num(B) + ' кг. <b>Скільки кг важить великий пес?</b>'],
  (A, B) => ['Двете торби с ябълки тежат еднакво. Кошницата и една торба тежат общо ' + num(A) + ' кг, а кошницата и двете торби — ' + num(B) + ' кг. <b>Колко кг тежи кошницата?</b>',
    'Обидві торби з яблуками важать однаково. Кошик і одна торба важать разом ' + num(A) + ' кг, а кошик і обидві торби — ' + num(B) + ' кг. <b>Скільки кг важить кошик?</b>'],
];
// shape 'halves': two of a fruit, Bulgarian two / one, Ukrainian two / one
/** @type {[string, string, string, string][]} */
const FRUIT = [['две ябълки', 'една ябълка', 'два яблука', 'одне яблуко'], ['две круши', 'една круша', 'дві груші', 'одна груша'],
               ['две сливи', 'една слива', 'дві сливи', 'одна слива'], ['две праскови', 'една праскова', 'два персики', 'один персик']];
// shape 'mix': what is bought — the first one's name with 2 and 3 of it, the second's with 2, 3 and 4 (Bulgarian, Ukrainian),
// and how it is said once alone
/** @type {{ one: [string, string], two: [string, string], first: Record<number, [string, string]>, second: Record<number, [string, string]> }[]} */
const BUY = [
  { one: ['пица', 'піца'], two: ['сок', 'сік'],
    first: { 2: ['две пици', 'дві піци'], 3: ['три пици', 'три піци'] }, second: { 2: ['два сока', 'два соки'], 3: ['три сока', 'три соки'], 4: ['четири сока', 'чотири соки'] } },
  { one: ['сладолед', 'морозиво'], two: ['вафла', 'вафля'],
    first: { 2: ['два сладоледа', 'два морозива'], 3: ['три сладоледа', 'три морозива'] }, second: { 2: ['две вафли', 'дві вафлі'], 3: ['три вафли', 'три вафлі'], 4: ['четири вафли', 'чотири вафлі'] } },
];
// shape 'rest': who is together — [together, the one given, the other asked, Ukrainian the same]
/** @type {[string, string, string, string, string, string][]} */
const REST = [['Мама Кенга и синът ѝ Скокчо заедно тежат', 'самата мама Кенга тежи', 'кенгурчето Скокчо', 'Мама Кенга та її син Скокчо разом важать', 'сама мама Кенга важить', 'кенгуреня Скокчо'],
  ['Кучето Барни и кученцето му заедно тежат', 'самото Барни тежи', 'кученцето', 'Пес Барні та його цуценя разом важать', 'сам Барні важить', 'цуценя'],
  ['Две торби заедно тежат', 'едната тежи', 'другата', 'Дві торби разом важать', 'одна важить', 'інша']];
export function genTwoTot(){
  const r = Math.random(), shape = r < 0.3 ? 'one' : r < 0.55 ? 'halves' : r < 0.8 ? 'mix' : 'rest';
  if(shape === 'one'){
    const s = 2 + rnd(8), big = 12 + rnd(49);
    return {kind:'twotot', shape, sc: rnd(ONE.length), s, big, A: big + s, B: big + 2*s, traps:[s], ans: big};
  }
  if(shape === 'halves'){
    const it = shuffle([0, 1, 2, 3]).slice(0, 2), a = 10 + rnd(36);
    let b = 10 + rnd(36);
    while(b === a) b = 10 + rnd(36);
    return {kind:'twotot', shape, it, a, b, A: 2*a, B: 2*b, traps:[2*a + 2*b], ans: a + b};
  }
  if(shape === 'mix'){
    const sc = rnd(BUY.length), j = 1 + rnd(5), p = 4 + rnd(12), m = 2 + rnd(2), n = 2 + rnd(3);
    return {kind:'twotot', shape, sc, p, j, m, n, A: p + j, B: p + 2*j, traps:[p + j + j + j, p + j + p + j + j], ans: m === 2 ? 2*p + n*j : 3*p + n*j};
  }
  const sc = rnd(REST.length), T = 20 + rnd(81), a = 3 + rnd(Math.min(40, T - 10));
  return {kind:'twotot', shape:'rest', sc, T, a: T - a, ans: a, traps:[T + (T - a)]};
}
function drawTwoTot(q){
  let ask;
  if(q.shape === 'one') ask = tr(ONE[q.sc](q.A, q.B)[0], ONE[q.sc](q.A, q.B)[1]);
  else if(q.shape === 'halves'){
    const [x, y] = q.it.map(i => FRUIT[i]);
    ask = tr(x[0][0].toUpperCase() + x[0].slice(1) + ' заедно струват ' + num(q.A) + ' цента, а ' + y[0] + ' заедно — ' + num(q.B) + ' цента. <b>Колко цента струват заедно ' + y[1] + ' и ' + x[1] + '?</b>',
      x[2][0].toUpperCase() + x[2].slice(1) + ' разом коштують ' + num(q.A) + ' центів, а ' + y[2] + ' разом — ' + num(q.B) + ' центів. <b>Скільки центів коштують разом ' + y[3] + ' і ' + x[3] + '?</b>');
  } else if(q.shape === 'mix'){
    const b = BUY[q.sc];
    ask = tr(b.one[0][0].toUpperCase() + b.one[0].slice(1) + ' и ' + b.two[0] + ' струват ' + num(q.A) + ' евро, а ' + b.one[0] + ' и ' + b.second[2][0] + ' — ' + num(q.B) + ' евро. <b>Колко евро струват ' + b.first[q.m][0] + ' и ' + b.second[q.n][0] + '?</b>',
      b.one[1][0].toUpperCase() + b.one[1].slice(1) + ' й ' + b.two[1] + ' коштують ' + num(q.A) + ' євро, а ' + b.one[1] + ' й ' + b.second[2][1] + ' — ' + num(q.B) + ' євро. <b>Скільки євро коштують ' + b.first[q.m][1] + ' й ' + b.second[q.n][1] + '?</b>');
  } else {
    const r = REST[q.sc];
    ask = tr(r[0] + ' ' + num(q.T) + ' кг, а ' + r[1] + ' ' + num(q.a) + ' кг. <b>Колко кг тежи ' + r[2] + '?</b>', r[3] + ' ' + num(q.T) + ' кг, а ' + r[4] + ' ' + num(q.a) + ' кг. <b>Скільки кг важить ' + r[5] + '?</b>');
  }
  return '<div class="ask">' + ask + '</div><div class="line lg">' + SLOT + ' <span class="unit">' + (q.shape === 'mix' ? tr('евро', 'євро') : q.shape === 'halves' ? tr('цента', 'ц.') : tr('кг', 'кг')) + '</span></div>';
}
const sumList = (n, v) => Array(n).fill(v).join(' + ');
function eqTwoTot(q){
  if(q.shape === 'one') return q.B + ' − ' + q.A + ' = ' + q.s + ', ' + q.A + ' − ' + q.s + ' = ' + q.ans;
  if(q.shape === 'halves') return q.A + ' = ' + q.a + ' + ' + q.a + ', ' + q.B + ' = ' + q.b + ' + ' + q.b + ', ' + q.a + ' + ' + q.b + ' = ' + q.ans;
  if(q.shape === 'mix') return q.B + ' − ' + q.A + ' = ' + q.j + ', ' + q.A + ' − ' + q.j + ' = ' + q.p + ', ' + sumList(q.m, q.p) + ' + ' + sumList(q.n, q.j) + ' = ' + q.ans;
  return q.T + ' − ' + q.a + ' = ' + q.ans;
}
function whyTwoTot(q, full){
  if(q.shape === 'one'){
    if(!full) return tr('Сравни двата сбора: с какво са различни? Точно толкова тежи едно малко.', 'Порівняй дві суми: чим вони різні? Рівно стільки важить одне маленьке.');
    return q.B + ' − ' + q.A + ' = <b>' + q.s + '</b> &nbsp;→&nbsp; ' + tr('толкова тежи едно малко, значи голямото е ', 'стільки важить одне маленьке, отже велике — ') + q.A + ' − ' + q.s + ' = ' + q.ans;
  }
  if(q.shape === 'halves'){
    if(!full) return tr('Две еднакви струват заедно колкото две половини. Колко струва една?', 'Дві однакові коштують разом стільки, скільки дві половини. Скільки коштує одна?');
    return q.A + ' = ' + q.a + ' + ' + q.a + ', ' + q.B + ' = ' + q.b + ' + ' + q.b + ' &nbsp;→&nbsp; ' + q.a + ' + ' + q.b + ' = ' + q.ans;
  }
  if(q.shape === 'mix'){
    if(!full) return tr('Сравни първите две цени: с какво се различават? Това е цената на един сок. После върви към пицата.', 'Порівняй перші дві ціни: чим вони різні? Це ціна однієї речі. Далі йди до іншої.');
    return q.B + ' − ' + q.A + ' = <b>' + q.j + '</b> &nbsp;→&nbsp; ' + q.A + ' − ' + q.j + ' = <b>' + q.p + '</b> &nbsp;→&nbsp; ' + sumList(q.m, q.p) + ' + ' + sumList(q.n, q.j) + ' = ' + q.ans;
  }
  if(!full) return tr('Заедно са толкова, а едното е известно. Какво остава за другото?', 'Разом стільки, а одне відоме. Що лишається для іншого?');
  return q.T + ' − ' + q.a + ' = ' + q.ans;
}
KIND.twotot = { draw:drawTwoTot, eq:eqTwoTot, why:whyTwoTot };
