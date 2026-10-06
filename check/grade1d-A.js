// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
// МБГ Полуфинал 2022 and 2023, 1 клас — the chains, sums, equalities and boxes (chain 155, 203 and 224, pairs 196,
// sides 157, eqcross 158, ineq 175): each printed task against the official key, drawn as printed and asked exactly by
// its level, then the new shapes worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), ex = s => s.split(' ').reduce((a, w, i, ws) => i % 2 ? a : a.concat(T(i ? ws[i - 1] : '', +w)), []);
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // tries: a chain is one of very many and cheap to draw, so it gets more
  const pin = (name, id, q, key, shows, tries = 300000) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-semifinal-' + name.match(/20\d\d/)[0] + '-1')) throw new Error('level ' + id + ' is not tagged ' + name);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0, tries)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Полуфинал 2022 task 1', 155, {kind:'chain', shape:'five', terms: ex('2 − 0 + 2 − 2 + 2'), paired:0, ans:4}, [4], '2 − 0 + 2 − 2 + 2', 3e6);
  pin('Полуфинал 2023 task 1', 224, {kind:'chain', shape:'past', terms: ex('20 − 2 + 3'), paired:0, ans:21}, [21], '20 − 2 + 3', 3e6);
  // the six numbers are one of about a million: the seed is replayed, the search (only after a generator change) gets 1e7 tries
  pin('Полуфинал 2023 task 2', 203, {kind:'chain', shape:'six', terms: ex('15 − 1 + 6 − 2 + 7 − 5'), paired:0, ans:20}, [20], '15 − 1 + 6 − 2 + 7 − 5', 1e7);
  // task 19 shows how a take-away moves to the end, 1 − 8 + 9 = 1 + 9 − 8, then asks
  pin('Полуфинал 2022 task 19', 196, {kind:'pairs', shape:'down', s:5, B:10, adds:[5, 4, 3, 2, 1], terms: ex('5 − 10 + 5 + 4 + 3 + 2 + 1'), ans:10}, [10], 'Пример: 1 − 8 + 9 = 1 + 9 − 8 = 10 − 8 = 2 1 − 5 + 2 + 3 = 1 + 2 + 3 − 5 = 6 − 5 = 1 Пресметнете: 5 − 10 + 5 + 4 + 3 + 2 + 1');
  pin('Полуфинал 2022 task 9', 157, {kind:'sides', shape:'tens', sym:'□', left: ex('10 + 20 + 30'), right: ex('30 + 20 + 10'), VL:60, VR:60, ans:0}, [0], '10 + 20 + 30 + □ = 30 + 20 + 10');
  // task 7: down 6 + ■ = 8, across ● − ■ = 5 (● first in the row), «Пресметнете ● + ■»
  pin('Полуфинал 2022 task 7', 158, {kind:'eqcross', shape:'flip', a:6, s:2, b:8, c:5, dot:7, ask:'plus', ans:9}, [9], '● + ■ ? 6 + = 8 ● − ■ = 5');
  pin('Полуфинал 2022 task 8', 175, {kind:'ineq', shape:7, ask:'count', terms: ex('80 − 10 − 10'), V:60, less:true, traps:[4], ans:3}, [3], 'броят на различните цифри, които можем да поставим вместо □, за да е вярно: 80 − 10 − 10 < □0');
  // task 3 writes ★ for the box and first works 3 + ★ < 5 (★ = 0, 1: 2 numbers) as an example; the level asks the same
  // numbers with ■ and no example
  pin('Полуфинал 2022 task 3', 175, {kind:'ineq', shape:6, form:0, A:9, L:10, traps:[0], ans:1}, [1], 'Колко числа можем да поставим вместо ■, за да е вярно? 9 + ■ < 10');
  pin('Полуфинал 2023 task 5', 175, {kind:'ineq', shape:6, form:0, A:10, L:12, traps:[1], ans:2}, [2], 'Колко числа можем да поставим вместо ■, за да е вярно? 10 + ■ < 12');
  { // task 7: ● stands first in the row of the cross, ■ in the middle of both lines
    const h = strip(Q.drawQ({kind:'eqcross', shape:'flip', a:6, s:2, b:8, c:5, dot:7, ask:'plus', ans:9}));
    if(h.indexOf('5−■=●') >= 0) fail('Полуфинал 2022 task 7: the row is drawn the old way round', h);
  }

  const walk = ts => ts.reduce((v, t) => t.op === '−' ? v - t.n : v + t.n, 0);
  const runs = ts => ts.map((_, k) => walk(ts.slice(0, k + 1)));
  const seen = {five:0, six:0, down:0, zero:0, flip:0, eighty:0};
  let turns = 0, steps = 0;
  for(let i = 0; i < 3000; i++){
    // 155 'five': a start of 1…4, four steps of 0…3, the walk never under 0 nor over 8
    const c = Q.raw(155);
    if(c.shape === 'five'){
      seen.five++; const r = runs(c.terms);
      if(c.terms.length !== 5 || c.terms[0].n < 1 || c.terms[0].n > 4 || c.terms.slice(1).some(t => t.n > 3 || !['+', '−'].includes(t.op)) || r.some(v => v < 0 || v > 8) || walk(c.terms) !== c.ans) fail('chain five', c);
    }
    // 203 'six': a start of 12…20, five steps of 1…7, every running total in 0…25 and shown in the hint
    const g = Q.raw(203);
    if(g.shape === 'six'){
      seen.six++; const r = runs(g.terms);
      if(g.terms.length !== 6 || g.terms[0].n < 12 || g.terms[0].n > 20 || g.terms.slice(1).some(t => t.n < 1 || t.n > 7) || r.some(v => v < 0 || v > 25) || walk(g.terms) !== g.ans) fail('chain six', g);
      if(Q.why(g, true).indexOf(r.join(', ')) < 0) fail('chain six: the hint does not show every running total', g);
      for(let k = 2; k < 6; k++){ steps++; if(g.terms[k].op !== g.terms[k - 1].op) turns++; }
    }
    // 196 'down': the first number added again and every number down to 1; more taken than the first, never more than all
    const p = Q.raw(196);
    if(p.shape === 'down'){
      seen.down++; const n = p.terms[0].n, adds = p.terms.slice(2), all = n + adds.reduce((t, a) => t + a.n, 0);
      if(n < 3 || n > 5 || adds.length !== n || adds.some((t, k) => t.op !== '+' || t.n !== n - k) || p.terms[1].op !== '−' || p.terms[1].n <= n || p.terms[1].n > all || all - p.terms[1].n !== p.ans || walk(p.terms) !== p.ans) fail('pairs down', p);
      if(strip(Q.drawQ(p)).indexOf('1−8+9=1+9−8') < 0) fail('pairs down: the example is not drawn', p);
    }
    // 157 'tens' with □ = 0: every box from 0 to 100 tried; the right side the left's numbers in another order
    const s = Q.raw(157);
    if(s.shape === 'tens' && s.ans === 0){
      seen.zero++; const fits = []; for(let v = 0; v <= 100; v++) if(walk(s.left) + v === walk(s.right)) fits.push(v);
      const L = s.left.map(t => t.n), R = s.right.map(t => t.n);
      if(fits.join() !== '0' || L.slice().sort().join() !== R.slice().sort().join() || L.join() === R.join() || s.right.some((t, k) => t.op !== (k ? '+' : ''))) fail('sides tens, the same numbers: □ fits ' + fits, s);
    }
    // 158 'flip': every ■ from 0 to 20 tried down the column, then every ● from 0 to 20 along the row ● − ■ = c
    const e = Q.raw(158);
    if(e.shape === 'flip'){
      seen.flip++; const sq = [], dot = [];
      for(let v = 0; v <= 20; v++) if(e.a + v === e.b) sq.push(v);
      for(let v = 0; v <= 20; v++) if(sq.length === 1 && v - sq[0] === e.c) dot.push(v);
      const want = dot.length === 1 && {plus: dot[0] + sq[0], dot: dot[0]}[e.ask];
      if(sq.length !== 1 || dot.length !== 1 || want !== e.ans || e.c < 1 || e.b > 20 || dot[0] + sq[0] > 20) fail('eqcross flip: ■ fits ' + sq + ', ● fits ' + dot, e);
    }
    // 175 shape 7 from 80 (the answer is worked out again in check/grade1b.js): two round tens taken, 10 to 40 each
    const d = Q.raw(175);
    if(d.shape === 7 && d.ask === 'count'){
      if(![100, 90, 80].includes(d.terms[0].n) || d.terms.slice(1).some(t => t.n < 10 || t.n > 40 || t.n % 10)) fail('ineq digit count', d);
      if(d.terms[0].n === 80) seen.eighty++;
    }
  }
  for(const k in seen) if(!seen[k]) throw new Error('never drawn in 3000: ' + k + ' ' + JSON.stringify(seen));
  if(turns < 0.75 * steps) throw new Error('chain six: the sign turns at ' + turns + ' of ' + steps + ' steps, not mostly');
  console.log('МБГ Полуфинал 2022 and 2023, 1 клас: 2022 tasks 1, 3, 7, 8, 9, 19 and 2023 tasks 1, 2, 5 match the key and are asked exactly by their levels; five and six numbers walked, the count down, the same three tens, ● first in the row and the start from 80 worked out again');
}
