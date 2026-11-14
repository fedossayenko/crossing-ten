// Question kind 'step': level 52 Изрязан ъгъл — A corner cut from a rectangle — its sides and its outline.

// Задача 16: the cut edge belongs to both halves, so the two perimeters count it twice.
// Задача 15: a corner cut out of a rectangle. Two of the six sides are never labelled,
// so they have to be worked out — and the outline is the same length as the uncut
// rectangle's, which is the surprise.
import { CM, KIND, SLOT, SVG_FONT, addUp, popAt, rnd, svgText, tr } from '../js/core.js';
export function genStep(){
  for(;;){
    const W = 5 + rnd(5), H = 4 + rnd(5);
    const w = 1 + rnd(W - 2), h = 1 + rnd(H - 2);
    // going round: bottom, right, inward, up, top, left
    const sides = [W, H - h, w, h, W - w, H];
    const seen = {};
    sides.forEach(v => { seen[v] = (seen[v] || 0) + 1; });
    const equal = sides.filter(v => seen[v] > 1).length;
    const shape = rnd(3);
    if(shape === 0 && equal < 2) continue;      // a question with nothing to find is no question
    return {kind:'step', shape, W, H, w, h, sides, equal,
            ans: shape === 0 ? equal : shape === 1 ? 2*(W + H) : h};
  }
}
// The four labelled sides are the ones the question gives; the other two she works out.
function stepSvg(q){
  const u = 150 / Math.max(q.W, q.H), X = v => 44 + v*u, Y = v => 14 + (q.H - v)*u;
  const lab = (x, y, t) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
    '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)" ' +
    SVG_FONT + '>' + t + ' см</text>';
  const d = 'M' + X(0) + ' ' + Y(0) + 'H' + X(q.W) + 'V' + Y(q.H - q.h) + 'H' + X(q.W - q.w) +
            'V' + Y(q.H) + 'H' + X(0) + 'Z';
  return '<div class="fig"><svg viewBox="0 0 ' + (q.W*u + 90).toFixed(1) + ' ' + (q.H*u + 44).toFixed(1) +
    '" role="img" aria-label="' + tr('правоъгълник с изрязан ъгъл', 'прямокутник з вирізаним кутом') + '">' +
    '<path d="' + d + '" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/>' +
    lab(X(q.W/2), Y(0) + 17, q.W) +
    lab(X(0) - 22, Y(q.H/2) + 4, q.H) +
    lab(X(q.W - q.w/2), Y(q.H - q.h) - 6, q.w) +
    lab(X(q.W) + 22, Y((q.H - q.h)/2) + 4, q.H - q.h) + '</svg></div>';
}

