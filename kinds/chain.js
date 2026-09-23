// Question kind 'chain': level 8 2 + 6 − 5 — A long chain of + and −, worked left to right.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 1: a plain ± chain worked left to right. The zeros are deliberate —
// noticing that + 0 changes nothing is part of the task.
function genChain(){
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

function drawChain(q){
  if(q.kind === 'chain' || q.kind === 'pairs'){
    const e = exprText(q.terms) + ' = ';
    return '<div class="line" style="font-size:clamp(19px,calc((100vw - 56px)/' +
           (e.length*0.56).toFixed(2) + '),40px)">' + e + SLOT + '</div>';
  }
}
function eqChain(q){
  return exprText(q.terms) + ' = ' + q.ans;
}
function whyChain(q, full){
  if(q.kind === 'chain'){
    if(!full) return 'Стъпка по стъпка, отляво надясно.';
    let run = q.terms[0].n;
    const steps = [run];
    q.terms.slice(1).forEach(t => { run += t.op === '+' ? t.n : -t.n; steps.push(run); });
    return 'Стъпка по стъпка: <b>' + steps.join(', ') + '</b>';
  }
}
KIND.chain = { draw:drawChain, eq:eqChain, why:whyChain };
