/* ---------- multiple choice ----------
   Any one-box question can be asked as А/Б/В/Г instead of typed. The options are made when
   the round is built, never when it is drawn: the right answer plus wrong ones taken from the
   slips she is likely to make (a ten lost or gained at the crossing, flipped digits, the other
   operation, one off). q.options is [{id, v}] in order of size, as on a paper, and q.pick is
   the id of the right one; how many there are comes from the data, not from the screen. */
const LETTERS = { bg:'АБВГДЕ', uk:'АБВГДЕ', en:'ABCDEF' };
function withChoices(q, n = 4){
  if(q.own) return q;                                        // a kind that brings its own options
  if((q.slots || 1) > 1 || !Number.isInteger(answer(q))) return q;
  const x = answer(q), cand = [];
  const add = v => { if(Number.isInteger(v) && v >= 0 && v !== x && cand.indexOf(v) < 0 && !accepts(q, [String(v)])) cand.push(v); };
  (q.traps || []).forEach(add);                             // the kind's own likeliest slip, e.g. left to right
  const nt = cand.length;
  add(x + 10); add(x - 10);
  if(x >= 10 && x < 100 && x % 10 !== Math.floor(x / 10) % 10 && x % 10) add((x % 10) * 10 + Math.floor(x / 10));
  if(!q.kind) add(q.op === '-' ? q.a + q.b : q.a - q.b);
  [1, -1, 2, -2, 5, -5].forEach(d => add(x + d));
  for(let k = 3; cand.length < n - 1; k++) add(x + k);
  // the likeliest slips first, but not always the same ones, so the right answer's place gives nothing away
  const wrong = cand.slice(0, Math.min(nt, n - 1)).concat(shuffle(cand.slice(nt, nt + 6))).slice(0, n - 1);   // a kind's own trap always stays
  const vals = wrong.concat(x).sort((a, b) => a - b);
  return Object.assign({}, q, { options: vals.map((v, id) => ({ id, v })), pick: vals.indexOf(x) });
}
// crossed: the ids already tried and wrong; right: show which one it was
function choiceHtml(q, crossed, right, picked){
  return q.options.map(o => {
    const cls = right && o.id === q.pick ? ' ok' : crossed && crossed.indexOf(o.id) >= 0 ? ' no' : '';
    return '<button class="ch' + cls + '" data-o="' + o.id + '"' + (cls === ' no' ? ' disabled' : '') +
      (picked !== undefined ? ' aria-pressed="' + (picked === o.id) + '"' : '') + '><span class="lt">' +
      (LETTERS[LANG] || LETTERS.en)[o.id] + '</span><span class="v">' + (o.signs ? o.signs.join(' ' + tr('и', 'і') + ' ') : o.v) + '</span></button>';
  }).join('');
}
