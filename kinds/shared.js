// Question kind 'shared': level 22 Обща страна — Two figures share an edge — what it costs the outline.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// A square with a rectangle standing on it, corners named the way the question names them.
function stackSvg(q){
  const u = 150 / (q.a + q.h), W = q.a * u, hh = q.h * u, aa = q.a * u;
  const lab = (x, y, txt) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
    '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--muted)" font-family="Nunito, sans-serif">' +
    txt + '</text>';
  return '<div class="fig"><svg viewBox="-24 -22 ' + (W + 48).toFixed(1) + ' ' + (hh + aa + 44).toFixed(1) +
    '" role="img" aria-label="квадрат с правоъгълник върху него">' +
    '<g stroke="var(--ink)" stroke-width="2.2" fill="none" stroke-linejoin="round">' +
    '<rect x="0" y="0" width="' + W.toFixed(1) + '" height="' + (hh + aa).toFixed(1) + '"/>' +
    '<line x1="0" y1="' + hh.toFixed(1) + '" x2="' + W.toFixed(1) + '" y2="' + hh.toFixed(1) + '"/></g>' +
    lab(-12, 4, 'F') + lab(W + 12, 4, 'E') +
    lab(-12, hh + 5, 'D') + lab(W + 12, hh + 5, 'C') +
    lab(-12, hh + aa + 5, 'A') + lab(W + 12, hh + aa + 5, 'B') + '</svg></div>';
}
// Задача 14: a square with a rectangle sitting on it. The tall rectangle beats the wide
// one by the square's two upright sides — the height of the piece on top cancels out.
function genStack(){
  const a = 2 + rnd(9), h = 1 + rnd(9);
  return {kind:'shared', shape:2, a, h, d: 2*a, ans: 4*a};
}
function genShared(){
  if(Math.random() < 0.3) return genStack();
  if(Math.random() < 0.4){
    // Задача 18: a triangle cut off a square along one whole side. The boundary loses
    // that side and gains the triangle's other two.
    const c = 3 + rnd(6);
    const p = 2*c + 1 + rnd(12);
    return {kind:'shared', shape:1, c, P: 4*c, p, ans: 4*c - c + (p - c)};
  }
  for(;;){
    const c = 2 + rnd(8);
    const P = 12 + rnd(18);
    const tot = P + 2*c;
    const p1 = Math.floor(tot/2) - rnd(4);
    const p2 = tot - p1;
    // each half must be a possible triangle: its other two sides together beat the cut
    if(p1 <= 2*c || p2 <= 2*c || p1 >= P + c || p2 >= P + c) continue;
    return {kind:'shared', shape:0, P, p1, p2, ans: c};
  }
}

function drawShared(q){
  if(q.kind === 'shared' && q.shape === 2){
    return '<div class="ask">Квадрат <b>ABCD</b> и правоъгълник <b>DCEF</b> имат обща страна <b>DC</b>. ' +
      'Обиколката на правоъгълника <b>ABEF</b> е по-голяма от обиколката на правоъгълника <b>DCEF</b> с <span class="num">' +
      q.d + '</span> см. Колко сантиметра е обиколката на <b>квадрата ABCD</b>?</div>' +
      stackSvg(q) +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'shared' && q.shape === 1){
    return '<div class="ask">От квадрат с обиколка <span class="num">' + q.P +
      '</span> см е изрязан триъгълник с обиколка <span class="num">' + q.p +
      '</span> см, който има обща страна с квадрата. Колко см е обиколката на получената фигура?</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'shared'){
    return '<div class="ask">Триъгълник с обиколка <span class="num">' + q.P +
      '</span> см разрязали на два триъгълника с обиколки <span class="num">' + q.p1 +
      '</span> см и <span class="num">' + q.p2 + '</span> см. Колко сантиметра е общата им страна?</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
}
function eqShared(q){
  if(q.kind === 'shared' && q.shape === 2) return 'разлика ' + q.d + ' → страна ' + q.a + ' → ' + q.ans;
  if(q.kind === 'shared') return q.shape === 1
    ? 'квадрат ' + q.P + ', триъгълник ' + q.p + ' → ' + q.ans
    : q.p1 + ' + ' + q.p2 + ' − ' + q.P + ' = ' + (2*q.ans) + ' → ' + q.ans;
}
function whyShared(q, full){
  if(q.kind === 'shared' && q.shape === 2){
    if(!full) return 'Височината на горния правоъгълник влиза и в двете обиколки — тя отпада.';
    return 'ABEF е по-висок от DCEF точно с AD, и то от двете страни &nbsp;→&nbsp; ' + q.d + ' : 2 = <b>' +
      q.a + '</b> е страната на квадрата &nbsp;→&nbsp; 4 × ' + q.a + ' = ' + q.ans;
  }
  if(q.kind === 'shared' && q.shape === 1){
    if(!full) return 'Общата страна изчезва, а другите две се появяват.';
    return 'страната на квадрата е <b>' + q.c + '</b> см &nbsp;→&nbsp; другите две страни на триъгълника са ' +
      q.p + ' − ' + q.c + ' = <b>' + (q.p - q.c) + '</b> &nbsp;→&nbsp; ' + q.P + ' − ' + q.c + ' + ' +
      (q.p - q.c) + ' = ' + q.ans;
  }
  if(q.kind === 'shared'){
    if(!full) return 'Общата страна е в двете обиколки.';
    return q.p1 + ' + ' + q.p2 + ' = <b>' + (q.p1+q.p2) + '</b>, а обиколката е ' + q.P +
      ' &nbsp;→&nbsp; ' + (q.p1+q.p2) + ' − ' + q.P + ' = ' + (2*q.ans) +
      ', това е общата страна <b>два пъти</b> &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.shared = { draw:drawShared, eq:eqShared, why:whyShared };
