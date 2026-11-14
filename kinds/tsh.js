// Question kind 'tsh': level 504 Т и Ш — Letters built of equal rectangles: the outline of one letter from the outline of another.

// Салабашев 2019, 2 клас, задача 12: the letters Т (two rectangles) and Ш (four) are built of equal rectangles. One rectangle's outline is 24 см, Т's is 44 см: Ш's? Where two
// rectangles are glued, a short side of each drops out of the outline, two short sides a join: Т has one join, 24 + 24 − 44 = 4 lost (2 + 2, the short side is 2 см); Ш has three
// joins (the bar and its three legs): 4 · 24 − 4 − 4 − 4 = 84 (the key). The rectangle is a long side a = 3 short ones + 2 gaps; the picture draws the legs a gap g apart.
import { CM, KIND, SLOT, rnd, svgText, tr } from '../js/core.js';
export function genTsh(){
  const b = 1 + rnd(3), g = 1 + rnd(3), a = 3*b + 2*g, p = 2*(a + b), lost = 2*b, T = 2*p - lost;
  return {kind:'tsh', b, g, a, p, T, lost, ans: 4*p - 3*lost};
}
// the rectangles of each letter, [x, y, w, h] in units, the Ш to the right of the Т
export function tshRects(q){
  const x0 = q.a + Math.max(2, q.b), r = [[0, 0, q.a, q.b], [(q.a - q.b)/2, q.b, q.b, q.a]];
  for(let i = 0; i < 3; i++) r.push([x0 + i*(q.b + q.g), 0, q.b, q.a]);
  r.push([x0, q.a, q.a, q.b]);
  return r;
}
function tshSvg(q){
  const rs = tshRects(q), W = q.a + Math.max(2, q.b) + q.a, H = q.a + q.b, u = Math.min(270 / W, 140 / H), f = v => v.toFixed(1);
  return '<div class="fig"><svg viewBox="-4 -4 ' + f(W*u + 8) + ' ' + f(H*u + 8) + '" style="max-width:' + Math.round(W*u*1.2 + 8) + 'px" role="img" aria-label="' + tr('буквите Т и Ш от еднакви правоъгълници', 'літери Т і Ш з однакових прямокутників') + '">' +
    rs.map(([x, y, w, h]) => '<rect x="' + f(x*u) + '" y="' + f(y*u) + '" width="' + f(w*u) + '" height="' + f(h*u) + '" fill="var(--fur-light)" stroke="var(--ink)" stroke-width="2"/>').join('') + '</svg></div>';
}
function drawTsh(q){
  return '<div class="ask">' + tr('Фигурите на чертежа са сглобени от еднакви правоъгълници. Обиколката на един правоъгълник е <span class="num">' + q.p + '</span> см. Фигурата с форма на буквата <b>Т</b> има обиколка <span class="num">' + q.T + '</span> см. Колко сантиметра е обиколката на фигурата с форма на буквата <b>Ш</b>?',
    'Фігури на рисунку складено з однакових прямокутників. Периметр одного прямокутника — <span class="num">' + q.p + '</span> см. Фігура у формі літери <b>Т</b> має периметр <span class="num">' + q.T + '</span> см. Скільки сантиметрів становить периметр фігури у формі літери <b>Ш</b>?') + '</div>' +
    tshSvg(q) + '<div class="line md">' + SLOT + CM + '</div>';
}
const four = q => [q.p, q.p, q.p, q.p].join(' + ');
const eqTsh = q => q.p + ' + ' + q.p + ' − ' + q.T + ' = ' + q.lost + ', ' + four(q) + ' − ' + q.lost + ' − ' + q.lost + ' − ' + q.lost + ' = ' + q.ans;
function whyTsh(q, full){
  if(!full) return tr('Там, където два правоъгълника са долепени, от обиколката изчезват по една къса страна на всеки. Колко долепвания има в Т и колко в Ш?', 'Там, де два прямокутники прикладені, з периметра зникає по одній короткій стороні кожного. Скільки прикладань у Т і скільки в Ш?');
  return tr('Т са два правоъгълника: ', 'Т — це два прямокутники: ') + q.p + ' + ' + q.p + ' = ' + 2*q.p + ', ' + tr('а обиколката е ', 'а периметр — ') + q.T + ' &nbsp;→&nbsp; ' + tr('долепването е взело ', 'прикладання забрало ') + 2*q.p + ' − ' + q.T + ' = <b>' + q.lost + '</b>' + ' &nbsp;→&nbsp; ' +
    tr('Ш са четири правоъгълника и три долепвания: ', 'Ш — це чотири прямокутники і три прикладання: ') + four(q) + ' = ' + 4*q.p + ', ' + 4*q.p + ' − ' + q.lost + ' − ' + q.lost + ' − ' + q.lost + ' = <b>' + q.ans + '</b>';
}
KIND.tsh = { draw:drawTsh, eq:eqTsh, why:whyTsh };
