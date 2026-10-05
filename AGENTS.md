# Crossing Ten – agent guide

Maths practice for a grade-2 pupil (Bulgarian olympiad worksheets). Plain HTML, CSS and
native ES modules (no bundler); no build step, no dependencies. Layout and the
design rules (difficulty rubric, training path) are in `README.md`.

## Commands
- `npx -p typescript@7.0.2 tsc -p .`: TypeScript checks the plain JS against `types.d.ts` (no build, nothing emitted).
- `node check.js`: generator checks. The checks live in `check/`: `levels.js` and `kinds.js` run inside the app's
  scope (they call the generators directly), every other `check/*.js` beside it (found by name, `golden.js` last); an error names the real file and line. `node smoke.js`: plays every level in headless Chrome.
- A printed task is replayed from its seed in `check/seeds.json`; when a generator change moves it, check.js fails naming the new seed — `node check.js --repin` records it.
- `check/golden.json` records what every level shows (30 seeds, both languages, hints, solutions, options). A change a child would see fails until recorded with `node check.js --golden`; record only a change you meant, and say which levels moved.
- Every level gets every per-level rule in `check/levels.js`; a rule that cannot fit a level is lifted in its `NOT` table for that level alone, with the reason.
- check.js runs the per-level check in worker threads (4 by default, `CHECK_THREADS=n`; `CHECK_SERIAL=1` for one,
  e.g. to profile; `CHECK_TIME=1` times each file): about 8 s on this machine; smoke.js about 22 s.
- `node sample.js 12,38 20`: what those levels ask, to tell whether a new paper's task is already covered.
- Sync (`js/sync.js`, `worker/`): `cd worker && npx wrangler dev --local`, then `node worker/test.js`
  and `SMOKE_SYNC=http://127.0.0.1:8787 node smoke.js` (first time: `npx wrangler d1 execute crossing-ten --local --file schema.sql`).
- Run them before finishing. None may be weakened to make a change pass.
- Deploy: `git push` (GitHub Pages, via Actions) and `./deploy-cf.sh` (Cloudflare, from this machine, only a committed app).

## Adding or changing a level
- One question kind per file in `kinds/`, registering `KIND.<kind> = { draw, eq, why }`. It imports what it
  uses (`import { KIND, SLOT, rnd, tr } from '../js/core.js';`) and exports its generators, which
  `js/levels.js` imports for `gen:`. Everything else in the file stays private to it.
  `draw`/`eq`/`why` are only ever called for their own kind (`KIND[q.kind]`), so they need no
  `if(q.kind === …)` guard — test `q.shape` where a kind has several. The answer line takes a size class,
  `<div class="line xl|lg|md">` (app.css); an inline font-size only for a line that must fit its own length.
  Search `kinds/` and `js/levels.js` first; extend an existing kind rather than add a
  near-duplicate.
- A new kind file goes into `index.html` (`<script type="module" src=…>`) before `js/questions.js`; its level row goes in
  `js/levels.js` with `gen:` and a `d:` from the rubric in `README.md`.
- Pin the worksheet's original instance in `check/papers.js` and add a brute-force check in `check/kinds.js`.
- A level whose generator draws several `shape`s rates each on its row (`shapes: { name: d }`, the rubric
  in `README.md`); none above the level's `d` (`check/shapes.js`). A harder shape gets a level of its own
  (`only(gen, shape)` there, `without(gen, shape)` on the old one), and its printed tasks move with it.
- A level from another paper says so on its row (`grade:3`, `src:'mbg-winter-2024'`; `src` defaults to `'mbg-autumn'`).
  A task that another paper also asks, at the same difficulty, tags the existing level with `also:['mbg-winter-2024-2']`
  instead of a copy; easier or harder is a new level with its own `d`. A new paper needs its name in
  `papers` and `paperTag` in `js/i18n.js`, in all three languages (check.js fails otherwise).
  A kind whose answer cannot be typed brings its own `options`, `pick` and `own: true` (see `kinds/twosigns.js`).
- Task text is written in both languages with `tr('Bulgarian', 'Ukrainian')` from `js/core.js`;
  interface text is `t('key')` from `js/i18n.js`, in bg, uk and en. check.js fails on a missing
  key, on Bulgarian left in Ukrainian task text, and on a render that draws a random number.
- Never change the Bulgarian output of an existing kind by accident, nor the order of `rnd()`
  calls in a generator: both languages must ask the same question from the same seed.
- Every file is an ES module, strict, in its own scope; an exported name must be unique across the app
  (check.js imports them all and fails otherwise). A module may not assign another's variable: the
  owner exports a setter (`setLang`, `setW`, `setComp`). app.js imports compete.js and sync.js, so
  they run first: their wiring waits in `startCompete()` / `startSync()`, which app.js calls at its end.
  The checks see every export as `APP.x` (and as globals in check/levels.js and check/kinds.js);
  `smoke.js` reads the page through the names app.js puts on `window`.
