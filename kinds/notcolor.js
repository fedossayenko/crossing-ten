// Question kind 'notcolor': level 218 Кои не са бели? — Balloons of three colours, told by how many are NOT each colour.

// МБГ Полуфинал 2024, 1 клас, задача 19: white, red and green balloons; 7 are not white, 3 are not red and 6 are not
// green — how many are red? «7 are not white» is the red and the green together. The three numbers count every
// colour twice: 7 + 3 + 6 = 16 = 8 + 8, so there are 8 balloons, and the red ones are 8 − 3 = 5.
import { KIND, SLOT, popAt, rnd, tr, ukN } from '../js/core.js';
// [Bulgarian, Ukrainian, Ukrainian genitive plural, the colour drawn]
/** @type {[string, string, string, string][]} */
const NC_COLS = [['бели', 'білі', 'білих', '#fff'], ['червени', 'червоні', 'червоних', 'var(--bad)'], ['зелени', 'зелені', 'зелених', 'var(--good)']];
export function genNotColor(){
  for(;;){
    const c = [1 + rnd(8), 1 + rnd(8), 1 + rnd(8)], all = c[0] + c[1] + c[2];
    if(all > 10) continue;                                // the three numbers together stay within 20
    const ask = rnd(3), not = c.map(v => all - v);
    return {kind:'notcolor', c, not, ask, traps:[not[ask], all].filter(v => v !== c[ask]), ans: c[ask]};
  }
}
function drawNotColor(q){
  const n = q.not;
  return '<div class="ask">' + tr('Има балони в три цвята: бели, червени и зелени. <span class="num">' + n[0] + '</span> балона не са бели, <span class="num">' + n[1] + '</span> балона не са червени, а <span class="num">' + n[2] +
      '</span> балона не са зелени. Колко са <b>' + NC_COLS[q.ask][0] + 'те</b> балони?',
    'Є кульки трьох кольорів: білі, червоні й зелені. <span class="num">' + ukN(n[0], 'кулька', 'кульки', 'кульок').replace(' ', '</span> ') + ' не білі, <span class="num">' + ukN(n[1], 'кулька', 'кульки', 'кульок').replace(' ', '</span> ') +
      ' не червоні, а <span class="num">' + ukN(n[2], 'кулька', 'кульки', 'кульок').replace(' ', '</span> ') + ' не зелені. Скільки <b>' + NC_COLS[q.ask][2] + '</b> кульок?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
const ncSum = q => q.not.join(' + ') + ' = ' + 2*(q.ans + q.not[q.ask]) + ' = ' + (q.ans + q.not[q.ask]) + ' + ' + (q.ans + q.not[q.ask]);
function eqNotColor(q){
  const all = q.ans + q.not[q.ask];
  return ncSum(q) + ' → ' + all + ' − ' + q.not[q.ask] + ' = ' + q.ans;
}
// the balloons, each colour in its own colour
function notColorSvg(q){
  let g = '', i = 0;
  q.c.forEach((k, col) => { for(let j = 0; j < k; j++, i++){ const x = 14 + i*24;
    g += '<g' + popAt(1 + i*0.4) + '><path d="M' + x + ',22 q-3,8 2,16" stroke="var(--muted)" stroke-width="1.2" fill="none"/>' +
      '<ellipse cx="' + x + '" cy="11" rx="9" ry="11" fill="' + NC_COLS[col][3] + '" stroke="var(--muted)" stroke-width="1.2"/></g>'; } });
  return '<svg viewBox="0 -2 ' + (4 + i*24) + ' 42" style="display:block; width:' + (4 + i*24) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('балоните', 'кульки') + '">' + g + '</svg>';
}
function whyNotColor(q, full){
  if(!full) return tr('„Не са бели" значи: червените и зелените заедно. Събери трите числа — всеки цвят е броен два пъти.',
    '«Не білі» означає: червоні й зелені разом. Додай три числа — кожен колір пораховано двічі.');
  const all = q.ans + q.not[q.ask], others = [0, 1, 2].filter(k => k !== q.ask);
  return tr('„' + q.not[q.ask] + ' не са ' + NC_COLS[q.ask][0] + '" значи ' + NC_COLS[others[0]][0] + ' + ' + NC_COLS[others[1]][0] + ' = ' + q.not[q.ask],
      '«' + q.not[q.ask] + ' не ' + NC_COLS[q.ask][1] + '» означає ' + NC_COLS[others[0]][1] + ' + ' + NC_COLS[others[1]][1] + ' = ' + q.not[q.ask]) + '; &nbsp;' +
    tr('всеки цвят е броен два пъти: ', 'кожен колір пораховано двічі: ') + ncSum(q) + ' &nbsp;→&nbsp; ' + tr('всички балони са <b>', 'усього кульок <b>') + all + '</b> &nbsp;→&nbsp; ' +
    all + ' − ' + q.not[q.ask] + ' = ' + q.ans + notColorSvg(q);
}
KIND.notcolor = { draw:drawNotColor, eq:eqNotColor, why:whyNotColor };
