// Question kind 'three': level 41 Три точки — Three points on a line — two answers.

// Задача 12: with three points on a line the longest distance is the other two added,
// so the third measurement is either the difference or the sum.
import { CM, KIND, NAMES, SLOT, lineSvg, rnd, tr } from '../js/core.js';
export function genThree(){
  const who = NAMES[rnd(NAMES.length)][0];
  const a = 1 + rnd(7);
  const b = a + 1 + rnd(7);
  return {kind:'three', who, a, b, slots:2, ans: b - a, alt:[a + b]};
}

function drawThree(q){
  const nm = NAMES.find(x => x[0] === q.who), he = /в$/.test(nm[3]);
  return '<div class="ask">' + tr('Върху права са отбелязани <b>3 точки</b>. ' + q.who +
    ' премерил разстоянията между всеки две от точките и записал две от тях: <span class="num">' +
    q.a + '</span> см и <span class="num">' + q.b +
    '</span> см. Колко сантиметра е възможно да е третото разстояние?',
    'На прямій позначено <b>3 точки</b>. ' + nm[2] + (he ? ' виміряв' : ' виміряла') +
    ' відстані між кожними двома точками і ' + (he ? 'записав' : 'записала') + ' дві з них: <span class="num">' +
    q.a + '</span> см і <span class="num">' + q.b +
    '</span> см. Скільки сантиметрів може становити третя відстань?') + '</div>' +
    '<div class="line md">' + SLOT +
    ' <span class="or">' + tr('или', 'або') + '</span> <span class="slot" id="slot1"></span>' + CM + '</div>';
}
function eqThree(q){
  return q.a + tr(' и ', ' і ') + q.b + ' → ' + (q.b - q.a) + tr(' или ', ' або ') + (q.a + q.b);
}
// Three points on a line make two short distances and a long one that is both of them together. The
// solution draws both ways the given two can sit: the longer one is the long distance, or the third is.
function threeSvg(q, full){
  const n = v => full ? v + ' см' : '';
  if(!full) return lineSvg([{at:0}, {at:3}, {at:8}], [{from:0, to:3, row:-1, label:''}, {from:3, to:8, row:-1, label:''}, {from:0, to:8, row:1, label:'', col:'var(--good)'}], 0, 8, tr('три точки върху права', 'три точки на прямій'));
  return lineSvg([{at:0, step:0}, {at:q.a, step:0}, {at:q.b, step:0}], [{from:0, to:q.a, row:-1, label:n(q.a), step:1}, {from:0, to:q.b, row:1, label:n(q.b), step:2},
      {from:q.a, to:q.b, row:-1, label:n(q.b - q.a), col:'var(--good)', step:4}], 0, q.b, tr('първата възможност', 'перша можливість')) +
    lineSvg([{at:0, step:6}, {at:q.a, step:6}, {at:q.a + q.b, step:6}], [{from:0, to:q.a, row:-1, label:n(q.a), step:7}, {from:q.a, to:q.a + q.b, row:-1, label:n(q.b), step:8},
      {from:0, to:q.a + q.b, row:1, label:n(q.a + q.b), col:'var(--good)', step:10}], 0, q.a + q.b, tr('втората възможност', 'друга можливість'));
}
function whyThree(q, full){
  if(!full) return tr('При три точки върху права най-голямото разстояние е сборът на другите две.',
    'Коли три точки лежать на прямій, найбільша відстань дорівнює сумі двох інших.') + threeSvg(q, false);
  return tr('ако ', 'якщо ') + q.b + tr(' е най-голямото', ' — найбільша') + ' &nbsp;→&nbsp; ' + q.b + ' − ' + q.a + ' = <b>' + (q.b - q.a) +
    '</b>; &nbsp;' + tr('ако третото е най-голямото', 'якщо третя — найбільша') + ' &nbsp;→&nbsp; ' + q.a + ' + ' + q.b + ' = <b>' + (q.a + q.b) + '</b>' + threeSvg(q, true);
}
KIND.three = { draw:drawThree, eq:eqThree, why:whyThree };
