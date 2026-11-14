// Question kind 'pages': level 108 Страници и листове — Pages come two to a leaf: how many leaves between.

// МБГ Зима 2021, задача 15: how many leaves lie between page 14 and page 25? Each leaf holds an odd
// page and the next even one: 14 is on the leaf with 13, 25 on the leaf with 26, and between them
// sit 15–16, 17–18, …, 23–24 — five leaves.
import { KIND, answerLine, rnd, tr } from '../js/core.js';
export function genPages(){
  for(;;){
    const a = 2 + rnd(40), b = a + 5 + rnd(25), la = Math.ceil(a/2), lb = Math.ceil(b/2);
    if(lb - la - 1 < 2) continue;
    return {kind:'pages', a, b, la, lb, ans: lb - la - 1};
  }
}
// Level 462. Салабашев 2022, задача 11: two tales, the first from the start of page 15 to the end of page 25, the second from
// the start of page 39 to the end of page 48 — how many pages in all? Both end pages are read: 25 − 15 + 1 = 11 and
// 48 − 39 + 1 = 10, 21. The slip is 10 + 9, the end pages not counted.
export function genTales(){
  for(;;){
    const a = 3 + rnd(40), n1 = 6 + rnd(12), c = a + n1 + 3 + rnd(15), n2 = 6 + rnd(12), b = a + n1 - 1, d = c + n2 - 1;
    if(d > 99 || n1 === n2) continue;
    return {kind:'pages', shape:'tales', who: rnd(3), a, b, c, d, n1, n2, traps:[b - a + d - c], ans: n1 + n2};
  }
}
const TALE_WHO = [['Ира', 'Іра'], ['Мила', 'Міла'], ['Ани', 'Ані']];
function drawPages(q){
  if(q.shape === 'tales'){
    const w = TALE_WHO[q.who];
    return '<div class="ask">' + tr(w[0] + ' прочела две приказки от новата си книга. Първата приказка започва в началото на страница <span class="num">' + q.a + '</span> и завършва в края на страница <span class="num">' + q.b + '</span>. Втората приказка започва в началото на страница <span class="num">' + q.c + '</span> и завършва в края на страница <span class="num">' + q.d + '</span>. <b>Общо колко страници е прочела ' + w[0] + '?</b>',
      w[1] + ' прочитала дві казки зі своєї нової книжки. Перша казка починається на початку сторінки <span class="num">' + q.a + '</span> і закінчується в кінці сторінки <span class="num">' + q.b + '</span>. Друга казка починається на початку сторінки <span class="num">' + q.c + '</span> і закінчується в кінці сторінки <span class="num">' + q.d + '</span>. <b>Скільки всього сторінок прочитала ' + w[1] + '?</b>') + '</div>' + answerLine('xl');
  }
  return '<div class="ask">' + tr('Колко <b>листа</b> има между страница <span class="num">' + q.a + '</span> и страница <span class="num">' + q.b + '</span> на една книга?',
    'Скільки <b>аркушів</b> між сторінкою <span class="num">' + q.a + '</span> і сторінкою <span class="num">' + q.b + '</span> у книжці?') + '</div>' +
    '<div class="note">' + tr('Всеки лист има две страници: 1 и 2, 3 и 4, …', 'Кожен аркуш має дві сторінки: 1 і 2, 3 і 4, …') + '</div>' +
    answerLine('xl');
}
const pagesLeaf = n => n % 2 ? n + '–' + (n + 1) : (n - 1) + '–' + n;
function eqPages(q){
  if(q.shape === 'tales') return q.a + '…' + q.b + ': ' + q.n1 + ', ' + q.c + '…' + q.d + ': ' + q.n2 + ' → ' + q.n1 + ' + ' + q.n2 + ' = ' + q.ans;
  return pagesLeaf(q.a) + ' … ' + pagesLeaf(q.b) + ' → ' + q.ans;
}
function whyPages(q, full){
  if(q.shape === 'tales'){
    if(!full) return tr('Първата и последната страница на приказката също са прочетени. Преброй страниците на всяка приказка поотделно.', 'Перша й остання сторінки казки теж прочитані. Порахуй сторінки кожної казки окремо.');
    return q.b + ' − ' + q.a + ' = ' + (q.b - q.a) + tr(', но е прочетена и страница ' + q.a + ': ', ', але прочитана й сторінка ' + q.a + ': ') + (q.b - q.a) + ' + 1 = <b>' + q.n1 + '</b>, &nbsp;' + q.d + ' − ' + q.c + ' + 1 = <b>' + q.n2 + '</b> &nbsp;→&nbsp; ' + q.n1 + ' + ' + q.n2 + ' = ' + q.ans;
  }
  if(!full) return tr('На кой лист е всяка от двете страници? Броят се само листовете между тях.', 'На якому аркуші кожна з двох сторінок? Рахуються лише аркуші між ними.');
  const first = q.la*2 + 1, last = (q.lb - 1)*2;
  return q.a + tr(' е на листа ', ' на аркуші ') + pagesLeaf(q.a) + ', ' + q.b + tr(' — на листа ', ' — на аркуші ') + pagesLeaf(q.b) + ' &nbsp;→&nbsp; ' + tr('между тях: ', 'між ними: ') +
    first + '–' + (first + 1) + ', …, ' + (last - 1) + '–' + last + ' &nbsp;→&nbsp; ' + q.ans;
}
KIND.pages = { draw:drawPages, eq:eqPages, why:whyPages };
