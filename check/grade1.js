// Runs beside the app (in check.js's own scope, through eval), like check/papers.js.
// The 1st-grade papers, МБГ Пролет 2023 and 2025: each printed task against the official key, drawn as
// printed and met by its level's own generator, and the new kinds worked out again by brute force.

{ // the kinds sides, eqcross, digeq, crossmin, digperm, cards3
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, answers, accepts, LEVELS }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), chain = (...xs) => xs.map((x, i) => i ? T(x < 0 ? '−' : '+', Math.abs(x)) : T('', x));
  const pin = (name, id, q, key, shows) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    const want = JSON.stringify(q);
    for(let n = 0; n < 300000; n++) if(JSON.stringify(Q.raw(id)) === want) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Пролет 2023 task 3', 157, {kind:'sides', shape:'diff', sym:'□', left:chain(2, 0, 2, 3), right:chain(2, 2, 2, 2), minus:true, VL:7, VR:8, ans:1}, [1], '2 + 0 + 2 + 3 = 2 + 2 + 2 + 2 − □');
  pin('Пролет 2025 task 3', 157, {kind:'sides', shape:'same', sym:'☺', left:chain(2, 0, -2, 4), right:chain(2, 0, -2, 5), minus:true, VL:4, VR:5, ans:1}, [1], '2 + 0 − 2 + 4 = 2 + 0 − 2 + 5 − ☺');
  pin('Пролет 2023 task 4', 158, {kind:'eqcross', a:7, s:4, b:11, c:10, dot:6, ask:'minus', ans:2}, [2], '● − ■');
  pin('Пролет 2025 task 4', 158, {kind:'eqcross', a:9, s:2, b:11, c:10, dot:8, ask:'minus', ans:6}, [6], '● − ■');
  pin('Пролет 2025 task 7', 165, {kind:'digeq', f:0, e:'1■ + 2 = 20 − ■', near:3, traps:[3, 6, 2], ans:4}, [4], '1■ + 2 = 20 − ■');
  pin('Пролет 2025 task 15', 165, {kind:'digeq', f:1, e:'■0 − 1■ = 3■', near:4, traps:[4, 7, 3], ans:5}, [5], '■0 − 1■ = 3■');
  pin('Пролет 2023 task 14', 166, {kind:'crossmin', x:19, y:23, least:true, best:21, traps:[1, 9, 2], ans:3}, [3], 'зачеркнем в 19 + 23');
  pin('Пролет 2023 task 6', 167, {kind:'digperm', ds:[0, 1, 3], nums:[10, 13, 30, 31], ans:84}, [84], '0, 1, 3');
  pin('Пролет 2023 task 19', 173, {kind:'cards3', cs:[1, 2, 2], sums:[14, 23], slots:2, ans:14, alt:[23]}, [14, 23], 'цифрите 1, 2 и 2');
  if(!Q.accepts({kind:'cards3', slots:2, ans:14, alt:[23]}, ['23', '14'])) throw new Error('cards3: the sums in the other order are not accepted');

  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const walk = ts => ts.reduce((v, t) => t.op === '−' ? v - t.n : v + t.n, 0);
  for(let i = 0; i < 3000; i++){
    // 157: every box value tried against the two sides
    // (the shapes 'one' and 'tens', from Пролет 2022 and 2021, are worked out in check/grade1b-C.js)
    const s = Q.raw(157), L = s.left && walk(s.left), R = s.right && walk(s.right), fits = [];
    for(let v = 0; v <= 30; v++) if(L === (s.minus ? R - v : R + v)) fits.push(v);
    if((s.shape === 'same' || s.shape === 'diff') && (fits.length !== 1 || fits[0] !== s.ans || s.ans > 9 || R > 20)) fail('sides:', s);
    // 158: ■ and ● searched for in the two equalities
    const c = Q.raw(158); let sq = -1; for(let v = 0; v <= 20; v++) if(c.a + v === c.b) sq = v;
    let dot = -1; for(let v = 0; v <= 20; v++) if(c.c - sq === v) dot = v;
    if([dot - sq, dot + sq, dot, dot + dot - sq][['minus', 'plus', 'dot', 'twice'].indexOf(c.ask)] !== c.ans || c.ans < 0 || c.b > 20) fail('eqcross:', c);
    // 165: every digit put in by text and the equality evaluated
    const d = Q.raw(165), ok = [];
    for(let v = 0; v <= 9; v++){ const e = d.e.replace(/■/g, v); if(/(^| )0\d/.test(e)) continue; const [l, r] = e.split(' = ').map(x => eval(x.replace(/−/g, '-'))); if(l === r) ok.push(v); }
    if(ok.length !== 1 || ok[0] !== d.ans) fail('digeq: ' + ok, d);
    // 166: every digit crossed out of the written sum
    let x = Q.raw(166); while(x.shape === 'three') x = Q.raw(166);   // three numbers: check/grade1b-C.js
    const w = String(x.x) + String(x.y), sums = [...w].map((_, k) => { const t = w.slice(0, k) + w.slice(k + 1); return k < 2 ? +t.slice(0, 1) + +t.slice(1) : +t.slice(0, 2) + +t.slice(2); });
    const best = x.least ? Math.min(...sums) : Math.max(...sums);
    if(sums.filter(v => v === best).length !== 1 || +w[sums.indexOf(best)] !== x.ans || new Set(w).size !== 4) fail('crossmin:', x);
    // 167: every two-digit number tested for its digits
    let p = Q.raw(167); while(p.shape === 'count') p = Q.raw(167);   // the count: check/grade1b-C.js
    let S = 0; for(let v = 10; v <= 99; v++){ const a = Math.floor(v / 10), b = v % 10; if(a !== b && p.ds.includes(a) && p.ds.includes(b)) S += v; }
    if(S !== p.ans) fail('digperm:', p);
    // 173: every order of the three cards, split after the first or the second
    const k = Q.raw(173), seen = new Set(), perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
    perms.forEach(([a, b, e]) => { const C = k.cs; if(C[b]) seen.add(C[a] + 10*C[b] + C[e]); });
    const all = [...seen].sort((u, v) => u - v);
    if(all.join() !== [k.ans].concat(k.alt).join() || k.slots !== all.length) fail('cards3: ' + all, k);
  }
  console.log('МБГ Пролет 2023 and 2025, 1 клас: Пролет 2023 tasks 3, 4, 6, 14, 19 and Пролет 2025 tasks 3, 4, 7, 15 asked exactly as printed; sides, the cross, the hidden digit, the crossed digit, the digit numbers and the cards worked out again by brute force');
}

