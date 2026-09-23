# Crossing Ten – agent guide

Maths practice for a grade-2 pupil (Bulgarian olympiad worksheets). Plain HTML, CSS and
classic scripts sharing one global scope; no build step, no dependencies. Layout and the
design rules (difficulty rubric, training path) are in `README.md`.

## Commands
- `node check.js`: generator checks. `node smoke.js`: plays every level in headless Chrome.
- Run both before finishing. Neither may be weakened to make a change pass.

## Adding or changing a level
- One question kind per file in `kinds/`, registering `KIND.<kind> = { draw, eq, why }`.
  Search `kinds/` and `js/levels.js` first; extend an existing kind rather than add a
  near-duplicate.
- A new kind file goes into `index.html` before `js/questions.js`; its level row goes in
  `js/levels.js` with `gen:` and a `d:` from the rubric in `README.md`.
- Pin the worksheet's original instance and add a brute-force check in `check.js`.
- Task text is Bulgarian; the UI is English for now.
- After a change, `node build-artifact.js` rebuilds the single-file artifact copy.
