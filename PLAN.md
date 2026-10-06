# Plan — Crossing Ten for 500–1,000 task types, and the Десетка 2026 redesign (2026-10-05)

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
- The kinds never get a framework: they draw static HTML once per question and the checks run them in
  plain Node. **The shell does** — see *The redesign* below: it rewrites the shell anyway, which is
  exactly the trigger this plan set for a framework.

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

## The redesign (design canvas "Десетка 2026 — Crossing Ten в стила на Apple")

29 artboards: iPad (main device) — Today, Levels with filters, task with the level list beside it, hint
after a mistake, word problem, geometry, round end, competition А/Б/В/Г, competition result, mistakes
notebook, badges, parents, players + family profile, dark; iPhone — the same flow with a floating tab
bar; a shareable weekly card; the style system ("Liquid Glass 2026"). Mapped screen by screen to the code:

| Already there — a restyle | Really new |
|---|---|
| The on-screen keypad (`index.html:51-60`, `press()` `app.js:346`), А/Б/В/Г, multi-box answers | **Navigation**: four tabs (Днес / Нива / Значки / Родители) — tab bar on iPhone, sidebar on iPad; today everything is a `.sheet`, with no `history` at all |
| Level filters and rows (`buildPicker` `app.js:828-925`) | **Today** home screen: start here, reviews due, week, competition countdown — today the app opens straight into a round |
| Review ladder, mastery, suggestion (`app.js:755-823`) | **Competition date + "готовност 61%"**: no data — needs a dates table and a definition |
| Hint after a first miss, `slipOf`, ten-frame (`check()` `app.js:420-432`) | **Mistakes notebook**: grouped by kind of slip, real examples, "Поправи N", "fixed — recheck in a week": rounds don't store the questions |
| Round end, badges (the same 16), parents' stats, CSV, settings | **Competition result table** (per task: answer, points, unanswered ≠ wrong): not stored |
| Competition paper, clock, skip (`compete.js`) | **Weekly card** as an image to share (`navigator.share({files})`) |
| Dark tokens (`app.css:15-35`) | A manual theme switch (`data-theme` is never set); round time for every round (`secs` only for papers) |
| Welcome / first run (`players.js:6-8`, `openEdit`) | Family devices + "synced N min ago", change password: worker has neither (`schema.sql:42`, `worker/index.js:82`) |

Style: new tokens (ground `#F0F4F7`, ink `#0F171F`, accent `#006AC0`, dark `#0E1318`/`#4BAEED`), the
system font for the interface (Nunito goes; it is also hard-coded in 35 places in 19 kinds), Fredoka
for numbers only, **solid content surfaces with glass only on navigation chrome** (the reverse of
`app.css:61-68` today), radii 24/20/12, keys 64 (76 on iPad).

Web-platform facts that shape it (2026): `backdrop-filter` is costly on mobile — keep glass to 2–3
elements a screen, never animate it; **Safari has no `prefers-reduced-transparency`**, so "reduce
transparency → solid" must be an in-app setting; an installed iOS web app has no back button, so the
tabs swap with `replaceState` and only drill-downs push history; same-document View Transitions work in
Safari 18+; fonts must be self-hosted to work offline (both the app and the mock load Google Fonts).

### What goes together (the merges)

1. **One round-format change** — the notebook, the competition table, the parents' examples, the "in
   the notebook" links, round time, the per-shape rating (old B2) and a syncing *curious* badge all need
   the same thing: a compact per-task record in each round, `t: [[level, shape, seed, wrote, ok(1/0/-1),
   pts]]`, plus `secs` always, `redo` naming what it fixed, `whys` moved in. With a **seed per question**
   (the same seeded generator as the checks, A1) a missed task is rebuilt from `(level, seed)` for any
   kind — no rendered text stored, well under the 4 KB `MAX_ROUND`. The answer is stored too, so a task
   whose generator changed since is shown by its numbers, never wrongly.
2. **That makes rounds bigger, so IndexedDB is required, not optional** — ~800 B a round × thousands
   overflows localStorage. B1 (no cap) and the new format are one migration, one sync-format step, one
   worker deploy (with `sessions.last_seen` + device, and `/password`).
