// Question kind 'ages': level 125 Годините на семейството — Ages linked one to the next, read from the one given; level 451 — only the gaps between ages.

// Коледно 2024, задача 8: Ани is 4 years older than her brother and 20 years younger than her
// mother; her father is 31 and 3 years older than the mother. Only the father's age is given, so
// the chain is read from him: mother 28, Ани 8, brother 4.
import { KIND, answerLine, bgWith, numSpan, rnd, shuffle, tr, ukN, ukPl } from '../js/core.js';
export function genAges(){
  for(;;){
    const F = 26 + rnd(20), m = 2 + rnd(6), older = Math.random() < 0.75, M = older ? F - m : F + m;
    const g = 18 + rnd(13), A = M - g, b = 2 + rnd(5), B = A - b, asksAni = Math.random() < 0.25;
    if(B < 1 || A > 16) continue;
    const old = {kind:'ages', F, m, older, M, g, A, b, B, asksAni, ans: asksAni ? A : B};
    return Math.random() < 0.55 ? old : genAgesChain();
  }
}
// Салабашев 2019 #5 (shape 'ago': Ани 6 older than Ели, Ели 2 younger than Мими, 7 years ago Мими was 8: Ани now), 2022 #5 (shape 'three': Мими 21,
// Таня 3 younger than her and 2 older than Пепи: Пепи) and 2023 #5 (shape 'points': Мими 37 points, Лили 16 more, Нина 26 more than Лили: Нина).
// Short chains from one given number, drawn after the old question.
function genAgesChain(){
  const w = rnd(3);
  if(w === 0){
    const x = 3 + rnd(7), y = 2 + rnd(4), z = 3 + rnd(6), p = 6 + rnd(5), M = p + z, E = M - y, A = E + x;
    return {kind:'ages', shape:'ago', x, y, z, p, M, E, A, traps:[A - z], ans: A};
  }
  if(w === 1){
    for(;;){
      const M = 14 + rnd(27), x = 2 + rnd(5), y = 2 + rnd(5), T = M - x, P = T - y;
      if(P < 5) continue;
      return {kind:'ages', shape:'three', M, x, y, T, P, traps:[T], ans: P};
    }
  }
  for(;;){
    const m = 20 + rnd(31), x = 5 + rnd(26), y = 5 + rnd(26), L = m + x, N = L + y;
    if(N > 99 || x === y) continue;
    return {kind:'ages', shape:'points', m, x, y, L, N, traps:[L], ans: N};
  }
}
const chainEq = q => q.shape === 'ago' ? q.p + ' + ' + q.z + ' = ' + q.M + ', ' + q.M + ' − ' + q.y + ' = ' + q.E + ', ' + q.E + ' + ' + q.x + ' = ' + q.A
  : q.shape === 'three' ? q.M + ' − ' + q.x + ' = ' + q.T + ', ' + q.T + ' − ' + q.y + ' = ' + q.P : q.m + ' + ' + q.x + ' = ' + q.L + ', ' + q.L + ' + ' + q.y + ' = ' + q.N;
