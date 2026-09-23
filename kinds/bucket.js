// Question kind 'bucket': level 56 Кофата — Filling a vessel until the two possible buckets tell apart.
// Generator, drawing, summary line and hints for this kind all live here; the level
// itself (difficulty, group, prerequisites) is its row in js/levels.js.

// Задача 10: one vessel of a known size and a bucket that is one of two sizes. Pour and
// watch: the answer is the fill at which the bigger bucket has overflowed the vessel and
// the smaller one has not, because that is the first moment the two stories differ.
function genBucket(){
  for(;;){
    const p = 2 + rnd(4), q = p + 1 + rnd(4);
    const V = 10 + rnd(20);
    const k = Math.ceil(V / q);
    if(k < 2 || k > 6 || k*p >= V) continue;   // more fills than that and the pouring is the work, not the thinking
    return {kind:'bucket', p, q, V, ans: k};
  }
}

const bucketLitre = n => ({one:'літр', few:'літри', many:'літрів'})[new Intl.PluralRules('uk').select(n)];
function drawBucket(q){
  if(q.kind === 'bucket'){
    return '<div class="ask">' + tr('Имам съд, който събира точно <span class="num">' + q.V +
      '</span> литра. Имам и кофа, която събира <b>или</b> <span class="num">' + q.p +
      '</span> литра, <b>или</b> <span class="num">' + q.q +
      '</span> литра. Колко <b>най-малко</b> пъти трябва да напълним кофата и да я изсипем в съда, ' +
      'за да разберем колко литра събира?',
      'Маю посудину, яка вміщує рівно <span class="num">' + q.V + '</span> ' + bucketLitre(q.V) +
      '. Маю також відро, яке вміщує <b>або</b> <span class="num">' + q.p + '</span> ' + bucketLitre(q.p) +
      ', <b>або</b> <span class="num">' + q.q + '</span> ' + bucketLitre(q.q) +
      '. Яку <b>найменшу</b> кількість разів треба наповнити відро й вилити його в посудину, ' +
      'щоб дізнатися, скільки літрів воно вміщує?') + '</div>' +
      '<div class="line" style="font-size:clamp(34px,10vw,56px)">' + SLOT + '</div>';
  }
}
function eqBucket(q){
  if(q.kind === 'bucket') return q.V + tr(' л, кофа ' + q.p + ' или ', ' л, відро ' + q.p + ' або ') + q.q + ' → ' + q.ans;
}
function whyBucket(q, full){
  if(q.kind === 'bucket'){
    if(!full) return tr('Кога съдът ще прелее при едната кофа, а при другата още не?',
                        'Коли посудина переллється з одним відром, а з іншим ще ні?');
    const big = [], small = [];
    for(let i = 1; i <= q.ans; i++){ big.push(i*q.q); small.push(i*q.p); }
    return tr('ако е ' + q.q + ' л: ' + big.join(', ') + ' — съдът прелива; ако е ' + q.p + ' л: ' +
      small.join(', ') + ' — още не е пълен &nbsp;→&nbsp; различават се при пълнене номер ',
      'якщо відро ' + q.q + ' л: ' + big.join(', ') + ' — посудина переливається; якщо ' + q.p + ' л: ' +
      small.join(', ') + ' — ще не повна &nbsp;→&nbsp; їх можна розрізнити на наповненні номер ') + q.ans;
  }
}
KIND.bucket = { draw:drawBucket, eq:eqBucket, why:whyBucket };
