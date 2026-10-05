// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
// МБГ Пролет 2022 and 2021, 1 клас: the tasks on the levels widened for them, each printed task against the
// official key, drawn as printed and asked exactly by its level, and the new shapes worked out again.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), ex = s => s.split(' ').reduce((a, w, i, ws) => i % 2 ? a : a.concat(T(i ? ws[i - 1] : '', +w)), []);
  const pin = (name, id, q, key, shows, tries = 300000) => {   // a short chain is one of very many, and cheap: it gets more tries
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-spring-' + name.match(/20\d\d/)[0] + '-1')) throw new Error('level ' + id + ' is not tagged ' + name);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0, tries)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  const run = (a, b) => Array.from({length: b - a + 1}, (_, i) => a + i);
  pin('Пролет 2022 task 1', 155, {kind:'chain', terms: ex('2 − 0 + 2 − 2'), paired:0, ans:2}, [2], '2 − 0 + 2 − 2', 3e6);
  pin('Пролет 2021 task 1', 155, {kind:'chain', terms: ex('2 + 0 + 2 + 1'), paired:0, ans:5}, [5], '2 + 0 + 2 + 1', 3e6);
  pin('Пролет 2022 task 3', 156, {kind:'pairs', shape:'twice', a:1, b:2, c:3, off:0, terms: ex('1 + 1 + 2 + 2 − 3 − 3'), ans:0}, [0], '1 + 1 + 2 + 2 − 3 − 3');
  pin('Пролет 2022 task 20', 196, {kind:'pairs', shape:'regroup', s:1, B:10, adds:[2, 3, 4, 5], terms: ex('1 − 10 + 2 + 3 + 4 + 5'), ans:5}, [5], '1 − 10 + 2 + 3 + 4 + 5');
  pin('Пролет 2021 task 3', 156, {kind:'pairs', shape:'upup', n:4, first:1, terms: ex('1 + 2 + 3 + 4 − 2 − 3 − 4'), ans:1}, [1], '1 + 2 + 3 + 4 − 2 − 3 − 4');
  pin('Пролет 2022 task 8', 175, {kind:'ineq', shape:7, ask:'count', terms: ex('100 − 10 − 20'), V:70, less:true, traps:[3], ans:2}, [2], 'броят на различните цифри, които можем да поставим вместо □, за да е вярно: 100 − 10 − 20 < □0');
  pin('Пролет 2021 task 9', 175, {kind:'ineq', shape:7, ask:'which', terms: ex('31 − 9 − 1'), V:21, more:true, T:2, traps:[1, 2, 8], ans:0}, [0], 'цифрата, която трябва да поставим вместо □, за да е вярно: 31 − 9 − 1 > 2□');
  pin('Пролет 2022 task 19', 164, {kind:'count', shape:0, one:true, sum:false, natural:false, two:false, n:7, lo:0, hi:7, ans:8}, [8], 'едноцифрени числа, които не са по-големи от 7');
  pin('Пролет 2021 task 7', 164, {kind:'count', shape:7, one:true, sum:false, natural:false, two:false, lo:0, hi:9, ans:10}, [10], 'Колко са едноцифрените числа?');
  pin('Пролет 2021 task 8', 164, {kind:'count', shape:1, sum:false, natural:false, two:true, n:15, lo:10, hi:14, ans:5}, [5], 'двуцифрени числа, които са по-малки от 15');
  pin('Пролет 2022 task 15', 191, {kind:'weekday', shape:'after', mon: Q.MONTHS.find(m => m[0] === 'април'), d1: Q.DAYS[4], day: Q.DAYS[4], first:8, ans:4}, [4], 'месец април е петък. Колко петъка има през април след първия ден');
  pin('Пролет 2021 task 16', 192, {kind:'cmp', shape:3, shift:1, L: run(11, 15), R: run(10, 14), ans:5, flip:false}, [5], 'сборът 11 + 12 + 13 + 14 + 15 е по-голям от сбора 10 + 11 + 12 + 13 + 14');
  pin('Пролет 2021 task 12', 193, {kind:'cross', shape:'two', op:'−', shown:[23, 18, 15], hit:{t:1, i:0, digit:1, left:8}, ans:1}, [1], '29 − 23 = 27 ⟹ 29 − 2 = 27 ⟹ ☹ = 3');
  pin('Пролет 2021 task 13', 194, {kind:'dcount', shape:0, below:true, d:2, from:1, to:24, N:25, ans:8}, [8], 'по-малки от 25: 24, 23, 22, …, 3, 2, 1. Колко пъти съм записал цифрата 2');
  pin('Пролет 2022 task 14', 195, {kind:'twodig', shape:'under', B:23, ask:0, pairs:[[10, 11], [10, 12]], slots:2, ans:1, alt:[2]}, [1, 2], 'сбор, по-малък от 23. От по-голямото от тези числа извадих по-малкото');

  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const walk = ts => ts.reduce((v, t) => t.op === '−' ? v - t.n : v + t.n, 0);
  for(let i = 0; i < 3000; i++){
    const p = Q.raw(156); if(walk(p.terms) !== p.ans || p.ans < 0) fail('pairs: the chain walked gives ' + walk(p.terms), p);
    const n = Q.raw(175);
    if(n.shape === 7){ const V = walk(n.terms), fit = run(n.ask === 'count' ? 1 : 0, 9).filter(d => n.ask === 'count' ? (n.less ? V < 10*d : V > 10*d) : (n.more ? V > 10*n.T + d : V < 10*n.T + d));
      if(V !== n.V || (n.ask === 'count' ? fit.length !== n.ans : fit.length !== 1 || fit[0] !== n.ans)) fail('ineq digit: ' + fit, n); }
    const c = Q.raw(164);
    if(c.one && c.shape !== 6){ const fit = run(0, 9).filter(v => c.shape === 7 || (c.shape === 0 ? v <= c.n : v < c.n)); if(fit.length !== c.ans) fail('count one-digit', c); }
    if(c.two){ const fit = run(10, 99).filter(v => v < c.n); if(fit.length !== c.ans) fail('count two-digit', c); }
    const w = Q.raw(191); let k = 0; for(let d = 2; d <= w.mon[1]; d++) if((Q.DAYS.indexOf(w.d1) + d - 1) % 7 === Q.DAYS.indexOf(w.day)) k++;
    if(k !== w.ans) fail('weekday after: ' + k, w);
    const r = Q.raw(192); if(r.L.reduce((a, b) => a + b, 0) - r.R.reduce((a, b) => a + b, 0) !== r.ans) fail('near', r);
    const x = Q.raw(193), digs = new Set();
    x.shown.forEach((v, t) => { const s = String(v); for(let j = 0; j < s.length; j++){ const left = s.slice(0, j) + s.slice(j + 1); if(!left) continue; const e = x.shown.slice(); e[t] = +left; if((x.op === '+' ? e[0] + e[1] : e[0] - e[1]) === e[2]) digs.add(+s[j]); } });
    if(digs.size !== 1 || !digs.has(x.ans) || (x.op === '+' ? x.shown[0] + x.shown[1] : x.shown[0] - x.shown[1]) === x.shown[2]) fail('cross two: ' + [...digs], x);
    const g = Q.raw(194); let m = 0; for(let v = 1; v < g.N; v++) for(const ch of String(v)) if(+ch === g.d) m++;
    if(m !== g.ans) fail('digit below: ' + m, g);
    const u = Q.raw(195), vals = new Set(); for(let lo = 10; lo <= 99; lo++) for(let hi = lo + 1; hi <= 99; hi++) if(lo + hi < u.B) vals.add(u.ask ? hi : hi - lo);
    if([...vals].sort((a, b) => a - b).join() !== [u.ans].concat(u.alt).join()) fail('two-digit under: ' + [...vals], u);
  }
  console.log('МБГ Пролет 2022 and 2021, 1 клас: the tasks on widened levels match the official key and are asked exactly by their level; the new shapes worked out again by brute force');
}
