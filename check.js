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
for(const L of [1,2,7,4,5,6,3,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]){
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
console.log('checked ' + checked + ' questions across ' + 22 + ' levels: arithmetic, worked line, summary line and layout all agree');
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
for(const L of [19, 21]){
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
`;
eval(head + body + test);
