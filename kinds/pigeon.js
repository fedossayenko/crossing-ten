// Question kind 'pigeon': level 181 Пет деца — Children each erase one digit of the same sum: how many results must match.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// МБГ Пролет 2022, 1 клас, задача 12: five children wrote 10 + 20 and each erased one digit, then added
// correctly. Only four sums can come out — 0 + 20 = 20, 1 + 20 = 21, 10 + 0 = 10, 10 + 2 = 12 — so with
// five children at least two got the same one: 2.
// [the sum written with that digit erased, its value] for each of the four digits of x + y
const pigeonTries = (x, y) => {
  const [a, b] = [String(x), String(y)];
  return [[a[1], +a[1] + y, '<s>' + a[0] + '</s>' + a[1] + ' + ' + b], [a[0], +a[0] + y, a[0] + '<s>' + a[1] + '</s> + ' + b],
          [b[1], x + +b[1], a + ' + <s>' + b[0] + '</s>' + b[1]], [b[0], x + +b[0], a + ' + ' + b[0] + '<s>' + b[1] + '</s>']];
};
const pigeonSums = q => [...new Set(pigeonTries(q.x, q.y).map(t => t[1]))];
function genPigeon(){
  for(;;){
    // two two-digit numbers, often round tens as on the paper
    const round = Math.random() < 0.5;
    const x = round ? 10*(1 + rnd(3)) : 10 + rnd(21), y = round ? 10*(1 + rnd(3)) : 10 + rnd(21);
    if(x === y || x % 10 + y % 10 > 9) continue;                     // no carrying past ten
    const m = new Set(pigeonTries(x, y).map(t => t[1])).size;
    const k = m + 1 + rnd(9 - m);                                     // more children than sums, at most nine
    if(Math.ceil(k / m) > 3) continue;                                 // two or three that must match
    return {kind:'pigeon', x, y, k, m, traps:[m, k - m], ans: Math.ceil(k / m)};
  }
}
const pigeonKids = n => tr(n + ' деца', ukN(n, 'дитина', 'дитини', 'дітей'));
function drawPigeon(q){
  if(q.kind === 'pigeon'){
    return '<div class="ask">' + tr('<span class="num">' + q.k + '</span> деца написали в тетрадките си <span class="num">' + q.x + ' + ' + q.y +
      '</span>. След това всяко дете изтрило по една цифра и пресметнало вярно сбора. Колко от получените сборове <b>със сигурност</b> са равни?',
      '<span class="num">' + ukN(q.k, 'дитина', 'дитини', 'дітей').replace(' ', '</span> ') + ' записали в зошитах <span class="num">' + q.x + ' + ' + q.y +
      '</span>. Потім кожна дитина стерла одну цифру й правильно обчислила суму. Скільки з отриманих сум <b>точно</b> однакові?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqPigeon(q){
  if(q.kind === 'pigeon') return pigeonSums(q).join(', ') + tr(' — ', ' — ') + pigeonKids(q.k) + ' → ' + q.ans;
}
function whyPigeon(q, full){
  if(q.kind === 'pigeon'){
    if(!full) return tr('Колко различни сбора изобщо могат да се получат? После ги сравни с броя на децата.',
      'Скільки різних сум узагалі може вийти? Потім порівняй їх із кількістю дітей.');
    const tries = pigeonTries(q.x, q.y).map(t => t[2] + ' = ' + t[1]).join(', &nbsp;'), sums = pigeonSums(q);
    const head = tries + ' &nbsp;→&nbsp; ' + tr('различните сборове са само ', 'різних сум лише ') + '<b>' + q.m + '</b>: ' + sums.join(', ');
    // each different sum given to as many children as it can take before one must repeat
    return head + ' &nbsp;→&nbsp; ' + (q.ans === 2
      ? tr('децата са ' + q.k + ', повече от сборовете, значи поне две деца имат един и същ сбор', 'дітей ' + q.k + ', більше, ніж сум, отже, щонайменше двоє дітей мають однакову суму')
      : tr('по две деца на сбор са ' + Array(q.m).fill(2).join(' + ') + ' = ' + 2*q.m + ', а децата са ' + q.k + ', значи поне три имат един и същ сбор',
           'по двоє дітей на суму — це ' + Array(q.m).fill(2).join(' + ') + ' = ' + 2*q.m + ', а дітей ' + q.k + ', отже, щонайменше троє мають однакову суму')) +
      ' &nbsp;→&nbsp; ' + q.ans;
  }
}
KIND.pigeon = { draw:drawPigeon, eq:eqPigeon, why:whyPigeon };
