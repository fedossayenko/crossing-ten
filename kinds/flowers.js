// Question kind 'flowers': level 33 Цветя — Petals of three kinds adding to a total.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 13: flowers of three kinds. Generated so that every way of reaching the
// total with at least one of each kind gives the SAME number of flowers.
function genFlowers(){
  for(;;){
    const p0 = 3 + rnd(4);
    const p = [p0, p0 + 1, p0 + 2];
    const T = (1 + rnd(3))*p[0] + (1 + rnd(3))*p[1] + (1 + rnd(3))*p[2];
    if(T > 60) continue;
    const totals = new Set();
    for(let x = 1; x*p[0] < T; x++)
      for(let y = 1; x*p[0] + y*p[1] < T; y++){
        const rest = T - x*p[0] - y*p[1];
        if(rest > 0 && rest % p[2] === 0) totals.add(x + y + rest/p[2]);
      }
    if(totals.size !== 1) continue;
    return {kind:'flowers', p, T, ans: [...totals][0]};
  }
}

const flowersPl = (n, f) => f[['one','few','many'].indexOf(new Intl.PluralRules('uk').select(n))];
function drawFlowers(q){
  if(q.kind === 'flowers'){
    return '<div class="ask">' + tr('Имаме цветя с по <span class="num">' + bgList(q.p) +
      '</span> листенца — и от трите вида. Листенцата на всички цветя са общо <span class="num">' +
      q.T + '</span>. Колко са цветята?',
      'Маємо квіти з <span class="num">' + bgList(q.p) +
      '</span> пелюстками — усіх трьох видів. На всіх квітах разом <span class="num">' +
      q.T + '</span> ' + flowersPl(q.T, ['пелюстка', 'пелюстки', 'пелюсток']) + '. Скільки всього квіток?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqFlowers(q){
  if(q.kind === 'flowers') return tr('по ' + q.p.join(', ') + ' листенца, общо ', 'пелюсток ' + q.p.join(', ') + ', разом ') +
    q.T + ' → ' + q.ans;
}
function whyFlowers(q, full){
  if(q.kind === 'flowers'){
    if(!full) return tr('От всеки вид има поне по едно цвете — пробвай колко от най-малките.',
      'Кожного виду є щонайменше по одній квітці — спробуй, скільки може бути найменших.');
    const ways = [];
    for(let x = 1; x*q.p[0] < q.T; x++)
      for(let y = 1; x*q.p[0] + y*q.p[1] < q.T; y++){
        const rest = q.T - x*q.p[0] - y*q.p[1];
        if(rest > 0 && rest % q.p[2] === 0)
          ways.push(x + '×' + q.p[0] + ' + ' + y + '×' + q.p[1] + ' + ' + (rest/q.p[2]) + '×' + q.p[2]);
      }
    return '<b>' + ways.join(tr('</b>, или <b>', '</b>, або <b>')) + '</b> = ' + q.T + ' &nbsp;→&nbsp; ' + q.ans + ' ' +
      tr('цветя', flowersPl(q.ans, ['квітка', 'квітки', 'квіток']));
  }
}
KIND.flowers = { draw:drawFlowers, eq:eqFlowers, why:whyFlowers };
