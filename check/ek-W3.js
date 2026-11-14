// Runs beside the app (in check.js's own scope, through eval), like check/ek-A.js.
// Европейско Кенгуру, 2 клас — pictures of sets and sequences, wave 2 builder B3: 410 the number in all three shapes (2024 #1), 411 the missing
// number in the triangle (2024 #14), 412 cups and saucers (2019 #7), 413 the hole through four cards (2021 #4), 414 the monsters' families
// (2026 #8), 415 three recolourings (2019 #22), 416 the bracelet (2026 #20), 417 stickers on one another (2022 #16), 418 the order of the cards
// (2019 #11). Every picture is read back from the SVG it draws (shapes, dots, beads, squares, the order they are painted in) and the question is
// worked out again from that: the answer is the one option / number the drawing gives, no two options alike, and a vote on features does
// not give it. A printed instance is pinned where the generator can draw it (410, 411, 413, 415, 416, 417, 418 are checked on the
// paper's own numbers or stack; 412 on its cups; 414 is drawn afresh from emoji and is proved on 3000 seeds).
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const svgs = h => String(h).match(/<svg[\s\S]*?<\/svg>/g) || [];
  const num = (tag, a) => { const m = tag.match(new RegExp('\\s' + a + '="([-\\d.]+)"')); return m ? +m[1] : NaN; };
  const sattr = (tag, a) => { const m = tag.match(new RegExp('\\s' + a + '="([^"]*)"')); return m ? m[1] : ''; };
  const parse = svg => ({
    circles: [...svg.matchAll(/<circle\b[^>]*>/g)].map(m => ({ x: num(m[0], 'cx'), y: num(m[0], 'cy'), r: num(m[0], 'r'), fill: sattr(m[0], 'fill'), tag: m[0] })),
    rects: [...svg.matchAll(/<rect\b[^>]*>/g)].map(m => ({ x: num(m[0], 'x'), y: num(m[0], 'y'), w: num(m[0], 'width'), h: num(m[0], 'height'), fill: sattr(m[0], 'fill'), tag: m[0] })),
    polys: [...svg.matchAll(/<polygon\b[^>]*>/g)].map(m => ({ pts: sattr(m[0], 'points').trim().split(/\s+/).map(p => p.split(',').map(Number)), fill: sattr(m[0], 'fill'), tag: m[0] })),
    texts: [...svg.matchAll(/(<text\b[^>]*>)([\s\S]*?)<\/text>/g)].map(m => ({ x: num(m[1], 'x'), y: num(m[1], 'y'), t: m[2], size: num(m[1], 'font-size') })),
  });
  const inPoly = (p, pts) => { let c = false; for(let i = 0, j = pts.length - 1; i < pts.length; j = i++){ const [xi, yi] = pts[i], [xj, yj] = pts[j]; if((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  const dSeg = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
  const dPoly = (p, pts) => Math.min(...pts.map((a, i) => dSeg(p, a, pts[(i + 1) % pts.length])));
  const dRect = (p, r) => { const dx = Math.max(r.x - p[0], p[0] - r.x - r.w, 0), dy = Math.max(r.y - p[1], p[1] - r.y - r.h, 0); return dx || dy ? Math.hypot(dx, dy) : Math.min(p[0] - r.x, r.x + r.w - p[0], p[1] - r.y, r.y + r.h - p[1]); };
  const inRect = (p, r) => p[0] > r.x && p[0] < r.x + r.w && p[1] > r.y && p[1] < r.y + r.h;
  const given = q => Q.drawQ(q).split('class="given"')[1] || Q.drawQ(q);
  const tagged = (id, tags) => tags.forEach(t => { if(!Q.LEVELS.find(l => l.id === id).papers.includes(t)) throw new Error('level ' + id + ' is not tagged ' + t); });
  const shows = (name, q, parts) => { const t = strip(Q.drawQ(q)); parts.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); }); };
  const labelOf = o => (o.text[0].match(/aria-label="([^"]*)"/) || [0, ''])[1];

  // ---- 410: the numbers are read from the circle, the square and the triangle the picture draws
  const read410 = q => {
    const P = parse(svgs(Q.drawQ(q))[0]), c = P.circles[0], s = P.rects[0], t = P.polys[0].pts, out = [];
    P.texts.forEach(x => {
      const p = [x.x, x.y - 6], dc = Math.abs(Math.hypot(p[0] - c.x, p[1] - c.y) - c.r);
      if(Math.min(dc, dRect(p, s), dPoly(p, t)) < 8) fail('410: a number lies too close to a line', q);
      out.push({ n: +x.t, sig: (Math.hypot(p[0] - c.x, p[1] - c.y) < c.r ? 'C' : '') + (inRect(p, s) ? 'S' : '') + (inPoly(p, t) ? 'T' : '') });
    });
    return out;
  };
  const asked410 = q => { const t = Q.drawQ(q).replace(/<[^>]*>/g, ''); return /едновременно/.test(t) ? 'CST' : /и в кръга, и в квадрата/.test(t) ? 'CS' : /и в кръга, и в триъгълника/.test(t) ? 'CT' : ''; };
  const check410 = q => {
    const pic = read410(q), want = asked410(q), hit = pic.filter(x => x.sig === want);
    if(!want || hit.length !== 1 || hit[0].n !== q.ans || Q.answers(q).join() !== String(q.ans)) fail('410: the number in the asked piece is not the answer', q);
    if(new Set(pic.map(x => x.n)).size !== 10 || pic.some(x => !x.sig) || pic.length !== 10) fail('410: the numbers are not 1–10 each once in a piece', q);
  };
  for(let i = 1; i <= 3000; i++) check410(Q.seeded(i, () => Q.raw(410)));
  {
    // 2024 #1: 1 and 3 in the circle only, 8 and 6 in the square only, 9 in the triangle only, 2 and 7 in square and triangle, 10 in circle and square,
    // 4 in circle and triangle, 5 in all three (key C = 5). The ten anchors of the generator hold exactly that distribution of the pieces.
    const q = Q.vennThree([1, 3, 8, 6, 9, 2, 7, 10, 5, 4], 'all');
    shows('Кенгуру 2024 task 1', q, ['Кое число се намира едновременно в триъгълника, в квадрата и в кръга?']);
    const pic = read410(q), by = sig => pic.filter(x => x.sig === sig).map(x => x.n).sort((a, b) => a - b).join();
    if(by('C') !== '1,3' || by('S') !== '6,8' || by('T') !== '9' || by('ST') !== '2,7' || by('CS') !== '10' || by('CT') !== '4' || by('CST') !== '5') throw new Error('2024 task 1: the pieces do not hold the printed numbers');
    if(Q.answers(q).join() !== '5') throw new Error('2024 task 1: gives ' + Q.answers(q) + ', the key says 5');
    tagged(410, ['ek-2024-2']);
  }

  // ---- 411: the sums are worked out from the numbers that lie in the triangle and in the circle in the drawing
  const read411 = q => {
    const P = parse(svgs(Q.drawQ(q))[0]), c = P.circles[0], t = P.polys[0].pts, r = { ov: [], co: [], to: [], mark: null };
    P.texts.forEach(x => {
      const p = [x.x, x.y - 6], inC = Math.hypot(p[0] - c.x, p[1] - c.y) < c.r, inT = inPoly(p, t);
      if(Math.min(Math.abs(Math.hypot(p[0] - c.x, p[1] - c.y) - c.r), dPoly(p, t)) < 8) fail('411: a number lies too close to a line', q);
      if(x.t === '?'){ if(!inT || inC) fail('411: the ? is not in the triangle only', q); r.mark = p; }
      else (inC && inT ? r.ov : inC ? r.co : inT ? r.to : fail('411: a number outside both shapes', q)).push(+x.t);
    });
    return r;
  };
  const check411 = q => {
    const r = read411(q), sum = a => a.reduce((s, x) => s + x, 0), all = r.ov.concat(r.co, r.to);
    if(!r.mark || new Set(all).size !== all.length || r.ov.length < 1 || r.co.length < 1) fail('411: the picture is wrong', q);
    // the triangle (the question mark and its numbers) adds up to twice the circle
    if(q.ans + sum(r.ov) + sum(r.to) !== 2 * (sum(r.ov) + sum(r.co)) || Q.answers(q).join() !== String(q.ans) || q.ans < 1) fail('411: the ? does not make the triangle twice the circle', q);
    if(Q.drawQ(q).replace(/<[^>]*>/g, '').indexOf('два пъти по-голям') < 0) fail('411: the task does not say twice', q);
  };
  for(let i = 1; i <= 3000; i++) check411(Q.seeded(i, () => Q.raw(411)));
  {
    // 2024 #14: the triangle holds ? and 5, the circle 5 and 3: 5 + 3 = 8, twice 8 is 16, 16 − 5 = 11 (key D)
    const hit = pinSeed('Кенгуру 2024 task 14', () => Q.raw(411), g => g.ov.join() === '5' && g.co.join() === '3' && g.to.length === 0 ? 2 : 0, 3e6);
    if(!hit) throw new Error('2024 task 14: level 411 never asks it');
    shows('Кенгуру 2024 task 14', hit.q, ['Сборът на числата в триъгълника е два пъти по-голям от сбора на числата в кръга.', 'Кое число трябва да се постави на мястото на въпросителния знак?']);
    if(Q.answers(hit.q).join() !== '11') throw new Error('2024 task 14: gives ' + Q.answers(hit.q) + ', the key says 11');
    tagged(411, ['ek-2024-2']);
  }

  // ---- 412: every cup and every saucer is read back as [kind, number]; the sets are matched one cup to one saucer
  const read412 = q => {
    const svg = svgs(Q.drawQ(q))[0], out = [];
    let kind = '';
    for(const m of svg.matchAll(/<ellipse[^>]*rx="19"[^>]*>|<path d="M[^"]*Z"|<text[^>]*>(\d+)<\/text>/g)){
      if(m[1] === undefined) kind = m[0].startsWith('<ellipse') ? 'saucer' : 'cup';
      else out.push({ kind, n: +m[1] });
    }
    const sp = [...svg.matchAll(/<text[^>]*\sx="([\d.]+)"[^>]*\sy="([\d.]+)"[^>]*>\d+<\/text>/g)].map(m => [+m[1], +m[2]]);
    return { items: out, pos: sp };
  };
  const check412 = q => {
    const { items, pos } = read412(q), cups = items.filter(x => x.kind === 'cup').map(x => x.n), sau = items.filter(x => x.kind === 'saucer').map(x => x.n);
    if(cups.length !== q.cups.length || sau.length !== q.saucers.length || cups.join() !== q.cups.join() || sau.join() !== q.saucers.join()) fail('412: the picture does not show the cups and the saucers', q);
    const k = new Set(cups.filter(n => sau.includes(n))).size;
    let ans = 0; const left = sau.slice(); cups.forEach(n => { const i = left.indexOf(n); if(i >= 0){ left.splice(i, 1); ans++; } });
    if(ans !== k && cups.length === new Set(cups).size && sau.length === new Set(sau).size) fail('412: matching is not counting', q);
    if(ans !== q.ans || Q.answers(q).join() !== String(ans)) fail('412: the sets are not the answer', q);
    if(new Set(pos.map(p => p.join())).size !== pos.length || cups.length > 10 || sau.length > 10 || ans < 3 || cups.concat(sau).some(n => n < 1 || n > 12)) fail('412: the layout is wrong', q);
  };
  for(let i = 1; i <= 3000; i++) check412(Q.seeded(i, () => Q.raw(412)));
  {
    // 2019 #7: cups 10 1 7 5 2 9 6 3, saucers 5 3 9 1 11 8 4 6 10: 1, 3, 5, 6, 9, 10 are on both, six sets (key D). The generator draws 3–6 sets,
    // 1–3 loose cups and 1–3 loose saucers from the numbers 1–12, so the printed row is one of its own.
    const q = Q.cupSets([10, 1, 7, 5, 2, 9, 6, 3], [5, 3, 9, 1, 11, 8, 4, 6, 10]);
    shows('Кенгуру 2019 task 7', q, ['Всяка чашка трябва да се комплектова с чинийка със същия номер.', 'Колко такива комплекта най-много могат да се направят?']);
    check412(q);
    if(q.ans !== 6 || Q.answers(q).join() !== '6') throw new Error('2019 task 7: gives ' + Q.answers(q) + ', the key says 6');
    tagged(412, ['ek-2019-2']);
  }

  // ---- 413: the dots and the cards are read back and counted; exactly one dot lies on all four, with its letter the right option
  const read413 = q => {
    const P = parse(svgs(Q.drawQ(q))[0]), cards = P.rects, dots = P.circles.map(c => [c.x, c.y]);
    const letters = P.texts.map(t => ({ t: t.t, p: [t.x, t.y] }));
    return dots.map(d => ({ d, letter: letters.sort((a, b) => Math.hypot(a.p[0] - 11 - d[0], a.p[1] - 5 - d[1]) - Math.hypot(b.p[0] - 11 - d[0], b.p[1] - 5 - d[1]))[0].t, on: cards.filter(r => inRect(d, r)).length, edge: Math.min(...cards.map(r => dRect(d, r) * (inRect(d, r) ? 1 : 1))) }));
  };
  const check413 = q => {
    const P = parse(svgs(Q.drawQ(q))[0]), dots = read413(q);
    if(P.rects.length !== 4 || dots.length !== 5 || new Set(dots.map(x => x.letter)).size !== 5 || dots.some(x => !'ABCDE'.includes(x.letter))) fail('413: four cards and five lettered dots expected', q);
    if(new Set(P.rects.map(r => r.w + 'x' + r.h)).size !== 1) fail('413: the cards are not equal', q);
    if(dots.some(x => x.edge < 5)) fail('413: a dot is too near a card edge to tell', q);
    const all = dots.filter(x => x.on === 4);
    if(all.length !== 1 || q.options.length !== 5 || new Set(q.options.map(o => o.text[0])).size !== 5 || all[0].letter !== q.options[q.pick].text[0]) fail('413: the right option is not the one dot on all four cards', q);
    if(dots.filter(x => x.on === 3).length > 3) fail('413: too many dots on three cards', q);
  };
  for(let i = 1; i <= 3000; i++) check413(Q.seeded(i, () => Q.raw(413)));
  {
    // 2021 #4: cards stacked from the back (top right) forward; A and B are above the front card, C left of the back card, E right of the second
    // card, D in the patch all four share (key D). The paper's picture scaled to a card of 100 and set on the generator's grid of 8.
    const q = Q.cardHole(200, 172, [[72, 8], [8, 16], [32, 40], [48, 64]], [[80, 50], [122, 50], [56, 90], [90, 88], [124, 88]]);
    shows('Кенгуру 2021 task 4', q, ['Четири картончета с еднакви размери са поставени, както е показано.', 'През коя от точките A, B, C, D или E трябва да се пробие дупка така, че и четирите картончета да бъдат пробити?']);
    check413(q);
    if(q.options[q.pick].text[0] !== 'D') throw new Error('2021 task 4: the right option is ' + q.options[q.pick].text[0] + ', the key says D');
    tagged(413, ['ek-2021-2']);
  }

  // ---- 414: the two families are read from the two ovals, the options from their ovals; one option has its three in one family
  const read414 = q => {
    const g = svgs(given(q))[0], fam = [...g.matchAll(/<ellipse[^>]*>([\s\S]*?)(?=<ellipse|<\/svg>)/g)].map(m => [...m[1].matchAll(/<text[^>]*>(.*?)<\/text>/g)].map(x => x[1]));
    return fam;
  };
  const check414 = q => {
    const fam = read414(q);
    if(fam.length !== 2 || fam.some(f => f.length !== 5) || new Set(fam[0].concat(fam[1])).size !== 10) fail('414: two families of five different monsters expected', q);
    const mix = o => { const m = [...o.text[0].matchAll(/<text[^>]*>(.*?)<\/text>/g)].map(x => x[1]); return { m, a: m.filter(x => fam[0].includes(x)).length, b: m.filter(x => fam[1].includes(x)).length }; };
    const mixes = q.options.map(mix);
    if(mixes.some(x => x.m.length !== 3 || x.a + x.b !== 3)) fail('414: an option is not three monsters of the two families', q);
    const one = mixes.map((x, i) => x.a === 3 || x.b === 3 ? i : -1).filter(i => i >= 0);
    if(one.length !== 1 || one[0] !== q.pick || Q.answers(q).join() !== String(q.pick)) fail('414: the right option is not the only one from one family', q);
    if(new Set(mixes.map(x => x.m.slice().sort().join())).size !== 5 || mixes.some((x, i) => i !== q.pick && !((x.a === 2 && x.b === 1) || (x.a === 1 && x.b === 2)))) fail('414: the options are alike, or a slip is not two and one', q);
    if(q.options.some(o => o.text[0] === o.text[1] || !/aria-label/.test(o.text[1]))) fail('414: the two languages must label the options', q);
  };
  for(let i = 1; i <= 3000; i++) check414(Q.seeded(i, () => Q.raw(414)));
  tagged(414, ['ek-2026-2']);

  // ---- 415: the squares are read from the fills; the three steps from the sentences; the final row compared with every option
  const FILL415 = { 'var(--coal)': 0, 'var(--paper)': 1, 'url(#rch)': 2 };
  const row415 = svg => parse(svg).rects.filter(r => r.x === r.x).map(r => FILL415[r.fill]);
  const stepsOf = q => {
    const t = Q.drawQ(q).replace(/<[^>]*>/g, ''), W = { черно: 0, бяло: 1, шарено: 2 };
    return [...t.matchAll(/всяко (черно|бяло|шарено) квадратче с (черно|бяло|шарено)/g)].map(m => [W[m[1]], W[m[2]]]);
  };
  const check415 = q => {
    const st = stepsOf(q), start = row415(svgs(given(q))[0]);
    if(st.length !== 3 || start.length !== 9 || start.some(c => c === undefined)) fail('415: three steps and nine squares expected', q);
    let r = start; st.forEach(([f, t]) => { r = r.map(c => c === f ? t : c); });
    const rows = q.options.map(o => row415(svgs(o.text[0])[0]));
    if(rows.some(x => x.length !== 9 || x.some(c => c === undefined)) || new Set(rows.map(x => x.join(''))).size !== 5) fail('415: five different rows of nine squares expected', q);
    const hit = rows.map((x, i) => x.join('') === r.join('') ? i : -1).filter(i => i >= 0);
    if(hit.length !== 1 || hit[0] !== q.pick || Q.answers(q).join() !== String(q.pick)) fail('415: the right option is not the row the three steps leave', q);
    const modal = start.map((_, i) => [0, 1, 2].sort((a, b) => rows.filter(x => x[i] === b).length - rows.filter(x => x[i] === a).length)[0]);
    const score = rows.map(x => x.filter((c, i) => c === modal[i]).length);
    if(score[q.pick] === Math.max(...score)) fail('415: a vote on each square gives the answer', q);
  };
  for(let i = 1; i <= 3000; i++) check415(Q.seeded(i, () => Q.raw(415)));
  {
    // 2019 #22: black → white (Ани), hatched → black (Борко), white → hatched (Васко): what was black or white ends hatched, what was hatched ends black
    const q = Q.recolour([0, 1, 2, 1, 2, 0, 1, 0, 2], [[0, 1], [2, 0], [1, 2]]);
    shows('Кенгуру 2019 task 22', q, ['Девет квадратчета са подредени в редичка, както е показано.', 'Най-напред Ани заменила всяко черно квадратче с бяло.', 'След това Борко заменил всяко шарено квадратче с черно.', 'Накрая Васко заменил всяко бяло квадратче с шарено.', 'Коя от редичките е получена накрая?']);
    check415(q);
    const got = row415(svgs(q.options[q.pick].text[0])[0]).join('');
    if(got !== '220202220') throw new Error('2019 task 22: the right option is ' + got + ', the key B is hatched hatched black hatched black hatched hatched hatched black');
    tagged(415, ['ek-2019-2']);
  }

  // ---- 416: the beads of every ring are read back in the order round the ellipse; a bracelet is the same turned or turned over
  const cls416 = a => { const r = a.slice().reverse(); let best = ''; for(let i = 0; i < a.length; i++) for(const x of [a, r]){ const s = x.slice(i).concat(x.slice(0, i)).join(''); if(best === '' || s < best) best = s; } return best; };
  const ring416 = svg => parse(svg).circles.map(c => ({ a: Math.atan2((c.y - 40) / 29, (c.x - 65) / 50), c: /coal/.test(c.fill) ? 1 : /paper/.test(c.fill) ? 0 : -1 })).sort((p, q) => p.a - q.a).map(x => x.c);
  const steps416 = q => {
    const t = Q.drawQ(q).replace(/<[^>]*>/g, ''), N = { едно: 1, две: 2 };
    return [...t.matchAll(/(отляво|отдясно) се нанизват? (едно|две) (бяло|бели|черно|черни) мънист/g)].map(m => [m[1] === 'отляво' ? 'L' : 'R', /чер/.test(m[3]) ? 1 : 0, N[m[2]]]);
  };
  const check416 = q => {
    const st = steps416(q), thread = [];
    st.forEach(([s, c, n]) => { for(let k = 0; k < n; k++) s === 'L' ? thread.unshift(c) : thread.push(c); });
    const rings = q.options.map(o => ring416(svgs(o.text[0])[0]));
    if(st.length < 5 || rings.some(r => r.length !== thread.length || r.includes(-1))) fail('416: the steps or the rings are not read', q);
    const hit = rings.map((r, i) => cls416(r) === cls416(thread) ? i : -1).filter(i => i >= 0);
    if(new Set(rings.map(cls416)).size !== 5) fail('416: two bracelets are the same up to turning', q);
    if(hit.length !== 1 || hit[0] !== q.pick || Q.answers(q).join() !== String(q.pick)) fail('416: the right option is not the bracelet the steps make', q);
    if(rings.some(r => r.filter(x => x).length !== thread.filter(x => x).length)) fail('416: the slips differ in how many black beads, which gives the answer away', q);
    if(q.options.some(o => o.text[0] === o.text[1])) fail('416: the two languages must label the rings', q);
  };
  for(let i = 1; i <= 3000; i++) check416(Q.seeded(i, () => Q.raw(416)));
  {
    // 2026 #20: 2 white left, 1 black left, 2 black right, 2 white left, 1 white right, 1 black left: the thread is B WW B WW BB W (key A)
    const q = Q.bracelet([['L', 0, 2], ['L', 1, 1], ['R', 1, 2], ['L', 0, 2], ['R', 0, 1], ['L', 1, 1]]);
    shows('Кенгуру 2026 task 20', q, ['първо отляво се нанизват две бели мъниста', 'после отляво се нанизва едно черно мънисто', 'после отдясно се нанизват две черни мъниста', 'после отляво се нанизват две бели мъниста', 'после отдясно се нанизва едно бяло мънисто', 'накрая отляво се нанизва едно черно мънисто', 'Двата края на конеца се свързват и се получава гривна.']);
    check416(q);
    if(cls416(ring416(svgs(q.options[q.pick].text[0])[0])) !== cls416([1, 0, 0, 1, 0, 0, 1, 1, 0])) throw new Error('2026 task 20: the right option is not B WW B WW BB W');
    tagged(416, ['ek-2026-2']);
  }

  // ---- 417: every sticker is read from the SVG (its shape, in the order painted); every pair that overlaps shows its order; the told clue holds in one option only
  const SHAPES417 = ['кръгче', 'квадратче', 'звездичка', 'триъгълниче'], TOLD = { кръгчето: 0, квадратчето: 1, звездичката: 2, триъгълничето: 3 };
  const geo417 = svg => { const P = parse(svg), g = []; [...svg.matchAll(/<(circle|rect|polygon)\b[^>]*data-s="(\d)"[^>]*>/g)].forEach(m => { const s = +m[2], tag = m[0]; g[s] = m[1] === 'circle' ? { has: p => Math.hypot(p[0] - num(tag, 'cx'), p[1] - num(tag, 'cy')) < num(tag, 'r') } : m[1] === 'rect' ? { has: p => inRect(p, { x: num(tag, 'x'), y: num(tag, 'y'), w: num(tag, 'width'), h: num(tag, 'height') }) } : { has: p => inPoly(p, sattr(tag, 'points').trim().split(/\s+/).map(x => x.split(',').map(Number))) }; }); return { g, pile: [...svg.matchAll(/data-s="(\d)"/g)].map(m => +m[1]) }; };
  const told417 = q => { const t = Q.drawQ(q).replace(/<[^>]*>/g, ''), m = t.match(/ако (\S+) е залепен[оа] след (\S+), но преди (\S+)\?/); return m ? { x: TOLD[m[1]], y: TOLD[m[2]], z: TOLD[m[3]] } : null; };
  const vis417 = {};
  const check417 = q => {
    const T = told417(q), piles = q.options.map(o => geo417(o.text[0]));
    if(!T || [T.x, T.y, T.z].some(v => v === undefined) || new Set([T.x, T.y, T.z]).size !== 3) fail('417: the clue is not read', q);
    if(piles.some(p => p.pile.length !== 4 || new Set(p.pile).size !== 4) || new Set(piles.map(p => p.pile.join())).size !== 5) fail('417: five different piles of four stickers expected', q);
    // every pair of stickers overlaps and shows which is on top, in every pile: a point of both whose top sticker is one of them (cached by pile, the layout is fixed)
    piles.forEach(({ g, pile }) => {
      const key = pile.join('');
      if(vis417[key]) return;
      for(let a = 0; a < 4; a++) for(let b = a + 1; b < 4; b++){
        let seen = 0;
        for(let x = 0; x < 112; x += 2) for(let y = 0; y < 100; y += 2){
          const p = [x, y]; if(!g[a].has(p) || !g[b].has(p)) continue;
          const top = pile.slice().reverse().find(s => g[s].has(p));
          if(top === a || top === b) seen++;
        }
        if(seen < 12) fail('417: two stickers overlap too little (or one hides the other) to tell the order ' + a + b, q);
      }
      vis417[key] = 1;
    });
    const ok = piles.map(({ pile }) => pile.indexOf(T.y) < pile.indexOf(T.x) && pile.indexOf(T.x) < pile.indexOf(T.z));
    if(ok.filter(x => x).length !== 1 || !ok[q.pick] || Q.answers(q).join() !== String(q.pick)) fail('417: the right option is not the only pile that fits the clue', q);
  };
  for(let i = 1; i <= 3000; i++) check417(Q.seeded(i, () => Q.raw(417)));
  {
    // 2022 #16: the star is stuck after the square but before the triangle (key E: the pile has the star above the square and under the triangle)
    const hit = pinSeed('Кенгуру 2022 task 16', () => Q.raw(417), g => g.x === 2 && g.y === 1 && g.z === 3 ? 2 : 0, 3e6);
    if(!hit) throw new Error('2022 task 16: level 417 never asks it');
    shows('Кенгуру 2022 task 16', hit.q, ['Как изглеждат залепените стикери, ако звездичката е залепена след квадратчето, но преди триъгълничето?']);
    check417(hit.q);
    const pile = geo417(hit.q.options[hit.q.pick].text[0]).pile;
    if(!(pile.indexOf(1) < pile.indexOf(2) && pile.indexOf(2) < pile.indexOf(3))) throw new Error('2022 task 16: the right pile does not have the star between the square and the triangle');
    tagged(417, ['ek-2022-2']);
  }

  // ---- 418: the cards, their numbers and the order painted are read from the SVG; the order is worked out from the visible overlaps on a raster
  const check418 = q => {
    const svg = svgs(Q.drawQ(q))[0], groups = [...svg.matchAll(/<g data-card="(\d)">([\s\S]*?)<\/g>/g)].map(m => ({ n: +m[1], r: parse(m[2]).rects[0], lab: parse(m[2]).circles[0] }));
    if(groups.length !== 5 || new Set(groups.map(x => x.n)).size !== 5 || new Set(groups.map(x => x.r.w + 'x' + x.r.h)).size !== 1) fail('418: five equal numbered cards expected', q);
    const topAt = p => { let t = 0; groups.forEach(x => { if(inRect(p, x.r)) t = x.n; }); return t; };
    // a number is never under a later card
    groups.forEach((x, i) => groups.slice(i + 1).forEach(y => { if(dRect([x.lab.x, x.lab.y], y.r) < x.lab.r) fail('418: a number is hidden under a later card', q); }));
    const rel = {};
    for(let x = 0; x < 150; x += 2) for(let y = 0; y < 150; y += 2){
      const inn = groups.filter(g => inRect([x, y], g.r)).map(g => g.n);
      if(inn.length < 2) continue;
      const t = topAt([x, y]); inn.forEach(b => { if(b !== t) rel[t + '>' + b] = (rel[t + '>' + b] || 0) + 1; });
    }
    const pairs = Object.keys(rel).filter(k => rel[k] >= 4).map(k => k.split('>').map(Number)), orders = [];
    const perm = (a, r) => { if(!a.length){ if(pairs.every(([t, b]) => r.indexOf(t) > r.indexOf(b))) orders.push(r); } else a.forEach((v, i) => perm(a.filter((_, j) => j !== i), r.concat(v))); };
    perm([1, 2, 3, 4, 5], []);
    const painted = groups.map(x => x.n);
    if(orders.length !== 1 || orders[0].join() !== painted.join()) fail('418: the visible overlaps do not leave exactly the painted order', q);
    const seqs = q.options.map(o => o.text[0].split('-').map(Number));
    if(seqs.some(s => s.length !== 5 || new Set(s).size !== 5) || new Set(seqs.map(s => s.join())).size !== 5) fail('418: five different orders of the cards expected', q);
    const hit = seqs.map((s, i) => s.join() === orders[0].join() ? i : -1).filter(i => i >= 0);
    if(hit.length !== 1 || hit[0] !== q.pick || Q.answers(q).join() !== String(q.pick)) fail('418: the right option is not the order the picture leaves', q);
    const modal = [0, 1, 2, 3, 4].map(l => [1, 2, 3, 4, 5].sort((a, b) => seqs.filter(s => s[l] === b).length - seqs.filter(s => s[l] === a).length)[0]);
    const score = seqs.map(s => s.filter((c, l) => c === modal[l]).length);
    if(score[q.pick] === Math.max(...score)) fail('418: a vote on each place gives the answer', q);
  };
  for(let i = 1; i <= 1500; i++) check418(Q.seeded(i, () => Q.raw(418)));
  {
    // 2019 #11: card 4 first, then 1 over it, 3 over both, 2 over 3, 5 over 2 and 3 (key A: 4-1-3-2-5); the paper's layout on the generator's grid
    const q = Q.cardOrder([[4, 4], [4, 44], [19, 24], [34, 4], [34, 44]], [4, 1, 3, 2, 5]);
    if(!q) throw new Error('2019 task 11: no question');
    shows('Кенгуру 2019 task 11', q, ['На масата са поставени пет еднакви квадратни карти, както е показано на схемата.', 'В каква последователност са били поставени картите?']);
    check418(q);
    if(q.options[q.pick].text[0] !== '4-1-3-2-5') throw new Error('2019 task 11: the right option is ' + q.options[q.pick].text[0] + ', the key A is 4-1-3-2-5');
    tagged(418, ['ek-2019-2']);
  }
}
