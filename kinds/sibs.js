// Question kinds 'sibs' and 'sibsall': levels 330 Братя и сестри and 331 Всички деца — how many boys and girls there
// are in a family, told by how many brothers and sisters each one has. A child is not their own brother or sister:
// of b boys, a boy has b − 1 brothers and a girl has b.

// Кенгуру 2026, задача 24 (a cat has 7 kittens, Албер a boy, Стела a girl; Стела has twice as many brothers as Албер —
// how many sisters has Стела?): the boys b are twice b − 1, so b = 2, the girls are 7 − 2 = 5 and Стела has 5 − 1 = 4 sisters.
// Кенгуру 2021, задача 22 (each son has as many brothers as sisters, each daughter twice as many brothers as sisters —
// how many children?): the boys are one more than the girls; a daughter's brothers are twice her sisters → 3 girls, 4 boys.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// «twice» and «three times» are worked by adding, never by ×: 3 + 3, 2 + 2 + 2
const sibsPlus = (k, x) => Array(k).fill(x).join(' + ');
const SIBS_TIMES = { 2: ['два пъти', 'вдвічі'], 3: ['три пъти', 'втричі'] };
// the mother, her young (bg), the boys, the girls; then the same in Ukrainian
const SIBS_ANIMALS = [
  ['котка', 'котенца', 'мъжките котенца', 'женските котенца', 'кішка', 'кошенят', 'кошенят-хлопчиків', 'кошенят-дівчаток'],
  ['кучка', 'кученца', 'мъжките кученца', 'женските кученца', 'собака', 'цуценят', 'цуценят-хлопчиків', 'цуценят-дівчаток'],
  ['зайка', 'зайчета', 'мъжките зайчета', 'женските зайчета', 'зайчиха', 'зайченят', 'зайченят-хлопчиків', 'зайченят-дівчаток'],
];
const SIBS_PAIRS = [['Алберт', 'Стела', 'Альберт', 'Стела'], ['Макс', 'Мила', 'Макс', 'Міла'], ['Тео', 'Нина', 'Тео', 'Ніна']];
// shape 'brothers': the girl has twice as many brothers as the boy (always 2 boys, the rest are girls);
// shape 'sisters': the boy has twice as many sisters as the girl has brothers (the young are a multiple of 3)
export function genSibs(){
  const shape = Math.random() < 0.5 ? 'brothers' : 'sisters', an = rnd(SIBS_ANIMALS.length), nm = rnd(SIBS_PAIRS.length);
  let n, b, g;
  if(shape === 'brothers'){ b = 2; n = 5 + rnd(5); g = n - b; }
  else { b = 2 + rnd(2); g = 2*b; n = b + g; }
  return {kind:'sibs', shape, an, nm, n, b, g, traps:[g, b], ans: g - 1};
}
function drawSibs(q){
  const [mom, kids, boys, girls, umom, ukids, uboys, ugirls] = SIBS_ANIMALS[q.an], [ab, sb, uab, usb] = SIBS_PAIRS[q.nm];
  const rel = q.shape === 'brothers'
    ? tr(sb + ' има два пъти повече братя от ' + ab + '.', usb + ' має вдвічі більше братів, ніж ' + uab + '.')
    : tr(ab + ' има два пъти повече сестри, отколкото ' + sb + ' има братя.', uab + ' має вдвічі більше сестер, ніж ' + usb + ' братів.');
  return '<div class="ask">' + tr('Една ' + mom + ' има ' + num(q.n) + ' ' + kids + '. Едно от ' + boys + ' се казва ' + ab + ', а едно от ' + girls + ' се казва ' + sb + '. ' + rel +
      ' <b>Колко сестри има ' + sb + '?</b>',
    'Одна ' + umom + ' має ' + num(q.n) + ' ' + ukids + '. Одне з ' + uboys + ' звати ' + uab + ', а одне з ' + ugirls + ' — ' + usb + '. ' + rel +
      ' <b>Скільки сестер має ' + usb + '?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqSibs(q){
  return tr('момчета ', 'хлопчиків ') + q.b + ', ' + tr('момичета ', 'дівчат ') + q.n + ' − ' + q.b + ' = ' + q.g + ', ' + q.g + ' − 1 = ' + q.ans;
}
function whySibs(q, full){
  const [ab, sb, uab, usb] = SIBS_PAIRS[q.nm];
  if(!full) return q.shape === 'brothers'
    ? tr('Братя на ' + sb + ' са всички момчета, а братя на ' + ab + ' са момчетата без него самия. Колко момчета са, за да са първите два пъти повече от вторите?',
         'Брати ' + usb + ' — усі хлопчики, а брати ' + uab + ' — хлопчики без нього самого. Скільки хлопчиків, щоб перших було вдвічі більше за других?')
    : tr('Братя на ' + sb + ' са всички момчета, а сестри на ' + ab + ' са всички момичета. Колко момчета и колко момичета може да са, за да са вторите два пъти повече?',
         'Брати ' + usb + ' — усі хлопчики, а сестри ' + uab + ' — усі дівчата. Скільки може бути хлопчиків і дівчат, щоб других було вдвічі більше?');
  const tail = tr(' Сестри на ' + sb + ' са момичетата без нея: ', ' Сестри ' + usb + ' — дівчата без неї: ') + q.g + ' − 1 = <b>' + q.ans + '</b>';
  if(q.shape === 'brothers')
    return tr('Ако момчетата са ' + q.b + ', ' + ab + ' има ' + (q.b - 1) + ' брат, а ' + sb + ' има ' + q.b + ' братя: ' + q.b + ' = ' + sibsPlus(2, q.b - 1) + ', два пъти повече. Момичетата са ' + q.n + ' − ' + q.b + ' = <b>' + q.g + '</b>.',
              'Якщо хлопчиків ' + q.b + ', то в ' + uab + ' ' + (q.b - 1) + ' брат, а в ' + usb + ' ' + q.b + ' брати: ' + q.b + ' = ' + sibsPlus(2, q.b - 1) + ', вдвічі більше. Дівчат ' + q.n + ' − ' + q.b + ' = <b>' + q.g + '</b>.') + tail;
  return tr('Ако момчетата са ' + q.b + ', ' + sb + ' има ' + q.b + ' братя, а ' + ab + ' има два пъти повече сестри: ' + sibsPlus(2, q.b) + ' = <b>' + q.g + '</b> момичета. ' + q.b + ' + ' + q.g + ' = ' + q.n + ', колкото са малките — съвпада.',
            'Якщо хлопчиків ' + q.b + ', у ' + usb + ' ' + q.b + ' брати, а в ' + uab + ' сестер вдвічі більше: ' + sibsPlus(2, q.b) + ' = <b>' + q.g + '</b> дівчат. ' + q.b + ' + ' + q.g + ' = ' + q.n + ' — збігається.') + tail;
}
KIND.sibs = { draw:drawSibs, eq:eqSibs, why:whySibs };

// Кенгуру 2021, задача 22. s of one kind, o of the other: each of the s has s − 1 of its own kind and o of the other
// (the same number: s − 1 = o); each of the o has s of the first kind and o − 1 of its own, k times fewer: s = k·(o − 1).
// So s = o + 1 and o + 1 = k·(o − 1): k = 2 gives o = 3, k = 3 gives o = 2. Found by trying the girls (boys) one by one.
// sw: the roles swap (each girl has as many sisters as brothers, each boy twice as many sisters as brothers).
export function genSibsAll(){
  const k = Math.random() < 0.6 ? 2 : 3, o = (k + 1)/(k - 1), s = o + 1, sw = Math.random() < 0.4, asksSame = Math.random() < 0.25;
  // boys and girls: not swapped, s is the number of boys; swapped, s is the number of girls
  const boys = sw ? o : s, girls = sw ? s : o;
  return {kind:'sibsall', k, o, s, sw, asksBoys: asksSame, boys, girls, traps:[boys + girls + 1, boys + girls - 1], ans: asksSame ? boys : boys + girls};
}
function drawSibsAll(q){
  const t = SIBS_TIMES[q.k], ask = q.asksBoys ? tr('Колко са момчетата в това семейство?', 'Скільки хлопчиків у цій родині?') : tr('Колко деца има в това семейство?', 'Скільки дітей у цій родині?');
  return '<div class="ask">' + (q.sw
    ? tr('В едно семейство всяка сестра има толкова сестри, колкото и братя, а всеки брат има ' + t[0] + ' повече сестри, отколкото братя.',
         'В одній родині кожна сестра має стільки сестер, скільки й братів, а кожен брат має ' + t[1] + ' більше сестер, ніж братів.')
    : tr('В едно семейство всеки син има толкова братя, колкото и сестри, а всяка сестра има ' + t[0] + ' повече братя, отколкото сестри.',
         'В одній родині кожен син має стільки братів, скільки й сестер, а кожна сестра має ' + t[1] + ' більше братів, ніж сестер.')) +
    ' <b>' + ask + '</b></div><div class="line xl">' + SLOT + '</div>';
}
function eqSibsAll(q){
  // the line ends on the answer: the girls first when the boys are asked
  return q.asksBoys ? tr('момичета ', 'дівчат ') + q.girls + ', ' + tr('момчета ', 'хлопчиків ') + q.boys
    : tr('момчета ', 'хлопчиків ') + q.boys + ', ' + tr('момичета ', 'дівчат ') + q.girls + ', ' + q.boys + ' + ' + q.girls + ' = ' + q.ans;
}
function whySibsAll(q, full){
  // the kind whose members have as many of each (o + 1 of them) and the kind with o members
  const [many, few] = q.sw ? [tr('момичета', 'дівчат'), tr('момчета', 'хлопчиків')] : [tr('момчета', 'хлопчиків'), tr('момичета', 'дівчат')];
  if(!full) return tr('Първите имат толкова братя, колкото и сестри — колко са те в сравнение с другите? После пробвай с малък брой от другите, един по един.',
                      'Перші мають стільки братів, скільки й сестер — скільки їх порівняно з іншими? Потім пробуй малу кількість інших, по одному.');
  const lines = [];
  for(let o = 1; o <= q.o; o++){
    // o of the few: the many are o + 1; one of the few has o + 1 of the other kind and o − 1 of its own
    lines.push(o + ' ' + few + ' → ' + (o + 1) + ' ' + many + ': ' + (o + 1) + ' ' + tr('срещу', 'проти') + ' ' + (o - 1) + (o > 1 ? ' (' + sibsPlus(q.k, o - 1) + ' = ' + q.k*(o - 1) + ')' : '') + (o === q.o ? ' ✓' : ' ✗'));
  }
  return tr('Тези с толкова братя, колкото и сестри, са с един повече от другите. Пробвам: ', 'Тих, у кого стільки братів, скільки й сестер, на одного більше, ніж інших. Пробую: ') + lines.join('; ') +
    ' &nbsp;→&nbsp; ' + q.boys + ' + ' + q.girls + ' = <b>' + (q.boys + q.girls) + '</b>' + (q.asksBoys ? tr('; момчетата са ' + q.boys, '; хлопчиків ' + q.boys) : '');
}
KIND.sibsall = { draw:drawSibsAll, eq:eqSibsAll, why:whySibsAll };
