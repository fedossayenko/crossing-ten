// Question kind 'flipcards': level 485 Две картички — Two double-sided digit cards, turned freely: how many two-digit numbers.

// Салабашев 2024, 2 клас, задача 14: one card has 3 on one side and 4 on the other, another 5 and 6. The cards may be turned and flipped.
// How many two-digit numbers can be written with the two cards? Turned upside down a 6 reads 9, so the second card gives 5, 6 or 9 and
// the first 3 or 4: 35, 36, 39, 45, 46, 49 and the other way round 53, 63, 93, 54, 64, 94 — 6 + 6 = 12 (not 8, the answer that forgets the
// turn). The faces are digits that mean nothing turned (1, 3, 4, 5, 7, 8) but for one face, a 6 or a 9, which turned reads the other.
import { KIND, answerLine, popAt, rnd, shuffle, svgFrame, svgText, tr } from '../js/core.js';
const PLAIN = [1, 3, 4, 5, 7, 8];
// the digits a face can be read as, the card turned any way
const reads = f => f === 6 ? [6, 9] : f === 9 ? [9, 6] : [f];
const cardReads = c => [...new Set(c.flatMap(reads))];
export function genFlipCards(){
  const faces = shuffle(PLAIN.slice()).slice(0, 3), special = Math.random() < 0.7 ? 6 : 9, at = rnd(4), all = faces.slice();
  all.splice(at, 0, special);
  const cards = [all.slice(0, 2), all.slice(2, 4)];
  return {kind:'flipcards', cards, traps:[8], ans: flipNumbers(cards).length};
}
// every two-digit number the two cards write: a card for the tens, the other for the ones, each read any way up
export function flipNumbers(cards){
  const out = new Set();
  [[0, 1], [1, 0]].forEach(([t, o]) => cardReads(cards[t]).forEach(a => cardReads(cards[o]).forEach(b => out.add(10*a + b))));
  return [...out].sort((x, y) => x - y);
}
const side = (n, uk) => uk ? ['одного', 'другого'][n] : ['едната', 'другата'][n];
function cardsSvg(q){
  const S = 44, G = 14, cw = 2*S + 22, w = 2*cw + 30;
  let g = '';
  q.cards.forEach((c, ci) => c.forEach((f, i) => {
    const x = 6 + ci*(cw + 18) + i*(S + 22), y = 6;
    g += '<g' + popAt(ci*0.5 + i*0.2) + '><rect x="' + x + '" y="' + y + '" width="' + S + '" height="' + S + '" rx="8" fill="var(--solid)" stroke="var(--ink)" stroke-width="2"/>' + svgText(x + S/2, y + 32, f, 28, 'var(--ink)') + '</g>';
    if(!i) g += svgText(x + S + 11, y + 29, '⇄', 18, 'var(--muted)');
  }));
  return svgFrame('0 0 ' + (w + G) + ' 56', Math.round((w + G)*1.3), tr('двете картички с двете им страни', 'дві картки з двома боками')) + g + '</svg>';
}
function drawFlip(q){
  const [a, b] = q.cards;
  return '<div class="ask">' + tr('На една картичка от ' + side(0) + ' страна пише <span class="num">' + a[0] + '</span>, а от ' + side(1) + ' – <span class="num">' + a[1] + '</span>. На друга картичка от ' + side(0) + ' страна пише <span class="num">' + b[0] + '</span>, а от ' + side(1) + ' – <span class="num">' + b[1] + '</span>. Картичките могат да се въртят и обръщат. Колко от <b>двуцифрените числа</b> могат да се запишат с тези две картички?',
    'На одній картці з ' + side(0, true) + ' боку написано <span class="num">' + a[0] + '</span>, а з ' + side(1, true) + ' – <span class="num">' + a[1] + '</span>. На іншій картці з ' + side(0, true) + ' боку написано <span class="num">' + b[0] + '</span>, а з ' + side(1, true) + ' – <span class="num">' + b[1] + '</span>. Картки можна обертати і перевертати. Скільки <b>двоцифрових чисел</b> можна записати цими двома картками?') + '</div>' +
    cardsSvg(q) + answerLine('xl');
}
// the numbers with the first card for the tens, and the other way round
const halves = q => { const [a, b] = q.cards.map(cardReads), x = [], y = []; a.forEach(s => b.forEach(t => { x.push(10*s + t); y.push(10*t + s); })); return [x.sort((m, n) => m - n), y.sort((m, n) => m - n)]; };
function eqFlip(q){ const [x, y] = halves(q); return x.length + ' + ' + y.length + ' = ' + q.ans; }
function whyFlip(q, full){
  if(!full) return tr('Картичките могат и да се въртят: коя от цифрите става друга цифра, ако я обърнеш наопаки?', 'Картки можна й обертати: яка з цифр стає іншою цифрою, якщо її перевернути?');
  const [a, b] = q.cards.map(cardReads), [x, y] = halves(q), sp = q.cards.flat().find(f => f === 6 || f === 9);
  return tr('първата картичка: ' + a.join(', ') + '; втората: ' + b.join(', ') + ' (обърнато ' + sp + ' е ' + (sp === 6 ? 9 : 6) + '); първата отпред: ' + x.join(', ') + ' (' + x.length + '); втората отпред: ' + y.join(', ') + ' (' + y.length + ')',
    'перша картка: ' + a.join(', ') + '; друга: ' + b.join(', ') + ' (перевернута ' + sp + ' — це ' + (sp === 6 ? 9 : 6) + '); перша попереду: ' + x.join(', ') + ' (' + x.length + '); друга попереду: ' + y.join(', ') + ' (' + y.length + ')') +
    ' &nbsp;→&nbsp; <b>' + x.length + ' + ' + y.length + ' = ' + q.ans + '</b>';
}
KIND.flipcards = { draw:drawFlip, eq:eqFlip, why:whyFlip };
