# Greenfield review — what to change, checked against this code (2026-10-05)

The question was: built from scratch in October 2026, how would Crossing Ten be built? Each
idea from that research was checked against the code and the live data before it got a step here.

## The ideas, checked

| Idea | What the code / data says | Verdict |
|---|---|---|
| Seeded random, pins replay a seed | A pin searches up to 3e6 random draws for its printed task. Timed: check.js is 165 s of CPU, and 115 s of it is pins (papers.js 62 s, grade1.js 53 s). (The 13-minute runs were the machine being busy, at 31% CPU — not the checks.) Prototype: a seeded `Math.random` in the check scope found Пролет 2022 task 20 at seed 87 in 1 ms and replays it exactly. No kind file changes: all 1,273 random call sites in `kinds/` go through `Math.random` or `rnd`. | **Do** — step 1 |
| Rate each shape, not each level | A round logs `seen`/`missed` as `factKey` = `'w:' + kind` — no shape. So the 156/196 mix-up (an easy level hiding the paper's hardest task) can't be seen in the data. | **Do** — steps 2, 3 |
| Elo / FSRS adaptive engine (Math Garden) | Math Garden calibrates on 400,000 children. Here: 136 synced rounds, one learner. Too little data to estimate item difficulty; `mastery()` and `weightsFrom()` already do the per-learner part. | **Drop.** A per-shape success report (step 3) is the version that fits one child. |
| Ask the browser to keep storage | `navigator.storage.persist()` is never called. Sync already backs the rounds up to D1, so this only guards an offline-only device. | **Do** — step 4, one line |
| One Cloudflare Worker for app + API instead of GitHub Pages | Moving changes the origin: the installed home-screen app and its localStorage stay on the old address, the family re-installs and signs in again. Pages is free and works. | **Drop**, unless the domain changes anyway |
| Svelte / Preact, Vite, ES modules | `app.js` is 1,127 lines; no-build is a feature (open the file, it runs). The one ES-module win, unique global names, check.js already enforces. | **Drop** |
| Vitest / Playwright / fast-check | `check.js` + `smoke.js` already do brute force, pins and a full headless play-through, and pass. Porting 6,000 lines of checks buys nothing new. | **Drop** |
| A sync engine (Zero, PowerSync, ElectricSQL) | Rounds are append-only, deduped by (family, player, id) — conflict-free by design. Zero 1.0 can't even write offline. | **Drop** |
| Questions as data, drawing separate | 165 kind files draw HTML strings. A split costs a rewrite of every kind; nothing planned needs it. | **Later**, only if a feature needs it (printing worksheets, a new UI) |

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

### Not planned
The dropped rows above. Revisit "questions as data" only when a feature needs it.
