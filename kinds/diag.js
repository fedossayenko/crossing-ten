// Question kind 'diag': level 139 Диагоналите — Squares of a grid cut by a rectangle's diagonals.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, задача 15: a 9 by 6 rectangle of 1 см squares and its diagonals AC and BD. How many
// squares are cut into two parts? Each diagonal crosses 12 squares; the two in the middle are crossed by
// both, so they are in more than two parts: 12 + 12 − 2 − 2 = 20. Each square is tested here one by one.
function diagCuts(w, h, i, j, flip){
  // does the diagonal (0,0)–(w,h), or (w,0)–(0,h), pass through the inside of square [i, i+1] × [j, j+1]?
  const y = x => flip ? h - h*x/w : h*x/w, y0 = y(i), y1 = y(i + 1), lo = Math.min(y0, y1), hi = Math.max(y0, y1);
  return Math.max(lo, j) < Math.min(hi, j + 1) - 1e-9;
}
function genDiag(){
  for(;;){
    const w = 4 + rnd(7), h = 3 + rnd(5), one = Math.random() < 0.3;
    if(w === h) continue;
    let two = 0, ac = 0, both = 0;
    for(let i = 0; i < w; i++) for(let j = 0; j < h; j++){
      const a = diagCuts(w, h, i, j, false), b = diagCuts(w, h, i, j, true);
      if(a) ac++; if(a && b) both++; if(a !== b) two++;
    }
    return {kind:'diag', w, h, one, ac, both, traps:[2*ac], ans: one ? ac : two};
  }
}
function diagSvg(q){
  const u = Math.min(22, 200 / q.w), W = q.w*u, H = q.h*u;
  let g = '';
  for(let i = 1; i < q.w; i++) g += '<line x1="' + i*u + '" y1="0" x2="' + i*u + '" y2="' + H + '"/>';
  for(let j = 1; j < q.h; j++) g += '<line x1="0" y1="' + j*u + '" x2="' + W + '" y2="' + j*u + '"/>';
  const lab = (x, y, t) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)" font-family="Nunito, sans-serif">' + t + '</text>';
  return '<div class="fig"><svg viewBox="-14 -14 ' + (W + 28) + ' ' + (H + 28) + '" role="img" aria-label="' + tr('правоъгълник на квадратчета с диагонали', 'прямокутник у клітинку з діагоналями') + '">' +
    '<g stroke="var(--muted)" stroke-width="0.7">' + g + '</g><rect x="0" y="0" width="' + W + '" height="' + H + '" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' +
    '<g stroke="var(--accent)" stroke-width="1.6"><line x1="0" y1="' + H + '" x2="' + W + '" y2="0"/>' + (q.one ? '' : '<line x1="' + W + '" y1="' + H + '" x2="0" y2="0"/>') + '</g>' +
    lab(-7, H + 11, 'A') + lab(W + 7, H + 11, 'B') + lab(W + 7, -4, 'C') + lab(-7, -4, 'D') + '</svg></div>';
}
function drawDiag(q){
  if(q.kind === 'diag'){
    return '<div class="ask">' + tr('Правоъгълник ABCD е със страни <span class="num">' + q.w + '</span> см и <span class="num">' + q.h + '</span> см и е разделен на квадрати със страна 1 см. ' +
      (q.one ? 'През колко от тези квадрати минава отсечката <b>AC</b>?' : 'Колко от тези квадрати са разделени от отсечките AC и BD <b>на две части</b>?'),
      'Прямокутник ABCD має сторони <span class="num">' + q.w + '</span> см і <span class="num">' + q.h + '</span> см і поділений на квадрати зі стороною 1 см. ' +
      (q.one ? 'Через скільки з цих квадратів проходить відрізок <b>AC</b>?' : 'Скільки з цих квадратів відрізки AC і BD ділять <b>на дві частини</b>?')) + '</div>' +
      diagSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqDiag(q){
  if(q.kind === 'diag') return q.one ? 'AC → ' + q.ans : q.ac + ' + ' + q.ac + ' − ' + q.both + ' − ' + q.both + ' = ' + q.ans;
}
function whyDiag(q, full){
  if(q.kind === 'diag'){
    if(!full) return q.one ? tr('Следи отсечката квадрат по квадрат. Където минава през ъгъл, не пресича съседните квадрати.', 'Стеж за відрізком квадрат за квадратом. Де він проходить через кут, сусідні квадрати він не перетинає.')
      : tr('Квадрат, през който минават и двете отсечки, е разделен на повече от две части.', 'Квадрат, через який проходять обидва відрізки, поділений більш ніж на дві частини.');
    return tr('AC минава през <b>', 'AC проходить через <b>') + q.ac + tr('</b> квадрата', '</b> квадратів') + (q.one ? ' &nbsp;→&nbsp; ' + q.ans : tr(', BD също през <b>', ', BD теж через <b>') + q.ac + tr('</b>, и двете — през <b>', '</b>, обидва — через <b>') + q.both + '</b> &nbsp;→&nbsp; ' + q.ac + ' + ' + q.ac + ' − ' + q.both + ' − ' + q.both + ' = ' + q.ans);
  }
}
KIND.diag = { draw:drawDiag, eq:eqDiag, why:whyDiag };
