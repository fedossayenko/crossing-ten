// Question kind 'sides': level 157 Двете страни — A box at the end of one side of an equality of two short chains.

// МБГ Пролет 2025, 1 клас, задача 3: 2 + 0 − 2 + 4 = 2 + 0 − 2 + 5 − ☺. Both sides start with the
// same 2 + 0 − 2, so only what follows matters: 4 = 5 − ☺, ☺ = 1. Пролет 2023, задача 3:
// 2 + 0 + 2 + 3 = 2 + 2 + 2 + 2 − □ — no shared start; each side worked out, 7 = 8 − □, □ = 1.
// МБГ Пролет 2022, 1 клас, задача 2: 10 − 2 − □ = 2 — 10 − 2 = 8, and 8 − □ = 2 leaves □ = 6. Пролет 2021,
// задача 2: 21 − □ = 9, □ = 12. A short chain whose last number is the box, equal to a plain number;
// or, with two numbers, the box first: □ − 3 = 9. terms holds the box's own number at index at.
import { KIND, SLOT, exprText, rnd, tr } from '../js/core.js';
function genSidesOne(){
  for(;;){
    const len = 2 + rnd(2), terms = [{op:'', n: 2 + rnd(29)}];
    for(let i = 1; i < len; i++) terms.push({op: Math.random() < 0.6 ? '−' : '+', n: (len === 2 ? 1 : 0) + rnd(len === 2 ? 20 : 10)});
    let run = terms[0].n, ok = true;
    terms.slice(1).forEach(t => { if(t.op === '+' && run + t.n > 20) ok = false; run += t.op === '+' ? t.n : -t.n; if(run < 0) ok = false; });   // adding never goes past 20
    const at = len === 2 && Math.random() < 0.25 ? 0 : len - 1;
    if(!ok || terms[at].n > 29) continue;
    return {kind:'sides', shape:'one', sym:'□', terms, at, R: run, ans: terms[at].n};
  }
}
// МБГ Пролет 2022, 1 клас, задача 9: 10 + 20 + 30 + □ = 40 + 20 + 10 — 60 + □ = 70, □ = 10. Round tens.
function genSidesTens(){
  for(;;){
    const left = [0, 1, 2].map(i => ({op: i ? '+' : '', n: 10*(1 + rnd(4))})), right = [0, 1, 2].map(i => ({op: i ? '+' : '', n: 10*(1 + rnd(4))}));
    const VL = left.reduce((t, s) => t + s.n, 0), VR = right.reduce((t, s) => t + s.n, 0);
    if(VR <= VL || VR > 100) continue;   // within a hundred
    return {kind:'sides', shape:'tens', sym:'□', left, right, VL, VR, ans: VR - VL};
  }
}
// МБГ Полуфинал 2025, 1 клас, задача 4: 2 + 0 + 2 + 4 = 2 + 0 − 2 + 5 + ☺ — the two starts only look alike: the
// third sign is turned round (2 + 0 + 2 is 4, 2 + 0 − 2 is 0), so each side is worked out: 8 = 5 + ☺, ☺ = 3.
function genSidesFlip(){
  for(;;){
    const x = 1 + rnd(5), y = rnd(4), z = 1 + rnd(3), a = 1 + rnd(9), b = 1 + rnd(9);
    const VL = x + y + z + a, VR = x + y - z + b;
    if(x + y < z || VL < VR || VL - VR > 9) continue;
    return {kind:'sides', shape:'flip', sym:'☺', left:[{op:'', n:x}, {op:'+', n:y}, {op:'+', n:z}, {op:'+', n:a}],
            right:[{op:'', n:x}, {op:'+', n:y}, {op:'−', n:z}, {op:'+', n:b}], minus:false, VL, VR, ans: VL - VR};
  }
}
export function genSides(){
  const r = Math.random();
  if(r < 0.25) return genSidesOne();
  if(r < 0.4) return genSidesTens();
  if(r < 0.55) return genSidesFlip();
  for(;;){
    if(Math.random() < 0.5){
      // the same start on both sides, then a different last number, and ☺ taken off or added on
      const x = 1 + rnd(5), y = rnd(4), run = x + y, z = rnd(run + 1);
      const pre = [{op:'', n:x}, {op:'+', n:y}, {op:'−', n:z}];
      const a = 1 + rnd(9), b = 1 + rnd(9);
      if(a === b) continue;
      const minus = b > a;                       // 4 = 5 − ☺, or 5 = 4 + ☺
      return {kind:'sides', shape:'same', sym:'☺', left: pre.concat({op:'+', n:a}), right: pre.concat({op:'+', n:b}),
              minus, VL: run - z + a, VR: run - z + b, ans: Math.abs(b - a)};
    }
    // two different chains: small numbers added on the left, one number repeated on the right
    const k = 3 + rnd(2), left = [];
    for(let i = 0; i < k; i++) left.push({op: i ? '+' : '', n: (i ? 0 : 1) + rnd(i ? 5 : 4)});
    const x = 1 + rnd(4), m = 3 + rnd(3), right = Array.from({length: m}, (_, i) => ({op: i ? '+' : '', n: x}));
    const VL = left.reduce((t, s) => t + s.n, 0), VR = x*m, d = VR - VL;
    if(Math.abs(d) > 9 || VR > 20) continue;
    return {kind:'sides', shape:'diff', sym:'□', left, right, minus: d >= 0, VL, VR, ans: Math.abs(d)};
  }
}
const sidesRight = q => exprText(q.right) + (q.minus ? ' − ' : ' + ') + q.sym;
// the whole equality as printed
const sidesText = q => q.shape === 'one' ? exprText(q.terms.map((t, i) => i === q.at ? {op: t.op, n: q.sym} : t)) + ' = ' + q.R
  : q.shape === 'tens' ? exprText(q.left) + ' + ' + q.sym + ' = ' + exprText(q.right) : exprText(q.left) + ' = ' + sidesRight(q);
