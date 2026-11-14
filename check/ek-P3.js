// Runs beside the app (in check.js's own scope, through eval), like check/ek-A.js.
// Европейско Кенгуру, 2 клас — pieces that fit, mirror, turn, flip, builder P3: 370 the mirror (2021 #5, 2026 #9), 371 the ladybug and the
// stamp (2026 #1, 2024 #8, 2022 #13), 372 the quarter turn (2024 #4), 373 the tokens (2026 #6), 374 the piece on the white squares
// (2025 #1), 375 the hole in the board (2024 #19). Every picture answer is checked from the drawing itself (the SVG each option is made of is
// read back and worked out here, not from the numbers the generator keeps): exactly one of the five options is the asked transform / the
// piece that fits, and no two are the same picture. The printed instance is pinned where the paper's picture can be told in the question's own
// fields (the digits, the letters, the triangles, the tokens); the ladybug, the stamp, the puzzle and the board are drawn afresh every time,
// so they are proved by brute force on 3000 seeds instead.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 300)); };
  const svgs = h => String(h).match(/<svg[\s\S]*?<\/svg>/g) || [];
  const given = q => Q.drawQ(q).split('class="given"')[1] || '';
  const only = (what, opts, ok) => { const hit = opts.filter(ok); if(hit.length !== 1) fail(what + ': ' + hit.length + ' of the options match', opts.map(o => o.id)); return hit[0]; };
  const tagged = (id, tags) => tags.forEach(t => { if(!Q.LEVELS.find(l => l.id === id).papers.includes(t)) throw new Error('level ' + id + ' is not tagged ' + t); });
  const pin = (name, tag, id, ok, shows) => {
    const hit = pinSeed(name, () => Q.raw(id), g => ok(g) ? 2 : 0, 3e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const t = strip(Q.drawQ(hit.q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    tagged(id, [tag]);
    return hit.q;
  };
  const sameSet = (a, b) => a.length === b.length && a.every(x => b.includes(x));

  // ---- 370: read every glyph back from the SVG: [x, sign, turned left-right, upside down], a sign that looks the same turned counted as not turned
  const SYM = { '0': [1, 1], '1': [0, 0], '2': [0, 0], '4': [0, 0], '5': [0, 0], '7': [0, 0], '9': [0, 0], A: [1, 0], B: [0, 1], C: [0, 1], K: [0, 1], E: [0, 1], '♥': [1, 0] };
  const readRow = svg => [...svg.matchAll(/<g transform="translate\(([-\d.]+) [-\d.]+\) scale\((-?1) (-?1)\)">(.*?)<\/g>/g)].map(m => {
    const g = /<path/.test(m[4]) ? '♥' : m[4].match(/>(.)<\/text>/)[1];
    return { x: +m[1], g, fx: m[2] === '-1' && !SYM[g][0], fy: m[3] === '-1' && !SYM[g][1] };
  }).sort((a, b) => a.x - b.x).map(r => r.g + (r.fx ? 'x' : '') + (r.fy ? 'y' : '')).join(' ');
  const mirrorOf = row => row.slice().reverse().map(g => g + (SYM[g][0] ? '' : 'x')).join(' ');   // the left-right mirror, worked out here
  const checkMirror = q => {
    const mine = only('mirror', q.options, o => readRow(o.text[0]) === mirrorOf(q.row));
    if(mine.id !== q.pick) fail('370: the picked option is not the mirror', q);
    if(new Set(q.options.map(o => readRow(o.text[0]))).size !== 5 || q.options.some(o => o.text[0] !== o.text[1])) fail('370: options repeat', q);
    if(readRow(given(q).match(/<svg[\s\S]*?<\/svg>/)[0]) !== q.row.map(g => g).join(' ')) fail('370: the picture in the task is not the row', q);
  };
  const p1 = pin('Кенгуру 2021 task 5', 'ek-2021-2', 370, g => g.shape === 'shirt' && g.row.join('') === '2021',
    ['Ако облечете тениската с числото 2021 отпред и застанете пред огледалото, какво ще видите в него?']);
  const p2 = pin('Кенгуру 2026 task 9', 'ek-2026-2', 370, g => g.shape === 'window' && g.row.join('') === 'ABC♥',
    ['Трите букви и сърчицето са нарисувани на прозореца отвътре, както е показано. Как изглеждат те отвън?']);
  // key read from the paper: 2021 → 1202 with every digit turned round (A); A B C ♥ → ♥ Ɔ ꓭ A (E)
  {
    if(mirrorOf(['2', '0', '2', '1']) !== '1x 2x 0 2x' || mirrorOf(['A', 'B', 'C', '♥']) !== '♥ Cx Bx A') throw new Error('370: the mirror of the printed rows is not the printed key');
  }
  if(readRow(p1.options[p1.pick].text[0]) !== '1x 2x 0 2x' || readRow(p2.options[p2.pick].text[0]) !== '♥ Cx Bx A') throw new Error('370: the picked option is not the printed key (A: 1202 turned round, E: ♥ Ɔ ꓭ A)');
  tagged(370, ['ek-2021-2', 'ek-2026-2']);
  for(let i = 1; i <= 3000; i++) checkMirror(Q.seeded(i, () => Q.raw(370)));

  // ---- 371: the ladybug as drawn: spots and head after the option's own transform (scale first, then rotate), worked out here
  const apply = (tf, [x, y]) => {
    if(/scale\(-1 1\)/.test(tf)) x = -x;
    const r = tf.match(/rotate\((\d+)\)/);
    for(let k = 0; k < (r ? +r[1] / 90 : 0); k++) [x, y] = [-y, x];
    return [x, y];
  };
  const bug = svg => ({ tf: (svg.match(/<g transform="([^"]*)"/) || [0, ''])[1], pts: [...svg.matchAll(/<circle cx="(-?\d+)" cy="(-?\d+)" r="(?:3\.4|8)"/g)].map(m => [+m[1], +m[2]]) });
  const seen = (svg) => { const b = bug(svg); return b.pts.map(p => apply(b.tf, p).join(',')).sort().join(' '); };
  const turnsOf = svg => { const b = bug(svg); return [0, 1, 2, 3].map(k => b.pts.map(p => apply('rotate(' + 90 * k + ')', p).join(',')).sort().join(' ')); };
  const stampOf = svg => { const b = bug(svg); return b.pts.map(p => apply('scale(-1 1)', p).join(',')).sort().join(' '); };
  const seenCounts = { lady: 0, stamp: 0 };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(371)), g = svgs(given(q))[0];
    const first = q.shape === 'lady' ? turnsOf(g) : [stampOf(g)];
    const mine = only('371 ' + q.shape, q.options, o => first.includes(seen(o.text[0])));
    if(mine.id !== q.pick) fail('371: the picked option is not the one asked for', q);
    if(new Set(q.options.map(o => seen(o.text[0]))).size !== 5) fail('371: two options are one picture', q);
    if(q.shape === 'lady' && seen(q.options[q.pick].text[0]) === seen(g)) fail('371: the right ladybug is not turned', q);
    seenCounts[q.shape]++;
  }
  if(!seenCounts.lady || !seenCounts.stamp) throw new Error('371 draws only one shape');
  pin('Кенгуру 2026 task 1', 'ek-2026-2', 371, g => g.shape === 'lady', ['Коя от калинките по-долу е като показаната?']);
  pin('Кенгуру 2024 task 8 / 2022 task 13', 'ek-2024-2', 371, g => g.shape === 'stamp', ['е отпечатана с помощта на показания печат']);
  tagged(371, ['ek-2022-2', 'ek-2024-2', 'ek-2026-2']);

  // ---- 372: read the squares back (circle cx cy, triangle translate + rotate), turn the first by coordinates, compare
  const square = svg => [...svg.matchAll(/<circle cx="(\d+)" cy="(\d+)" r="8"/g)].map(m => 'c@' + m[1] + ',' + m[2])
    .concat([...svg.matchAll(/<polygon transform="translate\((\d+) (\d+)\) rotate\((-?\d+)\)"/g)].map(m => 't' + ((+m[3] % 360) + 360) % 360 + '@' + m[1] + ',' + m[2])).sort();
  const turnBy = (sq, cw) => sq.map(s => { const m = s.match(/^(c|t(\d+))@(\d+),(\d+)$/), x = +m[3], y = +m[4]; const [nx, ny] = cw ? [70 - y, x] : [y, 70 - x];
    return (m[1] === 'c' ? 'c' : 't' + ((+m[2] + (cw ? 90 : 270)) % 360)) + '@' + nx + ',' + ny; }).sort();
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(372)), sq = svgs(given(q)).filter(s => /viewBox="0 0 70 70"/.test(s)), cw = /завърта рисунката надясно/.test(Q.drawQ(q));
    if(cw !== q.cw) fail('372: the words say another direction than the arrows', q);
    const p1 = square(sq[0]), p2 = square(sq[1]), want = turnBy(turnBy(p1, cw), cw);
    if(p2.join() !== turnBy(p1, cw).join()) fail('372: the second picture is not the first turned a quarter turn the way the words say', q);
    const mine = only('372', q.options, o => square(o.text[0]).join() === want.join());
    if(mine.id !== q.pick || new Set(q.options.map(o => square(o.text[0]).join())).size !== 5) fail('372: the picked option is not the one turned twice, or options repeat', q);
  }
  {   // the printed instance: ▶ top left, ● top right, ▼ bottom right → once more: ▲ top left, ● bottom left, ◀ bottom right (C)
    const q = pin('Кенгуру 2024 task 4', 'ek-2024-2', 372, g => g.cw && g.p1.join() === '1,c,2,' , ['Кенгуруто Кевин поставя на масата една рисунка с две триъгълничета и едно кръгче. Той завърта рисунката надясно на четвърт оборот, както е показано.']);
    if(square(q.options[q.pick].text[0]).join() !== ['t0@18,18', 'c@18,52', 't270@52,52'].sort().join()) throw new Error('Кенгуру 2024 task 4: the right option is not ▲ top left, ● bottom left, ◀ bottom right');
  }

  // ---- 373: the tokens as drawn, row by row: a coloured one is filled, a white one is not
  const toks = svg => [...svg.matchAll(/<circle [^>]*fill="var\(--(accent|warm)\)"/g)].map(m => m[1] === 'accent' ? 1 : 0);
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(373)), base = toks(svgs(given(q))[0]);
    const mine = only('373', q.options, o => toks(o.text[0]).every((x, k) => x === 1 - base[k]) && toks(o.text[0]).length === base.length);
    if(mine.id !== q.pick || new Set(q.options.map(o => toks(o.text[0]).join(''))).size !== 5) fail('373: the picked option is not every token turned over, or options repeat', q);
  }
  {   // the printed instance: ● / ○ ● / ● ○ ○ → ○ / ● ○ / ○ ● ● (E)
    const q = pin('Кенгуру 2026 task 6', 'ek-2026-2', 373, g => g.n === 3 && g.base.join('') === '101100', ['Показаните жетони са жълти от едната страна и сини от другата. Как изглеждат те след като се преобърнат?']);
    if(toks(q.options[q.pick].text[0]).join('') !== '010011') throw new Error('Кенгуру 2026 task 6: the right option is not ○ / ● ○ / ○ ● ●');
  }

  // ---- 374: the pieces read back from their squares; every option tried in its 4 turns at every place on the white squares
  const cellsOf = svg => [...svg.matchAll(/<rect x="(\d+)" y="(\d+)"/g)].map(m => [(+m[1] - 1) / 15, (+m[2] - 1) / 15]);
  const turns = c => { const r = [c]; for(let k = 1; k < 4; k++) r.push(r[k - 1].map(([x, y]) => [-y, x])); return r; };
  const key = c => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => (x - mx) + ',' + (y - my)).sort().join(' '); };
  const lies = (white, c) => turns(c).some(t => { for(let ox = -6; ox < 14; ox++) for(let oy = -6; oy < 14; oy++) if(t.every(([x, y]) => white.includes((x + ox) + ',' + (y + oy)))) return true; return false; });
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(374)), cs = q.options.map(o => cellsOf(o.text[0]));
    if(cs.some(c => c.length !== 5)) fail('374: a piece is not five squares', q);
    const white = [...svgs(given(q))[0].matchAll(/<rect x="(\d+)" y="(\d+)"[^>]*fill="var\(--solid\)"/g)].map(m => ((+m[1] - 1) / 24) + ',' + ((+m[2] - 1) / 24));   // the white squares as drawn
    if(white.slice().sort().join() !== q.white.join()) fail('374: the board drawn has other white squares than the generator holds', q);
    const fits = cs.map(c => lies(white, c));
    if(fits.filter(Boolean).length !== 1 || !fits[q.pick]) fail('374: not exactly the picked piece lies on the white squares', q);
    if(new Set(cs.map(c => turns(c).map(key).sort()[0])).size !== 5) fail('374: two options are one piece turned', q);
    if(!q.place.every(([x, y]) => q.white.includes(x + ',' + y)) || key(q.place) !== key(cs[q.pick]) && !turns(cs[q.pick]).some(t => key(t) === key(q.place))) fail('374: the solution place is not the picked piece on white squares', q);
  }

  // ---- 375: every pair of the four pieces tried by sliding both over the hole; the option's own numbers read from its text
  const slides = (hole, a, b) => { const H = hole.map(c => c.join(',')); for(let ax = -7; ax < 14; ax++) for(let ay = -7; ay < 14; ay++){
    const A = a.map(([x, y]) => (x + ax) + ',' + (y + ay)); if(!A.every(c => H.includes(c))) continue;
    const rest = H.filter(c => !A.includes(c)); if(rest.length !== b.length) continue;
    for(let bx = -7; bx < 14; bx++) for(let by = -7; by < 14; by++) if(sameSet(b.map(([x, y]) => (x + bx) + ',' + (y + by)), rest)) return true; } return false; };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(375)), sv = svgs(given(q)), good = [];
    const P = sv.slice(1, 5).map(v => [...v.matchAll(/<rect x="(\d+)" y="(\d+)"/g)].map(m => [(+m[1] - 1) / 18, (+m[2] - 1) / 18]));   // the four pieces as drawn
    const gh = q.hole;
    q.hole = [...sv[0].matchAll(/<rect x="(\d+)" y="(\d+)"[^>]*stroke-dasharray/g)].map(m => [(+m[1] - 1) / 22, (+m[2] - 1) / 22]);   // the hole as drawn: its dashed squares
    if(P.some(p => !p.length) || P.length !== 4 || q.hole.length !== gh.length || !sameSet(q.hole.map(c => c.join(',')), gh.map(c => c.join(',')))) fail('375: the hole drawn is not the generator\'s hole, or the drawing cannot be read', q);
    for(let a = 0; a < 4; a++) for(let b = a + 1; b < 4; b++) if(slides(q.hole, P[a], P[b])) good.push((a + 1) + ' и ' + (b + 1));
    const label = q.options[q.pick].text[0];
    if(good.length !== 1 || good[0] !== label) fail('375: not exactly the picked pair fills the hole by sliding: ' + good, q);
    // the solution picture: each colour fills the hole with exactly the shape of its piece (number k is colour k)
    const sol = svgs(Q.why(q, true))[0], PC = ['accent', 'warm', 'good', 'grape'];
    PC.forEach((c, k) => { const at = [...sol.matchAll(new RegExp('<rect x="(\\d+)" y="(\\d+)"[^>]*fill="var\\(--' + c + '\\)"', 'g'))].map(m => [(+m[1] - 1) / 22, (+m[2] - 1) / 22]);
      if(at.length && key(at) !== key(P[k])) fail('375: the solution paints piece ' + (k + 1) + ' in a shape that is not its own', q); });
    if(new Set(q.options.map(o => o.text[0])).size !== 5 || new Set(P.map(p => key(p))).size !== 4) fail('375: options or pieces repeat', q);
    if(q.options.some(o => o.text[1] !== o.text[0].replace(' и ', ' і '))) fail('375: the Ukrainian option is not the same pair', q);
  }
  console.log('Кенгуру 2 клас, pieces that fit, mirror, turn, flip (370–375): 2021 #5, 2026 #9, 2024 #4, 2026 #6 pinned as printed and read back from the drawing; 2026 #1, 2024 #8 / 2022 #13, 2025 #1, 2024 #19 proved on 3000 seeds each: exactly one option is the transform / the piece that fits, no two pictures alike');
}
