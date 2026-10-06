// Question kind 'digperm': level 167 Всички двуцифрени — Every two-digit number from given digits, added up.

// МБГ Пролет 2023, 1 клас, задача 6: two worked examples — 1, 2 give 12 and 21, 12 + 21 = 33;
// 0, 1, 2 give 10, 12, 20, 21, sum 63 — then 0, 1, 3: 10, 13, 30, 31, and 10 + 13 + 30 + 31 = 84.
// Two different digits in each number, and 0 never in front.
import { KIND, SLOT, bgList, rnd, shuffle, svgText, tr } from '../js/core.js';
const digPermNums = ds => { const r = []; ds.forEach(a => ds.forEach(b => { if(a !== b && a) r.push(10*a + b); })); return r.sort((x, y) => x - y); };
// МБГ Пролет 2021, 1 клас, задача 15: not the sum but how many. 5, 2, 1 make 10 < 12 < 15 < 21 < 25 < 51 <
// 52 < 100 — 6 numbers; 2, 6, 0 make 20, 26, 60, 62 — 4, as 0 never stands in front. The digits as printed, unsorted.
function genDigCount(){
  for(;;){
    // three digits, with a 0 or without, or now and then two or four; never a 1 beside the 0 — 10 would be the frame's own 10
    const zero = Math.random() < 0.5, k = Math.random() < 0.7 ? 3 : Math.random() < 0.5 ? 2 : 4;
    const ds = shuffle((zero ? [0] : []).concat(Array.from({length: zero ? k - 1 : k}, () => 1 + rnd(9))));
    if(new Set(ds).size !== ds.length || (zero && ds.includes(1)) || ds.slice().sort().join() === '1,2,5') continue;
    const nums = digPermNums(ds);
    return {kind:'digperm', shape:'count', ds, nums, ans: nums.length};
  }
}
// МБГ Полуфинал 2023, 1 клас, задача 8: 4, 5 ⟹ 45, 54 ⟹ 2 and 0, 4, 5 ⟹ 40, 45, 50, 54 ⟹ 4, then 0, 1, 2, 3 ⟹ ? —
// 10, 12, 13, 20, 21, 23, 30, 31, 32: 9. Four digits in order, with a 0 (9 numbers) or without (12); a 1 may stand
// beside the 0 here, as there is no frame from 10. Drawn after the other questions, so their seeds keep them.
const DIGFOUR_EX = [[[4, 5], [45, 54]], [[0, 4, 5], [40, 45, 50, 54]]];
function genDigFour(){
  for(;;){
    const zero = Math.random() < 0.5, ds = (zero ? [0] : []).concat(Array.from({length: zero ? 3 : 4}, () => 1 + rnd(9))).sort((a, b) => a - b);
    if(new Set(ds).size !== 4) continue;
    const nums = digPermNums(ds);
    // the slips: a 0 put in front too (or a digit twice, without a 0), and each pair of digits once
    return {kind:'digperm', shape:'four', ds, nums, traps:[zero ? 12 : 16, 6], ans: nums.length};
  }
}
export function genDigPerm(){
  const q = Math.random() < 0.35 ? genDigCount() : genDigSum();
  return Math.random() < 0.2 ? genDigFour() : q;
}
function genDigSum(){
  for(;;){
    // two digits without a 0, or three with one; the sum kept within 100, and not one of the examples
    const ds = Math.random() < 0.2 ? [0, 1, 2 + rnd(2)] : [1 + rnd(8), 1 + rnd(8)].sort((a, b) => a - b);
    if(new Set(ds).size !== ds.length || ds.join() === '1,2' || ds.join() === '0,1,2') continue;
    const nums = digPermNums(ds), S = nums.reduce((t, v) => t + v, 0);
    if(S > 99) continue;
    return {kind:'digperm', ds, nums, ans: S};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 12: how many two-digit numbers from three cards with 0, 1 and 6? 10, 16, 60, 61 —
// and the card 6 turned upside down is a 9: 19, 90, 91. The key says 7. The paper does not say a card may be turned;
// the hint does. Only 6 and 9 become another digit; the other card is never 6 or 9 too, so no number comes two ways.
const FLIP = {6:9, 9:6};
const digFlipNums = ds => { const r = new Set(); ds.forEach((a, i) => ds.forEach((b, j) => { if(i !== j) [a, FLIP[a]].forEach(t => [b, FLIP[b]].forEach(u => { if(t !== undefined && u !== undefined && t) r.add(10*t + u); })); })); return [...r].sort((x, y) => x - y); };
const CARDS_N = { 2:['две', 'двох'], 3:['три', 'трьох'], 4:['четири', 'чотирьох'] };
export function genDigFlip(){
  // a 6 or a 9, and cards that stay what they are turned over, or are no digit then; three cards most often (with two
  // or four the count is not always 7 or 10), in order, as printed
  const k = Math.random() < 0.7 ? 3 : Math.random() < 0.5 ? 2 : 4;
  const ds = [Math.random() < 0.6 ? 6 : 9].concat(shuffle([0, 1, 2, 3, 4, 5, 7, 8]).slice(0, k - 1)).sort((a, b) => a - b);
  const nums = digFlipNums(ds);
  return {kind:'digperm', shape:'flip', ds, nums, traps:[digPermNums(ds).length], ans: nums.length};   // the trap: no card turned
}
const flipCard = (v, x, turn) => '<rect x="' + x + '" y="2" width="40" height="44" rx="3" fill="var(--solid)" stroke="var(--ink)" stroke-width="1.6"/>' +
  (turn ? '<g transform="rotate(180 ' + (x + 20) + ' 24)">' + svgText(x + 20, 32, v, 24, 'var(--accent)') + '</g>' : svgText(x + 20, 32, v, 24, 'var(--ink)'));
function drawDigPerm(q){
  if(q.shape === 'flip'){
    const n = CARDS_N[q.ds.length], w = q.ds.length * 56 - 12;
    return '<div class="ask">' + tr('Колко са всички двуцифрени числа, които можем да съставим с ' + n[0] + ' картички, на които са записани ' + bgList(q.ds) + '?',
      'Скільки всього двоцифрових чисел можна скласти з ' + n[1] + ' карток, на яких записано ' + bgList(q.ds) + '?') + '</div>' +
      '<div class="fig"><svg viewBox="0 0 ' + w + ' 48" style="max-width:' + Math.round(w * 1.2) + 'px" role="img" aria-label="' + tr('картички', 'картки') + '">' + q.ds.map((v, i) => flipCard(v, 2 + i*56)).join('') + '</svg></div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'four'){
    const ex = ([ds, nums]) => '<div class="given" style="font-size:clamp(14px,3.8vw,20px)">' + ds.join(', ') + ' &nbsp;⟹&nbsp; ' + nums.join(', ') + ' &nbsp;⟹&nbsp; ? = ' + nums.length + '</div>';
    return '<div class="ask">' + tr('Разгледайте примерите и открийте правилото. Какво число трябва да е на мястото на въпросителния знак?',
      'Розгляньте приклади й знайдіть правило. Яке число має стояти на місці знака питання?') + '</div>' + DIGFOUR_EX.map(ex).join('') +
      '<div class="line" style="font-size:clamp(20px,6vw,36px)">' + q.ds.join(', ') + ' &nbsp;⟹&nbsp; … &nbsp;⟹&nbsp; ? = ' + SLOT + '</div>';
  }
  if(q.shape === 'count'){
    return '<div class="ask">' + tr('Виж примера. <b>Колко</b> двуцифрени числа с различни цифри могат да се запишат с дадените цифри?',
      'Подивись на приклад. <b>Скільки</b> двоцифрових чисел з різними цифрами можна записати з даних цифр?') + '</div>' +
      '<div class="given" style="font-size:clamp(14px,3.8vw,20px)">5, 2, 1 &nbsp;⟹&nbsp; 10 &lt; 12 &lt; 15 &lt; 21 &lt; 25 &lt; 51 &lt; 52 &lt; 100 &nbsp;→&nbsp; ' + tr('6 числа', '6 чисел') + '</div>' +
      '<div class="line" style="font-size:clamp(20px,6vw,36px)">' + q.ds.join(', ') + ' &nbsp;⟹&nbsp; 10 &lt; … &lt; 100 &nbsp;→&nbsp; ' + SLOT + '</div>';
  }
  const row = (ds, nums, last) => '<div class="given" style="font-size:clamp(14px,3.8vw,20px)">' + ds.join(', ') + ' &nbsp;⟹&nbsp; ' + nums.join(', ') + '; &nbsp;' + nums.join(' + ') + ' = ' + last + '</div>';
  return '<div class="ask">' + tr('Виж примерите. Запиши <b>всички двуцифрени числа</b> с различни цифри от дадените и ги събери.',
    'Подивись на приклади. Випиши <b>усі двоцифрові числа</b> з різними цифрами з даних і додай їх.') + '</div>' +
    row([1, 2], [12, 21], 33) + row([0, 1, 2], [10, 12, 20, 21], 63) +
    '<div class="line" style="font-size:clamp(20px,6vw,36px)">' + q.ds.join(', ') + ' &nbsp;⟹&nbsp; ' + q.nums.map(() => '…').join(' + ') + ' = ' + SLOT + '</div>';
}
function eqDigPerm(q){
  if(q.shape === 'count' || q.shape === 'flip' || q.shape === 'four') return q.ds.join(', ') + ' → ' + q.nums.join(', ') + ' → ' + q.ans;
  return q.ds.join(', ') + ' → ' + q.nums.join(' + ') + ' = ' + q.ans;
}
function whyDigPerm(q, full){
  if(q.shape === 'flip'){
    if(!full) return tr('Разгледай картичките. Може ли някоя от тях да се обърне с главата надолу?', 'Роздивись картки. Чи можна якусь із них перевернути догори дриґом?');
    const six = q.ds.find(v => FLIP[v] !== undefined), plain = digPermNums(q.ds), more = q.nums.filter(v => plain.indexOf(v) < 0);
    // the picture first: the card as it lies and turned over (a number after it would be read as the answer)
    return '<svg viewBox="0 0 120 48" style="display:block; width:150px; max-width:100%; margin:0 auto 6px" role="img" aria-label="' + tr('обърната картичка', 'перевернута картка') + '">' +
      flipCard(six, 2) + svgText(60, 30, '→', 20, 'var(--ink)') + flipCard(six, 78, true) + '</svg>' +
      plain.join(', ') + tr('; картичката ' + six + ', обърната, е ' + FLIP[six] + ': ', '; картка ' + six + ', перевернута, — це ' + FLIP[six] + ': ') + more.join(', ') +
      ' &nbsp;→&nbsp; ' + tr('общо ', 'усього ') + '<b>' + q.ans + '</b>';
  }
  if(q.shape === 'four'){
    if(!full) return tr('Примерите изписват всички двуцифрени числа от дадените цифри, без цифра два пъти. Избери цифрата на десетиците (не 0), после цифрата на единиците — всяка от другите.',
      'Приклади виписують усі двоцифрові числа з даних цифр, без цифри двічі. Обери цифру десятків (не 0), потім цифру одиниць — будь-яку з інших.');
    // one row per tens digit: each takes the other three digits as its ones
    const tens = q.ds.filter(v => v);
    return tens.map(a => q.nums.filter(v => Math.floor(v / 10) === a).join(', ')).join('; &nbsp;') + (q.ds.includes(0) ? tr(' (0 не стои отпред)', ' (0 не стоїть попереду)') : '') +
      ' &nbsp;→&nbsp; ' + tens.map(() => 3).join(' + ') + ' = <b>' + q.ans + '</b>';
  }
  if(!full) return tr('Запиши числата подред: първо с най-малката цифра отпред, после със следващата. 0 не може да стои отпред.',
    'Випиши числа по порядку: спершу з найменшою цифрою попереду, потім з наступною. 0 не може стояти попереду.');
  return tr('от ', 'з ') + q.ds.join(', ') + ': <b>' + q.nums.join(', ') + '</b>' + (q.ds.includes(0) ? tr(' (0 не стои отпред)', ' (0 не стоїть попереду)') : '') +
    ' &nbsp;→&nbsp; ' + (q.shape === 'count' ? tr('на брой ', 'усього ') + q.ans : q.nums.join(' + ') + ' = ' + q.ans);
}
KIND.digperm = { draw:drawDigPerm, eq:eqDigPerm, why:whyDigPerm };
