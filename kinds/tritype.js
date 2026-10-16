// Question kind 'tritype': level 283 Вид триъгълник — Equilateral, isosceles or scalene, by the sides.

// Аз и числата 2022, задача 6: three triangles with their sides written — 3, 3, 3 is равностранен, 4, 4, 2
// равнобедрен, 4, 6, 5 разностранен. Count the equal sides: three, two, none. The trap is the equilateral one,
// which has two equal sides as well: the school calls it by its own name. Аз и числата 2024, задача 12 (shape
// 'name'): the three names from their definitions — «Триъгълник с три различни страни се нарича …».
// Аз и числата 2025, задача 7, and 2026, задача 9, ask the same of a drawing judged by eye (2026 writes two of
// the sides); here the sides are always written, and the triangle is drawn to scale, so it looks what it is.
// A name cannot be typed: the three come as the paper lists them, А. равностранен, Б. равнобедрен, В. разностранен.
import { KIND, rnd, svgText, tr } from '../js/core.js';
const TT_NAMES = [['равностранен', 'рівносторонній'], ['равнобедрен', 'рівнобедрений'], ['разностранен', 'різносторонній']];
// a name is too long for half a card's width: the .vw span lays the three out one under another (app.css)
const ttOptions = t => ({ options: TT_NAMES.map((n, id) => ({ id, v: id, text: /** @type {[string, string]} */ (n.map(w => '<span class="vw">' + w + '</span>')) })), pick: t, own: true, ans: t });
// the apex of a triangle on a base along the x axis: [x, height], from the base and the two other sides
const triApex = (base, left, right) => { const x = (base*base + left*left - right*right) / (2*base); return [x, Math.sqrt(Math.max(0, left*left - x*x))]; };
export function genTriType(){
  const t = rnd(3);   // the three kinds equally often
  if(Math.random() < 0.25) return Object.assign({kind:'tritype', shape:'name', t}, ttOptions(t));
  for(;;){
    const mul = Math.random() < 0.2 ? 5 : 1, a = 2 + rnd(8), b = 2 + rnd(8), c = 2 + rnd(8);
    let s;   // [base, left side, right side]
    if(t === 0) s = [a, a, a];
    else if(t === 1){ if(Math.abs(b - a) < 2 || b > 2*a - 2) continue; s = [b, a, a]; }   // the odd side across, the two equal ones up
    else {
      const [x, y, z] = [a, b, c].sort((p, q) => q - p);
      if(x === y || y === z || x > y + z - 2) continue;
      s = Math.random() < 0.5 ? [x, y, z] : [x, z, y];   // the longest across
    }
    if(triApex(s[0], s[1], s[2])[1] < 0.3*s[0]) continue;   // not so flat that it reads as a line
    return Object.assign({kind:'tritype', shape:'sides', s: s.map(v => v*mul), u:'см', t}, ttOptions(t));
  }
}
// A triangle drawn to scale, its base across, each side labelled outside its middle (labels: a text per side,
// base, left, right; null leaves a side bare). The labels are written base, left, right, so `last` (0–2) is
// the one written last: a solution ending on a side's length ends on that label.
export function triSideSvg(s, labels, opt){
  const [base, left, right] = s, [ax, ay] = triApex(base, left, right);
  const minX = Math.min(0, ax), w = Math.max(base, ax) - minX, u = Math.min(150 / w, 96 / Math.max(ay, 1));
  const P = [[0, 0], [base*u, 0], [ax*u, -ay*u]], G = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
  const ends = [[0, 1], [0, 2], [1, 2]], last = opt && opt.last !== undefined ? opt.last : 2;
  const lab = i => {
    if(!labels[i]) return '';
    // out from the middle of the side, clear of it by the label's own half width (sideways) or half height (up and down)
    const [p, q] = ends[i].map(k => P[k]), m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = [m[0] - G[0], m[1] - G[1]], n = Math.hypot(d[0], d[1]) || 1;
    const nx = d[0] / n, ny = d[1] / n, off = 6 + Math.abs(nx)*String(labels[i]).length*3.8 + Math.abs(ny)*7;
    return svgText((m[0] + off*nx).toFixed(1), (m[1] + off*ny + 5).toFixed(1), labels[i], 13, opt && opt.hot === i ? 'var(--warm)' : 'var(--ink)');
  };
  const x0 = minX*u - 50, y0 = -ay*u - 24, W = w*u + 100, H = ay*u + 48;
  return '<svg viewBox="' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + W.toFixed(1) + ' ' + H.toFixed(1) + '"' + (opt && opt.style ? ' style="' + opt.style + '"' : '') +
    ' role="img" aria-label="' + tr('триъгълник и страните му', 'трикутник і його сторони') + '">' +
    '<path d="M' + P.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>' +
    [0, 1, 2].filter(i => i !== last).concat(last).map(lab).join('') + '</svg>';
}
const ttLen = (q, i) => q.s[i] + ' ' + q.u;
// [Bulgarian, Ukrainian, Ukrainian after «з»]
const TT_DEF = [['три равни', 'три рівні', 'трьома рівними'], ['две равни', 'дві рівні', 'двома рівними'], ['три различни', 'три різні', 'трьома різними']];
function drawTriType(q){
  if(q.shape === 'name') return '<div class="ask">' + tr('Триъгълник с <b>' + TT_DEF[q.t][0] + '</b> страни се нарича …', 'Трикутник із <b>' + TT_DEF[q.t][2] + '</b> сторонами називається …') + '</div>';
  return '<div class="ask">' + tr('Какъв вид е триъгълникът според дължините на страните?', 'Який це трикутник за довжинами сторін?') + '</div>' +
    '<div class="fig">' + triSideSvg(q.s, [0, 1, 2].map(i => ttLen(q, i))) + '</div>';
}
function eqTriType(q){
  const nm = tr(TT_NAMES[q.t][0], TT_NAMES[q.t][1]);
  if(q.shape === 'name') return tr(TT_DEF[q.t][0], TT_DEF[q.t][1]) + tr(' страни', ' сторони') + ' → ' + nm;
  return [0, 1, 2].map(i => ttLen(q, i)).join(', ') + ' → ' + nm;
}
function whyTriType(q, full){
  if(q.shape === 'name'){
    if(!full) return tr('Всяко от трите имена казва нещо за страните. Кое казва точно това?', 'Кожна з трьох назв щось каже про сторони. Яка каже саме це?');
    return tr(['<b>равно</b>странен — <b>равни</b> страни, и трите', '<b>равно</b>бедрен — две <b>равни</b> страни, двете бедра', '<b>разно</b>странен — <b>различни</b> страни, и трите'][q.t],
      ['<b>рівно</b>сторонній — <b>рівні</b> сторони, усі три', '<b>рівно</b>бедрений — дві <b>рівні</b> сторони, бічні', '<b>різно</b>сторонній — <b>різні</b> сторони, усі три'][q.t]) +
      ' &nbsp;→&nbsp; <b>' + tr(TT_NAMES[q.t][0], TT_NAMES[q.t][1]) + '</b>';
  }
  if(!full) return tr('Сравни трите страни: колко от тях са равни?', 'Порівняй три сторони: скільки з них рівні?');
  const L = [0, 1, 2].map(i => ttLen(q, i)), nm = '<b>' + tr(TT_NAMES[q.t][0], TT_NAMES[q.t][1]) + '</b>';
  if(q.t === 0) return L.join(' = ') + tr(': и трите страни са равни', ': усі три сторони рівні') + ' &nbsp;→&nbsp; ' + nm +
    tr(' (има и две равни, но щом са три, се казва равностранен)', ' (є й дві рівні, але коли рівні всі три, він рівносторонній)');
  if(q.t === 1) return L[1] + ' = ' + L[2] + tr(', а третата е ', ', а третя — ') + L[0] + tr(': две равни страни', ': дві рівні сторони') + ' &nbsp;→&nbsp; ' + nm;
  return L.join(', ') + tr(': няма две равни', ': немає двох рівних') + ' &nbsp;→&nbsp; ' + nm;
}
KIND.tritype = { draw:drawTriType, eq:eqTriType, why:whyTriType };
