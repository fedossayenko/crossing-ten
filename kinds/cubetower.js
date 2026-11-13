// Question kind 'cubetower': level 380 Кули от кубчета — Towers of cubes whose colours alternate, seen from above.

// Кенгуру 2026, 2 клас, задача 17: 6 towers of 5 cubes, coloured or white, touching cubes always differ in colour; the 6 towers
// are shown from above (the top cube's colour). How many white cubes in all? A tower of 5 with a white top has white, coloured,
// white, coloured, white: 3 white; with a coloured top 2 white. 4 · 3 + 2 · 2 = 16. Here the two colours are yellow (0) and
// red (1): the theme has no white that stays white in the dark.
import { KIND, answerLine, rnd, tr, ukN } from '../js/core.js';
import { CUBE_COL, isoCubes, isoSvg } from './isocubes.js';

/** how many cubes of colour c a tower of height h has when its top cube is colour t: the colours alternate downwards */
const inTower = (h, t, c) => { let n = 0; for(let i = 0; i < h; i++) if((t + i) % 2 === c) n++; return n; };
export function genCubeTower(){
  const n = [4, 6, 8][rnd(3)], h = [3, 5, 7][rnd(3)], ask = rnd(2);
  for(;;){
    const tops = Array.from({ length: n }, () => rnd(2));
    if(new Set(tops).size < 2) continue;
    return {kind:'cubetower', n, h, ask, tops, ans: tops.reduce((s, t) => s + inTower(h, t, ask), 0)};
  }
}
const colName = (c, k) => k === 0 ? (c ? 'червените' : 'жълтите') : (c ? 'червоних' : 'жовтих');
const cubeOf = c => [{ x: 0, y: 0, z: 0, c }];
function drawCubeTower(q){
  const cols = q.n/2, s = 26, leg = isoCubes(cubeOf(0), s, 0, 0), leg2 = isoCubes(cubeOf(1), s, 0, 0), t = 34, x0 = 84;
  const W = x0 + cols*(t + 4), H = Math.max(2*(t + 4) + 8, 2*leg.h + 12);
  const tiles = q.tops.map((c, i) => '<rect x="' + (x0 + (i % cols)*(t + 4)) + '" y="' + (4 + Math.floor(i/cols)*(t + 4)) + '" width="' + t + '" height="' + t + '" fill="' + CUBE_COL[c] + '" stroke="var(--ink)" stroke-width="1.6"/>').join('');
  const svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="display:block; width:' + Math.min(W*1.4, 330) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('кулите, гледани отгоре: цветът на най-горното кубче на всяка', 'вежі, якщо дивитися зверху: колір верхнього кубика кожної') + '">' +
    '<g transform="translate(6,2)">' + leg.g + '</g><g transform="translate(6,' + (leg.h + 8) + ')">' + leg2.g + '</g>' + tiles + '</svg>';
  return '<div class="ask">' + tr('Построени са ' + q.n + ' кули' + ' с по ' + q.h + ' кубчета' + ' едно върху друго. Кубчетата са жълти или червени като тези вляво. Допиращите се кубчета във всяка кула са с различен цвят. Показани са кулите, гледани отгоре. Колко общо са <b>' + colName(q.ask, 0) + '</b> кубчета в тях?',
    'Побудовано ' + ukN(q.n, 'вежу', 'вежі', 'веж') + ' по ' + ukN(q.h, 'кубику', 'кубики', 'кубиків') + ' один на одному. Кубики жовті або червоні, як ці ліворуч. Кубики, що торкаються, в кожній вежі різного кольору. Вежі показано зверху. Скільки всього <b>' + colName(q.ask, 1) + '</b> кубиків у них?') + '</div>' + svg + answerLine('xl');
}
const counts = q => q.tops.map(t => inTower(q.h, t, q.ask));
function eqCubeTower(q){
  return counts(q).join(' + ') + ' = ' + q.ans;
}
const bgCubes = n => n + (n === 1 ? ' кубче' : ' кубчета');
function whyCubeTower(q, full){
  if(!full) return tr('Цветовете в една кула се редуват отгоре надолу. Колко са кубчетата от този цвят, ако горното е от него — и ако не е?', 'Кольори в одній вежі чергуються зверху вниз. Скільки кубиків цього кольору, якщо верхній такого кольору — і якщо ні?');
  const stack = t => isoSvg(Array.from({ length: q.h }, (_, i) => ({ x: 0, y: 0, z: q.h - 1 - i, c: (t + i) % 2 })), 17, tr('кула с ' + (t ? 'червен' : 'жълт') + ' връх', 'вежа з ' + (t ? 'червоним' : 'жовтим') + ' верхом'), 40);
  const a = inTower(q.h, q.ask, q.ask), b = inTower(q.h, 1 - q.ask, q.ask);
  return '<div style="display:flex; gap:24px; justify-content:center; align-items:flex-end">' + stack(q.ask) + stack(1 - q.ask) + '</div>' +
    tr('горното кубче е ' + (q.ask ? 'червено' : 'жълто') + ': в кулата има ' + bgCubes(a) + ' от търсения цвят; горното е ' + (q.ask ? 'жълто' : 'червено') + ': ' + bgCubes(b),
      'верхній кубик ' + (q.ask ? 'червоний' : 'жовтий') + ': у вежі ' + ukN(a, 'кубик', 'кубики', 'кубиків') + ' потрібного кольору; верхній ' + (q.ask ? 'жовтий' : 'червоний') + ': ' + ukN(b, 'кубик', 'кубики', 'кубиків')) + ' &nbsp;→&nbsp; ' + counts(q).join(' + ') + ' = <b>' + q.ans + '</b>';
}
KIND.cubetower = { draw:drawCubeTower, eq:eqCubeTower, why:whyCubeTower };
