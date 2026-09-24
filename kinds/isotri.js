// Question kind 'isotri': level 90 Равнобедрени — Triangles on a grid: which have two equal sides.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 1: seven triangles on squared paper, how many are NOT
// isosceles (4). On a grid the tell is the apex: straight over the middle of a flat side,
// or a right angle with two equal legs. Checked by the squared side lengths, never by eye.
const isoSq = (a, b) => (a[0] - b[0])**2 + (a[1] - b[1])**2;
function isoTriIs(t){
  const [p, q, r] = t, x = isoSq(p, q), y = isoSq(q, r), z = isoSq(r, p);
  return x === y || y === z || z === x;
}
// one triangle in a band h high, its flat side on the band's top or bottom edge
function isoTriOne(iso){
  for(;;){
    const h = 1 + rnd(2), b = 2 + rnd(3), x0 = rnd(5 - b), up = rnd(2) === 0;
    const flat = up ? h : 0, tip = up ? 0 : h;
    let ax;
    if(iso){
      const way = rnd(3);
      if(way === 0 && b % 2 === 0) ax = x0 + b / 2;                 // apex over the middle
      else if(way === 1 && b === h) ax = rnd(2) ? x0 : x0 + b;       // right angle, equal legs
      else continue;
    } else ax = rnd(5);
    const t = [[x0, flat], [x0 + b, flat], [ax, tip]];
    if(ax > 4 || isoTriIs(t) !== iso) continue;
    return { t, h };
  }
}
function genIsoTri(){
  for(;;){
    const n = 5 + rnd(3), tris = [];
    for(let i = 0; i < n; i++) tris.push(isoTriOne(Math.random() < 0.45));
    const iso = tris.map(x => isoTriIs(x.t)), not = iso.filter(v => !v).length;
    if(not < 1 || not > n - 1) continue;
    const asksNot = Math.random() < 0.7;
    return {kind:'isotri', tris, iso, asksNot, ans: asksNot ? not : n - not};
  }
}
function isoTriSvg(q){
  const u = 22, W = 5*u;
  let y = 0, grid = '', shapes = '', nums = '';
  q.tris.forEach((x, i) => {
    const pts = x.t.map(([a, b]) => (a*u).toFixed(1) + ',' + ((y + b)*u).toFixed(1)).join(' ');
    shapes += '<polygon points="' + pts + '" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/>';
    nums += '<text x="-10" y="' + ((y + x.h/2)*u + 5).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="800" fill="var(--muted)" font-family="Nunito, sans-serif">' + (i + 1) + '</text>';
    y += x.h;
  });
  for(let k = 0; k <= 5; k++) grid += '<line x1="' + k*u + '" y1="0" x2="' + k*u + '" y2="' + y*u + '"/>';
  for(let k = 0; k <= y; k++) grid += '<line x1="0" y1="' + k*u + '" x2="' + W + '" y2="' + k*u + '"/>';
  return '<div class="fig tall"><svg viewBox="-20 -3 ' + (W + 24) + ' ' + (y*u + 6) + '" role="img" aria-label="' +
    tr('триъгълници върху квадратна мрежа', 'трикутники на квадратній сітці') + '">' +
    '<g stroke="var(--line)" stroke-width="1" stroke-dasharray="3 3">' + grid + '</g>' + shapes + nums + '</svg></div>';
}
function drawIsoTri(q){
  if(q.kind === 'isotri'){
    return '<div class="ask">' + (q.asksNot ? tr('Колко от триъгълниците на чертежа <b>не са</b> равнобедрени?', 'Скільки трикутників на рисунку <b>не є</b> рівнобедреними?')
                                            : tr('Колко от триъгълниците на чертежа са <b>равнобедрени</b>?', 'Скільки трикутників на рисунку є <b>рівнобедреними</b>?')) + '</div>' +
      isoTriSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqIsoTri(q){
  if(q.kind === 'isotri') return tr('равнобедрени: ', 'рівнобедрені: ') + q.iso.map((v, i) => v ? i + 1 : 0).filter(Boolean).join(', ') + ' → ' + q.ans;
}
function whyIsoTri(q, full){
  if(q.kind === 'isotri'){
    if(!full) return tr('Равнобедрен е, когато две от страните му са равни: върхът е точно над средата, или двата катета са еднакво дълги.',
                        'Рівнобедрений — коли дві його сторони рівні: вершина точно над серединою або два катети однакові.');
    const yes = q.iso.map((v, i) => v ? i + 1 : 0).filter(Boolean), no = q.iso.map((v, i) => v ? 0 : i + 1).filter(Boolean);
    return tr('равнобедрени са ', 'рівнобедрені: ') + yes.join(', ') + tr('; не са ', '; ні: ') + no.join(', ') +
      ' &nbsp;→&nbsp; ' + (q.asksNot ? no.length : yes.length);
  }
}
KIND.isotri = { draw:drawIsoTri, eq:eqIsoTri, why:whyIsoTri };
