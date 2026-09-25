// Question kind 'erasedig': level 110 Изтритата цифра — A sum that went wrong when one digit was rubbed out.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 3: Аня added a two-digit and a one-digit number and got 15; one digit rubbed
// out, it reads 5 + 1 = 15. Put a digit back so it is true again: 5 + 10 = 15, so the 0 went.
// Every digit in every place is tried, and only questions where one digit works are asked.
function eraseDigFixes(x, y, S){
  const out = new Set();
  [[x, 0], [y, 1]].forEach(([n, which]) => {
    const t = String(n);
    for(let at = 0; at <= t.length; at++) for(let d = 0; d <= 9; d++){
      const v = t.slice(0, at) + d + t.slice(at);
      if(v.length > 1 && v[0] === '0') continue;
      if(+v + (which ? x : y) === S) out.add(d);
    }
  });
  return [...out];
}
function genEraseDig(){
  for(;;){
    const X = 10 + rnd(80), y = 1 + rnd(9), S = X + y;
    if(S > 99) continue;
    const pos = rnd(2), shown = +(String(X).slice(0, pos) + String(X).slice(pos + 1)), gone = +String(X)[pos];
    const first = Math.random() < 0.5;                     // the two-digit one written first, or second
    const fixes = first ? eraseDigFixes(shown, y, S) : eraseDigFixes(y, shown, S);
    if(fixes.length !== 1 || fixes[0] !== gone) continue;
    return {kind:'erasedig', X, y, S, shown, first, ans: gone};
  }
}
const eraseDigSum = q => q.first ? q.shown + ' + ' + q.y : q.y + ' + ' + q.shown;
function drawEraseDig(q){
  if(q.kind === 'erasedig'){
    return '<div class="ask">' + tr('Аня събрала едно двуцифрено и едно едноцифрено число и получила <span class="num">' + q.S + '</span>. След това изтрила една цифра в записаното и се получило:',
      'Аня додала одне двоцифрове й одне одноцифрове число й отримала <span class="num">' + q.S + '</span>. Потім стерла одну цифру в записі, і вийшло:') + '</div>' +
      '<div class="given">' + eraseDigSum(q) + ' = ' + q.S + '</div>' +
      '<div class="ask">' + tr('Коя цифра е изтрила Аня?', 'Яку цифру стерла Аня?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqEraseDig(q){
  if(q.kind === 'erasedig') return (q.first ? q.X + ' + ' + q.y : q.y + ' + ' + q.X) + ' = ' + q.S + ' → ' + q.ans;
}
function whyEraseDig(q, full){
  if(q.kind === 'erasedig'){
    if(!full) return tr('Кое от числата е било двуцифрено? Колко трябва да е то, за да излезе сборът?', 'Яке з чисел було двоцифровим? Яким воно має бути, щоб вийшла сума?');
    return q.S + ' − ' + q.y + ' = <b>' + q.X + '</b> &nbsp;→&nbsp; ' + tr('от ', 'з ') + q.X + tr(' е останало ', ' лишилося ') + q.shown + ' &nbsp;→&nbsp; ' + tr('изтрита е ', 'стерто ') + q.ans;
  }
}
KIND.erasedig = { draw:drawEraseDig, eq:eqEraseDig, why:whyEraseDig };
