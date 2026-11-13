// Question kind 'eqrows': levels 340 and 341 — number cards in two boxes, and one swap between two rows, for equal sums.

// Кенгуру 2021, 2 клас, задача 19: the cards 2, 3, 4, 5, 6 go into 2 boxes with the same sum in each, 10 and 10; the box with
// the 4 holds 4 + 6, so the other card there is 6 (shape 'boxes': the cards are drawn so that only one split exists, and the
// box asked about holds exactly two cards). Кенгуру 2026, задача 23: 5 7 11 15 17 above, 1 6 8 14 16 below, sums 55 and 45; one
// token goes down and one comes up so that the rows are equal: the gap 10 is shared, each row moves 5, so the token going down is
// 5 more than the one coming up, 11 and 6 (shape 'swap': one such pair only).
import { KIND, SLOT, popAt, bgList, rnd, shuffle, svgText, tr } from '../js/core.js';
const sum = a => a.reduce((s, v) => s + v, 0);
// every way to split the cards into two boxes with equal sums, as the box that holds cards[0] (as a list of cards)
export function eqSplits(cards){
  const total = sum(cards), out = [];
  if(total % 2) return out;
  for(let m = 1; m < (1 << cards.length) - 1; m++){
    if(!(m & 1)) continue;   // the box with the first card
    const box = cards.filter((_, i) => m & (1 << i));
    if(sum(box) * 2 === total) out.push(box);
  }
  return out;
}
export function genEqBoxes(){
  for(;;){
    const cards = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5).sort((a, b) => a - b), sp = eqSplits(cards);
    if(sp.length !== 1) continue;
    // the box asked about is the one with exactly two cards
    const box = sp[0], other = cards.filter(v => !box.includes(v)), pair = box.length === 2 ? box : other.length === 2 ? other : null;
    if(!pair) continue;
    const k = rnd(2), x = pair[k], ans = pair[1 - k], half = sum(cards) / 2;
    return {kind:'eqrows', shape:'boxes', cards, half, x, pair, rest: cards.filter(v => !pair.includes(v)), traps:[half, sum(cards) - x].filter(v => v !== ans), ans};
  }
}
// pairs (top token, bottom token) whose swap makes the rows equal
export function swapPairs(top, bot){
  const gap = sum(top) - sum(bot), out = [];
  if(gap <= 0 || gap % 2) return out;
  for(const t of top) for(const b of bot) if(t - b === gap / 2) out.push([t, b]);
  return out;
}
export function genEqSwap(){
  for(;;){
    const all = shuffle([...Array(20).keys()].map(v => v + 1)).slice(0, 10), top = all.slice(0, 5).sort((a, b) => a - b), bot = all.slice(5).sort((a, b) => a - b);
    const p = swapPairs(top, bot);
    if(p.length !== 1) continue;
    const gap = sum(top) - sum(bot);
    return {kind:'eqrows', shape:'swap', top, bot, gap, half: gap / 2, pair: p[0], traps:[gap / 2, p[0][1]], ans: p[0][0]};
  }
}
const chips = a => a.map(v => '<span class="circle">' + v + '</span>').join(' ');
function drawEqRows(q){
  if(q.shape === 'boxes')
    return '<div class="ask">' + tr('Картите с числата <span class="num">' + bgList(q.cards) + '</span> са разпределени в 2 кутии така, че сборът на числата във всяка кутия е един и същ. В кутията с картата <span class="num">' + q.x + '</span> има още само една карта. Коя е тя?',
      'Картки з числами <span class="num">' + q.cards.slice(0, -1).join(', ') + ' і ' + q.cards[4] + '</span> розкладено в 2 коробки так, що сума чисел у кожній коробці однакова. У коробці з карткою <span class="num">' + q.x + '</span> є ще лише одна картка. Яка?') + '</div>' +
      '<div class="given">' + chips(q.cards) + '</div><div class="line xl">' + SLOT + '</div>';
  return '<div class="ask">' + tr('Мартина подредила десет жетона на два реда. Тя иска да размени един жетон от горния ред с един жетон от долния ред, така че сумите на числата в двата реда да са равни. Кой жетон от горния ред трябва да премести Мартина долу?',
    'Мартина розклала десять жетонів у два ряди. Вона хоче поміняти один жетон верхнього ряду на один жетон нижнього ряду так, щоб суми чисел в обох рядах стали рівними. Який жетон з верхнього ряду Мартина має перенести вниз?') + '</div>' +
    '<div class="given">' + chips(q.top) + '<br>' + chips(q.bot) + '</div><div class="line xl">' + SLOT + '</div>';
}
function eqEqRows(q){
  return q.shape === 'boxes' ? q.x + ' + ' + q.ans + ' = ' + q.half + ' → ' + q.ans : sum(q.top) + ' − ' + sum(q.bot) + ' = ' + q.gap + ', ' + q.pair[0] + ' − ' + q.pair[1] + ' = ' + q.half + ' → ' + q.ans;
}
// two boxes with their cards
function boxesSvg(q){
  const box = (x, cards) => '<rect x="' + x + '" y="6" width="110" height="46" rx="8" fill="none" stroke="var(--accent)" stroke-width="2"/>' +
    cards.map((v, i) => svgText(x + 55 + (i - (cards.length - 1) / 2) * 30, 36, v, 20, 'var(--ink)', popAt(i + 1 + (x > 10 ? 3 : 0)))).join('') +
    svgText(x + 55, 70, cards.join(' + ') + ' = ' + sum(cards), 13, 'var(--good)', popAt(8));
  return '<svg viewBox="0 0 260 80" style="display:block; width:280px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('две кутии с карти', 'дві коробки з картками') + '">' + box(10, q.pair) + box(140, q.rest) + '</svg>';
}
function whyEqRows(q, full){
  if(q.shape === 'boxes'){
    if(!full) return tr('Събери всички карти. В двете кутии сборът е еднакъв — колко е в една кутия?', 'Додай усі картки. У двох коробках сума однакова — скільки в одній коробці?');
    return boxesSvg(q) + tr('всички карти: ' + q.cards.join(' + ') + ' = ' + sum(q.cards) + '. В едната кутия са ' + q.half + ', в другата също ' + q.half + '. В кутията с ' + q.x + ': ' + q.half + ' − ' + q.x + ' = <b>' + q.ans + '</b>',
      'усі картки: ' + q.cards.join(' + ') + ' = ' + sum(q.cards) + '. В одній коробці ' + q.half + ', в іншій теж ' + q.half + '. У коробці з ' + q.x + ': ' + q.half + ' − ' + q.x + ' = <b>' + q.ans + '</b>');
  }
  if(!full) return tr('Събери числата във всеки ред. Колко е разликата? Когато разменим два жетона, единият ред получава, а другият губи — по колко?', 'Додай числа в кожному ряду. Яка різниця? Коли міняємо два жетони, один ряд отримує, а другий втрачає — по скільки?');
  const [t, b] = q.pair;
  return tr(q.top.join(' + ') + ' = <b>' + sum(q.top) + '</b>, ' + q.bot.join(' + ') + ' = <b>' + sum(q.bot) + '</b>; разликата е ' + q.gap + ' = ' + q.half + ' + ' + q.half + '. Горният ред трябва да загуби ' + q.half + ': жетонът, който слиза, е с ' + q.half + ' повече от този, който се качва — ' + t + ' − ' + b + ' = ' + q.half + '. Слиза <b>' + t + '</b>.',
    q.top.join(' + ') + ' = <b>' + sum(q.top) + '</b>, ' + q.bot.join(' + ') + ' = <b>' + sum(q.bot) + '</b>; різниця ' + q.gap + ' = ' + q.half + ' + ' + q.half + '. Верхній ряд має втратити ' + q.half + ': жетон, що йде вниз, на ' + q.half + ' більший за той, що йде вгору — ' + t + ' − ' + b + ' = ' + q.half + '. Вниз іде <b>' + t + '</b>.');
}
KIND.eqrows = { draw:drawEqRows, eq:eqEqRows, why:whyEqRows };