3. **The shell is rewritten once, on its final structure**: ES modules (C1) first, then the redesign's
   router and views on them. The audit items E1 (groups by key), E2 (picker), E3 (competition as a mode),
   C4 (level text on its row) and `sync.js` redrawing app screens directly all land inside that rewrite
   instead of being fixed twice.
4. **Kind cleanup (C2) before the restyle**: its `ask()` / `answerLine(unit, size)` helpers replace 259
   inline font-size strings and the hard-coded Nunito, so the new type scale and units ("мин",
   "портокала") apply in one place instead of 165 files.
5. **Paper data files**: pins as seeds (A1), the paper's name in three languages (out of `i18n.js`), its
   **date** (the countdown and readiness) and its tasks — one file per paper, one source.
6. **Style tokens + self-hosted fonts + theme switch + versioned service-worker cache (E4)**: one step —
   new font files must be precached, and the cache name must change for the new look to arrive.
7. **Hint redesign + `slipOf` extended** (swapped digits, wrong sign in a chain — today only plain sums)
   **+ the notebook's categories**: the same code in `questions.js`, one step.

### A framework for the shell — now yes

The shell grows from ~1,900 lines to roughly double: a router, four tab roots, Today, the notebook, a
parents dashboard, the iPad sidebar beside a running round, the weekly card — with the same state
(player, mastery, sync status, round progress) shown in several places at once. Hand-updating those
is where the current code already strains (`COMP ?` at ~20 sites, `sync.js:116-117` redrawing screens).
**Preact + htm + signals, vendored as ES modules (~10 KB), no build step**: components and state for
the shell; kinds untouched — a `<Task>` component sets their HTML. Fallback if a spike disappoints:
plain view functions with one `render()` per view. Decided by R0 on one real screen, not on paper.

## The plan — phases, each step shipped and verified on its own

Not one batch: a data change and a structure change must fail separately. Phase A makes every later step
provably safe: after it, any change to what a child sees fails unless re-recorded on purpose.

### Phase A — safety net — DONE 2026-10-05 (ce91529, 9d5ce51)
- **A1.** Printed tasks replay from seeds in `check/seeds.json` (356 pins); a stale seed fails naming the
  new one, `--repin` records; one real `Math.random` under the harness. check.js 165 s → ~60 s CPU.
  Corrections to the plan: the 39 papers.js pins that never matched exactly are *meant* to accept the same
  question with other numbers (long chains) — they now replay a seed for that match. The seeded generator
  lives in check.js for now; it moves to `js/core.js` with B1, when the app stores a seed per task.
  Paper data files (names, dates, tasks) move to R5, where the countdown needs them.
- **A2.** `check/golden.json`: a hash of everything every level shows (30 seeds, bg + uk, hint, solution,
  options); `--golden` records. Proven to catch a one-word hint change.
