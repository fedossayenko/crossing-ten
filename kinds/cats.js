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
function whyCats(q, full){
  if(q.kind === 'cats'){
    if(!full) return tr('Намери ден, в който и двете котки свършват точно по цяла кутия.',
      'Знайди день, коли обидві кішки доїдають рівно по цілій коробці.');
    const base = q.p * q.q;
    const head = tr('за ' + base + ' дни ' + q.nm[0] + ' изяжда ' + q.q + ' кутии, а ' + q.nm[1] + ' — ' +
      q.p + ' &nbsp;→&nbsp; общо ' + (q.p + q.q) + ' кутии',
      'за ' + catsPl(base, CATS_DAY) + ' ' + catsNm(q.nm[0]) + ' з’їдає ' + catsPl(q.q, CATS_BOX) + ', а ' +
      catsNm(q.nm[1]) + ' — ' + q.p + ' &nbsp;→&nbsp; разом ' + catsPl(q.p + q.q, CATS_BOX));
    return q.k === 1 ? head + tr(', значи трябват ' + q.ans + ' дни', ', отже, потрібно ' + catsPl(q.ans, CATS_DAY))
      : head + tr(', а за ' + q.boxes + ' кутии трябва двойно повече &nbsp;→&nbsp; ' + q.ans + ' дни',
        ', а на ' + catsPl(q.boxes, CATS_BOX) + ' потрібно вдвічі більше &nbsp;→&nbsp; ' + catsPl(q.ans, CATS_DAY));
  }
}
KIND.cats = { draw:drawCats, eq:eqCats, why:whyCats };
