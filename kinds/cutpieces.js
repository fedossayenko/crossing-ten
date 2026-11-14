// Question kind 'cutpieces': levels 423 Три части в пъзела (which three pieces fill the empty squares), 424 Неизползваната част (a square of symbols
// made of four of five pieces: the unused one), 425 Отрязаното парче (a two-square piece cut from a grid of shapes). The answer is a picture: the kind
// brings its own А–Д.

// Кенгуру 2023 #16: a 4 × 4 puzzle with 6 squares filled, which three pieces fill the other 10 (key A: the T, the bar of three and the small L).
// Reading the printed pieces: only A has pieces that add up to 10 squares (B and C 11, D 7, E 9), and A fills the puzzle only when the pieces are
// turned, so turning is allowed, flipping is not. The generator keeps that rule and gives a wrong set that also adds up to 10 when it can.
// Кенгуру 2021 #17: a 4 × 4 square of symbols made of four of five pieces, which piece is not used (key D). Pieces are slid, not turned (the arrows
// would point another way). Кенгуру 2019 #4: a piece cut from a 3 × 3 figure of shapes, which is it (key E: square, circle). The piece is two
// squares side by side as they were; a triangle that points another way is another shape.
import { KIND, rnd, shuffle, tr } from '../js/core.js';
import { nearest } from './viewcubes.js';

/** @typedef {number[][]} Cells */
const LET = 'АБВГД';
const sorted = (/** @type {Cells} */ c) => c.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0]);
const norm = (/** @type {Cells} */ c) => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return sorted(c.map(([x, y]) => [x - mx, y - my])); };
const key = (/** @type {Cells} */ c) => norm(c).join(';');
const turn = (/** @type {Cells} */ c) => norm(c.map(([x, y]) => [-y, x]));
const flip = (/** @type {Cells} */ c) => norm(c.map(([x, y]) => [-x, y]));
const turns = (/** @type {Cells} */ c) => { const r = [norm(c)]; for(let i = 1; i < 4; i++) r.push(turn(r[i - 1])); return r; };
const opt = (items, svg) => items.map((it, id) => ({ id, v: id, text: [svg(it, id), svg(it, id)] }));
const label = (svg, l) => svg.replace('aria-label=""', 'aria-label="' + l + '"');

