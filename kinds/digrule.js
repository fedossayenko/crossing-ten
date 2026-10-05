// Question kind 'digrule': level 188 Правилото ☺ — A rule shown on three numbers, used on a fourth.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2021, 1 клас, задача 19: 10 ⟹ 1 − 0 = 1, 12 ⟹ 2 − 1 = 1, 59 ⟹ 9 − 5 = 4 — so ☺ is the bigger
// digit take away the smaller. For 79: 9 − 7 = 2. The examples are chosen so the rule is plain: one with
// the bigger digit in front, so it is not just «ones minus tens». The other rule: the two digits added.
const digRuleOf = (rule, n) => { const t = Math.floor(n / 10), o = n % 10; return rule === 'sum' ? [t, o, t + o] : [Math.max(t, o), Math.min(t, o), Math.abs(t - o)]; };
const digRuleText = (rule, n) => { const [x, y, v] = digRuleOf(rule, n); return x + (rule === 'sum' ? ' + ' : ' − ') + y + ' = ' + v; };
function genDigRule(){
  for(;;){
    const rule = Math.random() < 0.7 ? 'diff' : 'sum', pick = () => 10 + rnd(90);
    const ex = [pick(), pick(), pick()], n = pick();
    if(new Set(ex.concat(n)).size !== 4 || ex.concat(n).some(v => v % 11 === 0)) continue;   // no equal digits: 33 says nothing about the rule
    if(!ex.some(v => v % 10)) continue;   // with a 0 digit, adding and taking away look the same: one example needs two non-zero digits
    // the difference rule needs one example with the bigger digit in front and one with it behind
    if(rule === 'diff' && !(ex.some(v => Math.floor(v / 10) > v % 10) && ex.some(v => Math.floor(v / 10) < v % 10))) continue;
    const v = digRuleOf(rule, n)[2];
    if(rule === 'sum' && v > 18) continue;
    return {kind:'digrule', rule, ex, n, ans: v};
  }
}
function drawDigRule(q){
  if(q.kind === 'digrule'){
    const row = v => '<div class="given" style="font-size:clamp(17px,4.6vw,24px)">' + v + ' &nbsp;⟹&nbsp; ' + digRuleText(q.rule, v) + ' &nbsp;⟹&nbsp; ☺ = ' + digRuleOf(q.rule, v)[2] + '</div>';
    return '<div class="ask">' + tr('Виж как е намерено ☺ за всяко число. Колко е ☺ за числото <span class="num">' + q.n + '</span>?',
      'Подивись, як знайдено ☺ для кожного числа. Скільки буде ☺ для числа <span class="num">' + q.n + '</span>?') + '</div>' +
      q.ex.map(row).join('') + '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + q.n + ' &nbsp;⟹&nbsp; ☺ = ' + SLOT + '</div>';
  }
}
function eqDigRule(q){
  if(q.kind === 'digrule') return q.n + ' ⟹ ' + digRuleText(q.rule, q.n);
}
function whyDigRule(q, full){
  if(q.kind === 'digrule'){
    if(!full) return tr('Какво става с двете цифри на всяко число? Направи същото с последното.', 'Що відбувається з двома цифрами кожного числа? Зроби те саме з останнім.');
    return (q.rule === 'sum' ? tr('☺ е сборът на двете цифри', '☺ — сума двох цифр') : tr('☺ е по-голямата цифра минус по-малката', '☺ — більша цифра мінус менша')) +
      ' &nbsp;→&nbsp; ' + q.n + ': <b>' + digRuleText(q.rule, q.n) + '</b>';
  }
}
KIND.digrule = { draw:drawDigRule, eq:eqDigRule, why:whyDigRule };
