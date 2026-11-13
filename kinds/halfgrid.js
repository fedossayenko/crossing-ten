// Question kind 'halfgrid': level 360 Още до половината — Squares of a grid coloured, how many more so that half of them are.

// Кенгуру 2023, задача 10: 24 squares (6 by 4), 9 of them coloured; how many more must be coloured so that as many are coloured
// as are not? Half of 24 is 12, and 12 − 9 = 3. The slips: the white ones, and the coloured ones taken for the half.
import { KIND, answerLine, popAt, rnd, shuffle, svgFrame, tr, ukPl } from '../js/core.js';
export function genHalfGrid(){
  for(;;){
    const W = 4 + rnd(4), H = 3 + rnd(3), n = W*H;
    if(n % 2) continue;
    const k = 3 + rnd(n/2 - 3), ans = n/2 - k;
    if(ans < 1 || ans > 6 || ans === k || ans === n - k) continue;
    const cells = shuffle(Array.from({length: n}, (_, i) => i)).slice(0, k).sort((a, b) => a - b);
    return {kind:'halfgrid', W, H, k, cells, traps:[n - k, k], ans};
  }
}
// the first q.ans white squares (in reading order) are the ones to colour in the solution
const toColour = q => { const out = []; for(let i = 0; i < q.W*q.H && out.length < q.ans; i++) if(!q.cells.includes(i)) out.push(i); return out; };
function gridPic(q, extra){
  const u = 34, W = q.W, H = q.H;
  const rects = Array.from({length: W*H}, (_, i) => {
    const on = q.cells.includes(i), add = extra.includes(i);
    return '<rect x="' + (i % W)*u + '" y="' + Math.floor(i / W)*u + '" width="' + u + '" height="' + u + '" fill="' + (on ? 'var(--accent)' : add ? 'var(--warm)' : 'none') + '" fill-opacity="' + (on ? '.55' : '.7') + '" stroke="var(--ink)" stroke-width="1.6"' + (add ? popAt(1 + extra.indexOf(i)*0.5) : '') + '/>';
  }).join('');
  return svgFrame('-3 -3 ' + (W*u + 6) + ' ' + (H*u + 6), Math.round(W*u*1.15), tr('квадратчета, някои от тях оцветени', 'квадратики, деякі з них зафарбовані')) + rects + '</svg>';
}
function drawHalfGrid(q){
  const n = q.W*q.H;
  return '<div class="ask">' + tr('На картинката са показани <span class="num">' + n + '</span> квадратчета, някои от които са оцветени. Още колко квадратчета трябва да се оцветят така, че броят на оцветените и неоцветените да е един и същ?',
    'На малюнку показано ' + ukPl(n, 'квадратик', 'квадратики', 'квадратиків') + ', деякі з яких зафарбовано. Скільки ще квадратиків треба зафарбувати, щоб зафарбованих і незафарбованих було порівну?') + '</div>' +
    gridPic(q, []) + answerLine('md');
}
const half = q => q.W*q.H/2;
function eqHalfGrid(q){
  return half(q) + ' − ' + q.k + ' = ' + q.ans;
}
function whyHalfGrid(q, full){
  if(!full) return tr('Колко са всичките квадратчета? Оцветените трябва да са половината от тях. Колко още трябват, за да станат толкова?', 'Скільки всього квадратиків? Зафарбованих має бути половина. Скільки ще треба, щоб їх стало стільки?');
  return gridPic(q, toColour(q)) + '<div style="text-align:center">' + tr('Всичките са ' + q.W*q.H + ', половината е ' + half(q) + '; оцветени са ' + q.k + ', трябват още ' + half(q) + ' − ' + q.k + ' = ' + q.ans + '.',
    'Усього ' + q.W*q.H + ', половина — ' + half(q) + '; зафарбовано ' + q.k + ', треба ще ' + half(q) + ' − ' + q.k + ' = ' + q.ans + '.') + '</div>';
}
KIND.halfgrid = { draw:drawHalfGrid, eq:eqHalfGrid, why:whyHalfGrid };
