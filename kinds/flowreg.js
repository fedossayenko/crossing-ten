// Question kind 'flowreg': level 390 Цветя в две фигури — Flowers lie among a rectangle, a triangle and a circle: how many are in one but not in another.

// Кенгуру 2019, задача 6: the bee Maya takes pollen from every flower that is inside the rectangle but outside the triangle (the circle
// is only there to confuse), 9. The flowers are scattered by quota: a of them in the rectangle only (the answer), b in both, c in the
// triangle only, d in neither, the circle crossing all of it. Which two figures are meant is drawn from the three (any of the three may be the
// one that counts or the one to stay outside of), the printed question being the rectangle and the triangle with 9.
import { KIND, answerLine, rnd, shuffle, svgFrame, tr, SVG_FONT } from '../js/core.js';
const W = 290, H = 244, RECT = [100, 30, 70, 202], CIRC = [135, 88, 72], TRI = [[135, 62], [14, 174], [256, 174]];
// the figure in Bulgarian, and in Ukrainian in the genitive (всередині), the instrumental (поза) and the locative (у)
const NAME = { rect: ['правоъгълника', 'прямокутника', 'прямокутником', 'прямокутнику'], tri: ['триъгълника', 'трикутника', 'трикутником', 'трикутнику'], circ: ['кръга', 'кола', 'колом', 'колі'] };
const segs = pts => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
const SEGS = { rect: segs([[RECT[0], RECT[1]], [RECT[0] + RECT[2], RECT[1]], [RECT[0] + RECT[2], RECT[1] + RECT[3]], [RECT[0], RECT[1] + RECT[3]]]), tri: segs(TRI) };
const segDist = (x, y, [[ax, ay], [bx, by]]) => { const t = Math.max(0, Math.min(1, ((x - ax)*(bx - ax) + (y - ay)*(by - ay)) / ((bx - ax)**2 + (by - ay)**2))); return Math.hypot(x - ax - t*(bx - ax), y - ay - t*(by - ay)); };
const inFig = {
  rect: (x, y) => x > RECT[0] && x < RECT[0] + RECT[2] && y > RECT[1] && y < RECT[1] + RECT[3],
  circ: (x, y) => Math.hypot(x - CIRC[0], y - CIRC[1]) < CIRC[2],
  tri: (x, y) => { const s = (a, b) => (b[0] - a[0])*(y - a[1]) - (b[1] - a[1])*(x - a[0]), d = [s(TRI[0], TRI[1]), s(TRI[1], TRI[2]), s(TRI[2], TRI[0])]; return d.every(v => v > 0) || d.every(v => v < 0); },
};
// how far a spot is from the outline of every figure: a flower never sits on a line
const clear = (x, y) => Math.min(...SEGS.rect.concat(SEGS.tri).map(s => segDist(x, y, s)), Math.abs(Math.hypot(x - CIRC[0], y - CIRC[1]) - CIRC[2]));
export function genFlowReg(){
  const printed = rnd(6) === 0;
  for(;;){
    const [x, y] = printed ? ['rect', 'tri'] : shuffle(['rect', 'tri', 'circ']).slice(0, 2);
    const a = printed ? 9 : 6 + rnd(7), b = 3 + rnd(5), c = 3 + rnd(4), d = 2 + rnd(4);
    if(b === a || c === a) continue;
    const quota = { '10': a, '11': b, '01': c, '00': d }, pts = [];
    let tries = 0;
    while(pts.length < a + b + c + d && tries++ < 4000){
      const px = 14 + rnd(W - 28), py = 14 + rnd(H - 28), k = (inFig[x](px, py) ? 1 : 0) + '' + (inFig[y](px, py) ? 1 : 0);
      if(quota[k] <= 0 || clear(px, py) < 10 || pts.some(p => Math.hypot(p[0] - px, p[1] - py) < 19)) continue;
      quota[k]--; pts.push([px, py]);
    }
    if(pts.length < a + b + c + d) continue;
    return {kind:'flowreg', x, y, flowers: shuffle(pts), a, b, ans: a, traps:[a + b, b]};
  }
}
const FLOWER = '🌼';
function pic(q, mark){
  const ink = f => 'fill="color-mix(in srgb, var(--' + f + ') 12%, transparent)" stroke="var(--' + f + ')" stroke-width="2.4"';
  let s = '<rect x="' + RECT[0] + '" y="' + RECT[1] + '" width="' + RECT[2] + '" height="' + RECT[3] + '" ' + ink('accent') + '/>' +
    '<polygon points="' + TRI.map(p => p.join(',')).join(' ') + '" ' + ink('bad') + ' stroke-linejoin="round"/>' +
    '<circle cx="' + CIRC[0] + '" cy="' + CIRC[1] + '" r="' + CIRC[2] + '" ' + ink('good') + '/>';
  q.flowers.forEach(([px, py]) => {
    if(mark && inFig[q.x](px, py) && !inFig[q.y](px, py)) s += '<circle cx="' + px + '" cy="' + py + '" r="11" fill="none" stroke="var(--ink)" stroke-width="2.4"/>';
    s += '<text x="' + px + '" y="' + py + '" font-size="15" text-anchor="middle" dominant-baseline="central" ' + SVG_FONT + '>' + FLOWER + '</text>';
  });
  s += '<text x="' + (W - 16) + '" y="26" font-size="22" text-anchor="middle" dominant-baseline="central" ' + SVG_FONT + '>🐝</text>';
  return svgFrame('0 0 ' + W + ' ' + H, 330, tr('правоъгълник, триъгълник и кръг, застъпващи се, с цветчета наоколо', 'прямокутник, трикутник і коло, що перетинаються, з квітками навколо')) + s + '</svg>';
}
function drawFlowReg(q){
  return '<div class="ask">' + tr('Пчеличката Мая събрала цветен прашец от всяко цветче, което е вътре в ' + NAME[q.x][0] + ', но е <b>извън</b> ' + NAME[q.y][0] + '. От колко цветчета е събрала прашец Мая?',
    'Бджілка Мая зібрала пилок з кожної квітки, що всередині ' + NAME[q.x][1] + ', але <b>поза</b> ' + NAME[q.y][2] + '. Зі скількох квіток зібрала пилок Мая?') + '</div>' + pic(q, false) + answerLine('md');
}
function eqFlowReg(q){
  return (q.a + q.b) + ' − ' + q.b + ' = ' + q.ans;
}
function whyFlowReg(q, full){
  if(!full) return tr('Първо намери цветчетата вътре в ' + NAME[q.x][0] + '. После не брой онези от тях, които са и в ' + NAME[q.y][0] + '.', 'Спершу знайди квіти всередині ' + NAME[q.x][1] + '. Потім не рахуй тих із них, що й у ' + NAME[q.y][3] + '.');
  return pic(q, true) + '<div style="text-align:center">' + tr('Обградени са цветчетата вътре в ' + NAME[q.x][0] + ' и извън ' + NAME[q.y][0] + ': ' + (q.a + q.b) + ' вътре, от тях ' + q.b + ' са и в другата фигура: ' + (q.a + q.b) + ' − ' + q.b + ' = ' + q.ans + '.',
    'Обведено квіти всередині ' + NAME[q.x][1] + ' і поза ' + NAME[q.y][2] + ': ' + (q.a + q.b) + ' всередині, з них ' + q.b + ' і в другій фігурі: ' + (q.a + q.b) + ' − ' + q.b + ' = ' + q.ans + '.') + '</div>';
}
KIND.flowreg = { draw:drawFlowReg, eq:eqFlowReg, why:whyFlowReg };
