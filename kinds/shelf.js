// Question kind 'shelf': level 298 От другия край — A place in a row, counted from the other end.

// Аз и числата 2025, задача 10: 28 books on a shelf, «Пипи дългото чорапче» the fifteenth from the left — which from the
// right? To its left are 14 others, so to its right are 28 − 15 = 13, and it comes after them: 13 + 1 = 14. The slips are
// one off either way (13, or 15 — the place it had). The other way round (shape 'total'): the fifteenth from the left
// and the fourteenth from the right — 15 + 14 counts that book twice, so 28.
import { KIND, SLOT, popAt, rnd, svgText, tr, ukN } from '../js/core.js';
// feminine ordinals (a book, a girl), 1–39
const SH_BG = ['', 'първа', 'втора', 'трета', 'четвърта', 'пета', 'шеста', 'седма', 'осма', 'девета', 'десета', 'единадесета', 'дванадесета', 'тринадесета', 'четиринадесета',
  'петнадесета', 'шестнадесета', 'седемнадесета', 'осемнадесета', 'деветнадесета'];
const SH_UK = ['', 'перша', 'друга', 'третя', 'четверта', 'п’ята', 'шоста', 'сьома', 'восьма', 'дев’ята', 'десята', 'одинадцята', 'дванадцята', 'тринадцята', 'чотирнадцята',
  'п’ятнадцята', 'шістнадцята', 'сімнадцята', 'вісімнадцята', 'дев’ятнадцята'];
