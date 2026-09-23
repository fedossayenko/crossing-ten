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
    const one = q.right ? tr('вдясно', 'праворуч') : tr('вляво', 'ліворуч');
    const two = q.back ? (q.right ? tr('вляво', 'ліворуч') : tr('вдясно', 'праворуч')) : one;
    return '<div class="ask">' + tr('На права линия е отбелязана точка <b>A</b>. На <span class="num">' + q.d1 +
      '</span> см ' + one + ' от нея е отбелязана точка <b>B</b>. След това, на същата права линия, на <span class="num">' +
      q.d2 + '</span> см ' + two + ' от точка <b>B</b> е отбелязана точка <b>C</b>. Колко сантиметра е разстоянието от <b>A</b> до <b>C</b>?',
      'На прямій позначили точку <b>A</b>. На відстані <span class="num">' + q.d1 +
      '</span> см ' + one + ' від неї позначили точку <b>B</b>. Потім на тій самій прямій на відстані <span class="num">' +
      q.d2 + '</span> см ' + two + ' від точки <b>B</b> позначили точку <b>C</b>. Скільки сантиметрів від <b>A</b> до <b>C</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
}
function eqLine(q){
  if(q.kind === 'line') return tr('A → B ' + q.d1 + ', B → C ' + q.d2 + (q.back ? ' назад' : ' напред'),
    'A → B ' + q.d1 + ', B → C ' + (q.back ? 'назад на ' : 'вперед на ') + q.d2) + ' → ' + q.ans;
}
function whyLine(q, full){
  if(q.kind === 'line'){
    if(!full) return q.back ? tr('Втората стъпка е в обратната посока.', 'Другий крок — у протилежний бік.')
                            : tr('Двете стъпки са в една посока.', 'Обидва кроки — в один бік.');
    return 'A → B: ' + q.d1 + ' см, &nbsp;B → C: ' + q.d2 + ' см ' +
      (q.back ? tr('обратно', 'назад') + ' &nbsp;→&nbsp; ' + q.d2 + ' − ' + q.d1
              : tr('напред', 'вперед') + ' &nbsp;→&nbsp; ' + q.d1 + ' + ' + q.d2) +
      ' = ' + q.ans;
  }
}
KIND.line = { draw:drawLine, eq:eqLine, why:whyLine };
