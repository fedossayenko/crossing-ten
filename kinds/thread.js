// Question kind 'thread': level 138 Конецът — One thread laid out as one shape, then as another.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 13: a thread made a square of side 9 см, then an equilateral triangle. The
// thread is the square's perimeter, 36 см, shared into 3 equal sides: 12 см.
const THREAD = [[4, 'квадрат', 'квадрат'], [3, 'триъгълник с равни страни', 'трикутник з рівними сторонами']];
function genThread(){
  for(;;){
    const from = rnd(3), to = from === 2 ? rnd(2) : 1 - from;   // 2: a rectangle to begin with
    const a = 2 + rnd(12), b = 2 + rnd(12), L = from === 2 ? 2*(a + b) : THREAD[from][0]*a, k = THREAD[to][0];
    if(L % k || (from === 2 && a === b)) continue;
    return {kind:'thread', from, to, a, b, L, traps:[from === 2 ? a + b : a], ans: L / k};
  }
}
function drawThread(q){
  if(q.kind === 'thread'){
    const first = q.from === 2 ? tr('правоъгълник със страни <span class="num">' + q.a + '</span> см и <span class="num">' + q.b + '</span> см', 'прямокутник зі сторонами <span class="num">' + q.a + '</span> см і <span class="num">' + q.b + '</span> см')
      : tr(THREAD[q.from][1] + ' със страна <span class="num">' + q.a + '</span> см', THREAD[q.from][2] + ' зі стороною <span class="num">' + q.a + '</span> см');
    return '<div class="ask">' + tr('От конец направили ' + first + '. След това със същия конец направили ' + THREAD[q.to][1] + '. Колко сантиметра е дължината на една страна на този ' + (q.to ? 'триъгълник' : 'квадрат') + '?',
      'З нитки зробили ' + first + '. Потім із тієї ж нитки зробили ' + THREAD[q.to][2] + '. Скільки сантиметрів завдовжки одна сторона цього ' + (q.to ? 'трикутника' : 'квадрата') + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqThread(q){
  if(q.kind === 'thread') return (q.from === 2 ? '2 · (' + q.a + ' + ' + q.b + ')' : THREAD[q.from][0] + ' · ' + q.a) + ' = ' + q.L + ', ' + q.L + ' : ' + THREAD[q.to][0] + ' = ' + q.ans;
}
function whyThread(q, full){
  if(q.kind === 'thread'){
    if(!full) return tr('Конецът е толкова дълъг, колкото е обиколката на първата фигура.', 'Нитка така сама завдовжки, як периметр першої фігури.');
    const per = q.from === 2 ? q.a + ' + ' + q.b + ' + ' + q.a + ' + ' + q.b : Array(THREAD[q.from][0]).fill(q.a).join(' + ');
    return tr('конецът: ', 'нитка: ') + per + ' = <b>' + q.L + '</b> см &nbsp;→&nbsp; ' + q.L + ' : ' + THREAD[q.to][0] + ' = ' + q.ans;
  }
}
KIND.thread = { draw:drawThread, eq:eqThread, why:whyThread };
