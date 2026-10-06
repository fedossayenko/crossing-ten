// Question kind 'segword': level 176 Три отсечки — Each segment told by how much longer or shorter
// it is than the one before. Generator, drawing, summary line and hints for this kind all live here;
// the level itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, 1 клас, задача 14: the first is 12 см, the second 3 см shorter than the first, the
// third 8 см longer than the second. One step at a time: 12 − 3 = 9, then 9 + 8 = 17.
// [Bulgarian, Ukrainian, Bulgarian "drew", Ukrainian "drew"]
import { CM, KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
const SEGWORD_WHO = [['Мария', 'Марія', 'начертала', 'накреслила'], ['Петър', 'Петро', 'начертал', 'накреслив'],
                     ['Ива', 'Іва', 'начертала', 'накреслила'], ['Борис', 'Борис', 'начертал', 'накреслив']];
// МБГ Полуфинал 2025, 1 клас, задача 14: the same, from a first segment over 20 — 21, then 3 shorter, then 8
// longer: 18, 26.
function segWordFrom(lo, n){   // the first segment lo, lo + 1, … n of them
  for(;;){
    const a = lo + rnd(n), d1 = 2 + rnd(4), d2 = 2 + rnd(8), short1 = Math.random() < 0.6, long2 = Math.random() < 0.6;
    const b = short1 ? a - d1 : a + d1, c = long2 ? b + d2 : b - d2;
    if(b < 1 || c < 1 || b > 30 || c > 30) continue;
    return {kind:'segword', who: rnd(SEGWORD_WHO.length), a, d1, d2, short1, long2, b, ans: c};
  }
}
// МБГ Полуфинал 2022, 1 клас, задача 16: three bars on a grid, their left ends together, the top one the
// longest; the top one goes 8 см past the middle one, the middle one 4 см past the bottom one. The bottom one
// drawn on, dotted, to the top one's end: «? см» is 8 + 4 = 12. The paper gives no length of a bar itself, so
// the bottom one is a few squares (c), 1 см a square. The slips: one of the two steps, or their difference.
function segWordBars(){
  const d1 = 5 + rnd(5), d2 = 3 + rnd(6), c = 2 + rnd(3);
  return {kind:'segword', shape:'bars', c, d1, d2, traps:[d1, Math.abs(d1 - d2)], ans: d1 + d2};
}
export function genSegWord(){
  const q = segWordFrom(8, 13);
  // now and then a first segment from 21 to 29, drawn after the other, so a question from 8 to 20 keeps its seed
  const w = Math.random() < 0.15 ? segWordFrom(21, 9) : q;
  // the bars on a grid, drawn after both, so a question in words keeps its seed
  return Math.random() < 0.2 ? segWordBars() : w;
}
// The bars on squared paper, 1 см a square: the top one ends d1 past the middle one, the middle one d2 past
// the bottom one, each step marked over its bar; the bottom one goes on dotted to the top one's end, «? см».
// full splits the dotted line into its two steps and adds them.
function segWordBarsSvg(q, full){
  const u = 12, top = q.c + q.d2 + q.d1, W = (top + 2)*u, H = 8*u, X = v => (1 + v)*u, Y = r => r*u;
  let g = '';
  for(let i = 0; i <= top + 2; i++) g += '<path d="M' + i*u + ' 0V' + H + '"/>';
  for(let j = 0; j <= 8; j++) g += '<path d="M0 ' + j*u + 'H' + W + '"/>';
  g = '<g stroke="var(--line)" stroke-width=".7">' + g + '</g>';
  const bar = (len, r) => '<path d="M' + X(0) + ' ' + Y(r) + 'H' + X(len) + '" stroke="var(--bad)" stroke-width="3.5" stroke-linecap="round"/>';
  const drop = (v, r1, r2) => '<path d="M' + X(v) + ' ' + Y(r1) + 'V' + Y(r2) + '" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 3"/>';
  const step = (a, b, r, t, col) => '<path d="M' + X(a) + ' ' + (Y(r) - 7) + 'v4H' + X(b) + 'v-4" fill="none" stroke="' + col + '" stroke-width="1.5"/>' + svgText((X(a) + X(b))/2, Y(r) - 10, t, 12, col);
  g += bar(top, 2) + bar(q.c + q.d2, 4) + bar(q.c, 6) + drop(q.c + q.d2, 2, 4) + drop(q.c, 4, 6) + drop(top, 2, 6) +
    step(q.c + q.d2, top, 2, q.d1 + ' см', 'var(--ink)') + step(q.c, q.c + q.d2, 4, q.d2 + ' см', 'var(--ink)') +
    '<path d="M' + X(q.c) + ' ' + Y(6) + 'H' + X(top) + '" stroke="var(--bad)" stroke-width="2.5" stroke-dasharray="2 4" stroke-linecap="round"/>' +
    svgText((X(q.c) + X(top))/2, Y(6) + 17, '? см', 13, 'var(--ink)');
  if(full) g += '<g' + popAt(1) + '><path d="M' + X(q.c) + ' ' + (Y(6) + 3) + 'H' + X(q.c + q.d2) + '" stroke="var(--accent)" stroke-width="4"/>' + svgText((X(q.c) + X(q.c + q.d2))/2, Y(6) + 30, q.d2, 12, 'var(--accent)') + '</g>' +
    '<g' + popAt(2) + '><path d="M' + X(q.c + q.d2) + ' ' + (Y(6) + 3) + 'H' + X(top) + '" stroke="var(--warm)" stroke-width="4"/>' + svgText((X(q.c + q.d2) + X(top))/2, Y(6) + 30, q.d1, 12, 'var(--warm)') + '</g>';
  return '<svg viewBox="-2 -2 ' + (W + 4) + ' ' + (H + (full ? 22 : 12)) + '" style="display:block; width:' + Math.round((W + 4)*1.2) + 'px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('три отсечки на квадратна мрежа', 'три відрізки на клітинковій сітці') + '">' + g + '</svg>';
}
function drawSegWord(q){
  if(q.shape === 'bars') return '<div class="ask">' + tr('Кое е числото, което трябва да поставим вместо „?“?', 'Яке число треба поставити замість „?“?') + '</div>' +
    '<div class="fig wide">' + segWordBarsSvg(q, false) + '</div>' +
    '<div class="line lg">' + SLOT + CM + '</div>';
  const w = SEGWORD_WHO[q.who];
  return '<div class="ask">' + tr(w[0] + ' ' + w[2] + ' три отсечки. Първата е дълга <span class="num">' + q.a + '</span> см, втората е с <span class="num">' + q.d1 + '</span> см ' +
    (q.short1 ? 'по-къса' : 'по-дълга') + ' от първата, а третата отсечка е ' + (q.long2 ? 'по-дълга' : 'по-къса') + ' от втората с <span class="num">' + q.d2 + '</span> см. Колко сантиметра е <b>третата</b> отсечка?',
    w[1] + ' ' + w[3] + ' три відрізки. Перший завдовжки <span class="num">' + q.a + '</span> см, другий на <span class="num">' + q.d1 + '</span> см ' +
    (q.short1 ? 'коротший' : 'довший') + ' за перший, а третій відрізок ' + (q.long2 ? 'довший' : 'коротший') + ' за другий на <span class="num">' + q.d2 + '</span> см. Скільки сантиметрів має <b>третій</b> відрізок?') + '</div>' +
    '<div class="line lg">' + SLOT + CM + '</div>';
}
const segWordSteps = q => [q.a + (q.short1 ? ' − ' : ' + ') + q.d1 + ' = ' + q.b, q.b + (q.long2 ? ' + ' : ' − ') + q.d2 + ' = ' + q.ans];
function eqSegWord(q){
  if(q.shape === 'bars') return '? = ' + q.d1 + ' + ' + q.d2 + ' = ' + q.ans;
  return segWordSteps(q).join(', ');
}
// The picture: the three segments one under another, each with its length; the piece that one is
// longer or shorter than the one above it is marked orange.
function segWordSvg(q){
  const max = Math.max(q.a, q.b, q.ans), u = 200 / max, X = v => (40 + v*u).toFixed(1);
  let g = '';
  [q.a, q.b, q.ans].forEach((v, i) => { const y = 14 + i*30;
    g += '<g' + popAt(1 + 2*i) + '>' + svgText(16, y + 5, (i + 1) + '.', 12, 'var(--muted)') + '<line x1="40" y1="' + y + '" x2="' + X(v) + '" y2="' + y + '" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>' +
      svgText(+X(v) + 18, y + 5, v, 12, 'var(--ink)') + '</g>';
    if(i){ const p = [q.a, q.b][i - 1], lo = Math.min(p, v), hi = Math.max(p, v);
      g += '<g' + popAt(2*i) + '><line x1="' + X(lo) + '" y1="' + (y - 30) + '" x2="' + X(lo) + '" y2="' + (y + 6) + '" stroke="var(--line)" stroke-width="1.4" stroke-dasharray="3 3"/>' +
        '<line x1="' + X(lo) + '" y1="' + (y - 8) + '" x2="' + X(hi) + '" y2="' + (y - 8) + '" stroke="var(--warm)" stroke-width="3"/>' +
        svgText(((+X(lo) + +X(hi)) / 2).toFixed(1), y - 12, [q.d1, q.d2][i - 1], 11, 'var(--warm)') + '</g>'; }
  });
  return '<svg viewBox="0 0 280 104" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('трите отсечки', 'три відрізки') + '">' + g + '</svg>';
}
function whySegWord(q, full){
  if(q.shape === 'bars') return full ? segWordBarsSvg(q, true) + tr('пунктирът: до края на средната ', 'пунктир: до кінця середнього ') + q.d2 + tr(' см, после до края на горната още ', ' см, потім до кінця верхнього ще ') + q.d1 + ' см &nbsp;→&nbsp; ' + q.d1 + ' + ' + q.d2 + ' = ' + q.ans
    : tr('Пунктирът тръгва от края на долната отсечка: първо стига до края на средната, после — до края на горната.', 'Пунктир починається від кінця нижнього відрізка: спершу доходить до кінця середнього, потім — до кінця верхнього.');
  if(!full) return tr('Първо намери втората отсечка, после — третата.', 'Спершу знайди другий відрізок, потім — третій.');
  const s = segWordSteps(q);
  return segWordSvg(q) + tr('втората: ', 'другий: ') + s[0] + ' см &nbsp;→&nbsp; ' + tr('третата: ', 'третій: ') + s[1];
}
KIND.segword = { draw:drawSegWord, eq:eqSegWord, why:whySegWord };