{ // the 1st-grade levels on older kinds: each printed task, its answer, its drawing, and its level asking it exactly
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, answers, accepts, LEVELS, DAYS }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), ex = s => s.split(' ').reduce((a, w, i, ws) => i % 2 ? a : a.concat(T(i ? ws[i - 1] : '', +w)), []);
  const pin = (name, id, q, key, shows, tries = 300000) => {   // a short chain is one of very many, and cheap: it gets more tries
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(name.includes('2023') ? 'mbg-spring-2023-1' : 'mbg-spring-2025-1')) throw new Error('level ' + id + ' is not tagged ' + name);
    const want = JSON.stringify(q);
    for(let n = 0; n < tries; n++) if(JSON.stringify(Q.raw(id)) === want) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Пролет 2025 task 1', 155, {kind:'chain', terms: ex('2 − 0 − 2 + 5'), paired:0, ans:5}, [5], '2 − 0 − 2 + 5', 3e6);
  pin('Пролет 2025 task 2', 155, {kind:'chain', terms: ex('20 − 2 − 5'), paired:0, ans:13}, [13], '20 − 2 − 5', 3e6);
  pin('Пролет 2023 task 1', 155, {kind:'chain', terms: ex('2 − 0 − 2 + 3'), paired:0, ans:3}, [3], '2 − 0 − 2 + 3', 3e6);
  pin('Пролет 2023 task 2', 156, {kind:'pairs', shape:'ones', pairs:[[1,0],[2,1],[3,2]], terms: ex('1 − 0 + 2 − 1 + 3 − 2'), ans:3}, [3], '1 − 0 + 2 − 1 + 3 − 2');
  pin('Пролет 2023 task 5', 156, {kind:'pairs', shape:'over', k:3, b:14, cut:24, terms: ex('11 − 1 + 12 − 2 + 13 − 3 + 14 − 24'), ans:20}, [20], '11 − 1 + 12 − 2 + 13 − 3 + 14 − 24');
  pin('Пролет 2023 task 7', 156, {kind:'pairs', shape:'tens', base:20, terms: ex('1 + 19 + 2 + 18 + 3 + 17 + 4 + 16 − 80'), paired:4, extra:0, subs:[80], ans:0}, [0], '1 + 19 + 2 + 18 + 3 + 17 + 4 + 16 − 80');
  pin('Пролет 2025 task 5', 156, {kind:'pairs', shape:'updown', n:6, terms: ex('1 + 2 + 3 + 4 + 5 + 6 − 5 − 4 − 3 − 2 − 1'), ans:6}, [6], '1 + 2 + 3 + 4 + 5 + 6 − 5 − 4 − 3 − 2 − 1');
  pin('Пролет 2025 task 6', 175, {kind:'ineq', shape:6, form:0, A:10, L:12, traps:[1], ans:2}, [2], '10 + ■ < 12');
  pin('Пролет 2025 task 8', 159, {kind:'named', shape:7, a:1, b:0, sum:true, traps:[], ans:19}, [19], 'сбора на най-голямото едноцифрено число и най-малкото двуцифрено число');
  pin('Пролет 2023 task 8', 159, {kind:'named', shape:7, a:0, b:0, sum:true, traps:[11], ans:10}, [10], 'сбора на най-малкото едноцифрено число и най-малкото двуцифрено число');
  pin('Пролет 2025 task 10', 164, {kind:'count', shape:6, one:true, sum:true, natural:false, two:false, a:7, lo:7, hi:9, ans:24}, [24], 'едноцифрени числа, които НЕ са по-малки от 7');
  pin('Пролет 2023 task 15', 164, {kind:'count', shape:0, sum:false, natural:false, two:false, n:14, lo:0, hi:14, ans:15}, [15], 'числа, които не са по-големи от 14');
  pin('Пролет 2025 task 12', 163, {kind:'seg', shape:'cb', p:5, q:3, r:7, AD:15, traps:[10, 12], ans:3}, [3], 'AD = 15 см AC = 5 см BD = 7 см');
  pin('Пролет 2023 task 13', 163, {kind:'seg', mm:true, p:4, q:2, r:7, AB:6, CD:9, ans:13}, [13], 'AB = 6 мм CD = 9 мм CB = 2 мм');
  pin('Пролет 2025 task 18', 178, {kind:'dice', S:6, x:4, y:2, more:true, n:5, traps:[2], ans:4}, [4], 'числото 4 , а на другия — 2');
  pin('Пролет 2025 task 20', 171, {kind:'weekday', shape:'bound', n:20, most:false, day:Q.DAYS[1], ans:2, short:true}, [2], 'най-малко вторника може да има сред 20 последователни дни');
  // Пролет 2023 task 17 answers with a day, from its own four: mum on Sunday, dad 3 days on (Wednesday), mine 5 after his
  let shift = null;
  for(let n = 0; n < 300000 && !shift; n++){ const g = Q.raw(170); if(g.who === 0 && g.d0 === 6 && g.k === 3 && g.m === 5) shift = g; }
  if(!shift) throw new Error('Пролет 2023 task 17: level 170 never asks the printed question');
  if(shift.options[shift.pick].text[0] !== 'понеделник' || shift.ans !== shift.pick) throw new Error('Пролет 2023 task 17: the key says понеделник, the level ' + JSON.stringify(shift));
  if(strip(Q.drawQ(shift)).indexOf(strip('Рожденият ден на мама е в неделя, а рожденият ден на баща ми е 3 дни по-късно – в сряда. Моят рожден ден ще бъде 5 дни след')) < 0) throw new Error('Пролет 2023 task 17 is not drawn as printed: ' + strip(Q.drawQ(shift)));
  for(let i = 0; i < 2000; i++){   // the weekday counted on one day at a time; the four options all different, the right one among them
    const g = Q.raw(170); let d = g.d0;
    for(let j = 0; j < g.k + g.m; j++) d = (d + 1) % 7;
    if(Q.DAYS[d].nm !== g.options[g.pick].text[0] || new Set(g.options.map(o => o.text[0])).size !== 4) throw new Error('shift: ' + JSON.stringify(g));
  }
  console.log('МБГ Пролет 2023 and 2025, 1 клас: the tasks on older kinds match the official key and are asked exactly by their level');
}

