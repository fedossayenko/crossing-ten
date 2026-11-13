// Question kind 'extras': levels 323 Колко с добавка, 326 Крави и кокошки — a count and what each special one adds.

// Европейско Кенгуру 2019, 2 клас, задача 20 (shape 'humps'): 10 camels, 14 humps in all, one- and two-humped — how many
// two-humped? Every camel has one hump, so 10 are counted; the 14 − 10 = 4 left over are the second humps, one for each
// two-humped camel. The slip is to count the humps as camels. 2024, задача 24 (shape 'darts'): the game starts with 10 darts,
// every bullseye gives 2 more, 20 thrown in all — 20 − 10 = 10 came from bullseyes, 2 at a time: 2, 4, 6, 8, 10, five.
// 2022, задача 26 (shape 'farm'): cows and hens have 16 legs; 2 animals sold, heads and legs left 12 — a cow is 1 + 4 = 5, a hen
// 1 + 2 = 3; 12 is only 3 + 3 + 3 + 3, four hens were left, the two sold were cows (16 − 8 = 8 legs), so four hens before.
import { KIND, SLOT, rnd, tr, trN, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
const darts = n => ukPl(n, 'дротик', 'дротики', 'дротиків');
// who plays darts: Bulgarian name, began, got, hit, threw; Ukrainian name, began, got, hit, threw
/** @type {string[][]} */
const DARTERS = [['Андрей', 'започнал', 'получавал', 'улучил', 'хвърлил', 'Андрій', 'розпочав', 'отримував', 'влучив', 'кинув'],
                 ['Мила', 'започнала', 'получавала', 'улучила', 'хвърлила', 'Міла', 'розпочала', 'отримувала', 'влучила', 'кинула']];
export function genExtras(){
  const r = Math.random();
  if(r < 0.35){
    const n = 6 + rnd(15), k = 1 + rnd(n - 2);
    return {kind:'extras', shape:'humps', n, k, total: n + k, traps:[n], ans: k};
  }
  if(r < 0.7){
    const e = 2 + rnd(2), k = 2 + rnd(5), n0 = 6 + rnd(9);
    return {kind:'extras', shape:'darts', who: rnd(2), n0, e, k, total: n0 + e*k, traps:[e*k], ans: k};
  }
  for(;;){
    const c = 1 + rnd(4), h = 2 + rnd(7), x = rnd(3), L = 4*c + 2*h;
    if(c - x < 0 || h - (2 - x) < 0) continue;
    const R = 5*(c - x) + 3*(h - 2 + x);
    if(farmHens(L, R).length !== 1) continue;
    return {kind:'extras', shape:'farm', L, R, c, h, x, traps:[h - 2 + x], ans: h};
  }
}
// every herd with L legs in all, two sold, R heads and legs left: how many hens could there have been
function farmHens(L, R){
  const hs = new Set();
  for(let c = 0; 4*c <= L; c++){
    if((L - 4*c) % 2) continue;
    const h = (L - 4*c) / 2;
    for(let x = 0; x <= 2; x++) if(c - x >= 0 && h - (2 - x) >= 0 && 5*(c - x) + 3*(h - 2 + x) === R) hs.add(h);
  }
  return [...hs];
}
function drawExtras(q){
  let ask;
  if(q.shape === 'humps') ask = tr('В зоологическа градина има общо ' + num(q.n) + ' камили — едногърби (с една гърбица) и двугърби (с две гърбици). Всички гърбици са ' + num(q.total) + '. <b>Колко от камилите са двугърби?</b>',
    'У зоопарку всього ' + num(q.n) + ' верблюдів — одногорбих (з одним горбом) і двогорбих (з двома горбами). Усіх горбів ' + num(q.total) + '. <b>Скільки з верблюдів двогорбих?</b>');
  else if(q.shape === 'darts'){
    const w = DARTERS[q.who];
    ask = tr(w[0] + ' ' + w[1] + ' играта с ' + num(q.n0) + ' стрелички и ' + w[2] + ' още ' + num(q.e) + ' стрелички при всяко улучване на „биволското око“. <b>Колко пъти е ' + w[3] + ' „биволското око“, ако е ' + w[4] + ' общо ' + num(q.total) + ' стрелички?</b>',
      w[5] + ' ' + w[6] + ' гру з ' + darts(q.n0) + ' і ' + w[7] + ' ще ' + darts(q.e) + ' за кожне влучення в «яблучко». <b>Скільки разів ' + w[5] + ' ' + w[8] + ' в «яблучко», якщо всього ' + w[9] + ' ' + darts(q.total) + '?</b>');
  } else ask = tr('Един стопанин отглежда крави и кокошки, а краката им са ' + num(q.L) + '. Продал 2 от животните и броят на главите и краката на останалите станал ' + num(q.R) + '. <b>Колко са били кокошките преди продажбата?</b>',
    'Один господар тримає корів і курей, а ніг у них ' + num(q.L) + '. Він продав 2 тварини, і число голів і ніг у решти стало ' + num(q.R) + '. <b>Скільки було курей до продажу?</b>');
  return '<div class="ask">' + ask + '</div><div class="line xl">' + SLOT + '</div>';
}
const stepList = (e, k) => Array.from({length: k}, (_, i) => e*(i + 1)).join(', ');
// what was left: its cows and hens, and their heads and legs as one sum of 5s and 3s
function farmLeft(q){
  const cr = q.c - q.x, hr = q.h - (2 - q.x);
  return { cr, hr, sum: [].concat(Array(cr).fill(5), Array(hr).fill(3)).join(' + ') };
}
function eqExtras(q){
  if(q.shape === 'humps') return q.total + ' − ' + q.n + ' = ' + q.ans;
  if(q.shape === 'darts') return q.total + ' − ' + q.n0 + ' = ' + (q.total - q.n0) + ', ' + stepList(q.e, q.k) + ' → ' + q.ans;
  return farmLeft(q).sum + ' = ' + q.R + ', ' + (q.h - 2 + q.x) + ' + ' + (2 - q.x) + ' = ' + q.ans;
}
function whyExtras(q, full){
  if(q.shape === 'humps'){
    if(!full) return tr('Всяка камила има поне една гърбица. Колко гърбици остават над тях?', 'Кожен верблюд має принаймні один горб. Скільки горбів лишається понад них?');
    return q.n + tr(' камили имат ', ' верблюдів мають ') + q.n + tr(' гърбици. ', ' горбів. ') + q.total + ' − ' + q.n + ' = <b>' + q.ans + '</b> ' + tr('са вторите гърбици — по една на двугърба камила', 'це другі горби — по одному в двогорбого верблюда') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 'darts'){
    if(!full) return tr('Колко стрелички са дошли от улучванията? Идвали са по няколко наведнъж.', 'Скільки дротиків прийшло від влучань? Вони приходили по кілька разом.');
    return q.total + ' − ' + q.n0 + ' = <b>' + (q.total - q.n0) + '</b> &nbsp;→&nbsp; ' + tr('по ' + q.e + ' на улучване: ', 'по ' + q.e + ' за влучання: ') + stepList(q.e, q.k) + ' &nbsp;→&nbsp; ' + q.k + tr(' пъти', ' разів') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(!full) return tr('Пресметни колко са главата и краката на една крава заедно, и колко на една кокошка. От такива числа се събира остатъкът.', 'Порахуй, скільки разом голова й ноги однієї корови, і скільки однієї курки. З таких чисел складається решта.');
  const f = farmLeft(q), sold = q.L - 4*f.cr - 2*f.hr, soldLegs = [].concat(Array(q.x).fill(4), Array(2 - q.x).fill(2)).join(' + ');
  return tr('крава 1 + 4 = 5, кокошка 1 + 2 = 3. Останали: ', 'корова 1 + 4 = 5, курка 1 + 2 = 3. Лишилися: ') + f.sum + ' = ' + q.R + ' &nbsp;→&nbsp; ' + trN(f.cr, 'крава', 'крави', 'корова', 'корови', 'корів') + tr(' и ', ' і ') + trN(f.hr, 'кокошка', 'кокошки', 'курка', 'курки', 'курей') + tr('. Продадените са с ', '. Продані мають ') +
    sold + tr(' крака: ', ' ніг: ') + soldLegs + ' &nbsp;→&nbsp; ' + tr('кокошки преди: ', 'курей до продажу: ') + f.hr + ' + ' + (2 - q.x) + ' = ' + q.ans;
}
KIND.extras = { draw:drawExtras, eq:eqExtras, why:whyExtras };
