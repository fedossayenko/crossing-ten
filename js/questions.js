// Turning a level into a question, and a question into what the page shows. The
// worksheet kinds do their own drawing in kinds/*.js; the plain sums are drawn here.

function raw(level){
  for(;;){
    let a, b;
    if(level === 1){ a = 20 + rnd(80); b = 2 + rnd(8); if(a%10 >= b) continue; return {a,b,op:'-'}; }
    if(level === 2){ a = 23 + rnd(77); b = 11 + rnd(a-12); if(b%10 === 0 || a%10 >= b%10) continue; if(a-b < 1) continue; return {a,b,op:'-'}; }
    if(level === 4){ a = 4 + rnd(6); b = 2 + rnd(8); if(a + b <= 10) continue; return {a,b,op:'+'}; }
    if(level === 5){ a = 13 + rnd(70); b = 8 + rnd(40); if(a%10 + b%10 < 10) continue; if(a + b > 99) continue; return {a,b,op:'+'}; }
    if(level === 6){ a = 45 + rnd(50); b = 16 + rnd(60); if(a%10 + b%10 < 10) continue; if(a + b <= 100 || a + b > 165) continue; return {a,b,op:'+'}; }
    if(level === 7){ a = 101 + rnd(60); b = 12 + rnd(85); if(a%10 >= b%10) continue; if(a - b >= 100 || a - b < 15) continue; return {a,b,op:'-'}; }
    const lv = LEVELS.find(l => l.id === level);
    if(lv && lv.gen) return lv.gen();
    return raw(2);                        // an id that is not a level: fall back to the staple
  }
}
// Weighted rejection sampling: a crossing step she keeps missing is likelier to come up.
function gen(level){
  let best = null;
  for(let i = 0; i < 36; i++){
    const q = raw(level);
    const w = W.m[factKey(q)];
    if(w === undefined) return q;
    if(Math.random() < w / W.max) return q;
    best = q;
  }
  return best || raw(level);
}
// A sum whose crossing step is exactly this fact, built from the digits rather than
// sampled: the borrow-only levels cannot produce a no-borrow fact at all.
function genForFact(key){
  const op = key[0], pr = key.slice(2).split('-').map(Number), o = pr[0], bo = pr[1];
  if(op === '-'){
    const bt = 1 + rnd(7);
    const t = bt + 1 + rnd(9 - bt);
    return { a:t*10 + o, b:bt*10 + bo, op:'-' };
  }
  const cap = (o + bo >= 10) ? 8 : 9;
  const t = 1 + rnd(Math.min(4, cap - 1));
  const bt = 1 + rnd(cap - t);
  return { a:t*10 + o, b:bt*10 + bo, op:'+' };
}
const answer = q => q.kind ? q.ans : (q.op === '-' ? q.a - q.b : q.a + q.b);
const answers = q => [answer(q)].concat(q.alt || []);
// One box: any accepted answer will do. Several: every answer, once each, in any
// order — and the count is taken from the question, never from what was typed.
function accepts(q, parts){
  if(parts.some(p => p === '')) return false;   // an empty box is not a zero
  const want = answers(q), got = parts.map(Number), n = q.slots || 1;
  if(got.length !== n) return false;
  if(n === 1) return want.indexOf(got[0]) >= 0;
  return want.length === n && got.every((v, i) => want.indexOf(v) >= 0 && got.indexOf(v) === i);
}

function drawQ(q){
  if(!q.kind){
    return '<div class="sum" title="Tap to hear it">' +
      '<div class="op" style="visibility:hidden" aria-hidden="true">−</div><div>' + q.a + '</div>' +
      '<div class="op">' + (q.op === '-' ? '−' : '+') + '</div><div>' + q.b + '</div>' +
      '<div class="rule"></div>' + SLOT + '</div>';
  }
  return KIND[q.kind].draw(q);
}

function eqText(q){
  if(!q.kind) return q.a + ' ' + (q.op === '-' ? '−' : '+') + ' ' + q.b + ' = ' + answer(q);
  return KIND[q.kind].eq(q);
}

// On a first miss she gets the method, not the answer; the worked line comes after.
function why(q, full){
  if(q.kind) return KIND[q.kind].why(q, full);
  const a = q.a, b = q.b, o = a%10, t = a-o, bo = b%10, bt = b-bo;
  if(q.op === '-'){
    if(o < bo){
      const lend = t - 10, ones = o + 10;
      const head = a + ' = <b>' + lend + ' + ' + ones + '</b>';
      return full ? head + ' &nbsp;→&nbsp; ' + ones + ' − ' + bo + ' = ' + (ones-bo) + ', &nbsp;' + lend + ' − ' + bt + ' = ' + (lend-bt) : head;
    }
    return full ? o + ' − ' + bo + ' = ' + (o-bo) + ', &nbsp;' + t + ' − ' + bt + ' = ' + (t-bt) + ' &nbsp;(no borrow needed)'
                : 'No borrow needed — the ones, then the tens.';
  }
  if(a < 10 && b < 10){
    const up = 10 - a;
    const head = b + ' = <b>' + up + ' + ' + (b-up) + '</b>';
    return full ? head + ' &nbsp;→&nbsp; ' + a + ' + ' + up + ' = 10, &nbsp;10 + ' + (b-up) + ' = ' + (a+b) : head;
  }
  if(o + bo >= 10){
    const head = o + ' + ' + bo + ' = <b>' + (o+bo) + '</b>';
    return full ? head + ' &nbsp;→&nbsp; ' + t + ' + ' + bt + ' = ' + (t+bt) + ', &nbsp;' + (t+bt) + ' + ' + (o+bo) + ' = ' + (a+b) : head;
  }
  return full ? o + ' + ' + bo + ' = ' + (o+bo) + ', &nbsp;' + t + ' + ' + bt + ' = ' + (t+bt) + ' &nbsp;(no carry needed)'
              : 'No carry needed — the ones, then the tens.';
}
