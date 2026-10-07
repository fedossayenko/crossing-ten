// Runs beside the app (in check.js's own scope, through eval), like check/grade1d-A.js.
// МБГ Есен 2024 and 2023, 3 клас — the expressions: mulmix 59, mulbr 231, zeros 61, twosigns 63, erasemul 232, fruiteq 233,
// backx 234 and regroup 235. Each printed task against the official key, drawn as printed and asked exactly by its level,
// then the new shapes and kinds worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const text = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const calc = e => Function('return ' + e.replace(/·/g, '*').replace(/−/g, '-').replace(/:/g, '/'))();
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const tagged = (name, id) => {
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-autumn-' + name.match(/20\d\d/)[0] + '-3')) throw new Error('level ' + id + ' is not tagged ' + name);
  };
  const pin = (name, id, q, key, shows, tries) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    tagged(name, id);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0, tries)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Есен 2024 task 1', 59, {kind:'mulmix', shape:'zero', a:7, b:3, c:2, z:2, e:2, f:4, ans:9, traps:[7, 8]}, [9], 'Пресметнете 7 − 3 · 2 − 2 · 0 + 2 · 4', 3e6);
  pin('Есен 2023 task 1', 59, {kind:'mulmix', shape:'zero', a:20, b:2, c:3, z:2, e:2, f:3, ans:20, traps:[18, 6]}, [20], 'Пресметнете 20 − 2 · 3 − 2 · 0 + 2 · 3', 3e6);
  pin('Есен 2024 task 2', 231, {kind:'mulbr', shape:2, n:12, v:[3, 2, 1], m:12, P:6, traps:[78], ans:18}, [18], 'Пресметнете (12 − 9) · (12 − 10) · (12 − 11) + 12');
  pin('Есен 2023 task 2', 231, {kind:'mulbr', shape:2, n:3, v:[2, 1, 0], m:1, P:0, traps:[3, 2], ans:1}, [1], 'Пресметнете (3 − 1) · (3 − 2) · (3 − 3) + 1');
  pin('Есен 2024 task 3', 61, {kind:'zeros', shape:'div', a:2, b:2, c:4, e:2, f:4, g:2, h:2, S:8, P:8, k:1, ans:0, traps:[]}, [0], 'Пресметнете (2 + 0 + 2 + 4) : (2 · 0 + 2 · 4) · 2 − 2', 3e6);
  pin('Есен 2023 task 4', 61, {kind:'zeros', shape:'sub', b:2, c:3, t:7, A:20, N:16, ans:9, traps:[1, 2]}, [9], 'Пресметнете 16 − (20 − 2 · 3) : (2 + 0 · 2 · 3)', 3e6);
  // task 5 prints 13 × 52 × 6; the app writes every product with ·
  pin('Есен 2024 task 5', 232, {kind:'erasemul', shape:'near', nums:[13, 52, 6], T:35, best:36, kept:[3, 2, 6], gone:[1, 5], traps:[36, 5], ans:6}, [6],
    'Изтрийте две цифри в записа 13 · 52 · 6 така че резултатът да бъде възможно най-близък до 35. Колко е сборът от изтритите цифри?', 1e7);
  // ❀ and ❁ are drawn as flowers, so the text shows only their numbers
  pin('Есен 2024 task 6', 233, {kind:'fruiteq', shape:'sum', x:1, y:7, cx:3, cy:2, S:8, T:17, traps:[17], ans:25}, [25], 'Пресметнете 4 · + 3 · , ако + = 8 3 · + 2 · = 17');
  pin('Есен 2023 task 5', 233, {kind:'fruiteq', shape:'diff', x:7, y:3, cx:1, cy:3, S:10, T:16, traps:[6, 7], ans:4}, [4], 'Пресметнете − , ако + = 10 + 3 · = 16');
  pin('Есен 2024 task 9', 234, {kind:'backx', shape:'sum', a:2, b:3, c:4, t:0, R:0, n:9, m:5, k:9, traps:[45], ans:0}, [0],
    'Кое число трябва да поставим вместо x? ((x : 2) · 3) · 4 = 5 · 9 − (1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9)');
  // task 19 asks «Кое число трябва да поставим вместо x, така че … ?»; the level asks the question first, then the equality
  pin('Есен 2023 task 19', 234, {kind:'backx', shape:'num', a:2, b:4, c:8, t:2, R:64, traps:[2, 8], ans:4}, [4], 'Кое число трябва да поставим вместо x? ((x : 2) · 4) · 8 = 64');
  pin('Есен 2023 task 10', 235, {kind:'regroup', f:[2, 2, 3, 3, 4], lens:[2, 2, 1], hide:2, shown:[4, 9], traps:[144], ans:4}, [4], 'Кое е числото N, ако 2 · 2 · 3 · 3 · 4 = 4 · 9 · N');
  // the 6 and the 1 of task 5 by hand: one digit from each two-digit number, 30, 12, 90, 36
  if(Q.eraseWays([13, 52, 6], 2).map(w => w.vals.reduce((a, b) => a*b, 1)).sort((a, b) => a - b).join() !== '12,30,36,90') throw new Error('Есен 2024 task 5: 13 · 52 · 6 should make 12, 30, 36, 90');
  // erasemul 'near' by brute force: every two of the digits erased, and the ways that come closest to T. The text does not
  // say every number keeps a digit, so it is read both ways: a number left with none is not allowed, or (drop) it drops
  // out and the rest are multiplied, as "25 · 1 ·" for 25 · 31 · 4. The answer has to be the same, and one, either way.
  const nearBrute = (nums, T, drop) => {
    const digs = nums.map(String), flat = [], all = [];
    digs.forEach((d, k) => d.split('').forEach((_, j) => flat.push([k, j])));
    for(let x = 0; x < flat.length; x++) for(let y = x + 1; y < flat.length; y++){
      const left = digs.map((d, k) => d.split('').filter((_, j) => !(flat[x][0] === k && flat[x][1] === j) && !(flat[y][0] === k && flat[y][1] === j)).join(''));
      if(!drop && left.some(d => d === '')) continue;
      all.push({ p: left.filter(d => d !== '').reduce((u, d) => u*+d, 1), gone: +digs[flat[x][0]][flat[x][1]] + +digs[flat[y][0]][flat[y][1]] });
    }
    const min = Math.min(...all.map(w => Math.abs(w.p - T)));
    return { all, min, close: all.filter(w => Math.abs(w.p - T) === min) };
  };
  {
    const keep = nearBrute([13, 52, 6], 35, false), drop = nearBrute([13, 52, 6], 35, true);
    if(keep.min !== 1 || keep.close.some(w => w.p !== 36 || w.gone !== 6) || drop.close.some(w => w.gone !== 6)) throw new Error('Есен 2024 task 5: 13 · 52 · 6 near 35 should erase digits adding to 6, read either way');
  }

  // task 4 (2024) and 3 (2023): the А/Б/В/Г options are the app's own (the paper's answer is written in), so the printed
  // question is everything else: the numbers, the right side, and the one pair of signs that fits it
  const sigSigns = g => JSON.stringify([g.shape, g.a, g.b, g.c, g.d, g.fac || g.rhs || null, g.val, g.pair]);
  const pinSigns = (name, q, key, shows, tries) => {
    const hits = Q.SIGN_PAIRS.filter(([x, y]) => Q.twoSignsVal(q.a, q.b, q.c, q.d, x, y) === q.val);
    if(hits.length !== 1 || hits[0].join() !== key.join()) throw new Error(name + ': the signs that fit are ' + hits.map(h => h.join(' ')).join(', ') + ', the key says ' + key.join(' '));
    tagged(name, 63);
    const want = sigSigns(q), hit = pinSeed(name, () => Q.raw(63), g => g.kind === 'twosigns' && sigSigns(g) === want ? 2 : 0, tries);
    if(!hit) throw new Error(name + ': level 63 never asks the printed question');
    const g = hit.q;
    if(g.options[g.pick].signs.join() !== key.join() || !Q.accepts(g, [String(g.pick)])) fail(name + ': the right option is not the key', g);
    if(strip(Q.drawQ(g)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(g)));
  };
  pinSigns('Есен 2024 task 4', {shape:'prod', a:1, b:2, c:3, d:6, fac:[2, 2, 3, 3], val:36, pair:['+', '·']}, ['+', '·'], '(1 □ 2 + 3) □ 6 = 2 · 2 · 3 · 3', 3e6);
  pinSigns('Есен 2023 task 3', {shape:'two', a:20, b:2, c:0, d:3, fac:null, val:6, pair:['−', ':']}, ['−', ':'], '(20 □ 2) □ 3 = 6', 3e6);

  const seen = {zero:0, plus:0, plusZero:0, div:0, sub:0, prod:0, two:0, near:0, sum:0, diff:0, num:0, sumx:0, sumxZero:0, regroup:0};
  const expr = (q, from, to) => { const s = text(Q.drawQ(q)), i = s.indexOf(from) + from.length; return s.slice(i, to ? s.indexOf(to, i) : undefined).trim(); };
  for(let i = 0; i < 3000; i++){
    // 59 'zero': the drawn line worked out as JavaScript does it
    const m = Q.raw(59);
    if(m.shape === 'zero'){ seen.zero++; if(calc(expr(m, 'Пресметнете')) !== m.ans || / · 0 /.test(Q.mulMixExpr(m)) !== true) fail('mulmix zero', m); }
    // 231: the drawn line worked out, and the brackets count down by one to 0 at the least
    const b = Q.raw(231), br = expr(b, 'Пресметнете', ' =').match(/\((\d+) − (\d+)\)/g).map(s => calc(s));
    seen.plus++; if(br[2] === 0) seen.plusZero++;
    if(calc(expr(b, 'Пресметнете', ' =')) !== b.ans || br[1] !== br[0] - 1 || br[2] !== br[1] - 1 || br[2] < 0) fail('mulbr plus: ' + br, b);
    // 61 'div' and 'sub': the drawn line worked out; every product with a 0 in it is there
    const z = Q.raw(61);
    if(z.shape === 'div' || z.shape === 'sub'){
      seen[z.shape]++; const e = expr(z, 'Пресметнете');
      if(calc(e) !== z.ans || !/ · 0 | 0 · /.test(e) || !e.includes(' : ')) fail('zeros ' + z.shape + ': ' + e, z);
    }
    // 63 'prod': the right side a product of three or more factors, none above 7; 'two': no + c in the bracket
    const s = Q.raw(63);
    if(s.shape === 'prod'){ seen.prod++; if(s.fac.length < 3 || s.fac.some(f => f < 2 || f > 7) || s.fac.reduce((x, y) => x*y, 1) !== s.val) fail('twosigns prod', s); }
    if(s.shape === 'two'){ seen.two++; if(s.c !== 0 || /\+ 0\)/.test(text(Q.drawQ(s)))) fail('twosigns two', s); }
    // 232: every way of erasing two of the digits, tried; T is not reached, one product is closest, and every way to it
    // erases the same digits' sum; and with an emptied number allowed to drop out, the closest ways still erase that sum
    const n = Q.raw(232); seen.near++;
    {
      const { all, min, close } = nearBrute(n.nums, n.T, false), drop = nearBrute(n.nums, n.T, true);
      if(min === 0 || new Set(close.map(w => w.p)).size !== 1 || close.some(w => w.gone !== n.ans) || close[0].p !== n.best) fail('erasemul near: ' + JSON.stringify(all), n);
      if(drop.close.some(w => w.gone !== n.ans)) fail('erasemul near, an emptied number dropped: the closest ways ' + JSON.stringify(drop.close), n);
    }
    // 233: every ❀ and ❁ from 0 to 40 tried against both lines; one pair fits, and it gives the answer
    const f = Q.raw(233); seen[f.shape]++;
    {
      const fit = [];
      for(let x = 0; x <= 40; x++) for(let y = 0; y <= 40; y++) if(x + y === f.S && f.cx*x + f.cy*y === f.T) fit.push([x, y]);
      const [x, y] = fit[0] || [], want = f.shape === 'sum' ? (f.cx + 1)*x + (f.cy + 1)*y : Math.abs(x - y);
      if(fit.length !== 1 || want !== f.ans || x === y || (f.shape === 'diff' && Math.min(f.cx, f.cy) !== 1)) fail('fruiteq flowers: ' + JSON.stringify(fit), f);
      if(strip(Q.drawQ(f)).indexOf('=' + f.S) < 0 || strip(Q.drawQ(f)).indexOf('=' + f.T) < 0) fail('fruiteq flowers: the lines are not drawn', f);
    }
    // 234: every x from 0 to 2000 put into the drawn left side, against the drawn right side worked out
    const k = Q.raw(234), eq = expr(k, '?', ' x =').split(' = ');
    seen[k.shape === 'sum' ? 'sumx' : 'num']++; if(k.shape === 'sum' && k.ans === 0) seen.sumxZero++;
    {
      const rhs = calc(eq[1]), fit = [];
      for(let x = 0; x <= 2000; x++) if(x % k.a === 0 && calc(eq[0].replace('x', String(x))) === rhs) fit.push(x);
      if(fit.join() !== String(k.ans) || rhs < 0 || (k.shape === 'sum' && !eq[1].includes('(1 + 2 + 3 + 4'))) fail('backx: ' + eq.join(' = ') + ' fits ' + fit, k);
    }
    // 235: every N from 1 to 5000; and the right side's numbers are runs of the left side's factors
    const r = Q.raw(235); seen.regroup++;
    {
      const L = r.f.reduce((x, y) => x*y, 1), Rp = r.shown.reduce((x, y) => x*y, 1), fit = [];
      for(let N = 1; N <= 5000; N++) if(Rp*N === L) fit.push(N);
      if(fit.join() !== String(r.ans) || r.f.length !== 5 || r.f.some((v, j) => v < 2 || v > 5 || (j && v < r.f[j - 1]))) fail('regroup: N fits ' + fit, r);
      if(strip(Q.drawQ(r)).indexOf(r.f.join('·') + '=' + r.shown.join('·') + '·N') < 0) fail('regroup: not drawn as asked', r);
    }
  }
  for(const s in seen) if(!seen[s]) throw new Error('never drawn in 3000: ' + s + ' ' + JSON.stringify(seen));
  console.log('МБГ Есен 2024 and 2023, 3 клас, the expressions: 2024 tasks 1, 2, 3, 4, 5, 6, 9 and 2023 tasks 1, 2, 3, 4, 5, 10, 19 match the key and are asked exactly by their levels; ' +
    Object.keys(seen).map(s => seen[s] + ' ' + s).join(', ') + ' worked out again by brute force');
}
