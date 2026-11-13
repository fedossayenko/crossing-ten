// Question kind 'earlywatch': level 348 — he thinks he is N minutes early, but his watch is slow (or fast), and the show starts late.

// Кенгуру 2021, 2 клас, задача 7: Ясен thought he was 20 minutes early, but his watch was 10 minutes slow: the real time is 10 minutes later, so he
// is only 10 early; the show started 5 minutes late, so he waited 10 + 5 = 15. A fast watch is the other way round: the real time is
// earlier, so he is earlier than he thought, N + S, and then the delay is added.
import { KIND, SLOT, rnd, tr } from '../js/core.js';
export function genEarlyWatch(){
  const fast = Math.random() < 0.35, s = 5 * (1 + rnd(2)), l = 5 * (1 + rnd(2)), n = fast ? 10 + 5 * rnd(4) : s + 5 * (1 + rnd(4)), early = fast ? n + s : n - s, ans = early + l;
  return {kind:'earlywatch', shape:fast ? 'fast' : 'slow', n, s, l, early, traps:[fast ? n - s + l : n + s + l, n + l].filter(v => v !== ans && v > 0), ans};
}
function drawEarlyWatch(q){
  const slow = q.shape === 'slow', a = '<span class="num">';
  return '<div class="ask">' + tr('Ясен мислел, че е дошъл пред театъра ' + a + q.n + '</span> минути преди започване на представлението, но се оказало, че часовникът му е ' + (slow ? 'изостанал' : 'избързал') + ' с ' + a + q.s + '</span> минути. Представлението започнало ' + a + q.l + '</span> минути по-късно от обявеното време. Колко време е чакал Ясен до началото на представлението?',
    'Ясен думав, що прийшов до театру за ' + a + q.n + '</span> хвилин до початку вистави, але виявилося, що його годинник ' + (slow ? 'відставав' : 'поспішав') + ' на ' + a + q.s + '</span> хвилин. Вистава почалася на ' + a + q.l + '</span> хвилин пізніше за оголошений час. Скільки часу Ясен чекав до початку вистави?') + '</div>' +
    '<div class="line xl">' + SLOT + ' <span class="unit">' + tr('мин', 'хв') + '</span></div>';
}
function eqEarlyWatch(q){ return q.n + (q.shape === 'slow' ? ' − ' : ' + ') + q.s + ' = ' + q.early + '; ' + q.early + ' + ' + q.l + ' = ' + q.ans; }
function whyEarlyWatch(q, full){
  const slow = q.shape === 'slow';
  if(!full) return slow ? tr('Часовникът изостава: истинският час е по-късен от показания. Значи Ясен е дошъл по-рано или по-късно, отколкото си мисли?', 'Годинник відстає: справжній час пізніший за показаний. Отже, Ясен прийшов раніше чи пізніше, ніж думає?')
    : tr('Часовникът избързва: истинският час е по-ранен от показания. Значи Ясен е дошъл по-рано или по-късно, отколкото си мисли?', 'Годинник поспішає: справжній час раніший за показаний. Отже, Ясен прийшов раніше чи пізніше, ніж думає?');
  return tr((slow ? 'часовникът изостава с ' + q.s + ', истинският час е по-късен — до представлението остават по-малко: ' : 'часовникът избързва с ' + q.s + ', истинският час е по-ранен — до представлението остават повече: ') + q.n + (slow ? ' − ' : ' + ') + q.s + ' = <b>' + q.early + '</b>. Още ' + q.l + ' минути закъснение: ' + q.early + ' + ' + q.l + ' = <b>' + q.ans + '</b>',
    (slow ? 'годинник відстає на ' + q.s + ', справжній час пізніший — до вистави лишається менше: ' : 'годинник поспішає на ' + q.s + ', справжній час раніший — до вистави лишається більше: ') + q.n + (slow ? ' − ' : ' + ') + q.s + ' = <b>' + q.early + '</b>. Ще ' + q.l + ' хвилин запізнення: ' + q.early + ' + ' + q.l + ' = <b>' + q.ans + '</b>');
}
KIND.earlywatch = { draw:drawEarlyWatch, eq:eqEarlyWatch, why:whyEarlyWatch };
