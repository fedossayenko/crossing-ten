// Question kind 'buyleft': level 148 Колко останаха? — Money, a few things bought at one price, what is left.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно 2022, задача 2: Рая had 92 ст. and bought two decorations at 14 ст. each: 14 + 14 = 28, 92 − 28 = 64.
// The traps are 28 (what she spent) and 78 (one decoration only). Two or three things, added up, not multiplied.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genBuyLeft(){
  for(;;){
    const M = 50 + rnd(50), k = 2 + rnd(2), p = 8 + rnd(18), spent = k*p;
    if(M - spent < 5) continue;
    return {kind:'buyleft', M, k, p, spent, traps:[spent, M - p], ans: M - spent};
  }
}
function drawBuyLeft(q){
  if(q.kind === 'buyleft'){
    return '<div class="ask">' + tr('Рая имала <span class="num">' + q.M + '</span> ст. Купила си ' + ['', '', 'две', 'три'][q.k] + ' играчки за украса на елхата по <span class="num">' + q.p + '</span> ст. Колко стотинки са останали на Рая?',
      'Рая мала <span class="num">' + q.M + '</span> ст. Вона купила ' + ['', '', 'дві', 'три'][q.k] + ' прикраси на ялинку по <span class="num">' + q.p + '</span> ст. Скільки стотинок залишилося в Раї?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + ' <span class="unit">' + tr('ст.', 'ст.') + '</span></div>';
  }
}
function eqBuyLeft(q){
  if(q.kind === 'buyleft') return q.M + ' − ' + Array(q.k).fill(q.p).join(' − ') + ' = ' + q.ans;
}
function whyBuyLeft(q, full){
  if(q.kind === 'buyleft'){
    if(!full) return tr('Колко стотинки струват всички играчки заедно? После ги извади.', 'Скільки стотинок коштують усі прикраси разом? Потім відніми.');
    return Array(q.k).fill(q.p).join(' + ') + ' = <b>' + q.spent + '</b> &nbsp;→&nbsp; ' + q.M + ' − ' + q.spent + ' = ' + q.ans;
  }
}
KIND.buyleft = { draw:drawBuyLeft, eq:eqBuyLeft, why:whyBuyLeft };
