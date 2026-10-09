// Question kind 'wordpos': level 94 КОЛЕДАКОЛЕДА… — Which letter stands at a place in a word written over and over.

// Коледно състезание 2025, задача 6: КОЛЕДА written 10 times in one long word; the 46th letter
// counted from the right. 60 letters, so the 46th from the right is the 15th from the left,
// and every 6 letters the word starts again: 15 = 6 + 6 + 3, the 3rd letter, Л. A letter
// cannot be typed, so this kind brings its own А/Б/В/Г, and ans is the right one's id.
// Each pair is the word in Bulgarian and in Ukrainian, the same length, no letter twice.
import { KIND, SLOT, popAt, rnd, shuffle, svgText, tr, ukN } from '../js/core.js';
export const WORDPOS = [['КОЛЕДА', 'КОЛЯДА'], ['СНЯГ', 'СНІГ'], ['ШЕЙНА', 'САНКИ']];
// Есен 2019, задача 11: ○ ○ ○ ○ △ □ over and over; how many circles among the first 31. Six to a
// round, so 31 = 5 · 6 + 1: five rounds of 4 circles, and the 31st starts a sixth — 21.
function genPatCount(){
  const c = 2 + rnd(4), pat = Array(c).fill('○').concat(Math.random() < 0.6 ? ['△', '□'] : ['△']), L = pat.length;
  const n = 3*L + 1 + rnd(4*L), sym = Math.random() < 0.7 ? '○' : '△';
  let ans = 0; for(let i = 0; i < n; i++) if(pat[i % L] === sym) ans++;
  return {kind:'wordpos', shape:'count', pat, n, sym, traps:[Math.floor(n / L)*pat.filter(x => x === sym).length], ans};
}
// МБГ Полуфинал 2023, 1 клас, задача 7: how many digits 1 in the row of 20 numbers 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, …, 1, 2?
// The part 1, 2, 1, 1, 2 four times over, 3 ones in each: 12. A part of 1s and 2s, 4 or 5 long, in a row of 15 or 20
// numbers; two parts and one more number are shown, then the last two. The shown start fixes the part: no shorter
// part repeats through it (so both digits are in it).
const digitPeriod = a => { for(let p = 1; p < a.length; p++) if(a.every((v, i) => i < p || v === a[i - p])) return p; return a.length; };
export function genDigitBlocks(){
  for(;;){
    const L = 4 + rnd(2), pat = Array.from({length: L}, () => 1 + rnd(2)), n = Math.random() < 0.7 ? 20 : 15, dig = Math.random() < 0.7 ? 1 : 2;
    const at = i => pat[i % L], shown = Array.from({length: 2*L + 1}, (_, i) => at(i)).concat(at(n - 2), at(n - 1));
    if(digitPeriod(shown.slice(0, 2*L + 1)) !== L) continue;
    let ans = 0; for(let i = 0; i < n; i++) if(at(i) === dig) ans++;
    // the slips: only the digits that can be seen, or half the row
    const traps = [shown.filter(v => v === dig).length, Math.floor(n / 2)];
    return {kind:'wordpos', shape:'digits', pat, n, dig, traps: traps.filter((v, k) => v !== ans && traps.indexOf(v) === k), ans};
  }
}
// the parts the row falls into: whole ones, then what is left of one
const digitParts = q => { const L = q.pat.length, r = q.n % L; return Array(Math.floor(q.n / L)).fill(q.pat).concat(r ? [q.pat.slice(0, r)] : []); };
export function genWordPos(){
  if(Math.random() < 0.3) return genPatCount();
  for(;;){
    const w = rnd(WORDPOS.length), L = WORDPOS[w][0].length, n = 4 + rnd(8), right = Math.random() < 0.6;
    const p = 7 + rnd(n*L - 7);                                   // past the first word, or there is nothing to count
    const fromLeft = right ? n*L - p + 1 : p, at = (fromLeft - 1) % L;
    const wrong = shuffle([...Array(L).keys()].filter(i => i !== at)).slice(0, 3);
    const ids = shuffle(wrong.concat(at));
    const options = ids.map((li, id) => ({ id, v: id, text: [WORDPOS[w][0][li], WORDPOS[w][1][li]] }));
    const pick = ids.indexOf(at);
    return {kind:'wordpos', w, L, n, p, right, fromLeft, at, options, pick, own: true, ans: pick};
  }
}
const wordPosWord = q => tr(WORDPOS[q.w][0], WORDPOS[q.w][1]);
function drawWordPos(q){
  if(q.shape === 'digits'){
    const L = q.pat.length, at = i => q.pat[i % L];
    return '<div class="ask">' + tr('Колко цифри <span class="num">' + q.dig + '</span> са записани в редицата от <span class="num">' + q.n + '</span> числа?',
      'Скільки цифр <span class="num">' + q.dig + '</span> записано в ряду з <span class="num">' + q.n + '</span> чисел?') + '</div>' +
      '<div class="seq">' + Array.from({length: 2*L + 1}, (_, i) => at(i)).join(', ') + ', …, ' + at(q.n - 2) + ', ' + at(q.n - 1) + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'count'){
    const what = q.sym === '○' ? tr('кръгчета', 'кружечків') : tr('триъгълничета', 'трикутничків');
    return '<div class="ask">' + tr('Според модела, показан по-долу, броейки отляво надясно, колко ' + what + ' има от 1-вия до <span class="num">' + q.n + '-ия</span> символ включително?',
      'За зразком нижче, рахуючи зліва направо, скільки ' + what + ' від 1-го до <span class="num">' + q.n + '-го</span> символу включно?') + '</div>' +
      '<div class="seq">' + q.pat.concat(q.pat, q.pat).join(' ') + ' …</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  const W = wordPosWord(q);
  return '<div class="ask">' + tr('Петя написала <span class="num">' + q.n + '</span> пъти ' + W + ' слято и получила една дълга дума, започваща с ',
    'Петя написала <span class="num">' + ukN(q.n, 'раз', 'рази', 'разів').replace(' ', '</span> ') + ' ' + W + ' разом і отримала одне довге слово, що починається з ') +
    '<b>' + W + W + W + '…</b> ' + tr('Коя буква е написана на <span class="num">' + q.p + '-то</span> място <b>' + (q.right ? 'отдясно наляво' : 'отляво надясно') + '</b>?',
    'Яка буква стоїть на <span class="num">' + q.p + '-му</span> місці, якщо рахувати <b>' + (q.right ? 'справа наліво' : 'зліва направо') + '</b>?') + '</div>';
}
function eqWordPos(q){
  if(q.shape === 'digits') return q.pat.join(', ') + ' → ' + digitParts(q).map(p => p.filter(v => v === q.dig).length).join(' + ') + ' = ' + q.ans;
  if(q.shape === 'count'){ const L = q.pat.length, k = q.pat.filter(x => x === q.sym).length;
    return q.n + ' = ' + Math.floor(q.n / L) + ' · ' + L + ' + ' + q.n % L + ' → ' + q.ans; }
  return (q.right ? q.n*q.L + ' − ' + q.p + ' + 1 = ' + q.fromLeft + ', ' : '') + q.fromLeft + tr('-ма → ', '-га → ') + wordPosWord(q)[q.at];
}
// The pattern's picture: one round of the pattern a row, the asked symbol filled in, so every row holds as
// many; on the left where each row ends (31 = 5 rounds of 6 and 1 more), on the right how many it holds.
// The hint draws two rounds with no numbers.
const patSym = (s, x, y, on) => { const f = on ? 'var(--accent)' : 'none', st = ' stroke="' + (on ? 'var(--accent)' : 'var(--muted)') + '" stroke-width="1.6"';
  return s === '○' ? '<circle cx="' + x + '" cy="' + y + '" r="6.5" fill="' + f + '"' + st + '/>'
    : s === '△' ? '<path d="M' + x + ',' + (y - 7) + ' L' + (x + 7) + ',' + (y + 6) + ' H' + (x - 7) + ' Z" fill="' + f + '"' + st + '/>'
    : '<rect x="' + (x - 6) + '" y="' + (y - 6) + '" width="12" height="12" fill="' + f + '"' + st + '/>'; };
function patCountSvg(q, full){
  const L = q.pat.length, rows = full ? Math.ceil(q.n / L) : 2, C = 20, x0 = 44;
  let g = '';
  for(let r = 0; r < rows; r++){
    const len = Math.min(L, q.n - r*L), y = r*24, at = full ? popAt(1 + r*0.7) : '';
    g += '<g' + at + '><rect x="' + (x0 - 12) + '" y="' + (y - 11) + '" width="' + (len*C + 4) + '" height="22" rx="6" fill="none" stroke="var(--line)" stroke-width="1.5"/>' +
      q.pat.slice(0, len).map((s, i) => patSym(s, x0 + i*C, y, s === q.sym)).join('') +
      (full ? svgText(16, y + 4, Math.min((r + 1)*L, q.n), 11, 'var(--muted)') + svgText(x0 + L*C + 6, y + 5, q.pat.slice(0, len).filter(s => s === q.sym).length, 13, 'var(--accent)') : '') + '</g>';
  }
  const w = Math.floor(q.n / L), k = q.pat.filter(x => x === q.sym).length, extra = q.pat.slice(0, q.n % L).filter(x => x === q.sym).length;
  if(full) g += svgText(x0 + (L*C)/2, rows*24 + 14, w + ' · ' + k + (q.n % L ? ' + ' + extra : '') + ' = ' + q.ans, 15, 'var(--ink)', popAt(2 + rows*0.7));
  const W = x0 + L*C + 20;
  return '<svg viewBox="0 -14 ' + W + ' ' + (rows*24 + (full ? 34 : 4)) + '" style="display:block; width:' + Math.round(W*1.2) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('моделът ред по ред', 'зразок рядок за рядком') + '">' + g + '</svg>';
}
// The word's picture: each copy of the word a box, where each copy ends under it (but the copy found, whose
// letters come out numbered below); the place asked for marked,
// counted from the side asked (and from the left, when that was the right); then that copy drawn large, its
// letters numbered, the letter found.
function wordPosSvg(q){
  const W = wordPosWord(q), N = q.n*q.L, U = 300 / q.n, X = pos => (10 + pos*300/N).toFixed(1), k = Math.floor((q.fromLeft - 1) / q.L);
  const brace = (a, b, y, t, col, st) => '<g' + popAt(st) + '><path d="M' + X(a) + ',' + (y + 5) + ' v-5 H' + X(b) + ' v5" stroke="' + col + '" stroke-width="2" fill="none"/>' + svgText(((+X(a) + +X(b))/2).toFixed(1), y - 5, t, 12, col) + '</g>';
  let g = '';
  for(let i = 0; i < q.n; i++){
    const x = 10 + i*U;
    g += '<rect x="' + (x + 1).toFixed(1) + '" y="0" width="' + (U - 2).toFixed(1) + '" height="22" rx="4" fill="' + (i === k ? 'var(--accentbg)' : 'none') + '" stroke="' + (i === k ? 'var(--accent)' : 'var(--line)') + '" stroke-width="1.6"/>' +
      (U >= q.L*8 ? svgText((x + U/2).toFixed(1), 15, W, 9, 'var(--muted)') : '') + (i === k || i === k - 1 ? '' : svgText((x + U).toFixed(1), 36, (i + 1)*q.L, 10, 'var(--muted)'));   // the copy found shows its own ends below
  }
  g += '<path d="M' + X(q.fromLeft - 0.5) + ',-2 l-4,-6 h8 Z" fill="var(--warm)"/>';
  g += brace(0, q.fromLeft, -12, q.fromLeft, 'var(--accent)', 1);
  if(q.right) g += brace(q.fromLeft - 1, N, -36, q.p, 'var(--warm)', 0.5);
  const zx = 160 - q.L*13, zy = 66;
  g += '<path' + popAt(2) + ' d="M' + (10 + k*U + 1).toFixed(1) + ',22 V42 L' + zx + ',' + zy + ' M' + (10 + (k + 1)*U - 1).toFixed(1) + ',22 V42 L' + (zx + q.L*26) + ',' + zy + '" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>';
  [...W].forEach((ch, i) => { const on = i === q.at;
    g += '<g' + popAt(3 + i*0.4) + '><rect x="' + (zx + i*26 + 1) + '" y="' + zy + '" width="24" height="26" rx="5" fill="' + (on ? 'var(--warmbg)' : 'var(--accentbg)') + '" stroke="' + (on ? 'var(--warm)' : 'var(--accent)') + '" stroke-width="' + (on ? 2.5 : 1.5) + '"/>' +
      svgText(zx + i*26 + 13, zy + 19, ch, 15, 'var(--ink)') + svgText(zx + i*26 + 13, zy + 42, k*q.L + i + 1, 10, on ? 'var(--warm)' : 'var(--muted)') + '</g>'; });
  return '<svg viewBox="0 ' + (q.right ? -58 : -34) + ' 320 ' + (q.right ? 170 : 146) + '" style="display:block; width:320px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('думата, писана много пъти', 'слово, написане багато разів') + '">' + g + '</svg>';
}
function whyWordPos(q, full){
  if(q.shape === 'digits'){
    if(!full) return tr('Намери частта, която се повтаря, и огради всяка. Колко цифри ' + q.dig + ' има в една част?', 'Знайди частину, що повторюється, і обведи кожну. Скільки цифр ' + q.dig + ' в одній частині?');
    const parts = digitParts(q);
    return parts.map(p => '(' + p.join(', ') + ')').join(' ') + ' &nbsp;→&nbsp; ' + q.n + ' = ' + parts.map(p => p.length).join(' + ') +
      ' &nbsp;→&nbsp; ' + tr('цифри ', 'цифр ') + q.dig + ': ' + parts.map(p => p.filter(v => v === q.dig).length).join(' + ') + ' = <b>' + q.ans + '</b>';
  }
  if(q.shape === 'count'){
    if(!full) return tr('Колко символа има в едно повторение на модела — и колко от тях са търсените?', 'Скільки символів в одному повторенні зразка — і скільки з них ті, що треба?') + patCountSvg(q, false);
    const L = q.pat.length, k = q.pat.filter(x => x === q.sym).length, w = Math.floor(q.n / L), r = q.n % L, extra = q.pat.slice(0, r).filter(x => x === q.sym).length;
    return tr('в едно повторение: ' + L + ' символа, от тях ' + k + ' ', 'в одному повторенні: ' + L + ' символів, з них ' + k + ' ') + q.sym + ' &nbsp;→&nbsp; ' + q.n + ' = ' + w + ' · ' + L + ' + ' + r +
      ' &nbsp;→&nbsp; ' + w + ' · ' + k + (r ? ' + ' + extra : '') + ' = ' + q.ans + patCountSvg(q, true);
  }
  if(!full) return tr('Думата се повтаря — на всеки толкова букви, колкото има в нея, започва отначало.', 'Слово повторюється — через стільки букв, скільки в ньому є, воно починається знову.');
  const W = wordPosWord(q), whole = Math.floor((q.fromLeft - 1) / q.L);
  return (q.right ? tr('всички букви: ', 'усього букв: ') + q.n + ' · ' + q.L + ' = ' + q.n*q.L + tr(', отляво това е ', ', зліва це ') + q.n*q.L + ' − ' + q.p + ' + 1 = <b>' + q.fromLeft + '</b> &nbsp;→&nbsp; ' : '') +
    q.fromLeft + ' = ' + (whole ? whole + ' · ' + q.L + ' + ' : '') + (q.at + 1) + ' &nbsp;→&nbsp; ' + tr('буква номер ', 'буква номер ') + (q.at + 1) + tr(' в ', ' у ') + W + ': <b>' + W[q.at] + '</b>' + wordPosSvg(q);
}
KIND.wordpos = { draw:drawWordPos, eq:eqWordPos, why:whyWordPos };
