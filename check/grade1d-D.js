// Runs beside the app (in check.js's own scope, through eval), like check/grade1c-D.js.
// МБГ Полуфинал 2022 and 2023, 1 клас — the tasks on symeq, sumdiff, asmany, notcolor, bowl, count and grow: each
// printed task against the official key, drawn as printed and met by its level's own generator, then every new shape
// worked out again by brute force.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const run = (a, b) => Array.from({length: b - a + 1}, (_, i) => a + i);
  const one = f => f.length === 1 ? f[0] : 'fits ' + f;
  // the brute force for each shape: the answer found again from what the question states, or a reason it is wrong
  const solve = {
    // every □ from 0 to 20 and every ∆ up to 60 against the two lines, then what is asked
    'symeq:triple': q => { const f = []; for(let s = 0; s <= 20; s++) for(let t = 0; t <= 60; t++) if(s === q.k && t === s + s + s) f.push([t - s, t + s, t][q.ask]); return one(f); },
    // every ○ and □ from 0 to 20 along the two arrows
    'symeq:arrow': q => { const f = []; for(let o = 0; o <= 20; o++) for(let s = 0; s <= 20; s++) if(o + q.a === q.b && q.b + s === o + o) f.push(s); return one(f); },
    // every □, ☻ and ʘ from 0 to 20 against the three lines
    'symeq:direct': q => { const f = []; for(let x = 0; x <= 20; x++) for(let y = 0; y <= 20; y++) for(let z = 0; z <= 20; z++) if(x + x + x === q.s1 && y + y === q.s2 && y + z + x === q.s3) f.push(z); return one(f); },
    // every ○, ● and □ from 0 to 20
    'symeq:part': q => { const f = []; for(let o = 0; o <= 20; o++) for(let d = 0; d <= 20; d++) for(let s = 0; s <= 20; s++) if(o + d + s === q.T && o + d === q.a && (q.rel ? s === o + q.d : d + s === q.b)) f.push(d); return one(f); },
    // every pair of numbers up to 40 with that sum and that difference
    'sumdiff:board': q => { const f = []; for(let p = 0; p <= 40; p++) for(let s = 0; s <= p; s++) if(p + s === q.S && p - s === q.d) f.push(q.asksBig ? p : s); return one(f); },
    // every ☺ from the one end to the other, both runs counted number by number
    'asmany:mid': q => one(run(q.a, q.b).filter(m => run(q.a, m).length === run(m, q.b).length)),
    // every white, red and green count from 0 to 20 against the three «not» statements
    notcolor: q => { const f = []; for(let w = 0; w <= 20; w++) for(let r = 0; r <= 20; r++) for(let g = 0; g <= 20; g++) if(r + g === q.not[0] && w + g === q.not[1] && w + r === q.not[2]) f.push([w, r, g][q.ask]); return one(f); },
    // every count of lemons against the yellow fruit
    bowl: q => one(run(0, 30).filter(l => q.k + l === q.Y).map(l => q.A + l)),
    // the one-digit numbers 0 … 9, those not less than a
    'count:6': q => run(0, 9).filter(v => v >= q.a).length,
    // the numbers from 0 that are not greater than n, added one by one — and there are as many as the text says
    'count:0': q => { const ns = run(0, 30).filter(v => v <= q.n); return q.told && strip(Q.drawQ(q)).indexOf(',са' + ns.length + '.') < 0 ? 'the text does not say ' + ns.length : ns.reduce((t, v) => t + v, 0); },
    // the minuend and the subtrahend moved one step at a time, then the new difference counted up from one to the other
    'grow:diff': q => { let m = q.M, s = q.S; for(let i = 0; i < q.a; i++) m += q.mUp ? 1 : -1; for(let i = 0; i < q.b; i++) s += q.sUp ? 1 : -1; let n = 0; while(s + n < m) n++; return s + n === m ? n : 'below the subtrahend'; },
  };
  const pin = (name, id, q, key, shows) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    const sv = solve[q.kind + ':' + q.shape] || solve[q.kind];
    if(sv && sv(q) !== key[0]) throw new Error(name + ': worked out again it gives ' + sv(q) + ', the key says ' + key);
    [].concat(shows).forEach(s => { if(strip(Q.drawQ(q)).indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q))); });
    const tag = 'mbg-semifinal-' + name.match(/20\d\d/)[0] + '-1';
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Полуфинал 2022 task 4', 160, {kind:'symeq', shape:'triple', k:3, ask:0, tri:9, traps:[9], ans:6}, [6], 'Колко е ∆ − □, ако: □ = 3 ∆ = □ + □ + □');
  pin('Полуфинал 2022 task 10', 160, {kind:'symeq', shape:'part', rel:false, o:2, f:1, s:3, T:6, a:3, b:4, d:1, ans:1}, [1], 'Колко е ●, ако: ○ + ● + □ = 6 ○ + ● = 3 ● + □ = 4');
  pin('Полуфинал 2022 task 11', 160, {kind:'symeq', shape:'arrow', x:4, a:1, b:5, traps:[4, 8], ans:3}, [3], 'Колко е □, ако: ○ ⟶ +1 5 ⟶ +□ ○ + ○');
  pin('Полуфинал 2023 task 9', 160, {kind:'symeq', shape:'direct', x:2, y:4, z:5, s1:6, s2:8, s3:11, ans:5}, [5], 'Колко е ʘ, ако: □ + □ + □ = 6 ☻ + ☻ = 8 ☻ + ʘ + □ = 11');
  pin('Полуфинал 2023 task 17', 216, {kind:'sumdiff', shape:'board', S:22, d:12, small:5, big:17, asksBig:true, traps:[11, 10], ans:17, plain:true}, [17],
    'Разликата на две числа е 12, а сборът им е 22. Кое е по-голямото число?');
  pin('Полуфинал 2023 task 18', 217, {kind:'asmany', shape:'mid', a:10, b:32, traps:[16, 22, 11], ans:21}, [21], 'Числата от 10 до ☺ са толкова, колкото са числата от ☺ до 32. Кое число е ☺?');
  pin('Полуфинал 2023 task 19', 218, {kind:'notcolor', c:[1, 2, 4], not:[6, 5, 3], ask:2, traps:[3, 7], ans:4}, [4],
    'бели, червени и зелени. 6 балона не са бели, 5 балона не са червени, а 3 балона не са зелени. Колко са зелените балони?');
  pin('Полуфинал 2022 task 17', 190, {kind:'bowl', A:6, k:4, Y:11, traps:[17, 9], ans:13}, [13],
    'Във фруктиера има ябълки и лимони. Ябълките са 6, от които 4 са жълти. Жълтите плодове са общо 11. Колко общо са плодовете във фруктиерата?');
  pin('Полуфинал 2022 task 18', 201, {kind:'count', shape:6, one:true, sum:false, natural:false, two:false, a:6, lo:6, hi:9, ans:4}, [4], 'едноцифрени числа, които НЕ са по-малки от 6?');
  pin('Полуфинал 2023 task 10', 164, {kind:'count', shape:0, sum:true, natural:false, two:false, n:3, lo:0, hi:3, ans:6, told:true}, [6], 'Числата, които не са по-големи от 3, са 4. Пресметнете сбора им.');
  pin('Полуфинал 2022 task 20', 230, {kind:'grow', shape:'diff', M:8, S:3, a:1, b:2, mUp:false, sUp:true, M2:7, S2:5, traps:[6], ans:2}, [2],
    'В разликата 8 − 3 умаляемото е намалено с 1, а умалителят е увеличен с 2. Колко е новата разлика?');

  for(let i = 0; i < 3000; i++){
    const y = Q.raw(160), sv = solve['symeq:' + y.shape];
    if(['triple', 'arrow', 'direct'].includes(y.shape) && (sv(y) !== y.ans || y.ans < 1 || y.ans > 20 || (y.traps || []).includes(y.ans))) fail('symeq ' + y.shape + ': ' + sv(y), y);
    if(y.shape === 'triple' && (y.k < 2 || y.k > 6)) fail('symeq triple: □ outside 2 … 6', y);
    if(y.shape === 'arrow' && (y.x < 2 || y.x > 9 || y.a < 1 || y.a > 3)) fail('symeq arrow: ○ outside 2 … 9 or a step outside 1 … 3', y);
    if(y.shape === 'direct' && (y.x > 5 || y.y > 8 || y.z > 8 || new Set([y.x, y.y, y.z]).size !== 3 || y.s3 > 20)) fail('symeq direct', y);
    const b = Q.raw(216);
    if(b.d > 12 || b.S > 22 || strip(Q.drawQ(b)).includes('дъската') === !!b.plain) fail('sumdiff board: the difference past 12, or the board told in the plain wording (or missing from the story)', b);
    const c = Q.raw(164);
    if(c.told && (c.shape !== 0 || !c.sum || c.natural || solve['count:0'](c) !== c.ans)) fail('count told: ' + solve['count:0'](c), c);
    const g = Q.raw(230);
    if(solve['grow:diff'](g) !== g.ans || g.M < 6 || g.M > 20 || g.S < 2 || g.S >= g.M || g.a < 1 || g.a > 3 || g.b < 1 || g.b > 3 || [g.M2, g.S2, g.ans].some(v => v < 0 || v > 20) || g.traps.includes(g.ans)) fail('grow short: ' + solve['grow:diff'](g), g);
  }
  console.log('МБГ Полуфинал 2022 and 2023, 1 клас (builder D): 2022 tasks 4, 10, 11, 17, 18, 20 and 2023 tasks 9, 10, 17, 18, 19 match the key and their levels ask them; ∆ = □ + □ + □, the arrows, □ ☻ ʘ, the plain sum and difference, the counted sum and the new difference worked out again by brute force');
}
