// Question kind 'times': level 141 6 · 7 — The times table, and division read back from it.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// The table up to 10 · 10, which the 2nd grade learns during the year, and dividing by reading it
// backwards: 42 : 6 is the number that times 6 makes 42. Every level that multiplies or divides
// needs this one, so the spring papers wait until she knows the table.
function genTimes(){
  const a = 2 + rnd(9), b = 2 + rnd(9), div = Math.random() < 0.4;
  return {kind:'times', a, b, div, traps:[div ? a*b - a : a + b], ans: div ? b : a*b};
}
function drawTimes(q){
  if(q.kind === 'times'){
    const [x, op, y] = q.div ? [q.a*q.b, ':', q.a] : [q.a, '·', q.b];
    return '<div class="sum"><span>' + x + '</span><span class="op">' + op + '</span><span>' + y + '</span><span class="op">=</span>' + SLOT + '</div>';
  }
}
function eqTimes(q){
  if(q.kind === 'times') return q.div ? q.a*q.b + ' : ' + q.a + ' = ' + q.b : q.a + ' · ' + q.b + ' = ' + q.a*q.b;
}
function whyTimes(q, full){
  if(q.kind === 'times'){
    if(!full) return q.div ? tr('Кое число, умножено по делителя, дава делимото?', 'Яке число, помножене на дільник, дає ділене?')
                           : tr('Умножението е събиране на еднакви числа.', 'Множення — це додавання однакових чисел.');
    if(q.div) return q.a + ' · <b>' + q.b + '</b> = ' + q.a*q.b + ' &nbsp;→&nbsp; ' + q.a*q.b + ' : ' + q.a + ' = ' + q.b;
    const [n, v] = q.a <= q.b ? [q.a, q.b] : [q.b, q.a];
    return q.a + ' · ' + q.b + tr(' е ', ' — це ') + Array(n).fill(v).join(' + ') + ' = ' + q.ans;
  }
}
KIND.times = { draw:drawTimes, eq:eqTimes, why:whyTimes };
