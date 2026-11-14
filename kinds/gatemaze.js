// Question kind 'gatemaze': level 430 Затворени врати — A maze with numbered gates: which two to close so the mouse cannot get to the cheese.

// Кенгуру 2019, 2 клас, задача 9: a mouse and a cheese in a maze, five gates numbered 1–5 in the passages; which two gates must be closed so the mouse can no
// longer reach the cheese? The paper's key is E (gates 4 and 5, both next to the cheese). The maze is a 5 × 6 board of rooms with gaps in the walls; five of the
// gaps carry a gate, and the drawn maze is kept only when exactly one of the ten pairs of gates cuts every way (worked out here by walking the maze with each pair
// shut), so there is one answer. The answer is a pair, so the kind brings its own five options, each a pair of gate numbers.
import { KIND, SVG_FONT, popAt, rnd, shuffle, svgFrame, svgText, tr } from '../js/core.js';
const R = 5, C = 6, U = 40, G = 5;
// the rooms reached from `from` through the gaps in `open` ('a-b' with a < b, a room as r * C + c), the gates in `shut` closed
export function gateReach(open, shut, from){
  const gap = new Set(open.filter(e => !shut.includes(e))), seen = new Set([from]), todo = [from];
  while(todo.length){
    const at = todo.pop(), r = Math.floor(at / C), c = at % C;
    [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nr, nc]) => {
      if(nr < 0 || nr >= R || nc < 0 || nc >= C) return;
      const to = nr * C + nc;
      if(!seen.has(to) && gap.has(Math.min(at, to) + '-' + Math.max(at, to))) seen.add(to), todo.push(to);
    });
  }
  return seen;
}
// every pair of gates [i, j] (numbers 1..5) whose closing cuts the mouse off from the cheese
export function gatePairs(q){
  const out = [];
  for(let i = 0; i < G; i++) for(let j = i + 1; j < G; j++)
    if(!gateReach(q.open, [q.gates[i], q.gates[j]], q.mouse).has(q.cheese)) out.push([i + 1, j + 1]);
  return out;
}
// five options that are pairs, the right one among them, in the order of a paper (by the smaller, then the bigger). A vote «take the pair made of the items
// that come up most often» must not pick the right one out: its score (the counts of its two items added) is neither the only biggest nor the only smallest.
/** @param {number[][]} all every pair @param {number[]} right @param {(p: number[], uk: number) => string} label */
export function pairOptions(all, right, label){
  for(;;){
    const wrong = shuffle(all.filter(p => p.join() !== right.join())).slice(0, 4), five = wrong.concat([right]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cnt = {}; five.forEach(p => p.forEach(x => { cnt[x] = (cnt[x] || 0) + 1; }));
    const score = p => p.reduce((s, x) => s + cnt[x], 0), mine = score(right), all5 = five.map(score);
    if(all5.filter(s => s === Math.max(...all5)).length === 1 && mine === Math.max(...all5)) continue;
    if(all5.filter(s => s === Math.min(...all5)).length === 1 && mine === Math.min(...all5)) continue;
    return { options: five.map((p, id) => ({ id, v: id, pair: p, text: [label(p, 0), label(p, 1)] })), pick: five.findIndex(p => p.join() === right.join()) };
  }
}
export function genGateMaze(){
  for(;;){
    const open = [];
    for(let r = 0; r < R; r++) for(let c = 0; c < C; c++){
      if(c < C - 1 && rnd(100) < 55) open.push((r * C + c) + '-' + (r * C + c + 1));
      if(r < R - 1 && rnd(100) < 55) open.push((r * C + c) + '-' + ((r + 1) * C + c));
    }
    const mouse = rnd(R * C), cheese = rnd(R * C);
    if(Math.abs(Math.floor(mouse / C) - Math.floor(cheese / C)) + Math.abs(mouse % C - cheese % C) < 5 || open.length < 24) continue;
    const gates = shuffle(open.slice()).slice(0, G), q = {kind:'gatemaze', open, gates, mouse, cheese};
    if(!gateReach(open, [], mouse).has(cheese)) continue;
    const cut = gatePairs(q);
    if(cut.length !== 1) continue;
    const all = [];
    for(let i = 1; i <= G; i++) for(let j = i + 1; j <= G; j++) all.push([i, j]);
    const o = pairOptions(all, cut[0], (p, uk) => p.join(uk ? ' і ' : ' и '));
    return Object.assign(q, o, {own: true, ans: o.pick, cut: cut[0]});
  }
}
const at = i => [4 + (i % C) * U, 4 + Math.floor(i / C) * U];
function maze(q, full){
  const W = C * U + 8, H = R * U + 8, shut = full ? q.cut.map(n => q.gates[n - 1]) : [], reach = gateReach(q.open, shut, q.mouse), gap = new Set(q.open.filter(e => !shut.includes(e)));
  let s = '';
  if(full) for(const i of reach){ const [x, y] = at(i); s += '<rect x="' + x + '" y="' + y + '" width="' + U + '" height="' + U + '" fill="var(--accentbg)"/>'; }
  let walls = '';
  for(let r = 0; r < R; r++) for(let c = 0; c < C; c++){
    const i = r * C + c, [x, y] = at(i);
    if(c < C - 1 && !gap.has(i + '-' + (i + 1))) walls += 'M' + (x + U) + ',' + y + ' v' + U + ' ';
    if(r < R - 1 && !gap.has(i + '-' + (i + C))) walls += 'M' + x + ',' + (y + U) + ' h' + U + ' ';
  }
  s += '<rect x="4" y="4" width="' + C * U + '" height="' + R * U + '" fill="none" stroke="var(--ink)" stroke-width="4"/><path d="' + walls + '" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" fill="none"/>';
  q.gates.forEach((e, k) => {
    const [a, b] = e.split('-').map(Number), [x, y] = at(a), horiz = b === a + 1, cx = horiz ? x + U : x + U / 2, cy = horiz ? y + U / 2 : y + U;
    const closed = shut.includes(e), col = closed ? 'var(--bad)' : 'var(--warm)', bar = horiz ? 'x1="' + cx + '" y1="' + (cy - 15) + '" x2="' + cx + '" y2="' + (cy + 15) + '"' : 'x1="' + (cx - 15) + '" y1="' + cy + '" x2="' + (cx + 15) + '" y2="' + cy + '"';
    s += '<g' + (closed ? popAt(1) : '') + '><line ' + bar + ' stroke="' + col + '" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="var(--warmbg)" stroke="' + col + '" stroke-width="2"/>' + svgText(cx, cy + 4.5, k + 1, 12, 'var(--warmink)') + '</g>';
  });
  const em = (i, t, size, dy) => { const [x, y] = at(i); return '<text x="' + (x + U / 2) + '" y="' + (y + U / 2 + dy) + '" text-anchor="middle" font-size="' + size + '" ' + SVG_FONT + '>' + t + '</text>\n'; };
  s += em(q.cheese, '🧀', 24, 8) + em(q.mouse, '🐭', 26, 9);
  return svgFrame('0 0 ' + W + ' ' + H, W, tr('лабиринт със стени, мишле, сирене и пет номерирани врати', 'лабіринт зі стінами, мишеня, сир і п’ятьма пронумерованими дверима')) + s + '</svg>';
}
function drawGateMaze(q){
  return '<div class="ask">' + tr('Кои две врати на лабиринта трябва да се затворят така, че мишлето Джери да не може да стигне до сиренцето?', 'Які двоє дверей лабіринту треба зачинити, щоб мишеня Джері не могло дістатися до сиру?') + '</div>' +
    '<div class="fig maze">' + maze(q, false) + '</div>';
}
const eqGate = q => tr('затваряме вратите ', 'зачиняємо двері ') + q.cut.join(tr(' и ', ' і '));
function whyGateMaze(q, full){
  if(!full) return tr('Върви с пръст от мишлето до сиренцето по всички пътища. Затвори две врати така, че нито един път да не остане: потърси две врати, през които минават всички пътища.',
    'Йди пальцем від мишеняти до сиру всіма шляхами. Зачини двоє дверей так, щоб не лишилося жодного шляху: пошукай двоє дверей, крізь які йдуть усі шляхи.');
  return tr('Затворени са вратите ' + q.cut.join(' и ') + ': мишлето стига само до оцветените стаи, а сиренцето не е сред тях.',
    'Зачинені двері ' + q.cut.join(' і ') + ': мишеня доходить лише до зафарбованих кімнат, а сиру серед них немає.') + maze(q, true);
}
KIND.gatemaze = { draw:drawGateMaze, eq:eqGate, why:whyGateMaze };
