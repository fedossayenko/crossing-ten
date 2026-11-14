// Runs beside the app (in check.js's own scope, through eval), like check/ek-W1.js.
// Салабашев, 2 клас — builder S3, text tasks: 2020 #13 #14, 2019 #9 #14, 2021 #8 #14 #15, 2022 #11 #15, 2023 #3 #11 #12, 2024 #5 #8 #9 #10,
// 2025 #9 #11, on levels 20, 38, 40, 42, 282, 320, 321, 323, 335 (widened) and 460–468 (new). Each printed task is drawn by its level as printed
// and must come out at the official key by the generator's own answer; then every shape is worked out again on 2000–3000 seeds from the
// numbers in the DRAWN text (the numbers read back from the page, not the fields the generator keeps), by trying every possibility.
// 2021 #8 has a key (А, 16); 2021 #14 and #15 have none, so they are held to our own solution (4 and 12). 2024 #9 asks which of four
// statements is surely true, its key Г says the blueberry is lighter than the raspberry: level 460 asks the same fact as a number, by how much
// the raspberry is heavier (2 at the paper's numbers), and the check holds that it is a positive number.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const pin = (name, tag, id, same, shows, key) => {
    const hit = pinSeed(name, () => Q.raw(id), g => same(g) ? 2 : 0, 3e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': the level gives ' + Q.answers(q) + ', the key says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    return q;
  };
  // the numbers of the drawn task, in the order the text prints them (the .num spans), and its text with the spaces kept
  const nums = q => [...Q.drawQ(q).matchAll(/<span class="num">(\d+)(?:&nbsp;[^<]*)?<\/span>/g)].map(m => +m[1]);
  const text = q => Q.drawQ(q).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const n = {}, count = k => n[k] = (n[k] || 0) + 1;

  // ---- the printed instances
  pin('Салабашев 2020 task 14', 'sal-2020-2', 320, g => g.shape === 'cost' && g.pr === 0 && g.a === 39 && g.p === 17, ['Две ябълки и круша струват 95 цента, а ябълка и круша — 56 цента', 'Колко цента струва една круша?'], 17);
  pin('Салабашев 2019 task 14', 'sal-2019-2', 321, g => g.shape === 'tiles' && g.t === 9 && g.s === 13 && g.m === 3, ['Фигура от 1 триъгълна плоча и 1 квадратна плоча тежи 22 кг, а фигура от 3 триъгълни плочи и 4 квадратни плочи — 79 кг'], 53);
  pin('Салабашев 2024 task 9', 'sal-2024-2', 460, g => g.s === 17 && g.t === 37 && g.k === 18, ['Боровинка и ягодка тежат общо 17 грама. Една къпинка, една малинка и ягодката тежат общо 37 грама. Къпинката тежи 18 грама'], 2);
  pin('Салабашев 2025 task 11', 'sal-2025-2', 38, g => g.shape === 'twonot' && g.set === 0 && g.c.join() === '12,7,13', ['В кутия има общо 32 бонбона от три вида: шоколадови, марципанови и сметанови. От бонбоните 19 не са сметанови, а 20 не са шоколадови'], 7);
  pin('Салабашев 2021 task 14', 'sal-2021-2', 335, g => g.shape === 'both' && g.pet === 0 && g.a === 12 && g.b === 11 && g.c === 4 && g.none === 10, ['В един клас от 29 ученици 12 имат куче, 11 имат котка, а 10 нямат домашен любимец. Колко ученици имат и куче, и котка?'], 4);
  pin('Салабашев 2022 task 15', 'sal-2022-2', 463, g => g.food === 0 && g.T === 25 && g.k === 5 && g.left === 2, ['Купихме 25 наденички, но сестра ми изяде с 5 повече от мен'], 14);
  pin('Салабашев 2023 task 3', 'sal-2023-2', 461, g => g.set === 0 && g.p.join() === '5,9,6' && g.M === 16, ['супа за 5 евро, основно ястие за 9 евро и десерт за 6 евро', 'комбинирано меню от трите ястия, което струва 16 евро'], 4);
  pin('Салабашев 2022 task 11', 'sal-2022-2', 462, g => g.a === 15 && g.b === 25 && g.c === 39 && g.d === 48, ['започва в началото на страница 15 и завършва в края на страница 25', 'започва в началото на страница 39 и завършва в края на страница 48'], 21);
  pin('Салабашев 2021 task 15', 'sal-2021-2', 42, g => g.p === 3 && g.q === 2 && g.boxes === 10, ['сама изяжда кутия храна за 3 дни', 'същата кутия за 2 дни', 'общо 10 кутии храна'], 12);
  pin('Салабашев 2023 task 11', 'sal-2023-2', 323, g => g.shape === 'legs' && g.n === 10 && g.L === 26, ['има общо 10 животни — крави и кокошки. Броят на краката на всички животни е 26. Колко крави има във фермата?'], 3);
  pin('Салабашев 2020 task 13', 'sal-2020-2', 20, g => g.shape === 'toward' && g.L === 30 && g.a === 17 && g.b === 16, ['пътека, дълга 30 дм', 'калинката изминава 17 дм, а охлювчето — 16 дм', 'Колко дециметра е разстоянието между тях?'], 3);
  pin('Салабашев 2024 task 8', 'sal-2024-2', 40, g => g.shape === 'ab' && g.AD === 49 && g.q === 11 && g.r === 17, ['AD = 49 см, BC = 11 см, CD = 17 см'], 21);
  pin('Салабашев 2024 task 5', 'sal-2024-2', 282, g => g.shape === 'rel' && g.P === 60 && g.a === 18 && g.k === 3 && g.longer, ['Обиколката на триъгълник е 60 см. Едната му страна е дълга 18 см и е с 3 см по-дълга от втората му страна'], 27);
  pin('Салабашев 2019 task 9', 'sal-2019-2', 464, g => g.who === 0 && g.set === 0 && g.T === 60 && g.mint === 24 && g.x === 8 && g.left === 34, ['Карлсон получил 60 бонбона, някои шоколадови, а останалите ментови. Той изял половината от шоколадовите бонбони и 8 ментови бонбона. Останали общо 34 бонбона'], 16);
  pin('Салабашев 2024 task 10', 'sal-2024-2', 465, g => g.pair === 0 && g.x === 27 && g.y === 35 && g.a === 14 && g.b === 18, ['В двора са цъфнали 27 лалета и 35 нарциса. Цъфнат още 14 цветя — все лалета, а Вени откъсне 18 от нарцисите'], 24);
  pin('Салабашев 2023 task 12', 'sal-2023-2', 466, g => g.w === 0 && g.a === 3 && g.b === 5 && g.total === 20, ['Емил прочита по 3 страници за 5 минути. Колко страници ще прочете Емил за 20 минути?'], 12);
  pin('Салабашев 2021 task 8', 'sal-2021-2', 467, g => g.crew === 0 && g.T === 12 && g.m === 6 && g.j === 2 && g.k === 4, ['Ради: „Аз и Оги уловихме общо 12 риби.“', 'Стоян: „Аз и Алекс общо уловихме с 6 риби повече от вас!“', 'Оги: „Аз улових с 2 риби повече от Ради.“', 'Алекс: „Аз улових с 4 риби повече от Стоян!“'], 16);
  pin('Салабашев 2025 task 9', 'sal-2025-2', 468, g => g.T === 47 && g.S === 23 && g.N === 12, ['Общо в четирите торбички има 47 меденки, а в три от тях има общо 23 меденки', 'има общо 12 меденки', 'Ная има с 4 меденки по-малко от Мая'], 5);

  // ---- every shape worked out again from the numbers in its drawn text, trying every possibility
  const each = (id, runs, f) => { for(let i = 1; i <= runs; i++){ const q = Q.seeded(i, () => Q.raw(id)); f(q, nums(q), text(q)); } };
  const only = (q, shape, id) => { if(shape && q.shape !== shape) return false; return true; };
  // 320 cost: A is one apple and a pear, B two apples and a pear; try every pear
  each(320, 3000, (q, v, t) => {
    if(q.shape !== 'cost') return; count('cost');
    const [B, A] = v, sols = [];
    for(let p = 1; p < A; p++) if(2*(A - p) + p === B) sols.push(p);
    if(v.length !== 2 || sols.join() !== String(q.ans) || B > 110 || !/Две \S+ и \S+ струват/.test(t)) fail('320 cost: the pear', q);
  });
  // 321 tiles: three figures read from the text; every weight of a triangle and a square tried
  each(321, 3000, (q, v, t) => {
    if(q.shape !== 'tiles') return; count('tiles');
    const [A, B] = v, fig = [...t.matchAll(/(\d+) триъгълн\S* плоч\S* и (\d+) квадратн/g)].map(m => [+m[1], +m[2]]), sols = [];
    if(fig.length !== 3 || fig[0].join() !== '1,1') fail('321 tiles: three figures, the first one of each', q);
    for(let a = 1; a < 100; a++) for(let b = 1; b < 100; b++) if(a + b === A && fig[1][0]*a + fig[1][1]*b === B) sols.push(fig[2][0]*a + fig[2][1]*b);
    if(sols.join() !== String(q.ans) || /[×÷]/.test(t) || fig[1][1] !== fig[1][0] + 1 || fig[2][1] !== fig[2][0] - 1) fail('321 tiles: the third figure', q);
    if(B > 100 || fig[1][0]*A > 100) fail('321 tiles: a weight (or the hint\'s figure) over a hundred', q);
  });
  // 460: blueberry+strawberry = s, blackberry+raspberry+strawberry = t, blackberry = k: every weight tried; raspberry − blueberry is one number, positive
  each(460, 3000, (q, v) => {
    count('berries');
    const [s, t, k] = v, diffs = new Set();
    for(let b = 1; b < s; b++) for(let m = 1; m < t - k; m++){ const y = s - b; if(k + m + y === t) diffs.add(m - b); }
    if(diffs.size !== 1 || [...diffs][0] !== q.ans || q.ans < 1) fail('460: the raspberry against the blueberry', q);
  });
  // 38 twonot: the three kinds counted every way that fits, the one asked is one number
  each(38, 3000, (q, v) => {
    if(q.shape !== 'twonot') return; count('twonot');
    const [T, nCream, nChoc] = v, sols = new Set();
    for(let ch = 1; ch < T; ch++) for(let cr = 1; ch + cr < T; cr++){ const mz = T - ch - cr; if(T - cr === nCream && T - ch === nChoc) sols.add(mz); }
    if(sols.size !== 1 || [...sols][0] !== q.ans) fail('38 twonot: the marzipan', q);
  });
  // 335 both: dogs and cats counted pupil by pupil in every split
  each(335, 3000, (q, v) => {
    if(q.shape !== 'both') return; count('both');
    const [N, a, b, none] = v, sols = [];
    for(let c = 0; c <= Math.min(a, b); c++) if((a - c) + (b - c) + c + none === N) sols.push(c);
    if(sols.join() !== String(q.ans) || q.ans < 1 || q.ans >= Math.min(a, b) - 1) fail('335 both: those with both', q);
  });
  // 463: me, then my sister with k more; what was eaten plus what is on the plate is what was bought
  each(463, 3000, (q, v) => {
    count('ate');
    const [T, k, left] = v, sols = [];
    for(let me = 1; me < T; me++) if(me + (me + k) + left === T) sols.push(me + k);
    if(sols.join() !== String(q.ans) || /[×÷]/.test(text(q))) fail('463: the sister', q);
  });
  // 461: the three prices and the bundle; the saving is what ordering them apart costs over the bundle
  each(461, 2000, (q, v) => {
    count('combo');
    const [p1, p2, p3, M] = v;
    if(v.length !== 4 || p1 + p2 + p3 - M !== q.ans || q.ans < 1) fail('461: the saving', q);
  });
  // 462: the pages of each tale listed one by one, first and last page both read
  each(462, 2000, (q, v) => {
    count('tales');
    const [a, b, c, d] = v, seen = new Set();
    for(let pg = a; pg <= b; pg++) seen.add(pg);
    for(let pg = c; pg <= d; pg++) seen.add(pg);
    if(seen.size !== q.ans || !(a < b && b < c && c < d)) fail('462: the pages read', q);
  });
  // 464: the sweets counted one by one for every number of chocolate ones the clues allow
  each(464, 3000, (q, v) => {
    count('halfleft');
    const [T, x, left] = v, sols = [];
    for(let h = 1; 2*h < T; h++){ const mint = T - 2*h; if(mint >= x && h + (mint - x) === left) sols.push(mint - x); }
    if(sols.join() !== String(q.ans) || q.ans < 1) fail('464: the mints left', q);
  });
  // 465: tulips and daffodils after the changes; the tulips are the more
  each(465, 2000, (q, v) => {
    count('blooms');
    const [x, y, a, b] = v;
    if((x + a) - (y - b) !== q.ans || q.ans < 1) fail('465: how many more', q);
  });
  // 466: the minutes counted lot by lot, no multiplying: the answer is what the lots add up to
  each(466, 2000, (q, v, t) => {
    count('pace');
    const [a, b, total] = v;
    let pages = 0, lots = 0;
    for(let m = b; m <= total; m += b){ pages += a; lots++; }
    if(total % b || pages !== q.ans || lots < 3 || /[×÷]/.test(strip(Q.why(q, true)) + strip(Q.why(q, false)) + text(q))) fail('466: the pages in the whole time', q);
  });
  // 467: the four catches tried one by one against the four statements
  each(467, 3000, (q, v) => {
    count('fishtalk');
    const [T, m, j, k] = v, sols = [];
    for(let r = 0; r <= 30; r++) for(let s = 0; s <= 40; s++){ const o = T - r, a = T + m - s;   // Ради and Оги make T, the other two T + m
      if(o >= 0 && a >= 0 && o === r + j && a === s + k) sols.push(r + a); }
    if(sols.length !== 1 || sols[0] !== q.ans) fail('467: Ради and Алекс together', q);
  });
  // 468: every four bags that fit the clues; exactly one, and Ния's is the answer
  each(468, 2000, (q, v) => {
    count('bags');
    const [T, S, N] = v, sols = [];
    for(let a = 1; a < T; a++) for(let d = 1; d < T; d++){
      const b = N - a, c = T - a - b - d;
      if(b < 1 || c < 1 || b !== d - 4 || !(d < c)) continue;
      if([a, b, c, d].some(x => T - x === S)) sols.push([a, b, c, d]);
    }
    if(sols.length !== 1 || sols[0][0] !== q.ans) fail('468: the four bags', q);
  });
  // 42: the cats' days counted one by one (a box is p days for one and q days for the other); the pair 3 and 2 turns up
  each(42, 3000, (q, v) => {
    count('cats');
    const [p, qd, boxes] = v;
    let day = 0;
    while(day*(p + qd) < boxes*p*qd) day++;
    if(p === qd || day*(p + qd) !== boxes*p*qd || day !== q.ans) fail('42: the days', q);
    if(p === 3 && qd === 2) count('cats 3/2');
  });
  // 323 legs: every number of cows tried against the legs
  each(323, 3000, (q, v) => {
    if(q.shape !== 'legs') return; count('legs');
    const [nn, L] = v, sols = [];
    for(let c = 0; c <= nn; c++) if(4*c + 2*(nn - c) === L) sols.push(c);
    if(sols.join() !== String(q.ans) || q.ans < 1 || /[×÷]/.test(strip(Q.why(q, true)) + strip(Q.why(q, false)))) fail('323 legs: the cows', q);
  });
  // 20 toward: where the two end up on the path, from its left end
  each(20, 3000, (q, v) => {
    if(q.shape !== 'toward') return; count(q.past ? 'toward past' : 'toward short');
    const [L, a, b] = v, ladybird = a, snail = L - b;
    if(Math.abs(snail - ladybird) !== q.ans || (ladybird > snail) !== q.past || a >= L || b >= L || q.ans < 1) fail('20 toward: the distance between them', q);
  });
  // 40 ab: the four points on a line from A, AB the part of AD that BC and CD leave
  each(40, 3000, (q, v) => {
    if(q.shape !== 'ab') return; count('seg ab');
    const [AD, BC, CD] = v, sols = [];
    for(let AB = 1; AB < AD; AB++) if(AB + BC + CD === AD) sols.push(AB);
    if(sols.join() !== String(q.ans) || !/AB = \?|Колко сантиметра е AB/.test(text(q)) || q.ans < 3) fail('40 ab: AB', q);
  });
  // 282 rel: the second side from the wording (longer / shorter), the third what is left; a real triangle
  each(282, 3000, (q, v, t) => {
    if(q.shape !== 'rel') return; count('triangle rel');
    const [P, a, k] = v, b = /по-дълга/.test(t) ? a - k : /по-къса/.test(t) ? a + k : NaN, c = P - a - b;
    if(c !== q.ans || b < 1 || c < 1 || 2*Math.max(a, b, c) >= P || P > 100) fail('282 rel: the third side', q);
  });

  // every shape turns up
  for(const key of ['cost', 'tiles', 'berries', 'twonot', 'both', 'ate', 'combo', 'tales', 'halfleft', 'blooms', 'pace', 'fishtalk', 'bags', 'cats', 'cats 3/2', 'legs', 'toward past', 'toward short', 'seg ab', 'triangle rel'])
    if(!n[key]) throw new Error('check/sal-S3.js: ' + key + ' never drawn');
  console.log('Салабашев 2 клас, builder S3 (text tasks, 20, 38, 40, 42, 282, 320, 321, 323, 335, 460–468): 2019 #9 #14, 2020 #13 #14, 2021 #8 #14 #15, 2022 #11 #15, 2023 #3 #11 #12, 2024 #5 #8 #9 #10, 2025 #9 #11 pinned as printed (2021 #14 and #15 against our own solution, no key); every shape worked out again from the numbers of its drawn text: ' + Object.entries(n).map(([k, c]) => c + ' ' + k).join(', '));
}
