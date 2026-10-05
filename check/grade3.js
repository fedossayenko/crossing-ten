// Runs beside the app (in check.js's own scope, through eval): each block loads its own copy of
// the app's modules (APP, from check.js) and checks them from outside. Run all checks with: node check.js
// МБГ Есен, 3 клас.

/* МБГ Есен, 3 клас: each of the five tasks as printed, and thousands more checked by brute force. */
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  const calc = e => Function('return ' + strip(e).replace(/·/g, '*').replace(/−/g, '-').replace(/:/g, '/'))();
  // the paper's own five
  const orig = [
    [{kind:'mulmix', a:20, b:2, c:5, d:6, e:20, ans:18}, '20 − 2 · 5 + 20 − 2 · 6', 18],
    [{kind:'digprod', c:0, big:false, prod:true, n:102, ds:[1,0,2], ans:0}, null, 0],
    [{kind:'zeros', p:2, q:5, r:6, f1:false, f2:false, f3:false, ans:20}, '(2 · 0 + 2 · 5) · (2 + 0 · 2 · 6) − 2 · 0 · 2 · 5', 20],
    [{kind:'pmgap', a:9, b:7, c:7, d:5, e:9, f:9, both:false, flip:false, ans:18}, '9 · 7 + 7 · 5 + 9', 18]
  ];
  orig.forEach(([q, text, want]) => {
    const shown = strip(Q.drawQ(q));
    if(text && shown.indexOf(text) < 0) throw new Error(q.kind + ': the printed task does not read ' + text + ': ' + shown);
    if(q.ans !== want) throw new Error(q.kind + ': the printed task should give ' + want);
  });
  if(Q.twoSignsVal(20, 2, 5, 2, ':', '·') !== 30 || Q.SIGN_PAIRS.filter(([x, y]) => Q.twoSignsVal(20, 2, 5, 2, x, y) === 30).length !== 1)
    throw new Error('twosigns: (20 □ 2 + 5) □ 2 = 30 should have exactly one answer, : and ·');
  const fit = Q.DIG_COND[0][2], small = [...Array(900).keys()].map(i => i + 100).find(fit);
  if(small !== 102) throw new Error('digprod: the smallest three-digit number with different digits is 102, not ' + small);

  const byKind = {};
  Q.LEVELS.filter(l => l.grade === 3).forEach(L => { for(let i = 0; i < 400; i++){
    const q = Q.raw(L.id);
    byKind[q.kind] = (byKind[q.kind] || 0) + 1;
    if(!Q.accepts(q, [q.ans].concat(q.alt || []).map(String))) throw new Error('level ' + L.id + ': its own answer is refused');
    if(q.kind === 'mulmix' && calc(Q.mulMixExpr(q)) !== q.ans) throw new Error('mulmix: ' + Q.mulMixExpr(q) + ' is not ' + q.ans);
    if(q.kind === 'zeros' && calc(Q.zerosExpr(q)) !== q.ans) throw new Error('zeros: ' + Q.zerosExpr(q) + ' is not ' + q.ans);
    if(q.kind === 'pmgap' && calc('(' + Q.pmBig(q) + ') - (' + Q.pmSmall(q) + ')') !== q.ans) throw new Error('pmgap: the gap is not ' + q.ans);
    if(q.kind === 'digprod'){
      const all = [...Array(900).keys()].map(i => i + 100).filter(Q.DIG_COND[q.c][2]), n = q.big ? all[all.length - 1] : all[0];
      const ds = String(n).split('').map(Number), want = q.prod ? ds.reduce((a, b) => a*b, 1) : ds.reduce((a, b) => a + b, 0);
      if(n !== q.n || want !== q.ans) throw new Error('digprod: ' + q.n + ' → ' + q.ans + ', brute force says ' + n + ' → ' + want);
    }
    if(q.kind === 'twosigns'){
      const hits = Q.SIGN_PAIRS.filter(([x, y]) => Q.twoSignsVal(q.a, q.b, q.c, q.d, x, y) === q.val);
      if(hits.length !== 1 || hits[0].join() !== q.options[q.pick].signs.join() || calc(Q.twoRhs(q)) !== q.val)
        throw new Error('twosigns: (' + q.a + ' □ ' + q.b + ' + ' + q.c + ') □ ' + q.d + ' = ' + Q.twoRhs(q) + ' has ' + hits.length + ' answers');
      if(new Set(q.options.map(o => o.signs.join())).size !== q.options.length) throw new Error('twosigns: two options are the same pair');
    }
    const c = Q.withChoices(q);
    if(q.traps && q.traps.length && c.options && !c.options.some(o => o.v === q.traps[0])) throw new Error(q.kind + ': its own trap was left out of the options');
  }});
  console.log('МБГ Есен 3 клас: the five printed tasks read and solve as on the paper; ' + Object.keys(byKind).map(k => byKind[k] + ' ' + k).join(', ') + ' checked by brute force');
}

