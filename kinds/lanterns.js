// Question kind 'lanterns': level 122 Фенерите — A trick: putting out a lantern does not take it away.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен 2021, задача 18: all 33 lanterns in the castle were lit, and 11 were put out. How many
// lanterns are left? All 33 — a lantern that is out is still there. Asked the other way too: how
// many are still burning (33 − 11), so the question has to be read, not just the numbers.
function genLanterns(){
  const N = 10 + rnd(40), K = 2 + rnd(N - 4), burning = Math.random() < 0.3;
  return {kind:'lanterns', N, K, burning, ans: burning ? N - K : N};
}
function drawLanterns(q){
  if(q.kind === 'lanterns'){
    return '<div class="ask">' + tr('В замъка бяха запалени всичките <span class="num">' + q.N + '</span> фенера. От тях загасиха <span class="num">' + q.K + '</span>. ' +
      (q.burning ? 'Колко фенера <b>светят</b> още?' : 'Колко <b>фенера</b> са останали?'),
      'У замку засвітили всі <span class="num">' + ukN(q.N, 'ліхтар', 'ліхтарі', 'ліхтарів').replace(' ', '</span> ') + '. З них погасили <span class="num">' + q.K + '</span>. ' +
      (q.burning ? 'Скільки ліхтарів ще <b>світять</b>?' : 'Скільки <b>ліхтарів</b> залишилося?')) + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqLanterns(q){
  if(q.kind === 'lanterns') return q.burning ? q.N + ' − ' + q.K + ' = ' + q.ans : tr('загасеният фенер пак е фенер → ', 'погаслий ліхтар — теж ліхтар → ') + q.ans;
}
function whyLanterns(q, full){
  if(q.kind === 'lanterns'){
    if(!full) return tr('Прочети въпроса още веднъж: пита ли колко светят?', 'Прочитай питання ще раз: чи питають, скільки світять?');
    return q.burning ? tr('светят тези, които не са загасени: ', 'світять ті, що не погашені: ') + q.N + ' − ' + q.K + ' = ' + q.ans
      : tr('загасеният фенер не изчезва — остават всичките ', 'погаслий ліхтар нікуди не зникає — залишаються всі ') + q.ans;
  }
}
KIND.lanterns = { draw:drawLanterns, eq:eqLanterns, why:whyLanterns };
