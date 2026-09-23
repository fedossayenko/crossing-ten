// Question kind 'cards': level 45 Четири карти — Arrange four digits for the smallest difference.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 20: four cards into two two-digit numbers. Every arrangement is tried.
function genCards(){
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
  if(q.kind === 'cards'){
    return '<div class="ask">' + tr('На 4 карти са записани цифрите <span class="num">' + bgList(q.digits) +
      '</span>, по една на карта. Поставете ги в квадратчетата, така че да се получи <b>най-' +
      (q.smallest ? 'малката' : 'голямата') + '</b> възможна разлика. Коя е тя?',
      'На 4 картках записано цифри <span class="num">' + bgList(q.digits) +
      '</span>, по одній на кожній картці. Розставте їх у клітинки так, щоб вийшла <b>най' +
      (q.smallest ? 'менша' : 'більша') + '</b> можлива різниця. Яка вона?') + '</div>' +
      '<div class="given"><span class="circle">□□</span> − <span class="circle">□□</span></div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCards(q){
  if(q.kind === 'cards') return q.digits.join(', ') + ' → ' + q.wit[0] + ' − ' + q.wit[1] + ' = ' + q.ans;
}
function whyCards(q, full){
  if(q.kind === 'cards'){
    if(!full) return q.smallest ? tr('Числата трябва да са възможно най-близо едно до друго.', 'Числа мають бути якомога ближчими одне до одного.')
                                : tr('Едното число да е възможно най-голямо, другото — най-малко.', 'Одне число має бути якомога більшим, а друге — якомога меншим.');
    return q.wit[0] + ' − ' + q.wit[1] + ' = ' + q.ans;
  }
}
KIND.cards = { draw:drawCards, eq:eqCards, why:whyCards };
