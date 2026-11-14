// Question kind 'netloop': level 431 Двата пътя около — Villages on a ring road with the kilometres between neighbours: the pair that is the same distance either way round.

// Кенгуру 2023, 2 клас, задача 19: five villages A–E on a loop road, 7, 2, 6, 4 and 5 km between neighbours; between two of the villages the way round is the
// same length in both directions (B and E: 2 + 6 + 4 = 12 = 7 + 5, the paper's key A). The kilometres are drawn at random (2–9, the whole ring even), kept only when
// exactly one pair of the ten is the same both ways. The answer is a pair of villages, so the kind brings its own five options.
import { KIND, popAt, rnd, svgFrame, svgText, textW, tr } from '../js/core.js';
import { pairOptions } from './gatemaze.js';
const NAMES = ['A', 'B', 'C', 'D', 'E'];
const POS = [[22, 92], [100, 20], [214, 28], [252, 106], [128, 152]];
// the pairs [i, j] (i < j, villages 0..4) whose two ways round are the same length: km[i] runs from village i to the next one round the ring
export function loopEqual(km){
  const total = km.reduce((a, b) => a + b, 0), out = [];
  for(let i = 0; i < 5; i++) for(let j = i + 1; j < 5; j++){ const d = km.slice(i, j).reduce((a, b) => a + b, 0); if(d * 2 === total) out.push([i, j]); }
  return out;
}
export function genNetLoop(){
  for(;;){
    const km = [0, 0, 0, 0, 0].map(() => 2 + rnd(8)), eq = loopEqual(km);
    if(eq.length !== 1) continue;
    const all = []; for(let i = 0; i < 5; i++) for(let j = i + 1; j < 5; j++) all.push([i, j]);
    const o = pairOptions(all, eq[0], (p, uk) => p.map(x => NAMES[x]).join(uk ? ' і ' : ' и '));
    return {kind:'netloop', km, eq: eq[0], options: o.options, pick: o.pick, own: true, ans: o.pick};
  }
}
const arc = (km, i, j) => km.slice(i, j).reduce((a, b) => a + b, 0);
function ring(q, full){
  let s = '', lab = '';
  const [a, b] = q.eq;
  q.km.forEach((w, i) => {
    const [x1, y1] = POS[i], [x2, y2] = POS[(i + 1) % 5], mx = (x1 + x2) / 2, my = (y1 + y2) / 2, bw = textW(w, 13) + 8, inA = i >= a && i < b;
    s += '<line' + (full ? popAt(1 + i) : '') + ' x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (!full ? 'var(--ink)' : inA ? 'var(--warm)' : 'var(--accent)') + '" stroke-width="' + (full ? 5 : 2.5) + '" stroke-linecap="round"/>';
    lab += '<rect x="' + (mx - bw / 2).toFixed(1) + '" y="' + (my - 9).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="17" rx="4" fill="var(--solid)"/>' + svgText(mx.toFixed(1), (my + 5).toFixed(1), w, 13, 'var(--muted)');
  });
  s += lab;
  const OUT = [[-14, 5], [-4, -12], [8, -11], [17, 8], [0, 23]], HALO = ' paint-order="stroke" stroke="var(--solid)" stroke-width="4" stroke-linejoin="round"';
  NAMES.forEach((n, i) => {
    const [x, y] = POS[i], hot = full && (i === a || i === b);
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + (hot ? 7 : 5) + '" fill="' + (hot ? 'var(--accent)' : 'var(--ink)') + '"/>' + svgText(x + OUT[i][0], y + OUT[i][1], n, 16, 'var(--ink)', HALO);
  });
  return svgFrame('-12 -12 296 188', 296, tr('кръгов път между пет селища с километри', 'кільцева дорога між п’ятьма селами з кілометрами')) + s + '</svg>';
}
function drawNetLoop(q){
  return '<div class="ask">' + tr('На схемата са показани разстоянията в километри между съседните селища A, B, C, D и E по кръговия път. Само между две от селата разстоянията са едни и същи в двете посоки. Кои са тези две села?',
    'На схемі показано відстані в кілометрах між сусідніми селами A, B, C, D і E кільцевою дорогою. Лише між двома селами відстані однакові в обидва боки. Які це два села?') + '</div>' +
    '<div class="fig maze">' + ring(q, false) + '</div>';
}
const sums = (q, i, j) => { const one = q.km.slice(i, j), two = q.km.slice(j).concat(q.km.slice(0, i)); return [one.join(' + ') + ' = ' + arc(q.km, i, j), two.join(' + ') + ' = ' + arc(q.km, i, j)]; };
const eqNetLoop = q => { const [i, j] = q.eq, s = sums(q, i, j); return NAMES[i] + ' – ' + NAMES[j] + ': ' + s[0] + tr(' и ', ' і ') + s[1]; };
function whyNetLoop(q, full){
  if(!full) return tr('От едно село до друго може да се иде в две посоки по кръга. За всяка двойка сметни двата пътя и виж кога са равни. Двата пътя заедно правят целия кръг.',
    'Від одного села до іншого можна йти в два боки кільцем. Для кожної пари порахуй обидва шляхи й дивись, коли вони рівні. Обидва шляхи разом — це все коло.');
  const [i, j] = q.eq, s = sums(q, i, j);
  return tr('Двата пътя между ' + NAMES[i] + ' и ' + NAMES[j] + ' са равни: ', 'Обидва шляхи між ' + NAMES[i] + ' і ' + NAMES[j] + ' рівні: ') + ring(q, true) + '<div><b>' + s[0] + tr(' и ', ' і ') + s[1] + '</b></div>';
}
KIND.netloop = { draw:drawNetLoop, eq:eqNetLoop, why:whyNetLoop };