// ---- 423: three pieces on the empty squares of a 4 × 4 puzzle
const N = 4;
const POOL = [[[0, 0]], [[0, 0], [1, 0]], [[0, 0], [0, 1], [0, 2]], [[1, 0], [0, 1], [1, 1]], [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[1, 0], [1, 1], [1, 2], [0, 2]], [[0, 0], [1, 0], [2, 0], [1, 1]], [[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]]];
/** do the pieces cover exactly these empty squares ("x,y")? turning always, flipping only when flipped */
export function piecesFill(/** @type {Set<string>} */ empty, /** @type {Cells[]} */ pieces, flipped){
  const shapes = pieces.map(p => { const all = turns(p).concat(flipped ? turns(flip(p)) : []); return [...new Map(all.map(s => [key(s), s])).values()]; });
  if(pieces.reduce((s, p) => s + p.length, 0) !== empty.size) return false;
  const go = (/** @type {Set<string>} */ left, /** @type {number[]} */ used) => {
    if(!left.size) return true;
    const [tx, ty] = sorted([...left].map(s => s.split(',').map(Number)))[0];
    for(let i = 0; i < shapes.length; i++){
      if(used.includes(i)) continue;
      for(const s of shapes[i]){
        const at = s.map(([x, y]) => (x - s[0][0] + tx) + ',' + (y - s[0][1] + ty));
        if(!at.every(c => left.has(c))) continue;
        const rest = new Set(left); at.forEach(c => rest.delete(c));
        if(go(rest, used.concat([i]))) return true;
      }
    }
    return false;
  };
  return go(new Set(empty), []);
}
function pieceSvg(/** @type {Cells} */ c, u, fill, stroke){
  const w = Math.max(...c.map(p => p[0])) + 1, h = Math.max(...c.map(p => p[1])) + 1;
  return '<svg viewBox="0 0 ' + w*u + ' ' + h*u + '" width="' + w*u + '" height="' + h*u + '" role="img" aria-label="">' + c.map(([x, y]) => '<rect x="' + (x*u + 1) + '" y="' + (y*u + 1) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>').join('') + '</svg>';
}
const setSvg = (/** @type {Cells[]} */ ps) => { const u = 13;
  return '<span style="display:inline-flex; align-items:center; gap:8px; max-width:100%">' + ps.map(p => pieceSvg(p, u, 'var(--accent)', 'var(--accent-ink)').replace('aria-label=""', 'aria-hidden="true"')).join('') + '</span>'; };
const PIECE_COL = ['var(--warm)', 'var(--good)', 'var(--grape)'];
const boardSvg = (/** @type {Set<string>} */ empty, /** @type {string[][] | null} */ place) => { const u = 28, W = N*u + 4;
  let g = '';
  for(let y = 0; y < N; y++) for(let x = 0; x < N; x++){ const e = empty.has(x + ',' + y), on = place ? place.findIndex(p => p.includes(x + ',' + y)) : -1; g += '<rect x="' + (2 + x*u) + '" y="' + (2 + y*u) + '" width="' + u + '" height="' + u + '" fill="' + (on >= 0 ? PIECE_COL[on] : e ? 'var(--paper)' : 'var(--accent)') + '" stroke="' + (e ? 'var(--fur-dark)' : 'var(--accent-ink)') + '" stroke-width="1.6"/>'; }
  return '<svg viewBox="0 0 ' + W + ' ' + W + '" width="' + W + '" height="' + W + '" style="max-width:100%" role="img" aria-label="' + tr('пъзел 4 на 4: празни квадратчета и запълнени в синьо', 'пазл 4 на 4: порожні квадратики й заповнені синім') + '">' + g + '</svg>'; };
export function genFillSets(){
  for(;;){
    const sizes = shuffle(rnd(2) ? [4, 3, 3] : [4, 4, 2]);
    const pick = [];
    for(const s of sizes){ const c = shuffle(POOL.map((p, i) => i).filter(i => POOL[i].length === s && !pick.includes(i)))[0]; if(c === undefined) break; pick.push(c); }
    if(pick.length < 3) continue;
    // lay them on the board, each turned any way
    const taken = new Set(), placed = [];
    for(const i of pick){
      const t = turns(POOL[i])[rnd(4)];
      let ok = false;
      for(let k = 0; k < 60 && !ok; k++){
        const ox = rnd(N), oy = rnd(N), at = t.map(([x, y]) => [x + ox, y + oy]);
        if(at.every(([x, y]) => x < N && y < N && !taken.has(x + ',' + y))){ at.forEach(([x, y]) => taken.add(x + ',' + y)); placed.push(at); ok = true; }
      }
      if(!ok) break;
    }
    if(placed.length < 3) continue;
    const empty = taken;
    if(!piecesFill(empty, pick.map(i => POOL[i]), false)) continue;
    // four wrong sets of three different pieces: one of them adds up to ten squares, none fills with turning, none with flipping either
    const same = (a, b) => [...a].sort().join() === [...b].sort().join();
    const sets = [pick], size = s => s.reduce((n, i) => n + POOL[i].length, 0);
    for(let k = 0; k < 400 && sets.length < 5; k++){
      const s = shuffle(POOL.map((p, i) => i)).slice(0, 3);
      if(sets.some(o => same(o, s)) || piecesFill(empty, s.map(i => POOL[i]), true)) continue;
      if(sets.length === 4 && !sets.slice(1).some(o => size(o) === 10) && size(s) !== 10) continue;
      sets.push(s);
    }
    if(sets.length < 5) continue;
    const order = shuffle(sets.map((s, i) => i)), items = order.map(i => sets[i]), at = order.indexOf(0);
    if(!nearest(items.map(s => POOL.map((p, i) => s.includes(i) ? 1 : 0)), at)) continue;
    const shown = items.map(s => s.map(i => turns(POOL[i])[rnd(4)]));
    return {kind:'cutpieces', shape:'fill', empty: [...empty].sort(), place: placed.map(c => c.map(p => p.join(','))), sets: items, options: opt(shown, (ps, id) => label(setSvg(ps), LET[id]).replace(/^<span /, '<span role="img" aria-label="' + LET[id] + '" ')), pick: at, own:true, ans: at};
  }
}

// ---- symbols: the shapes a square can hold
const SYM = ['up', 'down', 'left', 'right', 'circle', 'square', 'star', 'diamond', 'arrowR', 'arrowD', 'arrowL', 'arrowU'];
function glyph(k, cx, cy, r, fill, stroke){
  const P = pts => '<polygon points="' + pts.map(([x, y]) => (cx + x*r).toFixed(1) + ',' + (cy + y*r).toFixed(1)).join(' ') + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4" stroke-linejoin="round"/>';
  if(k === 'circle') return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r*0.95).toFixed(1) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>';
  if(k === 'square') return P([[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]]);
  if(k === 'diamond') return P([[0, -1], [0.8, 0], [0, 1], [-0.8, 0]]);
  if(k === 'up') return P([[0, -1], [1, 0.8], [-1, 0.8]]);
  if(k === 'down') return P([[0, 1], [1, -0.8], [-1, -0.8]]);
  if(k === 'left') return P([[-1, 0], [0.8, -1], [0.8, 1]]);
  if(k === 'right') return P([[1, 0], [-0.8, -1], [-0.8, 1]]);
  if(k === 'arrowR') return P([[-1, -0.35], [0.1, -0.35], [0.1, -0.85], [1, 0], [0.1, 0.85], [0.1, 0.35], [-1, 0.35]]);
  if(k === 'arrowL') return P([[1, -0.35], [-0.1, -0.35], [-0.1, -0.85], [-1, 0], [-0.1, 0.85], [-0.1, 0.35], [1, 0.35]]);
  if(k === 'arrowU') return P([[-0.35, 1], [0.35, 1], [0.35, -0.1], [0.85, -0.1], [0, -1], [-0.85, -0.1], [-0.35, -0.1]]);
  if(k === 'arrowD') return P([[-0.35, -1], [0.35, -1], [0.35, 0.1], [0.85, 0.1], [0, 1], [-0.85, 0.1], [-0.35, 0.1]]);
  return P(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI/2 + i*Math.PI/5, d = i % 2 ? 0.45 : 1; return [Math.cos(a)*d, Math.sin(a)*d]; }));
}
/** cells with a symbol each: [x, y, symbol] */
const cellSvg = (x, y, u, s, fillGlyph) => '<rect x="' + (x*u + 1) + '" y="' + (y*u + 1) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" fill="var(--solid)" stroke="var(--accent-ink)" stroke-width="1.6"/>' + glyph(s, x*u + u/2, y*u + u/2, u*0.31, fillGlyph ? 'var(--ink)' : 'none', 'var(--ink)');
const symPiece = (c, u) => { const w = Math.max(...c.map(p => p[0])) + 1, h = Math.max(...c.map(p => p[1])) + 1;
  return '<svg viewBox="0 0 ' + w*u + ' ' + h*u + '" width="' + w*u + '" height="' + h*u + '" style="max-width:100%" role="img" aria-label="">' + c.map(([x, y, s]) => cellSvg(x, y, u, s, false)).join('') + '</svg>'; };

