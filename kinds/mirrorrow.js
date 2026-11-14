// Question kind 'mirrorrow': level 370 В огледалото — A row of numbers or letters as a mirror, or a window seen from the other side, shows it.

// Кенгуру 2021, задача 5: a T-shirt with 2021 on the front, what is seen in the mirror (A: 1202 with every digit turned round).
// Кенгуру 2026, задача 9: the letters A B C and a heart painted on a window from inside, how they look from outside (E: the heart
// first, then the three letters, each turned round). Both are one left-right mirror: the order is reversed AND every sign is turned
// round. The answer is a picture, so the kind brings its own А–Д: the slips offered are the real ones: only the order reversed,
// only the signs turned round, upside down, and turned half a round.
// The picture is drawn once, glyph by glyph; a sign turned round is the same <text> inside scale(-1 1), upside down scale(1 -1).
import { KIND, shuffle, tr, SVG_FONT } from '../js/core.js';
// [what it is called in Bulgarian, in Ukrainian; unchanged by a left-right mirror; unchanged by an up-down mirror]
/** @type {Record<string, [string, string, boolean, boolean]>} */
export const MR_GLYPH = { '0': ['0', '0', true, true], '1': ['1', '1', false, false], '2': ['2', '2', false, false], '4': ['4', '4', false, false], '5': ['5', '5', false, false],
  '7': ['7', '7', false, false], '9': ['9', '9', false, false], A: ['A', 'А', true, false], B: ['B', 'В', false, true], C: ['C', 'С', false, true], K: ['K', 'К', false, true], E: ['E', 'Е', false, true], '♥': ['сърчице', 'серденько', true, false] };
const LETTERS = ['A', 'B', 'C', 'K', 'E'], DIGITS = ['0', '1', '2', '4', '5', '7', '9'];
/** how one option shows the row: rev = the order reversed, fx = every sign turned round (left-right), fy = every sign upside down */
/** @typedef {{rev: boolean, fx: boolean, fy: boolean}} MrOp */
/** what a child sees: each place's sign and how it stands, a sign that looks the same turned round counted as not turned */
export const mrSig = (/** @type {string[]} */ row, /** @type {MrOp} */ o) => (o.rev ? row.slice().reverse() : row).map(g => g + (o.fx && !MR_GLYPH[g][2] ? 'x' : '') + (o.fy && !MR_GLYPH[g][3] ? 'y' : '')).join(' ');
const OPS = { mirror: { rev: true, fx: true, fy: false }, order: { rev: true, fx: false, fy: false }, signs: { rev: false, fx: true, fy: false }, upside: { rev: false, fx: false, fy: true },
  half: { rev: true, fx: true, fy: true }, both: { rev: false, fx: true, fy: true }, mixed: { rev: true, fx: false, fy: true } };
export function genMirrorRow(){
  for(;;){
    const shape = Math.random() < 0.5 ? 'shirt' : 'window';
    const row = shape === 'shirt' ? shuffle(DIGITS.slice()).slice(0, 4) : shuffle(LETTERS.slice()).slice(0, 3).concat('♥');
    if(shape === 'shirt' && row[0] === '0') continue;
    if(shape === 'shirt' && Math.random() < 0.4){ row[2] = row[0]; }   // 2 0 2 1: a sign twice, as the paper has it
    const names = ['order', 'signs', 'half', 'upside', 'both', 'mixed'], right = mrSig(row, OPS.mirror);
    const wrong = [];
    shuffle(names.slice(0, 4)).concat(names.slice(4)).forEach(n => { const s = mrSig(row, OPS[n]); if(s !== right && wrong.length < 4 && !wrong.some(w => w.s === s)) wrong.push({ n, s }); });
    if(wrong.length < 4 || (shape === 'shirt' && row.filter(g => !MR_GLYPH[g][2]).length < 2)) continue;
    const ops = shuffle(wrong.map(w => w.n).concat('mirror')), pick = ops.indexOf('mirror');
    return {kind:'mirrorrow', shape, row, ops, options: ops.map((n, id) => ({ id, v: id, text: ['<span class="vw">' + mrPic(row, OPS[n]) + '</span>', '<span class="vw">' + mrPic(row, OPS[n]) + '</span>'], op: OPS[n], sig: mrSig(row, OPS[n]) })), pick, own: true, ans: pick};
  }
}
const STEP = 32;
/** the signs of a row as drawn glyphs, centred on cx, at height cy */
function glyphs(row, cx, cy, step, size, o){
  const seq = o.rev ? row.slice().reverse() : row;
  return seq.map((g, i) => {
    const x = cx + (i - (seq.length - 1) / 2) * step, sx = o.fx ? -1 : 1, sy = o.fy ? -1 : 1;
    const body = g === '♥' ? '<path d="M0,' + (size * .34).toFixed(1) + ' C' + (-size * .5).toFixed(1) + ',' + (-size * .05).toFixed(1) + ' ' + (-size * .34).toFixed(1) + ',' + (-size * .4).toFixed(1) + ' 0,' + (-size * .18).toFixed(1) + ' C' + (size * .34).toFixed(1) + ',' + (-size * .4).toFixed(1) + ' ' + (size * .5).toFixed(1) + ',' + (-size * .05).toFixed(1) + ' 0,' + (size * .34).toFixed(1) + 'Z" fill="var(--accent)"/>'
      : '<text x="0" y="' + (size * .35).toFixed(1) + '" text-anchor="middle" font-size="' + size + '" font-weight="800" fill="var(--ink)" ' + SVG_FONT + '>' + g + '</text>';
    return '<g transform="translate(' + x.toFixed(1) + ' ' + cy + ') scale(' + sx + ' ' + sy + ')">' + body + '</g>';
  }).join('');
}
const label = (/** @type {string[]} */ row, /** @type {MrOp} */ o) => tr((o.rev ? 'отзад напред' : 'отпред назад') + (o.fx ? ', знаците огледално обърнати' : '') + (o.fy ? ', знаците наопаки' : ''),
  (o.rev ? 'ззаду наперед' : 'спереду назад') + (o.fx ? ', знаки дзеркально обернені' : '') + (o.fy ? ', знаки догори дриґом' : ''));
