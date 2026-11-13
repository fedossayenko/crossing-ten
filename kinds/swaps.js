// Question kind 'swaps': level 313 Размени книгите — Three books in a row, two swaps named by colour: the row afterwards.

// Кенгуру 2025, задача 15: white, black, grey. Swap the white and the grey book, then the grey and the black. The swaps are by
// colour, not by place: white black grey → grey black white → black grey white. The answer is a picture of the row, so the kind
// brings its own А–Д. The slips offered are the real ones: only one swap, the two swaps the other way round, and swapping the
// places named by number instead of the colours.
import { KIND, shuffle, tr } from '../js/core.js';
// [Bulgarian, with «the», Ukrainian, Ukrainian accusative, colour]
/** @type {[string, string, string, string, string][]} */
const SW_COL = [['бяла', 'бялата', 'біла', 'білу', '#ffffff'], ['черна', 'черната', 'чорна', 'чорну', '#1b1b1b'], ['сива', 'сивата', 'сіра', 'сіру', '#b4b4b4'],
  ['червена', 'червената', 'червона', 'червону', '#d9483b'], ['синя', 'синята', 'синя', 'синю', '#3b6fd9'], ['зелена', 'зелената', 'зелена', 'зелену', '#4aa84a'], ['жълта', 'жълтата', 'жовта', 'жовту', '#eec12e']];
const PAIRS = [[0, 1], [1, 0], [0, 2], [2, 0], [1, 2], [2, 1]];   // places, named in either order
/** swap the two books of these colours */
const swapCol = (row, x, y) => row.map(c => c === x ? y : c === y ? x : c);
/** swap the two places */
const swapAt = (row, i, j) => { const r = row.slice(); r[i] = row[j]; r[j] = row[i]; return r; };
export function genSwaps(){
  for(;;){
    const cols = shuffle([0, 1, 2, 3, 4, 5, 6]).slice(0, 3), s1 = PAIRS[Math.floor(Math.random() * 6)], s2 = PAIRS[Math.floor(Math.random() * 6)];
    if(s1.slice().sort().join() === s2.slice().sort().join()) continue;
    const row0 = cols, pair = p => p.map(i => cols[i]);   // a swap named by two of the books
    const row1 = swapCol(row0, ...pair(s1)), row2 = swapCol(row1, ...pair(s2));
    const slips = [row1, swapCol(swapCol(row0, ...pair(s2)), ...pair(s1)), swapAt(swapAt(row0, ...s1), ...s2), swapAt(row0, ...s2)];
    const key = r => r.join();
    const wrong = [];
    slips.concat(shuffle([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(p => p.map(i => cols[i])))).forEach(r => {
      if(key(r) !== key(row2) && !wrong.some(w => key(w) === key(r)) && wrong.length < 4) wrong.push(r);
    });
    const rows = shuffle(wrong.concat([row2])), pick = rows.findIndex(r => key(r) === key(row2));
    return {kind:'swaps', cols, s1, s2, row1, row2, options: rows.map((r, id) => ({ id, v: id, text: [books(r, 84), books(r, 84)] })), pick, own: true, ans: pick};
  }
}
/** a row of books as a picture */
function books(row, w){
  const bw = w / 3.3;
  return '<svg viewBox="0 0 ' + w + ' 52" width="' + w + '" height="52" role="img" aria-label="' + row.map(c => tr(SW_COL[c][0], SW_COL[c][2])).join(', ') + '">' +
    row.map((c, i) => '<rect x="' + (2 + i*(bw + 2)).toFixed(1) + '" y="4" width="' + bw.toFixed(1) + '" height="44" rx="2" fill="' + SW_COL[c][4] + '" stroke="#444" stroke-width="1.5"/>').join('') + '</svg>';
}
const name = (c, i) => tr(SW_COL[c][i], SW_COL[c][i + 2]);
function drawSwaps(q){
  const [a, b, c] = q.cols, p1 = q.s1.map(i => q.cols[i]), p2 = q.s2.map(i => q.cols[i]);
  return '<div class="ask">' + tr('Три книги: ' + name(a, 0) + ', ' + name(b, 0) + ' и ' + name(c, 0) + ' са подредени отляво надясно, както е показано. Ако размените местата на ' + name(p1[0], 1) + ' и ' + name(p1[1], 1) + ' книга, а след това размените местата на ' + name(p2[0], 1) + ' и ' + name(p2[1], 1) + ' книга, <b>какво ще е подреждането на книгите отляво надясно?</b>',
    'Три книжки: ' + name(a, 0) + ', ' + name(b, 0) + ' і ' + name(c, 0) + ' стоять зліва направо, як показано. Якщо поміняти місцями ' + SW_COL[p1[0]][3] + ' і ' + SW_COL[p1[1]][3] + ' книжку, а потім поміняти місцями ' + SW_COL[p2[0]][3] + ' і ' + SW_COL[p2[1]][3] + ' книжку, <b>як книжки стоятимуть зліва направо?</b>') + '</div>' +
    '<div class="given" style="text-align:center">' + books(q.cols, 90) + '</div>';
}
const names = r => r.map(c => name(c, 0)).join(', ');
function eqSwaps(q){
  return names(q.cols) + ' → ' + names(q.row1) + ' → ' + names(q.row2);
}
function whySwaps(q, full){
  if(!full) return tr('Следи книгите по цвят, не по място. След първата размяна запиши новото подреждане и от него направи втората.', 'Стеж за книжками за кольором, а не за місцем. Після першої заміни пригадай новий порядок і з нього зроби другу.');
  return books(q.cols, 90) + ' ' + names(q.cols) + ' &nbsp;→&nbsp; ' + tr('първа размяна: ', 'перша заміна: ') + books(q.row1, 90) + ' ' + names(q.row1) + ' &nbsp;→&nbsp; ' + tr('втора размяна: ', 'друга заміна: ') + books(q.row2, 90) + ' <b>' + names(q.row2) + '</b>';
}
KIND.swaps = { draw:drawSwaps, eq:eqSwaps, why:whySwaps };
