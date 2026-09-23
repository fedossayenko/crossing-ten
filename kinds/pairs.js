// Question kind 'pairs': level 9 1 + 9 + 2 + 8 — Chains that simplify by grouping — into tens, ± pairs, or terms that cancel.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 2: the terms pair up into tens. A pair making ten is always odd+odd or
// even+even (1+9, 3+7, 2+8) — that parity is the tell she learns to spot.
function genPairs(){ return Math.random() < 0.5 ? genPairsTens() : genPairsSub(); }
function genPairsTens(){
  if(Math.random() < 0.35){
    // Pairs making twenty — a single digit with a teen — and the whole chain may come
    // out at nothing, which is a perfectly good answer.
    const k = 2 + rnd(2);
    const pairs = shuffle([[5,15],[6,14],[7,13],[8,12],[9,11]]).slice(0, k);
    const terms = [];
    pairs.forEach(pr => shuffle(pr.slice()).forEach(n => terms.push({op:'+', n})));
    const ans = rnd(10);
    terms.push({op:'−', n: k*20 - ans});
    terms[0].op = '';
    return {kind:'pairs', shape:'tens', base:20, terms, paired:k, extra:0, subs:[k*20 - ans], ans};
  }
  const two = Math.random() < 0.5;               // two subtrahends need room for a two-digit one
  const k = two ? 3 + rnd(2) : 2 + rnd(2);
  const pairs = shuffle([[1,9],[2,8],[3,7],[4,6],[5,5]]).slice(0, k);
  const terms = [];
  pairs.forEach(p => terms.push({op:'+', n:p[0]}, {op:'+', n:p[1]}));
  if(!two){
    const extra = 1 + rnd(9), ans = 1 + rnd(9);
    terms.push({op:'+', n:extra}, {op:'−', n: k*10 + extra - ans});
    terms[0].op = '';
    return {kind:'pairs', shape:'tens', base:10, terms, paired:k, extra, subs:[k*10 + extra - ans], ans};
  }
  // …or ending in two subtrahends, which group into a round number of their own: 11 + 9 = 20
  const m = 2 + rnd(k - 2);                      // m >= 2 keeps the first subtrahend two-digit
  const off = Math.random() < 0.5 ? 0 : 1 + rnd(3);
  const s2 = 1 + rnd(9), s1 = 10*m - s2 + off;
  terms.push({op:'−', n:s1}, {op:'−', n:s2});
  terms[0].op = '';
  return {kind:'pairs', shape:'tens', base:10, terms, paired:k, extra:0, subs:[s1, s2], ans: k*10 - s1 - s2};
}
// Задача 1: every middle number is taken away and put straight back, so the whole
// chain collapses to the first number minus the last. Walking it left to right works
// too — spotting that it need not be walked is the point.
function genCancel(){
  const start = 8 + rnd(13);
  const k = 3 + rnd(2);
  let mids;
  if(Math.random() < 0.5){                       // the worksheet shape: a step down each time
    mids = [];
    for(let i = 1; i <= k; i++) mids.push(start - i);
  } else {
    mids = shuffle(Array.from({length: start - 1}, (_, i) => i + 1)).slice(0, k);
  }
  const terms = [{op:'', n:start}];
  mids.forEach((n, i) => { terms.push({op:'−', n}); if(i < k - 1) terms.push({op:'+', n}); });
  return {kind:'pairs', shape:'cancel', terms, start, last: mids[k-1], ans: start - mids[k-1]};
}
// Задача 9: ± pairs that each come to ten — 11 − 1, 12 − 2, 13 − 3 — with the last
// pair usually breaking the pattern, so the structure is checked and not assumed.
function genPairsSub(){
  if(Math.random() < 0.3) return genCancel();
  if(Math.random() < 0.4){
    // Задача 19: one minuend throughout, subtrahends climbing — so the differences
    // count down and pair off from the ends.
    const M = 12 + rnd(12);
    const k = 4 + rnd(3);
    const terms = [];
    for(let i = 0; i <= k; i++) terms.push({op: i ? '+' : '', n: M}, {op:'−', n: M - k + i});
    return {kind:'pairs', shape:'run', terms, M, k, paired:k + 1, ans: k*(k+1)/2};
  }
  const start = 11 + rnd(10);
  const k = 3 + rnd(2);
  const terms = [];
  let total = 0;
  for(let i = 0; i < k; i++){
    const big = start + i;
    const twist = i === k-1 && Math.random() < 0.75;
    const small = big - 10 + (twist ? 1 + rnd(3) : 0);
    terms.push({op: i ? '+' : '', n: big}, {op:'−', n: small});
    total += big - small;
  }
  return {kind:'pairs', shape:'sub', terms, paired:k, ans: total};
}

