// Question kind 'brackets': level 99 86 − (51 − 5) — Brackets first — or see what they take away.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2023, задачи 1 и 3. 86 − (51 − 5): the bracket first, 86 − 46 = 40 — taking away
// 51 − 5 is taking away 51 and giving 5 back. (100 − 71) − (100 − 81) − (100 − 91): each bracket
// is how far a number is short of 100, so 29 − 19 − 9 = 1.
function genBrackets(){
  for(;;){
    if(Math.random() < 0.5){
      const b = 21 + rnd(60), c = 2 + rnd(Math.min(20, b - 12)), a = b - c + 5 + rnd(99 - b + c - 5);
      if(a > 99) continue;
      return {kind:'brackets', shape:0, a, b, c, inner: b - c, ans: a - (b - c)};
    }
    // three numbers under 100, each bracket what is left to 100; the first the biggest
    const xs = [51, 61, 71, 81, 91, 55, 65, 75, 85, 95, 62, 72, 82, 92];
    const pick = shuffle(xs.slice()).slice(0, 3).sort((x, y) => x - y), gaps = pick.map(x => 100 - x);
    const ans = gaps[0] - gaps[1] - gaps[2];
    if(ans < 0) continue;
    return {kind:'brackets', shape:1, xs: pick, gaps, ans};
  }
}
const bracketsExpr = q => q.shape === 0 ? q.a + ' − (' + q.b + ' − ' + q.c + ')' : q.xs.map(x => '(100 − ' + x + ')').join(' − ');
function drawBrackets(q){
  if(q.kind === 'brackets'){
    return '<div class="ask">' + tr('Пресметнете', 'Обчисліть') + '</div>' +
      '<div class="line" style="font-size:clamp(24px,7vw,42px)"><span class="num">' + bracketsExpr(q) + '</span> = ' + SLOT + '</div>';
  }
}
function eqBrackets(q){
  if(q.kind === 'brackets') return bracketsExpr(q) + ' = ' + q.ans;
}
function whyBrackets(q, full){
  if(q.kind === 'brackets'){
    if(!full) return q.shape === 0 ? tr('Първо сметката в скобите.', 'Спершу обчисли в дужках.')
                                   : tr('Всяка скоба е колко не достига до 100.', 'Кожна дужка — скільки бракує до 100.');
    if(q.shape === 0) return q.b + ' − ' + q.c + ' = <b>' + q.inner + '</b> &nbsp;→&nbsp; ' + q.a + ' − ' + q.inner + ' = ' + q.ans;
    return q.xs.map((x, i) => '100 − ' + x + ' = <b>' + q.gaps[i] + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.gaps.join(' − ') + ' = ' + q.ans;
  }
}
KIND.brackets = { draw:drawBrackets, eq:eqBrackets, why:whyBrackets };
