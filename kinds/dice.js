// Question kind 'dice': level 127 Два зара — Two different dice and the ways to throw a total.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Есен 2019, задача 16: two different dice showed 3 and 2, total 5. In how many more ways can 5
// come up? 1 + 4, 4 + 1, 2 + 3 — the dice are different, so 3 on the first and 2 on the second is
// not the same throw as 2 on the first and 3 on the second: 3 more.
function genDice(){
  const S = 3 + rnd(9), ways = [];
  for(let a = 1; a <= 6; a++) if(S - a >= 1 && S - a <= 6) ways.push([a, S - a]);
  const [x, y] = ways[rnd(ways.length)], more = Math.random() < 0.7;
  return {kind:'dice', S, x, y, more, n: ways.length, traps:[Math.ceil(ways.length / 2) - (more ? 1 : 0)], ans: more ? ways.length - 1 : ways.length};
}
function dieSvg(v, x0){
  const P = {1:[[1,1]], 2:[[0,0],[2,2]], 3:[[0,0],[1,1],[2,2]], 4:[[0,0],[2,0],[0,2],[2,2]], 5:[[0,0],[2,0],[1,1],[0,2],[2,2]], 6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]}[v];
  return '<rect x="' + x0 + '" y="2" width="40" height="40" rx="7" fill="var(--solid)" stroke="var(--ink)" stroke-width="1.6"/>' +
    P.map(([i, j]) => '<circle cx="' + (x0 + 9 + 11*i) + '" cy="' + (11 + 11*j) + '" r="3.6" fill="var(--ink)"/>').join('');
}
function drawDice(q){
  if(q.kind === 'dice'){
    return '<div class="ask">' + tr('Петър хвърлил два различни зара. На единия се е паднало числото <span class="num">' + q.x + '</span>, а на другия — <span class="num">' + q.y + '</span>. Общият сбор точки е <span class="num">' + q.S + '</span>. ' +
      (q.more ? '<b>Още</b> по колко начина може да се получи сбор ' : 'По колко начина <b>общо</b> може да се получи сбор ') + q.S + '?',
      'Петро кинув два різні кубики. На одному випало <span class="num">' + q.x + '</span>, а на другому — <span class="num">' + q.y + '</span>. Разом <span class="num">' + q.S + '</span>. ' +
      (q.more ? 'Скількома <b>ще</b> способами можна отримати суму ' : 'Скількома способами <b>всього</b> можна отримати суму ') + q.S + '?') + '</div>' +
      '<div class="fig"><svg viewBox="0 0 96 44" style="max-width:110px" role="img" aria-label="' + tr('два зара', 'два кубики') + '">' + dieSvg(q.x, 2) + dieSvg(q.y, 54) + '</svg></div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
const diceWays = q => { const w = []; for(let a = 1; a <= 6; a++) if(q.S - a >= 1 && q.S - a <= 6) w.push(a + ' + ' + (q.S - a)); return w; };
function eqDice(q){
  if(q.kind === 'dice') return diceWays(q).join(', ') + (q.more ? ' − 1' : '') + ' → ' + q.ans;
}
function whyDice(q, full){
  if(q.kind === 'dice'){
    if(!full) return tr('Заровете са различни — има значение кое число е на първия и кое на втория. Изреди всички двойки подред.', 'Кубики різні — важливо, яке число на першому, а яке на другому. Випиши всі пари по черзі.');
    return tr('първият + вторият: ', 'перший + другий: ') + diceWays(q).join(', ') + ' &nbsp;→&nbsp; ' + q.n + (q.more ? ' − 1 = ' + q.ans + tr(' без хвърления вече', ' без того, що вже випало') : '');
  }
}
KIND.dice = { draw:drawDice, eq:eqDice, why:whyDice };
