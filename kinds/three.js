// Question kind 'three': level 41 Три точки — Three points on a line — two answers.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 12: with three points on a line the longest distance is the other two added,
// so the third measurement is either the difference or the sum.
function genThree(){
  const who = NAMES[rnd(NAMES.length)][0];
  const a = 1 + rnd(7);
  const b = a + 1 + rnd(7);
  return {kind:'three', who, a, b, slots:2, ans: b - a, alt:[a + b]};
}

function drawThree(q){
  if(q.kind === 'three'){
    return '<div class="ask">Върху права са отбелязани <b>3 точки</b>. ' + q.who +
      ' премерил разстоянията между всеки две от точките и записал две от тях: <span class="num">' +
      q.a + '</span> см и <span class="num">' + q.b +
      '</span> см. Колко сантиметра е възможно да е третото разстояние?</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT +
      ' <span class="or">или</span> <span class="slot" id="slot1"></span>' + CM + '</div>';
  }
}
function eqThree(q){
  if(q.kind === 'three') return q.a + ' и ' + q.b + ' → ' + (q.b - q.a) + ' или ' + (q.a + q.b);
}
function whyThree(q, full){
  if(q.kind === 'three'){
    if(!full) return 'При три точки върху права най-голямото разстояние е сборът на другите две.';
    return 'ако ' + q.b + ' е най-голямото &nbsp;→&nbsp; ' + q.b + ' − ' + q.a + ' = <b>' + (q.b - q.a) +
      '</b>; &nbsp;ако третото е най-голямото &nbsp;→&nbsp; ' + q.a + ' + ' + q.b + ' = <b>' + (q.a + q.b) + '</b>';
  }
}
KIND.three = { draw:drawThree, eq:eqThree, why:whyThree };
