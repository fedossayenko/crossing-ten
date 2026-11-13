// Question kinds 'neither' and 'parents': levels 335 Нито едното, нито другото and 336 Колко най-много — two overlapping
// groups of the same children.
// 'neither' (shapes 'neither' and 'table'): the ones in no group, and a table of two yes/no kinds.
// 'parents' (shapes 'none' and 'both'): the most with no parent, the fewest with both, when only the counts are known.

// Кенгуру 2021, задача 11: 17 pupils, 11 learn English, 6 German, 5 both; neither: 11 + 6 − 5 = 12 learn at least one
// (the 5 are in both numbers), 17 − 12 = 5.
// Кенгуру 2021, задача 10: 19 members, 11 boys (the rest girls), 3 girls fair-haired, 15 dark-haired in all; dark-haired
// boys: 19 − 11 = 8 girls, 8 − 3 = 5 dark girls, 15 − 5 = 10 dark boys.
// Кенгуру 2022, задача 25: 25 pupils (no twins), 20 mothers and 16 fathers came; the most pupils with no parent there:
// at least 20 have a parent (the mothers' children), the fathers may be the same children, so at most 25 − 20 = 5.
import { KIND, SLOT, rnd, tr, ukN, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
const NEI_LANGS = [['английски', 'немски', 'англійську', 'німецьку', 'англійської', 'німецької'], ['немски', 'френски', 'німецьку', 'французьку', 'німецької', 'французької'],
  ['английски', 'испански', 'англійську', 'іспанську', 'англійської', 'іспанської'], ['френски', 'испански', 'французьку', 'іспанську', 'французької', 'іспанської']];
export function genNeither(){
  if(Math.random() < 0.5){
    for(;;){
      const li = rnd(NEI_LANGS.length), a = 7 + rnd(8), b = 4 + rnd(6), c = 2 + rnd(4), none = 2 + rnd(6);
      if(c >= Math.min(a, b)) continue;
      const some = a + b - c, n = some + none;
      return {kind:'neither', shape:'neither', li, a, b, c, n, some, traps:[some, n - a - b > 0 ? n - a - b : n - c], ans: none};
    }
  }
  for(;;){
    const N = 14 + rnd(11), B = 7 + rnd(6), G = N - B, f = 1 + rnd(5), sw = Math.random() < 0.35, kb = 2 + rnd(B - 2);
    if(G < 4 || f >= G) continue;
    const dg = G - f, D = dg + kb;
    return {kind:'neither', shape:'table', N, B, G, f, D, dg, sw, traps:[D - f, D - G], ans: kb};
  }
}
function drawNeither(q){
  if(q.shape === 'neither'){
    const [l1, l2, u1, u2, g1, g2] = NEI_LANGS[q.li];
    return '<div class="ask">' + tr('Учениците в едно извънкласно занимание са ' + num(q.n) + '. От тях ' + num(q.a) + ' учат ' + l1 + ' език, ' + num(q.b) + ' учат ' + l2 + ' език, а ' + num(q.c) +
        ' учат и двата езика. <b>Колко ученици в това извънкласно занимание не учат нито ' + l1 + ', нито ' + l2 + '?</b>',
      'На одному гуртку ' + ukPl(q.n, 'учень', 'учні', 'учнів') + '. З них ' + num(q.a) + ' вивчають ' + u1 + ' мову, ' + num(q.b) + ' вивчають ' + u2 + ' мову, а ' + num(q.c) +
        ' вивчають обидві мови. <b>Скільки учнів гуртка не вивчають ні ' + g1 + ', ні ' + g2 + '?</b>') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  const [w1, w2, v2] = q.sw ? ['момичетата', 'момчета', 'момчета'] : ['момчетата', 'момичета', 'момичета'];
  const [ukBoys, ukOther, ukOtherGen, ukOwnGen] = q.sw ? ['дівчатка', 'хлопчики', 'хлопчиків', 'дівчаток'] : ['хлопчики', 'дівчатка', 'дівчаток', 'хлопчиків'];
  return '<div class="ask">' + tr('Участниците в един клуб по интереси са ' + num(q.N) + ', като ' + w1 + ' са ' + num(q.B) + ', а останалите са ' + w2 + '. Част от участниците са тъмнокоси, а останалите са русокоси. ' +
      '<b>Колко от ' + w1 + ' са тъмнокоси</b>, ако ' + (q.f === 1 ? num(1) + ' ' + (q.sw ? 'момче е русокосо' : 'момиче е русокосо') : num(q.f) + ' ' + v2 + ' са русокоси') + ', а ' + num(q.D) + ' участници са тъмнокоси?',
    'У гуртку ' + ukPl(q.N, 'учасник', 'учасники', 'учасників') + ', з них ' + ukBoys + ' — ' + num(q.B) + ', а решта — ' + ukOther + '. Частина учасників темноволосі, решта світловолосі. ' +
      '<b>Скільки з ' + ukOwnGen + ' темноволосі</b>, якщо світловолосих ' + ukOtherGen + ' — ' + num(q.f) + ', а темноволосих учасників — ' + num(q.D) + '?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqNeither(q){
  if(q.shape === 'neither') return q.a + ' + ' + q.b + ' − ' + q.c + ' = ' + q.some + ', ' + q.n + ' − ' + q.some + ' = ' + q.ans;
  return q.N + ' − ' + q.B + ' = ' + q.G + ', ' + q.G + ' − ' + q.f + ' = ' + q.dg + ', ' + q.D + ' − ' + q.dg + ' = ' + q.ans;
}
function whyNeither(q, full){
  if(q.shape === 'neither'){
    if(!full) return tr('Тези, които учат и двата езика, са преброени два пъти — веднъж при едните и веднъж при другите. Колко ученици учат поне един език?',
                        'Ті, хто вивчає обидві мови, пораховані двічі. Скільки учнів вивчають хоча б одну мову?');
    return tr(q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + ', но ' + q.c + ' са преброени два пъти: ' + (q.a + q.b) + ' − ' + q.c + ' = ' + q.some + ' ученици учат поне един език. Не учат нито един: ' + q.n + ' − ' + q.some + ' = <b>' + q.ans + '</b>',
              q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + ', але ' + q.c + ' пораховані двічі: ' + (q.a + q.b) + ' − ' + q.c + ' = ' + q.some + ' — стільки учнів вивчають хоча б одну мову. Жодної не вивчають: ' + q.n + ' − ' + q.some + ' = <b>' + q.ans + '</b>');
  }
  if(!full) return tr('Колко са тези, които не са от първата група? От тях колко са русокоси, колко тъмнокоси?', 'Скільки тих, хто не з першої групи? З них скільки світловолосих, скільки темноволосих?');
  const gN = q.sw ? tr(q.G + ' момчета', ukN(q.G, 'хлопчик', 'хлопчики', 'хлопчиків')) : tr(q.G + ' момичета', ukN(q.G, 'дівчина', 'дівчини', 'дівчат'));
  return tr(q.N + ' − ' + q.B + ' = ' + gN + '; ' + (q.f === 1 ? '1 е русокосо' : q.f + ' са русокоси') + ', значи ' + q.G + ' − ' + q.f + ' = ' + q.dg + (q.dg === 1 ? ' е тъмнокосо' : ' са тъмнокоси') + '. Всички тъмнокоси са ' + q.D + ', значи ' + q.D + ' − ' + q.dg + ' = <b>' + q.ans + '</b> са от първата група',
            q.N + ' − ' + q.B + ' = ' + gN + '; ' + 'світловолосих ' + q.f + ', отже темноволосих ' + q.G + ' − ' + q.f + ' = ' + q.dg + '. Усіх темноволосих ' + q.D + ', отже ' + q.D + ' − ' + q.dg + ' = <b>' + q.ans + '</b> з першої групи');
}
KIND.neither = { draw:drawNeither, eq:eqNeither, why:whyNeither };

// shape 'none': the most pupils with neither parent there; shape 'both': the fewest with both there.
export function genParents(){
  for(;;){
    const none = Math.random() < 0.5, n = 20 + rnd(11), mom = 14 + rnd(n - 14), dad = 10 + rnd(n - 10);
    if(mom < dad || mom >= n) continue;
    if(none) return {kind:'parents', shape:'none', n, mom, dad, traps:[n - mom - dad > 0 ? n - mom - dad : n - dad, mom + dad - n], ans: n - mom};
    if(mom + dad <= n + 1 || mom + dad - n > dad) continue;
    return {kind:'parents', shape:'both', n, mom, dad, traps:[n - mom, mom + dad], ans: mom + dad - n};
  }
}
function drawParents(q){
  const ask = q.shape === 'none'
    ? tr('Колко най-много са учениците от класа, за които нито един от родителите им не е присъствал на родителската среща?', 'Скільки найбільше може бути учнів класу, для яких на зборах не було жодного з батьків?')
    : tr('Колко най-малко са учениците от класа, за които на родителската среща са присъствали и двамата родители?', 'Скільки найменше може бути учнів класу, для яких на зборах були обоє батьків?');
  return '<div class="ask">' + tr('Броят на учениците в един клас е ' + num(q.n) + ' и в класа няма близнаци. На родителска среща на класа присъствали ' + num(q.mom) + ' майки и ' + num(q.dad) + ' бащи. <b>' + ask + '</b>',
    'У класі ' + ukPl(q.n, 'учень', 'учні', 'учнів') + ', близнюків немає. На батьківські збори класу прийшли ' + ukPl(q.mom, 'мати', 'матері', 'матерів') + ' і ' + ukPl(q.dad, 'батько', 'батьки', 'батьків') + '. <b>' + ask + '</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqParents(q){
  return q.shape === 'none' ? q.n + ' − ' + q.mom + ' = ' + q.ans : q.mom + ' + ' + q.dad + ' − ' + q.n + ' = ' + q.ans;
}
function whyParents(q, full){
  if(q.shape === 'none'){
    if(!full) return tr('Няма близнаци, затова всеки ученик има свои майка и баща. За да остават колкото може повече без родител, бащите трябва да са на същите ученици като майките. Колко ученици имат поне един родител тогава?',
                        'У кожного учня свої мама й тато. Щоб без батьків лишилося якнайбільше, тати мають бути в тих самих учнів, що й мами. Скільки учнів тоді мають когось із батьків?');
    return tr('майките са ' + q.mom + ', значи поне ' + q.mom + ' ученици имат родител там; най-добре бащите (' + q.dad + ') са от същите ученици, тогава не се добавят нови. Без родител: ' + q.n + ' − ' + q.mom + ' = <b>' + q.ans + '</b>',
              'мам ' + q.mom + ', тож учнів, у яких є хтось із батьків, щонайменше ' + q.mom + '; найкраще, щоб тати (' + q.dad + ') були з тих самих учнів. Без батьків: ' + q.n + ' − ' + q.mom + ' = <b>' + q.ans + '</b>');
  }
  if(!full) return tr('Всеки ученик има най-много двама родители на срещата. Първо раздай по един родител на ученик, колко остават?', 'У кожного учня на зборах найбільше двоє батьків. Спершу дай кожному учню по одному з батьків — скільки лишиться?');
  return tr('родителите са ' + q.mom + ' + ' + q.dad + ' = ' + (q.mom + q.dad) + ', учениците са ' + q.n + '. Ако на всеки ученик се падне по един, остават ' + (q.mom + q.dad) + ' − ' + q.n + ' = <b>' + q.ans + '</b> родители, а те са втори родител на ученици, които вече имат един',
            'батьків ' + q.mom + ' + ' + q.dad + ' = ' + (q.mom + q.dad) + ', учнів ' + q.n + '. Якщо кожному по одному, лишається ' + (q.mom + q.dad) + ' − ' + q.n + ' = <b>' + q.ans + '</b> — це другі з батьків учнів, що вже мають одного');
}
KIND.parents = { draw:drawParents, eq:eqParents, why:whyParents };
