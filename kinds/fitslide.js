// Question kind 'fitslide': level 375 Дупка в дъската — A 7 × 7 board with a hole: which two of four pieces fill it, sliding only (no turning, no flipping).

// Кенгуру 2024, задача 19: four combinations of squares, the hole in the 7 × 7 board; which two fill it when the pieces may only be
// slid (C: 1 and 2). The hole is two pieces side by side; the four to choose from are those two and two decoys, each the turned or flipped
// copy of one of them (so a child who turns the pieces gets a wrong pair that fits). The answer is a pair of numbers, so the kind brings
// its own А–Д (all the pairs: «1 и 4»). Brute force: each of the six pairs is tried at every place, translations only; exactly one fills.
import { KIND, shuffle, tr } from '../js/core.js';
import { pzKey, pzMir, pzNorm, pzRot } from './fitwhite.js';
/** @typedef {number[][]} Cells */
const N = 7, PCOL = ['var(--accent)', 'var(--warm)', 'var(--good)', 'var(--grape)'];
/** does the hole split into a slid copy of p and a slid copy of q? Cells of the hole are "x,y" */
export function slideFills(/** @type {Cells} */ hole, /** @type {Cells} */ p, /** @type {Cells} */ q){
  const set = new Set(hole.map(c => c.join(',')));
  for(const [hx, hy] of hole){
    const np = pzNorm(p), at = np.map(([a, b]) => [a - np[0][0] + hx, b - np[0][1] + hy]);   // the first cell of the piece (top left in reading order) on each hole cell
    if(!at.every(c => set.has(c.join(',')))) continue;
    const rest = hole.filter(c => !at.some(a => a[0] === c[0] && a[1] === c[1]));
    if(rest.length === q.length && pzKey(rest) === pzKey(q)) return at;
  }
  return null;
}
const grow = (n, /** @type {Set<string>} */ within) => {
  const cells = [[...within][Math.floor(Math.random() * within.size)].split(',').map(Number)];
  while(cells.length < n){
    const opts = cells.flatMap(([x, y]) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]).filter(p => within.has(p.join(',')) && !cells.some(c => c[0] === p[0] && c[1] === p[1]));
    if(!opts.length) return null;
    cells.push(opts[Math.floor(Math.random() * opts.length)]);
  }
  return cells;
};
export function genFitSlide(){
  for(;;){
    const nA = 5 + Math.floor(Math.random() * 2), nB = 5 + Math.floor(Math.random() * 2);
    const box = new Set(); for(let y = 0; y < 5; y++) for(let x = 0; x < 5; x++) box.add(x + ',' + y);
    const whole = grow(nA + nB, box);
    if(!whole) continue;
    const A = grow(nA, new Set(whole.map(c => c.join(','))));
    if(!A) continue;
    const B = whole.filter(c => !A.some(a => a[0] === c[0] && a[1] === c[1]));
    const conn = (/** @type {Cells} */ c) => { const seen = [c[0]]; for(let i = 0; i < seen.length; i++) c.forEach(p => { if(Math.abs(p[0] - seen[i][0]) + Math.abs(p[1] - seen[i][1]) === 1 && !seen.includes(p)) seen.push(p); }); return seen.length === c.length; };
    if(!conn(B)) continue;
    const pA = pzNorm(A), pB = pzNorm(B);
    if(pzKey(pA) === pzKey(pB)) continue;   // two different pieces, or the four would not all differ
    // two decoys: a turned or flipped copy of one piece each, different from every piece already there
    const copy = (/** @type {Cells} */ c) => shuffle([pzRot(c), pzRot(pzRot(c)), pzRot(pzRot(pzRot(c))), pzMir(c), pzMir(pzRot(c)), pzMir(pzRot(pzRot(c)))]);
    const pieces = [pA, pB];
    const dA = copy(pA).find(c => !pieces.some(p => pzKey(p) === pzKey(c))), dB = copy(pB).find(c => !pieces.some(p => pzKey(p) === pzKey(c)) && (!dA || pzKey(c) !== pzKey(dA)));
    if(!dA || !dB) continue;
    const all = [pA, pB, dA, dB], pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
    const ok = pairs.filter(([i, j]) => slideFills(whole, all[i], all[j]));
    if(ok.length !== 1 || ok[0].join() !== '0,1') continue;
    const mx = Math.min(...whole.map(c => c[0])), my = Math.min(...whole.map(c => c[1]));
    const ox = Math.floor(Math.random() * (N - 5 + 1)), oy = Math.floor(Math.random() * (N - 5 + 1));
    const hole = whole.map(([x, y]) => [x - mx + ox, y - my + oy]);
    const where = slideFills(hole, all[0], all[1]) || [];
    const placed = where.length ? [where, hole.filter(c => !where.some((/** @type {number[]} */ a) => a[0] === c[0] && a[1] === c[1]))] : [[], []];
    const order = shuffle([0, 1, 2, 3]);   // order[k] = which of all[] is shown as piece k + 1
    const num = (/** @type {number} */ i) => order.indexOf(i) + 1;
    const want = [num(0), num(1)].sort().join();
    const wrongPairs = shuffle(pairs.filter(([i, j]) => !(i === 0 && j === 1)));
    const chosen = shuffle(wrongPairs.slice(0, 4).concat([[0, 1]])).map(([i, j]) => [num(i), num(j)].sort());
    const pick = chosen.findIndex(p => p.join() === want);
    return {kind:'fitslide', hole, pieces: order.map(i => all[i]), placed, trueNums: [num(0), num(1)].sort(), nums: [num(0), num(1)], options: chosen.map((p, id) => ({ id, v: id, text: [p[0] + ' и ' + p[1], p[0] + ' і ' + p[1]], pair: p })), pick, own: true, ans: pick};
  }
}
function cell(x, y, u, fill, stroke, sw, dash){
  return '<rect x="' + (x * u + 1) + '" y="' + (y * u + 1) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="2" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '"' + (dash ? ' stroke-dasharray="3 2"' : '') + '/>';
}
/** the board with its hole; the hole filled with the two pieces' colours when placed is given */
function board(q, placed){
  const u = 22;
  let g = '';
  for(let y = 0; y < N; y++) for(let x = 0; x < N; x++){
    const inHole = q.hole.some((/** @type {number[]} */ c) => c[0] === x && c[1] === y);
    if(!inHole) g += cell(x, y, u, 'var(--fur-light)', 'var(--fur-dark)', 1.2, false);
  }
  if(placed) placed.forEach((/** @type {number[][]} */ cs, k) => cs.forEach(([x, y]) => { g += cell(x, y, u, PCOL[q.nums[k] - 1], 'var(--ink)', 1.2, false); }));
  else q.hole.forEach(([x, y]) => { g += cell(x, y, u, 'var(--solid)', 'var(--muted)', 1.2, true); });
  return '<svg viewBox="0 0 ' + N * u + ' ' + N * u + '" width="' + N * u + '" height="' + N * u + '" style="max-width:100%" role="img" aria-label="' + tr('дъска 7 на 7 с дупка от празни квадратчета', 'дошка 7 на 7 з діркою з порожніх квадратиків') + '">' + g + '</svg>';
}
function pieceSvg(/** @type {Cells} */ c, k){
  const u = 18, w = Math.max(...c.map(p => p[0])) + 1, h = Math.max(...c.map(p => p[1])) + 1;
  return '<svg viewBox="0 -16 ' + w * u + ' ' + (h * u + 16) + '" width="' + w * u + '" height="' + (h * u + 16) + '" role="img" aria-label="' + tr('част ', 'частина ') + k + '">' +
    '<text x="' + w * u / 2 + '" y="-3" text-anchor="middle" font-size="14" font-weight="800" fill="var(--ink)" font-family="Nunito, sans-serif">' + k + '</text>' +
    c.map(([x, y]) => cell(x, y, u, PCOL[k - 1], 'var(--ink)', 1.2, false)).join('') + '</svg>';
}
function drawFitSlide(q){
  return '<div class="ask">' + tr('С кои две от показаните четири комбинации от единични квадратчета може да се възстанови дъската 7&nbsp;на&nbsp;7? Разрешено е само плъзгане на комбинациите, но не и да се въртят или обръщат. <b>Кои две?</b>',
    'З яких двох із чотирьох показаних комбінацій одиничних квадратиків можна відновити дошку 7&nbsp;на&nbsp;7? Дозволено лише зсувати комбінації, але не повертати і не перевертати. <b>Які дві?</b>') + '</div>' +
    '<div class="given" style="display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:center; gap:14px 18px">' + board(q) + '<span style="display:flex; align-items:flex-end; gap:14px">' + q.pieces.map((/** @type {number[][]} */ c, i) => pieceSvg(c, i + 1)).join('') + '</span></div>';
}
function eqFitSlide(q){ return tr(q.trueNums[0] + ' и ' + q.trueNums[1], q.trueNums[0] + ' і ' + q.trueNums[1]); }
function whyFitSlide(q, full){
  if(!full) return tr('Не обръщай и не въртяй частите: само ги плъзгай. Опитай да запълниш дупката с една част и виж дали остатъкът е точно друга.', 'Не повертай і не перевертай частини: лише зсувай. Спробуй заповнити дірку однією частиною й подивись, чи решта — точно інша.');
  return board(q, q.placed) + '<br>' + tr('Частите ' + q.trueNums[0] + ' и ' + q.trueNums[1] + ' запълват дупката точно така, както са начертани. Другите двойки не запълват дупката точно, когато само се плъзгат.', 'Частини ' + q.trueNums[0] + ' і ' + q.trueNums[1] + ' заповнюють дірку точно так, як намальовані. Інші пари не заповнюють дірку точно, якщо лише зсувати.');
}
KIND.fitslide = { draw:drawFitSlide, eq:eqFitSlide, why:whyFitSlide };
