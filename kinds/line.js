// Question kind 'line': level 20 A, B, C — Along a line, right then left — how far apart?.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 14: two steps along a line, usually in opposite directions, then the distance.
function genLine(){
  const d1 = 2 + rnd(8);
  const back = Math.random() < 0.75;
  const d2 = back ? d1 + 1 + rnd(9) : 1 + rnd(9);
  const right = Math.random() < 0.5;
  return {kind:'line', d1, d2, right, back, ans: back ? d2 - d1 : d1 + d2};
}

function drawLine(q){
  if(q.kind === 'line'){
    const one = q.right ? 'вдясно' : 'вляво';
    const two = q.back ? (q.right ? 'вляво' : 'вдясно') : one;
    return '<div class="ask">На права линия е отбелязана точка <b>A</b>. На <span class="num">' + q.d1 +
      '</span> см ' + one + ' от нея е отбелязана точка <b>B</b>. След това, на същата права линия, на <span class="num">' +
      q.d2 + '</span> см ' + two + ' от точка <b>B</b> е отбелязана точка <b>C</b>. Колко сантиметра е разстоянието от <b>A</b> до <b>C</b>?</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
}
function eqLine(q){
  if(q.kind === 'line') return 'A → B ' + q.d1 + ', B → C ' + q.d2 + (q.back ? ' назад' : ' напред') + ' → ' + q.ans;
}
function whyLine(q, full){
  if(q.kind === 'line'){
    if(!full) return q.back ? 'Втората стъпка е в обратната посока.' : 'Двете стъпки са в една посока.';
    return 'A → B: ' + q.d1 + ' см, &nbsp;B → C: ' + q.d2 + ' см ' +
      (q.back ? 'обратно &nbsp;→&nbsp; ' + q.d2 + ' − ' + q.d1 : 'напред &nbsp;→&nbsp; ' + q.d1 + ' + ' + q.d2) +
      ' = ' + q.ans;
  }
}
KIND.line = { draw:drawLine, eq:eqLine, why:whyLine };
