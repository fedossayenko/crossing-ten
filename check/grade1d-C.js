// Runs beside the app (in check.js's own scope, through eval), like check/grade1.js.
// МБГ Полуфинал 2022 and 2023, 1 клас — the kinds segword, rectfig, segcount, countsq, pencil, seg, blind and weekday:
// each printed task against the official key, drawn as printed and asked by its level's own generator, then the
// new shapes worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const tag = name => name.includes('2022') ? 'mbg-semifinal-2022-1' : 'mbg-semifinal-2023-1';
  // the printed task: the key, the drawing (its pieces, in order), the paper's tag, and the level asking exactly it —
  // or, with sig, the same question with other numbers where the paper leaves a number out (recorded as that, not
  // as the printed one)
  const pin = (name, id, q, key, shows, sig) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error(name + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error(name + ': the key is not accepted');
    const text = strip(Q.drawQ(q));
    [].concat(shows).reduce((at, s) => { const k = text.indexOf(s.replace(/\s+/g, ''), at); if(k < 0) throw new Error(name + ' is not drawn as printed: ' + text); return k + 1; }, 0);
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag(name))) throw new Error('level ' + id + ' is not tagged ' + name);
    const s = sig || JSON.stringify, want = s(q);
    if(pinSeed(name, () => Q.raw(id), g => s(g) !== want ? 0 : sig ? 1 : 2)) return;
    throw new Error(name + ': level ' + id + ' never asks the printed question');
  };
  // the paper gives no length of a bar, only how far each passes the next: the same two steps, any bars
  pin('Полуфинал 2022 task 16', 176, {kind:'segword', shape:'bars', c:3, d1:8, d2:4, traps:[8, 4], ans:12}, [12],
    ['Кое е числото, което трябва да поставим вместо „?“?', '8 см', '4 см', '? см'], g => g.shape + ':' + g.d1 + ':' + g.d2);
  pin('Полуфинал 2022 task 14', 228, {kind:'segcount', shape:'ex', n:4, S:6, list:true, traps:[3, 3], ans:6}, [6], ['Тук са 3 отсечки: AB, AC и BC', 'Колко са отсечките тук?']);
  pin('Полуфинал 2023 task 14', 228, {kind:'segcount', shape:'ex', n:4, S:6, list:false, traps:[3, 3], ans:6}, [6], ['Тук са 3 отсечки.', 'Колко са отсечките тук?']);
  pin('Полуфинал 2022 task 15', 229, {kind:'countsq', shape:'strip', cells:[[0,0],[0,1],[1,0],[1,1],[2,0],[2,1],[3,0],[3,1],[4,0],[4,1]], sizes:[10, 4], traps:[10, 12], ans:14}, [14],
    'Фигурата е образувана от 10 еднакви малки квадратчета. Колко са всичките квадрати на фигурата?');
  pin('Полуфинал 2023 task 12', 210, {kind:'rectfig', shape:'bare', tiles:[[0,0,1,1],[1,0,1,1],[2,0,1,1],[3,0,1,1]], traps:[4, 7], ans:10}, [10], 'Колко са правоъгълниците?');
  // «Посочете всички възможни отговори!»: the key takes 4 and also 5, all the pens
  pin('Полуфинал 2022 task 13', 189, {kind:'blind', shape:'one', cols:[0, 1], n:[2, 3], T:5, slots:2, ans:4, alt:[5]}, [4, 5],
    'От пет еднакви по размер и цвят химикала два пишат в синьо, а три в червено. Колко химикала трябва да взема, за да съм сигурен, че един от тях пише в синьо? Посочете всички възможни отговори!');
  pin('Полуфинал 2023 task 20', 191, {kind:'weekday', shape:'back', mon: Q.MONTHS.find(m => m[0] === 'април'), d1: Q.DAYS[5], day: Q.DAYS[5], L:29, first:1, ask:0, traps:[4, 4], ans:5}, [5],
    'Последната събота на април е на 29-ти. Колко са всички съботи през този месец?');
  pin('Полуфинал 2023 task 11', 161, {kind:'pencil', shape:'one', a:3, b:11, ref:9, long:false, traps:[2], ans:1}, [1], 'С колко сантиметра този молив е по-къс от молив с дължина 9 см?');
  pin('Полуфинал 2023 task 13', 163, {kind:'seg', mm:false, p:3, q:1, r:4, AB:4, CD:5, ans:8}, [8], 'AD = ? см A C B D AB = 4 см CD = 5 см CB = 1 см');

  const DATE = {24:'ти', 25:'ти', 26:'ти', 27:'ми', 28:'ми', 29:'ти', 30:'ти', 31:'ви'};   // 24-ти … 27-ми, 28-ми … 31-ви
  for(let i = 0; i < 3000; i++){
    // 176, the bars: measured off the drawing — the top one passes the middle one by d1 squares, the middle one the
    // bottom one by d2, and the dotted line runs from the bottom one's end to the top one's
    let b = Q.raw(176); while(b.shape !== 'bars') b = Q.raw(176);
    const svg = Q.drawQ(b), u = 12, bars = [...svg.matchAll(/d="M([\d.]+) [\d.]+H([\d.]+)" stroke="var\(--bad\)" stroke-width="3.5"/g)].map(m => (+m[2] - +m[1]) / u);
    const dot = svg.match(/d="M([\d.]+) [\d.]+H([\d.]+)" stroke="var\(--bad\)" stroke-width="2.5" stroke-dasharray/);
    if(bars.length !== 3 || bars[0] - bars[1] !== b.d1 || bars[1] - bars[2] !== b.d2 || !dot || (+dot[2] - +dot[1]) / u !== b.ans || bars[0] - bars[2] !== b.ans) fail('segword bars: ' + bars, b);
    if(b.d1 < 5 || b.d1 > 9 || b.d2 < 3 || b.d2 > 8 || b.ans > 20) fail('segword bars: out of the paper\'s range', b);
    // 228: every two points make a segment; the example says its own number and lists exactly its own pairs, and
    // both lines of points are drawn
    const e = Q.raw(228), ask = Q.drawQ(e).split('</div>')[0].replace(/<[^>]*>/g, ''), pairs = [];
    for(let x = 0; x < e.n; x++) for(let y = x + 1; y < e.n; y++) pairs.push('ABCDEF'[x] + 'ABCDEF'[y]);
    const ex = pairs.filter(p => !p.includes('ABCDEF'[e.n - 1])), listed = ask.match(/\b[A-F]{2}\b/g) || [];
    if(pairs.length !== e.ans || e.n < 4 || e.n > 6 || !strip(ask).includes('Тукса' + ex.length + 'отсечки') || listed.join() !== (e.list ? ex.join() : '') ||
       (Q.drawQ(e).match(/<circle/g) || []).length !== 2*e.n - 1) fail('segcount ex: ' + pairs.length, e);
    // 229: every square of every size at every place; two rows of n make 3n − 1, three rows of three 14
    const s = Q.raw(229), set = new Set(s.cells.map(([x, y]) => x + ',' + y)), W = Math.max(...s.cells.map(c => c[0])) + 1, H = Math.max(...s.cells.map(c => c[1])) + 1;
    let sq = 0;
    for(let k = 1; k <= 5; k++) s.cells.forEach(([x, y]) => { let ok = true; for(let a = 0; a < k; a++) for(let c = 0; c < k; c++) ok = ok && set.has((x + a) + ',' + (y + c)); if(ok) sq++; });
    if(sq !== s.ans || s.cells.length !== W*H || !(H === 2 && W >= 3 && W <= 6 && sq === 3*W - 1 || H === 3 && W === 3 && sq === 14) || !strip(Q.drawQ(s)).includes('от' + W*H + 'еднаквималкиквадратчета')) fail('countsq strip: ' + sq, s);
    // 210 with no example: every rectangle of the row by its two ends, one figure and no example shown
    let r = Q.raw(210); while(r.shape !== 'bare') r = Q.raw(210);
    let rc = 0; for(let x1 = 0; x1 < r.tiles.length; x1++) for(let x2 = x1 + 1; x2 <= r.tiles.length; x2++) rc++;
    if(rc !== r.ans || r.tiles.length < 3 || r.tiles.length > 5 || (Q.drawQ(r).match(/<svg/g) || []).length !== 1 || strip(Q.drawQ(r)).includes('има')) fail('rectfig bare: ' + rc, r);
    // 189, the pens: every hand of every size tried — a size is sure when no hand of it misses the ink asked for
    // (the first n[0] pens write in it); a box for each sure size, and the pens drawn all alike
    let p = Q.raw(189); while(p.shape !== 'one') p = Q.raw(189);
    const sure = [];
    for(let m = 1; m <= p.T; m++){
      let ok = true;
      for(let mask = 0; mask < 1 << p.T && ok; mask++){ let size = 0, hit = false; for(let j = 0; j < p.T; j++) if(mask >> j & 1){ size++; if(j < p.n[0]) hit = true; } if(size === m && !hit) ok = false; }
      if(ok) sure.push(m);
    }
    const caps = [...Q.drawQ(p).matchAll(/<rect [^>]*height="16" rx="3" fill="([^"]+)"/g)].map(m => m[1]);
    if(sure.join() !== Q.answers(p).join() || p.slots !== sure.length || (Q.drawQ(p).match(/class="slot"/g) || []).length !== sure.length || p.T !== p.n[0] + p.n[1] || p.T > 7 || p.cols[0] === p.cols[1]) fail('blind one: ' + sure, p);
    if(caps.length !== p.T || new Set(caps).size !== 1) fail('blind one: the pens are not drawn alike', p);
    // 191 back from the last one: the month walked from its 1st, a day at a time, and the asked weekday's dates kept
    let w = Q.raw(191); while(w.shape !== 'back') w = Q.raw(191);
    const c0 = Q.DAYS.indexOf(w.d1), want = Q.DAYS.indexOf(w.day), dates = [];
    for(let d = 1; d <= w.mon[1]; d++) if((c0 + d - 1) % 7 === want) dates.push(d);
    if(dates[dates.length - 1] !== w.L || (w.ask ? dates[0] : dates.length) !== w.ans || (!w.ask && w.ans !== (w.L <= 28 ? 4 : 5)) || !strip(Q.drawQ(w)).includes('ена' + w.L + '-' + DATE[w.L] + '.')) fail('weekday back: ' + dates, w);
  }
  console.log('МБГ Полуфинал 2022 and 2023, 1 клас: 2022 tasks 13, 14, 15 and 2023 tasks 11, 12, 13, 14, 20 match the key and their levels ask them exactly, 2022 16 as the same two steps on other bars; the bars measured, the segments, squares and rectangles counted, every hand of pens and every day of the month tried again');
}
