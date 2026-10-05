// Question kind 'seg': level 40 AD = ? — Overlapping lengths along a line.

// Задача 11: four points in a row, measured in overlapping pieces.
// МБГ Пролет 2025, задача 11: AB = 41 мм, BC = 2 см, CD = 39 мм, and AD asked in дециметри. All in
// millimetres first: 41 + 20 + 39 = 100 мм, which is 1 дм.
import { CM, KIND, SLOT, lineSvg, rnd, tr } from '../js/core.js';
function genSegUnits(){
  for(;;){
    const cm = 1 + rnd(5), ab = 11 + rnd(60), cd = 100*(1 + rnd(2)) - ab - 10*cm;
    if(cd < 11 || cd > 89) continue;
    return {kind:'seg', shape:'units', ab, cm, cd, traps:[ab + cm + cd], ans: (ab + 10*cm + cd) / 100};
  }
}
export function genSeg(){
  if(Math.random() < 0.2) return genSegUnits();
  if(Math.random() < 0.4) return genRuler();
  const p = 2 + rnd(6), q = 1 + rnd(4), r = 2 + rnd(7);
  return {kind:'seg', p, q, r, AB: p + q, CD: q + r, ans: p + q + r};
}
// МБГ Пролет 2023 and 2025, 1 клас: the same four points. 2023 asks AD from AB = 6 мм, CD = 9 мм, CB = 2 мм
// (13 мм); 2025 gives the whole AD = 15 см and the two outer pieces AC = 5 см, BD = 7 см, and asks the middle
// CB: 15 − 5 − 7 = 3.
export function genSegShort(){
  const p = 2 + rnd(6), q = 1 + rnd(4), r = 2 + rnd(7);
  if(Math.random() < 0.5) return {kind:'seg', mm: Math.random() < 0.5, p, q, r, AB: p + q, CD: q + r, ans: p + q + r};
  return {kind:'seg', shape:'cb', p, q, r, AD: p + q + r, traps:[p + q + r - p, p + r], ans: q};
}
// Задача 14: the segments are not given, they are read off the ruler — the length is the
// difference of the two marks, not the mark the segment ends at.
function genRuler(){
  for(;;){
    const a = 1 + rnd(3), b = a + 2 + rnd(4);
    const c = a + 1 + rnd(3), d = c + 2 + rnd(5);
    if(d > 13 || c >= b || d <= b) continue;   // they overlap and neither swallows the other, so both must be read
    return {kind:'seg', shape:'ruler', a, b, c, d, AB: b - a, CD: d - c, ans: (b - a) + (d - c)};
  }
}
// A ruler with the two bracketed segments standing above it.
function rulerSvg(q){
  const W = 232, n = 14, u = (W - 16) / n, x = v => 8 + v*u;
  const top = 44, H = top + 46;
  let ticks = '';
  for(let v = 0; v <= n; v++){
    const h = v % 5 === 0 ? 13 : 7;
    ticks += '<line x1="' + x(v).toFixed(1) + '" y1="' + top + '" x2="' + x(v).toFixed(1) +
             '" y2="' + (top + h) + '"/>';
  }
  let nums = '';
  for(let v = 0; v <= n; v += 1) if(v % 2 === 0)
    nums += '<text x="' + x(v).toFixed(1) + '" y="' + (top + 30) + '" text-anchor="middle" font-size="9" ' +
            'fill="var(--muted)" font-family="Nunito, sans-serif">' + v + '</text>';
  const bracket = (from, to, y, l1, l2) =>
    '<g stroke="var(--accent)" stroke-width="2" fill="none">' +
    '<path d="M' + x(from).toFixed(1) + ' ' + y + 'H' + x(to).toFixed(1) + '"/>' +
    '<path d="M' + x(from).toFixed(1) + ' ' + y + 'V' + top + 'M' + x(to).toFixed(1) + ' ' + y + 'V' + top +
    '" stroke-dasharray="3 3" stroke-width="1.4"/></g>' +
    '<text x="' + (x(from) - 8).toFixed(1) + '" y="' + (y + 4) + '" text-anchor="middle" font-size="13" ' +
    'font-weight="700" fill="var(--ink)" font-family="Nunito, sans-serif">' + l1 + '</text>' +
    '<text x="' + (x(to) + 8).toFixed(1) + '" y="' + (y + 4) + '" text-anchor="middle" font-size="13" ' +
    'font-weight="700" fill="var(--ink)" font-family="Nunito, sans-serif">' + l2 + '</text>';
  return '<div class="fig"><svg viewBox="-20 0 ' + (W + 40) + ' ' + H + '" role="img" aria-label="' + tr('две отсечки върху линийка', 'два відрізки на лінійці') + '">' +
    '<rect x="8" y="' + top + '" width="' + (W - 16) + '" height="26" rx="2" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' +
    '<g stroke="var(--ink)" stroke-width="1.1">' + ticks + '</g>' + nums +
    bracket(q.a, q.b, 12, 'A', 'B') + bracket(q.c, q.d, 30, 'C', 'D') + '</svg></div>';
}
function segUnitsSvg(q){
  const W = 236, tot = q.ab + 10*q.cm + q.cd, at = v => 14 + v / tot * (W - 28);
  /** @type {[number, string][]} */
  const pts = [[at(0), 'A'], [at(q.ab), 'B'], [at(q.ab + 10*q.cm), 'C'], [at(tot), 'D']];
  return '<div class="fig wide"><svg viewBox="0 -12 ' + W + ' 44" role="img" aria-label="' + tr('четири точки върху отсечка', 'чотири точки на відрізку') + '">' +
    '<line x1="' + at(0) + '" y1="0" x2="' + at(tot) + '" y2="0" stroke="var(--ink)" stroke-width="2"/>' +
    pts.map(pt => '<circle cx="' + pt[0].toFixed(1) + '" cy="0" r="3.4" fill="var(--ink)"/><text x="' + pt[0].toFixed(1) + '" y="24" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)" font-family="Nunito, sans-serif">' + pt[1] + '</text>').join('') + '</svg></div>';
}
function segSvg(q){
  const W = 236, tot = q.p + q.q + q.r;
  const at = v => 14 + v / tot * (W - 28);
  /** @type {[number, string][]} */
  const pts = [[at(0), 'A'], [at(q.p), 'C'], [at(q.p + q.q), 'B'], [at(tot), 'D']];
  return '<div class="fig"><svg viewBox="0 -12 ' + W + ' 44" role="img" aria-label="' + tr('четири точки върху права', 'чотири точки на прямій') + '">' +
    '<line x1="4" y1="0" x2="' + (W - 4) + '" y2="0" stroke="var(--ink)" stroke-width="2"/>' +
    pts.map(pt => '<circle cx="' + pt[0].toFixed(1) + '" cy="0" r="3.4" fill="var(--ink)"/>' +
      '<text x="' + pt[0].toFixed(1) + '" y="24" text-anchor="middle" font-size="15" font-weight="700" ' +
      'fill="var(--ink)" font-family="Nunito, sans-serif">' + pt[1] + '</text>').join('') +
    '</svg></div>';
}

