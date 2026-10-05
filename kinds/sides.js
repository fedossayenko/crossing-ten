// Question kind 'sides': level 157 Двете страни — A box at the end of one side of an equality of two short chains.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025, 1 клас, задача 3: 2 + 0 − 2 + 4 = 2 + 0 − 2 + 5 − ☺. Both sides start with the
// same 2 + 0 − 2, so only what follows matters: 4 = 5 − ☺, ☺ = 1. Пролет 2023, задача 3:
// 2 + 0 + 2 + 3 = 2 + 2 + 2 + 2 − □ — no shared start; each side worked out, 7 = 8 − □, □ = 1.
function genSides(){
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
function drawSides(q){
  if(q.kind === 'sides'){
    const e = exprText(q.left) + ' = ' + sidesRight(q);
    return '<div class="ask">' + tr('Кое число е скрито под ' + q.sym + '?', 'Яке число сховане під ' + q.sym + '?') + '</div>' +
      '<div class="line" style="font-size:clamp(17px,calc((100vw - 56px)/' + (e.length*0.56).toFixed(2) + '),36px)">' + e + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + q.sym + ' = ' + SLOT + '</div>';
  }
}
function eqSides(q){
  if(q.kind === 'sides') return exprText(q.left) + ' = ' + sidesRight(q) + ' → ' + q.sym + ' = ' + q.ans;
}
function whySides(q, full){
  if(q.kind === 'sides' && q.shape === 'same'){
    if(!full) return tr('И двете страни започват еднакво — сравни само това, което е различно.', 'Обидві сторони починаються однаково — порівняй лише те, що різне.');
    const a = q.left[3].n, b = q.right[3].n;
    return tr('и двете страни започват с <b>', 'обидві сторони починаються з <b>') + exprText(q.left.slice(0, 3)) +
      tr('</b> — то е еднакво и не се брои', '</b> — це однакове, його не рахуємо') + ' &nbsp;→&nbsp; ' + a + ' = ' + b + (q.minus ? ' − ' : ' + ') + q.sym +
      ' &nbsp;→&nbsp; ' + q.sym + ' = ' + (q.minus ? b + ' − ' + a : a + ' − ' + b) + ' = ' + q.ans;
  }
  if(q.kind === 'sides'){
    if(!full) return tr('Пресметни всяка страна поотделно. После: колко трябва да махнеш или добавиш, за да станат равни?',
      'Обчисли кожну сторону окремо. Потім: скільки треба відняти чи додати, щоб вони стали рівні?');
    return tr('лявата страна: ', 'ліва сторона: ') + exprText(q.left) + ' = <b>' + q.VL + '</b>, ' + tr('дясната: ', 'права: ') +
      exprText(q.right) + ' = <b>' + q.VR + '</b> &nbsp;→&nbsp; ' + q.VL + ' = ' + q.VR + (q.minus ? ' − ' : ' + ') + q.sym +
      ' &nbsp;→&nbsp; ' + q.sym + ' = ' + (q.minus ? q.VR + ' − ' + q.VL : q.VL + ' − ' + q.VR) + ' = ' + q.ans;
  }
}
KIND.sides = { draw:drawSides, eq:eqSides, why:whySides };
