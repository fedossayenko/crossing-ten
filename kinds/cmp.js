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
  if(Math.random() < 0.25){
    // Зима 2021, 2022: a run of numbers against the same run one higher, and maybe an odd pair at the
    // end: 20 + 21 + 22 + 23 + 6 against 19 + 20 + 21 + 22 + 8 — each is 1 more, 4 in all, less 2
    for(;;){
      const any = Math.random() < 0.4, m = any ? 4 + rnd(3) : 3 + rnd(3), st = 10 + rnd(30), R = [], L = [];
      // Зима 2021: any numbers, every one of them one more — 12 + 13 + 14 + 88 + 9 + 10 against 11 + 12 + 13 + 87 + 8 + 9
      const base = any ? shuffle([...Array(90).keys()].map(v => v + 2)).slice(0, m) : null;
      for(let i = 0; i < m; i++){ const r = any ? base[i] : st + i; R.push(r); L.push(r + 1); }
      if(!any && Math.random() < 0.6){ const e1 = 1 + rnd(9), e2 = 1 + rnd(9); if(e1 === e2) continue; L.push(e1); R.push(e2); }
      const tot = L.reduce((a, b) => a + b, 0) - R.reduce((a, b) => a + b, 0);
      if(tot <= 0) continue;
      return {kind:'cmp', shape:3, shift:1, L, R, ans: tot, flip: Math.random() < 0.6};
    }
  }
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
    // Есен 2024 spread a different number from the one it added (20 + 25 against 2 + 0 + 2 + 4),
    // so the digits cannot be copied off the first sum: s is the one spread, usually b itself
    const a = 10 + rnd(40), b = 10 + rnd(40), s = Math.random() < 0.3 ? b + (rnd(2) ? 1 : -1) : b;
    const big = a + b, small = (a%10) + Math.floor(a/10) + (s%10) + Math.floor(s/10);
    if(big > 89 || big - small < 10 || s < 10) continue;
    return {kind:'cmp', shape:0, a, b, s, big, small, flip: Math.random() < 0.3, ans: big - small};
  }
}

