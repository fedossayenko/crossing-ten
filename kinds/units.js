// Question kind 'units': level 267 1 дм = 10 см — Centimetres, decimetres and metres, one into another;
// level 268 1 м = 100 см — and millimetres, and a hundred to a metre.

// The drill under Ленти, Гирлянди and the perimeters in мм: 1 м = 10 дм, 1 дм = 10 см, 1 см = 10 мм, written the
// way the textbook does, «3 дм 4 см». Down to a smaller unit, up to a bigger one, two units joined into one
// (1 м 5 см is 105 см, not 15) and one split into two. In the school's order: the 2nd grade has см, дм and м with
// numbers to 100 (level 267); мм and numbers to 1000 are the 3rd grade's, though МБГ Зима asks мм in the 2nd
// (level 268, after 267). Never м to мм: a thousand is past even that. No answer is 1, 10 or 100, the numbers
// the first-miss nudge names.
import { KIND, SLOT, UNIT_MM, rnd, tr } from '../js/core.js';
// one, counted (after a number or колко), plural; Ukrainian one, counted
const UNIT_W = { мм:['милиметър', 'милиметра', 'милиметри', 'міліметр', 'міліметрів'], см:['сантиметър', 'сантиметра', 'сантиметри', 'сантиметр', 'сантиметрів'],
  дм:['дециметър', 'дециметра', 'дециметри', 'дециметр', 'дециметрів'], м:['метър', 'метра', 'метри', 'метр', 'метрів'] };
// bigger and smaller unit; the first two of each are also joined and split (дм and мм only one way)
const UNIT_EASY = [['дм', 'см'], ['м', 'дм']], UNIT_WIDE = [['см', 'мм'], ['м', 'см'], ['дм', 'мм']];
export function genUnits(){ return unitsFrom(UNIT_EASY); }
export function genUnitsWide(){ return unitsFrom(UNIT_WIDE); }
function unitsFrom(pairs){
  for(;;){
    const r = Math.random(), shape = r < 0.3 ? 'down' : r < 0.55 ? 'up' : r < 0.8 ? 'join' : 'split';
    const [big, small] = pairs[rnd(shape === 'down' || shape === 'up' ? pairs.length : 2)], k = UNIT_MM[big] / UNIT_MM[small];
    const a = 1 + rnd(9), b = 1 + rnd(k - 1), askBig = Math.random() < 0.5;
    // the slips: the wrong way (30 см as 300 дм, seen on Ленти) or ten where it is a hundred,
    // «1 м 5 см» read as 15, the ones digit of 25 kept as 5
    const q = shape === 'down' ? {kind:'units', shape, big, small, k, a, ans: a*k, traps:[a*(k === 100 ? 10 : 100)]}
      : shape === 'up' ? {kind:'units', shape, big, small, k, a, ans: a, traps:[a*(k === 100 ? 10 : 100)]}
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
// Converted the wrong way or by the wrong step (268: «700» for 7 см in мм, «800» for 80 мм in см, 2026-10-11); two units
// put side by side or a metre taken for ten centimetres (268: «55» for 5 м 5 см, «37» for 2 м 17 см)
function slipUnits(q, parts){
  const v = +parts[0];
  if(parts.length !== 1 || v === q.ans) return null;
  if(q.shape === 'down' || q.shape === 'up') return q.traps.includes(v) ? 'unitsWay' : null;
  return q.shape === 'join' && (q.traps.includes(v) || v === q.a * q.k / 10 + q.b) ? 'unitsJoin' : null;
}
KIND.units = { draw:drawUnits, eq:eqUnits, why:whyUnits, slip:slipUnits };
