// Question kind 'pairs': level 9 1 + 9 + 2 + 8 — Chains that simplify by grouping — into tens, ± pairs, or terms that cancel.

// Задача 2: the terms pair up into tens. A pair making ten is always odd+odd or
// even+even (1+9, 3+7, 2+8) — that parity is the tell she learns to spot.
import { KIND, chainLine, exprText, rnd, shuffle, tr } from '../js/core.js';
export function genPairs(){ return Math.random() < 0.5 ? genPairsTens() : genPairsSub(); }
function genPairsTens(){
  if(Math.random() < 0.15){
    // Зима 2022: pairs that make different round numbers (2 + 8 = 10, 12 + 18 = 30), then two
    // equal round numbers taken away: 2 + 8 + 12 + 18 − 20 − 20 = 0
    const k = 2 + rnd(2), terms = [], sums = [];
    for(let i = 0; i < k; i++){
      const base = [10, 20, 30][rnd(3)], x = base === 30 ? 11 + rnd(4) : 1 + rnd(base === 10 ? 4 : 9);
      const pr = [x, base - x];
      if(terms.some(t => pr.includes(t.n))) { i--; continue; }
      pr.forEach(n => terms.push({op:'+', n})); sums.push(base);
    }
    const T = sums.reduce((a, b) => a + b, 0), sub = 10*(1 + rnd(Math.floor(T/20)));
    terms.push({op:'−', n:sub}, {op:'−', n:sub});
    terms[0].op = '';
    return {kind:'pairs', shape:'tens', base:'mixed', sums, terms, paired:k, extra:0, subs:[sub, sub], ans: T - 2*sub};
  }
  if(Math.random() < 0.35){
    // Pairs making twenty — a single digit with a teen — and the whole chain may come
    // out at nothing, which is a perfectly good answer.
    // Зима 2023 and 2021 wrote the pairs in order (1 + 19 + 2 + 18 + 3 + 17), up to four of them,
    // with no take-away at all or a round one: the sum of the pairs is the whole point
    const k = 2 + rnd(3);
    const inOrder = Math.random() < 0.4;
    const pool = inOrder ? [[1,19],[2,18],[3,17],[4,16]].slice(0, k) : shuffle([[1,19],[2,18],[3,17],[4,16],[5,15],[6,14],[7,13],[8,12],[9,11]]).slice(0, k);
    const terms = [];
    pool.forEach(pr => (inOrder ? pr.slice() : shuffle(pr.slice())).forEach(n => terms.push({op:'+', n})));
    terms[0].op = '';
    const end = rnd(3);                                        // nothing taken away, a round ten, or down to a one-digit answer
    if(end === 0) return {kind:'pairs', shape:'tens', base:20, terms, paired:k, extra:0, subs:[], ans: k*20};
    const ans = end === 1 ? 10*rnd(2*k) : rnd(10);
    terms.push({op:'−', n: k*20 - ans});
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
  const tens = Math.random() < 0.3;             // Зима 2022: the same in round tens, 90 − 80 + 80 − 70 + 70 − 60
  const start = tens ? 5 + rnd(5) : 8 + rnd(13);
  const k = 3 + rnd(2);
  let mids;
  if(Math.random() < 0.5){                       // the worksheet shape: a step down each time
    mids = [];
    for(let i = 1; i <= k; i++) mids.push(start - i);
  } else {
    mids = shuffle(Array.from({length: start - 1}, (_, i) => i + 1)).slice(0, k);
  }
  const f = tens ? 10 : 1, terms = [{op:'', n:start*f}];
  mids.forEach((n, i) => { terms.push({op:'−', n:n*f}); if(i < k - 1) terms.push({op:'+', n:n*f}); });
  return {kind:'pairs', shape:'cancel', terms, start: start*f, last: mids[k-1]*f, ans: (start - mids[k-1])*f};
}
// Задача 9: ± pairs that each come to ten — 11 − 1, 12 − 2, 13 − 3 — with the last
// pair usually breaking the pattern, so the structure is checked and not assumed.
// Зима 2021: 100 − 99 + 99 − 98 + 97 − 96 — each neighbour pair is one apart, so each makes 1:
// (100 − 99) + (99 − 98) + (97 − 96) = 3, however the pairs are placed
function genOnes(){
  const k = 3 + rnd(2), pairs = [];
  let x = 20 + rnd(81);
  for(let i = 0; i < k; i++){ pairs.push([x, x - 1]); x -= 1 + rnd(2); }
  const terms = [];
  pairs.forEach(([a, b], i) => terms.push({op: i ? '+' : '', n:a}, {op:'−', n:b}));
  return {kind:'pairs', shape:'ones', pairs, terms, ans: k};
}
function genPairsSub(){
  if(Math.random() < 0.12) return genOnes();
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
// МБГ Пролет 2023 and 2025, 1 клас: 1 − 0 + 2 − 1 + 3 − 2 (each pair is 1), 1 + 2 + … + 6 − 5 − … − 1 (the
// way down takes back the way up but the top), 1 + 19 + 2 + 18 + … − 80 (pairs of twenty), and
// 11 − 1 + 12 − 2 + 13 − 3 + 14 − 24 (three tens, then 30 + 14 − 24).
// Пролет 2022 and 2021: 1 + 1 + 2 + 2 − 3 − 3 (two equal halves taken back: 0), 1 − 10 + 2 + 3 + 4 + 5 (too
// little to take 10 from at first, so the plus terms go first: 15 − 10 = 5), and 1 + 2 + 3 + 4 − 2 − 3 − 4
// (everything but the first comes off again: 1).
// Level 196, Пролет 2022 task 20 (the paper's last): 1 − 10 can't be worked left to right in 1st grade, so the
// plus terms go first. A level of its own: it undoes the left-to-right habit 155 and 156 build.
export function genPairsRegroup(){
  for(;;){
    const s = 1 + rnd(3), k = 3 + rnd(3), first = 2 + rnd(2), adds = [];
    for(let i = 0; i < k; i++) adds.push(first + i);
    const S = adds.reduce((t, v) => t + v, 0), B = s + 4 + rnd(9);   // more than the first number, never more than all of it
    if(B > s + S || B <= s) continue;
    const terms = [{op:'', n:s}, {op:'−', n:B}].concat(adds.map(n => ({op:'+', n})));
    // now and then the numbers counting down instead, drawn after the rest, so the others keep their seeds
    return Math.random() < 0.3 ? genPairsDown() : {kind:'pairs', shape:'regroup', s, B, adds, terms, ans: s + S - B};
  }
}
// МБГ Полуфинал 2022, 1 клас, задача 19: 5 − 10 + 5 + 4 + 3 + 2 + 1 — the first number added again and then every number
// down to 1, the take-away more than the first number, never more than all of it (shape 'down'). The paper shows how
// to move a take-away to the end first: 1 − 8 + 9 = 1 + 9 − 8.
function genPairsDown(){
  const n = 3 + rnd(3), adds = [];
  for(let i = n; i >= 1; i--) adds.push(i);
  const S = n*(n + 1)/2, B = n + 1 + rnd(S);
  const terms = [{op:'', n}, {op:'−', n:B}].concat(adds.map(v => ({op:'+', n:v})));
  return {kind:'pairs', shape:'down', s:n, B, adds, terms, ans: n + S - B};
}
// МБГ Полуфинал 2025, 1 клас, задача 3: 3 − 2 + 3 − 3 + 4 − 4 + 1 — after the first two numbers every number added
// is taken straight back, so 3 − 2 + 1 is all that is left (shape 'back').
export function genPairsShort(){
  const pick = rnd(7);
  if(pick === 6){
    const a = 2 + rnd(4), b = 1 + rnd(a - 1), k = 2 + rnd(2), cs = [], terms = [{op:'', n:a}, {op:'−', n:b}];
    for(let i = 0; i < k; i++){ const c = 1 + rnd(5); cs.push(c); terms.push({op:'+', n:c}, {op:'−', n:c}); }
    const e = 1 + rnd(3);
    terms.push({op:'+', n:e});
    return {kind:'pairs', shape:'back', a, b, cs, e, terms, ans: a - b + e};
  }
  if(pick === 4){
    const a = 1 + rnd(4), b = a + rnd(3), c = a + b, off = rnd(3), terms = [];
    [a, a, b, b].forEach((n, i) => terms.push({op: i ? '+' : '', n}));
    terms.push({op:'−', n:c}, {op:'−', n:c - off});
    return {kind:'pairs', shape:'twice', a, b, c, off, terms, ans: off};
  }
  if(pick === 5){
    const n = 3 + rnd(4), first = 1 + rnd(3), terms = [];
    for(let i = 0; i < n; i++) terms.push({op: i ? '+' : '', n:first + i});
    for(let i = 1; i < n; i++) terms.push({op:'−', n:first + i});
    return {kind:'pairs', shape:'upup', n, first, terms, ans: first};
  }
  if(pick === 0){
    const k = 3 + rnd(3), pairs = [];
    for(let i = 1; i <= k; i++) pairs.push([i, i - 1]);
    const terms = [];
    pairs.forEach(([a, b], i) => terms.push({op: i ? '+' : '', n:a}, {op:'−', n:b}));
    return {kind:'pairs', shape:'ones', pairs, terms, ans: k};
  }
  if(pick === 1){
    const n = 3 + rnd(5), terms = [];
    for(let i = 1; i <= n; i++) terms.push({op: i > 1 ? '+' : '', n:i});
    for(let i = n - 1; i >= 1; i--) terms.push({op:'−', n:i});
    return {kind:'pairs', shape:'updown', n, terms, ans: n};
  }
  if(pick === 2){
    const k = 2 + rnd(3), terms = [];
    for(let i = 1; i <= k; i++) terms.push({op: i > 1 ? '+' : '', n:i}, {op:'+', n:20 - i});
    const ans = Math.random() < 0.5 ? 0 : 10*rnd(2*k);
    terms.push({op:'−', n: 20*k - ans});
    return {kind:'pairs', shape:'tens', base:20, terms, paired:k, extra:0, subs:[20*k - ans], ans};
  }
  const start = 11, k = 2 + rnd(2), b = start + k, terms = [];
  for(let i = 0; i < k; i++) terms.push({op: i ? '+' : '', n: start + i}, {op:'−', n: 1 + i});
  const over = Math.random() < 0.5 ? 10 : 1 + rnd(9);   // the last pair takes away more than it adds
  terms.push({op:'+', n:b}, {op:'−', n: b + over});
  return {kind:'pairs', shape:'over', k, b, cut: b + over, terms, ans: 10*k - over};
}

function drawPairs(q){
  if(q.shape === 'down') return '<div class="given">' + tr('Пример:', 'Приклад:') +
    ['1 − 8 + 9 = 1 + 9 − 8 = 10 − 8 = 2', '1 − 5 + 2 + 3 = 1 + 2 + 3 − 5 = 6 − 5 = 1'].map(e => '<br><span style="white-space:nowrap">' + e + '</span>').join('') +
    '</div><div class="ask">' + tr('Пресметнете:', 'Обчисліть:') + '</div>' + chainLine(q.terms);
  return chainLine(q.terms);
}
function eqPairs(q){
  return exprText(q.terms) + ' = ' + q.ans;
}
function whyPairs(q, full){
  if(q.shape === 'back'){
    if(!full) return tr('Число, което се добавя и веднага се изважда, не променя нищо — такива двойки се махат.', 'Число, яке додають і відразу віднімають, нічого не змінює — такі пари знищуються.');
    return q.cs.map(c => '<b>+ ' + c + ' − ' + c + '</b>').join(', ') + tr(' — всяка двойка дава 0 &nbsp;→&nbsp; остава ', ' — кожна пара дає 0 &nbsp;→&nbsp; залишається ') +
      q.a + ' − ' + q.b + ' + ' + q.e + ' = ' + q.ans;
  }
  if(q.shape === 'twice'){
    if(!full) return tr('Събери първо всичко, което се добавя, после всичко, което се маха.', 'Спершу додай усе, що додається, потім усе, що віднімається.');
    return q.a + ' + ' + q.a + ' + ' + q.b + ' + ' + q.b + ' = <b>' + 2*(q.a + q.b) + '</b>, &nbsp;' + q.c + ' + ' + (q.c - q.off) + ' = <b>' + (2*q.c - q.off) + '</b> &nbsp;→&nbsp; ' + 2*(q.a + q.b) + ' − ' + (2*q.c - q.off) + ' = ' + q.ans;
  }
  if(q.shape === 'regroup' || q.shape === 'down'){
    if(!full) return tr('От първото число не може да се извади толкова. Събери първо числата с плюс, после извади.', 'Від першого числа стільки не відняти. Спершу додай числа з плюсом, потім відніми.');
    const S = q.s + q.adds.reduce((t, v) => t + v, 0);
    return q.s + ' + ' + q.adds.join(' + ') + ' − ' + q.B + ' = ' + S + ' − ' + q.B + ' = ' + q.ans;
  }
  if(q.shape === 'upup'){
    if(!full) return tr('Кои числа първо се добавят, а после се махат? Кое остава?', 'Які числа спершу додаються, а потім віднімаються? Що залишається?');
    const back = q.terms.filter(t => t.op === '−').map(t => t.n);
    return '+' + back.join(', +') + tr(' и ', ' і ') + '−' + back.join(', −') + tr(' се махат &nbsp;→&nbsp; остава ', ' знищуються &nbsp;→&nbsp; залишається ') + q.ans;
  }
  if(q.shape === 'updown'){
    if(!full) return tr('Всяко число, което после се изважда, връща обратно какво е добавено.', 'Кожне число, яке потім віднімається, забирає те, що додали.');
    const back = q.terms.filter(t => t.op === '−').map(t => t.n);
    return '+' + back.slice().reverse().join(', +') + tr(' и ', ' і ') + '−' + back.join(', −') + tr(' се махат &nbsp;→&nbsp; остава ', ' знищуються &nbsp;→&nbsp; залишається ') + q.ans;
  }
  if(q.shape === 'over'){
    if(!full) return tr('Групирай ги по двойки — всяка дава кръгло число. Последната двойка е друга.', 'Згрупуй їх парами — кожна дає кругле число. Остання пара інша.');
    const ts = q.terms, g = [];
    for(let i = 0; i < 2*q.k; i += 2) g.push('<b>(' + ts[i].n + ' − ' + ts[i + 1].n + ')</b>');
    return g.join(' + ') + ' = <b>' + 10*q.k + '</b> &nbsp;→&nbsp; ' + 10*q.k + ' + ' + q.b + ' − ' + q.cut + ' = ' + q.ans;
  }
  if(q.shape === 'ones'){
    if(!full) return tr('Събери ги по двойки — всяко число със следващото.', 'Об’єднай їх парами — кожне число з наступним.');
    return q.pairs.map(([a, b]) => '(' + a + ' − ' + b + ')').join(' + ') + ' = ' + q.pairs.map(() => 1).join(' + ') + ' = ' + q.ans;
  }
  if(q.shape === 'cancel'){
    if(!full) return tr('Всяко число по средата се маха и веднага се връща.', 'Кожне число посередині віднімається і відразу додається назад.');
    const gone = q.terms.filter(t => t.op === '+').map(t => t.n);
    return gone.map(n => '−' + n + ' + ' + n).join(', ') + tr(' — всяко дава нула &nbsp;→&nbsp; остава <b>', ' — кожна пара дає нуль &nbsp;→&nbsp; залишається <b>') +
      q.start + ' − ' + q.last + '</b> = ' + q.ans;
  }
  if(q.shape === 'run'){
    if(!full) return tr('Извади всяка двойка — числата, които получаваш, вървят надолу.', 'Обчисли кожну пару — числа, які виходять, зменшуються.');
    const vals = [];
    for(let i = q.k; i >= 0; i--) vals.push(i);
    return q.M + ' − ' + (q.M - q.k) + ' = ' + q.k + ', ' + q.M + ' − ' + (q.M - q.k + 1) + ' = ' + (q.k - 1) +
      ', … &nbsp;→&nbsp; ' + vals.join(' + ') + ' = ' + q.ans;
  }
  if(q.shape === 'sub'){
    if(!full) return tr('Групирай ги по двойки — всяка дава кръгло число.', 'Згрупуй їх парами — кожна дає кругле число.');
    const ts = q.terms;
    let g = '', run = 0, odd = '', rest = 0;
    for(let k = 0; k < ts.length; k += 2){
      const v = ts[k].n - ts[k+1].n;
      const piece = '(' + ts[k].n + ' − ' + ts[k+1].n + ')';
      if(v === 10){ g += (g ? ' + ' : '') + '<b>' + piece + '</b>'; run += v; }
      else { odd += (odd ? ', ' : '') + piece + ' = ' + v; rest += v; }
    }
    if(!odd) return g + ' = ' + q.ans;
    return g + ' = <b>' + run + '</b>, &nbsp;' + tr('после ', 'потім ') + odd + ' &nbsp;→&nbsp; ' +
      run + ' + ' + rest + ' = ' + q.ans;
  }
  if(!full) return tr('Търси двойки, които заедно правят кръгло число.', 'Шукай пари, які разом дають кругле число.');
  const ts = q.terms;
  let g = '';
  for(let k = 0; k < q.paired*2; k += 2) g += (g ? ' + ' : '') + '<b>(' + ts[k].n + ' + ' + ts[k+1].n + ')</b>';
  const total = (q.sums ? q.sums.reduce((a, b) => a + b, 0) : q.paired*(q.base || 10)) + q.extra;
  const head = g + (q.extra ? ' + ' + q.extra : '') + ' = <b>' + total + '</b>';
  if(!q.subs.length) return head.replace(/<b>(\d+)<\/b>$/, '$1');      // nothing taken away: the pairs are the answer
  if(q.subs.length === 1) return head + ' &nbsp;→&nbsp; ' + total + ' − ' + q.subs[0] + ' = ' + q.ans;
  return head + ', &nbsp;а ' + q.subs[0] + ' + ' + q.subs[1] + ' = <b>' + (q.subs[0] + q.subs[1]) +
    '</b> &nbsp;→&nbsp; ' + total + ' − ' + (q.subs[0] + q.subs[1]) + ' = ' + q.ans;
}
KIND.pairs = { draw:drawPairs, eq:eqPairs, why:whyPairs };
