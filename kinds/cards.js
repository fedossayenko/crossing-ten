// Question kind 'cards': level 45 Четири карти — Arrange four digits for the smallest difference.

// Задача 20: four cards into two two-digit numbers. Every arrangement is tried.
import { KIND, SLOT, bgList, popAt, shuffle, svgText, tr } from '../js/core.js';
export function genCards(){
  const digits = shuffle([1,2,3,4,5,6,7,8,9]).slice(0, 4);
  const smallest = Math.random() < 0.7;
  let best = null, wit = null;
  (function walk(left, cur){
    if(!left.length){
      const a = cur[0]*10 + cur[1], b = cur[2]*10 + cur[3], d = a - b;
      if(d > 0 && (best === null || (smallest ? d < best : d > best))){ best = d; wit = [a, b]; }
      return;
    }
    left.forEach((v, i) => walk(left.filter((_, j) => j !== i), cur.concat(v)));
  })(digits, []);
  return {kind:'cards', digits: digits.slice().sort((x, y) => x - y), smallest, wit, ans: best};
}

function drawCards(q){
  return '<div class="ask">' + tr('На 4 карти са записани цифрите <span class="num">' + bgList(q.digits) +
    '</span>, по една на карта. Поставете ги в квадратчетата, така че да се получи <b>най-' +
    (q.smallest ? 'малката' : 'голямата') + '</b> възможна разлика. Коя е тя?',
    'На 4 картках записано цифри <span class="num">' + bgList(q.digits) +
    '</span>, по одній на кожній картці. Розставте їх у клітинки так, щоб вийшла <b>най' +
    (q.smallest ? 'менша' : 'більша') + '</b> можлива різниця. Яка вона?') + '</div>' +
    '<div class="given"><span class="circle">□□</span> − <span class="circle">□□</span></div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqCards(q){
  return q.digits.join(', ') + ' → ' + q.wit[0] + ' − ' + q.wit[1] + ' = ' + q.ans;
}
function whyCards(q, full){
  if(!full) return q.smallest ? tr('Числата трябва да са възможно най-близо едно до друго.', 'Числа мають бути якомога ближчими одне до одного.')
                              : tr('Едното число да е възможно най-голямо, другото — най-малко.', 'Одне число має бути якомога більшим, а друге — якомога меншим.');
  const [a, b] = q.wit, T = v => Math.floor(v / 10), O = v => v % 10;
  // the tens weigh ten times the ones, so they are placed first (checked over every four digits, both ways)
  const how = q.smallest
    ? tr('десетиците тежат най-много — те да са най-близките цифри: <b>' + T(a) + '</b> и <b>' + T(b) + '</b>; от другите две по-голямото число взима по-малката (' + O(a) + '), по-малкото — по-голямата (' + O(b) + ')',
         'десятки важать найбільше — це мають бути найближчі цифри: <b>' + T(a) + '</b> і <b>' + T(b) + '</b>; з двох інших більше число бере меншу (' + O(a) + '), а менше — більшу (' + O(b) + ')')
    : tr('десетиците тежат най-много: голямото число от двете най-големи цифри, по-голямата отпред — <b>' + a + '</b>; малкото от двете най-малки, по-малката отпред — <b>' + b + '</b>',
         'десятки важать найбільше: більше число з двох найбільших цифр, більша попереду — <b>' + a + '</b>; менше з двох найменших, менша попереду — <b>' + b + '</b>');
  return how + ' &nbsp;→&nbsp; ' + a + ' − ' + b + ' = ' + q.ans + cardsSvg(q);
}
// The four cards in the boxes of □□ − □□, the tens cards blue with Д (десетици) over them, the ones cards plain with Е.
function cardsSvg(q){
  const [a, b] = q.wit, w = 30, h = 40, at = [0, 34, 98, 132];
  const digits = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
  let g = '';
  digits.forEach((d, i) => { const ten = i % 2 === 0, x = at[i];
    g += '<g' + popAt(1 + (ten ? 0 : 2) + (i > 1 ? 1 : 0)) + '>' + svgText(x + w/2, -6, ten ? 'Д' : tr('Е', 'О'), 13, ten ? 'var(--accent)' : 'var(--muted)') +
      '<rect x="' + x + '" y="0" width="' + w + '" height="' + h + '" rx="6" fill="' + (ten ? 'var(--accentbg)' : 'none') + '" stroke="' + (ten ? 'var(--accent)' : 'var(--muted)') + '" stroke-width="' + (ten ? 2 : 1.5) + '"/>' +
      svgText(x + w/2, 28, d, 22, 'var(--ink)') + '</g>'; });
  g += svgText(81, 28, '−', 22, 'var(--ink)') + svgText(198, 28, '= ' + q.ans, 22, 'var(--ink)', popAt(6));
  return '<svg viewBox="-4 -22 240 68" style="display:block; width:220px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('картите в квадратчетата', 'картки в клітинках') + '">' + g + '</svg>';
}
KIND.cards = { draw:drawCards, eq:eqCards, why:whyCards };
