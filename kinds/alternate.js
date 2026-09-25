// Question kind 'alternate': level 107 Редуват се — Two figures take turns: at most, or at least, how many of one.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2021, задача 14: △ and □ take turns, 15 figures in all; at most how many □? Start
// with □ and end with □: 8 of them and 7 △. With an even count it is half either way.
function genAlternate(){
  const n = 7 + rnd(16), most = Math.random() < 0.65;
  return {kind:'alternate', n, most, ans: most ? Math.ceil(n/2) : Math.floor(n/2)};
}
function drawAlternate(q){
  if(q.kind === 'alternate'){
    return '<div class="ask">' + tr('Фигурите △ и □ се <b>редуват</b> в редица — общо <span class="num">' + q.n + '</span> фигури. Колко <b>най-' + (q.most ? 'много' : 'малко') + '</b> може да са квадратчетата □?',
      'Фігури △ і □ <b>чергуються</b> в ряду — усього <span class="num">' + q.n + '</span> фігур. Скільки <b>' + (q.most ? 'найбільше' : 'найменше') + '</b> може бути квадратиків □?') + '</div>' +
      '<div class="seq">△ □ △ □ △ …</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqAlternate(q){
  if(q.kind === 'alternate') return q.n + ' → ' + Math.ceil(q.n/2) + ' + ' + Math.floor(q.n/2) + ' → ' + q.ans;
}
function whyAlternate(q, full){
  if(q.kind === 'alternate'){
    if(!full) return tr('С коя фигура е най-добре редицата да започне — и с коя да свърши?', 'З якої фігури найкраще почати ряд — і якою закінчити?');
    if(q.n % 2 === 0) return tr('четен брой: наполовина — ', 'парна кількість: навпіл — ') + q.n + ' : 2 = ' + q.ans;
    return (q.most ? tr('започва и свършва с □: ', 'починається й закінчується □: ') : tr('започва и свършва с △: ', 'починається й закінчується △: ')) + '□ △ … ' + (q.most ? '□' : '△') +
      ' &nbsp;→&nbsp; ' + Math.ceil(q.n/2) + ' + ' + Math.floor(q.n/2) + ' = ' + q.n + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.alternate = { draw:drawAlternate, eq:eqAlternate, why:whyAlternate };
