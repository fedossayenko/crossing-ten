// Question kind 'match': level 276 Свържи — Sums written on things, answers on others: which goes with which.

// Аз и числата 2026, задача 5 (shape 'gift'): Капитан Защо holds 100, Пинки 68 and Мъглата 93; the gifts say 97 − 29,
// 26 + 74 and 45 + 48. Worked out, 97 − 29 = 68 is Пинки's, 26 + 74 = 100 Капитан Защо's, 45 + 48 = 93 Мъглата's.
// Аз и числата 2024, задача 7 (shape 'hat'): hats 24, 71, 72 and 92 for snowmen marked 100 − 29, 43 − 19, 54 + 18 and
// 67 + 25. The paper joins them all with lines; here one is asked at a time, and the options are the sums themselves.
// Two of the answers are often close (71 and 72): a sum worked out roughly picks the wrong one. There are always four
// options, as in every А/Б/В/Г question: the gifts get a fourth, spare one that nobody holds.
import { KIND, rnd, shuffle, tr } from '../js/core.js';
// the paper's three, and pairs of children, as [Bulgarian, Ukrainian]
const MATCH_WHO = [[['Капитан Защо', 'Капітан Чому'], ['Пинки', 'Пінкі'], ['Мъглата', 'Туман']],
  [['Ани', 'Ані'], ['Иво', 'Іво'], ['Мая', 'Мая']], [['Ники', 'Нікі'], ['Лили', 'Лілі'], ['Асен', 'Асен']]];
// a sum or a difference of two numbers, at least one of them two-digit, that gives v, crossing a ten
function matchExpr(v){
  for(;;){
    if(Math.random() < 0.5 && v >= 22){
      const a = 11 + rnd(v - 21), b = v - a;
      if(b < 11 || a % 10 + b % 10 < 10) continue;
      return [a, '+', b];
    }
    const b = 11 + rnd(60), a = v + b;
    if(a > 100 || a % 10 >= b % 10 && a !== 100) continue;
    return [a, '−', b];
  }
}
export function genMatch(){
  // four sums, as four options; three children hold the answers of three of them (one gift is spare), or four hats all four
  const hat = Math.random() < 0.4, n = hat ? 4 : 3;
  const vals = [];
  while(vals.length < 4){
    const near = vals.length && Math.random() < 0.35, v = near ? vals[rnd(vals.length)] + (Math.random() < 0.5 ? 1 : -1) * (Math.random() < 0.6 ? 1 : 10) : 21 + rnd(80);
    if(v >= 21 && v <= 100 && v !== 99 && vals.indexOf(v) < 0) vals.push(v);   // 99 has no sum or difference that crosses a ten
  }
  const ex = vals.map(matchExpr), order = shuffle(vals.map((_, i) => i)).slice(0, n);   // ex[i] gives vals[i]; order: the answers held, as laid out
  const at = order[rnd(n)], options = ex.map((e, id) => ({ id, v: id, text: /** @type {[string, string]} */ ([e.join('&nbsp;'), e.join('&nbsp;')]) }));   // a sum never breaks inside its button
  return {kind:'match', shape: hat ? 'hat' : 'gift', who: hat ? -1 : rnd(MATCH_WHO.length), vals, ex, order, at, options, pick: at, own: true, ans: at};
}
const mVal = e => e[1] === '+' ? e[0] + e[2] : e[0] - e[2];
// the k-th one shown is the k-th name of the set and holds vals[order[k]]
const mName = (q, k) => { const w = MATCH_WHO[q.who][k]; return tr(w[0], w[1]); }, mAsked = q => q.order.indexOf(q.at);
function drawMatch(q){
  const n = v => '<span class="num">' + v + '</span>';
  if(q.shape === 'hat') return '<div class="ask">' + tr('Кой калпак при кой снежен човек ще отиде? На всеки снежен човек е написана сметка, а на калпака — отговорът ѝ.',
      'Яка шапка до якого сніговика піде? На кожному сніговику написано приклад, а на шапці — його відповідь.') + '</div>' +
    '<div class="given">' + tr('Калпаци: ', 'Шапки: ') + q.order.map(i => n(q.vals[i])).join(', ') + '</div>' +
    '<div class="ask">' + tr('При кой снежен човек ще отиде калпакът с числото ' + n(q.vals[q.at]) + '?', 'До якого сніговика піде шапка з числом ' + n(q.vals[q.at]) + '?') + '</div>';
  return '<div class="ask">' + tr('Кой какъв подарък ще получи? Всеки получава подаръка, чиято сметка дава неговото число. Един подарък е в повече.',
      'Хто який подарунок отримає? Кожен отримує подарунок, приклад на якому дає його число. Один подарунок — зайвий.') + '</div>' +
    '<div class="given">' + q.order.map((i, k) => '<span style="white-space:nowrap">' + mName(q, k) + ' ' + n(q.vals[i]) + '</span>').join(' · ') + '</div>' +
    '<div class="ask">' + tr('Кой подарък ще получи ' + mName(q, mAsked(q)) + '?', 'Який подарунок отримає ' + mName(q, mAsked(q)) + '?') + '</div>';
}
// the summary line is plain text
const eqMatch = q => q.ex[q.at].join(' ') + ' = ' + q.vals[q.at] + ' → ' + (q.shape === 'hat' ? tr('калпак ', 'шапка ') + q.vals[q.at] : mName(q, mAsked(q)));
function whyMatch(q, full){
  if(!full) return tr('Пресметни сметката на всеки отговор и я сравни с търсеното число — цялата, не само десетиците.',
    'Обчисли приклад кожної відповіді й порівняй із шуканим числом — усе число, не лише десятки.');
  return q.ex.map((e, i) => (i === q.at ? '<b>' : '') + e.join(' ') + ' = ' + mVal(e) + (i === q.at ? '</b> ✓' : '')).join(', ');
}
KIND.match = { draw:drawMatch, eq:eqMatch, why:whyMatch };
