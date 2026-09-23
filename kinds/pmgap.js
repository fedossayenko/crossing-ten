// Question kind 'pmgap': level 62 + 9 и − 9 — Two long expressions that differ only at the end.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 4: how much bigger 9 · 7 + 7 · 5 + 9 is than 9 · 7 + 7 · 5 − 9.
// The shared start never needs working out: one is 9 above it and the other 9 below, 18 apart.
function genPmGap(){
  for(;;){
    const a = 2 + rnd(8), b = 2 + rnd(8), c = 2 + rnd(8), d = 2 + rnd(8);
    const e = 2 + rnd(8), both = Math.random() < 0.25;      // both: + e against + f, so only e − f
    const f = Math.random() < 0.6 && !both ? e : 2 + rnd(8);
    if(both && e <= f) continue;
    const X = a*b + c*d;
    if(!both && X - f < 0) continue;
    const ans = both ? e - f : e + f;
    return {kind:'pmgap', a, b, c, d, e, f, both, flip: Math.random() < 0.3, ans,
            traps: [both ? e + f : e, X + e].filter(v => v !== ans && v < 1000)};
  }
}
const pmHead = q => q.a + ' · ' + q.b + ' + ' + q.c + ' · ' + q.d;
const pmBig = q => pmHead(q) + ' + ' + q.e, pmSmall = q => pmHead(q) + (q.both ? ' + ' : ' − ') + q.f;
function drawPmGap(q){
  if(q.kind === 'pmgap'){
    const B = '<span class="num">' + pmBig(q) + '</span>', S = '<span class="num">' + pmSmall(q) + '</span>';
    return '<div class="ask">' + (q.flip
      ? tr('С колко числото, равно на ' + S + ', е <b>по-малко</b> от числото, равно на ' + B + '?',
           'На скільки число, що дорівнює ' + S + ', <b>менше</b> від числа, що дорівнює ' + B + '?')
      : tr('С колко числото, равно на ' + B + ', е <b>по-голямо</b> от числото, равно на ' + S + '?',
           'На скільки число, що дорівнює ' + B + ', <b>більше</b> за число, що дорівнює ' + S + '?')) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqPmGap(q){
  if(q.kind === 'pmgap') return '(' + pmBig(q) + ') − (' + pmSmall(q) + ') = ' + q.ans;
}
function whyPmGap(q, full){
  if(q.kind === 'pmgap'){
    if(!full) return tr('Началото и на двете е едно и също — сравни само края.', 'Початок обох однаковий — порівняй лише кінець.');
    const same = pmHead(q) + tr(' е едно и също', ' — однакове');
    return same + ' &nbsp;→&nbsp; ' + (q.both
      ? tr('+ ' + q.e + ' срещу + ' + q.f, '+ ' + q.e + ' проти + ' + q.f) + ' &nbsp;→&nbsp; ' + q.e + ' − ' + q.f + ' = ' + q.ans
      : tr('едното е с ' + q.e + ' повече, другото с ' + q.f + ' по-малко', 'одне на ' + q.e + ' більше, друге на ' + q.f + ' менше') +
        ' &nbsp;→&nbsp; ' + q.e + ' + ' + q.f + ' = ' + q.ans);
  }
}
KIND.pmgap = { draw:drawPmGap, eq:eqPmGap, why:whyPmGap };
