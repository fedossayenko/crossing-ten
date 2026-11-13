// Runs beside the app (in check.js's own scope, through eval), like check/ek-A.js.
// Европейско Кенгуру, 2 клас — pictures, builder P2: counting on a grid, levels 360–365: 2023 #10 (halves of a grid), 2025 #6 (squares
// taken away), 2026 #7 (coloured and white in turn), 2024 #6 (triangle tiles), 2025 #10 (three rugs), 2026 #14 (tubes of paint).
// Each printed task is drawn as printed by its level and must come out at the official key by the generator's own answer; then every
// generator is worked out again from the picture it draws (the coloured squares, the gaps, the triangles, the rugs counted again).
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const pin = (name, tag, id, same, shows, key) => {
    const hit = pinSeed(name, () => Q.raw(id), g => same(g) ? 2 : 0, 2e6);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    if(Q.answers(q).join() !== String(key)) throw new Error(name + ': the level gives ' + Q.answers(q) + ', the key says ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
  };
  pin('Кенгуру 2023 task 10', 'ek-2023-2', 360, g => g.W === 6 && g.H === 4 && g.k === 9, ['На картинката са показани 24 квадратчета, някои от които са оцветени. Още колко квадратчета трябва да се оцветят така, че броят на оцветените и неоцветените да е един и същ?'], 3);
  pin('Кенгуру 2025 task 6', 'ek-2025-2', 361, g => g.n === 5 && g.rows.map(r => r.join('')).join() === '00111,00011,01001,01101,11111', ['С 25 еднакви малки квадратчета е съставен по-голям квадрат и някои от малките квадратчета са премахнати. Колко малки квадратчета са премахнати?'], 10);
  pin('Кенгуру 2026 task 7', 'ek-2026-2', 362, g => g.shape === 'pyramid' && g.N === 6, ['С колко цветните квадратчета са повече от белите?'], 6);
  pin('Кенгуру 2024 task 6', 'ek-2024-2', 363, g => g.n === 4 && g.k === 10, ['Борис сглобява големия триъгълник, използвайки еднакви малки триъгълни плочки. Още колко плочки са необходими на Борис, за да завърши сглобяването на големия триъгълник?'], 6);
  pin('Кенгуру 2025 task 10', 'ek-2025-2', 364, g => g.W === 10 && g.H === 9 && JSON.stringify(g.rugs) === '[[3,2,5,5],[2,5,4,4],[1,1,5,3],[4,3,5,3]]', ['Подът на баня е покрит с еднакви малки квадратни плочки. На пода са поставени 2 квадратни и 2 правоъгълни постелки, които се застъпват, както е показано. Върху колко от плочките има по три постелки?'], 4);
  pin('Кенгуру 2026 task 14', 'ek-2026-2', 365, g => g.letter === 'К' && g.oc === 2, ['Бобърът Били оцветява буквата К, както е показано. За оцветената част той е използвал една тубичка боя. Още колко тубички са необходими на бобъра Били, за да довърши оцветяването на буквата К?'], 4);

  const attr = (s, a) => (s.match(new RegExp(a + '="([^"]*)"')) || [])[1];
  const tags = (svg, name) => svg.match(new RegExp('<' + name + '[ >][^>]*>', 'g')) || [];
  const area = pts => Math.abs(pts.reduce((s, p, i) => { const r = pts[(i + 1) % pts.length]; return s + p[0]*r[1] - r[0]*p[1]; }, 0)/2);
  const n = {}, count = k => n[k] = (n[k] || 0) + 1;
  // 360: count the grid's squares and the coloured ones in the picture; half the grid less the coloured is the answer
  for(let i = 0; i < 2000; i++){
    const q = Q.raw(360); count('halfgrid');
    const r = tags(Q.drawQ(q), 'rect'), on = r.filter(s => attr(s, 'fill') === 'var(--accent)').length;
    if(r.length !== q.W*q.H || r.length % 2 || r.length/2 - on !== q.ans || q.ans < 1 || on !== q.k) fail('360: the coloured squares in the picture do not give the answer', q);
    if(q.traps.includes(q.ans)) fail('360: a slip is the answer', q);
  }
  // 361: the squares left, drawn, and the gaps counted; the removed ones are exactly the empty places of the big square
  for(let i = 0; i < 2000; i++){
    const q = Q.raw(361); count('cutout');
    const r = tags(Q.drawQ(q), 'rect').filter(s => attr(s, 'fill-opacity') === '.22'), seen = new Set(r.map(s => attr(s, 'x') + ',' + attr(s, 'y')));
    if(seen.size !== r.length) fail('361: a square is drawn twice', q);
    let gaps = 0; for(let y = 0; y < q.n; y++) for(let x = 0; x < q.n; x++) if(!seen.has(x*34 + ',' + y*34)) gaps++;
    if(gaps !== q.ans || r.length + q.ans !== q.n*q.n || q.ans < 4 || q.traps.includes(q.ans)) fail('361: the gaps in the picture are not the answer', q);
  }
  // 362: the green squares against the empty ones in the picture, row by row
  for(let i = 0; i < 2000; i++){
    const q = Q.raw(362); count('stairs ' + q.shape);
    const r = tags(Q.drawQ(q), 'rect'), g = r.filter(s => attr(s, 'fill') === 'var(--good)').length, w = r.length - g;
    if(r.length !== (q.shape === 'pyramid' ? q.N*q.N : q.N*(q.N + 1)/2) || g - w !== q.ans || q.ans < 1) fail('362: the squares in the picture do not give the answer', q);
    if(q.shape === 'pyramid' && q.ans !== q.N) fail('362: a pyramid of N rows has N more coloured', q);
    if(q.shape === 'steps' && q.ans !== Math.ceil(q.N/2)) fail('362: a staircase of N rows has ceil(N/2) more coloured', q);
    // every row is read on its own: a pyramid row has a coloured square at both ends
    if(q.shape === 'pyramid') for(let y = 0; y < q.N; y++){ const row = q.cells.filter(c => c[0] === y); if(!row[0][2] || !row[row.length - 1][2]) fail('362: a row does not end in colour', q); }
  }
  // 363: every tile of the picture has the same area, together they are the big triangle, and the plain ones are what is missing
  for(let i = 0; i < 2000; i++){
    const q = Q.raw(363); count('tritile');
    const p = tags(Q.drawQ(q), 'polygon').map(s => ({ on: attr(s, 'fill') === 'var(--warm)', a: area(attr(s, 'points').split(' ').map(v => v.split(',').map(Number))) }));
    const tile = p[0].a, big = tile*q.n*q.n;
    if(p.length !== q.n*q.n || p.some(t => Math.abs(t.a - tile) > 1e-6)) fail('363: the tiles differ or are not n squared', q);
    if(Math.abs(p.reduce((s, t) => s + t.a, 0) - big) > 1e-6) fail('363: the tiles do not add up', q);
    // the big triangle: its side n tiles, its area n squared tiles
    const side = 44*q.n; if(Math.abs(Math.sqrt(3)/4*side*side - big) > 1e-6*big) fail('363: the tiles are not a triangle of side n', q);
    if(p.filter(t => !t.on).length !== q.ans || q.ans < 1 || q.traps.includes(q.ans)) fail('363: the empty tiles are not the answer', q);
  }
  // 364: the rugs read back from the picture, every tile counted
  const printed = JSON.stringify([[3, 2, 5, 5], [2, 5, 4, 4], [1, 1, 5, 3], [4, 3, 5, 3]]);
  let sawPrinted = 0;
  for(let i = 0; i < 2000; i++){
    const q = Q.raw(364); count('rugs');
    const r = tags(Q.drawQ(q), 'rect').filter(s => attr(s, 'fill-opacity') === '.38').map(s => [attr(s, 'x') / 30, attr(s, 'y') / 30, attr(s, 'width') / 30, attr(s, 'height') / 30]);
    if(r.length !== 4 || JSON.stringify(r) !== JSON.stringify(q.rugs)) fail('364: the rugs in the picture are not the rugs', q);
    if(!(r[0][2] === r[0][3] && r[1][2] === r[1][3] && r[2][2] !== r[2][3] && r[3][2] !== r[3][3])) fail('364: two squares and two rectangles expected', q);
    let three = 0, four = 0;
    for(let y = 0; y < q.H; y++) for(let x = 0; x < q.W; x++){ let c = 0; r.forEach(([rx, ry, w, h]) => { if(x >= rx && x < rx + w && y >= ry && y < ry + h) c++; }); if(c === 3) three++; if(c > 3) four++; }
    if(three !== q.ans || four || q.ans < 1 || q.traps.includes(q.ans)) fail('364: the tiles with three rugs are not the answer', q);
    if(JSON.stringify(q.rugs) === printed) sawPrinted++;
    if(r.some(([x, y, w, h]) => x < 0 || y < 0 || x + w > q.W || y + h > q.H)) fail('364: a rug is off the floor', q);
  }
  if(!sawPrinted) throw new Error('364: the printed layout never came up');
  // 365: the letter's area from the polygons it is drawn with (shoelace), against the part that is painted
  for(let i = 0; i < 2000; i++){
    const q = Q.raw(365); count('tubes ' + q.shape);
    const p = tags(Q.drawQ(q), 'polygon').map(s => ({ on: attr(s, 'fill') === 'var(--warm)', a: area(attr(s, 'points').split(' ').map(v => v.split(',').map(Number))) / 900 }));
    const all = p.reduce((s, t) => s + t.a, 0), paint = p.filter(t => t.on).reduce((s, t) => s + t.a, 0);
    if(p.length !== q.pieces.length || paint <= 0 || Math.abs(all / paint - Math.round(all / paint)) > 1e-9 || Math.round(all / paint) - 1 !== q.ans || q.ans < 2) fail('365: the tubes in the picture are not the answer', q);
    if(q.shape === 'half' && (all !== 10 || q.letter !== 'К')) fail('365: the К is ten squares', q);
    if(q.shape === 'half'){   // the outline is the printed К's: 13 corners, 16 unit sides (the stem's four on the left, the notches, the two arms)
      const segs = (Q.drawQ(q).match(/<line x1="[^"]*" y1="[^"]*" x2="[^"]*" y2="[^"]*"\/>/g) || []).filter(s => /^<line x1="\d+" y1="\d+" x2="\d+" y2="\d+"\/>$/.test(s)).map(s => ['x1', 'y1', 'x2', 'y2'].map(k => attr(s, k) / 30));
      const want = ['0,0,0,1', '0,1,0,2', '0,2,0,3', '0,3,0,4', '0,0,1,0', '1,0,1,1', '1,1,2,0', '2,0,3,0', '3,0,3,1', '2,2,3,1', '2,2,3,3', '3,3,3,4', '2,4,3,4', '1,3,2,4', '1,3,1,4', '0,4,1,4'];
      const got = segs.map(s => (s[0] < s[2] || (s[0] === s[2] && s[1] < s[3]) ? s : [s[2], s[3], s[0], s[1]]).join(',')).filter(k => want.includes(k));
      if(new Set(got).size !== 16) fail('365: the К outline is not the printed one, got ' + got, q);
    }
    if(q.shape === 'letter' && p.some(t => t.a !== 1)) fail('365: plain letters are whole squares', q);
    if(q.shape === 'letter' && (all < 6 || !/^[ГПНТ]$/.test(q.letter))) fail('365: the letter', q);
  }
  ['halfgrid', 'cutout', 'stairs pyramid', 'stairs steps', 'tritile', 'rugs', 'tubes half', 'tubes letter'].forEach(k => { if(!n[k]) throw new Error('P2: ' + k + ' never turned up'); });
  console.log('Кенгуру 2 клас, counting on a grid (360–365): 2023 #10, 2025 #6, 2026 #7, 2024 #6, 2025 #10, 2026 #14 match the official key and are asked by their levels; each generator counted again from its own picture');
}
