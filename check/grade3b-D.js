// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
// МБГ Есен 2024 and Есен 2023, 3 клас — the word problems: plusall 261, balloons 262, floors 263, legs 264 (legs and
// humps), andmore 265 (the fishermen) and agesum 266. Each printed task against the official key, drawn as printed and
// asked exactly by its level, then every question of the new levels worked out again the long way round.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const tag = name => 'mbg-autumn-' + name.match(/20\d\d/)[0] + '-3';
  // the printed task: the key, the drawing (its pieces, in order), the paper's tag, and the level asking exactly it
  const pin = (name, id, q, key, shows) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    const text = strip(Q.drawQ(q));
    [].concat(shows).reduce((at, s) => { const k = text.indexOf(s.replace(/\s+/g, ''), at); if(k < 0) throw new Error(name + ' is not drawn as printed: ' + text); return k + 1; }, 0);
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag(name))) throw new Error('level ' + id + ' is not tagged ' + name);
    const want = JSON.stringify(q);
    if(pinSeed(name, () => Q.raw(id), g => JSON.stringify(g) === want ? 2 : 0)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Есен 2024 task 10', 261, {kind:'plusall', n:4, k:3, more:true, S:20, S2:32, traps:[12], ans:4}, [4],
    'Сборът на няколко числа е 20. Ако всяко от числата се увеличи с 3, сборът ще стане 32. Колко на брой са числата?');
  pin('Есен 2024 task 15', 262, {kind:'balloons', k:10, m:3, e:2, r:10, rest:20, T:50, traps:[10, 30], ans:20}, [20],
    'Няколко деца имат общо 50 балона, като 10 деца имат по 3 балона, а всяко от останалите — по два. Колко са децата?');
  pin('Есен 2024 task 16', 263, {kind:'floors', k:3, x:2, N:9, below:false, traps:[2, 6], ans:3}, [3],
    'Аз живея в блок на 9 етажа. Над нашия етаж има 3 пъти повече етажи, отколкото под нашия етаж. На кой етаж живея аз?');
  pin('Есен 2024 task 17', 264, {kind:'legs', shape:'legs', a:9, b:6, spiders:false, traps:[108, 15], ans:102}, [102],
    ['Колко крака общо имат 9 бръмбара и 6 паяка?', 'Всеки паяк има 8 крака', 'Всеки бръмбар има 6 крака']);
  pin('Есен 2023 task 20', 264, {kind:'legs', shape:'humps', a:6, t:2, two:false, traps:[18, 24], ans:30}, [30],
    'В едно стадо има 6 едногърби камили и два пъти повече двугърби камили. Колко общо са гърбиците на камилите от това стадо?');
  pin('Есен 2023 task 9', 265, {kind:'andmore', shape:'fish', n:4, m:8, traps:[32, 24], ans:48}, [48],
    'Четирима рибари с четири лодки ловили риба. Трима от тях уловили по 8 кг, а четвъртият — колкото тримата заедно. Колко килограма риба общо са уловили рибарите?');
  pin('Есен 2023 task 17', 266, {kind:'agesum', g1:2, g2:1, a:10, b:11, ago:false, S:31, T:43, traps:[12], ans:4}, [4],
    'Иван и Стефан са на 10 години, а Петър е на 11. След колко години сборът на годините им ще е 43?');
  // the pictures of task 17: the spider drawn with 8 legs, the beetle with 6, as their captions say
  {
    const svg = Q.drawQ({kind:'legs', shape:'legs', a:9, b:6, spiders:false, traps:[108, 15], ans:102});
    const legs = col => (svg.match(new RegExp('<path d="M[\\d.]+,[\\d.]+ L[\\d.]+,[\\d.]+ L[\\d.]+,[\\d.]+" fill="none" stroke="var\\(--' + col + '\\)"', 'g')) || []).length;
    if(legs('ink') !== 8 || legs('ant') !== 6) throw new Error('Есен 2024 task 17: the spider has ' + legs('ink') + ' legs drawn and the beetle ' + legs('ant'));
  }

  // every question of the new levels, worked out again another way
  const seen = {};
  const count = (id, s) => { seen[id + ':' + s] = (seen[id + ':' + s] || 0) + 1; };
  for(let i = 0; i < 3000; i++){
    // 261: every count of numbers from 1 to 60 tried; the one that takes S to S2 is the answer, and a list of that many
    // natural numbers adding to S exists that each step leaves natural (made smaller, each at least k)
    const p = Q.raw(261); count(261, p.more ? 'more' : 'less');
    const fits = []; for(let c = 1; c <= 60; c++) if((p.more ? p.S + c*p.k : p.S - c*p.k) === p.S2) fits.push(c);
    const nums = Array(p.n).fill(p.more ? 0 : p.k); nums[0] += p.S - nums.reduce((a, b) => a + b, 0);
    if(fits.join() !== String(p.ans) || nums[0] < 0 || nums.map(v => p.more ? v + p.k : v - p.k).reduce((a, b) => a + b, 0) !== p.S2 || p.S2 < 1 || p.S2 > 100) fail('plusall: ' + fits, p);
    // 262: every number of children tried, the first k with m each and every other one with e
    const b = Q.raw(262); count(262, b.e);
    const kids = []; for(let C = b.k + 1; C <= 200; C++) if(b.k*b.m + (C - b.k)*b.e === b.T) kids.push(C);
    if(kids.join() !== String(b.ans) || b.m <= b.e || b.e < 2 || b.T > 100) fail('balloons by two: ' + kids, b);
    // 263: every floor of the block tried, the floors under it and over it counted one by one
    const f = Q.raw(263); count(263, f.below ? 'below' : 'above');
    const mine = [];
    for(let at = 1; at <= f.N; at++){ let under = 0, over = 0; for(let g = 1; g <= f.N; g++){ if(g < at) under++; if(g > at) over++; } if(f.below ? under === f.k*over : over === f.k*under) mine.push(at); }
    if(mine.join() !== String(f.ans) || f.N > 21 || f.k < 2 || f.ans === 1 || f.ans === f.N) fail('floors: ' + mine, f);
    // 264: the animals lined up one by one and their legs or humps added
    const l = Q.raw(264); count(264, l.shape);
    const herd = l.shape === 'legs' ? Array(l.a).fill(6).concat(Array(l.b).fill(8))
      : Array(l.two ? l.a : l.t*l.a).fill(2).concat(Array(l.two ? l.t*l.a : l.a).fill(1));
    if(herd.reduce((s, v) => s + v, 0) !== l.ans) fail('legs: ' + herd.length + ' animals', l);
    if(l.shape === 'legs' && (!strip(Q.drawQ(l)).includes(l.a + 'бръмбара') || !strip(Q.drawQ(l)).includes(l.b + 'паяка'))) fail('legs: the counts are not drawn', l);
    // 265: each fisherman's catch, the last one's the sum of all the others
    const h = Q.raw(265); count(265, h.n);
    const catches = Array(h.n - 1).fill(h.m); catches.push(catches.reduce((s, v) => s + v, 0));
    if(catches.reduce((s, v) => s + v, 0) !== h.ans || h.ans > 100) fail('fishers: ' + catches, h);
    // 266: the years walked one at a time, every child a year older (or younger) each step, until the ages add up
    const g = Q.raw(266); count(266, g.ago ? 'ago' : 'after');
    const ages = Array(g.g1).fill(g.a).concat(Array(g.g2).fill(g.b)), when = [];
    for(let y = 1; y <= 30; y++){ const now = ages.map(v => g.ago ? v - y : v + y); if(now.every(v => v >= 1) && now.reduce((s, v) => s + v, 0) === g.T) when.push(y); }
    if(when.join() !== String(g.ans) || ages.reduce((s, v) => s + v, 0) !== g.S || g.a === g.b) fail('agesum: ' + when, g);
  }
  ['261:more', '261:less', '262:2', '262:3', '262:4', '263:above', '263:below', '264:legs', '264:humps', '265:3', '265:4', '265:5', '266:after', '266:ago']
    .forEach(k => { if(!seen[k]) throw new Error('never drawn in 3000: ' + k + ' ' + JSON.stringify(seen)); });
  console.log('МБГ Есен 2024 and 2023, 3 клас: 2024 tasks 10, 15, 16, 17 and 2023 tasks 9, 17, 20 match the key and are asked exactly by their levels; ' +
    'every count, child, floor, leg, hump, catch and year of 261–266 worked out again one at a time');
}
