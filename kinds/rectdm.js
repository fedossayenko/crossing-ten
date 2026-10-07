// Question kind 'rectdm': level 91 Обиколка в дм — A rectangle's perimeter, asked in another unit.

// Коледно състезание 2025, задача 3: a 16 см by 24 см rectangle, its perimeter in дециметри.
// 16 + 24 = 40, twice is 80 см, and 10 см make a дециметър: 8. The trap is stopping at 80.
// МБГ Зима 2021–2023: one side given, the other «с 2 дм по-дълга», and the perimeter asked in
// метра — or in мм and дециметра. Two unit changes, one inside the problem and one at the end.
import { CM, KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
const RECT_U = { мм:1, см:10, дм:100, м:1000 }, RECT_W = { см:['сантиметра','сантиметрів'], дм:['дециметра','дециметрів'], м:['метра','метрів'] };
export function genRectLonger(){
  for(;;){
    const mm = Math.random() < 0.3, base = mm ? 'мм' : 'см', dU = mm ? 'мм' : 'дм';
    const a = 5 + rnd(40), d = mm ? 5 + rnd(40) : 1 + rnd(4), b = a + d*RECT_U[dU]/RECT_U[base], P = 2*(a + b);
    const to = (mm ? ['дм', 'см'] : ['м', 'дм']).find(u => P*RECT_U[base] % RECT_U[u] === 0);
    if(!to || (to === (mm ? 'см' : 'дм') && Math.random() < 0.7)) continue;   // mostly the bigger unit, as the papers ask
    return {kind:'rectdm', shape:1, a, d, base, dU, b, P, to, ans: P*RECT_U[base]/RECT_U[to]};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 15: one side 3 см, the other 2 см longer, all in сантиметри. The other
// side is 3 + 2 = 5, and the four sides 3 + 5 + 3 + 5 = 16. The slips stop at one side of each (3 + 5 = 8),
// or add the two numbers given (3 + 2 = 5).
export function genRectSame(){
  const a = 2 + rnd(8), d = 1 + rnd(4), b = a + d;
  return {kind:'rectdm', shape:2, a, d, b, traps:[a + b, a + d], ans: 2*(a + b)};
}
export function genRectDm(){
  for(;;){
    const a = 3 + rnd(28), b = a + 1 + rnd(25), P = 2*(a + b);
    if(P % 10 || P > 150) continue;
    return {kind:'rectdm', a, b, P, ans: P / 10};
  }
}
// Level 251. МБГ Есен 2024, 3 клас, задача 11: a square's side is 15 мм — how many сантиметри round? 4 · 15 = 60 мм = 6 см.
// Есен 2023, 3 клас, задача 12: the side is 5 см и 5 мм, that is 55 мм; 4 · 55 = 220 мм = 22 см. A side ending in
// 5 мм makes the four sides whole сантиметри. The slips: the 5 мм dropped (4 · 5 = 20), or the perimeter left in мм.
export function genSqPerimMm(){
  const cmmm = Math.random() < 0.5, s = cmmm ? 10*(1 + rnd(9)) + 5 : 10*rnd(10) + 5;
  return {kind:'rectdm', shape: cmmm ? 'cmmm' : 'mm', s, traps: cmmm ? [4*Math.floor(s / 10), 4*s] : [4*s], ans: 4*s / 10};
}
const sqMmSide = (q, and) => q.shape === 'mm' ? q.s + '&nbsp;мм' : Math.floor(q.s / 10) + '&nbsp;см ' + and + ' ' + q.s % 10 + '&nbsp;мм';
function drawRectDm(q){
  if(q.shape === 'mm' || q.shape === 'cmmm'){
    return '<div class="ask">' + tr('Страната на квадрат е <span class="num">' + sqMmSide(q, 'и') + '</span>. Колко <b>сантиметра</b> е обиколката на квадрата?',
      'Сторона квадрата — <span class="num">' + sqMmSide(q, 'і') + '</span>. Скільки <b>сантиметрів</b> становить периметр квадрата?') + '</div>' +
      '<div class="line xl">' + SLOT + CM + '</div>';
  }
  if(q.shape === 2){
    return '<div class="ask">' + tr('Една от страните на правоъгълник е <span class="num">' + q.a + '&nbsp;см</span>, а другата е с <span class="num">' + q.d + '&nbsp;см</span> по-дълга. Колко сантиметра е обиколката на правоъгълника?',
      'Одна зі сторін прямокутника — <span class="num">' + q.a + '&nbsp;см</span>, а інша на <span class="num">' + q.d + '&nbsp;см</span> довша. Скільки сантиметрів становить периметр прямокутника?') + '</div>' +
      '<div class="line xl">' + SLOT + CM + '</div>';
  }
  if(q.shape === 1){
    const w = RECT_W[q.to];
    return '<div class="ask">' + tr('Една от страните на правоъгълник е <span class="num">' + q.a + '&nbsp;' + q.base + '</span>, а другата е с <span class="num">' + q.d + '&nbsp;' + q.dU + '</span> по-дълга. Колко <b>' + w[0] + '</b> е обиколката на правоъгълника?',
      'Одна зі сторін прямокутника — <span class="num">' + q.a + '&nbsp;' + q.base + '</span>, а інша на <span class="num">' + q.d + '&nbsp;' + q.dU + '</span> довша. Скільки <b>' + w[1] + '</b> становить периметр прямокутника?') + '</div>' +
      '<div class="line xl">' + SLOT + ' <span class="unit">' + q.to + '</span></div>';
  }
  return '<div class="ask">' + tr('Колко <b>дециметра</b> е обиколката на правоъгълник със страни <span class="num">' + q.a + '&nbsp;см</span> и <span class="num">' + q.b + '&nbsp;см</span>?',
    'Скільки <b>дециметрів</b> становить периметр прямокутника зі сторонами <span class="num">' + q.a + '&nbsp;см</span> і <span class="num">' + q.b + '&nbsp;см</span>?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">дм</span></div>';
}
const rectSides = q => q.a + ' + ' + q.b + ' + ' + q.a + ' + ' + q.b + ' = ' + q.ans;
// the rectangle, its four sides labelled, the longer ones across
function rectSameSvg(q){
  const u = Math.min(18, 160 / q.b), w = q.b*u, h = q.a*u, X = 30, Y = 22;
  return '<svg viewBox="0 0 ' + (w + 2*X) + ' ' + (h + 2*Y) + '" style="display:block; width:' + Math.round((w + 2*X)*1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('правоъгълникът и страните му', 'прямокутник і його сторони') + '">' +
    '<rect x="' + X + '" y="' + Y + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.5"/>' +
    svgText((X + w/2).toFixed(1), Y - 6, q.b, 13, 'var(--warm)', popAt(1)) + svgText(X - 12, (Y + h/2 + 5).toFixed(1), q.a, 13, 'var(--ink)', popAt(2)) +
    svgText((X + w/2).toFixed(1), (Y + h + 17).toFixed(1), q.b, 13, 'var(--warm)', popAt(3)) + svgText((X + w + 12).toFixed(1), (Y + h/2 + 5).toFixed(1), q.a, 13, 'var(--ink)', popAt(4)) + '</svg>';
}
function eqRectDm(q){
  if(q.shape === 'mm') return '4 · ' + q.s + ' = ' + 4*q.s + ' мм = ' + q.ans + ' см';
  if(q.shape === 'cmmm') return Math.floor(q.s / 10) + ' см ' + q.s % 10 + ' мм = ' + q.s + ' мм, 4 · ' + q.s + ' = ' + 4*q.s + ' мм = ' + q.ans + ' см';
  if(q.shape === 2) return q.a + ' + ' + q.d + ' = ' + q.b + ', ' + rectSides(q);
  if(q.shape === 1) return q.a + ' + ' + q.d + ' ' + q.dU + ' = ' + q.b + ' ' + q.base + ', 2 · (' + q.a + ' + ' + q.b + ') = ' + q.P + ' ' + q.base + ' = ' + q.ans + ' ' + q.to;
  return '2 · (' + q.a + ' + ' + q.b + ') = ' + q.P + ' см = ' + q.ans + ' дм';
}
function whyRectDm(q, full){
  if(q.shape === 'mm' || q.shape === 'cmmm'){
    if(!full) return tr('Обиколката на квадрата е четири пъти страната му. Първо всичко в милиметри — после колко сантиметра прави.',
      'Периметр квадрата — це чотири його сторони. Спершу все в міліметрах — потім скільки це сантиметрів.');
    return (q.shape === 'cmmm' ? Math.floor(q.s / 10) + ' см = ' + 10*Math.floor(q.s / 10) + ' мм, ' + 10*Math.floor(q.s / 10) + ' + ' + q.s % 10 + ' = <b>' + q.s + '</b> мм &nbsp;→&nbsp; ' : '') +
      '4 · ' + q.s + ' = <b>' + 4*q.s + '</b> мм &nbsp;→&nbsp; 10 мм = 1 см' + tr(', значи ', ', отже ') + 4*q.s + ' мм = ' + q.ans + ' см';
  }
  if(q.shape === 2){
    if(!full) return tr('Първо намери другата страна. Обиколката е сборът от четирите страни.', 'Спершу знайди іншу сторону. Периметр — це сума чотирьох сторін.');
    return tr('другата страна: ', 'інша сторона: ') + q.a + ' + ' + q.d + ' = <b>' + q.b + '</b> см' + rectSameSvg(q) + tr('обиколката: ', 'периметр: ') + rectSides(q) + ' см';
  }
  if(q.shape === 1){
    if(!full) return tr('Първо двете страни в едни и същи мерки — после обиколката, и накрая в каквото е попитано.', 'Спершу обидві сторони в однакових одиницях — потім периметр, і нарешті в тому, про що питають.');
    return (q.dU === q.base ? '' : q.d + ' ' + q.dU + ' = ' + q.d*RECT_U[q.dU]/RECT_U[q.base] + ' ' + q.base + ', ') + tr('другата страна ', 'інша сторона ') + q.a + ' + ' + (q.b - q.a) + ' = <b>' + q.b + ' ' + q.base + '</b> &nbsp;→&nbsp; ' +
      q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + tr(', два пъти', ', двічі') + ' → <b>' + q.P + ' ' + q.base + '</b> &nbsp;→&nbsp; 1 ' + q.to + ' = ' + RECT_U[q.to]/RECT_U[q.base] + ' ' + q.base + tr(', значи ', ', отже ') + q.ans + ' ' + q.to;
  }
  if(!full) return tr('Първо обиколката в сантиметри — после колко дециметра прави.', 'Спершу периметр у сантиметрах — потім скільки це дециметрів.');
  return q.a + ' + ' + q.b + ' = ' + (q.a + q.b) + tr(', два пъти', ', двічі') + ' → <b>' + q.P + ' см</b> &nbsp;→&nbsp; 10 см = 1 дм' +
    tr(', значи ', ', отже ') + q.ans + ' дм';
}
KIND.rectdm = { draw:drawRectDm, eq:eqRectDm, why:whyRectDm };
