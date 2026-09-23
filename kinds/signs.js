// Question kind 'signs': level 50 Плюс или минус — Choose the signs in a run — how many can be minus.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 20: the numbers stand in a row and every sign but the first may be a minus.
// Turning a term round costs twice its value, so the terms turned round have to add to
// exactly half the drop — and the most of them means taking the smallest ones.
function genSigns(){
  for(;;){
    const a = 1 + rnd(4), len = 4 + rnd(3);
    const nums = [];
    for(let i = 0; i < len; i++) nums.push(a + i);
    const total = nums.reduce((t, v) => t + v, 0);
    const rest = nums.slice(1);
    const best = {};                           // result -> the most minuses that reach it
    for(let mask = 1; mask < (1 << rest.length); mask++){
      let sum = 0, n = 0, took = [];
      for(let i = 0; i < rest.length; i++) if(mask & (1 << i)){ sum += rest[i]; n++; took.push(rest[i]); }
      const got = total - 2*sum;
      if(got < 1) continue;
      if(!best[got] || n > best[got].n) best[got] = {n, took};
    }
    const hit = Object.keys(best).filter(v => best[v].n <= len - 2);
    if(!hit.length) continue;
    const T = +hit[rnd(hit.length)];
    return {kind:'signs', a, b: a + len - 1, nums, T, wit: best[T].took, ans: best[T].n};
  }
}

// How the signs are written, on this question's own numbers: one minus that does not land
// on the target, so the example shows the format without solving the task.
function signsExample(q){
  const total = q.nums.reduce((t, v) => t + v, 0);
  const minus = [q.nums[q.nums.length - 1], q.nums[1]].find(v => total - 2*v !== q.T && total - 2*v >= 0);
  const line = q.nums.map((v, i) => i === 0 ? '' + v : (v === minus ? ' − ' : ' + ') + v).join('');
  return line + ' = ' + (minus === undefined ? total : total - 2*minus);
}
function drawSigns(q){
  if(q.kind === 'signs'){
    return tr('<div class="ask">Естествените числа от <span class="num">' + q.a + '</span> до <span class="num">' +
      q.b + '</span> включително се записват едно след друго. Поставете между тях знаците „+" или „−", ' +
      'за да получим числото <span class="num">' + q.T + '</span>. Колко <b>най-много</b> могат да са минусите?</div>',
      '<div class="ask">Натуральні числа від <span class="num">' + q.a + '</span> до <span class="num">' +
      q.b + '</span> включно записано одне за одним. Поставте між ними знаки «+» або «−», ' +
      'щоб отримати число <span class="num">' + q.T + '</span>. Скільки <b>найбільше</b> може бути мінусів?</div>') +
      '<div class="seq">' + q.nums.join(' &nbsp;') + '</div>' +
      '<div class="note">' + tr('Например', 'Наприклад') + ': ' + signsExample(q) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqSigns(q){
  if(q.kind === 'signs') return q.a + '…' + q.b + ' = ' + q.T + tr(' → минуси: ', ' → мінуси: ') + q.ans;
}
function whySigns(q, full){
  if(q.kind === 'signs'){
    if(!full) return tr('Всяко число, което обърнеш, сваля сбора два пъти със себе си.',
      'Мінус перед числом зменшує суму на це число двічі.');
    const total = q.nums.reduce((t, v) => t + v, 0), drop = (total - q.T) / 2;
    const line = q.nums.map((v, i) => i ? (q.wit.indexOf(v) >= 0 ? ' − ' : ' + ') + v : v).join('');
    return tr('всичко със знак плюс е <b>' + total + '</b>, а трябва ' + q.T + ' &nbsp;→&nbsp; обърнатите трябва да дават ',
      'з усіма плюсами сума <b>' + total + '</b>, а треба ' + q.T + ' &nbsp;→&nbsp; числа з мінусом мають дати разом ') +
      drop + ' &nbsp;→&nbsp; ' + q.wit.join(' + ') + ' &nbsp;→&nbsp; ' + line + ' = ' + q.T +
      tr(' &nbsp;→&nbsp; минусите са ', ' &nbsp;→&nbsp; мінусів: ') + q.ans;
  }
}
KIND.signs = { draw:drawSigns, eq:eqSigns, why:whySigns };
