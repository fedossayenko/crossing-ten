// Question kind 'ribbon': level 32 Ленти — Centimetres, decimetres and metres.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 12: centimetres against decimetres and metres.
const LEN = [{ nm:'дм', cm:10 }, { nm:'м', cm:100 }];
function genRibbon(){
  if(Math.random() < 0.2){
    // Задача 13: one stick laid down a few times with a piece of board left over, and the
    // length wanted in дециметри — so the total has to come out a whole number of them.
    for(;;){
      const a = 6 + rnd(15), k = 2 + rnd(4);
      const left = 10 - (k*a) % 10 + 10*rnd(2);
      if(left < 1 || left >= a) continue;      // another whole stick would have fitted
      return {kind:'ribbon', shape:4, a, k, left, cm: k*a + left, ans: (k*a + left) / 10};
    }
  }
  if(Math.random() < 0.28){
    // Задача 13: a board measured by laying two sticks down a few times each. One stick
    // is sometimes given in дециметри, so the two have to be brought together first.
    const inDm = Math.random() < 0.35;
    const a = inDm ? 1 + rnd(2) : 8 + rnd(13);
    const b = 3 + rnd(8), k = 2 + rnd(3), m = 1 + rnd(3);
    return {kind:'ribbon', shape:3, inDm, a, aCm: inDm ? 10*a : a, b, k, m,
            ans: k * (inDm ? 10*a : a) + m*b};
  }
  for(;;){
    const u = Math.random() < 0.75 ? LEN[0] : LEN[1];
    const shape = rnd(3);
    if(shape === 0){                                     // straight conversion, either way
      const toCm = Math.random() < 0.5;
      const n = 1 + rnd(u.cm === 10 ? 9 : 3);
      return toCm ? {kind:'ribbon', shape, u, n, toCm, ans: n * u.cm}
                  : {kind:'ribbon', shape, u, n, toCm, cm: n * u.cm, ans: n};
    }
    const dm = LEN[0];                                   // a cut in metres would run past 100 cm
    const t = 2 + rnd(7);
    const target = t * dm.cm;
    const off = 2 + rnd(19);
    const L = shape === 1 ? target + off : target - off;
    if(L < 12) continue;
    return {kind:'ribbon', shape, u: dm, t, target, L, ans: off};
  }
}

