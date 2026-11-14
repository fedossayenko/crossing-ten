// Question kind 'andmore': level 119 И с толкова повече — One group, another with so many more: how many in all;
// level 265 Рибарите (shape 'fish') — the last one as much as all the others together;
// level 296 Три групи (q.three) — a second group told from the first, a third from the first or the second.
// Level 119 also takes shape 'rest' (a total shared out, what is left), level 296 shape 'kept' (a total, three parts told, the rest).

// МБГ Зима 2020, задача 5: 12 girls and 7 more boys. The trap is 12 + 7: the boys are 12 + 7 = 19,
// and the children 12 + 19 = 31.
// МБГ Есен 2023, 3 клас, задача 9: four fishermen with four boats; three caught 8 kg each and the fourth as much as the
// three together. The fourth's catch is the three's again: 3 · 8 = 24, 24 + 24 = 48. The boats are only there to count.
import { KIND, SLOT, answerLine, bgWith, numSpan, rnd, tr, ukN, ukPl } from '../js/core.js';
export function genAndMore(){
  const a = 5 + rnd(20), d = 2 + rnd(10), fewer = Math.random() < 0.3;
  if(fewer && d >= a) return genAndMore();
  if(Math.random() < 0.4) return genRest();
  return {kind:'andmore', a, d, fewer, b: fewer ? a - d : a + d, ans: fewer ? 2*a - d : 2*a + d};
}
// Салабашев 2019 #3 (50 apples, Грух 17, Прас 7 more: Квик?), 2020 #6 (40 sweets, 16, 6 more: left?), 2022 #3 (80 nuts, 25, 3 more:
// left for the squirrel): a total shared out, the first takes a, the second d more than the first; what is left (shape 'rest').
// Drawn after the old question, so a seed that asked the old one still does, unless this draw turns it into the new shape.
function genRest(){
  for(;;){
    const story = rnd(3), a = 8 + rnd(23), d = 2 + rnd(9), b = a + d, T = 30 + rnd(60), left = T - a - b;
    if(left < 2 || left > 40 || left === a || left === b) continue;
    return {kind:'andmore', shape:'rest', story, a, d, b, T, traps:[T - a], ans: left};
  }
}
// Салабашев 2025 #5: 44 biscuits, 13 to the son, 2 more to the nephew, the last 9 to the husband: how many kept? (shape 'kept' of level 296)
function genKept(){
  for(;;){
    const T = 30 + rnd(60), a = 8 + rnd(13), k = 2 + rnd(5), m = 4 + rnd(12), b = a + k, kept = T - a - b - m;
    if(kept < 3 || kept > 25 || kept === m) continue;
    return {kind:'andmore', shape:'kept', T, a, k, b, m, traps:[T - a - b], ans: kept};
  }
}
const REST_NAMES = ['Грух', 'Прас', 'Квик'], REST_NAMES_UK = ['Грух', 'Прас', 'Квік'];
function drawRest(q){
  const n = REST_NAMES, u = REST_NAMES_UK;
  const bg = [
    'Прасенцата ' + n[0] + ', ' + n[1] + ' и ' + n[2] + ' изяли общо ' + numSpan(q.T) + ' ябълки. ' + n[0] + ' изял ' + numSpan(q.a) + ' ябълки, а ' + n[1] + ' изял ' + bgWith(q.d) + ' ' + numSpan(q.d) + ' ябълки повече от ' + n[0] + '. <b>Колко ябълки изял ' + n[2] + '?</b>',
    'Мили и Лори получили кутия с ' + numSpan(q.T) + ' бонбона. Лори взела ' + numSpan(q.a) + ' бонбона, а Мили взела ' + bgWith(q.d) + ' ' + numSpan(q.d) + ' бонбона повече. <b>Колко бонбона останали в кутията?</b>',
    'Катеричката събрала ' + numSpan(q.T) + ' ореха. Кученцето поискало ' + numSpan(q.a) + ' ореха, а котето — ' + bgWith(q.d) + ' ' + numSpan(q.d) + ' ореха повече от кученцето. <b>Колко ореха ще останат за катеричката?</b>'][q.story];
  const uk = [
    'Поросята ' + u[0] + ', ' + u[1] + ' і ' + u[2] + ' з’їли разом ' + ukPl(q.T, 'яблуко', 'яблука', 'яблук') + '. ' + u[0] + ' з’їв ' + ukPl(q.a, 'яблуко', 'яблука', 'яблук') + ', а ' + u[1] + ' — на ' + ukPl(q.d, 'яблуко', 'яблука', 'яблук') + ' більше, ніж ' + u[0] + '. <b>Скільки яблук з’їв ' + u[2] + '?</b>',
    'Мілі й Лорі подарували коробку. У коробці було ' + ukPl(q.T, 'цукерка', 'цукерки', 'цукерок') + '. Лорі взяла ' + ukPl(q.a, 'цукерку', 'цукерки', 'цукерок') + ', а Мілі — на ' + ukPl(q.d, 'цукерку', 'цукерки', 'цукерок') + ' більше. <b>Скільки цукерок залишилося в коробці?</b>',
    'Білочка зібрала ' + ukPl(q.T, 'горіх', 'горіхи', 'горіхів') + '. Цуценя попросило ' + ukPl(q.a, 'горіх', 'горіхи', 'горіхів') + ', а кошеня — на ' + ukPl(q.d, 'горіх', 'горіхи', 'горіхів') + ' більше, ніж цуценя. <b>Скільки горіхів залишиться білочці?</b>'][q.story];
  return '<div class="ask">' + tr(bg, uk) + '</div>' + answerLine('xl');
}
const restEq = q => q.a + ' + ' + q.d + ' = ' + q.b + ', ' + q.T + ' − ' + q.a + ' − ' + q.b + ' = ' + q.ans;
function whyRest(q, full){
  if(!full) return tr('Първо колко е взел вторият. После извади и двамата от всичко.', 'Спершу скільки взяв другий. Потім відніми обох від усього.');
  return tr('вторият: ', 'другий: ') + q.a + ' + ' + q.d + ' = <b>' + q.b + '</b> &nbsp;→&nbsp; ' + tr('останали: ', 'залишилось: ') + q.T + ' − ' + q.a + ' − ' + q.b + ' = ' + q.ans;
}
function drawKept(q){
  return '<div class="ask">' + tr('Мама Мия отворила пакет с ' + numSpan(q.T) + ' бисквити и запазила няколко от тях за себе си. Дала ' + numSpan(q.a) + ' от останалите бисквити на сина си Марти и ' + bgWith(q.k) + ' ' + numSpan(q.k) +
      ' повече на братовчед му Мони. Последните ' + numSpan(q.m) + ' бисквити дала на татко Миро. <b>Колко бисквити е запазила за себе си мама Мия?</b>',
    'Мама Мія відкрила пакет. У ньому було ' + ukPl(q.T, 'печиво', 'печива', 'печив') + '. Кілька вона залишила собі. Із решти дала ' + numSpan(q.a) + ' синові Марті і на ' + numSpan(q.k) + ' більше двоюрідному братові Моні. Останні ' +
      ukPl(q.m, 'печиво', 'печива', 'печив') + ' дала татові Мірові. <b>Скільки печив залишила собі мама Мія?</b>') + '</div>' + answerLine('xl');
}
const keptEq = q => q.a + ' + ' + q.k + ' = ' + q.b + ', ' + q.T + ' − ' + q.a + ' − ' + q.b + ' − ' + q.m + ' = ' + q.ans;
function whyKept(q, full){
  if(!full) return tr('Първо колко е получил Мони. После извади от всичките бисквити всичко, което е дала.', 'Спершу скільки отримав Моні. Потім відніми від усього печива все, що вона віддала.');
  return tr('Мони: ', 'Моні: ') + q.a + ' + ' + q.k + ' = <b>' + q.b + '</b> &nbsp;→&nbsp; ' + tr('запазила: ', 'залишила: ') + q.T + ' − ' + q.a + ' − ' + q.b + ' − ' + q.m + ' = ' + q.ans;
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
    if(Math.random() < 0.2) return genKept();
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
const tgBy = (d, more) => tr(bgWith(d) + ' ' + numSpan(d) + ' ' + (more ? 'повече' : 'по-малко'), 'на ' + numSpan(d) + ' ' + (more ? 'більше' : 'менше'));
const tgWag = n => tr(numSpan(n) + ' вагона', ukN(n, 'вагон', 'вагони', 'вагонів').replace(/^\d+/, numSpan(n)));
function drawThree(q){
  const asked = { second:1, third:2, chain:2, total:3 }[q.shape];
  if(q.story === 0){
    const story = tr('В магазин за играчки получили ' + numSpan(q.a) + ' камиончета. Мечетата били ' + tgBy(q.d1, q.more1) + ' от камиончетата, а куклите — ' + tgBy(q.d2, q.more2) + ' от ' + TG_TOYS_ART[q.ref] + '. ',
      'У магазин іграшок привезли ' + ukN(q.a, 'вантажівку', 'вантажівки', 'вантажівок').replace(/^\d+/, numSpan(q.a)) + '. Ведмедиків було ' + tgBy(q.d1, q.more1) + ', ніж вантажівок, а ляльок — ' + tgBy(q.d2, q.more2) + ', ніж ' + TG_TOYS_GEN[q.ref] + '. ');
    const ask = [tr('Колко мечета са получили?', 'Скільки ведмедиків привезли?'), tr('Колко кукли са получили?', 'Скільки ляльок привезли?'), tr('Колко играчки общо са получили?', 'Скільки всього іграшок привезли?')][asked - 1];
    // the paper's table: the trucks filled in, the row asked marked
    const T = '<table class="tix">' + [0, 1, 2, 3].map(i => '<tr><td>' + tr(TG_TOYS_BG[i], TG_TOYS_UK[i]) + '</td><td>' + (i === 0 ? q.a : i === asked ? '?' : '') + '</td></tr>').join('') + '</table>';
    return '<div class="ask">' + story + '<b>' + ask + '</b></div>' + T + answerLine('xl');
  }
  const story = tr('От товарна гара потеглили три влака. Първият имал ' + tgWag(q.a) + '. Вторият имал ' + bgWith(q.d1) + ' ' + tgWag(q.d1) + ' ' + (q.more1 ? 'повече' : 'по-малко') + ' от първия, а третият — ' +
      bgWith(q.d2) + ' ' + tgWag(q.d2) + ' ' + (q.more2 ? 'повече' : 'по-малко') + ' от вагоните ' + (q.ref ? 'във втория' : 'в първия') + ' влак. ',
    'З вантажної станції вирушили три потяги. У першому було ' + tgWag(q.a) + '. У другому — на ' + tgWag(q.d1) + ' ' + (q.more1 ? 'більше' : 'менше') + ', ніж у першому, а в третьому — на ' +
      tgWag(q.d2) + ' ' + (q.more2 ? 'більше' : 'менше') + ', ніж ' + (q.ref ? 'у другому' : 'у першому') + ' потязі. ');
  const ask = [tr('Колко вагона има във втория влак?', 'Скільки вагонів у другому потязі?'), tr('Колко вагона има в третия влак?', 'Скільки вагонів у третьому потязі?'), tr('Колко вагона има общо в трите влака?', 'Скільки всього вагонів у трьох потягах?')][asked - 1];
  return '<div class="ask">' + story + '<b>' + ask + '</b></div>' + answerLine('xl');
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
  if(q.shape === 'rest') return drawRest(q);
  if(q.shape === 'kept') return drawKept(q);
  if(q.three) return drawThree(q);
  if(q.shape === 'fish') return drawFish(q);
  return '<div class="ask">' + tr('На спортната площадка играят <span class="num">' + q.a + '</span> момичета и ' + bgWith(q.d) + ' <span class="num">' + q.d + '</span> ' + (q.fewer ? 'по-малко' : 'повече') + ' момчета. Колко общо са децата, които играят на площадката?',
    'На спортивному майданчику грають <span class="num">' + ukN(q.a, 'дівчинка', 'дівчинки', 'дівчаток').replace(' ', '</span> ') + ' і на <span class="num">' + q.d + '</span> ' + (q.fewer ? 'менше' : 'більше') + ' хлопчиків. Скільки всього дітей грає на майданчику?') + '</div>' +
    answerLine('xl');
}
function eqAndMore(q){
  if(q.shape === 'rest') return restEq(q);
  if(q.shape === 'kept') return keptEq(q);
  if(q.three) return eqThree(q);
  if(q.shape === 'fish') return (q.n - 1) + ' · ' + q.m + ' = ' + (q.n - 1)*q.m + ', ' + (q.n - 1)*q.m + ' + ' + (q.n - 1)*q.m + ' = ' + q.ans;
  return q.a + (q.fewer ? ' − ' : ' + ') + q.d + ' = ' + q.b + ', ' + q.a + ' + ' + q.b + ' = ' + q.ans;
}
function whyAndMore(q, full){
  if(q.shape === 'rest') return whyRest(q, full);
  if(q.shape === 'kept') return whyKept(q, full);
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
