// Question kind 'tally': level 398 Обувки и пръстени — Count what the picture shows, then one step more: the guests from their shoes, the points from the rings.

// Кенгуру 2026, задача 4: the friends took off their shoes, 14 of them lie about, two to a friend: 14 is 7 friends (two and two and two …).
// Кенгуру 2026, задача 5: five players throw a ring each at a peg, 3 points for every ring that is on it; three are on the peg, two on the
// floor: 3 + 3 + 3 = 9. Both are a count of what is in the picture and then a small sum, with the times table not needed: twos, or threes
// added. The slips are the shoes counted as they are, and all the rings counted, those on the floor too.
import { KIND, addUp, answerLine, rnd, shuffle, svgFrame, tr, trN, ukN, SVG_FONT } from '../js/core.js';
const SHOES = ['👞', '👟', '👠', '👢', '🥾', '🥿'];
const BG_COUNT = { 3: 'Трима', 4: 'Четирима', 5: 'Петима', 6: 'Шестима', 7: 'Седмина' }, UK_COUNT = { 3: 'Троє', 4: 'Четверо', 5: 'П’ятеро', 6: 'Шестеро', 7: 'Семеро' };
const MAT = [[80, 138], [104, 152], [200, 136], [214, 150]];   // where a ring that missed lies
export function genTally(){
  if(rnd(6) === 0) return rings(3, 2, 3);
  if(rnd(2)) return shoes(4 + rnd(6));
  const on = 2 + rnd(3), off = 1 + rnd(3);
  return rings(on, off, 2 + rnd(3));
}
function shoes(n){
  const kinds = [].concat(...Array.from({ length: n }, () => { const k = rnd(SHOES.length); return [k, k]; })), cells = shuffle(Array.from({ length: 32 }, (v, i) => i)).slice(0, 2*n);
  const items = shuffle(kinds).map((k, i) => ({ k, x: 19 + (cells[i] % 8)*37 + rnd(7) - 3, y: 22 + Math.floor(cells[i] / 8)*38 + rnd(7) - 3, rot: rnd(70) - 35, flip: rnd(2) }));
  return {kind:'tally', shape:'shoes', n, items, ans: n, traps:[2*n, 2*n + 1]};
}
function rings(on, off, per){
  const place = shuffle(MAT.slice()).slice(0, off);
  return {kind:'tally', shape:'rings', on, off, per, place, ans: on*per, traps:[(on + off)*per, on]};
}
const shoePic = (/** @type {any} */ q) => svgFrame('0 0 300 162', 340, tr('разхвърляни обувки', 'розкидане взуття')) + q.items.map((/** @type {any} */ s) =>
  '<text x="0" y="0" font-size="34" text-anchor="middle" dominant-baseline="central" ' + SVG_FONT + ' transform="translate(' + s.x + ' ' + s.y + ') rotate(' + s.rot + ') scale(' + (s.flip ? -1 : 1) + ' 1)">' + SHOES[s.k] + '</text>').join('') + '</svg>';
const ring = (/** @type {number} */ x, /** @type {number} */ y) => '<ellipse cx="' + x + '" cy="' + y + '" rx="32" ry="9" fill="none" stroke="var(--grape)" stroke-width="5"/>';
function ringPic(q){
  let g = '<polygon points="62,110 272,110 244,162 30,162" fill="color-mix(in srgb, var(--warm) 40%, transparent)" stroke="var(--warm)" stroke-width="2" stroke-linejoin="round"/>';
  q.place.forEach((/** @type {number[]} */ p) => { g += ring(p[0], p[1]); });
  for(let i = 0; i < q.on; i++) g += ring(153, 128 - 9*i);
  g += '<rect x="148" y="14" width="10" height="120" rx="3" fill="var(--ant)"/>';
  for(let i = 0; i < q.on; i++){ const y = 128 - 9*i; g += '<path d="M121,' + y + ' A32,9 0 0 0 185,' + y + '" fill="none" stroke="var(--grape)" stroke-width="5"/>'; }
  return svgFrame('0 0 300 166', 400, tr('колче с пръстени на него и пръстени на пода', 'кілок із кільцями на ньому та кільця на підлозі')) + g + '</svg>';
}
function drawTally(q){
  if(q.shape === 'shoes') return '<div class="ask">' + tr('Приятелите на Ани са ѝ дошли на гости и са си събули обувките, които са показани. Колко приятели на Ани са ѝ дошли на гости?',
    'Друзі Ані прийшли до неї в гості й роззулися, взуття показано. Скільки друзів Ані прийшло в гості?') + '</div>' + shoePic(q) + answerLine('md');
  const all = q.on + q.off;
  return '<div class="ask">' + tr(BG_COUNT[all] + ' играчи хвърлят по един пръстен и се стремят да го нанижат на колчето. Резултатът е показан. За всяко успешно нанизване се присъждат ' + trN(q.per, 'точка', 'точки', 'очко', 'очки', 'очок') + '. Колко са общо спечелените точки?',
    UK_COUNT[all] + ' гравців кидають по одному кільцю й намагаються нанизати його на кілок. Результат показано. За кожне успішне нанизування присуджують ' + ukN(q.per, 'очко', 'очки', 'очок') + '. Скільки всього виграно очок?') + '</div>' + ringPic(q) + answerLine('md');
}
function eqTally(q){
  return q.shape === 'shoes' ? 2*q.n + ' → ' + q.n : addUp(q.on, q.per);
}
function whyTally(q, full){
  if(q.shape === 'shoes'){
    if(!full) return tr('Всеки приятел е събул по две обувки. Преброй обувките и ги раздели по две.', 'Кожен друг зняв по два черевики. Порахуй взуття й розклади по два.');
    return tr('Обувките са ' + 2*q.n + ': ' + addUp(q.n, 2) + ' — по две на приятел, значи приятелите са ' + q.n + '.', 'Взуття ' + 2*q.n + ': ' + addUp(q.n, 2) + ' — по два на друга, отже друзів ' + q.n + '.');
  }
  if(!full) return tr('Точки се дават само за пръстените, които са на колчето. Тези на пода не се броят.', 'Очки дають лише за кільця, що на кілку. Ті, що на підлозі, не рахуються.');
  return tr('На колчето са пръстените, които са се нанизали. Всеки е с ' + trN(q.per, 'точка', 'точки', 'очко', 'очки', 'очок') + ': ' + addUp(q.on, q.per) + '.', 'На кілку кільця, що нанизалися. Кожне дає ' + ukN(q.per, 'очко', 'очки', 'очок') + ': ' + addUp(q.on, q.per) + '.');
}
KIND.tally = { draw:drawTally, eq:eqTally, why:whyTally };
