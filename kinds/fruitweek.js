// Question kind 'fruitweek': level 347 — a week's pattern of days (fruit on some, nothing on two), added over so many weeks.

// Кенгуру 2021, 2 клас, задача 23: Кенга eats 1 apple on Monday, Wednesday and Friday, 3 mangos on Tuesday and Thursday and nothing
// on Saturday and Sunday: 3 + 6 = 9 fruits a week, 9 + 9 = 18 in 2 weeks. (The pattern is told in words; weeks are added, no × before the times table.)
import { KIND, SLOT, popAt, rnd, svgText, tr } from '../js/core.js';
export function genFruitWeek(){
  const a = 1 + rnd(2), m = 2 + rnd(3), w = 2 + rnd(2), week = 3*a + 2*m;
  return {kind:'fruitweek', a, m, w, week, traps:[week, week + 2*a].filter(v => v !== w * week), ans: w * week};
}
function drawFruitWeek(q){
  const apBg = q.a === 1 ? '1 ябълка' : q.a + ' ябълки', apUk = q.a === 1 ? '1 яблуко' : q.a + ' яблука';
  return '<div class="ask">' + tr('В понеделник, сряда и петък Кенга се храни само с ябълки, а във вторник и четвъртък само с манго. На ден тя изяжда или <span class="num">' + apBg + '</span>, или <span class="num">' + q.m + '</span> броя манго. В събота и неделя Кенга почива и не яде нищо. Колко плода изяжда Кенга за <span class="num">' + q.w + '</span> седмици?',
    'У понеділок, середу й п’ятницю Кенга їсть лише яблука, а у вівторок і четвер — лише манго. На день вона з’їдає або <span class="num">' + apUk + '</span>, або <span class="num">' + q.m + '</span> манго. У суботу й неділю Кенга відпочиває й нічого не їсть. Скільки фруктів з’їдає Кенга за <span class="num">' + q.w + '</span> тижні?') + '</div>' +
    '<div class="line xl">' + SLOT + '</div>';
}
const weeks = q => Array(q.w).fill(q.week).join(' + ');
function eqFruitWeek(q){ return q.a + ' + ' + q.a + ' + ' + q.a + ' + ' + q.m + ' + ' + q.m + ' = ' + q.week + '; ' + weeks(q) + ' = ' + q.ans; }
// the seven days of one week, the fruit eaten under each
function weekSvg(q){
  const days = tr('пн вт ср чт пт сб нд', 'пн вт ср чт пт сб нд').split(' '), fruit = [q.a, q.m, q.a, q.m, q.a, 0, 0];
  let g = '';
  days.forEach((d, i) => { const x = 8 + i*36;
    g += '<rect x="' + x + '" y="6" width="32" height="52" rx="6" fill="' + (fruit[i] ? 'var(--accentbg)' : 'none') + '" stroke="' + (fruit[i] ? 'var(--accent)' : 'var(--muted)') + '" stroke-width="1.5"/>' +
      svgText(x + 16, 22, d, 11, 'var(--muted)') + svgText(x + 16, 46, fruit[i], 18, fruit[i] ? 'var(--ink)' : 'var(--muted)', popAt(i + 1)); });
  return '<svg viewBox="0 0 264 64" style="display:block; width:300px; max-width:100%; margin:6px auto 0" role="img" aria-label="' + tr('плодовете през седмицата', 'фрукти впродовж тижня') + '">' + g + '</svg>';
}
function whyFruitWeek(q, full){
  if(!full) return tr('Първо намери колко плода изяжда Кенга за една седмица — всеки ден поотделно, събота и неделя са нули.', 'Спершу знайди, скільки фруктів Кенга з’їдає за один тиждень — кожен день окремо, субота й неділя — нулі.') + weekSvg(q);
  return weekSvg(q) + tr('за една седмица: ' + q.a + ' + ' + q.m + ' + ' + q.a + ' + ' + q.m + ' + ' + q.a + ' = <b>' + q.week + '</b>; за ' + q.w + ' седмици: ' + weeks(q) + ' = <b>' + q.ans + '</b>',
    'за один тиждень: ' + q.a + ' + ' + q.m + ' + ' + q.a + ' + ' + q.m + ' + ' + q.a + ' = <b>' + q.week + '</b>; за ' + q.w + ' тижні: ' + weeks(q) + ' = <b>' + q.ans + '</b>');
}
KIND.fruitweek = { draw:drawFruitWeek, eq:eqFruitWeek, why:whyFruitWeek };
