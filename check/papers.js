// Runs beside the app (in check.js's own scope, through eval): each block loads its own copy of
// the app's modules (APP, from check.js) and checks them from outside. Run all checks with: node check.js
// Every 2nd-grade paper, task by task against its official key, and its new kinds by brute force.

/* МБГ Зима 2024, 2 клас: the whole paper. Tasks 6, 7, 10, 14, 15, 19 and 20 are levels the
   autumn papers already had (also:['mbg-winter-2024-2']); the rest are levels 79–89. Each
   printed task is solved as printed against the official key, and the new kinds by brute force. */
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
  const text = q => strip(Q.drawQ(q)).replace(/&gt;/g, '>').replace(/&lt;/g, '<');
  const printed = (task, q, want, shows) => {
    const got = Q.answers(q);
    if(got[0] !== want) throw new Error('Зима 2024 task ' + task + ': gives ' + got + ', the key says ' + want);
    if(shows && text(q).replace(/\s+/g, '').indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error('Зима 2024 task ' + task + ' is not drawn as printed: ' + text(q));
  };
  printed(1, {kind:'fifty', shape:0, base:50, nums:[1,49,2,48], sub:60, T:100, ans:40}, 40, '1 + 49 + 2 + 48 − 60');
  printed(2, {kind:'fifty', shape:1, base:50, nums:[1,2,48,49], T:100, ans:10}, 10, '1 + 2 + 48 + 49');
  printed(3, {kind:'fifty', shape:2, base:50, nums:[3,4,47,46], other:[11,22,33], S:66, T:100, ans:34}, 34, 'сборът 3 + 4 + 47 + 46 е по-голям от сбора 11 + 22 + 33');
  printed(4, {kind:'pickfit', nums:[9,10,11], add:1, n:11, more:true, fits:[11], ans:1}, 1, '□ + 1 > 11');
  printed(5, {kind:'samesub', M:88, s:11, X:22, plus:false, given:0, ans:11}, 11, '22 − ■, ако 88 − ■ = 88 − 11');
  printed(8, {kind:'stepdig', k:3, start:0, first:[0,3,6,9], ones:4, twos:[12,15,18,21,24,27,30,33,36,39], digits:24, ans:39}, 39, '0, 3, 6, 9, …, x са записани с 24 цифри');
  printed(9, {kind:'zerofac', long:'1 · 2 + 2 · 3 + 3 · 4 + 5 · 6', zero:'1 + 2 + 3 − 6', first:false, add:0, ans:0}, 0, '(1 · 2 + 2 · 3 + 3 · 4 + 5 · 6) · (1 + 2 + 3 − 6)');
  printed(11, {kind:'sqoff', W:10, H:6, cuts:[6,4,2,2], ans:4}, 4, '10 см на 6 см');
  printed(12, {kind:'pinwheel', L:10, P:80, dm:true, long:true, ans:10}, 10, 'обиколка 8 дм');
  printed(13, {kind:'pyramid', w:3, shown:3, n:4, rows:[3,9,15,21], last:false, ans:48}, 48, 'в 4 реда');
  printed(16, {kind:'balloons', k:3, m:3, rest:12, T:21, ans:15}, 15, 'общо 21 балона, като 3 деца имат по 3 балона');
  printed(17, {kind:'age', bg:'Клеър', uk:'Клер', she:1, m:3, now:5, a:10, b:5, shape:1, ans:10}, 10, 'След 10 години Клеър ще бъде 3 пъти по-голяма');
  printed(18, {kind:'letters', d:1, e:7, N:86, R:69, B:6, CA:9, minus:true, ans:3}, 3, 'C + 1A + B7 = 86');
  // the new kinds' own brute-force answers for the printed ones
  if(String(Q.lettersSolve(1, 7, 86).map(s => s.C + s.A - s.B).filter((v, i, a) => a.indexOf(v) === i)) !== '3') throw new Error('task 18: C + A − B is not only 3');
  // the tasks on older levels, worked out here from the printed numbers
  const key = { 6: 99 - 50 + 1, 7: [0,1,2,3].filter(v => !(93 - 79 < v + 11)).reduce((a, b) => a + b, 0),
    10: [13,14,15,16,17,18,19].filter(n => n % 2 === 0 && n % 3 === 0)[0],
    14: 2*(4 + 2)*2 + 2*(6 + 2), 15: [...Array(90).keys()].map(v => v + 10).filter(v => { const t = Math.floor(v/10), o = v % 10; return (t === 6 && o < 6) || (o === 6 && t < 6); }).length,
    19: 20 - (20 - 12) - 2, 20: 22 - (31 - 13) };
  const want = {6:50, 7:6, 10:18, 14:40, 15:11, 19:10, 20:4};
  Object.keys(want).forEach(k => { if(key[k] !== want[k]) throw new Error('Зима 2024 task ' + k + ': ' + key[k] + ', the key says ' + want[k]); });
  // …and those levels really ask that kind of question
  const asks = {12: /по-малки от \d+ и са по-големи от \d+/, 16: /сбора на всички .*НЕ е вярно/, 49: /две равни събираеми и като сбор на три|три равни събираеми и като сбор на две/,
    202: /правоъгълници, които не са квадрати/, 18: /една от цифрите на които е \d+ , а другата е по-малка/, 38: /не са зелени/, 39: /не ми достигат, за да имам/i};
  Object.keys(asks).forEach(id => {
    const L = Q.LEVELS.find(l => l.id === +id);
    if(!L.papers.includes('mbg-winter-2024-2')) throw new Error('level ' + id + ' is not tagged Зима 2024');
    let hit = false;
    for(let i = 0; i < 4000 && !hit; i++) hit = asks[id].test(text(Q.raw(+id)).replace(/\s+/g, ' '));
    if(!hit) throw new Error('level ' + id + ' never asks the Зима 2024 question ' + asks[id]);
  });

  const n = {};
  [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89].forEach(id => { for(let i = 0; i < 400; i++){
    const q = Q.raw(id), a = q.ans;
    n[q.kind] = (n[q.kind] || 0) + 1;
    if(Q.LEVELS.find(l => l.id === id).papers[0] !== 'mbg-winter-2024-2') throw new Error('level ' + id + ' should be on the Зима 2024 paper');
    const fail = m => { throw new Error(q.kind + ': ' + m + ' ' + JSON.stringify(q)); };
    if(q.kind === 'fifty'){
      const T = q.nums ? q.nums.reduce((x, y) => x + y, 0) : 0;
      if(q.shape === 4){ const V = q.tens.reduce((x, y) => x + y, 0) - q.ones.reduce((x, y) => x + y, 0); if(V !== q.T || q.ans !== Math.floor(V / 10)) fail('the tens'); }
      else if(q.shape === 3){ if(T !== q.T || q.ans !== (q.less ? 100 - T : Math.floor(T / 10)) || q.pairs.some(([x, y]) => (x + y) % 10)) fail('the long sum'); }
      else if(T % 10 || (q.shape === 0 ? T - q.sub : q.shape === 1 ? T / 10 : T - q.other.reduce((x, y) => x + y, 0)) !== a || a < 0) fail('the sum');
    }
    if(q.kind === 'pickfit' && q.nums.filter(v => q.more ? v + q.add > q.n : v + q.add < q.n).length !== a) fail('the count');
    if(q.kind === 'pickfit' && !q.nums.some(v => v + q.add === q.n)) fail('no try lands on the edge');
    if(q.kind === 'samesub'){
      const box = [...Array(200).keys()].filter(b => q.given === 0 ? q.M - b === q.M - q.s : b + q.M === q.M + q.s);
      if(box.length !== 1 || (q.plus ? q.X + box[0] : q.X - box[0]) !== a) fail('the box');
    }
    if(q.kind === 'stepdig'){
      let digits = 0; for(let v = q.start; v <= a; v += q.k) digits += String(v).length;
      if(digits !== q.digits || (a - q.start) % q.k) fail('the digits');
    }
    if(q.kind === 'zerofac' && eval(text(q).replace(/·/g, '*').replace(/−/g, '-').replace(/[^0-9+\-*() ]/g, '')) !== a) fail('the value');
    if(q.kind === 'sqoff' && (q.cuts.reduce((x, s) => x + s*s, 0) !== q.W*q.H || q.cuts.length !== a)) fail('the squares');
    if(q.kind === 'pinwheel'){
      const s = q.L / 2, P = Q.PINWHEEL.reduce((t, p, j) => { const r = Q.PINWHEEL[(j + 1) % 12]; return t + (Math.abs(p[0] - r[0]) + Math.abs(p[1] - r[1]))*s; }, 0);
      if(P !== q.P || (q.long ? q.L : s) !== a || (q.dm && q.P % 10)) fail('the perimeter');
    }
    if(q.kind === 'pyramid'){
      const count = q.w*q.n*q.n, cubes = (text(q), (Q.drawQ(q).match(/<polygon/g) || []).length / 3);
      if(cubes !== q.w*q.shown*q.shown || (q.last ? q.w*(2*q.n - 1) : count) !== a) fail('the boxes');
    }
    if(q.kind === 'balloons'){
      const kids = [...Array(60).keys()].filter(c => c >= q.k && q.k*q.m + (c - q.k) === q.T);
      if(kids.length !== 1 || kids[0] !== a) fail('the children');
    }
    if(q.kind === 'age'){
      const now = [...Array(40).keys()].filter(x => x && x + q.a === q.m*x);
      if(now.length !== 1 || (q.shape ? now[0] + q.b : now[0]) !== a) fail('the age');
    }
    if(q.kind === 'letters'){
      const vals = new Set();
      for(let A = 0; A <= 9; A++) for(let B = 1; B <= 9; B++) for(let C = 0; C <= 9; C++)
        if(new Set([A, B, C]).size === 3 && C + (10*q.d + A) + (10*B + q.e) === q.N) vals.add(q.minus ? C + A - B : A + B + C);
      if(vals.size !== 1 || !vals.has(a)) fail('the letters');
    }
  }});
  console.log('МБГ Зима 2024 2 клас: all 20 printed tasks match the official key (40, 10, 34, 1, 11, 50, 6, 39, 0, 18, 4, 10, 48, 40, 11, 15, 10, 3, 10, 4); 7 older levels tagged and asking the same question; ' +
    Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' by brute force');
}

