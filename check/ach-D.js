// Runs beside the app (in check.js's own scope, through eval), like check/grade1c-A.js.
// Аз и числата (СБНУ), 2 клас, 2023–2026 — word problems: cuts 291, at once 292, one and the others 293, outfits 294
// and the change 295. Each printed task against our own solution (the papers come with no key), drawn as printed
// and asked by its level; then each new generator worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const met = {};   // paper year → [task, exact]
  // fields: what has to match for the level to have asked the printed task; the shape always has to
  const pin = (year, task, id, q, key, shows, fields) => {
    const name = 'Аз и числата ' + year + ' task ' + task, tag = 'ach-' + year + '-2';
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', our solution says ' + key);
    if(!Q.accepts(q, key.map(String))) throw new Error(name + ': the answer is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    const sig = g => fields.map(f => JSON.stringify(g[f])).join('|'), want = sig(q);
    const hit = pinSeed(name, () => Q.raw(id), g => g.kind !== q.kind || g.shape !== q.shape ? 0 : sig(g) === want ? 2 : 1);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks a question of that form');
    (met[year] = met[year] || []).push(task + (hit.exact ? '' : ' (other numbers)'));
  };
  pin(2026, 1, 291, {kind:'cuts', shape:'cut', who:0, th:0, k:4, ans:5}, [5], 'Капитан Защо купил лента за панделка, която срязал на 4 места. Колко парчета са се получили?', ['who', 'th', 'k']);
  // the paper's picture shows two pines and one bush; its text, four pines, counts
  pin(2024, 10, 291, {kind:'cuts', shape:'between', n:4, t:0, ans:3}, [3], 'В парк засадили четири бора. Между тях засаждали по един розов храст. Колко розови храста засадили?', ['n', 't']);
  pin(2026, 10, 292, {kind:'together', shape:'eggs', n:5, t:6, ans:6}, [6], 'Едно яйце се сварява за 6 минути. За колко минути ще се сварят 5 яйца, ако се варят едновременно', ['n', 't']);
  pin(2026, 12, 293, {kind:'balloons', shape:'shoes', a:4, b:1, ans:11}, [11], 'Снежанка имала 4 чифта обувки, а седемте джуджета само по 1 чифт. Колко чифта обувки имат Снежанка и джуджетата общо?', ['a', 'b']);
  pin(2025, 12, 293, {kind:'balloons', shape:'week', a:2, b:1, ans:8}, [8], 'Ани спестявала пари за коледни играчки. В понеделник спестила две евро, а през останалите шест дни от седмицата — по едно евро на ден. Колко пари спестила Ани за една седмица?', ['a', 'b']);
  pin(2023, 7, 293, {kind:'balloons', shape:'rest', m:2, k:9, r:34, T:52, ans:34}, [34], 'За състезанието „Аз и числата“ няколко деца носят общо 52 молива, като 9 носят по два молива, а останалите — по един. Колко деца носят по един молив?', ['m', 'k', 'T']);
  pin(2023, 4, 294, {kind:'outfits', who:0, set:0, a:5, b:2, ans:10}, [10], 'Антон има 5 различни по цвят ризи и 2 различни по цвят панталона. Колко различни тоалета може да облече Антон?', ['who', 'set', 'a', 'b']);
  pin(2023, 10, 295, {kind:'buyleft', shape:'mix', who:0, one:[0, 1], many:0, k:2, p1:35, p2:20, p3:15, spent:90, ans:10}, [10],
    'Марина имала 1 евро. Купила си вафла за 35 цента, две близалки по 20 цента и бонбон за 15 цента. Колко цента ѝ останали?', ['who', 'one', 'many', 'k', 'p1', 'p2', 'p3']);

  // Each generator worked out another way: the pieces counted cut by cut, the clock run for each thing, the people's
  // amounts listed and added, the outfits listed pair by pair, the coins paid out one price at a time.
  const draws = (id, n, fn) => { const seen = {}; for(let i = 0; i < n; i++){ const q = Q.raw(id); seen[String(q.shape)] = 1; fn(q); } return Object.keys(seen).sort().join(','); };
  const noAnswerInHint = (id, q) => { if((strip(Q.why(q, false)).match(/\d+/g) || []).map(Number).includes(q.ans)) fail('level ' + id + ': the hint gives the answer away', q); };
  let s = draws(291, 3000, q => {
    noAnswerInHint(291, q);
    if(q.shape === 'cut'){
      let pieces = 1; for(let c = 0; c < q.k; c++) pieces++;
      if(pieces !== q.ans || q.k < 2 || q.k > 9) fail('291 cut', q);
    } else {
      const n = q.n;   // trees, or pieces: the gaps between them
      let gaps = 0; for(let i = 1; i < n; i++) gaps++;
      if(gaps !== q.ans || n < 3 || n > (q.shape === 'between' ? 9 : 10)) fail('291 ' + q.shape, q);
      if(q.shape === 'pieces'){ let pieces = 1; for(let c = 0; c < q.ans; c++) pieces++; if(pieces !== n) fail('291 pieces: the cuts do not make the pieces', q); }
    }
    if(q.traps.includes(q.ans)) fail('291: a trap is the answer', q);
  });
  if(s !== 'between,cut,pieces') throw new Error('level 291 draws ' + s);
  s = draws(292, 3000, q => {
    noAnswerInHint(292, q);
    // each thing starts when it can: at once all at 0, one after another when the last is done
    let clock = 0, done = 0;
    for(let i = 0; i < q.n; i++){ const start = q.shape === 'one' ? clock : 0; clock = start + q.t; done = Math.max(done, clock); }
    if(done !== q.ans) fail('292 ' + q.shape, q);
    if(q.shape === 'one' && q.ans > 20) fail('292: one after another is to be added up within 20', q);
  });
  if(s !== 'eggs,one,shirts') throw new Error('level 292 draws ' + s);
  s = draws(293, 3000, q => {
    noAnswerInHint(293, q);
    if(q.shape === 'shoes'){ const each = [q.a].concat(Array(7).fill(q.b)); if(each.reduce((x, y) => x + y) !== q.ans || q.a <= q.b) fail('293 shoes', q); }
    else if(q.shape === 'week'){ const days = [q.a].concat(Array(6).fill(q.b)); if(days.length !== 7 || days.reduce((x, y) => x + y) !== q.ans) fail('293 week', q); }
    else {
      let left = q.T; for(let c = 0; c < q.k; c++) left -= q.m;   // the children with more pay out first
      if(left !== q.ans || q.T > 99 || q.ans < 5) fail('293 rest', q);
    }
  });
  if(s !== 'rest,shoes,week') throw new Error('level 293 draws ' + s);
  draws(294, 3000, q => {
    noAnswerInHint(294, q);
    const outfits = []; for(let i = 0; i < q.a; i++) for(let j = 0; j < q.b; j++) outfits.push(i + '/' + j);
    if(new Set(outfits).size !== q.ans || q.ans > 18) fail('294', q);
  });
  draws(295, 3000, q => {
    noAnswerInHint(295, q);
    const paid = [q.p1].concat(Array(q.k).fill(q.p2), q.p3);
    if(paid.some(p => p % 5 || p < 5) || 100 - paid.reduce((x, y) => x + y) !== q.ans || q.ans < 5 || q.ans > 40) fail('295', q);
  });

  const line = (year, not) => console.log('Аз и числата ' + year + ' 2 клас: tasks ' + met[year].join(', ') + ' pinned (our solution, no official key)' + (not ? '; not in the app: ' + not : '') + ' — check/ach-D.js');
  line(2026); line(2025); line(2024); line(2023);
  console.log('Аз и числата word problems (291–295): each generator worked out again by cutting, timing, listing and paying out — 15,000 questions');
}
