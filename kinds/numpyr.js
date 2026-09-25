// Question kind 'numpyr': level 124 Пирамиди от числа — Two number pyramids that share a row, and the stars at their tips.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2024, задача 7: in the upper pyramid each box is the sum of the two below it, in the
// lower one of the two above; the rows joined by = are the same. From 0, 1, 1 and the 3 and 6
// shown, the base is 0, 1, 1, 2, 1, so the top star is 19; the lower pyramid stands on 2, 1, 14,
// so its star is 3 + 15 = 18, and 19 − 18 = 1.
function genNumPyr(){
  for(;;){
    const b = [rnd(4), rnd(5), 1 + rnd(4), 1 + rnd(5), rnd(6)], z = 5 + rnd(16);
    const r1 = b.slice(1).map((v, i) => b[i] + v), r2 = r1.slice(1).map((v, i) => r1[i] + v), r3 = r2.slice(1).map((v, i) => r2[i] + v);
    const top = r3[0] + r3[1], bot = b[3] + 2*b[4] + z, asks = rnd(3);
    if(asks === 2 && top <= bot) continue;
    return {kind:'numpyr', b, z, r1, r2, top, bot, asks, ans: asks === 0 ? top : asks === 1 ? bot : top - bot};
  }
}
function numPyrSvg(q){
  const w = 30, h = 24, cell = (x, y, t, star) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (star ? 'var(--solid)' : 'none') + '" stroke="var(--ink)" stroke-width="1.4"/>' +
    (t === '' ? '' : '<text x="' + (x + w/2) + '" y="' + (y + 17) + '" text-anchor="middle" font-size="14" font-weight="800" fill="' + (star ? 'var(--accent)' : 'var(--ink)') + '" font-family="Nunito, sans-serif">' + t + '</text>');
  let s = '';
  // the upper pyramid: row r from the top has r + 1 boxes; what the paper shows is filled in
  const shown = [['★'], ['', ''], ['', '', q.r2[2]], [q.r1[0], '', q.r1[2], ''], [q.b[0], q.b[1], q.b[2], '', '']];
  shown.forEach((row, r) => row.forEach((t, i) => { s += cell((4 - r)*w/2 + i*w, r*h, t, t === '★'); }));
  s += cell(5*w, 4*h, q.z);
  for(let i = 0; i < 6; i++) s += '<text x="' + (i*w + w/2) + '" y="' + (5*h + 17) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--muted)" font-family="Nunito, sans-serif">‖</text>';
  [q.b[0], q.b[1], q.b[2], '', '', ''].forEach((t, i) => { s += cell(i*w, 6*h, t); });
  s += cell(3.5*w, 7*h, '') + cell(4.5*w, 7*h, '') + cell(4*w, 8*h, '★', true);
  return '<div class="fig tall"><svg viewBox="-4 -4 ' + (6*w + 8) + ' ' + (9*h + 8) + '" role="img" aria-label="' + tr('две пирамиди от числа', 'дві піраміди з чисел') + '">' + s + '</svg></div>';
}
function drawNumPyr(q){
  if(q.kind === 'numpyr'){
    const ask = q.asks === 2 ? tr('Колко е <b>разликата</b> от числата, които трябва да се запишат на мястото на звездичките?', 'Чому дорівнює <b>різниця</b> чисел, які треба записати замість зірочок?')
      : tr('Кое число трябва да се запише на мястото на звездичката в <b>' + (q.asks ? 'долната' : 'горната') + '</b> пирамида?', 'Яке число треба записати замість зірочки в <b>' + (q.asks ? 'нижній' : 'верхній') + '</b> піраміді?');
    return '<div class="ask">' + tr('В горната пирамида всяко число е сборът от двете под него, а в долната — от двете над него. Редовете, свързани с ‖, са еднакви. ',
      'У верхній піраміді кожне число — сума двох під ним, а в нижній — двох над ним. Ряди, з’єднані знаком ‖, однакові. ') + ask + '</div>' +
      numPyrSvg(q) + '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqNumPyr(q){
  if(q.kind === 'numpyr') return tr('долният ред ', 'нижній ряд ') + q.b.join(', ') + ' → ★ ' + q.top + ', ★ ' + q.bot + ' → ' + q.ans;
}
function whyNumPyr(q, full){
  if(q.kind === 'numpyr'){
    if(!full) return tr('Първо допълни най-долния ред на горната пирамида: кое число с известното до него дава числото над тях?', 'Спершу доповни найнижчий ряд верхньої піраміди: яке число разом із сусіднім дає число над ними?');
    const [b0, b1, b2, b3, b4] = q.b;
    const up = q.r1[2] + ' − ' + b2 + ' = <b>' + b3 + '</b>, ' + q.r2[2] + ' − ' + q.r1[2] + ' = ' + q.r1[3] + ', ' + q.r1[3] + ' − ' + b3 + ' = <b>' + b4 + '</b>';
    const top = tr('горе: ', 'угорі: ') + q.r2.join(', ') + ' → ' + (q.r2[0] + q.r2[1]) + ', ' + (q.r2[1] + q.r2[2]) + ' → <b>' + q.top + '</b>';
    const bot = tr('долу: ', 'унизу: ') + b3 + ', ' + b4 + ', ' + q.z + ' → ' + (b3 + b4) + ', ' + (b4 + q.z) + ' → <b>' + q.bot + '</b>';
    return up + ' &nbsp;→&nbsp; ' + (q.asks === 1 ? bot : q.asks === 0 ? top : top + '; ' + bot + ' &nbsp;→&nbsp; ' + q.top + ' − ' + q.bot + ' = ' + q.ans);
  }
}
KIND.numpyr = { draw:drawNumPyr, eq:eqNumPyr, why:whyNumPyr };
