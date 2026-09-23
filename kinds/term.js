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
  if(q.kind === 'term') return (q.shape === 0 ? tr(q.t.sub + ' в ', termUk[q.t.sub][0] + termUk[q.t.sub][2]) + q.x + ' ' + q.t.op + ' ' + q.y
    : tr('сборът ', 'сума ') + q.total + tr(' срещу ', ' проти ') + (q.t.at === 0 ? q.x : q.y)) + ' → ' + q.ans;
}
function whyTerm(q, full){
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
