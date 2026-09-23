// Question kind 'dcount': level 55 Преброй цифрата — How often one digit turns up across a run of numbers.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 9: writing out a run of numbers and counting how often one digit turns up. The
// run is walked rather than reasoned about, so the count is never a guess.
function genDigitRun(){
  for(;;){
    const d = 1 + rnd(9), from = 1 + rnd(3);
    if(Math.random() < 0.45){
      const to = 25 + rnd(60);
      let n = 0;
      for(let v = from; v <= to; v++) n += String(v).split(String(d)).length - 1;
      if(n < 3) continue;
      return {kind:'dcount', shape:0, d, from, to, ans: n};
    }
    // …and the other way round: the run stops where the count is still exactly this many
    const k = 5 + rnd(12);
    let n = 0, last = 0;
    for(let v = from; v <= 220; v++){
      n += String(v).split(String(d)).length - 1;
      if(n === k) last = v;
      if(n > k) break;
    }
    if(!last) continue;
    return {kind:'dcount', shape:1, d, from, k, ans: last};
  }
}

function drawDcount(q){
  if(q.kind === 'dcount'){
    const ask = q.shape === 0
      ? 'Записах последователните числа от <span class="num">' + q.from + '</span> до <span class="num">' + q.to +
        '</span>. <b>Колко пъти</b> използвах цифрата <span class="num">' + q.d + '</span>?'
      : 'Записах последователните числа от <span class="num">' + q.from +
        '</span> до <span class="circle">□</span>. За записването им използвах <span class="num">' + q.k +
        '</span> цифри <span class="num">' + q.d +
        '</span>. Кое е <b>най-голямото</b> число, което може да се постави вместо <span class="circle">□</span>?';
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqDcount(q){
  if(q.kind === 'dcount') return q.shape === 0 ? 'цифрата ' + q.d + ' от ' + q.from + ' до ' + q.to + ' → ' + q.ans
    : q.k + ' пъти цифрата ' + q.d + ', от ' + q.from + ' → ' + q.ans;
}
function whyDcount(q, full){
  if(q.kind === 'dcount'){
    if(!full) return 'Числата с две еднакви цифри се броят два пъти.';
    const top = q.shape === 0 ? q.to : q.ans, hits = [];
    for(let v = q.from; v <= top && hits.length < 12; v++)
      if(String(v).indexOf(String(q.d)) >= 0) hits.push(v);
    const list = hits.join(', ') + (hits.length >= 12 ? ', …' : '');
    if(q.shape === 0) return 'цифрата я има в ' + list + ' &nbsp;→&nbsp; ' + q.ans;
    return 'до <b>' + q.ans + '</b> цифрата се е появила ' + q.k + ' пъти (' + list +
      ') &nbsp;→&nbsp; следващото число с нея идва по-нататък, значи ' + q.ans;
  }
}
KIND.dcount = { draw:drawDcount, eq:eqDcount, why:whyDcount };
