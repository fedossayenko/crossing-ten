// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
/* МБГ Пролет 2022 and 2021, 1 клас — the kinds prices, hops, whocolor, digrule, blind and bowl: each printed
   task against the official key, drawn as printed and met by its level's own generator, then each kind's
   answers found again another way. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, answers, accepts, LEVELS }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const tag = name => name.includes('2022') ? 'mbg-spring-2022-1' : 'mbg-spring-2021-1';
  // the printed task: the key, the drawing, the paper's tag, and the level reaching it — the whole question,
  // or only the listed fields where names and shuffled options make the exact one too rare to wait for
  const pin = (name, id, q, key, shows, fields) => {
    if(!q.own){
      const got = Q.answers(q).slice().sort((x, y) => x - y);
      if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
      if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the key is not accepted');
    }
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag(name))) throw new Error('level ' + id + ' is not tagged ' + name);
    const sig = g => fields ? JSON.stringify(fields.map(f => g[f])) : JSON.stringify(g), want = sig(q);
    if(pinSeed(name, () => Q.raw(id), g => sig(g) === want ? 2 : 0)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  pin('Пролет 2021 task 14', 185, {kind:'prices', it:[0, 1, 2], x:20, y:30, z:40, A:50, B:60, traps:[10], ans:30}, [30], 'Колко стотинки струва гумата');
  pin('Пролет 2021 task 17', 186, {kind:'hops', a:3, b:4, N:14, ans:6}, [6], 'или 3 метра, или 4 метра. По колко начина той може да достигне по права до цветче, което се намира на 14 метра');
  // Алекс, Борис, Катрин; син, зелен, жълт; Алекс not yellow nor blue, Борис not yellow — Катрин's is yellow
  const wc = {kind:'whocolor', kids:[0, 1, 2], cols:[0, 1, 2], has:[1, 0, 2], not1:[2, 0], not2:2, ask:2, options:[0, 1, 2, 3].map(id => ({id, v:id, text:[['син', 'синя'], ['зелен', 'зелена'], ['жълт', 'жовта'], ['Не може да се каже', 'Не можна визначити']][id]})), pick:2, own:true, ans:2};
  if(wc.options[wc.pick].text[0] !== 'жълт') throw new Error('Пролет 2021 task 18: the key says жълт');
  pin('Пролет 2021 task 18', 187, wc, null, 'Алекс, Борис и Катрин имат по един балон с различен цвят – син, зелен и жълт. Балонът на Алекс не е нито жълт, нито син. Балонът на Борис не е жълт. Какъв цвят е балонът на Катрин?', ['kids', 'cols', 'has', 'not1', 'not2', 'ask']);
  pin('Пролет 2021 task 19', 188, {kind:'digrule', rule:'diff', ex:[10, 12, 59], n:79, ans:2}, [2], '10 ⟹ 1 − 0 = 1 ⟹ ☺ = 1 12 ⟹ 2 − 1 = 1 ⟹ ☺ = 1 59 ⟹ 9 − 5 = 4 ⟹ ☺ = 4', ['rule', 'n']);
  pin('Пролет 2021 task 20', 189, {kind:'blind', cols:[0, 1, 2], n:[2, 3, 4], T:9, diff:true, traps:[4, 4], ans:5}, [5], 'Имам 9 еднакви по големина кубчета – 2 сини, 3 зелени и 4 жълти. Колко най-малко кубчета трябва да взема със затворени очи, за да имам със сигурност две кубчета с различен цвят');
  pin('Пролет 2022 task 17', 190, {kind:'bowl', A:6, k:2, Y:11, traps:[17, 13], ans:15}, [15], 'Ябълките са 6, от които 2 са жълти. Жълтите плодове са общо 11. Колко общо са плодовете');
  pin('Пролет 2021 task 11', 190, {kind:'bowl', A:8, k:5, Y:11, traps:[19, 9], ans:14}, [14], 'Ябълките са 8, от които 5 са жълти. Жълтите плодове са общо 11');

  const perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  for(let i = 0; i < 2000; i++){
    // prices: every price of the shared thing tried against the three given prices
    const p = Q.raw(185), xs = []; for(let x = 0; x <= 100; x += 10) if(x + p.z === p.B && p.A - x > 0) xs.push(p.A - x);
    if(xs.length !== 1 || xs[0] !== p.ans || new Set(p.it).size !== 3) fail('prices', p);
    // hops: the ways counted forwards, metre by metre
    const h = Q.raw(186), w = [1]; for(let m = 1; m <= h.N; m++) w[m] = (w[m - h.a] || 0) + (w[m - h.b] || 0);
    if(w[h.N] !== h.ans || h.ans < 2) fail('hops: ' + w[h.N] + ' ways', h);
    // whocolor: every way to hand out the colours tried against the two clues
    const c = Q.raw(187), fit = perms.filter(pm => !c.not1.includes(pm[0]) && pm[1] !== c.not2);
    if(fit.length !== 1 || c.options[c.pick].text[0] !== ['син', 'зелен', 'жълт', 'червен'][c.cols[fit[0][c.ask]]] || new Set(c.options.map(o => o.text[0])).size !== 4) fail('whocolor', c);
    // digrule: of the rules «bigger − smaller», «ones − tens» and «sum», only the level's own fits all three examples
    const d = Q.raw(188), rules = { diff: v => Math.abs(Math.floor(v / 10) - v % 10), ones: v => v % 10 - Math.floor(v / 10), sum: v => Math.floor(v / 10) + v % 10 };
    const rows = Q.drawQ(d).replace(/<[^>]*>/g, '|').split('|').filter(t => t.includes('⟹') && /☺ = \d/.test(t)), shown = d.ex.map(v => +rows.find(t => t.startsWith(v + ' ')).split('☺ = ')[1]);
    const ok = Object.keys(rules).filter(r => d.ex.every((v, k) => rules[r](v) === shown[k]));
    if(ok.length !== 1 || ok[0] !== d.rule || rules[d.rule](d.n) !== d.ans) fail('digrule: rules ' + ok, d);
    // blind: the fewest cubes found by trying every hand that could still miss
    const b = Q.raw(189), k = b.n.length, miss = m => b.diff ? b.n.some(c => c >= m) : m <= k;
    let m = 1; while(miss(m)) m++;
    if(m !== b.ans || b.n.reduce((t, v) => t + v, 0) !== b.T) fail('blind', b);
    // bowl: every count of lemons tried against the yellow fruit
    const f = Q.raw(190), L = []; for(let l = 1; l <= 30; l++) if(f.k + l === f.Y) L.push(l);
    if(L.length !== 1 || f.A + L[0] !== f.ans || f.k >= f.A || f.ans > 20) fail('bowl', f);
  }
  console.log('МБГ Пролет 2022 and 2021, 1 клас: the printed tasks 2021 11, 14, 17, 18, 19, 20 and 2022 17 match the key and their levels ask them; prices, hops, whocolor, digrule, blind and bowl worked out again by brute force');
}
