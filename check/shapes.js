// Runs beside the app (in check.js's own scope, through eval).
// Difficulty per shape. A level has one difficulty, but many draw several shapes of question; a level
// that does rates each on its row — shapes: { name: d }, by the same rubric — and none may be harder
// than the level itself. So a hard shape cannot hide in an easy level: 156 (d2) once held the paper's
// hardest task, 1 − 10 + 2 + 3 + 4 + 5, now level 196 (d3). The shapes are those of the 3000 questions
// check/levels.js drew on each level from seeds 1…3000 (SHAPES_SEEN), so they are the same on every run.
{
  let mixing = 0, rated = 0;
  for(const L of APP.LEVELS){
    const seen = SHAPES_SEEN[L.id] || {};
    const drawn = Object.keys(seen);
    if(drawn.length < 2){ if(L.shapes) throw new Error('level ' + L.id + ' rates shapes, but draws only one'); continue; }
    mixing++;
    if(!L.shapes) throw new Error('level ' + L.id + ' (d' + L.d + ') draws the shapes ' + drawn.join(', ') + ' but rates none: give its row shapes: { name: d }');
    const keys = Object.keys(L.shapes), missing = drawn.filter(s => !keys.includes(s)), extra = keys.filter(k => !drawn.includes(k));
    if(missing.length || extra.length) throw new Error('level ' + L.id + ': shapes drawn but not rated ' + missing.join(', ') + '; rated but never drawn ' + extra.join(', '));
    for(const [s, d] of Object.entries(L.shapes)){
      if(!(Number.isInteger(d) && d >= 1 && d <= 5)) throw new Error('level ' + L.id + ': shape ' + s + ' has no usable difficulty');
      if(d > L.d) throw new Error('level ' + L.id + ' (d' + L.d + ') hides a harder shape: ' + s + ' is d' + d + ' (' + Math.round(seen[s] / 30) + '% of its questions) — give it a level of its own, or rate the level up');
      rated++;
    }
  }
  console.log('shapes: ' + mixing + ' levels draw several shapes; all ' + rated + ' are rated, none harder than its level');
}
