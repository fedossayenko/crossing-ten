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
// Салабашев 2022, задача 2: a box of 5 by 5 biscuits, hearts, circles and squares — 8, 10 and 7 of them. The fewest to eat so that as many of each kind
// are left: the rarest kind (7) is all that can be left of each, so 1 heart and 3 circles go: 1 + 3 + 0 = 4 (shape 'box'; the total less three of the
// rarest, with no times table: the gaps over the rarest kind are added). Hearts, circles and squares are drawn by their own shape.
export function genTallyBox(){
  for(;;){
    const c = [4 + rnd(9), 4 + rnd(9)], n = [c[0], c[1], 25 - c[0] - c[1]], low = Math.min(...n), ans = 25 - 3*low;
    if(n[2] < 4 || n[2] > 12 || ans < 2 || n.includes(ans)) continue;
    const kinds = shuffle([].concat(...n.map((k, i) => Array(k).fill(i))));
    return {kind:'tally', shape:'box', n, kinds, ans, traps:[25, Math.max(...n)]};
  }
}
const biscuit = (/** @type {number} */ k, /** @type {number} */ x, /** @type {number} */ y) => k === 0
  ? '<path d="M' + x + ',' + (y + 10) + ' C' + (x - 15) + ',' + (y + 1) + ' ' + (x - 10) + ',' + (y - 11) + ' ' + x + ',' + (y - 4) + ' C' + (x + 10) + ',' + (y - 11) + ' ' + (x + 15) + ',' + (y + 1) + ' ' + x + ',' + (y + 10) + 'Z" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>'
  : k === 1 ? '<circle cx="' + x + '" cy="' + y + '" r="10" fill="none" stroke="var(--ink)" stroke-width="1.8"/><circle cx="' + x + '" cy="' + y + '" r="2" fill="var(--ink)"/>'
  : '<rect x="' + (x - 9) + '" y="' + (y - 9) + '" width="18" height="18" fill="none" stroke="var(--ink)" stroke-width="1.8"/>';
function boxPic(/** @type {any} */ q){
  const u = 32;
  return svgFrame('-5 -5 ' + (5*u + 10) + ' ' + (5*u + 10), 220, tr('кутия с бисквити — сърца, кръгчета и квадратчета', 'коробка з печивом — серця, кружечки й квадратики')) +
    '<rect x="0" y="0" width="' + 5*u + '" height="' + 5*u + '" fill="none" stroke="var(--ink)" stroke-width="2"/>' +
    q.kinds.map((/** @type {number} */ k, /** @type {number} */ i) => biscuit(k, (i % 5)*u + u/2, Math.floor(i / 5)*u + u/2)).join('') + '</svg>';
}
function drawBox(q){
  return '<div class="ask">' + tr('Коко получил кутия с бисквити — кръгли, квадратни или във формата на сърце. Най-малко колко бисквити трябва да изяде Коко, за да останат по равен брой бисквити и от трите вида?',
    'Коко отримав коробку з печивом — круглим, квадратним або у формі серця. Яку найменшу кількість печива має з’їсти Коко, щоб залишилося порівну печива всіх трьох видів?') + '</div>' + '<div class="fig">' + boxPic(q) + '</div>' + answerLine('md');
}
const boxGaps = (/** @type {any} */ q) => q.n.map((/** @type {number} */ v) => v - Math.min(...q.n)).filter((/** @type {number} */ d) => d > 0);
function eqBox(q){ return q.n.join(', ') + ' → ' + boxGaps(q).join(' + ') + ' = ' + q.ans; }
function whyBox(q, full){
  if(!full) return tr('Преброй бисквитите от всеки вид. Най-много от всеки вид могат да останат толкова, колкото са от най-малкия.', 'Порахуй печиво кожного виду. Залишитися може не більше, ніж є печива найменшого виду.');
  return tr('Сърца, кръгчета, квадратчета: ' + q.n.join(', ') + '. Най-малко са ' + Math.min(...q.n) + ', толкова ще останат от всеки вид. Изяждат се излишните: ' + boxGaps(q).join(' + ') + ' = <b>' + q.ans + '</b>.',
    'Серця, кружечки, квадратики: ' + q.n.join(', ') + '. Найменше ' + Math.min(...q.n) + ', стільки й залишиться кожного виду. З’їдається зайве: ' + boxGaps(q).join(' + ') + ' = <b>' + q.ans + '</b>.');
}
function drawTally(q){
  if(q.shape === 'box') return drawBox(q);
  if(q.shape === 'shoes') return '<div class="ask">' + tr('Приятелите на Ани са ѝ дошли на гости и са си събули обувките, които са показани. Колко приятели на Ани са ѝ дошли на гости?',
    'Друзі Ані прийшли до неї в гості й роззулися, взуття показано. Скільки друзів Ані прийшло в гості?') + '</div>' + shoePic(q) + answerLine('md');
  const all = q.on + q.off;
  return '<div class="ask">' + tr(BG_COUNT[all] + ' играчи хвърлят по един пръстен и се стремят да го нанижат на колчето. Резултатът е показан. За всяко успешно нанизване се присъждат ' + trN(q.per, 'точка', 'точки', 'очко', 'очки', 'очок') + '. Колко са общо спечелените точки?',
    UK_COUNT[all] + ' гравців кидають по одному кільцю й намагаються нанизати його на кілок. Результат показано. За кожне успішне нанизування присуджують ' + ukN(q.per, 'очко', 'очки', 'очок') + '. Скільки всього виграно очок?') + '</div>' + ringPic(q) + answerLine('md');
}
function eqTally(q){
  if(q.shape === 'box') return eqBox(q);
  return q.shape === 'shoes' ? 2*q.n + ' → ' + q.n : addUp(q.on, q.per);
}
function whyTally(q, full){
  if(q.shape === 'box') return whyBox(q, full);
  if(q.shape === 'shoes'){
    if(!full) return tr('Всеки приятел е събул по две обувки. Преброй обувките и ги раздели по две.', 'Кожен друг зняв по два черевики. Порахуй взуття й розклади по два.');
    return tr('Обувките са ' + 2*q.n + ': ' + addUp(q.n, 2) + ' — по две на приятел, значи приятелите са ' + q.n + '.', 'Взуття ' + 2*q.n + ': ' + addUp(q.n, 2) + ' — по два на друга, отже друзів ' + q.n + '.');
  }
  if(!full) return tr('Точки се дават само за пръстените, които са на колчето. Тези на пода не се броят.', 'Очки дають лише за кільця, що на кілку. Ті, що на підлозі, не рахуються.');
  return tr('На колчето са пръстените, които са се нанизали. Всеки е с ' + trN(q.per, 'точка', 'точки', 'очко', 'очки', 'очок') + ': ' + addUp(q.on, q.per) + '.', 'На кілку кільця, що нанизалися. Кожне дає ' + ukN(q.per, 'очко', 'очки', 'очок') + ': ' + addUp(q.on, q.per) + '.');
}
KIND.tally = { draw:drawTally, eq:eqTally, why:whyTally };
