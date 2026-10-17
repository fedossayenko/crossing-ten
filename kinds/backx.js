// Question kind 'backx': level 234 ((x : 2) · 4) · 8, level 269 Намислих число and level 274 Неизвестното число — Undo the steps from the end to find x.

// МБГ Есен 2023, 3 клас, задача 19 (shape 'num'): ((x : 2) · 4) · 8 = 64 — back from the end, 64 : 8 = 8, 8 : 4 = 2,
// and x = 2 · 2 = 4. Есен 2024, задача 9 (shape 'sum'): ((x : 2) · 3) · 4 = 5 · 9 − (1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9) —
// the right side first: 45 − 45 = 0, so x = 0. t is x : a, the number inside the first bracket; R the right side.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
const okTraps = (ans, vs) => vs.filter((v, i) => Number.isInteger(v) && v >= 0 && v < 1000 && v !== ans && vs.indexOf(v) === i);
export function genBackX(){
  if(Math.random() < 0.5){
    for(;;){
      const a = 2 + rnd(4), b = 2 + rnd(8), c = 2 + rnd(8), t = 1 + rnd(9), R = t*b*c;
      if(R > 200) continue;
      // stopping before the last step back (x : a, not x), and undoing only the last step
      return {kind:'backx', shape:'num', a, b, c, t, R, traps: okTraps(a*t, [t, R / c]), ans: a*t};
    }
  }
  // the right side m · k − (1 + 2 + … + n) is R = t · b · c; a third of these come to 0, as on the paper
  const t = rnd(3);
  for(;;){
    const a = 2 + rnd(4), b = 2 + rnd(8), c = 2 + rnd(8), n = 4 + rnd(6), s = n*(n + 1)/2, R = t*b*c, P = s + R;
    const ms = [];
    for(let m = 2; m*m <= P; m++) if(P % m === 0 && P / m <= 9) ms.push(m);
    if(!ms.length) continue;
    const m = ms[rnd(ms.length)];
    // the bracket's sum taken for the answer, and x : a for x
    return {kind:'backx', shape:'sum', a, b, c, t, R, n, m, k: P / m, traps: okTraps(a*t, [s, t]), ans: a*t};
  }
}
// 2nd grade, level 269 (shapes 'word' and 'arrow'): no × or : yet — three steps of + and −, undone from the end.
// МБГ Есен 2024, 1 клас, задача 12 drew it as arrows, ? −3 → +1 → −2 → 5; Есен 2013 and 2015, 2 клас, in words,
// «Намислих си число. Събрах го с 11 и получих 22», one step. The trap is doing the steps again on the result
// instead of undoing them. Steps of one digit, as on those papers: the thinking is the undoing, not the sums.
export function genBackPm(){
  const shape = Math.random() < 0.5 ? 'word' : 'arrow';
  for(;;){
    const x = 10 + rnd(90), steps = [0, 1, 2].map(() => (Math.random() < 0.5 ? -1 : 1) * (1 + rnd(9)));
    if(steps.every(s => s > 0) || steps.every(s => s < 0) || !steps.reduce((a, s) => a + s, 0)) continue;   // steps that cancel leave the result the number
    let v = x;
    if(steps.some(s => (v += s) < 1 || v > 100)) continue;
    const again = v + steps.reduce((a, s) => a + s, 0);
    return {kind:'backx', shape, x, steps, r: v, traps: [again, v].filter((t, i, a) => t >= 0 && t !== x && a.indexOf(t) === i), ans: x};
  }
}
// Level 274 Неизвестното число, one step back. Аз и числата 2026, задача 3 (shape 'think'): «Намислих число. Към него
// прибавих 26 и получих 95» — 95 − 26 = 69; here also «от него извадих», which is undone by adding. Аз и числата 2024,
// задача 3 (shapes 'x' and 'brx'): 9 + x = 55, so x = 55 − 9 = 46; (46 + 7) + x = 75 — the bracket first, 53 + x = 75,
// x = 22. The slips: adding the two numbers given (95 + 26), and taking away only one number of the bracket (75 − 46).
export function genBackAdd(){
  const w = Math.random(), shape = w < 0.4 ? 'think' : w < 0.7 ? 'x' : 'brx';
  for(;;){
    if(shape === 'brx'){
      const a = 11 + rnd(60), b = 2 + rnd(9), s = a + b, x = 5 + rnd(60), c = s + x;
      if(c > 99) continue;
      return {kind:'backx', shape, a, b, s, c, traps: [c - a, c - b].filter(t => t !== x && t >= 0), ans: x};
    }
    const minus = shape === 'think' && Math.random() < 0.3, a = shape === 'x' && Math.random() < 0.4 ? 2 + rnd(8) : 11 + rnd(40), x = 10 + rnd(90);
    const c = minus ? x - a : x + a;
    if(c < 1 || c > 99 || a === x) continue;
    return {kind:'backx', shape, minus, a, c, traps: [minus ? c - a : c + a].filter(t => t !== x && t >= 0), ans: x};
  }
}
const nw = s => '<span style="white-space:nowrap">' + s + '</span>';
const backLhs = (q, x) => '((' + x + ' : ' + q.a + ') · ' + q.b + ') · ' + q.c;
const runTo = n => [...Array(n).keys()].map(i => i + 1);
function drawBackX(q){
  const X = '<i>x</i>';
  // the long right side may break before a +, never inside a term
  const rhs = q.shape === 'num' ? nw(q.R) : nw(q.m + ' · ' + q.k + ' −') + ' ' + runTo(q.n).map(v => v === 1 ? '(1' : nw('+ ' + v + (v === q.n ? ')' : ''))).join(' ');
  return '<div class="ask">' + tr('Кое число трябва да поставим вместо ' + X + '?', 'Яке число треба поставити замість ' + X + '?') + '</div>' +
    '<div class="given">' + nw(backLhs(q, X) + ' =') + ' ' + rhs + '</div>' +
    '<div class="line xl">' + X + ' = ' + SLOT + '</div>';
}
// the summary line is plain text
function eqBackX(q){
  const back = q.R + ' : ' + q.c + ' : ' + q.b + ' · ' + q.a + ' = ' + q.ans;
  if(q.shape === 'num') return back;
  return q.m + ' · ' + q.k + ' − ' + q.n*(q.n + 1)/2 + ' = ' + q.R + ' → x = ' + back;
}
function whyBackX(q, full){
  if(!full) return q.shape === 'num' ? tr('Върви отзад напред: умножението се връща с делене, а делението — с умножение.',
                                          'Іди з кінця: множення повертаємо діленням, а ділення — множенням.')
    : tr('Първо пресметни дясната страна. После върви отзад напред.', 'Спершу обчисли праву частину. Потім іди з кінця.');
  const back = q.R + ' : ' + q.c + ' = <b>' + q.R / q.c + '</b> &nbsp;→&nbsp; ' + q.R / q.c + ' : ' + q.b + ' = <b>' + q.t + '</b> &nbsp;→&nbsp; <i>x</i> = ' +
    q.t + ' · ' + q.a + ' = ' + q.ans;
  if(q.shape === 'num') return back;
  const s = q.n*(q.n + 1)/2;
  return '1 + 2 + … + ' + q.n + ' = ' + s + ', &nbsp;' + q.m + ' · ' + q.k + ' = ' + q.m*q.k + ' &nbsp;→&nbsp; ' + q.m*q.k + ' − ' + s + ' = <b>' + q.R + '</b> &nbsp;→&nbsp; ' + back;
}
const pmStep = s => (s < 0 ? '− ' : '+ ') + Math.abs(s);
function drawBackPm(q){
  if(q.shape === 'arrow') return '<div class="ask">' + tr('Кое число трябва да е на мястото на „?“?', 'Яке число має бути на місці «?»?') + '</div>' +
    '<div class="given">? ' + q.steps.map(s => nw((s < 0 ? '−' : '+') + Math.abs(s) + ' →')).join(' ') + ' ' + q.r + '</div>' +
    '<div class="line xl">? = ' + SLOT + '</div>';
  const num = n => '<span class="num">' + n + '</span>', [a, b, c] = q.steps.map(s => num(Math.abs(s))), minus = q.steps.map(s => s < 0);
  return '<div class="ask">' + tr('Намислих си число. ' + (minus[0] ? 'От него извадих ' : 'Към него прибавих ') + a + ', после ' + (minus[1] ? 'извадих ' : 'прибавих ') + b +
      ' и накрая ' + (minus[2] ? 'извадих ' : 'прибавих ') + c + '. Получих ' + num(q.r) + '. Кое число съм намислил?',
    'Я задумав число. ' + (minus[0] ? 'Від нього відняв ' : 'До нього додав ') + a + ', потім ' + (minus[1] ? 'відняв ' : 'додав ') + b +
      ' і нарешті ' + (minus[2] ? 'відняв ' : 'додав ') + c + '. Отримав ' + num(q.r) + '. Яке число я задумав?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
// the summary line is plain text: the result, then the steps backwards with their signs turned round
const backPmLine = q => q.r + ' ' + q.steps.slice().reverse().map(s => pmStep(-s)).join(' ') + ' = ' + q.x;
function whyBackPm(q, full){
  if(!full) return tr('Върви отзад напред: където е извадено, прибави, а където е прибавено — извади.', 'Іди з кінця: де віднято — додай, а де додано — відніми.');
  let v = q.r;
  return q.steps.slice().reverse().map(s => { const w = v - s, t = nw(v + ' ' + pmStep(-s) + ' = <b>' + w + '</b>'); v = w; return t; }).join(' &nbsp;→&nbsp; ');
}
const ADD_SHAPES = { think:1, x:1, brx:1 };
function drawBackAdd(q){
  const X = '<i>x</i>', num = n => '<span class="num">' + n + '</span>';
  if(q.shape === 'think') return '<div class="ask">' + tr('Намислих число. ' + (q.minus ? 'От него извадих ' : 'Към него прибавих ') + num(q.a) + ' и получих ' + num(q.c) + '. Кое число съм намислил?',
      'Я задумав число. ' + (q.minus ? 'Від нього відняв ' : 'До нього додав ') + num(q.a) + ' і отримав ' + num(q.c) + '. Яке число я задумав?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
  return '<div class="ask">' + tr('Намери неизвестното число.', 'Знайди невідоме число.') + '</div>' +
    '<div class="given">' + nw((q.shape === 'brx' ? '(' + q.a + ' + ' + q.b + ')' : q.a) + ' + ' + X + ' = ' + q.c) + '</div>' +
    '<div class="line xl">' + X + ' = ' + SLOT + '</div>';
}
// the summary line is plain text
const eqBackAdd = q => (q.shape === 'brx' ? q.a + ' + ' + q.b + ' = ' + q.s + ', ' + q.c + ' − ' + q.s : q.minus ? q.c + ' + ' + q.a : q.c + ' − ' + q.a) + ' = ' + q.ans;
function whyBackAdd(q, full){
  if(!full){
    if(q.minus) return tr('Върни стъпката обратно: каквото е извадено, го прибави.', 'Поверни крок назад: що відняли — додай.');
    return (q.shape === 'brx' ? tr('Първо пресметни скобата. ', 'Спершу обчисли дужку. ') : '') +
      tr('Неизвестното събираемо е сборът без другото събираемо.', 'Невідомий доданок — це сума без іншого доданка.');
  }
  if(q.shape === 'brx') return q.a + ' + ' + q.b + ' = <b>' + q.s + '</b> &nbsp;→&nbsp; ' + nw(q.s + ' + <i>x</i> = ' + q.c) + ' &nbsp;→&nbsp; <i>x</i> = ' + q.c + ' − ' + q.s + ' = ' + q.ans;
  if(q.minus) return nw('? − ' + q.a + ' = ' + q.c) + ' &nbsp;→&nbsp; ' + q.c + ' + ' + q.a + ' = ' + q.ans;
  return nw((q.shape === 'x' ? q.a + ' + <i>x</i>' : '? + ' + q.a) + ' = ' + q.c) + ' &nbsp;→&nbsp; ' + q.c + ' − ' + q.a + ' = ' + q.ans;
}
KIND.backx = { draw: q => ADD_SHAPES[q.shape] ? drawBackAdd(q) : q.steps ? drawBackPm(q) : drawBackX(q),
  eq: q => ADD_SHAPES[q.shape] ? eqBackAdd(q) : q.steps ? backPmLine(q) : eqBackX(q),
  why: (q, full) => ADD_SHAPES[q.shape] ? whyBackAdd(q, full) : q.steps ? whyBackPm(q, full) : whyBackX(q, full) };
