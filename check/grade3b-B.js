// Runs beside the app (in check.js's own scope, through eval), like check/grade1d-A.js.
// МБГ Есен 2024 and 2023, 3 клас — digits, numbers and sequences: oddprod 241, boxdig 242, sqsum 243 and 244, abcde 245,
// tabrule 246, missing 247, swapone 248. Each printed task against the official key, drawn as printed and asked exactly by
// its level; then each answer worked out again another way, on the printed task and on every level's own questions.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const tag = name => 'mbg-autumn-' + name.match(/20\d\d/)[0] + '-3';
  // the text of the first element of a class, as shown (tags out, entities read)
  const part = (q, cls) => { const m = Q.drawQ(q).match(new RegExp('class="' + cls + '"[^>]*>(.*?)</div>')); return m ? m[1].replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ') : ''; };
  const calc = e => Function('return ' + e.replace(/·/g, '*').replace(/−/g, '-').replace(/:/g, '/'))();

  const ABC_SEEN = {};   // each form searched once
  // 244: the property asked, read off the question as drawn
  const leastHas = q => {
    const ask = part(q, 'ask'), k = (ask.match(/(?:се дели на|завършва на) (\d)\?/) || [])[1];
    return /два равни множителя/.test(ask) ? v => { for(let M = 1; M*M <= v; M++) if(M*M === v) return true; return false; }
      : /се дели на/.test(ask) ? v => v % +k === 0
      : /завършва на/.test(ask) ? v => String(v).endsWith(k)
      : /две еднакви цифри/.test(ask) ? v => String(v).length === 2 && String(v)[0] === String(v)[1] : fail('sqsum: what is asked', q);
  };
  // Each kind's answer found another way. Each returns the answers it finds, sorted.
  const BRUTE = {
    // every pair of numbers below a thousand with the asked parity and difference, by their products' last digits
    oddprod: q => {
      const ends = new Set();
      for(let x = 0; x < 1000; x++) if(q.par === 'all' || x % 2 === (q.par === 'odd' ? 1 : 0)) ends.add(x*(x + q.d) % 10);
      return [...ends].sort((a, b) => a - b);
    },
    // every digit put in the boxes of the inequality as it is drawn; the one that fits, or the largest or smallest asked for
    boxdig: q => {
      const t = part(q, 'given'), ask = part(q, 'ask');
      if((t.match(/□/g) || []).length !== 2) fail('boxdig: two boxes', q);
      const fit = [...Array(10).keys()].filter(x => calc(t.replace(/□/g, String(x)).replace('=', '===')));
      if(!fit.length || fit.length === 10) fail('boxdig: every digit fits, or none', q);
      return /най-голямата/.test(ask) ? [fit[fit.length - 1]] : /най-малката/.test(ask) ? [fit[0]] : fit;
    },
    // the sum as drawn, and the number that times itself makes it; from a start, the numbers added on until a sum has
    // the property asked (within 100)
    sqsum: q => {
      if(q.shape === 'least'){
        if(!part(q, 'ask').includes('N > ' + q.a + ',')) fail('sqsum: not N > ' + q.a, q);
        const has = leastHas(q);
        for(let N = q.a + 1, s = q.a + N; s <= 100; N++, s += N) if(has(s)) return N >= q.a + 2 && s === q.S ? [N] : fail('sqsum: the sum ' + s + ' at ' + N, q);
        return [];
      }
      const t = part(q, 'given'), s = calc(t.split('=')[0]), terms = t.split('=')[0].split('+').map(Number);
      if(q.shape === 'odd' && terms.some((v, i) => v !== 2*i + 1)) fail('sqsum: not the odd numbers from 1', q);
      if(q.shape === 'updown' && terms.some((v, i) => v !== Math.min(i + 1, terms.length - i))) fail('sqsum: not up and back down', q);
      return [...Array(20).keys()].filter(M => M*M === s);
    },
    // every pair of numbers of those lengths with different digits, a number of two or more never starting with 0
    abcde: q => {
      const key = q.lens + (q.max ? ' max' : ' min');
      if(ABC_SEEN[key] !== undefined) return [ABC_SEEN[key]];
      const nums = L => [...Array(10 ** L).keys()].filter(v => (L === 1 || v >= 10 ** (L - 1)) && new Set(String(v)).size === L)
        .map(v => [v, [...String(v)].reduce((m, c) => m | 1 << +c, 0)]);
      const [A, B] = q.lens.map(nums);
      let best = null;
      A.forEach(([x, mx]) => B.forEach(([y, my]) => { if(!(mx & my) && (best === null || (q.max ? x + y > best : x + y < best))) best = x + y; }));
      return [ABC_SEEN[key] = best];
    },
    // every rule of a family that fits the seven numbers shown — each digit squared, doubled, tripled, one or two added,
    // left as it is, side by side; the whole number times 2 … 9, or with 1 … 99 added — and what it puts under the ?
    tabrule: q => {
      const one = [d => d*d, d => 2*d, d => 3*d, d => d + 1, d => d + 2, d => d], rules = [];
      one.forEach(f => one.forEach(g => rules.push(v => +(String(f(Math.floor(v / 10))) + g(v % 10)))));
      for(let k = 2; k <= 9; k++) rules.push(v => k*v);
      for(let c = 1; c < 100; c++) rules.push(v => v + c);
      const fit = rules.filter(r => q.top.every((v, i) => i === q.h || r(v) === q.low[i]));
      return [...new Set(fit.map(r => r(q.top[q.h])))].sort((a, b) => a - b);
    },
    // the run as drawn: its step, then counting on from the third number to the one before last
    missing: q => {
      const vs = part(q, 'seq').split(/,\s*/).filter(v => v !== '…').map(Number), k = vs[1] - vs[0];
      if(vs.length !== 5 || vs[2] - vs[1] !== k || vs[4] - vs[3] !== k || (vs[3] - vs[2]) % k) fail('missing: the run as drawn', q);
      let n = 0;
      for(let v = vs[2] + k; v < vs[3]; v += k) n++;
      return [n];
    },
    // every number from 0 to 300 in every place: the divisions exact, nothing below 0, and the value moved by exactly the change
    swapone: q => {
      const val = n => n[1] && n[5] && n[0] % n[1] === 0 && n[4] % n[5] === 0 && n[0] / n[1] + n[2]*n[3] >= n[4] / n[5] ? n[0] / n[1] + n[2]*n[3] - n[4] / n[5] : null;
      if(calc(part(q, 'given')) !== q.V || val(q.n) !== q.V) fail('swapone: the value', q);
      if(!Q.drawQ(q).includes((q.by < 0 ? 'намали' : 'увеличи') + ' с ' + Math.abs(q.by))) fail('swapone: the change', q);
      const can = [], cannot = [];
      q.n.forEach((v, i) => { const hits = [];
        for(let x = 0; x <= 300; x++) if(x !== v){ const m = q.n.slice(); m[i] = x; if(val(m) === q.V + q.by) hits.push(x); }
        if(hits.includes(0)) fail('swapone: a number would become 0', q);
        if(hits.length > 1 || (hits[0] || 0) !== q.to[i]) fail('swapone: place ' + i + ' takes ' + hits, q);
        (hits.length ? can : cannot).push(v); });
      if(new Set(can).size !== can.length || can.some(v => cannot.includes(v)) || can.length < 2) fail('swapone: the numbers that can change do not read one way, or are fewer than two', q);
      return [can.reduce((s, v) => s + v, 0)];
    },
  };
  const check = (q, name) => {
    const want = BRUTE[q.kind](q), got = Q.answers(q).slice().sort((a, b) => a - b);
    if(want.join() !== got.join()) fail((name || q.kind) + ': worked out again it is ' + want + ', not ' + got, q);
  };

  // the printed task: the key, the drawing (its pieces, in order), the paper's tag, worked out again, and the level asking exactly it
  const pin = (name, id, q, key, shows, tries = 300000) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error(name + ': the key is not accepted');
    const text = strip(Q.drawQ(q));
    [].concat(shows).reduce((at, s) => { const k = text.indexOf(s.replace(/\s+/g, ''), at); if(k < 0) throw new Error(name + ' is not drawn as printed: ' + text); return k + 1; }, 0);
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag(name))) throw new Error('level ' + id + ' is not tagged ' + name);
    check(q, name);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0, tries)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  // «any» even numbers: 12 · 14 = 168 ends as 2 · 4 does, so the one-digit pairs and 8 · 10 are all there is
  pin('Есен 2024 task 7', 241, {kind:'oddprod', shape:'any', par:'even', d:2, pairs:[[0, 2], [2, 4], [4, 6], [6, 8], [8, 10]], slots:3, ans:0, alt:[4, 8]}, [0, 4, 8],
    'Кои са възможните цифри на единиците на произведението на две последователни четни числа?');
  // □ is the units digit of both numbers (2024) and a factor of both products (2023)
  // (one question of about 90 000 the level asks: the search, only after a generator change, gets 2e6 tries)
  pin('Есен 2024 task 8', 242, {kind:'boxdig', shape:'last', a:20, b:22, p:1, r:1, rel:'<', ask:'one', traps:[1], ans:0}, [0],
    ['Коя цифра трябва да поставим вместо □, така че да е вярно?', '20□ + 22□ < 201 + 221'], 2e6);
  pin('Есен 2023 task 8', 242, {kind:'boxdig', shape:'mul', a:20, b:23, p:1, r:1, rel:'<', ask:'one', traps:[1], ans:0}, [0],
    ['Коя цифра трябва да поставим вместо □, така че да е вярно?', '20 · □ + 23 · □ < 20 · 1 + 23 · 1']);
  pin('Есен 2024 task 19', 243, {kind:'sqsum', shape:'odd', k:8, traps:[64], ans:8}, [8], ['Пресметнете M, ако', '1 + 3 + 5 + 7 + 9 + 11 + 13 + 15 = M · M']);
  pin('Есен 2023 task 16', 244, {kind:'sqsum', shape:'least', a:1, prop:'sq', k:null, N:8, S:36, traps:[6], ans:8}, [8],
    ['Кое е най-малкото естествено число N, N > 1, за което сборът от всички естествени числа от 1 до N е число, което е произведение на два равни множителя?', '1 + 2 + 3 + … + N = M · M']);
  // the overlined ABC and DE: a three-digit and a two-digit number
  pin('Есен 2024 task 20', 245, {kind:'abcde', lens:[3, 2], max:false, dig:[1, 0, 3, 2, 4], traps:[136], ans:127}, [127],
    ['Ако на различните букви съответстват различни цифри, пресметнете най-малкия възможен сбор', 'ABC + DE']);
  // the table, column by column: the number above, the number below
  pin('Есен 2023 task 6', 246, {kind:'tabrule', rule:'sq', top:[11, 12, 21, 22, 31, 32, 41, 42], low:[11, 14, 41, 44, 91, 94, 161, 164], h:5, traps:[13], ans:94}, [94],
    ['Кое е пропуснатото число?', '11 11 12 14 21 41 22 44 31 91 32 ? 41 161 42 164']);
  pin('Есен 2023 task 7', 247, {kind:'missing', shape:'many', run:[3, 6, 9, 12, 15, 18, 21, 24, 27, 30], traps:[6, 10], ans:5}, [5], ['Колко числа са пропуснати?', '3, 6, 9, …, 27, 30']);
  // 6 → 9, 3 → 2, 10 → 8; the 2 · 2 would have to make 5 and 10 : □ would have to make 4
  pin('Есен 2023 task 18', 248, {kind:'swapone', n:[6, 3, 2, 2, 10, 2], by:1, V:1, to:[9, 2, 0, 0, 8, 0], traps:[16, 25], ans:19}, [19],
    ['В израза', '6 : 3 + 2 · 2 − 10 : 2', 'заменете точно едно от участващите числа с друго число, така че първоначалната стойност на израза да се увеличи с 1. Колко е сборът на числата в израза, които е възможно да се заменят?']);

  // every level's own questions, worked out again; each shape and form met
  const seen = {}, see = k => { seen[k] = (seen[k] || 0) + 1; };
  [241, 242, 243, 244, 245, 246, 247, 248].forEach(id => { for(let i = 0; i < 400; i++){
    const q = Q.raw(id);
    check(q, 'level ' + id);
    if(q.kind === 'oddprod'){
      see('oddprod ' + q.par + ' ' + q.d);
      if(q.shape !== 'any' || q.slots !== 3) fail('oddprod: three digits, any numbers', q);
    }
    if(q.kind === 'boxdig'){
      see('boxdig ' + q.shape + ' ' + q.rel + ' ' + q.ask);
      if(q.traps.includes(q.ans) || q.traps[0] < 0 || q.traps[0] > 9) fail('boxdig: the slip', q);
    }
    if(q.kind === 'sqsum'){
      see('sqsum ' + q.shape + (q.shape === 'least' ? ' ' + q.prop : ''));
      if(q.shape === 'least' && leastHas(q)(q.a) && !/,ноN>|,алеN>/.test(strip(Q.why(q, true)))) fail('sqsum: a start that fits is not said not to count', q);
    }
    if(q.kind === 'abcde'){
      see('abcde ' + q.lens + (q.max ? ' max' : ' min'));
      // the worked digits: all different, no number of two digits or more starting with 0, adding to the answer
      let at = 0;
      const nums = q.lens.map(L => { const ds = q.dig.slice(at, at += L); if(L > 1 && ds[0] === 0) fail('abcde: a number starts with 0', q); return +ds.join(''); });
      if(new Set(q.dig).size !== q.dig.length || nums.reduce((a, b) => a + b, 0) !== q.ans || q.ans > 999) fail('abcde: the worked numbers', q);
    }
    if(q.kind === 'tabrule'){
      see('tabrule ' + q.rule);
      if(q.h < 2 || q.low.some(v => v > 999) || !q.low.some((v, i) => i !== q.h && v !== 2*q.top[i] && v > 99)) fail('tabrule: the side by side is not shown', q);
    }
    if(q.kind === 'missing'){
      see('missing many');
      if(q.run[q.run.length - 1] > 100 || q.ans < 3) fail('missing: the run', q);
    }
    if(q.kind === 'swapone'){
      see('swapone ' + q.by);
      if(q.to[1] || q.to[5]) see('swapone ' + q.by + ' divisor');
      if(q.to[2] || q.to[3]) see('swapone ' + q.by + ' factor');
    }
  }});
  ['oddprod even 2', 'oddprod odd 2', 'oddprod all 1', 'oddprod even 4', 'oddprod odd 4', 'boxdig last < one', 'boxdig mul < one', 'boxdig last < max', 'boxdig mul < max',
   'boxdig last > min', 'boxdig mul > min', 'boxdig last > one', 'boxdig last = one', 'boxdig mul = one',
   'sqsum odd', 'sqsum updown', 'sqsum least sq', 'sqsum least div', 'sqsum least end', 'sqsum least twin', 'abcde 3,2 min', 'abcde 2,2 max', 'abcde 3,1 max', 'tabrule sq', 'tabrule dbl', 'missing many',
   'swapone 1', 'swapone 1 divisor', 'swapone -1 divisor', 'swapone 2 factor'].forEach(k => { if(!seen[k]) throw new Error('never drawn in 400 questions a level: ' + k + ' ' + JSON.stringify(seen)); });

  // Nothing on the surface gives the answer away: 3000 questions of a level, the same ones every run.
  const draw = id => Array.from({length: 3000}, (_, i) => seeded(i + 1, () => Q.raw(id)));
  { // 248: a divisor or a factor can change in most questions, and the two dividends alone are the answer in few
    const qs = draw(248), inner = qs.filter(q => q.to[1] || q.to[2] || q.to[3] || q.to[5]).length / qs.length, ae = qs.filter(q => q.ans === q.n[0] + q.n[4]).length / qs.length;
    if(inner < 0.6 || ae > 0.25) throw new Error('swapone: a divisor or a factor can change in ' + Math.round(100*inner) + '% of the questions (want 60% or more), the two dividends are the answer in ' + Math.round(100*ae) + '% (want 25% or less)');
  }
  { // 242: each sign has several answers
    const by = {};
    draw(242).forEach(q => (by[q.rel] = by[q.rel] || new Set()).add(q.ans));
    ['<', '>', '='].forEach(rel => { if(!by[rel] || by[rel].size < 4) throw new Error('boxdig: with ' + rel + ' the answer is only ever ' + [...(by[rel] || [])]); });
  }
  { // 244: thirty different questions or more, the printed one not one in ten
    const qs = draw(244), kinds = new Set(qs.map(q => q.a + ' ' + q.prop + ' ' + q.k)), printed = qs.filter(q => q.a === 1 && q.prop === 'sq').length / qs.length;
    if(kinds.size < 30 || printed > 0.1) throw new Error('sqsum least: ' + kinds.size + ' different questions (want 30 or more), the printed one ' + Math.round(100*printed) + '% of them');
  }
  console.log('МБГ Есен 2024 and 2023, 3 клас: 2024 tasks 7, 8, 19, 20 and 2023 tasks 6, 7, 8, 16, 18 match the key (0, 4, 8; 0; 8; 127; 94; 5; 0; 8; 19) and are asked exactly by their levels; ' +
    Object.values(seen).reduce((a, b) => a + b, 0) + ' more worked out again: products by every pair under 1000, boxes by every digit, sums by every M, letters by every pair of numbers, the table by a family of rules, the gap by counting on, every number of the expression changed to 0 … 300');
}