/* Коледно математическо състезание 2025 (СМБ, секция „Изток“), 2 клас: the whole paper. Task 2
   is level 18 (also:['kms-2025-2']); tasks 1 and 3–10 are levels 90–98. Each printed task is
   solved as printed against the official key, and every new kind is checked by brute force. */
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
  const text = q => strip(Q.drawQ(q)).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, '');
  const printed = (task, q, want, shows) => {
    const got = Q.answers(q)[0];
    if(got !== want) throw new Error('КМС 2025 task ' + task + ': gives ' + got + ', the key says ' + want);
    if(shows && text(q).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error('КМС 2025 task ' + task + ' is not drawn as printed: ' + text(q));
  };
  // 1: the six triangles as drawn, each [points in its band, band height] — 4 are not isosceles
  const t1 = [[[[0.5,0],[0,1],[2,1]],1], [[[1,0],[3,2],[5,2]],2], [[[0,1],[4,0],[4,1]],1], [[[3,0],[1,2],[5,2]],2], [[[0,1],[3,0],[4,1]],1], [[[2,0],[0,1],[4,1]],1]]
    .map(([t, h]) => ({ t, h }));
  const iso1 = t1.map(x => Q.isoTriIs(x.t));
  printed(1, {kind:'isotri', tris:t1, iso:iso1, asksNot:true, ans: iso1.filter(v => !v).length}, 4);
  printed(3, {kind:'rectdm', a:16, b:24, P:80, ans:8}, 8, '16 см и 24 см');
  printed(4, {kind:'minuend', d:4, which:0, asks:0, sub:0, ans:4}, 4, 'Разликата на две числа е 4');
  printed(5, {kind:'consec', t:5, s:5, X:9, small:true, ans:4}, 4, 'цифра на десетиците 5');
  printed(7, {kind:'diffseq', seq:[25,24,21,16,9,0], down:true, d0:1, g:2, asksSum:true, ans:95}, 95, '25, 24, 21, 16, 9, ?');
  printed(8, {kind:'daily', bg:'Иво', uk:'Іво', she:0, a:3, d:9, k:4, days:[3,12,21,30,39], shape:0, ans:69}, 69, 'Иво изминал с колелото си 3 км');
  printed(9, {kind:'isoperim', s:9, P:36, up:12, leg:21, down:14, base:7, ans:49}, 49, 'Обиколката на квадрат е 36 см');
  printed('10А', {kind:'santa', shape:0, a:1, b:7, c:4, e:10, f:5, back:11, on:15, ans:29}, 29);
  const rows10 = [[10,5,5],[5,2,0],[12,0,6]];
  printed('10Б', {kind:'santa', shape:1, rows:rows10, per: rows10.map(([F, s, p]) => 2*(s || F) + (p || F) + F), ans:81}, 81);
  printed('10В', {kind:'santa', shape:2, T:81, R:19, k:6, ways:Q.santaWays(19, 6), ans:Q.santaWays(19, 6).length}, 3);
  // 6: КОЛЕДА ten times, the 46th letter from the right is Л
  { const w = Q.WORDPOS[0][0], long = w.repeat(10);
    if(long[long.length - 46] !== 'Л') throw new Error('task 6: the 46th letter from the right is ' + long[long.length - 46]); }
  // 2: level 18 asks exactly this, and 7 two-digit numbers have digit sum 7
  if([...Array(90).keys()].map(v => v + 10).filter(v => Math.floor(v/10) + v % 10 === 7).length !== 7) throw new Error('task 2 should be 7');
  { const L = Q.LEVELS.find(l => l.id === 18); let hit = false;
    if(!L.papers.includes('kms-2025-2')) throw new Error('level 18 is not tagged КМС 2025');
    for(let i = 0; i < 4000 && !hit; i++) hit = /Колкодвуцифреничислаиматсборнацифрите/.test(text(Q.raw(18)));
    if(!hit) throw new Error('level 18 never asks the КМС 2025 question'); }
  // every paper a level names has its full name and its tag, in every language
  const srcs = [...new Set(Q.LEVELS.flatMap(l => l.papers).filter(p => p !== 'basics').map(p => p.replace(/-\d+$/, '')))];
  ['bg', 'uk', 'en'].forEach(lang => srcs.forEach(s => {
    if(!Q.TEXT[lang].papers[s] || !Q.TEXT[lang].paperTag[s]) throw new Error(lang + ' has no name for the paper ' + s);
  }));

  const n = {};
  [90, 91, 92, 93, 94, 95, 96, 97, 98].forEach(id => { for(let i = 0; i < 400; i++){
    const q = Q.raw(id), a = q.ans;
    n[q.kind] = (n[q.kind] || 0) + 1;
    const fail = m => { throw new Error(q.kind + ': ' + m + ' ' + JSON.stringify(q)); };
    if(Q.LEVELS.find(l => l.id === id).papers[0] !== 'kms-2025-2') fail('not on the КМС 2025 paper');
    if(q.kind === 'isotri'){
      const eq = (p, r, s) => { const d = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]), x = d(p, r), y = d(r, s), z = d(s, p);
        return Math.abs(x - y) < 1e-9 || Math.abs(y - z) < 1e-9 || Math.abs(z - x) < 1e-9; };
      const isoN = q.tris.filter(x => eq(...x.t)).length;
      if((q.asksNot ? q.tris.length - isoN : isoN) !== a) fail('the count');
      if(q.tris.some(x => x.t.some(([u, v]) => u < 0 || u > 5 || v < 0 || v > x.h))) fail('a triangle leaves its band');
    }
    const RU = { мм:1, см:10, дм:100, м:1000 };
    if(q.kind === 'rectdm' && (q.shape === 1 ? q.b !== q.a + q.d*RU[q.dU]/RU[q.base] || 2*(q.a + q.b)*RU[q.base] !== a*RU[q.to] : 2*(q.a + q.b) !== 10*a)) fail('the perimeter');
    if(q.kind === 'minuend'){
      const ok = v => q.which === 1 ? v >= 10 && v <= 99 : q.which === 2 ? v >= 1 : v >= 0;
      let best = Infinity;
      for(let y = 0; y < 200; y++) if(ok(y) && ok(y + q.d)) best = Math.min(best, q.asks ? 2*y + q.d : y + q.d);
      if(best !== a) fail('the smallest');
    }
    if(q.kind === 'consec' && q.shape === 'count'){   // Зима 2020: each one tried against every pair n + (n + 1)
      let n = 0; for(let v = q.a; v <= q.b; v++) if([...Array(v).keys()].some(k => k + k + 1 === v)) n++;
      if(n !== a) fail('the count');
    } else if(q.kind === 'consec'){
      const X = (10*q.t + 9) - 10*q.s, m = [...Array(100).keys()].filter(v => v + v + 1 === X);
      if(m.length !== 1 || (q.small ? m[0] : m[0] + 1) !== a) fail('the pair');
    }
    if(q.kind === 'wordpos' && q.shape === 'count'){   // Есен 2019: the pattern written out and counted
      const long = []; while(long.length < q.n) long.push(...q.pat);
      if(long.slice(0, q.n).filter(x => x === q.sym).length !== a) fail('the pattern count');
    } else if(q.kind === 'wordpos'){
      [0, 1].forEach(lang => {
        const w = Q.WORDPOS[q.w][lang], long = w.repeat(q.n), at = q.right ? long.length - q.p : q.p - 1;
        if(q.options[q.pick].text[lang] !== long[at]) fail('the letter');
        if(new Set(q.options.map(o => o.text[lang])).size !== 4) fail('two options are the same letter');
      });
      if(!Q.accepts(q, [String(q.pick)]) || Q.accepts(q, [String((q.pick + 1) % 4)])) fail('the right option');
    }
    if(q.kind === 'diffseq'){
      const st = q.seq.slice(1).map((v, j) => v - q.seq[j]), dd = st.slice(1).map((v, j) => v - st[j]);
      if(new Set(dd).size !== 1 || (q.asksSum ? q.seq.reduce((x, y) => x + y, 0) : q.seq[5]) !== a || q.seq.some(v => v < 0)) fail('the run');
    }
    if(q.kind === 'daily'){
      const d = [q.a]; for(let j = 0; j < q.k; j++) d.push(d[j] + q.d);
      if((q.shape === 0 ? d[q.k] + d[q.k - 1] : q.shape === 1 ? d[q.k] : d.reduce((x, y) => x + y, 0)) !== a) fail('the days');
    }
    if(q.kind === 'isoperim' && q.shape === 2){   // Коледно 2023: the tortoise's walk, side by side
      const side = { ME:q.base, EM:q.base, EK:q.leg, KE:q.leg, KM:q.leg, MK:q.leg };
      let t = 0; for(let j = 1; j < q.route.length; j++) t += side[q.route[j-1] + q.route[j]];
      if(Math.abs(q.laps*3*q.a - t) !== a || !a || 2*q.leg <= q.base) fail('the walk');
    } else if(q.kind === 'isoperim' && q.shape === 3){   // Коледно 2023: only one perimeter can be base + two legs
      const odd = q.list.filter(v => v % 2);
      if(odd.length !== 1 || (odd[0] - q.b) / 2 !== a || !q.list.includes(4*q.sq) || !q.list.includes(3*q.t) || new Set(q.list).size !== 6) fail('the odd one');
    } else if(q.kind === 'isoperim'){
      const s = q.P / 4, leg = s + q.up, base = leg - q.down;
      if(!(base > 0 && base < 2*leg) || 2*leg + base !== a) fail('the triangle');
    }
    if(q.kind === 'santa' && q.shape === 0){
      // shortest paths between the houses over the five roads, then 1 → 2 → 3 → 4 → 5
      const D = [...Array(6)].map((_, i) => [...Array(6)].map((_, j) => i === j ? 0 : Infinity));
      [[1,2,q.a],[2,3,q.b],[2,4,q.c],[4,5,q.e],[3,5,q.f]].forEach(([x, y, w]) => { D[x][y] = D[y][x] = w; });
      for(let k = 1; k <= 5; k++) for(let x = 1; x <= 5; x++) for(let y = 1; y <= 5; y++) D[x][y] = Math.min(D[x][y], D[x][k] + D[k][y]);
      if(D[1][2] + D[2][3] + D[3][4] + D[4][5] !== a) fail('the route');
    }
    if(q.kind === 'santa' && q.shape === 1 && q.rows.reduce((t, [F, s, p]) => t + (s || F)*2 + (p || F) + F, 0) !== a) fail('the tickets');
    if(q.kind === 'santa' && q.shape === 2){
      let ways = 0; const M = [1, 2, 5, 10, 20, 50];
      (function walk(j, left, cnt){ if(j === M.length){ if(left === 0 && cnt === q.k) ways++; return; }
        for(let c = 0; c*M[j] <= left && cnt + c <= q.k; c++) walk(j + 1, left - c*M[j], cnt + c); })(0, 100 - q.T, 0);
      if(ways !== a) fail('the change');
    }
  }});
  console.log('КМС 2025 2 клас: all 10 printed tasks match the official key (4, 7, 8, 4, 4, Л, 95, 69, 49; 29, 81, 3 ways); level 18 tagged; ' +
    Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' by brute force');
}

