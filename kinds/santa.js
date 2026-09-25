// Question kind 'santa': level 98 Градът на Дядо Коледа — A route, a ticket table, and the change counted out.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Коледно състезание 2025, задача 10, the one solved in full, in its three parts:
// А) houses 1 to 5 in order by the shortest roads: from 3 to 4 it is shorter back past 2
//    (7 + 4) than on past 5 (5 + 10), so 1 + 7 + 11 + 10 = 29 m.
// Б) two pupils, a grandad and a mother, each paying the price for them or the full one: 81 лв.
// В) the 19 лв change from 100, in exactly 6 notes and coins: 3 ways (1 2 2 2 2 10, 1 1 2 5 5 5,
//    1 1 1 1 5 10). The paper wants them listed; here it asks how many there are.
const SANTA_MONEY = [1, 2, 5, 10, 20, 50];
function santaWays(R, k){
  const out = [];
  (function walk(i, left, n, cur){
    if(n === k){ if(left === 0) out.push(cur.slice()); return; }
    for(let j = i; j < SANTA_MONEY.length; j++) if(SANTA_MONEY[j] <= left){ cur.push(SANTA_MONEY[j]); walk(j, left - SANTA_MONEY[j], n + 1, cur); cur.pop(); }
  })(0, R, 0, []);
  return out;
}
function genSanta(){
  const shape = rnd(3);
  for(;;){
    if(shape === 0){
      // roads: 1–2 a, 2–3 b, 2–4 c, 4–5 e, 3–5 f
      const a = 1 + rnd(3), b = 5 + rnd(5), c = 3 + rnd(4), e = b + 2 + rnd(4), f = 3 + rnd(5);
      const back = b + c, on = f + e;
      if(back === on) continue;
      return {kind:'santa', shape, a, b, c, e, f, back, on, ans: a + b + Math.min(back, on) + e};
    }
    if(shape === 1){
      // houses 2, 3, 4: [full price, pupils' price or 0, pensioners' price or 0]
      const rows = [0, 1, 2].map(() => { const F = 4 + rnd(12); return [F, Math.random() < 0.6 ? Math.ceil(F / 2) : 0, Math.random() < 0.6 ? Math.ceil(F / 2) : 0]; });
      const per = rows.map(([F, s, p]) => 2*(s || F) + (p || F) + F), T = per.reduce((x, y) => x + y, 0);
      if(T >= 100 || rows.every(r => !r[1] && !r[2])) continue;
      return {kind:'santa', shape, rows, per, ans: T};
    }
    const T = 55 + rnd(40), R = 100 - T, k = 4 + rnd(4), ways = santaWays(R, k);
    if(ways.length < 1 || ways.length > 4) continue;
    return {kind:'santa', shape, T, R, k, ways, ans: ways.length};
  }
}
function santaMap(q){
  const X = x => 40 + x*22, Y = y => 14 + y*22, pt = (x, y) => X(x).toFixed(1) + ',' + Y(y).toFixed(1);
  const lab = (x, y, t, anchor) => '<text x="' + X(x).toFixed(1) + '" y="' + Y(y).toFixed(1) + '" text-anchor="' + (anchor || 'middle') + '" font-size="11" font-weight="700" fill="var(--muted)" font-family="Nunito, sans-serif">' + t + '</text>';
  // a house and its name: beside it on the left edge, above or below it elsewhere, clear of the roads
  const house = (x, y, n, anchor, dy) => '<circle cx="' + X(x).toFixed(1) + '" cy="' + Y(y).toFixed(1) + '" r="4" fill="var(--accent)"/>' +
    lab(x + (anchor === 'end' ? -0.4 : 0), y + (dy || 0.2), tr('къща ', 'будинок ') + n, anchor);
  return '<div class="fig wide"><svg viewBox="0 0 270 150" role="img" aria-label="' + tr('пътищата между къщите', 'дороги між будинками') + '">' +
    '<polyline points="' + [pt(0, 0), pt(0, 1), pt(7, 1), pt(9, 5), pt(0, 5), pt(0, 1)].join(' ') + '" fill="none" stroke="var(--ink)" stroke-width="2"/>' +
    lab(0.3, 0.6, q.a + ' м', 'start') + lab(3.5, 0.75, q.b + ' м') + lab(0.3, 3.2, q.c + ' м', 'start') + lab(4.5, 4.7, q.e + ' м') + lab(8.4, 3, q.f + ' м', 'start') +
    house(0, 0, 1, 'end') + house(0, 1, 2, 'end') + house(7, 1, 3, 'middle', -0.45) + house(0, 5, 4, 'end') + house(9, 5, 5, 'middle', 0.95) + '</svg></div>';
}
function santaTable(q){
  const c = v => v ? v + ' лв.' : '–';
  return '<table class="tix"><tr><th>' + tr('Къща', 'Будинок') + '</th><th>' + tr('ученици', 'учні') + '</th><th>' + tr('пенсионери', 'пенсіонери') + '</th><th>' + tr('основна цена', 'повна ціна') + '</th></tr>' +
    q.rows.map((r, i) => '<tr><td>' + (i + 2) + '</td><td>' + c(r[1]) + '</td><td>' + c(r[2]) + '</td><td>' + c(r[0]) + '</td></tr>').join('') + '</table>';
}
function drawSanta(q){
  if(q.kind === 'santa'){
    const who = tr('Близнаците Ани и Емил, майка им и дядо им разгледали града на Дядо Коледа. ', 'Близнюки Ані та Еміл, їхня мама й дідусь оглядали місто Діда Мороза. ');
    if(q.shape === 0) return '<div class="ask">' + who + tr('Тръгнали от къща 1 и посетили подред къщи 2, 3, 4 и накрая 5 по <b>най-краткия път</b>. Колко метра са изминали?',
      'Вони вийшли з будинку 1 і відвідали по черзі будинки 2, 3, 4 і нарешті 5 <b>найкоротшим шляхом</b>. Скільки метрів вони пройшли?') + '</div>' +
      santaMap(q) + '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + ' <span class="unit">м</span></div>';
    if(q.shape === 1) return '<div class="ask">' + who + tr('Близнаците плащат билет за ученици, дядото — за пенсионери, а майката — основната цена. Където няма намаление, се плаща основната цена. Колко лева са дали за билети?',
      'Близнюки платять за учнівський квиток, дідусь — за пенсійний, а мама — повну ціну. Де знижки немає, платять повну ціну. Скільки левів вони заплатили за квитки?') + '</div>' +
      santaTable(q) + '<div class="line" style="font-size:clamp(28px,8vw,46px)">' + SLOT + ' <span class="unit">лв.</span></div>';
    return '<div class="ask">' + who + tr('Платили <span class="num">' + q.T + '</span> лв. за билети със <span class="num">100</span> лв. Рестото получили в точно <span class="num">' + q.k +
      '</span> банкноти и монети (без стотинки). <b>По колко начина</b> може да е било рестото?',
      'За квитки на <span class="num">' + ukN(q.T, 'лев', 'леви', 'левів').replace(' ', '</span> ') + ' вони дали <span class="num">100</span> левів. Решту отримали рівно <span class="num">' + q.k +
      '</span> купюрами й монетами (без стотинок). <b>Скількома способами</b> могла бути видана решта?') + '</div>' +
      '<div class="note">' + tr('Монети: 1 и 2 лв. Банкноти: 5, 10, 20 и 50 лв.', 'Монети: 1 і 2 леви. Купюри: 5, 10, 20 і 50 левів.') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqSanta(q){
  if(q.kind === 'santa'){
    if(q.shape === 0) return tr('път: ', 'шлях: ') + q.a + ' + ' + q.b + ' + ' + Math.min(q.back, q.on) + ' + ' + q.e + ' = ' + q.ans;
    if(q.shape === 1) return tr('билети: ', 'квитки: ') + q.per.join(' + ') + ' = ' + q.ans;
    return '100 − ' + q.T + ' = ' + q.R + tr(', ' + q.k + ' броя → ', ', ' + q.k + ' шт. → ') + q.ans;
  }
}
function whySanta(q, full){
  if(q.kind === 'santa'){
    if(q.shape === 0){
      if(!full) return tr('От къща 3 до къща 4 има два пътя — сравни ги.', 'Від будинку 3 до будинку 4 є дві дороги — порівняй їх.');
      return tr('от 3 до 4: назад през 2 — ', 'від 3 до 4: назад через 2 — ') + q.b + ' + ' + q.c + ' = ' + q.back + tr(', напред през 5 — ', ', далі через 5 — ') + q.f + ' + ' + q.e + ' = ' + q.on +
        ' &nbsp;→&nbsp; <b>' + Math.min(q.back, q.on) + '</b> &nbsp;→&nbsp; ' + q.a + ' + ' + q.b + ' + ' + Math.min(q.back, q.on) + ' + ' + q.e + ' = ' + q.ans;
    }
    if(q.shape === 1){
      if(!full) return tr('Пресметни всяка къща поотделно: двамата ученици, дядото и майката.', 'Порахуй кожен будинок окремо: двоє учнів, дідусь і мама.');
      return q.rows.map(([F, s, p], i) => tr('къща ', 'будинок ') + (i + 2) + ': ' + (s || F) + ' + ' + (s || F) + ' + ' + (p || F) + ' + ' + F + ' = ' + q.per[i]).join('; ') +
        ' &nbsp;→&nbsp; ' + q.per.join(' + ') + ' = ' + q.ans;
    }
    if(!full) return tr('Първо рестото. После подреди броенето — от най-големите банкноти към монетите.', 'Спершу решта. Потім рахуй по порядку — від найбільших купюр до монет.');
    return tr('рестото е ', 'решта: ') + '100 − ' + q.T + ' = <b>' + q.R + '</b> &nbsp;→&nbsp; ' + q.ways.map(w => w.join(' + ')).join('; ') + ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.santa = { draw:drawSanta, eq:eqSanta, why:whySanta };
