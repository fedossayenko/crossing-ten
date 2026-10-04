// Question kind 'cats': level 42 Котките — Two cats and one box of food between them.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const CATS = [['Ан','Ед'], ['Мими','Рижко'], ['Сивка','Мурко'], ['Пух','Луна']];
const catsUk = {'Мими':'Мімі', 'Рижко':'Рижик'};
const catsNm = n => tr(n, catsUk[n] || n);
// 1 день, 2 дні, 5 днів — forms in the order one, few, many
const catsPl = (n, f) => n + ' ' + f[['one','few','many'].indexOf(new Intl.PluralRules('uk').select(n))];
const CATS_DAY = ['день','дні','днів'], CATS_BOX = ['коробка','коробки','коробок'];

// Задача 17: in p times q days the first cat gets through q boxes and the second p,
// so together they eat p + q boxes in that time.
function genCats(){
  const nm = CATS[rnd(CATS.length)];
  const p = 3 + rnd(3);
  let q = 3 + rnd(3);
  if(q === p) q = p === 5 ? 3 : p + 1;
  const k = Math.random() < 0.3 ? 2 : 1;
  return {kind:'cats', nm, p, q, k, boxes: k*(p + q), ans: k*p*q};
}

function drawCats(q){
  if(q.kind === 'cats'){
    const a = catsNm(q.nm[0]), b = catsNm(q.nm[1]);
    const num = (n, f) => '<span class="num">' + n + '</span> ' + catsPl(n, f).split(' ')[1];
    return '<div class="ask">' + tr('Имам две котки — <b>' + q.nm[0] + '</b> и <b>' + q.nm[1] +
      '</b>, които се хранят с една и съща храна. ' + q.nm[0] + ' сама изяжда кутия храна за <span class="num">' +
      q.p + '</span> дни, а ' + q.nm[1] + ' изяжда същата кутия за <span class="num">' + q.q +
      '</span> дни. За колко дни котките ще изядат общо <span class="num">' + q.boxes + '</span> кутии храна?',
      'У мене дві кішки — <b>' + a + '</b> і <b>' + b + '</b>, які їдять однаковий корм. ' + a +
      ' з’їдає коробку корму за ' + num(q.p, CATS_DAY) + ', а ' + b + ' з’їдає таку саму коробку за ' +
      num(q.q, CATS_DAY) + '. За скільки днів кішки разом з’їдять ' + num(q.boxes, CATS_BOX) + ' корму?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + ' <span class="unit">' + tr('дни', 'днів') + '</span></div>';
  }
}
function eqCats(q){
  if(q.kind === 'cats') return tr(q.p + ' и ' + q.q + ' дни, ' + q.boxes + ' кутии → ',
    q.p + ' і ' + catsPl(q.q, CATS_DAY) + ', ' + catsPl(q.boxes, CATS_BOX) + ' → ') + q.ans;
}
// The picture: a strip of days, a row for each cat, cut into her boxes — Ан's every p days, Ед's
// every q. The boxes fill in one after another until both rows end on the same day, p · q, the first
// day each cat finishes a whole box at once; then what they ate together, and the days it took.
function catsSvg(q){
  const D = q.p * q.q, X0 = 46, u = 220 / D, x = d => (X0 + d * u).toFixed(1);
  let g = '';
  const row = (y, len, n, stroke, fill, name, t0) => {
    g += svgText(X0 / 2 - 2, y + 13, catsNm(name), 11, stroke);
    for(let i = 0; i < n; i++) g += '<g' + popAt(t0 + i * 0.5) + '><rect x="' + (+x(i * len) + 1) + '" y="' + y + '" width="' + (len * u - 2).toFixed(1) + '" height="18" rx="4" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.6"/>' +
      svgText(+x(i * len + len / 2), y + 13, i + 1, 11, stroke) + '</g>';
  };
  row(0, q.p, q.q, 'var(--warm)', 'var(--warmbg)', q.nm[0], 1);
  row(26, q.q, q.p, 'var(--accent)', 'rgba(47,111,143,.14)', q.nm[1], 1.5 + q.q * 0.5);
  for(let d = 0; d <= D; d++) g += '<line x1="' + x(d) + '" y1="48" x2="' + x(d) + '" y2="' + (d % 5 ? 51 : 54) + '" stroke="var(--line)" stroke-width="1.2"/>';
  const t1 = 2.5 + (q.p + q.q) * 0.5;
  g += '<g' + popAt(t1) + '><line x1="' + x(D) + '" y1="-6" x2="' + x(D) + '" y2="52" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 3"/>' +
    svgText(+x(D), 66, D + tr(' дни', ' днів'), 12, 'var(--ink)') + '</g>' + svgText(+x(0), 66, 0, 11, 'var(--muted)');
  const foot = '<tspan fill="var(--warm)">' + q.q + '</tspan> + <tspan fill="var(--accent)">' + q.p + '</tspan> = ' + (q.p + q.q) +
    tr(' кутии за ', ' коробок за ') + D + (q.k === 1 ? '' : ' &nbsp;→&nbsp; ' + D + ' · 2 = ' + q.ans);
  g += svgText(X0 + 110, 92, foot, 14, 'var(--ink)', popAt(t1 + 1));
  return '<svg viewBox="0 -10 ' + (X0 + 252) + ' 112" style="display:block; width:' + Math.round((X0 + 252) * 1.3) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('кутиите на двете котки по дни', 'коробки обох кішок по днях') + '">' + g + '</svg>';
}
function whyCats(q, full){
  if(q.kind === 'cats'){
    if(!full) return tr('Намери ден, в който и двете котки свършват точно по цяла кутия.',
      'Знайди день, коли обидві кішки доїдають рівно по цілій коробці.');
    const base = q.p * q.q;
    const head = tr('за ' + base + ' дни ' + q.nm[0] + ' изяжда ' + q.q + ' кутии, а ' + q.nm[1] + ' — ' +
      q.p + ' &nbsp;→&nbsp; общо ' + (q.p + q.q) + ' кутии',
      'за ' + catsPl(base, CATS_DAY) + ' ' + catsNm(q.nm[0]) + ' з’їдає ' + catsPl(q.q, CATS_BOX) + ', а ' +
      catsNm(q.nm[1]) + ' — ' + q.p + ' &nbsp;→&nbsp; разом ' + catsPl(q.p + q.q, CATS_BOX));
    return (q.k === 1 ? head + tr(', значи трябват ' + q.ans + ' дни', ', отже, потрібно ' + catsPl(q.ans, CATS_DAY))
      : head + tr(', а за ' + q.boxes + ' кутии трябва двойно повече &nbsp;→&nbsp; ' + q.ans + ' дни',
        ', а на ' + catsPl(q.boxes, CATS_BOX) + ' потрібно вдвічі більше &nbsp;→&nbsp; ' + catsPl(q.ans, CATS_DAY))) + catsSvg(q);
  }
}
KIND.cats = { draw:drawCats, eq:eqCats, why:whyCats };