// Ukrainian [nominative, genitive] of the runners, keyed by the Bulgarian name
const cmpUkName = {'Деми':['Демі','Демі'], 'Мария':['Марія','Марії'], 'Ния':['Нія','Нії'], 'Ива':['Іва','Іви']};
function drawCmp(q){
  if(q.kind === 'cmp' && q.shape === 3){
    const L = '<span class="num">' + q.L.join(' + ') + '</span>';
    const R = '<span class="num">' + q.R.join(' + ') + '</span>';
    return '<div class="ask">' + (q.flip
        ? tr('С колко сборът ' + R + ' е <b>по-малък</b> от сбора ' + L + '?',
             'На скільки сума ' + R + ' <b>менша</b> за суму ' + L + '?')
        : tr('С колко сборът ' + L + ' е <b>по-голям</b> от сбора ' + R + '?',
             'На скільки сума ' + L + ' <b>більша</b> за суму ' + R + '?')) +
      '</div><div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp' && q.runs){
    const line = a => '<span class="num">' + a.join(' + ') + '</span>';
    const small = 1 - q.big;
    const uk = q.nm.map(n => cmpUkName[n]);
    return '<div class="ask">' + tr('<b>' + q.nm[0] + '</b> пресметнала вярно ' + line(q.A) + ', а <b>' +
      q.nm[1] + '</b> пресметнала вярно ' + line(q.back ? q.B.slice().reverse() : q.B) +
      '. С колко сборът на <b>' + q.nm[q.big] + '</b> е по-голям от сбора на <b>' + q.nm[small] + '</b>?',
      '<b>' + uk[0][0] + '</b> правильно обчислила ' + line(q.A) + ', а <b>' +
      uk[1][0] + '</b> правильно обчислила ' + line(q.back ? q.B.slice().reverse() : q.B) +
      '. На скільки сума в <b>' + uk[q.big][1] + '</b> більша, ніж у <b>' + uk[small][1] + '</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp' && q.written){
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="given">(' + q.terms.join(' + ') + ') − (' + q.kept.join(' + ') + ')</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp' && q.shape === 1){
    return '<div class="ask">' + tr('С колко сборът <span class="num">' + q.terms.join(' + ') +
      '</span> е <b>по-голям</b> от сбора <span class="num">' + q.kept.join(' + ') + '</span>?',
      'На скільки сума <span class="num">' + q.terms.join(' + ') +
      '</span> <b>більша</b> за суму <span class="num">' + q.kept.join(' + ') + '</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp' && q.shape === 2){
    return '<div class="ask">' + tr('С колко сборът <span class="num">' + q.x + ' + ' + q.y +
      '</span> е <b>' + (q.less ? 'по-малък' : 'по-голям') + '</b> от разликата <span class="num">' +
      q.p + ' − ' + q.q + '</span>?',
      'На скільки сума <span class="num">' + q.x + ' + ' + q.y +
      '</span> <b>' + (q.less ? 'менша' : 'більша') + '</b> за різницю <span class="num">' +
      q.p + ' − ' + q.q + '</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'cmp'){
    const A = '<span class="num">' + q.a + ' + ' + q.b + '</span>';
    const B = '<span class="num">' + spread(q.a) + ' + ' + spread(q.s || q.b) + '</span>';
    return '<div class="ask">' + (q.flip
        ? tr('С колко сборът ' + B + ' е по-малък от сбора ' + A + '?', 'На скільки сума ' + B + ' менша за суму ' + A + '?')
        : tr('С колко сборът ' + A + ' е по-голям от сбора ' + B + '?', 'На скільки сума ' + A + ' більша за суму ' + B + '?')) +
      '</div><div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCmp(q){
  const vs = tr(' срещу ', ' проти ');
  if(q.kind === 'cmp' && q.shape === 3) return q.L.join('+') + vs + q.R.join('+') + ' → ' + q.ans;
  if(q.kind === 'cmp' && q.shape === 1) return q.terms.join('+') + vs + q.kept.join('+') + ' → ' + q.ans;
  if(q.kind === 'cmp' && q.runs) return q.sa + vs + q.sb + ' → ' + q.ans;
  if(q.kind === 'cmp' && q.same) return q.x + '±' + q.y + ' → ' + q.S + tr(' и ', ' і ') + q.D + ' → ' + q.ans;
  if(q.kind === 'cmp' && q.shape === 2) return '(' + q.x + '+' + q.y + ')' + vs + '(' + q.p + '−' + q.q + ') → ' + q.ans;
  if(q.kind === 'cmp') return '(' + q.a + ' + ' + q.b + ') − (' + spread(q.a) + ' + ' + spread(q.s || q.b) + ') = ' + q.ans;
}
function whyCmp(q, full){
  if(q.kind === 'cmp' && q.shape === 3){
    if(!full) return tr('Сравни ги по двойки, вместо да събираш.', 'Порівняй їх парами, а не додавай.');
    const pr = [], ds = q.L.map((v, i) => v - q.R[i]);
    q.L.forEach((v, i) => pr.push(ds[i] === 0 ? v + tr(' е поравно', ' — порівну')
      : v + tr(' е с ' + Math.abs(ds[i]) + (ds[i] > 0 ? ' повече' : ' по-малко'),
               ' — на ' + Math.abs(ds[i]) + (ds[i] > 0 ? ' більше' : ' менше'))));
    // the gains added up first, then the losses taken off — so the running total never dips
    const bits = ds.filter(d => d).sort((x, y) => y - x)
      .map((d, i) => (i ? (d < 0 ? ' − ' : ' + ') : '') + Math.abs(d));
    return tr('по двойки: ', 'парами: ') + pr.join(', ') + ' &nbsp;→&nbsp; ' + bits.join('') + ' = ' + q.ans;
  }
  if(q.kind === 'cmp' && q.shape === 1){
    if(!full) return tr('Общите събираеми се съкращават.', 'Спільні доданки скорочуються.');
    const rest = q.gone.length === 1 ? tr('остава само ', 'залишається лише ') + q.ans
                                     : tr('остава ', 'залишається ') + q.gone.join(' + ') + ' = ' + q.ans;
    return tr('общите събираеми ', 'спільні доданки ') + q.kept.slice().sort((a, b) => a - b).join(' + ') +
      tr(' се съкращават', ' скорочуються') + ' &nbsp;→&nbsp; ' + rest;
  }
  if(q.kind === 'cmp' && q.runs){
    if(!full) return tr('Събирай всеки от двата сбора по двойки от двата края.', 'Кожну з двох сум додавай парами з обох кінців.');
    const show = a => a[0] + ' + ' + a[1] + ' + … + ' + a[a.length-1];
    const nm = q.nm.map(n => tr(n, cmpUkName[n][0]));
    return nm[0] + ': ' + show(q.A) + ' = <b>' + q.sa + '</b>, &nbsp;' + nm[1] + ': ' + show(q.B) +
      ' = <b>' + q.sb + '</b> &nbsp;→&nbsp; ' + Math.max(q.sa, q.sb) + ' − ' + Math.min(q.sa, q.sb) +
      ' = ' + q.ans;
  }
  if(q.kind === 'cmp' && q.same){
    if(!full) return tr('Двете числа са едни и същи — какво прави по-малкото веднъж горе и веднъж долу?',
                        'Обидва числа ті самі — що робить менше з них, коли його раз додають, а раз віднімають?');
    return tr(q.y + ' веднъж се прибавя и веднъж се изважда &nbsp;→&nbsp; цялата разлика е двойно по-голяма от ' + q.y,
              q.y + ' один раз додається, а один раз віднімається &nbsp;→&nbsp; уся різниця вдвічі більша за ' + q.y) +
      ' &nbsp;→&nbsp; ' + q.y + ' + ' + q.y + ' = ' + q.ans;
  }
  if(q.kind === 'cmp' && q.shape === 2){
    if(!full) return tr('Пресметни сбора и разликата поотделно.', 'Обчисли суму й різницю окремо.');
    return q.x + ' + ' + q.y + ' = <b>' + q.S + '</b>, &nbsp;' + q.p + ' − ' + q.q + ' = <b>' + q.D +
      '</b> &nbsp;→&nbsp; ' + Math.max(q.S, q.D) + ' − ' + Math.min(q.S, q.D) + ' = ' + q.ans;
  }
  if(q.kind === 'cmp'){
    if(!full) return tr('Пресметни двата сбора, после извади по-малкия.', 'Обчисли обидві суми, потім відніми меншу.');
    return q.a + ' + ' + q.b + ' = <b>' + q.big + '</b>, &nbsp;' + spread(q.a) + ' + ' + spread(q.s || q.b) +
           ' = <b>' + q.small + '</b> &nbsp;→&nbsp; ' + q.big + ' − ' + q.small + ' = ' + q.ans;
  }
}
KIND.cmp = { draw:drawCmp, eq:eqCmp, why:whyCmp };
