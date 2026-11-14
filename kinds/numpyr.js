// Question kind 'numpyr': level 124 Пирамиди от числа — Two number pyramids that share a row, and the stars at their tips.

// Коледно 2024, задача 7: in the upper pyramid each box is the sum of the two below it, in the
// lower one of the two above; the rows joined by = are the same. From 0, 1, 1 and the 3 and 6
// shown, the base is 0, 1, 1, 2, 1, so the top star is 19; the lower pyramid stands on 2, 1, 14,
// so its star is 3 + 15 = 18, and 19 − 18 = 1.
// Коледно 2023, задача 9: one pyramid of five rows, each box the sum of the two under it. Only 99 at the top,
// 55, 22, 22 and 11 are shown; the letters are found row by row, from wherever only one box is missing:
// A = 99 − 55 = 44, Б = 33, В = 22, then down to the base. (A+Б+В) − (Г+Д+Е+Ж+З+И+К) = 99 − 55 = 44 (here A … M).
// rows[r][i]: row r from the top. Shown are the paper's five places; every other box has a letter.
import { KIND, SLOT, SVG_FONT, answerLine, rnd, shuffle, svgText, tr } from '../js/core.js';
export const PYR_SHOWN = [[0, 0], [1, 0], [2, 1], [3, 0], [4, 3]];
// ponytail: Latin letters where the paper has А, Б, … — «И» and «Е» would read as words to check.js's Ukrainian test
/** @type {[number, number, string][]} */
const PYR_LET = [[1, 1, 'A'], [2, 0, 'B'], [2, 2, 'C'], [3, 1, 'D'], [3, 2, 'E'], [3, 3, 'F'], [4, 0, 'G'], [4, 1, 'H'], [4, 2, 'K'], [4, 4, 'M']];
function pyrRows(base){ const rows = [base]; while(rows[0].length > 1) rows.unshift(rows[0].slice(1).map((v, i) => rows[0][i] + v)); return rows; }
function genPyrOne(){
  for(;;){
    const base = [0, 0, 0, 0, 0].map(() => rnd(13)), rows = pyrRows(base);
    if(rows[0][0] > 99 || rows[0][0] < 30) continue;
    const up = PYR_LET.slice(0, 3).reduce((t, [r, i]) => t + rows[r][i], 0), low = PYR_LET.slice(3).reduce((t, [r, i]) => t + rows[r][i], 0);
    const asks = up - low >= 0 && Math.random() < 0.7 ? -1 : rnd(PYR_LET.length);
    return {kind:'numpyr', shape:'one', rows, up, low, asks, ans: asks < 0 ? up - low : rows[PYR_LET[asks][0]][PYR_LET[asks][1]]};
  }
}
function pyrOneSvg(q){
  const w = 34, h = 26;
  let s = '';
  for(let r = 0; r < 5; r++) for(let i = 0; i <= r; i++){
    const x = (4 - r)*w/2 + i*w, y = r*h, shown = PYR_SHOWN.some(([a, b]) => a === r && b === i), L = PYR_LET.find(([a, b]) => a === r && b === i);
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="none" stroke="var(--ink)" stroke-width="1.4"/>' +
      (shown ? '<text x="' + (x + w/2) + '" y="' + (y + 18) + '" text-anchor="middle" font-size="14" font-weight="800" fill="var(--ink)" ' + SVG_FONT + '>' + q.rows[r][i] + '</text>' : '') +
      (L ? '<text x="' + (x + 4) + '" y="' + (y + 11) + '" font-size="10" font-weight="800" fill="var(--accent)" ' + SVG_FONT + '>' + L[2] + '</text>' : '');
  }
  return '<div class="fig"><svg viewBox="-3 -3 ' + (5*w + 6) + ' ' + (5*h + 6) + '" style="height:clamp(110px,19vh,170px)" role="img" aria-label="' + tr('пирамида от числа', 'піраміда з чисел') + '">' + s + '</svg></div>';
}
const pyrLetSum = (from, to) => PYR_LET.slice(from, to).map(x => x[2]).join('+');
export function genNumPyr(){
  if(Math.random() < 0.3) return genPyrOne();
  for(;;){
    const b = [rnd(4), rnd(5), 1 + rnd(4), 1 + rnd(5), rnd(6)], z = 5 + rnd(16);
    const r1 = b.slice(1).map((v, i) => b[i] + v), r2 = r1.slice(1).map((v, i) => r1[i] + v), r3 = r2.slice(1).map((v, i) => r2[i] + v);
    const top = r3[0] + r3[1], bot = b[3] + 2*b[4] + z, asks = rnd(3);
    if(asks === 2 && top <= bot) continue;
    return {kind:'numpyr', b, z, r1, r2, top, bot, asks, ans: asks === 0 ? top : asks === 1 ? bot : top - bot};
  }
}
function numPyrSvg(q){
  const w = 30, h = 24, cell = (x, y, t, star) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (star ? 'var(--solid)' : 'none') + '" stroke="var(--ink)" stroke-width="1.4"/>' +
    (t === '' ? '' : '<text x="' + (x + w/2) + '" y="' + (y + 17) + '" text-anchor="middle" font-size="14" font-weight="800" fill="' + (star ? 'var(--accent)' : 'var(--ink)') + '" ' + SVG_FONT + '>' + t + '</text>');
  let s = '';
  // the upper pyramid: row r from the top has r + 1 boxes; what the paper shows is filled in
  const shown = [['★'], ['', ''], ['', '', q.r2[2]], [q.r1[0], '', q.r1[2], ''], [q.b[0], q.b[1], q.b[2], '', '']];
  shown.forEach((row, r) => row.forEach((t, i) => { s += cell((4 - r)*w/2 + i*w, r*h, t, t === '★'); }));
  s += cell(5*w, 4*h, q.z);
  for(let i = 0; i < 6; i++) s += '<text x="' + (i*w + w/2) + '" y="' + (5*h + 17) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--muted)" ' + SVG_FONT + '>‖</text>';
  [q.b[0], q.b[1], q.b[2], '', '', ''].forEach((t, i) => { s += cell(i*w, 6*h, t); });
  s += cell(3.5*w, 7*h, '') + cell(4.5*w, 7*h, '') + cell(4*w, 8*h, '★', true);
  return '<div class="fig tall"><svg viewBox="-4 -4 ' + (6*w + 8) + ' ' + (9*h + 8) + '" role="img" aria-label="' + tr('две пирамиди от числа', 'дві піраміди з чисел') + '">' + s + '</svg></div>';
}
// Салабашев 2020, задача 4: four rows, each box the sum of the two under it; shown 7, 3, 7 along the base and 13, 10 above it — the top is 41
// (shape 'four'). 2021, задача 11 (no key in the paper, our own solution is 2): five rows, 22 on top, 10, 7 and 1, 2 at the base end — the first
// base box (shape 'five'). 2023, задача 4: three small pyramids with a symbol each, ⬡ − ♡ + ☁ (shape 'sym'; every number is found by the same rule,
// from the boxes shown, ♡ = 12, ⬡ = 99, ☁ = 8 and 99 − 12 + 8 = 95). The boxes shown are fixed in a pattern (and its mirror); the numbers are drawn.
const pk = (/** @type {number} */ r, /** @type {number} */ i) => r + ',' + i;
/** every box found by the rule from the boxes given: a box over two known ones, or a known box over one known one */
function pyrSolve(/** @type {number} */ n, /** @type {Record<string, number>} */ given){
  /** @type {Record<string, number>} */ const val = { ...given };
  /** @type {Record<string, string[]>} */ const how = {};
  for(let again = true; again;){
    again = false;
    for(let r = 0; r < n - 1; r++) for(let i = 0; i <= r; i++){
      const p = pk(r, i), a = pk(r + 1, i), b = pk(r + 1, i + 1);
      if(val[p] === undefined && val[a] !== undefined && val[b] !== undefined){ val[p] = val[a] + val[b]; how[p] = ['sum', a, b]; again = true; }
      else if(val[b] === undefined && val[p] !== undefined && val[a] !== undefined){ val[b] = val[p] - val[a]; how[b] = ['sub', p, a]; again = true; }
      else if(val[a] === undefined && val[p] !== undefined && val[b] !== undefined){ val[a] = val[p] - val[b]; how[a] = ['sub', p, b]; again = true; }
    }
  }
  return { val, how };
}
/** the sums and differences that lead to one box, in the order they are done */
function pyrSteps(/** @type {number} */ n, /** @type {number[][]} */ rows, /** @type {number[][]} */ shown, /** @type {number[]} */ target){
  /** @type {Record<string, number>} */ const given = {};
  shown.forEach(([r, i]) => { given[pk(r, i)] = rows[r][i]; });
  const { val, how } = pyrSolve(n, given), out = [], seen = new Set();
  const need = (/** @type {string} */ k) => {
    if(seen.has(k) || !how[k]) return;
    seen.add(k);
    how[k].slice(1).forEach(need);
    out.push(val[how[k][1]] + (how[k][0] === 'sum' ? ' + ' : ' − ') + val[how[k][2]] + ' = ' + val[k]);
  };
  need(pk(target[0], target[1]));
  return out;
}
/** @type {Record<string, {n: number, shown: number[][], ask: number[]}>} */
const PLAIN = { four: { n: 4, shown: [[3, 0], [3, 2], [3, 3], [2, 0], [2, 2]], ask: [0, 0] }, five: { n: 5, shown: [[0, 0], [1, 1], [2, 0], [4, 3], [4, 4]], ask: [4, 0] } };
/** @type {Record<string, {sym: number[], shown: number[][]}>} */
const SYM_TPL = { A: { sym: [2, 2], shown: [[0, 0], [2, 0], [2, 1]] }, B: { sym: [0, 0], shown: [[2, 0], [2, 2], [1, 1]] }, C: { sym: [2, 1], shown: [[0, 0], [1, 0], [2, 2]] } };
const flipAt = (/** @type {number[][]} */ l, /** @type {number} */ f) => l.map(([r, i]) => [r, f ? r - i : i]);
const plainOf = (/** @type {any} */ q) => ({ n: PLAIN[q.shape].n, shown: flipAt(PLAIN[q.shape].shown, q.flip), ask: flipAt([PLAIN[q.shape].ask], q.flip)[0] });
const symOf = (/** @type {any} */ p) => ({ at: flipAt([SYM_TPL[p.tpl].sym], p.flip)[0], shown: flipAt(SYM_TPL[p.tpl].shown, p.flip) });
/** @type {Record<string, string>} */
const SYM_CH = { heart: '♡', hex: '⬡', cloud: '☁︎' };
const symShape = (/** @type {string} */ k) => k === 'heart' ? '<path d="M0,6 C-10,-1 -7,-8 0,-3 C7,-8 10,-1 0,6Z"/>' : k === 'hex' ? '<polygon points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4"/>'
  : '<path d="M-7,5 a3.5,3.5 0 0 1 0,-7 a4,4 0 0 1 7,-3 a4.5,4.5 0 0 1 7,3 a3.5,3.5 0 0 1 0,7Z"/>';
