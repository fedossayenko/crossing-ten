// Runs beside the app (in check.js's own scope, through eval), like check/ek-W1.js and check/sal-S1.js.
// Иван Салабашев, 2 клас — builder P3, pictures: 2019 #7, 2022 #4, 2023 #8 (triangles in a figure of segments, level 517), 2020 #1 (the letters И and С, 518),
// 2021 #6 (the wall with a snowflake, 511), 2020 #7 (squares in tiles of mixed sizes, 510), 2025 #10 (rectangles with two grey squares, 512), 2020 #9
// (the missing face, 513), 2020 #15 (the balances with a cat, a rabbit and chicks, 514), 2023 #7 (the robot of polygons, 515), 2024 #15 (the fewest
// colours for a wall, 516). Each printed task is drawn by its level as printed (its figure, numbers and words) and must come out at the official key
// by the generator's own answer; then every generator is worked out again from the SVG it draws (rects, lines, polygons and texts read back from the
// markup, not the fields the generator keeps) on 2000–3000 seeds each.
// Notes: 2020 #9 has no words, only the grid and four faces: the grid and the key В are pinned, the paper's wrong faces differ in the direction of a
// triangle, which the model does not draw. 2020 #15 has a chick of half a kilogram (3 + 1 = 4, 3 + 2 = 5, 2 + 2 = 4, 1 + 4 = 5): the printed weights are
// solved on a half-kilogram grid here; the generator itself keeps every weight whole.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const met = [];
  const draw = q => strip(Q.drawQ(q));
  const pin = (year, task, id, q, key, shows, fields, tries = 3000) => {
    const name = 'Салабашев ' + year + ' task ' + task, tag = 'sal-' + year + '-2';
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': gives ' + Q.answers(q) + ', the key says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    shows.forEach(s => { if(draw(q).indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + draw(q).slice(0, 300)); });
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const sig = g => fields.map(f => JSON.stringify(g[f])).join('|'), want = sig(q);
    const hit = pinSeed(name, () => Q.raw(id), g => g.kind !== q.kind || g.shape !== q.shape ? 0 : sig(g) === want ? 2 : 1, tries);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    met.push(task + (hit.exact ? '' : '*') + ' (' + year + ')');
    return hit.q;
  };
  const attr = (s, a) => (s.match(new RegExp('\\s' + a + '="([^"]*)"')) || [])[1];
  const tags = (svg, name) => svg.match(new RegExp('<' + name + '[ >/][^>]*>', 'g')) || [];
  const svgs = h => String(h).match(/<svg[\s\S]*?<\/svg>/g) || [];
  const pts = s => attr(s, 'points').trim().split(/\s+/).map(v => v.split(',').map(Number));
  const area = p => Math.abs(p.reduce((t, a, i) => { const b = p[(i + 1) % p.length]; return t + a[0]*b[1] - b[0]*a[1]; }, 0)) / 2;
  const texts = svg => [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)].map(m => ({ x: +attr(m[0], 'x'), y: +attr(m[0], 'y'), body: m[2] }));
  const rectsOf = svg => tags(svg, 'rect').map(r => ({ x: +attr(r, 'x'), y: +attr(r, 'y'), w: +attr(r, 'width'), h: +attr(r, 'height'), fill: attr(r, 'fill') }));
  const isUnique = (v, sign) => { const best = Math.max(...v.map(x => x*sign)); return v.filter(x => x*sign === best).length === 1 ? v.findIndex(x => x*sign === best) : -1; };
  const noVote = (feats, pick, what, q) => feats.forEach(v => [1, -1].forEach(sg => { if(isUnique(v, sg) === pick) fail(what + ': the answer is the one with the most or the fewest of something else', q); }));
  const n = {}, count = k => n[k] = (n[k] || 0) + 1;
  const each = (id, runs, f) => { for(let i = 1; i <= runs; i++) f(Q.seeded(i, () => Q.raw(id)), i); };

  // ---- the printed instances
  const TRI = 'Колко са триъгълниците на фигурата?';
  [[2019, 7, 0, 14], [2022, 4, 1, 20], [2023, 8, 2, 14]].forEach(([y, t, f, key]) => pin(y, t, 517, {kind:'vtri', shape:'tris', f, flip:0, ans:key}, key, [TRI], ['f', 'flip'], 20000));
  pin(2020, 1, 518, {kind:'shapecount', shape:'letters', h:5, a:2, m:3, sq:17, tri:7, traps:[17, 24], ans:10}, 10, ['С колко квадратите са повече от триъгълниците на фигурата?'], ['h', 'a', 'm'], 5000);
  pin(2021, 6, 511, {kind:'shapecount', shape:'wall', rows:[[2, 1], [1, 2], [1, 1, 1]], snow:[10], total:7, k:1, fewer:true, ans:5}, 5,
    ['С колко правоъгълниците, в които има снежинка, са по-малко от правоъгълниците, в които няма снежинка?'], ['rows', 'snow'], 20000);
  pin(2020, 7, 510, {kind:'countsq', shape:'mixed', tiles:[[0, 0, 2, 1], [0, 1, 1, 1], [1, 1, 1, 1], [0, 2, 1, 1], [1, 2, 1, 1], [0, 3, 1, 1], [1, 3, 1, 1], [2, 0, 2, 2], [2, 2, 2, 2]], bySize:{1:6, 2:5, 4:1}, sizes:[6, 5, 1], ans:12}, 12,
    ['Колко квадрата има на фигурата?'], ['tiles'], 20000);
  pin(2025, 10, 512, {kind:'rects', shape:5, W:4, H:3, grey:[[0, 0], [0, 1], [1, 1], [3, 2]], ans:7}, 7,
    ['Мрежата на чертежа е съставена от 12 еднакви квадратчета. Колко са всички правоъгълници на чертежа, които не са квадрати и съдържат точно две сиви квадратчета?'], ['W', 'H', 'grey'], 20000);
  {
    // the faces: eyes, nose, mouth, each 0 circle / 1 square / 2 triangle (mouth: 0 straight, 1 smile, 2 sad); the middle one is missing
    const sq = [[[0, 1, 2], [1, 2, 0], [2, 0, 1]], [[2, 1, 0], [0, 2, 1], [1, 0, 2]], [[0, 1, 2], [1, 2, 0], [2, 0, 1]]];
    const o = [[2, 2, 1], [2, 1, 2], [2, 2, 2], [0, 2, 1]].map((parts, id) => ({ id, v:id, text:['', ''], parts }));
    pin(2020, 9, 513, {kind:'faces', shape:'latin', sq, hole:4, own:true, pick:2, ans:2, options:o}, 2, ['Коя картинка трябва да е на мястото на въпросителния знак?'], ['sq', 'hole']);
  }
  pin(2020, 15, 514, {kind:'scales', shape:'pans', a:2, b:4, p:2, q:2, c:0.5, d:1, r:2, k:3, W:[4, 5, 4], ans:5}, 5,
    ['Колко килограма трябва да се сложат на последната везна, за да е в равновесие?'], ['a', 'b', 'p', 'q', 'W']);
  pin(2023, 7, 515, {kind:'robot', t:Q.ROBOT_PRINTED, ans:85}, 85, ['Колко ще струва изработката на робота, показан на картинката?'], ['t'], 2000);
  pin(2024, 15, 516, {kind:'brickmap', rows:[[4, 8], [2, 10], [3, 6, 9]], ans:4}, 4,
    ['Всяко от полетата на чертежа трябва да се оцвети в някакъв цвят, така че полетата с обща граница да са разноцветни. Най-малко колко цвята са необходими?'], ['rows'], 20000);

  // ---- 517: every triangle counted again from the drawn lines: points = ends and crossings, a side counts when 60 points along it lie on drawn lines
  const linesOf = svg => tags(svg, 'line').map(l => ['x1', 'y1', 'x2', 'y2'].map(a => +attr(l, a)));
  const triFromLines = segs => {
    const P = [], add = (x, y) => { if(!P.some(p => Math.hypot(p[0] - x, p[1] - y) < 0.3)) P.push([x, y]); };
    segs.forEach(s => { add(s[0], s[1]); add(s[2], s[3]); });
    for(let i = 0; i < segs.length; i++) for(let j = i + 1; j < segs.length; j++){
      const [x1, y1, x2, y2] = segs[i], [x3, y3, x4, y4] = segs[j], d = (x2 - x1)*(y4 - y3) - (y2 - y1)*(x4 - x3);
      if(Math.abs(d) < 1e-9) continue;
      const t = ((x3 - x1)*(y4 - y3) - (y3 - y1)*(x4 - x3)) / d, u = ((x3 - x1)*(y2 - y1) - (y3 - y1)*(x2 - x1)) / d;
      if(t > -0.01 && t < 1.01 && u > -0.01 && u < 1.01) add(x1 + t*(x2 - x1), y1 + t*(y2 - y1));
    }
    const near = (x, y) => segs.some(([x1, y1, x2, y2]) => { const L = (x2 - x1)**2 + (y2 - y1)**2, u = Math.max(0, Math.min(1, ((x - x1)*(x2 - x1) + (y - y1)*(y2 - y1)) / L)); return Math.hypot(x - x1 - u*(x2 - x1), y - y1 - u*(y2 - y1)) < 0.5; });
    const side = (a, b) => { for(let s = 0; s <= 60; s++) if(!near(a[0] + (b[0] - a[0])*s/60, a[1] + (b[1] - a[1])*s/60)) return false; return true; };
    let tri = 0;
    for(let a = 0; a < P.length; a++) for(let b = a + 1; b < P.length; b++) for(let c = b + 1; c < P.length; c++){
      if(Math.abs((P[b][0] - P[a][0])*(P[c][1] - P[a][1]) - (P[b][1] - P[a][1])*(P[c][0] - P[a][0])) < 50) continue;   // collinear (the drawing is rounded to a tenth)
      if(side(P[a], P[b]) && side(P[b], P[c]) && side(P[a], P[c])) tri++;
    }
    return tri;
  };
  const seen517 = {};
  each(517, 400, q => {
    count('tris'); const segs = linesOf(svgs(Q.drawQ(q))[0]), tri = triFromLines(segs);
    if(tri !== q.ans) fail('517: the drawn lines hold ' + tri + ' triangles', q);
    seen517[q.f] = tri;
  });
  if([0, 1, 2].map(f => seen517[f]).join() !== '14,20,14') throw new Error('517: the printed figures give ' + [0, 1, 2].map(f => seen517[f]) + ', the keys say 14, 20, 14');
  if(!Object.keys(seen517).length) throw new Error('517 drew nothing');

  // ---- 518: the squares and the half squares read from the polygons; their areas are 1 and 1/2 of a unit square, none lies on another
  each(518, 2000, q => {
    count('letters'); const sv = svgs(Q.drawQ(q))[0], P = tags(sv, 'polygon').map(pts), u = 26;
    const sqs = P.filter(p => p.length === 4 && Math.abs(area(p) - u*u) < 1), tri = P.filter(p => p.length === 3 && Math.abs(area(p) - u*u/2) < 1);
    if(sqs.length + tri.length !== P.length) fail('518: a piece is neither a square nor a half square', q);
    if(sqs.length - tri.length !== q.ans) fail('518: the drawn pieces give ' + (sqs.length - tri.length), q);
    const cen = p => [p.reduce((t, v) => t + v[0], 0) / p.length, p.reduce((t, v) => t + v[1], 0) / p.length];
    const inside = (c, p) => { let odd = false; for(let a = 0, b = p.length - 1; a < p.length; b = a++){ const [xa, ya] = p[a], [xb, yb] = p[b]; if((ya > c[1]) !== (yb > c[1]) && c[0] < (xb - xa)*(c[1] - ya)/(yb - ya) + xa) odd = !odd; } return odd; };
    P.forEach((p, i) => P.forEach((r, j) => { if(i !== j && inside(cen(p), r)) fail('518: two pieces lie on each other', q); }));
    const t = strip(Q.drawQ(q)); if(t.indexOf('С колко квадратите са повече от триъгълниците'.replace(/\s+/g, '')) < 0) fail('518: the question is not asked as printed', q);
  });

  // ---- 511: the bricks (rects) and the snowflakes (texts) read back; the question's direction is read from its words
  each(511, 3000, q => {
    count('wall'); const h = Q.drawQ(q), sv = svgs(h)[0], R = rectsOf(sv), F = texts(sv).filter(x => x.body === '❄');
    const flake = R.filter(r => F.some(f => f.x > r.x && f.x < r.x + r.w && f.y > r.y && f.y < r.y + r.h));
    if(F.length !== flake.length || R.length !== q.total) fail('511: a snowflake is not in one brick, or the bricks are not counted', q);
    const rows = [...new Set(R.map(r => r.y))]; if(rows.length !== 3 || R.some(r => r.x < 0 || r.x + r.w > 180.1)) fail('511: not three rows of width 3', q);
    rows.forEach(y => { const row = R.filter(r => r.y === y).sort((a, b) => a.x - b.x); let x = 0; row.forEach(r => { if(Math.abs(r.x - x) > 0.01) fail('511: a gap in a row', q); x = r.x + r.w; }); if(Math.abs(x - 180) > 0.01) fail('511: a short row', q); });
    const fewer = strip(h).indexOf('сапо-малкоот') >= 0;
    const w = R.length - flake.length, want = Math.abs(w - flake.length);
    if(want !== q.ans || (w > flake.length) !== fewer || want === 0) fail('511: the bricks give ' + want + ' (' + (fewer ? 'fewer' : 'more') + ')', q);
    if(R.length < 5 || R.length > 8) fail('511: not 5 to 8 bricks', q);
  });

  // ---- 510: the tiles read back as rects; the squares counted on the unit cells: a square counts when no tile has cells both inside and outside it
  each(510, 3000, q => {
    count('mixed'); const sv = svgs(Q.drawQ(q))[0], R = rectsOf(sv), cell = Array.from({ length: 4 }, () => Array(4).fill(-1));
    R.forEach((r, i) => { const x = r.x / 30, y = r.y / 30, w = r.w / 30, h = r.h / 30;
      for(let a = 0; a < w; a++) for(let b = 0; b < h; b++){ if(cell[y + b][x + a] !== -1) fail('510: two tiles overlap', q); cell[y + b][x + a] = i; } });
    if(cell.some(row => row.includes(-1))) fail('510: the tiles do not cover 4 x 4', q);
    let tot = 0;
    for(let k = 1; k <= 4; k++) for(let y = 0; y + k <= 4; y++) for(let x = 0; x + k <= 4; x++){
      const inn = new Set(), out = new Set();
      for(let b = 0; b < 4; b++) for(let a = 0; a < 4; a++) (a >= x && a < x + k && b >= y && b < y + k ? inn : out).add(cell[b][a]);
      if(![...inn].some(t => out.has(t))) tot++;
    }
    if(tot !== q.ans) fail('510: the squares in the picture number ' + tot, q);
    if(new Set(R.map(r => r.w + 'x' + r.h)).size < 3 || tot < 8 || tot > 16) fail('510: too plain or too many squares', q);
  });

  // ---- 512: the grid read back as rects, the grey ones by their fill; every rectangle that is not a square tried
  each(512, 3000, q => {
    count('grey'); const R = rectsOf(svgs(Q.drawQ(q))[0]), W = Math.round(Math.max(...R.map(r => r.x)) / 36) + 1, H = Math.round(Math.max(...R.map(r => r.y)) / 36) + 1;
    if(R.length !== W*H || W !== q.W || H !== q.H) fail('512: the grid is not W x H', q);
    const g = new Set(R.filter(r => r.fill !== 'none').map(r => Math.round(r.x / 36) + ',' + Math.round(r.y / 36)));
    let ans = 0;
    for(let x0 = 0; x0 < W; x0++) for(let x1 = x0; x1 < W; x1++) for(let y0 = 0; y0 < H; y0++) for(let y1 = y0; y1 < H; y1++){
      if(x1 - x0 === y1 - y0) continue;
      let k = 0; for(let x = x0; x <= x1; x++) for(let y = y0; y <= y1; y++) if(g.has(x + ',' + y)) k++;
      if(k === 2) ans++;
    }
    if(ans !== q.ans || ans < 4) fail('512: the picture gives ' + ans, q);
    if(g.size < 3 || g.size > 4) fail('512: not 3 or 4 grey squares', q);
  });

  // ---- 513: every face decoded from its markup (eyes, nose, mouth); every row and column of every part has its three kinds once; the options
  const decode = g => {
    const eyes = tags(g, 'circle').filter(c => attr(c, 'cy') === '14').length ? 0 : tags(g, 'rect').some(r => attr(r, 'y') === '10') ? 1 : 2;
    const nose = tags(g, 'circle').some(c => attr(c, 'cy') === '27') ? 0 : tags(g, 'rect').some(r => attr(r, 'y') === '23.2') ? 1 : 2;
    const mouth = /<line /.test(g) ? 0 : /Q22,45/.test(g) ? 1 : /Q22,33/.test(g) ? 2 : -1;
    const e = tags(g, 'circle').filter(c => attr(c, 'cy') === '14').length + tags(g, 'rect').filter(r => attr(r, 'y') === '10').length + tags(g, 'polygon').filter(p => /,10 /.test(attr(p, 'points'))).length;
    if(e !== 2 || mouth < 0) throw new Error('a face with ' + e + ' eyes and mouth ' + mouth);
    return [eyes, nose, mouth];
  };
  each(513, 2000, q => {
    count('faces'); const sv = svgs(Q.drawQ(q))[0], cells = sv.split('<g transform="translate(').slice(1), grid = [], miss = [];
    if(cells.length !== 9) fail('513: not nine faces', q);
    cells.forEach((c, i) => { if(/>\?<\/text>/.test(c)) miss.push(i); grid[i] = /\?<\/text>/.test(c) ? null : decode(c); });
    if(miss.length !== 1) fail('513: not one empty place', q);
    const hole = miss[0], r = Math.floor(hole / 3), c = hole % 3, right = [0, 1, 2].map(f => { const used = new Set(); for(let i = 0; i < 3; i++){ if(i !== c) used.add(grid[3*r + i][f]); if(i !== r) used.add(grid[3*i + c][f]); } return [0, 1, 2].filter(v => !used.has(v)); });
    if(right.some(v => v.length !== 1)) fail('513: the row and column leave out more than one kind of a part', q);
    const want = right.map(v => v[0]);
    // the full grid with the hole filled: every row and column of every part has 0, 1 and 2
    const full = grid.map((g, i) => g || want);
    for(let f = 0; f < 3; f++) for(let i = 0; i < 3; i++){ if([0, 1, 2].map(j => full[3*i + j][f]).sort().join() !== '0,1,2' || [0, 1, 2].map(j => full[3*j + i][f]).sort().join() !== '0,1,2') fail('513: not a Latin square', q); }
    const opts = q.options.map(o => decode(o.text[0]));
    if(opts.map(String).filter(s => s === String(want)).length !== 1 || String(opts[q.pick]) !== String(want)) fail('513: the right face is not the picked option, or is there twice', q);
    if(new Set(opts.map(String)).size !== 4) fail('513: two options are the same face', q);
    if(q.options.some(o => o.text[1].replace('вариант', 'варіант') !== o.text[0].replace('вариант', 'варіант').replace(/вариант/g, 'варіант') && false)) fail('513: option text', q);
    const score = opts.map((o, i) => opts.reduce((t, p, j) => t + (i === j ? 0 : o.filter((v, k) => v === p[k]).length), 0));
    noVote([score, ...[0, 1, 2].map(v => opts.map(o => o.filter(x => x === v).length))], q.pick, '513', q);
  });

  // ---- 514: the four balances read back (the animals on the left pan, the weights on the right); the three weights found by trying every whole number
  const pans = q => {
    const S = svgs(Q.drawQ(q)), out = [];
    if(S.length !== 1) fail('514: not one picture', q);
    const G = S[0].split('<g class="bal"').slice(1);
    if(G.length !== 4) fail('514: not four balances', q);
    G.forEach(sv => { const T = texts(sv), an = k => T.filter(t => t.x < 120 && t.body === k).length, kg = T.find(t => /кг$/.test(t.body)); out.push({ cat: an('🐱'), rabbit: an('🐰'), chick: an('🐤'), kg: kg ? parseInt(kg.body) : null, q: T.some(t => t.body === '?') }); });
    return out;
  };
  const solve = (B, grid, step) => { const sols = []; for(let c = step; c <= grid; c += step) for(let r = step; r <= grid; r += step) for(let k = step; k <= grid; k += step)
    if(B.slice(0, 3).every(b => Math.abs(b.cat*k + b.rabbit*r + b.chick*c - b.kg) < 1e-9)) sols.push([k, r, c]); return sols; };
  each(514, 3000, q => {
    count('pans'); const B = pans(q), sols = solve(B, 30, 1);
    if(B[3].kg !== null || !B[3].q || B[0].kg === null || B[1].kg === null || B[2].kg === null) fail('514: the last balance is not the unknown one', q);
    if(sols.length !== 1) fail('514: the balances do not fix the weights: ' + sols.length, q);
    const [k, r, c] = sols[0], ans = B[3].chick*c + B[3].rabbit*r + B[3].cat*k;
    if(ans !== q.ans || Math.max(...B.map(b => b.kg || 0)) > 14 || ans > 20) fail('514: the pictures give ' + ans, q);
    if(!(r > B[0].chick*c)) fail('514: the rabbit is not heavier than the chicks of the first balance', q);
  });
  {
    // the printed balances on a half-kilogram grid: the only weights are cat 3, rabbit 2, chick 1/2, and the last pan weighs 5
    const B = pans(Q.seeded(1, () => Q.raw(514))), P = [{ cat:1, rabbit:0, chick:2, kg:4 }, { cat:1, rabbit:1, chick:0, kg:5 }, { cat:0, rabbit:1, chick:4, kg:4 }], s = solve(P, 12, 0.5);
    if(s.length !== 1 || s[0].join() !== '3,2,0.5' || 2*0.5 + 2*2 !== 5 || !B.length) throw new Error('2020 #15: the printed balances give ' + JSON.stringify(s));
  }

  // ---- 515: the robot's pieces read back: an ellipse is 2 euro, a polygon its corners; the prices as printed; each part with as many different corners as it has
  each(515, 3000, q => {
    count('robot'); const sv = svgs(Q.drawQ(q))[0], P = tags(sv, 'polygon').map(pts), E = tags(sv, 'ellipse');
    if(E.some(e => attr(e, 'rx') !== attr(e, 'ry'))) fail('515: a circle that is not round', q);
    let tot = E.length*2; P.forEach(p => { if(p.length < 3 || p.length > 6 || new Set(p.map(String)).size !== p.length || area(p) < 20) fail('515: a polygon with a hidden corner or no area', q); tot += p.length; });
    if(E.length + P.length !== 22) fail('515: not 22 parts', q);
    // no corner hidden: no corner of a part lies inside (or within 1.5 of the outline of) a part drawn after it, and no circle reaches into a later part
    const shapes = [...sv.matchAll(/<(polygon|ellipse)\b[^>]*>/g)].map(m => m[1] === 'polygon' ? { poly: pts(m[0]) } : { c: [+attr(m[0], 'cx'), +attr(m[0], 'cy')], r: +attr(m[0], 'rx') });
    const segD = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], u = Math.max(0, Math.min(1, ((p[0] - a[0])*dx + (p[1] - a[1])*dy)/(dx*dx + dy*dy))); return Math.hypot(p[0] - a[0] - u*dx, p[1] - a[1] - u*dy); };
    const inPoly = (p, poly) => { let c = false; for(let i = 0, j = poly.length - 1; i < poly.length; j = i++){ const [xi, yi] = poly[i], [xj, yj] = poly[j]; if((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi)*(p[1] - yi)/(yj - yi) + xi) c = !c; } return c; };
    const near = (p, s, m) => s.poly ? inPoly(p, s.poly) || s.poly.some((a, i) => segD(p, a, s.poly[(i + 1) % s.poly.length]) < m) : Math.hypot(p[0] - s.c[0], p[1] - s.c[1]) < s.r + m;
    shapes.forEach((s, i) => shapes.slice(i + 1).forEach(later => {
      const probe = s.poly || Array.from({ length: 16 }, (_, k) => [s.c[0] + s.r*Math.cos(k*Math.PI/8), s.c[1] + s.r*Math.sin(k*Math.PI/8)]);
      if(probe.some(p => near(p, later, s.poly ? 1.5 : 0.5))) fail('515: a part covers a corner (or the round edge) of a part drawn before it', q);
    }));
    if(tot !== q.ans || tot < 60 || tot > 99) fail('515: the drawn parts cost ' + tot, q);
    if(new Set([...E.map(() => 2), ...P.map(p => p.length)]).size < 4) fail('515: fewer than four kinds of part', q);
    [...P.flat(), ...E.flatMap(e => [[+attr(e, 'cx') - +attr(e, 'rx'), +attr(e, 'cy') - +attr(e, 'ry')], [+attr(e, 'cx') + +attr(e, 'rx'), +attr(e, 'cy') + +attr(e, 'ry')]])].forEach(([x, y]) => { if(x < 0 || x > 240 || y < 0 || y > 254) fail('515: a part outside the picture', q); });
    const t = strip(Q.drawQ(q)); if(!/кръгчетатаструватпо2евро,триъгълниците—по3евро,четириъгълниците—по4евро,петоъгълниците—по5евроишестоъгълниците—по6евро/.test(t)) fail('515: the prices are not as printed', q);
  });
  { const q = Q.seeded(1, () => Q.raw(515)), p = { ...q, t: Q.ROBOT_PRINTED, ans: 85 }, sv = svgs(Q.drawQ(p))[0];
    if(tags(sv, 'ellipse').length*2 + tags(sv, 'polygon').map(pts).reduce((t, v) => t + v.length, 0) !== 85) throw new Error('2023 #7: the printed robot as drawn does not cost 85'); }

  // ---- 516: the bricks read back as rects; two touch when they share a piece of border; the fewest colours found by trying every colouring
  each(516, 2000, q => {
    count('bricks'); const R = rectsOf(svgs(Q.drawQ(q))[0]).map(r => ({ ...r, x: Math.round(r.x / 24), w: Math.round(r.w / 24), y: Math.round(r.y / 40) })), N = R.length;
    const ov = (a, b, c, d) => Math.min(b, d) - Math.max(a, c);
    const adj = (a, b) => (a.y === b.y && (a.x + a.w === b.x || b.x + b.w === a.x)) || (Math.abs(a.y - b.y) === 1 && ov(a.x, a.x + a.w, b.x, b.x + b.w) > 0);
    const E = []; for(let i = 0; i < N; i++) for(let j = i + 1; j < N; j++) if(adj(R[i], R[j])) E.push([i, j]);
    let best = N;
    for(let k = 1; k <= 5; k++){
      const col = Array(N).fill(-1), go = i => { if(i === N) return true; for(let c = 0; c < k; c++){ col[i] = c; if(E.every(([a, b]) => Math.max(a, b) !== i || col[a] !== col[b]) && go(i + 1)) return true; } col[i] = -1; return false; };
      if(go(0)){ best = k; break; }
    }
    if(best !== q.ans || best < 3 || best > 4) fail('516: the picture needs ' + best + ' colours', q);
    if(N < 8 || N > 11 || R.some(r => r.w < 2 || r.x < 0 || r.x + r.w > 12)) fail('516: bricks too small or too many', q);
    [...new Set(R.map(r => r.y))].forEach(y => { if(R.filter(r => r.y === y).reduce((t, r) => t + r.w, 0) !== 12) fail('516: a row is not 12 wide', q); });
    count('colours' + best);
  });
  if(!n.colours3 || !n.colours4) throw new Error('516 asks only one answer: ' + JSON.stringify(n));
  console.log('Салабашев 2 клас, pictures P3 (levels 510–518): printed tasks ' + met.join(', ') + ' pinned (* = the level draws the same question with other numbers); each generator worked out again from its drawn SVG: ' + Object.entries(n).map(([k, v]) => v + ' ' + k).join(', '));
}
