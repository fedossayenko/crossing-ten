// Question kind 'symeq': level 160 ■ ∆ ○ — Three figures stand for numbers; find one of them.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2023, 1 клас, задача 9: ■ + ■ + ■ = 21, ■ + ∆ + ∆ = 17, ∆ + ○ + ∆ = 16 — ○? Each line
// brings in one new figure: ■ is 7 (7 + 7 + 7), then ∆ + ∆ = 10 so ∆ is 5, then ○ = 16 − 10 = 6.
function genSymChain(){
  for(;;){
    const k = 2 + rnd(2), x = 2 + rnd(k === 3 ? 6 : 9), y = 1 + rnd(9), z = 1 + rnd(9);
    if(x === y || y === z || x === z || x + 2*y > 20 || 2*y + z > 20) continue;
    return {kind:'symeq', shape:'chain', k, x, y, z, s1: k*x, s2: x + 2*y, s3: 2*y + z, ans: z};
  }
}
// МБГ Пролет 2025, 1 клас, задача 9: ■ + ∆ = 5, ∆ + ○ = 8, ■ + ○ = 7 — ○? The three lines hold every
// figure twice, so 5 + 8 + 7 = 20 is two of each: ■ + ∆ + ○ = 10, and ○ = 10 − 5 = 5.
function genSymTri(){
  for(;;){
    const x = 1 + rnd(9), y = 1 + rnd(9), z = 1 + rnd(9);
    if(x === y || y === z || x === z || x + y + z > 10) continue;   // the three lines together stay within 20
    const ask = rnd(3);
    return {kind:'symeq', shape:'tri', x, y, z, s1: x + y, s2: y + z, s3: x + z, ask, ans: [x, y, z][ask]};
  }
}
function genSymEq(){ return Math.random() < 0.5 ? genSymChain() : genSymTri(); }

const SYMS = ['■', '∆', '○'];
const symEqLines = q => q.shape === 'chain'
  ? [Array(q.k).fill('■').join(' + ') + ' = ' + q.s1, '■ + ∆ + ∆ = ' + q.s2, '∆ + ○ + ∆ = ' + q.s3]
  : ['■ + ∆ = ' + q.s1, '∆ + ○ = ' + q.s2, '■ + ○ = ' + q.s3];
const symEqAsk = q => q.shape === 'chain' ? '○' : SYMS[q.ask];
function drawSymEq(q){
  if(q.kind === 'symeq'){
    return '<div class="ask">' + tr('Еднаквите фигури са едно и също число. Колко е <b>' + symEqAsk(q) + '</b>, ако:',
      'Однакові фігури — це одне й те саме число. Скільки дорівнює <b>' + symEqAsk(q) + '</b>, якщо:') + '</div>' +
      '<div class="eqs">' + symEqLines(q).map(l => '<span>' + l + '</span>').join('') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)"><span class="num">' + symEqAsk(q) + ' = </span>' + SLOT + '</div>';
  }
}
function eqSymEq(q){
  if(q.kind === 'symeq') return symEqLines(q).join(', ') + ' → ' + symEqAsk(q) + ' = ' + q.ans;
}
function whySymEq(q, full){
  if(q.kind === 'symeq' && q.shape === 'chain'){
    if(!full) return tr('Започни от реда, в който има само ■. После всеки следващ ред има само една нова фигура.',
      'Почни з рядка, де є тільки ■. Далі в кожному наступному рядку лише одна нова фігура.');
    return Array(q.k).fill(q.x).join(' + ') + ' = ' + q.s1 + ' &nbsp;→&nbsp; ■ = <b>' + q.x + '</b> &nbsp;→&nbsp; ∆ + ∆ = ' + q.s2 + ' − ' + q.x + ' = ' + (2*q.y) +
      ', ' + q.y + ' + ' + q.y + ' = ' + 2*q.y + ' &nbsp;→&nbsp; ∆ = <b>' + q.y + '</b> &nbsp;→&nbsp; ○ = ' + q.s3 + ' − ' + 2*q.y + ' = ' + q.ans;
  }
  if(q.kind === 'symeq'){
    if(!full) return tr('Събери трите реда. Колко пъти е вътре всяка фигура?', 'Додай три рядки. Скільки разів у них кожна фігура?');
    const all = q.s1 + q.s2 + q.s3, half = all / 2, other = [q.s2, q.s3, q.s1][q.ask];   // the line without the asked figure
    return q.s1 + ' + ' + q.s2 + ' + ' + q.s3 + ' = ' + all + tr(' — всяка фигура е вътре два пъти', ' — кожна фігура тут двічі') +
      ' &nbsp;→&nbsp; ■ + ∆ + ○ = <b>' + half + '</b> (' + half + ' + ' + half + ' = ' + all + ') &nbsp;→&nbsp; ' +
      symEqAsk(q) + ' = ' + half + ' − ' + other + ' = ' + q.ans;
  }
}
KIND.symeq = { draw:drawSymEq, eq:eqSymEq, why:whySymEq };
