// Question kind 'andmore': level 119 И с толкова повече — One group, another with so many more: how many in all;
// level 265 Рибарите (shape 'fish') — the last one as much as all the others together.

// МБГ Зима 2020, задача 5: 12 girls and 7 more boys. The trap is 12 + 7: the boys are 12 + 7 = 19,
// and the children 12 + 19 = 31.
// МБГ Есен 2023, 3 клас, задача 9: four fishermen with four boats; three caught 8 kg each and the fourth as much as the
// three together. The fourth's catch is the three's again: 3 · 8 = 24, 24 + 24 = 48. The boats are only there to count.
import { KIND, SLOT, bgWith, rnd, tr, ukN } from '../js/core.js';
export function genAndMore(){
  const a = 5 + rnd(20), d = 2 + rnd(10), fewer = Math.random() < 0.3;
  if(fewer && d >= a) return genAndMore();
  return {kind:'andmore', a, d, fewer, b: fewer ? a - d : a + d, ans: fewer ? 2*a - d : 2*a + d};
}
// n fishermen, the first n − 1 with m kg each, the last with all of theirs together
export function genFishers(){
  const n = 3 + rnd(3), m = 3 + rnd(10);
  return {kind:'andmore', shape:'fish', n, m, traps: [n*m, (n - 1)*m], ans: 2*(n - 1)*m};
}
// men counted: двама, трима …; the same with the article; the boats; the last one
const FISH_BG = {2:'двама', 3:'трима', 4:'четирима', 5:'петима'}, FISH_BOATS = {3:'три', 4:'четири', 5:'пет'}, FISH_LAST = {3:'третият', 4:'четвъртият', 5:'петият'};
const FISH_UK = {2:'двоє', 3:'троє', 4:'четверо', 5:'п’ятеро'}, FISH_BOATS_UK = {3:'трьох', 4:'чотирьох', 5:'п’яти'}, FISH_LAST_UK = {3:'третій', 4:'четвертий', 5:'п’ятий'};
const fishCap = w => w[0].toUpperCase() + w.slice(1);
function drawFish(q){
  const o = q.n - 1;
  return '<div class="ask">' + tr(fishCap(FISH_BG[q.n]) + ' рибари с ' + FISH_BOATS[q.n] + ' лодки ловили риба. ' + fishCap(FISH_BG[o]) + ' от тях уловили по <span class="num">' + q.m +
      '</span> кг, а ' + FISH_LAST[q.n] + ' — колкото ' + FISH_BG[o] + 'та заедно. <b>Колко килограма риба общо са уловили рибарите?</b>',
    fishCap(FISH_UK[q.n]) + ' рибалок на ' + FISH_BOATS_UK[q.n] + ' човнах ловили рибу. ' + fishCap(FISH_UK[o]) + ' з них зловили по <span class="num">' + q.m +
      '</span> кг, а ' + FISH_LAST_UK[q.n] + ' — стільки, скільки ' + FISH_UK[o] + ' разом. <b>Скільки кілограмів риби всього зловили рибалки?</b>') + '</div>' +
    '<div class="line lg">' + SLOT + ' <span class="unit">' + tr('кг', 'кг') + '</span></div>';
}
function drawAndMore(q){
  if(q.shape === 'fish') return drawFish(q);
  return '<div class="ask">' + tr('На спортната площадка играят <span class="num">' + q.a + '</span> момичета и ' + bgWith(q.d) + ' <span class="num">' + q.d + '</span> ' + (q.fewer ? 'по-малко' : 'повече') + ' момчета. Колко общо са децата, които играят на площадката?',
    'На спортивному майданчику грають <span class="num">' + ukN(q.a, 'дівчинка', 'дівчинки', 'дівчаток').replace(' ', '</span> ') + ' і на <span class="num">' + q.d + '</span> ' + (q.fewer ? 'менше' : 'більше') + ' хлопчиків. Скільки всього дітей грає на майданчику?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqAndMore(q){
  if(q.shape === 'fish') return (q.n - 1) + ' · ' + q.m + ' = ' + (q.n - 1)*q.m + ', ' + (q.n - 1)*q.m + ' + ' + (q.n - 1)*q.m + ' = ' + q.ans;
  return q.a + (q.fewer ? ' − ' : ' + ') + q.d + ' = ' + q.b + ', ' + q.a + ' + ' + q.b + ' = ' + q.ans;
}
function whyAndMore(q, full){
  if(q.shape === 'fish'){
    if(!full) return tr('Първо колко са уловили всички без последния. А последният е уловил колкото тях.', 'Спершу скільки зловили всі, крім останнього. А останній зловив стільки, скільки вони.');
    const o = q.n - 1, c = o*q.m;
    return tr(FISH_BG[o] + 'та: ', FISH_UK[o] + ': ') + o + ' · ' + q.m + ' = <b>' + c + '</b> кг, ' + tr(FISH_LAST[q.n] + ' — също ', FISH_LAST_UK[q.n] + ' — теж ') + c + ' кг &nbsp;→&nbsp; ' + c + ' + ' + c + ' = ' + q.ans;
  }
  if(!full) return tr('Първо колко са момчетата — после всички деца.', 'Спершу скільки хлопчиків — потім усі діти.');
  return tr('момчетата: ', 'хлопчиків: ') + q.a + (q.fewer ? ' − ' : ' + ') + q.d + ' = <b>' + q.b + '</b> &nbsp;→&nbsp; ' + tr('всички: ', 'усього: ') + q.a + ' + ' + q.b + ' = ' + q.ans;
}
KIND.andmore = { draw:drawAndMore, eq:eqAndMore, why:whyAndMore };
