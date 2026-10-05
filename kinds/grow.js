// Question kind 'grow': level 14 Нов сбор — Every addend changes by the same amount.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 7: every addend moves by the same amount, so the sum moves that many times.
// МБГ Зима 2020–2022: a difference, its minuend and subtrahend each changed — 40 − 10, the minuend
// down 10 and the subtrahend up 10, so both changes take away: 30 − 20 = 10.
import { BGNUM, KIND, SLOT, UKNUM, popAt, rnd, svgText, tr } from '../js/core.js';
function genGrowDiff(){
  for(;;){
    const M = 20 + rnd(60), S = 5 + rnd(M - 10), a = 1 + rnd(12), b = 1 + rnd(12), mUp = Math.random() < 0.3, sUp = Math.random() < 0.7;
    const M2 = mUp ? M + a : M - a, S2 = sUp ? S + b : S - b;
    if(M2 > 99 || S2 < 1 || M2 - S2 < 0) continue;
    return {kind:'grow', shape:'diff', M, S, a, b, mUp, sUp, M2, S2, ans: M2 - S2};
  }
}
// МБГ Пролет 2025, задача 10: in 15 + 18 + 27 + 28 each odd addend is made 3 times smaller. Only 15 and
// 27 change, to 5 and 9: 5 + 18 + 9 + 28 = 60. Level 135, apart from 14: it needs the times table.
export function genGrowTimes(){
  for(;;){
    const odd = Math.random() < 0.6, k = 2 + rnd(2), down = Math.random() < 0.7, xs = [];
    for(let i = 0; i < 4; i++) xs.push(10 + rnd(35));
    const hit = v => (v % 2 === 1) === odd, ys = xs.map(v => hit(v) ? (down ? v / k : v*k) : v);
    if(!xs.some(hit) || xs.every(hit) || ys.some(v => !Number.isInteger(v)) || ys.some(v => v > 99)) continue;
    return {kind:'grow', shape:'times', odd, k, down, xs, ys, traps:[xs.reduce((t, v) => t + (down ? v / k : v*k), 0)].filter(Number.isInteger), ans: ys.reduce((t, v) => t + v, 0)};
  }
}
export function genGrow(){
  if(Math.random() < 0.3) return genGrowDiff();
  const k = 2 + rnd(3);
  const d = 2 + rnd(5);
  const up = Math.random() < 0.65;
  const base = up ? 3 + rnd(15) : k*d + rnd(12);
  return {kind:'grow', k, d, up, base, ans: up ? base + k*d : base - k*d};
}