function drawSeg(q){
  if(q.shape === 'units'){
    return '<div class="ask">' + tr('Намерете в <b>дециметри</b> дължината на отсечката AD, ако AB = <span class="num">' + q.ab + '</span> мм, BC = <span class="num">' + q.cm + '</span> см и CD = <span class="num">' + q.cd + '</span> мм.',
      'Знайдіть у <b>дециметрах</b> довжину відрізка AD, якщо AB = <span class="num">' + q.ab + '</span> мм, BC = <span class="num">' + q.cm + '</span> см і CD = <span class="num">' + q.cd + '</span> мм.') + '</div>' +
      segUnitsSvg(q) + '<div class="line lg">' + SLOT + ' <span class="unit">дм</span></div>';
  }
  if(q.shape === 'ruler'){
    return tr('<div class="ask">Колко сантиметра е <b>сборът</b> от дължините на отсечките <b>AB</b> и <b>CD</b>?</div>',
      '<div class="ask">Скільки сантиметрів становить <b>сума</b> довжин відрізків <b>AB</b> і <b>CD</b>?</div>') +
      rulerSvg(q) +
      '<div class="line md">' + SLOT + CM + '</div>';
  }
  if(q.shape === 'cb'){
    return '<div class="ask">CB = ? см</div>' + segSvg(q) +
      '<div class="given" style="font-size:clamp(15px,4vw,20px)">AD = ' + q.AD + ' см &nbsp; AC = ' +
      q.p + ' см &nbsp; BD = ' + q.r + ' см</div>' +
      '<div class="line md">' + SLOT + CM + '</div>';
  }
  const u = q.mm ? ' мм' : ' см';
  return '<div class="ask">AD = ?' + u + '</div>' + segSvg(q) +
    '<div class="given" style="font-size:clamp(15px,4vw,20px)">AB = ' + q.AB + u + ' &nbsp; CD = ' +
    q.CD + u + ' &nbsp; CB = ' + q.q + u + '</div>' +
    '<div class="line md">' + SLOT + (q.mm ? ' <span class="unit">мм</span>' : CM) + '</div>';
}
function eqSeg(q){
  if(q.shape === 'units') return q.ab + ' + ' + 10*q.cm + ' + ' + q.cd + ' = ' + (q.ans*100) + ' мм = ' + q.ans + ' дм';
  if(q.shape === 'ruler') return 'AB ' + q.a + '→' + q.b + ', CD ' + q.c + '→' + q.d + ' → ' + q.ans;
  if(q.shape === 'cb') return 'AD ' + q.AD + ', AC ' + q.p + ', BD ' + q.r + ' → CB ' + q.ans;
  return 'AB ' + q.AB + ', CD ' + q.CD + ', CB ' + q.q + ' → AD ' + q.ans;
}
function whySeg(q, full){
  if(q.shape === 'units'){
    if(!full) return tr('Първо всичко в милиметри: колко милиметра е един сантиметър, и колко — един дециметър?', 'Спершу все в міліметрах: скільки міліметрів в одному сантиметрі, а скільки — в одному дециметрі?');
    return q.cm + ' см = <b>' + 10*q.cm + '</b> мм &nbsp;→&nbsp; ' + q.ab + ' + ' + 10*q.cm + ' + ' + q.cd + ' = <b>' + q.ans*100 + '</b> мм &nbsp;→&nbsp; ' + tr('100 мм = 1 дм, значи ', '100 мм = 1 дм, отже ') + q.ans;
  }
  if(q.shape === 'ruler'){
    if(!full) return tr('Дължината не е числото, до което стига отсечката — гледай и откъде тръгва.',
      'Довжина — це не число, до якого доходить відрізок: дивись і на те, звідки він починається.');
    const from = tr('от ', 'від '), to = tr(' до ', ' до ');
    return 'AB: ' + from + q.a + to + q.b + ' &nbsp;→&nbsp; <b>' + q.AB + '</b>, &nbsp;CD: ' + from + q.c +
      to + q.d + ' &nbsp;→&nbsp; <b>' + q.CD + '</b> &nbsp;→&nbsp; ' + q.AB + ' + ' + q.CD + ' = ' + q.ans;
  }
  if(q.shape === 'cb'){
    if(!full) return tr('AC, CB и BD заедно правят цялата AD.', 'AC, CB і BD разом складають увесь AD.');
    const L = q.p + q.q + q.r;
    return 'CB = AD − AC − BD = ' + L + ' − ' + q.p + ' − ' + q.r + ' = ' + q.ans +
      lineSvg([{at:0, name:'A'}, {at:q.p, name:'C'}, {at:q.p + q.q, name:'B'}, {at:L, name:'D'}],
        [{from:0, to:L, row:-2, label:'AD ' + L, step:1}, {from:0, to:q.p, row:1, label:'AC ' + q.p, col:'var(--accent)', step:3},
         {from:q.p + q.q, to:L, row:1, label:'BD ' + q.r, col:'var(--accent)', step:5}, {from:q.p, to:q.p + q.q, row:2, label:'CB ' + q.q, col:'var(--warm)', step:7}], 0, L, tr('отсечките от A до D', 'відрізки від A до D'));
  }
  if(!full) return tr('Отсечките се застъпват — намери първо AC.', 'Відрізки накладаються — спочатку знайди AC.');
  // the four points, then AB and CB measured, AC what is left, then CD and the whole AD
  return 'AC = AB − CB = ' + q.AB + ' − ' + q.q + ' = <b>' + q.p + '</b> &nbsp;→&nbsp; AD = AC + CD = ' +
    q.p + ' + ' + q.CD + ' = ' + q.ans +
    lineSvg([{at:0, name:'A'}, {at:q.p, name:'C'}, {at:q.p + q.q, name:'B'}, {at:q.p + q.q + q.r, name:'D'}],
      [{from:0, to:q.p + q.q, row:-2, label:'AB ' + q.AB, step:1}, {from:q.p, to:q.p + q.q, row:1, label:'CB ' + q.q, step:3},
       {from:0, to:q.p, row:2, label:'AC ' + q.p, col:'var(--warm)', step:5}, {from:q.p, to:q.p + q.q + q.r, row:-3, label:'CD ' + q.CD, step:7},
       {from:0, to:q.p + q.q + q.r, row:3, label:'AD ' + q.ans, col:'var(--good)', step:9}], 0, q.p + q.q + q.r, tr('отсечките от A до D', 'відрізки від A до D'));
}
KIND.seg = { draw:drawSeg, eq:eqSeg, why:whySeg };
