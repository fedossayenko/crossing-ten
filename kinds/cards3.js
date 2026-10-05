// Question kind 'cards3': level 173 Три картички — Three digit cards make a one-digit and a two-digit number; every sum they can give.

// МБГ Пролет 2023, 1 клас, задача 19: cards 1, 2, 2. One card alone, the other two side by side:
// 1 and 22 → 23, 2 and 12 → 14, 2 and 21 → 23. The sums that can come out: 14 and 23.
// [the card alone, the two-digit number] for every way, 0 never in front
import { KIND, SLOT, rnd, svgText, tr } from '../js/core.js';
function cards3Ways(cs){
  const w = [];
  cs.forEach((s, i) => { const o = cs.filter((_, j) => j !== i); [[o[0], o[1]], [o[1], o[0]]].forEach(([t, u]) => { if(t) w.push([s, 10*t + u]); }); });
  return w.filter((x, i) => w.findIndex(y => y[0] === x[0] && y[1] === x[1]) === i);
}
export function genCards3(){
  for(;;){
    // two equal cards and another, or three different (one may be 0)
    const a = rnd(7), b = 1 + rnd(6), c = rnd(7);
    const rep = Math.random() < 0.5, cs = (rep ? [a, b, b] : [a, b, c]).sort((x, y) => x - y);
    if(new Set(cs).size !== (rep ? 2 : 3)) continue;
    const sums = [...new Set(cards3Ways(cs).map(([s, n]) => s + n))].sort((x, y) => x - y);
    if(sums.length < 2 || sums.length > 3) continue;
    return {kind:'cards3', cs, sums, slots: sums.length, ans: sums[0], alt: sums.slice(1)};
  }
}
function drawCards3(q){
  const card = (v, i) => '<rect x="' + (i*44 + 2) + '" y="2" width="38" height="48" rx="6" fill="var(--solid)" stroke="var(--ink)" stroke-width="1.6"/>' + svgText(i*44 + 21, 34, v, 22, 'var(--ink)');
  const or = ' <span class="or">' + tr('и', 'і') + '</span> ';
  return '<div class="ask">' + tr('На три картички са написани цифрите <span class="num">' + q.cs.join(', ').replace(/, (\d)$/, ' и $1') + '</span>. С тях са съставени <b>едно едноцифрено</b> и <b>едно двуцифрено</b> число. Получените числа са събрани. Кои са възможните сборове?',
    'На трьох картках написано цифри <span class="num">' + q.cs.join(', ').replace(/, (\d)$/, ' і $1') + '</span>. З них склали <b>одне одноцифрове</b> і <b>одне двоцифрове</b> число. Ці числа додали. Які суми можуть вийти?') + '</div>' +
    '<div class="fig"><svg viewBox="0 0 134 52" style="max-width:150px" role="img" aria-label="' + tr('три картички', 'три картки') + '">' + q.cs.map(card).join('') + '</svg></div>' +
    '<div class="line" style="font-size:clamp(26px,7.5vw,44px)">' + SLOT + or + '<span class="slot" id="slot1"></span>' + (q.slots > 2 ? or + '<span class="slot" id="slot2"></span>' : '') + '</div>';
}
function eqCards3(q){
  return q.cs.join(', ') + ' → ' + q.sums.join(tr(' и ', ' і '));
}
function whyCards3(q, full){
  if(!full) return tr('Избери коя картичка остава сама и от другите две направи двуцифрено число — по всички възможни начини.',
    'Вибери, яка картка лишається сама, а з двох інших склади двоцифрове число — усіма можливими способами.');
  return cards3Ways(q.cs).map(([s, n]) => s + ' + ' + n + ' = ' + (s + n)).join(', &nbsp;') +
    ' &nbsp;→&nbsp; ' + tr('различните сборове: ', 'різні суми: ') + q.sums.join(tr(' и ', ' і '));
}
KIND.cards3 = { draw:drawCards3, eq:eqCards3, why:whyCards3 };