const growUkGen = {2:'двох', 3:'трьох', 4:'чотирьох'};
function drawGrow(q){
  if(q.kind === 'grow' && q.shape === 'times'){
    return '<div class="ask">' + tr('Всяко от <b>' + (q.odd ? 'нечетните' : 'четните') + '</b> събираеми в сбора <span class="num">' + q.xs.join(' + ') + '</span> е ' + (q.down ? 'намалено' : 'увеличено') + ' <span class="num">' + q.k + '</span> пъти. Пресметнете получения нов сбор.',
      'Кожен <b>' + (q.odd ? 'непарний' : 'парний') + '</b> доданок у сумі <span class="num">' + q.xs.join(' + ') + '</span> ' + (q.down ? 'зменшили' : 'збільшили') + ' в <span class="num">' + q.k + '</span> рази. Обчисліть нову суму.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'grow' && q.shape === 'diff'){
    const n = v => '<span class="num">' + v + '</span>';
    return '<div class="ask">' + tr('В разликата ' + n(q.M + ' − ' + q.S) + ' умаляемото е ' + (q.mUp ? 'увеличено' : 'намалено') + ' с ' + n(q.a) + ', а умалителят е ' + (q.sUp ? 'увеличен' : 'намален') + ' с ' + n(q.b) + '. Колко е <b>новата разлика</b>?',
      'У різниці ' + n(q.M + ' − ' + q.S) + ' зменшуване ' + (q.mUp ? 'збільшили' : 'зменшили') + ' на ' + n(q.a) + ', а від’ємник ' + (q.sUp ? 'збільшили' : 'зменшили') + ' на ' + n(q.b) + '. Якою стала <b>нова різниця</b>?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
  if(q.kind === 'grow'){
    return '<div class="ask">' + tr('Сборът на ' + BGNUM[q.k] + ' числа е <span class="num">' + q.base +
      '</span>. Всяко от събираемите ' + (q.up ? 'увеличаваме' : 'намаляваме') +
      ' с <span class="num">' + q.d + '</span>. Колко е новият сбор?',
      'Сума ' + growUkGen[q.k] + ' чисел дорівнює <span class="num">' + q.base +
      '</span>. Кожен доданок ' + (q.up ? 'збільшуємо' : 'зменшуємо') +
      ' на <span class="num">' + q.d + '</span>. Якою буде нова сума?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqGrow(q){
  if(q.kind === 'grow' && q.shape === 'times') return q.ys.join(' + ') + ' = ' + q.ans;
  if(q.kind === 'grow' && q.shape === 'diff') return '(' + q.M + (q.mUp ? ' + ' : ' − ') + q.a + ') − (' + q.S + (q.sUp ? ' + ' : ' − ') + q.b + ') = ' + q.M2 + ' − ' + q.S2 + ' = ' + q.ans;
  if(q.kind === 'grow') return tr(BGNUM[q.k] + ' числа, сбор ' + q.base + ', всяко ',
    UKNUM[q.k] + ' числа, сума ' + q.base + ', кожне ') + (q.up ? '+' : '−') + q.d + ' → ' + q.ans;
}
// The pictures. Every addend changes, so the change is there as many times as there are addends: the
// cards are the addends (their values are not given, only their sum), each with its own +d tag. The
// solution pops the tags on one by one, gathers them, and adds them to the old sum. The hint's picture
// carries no numbers — they are in the question, and a hint must never show the answer.
function growSvg(q, full){
  const W = 44, gap = 12, x0 = (240 - (q.k*W + (q.k - 1)*gap)) / 2, sign = q.up ? '+' : '−', col = q.up ? 'var(--good)' : 'var(--bad)';
  let g = '<path d="M' + x0 + ',22 v-6 h' + (q.k*W + (q.k - 1)*gap) + ' v6" stroke="var(--muted)" stroke-width="2.5" fill="none"/>' +
    svgText(120, 10, tr('сбор', 'сума') + (full ? ' ' + q.base : ''), 14, 'var(--muted)');
  for(let i = 0; i < q.k; i++){
    const x = x0 + i*(W + gap);
    g += '<rect x="' + x + '" y="28" width="' + W + '" height="34" rx="9" fill="none" stroke="var(--accent)" stroke-width="2.5"/>' + svgText(x + W/2, 52, '?', 18, 'var(--accent)') +
      '<g' + (full ? popAt(2 + 2*i) : '') + '><rect x="' + (x + 2) + '" y="70" width="' + (W - 4) + '" height="24" rx="12" fill="' + col + '"/>' + svgText(x + W/2, 87, sign + (full ? q.d : ''), 14, '#fff') + '</g>';
  }
  if(full) g += svgText(120, 122, Array(q.k).fill(sign + q.d).join(' ') + ' = ' + sign + q.k*q.d, 17, 'var(--ink)', popAt(2*q.k + 3)) +
    svgText(120, 148, q.base + ' ' + sign + ' ' + q.k*q.d + ' = ' + q.ans, 20, 'var(--ink)', popAt(2*q.k + 6));
  return '<svg viewBox="0 0 240 ' + (full ? 156 : 100) + '" style="display:block; width:200px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('събираемите и промяната на всяко', 'доданки та зміна кожного') + '">' + g + '</svg>';
}
// A difference as a bar: the minuend is the whole bar, the subtrahend the shaded part, the difference
// what is left. The new bar below shows both changes at once — the end moving, the shading growing or shrinking.
function growDiffSvg(q, full){
  const u = 180 / Math.max(q.M, q.M2), bar = (y, M, S, d) => {
    const w = M*u, s = S*u, at = n => full ? popAt(d + n) : '';
    return '<g' + at(0) + '><rect x="20" y="' + y + '" width="' + w.toFixed(1) + '" height="24" rx="5" fill="var(--warmbg)" stroke="var(--warm)" stroke-width="2"/>' +
      '<rect x="20" y="' + y + '" width="' + s.toFixed(1) + '" height="24" rx="5" fill="var(--accent)" opacity=".75"/>' +
      (full ? svgText((20 + s/2).toFixed(1), y + 17, S, 13, '#fff') + svgText((20 + w + 14).toFixed(1), y + 17, M, 13, 'var(--muted)') + '</g>' +
              '<g' + at(2) + '>' + svgText((20 + s + (w - s)/2).toFixed(1), y + 17, M - S, 14, 'var(--warmink)') + '</g>'
            : '</g>' + svgText((20 + s/2).toFixed(1), y + 40, tr('умалител', 'від’ємник'), 11, 'var(--accent)') + svgText((20 + s + (w - s)/2).toFixed(1), y + 40, tr('разлика', 'різниця'), 11, 'var(--warmink)'));
  };
  const arrow = up => up ? '↑' : '↓';
  const g = bar(14, q.M, q.S, 0) + svgText(120, full ? 66 : 76, full ? (q.mUp ? '+' : '−') + q.a + tr(' на умаляемото, ', ' до зменшуваного, ') + (q.sUp ? '+' : '−') + q.b + tr(' на умалителя', ' до від’ємника')
                                                        : tr('умаляемото ', 'зменшуване ') + arrow(q.mUp) + tr(', умалителят ', ', від’ємник ') + arrow(q.sUp), 12, 'var(--muted)') +
    (full ? bar(80, q.M2, q.S2, 3) : '');
  return '<svg viewBox="0 0 240 ' + (full ? 112 : 84) + '" style="display:block; width:230px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('разликата като ивица', 'різниця як смужка') + '">' + g + '</svg>';
}
function whyGrow(q, full){
  if(q.kind === 'grow' && q.shape === 'times'){
    if(!full) return tr('Кои от събираемите са ' + (q.odd ? 'нечетни' : 'четни') + '? Само те се променят — «пъти» значи ' + (q.down ? 'делим' : 'умножаваме') + '.', 'Які доданки ' + (q.odd ? 'непарні' : 'парні') + '? Змінюються лише вони — «у стільки разів» означає ' + (q.down ? 'ділимо' : 'множимо') + '.');
    return q.xs.map((v, i) => v === q.ys[i] ? String(v) : v + (q.down ? ' : ' : ' · ') + q.k + ' = <b>' + q.ys[i] + '</b>').join(', ') + ' &nbsp;→&nbsp; ' + q.ys.join(' + ') + ' = ' + q.ans;
  }
  if(q.kind === 'grow' && q.shape === 'diff'){
    if(!full) return tr('Намери новото умаляемо и новия умалител, после ги извади.', 'Знайди нове зменшуване й новий від’ємник, потім відніми.') + growDiffSvg(q, false);
    return tr('умаляемото: ', 'зменшуване: ') + q.M + (q.mUp ? ' + ' : ' − ') + q.a + ' = <b>' + q.M2 + '</b>, ' + tr('умалителят: ', 'від’ємник: ') + q.S + (q.sUp ? ' + ' : ' − ') + q.b + ' = <b>' + q.S2 + '</b> &nbsp;→&nbsp; ' + q.M2 + ' − ' + q.S2 + ' = ' + q.ans + growDiffSvg(q, true);
  }
  if(q.kind === 'grow'){
    if(!full) return tr('Всяко число се променя — колко пъти общо?', 'Змінюється кожне число — скільки разів загалом?') + growSvg(q, false);
    const step = Array(q.k).fill(q.d).join(' + ');
    return step + ' = <b>' + (q.k*q.d) + '</b> ' + (q.up ? tr('повече', 'більше') : tr('по-малко', 'менше')) +
      ' &nbsp;→&nbsp; ' + q.base + ' ' + (q.up ? '+' : '−') + ' ' + (q.k*q.d) + ' = ' + q.ans + growSvg(q, true);
  }
}
KIND.grow = { draw:drawGrow, eq:eqGrow, why:whyGrow };
