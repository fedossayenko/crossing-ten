// Question kind 'alldiff': level 332 Всички различни — the most one can have when the others are all different and
// as small as they can be.

// Кенгуру 2025, задача 26: 17 sparrows on 3 trees, at least 2 on each, no two trees equal. The most on one tree: the
// other two hold as few as possible, 2 and 3, so the first has 17 − 2 − 3 = 12.
// Кенгуру 2026, задача 18: the father, the mother (30) and three children, all ages different, the five add to 67, the
// father the oldest. The children are at least 1 + 2 + 3 = 6, so the father is at most 67 − 30 − 6 = 31; and he is older
// than the mother, so at least 31. The father is 31.
import { KIND, SLOT, rnd, tr, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
export function genAllDiff(){
  if(Math.random() < 0.5){
    // t trees, at least m on each, no two equal: the others hold m, m + 1, …
    const t = 3 + rnd(2), m = 1 + rnd(3), rest = [...Array(t - 1)].map((_, i) => m + i), most = rest[t - 2] + 2 + rnd(8), n = rest.reduce((a, b) => a + b, 0) + most;
    return {kind:'alldiff', shape:'birds', t, m, n, rest, traps:[n - (t - 1)*m, n - rest[t - 2] - m], ans: most};
  }
  // the mother M, the father one year older (the only age he can be), c children as young as 1, 2, 3
  const c = 2 + rnd(2), M = 25 + rnd(20), kids = [...Array(c)].map((_, i) => i + 1), ks = kids.reduce((a, b) => a + b, 0), S = M + M + 1 + ks;
  return {kind:'alldiff', shape:'family', c, M, S, kids, ks, traps:[S - M - 3, S - M - ks - 1], ans: M + 1};
}
function drawAllDiff(q){
  if(q.shape === 'birds')
    return '<div class="ask">' + tr('На ' + num(q.t) + ' дървета в горичката са кацнали общо ' + num(q.n) + ' врабчета. На всяко дърво има най-малко ' + num(q.m) + ' ' + (q.m === 1 ? 'врабче' : 'врабчета') +
        ' и няма 2 дървета с еднакъв брой врабчета. <b>Колко врабчета най-много е възможно да са кацнали на едно от дърветата?</b>',
      'На ' + num(q.t) + ' деревах у гаю сіло разом ' + ukPl(q.n, 'горобець', 'горобці', 'горобців') + '. На кожному дереві сидить щонайменше ' + num(q.m) + ' ' + (q.m === 1 ? 'горобець' : 'горобці') +
        ', і немає 2 дерев з однаковою кількістю горобців. <b>Яку найбільшу кількість горобців може бути на одному з дерев?</b>') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  const kids = q.c === 3 ? ['трите им деца', 'петимата', 'трьох їхніх дітей', 'п\'ятьох'] : ['двете им деца', 'четиримата', 'двох їхніх дітей', 'чотирьох'];
  return '<div class="ask">' + tr('Годините на бащата, майката и на ' + kids[0] + ' са различни числа. Майката е на ' + num(q.M) + ' години, а сборът от годините на ' + kids[1] + ' е ' + num(q.S) +
      '. <b>На колко години е бащата, ако той е най-възрастен?</b>',
    'Роки батька, матері та ' + kids[2] + ' — різні числа. Мамі ' + ukPl(q.M, 'рік', 'роки', 'років') + ', а сума років ' + kids[3] + ' дорівнює ' + num(q.S) + '. <b>Скільки років батькові, якщо він найстарший?</b>') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqAllDiff(q){
  if(q.shape === 'birds') return q.n + ' − ' + q.rest.join(' − ') + ' = ' + q.ans;
  return q.S + ' − ' + q.M + ' − (' + q.kids.join(' + ') + ') = ' + q.ans;
}
function whyAllDiff(q, full){
  if(!full) return q.shape === 'birds'
    ? tr('За да е на едно дърво колкото може повече, на другите трябва да са колкото може по-малко. Колко най-малко може да има на всяко от тях, ако не са равни?',
         'Щоб на одному дереві було якомога більше, на інших має бути якомога менше. Скільки щонайменше може бути на кожному з них, якщо вони різні?')
    : tr('Децата са с различни години. Колко най-малко са годините им заедно? После колко остава за бащата?',
         'Діти різного віку. Скільки щонайменше їхні роки разом? Потім скільки лишається батькові?');
  if(q.shape === 'birds')
    return tr('другите дървета най-малко: ' + q.rest.join(', ') + ' (различни, не по-малко от ' + q.m + ') &nbsp;→&nbsp; ' + q.n + ' − ' + q.rest.join(' − ') + ' = <b>' + q.ans + '</b>',
              'інші дерева щонайменше: ' + q.rest.join(', ') + ' (різні, не менше ' + q.m + ') &nbsp;→&nbsp; ' + q.n + ' − ' + q.rest.join(' − ') + ' = <b>' + q.ans + '</b>');
  return tr('децата са най-малко ' + q.kids.join(' + ') + ' = ' + q.ks + ', значи бащата е най-много ' + q.S + ' − ' + q.M + ' − ' + q.ks + ' = ' + (q.M + 1) + '. А той е по-възрастен от майката (' + q.M + '), значи е <b>' + q.ans + '</b>',
            'діти щонайменше ' + q.kids.join(' + ') + ' = ' + q.ks + ', тож батько щонайбільше ' + q.S + ' − ' + q.M + ' − ' + q.ks + ' = ' + (q.M + 1) + '. А він старший за маму (' + q.M + '), отже <b>' + q.ans + '</b>');
}
KIND.alldiff = { draw:drawAllDiff, eq:eqAllDiff, why:whyAllDiff };
