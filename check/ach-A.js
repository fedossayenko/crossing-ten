// Runs beside the app (in check.js's own scope, through eval), like check/grade1c-A.js.
// Аз и числата (СБНУ), 2 клас, 2022–2026 — the arithmetic (builder A): 274 a number found one step back, 275 short
// expressions with brackets, 276 sums matched to their answers, 277 a chain of arrows, 278 the operation said in words,
// 279 a star and a pentagon. The papers come with no key: each printed task is checked against our own solution, drawn
// as printed and asked by its level (the printed question, or the same question with other numbers); then every new
// generator is worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // what a child sees: the question, the summary line and the options; with the digits masked, its form
  const seen = g => strip(Q.drawQ(g)) + '|' + Q.eqText(g) + '|' + (g.options || []).map(o => o.text ? o.text[0] : o.v).join(',') + '|' + (g.own ? g.pick : '');
  const mask = t => t.replace(/\d+/g, '#');
  const met = {};
  // sig: what has to agree for "the same question with other numbers" — by default the masked form
  const pin = (year, task, id, q, key, shows, sig) => {
    const name = 'Аз и числата ' + year + ' task ' + task, tag = 'ach-' + year + '-2';
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', our solution says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the answer is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const want = seen(q), like = sig || (g => mask(seen(g))), wantLike = like(q);
    const hit = pinSeed(name, () => Q.raw(id), g => g.kind !== q.kind || g.shape !== q.shape ? 0 : seen(g) === want ? 2 : like(g) === wantLike ? 1 : 0);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks a question of that form');
    (met[year] = met[year] || []).push(task + (hit.exact ? '' : '*'));
  };

  // 274
  pin(2026, '3', 274, {kind:'backx', shape:'think', minus:false, a:26, c:95, traps:[121], ans:69}, [69], 'Намислих число. Към него прибавих 26 и получих 95. Кое число съм намислил?');
  pin(2024, '3А', 274, {kind:'backx', shape:'x', minus:false, a:9, c:55, traps:[64], ans:46}, [46], '9 + x = 55');
  pin(2024, '3Б', 274, {kind:'backx', shape:'brx', a:46, b:7, s:53, c:75, traps:[29, 68], ans:22}, [22], '(46 + 7) + x = 75');

  // 275: q.t, the expression's terms; n a number, b a bracket
  const N = (s, n) => ({s, n}), B = (s, a, op, b) => ({s, br:[a, op, b]});
  pin(2026, '4а', 275, {kind:'brackets', shape:'nb', t:[N('', 36), B('+', 92, '−', 74)], ans:54}, [54], '36 + (92 − 74) =');
  pin(2026, '4б', 275, {kind:'brackets', shape:'nb', t:[N('', 100), B('−', 53, '−', 18)], ans:65}, [65], '100 − (53 − 18) =');
  pin(2026, '4в', 275, {kind:'brackets', shape:'bb', t:[B('', 27, '+', 14), B('+', 71, '−', 38)], ans:74}, [74], '(27 + 14) + (71 − 38) =');
  pin(2022, '3а', 275, {kind:'brackets', shape:'nnb', t:[N('', 94), N('−', 34), B('+', 8, '+', 12)], ans:80}, [80], '94 − 34 + (8 + 12) =');
  pin(2022, '3б', 275, {kind:'brackets', shape:'nb', t:[N('', 71), B('+', 23, '−', 9)], ans:85}, [85], '71 + (23 − 9) =');
  pin(2022, '3в', 275, {kind:'brackets', shape:'nnn', t:[N('', 51), N('+', 19), N('−', 28)], ans:42}, [42], '51 + 19 − 28 =');
  pin(2022, '3г', 275, {kind:'brackets', shape:'bn', t:[B('', 12, '+', 15), N('−', 11)], ans:16}, [16], '(12 + 15) − 11 =');
  pin(2022, '3д', 275, {kind:'brackets', shape:'nnn', t:[N('', 66), N('+', 15), N('−', 14)], ans:67}, [67], '66 + 15 − 14 =');
  pin(2024, '1а', 275, {kind:'brackets', shape:'three', xs:[27, 59, 13], pair:[0, 2], ans:99}, [99], 'Пресметни по лесен начин. 27 + 59 + 13 =');
  pin(2024, '1б', 275, {kind:'brackets', shape:'three', xs:[42, 16, 24], pair:[1, 2], ans:82}, [82], 'Пресметни по лесен начин. 42 + 16 + 24 =');
  pin(2025, '8', 275, {kind:'brackets', shape:'gt', xs:[27, 18, 36], S:81, list:[91, 80, 81], traps:[81, 91], ans:80}, [80], 'Сборът на числата 27 + 18 + 36 е по-голям от');

  // 276: ex[i] gives vals[i]; order lists the answers as the paper lays them out; at is the one asked, and its option
  const opts = ex => ex.map((e, id) => ({ id, v: id, text: [e.join('&nbsp;'), e.join('&nbsp;')] }));
  // the paper has three gifts; the app always offers four, so a spare one (46 + 48 = 94, nobody's) is added
  const GIFT = {vals:[68, 100, 93, 94], ex:[[97, '−', 29], [26, '+', 74], [45, '+', 48], [46, '+', 48]], order:[1, 0, 2]};
  [['5 Пинки', 0, 'Пинки'], ['5 Капитан Защо', 1, 'Капитан Защо'], ['5 Мъглата', 2, 'Мъглата']].forEach(([task, at, who]) =>
    pin(2026, task, 276, Object.assign({kind:'match', shape:'gift', who:0}, GIFT, {at, options: opts(GIFT.ex), pick: at, own: true, ans: at}), [at],
      'Капитан Защо 100 · Пинки 68 · Мъглата 93 Кой подарък ще получи ' + who + '?'));
  const HAT = {vals:[71, 24, 72, 92], ex:[[100, '−', 29], [43, '−', 19], [54, '+', 18], [67, '+', 25]], order:[1, 0, 2, 3]};
  [['7 калпак 24', 1, 24], ['7 калпак 71', 0, 71], ['7 калпак 72', 2, 72], ['7 калпак 92', 3, 92]].forEach(([task, at, v]) =>
    pin(2024, task, 276, Object.assign({kind:'match', shape:'hat', who:-1}, HAT, {at, options: opts(HAT.ex), pick: at, own: true, ans: at}), [at],
      'Калпаци: 24, 71, 72, 92 При кой снежен човек ще отиде калпакът с числото ' + v + '?'));

  // 277: the paper hides several boxes and the child fills them all; each is pinned as the one asked. The strip's
  // form is its length, what is hidden and what is asked (the signs come with the numbers)
  const STRIP = {nums:[30, 56, 68, 82, 60, 99], steps:[26, 12, 14, -22, 39], hideN:[1, 4], hideS:[1, 2, 4]};
  const stripForm = g => g.shape === 'strip' && [g.nums.length, g.hideN, g.hideS, g.at].join('|');
  [['11а', ['n', 1], 56], ['11б', ['s', 1], 12], ['11в', ['s', 2], 14], ['11г', ['n', 4], 60], ['11д', ['s', 4], 39]].forEach(([task, at, ans]) =>
    pin(2026, task, 277, Object.assign({kind:'ovals', shape:'strip'}, STRIP, {at, ans}), [ans], 'Намери неизвестните числа.', stripForm));
  const CHAIN = {nums:[12, 7, 80, 57], steps:[-5, 73, -23], hideN:[1, 2, 3], hideS:[]};
  [['9а', 1, 7], ['9б', 2, 80], ['9в', 3, 57]].forEach(([task, i, ans]) =>
    pin(2024, task, 277, Object.assign({kind:'ovals', shape:'eqs'}, CHAIN, {at:['n', i], ans}), [ans], '12 − 5 ='));

  // 278
  pin(2026, '13 сбор', 278, {kind:'term', shape:'name', op:0, a:8, b:2, traps:[6, 16], ans:10}, [10], 'Пресметни сбора на числата 8 и 2.');
  pin(2026, '13 разлика', 278, {kind:'term', shape:'name', op:1, a:8, b:2, traps:[10, 16], ans:6}, [6], 'Пресметни разликата на числата 8 и 2.');
  pin(2026, '13 произведение', 278, {kind:'term', shape:'name', op:2, a:8, b:2, traps:[10, 6], ans:16}, [16], 'Пресметни произведението на числата 8 и 2.');
  pin(2024, '4А', 278, {kind:'term', shape:'more', more:true, b:54, d:28, traps:[26], ans:82}, [82], 'Кое число е с 28 по-голямо от 54?');
  pin(2024, '4Б', 278, {kind:'term', shape:'more', more:false, b:89, d:30, traps:[], ans:59}, [59], 'Кое число е с 30 по-малко от 89?');
  pin(2025, '5а', 278, {kind:'term', shape:'then', sum:true, up:false, a:32, b:45, c:28, v:77, traps:[], ans:49}, [49], 'Сборът на числата 32 и 45 умали с 28.');
  pin(2025, '5б', 278, {kind:'term', shape:'then', sum:false, up:false, a:89, b:66, c:17, v:23, traps:[40], ans:6}, [6], 'Разликата на числата 89 и 66 умали със 17.');
  pin(2023, '6', 278, {kind:'term', shape:'diff', k:0, j:1, x:32, y:25, traps:[57], ans:7}, [7], 'мечета 32 топки 25 С колко мечетата са повече от топките?');

  // 279
  pin(2022, '4 звезда', 279, {kind:'fruiteq', shape:'twin', x:12, y:18, at:0, traps:[18, 24], ans:12}, [12], '+ = 24 + = 30 + = 36');
  pin(2022, '4 петоъгълник', 279, {kind:'fruiteq', shape:'twin', x:12, y:18, at:1, traps:[12, 36], ans:18}, [18], '+ = 24 + = 30 + = 36');

  // ---- the new generators, worked out again another way ----
  const ev = s => Function('return ' + s.replace(/&nbsp;/g, ' ').replace(/−/g, '-').replace(/·/g, '*'))();
  for(let i = 0; i < 4000; i++){
    const q = Q.genBackAdd();
    const x = q.shape === 'brx' ? q.c - (q.a + q.b) : q.minus ? q.c + q.a : q.c - q.a;
    if(x !== q.ans || q.c < 1 || q.c > 99 || q.ans < 1 || q.ans > 99 || (q.traps || []).includes(q.ans)) fail('274 Неизвестното число', q);
    if(q.shape === 'brx' ? ev('(' + q.a + ' + ' + q.b + ') + ' + q.ans) !== q.c : ev(q.ans + (q.minus ? ' − ' : ' + ') + q.a) !== q.c) fail('274: the answer does not give the result', q);
  }
  const shapes275 = {};
  for(let i = 0; i < 6000; i++){
    const q = Q.genBracketsShort();
    shapes275[q.shape] = 1;
    if(q.shape === 'three'){
      const tens = [[0, 1], [0, 2], [1, 2]].filter(([a, b]) => (q.xs[a] + q.xs[b]) % 10 === 0);
      if(tens.length !== 1 || tens[0].join() !== q.pair.join() || ev(q.xs.join(' + ')) !== q.ans || q.ans > 99) fail('275 three: not one pair making a round ten', q);
    } else if(q.shape === 'gt'){
      const S = q.xs[0] + q.xs[1] + q.xs[2];
      if(q.list.filter(v => v < S).length !== 1 || q.list.filter(v => v === S).length !== 1 || q.list.find(v => v < S) !== q.ans || S > 99) fail('275 gt: not one number below the sum and one equal to it', q);
    } else {
      const expr = Q.bracketsExpr(q);
      if(ev(expr) !== q.ans || q.ans < 1 || q.ans > 100) fail('275: the expression does not give the answer', q);
      // every bracket, and every step from the left, within 0…100
      let v = 0;
      q.t.forEach(x => { const b = x.br ? ev(x.br.join(' ')) : x.n; if(b < 1 || b > 100) fail('275: a bracket out of range', q); v = x.s === '−' ? v - b : v + b; if(v < 0 || v > 100) fail('275: a step out of range', q); });
      if(q.shape !== q.t.map(x => x.br ? 'b' : 'n').join('')) fail('275: the shape does not name the pattern', q);
    }
  }
  if(Object.keys(shapes275).length !== 7) fail('275 does not draw all seven shapes', shapes275);
  for(let i = 0; i < 4000; i++){
    const q = Q.genMatch(), want = q.vals[q.at];
    const right = q.options.filter(o => ev(o.text[0]) === want);
    if(right.length !== 1 || right[0].id !== q.pick || q.pick !== q.ans || new Set(q.vals).size !== q.vals.length) fail('276: not exactly one option gives the number asked', q);
    if(q.ex.some((e, k) => ev(e.join(' ')) !== q.vals[k] || e[0] > 100 || e[2] < 11 || (e[1] === '+' ? e[0] % 10 + e[2] % 10 < 10 : e[0] % 10 >= e[2] % 10 && e[0] !== 100))) fail('276: a sum that does not cross a ten, or gives another number', q);
    if(q.options.length !== 4 || q.order.length !== (q.shape === 'hat' ? 4 : 3) || new Set(q.order).size !== q.order.length || !q.order.includes(q.at)) fail('276: four options, and the one asked among those held', q);
  }
  for(let i = 0; i < 4000; i++){
    const q = Q.genOvals();
    if(q.steps.some((s, k) => q.nums[k] + s !== q.nums[k + 1]) || q.nums.some(v => v < 1 || v > 100)) fail('277: the arrows do not join the numbers', q);
    const [t, k] = q.at, hid = (t === 'n' ? q.hideN : q.hideS).includes(k);
    if(!hid || q.ans !== (t === 'n' ? q.nums[k] : Math.abs(q.steps[k])) || q.ans < 1) fail('277: the box asked is not a hidden one, or its answer is wrong', q);
    if((Q.drawQ(q).match(/>\?</g) || []).length < 1) fail('277: no «?» drawn', q);
    // every hidden box can be found: from a known neighbour and the step between, or a step from both its ends
    const kn = q.nums.map((_, j) => !q.hideN.includes(j)), ks = q.steps.map((_, j) => !q.hideS.includes(j));
    for(let moved = true; moved;){ moved = false;
      kn.forEach((v, j) => { if(!v && (j > 0 && kn[j - 1] && ks[j - 1] || j < kn.length - 1 && kn[j + 1] && ks[j])){ kn[j] = moved = true; } });
      ks.forEach((v, j) => { if(!v && kn[j] && kn[j + 1]){ ks[j] = moved = true; } }); }
    if(!kn.every(Boolean) || !ks.every(Boolean)) fail('277: a hidden box cannot be found', q);
    if(+Q.eqText(q).match(/\d+$/)[0] !== q.ans) fail('277: the summary does not end on the answer', q);
  }
  for(let i = 0; i < 4000; i++){
    const q = Q.genTermWords();
    const want = q.shape === 'name' ? [q.a + q.b, q.a - q.b, q.a * q.b][q.op] : q.shape === 'more' ? (q.more ? q.b + q.d : q.b - q.d)
      : q.shape === 'then' ? (q.sum ? q.a + q.b : q.a - q.b) + (q.up ? q.c : -q.c) : Math.abs(q.x - q.y);
    if(want !== q.ans || q.ans < 1 || q.ans > 100 || (q.traps || []).includes(q.ans)) fail('278: the answer is not what the words say', q);
    if(q.shape === 'name' && q.op === 2 && (q.a > 9 || q.b > 9)) fail('278: a product beyond the times table', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.genFigTwins(), x = (2*q.x) / 2, y = (q.x + q.y) - x;
    if(y !== q.y || 2*y > 100 || q.x === q.y || q.ans !== (q.at ? y : x)) fail('279: the figures are not the numbers', q);
  }
  for(const year of Object.keys(met).sort())
    console.log('Аз и числата ' + year + ' 2 клас (builder A): tasks ' + met[year].join(', ') + ' pinned against our solution (no official key; * = the same question with other numbers)' +
      ({2024:'; task 1 asks the working written out — only its answer is checked', 2023:'; task 6 asks the child to finish the wording — asked here finished', 2026:'; task 5 and 11 fill every box — asked one at a time'}[year] || ''));
}
