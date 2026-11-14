// Runs beside the app (in check.js's own scope, through eval), like check/ek-W1.js.
// Салабашев, 2 клас — wave 1, builder S2: text tasks, levels 450–456 and the widened 47, 115, 119, 125, 296, 297, 310. The tasks of this part, by paper:
//   2019 #3 (50 apples, Грух 17, Прас 7 more: Квик?) → 119; #5 (7 years ago Мими was 8: Ани now) → 125; #8 (20 red cubes, green, then yellow) → 450;
//   #11 (Мишо's floor: as many above as below) → 455; #13 (the backpacks, Пипи's money) → 456; 2020 #6 (40 sweets, 16, 6 more: left) → 119;
//   2021 #4 (11 and 17 apples: how many to give) → 297; #10 (my brother in 5 years is my age now) → 452; 2022 #3 (80 nuts, 25, 3 more: left) → 119;
//   #5 (Мими 21, Таня 3 younger, 2 older than Пепи) → 125; #6 (70 trolleys, 46, 3 more) → 47; #8 (Никола and Георги told) → 453; #10 (snowflakes, bells, trees) → 450;
//   2023 #5 (37, +16, +26 points) → 125; #10 (2А has 18 more, 4 go) → 297; #15 (the carousel, seats 3 and 8) → 115; 2024 #7 (Фифо, Кико, Пипо: which is true) → 451;
//   #11 (22 baubles, the bell and the star) → 454; #12 (17 cars before Ваньо's) → 310; 2025 #5 (44 biscuits, 13, 15, 9: kept) → 296; #8 (Ани, Вики, Бети, Гери) → 451;
//   #12 (35 racers, Пепи and Виктор) → 454.
// Each printed task is drawn by its level with the printed numbers (and, where the generator tells it in the paper's own words, those words) and must come out at the
// official key by the generator's own answer. 2021 #10 has no key in the solutions we hold, only the paper's four options (Г 21 among them): it is held to its own
// solution, 12 + 5 + 4. Then every new shape is worked out again from the drawn text (its numbers read back from the words, the situation simulated or searched, not taken from
// the fields the generator keeps), on 2000–3000 seeds each.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 400)); };
  const tagged = (id, tag) => { if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag); };
  const pin = (name, tag, id, same, shows, key) => {
    const hit = pinSeed(name, () => Q.raw(id), g => same(g) ? 2 : 0, 2e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    tagged(id, tag);
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': the level gives ' + Q.answers(q) + ', the key says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    return q;
  };
  const plain = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const ints = h => (plain(h).match(/\d+/g) || []).map(Number);
  const n = {}, count = k => n[k] = (n[k] || 0) + 1;

  // ---- the printed instances
  pin('Салабашев 2019 task 3', 'sal-2019-2', 119, g => g.shape === 'rest' && g.story === 0 && g.T === 50 && g.a === 17 && g.d === 7,
    ['Прасенцата Грух, Прас и Квик изяли общо 50 ябълки. Грух изял 17 ябълки, а Прас изял със 7 ябълки повече от Грух. Колко ябълки изял Квик?'], 9);
  pin('Салабашев 2020 task 6', 'sal-2020-2', 119, g => g.shape === 'rest' && g.story === 1 && g.T === 40 && g.a === 16 && g.d === 6,
    ['Мили и Лори получили кутия с 40 бонбона. Лори взела 16 бонбона, а Мили взела с 6 бонбона повече. Колко бонбона останали в кутията?'], 2);
  pin('Салабашев 2022 task 3', 'sal-2022-2', 119, g => g.shape === 'rest' && g.story === 2 && g.T === 80 && g.a === 25 && g.d === 3,
    ['Катеричката събрала 80 ореха', 'Колко ореха ще останат за катеричката?'], 27);
  pin('Салабашев 2025 task 5', 'sal-2025-2', 296, g => g.shape === 'kept' && g.T === 44 && g.a === 13 && g.k === 2 && g.m === 9,
    ['пакет с 44 бисквити', 'Дала 13 от останалите бисквити на сина си Марти и с 2 повече на братовчед му Мони. Последните 9 бисквити дала на татко Миро. Колко бисквити е запазила за себе си мама Мия?'], 7);
  pin('Салабашев 2019 task 8', 'sal-2019-2', 450, g => g.story === 0 && g.n === 20,
    ['Лили подредила в редица 20 червени кубчета. Между всеки две съседни кубчета тя поставила по едно зелено кубче. В новата редица между всеки две съседни кубчета поставила по едно жълто кубче. Колко са всички кубчета в редицата?'], 77);
  pin('Салабашев 2022 task 10', 'sal-2022-2', 450, g => g.story === 1 && g.n === 10,
    ['Милица направила гирлянд с коледни играчки. Първо окачила 10 снежинки. Между всеки две съседни снежинки окачила по една камбанка. Накрая между всеки две съседни играчки окачила по една елхичка. Общо колко играчки е окачила тя на гирлянда?'], 37);
  pin('Салабашев 2019 task 5', 'sal-2019-2', 125, g => g.shape === 'ago' && g.x === 6 && g.y === 2 && g.z === 7 && g.p === 8,
    ['Ани е с 6 години по-голяма от Ели, а Ели е с 2 години по-малка от Мими. Преди 7 години Мими беше на 8 години. На колко години е Ани сега?'], 19);
  // the paper writes «с две години»; the level writes the 2 as a digit
  pin('Салабашев 2022 task 5', 'sal-2022-2', 125, g => g.shape === 'three' && g.M === 21 && g.x === 3 && g.y === 2,
    ['Мими е на 21 години. Таня е с 3 години по-малка от Мими и с 2 години по-голяма от Пепи. На колко години е Пепи?'], 16);
  pin('Салабашев 2023 task 5', 'sal-2023-2', 125, g => g.shape === 'points' && g.m === 37 && g.x === 16 && g.y === 26,
    ['На тест по математика Лили получи с 16 точки повече от Мими, която получи 37 точки, а Нина получи с 26 точки повече от Лили. Колко точки е получила Нина?'], 79);
  // 2024 #7: the four statements in the paper's order (А and Б younger by 9 and 5, В and Г older by 9 and 5), the key Г
  {
    const printed = ['Пипо е с 9 години по-малък от Кико', 'Пипо е с 5 години по-малък от Кико', 'Пипо е с 9 години по-голям от Кико', 'Пипо е с 5 години по-голям от Кико'];
    const q = pin('Салабашев 2024 task 7', 'sal-2024-2', 451, g => g.shape === 'older' && g.y === 7 && g.d === 2 && g.younger && JSON.stringify(g.options.map(o => o.text[0])) === JSON.stringify(printed),
      ['Преди 7 години Фифо беше на толкова години, на колкото е Кико сега. Пипо е с 2 години по-малък от Фифо. Вярно е, че:'], 3);
    if(q.pick !== 3 || !q.own) fail('2024 #7: the key is Г, the fourth statement', q);
  }
  pin('Салабашев 2025 task 8', 'sal-2025-2', 451, g => g.shape === 'birth' && g.a === 2 && g.b === 6 && g.c === 7,
    ['Когато Вики се роди, Ани беше на 2 години. Вики е с 6 години по-малка от Бети, а Гери е със 7 години по-голяма от Ани. На колко години е била Гери, когато Бети се е родила?'], 3);
  // 2021 #10 has no key in the solutions we hold: its own solution, 12 + 5 = 17 now, 17 + 4 = 21 (the paper's options are 12, 16, 20, 21)
  pin('Салабашев 2021 task 10', 'sal-2021-2', 452, g => g.b === 12 && g.a === 5 && g.c === 4,
    ['На колко години ще бъда след 4 години, ако след 5 години моят дванадесетгодишен брат ще бъде на толкова години, на колкото съм аз сега?'], 21);
  pin('Салабашев 2021 task 4', 'sal-2021-2', 297, g => g.shape === 'give' && g.a === 17 && g.b === 11, ['Колко'], 3);
  pin('Салабашев 2023 task 10', 'sal-2023-2', 297, g => g.shape === 'gap' && g.D === 18 && g.k === 4,
    ['Преди минута в стаята на 2А клас имаше 18 деца повече, отколкото в стаята на 2Б клас. Четири деца от стаята на 2А клас отидоха в стаята на 2Б клас. С колко децата в стаята на 2А клас сега са повече от децата в стаята на 2Б клас?'], 10);
  pin('Салабашев 2022 task 8', 'sal-2022-2', 453, g => g.p === 5 && g.q === 9 && g.n === 25 && g.g === 31,
    ['Никола казал на Георги: „Ако ми дадеш 5 от твоите бонбони, аз ще имам 30 бонбона!“ Георги му отговорил: „Не, ти ще ми дадеш 9 от твоите бонбони и аз ще имам 40 бонбона!“ Колко бонбони трябва да даде Георги на Никола, за да имат двамата по равно?'], 3);
  pin('Салабашев 2024 task 11', 'sal-2024-2', 454, g => g.shape === 'cross' && g.n === 22 && g.k === 15 && g.m === 15,
    ['Еми подредила любимите си 22 различни коледни украшения за елха в редица. Златистата камбанка е на 15-то място отляво надясно в тази редица. Сребърната звезда е на 15-то място отдясно наляво в редицата. Колко от украшенията в редицата са вдясно от сребърната звезда, но вляво от златистата камбанка?'], 6);
  pin('Салабашев 2025 task 12', 'sal-2025-2', 454, g => g.shape === 'ahead' && g.n === 35 && g.a === 17 && g.b === 25,
    ['Пепи и Виктор били сред 35 участници в състезание. В крайното класиране Виктор бил изпреварен от 17 души, сред които бил Пепи. При това 25 от участниците се класирали след Пепи. Колко състезатели са се класирали след Пепи, но пред Виктор?'], 7);
  pin('Салабашев 2024 task 12', 'sal-2024-2', 310, g => g.shape === 'cars' && g.a === 17 && g.k === 9 && g.who === 0,
    ['Ваньо се вози в един от вагоните на влак. Вагоните пред неговия са 17 и са с 9 по-малко от вагоните след неговия. Колко общо са вагоните на този влак?'], 44);
  pin('Салабашев 2019 task 11', 'sal-2019-2', 455, g => g.m === 16 && g.x === 7 && g.T === 8 && g.y === 15,
    ['Мишо живее във висок блок. Над неговия етаж има толкова етажи, колкото и под него. Иво живее със 7 етажа по-нагоре от Мишо, а Тони е 15 етажа по-надолу от Иво. Тони живее на осмия етаж. Колко етажа има в блока на Мишо?'], 31);
  pin('Салабашев 2023 task 15', 'sal-2023-2', 115, g => g.shape === 'opposite' && g.a === 3 && g.b === 8,
    ['Местата за сядане на кръгла въртележка са на равно разстояние едно от друго и са номерирани с 1, 2, 3, … и така нататък. Невена седи на място номер 3, точно срещу Албена, която е на място номер 8. Колко места има на въртележката?'], 10);
  pin('Салабашев 2022 task 6', 'sal-2022-2', 47, g => g.shape === 'more' && g.asks === 0 && g.T === 70 && g.ab === 46 && g.d === 3,
    ['Тони, Мони и Сони имат общо 70 колички. Тони и Мони имат общо 46 колички. Мони има с 3 колички повече от Сони. Колко колички има Тони?'], 19);
  pin('Салабашев 2019 task 13', 'sal-2019-2', 456, g => g.r === 6 && g.s === 9,
    ['Пипи тръгнала по магазините. Тя пресметнала, че ако купи раница на себе си и на Аника, ще останат 6 парички, но 9 парички не стигат, за да купи раница и за Томи. С колко парички е тръгнала по магазините Пипи?'], 36);

  // ---- every new shape, worked out again from its drawn text
  const must = (shape, id, i) => { const q = Q.seeded(i, () => Q.raw(id)); return q.shape === shape ? q : null; };
  const each = (name, id, shape, seeds, f) => { let got = 0; for(let i = 1; i <= seeds; i++){ const q = must(shape, id, i); if(!q) continue; got++; count(name); f(q, Q.drawQ(q), i); } if(got < 100) throw new Error(name + ': only ' + got + ' questions of shape ' + shape + ' on level ' + id); };
  const right = (name, q, want) => { if(Q.answers(q).join() !== String(want)) fail(name + ': the task asks for ' + want + ', the level gives ' + Q.answers(q), q); };
  const noSlip = (name, q) => { if((q.traps || []).includes(q.ans)) fail(name + ': a slip is the answer', q); };

  // 119 rest: three numbers, in the order total, first, "so many more"; the second takes first + more, what is left
  each('rest', 119, 'rest', 3000, (q, t) => {
    const [T, a, d] = ints(t); let left = T; left -= a; left -= a + d;
    right('119 rest', q, left); noSlip('119 rest', q);
    if(left < 2 || !/повече/.test(plain(t))) fail('119 rest: too few left, or no «повече»', q);
  });
  // 296 kept: total, first, "so many more" for the second, the last; what the first keeps
  each('kept', 296, 'kept', 3000, (q, t) => {
    const [T, a, k, m] = ints(t); right('296 kept', q, T - a - (a + k) - m); noSlip('296 kept', q);
    if(T - a - (a + k) - m < 3) fail('296 kept: too few kept', q);
  });
  // 450: the row built, cube by cube
  each('twice', 450, 'twice', 2000, (q, t) => {
    const [N] = ints(t); let row = Array(N).fill('R'); const between = (r, c) => { const o = []; r.forEach((x, i) => { if(i) o.push(c); o.push(x); }); return o; };
    row = between(row, 'G'); row = between(row, 'Y');
    right('450', q, row.length); noSlip('450', q);
    if(row.filter(x => x === 'G').length !== N - 1 || row.filter(x => x === 'Y').length !== 2*N - 2) fail('450: the counts of the new ones are not n − 1 and 2n − 2', q);
  });
  // 125: three chains
  each('ago', 125, 'ago', 2000, (q, t) => {
    const [x, y, z, p] = ints(t); const M = p + z, E = M - y, A = E + x;
    right('125 ago', q, A); noSlip('125 ago', q);
    if(!/Преди \d+ години Мими беше на \d+ години/.test(plain(t)) || E < 1) fail('125 ago: the anchor is not as told', q);
  });
  each('three', 125, 'three', 2000, (q, t) => { const [M, x, y] = ints(t); right('125 three', q, M - x - y); noSlip('125 three', q); if(M - x - y < 5) fail('125 three: Пепи too young', q); });
  each('points', 125, 'points', 2000, (q, t) => { const [x, m, y] = ints(t); right('125 points', q, m + x + y); noSlip('125 points', q); if(m + x + y > 99) fail('125 points: beyond 99', q); });
  // 451 older: the statements are searched, exactly one is true of the ages that fit (Кико at any age, Фифо y older, Пипо d younger or older than Фифо)
  each('older', 451, 'older', 3000, (q, t) => {
    const [y, d] = ints(t), younger = /по-малък от Фифо/.test(plain(t));
    if(!younger && !/по-голям от Фифо/.test(plain(t))) fail('451 older: no direction for Пипо', q);
    const kiko = 20, fifo = kiko + y, pipo = younger ? fifo - d : fifo + d;
    const truth = q.options.map(o => { const s = o.text[0], m = s.match(/е (?:с|със) (\d+) години (по-малък|по-голям) от Кико/); if(!m) fail('451 older: an option is not a statement', q); return (m[2] === 'по-голям' ? pipo - kiko : kiko - pipo) === +m[1]; });
    if(truth.filter(Boolean).length !== 1 || !truth[q.pick] || q.ans !== q.pick) fail('451 older: not exactly the picked statement is true', q);
    if(q.options.length !== 4 || new Set(q.options.map(o => o.text[0])).size !== 4) fail('451 older: not four different statements', q);
    // the same in Ukrainian, with the same numbers in the same places
    Q.setLang('uk'); const u = Q.drawQ(q) + q.options.map(o => o.text[1]).join(' '); Q.setLang('bg');
    if(ints(u).join() !== ints(t + q.options.map(o => o.text[0]).join(' ')).join()) fail('451 older: the Ukrainian text has other numbers', q);
  });
  each('birth', 451, 'birth', 2000, (q, t) => {
    const [a, b, c] = ints(t);   // Ани is a older than Вики, Бети b older than Вики, Гери c older than Ани: Гери − Бети
    const vicky = 0, ani = vicky + a, beti = vicky + b, geri = ani + c;
    right('451 birth', q, geri - beti); noSlip('451 birth', q);
    if(b <= a || geri - beti < 2) fail('451 birth: Бети not older than Ани, or Гери barely older than Бети', q);
  });
  // 452: the brother's age told in words, read back
  const WORDS = { шестгодишен: 6, седемгодишен: 7, осемгодишен: 8, деветгодишен: 9, десетгодишен: 10, единадесетгодишен: 11, дванадесетгодишен: 12, тринадесетгодишен: 13, четиринадесетгодишен: 14 };
  for(let i = 1; i <= 2000; i++){
    const q = Q.seeded(i, () => Q.raw(452)), t = plain(Q.drawQ(q)); count('same');
    const [c, a] = ints(t), b = WORDS[(t.match(/моят (\S+) брат/) || [])[1]];
    if(!b) fail('452: the brother\'s age is not a known word: ' + t, q);
    right('452', q, b + a + c); noSlip('452', q);
  }
  // 297 gap: the children move one by one between two rooms
  each('gap', 297, 'gap', 2000, (q, t) => {
    const W = { Две: 2, Три: 3, Четири: 4, Пет: 5, Шест: 6 }, D = +plain(t).match(/имаше (\d+) деца повече/)[1], k = W[(plain(t).match(/клас\. (\S+) деца от стаята/) || [])[1]];
    if(!k) fail('297 gap: the number of children moving is not a known word', q);
    let A = D, B = 0; for(let i = 0; i < k; i++){ A--; B++; }
    right('297 gap', q, A - B); noSlip('297 gap', q);
    if(A - B < 2) fail('297 gap: the gap closes', q);
  });
  // 453 told: what each has before, then give one by one till they are equal
  each('told', 453, 'told', 3000, (q, t) => {
    const [p, N1, qq, G1] = ints(t), N = N1 - p, G = G1 - qq;
    if(G <= N || (G - N) % 2) fail('453: the gap is not even and the right way', q);
    let g = G, nn = N, given = 0; while(g > nn){ g--; nn++; given++; }
    if(g !== nn) fail('453: they never come out equal', q);
    right('453', q, given); noSlip('453', q);
    if(p === qq) fail('453: the two statements give the same number', q);
  });
  // 310 cars: cars before = a, after = a + k, plus his own
  each('cars', 310, 'cars', 3000, (q, t) => {
    const [a, k] = ints(t); right('310 cars', q, a + (a + k) + 1); noSlip('310 cars', q);
    if(!/по-малко от вагоните след неговия/.test(plain(t))) fail('310 cars: the direction is not «по-малко от вагоните след»', q);
  });
  // 454: the row is built and the places searched
  each('cross', 454, 'cross', 3000, (q, t) => {
    const [N, bell, star] = ints(t), pos = Array.from({ length: N }, (_, i) => i + 1);
    const starAt = N - star + 1, between = pos.filter(p => p > starAt && p < bell).length;
    if(!(starAt >= 1 && bell <= N && starAt < bell)) fail('454 cross: the star is not left of the bell', q);
    right('454 cross', q, between); noSlip('454 cross', q);
    if(between < 2 || between > 9) fail('454 cross: the answer is out of 2…9', q);
  });
  each('ahead', 454, 'ahead', 3000, (q, t) => {
    const [N, before, after] = ints(t);
    // places 1…N; Пепи has `after` behind her, so she is N − after; Виктор is preceded by `before`, so he is before + 1; Пепи is among those before
    const pepi = N - after, viktor = before + 1;
    if(!(pepi >= 1 && pepi < viktor && viktor <= N)) fail('454 ahead: Пепи is not ahead of Виктор', q);
    right('454 ahead', q, Array.from({ length: N }, (_, i) => i + 1).filter(p => p > pepi && p < viktor).length); noSlip('454 ahead', q);
  });
  // 455: the block searched floor by floor
  const ORD = { втория: 2, третия: 3, четвъртия: 4, петия: 5, шестия: 6, седмия: 7, осмия: 8, деветия: 9 };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(455)), t = plain(Q.drawQ(q)); count('floors');
    const [x, y] = ints(t), T = ORD[(t.match(/на (\S+) етаж\./) || [])[1]];
    if(!T) fail('455: Тони\'s floor is not a known word: ' + t, q);
    const misho = T + y - x; let found = [];
    for(let N = 1; N <= 80; N++) if(misho >= 1 && misho <= N && misho - 1 === N - misho) found.push(N);   // as many below as above
    if(found.length !== 1) fail('455: no unique block', q);
    right('455', q, found[0]); noSlip('455', q);
    if(misho < 6 || y < 3) fail('455: odd numbers', q);
    if(T + y > found[0]) fail('455: Иво lives above the top floor', q);   // every one of them lives in the block
  }
  // 456: the money searched: p for a backpack, r left after two, s short for three
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(456)), [r, s] = ints(Q.drawQ(q)); count('price');
    const ms = []; for(let p = 1; p <= 40; p++){ const money = 2*p + r; if(3*p - money === s) ms.push(money); }
    if(ms.length !== 1) fail('456: not one amount of money', q);
    right('456', q, ms[0]); noSlip('456', q);
  }
  // 115 opposite: N seats, seat a opposite seat b: N is even and b = a + N / 2 (counting round the ring)
  each('opposite', 115, 'opposite', 3000, (q, t) => {
    const m = plain(t).match(/номер (\d+)\s*, точно срещу Албена, която е на място номер (\d+)/), a = +m[1], b = +m[2], N = [];
    for(let s = 2; s <= 60; s += 2) if(b <= s && a + s / 2 === b) N.push(s);
    if(N.length !== 1) fail('115 opposite: not one carousel', q);
    right('115 opposite', q, N[0]); noSlip('115 opposite', q);
  });
  // 47 more: the three numbers peeled off, whoever is asked
  each('more', 47, 'more', 3000, (q, t) => {
    const [T, ab, d] = ints(t), who = (plain(t).match(/Колко колички има (\S+)\?/) || [])[1], c = T - ab, b = c + d, a = ab - b;
    if(a < 2 || b < 1) fail('47 more: a number is too small', q);
    right('47 more', q, { Тони: a, Мони: b, Сони: c }[who]); noSlip('47 more', q);
    if(!/<b>повече<\/b>/.test(Q.drawQ(q))) fail('47 more: «повече» is not marked', q);
  });
  console.log('Салабашев wave 1, builder S2: ' + Object.entries(n).map(([k, v]) => k + ' ' + v).join(', '));
}
