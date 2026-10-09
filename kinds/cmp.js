// Question kind 'cmp': level 10 С колко? — How much bigger one sum is than the other.
import { KIND, SLOT, popAt, rnd, shuffle, svgText, tr } from '../js/core.js';

const spread = n => String(n).split('').join(' + ');

// Задача 19: two runs stepping by two, one starting odd and one even. Paired off they
// differ by one at a time, so only the odd one out at the end really matters.
const RUNNERS = ['Деми', 'Мария', 'Ния', 'Ива'];
function genRuns(){
  for(;;){
    const a0 = 2 + 2*rnd(3), b0 = a0 + (Math.random() < 0.5 ? 1 : -1);
    if(b0 < 1) continue;
    const na = 6 + rnd(5), nb = na + rnd(3) - 1;   // both about as long as the printed ones (Есен 2019: ten each)
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
// МБГ Пролет 2021, 1 клас, задача 16: 11 + 12 + 13 + 14 + 15 against 10 + 11 + 12 + 13 + 14 — each term one more, 5.
export function genNearShort(){
  const m = 3 + rnd(3), st = 10 + rnd(11), R = [], L = [];
  for(let i = 0; i < m; i++){ R.push(st + i); L.push(st + i + 1); }
  return {kind:'cmp', shape:3, shift:1, L, R, ans: m, flip: Math.random() < 0.6};
}
function genNear(){
  if(Math.random() < 0.15){
    // Зима 2020: six terms, four the same on both sides — 11 + 22 + 33 + 67 + 78 + 89 against
    // 13 + 22 + 33 + 67 + 78 + 91: only 11/13 and 89/91 differ, by 2 each, so 4
    for(;;){
      const m = 5 + rnd(2), R = shuffle([...Array(88).keys()].map(v => v + 11)).slice(0, m).sort((a, b) => a - b), L = R.slice();
      const at = shuffle([...Array(m).keys()]).slice(0, 2);
      at.forEach(i => { L[i] += 1 + rnd(3); });
      if(new Set(L).size < m) continue;
      return {kind:'cmp', shape:3, most:1, L, R, ans: L.reduce((a, b) => a + b, 0) - R.reduce((a, b) => a + b, 0), flip: Math.random() < 0.6};
    }
  }
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
export function genCmp(){
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
  if(q.shape === 3){
    const L = '<span class="num">' + q.L.join(' + ') + '</span>';
    const R = '<span class="num">' + q.R.join(' + ') + '</span>';
    return '<div class="ask">' + (q.flip
        ? tr('С колко сборът ' + R + ' е <b>по-малък</b> от сбора ' + L + '?',
             'На скільки сума ' + R + ' <b>менша</b> за суму ' + L + '?')
        : tr('С колко сборът ' + L + ' е <b>по-голям</b> от сбора ' + R + '?',
             'На скільки сума ' + L + ' <b>більша</b> за суму ' + R + '?')) +
      '</div><div class="line xl">' + SLOT + '</div>';
  }
  if(q.runs){
    const line = a => '<span class="num">' + a.join(' + ') + '</span>';
    const small = 1 - q.big;
    const uk = q.nm.map(n => cmpUkName[n]);
    return '<div class="ask">' + tr('<b>' + q.nm[0] + '</b> пресметнала вярно ' + line(q.A) + ', а <b>' +
      q.nm[1] + '</b> пресметнала вярно ' + line(q.back ? q.B.slice().reverse() : q.B) +
      '. С колко сборът на <b>' + q.nm[q.big] + '</b> е по-голям от сбора на <b>' + q.nm[small] + '</b>?',
      '<b>' + uk[0][0] + '</b> правильно обчислила ' + line(q.A) + ', а <b>' +
      uk[1][0] + '</b> правильно обчислила ' + line(q.back ? q.B.slice().reverse() : q.B) +
      '. На скільки сума в <b>' + uk[q.big][1] + '</b> більша, ніж у <b>' + uk[small][1] + '</b>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.written){
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="given">(' + q.terms.join(' + ') + ') − (' + q.kept.join(' + ') + ')</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 1){
    return '<div class="ask">' + tr('С колко сборът <span class="num">' + q.terms.join(' + ') +
      '</span> е <b>по-голям</b> от сбора <span class="num">' + q.kept.join(' + ') + '</span>?',
      'На скільки сума <span class="num">' + q.terms.join(' + ') +
      '</span> <b>більша</b> за суму <span class="num">' + q.kept.join(' + ') + '</span>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 2){
    return '<div class="ask">' + tr('С колко сборът <span class="num">' + q.x + ' + ' + q.y +
      '</span> е <b>' + (q.less ? 'по-малък' : 'по-голям') + '</b> от разликата <span class="num">' +
      q.p + ' − ' + q.q + '</span>?',
      'На скільки сума <span class="num">' + q.x + ' + ' + q.y +
      '</span> <b>' + (q.less ? 'менша' : 'більша') + '</b> за різницю <span class="num">' +
      q.p + ' − ' + q.q + '</span>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  const A = '<span class="num">' + q.a + ' + ' + q.b + '</span>';
  const B = '<span class="num">' + spread(q.a) + ' + ' + spread(q.s || q.b) + '</span>';
  return '<div class="ask">' + (q.flip
      ? tr('С колко сборът ' + B + ' е по-малък от сбора ' + A + '?', 'На скільки сума ' + B + ' менша за суму ' + A + '?')
      : tr('С колко сборът ' + A + ' е по-голям от сбора ' + B + '?', 'На скільки сума ' + A + ' більша за суму ' + B + '?')) +
    '</div><div class="line xl">' + SLOT + '</div>';
}
function eqCmp(q){
  const vs = tr(' срещу ', ' проти ');
  if(q.shape === 3) return q.L.join('+') + vs + q.R.join('+') + ' → ' + q.ans;
  if(q.shape === 1) return q.terms.join('+') + vs + q.kept.join('+') + ' → ' + q.ans;
  if(q.runs) return q.sa + vs + q.sb + ' → ' + q.ans;
  if(q.same) return q.x + '±' + q.y + ' → ' + q.S + tr(' и ', ' і ') + q.D + ' → ' + q.ans;
  if(q.shape === 2) return '(' + q.x + '+' + q.y + ')' + vs + '(' + q.p + '−' + q.q + ') → ' + q.ans;
  return '(' + q.a + ' + ' + q.b + ') − (' + spread(q.a) + ' + ' + spread(q.s || q.b) + ') = ' + q.ans;
}
// The pictures. The same two numbers added and taken away: a line with x in the middle, x − y a step of y to
// its left and x + y a step of y to its right, so the two are y + y apart (the hint: the same steps, a ? for
// the gap, no numbers). Shared terms: the first sum over the second, each term of the second under its twin,
// the twins struck out, what is left over marked. Pairs: the two sums term over term, each pair's difference
// between them, the differences added.
const cmpWrap = (w, h, body, label, top) => '<svg viewBox="0 ' + (top || 0) + ' ' + w + ' ' + h + '" style="display:block; width:' + Math.round(w * 1.15) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' + body + '</svg>';
function cmpSameSvg(q, full){
  const step = (x1, x2, y, label, col) => '<path d="M' + x1 + ',' + (y - 5) + ' v10 M' + x1 + ',' + y + ' H' + x2 + ' M' + x2 + ',' + (y - 5) + ' v10" stroke="' + col + '" stroke-width="2.5" fill="none"/>' +
    svgText((x1 + x2) / 2, y + 17, label, 13, col);
  let g = '<line x1="10" y1="34" x2="250" y2="34" stroke="var(--ink)" stroke-width="2"/>';
  [40, 130, 220].forEach((x, i) => { g += '<circle cx="' + x + '" cy="34" r="5" fill="' + (i === 1 ? 'var(--ink)' : 'var(--accent)') + '"/>' +
    (full ? svgText(x, 22, i === 1 ? q.x : q.x + (i ? ' + ' : ' − ') + q.y, 13, i === 1 ? 'var(--ink)' : 'var(--accent)') : ''); });
  g += '<g' + popAt(1) + '>' + step(40, 128, 52, '− ' + (full ? q.y : ''), 'var(--accent)') + '</g><g' + popAt(2) + '>' + step(132, 220, 52, '+ ' + (full ? q.y : ''), 'var(--accent)') + '</g>' +
    '<g' + popAt(3) + '>' + step(40, 220, 90, full ? q.y + ' + ' + q.y + ' = ' + q.ans : '?', 'var(--warm)') + '</g>';
  return cmpWrap(260, full ? 116 : 96, g, tr('сборът и разликата на една права', 'сума й різниця на одній прямій'), full ? 0 : 20);
}
function cmpCancelSvg(q){
  const n = q.terms.length, x0 = (280 - n * 44) / 2 + 3, twin = [], X = i => x0 + i * 44;
  q.kept.forEach(v => { twin[q.terms.findIndex((t, j) => t === v && twin[j] === undefined)] = v; });
  const box = (x, y, v, hot) => '<rect x="' + x + '" y="' + y + '" width="38" height="28" rx="6" fill="' + (hot ? 'var(--warmbg)' : 'none') + '" stroke="' + (hot ? 'var(--warm)' : 'var(--muted)') + '"' + (hot ? '' : ' stroke-opacity=".45"') + ' stroke-width="2"/>' +
    svgText(x + 19, y + 19, v, 13, hot ? 'var(--warmink)' : 'var(--muted)') +
    (hot ? '' : '<path d="M' + (x + 5) + ',' + (y + 25) + ' L' + (x + 33) + ',' + (y + 3) + '" stroke="var(--muted)" stroke-width="1.8" stroke-linecap="round"/>');
  let g = '', k = 1;
  q.terms.forEach((v, i) => { if(twin[i] !== undefined) g += '<g' + popAt(k++) + '>' + box(X(i), 4, v) + box(X(i), 48, v) + '</g>'; });
  q.terms.forEach((v, i) => { if(twin[i] === undefined) g += '<g' + popAt(k++) + '>' + box(X(i), 4, v, true) +
    '<rect x="' + X(i) + '" y="48" width="38" height="28" rx="6" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4 3"/></g>'; });
  const foot = q.gone.length === 1 ? tr('остава ', 'залишається ') + q.ans : q.gone.join(' + ') + ' = ' + q.ans;
  return cmpWrap(280, 112, g + svgText(140, 102, foot, 15, 'var(--ink)', popAt(k)), tr('общите събираеми се съкращават', 'спільні доданки скорочуються'));
}
function cmpPairsSvg(q, bits){
  const n = q.L.length, x0 = (280 - n * 44) / 2 + 3, X = i => x0 + i * 44;
  const box = (x, y, v) => '<rect x="' + x + '" y="' + y + '" width="38" height="28" rx="6" fill="none" stroke="var(--line)" stroke-width="2"/>' + svgText(x + 19, y + 19, v, 13, 'var(--ink)');
  let g = '';
  q.L.forEach((v, i) => { const d = v - q.R[i], col = d > 0 ? 'var(--good)' : d < 0 ? 'var(--bad)' : 'var(--muted)';
    g += box(X(i), 4, v) + box(X(i), 64, q.R[i]) + svgText(X(i) + 19, 53, d > 0 ? '+' + d : d < 0 ? '−' + -d : '0', 14, col, popAt(1 + i)); });
  return cmpWrap(280, 128, g + svgText(140, 118, bits.join('') + ' = ' + q.ans, 15, 'var(--ink)', popAt(2 + n)), tr('сборовете по двойки', 'суми парами'));
}
function whyCmp(q, full){
  if(q.shape === 3){
    if(!full) return tr('Сравни ги по двойки, вместо да събираш.', 'Порівняй їх парами, а не додавай.');
    const pr = [], ds = q.L.map((v, i) => v - q.R[i]);
    q.L.forEach((v, i) => pr.push(ds[i] === 0 ? v + tr(' е поравно', ' — порівну')
      : v + tr(' е с ' + Math.abs(ds[i]) + (ds[i] > 0 ? ' повече' : ' по-малко'),
               ' — на ' + Math.abs(ds[i]) + (ds[i] > 0 ? ' більше' : ' менше'))));
    // the gains added up first, then the losses taken off — so the running total never dips
    const bits = ds.filter(d => d).sort((x, y) => y - x)
      .map((d, i) => (i ? (d < 0 ? ' − ' : ' + ') : '') + Math.abs(d));
    return tr('по двойки: ', 'парами: ') + pr.join(', ') + ' &nbsp;→&nbsp; ' + bits.join('') + ' = ' + q.ans + cmpPairsSvg(q, bits);
  }
  if(q.shape === 1){
    if(!full) return tr('Общите събираеми се съкращават.', 'Спільні доданки скорочуються.');
    const rest = q.gone.length === 1 ? tr('остава само ', 'залишається лише ') + q.ans
                                     : tr('остава ', 'залишається ') + q.gone.join(' + ') + ' = ' + q.ans;
    return tr('общите събираеми ', 'спільні доданки ') + q.kept.slice().sort((a, b) => a - b).join(' + ') +
      tr(' се съкращават', ' скорочуються') + ' &nbsp;→&nbsp; ' + rest + cmpCancelSvg(q);
  }
  if(q.runs){
    if(!full) return tr('Събирай всеки от двата сбора по двойки от двата края.', 'Кожну з двох сум додавай парами з обох кінців.');
    const show = a => a[0] + ' + ' + a[1] + ' + … + ' + a[a.length-1];
    const nm = q.nm.map(n => tr(n, cmpUkName[n][0]));
    return nm[0] + ': ' + show(q.A) + ' = <b>' + q.sa + '</b>, &nbsp;' + nm[1] + ': ' + show(q.B) +
      ' = <b>' + q.sb + '</b> &nbsp;→&nbsp; ' + Math.max(q.sa, q.sb) + ' − ' + Math.min(q.sa, q.sb) +
      ' = ' + q.ans;
  }
  if(q.same){
    if(!full) return tr('Двете числа са едни и същи — какво прави по-малкото веднъж горе и веднъж долу?',
                        'Обидва числа ті самі — що робить менше з них, коли його раз додають, а раз віднімають?') + cmpSameSvg(q, false);
    return tr(q.y + ' веднъж се прибавя и веднъж се изважда &nbsp;→&nbsp; цялата разлика е двойно по-голяма от ' + q.y,
              q.y + ' один раз додається, а один раз віднімається &nbsp;→&nbsp; уся різниця вдвічі більша за ' + q.y) +
      ' &nbsp;→&nbsp; ' + q.y + ' + ' + q.y + ' = ' + q.ans + cmpSameSvg(q, true);
  }
  if(q.shape === 2){
    if(!full) return tr('Пресметни сбора и разликата поотделно.', 'Обчисли суму й різницю окремо.');
    return q.x + ' + ' + q.y + ' = <b>' + q.S + '</b>, &nbsp;' + q.p + ' − ' + q.q + ' = <b>' + q.D +
      '</b> &nbsp;→&nbsp; ' + Math.max(q.S, q.D) + ' − ' + Math.min(q.S, q.D) + ' = ' + q.ans;
  }
  if(!full) return tr('Пресметни двата сбора, после извади по-малкия.', 'Обчисли обидві суми, потім відніми меншу.');
  return q.a + ' + ' + q.b + ' = <b>' + q.big + '</b>, &nbsp;' + spread(q.a) + ' + ' + spread(q.s || q.b) +
         ' = <b>' + q.small + '</b> &nbsp;→&nbsp; ' + q.big + ' − ' + q.small + ' = ' + q.ans;
}
KIND.cmp = { draw:drawCmp, eq:eqCmp, why:whyCmp };
