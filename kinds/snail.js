// Question kind 'snail': level 58 Охлювът — Up by day, back by night — when the top is reached.

// Задача 20: a snail that climbs by day and slips back by night. It only has to reach the
// top once, so the last climb is not followed by a slip — the slipping stops there.
import { KIND, SLOT, UK_PLURAL, popAt, rnd, svgText, tr } from '../js/core.js';
export function genSnail(){
  for(;;){
    const up = 5 + rnd(6), down = 2 + rnd(up - 3);
    const gain = up - down;
    const H = up + 1 + rnd(30);
    const k = Math.ceil((H - up) / gain);
    if(k < 2 || k > 12) continue;
    return {kind:'snail', H, up, down, gain, k, ans: 2*k + 1};
  }
}

const snailM = n => ({one:'метр', few:'метри', many:'метрів'})[UK_PLURAL.select(n)] || 'метра';
function drawSnail(q){
  return tr('<div class="ask">Един охлюв се катери по дървена греда, висока <span class="num">' + q.H +
    '</span> метра. През деня се изкачва <span class="num">' + q.up +
    '</span> метра нагоре, а през нощта се смъква <span class="num">' + q.down +
    '</span> метра надолу. След колко <b>дни</b> охлювът ще стигне върха, ако тръгва от земята?</div>',
    '<div class="ask">Равлик повзе по дерев’яній жердині заввишки <span class="num">' + q.H +
    '</span> ' + snailM(q.H) + '. Удень він піднімається на <span class="num">' + q.up +
    '</span> ' + snailM(q.up) + ' вгору, а вночі сповзає на <span class="num">' + q.down +
    '</span> ' + snailM(q.down) + ' вниз. Через скільки <b>днів</b> равлик доповзе до верху, якщо починає від землі?</div>') +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('дни', 'днів') + '</span></div>';
}
function eqSnail(q){
  return q.H + ' м, +' + q.up + '/−' + q.down + ' → ' + q.ans;
}
// The climb as a zigzag: a stroke a day (up, orange) and a night (down, blue), numbered under it, against the
// top of the beam and the dashed height he must reach by the last night (H − up). A long climb shows its first two
// days and nights, then … and its last day, night and day. The hint draws a short climb with no numbers at all:
// the last stroke reaches the top and stops there.
function snailSvg(q, full){
  const svg = (h, g) => '<svg viewBox="0 0 300 ' + h + '" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' +
    tr('охлювът: нагоре денем, надолу нощем', 'равлик: удень угору, уночі вниз') + '">' + g + '</svg>';
  const stroke = (x0, y0, x1, y1, up) => '<line x1="' + x0.toFixed(1) + '" y1="' + y0.toFixed(1) + '" x2="' + x1.toFixed(1) + '" y2="' + y1.toFixed(1) +
    '" stroke="' + (up ? 'var(--warm)' : 'var(--accent)') + '" stroke-width="3" stroke-linecap="round"/>';
  const top = (x0, x1, y) => '<line x1="' + x0 + '" y1="' + y.toFixed(1) + '" x2="' + x1 + '" y2="' + y.toFixed(1) + '" stroke="var(--good)" stroke-width="2.5"/>';
  if(!full){
    const H = 10, at = [0, 4, 2, 6, 4, 8, 6, 10], Y = v => 96 - v * 8, X = i => 60 + i * 26;
    let g = top(40, 260, Y(H)) + '<line x1="40" y1="96" x2="260" y2="96" stroke="var(--line)" stroke-width="2"/>';
    for(let i = 1; i < at.length; i++) g += stroke(X(i - 1), Y(at[i - 1]), X(i), Y(at[i]), i % 2);
    return svg(106, g + '<circle cx="' + X(at.length - 1) + '" cy="' + Y(H) + '" r="6" fill="var(--good)"/>');
  }
  const n = 2*q.k + 1, seg = [];
  let h = 0;
  for(let i = 1; i <= n; i++){ const to = i % 2 ? Math.min(h + q.up, q.H) : h - q.down; seg.push([i, h, to]); h = to; }
  const shown = n > 9 ? seg.slice(0, 4).concat([null], seg.slice(-3)) : seg, w = 26, Y = v => 138 - v * 110 / q.H;
  let x = 52, g = '', step = 0;
  const end = 52 + (shown.length - (n > 9 ? 1 : 0)) * w + (n > 9 ? 24 : 0);
  g += top(40, end + 6, Y(q.H)) + svgText(22, Y(q.H) + 4, q.H, 12, 'var(--good)') +
    '<line x1="40" y1="' + Y(q.H - q.up).toFixed(1) + '" x2="' + (end + 6) + '" y2="' + Y(q.H - q.up).toFixed(1) + '" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 4"/>' +
    svgText(22, Y(q.H - q.up) + 4, q.H - q.up, 12, 'var(--muted)') + '<line x1="40" y1="138" x2="' + (end + 6) + '" y2="138" stroke="var(--line)" stroke-width="2"/>';
  shown.forEach(s => {
    if(!s){ g += svgText(x + 12, 108, '…', 16, 'var(--muted)'); x += 24; return; }
    const [i, from, to] = s;
    g += '<g' + popAt(step++ * 0.6) + '>' + stroke(x, Y(from), x + w, Y(to), i % 2) + svgText(x + w/2, 154, i, 10, i % 2 ? 'var(--warm)' : 'var(--accent)') + '</g>';
    if(i === n - 1) g += '<g' + popAt(step * 0.6) + '><circle cx="' + (x + w) + '" cy="' + Y(to).toFixed(1) + '" r="4" fill="var(--ink)"/>' + svgText(x + w, Y(to) + 18, to, 11, 'var(--ink)') + '</g>';
    x += w;
  });
  g += svgText(250, 14, tr('ден', 'день'), 11, 'var(--warm)') + svgText(282, 14, tr('нощ', 'ніч'), 11, 'var(--accent)');
  return svg(184, g + svgText(150, 178, q.k + ' × 2 + 1 = ' + q.ans, 15, 'var(--ink)', popAt(step * 0.6 + 1)));
}
function whySnail(q, full){
  if(!full) return tr('Всяко денонощие го качва с малко, но последното изкачване няма връщане назад.',
    'Кожна доба піднімає його трохи вище, але після останнього підйому він уже не сповзає.') + snailSvg(q, false);
  const before = q.gain * (q.k - 1);
  return tr('за всяко денонощие печели ', 'за кожну добу він просувається на ') + q.up + ' − ' + q.down + ' = <b>' + q.gain +
    tr('</b> м &nbsp;→&nbsp; трябва преди последното изкачване да е на ', '</b> м &nbsp;→&nbsp; перед останнім підйомом він має бути на висоті ') +
    q.H + ' − ' + q.up + ' = <b>' + (q.H - q.up) +
    tr('</b> м или повече &nbsp;→&nbsp; това става след ' + q.k + ' денонощия (',
       '</b> м або вище &nbsp;→&nbsp; так буде після ' + q.k + ' діб (') +
    (q.gain*q.k) + ' м) &nbsp;→&nbsp; ' + q.k + ' × 2 + 1 = ' + q.ans + snailSvg(q, true);
}
KIND.snail = { draw:drawSnail, eq:eqSnail, why:whySnail };
