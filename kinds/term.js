// Question kind 'term': level 30 Умаляемо — Naming the parts of a sum and a difference.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 10: the parts of a sum and a difference have names, and the name is the task.
const TERMS = [
  { sub:'умаляемото',        obj:'умаляемото',        of:'разликата', at:0, op:'−' },
  { sub:'умалителят',        obj:'умалителя',         of:'разликата', at:1, op:'−' },
  { sub:'първото събираемо', obj:'първото събираемо', of:'сбора',     at:0, op:'+' },
  { sub:'второто събираемо', obj:'второто събираемо', of:'сбора',     at:1, op:'+' }
];
function genTerm(){
  if(Math.random() < 0.2){
    // Коледно 2024, задача 3: how many of the subtrahends in 12 − 9, 8 − 4, 11 + 34, 31 − 7, 27 − 0
    // are bigger than 6. 11 + 34 has no subtrahend at all, so its 34 is the trap: 9 and 7, so 2.
    for(;;){
      const k = 4 + rnd(5), mins = Math.random() < 0.3, list = [];
      const nAdd = 1 + rnd(2);
      for(let i = 0; i < 5 - nAdd; i++){ const b = rnd(16), a = b + rnd(30); list.push([a, '−', b]); }
      for(let i = 0; i < nAdd; i++){ const a = 5 + rnd(30), b = k + 1 + rnd(40); list.push(mins ? [b, '+', a] : [a, '+', b]); }
      shuffle(list);
      const ans = list.filter(([a, op, b]) => op === '−' && (mins ? a : b) > k).length;
      const trap = list.filter(([a, op, b]) => (mins ? a : b) > k).length;
      if(ans < 1 || ans === 5 - nAdd) continue;
      return {kind:'term', shape:3, mins, k, list, traps:[trap], ans};
    }
  }
  if(Math.random() < 0.3){
    // Зима 2021–2023: two of the three parts of a difference given, the third asked. The name
    // decides the sum: the subtrahend is minuend − difference, the minuend is subtrahend + difference.
    // And once (Зима 2022) the minuend equals the difference, so the subtrahend is 0.
    if(Math.random() < 0.12) return {kind:'term', shape:2, same:1, t:TERMS[1], ans:0};
    const D = 5 + rnd(50), S = 5 + rnd(45), M = D + S;
    if(M > 99) return genTerm();
    return Math.random() < 0.6 ? {kind:'term', shape:2, t:TERMS[1], M, D, S, ans:S} : {kind:'term', shape:2, t:TERMS[0], M, D, S, ans:M};
  }
  for(;;){
    const t = TERMS[rnd(4)];
    const x = 20 + rnd(60);
    const y = 5 + rnd(Math.min(40, x - 5));
    const val = t.at === 0 ? x : y;
    if(Math.random() < 0.4) return {kind:'term', t, x, y, shape:0, ans: val};
    const k = 3 + rnd(4);
    const odd = Math.random() < 0.5;
    const chain = [];
    for(let i = 0; i < k; i++) chain.push(odd ? 1 + 2*i : 1 + i);
    const total = chain.reduce((s, v) => s + v, 0);
    if(total === val) continue;
    return {kind:'term', t, x, y, shape:1, chain, total, less: val > total, ans: Math.abs(val - total)};
  }
}

// Ukrainian [name, "of" in the locative, "in" after the name], keyed by the Bulgarian name
const termUk = {'умаляемото':['зменшуване','різниці',' в '], 'умалителят':['від’ємник','різниці',' у '],
                'първото събираемо':['перший доданок','сумі',' у '], 'второто събираемо':['другий доданок','сумі',' у ']};
