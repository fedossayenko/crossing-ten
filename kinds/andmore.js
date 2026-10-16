// Question kind 'andmore': level 119 И с толкова повече — One group, another with so many more: how many in all;
// level 265 Рибарите (shape 'fish') — the last one as much as all the others together;
// level 296 Три групи (q.three) — a second group told from the first, a third from the first or the second.

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
// Level 296 Три групи. Аз и числата 2022, задача 1: 27 камиончета, the bears 14 more than the trucks, the dolls 9 fewer
// than the bears — how many toys? 27 + 14 = 41, 41 − 9 = 32, 27 + 41 + 32 = 100. Аз и числата 2024, задача 6: three trains,
// 23 wagons, the second 8 more than the first, the third 9 fewer than the FIRST — 31, 14 and 68 in all. The third is
// told from the first or from the second, so who it is compared with has to be read. q.three marks the level; q.shape
// is what is asked: the second, the third told from the first, the third told from the second ('chain'), or the total.
export function genThreeGroups(){
  for(;;){
    const story = rnd(2), a = 12 + rnd(29), d1 = 3 + rnd(18), more1 = Math.random() < 0.7, d2 = 3 + rnd(18), more2 = Math.random() < 0.4, ref = rnd(2), w = rnd(20);
    const b = more1 ? a + d1 : a - d1, base = ref ? b : a, c = more2 ? base + d2 : base - d2;
    if(b < 5 || c < 5 || a + b + c > 100 || d1 === d2) continue;
    const ask = w < 5 ? 'second' : w < 12 ? 'third' : 'total', shape = ask === 'third' && ref ? 'chain' : ask;
    // the slips: the second the other way; the third told from the wrong group; the total as the numbers given added up
    const other = ref ? a : b, wrong3 = more2 ? other + d2 : other - d2;
    const traps = ask === 'second' ? [more1 ? a - d1 : a + d1] : ask === 'third' ? [wrong3] : [a + d1 + d2, a + b + wrong3];
    const ans = ask === 'second' ? b : ask === 'third' ? c : a + b + c;
    return {kind:'andmore', three:true, shape, story, a, d1, more1, d2, more2, ref, b, c, traps: traps.filter(v => v >= 0 && v !== ans), ans};
  }
}
const TG_TOYS_BG = ['камиончета', 'мечета', 'кукли', 'общо играчки'], TG_TOYS_ART = ['камиончетата', 'мечетата'];
const TG_TOYS_UK = ['вантажівки', 'ведмедики', 'ляльки', 'усього іграшок'], TG_TOYS_GEN = ['вантажівок', 'ведмедиків'];
const tgNum = n => '<span class="num">' + n + '</span>';
const tgBy = (d, more) => tr(bgWith(d) + ' ' + tgNum(d) + ' ' + (more ? 'повече' : 'по-малко'), 'на ' + tgNum(d) + ' ' + (more ? 'більше' : 'менше'));
const tgWag = n => tr(tgNum(n) + ' вагона', ukN(n, 'вагон', 'вагони', 'вагонів').replace(/^\d+/, tgNum(n)));
function drawThree(q){
  const asked = { second:1, third:2, chain:2, total:3 }[q.shape];
  if(q.story === 0){
    const story = tr('В магазин за играчки получили ' + tgNum(q.a) + ' камиончета. Мечетата били ' + tgBy(q.d1, q.more1) + ' от камиончетата, а куклите — ' + tgBy(q.d2, q.more2) + ' от ' + TG_TOYS_ART[q.ref] + '. ',
      'У магазин іграшок привезли ' + ukN(q.a, 'вантажівку', 'вантажівки', 'вантажівок').replace(/^\d+/, tgNum(q.a)) + '. Ведмедиків було ' + tgBy(q.d1, q.more1) + ', ніж вантажівок, а ляльок — ' + tgBy(q.d2, q.more2) + ', ніж ' + TG_TOYS_GEN[q.ref] + '. ');
    const ask = [tr('Колко мечета са получили?', 'Скільки ведмедиків привезли?'), tr('Колко кукли са получили?', 'Скільки ляльок привезли?'), tr('Колко играчки общо са получили?', 'Скільки всього іграшок привезли?')][asked - 1];
    // the paper's table: the trucks filled in, the row asked marked
    const T = '<table class="tix">' + [0, 1, 2, 3].map(i => '<tr><td>' + tr(TG_TOYS_BG[i], TG_TOYS_UK[i]) + '</td><td>' + (i === 0 ? q.a : i === asked ? '?' : '') + '</td></tr>').join('') + '</table>';
    return '<div class="ask">' + story + '<b>' + ask + '</b></div>' + T + '<div class="line xl">' + SLOT + '</div>';
  }
  const story = tr('От товарна гара потеглили три влака. Първият имал ' + tgWag(q.a) + '. Вторият имал ' + bgWith(q.d1) + ' ' + tgWag(q.d1) + ' ' + (q.more1 ? 'повече' : 'по-малко') + ' от първия, а третият — ' +
      bgWith(q.d2) + ' ' + tgWag(q.d2) + ' ' + (q.more2 ? 'повече' : 'по-малко') + ' от вагоните ' + (q.ref ? 'във втория' : 'в първия') + ' влак. ',
    'З вантажної станції вирушили три потяги. У першому було ' + tgWag(q.a) + '. У другому — на ' + tgWag(q.d1) + ' ' + (q.more1 ? 'більше' : 'менше') + ', ніж у першому, а в третьому — на ' +
      tgWag(q.d2) + ' ' + (q.more2 ? 'більше' : 'менше') + ', ніж ' + (q.ref ? 'у другому' : 'у першому') + ' потязі. ');
  const ask = [tr('Колко вагона има във втория влак?', 'Скільки вагонів у другому потязі?'), tr('Колко вагона има в третия влак?', 'Скільки вагонів у третьому потязі?'), tr('Колко вагона има общо в трите влака?', 'Скільки всього вагонів у трьох потягах?')][asked - 1];
  return '<div class="ask">' + story + '<b>' + ask + '</b></div><div class="line xl">' + SLOT + '</div>';
}
const tgOp = (x, more, d) => x + (more ? ' + ' : ' − ') + d + ' = ' + (more ? x + d : x - d);
function eqThree(q){
  const second = tgOp(q.a, q.more1, q.d1), third = tgOp(q.ref ? q.b : q.a, q.more2, q.d2);
  if(q.shape === 'second') return second;
  if(q.shape === 'third') return third;
  if(q.shape === 'chain') return second + ', ' + third;
  return second + ', ' + third + ', ' + q.a + ' + ' + q.b + ' + ' + q.c + ' = ' + q.ans;
}
function whyThree(q, full){
  if(!full){
    if(q.shape === 'second') return tr('«С толкова повече» — прибави към първото; «с толкова по-малко» — извади от него.', '«На стільки більше» — додай до першого; «на стільки менше» — відніми від нього.');
    if(q.shape === 'third') return tr('От кое се брои третото — от първото или от второто? Прочети пак.', 'Від чого рахують третє — від першого чи від другого? Прочитай ще раз.');
    if(q.shape === 'chain') return tr('Третото се брои от второто — първо намери второто.', 'Третє рахують від другого — спершу знайди друге.');
    return tr('Първо намери колко са във втората и в третата група — после събери и трите.', 'Спершу знайди, скільки в другій і третій групі, — потім додай усі три.');
  }
  const nm = q.story === 0 ? [tr('мечета', 'ведмедиків'), tr('кукли', 'ляльок')] : [tr('във втория', 'у другому'), tr('в третия', 'у третьому')];
  const second = nm[0] + ': ' + tgOp(q.a, q.more1, q.d1).replace(/(\d+)$/, '<b>$1</b>'), third = nm[1] + ': ' + tgOp(q.ref ? q.b : q.a, q.more2, q.d2);
  if(q.shape === 'second') return nm[0] + ': ' + tgOp(q.a, q.more1, q.d1);
  if(q.shape === 'third') return third;
  if(q.shape === 'chain') return second + ' &nbsp;→&nbsp; ' + third;
  return second + ' &nbsp;→&nbsp; ' + third.replace(/(\d+)$/, '<b>$1</b>') + ' &nbsp;→&nbsp; ' + tr('общо: ', 'усього: ') + q.a + ' + ' + q.b + ' + ' + q.c + ' = ' + q.ans;
}
function drawAndMore(q){
  if(q.three) return drawThree(q);
  if(q.shape === 'fish') return drawFish(q);
  return '<div class="ask">' + tr('На спортната площадка играят <span class="num">' + q.a + '</span> момичета и ' + bgWith(q.d) + ' <span class="num">' + q.d + '</span> ' + (q.fewer ? 'по-малко' : 'повече') + ' момчета. Колко общо са децата, които играят на площадката?',
    'На спортивному майданчику грають <span class="num">' + ukN(q.a, 'дівчинка', 'дівчинки', 'дівчаток').replace(' ', '</span> ') + ' і на <span class="num">' + q.d + '</span> ' + (q.fewer ? 'менше' : 'більше') + ' хлопчиків. Скільки всього дітей грає на майданчику?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqAndMore(q){
  if(q.three) return eqThree(q);
  if(q.shape === 'fish') return (q.n - 1) + ' · ' + q.m + ' = ' + (q.n - 1)*q.m + ', ' + (q.n - 1)*q.m + ' + ' + (q.n - 1)*q.m + ' = ' + q.ans;
  return q.a + (q.fewer ? ' − ' : ' + ') + q.d + ' = ' + q.b + ', ' + q.a + ' + ' + q.b + ' = ' + q.ans;
}
function whyAndMore(q, full){
  if(q.three) return whyThree(q, full);
  if(q.shape === 'fish'){
    if(!full) return tr('Първо колко са уловили всички без последния. А последният е уловил колкото тях.', 'Спершу скільки зловили всі, крім останнього. А останній зловив стільки, скільки вони.');
    const o = q.n - 1, c = o*q.m;
    return tr(FISH_BG[o] + 'та: ', FISH_UK[o] + ': ') + o + ' · ' + q.m + ' = <b>' + c + '</b> кг, ' + tr(FISH_LAST[q.n] + ' — също ', FISH_LAST_UK[q.n] + ' — теж ') + c + ' кг &nbsp;→&nbsp; ' + c + ' + ' + c + ' = ' + q.ans;
  }
  if(!full) return tr('Първо колко са момчетата — после всички деца.', 'Спершу скільки хлопчиків — потім усі діти.');
  return tr('момчетата: ', 'хлопчиків: ') + q.a + (q.fewer ? ' − ' : ' + ') + q.d + ' = <b>' + q.b + '</b> &nbsp;→&nbsp; ' + tr('всички: ', 'усього: ') + q.a + ' + ' + q.b + ' = ' + q.ans;
}
KIND.andmore = { draw:drawAndMore, eq:eqAndMore, why:whyAndMore };