export const shelfOrdBg = n => n < 20 ? SH_BG[n] : n % 10 === 0 ? ['', '', 'двадесета', 'тридесета'][n / 10] : ['', '', 'двадесет', 'тридесет'][Math.floor(n / 10)] + ' и ' + SH_BG[n % 10];
export const shelfOrdUk = n => n < 20 ? SH_UK[n] : n % 10 === 0 ? ['', '', 'двадцята', 'тридцята'][n / 10] : ['', '', 'двадцять', 'тридцять'][Math.floor(n / 10)] + ' ' + SH_UK[n % 10];
/** @type {[string, string][]} */
const SH_BOOKS = [['Пипи дългото чорапче', 'Пеппі Довгапанчоха'], ['Малкият принц', 'Маленький принц'], ['Хайди', 'Гайді'], ['Мечо Пух', 'Вінні-Пух']];
/** @type {[string, string][]} */
const SH_GIRLS = [['Мая', 'Мая'], ['Ния', 'Нія'], ['Ели', 'Елі'], ['Рая', 'Рая']];
export function genShelf(){
  for(;;){
    const story = rnd(2), who = rnd(4), total = Math.random() < 0.35;
    if(total){
      const k = 3 + rnd(20), m = 3 + rnd(20);
      if(k === m) continue;
      return {kind:'shelf', shape:'total', story, who, k, m, traps:[k + m, k + m - 2], ans: k + m - 1};
    }
    const n = 10 + rnd(30), k = 2 + rnd(n - 2);
    if(2*k === n + 1) continue;                 // the middle one is the same place from both ends
    return {kind:'shelf', shape:'pos', story, who, n, k, traps:[n - k, n - k + 2, k], ans: n - k + 1};
  }
}
const shNum = n => '<span class="num">' + n + '</span>';
const shOrd = n => tr(shelfOrdBg(n), shelfOrdUk(n));
function drawShelf(q){
  const B = SH_BOOKS[q.who], G = SH_GIRLS[q.who];
  let ask;
  if(q.story === 0){
    ask = q.shape === 'total'
      ? tr('Ники подредил книги на един рафт в библиотеката. Книгата „' + B[0] + '“ е ' + shOrd(q.k) + ' отляво надясно и ' + shOrd(q.m) + ' отдясно наляво. <b>Колко книги има на рафта?</b>',
        'Нікі поставив книжки на полицю в бібліотеці. Книжка «' + B[1] + '» — ' + shOrd(q.k) + ' зліва направо і ' + shOrd(q.m) + ' справа наліво. <b>Скільки книжок на полиці?</b>')
      : tr('Ники подредил ' + shNum(q.n) + ' книги на един рафт в библиотеката. Преброил, че книгата „' + B[0] + '“ е ' + shOrd(q.k) + ' отляво надясно. <b>На кое място е тази книга, ако се брои отдясно наляво?</b>',
        'Нікі поставив ' + ukN(q.n, 'книжку', 'книжки', 'книжок').replace(/^\d+/, shNum(q.n)) + ' на полицю в бібліотеці. Він порахував, що книжка «' + B[1] + '» — ' + shOrd(q.k) + ' зліва направо. <b>Яка вона за рахунком, якщо рахувати справа наліво?</b>');
  } else {
    ask = q.shape === 'total'
      ? tr(G[0] + ' стои в една редица. Тя е ' + shOrd(q.k) + ' отляво надясно и ' + shOrd(q.m) + ' отдясно наляво. <b>Колко деца има в редицата?</b>',
        G[1] + ' стоїть у ряду. Вона — ' + shOrd(q.k) + ' зліва направо і ' + shOrd(q.m) + ' справа наліво. <b>Скільки дітей у ряду?</b>')
      : tr('В една редица стоят ' + shNum(q.n) + ' деца. ' + G[0] + ' е ' + shOrd(q.k) + ' отляво надясно. <b>Коя по ред е тя, ако се брои отдясно наляво?</b>',
        'У ряду стоїть ' + ukN(q.n, 'дитина', 'дитини', 'дітей').replace(/^\d+/, shNum(q.n)) + '. ' + G[1] + ' — ' + shOrd(q.k) + ' зліва направо. <b>Яка вона за рахунком, якщо рахувати справа наліво?</b>');
  }
  return '<div class="ask">' + ask + '</div><div class="line xl">' + SLOT + '</div>';
}
function eqShelf(q){
  return q.shape === 'total' ? q.k + ' + ' + q.m + ' − 1 = ' + q.ans : q.n + ' − ' + q.k + ' + 1 = ' + q.ans;
}
// the row: the one asked about in the middle colour, the others to its left and to its right counted above them
function shelfSvg(q){
  const n = q.shape === 'total' ? q.ans : q.n, k = q.k, w = Math.min(9, 280 / n), x0 = 150 - n*w/2;
  let g = '';
  for(let i = 1; i <= n; i++) g += '<rect x="' + (x0 + (i - 1)*w + 0.8).toFixed(1) + '" y="34" width="' + (w - 1.6).toFixed(1) + '" height="30" rx="1.5" fill="' + (i === k ? 'var(--warm)' : i < k ? 'none' : 'var(--accentbg)') + '" stroke="' + (i === k ? 'var(--warm)' : 'var(--line)') + '"/>';
  const left = k - 1, right = n - k, mid = (a, b) => (x0 + (a - 1)*w + (b - a + 1)*w/2).toFixed(1);
  if(left) g += svgText(mid(1, k - 1), 24, left, 13, 'var(--muted)', popAt(1));
  if(right) g += svgText(mid(k + 1, n), 24, right, 13, 'var(--accent)', popAt(2));
  g += svgText(mid(k, k), 82, '★', 13, 'var(--warm)', popAt(3));
  return '<svg viewBox="0 0 300 90" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('редицата, броена от двата края', 'ряд, порахований з обох кінців') + '">' + g + '</svg>';
}
function whyShelf(q, full){
  if(q.shape === 'total'){
    if(!full) return tr('Като събереш двете места, кое си броил два пъти?', 'Коли додаси обидва місця, що ти порахував двічі?');
    return shelfSvg(q) + tr('отляво до нея включително: ' + q.k + ', отдясно до нея включително: ' + q.m + ' — тя е броена два пъти', 'зліва до неї включно: ' + q.k + ', справа до неї включно: ' + q.m + ' — її пораховано двічі') +
      ' &nbsp;→&nbsp; ' + q.k + ' + ' + q.m + ' − 1 = ' + q.ans;
  }
  if(!full) return tr('Колко са отдясно на нея? Тя самата идва веднага след тях.', 'Скільки праворуч від неї? Вона сама йде одразу після них.');
  return shelfSvg(q) + tr('отдясно на нея са всички без нея и без тези отляво: ', 'праворуч від неї — усі, крім неї і тих, що ліворуч: ') + q.n + ' − ' + q.k + ' = <b>' + (q.n - q.k) + '</b> &nbsp;→&nbsp; ' +
    tr('тя идва след тях: ', 'вона йде після них: ') + (q.n - q.k) + ' + 1 = ' + q.ans;
}
KIND.shelf = { draw:drawShelf, eq:eqShelf, why:whyShelf };
