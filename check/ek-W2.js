// Runs beside the app (in check.js's own scope, through eval), like check/ek-A.js.
// Европейско Кенгуру, 2 клас — pictures, wave 2, builder B2, numbers in grids and tables: 400 the vases (2023 #3), 401 the square with a big sum
// (2019 #23), 402 the code table (2021 #12), 403 the constellations (2021 #8), 404 the digit under a shape (2022 #9), 405 the two houses (2022 #17),
// 406 the figure over the table (2023 #22), 407 the coin on the letter (2022 #6), 408 the ladybugs (2025 #21), 409 the coloured pyramid (2025 #23).
// Each printed task is checked against the official key: pinned as printed where a seed can draw it, otherwise the kind's own solver is run on the
// printed instance and must give the key; then every generator is worked out again from the SVG it draws (the numbers, letters, coins, ladybugs and
// squares are read back from the pictures and solved here by brute force, not from the numbers the generator keeps).
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, '');
  const plain = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const svgs = h => String(h).match(/<svg[\s\S]*?<\/svg>/g) || [];
  const allNums = svg => [...svg.matchAll(/<text[^>]*>(\d+)<\/text>/g)].map(m => +m[1]);
  const texts = (h, cls) => [...String(h).matchAll(new RegExp('<text class="' + cls + '"[^>]*? x="([-\\d.]+)" y="([-\\d.]+)"[^>]*>([^<]*)</text>', 'g'))].map(m => ({ x: +m[1], y: +m[2], t: m[3] }));
  const sum = a => a.reduce((s, x) => s + x, 0);
  const tagged = (id, tags) => tags.forEach(t => { if(!Q.LEVELS.find(l => l.id === id).papers.includes(t)) throw new Error('level ' + id + ' is not tagged ' + t); });
  const printed = (name, tag, id, ok, shows, cap) => {
    const hit = pinSeed(name, () => Q.raw(id), g => ok(g) ? 2 : 0, cap || 3e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const t = strip(Q.drawQ(hit.q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    tagged(id, [tag]);
    return hit.q;
  };
  const sameAll = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
  const mostCentral = (rows) => { const near = rows.map(w => rows.reduce((s, x) => s + (x === w ? 0 : [...w].filter((c, i) => c === x[i]).length), 0)); return near; };

  // ---- 400: the vases. Printed: A 28, B 26, C 27, D 24, E 25 → A
  {
    const P = [[8, 7, 4, 9], [4, 6, 7, 9], [7, 9, 4, 7], [9, 7, 4, 4], [7, 4, 9, 5]];
    if(Q.vasesBest(P) !== 0 || P.map(sum).join() !== '28,26,27,24,25') throw new Error('Кенгуру 2023 task 3: the vases do not give A (28)');
    tagged(400, ['ek-2023-2']);
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(400)), vs = q.options.map(o => allNums(o.text[0]));
      if(q.options.length !== 5 || vs.some(v => v.length !== 4 || v.some(n => n < 1 || n > 9))) fail('400: five vases of four balls expected', q);
      const s = vs.map(sum), m = Math.max(...s);
      if(s.filter(x => x === m).length !== 1 || s.indexOf(m) !== q.pick) fail('400: the picked vase is not the only one with the largest sum', q);
      const top = Math.max(...vs.flat()), holders = vs.map((v, k) => v.includes(top) ? k : -1).filter(k => k >= 0);
      if(holders.length === 1 && holders[0] === q.pick) fail('400: the vase with the biggest ball is the answer by that alone', q);
      if(!strip(Q.drawQ(q)).includes('Вкоявазасборът')) fail('400: not the question asked', q);
    }
  }

  // ---- 401: the table 1-20, the square over 63
  {
    const over = Q.bigSquares(4, 5).filter(s => s.sum > 63), common = over[0].cells.filter(x => over[1].cells.includes(x));
    if(over.length !== 2 || common.join() !== '14,19') throw new Error('Кенгуру 2019 task 23: the squares over 63 are not the two that hold 14 and 19');
    const q0 = printed('Кенгуру 2019 task 23', 'ek-2019-2', 401, g => g.R === 4 && g.C === 5 && g.S === 63 && g.right === 14 && g.nums.join() === '14,15,17,18,20',
      ['по-голям от 63', 'Кое от числата по-долу със сигурност е било в избрания квадрат?']);
    if(q0.options[q0.pick].text[0] !== '14') throw new Error('Кенгуру 2019 task 23: the picked option is not 14 (A)');
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(401)), h = Q.drawQ(q), cells = texts(h, 'cn').sort((a, b) => a.y - b.y || a.x - b.x).map(c => +c.t), S = +plain(h).match(/по-голям от (\d+)\./)[1];
      const C = new Set(texts(h, 'cn').map(c => c.x)).size, R = cells.length / C;
      if(cells.some((n, k) => n !== k + 1) || C !== q.C || R !== q.R) fail('401: the table is not 1, 2, 3 … along the rows', q);
      const sq = []; for(let r = 0; r + 1 < R; r++) for(let c = 0; c + 1 < C; c++) sq.push([cells[r*C + c], cells[r*C + c + 1], cells[(r + 1)*C + c], cells[(r + 1)*C + c + 1]]);
      const big = sq.filter(s => sum(s) > S), every = big[0].filter(x => big.every(b => b.includes(x)));
      const good = q.options.filter(o => every.includes(+o.text[0]));
      if(big.length < 2 || good.length !== 1 || good[0].id !== q.pick) fail('401: not exactly one option is in every square over ' + S, q);
      if(q.options.length !== 5 || new Set(q.options.map(o => o.text[0])).size !== 5) fail('401: five different numbers expected', q);
    }
  }

  // ---- 402: the code table
  {
    const q0 = printed('Кенгуру 2021 task 12', 'ek-2021-2', 402, g => g.lay === 0 && g.code.join('|') === 'B4|D2|A2|A4', ['ПЛИСКА има код C3|A2|B3|C1|A1|D1', 'Коя е думата с код B4|D2|A2|A4?'], 3e6);
    if(q0.options[q0.pick].text[0] !== 'КОЛА') throw new Error('Кенгуру 2021 task 12: the picked option is not КОЛА (E)');
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(402)), h = Q.drawQ(q), cl = texts(h, 'cl').sort((a, b) => a.y - b.y || a.x - b.x).map(c => c.t);
      if(cl.length !== 16) fail('402: a 4 × 4 table expected', q);
      const dec = c => cl[(+c[1] - 1)*4 + 'ABCD'.indexOf(c[0])], word = code => code.split('|').map(dec).join('');
      const t = plain(h), asked = t.match(/с код ([A-D]\d(?:\|[A-D]\d){3})\?/)[1], ex = t.match(/думата (\S+) има код (\S+)\./);
      if(word(ex[2]) !== ex[1]) fail('402: the example code does not spell its word', q);
      const mine = q.options.filter(o => o.text[0] === word(asked));
      if(mine.length !== 1 || mine[0].id !== q.pick || q.options.length !== 5 || new Set(q.options.map(o => o.text[0])).size !== 5) fail('402: exactly one option must be the decoded word', q);
      const near = mostCentral(q.options.map(o => o.text[0]));
      if(near[q.pick] === Math.max(...near) && near.filter(x => x === near[q.pick]).length === 1) fail('402: the right word is the one the others are closest to', q);
    }
  }

  // ---- 403: the constellations. Printed: A 3 4 6 7, B 5 7 8, C 3 7 2 5 8, D 5 1 4 9, E 9 2 9; the different numbers that are not 3 add to 20 → B
  {
    const P = [[3, 4, 6, 7], [5, 7, 8], [3, 7, 2, 5, 8], [5, 1, 4, 9], [9, 2, 9]], v = P.map(a => Q.starVal(a, 3));
    if(v.join() !== '17,20,22,19,11' || sum(P[0]) !== 20 || sum(P[4]) !== 20) throw new Error('Кенгуру 2021 task 8: the constellations do not give B (20), with A and E the traps');
    tagged(403, ['ek-2021-2']);
    const val = (a, e) => { const seen = []; a.forEach(n => { if(n !== e && !seen.includes(n)) seen.push(n); }); return sum(seen); };
    let trapE = 0, trapD = 0;
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(403)), t = plain(Q.drawQ(q)), m = t.match(/различни от (\d+) и са различни помежду си, е равен на (\d+)\./), E = +m[1], T = +m[2];
      const vs = q.options.map(o => allNums(o.text[0]));
      if(q.options.length !== 5 || vs.some(a => a.length < 3 || a.length > 5)) fail('403: five constellations of three to five stars expected', q);
      const good = vs.map((a, k) => val(a, E) === T ? k : -1).filter(k => k >= 0);
      if(good.length !== 1 || good[0] !== q.pick) fail('403: not exactly one constellation gives ' + T, q);
      if(vs.some((a, k) => k !== q.pick && sum(a) === T && a.includes(E))) trapE++;
      if(vs.some((a, k) => k !== q.pick && sum(a) === T && new Set(a).size < a.length)) trapD++;
      const plainOnes = vs.map(a => !a.includes(E) && new Set(a).size === a.length).map((p, k) => p ? k : -1).filter(k => k >= 0);
      if(plainOnes.length === 1 && plainOnes[0] === q.pick) fail('403: the right constellation is the only plain one', q);
    }
    if(trapE < 2900 || trapD < 2900) throw new Error('403: the slips (the excluded number counted, a repeat counted twice) are missing: ' + trapE + ', ' + trapD);
  }

  // ---- 404: the digit under a shape. Printed: triangle, circle, circle, square, pentagon → 34426 (A)
  {
    const seq = [0, 1, 1, 2, 3];
    if(!Q.shapeOk(seq, '34426') || ['34526', '34423', '34424', '32446'].some(s => Q.shapeOk(seq, s))) throw new Error('Кенгуру 2022 task 9: the shapes do not give 34426 (A) alone');
    tagged(404, ['ek-2022-2']);
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(404)), g = [...Q.drawQ(q).matchAll(/<g transform="translate\([\d.]+,6\)"[^>]*>(.*?)<\/g>/g)].map(m => m[1]), kinds = [...new Set(g)], cls = g.map(x => kinds.indexOf(x));
      if(cls.length < 5 || cls.length === kinds.length || sameAll(cls, [...new Set(cls)])) fail('404: a row with a repeated shape expected', q);
      const ok = s => cls.every((a, i) => cls.every((b, j) => (a === b) === (s[i] === s[j])));
      const mine = q.options.filter(o => ok(o.text[0]));
      if(mine.length !== 1 || mine[0].id !== q.pick || q.options.length !== 5 || new Set(q.options.map(o => o.text[0])).size !== 5 || q.options.some(o => o.text[0].length !== cls.length)) fail('404: exactly one option must match the shapes', q);
      const rows = q.options.map(o => o.text[0]);
      const modal = p => { const c = {}; rows.forEach(r => { c[r[p]] = (c[r[p]] || 0) + 1; }); const top = Math.max(...Object.values(c)); return Object.keys(c).filter(k => c[k] === top); };
      if([...q.right].every((d, p) => modal(p).length === 1 && modal(p)[0] === d)) fail('404: a vote on every place gives the right row', q);
      const near = mostCentral(rows);
      if(near[q.pick] === Math.max(...near) && near.filter(x => x === near[q.pick]).length === 1) fail('404: the right row is the one the others are closest to', q);
    }
  }

  // ---- 405: the two houses. Printed: 6 2 5 | 3 ? 1 → 9
  {
    const q0 = printed('Кенгуру 2022 task 17', 'ek-2022-2', 405, g => JSON.stringify(g.nums) === '[[6,2,5],[3,0,1]]', ['Кое число трябва да стои на мястото на въпросителния знак?']);
    if(Q.answers(q0).join() !== '9' || !Q.accepts(q0, ['9'])) throw new Error('Кенгуру 2022 task 17: gives ' + Q.answers(q0) + ', the key says 9');
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(405)), h = Q.drawQ(q), known = texts(h, 'hn'), qm = texts(h, 'hq');
      if(qm.length !== 1 || known.length !== 5) fail('405: five numbers and one question mark expected', q);
      const side = x => x < 103 ? 0 : 1, house = [0, 1].map(s => known.filter(k => side(k.x) === s).map(k => +k.t)), qs = side(qm[0].x);
      if(house[qs].length !== 2 || house[1 - qs].length !== 3) fail('405: two numbers beside the ? and three on the other house', q);
      if(strip(Q.eqText(q)) !== sum(house[1 - qs]) + '−(' + house[qs].join('+') + ')=' + q.ans) fail('405: the summary line is not the difference of the two houses', q);
      if(sum(house[1 - qs]) - sum(house[qs]) !== q.ans || Q.answers(q).join() !== String(q.ans) || q.ans < 1 || q.ans > 9) fail('405: the answer is not the difference of the two houses', q);
    }
  }

  // ---- 406: the figures over the table. Printed table 1 6 7 / 9 5 4 / 2 8 3; A the L, B the steps, C the cross, D the S, E the F → 35, E
  {
    const T = [[1, 6, 7], [9, 5, 4], [2, 8, 3]], F = ['001/001/111', '001/011/110', '010/111/010', '110/010/011', '011/110/010'], s = F.map(f => Q.figSum(T, f));
    if(s.join() !== '24,26,32,23,35' || s.indexOf(Math.max(...s)) !== 4) throw new Error('Кенгуру 2023 task 22: the figures do not give E (35)');
    if(F.some(f => !Q.FIG_TURNS.some(t => t.includes(f)) || Q.figCells(f).length !== 5)) throw new Error('406: a printed figure is not one the kind draws');
    tagged(406, ['ek-2023-2']);
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(406)), tab = texts(Q.drawQ(q), 'cn').sort((a, b) => a.y - b.y || a.x - b.x).map(c => +c.t);
      if(tab.length !== 9 || new Set(tab).size !== 9) fail('406: the table of nine different numbers expected', q);
      const figs = q.options.map(o => [...o.text[0].matchAll(/<rect x="(\d+)" y="(\d+)"/g)].map(m => [Math.round((+m[2] - 3) / 22), Math.round((+m[1] - 3) / 22)]));
      if(figs.length !== 5 || figs.some(f => f.length !== 5 || new Set(f.map(c => c.join())).size !== 5 || !f.some(c => c[0] === 0) || !f.some(c => c[0] === 2) || !f.some(c => c[1] === 0) || !f.some(c => c[1] === 2))) fail('406: five figures of five squares that fill the 3 × 3 box expected', q);
      const ss = figs.map(f => sum(f.map(([r, c]) => tab[r*3 + c]))), m = Math.max(...ss);
      if(ss.filter(x => x === m).length !== 1 || ss.indexOf(m) !== q.pick) fail('406: the picked figure is not the only one over the most', q);
      if(new Set(figs.map(f => f.map(c => c.join()).sort().join('|'))).size !== 5) fail('406: two figures alike', q);
      const cover = v => { const p = tab.indexOf(v), r = Math.floor(p / 3), c = p % 3; return figs.map((f, k) => f.some(x => x[0] === r && x[1] === c) ? k : -1).filter(k => k >= 0); };
      if(cover(9).length === 1 && cover(9)[0] === q.pick) fail('406: the only figure over the 9 is the answer', q);
    }
  }

  // ---- 407: the coin. Printed rows: ◯◯·B / A◯C◯ / ◯·D· / E·◯◯ → D
  {
    const g = [[1, 1, 0, 0], [0, 1, 0, 1], [1, 0, 0, 0], [0, 0, 1, 1]], w = Q.coinWhere(g);
    if(w.join() !== '2,2') throw new Error('Кенгуру 2022 task 6: the coin goes on row 3, column 3 (D), not ' + w);
    tagged(407, ['ek-2022-2']);
    const kinds = { row: 0, col: 0, none: 0 };
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(407)), h = Q.drawQ(q), grid = [0, 1, 2, 3].map(() => [0, 0, 0, 0]);
      [...h.matchAll(/<circle class="coin" cx="([\d.]+)" cy="([\d.]+)"/g)].forEach(m => { grid[Math.floor((+m[2] - 2) / 44)][Math.floor((+m[1] - 2) / 44)] = 1; });
      const letters = texts(h, 'lt').map(t => ({ l: t.t, r: Math.floor((t.y - 2) / 44), c: Math.floor((t.x - 2) / 44) }));
      if(sum(grid.flat()) !== 7 || letters.length !== 5 || letters.some(l => grid[l.r][l.c]) || new Set(letters.map(l => l.l)).size !== 5) fail('407: seven coins and five letters on empty squares expected', q);
      const works = letters.filter(l => { const t = grid.map(r => r.slice()); t[l.r][l.c] = 1; return t.every(r => sum(r) === 2) && [0, 1, 2, 3].every(c => sum(t.map(r => r[c])) === 2); });
      if(works.length !== 1 || q.options[q.pick].text[0] !== works[0].l || q.options.map(o => o.text[0]).join('') !== 'ABCDE') fail('407: exactly one letter must complete every row and column', q);
      const wr = letters.filter(l => l.l !== works[0].l);
      kinds.row += wr.some(l => l.r === works[0].r) ? 1 : 0; kinds.col += wr.some(l => l.c === works[0].c) ? 1 : 0; kinds.none += wr.some(l => l.r !== works[0].r && l.c !== works[0].c) ? 1 : 0;
    }
    if(kinds.row < 1000 || kinds.col < 1000 || kinds.none < 3000) throw new Error('407: the slips do not cover its row, its column and neither: ' + JSON.stringify(kinds));
  }

  // ---- 408: the ladybugs. Printed: rows 2–4 hold 4 dots (row 2, column 3), 3 (row 3, column 1), 4 and 1 (row 4, columns 2 and 3) → top row 4 2 3 1 (A)
  const lady = [];   // every 4 × 4 table of 1-4 with none repeated in a row or column, made here
  {
    const perms = []; (function p(a, r){ if(!a.length){ perms.push(r); return; } a.forEach((x, i) => p(a.filter((_, j) => j !== i), r.concat(x))); })([1, 2, 3, 4], []);
    (function go(rows){ if(rows.length === 4){ lady.push(rows); return; } perms.forEach(r => { if(rows.every(o => o.every((x, j) => x !== r[j]))) go(rows.concat([r])); }); })([]);
    if(lady.length !== 576) throw new Error('408: there are 576 such tables');
    const given = [[1, 2, 4], [2, 0, 3], [3, 1, 4], [3, 2, 1]], fits = Q.ladyFits(given), tops = [...new Set(fits.map(f => f[0]))];
    if(tops.join() !== '4231') throw new Error('Кенгуру 2025 task 21: the ladybugs do not give the top row 4 2 3 1 (A), but ' + tops);
    tagged(408, ['ek-2025-2']);
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(408)), h = Q.drawQ(q), grp = svg => [...svg.matchAll(/<g class="lb" transform="translate\(([\d.]+),([\d.]+)\)"[^>]*>(.*?)<\/g>/g)].map(m => ({ x: +m[1], y: +m[2], d: (m[3].match(/class="dot"/g) || []).length }));
      const given2 = grp(svgs(h)[0]).map(b => [Math.round((b.y - 26) / 48), Math.round((b.x - 26) / 48), b.d]);
      if(given2.length !== 4 || given2.some(([r, c, d]) => r < 1 || r > 3 || c < 0 || c > 3 || d < 1 || d > 4)) fail('408: four ladybugs below the top row expected', q);
      const fit = lady.filter(t => given2.every(([r, c, d]) => t[r][c] === d)), tp = [...new Set(fit.map(t => t[0].join('')))];
      if(tp.length !== 1) fail('408: the ladybugs shown leave ' + tp.length + ' top rows', q);
      const rows = q.options.map(o => grp(o.text[0]).sort((a, b) => a.x - b.x).map(b => b.d).join(''));
      if(rows.length !== 5 || new Set(rows).size !== 5 || rows.some(r => r.length !== 4 || new Set([...r]).size !== 4)) fail('408: five different top rows of four different dot counts expected', q);
      if(rows.filter(r => r === tp[0]).length !== 1 || rows[q.pick] !== tp[0] || rows.some((r, k) => k !== q.pick && lady.some(t => t[0].join('') === r && given2.every(([a, b, d]) => t[a][b] === d)))) fail('408: exactly one option must be a possible top row', q);
      const near = mostCentral(rows);
      if(near[q.pick] === Math.max(...near) && near.filter(x => x === near[q.pick]).length === 1) fail('408: the right row is the one the others are closest to', q);
      if(!rows.some((r, k) => k !== q.pick && ![...r].some((d, c) => given2.some(([, b, e]) => b === c && e === +d)))) fail('408: every wrong row clashes with a ladybug at once', q);
    }
  }

  // ---- 409: the pyramid. Printed: 4 red, 3 blue, 2 green, 1 yellow; the X in the middle of the third row is red (A)
  {
    const q0 = printed('Кенгуру 2025 task 23', 'ek-2025-2', 409, g => g.x === 4 && g.names.join() === '0,1,2,3', ['Какъв е цветът на квадратчето, означено с X?']);
    if(q0.options[q0.pick].text[0].indexOf('червен') < 0) throw new Error('Кенгуру 2025 task 23: the picked option is not red (A)');
    const seen = { sure: 0, unsure: 0 }, NOM = { 'червено': 'червен', 'синьо': 'син', 'зелено': 'зелен', 'жълто': 'жълт' };
    for(let i = 1; i <= 3000; i++){
      const q = Q.seeded(i, () => Q.raw(409)), h = Q.drawQ(q), svg = svgs(h)[0];
      const rects = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="(\d+)" height="\d+"/g)].map(m => ({ x: +m[1], y: +m[2], u: +m[3] })), X = texts(svg, 'px')[0];
      const xi = rects.findIndex(r => X.x > r.x && X.x < r.x + r.u && X.y > r.y && X.y < r.y + r.u);
      if(rects.length !== 10 || xi < 0) fail('409: ten squares and an X in one of them expected', q);
      const touch = (a, b) => (a.y === b.y && Math.abs(a.x - b.x) === a.u) || (Math.abs(a.y - b.y) === a.u && Math.abs(a.x - b.x) < a.u);
      const col = Array(10).fill(-1), rem = [4, 3, 2, 1], got = new Set();
      (function go(k){ if(k === 10){ got.add(col[xi]); return; }
        for(let c = 0; c < 4; c++){ if(!rem[c] || rects.some((r, j) => j < k && col[j] === c && touch(rects[k], r))) continue; col[k] = c; rem[c]--; go(k + 1); rem[c]++; col[k] = -1; } })(0);
      const names = plain(h).match(/Оцветете 4 от квадратчетата вдясно в (\S+), 3 в (\S+), 2 в (\S+) и едно квадратче в (\S+),/).slice(1);
      const want = got.size === 1 ? NOM[names[[...got][0]]] : 'неевъзможнодасеопредели';
      const opts = q.options.map(o => strip(o.text[0]));
      if(opts.length !== 5 || !opts.includes('неевъзможнодасеопредели') || opts.filter(o => o === want).length !== 1 || opts[q.pick] !== want) fail('409: the picked option is not the colour of the X (or «not possible to tell») by trying every painting', q);
      if(new Set(names).size !== 4) fail('409: four colours expected', q);
      seen[got.size === 1 ? 'sure' : 'unsure']++;
    }
    if(seen.sure < 1000 || seen.unsure < 1000) throw new Error('409: the X is either always or never fixed: ' + JSON.stringify(seen));
  }
}
