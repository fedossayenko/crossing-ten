// Runs beside the app (in check.js's own scope, through eval), like check/ek-W1.js.
// Салабашев, 2 клас — builder P1, picture tasks: 2020 #4, 2021 #11 and 2023 #4 (level 490, pyramids), 2019 #2 (491, equalities in a grid), 2020 #3 (492, the flower),
// 2021 #2 (493, three boxes), 2020 #11 (494, coloured gaps), 2022 #7 (158, shape 'h'), 2024 #6 (360, shape 'sign'), 2022 #2 (495, biscuits in a box).
// Each printed task is built as printed where its picture can be copied (the numbers cannot be found by chance among random ones; 2020 #4 and 2021 #11 are
// found by seed all the same), drawn by its level and must come out at the official key by the generator's own answer. 2021 #11 has no key in the paper:
// it is held to our own solution, 2. Then every generator is worked out again on 2000–3000 seeds from the SVG it draws (boxes, signs, circles, cells and
// symbols read back from the markup, never from the fields the generator keeps): the pyramids by solving the linear system the drawn numbers make, the
// equalities by solving them as drawn, the flower by pairing each yellow circle with the blue one on its ray, the boxes, the grid, the signs and the biscuits by counting.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const attr = (s, a) => (s.match(new RegExp('\\s' + a + '="([^"]*)"')) || [])[1];
  const tags = (svg, name) => svg.match(new RegExp('<' + name + '[ >][^>]*>', 'g')) || [];
  const svgs = h => String(h).match(/<svg[\s\S]*?<\/svg>/g) || [];
  const num = (s, a) => +attr(s, a);
  const mainSvg = h => svgs(h).find(s => s.includes('<rect'));   // the picture, not the little symbols inside the question
  const texts = svg => [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)].map(m => ({ tag: m[0], body: m[2].trim(), x: num(m[0], 'x'), y: num(m[0], 'y') }));
  const lastNum = t => { const m = strip(t).match(/\d+/g); return m ? +m[m.length - 1] : NaN; };
  const level = id => Q.LEVELS.find(l => l.id === id);
  // a printed task: drawn by its level as printed (the words and the picture), the official key from the generator's own answer, the hint and the worked line landing on it
  const printed = (name, tag, id, q, shows, key) => {
    const t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    if(!level(id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': the level gives ' + Q.answers(q) + ', the key says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    if(lastNum(Q.eqText(q)) !== key || lastNum(Q.why(q, true)) !== key) throw new Error(name + ': the summary or the worked line does not end on ' + key);
    return q;
  };
  // the level must really draw that kind and shape (the seed is recorded in check/seeds.json)
  const asks = (name, id, same) => { if(!pinSeed(name, () => Q.raw(id), g => same(g) ? 2 : 0, 3e6)) throw new Error(name + ': level ' + id + ' never asks it'); };
  const n = {}, count = k => n[k] = (n[k] || 0) + 1;

  // ---- reading an equality grid back from its SVG: cells by column and row, boxes and operators, then every equality solved as drawn
  const readCells = (sv, u, fillBox) => {
    const cells = {};
    tags(sv, 'rect').forEach(r => { const c = Math.floor((num(r, 'x') + 1) / u), rw = Math.floor((num(r, 'y') + 1) / u); cells[c + ',' + rw] = { box: attr(r, 'fill') !== 'var(--line)', tint: attr(r, 'fill') === fillBox, text: '', c, r: rw }; });
    texts(sv).forEach(t => { const k = Math.floor(t.x / u) + ',' + Math.floor(t.y / u); if(!cells[k]) throw new Error('a label outside every cell: ' + t.body); cells[k].text = t.body; });
    Object.values(cells).forEach(c => { c.box = !/^[+−=]$/.test(c.text); });   // an operator is the sign written in a cell, whatever its fill
    return cells;
  };
  // every equality: a box, an operator, a box, '=', a box in a row of five cells, to the right or downwards; solved by propagation; returns the value of each cell
  const solveCells = cells => {
    const val = {}, eqs = [];
    Object.keys(cells).forEach(k => { const c = cells[k]; if(c.box && /^\d+$/.test(c.text)) val[k] = +c.text; });
    Object.keys(cells).forEach(k => [[1, 0], [0, 1]].forEach(([dc, dr]) => {
      const at = i => cells[(cells[k].c + dc*i) + ',' + (cells[k].r + dr*i)];
      const w = [0, 1, 2, 3, 4].map(at);
      if(w.every(Boolean) && w[0].box && !w[1].box && w[2].box && !w[3].box && w[3].text === '=' && w[4].box && (w[1].text === '+' || w[1].text === '−'))
        eqs.push({ ks: [0, 2, 4].map(i => (cells[k].c + dc*i) + ',' + (cells[k].r + dr*i)), op: w[1].text });
    }));
    for(let again = true; again;){
      again = false;
      eqs.forEach(({ ks: [a, b, c], op }) => {
        const [x, y, z] = [val[a], val[b], val[c]];
        if(op === '+'){ if(x === undefined && y !== undefined && z !== undefined){ val[a] = z - y; again = true; } else if(y === undefined && x !== undefined && z !== undefined){ val[b] = z - x; again = true; } else if(z === undefined && x !== undefined && y !== undefined){ val[c] = x + y; again = true; } }
        else { if(x === undefined && y !== undefined && z !== undefined){ val[a] = z + y; again = true; } else if(y === undefined && x !== undefined && z !== undefined){ val[b] = x - z; again = true; } else if(z === undefined && x !== undefined && y !== undefined){ val[c] = x - y; again = true; } }
      });
    }
    eqs.forEach(({ ks: [a, b, c], op }) => { if(val[a] !== undefined && val[b] !== undefined && val[c] !== undefined && (op === '+' ? val[a] + val[b] : val[a] - val[b]) !== val[c]) throw new Error('the drawn equalities contradict each other'); });
    return { val, eqs };
  };

  // ---- pyramids: the box (r, i) of an n-row pyramid is a sum of base boxes with the binomial weights; the drawn numbers are linear equations on the base
  const comb = (a, b) => b < 0 || b > a ? 0 : b === 0 ? 1 : comb(a - 1, b - 1) + comb(a - 1, b);
  const weights = (nr, r, i) => Array.from({ length: nr }, (_, j) => comb(nr - 1 - r, j - i));
  const determine = (eq, target, nv) => {
    const rows = eq.map(([c, v]) => [...c, v]), piv = []; let at = 0;
    for(let col = 0; col < nv && at < rows.length; col++){
      const p = rows.findIndex((r, k) => k >= at && Math.abs(r[col]) > 1e-9); if(p < 0) continue;
      [rows[at], rows[p]] = [rows[p], rows[at]];
      const d = rows[at][col]; rows[at] = rows[at].map(x => x / d);
      rows.forEach((r, k) => { if(k !== at && Math.abs(r[col]) > 1e-9){ const f = r[col]; rows[k] = r.map((x, j) => x - f*rows[at][j]); } });
      piv.push(col); at++;
    }
    if(rows.slice(at).some(r => Math.abs(r[nv]) > 1e-9)) return 'inconsistent';
    const t = target.slice(); let val = 0;
    piv.forEach((col, k) => { const f = t[col]; if(Math.abs(f) > 1e-9){ for(let j = 0; j < nv; j++) t[j] -= f*rows[k][j]; val += f*rows[k][nv]; } });
    return t.every(x => Math.abs(x) < 1e-9) ? val : null;
  };
  // the rects of one pyramid (rows by y, boxes by x), what is written in each, where the '?' or the symbol stands; returns the target's value from the drawn numbers
  const readPyr = (rects, tx, syms) => {
    const ys = [...new Set(rects.map(r => num(r, 'y')))].sort((a, b) => a - b), nr = ys.length, byRow = ys.map(y => rects.filter(r => num(r, 'y') === y).sort((a, b) => num(a, 'x') - num(b, 'x')));
    byRow.forEach((row, r) => { if(row.length !== r + 1) throw new Error('a pyramid row with ' + row.length + ' boxes at depth ' + r); });
    const where = (x, y) => { for(let r = 0; r < nr; r++) for(let i = 0; i <= r; i++){ const b = byRow[r][i], bx = num(b, 'x'), by = num(b, 'y'); if(x > bx && x < bx + num(b, 'width') && y > by && y < by + num(b, 'height')) return [r, i]; } return null; };
    const eq = [], shown = [];
    let target = null;
    tx.forEach(t => { const at = where(t.x, t.y - 5); if(!at) throw new Error('a number outside every box: ' + t.body); if(t.body === '?') target = at; else { eq.push([weights(nr, at[0], at[1]), +t.body]); shown.push(at); } });
    syms.forEach(s => { const at = where(s.x, s.y); if(!at) throw new Error('a symbol outside every box'); target = at; });
    if(!target) throw new Error('nothing to find in the pyramid');
    return { nr, val: determine(eq, weights(nr, target[0], target[1]), nr), shown, target, eq };
  };
  const pyrSvg = sv => {
    const rects = tags(sv, 'rect'), tx = texts(sv), gs = [...sv.matchAll(/<g data-sym="(\w+)" transform="translate\(([-\d.]+) ([-\d.]+)\)"/g)].map(m => ({ k: m[1], x: +m[2], y: +m[3] }));
    // pyramids side by side: a new one starts where the boxes no longer touch
    const sorted = rects.slice().sort((a, b) => num(a, 'x') - num(b, 'x')), groups = [];
    let right = -1e9;
    sorted.forEach(r => { if(num(r, 'x') > right + 0.5) groups.push([]); groups[groups.length - 1].push(r); right = Math.max(right, num(r, 'x') + num(r, 'width')); });
    return groups.map(g => {
      const x0 = Math.min(...g.map(r => num(r, 'x'))), x1 = Math.max(...g.map(r => num(r, 'x') + num(r, 'width')));
      const inside = o => o.x > x0 && o.x < x1;
      return { ...readPyr(g, tx.filter(inside), gs.filter(inside)), syms: gs.filter(inside).map(s => s.k) };
    });
  };

  // ---- the printed instances
  // 2020 #4: 7, _, 3, 7 along the base, 13, _, 10 above, the top is 41 (key Г); found by seed
  {
    const name = 'Салабашев 2020 task 4', hit = pinSeed(name, () => Q.raw(490), g => g.shape === 'four' && !g.flip && JSON.stringify(g.rows) === '[[41],[22,19],[13,9,10],[7,6,3,7]]' ? 2 : 0, 3e6);
    if(!hit) throw new Error(name + ': level 490 never asks it');
    printed(name, 'sal-2020-2', 490, hit.q, ['Числото във всяка кутийка е сборът на двете кутийки под нея. Кое е числото на върха на пирамидата?'], 41);
    const [p] = pyrSvg(mainSvg(Q.drawQ(hit.q)));
    if(p.nr !== 4 || p.val !== 41 || p.shown.length !== 5) throw new Error(name + ': the picture is not the printed pyramid ' + JSON.stringify(p));
  }
  // 2021 #11: 22 on top, 10 in the second row, 7 in the third, 1 and 2 at the end of the base, the first base box asked; the paper prints no key, our own solution is 2
  {
    const name = 'Салабашев 2021 task 11', hit = pinSeed(name, () => Q.raw(490), g => g.shape === 'five' && !g.flip && JSON.stringify(g.rows[4]) === '[2,2,1,1,2]' ? 2 : 0, 3e6);
    if(!hit) throw new Error(name + ': level 490 never asks it');
    printed(name, 'sal-2021-2', 490, hit.q, ['Кое число стои на мястото на въпросителния знак?'], 2);
    const [p] = pyrSvg(mainSvg(Q.drawQ(hit.q)));
    if(p.nr !== 5 || p.val !== 2 || p.shown.length !== 5 || JSON.stringify(hit.q.rows.map(r => r[0])) !== '[22,12,7,4,2]') throw new Error(name + ': the picture is not the printed pyramid ' + JSON.stringify(p));
  }
  // 2023 #4: ♡ in the first pyramid (27 over 1, 7, ♡), ⬡ on top of the second (48 and 17, _, 14), ☁ in the third (54, 28, _, ☁, 18); ⬡ − ♡ + ☁ = 99 − 12 + 8 = 95 (key В)
  {
    const name = 'Салабашев 2023 task 4', q = {kind:'numpyr', shape:'sym', kinds:['heart', 'hex', 'cloud'], vals:[12, 99, 8], ord:[1, 0, 2], ops:['−', '+'], ans:95,
      pyr:[{ tpl:'A', flip:0, rows:[[27], [8, 19], [1, 7, 12]] }, { tpl:'B', flip:0, rows:[[99], [51, 48], [17, 34, 14]] }, { tpl:'C', flip:0, rows:[[54], [28, 26], [20, 8, 18]] }]};
    printed(name, 'sal-2023-2', 490, q, ['Във всяка пирамида числото е сборът на двете числа под него. Колко е'], 95);
    const ps = pyrSvg(mainSvg(Q.drawQ(q)));
    if(ps.length !== 3 || ps.map(p => p.val).join() !== '12,99,8' || ps.map(p => p.syms.join()).join() !== 'heart,hex,cloud') throw new Error(name + ': the three pyramids drawn do not give 12, 99, 8: ' + JSON.stringify(ps.map(p => [p.val, p.syms])));
    if(ps.map(p => p.shown.length).join() !== '3,3,3') throw new Error(name + ': not three numbers shown in each pyramid');
    asks(name, 490, g => g.shape === 'sym');
  }
  // 2019 #2: 32 = ▢ + 23, ▢ = 50 − 5, the column ▢ + ▢ = ▢, the bottom ▢ − ♡ = 16; ♡ = 38 (key Г)
  {
    const name = 'Салабашев 2019 task 2', q = {kind:'eqgrid', a:9, b:23, c:32, e:50, f:5, g:45, h:54, k:16, ans:38};
    printed(name, 'sal-2019-2', 491, q, ['Равенствата в таблицата са верни, по редове и по колони. Колко е ♡?'], 38);
    const sv = svgs(Q.drawQ(q))[0], cells = readCells(sv, 32, 'none'), { val } = solveCells(cells), heart = Object.keys(cells).find(k => cells[k].text === '♡');
    if(val[heart] !== 38) throw new Error(name + ': the grid drawn gives ♡ = ' + val[heart]);
    if(!['23', '32', '50', '5', '16'].every(v => Object.values(cells).some(c => c.text === v))) throw new Error(name + ': the printed numbers are not in the grid');
    asks(name, 491, () => true);
  }
  // 2020 #3: petals 37, 86, 19, 45, 22, 48 with 63, 14, 81, 55, 78, 52 outside: every pair makes 100 (key Г)
  {
    const name = 'Салабашев 2020 task 3', q = {kind:'petals', ys:[37, 86, 19, 45, 22, 48], bs:[63, 14, 81, 55, 78, 52], ans:100, traps:[90, 10]};
    printed(name, 'sal-2020-2', 492, q, ['Кое е числото в зеленото кръгче?'], 100);
    asks(name, 492, () => true);
  }
  // 2021 #2: 9 8 / 12 5, 11 6 / 3 14, 7 10 / 2 ♡: every row makes 17, so ♡ = 15 (key Б)
  {
    const name = 'Салабашев 2021 task 2', q = {kind:'boxrule', s:17, boxes:[[[9, 8], [12, 5]], [[11, 6], [3, 14]], [[7, 10], [2, 15]]], hide:[1, 1], ans:15, traps:[17, 19]};
    printed(name, 'sal-2021-2', 493, q, ['Числата в трите кутии са подредени по едно и също правило. Намери го и кажи колко е ♡.'], 15);
    asks(name, 493, () => true);
  }
  // 2020 #11: 2, 3, 4 into the gaps; green 18, red 16, yellow 17 without them: 18 + 2 = 16 + 4 = 17 + 3 = 20
  {
    const name = 'Салабашев 2020 task 11', q = {kind:'colorgaps', rows:[[3, 0, 2, 0, 3], [8, 3, 0, 5, 7], [6, 1, 6, 1, 6]], digits:[2, 3, 4], sums:[18, 16, 17], give:[2, 4, 3], ans:20, traps:[18, 19]};
    printed(name, 'sal-2020-2', 494, q, ['В празните квадратчета запиши цифрите 2, 3 и 4, по веднъж, така че сборът на числата в зелената, в червената и в жълтата фигура да е един и същ. На колко е равен този сбор?'], 20);
    asks(name, 494, () => true);
  }
  // 2022 #7: 25 + ▢ = 62, ▢ − ▢ = 51 (the shaded one on top), 32 + ▢ = 50, ▢ − ▢ = ▢ across: 37 − 19 = 18, the shaded box 51 + 19 = 70 (key В)
  {
    const name = 'Салабашев 2022 task 7', q = {kind:'eqcross', shape:'h', a:25, l:37, b:62, c:32, r:18, d:50, m:19, e:51, s:70, ans:70};
    printed(name, 'sal-2022-2', 487, q, ['Кое е числото в оцветеното квадратче?'], 70);
    const cells = readCells(svgs(Q.drawQ(q))[0], 34, 'var(--warmbg)'), { val } = solveCells(cells), shaded = Object.keys(cells).find(k => cells[k].tint);
    if(val[shaded] !== 70) throw new Error(name + ': the H drawn gives ' + val[shaded]);
    if(!['25', '62', '32', '50', '51'].every(v => Object.values(cells).some(c => c.text === v))) throw new Error(name + ': the printed numbers are not in the H');
    asks(name, 487, g => g.shape === 'h');
  }
  // 2024 #6: 3 rows of 6, + − − + − − / − + − − + − / − − + − − +: 6 plus, 12 minus, 3 of the − to turn into + (key А)
  {
    const name = 'Салабашев 2024 task 6', q = {kind:'halfgrid', shape:'sign', W:6, H:3, k:6, cells:[0, 3, 7, 10, 14, 17], traps:[12, 6], ans:3};
    printed(name, 'sal-2024-2', 360, q, ['В малките квадратчета на чертежа има знаци „+“ и „−“. В колко от тях трябва да заменим знака „−“ със знак „+“, така че броят на „−“ и на „+“ да е един и същ?'], 3);
    const sv = svgs(Q.drawQ(q))[0], rows = [0, 1, 2].map(r => texts(sv).filter(t => Math.floor(t.y / 34) === r).sort((a, b) => a.x - b.x).map(t => t.body).join(''));
    if(rows.join('/') !== '+−−+−−/−+−−+−/−−+−−+') throw new Error(name + ': the signs drawn are ' + rows.join('/'));
    asks(name, 360, g => g.shape === 'sign' && g.W === 6 && g.H === 3 && g.k === 6);
  }
  // 2022 #2: 8 hearts, 10 circles, 7 squares in a box of 25: 1 + 3 + 0 = 4 to eat (key В)
  {
    const name = 'Салабашев 2022 task 2', q = {kind:'tally', shape:'box', n:[8, 10, 7], kinds:[0, 1, 1, 1, 0, 1, 2, 0, 2, 1, 0, 2, 2, 2, 0, 1, 2, 0, 2, 1, 0, 1, 1, 1, 0], ans:4, traps:[25, 10]};
    printed(name, 'sal-2022-2', 495, q, ['Най-малко колко бисквити трябва да изяде Коко, за да останат по равен брой бисквити и от трите вида?'], 4);
    asks(name, 495, g => g.shape === 'box' && g.n.join() === '8,10,7');
  }

  // ---- 490: every pyramid solved from the numbers it draws
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(490)), html = Q.drawQ(q); count('pyramid ' + q.shape);
    const ps = pyrSvg(mainSvg(html));
    if(q.shape === 'sym'){
      if(ps.length !== 3 || ps.some(p => p.nr !== 3 || p.shown.length !== 3 || p.syms.length !== 1 || p.val === null || p.val === 'inconsistent')) fail('490: a small pyramid is not 3 rows, 3 numbers and one symbol, solvable', q);
      const kinds = ps.map(p => p.syms[0]), vals = ps.map(p => p.val);
      if(new Set(kinds).size !== 3 || new Set(vals).size !== 3 || vals.some(v => !Number.isInteger(v) || v < 1 || v > 99)) fail('490: the symbols are not three, or a value is not a whole number from 1 to 99: ' + vals, q);
      // the sum asked, read from the question: the icons and the signs between them
      const inner = html.match(/<span class="num">([\s\S]*?)<\/span>/)[1], tok = [...inner.matchAll(/data-sym="(\w+)"|([+−])/g)].map(m => m[1] || m[2]);
      if(tok.length !== 5 || tok.filter((_, k) => k % 2 === 0).some(t => !kinds.includes(t)) || new Set(tok.filter((_, k) => k % 2 === 0)).size !== 3) fail('490: the sum asked is not the three symbols joined by two signs: ' + tok, q);
      let got = vals[kinds.indexOf(tok[0])];
      for(let k = 1; k < 5; k += 2){ const v = vals[kinds.indexOf(tok[k + 1])]; got = tok[k] === '+' ? got + v : got - v; }
      if(got !== q.ans || got < 1 || got > 99) fail('490: the symbols drawn give ' + got + ', not the answer', q);
      // the box of each symbol holds no number, and every box of the pyramid but those shown and the symbol's is empty
      if(tags(mainSvg(html), 'rect').length !== 18) fail('490: not 18 boxes', q);
    } else {
      const [p] = ps, want = q.shape === 'four' ? 4 : 5;
      if(ps.length !== 1 || p.nr !== want || p.shown.length !== 5 || typeof p.val !== 'number') fail('490: the pyramid drawn is not ' + want + ' rows with five numbers and one box asked, solvable from them', q);
      if(!Number.isInteger(p.val) || p.val !== q.ans || p.val < 1) fail('490: the pyramid drawn gives ' + p.val + ', not the answer', q);
      // the base, solved in full, is whole positive numbers (the drawn numbers all fit one pyramid)
      for(let j = 0; j < want; j++){ const v = determine(p.eq, Array.from({ length: want }, (_, k) => k === j ? 1 : 0), want); if(v !== null && (!Number.isInteger(v) || v < 1)) fail('490: a base box is not a positive whole number', q); }
      if(q.shape === 'five' && p.target[0] !== 4) fail('490: the box asked in the five-row pyramid is not in the base', q);
      if(q.shape === 'four' && (p.target[0] !== 0 || p.val > 99)) fail('490: the four-row pyramid does not ask the top', q);
    }
  }
  // ---- 491: the grid's equalities solved as drawn; the heart is the only unknown asked, and every box of the grid is found
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(491)); count('eqgrid');
    const cells = readCells(svgs(Q.drawQ(q))[0], 32, 'none'), { val, eqs } = solveCells(cells), heart = Object.keys(cells).filter(k => cells[k].text === '♡');
    if(heart.length !== 1 || eqs.length !== 4) fail('491: the grid has not one heart and four equalities', q);
    if(Object.keys(cells).filter(k => cells[k].box).some(k => val[k] === undefined || val[k] < 1 || val[k] > 99)) fail('491: a box of the grid is not found, or is out of 1 to 99', q);
    if(val[heart[0]] !== q.ans || q.ans < 5) fail('491: the grid drawn gives ♡ = ' + val[heart[0]], q);
    if(Object.values(cells).filter(c => c.box && c.text === '').length !== 3) fail('491: not three empty boxes beside the heart', q);
  }
  // ---- 492: each yellow circle paired with the blue one on its ray from the centre; every pair has the same sum, which is the answer
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(492)), sv = svgs(Q.drawQ(q))[0]; count('petals');
    const circ = tags(sv, 'circle').map(c => ({ x: num(c, 'cx'), y: num(c, 'cy'), fill: attr(c, 'fill') })), tx = texts(sv);
    const label = c => (tx.find(t => Math.abs(t.x - c.x) < 1 && t.y > c.y && t.y < c.y + 8) || {}).body;
    const yel = circ.filter(c => c.fill === 'var(--lemon)'), blue = circ.filter(c => c.fill === 'var(--accent)'), mid = circ.find(c => c.fill === 'var(--good)');
    if(yel.length !== 6 || blue.length !== 6 || !mid) fail('492: not six yellow, six blue and one green circle', q);
    const ang = c => Math.round(Math.atan2(c.x, -c.y)*180/Math.PI + 360) % 360, sums = yel.map(y => { const b = blue.find(o => ang(o) === ang(y)); if(!b) fail('492: a yellow circle has no blue one on its ray', q); return +label(y) + +label(b); });
    if(new Set(sums).size !== 1 || sums[0] !== q.ans || q.ans % 10 || q.ans < 50 || q.ans > 100) fail('492: the pairs drawn do not all make the answer: ' + sums, q);
    const all = [...yel, ...blue].map(label);
    if(new Set(all).size !== 12 || all.some(v => !/^\d+$/.test(v) || +v < 8)) fail('492: the twelve numbers are not twelve different ones from 8 up', q);
    if(q.traps.includes(q.ans)) fail('492: a slip is the answer', q);
  }
  // ---- 493: rows of the two full boxes read back; the equal row sum is the rule, no other rule (equal columns, equal diagonals) holds in both, and the heart completes its row
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(493)), sv = svgs(Q.drawQ(q))[0]; count('boxrule');
    const boxes = tags(sv, 'rect').map(r => ({ x: num(r, 'x'), w: num(r, 'width') })), tx = texts(sv);
    if(boxes.length !== 3) fail('493: not three boxes', q);
    const cellOf = (b, t) => [t.y < 36 ? 0 : 1, t.x < b.x + b.w/2 ? 0 : 1];
    const grid = boxes.map(b => { const g = [[null, null], [null, null]]; tx.filter(t => t.x > b.x && t.x < b.x + b.w).forEach(t => { const [r, c] = cellOf(b, t); g[r][c] = t.body === '♡' ? '♡' : +t.body; }); return g; });
    const full = grid.slice(0, 2), last = grid[2], flat = last.flat();
    if(full.some(g => g.flat().some(v => typeof v !== 'number')) || flat.filter(v => v === '♡').length !== 1 || flat.filter(v => typeof v === 'number').length !== 3) fail('493: the first two boxes are not full, or the third has not one heart', q);
    const rowSums = full.flatMap(g => g.map(r => r[0] + r[1]));
    if(new Set(rowSums).size !== 1) fail('493: the rows of the full boxes do not make one sum: ' + rowSums, q);
    const S = rowSums[0], cols = full.map(g => g[0][0] + g[1][0] === g[0][1] + g[1][1]), diag = full.map(g => g[0][0] + g[1][1] === g[0][1] + g[1][0]);
    if(cols.every(Boolean) || diag.every(Boolean)) fail('493: equal columns or equal diagonals hold in both full boxes too, a second rule', q);
    // the heart completes its row to S; the other row of the last box is complete
    const hr = last.findIndex(r => r.includes('♡')), hc = last[hr].indexOf('♡'), partner = last[hr][1 - hc], other = last[1 - hr];
    if(other[0] + other[1] !== S) fail('493: the third box\'s full row does not make the sum', q);
    if(S - partner !== q.ans || q.ans < 1 || S !== q.s) fail('493: the box drawn gives ♡ = ' + (S - partner), q);
  }
  // ---- 494: the figures read from the colours of the cells, the digits from the question; every placement tried, exactly one gives equal sums, and it is the answer
  const COL = { 'var(--good)': 'G', 'var(--bad)': 'R', 'var(--lemon)': 'Y' };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(494)), html = Q.drawQ(q), sv = svgs(html)[0]; count('colorgaps');
    const cells = tags(sv, 'rect').map(r => ({ c: Math.floor(num(r, 'x') / 40), r: Math.floor(num(r, 'y') / 40), col: COL[attr(r, 'fill')], v: null })), tx = texts(sv);
    tx.forEach(t => { const c = cells.find(o => o.c === Math.floor(t.x / 40) && o.r === Math.floor(t.y / 40)); c.v = +t.body; });
    const digits = [...html.matchAll(/<span class="num">(\d+)<\/span>/g)].map(m => +m[1]);
    if(cells.length !== 15 || digits.length !== 3 || cells.some(c => !c.col)) fail('494: not 15 coloured cells and three digits', q);
    const gaps = cells.filter(c => c.v === null), base = {};
    'GRY'.split('').forEach(k => { base[k] = cells.filter(c => c.col === k && c.v !== null).reduce((s, c) => s + c.v, 0); if(cells.filter(c => c.col === k && c.v === null).length !== 1) fail('494: a colour has not exactly one gap', q); });
    const ways = [];
    [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].forEach(p => { const s = 'GRY'.split('').map((k, j) => base[k] + digits[p[j]]); if(new Set(s).size === 1) ways.push(s[0]); });
    if(ways.length !== 1 || ways[0] !== q.ans) fail('494: the placements that equalise the sums are ' + ways + ', not just the answer', q);
    if(gaps.length !== 3 || new Set(digits).size !== 3 || cells.some(c => c.v !== null && (c.v < 1 || c.v > 9))) fail('494: not three gaps, three different digits and cells 1 to 9', q);
    if(q.traps.includes(q.ans)) fail('494: a slip is the answer', q);
  }
  // ---- 158 'h': the H solved as drawn; the shaded box is the answer, every box found
  for(let i = 1; i <= 4000; i++){
    const q = Q.seeded(i, () => Q.raw(487)); if(q.shape !== 'h') continue;
    count('eqcross h');
    const cells = readCells(svgs(Q.drawQ(q))[0], 34, 'var(--warmbg)'), { val, eqs } = solveCells(cells), shaded = Object.keys(cells).filter(k => cells[k].tint);
    if(shaded.length !== 1 || eqs.length !== 4) fail('487 h: not one shaded box and four equalities', q);
    if(Object.keys(cells).filter(k => cells[k].box).some(k => val[k] === undefined || val[k] < 1 || val[k] > 99)) fail('487 h: a box is not found, or is out of 1 to 99', q);
    if(val[shaded[0]] !== q.ans || Object.values(cells).filter(c => c.box && c.text === '').length !== 4) fail('487 h: the H drawn gives ' + val[shaded[0]], q);
  }
  // ---- 360 'sign': the + and − drawn, counted; the number of − to turn over for equal counts, tried one by one
  for(let i = 1; i <= 4000; i++){
    const q = Q.seeded(i, () => Q.raw(360)); if(q.shape !== 'sign') continue;
    count('halfgrid sign');
    const sv = svgs(Q.drawQ(q))[0], sq = tags(sv, 'rect'), tx = texts(sv), plus = tx.filter(t => t.body === '+').length, minus = tx.filter(t => t.body === '−').length;
    if(sq.length !== tx.length || plus + minus !== tx.length || sq.length % 2) fail('360 sign: every square must carry a + or a −, and the squares be even in number', q);
    let x = 0; while(minus - x !== plus + x && x <= minus) x++;
    if(x > minus || x !== q.ans || x < 1 || x > 6 || q.traps.includes(x)) fail('360 sign: the signs drawn need ' + x + ' turned, not the answer', q);
    const W = new Set(sq.map(r => num(r, 'x'))).size; if(W !== q.W || sq.length !== q.W*q.H) fail('360 sign: the grid drawn is not the generator\'s', q);
  }
  // ---- 495: the biscuits counted by their shape in the SVG; the answer is what must go to leave as many of each as the rarest
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(495)), sv = svgs(Q.drawQ(q))[0]; count('tally box');
    const hearts = tags(sv, 'path').length, circles = tags(sv, 'circle').filter(c => attr(c, 'r') === '10').length, squares = tags(sv, 'rect').filter(r => attr(r, 'width') === '18').length, c = [hearts, circles, squares];
    if(tags(sv, 'circle').length !== 2*circles || tags(sv, 'rect').length !== squares + 1) fail('495: a shape in the box is neither a heart, a circle nor a square', q);
    if(hearts + circles + squares !== 25) fail('495: the box has not 25 biscuits', q);
    let eat = 0; for(let k = 0; k < 3; k++) eat += c[k] - Math.min(...c);
    // tried the other way: the most biscuits that can be left of each kind is the rarest count; nothing fewer than eat leaves them equal
    for(let left = 1; left <= 25; left++) if(c.every(v => v >= left) && 3*left > 25 - eat) fail('495: more could be left than the rarest kind', q);
    if(eat !== q.ans || c.some(v => v < 4) || eat < 2 || c.includes(eat) || q.traps.includes(eat)) fail('495: the biscuits drawn give ' + eat + ' to eat, not the answer', q);
    const at = [...sv.matchAll(/<(?:path d="M([-\d.]+),([-\d.]+)|circle cx="([-\d.]+)" cy="([-\d.]+)" r="10"|rect x="([-\d.]+)" y="([-\d.]+)" width="18")/g)].map(m => m[1] ? [+m[1], +m[2] - 10] : m[3] ? [+m[3], +m[4]] : [+m[5] + 9, +m[6] + 9]);
    if(new Set(at.map(p => p.join())).size !== 25) fail('495: two biscuits on one place', q);
  }
  console.log('Салабашев 2 клас, pictures (P1): 2020 #4, #3, #11, 2021 #11, #2, 2019 #2, 2023 #4, 2022 #7, #2, 2024 #6 on levels 490–495, 158 and 360 pinned (2021 #11 against our own solution); every picture read back from its SVG on 2000–4000 seeds each: ' + JSON.stringify(n));
}
