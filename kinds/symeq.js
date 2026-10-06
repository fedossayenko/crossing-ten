// Question kind 'symeq': level 160 ■ ∆ ○ — Three figures stand for numbers; find one of them.

// МБГ Пролет 2023, 1 клас, задача 9: ■ + ■ + ■ = 21, ■ + ∆ + ∆ = 17, ∆ + ○ + ∆ = 16 — ○? Each line
// brings in one new figure: ■ is 7 (7 + 7 + 7), then ∆ + ∆ = 10 so ∆ is 5, then ○ = 16 − 10 = 6.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
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
// МБГ Пролет 2022, 1 клас, задача 4: □ = 2, ∆ = □ + □ − 1 — □ + ∆? ∆ = 2 + 2 − 1 = 3, and 2 + 3 = 5.
// Пролет 2021, задача 4: □ = 6, ∆ = □ − 1 — □ + 4 + ∆ − 5 = 6 + 4 + 5 − 5 = 10. One figure given,
// the next written with it, then a short sum of both. df: ∆ = □ + □ − j, □ − j or □ + j.
function genSymDef(){
  for(;;){
    const k = 1 + rnd(9), df = rnd(3), j = df === 0 ? rnd(3) : 1 + rnd(3), tri = [2*k - j, k - j, k + j][df];
    const ask = rnd(2), p = ask ? 1 + rnd(9) : 0, m = ask ? 1 + rnd(9) : 0, ans = k + p + tri - m;
    if(tri < 1 || tri === k || tri > 15 || ans < 0 || ans > 20 || (ask && (m === p || m > k + p + tri))) continue;
    return {kind:'symeq', shape:'def', k, df, j, tri, ask, p, m, ans};
  }
}
// МБГ Пролет 2022, 1 клас, задача 10: ○ + ● + □ = 12, ○ + ● = 7, ● + □ = 8 — ●? The first two lines differ
// only by □: □ = 12 − 7 = 5, then ● = 8 − 5 = 3. Пролет 2021, задача 10: the same start, then □ = ○ + 2:
// □ = 5, ○ = 3, ● = 7 − 3 = 4. rel: the third line ties □ to ○ instead of adding ● and □.
function genSymPart(){
  for(;;){
    const o = 1 + rnd(9), f = 1 + rnd(9), s = 1 + rnd(9), rel = Math.random() < 0.5;
    if(o === f || f === s || o === s || o + f + s > 20 || (rel && s <= o)) continue;
    return {kind:'symeq', shape:'part', rel, o, f, s, T: o + f + s, a: o + f, b: f + s, d: s - o, ans: f};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 9: ▲ + ◆ + ☺ = 12, ▲ + ▲ = 8, ☺ + ☺ + ▲ = 10 — ◆? ▲ + ▲ = 8 gives ▲ = 4,
// then ☺ + ☺ = 10 − 4 = 6, so ☺ = 3, and ◆ = 12 − 4 − 3 = 5. The paper's own figures, ▲ ◆ ☺.
function genSymDouble(){
  for(;;){
    const x = 2 + rnd(5), y = 1 + rnd(6), z = 1 + rnd(8);
    if(x === y || y === z || x === z) continue;
    return {kind:'symeq', shape:'double', x, y, z, s1: x + z + y, s2: 2*x, s3: 2*y + x, ans: z};
  }
}
// МБГ Полуфинал 2022, 1 клас, задача 4: □ = 3, ∆ = □ + □ + □ — ∆ − □? ∆ = 3 + 3 + 3 = 9, and 9 − 3 = 6.
// Sometimes ∆ + □ is asked, or ∆ itself.
function genSymTriple(){
  for(;;){
    const k = 2 + rnd(5), ask = rnd(3), ans = [2*k, 4*k, 3*k][ask];
    if(ans > 20) continue;
    return {kind:'symeq', shape:'triple', k, ask, tri: 3*k, traps: [ask === 2 ? 2*k : 3*k], ans};
  }
}
// МБГ Полуфинал 2022, 1 клас, задача 11: ○ —(+1)→ 5 —(+□)→ ○ + ○ — □? The first arrow says ○ + 1 = 5, so ○ = 4;
// then ○ + ○ = 8, and 5 + □ = 8 gives □ = 3.
function genSymArrow(){
  for(;;){
    const x = 2 + rnd(8), a = 1 + rnd(3);
    if(x - a < 1) continue;
    return {kind:'symeq', shape:'arrow', x, a, b: x + a, traps: [x, 2*x], ans: x - a};
  }
}
// МБГ Полуфинал 2023, 1 клас, задача 9: □ + □ + □ = 6, ☻ + ☻ = 8, ☻ + ʘ + □ = 11 — ʘ? □ = 2 and ☻ = 4, each
// from a line of its own, then ʘ = 11 − 4 − 2 = 5. The paper's own figures, □ ☻ ʘ.
function genSymDirect(){
  for(;;){
    const x = 1 + rnd(5), y = 1 + rnd(8), z = 1 + rnd(8);
    if(x === y || y === z || x === z || x + y + z > 20) continue;
    return {kind:'symeq', shape:'direct', x, y, z, s1: 3*x, s2: 2*y, s3: y + z + x, ans: z};
  }
}
// 'double' (Полуфинал 2024) takes half of the chain's old share; 'direct', 'triple' and 'arrow' (Полуфинал 2022
// and 2023) take slices of the tri, def and part shares — so the other shapes keep their seeds
export function genSymEq(){ const r = Math.random(); return r < 0.15 ? genSymChain() : r < 0.3 ? genSymDouble() : r < 0.45 ? genSymTri() : r < 0.55 ? genSymDirect() : r < 0.63 ? genSymTriple() : r < 0.8 ? genSymDef() : r < 0.94 ? genSymPart() : genSymArrow(); }

const SYMS = ['■', '∆', '○'];
const symDefOf = q => ['□ + □ − ' + q.j, '□ − ' + q.j, '□ + ' + q.j][q.df].replace(' − 0', '');
const symEqLines = q => q.shape === 'chain'
  ? [Array(q.k).fill('■').join(' + ') + ' = ' + q.s1, '■ + ∆ + ∆ = ' + q.s2, '∆ + ○ + ∆ = ' + q.s3]
  : q.shape === 'def' ? ['□ = ' + q.k, '∆ = ' + symDefOf(q)]
  : q.shape === 'triple' ? ['□ = ' + q.k, '∆ = □ + □ + □']
  : q.shape === 'arrow' ? ['○ + ' + q.a + ' = ' + q.b, q.b + ' + □ = ○ + ○']
  : q.shape === 'direct' ? ['□ + □ + □ = ' + q.s1, '☻ + ☻ = ' + q.s2, '☻ + ʘ + □ = ' + q.s3]
  : q.shape === 'part' ? ['○ + ● + □ = ' + q.T, '○ + ● = ' + q.a, q.rel ? '□ = ○ + ' + q.d : '● + □ = ' + q.b]
  : q.shape === 'double' ? ['▲ + ◆ + ☺ = ' + q.s1, '▲ + ▲ = ' + q.s2, '☺ + ☺ + ▲ = ' + q.s3]
  : ['■ + ∆ = ' + q.s1, '∆ + ○ = ' + q.s2, '■ + ○ = ' + q.s3];
const symEqAsk = q => q.shape === 'chain' ? '○' : q.shape === 'double' ? '◆' : q.shape === 'def' ? (q.ask ? '□ + ' + q.p + ' + ∆ − ' + q.m : '□ + ∆') : q.shape === 'part' ? '●'
  : q.shape === 'triple' ? ['∆ − □', '∆ + □', '∆'][q.ask] : q.shape === 'arrow' ? '□' : q.shape === 'direct' ? 'ʘ' : SYMS[q.ask];
// 'arrow' is drawn as the paper prints it: one row, each arrow with what it adds written under it
const symArrow = lbl => '<span style="display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; line-height:1; margin:0 .3em">⟶<small>' + lbl + '</small></span>';
const symArrowRow = q => '<span style="white-space:nowrap">○' + symArrow('+' + q.a) + q.b + symArrow('+□') + '○ + ○</span>';
function drawSymEq(q){
  return '<div class="ask">' + tr('Еднаквите фигури са едно и също число. Колко е <b>' + symEqAsk(q) + '</b>, ако:',
    'Однакові фігури — це одне й те саме число. Скільки дорівнює <b>' + symEqAsk(q) + '</b>, якщо:') + '</div>' +
    '<div class="eqs">' + (q.shape === 'arrow' ? symArrowRow(q) : symEqLines(q).map(l => '<span>' + l + '</span>').join('')) + '</div>' +
    '<div class="line xl"><span class="num">' + symEqAsk(q) + ' = </span>' + SLOT + '</div>';
}
function eqSymEq(q){
  return symEqLines(q).join(', ') + ' → ' + symEqAsk(q) + ' = ' + q.ans;
}
function whySymEq(q, full){
  if(q.shape === 'triple'){
    if(!full) return tr('Първо намери ∆ — това е □, събрано три пъти. После сложи числата на мястото на фигурите.',
      'Спершу знайди ∆ — це □, додане тричі. Потім постав числа замість фігур.');
    return '∆ = ' + q.k + ' + ' + q.k + ' + ' + q.k + ' = <b>' + q.tri + '</b>' + (q.ask === 2 ? '' : ' &nbsp;→&nbsp; ' + q.tri + (q.ask ? ' + ' : ' − ') + q.k + ' = ' + q.ans);
  }
  if(q.shape === 'arrow'){
    if(!full) return tr('Първата стрелка ти казва колко е ○.', 'Перша стрілка підказує, скільки дорівнює ○.');
    return '○ + ' + q.a + ' = ' + q.b + ' &nbsp;→&nbsp; ○ = ' + q.b + ' − ' + q.a + ' = <b>' + q.x + '</b> &nbsp;→&nbsp; ○ + ○ = ' + q.x + ' + ' + q.x + ' = <b>' + 2*q.x +
      '</b> &nbsp;→&nbsp; ' + q.b + ' + □ = ' + 2*q.x + ' &nbsp;→&nbsp; □ = ' + 2*q.x + ' − ' + q.b + ' = ' + q.ans;
  }
  if(q.shape === 'direct'){
    if(!full) return tr('Започни от реда, в който има само □. После намери ☻, а накрая — ʘ.',
      'Почни з рядка, де є тільки □. Потім знайди ☻, а наприкінці — ʘ.');
    return q.x + ' + ' + q.x + ' + ' + q.x + ' = ' + q.s1 + ' &nbsp;→&nbsp; □ = <b>' + q.x + '</b> &nbsp;→&nbsp; ' + q.y + ' + ' + q.y + ' = ' + q.s2 + ' &nbsp;→&nbsp; ☻ = <b>' + q.y +
      '</b> &nbsp;→&nbsp; ʘ = ' + q.s3 + ' − ' + q.y + ' − ' + q.x + ' = ' + q.ans;
  }
  if(q.shape === 'def'){
    if(!full) return tr('Първо намери ∆ — той е записан чрез □. После сложи числата на мястото на фигурите.',
      'Спершу знайди ∆ — його записано через □. Потім постав числа замість фігур.');
    return '∆ = ' + symDefOf(q).replace(/□/g, q.k) + ' = <b>' + q.tri + '</b> &nbsp;→&nbsp; ' + symEqAsk(q).replace('□', q.k).replace('∆', q.tri) + ' = ' + q.ans;
  }
  if(q.shape === 'part'){
    if(!full) return tr('Сравни първите два реда: какво има в първия, а го няма във втория?',
      'Порівняй перші два рядки: що є в першому, але немає в другому?');
    return '□ = ' + q.T + ' − ' + q.a + ' = <b>' + q.s + '</b> &nbsp;→&nbsp; ' + (q.rel
      ? '○ = ' + q.s + ' − ' + q.d + ' = <b>' + q.o + '</b> &nbsp;→&nbsp; ● = ' + q.a + ' − ' + q.o + ' = ' + q.ans
      : '● = ' + q.b + ' − ' + q.s + ' = ' + q.ans);
  }
  if(q.shape === 'double'){
    if(!full) return tr('Започни от реда, в който има само ▲. После намери ☺, а накрая — ◆.',
      'Почни з рядка, де є тільки ▲. Потім знайди ☺, а наприкінці — ◆.');
    return q.x + ' + ' + q.x + ' = ' + q.s2 + ' &nbsp;→&nbsp; ▲ = <b>' + q.x + '</b> &nbsp;→&nbsp; ☺ + ☺ = ' + q.s3 + ' − ' + q.x + ' = ' + 2*q.y +
      ', ' + q.y + ' + ' + q.y + ' = ' + 2*q.y + ' &nbsp;→&nbsp; ☺ = <b>' + q.y + '</b> &nbsp;→&nbsp; ◆ = ' + q.s1 + ' − ' + q.x + ' − ' + q.y + ' = ' + q.ans;
  }
  if(q.shape === 'chain'){
    if(!full) return tr('Започни от реда, в който има само ■. После всеки следващ ред има само една нова фигура.',
      'Почни з рядка, де є тільки ■. Далі в кожному наступному рядку лише одна нова фігура.');
    return Array(q.k).fill(q.x).join(' + ') + ' = ' + q.s1 + ' &nbsp;→&nbsp; ■ = <b>' + q.x + '</b> &nbsp;→&nbsp; ∆ + ∆ = ' + q.s2 + ' − ' + q.x + ' = ' + (2*q.y) +
      ', ' + q.y + ' + ' + q.y + ' = ' + 2*q.y + ' &nbsp;→&nbsp; ∆ = <b>' + q.y + '</b> &nbsp;→&nbsp; ○ = ' + q.s3 + ' − ' + 2*q.y + ' = ' + q.ans;
  }
  if(!full) return tr('Събери трите реда. Колко пъти е вътре всяка фигура?', 'Додай три рядки. Скільки разів у них кожна фігура?');
  const all = q.s1 + q.s2 + q.s3, half = all / 2, other = [q.s2, q.s3, q.s1][q.ask];   // the line without the asked figure
  return q.s1 + ' + ' + q.s2 + ' + ' + q.s3 + ' = ' + all + tr(' — всяка фигура е вътре два пъти', ' — кожна фігура тут двічі') +
    ' &nbsp;→&nbsp; ■ + ∆ + ○ = <b>' + half + '</b> (' + half + ' + ' + half + ' = ' + all + ') &nbsp;→&nbsp; ' +
    symEqAsk(q) + ' = ' + half + ' − ' + other + ' = ' + q.ans;
}
KIND.symeq = { draw:drawSymEq, eq:eqSymEq, why:whySymEq };
