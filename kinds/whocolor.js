// Question kind 'whocolor': level 187 Чий е балонът? — Three children, three colours, two «not» clues;
// level 299 Кой какво купил? (shape 'fruit') — a girl, two boys, three fruits, a «not» clue and a vowel clue.

// МБГ Пролет 2021, 1 клас, задача 18: Алекс, Борис и Катрин have one balloon each — blue, green and yellow.
// Алекс's is neither yellow nor blue, Борис's is not yellow. Катрин's? Алекс has the green one, so Борис,
// not yellow, has the blue, and the yellow is left for Катрин. A colour cannot be typed, so this kind
// brings its own four: the three colours and «cannot be told».
// [Bulgarian, Ukrainian, Ukrainian genitive]
/** @type {[string, string, string][]} */
import { KIND, shuffle, tr } from '../js/core.js';
const WC_KIDS = [['Алекс', 'Алекс', 'Алекса'], ['Борис', 'Борис', 'Бориса'], ['Катрин', 'Катрін', 'Катрін'], ['Мая', 'Мая', 'Маї'],
                 ['Иван', 'Іван', 'Івана'], ['Ния', 'Нія', 'Нії']];
// [Bulgarian, for a balloon; Ukrainian, for a balloon (кулька)]
/** @type {[string, string][]} */
const WC_COLS = [['син', 'синя'], ['зелен', 'зелена'], ['жълт', 'жовта'], ['червен', 'червона']];
// every way to give the three colours out, kept when it fits both clues
const wcFits = q => [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].filter(p => !q.not1.includes(p[0]) && p[1] !== q.not2);
export function genWhoColor(){
  for(;;){
    const kids = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3), cols = shuffle([0, 1, 2, 3]).slice(0, 3);
    const has = shuffle([0, 1, 2]);                       // has[k]: the colour (0–2, into cols) of the k-th child
    const not1 = shuffle([0, 1, 2].filter(c => c !== has[0])), not2 = [0, 1, 2].filter(c => c !== has[1] && c !== has[0])[0];
    const q = {kind:'whocolor', kids, cols, has, not1, not2};
    const fits = wcFits(q);
    if(fits.length !== 1) continue;
    const ask = Math.random() < 0.7 ? 2 : 1, at = has[ask];
    const texts = cols.map(c => [WC_COLS[c][0], WC_COLS[c][1]]).concat([['Не може да се каже', 'Не можна визначити']]);
    const ids = shuffle([0, 1, 2, 3]), pick = ids.indexOf(at);
    return Object.assign(q, {ask, options: ids.map((t, id) => ({ id, v: id, text: texts[t] })), pick, own: true, ans: pick});
  }
}
const wcKid = (q, k) => WC_KIDS[q.kids[k]], wcCol = (q, c) => WC_COLS[q.cols[c]];
// Level 299 Кой какво купил? (shape 'fruit'). Аз и числата 2022, задача 11: Мина, Иво и Петър bought an apple, a pear
// and a banana. Мина does not like bananas. The boy who bought the apple has a name that starts with a vowel. Only Иво
// does, so the apple is his; Мина, not the banana, has the pear; Петър the banana. The vowel clue names a boy, so a
// girl whose name starts with a vowel (Ели, Ана) is not it; asked of one child at a time.
// [Bulgarian, Ukrainian]; a fruit: [Bulgarian, its plural, Ukrainian, accusative, genitive plural]
/** @type {[string, string][]} */
const WF_GIRLS = [['Мина', 'Міна'], ['Рая', 'Рая'], ['Ния', 'Нія'], ['Ели', 'Елі'], ['Ана', 'Ана']];
/** @type {[string, string][]} */
const WF_VOWEL = [['Иво', 'Іво'], ['Ангел', 'Ангел'], ['Емил', 'Еміл'], ['Асен', 'Асен'], ['Огнян', 'Огнян']];
/** @type {[string, string][]} */
const WF_CONS = [['Петър', 'Петро'], ['Борис', 'Борис'], ['Никола', 'Нікола'], ['Стефан', 'Стефан'], ['Тодор', 'Тодор']];
/** @type {[string, string, string, string, string][]} */
const WF_FRUIT = [['ябълка', 'ябълки', 'яблуко', 'яблуко', 'яблук'], ['круша', 'круши', 'груша', 'грушу', 'груш'], ['банан', 'банани', 'банан', 'банан', 'бананів'],
                  ['портокал', 'портокали', 'апельсин', 'апельсин', 'апельсинів'], ['праскова', 'праскови', 'персик', 'персик', 'персиків']];
