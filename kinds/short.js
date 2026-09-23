// Question kind 'short': level 39 Не достигат — Short by so many — so how many are there now?.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

const SWEETS = ['бонбона', 'стикера', 'ябълки', 'монети'];

// Задача 10: being short of a total tells you how many there are now.
function genShort(){
  const item = SWEETS[rnd(SWEETS.length)];
  const have = 2 + rnd(18);
  const T1 = have + 2 + rnd(18);
  const T2 = T1 + 2 + rnd(20);
  const shape = Math.random() < 0.3 ? 1 : 0;
  return {kind:'short', item, have, T1, T2, d1: T1 - have, shape, ans: shape === 0 ? T2 - have : have};
}

// Ukrainian forms keyed by the Bulgarian noun: [accusative singular, 2–4, genitive plural, genitive singular]
const shortUk = {'бонбона':['цукерку','цукерки','цукерок','цукерки'], 'стикера':['наліпку','наліпки','наліпок','наліпки'],
                 'ябълки':['яблуко','яблука','яблук','яблука'], 'монети':['монету','монети','монет','монети']};
// "мати N …" wants the accusative, "не вистачає N …" the genitive
const shortAcc = (n, f) => f[{one:0, few:1, many:2}[new Intl.PluralRules('uk').select(n)]];
const shortGen = (n, f) => n % 10 === 1 && n % 100 !== 11 ? f[3] : f[2];
function drawShort(q){
  if(q.kind === 'short'){
    const f = shortUk[q.item];
    const tail = q.shape === 0
      ? tr('Колко ' + q.item + ' не ми достигат, за да имам <span class="num">' + q.T2 + '</span> ' + q.item + '?',
           'Скільки ' + f[2] + ' мені не вистачає, щоб мати <span class="num">' + q.T2 + '</span> ' + shortAcc(q.T2, f) + '?')
      : tr('Колко ' + q.item + ' имам?', 'Скільки ' + f[2] + ' у мене є?');
    return '<div class="ask">' + tr('Не ми достигат <span class="num">' + q.d1 + '</span> ' + q.item +
      ', за да имам <span class="num">' + q.T1 + '</span> ' + q.item + '. ',
      'Мені не вистачає <span class="num">' + q.d1 + '</span> ' + shortGen(q.d1, f) +
      ', щоб мати <span class="num">' + q.T1 + '</span> ' + shortAcc(q.T1, f) + '. ') + tail + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqShort(q){
  if(q.kind === 'short') return tr('не достигат ', 'не вистачає ') + q.d1 + ' до ' + q.T1 + ' → ' + q.ans;
}
function whyShort(q, full){
  if(q.kind === 'short'){
    if(!full) return tr('Първо намери колко имам сега.', 'Спочатку знайди, скільки в мене є зараз.');
    const head = tr('имам ', 'у мене є ') + q.T1 + ' − ' + q.d1 + ' = <b>' + q.have + '</b>';
    return q.shape === 1 ? head
      : head + tr(' &nbsp;→&nbsp; до ' + q.T2 + ' не достигат ', ' &nbsp;→&nbsp; до ' + q.T2 + ' не вистачає ') +
        q.T2 + ' − ' + q.have + ' = ' + q.ans;
  }
}
KIND.short = { draw:drawShort, eq:eqShort, why:whyShort };