// ---- 424: the unused piece
const normS = (c) => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y, s]) => [x - mx, y - my, s]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
const keyS = c => normS(c).join(';');
/** a piece turned a quarter turn clockwise: its squares move and its arrows turn with them */
const SPIN = { arrowR: 'arrowD', arrowD: 'arrowL', arrowL: 'arrowU', arrowU: 'arrowR' };
export const spinS = c => normS(c.map(([x, y, k]) => [-y, x, SPIN[k] || k]));
/** do these pieces, turned any way (not flipped), make the whole square with every square showing its own symbol? grid: "x,y" -> symbol */
export function piecesTile(/** @type {Map<string, string>} */ grid, pieces){
  if(pieces.reduce((s, p) => s + p.length, 0) !== grid.size) return false;
  const shapes = pieces.map(p => { const r = [normS(p)]; for(let i = 1; i < 4; i++) r.push(spinS(r[i - 1])); return [...new Map(r.map(t => [keyS(t), t])).values()]; });
  const go = (/** @type {Map<string, string>} */ left, /** @type {number[]} */ used) => {
    if(!left.size) return true;
    const [tx, ty] = [...left.keys()].map(s => s.split(',').map(Number)).sort((a, b) => a[1] - b[1] || a[0] - b[0])[0];
    for(let i = 0; i < shapes.length; i++){
      if(used.includes(i)) continue;
      for(const s of shapes[i]){
        const at = s.map(([x, y, k]) => [x - s[0][0] + tx, y - s[0][1] + ty, k]);
        if(!at.every(([x, y, k]) => left.get(x + ',' + y) === k)) continue;
        const rest = new Map(left); at.forEach(([x, y]) => rest.delete(x + ',' + y));
        if(go(rest, used.concat([i]))) return true;
      }
    }
    return false;
  };
  return go(new Map(grid), []);
}
const NB = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function splitSquare(){
  // four connected parts of the 4 x 4 square, grown from four seeds
  const owner = Array.from({ length: N*N }, () => -1), seeds = shuffle(Array.from({ length: N*N }, (_, i) => i)).slice(0, 4);
  seeds.forEach((s, i) => { owner[s] = i; });
  for(let left = N*N - 4; left > 0;){
    const i = rnd(4), mine = owner.map((o, k) => o === i ? k : -1).filter(k => k >= 0);
    const opts = mine.flatMap(k => NB.map(([a, b]) => [k % N + a, Math.floor(k/N) + b])).filter(([x, y]) => x >= 0 && y >= 0 && x < N && y < N && owner[y*N + x] < 0);
    if(!opts.length) continue;
    const [x, y] = opts[rnd(opts.length)]; owner[y*N + x] = i; left--;
  }
  return [0, 1, 2, 3].map(i => owner.map((o, k) => o === i ? [k % N, Math.floor(k/N)] : null).filter(Boolean));
}
export function genUnusedPiece(){
  for(;;){
    const parts = splitSquare();
    if(parts.some(p => p.length < 3 || p.length > 5)) continue;
    const used = parts.map(p => normS(p.map(([x, y]) => [x, y, SYM[[6, 7, 4, 8, 9][rnd(5)]]])));
    // squares of the whole square with their symbols
    const grid = new Map();
    parts.forEach((p, i) => { const mx = Math.min(...p.map(c => c[0])), my = Math.min(...p.map(c => c[1])); used[i].forEach(([x, y, s]) => grid.set((x + mx) + ',' + (y + my), s)); });
    if(new Set([...grid.values()]).size < 3) continue;
    // the pieces are shown turned any way: each part a random quarter turn from where it lies in the square
    const shownParts = used.map(p => { let t = p; for(let k = rnd(4); k > 0; k--) t = spinS(t); return t; });
    // the fifth piece: one of the four with a symbol changed or a square moved
    const base = shownParts[rnd(4)].map(c => c.slice());
    let decoy;
    if(rnd(2)){ const k = rnd(base.length), others = [6, 7, 4, 8, 9].map(i => SYM[i]).filter(s => s !== base[k][2]); decoy = base.map((c, i) => i === k ? [c[0], c[1], others[rnd(others.length)]] : c); }
    else {
      const k = rnd(base.length), rest = base.filter((c, i) => i !== k), cand = rest.flatMap(c => NB.map(([a, b]) => [c[0] + a, c[1] + b])).filter(([x, y]) => !base.some(c => c[0] === x && c[1] === y));
      if(!cand.length) continue;
      const [x, y] = cand[rnd(cand.length)]; decoy = rest.concat([[x, y, base[k][2]]]);
    }
    decoy = normS(decoy);
    const spins = c => { const r = [normS(c)]; for(let i = 1; i < 4; i++) r.push(spinS(r[i - 1])); return r.map(keyS); };
    if(shownParts.some(p => spins(p).includes(keyS(decoy))) || shownParts.some((p, i) => shownParts.some((o, j) => i < j && spins(p).includes(keyS(o))))) continue;   // no two pieces alike, turned or not
    // every piece left out in turn: exactly the fifth one leaves a set that makes the square
    const all = shownParts.concat([decoy]), ok = all.map((p, i) => piecesTile(grid, all.filter((q, j) => j !== i)));
    if(ok.filter(Boolean).length !== 1 || !ok[4]) continue;
    const order = shuffle([0, 1, 2, 3, 4]), items = order.map(i => all[i]), at = order.indexOf(4);
    return {kind:'cutpieces', shape:'unused', grid: [...grid].sort(), pieces: items, options: opt(items, (c, id) => label(symPiece(c, 24), LET[id])), pick: at, own:true, ans: at};
  }
}

