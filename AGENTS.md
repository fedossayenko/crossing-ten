# Crossing Ten – agent guide

Maths practice for a grade-2 pupil (Bulgarian olympiad worksheets). Plain HTML, CSS and
classic scripts sharing one global scope; no build step, no dependencies. Layout and the
design rules (difficulty rubric, training path) are in `README.md`.

## Commands
- `node check.js`: generator checks. `node smoke.js`: plays every level in headless Chrome.
- Sync (`js/sync.js`, `worker/`): `cd worker && npx wrangler dev --local`, then `node worker/test.js`
  and `SMOKE_SYNC=http://127.0.0.1:8787 node smoke.js` (first time: `npx wrangler d1 execute crossing-ten --local --file schema.sql`).
- Run them before finishing. None may be weakened to make a change pass.

## Adding or changing a level
- One question kind per file in `kinds/`, registering `KIND.<kind> = { draw, eq, why }`.
  Search `kinds/` and `js/levels.js` first; extend an existing kind rather than add a
  near-duplicate.
- A new kind file goes into `index.html` before `js/questions.js`; its level row goes in
  `js/levels.js` with `gen:` and a `d:` from the rubric in `README.md`.
- Pin the worksheet's original instance and add a brute-force check in `check.js`.
- A level from another paper says so on its row (`grade:3`, `src:'mbg-winter-2024'`; `src` defaults to `'mbg-autumn'`).
  A task that another paper also asks, at the same difficulty, tags the existing level with `also:['mbg-winter-2024-2']`
  instead of a copy; easier or harder is a new level with its own `d`.
  A kind whose answer cannot be typed brings its own `options`, `pick` and `own: true` (see `kinds/twosigns.js`).
- Task text is written in both languages with `tr('Bulgarian', 'Ukrainian')` from `js/core.js`;
  interface text is `t('key')` from `js/i18n.js`, in bg, uk and en. check.js fails on a missing
  key, on Bulgarian left in Ukrainian task text, and on a render that draws a random number.
- Never change the Bulgarian output of an existing kind by accident, nor the order of `rnd()`
  calls in a generator: both languages must ask the same question from the same seed.
- All scripts share one global scope: a top-level name must be unique across every file
  (check.js fails otherwise; `smoke.js` catches the page failing to load).
- After a change, `node build-artifact.js` rebuilds the single-file artifact copy.
