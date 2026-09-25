// Question kind 'twoshare': level 78 Портокалите — Sharing out two ways: short with one, exact with the other.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Есен, 3 клас, задача 20: under 30 oranges; 7 to each child leaves me 4 short, 6 to each
// shares them all. One more for each child costs exactly the 4 missing, so there are 4 children
// and 6 · 4 = 24 oranges. Sometimes the first way leaves some over instead of short.
function genTwoShare(){
  for(;;){
    const b = 3 + rnd(6), g = Math.random() < 0.75 ? 1 : 2, a = b + g, k = 2 + rnd(7), over = Math.random() < 0.3;
    const N = over ? a*k : b*k, s = g*k;                      // over: b each leaves s over, a each is exact
    const L = Math.ceil((N + 1) / 10) * 10 + (N % 10 > 6 ? 10 : 0);
    if(N > 60 || s < 2 || s > 12) continue;
    return {kind:'twoshare', a, b, k, s, N, L, over, ans: N, traps: [a*k, b*k, a*k - s, b*k + s].filter(v => v !== N && v > 0)};
  }
}
// Ukrainian: 2–4 апельсини, 5 and more апельсинів
const apl = n => n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'апельсини' : 'апельсинів';
function drawTwoShare(q){
  if(q.kind === 'twoshare'){
    const [first, second] = q.over ? [q.b, q.a] : [q.a, q.b];
    return '<div class="ask">' + tr('Разполагам с по-малко от <span class="num">' + q.L + '</span> портокала. Ако реша да подаря на всяко от няколко деца по <span class="num">' + first +
      '</span> портокала, ' + (q.over ? 'ще ми останат <span class="num">' + q.s + '</span> портокала' : 'няма да ми достигат <span class="num">' + q.s + '</span> портокала') +
      '. Затова подарих на всяко дете по <span class="num">' + second + '</span> портокала и раздадох всички портокали, които имам. Колко портокала съм имал?',
      'У мене менше ніж <span class="num">' + q.L + '</span> ' + apl(q.L) + '. Якщо я вирішу подарувати кожній із кількох дітей по <span class="num">' + first +
      '</span> ' + apl(first) + ', ' + (q.over ? 'у мене залишиться <span class="num">' + q.s + '</span> ' + apl(q.s) : 'мені забракне <span class="num">' + q.s + '</span> ' + apl(q.s)) +
      '. Тому я подарував кожній дитині по <span class="num">' + second + '</span> ' + apl(second) + ' й роздав усі апельсини, які мав. Скільки апельсинів у мене було?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqTwoShare(q){
  if(q.kind === 'twoshare') return q.s + ' : ' + (q.a - q.b) + ' = ' + tr(q.k + ' деца', ukN(q.k, 'дитина', 'дитини', 'дітей')) + ' → ' + (q.over ? q.a : q.b) + ' · ' + q.k + ' = ' + q.N;
}
function whyTwoShare(q, full){
  if(q.kind === 'twoshare'){
    if(!full) return tr('Разликата между двата начина е по ' + (q.a - q.b) + ' на дете — и тя струва точно ' + q.s + ' портокала.',
                        'Різниця між двома способами — по ' + (q.a - q.b) + ' на дитину, і вона коштує рівно ' + q.s + ' ' + apl(q.s) + '.');
    return tr('по ' + (q.a - q.b) + ' повече на всяко дете = ' + q.s + ' портокала', 'по ' + (q.a - q.b) + ' більше на кожну дитину = ' + q.s + ' ' + apl(q.s)) + ' &nbsp;→&nbsp; ' +
      q.s + ' : ' + (q.a - q.b) + ' = ' + tr(q.k + ' деца', ukN(q.k, 'дитина', 'дитини', 'дітей')) + ' &nbsp;→&nbsp; ' + (q.over ? q.a : q.b) + ' · ' + q.k + ' = ' + q.N;
  }
}
KIND.twoshare = { draw:drawTwoShare, eq:eqTwoShare, why:whyTwoShare };