// ---- 425: the piece cut from a grid of shapes
const BASE = ['up', 'circle', 'square', 'star', 'diamond'], ALL = BASE.concat(['left', 'down']);
const R = 3;
const dominoSvg = (a, b, vertical, u) => { const w = vertical ? 1 : 2, h = vertical ? 2 : 1;
  return '<svg viewBox="0 0 ' + w*u + ' ' + h*u + '" width="' + w*u + '" height="' + h*u + '" style="max-width:100%" role="img" aria-label="">' + cellSvg(0, 0, u, a, true) + cellSvg(vertical ? 0 : 1, vertical ? 1 : 0, u, b, true) + '</svg>'; };
/** is the pair of shapes a piece cut from the figure: two neighbours in this order, side by side (or one above the other) as they are? */
export function pairIn(/** @type {string[][]} */ g, /** @type {string[]} */ p, vertical){
  for(let y = 0; y < g.length; y++) for(let x = 0; x < g[0].length; x++){
    const o = vertical ? (g[y + 1] || [])[x] : g[y][x + 1];
    if(g[y][x] === p[0] && o === p[1]) return true;
  }
  return false;
}
/** the squares of the first place where the pair lies in the figure */
const cutAt = (g, p, vertical) => { for(let y = 0; y < g.length; y++) for(let x = 0; x < g[0].length; x++){ const o = vertical ? (g[y + 1] || [])[x] : g[y][x + 1]; if(g[y][x] === p[0] && o === p[1]) return [[x, y], vertical ? [x, y + 1] : [x + 1, y]]; } return []; };
export function genCutDomino(){
  for(;;){
    const g = Array.from({ length: R }, () => Array.from({ length: R }, () => BASE[rnd(5)])), vertical = rnd(2) === 1;
    if(new Set(g.flat()).size < 4) continue;
    const pairs = [];
    for(let y = 0; y < R; y++) for(let x = 0; x < R; x++) if(vertical ? y < R - 1 : x < R - 1) pairs.push([g[y][x], vertical ? g[y + 1][x] : g[y][x + 1]]);
    const has = p => pairIn(g, p, vertical);
    const truth = pairs[rnd(pairs.length)];
    const wrong = [], seen = new Set([truth.join()]);
    for(let k = 0; k < 300 && wrong.length < 4; k++){
      const p = rnd(2) ? [ALL[rnd(7)], ALL[rnd(7)]] : rnd(2) ? [truth[1], truth[0]] : [g[rnd(R)][rnd(R)], g[rnd(R)][rnd(R)]];
      if(has(p) || seen.has(p.join())) continue;
      seen.add(p.join()); wrong.push(p);
    }
    if(wrong.length < 4) continue;
    const items = shuffle(wrong.concat([truth])), at = items.indexOf(truth);
    if(!nearest(items.map(p => p.slice()), at)) continue;
    return {kind:'cutpieces', shape:'domino', g, vertical, options: opt(items, (p, id) => label(dominoSvg(p[0], p[1], vertical, 30), LET[id])), pairs: items, pick: at, own:true, ans: at};
  }
}

