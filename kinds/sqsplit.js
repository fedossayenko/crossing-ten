// Question kind 'sqsplit': levels 253 Квадрат и ивица and 254 Квадрат на две части — a square and a strip beside it.

// Level 253. МБГ Есен 2024, 3 клас, задача 13: from a square of perimeter 28 см and a rectangle of perimeter 18 см I built
// a rectangle of perimeter x см (the picture: a narrow strip beside the square). The square's side is 28 : 4 = 7; the strip
// shares it, so its other side is 18 : 2 − 7 = 2, and the new rectangle is 9 by 7: x = 2 · (9 + 7) = 32. The slips: the
// two perimeters added (46), or the shared side taken off only once (39) — it is inside, on neither.
// Level 254. МБГ Есен 2023, 3 клас, задача 15: a square cut into two rectangles with perimeters 10 см and 14 см (the same
// picture). Together the two go once round the square and twice along the cut, which is as long as a side: 24 is 6 sides,
// so a side is 4. The slip: 24 : 4 = 6, the cut forgotten.
import { CM, KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
export function genSqGlue(){
  const a = 3 + rnd(10), b = 1 + rnd(a - 1);                  // the square's side; the strip's width, narrower
  return {kind:'sqsplit', shape:'glue', a, b, P1: 4*a, P2: 2*(a + b), traps: [6*a + 2*b, 5*a + 2*b], ans: 4*a + 2*b};
}
export function genSqSplit(){
  const s = 3 + rnd(10), x = 1 + rnd(Math.floor((s - 1) / 2)); // the side; the strip's width, less than half of it
  return {kind:'sqsplit', shape:'split', s, x, P1: 2*(s + x), P2: 2*(2*s - x), traps: s % 2 ? [] : [3*s / 2], ans: s};
}
// the figure as the papers draw it: a strip on the left, the wider part on the right, no lengths
function stripSvg(left, right, h, label){
  const u = 100 / h, L = left*u, W = (left + right)*u;
  return '<div class="fig"><svg viewBox="-4 -4 ' + (W + 8).toFixed(1) + ' 108" role="img" aria-label="' + label + '">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none"><rect x="0" y="0" width="' + W.toFixed(1) + '" height="100"/>' +
    '<line x1="' + L.toFixed(1) + '" y1="0" x2="' + L.toFixed(1) + '" y2="100"/></g></svg></div>';
}
function drawSqSplit(q){
  if(q.shape === 'split'){
    return '<div class="ask">' + tr('Квадрат е разделен на два правоъгълника с обиколки <span class="num">' + q.P1 + '</span> см и <span class="num">' + q.P2 + '</span> см. Колко <b>см</b> е страната на квадрата?',
      'Квадрат поділено на два прямокутники з периметрами <span class="num">' + q.P1 + '</span> см і <span class="num">' + q.P2 + '</span> см. Скільки <b>см</b> становить сторона квадрата?') + '</div>' +
      stripSvg(q.x, q.s - q.x, q.s, tr('квадрат, разделен на два правоъгълника', 'квадрат, поділений на два прямокутники')) + '<div class="line md">' + SLOT + CM + '</div>';
  }
  return '<div class="ask">' + tr('От квадрат с обиколка <span class="num">' + q.P1 + '</span> см и правоъгълник с обиколка <span class="num">' + q.P2 + '</span> см построих правоъгълник с обиколка <b>x</b> см. Пресметнете <b>x</b>.',
    'З квадрата з периметром <span class="num">' + q.P1 + '</span> см і прямокутника з периметром <span class="num">' + q.P2 + '</span> см я побудував прямокутник з периметром <b>x</b> см. Обчисліть <b>x</b>.') + '</div>' +
    stripSvg(q.b, q.a, q.a, tr('квадрат и правоъгълник един до друг', 'квадрат і прямокутник поруч')) + '<div class="line md">x = ' + SLOT + CM + '</div>';
}
function eqSqSplit(q){
  if(q.shape === 'split') return q.P1 + ' + ' + q.P2 + ' = ' + 6*q.s + ', ' + 6*q.s + ' : 6 = ' + q.s + ' см';
  return q.P1 + ' : 4 = ' + q.a + ', ' + q.P2 + ' : 2 − ' + q.a + ' = ' + q.b + ', 2 · (' + (q.a + q.b) + ' + ' + q.a + ') = ' + q.ans + ' см';
}
// the new rectangle, its sides named: the shared side dashed inside it, on neither outline
function glueSvg(q){
  const u = 90 / q.a, B = q.b*u, W = (q.a + q.b)*u, H = 90;
  return '<svg viewBox="-26 -22 ' + (W + 52).toFixed(1) + ' ' + (H + 48) + '" style="display:block; width:' + Math.round((W + 52)*1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('новият правоъгълник и страните му', 'новий прямокутник і його сторони') + '">' +
    '<rect x="0" y="0" width="' + W.toFixed(1) + '" height="' + H + '" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.5"/>' +
    '<line' + popAt(1) + ' x1="' + B.toFixed(1) + '" y1="0" x2="' + B.toFixed(1) + '" y2="' + H + '" stroke="var(--warm)" stroke-width="2" stroke-dasharray="4 4"/>' +
    svgText((B / 2).toFixed(1), -7, q.b, 13, 'var(--ink)', popAt(2)) + svgText(((B + W) / 2).toFixed(1), -7, q.a, 13, 'var(--ink)', popAt(2)) +
    svgText(-13, H / 2 + 5, q.a, 13, 'var(--ink)', popAt(3)) + svgText((W / 2).toFixed(1), H + 19, q.a + q.b, 13, 'var(--warm)', popAt(4)) + '</svg>';
}
// the two parts pulled apart: each one's outline holds the cut, so the cut is counted twice
function splitSvg(q){
  const u = 90 / q.s, X = q.x*u, R = (q.s - q.x)*u, gap = 16, H = 90, part = (x, w, cutX) =>
    '<rect x="' + x.toFixed(1) + '" y="0" width="' + w.toFixed(1) + '" height="' + H + '" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.5"/>' +
    '<line x1="' + cutX.toFixed(1) + '" y1="0" x2="' + cutX.toFixed(1) + '" y2="' + H + '" stroke="var(--warm)" stroke-width="3.5"/>';
  return '<svg viewBox="-14 -6 ' + (X + R + gap + 28).toFixed(1) + ' ' + (H + 30) + '" style="display:block; width:' + Math.round((X + R + gap + 28)*1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('двете части една до друга', 'дві частини поруч') + '">' +
    '<g' + popAt(1) + '>' + part(0, X, X) + svgText((X / 2).toFixed(1), H + 18, q.P1, 13, 'var(--ink)') + '</g>' +
    '<g' + popAt(2) + '>' + part(X + gap, R, X + gap) + svgText((X + gap + R / 2).toFixed(1), H + 18, q.P2, 13, 'var(--ink)') + '</g></svg>';
}
function whySqSplit(q, full){
  if(q.shape === 'split'){
    if(!full) return tr('Събери двете обиколки. Колко страни на квадрата има в този сбор? Не забравяй разреза.', 'Додай обидва периметри. Скільки сторін квадрата в цій сумі? Не забудь про розріз.');
    return q.P1 + ' + ' + q.P2 + ' = <b>' + 6*q.s + '</b> см — ' + tr('това е обиколката на квадрата и още два пъти разрезът, който е колкото страната му',
      'це периметр квадрата і ще двічі розріз, що дорівнює його стороні') + splitSvg(q) +
      tr('4 страни и 2 разреза: 6 страни', '4 сторони і 2 розрізи: 6 сторін') + ' &nbsp;→&nbsp; ' + 6*q.s + ' : 6 = ' + q.s + ' см';
  }
  if(!full) return tr('Първо страната на квадрата. Коя страна е обща за квадрата и правоъгълника?', 'Спершу сторона квадрата. Яка сторона спільна для квадрата й прямокутника?');
  return tr('страната на квадрата: ', 'сторона квадрата: ') + q.P1 + ' : 4 = <b>' + q.a + '</b> см; ' + tr('правоъгълникът има страна ', 'прямокутник має сторону ') + q.a + tr(' см, а другата му страна е ', ' см, а інша його сторона — ') +
    q.P2 + ' : 2 − ' + q.a + ' = <b>' + q.b + '</b> см' + glueSvg(q) +
    tr('новият правоъгълник е ', 'новий прямокутник — ') + (q.a + q.b) + tr(' на ', ' на ') + q.a + ' см &nbsp;→&nbsp; x = 2 · (' + (q.a + q.b) + ' + ' + q.a + ') = ' + q.ans + ' см';
}
KIND.sqsplit = { draw:drawSqSplit, eq:eqSqSplit, why:whySqSplit };
