// Question kind 'timesw': level 133 Пъти повече — Word problems with «so many times more» or «fewer», and equal shares.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2025: задача 7, 16 girls and 2 times fewer boys — 8 boys, 24 children; задача 9, 7 equal
// cubes weigh 63 g, so one is 9 and two are 18; задача 16, Никола 16 pencils, Пиер 2 times fewer (8),
// Клод 2 more than Пиер (10), so Никола has 6 more than Клод; задача 18, 6 kg and 3 times more (18),
// 24 kg into 8 crates, 3 kg each.
function genTimesW(){
  const shape = rnd(4);
  for(;;){
    const k = 2 + rnd(3);
    if(shape === 0){
      const fewer = Math.random() < 0.6, b0 = 3 + rnd(8), a = fewer ? k*b0 : b0, b = fewer ? b0 : k*b0;
      if(a > 40 || b > 40) continue;
      return {kind:'timesw', shape, k, a, b, fewer, traps:[a + k], ans: a + b};
    }
    if(shape === 1){
      const n = 3 + rnd(7), u = 2 + rnd(9), m = 2 + rnd(n - 2);
      return {kind:'timesw', shape, n, u, W: n*u, m, traps:[u], ans: m*u};
    }
    if(shape === 2){
      const p = 3 + rnd(8), x = k*p, d = 1 + rnd(4);
      if(x > 40 || p + d >= x) continue;
      return {kind:'timesw', shape, k, x, p, d, c: p + d, traps:[x - p], ans: x - p - d};
    }
    const x = 2 + rnd(9), T = x + k*x, m = [2, 3, 4, 5, 6, 8].filter(v => T % v === 0 && T / v > 1);
    if(!m.length) continue;
    const crates = m[rnd(m.length)];
    return {kind:'timesw', shape, k, x, T, m: crates, traps:[(x + k) / crates], ans: T / crates};
  }
}
const timesWord = k => tr(['', '', 'два', 'три', 'четири'][k], ['', '', 'у два', 'у три', 'у чотири'][k]);
function drawTimesW(q){
  if(q.kind === 'timesw'){
    const n = v => '<span class="num">' + v + '</span>';
    const text = q.shape === 0
      ? tr('На спортната площадка играят ' + n(q.a) + ' момичета и ' + n(q.k) + ' пъти ' + (q.fewer ? 'по-малко' : 'повече') + ' момчета. Колко общо са децата, които играят на спортната площадка?',
           'На спортивному майданчику грають ' + n(q.a) + ' ' + ukN(q.a, 'дівчинка', 'дівчинки', 'дівчаток').split(' ')[1] + ' і в ' + n(q.k) + ' рази ' + (q.fewer ? 'менше' : 'більше') + ' хлопчиків. Скільки всього дітей грає на майданчику?')
      : q.shape === 1
      ? tr(n(q.n) + ' еднакви кубчета тежат ' + n(q.W) + ' грама. Колко грама тежат ' + n(q.m) + ' от тези кубчета?',
           n(q.n) + ' однакових кубиків важать ' + n(q.W) + ' ' + ukN(q.W, 'грам', 'грами', 'грамів').split(' ')[1] + '. Скільки грамів важать ' + n(q.m) + ' ' + ukN(q.m, 'такий кубик', 'такі кубики', 'таких кубиків').replace(/^\d+ /, '') + '?')
      : q.shape === 2
      ? tr('Никола има ' + n(q.x) + ' молива. Пиер има ' + timesWord(q.k) + ' пъти по-малко моливи, отколкото има Никола, а Клод има ' + bgWith(q.d) + ' ' + n(q.d) + ' ' + (q.d === 1 ? 'молив' : 'молива') + ' повече, отколкото Пиер. С колко броят на моливите на Никола е повече от броя на моливите на Клод?',
           'У Миколи ' + n(q.x) + ' ' + ukN(q.x, 'олівець', 'олівці', 'олівців').split(' ')[1] + '. У П’єра ' + timesWord(q.k) + ' рази менше олівців, ніж у Миколи, а в Клода на ' + n(q.d) + ' ' + ukN(q.d, 'олівець', 'олівці', 'олівців').split(' ')[1] + ' більше, ніж у П’єра. На скільки в Миколи більше олівців, ніж у Клода?')
      : tr('От едно ябълково дърво набрали ' + n(q.x) + ' кг ябълки, а от друго — ' + n(q.k) + ' пъти повече. Набраните ябълки разпределили поравно в ' + n(q.m) + ' щайги. Колко килограма има във всяка от тези щайги?',
           'З однієї яблуні зібрали ' + n(q.x) + ' кг яблук, а з іншої — у ' + n(q.k) + ' рази більше. Зібрані яблука порівну розклали в ' + n(q.m) + ' ' + ukN(q.m, 'ящик', 'ящики', 'ящиків').split(' ')[1] + '. Скільки кілограмів у кожному ящику?');
    return '<div class="ask">' + text + '</div><div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqTimesW(q){
  if(q.kind === 'timesw'){
    if(q.shape === 0) return q.a + (q.fewer ? ' : ' : ' · ') + q.k + ' = ' + q.b + ', ' + q.a + ' + ' + q.b + ' = ' + q.ans;
    if(q.shape === 1) return q.W + ' : ' + q.n + ' = ' + q.u + ', ' + q.u + ' · ' + q.m + ' = ' + q.ans;
    if(q.shape === 2) return q.x + ' : ' + q.k + ' = ' + q.p + ', ' + q.p + ' + ' + q.d + ' = ' + q.c + ', ' + q.x + ' − ' + q.c + ' = ' + q.ans;
    return q.x + ' · ' + q.k + ' = ' + q.k*q.x + ', ' + q.x + ' + ' + q.k*q.x + ' = ' + q.T + ', ' + q.T + ' : ' + q.m + ' = ' + q.ans;
  }
}
function whyTimesW(q, full){
  if(q.kind === 'timesw'){
    if(!full) return [tr('«Пъти по-малко» значи делим, «пъти повече» — умножаваме. После всички заедно.', '«У стільки разів менше» — ділимо, «у стільки разів більше» — множимо. Потім усі разом.'),
      tr('Колко тежи едно кубче?', 'Скільки важить один кубик?'),
      tr('Първо колко има Пиер, после колко има Клод.', 'Спершу скільки в П’єра, потім скільки в Клода.'),
      tr('Първо колко са набрали от второто дърво, после всичко заедно, после поравно.', 'Спершу скільки зібрали з другої яблуні, потім усе разом, потім порівну.')][q.shape];
    if(q.shape === 0) return tr('момчетата: ', 'хлопчиків: ') + q.a + (q.fewer ? ' : ' : ' · ') + q.k + ' = <b>' + q.b + '</b> &nbsp;→&nbsp; ' + q.a + ' + ' + q.b + ' = ' + q.ans;
    if(q.shape === 1) return tr('едно кубче: ', 'один кубик: ') + q.W + ' : ' + q.n + ' = <b>' + q.u + '</b> &nbsp;→&nbsp; ' + q.u + ' · ' + q.m + ' = ' + q.ans;
    if(q.shape === 2) return tr('Пиер: ', 'П’єр: ') + q.x + ' : ' + q.k + ' = <b>' + q.p + '</b>, ' + tr('Клод: ', 'Клод: ') + q.p + ' + ' + q.d + ' = <b>' + q.c + '</b> &nbsp;→&nbsp; ' + q.x + ' − ' + q.c + ' = ' + q.ans;
    return q.x + ' · ' + q.k + ' = <b>' + q.k*q.x + '</b>, ' + q.x + ' + ' + q.k*q.x + ' = <b>' + q.T + '</b> &nbsp;→&nbsp; ' + q.T + ' : ' + q.m + ' = ' + q.ans;
  }
}
KIND.timesw = { draw:drawTimesW, eq:eqTimesW, why:whyTimesW };
