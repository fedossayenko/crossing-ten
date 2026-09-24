// Question kind 'samesub': level 81 88 − ■ = 88 − 11 — The box is read off an equality, then used.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2024, задача 5: 22 − ■ when 88 − ■ = 88 − 11. Both sides start from the same
// number, so they take away the same thing: ■ is 11 without working anything out.
function genSameSub(){
  const M = 40 + rnd(60), s = 5 + rnd(20), plus = Math.random() < 0.35;
  const X = s + 1 + rnd(40);
  // the given: M − ■ = M − s, or ■ + M = M + s (the order turned round)
  const given = Math.random() < 0.6 ? 0 : 1;
  return {kind:'samesub', M, s, X, plus, given, ans: plus ? X + s : X - s};
}
const sameSubGiven = q => q.given === 0 ? q.M + ' − ■ = ' + q.M + ' − ' + q.s : '■ + ' + q.M + ' = ' + q.M + ' + ' + q.s;
const sameSubAsk = q => q.X + (q.plus ? ' + ■' : ' − ■');
function drawSameSub(q){
  if(q.kind === 'samesub'){
    return '<div class="ask">' + tr('Пресметнете <span class="num">' + sameSubAsk(q) + '</span>, ако <span class="num">' + sameSubGiven(q) + '</span>.',
      'Обчисліть <span class="num">' + sameSubAsk(q) + '</span>, якщо <span class="num">' + sameSubGiven(q) + '</span>.') + '</div>' +
      '<div class="line" style="font-size:clamp(28px,8vw,46px)"><span class="num">' + sameSubAsk(q) + ' = </span>' + SLOT + '</div>';
  }
}
function eqSameSub(q){
  if(q.kind === 'samesub') return '■ = ' + q.s + ', ' + sameSubAsk(q).replace('■', q.s) + ' = ' + q.ans;
}
function whySameSub(q, full){
  if(q.kind === 'samesub'){
    if(!full) return tr('Сравни двете страни на равенството — кое е еднакво и кое е различно?',
                        'Порівняй дві сторони рівності — що однакове, а що різне?');
    return (q.given === 0 ? tr('и двете страни започват от ', 'обидві сторони починаються з ') + q.M + tr(', значи изваждат едно и също', ', отже віднімають одне й те саме')
                          : tr('и двете страни имат ', 'обидві сторони мають ') + q.M + tr(', значи другите събираеми са равни', ', отже інші доданки рівні')) +
      ' &nbsp;→&nbsp; ■ = <b>' + q.s + '</b> &nbsp;→&nbsp; ' + sameSubAsk(q).replace('■', q.s) + ' = ' + q.ans;
  }
}
KIND.samesub = { draw:drawSameSub, eq:eqSameSub, why:whySameSub };