const ribbonUkTimes = n => ({one:'раз', few:'рази'})[new Intl.PluralRules('uk').select(n)] || 'разів';
function drawRibbon(q){
  if(q.kind === 'ribbon' && q.shape === 4){
    const pt = n => n === 1 ? 'път' : 'пъти';
    return '<div class="ask">' + tr('Използваме пръчка с дължина <span class="num">' + q.a +
      ' см</span>, за да премерим дължината на една дъска. Сложили сме пръчката <span class="num">' + q.k +
      '</span> ' + pt(q.k) + ' и остават още <span class="num">' + q.left +
      '</span> см за премерване. Колко <b>дециметра</b> е дълга дъската?',
      'Паличкою завдовжки <span class="num">' + q.a +
      ' см</span> вимірюємо довжину однієї дошки. Ми приклали паличку <span class="num">' + q.k +
      '</span> ' + ribbonUkTimes(q.k) + ', і лишилося виміряти ще <span class="num">' + q.left +
      '</span> см. Скільки <b>дециметрів</b> завдовжки дошка?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + ' <span class="unit">дм</span></div>';
  }
  if(q.kind === 'ribbon' && q.shape === 3){
    const long = q.a + ' ' + (q.inDm ? 'дм' : 'см'), pt = n => n === 1 ? 'път' : 'пъти';
    return '<div class="ask">' + tr('Имам две пръчки — с дължина <span class="num">' + long +
      '</span> и с дължина <span class="num">' + q.b + ' см</span>. С тях премерих дължината на една дъска. ' +
      'Пръчката от <span class="num">' + long + '</span> използвах <span class="num">' + q.k + '</span> ' + pt(q.k) +
      ', а пръчката от <span class="num">' + q.b + ' см</span> — <span class="num">' + q.m + '</span> ' + pt(q.m) +
      '. Колко сантиметра е дължината на дъската?',
      'Є дві палички — завдовжки <span class="num">' + long +
      '</span> і завдовжки <span class="num">' + q.b + ' см</span>. Ними виміряли довжину однієї дошки. ' +
      'Паличку завдовжки <span class="num">' + long + '</span> приклали <span class="num">' + q.k + '</span> ' + ribbonUkTimes(q.k) +
      ', а паличку завдовжки <span class="num">' + q.b + ' см</span> — <span class="num">' + q.m + '</span> ' + ribbonUkTimes(q.m) +
      '. Скільки сантиметрів завдовжки дошка?') + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT + CM + '</div>';
  }
  if(q.kind === 'ribbon'){
    const ask = q.shape === 0
      ? (q.toCm ? tr('Колко сантиметра са <span class="num">' + q.n + '</span> ' + q.u.nm + '?',
                     'Скільки сантиметрів у <span class="num">' + q.n + '</span> ' + q.u.nm + '?')
                : tr('Колко ' + (q.u.nm === 'дм' ? 'дециметра' : 'метра') + ' са <span class="num">' + q.cm + '</span> см?',
                     'Скільки ' + (q.u.nm === 'дм' ? 'дециметрів' : 'метрів') + ' у <span class="num">' + q.cm + '</span> см?'))
      : q.shape === 1
      ? tr('Лента е дълга <span class="num">' + q.L + '</span> см. Колко сантиметра трябва да <b>отрежем</b> от нея, за да остане лента с дължина <span class="num">' + q.t + '</span> ' + q.u.nm + '?',
           'Стрічка завдовжки <span class="num">' + q.L + '</span> см. Скільки сантиметрів треба <b>відрізати</b> від неї, щоб лишилася стрічка завдовжки <span class="num">' + q.t + '</span> ' + q.u.nm + '?')
      : tr('Лента е дълга <span class="num">' + q.L + '</span> см. Колко сантиметра трябва да <b>добавим</b>, за да стане дълга <span class="num">' + q.t + '</span> ' + q.u.nm + '?',
           'Стрічка завдовжки <span class="num">' + q.L + '</span> см. Скільки сантиметрів треба <b>додати</b>, щоб вона стала завдовжки <span class="num">' + q.t + '</span> ' + q.u.nm + '?');
    const unit = q.shape === 0 && !q.toCm ? q.u.nm : 'см';
    return '<div class="ask">' + ask + '</div>' +
      '<div class="line" style="font-size:clamp(30px,9vw,50px)">' + SLOT +
      ' <span class="unit">' + unit + '</span></div>';
  }
}
function eqRibbon(q){
  if(q.kind === 'ribbon' && q.shape === 4) return q.k + '×' + q.a + ' + ' + q.left + ' = ' + q.cm + ' см → ' + q.ans;
  if(q.kind === 'ribbon' && q.shape === 3) return q.k + '×' + q.aCm + ' + ' + q.m + '×' + q.b + ' → ' + q.ans;
  if(q.kind === 'ribbon') return (q.shape === 0 ? tr('преобразуване', 'перетворення') : q.L + tr(' см към ', ' см до ') + q.t + ' ' + q.u.nm) + ' → ' + q.ans;
}
function whyRibbon(q, full){
  if(q.kind === 'ribbon' && q.shape === 4){
    if(!full) return tr('Първо цялата дъска в сантиметри, чак после я преобразувай.',
      'Спочатку знайди довжину всієї дошки в сантиметрах, а вже потім переводь.');
    return q.k + ' × ' + q.a + ' = <b>' + (q.k*q.a) + '</b> &nbsp;→&nbsp; ' + (q.k*q.a) + ' + ' + q.left +
      ' = <b>' + q.cm + ' см</b> &nbsp;→&nbsp; 10 см = 1 дм, ' + tr('значи', 'отже') + ' ' + q.ans;
  }
  if(q.kind === 'ribbon' && q.shape === 3){
    if(!full) return tr('Всяка пръчка се слага толкова пъти, колкото е казано — и мерките трябва да съвпадат.',
      'Кожну паличку прикладають стільки разів, скільки сказано, — і одиниці вимірювання мають збігатися.');
    const head = q.inDm ? q.a + ' дм = <b>' + q.aCm + ' см</b> &nbsp;→&nbsp; ' : '';
    return head + q.k + ' × ' + q.aCm + ' = <b>' + (q.k*q.aCm) + '</b>, &nbsp;' + q.m + ' × ' + q.b +
      ' = <b>' + (q.m*q.b) + '</b> &nbsp;→&nbsp; ' + (q.k*q.aCm) + ' + ' + (q.m*q.b) + ' = ' + q.ans;
  }
  if(q.kind === 'ribbon'){
    // the reminder must not state the factor: for a plain conversion that IS the answer
    if(!full) return q.shape === 0
      ? tr('Колко сантиметра има в един ' + (q.u.nm === 'дм' ? 'дециметър' : 'метър') + '?',
           'Скільки сантиметрів в одному ' + (q.u.nm === 'дм' ? 'дециметрі' : 'метрі') + '?')
      : tr('Първо преобразувай всичко в сантиметри.', 'Спочатку переведи все в сантиметри.');
    if(q.shape === 0) return q.toCm
      ? '1 ' + q.u.nm + ' = ' + q.u.cm + ' см &nbsp;→&nbsp; ' + q.n + ' ' + q.u.nm + ' = ' + q.ans + ' см'
      : q.u.cm + ' см = 1 ' + q.u.nm + ' &nbsp;→&nbsp; ' + q.cm + ' см = ' + q.ans + ' ' + q.u.nm;
    return q.t + ' ' + q.u.nm + ' = <b>' + q.target + ' см</b> &nbsp;→&nbsp; ' +
      (q.shape === 1 ? q.L + ' − ' + q.target : q.target + ' − ' + q.L) + ' = ' + q.ans;
  }
}
KIND.ribbon = { draw:drawRibbon, eq:eqRibbon, why:whyRibbon };
