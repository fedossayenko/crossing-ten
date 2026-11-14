// Runs beside the app (in check.js's own scope, through eval), like check/ach-C.js.
// Европейско Кенгуру, 2 клас — order and position, builder A: 310 between and last (2019 #5, 2023 #21), 311 from one to the other
// (2025 #14), 312 the tallest (2021 #6), 313 the swaps (2025 #15), 314 the figures in a row (2025 #2), 315 both lie (2026 #22),
// 316 the shelf it is not (2021 #24). Each printed task is checked against the official key, drawn as printed and asked by its
// level (a task whose answer is a picture or a name: its right option is read back); then every generator is worked out again
// another way, from the Bulgarian text it draws.
{
  const Q = APP;
  const strip = h => String(h).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, '');
  const text = q => String(Q.drawQ(q)).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const fail = (m, q) => { throw new Error(m + ' ' + JSON.stringify(q)); };
  // fields: what makes it the printed question; shows: pieces of the printed wording; key: the official answer (the option's words, or the number)
  const pin = (name, tag, id, fields, shows, key) => {
    const sig = g => JSON.stringify(fields.map(f => g[f.k])), want = JSON.stringify(fields.map(f => f.v));
    const hit = pinSeed(name, () => Q.raw(id), g => sig(g) === want ? 2 : 0, 2e7);
    if(!hit) throw new Error(name + ': level ' + id + ' never asks it');
    const q = hit.q, t = strip(Q.drawQ(q));
    shows.forEach(s => { if(t.indexOf(s.replace(/\s+/g, '')) < 0) throw new Error(name + ' is not drawn as printed: ' + t); });
    if(!Q.LEVELS.find(l => l.id === id).papers.includes(tag)) throw new Error('level ' + id + ' is not tagged ' + tag);
    if(q.own){
      const got = (q.options[q.pick].text[0].match(/aria-label="([^"]*)"/) || [0, strip(q.options[q.pick].text[0])])[1].replace(/\s+/g, '');
      if(got !== key.replace(/\s+/g, '')) throw new Error(name + ': the right option is ' + got + ', the key says ' + key);
    } else {
      if(Q.answers(q).join() !== String(key)) throw new Error(name + ': gives ' + Q.answers(q) + ', the key says ' + key);
      if(!Q.accepts(q, [String(key)])) throw new Error(name + ': the key is not accepted');
    }
  };
  const f = (k, v) => ({ k, v });
  pin('Кенгуру 2019 task 5', 'ek-2019-2', 310, [f('shape', 'between'), f('story', 0), f('who', 0), f('n', 12), f('a', 7), f('b', 2)],
    ['На входа на зоологическата градина има опашка от 12 деца. Лъчо е седми по ред от началото на опашката, а Кирчо е втори от края. Колко деца има на опашката между Лъчо и Кирчо?'], 3);
  pin('Кенгуру 2023 task 21', 'ek-2023-2', 310, [f('shape', 'last'), f('story', 0), f('who', 0), f('k', 3), f('m', 3)],
    ['Ема заела трето място в състезание за девойки по индивидуални танци. Между нея и последната класирана имало 3 танцьорки. Колко са били участничките в състезанието?'], 7);
  pin('Кенгуру 2025 task 14', 'ek-2025-2', 311, [f('shape', 'span'), f('who', 0), f('n', 12), f('a', 5), f('b', 4)],
    ['ученици са подредени в редица. Ако сме с лице към редицата и броим отляво надясно, Георги е пети в редицата, а ако броим отдясно наляво, Виктор е четвърти. Кой по ред е Виктор, ако започнем да броим от Георги към Виктор?'], 5);
  pin('Кенгуру 2021 task 6', 'ek-2021-2', 312, [f('shape', 'high'), f('story', 0), f('c', [0, 1, 2, 5])],
    ['Четири кули са различно оцветени. Розовата кула е по-висока от червената, но е по-ниска от зелената. Сребърната кула е по-висока от зелената. Какъв цвят е най-високата кула?'], 'сребърен');
  pin('Кенгуру 2025 task 15', 'ek-2025-2', 313, [f('cols', [0, 1, 2]), f('s1', [0, 2]), f('s2', [2, 1])],
    ['Три книги: бяла, черна и сива са подредени отляво надясно, както е показано. Ако размените местата на бялата и сивата книга, а след това размените местата на сивата и черната книга, какво ще е подреждането на книгите отляво надясно?'], 'черна,сива,бяла');
  pin('Кенгуру 2025 task 2', 'ek-2025-2', 314, [f('f', [0, 1, 2, 3]), f('mid', [2, 1]), f('l', 1), f('r', 3), f('right', true)],
    ['Подредете в редичка една след друга четири фигурки: квадратче, кръгче, ромбче и триъгълниче, така че ромбчето и кръгчето да не са нито в началото, нито в края на редичката, а триъгълничето да е непосредствено вдясно от кръгчето. Коя от редичките по-долу отговаря на тези условия?'], 'квадратче,ромбче,кръгче,триъгълниче');
  pin('Кенгуру 2026 task 22', 'ek-2026-2', 315, [f('kids', [0, 1, 2]), f('place', 0), f('say', [{ k:0, type:0, t:1 }, { k:2, type:2, t:0 }])],
    ['Ачо, Дарко и Марко пристигнали във фитнеса по различно време. Ачо казал: „Аз пристигнах пръв.“ Марко казал: „Аз пристигнах преди Ачо.“ Ако и двете момчета лъжат, в какъв ред са пристигнали тримата?'], 'Дарко, Ачо, Марко');
  pin('Кенгуру 2021 task 24', 'ek-2021-2', 316, [f('roles', [0, 1, 2, 4, 3]), f('down', false), f('above', true)],
    ['Стоян подредил книгата, топката, конструктора, пъзела и калкулатора, които получил от Дядо Коледа, по един подарък на всяко от петте рафтчета на шкафа вдясно.',
      'Топката е по-високо от книгата и по-ниско от конструктора, а калкулаторът е непосредствено над топката.', 'Кой е номерът на рафтчето, за което можем да бъдем сигурни, че на него не е поставен пъзелът?'], 3);

  const perms = a => a.length < 2 ? [a] : a.flatMap((x, i) => perms(a.filter((_, j) => j !== i)).map(p => [x].concat(p)));
  // 310 / 311 again: lay the children out and count
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(310 + (i % 2))), t = text(q);
    if(q.shape === 'cars') continue;   // Салабашев 2024 #12: check/sal-S2.js
    if(q.shape === 'between'){
      const m = t.match(/опашка от (\d+) деца\. (\S+) е (\S+) по ред от началото на опашката, а (\S+) е (\S+) от края\. Колко деца има на опашката между (\S+) и (\S+)\?/);
      if(!m) fail('310: cannot read', t);
      const ord = w => ['', 'първи', 'втори', 'трети', 'четвърти', 'пети', 'шести', 'седми', 'осми', 'девети'].indexOf(w), n = +m[1], A = ord(m[3]), B = n + 1 - ord(m[5]);
      if(m[2] !== m[6] || m[4] !== m[7] || A < 1 || B - A - 1 !== q.ans || A >= B) fail('310: between is not the answer', q);
    } else if(q.shape === 'last'){
      const m = t.match(/ заела (\S+) място .* имало (\d+) (?:танцьорки|бегачки)\./);
      if(!m) fail('310: cannot read', t);
      const k = ['', 'първо', 'второ', 'трето', 'четвърто', 'пето', 'шесто', 'седмо', 'осмо', 'девето'].indexOf(m[1]), last = k + 1 + +m[2];   // her place, those between, the last
      if(k < 1 || last !== q.ans) fail('311: the field is not the answer', q);
    } else {
      const m = t.match(/^(\d+) ученици .* (\S+) е (\S+) в редицата, а ако броим отдясно наляво, (\S+) е (\S+)\./);
      if(!m) fail('311: cannot read', t);
      const ord = w => ['', 'първи', 'втори', 'трети', 'четвърти', 'пети', 'шести', 'седми', 'осми', 'девети'].indexOf(w), n = +m[1], X = ord(m[3]), Y = n + 1 - ord(m[5]);
      if(X < 1 || Y <= X || Y - X + 1 !== q.ans) fail('311: counting from the first is not the answer', q);
    }
    if(q.traps.includes(q.ans)) fail('310: a slip is the answer', q);
  }
  // 312 again: read the clues from the text and try every height order
  const HC = { 'червената':'червен', 'розовата':'розов', 'зелената':'зелен', 'синята':'син', 'жълтата':'жълт', 'сребърната':'сребърен' };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(312)), t = text(q), cons = [];   // [taller, lower]
    const col = w => { const c = HC[w.toLowerCase()]; if(!c) fail('312: unknown colour ' + w, t); return c; };
    const s = t.match(/(\S+) (?:кула|свещ) е по-(висока|ниска) от (\S+?)(?:, но е по-(висока|ниска) от (\S+?))?\. (\S+) (?:кула|свещ) е по-(висока|ниска) от (\S+?)\./);
    if(!s) fail('312: cannot read', t);
    const up = (x, w, y) => w === 'висока' ? cons.push([col(x), col(y)]) : cons.push([col(y), col(x)]);
    up(s[1], s[2], s[3]); if(s[4]) up(s[1], s[4], s[5]); up(s[6], s[7], s[8]);
    const names = [...new Set(cons.flat())], low = /най-ниската|найнижча/.test(t);
    if(names.length !== 4) fail('312: not four colours', t);
    const ok = perms(names).filter(p => cons.every(([hi, lo]) => p.indexOf(hi) > p.indexOf(lo)));   // lowest first
    const ends = new Set(ok.map(p => p[low ? 0 : 3]));
    if(ends.size !== 1 || strip(q.options[q.pick].text[0]) !== [...ends][0] || q.options.length !== 5 || strip(q.options[4].text[0]) !== 'не е възможно да се определи'.replace(/\s+/g, '')) fail('312: the right option is not the only one that fits', q);
  }
  // 313 again: do the swaps by colour on the row read from the text
  const SC = { 'бяла':'бяла', 'бялата':'бяла', 'черна':'черна', 'черната':'черна', 'сива':'сива', 'сивата':'сива', 'червена':'червена', 'червената':'червена', 'синя':'синя', 'синята':'синя', 'зелена':'зелена', 'зелената':'зелена', 'жълта':'жълта', 'жълтата':'жълта' };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(313)), t = text(q);
    const m = t.match(/Три книги: (\S+), (\S+) и (\S+) са .* на (\S+) и (\S+) книга, а след това размените местата на (\S+) и (\S+) книга/);
    if(!m) fail('313: cannot read', t);
    let row = [m[1], m[2], m[3]].map(w => SC[w]);
    [[m[4], m[5]], [m[6], m[7]]].forEach(([x, y]) => { const a = SC[x], b = SC[y]; row = row.map(c => c === a ? b : c === b ? a : c); });
    const lab = q.options[q.pick].text[0].match(/aria-label="([^"]*)"/)[1];
    if(lab !== row.join(', ')) fail('313: the right option is not the row after the swaps: ' + row, q);
    if(new Set(q.options.map(o => o.text[0])).size !== 5) fail('313: options repeat', q);
  }
  // 314 again: read the clues from the text and try every row
  const FN = { 'квадратчето':'квадратче', 'кръгчето':'кръгче', 'ромбчето':'ромбче', 'триъгълничето':'триъгълниче', 'петоъгълничето':'петоъгълниче' };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(314)), t = text(q);
    const m = t.match(/фигурки: (.*), така че (\S+) и (\S+) да не са нито в началото, нито в края на редичката, а (\S+) да е непосредствено (вдясно|вляво) от (\S+)\./);
    if(!m) fail('314: cannot read', t);
    const all = m[1].replace(' и ', ', ').split(', '), mid = [FN[m[2]], FN[m[3]]], x = FN[m[4]], y = FN[m[6]], right = m[5] === 'вдясно';
    const ok = perms(all).filter(p => mid.every(c => p.indexOf(c) % 3 !== 0) && p.indexOf(x) - p.indexOf(y) === (right ? 1 : -1));
    const lab = q.options[q.pick].text[0].match(/aria-label="([^"]*)"/)[1];
    if(ok.length !== 1 || ok[0].join(', ') !== lab || new Set(q.options.map(o => o.text[0])).size !== 5) fail('314: the picked row is not the only one that fits ' + ok.join(' | '), q);
  }
  // 315 again: read the two statements and try every order
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(315)), t = text(q);
    const m = t.match(/^(\S+), (\S+) и (\S+) пристигнали .*? по различно време\. (\S+) казал: „(.*?)“ (\S+) казал: „(.*?)“ Ако/);
    if(!m) fail('315: cannot read', t);
    const kids = [m[1], m[2], m[3]], say = [[m[4], m[5]], [m[6], m[7]]];
    const said = (who, st, order) => {
      const at = order.indexOf(who);
      if(st === 'Аз пристигнах пръв.') return at === 0;
      if(st === 'Аз пристигнах последен.') return at === 2;
      const mm = st.match(/^Аз пристигнах (преди|след) (\S+)\.$/);
      if(!mm) fail('315: unknown statement ' + st, t);
      return mm[1] === 'преди' ? at < order.indexOf(mm[2]) : at > order.indexOf(mm[2]);
    };
    const ok = perms(kids).filter(p => say.every(([w, st]) => !said(w, st, p)));
    if(say[0][0] === say[1][0] || ok.length !== 1 || strip(q.options[q.pick].text[0]) !== ok[0].join(',')) fail('315: the picked order is not the only one that lies both: ' + ok.join(' | '), q);
    if(new Set(q.options.map(o => strip(o.text[0]))).size !== 5) fail('315: options repeat', q);
  }
  // 316 again: read the clues from the text and try every arrangement
  const GN = { 'книгата':'книга', 'топката':'топка', 'конструктора':'конструктор', 'конструкторът':'конструктор', 'пъзела':'пъзел', 'пъзелът':'пъзел', 'калкулатора':'калкулатор', 'калкулаторът':'калкулатор', 'часовника':'часовник', 'часовникът':'часовник', 'робота':'робот', 'роботът':'робот' };
  for(let i = 1; i <= 3000; i++){
    const q = Q.seeded(i, () => Q.raw(316)), t = text(q);
    const m = t.match(/Стоян подредил (.*), които получил .* отдолу нагоре\. (\S+) е по-(високо|ниско) от (\S+) и по-(високо|ниско) от (\S+), а (\S+) е непосредствено (над|под) (\S+)\. Кой е номерът на рафтчето, за което можем да бъдем сигурни, че на него не е поставена? (\S+)\?/);
    if(!m) fail('316: cannot read', t);
    const items = m[1].replace(' и ', ', ').split(', ').map(w => GN[w]), B = GN[m[2].toLowerCase()], A = GN[m[4]], C = GN[m[6]], D = GN[m[7]], E = GN[m[10]];
    if(new Set(items).size !== 5 || m[3] === m[5]) fail('316: items', t);
    const tallerThanA = m[3] === 'високо';   // B is higher than A, lower than C — or the other way
    const ok = perms(items).filter(p => { const at = x => p.indexOf(x) + 1; return (tallerThanA ? at(A) < at(B) && at(B) < at(C) : at(A) > at(B) && at(B) > at(C)) && at(D) === at(B) + (m[8] === 'над' ? 1 : -1); });
    const free = new Set(ok.map(p => p.indexOf(E) + 1)), never = [1, 2, 3, 4, 5].filter(s => !free.has(s));
    if(never.length !== 1 || never[0] !== q.ans || q.traps.includes(q.ans)) fail('316: the shelf it is not is ' + never, q);
  }
  console.log('Кенгуру 2 клас, order and position (310–316): 2019 #5, 2023 #21, 2025 #14, 2021 #6, 2025 #15, 2025 #2, 2026 #22, 2021 #24 match the official key and are asked by their levels; each generator worked out again from its own text by trying every order');
}
