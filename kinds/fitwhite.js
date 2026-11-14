// Question kind 'fitwhite': level 374 Фигурка в пъзела — Which of five grey pieces covers only white squares of the puzzle (turning allowed).

// Кенгуру 2025, задача 1: a 7 × 6 puzzle, some squares coloured by pieces already laid, the rest white; which of five five-square pieces
// can be put on it so that it covers white squares only, turning it allowed (key E). The pieces are the 18 pentominoes as they come
// (a piece and its mirror image are two different pieces when only turning is allowed, so the "flipped" slip is a real option).
// The answer is a picture, so the kind brings its own А–Д. Brute force: every option is tried at every place in each of its 4 turns.
import { KIND, shuffle, tr } from '../js/core.js';
/** @typedef {number[][]} Cells */
const FREE = [[[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]], [[1, 0], [1, 1], [1, 2], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]], [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
  [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]]];
/** the cells moved to the top left corner and sorted: the same shape in the same turn always gives the same list */
export const pzNorm = (/** @type {Cells} */ c) => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
export const pzKey = (/** @type {Cells} */ c) => pzNorm(c).join(';');
export const pzRot = (/** @type {Cells} */ c) => pzNorm(c.map(([x, y]) => [-y, x]));   // a quarter turn
export const pzMir = (/** @type {Cells} */ c) => pzNorm(c.map(([x, y]) => [-x, y]));    // flipped over
/** the four turns of a shape (some may repeat) */
export const pzTurns = (/** @type {Cells} */ c) => { const r = [pzNorm(c)]; for(let i = 1; i < 4; i++) r.push(pzRot(r[i - 1])); return r; };
/** the pieces as they come: each free shape, and its mirror image where that is a different piece when only turning is allowed */
const POOL = [];
{ const seen = new Set();
  FREE.forEach(c => [c, pzMir(c)].forEach(s => { const k = pzTurns(s).map(pzKey).sort()[0]; if(!seen.has(k)){ seen.add(k); POOL.push(pzNorm(s)); } })); }