- **A3.** All 195 levels get the per-level rules (37 were skipped); exemptions per rule and level with
  reasons (`NOT` in check/levels.js); the level table read as the app loads it (unique ids, d, groups,
  prerequisites exist, no loops, all reachable — the two ordering rules stay with the 57 autumn rows, as
  other papers' groundwork may be harder than what it unlocks); check files and kind files found by name.
  Fixed on the way: Ukrainian hints of 146 and 150.

### Phase B — her data — B1 DONE 2026-10-05 (e780814, live)
- **B1.** Every round in IndexedDB (`js/archive.js`); localStorage keeps settings + the last 400 (small,
  synchronous, a fallback where IndexedDB is missing); the archive merges in before the first question,
  sync waits for it, resets and deletions clear it, old rounds move in on first launch. Each round records
  `t: [level, shape, seed, wrote, 1/0/-1, answer]` per task and `secs` always; `seeded()` is in core.js and
  every question is drawn from a seed. Persistent storage requested when installed. Verified: check.js,
  smoke (450-round log survives a reload, a level learned in its oldest rounds stays learned, task
  records redraw to their answers, a 20-task round < 4 KB), worker tests and the two-device sync smoke.
  Corrections: no worker change was needed (rounds are opaque JSON; worst case ~2.1 KB of 4 KB) — device
  names and /password move to R7 with the screens that show them; `whys` and redo targets move to R6
  (a "why" is opened after the round is saved and synced, so it cannot ride in that round).

### Phase C — structure (each verified by A2)
- **C1. Native ES modules — DONE 2026-10-05 (36b77e0, b6b7911, live).** 176 modules, 288 exports, ~80% of
  top-level names now private. check.js imports the page-free modules for real and gives the checks one
  live `APP` (not 24 pasted copies); app.js puts the names smoke reads on `window`. Corrections: the
  harness was rebuilt on real Node ESM rather than an adapter over concatenated text (it now tests strict
  mode, imports and load order); the cross-file writes were only W, LANG and the competition (setters);
  one load-order bug (sync's first paint reading app.js before it ran) was caught by the two-device sync
  smoke only — compete/sync wiring now runs from startCompete()/startSync() at the end of app.js.
- **C2. Kind cleanup — DONE (532ad53).** 724 do-nothing kind tests gone, 161 headers, answer-line sizes as
  classes (.line.xl/.lg/.md, proven equivalent), one chainLine(). Not done on purpose: figure fonts (a CSS
  rule overrides them), ask()/steps() helpers (classes cover styling), one-line shared slices, merging
  look-alike kinds. Net −975 lines.
- **C3. `template()` for word problems.**
- **D1. Per-shape difficulty — DONE (f90d0c5).** The ratings live on the level row, not the kind (a shape
  name means different things in different generators): 60 levels rate their 192 shapes; check/shapes.js
  fails a shape above its level. Rated twice, blind; only agreed cases acted on: 17, 79, 96, 97, 175, 180 up a
  dot; 197–202 split from 10, 11, 23, 32, 164, 19 with their printed tasks and tags. Seeds record exact (+)
  or same-form (−) matches and must replay the same way.
- **Speed — DONE (1f8530b).** check.js 76 → 7.4 s (UK plural rules made once, arrows pruned, the level check
  in 4 threads sharing its draws with the shape check); smoke 58 → 22 s, with sync 82 → 41 s. E5 done.

### Phase R — the redesign, on the new structure
- **R0. Spike — DONE: Preact + htm it is.** The badges screen as a Preact component (`js/ui/badges.js`, behind
  `?ui=next`), against the hand-built `renderStats` on the same rounds: the same labels, next badge, tiles and
  tap answer (smoke checks it), pixel-identical screenshots, re-render 0.15 ms vs 0.25 ms hand-built. Cost:
  Preact 11.0.0 + hooks + htm 3.1.1 vendored in `js/vendor/` (17 KB, 7 KB gzipped), no build, no import map
  (the hooks' one `"preact"` import points at `./preact.js`), offline through `<link rel="modulepreload">`
  (the service worker caches every href), vendor files `@ts-nocheck`. Code: about the same length for this
  static screen, but no ids, no hand-wired handlers, no `aria-pressed` bookkeeping — the selected badge is
  state. The gain grows with screens that share state (R2: decide @preact/signals there).
- **R1. Look — DONE.** The redesign's tokens light and dark (ground #F0F4F7 / #0E1318, accent #006AC0 /
  #4BAEED, …); content solid (hairline + soft shadow), glass only on the chrome (level pill, round buttons);
  filters and segmented choices a 6% well; the system font for the interface, Fredoka (self-hosted, Latin
  subset, OFL) for numbers; weights down a step (900→700, 800→600); a theme switch (auto/light/dark) and
  "solid, no glass" in the grown-ups' settings, kept per device and applied before the first paint; service
  worker cache versioned (crossing-ten-v2), old caches deleted, no Google Fonts. The Bulgarian letter shapes the
  system font offers (д like g, т like m) are off ("locl" 0) to keep the shapes she has read so far — one CSS
  line to turn on. Verified: before/after screenshots of five screens × iPhone/iPad × light/dark; smoke checks
  the settings survive a reload and the font loads offline.
- **R2. Navigation — DONE (ce78ea2 + this).** Screens have addresses (#/today, #/levels, #/badges, #/parents,
  #/players); back returns to where a screen was opened from (history.state.depth, never out of the app), a
  reload comes back to its screen, the route is kept in memory (Chrome drops history changes past a few hundred
  in seconds). Tabs (Днес · Нива · Значки · Родители): a floating glass bar on a phone, a sidebar ≥ 900 px; only
  on those four, the round has the screen to itself. Today (js/ui/today.js, Preact): hello, streak, rounds
  today, the round to go back to, start here, the levels due again, the practice paper. Launch: a round left
  unfinished goes on, else Today. The play view's progress button became Home. Signals not needed yet: each
  screen draws again when shown. Left for R5: the countdown + readiness (paper dates), the iPad two-column Today.
- **R3a. Play view — DONE.** One segment a task (green/red kept: she sees which she missed) with "Задача N от M" and
  "N верни подред" under it; a miss stays in its box struck through until the next digit; a phone upright hides
  the keys behind the hint, "Опитвам пак" brings them back (iPad keeps them beside it); `slipOf` names swapped
  tens and ones. Hints already used her numbers. Moved: the iPad level list beside the task → R4 (it needs R4's
  shared row); chain-sign slips → R6 (chains are kinds, slips there come with the notebook's categories).
- **R3b. Competition play — DONE.** Each task names its group and shows its points as a chip; a choice waits for
  "Напред" (she may change it), a typed answer goes on with ✓; ✕ replaces Home and stops the paper after a confirm
  (what is answered counts, the rest is unanswered); the end has a task-by-task table (✓ / избра Б → В / 24 → 42 /
  без отговор, points) with its legend, and the best paper before this one or a new record; "Погледни пак" lists
  wrong answers only; the redo pads from the paper's own levels (was: the level picked before it). Smoke plays a
  paper through Next and stops a second one with ✕. Not done: an iPad-wide two-column result (R7, round end).
- **R4. Levels page** (E1, E2, C4): one row renderer shared with the sidebar; groups keyed by `grp`;
  collapsed groups; status as %; level text from its row.
- **R5. Today**: start here, `dueList()` of every review due, week numbers, countdown + readiness % (from
  paper dates; readiness = the focus's levels learned, weighted by how often papers ask them).
- **R6. Notebook**: from per-task records — slips grouped, examples rebuilt from seeds, "Поправи N"
  practises those very tasks, fixed → recheck in a week.
- **R7. Round end, Badges, Parents (+ per-shape report, old D2), ParentsMore (grade moves here), Players
  (devices, last sync), Welcome.**
- **R8. Weekly card**: SVG → canvas → PNG, `navigator.share({files})` built before the tap (iOS user
  activation), download fallback; a parent's action, name optional.
- smoke.js is rewritten alongside R2–R7, screen by screen.

### Phase E — as kinds grow
- **E5.** check.js level loop on worker threads; smoke split across tabs, per-level timeout (#17).

### Decisions for you (defaults in bold)
- Framework for the shell: **Preact + htm, if R0 confirms**; else plain view functions.
- The mock drops mute, stats and read-aloud from the task screen: **keep read-aloud in the pill's menu,
  mute in settings**.
- The mock drops "Покажи решението" after a miss: **keep it, under the hint**.
- Launch: **Today** (the mock) instead of straight into a round (today) — a saved round still resumes.

### Triggers, not tasks
- Deploy-time bundle: when a phone shows a slow start or kinds pass ~400.
- Cross-family difficulty (Elo): at ~500 families, from B1's per-task records — privacy notice, parental
  consent and "delete my data" first.

### Dropped
Moving hosting off GitHub Pages; a sync engine; Vitest/Playwright/fast-check; a hand rewrite of the kinds;
a framework for the kinds; SVG-filter "real" liquid glass (Safari can't, and it costs frames).

### Order
A1 → A2 → A3 → B1 (before November; stopgap first if late) → C1 → C2 → D1 → R0 → R1 → R2 → R3 → R4 →
R5 → R6 → R7 → R8 → C3 and E5 when they bite.
