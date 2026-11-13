// Runs beside the app (in check.js's own scope, through eval), like check/ach-C.js.
// Европейско Кенгуру, 2 клас, builder D — number cards and equal sums, undoing steps, cuts and jumps, the week: levels 340–349.
// Each printed task is built as printed, answered with the paper's official key and replayed by its level from a seed; then
// every generator is worked out again another way (brute force, or the story played forward).
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const met = [];
  // year, task, level, the question as printed, the official key, a phrase of its wording, the fields that make it that question
  const pin = (year, task, id, q, key, shows, fields) => {
    const name = 'Кенгуру ' + year + ' task ' + task, tag = 'ek-' + year + '-2';
    if(String(Q.answers(q)) !== String(key)) throw new Error(name + ': gives ' + Q.answers(q) + ', the paper says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the paper\'s answer is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const sig = g => fields.map(f => JSON.stringify(g[f])).join('|'), want = sig(q);
    if(!pinSeed(name, () => Q.raw(id), g => g.kind !== q.kind ? 0 : sig(g) === want ? 2 : 0)) throw new Error(name + ': level ' + id + ' never asks it');
    met.push(year + ' #' + task + ' (' + id + ')');
  };
  // 2021 #19: 2 3 4 5 6 into two boxes with the same sum; with the 4 there is only the 6
  pin(2021, 19, 340, {kind:'eqrows', shape:'boxes', cards:[2, 3, 4, 5, 6], half:10, x:4, pair:[4, 6], rest:[2, 3, 5], ans:6}, 6, 'Картите с числата 2, 3, 4, 5 и 6 са разпределени в 2 кутии', ['cards', 'x']);
  // 2026 #23: the tokens, 11 goes down (the swap 11 ↔ 6); the numbers are the printed ones, drawn out of 1–20 at random they would almost never come up, so the pin is
  // the question's own answer and wording and not a seed replay of these exact ten numbers: the generator is held to the key by the brute force below
  {
    const q = {kind:'eqrows', shape:'swap', top:[5, 7, 11, 15, 17], bot:[1, 6, 8, 14, 16], gap:10, half:5, pair:[11, 6], ans:11};
    if(String(Q.answers(q)) !== '11' || !Q.accepts(q, ['11']) || Q.accepts(q, ['6'])) throw new Error('Кенгуру 2026 task 23: the key 11 is not the answer');
    if(strip(Q.drawQ(q)).indexOf('Койжетонотгорнияредтрябвадапремести') < 0) throw new Error('Кенгуру 2026 task 23 is not drawn as printed');
    if(!Q.LEVELS.find(l => l.id === 341).papers.includes('ek-2026-2')) throw new Error('level 341 is not tagged ek-2026-2');
    if(!pinSeed('Кенгуру 2026 task 23', () => Q.raw(341), g => g.kind === 'eqrows' && g.shape === 'swap' ? 1 : 0)) throw new Error('level 341 never asks it');
    met.push('2026 #23 (341, the same question with other tokens)');
  }
  // 2025 #17: 2, 3, 4, 5 into □□ + □□, the largest sum 95
  pin(2025, 17, 342, {kind:'cardsum', digits:[2, 3, 4, 5], big:true, wit:[53, 42], traps:[59], ans:95}, 95, 'Разпределете числата 2, 3, 4 и 5 в четирите квадратчета и намерете възможно най-големия сбор', ['digits', 'big']);
  // 2023 #24: 1, 1, 2, 3, three cards, □□ − □, ten different results
  pin(2023, 24, 343, {kind:'cardcount', cards:[1, 1, 2, 3], traps:[24, 12], ans:10}, 10, 'Цифрите 1, 1, 2 и 3 са отпечатани върху 4 различни карти', ['cards']);
  // 2021 #26: Жоро, Пепи, Тошо, 8 8 8 after the third game; Жоро had 13
  pin(2021, 26, 344, {kind:'blackpeter', set:0, order:[0, 1, 2], e:8, who:0, stages:[[13, 7, 4], [2, 14, 8], [4, 4, 16], [8, 8, 8]], traps:[8, 12], ans:13}, 13, 'Колко жетона е имал Жоро първоначално?', ['set', 'order', 'e', 'who']);
  // 2026 #11 and #12
  pin(2026, 11, 345, {kind:'cake', a:3, b:4, traps:[9, 7, 16], ans:20}, 20, 'Първоначално тортата е разрязана с нож с помощта на 3 успоредни разреза', ['a', 'b']);
  pin(2026, 12, 346, {kind:'boards', t:2, a:1, b:10, n:9, traps:[20, 20], ans:18}, 18, 'За 2 секунди папагалът Пиер скача от дъска на съседна дъска', ['t', 'a', 'b']);
  // 2021 #23 and #7
  pin(2021, 23, 347, {kind:'fruitweek', a:1, m:3, w:2, week:9, traps:[9], ans:18}, 18, 'Колко плода изяжда Кенга за 2 седмици?', ['a', 'm', 'w']);
  pin(2021, 7, 348, {kind:'earlywatch', shape:'slow', n:20, s:10, l:5, early:10, traps:[35, 25], ans:15}, 15, 'часовникът му е изостанал с 10 минути', ['shape', 'n', 's', 'l']);
  // 2025 #8: 28 left after 5 and 6 were eaten
  pin(2025, 8, 349, {kind:'eaten', e:0, k:2, ate:[5, 6], left:28, traps:[17, 33], ans:39}, 39, 'Колко банички е изпекла Мария, ако са останали 28', ['e', 'ate', 'left']);

  // every generator worked out again another way
  const sum = a => a.reduce((s, v) => s + v, 0), n = {};
  const count = k => n[k] = (n[k] || 0) + 1;
  for(let i = 0; i < 1500; i++){   // 340: every way of putting each card in box 0 or 1
    const q = Q.raw(340); count('boxes');
    const ways = []; for(let m = 0; m < 32; m++){ const a = q.cards.filter((_, j) => m & (1 << j)), b = q.cards.filter((_, j) => !(m & (1 << j))); if(a.length && b.length && sum(a) === sum(b) && (m & 1)) ways.push(a); }
    const mine = ways[0], other = q.cards.filter(v => !mine.includes(v));
    if(ways.length !== 1) fail('340: the split is not the only one', q);
    const box = mine.includes(q.x) ? mine : other;
    if(box.length !== 2 || box.find(v => v !== q.x) !== q.ans || q.ans === q.x || !q.cards.includes(q.x)) fail('340: the box with ' + q.x, q);
  }
  for(let i = 0; i < 1500; i++){   // 341: every swap tried
    const q = Q.raw(341); count('swap');
    const hits = [];
    for(const t of q.top) for(const b of q.bot) if(sum(q.top) - t + b === sum(q.bot) - b + t) hits.push(t);
    if(hits.length !== 1 || hits[0] !== q.ans || new Set(q.top.concat(q.bot)).size !== 10 || Math.max(...q.top, ...q.bot) > 20) fail('341: the swap', q);
  }
  for(let i = 0; i < 1500; i++){   // 342: all 24 orders of the four cards
    const q = Q.raw(342); count('cardsum');
    let best = null;
    const walk = (left, cur) => { if(!left.length){ const v = (cur[0]*10 + cur[1]) + (cur[2]*10 + cur[3]); if(best === null || (q.big ? v > best : v < best)) best = v; return; } left.forEach((d, j) => walk(left.filter((_, k) => k !== j), cur.concat(d))); };
    walk(q.digits, []);
    if(best !== q.ans || q.wit[0] + q.wit[1] !== q.ans || q.ans > 99) fail('342: the sum', q);
  }
  for(let i = 0; i < 1500; i++){   // 343: every ordered choice of three of the four cards
    const q = Q.raw(343); count('cardcount');
    const res = new Set();
    for(let a = 0; a < 4; a++) for(let b = 0; b < 4; b++) for(let c = 0; c < 4; c++) if(a !== b && b !== c && a !== c) res.add(10 * q.cards[a] + q.cards[b] - q.cards[c]);
    if(res.size !== q.ans || res.size >= 12 || [...res].some(v => v < 1)) fail('343: the count', q);
  }
  for(let i = 0; i < 1500; i++){   // 344: play the games forward from the start the level found
    const q = Q.raw(344); count('blackpeter');
    let c = q.stages[0].slice();
    for(const L of q.order){ const give = c.reduce((s, v, j) => j === L ? s : s + v, 0); c = c.map((v, j) => j === L ? v - give : v * 2); if(c.some(v => v < 0)) fail('344: a player goes below nothing', q); }
    if(c.some(v => v !== q.e) || q.stages[0][q.who] !== q.ans || sum(q.stages[0]) !== 3 * q.e || new Set(q.order).size !== 3) fail('344: forward play', q);
  }
  for(let i = 0; i < 1500; i++){   // 345: the cells the cuts leave, counted
    const q = Q.raw(345); count('cake');
    let cells = 0; for(let x = 0; x <= q.a; x++) for(let y = 0; y <= q.b; y++) cells++;
    if(cells !== q.ans || q.traps.includes(q.ans)) fail('345: the pieces', q);
  }
  for(let i = 0; i < 1500; i++){   // 346: jump board by board
    const q = Q.raw(346); count('boards');
    let board = q.a, sec = 0; while(board < q.b){ board++; sec += q.t; }
    if(sec !== q.ans || q.ans > 30 || q.traps.includes(q.ans)) fail('346: the seconds', q);
  }
  for(let i = 0; i < 1500; i++){   // 347: day by day
    const q = Q.raw(347); count('fruitweek');
    let fruit = 0; for(let d = 0; d < 7 * q.w; d++){ const day = d % 7; fruit += [0, 2, 4].includes(day) ? q.a : [1, 3].includes(day) ? q.m : 0; }
    if(fruit !== q.ans) fail('347: the fruit', q);
  }
  for(let i = 0; i < 1500; i++){   // 348: on a clock: the show is announced for 600, the watch shows 600 − n when he arrives
    const q = Q.raw(348); count('earlywatch ' + q.shape);
    const shown = 600 - q.n, real = q.shape === 'slow' ? shown + q.s : shown - q.s;
    if(600 + q.l - real !== q.ans || q.ans <= 0 || q.early !== 600 - real) fail('348: the waiting', q);
  }
  for(let i = 0; i < 1500; i++){   // 349: the buns back
    const q = Q.raw(349); count('eaten');
    if(q.left + sum(q.ate) !== q.ans || q.ans > 99) fail('349: the total', q);
  }
  for(const id of [340, 341, 342, 343, 344, 345, 346, 347, 348, 349]) if(!Q.LEVELS.find(l => l.id === id).papers.length) fail('level ' + id + ' has no paper', {});
  console.log('Кенгуру 2 клас, builder D: ' + met.join(', ') + ' pinned against the official keys');
  console.log('Кенгуру, equal sums, undoing, cuts and the week: ' + Object.entries(n).map(([k, v]) => v + ' ' + k).join(', ') + ' worked out again another way');
}
