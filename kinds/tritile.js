// Question kind 'tritile': level 363 Триъгълник от плочки — A big triangle of small triangular tiles, some in place: how many more.

// Кенгуру 2024, задача 6: a big triangle of 16 small ones (four rows of 1, 3, 5 and 7), 10 coloured; how many more tiles to finish it?
// The whole is the number of rows times itself (1 + 3 + 5 + 7 = 16), and 16 − 10 = 6.
import { KIND, answerLine, popAt, rnd, shuffle, svgFrame, svgText, tr } from '../js/core.js';
export function genTriTile(){
  for(;;){
    const n = rnd(5) === 0 ? 4 : 3 + rnd(3), all = n*n, k = n === 4 && !rnd(2) ? 10 : all - (2 + rnd(7));
    if(k < all/2 || k >= all || k === all - k) continue;
    const on = shuffle(Array.from({length: all}, (_, i) => i)).slice(0, k).sort((a, b) => a - b);
    return {kind:'tritile', n, on, k, traps:[k, all], ans: all - k};
  }
}
// tile i of row r: row r holds 2r + 1 tiles, up (even index) and down (odd) in turn
function tilePts(r, j, s, h){
  const left = -r*s/2, k = j >> 1;
  return j % 2 === 0 ? [left + k*s, r*h, left + k*s - s/2, (r + 1)*h, left + k*s + s/2, (r + 1)*h]
    : [left + k*s, r*h, left + (k + 1)*s, r*h, left + k*s + s/2, (r + 1)*h];
}
function pic(q, mark){
  const s = 44, h = s*Math.sqrt(3)/2, n = q.n;
  let g = '', i = 0, m = 0, lab = '';
  for(let r = 0; r < n; r++){
    for(let j = 0; j < 2*r + 1; j++, i++){
      const p = tilePts(r, j, s, h), on = q.on.includes(i), cx = (p[0] + p[2] + p[4])/3, cy = (p[1] + p[3] + p[5])/3;
      g += '<polygon' + (mark && !on ? popAt(1 + m*0.4) : '') + ' points="' + p[0] + ',' + p[1] + ' ' + p[2] + ',' + p[3] + ' ' + p[4] + ',' + p[5] + '" fill="' + (on ? 'var(--warm)' : 'none') + '" fill-opacity=".8" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>';
      if(mark && !on) lab += svgText(cx, cy + 5, ++m, 14, 'var(--ink)');
    }
    if(mark) lab += svgText(n*s/2 + 14, r*h + h/2 + 5, 2*r + 1, 14, 'var(--muted)');
  }
  const x0 = -n*s/2 - 4, w = n*s + 8 + (mark ? 30 : 0);
  return svgFrame(x0 + ' -4 ' + w + ' ' + (n*h + 8), Math.round(w*1.15), tr('голям триъгълник от малки триъгълни плочки', 'великий трикутник з маленьких трикутних плиток')) + g + lab + '</svg>';
}
function drawTriTile(q){
  return '<div class="ask">' + tr('Борис сглобява големия триъгълник, използвайки еднакви малки триъгълни плочки. Още колко плочки са необходими на Борис, за да завърши сглобяването на големия триъгълник?',
    'Борис складає великий трикутник з однакових маленьких трикутних плиток. Скільки ще плиток потрібно Борисові, щоб скласти великий трикутник до кінця?') + '</div>' + pic(q, false) + answerLine('md');
}
const rows = q => Array.from({length: q.n}, (_, r) => 2*r + 1).join(' + ');
function eqTriTile(q){
  return q.n*q.n + ' − ' + q.k + ' = ' + q.ans;
}
function whyTriTile(q, full){
  if(!full) return tr('Колко малки триъгълника има във всичкия голям триъгълник — ред по ред? Колко от тях вече са поставени?', 'Скільки маленьких трикутників у всьому великому — рядок за рядком? Скільки з них уже поставлено?');
  return pic(q, true) + '<div style="text-align:center">' + tr('Всичките плочки: ' + rows(q) + ' = ' + q.n*q.n + '. Поставени са ' + q.k + ', трябват още ' + q.n*q.n + ' − ' + q.k + ' = ' + q.ans + '.',
    'Усі плитки: ' + rows(q) + ' = ' + q.n*q.n + '. Поставлено ' + q.k + ', треба ще ' + q.n*q.n + ' − ' + q.k + ' = ' + q.ans + '.') + '</div>';
}
KIND.tritile = { draw:drawTriTile, eq:eqTriTile, why:whyTriTile };
