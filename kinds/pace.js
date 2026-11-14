// Question kind 'pace': level 466 Колко за по-дълго време — So much in a few minutes: how much in a longer time that is whole lots of it.

// Салабашев 2023, 2 клас, задача 12: Емил reads 3 pages in 5 minutes — how many pages in 20 minutes? 20 minutes is 5, 10, 15, 20: four
// lots of 5 minutes, and four lots of 3 pages are 3 + 3 + 3 + 3 = 12. Counted by adding, never multiplied.
import { KIND, addUp, answerLine, rnd, tr, ukN, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// who and what: Bulgarian name, «does» (habitual), «will do», thing (few, many); Ukrainian name, «does», «will do», thing (one, few, many)
/** @type {{ bg: string[], uk: string[] }[]} */
const DOES = [{ bg:['Емил', 'прочита', 'прочете', 'страници'], uk:['Еміл', 'читає', 'прочитає', 'сторінка', 'сторінки', 'сторінок'] },
  { bg:['Мила', 'рисува', 'нарисува', 'рисунки'], uk:['Міла', 'малює', 'намалює', 'малюнок', 'малюнки', 'малюнків'] },
  { bg:['Иво', 'сгъва', 'сгъне', 'хартиени лодки'], uk:['Іво', 'складає', 'складе', 'паперовий човник', 'паперові човники', 'паперових човників'] }];
export function genPace(){
  const w = rnd(DOES.length), a = 2 + rnd(5), b = [5, 10, 15][rnd(3)], k = 3 + rnd(b === 15 ? 2 : 4);
  return {kind:'pace', w, a, b, k, total: k*b, traps:[a + b], ans: k*a};
}
function drawPace(q){
  const d = DOES[q.w];
  return '<div class="ask">' + tr(d.bg[0] + ' ' + d.bg[1] + ' по ' + num(q.a) + ' ' + d.bg[3] + ' за ' + num(q.b) + ' минути. <b>Колко ' + d.bg[3] + ' ще ' + d.bg[2] + ' ' + d.bg[0] + ' за ' + num(q.total) + ' минути?</b>',
    d.uk[0] + ' ' + d.uk[1] + ' по ' + ukPl(q.a, d.uk[3], d.uk[4], d.uk[5]) + ' за ' + num(q.b) + ' хвилин. <b>Скільки ' + d.uk[5] + ' ' + d.uk[2] + ' ' + d.uk[0] + ' за ' + num(q.total) + ' хвилин?</b>') + '</div>' + answerLine('xl');
}
// 5, 10, 15, 20: the minutes counted in lots
const lots = (b, k) => Array.from({length: k}, (_, i) => b*(i + 1)).join(', ');
function eqPace(q){
  return lots(q.b, q.k) + ' → ' + Array(q.k).fill(q.a).join(' + ') + ' = ' + q.ans;
}
function whyPace(q, full){
  if(!full) return tr('Колко пъти по толкова минути има в цялото време? Брой с отброяване.', 'Скільки разів по стільки хвилин у всьому часі? Рахуй кроками.');
  return lots(q.b, q.k) + ' &nbsp;→&nbsp; ' + tr(q.k + ' пъти по ' + q.b + ' минути', ukN(q.k, 'раз', 'рази', 'разів') + ' по ' + q.b + ' хвилин') + ' &nbsp;→&nbsp; ' + addUp(q.k, q.a);
}
KIND.pace = { draw:drawPace, eq:eqPace, why:whyPace };
