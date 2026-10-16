// Runs beside the app (in check.js's own scope, through eval), like check/grade1c-A.js.
// Аз и числата (СБНУ), 2 клас, 2022, 2024 and 2025 — the word problems of builder E: three groups 296, giving to have
// the same 297, a place from the other end 298, who bought which fruit 299. The papers come with no key: each printed
// task is checked against our own solution, drawn as printed and asked exactly by its level; then each new generator
// is worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // sig: the fields that make the printed question; tries: how far to search when no seed is recorded
  const pin = (name, tag, id, q, key, shows, sig, tries = 2e6) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', our solution says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': our solution is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const want = sig(q);
    if(pinSeed(name, () => Q.raw(id), g => g.kind === q.kind && sig(g) === want ? 2 : 0, tries)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  const sig3 = g => [g.three, g.shape, g.story, g.a, g.d1, g.more1, g.d2, g.more2, g.ref].join('|');
  const three = (shape, story, a, d1, more1, d2, more2, ref, ans) => {
    const b = more1 ? a + d1 : a - d1, c = more2 ? (ref ? b : a) + d2 : (ref ? b : a) - d2;
    return {kind:'andmore', three:true, shape, story, a, d1, more1, d2, more2, ref, b, c, ans};
  };

  // 2022, задача 1: 27 trucks, the bears 14 more, the dolls 9 fewer than the bears — 41, 32, 100 toys
  pin('Аз и числата 2022 task 1', 'ach-2022-2', 296, three('total', 0, 27, 14, true, 9, false, 1, 100), [100],
    'В магазин за играчки получили 27 камиончета. Мечетата били с 14 повече от камиончетата, а куклите — с 9 по-малко от мечетата. Колко играчки общо са получили?', sig3);
  // 2024, задача 6: 23 wagons, the second 8 more, the third 9 fewer than the first — its three questions
  const trains = 'От товарна гара потеглили три влака. Първият имал 23 вагона. Вторият имал с 8 вагона повече от първия, а третият — с 9 вагона по-малко от вагоните в първия влак. ';
  pin('Аз и числата 2024 task 6 (second)', 'ach-2024-2', 296, three('second', 1, 23, 8, true, 9, false, 0, 31), [31], trains + 'Колко вагона има във втория влак?', sig3);
  pin('Аз и числата 2024 task 6 (third)', 'ach-2024-2', 296, three('third', 1, 23, 8, true, 9, false, 0, 14), [14], trains + 'Колко вагона има в третия влак?', sig3);
  pin('Аз и числата 2024 task 6 (all)', 'ach-2024-2', 296, three('total', 1, 23, 8, true, 9, false, 0, 68), [68], trains + 'Колко вагона има общо в трите влака?', sig3);

  // 2022, задача 2: Тони 35, «give me 10 and we have the same» — Габи had 15 (35 − 10 = 25, 25 − 10 = 15)
  pin('Аз и числата 2022 task 2', 'ach-2022-2', 297, {kind:'equalize', shape:'before', pair:0, thing:0, a:35, b:15, k:10, ans:15}, [15],
    'Тони има 35 картички. Габи ѝ казала: „Ако ми дадеш 10 картички от твоите, двете ще имаме поравно.“ Колко картички имала Габи в началото?',
    g => [g.shape, g.pair, g.thing, g.a, g.k].join('|'));

  // 2025, задача 10: 28 books, the fifteenth from the left — the fourteenth from the right
  pin('Аз и числата 2025 task 10', 'ach-2025-2', 298, {kind:'shelf', shape:'pos', story:0, who:0, n:28, k:15, ans:14}, [14],
    'Ники подредил 28 книги на един рафт в библиотеката. Преброил, че книгата „Пипи дългото чорапче“ е петнадесета отляво надясно. На кое място е тази книга, ако се брои отдясно наляво?',
    g => [g.shape, g.story, g.who, g.n, g.k].join('|'));

  // 2022, задача 11: Мина, Иво, Петър; an apple, a pear, a banana; Мина does not like bananas; the apple's boy starts
  // with a vowel — Иво the apple, Мина the pear, Петър the banana, asked one child at a time (А/Б/В/Г)
  const fruitQ = ask => {
    const texts = [['ябълка', 'яблуко'], ['круша', 'груша'], ['банан', 'банан'], ['Не може да се каже', 'Не можна визначити']], has = [1, 0, 2];
    return {kind:'whocolor', shape:'fruit', kids:[0, 0, 0], order:[0, 1, 2], fruits:[0, 1, 2], has, vowel:true, ask,
      options: texts.map((text, id) => ({ id, v: id, text })), pick: has[ask], own: true, ans: has[ask]};
  };
  const fruitStory = 'Мина, Иво и Петър си купили ябълка, круша и банан. Мина не обича банани. Името на момчето, което купило ябълка, започва с буква на гласен звук. ';
  const sigF = g => JSON.stringify([g.shape, g.kids, g.order, g.fruits, g.has, g.vowel, g.ask]);
  [[0, 'Кой плод си е купила Мина?', 'круша'], [1, 'Кой плод си е купил Иво?', 'ябълка'], [2, 'Кой плод си е купил Петър?', 'банан']].forEach(([ask, asks, fruit]) => {
    const q = fruitQ(ask);
    if(q.options[q.pick].text[0].replace(/<[^>]*>/g, '') !== fruit) fail('Аз и числата 2022 task 11: the right option is not ' + fruit, q);
    pin('Аз и числата 2022 task 11 (' + fruit + ')', 'ach-2022-2', 299, q, [q.pick], fruitStory + asks, sigF, 2e7);
  });

  // 296 again: the three groups told one from another, and the slips never the answer
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(296)), second = q.a + (q.more1 ? q.d1 : -q.d1), third = (q.ref ? second : q.a) + (q.more2 ? q.d2 : -q.d2);
    const want = {second, third, chain: third, total: q.a + second + third}[q.shape];
    if(q.ans !== want || q.b !== second || q.c !== third) fail('296: the groups do not add up', q);
    if(second < 5 || third < 5 || q.a + second + third > 100 || q.d1 === q.d2 || (q.shape === 'chain') !== (q.ref === 1 && q.shape !== 'second' && q.shape !== 'total')) fail('296: out of range', q);
    if(q.traps.includes(q.ans)) fail('296: a slip is the answer', q);
    const s = strip(Q.drawQ(q));
    if(![q.a, q.d1, q.d2].every(v => s.includes(String(v)))) fail('296: a number given is not shown', q);
  }
  // 297 again: hand over and count
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(297));
    if(q.shape === 'give'){ if(!(q.ans > 0 && q.a - q.ans === q.b + q.ans)) fail('297: after giving they do not have the same', q); }
    else if(!(q.ans > 0 && q.ans + q.k === q.a - q.k)) fail('297: with the gift they do not have the same', q);
    if(q.traps.includes(q.ans) || q.a > 99) fail('297: a slip is the answer, or too many', q);
  }
  // 298 again: lay the row out and count from the other end
  const ords = new Set();
  for(let n = 1; n < 40; n++){ const o = APP.shelfOrdBg(n) + '|' + APP.shelfOrdUk(n); if(ords.has(o) || /undefined/.test(o)) throw new Error('298: ordinal ' + n + ' is ' + o); ords.add(o); }
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(298));
    if(q.shape === 'total'){
      const row = Array.from({length: q.ans}, (_, j) => j + 1), at = row[q.k - 1];
      if(row.length - at + 1 !== q.m || q.k > q.ans || q.m > q.ans) fail('298: the row does not hold both places', q);
    } else {
      const row = Array.from({length: q.n}, (_, j) => j === q.k - 1), fromRight = row.slice().reverse().indexOf(true) + 1;
      if(fromRight !== q.ans || q.k < 2 || q.k >= q.n || fromRight === q.k) fail('298: counted from the right it is not the answer', q);
    }
    if(q.traps.includes(q.ans)) fail('298: a slip is the answer', q);
    if(strip(Q.drawQ(q)).indexOf(APP.shelfOrdBg(q.k).replace(/\s+/g, '')) < 0) fail('298: the place is not said in words', q);
  }
  // 299 again: every way to hand out the fruit, read against the clues as words — the girl's not, and the boy whose
  // name starts with the sound named (a vowel letter: А Е И О У Ъ); exactly one way fits, and it is the one drawn
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(299)), s = String(Q.drawQ(q)).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const nm = s.match(/^(\S+), (\S+) и (\S+) си купили (\S+), (\S+) и (\S+)\. (\S+) не обича (\S+)\. Името на момчето, което купило (\S+), започва с буква на (гласен|съгласен) звук/);
    if(!nm) fail('299: the story cannot be read', q);
    const kids = [nm[1], nm[2], nm[3]], fruits = [nm[4], nm[5], nm[6]], girl = kids.indexOf(nm[7]), X = fruits.indexOf(nm[9]), vowel = nm[10] === 'гласен';
    const notFruit = fruits.findIndex(f => nm[8] === ({'ябълка':'ябълки', 'круша':'круши', 'банан':'банани', 'портокал':'портокали', 'праскова':'праскови'})[f]);
    if(girl !== 0 || X < 0 || notFruit < 0) fail('299: the clues name no one', q);
    const fits = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].filter(p => p[girl] !== notFruit &&
      [1, 2].every(b => (p[b] === X) === ('АЕИОУЪ'.includes(kids[b][0]) === vowel)));
    if(fits.length !== 1) fail('299: the clues allow ' + fits.length + ' ways', q);
    const k = q.order[[0, 1, 2].find(j => kids[j] === s.match(/Кой плод си е купила? (\S+)\?/)[1])];
    if(fits[0][q.order.indexOf(k)] !== q.has[k]) fail('299: the drawn answer is not the only fit', q);
    if(q.options.length !== 4 || q.options.filter(o => o.text[0].replace(/<[^>]*>/g, '') === fruits[fits[0][q.order.indexOf(q.ask)]]).length !== 1 || q.options[q.pick].text[0].replace(/<[^>]*>/g, '') !== fruits[fits[0][q.order.indexOf(q.ask)]]) fail('299: the right option is not the one picked', q);
  }
  console.log('Аз и числата 2022 2 клас: tasks 1 (296), 2 (297) and 11 (299, each child asked) pinned (our solution, no official key)');
  console.log('Аз и числата 2024 2 клас: task 6 pinned on 296, its three questions one by one (our solution, no official key); the paper matches each question to its worked line, here typed');
  console.log('Аз и числата 2025 2 клас: task 10 pinned on 298 (our solution, no official key); the paper offers А/Б/В (15, 14, 16 по ред), here typed');
}
