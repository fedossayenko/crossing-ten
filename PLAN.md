# Plan — making Crossing Ten ready for 500–1,000 task types (2026-10-05)

Started from "how would this be built from scratch in October 2026?", then checked against the code
three times: measurements, and three read-only audits (app shell, the 165 kinds, the check harness).
Time is not the constraint; the aim is to do now what gets more expensive with every kind added.

## Verdict

**Restructure now, by script, behind a safety net — not a hand rewrite, not a framework.**

- The kind format (one file: generate, draw, summary line, hint/solution; both languages via `tr`) is
  right. What varies between kinds is the teaching content itself — the insight, the trap, the hint.
  A hand rewrite would retype ~11,600 lines pinned to the official keys for nothing a child sees.
- What is wrong is structural and mechanical — one global scope, boilerplate, registries kept by hand,
  history recomputed from a capped log, difficulty rated per level instead of per shape — and every
  one of those is cheaper to fix at 165 kinds than at 1,000 (the 165 were added in 2 weeks).
- A framework would touch the 1,900-line shell, not the kinds (86% of the code, the part that grows).
  Kinds draw static HTML once per question; the checks run them in plain Node. Revisit only if the
  shell grows (parent dashboard, teacher view, worksheet printing) or tasks become drag-and-tap —
  then Preact or Svelte for the shell alone.

## What the audits found

