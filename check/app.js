// Runs beside the app (in check.js's own scope, through eval): each block loads its own copy of
// the app with eval(head + body) and checks it from outside. Run all checks with: node check.js
// The app as a whole: the level table, one global scope, the languages, the mistakes it names,
// А/Б/В/Г, and the training path.

// The level table is a static thing, so it is checked on the file rather than through
// the generators: every level rated, in a known group, and easiest first.
{
  const block = js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections'));
  const rows = [...block.matchAll(/id:(\d+), op:.(.).(?:, grp:.(\w+).)?(?:, needs:\[([\d,]*)\])?, d:(\d), eq:.(.*?)., desc/g)]
    .map(m => ({ id:+m[1], grp: m[3] || m[2], needs: m[4] ? m[4].split(',').map(Number) : [], d:+m[5], eq:m[6] }));
  if(rows.length !== 57) throw new Error('parsed ' + rows.length + ' levels, expected 57');
  const seen = new Set();
  rows.forEach(r => {
    if(!(r.d >= 1 && r.d <= 5)) throw new Error(r.eq + ' has no usable difficulty');
    if(seen.has(r.id)) throw new Error('level id ' + r.id + ' appears twice');
    seen.add(r.id);
  });
  const known = ['-', '+', 'chain', 'count', 'num', 'seq', 'find', 'word', 'geo'];
  rows.forEach(r => { if(known.indexOf(r.grp) < 0) throw new Error(r.eq + ' is in no known group'); });
  known.slice(2).forEach(g => {
    const ds = rows.filter(r => r.grp === g).map(r => r.d);
    if(ds.some((v, i) => i && v < ds[i-1])) throw new Error('group ' + g + ' is not easiest first');
  });
  const ladder = rows.filter(r => r.grp === '-' || r.grp === '+').map(r => r.d);
  if(ladder.join() !== '2,2,3,1,2,3') throw new Error('the arithmetic ladder lost its designed order');
  // prerequisites must exist, never point forward, and never form a cycle
  const byId = {};
  rows.forEach(r => byId[r.id] = r);
  rows.forEach(r => r.needs.forEach(n => {
    if(!byId[n]) throw new Error(r.eq + ' needs a level that does not exist: ' + n);
    if(byId[n].d > r.d) throw new Error(r.eq + ' needs something harder than itself: ' + byId[n].eq);
  }));
  const depth = (id, seen) => {
    if(seen.has(id)) throw new Error('prerequisites form a loop at ' + byId[id].eq);
    seen.add(id);
    return byId[id].needs.reduce((d, n) => Math.max(d, 1 + depth(n, new Set(seen))), 0);
  };
  rows.forEach(r => depth(r.id, new Set()));
  // starting from nothing learned, the path must be able to reach every level
  {
    const done = new Set();
    for(let pass = 0; pass < 50 && done.size < rows.length; pass++)
      rows.forEach(r => { if(!done.has(r.id) && r.needs.every(n => done.has(n))) done.add(r.id); });
    if(done.size !== rows.length) throw new Error('some levels can never be reached by the path');
  }
  console.log('level table: all 57 rated 1-5, grouped, easiest first, prerequisites sound and reachable');

  // every element the script looks up must exist in the markup
  {
    const markup = src.split('<script>')[0];
    const have = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    ['slot0','slot1','wave1','wave2','waveX','pAdd','reveal','compClock'].forEach(i => have.add(i));   // drawn at runtime
    const looked = [...new Set([...js.matchAll(/\$\('([^']+)'\)/g)].map(m => m[1]))];
    const gone = looked.filter(i => !have.has(i));
    if(gone.length) throw new Error('the script looks up elements that are not in the page: ' + gone.join(', '));
    console.log('page wiring: all ' + looked.length + ' element lookups resolve');
  }

  // Walk the recommended path from nothing learned: it must reach every level, never
  // suggest something whose groundwork is undone, never step back in difficulty, and
  // not grind one group for too long.
  {
    const levelsSrc = js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections')).replace(/, gen:\w+/g, '');
    const nextSrc = js.slice(js.indexOf('const REVIEW_DAYS'), js.indexOf('function buildPicker'));
    const walk = `
      const grp = l => l.grp || l.op;
      const m = {}, order = [];
      let last = null;
      for(let step = 0; step < 200; step++){
        const nx = nextUp(m, last);
        if(!nx) break;
        if(!(nx.needs || []).every(n => m[n] && m[n].done)) throw new Error(nx.eq + ' was suggested before its groundwork');
        order.push(nx); last = grp(nx);
        m[nx.id] = { n:20, f:17, rate:.85, done:true, rounds:2 };
      }
      if(order.length !== LEVELS.length) throw new Error('the path reaches ' + order.length + ' of ' + LEVELS.length + ' levels');
      // Her own grade's tasks all come before the next grade's, and each grade is a ladder of its own.
      const gs = order.map(l => l.grade);
      if(gs.some((g, i) => i && g < gs[i-1])) throw new Error('the path goes back to an easier grade');
      // The path may pull one level forward for variety, so a single step back is allowed;
      // dropping further than that would mean the ladder is not being climbed at all.
      [...new Set(gs)].forEach(g => {
        const ds = order.filter(l => l.grade === g).map(l => l.d);
        if(ds.some((v, i) => i && v < ds[i-1] - 1)) throw new Error('the grade ' + g + ' path steps back in difficulty');
        if(ds[ds.length-1] < ds[0]) throw new Error('the grade ' + g + ' path ends easier than it starts');
      });
      let run = 1, worst = 1;
      for(let i = 1; i < order.length; i++){
        run = grp(order[i]) === grp(order[i-1]) ? run + 1 : 1;
        if(run > worst) worst = run;
      }
      if(worst > 4) throw new Error('the path grinds one group ' + worst + ' times running: ' + order.map(l => l.id + (l.grp || l.op)).join(' '));
      console.log('training path: reaches all ' + order.length + ' levels, groundwork first, 2nd grade before 3rd, climbing within each, at most ' + worst + ' in a row from one group');
    `;
    eval('const PLAYER = { grade:2 };' + levelsSrc + nextSrc + walk);   // the default 2nd-grade player
    // a 3rd-grader's profile starts her on the 3rd-grade levels
    const first3 = eval('(function(){ const PLAYER = { grade:3 };' + levelsSrc + nextSrc + '; return nextUp({}, null); })()');
    if(!first3 || first3.grade !== 3) throw new Error('a 3rd-grade profile is not recommended a 3rd-grade level');
    console.log('profile grade: a 3rd-grader starts on level ' + first3.id + ', a 3rd-grade one');
    // A learned level comes back: a day after it is learned, then 3, 7, 14 and 30 days after good reviews,
    // one review between new levels, and never when it was just practised.
    const rv = eval('(function(){ const PLAYER = { grade:2 };' + levelsSrc + nextSrc + `;
      const day = 864e5, now = 100 * day, learned = (at, streak) => ({ n:20, f:18, rate:.9, done:true, rounds:streak, lastRate:.9, at, streak });
      // every 2nd-grade level tried once, none learned: reviews may come now
      const tried = extra => { const m = {}; LEVELS.forEach(l => { m[l.id] = { n:10, f:5, rate:.5, done:false, rounds:1, lastRate:.5, at:now - day, streak:0 }; }); return Object.assign(m, extra); };
      const notAll = Object.assign(tried({ 4: learned(now - 2*day, 2) }));
      delete notAll[8];
      return {
        breadth: nextUp(notAll, null, false, now).id,
        fresh: nextUp(tried({ 4: learned(now - day/2, 2) }), null, false, now).id,
        due: nextUp(tried({ 4: learned(now - 2*day, 2) }), null, false, now).id,
        between: nextUp(tried({ 4: learned(now - 2*day, 2) }), null, true, now).id,
        step: [nextUp(tried({ 4: learned(now - 2*day, 3) }), null, false, now).id, nextUp(tried({ 4: learned(now - 4*day, 3) }), null, false, now).id],
        late: nextUp(tried({ 4: learned(now - 2*day, 2), 8: learned(now - 9*day, 3) }), null, false, now).id };
    })()`);
    if(rv.breadth !== 8 || rv.fresh === 4 || rv.due !== 4 || rv.between === 4 || rv.step[0] === 4 || rv.step[1] !== 4 || rv.late !== 8)
      throw new Error('the review ladder went wrong: ' + JSON.stringify(rv));
    console.log('review: only once every level is tried, a learned level comes back on its day (1, 3, 7, 14, 30), one between repairs, the longest overdue first');
    // A focus (the picker's competition filter): the suggestion keeps inside it, takes every level in it
    // easiest first, and groundwork outside it does not hold any back.
    const fo = eval('(function(){ const PLAYER = { grade:2 };' + levelsSrc + nextSrc + `;
      const pool = l => l.grade === 2 && (l.grp === 'geo' || l.grp === 'word'), m = {}, order = [];
      for(let step = 0; step < 200; step++){ const nx = nextUp(m, null, false, 0, pool); if(!nx) break; order.push(nx); m[nx.id] = { n:20, f:17, rate:.85, done:true, rounds:2, at:0, streak:2 }; }
      return { order: order.map(l => [l.id, l.d, pool(l)]), want: LEVELS.filter(pool).length };
    })()`);
    if(fo.order.some(x => !x[2]) || fo.order.length !== fo.want || fo.order.some((x, i) => i && x[1] < fo.order[i-1][1] - 1))
      throw new Error('a focused path went wrong: ' + JSON.stringify(fo));
    console.log('focus: a picked competition keeps the suggestion inside it, all ' + fo.want + ' of its levels, easiest first');
  }
}

/* The scripts share one global scope, so a name declared at the top of two files stops the
   later file from running at all - the page loads with half its code missing. */
{
  const seen = {};
  scripts.forEach(f => read(f).split('\n').forEach(l => {
    const m = l.match(/^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/);
    if(!m) return;
    if(seen[m[1]]) throw new Error(m[1] + ' is declared in both ' + seen[m[1]] + ' and ' + f);
    seen[m[1]] = f;
  }));
  console.log('one global scope: ' + Object.keys(seen).length + ' top-level names across ' + scripts.length + ' scripts, none declared twice');
}

/* Every language says everything English says, with the same shape: a string where English
   has a string, a function that returns text where English has one, and a description for
   every level. Missing text would fall back to English in the middle of a Bulgarian page. */
{
  const T = eval('(function(){ const PLAYER = { lang:"en" };' + read('js/i18n.js') + '; return { TEXT, LANGS, t, get LANG(){ return LANG; } }; })()');
  const args = [3, 7, 12];
  const sample = v => typeof v === 'function' ? v(...args) : v;
  const shape = v => Array.isArray(v) ? 'list' + v.length : typeof v === 'function' ? 'text' : typeof v === 'object' ? 'map' : typeof v;
  const levelIds = [...js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections')).matchAll(/\{ id:(\d+),/g)].map(m => m[1]);
  let n = 0;
  for(const lang of Object.keys(T.LANGS)){
    const L = T.TEXT[lang], E = T.TEXT.en;
    for(const k of Object.keys(E)){
      if(!(k in L)) throw new Error(lang + ' is missing ' + k);
      if(shape(L[k]) !== shape(E[k])) throw new Error(lang + '.' + k + ' is a ' + shape(L[k]) + ', English has a ' + shape(E[k]));
      if(shape(E[k]) === 'map') for(const j of Object.keys(E[k]))
        if(!(j in L[k]) || String(L[k][j]).length === 0) throw new Error(lang + '.' + k + '.' + j + ' is missing');
      for(let c = 0; c < 30; c++){
        const v = typeof L[k] === 'function' ? L[k](c, c + 1, c + 2) : sample(L[k]);
        if(typeof L[k] === 'function' && (typeof v !== 'string' || !v || /undefined|NaN/.test(v))) throw new Error(lang + '.' + k + '(' + c + ') gives ' + v);
      }
      n++;
    }
    if(lang !== 'en') levelIds.forEach(id => { if(!(L.desc || {})[id]) throw new Error(lang + ' has no description for level ' + id); });
    if(lang === 'uk'){
      const names = [...js.slice(js.indexOf('const LEVELS = ['), js.indexOf('// Picker sections')).matchAll(/\{ id:(\d+),.*?eq:'(.*?)'/g)];
      names.forEach(m => { if(/[А-Яа-я]/.test(m[2]) && !(L.eq || {})[m[1]]) throw new Error('uk has no name for level ' + m[1] + ' ' + m[2]); });
    }
  }
  const groups = (read('js/levels.js').split('const PICK_GROUPS = [')[1].split('];')[0].match(/\{ nm:'/g) || []).length;
  Object.keys(T.LANGS).forEach(lang => { if(T.TEXT[lang].groups.length !== groups) throw new Error(lang + ' names ' + T.TEXT[lang].groups.length + ' picker groups, the picker has ' + groups); });
  const mascots = [...read('js/mascots.js').matchAll(/^  (\w+): \{$/gm)].map(m => m[1]);
  Object.keys(T.LANGS).forEach(lang => mascots.forEach(m => { if(!T.TEXT[lang].mascots[m]) throw new Error(lang + ' has no name for the ' + m); }));
  const used = [...new Set([...(js + src).matchAll(/\bt\('(\w+)'|data-t(?:-aria)?="(\w+)"/g)].map(m => m[1] || m[2]))];
  const unknown = used.filter(k => !(k in T.TEXT.en));
  if(unknown.length) throw new Error('the page asks for text no language has: ' + unknown.join(', '));
  console.log('languages: ' + Object.keys(T.LANGS).join(', ') + ' each carry all ' + (n / 3) + ' texts, ' + levelIds.length +
    ' level descriptions, ' + groups + ' group names and ' + mascots.length + ' mascot names; all ' + used.length + ' keys the page uses exist');
}

/* The signs task shows an example on its own numbers: correct arithmetic, and never the target. */
{
  const Q = eval('(function(){' + head + body + '; return { raw, signsExample }; })()');
  for(let i = 0; i < 3000; i++){
    const q = Q.raw(50), ex = Q.signsExample(q), [lhs, rhs] = ex.split(' = ');
    const val = lhs.split(/ (?=[+−])/).reduce((t, p) => t + (p[0] === '−' ? -+p.slice(2) : p[0] === '+' ? +p.slice(2) : +p), 0);
    if(val !== +rhs || +rhs === q.T || lhs.split(/ [+−] /).map(Number).join() !== q.nums.join()) throw new Error('bad signs example: ' + ex + ' for ' + JSON.stringify(q));
  }
  console.log('signs example: always on the question’s own numbers, always correct, never the answer');
}

/* Naming a mistake: each classic slip on a plain sum is recognised from what she typed,
   and the ten-frame shows exactly the crossing step - the right dots, the right ones
   crossed out - and nothing at all when no ten is crossed. */
{
  const Q = eval('(function(){' + head + body + '; return { slipOf, tenFrame }; })()');
  [[{a:42,b:17,op:'-'}, '35', 'forgotBorrow'], [{a:41,b:17,op:'-'}, '36', 'flipped'], [{a:42,b:17,op:'-'}, '59', 'wrongOp'],
   [{a:27,b:15,op:'+'}, '32', 'forgotCarry'], [{a:8,b:5,op:'+'}, '3', 'wrongOpAdd'], [{a:42,b:17,op:'-'}, '26', 'offByOne'],
   [{a:42,b:17,op:'-'}, '40', null], [{a:112,b:25,op:'-'}, '97', 'forgotBorrow'], [{kind:'erase', ans:7}, '8', null]
  ].forEach(([q, typed, want]) => {
    const got = Q.slipOf(q, [typed]);
    if(got !== want) throw new Error(q.a + q.op + q.b + ' typed ' + typed + ' is read as ' + got + ', not ' + want);
  });
  for(let a = 1; a <= 9; a++) for(let b = 1; b <= 9; b++){
    const svg = Q.tenFrame({a, b, op:'+'}), fill = (svg.match(/var\(--accent\)"/g) || []).length, more = (svg.match(/var\(--warm\)"/g) || []).length;
    if(a + b < 10 ? svg !== '' : fill !== a || more !== b) throw new Error('ten-frame for ' + a + ' + ' + b + ' draws ' + fill + ' and ' + more);
  }
  for(let o = 0; o <= 9; o++) for(let bo = 0; bo <= 9; bo++){
    const svg = Q.tenFrame({a:40 + o, b:10 + bo, op:'-'}), left = (svg.match(/var\(--accent\)"/g) || []).length, gone = (svg.match(/<path d="M[\d.]+,[\d.]+ L/g) || []).length;
    if(o >= bo ? svg !== '' : left !== 10 - (bo - o) || gone !== bo || /undefined|NaN/.test(svg)) throw new Error('ten-frame for ' + (40+o) + ' − ' + (10+bo) + ': ' + left + ' left, ' + gone + ' crossed out');
  }
  console.log('mistakes: forgotten borrow, flipped digits, dropped carry, wrong sign and off-by-one are each recognised; ten-frames show the crossing step exactly');
}


/* Multiple choice: on every level that can be asked that way, exactly one option is right
   (the one marked as the answer), the others are distinct, whole and not negative, the
   options go in order of size, and drawing them draws no random number. */
{
  const Q = eval('(function(){' + head + body + '; return { withChoices, choiceHtml, raw, accepts, LEVELS, R: () => RANDS }; })()');
  let asked = 0, slipsOffered = 0;
  Q.LEVELS.forEach(L => {
    for(let i = 0; i < 200; i++){
      const q = Q.withChoices(Q.raw(L.id));
      if(!q.options) continue;
      asked++;
      const vs = q.options.map(o => o.v), right = q.options.filter(o => Q.accepts(q, [String(o.v)]));
      if(q.options.length !== 4 || new Set(vs).size !== 4 || vs.some(v => !Number.isInteger(v) || v < 0))
        throw new Error('level ' + L.id + ': bad options ' + vs.join(', '));
      if(right.length !== 1 || right[0].id !== q.pick) throw new Error('level ' + L.id + ': ' + right.length + ' right options in ' + vs.join(', '));
      if(vs.some((v, k) => k && v < vs[k - 1])) throw new Error('level ' + L.id + ': options out of order ' + vs.join(', '));
      if(vs.some(v => Math.abs(v - q.options[q.pick].v) === 10)) slipsOffered++;
      const r0 = Q.R(); Q.choiceHtml(q, [q.pick === 0 ? 1 : 0], true, 2);
      if(Q.R() !== r0) throw new Error('level ' + L.id + ': drawing the options drew a random number');
    }
  });
  if(slipsOffered < asked / 2) throw new Error('the lost-or-gained ten is offered too rarely: ' + slipsOffered + ' of ' + asked);
  console.log('multiple choice: ' + asked + ' questions asked as А/Б/В/Г, each with one right option, in order, a ten-off slip among them in ' + Math.round(100 * slipsOffered / asked) + '%');
}