function drawChain(q){
  const yr = n => ukPl(n, 'рік', 'роки', 'років');
  if(q.shape === 'ago') return '<div class="ask">' + tr('Ани е ' + bgWith(q.x) + ' ' + numSpan(q.x) + ' години по-голяма от Ели, а Ели е ' + bgWith(q.y) + ' ' + numSpan(q.y) + ' години по-малка от Мими. Преди ' + numSpan(q.z) + ' години Мими беше на ' + numSpan(q.p) + ' години. <b>На колко години е Ани сега?</b>',
    'Аня на ' + yr(q.x) + ' старша за Елі, а Елі на ' + yr(q.y) + ' молодша за Мімі. ' + yr(q.z) + ' тому Мімі було ' + yr(q.p) + '. <b>Скільки років Ані зараз?</b>') + '</div>' + answerLine('xl');
  if(q.shape === 'three') return '<div class="ask">' + tr('Мими е на ' + numSpan(q.M) + ' години. Таня е ' + bgWith(q.x) + ' ' + numSpan(q.x) + ' години по-малка от Мими и ' + bgWith(q.y) + ' ' + numSpan(q.y) + ' години по-голяма от Пепи. <b>На колко години е Пепи?</b>',
    'Мімі ' + yr(q.M) + '. Таня на ' + yr(q.x) + ' молодша за Мімі і на ' + yr(q.y) + ' старша за Пепі. <b>Скільки років Пепі?</b>') + '</div>' + answerLine('xl');
  return '<div class="ask">' + tr('На тест по математика Лили получи ' + bgWith(q.x) + ' ' + numSpan(q.x) + ' точки повече от Мими, която получи ' + numSpan(q.m) + ' точки, а Нина получи ' + bgWith(q.y) + ' ' + numSpan(q.y) + ' точки повече от Лили. <b>Колко точки е получила Нина?</b>',
    'На тесті з математики Ліля отримала на ' + ukPl(q.x, 'бал', 'бали', 'балів') + ' більше, ніж Мімі, яка отримала ' + ukPl(q.m, 'бал', 'бали', 'балів') + ', а Ніна отримала на ' + ukPl(q.y, 'бал', 'бали', 'балів') + ' більше, ніж Ліля. <b>Скільки балів отримала Ніна?</b>') + '</div>' + answerLine('xl');
}
function whyChain(q, full){
  if(!full) return q.shape === 'ago' ? tr('Започни от Мими: на колко години е сега, като знаеш на колко е била преди. После Ели, после Ани.', 'Почни з Мімі: скільки їй зараз, коли знаєш, скільки було раніше. Потім Елі, потім Аня.')
    : q.shape === 'three' ? tr('„По-малка от Мими“ — извади. „По-голяма от Пепи“ — Пепи е по-малка от Таня.', '«Молодша за Мімі» — відніми. «Старша за Пепі» — Пепі молодша за Таню.')
    : tr('Първо точките на Лили, после на Нина — Нина е с повече от Лили, не от Мими.', 'Спершу бали Лілі, потім Ніни — Ніна має більше, ніж Ліля, а не ніж Мімі.');
  const c = chainEq(q).split(', ').map((t, i, a) => i < a.length - 1 ? t.replace(/(\d+)$/, '<b>$1</b>') : t);
  const lead = q.shape === 'ago' ? [tr('Мими: ', 'Мімі: '), tr('Ели: ', 'Елі: '), tr('Ани: ', 'Аня: ')] : q.shape === 'three' ? [tr('Таня: ', 'Таня: '), tr('Пепи: ', 'Пепі: ')] : [tr('Лили: ', 'Ліля: '), tr('Нина: ', 'Ніна: ')];
  return c.map((t, i) => lead[i] + t).join(' &nbsp;→&nbsp; ');
}
// Level 451: only the gaps between ages are given, never an age. Салабашев 2024 #7 (shape 'older'): 7 years ago Фифо was as old as Кико is now, Пипо is 2 younger
// than Фифо — which is true: Пипо is 5 years older than Кико? Its four statements are the answer (own options); the slip is the direction, or the sum of the gaps.
// 2025 #8 (shape 'birth'): when Вики was born Ани was 2, Вики is 6 younger than Бети, Гери 7 older than Ани: how old was Гери when Бети was born? 7 − (6 − 2) = 3.
export function genAgeGaps(){
  if(Math.random() < 0.5){
    for(;;){
      const y = 3 + rnd(7), d = 2 + rnd(7), younger = Math.random() < 0.7, diff = younger ? y - d : y + d, D = Math.abs(diff), E = younger ? y + d : Math.abs(y - d);
      if(D < 2 || E < 2 || D === E) continue;
      const texts = [[true, D], [false, D], [true, E], [false, E]];   // [Пипо older than Кико?, by how much]
      const right = diff > 0, st = shuffle(texts.slice()), pick = st.findIndex(t => t[0] === right && t[1] === D);
      const options = st.map((t, id) => ({ id, v: id, text: [optBg(t), optUk(t)] }));
      return {kind:'ages', shape:'older', y, d, younger, diff, D, E, options, pick, own: true, ans: pick};
    }
  }
  for(;;){
    const a = 2 + rnd(3), b = 5 + rnd(5), c = 4 + rnd(7), ans = c - b + a;
    if(ans < 2 || ans > 8 || ans === c) continue;
    return {kind:'ages', shape:'birth', a, b, c, ans, traps:[c]};
  }
}
const optBg = ([older, n]) => 'Пипо е ' + bgWith(n) + ' ' + n + ' години ' + (older ? 'по-голям' : 'по-малък') + ' от Кико';
const optUk = ([older, n]) => 'Піпо на ' + ukN(n, 'рік', 'роки', 'років') + ' ' + (older ? 'старший' : 'молодший') + ' за Кіко';
function drawGaps(q){
  if(q.shape === 'older') return '<div class="ask">' + tr('Преди ' + numSpan(q.y) + ' години Фифо беше на толкова години, на колкото е Кико сега. Пипо е ' + bgWith(q.d) + ' ' + numSpan(q.d) + ' години ' + (q.younger ? 'по-малък' : 'по-голям') + ' от Фифо. <b>Вярно е, че:</b>',
    ukPl(q.y, 'рік', 'роки', 'років') + ' тому Фіфо було стільки років, скільки Кіко зараз. Піпо на ' + ukPl(q.d, 'рік', 'роки', 'років') + ' ' + (q.younger ? 'молодший' : 'старший') + ' за Фіфо. <b>Правильно, що:</b>') + '</div>';
  return '<div class="ask">' + tr('Когато Вики се роди, Ани беше на ' + numSpan(q.a) + ' години. Вики е ' + bgWith(q.b) + ' ' + numSpan(q.b) + ' години по-малка от Бети, а Гери е ' + bgWith(q.c) + ' ' + numSpan(q.c) + ' години по-голяма от Ани. <b>На колко години е била Гери, когато Бети се е родила?</b>',
    'Коли народилася Віки, Ані було ' + ukPl(q.a, 'рік', 'роки', 'років') + '. Віки на ' + ukPl(q.b, 'рік', 'роки', 'років') + ' молодша за Беті, а Гері на ' + ukPl(q.c, 'рік', 'роки', 'років') + ' старша за Ані. <b>Скільки років було Гері, коли народилася Беті?</b>') + '</div>' + answerLine('xl');
}
function eqGaps(q){
  if(q.shape === 'older') return tr('Фифо = Кико + ' + q.y + ', Пипо = Фифо ' + (q.younger ? '− ' : '+ ') + q.d + ' = Кико ' + (q.diff > 0 ? '+ ' : '− ') + q.D + ' → ', 'Фіфо = Кіко + ' + q.y + ', Піпо = Фіфо ' + (q.younger ? '− ' : '+ ') + q.d + ' = Кіко ' + (q.diff > 0 ? '+ ' : '− ') + q.D + ' → ') + tr(q.options[q.pick].text[0], q.options[q.pick].text[1]);
  return q.b + ' − ' + q.a + ' = ' + (q.b - q.a) + ', ' + q.c + ' − ' + (q.b - q.a) + ' = ' + q.ans;
}
function whyGaps(q, full){
  if(q.shape === 'older'){
    if(!full) return tr('Не търси годините им — ги няма. Запиши всеки като „Кико плюс или минус“ и сравни Пипо с Кико.', 'Не шукай їхній вік — його немає. Склади про кожного вираз «Кіко плюс або мінус» і порівняй Піпо з Кіко.');
    return tr('Фифо е ' + bgWith(q.y) + ' ' + q.y + ' години по-голям от Кико; Пипо е ' + bgWith(q.d) + ' ' + q.d + ' години' + (q.younger ? ' по-малък от Фифо, значи от Кико го делят ' + Math.max(q.y, q.d) + ' − ' + Math.min(q.y, q.d) + ' = ' : ' по-голям от Фифо, значи от Кико го делят ' + q.y + ' + ' + q.d + ' = ') + '<b>' + q.D + '</b> — ' + (q.diff > 0 ? 'по-голям' : 'по-малък'),
      'Фіфо старший за Кіко на ' + ukN(q.y, 'рік', 'роки', 'років') + '; Піпо на ' + ukN(q.d, 'рік', 'роки', 'років') + (q.younger ? ' молодший за Фіфо, тож від Кіко його відділяє ' + Math.max(q.y, q.d) + ' − ' + Math.min(q.y, q.d) + ' = ' : ' старший за Фіфо, тож від Кіко його відділяє ' + q.y + ' + ' + q.d + ' = ') + '<b>' + q.D + '</b> — ' + (q.diff > 0 ? 'старший' : 'молодший'));
  }
  if(!full) return tr('Не са ти дадени годините на Бети и Гери — само колко са по-големи. Сравни Бети с Ани, после Гери с Бети.', 'Тобі не дано вік Беті й Гері — лише на скільки хтось старший. Порівняй Беті з Ані, потім Гері з Беті.');
  return tr('Бети е по-голяма от Ани с ', 'Беті старша за Ані на ') + q.b + ' − ' + q.a + ' = <b>' + (q.b - q.a) + '</b> &nbsp;→&nbsp; ' + tr('Гери е по-голяма от Бети с ', 'Гері старша за Беті на ') + q.c + ' − ' + (q.b - q.a) + ' = ' + q.ans;
}
const agesUk = n => ukN(n, 'рік', 'роки', 'років');
function drawAges(q){
  if(q.shape === 'older' || q.shape === 'birth') return drawGaps(q);
  if(q.shape) return drawChain(q);
  return '<div class="ask">' + tr('Ани е ' + bgWith(q.b) + ' <span class="num">' + q.b + '</span> години по-голяма от брат си и ' + bgWith(q.g) + ' <span class="num">' + q.g + '</span> години по-малка от майка си. Бащата на Ани е на <span class="num">' + q.F +
    '</span> години и е ' + bgWith(q.m) + ' <span class="num">' + q.m + '</span> години ' + (q.older ? 'по-стар' : 'по-млад') + ' от майка ѝ. ' + (q.asksAni ? 'На колко години е <b>Ани</b>?' : 'На колко години е <b>брат ѝ</b>?'),
    'Аня на <span class="num">' + agesUk(q.b).replace(' ', '</span> ') + ' старша за брата і на <span class="num">' + agesUk(q.g).replace(' ', '</span> ') + ' молодша за маму. Татові Ані <span class="num">' + agesUk(q.F).replace(' ', '</span> ') +
    ', і він на <span class="num">' + agesUk(q.m).replace(' ', '</span> ') + ' ' + (q.older ? 'старший' : 'молодший') + ' за її маму. ' + (q.asksAni ? 'Скільки років <b>Ані</b>?' : 'Скільки років <b>її братові</b>?')) + '</div>' +
    answerLine('xl');
}
function eqAges(q){
  if(q.shape === 'older' || q.shape === 'birth') return eqGaps(q);
  if(q.shape) return chainEq(q);
  return q.F + (q.older ? ' − ' : ' + ') + q.m + ' = ' + q.M + ', ' + q.M + ' − ' + q.g + ' = ' + q.A + (q.asksAni ? '' : ', ' + q.A + ' − ' + q.b + ' = ' + q.B);
}
function whyAges(q, full){
  if(q.shape === 'older' || q.shape === 'birth') return whyGaps(q, full);
  if(q.shape) return whyChain(q, full);
  if(!full) return tr('Започни от единствения, чиито години са дадени — бащата. После майката, после Ани.', 'Почни з єдиного, чий вік відомий, — тата. Потім мама, потім Аня.');
  return tr('майката: ', 'мама: ') + q.F + (q.older ? ' − ' : ' + ') + q.m + ' = <b>' + q.M + '</b> &nbsp;→&nbsp; ' + tr('Ани: ', 'Аня: ') + q.M + ' − ' + q.g + ' = <b>' + q.A + '</b>' +
    (q.asksAni ? '' : ' &nbsp;→&nbsp; ' + tr('брат ѝ: ', 'її брат: ') + q.A + ' − ' + q.b + ' = ' + q.B);
}
KIND.ages = { draw:drawAges, eq:eqAges, why:whyAges };
