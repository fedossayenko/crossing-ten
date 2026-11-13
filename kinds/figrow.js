// Question kind 'figrow': level 314 Редичка от фигурки — Four figures in a row from clues: not at the ends, and one directly next to another.

// Кенгуру 2025, задача 2: a square, a circle, a rhombus and a triangle in a row; the rhombus and the circle are at neither end, the
// triangle is directly right of the circle. The two in the middle are the rhombus and the circle; the triangle can only be at the
// end, right of the circle, so square, rhombus, circle, triangle. The answer is a row of pictures, so the kind brings its own А–Д:
// the other rows, the ones that break one clue first.
import { KIND, shuffle, tr } from '../js/core.js';
// [Bulgarian, with «the», Ukrainian, Ukrainian genitive, colour]
/** @type {[string, string, string, string, string][]} */
const FG = [['квадратче', 'квадратчето', 'квадратик', 'квадратика', '#3b4fb5'], ['кръгче', 'кръгчето', 'кружечок', 'кружечка', '#f2d93a'], ['ромбче', 'ромбчето', 'ромбик', 'ромбика', '#e0352b'],
  ['триъгълниче', 'триъгълничето', 'трикутничок', 'трикутничка', '#3fae4b'], ['петоъгълниче', 'петоъгълничето', 'п’ятикутник', 'п’ятикутника', '#9b59c9']];
const PERMS = [];
[0, 1, 2, 3].forEach(a => [0, 1, 2, 3].forEach(b => [0, 1, 2, 3].forEach(c => [0, 1, 2, 3].forEach(d => { if(new Set([a, b, c, d]).size === 4) PERMS.push([a, b, c, d]); }))));
// the clues: the two in the middle not at the ends; l directly left of r
/** @type {(row: number[], q: {mid: number[], l: number, r: number}) => number} */
const broken = (row, q) => (q.mid.some(f => row.indexOf(f) % 3 === 0) ? 1 : 0) + (row.indexOf(q.r) - row.indexOf(q.l) === 1 ? 0 : 1);
export function genFigRow(){
  for(;;){
    const f = shuffle([0, 1, 2, 3, 4]).slice(0, 4), truth = shuffle([0, 1, 2, 3]).map(i => f[i]);
    const at = Math.floor(Math.random() * 3), q0 = {mid: [truth[1], truth[2]], l: truth[at], r: truth[at + 1]};
    const fits = PERMS.map(p => p.map(i => f[i])).filter(r => broken(r, q0) === 0);
    if(fits.length !== 1) continue;
    const wrong = shuffle(PERMS.map(p => p.map(i => f[i])).filter(r => r.join() !== truth.join())).sort((a, b) => broken(a, q0) - broken(b, q0)).slice(0, 4);
    const rows = shuffle(wrong.concat([truth])), pick = rows.findIndex(r => r.join() === truth.join());
    return {kind:'figrow', f, truth, mid: q0.mid, l: q0.l, r: q0.r, right: Math.random() < 0.5, options: rows.map((r, id) => ({ id, v: id, text: [figs(r), figs(r)] })), pick, own: true, ans: pick};
  }
}
/** the shapes as a picture */
function figs(row){
  const g = row.map((c, i) => {
    const x = 18 + i*34, col = FG[c][4], st = ' fill="' + col + '" stroke="#333" stroke-width="1.5"';
    return c === 0 ? '<rect x="' + (x - 12) + '" y="6" width="24" height="24"' + st + '/>' : c === 1 ? '<circle cx="' + x + '" cy="18" r="12.5"' + st + '/>'
      : c === 2 ? '<polygon points="' + x + ',3 ' + (x + 9) + ',18 ' + x + ',33 ' + (x - 9) + ',18"' + st + '/>' : c === 3 ? '<polygon points="' + x + ',5 ' + (x + 13) + ',30 ' + (x - 13) + ',30"' + st + '/>'
      : '<polygon points="' + x + ',4 ' + (x + 13) + ',14 ' + (x + 8) + ',30 ' + (x - 8) + ',30 ' + (x - 13) + ',14"' + st + '/>';
  }).join('');
  return '<svg viewBox="0 0 140 36" width="140" height="36" role="img" aria-label="' + row.map(c => tr(FG[c][0], FG[c][2])).join(', ') + '">' + g + '</svg>';
}
const nm = (c, k) => tr(FG[c][k], FG[c][k + 2]);
function drawFigRow(q){
  const [a, b] = q.mid, bgSide = q.right ? 'вдясно от' : 'вляво от', ukSide = q.right ? 'праворуч від' : 'ліворуч від';
  const x = q.right ? q.r : q.l, y = q.right ? q.l : q.r;
  const all = q.f.map(c => nm(c, 0)).join(', ').replace(/, ([^,]*)$/, ' и $1');
  const allUk = q.f.map(c => FG[c][2]).join(', ').replace(/, ([^,]*)$/, ' і $1');
  return '<div class="ask">' + tr('Подредете в редичка една след друга четири фигурки: ' + all + ', така че ' + FG[a][1] + ' и ' + FG[b][1] + ' да не са нито в началото, нито в края на редичката, а ' + FG[x][1] + ' да е непосредствено ' + bgSide + ' ' + FG[y][1] + '. <b>Коя от редичките по-долу отговаря на тези условия?</b>',
    'Розташуйте в рядок одну за одною чотири фігурки: ' + allUk + ', так щоб ' + FG[a][2] + ' і ' + FG[b][2] + ' не стояли ні на початку, ні в кінці рядка, а ' + FG[x][2] + ' стояв безпосередньо ' + ukSide + ' ' + FG[y][3] + '. <b>Який із рядків нижче відповідає цим умовам?</b>') + '</div>';
}
const list = q => q.truth.map(c => nm(c, 0)).join(', ');
function eqFigRow(q){
  return list(q);
}
function whyFigRow(q, full){
  if(!full) return tr('Кои две фигурки не са в краищата? Значи краищата са другите две. После погледни коя до коя стои.', 'Які дві фігурки не стоять скраю? Отже, скраю стоять інші дві. Потім подивись, яка біля якої.');
  const ends = q.truth.filter(c => !q.mid.includes(c)), x = q.right ? q.r : q.l, y = q.right ? q.l : q.r;
  return figs(q.truth) + ' ' + tr('в краищата са ' + FG[ends[0]][1] + ' и ' + FG[ends[1]][1] + ', в средата — ' + FG[q.mid[0]][1] + ' и ' + FG[q.mid[1]][1] + '; ' + FG[x][1] + ' е непосредствено ' + (q.right ? 'вдясно от ' : 'вляво от ') + FG[y][1] + ' &nbsp;→&nbsp; ' + list(q),
    'скраю — ' + FG[ends[0]][2] + ' і ' + FG[ends[1]][2] + ', посередині — ' + FG[q.mid[0]][2] + ' і ' + FG[q.mid[1]][2] + '; ' + FG[x][2] + ' безпосередньо ' + (q.right ? 'праворуч від ' : 'ліворуч від ') + FG[y][3] + ' &nbsp;→&nbsp; ' + list(q));
}
KIND.figrow = { draw:drawFigRow, eq:eqFigRow, why:whyFigRow };
