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
for(const L of [1,2,7,4,5,6,3,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37]){
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
console.log('checked ' + checked + ' questions across ' + 37 + ' levels: arithmetic, worked line, summary line and layout all agree');
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
for(const L of [19, 21, 28, 29, 34]){
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
  if(q.ans < 1) throw new Error('grouping chain goes to zero or below');
  if(q.shape === 'tens'){
    tens++;
    if(q.subs.length === 2){ subs2++; if(q.subs[0] < 10) throw new Error('two-subtrahend chain leads with ' + q.subs[0]); }
  }
}
if(!subs2 || subs2 === tens) throw new Error('both endings should turn up: ' + subs2 + ' of ' + tens);
console.log('grouping chains: evaluate correctly, both endings appear, two-subtrahend ones lead with two digits');

// задача 5: the run must really follow the rule it claims, and the gaps must be its own terms
for(let i = 0; i < 4000; i++){
  const q = raw(27);
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
console.log('missing terms: every run follows its rule, gaps are its own terms, worksheet instance gives 3');

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
for(let i = 0; i < 4000; i++){
  const q = raw(29);
  if(q.a + q.b !== q.s1 || q.a + q.c !== q.s2 || q.a + q.b + q.c !== q.s3)
    throw new Error('fruit totals disagree with the values: ' + JSON.stringify(q));
  if(new Set(q.f).size !== 3) throw new Error('the three fruit must be different');
  const v = [q.a, q.b, q.c];
  if(v[q.askd[0]] - v[q.askd[1]] !== q.ans || q.ans < 1) throw new Error('fruit answer wrong');
}
console.log('fruit equations: totals match the values, three distinct fruit, answer stays positive');

// задача 11: the gaps are one fewer than the trees, whichever way round it is asked
for(let i = 0; i < 4000; i++){
  const q = raw(31);
  if(q.len !== (q.n - 1) * q.d) throw new Error('row length is not gaps times spacing');
  const want = q.shape === 0 ? q.len : q.shape === 1 ? q.n : q.d;
  if(q.ans !== want) throw new Error('trees answer wrong for shape ' + q.shape);
  if(q.n < 2) throw new Error('a row needs at least two trees');
}
console.log('trees in a row: length, count and spacing agree in all three directions');

// задача 12: conversions and the cut both land on whole centimetres
for(let i = 0; i < 4000; i++){
  const q = raw(32);
  if(q.shape === 0){
    if(q.toCm && q.ans !== q.n * q.u.cm) throw new Error('to-cm conversion wrong');
    if(!q.toCm && q.cm !== q.ans * q.u.cm) throw new Error('from-cm conversion wrong');
  } else {
    if(q.target !== q.t * q.u.cm) throw new Error('target length wrong');
    const want = q.shape === 1 ? q.L - q.target : q.target - q.L;
    if(want !== q.ans || q.ans < 1) throw new Error('ribbon answer wrong');
  }
}
console.log('lengths: conversions are exact and the ribbon always needs a real cut or addition');

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