const W = 7, H = 6, COL = ['var(--bad)', 'var(--accent)', 'var(--good)', 'var(--warm)', 'var(--grape)'];
/** where a piece, turned any way, lies on white squares only: the cells of the first such place, or null */
const TURNS = new Map();   // a piece's turns, worked out once
export function pzFits(/** @type {Set<string>} */ white, /** @type {Cells} */ piece){
  const key = piece.join(';');
  if(!TURNS.has(key)) TURNS.set(key, [...new Map(pzTurns(piece).map(t => [pzKey(t), t])).values()]);
  for(const t of TURNS.get(key)) for(let y = 0; y < H; y++) for(let x = 0; x < W; x++){
    const at = t.map(([a, b]) => [a + x, b + y]);
    if(at.every(([a, b]) => white.has(a + ',' + b))) return at;
  }
  return null;
}
export function genFitWhite(){
  for(;;){
    // the white squares: one piece laid somewhere, turned any way, and a few more white squares beside it
    const t0 = POOL[Math.floor(Math.random() * POOL.length)], tt = pzTurns(t0)[Math.floor(Math.random() * 4)];
    const ox = Math.floor(Math.random() * (W - Math.max(...tt.map(p => p[0]))) ), oy = Math.floor(Math.random() * (H - Math.max(...tt.map(p => p[1]))));
    const free = new Set(tt.map(([x, y]) => (x + ox) + ',' + (y + oy)));
    const extra = 3 + Math.floor(Math.random() * 5);
    for(let i = 0; i < extra; i++) free.add(Math.floor(Math.random() * W) + ',' + Math.floor(Math.random() * H));
    // the others are coloured: each square takes the colour of the nearest of five seeds, so the colours lie in patches like laid pieces
    const seeds = [], paint = {};
    const coloured = []; for(let y = 0; y < H; y++) for(let x = 0; x < W; x++) if(!free.has(x + ',' + y)) coloured.push([x, y]);
    shuffle(coloured.slice()).slice(0, 5).forEach(c => seeds.push(c));
    coloured.forEach(([x, y]) => { let best = 0, bd = 99; seeds.forEach(([sx, sy], i) => { const d = Math.abs(sx - x) + Math.abs(sy - y) + Math.random() * 0.9; if(d < bd){ bd = d; best = i; } }); paint[x + ',' + y] = best; });
    const fit = POOL.map(p => pzFits(free, p));
    const yes = POOL.map((_, i) => i).filter(i => fit[i]), no = POOL.map((_, i) => i).filter(i => !fit[i]);
    if(!yes.length || yes.length > 3 || no.length < 4) continue;
    const t = yes[Math.floor(Math.random() * yes.length)];
    // the likeliest slip first: the mirror image of the right piece, which only a flip would fit
    const mirror = no.filter(i => pzKey(POOL[i]) !== pzKey(POOL[t]) && pzTurns(pzMir(POOL[t])).some(s => pzKey(s) === pzKey(POOL[i])));
    const wrong = mirror.slice(0, 1).concat(shuffle(no.filter(i => !mirror.slice(0, 1).includes(i)))).slice(0, 4);
    const ids = shuffle(wrong.concat(t)), pick = ids.indexOf(t);
    const turn = ids.map(() => Math.floor(Math.random() * 4));
    const shown = ids.map((i, j) => pzTurns(POOL[i])[turn[j]]);
    return {kind:'fitwhite', paint, white: [...free].sort(), place: fit[t], options: shown.map((c, id) => ({ id, v: id, text: ['<span class="vw">' + piece(c) + '</span>', '<span class="vw">' + piece(c) + '</span>'], cells: c })), pick, own: true, ans: pick};
  }
}
/** a grey piece as a picture */
function piece(/** @type {Cells} */ c){
  const u = 15, w = Math.max(...c.map(p => p[0])) + 1, h = Math.max(...c.map(p => p[1])) + 1;
  return '<svg viewBox="0 0 ' + w * u + ' ' + h * u + '" width="' + w * u + '" height="' + h * u + '" role="img" aria-label="' + tr('фигурка от пет квадратчета', 'фігурка з п’яти квадратиків') + '">' +
    c.map(([x, y]) => '<rect x="' + (x * u + 1) + '" y="' + (y * u + 1) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="2" fill="var(--fur-light)" stroke="var(--fur-dark)" stroke-width="1.5"/>').join('') + '</svg>';
}
/** the puzzle; place: cells of a piece laid on it (the solution) */
function board(q, place){
  const u = 24;
  let g = '';
  for(let y = 0; y < H; y++) for(let x = 0; x < W; x++){
    const k = x + ',' + y, on = place && place.some((/** @type {number[]} */ p) => p[0] === x && p[1] === y);
    g += '<rect x="' + (x * u + 1) + '" y="' + (y * u + 1) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="3" fill="' + (on ? 'var(--fur-light)' : k in q.paint ? COL[q.paint[k]] : 'var(--solid)') + '" stroke="' + (on ? 'var(--ink)' : 'var(--line)') + '" stroke-width="' + (on ? 2.5 : 1.5) + '"/>';
  }
  return '<svg viewBox="0 0 ' + W * u + ' ' + H * u + '" width="' + W * u + '" height="' + H * u + '" style="max-width:100%" role="img" aria-label="' + tr('пъзел от бели и оцветени квадратчета', 'пазл із білих і розфарбованих квадратиків') + '">' + g + '</svg>';
}
function drawFitWhite(q){
  return '<div class="ask">' + tr('<b>Коя от фигурките по-долу може да се постави върху показания пъзел, така че да покрива точно само бели квадратчета?</b> (разрешено е фигурките да се въртят, но не и да се обръщат)',
    '<b>Яку з фігурок нижче можна покласти на показаний пазл так, щоб вона закривала тільки білі квадратики?</b> (фігурки дозволено повертати, але не перевертати)') + '</div>' +
    '<div class="given" style="text-align:center">' + board(q) + '</div>';
}
function eqFitWhite(q){ return tr('фигурката, която се събира в белите квадратчета', 'фігурка, яка вміщається в білі квадратики'); }
function whyFitWhite(q, full){
  if(!full) return tr('Завърти всяка фигурка в мислите си и я пробвай върху белите квадратчета. Тази, която влиза само в бели, е правилната. Огледално обърната фигурка не става, само завъртяна.', 'Поверни подумки кожну фігурку й спробуй на білих квадратиках. Та, що лягає тільки на білі, правильна. Дзеркально перевернута не годиться, лише повернута.');
  return board(q, q.place) + '<br>' + tr('Тази фигурка, завъртяна така, лежи само върху бели квадратчета. Другите се удрят в оцветените или са огледални.', 'Ця фігурка, повернута так, лежить лише на білих квадратиках. Інші зачіпають розфарбовані або є дзеркальними.');
}
KIND.fitwhite = { draw:drawFitWhite, eq:eqFitWhite, why:whyFitWhite };
