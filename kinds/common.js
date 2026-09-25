// Question kind 'common': level 103 Общите числа — Two runs of numbers, and how many they share.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2022, задача 18: Иво 2, 5, 8, …, 29, 32 and Ели 11, 14, 17, …, 38, 41, eleven numbers
// each. Both go up by 3, and 11 is on Иво's list too, so the shared ones run 11, 14, …, 32: 8.
function genCommon(){
  for(;;){
    const k = 2 + rnd(3), n = 8 + rnd(5), a = 1 + rnd(9), shift = 1 + rnd(n - 2);
    const b = a + k*shift + (Math.random() < 0.15 ? 1 : 0);     // now and then the runs never meet
    const A = Array.from({length: n}, (_, i) => a + i*k), B = Array.from({length: n}, (_, i) => b + i*k);
    const both = A.filter(v => B.includes(v));
    if(B[n - 1] > 99) continue;
    return {kind:'common', k, n, A, B, both, ans: both.length};
  }
}
const commonRun = r => r.slice(0, 3).join(', ') + ', …, ' + r.slice(-2).join(', ');
function drawCommon(q){
  if(q.kind === 'common'){
    return '<div class="ask">' + tr('Иво и Ели записали по <span class="num">' + q.n + '</span> числа.', 'Іво та Елі записали по <span class="num">' + ukN(q.n, 'числу', 'числа', 'чисел').replace(' ', '</span> ') + '.') + '</div>' +
      '<div class="seq">' + tr('Иво: ', 'Іво: ') + commonRun(q.A) + '</div><div class="seq">' + tr('Ели: ', 'Елі: ') + commonRun(q.B) + '</div>' +
      '<div class="ask">' + tr('Колко от числата на Иво са записани и от Ели?', 'Скільки з чисел Іво записала також і Елі?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqCommon(q){
  if(q.kind === 'common') return (q.both.length ? q.both[0] + ' … ' + q.both[q.both.length - 1] : tr('нито едно', 'жодного')) + ' → ' + q.ans;
}
function whyCommon(q, full){
  if(q.kind === 'common'){
    if(!full) return tr('И двете редици растат с едно и също число. Намира ли се първото число на Ели сред числата на Иво?', 'Обидва ряди ростуть на те саме число. Чи є перше число Елі серед чисел Іво?');
    if(!q.both.length) return q.B[0] + tr(' не е в редицата на Иво, а стъпката е една и съща — никое не съвпада', ' немає в ряду Іво, а крок той самий — жодне не збігається') + ' &nbsp;→&nbsp; 0';
    return tr('Иво стига до ', 'Іво доходить до ') + q.A[q.n - 1] + tr(', Ели започва от ', ', Елі починає з ') + q.B[0] + ' &nbsp;→&nbsp; ' + tr('общи: ', 'спільні: ') + q.both.join(', ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.common = { draw:drawCommon, eq:eqCommon, why:whyCommon };
