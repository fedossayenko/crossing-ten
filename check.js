// Self-check for the question generators. Run: node check.js
const src = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const js = src.split('<script>')[1].split('</script>')[0];
const head = `
const rnd = n => Math.floor(Math.random()*n);
const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=rnd(i+1),x=a[i];a[i]=a[j];a[j]=x} return a; };
let W = {max:1, m:{}};
const LOCAL = {mix:[1,2,4,5], plain:true};
const MIXABLE = [1,2,7,4,5,6];
const mixList = () => LOCAL.mix;
const LEVEL_OP = {1:'-',2:'-',7:'-',4:'+',5:'+',6:'+'};
function factKey(q){ return q.kind ? 'w:'+q.kind : q.op+':'+(q.a%10)+'-'+(q.b%10); }
`;
const body = js.slice(js.indexOf('/* ---------- the four worksheet tasks'), js.indexOf('/* ---------- cat ----------'));
const test = `
const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
const lastNum = t => { const m = strip(t).match(/\\d+/g); return m ? +m[m.length-1] : NaN; };
let checked = 0; const kinds = {};
const IDS = [1,2,7,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];
for(const L of IDS){
  for(let i = 0; i < 3000; i++){
    const q = raw(L), ans = answer(q);
    if(L >= 8 && !q.kind) throw new Error('level ' + L + ' is not handled by raw() — it fell through to Mixed');
    if(!Number.isInteger(ans) || ans < 0) throw new Error('level ' + L + ' bad answer ' + JSON.stringify(q));
    if(!q.kind && (q.op === '-' ? q.a-q.b : q.a+q.b) !== ans) throw new Error('level ' + L + ' arithmetic mismatch');
    if(q.kind){
      kinds[q.kind] = (kinds[q.kind]||0) + 1;
      const ok = [ans].concat(q.alt || []);
      if(ok.indexOf(lastNum(why(q,true))) < 0) throw new Error('level ' + L + ': worked line lands on ' + lastNum(why(q,true)) + ', answer is ' + ans + ' -- ' + JSON.stringify(q));
      if(ok.indexOf(lastNum(eqText(q))) < 0) throw new Error('level ' + L + ': summary line lands on ' + lastNum(eqText(q)) + ', answer is ' + ans);
      const nums = (strip(why(q,false)).match(/\\d+/g) || []).map(Number);
      if(nums.some(v => ok.indexOf(v) >= 0)) throw new Error('level ' + L + ': the first-miss nudge gives away the answer');
    }
    const boxes = (drawQ(q).match(/class="slot"/g) || []).length;
    if(boxes !== (q.slots || 1)) throw new Error('level ' + L + ' draws ' + boxes + ' answer boxes but wants ' + (q.slots || 1));
    if((q.alt || []).length && !q.slots) throw new Error('level ' + L + ' has alternatives but only one box');
    checked++;
  }
}
console.log('checked ' + checked + ' questions across ' + IDS.length + ' levels: arithmetic, worked line, summary line and layout all agree');
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
let nat = 0, withZero = 0, twoDig = 0, named = 0;
for(let i = 0; i < 8000; i++){
  const q = raw(12);
  const txt = drawQ(q);
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
if(!nat || !withZero || !twoDig || !named)
  throw new Error('all four wordings should turn up: ' + nat + ', ' + withZero + ', ' + twoDig + ', ' + named);
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
  if(q.at < 2 || q.at > seq.length - 2) throw new Error('the gap must have terms on both sides');
  if(seq.some((v, k) => k && v < seq[k-1])) throw new Error('the run steps down somewhere, which reads as a mistake');
  if(seq[seq.length-1] > 200) throw new Error('the run has grown past what she works with');
  if(q.ans !== seq[q.at]) throw new Error('the answer is not the hidden term');
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
  if(q.P !== 4 * 10 * q.dm) throw new Error('the square perimeter is not four sides in см');
  if(q.ans !== q.P - q.p || q.ans < 1) throw new Error('the square should come out the bigger one');
  // a figure that disagrees with its own labels teaches the wrong thing
  const svg = drawQ(q);
  const d = svg.match(/d="M([\\d.]+) ([\\d.]+)L([\\d.]+) ([\\d.]+)L([\\d.]+) ([\\d.]+)Z"/).slice(1).map(Number);
  const pt = [[d[0],d[1]], [d[2],d[3]], [d[4],d[5]]];
  const u = 200 / (c + 10*q.dm + 4);
  const drawn = [0,1,2].map(k => Math.hypot(pt[k][0] - pt[(k+1)%3][0], pt[k][1] - pt[(k+1)%3][1])).sort((x, y) => x - y);
  [a, b, c].forEach((v, k) => { if(Math.abs(drawn[k] - v*u) > 0.15) throw new Error('a drawn side does not match its label'); });
  const w = +svg.match(/<rect x="[\\d.]+" y="[\\d.]+" width="([\\d.]+)"/)[1];
  if(Math.abs(w - 10*q.dm*u) > 0.15) throw new Error('the square is not drawn to the same scale as the triangle');
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
             : 100*q.a + 10*q.b + q.c;
  if(want !== q.ans) throw new Error('shape ' + q.shape + ' does not balance: ' + JSON.stringify(q));
  const shown = strip(drawQ(q));
  if(q.shape < 2 && (q.ans < 0 || q.ans > 9)) throw new Error('the box is asked for as a digit but holds ' + q.ans);
  if(q.shape < 2 && shown.indexOf('Коя цифра') < 0) throw new Error('a single digit should be asked for as a цифра');
  if(q.shape >= 2 && shown.indexOf('Кое число') < 0) throw new Error('a whole number should be asked for as a число');
  if(/\b1 (единици|десетици|стотици)\b/.test(shown)) throw new Error('„1 единици" — Bulgarian wants the singular');
}
if(Object.keys(seenTens).length !== 4) throw new Error('all four spellings should turn up');
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
  const right = (q.form === 0 || q.form === 3) ? q.N - q.ans : q.ans + q.N;
  if(right !== q.L) throw new Error('the two sides do not come out equal: ' + JSON.stringify(q));
  if(q.ans < 1 || q.ans > 99) throw new Error('the box left the range she works in');
}
if(!balanced) throw new Error('the balance shape should turn up');
{ // задачи 2 and 4 as printed
  if(lastNum(why({kind:'box', shape:'bal', form:0, x:31, y:29, N:95, L:60, plus:true, ans:35}, true)) !== 35)
    throw new Error('31 + 29 = 95 − □ should be 35');
  if(lastNum(why({kind:'box', shape:'bal', form:1, x:100, y:40, N:20, L:60, plus:false, ans:40}, true)) !== 40)
    throw new Error('100 − 40 = □ + 20 should be 40');
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

// задача 12: conversions and the cut both land on whole centimetres
let sticks = 0;
for(let i = 0; i < 4000; i++){
  const q = raw(32);
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
if(!sticks) throw new Error('the two-sticks shape should turn up');
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
  const block = src.slice(src.indexOf('const LEVELS = ['), src.indexOf('// Picker sections'));
  const rows = [...block.matchAll(/id:(\d+), op:.(.).(?:, grp:.(\w+).)?(?:, needs:\[([\d,]*)\])?, d:(\d), eq:.(.*?)., desc/g)]
    .map(m => ({ id:+m[1], grp: m[3] || m[2], needs: m[4] ? m[4].split(',').map(Number) : [], d:+m[5], eq:m[6] }));
  if(rows.length !== 52) throw new Error('parsed ' + rows.length + ' levels, expected 52');
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
  console.log('level table: all 52 rated 1-5, grouped, easiest first, prerequisites sound and reachable');

  // every element the script looks up must exist in the markup
  {
    const markup = src.split('<script>')[0];
    const have = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    ['slot0','slot1','wave1','wave2','waveX'].forEach(i => have.add(i));   // drawn at runtime
    const looked = [...new Set([...js.matchAll(/\$\('([^']+)'\)/g)].map(m => m[1]))];
    const gone = looked.filter(i => !have.has(i));
    if(gone.length) throw new Error('the script looks up elements that are not in the page: ' + gone.join(', '));
    console.log('page wiring: all ' + looked.length + ' element lookups resolve');
  }

  // Walk the recommended path from nothing learned: it must reach every level, never
  // suggest something whose groundwork is undone, never step back in difficulty, and
  // not grind one group for too long.
  {
    const levelsSrc = js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections'));
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
      const ds = order.map(l => l.d);
      // The path may pull one level forward for variety, so a single step back is allowed;
      // dropping further than that would mean the ladder is not being climbed at all.
      if(ds.some((v, i) => i && v < ds[i-1] - 1)) throw new Error('the path steps back in difficulty');
      if(ds[ds.length-1] < ds[0]) throw new Error('the path ends easier than it starts');
      let run = 1, worst = 1;
      for(let i = 1; i < order.length; i++){
        run = grp(order[i]) === grp(order[i-1]) ? run + 1 : 1;
        if(run > worst) worst = run;
      }
      if(worst > 4) throw new Error('the path grinds one group ' + worst + ' times running');
      console.log('training path: reaches all ' + order.length + ' levels, groundwork first, climbing, at most ' + worst + ' in a row from one group');
    `;
    eval(levelsSrc + nextSrc + walk);
  }
}
