// Question kind 'heights': level 312 Кой е най-висок? — Four things told apart by «по-висока» and «по-ниска»: which colour is the tallest (or the lowest).

// Кенгуру 2021, задача 6: four towers. Pink is higher than red but lower than green; silver is higher than green. Red < pink < green
// < silver, so silver is the tallest. The answer is a colour, so the kind brings its own А–Д: the four colours and «cannot be told».
// Shape 'low' asks the other end: green is higher than pink and lower than silver, and red is lower than pink — red is the lowest.
import { KIND, shuffle, tr } from '../js/core.js';
// [Bulgarian masculine, Bulgarian feminine + the, Ukrainian masculine, Ukrainian feminine, Ukrainian feminine accusative, colour]
/** @type {[string, string, string, string, string, string][]} */
const HT_COL = [['червен', 'червената', 'червоний', 'червона', 'червону', '#d9483b'], ['розов', 'розовата', 'рожевий', 'рожева', 'рожеву', '#f08cb4'], ['зелен', 'зелената', 'зелений', 'зелена', 'зелену', '#4aa84a'],
  ['син', 'синята', 'синій', 'синя', 'синю', '#3b6fd9'], ['жълт', 'жълтата', 'жовтий', 'жовта', 'жовту', '#eec12e'], ['сребърен', 'сребърната', 'сріблястий', 'срібляста', 'сріблясту', '#b9bfc7']];
export function genHeights(){
  const c = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4), story = Math.random() < 0.7 ? 0 : 1, low = Math.random() < 0.4;
  const at = low ? 0 : 3, ids = shuffle([0, 1, 2, 3]), pick = ids.indexOf(at);
  const options = ids.map((t, id) => ({ id, v: id, text: htText(c[t]) })).concat([{ id: 4, v: 4, text: ['не е възможно да се определи', 'неможливо визначити'] }]);
  return {kind:'heights', shape: low ? 'low' : 'high', story, c, options, pick, own: true, ans: pick};
}
const swatch = col => '<span style="display:inline-block; width:.8em; height:.8em; border-radius:50%; background:' + HT_COL[col][5] + '; border:1px solid var(--line); margin-right:.4em"></span>';
/** @returns {[string, string]} */
const htText = col => [swatch(col) + HT_COL[col][0], swatch(col) + HT_COL[col][2]];
const THING = [['кула', 'вежа', 'най-високата кула', 'най-ниската кула', 'найвища вежа', 'найнижча вежа'], ['свещ', 'свічка', 'най-високата свещ', 'най-ниската свещ', 'найвища свічка', 'найнижча свічка']];
function drawHeights(q){
  const [c0, c1, c2, c3] = q.c.map(i => HT_COL[i]), T = THING[q.story];
  const word = (col, first) => first ? col[1][0].toUpperCase() + col[1].slice(1) : col[1];
  const bg = q.shape === 'high'
    ? word(c1, true) + ' ' + T[0] + ' е по-висока от ' + c0[1] + ', но е по-ниска от ' + c2[1] + '. ' + word(c3, true) + ' ' + T[0] + ' е по-висока от ' + c2[1] + '.'
    : word(c2, true) + ' ' + T[0] + ' е по-висока от ' + c1[1] + ', но е по-ниска от ' + c3[1] + '. ' + word(c0, true) + ' ' + T[0] + ' е по-ниска от ' + c1[1] + '.';
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const uk = q.shape === 'high'
    ? cap(c1[3]) + ' ' + T[1] + ' вища за ' + c0[4] + ', але нижча за ' + c2[4] + '. ' + cap(c3[3]) + ' ' + T[1] + ' вища за ' + c2[4] + '.'
    : cap(c2[3]) + ' ' + T[1] + ' вища за ' + c1[4] + ', але нижча за ' + c3[4] + '. ' + cap(c0[3]) + ' ' + T[1] + ' нижча за ' + c1[4] + '.';
  const intro = q.story === 0 ? tr('Четири кули са различно оцветени.', 'Чотири вежі різного кольору.') : tr('Четири свещи са с различни цветове.', 'Чотири свічки різного кольору.');
  const qBg = q.shape === 'high' ? 'Какъв цвят е ' + T[2] + '?' : 'Какъв цвят е ' + T[3] + '?', qUk = 'Якого кольору ' + (q.shape === 'high' ? T[4] : T[5]) + '?';
  return '<div class="ask">' + intro + ' ' + tr(bg, uk) + ' <b>' + tr(qBg, qUk) + '</b></div>';
}
const fem = i => tr(HT_COL[i][1], HT_COL[i][3]);
function eqHeights(q){
  return q.c.map(fem).join(' < ') + ' → ' + fem(q.c[q.shape === 'high' ? 3 : 0]);
}
function whyHeights(q, full){
  if(!full) return tr('Подреди ги от най-ниската до най-високата: първо тези от първото изречение, после тази от второто.', 'Розстав від найнижчої до найвищої: спершу ті, що в першому реченні, потім та, що в другому.');
  return q.c.map(i => swatch(i) + fem(i)).join(' &lt; ') + ' &nbsp;→&nbsp; ' + tr(q.shape === 'high' ? 'най-висока е ' : 'най-ниска е ', q.shape === 'high' ? 'найвища — ' : 'найнижча — ') + '<b>' + fem(q.c[q.shape === 'high' ? 3 : 0]) + '</b>';
}
KIND.heights = { draw:drawHeights, eq:eqHeights, why:whyHeights };
