// Question kind 'symtable': level 383 Числа под фигурките — A table of figures, each figure a number, with the sums of some rows and columns.

// Кенгуру 2022, 2 клас, задача 21: a 3 × 3 table of squares, triangles and a circle; rows 1 and 3 add up to 18 and 10, column 1 to 14.
// Row 1 is three squares = 18, so a square is 6; column 1 is a square and two triangles = 14, so a triangle is 4; row 3 is two triangles
// and the circle = 10, so the circle is 2; column 2 is 6 + 6 + 2 = 14. Кенгуру 2024, 2 клас, задача 11: a 2 × 3 table of faces, hearts
// and a star with every sum given: the face is 5 (column 1), the heart 2 (column 3), the star 3. The tables are a few made ones: each
// is solved by the one step a child makes (a line with a single kind of figure left), so the question has one answer, and
// the numbers under the figures are drawn from 1–9, different for different figures.
import { KIND, answerLine, rnd, shuffle, svgText, tr } from '../js/core.js';

// the figures: name (Bulgarian, Ukrainian) and the drawing in a 32 × 32 box, in theme colours
const SYM = [
  ['квадратче', 'квадратик', '<rect x="5" y="5" width="22" height="22" rx="2" fill="var(--accent)"/>'],
  ['триъгълниче', 'трикутничок', '<polygon points="16,4 29,27 3,27" fill="var(--warm)" stroke-linejoin="round"/>'],
  ['кръгче', 'кружечок', '<circle cx="16" cy="16" r="12" fill="var(--good)"/>'],
  ['звездичка', 'зірочка', '<polygon points="16,3 19.5,12 29,12.5 21.5,18.5 24,28 16,22.5 8,28 10.5,18.5 3,12.5 12.5,12" fill="var(--bad)" stroke-linejoin="round"/>'],
  ['сърчице', 'серденько', '<path d="M16,28 C4,19 3,11 8,7 C12,4 15,7 16,10 C17,7 20,4 24,7 C29,11 28,19 16,28 Z" fill="var(--grape)"/>'],
  ['усмивка', 'усмішка', '<circle cx="16" cy="16" r="12.5" fill="var(--lemon)"/><circle cx="11.5" cy="13" r="1.8" fill="var(--ink)" stroke="none"/><circle cx="20.5" cy="13" r="1.8" fill="var(--ink)" stroke="none"/><path d="M9.5,19 Q16,26 22.5,19" fill="none" stroke-width="2" stroke-linecap="round"/>'],
  ['ромбче', 'ромбик', '<polygon points="16,3 28,16 16,29 4,16" fill="var(--pear)" stroke-linejoin="round"/>'],
];
const SETS = [[0, 1, 2], [5, 4, 3], [0, 4, 6], [2, 3, 1]];   // the figures a table uses, by its three kinds
// the tables: figures by row, the rows and columns whose sums are shown, and what is asked (a figure's number, or a column's sum)
const LAY = [
  { g: [[0, 0, 0], [1, 0, 0], [1, 2, 1]], rows: [0, 2], cols: [0], ask: { t: 'col', c: 1 } },
  { g: [[0, 1, 1], [0, 2, 1]], rows: [0, 1], cols: [0, 1, 2], ask: { t: 'sym', s: 2 } },
  { g: [[0, 0, 1], [0, 2, 1]], rows: [1], cols: [0, 2], ask: { t: 'sym', s: 2 } },
  { g: [[0, 0, 0], [0, 1, 1], [2, 1, 2]], rows: [0], cols: [0, 1], ask: { t: 'col', c: 2 } },
  { g: [[0, 0], [1, 2], [1, 1]], rows: [0, 2], cols: [1], ask: { t: 'sym', s: 2 } },
];
export const SYMTABLE_LAYOUTS = LAY;   // the check solves each by brute force
const lineSum = (cells, v) => cells.reduce((s, x) => s + v[x], 0);
const colOf = (g, c) => g.map(r => r[c]);
export function genSymTable(){
  const lay = rnd(LAY.length), set = rnd(SETS.length), vals = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), L = LAY[lay];
  const ans = L.ask.t === 'sym' ? vals[L.ask.s] : lineSum(colOf(L.g, L.ask.c), vals);
  return {kind:'symtable', lay, set, vals, ans};
}
const icon = (s, px) => '<svg viewBox="0 0 32 32" width="' + px + '" height="' + px + '" stroke="var(--ink)" stroke-width="1.6" style="vertical-align:-' + Math.round(px*0.2) + 'px" aria-hidden="true">' + SYM[s][2] + '</svg>';
const kinds = q => SETS[q.set];
function tableSvg(q){
  const L = LAY[q.lay], k = kinds(q), r = L.g.length, c = L.g[0].length, cell = 42, step = 46, W = 6 + c*step + 40, H = 6 + r*step + 28;
  const v = q.vals;
  let g = '';
  L.g.forEach((row, i) => row.forEach((s, j) => {
    g += '<rect x="' + (4 + j*step) + '" y="' + (4 + i*step) + '" width="' + cell + '" height="' + cell + '" rx="5" fill="var(--solid)" stroke="var(--line)" stroke-width="1.5"/>' +
      '<g transform="translate(' + (4 + j*step + 5) + ',' + (4 + i*step + 5) + ') scale(0.99)" stroke="var(--ink)" stroke-width="1.6">' + SYM[k[s]][2] + '</g>';
  }));
  L.rows.forEach(i => { g += svgText(4 + c*step + 16, 4 + i*step + 28, lineSum(L.g[i], v), 20, 'var(--ink)'); });
  L.cols.forEach(j => { g += svgText(4 + j*step + 21, 4 + r*step + 22, lineSum(colOf(L.g, j), v), 20, 'var(--ink)'); });
  if(L.ask.t === 'col') g += svgText(4 + L.ask.c*step + 21, 4 + r*step + 22, '?', 22, 'var(--accent)');
  const label = L.g.map((row, i) => tr('ред ', 'рядок ') + (i + 1) + ': ' + row.map(s => tr(SYM[k[s]][0], SYM[k[s]][1])).join(', ') + (L.rows.includes(i) ? ' (' + tr('сбор ', 'сума ') + lineSum(row, v) + ')' : '')).join('; ');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="display:block; width:' + Math.min(W*1.5, 340) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + label + '">' + g + '</svg>';
}
const BGCOL = ['в първата', 'във втората', 'в третата'], UKCOL = ['першому', 'другому', 'третьому'];
function drawSymTable(q){
  const L = LAY[q.lay], k = kinds(q);
  const ask = L.ask.t === 'sym' ? tr('Кое е числото под ', 'Яке число під ') + icon(k[L.ask.s], 22) + '?'
    : tr('Намерете сбора ' + BGCOL[L.ask.c] + ' колонка.', 'Знайдіть суму в ' + UKCOL[L.ask.c] + ' стовпці.');
  return '<div class="ask">' + tr('Под фигурките се крият числа: под еднаквите фигурки числата са едни и същи, а под различните фигурки те са различни. Показани са сборовете на числата по редове и колони.',
    'Під фігурками ховаються числа: під однаковими фігурками числа однакові, а під різними — різні. Показано суми чисел за рядками й стовпцями.') + ' <b>' + ask + '</b></div>' + tableSvg(q) + answerLine('xl');
}
/** the steps a child makes: a row or column with one kind of figure left, and what that figure is */
export function symSteps(q){
  const L = LAY[q.lay], k = kinds(q), lines = L.rows.map(i => L.g[i]).concat(L.cols.map(j => colOf(L.g, j))), known = {}, out = [];
  const need = L.ask.t === 'sym' ? [L.ask.s] : colOf(L.g, L.ask.c);
  for(let guard = 0; guard < 9 && !need.every(s => s in known); guard++){
    for(const line of lines){
      const open = [...new Set(line.filter(s => !(s in known)))];
      if(open.length !== 1) continue;
      const s = open[0], total = lineSum(line, q.vals), rest = line.filter(x => x in known).reduce((a, x) => a + known[x], 0), n = line.filter(x => x === s).length;
      known[s] = (total - rest) / n;
      out.push({ s, line, total, val: known[s], terms: line.map(x => x in known && x !== s ? known[x] : icon(k[x], 18)) });
      break;
    }
  }
  return out;
}
function eqSymTable(q){
  const L = LAY[q.lay];
  return L.ask.t === 'sym' ? String(q.ans) : colOf(L.g, L.ask.c).map(s => q.vals[s]).join(' + ') + ' = ' + q.ans;
}
function whySymTable(q, full){
  if(!full) return tr('Потърси ред или колона, в които има само един вид фигурка: така ще разбереш колко е тя. После вземи следващия ред или колона.', 'Пошукай рядок або стовпець, де лишився один вид фігурки: так дізнаєшся, скільки це. Потім бери наступний.');
  const L = LAY[q.lay], k = kinds(q);
  const steps = symSteps(q).map(st => st.terms.join(' + ') + ' = ' + st.total + ' &nbsp;→&nbsp; ' + icon(k[st.s], 18) + ' = <b>' + st.val + '</b>');
  if(L.ask.t === 'col') steps.push(colOf(L.g, L.ask.c).map(s => q.vals[s]).join(' + ') + ' = <b>' + q.ans + '</b>');
  return steps.join('<br>');
}
KIND.symtable = { draw:drawSymTable, eq:eqSymTable, why:whySymTable };
