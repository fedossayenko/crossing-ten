# Greenfield review — what to change, checked against this code (2026-10-05)

The question was: built from scratch in October 2026, how would Crossing Ten be built? Each
idea from that research was checked against the code and the live data before it got a step here.

## The ideas, checked

| Idea | What the code / data says | Verdict |
|---|---|---|
| Seeded random, pins replay a seed | A pin searches up to 3e6 random draws for its printed task. Timed: check.js is 165 s of CPU, and 115 s of it is pins (papers.js 62 s, grade1.js 53 s). (The 13-minute runs were the machine being busy, at 31% CPU — not the checks.) Prototype: a seeded `Math.random` in the check scope found Пролет 2022 task 20 at seed 87 in 1 ms and replays it exactly. No kind file changes: all 1,273 random call sites in `kinds/` go through `Math.random` or `rnd`. | **Do** — step 1 |
| Rate each shape, not each level | A round logs `seen`/`missed` as `factKey` = `'w:' + kind` — no shape. So the 156/196 mix-up (an easy level hiding the paper's hardest task) can't be seen in the data. | **Do** — steps 2, 3 |
| Elo / FSRS adaptive engine (Math Garden) | Math Garden calibrates on 400,000 children. Here: 136 synced rounds, one learner. Too little data to estimate item difficulty; `mastery()` and `weightsFrom()` already do the per-learner part. | **Drop for one family**; becomes worth it at ~500 families (see below). |
| Ask the browser to keep storage | `navigator.storage.persist()` is never called. Sync already backs the rounds up to D1, so this only guards an offline-only device. | **Do** — step 4, one line |
| One Cloudflare Worker for app + API instead of GitHub Pages | Moving changes the origin: the installed home-screen app and its localStorage stay on the old address, the family re-installs and signs in again. Pages is free and works. | **Drop**, unless the domain changes anyway |
| Svelte / Preact, Vite | See *A framework?* below: it would touch the 1,900-line shell, not the 11,600 lines of task types that grow. | **Drop for now**; the shell only, if it grows |
| Vitest / Playwright / fast-check | `check.js` + `smoke.js` already do brute force, pins and a full headless play-through, and pass. Porting 6,000 lines of checks buys nothing new. | **Drop** |
| A sync engine (Zero, PowerSync, ElectricSQL) | Rounds are append-only, deduped by (family, player, id) — conflict-free by design. Zero 1.0 can't even write offline. | **Drop** |
| Questions as data, drawing separate | 165 kind files draw HTML strings. A split costs a rewrite of every kind; nothing planned needs it. | **Later**, only if a feature needs it (printing worksheets, a new UI) |

## At 500–1,000 task types (165 today)

Pace: the 165 kind files were added in 2 weeks (51 on 2026-09-23, 38, 38, 11, 27), so 500–1,000 is months
away, not years. Measured today:

| | Today (165 kinds) | At 1,000 kinds | Verdict |
|---|---|---|---|
| Code that grows | `kinds/` 11,627 lines (~70 a kind): generators 28%, drawing 20%, hints/solutions 19%, summary lines 6%, helpers and constants 26%. The shell (app, compete, players, sync, index.html) is 1,900 lines and does not grow with kinds. | ~70,000 lines of kinds | The format — one file per kind, `gen` + `draw` + `eq` + `why`, both languages via `tr` — holds; no reason to rewrite it |
| One global scope | 1,104 top-level names in kinds. Only **6** are shared between kinds, 190 are read by `js/` (mostly `gen:` in levels.js), 35 only by checks — **874 (79%) are private to their file** | ~6,700 globals, every helper needing a unique name | **Fix now, by script**: each kind file in its own scope, exporting only what others read (step 5) |
| Checks far from the kind | `check/kinds.js` is one 1,541-line file | ~10,000 lines | Move a kind's check beside it when touched; no big-bang move |
| Pins search random draws | 115 s of check.js's 165 s | grows fastest | Step 1 (seeded pins) |
| Finding an existing kind before adding one | grep over 165 names (`pairs`/`pairsum`, `seg`/`segcount`/`segpts`/`segword`, `cross`/`crossmin`/`eqcross`) | grep over 1,000 | A generated catalog: kind → levels, papers, one sample question (step 6) |
| Question fields untyped | `[field: string]: any` in `types.d.ts` | more typos possible | check.js samples every level and checks answer, worked line and summary agree — runtime catches what types don't. Optional JSDoc type per kind, for new kinds |
| Loading | 175 script tags, compiled lazily in 9 ms | ~1,000 files, ~6 MB (~1.7 MB gzipped) on install | Fine; concatenate at deploy only if a phone shows a slow start |
| Picking a level | paper / grade chips | ~300 levels a grade | search or collapsed groups when it gets there |

### Rewrite the 165 task types now, before 1,000?

No full rewrite: the measured problems are structural, not in the task code, and every one can be done by a
script now — six times cheaper at 165 than at 1,000. A hand rewrite would retype ~11,600 lines of tasks
that are pinned to the official keys, for no change a child would see, and risk those pins.

### A framework?

A framework (Svelte, Preact, React) is for screens that change with state: lists, forms, navigation. Here
that is the 1,900-line shell. The task types — the 86% of the code that grows — draw static HTML once per
question; their `draw` code would be about as long in JSX or Svelte, and the checks that run every kind
in plain Node (no browser) would need a framework renderer. Costs: a build step, npm dependencies to
upgrade, hashed bundles for the service worker. It gets worth it if the **shell** grows — a parent
dashboard, a class/teacher view, a worksheet printer — or if tasks become interactive (drag, tap a
figure). Then: Preact or Svelte for the shell only; kinds keep returning HTML.

### The history cap (found on the way, separate from task types)
Only the last 400 rounds are kept (`saveLocal`, `keepRounds`), and *learned*, reviews and badges are all
recomputed from them. 136 rounds in 14 days (since 2026-09-21) reaches 400 around **early November 2026**;
then early levels stop being *learned*, reviews restart and some badges can disappear.

### Step 0 — keep her whole history (do first, before ~2026-11-01)
1. Raise the cap from 400 to 5,000 rounds in `saveLocal` and `keepRounds`: 5,000 × 246 B ≈ 1.2 MB a player,
   inside localStorage's ~5 MB with two players. `// ponytail: ~1.5 years at 10 rounds a day; move rounds
   to IndexedDB before that.`
2. A check: 1,000 synthetic rounds through `keepRounds` keep every level's mastery and every badge.
3. Nothing is lost yet (136 < 400), and the server keeps every round: a new device pulls them all from
   cursor 0, in pages (`worker/index.js`). A device that already dropped rounds would not re-fetch them
   (its cursor has moved on) — one more reason to do this before November.

## Step by step, not one batch

Each step is small, ships on its own and is verified alone (tsc, check.js, smoke.js); none depends on
another's code. One batch would mix a test-harness change with a data-format change and make a failure
hard to place.

### Step 1 — seeded pins (check.js only, the app is untouched)
1. In `check.js`'s `head`, replace the counting `Math.random` with a seeded PRNG (mulberry32) plus
   `SEED(n)`; keep the draw counter.
2. `pin(name, id, q, key, shows, seed)`: seed, draw once, compare. If the seed no longer gives the task
   (a generator's draw order changed), search as today and fail with
   `"<name>: seed stale, the task is now at seed N"` — the check never passes silently, the fix is a
   one-number edit.
3. Convert the pins in `check/grade1*.js`, then `check/papers.js` (its signature/mask search keeps its
   "like" fallback message).
4. Expect check.js ≈ 50 s CPU instead of 165 s. Nothing is weakened: the same exact JSON identity.

### Step 2 — log the shape of each task
1. A round gets `shapes: S.qs.map(q => q.kind ? q.kind + ':' + (q.shape ?? '') : '')`, beside `seen`.
2. `factKey` stays as it is: `weightsFrom()` reads old rounds by it, changing it would reset her weights.
3. The worker stores the round body as opaque JSON — no worker or schema change. smoke.js asserts the field.

### Step 3 — a shape report (after ~2 weeks of step-2 data)
1. In the stats view (or `node report.js`, reading D1 read-only): first-try rate per level and shape.
2. Flag a shape well below the rest of its level (e.g. < 50% when the level is > 80%): that is a
   mis-rated shape — split it into its own level, as 196 was split out of 156.

### Step 4 — persistent storage
1. On start: `navigator.storage?.persist?.()`; no UI, no effect where unsupported.

### Step 5 — one scope per kind file (a script, not a rewrite)
1. A script wraps each `kinds/*.js` in `(() => { 'use strict'; … })();` and ends it with
   `KIND.x = { draw, eq, why, gens: { genX, … } }` — exporting only the names `js/`, checks or another kind
   read (found by the same scan that counted them: 190 + 35 + 6).
2. `js/levels.js`'s `gen: genBowl` → `gen: GEN.genBowl` (`GEN` gathered from every `KIND.x.gens`);
   checks read the same `GEN`. The 6 shared helpers move to `js/core.js`.
3. No task's text, numbers or draw order changes: check.js pins and smoke.js prove it.
4. AGENTS.md: a new kind keeps its helpers inside its scope.

### Step 6 — a kind catalog
`node sample.js --catalog > KINDS.md`: each kind, its levels and papers, one sample question. Search it
before adding a kind.

### Order
0 (history cap, before November) → 1 (seeded pins) → 5 (scopes) → 2 + 4 → 6 → 3 (after data).

### Not planned
The dropped rows above. Revisit "questions as data" only when a feature needs it.