function drawTerm(q){
  if(q.kind === 'term' && q.shape === 3){
    const ex = '<span class="num">' + q.list.map(e => e.join(' ')).join(', ') + '</span>';
    return '<div class="ask">' + tr('Колко от <b>' + (q.mins ? 'умаляемите' : 'умалителите') + '</b> в задачите ' + ex + ' са по-големи от <span class="num">' + q.k + '</span>?',
      'Скільки <b>' + (q.mins ? 'зменшуваних' : 'від’ємників') + '</b> у прикладах ' + ex + ' більші за <span class="num">' + q.k + '</span>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'term' && q.shape === 2){
    const n = v => '<span class="num">' + v + '</span>';
    const ask = q.same ? tr('<b>Умаляемото</b> е равно на <b>разликата</b>. Колко е <b>умалителят</b>?', '<b>Зменшуване</b> дорівнює <b>різниці</b>. Чому дорівнює <b>від’ємник</b>?')
      : q.t.at === 1 ? tr('Умаляемото е ' + n(q.M) + ', а разликата е ' + n(q.D) + '. Кой е <b>умалителят</b>?', 'Зменшуване дорівнює ' + n(q.M) + ', а різниця — ' + n(q.D) + '. Чому дорівнює <b>від’ємник</b>?')
      : tr('Умалителят е ' + n(q.S) + ', а разликата е ' + n(q.D) + '. Кое е <b>умаляемото</b>?', 'Від’ємник дорівнює ' + n(q.S) + ', а різниця — ' + n(q.D) + '. Чому дорівнює <b>зменшуване</b>?');
    return '<div class="ask">' + ask + '</div><div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'term'){
    const expr = '<span class="num">' + q.x + ' ' + q.t.op + ' ' + q.y + '</span>';
    const uk = termUk[q.t.sub];
    const ask = q.shape === 0
      ? tr('Кое е <b>' + q.t.sub + '</b> в ' + q.t.of + ' ' + expr + '?',
           'Чому дорівнює <b>' + uk[0] + '</b>' + uk[2] + uk[1] + ' ' + expr + '?')
      : tr('С колко сборът <span class="num">' + q.chain.join(' + ') + '</span> е <b>' +
        (q.less ? 'по-малък' : 'по-голям') + '</b> от <b>' + q.t.obj + '</b> в ' + q.t.of + ' ' + expr + '?',
        'На скільки сума <span class="num">' + q.chain.join(' + ') + '</span> <b>' +
        (q.less ? 'менша' : 'більша') + '</b> за <b>' + uk[0] + '</b>' + uk[2] + uk[1] + ' ' + expr + '?');
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqTerm(q){
  if(q.kind === 'term' && q.shape === 3) return q.list.filter(e => e[1] === '−').map(e => q.mins ? e[0] : e[2]).join(', ') + ' > ' + q.k + ' → ' + q.ans;
  if(q.kind === 'term' && q.shape === 2) return q.same ? tr('умаляемо = разлика → умалител ', 'зменшуване = різниця → від’ємник ') + q.ans
    : q.t.at === 1 ? q.M + ' − ' + q.D + ' = ' + q.ans : q.S + ' + ' + q.D + ' = ' + q.ans;
  if(q.kind === 'term') return (q.shape === 0 ? tr(q.t.sub + ' в ', termUk[q.t.sub][0] + termUk[q.t.sub][2]) + q.x + ' ' + q.t.op + ' ' + q.y
    : tr('сборът ', 'сума ') + q.total + tr(' срещу ', ' проти ') + (q.t.at === 0 ? q.x : q.y)) + ' → ' + q.ans;
}
function whyTerm(q, full){
  if(q.kind === 'term' && q.shape === 3){
    if(!full) return tr('Кои от задачите изобщо имат ' + (q.mins ? 'умаляемо' : 'умалител') + '?', 'Які з прикладів узагалі мають ' + (q.mins ? 'зменшуване' : 'від’ємник') + '?');
    const subs = q.list.filter(e => e[1] === '−'), v = e => q.mins ? e[0] : e[2];
    return tr('събирането няма ' + (q.mins ? 'умаляемо' : 'умалител') + '; ', 'у додаванні немає ' + (q.mins ? 'зменшуваного' : 'від’ємника') + '; ') +
      subs.map(e => e.join(' ') + ' → ' + (v(e) > q.k ? '<b>' + v(e) + '</b>' : v(e))).join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.kind === 'term' && q.shape === 2){
    if(!full) return tr('Умаляемо − умалител = разлика. Кое от трите липсва?', 'Зменшуване − від’ємник = різниця. Якого з трьох бракує?');
    if(q.same) return tr('умаляемото − умалителя = разликата, а те са равни &nbsp;→&nbsp; от него не е извадено нищо &nbsp;→&nbsp; умалителят е ', 'зменшуване − від’ємник = різниця, а вони рівні &nbsp;→&nbsp; нічого не віднято &nbsp;→&nbsp; від’ємник ') + q.ans;
    return q.t.at === 1 ? q.M + ' − ? = ' + q.D + ' &nbsp;→&nbsp; ' + q.M + ' − ' + q.D + ' = ' + q.ans
                        : '? − ' + q.S + ' = ' + q.D + ' &nbsp;→&nbsp; ' + q.S + ' + ' + q.D + ' = ' + q.ans;
  }
  if(q.kind === 'term'){
    if(!full) return q.t.op === '−' ? tr('Умаляемото е първото число, умалителят — второто.', 'Зменшуване — це перше число, від’ємник — друге.')
                                    : tr('Събираемите са числата, които събираме.', 'Доданки — це числа, які ми додаємо.');
    const val = q.t.at === 0 ? q.x : q.y;
    const head = tr(q.t.sub + ' в ', termUk[q.t.sub][0] + termUk[q.t.sub][2]) + q.x + ' ' + q.t.op + ' ' + q.y + tr(' е <b>', ' — <b>') + val + '</b>';
    if(q.shape === 0) return head;
    return q.chain.join(' + ') + ' = <b>' + q.total + '</b>, а ' + head +
      ' &nbsp;→&nbsp; ' + Math.max(val, q.total) + ' − ' + Math.min(val, q.total) + ' = ' + q.ans;
  }
}
KIND.term = { draw:drawTerm, eq:eqTerm, why:whyTerm };
