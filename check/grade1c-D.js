// Runs beside the app (in check.js's own scope, through eval), like check/grade1b-A.js.
// МБГ Полуфинал 2024 and 2025, 1 клас — the tasks on symeq, ineq, count, named, sumdiff, asmany, tribo and nuts, and
// the new kinds notcolor, nest and keepdig: each printed task against the official key, drawn as printed and met by
// its level's own generator, then every one of these shapes worked out again by brute force.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const run = (a, b) => Array.from({length: b - a + 1}, (_, i) => a + i);
  const digs = v => String(v).split('').map(Number);
  // the brute force for each shape: the answer found again from what the question states, or a reason it is wrong
  const solve = {
    // every number from 0 to 30 tried in the box
    'ineq:8': q => run(0, 30).filter(v => (q.form === 1 ? v + q.A : q.A + v) < q.L).length,
    // every value of the three figures from 0 to 20
    'symeq:double': q => { const z = []; for(let x = 0; x <= 20; x++) for(let y = 0; y <= 20; y++) for(let w = 0; w <= 20; w++) if(x + w + y === q.s1 && x + x === q.s2 && y + y + x === q.s3) z.push(w); return z.length === 1 ? z[0] : 'fits ' + z; },
    // every pair of numbers up to 40 with that sum and that difference
    'sumdiff:board': q => { const f = []; for(let p = 0; p <= 40; p++) for(let s = 0; s <= p; s++) if(p + s === q.S && p - s === q.d) f.push(q.asksBig ? p : s); return f.length === 1 ? f[0] : 'fits ' + f; },
    // every ☺ from the one end to the other, both runs counted number by number
    'asmany:mid': q => { const f = run(q.a, q.b).filter(m => run(q.a, m).length === run(m, q.b).length); return f.length === 1 ? f[0] : 'fits ' + f; },
    // every white, red and green count from 0 to 20 against the three «not» statements
    notcolor: q => { const f = []; for(let w = 0; w <= 20; w++) for(let r = 0; r <= 20; r++) for(let g = 0; g <= 20; g++) if(r + g === q.not[0] && w + g === q.not[1] && w + r === q.not[2]) f.push([w, r, g][q.ask]); return f.length === 1 ? f[0] : 'fits ' + f; },
    // the numbers from 1 to N gone through one by one: those not in the list
    'count:8': q => run(1, q.N).filter(v => !q.list.includes(v)).length,
    // the one-digit numbers 0 … 9, all of them or those not less than a
    'count:6': q => run(0, 9).filter(v => v >= q.a).length,
    'count:7': q => run(0, 9).length,
    // the rule followed from the first two
    'tribo:fib': q => { const t = q.t.slice(0, 2); while(t.length < q.t.length) t.push(t[t.length - 1] + t[t.length - 2]); return t.join() === q.t.join() ? t[q.h] : 'not the rule'; },
    // the boxes built one by one and counted: all of them, or those with nothing inside
    nest: q => { const box = [{ kids: 0 }]; for(let i = 0; i < q.a; i++){ box[0].kids++; const mid = { kids: 0 }; box.push(mid); for(let j = 0; j < q.b; j++){ mid.kids++; box.push({ kids: 0 }); } } return q.empty ? box.filter(b => !b.kids).length : box.length; },
    // every way to share T among k children, each at least one: the largest share any of them can get
    'nuts:least': q => { let most = 0; (function walk(i, left, top){ if(i === q.k){ if(!left) most = Math.max(most, top); return; } for(let v = 1; v <= left; v++) walk(i + 1, left - v, Math.max(top, v)); })(0, q.T, 0); return most; },
    // every choice of one digit per boy's number: the choices that leave all the digits different
    keepdig: q => { const ways = new Set(); (function walk(i, kept){ if(i === q.nums.length){ ways.add(kept.join()); return; } for(const d of new Set(digs(q.nums[i]))) if(!kept.includes(d)) walk(i + 1, kept.concat(d)); })(0, [q.g]);
      return ways.size === 1 ? +[...ways][0].split(',')[1 + q.ask] : ways.size + ' ways'; },
  };
  // sig: what has to match for the generator to have asked the printed task (the whole question, unless a shuffled
  // order makes that too rare to wait for); shows: pieces of the printed text
  const pin = (name, id, q, key, shows, sig) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    const sv = solve[q.kind + ':' + q.shape] || solve[q.kind];
    if(sv && sv(q) !== key[0]) throw new Error(name + ': worked out again it gives ' + sv(q) + ', the key says ' + key);
    [].concat(shows).forEach(s => { if(strip(Q.drawQ(q)).indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q))); });
    const tag = 'mbg-semifinal-' + name.match(/20\d\d/)[0] + '-1';
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const s = sig || JSON.stringify, want = s(q);
    if(pinSeed(name, () => Q.raw(id), g => s(g) === want ? 2 : 0)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Полуфинал 2024 task 5', 175, {kind:'ineq', shape:8, form:0, A:20, L:24, traps:[3], ans:4}, [4], 'Колко числа можем да поставим вместо ■, за да е вярно? 20 + ■ < 24');
  pin('Полуфинал 2024 task 9', 160, {kind:'symeq', shape:'double', x:4, y:3, z:5, s1:12, s2:8, s3:10, ans:5}, [5], 'Колко е ◆, ако: ▲ + ◆ + ☺ = 12 ▲ + ▲ = 8 ☺ + ☺ + ▲ = 10');
  pin('Полуфинал 2024 task 10', 201, {kind:'count', shape:6, one:true, sum:false, natural:false, two:false, a:5, lo:5, hi:9, ans:5}, [5], 'Колко са всички едноцифрени числа, които НЕ са по-малки от 5');
  pin('Полуфинал 2025 task 7', 164, {kind:'count', shape:7, one:true, sum:false, natural:false, two:false, lo:0, hi:9, ans:10}, [10], 'Колко са едноцифрените числа?');
  pin('Полуфинал 2025 task 9', 159, {kind:'named', shape:7, a:0, b:0, sum:true, traps:[11], ans:10}, [10], 'сбора на най-малкото едноцифрено число и най-малкото двуцифрено число');
  pin('Полуфинал 2024 task 17', 216, {kind:'sumdiff', shape:'board', S:20, d:4, small:8, big:12, asksBig:true, traps:[10, 16], ans:12}, [12],
    'На дъската са написани две числа. Иван ги събрал и получил 20. Петър извадил по-малкото от по-голямото и получил 4. Кое е по-голямото число?');
  pin('Полуфинал 2024 task 18', 217, {kind:'asmany', shape:'mid', a:2, b:20, traps:[10, 18, 9], ans:11}, [11], 'Числата от 2 до ☺ са толкова, колкото са числата от ☺ до 20. Кое число е ☺?');
  pin('Полуфинал 2024 task 19', 218, {kind:'notcolor', c:[1, 5, 2], not:[7, 3, 6], ask:1, traps:[3, 8], ans:5}, [5],
    'бели, червени и зелени. 7 балона не са бели, 3 балона не са червени, а 6 балона не са зелени. Колко са червените балони?');
  // the list is shuffled: the generator is met on the same numbers to 12, written in another order
  pin('Полуфинал 2025 task 6', 219, {kind:'count', shape:8, N:12, list:[11, 1, 2, 7, 9, 12, 8], traps:[7, 12], ans:5}, [5],
    'Петър искал да запише на дъската всички числа от 1 до 12, но записал само 11, 1, 2, 7, 9, 12 и 8. Колко числа е пропуснал да запише?',
    q => q.shape + ':' + q.N + ':' + q.list.slice().sort((a, b) => a - b).join());
  pin('Полуфинал 2025 task 5', 220, {kind:'tribo', shape:'fib', t:[1, 1, 2, 3, 5, 8, 13, 21], h:5, ans:8}, [8], '1, 1, 2, 3, 5, ☺, 13, 21');
  pin('Полуфинал 2025 task 17', 221, {kind:'nest', a:2, b:3, empty:false, traps:[6, 5, 8], ans:9}, [9],
    'В една кутия поставили две по-малки, а във всяка от по-малките кутии поставили по три кутии. Колко са всичките кутии?');
  pin('Полуфинал 2025 task 18', 222, {kind:'nuts', shape:'least', k:3, T:5, traps:[2, 4], ans:3}, [3],
    'Пет балона трябва да се раздадат на три деца. Всяко дете трябва да получи поне един балон. Колко най-много балона може да има детето с най-голям брой балони?');
  // Its digits are drawn at random, so the paper's own four numbers are one draw in millions: the generator is met
  // on the same puzzle with other digits — every digit renamed by its part (Мими's, or the one boy i keeps), each
  // number's digits in any order, the same boy asked. The paper's numbers are worked out by the pin itself (solve.keepdig).
  // The key's reading is said in the text: no number is erased whole, so each keeps exactly one digit.
  // the boy who keeps each digit, read off the one way the brute force allows
  const keepSteps = q => { const ways = []; (function walk(i, kept){ if(i === q.nums.length){ ways.push(kept); return; } for(const d of new Set(digs(q.nums[i]))) if(!kept.includes(d)) walk(i + 1, kept.concat(d)); })(0, [q.g]);
    return ways.length === 1 ? ways[0].slice(1).map((d, i) => [i, d]) : []; };
  const kdSig = q => { const name = {}; name[q.g] = 'g'; keepSteps(q).forEach(([i, d]) => { name[d] = String(i); });
    return q.nums.map(v => digs(v).map(d => name[d] || '?').sort().join('')).join('|') + '/' + q.ask; };
  pin('Полуфинал 2025 task 16', 223, {kind:'keepdig', nums:[123, 342, 13], g:1, ask:0, traps:[1, 3], ans:2}, [2],
    ['Алекс записал на дъската 123, Борис записал 342, Васил записал 13, а Мими – 1. След това Мими изтрила няколко цифри от числата на момчетата',
     'На дъската останали 4 различни цифри. Коя от цифрите на Алекс е останала на дъската?'], kdSig);
  if(kdSig({kind:'keepdig', nums:[123, 342, 13], g:1, ask:0}) !== '02g|012|2g/0') throw new Error('keepdig: the paper\'s puzzle is not read as Мими 1, Алекс 2, Борис 4, Васил 3');

  for(let i = 0; i < 3000; i++){
    const n = Q.raw(175);
    if(n.shape === 8 && (solve['ineq:8'](n) !== n.ans || n.A < 15 || n.A > 20 || n.L > 25 || n.traps.includes(n.ans))) fail('ineq bigger numbers: ' + solve['ineq:8'](n), n);
    const y = Q.raw(160);
    if(y.shape === 'double' && (solve['symeq:double'](y) !== y.ans || new Set([y.x, y.y, y.z]).size !== 3 || y.s1 > 20 || y.s3 > 20)) fail('symeq double: ' + solve['symeq:double'](y), y);
    const b = Q.raw(216);
    if(solve['sumdiff:board'](b) !== b.ans || b.S > 20 || b.small < 1 || b.traps.includes(b.ans)) fail('sumdiff board: ' + solve['sumdiff:board'](b), b);
    const m = Q.raw(217);
    if(solve['asmany:mid'](m) !== m.ans || m.a < 1 || m.a > 9 || m.b < 14 || m.b > 30 || m.traps.includes(m.ans)) fail('asmany mid: ' + solve['asmany:mid'](m), m);
    const c = Q.raw(218);
    if(solve.notcolor(c) !== c.ans || c.c.some(v => v < 1) || c.not.reduce((s, v) => s + v, 0) > 20 || c.traps.includes(c.ans)) fail('notcolor: ' + solve.notcolor(c), c);
    const w = Q.raw(219);
    if(solve['count:8'](w) !== w.ans || new Set(w.list).size !== w.list.length || w.list.some(v => v < 1 || v > w.N) || w.list.length < 4 || w.list.length > w.N - 2 || w.N < 8 || w.N > 15) fail('count missed: ' + solve['count:8'](w), w);
    const f = Q.raw(220);
    if(solve['tribo:fib'](f) !== f.ans || f.h < 4 || f.h > f.t.length - 2 || Math.max(...f.t) > 40) fail('fib: ' + solve['tribo:fib'](f), f);
    if((strip(Q.drawQ(f)).match(/☺/g) || []).length !== 3) fail('fib: the row does not hide exactly one number (the ask and the answer line name ☺ too)', f);
    const x = Q.raw(221);
    if(solve.nest(x) !== x.ans || x.a < 2 || x.a > 4 || x.b < 2 || x.b > 4 || x.traps.includes(x.ans)) fail('nest: ' + solve.nest(x), x);
    const u = Q.raw(222);
    if(solve['nuts:least'](u) !== u.ans || u.k < 3 || u.k > 4 || u.T < u.k + 2 || u.T > u.k + 8 || u.traps.includes(u.ans)) fail('nuts least: ' + solve['nuts:least'](u), u);
    const k = Q.raw(223);
    if(solve.keepdig(k) !== k.ans || k.nums.some(v => String(v).length < 2 || String(v).length > 3 || new Set(digs(v)).size !== String(v).length || digs(v).includes(0)) || k.traps.includes(k.ans)) fail('keepdig: ' + solve.keepdig(k), k);
  }
  console.log('МБГ Полуфинал 2024 and 2025, 1 клас (builder D): 2024 tasks 5, 9, 10, 17, 18, 19 and 2025 tasks 5, 6, 7, 9, 16, 17, 18 match the key and their levels ask them; the box with bigger numbers, ▲ ◆ ☺, the board, ☺ in the middle, the colours, the missed numbers, two before, boxes in boxes, at least one and the kept digits worked out again by brute force');
}