function drawSides(q){
  const e = sidesText(q);
  return '<div class="ask">' + tr('Кое число е скрито под ' + q.sym + '?', 'Яке число сховане під ' + q.sym + '?') + '</div>' +
    '<div class="line" style="font-size:clamp(17px,calc((100vw - 56px)/' + (e.length*0.56).toFixed(2) + '),36px)">' + e + '</div>' +
    '<div class="line lg">' + q.sym + ' = ' + SLOT + '</div>';
}
function eqSides(q){
  return sidesText(q) + ' → ' + q.sym + ' = ' + q.ans;
}
function whySides(q, full){
  if(q.shape === 'one'){
    if(!full) return tr('Пресметни първо това, което знаеш. После: какво трябва да е ' + q.sym + ', за да излезе числото вдясно?',
      'Спершу обчисли те, що знаєш. Потім: яким має бути ' + q.sym + ', щоб вийшло число праворуч?');
    if(q.at === 0){ const t = q.terms[1]; return q.sym + ' ' + t.op + ' ' + t.n + ' = ' + q.R + ' &nbsp;→&nbsp; ' + q.sym + ' = ' + q.R + (t.op === '−' ? ' + ' : ' − ') + t.n + ' = ' + q.ans; }
    const pre = q.terms.slice(0, q.at), P = pre.reduce((v, t) => t.op === '−' ? v - t.n : v + t.n, 0), op = q.terms[q.at].op;
    return (pre.length > 1 ? exprText(pre) + ' = <b>' + P + '</b> &nbsp;→&nbsp; ' : '') + P + ' ' + op + ' ' + q.sym + ' = ' + q.R + ' &nbsp;→&nbsp; ' + q.sym + ' = ' +
      (op === '−' ? P + ' − ' + q.R : q.R + ' − ' + P) + ' = ' + q.ans;
  }
  if(q.shape === 'tens'){
    if(!full) return tr('Пресметни всяка страна без ' + q.sym + '. С колко дясната е повече?', 'Обчисли кожну сторону без ' + q.sym + '. На скільки права більша?');
    return tr('лявата страна: ', 'ліва сторона: ') + exprText(q.left) + ' = <b>' + q.VL + '</b>, ' + tr('дясната: ', 'права: ') + exprText(q.right) + ' = <b>' + q.VR +
      '</b> &nbsp;→&nbsp; ' + q.VL + ' + ' + q.sym + ' = ' + q.VR + ' &nbsp;→&nbsp; ' + q.sym + ' = ' + q.VR + ' − ' + q.VL + ' = ' + q.ans;
  }
  if(q.shape === 'flip'){
    if(!full) return tr('Двете страни само изглеждат еднакво — виж знаците! Пресметни всяка страна поотделно.', 'Обидві сторони лише здаються однаковими — подивись на знаки! Обчисли кожну сторону окремо.');
    const z = q.left[2].n;
    return tr('вляво е <b>+ ' + z + '</b>, а вдясно <b>− ' + z + '</b>', 'ліворуч <b>+ ' + z + '</b>, а праворуч <b>− ' + z + '</b>') + ' &nbsp;→&nbsp; ' +
      tr('лявата страна: ', 'ліва сторона: ') + exprText(q.left) + ' = <b>' + q.VL + '</b>, ' + tr('дясната: ', 'права: ') + exprText(q.right) + ' = <b>' + q.VR +
      '</b> &nbsp;→&nbsp; ' + q.VL + ' = ' + q.VR + ' + ' + q.sym + ' &nbsp;→&nbsp; ' + q.sym + ' = ' + q.VL + ' − ' + q.VR + ' = ' + q.ans;
  }
  if(q.shape === 'same'){
    if(!full) return tr('И двете страни започват еднакво — сравни само това, което е различно.', 'Обидві сторони починаються однаково — порівняй лише те, що різне.');
    const a = q.left[3].n, b = q.right[3].n;
    return tr('и двете страни започват с <b>', 'обидві сторони починаються з <b>') + exprText(q.left.slice(0, 3)) +
      tr('</b> — то е еднакво и не се брои', '</b> — це однакове, його не рахуємо') + ' &nbsp;→&nbsp; ' + a + ' = ' + b + (q.minus ? ' − ' : ' + ') + q.sym +
      ' &nbsp;→&nbsp; ' + q.sym + ' = ' + (q.minus ? b + ' − ' + a : a + ' − ' + b) + ' = ' + q.ans;
  }
  if(!full) return tr('Пресметни всяка страна поотделно. После: колко трябва да махнеш или добавиш, за да станат равни?',
    'Обчисли кожну сторону окремо. Потім: скільки треба відняти чи додати, щоб вони стали рівні?');
  return tr('лявата страна: ', 'ліва сторона: ') + exprText(q.left) + ' = <b>' + q.VL + '</b>, ' + tr('дясната: ', 'права: ') +
    exprText(q.right) + ' = <b>' + q.VR + '</b> &nbsp;→&nbsp; ' + q.VL + ' = ' + q.VR + (q.minus ? ' − ' : ' + ') + q.sym +
    ' &nbsp;→&nbsp; ' + q.sym + ' = ' + (q.minus ? q.VR + ' − ' + q.VL : q.VL + ' − ' + q.VR) + ' = ' + q.ans;
}
KIND.sides = { draw:drawSides, eq:eqSides, why:whySides };
