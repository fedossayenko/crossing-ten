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
export function genChainShort(){
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
