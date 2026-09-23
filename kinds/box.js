// Question kind 'box': level 11 6 − ◯ — Find the hidden number — or two of them — then use it.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 2 and 4: the two sides say the same thing. One side can be worked out, and the
// unknown is then read off the other — which way round the box sits decides the last step.
function genBalance(){
  for(;;){
    // 0: x+y = N−□   1: x−y = □+N   2: x+y = □+N   3: x−y = N−□   4: x+y = □−N   5: x−y = □−N
    const form = rnd(6);
    const round = Math.random() < 0.35;
    const x = round ? 10*(3 + rnd(8)) : 11 + rnd(80);
    const y = round ? 10*(1 + rnd(6)) : 11 + rnd(60);
    const plus = form === 0 || form === 2 || form === 4;
    if(!plus && x <= y) continue;
    const L = plus ? x + y : x - y;
    if(L < 5 || L > 100) continue;
    const N = round ? 10*(1 + rnd(9)) : 5 + rnd(90);
    const box = (form === 0 || form === 3) ? N - L : form >= 4 ? L + N : L - N;
    if(box < 1 || box > 99) continue;
    return {kind:'box', shape:'bal', form, x, y, N, L, plus, ans: box};
  }
}
// Задача 6: the unknown sits in an addition of round tens, and is then used in a
// subtraction — two steps, with arithmetic easy enough that the two steps stay the point.
function genPlusBox(){
  const g = 10 * (1 + rnd(5));                          // what stands beside the unknown
  const box = 10 * (2 + rnd(4));
  const p = 10 * (1 + rnd(box / 10 - 1));               // always short of the unknown, so the second step is worth taking
  return {kind:'box', shape:'plus', g, p, box, S: g + box, ans: box - p};
}
// Задача 2: two unknowns, one in each given. Each is a missing addend on its own,
// and what is wanted is not either of them but what they make together.
function genTwoBox(){
  const sq = 1 + rnd(9), tri = 1 + rnd(9);
  const p = 1 + rnd(9), r = 1 + rnd(9);
  return {kind:'box', shape:'two', p, r, sq, tri, ans: sq + tri};
}
// Задача 4: an unknown inside a subtraction, where the other side is itself a sum.
function genBox(){
  const pick = Math.random();
  if(pick < 0.26) return genTwoBox();
  if(pick < 0.48) return genPlusBox();
  if(pick < 0.74) return genBalance();
  const box = 2 + rnd(8);
  const r = 1 + rnd(9);
  const b = box + r;
  const y = 1 + rnd(9), x = y + r;
  let a;
  // same start makes it a one-stepper, and a must stay above the circle
  do { a = 7 + rnd(14); } while(a === b || a <= box);
  return {kind:'box', a, b, x, y, box, r, ans: a - box};
}