/* МБГ Есен, 3 клас, задачи 6–10: as printed, and by brute force. */
{
  const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const Q = APP;
  const has = (q, text) => { const s = strip(Q.drawQ(q)).replace(/\s+/g, ' '); if(s.indexOf(text) < 0) throw new Error(q.kind + ' does not read "' + text + '": ' + s); };
  // 6: 12 · 31 · 41 → 24, the erased digits add to 3, whichever way
  const w6 = Q.eraseWays([12, 31, 41], 3).filter(w => w.vals.reduce((a, b) => a*b, 1) === 24);
  if(!w6.length || w6.some(w => w.gone.reduce((a, b) => a + b, 0) !== 3)) throw new Error('task 6: 12 · 31 · 41 → 24 should always erase digits adding to 3');
  // 7: sums of two two-digit numbers that are two-digit: 20 … 99, 80 of them
  const q7 = {kind:'sums', shape:3, v:0, lo:20, hi:99, ans:80};
  has(q7, 'Колко различни двуцифрени числа можем да получим при събирането на две двуцифрени числа?');
  // 8: odd, differ by 2, two-digit product → units 5 or 3
  const q8 = {kind:'oddprod', odd:true, d:2, tens:false, pairs:[[1,3],[3,5],[5,7],[7,9]], two:[[3,5],[5,7],[7,9]], slots:2, ans:5, alt:[3]};
  has(q8, 'Разликата на две нечетни едноцифрени числа е 2, а произведението им е двуцифрено число.');
  if(!Q.accepts(q8, ['3', '5']) || Q.accepts(q8, ['5', '5'])) throw new Error('task 8: 5 and 3, in either order, and only those');
  // 9: the largest three-digit number with a one-digit digit product is 990 (0 is one-digit), digits add to 18
  const big9 = [...Array(900).keys()].map(i => i + 100).filter(Q.DIG_COND[5][2]).pop();
  if(big9 !== 990) throw new Error('task 9: the largest is 990, not ' + big9);
  // 10: two 1s and a 2, 300 − A < A − 100 → only 211
  const q10 = {kind:'digineq', a:1, b:2, cand: Q.digIneqCands(1, 2), more:true, c:300, d:100, ans:211};
  has(q10, 'такова, че 300 − A < A − 100?');
  if(q10.cand.join() !== '112,121,211' || q10.cand.filter(A => Q.digIneqHolds(q10, A)).join() !== '211') throw new Error('task 10: only 211 should work');

  const n = {};
  [64, 65, 66, 67, 68].forEach(id => { for(let i = 0; i < 300; i++){
    const q = Q.raw(id);
    n[id] = (n[id] || 0) + 1;
    if(!Q.accepts(q, Q.answers(q).map(String))) throw new Error('level ' + id + ': its own answers are refused');
    if(q.kind === 'erasemul'){
      const hit = Q.eraseWays(q.nums, 3).filter(w => w.vals.reduce((a, b) => a*b, 1) === q.T);
      if(!hit.length || hit.some(w => w.gone.reduce((a, b) => a + b, 0) !== q.ans)) throw new Error('erasemul: ' + q.nums.join('·') + ' → ' + q.T + ' is not always ' + q.ans);
    }
    if(q.kind === 'sums'){
      const got = new Set();
      for(let x = 10; x <= 99; x++) for(let y = 10; y <= 99; y++){ const r = Q.SUMS_TWO[q.v][2](x, y); if(r >= 0 && Q.SUMS_TWO[q.v][3](r)) got.add(r); }
      if(got.size !== q.ans) throw new Error('sums: variant ' + q.v + ' counts ' + got.size + ', not ' + q.ans);
    }
    if(q.kind === 'oddprod'){
      const want = new Set();
      for(let x = 0; x <= 9; x++) for(let y = x; y <= 9; y++)
        if(y - x === q.d && x % 2 === (q.odd ? 1 : 0) && x*y >= 10 && x*y <= 99) want.add(q.tens ? Math.floor(x*y / 10) : x*y % 10);
      const got = [q.ans].concat(q.alt);
      if(got.length !== want.size || got.some(v => !want.has(v)) || q.slots !== want.size) throw new Error('oddprod: ' + got + ' vs ' + [...want]);
    }
    if(q.kind === 'digprod'){
      const all = [...Array(900).keys()].map(i => i + 100).filter(Q.DIG_COND[q.c][2]), m = q.big ? all[all.length - 1] : all[0];
      if(m !== q.n || String(m).split('').reduce((a, b) => a + +b, 0) !== q.ans) throw new Error('digsum: ' + q.n + ' → ' + q.ans);
    }
    if(q.kind === 'digineq'){
      const ok = q.cand.filter(A => Q.digIneqHolds(q, A));
      if(ok.length !== 1 || ok[0] !== q.ans || q.d < 1 || q.cand.some(A => q.c - A < 0 || A - q.d < 0)) throw new Error('digineq: ' + JSON.stringify(q));
    }
  }});
  console.log('МБГ Есен 3 клас, задачи 6–10: as printed (3, 80, 5 or 3, 18, 211), and ' + Object.values(n).reduce((a, b) => a + b, 0) + ' more by brute force');
}

