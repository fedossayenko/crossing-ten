// Question kind 'picdig': level 172 Картинки-цифри — Pictures stand for digits; two of them side by side
// make a two-digit number. Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2023, 1 клас, задача 18: 15 − 3 = [P][R] and 22 − 4 = [P][Y], so [R][Y] − [P] = ? The two
// differences are 12 and 18: P is 1, R is 2 and Y is 8 — then 28 − 1 = 27.
import { KIND, SLOT, rnd, shuffle, tr } from '../js/core.js';
import { ic } from './fruiteq.js';
function genPicSub(){
  for(;;){
    const P = 1 + rnd(2), R = 1 + rnd(9), Y = rnd(10), k1 = 1 + rnd(9), k2 = 1 + rnd(9);
    if(R === P || Y === P || Y === R) continue;
    return {kind:'picdig', shape:'sub', f: shuffle(['a','p','l']), P, R, Y, k1, k2,
            m1: 10*P + R + k1, m2: 10*P + Y + k2, ans: 10*R + Y - P};
  }
}
// МБГ Пролет 2025, 1 клас, задача 16: three pictures, three numbers — [a][b] = 12, [b][c] = 23,
// [c][a] = 31. Every picture stands first once, so the tens digits give a = 1, b = 2, c = 3;
// then [b][a] − [c] = 21 − 3 = 18. The asked pair turns one of the given pairs round.
function genPicTable(){
  const [a, b, c] = shuffle([1, 2, 3, 4, 5]).slice(0, 3), turn = rnd(3);
  return {kind:'picdig', shape:'table', f: shuffle(['a','p','l']), d:[a, b, c], turn,
          ans: picTurned(turn, [a, b, c])[0]};
}
// the asked pair and the picture taken away: [b][a] − [c], [c][b] − [a], [a][c] − [b]
const picTurned = (turn, d) => { const i = [1, 2, 0][turn], j = [0, 1, 2][turn], k = [2, 0, 1][turn];
  return [10*d[i] + d[j] - d[k], i, j, k]; };
// МБГ Полуфинал 2025, 1 клас, задача 19: the same table — [dog][chick] = 13, [chick][spider] = 34, [spider][dog] = 41 —
// then one picture twice less the other two: [chick][chick] − [dog][spider] = 33 − 14 = 19 (shape 'twin'; fruit here).
function genPicTwin(){
  for(;;){
    const d = shuffle([1, 2, 3, 4, 5]).slice(0, 3), x = rnd(3), o = [0, 1, 2].filter(i => i !== x), w = rnd(2), y = o[w], z = o[1 - w];
    if(d[x] < d[y]) continue;   // the difference stays positive
    return {kind:'picdig', shape:'twin', f: shuffle(['a','p','l']), d, x, y, z, ans: 11*d[x] - 10*d[y] - d[z]};
  }
}
export function genPicDig(){ const r = Math.random(); return r < 0.5 ? genPicSub() : r < 0.75 ? genPicTable() : genPicTwin(); }

