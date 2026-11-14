// Runs beside the app (in check.js's own scope, through eval), like check/ek-W1.js.
// Салабашев, 2 клас — builder S4, text tasks: 2021 #9 (consonants against vowels, 483), #12 (ones and twos on a December calendar, 475), #13 (six chess
// players, 102), 2019 #10 (the dragon, 479), #15 (the cards the boys name, 484), 2022 #9 (МЕД read down the grid, 351), 2023 #9 and 2024 #4 (minutes
// between two times, 149), 2023 #14 (page numbers, 476), 2024 #14 (two cards turned, 485), 2025 #2 (the dates of December's Saturdays, 480), #6 (the
// four towns, 482), #13 (the smallest sum of three even numbers, 478), #14 (digits with ovals, 477), #15 (the socks, 481). Each printed task is drawn by its
// level as printed and held to the official key by the generator's own answer; the answer sheet of 2021 stops at task 9, so 2021 #12 and #13 are held to
// our own solution (#12: 14 ones + 13 twos on the dates 1–31, and the year 2021 on the calendar: two 2s and a 1 more, 30; #13: 5 + 4 + 3 + 2 + 1 = 15).
// Then every generator is worked out again from the task as it is drawn (its words, numbers and picture), not from the fields it keeps, on 2000–3000 seeds each.
{
  const Q = APP;
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q).slice(0, 400)); };
  const uk = fn => { Q.LANG = 'uk'; try { return fn(); } finally { Q.LANG = 'bg'; } };
  const pin = (name, tag, id, same, shows, key, tries = 2e6) => {
    const hit = pinSeed(name, () => Q.raw(id), g => same(g) ? 2 : 0, tries);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    if(typeof key === 'function'){ if(!key(q)) throw new Error(name + ': the level does not give the key ' + JSON.stringify(q).slice(0, 300)); }
    else {
      if(Q.answers(q).join() !== String(key)) throw new Error(name + ': the level gives ' + Q.answers(q) + ', the key says ' + key);
      if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    }
    return q;
  };
  const nums = h => strip(h).match(/\d+/g) || [];
  const bgUk = (q, id) => { const a = strip(Q.drawQ(q)), b = uk(() => strip(Q.drawQ(q))); if(nums(a).join() !== nums(b).join()) fail(id + ': the Ukrainian text asks with other numbers than the Bulgarian: ' + nums(a) + ' / ' + nums(b), q); };

  // ---- the printed instances
  // 2021 #9: the key is Б = 1 (the answer sheet's tasks 1–9)
  pin('Салабашев 2021 task 9', 'sal-2021-2', 483, g => g.name === 'ИВАН САЛАБАШЕВ' && g.more, ['С колко съгласните са повече от гласните в името', 'ИВАН САЛАБАШЕВ'], 1);
  // 2021 #12 and #13: no official key (own solution, 30 and 15)
  pin('Салабашев 2021 task 12', 'sal-2021-2', 475, g => g.mon === 10 && g.year === 2021 && g.ds.join() === '1,2', ['Календарът на стената показва дните на месец декември и сегашната година', 'Колко общо единици и двойки има на календара?'], 30);
  pin('Салабашев 2021 task 13', 'sal-2021-2', 102, g => g.shape === 'games' && g.n === 6 && g.g === 0, ['В турнир по шах участвали шест състезатели. Всеки двама състезатели играли помежду си по един мач. Колко мача общо са изиграни в турнира?'], 15);
  pin('Салабашев 2019 task 10', 'sal-2019-2', 479, g => g.sizes.join() === '1,2,3', ['джуджето Баин, което носи брадва', 'елфите Лио и Нео, които стрелят с лъкове', 'хората Мат, Тед и Дан, които са с мечове', 'По колко различни начина от шестимата можем да изберем двама, които да победят дракона?'], 11);
  // 2019 #15: the paper's three statements, as printed; the left card from the generator's formula
  {
    const told = [[1, 5, 9], [2, 5, 10], [3, 6, 10]], q = { kind:'cardsaid', k:3, N:10, who:[0, 1, 2], said:told, ans: Q.cardSaidLeft(10, told) }, t = strip(Q.drawQ(q));
    ['Ангелказал:Азвзех1,5и9.', 'Борисказал:Азвзех2,5и10.', 'Василказал:Азвзех3,6и10.', 'Всякомомчеказаловярночислатанадвеотсвоитекарти,ачислотонатретатакартаувеличилос1.', 'Коеечислотонакартата,коятоостаналанамасата?']
      .forEach(s => { if(t.indexOf(s) < 0) throw new Error('Салабашев 2019 task 15 is not drawn as printed: ' + t); });
    if(q.ans !== 7 || Q.answers(q).join() !== '7') throw new Error('Салабашев 2019 task 15: the cards give ' + q.ans + ', the key says 7');
  }
  pin('Салабашев 2022 task 9', 'sal-2022-2', 351, g => g.shape === 'word' && g.C === 3 && g.word === 'МЕД', ['По колко начина може да се прочете думата МЕД на рисунката долу?'], 17);
  pin('Салабашев 2023 task 9', 'sal-2023-2', 149, g => g.shape === 'span' && g.form === 0 && g.h === 13 && g.m === 15 && g.m2 === 50 && g.who === 0, ['Милазапочналадачетекнигав13:15ч.испряладачетев14:50ч.КолкоминутиечелаМила?'], 95);
  pin('Салабашев 2024 task 4', 'sal-2024-2', 149, g => g.shape === 'span' && g.form === 1 && g.h === 7 && g.m === 32 && g.m2 === 41 && g.who === 0, ['Тази сутрин Ема свири на пиано от 07:32 часа до 08:41 часа. Колко минути е свирила на пиано Ема тази сутрин?'], 69);
  pin('Салабашев 2023 task 14', 'sal-2023-2', 476, g => g.D === 87 && g.d === 4, ['За надписване на номерата на страниците на една книга от първата до последната използвали 87 цифри. Колко пъти е използвана цифрата 4?'], 14);
  pin('Салабашев 2024 task 14', 'sal-2024-2', 485, g => JSON.stringify(g.cards) === '[[3,4],[5,6]]', ['На една картичка от едната страна пише 3, а от другата – 4. На друга картичка от едната страна пише 5, а от другата – 6.', 'Картичките могат да се въртят и обръщат. Колко от двуцифрените числа могат да се запишат с тези две картички?'], 12);
  pin('Салабашев 2025 task 2', 'sal-2025-2', 480, g => g.from[0] === 'ноември' && g.g === 29 && g.gd === 5 && g.day.nm === 'събота', ['Тази година 29 ноември е събота. На колко е равен сборът на датите на всички съботи през месец декември тази година?'], 66);
  // 2025 #6: the four options are the four towns, the picked one Пловдив (А)
  pin('Салабашев 2025 task 6', 'sal-2025-2', 482, g => g.A === 2 && g.B === 1 && g.Y === 1 && g.Z === 3 && g.ask === 3, ['Родните градове на Валя, Петя, Рая и Соня са Варна, Пловдив, Русе и София в някакъв ред. Родният град на никоя от тях не започва с първата буква на името ѝ. Рая никога не е карала ски; тя понякога ходи на гости на пловдивчанката. Петя и софиянката често карат заедно ски. От кой град е Соня?'],
    q => q.options[q.pick].text[0] === 'Пловдив' && q.options.map(o => o.text[0]).sort().join() === 'Варна,Пловдив,Русе,София');
  pin('Салабашев 2025 task 13', 'sal-2025-2', 478, g => !g.odd && !g.big, ['Кой е най-малкият възможен сбор на три четни двуцифрени числа, чиито шест цифри са различни помежду си?'], 70);
  pin('Салабашев 2025 task 14', 'sal-2025-2', 477, g => g.k === 2, ['Цифрата 8 има две овалчета, цифрите 0, 6 и 9 имат по едно овалче, а останалите цифри нямат овалчета. Колко от двуцифрените числа имат точно по две овалчета?'], 18);
  pin('Салабашев 2025 task 15', 'sal-2025-2', 481, g => g.who === 0 && g.cols.join() === '0,1,2' && g.n.join() === '4,10,6', ['В шкафа си Тони има 4 еднакви сини, 10 еднакви черни и 6 еднакви сиви чорапа. Колко най-малко чорапи трябва да извади от шкафа си със затворени очи Тони, за да е сигурен, че сред извадените ще има поне един чифт чорапи от един цвят и поне един чифт от друг цвят?'], 13);

  const n = {}, count = k => n[k] = (n[k] || 0) + 1;
  const NEW_SHAPE = { 102:'games', 149:'span', 351:'word' };   // a widened level: the new shape only (the older shapes are other levels' business)
  const seen = (id, f, N = 2000) => { for(let i = 1; i <= N; i++){ const q = Q.seeded(i, () => Q.raw(id)); count(id); if(!NEW_SHAPE[id] || q.shape === NEW_SHAPE[id]) bgUk(q, id); f(q, strip(Q.drawQ(q)), i); } };
  const MON = { януари:31, март:31, април:30, май:31, юни:30, юли:31, август:31, септември:30, октомври:31, ноември:30, декември:31 };
  const countDigit = (v, d) => String(v).split(String(d)).length - 1;

  // 475: the month, the year and the two digits read from the words; every date written out and every digit counted, the year's too
  seen(475, (q, t) => {
    const m = t.match(/месец([а-я]+)исегашнатагодина–(\d{4})\.Колкообщо(единици|двойки|тройки)и(единици|двойки|тройки)/);
    if(!m || !MON[m[1]]) fail('475: the question is not read', q);
    const D = { единици:1, двойки:2, тройки:3 }, a = D[m[3]], b = D[m[4]];
    let want = 0; for(let v = 1; v <= MON[m[1]]; v++) want += countDigit(v, a) + countDigit(v, b);
    want += countDigit(m[2], a) + countDigit(m[2], b);
    if(want !== q.ans || Q.answers(q)[0] !== want) fail('475: ' + m[1] + ' ' + m[2] + ' ' + a + ' and ' + b + ' make ' + want, q);
    if(a === b || m[2] < 2019 || m[2] > 2026) fail('475: odd digits or year', q);
    if(q.traps.includes(q.ans)) fail('475: a slip is the answer', q);
  });
  // 476: the pages from the digits — exactly one last page; the digit counted over every page
  seen(476, (q, t) => {
    const m = t.match(/използвали(\d+)цифри\.Колкопътиеизползванацифрата(\d)\?/);
    if(!m) fail('476: the question is not read', q);
    const D = +m[1], d = +m[2], last = [];
    for(let N = 1, used = 0; used <= D; N++){ used += String(N).length; if(used === D) last.push(N); }
    if(last.length !== 1) fail('476: the digits do not end a page', q);
    let want = 0; for(let v = 1; v <= last[0]; v++) want += countDigit(v, d);
    if(want !== q.ans || Q.answers(q)[0] !== want || want < 4) fail('476: ' + D + ' digits, the digit ' + d + ' is used ' + want, q);
    // the worked line lands on the pages before the count
    if(strip(Q.why(q, true)).indexOf('=' + last[0]) < 0) fail('476: the last page is not worked out', q);
  });
  // 477: every two-digit number written out and its ovals added (8 = 2; 0, 6, 9 = 1), as the task says
  seen(477, (q, t) => {
    if(t.indexOf('Цифрата8имадвеовалчета,цифрите0,6и9имат поедноовалче,аостаналитецифринямат овалчета.'.replace(/\s+/g, '')) < 0) fail('477: the weights are not stated', q);
    const m = t.match(/иматточнопо(едно|две|три)овалче/), k = { едно:1, две:2, три:3 }[m && m[1]];
    let want = 0; for(let v = 10; v <= 99; v++){ const o = c => c === '8' ? 2 : '069'.includes(c) ? 1 : 0; if(o(String(v)[0]) + o(String(v)[1]) === k) want++; }
    if(want !== q.ans || Q.answers(q)[0] !== want || !k) fail('477: ' + k + ' ovals make ' + want, q);
    const w = strip(Q.why(q, true)); if(!w.endsWith(want + '') ) fail('477: the worked line does not end on the count', q);
  }, 600);
  // 478: three even (or odd) two-digit numbers with six different digits: every triple tried, the smallest (or largest) sum
  const best = {};
  seen(478, (q, t) => {
    const odd = t.indexOf('нечетни') >= 0, big = t.indexOf('най-големият') >= 0, key = odd + '' + big;
    if(!best[key]){
      const nums = []; for(let v = 10; v <= 99; v++) if(v % 2 === (odd ? 1 : 0) && String(v)[0] !== String(v)[1]) nums.push(v);
      let b = null;
      for(let i = 0; i < nums.length; i++) for(let j = i + 1; j < nums.length; j++) for(let k = j + 1; k < nums.length; k++){
        const ds = String(nums[i]) + nums[j] + nums[k];
        if(new Set(ds).size !== 6) continue;
        const s = nums[i] + nums[j] + nums[k];
        if(b === null || (big ? s > b : s < b)) b = s;
      }
      best[key] = b;
    }
    if(best[key] !== q.ans || Q.answers(q)[0] !== q.ans) fail('478: the ' + (big ? 'largest' : 'smallest') + ' sum of three ' + (odd ? 'odd' : 'even') + ' numbers is ' + best[key], q);
    // the worked line's three numbers: even/odd, all six digits different, adding up to the answer
    if(q.wit.reduce((s, v) => s + v, 0) !== q.ans || new Set(q.wit.join('')).size !== 6 || q.wit.some(v => v % 2 !== (odd ? 1 : 0))) fail('478: the worked numbers do not fit the task', q);
  });
  // 479: the fighters named in the task, a weapon each group; every pair of the N tried
  seen(479, (q, t) => {
    // the names: capitalised words between the bullet's group word and «, който/които/което»
    const bullets = Q.drawQ(q).split(/<br>|<div class="given"[^>]*>/).filter(x => x.indexOf('•') >= 0).map(x => strip(x));
    if(bullets.length !== 3) fail('479: three groups expected', q);
    const people = bullets.map((b, g) => {
      const mm = b.match(/^•(?:джуджето|джуджетата|елфът|елфите|човекът|хората)(.*?),(?:което|които|който)/);
      if(!mm) throw new Error('479: bullet not read ' + b);
      const names = mm[1].split(/,|и(?=[А-Я])/).filter(Boolean);
      return names.map(x => [g, x]);
    });
    const all = people.flat();
    if(new Set(all.map(p => p[1])).size !== all.length) fail('479: two fighters share a name', q);
    const N = all.length, word = t.match(/начинаот([а-я]+)можем/)[1];
    if({ петимата:5, шестимата:6, седмината:7 }[word] !== N) fail('479: the number of fighters in the question is not the number named', q);
    let want = 0; for(let i = 0; i < N; i++) for(let j = i + 1; j < N; j++) if(all[i][0] !== all[j][0]) want++;
    if(want !== q.ans || Q.answers(q)[0] !== want) fail('479: ' + want + ' pairs of different weapons', q);
    if(q.traps.includes(q.ans)) fail('479: a slip is the answer', q);
    if(/·|×/.test(Q.why(q, true) + Q.eqText(q) + Q.why(q, false))) fail('479: a times sign in the solution', q);
  }, 2000);
  // 480: the weekday of the stated date worked on to the next month by a count of days, every date of the asked weekday listed and added
  const WD = ['понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота', 'неделя'], PL = { понеделници:0, вторници:1, сряди:2, четвъртъци:3, петъци:4, съботи:5, недели:6 };
  seen(480, (q, t) => {
    const m = t.match(new RegExp('Тазигодина(\\d+)(' + Object.keys(MON).join('|') + ')е(' + WD.join('|') + ')\\.Наколкоеравенсборътнадатитенавсички(' + Object.keys(PL).join('|') + ')презмесец(' + Object.keys(MON).join('|') + ')тазигодина\\?'));
    if(!m || !MON[m[2]] || !MON[m[5]]) fail('480: the question is not read', q);
    const mons = Object.keys(MON), at = mons.indexOf(m[2]);
    if(mons[at + 1] !== m[5]) fail('480: the months are not neighbours', q);
    const g = +m[1], w = WD.indexOf(m[3]), want = PL[m[4]];
    if(g < MON[m[2]] - 3 || g > MON[m[2]] || w < 0 || want === undefined) fail('480: date or weekday out of range', q);
    let sum = 0, k = 0;
    for(let x = 1; x <= MON[m[5]]; x++){ if((w + (MON[m[2]] - g) + x) % 7 === want){ sum += x; k++; } }
    if(sum !== q.ans || Q.answers(q)[0] !== sum || k < 4 || k > 5) fail('480: the dates add up to ' + sum, q);
    if(strip(Q.why(q, true)).indexOf(sum + '') < 0) fail('480: the worked line is missing the sum', q);
  }, 3000);
  // 481: every hand of m socks tried: the smallest m with two colours holding a pair in every hand; the picture's socks counted by colour
  seen(481, (q, t) => {
    const lots = [...t.matchAll(/(\d+)еднакви([а-я]+?)(?=,|и\d|чорапа)/g)].map(x => +x[1]);
    if(lots.length < 2 || lots.length !== q.n.length || lots.join() !== q.n.join()) fail('481: the socks are not read: ' + lots, q);
    const T = lots.reduce((s, v) => s + v, 0);
    let ok = 0;
    for(let m = 1; m <= T && !ok; m++){
      let good = true;
      const hand = (i, left, pairs) => {
        if(!good) return;
        if(i === lots.length){ if(left === 0 && pairs < 2) good = false; return; }
        for(let x = 0; x <= Math.min(lots[i], left); x++) hand(i + 1, left - x, pairs + (x >= 2 ? 1 : 0));
      };
      hand(0, m, 0);
      if(good) ok = m;
    }
    if(ok !== q.ans || Q.answers(q)[0] !== ok) fail('481: ' + lots + ' socks need ' + ok, q);
    const svg = Q.drawQ(q), fills = {}; [...svg.matchAll(/<path d="M[^"]*" fill="([^"]*)" stroke="var\(--ink\)" stroke-width="1.3"/g)].forEach(x => fills[x[1]] = (fills[x[1]] || 0) + 1);
    if(Object.values(fills).sort((a, b) => a - b).join() !== lots.slice().sort((a, b) => a - b).join()) fail('481: the picture holds other socks than the task: ' + JSON.stringify(fills), q);
    if(new Set(lots).size !== lots.length || lots.some(v => v < 2)) fail('481: a colour with fewer than two socks, or two lots alike', q);
  }, 3000);
  // 482: the clues read back from the words, every way to give the four towns out tried: the asked girl's town is the same in all, and is the picked option
  const GIRLS = ['Валя', 'Петя', 'Рая', 'Соня'], TOWNS = ['Варна', 'Пловдив', 'Русе', 'София'], ADJ = ['варненката', 'пловдивчанката', 'русенката', 'софиянката'];
  seen(482, (q, t) => {
    const m = t.match(/(Валя|Петя|Рая|Соня)никоганеекараласки;тяпонякогаходинагостина([а-я]+)\.(Валя|Петя|Рая|Соня)и([а-я]+)честокаратзаедноски\.Откойграде(Валя|Петя|Рая|Соня)\?/);
    if(!m) fail('482: the clues are not read: ' + t, q);
    const A = GIRLS.indexOf(m[1]), Y = ADJ.indexOf(m[2]), B = GIRLS.indexOf(m[3]), Z = ADJ.indexOf(m[4]), X = GIRLS.indexOf(m[5]);
    if(A < 0 || Y < 0 || B < 0 || Z < 0 || A === B) fail('482: clue not understood', q);
    const fits = []; const perm = (a, rest) => { if(!rest.length){ fits.push(a); return; } rest.forEach((c, i) => perm(a.concat(c), rest.filter((_, j) => j !== i))); }; perm([], [0, 1, 2, 3]);
    const ok = fits.filter(p => p.every((c, g) => c !== g) && p[A] !== Y && p[A] !== Z && p[B] !== Z);   // not her own letter; A visits the Y-girl and never skis (the Z-girl does); B skis with the Z-girl
    if(!ok.length || ok.some(p => p[X] !== ok[0][X])) fail('482: the asked girl\'s town is not the only one: ' + JSON.stringify(ok), q);
    const o = q.options.map(x => x.text[0]);
    if(o.slice().sort().join() !== TOWNS.slice().sort().join() || o[q.pick] !== TOWNS[ok[0][X]] || Q.answers(q)[0] !== q.pick) fail('482: the picked option is not ' + TOWNS[ok[0][X]], q);
    if(q.options.map(x => x.text[1]).join() === o.join() && TOWNS.indexOf('София') >= 0 && o.indexOf('София') >= 0 && q.options.some(x => x.text[1] === 'Софія') === false) fail('482: the Ukrainian options are not translated', q);
    // the worked line names her town
    if(strip(Q.why(q, true)).indexOf(TOWNS[ok[0][X]]) < 0) fail('482: the solution does not reach her town', q);
  }, 3000);
  // 483: the name's letters sorted into vowels and consonants; none of Ъ, Ь, Й, Ю, Я
  seen(483, (q, t) => {
    const m = t.match(/името:([А-Я]+)([А-Я]+)/);
    if(!m) fail('483: the name is not read', q);
    const ls = [...m[1] + m[2]];
    if(ls.some(c => 'ЪЬЙЮЯ'.includes(c))) fail('483: a letter the two languages sort differently', q);
    const v = ls.filter(c => 'АЕИОУ'.includes(c)).length, c = ls.length - v, more = t.indexOf('съгласнитесаповечеотгласните') >= 0;
    if(more !== (c > v) || Math.abs(c - v) !== q.ans || Q.answers(q)[0] !== q.ans || !q.ans) fail('483: the difference is ' + (c - v), q);
    // the Ukrainian text keeps the Bulgarian name as written
    if(uk(() => strip(Q.drawQ(q))).indexOf(m[1] + m[2]) < 0) fail('483: the Ukrainian text changed the name', q);
  });
  // 484: every deal that fits the statements — each boy's three cards the said ones with one lowered by 1, none shared — leaves the same card on the table
  seen(484, (q, t) => {
    const says = [...t.matchAll(/Азвзех(\d+),(\d+)и(\d+)\./g)].map(x => x.slice(1, 4).map(Number)), N = (t.match(/числатаот1до(\d+)\./) || [])[1];
    if(says.length < 2 || !N || 3*says.length + 1 !== +N) fail('484: the statements are not read: ' + says, q);
    const lefts = new Set();
    const deal = (b, used) => {
      if(b === says.length){ for(let c = 1; c <= +N; c++) if(!used.has(c)) lefts.add(c); return; }
      for(let i = 0; i < 3; i++){
        const own = says[b].map((v, k) => k === i ? v - 1 : v);
        if(own.some(v => v < 1) || new Set(own).size !== 3 || own.some(v => used.has(v))) continue;
        deal(b + 1, new Set([...used, ...own]));
      }
    };
    deal(0, new Set());
    if(lefts.size !== 1 || [...lefts][0] !== q.ans || Q.answers(q)[0] !== q.ans || Q.cardSaidLeft(+N, says) !== q.ans) fail('484: the cards left over are ' + [...lefts], q);
    if(says.flat().some(v => v > +N)) fail('484: a number past the last card is said', q);
    const svg = Q.drawQ(q); if((svg.match(/<rect /g) || []).length !== +N) fail('484: the picture holds other cards than the task', q);
  }, 3000);
  const answersSeen485 = new Set();
  // 485: the four faces read from the words; every way up of both cards, each digit read as it looks (a turned 6 is 9, a 9 is 6), every number written out
  seen(485, (q, t) => {
    const f = [...t.matchAll(/пише(\d),аот(?:другата|друга)–(\d)/g)].map(x => [+x[1], +x[2]]);
    if(f.length !== 2) fail('485: the faces are not read', q);
    const read = x => x === 6 ? [6, 9] : x === 9 ? [9, 6] : [x], set = new Set();
    [[0, 1], [1, 0]].forEach(([a, b]) => f[a].forEach(x => f[b].forEach(y => read(x).forEach(r => read(y).forEach(s => { if(r) set.add(10*r + s); })))));   // a 0 does not stand first
    if(set.size !== q.ans || Q.answers(q)[0] !== set.size) fail('485: the cards write ' + set.size + ' numbers', q);
    const turning = f.flat().filter(x => x === 6 || x === 9).length;
    if(turning < 1 || turning > 2) fail('485: one or two turning faces expected', q);
    if(q.traps.includes(q.ans)) fail('485: a slip is the answer', q);
    // the picture shows the same four faces, the pair in each card
    const faces = [...Q.drawQ(q).matchAll(/<text[^>]*>(\d)<\/text>/g)].map(x => +x[1]);
    if(faces.join() !== f.flat().join()) fail('485: the picture shows other faces: ' + faces, q);
    answersSeen485.add(q.ans);
  });
  if(answersSeen485.size < 4) throw new Error('485: the cards write the same few counts every time: ' + [...answersSeen485]);
  // 102: the six chess players: every pair counted out as listed
  seen(102, (q, t) => {
    if(q.shape !== 'games') return;
    const w = t.match(/участвали(четири|пет|шест|седем)състезатели/); if(!w) fail('102: games not read', q);
    const N = { четири:4, пет:5, шест:6, седем:7 }[w[1]]; let want = 0; for(let i = 0; i < N; i++) for(let j = i + 1; j < N; j++) want++;
    if(want !== q.ans || Q.answers(q)[0] !== want) fail('102: ' + N + ' players play ' + want, q);
  }, 3000);
  // 351: the word read from the drawn grid, every path counted by walking it
  const letters = html => [...String(html).matchAll(/<text[^>]*>([А-Я])<\/text>/g)].map(x => x[1]);
  seen(351, (q, t) => {
    if(q.shape !== 'word') return;
    const svg = Q.drawQ(q).split('<svg').filter(x => x.indexOf('<rect') >= 0).pop(), cells = letters(svg), C = (String(svg).match(/<rect /g) || []).length / 3, w = t.match(/прочетедумата([А-Я]+)нарисунката/)[1];
    if(C !== q.C || cells.length !== 3*C) fail('351: the grid is not 3 rows of ' + q.C + ' letters', q);
    let paths = 0;
    const walk = (r, c) => { if(cells[r*C + c] !== w[r]) return; if(r === 2){ paths++; return; } for(const d of [-1, 0, 1]) if(c + d >= 0 && c + d < C) walk(r + 1, c + d); };
    for(let c = 0; c < C; c++) walk(0, c);
    if(paths !== q.ans || Q.answers(q)[0] !== paths) fail('351: the word is read ' + paths + ' ways', q);
    const full = Q.why(q, true), cellsFull = [...full.matchAll(/fill="var\(--accent-ink\)"[^>]*>(\d+)<\/text>/g)].map(x => +x[1]);
    if(cellsFull.slice(-C).reduce((s, v) => s + v, 0) !== paths) fail('351: the last row of the solution does not add up to the count', q);
  }, 3000);
  // 149: the two clock times read from the words; the minutes between them counted on the clock
  seen(149, (q, t) => {
    if(q.shape !== 'span') return;
    const ts = [...t.matchAll(/(\d\d):(\d\d)/g)].map(x => 60*x[1] + +x[2]);
    if(ts.length !== 2 || ts[1] <= ts[0] || ts[1] - ts[0] !== q.ans || Q.answers(q)[0] !== q.ans) fail('149: the minutes between the times are ' + (ts[1] - ts[0]), q);
    if(Math.floor(ts[1] / 60) !== Math.floor(ts[0] / 60) + 1) fail('149: the end is not in the next hour', q);
    if(q.traps.includes(q.ans)) fail('149: a slip is the answer', q);
  }, 3000);

  console.log('Салабашев 2 клас, text tasks (S4: 2019 #10 #15, 2021 #9 #12 #13, 2022 #9, 2023 #9 #14, 2024 #4 #14, 2025 #2 #6 #13 #14 #15) pinned as printed (2021 #12 and #13 against our own solution: the sheet has no key); every generator worked out again from its drawn task: ' + JSON.stringify(n));
}
