// Question kind 'thr': level 53 Трицифрени — The smallest or largest three-digit number that fits a condition.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 19: the smallest three-digit number with all different digits is 102. Pinning a
// digit to one place shifts it, and the gap between the two is what is asked. Found by
// scanning rather than by a rule, so the rule cannot be got wrong.
const POSN = ['стотиците', 'десетиците', 'единиците'];
const allDiff = n => { const d = String(n); return d[0] !== d[1] && d[1] !== d[2] && d[0] !== d[2]; };
function pick3(small, pos, dig){
  for(let i = 0; i < 900; i++){
    const n = small ? 100 + i : 999 - i;
    if(!allDiff(n)) continue;
    if(pos >= 0 && +String(n)[pos] !== dig) continue;
    return n;
  }
  return 0;
}
function genThreeDig(){
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
  if(q.kind === 'thr'){
    const which = tr('най-' + (q.small ? 'малкото' : 'голямото') + ' трицифрено число, записано с <b>три различни цифри</b>',
      'най' + (q.small ? 'менше' : 'більше') + ' трицифрове число, записане <b>трьома різними цифрами</b>');
    const pinned = which + tr(' и <b>цифра на ' + POSN[q.pos] + ' ' + q.dig + '</b>',
      ', з <b>цифрою ' + q.dig + ' в розряді ' + thrUkPos[POSN[q.pos]] + '</b>');
    const ask = q.shape === 0
      ? tr('Кое е ', 'Яке ') + pinned + '?'
      : tr('С колко ' + pinned + ' е <b>по-' + (q.small ? 'голямо' : 'малко') + '</b> от ' + which + '?',
           'На скільки ' + pinned + ', <b>' + (q.small ? 'більше' : 'менше') + '</b> за ' + which + '?');
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqThr(q){
  if(q.kind === 'thr') return tr((q.small ? 'най-малко' : 'най-голямо') + ', ' + POSN[q.pos] + '=' + q.dig,
    (q.small ? 'найменше' : 'найбільше') + ', розряд ' + thrUkPos[POSN[q.pos]] + ' = ' + q.dig) +
    ' → ' + q.a + (q.shape === 1 ? tr(' срещу ', ' проти ') + q.base + ' → ' + q.ans : '');
}
function whyThr(q, full){
  if(q.kind === 'thr'){
    if(!full) return tr('Подреждай цифрите отпред назад — първата тежи най-много.',
      'Добирай цифри зліва направо — перша важить найбільше.');
    const best = tr('най-' + (q.small ? 'малкото' : 'голямото'), 'най' + (q.small ? 'менше' : 'більше'));
    const found = tr('с ' + q.dig + ' на ' + POSN[q.pos] + ' ' + best + ' е <b>' + q.a + '</b>',
      best + ' число з цифрою ' + q.dig + ' в розряді ' + thrUkPos[POSN[q.pos]] + ' — <b>' + q.a + '</b>');
    if(q.shape === 0) return found.replace('<b>' + q.a + '</b>', q.a);
    return tr('без условие ' + best + ' е <b>' + q.base + '</b>, а ',
      'без умови ' + best + ' — <b>' + q.base + '</b>, а ') +
      found + ' &nbsp;→&nbsp; ' + Math.max(q.a, q.base) + ' − ' + Math.min(q.a, q.base) + ' = ' + q.ans;
  }
}
KIND.thr = { draw:drawThr, eq:eqThr, why:whyThr };