const picTwo = (f, x, y) => '<span style="white-space:nowrap">' + ic(f[x]) + ic(f[y]) + '</span>';
function drawPicDig(q){
  if(q.shape === 'sub'){
    const F = q.f;    // F[0] is P, F[1] is R, F[2] is Y
    return '<div class="ask">' + tr('Всяка картинка е цифра: еднаквите картинки са еднакви цифри, а различните — различни. Две картинки една до друга са двуцифрено число. Ако',
      'Кожна картинка — це цифра: однакові картинки — однакові цифри, а різні — різні. Дві картинки поруч — це двоцифрове число. Якщо') + '</div>' +
      '<div class="eqs"><span>' + q.m1 + ' − ' + q.k1 + ' = ' + picTwo(F, 0, 1) + '</span><span>' + q.m2 + ' − ' + q.k2 + ' = ' + picTwo(F, 0, 2) + '</span></div>' +
      '<div class="ask">' + tr('колко е', 'скільки буде') + '</div>' +
      '<div class="line md">' + picTwo(F, 1, 2) + ' − ' + ic(F[0]) + ' = ' + SLOT + '</div>';
  }
  const F = q.f, d = q.d, n = (x, y) => 10*d[x] + d[y];
  let ask;
  if(q.shape === 'twin') ask = picTwo(F, q.x, q.x) + ' − ' + picTwo(F, q.y, q.z);
  else { const [, i, j, k] = picTurned(q.turn, d); ask = picTwo(F, i, j) + ' − ' + ic(F[k]); }
  return '<div class="ask">' + tr('Всяка картинка е цифра: различните картинки са различни цифри. Две картинки една до друга са двуцифрено число. Ако',
    'Кожна картинка — це цифра: різні картинки — різні цифри. Дві картинки поруч — це двоцифрове число. Якщо') + '</div>' +
    '<div class="eqs"><span>' + picTwo(F, 0, 1) + ' = ' + n(0, 1) + '</span><span>' + picTwo(F, 1, 2) + ' = ' + n(1, 2) + '</span><span>' + picTwo(F, 2, 0) + ' = ' + n(2, 0) + '</span></div>' +
    '<div class="ask">' + tr('колко е', 'скільки буде') + '</div>' +
    '<div class="line md">' + ask + ' = ' + SLOT + '</div>';
}
function eqPicDig(q){
  if(q.shape === 'sub') return q.m1 + ' − ' + q.k1 + ' = ' + (10*q.P + q.R) + ', ' + q.m2 + ' − ' + q.k2 + ' = ' + (10*q.P + q.Y) + ' → ' + (10*q.R + q.Y) + ' − ' + q.P + ' = ' + q.ans;
  if(q.shape === 'twin') return q.d.join(', ') + ' → ' + 11*q.d[q.x] + ' − ' + (10*q.d[q.y] + q.d[q.z]) + ' = ' + q.ans;
  const [, i, j, k] = picTurned(q.turn, q.d); return q.d.join(', ') + ' → ' + (10*q.d[i] + q.d[j]) + ' − ' + q.d[k] + ' = ' + q.ans; 
}
function whyPicDig(q, full){
  if(q.shape === 'sub'){
    if(!full) return tr('Пресметни първо двете разлики — те казват коя цифра е всяка картинка.', 'Спершу обчисли дві різниці — вони підкажуть, яка цифра в кожної картинки.');
    const F = q.f;
    return q.m1 + ' − ' + q.k1 + ' = <b>' + (10*q.P + q.R) + '</b> &nbsp;→&nbsp; ' + ic(F[0]) + ' = ' + q.P + ', ' + ic(F[1]) + ' = ' + q.R +
      ' &nbsp;→&nbsp; ' + q.m2 + ' − ' + q.k2 + ' = <b>' + (10*q.P + q.Y) + '</b> &nbsp;→&nbsp; ' + ic(F[2]) + ' = ' + q.Y +
      ' &nbsp;→&nbsp; ' + picTwo(F, 1, 2) + ' = <b>' + (10*q.R + q.Y) + '</b> &nbsp;→&nbsp; ' + (10*q.R + q.Y) + ' − ' + q.P + ' = ' + q.ans;
  }
  if(!full) return tr('Първата картинка от двете е цифрата на десетиците, а втората — на единиците.', 'Перша з двох картинок — цифра десятків, а друга — одиниць.');
  if(q.shape === 'twin'){
    const F = q.f, d = q.d, A = 11*d[q.x], B = 10*d[q.y] + d[q.z];
    return tr('всяка картинка стои отпред веднъж: ', 'кожна картинка один раз стоїть першою: ') + F.map((f, x) => ic(f) + ' = ' + d[x]).join(', ') +
      ' &nbsp;→&nbsp; ' + picTwo(F, q.x, q.x) + ' = <b>' + A + '</b>, ' + picTwo(F, q.y, q.z) + ' = <b>' + B + '</b> &nbsp;→&nbsp; ' + A + ' − ' + B + ' = ' + q.ans;
  }
  const F = q.f, d = q.d, [, i, j, k] = picTurned(q.turn, d);
  return tr('всяка картинка стои отпред веднъж: ', 'кожна картинка один раз стоїть першою: ') + F.map((f, x) => ic(f) + ' = ' + d[x]).join(', ') +
    ' &nbsp;→&nbsp; ' + picTwo(F, i, j) + ' = <b>' + (10*d[i] + d[j]) + '</b> &nbsp;→&nbsp; ' + (10*d[i] + d[j]) + ' − ' + d[k] + ' = ' + q.ans;
}
KIND.picdig = { draw:drawPicDig, eq:eqPicDig, why:whyPicDig };
