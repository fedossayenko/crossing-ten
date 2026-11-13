// Runs beside the app (in check.js's own scope, through eval), like check/ek-A.js.
// Европейско Кенгуру, 2 клас — routes and mazes, builder P1: 350 the longest path (2021 #3, 2025 #4), 351 the cat's ways (2019 #13), 352 the cheapest way
// across white and grey squares (2024 #22), 353 the dog and the bones (2026 #3), 354 rooms with sums (2024 #12), 355 the biggest sum through the rooms
// (2022 #20), 356 the shortest road (2023 #26). A printed task is built as printed (the picture's own structure), answered by the level's own solver
// and held to the paper's official key; the level must ask that kind, tag the paper and draw the printed words. Then every generator is worked out again
// another way, from the drawn picture itself (its lines, rectangles and labels), not from the question's fields.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const num = a => a.map(Number);
  // what the picture of a question draws: its texts, its rectangles, its lines, its circles, the polylines, and the d of its paths
  const parts = html => {
    const svg = String(html);
    return {
      texts: [...svg.matchAll(/<text[^>]*?\sx="([-\d.]+)" y="([-\d.]+)" text-anchor="middle" font-size="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].map(m => ({ x: +m[1], y: +m[2], size: +m[3], t: m[4].trim() })),
      rects: [...svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"[^>]*fill="([^"]*)"/g)].map(m => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4], fill: m[5] })),
      lines: [...svg.matchAll(/<line[^>]*?x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"/g)].map(m => num(m.slice(1))),
      circles: [...svg.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)"/g)].map(m => num(m.slice(1))),
      polys: [...svg.matchAll(/<polyline[^>]*?points="([^"]*)"/g)].map(m => m[1].trim().split(/\s+/).map(p => num(p.split(',')))),
      paths: [...svg.matchAll(/<path d="([^"]*)" stroke="var\(--ink\)"/g)].map(m => m[1]),
    };
  };
  const segs = d => [...d.matchAll(/M([-\d.]+),([-\d.]+) ([hv])([-\d.]+)/g)].map(m => ({ x: +m[1], y: +m[2], dir: m[3], len: +m[4] }));
  const taggedBy = (id, tag) => { if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag); };
  // the level must ask this kind (and shape) from some seed
  const asks = (name, id, kind, shape) => { if(!pinSeed(name, () => Q.raw(id), g => g.kind === kind && (shape === undefined || g.shape === shape) ? 2 : 0)) throw new Error(name + ': level ' + id + ' never asks ' + kind); };
  const drawn = (name, q, s) => { if(strip(Q.drawQ(q)).indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q))); };
  const met = [];

  // ---- 351: 2019 #13, a 3 × 3 board, down or right, 6 ways: a seed of the level, the generator's own answer held to the key
  {
    const name = 'Кенгуру 2019 task 13';
    const hit = pinSeed(name, () => Q.raw(351), g => g.shape === 'plain' && g.R === 3 && g.C === 3 && !g.up ? 2 : 0, 2e7);
    if(!hit) throw new Error(name + ': level 351 never asks it');
    if(Q.answers(hit.q).join() !== '6' || !Q.accepts(hit.q, ['6'])) throw new Error(name + ': gives ' + Q.answers(hit.q) + ', the key says 6');
    drawn(name, hit.q, 'Котката и купичката с мляко се намират в два ъгъла на показаната дъска. По колко начина може котката да отиде до купичката, ако се придвижва от квадратче в квадратче само в посока надолу или надясно?');
    taggedBy(351, 'ek-2019-2');
    if(Q.pathWays(3, 3)[2][2] !== 6) throw new Error(name + ': the solver does not give 6');
    met.push('2019 #13 (351)');
  }
  // ---- 352: 2024 #22, the board as printed (top row down: grey at 3; 2 and 4; 1, 3 and 5; 3), white 2, grey 1: 13
  {
    const name = 'Кенгуру 2024 task 22', q = {kind:'gridcost', R:4, C:5, grey:[[0, 2], [1, 1], [1, 3], [2, 0], [2, 2], [2, 4], [3, 2]], wc:2, gc:1, traps:[14], ans:13};
    if(Q.gridCostOf(q) !== 13) throw new Error(name + ': the level 352 solver gives ' + Q.gridCostOf(q) + ' for the printed board, the paper says 13');
    if(Q.answers(q).join() !== '13' || !Q.accepts(q, ['13'])) throw new Error(name + ': the key 13 is not the answer');
    drawn(name, q, 'Колко лева струва най-евтиният маршрут от квадратчето А долу вляво до квадратчето В горе вдясно?');
    taggedBy(352, 'ek-2024-2');
    asks(name, 352, 'gridcost');
    met.push('2024 #22 (352)');
  }
  // ---- 353: 2026 #3: twelve bones, ten of them the dog can get to (two in a part of the maze shut off). The paper's maze is a free-form drawing; its rooms are
  // laid out on the level's 4 × 6 board: a shut-off part of four rooms with two bones, the dog in the bottom right, every other room open to the next
  {
    const name = 'Кенгуру 2026 task 3', C = 6, away = new Set([2 * C + 2, 3 * C + 2, 3 * C + 3, 3 * C + 4]), open = [];
    for(let r = 0; r < 4; r++) for(let c = 0; c < C; c++){
      const i = r * C + c;
      if(c < C - 1 && away.has(i) === away.has(i + 1)) open.push(i + '-' + (i + 1));
      if(r < 3 && away.has(i) === away.has(i + C)) open.push(i + '-' + (i + C));
    }
    const dog = 3 * C + 5, rest = [...Array(24).keys()].filter(i => i !== dog && !away.has(i)).slice(0, 10), bones = rest.concat([2 * C + 2, 3 * C + 4]);
    const q = {kind:'mazebones', open, dog, bones, traps:[bones.length], ans: 10}, reach = Q.mazeReach(open, dog), got = bones.filter(b => reach.has(b)).length;
    if(got !== 10 || bones.length !== 12) throw new Error(name + ': the level 353 solver gets the dog to ' + got + ' of ' + bones.length + ' bones, the paper says 10 of 12');
    if(Q.answers(q).join() !== '10' || !Q.accepts(q, ['10'])) throw new Error(name + ': the key 10 is not the answer');
    drawn(name, q, 'Кучето Шаро тича в лабиринта. До колко кокала най-много може да стигне Шаро?');
    taggedBy(353, 'ek-2026-2');
    asks(name, 353, 'mazebones');
    met.push('2026 #3 (353)');
  }
  // ---- 354: 2024 #12, the maze as printed: all sums 7 but 4 + 2, 6 + 0, 2 + 3; walls shut (1, 0)-(2, 0), (1, 3)-(2, 3) and (1, 2)|(1, 3); the banana
  {
    const name = 'Кенгуру 2024 task 12', sums = [[[3, 4], [1, 6], [4, 2], [4, 3]], [[2, 5], [2, 5], [4, 3], [1, 6]], [[5, 2], [6, 0], [7, 0], [6, 1]], [[4, 3], [2, 3], [0, 7], [5, 2]]];
    const h = [0, 1, 2, 3, 4].map(r => [0, 1, 2, 3].map(c => r === 2 && (c === 0 || c === 3))), v = [0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => r === 1 && c === 3));
    // fruits: 0 banana, 1 orange, 2 carrot, 3 pear, 4 apple
    const exits = [{side:'top', at:2, fruit:3}, {side:'right', at:1, fruit:4}, {side:'left', at:2, fruit:1}, {side:'right', at:3, fruit:0}, {side:'bottom', at:1, fruit:2}];
    const q = {kind:'roomsum', S:7, sums, h, v, exits, traps:[]}, out = Q.roomsExitsOut(q);
    if(out.length !== 1 || exits[out[0]].fruit !== 0) throw new Error(name + ': the level 354 solver finds the exits ' + out.map(i => exits[i].fruit) + ' for the printed maze, the paper says only the banana (0)');
    // the printed answer is a picture of the banana, the paper's key A
    const opts = exits.map((e, id) => ({ id, v: id, text: [Q.fruitSpanOf(e.fruit, 0), Q.fruitSpanOf(e.fruit, 1)] }));
    q.options = opts; q.pick = out[0]; q.ans = q.pick; q.own = true;
    if(!/aria-label="банан"/.test(q.options[q.pick].text[0])) throw new Error(name + ': the right option is not the banana');
    drawn(name, q, 'За влизане в лабиринта се използва вратата горе вляво и се преминава от „стая“ в „стая“. Разрешено е преминаване само през „стаи“ със сбор на числата в тях, равен на 7. През коя врата, различна от входа, може да се излезе от лабиринта?');
    taggedBy(354, 'ek-2024-2');
    asks(name, 354, 'roomsum');
    met.push('2024 #12 (354)');
  }
  // ---- 355: 2022 #20, rooms 1–4 over 5–8, in at 1, out at 8: 34
  {
    const name = 'Кенгуру 2022 task 20', q = {kind:'roomsmax', nums:[[1, 2, 3, 4], [5, 6, 7, 8]], flip:false, traps:[36], ans:34};
    if(Q.roomsBest(q.nums, false)[0] !== 34) throw new Error(name + ': the level 355 solver gives ' + Q.roomsBest(q.nums, false)[0] + ' for the printed rooms, the paper says 34');
    if(Q.answers(q).join() !== '34' || !Q.accepts(q, ['34'])) throw new Error(name + ': the key 34 is not the answer');
    drawn(name, q, 'Какъв най-голям сбор може да получи Дино, ако не е разрешено да се преминава през една стая повече от веднъж?');
    taggedBy(355, 'ek-2022-2');
    asks(name, 355, 'roomsmax');
    met.push('2022 #20 (355)');
  }
  // ---- 356: 2023 #26, O G A B L N M, the twelve roads with the printed km: O to L is 29
  {
    const name = 'Кенгуру 2023 task 26', km = [14, 4, 9, 12, 8, 10, 8, 12, 9, 14, 15, 12], roads = Q.NET_ROADS.map(([a, b], i) => [a, b, km[i]]);
    const q = {kind:'netroute', names:['O', 'G', 'A', 'B', 'L', 'N', 'M'], roads, a:0, b:4, traps:[31], ans:29}, [d, way] = Q.netShortest(roads, 0, 4);
    if(d !== 29) throw new Error(name + ': the level 356 solver gives ' + d + ' for the printed map (' + way + '), the paper says 29');
    if(Q.answers(q).join() !== '29' || !Q.accepts(q, ['29'])) throw new Error(name + ': the key 29 is not the answer');
    drawn(name, q, 'Колко километра е най-късото разстояние между O и L?');
    taggedBy(356, 'ek-2023-2');
    asks(name, 356, 'netroute');
    met.push('2023 #26 (356)');
  }
  // ---- 350: 2025 #4 (the shortest, A) and 2021 #3 (the longest, A)
  {
    const withOptions = q => { q.options = q.paths.map((_, id) => ({ id, v: id, text: [Q.pathSvg(q, id, 0), Q.pathSvg(q, id, 1)] })); q.pick = 0; q.ans = 0; q.own = true; return q; };
    const kang = withOptions({kind:'pathlen', shape:'kang', longest:false, s:5, paths:[[[2, -1], [4, 1], [8, 1]], [[3, 2], [8, -3]], [[3, -4], [8, 4]], [[3, 3], [8, -1]], [[2, 1], [6, 3], [9, -4]]]});
    if(Q.pathPick(Q.pathsOf(kang), false) !== 0) throw new Error('Кенгуру 2025 task 4: the level 350 solver picks ' + Q.pathPick(Q.pathsOf(kang), false) + ', the paper says A (0)');
    drawn('Кенгуру 2025 task 4', kang, 'Петте малки кенгурчета отиват при майките си по показаните пътечки. Кое от тях ще измине най-кратък път?');
    taggedBy(350, 'ek-2025-2');
    const P = (...a) => a.map(p => p);
    const walk = withOptions({kind:'pathlen', shape:'walk', longest:true, s:0, paths:[
      P([1, 4], [2, 4], [2, 3], [1, 3], [1, 1], [2, 1], [2, 2], [3, 2], [3, 1], [4, 1], [4, 3], [3, 3], [3, 4], [4, 4]),
      P([4, 1], [1, 1], [1, 2], [3, 2], [3, 3], [1, 3], [1, 4], [4, 4]),
      P([1, 2], [1, 1], [2, 1], [2, 2], [4, 2], [4, 4], [1, 4], [1, 3], [2, 3]),
      P([2, 2], [1, 2], [1, 1], [3, 1], [3, 2], [4, 2], [4, 3], [3, 3], [3, 4], [1, 4], [1, 3]),
      P([1, 4], [2, 4], [2, 3], [1, 3], [1, 1], [3, 1], [3, 2], [4, 2], [4, 4])]});
    const lens = Q.pathsOf(walk).map(Q.pathSides);
    if(lens.join() !== '15,13,12,12,11' || Q.pathPick(Q.pathsOf(walk), true) !== 0) throw new Error('Кенгуру 2021 task 3: the level 350 solver counts ' + lens + ', the paper says A (15) is the longest');
    drawn('Кенгуру 2021 task 3', walk, 'Коя от показаните пътеки е най-дълга?');
    taggedBy(350, 'ek-2021-2');
    asks('Кенгуру 2025 task 4', 350, 'pathlen', 'kang'); asks('Кенгуру 2021 task 3', 350, 'pathlen', 'walk');
    met.push('2025 #4, 2021 #3 (350)');
  }

  // ---- every generator again, from its drawn picture
  const n = {}, count = k => n[k] = (n[k] || 0) + 1;
  // 351: the squares, the cat, the bowl and the brick found in the picture, every way toward the bowl walked
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(351)), p = parts(Q.drawQ(q)), cells = p.rects.filter(r => r.w === 46 && r.h === 46);
    const x0 = Math.min(...cells.map(r => r.x)), y0 = Math.min(...cells.map(r => r.y)), R = new Set(cells.map(r => r.y)).size, C = new Set(cells.map(r => r.x)).size;
    const at = e => { const t = p.texts.find(t => t.t === e); return t ? [Math.floor((t.y - y0) / 46), Math.floor((t.x - x0) / 46)] : null; };
    const cat = at('🐱'), bowl = at('🥣'), stone = at('🧱'), dr = Math.sign(bowl[0] - cat[0]);
    let ways = 0;
    const go = (r, c) => { if(stone && r === stone[0] && c === stone[1]) return; if(r === bowl[0] && c === bowl[1]){ ways++; return; } if(r !== bowl[0]) go(r + dr, c); if(c < bowl[1]) go(r, c + 1); };
    go(cat[0], cat[1]);
    if(R !== q.R || C !== q.C || ways !== q.ans || !!stone !== !!q.stone || cat[1] !== 0 || bowl[1] !== C - 1 || Math.abs(bowl[0] - cat[0]) !== R - 1) fail('351: the picture is ' + R + ' × ' + C + ' and has ' + ways + ' ways', q);
    if(q.traps.includes(q.ans)) fail('351: a slip is the answer', q);
    count('pathcount ' + q.shape);
  }
  // 352: the grey squares read from the rectangles, the prices from the words, every way up and right tried
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(352)), html = Q.drawQ(q), p = parts(html), cells = p.rects.filter(r => r.w === 38 && r.h === 38), t = strip(html);
    const x0 = Math.min(...cells.map(r => r.x)), y0 = Math.min(...cells.map(r => r.y)), R = new Set(cells.map(r => r.y)).size, C = new Set(cells.map(r => r.x)).size;
    const grey = new Set(cells.filter(r => r.fill === 'var(--fur)').map(r => Math.round((r.y - y0) / 38) + ',' + Math.round((r.x - x0) / 38)));
    const m = t.match(/струва(\d)лева,астъпванетовсиво—съответно(\d)лев/);
    if(!m) fail('352: cannot read the prices', t);
    const price = (r, c) => grey.has(r + ',' + c) ? +m[2] : +m[1];
    let best = Infinity;
    const go = (r, c, sum) => { if(r === 0 && c === C - 1){ best = Math.min(best, sum); return; } if(r > 0) go(r - 1, c, sum + price(r - 1, c)); if(c < C - 1) go(r, c + 1, sum + price(r, c + 1)); };
    go(R - 1, 0, price(R - 1, 0));
    if(best !== q.ans || R !== q.R || C !== q.C || q.traps.includes(q.ans)) fail('352: the cheapest way costs ' + best, q);
    count('gridcost');
  }
  // 353: the walls read from the path, the bones and the dog from the emoji, every room joined by a gap walked
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(353)), p = parts(Q.drawQ(q)), closed = new Set();
    segs(p.paths[0]).forEach(s => { const r = Math.round((s.y - 4) / 40), c = Math.round((s.x - 4) / 40); if(s.dir === 'v') closed.add((r * 6 + c - 1) + '-' + (r * 6 + c)); else closed.add(((r - 1) * 6 + c) + '-' + (r * 6 + c)); });
    const room = t => Math.floor((t.y - 4) / 40) * 6 + Math.floor((t.x - 4) / 40), bones = p.texts.filter(t => t.t === '🦴').map(room), dog = room(p.texts.find(t => t.t === '🐶'));
    const seen = new Set([dog]), todo = [dog];
    while(todo.length){ const a = todo.pop(), r = Math.floor(a / 6), c = a % 6; [[r, c + 1], [r + 1, c], [r, c - 1], [r - 1, c]].forEach(([nr, nc]) => {
      if(nr < 0 || nr > 3 || nc < 0 || nc > 5) return; const b = nr * 6 + nc;
      if(!seen.has(b) && !closed.has(Math.min(a, b) + '-' + Math.max(a, b))){ seen.add(b); todo.push(b); } }); }
    const got = bones.filter(b => seen.has(b)).length;
    if(got !== q.ans || bones.length !== q.bones.length || q.traps.includes(q.ans) || got === bones.length) fail('353: the dog reaches ' + got + ' of ' + bones.length, q);
    count('mazebones');
  }
  // 354: the sums, the walls and the doors read from the picture; walk from the way in through rooms with the sum
  const FR = { '🍌':'банан', '🍊':'портокал', '🥕':'морков', '🍐':'круша', '🍎':'ябълка', '🍇':'грозде', '🍓':'ягода' };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(354)), html = Q.drawQ(q), p = parts(html), S = +strip(html).match(/равенна(\d+)\./)[1], M = 32, U = 58;
    const sum = {}, cell = t => Math.floor((t.y - M) / U) + ',' + Math.floor((t.x - M) / U);
    p.texts.filter(t => /^\d+ \+ \d+$/.test(t.t)).forEach(t => { sum[cell(t)] = t.t.split(' + ').map(Number).reduce((a, b) => a + b); });
    const hw = new Set(), vw = new Set();   // a wall above room r,c; left of room r,c
    segs(p.paths[0]).forEach(s => { const r = Math.round((s.y - M) / U), c = Math.round((s.x - M) / U); (s.dir === 'h' ? hw : vw).add(r + ',' + c); });
    const seen = new Set(), todo = [];
    if(sum['0,0'] === S) seen.add('0,0'), todo.push([0, 0]);
    while(todo.length){ const [r, c] = todo.pop();
      [[r - 1, c, !hw.has(r + ',' + c)], [r + 1, c, !hw.has((r + 1) + ',' + c)], [r, c - 1, !vw.has(r + ',' + c)], [r, c + 1, !vw.has(r + ',' + (c + 1))]].forEach(([nr, nc, ok]) => {
        if(ok && sum[nr + ',' + nc] === S && !seen.has(nr + ',' + nc)) seen.add(nr + ',' + nc), todo.push([nr, nc]); }); }
    const out = p.texts.filter(t => FR[t.t]).map(t => { const r = t.x < M ? Math.floor((t.y - M) / U) : t.x > M + 4 * U ? Math.floor((t.y - M) / U) : t.y < M ? 0 : 3, c = t.y < M || t.y > M + 4 * U ? Math.floor((t.x - M) / U) : t.x < M ? 0 : 3; return [FR[t.t], r + ',' + c]; });
    const exits = out.filter(([, k]) => seen.has(k)).map(([f]) => f), label = q.options[q.pick].text[0].match(/aria-label="([^"]*)"/)[1];
    if(out.length !== 5 || exits.length !== 1 || exits[0] !== label || new Set(q.options.map(o => o.text[0])).size !== 5 || new Set(out.map(o => o[0])).size !== 5) fail('354: the picture leads out by ' + exits + ', the picked door is ' + label, q);
    if(q.options.map(o => o.text[0].match(/aria-label="([^"]*)"/)[1]).sort().join() !== out.map(o => o[0]).sort().join()) fail('354: the options are not the five doors', q);
    count('roomsum');
  }
  // 355: the numbers read from the picture, every way through the rooms tried (the order of every part of the middle rooms)
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(355)), p = parts(Q.drawQ(q)), nums = [[], []], M = 30, U = 62, flip = p.texts.find(t => t.t === '🦕').x > M + 4 * U;
    p.texts.filter(t => /^\d$/.test(t.t)).forEach(t => { nums[Math.floor((t.y - M) / U)][Math.floor((t.x - M) / U)] = +t.t; });
    const start = [0, flip ? 3 : 0], end = [1, flip ? 0 : 3], mid = [0, 1].flatMap(r => [0, 1, 2, 3].map(c => [r, c])).filter(([r, c]) => !(r === start[0] && c === start[1]) && !(r === end[0] && c === end[1]));
    let best = 0;
    const orders = (rest, way) => { // every ordered choice of rooms from the rest, as a walk from the start to the end
      const last = way[way.length - 1];
      if(Math.abs(last[0] - end[0]) + Math.abs(last[1] - end[1]) === 1) best = Math.max(best, way.concat([end]).reduce((s, [r, c]) => s + nums[r][c], 0));
      rest.forEach((x, j) => { if(Math.abs(last[0] - x[0]) + Math.abs(last[1] - x[1]) === 1) orders(rest.filter((_, k) => k !== j), way.concat([x])); });
    };
    orders(mid, [start]);
    if(best !== q.ans || flip !== q.flip || q.traps[0] === q.ans || new Set(nums.flat()).size !== 8) fail('355: the best walk is ' + best, q);
    count('roomsmax');
  }
  // 356: the roads read from the lines, the km from the labels, every way between the two marked villages walked
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(356)), html = Q.drawQ(q), p = parts(html);
    const nodes = p.circles.map(([x, y, r]) => ({ x, y, end: r === 7 })), near = (x, y) => nodes.reduce((b, nd, k) => Math.hypot(nd.x - x, nd.y - y) < Math.hypot(nodes[b].x - x, nodes[b].y - y) ? k : b, 0);
    if(nodes.length !== 7) fail('356: not seven villages', q);
    const roads = p.lines.map(([x1, y1, x2, y2]) => { const t = p.texts.filter(t => t.size === 13).reduce((b, t) => Math.hypot(t.x - (x1 + x2) / 2, t.y - 5 - (y1 + y2) / 2) < Math.hypot(b.x - (x1 + x2) / 2, b.y - 5 - (y1 + y2) / 2) ? t : b); return [near(x1, y1), near(x2, y2), +t.t]; });
    const name = k => p.texts.filter(t => t.size === 16).reduce((b, t) => Math.hypot(t.x - nodes[k].x, t.y - nodes[k].y) < Math.hypot(b.x - nodes[k].x, b.y - nodes[k].y) ? t : b).t;
    const m = strip(html).match(/между([A-Z])и([A-Z])\?/);
    if(!m) fail('356: cannot read the villages', strip(html));
    const a = nodes.findIndex((_, k) => name(k) === m[1]), b = nodes.findIndex((_, k) => name(k) === m[2]);
    if(a < 0 || b < 0 || roads.length !== q.roads.length) fail('356: villages or roads not found', q);
    let best = Infinity;
    const go = (at, km, seen) => { if(at === b){ best = Math.min(best, km); return; } roads.forEach(([x, y, w]) => { const to = x === at ? y : y === at ? x : -1; if(to >= 0 && !seen.has(to)) go(to, km + w, new Set(seen).add(to)); }); };
    go(a, 0, new Set([a]));
    if(best !== q.ans || q.traps.includes(q.ans)) fail('356: the shortest way is ' + best, q);
    count('netroute');
  }
  // 350: the five pictures read back: every path's length counted from its polyline and its grid, the extreme named in the words
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(350)), html = Q.drawQ(q), t = strip(html), longest = /най-дълга|най-дълъг/.test(t), lens = q.options.map(o => {
      const p = parts(o.text[0]), pts = p.polys[0], step = p.lines[1][0] - p.lines[0][0];   // the grid's own square
      return pts.reduce((s, c, k) => k ? s + Math.abs(c[0] - pts[k - 1][0]) + Math.abs(c[1] - pts[k - 1][1]) : 0, 0) / step;
    });
    const best = longest ? Math.max(...lens) : Math.min(...lens);
    if(lens.filter(v => v === best).length !== 1 || lens.indexOf(best) !== q.pick || longest !== q.longest || q.options.length !== 5) fail('350: the picture has path lengths ' + lens, q);
    if(new Set(q.options.map(o => o.text[0])).size !== 5) fail('350: the options repeat', q);
    count('pathlen ' + q.shape);
  }
  console.log('Кенгуру 2 клас, routes and mazes (350–356): ' + met.join(', ') + ' match the official key and are asked by their levels; each generator worked out again from its own drawn picture: ' + Object.entries(n).map(([k, v]) => v + ' ' + k).join(', '));
}
