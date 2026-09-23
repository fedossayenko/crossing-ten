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
| `app.css` | all styling: the glass look of the design canvas, light and dark |
| `kinds/<kind>.js` | one question kind each: its generator, how it is drawn, its summary line and its hints |
| `js/levels.js` | the level table: difficulty, group, prerequisites, and which generator makes it |
| `js/core.js` | what more than one kind shares (`rnd`, the answer box, a few drawing helpers) |
| `js/questions.js` | the plain sums, and the dispatch from a level to its kind |
| `js/players.js` | who is playing, and where each player's rounds are kept |
| `js/i18n.js` | every word of the interface in Bulgarian, Ukrainian and English |
| `js/mascots.js` | the cat, fox, owl and bunny: one shared face, each animal only its fur |
| `js/app.js` | the page: rounds, keypad, mascot, progress, picker, players, storage |
| `js/sync.js` | sync between devices through the Worker, by family account |
| `worker/` | the sync server: a Cloudflare Worker (`index.js`) and its D1 tables (`schema.sql`) |
| `sw.js` | serves the latest build, falls back to the cache offline |

Everything is a classic script sharing one global scope, loaded in the order the
`<script>` tags list them, so a kind can use anything in `js/core.js`. To add a level:
write `kinds/<kind>.js`, list it in `index.html` before `js/questions.js`, add its row
to `js/levels.js`, and add a check to `check.js`.

`node build-artifact.js` folds everything back into one `artifact.html` for the Claude
artifact copy, which cannot load files beside it.

## Players, languages and mascots

Tap the mascot to see who is playing. Each player has a name, one of four mascots and
an interface language (Bulgarian by default). Task text comes in Bulgarian or Ukrainian;
an English player gets the Bulgarian, the language of the worksheets. Only the very first
launch on a device asks who is playing; after that the app opens straight on the exercise.

Every player's rounds live under her own storage key. The first player keeps the key
the app always used, so everything played before there were players is hers without
moving anything. The mascots share one face, so the moods (idle, happy, sad, nod,
tilt, wiggle, dance, party) move any of them; a new animal is only its fur in
`js/mascots.js` and a name in each language.

## Explanations

After a first miss she gets the method, never the answer. For a sum that crosses a ten,
the hint comes with two ten-frames showing the crossing step: adding fills the first ten
and spills into the second; taking away borrows a ten and crosses the ones out of it.

What she typed is read for the classic slips — a borrowed ten never taken off the tens,
the small ones digit taken from the big one, a carried ten dropped, the wrong sign, one
off. A real misconception is named in the hint straight away ("did you take the ten off
the tens?"); the end-of-round sheet shows what she wrote and what it most likely was, and
each round records its slips for the grown-ups.

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

The GitHub copy keeps each player's rounds in that browser's local storage — per
device, not synced until a family account is logged in. The very first launch on a device
asks for the player's name, mascot and language (or logs in to a family that already plays
elsewhere). On an iPhone or iPad, the home-screen icon and a Safari tab keep **separate**
storage, so each one logs in on its own.

### Sync

**For grown-ups → Log in** (or, on a new device's welcome screen, *We already play on
another device*): a family name and a password of 8+ characters. **Create a family account**
the first time, **Log in** on every other device. From then on the devices sync on
launch, after every round and whenever the app comes back to the screen; it all still
works offline and catches up later. A device that synced by the old family code keeps its
data: creating the account there turns that family into the account's.

The server is a Cloudflare Worker with one D1 database (`worker/`), free tier. Passwords
are PBKDF2-SHA-256 (30 000 rounds, the most the free plan's ~10 ms of CPU allows; the count
is stored per account) and five wrong ones in a row lock the account for 15 minutes. A login
hands the device a random session token, kept on the server only as its SHA-256; **Log out**
ends that one session. Google sign-in uses the OAuth web client in the Google Cloud project `crossing-ten-95850`
(`GOOGLE_ID` in `js/sync.js`, `GOOGLE_CLIENT_ID` in `worker/wrangler.toml`; it is in Testing
mode, so only its listed test users can use it). The
Worker checks Google's signature and keeps only the account's stable id, never its email.

Rounds are events with ids, so merging is a set union and nothing can conflict; players are
last-edit-wins; a reset or a deleted player travels to the other devices too. The server
holds nothing but nicknames, mascots, languages and answer logs. `node worker/test.js`
checks the server (against `wrangler dev`, which reads a stand-in Google key from
`worker/.dev.vars`, or the deployed URL, where it deletes its test accounts afterwards);
`SMOKE_SYNC=<worker url> node smoke.js` runs two real browser "devices" through it.
The artifact copy keeps using its own database.

### For the grown-ups

Under Progress: first try by group over the last 30 days, the slips that keep coming
back, and **Download all rounds (CSV)**.

The Claude artifact copy syncs on its own through the artifact database, so if both
devices open the artifact link rather than the Pages one, no account is needed.