/* МБГ Есен, 3 клас, задачи 11–15: as printed, and by brute force. */
{
  const Q = APP;
  const orig = [
    [{kind:'star', k:4, P:9, n:8, ans:45}, 45], [{kind:'segpts', k:5, p:5, d:5, ans:35}, 35],
    [{kind:'midpt', AB:32, half:16, m:4, toB:true, ans:20}, 20], [{kind:'trisq', t:4, d:2, ans:5}, 5],
    [{kind:'tiles', w:3, h:4, m:2, u:2, R:12, sq:8, dom:[[1,0],[2,1]], ans:28}, 28]
  ];
  orig.forEach(([q, want]) => { if(!Q.drawQ(q) || q.ans !== want) throw new Error(q.kind + ': the printed task should give ' + want); });
  const n = {};
  [69, 70, 71, 72, 73].forEach(id => { for(let i = 0; i < 300; i++){
    const q = Q.raw(id);
    n[q.kind] = (n[q.kind] || 0) + 1;
    if(!Number.isInteger(q.ans) || q.ans < 1 || q.ans > 999) throw new Error(q.kind + ': answer ' + q.ans);
    // each one worked the long way round
    if(q.kind === 'star'){ const side = q.P*10 / q.n; if(Math.abs(4*side - q.ans) > 1e-9) throw new Error('star: 4 · ' + side + ' is not ' + q.ans); }
    if(q.kind === 'segpts'){ let x = 0; for(let j = 0; j <= q.k; j++) x += q.p; if(x + q.d !== q.ans) throw new Error('segpts'); }
    if(q.kind === 'midpt'){ const A = 0, B = q.AB, M = B / 2, N = M - q.m; if(!(N > A) || (q.toB ? B - N : N - A) !== q.ans) throw new Error('midpt'); }
    if(q.kind === 'trisq'){ const side = 3*q.t / 3, P = side - q.d; if(P*10 / 4 !== q.ans) throw new Error('trisq'); }
    if(q.kind === 'tiles'){
      if(q.w*q.h !== q.sq + 2*q.m || q.dom.some(([r, c]) => c + 1 >= q.w) || new Set(q.dom.map(d => d[0])).size !== q.m) throw new Error('tiles: the tiling does not fit');
      const side = q.R / 6; if(2*(q.w + q.h)*side !== q.ans) throw new Error('tiles');
    }
  }});
  console.log('МБГ Есен 3 клас, задачи 11–15: as printed (45 мм, 35 см, 20 км, 5 мм, 28 см), and ' + Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' worked the long way');
}

