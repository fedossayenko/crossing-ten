// Question kind 'rests': level 145 Почивките — Work in groups with a rest between them: one rest fewer than groups.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2023, задача 7: 3 groups of 5 exercises, 4 minutes each, a 3-minute rest between groups. The work
// is 3 · 5 · 4 = 60 minutes, and between 3 groups there are only 2 rests: 60 + 6 = 66. Like the trees in
// a row (level 31), the gaps are one fewer than the things.
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
export function genRests(){
  for(;;){
    const g = 2 + rnd(3), n = 2 + rnd(4), t = 2 + rnd(4), r = 2 + rnd(5), work = g*n*t, ans = work + (g - 1)*r;
    if(ans > 99) continue;
    return {kind:'rests', g, n, t, r, work, traps:[work + g*r, work], ans};
  }
}
const restsMin = n => tr(n + ' минути', ukN(n, 'хвилину', 'хвилини', 'хвилин'));
function drawRests(q){
  if(q.kind === 'rests'){
    return '<div class="ask">' + tr('Във фитнеса Ани прави <span class="num">' + q.g + '</span> групи упражнения. Във всяка група има по <span class="num">' + q.n + '</span> упражнения. Всяко упражнение трае <span class="num">' + q.t +
      '</span> минути. Между всяка група упражнения Ани почива <span class="num">' + q.r + '</span> минути. Колко минути след като е започнала Ани ще завърши последното упражнение?',
      'У спортзалі Аня робить <span class="num">' + q.g + '</span> групи вправ. У кожній групі по <span class="num">' + ukN(q.n, 'вправа', 'вправи', 'вправ').replace(' ', '</span> ') + '. Кожна вправа триває <span class="num">' +
      restsMin(q.t).replace(' ', '</span> ') + '. Між групами вправ Аня відпочиває <span class="num">' + restsMin(q.r).replace(' ', '</span> ') + '. Через скільки хвилин після початку Аня закінчить останню вправу?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">' + tr('мин', 'хв') + '</span></div>';
  }
}
function eqRests(q){
  if(q.kind === 'rests') return q.g + ' · ' + q.n + ' · ' + q.t + ' + ' + (q.g - 1) + ' · ' + q.r + ' = ' + q.ans;
}
function whyRests(q, full){
  if(q.kind === 'rests'){
    if(!full) return tr('Колко минути трае една група? А колко почивки има между ' + q.g + ' групи?', 'Скільки хвилин триває одна група? А скільки перерв між ' + q.g + ' групами?');
    return tr('една група: ', 'одна група: ') + q.n + ' · ' + q.t + ' = <b>' + q.n*q.t + '</b>, ' + tr('всички: ', 'усі: ') + q.g + ' · ' + q.n*q.t + ' = <b>' + q.work + '</b> &nbsp;→&nbsp; ' +
      tr('почивките са ', 'перерв ') + q.g + ' − 1 = <b>' + (q.g - 1) + '</b>: ' + (q.g - 1) + ' · ' + q.r + ' = ' + (q.g - 1)*q.r + ' &nbsp;→&nbsp; ' + q.work + ' + ' + (q.g - 1)*q.r + ' = ' + q.ans;
  }
}
KIND.rests = { draw:drawRests, eq:eqRests, why:whyRests };
