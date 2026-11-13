// Runs beside the app (in check.js's own scope, through eval), like check/ach-C.js.
// Европейско Кенгуру, 2 клас, builder C — brothers and sisters, ages, «all different», two overlapping groups:
// 330 Братя и сестри, 331 Всички деца, 332 Всички различни, 333 Преди и след, 334 Тортите, 335 Нито едното,
// 336 Колко най-много. Each printed task is drawn as printed and asked by its level (the official answer is the key);
// then every new generator is worked out again another way.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  const met = [];
  // fields: what makes it the printed question (the names, the numbers); the seed search needs a level that draws it
  const pin = (year, task, id, q, key, shows, fields) => {
    const name = 'Кенгуру ' + year + ' task ' + task, tag = 'ek-' + year + '-2', sig = g => fields.map(f => JSON.stringify(g[f])).join('|'), want = sig(q);
    if(String(Q.answers(q)) !== String(key)) throw new Error(name + ': gives ' + Q.answers(q) + ', the official answer is ' + key);
    if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the official answer is not accepted');
    if(strip(Q.drawQ(q)).indexOf(shows.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + strip(Q.drawQ(q)));
    const lvl = Q.LEVELS.find(l => l.id === id);
    if(!lvl.papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    // the generator's own answer on the printed question must be the paper's: a hand-written q.ans alone proves nothing
    const same = g => { if(fields.length && String(Q.answers(g)) !== String(key)) throw new Error(name + ': level ' + id + ' draws it but answers ' + Q.answers(g) + ', the paper says ' + key); return 2; };
    const hit = pinSeed(name, () => Q.raw(id), g => g.kind !== q.kind || g.shape !== q.shape ? 0 : sig(g) === want ? same(g) : 0);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    met.push(year + '#' + task);
  };
  // 2026, задача 24: the cat with 7 kittens — Албер a boy, Стела a girl
  pin(2026, 24, 330, {kind:'sibs', shape:'brothers', an:0, nm:0, n:7, b:2, g:5, traps:[5, 2], ans:4}, 4,
    'Една котка има 7 котенца. Едно от мъжките котенца се казва Алберт, а едно от женските котенца се казва Стела. Стела има два пъти повече братя от Алберт. Колко сестри има Стела?', ['shape', 'an', 'nm', 'n']);
  // 2021, задача 22: each son as many brothers as sisters, each daughter twice as many brothers as sisters — 7 children
  pin(2021, 22, 331, {kind:'sibsall', k:2, o:3, s:4, sw:false, asksBoys:false, boys:4, girls:3, traps:[8, 6], ans:7}, 7,
    'всеки син има толкова братя, колкото и сестри, а всяка сестра има два пъти повече братя, отколкото сестри. Колко деца има в това семейство?', ['k', 'sw', 'asksBoys']);
  // 2026, задача 18: the father, the mother (30) and three children — 31
  pin(2026, 18, 332, {kind:'alldiff', shape:'family', c:3, M:30, S:67, kids:[1, 2, 3], ks:6, traps:[34, 30], ans:31}, 31,
    'Годините на бащата, майката и на трите им деца са различни числа. Майката е на 30 години, а сборът от годините на петимата е 67. На колко години е бащата, ако той е най-възрастен?', ['shape', 'c', 'M']);
  // 2025, задача 26: 17 sparrows on 3 trees — 12
  pin(2025, 26, 332, {kind:'alldiff', shape:'birds', t:3, m:2, n:17, rest:[2, 3], traps:[13, 14], ans:12}, 12,
    'На 3 дървета в горичката са кацнали общо 17 врабчета. На всяко дърво има най-малко 2 врабчета и няма 2 дървета с еднакъв брой врабчета. Колко врабчета най-много е възможно да са кацнали на едно от дърветата?', ['shape', 't', 'm', 'n']);
  // 2025, задача 20: three years ago Ани and Боби together were 6, Ани is 7 now — 5
  pin(2025, 20, 333, {kind:'yearsago', ago:true, y:3, nm:0, a:7, T:6, traps:[2], ans:5}, 5,
    'Преди 3 години сборът от годините на Ани и Боби е бил 6. Сега Ани е на 7 години. На колко години е Боби сега?', ['ago', 'y', 'nm', 'a', 'T']);
  // 2023, задача 18: the cakes show 8, 7, 6, 5, 4 (the app lists them) — Сашо's is 6. The names are the printed ones; the
  // seed search needs the same chain and ages (the names are drawn at random out of ten)
  pin(2023, 18, 334, {kind:'cakes', k:2, m:1, young:true, lo:4, nm:[0, 1, 2, 3, 4], ages:[7, 5, 8, 4, 6], traps:[4], ans:6}, 6,
    'Лена е с 2 години по-голяма от Йоско, но е с 1 година по-малка от Ангел. Виктор е най-малкият.', ['k', 'm', 'young', 'lo']);
  // 2021, задача 11: 17 pupils, 11 English, 6 German, 5 both — 5 learn neither
  pin(2021, 11, 335, {kind:'neither', shape:'neither', li:0, a:11, b:6, c:5, n:17, some:12, traps:[12, 0], ans:5}, 5,
    'Учениците в едно извънкласно занимание са 17. От тях 11 учат английски език, 6 учат немски език, а 5 учат и двата езика. Колко ученици в това извънкласно занимание не учат нито английски, нито немски?', ['shape', 'li', 'a', 'b', 'c', 'n']);
  // 2021, задача 10: 19 members, 11 boys, 3 girls fair-haired, 15 dark-haired — 10 dark-haired boys
  pin(2021, 10, 335, {kind:'neither', shape:'table', N:19, B:11, G:8, f:3, D:15, dg:5, sw:false, traps:[12, 7], ans:10}, 10,
    'Участниците в един клуб по интереси са 19, като момчетата са 11, а останалите са момичета. Част от участниците са тъмнокоси, а останалите са русокоси. Колко от момчетата са тъмнокоси, ако 3 момичета са русокоси, а 15 участници са тъмнокоси?', ['shape', 'N', 'B', 'f', 'D', 'sw']);
  // 2022, задача 25: 25 pupils, 20 mothers, 16 fathers — at most 5 with no parent there
  pin(2022, 25, 336, {kind:'parents', shape:'none', n:25, mom:20, dad:16, traps:[9, 11], ans:5}, 5,
    'Броят на учениците в един клас е 25 и в класа няма близнаци. На родителска среща на класа присъствали 20 майки и 16 бащи. Колко най-много са учениците от класа, за които нито един от родителите им не е присъствал на родителската среща?', ['shape', 'n', 'mom', 'dad']);
  console.log('Кенгуру 2 клас, brothers and sisters, ages, overlapping groups: ' + met.join(', ') + ' pinned (the official answers)');

  // every new generator worked out again another way
  const n = {};
  const count = k => n[k] = (n[k] || 0) + 1;
  for(let i = 0; i < 3000; i++){
    // 330: every family of n young with a boy and a girl in it — the one that fits the clue
    const q = Q.raw(330); count('sibs ' + q.shape);
    const fits = [];
    for(let b = 1; b < q.n; b++){
      const g = q.n - b;                 // Albert (a boy) has b − 1 brothers and g sisters; Stela (a girl) has b brothers and g − 1 sisters
      if(q.shape === 'brothers' ? b === 2*(b - 1) : g === 2*b) fits.push([b, g]);
    }
    if(fits.length !== 1 || fits[0][0] !== q.b || fits[0][1] !== q.g || q.g - 1 !== q.ans || q.n > 12) fail('330: the family', q);
  }
  for(let i = 0; i < 3000; i++){
    // 331: every family up to 14 children whose sons and daughters count as told
    const q = Q.raw(331); count('sibsall ' + (q.sw ? 'swapped' : 'printed') + ' ' + q.k);
    const fits = [];
    for(let b = 1; b <= 14; b++) for(let g = 1; g <= 14; g++){
      const sonBr = b - 1, sonSis = g, dauBr = b, dauSis = g - 1;
      // printed: a son has as many brothers as sisters, a daughter k times as many brothers as sisters; swapped: the other way round
      const ok = q.sw ? dauSis === dauBr && sonSis === q.k*sonBr : sonBr === sonSis && dauBr === q.k*dauSis;
      if(ok) fits.push([b, g]);
    }
    if(fits.length !== 1 || fits[0][0] !== q.boys || fits[0][1] !== q.girls || q.ans !== (q.asksBoys ? q.boys : q.boys + q.girls) || q.k > 3) fail('331: the family', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(332); count('alldiff ' + q.shape);
    if(q.shape === 'birds'){
      // every way to seat n sparrows on t trees, at least m each, no two equal: the most on one
      let most = 0;
      const go = (left, from, got) => {   // strictly increasing counts, the last tree takes what is left
        if(got.length === q.t - 1){ if(left > got[got.length - 1]) most = Math.max(most, left); return; }
        for(let v = from; v <= left; v++) go(left - v, v + 1, got.concat(v));
      };
      go(q.n, q.m, []);
      if(most !== q.ans || q.ans <= q.rest[q.t - 2] || q.t < 3) fail('332: the birds', q);
    } else {
      // the father's age F, every set of distinct children's ages below him, all five (four) different, the sum told
      const fathers = new Set();
      for(let F = 1; F < q.S; F++){
        if(F === q.M || F < q.M) continue;
        const rec = (k, from, left) => {
          if(k === 0) return left === 0;
          for(let v = from; v < F && v <= left; v++) if(v !== q.M && rec(k - 1, v + 1, left - v)) return true;
          return false;
        };
        if(rec(q.c, 1, q.S - q.M - F)) fathers.add(F);
      }
      if(fathers.size !== 1 || !fathers.has(q.ans)) fail('332: the family ' + [...fathers], q);
    }
  }
  for(let i = 0; i < 3000; i++){
    // 333: the other child's age that gives the told sum, tried one by one
    const q = Q.raw(333); count('yearsago ' + (q.ago ? 'ago' : 'later'));
    const fits = []; for(let b = 1; b <= 40; b++) if((q.ago ? q.a + b - 2*q.y : q.a + b + 2*q.y) === q.T) fits.push(b);
    if(fits.length !== 1 || fits[0] !== q.ans || q.a - (q.ago ? q.y : 0) < 1 || q.ans - (q.ago ? q.y : 0) < 1) fail('333: the age', q);
  }
  for(let i = 0; i < 3000; i++){
    // 334: every way to give the five children the five ages: only one fits the clues, and it is the printed one
    const q = Q.raw(334); count('cakes');
    const ages = [0, 1, 2, 3, 4].map(j => q.lo + j), sols = [], perm = (pick, left) => {
      if(!left.length){ const [A, B, C, V] = pick; if(A - B === q.k && C - A === q.m && V === (q.young ? q.lo : q.lo + 4)) sols.push(pick); return; }
      left.forEach(v => perm(pick.concat(v), left.filter(x => x !== v)));
    };
    perm([], ages);
    const text = strip(Q.drawQ(q)), names = q.nm.map(j => ['Лена', 'Йоско', 'Ангел', 'Виктор', 'Сашо', 'Мая', 'Ники', 'Ива', 'Васко', 'Ема'][j]);
    if(sols.length !== 1 || sols[0].join() !== q.ages.join() || q.ans !== sols[0][4] || new Set(q.nm).size !== 5 || !names.every(s => text.includes(s)) || !text.includes(String(q.ans) + '🎂') && !text.includes('🎂' + q.ans)) fail('334: the cakes', q);
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(335); count('neither ' + q.shape);
    if(q.shape === 'neither'){
      // pupils 0…n − 1: the first a learn the first language, the last-but-overlap b the second, c of them both
      let none = 0;
      for(let p = 0; p < q.n; p++) if(!(p < q.a || (p >= q.a - q.c && p < q.a - q.c + q.b))) none++;
      if(none !== q.ans || q.a - q.c + q.b > q.n || q.c >= Math.min(q.a, q.b)) fail('335: the languages', q);
    } else {
      // the pupils one by one: the first B are the named kind; the fair ones among the others are f, the dark ones among the named kind are the answer
      let dark = 0, darkNamed = 0;
      for(let p = 0; p < q.N; p++){
        const named = p < q.B, isDark = named ? p < q.ans : p >= q.B + q.f;
        if(isDark) dark++;
        if(isDark && named) darkNamed++;
      }
      if(dark !== q.D || darkNamed !== q.ans || q.ans < 1 || q.ans >= q.B || q.f >= q.G) fail('335: the table', q);
    }
  }
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(336); count('parents ' + q.shape);
    // every number x of pupils with both parents there: the pupils with no parent are n − (mom + dad − x)
    let best = q.shape === 'none' ? -1 : 1e9;
    for(let x = 0; x <= Math.min(q.mom, q.dad); x++){
      const some = q.mom + q.dad - x;
      if(some > q.n) continue;
      best = q.shape === 'none' ? Math.max(best, q.n - some) : Math.min(best, x);
    }
    if(best !== q.ans || q.mom >= q.n || q.dad > q.mom) fail('336: the parents', q);
  }
  if(Object.keys(n).length !== 15) throw new Error('the new generators did not draw every shape: ' + JSON.stringify(n));
  console.log('Кенгуру 2 клас, builder C: ' + Object.entries(n).map(([k, v]) => v + ' ' + k).join(', ') + ' worked out again another way');
}
