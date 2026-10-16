// Runs beside the app (in check.js's own scope, through eval), like check/grade1c-A.js.
// Аз и числата (СБНУ), 2 клас, 2022–2026 — geometry and units: comparing lengths (280), a rectangle's side and
// perimeter (281), a triangle's perimeter (282), a triangle's kind (283), the fir tree of triangles (284), and the
// units drill (267). The papers come with no answer key: each printed task is checked against our own solution,
// drawn as printed and asked exactly by its level; then each new generator is worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // sig: the fields that make the question (the rest — options, traps — follow from them)
  const pin = (paper, task, id, q, key, shows, sig, tries = 300000) => {
    const name = 'Аз и числата ' + paper + ' task ' + task, tag = 'ach-' + paper + '-2';
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', our solution says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the answer is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const want = sig(q);
    if(pinSeed(name, () => Q.raw(id), g => g.kind === q.kind && sig(g) === want ? 2 : 0, tries)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };

  // 280 — the three signs, always in this order; the answer is the sign's place
  const SIGNS = ['&lt;', '=', '&gt;'];
  const uc = (shape, L, R, pick) => ({kind:'unitcmp', shape, L, R, options: SIGNS.map((s, id) => ({ id, v: id, text: [s, s] })), pick, own: true, ans: pick});
  const side = s => s.op ? [s.a, s.op, s.b, s.u].join(' ') : s.n + ' ' + s.u;
  const ucSig = g => g.shape + '|' + side(g.L) + '|' + side(g.R), shown = s => s.op ? s.a + ' ' + s.u + ' ' + s.op + ' ' + s.b + ' ' + s.u : s.n + ' ' + s.u;
  const n = (v, u) => ({n: v, u}), sum = (a, op, b, u) => ({a, op, b, u});
  const plain3 = [['а', n(40, 'дм'), n(6, 'дм'), 2], ['б', n(3, 'дм'), n(30, 'см'), 1], ['в', n(90, 'см'), n(1, 'м'), 0]];
  for(const paper of ['2026', '2024']) plain3.forEach(([t, L, R, k]) => pin(paper, (paper === '2026' ? '6' : '5') + t, 280, uc('plain', L, R, k), [k], shown(L) + ' □ ' + shown(R), ucSig));
  [['а', n(52, 'см'), n(5, 'дм'), 2], ['б', n(3, 'дм'), n(29, 'см'), 2], ['в', n(1, 'дм'), n(100, 'см'), 0],
   ['г', n(60, 'см'), n(6, 'дм'), 1], ['д', n(1, 'м'), n(100, 'см'), 1], ['е', n(9, 'см'), n(1, 'дм'), 0]]
    .forEach(([t, L, R, k]) => pin('2022', '8' + t, 280, uc('plain', L, R, k), [k], shown(L) + ' □ ' + shown(R), ucSig));
  [['а', sum(50, '+', 50, 'см'), n(1, 'м'), 1], ['б', sum(10, '−', 4, 'м'), n(6, 'см'), 2], ['в', sum(3, '+', 6, 'дм'), n(900, 'см'), 0]]
    .forEach(([t, L, R, k]) => pin('2025', '3' + t, 280, uc('sum', L, R, k), [k], shown(L) + ' □ ' + shown(R), ucSig, 1e7));   // one sum in millions: searched long, once

  // 281 — the pool (2026, задача 7), the squares in a row (2025, задача 11), the rectangle under the triangle (2025, задача 4)
  const poolSig = g => [g.shape, g.thing, g.a, g.d, g.short].join();
  pin('2026', '7а', 281, {kind:'rectdm', shape:'side', thing:0, a:25, d:8, short:true, b:17, traps:[33], ans:17}, [17],
    'Плувен басейн в училище има правоъгълна форма. Едната страна е 25 м, а другата е с 8 м по-къса. Колко метра е втората страна?', poolSig);
  pin('2026', '7б', 281, {kind:'rectdm', shape:'perim', thing:0, a:25, d:8, short:true, b:17, traps:[42, 116], ans:84}, [84],
    'Едната страна е 25 м, а другата е с 8 м по-къса. Колко метра е обиколката на басейна?', poolSig);
  pin('2025', '11', 281, {kind:'rectdm', shape:'row', m:3, s:6, traps:[72, 24, 42], ans:48}, [48],
    'Страната на всеки квадрат е 6 см. Пресметни обиколката на цялата фигура.', g => [g.shape, g.m, g.s].join());
  pin('2025', '4 (правоъгълникът)', 281, {kind:'rectdm', shape:'house', t:2, L:4, traps:[10, 6, 8], ans:12}, [12],
    'Страната на равностранния триъгълник е 2 см, а дължината на правоъгълника е 4 см. Колко сантиметра е обиколката на правоъгълника?', g => [g.shape, g.t, g.L].join());

  // 282 — three sides added (2022, задача 7), an equilateral side tripled (2025, задача 4), the third side (2026, задача 8; 2023, задача 9)
  pin('2022', '7', 282, {kind:'isoperim', shape:'sum', u:'см', s:[4, 6, 5], traps:[10, 19], ans:15}, [15],
    'Страните на триъгълник са 4 см, 6 см и 5 см. Колко сантиметра е обиколката на триъгълника?', g => [g.shape, g.u, (g.s || []).slice().sort().join('/')].join());
  pin('2025', '4 (триъгълникът)', 282, {kind:'isoperim', shape:'eq', u:'см', a:2, traps:[4, 8, 2], ans:6}, [6],
    'Страната на равностранен триъгълник е 2 см. Колко сантиметра е обиколката на триъгълника?', g => [g.shape, g.u, g.a].join());
  const backSig = g => [g.shape, g.u, g.tree, g.P, g.a, g.b].join();
  pin('2026', '8', 282, {kind:'isoperim', shape:'back', u:'см', tree:false, P:21, a:5, b:9, traps:[16, 12, 14], ans:7}, [7],
    'Триъгълник има обиколка 21 см. Едната му страна е 5 см, а втората — 9 см. Колко сантиметра е дължината на третата страна?', backSig);
  pin('2023', '9', 282, {kind:'isoperim', shape:'back', u:'м', tree:true, P:68, a:16, b:26, traps:[52, 42], ans:26}, [26],
    'Във вълшебния Триъгълен град растяло триъгълно дърво, което имало обиколка 68 м. Ако едната му страна е 16 м, а другата — 26 м, колко метра е третата страна?', backSig, 1e7);

  // 283 — three triangles by their sides (2022, задача 6), the three names (2024, задача 12)
  const NAMES = [['равностранен', 'рівносторонній'], ['равнобедрен', 'рівнобедрений'], ['разностранен', 'різносторонній']];
  const tt = (o, t) => Object.assign({kind:'tritype'}, o, { options: NAMES.map((x, id) => ({ id, v: id, text: x.map(w => '<span class="vw">' + w + '</span>') })), pick: t, own: true, ans: t });
  const ttSig = g => g.shape + '|' + (g.s ? g.s.slice().sort((a, b) => a - b).join('/') + g.u : g.t);
  [['а', [3, 3, 3], 0], ['б', [2, 4, 4], 1], ['в', [6, 5, 4], 2]].forEach(([k, s, t]) =>
    pin('2022', '6' + k, 283, tt({shape:'sides', s, u:'см', t}, t), [t], 'Какъв вид е триъгълникът според дължините на страните?' + s.map(v => v + ' см').join(''), ttSig));
  [['а', 2, 'три различни'], ['б', 0, 'три равни'], ['в', 1, 'две равни']].forEach(([k, t, w]) =>
    pin('2024', '12' + k, 283, tt({shape:'name', t}, t), [t], 'Триъгълник с ' + w + ' страни се нарича', ttSig));

  // 284 — the fir tree of three (2025, задача 1)
  pin('2025', '1', 284, {kind:'vtri', shape:'tree', n:3, traps:[3, 2, 6], ans:5}, [5], 'Колко са триъгълниците в елхичката?', g => [g.shape, g.n].join());

  // 267 — the units drill (2023, задача 2): 5 дм, 8 м and 6 дм down a unit; 10 дм = 100 см it never asks
  const unitSig = g => [g.shape, g.big, g.small, g.a].join();
  [['а', 'дм', 'см', 5], ['б', 'м', 'дм', 8], ['в', 'дм', 'см', 6]].forEach(([k, big, small, a]) =>
    pin('2023', '2' + k, 267, {kind:'units', shape:'down', big, small, k:10, a, ans:10*a, traps:[100*a]}, [10*a], a + ' ' + big + ' = ' + small, unitSig));
  for(let i = 1; i <= 3000; i++){ const g = seeded(i, () => Q.raw(267)); if(g.shape === 'down' && g.big === 'дм' && g.a === 10) fail('267 asks 10 дм after all: pin it', g); }

  // ---- each generator worked out again another way ----
  const MM = { см:10, дм:100, м:1000 };
  const lenMm = s => (s.op ? (s.op === '+' ? s.a + s.b : s.a - s.b) : s.n) * MM[s.u];
  const pathPts = h => [...h.matchAll(/<path d="M([^"]+)Z"/g)].map(m => m[1].split('L').map(p => p.trim().split(/\s+/).map(Number)));
  let eq280 = 0, bare = 0, sums = 0;
  const kinds283 = [0, 0, 0];
  for(let i = 0; i < 3000; i++){
    // 280: the two lengths in millimetres decide the sign; whole numbers, to a hundred (the wrong-way hundreds to 900)
    const c = Q.raw(280), l = lenMm(c.L), r = lenMm(c.R), want = l < r ? 0 : l === r ? 1 : 2;
    if(c.ans !== want || c.pick !== want || c.options.map(o => o.text[0]).join() !== SIGNS.join()) fail('280: the sign is ' + SIGNS[want], c);
    if(c.shape === 'sum'){
      sums++;
      const S = c.L.op === '+' ? c.L.a + c.L.b : c.L.a - c.L.b;
      if(S < 2 || S > 100 || c.L.a < 1 || c.L.b < 1 || !(c.R.n <= 100 || (c.R.n % 100 === 0 && c.R.n <= 900))) fail('280 sum: out of range', c);
    } else if(c.L.n > 100 || c.R.n > 100 || c.L.n < 1 || c.R.n < 1) fail('280: out of range', c);
    if(want === 1) eq280++;
    const bareL = c.L.op ? (c.L.op === '+' ? c.L.a + c.L.b : c.L.a - c.L.b) : c.L.n, bareSign = bareL < c.R.n ? 0 : bareL === c.R.n ? 1 : 2;
    if(bareSign !== want) bare++;
    if(/class="slot"/.test(Q.drawQ(c))) fail('280 draws an answer box', c);
    // 281: the other side, the perimeter, the edge of the squares (2m + 2 sides), the rectangle as wide as the triangle's side
    const p = Q.raw(281);
    const pw = p.shape === 'row' ? (2*p.m + 2)*p.s : p.shape === 'house' ? 2*(p.L + p.t) : p.shape === 'side' ? (p.short ? p.a - p.d : p.a + p.d) : 2*(p.a + (p.short ? p.a - p.d : p.a + p.d));
    if(p.ans !== pw || p.ans > 100 || (p.traps || []).includes(p.ans)) fail('281: worked out ' + pw, p);
    if(p.shape === 'row'){ const m = Q.drawQ(p).match(/<rect[^>]*width="([\d.]+)" height="([\d.]+)"/); if(!m || Math.abs(+m[1] / +m[2] - p.m) > 0.01) fail('281 row: not drawn as ' + p.m + ' squares', p); }
    if(p.shape === 'house' && p.L <= p.t) fail('281 house: the rectangle is not longer than it is wide', p);
    // 282: the perimeter is the three sides; the third side what is left, and a real triangle
    const t = Q.raw(282), sides = t.shape === 'sum' ? t.s : t.shape === 'eq' ? [t.a, t.a, t.a] : [t.a, t.b, t.P - t.a - t.b];
    const P = sides[0] + sides[1] + sides[2], ans282 = t.shape === 'back' ? sides[2] : P;
    if(t.ans !== ans282 || P > 100 || sides.some((v, k) => v < 1 || v >= P - v)) fail('282: worked out ' + ans282, t);
    // 283: the kind from how many sides are equal; the drawing to scale (each side's drawn length over its label the same)
    const y = Q.raw(283);
    kinds283[y.t]++;
    if(y.options.map(o => strip(o.text[0]) + strip(o.text[1])).join() !== NAMES.map(x => x.join('')).join() || y.pick !== y.t || y.ans !== y.t) fail('283: options', y);
    if(y.shape === 'sides'){
      const [a, b, cc] = y.s, eqs = (a === b) + (b === cc) + (a === cc), kind = eqs === 3 ? 0 : eqs === 1 ? 1 : 2;
      if(kind !== y.t || [a, b, cc].some((v, k, s) => v >= s.reduce((x, z) => x + z, 0) - v)) fail('283: sides ' + y.s + ' are not a ' + NAMES[y.t][0], y);
      const [pts] = pathPts(Q.drawQ(y)), d = (u, v) => Math.hypot(pts[u][0] - pts[v][0], pts[u][1] - pts[v][1]);
      const ratio = [d(0, 1) / a, d(0, 2) / b, d(1, 2) / cc];   // base, left, right
      if(Math.max(...ratio) - Math.min(...ratio) > 0.02*ratio[0]) fail('283: not drawn to scale ' + ratio, y);
    }
  }
  if(eq280 < 500 || eq280 > 1300) throw new Error('280: equal lengths in ' + eq280 + ' of 3000, not about a third');
  if(bare < 1000) throw new Error('280: the bare numbers mislead in only ' + bare + ' of 3000');
  if(sums < 600 || sums > 1200) throw new Error('280: a sum in ' + sums + ' of 3000');
  if(kinds283.some(k => k < 800)) throw new Error('283: the three kinds drawn ' + kinds283);
  // 284: the triangles in the drawn tree counted from its lines — every point where lines meet, every three of them joined
  // pairwise along a line and not on one line — for each size of tree
  for(let k = 2; k <= 5; k++){
    let q; do q = Q.raw(284); while(q.n !== k);
    const segs = pathPts(Q.drawQ(q)).flatMap(t => [[t[0], t[1]], [t[1], t[2]], [t[2], t[0]]]), E = 1e-6;
    const onSeg = (p, [a, b]) => Math.abs((b[0] - a[0])*(p[1] - a[1]) - (b[1] - a[1])*(p[0] - a[0])) < 1e-6 * Math.hypot(b[0] - a[0], b[1] - a[1]) + E &&
      p[0] >= Math.min(a[0], b[0]) - E && p[0] <= Math.max(a[0], b[0]) + E && p[1] >= Math.min(a[1], b[1]) - E && p[1] <= Math.max(a[1], b[1]) + E;
    const pts = [], add = p => { if(!pts.some(o => Math.hypot(o[0] - p[0], o[1] - p[1]) < 1e-6)) pts.push(p); };
    segs.forEach(s => s.forEach(add));
    segs.forEach((s, i) => segs.slice(i + 1).forEach(t => {
      const [[x1, y1], [x2, y2]] = s, [[x3, y3], [x4, y4]] = t, den = (x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4);
      if(Math.abs(den) < E) return;
      const u = ((x1 - x3)*(y3 - y4) - (y1 - y3)*(x3 - x4)) / den, p = [x1 + u*(x2 - x1), y1 + u*(y2 - y1)];
      if(onSeg(p, s) && onSeg(p, t)) add(p);
    }));
    const joined = (p, r) => segs.some(s => onSeg(p, s) && onSeg(r, s));
    let tris = 0;
    for(let a = 0; a < pts.length; a++) for(let b = a + 1; b < pts.length; b++) for(let c = b + 1; c < pts.length; c++){
      const [A, B, C] = [pts[a], pts[b], pts[c]], area = (B[0] - A[0])*(C[1] - A[1]) - (B[1] - A[1])*(C[0] - A[0]);
      if(Math.abs(area) > 1e-3 && joined(A, B) && joined(B, C) && joined(A, C)) tris++;
    }
    if(tris !== q.ans || q.ans !== 2*k - 1) fail('284: the drawn tree of ' + k + ' has ' + tris + ' triangles', q);
  }
  console.log('Аз и числата 2026 2 клас: tasks 6а–в, 7а–б, 8 pinned (our solution, no official key); 9 is level 283\'s, asked with all three sides written (the paper writes two and leaves the third to the eye)');
  console.log('Аз и числата 2025 2 клас: tasks 1, 3а–в, 4 (the triangle and the rectangle), 11 pinned (our solution, no official key); 7 is level 283\'s, asked with the sides written (the paper\'s three triangles are judged by eye)');
  console.log('Аз и числата 2024 2 клас: tasks 5а–в, 12а–в pinned (our solution, no official key)');
  console.log('Аз и числата 2023 2 клас: tasks 2а–в, 9 pinned (our solution, no official key); not in the app: 2г, 10 дм = 100 см (the units drill keeps 1, 10 and 100 out of its answers, the numbers its first-miss nudge names)');
  console.log('Аз и числата 2022 2 клас: tasks 6а–в, 7, 8а–е pinned (our solution, no official key); levels 280–284 worked out again: the signs from millimetres, the perimeters side by side, the kinds to scale, the tree\'s triangles counted from its lines');
}
