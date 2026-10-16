// Question kind 'isoperim': level 97 Бедро и основа — An isosceles triangle built from a square's side.

// Коледно състезание 2025, задача 9: a square with perimeter 36 см; the triangle's leg is 12 см
// longer than the square's side, its base 14 см shorter than the leg. Side 9, leg 21, base 7:
// perimeter 21 + 21 + 7 = 49. Three steps, and the leg counts twice.
// Коледно 2024, задача 9: two triangles, legs 15 см each; one base 2 см shorter than the other; the
// perimeters add to 9 дм. Four legs are 60, so the two bases are 90 − 60 = 30: 14 and 16.
// Коледно 2023, задача 4: an ant walks ABCA twice (equilateral, side 4 м), a tortoise walks MEKME round an
// isosceles MEK (base ME 3 м, legs 5 м) — four sides, not five. 24 against 16: 8 м more.
// Level 282 Обиколка на триъгълник, the plain sums under all that: Аз и числата 2022, задача 7 (shape 'sum'): the
// scalene triangle of задача 6, sides 4, 6 and 5 см — 4 + 6 + 5 = 15. Аз и числата 2025, задача 4 (shape 'eq'): an
// equilateral triangle with side 2 см — three equal sides, 2 + 2 + 2 = 6. Аз и числата 2026, задача 8 (shape 'back'):
// the perimeter 21 см, two sides 5 и 9 — the third is 21 − 5 − 9 = 7; 2023, задача 9, the same about a triangular tree,
// 68 м with sides 16 и 26: 26. The slips: one side taken away, not both; a side for the perimeter; four sides for three.
import { CM, KIND, SLOT, rnd, shuffle, tr } from '../js/core.js';
import { triSideSvg } from './tritype.js';
// the triangle's sides as [base, left, right]: the longest across, so it stands
const triPerimSides = s => { const x = s.slice().sort((p, q) => q - p); return [x[0], x[1], x[2]]; };
export function genTriPerim(){
  for(;;){
    const r = Math.random(), shape = r < 0.35 ? 'sum' : r < 0.6 ? 'eq' : 'back', u = Math.random() < 0.75 ? 'см' : Math.random() < 0.5 ? 'дм' : 'м';
    if(shape === 'eq'){
      const a = 2 + rnd(29);
      return {kind:'isoperim', shape, u, a, traps:[2*a, 4*a, a].filter(v => v !== 3*a), ans: 3*a};
    }
    const a = 2 + rnd(35), b = 2 + rnd(35), c = 2 + rnd(35), P = a + b + c, x = Math.max(a, b, c);
    const h = P / 2, area = Math.sqrt(Math.max(0, h*(h - a)*(h - b)*(h - c)));
    if(P > 100 || 2*x >= P - 1 || 2*area / x < 0.25*x) continue;   // a real triangle, not one so flat it draws as a line
    if(shape === 'sum') return {kind:'isoperim', shape, u, s:[a, b, c], traps:[a + b, a + b + c + Math.min(a, b, c)].filter(v => v !== P), ans: P};
    const tree = Math.random() < 0.25;
    return {kind:'isoperim', shape, u: tree ? 'м' : u, tree, P, a, b, traps:[P - a, P - b, a + b].filter(v => v !== c), ans: c};
  }
}
const TRI_UW = { см:['сантиметра', 'сантиметрів'], дм:['дециметра', 'дециметрів'], м:['метра', 'метрів'] };
const triLen = (n, u) => '<span class="num">' + n + '&nbsp;' + u + '</span>';
function drawTriPerim(q){
  const w = TRI_UW[q.u], line = '<div class="line md">' + SLOT + ' <span class="unit">' + q.u + '</span></div>';
  if(q.shape === 'eq') return '<div class="ask">' + tr('Страната на равностранен триъгълник е ' + triLen(q.a, q.u) + '. Колко ' + w[0] + ' е обиколката на триъгълника?',
    'Сторона рівностороннього трикутника — ' + triLen(q.a, q.u) + '. Скільки ' + w[1] + ' становить периметр трикутника?') + '</div>' + line;
  if(q.shape === 'sum') return '<div class="ask">' + tr('Страните на триъгълник са ' + triLen(q.s[0], q.u) + ', ' + triLen(q.s[1], q.u) + ' и ' + triLen(q.s[2], q.u) + '. Колко ' + w[0] + ' е обиколката на триъгълника?',
    'Сторони трикутника — ' + triLen(q.s[0], q.u) + ', ' + triLen(q.s[1], q.u) + ' і ' + triLen(q.s[2], q.u) + '. Скільки ' + w[1] + ' становить периметр трикутника?') + '</div>' +
    '<div class="fig small">' + triSideSvg(triPerimSides(q.s), triPerimSides(q.s).map(v => v + ' ' + q.u)) + '</div>' + line;
  if(q.tree) return '<div class="ask">' + tr('Във вълшебния Триъгълен град растяло триъгълно дърво, което имало обиколка ' + triLen(q.P, 'м') + '. Ако едната му страна е ' + triLen(q.a, 'м') +
    ', а другата — ' + triLen(q.b, 'м') + ', колко метра е третата страна?',
    'У чарівному Трикутному місті росло трикутне дерево з периметром ' + triLen(q.P, 'м') + '. Якщо одна його сторона — ' + triLen(q.a, 'м') +
    ', а друга — ' + triLen(q.b, 'м') + ', то скільки метрів третя сторона?') + '</div>' + line;
  return '<div class="ask">' + tr('Триъгълник има обиколка ' + triLen(q.P, q.u) + '. Едната му страна е ' + triLen(q.a, q.u) + ', а втората — ' + triLen(q.b, q.u) + '. Колко ' + w[0] + ' е дължината на третата страна?',
    'Периметр трикутника — ' + triLen(q.P, q.u) + '. Одна його сторона — ' + triLen(q.a, q.u) + ', а друга — ' + triLen(q.b, q.u) + '. Скільки ' + w[1] + ' довжина третьої сторони?') + '</div>' + line;
}
function eqTriPerim(q){
  if(q.shape === 'eq') return q.a + ' + ' + q.a + ' + ' + q.a + ' = ' + q.ans + ' ' + q.u;
  if(q.shape === 'sum') return q.s.join(' + ') + ' = ' + q.ans + ' ' + q.u;
  return q.P + ' − ' + q.a + ' − ' + q.b + ' = ' + q.ans + ' ' + q.u;
}
function whyTriPerim(q, full){
  const fig = (s, last) => '<div class="fig small">' + triSideSvg(s, s.map(v => v + ' ' + q.u), { last, hot: last }) + '</div>';
  if(q.shape === 'eq'){
    if(!full) return tr('Обиколката е сборът на трите страни. Колко дълги са другите две?', 'Периметр — це сума трьох сторін. Яка довжина двох інших?');
    return tr('равностранен: и трите страни са по ', 'рівносторонній: усі три сторони по ') + q.a + ' ' + q.u + fig([q.a, q.a, q.a]) + q.a + ' + ' + q.a + ' + ' + q.a + ' = <b>' + q.ans + '</b> ' + q.u;
  }
  if(q.shape === 'sum'){
    if(!full) return tr('Обиколката е сборът на трите страни.', 'Периметр — це сума трьох сторін.');
    return q.s.join(' + ') + ' = <b>' + q.ans + '</b> ' + q.u;
  }
  if(!full) return tr('Обиколката е сборът на трите страни. Махни от нея двете, които знаеш.', 'Периметр — це сума трьох сторін. Відніми від нього дві, які знаєш.');
  const s = [q.a, q.b, q.ans], o = triPerimSides(s), last = o.indexOf(q.ans);
  return tr('двете известни заедно: ', 'дві відомі разом: ') + q.a + ' + ' + q.b + ' = <b>' + (q.a + q.b) + '</b> &nbsp;→&nbsp; ' + q.P + ' − ' + (q.a + q.b) + ' = <b>' + q.ans + '</b> ' + q.u +
    '<br>' + fig(o, last);
}
const ISO_ROUTES = ['MEKM', 'MEKME', 'MKEM', 'MKEMK', 'EKMEK', 'KMEKM'];
function isoRouteLen(q){ let t = 0; for(let i = 1; i < q.route.length; i++) t += 'ME EM'.includes(q.route[i-1] + q.route[i]) ? q.base : q.leg; return t; }
function genIsoRoute(){
  for(;;){
    const a = 2 + rnd(8), laps = 1 + rnd(3), base = 2 + rnd(6), leg = base + 1 + rnd(5), route = ISO_ROUTES[rnd(ISO_ROUTES.length)];
    const q = {kind:'isoperim', shape:2, a, laps, base, leg, route};
    q.ant = 3*a*laps; q.tort = isoRouteLen(q);
    if(q.ant === q.tort || Math.abs(q.ant - q.tort) > 30) continue;
    q.traps = [Math.abs(3*a - q.tort), Math.abs(q.ant - q.tort - (q.route[1] === 'E' || q.route[1] === 'M' ? q.base : q.leg))].filter(v => v > 0 && v !== Math.abs(q.ant - q.tort));
    q.ans = Math.abs(q.ant - q.tort);
    return q;
  }
}
// Коледно 2023, задача 8: 12, 8, 18, 4, 5, 20 are the perimeters of an equilateral triangle, a square and an
// isosceles triangle with base 1. Its perimeter is 1 + two legs, so odd: only 5 can be it, and the leg is 2.
function genIsoOdd(){
  for(;;){
    const t = 2*(1 + rnd(4)), sq = 1 + rnd(6), b = Math.random() < 0.75 ? 1 : 3, leg = b + rnd(8), list = [3*t, 4*sq, b + 2*leg];
    while(list.length < 6){ const v = 2*(2 + rnd(12)); if(!list.includes(v)) list.push(v); }
    if(new Set(list).size < 6 || leg <= b / 2) continue;
    return {kind:'isoperim', shape:3, t, sq, b, leg, list: shuffle(list), P: b + 2*leg, traps:[b + 2*leg - b, b + 2*leg], ans: leg};
  }
}
function isoRouteSvg(q){
  const u = 16, hA = q.a*u*0.87, base = q.a*u, mx = base + 30, mb = q.base*u, kh = Math.sqrt(Math.max(1, q.leg*q.leg - q.base*q.base/4))*u;
  const H = Math.max(hA, kh) + 30, y0 = H - 6;
  const lab = (x, y, t) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)" font-family="Nunito, sans-serif">' + t + '</text>';
  const pt = (x, y, t, dx) => lab(x + (dx || 0), y, t);
  return '<div class="fig"><svg viewBox="-14 0 ' + (mx + mb + 28).toFixed(1) + ' ' + (H + 14).toFixed(1) + '" role="img" aria-label="' + tr('два триъгълника', 'два трикутники') + '">' +
    '<g stroke="var(--ink)" stroke-width="2" fill="none" stroke-linejoin="round"><path d="M0 ' + y0 + 'L' + base + ' ' + y0 + 'L' + base/2 + ' ' + (y0 - hA).toFixed(1) + 'Z"/>' +
    '<path d="M' + mx + ' ' + y0 + 'L' + (mx + mb) + ' ' + y0 + 'L' + (mx + mb/2) + ' ' + (y0 - kh).toFixed(1) + 'Z"/></g>' +
    pt(0, y0 + 13, 'A', -6) + pt(base, y0 + 13, 'B', 6) + pt(base/2, y0 - hA - 5, 'C') + lab(base/2, y0 - 4, q.a + ' м') +
    pt(mx, y0 + 13, 'M', -6) + pt(mx + mb, y0 + 13, 'E', 6) + pt(mx + mb/2, y0 - kh - 5, 'K') + lab(mx + mb/2, y0 + 13, q.base + ' м') +
    lab(mx + mb*0.75 + 16, y0 - kh/2, q.leg + ' м') + '</svg></div>';
}
export function genTwoIso(){
  if(Math.random() < 0.3) return genIsoOdd();
  for(;;){
    const leg = 5 + rnd(16), d = 1 + rnd(6), b = 2 + rnd(20), T = 4*leg + 2*b + d;
    if(T % 10 || b + d >= 2*leg || T > 150) continue;
    const short = Math.random() < 0.7;
    return {kind:'isoperim', shape:1, leg, d, b, T, short, traps:[(T - 4*leg) / 2], ans: short ? b : b + d};
  }
}
export function genIsoPerim(){
  if(Math.random() < 0.3) return genIsoRoute();
  for(;;){
    const s = 3 + rnd(10), up = 3 + rnd(12), leg = s + up, down = 2 + rnd(leg - 3), base = leg - down;
    if(base < 2 || 2*leg + base > 99) continue;
    return {kind:'isoperim', s, P: 4*s, up, leg, down, base, ans: 2*leg + base};
  }
}
function drawIsoPerim(q){
  if(q.shape === 'sum' || q.shape === 'eq' || q.shape === 'back') return drawTriPerim(q);
  if(q.shape === 2){
    const times = ['', 'веднъж', 'два пъти', 'три пъти'][q.laps], timesUk = ['', 'один раз', 'двічі', 'тричі'][q.laps];
    return '<div class="ask">' + tr('Мравка изминала ' + times + ' пътечката <b>ABCA</b> (триъгълник ABC е равностранен). Костенурка се разходила по равнобедрения триъгълник MEK по следния начин: <b>' + q.route.split('').join('') + '</b>. Колко метра повече е изминало едното животно от другото?',
      'Мурашка пройшла ' + timesUk + ' доріжкою <b>ABCA</b> (трикутник ABC рівносторонній). Черепаха пройшлася рівнобедреним трикутником MEK так: <b>' + q.route + '</b>. На скільки метрів більше пройшла одна тварина, ніж інша?') + '</div>' +
      isoRouteSvg(q) + '<div class="line md">' + SLOT + ' <span class="unit">м</span></div>';
  }
  if(q.shape === 3){
    return '<div class="ask">' + tr('Числата в редицата <span class="num">' + q.list.join(', ') + '</span> са обиколки в сантиметри на фигурите равностранен триъгълник, квадрат и равнобедрен триъгълник с основа <span class="num">' + q.b + '</span>. Колко сантиметра е бедрото на равнобедрения триъгълник?',
      'Числа в ряду <span class="num">' + q.list.join(', ') + '</span> — це периметри в сантиметрах фігур: рівносторонній трикутник, квадрат і рівнобедрений трикутник з основою <span class="num">' + q.b + '</span>. Скільки сантиметрів бічна сторона рівнобедреного трикутника?') + '</div>' +
      '<div class="line md">' + SLOT + CM + '</div>';
  }
  if(q.shape === 1){
    return '<div class="ask">' + tr('Бедрата на два равнобедрени триъгълника са по <span class="num">' + q.leg + '</span> см. Основата на единия е с <span class="num">' + q.d +
      '</span> см по-къса от основата на другия. Сборът от обиколките им е <span class="num">' + q.T / 10 + '</span> дм. Колко сантиметра е <b>' + (q.short ? 'по-късата' : 'по-дългата') + ' основа</b>?',
      'Бічні сторони двох рівнобедрених трикутників — по <span class="num">' + q.leg + '</span> см. Основа одного на <span class="num">' + q.d +
      '</span> см коротша за основу другого. Сума їхніх периметрів — <span class="num">' + q.T / 10 + '</span> дм. Скільки сантиметрів становить <b>' + (q.short ? 'коротша' : 'довша') + ' основа</b>?') + '</div>' +
      '<div class="line md">' + SLOT + CM + '</div>';
  }
  return '<div class="ask">' + tr('Обиколката на квадрат е <span class="num">' + q.P + '</span> см. Бедрото на равнобедрен триъгълник е с <span class="num">' + q.up +
    '</span> см по-дълго от страната на квадрата, а основата на триъгълника е с <span class="num">' + q.down + '</span> см по-къса от бедрото му. Колко сантиметра е <b>обиколката на триъгълника</b>?',
    'Периметр квадрата — <span class="num">' + q.P + '</span> см. Бічна сторона рівнобедреного трикутника на <span class="num">' + q.up +
    '</span> см довша за сторону квадрата, а основа трикутника на <span class="num">' + q.down + '</span> см коротша за бічну сторону. Скільки сантиметрів становить <b>периметр трикутника</b>?') + '</div>' +
    '<div class="line md">' + SLOT + CM + '</div>';
}
function eqIsoPerim(q){
  if(q.shape === 'sum' || q.shape === 'eq' || q.shape === 'back') return eqTriPerim(q);
  if(q.shape === 2) return q.laps + ' · ' + 3*q.a + ' = ' + q.ant + ', ' + q.route + ' = ' + q.tort + ' → ' + q.ans;
  if(q.shape === 3) return q.b + ' + 2 · ' + tr('бедро', 'бічна') + ' = ' + q.P + ' → ' + q.ans;
  if(q.shape === 1) return q.T + ' − 4 · ' + q.leg + ' = ' + (q.T - 4*q.leg) + ', ' + (q.T - 4*q.leg) + ' − ' + q.d + ' = ' + 2*q.b + ' → ' + q.ans;
  return q.P + ' : 4 = ' + q.s + ', ' + q.s + ' + ' + q.up + ' = ' + q.leg + ', ' + q.leg + ' − ' + q.down + ' = ' + q.base + ' → ' + q.ans;
}
function whyIsoPerim(q, full){
  if(q.shape === 'sum' || q.shape === 'eq' || q.shape === 'back') return whyTriPerim(q, full);
  if(q.shape === 2){
    if(!full) return tr('Колко отсечки има всеки път и колко е дълга всяка? Внимавай кои страни на MEK са равни.', 'Скільки відрізків у кожному шляху і яка довжина кожного? Зверни увагу, які сторони MEK рівні.');
    const segs = []; for(let i = 1; i < q.route.length; i++) segs.push('ME EM'.includes(q.route[i-1] + q.route[i]) ? q.base : q.leg);
    return tr('мравката: ', 'мурашка: ') + (q.laps > 1 ? q.laps + ' · ' : '') + '(' + q.a + ' + ' + q.a + ' + ' + q.a + ') = <b>' + q.ant + '</b>, ' + tr('костенурката: ', 'черепаха: ') + segs.join(' + ') + ' = <b>' + q.tort + '</b> &nbsp;→&nbsp; ' +
      Math.max(q.ant, q.tort) + ' − ' + Math.min(q.ant, q.tort) + ' = ' + q.ans;
  }
  if(q.shape === 3){
    if(!full) return tr('Обиколката на равнобедрения е основата и две равни бедра. Четно или нечетно число излиза?', 'Периметр рівнобедреного — основа й дві рівні бічні сторони. Парне чи непарне число виходить?');
    return tr('две равни бедра дават четно число, с основа ' + q.b + ' обиколката е нечетна', 'дві рівні бічні сторони дають парне число, з основою ' + q.b + ' периметр непарний') + ' &nbsp;→&nbsp; <b>' + q.P + '</b> &nbsp;→&nbsp; (' + q.P + ' − ' + q.b + ') : 2 = ' + q.ans;
  }
  if(q.shape === 1){
    if(!full) return tr('Дециметрите в сантиметри. Колко бедра има общо — и колко остава за двете основи?', 'Дециметри — у сантиметри. Скільки всього бічних сторін — і скільки залишається на дві основи?');
    const B = q.T - 4*q.leg;
    return q.T / 10 + tr(' дм = ', ' дм = ') + q.T + tr(' см; четири бедра: ', ' см; чотири бічні сторони: ') + 4*q.leg + ' &nbsp;→&nbsp; ' + tr('двете основи: ', 'дві основи: ') + q.T + ' − ' + 4*q.leg + ' = <b>' + B +
      '</b> &nbsp;→&nbsp; ' + B + ' − ' + q.d + ' = ' + 2*q.b + ', ' + 2*q.b + ' : 2 = <b>' + q.b + '</b>' + (q.short ? '' : ', ' + q.b + ' + ' + q.d + ' = ' + q.ans);
  }
  if(!full) return tr('Първо страната на квадрата, после бедрото, после основата. Бедрата са две.', 'Спершу сторона квадрата, потім бічна сторона, потім основа. Бічних сторін дві.');
  return tr('страната на квадрата: ', 'сторона квадрата: ') + q.P + ' : 4 = <b>' + q.s + '</b> &nbsp;→&nbsp; ' + tr('бедрото: ', 'бічна сторона: ') + q.s + ' + ' + q.up + ' = <b>' + q.leg +
    '</b> &nbsp;→&nbsp; ' + tr('основата: ', 'основа: ') + q.leg + ' − ' + q.down + ' = <b>' + q.base + '</b> &nbsp;→&nbsp; ' + q.leg + ' + ' + q.leg + ' + ' + q.base + ' = ' + q.ans;
}
KIND.isoperim = { draw:drawIsoPerim, eq:eqIsoPerim, why:whyIsoPerim };
