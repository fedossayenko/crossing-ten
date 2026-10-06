// Runs beside the app (in check.js's own scope, through eval), like check/grade1c-B.js.
// МБГ Полуфинал 2022 and 2023, 1 клас — the kinds sortpick, crossmin, digperm, cross, digeq, dcount, missing and wordpos:
// each printed task against the official key, drawn as printed and met by its level's own generator, then the new
// shapes worked out again by brute force.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // sig: what has to match for the generator to have asked the printed task (the whole question, unless a
  // shuffled order makes that too rare to wait for)
  const pin = (name, id, q, key, shows, sig, tries) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-semifinal-' + name.match(/20\d\d/)[0] + '-1')) throw new Error('level ' + id + ' is not tagged ' + name);
    const s = sig || JSON.stringify, want = s(q);
    if(pinSeed(name, () => Q.raw(id), g => s(g) !== want ? 0 : sig ? 1 : 2, tries)) return;   // a signature: the same question, not the printed one
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  // the numbers are printed shuffled, so the generator is held to the same numbers, not their order
  const sorted = q => q.shape + ':' + q.nums.slice().sort((a, b) => a - b).join();
  pin('Полуфинал 2022 task 5', 180, {kind:'sortpick', shape:'digit', nums:[8, 9, 10, 11, 7], traps:[7, 8, 9], ans:1}, [1],
    '9, 12, 10 ⟹ 9 < 10 < 12 ⟹ 91012 ⟹ 0 9, 7, 0, 13 ⟹ 0 < 7 < 9 < 13 ⟹ 07913 ⟹ 9 8, 9, 10, 11, 7 ⟹', sorted);
  pin('Полуфинал 2022 task 6', 180, {kind:'sortpick', shape:'mid', nums:[10, 30, 20, 0, 40], ans:20}, [20],
    '9, 12, 10 ⟹ 9 < 10 < 12 ⟹ 10 9, 7, 0, 13, 1 ⟹ 0 < 1 < 7 < 9 < 13 ⟹ 7 10, 30, 20, 0, 40 ⟹', sorted);
  pin('Полуфинал 2022 task 12', 166, {kind:'crossmin', shape:'one', ns:[8, 12], best:9, traps:[8, 1, 9], ans:2}, [2],
    'В сбора 8 + 12 изтрих една цифра. След като го пресметнах вярно, получих едноцифрено число. Коя цифра съм изтрил?');
  pin('Полуфинал 2022 task 2', 225, {kind:'missing', shape:'gap', row:[3, 4, 5, 6, 7, 8], hide:[2, 3], traps:[7, 6], ans:11}, [11],
    '1, 2, …, …, 5, 6 3 + 4 = 7 ? = 7 3, 4, …, …, 7, 8 … + … = ?');
  pin('Полуфинал 2023 task 3', 165, {kind:'digeq', f:4, e:'1■ + ■ = 18', near:3, traps:[3, 6, 2], ans:4}, [4], '1■ + ■ = 18');
  pin('Полуфинал 2023 task 6', 165, {kind:'digeq', f:0, e:'1■ + 4 = 20 − ■', near:2, traps:[2, 5, 1], ans:3}, [3], '1■ + 4 = 20 − ■');
  pin('Полуфинал 2023 task 4', 226, {kind:'missing', shape:'turns', row:[1, 5, 2, 6, 3, 7, 4, 8, 5, 9, 6, 10], hide:[6, 7], traps:[4, 8], ans:12}, [12],
    '● + ■. 1, 5, 2, 6, 3, 7, ●, ■, 5, 9, 6, 10');
  pin('Полуфинал 2023 task 7', 227, {kind:'wordpos', shape:'digits', pat:[1, 2, 1, 1, 2], n:20, dig:1, traps:[8, 10], ans:12}, [12],
    'Колко цифри 1 са записани в редицата от 20 числа? 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, …, 1, 2');
  pin('Полуфинал 2023 task 8', 167, {kind:'digperm', shape:'four', ds:[0, 1, 2, 3], nums:[10, 12, 13, 20, 21, 23, 30, 31, 32], traps:[12, 6], ans:9}, [9],
    '4, 5 ⟹ 45, 54 ⟹ ? = 2 0, 4, 5 ⟹ 40, 45, 50, 54 ⟹ ? = 4 0, 1, 2, 3 ⟹ … ⟹ ? =');
  pin('Полуфинал 2023 task 15', 194, {kind:'dcount', shape:0, below:true, zero:true, d:1, from:0, to:21, N:22, ans:13}, [13],
    'Колко цифри 1 се използват за записването на всички числа, които са по-малки от 22? 21, 20, 19, …, 3, 2, 1, 0');
  pin('Полуфинал 2023 task 16', 209, {kind:'cross', shape:'tens', shown:[10, 20, 30, 40, 10], cut:[[1, 0], [2, 0], [3, 0]], traps:[4, 2], ans:3}, [3],
    'Колко най-малко цифри трябва да зачеркнем, за да е вярно следното? 10 + 20 + 30 + 40 = 10');

  const count = (s, d) => [...String(s)].filter(c => c === String(d)).length;
  const seen = { one:0, four:0, run:0, tens:0, round:0, zero:0 };
  for(let i = 0; i < 3000; i++){
    // 180's five numbers of one sort: a run of five with an odd count of digits, or five of the round tens 0 … 50
    const s = Q.raw(180), up = s.nums.slice().sort((a, b) => a - b);
    if(s.nums.length === 5 && up[4] - up[0] === 4 && s.shape === 'digit'){ seen.run++; if(up.join('').length % 2 !== 1 || up.join('').length > 9) fail('sortpick run', s); }
    if(s.nums.length === 5 && up.every(v => v % 10 === 0) && s.shape === 'mid'){ seen.round++; if(up[4] > 50 || up[2] !== s.ans) fail('sortpick tens', s); }
    // 166 one-digit: every digit of the written sum erased in turn and the rest added; only one leaves a one-digit sum
    const c = Q.raw(166);
    if(c.shape === 'one'){
      seen.one++;
      const txt = c.ns.join('+'), small = [];
      for(let k = 0; k < txt.length; k++) if(txt[k] !== '+'){ const t = txt.slice(0, k) + txt.slice(k + 1); const v = t.split('+').reduce((a, w) => a + +w, 0); if(v < 10) small.push([+txt[k], v]); }
      if(small.length !== 1 || small[0][0] !== c.ans || small[0][1] !== c.best || count(txt, c.ans) !== 1 || c.traps.includes(c.ans)) fail('crossmin one: ' + JSON.stringify(small), c);
    }
    // 167 four digits: every number from 10 to 99 checked against the digits
    const g = Q.raw(167);
    if(g.shape === 'four'){
      seen.four++;
      let n = 0; for(let v = 10; v <= 99; v++){ const a = Math.floor(v / 10), b = v % 10; if(a !== b && g.ds.includes(a) && g.ds.includes(b)) n++; }
      if(n !== g.ans || new Set(g.ds).size !== 4 || g.ds.join() !== g.ds.slice().sort((a, b) => a - b).join() || n !== (g.ds.includes(0) ? 9 : 12)) fail('digperm four: ' + n, g);
    }
    // 209 round tens: crossed out by brute force in check/grade1c-B.js; here, the smallest on the right and one fewer than the addends
    const x = Q.raw(209);
    if(x.shape === 'tens'){
      seen.tens++;
      const add = x.shown.slice(0, -1);
      if(x.ans !== add.length - 1 || x.shown[add.length] !== Math.min(...add) || new Set(add).size !== add.length || add.some(v => v % 10 || v < 10 || v > 50) || add.length < 3 || add.length > 4) fail('cross tens', x);
    }
    // 194 in the paper's words: 0 written too, every number below N written out and its digits counted
    const z = Q.raw(194);
    if(z.zero){ seen.zero++; let n = 0; for(let v = 0; v < z.N; v++) n += count(v, z.d); if(n !== z.ans || z.from !== 0 || z.to !== z.N - 1) fail('dcount zero: ' + n, z); }
    // 225: a run of six, the middle two added; the example (drawn) is the same run two lower, its own gap added
    const m = Q.raw(225), ex = m.row.map(v => v - 2);
    if(m.row.some((v, k) => k && v !== m.row[k - 1] + 1) || m.row[2] + m.row[3] !== m.ans || ex[0] < 1 || m.hide.join() !== '2,3') fail('missing gap', m);
    if(strip(Q.drawQ(m)).indexOf(ex.slice(0, 2).join(',') + ',…,…,' + ex.slice(4).join(',') + (ex[2] + '+' + ex[3] + '=' + (ex[2] + ex[3]))) < 0) fail('missing gap: the example', m);
    // 226: the places by turns are two runs counting on by one, the second always k more; the hidden pair is one pair
    const t = Q.raw(226), first = t.row.filter((_, k) => k % 2 === 0), second = t.row.filter((_, k) => k % 2 === 1), k = second[0] - first[0];
    if(first.some((v, j) => j && v !== first[j - 1] + 1) || second.some((v, j) => v !== first[j] + k) || k < 3 || k > 6 || first[0] > 4 ||
       t.hide[0] % 2 || t.hide[1] !== t.hide[0] + 1 || ![6, 8].includes(t.hide[0]) || t.row[t.hide[0]] + t.row[t.hide[1]] !== t.ans) fail('missing turns', t);
    // 227: the row written out from its part and the digit counted; the shown start has no shorter repeat than the part,
    // and what is drawn is that start, …, and the row's last two numbers
    const w = Q.raw(227), L = w.pat.length, row = Array.from({length: w.n}, (_, j) => w.pat[j % L]), head = row.slice(0, 2*L + 1);
    let per = 1; while(per < head.length && head.some((v, j) => j >= per && v !== head[j - per])) per++;
    if(row.filter(v => v === w.dig).length !== w.ans || per !== L || L < 4 || L > 5 || ![15, 20].includes(w.n) || w.traps.includes(w.ans)) fail('wordpos digits: ' + per, w);
    if(strip(Q.drawQ(w)).indexOf(head.join(',') + ',…,' + row.slice(-2).join(',')) < 0) fail('wordpos digits: not drawn as the row', w);
  }
  if(Object.values(seen).some(n => !n)) throw new Error('a new shape never came up: ' + JSON.stringify(seen));
  console.log('МБГ Полуфинал 2022 and 2023, 1 клас: 2022 tasks 2, 5, 6, 12 and 2023 tasks 3, 4, 6, 7, 8, 15, 16 match the key and their levels ask them; the run of five, the round tens, the one-digit sum, four digits, the 0 written, the gap, the pairs by turns and the repeated part worked out again');
}
