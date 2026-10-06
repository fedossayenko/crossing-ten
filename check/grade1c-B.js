// Runs beside the app (in check.js's own scope, through eval), like check/grade1b-A.js.
// МБГ Полуфинал 2024 and 2025, 1 клас — the kinds digeq, dcount, digperm, cross and digstr: each printed task against
// the official key, drawn as printed and met by its level's own generator, then the new shapes worked out again.
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
  pin('Полуфинал 2024 task 3', 204, {kind:'digeq', shape:'one', sym:'☺', e:'2■ − 2 − 4 = 16', traps:[6, 0], ans:2}, [2], 'Под ☺ е скрита цифра. Коя е тя? 2☺ − 2 − 4 = 16');
  pin('Полуфинал 2024 task 6', 165, {kind:'digeq', f:7, e:'2■ + 4 = 30 − ■', near:2, traps:[2, 5, 1], ans:3}, [3], '2■ + 4 = 30 − ■');
  pin('Полуфинал 2025 task 8', 165, {kind:'digeq', shape:'calc', f:8, e:'1■ + ■ = 19 − ■', near:2, dig:3, traps:[3, 13, 16], ans:10}, [10], 'Една и съща цифра е закрита с квадрати: 1■ + ■ = 19 − ■ Пресметнете 1■ − ■');
  pin('Полуфинал 2024 task 4', 205, {kind:'digstr', a:1, step:2, to:19, hide:[5, 8], traps:[24, 2], ans:4}, [4], '● + ■. 1, 3, 5, 7, 9, ●, 1, 1, ■, 1, 5, 1, 7, 1, 9.');
  pin('Полуфинал 2024 task 7', 194, {kind:'dcount', shape:'from', d:1, from:9, to:22, ans:12}, [12], 'Колко са всички цифри 1, които се използват за записване на числата от 9 до 22? 9, 10, 11, 12, …, 21, 22');
  pin('Полуфинал 2024 task 8', 206, {kind:'dcount', shape:'omit', a:1, b:14, traps:[7, 38], ans:9}, [9], 'Колко общо са цифрите на пропуснатите числа? 1, 2, 3, 4, …, 12, 13, 14');
  // the row is shuffled, so the generator is held to the same digits, each as many times, not their order
  pin('Полуфинал 2025 task 1', 207, {kind:'dcount', shape:'freq', k:2, s:'4137453345432', traps:[2], ans:5}, [5], 'Коя цифра е записана само два пъти? 4137453345432',
    q => q.shape + ':' + q.k + ':' + [...q.s].sort().join('') + ':' + q.ans, 3e6);
  pin('Полуфинал 2024 task 12', 208, {kind:'digperm', shape:'flip', ds:[0, 1, 6], nums:[10, 16, 19, 60, 61, 90, 91], traps:[4], ans:7}, [7], 'Колко са всички двуцифрени числа, които можем да съставим с три картички, на които са записани 0, 1 и 6?');
  pin('Полуфинал 2024 task 16', 209, {kind:'cross', shape:'few', shown:[2, 7, 13, 10], cut:[[2, 1]], traps:[12, 3], ans:1}, [1], 'Колко най-малко цифри трябва да зачеркнем, така че след пресмятането да се получи верен отговор? 2 + 7 + 13 = 10', null, 3e6);

  const count = (s, d) => [...s].filter(c => c === String(d)).length;
  for(let i = 0; i < 3000; i++){
    // 204: every digit put in for ☺, the chain walked; and the steps undone land on the hidden number
    const o = Q.raw(204), w = o.e.split(' '), fit = [];
    for(let v = 0; v <= 9; v++){ let x = +w[0].replace('■', v), ok = true; for(let k = 1; k < 5; k += 2){ x = w[k] === '+' ? x + +w[k + 1] : x - +w[k + 1]; if(x < 0) ok = false; } if(ok && x === +w[6]) fit.push(v); }
    let back = +w[6]; for(let k = 1; k < 5; k += 2) back = w[k] === '+' ? back - +w[k + 1] : back + +w[k + 1];
    if(fit.length !== 1 || fit[0] !== o.ans || back !== +w[0].replace('■', o.ans) || o.e.split('■').length !== 2 || strip(Q.drawQ(o)).includes('■')) fail('digeq one: ' + fit, o);
    // 165 asking 1■ − ■: the one digit that fits found again, and 1■ − ■ worked out with it (and with any other: the ones cancel)
    const c = Q.raw(165);
    if(c.shape === 'calc'){
      const ok = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => { const [l, r] = c.e.replace(/■/g, v).split(' = ').map(x => eval(x.replace(/−/g, '-'))); return l === r; });
      if(ok.length !== 1 || ok[0] !== c.dig || 10 + ok[0] - ok[0] !== c.ans || c.e.indexOf('1■ + ■ = ') !== 0) fail('digeq calc: ' + ok, c);
    }
    // 205: the run written out again and split into digits; the hidden ones are in two different two-digit numbers
    const r = Q.raw(205), row = [], owner = [];
    for(let v = r.a; v <= r.to; v += r.step) String(v).split('').forEach(ch => { row.push(+ch); owner.push(v); });
    if(row[r.hide[0]] + row[r.hide[1]] !== r.ans || owner[r.hide[0]] < 10 || owner[r.hide[1]] < 10 || owner[r.hide[0]] === owner[r.hide[1]] || r.to > 21) fail('digstr', r);
    if(strip(Q.drawQ(r)).indexOf(row.map((d, k) => k === r.hide[0] ? '●' : k === r.hide[1] ? '■' : d).join(',')) < 0) fail('digstr: not drawn as the run', r);
    // 194 from one number to another: every number written and its digits counted
    const f = Q.raw(194);
    if(f.shape === 'from'){ let n = 0; for(let v = f.from; v <= f.to; v++) n += count(String(v), f.d); if(n !== f.ans || f.from > 9 || f.to < 15) fail('dcount from: ' + n, f); }
    // 206: the numbers from 1 to the last, those shown taken away, the rest written out
    const m = Q.raw(206), shown = [m.a, m.a + 1, m.a + 2, m.a + 3, m.b - 2, m.b - 1, m.b];
    const gone = []; for(let v = 1; v <= m.b; v++) if(v >= m.a && !shown.includes(v)) gone.push(v);
    if(gone.join('').length !== m.ans || !gone.some(v => v < 10) || !gone.some(v => v >= 10)) fail('dcount omit: ' + gone, m);
    // 207: every digit tallied; exactly one is written k times
    const g = Q.raw(207), k = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => count(g.s, d) === g.k);
    if(k.length !== 1 || k[0] !== g.ans || g.s.length < 11 || g.s.length > 14 || new Set(g.s).size < 4 || new Set(g.s).size > 6) fail('dcount freq: ' + k, g);
    // 208: every two cards in either order, each turned or not, a turned card read only if it is a digit
    const p = Q.raw(208), turn = { 0:0, 1:1, 8:8, 6:9, 9:6 }, made = new Set(), plain = new Set();
    p.ds.forEach((x, a) => p.ds.forEach((y, b) => { if(a === b) return;
      if(x) plain.add(10*x + y);
      [x, turn[x]].forEach(t => [y, turn[y]].forEach(u => { if(t !== undefined && u !== undefined && t > 0) made.add(10*t + u); })); }));
    if(made.size !== p.ans || p.traps[0] !== plain.size || plain.size >= made.size || [...made].sort((a, b) => a - b).join() !== p.nums.join()) fail('digperm flip: ' + [...made], p);
    // 167's own count never turns a card
    if(Q.raw(167).shape === 'flip') throw new Error('level 167 turned a card over');
    // 209: every set of digits crossed out of the written equality, the fewest that leave it true
    const x = Q.raw(209), txt = x.shown.slice(0, 3).join('+') + '=' + x.shown[3], at = [...txt].map((ch, j) => /\d/.test(ch) ? j : -1).filter(j => j >= 0);
    let least = Infinity;
    for(let mask = 0; mask < 1 << at.length; mask++){
      const gone = new Set(at.filter((_, b) => mask >> b & 1)), t = [...txt].filter((_, j) => !gone.has(j)).join(''), [lhs, rhs] = t.split('='), ns = lhs.split('+').concat(rhs);
      if(ns.some(n => !n || /^0\d/.test(n))) continue;
      if(+ns[0] + +ns[1] + +ns[2] === +ns[3]) least = Math.min(least, gone.size);
    }
    if(least !== x.ans || least < 1 || least > 2) fail('cross few: ' + least, x);
  }
  console.log('МБГ Полуфинал 2024 and 2025, 1 клас: 2024 tasks 3, 4, 6, 7, 8, 12, 16 and 2025 tasks 1, 8 match the key and their levels ask them; the hidden digit, 1■ − ■, the digit rows, the digit counts, the tally, the turned card and the fewest crossed digits worked out again');
}
