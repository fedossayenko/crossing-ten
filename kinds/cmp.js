// Question kind 'cmp': level 10 С колко? — How much bigger one sum is than the other.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const spread = n => String(n).split('').join(' + ');

// Задача 19: two runs stepping by two, one starting odd and one even. Paired off they
// differ by one at a time, so only the odd one out at the end really matters.
const RUNNERS = ['Деми', 'Мария', 'Ния', 'Ива'];
function genRuns(){
  for(;;){
    const a0 = 2 + 2*rnd(3), b0 = a0 + (Math.random() < 0.5 ? 1 : -1);
    if(b0 < 1) continue;
    const na = 6 + rnd(4), nb = na + rnd(3) - 1;   // both about as long as the printed ones
    const A = [], B = [];
    for(let i = 0; i < na; i++) A.push(a0 + 2*i);
    for(let i = 0; i < nb; i++) B.push(b0 + 2*i);
    const sa = A.reduce((t, v) => t + v, 0), sb = B.reduce((t, v) => t + v, 0);
    if(sa === sb) continue;
    const nm = shuffle(RUNNERS.slice()).slice(0, 2);
    return {kind:'cmp', runs:1, A, B, sa, sb, nm, back: Math.random() < 0.5,
            big: sa > sb ? 0 : 1, ans: Math.abs(sa - sb)};
  }
}
function genNear(){
  if(Math.random() < 0.3){
    // Задача 8: round tens, and one term the same on both sides — that pair cancels on
    // sight, and the rest are whole tens apart.
    for(;;){
      const same = rnd(3), d = [], L = [], R = [];
      for(let i = 0; i < 3; i++){
        if(i === same){ d.push(0); continue; }
        const k = 1 + rnd(3);                  // never nothing, or a second term would cancel too
        d.push(10 * (Math.random() < 0.5 ? k : -k));
      }
      const tot = d.reduce((t, v) => t + v, 0);
      if(tot <= 0) continue;
      let ok = true;
      for(let i = 0; i < 3; i++){
        R.push(10*(2 + rnd(7)));
        L.push(R[i] + d[i]);
        if(L[i] < 10 || L[i] > 100) ok = false;
      }
      if(ok) return {kind:'cmp', shape:3, tens:1, L, R, ans: tot, flip: Math.random() < 0.4};
    }
  }
  for(;;){
    const n = 3, L = [], R = [], d = [];
    for(let i = 0; i < n; i++) d.push(rnd(5) - 2);
    d[rnd(n)] = 10 * (1 + rnd(2)) + rnd(3);   // one whole ten at least, or the pairing buys nothing
    let tot = 0, ok = true;
    for(let i = 0; i < n; i++){
      R.push(1 + rnd(12));
      L.push(R[i] + d[i]);
      if(L[i] < 1 || d[i] === 0) ok = false;   // a pair that says nothing is a pair she has to read for nothing
      tot += d[i];
    }
    if(ok && tot > 0) return {kind:'cmp', shape:3, L, R, ans: tot, flip: Math.random() < 0.4};
  }
}
function genCmp(){
  if(Math.random() < 0.16) return genRuns();
  const pickShape = Math.random();
  if(pickShape < 0.22) return genNear();
  if(pickShape < 0.45){
    if(Math.random() < 0.45){
      // Задача 16: written out as one bracket take away another, with the second bracket
      // in a different order — so the terms have to be matched, not lined up.
      const n = 5 + rnd(2), start = 3 + rnd(8), step = 2 + rnd(3), terms = [];
      for(let i = 0; i < n; i++) terms.push(start + i*step);
      const drop = [1 + rnd(n - 2)];                      // never the first or the last, which are easy to spot
      const kept = shuffle(terms.filter((_, i) => drop.indexOf(i) < 0));
      if(kept.every((v, i) => !i || v > kept[i-1])) kept.reverse();   // same order as the first bracket gives it away
      return {kind:'cmp', shape:1, written:1, terms, kept,
              gone: drop.map(i => terms[i]), ans: terms[drop[0]]};
    }
    // Задача 3: the two sums share terms, so the shared ones cancel and only the
    // leftovers matter.
    const n = 3 + rnd(2);
    const terms = [];
    for(let i = 0; i < n; i++) terms.push(10 * (1 + rnd(5)));
    const drop = shuffle(terms.map((_, i) => i)).slice(0, 1 + rnd(Math.min(2, n - 2))).sort((x, y) => x - y);
    const kept = terms.filter((_, i) => drop.indexOf(i) < 0);
    return {kind:'cmp', shape:1, terms, kept, gone: drop.map(i => terms[i]),
            ans: drop.reduce((t, i) => t + terms[i], 0)};
  }
  if(pickShape < 0.70){
    if(Math.random() < 0.35){
      // Задача 3: the very same two numbers, added once and taken away once — so the
      // smaller one is the whole of the gap, twice over.
      const y = 3 + rnd(15), x = y + 2 + rnd(30);
      return {kind:'cmp', shape:2, same:1, x, y, p:x, q:y, S: x + y, D: x - y, less:false, ans: 2*y};
    }
    // Задача 4: a sum against a difference.
    for(;;){
      const x = 2 + rnd(18), y = 2 + rnd(18);
      const p = 20 + rnd(60), q = 5 + rnd(Math.min(40, p - 5));
      const S = x + y, D = p - q;
      if(S === D) continue;
      return {kind:'cmp', shape:2, x, y, p, q, S, D, less: D > S, ans: Math.abs(D - S)};
    }
  }
  for(;;){
    const a = 10 + rnd(40), b = 10 + rnd(40);
    const big = a + b, small = (a%10) + Math.floor(a/10) + (b%10) + Math.floor(b/10);
    if(big > 89 || big - small < 10) continue;
    return {kind:'cmp', shape:0, a, b, big, small, flip: Math.random() < 0.3, ans: big - small};
  }
}

