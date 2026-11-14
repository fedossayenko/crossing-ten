// Question kind 'bloomchange': level 465 Лалета и нарциси — Two counts, one grows and one shrinks: how many more of the first.

// Салабашев 2024, 2 клас, задача 10: 27 tulips and 35 daffodils in the yard; 14 more flowers come out, all tulips, and Вени picks 18
// daffodils — by how many are the tulips then more than the daffodils? 27 + 14 = 41 tulips, 35 − 18 = 17 daffodils, 41 − 17 = 24.
import { KIND, answerLine, rnd, tr, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// a pair of flowers: Bulgarian [counted, «все …», «от …те», «…те»] for each; Ukrainian [one, few, many, genitive plural] for each
/** @type {{ bg: string[][], uk: string[][] }[]} */
const PAIRS = [
  { bg:[['лалета', 'лалета', 'лалетата'], ['нарциса', 'нарцисите', 'нарцисите']], uk:[['тюльпан', 'тюльпани', 'тюльпанів'], ['нарцис', 'нарциси', 'нарцисів']] },
  { bg:[['рози', 'рози', 'розите'], ['маргаритки', 'маргаритките', 'маргаритките']], uk:[['троянда', 'троянди', 'троянд'], ['ромашка', 'ромашки', 'ромашок']] },
];
export function genBloomChange(){
  for(;;){
    const pair = rnd(PAIRS.length), x = 15 + rnd(31), y = 25 + rnd(26), a = 8 + rnd(13), b = 8 + rnd(17);
    if(b >= y || x + a <= y - b || x + a - (y - b) > 60) continue;
    return {kind:'bloomchange', pair, x, y, a, b, X: x + a, Y: y - b, traps:[x + a - y].filter(v => v > 0 && v !== x + a - (y - b)), ans: x + a - (y - b)};
  }
}
function drawBloomChange(q){
  const p = PAIRS[q.pair], [t, d] = p.bg, [ut, ud] = p.uk;
  return '<div class="ask">' + tr('В двора са цъфнали ' + num(q.x) + ' ' + t[0] + ' и ' + num(q.y) + ' ' + d[0] + '. Цъфнат още ' + num(q.a) + ' цветя — все ' + t[1] + ', а Вени откъсне ' + num(q.b) + ' от ' + d[1] + '. <b>С колко цъфналите ' + t[2] + ' в двора ще са повече от цъфналите ' + d[2] + ' там?</b>',
    'У дворі розквітли ' + ukPl(q.x, ut[0], ut[1], ut[2]) + ' і ' + ukPl(q.y, ud[0], ud[1], ud[2]) + '. Розквітнуть ще ' + ukPl(q.a, 'квітка', 'квітки', 'квіток') + ' — усі ' + ut[1] + ', а Веня зірве ' + ukPl(q.b, ud[0], ud[1], ud[2]) + '. <b>На скільки розквітлих ' + ut[2] + ' у дворі буде більше, ніж розквітлих ' + ud[2] + '?</b>') + '</div>' + answerLine('xl');
}
function eqBloomChange(q){
  return q.x + ' + ' + q.a + ' = ' + q.X + ', ' + q.y + ' − ' + q.b + ' = ' + q.Y + ', ' + q.X + ' − ' + q.Y + ' = ' + q.ans;
}
function whyBloomChange(q, full){
  if(!full) return tr('Първо намери колко ще са цъфналите от всеки вид след промените. После ги сравни.', 'Спершу знайди, скільки буде розквітлих кожного виду після змін. Потім порівняй.');
  const p = PAIRS[q.pair];
  return tr(p.bg[0][2] + ' са ', p.uk[0][2] + ': ') + q.x + ' + ' + q.a + ' = <b>' + q.X + '</b>' + tr(', ' + p.bg[1][2] + ' — ', ', ' + p.uk[1][2] + ': ') + q.y + ' − ' + q.b + ' = <b>' + q.Y + '</b> &nbsp;→&nbsp; ' + q.X + ' − ' + q.Y + ' = ' + q.ans;
}
KIND.bloomchange = { draw:drawBloomChange, eq:eqBloomChange, why:whyBloomChange };
