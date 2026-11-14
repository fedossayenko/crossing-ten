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
  const q = {kind:'clockmin', ny, h, m, two, traps:(two ? [60 - m, 100 - m + 60] : [m, 100 - m]).filter(v => v > 0 && v !== ans), ans};
  return Math.random() < 0.35 ? genClockSpan() : q;   // drawn after the question above, so that one keeps its seed
}
// Салабашев 2023, 2 клас, задача 9: Мила began to read at 13:15 and stopped at 14:50 — how many minutes did she read? 45 to 14:00, 50 more:
// 45 + 50 = 95. Салабашев 2024, задача 4: Ема played the piano from 07:32 to 08:41, 28 + 41 = 69. The end is in the next hour, at any
// minute but the start's: the minutes to the full hour and the minutes after it. The traps: the minutes subtracted (50 − 15), with the hour
// forgotten. The times are written as the paper writes them, hh:mm.
// [Bulgarian, Ukrainian]: who
const SPAN_WHO = [[['Мила', 'Міла'], ['Ани', 'Аня']], [['Ема', 'Ема'], ['Лили', 'Лілі']]];
function genClockSpan(){
  const form = rnd(2), who = rnd(2), h = form ? 6 + rnd(4) : 12 + rnd(8), m = 3 + rnd(55);
  let m2 = 3 + rnd(55);
  while(m2 === m || 60 - m + m2 > 99) m2 = 3 + rnd(55);   // within a hundred minutes
  const ans = 60 - m + m2;
  return {kind:'clockmin', shape:'span', form, who, h, m, m2, traps:[Math.abs(m2 - m), 100 - m + m2].filter(v => v > 0 && v !== ans), ans};
}
const hhmm = (h, m) => String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
function drawClockMin(q){
  if(q.shape === 'span'){
    const [bg, uk] = SPAN_WHO[q.form][q.who], from = hhmm(q.h, q.m), to = hhmm(q.h + 1, q.m2);
    return '<div class="ask">' + (q.form === 0
      ? tr(bg + ' започнала да чете книга в ' + from + ' ч. и спряла да чете в ' + to + ' ч. Колко минути е чела ' + bg + '?', uk + ' почала читати книжку о ' + from + ' і закінчила читати о ' + to + '. Скільки хвилин читала ' + uk + '?')
      : tr('Тази сутрин ' + bg + ' свири на пиано от ' + from + ' часа до ' + to + ' часа. Колко минути е свирила на пиано ' + bg + ' тази сутрин?', 'Сьогодні вранці ' + uk + ' грала на піаніно з ' + from + ' до ' + to + '. Скільки хвилин ' + uk + ' грала на піаніно сьогодні вранці?')) + '</div>' +
      '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('мин', 'хв') + '</span></div>';
  }
  const t = hm(q.h, q.m), to = hm((q.h + (q.two ? 2 : 1)) % 24, 0);
  return '<div class="ask">' + (q.ny ? tr('В ' + t + ' часа на 31 декември Ани опитала от тортата. Колко минути след това е започнала новата година?',
                                          'О ' + t + ' 31 грудня Аня скуштувала торт. Через скільки хвилин після цього почався новий рік?')
    : tr('Ани започнала да чете в ' + t + ' часа и спряла в ' + to + ' часа. Колко минути е чела?', 'Аня почала читати о ' + t + ' і закінчила о ' + to + '. Скільки хвилин вона читала?')) + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('мин', 'хв') + '</span></div>';
}
function eqClockMin(q){
  if(q.shape === 'span') return '(60 − ' + q.m + ') + ' + q.m2 + ' = ' + q.ans;
  return (q.two ? '60 + ' : '') + '60 − ' + q.m + ' = ' + q.ans;
}
function whyClockMin(q, full){
  if(q.shape === 'span'){
    if(!full) return tr('Първо: колко минути има до следващия кръгъл час? После: колко още минути минали до края?', 'Спершу: скільки хвилин до наступної повної години? Потім: скільки ще хвилин минуло до кінця?');
    return tr('до ' + hhmm(q.h + 1, 0) + ': 60 − ' + q.m + ' = <b>' + (60 - q.m) + '</b>; от ' + hhmm(q.h + 1, 0) + ' до ' + hhmm(q.h + 1, q.m2) + ': <b>' + q.m2 + '</b>', 'до ' + hhmm(q.h + 1, 0) + ': 60 − ' + q.m + ' = <b>' + (60 - q.m) + '</b>; від ' + hhmm(q.h + 1, 0) + ' до ' + hhmm(q.h + 1, q.m2) + ': <b>' + q.m2 + '</b>') +
      ' &nbsp;→&nbsp; ' + (60 - q.m) + ' + ' + q.m2 + ' = <b>' + q.ans + '</b>';
  }
  if(!full) return tr('Един час е 60 минути. Колко от тях вече са минали?', 'Година — це 60 хвилин. Скільки з них уже минуло?');
  const next = q.h + 1;                      // 23:37 counts on to 24 часа, which is midnight
  return tr('до ' + next + ' часа: ', 'до ' + next + ':00 — ') + '60 − ' + q.m + ' = <b>' + (60 - q.m) + '</b>' + (q.two ? tr(', и още един час: ', ', і ще одна година: ') + (60 - q.m) + ' + 60 = ' + q.ans : '');
}
KIND.clockmin = { draw:drawClockMin, eq:eqClockMin, why:whyClockMin };
