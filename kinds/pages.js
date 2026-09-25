// Question kind 'pages': level 108 Страници и листове — Pages come two to a leaf: how many leaves between.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2021, задача 15: how many leaves lie between page 14 and page 25? Each leaf holds an odd
// page and the next even one: 14 is on the leaf with 13, 25 on the leaf with 26, and between them
// sit 15–16, 17–18, …, 23–24 — five leaves.
function genPages(){
  for(;;){
    const a = 2 + rnd(40), b = a + 5 + rnd(25), la = Math.ceil(a/2), lb = Math.ceil(b/2);
    if(lb - la - 1 < 2) continue;
    return {kind:'pages', a, b, la, lb, ans: lb - la - 1};
  }
}
function drawPages(q){
  if(q.kind === 'pages'){
    return '<div class="ask">' + tr('Колко <b>листа</b> има между страница <span class="num">' + q.a + '</span> и страница <span class="num">' + q.b + '</span> на една книга?',
      'Скільки <b>аркушів</b> між сторінкою <span class="num">' + q.a + '</span> і сторінкою <span class="num">' + q.b + '</span> у книжці?') + '</div>' +
      '<div class="note">' + tr('Всеки лист има две страници: 1 и 2, 3 и 4, …', 'Кожен аркуш має дві сторінки: 1 і 2, 3 і 4, …') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
const pagesLeaf = n => n % 2 ? n + '–' + (n + 1) : (n - 1) + '–' + n;
function eqPages(q){
  if(q.kind === 'pages') return pagesLeaf(q.a) + ' … ' + pagesLeaf(q.b) + ' → ' + q.ans;
}
function whyPages(q, full){
  if(q.kind === 'pages'){
    if(!full) return tr('На кой лист е всяка от двете страници? Броят се само листовете между тях.', 'На якому аркуші кожна з двох сторінок? Рахуються лише аркуші між ними.');
    const first = q.la*2 + 1, last = (q.lb - 1)*2;
    return q.a + tr(' е на листа ', ' на аркуші ') + pagesLeaf(q.a) + ', ' + q.b + tr(' — на листа ', ' — на аркуші ') + pagesLeaf(q.b) + ' &nbsp;→&nbsp; ' + tr('между тях: ', 'між ними: ') +
      first + '–' + (first + 1) + ', …, ' + (last - 1) + '–' + last + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.pages = { draw:drawPages, eq:eqPages, why:whyPages };
