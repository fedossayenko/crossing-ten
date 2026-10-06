// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
// МБГ Пролет 2022 and 2021, 1 клас, on the widened 1st-grade kinds (sides, symeq, eqcross, crossmin, digperm):
// each printed task against the official key, drawn as printed and asked exactly by its level, and the
// new shapes worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), ex = s => s.split(' ').reduce((a, w, i, ws) => i % 2 ? a : a.concat(T(i ? ws[i - 1] : '', +w)), []);
  const pin = (name, id, q, key, shows) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(name.includes('2022') ? 'mbg-spring-2022-1' : 'mbg-spring-2021-1')) throw new Error('level ' + id + ' is not tagged ' + name);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Пролет 2022 task 2', 157, {kind:'sides', shape:'one', sym:'□', terms: ex('10 − 2 − 6'), at:2, R:2, ans:6}, [6], '10 − 2 − □ = 2');
  pin('Пролет 2021 task 2', 157, {kind:'sides', shape:'one', sym:'□', terms: ex('21 − 12'), at:1, R:9, ans:12}, [12], '21 − □ = 9');
  pin('Пролет 2022 task 9', 157, {kind:'sides', shape:'tens', sym:'□', left: ex('10 + 20 + 30'), right: ex('40 + 20 + 10'), VL:60, VR:70, ans:10}, [10], '10 + 20 + 30 + □ = 40 + 20 + 10');
  pin('Пролет 2022 task 4', 160, {kind:'symeq', shape:'def', k:2, df:0, j:1, tri:3, ask:0, p:0, m:0, ans:5}, [5], '□ = 2 ∆ = □ + □ − 1');
  pin('Пролет 2021 task 4', 160, {kind:'symeq', shape:'def', k:6, df:1, j:1, tri:5, ask:1, p:4, m:5, ans:10}, [10], '□ = 6 ∆ = □ − 1');
  pin('Пролет 2022 task 10', 160, {kind:'symeq', shape:'part', rel:false, o:4, f:3, s:5, T:12, a:7, b:8, d:1, ans:3}, [3], '○ + ● + □ = 12 ○ + ● = 7 ● + □ = 8');
  pin('Пролет 2021 task 10', 160, {kind:'symeq', shape:'part', rel:true, o:3, f:4, s:5, T:12, a:7, b:9, d:2, ans:4}, [4], '○ + ● + □ = 12 ○ + ● = 7 □ = ○ + 2');
  pin('Пролет 2022 task 7', 158, {kind:'eqcross', a:5, s:4, b:9, c:7, dot:3, ask:'twice', ans:2}, [2], '● + ● − ■');
  pin('Пролет 2021 task 6', 158, {kind:'eqcross', a:3, s:2, b:5, c:6, dot:4, ask:'minus', ans:2}, [2], '● − ■');
  pin('Пролет 2022 task 18', 166, {kind:'crossmin', shape:'three', ns:[10, 20, 30], least:true, best:30, traps:[1, 0, 2], ans:3}, [3], 'зачеркнем в 10 + 20 + 30');
  pin('Пролет 2021 task 15', 167, {kind:'digperm', shape:'count', ds:[2, 6, 0], nums:[20, 26, 60, 62], ans:4}, [4], '2, 6, 0 ⟹ 10 < … < 100');

  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const walk = ts => ts.reduce((v, t) => t.op === '−' ? v - t.n : v + t.n, 0);
  for(let i = 0; i < 3000; i++){
    // 157: every value tried in the box, the chain walked again
    const s = Q.raw(157);
    if(s.shape === 'one' || s.shape === 'tens'){
      const fits = [];
      for(let v = 0; v <= 100; v++){
        const ok = s.shape === 'one' ? walk(s.terms.map((t, k) => k === s.at ? {op: t.op, n: v} : t)) === s.R : walk(s.left) + v === walk(s.right);
        if(ok) fits.push(v);
      }
      if(fits.length !== 1 || fits[0] !== s.ans) fail('sides ' + s.shape + ': the box fits ' + fits, s);
      if(s.shape === 'one'){ let run = s.terms[0].n; for(const t of s.terms.slice(1)){ run += t.op === '+' ? t.n : -t.n; if(run < 0 || run > 30) fail('sides one: a step leaves 0…30', s); } }
      if(s.shape === 'tens' && (walk(s.right) > 120 || s.left.concat(s.right).some(t => t.n % 10))) fail('sides tens', s);
    }
    // 160: every value tried for each figure
    const y = Q.raw(160);
    if(y.shape === 'def'){
      const fit = []; for(let a = 0; a <= 20; a++) for(let b = 0; b <= 20; b++) if(a === y.k && b === [2*a - y.j, a - y.j, a + y.j][y.df]) fit.push(a + (y.ask ? y.p : 0) + b - (y.ask ? y.m : 0));
      if(fit.length !== 1 || fit[0] !== y.ans || y.ans < 0 || y.ans > 20) fail('symeq def', y);
    }
    if(y.shape === 'part'){
      const fit = new Set(); for(let o = 1; o <= 20; o++) for(let f = 1; f <= 20; f++) for(let s2 = 1; s2 <= 20; s2++)
        if(o + f + s2 === y.T && o + f === y.a && (y.rel ? s2 === o + y.d : f + s2 === y.b)) fit.add(f);
      if(fit.size !== 1 || !fit.has(y.ans) || y.T > 20) fail('symeq part', y);
    }
    // 158: ■ and ● searched for, then the ask
    let c = Q.raw(158); while(c.shape === 'stack' || c.shape === 'flip') c = Q.raw(158);   // one flower in two lines: check/grade1c-A.js; ● first in the row: check/grade1d-A.js
    let sq = -1; for(let v = 0; v <= 20; v++) if(c.a + v === c.b) sq = v;
    const dot = c.c - sq, want = {minus: dot - sq, plus: dot + sq, twice: dot + dot - sq, dot}[c.ask];
    if(dot < 1 || want !== c.ans || want < 0 || want > 20) fail('eqcross', c);
    // 166: every digit of the three numbers crossed out by cutting it from the written sum
    const m = Q.raw(166);
    if(m.shape === 'three'){
      const txt = m.ns.join('+'), tries = [];
      for(let k = 0; k < txt.length; k++) if(txt[k] !== '+'){ const t = txt.slice(0, k) + txt.slice(k + 1); tries.push([+txt[k], t.split('+').reduce((a, w) => a + +w, 0)]); }
      const best = (m.least ? Math.min : Math.max)(...tries.map(t => t[1])), at = tries.filter(t => t[1] === best);
      if(at.length !== 1 || at[0][0] !== m.ans || txt.split('').filter(d => d === String(m.ans)).length !== 1 || tries.some(t => t[1] > 99) || m.traps.includes(m.ans)) fail('crossmin three', m);
    }
    // 167: every number from 10 to 99 checked against the digits
    const g = Q.raw(167);
    if(g.shape === 'count'){ let n = 0; for(let v = 10; v <= 99; v++){ const a = Math.floor(v / 10), b = v % 10; if(a !== b && g.ds.includes(a) && g.ds.includes(b)) n++; } if(n !== g.ans) fail('digperm count', g); }
  }
  console.log('МБГ Пролет 2022 and 2021, 1 клас: tasks 2022 2, 4, 7, 9, 10, 18 and 2021 2, 4, 6, 10, 15 on the widened 1st-grade kinds match the key and are asked exactly; the new shapes worked out again by brute force');
}
