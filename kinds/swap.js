// Question kind 'swap': levels 324 Размяна на плодове, 325 Жетони — things changed into other things by a rule.

// Европейско Кенгуру 2021, 2 клас, задача 18 (shape 'fruit'): 4 apples and 5 bananas; 3 apples turn into 1 banana, 3 bananas
// into 1 apple, until nothing more can be changed. Every change leaves fewer fruit, so it ends, and in whatever order
// it is done it ends the same (checked for every start here): 4 and 5 → 5 apples, 2 bananas → 2 apples, 3 bananas →
// 3 apples, 0 bananas → 0 apples, 1 banana. The paper asks what is left (1 banana); here the number of fruit left, 1.
// 2019, задача 24 (shape 'tokens'): a machine takes 1 red for 3 white, 1 white for 2 red; 3 red and 1 white, 3 tokens put
// in one after another — the fewest she can have then? Every change adds tokens (a red gives 3 for 1: two more, a white
// 2 for 1: one more), so the fewest is the way with the most white ones put in: 3 + 1 = 4 → 5 → 7 → 8.
import { KIND, SLOT, rnd, tr, trN, ukPl } from '../js/core.js';
const num = n => '<span class="num">' + n + '</span>';
// where the changing ends from a start, by every order of changes
export function swapEnds(a, b, out = new Set()){
  let moved = false;
  if(a >= 3){ moved = true; swapEnds(a - 3, b + 1, out); }
  if(b >= 3){ moved = true; swapEnds(a + 1, b - 3, out); }
  if(!moved) out.add(a + ',' + b);
  return out;
}
// the fewest and the most tokens after k changes from r red and w white
export function swapTokens(r, w, k){
  let lo = Infinity, hi = 0;
  const go = (r, w, k) => {
    if(!k){ lo = Math.min(lo, r + w); hi = Math.max(hi, r + w); return; }
    if(r) go(r - 1, w + 3, k - 1);
    if(w) go(r + 2, w - 1, k - 1);
  };
  go(r, w, k);
  return { lo, hi };
}
export function genSwap(){
  if(Math.random() < 0.5){
    for(;;){
      const a = 2 + rnd(8), b = 2 + rnd(8), ends = swapEnds(a, b);
      if(ends.size !== 1) continue;
      const [ea, eb] = [...ends][0].split(',').map(Number), left = ea + eb;
      if(left === a + b || a + b > 14) continue;
      return {kind:'swap', shape:'fruit', a, b, ea, eb, traps:[a + b], ans: left};
    }
  }
  for(;;){
    const r = 2 + rnd(3), w = 1 + rnd(3), k = 3, { lo, hi } = swapTokens(r, w, k);
    if(lo === hi) continue;
    return {kind:'swap', shape:'tokens', r, w, k, traps:[hi, r + w + k], ans: lo};
  }
}
function drawSwap(q){
  let ask;
  if(q.shape === 'fruit') ask = tr('На масата за фокуси има ' + num(q.a) + ' ябълки и ' + num(q.b) + ' банана. Фокусникът превръща 3 ябълки в 1 банан, а 3 банана в 1 ябълка. Фокусът продължава, докато е възможно превръщането. <b>Колко плода остават накрая?</b>',
    'На столі для фокусів ' + ukPl(q.a, 'яблуко', 'яблука', 'яблук') + ' і ' + ukPl(q.b, 'банан', 'банани', 'бананів') + '. Фокусник перетворює 3 яблука на 1 банан, а 3 банани на 1 яблуко. Фокус триває, поки можна перетворювати. <b>Скільки фруктів лишається наприкінці?</b>');
  else ask = tr('В клуб за електронни игри има машина, която заменя 1 червен жетон за 3 бели, а 1 бял жетон — за 2 червени. Нели имала ' + num(q.r) + ' червени жетона и ' + (q.w === 1 ? num(1) + ' бял' : num(q.w) + ' бели') + '. Тя пуснала последователно ' + num(q.k) + ' жетона в машината. <b>Колко най-малко жетона може да е имала Нели след това?</b>',
    'У клубі електронних ігор є автомат, який міняє 1 червону фішку на 3 білі, а 1 білу — на 2 червоні. Неля мала червоних фішок — ' + num(q.r) + ', білих — ' + num(q.w) + '. Вона послідовно вкинула в автомат ' + num(q.k) + ' фішки. <b>Яку найменшу кількість фішок могла мати Неля після цього?</b>');
  return '<div class="ask">' + ask + '</div><div class="line xl">' + SLOT + '</div>';
}
// the changes in the order that makes sense to write: bananas first while there are 3, else apples (any order ends the same)
function swapSteps(q){
  let a = q.a, b = q.b; const out = [];
  while(a >= 3 || b >= 3){
    if(b >= 3){ b -= 3; a += 1; out.push('(' + a + '; ' + b + ')'); } else { a -= 3; b += 1; out.push('(' + a + '; ' + b + ')'); }
  }
  return out;
}
function eqSwap(q){
  if(q.shape === 'fruit') return '(' + q.a + '; ' + q.b + ') → ' + swapSteps(q).join(' → ') + ' → ' + q.ans;
  return q.r + q.w + ' → … → ' + q.ans;
}
// one best way: the white ones go in first while there are any, the changes that add least
function tokenPath(q){
  let r = q.r, w = q.w; const path = [r + w], ways = [];
  for(let i = 0; i < q.k; i++){
    if(w && swapTokens(r + 2, w - 1, q.k - i - 1).lo === swapTokens(r, w, q.k - i).lo){ r += 2; w -= 1; ways.push(tr('бял', 'біла')); }
    else { r -= 1; w += 3; ways.push(tr('червен', 'червона')); }
    path.push(r + w);
  }
  return { path, ways };
}
function whySwap(q, full){
  if(q.shape === 'fruit'){
    if(!full) return tr('Прави превръщане, пиши колко ябълки и колко банана има, и така докато може. Всяко превръщане оставя по-малко плодове.', 'Роби перетворення, записуй, скільки яблук і скільки бананів, і так поки можна. Кожне перетворення лишає менше фруктів.');
    return tr('(ябълки; банани): ', '(яблука; банани): ') + '(' + q.a + '; ' + q.b + ') → ' + swapSteps(q).join(' → ') + ' &nbsp;→&nbsp; ' + tr('остава ', 'лишається ') + trN(q.ea, 'ябълка', 'ябълки', 'яблуко', 'яблука', 'яблук') + tr(' и ', ' і ') + trN(q.eb, 'банан', 'банана', 'банан', 'банани', 'бананів') + ': ' + q.ans;
  }
  if(!full) return tr('Всяко пускане увеличава жетоните: червен дава 3 за 1 — с 2 повече, бял дава 2 за 1 — само с 1 повече. Кое е по-добре, за да са най-малко?', 'Кожне вкидання збільшує фішки: червона дає 3 за 1 — на 2 більше, біла дає 2 за 1 — лише на 1 більше. Що краще, щоб було найменше?');
  const { path, ways } = tokenPath(q);
  return tr('жетони: ', 'фішки: ') + path.join(' → ') + ' (' + ways.join(', ') + ') &nbsp;→&nbsp; ' + q.ans;
}
KIND.swap = { draw:drawSwap, eq:eqSwap, why:whySwap };
