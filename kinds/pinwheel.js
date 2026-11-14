// Question kind 'pinwheel': level 85 Четири правоъгълника — A figure of four equal rectangles, from its perimeter.

// МБГ Зима 2024, задача 12: four equal rectangles, each twice as long as it is wide, make
// the figure. Going round it: 4 long sides and 8 short ones, and two short make a long —
// so the perimeter is 8 long sides. 8 дм = 80 см → 10 см.
// The outline in short sides, clockwise from the top of the upright arm.
import { CM, KIND, SLOT, rnd, tr } from '../js/core.js';
export const PINWHEEL = [[2,0],[3,0],[3,2],[4,2],[4,3],[2,3],[2,4],[1,4],[1,2],[0,2],[0,1],[2,1]];
export function genPinwheel(){
  const L = 2*(2 + rnd(5)), P = 8*L;                 // the long side, 4 to 12 см
  const dm = P % 10 === 0 && Math.random() < 0.7, long = Math.random() < 0.65;
  return {kind:'pinwheel', L, P, dm, long, ans: long ? L : L/2};
}
function pinwheelSvg(){
  const u = 38, pts = PINWHEEL.map(([x, y]) => (10 + x*u) + ',' + (10 + y*u)).join(' ');
  return '<div class="fig"><svg viewBox="0 0 ' + (20 + 4*u) + ' ' + (20 + 4*u) + '" role="img" aria-label="' +
    tr('фигура от четири правоъгълника', 'фігура з чотирьох прямокутників') + '" style="max-width:190px">' +
    '<polygon points="' + pts + '" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/></svg></div>';
}
function drawPinwheel(q){
  if(q.shape === 'beside') return drawBeside(q);
  const P = q.dm ? q.P/10 + ' дм' : q.P + ' см';
  return '<div class="ask">' + tr('Фигура с обиколка <span class="num">' + P + '</span> се състои от <b>4 еднакви правоъгълника</b>. Колко сантиметра е дължината на ' +
    (q.long ? '<b>по-голямата</b>' : '<b>по-малката</b>') + ' страна на един от тези правоъгълници?',
    'Фігура з периметром <span class="num">' + P + '</span> складається з <b>4 однакових прямокутників</b>. Скільки сантиметрів становить довжина ' +
    (q.long ? '<b>більшої</b>' : '<b>меншої</b>') + ' сторони одного з цих прямокутників?') + '</div>' +
    pinwheelSvg() + '<div class="line md">' + SLOT + CM + '</div>';
}
function eqPinwheel(q){
  if(q.shape === 'beside') return eqBeside(q);
  return tr('8 дълги = ', '8 довгих = ') + q.P + tr(', наполовина: ', ', навпіл: ') + [q.P/2, q.P/4, q.L].concat(q.long ? [] : [q.ans]).join(' → ');
}
function whyPinwheel(q, full){
  if(q.shape === 'beside') return whyBeside(q, full);
  if(!full) return tr('Обиколи фигурата и преброй дългите и късите страни. Колко къси правят една дълга?',
                      'Обійди фігуру й порахуй довгі й короткі сторони. Скільки коротких дорівнюють одній довгій?');
  return (q.dm ? q.P/10 + ' дм = ' + q.P + tr(' см; ', ' см; ') : '') +
    tr('наоколо има 4 дълги и 8 къси страни, а 2 къси са колкото 1 дълга → 8 дълги', 'навколо 4 довгі й 8 коротких сторін, а 2 короткі — як 1 довга → 8 довгих') +
    tr(' = ', ' = ') + q.P + ' &nbsp;→&nbsp; ' + tr('наполовина: 4 дълги — ', 'навпіл: 4 довгі — ') + q.P + ' = ' + q.P/2 + ' + ' + q.P/2 + tr(', 2 дълги — ', ', 2 довгі — ') + q.P/2 + ' = ' + q.P/4 + ' + ' + q.P/4 +
    tr(', 1 дълга — ', ', 1 довга — ') + q.P/4 + ' = ' + q.L + ' + ' + q.L + ' &nbsp;→&nbsp; <b>' + q.L + '</b> см' + (q.long ? '' : ' &nbsp;→&nbsp; ' + q.L + ' = ' + q.ans + ' + ' + q.ans + ' &nbsp;→&nbsp; ' + q.ans);
}
// Салабашев 2025, 2 клас, задача 7 (level 501): a big rectangle made of two equal small rectangles, one over the other, and a square beside them; the short side of a
// small rectangle is 3 см, the long one 5 см longer, 8 см. The square is as high as the two stacked (3 + 3 = 6), so the big rectangle is 8 + 6 = 14 wide and 6 high:
// 14 + 6 + 14 + 6 = 40.
export function genPinwheelRect(){
  const s = 2 + rnd(5), d = 2 + rnd(6), long = s + d, side = 2*s, W = long + side, H = side;
  return {kind:'pinwheel', shape:'beside', s, d, long, side, W, H, ans: 2*(W + H)};
}
function besideSvg(q){
  const u = 180 / q.W, f = v => v.toFixed(1), r = (x, y, w, h) => '<rect x="' + f(x*u) + '" y="' + f(y*u) + '" width="' + f(w*u) + '" height="' + f(h*u) + '" fill="none" stroke="var(--ink)" stroke-width="2.2"/>';
  return '<div class="fig"><svg viewBox="-4 -4 ' + f(q.W*u + 8) + ' ' + f(q.H*u + 8) + '" style="max-width:' + Math.round(q.W*u + 8) + 'px" role="img" aria-label="' +
    tr('голям правоъгълник от два еднакви правоъгълника и квадрат', 'великий прямокутник із двох однакових прямокутників і квадрата') + '">' +
    r(0, 0, q.W, q.H) + r(0, 0, q.long, q.s) + r(0, q.s, q.long, q.s) + r(q.long, 0, q.side, q.side) + '</svg></div>';
}
function drawBeside(q){
  return '<div class="ask">' + tr('Големият правоъгълник на чертежа е съставен от два еднакви малки правоъгълника и квадрат. Късата страна на всеки от двата еднакви малки правоъгълника е <span class="num">' + q.s + '</span> см, а дългата страна е с <span class="num">' + q.d + '</span> см по-дълга от нея. Колко сантиметра е <b>обиколката на големия правоъгълник</b>?',
    'Великий прямокутник на рисунку складено з двох однакових малих прямокутників і квадрата. Коротка сторона кожного з двох однакових малих прямокутників — <span class="num">' + q.s + '</span> см, а довга сторона на <span class="num">' + q.d + '</span> см довша за неї. Скільки сантиметрів становить <b>периметр великого прямокутника</b>?') + '</div>' +
    besideSvg(q) + '<div class="line md">' + SLOT + CM + '</div>';
}
const eqBeside = q => q.s + ' + ' + q.d + ' = ' + q.long + ', ' + q.s + ' + ' + q.s + ' = ' + q.side + ', ' + [q.W, q.H, q.W, q.H].join(' + ') + ' = ' + q.ans;
function whyBeside(q, full){
  if(!full) return tr('Квадратът е висок колкото двата малки правоъгълника, един върху друг. Каква е тогава ширината на големия?', 'Квадрат такий високий, як два малі прямокутники один на одному. Яка тоді ширина великого?');
  return tr('дългата страна: ', 'довга сторона: ') + q.s + ' + ' + q.d + ' = <b>' + q.long + '</b> &nbsp;→&nbsp; ' + tr('страната на квадрата е два къси: ', 'сторона квадрата — дві коротких: ') + q.s + ' + ' + q.s + ' = <b>' + q.side + '</b> &nbsp;→&nbsp; ' +
    tr('ширина ', 'ширина ') + q.long + ' + ' + q.side + ' = <b>' + q.W + '</b>, ' + tr('височина ', 'висота ') + '<b>' + q.H + '</b> &nbsp;→&nbsp; ' + [q.W, q.H, q.W, q.H].join(' + ') + ' = ' + q.ans;
}
KIND.pinwheel = { draw:drawPinwheel, eq:eqPinwheel, why:whyPinwheel };
