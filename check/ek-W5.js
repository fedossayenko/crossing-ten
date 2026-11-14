// Runs beside the app (in check.js's own scope, through eval), like check/ek-P1.js.
// Европейско Кенгуру, 2 клас — picture tasks, wave 2, builder B5: 430 the gates of a maze (2019 #9), 431 the ring road (2023 #19), 432 the stops at the
// crossings (2023 #8), 433 the two gears (2021 #20), 434 the ribbon round a box (2024 #13). A paper's printed task is built as printed where its picture can be
// (the ring road, the maze's gates beside the cheese, the box) and held to the official key; where the paper's picture is a free drawing (the road, the gears)
// the level's own question is held to the paper's answer on an instance the generator draws. Then every generator is worked out again another way, from the
// picture it draws (its walls, lines, polygons and labels), not from the question's own fields.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 600)); };
  const num = a => a.map(Number);
  const taggedBy = (id, tag) => { if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag); };
  const asks = (name, id, kind) => { const hit = pinSeed(name, () => Q.raw(id), g => g.kind === kind ? 2 : 0); if(!hit) throw new Error(name + ': level ' + id + ' never asks ' + kind); return hit; };
  const drawn = (name, q, s) => { if(strip(Q.drawQ(q)).indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q))); };
  const parts = html => {
    const svg = String(html);
    return {
      texts: [...svg.matchAll(/<text[^>]*?\sx="([-\d.]+)" y="([-\d.]+)" text-anchor="(\w+)" font-size="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].map(m => ({ x: +m[1], y: +m[2], size: +m[4], t: m[5].trim() })),
      circles: [...svg.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)"[^>]*?fill="([^"]*)"/g)].map(m => ({ x: +m[1], y: +m[2], r: +m[3], fill: m[4] })),
      lines: [...svg.matchAll(/<line[^>]*?x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"[^>]*?stroke="([^"]*)"/g)].map(m => ({ p: num(m.slice(1, 5)), stroke: m[5] })),
      polys: [...svg.matchAll(/<polyline[^>]*?points="([^"]*)"/g)].map(m => m[1].trim().split(/\s+/).map(p => num(p.split(',')))),
      polygons: [...svg.matchAll(/<polygon points="([^"]*)"/g)].map(m => m[1].trim().split(/\s+/).map(p => num(p.split(',')))),
      paths: [...svg.matchAll(/<path d="([^"]*)" stroke="var\(--ink\)"/g)].map(m => m[1]),
    };
  };
  const segs = d => [...d.matchAll(/M([-\d.]+),([-\d.]+) ([hv])([-\d.]+)/g)].map(m => ({ x: +m[1], y: +m[2], dir: m[3], len: +m[4] }));
  const met = [], n = {}, count = k => n[k] = (n[k] || 0) + 1;
  // the pair-options guard, from the options' own text: the right pair's score is neither the only biggest nor the only smallest
  const voteOk = (pairs, right) => {
    const cnt = {}; pairs.forEach(p => p.forEach(x => { cnt[x] = (cnt[x] || 0) + 1; }));
    const sc = pairs.map(p => p.reduce((s, x) => s + cnt[x], 0)), mine = sc[right];
    return !(sc.filter(s => s === Math.max(...sc)).length === 1 && mine === Math.max(...sc)) && !(sc.filter(s => s === Math.min(...sc)).length === 1 && mine === Math.min(...sc));
  };

  // ---- 430: 2019 #9. A board where the cheese's room has two doors, gates 4 and 5, and the rest of the maze is open all round (gates 1–3 sit in loops):
  // the only pair that shuts the mouse out is 4 and 5, the paper's key E; the options as printed (1 и 2, 2 и 3, 3 и 4, 3 и 5, 4 и 5)
  {
    const name = 'Кенгуру 2019 task 9', C = 6, open = [];
    for(let r = 0; r < 5; r++) for(let c = 0; c < C; c++){
      const i = r * C + c;
      if(c < C - 1 && i + 1 !== 29 && i !== 29) open.push(i + '-' + (i + 1));
      if(r < 4 && i + C !== 29) open.push(i + '-' + (i + C));
    }
    open.push('23-29', '28-29');   // the cheese's room (4, 5): its two doors, the gates 4 and 5
    const g45 = ['23-29', '28-29'];
    const q = {kind:'gatemaze', open, gates:['0-1', '6-12', '14-15', g45[0], g45[1]], mouse: 0, cheese: 29};
    const pairs = [[1, 2], [2, 3], [3, 4], [3, 5], [4, 5]];
    q.options = pairs.map((p, id) => ({ id, v: id, pair: p, text: [p.join(' и '), p.join(' і ')] })); q.pick = 4; q.ans = 4; q.own = true; q.cut = [4, 5];
    const cut = Q.gatePairs(q);
    if(cut.length !== 1 || cut[0].join() !== '4,5') throw new Error(name + ': the level 430 solver finds the pairs ' + JSON.stringify(cut) + ' for the printed gates, the paper says only 4 and 5 (E)');
    if(Q.answers(q).join() !== '4' || !Q.accepts(q, ['4'])) throw new Error(name + ': the key E (4 и 5) is not the answer');
    drawn(name, q, 'Кои две врати на лабиринта трябва да се затворят така, че мишлето Джери да не може да стигне до сиренцето?');
    taggedBy(430, 'ek-2019-2');
    asks(name, 430, 'gatemaze');
    met.push('2019 #9 (430)');
  }
  // ---- 431: 2023 #19, A–B 7, B–C 2, C–D 6, D–E 4, E–A 5: only B and E are 12 km either way round (the key A, «B и E»)
  {
    const name = 'Кенгуру 2023 task 19', km = [7, 2, 6, 4, 5], names = ['A', 'B', 'C', 'D', 'E'], pairs = [[1, 4], [1, 3], [2, 4], [0, 2], [0, 3]];
    const eq = Q.loopEqual(km);
    if(eq.length !== 1 || eq[0].join() !== '1,4') throw new Error(name + ': the level 431 solver finds ' + JSON.stringify(eq) + ' for the printed ring, the paper says B and E');
    const q = {kind:'netloop', km, eq: eq[0], own: true, pick: 0, ans: 0, options: pairs.map((p, id) => ({ id, v: id, pair: p, text: [p.map(x => names[x]).join(' и '), p.map(x => names[x]).join(' і ')] }))};
    if(Q.answers(q).join() !== '0' || !Q.accepts(q, ['0']) || q.options[0].text[0] !== 'B и E') throw new Error(name + ': the key A (B и E) is not the answer');
    drawn(name, q, 'Само между две от селата разстоянията са едни и същи в двете посоки. Кои са тези две села?');
    taggedBy(431, 'ek-2023-2');
    asks(name, 431, 'netloop');
    met.push('2023 #19 (431)');
  }
  // ---- 432: 2023 #8, seven crossings drive past twice: 14 stops (the key E). The paper's road is a free drawing; the level's road is drawn on a grid, and a seed of
  // the level whose road has seven crossings is held to 14
  {
    const name = 'Кенгуру 2023 task 8', hit = pinSeed(name, () => Q.raw(432), g => g.K === 7 ? 2 : 0);
    if(!hit) throw new Error(name + ': level 432 never draws a road with seven crossings');
    if(Q.answers(hit.q).join() !== '14' || !Q.accepts(hit.q, ['14'])) throw new Error(name + ': a road with seven crossings gives ' + Q.answers(hit.q) + ', the paper says 14');
    drawn(name, hit.q, 'Стефан шофира от X към Y и спира на всяко кръстовище, след което продължава по права линия. Намерете броя на спиранията.');
    taggedBy(432, 'ek-2023-2');
    met.push('2023 #8 (432)');
  }
  // ---- 434: 2024 #13, 1 m high, 1 m wide, 2 m long, a 1 m bow: 4 + 6 + 1 = 11 m (the key B)
  {
    const name = 'Кенгуру 2024 task 13', q = {kind:'boxribbon', h:1, w:1, l:2, bow:1, traps:[10, 8], ans:11};
    if(Q.ribbonLen(1, 1, 2, 1) !== 11) throw new Error(name + ': the level 434 solver gives ' + Q.ribbonLen(1, 1, 2, 1) + ', the paper says 11');
    if(Q.answers(q).join() !== '11' || !Q.accepts(q, ['11'])) throw new Error(name + ': the key 11 is not the answer');
    drawn(name, q, 'Кутията с играчка в нея има размери: височина 1 метър, ширина 1 метър и дължина 2 метра. Тя е вързана с лента, както е показано. Колко е дълга лентата, ако за възела е използван 1 метър от нея?');
    taggedBy(434, 'ek-2024-2');
    asks(name, 434, 'boxribbon');
    met.push('2024 #13 (434)');
  }
  // ---- 433: 2021 #20. The paper does not say its tooth counts; the level's own question is held to the physics, a tooth at a time, below
  taggedBy(433, 'ek-2021-2');
  asks('Кенгуру 2021 task 20', 433, 'gears');
  met.push('2021 #20 (433, by simulation)');

  // ---- every generator again, from its drawn picture
  // 430: the walls, the gates, the mouse and the cheese read from the picture; every pair of gates tried by walking the maze
  for(let i = 1; i <= 1500; i++){
    const q = Q.seeded(i, () => Q.raw(430)), html = Q.drawQ(q), p = parts(html), U = 40, R = 5, C = 6;
    const closed = new Set();   // the wall between two rooms, as the drawn path has it
    segs(p.paths[0]).forEach(s => { const r = Math.round((s.y - 4) / U), c = Math.round((s.x - 4) / U); if(s.dir === 'v') closed.add((r * C + c - 1) + '-' + (r * C + c)); else closed.add(((r - 1) * C + c) + '-' + (r * C + c)); });
    const room = t => Math.floor((t.y - 4) / U) * C + Math.floor((t.x - 4) / U);
    const mouse = room(p.texts.find(t => t.t === '🐭')), cheese = room(p.texts.find(t => t.t === '🧀'));
    const gates = [];
    p.circles.filter(c => c.r === 9).forEach(c => {
      const t = p.texts.find(t => Math.abs(t.x - c.x) < .01 && Math.abs(t.y - 4.5 - c.y) < .01), k = +t.t, h = (c.x - 4) % U === 0;
      gates[k - 1] = h ? [Math.round((c.y - 4 - U / 2) / U) * C + (c.x - 4) / U - 1, Math.round((c.y - 4 - U / 2) / U) * C + (c.x - 4) / U] : [((c.y - 4) / U - 1) * C + Math.floor((c.x - 4) / U), ((c.y - 4) / U) * C + Math.floor((c.x - 4) / U)];
    });
    if(gates.length !== 5 || gates.some(g => !g || g[1] < 0) || new Set(gates.map(g => g.join())).size !== 5) fail('430: the gates in the picture are ' + JSON.stringify(gates), q);
    // a gate sits in a gap: no wall there
    gates.forEach(g => { if(closed.has(g.join('-'))) fail('430: a gate stands in a wall', q); });
    const walk = shut => {   // can the mouse reach the cheese, the gates in `shut` closed
      const seen = new Set([mouse]), todo = [mouse];
      while(todo.length){ const a = todo.pop(), r = Math.floor(a / C), c = a % C;
        [[r, c + 1], [r + 1, c], [r, c - 1], [r - 1, c]].forEach(([nr, nc]) => {
          if(nr < 0 || nr >= R || nc < 0 || nc >= C) return; const b = nr * C + nc, k = Math.min(a, b) + '-' + Math.max(a, b);
          if(!seen.has(b) && !closed.has(k) && !shut.includes(k)){ seen.add(b); todo.push(b); } }); }
      return seen.has(cheese);
    };
    const gk = gates.map(g => g.join('-')), cuts = [];
    if(!walk([])) fail('430: the mouse cannot reach the cheese at all', q);
    for(let a = 0; a < 5; a++) for(let b = a + 1; b < 5; b++) if(!walk([gk[a], gk[b]])) cuts.push([a + 1, b + 1]);
    // the options as drawn in the card: five different pairs, the picked one the only cut, and no vote on the numbers picks it out
    const pairs = q.options.map(o => o.text[0].split(' и ').map(Number));
    if(cuts.length !== 1 || q.options.length !== 5 || new Set(pairs.map(String)).size !== 5 || pairs[q.pick].join() !== cuts[0].join() || !voteOk(pairs, q.pick)) fail('430: the pairs that cut are ' + JSON.stringify(cuts), q);
    if(q.options.some(o => o.text[1] !== o.text[0].replace(' и ', ' і '))) fail('430: the uk options differ', q);
    count('gatemaze');
  }
  // 431: the roads' km read from the labels beside their lines, the two ways round summed for every pair of villages
  for(let i = 1; i <= 1500; i++){
    const q = Q.seeded(i, () => Q.raw(431)), p = parts(Q.drawQ(q));
    const dots = p.circles.filter(c => c.fill === 'var(--ink)' || c.fill === 'var(--accent)'), near = (x, y) => dots.reduce((b, d, k) => Math.hypot(d.x - x, d.y - y) < Math.hypot(dots[b].x - x, dots[b].y - y) ? k : b, 0);
    const labels = p.texts.filter(t => t.size === 13), names = p.texts.filter(t => t.size === 16);
    if(dots.length !== 5 || labels.length !== 5 || p.lines.length !== 5) fail('431: not five villages and roads', q);
    const nameOf = k => names.reduce((b, t) => Math.hypot(t.x - dots[k].x, t.y - dots[k].y) < Math.hypot(b.x - dots[k].x, b.y - dots[k].y) ? t : b).t;
    const roads = p.lines.map(({ p: [x1, y1, x2, y2] }) => { const t = labels.reduce((b, t) => Math.hypot(t.x - (x1 + x2) / 2, t.y - 5 - (y1 + y2) / 2) < Math.hypot(b.x - (x1 + x2) / 2, b.y - 5 - (y1 + y2) / 2) ? t : b); return [near(x1, y1), near(x2, y2), +t.t]; });
    // the ring: shortest ways between every pair, going each of the two ways (a walk round the ring, no road twice)
    const eqPairs = [];
    for(let a = 0; a < 5; a++) for(let b = a + 1; b < 5; b++){
      const ways = [];
      const go = (at, km, used) => { if(at === b){ ways.push(km); return; } roads.forEach(([x, y, w], k) => { if(used.has(k)) return; const to = x === at ? y : y === at ? x : -1; if(to >= 0) go(to, km + w, new Set(used).add(k)); }); };
      go(a, 0, new Set());
      if(ways.length === 2 && ways[0] === ways[1]) eqPairs.push([nameOf(a), nameOf(b)].sort().join(' и '));
    }
    if(eqPairs.length !== 1 || q.options[q.pick].text[0] !== eqPairs[0] || new Set(q.options.map(o => o.text[0])).size !== 5) fail('431: the pairs equal both ways are ' + eqPairs, q);
    if(!voteOk(q.options.map(o => o.pair), q.pick)) fail('431: a vote picks the answer', q);
    count('netloop');
  }
  // 432: the road read from its polyline, its crossings found as segment pairs, then the road driven point by point
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(432)), p = parts(Q.drawQ(q)), pts = p.polys[0].map(([x, y]) => [Math.round((x - 26) / 34), Math.round((y - 30) / 34)]);
    // (a) crossings as pairs of segments that cross in the middle of both
    let cross = 0;
    for(let a = 0; a < pts.length - 1; a++) for(let b = a + 2; b < pts.length - 1; b++){
      const [A1, A2, B1, B2] = [pts[a], pts[a + 1], pts[b], pts[b + 1]], ah = A1[1] === A2[1], bh = B1[1] === B2[1];
      if(ah === bh) continue;
      const [H1, H2, V1, V2] = ah ? [A1, A2, B1, B2] : [B1, B2, A1, A2];
      if(V1[0] > Math.min(H1[0], H2[0]) && V1[0] < Math.max(H1[0], H2[0]) && H1[1] > Math.min(V1[1], V2[1]) && H1[1] < Math.max(V1[1], V2[1])) cross++;
    }
    // (b) the car, one grid step at a time: how often it passes straight through a point it passes twice
    const walk = [pts[0]];
    for(let k = 1; k < pts.length; k++){ let [x, y] = pts[k - 1]; const dx = Math.sign(pts[k][0] - x), dy = Math.sign(pts[k][1] - y); while(x !== pts[k][0] || y !== pts[k][1]){ x += dx; y += dy; walk.push([x, y]); } }
    const visits = {}; walk.forEach(([x, y]) => { visits[x + ',' + y] = (visits[x + ',' + y] || 0) + 1; });
    const stops = walk.filter(([x, y]) => visits[x + ',' + y] === 2).length, dots = p.circles.filter(c => c.fill === 'var(--bad)');
    const t = strip(Q.drawQ(q));
    if(Object.values(visits).some(v => v > 2) || cross < 4 || cross !== dots.length || stops !== 2 * cross || stops !== q.ans || q.traps[0] === q.ans || !/Намеретеброянаспиранията/.test(t)) fail('432: ' + cross + ' crossings, ' + stops + ' stops, ' + dots.length + ' dots', q);
    count('roadstops');
  }
  // 433: the teeth counted from the polygons, the small gear driven round tooth by tooth, the options' turns read from the picture
  for(let i = 1; i <= 1500; i++){
    const q = Q.seeded(i, () => Q.raw(433)), html = Q.drawQ(q), p = parts(html);
    const N = p.polygons[0].length / 4, k = p.polygons[2].length / 4;   // big body, big black tooth, small body, small black tooth
    // drive the small gear: one tooth of it at the contact pushes one tooth of the big the other way; after k teeth (one turn) the big gear has gone k teeth
    let big = 0; for(let step = 0; step < k; step++) big -= 1;
    const want = (((big * 360 / N) % 360) + 360) % 360, angles = q.options.map(o => { const m = o.text[0].match(/rotate\(([-\d.]+) 0 0\)/); return ((+m[1] % 360) + 360) % 360; });
    const hits = angles.map((a, j) => Math.min(Math.abs(a - want), 360 - Math.abs(a - want)) < .02 ? j : -1).filter(j => j >= 0);
    if(N < k + 3 || k * 2 === N || hits.length !== 1 || hits[0] !== q.pick || new Set(angles.map(a => a.toFixed(2))).size !== 5) fail('433: ' + k + ' and ' + N + ' teeth, the turn ' + want + ' in ' + angles, q);
    if(new Set(q.options.map(o => o.text[0].match(/aria-label="([^"]*)"/)[1])).size !== 5) fail('433: two options read the same', q);
    count('gears');
  }
  // 434: the sizes and the loops read from the labels and the red ribbon lines, the length added up from the picture
  for(let i = 1; i <= 1500; i++){
    const q = Q.seeded(i, () => Q.raw(434)), html = Q.drawQ(q), p = parts(html), red = p.lines.filter(l => l.stroke === 'var(--bad)'), lab = p.texts.filter(t => /^\d м$/.test(t.t));
    const S = 46, front = red.find(l => l.p[0] === l.p[2] && l.p[1] !== l.p[3]), top = red.find(l => l.p[1] === l.p[3] && l.p[0] !== l.p[2]);
    const height = Math.round(Math.abs(front.p[3] - front.p[1]) / S), length = Math.round(Math.abs(top.p[2] - top.p[0]) / S);
    const sides = lab.map(t => +t.t[0]).sort().join(), want = [q.l, q.h, q.w].sort().join();
    const loopA = 2 * (height + q.w), loopB = 2 * (height + length), t = strip(html), bow = +t.match(/възелаеизползван(\d)мет(?:ър|ра)/)[1];
    if(red.length !== 4 || height !== q.h || length !== q.l || sides !== want || loopA + loopB + bow !== q.ans || q.traps.includes(q.ans)) fail('434: the picture gives ' + (loopA + loopB + bow), q);
    count('boxribbon');
  }
  console.log('Кенгуру 2 клас, picture tasks, wave 2 (430–434): ' + met.join(', ') + ' match the official key and are asked by their levels; each generator worked out again from its own drawn picture: ' + Object.entries(n).map(([k, v]) => v + ' ' + k).join(', '));
}
