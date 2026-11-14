// Runs beside the app (in check.js's own scope, through eval), like check/ach-C.js.
// Иван Салабашев, 2 клас, 2019–2025 — builder S1, the text tasks: 8, 9, 99, 11, 160, 277, 225, 290, 51, 13, 93 and 89 widened, 440 (a number
// squeezed between two sums) and 441 (letters on a strip of arrows) new. Each printed task is drawn as printed and must come out at the
// official key by the generator's own answer; the instance is asked by its level exactly, or as the same question with other numbers (`*`)
// where the level draws its own numbers. Then every new shape is worked out again from the text or the picture it draws (not from the fields
// the generator keeps), on 2000+ seeds each, with uniqueness where the task needs one answer.
// 2021 #3 is the exception: the key says Б = 8, every reading of its three lines gives 10 (✡ = 3, ❖ = 11, ☆ = 4), so it is tagged on 11 and not pinned.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const met = [];
  const draw = q => strip(Q.drawQ(q));
  const num = t => Function('return ' + t.replace(/−/g, '-'))();
  // fields: what makes it the printed question; like: the same question with other numbers (the level's own numbers)
  const pin = (year, task, id, q, key, shows, fields, like = true, tries = 300000) => {
    const name = 'Салабашев ' + year + ' task ' + task, tag = 'sal-' + year + '-2';
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': gives ' + Q.answers(q) + ', the key says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    if(draw(q).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + draw(q));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const sig = g => fields.map(f => JSON.stringify(g[f])).join('|'), want = sig(q);
    const hit = pinSeed(name, () => Q.raw(id), g => g.kind !== q.kind || g.shape !== q.shape ? 0 : sig(g) === want ? 2 : like ? 1 : 0, tries);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    if(hit.exact && Q.answers(hit.q).join() !== String(key)) throw new Error(name + ': the level asks it, but answers ' + Q.answers(hit.q) + ', the key says ' + key);
    met.push(task + (hit.exact ? '' : '*') + ' (' + year + ')');
    return hit.q;
  };
  const T = (...a) => a.map((n, i) => ({op: i ? (n < 0 ? '−' : '+') : '', n: Math.abs(n)}));
  // a chain written the way the paper writes it: a sign in front of a 0 is a minus when it is told so
  const chain = (...a) => a.map((n, i) => typeof n === 'string' ? {op: '−', n: 0} : {op: i ? (n < 0 ? '−' : '+') : '', n: Math.abs(n)});

  // ---- the printed tasks
  pin(2021, 1, 8, {kind:'chain', shape:'short', terms: T(10, -8, 7, -5, 4, -2), paired:0, ans:6}, 6, '10 − 8 + 7 − 5 + 4 − 2 =', ['terms']);
  pin(2023, 1, 8, {kind:'chain', shape:'short', terms: T(2, 0, 2, -3), paired:0, ans:1}, 1, '2 + 0 + 2 − 3 =', ['terms']);
  pin(2024, 1, 8, {kind:'chain', shape:'big', terms: chain(20, 24, -2, '0', -2, -4), paired:0, ans:36}, 36, '20 + 24 − 2 − 0 − 2 − 4 =', ['terms']);
  pin(2019, 1, 9, {kind:'pairs', shape:'ap', n:5, s:11, terms: T(11, 13, 15, 17, 19), ans:75}, 75, '11 + 13 + 15 + 17 + 19 =', ['terms']);
  pin(2025, 1, 99, {kind:'brackets', shape:7, a:20, b:25, ds:[2, 0, 2, 5], ans:36}, 36, '20 + 25 − (2 + 0 + 2 + 5) =', ['a', 'b', 'ds']);
  pin(2022, 1, 11, {kind:'box', shape:'def', a:66, b:9, c:11, v:68, k:25, ans:93}, 93, '66 − 9 + 11 = ♡', ['a', 'b', 'c', 'k']);
  pin(2024, 2, 11, {kind:'box', shape:'diff', h:25, t:42, m:68, p:43, n:57, w:99, ans:17}, 17, '68 − ♡ = 43 и 57 + △ = 99', ['m', 'p', 'n', 'w']);
  pin(2022, 12, 486, {kind:'symeq', shape:'sides', x:18, c1:15, c2:33, ans:18}, 18, '♡ + ♡ + ♡ + ♡ = ♡ + ♣ + ♡ ♣ + 15 = ♡ + 33', ['x', 'c1', 'c2']);
  pin(2023, 2, 440, {kind:'bounds', h:13, k:18, club:31, f:48, lo:[5, 7], hi:[20, 6], m:16, up:[21, 28], ans:4}, 4, '5 + 7 < ♡ < 20 − 6 ♡ + 18 = ♣ 16 + ♣ < ◊ < 21 + 28', ['lo', 'hi', 'k', 'm', 'up']);
  pin(2019, 4, 277, {kind:'ovals', shape:'first', nums:[66, 29, 55], steps:[-37, 26], hideN:[0, 1], hideS:[], at:['n', 0], ans:66}, 66, 'Намери неизвестните числа', ['nums', 'steps']);
  pin(2020, 5, 277, {kind:'ovals', shape:'short', nums:[16, 21, 53, 44], steps:[5, 32, -9], hideN:[1, 2], hideS:[1], at:['s', 1], ans:32}, 32, 'Намери неизвестните числа', ['nums', 'steps']);
  const L = pin(2025, 3, 441, {kind:'ovals', shape:'letters', nums:[8, 21, 15, 32, 23], steps:[13, -6, 17, -9], hideN:[0, 1], hideS:[2, 3], at:['n', 0],
    options:[8, 9, 17, 19].map((v, id) => ({id, v})), pick:3, own:true, ans:19}, 19, 'Част от числата на схемата са скрити с буквите a, b, c и d', ['nums', 'steps', 'options']);
  if('АБВГ'[L.pick] !== 'Г' && L.options.map(o => o.v).join() === '8,9,17,19') fail('2025 #3: the right option is not Г', L);
  pin(2020, 2, 488, {kind:'missing', shape:'syms', row:[0, 5, 10, 15, 20, 25, 30, 35], hide:[3, 4, 6], ans:65}, 65, '0, 5, 10, ✱, ★, 25, ✹, 35', ['row', 'hide']);
  pin(2023, 6, 290, {kind:'diffseq', shape:'hole', seq:[1, 2, 4, 7, 11, 16], down:false, d0:1, g:1, asksSum:false, at:3, ans:7}, 7, '1, 2, 4, ?, 11, 16', ['seq', 'at']);
  pin(2021, 5, 51, {kind:'tens', shape:'over', a:2, b:15, traps:[25, 15], ans:35}, 35, 'Кое число съдържа 2 десетици и 15 единици?', ['a', 'b']);
  pin(2024, 3, 13, {kind:'named', shape:'dsum', w:0, n:99, sum:18, traps:[18], ans:81}, 81, 'С колко най-голямото двуцифрено число е по-голямо от сбора на цифрите си?', ['w']);
  pin(2023, 13, 93, {kind:'consec', shape:'digits', m:28, S:84, ans:30}, 30, 'Сборът на три последователни двуцифрени числа е 84', ['m']);
  pin(2022, 14, 89, {kind:'letters', shape:'two', N:46, A:8, KH:3, ans:19}, 19, 'КА + НА = 46', ['N']);
  // 2021 #3 (7 + ✡ = 6 + 4, ❖ − 3 = 14 − 6, 4 + 8 = 16 − ☆, ✡ + ❖ − ☆): drawn by 11, tagged, not pinned
  {
    const q = {kind:'box', shape:'three', X:3, Y:11, Z:4, a:7, b:6, c:4, d:3, e:14, f:6, g:4, h:8, i:16, ans:10};
    if(draw(q).indexOf('7+✡=6+4,❖−3=14−6,4+8=16−☆'.replace(/\s/g, '')) < 0) throw new Error('2021 #3 is not drawn as printed: ' + draw(q));
    if(!Q.LEVELS.find(l => l.id === 11).papers.includes('sal-2021-2')) throw new Error('level 11 is not tagged sal-2021-2');
    // every reading gives 10; the key's 8 is not reached by any solving order of the three lines (✡ = 3, ❖ = 11, ☆ = 4 are forced)
    const forced = []; for(let x = 0; x < 30; x++) for(let y = 0; y < 30; y++) for(let z = 0; z < 30; z++) if(7 + x === 6 + 4 && y - 3 === 14 - 6 && 4 + 8 === 16 - z) forced.push(x + y - z);
    if(forced.join() !== '10') throw new Error('2021 #3: the three lines no longer force 10: ' + forced);
  }
  console.log('Салабашев S1: tasks ' + met.join(', ') + ' pinned (* the same question with other numbers); 2021 #3 tagged on 11, not pinned (the key says 8, every reading gives 10)');

  // ---- every new shape worked out again from what it draws
  const n = {}, count = k => n[k] = (n[k] || 0) + 1;
  const seen = (id, shape, tries, f) => { let got = 0; for(let i = 1; i <= tries; i++){ const q = Q.seeded(i, () => Q.raw(id)); if(q.shape !== shape) continue; got++; count(id + ' ' + shape); f(q, draw(q), i); } if(got < 30) throw new Error('level ' + id + ' drew shape ' + shape + ' only ' + got + ' times'); };
  const digits = v => String(v).split('').reduce((t, d) => t + +d, 0);
  // 8: the chain read back from its text
  for(const shape of ['big', 'short']) seen(8, shape, 6000, (q, t) => {
    const e = t.match(/^(.*?)=/)[1], v = num(e);
    if(v !== q.ans) fail('8 ' + shape + ': the text gives ' + v, q);
    const ts = e.match(/\d+/g).map(Number), up = q.terms[0].n;
    if(shape === 'big'){
      if(ts.length !== 6 || ts[0] < 10 || ts[1] < 11 || ts.slice(2).some(x => x > 9) || v < 20 || v > 99 || e[ts[0].toString().length] !== '+') fail('8 big: not a two-digit start and step and four small steps', q);
    } else if(ts.length < 4 || ts.length > 6 || ts[0] > 10 || ts.slice(1).some(x => x > 9) || v < 0 || v > 20) fail('8 short: not four to six numbers within 20', q);
    let run = ts[0]; const ops = e.match(/[+−]/g) || [];
    ops.forEach((o, i) => { run += o === '+' ? ts[i + 1] : -ts[i + 1]; if(run < 0 || run > (shape === 'big' ? 120 : 20)) fail('8 ' + shape + ': the walk leaves its range', q); });
  });
  // 9: a run in steps of 2, the answer by the ends paired (read back: 5 or 7 terms, ans = count times the middle)
  seen(9, 'ap', 3000, (q, t) => {
    const e = t.match(/^(.*?)=/)[1], ts = e.split('+').map(Number);
    if(num(e) !== q.ans || q.ans > 100 || ![5, 7].includes(ts.length) || ts.some((x, i) => i && x - ts[i - 1] !== 2) || ts[0] < 3) fail('9 ap: not a run of 5 or 7 in steps of 2 within 100', q);
    if(ts[0] + ts[ts.length - 1] !== ts[1] + ts[ts.length - 2]) fail('9 ap: the ends do not pair', q);
    if(!/\(.*\+.*\)/.test(Q.why(q, true))) fail('9 ap: the worked line shows no pairs', q);
  });
  // 99: the bracket of four one-digit numbers with one zero
  seen(99, 7, 3000, (q, t) => {
    const m = t.match(/(\d+)\+(\d+)−\(([\d+]+)\)=$/); if(!m) fail('99 7: unexpected text ' + t, q);
    const ds = m[3].split('+').map(Number);
    if(ds.length !== 4 || ds.filter(d => !d).length !== 1 || +m[1] + +m[2] - ds.reduce((a, b) => a + b, 0) !== q.ans || q.ans < 10) fail('99 7: wrong', q);
  });
  // 11: def, diff, three read back from the text
  seen(11, 'def', 3000, (q, t) => {
    const m = t.match(/^Ако(\d+)−(\d+)\+(\d+)=♡/), k = +t.match(/♡\+(\d+)\?/)[1];
    if(!m || +m[1] - +m[2] + +m[3] + k !== q.ans || q.ans > 99) fail('11 def: wrong', q);
  });
  seen(11, 'diff', 3000, (q, t) => {
    const a = t.match(/(\d+)−♡=(\d+)/), b = t.match(/(\d+)\+△=(\d+)/);
    if(!a || !b) fail('11 diff: unexpected text ' + t, q);
    const heart = +a[1] - +a[2], tri = +b[2] - +b[1];
    if(tri - heart !== q.ans || q.ans < 1) fail('11 diff: wrong', q);
  });
  seen(11, 'three', 3000, (q, t) => {
    const m = t.match(/^(\d+)\+✡=(\d+)\+(\d+),❖−(\d+)=(\d+)−(\d+),(\d+)\+(\d+)=(\d+)−☆/);
    if(!m) fail('11 three: unexpected text ' + t, q);
    const [a, b, c, d, e, f, g, h, i] = m.slice(1).map(Number), X = b + c - a, Y = e - f + d, Z = i - g - h;
    if(X < 1 || Y < 1 || Z < 1 || X + Y - Z !== q.ans || q.ans < 1) fail('11 three: wrong', q);
  });
  // 486 (Салабашев 2022 #12, split off the 1st-grade 160): the two lines solved by trying every pair of numbers; one pair only
  seen(486, 'sides', 1500, (q, t) => {
    const m = t.match(/♣\+(\d+)=♡\+(\d+)/), sols = [];
    if(!m) fail('486 sides: unexpected text ' + t, q);
    for(let h = 0; h <= 100; h++) for(let c = 0; c <= 200; c++) if(4*h === h + c + h && c + +m[1] === h + +m[2]) sols.push(h);
    if(sols.length !== 1 || sols[0] !== q.ans) fail('486 sides: not one solution', q);
  });
  // 440: three whole numbers found by trying them all
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(440)); count('440'); const t = draw(q);
    const m = t.match(/(\d+)\+(\d+)<♡<(\d+)−(\d+)♡\+(\d+)=♣(\d+)\+♣<◊<(\d+)\+(\d+)/); if(!m) fail('440: unexpected text ' + t, q);
    const [a, b, c, d, k, mm, e, g] = m.slice(1).map(Number), hs = [], fs = [];
    for(let h = 1; h <= 200; h++) if(a + b < h && h < c - d) hs.push(h);
    if(hs.length !== 1) fail('440: not one whole number between the first two sums', q);
    const club = hs[0] + k;
    for(let f = 1; f <= 300; f++) if(mm + club < f && f < e + g) fs.push(f);
    if(fs.length !== 1) fail('440: not one whole number between the second two', q);
    if(fs[0] - hs[0] - club !== q.ans || q.ans < 1 || fs[0] > 99 || t.indexOf('◊−♡−♣=') < 0) fail('440: wrong', q);
  }
  // 277: first and short, solved again from the picture's ellipses and arrows
  const strip277 = q => {
    const sv = Q.drawQ(q).match(/<svg[\s\S]*?<\/svg>/)[0];
    const body = s => s.replace(/<tspan[^>]*>\?<\/tspan>/g, '?').replace(/<[^>]*>/g, '');
    const steps = [...sv.matchAll(/<text[^>]*x="(\d+)" y="30"[^>]*>([\s\S]*?)<\/text>/g)].map(m => ({x: +m[1], s: body(m[2])}));
    const ell = [...sv.matchAll(/<ellipse[^>]*cx="(\d+)"[^>]*\/>(<text[^>]*>([\s\S]*?)<\/text>)?/g)].map(m => m[3] === undefined ? null : body(m[3]));
    // a step's label stands beside its arrow: the sign, then its number (or ? or an empty box drawn as a rect)
    const rects = [...sv.matchAll(/<rect x="(\d+)" y="12"/g)].map(m => +m[1]);
    const st = ell.slice(1).map((_, i) => {
      const x = 39 + i*80, lab = steps.filter(s => s.x === x + 30 || s.x === x + 40);
      const sign = lab.map(s => s.s.trim()[0]).find(c => c === '+' || c === '−'), val = lab.map(s => s.s.trim().slice(1).trim()).find(v => v !== '') ;
      return { sign: sign === '−' ? -1 : 1, val: val === undefined ? null : val === '?' ? '?' : +val };
    });
    return { vals: ell.map(v => v === null ? null : v === '?' ? '?' : +v), st };
  };
  for(const shape of ['first', 'short']) seen(277, shape, 3000, (q) => {
    const { vals, st } = strip277(q);
    if(vals.length !== q.nums.length || st.length !== q.steps.length) fail('277 ' + shape + ': the strip is not the generator\'s', q);
    // solve: unknowns are the nulls and the one asked (?), steps likewise
    let v = vals.map(x => x === '?' ? null : x), s = st.map(x => x.val === '?' || x.val === null ? null : x.sign * x.val), ask = vals.indexOf('?'), askS = st.findIndex(x => x.val === '?');
    for(let moved = true; moved;){
      moved = false;
      for(let i = 0; i < s.length; i++){
        if(v[i] !== null && s[i] !== null && v[i + 1] === null){ v[i + 1] = v[i] + s[i]; moved = true; }
        else if(v[i + 1] !== null && s[i] !== null && v[i] === null){ v[i] = v[i + 1] - s[i]; moved = true; }
        else if(v[i] !== null && v[i + 1] !== null && s[i] === null){ s[i] = v[i + 1] - v[i]; moved = true; }
      }
    }
    if(v.includes(null) || s.includes(null)) fail('277 ' + shape + ': the picture cannot be solved', q);
    const got = ask >= 0 ? v[ask] : Math.abs(s[askS]);
    if(got !== q.ans) fail('277 ' + shape + ': the picture gives ' + got, q);
    if(v.some(x => x < 1 || x > 100)) fail('277 ' + shape + ': a number leaves 1…100', q);
    if(shape === 'first' && ask !== 0) fail('277 first: the first circle is not the one asked', q);
    if(shape === 'short' && (v.length !== 4 || askS !== 1 || vals[1] !== null || vals[2] !== null)) fail('277 short: not 16 □ □ 44', q);
  });
  // 441: a, b, c, d found from the picture; exactly one option is none of them
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(441)); count('441'); const sv = Q.drawQ(q).match(/<svg[\s\S]*?<\/svg>/)[0];
    const tx = [...sv.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map(m => m[1]);
    // texts: four step labels (+ 13, − 6, + c, − d), then the five circles (a, b, 15, 32, 23)
    if(tx.length !== 9 || tx.slice(0, 4).join() !== '+ ' + q.steps[0] + ',− ' + -q.steps[1] + ',+ c,− d' || tx[4] !== 'a' || tx[5] !== 'b') fail('441: unexpected picture ' + tx.join('|'), q);
    const s0 = +tx[0].slice(2), s1 = -tx[1].slice(2).trim(), n2 = +tx[6], n3 = +tx[7], n4 = +tx[8];
    const b = n2 - s1, a = b - s0, c = n3 - n2, d = n3 - n4, vals = [a, b, c, d], opts = q.options.map(o => o.v);
    if(new Set(vals).size !== 4 || vals.some(x => x < 1) || opts.length !== 4 || new Set(opts).size !== 4) fail('441: letters or options repeat', q);
    const none = opts.filter(o => !vals.includes(o));
    if(none.length !== 1 || opts.filter(o => vals.includes(o)).length !== 3 || opts[q.pick] !== none[0] || q.ans !== none[0] || opts.join() !== opts.slice().sort((x, y) => x - y).join()) fail('441: not exactly one option that is none of a, b, c, d', q);
    if(!q.own || Q.answers(q).join() !== String(none[0])) fail('441: answer', q);
  }
  // 488 (Салабашев 2020 #2, split off the 1st-grade 225): the run in fives or tens, three symbols, the sum
  seen(488, 'syms', 3000, (q, t) => {
    const m = t.match(/^Пресметни✱\+★\+✹\.(.*?)✱\+★\+✹=/); if(!m) fail('488 syms: unexpected text ' + t, q);
    const cells = m[1].split(','), shown = cells.map(Number), at = ['✱', '★', '✹'].map(s => cells.indexOf(s));
    if(cells.length !== 8 || at.some(x => x < 0)) fail('488 syms: not eight cells with three symbols', q);
    const k = shown[1] - shown[0]; if(![5, 10].includes(k) || (at[1] !== at[0] + 1) || at[2] < at[1] + 2) fail('488 syms: step or places', q);
    const base = shown[0], run = cells.map((_, i) => base + i*k);
    cells.forEach((c, i) => { if(!isNaN(shown[i]) && shown[i] !== run[i]) fail('488 syms: not a steady run', q); });
    if(run[at[0]] + run[at[1]] + run[at[2]] !== q.ans || q.ans > 100) fail('488 syms: wrong', q);
  });
  // 290: the hole inside a run whose steps grow by 1 or 2
  seen(290, 'hole', 3000, (q, t) => {
    const parts = t.replace(/^.*?число\?/, '').split(','), hole = parts.findIndex(p => p.includes('?'));
    const vals = parts.map(p => p.replace('?', '').replace(/=.*$/, '')).map(p => p === '' ? null : +p);
    if(parts.length !== 6 || ![3, 4].includes(hole)) fail('290 hole: not six numbers with the 4th or 5th hidden', q);
    // the steps from the shown numbers: the run grows by g each time
    let fill = null;
    for(let g = 1; g <= 2 && fill === null; g++) for(let d0 = 1; d0 <= 3 && fill === null; d0++) for(let a0 = 1; a0 <= 9; a0++){
      const seq = [a0]; for(let i = 0; i < 5; i++) seq.push(seq[i] + d0 + i*g);
      if(seq.every((x, i) => i === hole || x === vals[i])) fill = (fill === null ? seq[hole] : fill);
    }
    if(fill !== q.ans) fail('290 hole: the run gives ' + fill, q);
  });
  // 51: ten ones make one more ten
  seen(51, 'over', 2000, (q, t) => {
    const m = t.match(/(\d+)десетиц[аи]и(\d+)единиц[аи]/); if(!m) fail('51 over: unexpected text ' + t, q);
    if(10*m[1] + +m[2] !== q.ans || +m[2] < 10 || q.ans > 99) fail('51 over: wrong', q);
  });
  // 13: the largest or smallest number and its digit sum
  seen(13, 'dsum', 2000, (q, t) => {
    const nm = t.includes('най-голямотодвуцифрено') ? 99 : t.includes('най-малкотодвуцифрено') ? 10 : t.includes('най-малкототрицифрено') ? 100 : 0;
    if(!nm || nm - digits(nm) !== q.ans) fail('13 dsum: wrong', q);
    if(!/сборанацифритеси/.test(t)) fail('13 dsum: unexpected text ' + t, q);
  });
  // 93: three consecutive two-digit numbers, found by trying them
  seen(93, 'digits', 2000, (q, t) => {
    const S = +t.match(/числае(\d+)/)[1], sols = [];
    for(let a = 10; a <= 97; a++) if(a + a + 1 + a + 2 === S) sols.push(digits(a) + digits(a + 1) + digits(a + 2));
    if(sols.length !== 1 || sols[0] !== q.ans) fail('93 digits: wrong', q);
  });
  // 89: КА + НА = N by trying every digit
  seen(89, 'two', 3000, (q, t) => {
    const N = +t.match(/КА\+НА=(\d+)/)[1], vals = new Set(), as = new Set();
    for(let K = 1; K <= 9; K++) for(let H = 1; H <= 9; H++) for(let A = 0; A <= 9; A++) if(K !== H && K !== A && H !== A && 10*K + A + 10*H + A === N){ vals.add(K + A + H + A); as.add(A); }
    if(vals.size !== 1 || [...vals][0] !== q.ans || N > 99) fail('89 two: not one value', q);
  });
  console.log('Салабашев S1: every new shape worked out again from its text or picture — ' + Object.entries(n).map(([k, v]) => k + ' ×' + v).join(', '));
}