// ---- drawing, worked line, hint and solution
const gridSvg = (g, u, hl) => '<svg viewBox="0 0 ' + g[0].length*u + ' ' + g.length*u + '" width="' + g[0].length*u + '" height="' + g.length*u + '" style="max-width:100%" role="img" aria-label="' + tr('таблица от фигурки', 'таблиця з фігурок') + '">' + g.map((r, y) => r.map((s, x) => cellSvg(x, y, u, s, true)).join('')).join('') + (hl ? hl.map(([x, y]) => '<rect x="' + (x*u + 1) + '" y="' + (y*u + 1) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" fill="none" stroke="var(--good)" stroke-width="3.4"/>').join('') : '') + '</svg>';
const squareSvg = (grid, u) => '<svg viewBox="0 0 ' + N*u + ' ' + N*u + '" width="' + N*u + '" height="' + N*u + '" style="max-width:100%" role="img" aria-label="' + tr('квадрат 4 на 4 от фигурки', 'квадрат 4 на 4 з фігурок') + '">' + [...grid].map(([k, s]) => { const [x, y] = k.split(',').map(Number); return cellSvg(x, y, u, s, false); }).join('') + '</svg>';
function drawCutPieces(q){
  if(q.shape === 'fill')
    return '<div class="ask">' + tr('<b>С кои 3 части е възможно попълване без застъпване на празните квадратчета от пъзела?</b> (Частите могат да се въртят, но не и да се обръщат.)',
      '<b>З яких 3 частин можна заповнити порожні квадратики пазла без накладання?</b> (Частини можна повертати, але не перевертати.)') + '</div><div class="given" style="text-align:center">' + boardSvg(new Set(q.empty), null) + '</div>';
  if(q.shape === 'unused')
    return '<div class="ask">' + tr('Квадратът е образуван с четири от показаните пет части. Частите могат да се въртят, но не и да се обръщат. <b>Коя част не е използвана?</b>', 'Квадрат утворено з чотирьох із п’яти показаних частин. Частини можна повертати, але не перевертати. <b>Яку частину не використано?</b>') + '</div>' +
      '<div class="given" style="text-align:center">' + squareSvg(new Map(q.grid), 30) + '</div>';
  return '<div class="ask">' + tr('От показаната фигура е отрязано парче от две квадратчета, ' + (q.vertical ? 'едно над друго' : 'едно до друго') + ', както са. <b>Кое е то?</b>', 'Від показаної фігури відрізано шматок із двох квадратиків, ' + (q.vertical ? 'один над одним' : 'один біля одного') + ', як вони є. <b>Який це шматок?</b>') + '</div>' +
    '<div class="given" style="text-align:center">' + gridSvg(q.g, 34) + '</div>';
}
function eqCutPieces(q){
  if(q.shape === 'fill') return tr('частите, които запълват празните квадратчета: ' + LET[q.pick], 'частини, що заповнюють порожні квадратики: ' + LET[q.pick]);
  if(q.shape === 'unused') return tr('частта, която не е използвана: ' + LET[q.pick], 'частина, яку не використано: ' + LET[q.pick]);
  return tr('отрязаното парче: ' + LET[q.pick], 'відрізаний шматок: ' + LET[q.pick]);
}
function whyCutPieces(q, full){
  if(!full){
    if(q.shape === 'fill') return tr('Преброй празните квадратчета и сбора на квадратчетата във всеки набор от части. После пробвай да положиш частите, като ги въртиш.', 'Порахуй порожні квадратики і суму квадратиків у кожному наборі частин. Потім спробуй покласти частини, повертаючи їх.');
    if(q.shape === 'unused') return tr('Започни от един ъгъл на квадрата и виж коя част пасва там с точно такива фигурки. Една от петте остава излишна.', 'Почни з одного кута квадрата і подивись, яка частина пасує там із такими самими фігурками. Одна з п’яти зайва.');
    return tr('Търси във фигурата две съседни квадратчета, които изглеждат точно като парчето, на същия ред. Разменен ред не става.', 'Шукай у фігурі два сусідні квадратики, що виглядають точно як шматок, у тому самому порядку. Помінявши порядок, шматок не отримати.');
  }
  if(q.shape === 'fill') return boardSvg(new Set(q.empty), q.place) + '<br>' + tr('Частите от ' + LET[q.pick] + ', завъртени както трябва, застават точно върху всичките празни квадратчета, без да се застъпват. Другите набори са с друг брой квадратчета или не се нареждат.', 'Частини з ' + LET[q.pick] + ', повернуті як треба, лягають точно на всі порожні квадратики без накладання. Інші набори мають іншу кількість квадратиків або не вкладаються.');
  if(q.shape === 'unused') return squareSvg(new Map(q.grid), 30) + '<br>' + tr('Останалите четири части се нареждат точно в квадрата, затова частта ' + LET[q.pick] + ' остава излишна.', 'Решта чотири частини лягають точно в квадрат. Тому частина ' + LET[q.pick] + ' зайва.');
  return gridSvg(q.g, 34, cutAt(q.g, q.pairs[q.pick], q.vertical)) + '<br>' + tr('Само парчето ' + LET[q.pick] + ' се среща във фигурата, две съседни квадратчета в този ред.', 'Лише шматок ' + LET[q.pick] + ' трапляється у фігурі: два сусідні квадратики в цьому порядку.');
}
KIND.cutpieces = { draw:drawCutPieces, eq:eqCutPieces, why:whyCutPieces };