function drawStep(q){
  if(q.shape === 'roof') return drawStepRoof(q);
  const ask = q.shape === 0
    ? tr('От правоъгълник е изрязан правоъгълник. Получила се е друга фигура. <b>Колко са отсечките</b> на тази фигура, които са с <b>равни дължини</b>?',
         'З прямокутника вирізали прямокутник. Вийшла інша фігура. <b>Скільки відрізків</b> цієї фігури мають <b>однакову довжину</b>?')
    : q.shape === 1
    ? tr('От правоъгълник е изрязан правоъгълник. Колко сантиметра е <b>обиколката</b> на получената фигура?',
         'З прямокутника вирізали прямокутник. Скільки сантиметрів становить <b>периметр</b> отриманої фігури?')
    : tr('От правоъгълник е изрязан правоъгълник. Колко сантиметра е дължината на <b>неозначената изправена</b> страна?',
         'З прямокутника вирізали прямокутник. Скільки сантиметрів становить довжина <b>непозначеної вертикальної</b> сторони?');
  return '<div class="ask">' + ask + '</div>' + stepSvg(q) +
    '<div class="line md">' + SLOT +
    (q.shape === 0 ? '' : CM) + '</div>';
}
function eqStep(q){
  if(q.shape === 'roof') return eqStepRoof(q);
  return q.W + ' на ' + q.H + tr(', изрязано ', ', вирізано ') + q.w + ' на ' + q.h + ' → ' + q.ans;
}
// The picture: the figure again, its six sides walked as the answer needs them. For the outline the
// two sides of the notch slide out to the missing corner (dashed), so it is the whole rectangle's.
function stepWalkSvg(q){
  const u = 150 / Math.max(q.W, q.H), X = v => 44 + v * u, Y = v => 14 + (q.H - v) * u, f = v => v.toFixed(1);
  // going round: bottom, right, inward, up, top, left — [x1, y1, x2, y2] in units, and where the label goes
  const S = [[0, 0, q.W, 0, 0, 1], [q.W, 0, q.W, q.H - q.h, 1, 0], [q.W, q.H - q.h, q.W - q.w, q.H - q.h, 0, -1],
             [q.W - q.w, q.H - q.h, q.W - q.w, q.H, 1, 0], [q.W - q.w, q.H, 0, q.H, 0, -1], [0, q.H, 0, 0, -1, 0]];
  const side = (i, t, col, step, dash) => { const [a, b, c, d, ox, oy] = S[i];
    return '<g' + popAt(step) + '><line x1="' + f(X(a)) + '" y1="' + f(Y(b)) + '" x2="' + f(X(c)) + '" y2="' + f(Y(d)) + '" stroke="' + col + '" stroke-width="4" stroke-linecap="round"' + (dash ? ' stroke-dasharray="5 5"' : '') + '/>' +
      (t === '' ? '' : svgText(f((X(a) + X(c)) / 2 + ox * 18), f((Y(b) + Y(d)) / 2 + oy * 11 + 4), t, 12, col)) + '</g>'; };
  let g = '<path d="M' + X(0) + ' ' + Y(0) + 'H' + X(q.W) + 'V' + Y(q.H - q.h) + 'H' + X(q.W - q.w) + 'V' + Y(q.H) + 'H' + X(0) + 'Z" fill="none" stroke="var(--line)" stroke-width="2"/>', foot;
  if(q.shape === 1){
    // the notch's sides moved out: its floor up to the top, its wall over to the right
    const corner = (a, b, c, d) => '<line x1="' + f(X(a)) + '" y1="' + f(Y(b)) + '" x2="' + f(X(c)) + '" y2="' + f(Y(d)) + '" stroke="var(--warm)" stroke-width="3" stroke-dasharray="5 4"/>';
    g += side(2, q.w, 'var(--warm)', 1) + side(3, q.h, 'var(--warm)', 1.5) +
      '<g' + popAt(2.5) + '>' + corner(q.W - q.w, q.H, q.W, q.H) + corner(q.W, q.H, q.W, q.H - q.h) + '</g>' +
      side(0, q.W, 'var(--accent)', 3.5) + side(5, q.H, 'var(--accent)', 4);
    foot = (q.W + q.H) + ' + ' + (q.W + q.H) + ' = ' + q.ans;
  } else if(q.shape === 2){
    g += side(5, q.H, 'var(--accent)', 1) + side(1, q.H - q.h, 'var(--good)', 2) + side(3, '?', 'var(--warm)', 3);
    foot = q.H + ' − ' + (q.H - q.h) + ' = ' + q.ans;
  } else {
    // every side with its length; the ones that come in pairs (or more) in orange
    const count = {}; q.sides.forEach(v => { count[v] = (count[v] || 0) + 1; });
    q.sides.forEach((v, i) => { g += side(i, v, count[v] > 1 ? 'var(--warm)' : 'var(--muted)', 1 + i * 0.6); });
    foot = tr('равни: ', 'рівних: ') + q.ans;
  }
  g += svgText(f(X(q.W / 2)), f(Y(0) + 42), foot, 15, 'var(--ink)', popAt(5));
  return '<svg viewBox="0 -10 ' + f(q.W * u + 90) + ' ' + f(q.H * u + 80) + '" style="display:block; width:' + Math.round((q.W * u + 90) * 1.15) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('страните на фигурата', 'сторони фігури') + '">' + g + '</svg>';
}
function whyStep(q, full){
  if(q.shape === 'roof') return whyStepRoof(q, full);
  const text = whyStepText(q, full);
  return full && text ? text + stepWalkSvg(q) : text;
}
function whyStepText(q, full){
  if(!full) return q.shape === 1 ? tr('Изрязването мести страните, но не ги скъсява.', 'Вирізання пересуває сторони, але не робить їх коротшими.')
                                 : tr('Двете неозначени страни се получават от означените.', 'Дві непозначені сторони можна знайти з позначених.');
  const missing = tr('неозначените са ' + (q.W - q.w) + ' и ' + q.h, 'непозначені — це ' + (q.W - q.w) + ' і ' + q.h);
  if(q.shape === 0){
    const groups = {};
    q.sides.forEach(v => { groups[v] = (groups[v] || 0) + 1; });
    const pairs = Object.keys(groups).filter(v => groups[v] > 1)
      .map(v => groups[v] + ' по ' + v).join(', ');
    return missing + tr(' &nbsp;→&nbsp; страните са <b>', ' &nbsp;→&nbsp; сторони: <b>') + q.sides.slice().sort((a, b) => b - a).join(', ') +
      '</b> &nbsp;→&nbsp; ' + pairs + ' &nbsp;→&nbsp; ' + q.ans;
  }
  if(q.shape === 1) return tr('страните се местят, но обиколката е като на целия правоъгълник &nbsp;→&nbsp; ',
                              'сторони пересуваються, але периметр такий самий, як у цілого прямокутника &nbsp;→&nbsp; ') +
    q.W + ' + ' + q.H + ' = ' + (q.W + q.H) + tr(', два пъти', ', двічі') + ' &nbsp;→&nbsp; ' + q.ans;
  return tr('изправената страна на целия правоъгълник е ' + q.H + ', а долната ѝ част е ' + (q.H - q.h),
            'вертикальна сторона цілого прямокутника — ' + q.H + ', а її нижня частина — ' + (q.H - q.h)) +
    ' &nbsp;→&nbsp; ' + q.H + ' − ' + (q.H - q.h) + ' = ' + q.ans;
}
// Салабашев 2024, 2 клас, задача 13 (level 500): a square of 15 см with a 3 см square cut from a corner, and a triangle of sides 15, 11 and 6 см glued on a side. The cut does
// not change the outline (the sides move, they do not shrink), and the glued side is no longer on it: 15 + 15 + 15 + 11 + 6 = 62.
export function genStepRoof(){
  for(;;){
    const S = 8 + rnd(9), n = 2 + rnd(Math.floor(S / 3)), a = 3 + rnd(S - 3), b = 3 + rnd(S - 3);
    const x = (S*S + a*a - b*b) / (2*S);
    if(a === b || a + b <= S + 1 || x <= 1 || x >= S - 1) continue;
    return {kind:'step', shape:'roof', S, n, a, b, ans: 3*S + a + b};
  }
}
// the figure on a grid of centimetres, y measured up: the square's corner cut at bottom left, the roof's apex at its two distances
function roofPoints(q){
  const x = (q.S*q.S + q.a*q.a - q.b*q.b) / (2*q.S), h = Math.sqrt(q.a*q.a - x*x);
  return [[q.n, 0], [q.S, 0], [q.S, q.S], [x, q.S + h], [0, q.S], [0, q.n], [q.n, q.n]];
}
function roofSvg(q){
  const P = roofPoints(q), top = P[3][1], u = Math.min(150 / q.S, 150 / top), f = v => v.toFixed(1), X = v => 40 + v*u, Y = v => 22 + (top - v)*u;
  const lab = (x, y, t, anchor) => '<text x="' + f(x) + '" y="' + f(y) + '" text-anchor="' + anchor + '" font-size="12" font-weight="700" fill="var(--muted)" ' + SVG_FONT + '>' + t + ' см</text>';
  const d = 'M' + P.map(p => f(X(p[0])) + ',' + f(Y(p[1]))).join(' L') + ' Z';
  return '<div class="fig"><svg viewBox="0 0 ' + f(X(q.S) + 52) + ' ' + f(Y(0) + 24) + '" style="max-width:' + Math.round((X(q.S) + 52)*1.2) + 'px" role="img" aria-label="' + tr('квадрат с изрязан ъгъл и триъгълник отгоре', 'квадрат із вирізаним кутом і трикутник зверху') + '">' +
    '<path d="' + d + '" fill="var(--accentbg)" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<line x1="' + f(X(0)) + '" y1="' + f(Y(q.S)) + '" x2="' + f(X(q.S)) + '" y2="' + f(Y(q.S)) + '" stroke="var(--ink)" stroke-width="2.2"/>' +
    lab((X(P[3][0]) + X(0)) / 2 - 8, (Y(P[3][1]) + Y(q.S)) / 2 - 8, q.a, 'end') + lab((X(P[3][0]) + X(q.S)) / 2 + 8, (Y(P[3][1]) + Y(q.S)) / 2 - 8, q.b, 'start') +
    lab(X(q.S / 2), Y(q.S) + 16, q.S, 'middle') + lab(X(q.n / 2), Y(0) + 15, q.n, 'middle') + '</svg></div>';
}
function drawStepRoof(q){
  return '<div class="ask">' + tr('Фигурата на чертежа е получена от долепянето на квадрат със страна <span class="num">' + q.S + '</span> см, от който е изрязано квадратче със страна <span class="num">' + q.n + '</span> см, и триъгълник със страни <span class="num">' + q.S + '</span> см, <span class="num">' + q.a + '</span> см и <span class="num">' + q.b + '</span> см. Долепените страни на квадрата и триъгълника са равни. Колко сантиметра е <b>обиколката</b> на фигурата?',
    'Фігуру на рисунку отримано приставленням квадрата зі стороною <span class="num">' + q.S + '</span> см, з якого вирізано квадратик зі стороною <span class="num">' + q.n + '</span> см, і трикутника зі сторонами <span class="num">' + q.S + '</span> см, <span class="num">' + q.a + '</span> см і <span class="num">' + q.b + '</span> см. Прикладені сторони квадрата й трикутника рівні. Скільки сантиметрів становить <b>периметр</b> фігури?') + '</div>' +
    roofSvg(q) + '<div class="line md">' + SLOT + CM + '</div>';
}
const eqStepRoof = q => [q.S, q.S, q.S, q.a, q.b].join(' + ') + ' = ' + q.ans;
function whyStepRoof(q, full){
  if(!full) return tr('Изрязването мести страните, но не ги скъсява. А долепената страна вече не е по контура.', 'Вирізання пересуває сторони, але не робить їх коротшими. А прикладена сторона вже не лежить на контурі.');
  return tr('квадратът с изрязано ъгълче има обиколка като цял квадрат: ', 'квадрат із вирізаним кутиком має периметр цілого квадрата: ') + addUp(4, q.S) + ' &nbsp;→&nbsp; ' +
    tr('горната страна е долепена, тя не е по контура: ', 'верхня сторона прикладена, вона не на контурі: ') + 4*q.S + ' − ' + q.S + ' = <b>' + 3*q.S + '</b> &nbsp;→&nbsp; ' + tr('триъгълникът добавя ', 'трикутник додає ') + q.a + ' + ' + q.b + ' &nbsp;→&nbsp; ' + 3*q.S + ' + ' + q.a + ' + ' + q.b + ' = ' + q.ans;
}
KIND.step = { draw:drawStep, eq:eqStep, why:whyStep };
