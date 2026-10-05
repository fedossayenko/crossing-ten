// Runs inside the app's own scope, after the app's scripts (check.js loads it), so it calls
// the generators and helpers directly. Run all checks with: node check.js
// Shared helpers, then every level: thousands of questions each — the answer, the worked line,
// the summary, the hints, both languages — and answer matching.


const strip = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
const lastNum = t => { const m = strip(t).match(/\d+/g); return m ? +m[m.length-1] : NaN; };
let checked = 0; const kinds = {};
// Ukrainian task text must be complete: Bulgarian-only words or letters left in it mean a
// piece was missed (a text made only of shared words such as "5 см" is fine as it is).
const BG_ONLY = new Set(('и е са от колко сбор сбора сборът сбори числата числото цифрите които която който което това тези още какво ' +
  'трябва всеки всяка всяко всички между една един едно има няма със във ако или пресметнете пресметни намерете намери ' +
  'запишете запиши разликата разлика когато тогава защото пъти дни ден седмица месец кога отговор отговора ' +
  'получи получаваме остава останаха прибавяме изваждаме събираме значи тук само също').split(' '));
const SAME = new Set('см дм м мм км кг г л хв а в на не за до'.split(' ').concat([...WM_GIRLS, ...WM_BOYS].map(n => n[0].toLowerCase())));   // units, and the names whomore draws
const words = h => strip(h).replace(/&[a-z]+;/g, ' ').toLowerCase().match(/[а-яёїієґъѝ’'-]+/g) || [];
function inUkrainian(L, q, bgTexts){
  const r0 = RANDS;
  LANG = 'uk';
  const uk = [drawQ(q), eqText(q), why(q, true), why(q, false)];
  LANG = 'bg';
  if(RANDS !== r0) throw new Error('level ' + L + ': drawing the question in Ukrainian drew a random number');
  uk.forEach((u, j) => {
    const bad = words(u).filter(w => !(NOT.letter[L] && w.length === 1) && (/[ъѝыэё]/.test(w) || /^(най|по)-/.test(w) || BG_ONLY.has(w)));
    if(bad.length) throw new Error('level ' + L + ': Bulgarian left in the Ukrainian text (' + bad.join(', ') + '): ' + strip(u));
    if(u === bgTexts[j] && !words(u).every(w => SAME.has(w))) throw new Error('level ' + L + ': a text is not translated: ' + strip(u));
  });
  return uk;
}
// Every level, in the table's order. A rule that does not fit a level is lifted for that level alone,
// with the reason; every other rule still holds for it.
const IDS = LEVELS.map(l => l.id);
const NOT = {
  // the worked line or summary line ends on another number, by design
  lands: { 67:'a note after the answer: (0 също е едноцифрено число)', 68:'the summary ends on the inequality that proves A', 75:'the worked line ends with an example grid',
           76:'two answers, each shown with the sum it leaves', 142:'it counts both triangles and squares, then asks one' },
  // the hint names a number that happens to be the answer
  nudge: { 60:'"0 cannot stand in front" when the product is 0', 64:'the target product, which the question states', 66:'the difference given in the question', 76:'the divisor 3, given in the question' },
  // their А/Б/В/Г questions answer with an option, not a number, and draw no answer box (their other questions keep every rule)
  option: { 63:1, 94:1, 146:1, 147:1, 154:1, 170:1, 177:1, 187:1 },
  // the answer is a letter of a word: a lone «и» there is the letter in САНКИ, not the Bulgarian «и»
  letter: { 94:'the letter asked for' },
};
for(const rule in NOT) for(const id in NOT[rule]) if(!IDS.includes(+id)) throw new Error('check/levels.js lifts ' + rule + ' for level ' + id + ', which does not exist');
for(const L of IDS){
  for(let i = 0; i < 3000; i++){
    const q = raw(L), ans = answer(q);
    if(L >= 8 && !q.kind) throw new Error('level ' + L + ' is not handled by raw() — it fell through to Mixed');
    if(!Number.isInteger(ans) || ans < 0) throw new Error('level ' + L + ' bad answer ' + JSON.stringify(q));
    // plainQ in app.js strips these from every question that is not own: a kind may not keep its data in them
    if(!q.own && ['options', 'pick', 'pts', 'lvl'].some(k => k in q)) throw new Error('level ' + L + ': a question field the app strips (options, pick, pts, lvl) ' + JSON.stringify(q));
    for(const full of [false, true]) if(/undefined|NaN/.test(why(q, full) + eqText(q) + drawQ(q))) throw new Error('level ' + L + ': the hint says undefined or NaN ' + JSON.stringify(q));
    if(!q.kind && (q.op === '-' ? q.a-q.b : q.a+q.b) !== ans) throw new Error('level ' + L + ' arithmetic mismatch');
    if(q.kind){
      kinds[q.kind] = (kinds[q.kind]||0) + 1;
      const ok = [ans].concat(q.alt || []);
      const r0 = RANDS, bg = [drawQ(q), eqText(q), why(q, true), why(q, false)];
      if(RANDS !== r0) throw new Error('level ' + L + ': drawing a question drew a random number');
      // the same rules in both languages: the worked line and summary end on the answer,
      // and the first-miss nudge never gives it away
      [['', bg], [' (Ukrainian)', inUkrainian(L, q, bg)]].forEach(([lang, [, eq, full, nudge]]) => {
        if(!NOT.lands[L] && !(q.own && NOT.option[L]) && ok.indexOf(lastNum(full)) < 0) throw new Error('level ' + L + lang + ': worked line lands on ' + lastNum(full) + ', answer is ' + ans + ' -- ' + JSON.stringify(q));
        if(!NOT.lands[L] && !(q.own && NOT.option[L]) && ok.indexOf(lastNum(eq)) < 0) throw new Error('level ' + L + lang + ': summary line lands on ' + lastNum(eq) + ', answer is ' + ans);
        const nums = (strip(nudge).match(/\d+/g) || []).map(Number);
        if(!NOT.nudge[L] && nums.some(v => ok.indexOf(v) >= 0)) throw new Error('level ' + L + lang + ': the first-miss nudge gives away the answer');
      });
    }
    const boxes = (drawQ(q).match(/class="slot"/g) || []).length;
    if(boxes !== (q.own && NOT.option[L] ? 0 : q.slots || 1)) throw new Error('level ' + L + ' draws ' + boxes + ' answer boxes but wants ' + (q.slots || 1));
    LANG = 'uk'; const ukBoxes = (drawQ(q).match(/class="slot"/g) || []).length; LANG = 'bg';
    if(ukBoxes !== boxes) throw new Error('level ' + L + ' draws ' + ukBoxes + ' answer boxes in Ukrainian, ' + boxes + ' in Bulgarian');
    if((q.alt || []).length && !q.slots) throw new Error('level ' + L + ' has alternatives but only one box');
    checked++;
  }
}
console.log('checked ' + checked + ' questions across ' + IDS.length + ' levels: arithmetic, worked line, summary line and layout all agree, in Bulgarian and in Ukrainian');
console.log('Ukrainian: every worksheet text is translated, none left in Bulgarian, and drawing a question never draws a random number');
console.log('worksheet kinds:', JSON.stringify(kinds));
console.log('80 - 9 ->', answer({a:80,b:9,op:'-'}), '| hint:', strip(why({a:80,b:9,op:'-'}, true)));

// answer matching, including the two-box questions
const one = {kind:'t', ans:7}, two = {kind:'t', ans:18, alt:[14], slots:2};
[[one,['7'],true],[one,['8'],false],[one,['07'],true],
 [two,['14','18'],true],[two,['18','14'],true],[two,['14','14'],false],
 [two,['18','18'],false],[two,['14','15'],false],[two,['14'],false],[two,['14','18','9'],false]
].forEach(([q,parts,want]) => {
  if(accepts(q, parts) !== want) throw new Error('accepts(' + JSON.stringify(parts) + ') should be ' + want);
});
console.log('answer matching: order-free, no duplicates, every box required');
