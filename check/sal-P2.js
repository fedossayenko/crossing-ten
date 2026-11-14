// Runs beside the app (in check.js's own scope, through eval), like check/ek-W1.js.
// Салабашев, 2 клас — picture tasks, builder P2: 2019 #6 (the rectangle of four squares) → the widened 21 (shape 7), 2019 #12 (the letters Т and Ш) → 504,
// 2020 #8 (a square of 3 дм with a 12 см strip cut off) → 502, 2020 #10 (the house of two triangles and a square) → the widened 97 (shape 'house'), 2021 #7 (two carpets
// side by side) → 503, 2024 #13 (a square with a notch and a triangle) → 500, 2025 #4 (the hare's two ways) → 505, 2025 #7 (two rectangles and a square) → 501.
// Each printed task is drawn by its level as printed and must come out at the official key by the generator's own answer (2021 #7: its key is the option «16 дм на 15 дм»;
// the paper's other three options, 15 на 32, 8 на 30 and 15 на 23, would be picked out by their sums, so the level mixes its slips, see below). Then every
// generator is worked out again from the SVG it draws (rects, polygons, paths, lines and labels read back from the markup, scaled by a length the text gives),
// not from the fields the generator keeps, on 2000 seeds each.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 400)); };
  const tagged = (id, tag) => { if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag); };
  const pin = (name, tag, id, same, shows, key) => {
    const hit = pinSeed(name, () => Q.raw(id), g => same(g) ? 2 : 0, 2e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    tagged(id, tag);
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': the level gives ' + Q.answers(q) + ', the key says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    return q;
  };
  const attr = (s, a) => (s.match(new RegExp('\\s' + a + '="([^"]*)"')) || [])[1];
  const tagsOf = (svg, name) => String(svg).match(new RegExp('<' + name + '[ >][^>]*>', 'g')) || [];
  const rects = html => tagsOf(html, 'rect').map(t => ({ x: +attr(t, 'x'), y: +attr(t, 'y'), w: +attr(t, 'width'), h: +attr(t, 'height'), fill: attr(t, 'fill') }));
  const polys = html => tagsOf(html, 'polygon').map(t => ({ pts: attr(t, 'points').trim().split(/\s+/).map(p => p.split(',').map(Number)), fill: attr(t, 'fill') }));
  const lines = html => tagsOf(html, 'line').map(t => ({ p: [+attr(t, 'x1'), +attr(t, 'y1'), +attr(t, 'x2'), +attr(t, 'y2')], stroke: attr(t, 'stroke') }));
  const labels = html => [...String(html).matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m => m[1].trim());
  const plain = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const ints = h => (plain(h).match(/\d+/g) || []).map(Number);
  const near = (a, b, e = 0.02) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  // the outline of a union of axis-parallel rectangles (px), on a grid of half a unit: the number of unit edges between a covered and an uncovered cell
  const outline = (rs, unit) => {
    const cell = unit / 2, cov = new Set();
    rs.forEach(r => { for(let i = Math.round(r.x / cell); i < Math.round((r.x + r.w) / cell); i++) for(let j = Math.round(r.y / cell); j < Math.round((r.y + r.h) / cell); j++) cov.add(i + ',' + j); });
    let e = 0; cov.forEach(k => { const [i, j] = k.split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { if(!cov.has((i + a) + ',' + (j + b))) e++; }); });
    return e / 2;     // each unit edge is two half-unit cell edges
  };
  const met = [], n = {}, count = k => n[k] = (n[k] || 0) + 1;

  // ---- the printed instances
  // 21: the grey square 4 см, the big one over the three small ones: 12 by 16, 12 + 16 + 12 + 16 = 56 (the key В)
  {
    const q = pin('Салабашев 2019 task 6', 'sal-2019-2', 21, g => g.shape === 7 && g.s === 4 && g.grey === 1, ['Правоъгълникът на чертежа е сглобен от 4 квадрата. Страната на сивия квадрат е 4 см. Колко сантиметра е обиколката на целия правоъгълник?'], 56);
    met.push('2019 #6 (21)');
  }
  // 504: Т 44, one rectangle 24, Ш 84 (the key)
  { pin('Салабашев 2019 task 12', 'sal-2019-2', 504, g => g.p === 24 && g.T === 44, ['Обиколката на един правоъгълник е 24 см. Фигурата с форма на буквата Т има обиколка 44 см.'], 84); met.push('2019 #12 (504)'); }
  // 502: 3 дм, a strip of 12 см: 30 − 12 = 18, 30 + 18 + 30 + 18 = 96 (the key А)
  { pin('Салабашев 2020 task 8', 'sal-2020-2', 502, g => g.a === 3 && g.b === 12, ['От квадрат със страна 3 дм е отрязана ивица с ширина 12 см'], 96); met.push('2020 #8 (502)'); }
  // 97: the yellow triangle 12 = the red one with legs 14: the base 8, the square's four sides 32 (the key Б)
  { pin('Салабашев 2020 task 10', 'sal-2020-2', 97, g => g.shape === 'house' && g.t === 12 && g.leg === 14, ['със страна 12 см е равна на обиколката на червения равнобедрен триъгълник с бедро 14 см'], 32); met.push('2020 #10 (97)'); }
  // 503: two carpets 8 дм on 15 дм side by side along the long side: 16 дм on 15 дм (the key А)
  {
    const name = 'Салабашев 2021 task 7', hit = pinSeed(name, () => Q.raw(503), g => g.a === 8 && g.L === 15 ? 2 : 0, 2e6);
    if(!hit) throw new Error(name + ': level 503 never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    if(t.indexOf('двакилимасразмери8дмна15дмединдодругподългатаимстрана') < 0) throw new Error(name + ' is not drawn as printed: ' + t);
    tagged(503, 'sal-2021-2');
    if(q.options[q.pick].text[0] !== '16 дм на 15 дм' || Q.answers(q).join() !== String(q.pick) || !Q.accepts(q, [String(q.pick)])) throw new Error(name + ': the key А (16 дм на 15 дм) is not the answer');
    met.push('2021 #7 (503)');
  }
  // 500: the square 15 with a 3 см notch and the triangle 15, 11, 6: 62 (the key)
  { pin('Салабашев 2024 task 13', 'sal-2024-2', 500, g => g.S === 15 && g.n === 3 && g.a === 11 && g.b === 6, ['квадрат със страна 15 см, от който е изрязано квадратче със страна 3 см, и триъгълник със страни 15 см, 11 см и 6 см'], 62); met.push('2024 #13 (500)'); }
  // 505: З–Б 22, Б–М 17, З–П 36, П–М 15: 51 − 39 = 12 (the key А)
  { pin('Салабашев 2025 task 4', 'sal-2025-2', 505, g => g.a === 22 && g.b === 17 && g.c === 36 && g.d === 15, ['С колко метра по-малко ще измине Зайко, ако мине край борчето, вместо край поточето?'], 12); met.push('2025 #4 (505)'); }
  // 501: the short side 3, the long one 5 longer: 14 wide, 6 high, 40 (the key Г)
  { pin('Салабашев 2025 task 7', 'sal-2025-2', 501, g => g.s === 3 && g.d === 5, ['Късата страна на всеки от двата еднакви малки правоъгълника е 3 см, а дългата страна е с 5 см по-дълга от нея'], 40); met.push('2025 #7 (501)'); }

  // ---- every generator again, from its picture
  // 21 shape 7: four squares, three alike in a row under the big one; the grey one's side gives the scale; the outline of the union is the answer
  for(let i = 1, seen = 0; seen < 400 && i <= 40000; i++){
    const q = Q.seeded(i, () => Q.raw(21)); if(q.shape !== 7) continue; seen++;
    const html = Q.drawQ(q), rs = rects(html), grey = rs.filter(r => r.fill === 'var(--fur)'), s = +plain(html).match(/Страната на сивия квадрат е (\d+) см/)[1];
    if(rs.length !== 4 || grey.length !== 1 || rs.some(r => !near(r.w, r.h, 0.001))) fail('21/7: ' + rs.length + ' squares, ' + grey.length + ' grey', q);
    const small = rs.filter(r => r.w < rs[0].w - 0.01), big = rs[0];
    if(small.length !== 3 || !small.every(r => near(r.w, grey[0].w, 0.001) && near(r.y, big.y + big.h, 0.001)) || !near(3 * grey[0].w, big.w, 0.001)) fail('21/7: the squares are not a big one over three small', q);
    const unit = grey[0].w / s, ans = outline(rs, unit);
    if(ans !== q.ans || Q.answers(q).join() !== String(ans)) fail('21/7: the picture gives ' + ans, q);
    if(/[×÷·]/.test(plain(html) + Q.why(q, true))) fail('21/7: a times sign', q);
    count('sqrows');
  }
  // 97 house: the green square's side is the red triangle's base; the yellow one is equilateral; the perimeters are equal; the scale from the yellow side's label
  for(let i = 1, seen = 0; seen < 400 && i <= 40000; i++){
    const q = Q.seeded(i, () => Q.raw(97)); if(q.shape !== 'house') continue; seen++;
    const html = Q.drawQ(q), sq = rects(html)[0], [red, yel] = polys(html), t = ints(html.match(/<div class="ask">[\s\S]*?<\/div>/)[0]);
    const ys = [dist(yel.pts[0], yel.pts[1]), dist(yel.pts[1], yel.pts[2]), dist(yel.pts[2], yel.pts[0])], unit = ys[0] / t[0];
    const rl = [dist(red.pts[0], red.pts[2]), dist(red.pts[1], red.pts[2])], base = dist(red.pts[0], red.pts[1]);
    if(!ys.every(v => near(v, ys[0])) || !near(rl[0], rl[1]) || !near(rl[0] / unit, t[1]) || !near(base, sq.w) || !near(sq.w, sq.h) || sq.fill !== 'var(--good)' || red.fill !== 'var(--bad)' || yel.fill !== 'var(--warm)') fail('97/house: the picture is not the task', q);
    if(!near(2 * rl[0] / unit + base / unit, 3 * ys[0] / unit, 0.002)) fail('97/house: the two perimeters differ in the picture', q);
    const ans = Math.round(4 * sq.w / unit);
    if(ans !== q.ans || Q.answers(q).join() !== String(ans) || !(rl[0] > base)) fail('97/house: the picture gives ' + ans, q);
    if(/[×÷·]/.test(plain(html) + Q.why(q, true))) fail('97/house: a times sign', q);
    count('isohouse');
  }
  // 500: the outline path is walked edge by edge; the scale from the glued line and the first number of the text
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(500)), html = Q.drawQ(q), d = html.match(/<path d="([^"]*)"/)[1], pts = d.replace(/[MZ]/g, '').split('L').map(s => s.trim().split(',').map(Number));
    const glue = lines(html)[0], S = +plain(html).match(/квадрат със страна (\d+) см/)[1], unit = Math.abs(glue.p[2] - glue.p[0]) / S;
    let per = 0; for(let k = 0; k < pts.length; k++) per += dist(pts[k], pts[(k + 1) % pts.length]);
    const lab = labels(html).map(t => parseInt(t)).sort((a, b) => a - b), want = [q.n, q.a, q.b, q.S].sort((a, b) => a - b);
    const apex = pts[3], ls = [dist(pts[4], apex) / unit, dist(pts[2], apex) / unit];
    if(pts.length !== 7 || lab.join() !== want.join() || !near(ls[0], q.a, 0.01) || !near(ls[1], q.b, 0.01)) fail('500: the picture is not the task', q);
    const ans = Math.round(per / unit);
    if(!near(per / unit, ans, 0.01) || ans !== q.ans || Q.answers(q).join() !== String(ans)) fail('500: the outline drawn is ' + per / unit, q);
    if(q.a === q.b || q.a + q.b <= q.S) fail('500: not a triangle', q);
    count('roof');
  }
  // 501: four rectangles, the square as high as the two stacked; the scale from the short side's label in the text; the answer from the outer rectangle
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(501)), html = Q.drawQ(q), rs = rects(html), t = ints(html.match(/<div class="ask">[\s\S]*?<\/div>/)[0]);
    const [big, r1, r2, sq] = rs, unit = r1.h / t[0];
    if(rs.length !== 4 || !near(r1.w, r2.w) || !near(r1.h, r2.h) || !near(sq.w, sq.h) || !near(sq.h, 2 * r1.h) || !near(big.h, sq.h) || !near(big.w, r1.w + sq.w) || !near(r1.w / unit, t[0] + t[1])) fail('501: the picture is not the task', q);
    const ans = Math.round(2 * (big.w + big.h) / unit);
    if(ans !== q.ans || Q.answers(q).join() !== String(ans) || /[×÷·]/.test(plain(html) + Q.why(q, true))) fail('501: the picture gives ' + ans, q);
    count('beside');
  }
  // 502: the orange rectangle's width from its pixels, the scale from the square's side (the text's дм)
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(502)), html = Q.drawQ(q), rs = rects(html), t = ints(html.match(/<div class="ask">[\s\S]*?<\/div>/)[0]);
    const [orange, strip2] = rs, unit = orange.h / (10 * t[0]);
    if(rs.length !== 2 || orange.fill !== 'var(--warm)' || strip2.fill !== 'var(--paper)' || !near(strip2.w / unit, t[1], 0.01) || !near((orange.w + strip2.w) / unit, 10 * t[0], 0.01)) fail('502: the picture is not the task', q);
    const ans = Math.round(2 * (orange.w + orange.h) / unit);
    if(ans !== q.ans || Q.answers(q).join() !== String(ans) || /[×÷·]/.test(plain(html) + Q.why(q, true))) fail('502: the picture gives ' + ans, q);
    count('strip');
  }
  // 503: two carpets drawn side by side; the joined size read from them; exactly one option says it; no vote on the numbers
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(503)), html = Q.drawQ(q), rs = rects(html), t = ints(html.match(/<div class="ask">[\s\S]*?<\/div>/)[0]);
    const unit = rs[0].w / t[0];
    if(rs.length !== 2 || !near(rs[1].x, rs[0].x + rs[0].w) || !near(rs[0].h / unit, t[1]) || !near(rs[1].w, rs[0].w) || t[1] <= t[0]) fail('503: the picture is not the task', q);
    const want = Math.round(2 * rs[0].w / unit) + ' дм на ' + Math.round(rs[0].h / unit) + ' дм', hits = q.options.map((o, j) => o.text[0] === want ? j : -1).filter(j => j >= 0);
    if(q.options.length !== 4 || hits.length !== 1 || hits[0] !== q.pick || q.ans !== q.pick || !q.own || new Set(q.options.map(o => o.text[0])).size !== 4) fail('503: the options do not hold the joined size once: ' + want, q);
    const pairs = q.options.map(o => o.text[0].match(/\d+/g).map(Number)), feats = p => [p[0], p[1], p[0] + p[1], p[0] * p[1]];
    for(let k = 0; k < 4; k++) { const v = pairs.map(p => feats(p)[k]); [1, -1].forEach(sg => { const best = Math.max(...v.map(x => x * sg)); if(v.filter(x => x * sg === best).length === 1 && v.findIndex(x => x * sg === best) === q.pick) fail('503: the answer is the one with the most or the fewest of something else', q); }); }
    if(/[×÷·]/.test(plain(html) + Q.why(q, true))) fail('503: a times sign', q);
    count('carpets');
  }
  // 504: the union of each letter's rectangles measured on a grid; the scale from one rectangle's outline in the text
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(504)), html = Q.drawQ(q), rs = rects(html), t = ints(html.match(/<div class="ask">[\s\S]*?<\/div>/)[0]);
    if(rs.length !== 6) fail('504: ' + rs.length + ' rectangles', q);
    const unit = 2 * (rs[0].w + rs[0].h) / t[0], T = rs.slice(0, 2), Sh = rs.slice(2);
    if(!rs.every(r => near(Math.max(r.w, r.h), rs[0].w) && near(Math.min(r.w, r.h), rs[0].h)) || Math.min(...Sh.map(r => r.x)) < Math.max(...T.map(r => r.x + r.w))) fail('504: the rectangles are not equal or the letters overlap', q);
    const pT = outline(T, unit), pS = outline(Sh, unit);
    if(pT !== t[1] || pS !== q.ans || Q.answers(q).join() !== String(pS) || /[×÷·]/.test(plain(html) + Q.why(q, true))) fail('504: the picture gives Т ' + pT + ' and Ш ' + pS, q);
    count('tsh');
  }
  // 505: four lines labelled with their metres, drawn to scale; the right angle at П; the answer from the labels in the order the lines are drawn
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(505)), html = Q.drawQ(q), ls = lines(html).filter(l => l.stroke === 'var(--ink)'), km = labels(html).filter(t => /^\d+ м$/.test(t)).map(t => parseInt(t));
    if(ls.length !== 4 || km.length !== 4) fail('505: ' + ls.length + ' roads, ' + km.length + ' labels', q);
    const len = ls.map(l => dist([l.p[0], l.p[1]], [l.p[2], l.p[3]])), unit = len[0] / km[0];
    if(!len.every((v, j) => near(v / unit, km[j], 0.01))) fail('505: the picture is not to scale', q);
    const [zb, bm, zp, pm] = km, A = ls[2].p, B = ls[3].p;
    if(ls[0].p[0] !== ls[2].p[0] || ls[0].p[1] !== ls[2].p[1] || !near(ls[1].p[2], ls[3].p[2]) || A[1] !== A[3] || B[0] !== B[2] || !near(zb + bm, Math.hypot(zp, pm), 0.001)) fail('505: not a right triangle with Б on the long side', q);
    const ans = zp + pm - (zb + bm);
    if(ans <= 0 || ans !== q.ans || Q.answers(q).join() !== String(ans)) fail('505: the picture gives ' + ans, q);
    count('hare');
  }
  console.log('Салабашев 2 клас, picture tasks P2: ' + met.join(', ') + ' match the official key (2021 #7: the key option is the joined size, no key list held) and are asked by their levels; each generator worked out again from its own drawn picture: ' + Object.entries(n).map(([k, v]) => k + ' ' + v).join(', '));
}