function drawCmp(q){
  if(q.kind === 'cmp' && q.shape === 3){
    const L = '<span class="num">' + q.L.join(' + ') + '</span>';
    const R = '<span class="num">' + q.R.join(' + ') + '</span>';
    return '<div class="ask">' + (q.flip
        ? 'С колко сборът ' + R + ' е <b>по-малък</b> от сбора ' + L + '?'
        : 'С колко сборът ' + L + ' е <b>по-голям</b> от сбора ' + R + '?') +
      '</div><div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp' && q.runs){
    const line = a => '<span class="num">' + a.join(' + ') + '</span>';
    const small = 1 - q.big;
    return '<div class="ask"><b>' + q.nm[0] + '</b> пресметнала вярно ' + line(q.A) + ', а <b>' +
      q.nm[1] + '</b> пресметнала вярно ' + line(q.back ? q.B.slice().reverse() : q.B) +
      '. С колко сборът на <b>' + q.nm[q.big] + '</b> е по-голям от сбора на <b>' + q.nm[small] + '</b>?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp' && q.written){
    return '<div class="ask">Пресметнете</div>' +
      '<div class="given">(' + q.terms.join(' + ') + ') − (' + q.kept.join(' + ') + ')</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp' && q.shape === 1){
    return '<div class="ask">С колко сборът <span class="num">' + q.terms.join(' + ') +
      '</span> е <b>по-голям</b> от сбора <span class="num">' + q.kept.join(' + ') + '</span>?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp' && q.shape === 2){
    return '<div class="ask">С колко сборът <span class="num">' + q.x + ' + ' + q.y +
      '</span> е <b>' + (q.less ? 'по-малък' : 'по-голям') + '</b> от разликата <span class="num">' +
      q.p + ' − ' + q.q + '</span>?</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp'){
    const A = '<span class="num">' + q.a + ' + ' + q.b + '</span>';
    const B = '<span class="num">' + spread(q.a) + ' + ' + spread(q.b) + '</span>';
    return '<div class="ask">' + (q.flip
        ? 'С колко сборът ' + B + ' е по-малък от сбора ' + A + '?'
        : 'С колко сборът ' + A + ' е по-голям от сбора ' + B + '?') +
      '</div><div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCmp(q){
  if(q.kind === 'cmp' && q.shape === 3) return q.L.join('+') + ' срещу ' + q.R.join('+') + ' → ' + q.ans;
  if(q.kind === 'cmp' && q.shape === 1) return q.terms.join('+') + ' срещу ' + q.kept.join('+') + ' → ' + q.ans;
  if(q.kind === 'cmp' && q.runs) return q.sa + ' срещу ' + q.sb + ' → ' + q.ans;
  if(q.kind === 'cmp' && q.same) return q.x + '±' + q.y + ' → ' + q.S + ' и ' + q.D + ' → ' + q.ans;
  if(q.kind === 'cmp' && q.shape === 2) return '(' + q.x + '+' + q.y + ') срещу (' + q.p + '−' + q.q + ') → ' + q.ans;
  if(q.kind === 'cmp') return '(' + q.a + ' + ' + q.b + ') − (' + spread(q.a) + ' + ' + spread(q.b) + ') = ' + q.ans;
}
function whyCmp(q, full){
  if(q.kind === 'cmp' && q.shape === 3){
    if(!full) return 'Сравни ги по двойки, вместо да събираш.';
    const pr = [], ds = q.L.map((v, i) => v - q.R[i]);
    q.L.forEach((v, i) => pr.push(ds[i] === 0 ? v + ' е поравно'
      : v + ' е с ' + Math.abs(ds[i]) + (ds[i] > 0 ? ' повече' : ' по-малко')));
    // the gains added up first, then the losses taken off — so the running total never dips
    const bits = ds.filter(d => d).sort((x, y) => y - x)
      .map((d, i) => (i ? (d < 0 ? ' − ' : ' + ') : '') + Math.abs(d));
    return 'по двойки: ' + pr.join(', ') + ' &nbsp;→&nbsp; ' + bits.join('') + ' = ' + q.ans;
  }
  if(q.kind === 'cmp' && q.shape === 1){
    if(!full) return 'Общите събираеми се съкращават.';
    const rest = q.gone.length === 1 ? 'остава само ' + q.ans
                                     : 'остава ' + q.gone.join(' + ') + ' = ' + q.ans;
    return 'общите събираеми ' + q.kept.slice().sort((a, b) => a - b).join(' + ') +
      ' се съкращават &nbsp;→&nbsp; ' + rest;
  }
  if(q.kind === 'cmp' && q.runs){
    if(!full) return 'Събирай всеки от двата сбора по двойки от двата края.';
    const show = a => a[0] + ' + ' + a[1] + ' + … + ' + a[a.length-1];
    return q.nm[0] + ': ' + show(q.A) + ' = <b>' + q.sa + '</b>, &nbsp;' + q.nm[1] + ': ' + show(q.B) +
      ' = <b>' + q.sb + '</b> &nbsp;→&nbsp; ' + Math.max(q.sa, q.sb) + ' − ' + Math.min(q.sa, q.sb) +
      ' = ' + q.ans;
  }
  if(q.kind === 'cmp' && q.same){
    if(!full) return 'Двете числа са едни и същи — какво прави по-малкото веднъж горе и веднъж долу?';
    return q.y + ' веднъж се прибавя и веднъж се изважда &nbsp;→&nbsp; цялата разлика е двойно по-голяма от ' +
      q.y + ' &nbsp;→&nbsp; ' + q.y + ' + ' + q.y + ' = ' + q.ans;
  }
  if(q.kind === 'cmp' && q.shape === 2){
    if(!full) return 'Пресметни сбора и разликата поотделно.';
    return q.x + ' + ' + q.y + ' = <b>' + q.S + '</b>, &nbsp;' + q.p + ' − ' + q.q + ' = <b>' + q.D +
      '</b> &nbsp;→&nbsp; ' + Math.max(q.S, q.D) + ' − ' + Math.min(q.S, q.D) + ' = ' + q.ans;
  }
  if(q.kind === 'cmp'){
    if(!full) return 'Пресметни двата сбора, после извади по-малкия.';
    return q.a + ' + ' + q.b + ' = <b>' + q.big + '</b>, &nbsp;' + spread(q.a) + ' + ' + spread(q.b) +
           ' = <b>' + q.small + '</b> &nbsp;→&nbsp; ' + q.big + ' − ' + q.small + ' = ' + q.ans;
  }
}
KIND.cmp = { draw:drawCmp, eq:eqCmp, why:whyCmp };
