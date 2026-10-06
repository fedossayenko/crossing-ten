// Question kind 'chain': level 8 2 + 6 − 5 — A long chain of + and −, worked left to right.

// Задача 1: a plain ± chain worked left to right. The zeros are deliberate —
// noticing that + 0 changes nothing is part of the task.
import { KIND, chainLine, exprText, rnd, tr } from '../js/core.js';
export function genChain(){
  for(;;){
    const len = 6 + rnd(3);
    const terms = [{op:'', n: 2 + rnd(8)}];
    let run = terms[0].n, ok = true;
    for(let k = 1; k < len; k++){
      const n = Math.random() < 0.18 ? 0 : 1 + rnd(9);
      const up = run < 6 ? true : run > 15 ? false : Math.random() < 0.5;
      if(!up && n > run){ ok = false; break; }
      terms.push({op: up ? '+' : '−', n});
      run += up ? n : -n;
    }
    if(ok && run >= 0 && run <= 20) return {kind:'chain', terms, paired:0, ans:run};
  }
}
// МБГ Пролет 2025 and 2023, 1 клас, задачи 1–2: the same walk, short — 2 − 0 − 2 + 5, 20 − 2 − 5 —
// starting anywhere up to 20 and never leaving 0…20 on the way.
// МБГ Полуфинал 2024, 1 клас, задача 1: 20 − 2 + 4 — a step down from near 20, then up past it (shape 'past',
// the answer 21 to 24). Полуфинал 2025, задача 2: 10 − 0 − 2 − 7, the plain walk.
export function genChainShort(){
  if(Math.random() < 0.2) return genChainPast();
  for(;;){
    const len = 3 + rnd(2), terms = [{op:'', n: 2 + rnd(19)}];
    let run = terms[0].n, ok = true;
    for(let k = 1; k < len; k++){
      const n = Math.random() < 0.25 ? 0 : 1 + rnd(9), up = run + n > 20 ? false : n > run ? true : Math.random() < 0.5;
      if(!up && n > run){ ok = false; break; }
      terms.push({op: up ? '+' : '−', n});
      run += up ? n : -n;
    }
    if(ok) return {kind:'chain', terms, paired:0, ans:run};
  }
}
// МБГ Полуфинал 2022, 1 клас, задача 1: 2 − 0 + 2 − 2 + 2 — five numbers: a start of 1 to 4, then four steps of 0 to 3
// either way, the walk never under 0 nor over 8 (shape 'five'). Level 155 draws its short walk first and the five now
// and then after it, so a walk keeps its seed; 224 (the walk past 20) draws from genChainShort as it did.
export function genChainWalk(){
  let q; do q = genChainShort(); while(q.shape === 'past');
  return Math.random() < 0.2 ? genChainFive() : q;
}
function genChainFive(){
  for(;;){
    const terms = [{op:'', n: 1 + rnd(4)}];
    let run = terms[0].n;
    for(let k = 1; k < 5 && run >= 0 && run <= 8; k++){
      const n = terms.some(t => t.op && !t.n) ? 1 + rnd(3) : rnd(4), up = Math.random() < 0.5;   // one ± 0 at most
      terms.push({op: up ? '+' : '−', n});
      run += up ? n : -n;
    }
    if(terms.length === 5 && run >= 0 && run <= 8) return {kind:'chain', shape:'five', terms, paired:0, ans:run};
  }
}
function genChainPast(){
  for(;;){
    const s = 16 + rnd(5), a = rnd(6), end = 21 + rnd(4), b = end - s + a;
    if(b < 1 || b > 9) continue;
    return {kind:'chain', shape:'past', terms:[{op:'', n:s}, {op:'−', n:a}, {op:'+', n:b}], paired:0, ans:end};
  }
}
// МБГ Полуфинал 2024, 1 клас, задача 2: 20 − 2 + 4 − 2 + 0 − 2 − 4 — six steps from 12…20, one at a time. As on
// the papers, the steps are two small numbers again and again (here 2 and 4), with a 0 about half the time;
// the walk never leaves 0…24.
export function genChainLong(){
  const p = 1 + rnd(4), q = p + 1 + rnd(5 - p), zero = Math.random() < 0.5 ? 1 + rnd(6) : 0;
  const terms = [{op:'', n: 12 + rnd(9)}];
  let run = terms[0].n;
  for(let k = 1; k <= 6; k++){
    const n = k === zero ? 0 : Math.random() < 0.5 ? p : q, up = run + n > 24 ? false : n > run ? true : Math.random() < 0.5;
    terms.push({op: up ? '+' : '−', n});
    run += up ? n : -n;
  }
  // now and then six numbers instead, drawn after the seven, so a seven keeps its seed
  return Math.random() < 0.3 ? genChainSix() : {kind:'chain', terms, paired:0, ans:run};
}
// МБГ Полуфинал 2023, 1 клас, задача 2: 15 − 1 + 6 − 2 + 7 − 5 — six numbers: a start of 12…20 and five steps of 1 to 7,
// the sign mostly turning at each (down, up, down, …), the walk never leaving 0…25 (shape 'six').
function genChainSix(){
  for(;;){
    const terms = [{op:'', n: 12 + rnd(9)}];
    let run = terms[0].n, up = Math.random() < 0.5;
    for(let k = 1; k <= 5 && run >= 0 && run <= 25; k++){
      if(k > 1 && Math.random() < 0.85) up = !up;
      const n = 1 + rnd(7);
      terms.push({op: up ? '+' : '−', n});
      run += up ? n : -n;
    }
    if(terms.length === 6 && run >= 0 && run <= 25) return {kind:'chain', shape:'six', terms, paired:0, ans:run};
  }
}

function drawChain(q){ return chainLine(q.terms); }
function eqChain(q){
  return exprText(q.terms) + ' = ' + q.ans;
}
function whyChain(q, full){
  if(!full) return tr('Стъпка по стъпка, отляво надясно.', 'Крок за кроком, зліва направо.');
  let run = q.terms[0].n;
  const steps = [run];
  q.terms.slice(1).forEach(t => { run += t.op === '+' ? t.n : -t.n; steps.push(run); });
  return tr('Стъпка по стъпка: ', 'Крок за кроком: ') + '<b>' + steps.join(', ') + '</b>';
}
KIND.chain = { draw:drawChain, eq:eqChain, why:whyChain };
