// Question kind 'bounds': level 440 5 + 7 < ♡ < 20 − 6 — A number squeezed between two sums, then used.

// Салабашев 2023, задача 2: 5 + 7 < ♡ < 20 − 6 and ♡ + 18 = ♣ and 16 + ♣ < ◊ < 21 + 28 — ◊ − ♡ − ♣? The two sides make 12 and 14, and the only
// whole number between them is 13 = ♡; ♣ = 13 + 18 = 31; 16 + 31 = 47 and 21 + 28 = 49 leave only 48 = ◊; and 48 − 13 − 31 = 4.
// q.lo, q.hi: the bounds of ♡ as [a, '+', b] and [c, '−', d]; q.m: the number added to ♣ in the lower bound of ◊, q.e, q.g the upper bound's addends.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genBounds(){
  for(;;){
    const h = 11 + rnd(30), a = 2 + rnd(h - 3), d = 2 + rnd(10), c = h + 1 + d, k = 10 + rnd(16), club = h + k;
    const m = h + rnd(11), f = m + club + 1, e = 11 + rnd(Math.max(1, f - 12)), g = f + 1 - e;
    if(g < 2 || f > 99 || m + 1 - h < 2 || e === a || e === c) continue;
    return {kind:'bounds', h, k, club, f, lo:[a, h - 1 - a], hi:[c, d], m, up:[e, g], ans: f - h - club};
  }
}
const sym = x => '<span class="circle">' + x + '</span>';
function drawBounds(q){
  return '<div class="ask">' + tr('Числата ' + sym('♡') + ', ' + sym('♣') + ' и ' + sym('◊') + ' са цели. Колко е <b>' + '◊ − ♡ − ♣</b>?', 'Числа ' + sym('♡') + ', ' + sym('♣') + ' і ' + sym('◊') + ' — цілі. Чому дорівнює <b>◊ − ♡ − ♣</b>?') + '</div>' +
    '<div class="given">' + q.lo[0] + ' + ' + q.lo[1] + ' &lt; ' + sym('♡') + ' &lt; ' + q.hi[0] + ' − ' + q.hi[1] + '<br>' + sym('♡') + ' + ' + q.k + ' = ' + sym('♣') +
    '<br>' + q.m + ' + ' + sym('♣') + ' &lt; ' + sym('◊') + ' &lt; ' + q.up[0] + ' + ' + q.up[1] + '</div>' +
    '<div class="line lg">◊ − ♡ − ♣ = ' + SLOT + '</div>';
}
function eqBounds(q){
  return '♡ = ' + q.h + ', ♣ = ' + q.club + ', ◊ = ' + q.f + ' → ' + q.f + ' − ' + q.h + ' − ' + q.club + ' = ' + q.ans;
}
function whyBounds(q, full){
  if(!full) return tr('Пресметни двете граници на ♡ — между тях има само едно цяло число. После ♣, после границите на ◊.', 'Обчисли обидві межі ♡ — між ними лише одне ціле число. Потім ♣, потім межі ◊.');
  return (q.h - 1) + ' &lt; ♡ &lt; ' + (q.h + 1) + ' &nbsp;→&nbsp; ♡ = <b>' + q.h + '</b>, &nbsp;♣ = ' + q.h + ' + ' + q.k + ' = <b>' + q.club + '</b>, &nbsp;' +
    (q.m + q.club) + ' &lt; ◊ &lt; ' + (q.f + 1) + ' &nbsp;→&nbsp; ◊ = <b>' + q.f + '</b> &nbsp;→&nbsp; ' + q.f + ' − ' + q.h + ' − ' + q.club + ' = ' + q.ans;
}
KIND.bounds = { draw:drawBounds, eq:eqBounds, why:whyBounds };
