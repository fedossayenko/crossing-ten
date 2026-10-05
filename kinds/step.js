// Question kind 'step': level 52 Изрязан ъгъл — A corner cut from a rectangle — its sides and its outline.

// Задача 16: the cut edge belongs to both halves, so the two perimeters count it twice.
// Задача 15: a corner cut out of a rectangle. Two of the six sides are never labelled,
// so they have to be worked out — and the outline is the same length as the uncut
// rectangle's, which is the surprise.
import { CM, KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
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
    'font-family="Nunito, sans-serif">' + t + ' см</text>';
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
  return q.W + '×' + q.H + tr(', изрязано ', ', вирізано ') + q.w + '×' + q.h + ' → ' + q.ans;
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
    foot = '(' + q.W + ' + ' + q.H + ') × 2 = ' + q.ans;
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
  return '<svg viewBox="0 0 ' + f(q.W * u + 90) + ' ' + f(q.H * u + 70) + '" style="display:block; width:' + Math.round((q.W * u + 90) * 1.15) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('страните на фигурата', 'сторони фігури') + '">' + g + '</svg>';
}
function whyStep(q, full){
  const text = whyStepText(q, full);
  return full && text ? text + stepWalkSvg(q) : text;
}
function whyStepText(q, full){
  if(q.kind === 'step'){
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
}
KIND.step = { draw:drawStep, eq:eqStep, why:whyStep };
