// Question kind 'sqoff': level 84 Режем квадрати — Cut the biggest square off a sheet, again and again.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 11: a 10 by 6 sheet, each cut takes off the largest square there
// is. The square's side is always the shorter side of what is left: 6, 4, 2, 2 → 4 squares.
function sqOffCuts(W, H){
  const cuts = [];
  while(W && H){ const s = Math.min(W, H); cuts.push(s); if(W > H) W -= s; else H -= s; }
  return cuts;
}
function genSqOff(){
  for(;;){
    const W = 5 + rnd(10), H = 2 + rnd(W - 2), cuts = sqOffCuts(W, H);
    if(cuts.length >= 3 && cuts.length <= 6) return {kind:'sqoff', W, H, cuts, ans: cuts.length};
  }
}
function sqOffSvg(q){
  const u = 180 / q.W, w = q.W*u, h = q.H*u;
  const lab = (x, y, t) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)" font-family="Nunito, sans-serif">' + t + ' см</text>';
  return '<div class="fig"><svg viewBox="0 0 ' + (w + 70).toFixed(1) + ' ' + (h + 40).toFixed(1) + '" role="img" aria-label="' + tr('правоъгълен лист', 'прямокутний аркуш') + '">' +
    '<rect x="40" y="10" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="none" stroke="var(--ink)" stroke-width="2.2"/>' +
    lab(40 + w/2, h + 30, q.W) + lab(20, 14 + h/2, q.H) + '</svg></div>';
}
function drawSqOff(q){
  if(q.kind === 'sqoff'){
    return '<div class="ask">' + tr('Лист хартия е с форма на правоъгълник с размери <span class="num">' + q.W + '</span>&nbsp;см на <span class="num">' + q.H +
      '</span>&nbsp;см. Срязваме листа само по една линия, за да получим <b>квадрат с възможно най-голяма страна</b>. Продължаваме по същия начин с останалата част, докато листът свърши. <b>Колко квадрата</b> сме получили?',
      'Аркуш паперу має форму прямокутника розміром <span class="num">' + q.W + '</span>&nbsp;см на <span class="num">' + q.H +
      '</span>&nbsp;см. Розрізаємо аркуш лише по одній лінії, щоб отримати <b>квадрат із найбільшою можливою стороною</b>. Те саме робимо з рештою, доки аркуш не закінчиться. <b>Скільки квадратів</b> ми отримали?') + '</div>' +
      sqOffSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqSqOff(q){
  if(q.kind === 'sqoff') return q.W + '×' + q.H + ' → ' + q.cuts.join(', ') + ' → ' + q.ans;
}
function whySqOff(q, full){
  if(q.kind === 'sqoff'){
    if(!full) return tr('Страната на всеки квадрат е колкото по-късата страна на това, което е останало.',
                        'Сторона кожного квадрата дорівнює коротшій стороні того, що залишилося.');
    let W = q.W, H = q.H;
    const steps = q.cuts.map(s => { const was = W + '×' + H; if(W > H) W -= s; else H -= s;
      return was + ' → ' + tr('квадрат ', 'квадрат ') + s; });
    return steps.join('; ') + tr(' &nbsp;→&nbsp; квадратите са ', ' &nbsp;→&nbsp; квадратів ') + q.ans;
  }
}
KIND.sqoff = { draw:drawSqOff, eq:eqSqOff, why:whySqOff };
