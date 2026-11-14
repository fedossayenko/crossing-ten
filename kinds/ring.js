// Question kind 'ring': level 115 Децата в кръг — Children in a circle, counted from both sides.

// МБГ Зима 2020, задача 19: to Петър's left, between him and Иван, 4 children; to his right 6. The
// two groups fill the circle between the two boys — and the boys themselves count: 4 + 6 + 2 = 12.
import { KIND, SVG_FONT, answerLine, numSpan, popAt, rnd, tr, ukN } from '../js/core.js';
export function genRing(){
  const l = 1 + rnd(9), r = 1 + rnd(9);
  if(Math.random() < 0.3) return genRingOpposite();
  return {kind:'ring', l, r, ans: l + r + 2};
}
// Салабашев 2023 #15 (shape 'opposite'): seats on a round carousel at equal distances, Невена on seat 3, exactly opposite Албена on seat 8: how many seats? The seats from
// one to the other are half the carousel, 8 − 3 = 5, and the same again on the other side: 5 + 5 = 10. Drawn after the old question.
function genRingOpposite(){
  const h = 3 + rnd(7), a = 1 + rnd(Math.min(6, h));   // seat b = a + h has to be one of the 2h seats
  return {kind:'ring', shape:'opposite', a, b: a + h, h, traps:[h], ans: 2*h};
}
function drawOpposite(q){
  return '<div class="ask">' + tr('Местата за сядане на кръгла въртележка са на равно разстояние едно от друго и са номерирани с 1, 2, 3, … и така нататък. Невена седи на място номер ' + numSpan(q.a) + ', точно срещу Албена, която е на място номер ' + numSpan(q.b) + '. <b>Колко места има на въртележката?</b>',
    'Місця для сидіння на круглій каруселі розташовані на однаковій відстані одне від одного й пронумеровані 1, 2, 3, … і так далі. Невена сидить на місці номер ' + numSpan(q.a) + ', точно навпроти Албени, яка на місці номер ' + numSpan(q.b) + '. <b>Скільки місць на каруселі?</b>') + '</div>' + answerLine('xl');
}
const eqOpposite = q => '(' + q.b + ' − ' + q.a + ') + (' + q.b + ' − ' + q.a + ') = ' + q.ans;
function whyOpposite(q, full){
  if(!full) return tr('Между две места, които са точно едно срещу друго, има точно половината от всички места — във всяка посока.', 'Між двома місцями, що точно одне навпроти одного, рівно половина всіх місць — у кожному напрямку.');
  return tr('от ' + q.a + ' до ' + q.b + ' е половината кръг: ', 'від ' + q.a + ' до ' + q.b + ' — півкола: ') + q.b + ' − ' + q.a + ' = <b>' + q.h + '</b> &nbsp;→&nbsp; ' + tr('другата половина е същата: ', 'інша половина така ж: ') + q.h + ' + ' + q.h + ' = ' + q.ans;
}
function drawRing(q){
  if(q.shape === 'opposite') return drawOpposite(q);
  return '<div class="ask">' + tr('Няколко деца са наредени в кръг. Отляво на Петър, между Петър и Иван, има <span class="num">' + q.l + '</span> ' + (q.l === 1 ? 'дете' : 'деца') + '. Отдясно на Петър, между Петър и Иван, има <span class="num">' + q.r + '</span> ' + (q.r === 1 ? 'дете' : 'деца') + '. Колко общо са децата в кръга?',
    'Кілька дітей стоять у колі. Ліворуч від Петра, між Петром та Іваном, <span class="num">' + ukN(q.l, 'дитина', 'дитини', 'дітей').replace(' ', '</span> ') + '. Праворуч від Петра, між Петром та Іваном, <span class="num">' + ukN(q.r, 'дитина', 'дитини', 'дітей').replace(' ', '</span> ') + '. Скільки всього дітей у колі?') + '</div>' +
    answerLine('xl');
}
function eqRing(q){
  if(q.shape === 'opposite') return eqOpposite(q);
  return q.l + ' + ' + q.r + ' + 2 = ' + q.ans;
}
// The circle, drawn for the hint and the solution. Петър at the bottom, the children to his left
// going one way round to Иван, those to his right the other way. The hint shows only the two boys
// and the two groups as arcs with their counts; the solution draws every child, one after another
// round the ring, and the two boys last — the step she missed.
export function ringSvg(q, full){
  const N = q.l + q.r + 2, R = 75, at = k => { const a = Math.PI/2 + k*2*Math.PI/N; return [100 + R*Math.cos(a), 100 + R*Math.sin(a)]; };
  const f = v => v.toFixed(1), col = k => k <= q.l ? 'var(--accent)' : 'var(--warm)';
  const boy = (k, name, d) => { const [x, y] = at(k);
    return '<g' + (full ? popAt(d) : '') + '><circle cx="' + f(x) + '" cy="' + f(y) + '" r="16" fill="var(--good)"/><text x="' + f(x) + '" y="' + f(y + 6) + '" text-anchor="middle" font-size="17" font-weight="800" fill="#fff" ' + SVG_FONT + '>' + name + '</text></g>'; };
  let g = '<circle cx="100" cy="100" r="' + R + '" fill="none" stroke="var(--line)" stroke-width="3"/>';
  if(full){
    // left 1…l, then right l+1…l+r, numbered in the order she would count them
    for(let k = 1; k <= q.l + q.r + 1; k++){
      if(k === q.l + 1) continue;                     // Иван's place
      const n = k <= q.l ? k : k - 1, [x, y] = at(k);
      g += '<g' + popAt(n) + '><circle cx="' + f(x) + '" cy="' + f(y) + '" r="10.5" fill="' + col(k) + '"/><text x="' + f(x) + '" y="' + f(y + 4.2) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff" ' + SVG_FONT + '>' + n + '</text></g>';
    }
  } else {
    // each group as a thick arc between the boys, its count beside it
    [[1, q.l], [q.l + 2, q.r]].forEach(([k0, c]) => {
      const [x0, y0] = at(k0 - 0.3), [x1, y1] = at(k0 + c - 0.7), [mx, my] = at(k0 + (c - 1) / 2), lx = 100 + (mx - 100) * 1.32, ly = 100 + (my - 100) * 1.32;
      g += '<path d="M' + f(x0) + ',' + f(y0) + ' A' + R + ',' + R + ' 0 ' + (c / N > 0.5 ? 1 : 0) + ' 1 ' + f(x1) + ',' + f(y1) + '" stroke="' + col(k0) + '" stroke-width="9" stroke-linecap="round" fill="none"/>' +
        '<text x="' + f(lx) + '" y="' + f(ly + 6) + '" text-anchor="middle" font-size="17" font-weight="800" fill="' + col(k0) + '" ' + SVG_FONT + '>' + c + '</text>';
    });
  }
  g += boy(0, tr('П', 'П'), q.l + q.r + 1) + boy(q.l + 1, tr('И', 'І'), q.l + q.r + 2);
  // and the count they make, in the middle, once everyone is in
  if(full) g += '<text' + popAt(q.l + q.r + 4) + ' x="100" y="116" text-anchor="middle" font-size="46" font-weight="800" fill="var(--ink)" font-family="Fredoka, Nunito, sans-serif">' + q.ans + '</text>';
  return '<svg viewBox="-12 -12 224 224" style="display:block; width:170px; max-width:100%; margin:4px auto 0" role="img" aria-label="' + tr('децата в кръга', 'діти в колі') + '">' + g + '</svg>';
}
function whyRing(q, full){
  if(q.shape === 'opposite') return whyOpposite(q, full);
  if(!full) return tr('Кой още е в кръга, освен децата между двете момчета?', 'Хто ще в колі, крім дітей між двома хлопцями?') + ringSvg(q, false);
  return q.l + tr(' отляво и ', ' ліворуч і ') + q.r + tr(' отдясно, и самите Петър и Иван', ' праворуч, і самі Петро та Іван') + ' &nbsp;→&nbsp; ' + q.l + ' + ' + q.r + ' + 2 = ' + q.ans + ringSvg(q, true);
}
KIND.ring = { draw:drawRing, eq:eqRing, why:whyRing };
