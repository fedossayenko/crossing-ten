// Question kind 'cats': level 42 Котките — Two cats and one box of food between them.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const CATS = [['Ан','Ед'], ['Мими','Рижко'], ['Сивка','Мурко'], ['Пух','Луна']];

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
    return '<div class="ask">Имам две котки — <b>' + q.nm[0] + '</b> и <b>' + q.nm[1] +
      '</b>, които се хранят с една и съща храна. ' + q.nm[0] + ' сама изяжда кутия храна за <span class="num">' +
      q.p + '</span> дни, а ' + q.nm[1] + ' изяжда същата кутия за <span class="num">' + q.q +
      '</span> дни. За колко дни котките ще изядат общо <span class="num">' + q.boxes + '</span> кутии храна?</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + ' <span class="unit">дни</span></div>';
  }
}
function eqCats(q){
  if(q.kind === 'cats') return q.p + ' и ' + q.q + ' дни, ' + q.boxes + ' кутии → ' + q.ans;
}
function whyCats(q, full){
  if(q.kind === 'cats'){
    if(!full) return 'Намери ден, в който и двете котки свършват точно по цяла кутия.';
    const base = q.p * q.q;
    const head = 'за ' + base + ' дни ' + q.nm[0] + ' изяжда ' + q.q + ' кутии, а ' + q.nm[1] + ' — ' +
      q.p + ' &nbsp;→&nbsp; общо ' + (q.p + q.q) + ' кутии';
    return q.k === 1 ? head + ', значи трябват ' + q.ans + ' дни'
      : head + ', а за ' + q.boxes + ' кутии трябва двойно повече &nbsp;→&nbsp; ' + q.ans + ' дни';
  }
}
KIND.cats = { draw:drawCats, eq:eqCats, why:whyCats };
