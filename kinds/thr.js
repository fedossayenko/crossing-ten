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

function drawThr(q){
  if(q.kind === 'thr'){
    const which = 'най-' + (q.small ? 'малкото' : 'голямото') + ' трицифрено число, записано с <b>три различни цифри</b>';
    const pinned = which + ' и <b>цифра на ' + POSN[q.pos] + ' ' + q.dig + '</b>';
    const ask = q.shape === 0
      ? 'Кое е ' + pinned + '?'
      : 'С колко ' + pinned + ' е <b>по-' + (q.small ? 'голямо' : 'малко') + '</b> от ' + which + '?';
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqThr(q){
  if(q.kind === 'thr') return (q.small ? 'най-малко' : 'най-голямо') + ', ' + POSN[q.pos] + '=' + q.dig +
    ' → ' + q.a + (q.shape === 1 ? ' срещу ' + q.base + ' → ' + q.ans : '');
}
function whyThr(q, full){
  if(q.kind === 'thr'){
    if(!full) return 'Подреждай цифрите отпред назад — първата тежи най-много.';
    const found = 'с ' + q.dig + ' на ' + POSN[q.pos] + ' най-' + (q.small ? 'малкото' : 'голямото') +
      ' е <b>' + q.a + '</b>';
    if(q.shape === 0) return found.replace('<b>' + q.a + '</b>', q.a);
    return 'без условие най-' + (q.small ? 'малкото' : 'голямото') + ' е <b>' + q.base + '</b>, а ' +
      found + ' &nbsp;→&nbsp; ' + Math.max(q.a, q.base) + ' − ' + Math.min(q.a, q.base) + ' = ' + q.ans;
  }
}
KIND.thr = { draw:drawThr, eq:eqThr, why:whyThr };
