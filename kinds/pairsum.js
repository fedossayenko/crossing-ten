// Question kind 'pairsum': level 109 □ + □ = □ + □ — Four of five numbers into equal sums: which is left out.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2021, задача 17: from 7, 9, 10, 11, 13 put four in □ + □ = □ + □. 7 + 13 = 9 + 11 = 20,
// so 10 is left. Generated so that exactly one number can be left out, checked on every choice.
function pairSumLeft(nums){
  const out = [];
  nums.forEach((skip, i) => {
    const f = nums.filter((_, j) => j !== i), [a, b, c, d] = f;
    if(a + b === c + d || a + c === b + d || a + d === b + c) out.push(skip);
  });
  return out;
}
function genPairSum(){
  for(;;){
    const nums = shuffle([...Array(20).keys()].map(v => v + 2)).slice(0, 5).sort((x, y) => x - y), left = pairSumLeft(nums);
    if(left.length !== 1) continue;
    return {kind:'pairsum', nums, ans: left[0]};
  }
}
function drawPairSum(q){
  if(q.kind === 'pairsum'){
    return '<div class="ask">' + tr('От числата <span class="num">' + bgList(q.nums) + '</span> изберете четири и ги поставете в квадратчетата, така че да е вярно:',
      'З чисел <span class="num">' + q.nums.slice(0, -1).join(', ') + ' і ' + q.nums[4] + '</span> виберіть чотири й поставте їх у квадратики так, щоб було правильно:') + '</div>' +
      '<div class="given">□ + □ = □ + □</div>' +
      '<div class="ask">' + tr('Кое число остава?', 'Яке число залишається?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
const pairSumFour = q => { const f = q.nums.filter(v => v !== q.ans), [a, b, c, d] = f; return a + b === c + d ? [a, b, c, d] : a + c === b + d ? [a, c, b, d] : [a, d, b, c]; };
function eqPairSum(q){
  if(q.kind === 'pairsum'){ const [a, b, c, d] = pairSumFour(q); return a + ' + ' + b + ' = ' + c + ' + ' + d + ' → ' + q.ans; }
}
function whyPairSum(q, full){
  if(q.kind === 'pairsum'){
    if(!full) return tr('Опитай най-малкото с най-голямото — кои две други дават същия сбор?', 'Спробуй найменше з найбільшим — які два інші дають таку саму суму?');
    const [a, b, c, d] = pairSumFour(q);
    return a + ' + ' + b + ' = <b>' + (a + b) + '</b> = ' + c + ' + ' + d + ' &nbsp;→&nbsp; ' + tr('остава ', 'залишається ') + q.ans;
  }
}
KIND.pairsum = { draw:drawPairSum, eq:eqPairSum, why:whyPairSum };
