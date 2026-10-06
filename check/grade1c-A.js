// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
// МБГ Полуфинал 2024 and 2025, 1 клас — the chains, sums and equalities (chain 155 and 203, pairs 156, sides 157,
// eqcross 158, picdig 172): each printed task against the official key, drawn as printed and asked exactly by its
// level, then the new shapes worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), ex = s => s.split(' ').reduce((a, w, i, ws) => i % 2 ? a : a.concat(T(i ? ws[i - 1] : '', +w)), []);
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // sig: what has to match for the level to have asked the printed task (the whole question, unless the pictures
  // are drawn at random); tries: a chain is one of very many and cheap to draw, so it gets more
  const pin = (name, id, q, key, shows, sig, tries = 300000) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-semifinal-' + name.match(/20\d\d/)[0] + '-1')) throw new Error('level ' + id + ' is not tagged ' + name);
    const s = sig || JSON.stringify, want = s(q);
    if(pinSeed(name, () => Q.raw(id), g => s(g) === want ? 2 : 0, tries)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Полуфинал 2024 task 1', 224, {kind:'chain', shape:'past', terms: ex('20 − 2 + 4'), paired:0, ans:22}, [22], '20 − 2 + 4', null, 3e6);
  // the long chain is one of about a million: its seed is replayed, the search (only after a generator change) gets 1e7 tries
  pin('Полуфинал 2024 task 2', 203, {kind:'chain', terms: ex('20 − 2 + 4 − 2 + 0 − 2 − 4'), paired:0, ans:14}, [14], '20 − 2 + 4 − 2 + 0 − 2 − 4', null, 1e7);
  pin('Полуфинал 2025 task 2', 155, {kind:'chain', terms: ex('10 − 0 − 2 − 7'), paired:0, ans:1}, [1], '10 − 0 − 2 − 7', null, 3e6);
  pin('Полуфинал 2025 task 3', 156, {kind:'pairs', shape:'back', a:3, b:2, cs:[3, 4], e:1, terms: ex('3 − 2 + 3 − 3 + 4 − 4 + 1'), ans:2}, [2], '3 − 2 + 3 − 3 + 4 − 4 + 1');
  pin('Полуфинал 2025 task 4', 157, {kind:'sides', shape:'flip', sym:'☺', left: ex('2 + 0 + 2 + 4'), right: ex('2 + 0 − 2 + 5'), minus:false, VL:8, VR:5, ans:3}, [3], '2 + 0 + 2 + 4 = 2 + 0 − 2 + 5 + ☺');
  pin('Полуфинал 2025 task 10', 158, {kind:'eqcross', shape:'stack', s:5, x:12, b:17, ans:7}, [7], '+ 5 = 17 − 5 =');
  { // task 10: a flower, not a box, in both lines
    const q = {kind:'eqcross', shape:'stack', s:5, x:12, b:17, ans:7}, h = Q.drawQ(q), lines = h.split('<div class="line md">').slice(1);
    if(/[■●□]/.test(h) || lines.length !== 2 || !lines.every(l => l.startsWith('<svg class="ic"')) || lines[0].split('</svg>')[0] !== lines[1].split('</svg>')[0]) fail('Полуфинал 2025 task 10: not the same flower at the start of both lines', q);
  }
  // task 19: dog 1, chick 3, spider 4 — 13, 34, 41 — and [chick][chick] − [dog][spider] = 33 − 14; the pictures are fruit
  // drawn at random, so the digits and the places asked must match
  const twin = {kind:'picdig', shape:'twin', f:['a', 'p', 'l'], d:[1, 3, 4], x:1, y:0, z:2, ans:19};
  pin('Полуфинал 2025 task 19', 172, twin, [19], '= 13 = 34 = 41', g => [g.shape, g.d, g.x, g.y, g.z].join('|'));
  { const F = twin.f, two = (i, j) => '<span style="white-space:nowrap">' + Q.ic(F[i]) + Q.ic(F[j]) + '</span>';
    if(Q.drawQ(twin).indexOf(two(1, 1) + ' − ' + two(0, 2) + ' = ') < 0) fail('Полуфинал 2025 task 19: the last line is not [chick][chick] − [dog][spider]', twin); }

  const walk = ts => ts.reduce((v, t) => t.op === '−' ? v - t.n : v + t.n, 0);
  const runs = ts => ts.map((_, k) => walk(ts.slice(0, k + 1)));
  let past = 0, zeros = 0;
  for(let i = 0; i < 3000; i++){
    // 155: walked again, it stays in 0…20; 224 (its 'past' shape, a level of its own) ends 21 to 24 after a step down
    for(const id of [155, 224]){
      const c = Q.raw(id), r = runs(c.terms);
      if(walk(c.terms) !== c.ans || r.some(v => v < 0)) fail('chain short: walked gives ' + walk(c.terms), c);
      if((c.shape === 'past') !== (id === 224)) fail('chain short: level ' + id + ' drew shape ' + c.shape, c);
      if(c.shape === 'past'){ past++; if(c.terms.length !== 3 || c.terms[1].op !== '−' || c.terms[2].op !== '+' || r[1] > 20 || c.ans < 21 || c.ans > 24) fail('chain past', c); }
      else if(Math.max(...r) > 20) fail('chain short: leaves 0…20', c);
    }
    // 203: seven numbers, a start of 12…20, steps of 0…5, every running total in 0…24, two step sizes at most
    const g = Q.raw(203), rg = runs(g.terms), sizes = new Set(g.terms.slice(1).map(t => t.n).filter(n => n));
    if(g.terms.length !== 7 || g.terms[0].n < 12 || g.terms[0].n > 20 || g.terms.slice(1).some(t => t.n > 5) || rg.some(v => v < 0 || v > 24) || sizes.size > 2 || walk(g.terms) !== g.ans) fail('chain long', g);
    if(g.terms.some(t => t.n === 0)) zeros++;
    if(Q.why(g, true).indexOf(rg.join(', ')) < 0) fail('chain long: the hint does not show every running total', g);
    // 156 'back': every +c is followed by −c, so the walk is the head and the tail alone
    const p = Q.raw(156);
    if(p.shape === 'back'){
      const mid = p.terms.slice(2, -1);
      if(mid.length < 4 || mid.some((t, k) => k % 2 ? t.op !== '−' || t.n !== mid[k - 1].n : t.op !== '+') || walk(p.terms) !== p.ans || p.ans !== walk([p.terms[0], p.terms[1], p.terms[p.terms.length - 1]]) || runs(p.terms).some(v => v < 0)) fail('pairs back', p);
    }
    // 157 'flip': every ☺ from 0 to 30 tried against the two sides; the sides alike but for the third sign
    const s = Q.raw(157);
    if(s.shape === 'flip'){
      const fits = []; for(let v = 0; v <= 30; v++) if(walk(s.left) === walk(s.right) + v) fits.push(v);
      const alike = [0, 1].every(k => s.left[k].n === s.right[k].n && s.left[k].op === s.right[k].op) && s.left[2].n === s.right[2].n && s.left[2].op === '+' && s.right[2].op === '−' && s.left[3].op === '+' && s.right[3].op === '+';
      if(fits.length !== 1 || fits[0] !== s.ans || s.ans > 9 || !alike || runs(s.right).some(v => v < 0) || walk(s.left) > 20) fail('sides flip: ☺ fits ' + fits, s);
    }
    // 158 'stack': every flower from 0 to 20 tried in the first line, then the second worked out
    const e = Q.raw(158);
    if(e.shape === 'stack'){
      const fl = []; for(let v = 0; v <= 20; v++) if(v + e.s === e.b) fl.push(v);
      if(fl.length !== 1 || fl[0] - e.s !== e.ans || e.ans < 0 || e.b > 20 || e.s < 1 || e.s > 9) fail('eqcross stack: the flower fits ' + fl, e);
    }
    // 172 'twin': every set of three different digits tried against the three numbers drawn
    const d = Q.raw(172);
    if(d.shape === 'twin'){
      const shown = [...strip(Q.drawQ(d)).matchAll(/=(\d+)/g)].map(m => +m[1]), found = new Set();
      for(let a = 1; a <= 9; a++) for(let b = 1; b <= 9; b++) for(let c = 1; c <= 9; c++){
        const v = [a, b, c];
        if(new Set(v).size === 3 && shown.join() === [10*a + b, 10*b + c, 10*c + a].join()) found.add(11*v[d.x] - 10*v[d.y] - v[d.z]);
      }
      if(found.size !== 1 || !found.has(d.ans) || d.ans < 1 || new Set([d.x, d.y, d.z]).size !== 3) fail('picdig twin: ' + [...found], d);
    }
  }
  if(past !== 3000) throw new Error('chain past: level 224 drew ' + past + ' of 3000');
  if(zeros < 1000 || zeros > 2000) throw new Error('chain long: a 0 in ' + zeros + ' of 3000, not about half');
  console.log('МБГ Полуфинал 2024 and 2025, 1 клас: 2024 tasks 1, 2 and 2025 tasks 2, 3, 4, 10, 19 match the key and are asked exactly by their levels; the chains walked, the pairs, ☺, the flower and the pictures worked out again');
}
