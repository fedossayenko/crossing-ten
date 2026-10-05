// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
// МБГ Пролет 2022 and 2021, 1 клас — the kinds sortpick, pigeon, scales, dicestack and stardig: each printed
// task against the official key, drawn as printed and met by its level's own generator, then worked out again.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // sig: what has to match for the generator to have asked the printed task (the whole question, unless a
  // shuffled order makes that too rare to wait for)
  const pin = (name, id, q, key, shows, sig) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(name.includes('2021') ? 'mbg-spring-2021-1' : 'mbg-spring-2022-1')) throw new Error('level ' + id + ' is not tagged ' + name);
    const s = sig || JSON.stringify, want = s(q);
    if(pinSeed(name, () => Q.raw(id), g => s(g) === want ? 2 : 0)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  const sorted = q => q.shape + ':' + q.nums.slice().sort((a, b) => a - b).join();
  pin('Пролет 2022 task 5', 180, {kind:'sortpick', shape:'digit', nums:[30, 9, 20, 10], traps:[9, 1, 0], ans:2}, [2], '30, 9, 20, 10', sorted);
  pin('Пролет 2022 task 6', 180, {kind:'sortpick', shape:'mid', nums:[30, 9, 20, 19, 10], ans:19}, [19], '30, 9, 20, 19, 10', sorted);
  pin('Пролет 2022 task 12', 181, {kind:'pigeon', x:10, y:20, k:5, m:4, traps:[4, 1], ans:2}, [2], 'написали в тетрадките си 10 + 20');
  pin('Пролет 2022 task 13', 182, {kind:'scales', a:2, m:3, p:2, L:8, traps:[5, 3], ans:2}, [2], 'Една ябълка и 2 круши тежат общо колкото 8 лимона. 2 круши тежат колкото 3 ябълки');
  pin('Пролет 2022 task 16', 183, {kind:'dicestack', top:[1, 5, 4], bot:[6, 3], traps:[19, 2], ans:23}, [23], 'не се виждат');
  pin('Пролет 2022 task 11', 184, {kind:'stardig', shape:'two', a:9, b:1, slots:2, ans:8, alt:[10]}, [8, 10], 'и 9 е равен на сбора на едноцифреното число');
  pin('Пролет 2021 task 5', 184, {kind:'stardig', shape:'tens', a:9, b:8, ask:0, ans:19}, [19], 'и 9 е равен на сбора на двуцифреното число');

  for(let i = 0; i < 3000; i++){
    // 180: the numbers sorted and joined again; the middle digit (or number) of an odd count
    const s = Q.raw(180), up = s.nums.slice().sort((a, b) => a - b), j = up.join('');
    if(new Set(s.nums).size !== s.nums.length) fail('sortpick: a number twice', s);
    if(s.shape === 'digit' ? j.length % 2 !== 1 || +j[(j.length - 1) / 2] !== s.ans : up.length % 2 !== 1 || up[(up.length - 1) / 2] !== s.ans) fail('sortpick', s);
    // 181: every digit of the written sum erased in turn and the rest worked out; the fewest children that must share a sum
    const p = Q.raw(181), txt = p.x + '+' + p.y, sums = new Set();
    for(let k = 0; k < txt.length; k++) if(txt[k] !== '+'){ const e = txt.slice(0, k) + txt.slice(k + 1); sums.add(e.split('+').reduce((t, v) => t + +v, 0)); }
    let least = 1; while(least * sums.size < p.k) least++;
    if(sums.size !== p.m || least !== p.ans || p.k <= p.m) fail('pigeon: ' + [...sums], p);
    // 182: every apple weight from 1 to 12 lemons tried, the pears following from the second balance
    const c = Q.raw(182), fits = [];
    for(let A = 1; A <= 12; A++){ const pear = c.m * A / c.p; if(A + c.p * pear === c.L) fits.push(A); }
    if(fits.length !== 1 || fits[0] !== c.ans || c.m === c.p) fail('scales: ' + fits, c);
    // 183: no two faces seen on one die are the same or opposite; the hidden dots counted face by face
    const d = Q.raw(183), [t, l, r] = d.top, [bl, br] = d.bot, ok = (x, y) => x !== y && x + y !== 7;
    if(!ok(t, l) || !ok(t, r) || !ok(l, r) || !ok(bl, br)) fail('dicestack: impossible faces', d);
    const hidden = (7 - t) + (7 - l) + (7 - r) + 7 + (7 - bl) + (7 - br);   // the top die's bottom and back two; the bottom die's top-bottom pair and back two
    if(hidden !== d.ans) fail('dicestack: ' + hidden + ' hidden', d);
    // 184: every digit tried for every star
    const g = Q.raw(184);
    if(g.shape === 'two'){
      const all = new Set(); for(let x = 0; x <= 9; x++) for(let y = 0; y <= 9; y++) if(x + g.a === y + g.b) all.add(x + y);
      if([...all].sort((a, b) => a - b).join() !== [g.ans].concat(g.alt).join()) fail('stardig two: ' + [...all], g);
    } else {
      const sols = []; for(let x = 0; x <= 9; x++) for(let X = 1; X <= 9; X++) for(let Y = 0; Y <= 9; Y++) if(x + g.a === 10*X + Y + g.b) sols.push([x, Y, X]);
      const v = sols.length === 1 && +Q.STAR_ASK[g.ask][0].map(k => sols[0][k]).join('');
      if(sols.length !== 1 || v !== g.ans) fail('stardig tens: ' + JSON.stringify(sols), g);
    }
  }
  console.log('МБГ Пролет 2022 and 2021, 1 клас: the printed tasks 2022 5, 6, 11, 12, 13, 16 and 2021 5 match the key and their levels ask them; sorted numbers, erased digits, the balances, the stacked dice and the stars worked out again');
}
