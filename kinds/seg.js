// Question kind 'seg': level 40 AD = ? — Overlapping lengths along a line.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 11: four points in a row, measured in overlapping pieces.
function genSeg(){
  if(Math.random() < 0.4) return genRuler();
  const p = 2 + rnd(6), q = 1 + rnd(4), r = 2 + rnd(7);
  return {kind:'seg', p, q, r, AB: p + q, CD: q + r, ans: p + q + r};
}
// Задача 14: the segments are not given, they are read off the ruler — the length is the
// difference of the two marks, not the mark the segment ends at.
function genRuler(){
  for(;;){
    const a = 1 + rnd(3), b = a + 2 + rnd(4);
    const c = a + 1 + rnd(3), d = c + 2 + rnd(5);
    if(d > 13 || c >= b || d <= b) continue;   // they overlap and neither swallows the other, so both must be read
    return {kind:'seg', shape:'ruler', a, b, c, d, AB: b - a, CD: d - c, ans: (b - a) + (d - c)};
  }
}
// A ruler with the two bracketed segments standing above it.
function rulerSvg(q){
  const W = 232, n = 14, u = (W - 16) / n, x = v => 8 + v*u;
  const top = 44, H = top + 46;
  let ticks = '';
  for(let v = 0; v <= n; v++){
    const h = v % 5 === 0 ? 13 : 7;
    ticks += '<line x1="' + x(v).toFixed(1) + '" y1="' + top + '" x2="' + x(v).toFixed(1) +
             '" y2="' + (top + h) + '"/>';
  }
  let nums = '';
  for(let v = 0; v <= n; v += 1) if(v % 2 === 0)
    nums += '<text x="' + x(v).toFixed(1) + '" y="' + (top + 30) + '" text-anchor="middle" font-size="9" ' +
            'fill="var(--muted)" font-family="Nunito, sans-serif">' + v + '</text>';
  const bracket = (from, to, y, l1, l2) =>
    '<g stroke="var(--accent)" stroke-width="2" fill="none">' +
    '<path d="M' + x(from).toFixed(1) + ' ' + y + 'H' + x(to).toFixed(1) + '"/>' +
    '<path d="M' + x(from).toFixed(1) + ' ' + y + 'V' + top + 'M' + x(to).toFixed(1) + ' ' + y + 'V' + top +
    '" stroke-dasharray="3 3" stroke-width="1.4"/></g>' +
    '<text x="' + (x(from) - 8).toFixed(1) + '" y="' + (y + 4) + '" text-anchor="middle" font-size="13" ' +
    'font-weight="700" fill="var(--ink)" font-family="Nunito, sans-serif">' + l1 + '</text>' +
    '<text x="' + (x(to) + 8).toFixed(1) + '" y="' + (y + 4) + '" text-anchor="middle" font-size="13" ' +
    'font-weight="700" fill="var(--ink)" font-family="Nunito, sans-serif">' + l2 + '</text>';
  return '<div class="fig"><svg viewBox="-20 0 ' + (W + 40) + ' ' + H + '" role="img" aria-label="две отсечки върху линийка">' +
    '<rect x="8" y="' + top + '" width="' + (W - 16) + '" height="26" rx="2" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' +
    '<g stroke="var(--ink)" stroke-width="1.1">' + ticks + '</g>' + nums +
    bracket(q.a, q.b, 12, 'A', 'B') + bracket(q.c, q.d, 30, 'C', 'D') + '</svg></div>';
}
function segSvg(q){
  const W = 236, tot = q.p + q.q + q.r;
  const at = v => 14 + v / tot * (W - 28);
  const pts = [[at(0), 'A'], [at(q.p), 'C'], [at(q.p + q.q), 'B'], [at(tot), 'D']];
  return '<div class="fig"><svg viewBox="0 -12 ' + W + ' 44" role="img" aria-label="четири точки върху права">' +
    '<line x1="4" y1="0" x2="' + (W - 4) + '" y2="0" stroke="var(--ink)" stroke-width="2"/>' +
    pts.map(pt => '<circle cx="' + pt[0].toFixed(1) + '" cy="0" r="3.4" fill="var(--ink)"/>' +
      '<text x="' + pt[0].toFixed(1) + '" y="24" text-anchor="middle" font-size="15" font-weight="700" ' +
      'fill="var(--ink)" font-family="Nunito, sans-serif">' + pt[1] + '</text>').join('') +
    '</svg></div>';
}

function drawSeg(q){
  if(q.kind === 'seg' && q.shape === 'ruler'){
    return '<div class="ask">Колко сантиметра е <b>сборът</b> от дължините на отсечките <b>AB</b> и <b>CD</b>?</div>' +
      rulerSvg(q) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'seg'){
    return '<div class="ask">AD = ? см</div>' + segSvg(q) +
      '<div class="given" style="font-size:clamp(15px,4vw,20px)">AB = ' + q.AB + ' см &nbsp; CD = ' +
      q.CD + ' см &nbsp; CB = ' + q.q + ' см</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
}
function eqSeg(q){
  if(q.kind === 'seg' && q.shape === 'ruler') return 'AB ' + q.a + '→' + q.b + ', CD ' + q.c + '→' + q.d + ' → ' + q.ans;
  if(q.kind === 'seg') return 'AB ' + q.AB + ', CD ' + q.CD + ', CB ' + q.q + ' → AD ' + q.ans;
}
function whySeg(q, full){
  if(q.kind === 'seg' && q.shape === 'ruler'){
    if(!full) return 'Дължината не е числото, до което стига отсечката — гледай и откъде тръгва.';
    return 'AB: от ' + q.a + ' до ' + q.b + ' &nbsp;→&nbsp; <b>' + q.AB + '</b>, &nbsp;CD: от ' + q.c +
      ' до ' + q.d + ' &nbsp;→&nbsp; <b>' + q.CD + '</b> &nbsp;→&nbsp; ' + q.AB + ' + ' + q.CD + ' = ' + q.ans;
  }
  if(q.kind === 'seg'){
    if(!full) return 'Отсечките се застъпват — намери първо AC.';
    return 'AC = AB − CB = ' + q.AB + ' − ' + q.q + ' = <b>' + q.p + '</b> &nbsp;→&nbsp; AD = AC + CD = ' +
      q.p + ' + ' + q.CD + ' = ' + q.ans;
  }
}
KIND.seg = { draw:drawSeg, eq:eqSeg, why:whySeg };
