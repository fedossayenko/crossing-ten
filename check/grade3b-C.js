// Runs beside the app (in check.js's own scope, through eval), like check/grade3.js.
// МБГ Есен 2024 and Есен 2023, 3 клас — the geometry: a square's perimeter from its side in мм (251), squares cut from a
// sheet (252), a square and a strip (253, 254), a midpoint in mixed units (255), numbered points (256), the ant's
// rectangles (257), figures with no vertex in common (258) and a circle's cuts (259). Each printed task against the
// official key, drawn as printed and asked exactly by its level, then every new generator worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const tag = name => 'mbg-autumn-' + name.match(/20\d\d/)[0] + '-3';
  // the printed task: the key, the drawing (its pieces, in order), the paper's tag, and the level asking exactly it
  const pin = (name, id, q, key, shows) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    const text = strip(Q.drawQ(q));
    [].concat(shows).reduce((at, s) => { const k = text.indexOf(s.replace(/\s+/g, ''), at); if(k < 0) throw new Error(name + ' is not drawn as printed: ' + text); return k + 1; }, 0);
    const L = Q.LEVELS.find(l => l.id === id);
    if(L.grade !== 3 || !L.papers.includes(tag(name))) throw new Error('level ' + id + ' is not a 3rd-grade level tagged ' + name);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  const square = 'Колко сантиметра е обиколката на квадрата?';
  pin('Есен 2024 task 11', 251, {kind:'rectdm', shape:'mm', s:15, traps:[60], ans:6}, [6], 'Страната на квадрат е 15 мм. ' + square);
  pin('Есен 2023 task 12', 251, {kind:'rectdm', shape:'cmmm', s:55, traps:[20, 220], ans:22}, [22], 'Страната на квадрат е 5 см и 5 мм. ' + square);
  pin('Есен 2024 task 12', 252, {kind:'cutsq', s:3, sq:true, W:12, H:12, traps:[], ans:16}, [16], 'Колко най-много квадратчета със страна 3 см можем да изрежем от квадрат със страна 12 см?');
  pin('Есен 2024 task 13', 253, {kind:'sqsplit', shape:'glue', a:7, b:2, P1:28, P2:18, traps:[46, 39], ans:32}, [32],
    'От квадрат с обиколка 28 см и правоъгълник с обиколка 18 см построих правоъгълник с обиколка x см. Пресметнете x.');
  pin('Есен 2023 task 15', 254, {kind:'sqsplit', shape:'split', s:4, x:1, P1:10, P2:14, traps:[6], ans:4}, [4],
    'Квадрат е разделен на два правоъгълника с обиколки 10 см и 14 см. Колко см е страната на квадрата?');
  pin('Есен 2024 task 14', 255, {kind:'seg', shape:'mid', units:['дм', 'мм', 'см'], cm:[10, 6, 12], AD:28, toB:true, traps:[14, 2], ans:4}, [4],
    ['Ако AB = 1 дм, BC = 60 мм, CD = 12 см и AM = MD, пресметнете в сантиметри дължината на отсечката MB.', 'A', 'B', 'C', 'D']);
  pin('Есен 2023 task 13', 256, {kind:'segnum', n:10, m:true, L:100, i:3, j:9, toB:true, c:6, p:10, traps:[40], ans:50}, [50],
    ['Отсечка AB е дълга 1 м и е разделена на 10 равни части чрез точки. Те са номерирани и точката A е първата точка, а точката B е последната. ' +
     'Точка C се намира на еднакво разстояние от точките с номер 3 и номер 9. Колко сантиметра е разстоянието от точка C до точка B?', '1 2 3 4 5 6 7 8 9 10 11 A B']);
  pin('Есен 2023 task 11', 257, {kind:'rects', shape:4, W:3, H:2, c:1, r:2, wide:3, tall:2, traps:[5], ans:6}, [6], 'В колко правоъгълника е мравката? (Квадратът е правоъгълник.)');
  pin('Есен 2023 task 14', 258, {kind:'nocommon', n:7, t:5, s:2, V:23, askT:true, traps:[2], ans:5}, [5],
    'Начертах триъгълници и квадрати – общо 7 фигури. Сред тези фигури няма такава, която да има общ връх с друга от начертаните фигури. Колко са начертаните триъгълници, ако върховете на начертаните фигури са общо 23?');
  pin('Есен 2024 task 18', 259, {kind:'circcut', k:3, n:4, traps:[10, 8], ans:11}, [11],
    ['Кръг можем да разрежем на 2 части с 1 разрязване', 'с три разрязвания кръга можем да разрежем най-много на 7 части', 'На колко най-много части можем да разрежем кръг с 4 разрязвания?']);
  // the ant of task 11 sits in the top left square of the 3 by 2 grid, as printed
  if(Q.drawQ({kind:'rects', shape:4, W:3, H:2, c:1, r:2, wide:3, tall:2, traps:[5], ans:6}).indexOf('translate(18 18)') < 0) throw new Error('Есен 2023 task 11: the ant is not in the top left square');

  // the cuts of a circle as drawn: every two chords that cross inside it, none three at one point; the pieces are
  // one, plus one for each chord, plus one for each crossing
  const chords = svg => [...svg.matchAll(/<line x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"/g)].map(m => m.slice(1).map(Number));
  const pieces = (ls, cx) => {
    const pts = [];
    for(let a = 0; a < ls.length; a++) for(let b = a + 1; b < ls.length; b++){
      const [x1, y1, x2, y2] = ls[a], [x3, y3, x4, y4] = ls[b], d = (x2 - x1)*(y4 - y3) - (y2 - y1)*(x4 - x3);
      if(!d) continue;
      const t = ((x3 - x1)*(y4 - y3) - (y3 - y1)*(x4 - x3)) / d, u = ((x3 - x1)*(y2 - y1) - (y3 - y1)*(x2 - x1)) / d;
      if(t > 0 && t < 1 && u > 0 && u < 1) pts.push([x1 + t*(x2 - x1) - cx, y1 + t*(y2 - y1)]);
    }
    if(pts.some((p, i) => pts.some((o, j) => j > i && Math.hypot(p[0] - o[0], p[1] - o[1]) < 1))) return -1;   // three at one point
    return 1 + ls.length + pts.length;
  };
  const seen = {}, see = k => { seen[k] = (seen[k] || 0) + 1; };
  for(let i = 0; i < 2000; i++){
    // 251: the side read back from the question, the four sides added in мм, then 10 мм to the сантиметър
    const r = Q.raw(251), side = strip(Q.drawQ(r)).match(/квадрате(\d+)(?:сми(\d+))?мм\./);
    see(r.shape);
    const mm = side && (side[2] ? 10*+side[1] + +side[2] : +side[1]), round = mm && mm + mm + mm + mm;
    if(!side || (r.shape === 'cmmm') !== !!side[2] || round % 10 || round / 10 !== r.ans || r.ans < 1) fail('rectdm ' + r.shape + ': the side reads ' + (side && side[0]), r);
    // 252: the small squares laid out row by row while they still fit
    const c = Q.raw(252);
    let fit = 0; for(let x = 0; x + c.s <= c.W; x += c.s) for(let y = 0; y + c.s <= c.H; y += c.s) fit++;
    if(fit !== c.ans || c.W > 60 || c.H > 60 || c.s > 9 || (c.sq ? c.W !== c.H : c.W === c.H)) fail('cutsq: ' + fit, c);
    // 253: the new rectangle drawn on a grid, square to the right of the strip, and its outline counted edge by edge
    const g = Q.raw(253), a = g.P1 / 4, b = g.P2 / 2 - a, cells = new Set();
    for(let x = 0; x < a + b; x++) for(let y = 0; y < a; y++) cells.add(x + ',' + y);
    let edge = 0; cells.forEach(k => { const [x, y] = k.split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if(!cells.has((x + dx) + ',' + (y + dy))) edge++; }); });
    if(!Number.isInteger(a) || !(b >= 1 && b < a) || edge !== g.ans) fail('sqsplit glue: the outline counts ' + edge, g);
    // 254: every square up to 40 cut every way — exactly one has the two perimeters
    const s = Q.raw(254), sides = [];
    for(let n = 2; n <= 40; n++) for(let x = 1; x < n; x++) if(2*(x + n) === s.P1 && 2*(2*n - x) === s.P2 || 2*(x + n) === s.P2 && 2*(2*n - x) === s.P1) if(!sides.includes(n)) sides.push(n);
    if(sides.join() !== String(s.ans) || s.P1 >= s.P2) fail('sqsplit split: sides ' + sides, s);
    // 255: the three lengths read from the question, in мм along a line; M halfway from A to D, measured to B or C
    const m = Q.raw(255), given = [...strip(Q.drawQ(m)).matchAll(/(AB|BC|CD)=(\d+)(дм|см|мм)/g)].map(x => +x[2]*{дм:100, см:10, мм:1}[x[3]]);
    const B = given[0], C = B + given[1], D = C + given[2], M = D / 2, to = strip(Q.drawQ(m)).match(/отсечката(M[BC])\./);
    if(given.length !== 3 || !to || !(M > B && M < C) || Math.abs(M - (to[1] === 'MB' ? B : C)) !== 10*m.ans || new Set(m.units).size !== 3) fail('seg mid: ' + given, m);
    // 256: the points placed along the segment in см; C is the place as far from one numbered point as from the other
    const p = Q.raw(256), at = k => (k - 1)*p.L / p.n, spots = [];
    for(let x = 0; x <= p.L; x++) if(Math.abs(x - at(p.i)) === Math.abs(x - at(p.j))) spots.push(x);
    const end = /точкаB\?/.test(strip(Q.drawQ(p))) ? p.L : 0;
    if(spots.length !== 1 || Math.abs(spots[0] - end) !== p.ans || (p.toB ? end !== p.L : end !== 0) || !Number.isInteger(p.L / p.n) || !Number.isInteger(spots[0] / (p.L / p.n))) fail('segnum: C at ' + spots, p);
    // 257: every rectangle of the grid, by its two corners, that holds the ant's square
    const t = Q.raw(257);
    let hold = 0;
    for(let x1 = 1; x1 <= t.W; x1++) for(let x2 = x1; x2 <= t.W; x2++) for(let y1 = 1; y1 <= t.H; y1++) for(let y2 = y1; y2 <= t.H; y2++) if(x1 <= t.c && t.c <= x2 && y1 <= t.r && t.r <= y2) hold++;
    if(hold !== t.ans || t.W > 5 || t.H > 3 || hold > 24) fail('rects in: ' + hold, t);
    // 257 and 19's ant: the worked picture puts the ant in the square the question shows it in (the question counts
    // its row from the bottom), and every small grid's rectangle holds it, each rectangle once
    let a19 = Q.raw(19); while(a19.shape !== 0) a19 = Q.raw(19);
    [t, a19, {kind:'rects', shape:4, W:3, H:2, c:1, r:2, wide:3, tall:2, traps:[5], ans:6}].forEach(q => {
      const ant = Q.drawQ(q).match(/translate\(([\d.]+) ([\d.]+)\)/), col = +ant[1] / 36 + 0.5, row = +ant[2] / 36 + 0.5;
      const minis = [...Q.why(q, true).matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="[\d.]+" height="[\d.]+" fill="none" stroke="var\(--line\)"\/>.*?<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="rgba\(47,111,143,.18\)"[^>]*\/><circle cx="([\d.]+)" cy="([\d.]+)"/g)]
        .map(m => m.slice(1).map(Number)).map(([gx, gy, hx, hy, hw, hh, cx, cy]) => ({ col: Math.floor((cx - gx) / 9) + 1, row: Math.floor((cy - gy) / 9) + 1,
          inside: hx < cx && cx < hx + hw && hy < cy && cy < hy + hh, box: [hx - gx, hy - gy, hw, hh].join() }));
      if(col !== q.c || row !== q.H - q.r + 1 || minis.length !== q.ans || new Set(minis.map(m => m.box)).size !== q.ans ||
         minis.some(m => m.col !== col || m.row !== row || !m.inside)) fail('rects: the worked picture does not put the ant where the question does (row ' + row + ' from the top)', q);
    });
    // 258: every split of the figures into triangles and squares tried
    const f = Q.raw(258), fits = [];
    for(let k = 0; k <= f.n; k++) if(3*k + 4*(f.n - k) === f.V) fits.push(f.askT ? k : f.n - k);
    if(fits.join() !== String(f.ans) || f.t < 1 || f.s < 1) fail('nocommon: ' + fits, f);
    // the worked line names one square or one triangle in the singular, in both languages
    try {
      [['bg', 'значиквадрат' + (f.s === 1 ? 'ъте' : 'итеса') + f.s, f.t === 1 ? 'триъгълникът:' : 'триъгълниците:'],
       ['uk', 'отже,квадрат' + (f.s === 1 ? '' : 'ів') + '—' + f.s, f.t === 1 ? 'трикутник:' : 'трикутників:']].forEach(([l, sq, tri]) => {
        APP.LANG = l;
        const w = strip(Q.why(f, true));
        if(!w.includes(sq) || f.askT !== w.includes(tri)) fail('nocommon (' + l + '): the count is not worded «' + sq + '» / «' + tri + '»: ' + w, f);
      });
    } finally { APP.LANG = 'bg'; }
    // 259: the pieces of the two circles shown, and of the worked picture, counted from the chords as drawn
    const k = Q.raw(259), shown = chords(Q.drawQ(k)), worked = chords(Q.why(k, true));
    if(shown.length !== 1 + k.k || pieces(shown.slice(0, 1), 0) !== 2 || pieces(shown.slice(1), 108) !== 1 + k.k*(k.k + 1) / 2 || pieces(worked, 0) !== k.ans || worked.length !== k.n) fail('circcut: the drawn cuts make ' + pieces(worked, 0), k);
  }
  if(!seen.mm || !seen.cmmm) throw new Error('rectdm 251 never draws both sides: ' + JSON.stringify(seen));
  console.log('МБГ Есен 2024 and 2023, 3 клас, the geometry: 2024 tasks 11, 12, 13, 14, 18 and 2023 tasks 11, 12, 13, 14, 15 match the key (6, 16, 32, 4, 11; 6, 22, 50, 5, 4) and their levels ask them exactly; sides read back, squares laid out, outlines counted on a grid, squares and splits tried, points placed, rectangles and chords counted again, the ant where the question puts it (257 and 19), one square or triangle named in the singular');
}
