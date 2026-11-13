// Runs beside the app (in check.js's own scope, through eval), like check/ek-A.js.
// Европейско Кенгуру, 2 клас — pictures, builder P4: 380 towers of cubes (2026 #17), 381 drops of glue (2023 #15), 382 least paint
// (2019 #15), 383 numbers under figures (2022 #21, 2024 #11), 384 equal to the neighbours (2024 #16), 385 under the ink (2026 #19).
// Each printed task is checked against the official key and drawn as printed (a task whose answer is a picture: the right option is
// read back from the picture's label); then every generator is worked out again another way: the cubes recounted from the 3-D
// model, the figure tables solved by trying every value, the net summed node by node, the ink table read cell by cell.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 400)); };
  const label = o => (o.text[0].match(/aria-label="([^"]*)"/) || [0, strip(o.text[0])])[1].replace(/\s+/g, '');
  const pin = (name, tag, id, fields, shows, key) => {
    const sig = g => JSON.stringify(fields.map(f => g[f.k])), want = JSON.stringify(fields.map(f => f.v));
    const hit = pinSeed(name, () => Q.raw(id), g => sig(g) === want ? 2 : 0, 2e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    if(q.own){
      if(label(q.options[q.pick]) !== key.replace(/\s+/g, '')) throw new Error(name + ': the right option is ' + label(q.options[q.pick]) + ', the key says ' + key);
    } else {
      if(Q.answers(q).join() !== String(key)) throw new Error(name + ': gives ' + Q.answers(q) + ', the key says ' + key);
      if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    }
    return q;
  };
  const f = (k, v) => ({ k, v });
  pin('Кенгуру 2026 task 17', 'ek-2026-2', 380, [f('n', 6), f('h', 5), f('ask', 0), f('tops', [0, 0, 1, 1, 0, 0])],
    ['Построени са 6 кули с по 5 кубчета', 'Колко общо са жълтите кубчета'], 16);
  pin('Кенгуру 2023 task 15', 'ek-2023-2', 381, [f('n', 12), f('ans', 11)],
    ['Показана е конструкция от 12 кубчета. Всеки две кубчета с обща стена са залепени с по една капка лепило. Колко капки лепило са използвани?'], 11);
  pin('Кенгуру 2022 task 21', 'ek-2022-2', 383, [f('lay', 0), f('set', 0), f('vals', [6, 4, 2])], ['Намерете сбора във втората колонка'], 14);
  pin('Кенгуру 2024 task 11', 'ek-2024-2', 383, [f('lay', 1), f('set', 1), f('vals', [5, 2, 3])], ['Кое е числото под'], 3);
  pin('Кенгуру 2024 task 16', 'ek-2024-2', 384, [f('g', [[3, 1, 7], [12, 1, 5], [4, 2, 10]])],
    ['Например сборът, съответен на числото 3, е 12 + 1 + 1 = 14. Колко от числата вдясно са равни на съответните им сборове?'], 1);
  pin('Кенгуру 2026 task 19', 'ek-2026-2', 385, [f('sh', 0), f('an', 0), f('mask', 0)],
    ['Таблицата се състои от 12 квадратчета (3 реда и 4 колонки)', 'Коя комбинация се намира под знака X?'], 'кръг, кенгуру');
  {
    // 2019 task 15: the line, the square, the L, the S and the T of 4 cubes; the square needs the least paint (key B)
    const c = (...p) => p.map(([x, y, z]) => ({ x, y, z }));
    const printed = [c([0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]), c([0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]), c([0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0]),
      c([0, 0, 0], [1, 0, 0], [1, 1, 0], [2, 1, 0]), c([0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 0, 1])];
    const names = printed.map(Q.solidName), want = names.slice().sort().join();
    const hit = pinSeed('Кенгуру 2019 task 15', () => Q.raw(382), g => g.n === 4 && g.names.slice().sort().join() === want ? 2 : 0, 2e6);
    if(!hit) throw new Error('2019 task 15: level 382 never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    if(t.indexOf('Всяко от показаните тела е получено от 4 еднакви по размер кубчета'.replace(/\s+/g, '')) < 0 || t.indexOf('За кое тяло е изразходвана най-малко боя?'.replace(/\s+/g, '')) < 0) throw new Error('2019 task 15 is not drawn as printed: ' + t);
    if(!Q.LEVELS.find(l => l.id === 382).papers.includes('ek-2019-2')) throw new Error('level 382 is not tagged ek-2019-2');
    if(q.names[q.pick] !== names[1]) throw new Error('2019 task 15: the right solid is not the 2 × 2 square (key B)');
  }

  // 380 again: build every tower cube by cube, the colours alternating from the top, and count one colour
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(380));
    let n = 0;
    q.tops.forEach(top => { const tower = []; for(let k = 0; k < q.h; k++) tower.push(k ? 1 - tower[k - 1] : top); n += tower.filter(x => x === q.ask).length; });
    if(n !== q.ans || q.tops.length !== q.n || new Set(q.tops).size < 2) fail('380: the colour count is not the answer', q);
  }
  // 381 / 382 again: recount the glued faces on the 3-D model (look the neighbours up, not pair by pair), and check the model is one piece
  const near = (cells, c) => [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].filter(d => cells.some(o => o.x === c.x + d[0] && o.y === c.y + d[1] && o.z === c.z + d[2])).length;
  const onepiece = cells => { const seen = [cells[0]]; for(let k = 0; k < seen.length; k++) cells.forEach(o => { if(!seen.includes(o) && Math.abs(o.x - seen[k].x) + Math.abs(o.y - seen[k].y) + Math.abs(o.z - seen[k].z) === 1) seen.push(o); }); return seen.length === cells.length; };
  for(let i = 1; i <= 1500; i++){
    const q = Q.seeded(i, () => Q.raw(381)), drops = q.cells.reduce((s, c) => s + near(q.cells, c), 0) / 2;
    if(drops !== q.ans || q.cells.length !== q.n || !onepiece(q.cells) || !Q.isoReadable(q.cells) || new Set(q.cells.map(c => c.x + ',' + c.y + ',' + c.z)).size !== q.n) fail('381: the drops are not the answer', q);
    if(!strip(Q.drawQ(q)).includes('<svg') && !Q.drawQ(q).includes('<svg')) fail('381: no picture', q);
  }
  for(let i = 1; i <= 1500; i++){
    const q = Q.seeded(i, () => Q.raw(382)), surf = q.solids.map(s => s.reduce((a, c) => a + 6 - near(s, c), 0));   // faces of every cube not against another
    if(q.options.length !== 5 || new Set(q.names).size !== 5) fail('382: five different solids expected', q);
    if(q.solids.some(s => s.length !== q.n || !onepiece(s))) fail('382: a solid is not n cubes in one piece', q);
    if(surf[q.pick] !== Math.min(...surf) || surf.filter(x => x === surf[q.pick]).length !== 1) fail('382: the right solid is not the only one with the least surface ' + surf, q);
    if(q.solids.some((s, k) => Q.solidName(s) !== q.names[k])) fail('382: names do not match the solids', q);
    if(q.options.some(o => !/<svg/.test(o.text[0]))) fail('382: an option is not a picture', q);
  }
  // 383 again: every table is solved by trying every value; the sums shown leave exactly one choice, and a child's steps find it
  const trip = [];
  for(let a = 1; a <= 9; a++) for(let b = 1; b <= 9; b++) for(let c = 1; c <= 9; c++) if(a !== b && b !== c && a !== c) trip.push([a, b, c]);
  const shown = (L, v) => L.rows.map(r => L.g[r].reduce((s, x) => s + v[x], 0)).concat(L.cols.map(c => L.g.reduce((s, r) => s + v[r[c]], 0)));
  Q.SYMTABLE_LAYOUTS.forEach((L, k) => {
    const by = {};
    trip.forEach(v => { const key = shown(L, v).join(); (by[key] = by[key] || []).push(v); });
    if(Object.values(by).some(a => a.length > 1)) fail('383: layout ' + k + ' leaves two choices of numbers', L);
  });
  for(let i = 1; i <= 1500; i++){
    const q = Q.seeded(i, () => Q.raw(383)), L = Q.SYMTABLE_LAYOUTS[q.lay], sums = shown(L, q.vals).join();
    const all = trip.filter(v => shown(L, v).join() === sums);
    if(all.length !== 1 || all[0].join() !== q.vals.join()) fail('383: the sums shown do not fix the numbers', q);
    const v = all[0], ans = L.ask.t === 'sym' ? v[L.ask.s] : L.g.reduce((s, r) => s + v[r[L.ask.c]], 0);
    if(ans !== q.ans || Q.answers(q).join() !== String(ans)) fail('383: the answer is not the one found by trying every value', q);
    const steps = Q.symSteps(q);
    if(!steps.length || steps.some(s => s.val !== q.vals[s.s] || !Number.isInteger(s.val))) fail('383: a step finds a wrong number', q);
  }
  // 384 again: sum every node's neighbours by distance on the grid (the king's move), and read the worked example from the text
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(384)), cells = [];
    q.g.forEach((r, a) => r.forEach((v, b) => cells.push([a, b, v])));
    const eq = cells.filter(([a, b, v]) => cells.filter(([c, d]) => Math.max(Math.abs(a - c), Math.abs(b - d)) === 1).reduce((s, x) => s + x[2], 0) === v).length;
    if(eq !== q.ans) fail('384: the matching numbers are not the answer', q);
    const m = Q.drawQ(q).replace(/<[^>]*>/g, ' ').match(/Например сборът, съответен на числото (\d+), е ([\d +]+) = (\d+)\./);
    if(!m) fail('384: no worked example', q);
    const [a, b] = cells.find(c => c[2] === +m[1] && String(m[2]).trim().split(' + ').map(Number).sort().join() === cells.filter(([c2, d2]) => Math.max(Math.abs(c[0] - c2), Math.abs(c[1] - d2)) === 1).map(x => x[2]).sort().join()) || [];
    if(a === undefined || m[2].split('+').reduce((s, x) => s + +x, 0) !== +m[3]) fail('384: the worked example is wrong', q);
  }
  // 385 again: every ink pattern covers the X's square, yet leaves its shape in another square of the row (or the row's left end)
  // and its animal in another square of the column (or the column's top); the pair is read back from the table
  const SS = [[0, 1, 2], [3, 1, 0], [2, 3, 1]], AA = [[0, 1, 2, 3], [4, 5, 0, 1], [2, 3, 4, 5]];
  for(let i = 1; i <= 1500; i++){
    const q = Q.seeded(i, () => Q.raw(385)), M = Q.COMBO_MASKS[q.mask], [r, c] = M.x;
    const hidden = (i2, j2) => M.cells.some(x => x[0] === i2 && x[1] === j2);
    if(!hidden(r, c)) fail('385: the X is not on an inked square', q);
    const rowSeen = !M.left.includes(r) || [0, 1, 2, 3].some(j => j !== c && !hidden(r, j)), colSeen = !M.top.includes(c) || [0, 1, 2].some(i2 => i2 !== r && !hidden(i2, c));
    if(!rowSeen || !colSeen) fail('385: the shape or the animal under the X cannot be told', q);
    if(q.right[0] !== SS[q.sh][r] || q.right[1] !== AA[q.an][c]) fail('385: the right pair is not the table\'s', q);
    const labels = q.options.map(label);
    if(q.options.length !== 5 || new Set(labels).size !== 5 || q.options.some(o => !/<svg/.test(o.text[0]))) fail('385: five different pictures expected', q);
  }
}
