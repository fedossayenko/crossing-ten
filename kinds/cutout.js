// Question kind 'cutout': level 361 Премахнати квадратчета — A big square of small ones with some taken away: how many are gone.

// Кенгуру 2025, задача 6: a square of 25 small squares, a dashed outline, 15 of them left; how many were taken away? 25 − 15 = 10.
// The picture shows the squares that are left and the dashed frame of the whole square; the gaps are what she counts (or she
// counts what is left and takes it from the whole).
import { KIND, answerLine, popAt, rnd, svgFrame, svgText, tr, ukWord } from '../js/core.js';
// the printed square, row by row from the top: 1 = a small square is there
const PRINTED = ['00111', '00011', '01001', '01101', '11111'];
export function genCutout(){
  if(rnd(6) === 0) return mk(5, PRINTED.map(r => r.split('').map(Number)));
  for(;;){
    const n = 4 + rnd(3), rows = [];
    for(let y = 0; y < n; y++){ const r = []; for(let x = 0; x < n; x++) r.push(y === n - 1 || x === n - 1 || rnd(100) < 45 ? 1 : 0); rows.push(r); }
    const gone = n*n - rows.flat().reduce((a, b) => a + b, 0);
    if(gone >= 4 && gone <= Math.floor(n*n*0.45) && gone !== n*n - gone) return mk(n, rows);
  }
}
function mk(n, rows){
  const left = rows.flat().reduce((a, b) => a + b, 0);
  return {kind:'cutout', n, rows, left, traps:[left], ans: n*n - left};
}
function pic(q, mark){
  const u = 34, n = q.n;
  let g = '', k = 0;
  q.rows.forEach((r, y) => r.forEach((on, x) => {
    if(on) g += '<rect x="' + x*u + '" y="' + y*u + '" width="' + u + '" height="' + u + '" fill="var(--accent)" fill-opacity=".22" stroke="var(--ink)" stroke-width="1.6"/>';
    else if(mark){ k++; g += '<rect' + popAt(1 + k*0.4) + ' x="' + (x*u + 2) + '" y="' + (y*u + 2) + '" width="' + (u - 4) + '" height="' + (u - 4) + '" fill="var(--warm)" fill-opacity=".6"/>' + svgText(x*u + u/2, y*u + u/2 + 6, k, 16, 'var(--ink)'); }
  }));
  g += '<rect x="0" y="0" width="' + n*u + '" height="' + n*u + '" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="7 5"/>';
  return svgFrame('-4 -4 ' + (n*u + 8) + ' ' + (n*u + 8), Math.round(n*u*1.15), tr('голям квадрат с премахнати малки квадратчета', 'великий квадрат з прибраними маленькими квадратиками')) + g + '</svg>';
}
function drawCutout(q){
  const m = q.n*q.n;
  return '<div class="ask">' + tr('С <span class="num">' + m + '</span> еднакви малки квадратчета е съставен по-голям квадрат и някои от малките квадратчета са премахнати. Колко малки квадратчета са <b>премахнати</b>?',
    'З <span class="num">' + m + '</span> однакових маленьких ' + ukWord(m, 'квадратика', 'квадратиків', 'квадратиків') + ' складено більший квадрат, і деякі з маленьких квадратиків прибрано. Скільки маленьких квадратиків <b>прибрано</b>?') + '</div>' +
    pic(q, false) + answerLine('md');
}
function eqCutout(q){
  return q.n*q.n + ' − ' + q.left + ' = ' + q.ans;
}
function whyCutout(q, full){
  if(!full) return tr('Пунктираният квадрат показва мястото на всичките квадратчета. Брой празните места — или извади онези, които са останали, от всичките.', 'Пунктирний квадрат показує місце всіх квадратиків. Порахуй порожні місця — або відніми ті, що лишилися, від усіх.');
  return pic(q, true) + '<div style="text-align:center">' + tr('Празните места са ' + q.ans + '. Или: всичките са ' + q.n*q.n + ', останали са ' + q.left + ', значи ' + q.n*q.n + ' − ' + q.left + ' = ' + q.ans + '.',
    'Порожніх місць ' + q.ans + '. Або: усіх ' + q.n*q.n + ', лишилося ' + q.left + ', отже ' + q.n*q.n + ' − ' + q.left + ' = ' + q.ans + '.') + '</div>';
}
KIND.cutout = { draw:drawCutout, eq:eqCutout, why:whyCutout };