/* МБГ Есен 2025, 2 клас: every task is a level the app already had (levels 8–26, tagged
   also:['mbg-autumn-2025-2']). Each printed task is built as that level's question, answered
   against the official key, drawn as printed — and the level's own generator is sampled until it
   asks exactly that question, so the printed task is one she can really meet. */
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), chain = (...xs) => xs.map((x, i) => i ? T(x < 0 ? '−' : '+', Math.abs(x)) : T('', x));
  const metExact = [], metLike = [];
  const paper = [
    [1,  8,  {kind:'chain', terms: chain(2, 0, 2, 6, -2, 0, -2, -5), paired:0, ans:1}, [1], '2 + 0 + 2 + 6 − 2 + 0 − 2 − 5'],
    [2,  9,  {kind:'pairs', shape:'tens', base:10, terms: chain(1, 9, 2, 8, 3, 7, 5, -33), paired:3, extra:5, subs:[33], ans:2}, [2], '1 + 9 + 2 + 8 + 3 + 7 + 5 − 33'],
    [3,  10, {kind:'cmp', shape:0, a:20, b:26, big:46, small:10, flip:false, ans:36}, [36], 'сборът 20 + 26 е по-голям от сбора 2 + 0 + 2 + 6'],
    [4,  11, {kind:'box', a:10, b:6, x:12, y:9, box:3, r:3, ans:7}, [7], '6 − ◯ = 12 − 9'],
    [5,  12, {kind:'count', sum:false, shape:0, natural:false, two:false, n:5, lo:0, hi:5, ans:6}, [6], 'не са по-големи от 5'],
    [6,  13, {kind:'named', shape:1, R:20, ans:1}, [1], 'С колко полученият сбор е по-малък от 20'],
    [7,  14, {kind:'grow', k:3, d:5, up:true, base:4, ans:19}, [19], 'Сборът на три числа е 4'],
    [8,  15, {kind:'erase', set:[3,4,7,9,11], d:3, bigger:true, gone:7, ans:27}, [27], '3, 4, 7, 9 и 11'],
    [9,  9,  {kind:'pairs', shape:'sub', terms: chain(11, -1, 12, -2, 13, -3, 14, -5), paired:4, ans:39}, [39], '11 − 1 + 12 − 2 + 13 − 3 + 14 − 5'],
    [10, 16, {kind:'ineq', shape:0, A:20, B:17, L:3, C:2, ans:2}, [2], '20 − 17 < ? + 2'],
    [11, 17, {kind:'sumdiff', a:8, d:2, slots:2, ans:18, alt:[14]}, [14, 18], 'едно от които е 8, ако разликата им е 2'],
    [12, 18, {kind:'digits', shape:1, ans:19}, [19], 'сборовете, които се срещат само веднъж'],
    [13, 19, {kind:'rects', shape:0, W:3, H:2, c:1, r:1, wide:3, tall:2, ans:6}, [6], 'в които има мравка'],
    [14, 20, {kind:'line', d1:3, d2:11, right:true, back:true, ans:8}, [8], 'На 3 см вдясно'],
    [15, 21, {kind:'sqcut', parts:2, side:4, small:2, shape:0, ans:8}, [8], 'Квадрат със страна 4 см е разрязан на четири еднакви квадрата'],
    [16, 22, {kind:'shared', shape:0, P:24, p1:16, p2:18, ans:5}, [5], 'обиколка 24 см разрязали на два триъгълника с обиколки 16 см и 18 см'],
    [17, 23, {kind:'place', t:9, u:7, N:97, k:9, R:88, a:2, shape:0, ans:22}, [22], '□△ − 9 = 88'],
    [18, 24, {kind:'sums', shape:0, k:2, top:18, ans:19}, [19], 'сбор на две едноцифрени числа'],
    [19, 25, {kind:'weekday', n:22, q:3, r:1, day:Q.DAYS[1], slots:2, ans:3, alt:[4]}, [3, 4], 'Колко вторника може да има сред 22 последователни дни'],
    [20, 26, {kind:'seq', a:[2,1,3,4,6,5,7,9,10,8], hits:[3,4,7], ans:3}, [3], '2, 1, 3, 4, 6, 5, 7, 9, 10, 8']
  ];
  paper.forEach(([task, id, q, key, shows]) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error('Есен 2025 task ' + task + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error('Есен 2025 task ' + task + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error('Есен 2025 task ' + task + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-autumn-2025-2')) throw new Error('level ' + id + ' is not tagged Есен 2025');
    // exactly this question, or — where the numbers are too many to meet by chance (a long chain) —
    // the same question with its numbers masked: the same wording, the same signs in the same places
    const sig = g => Q.eqText(g) + '|' + strip(Q.drawQ(g)), mask = t => t.replace(/\d+/g, '#');
    const want = sig(q);
    const hit = pinSeed('Есен 2025 task ' + task, () => Q.raw(id), g => { if(g.kind !== q.kind) return 0; const s = sig(g); return s === want ? 2 : mask(s) === mask(want) ? 1 : 0; }, 100000);
    const exact = !!hit && hit.exact, like = !!hit;
    if(!exact && !like) throw new Error('Есен 2025 task ' + task + ': level ' + id + ' never asks a question of that form');
    (exact ? metExact : metLike).push(task);
  });
  // 20: worked out here as well, not only by the level
  const a20 = [2,1,3,4,6,5,7,9,10,8], hits = a20.filter((v, i) => a20.every((w, j) => j === i || (j < i ? w < v : w > v)));
  if(hits.join() !== '3,4,7') throw new Error('task 20: ' + hits);
  console.log('МБГ Есен 2025 2 клас: all 20 printed tasks match the official key (1, 2, 36, 7, 6, 1, 19, 27, 39, 2, 14 и 18, 19, 6, 8, 8, 5, 22, 19, 3 и 4, 3); its level asks exactly the printed question for tasks ' + metExact.join(', ') +
    (metLike.length ? ', and the same question with other numbers for tasks ' + metLike.join(', ') : ''));
}

/* МБГ Есен 2024, 2 клас: the paper most autumn levels were first built from (levels 8–13, 15, 22, 27–37,
   tagged also:['mbg-autumn-2024-2']). As for Есен 2025: each printed task against the official key, drawn
   as printed, and met by its level's own generator. */
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), chain = (...xs) => xs.map((x, i) => i ? T(x < 0 ? '−' : '+', Math.abs(x)) : T('', x));
  const metExact = [], metLike = [];
  const paper = [
    [1,  8,  {kind:'chain', terms: chain(2, 0, 2, 4, -2, 0, -2, 4), paired:0, ans:8}, [8], '2 + 0 + 2 + 4 − 2 + 0 − 2 + 4'],
    [2,  9,  {kind:'pairs', shape:'tens', base:10, terms: chain(2, 8, 3, 7, 4, 6, -11, -9), paired:3, extra:0, subs:[11, 9], ans:10}, [10], '2 + 8 + 3 + 7 + 4 + 6 − 11 − 9'],
    [3,  10, {kind:'cmp', shape:0, a:20, b:25, s:24, big:45, small:8, flip:false, ans:37}, [37], 'сборът 20 + 25 е по-голям от сбора 2 + 0 + 2 + 4'],
    [4,  12, {kind:'count', sum:true, shape:0, natural:false, two:false, n:5, lo:0, hi:5, ans:15}, [15], 'сбора на всички числа, които не са по-големи от 5'],
    [5,  27, {kind:'missing', seq:[1,1,2,3,5,8,13,21,34], at:5, hidden:[8,13], asksDigits:true, rule:0, ans:3}, [3], 'цифрите на пропуснатите числа? 1, 1, 2, 3, 5, …, …, 21, 34'],
    [6,  28, {kind:'fruit', pears:6, apples:4, k:4, row:['p','p','p','p','p','a','a','a','p','a'], ans:6}, [6], 'броят им да е с 4 по-голям от броя на крушите'],
    [7,  11, {kind:'box', a:9, b:8, x:4, y:2, box:6, r:2, ans:3}, [3], '8 − ◯ = 4 − 2'],
    [8,  15, {kind:'erase', set:[3,4,7,9,11], d:6, bigger:false, gone:3, ans:31}, [31], 'Едното от тях, което е по-малко с 6 от друго от тях, изтрих'],
    [9,  29, {kind:'fruiteq', f:['g','a','l'], a:5, b:4, c:9, s1:9, s2:14, s3:18, askd:[0,1,1], ans:1}, [1], '= 9 + = 14 + + = 18'],
    [10, 30, {kind:'term', t:{sub:'умаляемото', obj:'умаляемото', of:'разликата', at:0, op:'−'}, x:60, y:25, shape:1, chain:[1,3,5,7,9], total:25, less:true, ans:35}, [35], 'сборът 1 + 3 + 5 + 7 + 9 е по-малък от умаляемото в разликата 60 − 25'],
    [11, 31, {kind:'trees', who:'Хари', did:'посадил', n:9, d:2, shape:0, len:16, ans:16}, [16], '9 дръвчета в една редица на разстояние 2 метра'],
    [12, 32, {kind:'ribbon', shape:1, u:{nm:'дм', cm:10}, t:5, target:50, L:55, ans:5}, [5], 'Лента е дълга 55 см'],
    [13, 33, {kind:'flowers', p:[5,6,7], T:34, ans:6}, [6], 'цветя с по 5, 6 и 7 листенца'],
    [14, 34, {kind:'paint', R:4, C:7, r:2, c:2, left:10, asksLeft:true, ans:10}, [10], '28 квадратчета в 4 реда и 7 стълба'],
    [15, 35, {kind:'twodig', three:false, S:22, lo:10, hi:12, ask:0, ans:2}, [2], 'От по-голямото извадете по-малкото'],
    [16, 36, {kind:'candy', kids:3, n:5, ans:6}, [6], '5 еднакви бонбона на три деца'],
    [17, 13, {kind:'named', shape:2, k:5, small:true, two:false, list:[0,1,2,3,4], ans:10}, [10], 'най-малкият сбор на пет различни едноцифрени числа'],
    [18, 22, {kind:'shared', shape:1, c:5, P:20, p:12, ans:22}, [22], 'От квадрат с обиколка 20 см е изрязан триъгълник с обиколка 12 см'],
    [19, 9,  {kind:'pairs', shape:'run', terms: chain(20, -15, 20, -16, 20, -17, 20, -18, 20, -19, 20, -20), M:20, k:5, paired:6, ans:15}, [15], '20 − 15 + 20 − 16 + 20 − 17 + 20 − 18 + 20 − 19 + 20 − 20'],
    [20, 37, {kind:'shapes', wo:2, ws:1, bs:3, bc:1, row:['wo','bs','bc','wo','bs','ws','bs'], W:3, D:1, ans:4}, [4], 'всичките бели фигури? ○■●○■□■']
  ];
  paper.forEach(([task, id, q, key, shows]) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error('Есен 2024 task ' + task + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error('Есен 2024 task ' + task + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error('Есен 2024 task ' + task + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-autumn-2024-2')) throw new Error('level ' + id + ' is not tagged Есен 2024');
    // who planted the trees and the order of the fruit or shapes in the row are the level's to choose; the rest must be met exactly
    const sig = g => (Q.eqText(g) + '|' + strip(Q.drawQ(g))).replace(/^[^|]*\|[А-Яа-я]+посадила?/, 'X').replace(/<svg[\s\S]*?<\/svg>/g, ''), mask = t => t.replace(/\d+/g, '#');
    const want = sig(q), fields = g => q.kind === 'fruit' ? [g.pears, g.apples, g.k].join() : q.kind === 'shapes' ? [g.wo, g.ws, g.bs, g.bc].join() : null;
    const hit = pinSeed('Есен 2024 task ' + task, () => Q.raw(id), g => { if(g.kind !== q.kind) return 0; const s = sig(g);
      return (fields(q) ? fields(g) === fields(q) : s === want) ? 2 : mask(s) === mask(want) ? 1 : 0; });
    const exact = !!hit && hit.exact, like = !!hit;
    if(!exact && !like) throw new Error('Есен 2024 task ' + task + ': level ' + id + ' never asks a question of that form');
    (exact ? metExact : metLike).push(task);
  });
  console.log('МБГ Есен 2024 2 клас: all 20 printed tasks match the official key (8, 10, 37, 15, 3, 6, 3, 31, 1, 35, 16, 5, 6, 10, 2, 6, 10, 22, 15, 4); its level asks exactly the printed question for tasks ' + metExact.join(', ') +
    (metLike.length ? ', and the same question with other numbers for tasks ' + metLike.join(', ') : ''));
}

/* МБГ Есен 2023, 2 клас: the paper levels 38–45 were first built from; with them levels 9–13, 16, 18, 19,
   21 and 27, all tagged also:['mbg-autumn-2023-2']. As for Есен 2025 and 2024. Where the level picks
   a name, a colour or a thing to count, the numbers alone are matched (the listed fields). */
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), chain = (...xs) => xs.map((x, i) => i ? T(x < 0 ? '−' : '+', Math.abs(x)) : T('', x));
  const metExact = [], metLike = [];
  const paper = [
    [1,  9,  {kind:'pairs', shape:'tens', base:20, terms: chain(9, 11, 8, 12, -40), paired:2, extra:0, subs:[40], ans:0}, [0], '9 + 11 + 8 + 12 − 40'],
    [2,  11, {kind:'box', a:11, b:9, x:7, y:5, box:7, r:2, ans:4}, [4], '9 − ◯ = 7 − 5'],
    [3,  10, {kind:'cmp', shape:1, terms:[10,20,30], kept:[10,30], gone:[20], ans:20}, [20], 'сборът 10 + 20 + 30 е по-голям от сбора 10 + 30'],
    [4,  10, {kind:'cmp', shape:2, x:9, y:11, p:40, q:10, S:20, D:30, less:true, ans:10}, [10], 'сборът 9 + 11 е по-малък от разликата 40 − 10'],
    [5,  12, {kind:'count', sum:true, shape:4, natural:true, two:false, a:8, b:11, lo:9, hi:10, ans:19}, [19], 'естествени числа, които са по-малки от 11 и са по-големи от 8'],
    [6,  12, {kind:'count', sum:false, shape:1, natural:false, two:false, n:7, lo:0, hi:6, ans:7}, [7], 'Колко са всички числа, които са по-малки от 7'],
    [7,  16, {kind:'ineq', shape:0, asksSum:true, A:20, B:10, L:10, C:6, lim:4, ans:10}, [10], 'да НЕ е вярно: 20 − 10 < ? + 6'],
    [8,  38, {kind:'pencils', who:'Ния', col:[['зелени','зелен'],['жълти','жълт'],['сини','син']], a:7, b:6, c:9, T:22, notA:15, ans:9}, [9], 'От тях 15 не са зелени, а 6 са жълти', ['a','b','c']],
    [9,  27, {kind:'missing', woven:[12,3,23,5,34,7,45,9,56,11], hideAt:[5,6], runA:[12,23,34,45,56], runB:[3,5,7,9,11], dA:11, dB:2, star:45, dot:7, ans:38}, [38], '12, 3, 23, 5, 34, ●, ★, 9, 56, 11'],
    [10, 39, {kind:'short', item:'бонбона', have:10, T1:20, T2:30, d1:10, shape:0, ans:20}, [20], 'Не ми достигат 10 бонбона, за да имам 20 бонбона', ['have','T1','T2','shape']],
    [11, 40, {kind:'seg', p:4, q:1, r:5, AB:5, CD:6, ans:10}, [10], 'AB = 5 см CD = 6 см CB = 1 см'],
    [12, 41, {kind:'three', who:'Хари', a:1, b:4, slots:2, ans:3, alt:[5]}, [3, 5], 'записал две от тях: 1 см и 4 см', ['a','b']],
    [13, 21, {kind:'sqcut', shape:3, a:4, extra:2, P:20, ans:2, asksSide:true}, [2], 'лист с обиколка 20 см на квадрат A със страна 4 см'],
    [14, 202, {kind:'rects', shape:1, n:3, s:3, squares:false, parts:[[2,2,18],[3,1,24]], ans:60}, [60], 'размери 3 см и 9 см е разделен на три квадрата'],
    [15, 18, {kind:'digits', shape:2, d:5, smaller:true, list:[15,25,35,45,50,51,52,53,54], ans:9}, [9], 'една от цифрите на които е 5, а другата е по-малка от 5'],
    [16, 13, {kind:'named', shape:3, k:5, S:26, wit:[0,2,7,8,9], ans:9}, [9], 'различни едноцифрени числа е 26'],
    [17, 42, {kind:'cats', nm:['Мими','Рижко'], p:4, q:5, k:1, boxes:9, ans:20}, [20], 'кутия храна за 4 дни', ['p','q','k','boxes']],
    [18, 43, {kind:'coins', n1:2, n2:3, T:8, limit:10, asksMax:false, ans:9}, [9], 'ако имаме 2 монети от 1 евро и 3 монети от 2 евро'],
    [19, 44, {kind:'cross', A:10, B:20, C:30, D:40, hit:{t:1, i:0, digit:2, left:0}, ans:2}, [2], '10 + 20 + 30 = 40'],
    [20, 45, {kind:'cards', digits:[1,2,4,7], smallest:true, wit:[24,17], ans:7}, [7], 'цифрите 1, 2, 4 и 7, по една на карта']
  ];
  paper.forEach(([task, id, q, key, shows, fields]) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error('Есен 2023 task ' + task + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error('Есен 2023 task ' + task + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error('Есен 2023 task ' + task + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-autumn-2023-2')) throw new Error('level ' + id + ' is not tagged Есен 2023');
    const sig = g => fields ? fields.map(f => g[f]).join() : Q.eqText(g) + '|' + strip(Q.drawQ(g)), mask = t => t.replace(/\d+/g, '#');
    const want = sig(q);
    const hit = pinSeed('Есен 2023 task ' + task, () => Q.raw(id), g => { if(g.kind !== q.kind || g.shape !== q.shape) return 0; const s = sig(g); return s === want ? 2 : fields || mask(s) === mask(want) ? 1 : 0; });
    const exact = !!hit && hit.exact, like = !!hit;
    if(!exact && !like) throw new Error('Есен 2023 task ' + task + ': level ' + id + ' never asks a question of that form');
    (exact ? metExact : metLike).push(task);
  });
  console.log('МБГ Есен 2023 2 клас: all 20 printed tasks match the official key (0, 4, 20, 10, 19, 7, 10, 9, 38, 20, 10, 3 или 5, 2, 60, 9, 9, 20, 9, 2, 7); its level asks exactly the printed question for tasks ' + metExact.join(', ') +
    (metLike.length ? ', and the same question with other numbers for tasks ' + metLike.join(', ') : ''));
}

/* МБГ Есен 2022, 2021 and 2020, 2 клас, checked the same way as the later autumn papers: each printed
   task against the official key, drawn as printed, and met by its level's own generator. Where the
   level picks a name, a colour or a thing to count, the listed fields alone are matched. */
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), chain = (...xs) => xs.map((x, i) => i ? T(x < 0 ? '−' : '+', Math.abs(x)) : T('', x));
  const D = nm => Q.DAYS.find(d => d.nm === nm), run = (a, b, s) => { const r = []; for(let v = a; s > 0 ? v <= b : v >= b; v += s) r.push(v); return r; };
  const paperCheck = (name, tag, keyText, paper, missing) => {
    const metExact = [], metLike = [];
    paper.forEach(([task, id, q, key, shows, fields]) => {
      const got = Q.answers(q).slice().sort((x, y) => x - y);
      if(got.join() !== key.join()) throw new Error(name + ' task ' + task + ': gives ' + got + ', the key says ' + key);
      if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error(name + ' task ' + task + ': the key is not accepted');
      if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' task ' + task + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
      if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + name);
      const sig = g => fields ? fields.map(f => JSON.stringify(g[f])).join() : Q.eqText(g) + '|' + strip(Q.drawQ(g)), mask = t => t.replace(/\d+/g, '#');
      const want = sig(q);
      const hit = pinSeed(name + ' task ' + task, () => Q.raw(id), g => { if(g.kind !== q.kind || g.shape !== q.shape || g.runs !== q.runs) return 0; const s = sig(g); return s === want ? 2 : fields || mask(s) === mask(want) ? 1 : 0; });
      const exact = !!hit && hit.exact, like = !!hit;
      if(!exact && !like) throw new Error(name + ' task ' + task + ': level ' + id + ' never asks a question of that form');
      (exact ? metExact : metLike).push(task);
    });
    console.log((tag.startsWith('kms') ? '' : 'МБГ ') + name + ' 2 клас: ' + paper.length + ' printed tasks match the official key (' + keyText + '); its level asks exactly the printed question for tasks ' + metExact.join(', ') +
      (metLike.length ? ', and the same question with other numbers for tasks ' + metLike.join(', ') : '') + (missing ? '; not in the app: ' + missing : ''));
  };
  paperCheck('Есен 2022', 'mbg-autumn-2022-2', '4, 8, 10, 10, 2, 20, 2, 11, 16, 5, 30, 28, 16, 16, 10, 4, 36, 5, 29, 2', [
    [1,  9,  {kind:'pairs', shape:'cancel', terms: chain(9, -8, 8, -7, 7, -6, 6, -5), start:9, last:5, ans:4}, [4], '9 − 8 + 8 − 7 + 7 − 6 + 6 − 5'],
    [2,  11, {kind:'box', shape:'two', p:5, r:4, sq:5, tri:3, ans:8}, [8], '5 + □ = 8 и 4 + ■ = 9'],
    [3,  10, {kind:'cmp', shape:3, L:[1,8,21], R:[2,7,11], ans:10, flip:false}, [10], 'сборът 1 + 8 + 21 е по-голям от сбора 2 + 7 + 11'],
    [4,  10, {kind:'cmp', shape:2, x:15, y:25, p:60, q:10, S:40, D:50, less:true, ans:10}, [10], 'сборът 15 + 25 е по-малък от разликата 60 − 10'],
    [5,  12, {kind:'count', sum:false, shape:4, natural:true, two:false, a:7, b:10, lo:8, hi:9, ans:2}, [2], 'естествени числа, които са по-малки от 10 и са по-големи от 7'],
    [6,  11, {kind:'box', shape:'plus', g:20, p:20, box:40, S:60, ans:20}, [20], 'ако 20 + ■ = 60'],
    [7,  16, {kind:'ineq', shape:0, A:22, B:14, L:8, C:7, ans:2}, [2], 'да НЕ е вярно: 22 − 14 < ? + 7'],
    [8,  38, {kind:'pencils', who:'Ния', col:[['зелени','зелен'],['жълти','жълт'],['сини','син']], a:3, b:7, c:11, T:21, notA:18, ans:11}, [11], 'От тях 18 не са зелени, а 7 са жълти', ['a','b','c']],
    [9,  46, {kind:'order', nums:[6,8,10], p:2, g:1, fit:[10,8,6], asksMid:false, ans:16}, [16], '■ + 2 > □ > ■ + 1'],
    [10, 17, {kind:'sumdiff', shape:'gap', c:18, d1:2, d2:3, ans:5}, [5], 'Разликата на числото A и 18 е 2. Разликата на числото B и 18 е 3'],
    [11, 31, {kind:'trees', who:'Хари', did:'посадил', n:16, d:2, dm:20, shape:3, len:30, ans:30}, [30], '16 дръвчета в една редица на разстояние 20 дм', ['n','dm']],
    [12, 21, {kind:'sqcut', shape:4, inCm:false, dm:1, P:40, sides:[3,4,5], p:12, ans:28}, [28], 'страни 3 см, 4 см, 5 см. Квадрат има страна 1 дм'],
    [13, 21, {kind:'sqcut', shape:5, t:{w:5, h:3, sq:[[0,0,2],[0,2,1],[1,2,1],[2,0,3]]}, s:1, n:4, few:2, side:1, ans:16}, [16], 'съставен от 4 квадрата, ако два от квадратите имат страна 1 см'],
    [14, 22, {kind:'shared', shape:2, a:4, h:4, d:8, ans:16}, [16], 'по-голяма от обиколката на правоъгълника DCEF с 8 см', ['a','d']],
    [15, 47, {kind:'crates', box:['щайги','щайга'], asks:0, T:30, ab:19, a:10, b:9, c:11, d:2, ans:10}, [10], 'В три щайги има 30 кг плодове. В първите две има общо 19 кг'],
    [16, 48, {kind:'both', T:22, A:18, B:5, both:1, lang:['английски','френски'], asksBoth:false, ans:4}, [4], 'От тях 18 учат английски език', ['T','A','B','asksBoth']],
    [17, 49, {kind:'multiple', g:['рози','розите','градината'], p:3, r:2, L:6, N:32, ans:36}, [36], 'повече от 32 рози', ['p','r','N']],
    [18, 13, {kind:'named', shape:4, k:5, S:11, floor:6, ans:5}, [5], 'Сборът на пет различни числа е 11'],
    [19, 25, {kind:'weekday', shape:'last', mon:['януари',31], d1:D('неделя'), day:D('неделя'), first:1, ans:29}, [29], 'последната неделя през януари'],
    [20, 50, {kind:'signs', a:1, b:5, nums:[1,2,3,4,5], T:5, wit:[2,3], ans:2}, [2], 'от 1 до 5 включително']
  ]);
  paperCheck('Есен 2021', 'mbg-autumn-2021-2', '3, 35, 26, 40, 2, 40, 23, 20, 13 и 14, 1, 23, 20, 50, 10, 2, 11, четвъртък, 33, 108, 5', [
    [1,  51, {kind:'tens', shape:0, c:20, N:50, ans:3}, [3], '50 = □ десетици + 20 единици'],
    [2,  11, {kind:'box', shape:'bal', form:0, x:31, y:29, N:95, L:60, plus:true, ans:35}, [35], '31 + 29 = 95 − □'],
    [3,  10, {kind:'cmp', shape:2, same:1, x:31, y:13, p:31, q:13, S:44, D:18, less:false, ans:26}, [26], 'сборът 31 + 13 е по-голям от разликата 31 − 13'],
    [4,  11, {kind:'box', shape:'bal', form:1, x:100, y:40, N:20, L:60, plus:false, ans:40}, [40], '100 − 40 = □ + 20'],
    [5,  51, {kind:'tens', shape:1, a:7, b:8, m:5, ans:2}, [2], '7 десетици + 8 десетици + 50 единици = □ стотици'],
    [6,  27, {kind:'missing', one:1, next:false, seq:[0,5,5,10,15,25,40,65], at:6, rule:0, ans:40}, [40], '0, 5, 5, 10, 15, 25, …, 65'],
    [7,  12, {kind:'count', sum:false, shape:1, natural:false, two:true, n:33, lo:10, hi:32, ans:23}, [23], 'двуцифрени числа, които са по-малки от 33'],
    [8,  10, {kind:'cmp', shape:3, tens:1, L:[20,40,80], R:[30,40,50], ans:20, flip:false}, [20], 'сборът 20 + 40 + 80 е по-голям от сбора 30 + 40 + 50'],
    [9,  12, {kind:'count', shape:4, name:1, sum:false, natural:false, two:false, a:12, b:15, lo:13, hi:14, slots:2, ans:13, alt:[14]}, [13, 14], 'числата, които са по-малки от 15 и са по-големи от 12'],
    [10, 38, {kind:'pencils', shape:'gave', who:'Ния', f:true, col:[['червени','червен'],['жълти','жълт']], T:20, a:9, rest:11, g1:7, g2:3, other:0, ans:1}, [1], 'имала 20 молива, от които 9 червени', ['T','a','g1','g2','other']],
    [11, 31, {kind:'trees', who:'Хари', did:'посадил', n:24, d:1, shape:0, len:23, ans:23}, [23], '24 дръвчета в една редица на разстояние 1 метър', ['n','d','shape']],
    [12, 21, {kind:'sqcut', shape:4, inCm:false, dm:1, P:40, sides:[7,7,6], p:20, ans:20}, [20], 'страни 7 см, 7 см, 6 см. Квадрат има страна 1 дм'],
    [13, 32, {kind:'ribbon', shape:3, inDm:false, a:15, aCm:15, b:5, k:3, m:1, ans:50}, [50], 'Пръчката от 15 см използвах 3 пъти, а пръчката от 5 см — 1 път'],
    [14, 40, {kind:'seg', shape:'ruler', a:3, b:7, c:5, d:11, AB:4, CD:6, ans:10}, [10], 'сборът от дължините на отсечките AB и CD'],
    [15, 52, {kind:'step', shape:0, W:7, H:6, w:2, h:5, sides:[7,5,2,5,1,6], equal:2, ans:2}, [2], 'отсечките на тази фигура, които са с равни дължини', ['W','H','w','h']],
    [16, 10, {kind:'cmp', shape:1, written:1, terms:[7,9,11,13,15,17], kept:[17,15,13,9,7], gone:[11], ans:11}, [11], '(7 + 9 + 11 + 13 + 15 + 17) − (17 + 15 + 13 + 9 + 7)'],
    [17, 25, {kind:'weekday', shape:'which', mon:['декември',31], d1:D('сряда'), n:16, ans:4}, [4], 'е сряда. Кой ден от седмицата ще бъде 16-ият ден', ['d1','n']],
    [18, 122, {kind:'lanterns', N:33, K:11, burning:false, ans:33}, [33], 'В замъка бяха запалени всичките 33 фенера. От тях загасиха 11. Колко фенера са останали'],
    [19, 53, {kind:'thr', small:true, pos:1, dig:1, a:210, base:102, shape:1, ans:108}, [108], 'цифра на десетиците 1'],
    [20, 29, {kind:'fruiteq', grid:1, f:['l','g','p','a'], A:7, B:5, C:9, D:6, signs:[1,-1,1,-1], R1:12, R2:3, C1:16, C2:11, ans:5}, [5], '= 16', ['grid','R1','R2','C1','C2','signs']]
  ]);
  paperCheck('Есен 2020', 'mbg-autumn-2020-2', '5, 60, 7, 40, 8, 5, 19, 12, 31, 3, 34, 4, 4, 879, 100 или 80, 22, 4, 2, Мария с 10, 11', [
    [1,  51, {kind:'tens', shape:4, t:2, u:37, b:7, tot:57, ans:5}, [5], '2 десетици + 37 единици = □7'],
    [2,  11, {kind:'box', shape:'bal', form:2, x:55, y:25, N:20, L:80, plus:true, ans:60}, [60], '55 + 25 = □ + 20'],
    [3,  12, {kind:'count', shape:5, set:1, list:[3,1,4,1,5,9,2,6,5,3,5], pool:[1,2,3,4,5,6,9], asksSum:false, sum:false, natural:false, two:false, ans:7}, [7], 'Колко са различните цифри? 3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5'],
    [4,  11, {kind:'box', shape:'bal', form:5, x:60, y:40, N:20, L:20, plus:false, ans:40}, [40], '60 − 40 = □ − 20'],
    [5,  54, {kind:'sudoku', g:[0,0,0,3, 3,2,4,0, 0,4,3,2, 2,0,0,0], sol:[4,1,2,3, 3,2,4,1, 1,4,3,2, 2,3,1,4], X:0, Y:15, ans:8}, [8], 'X и Y'],
    [6,  38, {kind:'pencils', shape:'gave', who:'Борис', f:false, col:[['червени','червен'],['жълти','жълт']], T:23, a:8, rest:15, g1:3, g2:7, other:2, ans:5}, [5], 'имал 23 молива, от които 8 червени', ['T','a','g1','g2','other']],
    [7,  31, {kind:'trees', who:'Хари', did:'посадил', n:20, d:1, shape:0, len:19, ans:19}, [19], '20 дръвчета в една редица на разстояние 1 метър', ['n','d','shape']],
    [8,  18, {kind:'digits', shape:3, pool:[0,1,3], made:[10,13,30,31], asks:0, ans:12}, [12], 'сбора на цифрите на всички двуцифрени числа, записани с различни цифри измежду цифрите 0, 1, 3'],
    [9,  55, {kind:'dcount', shape:1, d:2, from:2, k:13, ans:31}, [31], 'използвах 13 цифри 2'],
    [10, 56, {kind:'bucket', p:3, q:5, V:14, ans:3}, [3], 'събира точно 14 литра'],
    [11, 27, {kind:'missing', one:1, next:true, seq:[1,1,2,3,5,8,13,21], at:8, rule:0, ans:34}, [34], '1, 1, 2, 3, 5, 8, 13, 21, …'],
    [12, 21, {kind:'sqcut', shape:4, inCm:true, dm:4, P:16, sides:[3,4,5], p:12, ans:4}, [4], 'страни 3 см, 4 см, 5 см. Квадрат има страна 4 см'],
    [13, 32, {kind:'ribbon', shape:4, a:11, k:3, left:7, cm:40, ans:4}, [4], 'пръчка с дължина 11 см'],
    [14, 53, {kind:'thr', small:false, pos:2, dig:9, a:879, base:987, shape:0, ans:879}, [879], 'цифра на единиците 9'],
    [15, 21, {kind:'sqcut', shape:6, k:4, w:1, side:4, mm:true, slots:2, ans:100, alt:[80]}, [80, 100], 'Квадрат със страна 4 см е разрязан на четири еднакви правоъгълника. Колко милиметра'],
    [16, 52, {kind:'step', shape:1, W:6, H:5, w:4, h:1, sides:[6,4,4,1,2,5], equal:2, ans:22}, [22], 'обиколката на получената фигура', ['W','H','w','h']],
    [17, 25, {kind:'weekday', shape:'bound', n:22, most:true, day:D('събота'), ans:4}, [4], 'Колко най-много съботи може да има сред 22 последователни дни'],
    [18, 57, {kind:'rank', who:['Георги','Емил','Борис','Даниел'], n:4, k:2, asksAbove:true, ans:2}, [2], 'а Борис е с повече точки само от Даниел', ['n','k','asksAbove']],
    [19, 197, {kind:'cmp', runs:1, A:run(2, 18, 2), B:run(3, 17, 2), sa:90, sb:80, nm:['Мария','Деми'], back:false, big:0, ans:10}, [10], 'Мария пресметнала вярно 2 + 4 + 6'],
    [20, 58, {kind:'snail', H:23, up:8, down:5, gain:3, k:5, ans:11}, [11], 'висока 23 метра']
  ]);  paperCheck('Зима 2023', 'mbg-winter-2023-2', '40, 60, 1, 36, 10, 5, 14, 27, 100, 7, 1, 14, 1, 2, 0, 5 или 6, 34, 5, 12, 6 7 8 9', [
    [1,  99,  {kind:'brackets', shape:0, a:86, b:51, c:5, inner:46, ans:40}, [40], '86 − (51 − 5)'],
    [2,  9,   {kind:'pairs', shape:'tens', base:20, terms: chain(1, 19, 2, 18, 3, 17), paired:3, extra:0, subs:[], ans:60}, [60], '1 + 19 + 2 + 18 + 3 + 17'],
    [3,  99,  {kind:'brackets', shape:1, xs:[71,81,91], gaps:[29,19,9], ans:1}, [1], '(100 − 71) − (100 − 81) − (100 − 91)'],
    [4,  30,  {kind:'term', shape:2, t:Q.TERMS[1], M:84, D:48, S:36, ans:36}, [36], 'Умаляемото е 84, а разликата е 48. Кой е умалителят'],
    [5,  79,  {kind:'fifty', shape:3, pairs:[[1,9],[2,18],[3,17]], extra:55, nums:[1,9,2,18,3,17,55], T:105, less:false, ans:10}, [10], 'Пресметнете 1 + 9 + 2 + 18 + 3 + 17 + 55. Колко са десетиците в полученото число'],
    [6,  79,  {kind:'fifty', shape:3, pairs:[[1,9],[2,18],[3,17]], extra:45, nums:[1,9,2,18,3,17,45], T:95, less:true, ans:5}, [5], 'С колко сборът 1 + 9 + 2 + 18 + 3 + 17 + 45 е по-малък от 100'],
    [7,  12,  {kind:'count', sum:false, shape:4, natural:true, two:false, a:37, b:52, lo:38, hi:51, ans:14}, [14], 'естествени числа, които са по-малки от 52 и са по-големи от 37'],
    [8,  11,  {kind:'box', shape:'plus', odd:1, g:33, p:39, box:66, S:99, ans:27}, [27], '■ − 39, ако 33 + ■ = 99'],
    [9,  82,  {kind:'stepdig', k:5, start:0, first:[0,5,10,15], ones:2, twos:[10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95], three:100, digits:41, ans:100}, [100], 'числата 0, 5, 10, 15, …, x са записани с 41 цифри'],
    [10, 120,  {kind:'ineq', shape:3, A:43, B:19, L:24, C:17, ans:7}, [7], 'броя на всички различни числа, които можем да поставим вместо ?, така че да е вярно: 43 − 19 > ? + 17'],
    [11, 121,  {kind:'rectdm', shape:1, a:15, d:2, base:'см', dU:'дм', b:35, P:100, to:'м', ans:1}, [1], 'Една от страните на правоъгълник е 15 см, а другата е с 2 дм по-дълга. Колко метра'],
    [12, 100, {kind:'magic', g:[20,10,12,6,14,22,16,18,8], shown:[20,10,12,6,4,22,16,18,8], at:4, wrong:4, S:42, ans:14}, [14], '20 10 12 6 4 22 16 18 8', ['shown']],
    [13, 19,  {kind:'rects', shape:2, W:2, H:2, all:9, sizes:[4,1], sq:5, other:4, asksAll:false, fewer:true, ans:1}, [1], 'С колко правоъгълниците на чертежа, които не са квадрати, са по-малко от квадратите'],
    [14, 21,  {kind:'sqcut', shape:5, rev:1, t:{w:5, h:3, sq:[[0,0,2],[0,2,1],[1,2,1],[2,0,3]]}, s:2, n:4, few:2, short:6, ans:2}, [2], 'съставен от два еднакви и два различни квадрата. По-малката страна на този правоъгълник е 6 см'],
    [15, 21,  {kind:'sqcut', shape:4, mm:15, t:2, P:6, p:6, ans:0}, [0], 'Квадрат има дължина на страната 15 милиметра, а страната на равностранен триъгълник е 2 см'],
    [16, 13,  {kind:'named', shape:4, may:1, k:5, S:12, tops:[[0,1,2,3,6],[0,1,2,4,5]], slots:2, ans:6, alt:[5]}, [5, 6], 'Сборът на пет различни числа е 12. Колко може да бъде най-голямото'],
    [17, 87,  {kind:'balloons', k:3, m:3, rest:31, T:40, ans:34}, [34], 'общо 40 балона, като 3 деца имат по 3 балона'],
    [18, 24,  {kind:'sums', shape:4, nums:[1,2,11,21], two:true, pairs:[[1,11],[1,21],[2,11],[2,21],[11,21]], ans:5}, [5], 'от числата 1, 2, 11 и 21, като поне едното събираемо е двуцифрено'],
    [19, 101, {kind:'paintrow', n:3, c:3, ans:12}, [12], 'трите квадратчета трябва да се оцвети в някой от цветовете бяло, зелено или червено'],
    [20, 43,  {kind:'coins', shape:'mix', n:5, vals:[6,7,8,9], slots:4, ans:6, alt:[7,8,9]}, [6, 7, 8, 9], 'Саид има 5 монети, всяка от които е или 1, или 2 евро']
  ]);
  paperCheck('Зима 2022', 'mbg-winter-2022-2', '30, 0, 15, 0, 10, 2, 10, 10, 1 и 2, 40, 10, 1, 3, 14, 4 и 6, 4, 7, 8, 10, 88', [
    [1,  9,   {kind:'pairs', shape:'cancel', terms: chain(90, -80, 80, -70, 70, -60), start:90, last:60, ans:30}, [30], '90 − 80 + 80 − 70 + 70 − 60'],
    [2,  9,   {kind:'pairs', shape:'tens', base:'mixed', sums:[10,30], terms: chain(2, 8, 12, 18, -20, -20), paired:2, extra:0, subs:[20,20], ans:0}, [0], '2 + 8 + 12 + 18 − 20 − 20'],
    [3,  99,  {kind:'brackets', shape:2, N:15, down:[5,4,3,2,1], up:[1,2,3,4,5], ans:15}, [15], '(15 − 5 − 4 − 3 − 2 − 1) + (1 + 2 + 3 + 4 + 5)'],
    [4,  30,  {kind:'term', shape:2, same:1, t:Q.TERMS[1], ans:0}, [0], 'Умаляемото е равно на разликата. Колко е умалителят'],
    [5,  79,  {kind:'fifty', shape:4, tens:[40,20,30,20], ones:[1,2,3,4], T:100, ans:10}, [10], 'Пресметнете 40 − 1 + 20 − 2 + 30 − 3 + 20 − 4. Колко са десетиците'],
    [6,  10,  {kind:'cmp', shape:3, shift:1, L:[20,21,22,23,6], R:[19,20,21,22,8], ans:2, flip:true}, [2], 'С колко сборът 19 + 20 + 21 + 22 + 8 е по-малък от сбора 20 + 21 + 22 + 23 + 6'],
    [7,  120,  {kind:'ineq', shape:4, C:10, T:30, ans:10}, [10], 'Колко са всички двуцифрени числа, които могат да се запишат в □, така че да е вярно □ + 10 < 30'],
    [8,  14,  {kind:'grow', shape:'diff', M:40, S:10, a:10, b:10, mUp:false, sUp:true, M2:30, S2:20, ans:10}, [10], 'В разликата 40 − 10 умаляемото е намалено с 10, а умалителят е увеличен с 10'],
    [9,  120,  {kind:'ineq', shape:5, d:2, N:22, fits:[1,2], slots:2, ans:1, alt:[2]}, [1, 2], 'числото 22 да не е по-малко от двуцифреното число ❄2'],
    [10, 82,  {kind:'stepdig', k:4, start:4, first:[4,8,12,16], ones:2, twos:[12,16,20,24,28,32,36,40], digits:18, ans:40}, [40], '4, 8, 12, 16, …, x са записани с 18 цифри'],
    [11, 32,  {kind:'ribbon', shape:5, a:1, u1:'дм', b:9, u2:'см', to:'мм', A:100, B:90, ans:10}, [10], 'Лента е дълга 1 дм. С колко милиметра тя е по-дълга от лента с дължина 9 см'],
    [12, 121,  {kind:'rectdm', shape:1, a:15, d:20, base:'мм', dU:'мм', b:35, P:100, to:'дм', ans:1}, [1], 'Една от страните на правоъгълник е 15 мм, а другата е с 20 мм по-дълга. Колко дециметра'],
    [13, 106, {kind:'cutrect', W:4, H:5, pieces:[[1,2],[2,3],[3,4]], at:2, side:0, other:4, ans:3}, [3], 'Правоъгълник със страни 4 см, 4 см, 5 см и 5 см разрязах на три правоъгълника: първият със страни 1 см, 1 см, 2 см и 2 см; вторият — 2 см, 2 см, 3 см и 3 см; третият — X см, X см, 4 см и 4 см'],
    [14, 105, {kind:'countsq', cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[1,1],[2,1],[4,1],[1,2],[2,2]], sizes:[11,3], ans:14}, [14], 'образувана от 11 квадратни плочки. Колко общо са квадратите'],
    [15, 41,  {kind:'three', who:'Хари', a:1, b:5, slots:2, ans:4, alt:[6]}, [4, 6], 'записал две от тях: 1 см и 5 см', ['a','b']],
    [16, 102, {kind:'segcount', n:4, S:6, rev:true, ans:4}, [4], 'Колко точки трябва да отбележим на една права, за да се получат точно 6 отсечки'],
    [17, 104, {kind:'weights', a:1, b:2, N:10, ans:7}, [7], 'С три различни тежести от 1 кг, 2 кг и x кг можем да претеглим на везна всеки пакет с тегло от 1 кг до 10 кг'],
    [18, 103, {kind:'common', k:3, n:11, A:[2,5,8,11,14,17,20,23,26,29,32], B:[11,14,17,20,23,26,29,32,35,38,41], both:[11,14,17,20,23,26,29,32], ans:8}, [8], 'Иво: 2, 5, 8, …, 29, 32 Ели: 11, 14, 17, …, 38, 41'],
    [19, 87,  {kind:'balloons', k:5, m:3, rest:5, T:20, ans:10}, [10], 'общо 20 балона, като 5 деца имат по 3 балона'],
    [20, 13,  {kind:'named', shape:5, v:0, wit:[98,10], ans:88}, [88], 'Кое е най-голямата разлика на две двуцифрени числа, записани с 4 различни цифри']
  ]);
  // the Зима 2022 kinds by brute force: segments, shared numbers, the weights, squares in the figure, the cut
  for(let i = 0; i < 300; i++){
    const g = Q.raw(102);
    if(g.shape === 'dots'){   // Есен 2019: every point placed at its own half-centimetre, then counted by colour
      const at = {}; at[0] = at[2*g.L] = 'y';
      for(let k = 1; k < g.n; k++) at[2*k*g.d] = 'r';
      for(let k = 0; k < g.n; k++) at[(2*k + 1)*g.d] = 'b';
      const c = Object.values(at), n = t => c.filter(v => v === t).length;
      if(g.ans !== [c.length, n('r'), n('b')][g.asks]) throw new Error('coloured points: ' + JSON.stringify(g));
    } else { let segs = 0; for(let x = 0; x < g.n; x++) for(let y = x + 1; y < g.n; y++) segs++;
    if(segs !== g.S || g.ans !== (g.rev ? g.n : g.S)) throw new Error('segcount: ' + JSON.stringify(g)); }
    const c = Q.raw(103); if(c.A.filter(v => c.B.includes(v)).length !== c.ans) throw new Error('common: ' + JSON.stringify(c));
    const w = Q.raw(104), fits = [];
    for(let x = 1; x <= 30; x++){ if(x === w.a || x === w.b) continue; const got = new Set(); for(const p of [-1,0,1]) for(const q of [-1,0,1]) for(const r of [-1,0,1]){ const v = p*w.a + q*w.b + r*x; if(v > 0) got.add(v); } if([...Array(w.N).keys()].every(v => got.has(v + 1))) fits.push(x); }
    if(fits.length !== 1 || fits[0] !== w.ans) throw new Error('weights: ' + JSON.stringify(w) + ' ' + fits);
    const s = Q.raw(105), set = new Set(s.cells.map(([x, y]) => x + ',' + y)); let n = 0;
    for(let k = 1; k <= 5; k++) s.cells.forEach(([x, y]) => { let ok = true; for(let a = 0; a < k; a++) for(let b = 0; b < k; b++) ok = ok && set.has((x + a) + ',' + (y + b)); if(ok) n++; });
    if(n !== s.ans) throw new Error('countsq: ' + JSON.stringify(s));
    const r = Q.raw(106); if(r.pieces.reduce((t, p) => t + p[0]*p[1], 0) !== r.W*r.H || r.pieces[r.at][r.side] !== r.ans) throw new Error('cutrect: ' + JSON.stringify(r));
  }
  paperCheck('Зима 2021', 'mbg-winter-2021-2', '3, 40, 1, 12, 14, 6, 2, 10, 1 или 2, 30, 89, 1, 4, 8, 5, 3, 10, 18, 6, 8 или 10', [
    [1,  9,   {kind:'pairs', shape:'ones', pairs:[[100,99],[99,98],[97,96]], terms: chain(100, -99, 99, -98, 97, -96), ans:3}, [3], '100 − 99 + 99 − 98 + 97 − 96'],
    [2,  9,   {kind:'pairs', shape:'tens', base:20, terms: chain(1, 19, 2, 18, 3, 17, 4, 16, -40), paired:4, extra:0, subs:[40], ans:40}, [40], '1 + 19 + 2 + 18 + 3 + 17 + 4 + 16 − 40'],
    [3,  99,  {kind:'brackets', shape:3, first:[100,94], gs:[[99,98],[98,96],[96,94]], ans:1}, [1], '(100 − 94) − (99 − 98) − (98 − 96) − (96 − 94)'],
    [4,  30,  {kind:'term', shape:2, t:Q.TERMS[1], M:21, D:9, S:12, ans:12}, [12], 'Умаляемото е 21, а разликата е 9'],
    [5,  79,  {kind:'fifty', shape:3, pairs:[[11,9],[12,8],[13,87]], extra:0, nums:[11,12,13,87,8,9], T:140, less:false, ans:14}, [14], '11 + 12 + 13 + 87 + 8 + 9. Колко са десетиците'],
    [6,  10,  {kind:'cmp', shape:3, shift:1, L:[12,13,14,88,9,10], R:[11,12,13,87,8,9], ans:6, flip:true}, [6], 'С колко сборът 11 + 12 + 13 + 87 + 8 + 9 е по-малък от сбора 12 + 13 + 14 + 88 + 9 + 10'],
    [7,  80,  {kind:'pickfit', nums:[15,16,17,18], add:17, n:34, more:false, fits:[15,16], ans:2}, [2], 'Колко от числата 15, 16, 17 и 18 могат да се запишат в □'],
    [8,  14,  {kind:'grow', shape:'diff', M:37, S:16, a:7, b:4, mUp:false, sUp:true, M2:30, S2:20, ans:10}, [10], 'В разликата 37 − 16 умаляемото е намалено с 7, а умалителят е увеличен с 4'],
    [9,  120,  {kind:'ineq', shape:5, three:true, d:9, N:299, fits:[1,2], slots:2, ans:1, alt:[2]}, [1, 2], 'числото 299 да не е по-малко от трицифреното число ❄99'],
    [10, 82,  {kind:'stepdig', k:3, start:0, first:[0,3,6,9], ones:4, twos:[12,15,18,21,24,27,30], digits:18, ans:30}, [30], 'числата 0, 3, 6, 9, …, x са записани с 18 цифри'],
    [11, 32,  {kind:'ribbon', shape:5, a:9, u1:'дм', b:10, u2:'мм', to:'см', A:900, B:10, ans:89}, [89], 'Лента е дълга 9 дм. С колко сантиметра тя е по-дълга от лента с дължина 10 мм'],
    [12, 121,  {kind:'rectdm', shape:1, a:20, d:1, base:'см', dU:'дм', b:30, P:100, to:'м', ans:1}, [1], 'Една от страните на правоъгълник е 20 см, а другата е с 1 дм по-дълга. Колко метра'],
    [13, 19,  {kind:'rects', shape:2, W:2, H:2, all:9, sizes:[4,1], sq:5, other:4, asksAll:true, fewer:false, ans:4}, [4], 'С колко правоъгълниците на чертежа са повече от квадратите'],
    [14, 107, {kind:'alternate', n:15, most:true, ans:8}, [8], 'общо 15 фигури. Колко най-много може да са квадратчетата'],
    [15, 108, {kind:'pages', a:14, b:25, la:7, lb:13, ans:5}, [5], 'Колко листа има между страница 14 и страница 25'],
    [16, 49,  {kind:'multiple', shape:'count', p:2, r:3, L:6, N:20, list:[6,12,18], ans:3}, [3], 'Колко от числата от 1 до 20 можем да запишем'],
    [17, 109, {kind:'pairsum', nums:[7,9,10,11,13], ans:10}, [10], 'От числата 7, 9, 10, 11 и 13 изберете четири'],
    [18, 87,  {kind:'balloons', k:2, m:3, rest:16, T:22, ans:18}, [18], 'общо 22 балона, като 2 деца имат по 3 балона'],
    [19, 48,  {kind:'both', T:12, A:6, B:8, both:2, lang:['немски','английски'], asksBoth:false, ans:6}, [6], 'учат само английски', ['T','A','B','asksBoth']],
    [20, 199, {kind:'place', shape:2, A:9, B:7, D:12, sols:[[0,8],[1,9]], slots:2, ans:8, alt:[10]}, [8, 10], '9□ − 7△ = 12']
  ]);
  for(let i = 0; i < 300; i++){   // the Зима 2021 kinds, counted out
    const a = Q.raw(107); let best = -1; for(let first = 0; first < 2; first++){ const sq = Array.from({length: a.n}, (_, j) => (j + first) % 2 === 0).filter(Boolean).length; best = best < 0 ? sq : a.most ? Math.max(best, sq) : Math.min(best, sq); }
    if(best !== a.ans) throw new Error('alternate: ' + JSON.stringify(a));
    const g = Q.raw(108); let leaves = 0; for(let l = 1; l <= 60; l++) if(2*l - 1 > g.a && 2*l < g.b && !(2*l - 1 <= g.a && g.a <= 2*l)) leaves++;
    if(leaves !== g.ans) throw new Error('pages: ' + JSON.stringify(g) + ' ' + leaves);
    const p = Q.raw(109), left = p.nums.filter(x => { const f = p.nums.filter(v => v !== x); return f[0] + f[1] === f[2] + f[3] || f[0] + f[2] === f[1] + f[3] || f[0] + f[3] === f[1] + f[2]; });
    if(left.length !== 1 || left[0] !== p.ans) throw new Error('pairsum: ' + JSON.stringify(p));
  }
  paperCheck('Зима 2020', 'mbg-winter-2020-2', '11, 4, 0, 1, 31, 11, 8, 16, 16, 19, 7, 7, 12, 17, 6, 12, 8, 9, 12, 305', [
    [1,  79,  {kind:'fifty', shape:3, pairs:[[3,37],[5,25],[9,31]], extra:0, nums:[3,5,9,31,25,37], T:110, less:false, ans:11}, [11], '3 + 5 + 9 + 31 + 25 + 37. Колко са десетиците'],
    [2,  10,  {kind:'cmp', shape:3, most:1, L:[13,22,33,67,78,91], R:[11,22,33,67,78,89], ans:4, flip:true}, [4], 'С колко сборът 11 + 22 + 33 + 67 + 78 + 89 е по-малък от сбора 13 + 22 + 33 + 67 + 78 + 91'],
    [3,  110, {kind:'erasedig', X:10, y:5, S:15, shown:1, first:false, ans:0}, [0], 'получила 15. След това изтрила една цифра в записаното и се получило: 5 + 1 = 15'],
    [4,  80,  {kind:'pickfit', nums:[15,16,17,18], add:16, n:33, more:true, fits:[18], ans:1}, [1], 'Колко от числата 15, 16, 17 и 18 могат да се запишат в □'],
    [5,  119, {kind:'andmore', a:12, d:7, fewer:false, b:19, ans:31}, [31], 'играят 12 момичета и със 7 повече момчета'],
    [6,  111, {kind:'replaced', N:20, M:10, ans:11}, [11], 'Записах 20 числа. Няколко от тях изтрих и записах сбора им. Числата са вече 10'],
    [7,  112, {kind:'blocks', n:4, pairs:[[1,2],[3,4]], ans:8}, [8], 'числата 1, 2, 3 и 4 едно до друго, така че 1 и 2, както и 3 и 4 да са винаги съседни'],
    [8,  14,  {kind:'grow', shape:'diff', M:43, S:16, a:4, b:7, mUp:false, sUp:true, M2:39, S2:23, ans:16}, [16], 'В разликата 43 − 16 умаляемото е намалено с 4, а умалителят е увеличен с 7'],
    [9,  29,  {kind:'fruiteq', tri:1, x:1, y:8, z:7, s1:9, s2:15, s3:8, ans:16}, [16], '● + ○ = 9 ○ + ■ = 15 ■ + ● = 8'],
    [10, 82,  {kind:'stepdig', k:1, start:2, first:[2,3,4,5], ones:8, twos:[10,11,12,13,14,15,16,17,18,19], digits:28, ans:19}, [19], 'числата 2, 3, 4, 5, …, x са записани с 28 цифри'],
    [11, 118, {kind:'nuts', k:4, m:2, T:16, ans:7}, [7], 'Четири катерички си разделили общо 16 ореха, като всяка е получила повече от 2 ореха'],
    [12, 93,  {kind:'consec', shape:'count', a:4, b:18, list:[5,7,9,11,13,15,17], ans:7}, [7], 'Колко от числата от 4 до 18 можем да представим като сбор на две последователни числа'],
    [13, 116, {kind:'cuckoo', k:3, s:4, m:4, t:16, ans:12}, [12], 'кука по 3 пъти за 4 секунди. Колко пъти ще изкука кукувичката за 16 секунди'],
    [14, 17,  {kind:'sumdiff', shape:'sd', S:25, d:9, small:8, big:17, asksBig:true, ans:17}, [17], 'Сборът на две числа, едно от които е с 9 по-голямо от другото, е 25'],
    [15, 102, {kind:'segcount', n:4, S:6, rev:false, ans:6}, [6], 'отбелязани 4 точки. Колко отсечки'],
    [16, 21,  {kind:'sqcut', shape:6, both:1, k:2, side:2, P:8, ans:12}, [12], 'Квадрат с обиколка 8 см е разрязан на два правоъгълника'],
    [17, 113, {kind:'tripts', dots:[[1,0],[0,1],[1,1],[2,1],[1,2]], all:10, flat:2, ans:8}, [8], 'Колко са триъгълниците с върхове 3 от точките на чертежа'],
    [18, 114, {kind:'bouquets', a:3, b:7, n:10, x:9, T:34, asksSmall:true, ans:9}, [9], 'В 10 букета от рози има общо 34 рози. Някои от букетите са от по 3 рози, а останалите — по 7'],
    [19, 115, {kind:'ring', l:4, r:6, ans:12}, [12], 'Отляво на Петър, между Петър и Иван, има 4 деца. Отдясно на Петър, между Петър и Иван, има 6 деца'],
    [20, 117, {kind:'least3', s:'6003067586', cross:7, ans:305}, [305], 'Записани са цифрите 6003067586. Зачеркнете 7 от тях']
  ]);
  paperCheck('Коледно 2024', 'kms-2024-2', '8, 17 и 30, 2, 0, 4, 57, 1, 4, 14; задача 10: 21, 15, 6, 3', [
    [1,  123, {kind:'vtri', f:0, V:'o', ans:8}, [8], 'На колко триъгълника е връх точка A', ['f', 'V']],
    [2,  27,  {kind:'missing', grows:1, seq:[2,3,5,8,12,17,23,30,38,47], gaps:[5,7], slots:2, ans:17, alt:[30]}, [17, 30], '2, 3, 5, 8, 12, …, 23, …, 38, 47'],
    [3,  30,  {kind:'term', shape:3, mins:false, k:6, list:[[12,'−',9],[8,'−',4],[11,'+',34],[31,'−',7],[27,'−',0]], traps:[3], ans:2}, [2], 'Колко от умалителите в задачите 12 − 9, 8 − 4, 11 + 34, 31 − 7, 27 − 0 са по-големи от 6'],
    [4,  198, {kind:'box', shape:'sym', a:12, b:16, X:28, c:20, Y:8, T:9, most:false, traps:[1], ans:0}, [0], 'На колко е равно ☺, ако 12 + 16 = ●, ● − 20 = ■, ■ + ☺ < 9'],
    [5,  18,  {kind:'digits', shape:4, k:2, ones:true, list:[22,45,76,81,57,92,84,49,37,41,69,62,51], traps:[5], ans:4}, [4], 'Колко от числата 22, 45, 76, 81, 57, 92, 84, 49, 37, 41, 69, 62, 51 имат цифра на единиците, поне с 2 по-голяма от цифрата на десетиците'],
    [6,  99,  {kind:'brackets', shape:4, a:31, b:19, c:78, d:40, e:28, f:22, g:19, ans:57}, [57], '(31 + 19) + (78 − 40) − (28 + 22 − 19)'],
    [7,  124, {kind:'numpyr', b:[0,1,1,2,1], z:14, r1:[1,2,3,3], r2:[3,5,6], top:19, bot:18, asks:2, ans:1}, [1], 'разликата от числата, които трябва да се запишат на мястото на звездичките'],
    [8,  125, {kind:'ages', F:31, m:3, older:true, M:28, g:20, A:8, b:4, B:4, asksAni:false, ans:4}, [4], 'Ани е с 4 години по-голяма от брат си и с 20 години по-малка от майка си. Бащата на Ани е на 31 години и е с 3 години по-стар от майка ѝ. На колко години е брат ѝ'],
    [9,  128, {kind:'isoperim', shape:1, leg:15, d:2, b:14, T:90, short:true, traps:[16], ans:14}, [14], 'са по 15 см. Основата на единия е с 2 см по-къса от основата на другия. Сборът от обиколките им е 9 дм. Колко сантиметра е по-късата основа'],
    ...[[0, 21, 'Колко метра гирлянди са купили общо'], [1, 15, 'страната на квадрата, „нарисуван“ от всички зелени гирлянди'],
        [2, 6, 'По колко метра са бедрата на равнобедрения триъгълник, „нарисувани“ от всички червени гирлянди'], [3, 3, 'Страната на долния е 4 м. Колко метра е страната на горния триъгълник']]
      .map(([shape, ans, shows]) => ['10' + 'АБВГ'[shape], 126, Object.assign({kind:'garland', shape, len:[12,15,30], price:[20,50,25], who:[[3,0,0],[1,0,2],[1,2,2]], n:[5,2,4], dm:[60,30,120], all:210, ans}, shape === 3 ? {L:4} : {}),
        [ans], shape ? shows : 'Яна купила 3 зелени гирлянди, майка ѝ — 1 зелена и 2 червени, а брат ѝ — 1 зелена, 2 сини и 2 червени. ' + shows, ['shape', 'len']])
  ]);
  const TOYS = {kind:'toys', a:3, n:9, day0:0, T:63, m:9, boxes:7, f:3, sold:3, p1:11, p2:14, last:1};
  const toyStory = 'Ели направила в понеделник 3 играчки за елха. Всеки ден след това правила с по 1 играчка повече от предишния ден, докато направила общо 63 играчки. ';
  const dayOpt = (nm, uk) => [nm, uk];
  paperCheck('Коледно 2023', 'kms-2023-2', '6, 25, 42, 8, 9, 6, 66, 2, 44; задача 10: 9, вторник, 7, 39', [
    [1,  142, {kind:'vtri', shape:'count', f:0, tri:12, sq:6, asks:2, traps:[18], ans:6}, [6], 'С колко броят на триъгълниците е по-голям от броя на квадратите', ['f', 'asks']],
    [2,  99,  {kind:'brackets', shape:6, a:100, b:57, c:96, d:78, ans:25}, [25], '(100 − 57) + 0 − (96 − 78)'],
    [3,  143, {kind:'corners', n:[2,1,3], asks:0, sides:21, traps:[21], ans:42}, [42], 'Колко общо са страните и върховете на два правоъгълника, един квадрат и три триъгълника'],
    [4,  97,  {kind:'isoperim', shape:2, a:4, laps:2, base:3, leg:5, route:'MEKME', ant:24, tort:16, traps:[4, 5], ans:8}, [8], 'Мравка изминала два пъти пътечката ABCA (триъгълник ABC е равностранен). Костенурка се разходила по равнобедрения триъгълник MEK по следния начин: MEKME', ['a', 'laps', 'base', 'leg', 'route']],
    [5,  200, {kind:'ribbon', shape:6, T:53, longer:true, groups:[{n:4, r:{d:4, c:18}, cm:58}, {n:2, r:{d:4}, cm:40}, {n:1, r:{d:6}, cm:60}, {n:3, r:{c:57}, cm:57}, {n:1, r:{d:7}, cm:70}], traps:[4], ans:9}, [9],
      'Ива купила гирлянди: четири — по 4 дм и 18 см, две — по 4 дм, една — по 6 дм, три — по 57 см и една — по 7 дм. Колко от гирляндите са по-дълги от 53 см', ['T', 'longer']],
    [6,  144, {kind:'films', f:2, m:2, x:2, traps:[9, 7], ans:6}, [6], 'Бащата на Яна участва в 2 филма. Майка ѝ участва в един от тези филми и в още 2 други. Брат ѝ участва в един филм заедно с двамата си родители, в 2 филма сам'],
    [7,  145, {kind:'rests', g:3, n:5, t:4, r:3, work:60, traps:[69, 60], ans:66}, [66], 'Във фитнеса Ани прави 3 групи упражнения. Във всяка група има по 5 упражнения. Всяко упражнение трае 4 минути. Между всяка група упражнения Ани почива 3 минути'],
    [8,  128, {kind:'isoperim', shape:3, t:4, sq:2, b:1, leg:2, list:[12, 8, 18, 4, 5, 20], P:5, traps:[4, 5], ans:2}, [2], 'Числата в редицата 12, 8, 18, 4, 5, 20 са обиколки в сантиметри на фигурите равностранен триъгълник, квадрат и равнобедрен триъгълник с основа 1', ['b', 'leg']],
    [9,  124, {kind:'numpyr', shape:'one', rows:[[99], [55, 44], [33, 22, 22], [22, 11, 11, 11], [11, 11, 0, 11, 0]], up:99, low:55, asks:-1, ans:44}, [44], '(A+B+C) − (D+E+F+G+H+K+M)', ['asks']],
    ['10А', 146, Object.assign({shape:0, traps:[8, 63], ans:9}, TOYS), [9], toyStory + 'Колко дена е работила Ели', ['a', 'n', 'day0']],
    ['10Б', 146, Object.assign({shape:1, options:[dayOpt('понеделник', 'понеділок'), dayOpt('вторник', 'вівторок'), dayOpt('сряда', 'середа'), dayOpt('събота', 'субота')].map((text, id) => ({id, v:id, text})), pick:1, own:true, ans:1}, TOYS), [1],
      toyStory + 'В кой ден от седмицата е спряла да работи', ['a', 'n', 'day0']],
    ['10В', 146, Object.assign({shape:2, traps:[9], ans:7}, TOYS), [7], 'Опаковала играчките по 9 в кутия. Колко кутии е използвала', ['a', 'n', 'day0', 'm']],
    ['10Г', 146, Object.assign({shape:3, traps:[53, 42], ans:39}, TOYS), [39], 'Оставила една кутия за себе си, подарила по една на 3 свои приятелки и останалите продала на коледния базар. За едната кутия получила 11 лева, а за останалите — по 14 лева', ['a', 'n', 'day0', 'm']]
  ]);
  paperCheck('Коледно 2022', 'kms-2022-2', 'Г, 64, 23, 21 и 31, 88, 11 и 11, 12, 6, 4; задача 10: 12:01', [
    [1,  147, {kind:'notrue', x:34, y:22, p:87, r:25, A:56, B:62, C:55, st:['A < B', 'C < A', 'B > C', 'A > B'], oks:[true, true, true, false],
      options:['A < B', 'C < A', 'B > C', 'A > B'].map((s, id) => ({id, v:id, text:[s, s]})), pick:3, own:true, ans:3}, [3], 'A = 34 + 22, B = 87 − 25, C = 55', ['A', 'B', 'C']],
    [2,  148, {kind:'buyleft', M:92, k:2, p:14, spent:28, traps:[28, 78], ans:64}, [64], 'Рая имала 92 ст. Купила си две играчки за украса на елхата по 14 ст. Колко стотинки са останали на Рая'],
    [3,  149, {kind:'clockmin', ny:true, h:23, m:37, two:false, traps:[37, 63], ans:23}, [23], 'В 2337 часа на 31 декември Ани опитала от тортата. Колко минути след това е започнала новата година'],
    [4,  150, {kind:'bothseq', u:1, N:50, s:3, A:[1, 11, 21, 31, 41], both:[21, 31], slots:2, ans:21, alt:[31]}, [21, 31], 'Редицата A е образувана от всички числа, по-малки от 50, които имат цифра на единиците 1. Редицата C е образувана от всички двуцифрени числа, на които сборът от цифрите е 3 или 4'],
    [5,  151, {kind:'datespan', i:0, j:2, d1:23, d2:5, k:2, days:44, asksDays:false, traps:[86, 90], ans:88}, [88], 'На 23 март Дончо гледал първа и втора серия на любимия си филм. Всеки ден до 5 май включително продължил да гледа по две нови серии'],
    // the paper asks both counts at once; they are equal (11 and 11), so here the triangles are asked
    [6,  142, {kind:'vtri', shape:'count', f:1, tri:11, sq:11, asks:0, traps:[11], ans:11}, [11], 'Колко са триъгълниците на чертежа', ['f', 'asks']],
    [7,  152, {kind:'named', shape:6, w:0, A:11, d:0, lo:22, B:24, L:25, traps:[24, 11], ans:12}, [12], 'Числото A е най-малкото двуцифрено число с еднакви цифри, B > A + A, B < 25, C + C = B'],
    [8,  153, {kind:'sqrect', one:true, lo:3, hi:9, a:8, b:4, P:24, asksP:false, traps:[24, 12, 4], ans:6}, [6], 'Квадрат и правоъгълник имат равни обиколки. Дължините на страните на правоъгълника са едноцифрени числа, по-големи от 3'],
    [9,  200, {kind:'ribbon', shape:7, list:[{d:2, c:40}, {c:90}, {d:8, c:8}, {c:100}, {d:8, c:10}, {c:60}, {d:5, c:10}, {m:1}, {d:6}, {d:10}],
      cms:[60, 90, 88, 100, 90, 60, 60, 100, 60, 100], traps:[10, 9], ans:4}, [4], '2 дм и 40 см', ['ans']],
    [10, 154, {kind:'liftday', shape:3, fk:2, fm:30, F:4, sk:6, L:2, R:30, rest:32, flat:60, down:20, start:534, total:187, back:721,
      options:['12:01', '11:29', '12:16', '11:11'].map((s, id) => ({id, v:id, text:[s, s]})), pick:0, own:true, ans:0}, [0], 'Иво тръгнал от стадиона в 854 часа, качил се до Станция 2 с лифта, починал си 32 минути и се върнал пеш до стадиона', ['fk', 'fm', 'sk', 'R']]
  ]);
  paperCheck('Есен 2019', 'mbg-autumn-2019-2', '2, 40, 8, 60, 14, 4, 16, 63, 30, 3, 21, 1, 5, 21, 90, 3, 3, 2, Лили с 10, 4', [
    [1,  51,  {kind:'tens', shape:4, t:1, u:14, b:4, tot:24, ans:2}, [2], '1 десетица + 14 единици = □4'],
    [2,  11,  {kind:'box', shape:'bal', form:2, x:30, y:40, N:30, L:70, plus:true, ans:40}, [40], '30 + 40 = □ + 30'],
    [3,  55,  {kind:'dcount', shape:2, list:[12,34,60,79], traps:[4], ans:8}, [8], 'С колко цифри са записани числата 12, 34, 60 и 79'],
    [4,  11,  {kind:'box', shape:'bal', form:5, x:70, y:20, N:10, L:50, plus:false, ans:60}, [60], '70 − 20 = □ − 10'],
    [5,  48,  {kind:'both', shape:'venn', ex:[4,3,2], m:3, L:8, R:12, traps:[20], ans:14}, [14], 'Пресметнете сбора □ + △'],
    [6,  28,  {kind:'fruit', shape:'rest', T:11, r:5, y:6, e:2, traps:[9], ans:4}, [4], 'Петьо имал 11 ябълки, от които 5 червени, а останалите — жълти. Изял 2 жълти ябълки. Колко жълти ябълки са му останали'],
    [7,  95,  {kind:'diffseq', seq:[1,2,4,7,11,16], down:false, d0:1, g:1, asksSum:false, ans:16}, [16], '1, 2, 4, 7, 11'],
    [8,  18,  {kind:'digits', shape:3, pool:[0,1,2], made:[10,12,20,21], asks:2, ans:63}, [63], 'сбора на всички двуцифрени числа, записани с различни цифри измежду цифрите 0, 1, 2'],
    [9,  55,  {kind:'dcount', shape:1, d:1, from:1, k:13, ans:30}, [30], 'използвах 13 цифри 1'],
    [10, 56,  {kind:'bucket', p:3, q:4, V:10, ans:3}, [3], 'събира точно 10 литра'],
    [11, 94,  {kind:'wordpos', shape:'count', pat:['○','○','○','○','△','□'], n:31, sym:'○', traps:[20], ans:21}, [21], 'колко кръгчета има от 1-вия до 31-ия символ включително'],
    [12, 21,  {kind:'sqcut', shape:4, inCm:true, dm:2, P:8, sides:[2,2,3], p:7, ans:1}, [1], 'страни 2 см, 2 см, 3 см. Квадрат има страна 2 см'],
    [13, 32,  {kind:'ribbon', shape:4, a:12, k:4, left:2, cm:50, ans:5}, [5], 'пръчка с дължина 12 см'],
    [14, 102, {kind:'segcount', shape:'dots', n:10, d:3, L:30, asks:0, traps:[22, 20], ans:21}, [21], 'Краищата на отсечка с дължина 30 см са оцветени в жълто'],
    [15, 21,  {kind:'sqcut', shape:6, half:1, k:2, side:3, mm:true, ans:90}, [90], 'Квадрат със страна 3 см е разрязан на два еднакви правоъгълника. Колко милиметра'],
    [16, 127, {kind:'dice', S:5, x:3, y:2, more:true, n:4, traps:[1], ans:3}, [3], 'Петър хвърлил два различни зара'],
    [17, 25,  {kind:'weekday', shape:'bound', n:15, most:true, day:D('вторник'), ans:3}, [3], 'Колко най-много вторника може да има сред 15 последователни дни'],
    [18, 57,  {kind:'rank', who:['Георги','Емил','Борис','Даниел'], n:4, k:2, asksAbove:true, tall:true, ans:2}, [2], 'е по-висок и от', ['n', 'k', 'asksAbove', 'tall']],
    [19, 197, {kind:'cmp', runs:1, A:run(2, 20, 2), B:run(1, 19, 2), sa:110, sb:100, nm:['Мария','Деми'], back:true, big:0, ans:10}, [10], '2 + 4 + 6 + 8 + 10 + 12 + 14 + 16 + 18 + 20', ['A', 'B', 'back']],
    [20, 112, {kind:'blocks', n:3, pairs:[[1,2]], ans:4}, [4], 'числата 1, 2 и 3 едно до друго, така че 1 и 2 да са винаги съседни']
  ]);
  paperCheck('Пролет 2025', 'mbg-spring-2025-2', '11, 5, 0, 1, 20, 15, 24, 22, 18, 60, 1, 25, 12, 6, 20, 6, 5, 3, 1, 4', [
    [1,  99,  {kind:'brackets', shape:5, a:111, b:89, c:22, d:100, ans:11}, [11], '111 − (111 − 89) + 22 − 100'],
    [2,  129, {kind:'repadd', shape:0, x:3, k:4, y:5, m:5, m2:4, ans:5}, [5], '3 + 3 + 3 + 3 − 3 · 4 + 5 + 5 + 5 + 5 + 5 − 5 · 4'],
    [3,  130, {kind:'mulbr', shape:0, n:11, v:[1,2,3], w:[1,2,3], P:6, p:6, traps:[6], ans:0}, [0], '(11 − 10) · (11 − 9) · (11 − 8) − 1 · 2 · 3'],
    [4,  130, {kind:'mulbr', shape:1, a:2, b:5, X:10, D:5, c:20, d:5, e:1, traps:[3], ans:1}, [1], '(2 · 0 + 2 · 5) : (20 : 2 − 5) − 1'],
    [5,  132, {kind:'countx', form:0, a:50, b:10, c:2, N:30, rel:0, traps:[70], ans:20}, [20], 'Колко са двуцифрените числа, които са по-малки от числото, равно на 50 − 10 · 2'],
    [6,  131, {kind:'prodof', shape:0, odd:true, n:6, list:[1,3,5], traps:[9], ans:15}, [15], 'произведението на всички нечетни числа, по-малки от 6'],
    [7,  133, {kind:'timesw', shape:0, k:2, a:16, b:8, fewer:true, traps:[18], ans:24}, [24], 'играят 16 момичета и 2 пъти по-малко момчета. Колко общо са децата'],
    [8,  134, {kind:'asmany', evenFirst:true, n:11, s:12, E:5, traps:[21], ans:22}, [22], 'Четните числа от 1 до 11 са толкова, колкото нечетните числа от 12 до четното число X. Кое е числото X'],
    [9,  133, {kind:'timesw', shape:1, n:7, u:9, W:63, m:2, traps:[9], ans:18}, [18], '7 еднакви кубчета тежат 63 грама. Колко грама тежат 2 от тези кубчета'],
    [10, 135, {kind:'grow', shape:'times', odd:true, k:3, down:true, xs:[15,18,27,28], ys:[5,18,9,28], traps:[], ans:60}, [60], 'Всяко от нечетните събираеми в сбора 15 + 18 + 27 + 28 е намалено 3 пъти'],
    [11, 40,  {kind:'seg', shape:'units', ab:41, cm:2, cd:39, traps:[82], ans:1}, [1], 'Намерете в дециметри дължината на отсечката AD, ако AB = 41 мм, BC = 2 см и CD = 39 мм'],
    [12, 137, {kind:'cutsq', s:4, sq:true, W:20, H:20, traps:[], ans:25}, [25], 'Колко най-много квадратчета със страна 4 см можем да изрежем от квадрат със страна 20 см'],
    [13, 138, {kind:'thread', from:0, to:1, a:9, b:5, L:36, traps:[9], ans:12}, [12], 'От конец направили квадрат със страна 9 см. След това със същия конец направили триъгълник с равни страни', ['from', 'to', 'a']],
    [14, 101, {kind:'paintrow', fig:1, c:3, traps:[12], ans:6}, [6], 'Фигурата на чертежа е съставена от 3 правоъгълника. Трябва да ги оцветим в бяло, зелено и червено'],
    [15, 139, {kind:'diag', w:9, h:6, one:false, ac:12, both:2, traps:[24], ans:20}, [20], 'Правоъгълник ABCD е със страни 9 см и 6 см и е разделен на квадрати със страна 1 см. Колко от тези квадрати са разделени от отсечките AC и BD на две части'],
    [16, 133, {kind:'timesw', shape:2, k:2, x:16, p:8, d:2, c:10, traps:[8], ans:6}, [6], 'Никола има 16 молива. Пиер има два пъти по-малко моливи, отколкото има Никола, а Клод има с 2 молива повече, отколкото Пиер'],
    [17, 129, {kind:'repadd', shape:1, a:2, n:8, r:1, b:3, T:16, traps:[8], ans:5}, [5], '2 + 2 + … + 2 (8 събираеми 2) = 1 + 3 + 3 + … + 3'],
    [18, 133, {kind:'timesw', shape:3, k:3, x:6, T:24, m:8, traps:[9/8], ans:3}, [3], 'набрали 6 кг ябълки, а от друго — 3 пъти повече. Набраните ябълки разпределили поравно в 8 щайги'],
    [19, 140, {kind:'ineqsum', S:12, k:5, odd:true, traps:[3], ans:1}, [1], 'a + b + c = 12 и a > 5 > b > c'],
    [20, 136, {kind:'prodof', shape:1, N:24, sum:false, traps:[12], ans:4}, [4], 'Произведението на 3 различни естествени числа е 24. Колко най-малко може да бъде най-голямото сред тези числа']
  ]);
  { // the Пролет 2025 kinds, each worked out another way
    const Q3 = APP;
    for(let i = 0; i < 400; i++){
      const t = Q3.raw(141); if(t.ans !== (t.div ? t.a*t.b / t.a : t.a*t.b) || t.a < 2 || t.a > 10 || t.b < 2 || t.b > 10) throw new Error('times: ' + JSON.stringify(t));
      const r = Q3.raw(129);
      if(r.shape === 1){ if(r.a*r.n !== r.r + r.ans*r.b) throw new Error('repadd *: ' + JSON.stringify(r)); }
      else if(r.x*r.k - r.x*r.k + r.y*r.m - r.y*r.m2 !== r.ans) throw new Error('repadd: ' + JSON.stringify(r));
      const m = Q3.raw(130), E = m.shape === 0 ? m.v.map(x => '(' + m.n + '-' + (m.n - x) + ')').join('*') + '-' + m.w.join('*') : '(' + m.a + '*0+' + m.a + '*' + m.b + ')/(' + m.c + '/' + m.a + '-' + m.d + ')-' + m.e;
      if(eval(E) !== m.ans || m.ans < 0) throw new Error('mulbr: ' + E + ' ' + JSON.stringify(m));
      const p = Q3.raw(131); let pr = 1; for(let v = 1; v < p.n; v++) if(!p.odd || v % 2) pr *= v; if(pr !== p.ans) throw new Error('prodof: ' + JSON.stringify(p));
      const c = Q3.raw(132), N = eval(c.form === 0 ? c.a + '-' + c.b + '*' + c.c : c.form === 1 ? c.b + '*' + c.c + '+' + c.a / 10 : c.a + '+' + c.b + '*' + c.c);
      let cnt = 0; for(let v = 10; v <= 99; v++) if(c.rel === 0 ? v < N : c.rel === 1 ? v <= N : v > N) cnt++;
      if(cnt !== c.ans) throw new Error('countx: ' + JSON.stringify(c));
      const w = Q3.raw(133), wa = [w.fewer ? w.a + w.a / w.k : w.a + w.a*w.k, w.W / w.n*w.m, w.x - (w.x / w.k + w.d), (w.x + w.k*w.x) / w.m][w.shape];
      if(wa !== w.ans || !Number.isInteger(wa)) throw new Error('timesw: ' + JSON.stringify(w));
      const a = Q3.raw(134); let ev = 0; for(let v = 1; v <= a.n; v++) if((v % 2 === 0) === a.evenFirst) ev++;
      const X = []; for(let x = a.s; x < a.s + 60; x++){ if((x % 2 === 0) !== a.evenFirst) continue; let od = 0; for(let v = a.s; v <= x; v++) if((v % 2 === 0) !== a.evenFirst) od++; if(od === ev) X.push(x); }
      if(X.length !== 1 || X[0] !== a.ans) throw new Error('asmany: ' + X + ' ' + JSON.stringify(a));
      const g = Q3.raw(135); if(g.xs.map(v => (v % 2 === 1) === g.odd ? (g.down ? v / g.k : v*g.k) : v).reduce((t, v) => t + v, 0) !== g.ans) throw new Error('grow times: ' + JSON.stringify(g));
      const d = Q3.raw(136); let best = Infinity; for(let x = 1; x <= d.N; x++) for(let y = x + 1; y <= d.N; y++) for(let z = y + 1; z <= d.N; z++) if(x*y*z === d.N) best = Math.min(best, d.sum ? x + y + z : z);
      if(best !== d.ans) throw new Error('prod3: ' + JSON.stringify(d));
      const k = Q3.raw(137); let fit = 0; for(let x = 0; x + k.s <= k.W; x += k.s) for(let y = 0; y + k.s <= k.H; y += k.s) fit++; if(fit !== k.ans) throw new Error('cutsq: ' + JSON.stringify(k));
      const th = Q3.raw(138), L = th.from === 2 ? 2*(th.a + th.b) : [4, 3][th.from]*th.a; if(L / [4, 3][th.to] !== th.ans || !Number.isInteger(th.ans)) throw new Error('thread: ' + JSON.stringify(th));
      const q = Q3.raw(140); const cs = new Set(); for(let cc = 0; cc < 30; cc++) for(let b = 0; b < 30; b++){ const aa = q.S - b - cc; if(aa > q.k && q.k > b && b > cc && (cc % 2 === 1) === q.odd) cs.add(cc); }
      if(cs.size !== 1 || !cs.has(q.ans)) throw new Error('ineqsum: ' + [...cs] + ' ' + JSON.stringify(q));
    }
    for(let i = 0; i < 60; i++){   // the diagonals walked in tiny steps, each step marking the square it is inside
      const q = Q3.raw(139), hit = [{}, {}];
      [0, 1].forEach(f => { for(let s = 1; s < 20000; s++){ const x = q.w*s/20000, y = f ? q.h - q.h*x/q.w : q.h*x/q.w;
        if(Math.abs(x - Math.round(x)) < 1e-7 || Math.abs(y - Math.round(y)) < 1e-7) continue; hit[f][Math.floor(x) + ',' + Math.floor(y)] = 1; } });
      const cells = new Set([...Object.keys(hit[0]), ...Object.keys(hit[1])]), two = [...cells].filter(c => !hit[0][c] !== !hit[1][c]).length;
      if((q.one ? Object.keys(hit[0]).length : two) !== q.ans) throw new Error('diag: ' + JSON.stringify(q));
    }
    console.log('Пролет 2025 kinds: the table, products, brackets, bounds, shares, runs, threads and the diagonals worked out again by brute force');
  }
  { // the Коледно 2024 and Есен 2019 kinds, each worked out another way
    const Q2 = APP;
    for(let i = 0; i < 400; i++){
      const v = Q2.raw(123), F = Q2.VTRI[v.f], P = F.pts, segs = F.lines.map(l => [P[l[0]], P[l[l.length - 1]]]);
      const onSeg = (p, [a, b]) => (b[0] - a[0])*(p[1] - a[1]) === (b[1] - a[1])*(p[0] - a[0]) && Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);
      const drawn = (p, r) => segs.some(sg => onSeg(p, sg) && onSeg(r, sg)), names = Object.keys(P).filter(n => n !== v.V);
      let tri = 0;
      for(let x = 0; x < names.length; x++) for(let y = x + 1; y < names.length; y++){
        const A = P[v.V], B = P[names[x]], C = P[names[y]];
        if((B[0] - A[0])*(C[1] - A[1]) !== (B[1] - A[1])*(C[0] - A[0]) && drawn(A, B) && drawn(A, C) && drawn(B, C)) tri++;
      }
      if(tri !== v.ans) throw new Error('vtri: ' + tri + ' by the drawn segments, ' + v.ans + ' said ' + JSON.stringify(v));
      let n = Q2.raw(124); while(n.shape === 'one') n = Q2.raw(124);   // the whole base found again from what is shown, by trying every value (the single pyramid has its own check)
      let found = 0;
      for(let b3 = 0; b3 <= 30; b3++) for(let b4 = 0; b4 <= 30; b4++){
        const b = [n.b[0], n.b[1], n.b[2], b3, b4], r1 = b.slice(1).map((x, k) => b[k] + x), r2 = r1.slice(1).map((x, k) => r1[k] + x);
        if(r1[0] !== n.r1[0] || r1[2] !== n.r1[2] || r2[2] !== n.r2[2]) continue;
        found++;
        const top = r2[0] + 2*r2[1] + r2[2], bot = b3 + 2*b4 + n.z;
        if([top, bot, top - bot][n.asks] !== n.ans) throw new Error('numpyr: ' + JSON.stringify(n));
      }
      if(found !== 1) throw new Error('numpyr: the shown boxes allow ' + found + ' bases ' + JSON.stringify(n));
      const g = Q2.raw(125); let ages = 0;   // every brother's age tried against the three facts
      for(let B = 0; B < 60; B++){ const A = B + g.b, M = A + g.g; if((g.older ? g.F - M : M - g.F) === g.m && (g.asksAni ? A : B) === g.ans) ages++; }
      if(ages !== 1) throw new Error('ages: ' + JSON.stringify(g));
      const G = Q2.raw(126), len = G.who.flat().reduce((t, k, j) => t + k*G.len[j % 3], 0), green = G.who.reduce((t, w) => t + w[0], 0)*G.len[0], red = G.who.reduce((t, w) => t + w[2], 0)*G.len[2];
      if([len / 10, green / 4, red / 2 / 10, (len / 10 - 3*G.L) / 3][G.shape] !== G.ans || !Number.isInteger(G.ans) || G.ans < 1) throw new Error('garland: ' + JSON.stringify(G));
      const d = Q2.raw(127); let ways = 0; for(let x = 1; x <= 6; x++) for(let y = 1; y <= 6; y++) if(x + y === d.S) ways++;
      if(d.ans !== ways - (d.more ? 1 : 0) || d.x + d.y !== d.S) throw new Error('dice: ' + JSON.stringify(d));
      let t = Q2.raw(128); while(t.shape === 3) t = Q2.raw(128); let base = -1; for(let b = 1; b < 60; b++) if(2*t.leg + b + 2*t.leg + b + t.d === t.T) base = b;
      if(t.T % 10 || (t.short ? base : base + t.d) !== t.ans) throw new Error('two triangles: ' + JSON.stringify(t));
    }
    for(let i = 0; i < 3000; i++){   // the new shapes of older levels
      const m = Q2.raw(i % 2 ? 11 : 198); if(m.shape === 'sym'){ const fit = []; for(let v = 0; v < 100; v++) if(m.Y + v < m.T && m.a + m.b - m.c === m.Y) fit.push(v); if((m.most ? Math.max(...fit) : fit.length === 1 && fit[0]) !== m.ans || (!m.most && fit.length !== 1)) throw new Error('box sym: ' + JSON.stringify(m)); }
      const tm = Q2.raw(30); if(tm.shape === 3 && tm.list.filter(([a, op, b]) => op === '−' && (tm.mins ? a : b) > tm.k).length !== tm.ans) throw new Error('term: ' + JSON.stringify(tm));
      const br = Q2.raw(99); if(br.shape === 4 && eval('(' + br.a + '+' + br.b + ')+(' + br.c + '-' + br.d + ')-(' + br.e + '+' + br.f + '-' + br.g + ')') !== br.ans) throw new Error('brackets: ' + JSON.stringify(br));
      const dg = Q2.raw(18); if(dg.shape === 4 && dg.list.filter(v => (dg.ones ? v % 10 - Math.floor(v / 10) : Math.floor(v / 10) - v % 10) >= dg.k).length !== dg.ans) throw new Error('digit gap: ' + JSON.stringify(dg));
    }
    console.log('Коледно 2024 and Есен 2019 kinds: triangles at a corner against the drawn segments, pyramids and ages found again by search, garlands, dice and two triangles recounted');
  }
  { // the Коледно 2023 and 2022 kinds, each worked out another way
    const Q3 = APP;
    const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
    for(let i = 0; i < 300; i++){
      // 142: triangles and squares found again from the drawn segments and the coordinates alone
      const v = Q3.raw(142), F = Q3.FIGS[v.f], P = Object.values(F.pts), segs = F.lines.map(l => [F.pts[l[0]], F.pts[l[l.length - 1]]]);
      const onSeg = (p, [a, b]) => (b[0] - a[0])*(p[1] - a[1]) === (b[1] - a[1])*(p[0] - a[0]) && Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);
      const drawn = (p, r) => segs.some(sg => onSeg(p, sg) && onSeg(r, sg));
      let tri = 0, sq = 0;
      for(let a = 0; a < P.length; a++) for(let b = a + 1; b < P.length; b++) for(let c = b + 1; c < P.length; c++)
        if((P[b][0] - P[a][0])*(P[c][1] - P[a][1]) !== (P[b][1] - P[a][1])*(P[c][0] - P[a][0]) && drawn(P[a], P[b]) && drawn(P[b], P[c]) && drawn(P[a], P[c])) tri++;
      // a square from a corner and a side vector: the other two corners are the side turned by a right angle
      const at = (x, y) => P.find(p => p[0] === x && p[1] === y), seen = new Set();
      P.forEach(A => P.forEach(B => { if(A === B) return; const dx = B[0] - A[0], dy = B[1] - A[1], C = at(B[0] - dy, B[1] + dx), D = at(A[0] - dy, A[1] + dx);
        if(C && D && drawn(A, B) && drawn(B, C) && drawn(C, D) && drawn(D, A)) seen.add([A, B, C, D].map(p => p.join()).sort().join('|')); }));
      sq = seen.size;
      if(tri !== v.tri || sq !== v.sq || [tri, sq, tri - sq][v.asks] !== v.ans) fail('figure count: ' + tri + '/' + sq, v);
      const c = Q3.raw(143), each = c.n.reduce((t, k, j) => t + k*Q3.CORNER_FIGS[j][4], 0);
      if([2*each, each, each][c.asks] !== c.ans) fail('corners', c);
      // 144: the films as sets, the shared ones kept once
      const f = Q3.raw(144), films = new Set(); for(let k = 0; k < f.f; k++) films.add('F' + k);
      for(let k = 0; k < f.m; k++) films.add('M' + k); films.add('F0');                        // the mother: one of the father's and her own
      for(let k = 0; k < f.x; k++) films.add('B' + k); films.add('F0'); films.add(f.f > 1 ? 'F1' : 'M0');   // with both, alone, with one parent
      if(films.size !== f.ans) fail('films', f);
      // 145: the minutes walked through one by one
      const r = Q3.raw(145); let t = 0; for(let g = 0; g < r.g; g++){ if(g) t += r.r; t += r.n*r.t; }
      if(t !== r.ans) fail('rests', r);
      // 146: the toys made day by day until the total
      const y = Q3.raw(146); let made = 0, d = 0; while(made < y.T){ made += y.a + d; d++; }
      const boxes = y.T / y.m, sold = boxes - 1 - y.f;
      if(made !== y.T || [d, -1, boxes, y.p1 + (sold - 1)*y.p2][y.shape] !== (y.shape === 1 ? -1 : y.ans)) fail('toys', y);
      if(y.shape === 1 && y.options[y.pick].text[0] !== ['понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота', 'неделя'][(y.day0 + d - 1) % 7]) fail('toys weekday', y);
      // 147: every statement checked, exactly one false
      const n = Q3.raw(147), val = {A: n.x + n.y, B: n.p - n.r, C: n.C}, ok = s => { const [l, op, rr] = s.split(' '); return op === '<' ? val[l] < val[rr] : val[l] > val[rr]; };
      if(n.options.filter(o => !ok(o.text[0])).length !== 1 || ok(n.options[n.pick].text[0])) fail('notrue', n);
      const b = Q3.raw(148); let left = b.M; for(let k = 0; k < b.k; k++) left -= b.p; if(left !== b.ans || left < 1) fail('buyleft', b);
      // 149: the clock stepped minute by minute up to the full hour (or the one after)
      const k = Q3.raw(149); let hh = k.h, mm = k.m, steps = 0, goal = (k.h + (k.two ? 2 : 1)) % 24;
      while(!(hh === goal && mm === 0)){ mm++; steps++; if(mm === 60){ mm = 0; hh = (hh + 1) % 24; } }
      if(steps !== k.ans) fail('clockmin', k);
      const s = Q3.raw(150), both = []; for(let x = 10; x < s.N; x++) if(x % 10 === s.u && [s.s, s.s + 1].includes(Math.floor(x / 10) + x % 10)) both.push(x);
      if(both.join() !== [s.ans].concat(s.alt).join()) fail('bothseq', s);
      // 151: a real calendar, both ends counted (2023 has no 29 February)
      const ds = Q3.raw(151), mi = ['януари','февруари','март','април','май','юни','юли','август','септември','октомври','ноември','декември'];
      const m1 = mi.indexOf(Q3.SPAN_MONTHS[ds.i][0]), m2 = mi.indexOf(Q3.SPAN_MONTHS[ds.j][0]);
      const days = Math.round((Date.UTC(2023, m2, ds.d2) - Date.UTC(2023, m1, ds.d1)) / 86400000) + 1;
      if(days !== ds.days || (ds.asksDays ? days : days*ds.k) !== ds.ans) fail('datespan ' + days, ds);
      // 152: every B tried
      const a = Q3.raw(152), Bs = []; for(let B = 0; B < 100; B++) if(B > 2*a.A + a.d && B < a.L && B % 2 === 0) Bs.push(B);
      if(Bs.length !== 1 || Bs[0] / 2 !== a.ans) fail('named pair', a);
      // 153: every rectangle tried — four sides a, b, a, b, one of them the sum of two others
      const q = Q3.raw(153), rects = [];
      for(let x = q.lo + 1; x <= q.hi; x++) for(let z = x; z <= q.hi; z++){ const S = [x, z, x, z];
        if(S.some((u, j) => S.some((w, l) => S.some((e, m) => j !== l && l !== m && j !== m && u === w + e)))) rects.push([x, z]); }
      if(rects.length !== 1 || (q.asksP ? 2*(rects[0][0] + rects[0][1]) : (rects[0][0] + rects[0][1]) / 2) !== q.ans) fail('sqrect', q);
      // 154: the legs in minutes, then the clock
      const L = Q3.raw(154), back = L.start + 2*(L.F / L.fk)*L.fm + L.R / 2 + L.L*60 / L.sk + L.rest;
      if(back !== L.back || (L.shape === 3 && L.options[L.pick].text[0] !== Math.floor(back / 60) + ':' + String(back % 60).padStart(2, '0'))) fail('liftday', L);
      // 124, the single pyramid: the base found again from the five shown boxes by trying every value
      const pq = Q3.raw(124);
      if(pq.shape === 'one' && i < 40){
        const sh = Q3.PYR_SHOWN.map(([rr, cc]) => pq.rows[rr][cc]); let found = 0;
        for(let b0 = 0; b0 <= 40; b0++) for(let b1 = 0; b1 <= 40; b1++) for(let b2 = 0; b2 <= 40; b2++){
          const b3 = sh[4], b4 = sh[0] - (b0 + 4*b1 + 6*b2 + 4*b3);
          if(b4 < 0 || b0 + 3*b1 + 3*b2 + b3 !== sh[1] || b1 + 2*b2 + b3 !== sh[2] || b0 + b1 !== sh[3]) continue;
          found++;
          if([b0, b1, b2, b3, b4].join() !== pq.rows[4].join()) fail('pyramid', pq);
        }
        if(found !== 1) fail('pyramid: ' + found + ' bases', pq);
      }
      const br = Q3.raw(99);
      if(br.shape === 6 && Function('return ' + Q3.bracketsExpr(br).replace(/−/g, '-'))() !== br.ans) fail('brackets', br);
    }
    console.log('Коледно 2023 and 2022 kinds: figures recounted from the segments, films as sets, the clock and the calendar stepped through, rectangles and pyramids found again by search');
  }
  // Децата в кръг: the solution's ring holds one dot per child between the boys, plus the two boys
  for(let l = 1; l <= 9; l++) for(let r = 1; r <= 9; r++){
    const svg = ringSvg({kind:'ring', l, r, ans:l + r + 2}, true), dots = (svg.match(/<circle/g) || []).length - 1;
    if(dots !== l + r + 2) throw new Error('the ring for ' + l + ' and ' + r + ' draws ' + dots + ' children, not ' + (l + r + 2));
  }
  for(let i = 0; i < 300; i++){   // the Зима 2020 kinds, counted out
    const e = Q.raw(110), sum = e.first ? e.X + e.y : e.y + e.X, from = String(e.X).replace(String(e.ans), '');
    if(sum !== e.S || !(String(e.shown) === from || String(e.X).split('').some((_, k) => String(e.X).slice(0, k) + String(e.X).slice(k + 1) === String(e.shown)))) throw new Error('erasedig: ' + JSON.stringify(e));
    const r = Q.raw(111); if(r.N - r.ans + 1 !== r.M) throw new Error('replaced: ' + JSON.stringify(r));
    const t = Q.raw(113); let tri = 0; const P = t.dots; for(let a = 0; a < P.length; a++) for(let b = a + 1; b < P.length; b++) for(let c = b + 1; c < P.length; c++) if((P[b][0] - P[a][0])*(P[c][1] - P[a][1]) !== (P[b][1] - P[a][1])*(P[c][0] - P[a][0])) tri++;
    if(tri !== t.ans) throw new Error('tripts: ' + JSON.stringify(t));
    const b = Q.raw(114); let ways = 0, x3 = -1; for(let x = 0; x <= b.n; x++) if(x*b.a + (b.n - x)*b.b === b.T){ ways++; x3 = x; }
    if(ways !== 1 || (b.asksSmall ? x3 : b.n - x3) !== b.ans) throw new Error('bouquets: ' + JSON.stringify(b));
    const l = Q.raw(117); let best = 999; for(let i = 0; i < l.s.length; i++) for(let j = i + 1; j < l.s.length; j++) for(let k = j + 1; k < l.s.length; k++) if(l.s[i] !== '0') best = Math.min(best, +(l.s[i] + l.s[j] + l.s[k]));
    if(best !== l.ans) throw new Error('least3: ' + JSON.stringify(l));
    const n = Q.raw(118); let most = 0; (function walk(i, left, top){ if(i === n.k){ if(left === 0) most = Math.max(most, top); return; } for(let v = n.m + 1; v <= left; v++) walk(i + 1, left - v, Math.max(top, v)); })(0, n.T, 0);
    if(most !== n.ans) throw new Error('nuts: ' + JSON.stringify(n));
  }
  // the new kinds by brute force: a magic square's wrong cell, and colourings counted one by one
  for(let i = 0; i < 400; i++){
    const m = Q.raw(100), sums = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].map(l => l.reduce((t, j) => t + m.g[j], 0));
    if(sums.some(v => v !== m.S)) throw new Error('magic: not a magic square ' + JSON.stringify(m));
    const fixes = []; for(let at = 0; at < 9; at++) for(let v = 0; v <= 60; v++){ const g = m.shown.slice(); g[at] = v; if([[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].every(l => l.reduce((t, j) => t + g[j], 0) === m.S) && v !== m.shown[at]) fixes.push(v); }
    if(fixes.length !== 1 || fixes[0] !== m.ans) throw new Error('magic: the fix is not unique ' + JSON.stringify(m) + ' ' + fixes);
    const p = Q.raw(101); let ways = 0;
    if(p.fig){ for(let x = 0; x < p.c; x++) for(let y = 0; y < p.c; y++) for(let z = 0; z < p.c; z++) if(x !== y && y !== z && x !== z) ways++; }   // Пролет 2025: all three touch
    else (function walk(i, prev){ if(i === p.n){ ways++; return; } for(let c = 0; c < p.c; c++) if(c !== prev) walk(i + 1, c); })(0, -1);
    if(ways !== p.ans) throw new Error('paintrow: ' + ways + ' ways, not ' + p.ans);
  }
}