/** an answer picture: the row as one option shows it */
function mrPic(row, o){
  const w = row.length * STEP + 8;
  return '<svg viewBox="0 0 ' + w + ' 44" width="' + w + '" height="44" role="img" aria-label="' + label(row, o) + '">' + glyphs(row, w / 2, 22, STEP, 28, o) + '</svg>';
}
const NONE = { rev: false, fx: false, fy: false };
/** the picture in the task: the row on a shirt, or on a window pane */
function given(q){
  const names = q.row.map((/** @type {string} */ g) => tr(MR_GLYPH[g][0], MR_GLYPH[g][1])).join(' ');
  if(q.shape === 'shirt') return '<div class="given" style="text-align:center"><svg viewBox="0 0 160 108" width="170" height="115" style="max-width:100%" role="img" aria-label="' + tr('тениска с числото ' + q.row.join(''), 'футболка з числом ' + q.row.join('')) + '">' +
    '<path d="M30,14 L52,6 Q80,24 108,6 L130,14 L154,42 L128,54 L124,48 L124,102 L36,102 L36,48 L32,54 L6,42 Z" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/>' + glyphs(q.row, 80, 66, 21, 22, NONE) + '</svg></div>';
  return '<div class="given" style="text-align:center"><svg viewBox="0 0 170 80" width="190" height="90" style="max-width:100%" role="img" aria-label="' + tr('прозорец с букви ' + names, 'вікно з літерами ' + names) + '">' +
    '<rect x="3" y="3" width="164" height="74" rx="4" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="4"/><path d="M85,3 V77 M3,40 H167" stroke="var(--accent)" stroke-width="2" opacity=".5"/>' + glyphs(q.row, 85, 40, STEP, 28, NONE) + '</svg></div>';
}
function drawMirrorRow(q){
  const t = q.shape === 'shirt'
    ? tr('Ако облечете тениската с числото ' + q.row.join('') + ' отпред и застанете пред огледалото, <b>какво ще видите в него?</b>', 'Якщо ви одягнете футболку, на грудях якої написано число ' + q.row.join('') + ', і станете перед дзеркалом, <b>що ви побачите в ньому?</b>')
    : tr('Трите букви и сърчицето са нарисувани на прозореца отвътре, както е показано. <b>Как изглеждат те отвън?</b>', 'Три літери і серденько намальовані на вікні зсередини, як показано. <b>Як вони виглядають ззовні?</b>');
  return '<div class="ask">' + t + '</div>' + given(q);
}
function eqMirrorRow(q){
  return tr('огледало: редът отзад напред и всеки знак обърнат', 'дзеркало: порядок ззаду наперед і кожен знак обернений');
}
function whyMirrorRow(q, full){
  if(!full) return q.shape === 'shirt'
    ? tr('Застани пред огледалото: това, което е отляво на тениската, в огледалото е отдясно. Цифрите, които не са еднакви отляво и отдясно, гледат на другата страна.', 'Стань перед дзеркалом: що ліворуч на футболці, у дзеркалі праворуч. Цифри, які не однакові ліворуч і праворуч, дивляться в інший бік.')
    : tr('Погледни стъклото от другата страна: това, което е отляво, става отдясно. Знаците, които не са еднакви отляво и отдясно, гледат на другата страна.', 'Подивись на скло з іншого боку: що ліворуч, стає праворуч. Знаки, які не однакові ліворуч і праворуч, дивляться в інший бік.');
  return mrPic(q.row, NONE) + ' &nbsp;→&nbsp; ' + mrPic(q.row, OPS.mirror) + '<br>' +
    tr('Първият знак отива накрая, последният — в началото, и всеки гледа на другата страна. Само отзад напред (без да обръщаш знаците) или само обърнати знаци не е огледало.', 'Перший знак іде в кінець, останній — на початок, і кожен дивиться в інший бік. Лише ззаду наперед (без обертання знаків) або лише обернені знаки — це не дзеркало.');
}
KIND.mirrorrow = { draw:drawMirrorRow, eq:eqMirrorRow, why:whyMirrorRow };
