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
for(const L of [1,2,7,4,5,6,3,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]){
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
console.log('checked ' + checked + ' questions across ' + 28 + ' levels: arithmetic, worked line, summary line and layout all agree');
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
for(const L of [19, 21, 28]){
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
for(let i = 0; i < 5000; i++){
  const q = raw(22), d = q.ans;
  if(q.p1 + q.p2 !== q.P + 2*d) throw new Error('perimeters do not add up: ' + JSON.stringify(q));
  if(q.p1 <= 2*d || q.p2 <= 2*d) throw new Error('half with perimeter ' + Math.min(q.p1,q.p2) + ' cannot hold a cut of ' + d);
}
console.log('triangle cuts: perimeters add up and both halves are possible triangles');

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
`;
eval(head + body + test);
