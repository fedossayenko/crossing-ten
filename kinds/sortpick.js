// Question kind 'sortpick': level 180 Подреди и избери — Numbers put in order, then the middle one read off.

// МБГ Пролет 2022, 1 клас, задача 5: the rule is shown on two examples — 9, 12, 10 ⟹ 9 < 10 < 12 ⟹ 91012 ⟹ 0:
// in order, written one after another, and the digit in the middle. Then 30, 9, 20, 10 ⟹ 9102030, seven
// digits, the fourth is 2. Задача 6: the same order, and the middle number itself — 30, 9, 20, 19, 10 ⟹ 19.
// [the numbers as given, in order, what comes out] for each shape's two printed examples
import { KIND, SLOT, rnd, shuffle, tr, ukN } from '../js/core.js';
const SORTPICK_EX = { digit: [[[9, 12, 10], '91012', 0], [[9, 7, 0, 13], '07913', 9]],
                      mid:   [[[9, 12, 10], '', 10], [[9, 7, 0, 13, 1], '', 7]] };
const sortUp = ns => ns.slice().sort((a, b) => a - b);
// the middle digit of the numbers in order, and А/Б/В/Г that stay digits: the other digits of the row, then the neighbours of the answer
function sortPickDigit(nums){
  const joined = sortUp(nums).join(''), ans = +joined[(joined.length - 1) / 2];
  const traps = [...new Set([...joined].map(Number).concat([(ans + 1) % 10, (ans + 9) % 10]))].filter(d => d !== ans).slice(0, 3);
  return {kind:'sortpick', shape:'digit', nums, traps, ans};
}
// МБГ Полуфинал 2022, 1 клас, задачи 5 и 6: the same two examples each, then five numbers of one sort — a run that
// crosses ten, 8, 9, 10, 11, 7 ⟹ 7891011, seven digits, the fourth is 1; five round tens, 10, 30, 20, 0, 40 ⟹ 20.
// Drawn after the other question, so a seed that asks that keeps asking it.
export function genSortPick(){
  const q = genSortPickAny();
  if(Math.random() >= 0.3) return q;
  if(q.shape === 'digit'){
    // a run a … a + 4 with an odd count of digits: one-digit numbers, or across ten from 7 or 9 (6 or 8 give an even count)
    const a = Math.random() < 0.5 ? (Math.random() < 0.5 ? 7 : 9) : 1 + rnd(5);
    return sortPickDigit(shuffle([a, a + 1, a + 2, a + 3, a + 4]));
  }
  const nums = shuffle([0, 10, 20, 30, 40, 50]).slice(0, 5);
  return {kind:'sortpick', shape:'mid', nums, ans: sortUp(nums)[2]};
}
function genSortPickAny(){
  for(;;){
    const shape = Math.random() < 0.5 ? 'digit' : 'mid';
    const k = shape === 'mid' ? (Math.random() < 0.5 ? 3 : 5) : 3 + rnd(2);
    // like the paper, often the round tens with one or two others; or any numbers up to 30
    let nums;
    if(Math.random() < 0.5){
      // k = 3 keeps two of the tens and takes one other, or it would always be 10, 20, 30
      const tens = k === 3 ? shuffle([10, 20, 30]).slice(0, 2) : [10, 20, 30], others = shuffle([...Array(30).keys()].filter(v => v % 10)).slice(0, k - tens.length);
      nums = shuffle(tens.concat(others));
    } else nums = shuffle([...Array(31).keys()]).slice(0, k);
    const up = sortUp(nums), joined = up.join('');
    if(SORTPICK_EX[shape].some(e => sortUp(e[0]).join() === up.join())) continue;   // not one of the examples again
    if(shape === 'digit'){
      if(joined.length % 2 === 0 || joined.length > 9) continue;                     // a middle digit needs an odd count
      return sortPickDigit(nums);
    }
    return {kind:'sortpick', shape, nums, ans: up[(k - 1) / 2]};
  }
}
const sortPickRow = (ns, mid, end) => ns.join(', ') + ' &nbsp;⟹&nbsp; ' + mid + ' &nbsp;⟹&nbsp; ' + end;
function drawSortPick(q){
  const ex = SORTPICK_EX[q.shape].map(([ns, j, out]) => '<div class="given" style="font-size:clamp(14px,3.8vw,20px)">' +
    sortPickRow(ns, sortUp(ns).join(' &lt; ') + (j ? ' &nbsp;⟹&nbsp; ' + j : ''), out) + '</div>').join('');
  const dots = q.nums.map(() => '…').join(' &lt; ') + (q.shape === 'digit' ? ' &nbsp;⟹&nbsp; …' : '');
  return '<div class="ask">' + tr('Разгледайте примерите и открийте правилото. Какво число трябва да е на мястото на въпросителния знак?',
    'Розгляньте приклади й знайдіть правило. Яке число має стояти на місці знака питання?') + '</div>' + ex +
    '<div class="given" style="font-size:clamp(15px,4.2vw,22px); font-weight:800">' + q.nums.join(', ') + ' &nbsp;⟹&nbsp; ' + dots + ' &nbsp;⟹&nbsp; ?</div>' +
    '<div class="line xl">? = ' + SLOT + '</div>';
}
function eqSortPick(q){
  const up = sortUp(q.nums);
  return up.join(' < ') + (q.shape === 'digit' ? ' → ' + up.join('') : '') + ' → ' + q.ans;
}
function whySortPick(q, full){
  if(!full) return q.shape === 'digit'
    ? tr('Подреди числата от най-малкото до най-голямото, запиши ги едно до друго и намери цифрата точно по средата.', 'Розстав числа від найменшого до найбільшого, випиши їх поруч і знайди цифру точно посередині.')
    : tr('Подреди числата от най-малкото до най-голямото и виж кое стои точно по средата.', 'Розстав числа від найменшого до найбільшого й подивись, яке стоїть точно посередині.');
  const up = sortUp(q.nums);
  if(q.shape === 'digit'){
    const j = up.join(''), at = (j.length - 1) / 2;
    return up.join(' &lt; ') + ' &nbsp;⟹&nbsp; ' + j.slice(0, at) + '<b>' + j[at] + '</b>' + j.slice(at + 1) + ' &nbsp;→&nbsp; ' +
      tr(j.length + ' цифри, по средата е ' + (at + 1) + '-ата: ', ukN(j.length, 'цифра', 'цифри', 'цифр') + ', посередині — ' + (at + 1) + '-а: ') + q.ans;
  }
  const at = (up.length - 1) / 2;
  return up.map((v, i) => i === at ? '<b>' + v + '</b>' : v).join(' &lt; ') + ' &nbsp;→&nbsp; ' +
    tr(up.length + ' числа, по средата е ' + (at + 1) + '-ото: ', ukN(up.length, 'число', 'числа', 'чисел') + ', посередині — ' + (at + 1) + '-е: ') + q.ans;
}
KIND.sortpick = { draw:drawSortPick, eq:eqSortPick, why:whySortPick };
