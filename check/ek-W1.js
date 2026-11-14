// Runs beside the app (in check.js's own scope, through eval), like check/ek-P2.js.
// Европейско Кенгуру, 2 клас — pictures, wave 2, builder B1: counting what a picture shows, with a condition, levels 390–399: 2019 #6 (flowers
// inside one figure, outside another), 2022 #1 (the box with most triangles), 2023 #1 (every circle of a face), 2025 #3 (triangles against
// squares), 2023 #5 (the boat), 2023 #6 (candles), 2024 #5 (the face that is there once), 2024 #10 (the box not dropped), 2026 #4 and #5
// (shoes, rings), 2022 #10 (the baskets). Each printed task is drawn by its level as printed and must come out at the official key by the
// generator's own answer; then every generator is worked out again from the SVG it draws (the shapes, flowers, candles, toys and rings are
// read back from the drawing and counted here, not from the numbers the generator keeps), on 2000–3000 seeds each.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const pin = (name, tag, id, same, shows, key) => {
    const hit = pinSeed(name, () => Q.raw(id), g => same(g) ? 2 : 0, 2e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': the level gives ' + Q.answers(q) + ', the key says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    return q;
  };
  const attr = (s, a) => (s.match(new RegExp('\\s' + a + '="([^"]*)"')) || [])[1];
  const tags = (svg, name) => svg.match(new RegExp('<' + name + '[ >][^>]*>', 'g')) || [];
  const svgs = h => String(h).match(/<svg[\s\S]*?<\/svg>/g) || [];
  const num = (s, a) => +attr(s, a);
  const pts = s => attr(s, 'points').trim().split(/\s+/).map(v => v.split(',').map(Number));
  const texts = svg => [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)].map(m => ({ tag: m[0], body: m[2] }));
  const isUnique = (v, sign) => { const best = Math.max(...v.map(x => x*sign)); return v.filter(x => x*sign === best).length === 1 ? v.findIndex(x => x*sign === best) : -1; };
  const noVote = (feats, pick, what, q) => feats.forEach(v => [1, -1].forEach(sg => { if(isUnique(v, sg) === pick) fail(what + ': the answer is the one with the most or the fewest of something else', q); }));

  // ---- the printed instances
  pin('Кенгуру 2019 task 6', 'ek-2019-2', 390, g => g.x === 'rect' && g.y === 'tri' && g.ans === 9, ['Пчеличката Мая събрала цветен прашец от всяко цветче, което е вътре в правоъгълника, но е извън триъгълника. От колко цветчета е събрала прашец Мая?'], 9);
  pin('Кенгуру 2022 task 1', 'ek-2022-2', 391, g => JSON.stringify(g.boxes) === '[[3,1,2],[1,4,1],[2,2,2],[1,3,1],[1,1,2]]', ['Коя е картинката с най-много триъгълници?'], 1);
  pin('Кенгуру 2023 task 1', 'ek-2023-2', 392, g => g.earIn === 1 && g.pupil === 0 && g.nose === 1 && g.cheek === 0, ['Колко са всички кръгчета на фигурата?'], 8);
  pin('Кенгуру 2025 task 3', 'ek-2025-2', 393, g => g.tri === 6 && g.sq === 1 && g.quad === 2 && g.shapes.length === 15, ['Показани са различни фигурки, между които триъгълници и четириъгълници. С колко триъгълниците са повече от квадратите?'], 5);
  pin('Кенгуру 2023 task 5', 'ek-2023-2', 394, g => JSON.stringify(g.boats) === '[[2,2,1],[3,3,2],[1,5,3],[2,1,3],[3,4,2]]', ['Платноходката ми има повече от едно кръгче и върху едно от платната триъгълничетата са с 2 повече от квадратчетата. Коя е моята лодка?'], 4);
  pin('Кенгуру 2023 task 6', 'ek-2023-2', 395, g => g.big === 7 && g.small === 6 && !g.who, ['Днес дядо има рожден ден. На празничната торта има големи и малки свещички. Всяка голяма отговаря на 10 години, а всяка малка отговаря на 1 година. Колко години навършва дядо днес?'], 76);
  pin('Кенгуру 2024 task 10', 'ek-2024-2', 397, g => JSON.stringify(g.boxes) === '[[0,1,1,2],[0,2,2,3],[0,1,3,3],[1,2,2,3],[0,1,1,3]]', ['Показани са 5 кошнички, номерирани с числата от 1 до 5. Във всяка кошничка има по 4 играчки. Четири от кошничките били изпуснати и играчките в тях се разпилели. Кой е номерът на тази, която не е била изпусната?'], 2);
  pin('Кенгуру 2026 task 4', 'ek-2026-2', 398, g => g.shape === 'shoes' && g.n === 7, ['Приятелите на Ани са ѝ дошли на гости и са си събули обувките, които са показани', 'Колко приятели на Ани са ѝ дошли на гости?'], 7);
  pin('Кенгуру 2026 task 5', 'ek-2026-2', 398, g => g.shape === 'rings' && g.on === 3 && g.off === 2 && g.per === 3, ['Петима играчи хвърлят по един пръстен и се стремят да го нанижат на колчето.', 'За всяко успешно нанизване се присъждат 3 точки. Колко са общо спечелените точки?'], 9);
  pin('Кенгуру 2022 task 10', 'ek-2022-2', 399, g => JSON.stringify(g.b) === '[[0,0],[0,1],[1,0],[0,1],[1,2]]', ['Сивото и черното котета спят в кошници с една и съща форма и еднакви фигурки върху тях, бялото и кафявото кученца спят в кошници с еднакви фигурки върху тях. В коя кошница спи кенгурчето?'], 5);

  const n = {}, count = k => n[k] = (n[k] || 0) + 1;
  // 390: the three figures and every flower read from the SVG; the flowers in one figure and not in the other counted again, a flower never on a line
  const NAMES = { 'правоъгълника': 'rect', 'триъгълника': 'tri', 'кръга': 'circ' };
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(390)); count('flowreg');
    const t = Q.drawQ(q), sv = svgs(t)[0], r = tags(sv, 'rect')[0], poly = pts(tags(sv, 'polygon')[0]), c = tags(sv, 'circle').find(s => attr(s, 'r') === '72');
    const R = [num(r, 'x'), num(r, 'y'), num(r, 'width'), num(r, 'height')], C = [num(c, 'cx'), num(c, 'cy'), num(c, 'r')];
    const fl = texts(sv).filter(x => x.body === '🌼').map(x => [num(x.tag, 'x'), num(x.tag, 'y')]);
    const inside = {
      rect: ([x, y]) => x > R[0] && x < R[0] + R[2] && y > R[1] && y < R[1] + R[3],
      circ: ([x, y]) => Math.hypot(x - C[0], y - C[1]) < C[2],
      tri: ([x, y]) => { let odd = false; for(let a = 0, b = 2; a < 3; b = a++){ const [xa, ya] = poly[a], [xb, yb] = poly[b]; if((ya > y) !== (yb > y) && x < (xb - xa)*(y - ya)/(yb - ya) + xa) odd = !odd; } return odd; },
    };
    const m = t.match(/вътре в (правоъгълника|триъгълника|кръга), но е <b>извън<\/b> (правоъгълника|триъгълника|кръга)/);
    if(!m) fail('390: the question does not name two figures', q);
    const X = NAMES[m[1]], Y = NAMES[m[2]];
    if(X === Y || X !== q.x || Y !== q.y) fail('390: the question names other figures than the generator holds', q);
    const got = fl.filter(p => inside[X](p) && !inside[Y](p)).length;
    if(got !== q.ans || fl.length !== q.flowers.length) fail('390: the flowers in the picture do not give the answer: ' + got, q);
    if(q.traps.includes(q.ans) || q.ans < 5) fail('390: a slip is the answer', q);
    // a flower is never on a line: more than 8 from the rectangle's sides, the triangle's sides and the circle
    const dseg = ([x, y], [[ax, ay], [bx, by]]) => { const u = Math.max(0, Math.min(1, ((x - ax)*(bx - ax) + (y - ay)*(by - ay)) / ((bx - ax)**2 + (by - ay)**2))); return Math.hypot(x - ax - u*(bx - ax), y - ay - u*(by - ay)); };
    const sides = [[[R[0], R[1]], [R[0] + R[2], R[1]]], [[R[0] + R[2], R[1]], [R[0] + R[2], R[1] + R[3]]], [[R[0] + R[2], R[1] + R[3]], [R[0], R[1] + R[3]]], [[R[0], R[1] + R[3]], [R[0], R[1]]], [poly[0], poly[1]], [poly[1], poly[2]], [poly[2], poly[0]]];
    fl.forEach(p => { if(Math.min(...sides.map(s => dseg(p, s)), Math.abs(Math.hypot(p[0] - C[0], p[1] - C[1]) - C[2])) < 8) fail('390: a flower sits on a line', q); });
    fl.forEach((p, a) => fl.forEach((o, b) => { if(a < b && Math.hypot(p[0] - o[0], p[1] - o[1]) < 17) fail('390: two flowers overlap', q); }));
  }
  // 391: the triangles of every box counted in its own SVG; the right box has more than every other, and nothing else points to it
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(391)); count('boxtri');
    const tri = [], cir = [], sq = [], tot = [];
    q.options.forEach(o => {
      const sv = o.text[0], p = tags(sv, 'polygon').filter(s => pts(s).length === 3).length, c = tags(sv, 'circle').length, s = tags(sv, 'rect').filter(r => attr(r, 'width') === '18').length;
      if(tags(sv, 'rect').length !== s + 1 || tags(sv, 'polygon').length !== p) fail('391: a shape in a box is neither a triangle, a circle nor a square', q);
      tri.push(p); cir.push(c); sq.push(s); tot.push(p + c + s);
    });
    if(isUnique(tri, 1) !== q.pick) fail('391: the picked box is not the only one with the most triangles', q);
    noVote([cir, sq, tot], q.pick, '391', q);
    if(q.options.some(o => o.text[1].replace('коробка', 'кутия').replace('з фігурами', 'с фигурки') !== o.text[0])) fail('391: the Ukrainian option is another picture', q);
    if(tot.some(v => v < 4 || v > 6)) fail('391: a box has not 4 to 6 shapes', q);
  }
  // 392: every <circle> is a circle of the face (the mouth is a path); inside or beside, all counted
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(392)); count('circfig');
    const sv = svgs(Q.drawQ(q))[0];
    if(tags(sv, 'circle').length !== q.ans || tags(sv, 'ellipse').length) fail('392: the circles drawn are not the answer', q);
    if(q.traps.includes(q.ans) || q.ans < 7 || q.ans > 12) fail('392: a slip is the answer, or the face is out of range', q);
  }
  // 393: every polygon read as three points (a triangle) or four (a square when its sides and its diagonals are all equal), the others ignored
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(393)); count('shapecount');
    const sv = svgs(Q.drawQ(q))[0], d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    let tri = 0, sq = 0, quad = 0;
    tags(sv, 'polygon').forEach(s => {
      const p = pts(s);
      if(p.length === 3) tri++;
      else if(p.length === 4){
        const sd = [0, 1, 2, 3].map(k => d(p[k], p[(k + 1) % 4])), dg = [d(p[0], p[2]), d(p[1], p[3])], spread = Math.max(Math.max(...sd) - Math.min(...sd), Math.abs(dg[0] - dg[1]));
        if(spread < 0.5) sq++;
        else if(spread < 3) fail('393: a four-cornered shape that is nearly a square', q);
        else quad++;
      }
    });
    if(tri !== q.tri || sq !== q.sq || quad !== q.quad || tri - sq !== q.ans) fail('393: the shapes drawn do not give the answer: ' + tri + ' triangles, ' + sq + ' squares, ' + quad + ' other', q);
    if(q.ans < 2 || q.shapes.length > 18 || q.traps.includes(q.ans)) fail('393: the answer is too small, too many shapes or a slip is the answer', q);
    // no two shapes closer than their size: each lies in its own cell
    q.shapes.forEach((a, k) => q.shapes.forEach((b, l) => { if(k < l && Math.hypot(a.cx - b.cx, a.cy - b.cy) < 44) fail('393: two shapes overlap', q); }));
  }
  // 394: each boat's portholes, triangles and squares counted in its SVG; exactly one boat has more than one porthole and two more triangles than squares
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(394)); count('boats');
    const c = q.options.map(o => { const sv = o.text[0]; return [tags(sv, 'circle').filter(s => attr(s, 'stroke') === 'var(--bad)').length, tags(sv, 'polygon').filter(s => attr(s, 'fill') === 'var(--good)').length, tags(sv, 'rect').filter(s => attr(s, 'width') === '9').length]; });
    const ok = c.map((b, k) => b[0] > 1 && b[1] === b[2] + 2 ? k : -1).filter(k => k >= 0);
    if(ok.length !== 1 || ok[0] !== q.pick) fail('394: not exactly the picked boat has more than one porthole and two more triangles than squares: ' + ok, q);
    if(c.filter(b => b[1] === b[2] + 2).length !== 2 || c.filter(b => b[0] === 1).length !== 1) fail('394: the near miss (one porthole) is missing or doubled', q);
    noVote([c.map(b => b[0]), c.map(b => b[1]), c.map(b => b[2]), c.map(b => b[0] + b[1] + b[2])], q.pick, '394', q);
    if(new Set(c.map(b => b.join())).size !== 5) fail('394: two boats alike', q);
    q.options.forEach(o => { const m = [...tags(o.text[0], 'polygon').filter(s => attr(s, 'fill') === 'var(--good)').map(s => pts(s).reduce((a, p) => [a[0] + p[0] / 3, a[1] + p[1] / 3], [0, 0])),
      ...tags(o.text[0], 'rect').filter(s => attr(s, 'width') === '9').map(s => [num(s, 'x') + 4.5, num(s, 'y') + 4.5])];
      m.forEach((a, k) => m.forEach((b, l) => { if(k < l && Math.hypot(a[0] - b[0], a[1] - b[1]) < 9) fail('394: two marks on a sail overlap', q); })); });
  }
  // 395: the candles told by height in the SVG: tall ones are tens, short ones are ones
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(395)); count('candles');
    const r = tags(svgs(Q.drawQ(q))[0], 'rect').filter(s => attr(s, 'width') === '8'), h = r.map(s => num(s, 'height'));
    if(h.some(v => v !== 54 && v !== 26)) fail('395: a candle of another size', q);
    const big = h.filter(v => v === 54).length, small = h.length - big;
    if(big*10 + small !== q.ans || q.traps.includes(q.ans) || q.big === q.small) fail('395: the candles drawn do not give the age', q);
    const xs = r.map(s => num(s, 'x')).sort((a, b) => a - b);
    xs.forEach((x, k) => { if(k && x - xs[k - 1] < 9) fail('395: two candles overlap', q); });
  }
  // 396: the 15 faces read back from their SVG as hat, glasses, open mouth; every kind twice but one, which is the picked option
  const feats = f => (/var\(--grape\)/.test(f) ? 1 : 0) + (/r="5\.5"/.test(f) ? 2 : 0) + (/<ellipse/.test(f) ? 4 : 0);
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(396)); count('faces');
    const sv = svgs(Q.drawQ(q))[0], cells = [...sv.matchAll(/<g transform="translate\((\d+) (\d+)\)">([\s\S]*?)<\/g>/g)].map(m => feats(m[3])), seen = {};
    cells.forEach(t => seen[t] = (seen[t] || 0) + 1);
    const once = Object.keys(seen).filter(t => seen[t] === 1), twice = Object.keys(seen).filter(t => seen[t] === 2);
    if(cells.length !== 15 || once.length !== 1 || twice.length !== 7) fail('396: the grid is not 15 faces, 7 kinds twice and one once', q);
    const opt = q.options.map(o => feats(o.text[0]));
    if(new Set(opt).size !== 5 || opt[q.pick] !== +once[0]) fail('396: the picked option is not the face that is there once', q);
    opt.forEach((t, k) => { if(k !== q.pick && seen[t] !== 2) fail('396: an option that is not in the grid twice', q); });
    [1, 2, 4].forEach(bit => { if(opt.filter(t => t & bit).length*2 === 5) fail('396: a tie', q); });
    const maj = [1, 2, 4].reduce((a, bit) => a + (opt.filter(t => t & bit).length*2 > 5 ? bit : 0), 0);
    if(maj === opt[q.pick] || (7 - maj) === opt[q.pick]) fail('396: a vote on the three things gives the answer', q);
  }
  // 397: boxes and floor read from the emoji of the SVG; what is missing from the floor is the toys of one box, and of one only
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(397)); count('toybox');
    const em = texts(svgs(Q.drawQ(q))[0]).filter(x => !/^\d$/.test(x.body)).map(x => x.body), boxes = [0, 1, 2, 3, 4].map(b => em.slice(b*4, b*4 + 4)), floor = em.slice(20);
    if(em.length !== 36 || floor.length !== 16) fail('397: not 20 toys in the boxes and 16 on the floor', q);
    const tally = a => { const m = {}; a.forEach(e => m[e] = (m[e] || 0) + 1); return m; }, key = a => JSON.stringify(Object.entries(tally(a)).sort());
    const all = [].concat(...boxes), want = tally(all), f = tally(floor), left = Object.keys(want).map(e => e + (want[e] - (f[e] || 0))).sort().join();
    const fits = boxes.map((b, k) => { const m = tally(b); return Object.keys(want).map(e => e + (m[e] || 0)).sort().join() === left ? k + 1 : 0; }).filter(Boolean);
    if(fits.length !== 1 || fits[0] !== q.ans || new Set(boxes.map(key)).size !== 5) fail('397: what is missing from the floor does not fit exactly the answer box: ' + fits, q);
    if(Object.keys(f).some(e => f[e] > want[e])) fail('397: a toy on the floor that is in no box', q);
  }
  // 398: shoes counted in the SVG, two to a friend (every kind an even number of times); rings: the ellipses round the peg against those away from it
  const SHOES = ['👞', '👟', '👠', '👢', '🥾', '🥿'];
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(398)); count('tally ' + q.shape);
    const sv = svgs(Q.drawQ(q))[0];
    if(q.shape === 'shoes'){
      const sh = texts(sv).map(x => x.body), by = {};
      sh.forEach(e => by[e] = (by[e] || 0) + 1);
      if(sh.length !== 2*q.ans || sh.some(e => !SHOES.includes(e)) || Object.values(by).some(v => v % 2) || q.traps.includes(q.ans)) fail('398: the shoes drawn are not two to a friend, or a slip is the answer', q);
      const at = q.items.map(s => [s.x, s.y]); at.forEach((a, k) => at.forEach((b, l) => { if(k < l && Math.hypot(a[0] - b[0], a[1] - b[1]) < 26) fail('398: two shoes overlap', q); }));
    } else {
      const peg = tags(sv, 'rect').find(s => attr(s, 'height') === '120'), px = num(peg, 'x') + num(peg, 'width') / 2, el = tags(sv, 'ellipse').map(s => num(s, 'cx'));
      const on = el.filter(x => Math.abs(x - px) < 2).length, off = el.filter(x => Math.abs(x - px) > 40).length;
      if(on + off !== el.length || on !== q.on || off !== q.off || on*q.per !== q.ans || q.traps.includes(q.ans)) fail('398: the rings drawn do not give the points', q);
      if(tags(sv, 'path').length !== on) fail('398: a ring on the peg is not drawn threaded', q);
    }
  }
  // 399: every basket read as a body (a box, a bucket) and a figure; every way of giving the animals their own basket tried again here
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(399)); count('baskets');
    const sv = svgs(Q.drawQ(q))[0], b = [];
    [...sv.matchAll(/<(rect|polygon|circle)\b([^>]*)>/g)].forEach(m => {
      const el = '<' + m[1] + m[2] + '>', fill = attr(el, 'fill');
      if(fill === 'var(--warm)') b.push([m[1] === 'polygon' ? 1 : 0, -1]);
      else if(fill === 'var(--accent)') b[b.length - 1][1] = 0;
      else if(fill === 'var(--bad)') b[b.length - 1][1] = 1;
      else if(fill === 'var(--good)') b[b.length - 1][1] = 2;
      else if(fill === 'var(--grape)') b[b.length - 1][1] = 3;
    });
    if(b.length !== 5 || b.some(x => x[1] < 0) || JSON.stringify(b) !== JSON.stringify(q.b)) fail('399: the baskets drawn are not the generator\'s', q);
    const out = new Set(), perm = (a, k) => k === 0 ? [[]] : a.flatMap(x => perm(a.filter(y => y !== x), k - 1).map(r => [x].concat(r)));
    perm([0, 1, 2, 3, 4], 5).forEach(([g, bl, w, br, kg]) => { if(b[g][0] === b[bl][0] && b[g][1] === b[bl][1] && b[w][1] === b[br][1]) out.add(kg + 1); });
    if(out.size !== 1 || !out.has(q.ans)) fail('399: not exactly the answer basket is left: ' + [...out], q);
    let alike = 0; for(let x = 0; x < 5; x++) for(let y = x + 1; y < 5; y++) if(b[x][0] === b[y][0] && b[x][1] === b[y][1]) alike++;
    if(alike !== 1 || !q.cats.every(k => k !== q.ans - 1) || b[q.cats[0]][1] !== b[q.cats[1]][1] || b[q.cats[0]][0] !== b[q.cats[1]][0] || b[q.pups[0]][1] !== b[q.pups[1]][1]) fail('399: the solution pairs are not the alike baskets', q);
  }
  console.log('Кенгуру 2 клас, counting a picture (390–399): 2019 #6, 2022 #1, 2023 #1, 2025 #3, 2023 #5, 2023 #6, 2024 #10, 2026 #4, #5, 2022 #10 pinned as printed; every picture read back from its SVG and worked out again on 2000–3000 seeds each: ' + JSON.stringify(n));
}
