// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
// МБГ Полуфинал 2024 and 2025, 1 клас — the kinds pencil, seg, segword, rectfig, rectdm, rects, paintrow and
// dicestack, and the new zigzag and distpts: each printed task against the official key, drawn as printed and
// asked by its level's own generator, then the new shapes worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const tag = name => name.includes('2024') ? 'mbg-semifinal-2024-1' : 'mbg-semifinal-2025-1';
  // the printed task: the key, the drawing, the paper's tag, and the level asking exactly it
  const pin = (name, id, q, key, shows) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag(name))) throw new Error('level ' + id + ' is not tagged ' + name);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Полуфинал 2024 task 11', 161, {kind:'pencil', shape:'one', a:3, b:11, ref:6, long:true, traps:[5], ans:2}, [2], 'С колко сантиметра този молив е по-дълъг от молив с дължина 6 см');
  pin('Полуфинал 2024 task 13', 163, {kind:'seg', mm:false, p:3, q:1, r:6, AB:4, CD:7, ans:10}, [10], 'AD = ? см A C B D AB = 4 см CD = 7 см CB = 1 см');
  pin('Полуфинал 2025 task 12', 163, {kind:'seg', shape:'cbov', p:2, q:1, r:4, AB:3, CD:5, AD:7, traps:[8, 4], ans:1}, [1], 'CB = ? см A C B D AD = 7 см AB = 3 см CD = 5 см');
  pin('Полуфинал 2024 task 14', 210, {kind:'rectfig', shape:'row', tiles:[[0,0,1,1],[1,0,1,1],[2,0,1,1]], traps:[3, 4], ans:6}, [6], 'На тази картинка има 3 правоъгълника');
  pin('Полуфинал 2024 task 15', 211, {kind:'rectdm', shape:2, a:3, d:2, b:5, traps:[8, 5], ans:16}, [16], 'Една от страните на правоъгълник е 3 см, а другата е с 2 см по-дълга. Колко сантиметра е обиколката на правоъгълника');
  pin('Полуфинал 2025 task 13', 212, {kind:'rects', shape:3, n:4, ants:[1, 4], runs:[2], all:10, free:3, traps:[10, 2], ans:7}, [7], 'Колко са всички правоъгълници на чертежа, в които има поне една мравка');
  pin('Полуфинал 2025 task 11', 214, {kind:'distpts', d:3, r:1, both:false, traps:[2], ans:4}, [4],
    'Мария начертала права линия и отбелязала върху нея точката A. След това върху същата права на разстояние 3 см от A отбелязала точката B. Колко са точките, които можем да отбележим върху тази права, всяка на разстояние 1 см от една от точките A и B?');
  pin('Полуфинал 2024 task 20', 215, {kind:'paintrow', shape:'two', n:3, c:2, cols:[1, 2], traps:[8], ans:2}, [2], 'Всяко от трите квадратчета трябва да се оцвети в някой от цветовете зелено или червено, като две съседни квадратчета не могат да бъдат оцветени в един и същ цвят');
  pin('Полуфинал 2025 task 14', 176, {kind:'segword', who:0, a:21, d1:3, d2:8, short1:true, long2:true, b:18, ans:26}, [26],
    'Мария начертала три отсечки. Първата е дълга 21 см, втората е с 3 см по-къса от първата, а третата отсечка е по-дълга от втората с 8 см');
  pin('Полуфинал 2025 task 20', 183, {kind:'dicestack', top:[1, 5, 4], bot:[6, 3], traps:[19, 2], ans:23}, [23], 'Колко е броят на точките, които не се виждат');

  // a line of the zigzag kind walked one centimetre at a time from the top edge: its length, or why it is not a line
  // of the task — it leaves its own columns, comes back to a point it passed, or does not end on the bottom edge
  const walk = (ln, band, V) => {
    let x = ln.x, y = 0, n = 0;
    const seen = new Set(['' + x + ',' + y]), step = (dx, dy) => {
      x += dx; y += dy; n++;
      if(x < 5*band + 1 || x > 5*band + 4) throw new Error('zigzag: line ' + (band + 1) + ' leaves its columns');
      if(seen.has(x + ',' + y)) throw new Error('zigzag: line ' + (band + 1) + ' meets itself');
      seen.add(x + ',' + y);
    };
    if(x < 5*band + 1 || x > 5*band + 4) throw new Error('zigzag: line ' + (band + 1) + ' starts outside its columns');
    ln.segs.forEach(([d, s]) => { for(let k = 0; k < d; k++) step(0, 1); for(let k = 0; k < Math.abs(s); k++) step(Math.sign(s), 0); });
    if(y !== V) throw new Error('zigzag: line ' + (band + 1) + ' ends at ' + y + ', not on the bottom edge');
    return n;
  };
  { // Полуфинал 2025 task 15: the paper's five lines, sideways runs negative to the left, each in its own five columns
    const runs = [[[1, 1], [2, -3], [2, 2], [4, 0]], [[1, 1], [2, -2], [2, -1], [2, 1], [2, 0]], [[1, -3], [3, 3], [1, -1], [1, -1], [3, 0]],
                  [[2, -1], [1, 2], [2, -2], [2, 2], [1, -1], [1, 0]], [[2, -2], [1, 3], [4, -2], [2, 0]]];
    const lines = runs.map((segs, i) => { let x = 0, lo = 0; segs.forEach(s => { x += s[1]; lo = Math.min(lo, x); }); return {x: 5*i + 1 - lo, segs}; });
    const lens = lines.map((ln, i) => walk(ln, i, 9)), q = {kind:'zigzag', V:9, lines, lens, traps:[9, 17], ans:14};
    if(lens.join() !== '15,14,17,17,16') fail('Полуфинал 2025 task 15: the printed lines walk ' + lens, q);
    if(Q.answers(q).join() !== '14' || !Q.accepts(q, ['14'])) fail('Полуфинал 2025 task 15: gives ' + Q.answers(q) + ', the key says 14', q);
    if(strip(Q.drawQ(q)).indexOf(strip('Колко сантиметра е най-късата от начупените линии')) < 0 || (Q.drawQ(q).match(/<path /g) || []).length !== 5) fail('Полуфинал 2025 task 15 is not drawn as printed', q);
    if(!Q.LEVELS.find(l => l.id === 213).papers.includes('mbg-semifinal-2025-1')) fail('level 213 is not tagged Полуфинал 2025', q);
    // the generator draws the same task with other lines: five lines 9 down, of 15, 14, 17, 17 and 16
    const sorted = g => g.V + ':' + g.lens.slice().sort((a, b) => a - b).join();
    if(!pinSeed('Полуфинал 2025 task 15', () => Q.raw(213), g => g.lines.length === 5 && sorted(g) === sorted(q) ? 1 : 0, 100000)) fail('Полуфинал 2025 task 15: level 213 never asks five lines of those lengths', q);
  }

  const cnt = (lo, hi, ok) => { let n = 0; for(let v = lo; v <= hi; v++) if(ok(v)) n++; return n; };
  for(let i = 0; i < 3000; i++){
    // 161, one pencil: its centimetres counted one by one off the ruler, against the length told
    let p = Q.raw(161); while(p.shape !== 'one') p = Q.raw(161);
    const len = cnt(p.a, p.b - 1, () => true);
    if(p.a < 1 || p.b > 15 || len < 5 || p.ref < 1 || (len > p.ref) !== p.long || Math.abs(len - p.ref) !== p.ans || p.ans < 1 || p.ans > 4) fail('pencil one', p);
    // 163, CB from AD, AB and CD: every place for C and B between A = 0 and D tried
    let s = Q.raw(163); while(s.shape !== 'cbov') s = Q.raw(163);
    const cbs = [];
    for(let C = 1; C < s.AD; C++) for(let B = C + 1; B < s.AD; B++) if(B === s.AB && s.AD - C === s.CD) cbs.push(B - C);
    if(cbs.length !== 1 || cbs[0] !== s.ans) fail('seg cbov: ' + cbs, s);
    // 210: every rectangle of the row, by its two ends; the example's number is the row one square shorter
    const r = Q.raw(210), n = r.tiles.length, rects = m => { let c = 0; for(let x1 = 0; x1 < m; x1++) for(let x2 = x1 + 1; x2 <= m; x2++) c++; return c; };
    if(rects(n) !== r.ans || n < 3 || n > 5 || strip(Q.drawQ(r)).indexOf('има' + rects(n - 1) + 'правоъгълника') < 0) fail('rectfig row', r);
    // 211: the four sides walked round
    const m = Q.raw(211), sides = [m.a, m.a + m.d, m.a, m.a + m.d];
    if(sides.reduce((t, v) => t + v, 0) !== m.ans || m.b !== m.a + m.d) fail('rectdm 2', m);
    // 212: every rectangle of the strip, kept when it holds an ant
    const t = Q.raw(212); let held = 0;
    for(let a = 1; a <= t.n; a++) for(let b = a; b <= t.n; b++) if(t.ants.some(c => c >= a && c <= b)) held++;
    if(held !== t.ans || t.ants.length < 2 || t.ants.length >= t.n || new Set(t.ants).size !== t.ants.length) fail('rects 3: ' + held, t);
    // 213: every line walked, the shortest the only one
    const z = Q.raw(213), lens = z.lines.map((ln, k) => walk(ln, k, z.V)), best = Math.min(...lens);
    if(lens.join() !== z.lens.join() || best !== z.ans || lens.filter(v => v === best).length !== 1 || z.lines.length < 4 || z.lines.length > 5) fail('zigzag: ' + lens, z);
    // 214: every whole centimetre of the line tried, A and B themselves left out
    const d = Q.raw(214), pts = cnt(-20, 20, x => x !== 0 && x !== d.d && (Math.abs(x) === d.r || Math.abs(x - d.d) === d.r));
    if(pts !== d.ans || d.d <= d.r) fail('distpts: ' + pts, d);
    // 215: every colouring of the row tried
    const c = Q.raw(215), cols = c.cols || [0, 1, 2, 3].slice(0, c.c); let ways = 0;
    for(let k = 0; k < Math.pow(cols.length, c.n); k++){
      const row = []; for(let j = 0, v = k; j < c.n; j++, v = Math.floor(v / cols.length)) row.push(cols[v % cols.length]);
      if(row.every((x, j) => !j || x !== row[j - 1]) && !(c.shape === 'end' && row[0] !== cols[0])) ways++;
    }
    if(ways !== c.ans) fail('paintrow ' + c.shape + ': ' + ways + ' ways', c);
  }
  console.log('МБГ Полуфинал 2024 and 2025, 1 клас: tasks 2024 11, 13, 14, 15, 20 and 2025 11, 12, 13, 14, 20 match the key and their levels ask them exactly, 2025 15 with other lines of the same lengths; one pencil, CB from overlaps, a row of squares, the perimeter, the ants, the lines, the points and the colourings worked out again by brute force');
}
