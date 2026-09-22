# Crossing Ten

Arithmetic practice for a Bulgarian grade-2 pupil, built around the olympiad
worksheets she is working through. One self-contained `index.html`; no build step,
no dependencies. `node check.js` verifies every generator.

- Live: https://fedossayenko.github.io/crossing-ten/
- On an iPad or iPhone: open it in Safari, then Share → Add to Home Screen.

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
- **Numbers and digits** — place value, digits standing in for numbers, arranging digits, multiples
- **Sequences** — find the rule, fill the gaps
- **Find the value** — an unknown recovered from what is given
- **Word problems** — a story to turn into arithmetic
- **Shapes and lines** — lengths, perimeters, grids, points on a line

## The training path

The picker opens with one recommendation — *Start here*, then *Next up* — and a bar
showing how many of the 44 are learned.

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
  than mixing them, and is duller. This keeps the longest single-group run to four.

`node check.js` walks the whole path from nothing learned and fails if it cannot
reach every level, suggests something before its groundwork, steps back in
difficulty, or grinds one group more than four times running.

## Checks

`node check.js` generates thousands of questions per level and verifies the answer,
the worked line, the summary line and the layout agree, plus targeted checks that
compare a closed form against a brute-force search wherever one is used, and pin the
original worksheet instance of each task.

## Progress storage

The GitHub copy keeps her rounds in that browser's local storage — per device, not
synced. The twenty rounds she played while this lived as a Claude artifact are carried
across once per device by a seed in the page; rounds carry ids, so nothing is
duplicated.
