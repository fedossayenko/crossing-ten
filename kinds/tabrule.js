// Question kind 'tabrule': level 246 Таблицата — A table: each number below is made from the digits of the number above.

// МБГ Есен 2023, 3 клас, задача 6: 11 12 21 22 31 32 41 42 above 11 14 41 44 91 ? 161 164. Each digit is multiplied by
// itself and the results written side by side: 41 → 16 and 1 → 161, so 32 → 9 and 4 → 94. Asked the same way with each
// digit doubled (15 → 2 and 10 → 210, not 30). The top row is the paper's: four tens, two units each; the ? is never in
// the first two, and a number whose result has three digits is always left showing, so the side by side can be seen.
import { KIND, SLOT, rnd, svgText, tr } from '../js/core.js';
const tabF = (rule, d) => rule === 'sq' ? d*d : 2*d;
const tabOf = (rule, v) => +(String(tabF(rule, Math.floor(v / 10))) + tabF(rule, v % 10));
export function genTabRule(){
  for(;;){
    const rule = Math.random() < 0.7 ? 'sq' : 'dbl';
    // doubled, the units from 5 up make two digits (only those show it is not the number times 2), so the tens stay 1 … 4
    const a = rule === 'sq' ? 1 + rnd(3) : 1, b = rule === 'sq' ? rnd(3) : 4 + rnd(5), top = [];
    for(let t = a; t < a + 4; t++) for(let u = b; u < b + 2; u++) top.push(10*t + u);
    const low = top.map(v => tabOf(rule, v)), h = 2 + rnd(6);
    if(low.some(v => v > 999) || !low.some((v, i) => i !== h && v > 99)) continue;
    const t = Math.floor(top[h] / 10), u = top[h] % 10;
    // the slip: the two results added instead of written side by side
    return {kind:'tabrule', rule, top, low, h, traps:[tabF(rule, t) + tabF(rule, u)], ans: low[h]};
  }
}
function drawTabRule(q){
  const w = 40, H = 30;
  let g = '';
  q.top.forEach((v, i) => {
    g += '<rect x="' + i*w + '" y="0" width="' + w + '" height="' + H + '" fill="none" stroke="var(--muted)" stroke-width="1.2"/>' +
      '<rect x="' + i*w + '" y="' + H + '" width="' + w + '" height="' + H + '" fill="' + (i === q.h ? 'var(--warmbg)' : 'none') + '" stroke="var(--muted)" stroke-width="1.2"/>' +
      svgText(i*w + w/2, 20, v, 15, 'var(--ink)') + svgText(i*w + w/2, H + 20, i === q.h ? '?' : q.low[i], 15, i === q.h ? 'var(--warm)' : 'var(--ink)');
  });
  return '<div class="ask">' + tr('Кое е пропуснатото число?', 'Яке число пропущено?') + '</div>' +
    '<div class="fig wide"><svg viewBox="-2 -2 ' + (8*w + 4) + ' ' + (2*H + 4) + '" role="img" aria-label="' + tr('таблица с числа', 'таблиця з числами') + '">' + g + '</svg></div>' +
    '<div class="line xl">? = ' + SLOT + '</div>';
}
// one number worked: each digit, then the results side by side
function tabStep(rule, v){
  const t = Math.floor(v / 10), u = v % 10, f = d => (rule === 'sq' ? d + ' · ' + d : '2 · ' + d) + ' = ' + tabF(rule, d);
  return v + ': ' + f(t) + ', ' + f(u) + ' → ' + tabOf(rule, v);
}
function eqTabRule(q){
  return tabStep(q.rule, q.top[q.h]);
}
function whyTabRule(q, full){
  if(!full) return tr('Гледай всяка цифра на горното число поотделно. Какво става с нея в долното число?', 'Дивись на кожну цифру верхнього числа окремо. Що з нею відбувається в нижньому числі?');
  const ex = q.top.findIndex((v, i) => i !== q.h && q.low[i] > 99);   // a shown one where a digit makes two
  return (q.rule === 'sq' ? tr('всяка цифра се умножава по себе си и резултатите се пишат един до друг: ', 'кожну цифру множать саму на себе, а результати пишуть поруч: ')
    : tr('всяка цифра се удвоява и резултатите се пишат един до друг: ', 'кожну цифру подвоюють, а результати пишуть поруч: ')) +
    tabStep(q.rule, q.top[ex]) + '; &nbsp;<b>' + tabStep(q.rule, q.top[q.h]) + '</b>';
}
KIND.tabrule = { draw:drawTabRule, eq:eqTabRule, why:whyTabRule };
