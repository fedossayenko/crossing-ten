# Crossing Ten

Arithmetic practice for a Bulgarian grade-2 pupil, built around the olympiad
worksheets she is working through. Plain HTML, CSS and scripts; no build step, no
dependencies. `node check.js` verifies every generator, `node smoke.js` plays every
level in Chrome.

- Live: https://fedossayenko.github.io/crossing-ten/
- On an iPad or iPhone: open it in Safari, then Share → Add to Home Screen.

## Where things live

| Path | What it holds |
|---|---|
| `index.html` | the markup, and the scripts in the order they load |
| `app.css` | all styling |
| `kinds/<kind>.js` | one question kind each: its generator, how it is drawn, its summary line and its hints |
| `js/levels.js` | the level table: difficulty, group, prerequisites, and which generator makes it |
| `js/core.js` | what more than one kind shares (`rnd`, the answer box, a few drawing helpers) |
| `js/questions.js` | the plain sums, and the dispatch from a level to its kind |
| `js/app.js` | the page: rounds, keypad, cat, progress, picker, storage, sync |
| `sw.js` | serves the latest build, falls back to the cache offline |

Everything is a classic script sharing one global scope, loaded in the order the
`<script>` tags list them, so a kind can use anything in `js/core.js`. To add a level:
write `kinds/<kind>.js`, list it in `index.html` before `js/questions.js`, add its row
to `js/levels.js`, and add a check to `check.js`.

`node build-artifact.js` folds everything back into one `artifact.html` for the Claude
artifact copy, which cannot load files beside it.

## How difficulty is assigned

Each level carries `d: 1…5`, shown as five dots in the picker. The rating comes from
a five-part rubric, scored 0–2 each and totalled out of 10:

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| **Operations** | one | two | three, or a running chain |
| **Reading** | symbols only | a sentence | a long sentence with a negation, comparison or condition |
| **Search** | compute it directly | try a few possibilities | enumerate systematically, or find the only/best case |
| **Numbers** | within 20 | within 100 | beyond 100, or many terms |
| **Trap** | none | one easy-to-miss detail | the task *is* the trap — two answers, a negation, double counting |

Total 0–1 → 1 dot, 2–4 → 2, 5 → 3, 6–7 → 4, 8–10 → 5.

Reading and Numbers are measured from the generators (question length, the ninetieth
percentile of the numbers involved); the other three are judged. A purely measured
score was tried first and rejected: it rates `Четири карти` as easy because its worked
line is a single subtraction, when the task is a search through twenty-four
arrangements.

**This rating is a prior, not a verdict.** The picker also shows her real first-try
rate per level, which is the honest measure; when the two disagree, believe the data.

## How levels are grouped

Take away, Add and Both keep their designed ladder order — they are a progression,
not a topic. Everything from the worksheets is grouped by what you have to *do*, and
sorted easiest first inside each group:

- **Chains** — long ± runs, runs that simplify by grouping, and runs whose signs you choose
- **Counting** — how many numbers, sums, ways or days fit a condition
- **Numbers and digits** — place value, digits standing in for numbers, arranging digits, multiples, sudoku
- **Sequences** — find the rule, fill the gaps
- **Find the value** — an unknown recovered from what is given
- **Word problems** — a story to turn into arithmetic
- **Shapes and lines** — lengths, perimeters, grids, points on a line

## The training path

The picker opens with one recommendation — *Start here*, then *Next up* — and a bar
showing how many of the 57 are learned.

- **Learned** means at least four in five right first try, over at least fifteen
  questions — so a single round is never enough evidence on its own.
- **It suggests breadth first, then repair.** While levels remain that she has never
  tried, it offers the easiest of those. Once she has met them all, it switches to
  whichever is going worst — by its record, and then by how the last round went.
- **Prerequisites** are declared only where a level genuinely builds on another
  (`42 − 17` after `42 − 7`, `Оцветени` after `Правоъгълници`, `Плодове` after `6 − ◯`).
  Difficulty handles the rest of the ordering.
- **It recommends, it never locks.** Every level stays tappable. Gating content is
  demotivating, and she may simply want the fun ones.
- **Variety beats grinding.** Among levels tied on difficulty, one from a different
  group than the last is preferred — six geometry levels in a row sticks less well
  than mixing them, and is duller. When nothing at that difficulty comes from another
  group, it will pull a level one step harder forward instead. This keeps the longest
  single-group run to three.

`node check.js` walks the whole path from nothing learned and fails if it cannot
reach every level, suggests something before its groundwork, drops more than one step
in difficulty, ends easier than it started, or grinds one group more than four times
running.

## Checks

`node smoke.js` opens the page in headless Chrome (twice, so the second load goes
through the service worker), plays one round of every level through the real picker
and keypad, missing the first question twice to reach the hint and the reveal, and
fails on any script error. `node smoke.js artifact.html` does the same for the
single-file build.

`node check.js` generates thousands of questions per level and verifies the answer,
the worked line, the summary line and the layout agree, plus targeted checks that
compare a closed form against a brute-force search wherever one is used, and pin the
original worksheet instance of each task.

## Progress storage

The GitHub copy keeps her rounds in that browser's local storage — per device, not
synced. The twenty rounds she played while this lived as a Claude artifact are carried
across once per device by a seed in the page; rounds carry ids, so nothing is
duplicated.

To move progress from one device to another, open **Progress → Copy** on the device
that has the history, then **Paste** on the other. The whole log is gzipped into a
link; pasting it (or opening it) merges it in — rounds already there are skipped,
because every round carries an id. A full 400-round log comes to about 6 000
characters. Nothing leaves the two devices; there is no server behind the Pages build.

On an iPhone or iPad, the home-screen icon and a Safari tab keep **separate** storage:
play from one of them, and copy from the one she played on.

The Claude artifact copy syncs on its own through the artifact database, so if both
devices open the artifact link rather than the Pages one, no transfer is needed.