/* МБГ Есен, 3 клас, задачи 16–20: as printed, and by brute force. */
{
  const Q = APP;
  // 16: 12 ◎ 4 = 16 : 8 = 2
  if((12 + 4) / (12 - 4) !== 2 || !Q.circPairs().some(([a, b]) => a === 12 && b === 4)) throw new Error('task 16: 12 ◎ 4 should be 2');
  // 17: column 1 = 8, row 1 = 6, row 2 = 4 → column 2 = 3, and a whole-number filling exists
  let fill = 0;
  for(let a = 1; a <= 8; a++) for(let b = 1; b <= 6; b++) for(let c = 1; c <= 8; c++) for(let d = 1; d <= 4; d++)
    if(a*c === 8 && a*b === 6 && c*d === 4){ fill++; if(b*d !== 3) throw new Error('task 17: a filling gives ' + b*d); }
  if(!fill) throw new Error('task 17: no whole-number filling');
  // 18: 2, 3, 5, 6, 7, 18 by 3 → 2 or 5, both accepted in either order, nothing else
  const q18 = {kind:'dropone', nums:[2,3,5,6,7,18], m:3, tot:41, slots:2, ans:2, alt:[5]};
  if(!Q.accepts(q18, ['5', '2']) || Q.accepts(q18, ['2', '3'])) throw new Error('task 18: 2 and 5');
  [2, 3, 5, 6, 7, 18].forEach(v => { if(((41 - v) % 3 === 0) !== (v === 2 || v === 5)) throw new Error('task 18: leaving out ' + v); });
  // 19: 6, 8, 24, 16 → 6, 8, 6, 4 → 12, 8, 12, 4 → 36
  const q19 = {kind:'rewrite', nums:[6,8,24,16], d:4, m:3, p:2, s1:[6,8,6,4], s2:[12,8,12,4], ans:36};
  if(q19.s2.reduce((a, b) => a + b, 0) !== 36 || !Q.drawQ(q19)) throw new Error('task 19: 36');
  // 20: under 30, 7 each is 4 short, 6 each is exact → 24
  const hits20 = [...Array(29).keys()].filter(N => N > 0 && N % 6 === 0 && 7*(N / 6) - N === 4);
  if(hits20.join() !== '24') throw new Error('task 20: ' + hits20);

  const n = {};
  [74, 75, 76, 77, 78].forEach(id => { for(let i = 0; i < 300; i++){
    const q = Q.raw(id);
    n[q.kind] = (n[q.kind] || 0) + 1;
    if(!Q.accepts(q, Q.answers(q).map(String))) throw new Error('level ' + id + ': its own answers are refused');
    if(q.kind === 'circop' && ((q.x + q.y) % Math.abs(q.x - q.y) || (q.x + q.y) / Math.abs(q.x - q.y) !== q.ans)) throw new Error('circop: ' + q.x + ' ◎ ' + q.y);
    if(q.kind === 'prodgrid'){
      const [a, b, c, d] = q.c, sh = [a*c, a*b, c*d, b*d];
      if(sh[q.ask] !== q.ans || sh[q.pair[0]]*sh[q.pair[1]] !== sh[q.same]*q.ans) throw new Error('prodgrid: ' + q.c);
    }
    if(q.kind === 'dropone'){
      const want = q.nums.filter(v => (q.tot - v) % q.m === 0), got = Q.answers(q);
      if(q.tot !== q.nums.reduce((a, b) => a + b, 0) || want.join() !== got.slice().sort((x, y) => x - y).join()) throw new Error('dropone: ' + q.nums + ' by ' + q.m);
    }
    if(q.kind === 'rewrite'){
      const s1 = q.nums.map(v => v >= 10 ? v / q.d : v), s2 = s1.map(v => v % q.m === 0 ? v * q.p : v);
      if(s1.some(v => !Number.isInteger(v)) || s2.reduce((a, b) => a + b, 0) !== q.ans) throw new Error('rewrite: ' + q.nums);
    }
    if(q.kind === 'twoshare'){
      const ok = [...Array(q.L).keys()].filter(N => { for(let k = 1; k <= N; k++){
        const exact = q.over ? q.a : q.b, other = q.over ? q.b : q.a;
        if(exact*k === N && (q.over ? N - other*k === q.s : other*k - N === q.s)) return true; } return false; });
      if(ok.join() !== String(q.ans)) throw new Error('twoshare: under ' + q.L + ' gives ' + ok);
    }
  }});
  console.log('МБГ Есен 3 клас, задачи 16–20: as printed (2, 3, 2 or 5, 36, 24), and ' + Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' by brute force');
}
