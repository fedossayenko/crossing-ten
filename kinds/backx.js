// Question kind 'backx': level 234 ((x : 2) · 4) · 8 and level 269 Намислих число — Undo the steps from the end to find x.

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
// «Намислих си число…». The trap is doing the steps again on the result instead of undoing them.
export function genBackPm(){
  const shape = Math.random() < 0.5 ? 'word' : 'arrow';
  for(;;){
    const x = 10 + rnd(90), steps = [0, 1, 2].map(() => (Math.random() < 0.5 ? -1 : 1) * (2 + rnd(18)));
    if(steps.every(s => s > 0) || steps.every(s => s < 0)) continue;
    let v = x;
    if(steps.some(s => (v += s) < 1 || v > 100)) continue;
    const again = v + steps.reduce((a, s) => a + s, 0);
    return {kind:'backx', shape, x, steps, r: v, traps: [again, v].filter((t, i, a) => t >= 0 && t !== x && a.indexOf(t) === i), ans: x};
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
KIND.backx = { draw: q => q.steps ? drawBackPm(q) : drawBackX(q), eq: q => q.steps ? backPmLine(q) : eqBackX(q),
  why: (q, full) => q.steps ? whyBackPm(q, full) : whyBackX(q, full) };
