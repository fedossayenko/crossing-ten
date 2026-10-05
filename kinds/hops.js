// Question kind 'hops': level 186 Скакалецът — Jumps of two lengths, and the ways to land on a spot.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2021, 1 клас, задача 17: a grasshopper jumps 3 m or 4 m; in how many ways does it reach a
// flower 14 m away? 14 is only 3 + 3 + 4 + 4, and those four jumps can come in 6 orders:
// 3344, 3434, 3443, 4334, 4343, 4433. The order matters — each order is another way.
// every order of jumps a and b that lands exactly on N, as strings like '3344'
import { KIND, SLOT, rnd, svgText, tr, ukN } from '../js/core.js';
function hopWays(a, b, N){
  const out = [];
  (function go(left, path){ if(left === 0){ out.push(path); return; } if(left >= a) go(left - a, path + a); if(left >= b) go(left - b, path + b); })(N, '');
  return out;
}
export function genHops(){
  for(;;){
    const a = 2 + rnd(3), b = a + 1 + rnd(2), N = 7 + rnd(10), n = hopWays(a, b, N).length;
    if(n < 2 || n > 10) continue;
    return {kind:'hops', a, b, N, ans: n};
  }
}
const hopsUk = n => '<span class="num">' + n + '</span> ' + ukN(n, 'метр', 'метри', 'метрів').split(' ')[1];
// the line from the grasshopper to the flower, a mark every metre
function hopsSvg(q){
  const u = 260 / q.N, X = v => (20 + v*u).toFixed(1);
  let g = '<line x1="20" y1="40" x2="' + X(q.N) + '" y2="40" stroke="var(--ink)" stroke-width="2"/>';
  for(let v = 0; v <= q.N; v++) g += '<line x1="' + X(v) + '" y1="36" x2="' + X(v) + '" y2="44" stroke="var(--ink)" stroke-width="1.2"/>';
  g += svgText(X(0), 60, 0, 11, 'var(--muted)') + svgText(X(q.N), 60, q.N + ' м', 11, 'var(--ink)');
  // the grasshopper, sitting at 0
  g += '<g transform="translate(20 26)"><ellipse cx="0" cy="0" rx="11" ry="5" fill="var(--good)"/><circle cx="10" cy="-3" r="4" fill="var(--good)"/>' +
    '<path d="M-2,2 L-8,-8 L-14,6 M2,3 L4,10 M6,3 L9,10" stroke="var(--good)" stroke-width="2" fill="none"/><circle cx="11" cy="-4" r="1.2" fill="var(--ink)"/></g>';
  // the flower, at N
  g += '<g transform="translate(' + X(q.N) + ' 22)"><path d="M0,4 V18" stroke="var(--good)" stroke-width="2"/>' +
    [0, 72, 144, 216, 288].map(r => '<circle cx="' + (6*Math.cos(r*Math.PI/180)).toFixed(1) + '" cy="' + (6*Math.sin(r*Math.PI/180)).toFixed(1) + '" r="4" fill="var(--rose)"/>').join('') +
    '<circle cx="0" cy="0" r="3" fill="var(--lemon)"/></g>';
  return '<div class="fig wide"><svg viewBox="0 0 300 66" role="img" aria-label="' + tr('скакалецът и цветчето', 'коник і квіточка') + '">' + g + '</svg></div>';
}
function drawHops(q){
  if(q.kind === 'hops'){
    return '<div class="ask">' + tr('Скакалец скача по права линия или <span class="num">' + q.a + '</span> метра, или <span class="num">' + q.b + '</span> метра. По колко начина той може да достигне по права до цветче, което се намира на <span class="num">' + q.N + '</span> метра?',
      'Коник стрибає по прямій або на ' + hopsUk(q.a) + ', або на ' + hopsUk(q.b) + '. Скількома способами він може дістатися по прямій до квіточки, яка розташована за ' + hopsUk(q.N) + '?') + '</div>' +
      hopsSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
// the ways grouped by which jumps they use: for each mix, all its orders
const hopsMixes = q => { const m = {}; hopWays(q.a, q.b, q.N).forEach(w => { const k = w.split('').sort().join(''); (m[k] = m[k] || []).push(w); }); return Object.values(m); };
function eqHops(q){
  if(q.kind === 'hops') return hopsMixes(q).map(ws => ws[0].split('').sort().join(' + ') + ' (' + ws.length + ')').join(', ') + ' → ' + q.ans;
}
function whyHops(q, full){
  if(q.kind === 'hops'){
    if(!full) return tr('Първо намери от кои скокове се събира разстоянието. После ги подреди по всички начини — редът има значение.',
      'Спершу знайди, з яких стрибків складається відстань. Потім розстав їх усіма способами — порядок важливий.');
    const mixes = hopsMixes(q);
    return mixes.map(ws => '<b>' + ws[0].split('').sort().join(' + ') + '</b>: ' + ws.map(w => w.split('').join(' ')).join(', ')).join('; &nbsp;') +
      ' &nbsp;→&nbsp; ' + (mixes.length > 1 ? mixes.map(ws => ws.length).join(' + ') + ' = ' : '') + q.ans;
  }
}
KIND.hops = { draw:drawHops, eq:eqHops, why:whyHops };
