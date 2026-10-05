// Question kind 'cross': level 44 Зачеркни — Cross out one digit to make it true.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 19: one digit struck out makes the equation true. Built backwards, then every
// possible deletion is tried so the digit to cross is never in doubt.
function genCross(){
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
function genCrossTwo(){
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
function drawCross(q){
  if(q.kind === 'cross' && q.shape === 'two'){
    const ex = e => { const s = [e[0], e[2], e[3]], l = s.slice(); l[e[4]] = e[5]; return '<div class="given" style="font-size:clamp(15px,4vw,21px)">' + crossTwoText(s, e[1]) + ' &nbsp;⟹&nbsp; ' + crossTwoText(l, e[1]) + ' &nbsp;⟹&nbsp; ☹ = ' + e[6] + '</div>'; };
    return '<div class="ask">' + tr('Във всеки ред е зачеркната една цифра, за да стане равенството вярно. ☹ е зачеркнатата цифра.', 'У кожному рядку закреслено одну цифру, щоб рівність стала правильною. ☹ — це закреслена цифра.') + '</div>' +
      CROSS_TWO_EX.map(ex).join('') + '<div class="line" style="font-size:clamp(26px,7vw,42px)">' + crossTwoText(q.shown, q.op) + ' &nbsp;⟹&nbsp; ☹ = ' + SLOT + '</div>';
  }
  if(q.kind === 'cross'){
    return '<div class="ask">' + tr('Коя цифра трябва да се зачеркне, за да се получи вярно равенство?', 'Яку цифру треба закреслити, щоб вийшла правильна рівність?') + '</div>' +
      '<div class="given">' + q.A + ' + ' + q.B + ' + ' + q.C + ' = ' + q.D + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCross(q){
  if(q.kind === 'cross' && q.shape === 'two'){ const l = q.shown.slice(); l[q.hit.t] = q.hit.left; return crossTwoText(q.shown, q.op) + ' → ' + crossTwoText(l, q.op) + ' → ' + q.ans; }
  if(q.kind === 'cross') return q.A + ' + ' + q.B + ' + ' + q.C + ' = ' + q.D + tr(' → зачерква се ', ' → закреслюємо ') + q.ans;
}
function whyCross(q, full){
  if(q.kind === 'cross' && q.shape === 'two'){
    if(!full) return tr('Пресметни лявата страна — вярно ли е? Опитай да махнеш по една цифра.', 'Обчисли ліву частину — чи правильно? Спробуй прибрати по одній цифрі.');
    const l = q.shown.slice(), v = q.op === '+' ? q.shown[0] + q.shown[1] : q.shown[0] - q.shown[1];
    l[q.hit.t] = q.hit.left;
    return q.shown[0] + ' ' + q.op + ' ' + q.shown[1] + ' = ' + v + tr(', а не ', ', а не ') + q.shown[2] + ' &nbsp;→&nbsp; ' + tr('без цифрата ', 'без цифри ') + q.ans + ': <b>' + crossTwoText(l, q.op) + '</b> &nbsp;→&nbsp; ☹ = ' + q.ans;
  }
  if(q.kind === 'cross'){
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
}
KIND.cross = { draw:drawCross, eq:eqCross, why:whyCross };
