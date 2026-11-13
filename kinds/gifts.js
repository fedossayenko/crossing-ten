// Question kind 'gifts': level 316 На кое рафтче не? — Five things on five shelves from a few clues: the one shelf that cannot hold the fifth thing.

// Кенгуру 2021, задача 24: a book, a ball, a constructor, a puzzle and a calculator, one on each of five shelves numbered 1–5 from the
// bottom. The ball is higher than the book and lower than the constructor; the calculator is directly above the ball. On which shelf
// is the puzzle surely not? The ball cannot be on 1 (the book is under it) or on 4 (the calculator is on 5, nothing is left above
// for the constructor), so it is on 2 or 3: with the ball on 3 the calculator is on 4 and the constructor on 5 (the puzzle takes 1 or
// 2), with the ball on 2 the calculator is on 3. Every shelf can hold the puzzle except 3 — answer 3. Every arrangement is tried here.
import { KIND, SLOT, shuffle, tr } from '../js/core.js';
// [Bulgarian in a list, Bulgarian as the subject, Ukrainian accusative, Ukrainian nominative, Ukrainian instrumental, the ending of «поставен»]
/** @type {[string, string, string, string, string, string][]} */
const GF = [['книгата', 'книгата', 'книжку', 'книжка', 'книжкою', 'а'], ['топката', 'топката', 'м’яч', 'м’яч', 'м’ячем', 'а'], ['конструктора', 'конструкторът', 'конструктор', 'конструктор', 'конструктором', ''],
  ['пъзела', 'пъзелът', 'пазл', 'пазл', 'пазлом', ''], ['калкулатора', 'калкулаторът', 'калькулятор', 'калькулятор', 'калькулятором', ''], ['часовника', 'часовникът', 'годинник', 'годинник', 'годинником', ''], ['робота', 'роботът', 'робот', 'робот', 'роботом', '']];
/** every way to put the five things on shelves 1–5 (index = shelf − 1, bottom first) that keeps the clues */
export function giftFits(q){
  const out = [], [A, B, C, D, E] = q.roles;
  const go = (row, left) => {
    if(!left.length){
      const at = x => row.indexOf(x) + 1;
      const chain = q.down ? at(A) > at(B) && at(B) > at(C) : at(A) < at(B) && at(B) < at(C);
      if(chain && at(D) === at(B) + (q.above ? 1 : -1)) out.push(row);
      return;
    }
    left.forEach(x => go(row.concat([x]), left.filter(y => y !== x)));
  };
  go([], [A, B, C, D, E]);
  return out;
}
export function genGifts(){
  for(;;){
    const roles = shuffle([0, 1, 2, 3, 4, 5, 6]).slice(0, 5), q = {kind:'gifts', roles, down: Math.random() < 0.3, above: Math.random() < 0.7, traps:[], ans: 0};
    const free = new Set(giftFits(q).map(r => r.indexOf(roles[4]) + 1)), never = [1, 2, 3, 4, 5].filter(s => !free.has(s));
    if(never.length !== 1) continue;
    q.ans = never[0]; q.traps = [...free];
    return q;
  }
}
const shelfSvg = () => '<svg viewBox="0 0 80 100" width="64" height="80" style="float:right; margin:0 0 4px 10px" role="img" aria-label="' + tr('шкаф с рафтчета 1–5 отдолу нагоре', 'шафа з поличками 1–5 знизу вгору') + '"><rect x="6" y="4" width="68" height="92" fill="none" stroke="var(--line)" stroke-width="2"/>' +
  [1, 2, 3, 4, 5].map(n => '<rect x="8" y="' + (96 - n*18 - 2) + '" width="64" height="16" fill="var(--accentbg)" stroke="var(--line)"/><text x="40" y="' + (96 - n*18 + 11) + '" text-anchor="middle" font-size="12" font-weight="800" fill="var(--muted)" font-family="Nunito, sans-serif">' + n + '</text>').join('') + '</svg>';
function drawGifts(q){
  const [A, B, C, D, E] = q.roles, list = [A, B, C, E, D];
  const bgList = list.map(i => GF[i][0]).join(', ').replace(/, ([^,]*)$/, ' и $1'), ukList = list.map(i => GF[i][2]).join(', ').replace(/, ([^,]*)$/, ' і $1');
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const bgChain = q.down ? cap(GF[B][1]) + ' е по-ниско от ' + GF[A][0] + ' и по-високо от ' + GF[C][0] : cap(GF[B][1]) + ' е по-високо от ' + GF[A][0] + ' и по-ниско от ' + GF[C][0];
  const ukChain = q.down ? cap(GF[B][3]) + ' нижче за ' + GF[A][2] + ' і вище за ' + GF[C][2] : cap(GF[B][3]) + ' вище за ' + GF[A][2] + ' і нижче за ' + GF[C][2];
  const bg = 'Стоян подредил ' + bgList + ', които получил от Дядо Коледа, по един подарък на всяко от петте рафтчета на шкафа вдясно. Рафтчетата са номерирани отдолу нагоре. ' + bgChain + ', а ' + GF[D][1] + ' е непосредствено ' + (q.above ? 'над ' : 'под ') + GF[B][0] + '. ';
  const uk = 'Стоян розклав ' + ukList + ', які отримав від Діда Мороза, по одному подарунку на кожну з п’яти поличок шафи праворуч. Полички пронумеровані знизу вгору. ' + ukChain + ', а ' + GF[D][3] + ' лежить безпосередньо ' + (q.above ? 'над ' : 'під ') + GF[B][4] + '. ';
  return '<div class="ask">' + shelfSvg() + tr(bg + '<b>Кой е номерът на рафтчето, за което можем да бъдем сигурни, че на него не е поставен' + GF[E][5] + ' ' + GF[E][1] + '?</b>',
    uk + '<b>Який номер має полиця, про яку можна напевно сказати, що на ній не лежить ' + GF[E][3] + '?</b>') + '</div><div class="line xl">' + SLOT + '</div>';
}
function eqGifts(q){
  return tr('никога на ' + q.ans, 'ніколи на ' + q.ans);
}
function whyGifts(q, full){
  if(!full) return tr('Първо намери къде може да е средният подарък: тогава и другите са на места. Кое рафтче остава, когато го пробваш на всяко?', 'Спершу знайди, де може бути середній подарунок: тоді й інші стоять на місцях. Яка полиця лишається, коли пробуєш кожну?');
  const fits = giftFits(q), [, , , , E] = q.roles, rows = new Map();
  fits.forEach(r => rows.set(r.map(i => tr(GF[i][0], GF[i][3])).join(', '), r.indexOf(E) + 1));
  const lines = [...rows.keys()].slice(0, 8).map(k => '<span class="num">' + k + '</span>');
  return tr('отдолу нагоре, така може: ', 'знизу вгору, так можна: ') + lines.join(' &nbsp;|&nbsp; ') + ' &nbsp;→&nbsp; ' + tr(GF[E][1] + ' е на ' + [...new Set(rows.values())].sort().join(', ') + ' — никога на ', GF[E][3] + ' на ' + [...new Set(rows.values())].sort().join(', ') + ' — ніколи на ') + '<b>' + q.ans + '</b>';
}
KIND.gifts = { draw:drawGifts, eq:eqGifts, why:whyGifts };