| # | Finding | Evidence | Scale it bites |
|---|---|---|---|
| 1 | Learned levels, reviews and badges are recomputed from the last **400 rounds** only | `app.js:14`, `sync.js:27`; mastery `app.js:755`, badges `statsFrom` `app.js:108` | Now: 136 rounds in 14 days → 400 around early November. Old levels turn "new" again, badges vanish (contradicts `app.js:152` "nothing is ever lost") |
| 2 | Full storage fails silently | `try{…}catch(e){}` at `app.js:14`, `sync.js:32`, `players.js:14` | Raising the cap alone: 5,000 × ~290 B ≈ 1.5 MB a player; a few players fill localStorage's ~5 MB |
| 3 | **37 of 195 levels skip the per-level check**, no reason given | `check/levels.js` `IDS`; 19 of them pass today, 18 fail (some on rules that don't fit, some may be real) | Now |
| 4 | The level-table check covers **57 of 195** rows | `check/app.js:10-12`: a regex wants one field order, count hard-coded 57 | Now: duplicate ids, `d` range, `needs` loops unchecked for 138 rows |
| 5 | Pins search random draws; 39 of 276 in papers.js never match exactly and always run 300k draws | `check/papers.js`; grade1.js took 12–235 s across runs — the "rerun = flake" rule hides it | Grows with every paper |
| 6 | Each of 24 `eval(head+body)` copies wraps `Math.random` again — 25 nested wrappers by the end | `check.js` head | Now: 2× slower draws |
| 7 | One global scope: 1,104 top-level names, **874 (79%) private** to their file, 6 shared between kinds | scan of `kinds/` | ~6,700 unique names at 1,000 |
| 8 | Boilerplate: 749 `if(q.kind === 'x')` guards (522 do nothing — `questions.js:61-72` already dispatches by `KIND[q.kind]`), 278 `ask` divs, 259 answer lines, 161 identical headers | kinds audit | ~10 of a median 52 lines a kind |
| 9 | One `d` per level, but **34 of 188 level generators mix shapes** (e.g. `genPairsShort` 6, `genPairs` 5, `genSymEq` 4, `genBox` 4) | `js/levels.js` | The 156/196 bug can recur in any of them |
| 10 | Rounds log the kind, not the shape | `factKey` `app.js:90` | Mis-rated shapes are invisible in data |
| 11 | Registries kept by hand: script list, `IDS`, check file lists, the 57 | `index.html:288-462`, `check/levels.js:29`, `check.js:23,27`, `check/app.js:12` | Each new kind touches 6–7 places |
| 12 | One `<script>` per kind; the service worker revalidates each on launch; cache name never changes, removed files cached forever | `index.html`, `sw.js:3,13-15,35` | ~1,000 blocking requests |
| 13 | Topic groups matched by position across 4 arrays | `levels.js` `PICK_GROUPS`, `i18n.js:41,127,363` | Insert one group → every later one mislabelled |
| 14 | A level's text lives in 5 places over 2 files; i18n.js 86 KB → ~400 KB | `levels.js` + `i18n.js` | Editing and merges |
| 15 | Picker renders every level + one click handler per row, rebuilt on each chip tap | `app.js:828-925` | ~9,000 elements at 1,000 levels |
| 16 | Competition mode is threaded through round code (`COMP ?` at ~20 sites) | `app.js:274-549` | A second mode (Коледно) doubles it |
| 17 | smoke.js has a hard 120 s timeout, close at 195 levels | `smoke.js:18` | Soon |
| 18 | Real duplication only in chain/pairs draw (identical), cross/crossmin deletion lister, segpts/segcount fencepost; other look-alike names are different puzzles | kinds audit | — |

## The plan — phases, each step shipped and verified on its own

Not one batch: a step that changes data and a step that changes structure must fail separately. Phase A
makes every later step provably safe: after it, a restructure that changes any child-visible output fails.

### Phase A — safety net (first)
- **A1. Harness speed and seeds** (#5, #6): capture the real `Math.random` once in `head`; a seeded
  PRNG (mulberry32); `pin(…, seed)` replays one draw, and on a miss searches and fails with
  "seed stale, now at seed N" (never a silent pass); `node check.js --repin` rewrites seeds. The 39
  never-exact papers.js pins get exact instances. ~1 day.
- **A2. Golden output**: record `draw`, `eq` and `why` (both languages, hint and full) for every level ×
  50 seeds into `check/golden.json`; check.js compares. Any restructure that changes what a child sees
  fails; an intended change re-records it in the same commit, visible in the diff.
- **A3. Registries derived** (#3, #4, #11): `IDS` from `LEVELS` with a commented skip list (triage the
  18 failing levels: fix the level or name the rule it is exempt from); check file list by `readdir`; the
  level-table check runs on the loaded `LEVELS` (unique ids, `d` range, `needs` exist, no cycles); a check
  that `kinds/*` and the script list in `index.html` agree.

### Phase B — her data (before ~2026-11-01, can run beside A)
- **B1. Rounds in IndexedDB, no cap** (#1, #2): the log stays the single source of truth (no counters —
  counters would conflict across synced devices); mastery over 5,000 rounds is 0.7 ms. Migrate from
  localStorage once; sync's union by id is unchanged; a new device pulls the full history from cursor 0.
  `navigator.storage.persist()`; storage errors shown, not swallowed.
- **B2. Log the shape** (#10): `shapes` beside `seen` in each round; `factKey` unchanged (weights).

### Phase C — structure (each verified by A2's golden output)
- **C1. Native ES modules, no bundler** (#7): a one-off script adds imports/exports (kinds mostly use
  `rnd`, `tr`, `SLOT`, `KIND`, `t`, `LANG`); `ic`, `DAYS`, `weekdayUk`, `sqWalkSvg` move to `core.js`;
  `W`, `factKey`, `LOCAL` move out of `app.js` (`questions.js:23` uses them); `LANG`, `PICK_FOR` get
  setters. Checks: an adapter imports everything onto `globalThis` so the 24 `eval` sites keep working
  (~20–40 lines to edit in `check/app.js`, `sample.js`); smoke exposes the names it reads. Module tags
  stay in `index.html` (or `modulepreload`) so the service worker still caches them. 1.5–2.5 days.
- **C2. Kind cleanup** (#8, #18): drop the 522 do-nothing guards and the 161 headers; `ask()`,
  `answerLine(unit, size)`, `steps()` helpers; one chain/pairs draw; shared deletion lister for
  cross/crossmin. ~1,600 lines fewer, zero output change.
- **C3. `template()` for word problems**: the declarative form (gen, ask [bg, uk], unit, eq, hint, why
  steps) for ~30–40 "text + small sum" kinds; new word problems use it, old ones move when touched.
- **C4. Per-level text on the row** (#14): `eq`/`desc` in both languages on the level row; i18n.js keeps
  interface text only.

### Phase D — difficulty per shape
- **D1.** A kind declares `shapes: { name: d }`; check.js fails when a level mixes shapes more than one
  `d` apart from the level's (#9) — the 156/196 class of bug becomes a failing check. Split what it finds.
- **D2.** After ~2 weeks of B2 data: first-try rate per shape in the stats view; flag shapes well below
  their level.

### Phase E — shell, as kinds grow
- **E1.** Groups keyed by `grp`, not position (#13). Small, do with C4.
- **E2.** Picker: groups collapsed by default, one delegated click handler (#15).
- **E3.** Competition as a mode object before Коледно mode is added (#16).
- **E4.** Service worker: versioned cache, old caches deleted, stale-while-revalidate (#12).
- **E5.** check.js level loop on worker threads; smoke split across tabs, timeout per level (#17).

### Triggers, not tasks
- **Deploy-time bundle** (esbuild/Rolldown in a GitHub Action, dev stays no-build): when a phone shows a
  slow start or the kind count passes ~400.
- **A framework for the shell**: when the shell grows a dashboard/teacher/printing screen, or tasks
  become drag-and-tap.
- **Cross-family difficulty (Math Garden-style Elo)**: at ~500 families, from B2's shape log — with a
  privacy notice, parental consent and "delete my data" first.

### Dropped
Moving hosting off GitHub Pages (changes the origin: re-install, re-sign-in); a sync engine (rounds are
append-only and conflict-free); Vitest/Playwright/fast-check (check.js + smoke.js already cover more);
a hand rewrite of the kinds; a framework for the kinds.

### Order
A1 → A2 → A3, with B1 → B2 beside them (B1 before November) → C1 → C2 → C3 → C4 + E1 → D1 → D2 → E2–E5.
