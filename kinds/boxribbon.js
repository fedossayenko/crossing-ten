// Question kind 'boxribbon': level 434 Лента около кутия — A ribbon tied round a box both ways, and a bow: how long is the ribbon.

// Кенгуру 2024, 2 клас, задача 13: a box 1 m high, 1 m wide and 2 m long, tied with a ribbon round it both ways (once round the height and width, once round
// the height and length, crossing on top), 1 m of the ribbon in the bow: 4 + 6 + 1 = 11 m (the paper's key B). The sizes are drawn from small ones and the
// bow is 1 m or 2 m. The box is drawn on a slant (the front face, the top and the right side), the two loops as they run over them. The answer is typed.
import { KIND, SLOT, SVG_FONT, rnd, svgFrame, tr, ukN } from '../js/core.js';
// the whole ribbon: round the height and the width, round the height and the length, and the bow
export const ribbonLen = (h, w, l, bow) => 2 * (h + w) + 2 * (h + l) + bow;
export function genBoxRibbon(){
  for(;;){
    const h = 1 + rnd(2), w = 1 + rnd(2), l = 2 + rnd(2), bow = 1 + rnd(2);
    if(w >= l) continue;
    return {kind:'boxribbon', h, w, l, bow, traps:[ribbonLen(h, w, l, 0), 2 * (h + w + l)], ans: ribbonLen(h, w, l, bow)};
  }
}
const S = 46;
function box(q){
  const L = q.l * S, H = q.h * S, dx = q.w * S * 0.55, dy = -q.w * S * 0.5, x0 = 42, y0 = 14 - dy + 4, xm = x0 + L / 2, HALO = ' paint-order="stroke" stroke="var(--solid)" stroke-width="4" stroke-linejoin="round"';
  const pt = (x, y) => x.toFixed(1) + ',' + y.toFixed(1), poly = (a, fill, op) => '<polygon points="' + a.map(p => pt(p[0], p[1])).join(' ') + '" fill="' + fill + '" fill-opacity="' + op + '" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
  let s = poly([[x0, y0], [x0 + L, y0], [x0 + L + dx, y0 + dy], [x0 + dx, y0 + dy]], 'var(--accent)', .14) + poly([[x0 + L, y0], [x0 + L + dx, y0 + dy], [x0 + L + dx, y0 + dy + H], [x0 + L, y0 + H]], 'var(--accent)', .34) + poly([[x0, y0], [x0 + L, y0], [x0 + L, y0 + H], [x0, y0 + H]], 'var(--accent)', .22);
  const rib = (a, b) => '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="var(--bad)" stroke-width="5" stroke-linecap="round"/>';
  s += rib([xm, y0 + H], [xm, y0]) + rib([xm, y0], [xm + dx, y0 + dy]) + rib([x0 + dx / 2, y0 + dy / 2], [x0 + L + dx / 2, y0 + dy / 2]) + rib([x0 + L + dx / 2, y0 + dy / 2], [x0 + L + dx / 2, y0 + dy / 2 + H]);
  s += '<text x="' + (xm + dx / 2).toFixed(1) + '" y="' + (y0 + dy / 2 + 9).toFixed(1) + '" text-anchor="middle" font-size="26" ' + SVG_FONT + '>🎀</text>';
  const lab = (x, y, t, anchor) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anchor + '" font-size="16" font-weight="800" fill="var(--ink)" ' + SVG_FONT + HALO + '>' + t + '</text>\n';
  s += lab(x0 + L / 2, y0 + H + 19, q.l + ' м', 'middle') + lab(x0 - 6, y0 + H / 2 + 6, q.h + ' м', 'end') + lab(x0 + L + dx / 2 + 14, y0 + dy / 2 - 10, q.w + ' м', 'start');
  const W = x0 + L + dx + 46, Hh = y0 + H + 28;
  return svgFrame('0 0 ' + W.toFixed(0) + ' ' + Hh.toFixed(0), W, tr('кутия, вързана с лента в двете посоки, с размери ' + q.h + ' м височина, ' + q.w + ' м ширина и ' + q.l + ' м дължина', 'коробка, зв’язана стрічкою в обидва боки, висота ' + q.h + ' м, ширина ' + q.w + ' м, довжина ' + q.l + ' м')) + s + '</svg>';
}
const mUk = n => ukN(n, 'метр', 'метри', 'метрів');
const m = n => tr(n + ' ' + (n === 1 ? 'метър' : 'метра'), mUk(n));
function drawBoxRibbon(q){
  return '<div class="ask">' + tr('Кутията с играчка в нея има размери: височина ' + m(q.h) + ', ширина ' + m(q.w) + ' и дължина ' + m(q.l) + '. Тя е вързана с лента, както е показано. Колко е дълга лентата, ако за възела е използван ' + m(q.bow) + ' от нея?',
    'Коробка з іграшкою в ній має розміри: висота ' + mUk(q.h) + ', ширина ' + mUk(q.w) + ' і довжина ' + mUk(q.l) + '. Вона зв’язана стрічкою, як показано. Яка довжина стрічки, якщо на бант використано ' + mUk(q.bow) + ' від неї?') + '</div>' +
    '<div class="fig maze">' + box(q) + '</div><div class="line xl">' + SLOT + ' <span class="unit">м</span></div>';
}
const loops = q => { const a = [q.h, q.w, q.h, q.w], b = [q.h, q.l, q.h, q.l]; return [a.join(' + ') + ' = ' + 2 * (q.h + q.w), b.join(' + ') + ' = ' + 2 * (q.h + q.l)]; };
const eqBoxRibbon = q => { const [a, b] = loops(q); return a + '; ' + b + '; ' + 2 * (q.h + q.w) + ' + ' + 2 * (q.h + q.l) + ' + ' + q.bow + ' = ' + q.ans; };
function whyBoxRibbon(q, full){
  if(!full) return tr('Лентата обикаля кутията два пъти. Първият път минава по височината и ширината, вторият — по височината и дължината. Сметни всеки кръг със страните му, после добави и възела.',
    'Стрічка обгортає коробку двічі. Перший раз іде по висоті й ширині, другий — по висоті й довжині. Порахуй кожне коло по його сторонах, потім додай і бант.');
  const [a, b] = loops(q);
  return box(q) + tr('Първи кръг (височина и ширина): ', 'Перше коло (висота й ширина): ') + a + tr('. Втори кръг (височина и дължина): ', '. Друге коло (висота й довжина): ') + b + tr('. С възела: ', '. З бантом: ') + '<b>' + 2 * (q.h + q.w) + ' + ' + 2 * (q.h + q.l) + ' + ' + q.bow + ' = ' + q.ans + '</b>';
}
KIND.boxribbon = { draw:drawBoxRibbon, eq:eqBoxRibbon, why:whyBoxRibbon };
