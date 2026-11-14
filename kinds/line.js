// Question kind 'line': level 20 A, B, C — Along a line, right then left — how far apart?.

// Задача 14: two steps along a line, usually in opposite directions, then the distance.
import { CM, KIND, SLOT, lineSvg, rnd, tr } from '../js/core.js';
// Салабашев 2020, задача 13 (shape 'toward'): a path 30 дм long, a ladybird and a snail at its ends walk towards each
// other, 17 дм and 16 дм — how far apart are they? 17 + 16 = 33 is more than the path, so they have passed each other
// and are 33 − 30 = 3 дм apart; when the two walks are short of the path, what is left is 30 − (a + b).
export function genToward(){
  for(;;){
    const L = 20 + rnd(31), a = 8 + rnd(L - 12), b = 8 + rnd(L - 12);
    if(a + b === L) continue;
    return {kind:'line', shape:'toward', L, a, b, past: a + b > L, traps:[a + b], ans: Math.abs(a + b - L)};
  }
}
export function genLine(){
  const d1 = 2 + rnd(8);
  const back = Math.random() < 0.75;
  const d2 = back ? d1 + 1 + rnd(9) : 1 + rnd(9);
  const right = Math.random() < 0.5;
  return {kind:'line', d1, d2, right, back, ans: back ? d2 - d1 : d1 + d2};
}

function drawLine(q){
  if(q.shape === 'toward') return '<div class="ask">' + tr('Калинката и охлювчето са в двата края на пътека, дълга <span class="num">' + q.L + '</span> дм. Те тръгват един към друг: калинката изминава <span class="num">' + q.a + '</span> дм, а охлювчето — <span class="num">' + q.b + '</span> дм. <b>Колко дециметра е разстоянието между тях?</b>',
    'Сонечко й равлик — на двох кінцях доріжки завдовжки <span class="num">' + q.L + '</span> дм. Вони йдуть назустріч одне одному: сонечко проходить <span class="num">' + q.a + '</span> дм, а равлик — <span class="num">' + q.b + '</span> дм. <b>Яка відстань між ними в дециметрах?</b>') + '</div>' +
    '<div class="line lg">' + SLOT + ' <span class="unit">дм</span></div>';
  const one = q.right ? tr('вдясно', 'праворуч') : tr('вляво', 'ліворуч');
  const two = q.back ? (q.right ? tr('вляво', 'ліворуч') : tr('вдясно', 'праворуч')) : one;
  return '<div class="ask">' + tr('На права линия е отбелязана точка <b>A</b>. На <span class="num">' + q.d1 +
    '</span> см ' + one + ' от нея е отбелязана точка <b>B</b>. След това, на същата права линия, на <span class="num">' +
    q.d2 + '</span> см ' + two + ' от точка <b>B</b> е отбелязана точка <b>C</b>. Колко сантиметра е разстоянието от <b>A</b> до <b>C</b>?',
    'На прямій позначили точку <b>A</b>. На відстані <span class="num">' + q.d1 +
    '</span> см ' + one + ' від неї позначили точку <b>B</b>. Потім на тій самій прямій на відстані <span class="num">' +
    q.d2 + '</span> см ' + two + ' від точки <b>B</b> позначили точку <b>C</b>. Скільки сантиметрів від <b>A</b> до <b>C</b>?') + '</div>' +
    '<div class="line lg">' + SLOT + CM + '</div>';
}
function eqLine(q){
  if(q.shape === 'toward') return q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + ', ' + (q.past ? (q.a + q.b) + ' − ' + q.L : q.L + ' − ' + (q.a + q.b)) + ' = ' + q.ans;
  return tr('A → B ' + q.d1 + ', B → C ' + q.d2 + (q.back ? ' назад' : ' напред'),
    'A → B ' + q.d1 + ', B → C ' + (q.back ? 'назад на ' : 'вперед на ') + q.d2) + ' → ' + q.ans;
}
// The three points to scale: the hint shows the two steps without their lengths and A to C as «?»,
// the solution puts the points down one at a time, then measures A to C.
function lineAbc(q, full){
  const s = q.right ? 1 : -1, B = s*q.d1, C = B + (q.back ? -s : s)*q.d2, lo = Math.min(0, B, C), hi = Math.max(0, B, C);
  return lineSvg([{at:0, name:'A', step:full ? 0 : undefined}, {at:B, name:'B', step:full ? 2 : undefined}, {at:C, name:'C', col:'var(--warm)', step:full ? 5 : undefined}],
    [{from:0, to:B, row:-2, label:full ? q.d1 + ' см' : '', step:full ? 3 : undefined}, {from:B, to:C, row:-3, label:full ? q.d2 + ' см' : '', col:'var(--warm)', step:full ? 6 : undefined},
     {from:0, to:C, row:1, label:full ? q.ans + ' см' : '?', col:'var(--good)', step:full ? 9 : undefined}], lo, hi, tr('точките A, B и C', 'точки A, B і C'));
}
function whyLine(q, full){
  if(q.shape === 'toward'){
    if(!full) return tr('Колко дециметра са изминали двамата заедно? Повече ли са от пътеката, или по-малко?', 'Скільки дециметрів вони пройшли разом? Більше, ніж доріжка, чи менше?');
    return q.a + ' + ' + q.b + ' = <b>' + (q.a + q.b) + '</b> ' + (q.past ? tr('са повече от ' + q.L + ' — подминали са се &nbsp;→&nbsp; ', 'це більше за ' + q.L + ' — вони розминулися &nbsp;→&nbsp; ') + (q.a + q.b) + ' − ' + q.L
      : tr('са по-малко от ' + q.L + ' — още не са се срещнали &nbsp;→&nbsp; ', 'це менше за ' + q.L + ' — вони ще не зустрілися &nbsp;→&nbsp; ') + q.L + ' − ' + (q.a + q.b)) + ' = ' + q.ans;
  }
  if(!full) return (q.back ? tr('Втората стъпка е в обратната посока.', 'Другий крок — у протилежний бік.')
                           : tr('Двете стъпки са в една посока.', 'Обидва кроки — в один бік.')) + lineAbc(q, false);
  return 'A → B: ' + q.d1 + ' см, &nbsp;B → C: ' + q.d2 + ' см ' +
    (q.back ? tr('обратно', 'назад') + ' &nbsp;→&nbsp; ' + q.d2 + ' − ' + q.d1
            : tr('напред', 'вперед') + ' &nbsp;→&nbsp; ' + q.d1 + ' + ' + q.d2) +
    ' = ' + q.ans + lineAbc(q, true);
}
KIND.line = { draw:drawLine, eq:eqLine, why:whyLine };