function drawBox(q){
  if(q.kind === 'box' && q.shape === 'bal'){
    const B = '<span class="circle">□</span>';
    const left = q.x + (q.plus ? ' + ' : ' − ') + q.y;
    const right = (q.form === 0 || q.form === 3) ? q.N + ' − ' + B
                : q.form >= 4 ? B + ' − ' + q.N : B + ' + ' + q.N;
    return '<div class="ask">' + tr('Кое число трябва да поставим вместо ' + B +
      ', така че да е вярно равенството?', 'Яке число треба поставити замість ' + B +
      ', щоб рівність була правильною?') + '</div>' +
      '<div class="given">' + left + ' = ' + right + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + B + ' = ' + SLOT + '</div>';
  }
  if(q.kind === 'box' && q.shape === 'plus'){
    const sq = '<span class="circle">■</span>';
    return '<div class="ask">' + tr('Пресметнете ', 'Обчисліть ') + sq + ' − <span class="num">' + q.p + '</span>' + tr(', ако', ', якщо') + '</div>' +
      '<div class="given">' + q.g + ' + ' + sq + ' = ' + q.S + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + sq + ' − ' + q.p +
      ' = ' + SLOT + '</div>';
  }
  if(q.kind === 'box' && q.shape === 'two'){
    const sym = c => '<span class="circle">' + c + '</span>';
    return '<div class="ask">' + tr('Пресметнете ', 'Обчисліть ') + sym('■') + ' + ' + sym('□') + tr(', ако', ', якщо') + '</div>' +
      '<div class="given">' + q.p + ' + ' + sym('□') + ' = ' + (q.p + q.tri) + ' &nbsp;' + tr('и', 'і') + '&nbsp; ' +
      q.r + ' + ' + sym('■') + ' = ' + (q.r + q.sq) + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + sym('■') + ' + ' + sym('□') +
      ' = ' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr('Пресметни, ако', 'Обчисли, якщо') + '</div>' +
    '<div class="given">' + q.b + ' − <span class="circle">◯</span> = ' + q.x + ' − ' + q.y + '</div>' +
    '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + q.a +
    ' − <span class="circle">◯</span> = ' + SLOT + '</div>';
}
function eqBox(q){
  if(q.kind === 'box' && q.shape === 'bal') return q.x + (q.plus ? '+' : '−') + q.y + ' = ' + q.L +
    ' → □ = ' + q.ans;
  if(q.kind === 'box' && q.shape === 'plus') return '■ = ' + q.S + ' − ' + q.g + ' = ' + q.box + ' → ' + q.ans;
  if(q.kind === 'box' && q.shape === 'two') return '□ = ' + q.tri + ', ■ = ' + q.sq + ' → ' + q.ans;
  if(q.kind === 'box') return q.b + ' − ◯ = ' + q.x + ' − ' + q.y + ' → ' + q.a + ' − ◯ = ' + q.ans;
}
function whyBox(q, full){
  if(q.shape === 'bal'){
    if(!full) return tr('Едната страна може да се пресметне докрай — започни оттам.', 'Одну зі сторін можна обчислити до кінця — почни звідти.');
    const left = q.x + (q.plus ? ' + ' : ' − ') + q.y;
    const tail = (q.form === 0 || q.form === 3) ? '□ = ' + q.N + ' − ' + q.L + ' = ' + q.ans
               : q.form >= 4 ? '□ = ' + q.L + ' + ' + q.N + ' = ' + q.ans
               : '□ = ' + q.L + ' − ' + q.N + ' = ' + q.ans;
    return left + ' = <b>' + q.L + '</b> &nbsp;→&nbsp; ' + tail;
  }
  if(q.shape === 'plus'){
    if(!full) return tr('Намери първо какво стои в квадратчето.', 'Спочатку знайди, що стоїть у квадратику.');
    return '■ = ' + q.S + ' − ' + q.g + ' = <b>' + q.box + '</b> &nbsp;→&nbsp; ' +
      q.box + ' − ' + q.p + ' = ' + q.ans;
  }
  if(q.shape === 'two'){
    if(!full) return tr('Намери първо всяко от двете поотделно.', 'Спочатку знайди кожне з двох чисел окремо.');
    return '□ = ' + (q.p + q.tri) + ' − ' + q.p + ' = <b>' + q.tri + '</b>, &nbsp;■ = ' +
      (q.r + q.sq) + ' − ' + q.r + ' = <b>' + q.sq + '</b> &nbsp;→&nbsp; ' +
      q.sq + ' + ' + q.tri + ' = ' + q.ans;
  }
  if(!full) return tr('Първо пресметни дясната страна.', 'Спочатку обчисли праву сторону.');
  return q.x + ' − ' + q.y + ' = ' + q.r + ' &nbsp;→&nbsp; <b>◯ = ' + q.b + ' − ' + q.r + ' = ' + q.box +
         '</b> &nbsp;→&nbsp; ' + q.a + ' − ' + q.box + ' = ' + q.ans;
}
KIND.box = { draw:drawBox, eq:eqBox, why:whyBox };
