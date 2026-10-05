// Question kind 'arrows': level 174 Стрелките — Six letters for 1…6, arrows pointing at the smaller number.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2023, 1 клас, задача 20: letters A…F stand for 1…6, and an arrow points at the letter
// with the smaller number: F → E, A → D, E → D, D → C, B → A, B → F. Nothing points at B, so B is
// 6; C points at nothing, so C is 1; D is above only C, so 2. A, E and F share 3, 4 and 5 in some
// order — which order is not known, but their sum is: A + F + E = 3 + 4 + 5 = 12.
import { KIND, SLOT, bgList, popAt, rnd, shuffle, svgText, tr } from '../js/core.js';
const ARROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
// where each letter stands, as on the paper: E top left, A top, F right, D left low, C right low, B at the bottom
const ARROW_AT = {A:[132, 8], B:[118, 112], C:[178, 86], D:[18, 88], E:[60, 22], F:[178, 42]};
// the pairs an arrow can join without running through a third letter's box
const ARROW_PAIRS = (() => {
  const out = [];
  for(let i = 0; i < 6; i++) for(let j = i + 1; j < 6; j++){
    const [a, b] = [ARROW_AT[ARROW_LETTERS[i]], ARROW_AT[ARROW_LETTERS[j]]];
    const clear = ARROW_LETTERS.every((c, k) => { if(k === i || k === j) return true;
      const p = ARROW_AT[c], dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0])*dx + (p[1] - a[1])*dy) / (dx*dx + dy*dy)));
      return Math.hypot(a[0] + t*dx - p[0], a[1] + t*dy - p[1]) > 22; });
    if(clear) out.push([i, j]);
  }
  return out;
})();
// every way to give 1…6 to the letters that keeps each arrow from the bigger to the smaller
function arrowOrders(edges){
  const out = [];
  (function walk(v, used){
    if(v.length === 6){ if(edges.every(([a, b]) => v[a] > v[b])) out.push(v.slice()); return; }
    for(let n = 1; n <= 6; n++) if(!used[n]){ used[n] = 1; v.push(n); walk(v, used); v.pop(); used[n] = 0; }
  })([], {});
  return out;
}
export function genArrows(){
  for(;;){
    const vals = shuffle([1, 2, 3, 4, 5, 6]);
    const m = 5 + rnd(3);
    // arrows, each from the bigger number to the smaller, none of them already implied by the others
    const edges = shuffle(ARROW_PAIRS.map(([i, j]) => vals[i] > vals[j] ? [i, j] : [j, i])).slice(0, m);
    const implied = e => { const seen = {}, st = [e[0]];
      while(st.length){ const x = st.pop(); for(const f of edges) if(f !== e && f[0] === x && !seen[f[1]]){ if(f[1] === e[1]) return true; seen[f[1]] = 1; st.push(f[1]); } }
      return false; };
    if(edges.some(implied)) continue;
    const orders = arrowOrders(edges);
    if(orders.length < 2 || orders.length > 6) continue;
    // the slip in traps: every arrow read the wrong way round, which turns each n into 7 − n
    // three letters whose numbers are always the same three, though not always in the same places
    const sets = [];
    for(let a = 0; a < 6; a++) for(let b = a + 1; b < 6; b++) for(let c = b + 1; c < 6; c++){
      const key = o => [o[a], o[b], o[c]].sort().join();
      const loose = [a, b, c].filter(x => new Set(orders.map(o => o[x])).size > 1).length;
      if(loose >= 2 && orders.every(o => key(o) === key(orders[0]))) sets.push([a, b, c]);
    }
    if(!sets.length) continue;
    const ask = shuffle(sets[rnd(sets.length)].slice()), ex = rnd(edges.length);
    edges.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
    return {kind:'arrows', edges, ask, ex, traps:[21 - ask.reduce((t, x) => t + vals[x], 0)], ans: ask.reduce((t, x) => t + vals[x], 0)};
  }
}
const arrowName = i => ARROW_LETTERS[i];
function arrowsSvg(q){
  const box = (c) => { const [x, y] = ARROW_AT[c]; return '<rect x="' + (x - 10) + '" y="' + (y - 11) + '" width="20" height="22" rx="4" fill="var(--solid)" stroke="var(--ink)" stroke-width="1.6"/>' + svgText(x, y + 6, c, 16, 'var(--ink)'); };
  let g = '';
  q.edges.forEach(([a, b]) => {
    const [x1, y1] = ARROW_AT[arrowName(a)], [x2, y2] = ARROW_AT[arrowName(b)], L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1)/L, uy = (y2 - y1)/L;
    // from the edge of one box (20 × 22) to the edge of the other
    const r = Math.min(10 / Math.abs(ux || 1e-9), 11 / Math.abs(uy || 1e-9)) + 2, sx = x1 + ux*r, sy = y1 + uy*r, ex = x2 - ux*r, ey = y2 - uy*r;
    g += '<line x1="' + sx.toFixed(1) + '" y1="' + sy.toFixed(1) + '" x2="' + (ex - ux*6).toFixed(1) + '" y2="' + (ey - uy*6).toFixed(1) + '" stroke="var(--ink)" stroke-width="1.5"/>' +
      '<path d="M' + ex.toFixed(1) + ' ' + ey.toFixed(1) + 'L' + (ex - ux*8 - uy*3.5).toFixed(1) + ' ' + (ey - uy*8 + ux*3.5).toFixed(1) + 'L' + (ex - ux*8 + uy*3.5).toFixed(1) + ' ' + (ey - uy*8 - ux*3.5).toFixed(1) + 'Z" fill="var(--ink)"/>';
  });
  return '<svg viewBox="0 -6 198 132" style="display:block; width:290px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('букви, свързани със стрелки', 'букви, з’єднані стрілками') + '">' +
    g + ARROW_LETTERS.map(box).join('') + '</svg>';
}
const arrowAsk = q => bgList(q.ask.map(arrowName));
function drawArrows(q){
  if(q.kind === 'arrows'){
    const [a, b] = q.edges[q.ex].map(arrowName);
    return '<div class="ask">' + tr('На рисунката, вместо числата 1, 2, 3, 4, 5 и 6, са поставени буквите A, B, C, D, E и F. Стрелката, съединяваща две букви, сочи буквата, зад която е <b>по-малкото</b> число. Например: ' +
      a + ' → ' + b + ' показва, че ' + a + ' > ' + b + '.',
      'На малюнку замість чисел 1, 2, 3, 4, 5 і 6 поставлено букви A, B, C, D, E і F. Стрілка, що з’єднує дві букви, вказує на букву, за якою стоїть <b>менше</b> число. Наприклад: ' +
      a + ' → ' + b + ' означає, що ' + a + ' > ' + b + '.') + '</div>' +
      '<div class="fig">' + arrowsSvg(q) + '</div>' +
      '<div class="ask">' + tr('Колко е сборът на числата, на мястото на които са поставени буквите ' + arrowAsk(q) + '?',
        'Чому дорівнює сума чисел, замість яких поставлено букви ' + arrowAsk(q) + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + '</div>';
  }
}
// what each letter can be, over every order the arrows allow
function arrowsCan(q){
  const orders = arrowOrders(q.edges);
  return ARROW_LETTERS.map((c, i) => [...new Set(orders.map(o => o[i]))].sort((x, y) => x - y));
}
function eqArrows(q){
  if(q.kind === 'arrows'){
    const can = arrowsCan(q), vs = q.ask.flatMap(i => can[i]).filter((v, k, a) => a.indexOf(v) === k).sort((x, y) => x - y);
    return q.ask.map(arrowName).join(' + ') + ' = ' + vs.join(' + ') + ' = ' + q.ans;
  }
}
// The solution's picture: the numbers 1…6 in a row, each fixed letter under its number, and the
// asked letters together over the numbers they share.
function arrowsLineSvg(q, can){
  const vs = [...new Set(q.ask.flatMap(i => can[i]))].sort((x, y) => x - y), x = v => 14 + (v - 1)*34;
  let g = '';
  for(let v = 1; v <= 6; v++){
    const asked = vs.includes(v);
    g += '<rect x="' + (x(v) - 13) + '" y="30" width="26" height="24" rx="5" fill="' + (asked ? 'var(--warmbg)' : 'var(--solid)') + '" stroke="' + (asked ? 'var(--warm)' : 'var(--line)') + '" stroke-width="1.6"/>' + svgText(x(v), 47, v, 14, 'var(--ink)');
  }
  can.forEach((c, i) => { if(c.length === 1) g += svgText(x(c[0]), 74, arrowName(i), 15, 'var(--accent)', popAt(1 + c[0]*0.4)); });
  g += '<g' + popAt(4) + '><path d="M' + (x(vs[0]) - 12) + ' 24v-6H' + (x(vs[vs.length - 1]) + 12) + 'v6" fill="none" stroke="var(--warm)" stroke-width="1.6"/>' +
    svgText((x(vs[0]) + x(vs[vs.length - 1]))/2, 12, q.ask.map(arrowName).join(', '), 14, 'var(--warm)') + '</g>';
  return '<svg viewBox="-4 -4 210 86" style="display:block; width:252px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('буквите върху числата от 1 до 6', 'букви над числами від 1 до 6') + '">' + g + '</svg>';
}
function whyArrows(q, full){
  if(q.kind === 'arrows'){
    if(!full) return tr('Намери буквата, към която не сочи нито една стрелка, и буквата, от която не излиза нито една.',
      'Знайди букву, на яку не вказує жодна стрілка, і букву, з якої не виходить жодна.');
    const can = arrowsCan(q), fixed = can.map((c, i) => c.length === 1 ? arrowName(i) + ' = ' + c[0] : '').filter(Boolean);
    const vs = [...new Set(q.ask.flatMap(i => can[i]))].sort((x, y) => x - y), names = arrowAsk(q);
    return q.edges.map(([a, b]) => arrowName(a) + ' > ' + arrowName(b)).join(', ') +
      (fixed.length ? ' &nbsp;→&nbsp; ' + tr('сигурно: ', 'точно: ') + fixed.join(', ') : '') + arrowsLineSvg(q, can) +
      tr(names + ' са ' + bgList(vs.map(String)) + ', не знаем в какъв ред — но сборът е един и същ: ',
        names + ' — це ' + bgList(vs.map(String)) + ', невідомо в якому порядку, але сума та сама: ') + vs.join(' + ') + ' = ' + q.ans;
  }
}
KIND.arrows = { draw:drawArrows, eq:eqArrows, why:whyArrows };
