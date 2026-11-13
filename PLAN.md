# Plan — what is still open

The restructure (2026-10-05 to 10-10) is done and its history lives in git (`git log`, search the commit
messages): the safety net (seeds, golden hashes, per-level rules), every round in IndexedDB, the kinds one per
file with shared helpers, per-shape difficulty, the Десетка 2026 redesign on Preact + htm (R0–R9), the speed work
(check.js on worker threads, smoke across tabs). This file keeps only what has not happened. Counts and layout
are in `README.md` and `AGENTS.md`, not here.

## Decisions that stand
- The kinds never get a framework: they draw static HTML once per question and the checks run them in plain Node.
  The shell is Preact + htm, vendored in `js/vendor/` (no npm, no build).
- Task screens: read-aloud is gone (2026-10-10); mute lives in the settings; «Покажи решението» stays under the
  hint after a miss.
- The app opens on Today, and a saved round still resumes.

## Open
- **C3. `template()` for word problems.** One helper for the many kinds that tell a story in a sentence with
  numbers and nouns in both languages (`tr`, `ukN`), so a new word problem is its data, not its prose code. Not
  started; do it when the next word-problem kinds make the copies hurt, and prove it with `check/golden.json`
  (no level may change what it shows).
- **«N точки на листа».** Showing each printed task's points on a paper's task needs the points of every task of
  every paper, which are not in the repo. Parked until they are.
- **Harness.** smoke.js spends most of its time in the serial screens after the level play-through (about
  24 s of ~45); the level loop already runs in tabs. check.js is bounded by its level threads (about 12 s of 15 s).
  Hashing in `check/golden.js` (0.3 s) is not worth a thread.

## Triggers, not tasks
- Deploy-time bundle: when a phone shows a slow start, or the kinds pass ~400.
- Cross-family difficulty (Elo): at ~500 families, from the per-task records in each round — privacy notice,
  parental consent and "delete my data" first.

## Dropped
Moving hosting off GitHub Pages; a sync engine; Vitest/Playwright/fast-check; a hand rewrite of the kinds;
a framework for the kinds; SVG-filter "real" liquid glass (Safari can't, and it costs frames).
