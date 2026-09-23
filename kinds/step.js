// Question kind 'step': level 52 Изрязан ъгъл — A corner cut from a rectangle — its sides and its outline.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 16: the cut edge belongs to both halves, so the two perimeters count it twice.
// Задача 15: a corner cut out of a rectangle. Two of the six sides are never labelled,
// so they have to be worked out — and the outline is the same length as the uncut
// rectangle's, which is the surprise.
function genStep(){
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
    '" role="img" aria-label="правоъгълник с изрязан ъгъл">' +
    '<path d="' + d + '" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/>' +
    lab(X(q.W/2), Y(0) + 17, q.W) +
    lab(X(0) - 22, Y(q.H/2) + 4, q.H) +
    lab(X(q.W - q.w/2), Y(q.H - q.h) - 6, q.w) +
    lab(X(q.W) + 22, Y((q.H - q.h)/2) + 4, q.H - q.h) + '</svg></div>';
}

function drawStep(q){
  if(q.kind === 'step'){
    const ask = q.shape === 0
      ? 'От правоъгълник е изрязан правоъгълник. Получила се е друга фигура. <b>Колко са отсечките</b> на тази фигура, които са с <b>равни дължини</b>?'
      : q.shape === 1
      ? 'От правоъгълник е изрязан правоъгълник. Колко сантиметра е <b>обиколката</b> на получената фигура?'
      : 'От правоъгълник е изрязан правоъгълник. Колко сантиметра е дължината на <b>неозначената изправена</b> страна?';
    return '<div class="ask">' + ask + '</div>' + stepSvg(q) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT +
      (q.shape === 0 ? '' : CM) + '</div>';
  }
}
function eqStep(q){
  if(q.kind === 'step') return q.W + '×' + q.H + ', изрязано ' + q.w + '×' + q.h + ' → ' + q.ans;
}
function whyStep(q, full){
  if(q.kind === 'step'){
    if(!full) return q.shape === 1 ? 'Изрязването мести страните, но не ги скъсява.'
                                   : 'Двете неозначени страни се получават от означените.';
    const missing = 'неозначените са ' + (q.W - q.w) + ' и ' + q.h;
    if(q.shape === 0){
      const groups = {};
      q.sides.forEach(v => { groups[v] = (groups[v] || 0) + 1; });
      const pairs = Object.keys(groups).filter(v => groups[v] > 1)
        .map(v => groups[v] + ' по ' + v).join(', ');
      return missing + ' &nbsp;→&nbsp; страните са <b>' + q.sides.slice().sort((a, b) => b - a).join(', ') +
        '</b> &nbsp;→&nbsp; ' + pairs + ' &nbsp;→&nbsp; ' + q.ans;
    }
    if(q.shape === 1) return 'страните се местят, но обиколката е като на целия правоъгълник &nbsp;→&nbsp; ' +
      q.W + ' + ' + q.H + ' = ' + (q.W + q.H) + ', два пъти &nbsp;→&nbsp; ' + q.ans;
    return 'изправената страна на целия правоъгълник е ' + q.H + ', а долната ѝ част е ' + (q.H - q.h) +
      ' &nbsp;→&nbsp; ' + q.H + ' − ' + (q.H - q.h) + ' = ' + q.ans;
  }
}
KIND.step = { draw:drawStep, eq:eqStep, why:whyStep };