{ // grade 1, the kinds pencil 161, rectfig 162, diagsq 168, arrows 174 — each worked out another way
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, answers, LEVELS }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // a rectangle of the figure, counted cell by cell: unit cells are labelled by the piece they belong to,
  // and a box counts when every cell in it is covered and every piece touching it lies wholly inside
  const rectsByCells = tiles => {
    const W = Math.max(...tiles.map(t => t[0] + t[2])), H = Math.max(...tiles.map(t => t[1] + t[3])), at = {};
    tiles.forEach((t, n) => { for(let x = t[0]; x < t[0] + t[2]; x++) for(let y = t[1]; y < t[1] + t[3]; y++) at[x + ',' + y] = n; });
    let c = 0;
    for(let x1 = 0; x1 < W; x1++) for(let x2 = x1 + 1; x2 <= W; x2++) for(let y1 = 0; y1 < H; y1++) for(let y2 = y1 + 1; y2 <= H; y2++){
      const inside = new Set(); let ok = true;
      for(let x = x1; x < x2 && ok; x++) for(let y = y1; y < y2 && ok; y++){ const n = at[x + ',' + y]; if(n === undefined) ok = false; else inside.add(n); }
      if(ok && [...inside].every(n => { const t = tiles[n]; return t[0] >= x1 && t[0] + t[2] <= x2 && t[1] >= y1 && t[1] + t[3] <= y2; })) c++;
    }
    return c;
  };
  const perms = []; (function p(a, r){ if(!r.length) perms.push(a); r.forEach((v, i) => p(a.concat(v), r.filter((_, j) => j !== i))); })([], [1, 2, 3, 4, 5, 6]);
  for(let i = 0; i < 2000; i++){
    const p = Q.raw(161), l1 = p.b - p.a, l2 = p.d - p.c;
    if(p.a < 0 || p.b > 15 || p.c < 0 || p.d > 15 || l1 === l2 || p.ans !== (p.long ? Math.max(l1, l2) : Math.min(l1, l2))) fail('pencil', p);
    const r = Q.raw(162); if(rectsByCells(r.tiles) !== r.ans) fail('rectfig: ' + rectsByCells(r.tiles) + ' by cells', r);
    const s = Q.raw(168); if(s.ans !== (s.side ? s.n*s.s : 4*s.n*s.s)) fail('diagsq', s);
    if(i < 300){
      const a = Q.raw(174), ok = perms.filter(v => a.edges.every(([x, y]) => v[x] > v[y]));
      const sums = new Set(ok.map(v => a.ask.reduce((t, x) => t + v[x], 0)));
      if(ok.length < 2 || sums.size !== 1 || !sums.has(a.ans)) fail('arrows: ' + ok.length + ' orders, sums ' + [...sums], a);
    }
  }
  if(rectsByCells([[0,0,1,1],[1,0,1,1],[2,0,1,1]]) !== 6) throw new Error('rectfig: the example row of three is not 6');
  // the printed tasks, solved as printed against the key, drawn as printed, and met by the level's generator
  const printed = [
    ['Пролет 2023 task 10', 161, {kind:'pencil', a:7, b:14, c:3, d:11, long:true, traps:[14], ans:8}, 8, 'Колко сантиметра е по-дългият молив'],
    ['Пролет 2025 task 11', 161, {kind:'pencil', a:7, b:14, c:3, d:11, long:false, traps:[11], ans:7}, 7, 'Колко сантиметра е по-късият молив'],
    ['Пролет 2023 task 12', 162, {kind:'rectfig', shape:'cols', tiles:[[0,0,1,2],[1,0,1,2],[2,0,1,1],[2,1,1,1]], traps:[4], ans:8}, 8, 'Колко са правоъгълниците на тази картинка'],
    ['Пролет 2025 task 13', 162, {kind:'rectfig', shape:'rows', tiles:[[0,0,1,1],[1,0,1,1],[2,0,1,1],[1,1,1,1],[2,1,1,1],[3,1,1,1]], traps:[6], ans:15}, 15, 'Колко са правоъгълниците тук'],
    ['Пролет 2023 task 11', 168, {kind:'diagsq', n:4, s:1, side:false, traps:[4, 4], ans:16}, 16, 'Защриховани са 4 еднакви квадратчета, всяко със страна 1 см. Колко сантиметра е обиколката на големия квадрат'],
    // A=0 B=1 C=2 D=3 E=4 F=5: F→E, A→D, E→D, D→C, B→A, B→F, sorted; the example is B → A
    ['Пролет 2023 task 20', 174, {kind:'arrows', edges:[[0,3],[1,0],[1,5],[3,2],[4,3],[5,4]], ask:[0,5,4], ex:1, traps:[9], ans:12}, 12, 'Например: B → A показва, че B > A'],
  ];
  printed.forEach(([name, id, q, key, shows]) => {
    if(Q.answers(q)[0] !== key) throw new Error(name + ': gives ' + Q.answers(q) + ', the key says ' + key);
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(q.kind === 'rectfig' && rectsByCells(q.tiles) !== key) throw new Error(name + ': the figure has ' + rectsByCells(q.tiles));
    if(q.kind === 'arrows'){ const ok = perms.filter(v => q.edges.every(([x, y]) => v[x] > v[y])); if(ok.some(v => q.ask.reduce((t, x) => t + v[x], 0) !== 12)) throw new Error(name + ': A + F + E is not always 12'); }
    // the generator reaches this very figure (the arrows: these very arrows, whatever the example and the order asked)
    const sig = g => q.kind === 'arrows' ? JSON.stringify(g.edges) + [...g.ask].sort() : JSON.stringify([g.a, g.b, g.c, g.d, g.long, g.tiles, g.n, g.s, g.side]);
    let met = false, n = 0;
    for(; n < 300000 && !met; n++) met = sig(Q.raw(id)) === sig(q);
    if(!met) throw new Error(name + ': level ' + id + ' never asks the printed question');
  });
  console.log('1 клас (pencils, rectangles in a figure, the diagonal squares, the arrows): brute force agrees; the printed tasks match the key and their levels ask them');
}