const symAttrs = 'fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linejoin="round"';
const symIc = (/** @type {string} */ k) => '<svg class="ic" viewBox="-10 -10 20 20" aria-hidden="true"><g data-sym="' + k + '" ' + symAttrs + '>' + symShape(k) + '</g></svg>';
function pyrPlain(/** @type {number[][]} */ rows, /** @type {number[][]} */ shown, /** @type {number[]|null} */ ask, /** @type {{at:number[], k:string}|null} */ sym, /** @type {number} */ x0, /** @type {number} */ w, /** @type {number} */ h){
  let s = '';
  rows.forEach((row, r) => row.forEach((v, i) => {
    const x = x0 + (rows.length - 1 - r)*w/2 + i*w, y = r*h, on = (/** @type {number[]|null|undefined} */ a) => !!a && a[0] === r && a[1] === i, special = on(ask) || on(sym && sym.at);
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (special ? 'var(--solid)' : 'none') + '" stroke="var(--ink)" stroke-width="1.4"/>';
    if(shown.some(a => on(a))) s += svgText(x + w/2, y + h/2 + 5.5, v, 15, 'var(--ink)');
    else if(on(ask)) s += svgText(x + w/2, y + h/2 + 6, '?', 17, 'var(--accent)');
    else if(sym && on(sym.at)) s += '<g data-sym="' + sym.k + '" transform="translate(' + (x + w/2) + ' ' + (y + h/2) + ')" ' + symAttrs + '>' + symShape(sym.k) + '</g>';
  }));
  return s;
}
const SYM_OPS = [['−', '+'], ['+', '−']];
function genPyrSym(){
  for(;;){
    const tpls = shuffle(['A', 'B', 'C']), kinds = shuffle(['heart', 'hex', 'cloud']);
    const pyr = tpls.map(tpl => ({ tpl, flip: rnd(2), rows: pyrRows([2 + rnd(23), 2 + rnd(23), 2 + rnd(23)]) }));
    const vals = pyr.map(p => { const [r, i] = symOf(p).at; return p.rows[r][i]; });
    if(vals.some(v => v > 99) || new Set(vals).size < 3) continue;
    const ord = shuffle([0, 1, 2]), ops = SYM_OPS[rnd(2)], [a, b, c] = ord.map(k => vals[k]);
    const first = ops[0] === '+' ? a + b : a - b, ans = ops[1] === '+' ? first + c : first - c;
    if(first < 0 || ans < 1 || ans > 99) continue;
    return {kind:'numpyr', shape:'sym', pyr, kinds, vals, ord, ops, ans};
  }
}
export function genPyrPlain(){
  const pick = rnd(3);
  if(pick === 2) return genPyrSym();
  const shape = pick ? 'five' : 'four', flip = rnd(2);
  for(;;){
    const base = shape === 'four' ? [2 + rnd(8), 1 + rnd(9), 1 + rnd(9), 2 + rnd(8)] : [0, 0, 0, 0, 0].map(() => 1 + rnd(6)), rows = pyrRows(base);
    if(rows[0][0] > 99) continue;
    const q = {kind:'numpyr', shape, flip, rows, ans: 0}, [r, i] = plainOf(q).ask;
    q.ans = rows[r][i];
    return q;
  }
}
const symTerms = (/** @type {any} */ q, /** @type {(k: string) => string} */ f) => q.ord.map((/** @type {number} */ k, /** @type {number} */ j) => (j ? ' ' + q.ops[j - 1] + ' ' : '') + f(q.kinds[k])).join('');
function drawPyrPlain(/** @type {any} */ q){
  if(q.shape === 'sym'){
    const w = 32, h = 26, gap = 18;
    const s = q.pyr.map((/** @type {any} */ p, /** @type {number} */ k) => pyrPlain(p.rows, symOf(p).shown, null, { at: symOf(p).at, k: q.kinds[k] }, k*(3*w + gap), w, h)).join('');
    return '<div class="ask">' + tr('Във всяка пирамида числото е сборът на двете числа под него. Колко е <span class="num">' + symTerms(q, symIc) + '</span>?',
      'У кожній піраміді число — сума двох чисел під ним. Чому дорівнює <span class="num">' + symTerms(q, symIc) + '</span>?') + '</div>' +
      '<div class="fig wide"><svg viewBox="-3 -3 ' + (9*w + 2*gap + 6) + ' ' + (3*h + 6) + '" role="img" aria-label="' + tr('три малки пирамиди от числа', 'три маленькі піраміди з чисел') + '">' + s + '</svg></div>' +
      '<div class="line md">' + symTerms(q, symIc) + ' = ' + SLOT + '</div>';
  }
  const w = 38, h = 28, p = plainOf(q), n = p.n;
  return '<div class="ask">' + (q.shape === 'four' ? tr('Числото във всяка кутийка е сборът на двете кутийки под нея. Кое е числото на върха на пирамидата?', 'Число в кожній клітинці — сума двох клітинок під нею. Яке число на вершині піраміди?')
    : tr('Числото във всяка кутийка е сборът на двете числа в кутийките под нея. Кое число стои на мястото на въпросителния знак?', 'Число в кожній клітинці — сума двох чисел у клітинках під нею. Яке число стоїть на місці знака питання?')) + '</div>' +
    '<div class="fig"><svg viewBox="-3 -3 ' + (n*w + 6) + ' ' + (n*h + 6) + '" role="img" aria-label="' + tr('пирамида от числа', 'піраміда з чисел') + '">' + pyrPlain(q.rows, p.shown, p.ask, null, 0, w, h) + '</svg></div>' + answerLine('xl');
}
function eqPyrPlain(/** @type {any} */ q){
  if(q.shape === 'sym') return q.pyr.map((/** @type {any} */ p, /** @type {number} */ k) => SYM_CH[q.kinds[k]] + ' = ' + q.vals[k]).join(', ') + ' → ' + q.ord.map((/** @type {number} */ k, /** @type {number} */ j) => (j ? ' ' + q.ops[j - 1] + ' ' : '') + q.vals[k]).join('') + ' = ' + q.ans;
  const p = plainOf(q);
  return pyrSteps(p.n, q.rows, p.shown, p.ask).join(', ');
}
function whyPyrPlain(/** @type {any} */ q, /** @type {boolean} */ full){
  if(!full) return tr('Започни от място, където знаеш две от трите числа: двете долу, или горното и едното долу.', 'Почни з місця, де знаєш два з трьох чисел: два внизу або верхнє й одне нижнє.');
  if(q.shape === 'sym') return q.pyr.map((/** @type {any} */ p, /** @type {number} */ k) => SYM_CH[q.kinds[k]] + ': ' + pyrSteps(3, p.rows, symOf(p).shown, symOf(p).at).join(', ') + ' → <b>' + q.vals[k] + '</b>').join('<br>') + '<br>' +
    symTerms(q, k => SYM_CH[k]) + ' = ' + q.ord.map((/** @type {number} */ k, /** @type {number} */ j) => (j ? ' ' + q.ops[j - 1] + ' ' : '') + q.vals[k]).join('') + ' = ' + q.ans;
  const p = plainOf(q);
  return pyrSteps(p.n, q.rows, p.shown, p.ask).map((t, j, a) => j === a.length - 1 ? t.replace(/= (\d+)$/, '= <b>$1</b>') : t).join(', ');
}
function drawNumPyr(q){
  if(q.shape === 'four' || q.shape === 'five' || q.shape === 'sym') return drawPyrPlain(q);
  if(q.shape === 'one'){
    const ask = q.asks < 0 ? tr('пресметнете <span class="num">(' + pyrLetSum(0, 3) + ') − (' + pyrLetSum(3) + ')</span>', 'обчисліть <span class="num">(' + pyrLetSum(0, 3) + ') − (' + pyrLetSum(3) + ')</span>')
      : tr('кое число стои на мястото на буквата <b>' + PYR_LET[q.asks][2] + '</b>?', 'яке число стоїть на місці букви <b>' + PYR_LET[q.asks][2] + '</b>?');
    return '<div class="ask">' + tr('Всяко число в пирамидата е сборът на двете под него. След като замените буквите с числа, ', 'Кожне число в піраміді — сума двох чисел під ним. Замінивши букви числами, ') + ask + '</div>' +
      pyrOneSvg(q) + answerLine('xl');
  }
  const ask = q.asks === 2 ? tr('Колко е <b>разликата</b> от числата, които трябва да се запишат на мястото на звездичките?', 'Чому дорівнює <b>різниця</b> чисел, які треба записати замість зірочок?')
    : tr('Кое число трябва да се запише на мястото на звездичката в <b>' + (q.asks ? 'долната' : 'горната') + '</b> пирамида?', 'Яке число треба записати замість зірочки в <b>' + (q.asks ? 'нижній' : 'верхній') + '</b> піраміді?');
  return '<div class="ask">' + tr('В горната пирамида всяко число е сборът от двете под него, а в долната — от двете над него. Редовете, свързани с ‖, са еднакви. ',
    'У верхній піраміді кожне число — сума двох під ним, а в нижній — двох над ним. Ряди, з’єднані знаком ‖, однакові. ') + ask + '</div>' +
    numPyrSvg(q) + answerLine('xl');
}
function eqNumPyr(q){
  if(q.shape === 'four' || q.shape === 'five' || q.shape === 'sym') return eqPyrPlain(q);
  if(q.shape === 'one') return q.asks < 0 ? q.up + ' − ' + q.low + ' = ' + q.ans : PYR_LET[q.asks][2] + ' = ' + q.ans;
  return tr('долният ред ', 'нижній ряд ') + q.b.join(', ') + ' → ★ ' + q.top + ', ★ ' + q.bot + ' → ' + q.ans;
}
function whyNumPyr(q, full){
  if(q.shape === 'four' || q.shape === 'five' || q.shape === 'sym') return whyPyrPlain(q, full);
  if(q.shape === 'one'){
    if(!full) return tr('Търси две съседни кутии, на които знаеш едната и тази над тях. Горе се изважда, долу се събира.', 'Шукай дві сусідні клітинки, де відома одна з них і та, що над ними. Згори віднімаєш, знизу додаєш.');
    const v = (/** @type {[number, number, string]} */ [r, i]) => q.rows[r][i];
    return PYR_LET.map(L => L[2] + ' = ' + v(L)).join(', ') + ' &nbsp;→&nbsp; ' + (q.asks < 0 ? '(' + PYR_LET.slice(0, 3).map(v).join(' + ') + ') − (' + PYR_LET.slice(3).map(v).join(' + ') + ') = ' + q.up + ' − ' + q.low + ' = ' + q.ans : q.ans);
  }
  if(!full) return tr('Първо допълни най-долния ред на горната пирамида: кое число с известното до него дава числото над тях?', 'Спершу доповни найнижчий ряд верхньої піраміди: яке число разом із сусіднім дає число над ними?');
  const [b0, b1, b2, b3, b4] = q.b;
  const up = q.r1[2] + ' − ' + b2 + ' = <b>' + b3 + '</b>, ' + q.r2[2] + ' − ' + q.r1[2] + ' = ' + q.r1[3] + ', ' + q.r1[3] + ' − ' + b3 + ' = <b>' + b4 + '</b>';
  const top = tr('горе: ', 'угорі: ') + q.r2.join(', ') + ' → ' + (q.r2[0] + q.r2[1]) + ', ' + (q.r2[1] + q.r2[2]) + ' → <b>' + q.top + '</b>';
  const bot = tr('долу: ', 'унизу: ') + b3 + ', ' + b4 + ', ' + q.z + ' → ' + (b3 + b4) + ', ' + (b4 + q.z) + ' → <b>' + q.bot + '</b>';
  return up + ' &nbsp;→&nbsp; ' + (q.asks === 1 ? bot : q.asks === 0 ? top : top + '; ' + bot + ' &nbsp;→&nbsp; ' + q.top + ' − ' + q.bot + ' = ' + q.ans);
}
KIND.numpyr = { draw:drawNumPyr, eq:eqNumPyr, why:whyNumPyr };
