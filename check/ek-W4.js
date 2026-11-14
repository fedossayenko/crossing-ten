// Runs beside the app (in check.js's own scope, through eval), like check/ek-P4.js.
// Европейско Кенгуру, 2 клас — views of cubes and pieces cut or fitted, builder B4: 420 the row seen from above (2023 #2), 421 the glass box
// (2024 #17), 422 the bars of two cubes (2024 #9), 423 three pieces in the puzzle (2023 #16), 424 the unused piece (2021 #17), 425 the cut
// piece (2019 #4). Every picture answer is read back from the drawn SVG (cubes by their faces' corners, pieces by their squares and the shape
// in each) and worked out here another way; exactly one option is right and no two are alike. The printed 2023 #2, 2023 #16, 2021 #17 and
// 2019 #4 are pinned as printed (the last three as an instance solved by the same functions the generators use, since their pictures are drawn
// afresh); 2024 #17 and 2024 #9 are the same question on a building of the generator's, as the printed buildings cannot be read to the last cube.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const svgs = h => String(h).match(/<svg[\s\S]*?<\/svg>/g) || [];
  const num = s => +s;
  const tagged = (id, tags) => tags.forEach(t => { if(!Q.LEVELS.find(l => l.id === id).papers.includes(t)) throw new Error('level ' + id + ' is not tagged ' + t); });
  const only = (what, opts, ok) => { const hit = opts.filter(ok); if(hit.length !== 1) fail(what + ': ' + hit.length + ' of the options match', opts.map(o => o.id)); return hit[0]; };
  const text = q => strip(Q.drawQ(q));
  const pinAs = (name, id, ok, shows) => {
    const hit = pinSeed(name, () => Q.raw(id), g => ok(g) ? 2 : 0, 3e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    shows.forEach(s => { if(text(hit.q).indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + text(hit.q)); });
    return hit.q;
  };
  const S = 30;   // the cubes' edge in the pictures of 420 and 421

  // ---- the cubes read back: each <g> is a cube, its first polygon the top face, whose first corner is iso(x, y, z + 1) moved by the picture's offset
  const cubesOf = svg => [...svg.matchAll(/<g>(<polygon[\s\S]*?)<\/g>/g)].map(m => {
    const poly = m[1].match(/<polygon points="([^"]*)" fill="([^"]*)"/), p = poly[1].split(' ')[0].split(',').map(Number);
    return { px: p[0], py: p[1], fill: poly[2], lines: (m[1].match(/<line /g) || []).length };
  });
  const iso = (s, x, y, z) => [(x - y)*s*0.866, (x + y)*s/2 - z*s];
  // ---- 420: the top of each column, read from the picture; the row of squares of an option, read from its rects
  const topsDrawn = svg => {
    const cs = cubesOf(svg), x0 = Math.min(...cs.map(c => c.px)), cols = {};
    cs.forEach(c => { const x = Math.round((c.px - x0)/(S*0.866)); if(!cols[x] || c.py < cols[x].py) cols[x] = c; });   // a cube higher on the page is higher in the stack
    return Object.keys(cols).sort((a, b) => a - b).map(x => cols[x].lines ? 'h' : cols[x].fill === 'var(--fur)' ? 'g' : 'w');
  };
  const rowRead = svg => [...svg.matchAll(/<rect [^>]*fill="([^"]*)"[^>]*\/>(<path)?/g)].map(m => m[2] ? 'h' : m[1] === 'var(--fur)' ? 'g' : 'w');
  for(let i = 1; i <= 1000; i++){
    const q = Q.seeded(i, () => Q.raw(420)), cs = cubesOf(svgs(Q.drawQ(q))[0]);
    if(cs.length !== q.n || cs.filter(c => c.fill === 'var(--fur)').length !== 1 || cs.filter(c => c.lines).length !== 1 || cs.filter(c => !c.lines && c.fill === 'var(--paper)').length !== q.n - 2) fail('420: the cubes drawn are not 1 grey, 1 hatched and the rest white', q);
    const tops = topsDrawn(svgs(Q.drawQ(q))[0]);
    if(tops.join() !== q.tops.join() || tops.every(t => t === 'w')) fail('420: the tops read from the picture are not the model\'s', q);
    const mine = only('420', q.options, o => rowRead(o.text[0]).join() === tops.join());
    if(mine.id !== q.pick || new Set(q.options.map(o => rowRead(o.text[0]).join())).size !== 5 || q.options.some(o => o.text[0] !== o.text[1])) fail('420: the picked option is not the top view, or options repeat', q);
    if(q.options.some(o => rowRead(o.text[0]).filter(c => c === 'g').length > 1 || rowRead(o.text[0]).filter(c => c === 'h').length > 1 || rowRead(o.text[0]).length !== q.cols)) fail('420: an option has other cubes than the building', q);
  }
  {   // printed 2023 #2: a row of three, the two end columns of two, grey on top at the left and hatched on top at the right; key B: grey, white, hatched
    const q = pinAs('Кенгуру 2023 task 2', 420, g => g.cols === 3 && g.heights.join() === '2,1,2' && g.tops.join() === 'g,w,h', ['Показани са 5 кубчета, гледани отстрани', 'Три от кубчетата са бели, едното е сиво и едното е защриховано', 'Как изглеждат кубчетата, гледани отгоре от високо?']);
    if(rowRead(q.options[q.pick].text[0]).join() !== 'g,w,h') throw new Error('Кенгуру 2023 task 2: the right option is not grey, white, hatched (B)');
    tagged(420, ['ek-2023-2']);
  }

  // ---- 421: the cubes drawn are the projection of the model; the plan is worked out from the model; every option read from its squares
  const planRead = svg => [...svg.matchAll(/<rect [^>]*fill="([^"]*)"/g)].map(m => m[1] === 'var(--lemon)' ? 1 : 0).join('');
  for(let i = 1; i <= 400; i++){
    const q = Q.seeded(i, () => Q.raw(421)), sv = svgs(Q.drawQ(q))[0], dot = sv.match(/<circle cx="([\d.]+)" cy="([\d.]+)" r="4.2"/), cs = cubesOf(sv);
    if(!dot || cs.length !== 6 || q.cells.length !== 6) fail('421: the dot or the six cubes are not drawn', q);
    // every drawn cube is where its model cube lands, measured from the dot at the far bottom corner (0, 0, 0)
    const drawn = cs.map(c => [c.px - +dot[1], c.py - +dot[2]]), want = q.cells.map(c => iso(S, c.x, c.y, c.z + 1));
    if(want.some(w => drawn.filter(d => Math.abs(d[0] - w[0]) < 0.25 && Math.abs(d[1] - w[1]) < 0.25).length !== 1)) fail('421: the cubes drawn are not the model\'s projection', q);
    // the plan from the model, by columns
    const plan = [0, 1, 2].map(y => [0, 1, 2].map(x => q.cells.some(c => c.x === x && c.y === y) ? 1 : 0).join('')).join('');
    const mine = only('421', q.options, o => planRead(o.text[0]) === plan);
    if(mine.id !== q.pick || new Set(q.options.map(o => planRead(o.text[0]))).size !== 5) fail('421: the picked option is not the plan, or options repeat', q);
    // the drawing leaves one plan: every placement of the drawn cubes along their lines of sight, none floating, gives this plan
    const spots = cs.map(c => { const a = (c.px - +dot[1])/(S*0.866), b = (c.py - +dot[2])/(S/2); const o = []; for(let z = 0; z < 3; z++) for(let y = 0; y < 3; y++) for(let x = 0; x < 3; x++) if(Math.abs(x - y - a) < 0.05 && Math.abs(x + y - 2*(z + 1) - b) < 0.05) o.push([x, y, z]); return o; });
    const found = new Set(), put = [];
    (function go(k){ if(k === 6){ if(put.every(([x, y, z]) => !z || put.some(p => p[0] === x && p[1] === y && p[2] === z - 1))) found.add([0, 1, 2].map(y => [0, 1, 2].map(x => put.some(p => p[0] === x && p[1] === y) ? 1 : 0).join('')).join('')); return; }
      for(const p of spots[k]){ if(put.some(o => o.join() === p.join())) continue; put.push(p); go(k + 1); put.pop(); } })(0);
    if(found.size !== 1 || !found.has(plan)) fail('421: the picture does not fix the plan: ' + [...found], q);
    // a wrong option is never the true plan turned or flipped by mistake without differing: all five distinct was checked above; the box must show its dot
    if(q.options.some(o => !/<circle cx="2" cy="2" r="4.2"/.test(o.text[0]))) fail('421: an option lacks the dot at the top left', q);
  }
  {   // the printed glass box (6 cubes, key E) cannot be read to the last cube: same question, another box
    const q = Q.seeded(1, () => Q.raw(421));
    if(text(q).indexOf('В стъклената кутия вдясно са поставени 6 кубчета.'.replace(/\s+/g, '')) < 0 || text(q).indexOf('Как изглежда снимка на кутията, направена отгоре?'.replace(/\s+/g, '')) < 0) throw new Error('2024 task 17 is not worded as printed');
    tagged(421, ['ek-2024-2']);
  }

  // ---- 422: a perfect matching of the cubes' touching graph (Kuhn's augmenting paths, another way than the generator's search) is a tiling by bars
  const matches = cells => {
    const id = c => c.x + ',' + c.y + ',' + c.z, adj = new Map(cells.map(c => [id(c), cells.filter(o => Math.abs(o.x - c.x) + Math.abs(o.y - c.y) + Math.abs(o.z - c.z) === 1).map(id)]));
    const even = cells.filter(c => (c.x + c.y + c.z) % 2 === 0).map(id), mate = new Map();
    const aug = (u, seen) => { for(const v of adj.get(u)){ if(seen.has(v)) continue; seen.add(v); if(!mate.has(v) || aug(mate.get(v), seen)){ mate.set(v, u); return true; } } return false; };
    return even.length*2 === cells.length && even.every(u => aug(u, new Set()));
  };
  const projOf = (svg) => cubesOf(svg).map(c => [Math.round(c.px*10)/10, Math.round(c.py*10)/10]);
  for(let i = 1; i <= 300; i++){
    const q = Q.seeded(i, () => Q.raw(422)), no = q.solids.map(s => !matches(s));
    if(no.filter(Boolean).length !== 1 || !no[q.pick]) fail('422: not exactly the picked composition fails to split into four bars: ' + no, q);
    if(Q.barsFit(q.solids[q.pick], true)) fail('422: the odd composition splits too when cubes that only look stuck are taken as stuck', q);
    if(q.solids.some(s => s.length !== 8 || Q.lookAlikes(s) > 2) || new Set(q.solids.map(Q.solidName)).size !== 5) fail('422: a composition is not 8 distinct readable cubes', q);
    // the drawing is the model: the same number of cubes, each top face where the model puts it (up to a move of the whole picture)
    q.options.forEach((o, k) => {
      const d = projOf(o.text[0]), m = q.solids[k].map(c => iso(20, c.x, c.y, c.z + 1));
      const ox = Math.min(...d.map(p => p[0])) - Math.min(...m.map(p => p[0])), oy = Math.min(...d.map(p => p[1])) - Math.min(...m.map(p => p[1]));
      const a = d.map(p => [p[0] - ox, p[1] - oy]), good = m.every(w => a.filter(p => Math.abs(p[0] - w[0]) < 0.3 && Math.abs(p[1] - w[1]) < 0.3).length === 1);
      if(d.length !== 8 || !good) fail('422: option ' + k + ' is not the model drawn', q);
    });
    if(q.options.some(o => o.text[0] !== o.text[1])) fail('422: the two languages draw different options', q);
  }
  { const q = Q.seeded(1, () => Q.raw(422)); if(text(q).indexOf('Коя от композициите НЕ може да се сглоби с тях?'.replace(/\s+/g, '')) < 0) throw new Error('2024 task 9 is not worded as asked'); tagged(422, ['ek-2024-2']); }

  // ---- shared: squares read back, and the shape in each from the first corner of its polygon (or a circle)
  const glyphOf = (cx, cy, r, frag) => {
    if(/^<circle/.test(frag)) return 'circle';
    const pts = frag.match(/points="([^"]*)"/)[1].split(' ').map(p => p.split(',').map(Number)), [a, b] = [(pts[0][0] - cx)/r, (pts[0][1] - cy)/r];
    const n = pts.length, near = (x, y) => Math.abs(a - x) < 0.06 && Math.abs(b - y) < 0.06;
    if(n === 10) return 'star';
    if(n === 4) return near(0, -1) ? 'diamond' : 'square';
    if(n === 3) return near(0, -1) ? 'up' : near(0, 1) ? 'down' : near(-1, 0) ? 'left' : 'right';
    return near(-1, -0.35) ? 'arrowR' : near(1, -0.35) ? 'arrowL' : near(-0.35, -1) ? 'arrowD' : 'arrowU';
  };
  const symCells = svg => [...svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="\d+" fill="var\(--solid\)"[^>]*\/>(<circle[^>]*\/>|<polygon[^>]*\/>)/g)].map(m => {
    const u = +m[3] + 2, x = (+m[1] - 1)/u, y = (+m[2] - 1)/u;
    return [x, y, glyphOf(x*u + u/2, y*u + u/2, u*0.31, m[4])];
  });

  // ---- 423: pieces read back from their squares; every option tried by placing its three pieces, in every order and turn, on the empty squares
  const pcs = h => svgs(h).map(v => [...v.matchAll(/<rect x="(\d+)" y="(\d+)"/g)].map(m => [(+m[1] - 1)/13, (+m[2] - 1)/13]));
  const norm = c => { const a = Math.min(...c.map(p => p[0])), b = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => [x - a, y - b]); };
  const turnsOf = (c, flipped) => { const r = []; for(const f of flipped ? [1, -1] : [1]){ let t = norm(c.map(([x, y]) => [f*x, y])); for(let k = 0; k < 4; k++){ r.push(t); t = norm(t.map(([x, y]) => [-y, x])); } } return r; };
  const fills = (empty, ps, flipped) => {
    const E = new Set(empty), go = (k, used) => {
      if(k === ps.length) return used.size === E.size;
      for(const t of turnsOf(ps[k], flipped)) for(let ox = -4; ox < 8; ox++) for(let oy = -4; oy < 8; oy++){
        const at = t.map(([x, y]) => (x + ox) + ',' + (y + oy));
        if(!at.every(c => E.has(c) && !used.has(c))) continue;
        const next = new Set(used); at.forEach(c => next.add(c));
        if(go(k + 1, next)) return true;
      }
      return false;
    };
    return go(0, new Set());
  };
  const emptyOf = svg => [...svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="28" height="28" fill="var\(--paper\)"/g)].map(m => ((+m[1] - 2)/28) + ',' + ((+m[2] - 2)/28));
  for(let i = 1; i <= 300; i++){
    const q = Q.seeded(i, () => Q.raw(423)), empty = emptyOf(svgs(Q.drawQ(q))[0]);
    if(empty.slice().sort().join() !== q.empty.join() || empty.length !== 10) fail('423: the board drawn has other empty squares than the generator holds', q);
    const sets = q.options.map(o => pcs(o.text[0].replace(/aria-hidden="true"/g, '')));
    if(sets.some(s => s.length !== 3)) fail('423: an option is not three pieces', q);
    const ok = sets.map(s => fills(empty, s, false)), okFlip = sets.map(s => fills(empty, s, true));
    if(ok.filter(Boolean).length !== 1 || !ok[q.pick]) fail('423: not exactly the picked set fills the empty squares: ' + ok, q);
    if(okFlip.filter(Boolean).length !== 1) fail('423: a wrong set fills them when flipped: ' + okFlip, q);
    const keys = sets.map(s => s.map(p => turnsOf(p, false).map(t => t.map(c => c.join()).sort().join(';')).sort()[0]).sort().join('|'));
    if(new Set(keys).size !== 5 || q.options.some(o => o.text[0] !== o.text[1])) fail('423: two options are one set, or the languages differ', q);
    if(!sets.some((s, k) => k !== q.pick && s.reduce((n, p) => n + p.length, 0) === 10) && sets.filter(s => s.reduce((n, p) => n + p.length, 0) === 10).length < 2) fail('423: no wrong set adds up to the empty squares', q);
  }
  {   // printed 2023 #16: empty squares of the 4 × 4, and the five sets read from the paper; only A (4 + 3 + 3 squares) fills them, with turning and no flipping
    const T = [[0, 0], [1, 0], [2, 0], [1, 1]], I3 = [[0, 0], [0, 1], [0, 2]], L3 = [[1, 0], [0, 1], [1, 1]], L4 = [[0, 0], [0, 1], [0, 2], [1, 2]], M = [[0, 0]];
    const empty = []; for(let y = 0; y < 4; y++) for(let x = 0; x < 4; x++) if(![[1, 0], [2, 0], [3, 0], [3, 2], [2, 3], [3, 3]].some(p => p[0] === x && p[1] === y)) empty.push(x + ',' + y);
    const sets = [[T, I3, L3], [T, L4, I3], [T, L4, L3], [M, I3, L3], [T, L4, M]];
    const fit = sets.map(s => fills(empty, s, false)), fitF = sets.map(s => fills(empty, s, true));
    if(empty.length !== 10 || fit.join() !== 'true,false,false,false,false' || fitF.join() !== 'true,false,false,false,false') throw new Error('Кенгуру 2023 task 16: the printed sets do not give the key A (only A fills the 10 squares): ' + fit + ' / ' + fitF);
    pinAs('Кенгуру 2023 task 16', 423, g => true, ['С кои 3 части е възможно попълване без застъпване на празните квадратчета от пъзела?']);
    tagged(423, ['ek-2023-2']);
    // the generator's own solver agrees on the printed instance
    const names = sets.map(s => Q.piecesFill(new Set(empty), s, false));
    if(names.join() !== 'true,false,false,false,false') throw new Error('Кенгуру 2023 task 16: the generator\'s solver does not give A');
  }

  // ---- 424: squares and pieces read back; each piece left out in turn, the other four placed in every order, turn and place (arrows turn with the piece)
  const SPIN = { arrowR: 'arrowD', arrowD: 'arrowL', arrowL: 'arrowU', arrowU: 'arrowR' };
  const spinP = c => { const t = c.map(([x, y, k]) => [-y, x, SPIN[k] || k]), a = Math.min(...t.map(p => p[0])), b = Math.min(...t.map(p => p[1])); return t.map(([x, y, k]) => [x - a, y - b, k]); };
  const tile4 = (gridMap, ps) => {
    const go = (used, left) => {
      if(!left.size) return true;
      const [first] = [...left].sort((a, b) => a.split(',')[1] - b.split(',')[1] || a.split(',')[0] - b.split(',')[0]);
      for(let i = 0; i < ps.length; i++){
        if(used.includes(i)) continue;
        let t = ps[i];
        for(let k = 0; k < 4; k++, t = spinP(t)) for(let a = 0; a < t.length; a++){   // any square of the piece on the first empty one
          const [fx, fy] = first.split(',').map(Number), at = t.map(([x, y, s]) => [x - t[a][0] + fx, y - t[a][1] + fy, s]);
          if(!at.every(([x, y, s]) => left.has(x + ',' + y) && gridMap.get(x + ',' + y) === s)) continue;
          const rest = new Set(left); at.forEach(([x, y]) => rest.delete(x + ',' + y));
          if(go(used.concat([i]), rest)) return true;
        }
      }
      return false;
    };
    return ps.reduce((n, p) => n + p.length, 0) === gridMap.size && go([], new Set(gridMap.keys()));
  };
  for(let i = 1; i <= 300; i++){
    const q = Q.seeded(i, () => Q.raw(424)), g = new Map(symCells(svgs(Q.drawQ(q))[0]).map(([x, y, s]) => [x + ',' + y, s]));
    if(g.size !== 16 || [...g].some(([k, s]) => q.grid.find(e => e[0] === k)[1] !== s)) fail('424: the square read from the picture is not the generator\'s', q);
    const ps = q.options.map(o => symCells(o.text[0]));
    if(ps.length !== 5 || ps.some(p => !p.length)) fail('424: five pieces expected', q);
    const ok = ps.map((p, k) => tile4(g, ps.filter((_, j) => j !== k)));
    if(ok.filter(Boolean).length !== 1 || !ok[q.pick]) fail('424: not exactly the picked piece is the one left out: ' + ok, q);
    if(new Set(ps.map(p => p.map(c => c.join()).sort().join(';'))).size !== 5) fail('424: two pieces are alike', q);
  }
  {   // printed 2021 #17: the 4 × 4 square and the five pieces; D is the only one that can be left out (the pieces are turned, E's three arrows down lie as three arrows pointing right)
    const G = [['star', 'star', 'diamond', 'arrowR'], ['star', 'diamond', 'diamond', 'arrowR'], ['star', 'circle', 'diamond', 'arrowR'], ['star', 'circle', 'circle', 'circle']];
    const grid = new Map(); G.forEach((r, y) => r.forEach((s, x) => grid.set(x + ',' + y, s)));
    const P = [[[0, 0, 'diamond'], [1, 0, 'diamond']]];
    const A = [[0, 0, 'star'], [1, 0, 'diamond'], [0, 1, 'star'], [1, 1, 'star']], B = [[1, 0, 'diamond'], [1, 1, 'diamond'], [0, 2, 'circle'], [1, 2, 'diamond']], C = [[0, 0, 'star'], [1, 0, 'star'], [0, 1, 'circle']],
      D = [[0, 0, 'star'], [1, 0, 'diamond'], [2, 0, 'diamond'], [2, 1, 'diamond']], E = [[0, 0, 'circle'], [0, 1, 'circle'], [1, 1, 'arrowD'], [2, 1, 'arrowD'], [3, 1, 'arrowD']];
    const all = [A, B, C, D, E], ok = all.map((p, k) => tile4(grid, all.filter((_, j) => j !== k))), ok2 = all.map((p, k) => Q.piecesTile(grid, all.filter((_, j) => j !== k)));
    if(ok.join() !== 'false,false,false,true,false' || ok2.join() !== ok.join()) throw new Error('Кенгуру 2021 task 17: the printed pieces do not leave out D only: ' + ok + ' / ' + ok2);
    pinAs('Кенгуру 2021 task 17', 424, g => true, ['Коя част не е използвана?']);
    tagged(424, ['ek-2021-2']);
  }

  // ---- 425: the figure and each option read back; an option is right when its two shapes are neighbours in that order (side by side, or one above the other) somewhere in the figure
  const near = (g, [a, b], vertical) => { for(const [x, y, s] of g) if(s === a && g.some(([x2, y2, s2]) => s2 === b && x2 === x + (vertical ? 0 : 1) && y2 === y + (vertical ? 1 : 0))) return true; return false; };
  for(let i = 1; i <= 1000; i++){
    const q = Q.seeded(i, () => Q.raw(425)), sv = svgs(Q.drawQ(q))[0], fig = symCells(sv);
    if(fig.length !== 9 || fig.some(([x, y, s]) => q.g[y][x] !== s)) fail('425: the figure read from the picture is not the generator\'s', q);
    const vertical = /едно над друго/.test(Q.drawQ(q));
    if(vertical !== q.vertical) fail('425: the words say another direction than the piece', q);
    const opts = q.options.map(o => { const c = symCells(o.text[0]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); if(c.length !== 2 || (vertical ? c[0][0] !== c[1][0] : c[0][1] !== c[1][1])) fail('425: an option is not two squares in the asked direction', q); return [c[0][2], c[1][2]]; });
    const hit = opts.map(p => near(fig, p, vertical));
    if(hit.filter(Boolean).length !== 1 || !hit[q.pick] || new Set(opts.map(p => p.join())).size !== 5) fail('425: not exactly the picked piece lies in the figure: ' + hit, q);
  }
  {   // printed 2019 #4: ▲ ● ■ / ▲ ★ ● / ◆ ■ ●, side by side: only E (■ ●) is a piece of it; B has a triangle pointing down, C one pointing left, A and D are not neighbours
    const g = [['up', 'circle', 'square'], ['up', 'star', 'circle'], ['diamond', 'square', 'circle']], cells = []; g.forEach((r, y) => r.forEach((s, x) => cells.push([x, y, s])));
    const opts = [['up', 'square'], ['down', 'circle'], ['star', 'left'], ['star', 'diamond'], ['square', 'circle']];
    const hit = opts.map(p => near(cells, p, false)), hit2 = opts.map(p => Q.pairIn(g, p, false));
    if(hit.join() !== 'false,false,false,false,true' || hit2.join() !== hit.join()) throw new Error('Кенгуру 2019 task 4: the printed options do not give the key E: ' + hit + ' / ' + hit2);
    pinAs('Кенгуру 2019 task 4', 425, g2 => true, ['От показаната фигура е отрязано парче от две квадратчета']);
    tagged(425, ['ek-2019-2']);
  }
  console.log('Кенгуру 2 клас, views of cubes and pieces (420–425): 2023 #2 pinned as printed (key B read from the drawing), 2023 #16, 2021 #17, 2019 #4 solved as printed (keys A, D, E); 2024 #17 and 2024 #9 worded as printed on a building of the generator\'s; ' +
    'every picture read back from its SVG and solved another way (the cubes\' tops, the plan with every placement along the lines of sight, a perfect matching for the bars, every set of pieces in every order and turn, every piece left out, every neighbouring pair): exactly one option right, no two alike');
}