/* МБГ Пролет 2023 and 2025, 1 клас — the kinds symeq, picdig, tribo, between, whomore and segword: each
   printed task against the official key, drawn as printed and met by its level's own generator, then each
   kind's answers found again another way. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, answers, accepts, LEVELS, WM_GIRLS, WM_BOYS }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // [paper, task, level, the printed question, the key, a piece of the printed text, the fields that must match]
  const printed = [
    ['Пролет 2023', 9,  160, {kind:'symeq', shape:'chain', k:3, x:7, y:5, z:6, s1:21, s2:17, s3:16, ans:6}, [6], '■ + ■ + ■ = 21 ■ + ∆ + ∆ = 17 ∆ + ○ + ∆ = 16', ['shape', 'k', 'x', 'y', 'z']],
    ['Пролет 2025', 9,  160, {kind:'symeq', shape:'tri', x:2, y:3, z:5, s1:5, s2:8, s3:7, ask:2, ans:5}, [5], '■ + ∆ = 5 ∆ + ○ = 8 ■ + ○ = 7', ['shape', 'x', 'y', 'z', 'ask']],
    ['Пролет 2023', 16, 169, {kind:'tribo', t:[1,1,0,2,3,5,10,18,33], h:7, ans:18}, [18], '1, 1, 0, 2, 3, 5, 10, ★, 33', ['t', 'h']],
    ['Пролет 2023', 18, 172, {kind:'picdig', shape:'sub', f:['a','p','l'], P:1, R:2, Y:8, k1:3, k2:4, m1:15, m2:22, ans:27}, [27], '15 − 3 = 22 − 4 =', ['shape', 'P', 'R', 'Y', 'k1', 'k2']],
    ['Пролет 2025', 16, 172, {kind:'picdig', shape:'table', f:['a','p','l'], d:[1,2,3], turn:0, ans:18}, [18], '= 12 = 23 = 31', ['shape', 'd', 'turn']],
    ['Пролет 2025', 14, 176, {kind:'segword', who:0, a:12, d1:3, d2:8, short1:true, long2:true, b:9, ans:17}, [17],
      'Мария начертала три отсечки. Първата е дълга 12 см, втората е с 3 см по-къса от първата, а третата отсечка е по-дълга от втората с 8 см', ['who', 'a', 'd1', 'd2', 'short1', 'long2']],
    ['Пролет 2025', 19, 179, {kind:'between', p:5, s1:2, s2:2, lo:3, hi:7, slots:3, ans:9, alt:[10,11]}, [9, 10, 11], '5 − 2 < < < 5 + 2', ['p', 's1', 's2']]
  ];
  printed.forEach(([paper, task, id, q, key, shows, fields]) => {
    const name = paper + ' 1 клас task ' + task;
    if(Q.answers(q).slice().sort((x, y) => x - y).join() !== key.join()) fail(name + ': gives ' + Q.answers(q) + ', the key says ' + key, q);
    if(!Q.accepts(q, key.map(String)) || !Q.accepts(q, key.slice().reverse().map(String))) fail(name + ': the key is not accepted', q);
    if(strip(Q.drawQ(q)).indexOf(strip(shows)) < 0) fail(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)), q);
    const tag = 'mbg-spring-' + paper.slice(-4) + '-1';
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) fail('level ' + id + ' is not tagged ' + tag, q);
    const sig = g => fields.map(f => JSON.stringify(g[f])).join();
    let hit = false;
    for(let n = 0; n < 300000 && !hit; n++){ const g = Q.raw(id); hit = g.kind === q.kind && sig(g) === sig(q); }
    if(!hit) fail(name + ': level ' + id + ' never asks the printed question', q);
  });
  { // Пролет 2025 task 17 answers with a name and a number, from its own А/Б/В/Г
    let q = null;
    // the names are drawn at random: the numbers are matched, and the paper's names put in their place
    for(let n = 0; n < 300000 && !q; n++){ const g = Q.raw(177); if(g.boy && g.e === 3 && g.at === 0 && g.base.join() === '1,2,28') q = g; }
    if(!q) throw new Error('Пролет 2025 1 клас task 17: level 177 never asks the printed question');
    const named = t => t.split(Q.WM_GIRLS[q.g][0]).join('Лили').split(Q.WM_BOYS[q.b][0]).join('Ники');
    if(named(strip(Q.drawQ(q))).indexOf(strip('Лили пресметнала вярно 1 + 2 + 28, а Ники пресметнал вярно 3 + 1 + 2 + 28. Кой е получил по-голям сбор и с колко?')) < 0) fail('task 17 is not drawn as printed', q);
    if(named(q.options[q.pick].text[0]) !== 'Ники, с 3') fail('task 17: the right option is not «Ники, с 3», the key', q);
    if(!Q.LEVELS.find(l => l.id === 177).papers.includes('mbg-spring-2025-1')) fail('level 177 is not tagged Пролет 2025', q);
  }

  for(let i = 0; i < 2000; i++){
    // symeq: every value of each figure from 0 to 20 tried against the three lines
    let s = Q.raw(160); while(s.shape === 'def' || s.shape === 'part') s = Q.raw(160);   // those two: check/grade1b-C.js
    const fits = [];
    for(let x = 0; x <= 20; x++) for(let y = 0; y <= 20; y++) for(let z = 0; z <= 20; z++){
      const ok = s.shape === 'chain' ? s.k*x === s.s1 && x + 2*y === s.s2 && 2*y + z === s.s3 : x + y === s.s1 && y + z === s.s2 && x + z === s.s3;
      if(ok) fits.push(s.shape === 'chain' ? z : [x, y, z][s.ask]);
    }
    if(fits.length !== 1 || fits[0] !== s.ans || new Set([s.x, s.y, s.z]).size !== 3) fail('symeq: ' + fits, s);
    // picdig: every set of digits tried against what is shown
    const p = Q.raw(172), found = new Set();
    if(p.shape === 'sub'){
      for(let P = 1; P <= 9; P++) for(let R = 1; R <= 9; R++) for(let Y = 0; Y <= 9; Y++)
        if(new Set([P, R, Y]).size === 3 && 10*P + R === p.m1 - p.k1 && 10*P + Y === p.m2 - p.k2) found.add(10*R + Y - P);
    } else {
      const text = strip(Q.drawQ(p)), shown = [...text.matchAll(/=(\d+)/g)].map(m => +m[1]);
      const ask = [[1, 0, 2], [2, 1, 0], [0, 2, 1]][p.turn];
      for(let a = 1; a <= 9; a++) for(let b = 1; b <= 9; b++) for(let c = 1; c <= 9; c++){
        const d = [a, b, c];
        if(new Set(d).size === 3 && shown.join() === [10*a + b, 10*b + c, 10*c + a].join()) found.add(10*d[ask[0]] + d[ask[1]] - d[ask[2]]);
      }
    }
    if(found.size !== 1 || !found.has(p.ans) || p.ans < 0) fail('picdig: ' + [...found], p);
    // tribo: the rule holds all along, the hidden one is the asked one, and the numbers stay small
    const t = Q.raw(169);
    if(t.t.some((v, k) => k > 2 && v !== t.t[k-1] + t.t[k-2] + t.t[k-3]) || t.t[t.h] !== t.ans || t.h < 5 || t.h > t.t.length - 2 || Math.max(...t.t) > 40) fail('tribo', t);
    if((strip(Q.drawQ(t)).match(/★/g) || []).length !== 3) fail('tribo: the row does not hide exactly one number (the ask and the answer line name ★ too)', t);
    // between: every pair of numbers between the bounds, the smaller first
    const b = Q.raw(179), sums = new Set();
    for(let A = 0; A < 40; A++) for(let B = A + 1; B < 40; B++) if(b.p - b.s1 < A && B < b.p + b.s2) sums.add(A + B);
    if([...sums].sort((x, y) => x - y).join() !== [b.ans].concat(b.alt).join()) fail('between: ' + [...sums], b);
    // whomore: the two sums added up from the drawn text; exactly one option names the winner and the gap
    const w = Q.raw(177), nums = (strip(Q.drawQ(w)).match(/\d+(\+\d+)+/g) || []).map(e => e.split('+').reduce((x, y) => x + +y, 0));
    const [G, B] = nums, win = G > B ? Q.WM_GIRLS[w.g][0] : Q.WM_BOYS[w.b][0], gap = Math.abs(G - B);
    const right = w.options.filter(o => o.text[0] === win + ', ' + (gap === 7 ? 'със' : 'с') + ' ' + gap);
    if(nums.length !== 2 || G === B || right.length !== 1 || w.options[w.pick] !== right[0] || w.ans !== w.pick || new Set(w.options.map(o => o.text[0])).size !== 4) fail('whomore', w);
    // segword: the lengths followed one sentence at a time
    const g = Q.raw(176), second = g.a + (g.short1 ? -g.d1 : g.d1), third = second + (g.long2 ? g.d2 : -g.d2);
    if(third !== g.ans || second < 1 || third < 1 || second > 30 || third > 30) fail('segword', g);
  }
  console.log('МБГ Пролет 2023 and 2025 1 клас: the printed tasks 2023 9, 16, 18 and 2025 9, 14, 16, 17, 19 match the key and their levels ask them; symeq, picdig, tribo, between, whomore and segword worked out again by brute force');
}
