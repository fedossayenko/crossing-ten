// Self-check for the question generators. Run: node check.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/index.html', 'utf8');
const read = f => fs.readFileSync(__dirname + '/' + f, 'utf8');
// The scripts, in the order the page loads them; app.js and sync.js are the page itself and need a DOM.
const scripts = [...src.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const js = scripts.map(read).join('\n');
const head = `
const RAND = Math.random; let RANDS = 0; Math.random = () => (RANDS++, RAND());   // counts every random draw
const localStorage = undefined;   // no browser storage here: players.js falls back to one player
let W = {max:1, m:{}};
const LOCAL = {mix:[1,2,4,5], plain:true};
function factKey(q){ return q.kind ? 'w:'+q.kind : q.op+':'+(q.a%10)+'-'+(q.b%10); }
`;
const body = scripts.filter(f => !['js/app.js', 'js/compete.js', 'js/sync.js'].includes(f)).map(read).join('\n');
const test = `
const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
const lastNum = t => { const m = strip(t).match(/\\d+/g); return m ? +m[m.length-1] : NaN; };
let checked = 0; const kinds = {};
// Ukrainian task text must be complete: Bulgarian-only words or letters left in it mean a
// piece was missed (a text made only of shared words such as "5 см" is fine as it is).
const BG_ONLY = new Set(('и е са от колко сбор сбора сборът сбори числата числото цифрите които която който което това тези още какво ' +
  'трябва всеки всяка всяко всички между една един едно има няма със във ако или пресметнете пресметни намерете намери ' +
  'запишете запиши разликата разлика когато тогава защото пъти дни ден седмица месец кога отговор отговора ' +
  'получи получаваме остава останаха прибавяме изваждаме събираме значи тук само също').split(' '));
const SAME = new Set('см дм м мм кг г л хв а в на не за до'.split(' '));
const words = h => strip(h).replace(/&[a-z]+;/g, ' ').toLowerCase().match(/[а-яёїієґъѝ’'-]+/g) || [];
function inUkrainian(L, q, bgTexts){
  const r0 = RANDS;
  LANG = 'uk';
  const uk = [drawQ(q), eqText(q), why(q, true), why(q, false)];
  LANG = 'bg';
  if(RANDS !== r0) throw new Error('level ' + L + ': drawing the question in Ukrainian drew a random number');
  uk.forEach((u, j) => {
    const bad = words(u).filter(w => /[ъѝыэё]/.test(w) || /^(най|по)-/.test(w) || BG_ONLY.has(w));
    if(bad.length) throw new Error('level ' + L + ': Bulgarian left in the Ukrainian text (' + bad.join(', ') + '): ' + strip(u));
    if(u === bgTexts[j] && !words(u).every(w => SAME.has(w))) throw new Error('level ' + L + ': a text is not translated: ' + strip(u));
  });
  return uk;
}
const IDS = [1,2,7,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,95,96,97,98];
for(const L of IDS){
  for(let i = 0; i < 3000; i++){
    const q = raw(L), ans = answer(q);
    if(L >= 8 && !q.kind) throw new Error('level ' + L + ' is not handled by raw() — it fell through to Mixed');
    if(!Number.isInteger(ans) || ans < 0) throw new Error('level ' + L + ' bad answer ' + JSON.stringify(q));
    if(!q.kind && (q.op === '-' ? q.a-q.b : q.a+q.b) !== ans) throw new Error('level ' + L + ' arithmetic mismatch');
    if(q.kind){
      kinds[q.kind] = (kinds[q.kind]||0) + 1;
      const ok = [ans].concat(q.alt || []);
      const r0 = RANDS, bg = [drawQ(q), eqText(q), why(q, true), why(q, false)];
      if(RANDS !== r0) throw new Error('level ' + L + ': drawing a question drew a random number');
      // the same rules in both languages: the worked line and summary end on the answer,
      // and the first-miss nudge never gives it away
      [['', bg], [' (Ukrainian)', inUkrainian(L, q, bg)]].forEach(([lang, [, eq, full, nudge]]) => {
        if(ok.indexOf(lastNum(full)) < 0) throw new Error('level ' + L + lang + ': worked line lands on ' + lastNum(full) + ', answer is ' + ans + ' -- ' + JSON.stringify(q));
        if(ok.indexOf(lastNum(eq)) < 0) throw new Error('level ' + L + lang + ': summary line lands on ' + lastNum(eq) + ', answer is ' + ans);
        const nums = (strip(nudge).match(/\\d+/g) || []).map(Number);
        if(nums.some(v => ok.indexOf(v) >= 0)) throw new Error('level ' + L + lang + ': the first-miss nudge gives away the answer');
      });
    }
    const boxes = (drawQ(q).match(/class="slot"/g) || []).length;
    if(boxes !== (q.slots || 1)) throw new Error('level ' + L + ' draws ' + boxes + ' answer boxes but wants ' + (q.slots || 1));
    LANG = 'uk'; const ukBoxes = (drawQ(q).match(/class="slot"/g) || []).length; LANG = 'bg';
    if(ukBoxes !== boxes) throw new Error('level ' + L + ' draws ' + ukBoxes + ' answer boxes in Ukrainian, ' + boxes + ' in Bulgarian');
    if((q.alt || []).length && !q.slots) throw new Error('level ' + L + ' has alternatives but only one box');
    checked++;
  }
}
console.log('checked ' + checked + ' questions across ' + IDS.length + ' levels: arithmetic, worked line, summary line and layout all agree, in Bulgarian and in Ukrainian');
console.log('Ukrainian: every worksheet text is translated, none left in Bulgarian, and drawing a question never draws a random number');
console.log('worksheet kinds:', JSON.stringify(kinds));
console.log('80 - 9 ->', answer({a:80,b:9,op:'-'}), '| hint:', strip(why({a:80,b:9,op:'-'}, true)));

// answer matching, including the two-box questions
const one = {kind:'t', ans:7}, two = {kind:'t', ans:18, alt:[14], slots:2};
[[one,['7'],true],[one,['8'],false],[one,['07'],true],
 [two,['14','18'],true],[two,['18','14'],true],[two,['14','14'],false],
 [two,['18','18'],false],[two,['14','15'],false],[two,['14'],false],[two,['14','18','9'],false]
].forEach(([q,parts,want]) => {
  if(accepts(q, parts) !== want) throw new Error('accepts(' + JSON.stringify(parts) + ') should be ' + want);
});
console.log('answer matching: order-free, no duplicates, every box required');

// задача 13: check the closed form against an actual count of every rectangle
let grids = 0;
for(let W = 1; W <= 6; W++) for(let H = 1; H <= 6; H++)
  for(let c = 1; c <= W; c++) for(let r = 1; r <= H; r++){
    let brute = 0;
    for(let x1 = 0; x1 < W; x1++) for(let x2 = x1+1; x2 <= W; x2++)
      for(let y1 = 0; y1 < H; y1++) for(let y2 = y1+1; y2 <= H; y2++)
        if(x1 <= c-1 && x2 >= c && y1 <= r-1 && y2 >= r) brute++;
    const formula = c*(W-c+1)*r*(H-r+1);
    if(brute !== formula) throw new Error('grid ' + W + 'x' + H + ' ant at ' + c + ',' + r + ': counted ' + brute + ', formula says ' + formula);
    grids++;
  }
console.log('rectangle counting: closed form matches a brute-force count in all ' + grids + ' grid/ant positions');

// the drawings must be well-formed and theme-aware
for(const L of [19, 21, 28, 29, 34, 40]){
  for(let i = 0; i < 300; i++){
    const svg = drawQ(raw(L));
    const open = (svg.match(/<g[ >]/g) || []).length, close = (svg.match(/<\\/g>/g) || []).length;
    if(open !== close) throw new Error('level ' + L + ': ' + open + ' <g> open, ' + close + ' closed');
    if(!/<svg[^>]*viewBox=/.test(svg)) throw new Error('level ' + L + ': figure has no viewBox');
    if(/(fill|stroke)="#/.test(svg)) throw new Error('level ' + L + ': figure hard-codes a colour instead of a theme token');
  }
}
console.log('figures: balanced, scaled to a viewBox, coloured only from theme tokens');

// задача 16: every generated cut must be a triangle that could actually exist
let cutShapes = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(22);
  if(q.shape === 1){                       // a triangle cut off a square along one side
    cutShapes++;
    if(q.P !== 4*q.c) throw new Error('square perimeter is not four sides');
    if(q.p <= 2*q.c) throw new Error('a triangle of ' + q.p + ' cannot sit on a side of ' + q.c);
    if(q.ans !== q.P - q.c + (q.p - q.c)) throw new Error('cut-square perimeter wrong: ' + JSON.stringify(q));
    continue;
  }
  if(q.shape === 2){                       // a square with a rectangle standing on it
    // the tall rectangle beats the wide one by the square's two upright sides, whatever the height on top
    const big = 2*(q.a + q.a + q.h), small = 2*(q.a + q.h);
    if(big - small !== q.d) throw new Error('the stated difference is not the one the figure gives');
    if(q.ans !== 4*q.a) throw new Error('the square perimeter is not four sides');
    continue;
  }
  const d = q.ans;
  if(q.p1 + q.p2 !== q.P + 2*d) throw new Error('perimeters do not add up: ' + JSON.stringify(q));
  if(q.p1 <= 2*d || q.p2 <= 2*d) throw new Error('half with perimeter ' + Math.min(q.p1,q.p2) + ' cannot hold a cut of ' + d);
}
if(!cutShapes) throw new Error('the square-and-triangle shape never turned up');
console.log('shared edges: split triangles add up, and a triangle cut off a square keeps a possible shape');

// задача 20: the closed form must match an exhaustive search over the final counts
for(let i = 0; i < 2000; i++){
  const q = raw(37);
  let best = Infinity;
  for(let W = 0; W <= 40; W++) for(let D = 0; D <= 40; D++){
    if(W < q.wo || W < q.bs || D < q.ws || W + D < q.bc) continue;
    best = Math.min(best, (W-q.wo) + (D-q.ws) + (W-q.bs) + (W+D-q.bc));
  }
  if(best !== q.ans) throw new Error('shapes puzzle: search says ' + best + ', answer says ' + q.ans);
  const drawn = { wo:0, ws:0, bs:0, bc:0 };
  q.row.forEach(t => drawn[t]++);
  if(drawn.wo !== q.wo || drawn.ws !== q.ws || drawn.bs !== q.bs || drawn.bc !== q.bc)
    throw new Error('the drawn row does not match the counts the answer assumes');
}
{ // the worksheet's own row: ○ ■ ● ○ ■ □ ■
  let best = Infinity;
  for(let W = 0; W <= 40; W++) for(let D = 0; D <= 40; D++){
    if(W < 2 || W < 3 || D < 1 || W + D < 1) continue;
    best = Math.min(best, (W-2) + (D-1) + (W-3) + (W+D-1));
  }
  if(best !== 4) throw new Error('worksheet instance of задача 20 should be 4');
}
console.log('shapes puzzle: matches an exhaustive search, the row matches the counts, worksheet instance gives 4');

// задача 17: the smallest sum really is the k smallest distinct numbers
for(let i = 0; i < 3000; i++){
  const q = raw(13);
  if(q.shape !== 2) continue;
  const pool = [];
  for(let v = q.two ? 10 : 0; v <= (q.two ? 99 : 9); v++) pool.push(v);
  pool.sort((a, b) => q.small ? a - b : b - a);
  const want = pool.slice(0, q.k).reduce((t, v) => t + v, 0);
  if(want !== q.ans) throw new Error('extreme sum wrong: ' + JSON.stringify(q));
  if(new Set(q.list).size !== q.k) throw new Error('the chosen numbers must be different');
}
console.log('extreme sums: taking the k smallest or largest distinct numbers gives the stated total');

// pairs making twenty, and an answer of nothing
let twenties = 0, zeros = 0;
for(let i = 0; i < 8000; i++){
  const q = raw(9);
  if(q.shape !== 'tens' || q.base !== 20) continue;
  twenties++;
  if(q.ans === 0) zeros++;
  for(let k = 0; k < q.paired*2; k += 2)
    if(q.terms[k].n + q.terms[k+1].n !== 20)
      throw new Error('pair ' + q.terms[k].n + ' + ' + q.terms[k+1].n + ' does not make twenty');
  const run = q.terms.reduce((t, x, k) => k === 0 ? x.n : t + (x.op === '+' ? x.n : -x.n), 0);
  if(run !== q.ans) throw new Error('twenty-chain does not evaluate to its answer');
}
if(!twenties) throw new Error('the twenty-pair shape never turned up');
if(!zeros) throw new Error('an answer of zero never turned up');
if(!accepts({kind:'t', ans:0}, ['0'])) throw new Error('an answer of zero must be accepted');
if(accepts({kind:'t', ans:0}, [''])) throw new Error('an empty box must not count as zero');
console.log('twenty-pairs: every pair makes twenty, zero turns up as an answer and is accepted');

// the two new comparison shapes
let sh1 = 0, sh2 = 0, sh3 = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(10);
  if(q.shape === 3){
    sh3++;
    const sum = a => a.reduce((t, v) => t + v, 0);
    if(q.L.length !== q.R.length) throw new Error('term-by-term sums must line up');
    if(sum(q.L) - sum(q.R) !== q.ans || q.ans < 1) throw new Error('term-by-term answer wrong: ' + JSON.stringify(q));
    if(q.L.concat(q.R).some(v => v < 1)) throw new Error('a term dropped below one');
    const flat = q.L.filter((v, k) => v === q.R[k]).length;
    if(q.tens){
      // задача 8: whole tens, and exactly one term shared — that one cancels on sight
      if(flat !== 1) throw new Error('the round-tens comparison wants exactly one shared term, got ' + flat);
      if(q.L.concat(q.R).some(v => v % 10)) throw new Error('these should all be round tens');
    } else if(flat) throw new Error('a pair with nothing to say between it');
    if(!q.L.some((v, k) => Math.abs(v - q.R[k]) >= 10)) throw new Error('no pair carries a ten, so nothing is worth spotting');
  }
  if(q.shape === 1){
    sh1++;
    const total = q.terms.reduce((t, v) => t + v, 0), keptSum = q.kept.reduce((t, v) => t + v, 0);
    if(total - keptSum !== q.ans) throw new Error('cancelling comparison: leftovers do not match');
    if(q.kept.length < 2) throw new Error('the smaller sum needs at least two terms');
    if(q.gone.reduce((t, v) => t + v, 0) !== q.ans) throw new Error('dropped terms do not add to the answer');
  }
  if(q.shape === 2){
    sh2++;
    if(q.S !== q.x + q.y || q.D !== q.p - q.q) throw new Error('sum or difference computed wrong');
    if(Math.abs(q.D - q.S) !== q.ans || q.ans < 1) throw new Error('sum-against-difference answer wrong');
    if(q.less !== (q.D > q.S)) throw new Error('the wording does not match which side is bigger');
  }
}
if(!sh1 || !sh2 || !sh3) throw new Error('all three comparison shapes should turn up: ' + sh1 + ', ' + sh2 + ', ' + sh3);
// задача 3 and задача 4 as printed
if(lastNum(why({kind:'cmp', shape:3, L:[1,8,21], R:[2,7,11], ans:10, flip:false}, true)) !== 10)
  throw new Error('1+8+21 against 2+7+11 should come out 10');
if(lastNum(why({kind:'cmp', shape:2, x:15, y:25, p:60, q:10, S:40, D:50, less:true, ans:10}, true)) !== 10)
  throw new Error('15+25 against 60-10 should come out 10');
console.log('comparisons: cancelling, term-by-term and sum-against-difference all hold, and the wording follows the numbers');

// задача 1: a chain whose middle numbers are taken away and put straight back
let cancels = 0, stepped = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(9);
  if(q.shape !== 'cancel') continue;
  cancels++;
  let run = q.terms[0].n;
  q.terms.slice(1).forEach(t => { run += t.op === '+' ? t.n : -t.n; if(run < 0) throw new Error('chain dips below zero'); });
  if(run !== q.ans) throw new Error('cancelling chain: left-to-right gives ' + run + ', answer says ' + q.ans);
  if(q.start - q.last !== q.ans) throw new Error('the collapsed form disagrees with the walk');
  const plus = q.terms.filter(t => t.op === '+').map(t => t.n);
  const minus = q.terms.filter(t => t.op === '−').map(t => t.n);
  if(plus.length !== minus.length - 1) throw new Error('every middle number needs both its signs, and only the last one stands alone');
  if(plus.some((n, k) => n !== minus[k])) throw new Error('a returned number does not match the one taken away');
  if(new Set(minus).size !== minus.length) throw new Error('the same number turns up twice as a subtrahend');
  if(q.terms.every((t, k) => k < 2 || t.n === q.terms[k-2].n - 1)) stepped++;
}
if(!cancels || !stepped) throw new Error('cancelling chains, and the stepping-down shape, should both turn up');
{ // the worksheet instance: 9 − 8 + 8 − 7 + 7 − 6 + 6 − 5
  const terms = [{op:'', n:9}];
  [8,7,6,5].forEach((n, i) => { terms.push({op:'−', n}); if(i < 3) terms.push({op:'+', n}); });
  const q = {kind:'pairs', shape:'cancel', terms, start:9, last:5, ans:4};
  if(lastNum(why(q, true)) !== 4) throw new Error('9-8+8-7+7-6+6-5 should come out 4');
}
console.log('cancelling chains: the walk and the collapsed form agree, worksheet instance gives 4');

// задача 2: two unknowns, one in each given
let twos = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(11);
  if(q.shape !== 'two') continue;
  twos++;
  if(q.sq + q.tri !== q.ans) throw new Error('the two unknowns do not add to the answer');
  if([q.sq, q.tri, q.p, q.r].some(v => v < 1 || v > 9)) throw new Error('a value left the single digits');
  const shown = strip(drawQ(q));
  if(shown.indexOf(String(q.p + q.tri)) < 0 || shown.indexOf(String(q.r + q.sq)) < 0)
    throw new Error('a given total is missing from the question');
  if(shown.split('■').length !== 4 || shown.split('□').length !== 4)
    throw new Error('each symbol should appear in the ask, in a given and in the answer line');
}
if(!twos) throw new Error('the two-unknown shape should turn up');
if(lastNum(why({kind:'box', shape:'two', p:5, r:4, tri:3, sq:5, ans:8}, true)) !== 8)
  throw new Error('5+box=8 with 4+box=9 should come out 8');
console.log('two unknowns: each given fixes one symbol, worksheet instance gives 8');

// the circle level now reaches every start from 7 to 20
{
  const starts = new Set();
  for(let i = 0; i < 4000; i++) starts.add(raw(11).a);
  for(const want of [7, 11, 13, 17, 19, 20])
    if(!starts.has(want)) throw new Error('the circle level never starts from ' + want);
}
console.log('circle level: the first number reaches every value from 7 to 20');

// "естествени" excludes zero, which changes a count but never a sum
let nat = 0, withZero = 0, twoDig = 0, named = 0, sets = 0;
for(let i = 0; i < 8000; i++){
  const q = raw(12);
  const txt = drawQ(q);
  if(q.set){                                  // задача 3: the different digits in a list
    sets++;
    const pool = [...new Set(q.list)].sort((a, b) => a - b);
    if(String(pool) !== String(q.pool)) throw new Error('the set of different digits is wrong');
    if(q.list.length <= pool.length) throw new Error('a list with no repeat teaches nothing');
    if(q.ans !== (q.asksSum ? pool.reduce((t, v) => t + v, 0) : pool.length))
      throw new Error('the answer is not the one asked for');
    if(q.list.some(v => v < 0 || v > 9)) throw new Error('these should all be single digits');
    continue;
  }
  if(q.name){                                 // задача 9: the two numbers themselves, not how many
    named++;
    if(q.hi !== q.lo + 1) throw new Error('naming the numbers only works when exactly two fit');
    if(q.lo !== q.a + 1 || q.hi !== q.b - 1) throw new Error('the ends must not be counted');
    if(q.ans !== q.lo || String(q.alt) !== String([q.hi])) throw new Error('the two answers are not the two numbers');
    if((txt.match(/class="slot"/g) || []).length !== 2) throw new Error('two numbers need two boxes');
    continue;
  }
  if(q.natural){ nat++; if(q.lo < 1) throw new Error('естествени must start at one, got ' + q.lo); }
  else if(q.lo === 0) withZero++;
  if(q.two){ twoDig++; if(q.lo < 10) throw new Error('двуцифрени must start at ten, got ' + q.lo); }
  let want = 0;
  for(let v = q.lo; v <= q.hi; v++) want += q.sum ? v : 1;
  if(want !== q.ans) throw new Error('range ' + q.lo + '..' + q.hi + (q.sum ? ' sum' : ' count') + ' should be ' + want);
  if(q.natural !== /естествен/.test(txt)) throw new Error('the wording does not say which numbers are meant');
  if(q.two !== /двуцифрен/.test(txt)) throw new Error('the wording does not say the numbers are two-digit');
}
if(!nat || !withZero || !twoDig || !named || !sets)
  throw new Error('all five wordings should turn up: ' + [nat, withZero, twoDig, named, sets].join(', '));
{ // задача 3 as printed
  const list = [3,1,4,1,5,9,2,6,5,3,5];
  const q = {kind:'count', shape:5, set:1, list, pool:[1,2,3,4,5,6,9], asksSum:false, ans:7};
  if(lastNum(why(q, true)) !== 7) throw new Error('that list holds seven different digits');
}
{ // задача 7 and 9 as printed
  const q7 = {kind:'count', shape:1, sum:false, natural:false, two:true, n:33, lo:10, hi:32, ans:23};
  if(lastNum(why(q7, true)) !== 23) throw new Error('the two-digit numbers under 33 should be 23');
  const q9 = {kind:'count', shape:4, name:1, sum:false, natural:false, two:false,
              a:12, b:15, lo:13, hi:14, slots:2, ans:13, alt:[14]};
  if(lastNum(why(q9, true)) !== 14) throw new Error('between 12 and 15 the numbers are 13 and 14');
}
console.log('ranges: естествени, двуцифрени and naming the two all hold, worksheet instances give 23, and 13 and 14');

// the inequality asked as a sum
let asked = 0;
for(let i = 0; i < 8000; i++){
  const q = raw(16);
  if(!q.asksSum) continue;
  asked++;
  let want = 0, n = 0;
  for(let d = 0; d <= 9; d++) if(d + q.C <= q.L){ want += d; n++; }
  if(want !== q.ans) throw new Error('sum of the values that fit should be ' + want + ', got ' + q.ans);
  if(n < 3) throw new Error('too few values to make a sum worth asking');
}
if(!asked) throw new Error('the sum variant of the inequality never turned up');
console.log('inequality as a sum: adds up exactly the values that satisfy it');

{ // задача 7 as printed: 22 − 14 < ? + 7, counting what makes it false
  const q = {kind:'ineq', shape:0, A:22, B:14, L:8, C:7, ans:2};
  if(lastNum(why(q, true)) !== 2) throw new Error('22 - 14 < ? + 7 should be false for 2 digits');
  if(strip(drawQ(q)).replace('&lt;', '<').indexOf('22 − 14 < ? + 7') < 0) throw new Error('the printed statement is not the one drawn');
  let widest = 0;
  for(let i = 0; i < 4000; i++) widest = Math.max(widest, raw(16).C);
  if(widest < 7) throw new Error('the number added to ? never reaches 7');
}
console.log('inequality: the printed statement reads back the same, and ? + 7 is reachable');

{ // задача 5 as printed: the естествени numbers under 10 and over 7
  const q = {kind:'count', sum:false, shape:4, natural:true, a:7, b:10, lo:8, hi:9, ans:2};
  if(lastNum(why(q, true)) !== 2) throw new Error('естествени under 10 and over 7 should be 2');
  if(strip(drawQ(q)).indexOf('по-малки от 10 и са по-големи от 7') < 0) throw new Error('задача 5 wording lost');
  let top = 0;
  for(let i = 0; i < 4000; i++){ const g = raw(12); if(g.shape >= 3) top = Math.max(top, g.a); }
  if(top < 7) throw new Error('the open-ended range never starts as high as 7');
}
console.log('ranges: the two-sided wording reaches into the teens, worksheet instance gives 2');

{ // задача 6 as printed: box - 20, given 20 + box = 60
  const q = {kind:'box', shape:'plus', g:20, p:20, box:40, S:60, ans:20};
  if(lastNum(why(q, true)) !== 20) throw new Error('20 + box = 60 then box - 20 should be 20');
  const shown = strip(drawQ(q));
  if(shown.indexOf('20 + ■ = 60') < 0) throw new Error('the given is not drawn as printed');
  let seen = 0;
  for(let i = 0; i < 6000; i++){
    const g = raw(11);
    if(g.shape !== 'plus') continue;
    seen++;
    if(g.g + g.box !== g.S) throw new Error('the given addition does not hold');
    if(g.box - g.p !== g.ans || g.ans < 10) throw new Error('the second step leaves nothing to work out');
    if([g.g, g.p, g.box].some(v => v % 10)) throw new Error('these should all be round tens');
  }
  if(!seen) throw new Error('the addition shape should turn up');
}
console.log('unknown from an addition: the given holds and the second step is worth taking, worksheet instance gives 20');

// the pencils, where one clue is a negative
for(let i = 0; i < 4000; i++){
  const q = raw(38);
  if(q.shape === 'gave') continue;             // задача 10 has two colours, and is checked below
  if(q.a + q.b + q.c !== q.T) throw new Error('the three colours do not add to the total');
  if(q.notA !== q.T - q.a) throw new Error('"not the first colour" is not the rest of them');
  if(q.ans !== q.notA - q.b || q.ans < 1) throw new Error('pencil answer wrong');
  if(new Set(q.col.map(c => c[0])).size !== 3) throw new Error('the three colours must differ');
}
{ // задача 8 as printed: 21 pencils, 18 not green, 7 yellow
  const col = [['зелени','зелен'], ['жълти','жълт'], ['сини','син']];
  const q = {kind:'pencils', who:'Алекс', col, a:3, b:7, c:11, T:21, notA:18, ans:11};
  if(lastNum(why(q, true)) !== 11) throw new Error('21 pencils, 18 not green, 7 yellow should leave 11 blue');
  let widest = 0;
  for(let i = 0; i < 4000; i++) widest = Math.max(widest, raw(38).ans);
  if(widest < 11) throw new Error('the leftover colour never reaches the teens, so задача 8 cannot come up');
}
console.log('pencils: the colours add up, the negative clue is the rest, worksheet instance gives 11 blue');

// задача 20: the compact pivot scan must agree with a plain double loop
for(let i = 0; i < 4000; i++){
  const q = raw(26);
  const naive = [];
  for(let k = 0; k < q.a.length; k++){
    let ok = true;
    for(let j = 0; j < k; j++) if(q.a[j] >= q.a[k]) ok = false;
    for(let j = k+1; j < q.a.length; j++) if(q.a[j] <= q.a[k]) ok = false;
    if(ok) naive.push(q.a[k]);
  }
  if(naive.join() !== q.hits.join() || naive.length !== q.ans)
    throw new Error('sequence ' + q.a.join(',') + ': scan says ' + q.hits.join(',') + ', double loop says ' + naive.join(','));
  if(q.a.slice().sort((x,y) => x-y).join() !== q.a.map((_,k) => k+1).join())
    throw new Error('sequence is not a permutation: ' + q.a.join(','));
}
console.log('sequence scan: matches a plain double loop, and every run is a permutation');

// задача 17: the digits must actually satisfy the equation, and stay different
for(let i = 0; i < 4000; i++){
  const q = raw(23);
  if(q.N - q.k !== q.R) throw new Error('placeholder equation does not hold: ' + JSON.stringify(q));
  if(q.t === q.u) throw new Error('placeholder digits must differ: ' + JSON.stringify(q));
  if(10*q.t + q.u !== q.N) throw new Error('placeholder digits do not form the number');
  const want = q.shape === 0 ? 10*q.a + q.t - q.u : 10*q.u + q.t - q.a;
  if(want !== q.ans) throw new Error('placeholder answer wrong: ' + JSON.stringify(q));
}
// the worksheet's own instance
{
  const q = {kind:'place', t:9, u:7, N:97, k:9, R:88, a:2, shape:0, ans:22};
  if(10*q.a + q.t - q.u !== 22) throw new Error('worksheet instance of задача 17 should be 22');
}
console.log('digit placeholders: equation holds, digits differ, worksheet instance gives 22');

// задача 2: the grouping chains must actually evaluate to their stated answer, and a
// two-subtrahend chain must lead with a two-digit one or the grouping is not worth spotting
let tens = 0, subs2 = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(9);
  const run = q.terms.reduce((t, x, k) => k === 0 ? x.n : t + (x.op === '+' ? x.n : -x.n), 0);
  if(run !== q.ans) throw new Error('grouping chain ' + q.terms.map(x => x.op + x.n).join(' ') + ' is not ' + q.ans);
  if(q.ans < 0) throw new Error('grouping chain goes below zero');
  if(q.shape === 'tens'){
    tens++;
    if(q.subs.length === 2){ subs2++; if(q.subs[0] < 10) throw new Error('two-subtrahend chain leads with ' + q.subs[0]); }
  }
}
if(!subs2 || subs2 === tens) throw new Error('both endings should turn up: ' + subs2 + ' of ' + tens);
console.log('grouping chains: evaluate correctly, both endings appear, two-subtrahend ones lead with two digits');

// задача 5: the run must really follow the rule it claims, and the gaps must be its own terms
let woven = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(27);
  if(q.woven){                              // two runs interleaved
    woven++;
    for(let k = 1; k < q.runA.length; k++){
      if(q.runA[k] - q.runA[k-1] !== q.dA) throw new Error('first run does not keep its step');
      if(q.runB[k] - q.runB[k-1] !== q.dB) throw new Error('second run does not keep its step');
    }
    for(let k = 0; k < q.woven.length; k++){
      const want = k % 2 === 0 ? q.runA[k/2] : q.runB[(k-1)/2];
      if(q.woven[k] !== want) throw new Error('the woven order does not alternate between the runs');
    }
    if(q.woven[q.hideAt[0]] !== q.dot || q.woven[q.hideAt[1]] !== q.star)
      throw new Error('the hidden spots are not the star and the dot');
    if(q.hideAt[1] !== q.hideAt[0] + 1) throw new Error('the two hidden terms should sit side by side');
    if(q.star - q.dot !== q.ans || q.ans < 1) throw new Error('woven answer wrong');
    continue;
  }
  if(q.one) continue;                          // задача 6 hides one term, and is checked below
  for(let k = 2; k < q.seq.length; k++){
    const want = q.rule === 0 ? q.seq[k-1] + q.seq[k-2]
               : q.rule === 1 ? q.seq[k-1] + (q.seq[1] - q.seq[0])
               : q.seq[k-1] * 2;
    if(q.seq[k] !== want) throw new Error('sequence ' + q.seq.join(',') + ' breaks its own rule at ' + k);
  }
  if(q.hidden[0] !== q.seq[q.at] || q.hidden[1] !== q.seq[q.at+1]) throw new Error('hidden terms do not come from the run');
  if(q.at < 2 || q.at + 1 >= q.seq.length - 1) throw new Error('gaps must leave the opening and the last term visible');
  const want = q.asksDigits ? String(q.hidden[0]).length + String(q.hidden[1]).length : q.hidden[0] + q.hidden[1];
  if(want !== q.ans) throw new Error('missing-terms answer wrong');
}
// the worksheet's own run: 1, 1, 2, 3, 5, _, _, 21, 34 hides 8 and 13, so 1 + 2 digits
if(String(8).length + String(13).length !== 3) throw new Error('worksheet instance of задача 5 should be 3');
if(!woven) throw new Error('the woven shape never turned up');
console.log('missing terms: every run follows its rule, woven runs alternate, worksheet instance gives 3');

// задача 10: being short of a total fixes how many there are now
for(let i = 0; i < 4000; i++){
  const q = raw(39);
  if(q.have + q.d1 !== q.T1) throw new Error('the shortfall does not reach the first total');
  if(q.T2 <= q.T1) throw new Error('the second total should be the larger one');
  const want = q.shape === 0 ? q.T2 - q.have : q.have;
  if(q.ans !== want || q.ans < 1) throw new Error('shortfall answer wrong');
}
if(20 - (20 - 10) !== 10 || 30 - 10 !== 20) throw new Error('worksheet instance of задача 10 should be 20');
console.log('shortfalls: the current amount follows from the gap, worksheet instance gives 20');

// задача 11: the overlapping measurements must describe one consistent line
let rulers = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(40);
  if(q.shape === 'ruler'){                     // задача 14: read off a ruler, checked below
    rulers++;
    if(q.AB !== q.b - q.a || q.CD !== q.d - q.c) throw new Error('a segment is not the gap between its marks');
    if(q.ans !== q.AB + q.CD) throw new Error('the two lengths do not add to the answer');
    if(!(q.a < q.c && q.c < q.b && q.b < q.d)) throw new Error('the two segments should overlap, in that order');
    if(q.d > 14) throw new Error('the segment runs off the end of the ruler');
    continue;
  }
  if(q.AB !== q.p + q.q || q.CD !== q.q + q.r) throw new Error('the given lengths do not match the points');
  if(q.ans !== q.p + q.q + q.r) throw new Error('AD wrong');
  if(q.AB - q.q !== q.p) throw new Error('AC does not come out of AB and CB');
  if(q.q >= q.AB || q.q >= q.CD) throw new Error('the overlap must be shorter than each measured piece');
}
if((5 - 1) + 6 !== 10) throw new Error('worksheet instance of задача 11 should be 10');
if(!rulers) throw new Error('the ruler shape should turn up');
if(lastNum(why({kind:'seg', shape:'ruler', a:3, b:7, c:5, d:11, AB:4, CD:6, ans:10}, true)) !== 10)
  throw new Error('AB from 3 to 7 and CD from 5 to 11 should add to 10');
console.log('segments: the pieces describe one line, and a ruler is read from both ends (10)');

// задача 15: a corner cut out of a rectangle
const stepShapes = {};
for(let i = 0; i < 6000; i++){
  const q = raw(52);
  stepShapes[q.shape] = 1;
  const sides = [q.W, q.H - q.h, q.w, q.h, q.W - q.w, q.H];
  if(String(sides) !== String(q.sides)) throw new Error('the six sides do not follow the cut');
  if(sides.some(v => v < 1)) throw new Error('a side of the figure vanished');
  const seen = {};
  sides.forEach(v => { seen[v] = (seen[v] || 0) + 1; });
  const equal = sides.filter(v => seen[v] > 1).length;
  if(q.shape === 0){
    if(q.ans !== equal || equal < 2) throw new Error('the count of equal sides is wrong or there is nothing to find');
  } else if(q.shape === 1){
    // the cut moves sides around but never shortens the outline
    if(q.ans !== sides.reduce((t, v) => t + v, 0)) throw new Error('the outline is not the six sides');
    if(q.ans !== 2*(q.W + q.H)) throw new Error('the outline should match the uncut rectangle');
  } else if(q.ans !== q.h) throw new Error('the unlabelled upright is wrong');
}
if(Object.keys(stepShapes).length !== 3) throw new Error('all three questions about the figure should turn up');
{ // задача 15 as printed: 7 by 6 with a 2 by 5 corner taken out
  const q = {kind:'step', shape:0, W:7, H:6, w:2, h:5, sides:[7,1,2,5,5,6], equal:2, ans:2};
  if(lastNum(why(q, true)) !== 2) throw new Error('that figure has exactly two sides of equal length');
  if(String([7,6,5,5,2,1]) !== String(q.sides.slice().sort((a, b) => b - a))) throw new Error('the printed sides are 7, 6, 5, 5, 2, 1');
}
// the two new figures must fit their own boxes and close up properly
for(const L of [52, 40]){
  for(let i = 0; i < 1500; i++){
    const svg = drawQ(raw(L));
    if(!/viewBox=/.test(svg)) continue;
    const vb = svg.match(/viewBox="([-\\d. ]+)"/)[1].split(' ').map(Number);
    for(const m of svg.matchAll(/<text x="([-\\d.]+)" y="([-\\d.]+)"[^>]*>([^<]*)</g)){
      const x = +m[1], y = +m[2], half = m[3].length * 4.2 + 3;   // roughly how wide the label draws
      if(x - half < vb[0] || x + half > vb[0] + vb[2]) throw new Error('level ' + L + ': „' + m[3] + '" runs off the side of the figure');
      if(y - 12 < vb[1] || y + 4 > vb[1] + vb[3]) throw new Error('level ' + L + ': „' + m[3] + '" runs off the top or bottom');
    }
  }
}
for(let i = 0; i < 1500; i++){
  const cmds = drawQ(raw(52)).match(/<path d="(M[^"]+)"/)[1].match(/[MHVZ][-\\d.]*/g);
  if(cmds.map(c => c[0]).join('') !== 'MHVHVHZ') throw new Error('the outline does not trace six sides and close');
}
console.log('cut corner: the six sides follow the cut and the outline never shortens, worksheet instance gives 2');
console.log('figures: every label sits inside its box, and the cut corner closes in six sides');

// задача 12: both possible third distances must really be placeable on a line
for(let i = 0; i < 4000; i++){
  const q = raw(41);
  for(const third of [q.ans].concat(q.alt)){
    const d = [q.a, q.b, third].sort((x, y) => x - y);
    if(d[0] + d[1] !== d[2]) throw new Error('distances ' + d.join(',') + ' cannot come from three points on a line');
    if(third < 1) throw new Error('a distance of zero means two points coincide');
  }
  if(q.ans === q.alt[0]) throw new Error('the two answers must differ');
}
{ const ok = [[1,4,3],[1,4,5]];
  ok.forEach(t => { const d = t.slice().sort((x,y) => x-y); if(d[0]+d[1] !== d[2]) throw new Error('worksheet instance of задача 12 is wrong'); }); }
console.log('three points: both answers sit on a line, worksheet instance gives 3 or 5');

// задача 13: the cut sheet must be consistent with its perimeter
let cut = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(21);
  if(q.shape !== 3) continue;
  cut++;
  if(q.P !== 2*(2*q.a + q.extra)) throw new Error('sheet perimeter does not match its sides');
  if(q.extra >= q.a) throw new Error('B short side must be the shorter one, got ' + q.extra + ' against ' + q.a);
  const want = q.asksSide ? q.extra : 2*(q.extra + q.a);
  if(q.ans !== want) throw new Error('cut-sheet answer wrong');
}
if(!cut) throw new Error('the cut-sheet shape never turned up');
if(2*(2*4 + 2) !== 20) throw new Error('worksheet instance of задача 13 should have perimeter 20 and leave 2');
console.log('cut sheet: perimeter matches the pieces, worksheet instance leaves a short side of 2');

// задача 14: the perimeters summed must match every sub-rectangle of the strip
let strips = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(19);
  if(q.shape !== 1) continue;
  strips++;
  let brute = 0;
  for(let a = 0; a < q.n; a++) for(let b = a + 1; b <= q.n; b++){
    const w = (b - a) * q.s, isSquare = (b - a) === 1;
    if(q.squares === isSquare) brute += 2 * (w + q.s);
  }
  if(brute !== q.ans) throw new Error('strip of ' + q.n + '×' + q.s + ': counted ' + brute + ', answer says ' + q.ans);
}
if(!strips) throw new Error('the strip shape never turned up');
{ let b = 0;
  for(let a = 0; a < 3; a++) for(let c = a+1; c <= 3; c++){ const w = (c-a)*3; if(c-a !== 1) b += 2*(w+3); }
  if(b !== 60) throw new Error('worksheet instance of задача 14 should be 60'); }
console.log('strip of squares: summed perimeters match every sub-rectangle, worksheet instance gives 60');

// задача 15: counting two-digit numbers with one digit fixed
let digits2 = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(18);
  if(q.shape !== 2) continue;
  digits2++;
  let brute = 0;
  for(let v = 10; v <= 99; v++){
    const t = Math.floor(v/10), o = v % 10;
    const ok = q.smaller ? (t === q.d && o < q.d) || (o === q.d && t < q.d)
                         : (t === q.d && o > q.d) || (o === q.d && t > q.d);
    if(ok) brute++;
  }
  if(brute !== q.ans) throw new Error('digit ' + q.d + ': counted ' + brute + ', answer says ' + q.ans);
  if(q.list.length !== q.ans) throw new Error('the listed numbers do not match the count');
  if(new Set(q.list).size !== q.list.length) throw new Error('a number is listed twice');
}
if(!digits2) throw new Error('the fixed-digit shape never turned up');
{ let b = 0;
  for(let v = 10; v <= 99; v++){ const t = Math.floor(v/10), o = v % 10;
    if((t === 5 && o < 5) || (o === 5 && t < 5)) b++; }
  if(b !== 9) throw new Error('worksheet instance of задача 15 should be 9'); }
console.log('fixed digit: the listed numbers are exactly the ones that qualify, worksheet instance gives 9');

// задача 16: the widest gap, checked against every qualifying set
let gaps = 0;
for(let i = 0; i < 3000; i++){
  const q = raw(13);
  if(q.shape !== 3) continue;
  gaps++;
  if(q.loose){
    if(q.ans !== 9) throw new Error('with any number of digits the gap should reach nine');
    if(q.S - 9 < 0 || q.S - 9 > 36) throw new Error('the rest cannot be made from the digits 1..8');
    continue;
  }
  let best = -1;
  (function walk(start, left, cur, sum){
    if(sum > q.S) return;
    if(left === 0){ if(sum === q.S) best = Math.max(best, cur[cur.length-1] - cur[0]); return; }
    for(let v = start; v <= 9; v++) walk(v + 1, left - 1, cur.concat(v), sum + v);
  })(0, q.k, [], 0);
  if(best !== q.ans) throw new Error(q.k + ' digits summing to ' + q.S + ': widest gap is ' + best + ', answer says ' + q.ans);
  if(q.wit.reduce((t, v) => t + v, 0) !== q.S) throw new Error('the example set does not add to the sum');
  if(new Set(q.wit).size !== q.k) throw new Error('the example set repeats a digit');
}
if(!gaps) throw new Error('the widest-gap shape never turned up');
console.log('widest gap: matches an exhaustive search over every qualifying set of digits');

// задача 17: simulate the two cats day by day rather than trusting the product
for(let i = 0; i < 3000; i++){
  const q = raw(42);
  let eaten = 0;
  for(let d = 1; d <= q.ans; d++){
    if(d % q.p === 0) eaten++;
    if(d % q.q === 0) eaten++;
  }
  if(eaten !== q.boxes) throw new Error(q.p + '/' + q.q + ' cats in ' + q.ans + ' days eat ' + eaten + ', not ' + q.boxes);
  let before = 0;
  for(let d = 1; d < q.ans; d++){ if(d % q.p === 0) before++; if(d % q.q === 0) before++; }
  if(before >= q.boxes) throw new Error('the boxes were finished before the stated day');
  if(q.p === q.q) throw new Error('the two cats should differ');
}
{ let e = 0; for(let d = 1; d <= 20; d++){ if(d % 4 === 0) e++; if(d % 5 === 0) e++; }
  if(e !== 9) throw new Error('worksheet instance of задача 17 should be 9 boxes in 20 days'); }
console.log('cats: day-by-day simulation agrees, worksheet instance eats 9 boxes in 20 days');

// задача 18: work out every payable amount from the actual coins
for(let i = 0; i < 3000; i++){
  const q = raw(43);
  const pay = new Set();
  for(let a = 0; a <= q.n1; a++) for(let b = 0; b <= q.n2; b++) pay.add(a + 2*b);
  if(q.asksMax){
    if(q.ans !== Math.max(...pay)) throw new Error('largest payable amount wrong');
    continue;
  }
  const missing = [];
  for(let v = 1; v < q.limit; v++) if(!pay.has(v)) missing.push(v);
  if(missing.length !== 1) throw new Error('coins ' + q.n1 + '/' + q.n2 + ' under ' + q.limit + ' miss ' + missing.length + ' amounts');
  if(missing[0] !== q.ans) throw new Error('the unpayable amount is ' + missing[0] + ', answer says ' + q.ans);
}
{ const pay = new Set();
  for(let a = 0; a <= 2; a++) for(let b = 0; b <= 3; b++) pay.add(a + 2*b);
  const miss = []; for(let v = 1; v < 10; v++) if(!pay.has(v)) miss.push(v);
  if(miss.length !== 1 || miss[0] !== 9) throw new Error('worksheet instance of задача 18 should be 9'); }
console.log('coins: exactly one amount under the limit cannot be paid, worksheet instance gives 9');

// задача 19: every possible deletion tried, and only one digit may work
for(let i = 0; i < 3000; i++){
  const q = raw(44);
  const parts = [q.A, q.B, q.C, q.D];
  const found = [];
  for(let t = 0; t < 4; t++){
    const str = String(parts[t]);
    for(let k = 0; k < str.length; k++){
      const left = str.slice(0, k) + str.slice(k + 1);
      if(left === '') continue;
      const p2 = parts.slice(); p2[t] = Number(left);
      if(p2[0] + p2[1] + p2[2] === p2[3]) found.push(+str[k]);
    }
  }
  if(!found.length) throw new Error('no deletion makes ' + parts.join(' ') + ' true');
  if(new Set(found).size !== 1) throw new Error('more than one digit would work');
  if(found[0] !== q.ans) throw new Error('the digit to cross is ' + found[0] + ', answer says ' + q.ans);
  if(q.A + q.B + q.C === q.D) throw new Error('the equation is already true, nothing to cross');
}
{ const parts = [10, 20, 30, 40], found = [];
  for(let t = 0; t < 4; t++){ const str = String(parts[t]);
    for(let k = 0; k < str.length; k++){ const left = str.slice(0,k) + str.slice(k+1);
      if(left === '') continue; const p2 = parts.slice(); p2[t] = Number(left);
      if(p2[0] + p2[1] + p2[2] === p2[3]) found.push(+str[k]); } }
  if(found.length !== 1 || found[0] !== 2) throw new Error('worksheet instance of задача 19 should be 2'); }
console.log('crossed digit: only one digit ever works, worksheet instance crosses the 2');

// задача 20: the best arrangement, checked against all twenty-four of them
for(let i = 0; i < 3000; i++){
  const q = raw(45);
  let best = null;
  const d = q.digits;
  for(let a = 0; a < 4; a++) for(let b = 0; b < 4; b++) for(let c = 0; c < 4; c++) for(let e = 0; e < 4; e++){
    if(new Set([a,b,c,e]).size !== 4) continue;
    const x = d[a]*10 + d[b], y = d[c]*10 + d[e], diff = x - y;
    if(diff > 0 && (best === null || (q.smallest ? diff < best : diff > best))) best = diff;
  }
  if(best !== q.ans) throw new Error('cards ' + d.join(',') + ': best is ' + best + ', answer says ' + q.ans);
  if(q.wit[0] - q.wit[1] !== q.ans) throw new Error('the example arrangement does not give the answer');
  const used = (String(q.wit[0]) + String(q.wit[1])).split('').map(Number).sort((x,y) => x-y);
  if(used.join() !== d.join()) throw new Error('the example arrangement does not use each card once');
}
{ let best = Infinity; const d = [1,2,4,7];
  for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++)for(let e=0;e<4;e++){
    if(new Set([a,b,c,e]).size !== 4) continue;
    const diff = (d[a]*10+d[b]) - (d[c]*10+d[e]);
    if(diff > 0 && diff < best) best = diff; }
  if(best !== 7) throw new Error('worksheet instance of задача 20 should be 7'); }
console.log('four cards: matches all twenty-four arrangements, worksheet instance gives 7');

// задача 6: the picture IS the data — it must hold exactly the fruit the answer assumes
for(let i = 0; i < 4000; i++){
  const q = raw(28);
  const drawn = { p:0, a:0 };
  q.row.forEach(t => drawn[t]++);
  if(drawn.p !== q.pears || drawn.a !== q.apples)
    throw new Error('picture shows ' + drawn.p + ' pears and ' + drawn.a + ' apples, question assumes ' + q.pears + ' and ' + q.apples);
  if(q.apples + q.ans !== q.pears + q.k) throw new Error('adding the answer does not reach the asked gap');
  if(q.ans < 1) throw new Error('nothing to add');
  const circles = (fruitSvg(q.row).match(/<circle/g) || []).length;
  if(circles !== q.pears*2 + q.apples) throw new Error('drawing has ' + circles + ' bodies for ' + q.row.length + ' fruit');
}
console.log('fruit picture: drawn fruit match the counts the question assumes, and the answer closes the gap');

// задача 8: the same list read the other way round erases the smaller number
{
  const set = [3,4,7,9,11], total = 34;
  if(total - 7 !== 27) throw new Error('erasing the bigger of the pair should leave 27');
  if(total - 3 !== 31) throw new Error('erasing the smaller of the pair should leave 31');
}
console.log('erase wording: same list gives 27 when the bigger goes, 31 when the smaller does');

// задача 9: the three totals must be consistent with the three fruit values
let squares = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(29);
  if(q.grid){                                  // задача 20: four fruit in a square, checked below
    squares++;
    if(q.A + q.B !== q.R1 || q.C - q.D !== q.R2) throw new Error('a row does not match its total');
    if(q.A + q.C !== q.C1 || q.B + q.D !== q.C2) throw new Error('a column does not match its total');
    if(new Set(q.f).size !== 4) throw new Error('the four fruit must differ');
    if(q.signs.filter(x => x > 0).length !== 2) throw new Error('the question should add two and take away two');
    if(q.signs[0] !== 1) throw new Error('the expression should not open with a minus');
    if(new Set([q.A, q.B, q.C, q.D]).size !== 4) throw new Error('two fruit share a value, which softens the puzzle');
    const want = [q.A, q.B, q.C, q.D].reduce((t, x, i) => t + q.signs[i]*x, 0);
    if(want !== q.ans || q.ans < 1) throw new Error('the grid answer is wrong or went negative');
    // only one set of values can fit all four totals
    let fits = 0;
    for(let A = 0; A <= 20; A++){
      const B = q.R1 - A, C = q.C1 - A, D = q.C2 - B;
      if(B < 0 || C < 0 || D < 0) continue;
      if(C - D === q.R2) fits++;
    }
    if(fits !== 1) throw new Error(fits + ' sets of values fit the square, so it has no single answer');
    continue;
  }
  if(q.a + q.b !== q.s1 || q.a + q.c !== q.s2 || q.a + q.b + q.c !== q.s3)
    throw new Error('fruit totals disagree with the values: ' + JSON.stringify(q));
  if(new Set(q.f).size !== 3) throw new Error('the three fruit must be different');
  const v = [q.a, q.b, q.c];
  if(v[q.askd[0]] - v[q.askd[1]] !== q.ans || q.ans < 1) throw new Error('fruit answer wrong');
}
if(!squares) throw new Error('the four-fruit square should turn up');
{ // задача 20 as printed
  const q = {kind:'fruiteq', grid:1, f:['l','g','a','p'], A:7, B:9, C:5, D:2,
             signs:[1, -1, 1, -1], R1:16, R2:3, C1:12, C2:11, ans:1};
  if(lastNum(why(q, true)) !== 1) throw new Error('that square should come out at 1');
  // the printed question asks lemon - strawberry - pear + apple, which is 9 - 7 - 2 + 5
  if(9 - 7 - 2 + 5 !== 5) throw new Error('the printed expression is 5');
}
console.log('fruit equations: three totals or a square of four, every value forced, worksheet values are 7, 9, 5 and 2');

// задача 11: the gaps are one fewer than the trees, whichever way round it is asked
for(let i = 0; i < 4000; i++){
  const q = raw(31);
  if(q.len !== (q.n - 1) * q.d) throw new Error('row length is not gaps times spacing');
  const want = q.shape === 1 ? q.n : q.shape === 2 ? q.d : q.len;
  if(q.ans !== want) throw new Error('trees answer wrong for shape ' + q.shape);
  if(q.n < 2) throw new Error('a row needs at least two trees');
  if(q.shape === 3 && (q.dm !== 10 * q.d || q.d < 2)) throw new Error('the дм spacing does not match the м one, or the conversion does nothing');
  if(/\b1 метра\b/.test(strip(drawQ(q)))) throw new Error('„1 метра" — Bulgarian wants „1 метър"');
}
{ // задача 11 as printed: 16 trees, 20 дм apart, asked in metres
  const q = {kind:'trees', who:'Хари', did:'посадил', n:16, d:2, dm:20, shape:3, len:30, ans:30};
  if(lastNum(why(q, true)) !== 30) throw new Error('16 trees 20 дм apart should make 30 m');
  if(strip(drawQ(q)).indexOf('20 дм') < 0) throw new Error('the spacing is not drawn in дециметри');
}
console.log('trees in a row: length, count and spacing agree, and дм converts, worksheet instance gives 30');

// задача 9: the arrangement has to be the only one that works
for(let i = 0; i < 4000; i++){
  const q = raw(46);
  if(new Set(q.nums).size !== 3) throw new Error('the three numbers must differ');
  const fits = [];
  for(let a = 0; a < 3; a++) for(let b = 0; b < 3; b++) for(let c = 0; c < 3; c++){
    if(a === b || b === c || a === c) continue;
    if(q.nums[a] + q.p > q.nums[b] && q.nums[b] > q.nums[c] + q.g) fits.push([q.nums[a], q.nums[b], q.nums[c]]);
  }
  if(fits.length !== 1) throw new Error(fits.length + ' arrangements work, so the question has no single answer');
  if(fits[0].join() !== q.fit.join()) throw new Error('the recorded arrangement is not the one that works');
  const want = q.asksMid ? q.fit[1] : q.fit[0] + q.fit[2];
  if(q.ans !== want) throw new Error('placement answer wrong: ' + JSON.stringify(q));
}
{ // задача 9 as printed: 6, 8 and 10 into ■ + 2 > □ > ■ + 1
  const q = {kind:'order', nums:[6,8,10], p:2, g:1, fit:[10,8,6], asksMid:false, ans:16};
  if(lastNum(why(q, true)) !== 16) throw new Error('6, 8, 10 with +2 and +1 should shade 10 and 6');
}
console.log('placement: exactly one arrangement fits the chain, worksheet instance gives 16');

{ // задача 8 as printed: 20 + 40 + 80 against 30 + 40 + 50
  const q = {kind:'cmp', shape:3, tens:1, L:[20,40,80], R:[30,40,50], ans:20, flip:false};
  if(lastNum(why(q, true)) !== 20) throw new Error('20+40+80 against 30+40+50 should be 20');
  if(strip(why(q, true)).indexOf('поравно') < 0) throw new Error('the shared term should be called out as level');
}
console.log('round-tens comparison: one term shared, the rest whole tens apart, worksheet instance gives 20');

// задача 6: a single gap, and the missing number itself
let ones = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(27);
  if(!q.one) continue;
  ones++;
  const seq = q.seq;
  for(let k = 2; k < seq.length; k++){
    const want = q.rule === 0 ? seq[k-1] + seq[k-2] : q.rule === 1 ? seq[k-1] + (seq[1] - seq[0]) : 2*seq[k-1];
    if(seq[k] !== want) throw new Error('the run breaks its own rule at ' + k);
  }
  if(!q.next && q.ans !== seq[q.at]) throw new Error('the answer is not the hidden term');
  if(q.next){                                  // задача 11: the gap sits after the run
    if(q.at !== seq.length) throw new Error('the next number should follow the whole shown run');
    const rule0 = seq[seq.length-1] + seq[seq.length-2];
    const want = q.rule === 0 ? rule0 : q.rule === 1 ? seq[seq.length-1] + (seq[1] - seq[0]) : 2*seq[seq.length-1];
    if(want !== q.ans) throw new Error('the next number does not follow the rule');
    if((strip(drawQ(q)).match(/…/g) || []).length !== 1) throw new Error('the run should trail off once');
    if(strip(drawQ(q)).indexOf('следващото') < 0) throw new Error('it should ask for the next number, not a missing one');
  } else if(q.at < 2 || q.at > seq.length - 2) throw new Error('the gap must have terms on both sides');
  if(seq.some((v, k) => k && v < seq[k-1])) throw new Error('the run steps down somewhere, which reads as a mistake');
  if(Math.max(seq[seq.length-1], q.ans) > 250) throw new Error('the run has grown past what she works with');
  if((strip(drawQ(q)).match(/…/g) || []).length !== 1) throw new Error('exactly one term should be hidden');
}
if(!ones) throw new Error('the single-gap shape should turn up');
{ // задача 6 as printed: 0, 5, 5, 10, 15, 25, …, 65
  const q = {kind:'missing', one:1, seq:[0,5,5,10,15,25,40,65], at:6, rule:0, ans:40};
  if(lastNum(why(q, true)) !== 40) throw new Error('0, 5, 5, 10, 15, 25, …, 65 should be missing 40');
}
console.log('one missing term: every run follows its rule to the gap, worksheet instance gives 40');

// задача 10: the rest of them, then two lots given away
let gaves = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(38);
  if(q.shape !== 'gave') continue;
  gaves++;
  if(q.rest !== q.T - q.a) throw new Error('the other colour is not the rest of them');
  if(q.ans !== q.rest - q.g1 - q.g2 || q.ans < 1) throw new Error('giving away left nothing, or the wrong count');
  if(new Set(q.col.map(c => c[0])).size !== 2) throw new Error('the two colours must differ');
  const shown = strip(drawQ(q));
  if(shown.indexOf(q.f ? 'имала' : 'имал') < 0 || shown.indexOf(q.f ? 'Подарила' : 'Подарил') < 0)
    throw new Error('the verbs do not agree with the name, or the sentence lost its capital: ' + q.who);
}
if(!gaves) throw new Error('the giving-away shape should turn up');
{ // задача 10 as printed: 20, 9 of one colour, 7 and 3 given away
  const q = {kind:'pencils', shape:'gave', who:'Петър', f:false,
             col:[['червени','червен'], ['жълти','жълт']], T:20, a:9, rest:11, g1:7, g2:3, ans:1};
  if(lastNum(why(q, true)) !== 1) throw new Error('20 with 9 red, giving away 7 and 3, leaves 1');
}
console.log('given away: the rest is the whole minus the named colour, worksheet instance gives 1');

// задача 10: two numbers a given distance from the same anchor
let anchored = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(17);
  if(q.shape !== 'gap') continue;
  anchored++;
  if(q.d1 === q.d2) throw new Error('equal distances make the two letters interchangeable');
  let widest = 0;
  for(const A of [q.c - q.d1, q.c + q.d1]) for(const B of [q.c - q.d2, q.c + q.d2])
    widest = Math.max(widest, Math.abs(A - B));
  if(widest !== q.ans) throw new Error('the widest gap is ' + widest + ', answer says ' + q.ans);
  if(q.c - Math.max(q.d1, q.d2) < 1) throw new Error('a number fell to zero or below');
}
if(!anchored) throw new Error('the distance-from-an-anchor shape should turn up');
if(lastNum(why({kind:'sumdiff', shape:'gap', c:18, d1:2, d2:3, ans:5}, true)) !== 5)
  throw new Error('A two from 18 and B three from 18 should be five apart');
console.log('distance from an anchor: matches all four placings of the two numbers, worksheet values are 7, 9, 5 and 2');

// задача 12: a triangle in см against a square given in дм
let tris = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(21);
  if(q.shape !== 4) continue;
  tris++;
  const [a, b, c] = q.sides.slice().sort((x, y) => x - y);
  if(a + b <= c) throw new Error('those three lengths do not close into a triangle');
  if(q.p !== a + b + c) throw new Error('the triangle perimeter is not its three sides');
  if(q.P !== 4 * (q.inCm ? q.dm : 10*q.dm)) throw new Error('the square perimeter is not four sides in см');
  if(q.ans !== q.P - q.p || q.ans < 1) throw new Error('the square should come out the bigger one');
  // a figure that disagrees with its own labels teaches the wrong thing
  const svg = drawQ(q);
  const d = svg.match(/d="M([\\d.]+) ([\\d.]+)L([\\d.]+) ([\\d.]+)L([\\d.]+) ([\\d.]+)Z"/).slice(1).map(Number);
  const pt = [[d[0],d[1]], [d[2],d[3]], [d[4],d[5]]];
  const u = 200 / (c + (q.inCm ? q.dm : 10*q.dm) + 4);
  const drawn = [0,1,2].map(k => Math.hypot(pt[k][0] - pt[(k+1)%3][0], pt[k][1] - pt[(k+1)%3][1])).sort((x, y) => x - y);
  [a, b, c].forEach((v, k) => { if(Math.abs(drawn[k] - v*u) > 0.15) throw new Error('a drawn side does not match its label'); });
  const w = +svg.match(/<rect x="[\\d.]+" y="[\\d.]+" width="([\\d.]+)"/)[1];
  if(Math.abs(w - (q.inCm ? q.dm : 10*q.dm)*u) > 0.15) throw new Error('the square is not drawn to the same scale as the triangle');
}
if(!tris) throw new Error('the triangle-against-square shape should turn up');
{ // задача 12 as printed: 3, 4, 5 см against a square of 1 дм
  const q = {kind:'sqcut', shape:4, dm:1, P:40, sides:[3,4,5], p:12, ans:28};
  if(lastNum(why(q, true)) !== 28) throw new Error('a 1 дм square beats a 3-4-5 triangle by 28 см');
}
console.log('triangle against square: the figure matches its labels at one scale, worksheet instance gives 28');

// задача 13: each tiling must cover its rectangle exactly — no gap, no overlap
let tiled = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(21);
  if(q.shape !== 5) continue;
  tiled++;
  const cell = {};
  q.t.sq.forEach(([x, y, k]) => {
    if(x + k > q.t.w || y + k > q.t.h) throw new Error('a square hangs off the rectangle');
    for(let dx = 0; dx < k; dx++) for(let dy = 0; dy < k; dy++){
      const key = (x+dx) + ',' + (y+dy);
      if(cell[key]) throw new Error('two squares overlap at ' + key);
      cell[key] = 1;
    }
  });
  if(Object.keys(cell).length !== q.t.w * q.t.h) throw new Error('the squares leave a gap');
  const least = Math.min(...q.t.sq.map(r => r[2]));
  if(q.few !== q.t.sq.filter(r => r[2] === least).length) throw new Error('the clue miscounts the smallest squares');
  if(q.side !== least * q.s) throw new Error('the stated side is not the smallest square scaled');
  if(q.ans !== 2*(q.t.w + q.t.h)*q.s) throw new Error('the perimeter is not twice the two sides');
}
if(!tiled) throw new Error('the tiled-rectangle shape should turn up');
{ // задача 13 as printed: four squares, two of them 1 см
  const t = { w:5, h:3, sq:[[0,0,2],[0,2,1],[1,2,1],[2,0,3]] };
  const q = {kind:'sqcut', shape:5, t, s:1, n:4, few:2, side:1, ans:16};
  if(lastNum(why(q, true)) !== 16) throw new Error('four squares with two of side 1 should give 16');
}
console.log('tiled rectangle: every tiling covers its rectangle exactly, worksheet instance gives 16');

// задача 15: the square cut the one way into equal strips
let cuts = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(21);
  if(q.shape !== 6) continue;
  cuts++;
  if(q.side !== q.k * q.w) throw new Error('the strips do not add up to the square');
  if(q.w >= q.side) throw new Error('a strip as wide as the square is not a cut');
  const P = 2*(q.w + q.side);
  if(q.ans !== (q.mm ? 10*P : P)) throw new Error('the perimeter, or the conversion to мм, is wrong');
  const shown = strip(drawQ(q));
  if(shown.indexOf(q.mm ? 'милиметра' : 'сантиметра') < 0) throw new Error('the unit asked for is not the one drawn');
  if(/две еднакви правоъгълника/.test(shown)) throw new Error('правоъгълник is masculine — Bulgarian wants два');
  const lines = (drawQ(q).match(/<line /g) || []).length;
  if(lines !== q.k - 1) throw new Error('the figure should show ' + (q.k - 1) + ' cuts, not ' + lines);
}
if(!cuts) throw new Error('the strip shape should turn up');
{ // задача 15 as printed: a 4 см square in four strips, answered in мм
  const q = {kind:'sqcut', shape:6, k:4, w:1, side:4, mm:true, ans:100};
  if(lastNum(why(q, true)) !== 100) throw new Error('four 1 by 4 strips have a perimeter of 100 mm');
}
console.log('strips: the pieces fill the square and the millimetres follow, worksheet instance gives 100');

{ // задача 12 as printed, this time with the square given in сантиметри
  const q = {kind:'sqcut', shape:4, inCm:true, dm:4, P:16, sides:[3,4,5], p:12, ans:4};
  if(lastNum(why(q, true)) !== 4) throw new Error('a 4 cm square beats a 3-4-5 triangle by 4');
  if(strip(drawQ(q)).indexOf('4 см') < 0) throw new Error('the square should be given in сантиметри');
}
{ // задача 11 as printed: the Fibonacci run, asked for the next number
  const q = {kind:'missing', one:1, next:true, seq:[1,1,2,3,5,8,13,21], at:8, rule:0, ans:34};
  if(lastNum(why(q, true)) !== 34) throw new Error('after 21 comes 34');
}
console.log('printed instances: 3-4-5 against a 4 cm square gives 4, and 1 1 2 3 5 8 13 21 runs on to 34');

{ // задача 14 as printed: the tall rectangle beats the wide one by 8 см
  const q = {kind:'shared', shape:2, a:4, h:3, d:8, ans:16};
  if(lastNum(why(q, true)) !== 16) throw new Error('a difference of 8 should make a square of 16');
  if(strip(drawQ(q)).indexOf('DCEF') < 0) throw new Error('the rectangle is not named as printed');
}
console.log('square under a rectangle: the height on top cancels, worksheet instance gives 16');

// задача 15: three amounts peeled off one at a time
for(let i = 0; i < 4000; i++){
  const q = raw(47);
  if(q.a + q.b + q.c !== q.T) throw new Error('the three amounts do not make the total');
  if(q.a + q.b !== q.ab) throw new Error('the first two do not make their own total');
  if(q.c - q.b !== q.d) throw new Error('the gap between the second and third is wrong');
  if([q.a, q.b, q.c].some(v => v < 1)) throw new Error('an amount fell to nothing');
  if(q.ans !== [q.a, q.b, q.c][q.asks]) throw new Error('the answer is not the one asked for');
  if(/ в втор/.test(strip(drawQ(q)))) throw new Error('„в втората" — Bulgarian wants „във" there');
}
{ // задача 15 as printed: 30 кг, first two 19, second 2 less than the third
  const box = ['щайги','щайга'];
  const q = {kind:'crates', box, asks:0, T:30, ab:19, a:10, b:9, c:11, d:2, ans:10};
  if(lastNum(why(q, true)) !== 10) throw new Error('the first crate should hold 10 kg');
}
console.log('three crates: the parts add up and each step leaves one fewer unknown, worksheet instance gives 10');

// задача 16: two groups that overlap
for(let i = 0; i < 4000; i++){
  const q = raw(48);
  if(q.A + q.B - q.T !== q.both) throw new Error('the overlap is not the excess');
  if(q.both < 1) throw new Error('with no overlap there is nothing to notice');
  if(q.both >= q.B) throw new Error('nobody would be left studying only the second language');
  if(q.A >= q.T || q.B >= q.T) throw new Error('a group is as big as the whole class');
  if(q.ans !== (q.asksBoth ? q.both : q.B - q.both)) throw new Error('the answer is not the one asked for');
  if(new Set(q.lang).size !== 2) throw new Error('the two languages must differ');
}
{ // задача 16 as printed: 22 students, 18 English, 5 French
  const q = {kind:'both', T:22, A:18, B:5, both:1, lang:['английски','френски'], asksBoth:false, ans:4};
  if(lastNum(why(q, true)) !== 4) throw new Error('22 students with 18 and 5 should leave 4 on French alone');
  if(strip(drawQ(q)).indexOf('поне един') < 0) throw new Error('the assumption that makes it well-posed is missing');
}
console.log('two languages: the overlap is the excess, worksheet instance gives 4');

// задача 17: the smallest count past the bound that splits equally both ways
for(let i = 0; i < 4000; i++){
  const q = raw(49);
  if(q.ans % q.p || q.ans % q.r) throw new Error('the count does not split both ways');
  if(q.ans <= q.N) throw new Error('the count is not past the bound');
  for(let v = q.N + 1; v < q.ans; v++)
    if(v % q.p === 0 && v % q.r === 0) throw new Error(v + ' is smaller and also works');
  if(q.N % q.L === 0) throw new Error('the bound is itself a count that works, which blurs „more than"');
  if(!BGNUM[q.p] || !BGNUM[q.r]) throw new Error('the number of equal parts has no Bulgarian word');
  if(q.ans > 100) throw new Error('the count has run past what she works with');
}
if(lastNum(why({kind:'multiple', g:['рози','розите','градината'], p:3, r:2, L:6, N:32, ans:36}, true)) !== 36)
  throw new Error('more than 32, splitting into 2 and into 3, should be 36');
console.log('equal parts both ways: nothing smaller past the bound works, worksheet instance gives 36');

// задача 18: k different whole numbers with a fixed sum
let tops = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(13);
  if(q.shape !== 4) continue;
  tops++;
  const rest = [];
  for(let v = 0; v <= q.k - 2; v++) rest.push(v);
  if(rest.reduce((t, v) => t + v, 0) !== q.floor) throw new Error('the smallest the others can be is wrong');
  const set = rest.concat([q.ans]);
  if(set.reduce((t, v) => t + v, 0) !== q.S) throw new Error('the witness set does not reach the sum');
  if(new Set(set).size !== q.k) throw new Error('the witness set repeats a number');
  if(q.ans + 1 + q.floor <= q.S) throw new Error('one bigger would still fit, so the answer is not the largest');
}
if(!tops) throw new Error('the largest-of-k shape should turn up');
if(lastNum(why({kind:'named', shape:4, k:5, S:11, floor:6, ans:5}, true)) !== 5)
  throw new Error('five different numbers summing to 11 cap the biggest at 5');
console.log('largest of a set: the witness holds and one more would not fit, worksheet values are 7, 9, 5 and 2');

// задача 19: the last such weekday of the month
let lasts = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(25);
  if(q.shape !== 'last') continue;
  lasts++;
  if(q.first < 1 || q.first > 7) throw new Error('the first such weekday must fall in the opening week');
  if((q.ans - q.first) % 7) throw new Error('the last one is not a whole number of weeks on');
  if(q.ans > q.mon[1]) throw new Error('the date runs past the end of the month');
  if(q.ans + 7 <= q.mon[1]) throw new Error('another one still fits, so it is not the last');
  const idx = DAYS.indexOf(q.d1), want = DAYS.indexOf(q.day);
  if((idx + q.first - 1) % 7 !== want) throw new Error('the first date does not land on the named weekday');
  const shown = strip(drawQ(q));
  if(shown.indexOf(q.day.f ? 'последната ' + q.day.nm : 'последният ' + q.day.nm) < 0)
    throw new Error('the weekday is not agreed with its adjective: ' + q.day.nm);
}
if(!lasts) throw new Error('the last-weekday shape should turn up');
{ // задача 19 as printed: the 1st of January is a Sunday
  const sun = DAYS[6];
  const q = {kind:'weekday', shape:'last', mon:['януари',31], d1:sun, day:sun, first:1, ans:29};
  if(lastNum(why(q, true)) !== 29) throw new Error('the last Sunday of that January is the 29th');
}
console.log('last weekday: a whole number of weeks on, and no further one fits, worksheet instance gives 29');

// задача 20: the signs in a run, and how many of them can be minus
for(let i = 0; i < 3000; i++){
  const q = raw(50);
  const rest = q.nums.slice(1);
  let most = -1;
  for(let mask = 0; mask < (1 << rest.length); mask++){
    let sum = 0, n = 0;
    for(let j = 0; j < rest.length; j++) if(mask & (1 << j)){ sum += rest[j]; n++; }
    if(q.nums.reduce((t, v) => t + v, 0) - 2*sum === q.T) most = Math.max(most, n);
  }
  if(most !== q.ans) throw new Error('the most minuses is ' + most + ', answer says ' + q.ans);
  if(q.ans < 1) throw new Error('a run with no minus at all is not the puzzle');
  const val = q.nums.reduce((t, v, j) => j === 0 ? v : t + (q.wit.indexOf(v) >= 0 ? -v : v), 0);
  if(val !== q.T) throw new Error('the worked example does not come out at the target');
  if(q.wit.length !== q.ans) throw new Error('the example does not use the most minuses');
  if(q.nums.some((v, j) => j && v !== q.nums[j-1] + 1)) throw new Error('the run must step by one');
}
{ // задача 20 as printed: 1 to 5 making 5
  const q = {kind:'signs', a:1, b:5, nums:[1,2,3,4,5], T:5, wit:[2,3], ans:2};
  if(lastNum(why(q, true)) !== 2) throw new Error('1 to 5 making 5 allows two minuses');
}
console.log('choosing the signs: matches an exhaustive search of every sign pattern, worksheet instance gives 2');

// задача 1 and 5: a number said in tens, ones and hundreds
const seenTens = {};
for(let i = 0; i < 6000; i++){
  const q = raw(51);
  seenTens[q.shape] = 1;
  const want = q.shape === 0 ? (q.N - q.c) / 10
             : q.shape === 1 ? (10*q.a + 10*q.b + 10*q.m) / 100
             : q.shape === 2 ? q.N - 10*q.t
             : q.shape === 4 ? Math.floor(q.tot / 10)
             : 100*q.a + 10*q.b + q.c;
  if(q.shape === 4){
    if(10*q.t + q.u !== q.tot) throw new Error('the tens and the ones do not make the total');
    if(q.tot % 10 !== q.b) throw new Error('the digit shown is not the ones digit of the total');
    if(q.u < 10) throw new Error('with fewer than ten ones there is no carry to notice');
  }
  if(want !== q.ans) throw new Error('shape ' + q.shape + ' does not balance: ' + JSON.stringify(q));
  const shown = strip(drawQ(q));
  const digit = q.shape < 2 || q.shape === 4;
  if(digit && (q.ans < 0 || q.ans > 9)) throw new Error('the box is asked for as a digit but holds ' + q.ans);
  if(digit !== (shown.indexOf('Коя цифра') >= 0)) throw new Error('цифра and число do not match what the box holds');
  if(/\b1 (единици|десетици|стотици)\b/.test(shown)) throw new Error('„1 единици" — Bulgarian wants the singular');
}
if(Object.keys(seenTens).length !== 5) throw new Error('all five spellings should turn up');
if(lastNum(why({kind:'tens', shape:4, t:2, u:37, b:7, tot:57, ans:5}, true)) !== 5)
  throw new Error('2 tens and 37 ones should make 57, so the digit is 5');
{ // задачи 1 and 5 as printed
  if(lastNum(why({kind:'tens', shape:0, c:20, N:50, ans:3}, true)) !== 3)
    throw new Error('50 = □ tens + 20 ones should be 3');
  if(lastNum(why({kind:'tens', shape:1, a:7, b:8, m:5, ans:2}, true)) !== 2)
    throw new Error('7 tens + 8 tens + 50 ones should be 2 hundreds');
}
console.log('tens and ones: every spelling balances and agrees with its numeral, worksheet instances give 3 and 2');

// задачи 2 and 4: both sides say the same thing
let balanced = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(11);
  if(q.shape !== 'bal') continue;
  balanced++;
  const L = q.plus ? q.x + q.y : q.x - q.y;
  if(L !== q.L) throw new Error('the side that can be worked out is wrong');
  const right = (q.form === 0 || q.form === 3) ? q.N - q.ans
              : q.form >= 4 ? q.ans - q.N : q.ans + q.N;
  if(right !== q.L) throw new Error('the two sides do not come out equal: ' + JSON.stringify(q));
  if(q.ans < 1 || q.ans > 99) throw new Error('the box left the range she works in');
}
if(!balanced) throw new Error('the balance shape should turn up');
{ // задачи 2 and 4 as printed
  if(lastNum(why({kind:'box', shape:'bal', form:0, x:31, y:29, N:95, L:60, plus:true, ans:35}, true)) !== 35)
    throw new Error('31 + 29 = 95 − □ should be 35');
  if(lastNum(why({kind:'box', shape:'bal', form:1, x:100, y:40, N:20, L:60, plus:false, ans:40}, true)) !== 40)
    throw new Error('100 − 40 = □ + 20 should be 40');
  if(lastNum(why({kind:'box', shape:'bal', form:5, x:60, y:40, N:20, L:20, plus:false, ans:40}, true)) !== 40)
    throw new Error('60 − 40 = □ − 20 should be 40');
  if(lastNum(why({kind:'box', shape:'bal', form:2, x:55, y:25, N:20, L:80, plus:true, ans:60}, true)) !== 60)
    throw new Error('55 + 25 = □ + 20 should be 60');
}
console.log('both sides equal: the two sides agree whichever way the box sits, worksheet instances give 35 and 40');

// задача 3: the same two numbers, added once and taken away once
let sames = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(10);
  if(!q.same) continue;
  sames++;
  if(q.p !== q.x || q.q !== q.y) throw new Error('the pair is not the same on both sides');
  if(q.S - q.D !== q.ans || q.ans !== 2*q.y) throw new Error('the gap is not twice the smaller number');
  if(q.x <= q.y) throw new Error('the difference would go negative');
}
if(!sames) throw new Error('the same-pair comparison should turn up');
if(lastNum(why({kind:'cmp', shape:2, same:1, x:31, y:13, p:31, q:13, S:44, D:18, less:false, ans:26}, true)) !== 26)
  throw new Error('31 + 13 against 31 − 13 should be 26');
console.log('same pair both ways: the gap is twice the smaller number, worksheet instance gives 26');

// задача 16: one bracket take away another, the second in a different order
let written = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(10);
  if(!q.written) continue;
  written++;
  const rest = q.terms.slice();
  q.kept.forEach(v => {
    const at = rest.indexOf(v);
    if(at < 0) throw new Error('the second bracket holds a term the first does not');
    rest.splice(at, 1);
  });
  if(rest.length !== 1 || rest[0] !== q.ans) throw new Error('what is left over is not the answer');
  if(q.gone[0] === q.terms[0] || q.gone[0] === q.terms[q.terms.length-1])
    throw new Error('the odd one out should not sit at either end, where it is easy to spot');
  if(String(q.kept) === String(q.terms.filter(v => v !== q.ans)))
    throw new Error('the second bracket should be in a different order');
}
if(!written) throw new Error('the written-out bracket shape should turn up');
{ // задача 16 as printed
  const q = {kind:'cmp', shape:1, written:1, terms:[7,9,11,13,15,17], kept:[17,15,13,9,7], gone:[11], ans:11};
  if(lastNum(why(q, true)) !== 11) throw new Error('those two brackets should leave 11');
  if(strip(drawQ(q)).indexOf('(7 + 9 + 11 + 13 + 15 + 17) − (17 + 15 + 13 + 9 + 7)') < 0)
    throw new Error('the printed expression is not the one drawn');
}
console.log('bracket take away bracket: only the odd term survives, worksheet instance gives 11');

// задача 17: which weekday a later date falls on
let whiches = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(25);
  if(q.shape !== 'which') continue;
  whiches++;
  const idx = DAYS.indexOf(q.d1);
  if((idx + q.n - 1) % 7 + 1 !== q.ans) throw new Error('the weekday does not follow from the first of the month');
  if(q.ans < 1 || q.ans > 7) throw new Error('the answer must be one of the seven days');
  if(q.n < 8 || q.n > 20) throw new Error('the date should be far enough in to be worth counting, and its ordinal spellable');
  const shown = strip(drawQ(q));
  if(shown.indexOf('1 понеделник') < 0) throw new Error('the numbering of the days is missing');
  const nums = (strip(why(q, false)).match(/\d+/g) || []).map(Number);
  if(nums.indexOf(q.ans) >= 0) throw new Error('the nudge gives the day away');
}
if(!whiches) throw new Error('the which-weekday shape should turn up');
{ // задача 17 as printed: the 1st of December is a Wednesday
  const q = {kind:'weekday', shape:'which', mon:['декември',31], d1:DAYS[2], n:16, ans:4};
  if(lastNum(why(q, true)) !== 4) throw new Error('the 16th is a Thursday, the fourth day');
  if(DAYS[3].nm !== 'четвъртък') throw new Error('day four should be четвъртък');
}
console.log('which weekday: whole weeks drop out and the leftover moves the day, worksheet instance gives 4');

// задача 19: the smallest or largest three-digit number that fits a condition
const thrShapes = {};
for(let i = 0; i < 6000; i++){
  const q = raw(53);
  thrShapes[q.shape] = 1;
  const ok = n => { const d = String(n); return n >= 100 && n <= 999 && d[0] !== d[1] && d[1] !== d[2] && d[0] !== d[2]; };
  if(!ok(q.a) || +String(q.a)[q.pos] !== q.dig) throw new Error('the pinned number does not fit its own condition');
  if(!ok(q.base)) throw new Error('the plain extreme does not have three different digits');
  for(let n = 100; n <= 999; n++){             // nothing better may exist either way
    if(!ok(n)) continue;
    if(+String(n)[q.pos] === q.dig && (q.small ? n < q.a : n > q.a)) throw new Error(n + ' beats the pinned one');
    if(q.small ? n < q.base : n > q.base) throw new Error(n + ' beats the plain one');
  }
  if(q.ans !== (q.shape === 0 ? q.a : Math.abs(q.a - q.base))) throw new Error('the answer is not the one asked for');
  if(q.shape === 1 && q.ans < 1) throw new Error('there is nothing to compare');
}
if(Object.keys(thrShapes).length !== 2) throw new Error('both questions should turn up');
{ // задача 19 as printed
  const q = {kind:'thr', small:true, pos:1, dig:1, a:210, base:102, shape:1, ans:108};
  if(lastNum(why(q, true)) !== 108) throw new Error('210 beats 102 by 108');
}
console.log('three digits: nothing smaller or larger fits the condition, worksheet instance gives 108');

// задача 5: the four by four sudoku must have exactly one answer
for(let i = 0; i < 600; i++){
  const q = raw(54);
  const ok = g => {
    for(let k = 0; k < 4; k++){
      const row = new Set(), col = new Set(), box = new Set();
      for(let j = 0; j < 4; j++){
        row.add(g[k*4 + j]);
        col.add(g[j*4 + k]);
        const br = (k < 2 ? 0 : 2), bc = (k % 2 ? 2 : 0);
        box.add(g[(br + ((j / 2) | 0))*4 + bc + j % 2]);
      }
      if(row.size !== 4 || col.size !== 4 || box.size !== 4) throw new Error('the solution repeats a number');
    }
  };
  ok(q.sol);
  if(q.sol.some(v => v < 1 || v > 4)) throw new Error('the solution uses something other than 1 to 4');
  if(q.g.some((v, k) => v && v !== q.sol[k])) throw new Error('a given disagrees with the solution');
  if(q.g[q.X] || q.g[q.Y]) throw new Error('X and Y must sit on empty cells');
  if(q.X === q.Y) throw new Error('X and Y must be different cells');
  if(q.g.filter(v => !v).length < 6) throw new Error('too few cells left empty to be a puzzle');
  if(sudokuCount(q.g.slice()) !== 1) throw new Error('the puzzle does not have exactly one answer');
  if(q.ans !== q.sol[q.X] + q.sol[q.Y]) throw new Error('the answer is not the two named cells added');
}
{ // задача 5 as printed
  const g = [0,0,0,3, 3,2,4,0, 0,4,3,2, 2,0,0,0];
  if(sudokuCount(g.slice()) !== 1) throw new Error('the printed puzzle should have one answer');
  const sol = g.slice();
  (function fill(){ const at = sol.indexOf(0); if(at < 0) return true;
    for(let v = 1; v <= 4; v++){ if(!sudokuFits(sol, at, v)) continue; sol[at] = v; if(fill()) return true; sol[at] = 0; }
    return false; })();
  if(sol[0] + sol[15] !== 8) throw new Error('X and Y in the printed puzzle should add to 8, got ' + (sol[0] + sol[15]));
}
console.log('sudoku: one answer only, and the givens agree with it, worksheet instance gives 8');

// задача 8: every two-digit number from three digits, with no leading zero
for(let i = 0; i < 4000; i++){
  const q = raw(18);
  if(q.shape !== 3) continue;
  const want = [];
  q.pool.forEach(t => q.pool.forEach(u => { if(t !== u && t !== 0) want.push(10*t + u); }));
  want.sort((a, b) => a - b);
  if(String(want) !== String(q.made)) throw new Error('the list of numbers is not the one the digits allow');
  if(q.made.some(v => v < 10 || v > 99)) throw new Error('something that is not a two-digit number got in');
  if(new Set(q.pool).size !== 3) throw new Error('the three digits must differ');
  const digitSum = q.made.reduce((t, v) => t + ((v / 10) | 0) + v % 10, 0);
  const each = [digitSum, q.made.length, q.made.reduce((t, v) => t + v, 0)];
  if(q.ans !== each[q.asks]) throw new Error('the answer is not the one asked for');
  if(/нула/.test(strip(why(q, false))) !== (q.pool.indexOf(0) >= 0))
    throw new Error('the nudge warns about a leading zero when there is no zero to lead');
}
{ // задача 8 as printed: the two-digit numbers from 0, 3 and 1
  const q = {kind:'digits', shape:3, pool:[0,1,3], made:[10,13,30,31], asks:0, ans:12};
  if(lastNum(why(q, true)) !== 12) throw new Error('10, 13, 30 and 31 have digits adding to 12');
}
console.log('numbers from three digits: no leading zero, worksheet instance gives 12');

// задача 9: how often a digit turns up across a run
const runShapes = {};
for(let i = 0; i < 4000; i++){
  const q = raw(55);
  runShapes[q.shape] = 1;
  const hits = (to) => { let n = 0; for(let v = q.from; v <= to; v++) n += String(v).split(String(q.d)).length - 1; return n; };
  if(q.shape === 0){
    if(hits(q.to) !== q.ans) throw new Error('the count of the digit is wrong');
    if(q.ans < 3) throw new Error('too few to be worth counting');
  } else {
    if(hits(q.ans) !== q.k) throw new Error('the run does not hold exactly that many of the digit');
    if(hits(q.ans + 1) <= q.k) throw new Error('one further along still fits, so it is not the largest');
  }
}
if(Object.keys(runShapes).length !== 2) throw new Error('both directions should turn up');
{ // задача 9 as printed: thirteen twos from 2 onwards
  let n = 0, last = 0;
  for(let v = 2; v <= 60; v++){ n += String(v).split('2').length - 1; if(n === 13) last = v; }
  if(last !== 31) throw new Error('thirteen twos from 2 onwards should reach 31, got ' + last);
  if(lastNum(why({kind:'dcount', shape:1, d:2, from:2, k:13, ans:31}, true)) !== 31)
    throw new Error('the worked line should land on 31');
}
console.log('counting a digit: walked number by number both ways, worksheet instance gives 31');

// задача 10: filling a vessel until the two buckets tell apart
for(let i = 0; i < 4000; i++){
  const q = raw(56);
  if(q.p >= q.q) throw new Error('the two bucket sizes must differ, smaller first');
  if(q.ans*q.q < q.V) throw new Error('the bigger bucket has not filled the vessel yet');
  if((q.ans - 1)*q.q >= q.V) throw new Error('the bigger bucket filled it earlier, so fewer fills would do');
  if(q.ans*q.p >= q.V) throw new Error('the smaller bucket fills it too, so nothing is told apart');
  if(q.ans < 2 || q.ans > 6) throw new Error('one fill telling you is no puzzle, and many is just pouring');
}
if(lastNum(why({kind:'bucket', p:3, q:5, V:14, ans:3}, true)) !== 3)
  throw new Error('a 14-litre vessel with a 3 or 5 litre bucket takes 3 fills');
console.log('which bucket: the vessel overflows for one size and not the other, worksheet instance gives 3');

// задача 17: the most or the fewest of one weekday in a run of days
let bounds = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(25);
  if(q.shape !== 'bound') continue;
  bounds++;
  // count them for every possible starting weekday and take the real extreme
  let lo = 99, hi = 0;
  for(let start = 0; start < 7; start++){
    let n = 0;
    for(let d = 0; d < q.n; d++) if((start + d) % 7 === 0) n++;
    lo = Math.min(lo, n); hi = Math.max(hi, n);
  }
  if(q.ans !== (q.most ? hi : lo)) throw new Error('the extreme is wrong for ' + q.n + ' days');
  if(lo === hi) throw new Error('with a whole number of weeks there is nothing to choose between');
  if(/1 цели седмици/.test(strip(why(q, true)))) throw new Error('one week is „една цяла седмица", not „1 цели"');
}
if(!bounds) throw new Error('the most-or-fewest shape should turn up');
if(lastNum(why({kind:'weekday', shape:'bound', n:22, most:true, day:DAYS[5], ans:4}, true)) !== 4)
  throw new Error('22 days hold at most 4 Saturdays');
console.log('most or fewest: matches a count from every starting weekday, worksheet instance gives 4');

// задача 19: two runs stepping by two, one odd and one even
let runs = 0;
for(let i = 0; i < 6000; i++){
  const q = raw(10);
  if(!q.runs) continue;
  runs++;
  if(q.A.some((v, k) => k && v !== q.A[k-1] + 2) || q.B.some((v, k) => k && v !== q.B[k-1] + 2))
    throw new Error('a run does not step by two');
  if(q.A[0] % 2 === q.B[0] % 2) throw new Error('one run should be odd and the other even');
  if(q.sa !== q.A.reduce((t, v) => t + v, 0) || q.sb !== q.B.reduce((t, v) => t + v, 0))
    throw new Error('a stated sum is wrong');
  if(q.ans !== Math.abs(q.sa - q.sb) || q.ans < 1) throw new Error('the gap between the sums is wrong');
  if(q.big !== (q.sa > q.sb ? 0 : 1)) throw new Error('the question names the wrong one as bigger');
  if(q.A.concat(q.B).some(v => v < 1)) throw new Error('a run dipped to nothing');
}
if(!runs) throw new Error('the two-runs shape should turn up');
{ // задача 19 as printed
  const A = [3,5,7,9,11,13,15,17], B = [2,4,6,8,10,12,14,16,18];
  const q = {kind:'cmp', runs:1, A, B, sa:80, sb:90, nm:['Деми','Мария'], back:true, big:1, ans:10};
  if(lastNum(why(q, true)) !== 10) throw new Error('Maria beats Demi by 10');
}
console.log('two runs: each steps by two, odd against even, worksheet instance gives 10');

// задача 18: how many are above someone, from who beat whom
for(let i = 0; i < 4000; i++){
  const q = raw(57);
  if(new Set(q.who).size !== q.n) throw new Error('the boys must all be different');
  if(q.k < 1 || q.k > q.n - 2) throw new Error('the named boy must have someone above and below him');
  if(q.ans !== (q.asksAbove ? q.k : q.n - 1 - q.k)) throw new Error('the answer is not the one asked for');
  const shown = strip(drawQ(q));
  if(shown.indexOf(q.who[q.k]) < 0 || shown.indexOf('само') < 0) throw new Error('the second fact is missing');
  if(/по-много/.test(shown)) throw new Error('„по-много" is not Bulgarian — it wants „повече"');
}
{ // задача 18 as printed
  const q = {kind:'rank', who:['Алекс','Виктор','Борис','Георги'], n:4, k:2, asksAbove:true, ans:2};
  if(lastNum(why(q, true)) !== 2) throw new Error('two boys score above Boris');
}
console.log('the ranking: being above only a few pins how many are above you, worksheet instance gives 2');

// задача 20: the snail, checked against a day-by-day climb
for(let i = 0; i < 4000; i++){
  const q = raw(58);
  let at = 0, day = 0;
  while(true){
    day++;
    at += q.up;
    if(at >= q.H) break;
    day++;
    at -= q.down;
    if(day > 200) throw new Error('the snail never gets there');
  }
  if(day !== q.ans) throw new Error('climbing it day by day takes ' + day + ', answer says ' + q.ans);
  if(q.up <= q.down) throw new Error('a snail that slips back further than it climbs never arrives');
  if(q.ans % 2 === 0) throw new Error('the top is always reached on a climbing day');
}
{ // задача 20 as printed: 23 metres, up 8 and back 5
  const q = {kind:'snail', H:23, up:8, down:5, gain:3, k:5, ans:11};
  if(lastNum(why(q, true)) !== 11) throw new Error('that snail reaches the top on day 11');
}
console.log('the snail: matched day by day against the climb, worksheet instance gives 11');

// задача 12: conversions and the cut both land on whole centimetres
let sticks = 0, boards = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(32);
  if(q.shape === 4){                           // задача 13: one stick, a leftover, answered in дм
    boards++;
    if(q.cm !== q.k*q.a + q.left) throw new Error('the board is not the sticks plus what is left');
    if(q.cm % 10) throw new Error('the length does not come out a whole number of дециметри');
    if(q.ans !== q.cm / 10) throw new Error('the conversion to дециметри is wrong');
    if(q.left >= q.a) throw new Error('another whole stick would have fitted in what is left');
    if(q.left < 1) throw new Error('with nothing left over the leftover is not part of the question');
    continue;
  }
  if(q.shape === 3){                           // задача 13: two sticks, laid down a few times each
    sticks++;
    if(q.aCm !== (q.inDm ? 10*q.a : q.a)) throw new Error('the long stick is not brought to centimetres');
    if(q.ans !== q.k*q.aCm + q.m*q.b) throw new Error('the board is not the sticks laid end to end');
    if(q.k < 2 || q.m < 1) throw new Error('a stick has to be used at least once');
    const shown = strip(drawQ(q));
    if(q.m === 1 && shown.indexOf('1 път') < 0) throw new Error('„1 пъти" — Bulgarian wants the singular');
    continue;
  }
  if(q.shape === 0){
    if(q.toCm && q.ans !== q.n * q.u.cm) throw new Error('to-cm conversion wrong');
    if(!q.toCm && q.cm !== q.ans * q.u.cm) throw new Error('from-cm conversion wrong');
  } else {
    if(q.target !== q.t * q.u.cm) throw new Error('target length wrong');
    const want = q.shape === 1 ? q.L - q.target : q.target - q.L;
    if(want !== q.ans || q.ans < 1) throw new Error('ribbon answer wrong');
  }
}
if(!sticks || !boards) throw new Error('both the two-stick and the leftover shapes should turn up');
if(lastNum(why({kind:'ribbon', shape:4, a:11, k:3, left:7, cm:40, ans:4}, true)) !== 4)
  throw new Error('11 three times plus 7 makes 40 cm, which is 4 dm');
if(lastNum(why({kind:'ribbon', shape:3, inDm:false, a:15, aCm:15, b:5, k:3, m:1, ans:50}, true)) !== 50)
  throw new Error('15 three times and 5 once should measure 50');
console.log('lengths: conversions are exact, the ribbon needs a real cut, and two sticks measure a board (50)');

// задача 13: the flower count must be forced — every decomposition with at least one
// of each kind has to give the same total
for(let i = 0; i < 2000; i++){
  const q = raw(33);
  const totals = new Set();
  for(let x = 1; x*q.p[0] < q.T; x++)
    for(let y = 1; x*q.p[0] + y*q.p[1] < q.T; y++){
      const rest = q.T - x*q.p[0] - y*q.p[1];
      if(rest > 0 && rest % q.p[2] === 0) totals.add(x + y + rest/q.p[2]);
    }
  if(totals.size !== 1) throw new Error('petals ' + q.p.join(',') + ' totalling ' + q.T + ' allows ' + totals.size + ' flower counts');
  if([...totals][0] !== q.ans) throw new Error('flower answer disagrees with the only possible count');
}
{ // the worksheet's own: 5, 6, 7 petals totalling 34
  const totals = new Set();
  for(let x = 1; x*5 < 34; x++) for(let y = 1; 5*x + 6*y < 34; y++){
    const rest = 34 - 5*x - 6*y;
    if(rest > 0 && rest % 7 === 0) totals.add(x + y + rest/7);
  }
  if(totals.size !== 1 || [...totals][0] !== 6) throw new Error('worksheet instance of задача 13 should be a forced 6');
}
console.log('flowers: the count is forced by the total, and the worksheet instance gives 6');

// задача 14: the shortcut must equal an actual cell-by-cell count
for(let i = 0; i < 3000; i++){
  const q = raw(34);
  let bare = 0;
  for(let y = 0; y < q.R; y++) for(let x = 0; x < q.C; x++)
    if(y >= q.r && x >= q.c) bare++;          // paint the first r rows and first c columns
  if(bare !== q.left) throw new Error('painted grid ' + q.R + 'x' + q.C + ': counted ' + bare + ', shortcut says ' + q.left);
  if(q.ans !== (q.asksLeft ? bare : q.R*q.C - bare)) throw new Error('painted answer wrong');
}
if((4-2)*(7-2) !== 10) throw new Error('worksheet instance of задача 14 should be 10');
console.log('painted grid: the leftover-rows-times-columns shortcut matches a cell count, worksheet instance gives 10');

// задача 15: the pair must be the ONLY one of its kind adding to that sum
for(let i = 0; i < 3000; i++){
  const q = raw(35);
  const M = q.three ? 100 : 10, X = q.three ? 999 : 99;
  const pairs = [];
  for(let a = M; a <= X; a++){ const b = q.S - a; if(b > a && b <= X) pairs.push([a, b]); }
  if(pairs.length !== 1) throw new Error('sum ' + q.S + ' allows ' + pairs.length + ' pairs, not one');
  if(pairs[0][0] !== q.lo || pairs[0][1] !== q.hi) throw new Error('pair disagrees with the generated one');
}
console.log('two-digit pairs: every sum admits exactly one pair of different numbers');

// задача 16: the count must equal the enumerated ways
for(let i = 0; i < 3000; i++){
  const q = raw(36);
  const ways = candyWays(q.n, q.kids);
  if(ways.length !== q.ans) throw new Error(q.n + ' sweets to ' + q.kids + ' children: listed ' + ways.length + ', answer says ' + q.ans);
  ways.forEach(w => {
    const parts = w.split(' + ').map(Number);
    if(parts.length !== q.kids || parts.some(v => v < 1) || parts.reduce((s,v) => s+v, 0) !== q.n)
      throw new Error('bad share: ' + w);
  });
}
if(candyWays(5, 3).length !== 6) throw new Error('worksheet instance of задача 16 should be 6');
console.log('sharing sweets: the count matches the listed ways, worksheet instance gives 6');
`;
eval(head + body + test);

// The level table is a static thing, so it is checked on the file rather than through
// the generators: every level rated, in a known group, and easiest first.
{
  const block = js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections'));
  const rows = [...block.matchAll(/id:(\d+), op:.(.).(?:, grp:.(\w+).)?(?:, needs:\[([\d,]*)\])?, d:(\d), eq:.(.*?)., desc/g)]
    .map(m => ({ id:+m[1], grp: m[3] || m[2], needs: m[4] ? m[4].split(',').map(Number) : [], d:+m[5], eq:m[6] }));
  if(rows.length !== 57) throw new Error('parsed ' + rows.length + ' levels, expected 57');
  const seen = new Set();
  rows.forEach(r => {
    if(!(r.d >= 1 && r.d <= 5)) throw new Error(r.eq + ' has no usable difficulty');
    if(seen.has(r.id)) throw new Error('level id ' + r.id + ' appears twice');
    seen.add(r.id);
  });
  const known = ['-', '+', 'chain', 'count', 'num', 'seq', 'find', 'word', 'geo'];
  rows.forEach(r => { if(known.indexOf(r.grp) < 0) throw new Error(r.eq + ' is in no known group'); });
  known.slice(2).forEach(g => {
    const ds = rows.filter(r => r.grp === g).map(r => r.d);
    if(ds.some((v, i) => i && v < ds[i-1])) throw new Error('group ' + g + ' is not easiest first');
  });
  const ladder = rows.filter(r => r.grp === '-' || r.grp === '+').map(r => r.d);
  if(ladder.join() !== '2,2,3,1,2,3') throw new Error('the arithmetic ladder lost its designed order');
  // prerequisites must exist, never point forward, and never form a cycle
  const byId = {};
  rows.forEach(r => byId[r.id] = r);
  rows.forEach(r => r.needs.forEach(n => {
    if(!byId[n]) throw new Error(r.eq + ' needs a level that does not exist: ' + n);
    if(byId[n].d > r.d) throw new Error(r.eq + ' needs something harder than itself: ' + byId[n].eq);
  }));
  const depth = (id, seen) => {
    if(seen.has(id)) throw new Error('prerequisites form a loop at ' + byId[id].eq);
    seen.add(id);
    return byId[id].needs.reduce((d, n) => Math.max(d, 1 + depth(n, new Set(seen))), 0);
  };
  rows.forEach(r => depth(r.id, new Set()));
  // starting from nothing learned, the path must be able to reach every level
  {
    const done = new Set();
    for(let pass = 0; pass < 50 && done.size < rows.length; pass++)
      rows.forEach(r => { if(!done.has(r.id) && r.needs.every(n => done.has(n))) done.add(r.id); });
    if(done.size !== rows.length) throw new Error('some levels can never be reached by the path');
  }
  console.log('level table: all 57 rated 1-5, grouped, easiest first, prerequisites sound and reachable');

  // every element the script looks up must exist in the markup
  {
    const markup = src.split('<script>')[0];
    const have = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    ['slot0','slot1','wave1','wave2','waveX','pAdd','reveal','compClock'].forEach(i => have.add(i));   // drawn at runtime
    const looked = [...new Set([...js.matchAll(/\$\('([^']+)'\)/g)].map(m => m[1]))];
    const gone = looked.filter(i => !have.has(i));
    if(gone.length) throw new Error('the script looks up elements that are not in the page: ' + gone.join(', '));
    console.log('page wiring: all ' + looked.length + ' element lookups resolve');
  }

  // Walk the recommended path from nothing learned: it must reach every level, never
  // suggest something whose groundwork is undone, never step back in difficulty, and
  // not grind one group for too long.
  {
    const levelsSrc = js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections')).replace(/, gen:\w+/g, '');
    const nextSrc = js.slice(js.indexOf('function nextUp(m'), js.indexOf('function buildPicker'));
    const walk = `
      const grp = l => l.grp || l.op;
      const m = {}, order = [];
      let last = null;
      for(let step = 0; step < 200; step++){
        const nx = nextUp(m, last);
        if(!nx) break;
        if(!(nx.needs || []).every(n => m[n] && m[n].done)) throw new Error(nx.eq + ' was suggested before its groundwork');
        order.push(nx); last = grp(nx);
        m[nx.id] = { n:20, f:17, rate:.85, done:true, rounds:2 };
      }
      if(order.length !== LEVELS.length) throw new Error('the path reaches ' + order.length + ' of ' + LEVELS.length + ' levels');
      // Her own grade's tasks all come before the next grade's, and each grade is a ladder of its own.
      const gs = order.map(l => l.grade);
      if(gs.some((g, i) => i && g < gs[i-1])) throw new Error('the path goes back to an easier grade');
      // The path may pull one level forward for variety, so a single step back is allowed;
      // dropping further than that would mean the ladder is not being climbed at all.
      [...new Set(gs)].forEach(g => {
        const ds = order.filter(l => l.grade === g).map(l => l.d);
        if(ds.some((v, i) => i && v < ds[i-1] - 1)) throw new Error('the grade ' + g + ' path steps back in difficulty');
        if(ds[ds.length-1] < ds[0]) throw new Error('the grade ' + g + ' path ends easier than it starts');
      });
      let run = 1, worst = 1;
      for(let i = 1; i < order.length; i++){
        run = grp(order[i]) === grp(order[i-1]) ? run + 1 : 1;
        if(run > worst) worst = run;
      }
      if(worst > 4) throw new Error('the path grinds one group ' + worst + ' times running');
      console.log('training path: reaches all ' + order.length + ' levels, groundwork first, 2nd grade before 3rd, climbing within each, at most ' + worst + ' in a row from one group');
    `;
    eval('const PLAYER = { grade:2 };' + levelsSrc + nextSrc + walk);   // the default 2nd-grade player
    // a 3rd-grader's profile starts her on the 3rd-grade levels
    const first3 = eval('(function(){ const PLAYER = { grade:3 };' + levelsSrc + nextSrc + '; return nextUp({}, null); })()');
    if(!first3 || first3.grade !== 3) throw new Error('a 3rd-grade profile is not recommended a 3rd-grade level');
    console.log('profile grade: a 3rd-grader starts on level ' + first3.id + ', a 3rd-grade one');
  }
}

/* The scripts share one global scope, so a name declared at the top of two files stops the
   later file from running at all - the page loads with half its code missing. */
{
  const seen = {};
  scripts.forEach(f => read(f).split('\n').forEach(l => {
    const m = l.match(/^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/);
    if(!m) return;
    if(seen[m[1]]) throw new Error(m[1] + ' is declared in both ' + seen[m[1]] + ' and ' + f);
    seen[m[1]] = f;
  }));
  console.log('one global scope: ' + Object.keys(seen).length + ' top-level names across ' + scripts.length + ' scripts, none declared twice');
}

/* Every language says everything English says, with the same shape: a string where English
   has a string, a function that returns text where English has one, and a description for
   every level. Missing text would fall back to English in the middle of a Bulgarian page. */
{
  const T = eval('(function(){ const PLAYER = { lang:"en" };' + read('js/i18n.js') + '; return { TEXT, LANGS, t, get LANG(){ return LANG; } }; })()');
  const args = [3, 7, 12];
  const sample = v => typeof v === 'function' ? v(...args) : v;
  const shape = v => Array.isArray(v) ? 'list' + v.length : typeof v === 'function' ? 'text' : typeof v === 'object' ? 'map' : typeof v;
  const levelIds = [...js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections')).matchAll(/\{ id:(\d+),/g)].map(m => m[1]);
  let n = 0;
  for(const lang of Object.keys(T.LANGS)){
    const L = T.TEXT[lang], E = T.TEXT.en;
    for(const k of Object.keys(E)){
      if(!(k in L)) throw new Error(lang + ' is missing ' + k);
      if(shape(L[k]) !== shape(E[k])) throw new Error(lang + '.' + k + ' is a ' + shape(L[k]) + ', English has a ' + shape(E[k]));
      if(shape(E[k]) === 'map') for(const j of Object.keys(E[k]))
        if(!(j in L[k]) || String(L[k][j]).length === 0) throw new Error(lang + '.' + k + '.' + j + ' is missing');
      for(let c = 0; c < 30; c++){
        const v = typeof L[k] === 'function' ? L[k](c, c + 1, c + 2) : sample(L[k]);
        if(typeof L[k] === 'function' && (typeof v !== 'string' || !v || /undefined|NaN/.test(v))) throw new Error(lang + '.' + k + '(' + c + ') gives ' + v);
      }
      n++;
    }
    if(lang !== 'en') levelIds.forEach(id => { if(!(L.desc || {})[id]) throw new Error(lang + ' has no description for level ' + id); });
    if(lang === 'uk'){
      const names = [...js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections')).matchAll(/\{ id:(\d+),.*?eq:'(.*?)'/g)];
      names.forEach(m => { if(/[А-Яа-я]/.test(m[2]) && !(L.eq || {})[m[1]]) throw new Error('uk has no name for level ' + m[1] + ' ' + m[2]); });
    }
  }
  const groups = (read('js/levels.js').split('const PICK_GROUPS = [')[1].split('];')[0].match(/\{ nm:'/g) || []).length;
  Object.keys(T.LANGS).forEach(lang => { if(T.TEXT[lang].groups.length !== groups) throw new Error(lang + ' names ' + T.TEXT[lang].groups.length + ' picker groups, the picker has ' + groups); });
  const mascots = [...read('js/mascots.js').matchAll(/^  (\w+): \{$/gm)].map(m => m[1]);
  Object.keys(T.LANGS).forEach(lang => mascots.forEach(m => { if(!T.TEXT[lang].mascots[m]) throw new Error(lang + ' has no name for the ' + m); }));
  const used = [...new Set([...(js + src).matchAll(/\bt\('(\w+)'|data-t(?:-aria)?="(\w+)"/g)].map(m => m[1] || m[2]))];
  const unknown = used.filter(k => !(k in T.TEXT.en));
  if(unknown.length) throw new Error('the page asks for text no language has: ' + unknown.join(', '));
  console.log('languages: ' + Object.keys(T.LANGS).join(', ') + ' each carry all ' + (n / 3) + ' texts, ' + levelIds.length +
    ' level descriptions, ' + groups + ' group names and ' + mascots.length + ' mascot names; all ' + used.length + ' keys the page uses exist');
}

/* The signs task shows an example on its own numbers: correct arithmetic, and never the target. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, signsExample }; })()');
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(50), ex = Q.signsExample(q), [lhs, rhs] = ex.split(' = ');
    const val = lhs.split(/ (?=[+−])/).reduce((t, p) => t + (p[0] === '−' ? -+p.slice(2) : p[0] === '+' ? +p.slice(2) : +p), 0);
    if(val !== +rhs || +rhs === q.T || lhs.split(/ [+−] /).map(Number).join() !== q.nums.join()) throw new Error('bad signs example: ' + ex + ' for ' + JSON.stringify(q));
  }
  console.log('signs example: always on the question’s own numbers, always correct, never the answer');
}

/* Naming a mistake: each classic slip on a plain sum is recognised from what she typed,
   and the ten-frame shows exactly the crossing step - the right dots, the right ones
   crossed out - and nothing at all when no ten is crossed. */
{
  const Q = eval('(function(){' + head + body + '; return { slipOf, tenFrame }; })()');
  [[{a:42,b:17,op:'-'}, '35', 'forgotBorrow'], [{a:41,b:17,op:'-'}, '36', 'flipped'], [{a:42,b:17,op:'-'}, '59', 'wrongOp'],
   [{a:27,b:15,op:'+'}, '32', 'forgotCarry'], [{a:8,b:5,op:'+'}, '3', 'wrongOpAdd'], [{a:42,b:17,op:'-'}, '26', 'offByOne'],
   [{a:42,b:17,op:'-'}, '40', null], [{a:112,b:25,op:'-'}, '97', 'forgotBorrow'], [{kind:'erase', ans:7}, '8', null]
  ].forEach(([q, typed, want]) => {
    const got = Q.slipOf(q, [typed]);
    if(got !== want) throw new Error(q.a + q.op + q.b + ' typed ' + typed + ' is read as ' + got + ', not ' + want);
  });
  for(let a = 1; a <= 9; a++) for(let b = 1; b <= 9; b++){
    const svg = Q.tenFrame({a, b, op:'+'}), fill = (svg.match(/var\(--accent\)"/g) || []).length, more = (svg.match(/var\(--warm\)"/g) || []).length;
    if(a + b < 10 ? svg !== '' : fill !== a || more !== b) throw new Error('ten-frame for ' + a + ' + ' + b + ' draws ' + fill + ' and ' + more);
  }
  for(let o = 0; o <= 9; o++) for(let bo = 0; bo <= 9; bo++){
    const svg = Q.tenFrame({a:40 + o, b:10 + bo, op:'-'}), left = (svg.match(/var\(--accent\)"/g) || []).length, gone = (svg.match(/<path d="M[\d.]+,[\d.]+ L/g) || []).length;
    if(o >= bo ? svg !== '' : left !== 10 - (bo - o) || gone !== bo || /undefined|NaN/.test(svg)) throw new Error('ten-frame for ' + (40+o) + ' − ' + (10+bo) + ': ' + left + ' left, ' + gone + ' crossed out');
  }
  console.log('mistakes: forgotten borrow, flipped digits, dropped carry, wrong sign and off-by-one are each recognised; ten-frames show the crossing step exactly');
}


/* Multiple choice: on every level that can be asked that way, exactly one option is right
   (the one marked as the answer), the others are distinct, whole and not negative, the
   options go in order of size, and drawing them draws no random number. */
{
  const Q = eval('(function(){' + head + body + '; return { withChoices, choiceHtml, raw, accepts, LEVELS, R: () => RANDS }; })()');
  let asked = 0, slipsOffered = 0;
  Q.LEVELS.forEach(L => {
    for(let i = 0; i < 200; i++){
      const q = Q.withChoices(Q.raw(L.id));
      if(!q.options) continue;
      asked++;
      const vs = q.options.map(o => o.v), right = q.options.filter(o => Q.accepts(q, [String(o.v)]));
      if(q.options.length !== 4 || new Set(vs).size !== 4 || vs.some(v => !Number.isInteger(v) || v < 0))
        throw new Error('level ' + L.id + ': bad options ' + vs.join(', '));
      if(right.length !== 1 || right[0].id !== q.pick) throw new Error('level ' + L.id + ': ' + right.length + ' right options in ' + vs.join(', '));
      if(vs.some((v, k) => k && v < vs[k - 1])) throw new Error('level ' + L.id + ': options out of order ' + vs.join(', '));
      if(vs.some(v => Math.abs(v - q.options[q.pick].v) === 10)) slipsOffered++;
      const r0 = Q.R(); Q.choiceHtml(q, [q.pick === 0 ? 1 : 0], true, 2);
      if(Q.R() !== r0) throw new Error('level ' + L.id + ': drawing the options drew a random number');
    }
  });
  if(slipsOffered < asked / 2) throw new Error('the lost-or-gained ten is offered too rarely: ' + slipsOffered + ' of ' + asked);
  console.log('multiple choice: ' + asked + ' questions asked as А/Б/В/Г, each with one right option, in order, a ten-off slip among them in ' + Math.round(100 * slipsOffered / asked) + '%');
}

/* МБГ Есен, 3 клас: each of the five tasks as printed, and thousands more checked by brute force. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, eqText, why, accepts, withChoices, genTwoSigns, twoSignsVal, SIGN_PAIRS, DIG_COND, mulMixExpr, zerosExpr, pmBig, pmSmall, twoRhs, LEVELS }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  const calc = e => Function('return ' + strip(e).replace(/·/g, '*').replace(/−/g, '-').replace(/:/g, '/'))();
  // the paper's own five
  const orig = [
    [{kind:'mulmix', a:20, b:2, c:5, d:6, e:20, ans:18}, '20 − 2 · 5 + 20 − 2 · 6', 18],
    [{kind:'digprod', c:0, big:false, prod:true, n:102, ds:[1,0,2], ans:0}, null, 0],
    [{kind:'zeros', p:2, q:5, r:6, f1:false, f2:false, f3:false, ans:20}, '(2 · 0 + 2 · 5) · (2 + 0 · 2 · 6) − 2 · 0 · 2 · 5', 20],
    [{kind:'pmgap', a:9, b:7, c:7, d:5, e:9, f:9, both:false, flip:false, ans:18}, '9 · 7 + 7 · 5 + 9', 18]
  ];
  orig.forEach(([q, text, want]) => {
    const shown = strip(Q.drawQ(q));
    if(text && shown.indexOf(text) < 0) throw new Error(q.kind + ': the printed task does not read ' + text + ': ' + shown);
    if(q.ans !== want) throw new Error(q.kind + ': the printed task should give ' + want);
  });
  if(Q.twoSignsVal(20, 2, 5, 2, ':', '·') !== 30 || Q.SIGN_PAIRS.filter(([x, y]) => Q.twoSignsVal(20, 2, 5, 2, x, y) === 30).length !== 1)
    throw new Error('twosigns: (20 □ 2 + 5) □ 2 = 30 should have exactly one answer, : and ·');
  const fit = Q.DIG_COND[0][2], small = [...Array(900).keys()].map(i => i + 100).find(fit);
  if(small !== 102) throw new Error('digprod: the smallest three-digit number with different digits is 102, not ' + small);

  const byKind = {};
  Q.LEVELS.filter(l => l.grade === 3).forEach(L => { for(let i = 0; i < 400; i++){
    const q = Q.raw(L.id);
    byKind[q.kind] = (byKind[q.kind] || 0) + 1;
    if(!Q.accepts(q, [q.ans].concat(q.alt || []).map(String))) throw new Error('level ' + L.id + ': its own answer is refused');
    if(q.kind === 'mulmix' && calc(Q.mulMixExpr(q)) !== q.ans) throw new Error('mulmix: ' + Q.mulMixExpr(q) + ' is not ' + q.ans);
    if(q.kind === 'zeros' && calc(Q.zerosExpr(q)) !== q.ans) throw new Error('zeros: ' + Q.zerosExpr(q) + ' is not ' + q.ans);
    if(q.kind === 'pmgap' && calc('(' + Q.pmBig(q) + ') - (' + Q.pmSmall(q) + ')') !== q.ans) throw new Error('pmgap: the gap is not ' + q.ans);
    if(q.kind === 'digprod'){
      const all = [...Array(900).keys()].map(i => i + 100).filter(Q.DIG_COND[q.c][2]), n = q.big ? all[all.length - 1] : all[0];
      const ds = String(n).split('').map(Number), want = q.prod ? ds.reduce((a, b) => a*b, 1) : ds.reduce((a, b) => a + b, 0);
      if(n !== q.n || want !== q.ans) throw new Error('digprod: ' + q.n + ' → ' + q.ans + ', brute force says ' + n + ' → ' + want);
    }
    if(q.kind === 'twosigns'){
      const hits = Q.SIGN_PAIRS.filter(([x, y]) => Q.twoSignsVal(q.a, q.b, q.c, q.d, x, y) === q.val);
      if(hits.length !== 1 || hits[0].join() !== q.options[q.pick].signs.join() || calc(Q.twoRhs(q)) !== q.val)
        throw new Error('twosigns: (' + q.a + ' □ ' + q.b + ' + ' + q.c + ') □ ' + q.d + ' = ' + Q.twoRhs(q) + ' has ' + hits.length + ' answers');
      if(new Set(q.options.map(o => o.signs.join())).size !== q.options.length) throw new Error('twosigns: two options are the same pair');
    }
    const c = Q.withChoices(q);
    if(q.traps && q.traps.length && c.options && !c.options.some(o => o.v === q.traps[0])) throw new Error(q.kind + ': its own trap was left out of the options');
  }});
  console.log('МБГ Есен 3 клас: the five printed tasks read and solve as on the paper; ' + Object.keys(byKind).map(k => byKind[k] + ' ' + k).join(', ') + ' checked by brute force');
}

/* МБГ Есен, 3 клас, задачи 6–10: as printed, and by brute force. */
{
  const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, accepts, answers, eraseWays, digIneqCands, digIneqHolds, DIG_COND, SUMS_TWO, LEVELS }; })()');
  const has = (q, text) => { const s = strip(Q.drawQ(q)).replace(/\s+/g, ' '); if(s.indexOf(text) < 0) throw new Error(q.kind + ' does not read "' + text + '": ' + s); };
  // 6: 12 · 31 · 41 → 24, the erased digits add to 3, whichever way
  const w6 = Q.eraseWays([12, 31, 41], 3).filter(w => w.vals.reduce((a, b) => a*b, 1) === 24);
  if(!w6.length || w6.some(w => w.gone.reduce((a, b) => a + b, 0) !== 3)) throw new Error('task 6: 12 · 31 · 41 → 24 should always erase digits adding to 3');
  // 7: sums of two two-digit numbers that are two-digit: 20 … 99, 80 of them
  const q7 = {kind:'sums', shape:3, v:0, lo:20, hi:99, ans:80};
  has(q7, 'Колко различни двуцифрени числа можем да получим при събирането на две двуцифрени числа?');
  // 8: odd, differ by 2, two-digit product → units 5 or 3
  const q8 = {kind:'oddprod', odd:true, d:2, tens:false, pairs:[[1,3],[3,5],[5,7],[7,9]], two:[[3,5],[5,7],[7,9]], slots:2, ans:5, alt:[3]};
  has(q8, 'Разликата на две нечетни едноцифрени числа е 2, а произведението им е двуцифрено число.');
  if(!Q.accepts(q8, ['3', '5']) || Q.accepts(q8, ['5', '5'])) throw new Error('task 8: 5 and 3, in either order, and only those');
  // 9: the largest three-digit number with a one-digit digit product is 990 (0 is one-digit), digits add to 18
  const big9 = [...Array(900).keys()].map(i => i + 100).filter(Q.DIG_COND[5][2]).pop();
  if(big9 !== 990) throw new Error('task 9: the largest is 990, not ' + big9);
  // 10: two 1s and a 2, 300 − A < A − 100 → only 211
  const q10 = {kind:'digineq', a:1, b:2, cand: Q.digIneqCands(1, 2), more:true, c:300, d:100, ans:211};
  has(q10, 'такова, че 300 − A < A − 100?');
  if(q10.cand.join() !== '112,121,211' || q10.cand.filter(A => Q.digIneqHolds(q10, A)).join() !== '211') throw new Error('task 10: only 211 should work');

  const n = {};
  [64, 65, 66, 67, 68].forEach(id => { for(let i = 0; i < 300; i++){
    const q = Q.raw(id);
    n[id] = (n[id] || 0) + 1;
    if(!Q.accepts(q, Q.answers(q).map(String))) throw new Error('level ' + id + ': its own answers are refused');
    if(q.kind === 'erasemul'){
      const hit = Q.eraseWays(q.nums, 3).filter(w => w.vals.reduce((a, b) => a*b, 1) === q.T);
      if(!hit.length || hit.some(w => w.gone.reduce((a, b) => a + b, 0) !== q.ans)) throw new Error('erasemul: ' + q.nums.join('·') + ' → ' + q.T + ' is not always ' + q.ans);
    }
    if(q.kind === 'sums'){
      const got = new Set();
      for(let x = 10; x <= 99; x++) for(let y = 10; y <= 99; y++){ const r = Q.SUMS_TWO[q.v][2](x, y); if(r >= 0 && Q.SUMS_TWO[q.v][3](r)) got.add(r); }
      if(got.size !== q.ans) throw new Error('sums: variant ' + q.v + ' counts ' + got.size + ', not ' + q.ans);
    }
    if(q.kind === 'oddprod'){
      const want = new Set();
      for(let x = 0; x <= 9; x++) for(let y = x; y <= 9; y++)
        if(y - x === q.d && x % 2 === (q.odd ? 1 : 0) && x*y >= 10 && x*y <= 99) want.add(q.tens ? Math.floor(x*y / 10) : x*y % 10);
      const got = [q.ans].concat(q.alt);
      if(got.length !== want.size || got.some(v => !want.has(v)) || q.slots !== want.size) throw new Error('oddprod: ' + got + ' vs ' + [...want]);
    }
    if(q.kind === 'digprod'){
      const all = [...Array(900).keys()].map(i => i + 100).filter(Q.DIG_COND[q.c][2]), m = q.big ? all[all.length - 1] : all[0];
      if(m !== q.n || String(m).split('').reduce((a, b) => a + +b, 0) !== q.ans) throw new Error('digsum: ' + q.n + ' → ' + q.ans);
    }
    if(q.kind === 'digineq'){
      const ok = q.cand.filter(A => Q.digIneqHolds(q, A));
      if(ok.length !== 1 || ok[0] !== q.ans || q.d < 1 || q.cand.some(A => q.c - A < 0 || A - q.d < 0)) throw new Error('digineq: ' + JSON.stringify(q));
    }
  }});
  console.log('МБГ Есен 3 клас, задачи 6–10: as printed (3, 80, 5 or 3, 18, 211), and ' + Object.values(n).reduce((a, b) => a + b, 0) + ' more by brute force');
}

/* МБГ Есен, 3 клас, задачи 11–15: as printed, and by brute force. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, LEVELS }; })()');
  const orig = [
    [{kind:'star', k:4, P:9, n:8, ans:45}, 45], [{kind:'segpts', k:5, p:5, d:5, ans:35}, 35],
    [{kind:'midpt', AB:32, half:16, m:4, toB:true, ans:20}, 20], [{kind:'trisq', t:4, d:2, ans:5}, 5],
    [{kind:'tiles', w:3, h:4, m:2, u:2, R:12, sq:8, dom:[[1,0],[2,1]], ans:28}, 28]
  ];
  orig.forEach(([q, want]) => { if(!Q.drawQ(q) || q.ans !== want) throw new Error(q.kind + ': the printed task should give ' + want); });
  const n = {};
  [69, 70, 71, 72, 73].forEach(id => { for(let i = 0; i < 300; i++){
    const q = Q.raw(id);
    n[q.kind] = (n[q.kind] || 0) + 1;
    if(!Number.isInteger(q.ans) || q.ans < 1 || q.ans > 999) throw new Error(q.kind + ': answer ' + q.ans);
    // each one worked the long way round
    if(q.kind === 'star'){ const side = q.P*10 / q.n; if(Math.abs(4*side - q.ans) > 1e-9) throw new Error('star: 4 · ' + side + ' is not ' + q.ans); }
    if(q.kind === 'segpts'){ let x = 0; for(let j = 0; j <= q.k; j++) x += q.p; if(x + q.d !== q.ans) throw new Error('segpts'); }
    if(q.kind === 'midpt'){ const A = 0, B = q.AB, M = B / 2, N = M - q.m; if(!(N > A) || (q.toB ? B - N : N - A) !== q.ans) throw new Error('midpt'); }
    if(q.kind === 'trisq'){ const side = 3*q.t / 3, P = side - q.d; if(P*10 / 4 !== q.ans) throw new Error('trisq'); }
    if(q.kind === 'tiles'){
      if(q.w*q.h !== q.sq + 2*q.m || q.dom.some(([r, c]) => c + 1 >= q.w) || new Set(q.dom.map(d => d[0])).size !== q.m) throw new Error('tiles: the tiling does not fit');
      const side = q.R / 6; if(2*(q.w + q.h)*side !== q.ans) throw new Error('tiles');
    }
  }});
  console.log('МБГ Есен 3 клас, задачи 11–15: as printed (45 мм, 35 см, 20 км, 5 мм, 28 см), and ' + Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' worked the long way');
}

/* МБГ Есен, 3 клас, задачи 16–20: as printed, and by brute force. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, accepts, answers, circPairs }; })()');
  // 16: 12 ◎ 4 = 16 : 8 = 2
  if((12 + 4) / (12 - 4) !== 2 || !Q.circPairs().some(([a, b]) => a === 12 && b === 4)) throw new Error('task 16: 12 ◎ 4 should be 2');
  // 17: column 1 = 8, row 1 = 6, row 2 = 4 → column 2 = 3, and a whole-number filling exists
  let fill = 0;
  for(let a = 1; a <= 8; a++) for(let b = 1; b <= 6; b++) for(let c = 1; c <= 8; c++) for(let d = 1; d <= 4; d++)
    if(a*c === 8 && a*b === 6 && c*d === 4){ fill++; if(b*d !== 3) throw new Error('task 17: a filling gives ' + b*d); }
  if(!fill) throw new Error('task 17: no whole-number filling');
  // 18: 2, 3, 5, 6, 7, 18 by 3 → 2 or 5, both accepted in either order, nothing else
  const q18 = {kind:'dropone', nums:[2,3,5,6,7,18], m:3, tot:41, slots:2, ans:2, alt:[5]};
  if(!Q.accepts(q18, ['5', '2']) || Q.accepts(q18, ['2', '3'])) throw new Error('task 18: 2 and 5');
  [2, 3, 5, 6, 7, 18].forEach(v => { if(((41 - v) % 3 === 0) !== (v === 2 || v === 5)) throw new Error('task 18: leaving out ' + v); });
  // 19: 6, 8, 24, 16 → 6, 8, 6, 4 → 12, 8, 12, 4 → 36
  const q19 = {kind:'rewrite', nums:[6,8,24,16], d:4, m:3, p:2, s1:[6,8,6,4], s2:[12,8,12,4], ans:36};
  if(q19.s2.reduce((a, b) => a + b, 0) !== 36 || !Q.drawQ(q19)) throw new Error('task 19: 36');
  // 20: under 30, 7 each is 4 short, 6 each is exact → 24
  const hits20 = [...Array(29).keys()].filter(N => N > 0 && N % 6 === 0 && 7*(N / 6) - N === 4);
  if(hits20.join() !== '24') throw new Error('task 20: ' + hits20);

  const n = {};
  [74, 75, 76, 77, 78].forEach(id => { for(let i = 0; i < 300; i++){
    const q = Q.raw(id);
    n[q.kind] = (n[q.kind] || 0) + 1;
    if(!Q.accepts(q, Q.answers(q).map(String))) throw new Error('level ' + id + ': its own answers are refused');
    if(q.kind === 'circop' && ((q.x + q.y) % Math.abs(q.x - q.y) || (q.x + q.y) / Math.abs(q.x - q.y) !== q.ans)) throw new Error('circop: ' + q.x + ' ◎ ' + q.y);
    if(q.kind === 'prodgrid'){
      const [a, b, c, d] = q.c, sh = [a*c, a*b, c*d, b*d];
      if(sh[q.ask] !== q.ans || sh[q.pair[0]]*sh[q.pair[1]] !== sh[q.same]*q.ans) throw new Error('prodgrid: ' + q.c);
    }
    if(q.kind === 'dropone'){
      const want = q.nums.filter(v => (q.tot - v) % q.m === 0), got = Q.answers(q);
      if(q.tot !== q.nums.reduce((a, b) => a + b, 0) || want.join() !== got.slice().sort((x, y) => x - y).join()) throw new Error('dropone: ' + q.nums + ' by ' + q.m);
    }
    if(q.kind === 'rewrite'){
      const s1 = q.nums.map(v => v >= 10 ? v / q.d : v), s2 = s1.map(v => v % q.m === 0 ? v * q.p : v);
      if(s1.some(v => !Number.isInteger(v)) || s2.reduce((a, b) => a + b, 0) !== q.ans) throw new Error('rewrite: ' + q.nums);
    }
    if(q.kind === 'twoshare'){
      const ok = [...Array(q.L).keys()].filter(N => { for(let k = 1; k <= N; k++){
        const exact = q.over ? q.a : q.b, other = q.over ? q.b : q.a;
        if(exact*k === N && (q.over ? N - other*k === q.s : other*k - N === q.s)) return true; } return false; });
      if(ok.join() !== String(q.ans)) throw new Error('twoshare: under ' + q.L + ' gives ' + ok);
    }
  }});
  console.log('МБГ Есен 3 клас, задачи 16–20: as printed (2, 3, 2 or 5, 36, 24), and ' + Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' by brute force');
}

/* МБГ Зима 2024, 2 клас: the whole paper. Tasks 6, 7, 10, 14, 15, 19 and 20 are levels the
   autumn papers already had (also:['mbg-winter-2024-2']); the rest are levels 79–89. Each
   printed task is solved as printed against the official key, and the new kinds by brute force. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, answers, LEVELS, PINWHEEL, lettersSolve }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
  const text = q => strip(Q.drawQ(q)).replace(/&gt;/g, '>').replace(/&lt;/g, '<');
  const printed = (task, q, want, shows) => {
    const got = Q.answers(q);
    if(got[0] !== want) throw new Error('Зима 2024 task ' + task + ': gives ' + got + ', the key says ' + want);
    if(shows && text(q).replace(/\s+/g, '').indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error('Зима 2024 task ' + task + ' is not drawn as printed: ' + text(q));
  };
  printed(1, {kind:'fifty', shape:0, base:50, nums:[1,49,2,48], sub:60, T:100, ans:40}, 40, '1 + 49 + 2 + 48 − 60');
  printed(2, {kind:'fifty', shape:1, base:50, nums:[1,2,48,49], T:100, ans:10}, 10, '1 + 2 + 48 + 49');
  printed(3, {kind:'fifty', shape:2, base:50, nums:[3,4,47,46], other:[11,22,33], S:66, T:100, ans:34}, 34, 'сборът 3 + 4 + 47 + 46 е по-голям от сбора 11 + 22 + 33');
  printed(4, {kind:'pickfit', nums:[9,10,11], add:1, n:11, more:true, fits:[11], ans:1}, 1, '□ + 1 > 11');
  printed(5, {kind:'samesub', M:88, s:11, X:22, plus:false, given:0, ans:11}, 11, '22 − ■, ако 88 − ■ = 88 − 11');
  printed(8, {kind:'stepdig', k:3, start:0, first:[0,3,6,9], ones:4, twos:[12,15,18,21,24,27,30,33,36,39], digits:24, ans:39}, 39, '0, 3, 6, 9, …, x са записани с 24 цифри');
  printed(9, {kind:'zerofac', long:'1 · 2 + 2 · 3 + 3 · 4 + 5 · 6', zero:'1 + 2 + 3 − 6', first:false, add:0, ans:0}, 0, '(1 · 2 + 2 · 3 + 3 · 4 + 5 · 6) · (1 + 2 + 3 − 6)');
  printed(11, {kind:'sqoff', W:10, H:6, cuts:[6,4,2,2], ans:4}, 4, '10 см на 6 см');
  printed(12, {kind:'pinwheel', L:10, P:80, dm:true, long:true, ans:10}, 10, 'обиколка 8 дм');
  printed(13, {kind:'pyramid', w:3, shown:3, n:4, rows:[3,9,15,21], last:false, ans:48}, 48, 'в 4 реда');
  printed(16, {kind:'balloons', k:3, m:3, rest:12, T:21, ans:15}, 15, 'общо 21 балона, като 3 деца имат по 3 балона');
  printed(17, {kind:'age', bg:'Клеър', uk:'Клер', she:1, m:3, now:5, a:10, b:5, shape:1, ans:10}, 10, 'След 10 години Клеър ще бъде 3 пъти по-голяма');
  printed(18, {kind:'letters', d:1, e:7, N:86, R:69, B:6, CA:9, minus:true, ans:3}, 3, 'C + 1A + B7 = 86');
  // the new kinds' own brute-force answers for the printed ones
  if(String(Q.lettersSolve(1, 7, 86).map(s => s.C + s.A - s.B).filter((v, i, a) => a.indexOf(v) === i)) !== '3') throw new Error('task 18: C + A − B is not only 3');
  // the tasks on older levels, worked out here from the printed numbers
  const key = { 6: 99 - 50 + 1, 7: [0,1,2,3].filter(v => !(93 - 79 < v + 11)).reduce((a, b) => a + b, 0),
    10: [13,14,15,16,17,18,19].filter(n => n % 2 === 0 && n % 3 === 0)[0],
    14: 2*(4 + 2)*2 + 2*(6 + 2), 15: [...Array(90).keys()].map(v => v + 10).filter(v => { const t = Math.floor(v/10), o = v % 10; return (t === 6 && o < 6) || (o === 6 && t < 6); }).length,
    19: 20 - (20 - 12) - 2, 20: 22 - (31 - 13) };
  const want = {6:50, 7:6, 10:18, 14:40, 15:11, 19:10, 20:4};
  Object.keys(want).forEach(k => { if(key[k] !== want[k]) throw new Error('Зима 2024 task ' + k + ': ' + key[k] + ', the key says ' + want[k]); });
  // …and those levels really ask that kind of question
  const asks = {12: /по-малки от \d+ и са по-големи от \d+/, 16: /сбора на всички .*НЕ е вярно/, 49: /две равни събираеми и като сбор на три|три равни събираеми и като сбор на две/,
    19: /правоъгълници, които не са квадрати/, 18: /една от цифрите на които е \d+ , а другата е по-малка/, 38: /не са зелени/, 39: /не ми достигат, за да имам/i};
  Object.keys(asks).forEach(id => {
    const L = Q.LEVELS.find(l => l.id === +id);
    if(!L.papers.includes('mbg-winter-2024-2')) throw new Error('level ' + id + ' is not tagged Зима 2024');
    let hit = false;
    for(let i = 0; i < 4000 && !hit; i++) hit = asks[id].test(text(Q.raw(+id)).replace(/\s+/g, ' '));
    if(!hit) throw new Error('level ' + id + ' never asks the Зима 2024 question ' + asks[id]);
  });

  const n = {};
  [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89].forEach(id => { for(let i = 0; i < 400; i++){
    const q = Q.raw(id), a = q.ans;
    n[q.kind] = (n[q.kind] || 0) + 1;
    if(Q.LEVELS.find(l => l.id === id).papers.join() !== 'mbg-winter-2024-2') throw new Error('level ' + id + ' should be on the Зима 2024 paper');
    const fail = m => { throw new Error(q.kind + ': ' + m + ' ' + JSON.stringify(q)); };
    if(q.kind === 'fifty'){
      const T = q.nums.reduce((x, y) => x + y, 0);
      if(T % 10 || (q.shape === 0 ? T - q.sub : q.shape === 1 ? T / 10 : T - q.other.reduce((x, y) => x + y, 0)) !== a || a < 0) fail('the sum');
    }
    if(q.kind === 'pickfit' && q.nums.filter(v => q.more ? v + q.add > q.n : v + q.add < q.n).length !== a) fail('the count');
    if(q.kind === 'pickfit' && !q.nums.some(v => v + q.add === q.n)) fail('no try lands on the edge');
    if(q.kind === 'samesub'){
      const box = [...Array(200).keys()].filter(b => q.given === 0 ? q.M - b === q.M - q.s : b + q.M === q.M + q.s);
      if(box.length !== 1 || (q.plus ? q.X + box[0] : q.X - box[0]) !== a) fail('the box');
    }
    if(q.kind === 'stepdig'){
      let digits = 0; for(let v = q.start; v <= a; v += q.k) digits += String(v).length;
      if(digits !== q.digits || (a - q.start) % q.k) fail('the digits');
    }
    if(q.kind === 'zerofac' && eval(text(q).replace(/·/g, '*').replace(/−/g, '-').replace(/[^0-9+\-*() ]/g, '')) !== a) fail('the value');
    if(q.kind === 'sqoff' && (q.cuts.reduce((x, s) => x + s*s, 0) !== q.W*q.H || q.cuts.length !== a)) fail('the squares');
    if(q.kind === 'pinwheel'){
      const s = q.L / 2, P = Q.PINWHEEL.reduce((t, p, j) => { const r = Q.PINWHEEL[(j + 1) % 12]; return t + (Math.abs(p[0] - r[0]) + Math.abs(p[1] - r[1]))*s; }, 0);
      if(P !== q.P || (q.long ? q.L : s) !== a || (q.dm && q.P % 10)) fail('the perimeter');
    }
    if(q.kind === 'pyramid'){
      const count = q.w*q.n*q.n, cubes = (text(q), (Q.drawQ(q).match(/<polygon/g) || []).length / 3);
      if(cubes !== q.w*q.shown*q.shown || (q.last ? q.w*(2*q.n - 1) : count) !== a) fail('the boxes');
    }
    if(q.kind === 'balloons'){
      const kids = [...Array(60).keys()].filter(c => c >= q.k && q.k*q.m + (c - q.k) === q.T);
      if(kids.length !== 1 || kids[0] !== a) fail('the children');
    }
    if(q.kind === 'age'){
      const now = [...Array(40).keys()].filter(x => x && x + q.a === q.m*x);
      if(now.length !== 1 || (q.shape ? now[0] + q.b : now[0]) !== a) fail('the age');
    }
    if(q.kind === 'letters'){
      const vals = new Set();
      for(let A = 0; A <= 9; A++) for(let B = 1; B <= 9; B++) for(let C = 0; C <= 9; C++)
        if(new Set([A, B, C]).size === 3 && C + (10*q.d + A) + (10*B + q.e) === q.N) vals.add(q.minus ? C + A - B : A + B + C);
      if(vals.size !== 1 || !vals.has(a)) fail('the letters');
    }
  }});
  console.log('МБГ Зима 2024 2 клас: all 20 printed tasks match the official key (40, 10, 34, 1, 11, 50, 6, 39, 0, 18, 4, 10, 48, 40, 11, 15, 10, 3, 10, 4); 7 older levels tagged and asking the same question; ' +
    Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' by brute force');
}

/* Коледно математическо състезание 2025 (СМБ, секция „Изток“), 2 клас: the whole paper. Task 2
   is level 18 (also:['kms-2025-2']); tasks 1 and 3–10 are levels 90–98. Each printed task is
   solved as printed against the official key, and every new kind is checked by brute force. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, answers, accepts, LEVELS, TEXT, isoTriIs, santaWays, WORDPOS }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
  const text = q => strip(Q.drawQ(q)).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, '');
  const printed = (task, q, want, shows) => {
    const got = Q.answers(q)[0];
    if(got !== want) throw new Error('КМС 2025 task ' + task + ': gives ' + got + ', the key says ' + want);
    if(shows && text(q).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error('КМС 2025 task ' + task + ' is not drawn as printed: ' + text(q));
  };
  // 1: the six triangles as drawn, each [points in its band, band height] — 4 are not isosceles
  const t1 = [[[[0.5,0],[0,1],[2,1]],1], [[[1,0],[3,2],[5,2]],2], [[[0,1],[4,0],[4,1]],1], [[[3,0],[1,2],[5,2]],2], [[[0,1],[3,0],[4,1]],1], [[[2,0],[0,1],[4,1]],1]]
    .map(([t, h]) => ({ t, h }));
  const iso1 = t1.map(x => Q.isoTriIs(x.t));
  printed(1, {kind:'isotri', tris:t1, iso:iso1, asksNot:true, ans: iso1.filter(v => !v).length}, 4);
  printed(3, {kind:'rectdm', a:16, b:24, P:80, ans:8}, 8, '16 см и 24 см');
  printed(4, {kind:'minuend', d:4, which:0, asks:0, sub:0, ans:4}, 4, 'Разликата на две числа е 4');
  printed(5, {kind:'consec', t:5, s:5, X:9, small:true, ans:4}, 4, 'цифра на десетиците 5');
  printed(7, {kind:'diffseq', seq:[25,24,21,16,9,0], down:true, d0:1, g:2, asksSum:true, ans:95}, 95, '25, 24, 21, 16, 9, ?');
  printed(8, {kind:'daily', bg:'Иво', uk:'Іво', she:0, a:3, d:9, k:4, days:[3,12,21,30,39], shape:0, ans:69}, 69, 'Иво изминал с колелото си 3 км');
  printed(9, {kind:'isoperim', s:9, P:36, up:12, leg:21, down:14, base:7, ans:49}, 49, 'Обиколката на квадрат е 36 см');
  printed('10А', {kind:'santa', shape:0, a:1, b:7, c:4, e:10, f:5, back:11, on:15, ans:29}, 29);
  const rows10 = [[10,5,5],[5,2,0],[12,0,6]];
  printed('10Б', {kind:'santa', shape:1, rows:rows10, per: rows10.map(([F, s, p]) => 2*(s || F) + (p || F) + F), ans:81}, 81);
  printed('10В', {kind:'santa', shape:2, T:81, R:19, k:6, ways:Q.santaWays(19, 6), ans:Q.santaWays(19, 6).length}, 3);
  // 6: КОЛЕДА ten times, the 46th letter from the right is Л
  { const w = Q.WORDPOS[0][0], long = w.repeat(10);
    if(long[long.length - 46] !== 'Л') throw new Error('task 6: the 46th letter from the right is ' + long[long.length - 46]); }
  // 2: level 18 asks exactly this, and 7 two-digit numbers have digit sum 7
  if([...Array(90).keys()].map(v => v + 10).filter(v => Math.floor(v/10) + v % 10 === 7).length !== 7) throw new Error('task 2 should be 7');
  { const L = Q.LEVELS.find(l => l.id === 18); let hit = false;
    if(!L.papers.includes('kms-2025-2')) throw new Error('level 18 is not tagged КМС 2025');
    for(let i = 0; i < 4000 && !hit; i++) hit = /Колкодвуцифреничислаиматсборнацифрите/.test(text(Q.raw(18)));
    if(!hit) throw new Error('level 18 never asks the КМС 2025 question'); }
  // every paper a level names has its full name and its tag, in every language
  const srcs = [...new Set(Q.LEVELS.flatMap(l => l.papers).filter(p => p !== 'basics').map(p => p.replace(/-\d+$/, '')))];
  ['bg', 'uk', 'en'].forEach(lang => srcs.forEach(s => {
    if(!Q.TEXT[lang].papers[s] || !Q.TEXT[lang].paperTag[s]) throw new Error(lang + ' has no name for the paper ' + s);
  }));

  const n = {};
  [90, 91, 92, 93, 94, 95, 96, 97, 98].forEach(id => { for(let i = 0; i < 400; i++){
    const q = Q.raw(id), a = q.ans;
    n[q.kind] = (n[q.kind] || 0) + 1;
    const fail = m => { throw new Error(q.kind + ': ' + m + ' ' + JSON.stringify(q)); };
    if(Q.LEVELS.find(l => l.id === id).papers.join() !== 'kms-2025-2') fail('not on the КМС 2025 paper');
    if(q.kind === 'isotri'){
      const eq = (p, r, s) => { const d = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]), x = d(p, r), y = d(r, s), z = d(s, p);
        return Math.abs(x - y) < 1e-9 || Math.abs(y - z) < 1e-9 || Math.abs(z - x) < 1e-9; };
      const isoN = q.tris.filter(x => eq(...x.t)).length;
      if((q.asksNot ? q.tris.length - isoN : isoN) !== a) fail('the count');
      if(q.tris.some(x => x.t.some(([u, v]) => u < 0 || u > 5 || v < 0 || v > x.h))) fail('a triangle leaves its band');
    }
    if(q.kind === 'rectdm' && (2*(q.a + q.b) !== 10*a)) fail('the perimeter');
    if(q.kind === 'minuend'){
      const ok = v => q.which === 1 ? v >= 10 && v <= 99 : q.which === 2 ? v >= 1 : v >= 0;
      let best = Infinity;
      for(let y = 0; y < 200; y++) if(ok(y) && ok(y + q.d)) best = Math.min(best, q.asks ? 2*y + q.d : y + q.d);
      if(best !== a) fail('the smallest');
    }
    if(q.kind === 'consec'){
      const X = (10*q.t + 9) - 10*q.s, m = [...Array(100).keys()].filter(v => v + v + 1 === X);
      if(m.length !== 1 || (q.small ? m[0] : m[0] + 1) !== a) fail('the pair');
    }
    if(q.kind === 'wordpos'){
      [0, 1].forEach(lang => {
        const w = Q.WORDPOS[q.w][lang], long = w.repeat(q.n), at = q.right ? long.length - q.p : q.p - 1;
        if(q.options[q.pick].text[lang] !== long[at]) fail('the letter');
        if(new Set(q.options.map(o => o.text[lang])).size !== 4) fail('two options are the same letter');
      });
      if(!Q.accepts(q, [String(q.pick)]) || Q.accepts(q, [String((q.pick + 1) % 4)])) fail('the right option');
    }
    if(q.kind === 'diffseq'){
      const st = q.seq.slice(1).map((v, j) => v - q.seq[j]), dd = st.slice(1).map((v, j) => v - st[j]);
      if(new Set(dd).size !== 1 || (q.asksSum ? q.seq.reduce((x, y) => x + y, 0) : q.seq[5]) !== a || q.seq.some(v => v < 0)) fail('the run');
    }
    if(q.kind === 'daily'){
      const d = [q.a]; for(let j = 0; j < q.k; j++) d.push(d[j] + q.d);
      if((q.shape === 0 ? d[q.k] + d[q.k - 1] : q.shape === 1 ? d[q.k] : d.reduce((x, y) => x + y, 0)) !== a) fail('the days');
    }
    if(q.kind === 'isoperim'){
      const s = q.P / 4, leg = s + q.up, base = leg - q.down;
      if(!(base > 0 && base < 2*leg) || 2*leg + base !== a) fail('the triangle');
    }
    if(q.kind === 'santa' && q.shape === 0){
      // shortest paths between the houses over the five roads, then 1 → 2 → 3 → 4 → 5
      const D = [...Array(6)].map((_, i) => [...Array(6)].map((_, j) => i === j ? 0 : Infinity));
      [[1,2,q.a],[2,3,q.b],[2,4,q.c],[4,5,q.e],[3,5,q.f]].forEach(([x, y, w]) => { D[x][y] = D[y][x] = w; });
      for(let k = 1; k <= 5; k++) for(let x = 1; x <= 5; x++) for(let y = 1; y <= 5; y++) D[x][y] = Math.min(D[x][y], D[x][k] + D[k][y]);
      if(D[1][2] + D[2][3] + D[3][4] + D[4][5] !== a) fail('the route');
    }
    if(q.kind === 'santa' && q.shape === 1 && q.rows.reduce((t, [F, s, p]) => t + (s || F)*2 + (p || F) + F, 0) !== a) fail('the tickets');
    if(q.kind === 'santa' && q.shape === 2){
      let ways = 0; const M = [1, 2, 5, 10, 20, 50];
      (function walk(j, left, cnt){ if(j === M.length){ if(left === 0 && cnt === q.k) ways++; return; }
        for(let c = 0; c*M[j] <= left && cnt + c <= q.k; c++) walk(j + 1, left - c*M[j], cnt + c); })(0, 100 - q.T, 0);
      if(ways !== a) fail('the change');
    }
  }});
  console.log('КМС 2025 2 клас: all 10 printed tasks match the official key (4, 7, 8, 4, 4, Л, 95, 69, 49; 29, 81, 3 ways); level 18 tagged; ' +
    Object.keys(n).map(k => n[k] + ' ' + k).join(', ') + ' by brute force');
}

/* МБГ Есен 2025, 2 клас: every task is a level the app already had (levels 8–26, tagged
   also:['mbg-autumn-2025-2']). Each printed task is built as that level's question, answered
   against the official key, drawn as printed — and the level's own generator is sampled until it
   asks exactly that question, so the printed task is one she can really meet. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, drawQ, eqText, answers, accepts, LEVELS, DAYS }; })()');
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const T = (op, n) => ({ op, n }), chain = (...xs) => xs.map((x, i) => i ? T(x < 0 ? '−' : '+', Math.abs(x)) : T('', x));
  const metExact = [], metLike = [];
  const paper = [
    [1,  8,  {kind:'chain', terms: chain(2, 0, 2, 6, -2, 0, -2, -5), paired:0, ans:1}, [1], '2 + 0 + 2 + 6 − 2 + 0 − 2 − 5'],
    [2,  9,  {kind:'pairs', shape:'tens', base:10, terms: chain(1, 9, 2, 8, 3, 7, 5, -33), paired:3, extra:5, subs:[33], ans:2}, [2], '1 + 9 + 2 + 8 + 3 + 7 + 5 − 33'],
    [3,  10, {kind:'cmp', shape:0, a:20, b:26, big:46, small:10, flip:false, ans:36}, [36], 'сборът 20 + 26 е по-голям от сбора 2 + 0 + 2 + 6'],
    [4,  11, {kind:'box', a:10, b:6, x:12, y:9, box:3, r:3, ans:7}, [7], '6 − ◯ = 12 − 9'],
    [5,  12, {kind:'count', sum:false, shape:0, natural:false, two:false, n:5, lo:0, hi:5, ans:6}, [6], 'не са по-големи от 5'],
    [6,  13, {kind:'named', shape:1, R:20, ans:1}, [1], 'С колко полученият сбор е по-малък от 20'],
    [7,  14, {kind:'grow', k:3, d:5, up:true, base:4, ans:19}, [19], 'Сборът на три числа е 4'],
    [8,  15, {kind:'erase', set:[3,4,7,9,11], d:3, bigger:true, gone:7, ans:27}, [27], '3, 4, 7, 9 и 11'],
    [9,  9,  {kind:'pairs', shape:'sub', terms: chain(11, -1, 12, -2, 13, -3, 14, -5), paired:4, ans:39}, [39], '11 − 1 + 12 − 2 + 13 − 3 + 14 − 5'],
    [10, 16, {kind:'ineq', shape:0, A:20, B:17, L:3, C:2, ans:2}, [2], '20 − 17 < ? + 2'],
    [11, 17, {kind:'sumdiff', a:8, d:2, slots:2, ans:18, alt:[14]}, [14, 18], 'едно от които е 8, ако разликата им е 2'],
    [12, 18, {kind:'digits', shape:1, ans:19}, [19], 'сборовете, които се срещат само веднъж'],
    [13, 19, {kind:'rects', shape:0, W:3, H:2, c:1, r:1, wide:3, tall:2, ans:6}, [6], 'в които има мравка'],
    [14, 20, {kind:'line', d1:3, d2:11, right:true, back:true, ans:8}, [8], 'На 3 см вдясно'],
    [15, 21, {kind:'sqcut', parts:2, side:4, small:2, shape:0, ans:8}, [8], 'Квадрат със страна 4 см е разрязан на четири еднакви квадрата'],
    [16, 22, {kind:'shared', shape:0, P:24, p1:16, p2:18, ans:5}, [5], 'обиколка 24 см разрязали на два триъгълника с обиколки 16 см и 18 см'],
    [17, 23, {kind:'place', t:9, u:7, N:97, k:9, R:88, a:2, shape:0, ans:22}, [22], '□△ − 9 = 88'],
    [18, 24, {kind:'sums', shape:0, k:2, top:18, ans:19}, [19], 'сбор на две едноцифрени числа'],
    [19, 25, {kind:'weekday', n:22, q:3, r:1, day:Q.DAYS[1], slots:2, ans:3, alt:[4]}, [3, 4], 'Колко вторника може да има сред 22 последователни дни'],
    [20, 26, {kind:'seq', a:[2,1,3,4,6,5,7,9,10,8], hits:[3,4,7], ans:3}, [3], '2, 1, 3, 4, 6, 5, 7, 9, 10, 8']
  ];
  paper.forEach(([task, id, q, key, shows]) => {
    const got = Q.answers(q).slice().sort((x, y) => x - y);
    if(got.join() !== key.join()) throw new Error('Есен 2025 task ' + task + ': gives ' + got + ', the key says ' + key);
    if(!Q.accepts(q, key.map(String)) || (key.length > 1 && !Q.accepts(q, key.slice().reverse().map(String)))) throw new Error('Есен 2025 task ' + task + ': the key is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error('Есен 2025 task ' + task + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    if(!Q.LEVELS.find(l => l.id === id).papers.includes('mbg-autumn-2025-2')) throw new Error('level ' + id + ' is not tagged Есен 2025');
    // exactly this question, or — where the numbers are too many to meet by chance (a long chain) —
    // the same question with its numbers masked: the same wording, the same signs in the same places
    const sig = g => Q.eqText(g) + '|' + strip(Q.drawQ(g)), mask = t => t.replace(/\d+/g, '#');
    const want = sig(q);
    let exact = false, like = false;
    for(let n = 0; n < 100000 && !exact; n++){ const g = Q.raw(id); if(g.kind !== q.kind) continue; const s = sig(g); exact = s === want; like = like || mask(s) === mask(want); }
    if(!exact && !like) throw new Error('Есен 2025 task ' + task + ': level ' + id + ' never asks a question of that form');
    (exact ? metExact : metLike).push(task);
  });
  // 20: worked out here as well, not only by the level
  const a20 = [2,1,3,4,6,5,7,9,10,8], hits = a20.filter((v, i) => a20.every((w, j) => j === i || (j < i ? w < v : w > v)));
  if(hits.join() !== '3,4,7') throw new Error('task 20: ' + hits);
  console.log('МБГ Есен 2025 2 клас: all 20 printed tasks match the official key (1, 2, 36, 7, 6, 1, 19, 27, 39, 2, 14 и 18, 19, 6, 8, 8, 5, 22, 19, 3 и 4, 3); its level asks exactly the printed question for tasks ' + metExact.join(', ') +
    (metLike.length ? ', and the same question with other numbers for tasks ' + metLike.join(', ') : ''));
}
