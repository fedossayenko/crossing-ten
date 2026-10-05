// Question kind 'datespan': level 151 От дата до дата — Days from one date to another, both counted, and so many each day.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2022, задача 5: on 23 March Дончо watched episodes 1 and 2, and every day up to 5 May inclusive two new
// ones. March 23–31 is 9 days, April 30, May 1–5 is 5: 44 days, 88 episodes. The first day is one of the
// 44, not an extra; «включително» counts the last. The months run March to November, one after another:
// February has a leap year, and a span across the New Year would need a year to count in.
// [Bulgarian name, Ukrainian genitive, days, Ukrainian name]
/** @type {[string, string, number, string][]} */
import { KIND, SLOT, rnd, tr, ukN } from '../js/core.js';
/** @type {any[]} */
export const SPAN_MONTHS = [['март', 'березня', 31, 'березень'], ['април', 'квітня', 30, 'квітень'], ['май', 'травня', 31, 'травень'],
                     ['юни', 'червня', 30, 'червень'], ['юли', 'липня', 31, 'липень'], ['август', 'серпня', 31, 'серпень'], ['септември', 'вересня', 30, 'вересень'],
                     ['октомври', 'жовтня', 31, 'жовтень'], ['ноември', 'листопада', 30, 'листопад']];
export function genDateSpan(){
  for(;;){
    const i = rnd(SPAN_MONTHS.length - 1), two = Math.random() < 0.6 && i < SPAN_MONTHS.length - 2, j = i + (two ? 2 : 1);
    const [m1, , L1] = SPAN_MONTHS[i], d1 = 10 + rnd(L1 - 10), d2 = 1 + rnd(12), k = 1 + rnd(3);
    let days = L1 - d1 + 1 + d2;
    for(let x = i + 1; x < j; x++) days += SPAN_MONTHS[x][2];
    if(days > 50) continue;
    const asksDays = Math.random() < 0.3;
    return {kind:'datespan', i, j, d1, d2, k, days, asksDays, traps: asksDays ? [days - 1] : [(days - 1)*k, days*k + k].filter(v => v !== days*k), ans: asksDays ? days : days*k};
  }
}
const SPAN_K = [['', ''], ['първа серия', 'першу серію'], ['първа и втора серия', 'першу й другу серії'], ['първите три серии', 'перші три серії']];
function drawDateSpan(q){
  if(q.kind === 'datespan'){
    const [m1, u1] = SPAN_MONTHS[q.i], [m2, u2] = SPAN_MONTHS[q.j], per = [['', ''], ['по една нова серия', 'по одній новій серії'], ['по две нови серии', 'по дві нові серії'], ['по три нови серии', 'по три нові серії']][q.k];
    return '<div class="ask">' + tr('На <span class="num">' + q.d1 + '</span> ' + m1 + ' Дончо гледал ' + SPAN_K[q.k][0] + ' на любимия си филм. Всеки ден до <span class="num">' + q.d2 + '</span> ' + m2 +
      ' <b>включително</b> продължил да гледа ' + per[0] + '. ' + (q.asksDays ? 'Колко дни е гледал Дончо филма?' : 'Колко серии е гледал Дончо?'),
      '<span class="num">' + q.d1 + '</span> ' + u1 + ' Дончо подивився ' + SPAN_K[q.k][1] + ' улюбленого фільму. Щодня до <span class="num">' + q.d2 + '</span> ' + u2 +
      ' <b>включно</b> він дивився ' + per[1] + '. ' + (q.asksDays ? 'Скільки днів Дончо дивився фільм?' : 'Скільки серій подивився Дончо?')) + '</div>' +
      // the months she has to count through in full: their lengths are given, as a calendar would show them
      '<div class="note">' + SPAN_MONTHS.slice(q.i, q.j).map(M => tr(M[0] + ' има ' + M[2] + ' дни', M[3] + ' — ' + ukN(M[2], 'день', 'дні', 'днів'))).join('; ') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function spanParts(q){
  const parts = [SPAN_MONTHS[q.i][2] - q.d1 + 1];
  for(let x = q.i + 1; x < q.j; x++) parts.push(SPAN_MONTHS[x][2]);
  return parts.concat(q.d2);
}
function eqDateSpan(q){
  if(q.kind === 'datespan') return spanParts(q).join(' + ') + ' = ' + q.days + (q.asksDays ? '' : ', ' + q.days + ' · ' + q.k + ' = ' + q.ans);
}
function whyDateSpan(q, full){
  if(q.kind === 'datespan'){
    if(!full) return tr('Брой дните по месеци: колко остават от първия, колко са целите месеци, колко от последния. И първият, и последният ден се броят.',
                        'Рахуй дні за місяцями: скільки лишається від першого, скільки в цілих місяцях, скільки в останньому. І перший, і останній день рахуються.');
    const p = spanParts(q), L = SPAN_MONTHS[q.i][2];
    return L + ' − ' + q.d1 + ' + 1 = ' + p[0] + ', ' + (p.length > 2 ? p.slice(1, -1).join(', ') + ', ' : '') + q.d2 + ' &nbsp;→&nbsp; ' + p.join(' + ') + ' = <b>' + q.days + '</b>' +
      (q.asksDays ? '' : ' &nbsp;→&nbsp; ' + (q.k === 1 ? q.ans : Array(Math.min(q.k, 3)).fill(q.days).join(' + ') + ' = ' + q.ans));
  }
}
KIND.datespan = { draw:drawDateSpan, eq:eqDateSpan, why:whyDateSpan };
