// Question kind 'units': level 267 1 дм = 10 см — Millimetres, centimetres, decimetres and metres, one into another.

// The drill under Ленти, Гирлянди and the perimeters in мм: 1 м = 10 дм, 1 дм = 10 см, 1 см = 10 мм, written the
// way the textbook does, «3 дм 4 см». Down to a smaller unit, up to a bigger one, two units joined into one
// (1 м 5 см is 105 см, not 15) and one split into two. Never м to мм: a thousand is past the 2nd grade's numbers.
// No answer is 1, 10 or 100, the numbers the first-miss nudge names.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const UNIT_MM = { мм:1, см:10, дм:100, м:1000 };
// one, counted (after a number or колко), plural; Ukrainian one, counted
const UNIT_W = { мм:['милиметър', 'милиметра', 'милиметри', 'міліметр', 'міліметрів'], см:['сантиметър', 'сантиметра', 'сантиметри', 'сантиметр', 'сантиметрів'],
  дм:['дециметър', 'дециметра', 'дециметри', 'дециметр', 'дециметрів'], м:['метър', 'метра', 'метри', 'метр', 'метрів'] };
// bigger and smaller unit; the last one (дм to мм) is only asked one way, never joined or split
const UNIT_PAIRS = [['дм', 'см'], ['см', 'мм'], ['м', 'дм'], ['м', 'см'], ['дм', 'мм']];
export function genUnits(){
  for(;;){
    const r = Math.random(), shape = r < 0.3 ? 'down' : r < 0.55 ? 'up' : r < 0.8 ? 'join' : 'split';
    const [big, small] = UNIT_PAIRS[rnd(shape === 'down' || shape === 'up' ? 5 : 4)], k = UNIT_MM[big] / UNIT_MM[small];
    const a = 1 + rnd(9), b = 1 + rnd(k - 1), askBig = Math.random() < 0.5;
    // the slips: ten where it is a hundred, «1 м 5 см» read as 15, the ones digit of 25 kept as 5
    const q = shape === 'down' ? {kind:'units', shape, big, small, k, a, ans: a*k, traps:[a*(k === 100 ? 10 : 100)]}
      : shape === 'up' ? {kind:'units', shape, big, small, k, a, ans: a, traps:[a*k / 10]}
      : shape === 'join' ? {kind:'units', shape, big, small, k, a, b, ans: a*k + b, traps:[k === 100 && b < 10 ? 10*a + b : a + b]}
      : {kind:'units', shape, big, small, k, a, b, askBig, ans: askBig ? a : b, traps:[askBig ? Math.floor((a*k + b) / 10) : b % 10]};
    if(q.ans === 1 || q.ans === 10 || q.ans === 100) continue;
    q.traps = q.traps.filter(v => v !== q.ans);
    return q;
  }
}
const unitLen = (n, u) => n + '<span class="unit">' + u + '</span>';
function drawUnits(q){
  const T = q.a*q.k + (q.b || 0);
  const [left, right] = q.shape === 'down' ? [unitLen(q.a, q.big), unitLen(SLOT, q.small)]
    : q.shape === 'up' ? [unitLen(T, q.small), unitLen(SLOT, q.big)]
    : q.shape === 'join' ? [unitLen(q.a, q.big) + ' ' + unitLen(q.b, q.small), unitLen(SLOT, q.small)]
    : [unitLen(T, q.small), unitLen(q.askBig ? SLOT : q.a, q.big) + ' ' + unitLen(q.askBig ? q.b : SLOT, q.small)];
  return '<div class="sum"><span>' + left + '</span><span class="op">=</span><span>' + right + '</span></div>';
}
function eqUnits(q){
  const T = q.a*q.k + (q.b || 0);
  if(q.shape === 'down') return q.a + ' ' + q.big + ' = ' + q.ans + ' ' + q.small;
  if(q.shape === 'up') return T + ' ' + q.small + ' = ' + q.ans + ' ' + q.big;
  if(q.shape === 'join') return q.a + ' ' + q.big + ' ' + q.b + ' ' + q.small + ' = ' + q.ans + ' ' + q.small;
  return T + ' ' + q.small + ' = ' + q.a + ' ' + q.big + ' ' + q.b + ' ' + q.small + (q.askBig ? ' → ' + q.a : '');
}
function whyUnits(q, full){
  const [B, S] = [UNIT_W[q.big], UNIT_W[q.small]], T = q.a*q.k + (q.b || 0);
  const each = tr('Всеки ' + B[0] + ' е ' + q.k + ' ' + S[1] + '.', 'Кожен ' + B[3] + ' — це ' + q.k + ' ' + S[4] + '.');
  if(!full) return q.shape === 'down' ? each
    : q.shape === 'up' ? tr('Всеки ' + q.k + ' ' + S[1] + ' са 1 ' + B[0] + '.', 'Кожні ' + q.k + ' ' + S[4] + ' — це 1 ' + B[3] + '.')
    : q.shape === 'join' ? tr('Първо ' + B[2] + 'те в ' + S[2] + ': ' + each.toLowerCase() + ' После добави останалите ' + S[2] + '.',
                              'Спершу ' + B[4] + ' в ' + S[4] + ': ' + each.toLowerCase() + ' Потім додай решту ' + S[4] + '.')
    : each + ' ' + tr('Колко цели ' + B[1] + ' има и колко ' + S[1] + ' остават?', 'Скільки є цілих ' + B[4] + ' і скільки ' + S[4] + ' лишається?');
  const one = '1 ' + q.big + ' = ' + q.k + ' ' + q.small + ' &nbsp;→&nbsp; ';
  if(q.shape === 'down') return one + q.a + ' ' + q.big + ' = ' + q.a + ' · ' + q.k + ' = <b>' + q.ans + '</b> ' + q.small;
  if(q.shape === 'up') return one + T + ' ' + q.small + ' = ' + q.a + ' · ' + q.k + ' ' + q.small + ' = <b>' + q.ans + '</b> ' + q.big;
  if(q.shape === 'join') return one + q.a + ' ' + q.big + ' = ' + q.a*q.k + ' ' + q.small + ', ' + q.a*q.k + ' + ' + q.b + ' = <b>' + q.ans + '</b> ' + q.small;
  if(q.askBig) return one + T + ' ' + q.small + ' = ' + q.a*q.k + ' ' + q.small + ' + ' + q.b + ' ' + q.small + ', ' + q.a*q.k + ' ' + q.small + ' = <b>' + q.ans + '</b> ' + q.big;
  return one + q.a + ' ' + q.big + ' = ' + q.a*q.k + ' ' + q.small + ', ' + T + ' − ' + q.a*q.k + ' = <b>' + q.ans + '</b> ' + q.small;
}
KIND.units = { draw:drawUnits, eq:eqUnits, why:whyUnits };
