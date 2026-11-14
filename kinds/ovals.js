// Question kind 'ovals': level 277 Верижка — Numbers joined by arrows that add or take away: find what is hidden.

// Аз и числата 2026, задача 11 (shape 'strip'): 30 →+26→ □ →+□→ 68 →+□→ 82 →−22→ □ →+□→ 99. From the left 30 + 26 = 56;
// a hidden step is the difference of its two ends, 68 − 56 = 12 and 82 − 68 = 14; 82 − 22 = 60, and 99 − 60 = 39.
// Аз и числата 2024, задача 9 (shape 'eqs'): 12 − 5 = □, □ + 73 = □, □ − 23 = □ — each answer starts the next line:
// 7, 80, 57. The paper fills every box; here one box is asked (the «?»), and the empty ones may have to be found first.
// nums: the numbers in order, steps: what each arrow adds (− takes away); hideN, hideS: the hidden ones, at: the one asked.
import { KIND, SLOT, SVG_FONT, rnd, tr } from '../js/core.js';
const ovAbs = Math.abs;
// what can be found from what is shown, in the order a child finds it: [type, index, the sum written out, value, what it used]
function ovSolve(q){
  const kn = q.nums.map((_, i) => q.hideN.indexOf(i) < 0), ks = q.steps.map((_, i) => q.hideS.indexOf(i) < 0), out = [];
  const sgn = s => s < 0 ? ' − ' : ' + ', back = s => s < 0 ? ' + ' : ' − ';
  for(let moved = true; moved;){
    moved = false;
    q.nums.forEach((v, i) => {
      if(kn[i]) return;
      if(i > 0 && kn[i - 1] && ks[i - 1]) out.push(['n', i, q.nums[i - 1] + sgn(q.steps[i - 1]) + ovAbs(q.steps[i - 1]) + ' = ' + v, v, [['n', i - 1], ['s', i - 1]]]);
      else if(i < q.nums.length - 1 && kn[i + 1] && ks[i]) out.push(['n', i, q.nums[i + 1] + back(q.steps[i]) + ovAbs(q.steps[i]) + ' = ' + v, v, [['n', i + 1], ['s', i]]]);
      else return;
      kn[i] = moved = true;
    });
    q.steps.forEach((s, i) => {
      if(ks[i] || !kn[i] || !kn[i + 1]) return;
      out.push(['s', i, (s > 0 ? q.nums[i + 1] + ' − ' + q.nums[i] : q.nums[i] + ' − ' + q.nums[i + 1]) + ' = ' + ovAbs(s), ovAbs(s), [['n', i], ['n', i + 1]]]);
      ks[i] = moved = true;
    });
  }
  return { out, all: kn.every(Boolean) && ks.every(Boolean) };
}
// the findings the asked box needs, in the order they are found, its own last
function ovNeeded(q){
  const { out } = ovSolve(q), get = (t, i) => out.find(d => d[0] === t && d[1] === i), need = [get(q.at[0], q.at[1])];
  for(let j = 0; j < need.length; j++) need[j][4].forEach(([t, i]) => { const d = get(t, i); if(d && need.indexOf(d) < 0) need.push(d); });
  return need.sort((a, b) => out.indexOf(a) - out.indexOf(b));
}
export function genOvals(){
  const q = genOvalsOld(), w = Math.random();
  return w < 0.1 ? genOvalsFirst() : w < 0.2 ? genOvalsShort() : q;   // drawn after the old shapes, so they keep their seeds
}
// Салабашев 2019, задача 4: ? −37→ □ +26→ 55 — the grey first circle is asked, the one after it empty: the walk goes back from the end (shape 'first').
function genOvalsFirst(){
  for(;;){
    const n = Math.random() < 0.7 ? 3 : 4, nums = [10 + rnd(60)], steps = [];
    for(let i = 1; i < n; i++){ const s = (i === 1 ? Math.random() < 0.6 ? -1 : 1 : Math.random() < 0.5 ? -1 : 1) * (6 + rnd(40)); steps.push(s); nums.push(nums[i - 1] + s); }
    if(nums.some(v => v < 1 || v > 100)) continue;
    const hideN = []; for(let i = 0; i < n - 1; i++) hideN.push(i);
    return {kind:'ovals', shape:'first', nums, steps, hideN, hideS:[], at:['n', 0], ans: nums[0]};
  }
}
// Салабашев 2020, задача 5: 16 +5→ □ ?→ □ −9→ 44 — four numbers, the two between hidden, the step between them asked (shape 'short').
function genOvalsShort(){
  for(;;){
    const steps = [(Math.random() < 0.7 ? 1 : -1) * (2 + rnd(8)), (Math.random() < 0.7 ? 1 : -1) * (10 + rnd(31)), (Math.random() < 0.7 ? -1 : 1) * (2 + rnd(8))], nums = [10 + rnd(50)];
    steps.forEach(st => nums.push(nums[nums.length - 1] + st));
    if(nums.some(v => v < 1 || v > 100)) continue;
    return {kind:'ovals', shape:'short', nums, steps, hideN:[1, 2], hideS:[1], at:['s', 1], ans: ovAbs(steps[1])};
  }
}
// Салабашев 2025, задача 3 (level 441): a +13→ b −6→ 15 +c→ 32 −d→ 23 — a and b are numbers, c and d steps; which of the four
// options is none of a, b, c, d? Three options are letters' values, the fourth equals none of the four. Its own A/B/V/G options.
export function genOvalsLetters(){
  for(;;){
    const n2 = 10 + rnd(31), s1 = 2 + rnd(9), b = n2 + s1, s0 = 5 + rnd(16), a = b - s0, c = 5 + rnd(26), d = 3 + rnd(18), n3 = n2 + c, n4 = n3 - d;
    const vals = [a, b, c, d];
    if(a < 1 || n4 < 1 || n3 > 99 || new Set(vals).size < 4) continue;
    const x = Math.random() < 0.6 ? vals[rnd(4)] + (Math.random() < 0.5 ? 2 : -2) : 1 + rnd(60);
    if(x < 1 || vals.includes(x)) continue;
    const drop = rnd(4), shown = vals.filter((_, i) => i !== drop).concat(x).sort((p, r) => p - r);
    return {kind:'ovals', shape:'letters', nums:[a, b, n2, n3, n4], steps:[s0, -s1, c, -d], hideN:[0, 1], hideS:[2, 3], at:['n', 0],
      options: shown.map((v, id) => ({ id, v })), pick: shown.indexOf(x), own: true, ans: x};
  }
}
function genOvalsOld(){
  if(Math.random() < 0.3){
    for(;;){
      const a = 5 + rnd(26), steps = [(Math.random() < 0.6 ? -1 : 1) * (2 + rnd(8)), (Math.random() < 0.7 ? 1 : -1) * (10 + rnd(71)), (Math.random() < 0.6 ? -1 : 1) * (10 + rnd(31))];
      const nums = [a];
      steps.forEach(s => nums.push(nums[nums.length - 1] + s));
      if(nums.some(v => v < 1 || v > 100)) continue;
      const at = 1 + rnd(3);
      return {kind:'ovals', shape:'eqs', nums, steps, hideN:[1, 2, 3], hideS:[], at:['n', at], ans: nums[at]};
    }
  }
  for(;;){
    const n = 5 + rnd(2), nums = [10 + rnd(50)], steps = [];
    for(let i = 1; i < n; i++){ const s = (Math.random() < 0.7 ? 1 : -1) * (2 + rnd(39)); steps.push(s); nums.push(nums[i - 1] + s); }
    if(nums.some(v => v < 1 || v > 100)) continue;
    const hideN = [], hideS = [];
    for(let i = 1; i < n; i++) if(Math.random() < 0.4) hideN.push(i);
    for(let i = 0; i < n - 1; i++) if(Math.random() < 0.45) hideS.push(i);
    if(!hideN.length || !hideS.length || hideN.length + hideS.length < 3) continue;
    const q = {kind:'ovals', shape:'strip', nums, steps, hideN, hideS};
    if(!ovSolve(q).all) continue;
    const all = hideN.map(i => ['n', i]).concat(hideS.map(i => ['s', i])), at = all[rnd(all.length)];
    return Object.assign(q, { at, ans: at[0] === 'n' ? nums[at[1]] : ovAbs(steps[at[1]]) });
  }
}
// shape 'letters': a, b the hidden numbers, c, d the hidden steps, written as letters
function ovLettersSvg(q){
  const W = 78 + 4*80, cx = i => 39 + i*80, t = (x, y, v) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="22" font-weight="800" fill="var(--ink)" ' + SVG_FONT + '>' + v + '</text>';
  const L = ['a', 'b'], M = ['', '', 'c', 'd'];
  let s = '';
  q.steps.forEach((st, i) => {
    const x = cx(i);
    s += '<path d="M' + (x + 16) + ' 72 Q' + (x + 40) + ' 46 ' + (x + 64) + ' 72" fill="none" stroke="var(--muted)" stroke-width="2"/>' +
      '<path d="M' + (x + 64 - 2.1) + ' ' + (72 - 7.7) + ' L' + (x + 64) + ' 72 L' + (x + 64 - 7.7) + ' ' + (72 - 2.1) + '" fill="none" stroke="var(--muted)" stroke-width="2"/>' +
      t(x + 40, 30, (st < 0 ? '−' : '+') + ' ' + (i < 2 ? ovAbs(st) : M[i]));
  });
  q.nums.forEach((v, i) => { s += '<ellipse cx="' + cx(i) + '" cy="92" rx="30" ry="18" fill="var(--well)" stroke="var(--line)" stroke-width="1.5"/>' + t(cx(i), 100, i < 2 ? L[i] : v); });
  return '<svg viewBox="0 0 ' + W + ' 118" style="display:block; width:100%; max-width:' + Math.round(W * 1.05) + 'px; margin:6px auto 0" role="img" aria-label="' + tr('числа, свързани със стрелки', 'числа, з’єднані стрілками') + '">' + s + '</svg>';
}
const OV_Q = '<tspan fill="var(--accent)">?</tspan>';
function ovStripSvg(q){
  const n = q.nums.length, W = 78 + (n - 1)*80, cx = i => 39 + i*80, t = (x, y, s) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="22" font-weight="800" fill="var(--ink)" ' + SVG_FONT + '>' + s + '</text>';
  const asked = (k, i) => q.at[0] === k && q.at[1] === i;
  let s = '';
  q.steps.forEach((st, i) => {
    const x = cx(i), hid = q.hideS.indexOf(i) >= 0, sign = st < 0 ? '−' : '+';
    s += '<path d="M' + (x + 16) + ' 72 Q' + (x + 40) + ' 46 ' + (x + 64) + ' 72" fill="none" stroke="var(--muted)" stroke-width="2"/>' +
      '<path d="M' + (x + 64 - 2.1) + ' ' + (72 - 7.7) + ' L' + (x + 64) + ' 72 L' + (x + 64 - 7.7) + ' ' + (72 - 2.1) + '" fill="none" stroke="var(--muted)" stroke-width="2"/>';
    if(hid && !asked('s', i)) s += t(x + 30, 30, sign) + '<rect x="' + (x + 40) + '" y="12" width="26" height="24" rx="4" fill="none" stroke="var(--ink)" stroke-width="1.5"/>';
    else s += t(x + 40, 30, sign + ' ' + (asked('s', i) ? OV_Q : ovAbs(st)));
  });
  q.nums.forEach((v, i) => {
    const hid = q.hideN.indexOf(i) >= 0;
    s += '<ellipse cx="' + cx(i) + '" cy="92" rx="30" ry="18" fill="var(--well)" stroke="var(--line)" stroke-width="1.5"/>' + (hid ? asked('n', i) ? t(cx(i), 100, OV_Q) : '' : t(cx(i), 100, v));
  });
  return '<svg viewBox="0 0 ' + W + ' 118" style="display:block; width:100%; max-width:' + Math.round(W * 1.05) + 'px; margin:6px auto 0" role="img" aria-label="' + tr('числа, свързани със стрелки', 'числа, з’єднані стрілками') + '">' + s + '</svg>';
}
// a box shown as an empty square, the asked one as «?»
const ovBox = (q, i) => '<span style="display:inline-block; min-width:1.6em; padding:0 .15em; border:1.5px solid var(--ink); border-radius:5px; text-align:center">' + (q.at[1] === i ? '<span style="color:var(--accent)">?</span>' : '&nbsp;') + '</span>';
function drawOvals(q){
  if(q.shape === 'letters') return '<div class="ask">' + tr('Част от числата на схемата са скрити с буквите a, b, c и d. Кое от числата не е равно на нито една от тези букви?',
    'Частину чисел на схемі приховано буквами a, b, c і d. Яке з чисел не дорівнює жодній із цих букв?') + '</div>' + ovLettersSvg(q);
  if(q.shape === 'eqs'){
    const rows = q.steps.map((s, i) => '<span>' + (i ? ovBox(q, i) : q.nums[0]) + ' ' + (s < 0 ? '−' : '+') + ' ' + ovAbs(s) + ' = ' + ovBox(q, i + 1) + '</span>');
    return '<div class="ask">' + tr('Попълни верижката: всеки отговор е първото число на следващия ред. Кое число е на мястото на „?“?',
      'Заповни ланцюжок: кожна відповідь — перше число наступного рядка. Яке число стоїть на місці «?»?') + '</div>' +
      '<div class="eqs">' + rows.join('') + '</div><div class="line xl">? = ' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr('Намери неизвестните числа. Кое число е на мястото на „?“?', 'Знайди невідомі числа. Яке число стоїть на місці «?»?') + '</div>' +
    ovStripSvg(q) + '<div class="line xl">? = ' + SLOT + '</div>';
}
// the summary line is plain text
const eqOvals = q => q.shape === 'letters' ? 'b = ' + q.nums[1] + ', a = ' + q.nums[0] + ', c = ' + q.steps[2] + ', d = ' + -q.steps[3] + ' → ' + q.ans : ovNeeded(q).map(d => d[2]).join(', ');
function whyOvals(q, full){
  if(q.shape === 'letters'){
    if(!full) return tr('Намери всяка от буквите — числата се получават от съседите им и от стрелките. После виж кое число не е сред тях.', 'Знайди кожну з букв — числа виходять із сусідів і зі стрілок. Потім подивись, якого числа серед них немає.');
    const [a, b, n2, n3, n4] = q.nums, c = q.steps[2], d = -q.steps[3];
    return 'b = ' + n2 + ' + ' + (b - n2) + ' = <b>' + b + '</b>, &nbsp;a = ' + b + ' − ' + (b - a) + ' = <b>' + a + '</b>, &nbsp;c = ' + n3 + ' − ' + n2 + ' = <b>' + c + '</b>, &nbsp;d = ' + n3 + ' − ' + n4 + ' = <b>' + d +
      '</b> &nbsp;→&nbsp; ' + tr('никое от тях не е ', 'жодне з них не дорівнює ') + q.ans;
  }
  if(!full) return q.shape === 'eqs' ? tr('Започни от първия ред и върви надолу: всеки отговор е началото на следващия ред.', 'Почни з першого рядка й іди вниз: кожна відповідь — початок наступного рядка.')
    : tr('Стрелката с + води към по-голямо число, с − към по-малко. Скрито число намираш от съседа му, а скрита стъпка — от двата края на стрелката.',
         'Стрілка з + веде до більшого числа, з − до меншого. Приховане число знаходиш від сусіда, а прихований крок — від двох кінців стрілки.');
  return ovNeeded(q).map((d, j, all) => j === all.length - 1 ? d[2] : d[2].replace(/= (\d+)$/, '= <b>$1</b>')).join(' &nbsp;→&nbsp; ');
}
KIND.ovals = { draw:drawOvals, eq:eqOvals, why:whyOvals };
