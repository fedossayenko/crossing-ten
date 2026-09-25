// Question kind 'least3': level 117 Зачеркни до трицифрено — Cross out digits to leave the smallest three-digit number.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Зима 2020, задача 20: from 6003067586 cross out 7 digits to leave the smallest three-digit number.
// It cannot start with 0, so the first digit is the smallest non-zero one early enough (3); then
// the smallest after it (0), then after that (5): 305. Found here by trying every three.
function least3Of(s){
  let best = null;
  for(let i = 0; i < s.length; i++) for(let j = i + 1; j < s.length; j++) for(let k = j + 1; k < s.length; k++){
    if(s[i] === '0') continue;
    const v = +(s[i] + s[j] + s[k]);
    if(best === null || v < best) best = v;
  }
  return best;
}
function genLeast3(){
  for(;;){
    const n = 7 + rnd(4), s = Array.from({length: n}, () => Math.random() < 0.25 ? '0' : String(1 + rnd(9))).join('');
    if(s[0] === '0' || !s.slice(1).includes('0')) continue;
    return {kind:'least3', s, cross: n - 3, ans: least3Of(s)};
  }
}
function drawLeast3(q){
  if(q.kind === 'least3'){
    return '<div class="ask">' + tr('Записани са цифрите <span class="num">' + q.s + '</span>. Зачеркнете <span class="num">' + q.cross + '</span> от тях, така че да получите <b>най-малкото</b> възможно трицифрено число. Кое е то?',
      'Записано цифри <span class="num">' + q.s + '</span>. Закресліть <span class="num">' + q.cross + '</span> з них так, щоб отримати <b>найменше</b> можливе трицифрове число. Яке воно?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqLeast3(q){
  if(q.kind === 'least3') return q.s + ' → ' + q.ans;
}
function whyLeast3(q, full){
  if(q.kind === 'least3'){
    if(!full) return tr('Първата цифра не може да е 0 — избери най-малката друга, но така, че след нея да останат още две.', 'Перша цифра не може бути 0 — вибери найменшу іншу, але так, щоб після неї лишилося ще дві.');
    const a = String(q.ans);
    return tr('първа: най-малката не нула, след която има още две цифри — <b>', 'перша: найменша не нуль, після якої є ще дві цифри — <b>') + a[0] + '</b>; ' +
      tr('после най-малките след нея — <b>', 'потім найменші після неї — <b>') + a[1] + '</b>, <b>' + a[2] + '</b> &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.least3 = { draw:drawLeast3, eq:eqLeast3, why:whyLeast3 };
