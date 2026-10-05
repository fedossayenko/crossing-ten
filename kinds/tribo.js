// Question kind 'tribo': level 169 1, 1, 0, 2, 3, 5 — Each number is the sum of the three before it.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2023, 1 клас, задача 16: 1, 1, 0, 2, 3, 5, 10, ★, 33 — the rule is not given, it is
// found: 1 + 1 + 0 = 2, 1 + 0 + 2 = 3, 0 + 2 + 3 = 5 … so ★ = 3 + 5 + 10 = 18 (and 5 + 10 + 18 = 33).
function genTribo(){
  for(;;){
    const t = [rnd(4), rnd(4), rnd(4)], L = 8 + rnd(2);
    if(t[0] + t[1] + t[2] === 0) continue;
    while(t.length < L) t.push(t[t.length - 1] + t[t.length - 2] + t[t.length - 3]);
    if(t[L - 1] > 40 || t[3] === t[4]) continue;     // keep it small, and not a row that just stands still
    const h = 5 + rnd(L - 6);                        // at least two worked examples before it, one number after
    return {kind:'tribo', t, h, ans: t[h]};
  }
}
const triboRow = q => q.t.map((v, i) => i === q.h ? '★' : v).join(', ') + ', …';
function drawTribo(q){
  if(q.kind === 'tribo'){
    return '<div class="ask">' + tr('Числата следват едно правило. Кое число е скрито под <b>★</b>?', 'Числа йдуть за одним правилом. Яке число сховане під <b>★</b>?') + '</div>' +
      '<div class="seq">' + triboRow(q) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)"><span class="num">★ = </span>' + SLOT + '</div>';
  }
}
function eqTribo(q){
  if(q.kind === 'tribo') return triboRow(q) + ' → ★ = ' + q.t[q.h - 3] + ' + ' + q.t[q.h - 2] + ' + ' + q.t[q.h - 1] + ' = ' + q.ans;
}
function whyTribo(q, full){
  if(q.kind === 'tribo'){
    if(!full) return tr('Събери няколко съседни числа подред — кое следващо число се получава?', 'Додай кілька сусідніх чисел підряд — яке наступне число виходить?');
    const t = q.t, ex = [3, 4].map(i => t[i - 3] + ' + ' + t[i - 2] + ' + ' + t[i - 1] + ' = ' + t[i]);
    return tr('всяко число е сборът на трите преди него: ', 'кожне число — це сума трьох чисел перед ним: ') + ex.join(', ') + ', … &nbsp;→&nbsp; ★ = ' +
      t[q.h - 3] + ' + ' + t[q.h - 2] + ' + ' + t[q.h - 1] + ' = ' + q.ans;
  }
}
KIND.tribo = { draw:drawTribo, eq:eqTribo, why:whyTribo };
