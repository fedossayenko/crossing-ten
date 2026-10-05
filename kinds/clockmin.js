// Question kind 'clockmin': level 149 До новата година — Minutes from a clock time to the next full hour, or the one after.

// Коледно 2022, задача 3: at 23:37 on 31 December Ани tasted the cake — how many minutes until the new year?
// An hour is 60 minutes and 37 of it are gone: 60 − 37 = 23. The traps: 37 (the minutes read off) and 63.
// The time is written as the paper writes it, the minutes raised: 23³⁷.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const hm = (h, m) => h + '<sup>' + String(m).padStart(2, '0') + '</sup>';
export function genClockMin(){
  const ny = Math.random() < 0.4, h = ny ? 23 : 7 + rnd(14), m = 5 + rnd(54), two = !ny && Math.random() < 0.3;
  const ans = 60 - m + (two ? 60 : 0);
  // the traps: the minutes read off, 100 − m (an hour taken as a hundred), and the second hour forgotten
  return {kind:'clockmin', ny, h, m, two, traps:(two ? [60 - m, 100 - m + 60] : [m, 100 - m]).filter(v => v > 0 && v !== ans), ans};
}
function drawClockMin(q){
  const t = hm(q.h, q.m), to = hm((q.h + (q.two ? 2 : 1)) % 24, 0);
  return '<div class="ask">' + (q.ny ? tr('В ' + t + ' часа на 31 декември Ани опитала от тортата. Колко минути след това е започнала новата година?',
                                          'О ' + t + ' 31 грудня Аня скуштувала торт. Через скільки хвилин після цього почався новий рік?')
    : tr('Ани започнала да чете в ' + t + ' часа и спряла в ' + to + ' часа. Колко минути е чела?', 'Аня почала читати о ' + t + ' і закінчила о ' + to + '. Скільки хвилин вона читала?')) + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('мин', 'хв') + '</span></div>';
}
function eqClockMin(q){
  return (q.two ? '60 + ' : '') + '60 − ' + q.m + ' = ' + q.ans;
}
function whyClockMin(q, full){
  if(!full) return tr('Един час е 60 минути. Колко от тях вече са минали?', 'Година — це 60 хвилин. Скільки з них уже минуло?');
  const next = q.h + 1;                      // 23:37 counts on to 24 часа, which is midnight
  return tr('до ' + next + ' часа: ', 'до ' + next + ':00 — ') + '60 − ' + q.m + ' = <b>' + (60 - q.m) + '</b>' + (q.two ? tr(', и още един час: ', ', і ще одна година: ') + (60 - q.m) + ' + 60 = ' + q.ans : '');
}
KIND.clockmin = { draw:drawClockMin, eq:eqClockMin, why:whyClockMin };
