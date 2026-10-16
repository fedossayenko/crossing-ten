// Question kind 'term': level 30 Умаляемо — Naming the parts of a sum and a difference; level 278 С думи — the operation said in words.

// Задача 10: the parts of a sum and a difference have names, and the name is the task.
import { KIND, SLOT, bgWith, rnd, shuffle, tr } from '../js/core.js';
export const TERMS = [
  { sub:'умаляемото',        obj:'умаляемото',        of:'разликата', at:0, op:'−' },
  { sub:'умалителят',        obj:'умалителя',         of:'разликата', at:1, op:'−' },
  { sub:'първото събираемо', obj:'първото събираемо', of:'сбора',     at:0, op:'+' },
  { sub:'второто събираемо', obj:'второто събираемо', of:'сбора',     at:1, op:'+' }
];
export function genTerm(){
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

// Level 278 С думи: the operation said in words. Аз и числата 2026, задача 13 (shape 'name'): the sum, the difference and
// the product of 8 and 2 — 10, 6 and 16. Аз и числата 2024, задача 4 (shape 'more'): the number 28 bigger than 54 is 82,
// the one 30 smaller than 89 is 59. Аз и числата 2025, задача 5 (shape 'then'): «Сборът на числата 32 и 45 умали с 28» —
// 77 − 28 = 49; «Разликата на числата 89 и 66 умали със 17» — 23 − 17 = 6. Аз и числата 2023, задача 6 (shape 'diff'):
// a table, 32 мечета and 25 топки — «С колко мечетата са повече от топките?», 32 − 25 = 7 (the paper has the child finish
// the question's wording; here it comes finished). The slips: the other operation, and «умали с» taken off one number.
const TW_OPS = [['сбора', 'суму'], ['разликата', 'різницю'], ['произведението', 'добуток']];
// the things counted in the table: [Bulgarian plural, and with its article, Ukrainian plural, and after «скільки»]
const TW_TOYS = [['мечета', 'мечетата', 'ведмедики', 'ведмедиків'], ['топки', 'топките', 'м’ячі', 'м’ячів'], ['кукли', 'куклите', 'ляльки', 'ляльок'],
  ['колички', 'количките', 'машинки', 'машинок'], ['кубчета', 'кубчетата', 'кубики', 'кубиків']];
export function genTermWords(){
  const w = Math.random();
  for(;;){
    if(w < 0.25){
      const op = rnd(3), a = op === 2 ? 2 + rnd(8) : 6 + rnd(85), b = op === 2 ? 2 + rnd(8) : 2 + rnd(a - 3);
      const ans = op === 0 ? a + b : op === 1 ? a - b : a * b;
      if(op === 0 && ans > 100 || a === b) continue;
      return {kind:'term', shape:'name', op, a, b, traps: [op === 0 ? a - b : a + b, op === 2 ? a - b : a * b].filter(t => t >= 0 && t !== ans && t <= 100), ans};
    }
    if(w < 0.5){
      const more = Math.random() < 0.5, b = 11 + rnd(80), d = 5 + rnd(50), ans = more ? b + d : b - d;
      if(ans < 1 || ans > 99) continue;
      return {kind:'term', shape:'more', more, b, d, traps: [more ? b - d : b + d].filter(t => t >= 0 && t <= 100), ans};
    }
    if(w < 0.75){
      const sum = Math.random() < 0.5, up = Math.random() < 0.25, a = 11 + rnd(80), b = sum ? 11 + rnd(80) : 2 + rnd(Math.max(1, a - 12)), c = 5 + rnd(40);
      const v = sum ? a + b : a - b, ans = up ? v + c : v - c;
      if(v > 99 || v < 2 || ans < 1 || ans > 99) continue;
      // «умали с» taken off the second number alone (a − (b − c)), or the other way
      const traps = [sum ? (up ? v - c : v + c) : a - (up ? b + c : b - c), up ? v - c : v + c].filter((t, i, all) => t >= 0 && t <= 100 && t !== ans && all.indexOf(t) === i);
      return {kind:'term', shape:'then', sum, up, a, b, c, v, traps, ans};
    }
    const k = rnd(TW_TOYS.length), j = (k + 1 + rnd(TW_TOYS.length - 1)) % TW_TOYS.length, x = 11 + rnd(80), y = 5 + rnd(80);
    if(x === y || Math.abs(x - y) < 2) continue;
    // the question asks about the first thing named: «С колко мечетата са повече (по-малко) от топките?»
    return {kind:'term', shape:'diff', k, j, x, y, traps: [x + y].filter(t => t <= 100), ans: Math.abs(x - y)};
  }
}
const TW_SHAPES = { name:1, more:1, then:1, diff:1 };
function drawTermWords(q){
  const n = v => '<span class="num">' + v + '</span>';
  if(q.shape === 'name') return '<div class="ask">' + tr('Пресметни <b>' + TW_OPS[q.op][0] + '</b> на числата ' + n(q.a) + ' и ' + n(q.b) + '.',
      'Обчисли <b>' + TW_OPS[q.op][1] + '</b> чисел ' + n(q.a) + ' і ' + n(q.b) + '.') + '</div><div class="line xl">' + SLOT + '</div>';
  if(q.shape === 'more') return '<div class="ask">' + tr('Кое число е ' + bgWith(q.d) + ' ' + n(q.d) + ' <b>' + (q.more ? 'по-голямо' : 'по-малко') + '</b> от ' + n(q.b) + '?',
      'Яке число на ' + n(q.d) + ' <b>' + (q.more ? 'більше</b> за ' : 'менше</b> від ') + n(q.b) + '?') + '</div><div class="line xl">' + SLOT + '</div>';
  if(q.shape === 'then') return '<div class="ask">' + tr('Пресметни.', 'Обчисли.') + '</div><div class="ask">' +
      tr((q.sum ? 'Сборът' : 'Разликата') + ' на числата ' + n(q.a) + ' и ' + n(q.b) + ' <b>' + (q.up ? 'увеличи' : 'умали') + '</b> ' + bgWith(q.c) + ' ' + n(q.c) + '.',
         (q.sum ? 'Суму' : 'Різницю') + ' чисел ' + n(q.a) + ' і ' + n(q.b) + ' <b>' + (q.up ? 'збільш' : 'зменш') + '</b> на ' + n(q.c) + '.') + '</div><div class="line xl">' + SLOT + '</div>';
  const A = TW_TOYS[q.k], B = TW_TOYS[q.j], more = q.x > q.y, cell = 'style="border:1.5px solid var(--line); padding:4px 14px"';
  return '<div class="ask">' + tr('В детската градина има играчки.', 'У дитячому садку є іграшки.') + '</div>' +
    '<table style="border-collapse:collapse; margin:6px auto; font-size:clamp(17px,4.6vw,22px)"><tr><th ' + cell + '>' + tr('Играчки', 'Іграшки') + '</th><th ' + cell + '>' + tr('Брой', 'Кількість') + '</th></tr>' +
    '<tr><td ' + cell + '>' + tr(A[0], A[2]) + '</td><td ' + cell + '>' + n(q.x) + '</td></tr><tr><td ' + cell + '>' + tr(B[0], B[2]) + '</td><td ' + cell + '>' + n(q.y) + '</td></tr></table>' +
    '<div class="ask">' + tr('С колко ' + A[1] + ' са <b>' + (more ? 'повече' : 'по-малко') + '</b> от ' + B[1] + '?',
      'На скільки ' + A[3] + ' <b>' + (more ? 'більше' : 'менше') + '</b>, ніж ' + B[3] + '?') + '</div><div class="line xl">' + SLOT + '</div>';
}
// the summary line is plain text
function eqTermWords(q){
  if(q.shape === 'name') return q.a + ' ' + ['+', '−', '·'][q.op] + ' ' + q.b + ' = ' + q.ans;
  if(q.shape === 'more') return q.b + (q.more ? ' + ' : ' − ') + q.d + ' = ' + q.ans;
  if(q.shape === 'then') return '(' + q.a + (q.sum ? ' + ' : ' − ') + q.b + ')' + (q.up ? ' + ' : ' − ') + q.c + ' = ' + q.ans;
  return Math.max(q.x, q.y) + ' − ' + Math.min(q.x, q.y) + ' = ' + q.ans;
}
function whyTermWords(q, full){
  if(q.shape === 'name'){
    if(!full) return tr('Сборът е от събиране, разликата — от изваждане, произведението — от умножение.', 'Сума — від додавання, різниця — від віднімання, добуток — від множення.');
    return tr(['сборът', 'разликата', 'произведението'][q.op] + ': ', ['сума', 'різниця', 'добуток'][q.op] + ': ') + eqTermWords(q);
  }
  if(q.shape === 'more'){
    if(!full) return q.more ? tr('По-голямо с толкова — значи прибавяш.', 'Більше на стільки — отже, додаєш.') : tr('По-малко с толкова — значи изваждаш.', 'Менше на стільки — отже, віднімаєш.');
    return eqTermWords(q);
  }
  if(q.shape === 'then'){
    if(!full) return tr('Първо намери ' + (q.sum ? 'сбора' : 'разликата') + ' на двете числа. После ' + (q.up ? 'увеличи' : 'умали') + ' цялото число.',
      'Спершу знайди ' + (q.sum ? 'суму' : 'різницю') + ' двох чисел. Потім ' + (q.up ? 'збільш' : 'зменш') + ' усе число.');
    return q.a + (q.sum ? ' + ' : ' − ') + q.b + ' = <b>' + q.v + '</b> &nbsp;→&nbsp; ' + q.v + (q.up ? ' + ' : ' − ') + q.c + ' = ' + q.ans;
  }
  if(!full) return tr('„С колко повече“ и „с колко по-малко“ питат за разликата: от по-голямото извади по-малкото.', '«На скільки більше» і «на скільки менше» питають про різницю: від більшого відніми менше.');
  return eqTermWords(q);
}

// Ukrainian [name, "of" in the locative, "in" after the name], keyed by the Bulgarian name
const termUk = {'умаляемото':['зменшуване','різниці',' в '], 'умалителят':['від’ємник','різниці',' у '],
                'първото събираемо':['перший доданок','сумі',' у '], 'второто събираемо':['другий доданок','сумі',' у ']};
function drawTerm(q){
  if(TW_SHAPES[q.shape]) return drawTermWords(q);
  if(q.shape === 3){
    const ex = '<span class="num">' + q.list.map(e => e.join(' ')).join(', ') + '</span>';
    return '<div class="ask">' + tr('Колко от <b>' + (q.mins ? 'умаляемите' : 'умалителите') + '</b> в задачите ' + ex + ' са по-големи от <span class="num">' + q.k + '</span>?',
      'Скільки <b>' + (q.mins ? 'зменшуваних' : 'від’ємників') + '</b> у прикладах ' + ex + ' більші за <span class="num">' + q.k + '</span>?') + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 2){
    const n = v => '<span class="num">' + v + '</span>';
    const ask = q.same ? tr('<b>Умаляемото</b> е равно на <b>разликата</b>. Колко е <b>умалителят</b>?', '<b>Зменшуване</b> дорівнює <b>різниці</b>. Чому дорівнює <b>від’ємник</b>?')
      : q.t.at === 1 ? tr('Умаляемото е ' + n(q.M) + ', а разликата е ' + n(q.D) + '. Кой е <b>умалителят</b>?', 'Зменшуване дорівнює ' + n(q.M) + ', а різниця — ' + n(q.D) + '. Чому дорівнює <b>від’ємник</b>?')
      : tr('Умалителят е ' + n(q.S) + ', а разликата е ' + n(q.D) + '. Кое е <b>умаляемото</b>?', 'Від’ємник дорівнює ' + n(q.S) + ', а різниця — ' + n(q.D) + '. Чому дорівнює <b>зменшуване</b>?');
    return '<div class="ask">' + ask + '</div><div class="line xl">' + SLOT + '</div>';
  }
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
    '<div class="line xl">' + SLOT + '</div>';
}
function eqTerm(q){
  if(TW_SHAPES[q.shape]) return eqTermWords(q);
  if(q.shape === 3) return q.list.filter(e => e[1] === '−').map(e => q.mins ? e[0] : e[2]).join(', ') + ' > ' + q.k + ' → ' + q.ans;
  if(q.shape === 2) return q.same ? tr('умаляемо = разлика → умалител ', 'зменшуване = різниця → від’ємник ') + q.ans
    : q.t.at === 1 ? q.M + ' − ' + q.D + ' = ' + q.ans : q.S + ' + ' + q.D + ' = ' + q.ans;
  return (q.shape === 0 ? tr(q.t.sub + ' в ', termUk[q.t.sub][0] + termUk[q.t.sub][2]) + q.x + ' ' + q.t.op + ' ' + q.y
    : tr('сборът ', 'сума ') + q.total + tr(' срещу ', ' проти ') + (q.t.at === 0 ? q.x : q.y)) + ' → ' + q.ans;
}
function whyTerm(q, full){
  if(TW_SHAPES[q.shape]) return whyTermWords(q, full);
  if(q.shape === 3){
    if(!full) return tr('Кои от задачите изобщо имат ' + (q.mins ? 'умаляемо' : 'умалител') + '?', 'Які з прикладів узагалі мають ' + (q.mins ? 'зменшуване' : 'від’ємник') + '?');
    const subs = q.list.filter(e => e[1] === '−'), v = e => q.mins ? e[0] : e[2];
    return tr('събирането няма ' + (q.mins ? 'умаляемо' : 'умалител') + '; ', 'у додаванні немає ' + (q.mins ? 'зменшуваного' : 'від’ємника') + '; ') +
      subs.map(e => e.join(' ') + ' → ' + (v(e) > q.k ? '<b>' + v(e) + '</b>' : v(e))).join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 2){
    if(!full) return tr('Умаляемо − умалител = разлика. Кое от трите липсва?', 'Зменшуване − від’ємник = різниця. Якого з трьох бракує?');
    if(q.same) return tr('умаляемото − умалителя = разликата, а те са равни &nbsp;→&nbsp; от него не е извадено нищо &nbsp;→&nbsp; умалителят е ', 'зменшуване − від’ємник = різниця, а вони рівні &nbsp;→&nbsp; нічого не віднято &nbsp;→&nbsp; від’ємник ') + q.ans;
    return q.t.at === 1 ? q.M + ' − ? = ' + q.D + ' &nbsp;→&nbsp; ' + q.M + ' − ' + q.D + ' = ' + q.ans
                        : '? − ' + q.S + ' = ' + q.D + ' &nbsp;→&nbsp; ' + q.S + ' + ' + q.D + ' = ' + q.ans;
  }
  if(!full) return q.t.op === '−' ? tr('Умаляемото е първото число, умалителят — второто.', 'Зменшуване — це перше число, від’ємник — друге.')
                                  : tr('Събираемите са числата, които събираме.', 'Доданки — це числа, які ми додаємо.');
  const val = q.t.at === 0 ? q.x : q.y;
  const head = tr(q.t.sub + ' в ', termUk[q.t.sub][0] + termUk[q.t.sub][2]) + q.x + ' ' + q.t.op + ' ' + q.y + tr(' е <b>', ' — <b>') + val + '</b>';
  if(q.shape === 0) return head;
  return q.chain.join(' + ') + ' = <b>' + q.total + '</b>, а ' + head +
    ' &nbsp;→&nbsp; ' + Math.max(val, q.total) + ' − ' + Math.min(val, q.total) + ' = ' + q.ans;
}
KIND.term = { draw:drawTerm, eq:eqTerm, why:whyTerm };
