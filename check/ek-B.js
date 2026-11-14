// Runs beside the app (in check.js's own scope, through eval), like check/ach-C.js.
// Европейско Кенгуру, 2 клас, 2019–2026, builder B — two unknowns from totals (320 Два сбора, 321 Две пици, три сока,
// 322 Заедно и едното), a count and what each special one adds (323 Гърбици и стрелички, 326 Крави и кокошки), things
// changed by a rule (324 Превръщане, 325 Жетони), and 2026 task 10 asked by 297 Поравно. Each printed task is pinned
// against the official answer; then every generator is worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const met = [];
  // fields: what makes it the printed question; the wording differs only where the note says so
  const pin = (year, task, id, q, key, shows, fields, tag) => {
    const name = 'Кенгуру ' + year + ' task ' + task;
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': gives ' + Q.answers(q) + ', the official answer is ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the official answer is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const sig = g => fields.map(f => JSON.stringify(g[f])).join('|'), want = sig(q);
    // the generator's own answer on the printed question must be the paper's: a hand-written q.ans alone proves nothing
    const same = g => { if(fields.length && String(Q.answers(g)) !== String(key)) throw new Error(name + ': level ' + id + ' draws it but answers ' + Q.answers(g) + ', the paper says ' + key); return 2; };
    if(!pinSeed(name, () => Q.raw(id), g => g.kind === q.kind && g.shape === q.shape && sig(g) === want ? same(g) : 0)) throw new Error(name + ': level ' + id + ' never asks it');
    met.push(year + '#' + task);
  };
  // 2025, задача 12: big + small 53, big + two small 56 — А) 40 Б) 43 В) 45 Г) 50 Д) 51
  pin(2025, 12, 320, {kind:'twotot', shape:'one', sc:0, s:3, big:50, A:53, B:56, traps:[3], ans:50}, 50, 'Голямо кенгуру и едно малко тежат общо 53 кг, а голямо кенгуру и двете малки — 56 кг', ['sc', 's', 'big'], 'ek-2025-2');
  // 2019, задача 8: two apples 60 стотинки, two pears 80 — a pear and an apple, 70
  pin(2019, 8, 320, {kind:'twotot', shape:'halves', it:[0, 1], a:30, b:40, A:60, B:80, traps:[140], ans:70}, 70, 'Две ябълки заедно струват 60 цента, а две круши заедно — 80 цента', ['it', 'a', 'b'], 'ek-2019-2');
  // 2022, задача 4: pizza + juice 12, pizza + two juices 14 — two pizzas and three juices, 26 (лева there, евро here)
  pin(2022, 4, 321, {kind:'twotot', shape:'mix', sc:0, p:10, j:2, m:2, n:3, A:12, B:14, traps:[16, 28], ans:26}, 26, 'Пица и сок струват 12 евро, а пица и два сока — 14 евро', ['sc', 'p', 'j', 'm', 'n'], 'ek-2022-2');
  // 2019, задача 2: Мама Кенга and Скокчо together 60 кг, Мама Кенга 52 — 8
  pin(2019, 2, 322, {kind:'twotot', shape:'rest', sc:0, T:60, a:52, ans:8, traps:[112]}, 8, 'Мама Кенга и синът ѝ Скокчо заедно тежат 60 кг, а самата мама Кенга тежи 52 кг', ['sc', 'T', 'a'], 'ek-2019-2');
  // 2019, задача 20: 10 camels, 14 humps — the two-humped, 4
  pin(2019, 20, 323, {kind:'extras', shape:'humps', n:10, k:4, total:14, traps:[10], ans:4}, 4, 'има общо 10 камили', ['n', 'k'], 'ek-2019-2');
  // 2024, задача 24: Андрей starts with 10 darts, 2 more for each bullseye, 20 thrown — 5
  pin(2024, 24, 323, {kind:'extras', shape:'darts', who:0, n0:10, e:2, k:5, total:20, traps:[10], ans:5}, 5, 'Андрей започнал играта с 10 стрелички и получавал още 2 стрелички', ['who', 'n0', 'e', 'k'], 'ek-2024-2');
  // 2022, задача 26: 16 legs, two sold, heads and legs left 12 — the hens, 4 (two cows sold, four hens left)
  pin(2022, 26, 326, {kind:'extras', shape:'farm', L:16, R:12, c:2, h:4, x:2, traps:[4], ans:4}, 4, 'краката им са 16. Продал 2 от животните и броят на главите и краката на останалите станал 12', ['L', 'R'], 'ek-2022-2');
  // 2021, задача 18: 4 apples and 5 bananas — what is left at the end: 1 banana (here asked as how many fruit, 1)
  pin(2021, 18, 324, {kind:'swap', shape:'fruit', a:4, b:5, ea:0, eb:1, traps:[9], ans:1}, 1, 'има 4 ябълки и 5 банана', ['a', 'b'], 'ek-2021-2');
  // 2019, задача 24: 3 red and 1 white, 3 tokens put in — the fewest after that, 8 (the paper's key Г = 8)
  pin(2019, 24, 325, {kind:'swap', shape:'tokens', r:3, w:1, k:3, traps:[10, 6], ans:8}, 8, 'Нели имала 3 червени жетона и 1 бял', ['r', 'w', 'k'], 'ek-2019-2');
  // 2026, задача 10: 12 bees in one hive, 6 in the other (a picture there) — how many fly over to make them equal, 3; level 297 asks it with cards or stamps
  pin(2026, 10, 297, {kind:'equalize', shape:'give', pair:0, thing:0, a:12, b:6, k:3, traps:[6], ans:3}, 3, 'Тони има 12 картички, а Габи — 6', ['a', 'b', 'k'], 'ek-2026-2');

  // every generator worked out again another way
  const n = {};
  const count = k => n[k] = (n[k] || 0) + 1;
  for(const id of [320, 321, 322]) for(let i = 0; i < 3000; i++){
    const q = Q.raw(id); count('twotot ' + q.shape);
    const sols = [];
    if(q.shape === 'one'){
      for(let big = 1; big < q.A; big++){ const s = q.A - big; if(big + 2*s === q.B) sols.push(big); }
      if(sols.join() !== String(q.ans) || q.s < 2 || q.B > 100) fail('320: the big one', q);
    } else if(q.shape === 'halves'){
      for(let a = 1; a < q.A; a++) for(let b = 1; b < q.B; b++) if(a + a === q.A && b + b === q.B) sols.push(a + b);
      if(sols.join() !== String(q.ans) || q.A === q.B || q.ans > 100) fail('320: the halves', q);
    } else if(q.shape === 'mix'){
      for(let p = 1; p < q.A; p++){ const j = q.A - p; if(p + 2*j === q.B) sols.push((q.m === 2 ? p + p : p + p + p) + (q.n === 2 ? j + j : q.n === 3 ? j + j + j : j + j + j + j)); }
      if(sols.join() !== String(q.ans) || q.ans > 100 || !/^[^×÷]*$/.test(strip(Q.drawQ(q)))) fail('321: the price', q);
    } else if(q.shape === 'cost' || q.shape === 'tiles'){
      continue;   // Салабашев 2020 #14 and 2019 #14, worked out again in check/sal-S3.js
    } else {
      for(let o = 1; o < q.T; o++) if(o + q.a === q.T) sols.push(o);
      if(sols.join() !== String(q.ans) || q.a < 1 || q.ans < 3) fail('322: the other', q);
    }
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(323); count('extras ' + q.shape);
    if(q.shape === 'legs') continue;   // Салабашев 2023 #11, worked out again in check/sal-S3.js
    const sols = [];
    if(q.shape === 'humps') for(let t = 0; t <= q.n; t++) if(q.n + t === q.total) sols.push(t);      // one hump each, a second one on each two-humped
    if(q.shape === 'darts') for(let k = 0; q.n0 + k * q.e <= q.total; k++) if(q.n0 + k * q.e === q.total) sols.push(k);
    if(sols.join() !== String(q.ans) || (q.shape === 'darts' && (q.e < 2 || q.e > 3 || q.ans > 6))) fail('323: the count', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(326); count('extras farm');
    // every herd, every pair sold: the hens before must be one number only
    const hens = new Set();
    for(let c = 0; c <= 10; c++) for(let h = 0; h <= 20; h++) if(4*c + 2*h === q.L) for(let cs = 0; cs <= 2; cs++){
      const hs = 2 - cs;
      if(cs <= c && hs <= h && 5*(c - cs) + 3*(h - hs) === q.R) hens.add(h);
    }
    if(hens.size !== 1 || !hens.has(q.ans) || q.R >= q.L + 10) fail('326: the hens', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(324); count('swap fruit');
    // changed again and again in a random order, always the same end
    for(let t = 0; t < 8; t++){
      let a = q.a, b = q.b;
      for(;;){
        const opts = []; if(a >= 3) opts.push(0); if(b >= 3) opts.push(1);
        if(!opts.length) break;
        if(opts[Math.floor(Math.random() * opts.length)] === 0){ a -= 3; b++; } else { b -= 3; a++; }
      }
      if(a + b !== q.ans || a !== q.ea || b !== q.eb) fail('324: another order ends at ' + a + ',' + b, q);
    }
    if((q.a + 3*q.b) % 8 !== (q.ea + 3*q.eb) % 8) fail('324: the changes keep the number a + 3b, up to 8', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(325); count('swap tokens');
    let lo = 1e9;
    for(let mask = 0; mask < 1 << q.k; mask++){          // bit set: put in a white token, else a red one
      let r = q.r, w = q.w, ok = true;
      for(let s = 0; s < q.k && ok; s++){
        if(mask >> s & 1){ if(w < 1) ok = false; else { w--; r += 2; } } else if(r < 1) ok = false; else { r--; w += 3; }
      }
      if(ok) lo = Math.min(lo, r + w);
    }
    if(lo !== q.ans || q.w < 1) fail('325: the fewest', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(297); if(q.shape === 'give'){ count('equalize give'); if(q.a - q.k !== q.b + q.k || q.ans !== q.k) fail('297: both equal', q); }
  }
  console.log('Европейско Кенгуру 2 клас, builder B: tasks ' + met.join(', ') + ' pinned (2022#4 asks лева, 2021#18 asks what is left, we ask how many; 2026#10 is a picture of bees, 297 asks it with cards); ' + Object.entries(n).map(([k, v]) => v + ' ' + k).join(', ') + ' worked out again another way');
}
