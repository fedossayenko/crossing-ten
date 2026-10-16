// Runs beside the app (in check.js's own scope, through eval), like check/grade1c-A.js.
// Аз и числата (СБНУ), 2 клас, 2022–2026 — numbers and digits: 285 «Вярно ли е?», 286 the tens digit, 287 the
// largest sum, 288 numbers told in tens, 289 two numbers by their sum and difference, 290 the next number, and 93
// widened with three consecutive numbers. The papers come with no key: each answer below is our own solution,
// worked again by the level's generator; each printed task is drawn as printed and asked by its level — exactly,
// or the same question with other numbers where the level draws its own table. Then every new generator is
// worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const met = {};   // year → [task, 'exact' | 'like']
  // fields: what makes it the printed question; like: what makes it the same question with other numbers
  const pin = (year, task, id, q, key, shows, fields, like) => {
    const name = 'Аз и числата ' + year + ' task ' + task, tag = 'ach-' + year + '-2', srt = a => a.slice().sort((x, y) => x - y).join();
    if(srt(Q.answers(q)) !== srt(key)) throw new Error(name + ': gives ' + Q.answers(q) + ', our solution says ' + key);
    if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error(name + ': our solution is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const sig = fs => g => fs.map(f => JSON.stringify(g[f])).join('|'), want = sig(fields)(q), wantLike = like && sig(like)(q);
    const hit = pinSeed(name, () => Q.raw(id), g => g.kind !== q.kind || g.shape !== q.shape ? 0 : sig(fields)(g) === want ? 2 : like && sig(like)(g) === wantLike ? 1 : 0);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    (met[year] = met[year] || []).push(task + (hit.exact ? '' : '*'));
  };
  // ДА / НЕ: the answer is the option's id, and its word is checked too
  const YN = [{ id:0, v:0, text:['ДА', 'ТАК'] }, { id:1, v:1, text:['НЕ', 'НІ'] }];
  const yesNo = (year, task, N, p, k, word, shows) => {
    const yes = word === 'ДА', q = Object.assign({kind:'yesno', shape:'num', N, p}, k === undefined ? {} : {k}, {yes, options: YN, pick: yes ? 0 : 1, own: true, ans: yes ? 0 : 1});
    if(q.options[q.ans].text[0] !== word) fail('Аз и числата ' + year + ' task ' + task + ': the right option is not ' + word, q);
    pin(year, task, 285, q, [q.ans], shows, ['N', 'p', 'k', 'ans']);
  };
  const perim = (task, f, word, shows) => {
    const yes = word === 'ДА';
    pin(2023, task, 285, {kind:'yesno', shape:'perim', f, yes, options: YN, pick: yes ? 0 : 1, own: true, ans: yes ? 0 : 1}, [yes ? 0 : 1], shows, ['f', 'ans']);
  };

  // 2025, задача 2: «За числото 100 е вярно, че:» — six statements
  yesNo(2025, '2а', 100, 'two', undefined, 'НЕ', 'числото 100 е двуцифрено число');
  yesNo(2025, '2б', 100, 'three', undefined, 'ДА', 'числото 100 е трицифрено число');
  yesNo(2025, '2в', 100, 'max2', undefined, 'НЕ', 'числото 100 е най-голямото двуцифрено число');
  yesNo(2025, '2г', 100, 'min3', undefined, 'ДА', 'числото 100 е най-малкото трицифрено число');
  yesNo(2025, '2д', 100, 'ones', 1, 'НЕ', 'числото 100 има 1 единица');
  yesNo(2025, '2е', 100, 'tens', 0, 'ДА', 'числото 100 има 0 десетици');
  // 2025, задача 6: the squares with 2 десетици, counted (the paper colours them)
  pin(2025, 6, 286, {kind:'digits', shape:'grid', t:2, list:[26, 52, 84, 27, 25, 92, 23, 21, 42, 72, 12, 28, 24, 69, 22], traps:[13], ans:8}, [8],
    'Колко от числата в таблицата имат 2 десетици? 26 52 84 27 25 92 23 21 42 72 12 28 24 69 22', ['t', 'list'], ['t', 'ans']);
  // 2025, задача 9: 1, 3, 7, 13, 21, ___ (А. 30 Б. 31 В. 33)
  pin(2025, 9, 290, {kind:'diffseq', shape:'grow', seq:[1, 3, 7, 13, 21, 31], down:false, d0:2, g:2, asksSum:false, traps:[29], ans:31}, [31], 'Кое е следващото число в редицата? 1, 3, 7, 13, 21, ?', ['seq']);

  // 2024, задача 2: 52 and a one-digit number above zero — the largest sum
  pin(2024, 2, 287, {kind:'named', shape:'nine', a:52, sum:true, pos:true, o:9, traps:[62], ans:61}, [61],
    'Ако едното събираемо е 52, а другото е едноцифрено число, по-голямо от нула, кой е възможно най-големият сбор', ['a', 'sum', 'pos', 'ans']);
  // 2024, задача 8: Мунка's two numbers with sum 12 and difference 4
  pin(2024, 8, 289, {kind:'sumdiff', shape:'two', S:12, d:4, small:4, big:8, slots:2, ans:8, alt:[4]}, [8, 4], 'Маймунката Мунка те пита кои две числа имат сбор 12 и разлика 4', ['S', 'd', 'ans']);
  // 2024, задача 11: 88 − 65 (А. 32 Б. 23 В. 82 — the other two are the level's traps)
  const said = {kind:'tens', shape:'said', sum:false, A:{t:8, rel:0, u:8}, B:{t:6, rel:1, k:1, u:5}, a:88, b:65, traps:[32, 82], ans:23};
  pin(2024, 11, 288, said, [23], 'Умаляемото има 8 десетици и също толкова единици. Умалителят има 6 десетици и с една по-малко единици. Разликата е:', ['sum', 'A', 'B', 'ans']);

  // 2023, задача 1: 10 □ □ □ □ 20, the ones that divide by 2
  pin(2023, 1, 286, {kind:'digits', shape:'even', lo:10, hi:20, slots:4, ans:12, alt:[14, 16, 18]}, [12, 14, 16, 18], 'Запиши всички двуцифрени числа между 10 и 20, които се делят на 2. 10 20', ['lo', 'ans', 'alt']);
  // 2023, задача 3: 1, 3, 7, 13, 21, 31 — the next (А. 41 Б. 42 В. 43)
  pin(2023, 3, 290, {kind:'diffseq', shape:'grow', seq:[1, 3, 7, 13, 21, 31, 43], down:false, d0:2, g:2, asksSum:false, traps:[41], ans:43}, [43], 'Кое е следващото число в редицата? 1, 3, 7, 13, 21, 31, ?', ['seq']);
  // 2023, задача 5: □□□ − □□ = 1
  pin(2023, 5, 287, {kind:'named', shape:'boxes', b:0, n:3, m:2, r:1, big:100, small:99, slots:2, ans:100, alt:[99]}, [100, 99], 'Напиши липсващите числа, за да е вярно решена задачата', ['b', 'ans', 'alt']);
  // 2023, задача 8: ДА или НЕ
  perim('8А', 0, 'НЕ', 'Може ли да се намери обиколката на правоъгълник, ако са дадени само двете срещуположни страни?');
  perim('8Б', 1, 'ДА', 'Може ли да се намери обиколката на квадрат, ако е дадена само една от страните?');
  // 2023, задача 11: three consecutive numbers adding to 18 (А. 5, 6, 7)
  pin(2023, 11, 93, {kind:'consec', shape:'three', m:6, S:18, slots:3, ans:5, alt:[6, 7]}, [5, 6, 7], 'Сборът на кои три последователни числа е 18?', ['m', 'ans']);

  // 2022, задача 5: every two-digit number with tens digit 5 — asked here as how many
  pin(2022, 5, 286, {kind:'digits', shape:'all', tens:true, d:5, traps:[9], ans:10}, [10], 'Колко са двуцифрените числа с цифра на десетиците 5?', ['tens', 'd', 'ans']);
  // 2022, задача 9: «За числото 99 е вярно, че:»
  yesNo(2022, '9а', 99, 'two', undefined, 'ДА', 'числото 99 е двуцифрено число');
  yesNo(2022, '9б', 99, 'one', undefined, 'НЕ', 'числото 99 е едноцифрено число');
  yesNo(2022, '9в', 99, 'min3', undefined, 'НЕ', 'числото 99 е най-малкото трицифрено число');
  yesNo(2022, '9г', 99, 'max2', undefined, 'ДА', 'числото 99 е най-голямото двуцифрено число');
  yesNo(2022, '9д', 99, 'tens', 9, 'ДА', 'числото 99 има 9 десетици');
  yesNo(2022, '9е', 99, 'ones', 9, 'ДА', 'числото 99 има 9 единици');
  // 2022, задача 10: five numbers from 12, each 13 more; from 49, each 7 less
  pin(2022, '10А', 290, {kind:'diffseq', shape:'const', up:true, d:13, seq:[12, 25, 38, 51, 64], slots:4, ans:25, alt:[38, 51, 64]}, [25, 38, 51, 64],
    'Запиши 5 числа, първото от които да е 12, а всяко следващо – с 13 по-голямо от предходното. 12,,,,', ['up', 'd', 'seq']);
  pin(2022, '10Б', 290, {kind:'diffseq', shape:'const', up:false, d:7, seq:[49, 42, 35, 28, 21], slots:4, ans:42, alt:[35, 28, 21]}, [42, 35, 28, 21],
    'Запиши 5 числа, първото от които да е 49, а всяко следващо – със 7 по-малко от предходното. 49,,,,', ['up', 'd', 'seq']);
  if(String(said.traps) !== '32,82' || Q.raw(288).kind !== 'tens') fail('Аз и числата 2024 task 11: the paper\'s options А 32 and В 82 are not the level\'s traps', said);

  // every new generator worked out again another way
  const n = {};
  const count = k => n[k] = (n[k] || 0) + 1;
  // the perimeter statements as sides with names: can every side be told from the ones given?
  const FIG = { rect:['a', 'b', 'a', 'b'], sq:['a', 'a', 'a', 'a'], eq:['a', 'a', 'a'], scal:['a', 'b', 'c'], iso:['l', 'l', 'b'] };
  const PERIM = [['rect', [0, 2], 'правоъгълник'], ['sq', [0], 'квадрат'], ['rect', [0, 1], 'правоъгълник'], ['rect', [0], 'правоъгълник'], ['eq', [0], 'равностранен'],
                 ['scal', [0, 1], 'различни страни'], ['iso', [0, 2], 'равнобедрен'], ['sq', [0, 2], 'квадрат'], ['iso', [2], 'равнобедрен']];
  let yes = 0, nums = 0;
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(285);
    if(q.options.length !== 2 || q.options[0].text[0] !== 'ДА' || q.options[1].text[0] !== 'НЕ' || q.pick !== q.ans || !Q.accepts(q, [String(q.ans)]) || Q.accepts(q, [String(1 - q.ans)])) fail('285: the options', q);
    if(q.shape === 'perim'){
      count('perim');
      const [fig, given, word] = PERIM[q.f], names = FIG[fig], known = new Set(given.map(j => names[j]));
      if(names.every(x => known.has(x)) !== (q.ans === 0) || strip(Q.drawQ(q)).indexOf(word.replace(/\s+/g, '')) < 0) fail('285: the perimeter statement', q);
      continue;
    }
    count('yesno');
    const s = String(q.N), pad = s.padStart(3, '0'), place = {hund:0, tens:1, ones:2}[q.p];
    const truth = place !== undefined ? pad[place] === String(q.k) && (q.p !== 'tens' || q.N >= 10) && (q.p !== 'hund' || q.N >= 100)
      : {one: s.length === 1, two: s.length === 2, three: s.length === 3, max1: s === '9', min2: s === '10', max2: s === '99', min3: s === '100'}[q.p];
    if(truth !== (q.ans === 0)) fail('285: the statement', q);
    if(place !== undefined && (q.k < 0 || q.k > 9)) fail('285: a digit that is not one', q);
    nums++; if(q.ans === 0) yes++;
  }
  if(yes < nums / 4 || yes > 3 * nums / 4) throw new Error('285: ДА is ' + yes + ' of ' + nums + ' number statements');
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(286); count('digits ' + q.shape);
    if(q.shape === 'grid'){
      const tens = q.list.filter(v => String(v)[0] === String(q.t)), ones = q.list.filter(v => String(v)[1] === String(q.t) && String(v)[0] !== String(q.t));
      if(q.list.length !== 15 || new Set(q.list).size !== 15 || q.list.some(v => v < 10 || v > 99) || tens.length !== q.ans || ones.length < 3) fail('286: the table', q);
    } else if(q.shape === 'all'){
      let c = 0; for(let v = 10; v <= 99; v++) if(String(v)[q.tens ? 0 : 1] === String(q.d)) c++;
      if(c !== q.ans) fail('286: the count', q);
    } else {
      const got = []; for(let v = q.lo + 1; v < q.hi; v++) if(v % 2 === 0) got.push(v);
      if(got.join() !== [q.ans].concat(q.alt).join() || q.slots !== 4 || q.lo < 10 || q.hi > 99) fail('286: the even ones', q);
    }
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(287); count('named ' + q.shape);
    if(q.shape === 'boxes'){
      const pairs = [], lo = d => d === 1 ? 0 : 10 ** (d - 1);
      for(let x = lo(q.n); x < 10 ** q.n; x++) for(let y = lo(q.m); y < 10 ** q.m; y++) if(x - y === q.r) pairs.push([x, y]);
      if(pairs.length !== 1 || pairs[0][0] !== q.ans || pairs[0][1] !== q.alt[0]) fail('287: the boxes', q);
      continue;
    }
    const most = /най-гол[ея]м/.test(strip(Q.drawQ(q))), vals = [];   // най-големият сбор, най-голямата разлика
    for(let o = q.pos ? 1 : 0; o <= 9; o++) vals.push(q.sum ? q.a + o : q.a - o);
    if((most ? Math.max(...vals) : Math.min(...vals)) !== q.ans || q.traps.includes(q.ans) || q.ans > 99) fail('287: the edge', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(288), text = strip(Q.drawQ(q)); count('tens said');
    // the two numbers read back from the words alone
    const back = [...text.matchAll(/има(\d)десетиц[аи]и(същотолкова|с(една|две|три)(по-малко|повече))единици/g)]
      .map(m => { const t = +m[1], k = {една:1, две:2, три:3}[m[3]] || 0; return 10*t + (m[2] === 'същотолкова' ? t : m[4] === 'повече' ? t + k : t - k); });
    if(back.length !== 2 || back.some(v => v < 10 || v > 99) || (q.sum ? back[0] + back[1] : back[0] - back[1]) !== q.ans || q.ans < 0 || q.ans > 99 || q.traps.includes(q.ans)) fail('288: the numbers ' + back, q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(289), found = []; count('sumdiff two');
    for(let x = 0; x <= q.S; x++) for(let y = 0; y < x; y++) if(x + y === q.S && x - y === q.d) found.push([x, y]);
    if(found.length !== 1 || found[0][0] !== q.ans || found[0][1] !== q.alt[0] || q.alt[0] < 1 || q.S > 60) fail('289: the pair', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(290), st = q.seq.slice(1).map((v, j) => v - q.seq[j]); count('diffseq ' + q.shape);
    if(q.shape === 'const'){
      if(q.seq.length !== 5 || st.some(x => x !== (q.up ? q.d : -q.d)) || q.seq.some(v => v < 0 || v > 99) || [q.ans].concat(q.alt).join() !== q.seq.slice(1).join()) fail('290: the five', q);
    } else {
      const dd = st.slice(1).map((v, j) => v - st[j]);
      if(new Set(dd).size !== 1 || dd[0] < 1 || dd[0] > 2 || st[0] < 1 || q.seq[q.seq.length - 1] !== q.ans || q.ans > 99 || q.seq.length < 6 || q.traps[0] !== q.seq[q.seq.length - 2] + st[st.length - 2]) fail('290: the run', q);
    }
  }
  if(Object.keys(n).length !== 12) throw new Error('the new generators did not draw every shape: ' + JSON.stringify(n));
  for(const [year, not] of [[2025, ''], [2024, ''], [2023, ''], [2022, '; not in the app: 12 (Santa\'s path from 2 adding 12 is a colouring; its rule is level 290\'s five numbers); 5 is asked as how many, not written out']])
    console.log('Аз и числата ' + year + ' 2 клас: tasks ' + met[year].join(', ') + ' pinned (our solution, no official key; * the same question with other numbers)' + not);
  console.log('Аз и числата, numbers and digits: ' + Object.entries(n).map(([k, v]) => v + ' ' + k).join(', ') + ' worked out again another way');
}
