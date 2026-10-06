// Question kind 'cross': level 44 Зачеркни — Cross out one digit to make it true.

// Задача 19: one digit struck out makes the equation true. Built backwards, then every
// possible deletion is tried so the digit to cross is never in doubt.
import { KIND, SLOT, rnd, shuffle, tr } from '../js/core.js';
export function genCross(){
  for(;;){
    const A = 10*(1 + rnd(5)), C = 10*(1 + rnd(5)), B = 10*(1 + rnd(9));
    const D = A + C;
    if(D > 99) continue;
    const parts = [A, B, C, D];
    const hits = [];
    for(let t = 0; t < 4; t++){
      const str = String(parts[t]);
      for(let i = 0; i < str.length; i++){
        const left = str.slice(0, i) + str.slice(i + 1);
        if(left === '') continue;
        const p2 = parts.slice();
        p2[t] = Number(left);
        if(p2[0] + p2[1] + p2[2] === p2[3]) hits.push({t, i, digit: +str[i], left: p2[t]});
      }
    }
    const values = new Set(hits.map(h => h.digit));
    if(!hits.length || values.size !== 1) continue;      // the digit to cross must be beyond doubt
    return {kind:'cross', A, B, C, D, hit: hits[0], ans: hits[0].digit};
  }
}

// МБГ Пролет 2021, 1 клас, задача 12: in each row one digit is struck out to make the equality true, and ☹ is
// that digit — 29 − 23 = 27 becomes 29 − 2 = 27, so ☹ = 3. Then 23 − 18 = 15: 23 − 8 = 15, ☹ = 1.
const CROSS_TWO_EX = [[29, '−', 23, 27, 1, 2, 3], [19, '+', 23, 24, 0, 1, 9]];   // [a, op, b, c, which number, what is left, the digit]
export function genCrossTwo(){
  for(;;){
    const plus = Math.random() < 0.5, a = 1 + rnd(29), b = 1 + rnd(29), c = plus ? a + b : a - b;
    if(c < 0 || c > 29) continue;
    // a tens digit put in front (8 → 18, ☹ = 1) or a units digit after (2 → 23, ☹ = 3), so ☹ can be any digit
    const parts = [a, b, c], t = rnd(3), units = Math.random() < 0.6;
    if(units ? !parts[t] || parts[t] > 2 : parts[t] > 9) continue;
    const shown = parts.slice(); shown[t] = units ? 10*parts[t] + rnd(10) : 10*(1 + rnd(2)) + parts[t];
    const v = plus ? shown[0] + shown[1] : shown[0] - shown[1];
    if(shown[t] > 29 || v < 0 || v > 29 || (!plus && shown[0] < shown[1]) || CROSS_TWO_EX.some(e => e[0] === shown[0] && e[2] === shown[1])) continue;
    const hits = [];
    shown.forEach((v, k) => { const s = String(v); for(let i = 0; i < s.length; i++){ const left = s.slice(0, i) + s.slice(i + 1); if(!left) continue;
      const p = shown.slice(); p[k] = +left; if((plus ? p[0] + p[1] : p[0] - p[1]) === p[2]) hits.push({t:k, i, digit:+s[i], left:p[k]}); } });
    if(!hits.length || new Set(hits.map(h => h.digit)).size !== 1) continue;
    return {kind:'cross', shape:'two', op: plus ? '+' : '−', shown, hit: hits[0], ans: hits[0].digit};
  }
}
const crossTwoText = (s, op) => s[0] + ' ' + op + ' ' + s[1] + ' = ' + s[2];
// МБГ Полуфинал 2024, 1 клас, задача 16: the fewest digits to cross out of 2 + 7 + 13 = 10 for a true equality — one,
// the 3: 2 + 7 + 1 = 10. Built from a true sum with one or two digits slipped in; then every set of digits is
// crossed out, fewest first, so the answer is the true least (a slipped-in pair may need only one).
// cut: [which number, which digit] of the first fewest found; a number keeps a digit and 0 never leads.
function crossFewest(shown){
  const at = []; shown.forEach((v, t) => String(v).split('').forEach((_, i) => at.push([t, i])));
  let best = null;
  for(let m = 0; m < 1 << at.length; m++){
    const cut = at.filter((_, k) => m >> k & 1);
    if(best && cut.length >= best.length) continue;
    const left = shown.map((v, t) => String(v).split('').filter((_, i) => !cut.some(c => c[0] === t && c[1] === i)).join(''));
    if(left.some(w => !w || (w.length > 1 && w[0] === '0'))) continue;
    if(left.slice(0, -1).reduce((t, w) => t + +w, 0) === +left[left.length - 1]) best = cut;   // the addends against the last number
  }
  return best;
}
// МБГ Полуфинал 2023, 1 клас, задача 16: 10 + 20 + 30 + 40 = 10 — the fewest digits to cross out is 3: 10 + 0 + 0 + 0 = 10.
// Three or four round tens, any order, equal to the smallest: every other one loses its tens digit. Drawn after the
// other question, so its seed keeps it.
function genCrossTens(){
  for(;;){
    const k = Math.random() < 0.5 ? 3 : 4, ns = shuffle([10, 20, 30, 40, 50]).slice(0, k), shown = ns.concat(Math.min(...ns)), cut = crossFewest(shown);
    if(!cut || cut.length !== k - 1) continue;
    // the slips: every addend crossed, or one fewer than needed
    return {kind:'cross', shape:'tens', shown, cut, traps:[k, k - 2].filter(v => v > 0), ans: cut.length};
  }
}
export function genCrossFew(){
  const q = genCrossFewSlip();
  return Math.random() < 0.25 ? genCrossTens() : q;
}
function genCrossFewSlip(){
  for(;;){
    const parts = [1 + rnd(9), 1 + rnd(9), 1 + rnd(9)];
    parts.push(parts[0] + parts[1] + parts[2]);
    if(parts[3] > 20) continue;
    const w = parts.map(String);
    for(let n = Math.random() < 0.6 ? 1 : 2; n > 0; n--){ const t = rnd(4), i = rnd(w[t].length + 1); w[t] = w[t].slice(0, i) + rnd(10) + w[t].slice(i); }
    if(w.some(x => x.length > 2 || x[0] === '0')) continue;
    const shown = w.map(Number), cut = crossFewest(shown), L = shown[0] + shown[1] + shown[2];
    if(!cut || !cut.length) continue;
    // the slips: the gap between the two sides, or the digit crossed out instead of how many
    const traps = [Math.abs(L - shown[3]), cut.length === 1 ? +String(shown[cut[0][0]])[cut[0][1]] : 1].filter((v, k, a) => v !== cut.length && a.indexOf(v) === k);
    return {kind:'cross', shape:'few', shown, cut, traps, ans: cut.length};
  }
}
// the numbers with each crossed-out digit marked (or dropped), and the equality they make
const crossFewNums = (q, mark) => q.shown.map((v, t) => String(v).split('').map((c, i) => q.cut.some(x => x[0] === t && x[1] === i) ? mark(c) : c).join(''));
const crossFewEq = w => w.slice(0, -1).join(' + ') + ' = ' + w[w.length - 1];
function drawCross(q){
  if(q.shape === 'tens'){
    return '<div class="ask">' + tr('Колко <b>най-малко</b> цифри трябва да зачеркнем, за да е вярно следното?',
      'Яку <b>найменшу</b> кількість цифр треба закреслити, щоб рівність стала правильною?') + '</div>' +
      '<div class="given">' + crossFewEq(q.shown) + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'few'){
    return '<div class="ask">' + tr('Колко <b>най-малко</b> цифри трябва да зачеркнем, така че след пресмятането да се получи верен отговор?',
      'Яку <b>найменшу</b> кількість цифр треба закреслити, щоб після обчислення вийшла правильна відповідь?') + '</div>' +
      '<div class="given">' + q.shown[0] + ' + ' + q.shown[1] + ' + ' + q.shown[2] + ' = ' + q.shown[3] + '</div>' +
      '<div class="line xl">' + SLOT + '</div>';
  }
  if(q.shape === 'two'){
    const ex = e => { const s = [e[0], e[2], e[3]], l = s.slice(); l[e[4]] = e[5]; return '<div class="given" style="font-size:clamp(15px,4vw,21px)">' + crossTwoText(s, e[1]) + ' &nbsp;⟹&nbsp; ' + crossTwoText(l, e[1]) + ' &nbsp;⟹&nbsp; ☹ = ' + e[6] + '</div>'; };
    return '<div class="ask">' + tr('Във всеки ред е зачеркната една цифра, за да стане равенството вярно. ☹ е зачеркнатата цифра.', 'У кожному рядку закреслено одну цифру, щоб рівність стала правильною. ☹ — це закреслена цифра.') + '</div>' +
      CROSS_TWO_EX.map(ex).join('') + '<div class="line" style="font-size:clamp(26px,7vw,42px)">' + crossTwoText(q.shown, q.op) + ' &nbsp;⟹&nbsp; ☹ = ' + SLOT + '</div>';
  }
  return '<div class="ask">' + tr('Коя цифра трябва да се зачеркне, за да се получи вярно равенство?', 'Яку цифру треба закреслити, щоб вийшла правильна рівність?') + '</div>' +
    '<div class="given">' + q.A + ' + ' + q.B + ' + ' + q.C + ' = ' + q.D + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
function eqCross(q){
  if(q.shape === 'few' || q.shape === 'tens') return crossFewEq(q.shown) + ' → ' + crossFewEq(crossFewNums(q, () => '')) + ' → ' + q.ans;
  if(q.shape === 'two'){ const l = q.shown.slice(); l[q.hit.t] = q.hit.left; return crossTwoText(q.shown, q.op) + ' → ' + crossTwoText(l, q.op) + ' → ' + q.ans; }
  return q.A + ' + ' + q.B + ' + ' + q.C + ' = ' + q.D + tr(' → зачерква се ', ' → закреслюємо ') + q.ans;
}
function whyCross(q, full){
  if(q.shape === 'tens'){
    if(!full) return tr('Гледай само цифрите на десетиците. Зачеркнеш ли цифрата на десетиците, числото става 0.',
      'Дивись лише на цифри десятків. Якщо закреслити цифру десятків, число стане 0.');
    const keep = q.shown[q.shown.length - 1];
    return tr('отляво остава ' + keep + ', а всяко друго число става 0 — по една цифра от всяко', 'ліворуч лишається ' + keep + ', а кожне інше число стає 0 — по одній цифрі з кожного') +
      ' &nbsp;→&nbsp; ' + crossFewEq(crossFewNums(q, c => '<s style="color:var(--bad)">' + c + '</s>')) + ' &nbsp;→&nbsp; <b>' + crossFewEq(crossFewNums(q, () => '')) + '</b>' +
      ' &nbsp;→&nbsp; ' + tr('най-малко ', 'найменше ') + q.ans;
  }
  if(q.shape === 'few'){
    if(!full) return tr('Пресметни лявата страна и я сравни с дясната. Опитай да зачеркнеш една цифра; ако не стига — две.',
      'Обчисли ліву частину й порівняй із правою. Спробуй закреслити одну цифру; якщо не вистачить — дві.');
    return (q.ans > 1 ? tr('с една зачеркната цифра не става; ', 'однієї закресленої цифри замало; ') : '') +
      q.shown[0] + ' + ' + q.shown[1] + ' + ' + q.shown[2] + ' = ' + (q.shown[0] + q.shown[1] + q.shown[2]) + tr(', а не ', ', а не ') + q.shown[3] +
      ' &nbsp;→&nbsp; ' + crossFewEq(crossFewNums(q, c => '<s style="color:var(--bad)">' + c + '</s>')) + ' &nbsp;→&nbsp; <b>' + crossFewEq(crossFewNums(q, () => '')) + '</b>' +
      ' &nbsp;→&nbsp; ' + tr('най-малко ', 'найменше ') + q.ans;
  }
  if(q.shape === 'two'){
    if(!full) return tr('Пресметни лявата страна — вярно ли е? Опитай да махнеш по една цифра.', 'Обчисли ліву частину — чи правильно? Спробуй прибрати по одній цифрі.');
    const l = q.shown.slice(), v = q.op === '+' ? q.shown[0] + q.shown[1] : q.shown[0] - q.shown[1];
    l[q.hit.t] = q.hit.left;
    return q.shown[0] + ' ' + q.op + ' ' + q.shown[1] + ' = ' + v + tr(', а не ', ', а не ') + q.shown[2] + ' &nbsp;→&nbsp; ' + tr('без цифрата ', 'без цифри ') + q.ans + ': <b>' + crossTwoText(l, q.op) + '</b> &nbsp;→&nbsp; ☹ = ' + q.ans;
  }
  const names = ['първото число', 'второто число', 'третото число', 'сбора'];
  const after = [q.A, q.B, q.C, q.D];
  after[q.hit.t] = q.hit.left;
  const ukIn = ['у першому числі', 'у другому числі', 'у третьому числі', 'у сумі'];
  return !full ? tr('Пресметни лявата страна — с колко се разминава?', 'Обчисли ліву сторону — на скільки вона відрізняється від правої?')
    : q.A + ' + ' + q.B + ' + ' + q.C + ' = ' + (q.A + q.B + q.C) + tr(', а трябва ', ', а має бути ') + q.D +
      ' &nbsp;→&nbsp; ' + tr((/^[вф]/.test(names[q.hit.t]) ? 'във ' : 'в ') + names[q.hit.t] + ' зачеркваме <b>',
                             ukIn[q.hit.t] + ' закреслюємо <b>') + q.ans + '</b>: ' +
      after[0] + ' + ' + after[1] + ' + ' + after[2] + ' = ' + after[3] + tr(' &nbsp;→&nbsp; цифрата е ', ' &nbsp;→&nbsp; це цифра ') + q.ans;
}
KIND.cross = { draw:drawCross, eq:eqCross, why:whyCross };
