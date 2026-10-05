// Question kind 'sqrect': level 153 Квадрат и правоъгълник — Equal perimeters, and a rectangle pinned down by its sides.

// Коледно 2022, задача 8: a square and a rectangle have equal perimeters; the rectangle's sides are one-digit
// numbers bigger than 3, and one side is the sum of two other sides. The sides go a, b, a, b, and a = a + b
// cannot be, so the long side is two short ones: b = 4, a = 8 (b = 5 would make 10). P = 24, the square's side 6.
// Every b is tried; a question is asked only when exactly one fits.
import { CM, KIND, SLOT, rnd, tr } from '../js/core.js';
function sqRectFits(lo, hi){ const out = []; for(let b = lo + 1; 2*b <= hi; b++) out.push(b); return out; }
export function genSqRect(){
  for(;;){
    const one = Math.random() < 0.6, hi = one ? 9 : 10 + rnd(15), lo = 1 + rnd(hi - 2), fits = sqRectFits(lo, hi);
    if(fits.length !== 1) continue;
    const b = fits[0], a = 2*b, P = 2*(a + b), asksP = P % 4 !== 0 || Math.random() < 0.3;
    return {kind:'sqrect', one, lo, hi, a, b, P, asksP, traps: asksP ? [a + b, 2*(b + b)] : [P, P / 2, b], ans: asksP ? P : P / 4};
  }
}
function drawSqRect(q){
  const sides = q.one ? tr('едноцифрени числа, по-големи от <span class="num">' + q.lo + '</span>', 'одноцифрові числа, більші за <span class="num">' + q.lo + '</span>')
    : tr('числа, по-големи от <span class="num">' + q.lo + '</span> и не по-големи от <span class="num">' + q.hi + '</span>', 'числа, більші за <span class="num">' + q.lo + '</span> і не більші за <span class="num">' + q.hi + '</span>');
  return '<div class="ask">' + tr('Квадрат и правоъгълник имат равни обиколки. Дължините на страните на правоъгълника са ' + sides + '. Дължината на едната му страна е равна на сбора от дължините на две от другите страни. ' +
    (q.asksP ? 'Колко е обиколката на квадрата?' : 'На колко е равна страната на квадрата?') + ' Всички измервания са в сантиметри.',
    'Квадрат і прямокутник мають рівні периметри. Довжини сторін прямокутника — ' + sides + '. Довжина однієї його сторони дорівнює сумі довжин двох інших сторін. ' +
    (q.asksP ? 'Чому дорівнює периметр квадрата?' : 'Чому дорівнює сторона квадрата?') + ' Усі вимірювання — в сантиметрах.') + '</div>' +
    '<div class="line xl">' + SLOT + CM + '</div>';
}
function eqSqRect(q){
  return q.a + ' = ' + q.b + ' + ' + q.b + ', P = ' + q.P + (q.asksP ? '' : ', ' + q.P + ' : 4 = ' + q.ans);
}
function whySqRect(q, full){
  if(!full) return tr('Страните на правоъгълника са a, b, a, b. Коя страна може да е сбор от две други?', 'Сторони прямокутника — a, b, a, b. Яка сторона може дорівнювати сумі двох інших?');
  return tr('само голямата = малката + малката', 'лише більша = менша + менша') + ' &nbsp;→&nbsp; ' + tr('малката е ', 'менша — ') + q.b + ' (' + (q.b + 1) + ' + ' + (q.b + 1) + ' = ' + (2*q.b + 2) + tr(' е твърде много', ' — забагато') + '), ' +
    tr('голямата ', 'більша ') + q.a + ' &nbsp;→&nbsp; P = ' + q.a + ' + ' + q.b + ' + ' + q.a + ' + ' + q.b + ' = ' + q.P + (q.asksP ? '' : ' &nbsp;→&nbsp; ' + q.P + ' : 4 = ' + q.ans);
}
KIND.sqrect = { draw:drawSqRect, eq:eqSqRect, why:whySqRect };
