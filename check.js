// Self-check for the question generators. Run: node check.js
const fs = require('fs'), vm = require('vm'), { pathToFileURL } = require('url');
const src = fs.readFileSync(__dirname + '/index.html', 'utf8');
const read = f => fs.readFileSync(__dirname + '/' + f, 'utf8');
// The modules, in the order the page lists them; app.js, compete.js and sync.js are the page itself and need a DOM.
const scripts = [...src.matchAll(/<script type="module" src="([^"]+)"><\/script>/g)].map(m => m[1]);
const PAGE = ['js/app.js', 'js/compete.js', 'js/sync.js'];
// A module's text as a classic script (its imports and `export` words dropped): for the checks that read
// or run a slice of the source on its own.
const classic = s => s.replace(/^import \{[^}]*\} from '[^']*';\n/mg, '').replace(/^export /mg, '');
const js = scripts.map(read).map(classic).join('\n');

(async () => {
  // Every random draw is counted (the drawing of a question may not draw one); seeded() swaps this
  // out for a seed and puts it back.
  let RANDS = 0;
  const REAL_RANDOM = Math.random;
  Math.random = () => (RANDS++, REAL_RANDOM());
  Object.defineProperty(globalThis, 'RANDS', { get: () => RANDS });
  // no browser storage here: players.js falls back to one player (and Node is not asked for its own)
  Object.defineProperty(globalThis, 'localStorage', { value: undefined, configurable: true });

  // The app's own modules, loaded as the browser loads them: ES modules, strict, each in its own scope.
  // APP is one view of everything they export, live: a value a module reassigns later reads as it is now.
  // Only what the modules let others change can be set from here (LANG, W), through their own setters.
  const ns = {};
  for(const f of scripts.filter(f => !PAGE.includes(f))) ns[f] = await import(pathToFileURL(__dirname + '/' + f).href);
  const SET = { LANG: v => ns['js/i18n.js'].setLang(v), W: v => ns['js/questions.js'].setW(v) };
  const APP = {};
  for(const f in ns) for(const k of Object.keys(ns[f])){
    if(k in APP) throw new Error(k + ' is exported by two modules; the checks see them all in one scope');
    Object.defineProperty(APP, k, { enumerable: true, get: () => ns[f][k], set: SET[k] || (v => { throw new Error(k + ' belongs to ' + f + ', which has no setter for it'); }) });
  }
  // check/levels.js and check/kinds.js run as classic scripts with the same names as globals, under their
  // own file names so an error points at the real file and line
  Object.defineProperties(globalThis, Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(APP)).map(([k, d]) => [k, Object.assign(d, { configurable: true })])));
  ['check/levels.js', 'check/kinds.js'].forEach(f => vm.runInThisContext(read(f), { filename:f }));

  // A printed task is replayed from a seed instead of searched for among hundreds of thousands of draws:
  // seeded(seed, fn) (js/core.js) runs fn with Math.random drawn from that seed, so a level's generator
  // asks the same question every time. check/seeds.json holds one seed per pin; when a generator changes
  // and a seed no longer gives its task, the pin searches as before and fails naming the new seed —
  // `node check.js --repin` records the new seeds instead of failing.
  const { seeded } = APP;
  const REPIN = process.argv.includes('--repin'), SEEDS = JSON.parse(read('check/seeds.json')), USED = {};
  let CHECK_FILE = '';   // the check file running: seeds are keyed by file and pin, as two papers may both have a task 3
  // match(question): 2 = the printed question, 1 = the same question with other numbers (where a pin
  // allows that), 0 = not it. Returns { q, exact } for the best match within `tries` seeds, or null.
  function pinSeed(name, draw, match, tries = 300000){
    const key = CHECK_FILE + ': ' + name;
    if(USED[key] !== undefined) throw new Error('two pins named ' + key);
    const at = SEEDS[key];
    if(at !== undefined){ const q = seeded(at, draw), m = match(q); if(m){ USED[key] = at; return { q, exact: m === 2 }; } }
    let best = null;
    for(let seed = 1; seed <= tries; seed++){
      const q = seeded(seed, draw), m = match(q);
      if(m === 2){ best = { seed, q, exact: true }; break; }
      if(m === 1 && !best) best = { seed, q, exact: false };
    }
    if(!best) return null;
    if(!REPIN) throw new Error(key + ': ' + (at === undefined ? 'no seed recorded' : 'seed ' + at + ' no longer asks it') + ' — it is at seed ' + best.seed + '; run node check.js --repin');
    USED[key] = best.seed;
    return { q: best.q, exact: best.exact };
  }

  // The rest run beside the app, in this function's scope (they use APP, read, classic, src, scripts and js);
  // sourceURL names the file in an error. Every check file runs: levels.js and kinds.js above, the rest
  // here in name order, golden output last.
  const inScope = ['check/levels.js', 'check/kinds.js'];
  const beside = fs.readdirSync(__dirname + '/check').filter(f => f.endsWith('.js')).map(f => 'check/' + f)
    .filter(f => !inScope.includes(f) && f !== 'check/golden.js').sort().concat('check/golden.js');
  // every kind file is loaded by the page, and the page loads no kind that is not there
  {
    const files = fs.readdirSync(__dirname + '/kinds').filter(f => f.endsWith('.js')).map(f => 'kinds/' + f), listed = scripts.filter(f => f.startsWith('kinds/'));
    const missing = files.filter(f => !listed.includes(f)), extra = listed.filter(f => !files.includes(f));
    if(missing.length || extra.length) throw new Error('index.html and kinds/ disagree: not loaded ' + missing.join(', ') + '; loaded but missing ' + extra.join(', '));
  }
  for(const f of beside){ CHECK_FILE = f.slice(6, -3); eval(read(f) + '\n//# sourceURL=' + f); }

  // every recorded seed belongs to a pin that ran; --repin rewrites the file with exactly those
  const unused = Object.keys(SEEDS).filter(k => USED[k] === undefined);
  if(REPIN){ fs.writeFileSync(__dirname + '/check/seeds.json', JSON.stringify(Object.fromEntries(Object.keys(USED).sort().map(k => [k, USED[k]])), null, 1) + '\n'); console.log('check/seeds.json: ' + Object.keys(USED).length + ' seeds recorded'); }
  else if(unused.length) throw new Error('check/seeds.json has seeds no pin uses: ' + unused.join(', ') + ' — run node check.js --repin');
})().catch(e => { console.error(e); process.exit(1); });
