// Question kind 'unitcmp': level 280 Сравни мерките — Two lengths in см, дм and м, and the sign between them.

// Аз и числата 2024, задача 5, and 2026, задача 6 (the same three): 40 дм _ 6 дм, 3 дм _ 30 см, 90 см _ 1 м.
// Аз и числата 2022, задача 8: 52 см _ 5 дм, 3 дм _ 29 см, 1 дм _ 100 см, 60 см _ 6 дм, 1 м _ 100 см, 9 см _ 1 дм.
// The trap is the bare numbers: 3 is less than 30, but 3 дм are 30 см. Both lengths in the smaller unit
// first, then compare. Аз и числата 2025, задача 3 (shape 'sum'): one side a sum or a difference of two
// lengths in one unit — 50 см + 50 см _ 1 м, 10 м − 4 м _ 6 см (six metres against six centimetres), 3 дм + 6 дм
// _ 900 см (9 дм are 90 см, not 900: the wrong way round, ten taken for a hundred). A sign cannot be typed,
// so the kind brings its own three, in the order the papers name them: <, =, >.
import { KIND, rnd, tr } from '../js/core.js';
const UC_MM = { см:10, дм:100, м:1000 }, UC_SIGN = ['&lt;', '=', '&gt;'], UC_RAW = ['<', '=', '>'];
const ucOptions = pick => ({ options: UC_SIGN.map((s, id) => ({ id, v: id, text: /** @type {[string, string]} */ ([s, s]) })), pick, own: true, ans: pick });
const ucMm = side => side.op ? (side.op === '+' ? side.a + side.b : side.a - side.b) * UC_MM[side.u] : side.n * UC_MM[side.u];
const ucPick = (L, R) => { const l = ucMm(L), r = ucMm(R); return l < r ? 0 : l === r ? 1 : 2; };
// [bigger, smaller, how many smaller in one bigger]
/** @type {[string, string, number][]} */
const UC_PAIRS = [['дм', 'см', 10], ['м', 'дм', 10], ['м', 'см', 100]];
export function genUnitCmp(){
  if(Math.random() < 0.3) return genUnitCmpSum();
  for(;;){
    let big, small;
    if(Math.random() < 0.2){   // one unit on both sides: the numbers decide, as they look
      const u = ['см', 'дм', 'м'][rnd(3)], a = 2 + rnd(98), b = 2 + rnd(98);
      if(a === b) continue;
      big = {n:a, u}; small = {n:b, u};
    } else {
      const [B, S, k] = UC_PAIRS[rnd(UC_PAIRS.length)], A = k === 100 ? 1 : 1 + rnd(9), r = Math.random();
      // as many as the big one (a third), a little either side of it, or anything to a hundred
      const n = r < 0.36 ? A*k : r < 0.85 ? A*k + (Math.random() < 0.5 ? -1 : 1)*(k === 100 ? 10*(1 + rnd(5)) : 1 + rnd(9)) : 1 + rnd(100);
      if(n < 1 || n > 100) continue;
      big = {n:A, u:B}; small = {n, u:S};
    }
    const [L, R] = Math.random() < 0.5 ? [big, small] : [small, big];
    return Object.assign({kind:'unitcmp', shape:'plain', L, R}, ucOptions(ucPick(L, R)));
  }
}
// a sum or a difference in one unit on the left; on the right the same length (a third), the same number in
// another unit, the wrong way round (a hundred for a ten), or a little either side
function genUnitCmpSum(){
  for(;;){
    const u = ['см', 'дм', 'м'][rnd(3)], op = Math.random() < 0.6 ? '+' : '−', a = 1 + rnd(60), b = 1 + rnd(50), S = op === '+' ? a + b : a - b;
    if(S < 2 || S > 100 || (op === '+' && a + b > 100)) continue;
    const L = {a, op, b, u}, r = Math.random(), others = Object.keys(UC_MM).filter(v => v !== u), v = others[rnd(2)], k = UC_MM[u] / UC_MM[v];
    let n;
    if(r < 0.35) n = S*k;                              // the same length in the other unit
    else if(r < 0.6) n = S;                            // the same number, another unit
    else if(r < 0.75){ if(k !== 10) continue; n = S*100; }   // a hundred where it is ten
    else n = S*k + (Math.random() < 0.5 ? -1 : 1)*(1 + rnd(9));
    // whole numbers to a hundred, or the wrong-way hundreds (up to 900, as the paper's 900 см)
    if(!Number.isInteger(n) || n < 1 || (n > 100 && !(n % 100 === 0 && n <= 900))) continue;
    const R = {n, u:v};
    return Object.assign({kind:'unitcmp', shape:'sum', L, R}, ucOptions(ucPick(L, R)));
  }
}
const ucLen = (n, u) => n + '&nbsp;<span class="unit">' + u + '</span>';
const ucSide = s => s.op ? ucLen(s.a, s.u) + ' ' + s.op + ' ' + ucLen(s.b, s.u) : ucLen(s.n, s.u);
const ucText = s => s.op ? s.a + ' ' + s.u + ' ' + s.op + ' ' + s.b + ' ' + s.u : s.n + ' ' + s.u;
function drawUnitCmp(q){
  return '<div class="ask">' + tr('Постави знак <b>&lt;</b>, <b>=</b> или <b>&gt;</b>.', 'Постав знак <b>&lt;</b>, <b>=</b> або <b>&gt;</b>.') + '</div>' +
    (q.shape === 'sum' ? '<div class="line md">' + ucSide(q.L) + ' <span class="op">□</span> ' + ucSide(q.R) + '</div>'   // five terms: the smaller line keeps them on one
      : '<div class="sum"><span>' + ucSide(q.L) + '</span><span class="op">□</span><span>' + ucSide(q.R) + '</span></div>');
}
function eqUnitCmp(q){ return ucText(q.L) + ' ' + UC_RAW[q.ans] + ' ' + ucText(q.R); }
// the smaller of the two units, and a side's length in it
const ucUnder = q => [q.L.u, q.R.u].sort((x, y) => UC_MM[x] - UC_MM[y])[0], ucIn = (s, w) => ucMm(s) / UC_MM[w];
function whyUnitCmp(q, full){
  const same = q.L.u === q.R.u;
  if(!full) return q.shape === 'sum' ? tr('Първо пресметни лявата страна. После двете дължини в едни и същи мерки — и сравни.', 'Спершу обчисли ліву частину. Потім обидві довжини в однакових одиницях — і порівняй.')
    : same ? tr('Мерките са едни и същи — сравни числата.', 'Одиниці однакові — порівняй числа.')
    : tr('Числата не стигат: първо двете дължини в едни и същи мерки — после ги сравни.', 'Самих чисел замало: спершу обидві довжини в однакових одиницях — потім порівняй.');
  const w = ucUnder(q), sign = ' <b>' + UC_SIGN[q.ans] + '</b> ', parts = [];
  if(q.shape === 'sum') parts.push(ucText(q.L) + ' = ' + ucIn(q.L, q.L.u) + ' ' + q.L.u);
  const conv = s => { const S = s.op ? ucIn(s, s.u) : s.n; return s.u === w ? '' : S + ' ' + s.u + ' = ' + ucIn(s, w) + ' ' + w; };
  [q.L, q.R].map(conv).filter(Boolean).forEach(c => parts.push(c));
  if(same && q.shape !== 'sum') return ucText(q.L) + sign + ucText(q.R) + tr(': мерките са едни и същи, сравняват се числата', ': одиниці однакові, порівнюються числа');
  // the same number in two units: the bigger unit is the longer length, no need to count it out
  const SL = ucIn(q.L, q.L.u);
  if(!same && SL === q.R.n){
    const big = UC_MM[q.L.u] > UC_MM[q.R.u] ? q.L.u : q.R.u, BIG = { см:['сантиметърът', 'сантиметр'], дм:['дециметърът', 'дециметр'], м:['метърът', 'метр'] }[big];
    return (q.shape === 'sum' ? ucText(q.L) + ' = ' + SL + ' ' + q.L.u + ', ' : '') + SL + ' ' + q.L.u + tr(' и ', ' і ') + q.R.n + ' ' + q.R.u +
      tr(': числото е едно и също, а ' + BIG[0] + ' е по-дълъг', ': число те саме, а ' + BIG[1] + ' довший') + ' &nbsp;→&nbsp; ' + ucText(q.L) + sign + ucText(q.R);
  }
  return parts.join(', ') + ' &nbsp;→&nbsp; ' + ucIn(q.L, w) + ' ' + w + sign + ucIn(q.R, w) + ' ' + w + ' &nbsp;→&nbsp; ' + ucText(q.L) + sign + ucText(q.R);
}
KIND.unitcmp = { draw:drawUnitCmp, eq:eqUnitCmp, why:whyUnitCmp };
