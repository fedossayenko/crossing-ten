// Question kind 'between': level 179 Калинка и пчела — Two numbers squeezed in order between two bounds;
// every sum they can make. Generator, drawing, summary line and hints for this kind all live here; the
// level itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, 1 клас, задача 19: 5 − 2 < калинка < пчела < 5 + 2. Between 3 and 7 are only 4, 5
// and 6, and the ladybird is the smaller: 4 + 5 = 9, 4 + 6 = 10, 5 + 6 = 11 — three answers.
function genBetween(){
  const p = 4 + rnd(9), s1 = 1 + rnd(3), s2 = 4 - s1, lo = p - s1;
  return {kind:'between', p, s1, s2, lo, hi: p + s2, slots:3, ans: 2*lo + 3, alt:[2*lo + 4, 2*lo + 5]};
}
// a ladybird and a bee, drawn the size of a digit
const LADYBIRD = '<svg class="ic" viewBox="-12 -12 24 24" aria-hidden="true"><circle cx="0" cy="-8" r="4" fill="var(--ink)"/>' +
  '<circle cx="0" cy="1" r="9" fill="var(--bad)"/><path d="M0,-8 V10" stroke="var(--ink)" stroke-width="1.4"/>' +
  '<g fill="var(--ink)"><circle cx="-4" cy="-2" r="1.8"/><circle cx="4" cy="-2" r="1.8"/><circle cx="-4.5" cy="5" r="1.8"/><circle cx="4.5" cy="5" r="1.8"/></g></svg>';
const BEE = '<svg class="ic" viewBox="-13 -12 26 24" aria-hidden="true"><ellipse cx="-3" cy="-7" rx="4" ry="5" fill="var(--solid)" stroke="var(--ink)" stroke-width="1"/>' +
  '<ellipse cx="3" cy="-7" rx="4" ry="5" fill="var(--solid)" stroke="var(--ink)" stroke-width="1"/>' +
  '<ellipse cx="0" cy="2" rx="10" ry="7" fill="var(--lemon)" stroke="var(--ink)" stroke-width="1.2"/>' +
  '<path d="M-3,-4.5 V8.5 M3,-4.5 V8.5" stroke="var(--ink)" stroke-width="2.4"/><circle cx="7" cy="0" r="1.2" fill="var(--ink)"/></svg>';
const betweenRow = q => '<span style="white-space:nowrap">' + q.p + ' − ' + q.s1 + ' &lt; ' + LADYBIRD + ' &lt; ' + BEE + ' &lt; ' + q.p + ' + ' + q.s2 + '</span>';
function drawBetween(q){
  if(q.kind === 'between'){
    return '<div class="ask">' + tr('Калинката и пчеличката са числа. Кои са <b>всички</b> възможни стойности на ' + LADYBIRD + ' + ' + BEE + ', ако',
      'Сонечко і бджілка — це числа. Які <b>всі</b> можливі значення ' + LADYBIRD + ' + ' + BEE + ', якщо') + '</div>' +
      '<div class="given" style="font-size:clamp(20px,6vw,30px)">' + betweenRow(q) + '</div>' +
      '<div class="line" style="font-size:clamp(26px,7vw,42px)">' + SLOT + ', <span class="slot" id="slot1"></span>, <span class="slot" id="slot2"></span></div>';
  }
}
function eqBetween(q){
  if(q.kind === 'between') return (q.lo + 1) + ', ' + (q.lo + 2) + ', ' + (q.lo + 3) + ' → ' + q.ans + ', ' + q.alt.join(', ');
}
function whyBetween(q, full){
  if(q.kind === 'between'){
    if(!full) return tr('Пресметни двата края и изпиши числата между тях. Калинката е по-малкото число.',
      'Обчисли обидва краї і випиши числа між ними. Сонечко — менше число.');
    const a = q.lo + 1, b = q.lo + 2, c = q.lo + 3;
    return q.p + ' − ' + q.s1 + ' = ' + q.lo + tr(' и ', ' і ') + q.p + ' + ' + q.s2 + ' = ' + q.hi + tr(' &nbsp;→&nbsp; между тях са само <b>', ' &nbsp;→&nbsp; між ними лише <b>') +
      a + ', ' + b + tr('</b> и <b>', '</b> і <b>') + c + '</b> &nbsp;→&nbsp; ' + LADYBIRD + ' + ' + BEE + ': ' +
      a + ' + ' + b + ' = ' + q.ans + ', ' + a + ' + ' + c + ' = ' + q.alt[0] + ', ' + b + ' + ' + c + ' = ' + q.alt[1];
  }
}
KIND.between = { draw:drawBetween, eq:eqBetween, why:whyBetween };
