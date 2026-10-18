// Question kind 'thr': level 53 Трицифрени — The smallest or largest three-digit number that fits a condition.

// Задача 19: the smallest three-digit number with all different digits is 102. Pinning a
// digit to one place shifts it, and the gap between the two is what is asked. Found by
// scanning rather than by a rule, so the rule cannot be got wrong.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const POSN = ['стотиците', 'десетиците', 'единиците'];
const allDiff = n => { const d = String(n); return d[0] !== d[1] && d[1] !== d[2] && d[0] !== d[2]; };
function pick3(small, pos, dig, any = false){
  for(let i = 0; i < 900; i++){
    const n = small ? 100 + i : 999 - i;
    if(!any && !allDiff(n)) continue;
    if(pos >= 0 && +String(n)[pos] !== dig) continue;
    return n;
  }
  return 0;
}
export function genThreeDig(){
  for(;;){
    const small = Math.random() < 0.6;
    const pos = rnd(3), dig = rnd(10);
    const a = pick3(small, pos, dig);
    if(!a) continue;
    const base = pick3(small, -1, 0);
    const shape = Math.random() < 0.55 ? 1 : 0;
    if(shape === 1 && a === base) continue;    // nothing to compare
    return {kind:'thr', small, pos, dig, a, base, shape, ans: shape === 0 ? a : Math.abs(a - base)};
  }
}

const thrUkPos = {'стотиците':'сотень', 'десетиците':'десятків', 'единиците':'одиниць'};
function drawThr(q){
  const which = tr('най-' + (q.small ? 'малкото' : 'голямото') + ' трицифрено число, записано с <b>три различни цифри</b>',
    'най' + (q.small ? 'менше' : 'більше') + ' трицифрове число, записане <b>трьома різними цифрами</b>');
  const pinned = which + tr(' и <b>цифра на ' + POSN[q.pos] + ' ' + q.dig + '</b>',
    ', з <b>цифрою ' + q.dig + ' в розряді ' + thrUkPos[POSN[q.pos]] + '</b>');
  const ask = q.shape === 0
    ? tr('Кое е ', 'Яке ') + pinned + '?'
    : tr('С колко ' + pinned + ' е <b>по-' + (q.small ? 'голямо' : 'малко') + '</b> от ' + which + '?',
         'На скільки ' + pinned + ', <b>' + (q.small ? 'більше' : 'менше') + '</b> за ' + which + '?');
  return '<div class="ask">' + ask + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqThr(q){
  return tr((q.small ? 'най-малко' : 'най-голямо') + ', ' + POSN[q.pos] + '=' + q.dig,
    (q.small ? 'найменше' : 'найбільше') + ', розряд ' + thrUkPos[POSN[q.pos]] + ' = ' + q.dig) +
    ' → ' + q.a + (q.shape === 1 ? tr(' срещу ', ' проти ') + q.base + ' → ' + q.ans : '');
}
function whyThr(q, full){
  if(!full) return tr('Подреждай цифрите отпред назад — първата тежи най-много.',
    'Добирай цифри зліва направо — перша важить найбільше.');
  const best = tr('най-' + (q.small ? 'малкото' : 'голямото'), 'най' + (q.small ? 'менше' : 'більше'));
  const found = tr('с ' + q.dig + ' на ' + POSN[q.pos] + ' ' + best + ' е <b>' + q.a + '</b>',
    best + ' число з цифрою ' + q.dig + ' в розряді ' + thrUkPos[POSN[q.pos]] + ' — <b>' + q.a + '</b>');
  if(q.shape === 0) return found.replace('<b>' + q.a + '</b>', q.a);
  const skip = q.small ? '100, 101' : '999, 998';   // the plain end repeats a digit: the trap
  return tr('само с различни цифри ' + best + ' е <b>' + q.base + '</b> (' + skip + ' повтарят цифра), а ',
    'лише з різними цифрами ' + best + ' — <b>' + q.base + '</b> (' + skip + ' мають однакові цифри), а ') +
    found + ' &nbsp;→&nbsp; ' + Math.max(q.a, q.base) + ' − ' + Math.min(q.a, q.base) + ' = ' + q.ans;
}
// Her misreadings: one of the two numbers given as the gap; a number with a repeated digit let in (100 for 102).
function slipThr(q, parts){
  const v = +parts[0], plain = q.small ? 100 : 999, any = pick3(q.small, q.pos, q.dig, true);
  if(v === q.ans) return null;
  if(q.shape === 1 && (v === q.a || v === q.base)) return 'otherQuestion';
  const loose = q.shape === 0 ? [any] : [Math.abs(q.a - plain), Math.abs(any - q.base), Math.abs(any - plain)];
  return loose.includes(v) ? 'sameDigits' : null;
}
KIND.thr = { draw:drawThr, eq:eqThr, why:whyThr, slip:slipThr };