function drawPairs(q){
  if(q.kind === 'chain' || q.kind === 'pairs'){
    const e = exprText(q.terms) + ' = ';
    return '<div class="line" style="font-size:clamp(19px,calc((100vw - 56px)/' +
           (e.length*0.56).toFixed(2) + '),40px)">' + e + SLOT + '</div>';
  }
}
function eqPairs(q){
  return exprText(q.terms) + ' = ' + q.ans;
}
function whyPairs(q, full){
  if(q.kind === 'pairs' && q.shape === 'cancel'){
    if(!full) return 'Всяко число по средата се маха и веднага се връща.';
    const gone = q.terms.filter(t => t.op === '+').map(t => t.n);
    return gone.map(n => '−' + n + ' + ' + n).join(', ') + ' — всяко дава нула &nbsp;→&nbsp; остава <b>' +
      q.start + ' − ' + q.last + '</b> = ' + q.ans;
  }
  if(q.kind === 'pairs' && q.shape === 'run'){
    if(!full) return 'Извади всяка двойка — числата, които получаваш, вървят надолу.';
    const vals = [];
    for(let i = q.k; i >= 0; i--) vals.push(i);
    return q.M + ' − ' + (q.M - q.k) + ' = ' + q.k + ', ' + q.M + ' − ' + (q.M - q.k + 1) + ' = ' + (q.k - 1) +
      ', … &nbsp;→&nbsp; ' + vals.join(' + ') + ' = ' + q.ans;
  }
  if(q.kind === 'pairs' && q.shape === 'sub'){
    if(!full) return 'Групирай ги по двойки — всяка дава кръгло число.';
    const ts = q.terms;
    let g = '', run = 0, odd = '', rest = 0;
    for(let k = 0; k < ts.length; k += 2){
      const v = ts[k].n - ts[k+1].n;
      const piece = '(' + ts[k].n + ' − ' + ts[k+1].n + ')';
      if(v === 10){ g += (g ? ' + ' : '') + '<b>' + piece + '</b>'; run += v; }
      else { odd += (odd ? ', ' : '') + piece + ' = ' + v; rest += v; }
    }
    if(!odd) return g + ' = ' + q.ans;
    return g + ' = <b>' + run + '</b>, &nbsp;после ' + odd + ' &nbsp;→&nbsp; ' +
      run + ' + ' + rest + ' = ' + q.ans;
  }
  if(q.kind === 'pairs'){
    if(!full) return 'Търси двойки, които заедно правят кръгло число.';
    const ts = q.terms;
    let g = '';
    for(let k = 0; k < q.paired*2; k += 2) g += (g ? ' + ' : '') + '<b>(' + ts[k].n + ' + ' + ts[k+1].n + ')</b>';
    const total = q.paired*(q.base || 10) + q.extra;
    const head = g + (q.extra ? ' + ' + q.extra : '') + ' = <b>' + total + '</b>';
    if(q.subs.length === 1) return head + ' &nbsp;→&nbsp; ' + total + ' − ' + q.subs[0] + ' = ' + q.ans;
    return head + ', &nbsp;а ' + q.subs[0] + ' + ' + q.subs[1] + ' = <b>' + (q.subs[0] + q.subs[1]) +
      '</b> &nbsp;→&nbsp; ' + total + ' − ' + (q.subs[0] + q.subs[1]) + ' = ' + q.ans;
  }
}
KIND.pairs = { draw:drawPairs, eq:eqPairs, why:whyPairs };
