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
const SAME = new Set('см дм м мм кг г л хв а в на не за до'.split(' '));
const words = h => strip(h).replace(/&[a-z]+;/g, ' ').toLowerCase().match(/[а-яёїієґъѝ’'-]+/g) || [];
function inUkrainian(L, q, bgTexts){
  const r0 = RANDS;
  LANG = 'uk';
  const uk = [drawQ(q), eqText(q), why(q, true), why(q, false)];
  LANG = 'bg';
  if(RANDS !== r0) throw new Error('level ' + L + ': drawing the question in Ukrainian drew a random number');
  uk.forEach((u, j) => {
    const bad = words(u).filter(w => /[ъѝыэё]/.test(w) || /^(най|по)-/.test(w) || BG_ONLY.has(w));
    if(bad.length) throw new Error('level ' + L + ': Bulgarian left in the Ukrainian text (' + bad.join(', ') + '): ' + strip(u));
    if(u === bgTexts[j] && !words(u).every(w => SAME.has(w))) throw new Error('level ' + L + ': a text is not translated: ' + strip(u));
  });
  return uk;
}
const IDS = [1,2,7,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,95,96,97,98,99,100,101,120,121,122,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141];
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
        if(ok.indexOf(lastNum(full)) < 0) throw new Error('level ' + L + lang + ': worked line lands on ' + lastNum(full) + ', answer is ' + ans + ' -- ' + JSON.stringify(q));
        if(ok.indexOf(lastNum(eq)) < 0) throw new Error('level ' + L + lang + ': summary line lands on ' + lastNum(eq) + ', answer is ' + ans);
        const nums = (strip(nudge).match(/\d+/g) || []).map(Number);
        if(nums.some(v => ok.indexOf(v) >= 0)) throw new Error('level ' + L + lang + ': the first-miss nudge gives away the answer');
      });
    }
    const boxes = (drawQ(q).match(/class="slot"/g) || []).length;
    if(boxes !== (q.slots || 1)) throw new Error('level ' + L + ' draws ' + boxes + ' answer boxes but wants ' + (q.slots || 1));
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