// kids: [girl, vowel boy, consonant boy] (indexes into their lists), in the order named: the girl first; fruits: the three
// bought, in the order named; has[k]: the fruit (0–2) of child k (0 girl, 1 vowel boy, 2 consonant boy); vowel: the clue
// names the boy whose name starts with a vowel (else a consonant); the girl does not like the other boy's fruit
export const wfFits = q => [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].filter(p => {
  const named = q.vowel ? 1 : 2, other = 3 - named;
  return p[0] !== q.has[other] && p[named] === q.has[named];
});
export function genWhoFruit(){
  for(;;){
    const g = shuffle([0, 1, 2, 3, 4])[0], v = shuffle([0, 1, 2, 3, 4])[0], c = shuffle([0, 1, 2, 3, 4])[0], fruits = shuffle([0, 1, 2, 3, 4]).slice(0, 3);
    const has = shuffle([0, 1, 2]), vowel = Math.random() < 0.7, boys = Math.random() < 0.5 ? [1, 2] : [2, 1], ask = shuffle([0, 1, 2])[0];
    const q = {kind:'whocolor', shape:'fruit', kids:[g, v, c], order:[0].concat(boys), fruits, has, vowel, ask};
    if(wfFits(q).length !== 1) continue;
    const texts = fruits.map(f => [WF_FRUIT[f][0], WF_FRUIT[f][2]]).concat([['Не може да се каже', 'Не можна визначити']]);
    const ids = shuffle([0, 1, 2, 3]), pick = ids.indexOf(has[ask]);
    return Object.assign(q, {options: ids.map((t, id) => ({ id, v: id, text: texts[t] })), pick, own: true, ans: pick});
  }
}
const wfKid = (q, k) => [WF_GIRLS, WF_VOWEL, WF_CONS][k][q.kids[k]], wfFr = (q, i) => WF_FRUIT[q.fruits[i]];
function drawWhoFruit(q){
  const ks = q.order.map(k => wfKid(q, k)), fs = [0, 1, 2].map(i => wfFr(q, i)), G = wfKid(q, 0), other = q.vowel ? 2 : 1;
  const not = wfFr(q, q.has[other]), X = wfFr(q, q.has[q.vowel ? 1 : 2]), who = wfKid(q, q.ask), girl = q.ask === 0;
  return '<div class="ask">' + tr(ks.map(k => k[0]).join(', ').replace(/, ([^,]*)$/, ' и $1') + ' си купили ' + fs.map(f => f[0]).join(', ').replace(/, ([^,]*)$/, ' и $1') + '. ' + G[0] + ' не обича ' + not[1] +
      '. Името на момчето, което купило ' + X[0] + ', започва с буква на ' + (q.vowel ? 'гласен' : 'съгласен') + ' звук. <b>Кой плод си е купил' + (girl ? 'а ' : ' ') + who[0] + '?</b>',
    ks.map(k => k[1]).join(', ').replace(/, ([^,]*)$/, ' і $1') + ' купили ' + fs.map(f => f[3]).join(', ').replace(/, ([^,]*)$/, ' і $1') + '. ' + G[1] + ' не любить ' + not[4] +
      '. Ім’я хлопчика, який купив ' + X[3] + ', починається з літери ' + (q.vowel ? 'голосного' : 'приголосного') + ' звука. <b>Який фрукт ' + (girl ? 'купила ' : 'купив ') + who[1] + '?</b>') + '</div>';
}
function eqWhoFruit(q){
  return q.order.map(k => tr(wfKid(q, k)[0], wfKid(q, k)[1]) + ' — ' + tr(wfFr(q, q.has[k])[0], wfFr(q, q.has[k])[2])).join(', ');
}
function whyWhoFruit(q, full){
  if(!full) return tr('Започни от момчето от втората подсказка: само на едно от двете момчета името започва с такъв звук.', 'Почни з хлопчика з другої підказки: лише в одного з двох хлопчиків ім’я починається з такого звука.');
  const named = q.vowel ? 1 : 2, other = 3 - named, N = wfKid(q, named), O = wfKid(q, other), G = wfKid(q, 0), fr = k => wfFr(q, q.has[k]);
  return tr(N[0] + ' е единственото момче, чието име започва с ' + (q.vowel ? 'гласен' : 'съгласен') + ' звук → <b>' + fr(named)[0] + '</b>; &nbsp;' + G[0] + ': не ' + fr(other)[0] + ', не ' + fr(named)[0] + ' → <b>' + fr(0)[0] + '</b>; &nbsp;' +
      O[0] + ' → остава <b>' + fr(other)[0] + '</b>',
    N[1] + ' — єдиний хлопчик, чиє ім’я починається з ' + (q.vowel ? 'голосного' : 'приголосного') + ' звука → <b>' + fr(named)[2] + '</b>; &nbsp;' + G[1] + ': не ' + fr(other)[2] + ', не ' + fr(named)[2] + ' → <b>' + fr(0)[2] + '</b>; &nbsp;' +
      O[1] + ' → лишається <b>' + fr(other)[2] + '</b>');
}
function drawWhoColor(q){
  if(q.shape === 'fruit') return drawWhoFruit(q);
  const [a, b, c] = [0, 1, 2].map(k => wcKid(q, k)), cs = [0, 1, 2].map(k => wcCol(q, k)), n1 = q.not1.map(k => wcCol(q, k)), n2 = wcCol(q, q.not2), who = wcKid(q, q.ask);
  return '<div class="ask">' + tr(a[0] + ', ' + b[0] + ' и ' + c[0] + ' имат по един балон с различен цвят – ' + cs.map(x => x[0]).join(', ').replace(/, ([^,]*)$/, ' и $1') +
    '. Балонът на ' + a[0] + ' не е нито ' + n1[0][0] + ', нито ' + n1[1][0] + '. Балонът на ' + b[0] + ' не е ' + n2[0] + '. <b>Какъв цвят е балонът на ' + who[0] + '?</b>',
    'У ' + a[2] + ', ' + b[2] + ' і ' + c[2] + ' є по одній кульці різного кольору – ' + cs.map(x => x[1]).join(', ').replace(/, ([^,]*)$/, ' і $1') +
    '. Кулька ' + a[2] + ' ні ' + n1[0][1] + ', ні ' + n1[1][1] + '. Кулька ' + b[2] + ' не ' + n2[1] + '. <b>Якого кольору кулька ' + who[2] + '?</b>') + '</div>';
}
function eqWhoColor(q){
  if(q.shape === 'fruit') return eqWhoFruit(q);
  return [0, 1, 2].map(k => tr(wcKid(q, k)[0], wcKid(q, k)[1]) + ' — ' + tr(wcCol(q, q.has[k])[0], wcCol(q, q.has[k])[1])).join(', ');
}
function whyWhoColor(q, full){
  if(q.shape === 'fruit') return whyWhoFruit(q, full);
  if(!full) return tr('Започни от детето, за което се казва кои два цвята не са неговите.', 'Почни з дитини, про яку сказано, яких двох кольорів у неї немає.');
  const [a, b, c] = [0, 1, 2].map(k => wcKid(q, k)), col = k => wcCol(q, q.has[k]);
  return tr(a[0] + ': не ' + q.not1.map(k => wcCol(q, k)[0]).join(', не ') + ' → <b>' + col(0)[0] + '</b>; &nbsp;' + b[0] + ': не ' + wcCol(q, q.not2)[0] + ', не ' + col(0)[0] + ' → <b>' + col(1)[0] + '</b>; &nbsp;' +
      c[0] + ' → остава <b>' + col(2)[0] + '</b>',
    a[1] + ': не ' + q.not1.map(k => wcCol(q, k)[1]).join(', не ') + ' → <b>' + col(0)[1] + '</b>; &nbsp;' + b[1] + ': не ' + wcCol(q, q.not2)[1] + ', не ' + col(0)[1] + ' → <b>' + col(1)[1] + '</b>; &nbsp;' +
      c[1] + ' → лишається <b>' + col(2)[1] + '</b>');
}
KIND.whocolor = { draw:drawWhoColor, eq:eqWhoColor, why:whyWhoColor };
